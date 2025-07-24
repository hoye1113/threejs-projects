<template>
  <div class="properties">
    <a-segmented
      :value="selectedTabKey"
      block
      :options="['属性', 'json']"
      @change="handleTabChange"
    />
    <div v-show="selectedTabKey === '属性'">
      <a-tree
        show-line
        :tree-data="treeData"
        :expandedKeys="['root']"
        @select="handleSwitcherClick"
      >
        <template #switcherIcon="{ switcherCls }">
          ><down-outlined :class="switcherCls"
        /></template>
      </a-tree>

      <a-form
        v-show="handleSelectedObj"
        :model="handleSelectedObj"
        layout="vertical"
      >
        <a-form-item label="几何体" name="geometry">
          <a-input :value="handleSelectedObj?.geometry" readonly />
        </a-form-item>
        <a-form-item label="材质" name="material">
          <a-input :value="handleSelectedObj?.material" readonly />
        </a-form-item>
        <a-form-item label="颜色" name="color">
          <a-input
            type="color"
            :value="handleSelectedObj?.color"
            @change="onColorChange"
          />
        </a-form-item>
      </a-form>
    </div>

    <div v-show="selectedTabKey === 'json'" class="json-container">
      <pre>{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { useThreeStore } from '@/store'
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import mapApp from '@/map/init'

const threeStore = useThreeStore()
const selectedTabKey = ref('属性')

const handleSelectedObj = computed(() => {
  const selectedObj = threeStore.selectedObj
  if (!selectedObj || !selectedObj.isMesh) return

  return {
    name: selectedObj.name,
    color: '#' + selectedObj.material.color.getHexString(),
    geometry: selectedObj.geometry.type,
    material: selectedObj.material.type
  }
})

const jsonData = computed(() => {
  return threeStore.meshArr
})

const treeData = computed(() => {
  if (
    threeStore.scene &&
    threeStore.scene.children &&
    threeStore.sceneChidrenLength
  ) {
    return [
      {
        title: 'Scene',
        key: 'root',
        children: threeStore.scene.children
          .map((item) => {
            if (item.isTransformControlsRoot) {
              return null
            }
            return {
              title: item.isMesh ? item.geometry.type : item.type,
              key: item.type + item.name + item.id,
              name: item.name
            }
          })
          .filter((item) => item !== null)
      }
    ]
  }
  return []
})

function handleSwitcherClick(selectKeys, info) {
  const name = info.node.name

  mapApp.transformControlsAttachObj(name)
}

function onColorChange(event) {
  const colorStr = event.target.value

  threeStore.updateMaterial(handleSelectedObj.value.name, {
    color: colorStr
  })
}

function handleTabChange(key) {
  selectedTabKey.value = key
}
onMounted(() => {})
</script>

<style scoped lang="scss">
.properties {
  height: 100%;
  width: 20%;
  background-color: #f0f0f0;

  :deep(.ant-form) {
    margin-top: 20px;
  }

  .json-container {
    height: calc(100vh - 80px);
    font-size: 12px;
    color: #000;
    background-color: #fff;
    pre {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>