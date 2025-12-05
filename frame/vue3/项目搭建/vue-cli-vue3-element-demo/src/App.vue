<!--
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-09-16 09:43:13
 * @LastEditors: wangyang
 * @LastEditTime: 2025-12-05 11:16:30
-->
<template>
  <nav>
    <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
    <router-link to="/directory-demo">Directory Demo</router-link> |
    <router-link to="/tree-select">Tree Select Demo</router-link> |
    <router-link to="/cascader-demo">Cascader Demo</router-link> |
    <router-link to="/cascader-demo1">Cascader Demo 1</router-link> |
    <router-link to="/cascader-demo2">Cascader Demo 2</router-link> |
    <router-link to="/cascader-demo3">Cascader Demo 3</router-link> |
    <router-link to="/cascader-demo4">Cascader Demo 4</router-link> |
    <router-link to="/cascader-demo5">Cascader Demo 5</router-link> |
    <router-link to="/cascader-demo6">Cascader Demo 6</router-link> |
    <router-link to="/cascader-demo7">Cascader Demo 7</router-link> |
    <router-link to="/cascader-demo8">Cascader Demo 8</router-link> |
    <router-link to="/cascader-demo9">Cascader Demo 9</router-link> |
    <router-link to="/cascader-demo10">Cascader Demo 10</router-link> |
    <router-link to="/cascader-demo11">Cascader Demo 11</router-link> |
    <router-link to="/cascader-demo12">Cascader Demo 12</router-link> |
    <router-link to="/mermaid-demo">Mermaid Demo</router-link> |
    <router-link to="/g6-demo">G6 Demo</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
