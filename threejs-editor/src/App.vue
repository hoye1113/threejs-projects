<script setup>
import Menu from './view/menu/index.vue'
import Main from './view/main/index.vue'
import Properties from './view/properties/index.vue'
</script>

<template>
  <div class="wrap">
    <Menu />
    <div class="editor">
      <Main />
      <Properties />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  .editor {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
}
</style>
