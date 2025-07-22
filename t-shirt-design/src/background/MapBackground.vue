<script setup>
import { ref,onMounted } from 'vue'
import Map from '@/map/init.js';

onMounted(()=>{
   const dom = document.getElementById('map-background');
    Map.init(dom);
})



</script>

<template>
    <div  id="map-background"></div>
</template>

<style scoped lang="scss">
#map-background {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
