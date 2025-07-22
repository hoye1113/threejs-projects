import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

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
        // this.scene.add(axesHelper);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);// 主光源
        directionalLight.position.set(-100, 1000, 0);
        directionalLight.lookAt(0, 0, 0);

        directionalLight.castShadow = true; // 开启阴影 阴影投射
        directionalLight.shadow.camera.left = -800;// 阴影相机 左
        directionalLight.shadow.camera.right = 800;// 阴影相机 右
        directionalLight.shadow.camera.top = 500;// 阴影相机 上
        directionalLight.shadow.camera.bottom = -500;// 阴影相机 下
        directionalLight.shadow.camera.near = 0.5;// 阴影相机 近
        directionalLight.shadow.camera.far = 2000;// 阴影相机 远


        // const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        // this.scene.add(cameraHelper);



        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff);// 环境光 
        this.scene.add(ambientLight);

        const width = window.innerWidth;
        const height = window.innerHeight;

        const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
        camera.position.set(1200, 500, 0);
        camera.lookAt(0, 100, 0);
        this.camera = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer = renderer;
        renderer.setSize(width, height);
        renderer.setClearColor('lightblue');
        renderer.shadowMap.enabled = true;


        const css3Renderer = new CSS3DRenderer();
        css3Renderer.setSize(width, height);

        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = '0px';
        div.style.top = '0px';
        div.style.pointerEvents = 'none';

        div.appendChild(css3Renderer.domElement);
        css3Renderer.domElement.style.position = 'absolute';
        css3Renderer.domElement.style.left = '0px';
        css3Renderer.domElement.style.top = '0px';
        css3Renderer.domElement.style.pointerEvents = 'none';

        div.appendChild(this.renderer.domElement);
        document.body.appendChild(div);

        const render = () => {
            renderer.render(this.scene, camera);
            css3Renderer.render(this.scene, camera);

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



    }




}

export default new Map();




