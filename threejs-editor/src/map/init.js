import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { useThreeStore, MeshTypes } from '@/store/index.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

class Map {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.orbitControls = null;
        this.outlinePass = null;
        this.transformControls = null;
    }

    init (dom) {
        this.scene = new THREE.Scene();
        const scene = this.scene;


        const axesHelper = new THREE.AxesHelper(500);
        scene.add(axesHelper);

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(500, 400, 300);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

        const width = dom.clientWidth;
        const height = dom.clientHeight;

        const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
        this.camera = camera;
        camera.position.set(500, 500, 500);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer = renderer;
        renderer.setSize(width, height);

        const composer = new EffectComposer(renderer);

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
        const outlinePass = new OutlinePass(v, scene, camera);
        outlinePass.pulsePeriod = 1;
        this.outlinePass = outlinePass;
        composer.addPass(outlinePass);

        const gammaPass = new ShaderPass(GammaCorrectionShader);
        composer.addPass(gammaPass);

        const transformControls = new TransformControls(camera, renderer.domElement);
        this.transformControls = transformControls;
        const transformHelper = transformControls.getHelper();
        scene.add(transformHelper);

        function render (time) {
            composer.render();
            // renderer.render(scene, camera);
            transformControls.update(time);
            requestAnimationFrame(render);
        }



        function render (time) {
            composer.render();
            // renderer.render(scene, camera);
            requestAnimationFrame(render);
        }


        render();

        dom.append(renderer.domElement);

        window.onresize = function () {
            const width = dom.clientWidth;
            const height = dom.clientHeight;
            renderer.setSize(width, height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix(); // 更新投影矩阵
        };

        const orbitControls = new OrbitControls(camera, renderer.domElement);
        this.orbitControls = orbitControls;
        orbitControls.enabled = true;

        // scene.add(axesHelper);
        const gridHeper = new THREE.GridHelper(1000);
        scene.add(gridHeper);


        this.renderMeshArr();  // 渲染meshArr

        this.addClickEvent();

        this.addKeyDownEvent();

        this.addTransformEvent();

    }


    renderMeshArr () {
        const threeStore = useThreeStore();
        threeStore.meshArr.forEach(item => {
            if (item.type === MeshTypes.Box) {
                const { width, height, depth, material: { color }, position } = item.props;
                let mesh = this.scene.getObjectByName(item.name);

                if (!mesh) {
                    const geometry = new THREE.BoxGeometry(width, height, depth);
                    const material = new THREE.MeshPhongMaterial({
                        color
                    });
                    mesh = new THREE.Mesh(geometry, material);
                }

                mesh.name = item.name;
                mesh.position.copy(position)
                this.scene.add(mesh);
            } else if (item.type === MeshTypes.Cylinder) {
                const { radiusTop, radiusBottom, height, material: { color }, position } = item.props;
                let mesh = this.scene.getObjectByName(item.name);

                if (!mesh) {
                    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height);
                    const material = new THREE.MeshPhongMaterial({
                        color
                    });
                    mesh = new THREE.Mesh(geometry, material);
                }
                mesh.name = item.name;
                mesh.position.copy(position)
                this.scene.add(mesh);
            }
        })

    }

    addClickEvent () {
        // 监听点击事件
        this.renderer.domElement.addEventListener('click', (e) => {
            const y = -((e.offsetY / this.renderer.domElement.clientHeight) * 2 - 1);
            const x = (e.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;

            const rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

            const objs = this.scene.children.filter(item => {
                return item.name.startsWith('Box') || item.name.startsWith('Cylinder')
            })
            const intersections = rayCaster.intersectObjects(objs);

            const threeStore = useThreeStore();
            if (intersections.length) {
                const obj = intersections[0].object;
                //   obj.material.color.set('green');
                this.outlinePass.selectedObjects = [obj];
                threeStore.setSelectedObj(obj);
                this.transformControls.attach(obj);
            } else {
                this.outlinePass.selectedObjects = [];
                threeStore.setSelectedObj(null);
                this.transformControls.detach();
            }

        });
    }

    addKeyDownEvent () {
        window.addEventListener('keydown', (e) => {
            const threeStore = useThreeStore();
            console.log(e.key, threeStore.selectedObj);
            if (e.key === 'Backspace' && threeStore.selectedObj) {
                const mesh = this.scene.getObjectByName(threeStore.selectedObj.name);
                // console.log(mesh);
                // 从场景中移除
                this.scene.remove(mesh);
                // 从store中移除
                threeStore.removeMesh(threeStore.selectedObj.name);
                // 清空outlinePass中的选中对象
                this.outlinePass.selectedObjects = [];
                // 清空store中的选中对象
                threeStore.setSelectedObj(null);
            }
        });
    }

    addTransformEvent () {
        this.transformControls.addEventListener('change', (e) => {
            const threeStore = useThreeStore();
            const obj = this.transformControls.object;
            if (!obj) return

            threeStore.updateMeshPosition(obj.name, obj.position);
        })

        this.transformControls.addEventListener('dragging-changed', (e) => {
            this.orbitControls.enabled = !e.value;
        })
    }

}

export default new Map()
