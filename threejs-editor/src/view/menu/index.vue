<template>
  <div class="menu">
    <Menu
      :selectedKeys="current"
      mode="horizontal"
      :items="items"
      @select="handleSelect"
    />
  </div>
</template> 

<script setup>
import { ref } from 'vue'
import { Menu } from 'ant-design-vue'
import { MeshTypes, useThreeStore } from '@/store/index'
const current = ref(['add'])
const { addMesh } = useThreeStore()

const items = ref([
  {
    label: '添加元素',
    key: 'add',
    children: [
      {
        type: 'group',
        label: 'Mesh',
        children: [
          { label: '立方体', key: 'Box' },
          { label: '圆柱', key: 'Cylinder' }
        ]
      },
      {
        type: 'group',
        label: 'Light',
        children: [
          { label: '点光源', key: 'PointLight' },
          { label: '平行光', key: 'DirectionalLight' }
        ]
      }
    ]
  }
])

const handleSelect = (item) => {
  if (MeshTypes[item.key]) {
    addMesh(MeshTypes[item.key])
  }
}
</script>

<style scoped lang="scss">
.menu {
  height: 48px;
  width: 100%;
}
</style>