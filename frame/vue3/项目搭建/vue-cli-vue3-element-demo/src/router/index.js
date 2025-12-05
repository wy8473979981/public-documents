/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-09-17 21:51:34
 * @LastEditors: wangyang
 * @LastEditTime: 2025-12-05 11:15:46
 */
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/directory-demo',
    name: 'directory-demo',
    component: () => import(/* webpackChunkName: "directory-demo" */ '../views/DirectoryDemo.vue')
  },
  {
    path: '/tree-select',
    name: 'tree-select',
    component: () => import(/* webpackChunkName: "tree-select" */ '../views/TreeSelect.vue')
  },
  {
    path: '/cascader-demo',
    name: 'cascader-demo',
    component: () => import(/* webpackChunkName: "cascader-demo" */ '../views/CascaderDemo.vue')
  },
  {
    path: '/cascader-demo1',
    name: 'cascader-demo1',
    component: () => import(/* webpackChunkName: "cascader-demo1" */ '../views/CascaderDemo1.vue')
  },
  {
    path: '/cascader-demo2',
    name: 'cascader-demo2',
    component: () => import(/* webpackChunkName: "cascader-demo2" */ '../views/CascaderDemo2.vue')
  },
  {
    path: '/cascader-demo3',
    name: 'cascader-demo3',
    component: () => import(/* webpackChunkName: "cascader-demo3" */ '../views/CascaderDemo3.vue')
  },
  {
    path: '/cascader-demo4',
    name: 'cascader-demo4',
    component: () => import(/* webpackChunkName: "cascader-demo4" */ '../views/CascaderDemo4.vue')
  },
  {
    path: '/cascader-demo5',
    name: 'cascader-demo5',
    component: () => import(/* webpackChunkName: "cascader-demo5" */ '../views/CascaderDemo5.vue')
  },
  {
    path: '/cascader-demo6',
    name: 'cascader-demo6',
    component: () => import(/* webpackChunkName: "cascader-demo6" */ '../views/CascaderDemo6.vue')
  },
  {
    path: '/cascader-demo7',
    name: 'cascader-demo7',
    component: () => import(/* webpackChunkName: "cascader-demo7" */ '../views/CascaderDemo7.vue')
  },
  {
    path: '/cascader-demo8',
    name: 'cascader-demo8',
    component: () => import(/* webpackChunkName: "cascader-demo8" */ '../views/CascaderDemo8.vue')
  },
  {
    path: '/cascader-demo9',
    name: 'cascader-demo9',
    component: () => import(/* webpackChunkName: "cascader-demo9" */ '../views/CascaderDemo9.vue')
  },
  {
    path: '/cascader-demo10',
    name: 'cascader-demo10',
    component: () => import(/* webpackChunkName: "cascader-demo10" */ '../views/CascaderDemo10.vue')
  },
  {
    path: '/cascader-demo11',
    name: 'cascader-demo11',
    component: () => import(/* webpackChunkName: "cascader-demo11" */ '../views/CascaderDemo11.vue')
  },
  {
    path: '/cascader-demo12',
    name: 'cascader-demo12',
    component: () => import(/* webpackChunkName: "cascader-demo12" */ '../views/CascaderDemo12.vue')
  },
  {
    path: '/mermaid-demo',
    name: 'mermaid-demo',
    component: () => import(/* webpackChunkName: "mermaid-demo" */ '../views/MermaidDemo.vue')
  },
  {
    path: '/g6-demo',
    name: 'g6-demo',
    component: () => import(/* webpackChunkName: "g6-demo" */ '../components/G6Demo.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
