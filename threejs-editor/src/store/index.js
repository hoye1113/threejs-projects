import { defineStore } from "pinia";
import { ref } from "vue";
import Map from "@/map/init";

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
                material: {
                    color: 'orange',
                },
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
        }
    ]);
    const selectedObj = ref(null);
    function setSelectedObj (newObj) {
        selectedObj.value = newObj;
    }
    const transformControlsModeRef = ref('translate');
    function setTransformControlsMode (newMode) {
        transformControlsModeRef.value = newMode;
    }
    // 定义操作方法
    function addMesh (type) {
        console.log('addMesh', type, Map);
        function addItem (creator) {
            meshArr.value.push(creator());
            console.log('meshArr', meshArr.value);
            Map.renderMeshArr();
        }
        if (type === 'Box') {
            addItem(createBox);
        } else if (type === 'Cylinder') {
            addItem(createCylinder);
        }
    }
    function removeMesh (name) {
        meshArr.value = meshArr.value.filter(mesh => {
            return mesh.name !== name
        })
    }
    function updateMeshPosition (name, position) {
        const mesh = meshArr.value.find(mesh => {
            return mesh.name === name
        })
        if (mesh) {
            mesh.props.position = position;
        }
    }
    // 返回状态和方法
    return {
        meshArr,
        addMesh,
        setSelectedObj,
        selectedObj,
        removeMesh,
        updateMeshPosition,
        transformControlsModeRef,
        setTransformControlsMode
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
            material: {
                color: 'orange',
            },
            position: {
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
            material: {
                color: 'orange',
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }
}
