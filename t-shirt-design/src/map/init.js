import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

class Map {
    constructor() {
        this.dom = null;
        this.scene = null;
        this.renderer = null;
        this.controls = null;
        this.patternTexture = null;
    }

    init (dom) {
        this.dom = dom;
        this.scene = new THREE.Scene();
        this.scene.add(mesh);

        const axesHelper = new THREE.AxesHelper(500);
        this.scene.add(axesHelper);

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(500, 400, 300);
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        const width = window.innerWidth;
        const height = window.innerHeight;

        const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
        camera.position.set(0, 500, 500);
        camera.lookAt(0, 0, 0);
        this.camera = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer = renderer;
        renderer.setSize(width, height);

        const render = () => {
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }

        render();

        dom.append(renderer.domElement);

        window.onresize = function () {
            const width = window.innerWidth;
            const height = window.innerHeight;

            renderer.setSize(width, height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        const controls = new OrbitControls(camera, renderer.domElement);



        this.bindClick(); // 绑定点击事件
    }


    bindClick () {
        const loader = new THREE.TextureLoader();

        const width = window.innerWidth;
        const height = window.innerHeight;


        this.renderer.domElement.addEventListener('click', (e) => {
            const texture = this.patternTexture || loader.load('./heart.png');
            texture.colorSpace = THREE.SRGBColorSpace;

            const y = -((e.offsetY / height) * 2 - 1);
            const x = (e.offsetX / width) * 2 - 1;

            const rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

            const intersections = rayCaster.intersectObjects(mesh.children);

            if (intersections.length) {
                console.log(intersections, 'intersections');
                const position = intersections[0].point;

                const orientation = new THREE.Euler();
                const size = new THREE.Vector3(100, 100, 100);
                const geometry = new DecalGeometry(intersections[0].object, position, orientation, size);
                const material = new THREE.MeshPhongMaterial({
                    polygonOffset: true,
                    polygonOffsetFactor: -4,
                    map: texture,
                    transparent: true,
                });
                const mesh = new THREE.Mesh(geometry, material);
                this.scene.add(mesh);
            }

        });
    }

    changeTShirtColor (color) {
        const tshirt = this.scene.getObjectByName('tshirt');
        if (tshirt) {
            tshirt.material.color.set(color);
        }
    }

    changePattern (imgUrl) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(imgUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        this.patternTexture = texture;
    }


    downloadBlob (blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadImg () {
        this.renderer.render(this.scene, this.camera);
        this.renderer.domElement.toBlob((blob) => {
            if (blob) {
                this.downloadBlob(blob, 'design.png');
            }
        }, "image/png");
    }
    downloadVideo () {
        const stream = this.renderer.domElement.captureStream(60);
        const recorder = new MediaRecorder(stream);
        recorder.start();
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.downloadBlob(event.data, `design.webm`);
            }
        };
        setTimeout(() => {
            recorder.stop();
        }, 3000);
    }


}

export default new Map();




