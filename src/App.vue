
<template>
  <Menu></Menu>
  <About/>
  <Skills/>
</template>

<script setup lang="ts">
  import Menu from "./components/Menu.vue"
  import About from "./components/About.vue"
  import Skills from "./components/Skills.vue";
</script>

<style lang="scss">
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  background-color: #1B1E22;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 900px) {
    font-size: 14px;
  }
  @media (max-width: 500px) {
    font-size: 12px;
  }
}
#app {
  max-width: 1280px;
  margin: 0;
  padding: 2rem;
  text-align: center;

  min-width: 375px;
}
body{
  display: flex;
  justify-content: center;
  margin: 0;

}
</style>
