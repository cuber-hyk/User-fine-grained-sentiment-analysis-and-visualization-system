<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 
  样式表定义应用程序的全局样式 
*/
#app {
  font-family: "微软雅黑", -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  min-height: 100vh;
  color: #ffffff;
  position: relative;
}

/* 
  应用程序背景的伪元素，添加了渐变效果 
*/
#app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 35%, rgba(2, 166, 181, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 75% 65%, rgba(2, 166, 181, 0.05) 0%, transparent 25%);
  pointer-events: none;
}


</style>
