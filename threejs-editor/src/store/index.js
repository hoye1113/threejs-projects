import { defineStore } from "pinia";
import { ref } from "vue";
import mapApp from "@/map/init";

export const useThreeStore = defineStore('threeStore', () => {
    // 使用ref定义响应式状态
    const meshArr = ref([
        {
            id: 1,
            type: 'Box',
            name: 'Box1',
            props: {
                width: 100,
                height: 200,
                depth: 200,
                geometry: {
                    type: 'BoxGeometry',
                },
                material: {
                    type: 'MeshPhongMaterial',
                    color: '#ffa500',
                },
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                }

            }
        }
    ]);


    // 存储场景对象
    const scene = ref(null)
    function setScene (obj) {
        scene.value = obj;
    }
    const sceneChidrenLength = ref(0)
    function setSceneChidrenLength (num) {
        sceneChidrenLength.value = num;
    }

    // 添加变换控制器的模式
    const transformControlsMode = ref('translate');
    function setTransformControlsMode (newMode) {
        transformControlsMode.value = newMode;
        mapApp.transformControls.mode = newMode;
    }

    // 添加选中对象
    const selectedObj = ref(null);
    function setSelectedObj (newObj) {
        if (!newObj) {
            mapApp.transformControls.detach()
        }
        selectedObj.value = newObj || null;
    }


    // 定义操作方法
    function addMesh (type) {
        function addItem (creator) {
            meshArr.value.push(creator);
            mapApp.renderMeshArr();
        }
        if (type === 'Box') {
            addItem(createBox());
        } else if (type === 'Cylinder') {
            addItem(createCylinder());
        }
    }
    function removeMesh (name) {
        meshArr.value = meshArr.value.filter(mesh => {
            return mesh.name !== name
        })
    }
    function updateMeshInfo (name, info, type) {
        const mesh = meshArr.value.find(mesh => {
            return mesh.name === name
        })
        if (mesh.name === name) {
            if (type === 'position') {
                mesh.props.position = info;
            } else if (type === 'scale') {
                mesh.props.scale = info;
            } else if (type === 'rotation') {
                mesh.props.rotation = {
                    x: info.x,
                    y: info.y,
                    z: info.z
                }
            }
        }

    }

    function updateMaterial (name, info) {
        this.meshArr.some(mesh => {
            if (mesh.name === name) {
                mesh.props.material = {
                    ...mesh.props.material,
                    ...info
                }
                mapApp.renderMeshArr();
                return true;
            }
        })
    }


    // 返回状态和方法
    return {
        meshArr,
        addMesh,
        setSelectedObj,
        selectedObj,
        removeMesh,
        updateMeshInfo,
        transformControlsMode,
        setTransformControlsMode,
        scene,
        setScene,
        updateMaterial,
        sceneChidrenLength,
        setSceneChidrenLength
    }
}, {
    // 配置持久化
    persist: {
        key: 'three-editor-store',
        storage: localStorage,
        paths: ['meshArr'] // 只持久化保存 meshArr
    }
});

export const MeshTypes = {
    Box: 'Box',
    Cylinder: 'Cylinder'
};




// 创建立方体
function createBox () {
    const newId = Math.random().toString().slice(2, 8);
    return {
        id: newId,
        type: 'Box',
        name: 'Box' + newId,
        props: {
            width: 200,
            height: 200,
            depth: 200,
            geometry: {
                type: 'BoxGeometry',
            },
            material: {
                type: 'MeshPhongMaterial',
                color: '#ffa500',
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: {
                x: 1,
                y: 1,
                z: 1
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }
}
// 创建圆柱体
function createCylinder () {
    const newId = Math.random().toString().slice(2, 8);
    return {
        id: newId,
        type: 'Cylinder',
        name: 'Cylinder' + newId,
        props: {
            radiusTop: 200,
            radiusBottom: 200,
            height: 300,
            geometry: {
                type: 'CylinderGeometry',
            },
            material: {
                type: 'MeshPhongMaterial',
                color: '#ffa500',
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: {
                x: 1,
                y: 1,
                z: 1
            }
        }
    }
}