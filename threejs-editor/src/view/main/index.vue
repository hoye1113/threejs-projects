<template>
  <div class="main">
    <div id="mapContainer"></div>
    <a-float-button-group
      shape="square"
      :style="{ left: '20px', top: '160px' }"
    >
      <a-float-button @click="setTransformControlsMode('translate')">
        <template #icon>
          <DragOutlined />
        </template>
      </a-float-button>

      <a-float-button @click="setTransformControlsMode('rotate')">
        <template #icon>
          <RetweetOutlined />
        </template>
      </a-float-button>

      <a-float-button @click="setTransformControlsMode('scale')">
        <template #icon>
          <ArrowsAltOutlined />
        </template>
      </a-float-button>
    </a-float-button-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mapApp from '@/map/init'
import {
  DragOutlined,
  RetweetOutlined,
  ArrowsAltOutlined
} from '@ant-design/icons-vue'
import { useThreeStore } from '@/store'

const { setTransformControlsMode } = useThreeStore()

onMounted(() => {
  mapApp.init(document.getElementById('mapContainer'))
})
</script>

<style scoped lang="scss">
.main {
  // flex:6;
  width: 80%;
  height: 100%;
  background-color: #f0f0f0;

  #mapContainer {
    width: 100%;
    height: 100%;
  }
}
</style>    