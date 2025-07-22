<script setup>
import MapBackground from './background/MapBackground.vue'
import Map from '@/map/init.js';
import { ref } from 'vue';

const isShowBrowser = ref(false);

</script>

<template>
   <MapBackground/>
   <div id="desktop">
    <img className="bg" src="@/assets/bg.png"/>
    <div className='app' @click="isShowBrowser = true">
      <div className='logo'></div>
      <div className='name'>浏览器</div>
    </div>
    <iframe className='browser' src='https://sogou.com/' v-show="isShowBrowser"/>

   </div>

    
</template>

<style scoped>

#desktop {
  width: 600px;
  height: 1100px;
  background: pink;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  backface-visibility: hidden;
}

#desktop .bg {
  position: absolute;
  left: -250px;
  top: 250px;
  width: 1100px;
  height: 600px;
  rotate: -90deg;
}


#desktop .app {
  position: absolute;
  left: 50px;
  top: 900px;
  width: 100px;
  height: 100px;
  rotate: -90deg;
  /* border: 1px solid blue; */


}
#desktop .app .logo{
  width: 50px;
  height: 50px;
  background: blue;
  translate: 50% 0;
  background: url(@/assets/chrome.png);
  background-size: cover;
}

#desktop .app .name{
  font-size: 30px;
  color: white;
}

#desktop .browser {
  width: 900px;
  height: 600px;
  position: absolute;
  left: -150px;
  top: 250px;
  rotate: -90deg;
}


</style>
