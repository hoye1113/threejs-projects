<script setup>
import MapBackground from './background/MapBackground.vue'
import Map from '@/map/init.js';
import { ref } from 'vue';

const radios = ref([
  {
    label: '小新',
    value: '小新',
    imgUrl: './xiaoxin.png'
  },
  {
    label: '爱心',
    value: '爱心',
    imgUrl: './heart.png'
  }
])
const changeTShirtColor = (e) => {
  Map.changeTShirtColor(e.target.value);
}

const changePattern = (str) => {
  Map.changePattern(str);
}

</script>

<template>
   <MapBackground/>

   <div id="operate">
   <div class='ope-item'>
      <div>颜色</div>
      <div>
        <input type="color" @input="changeTShirtColor" />
      </div>
    </div>
    <div className='ope-item'>
    <div>图案</div>
    <div v-for="radio in radios" :key="radio.value">
      <input type="radio" name="pattern" :value="radio.value" @change="changePattern(radio.imgUrl)" />
      <label :for="radio.value">{{ radio.label }}</label>  
    </div>
  </div>
  <div className='ope-item'>
    <button type='primary' @click="Map.downloadImg">保存为图片</button>
    <button type='default' @click="Map.downloadVideo">保存为视频</button>
  </div>
    </div>
    
</template>

<style scoped>

#operate {
  position: absolute;
  left: 50px;
  top: 200px;
  z-index: 1;

  color: white;
  
  .ope-item {
    display: flex;
    width: 250px;
    margin-bottom: 20px;

    >div:first-child {
      padding-right: 20px;
    }
  }
}

</style>
