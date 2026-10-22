import api from '@/api/index.js'
import { localStorage } from 'mp-storage'
const state = {
  user: null,
  appTitle: '',
  genderList: [],
  mariageList: [],
  initDone: false,
  initWelcome: false, //是否显示开屏页
  pendingSsoStep: false // 下一步是否需要sso验证: 1.微信直接登录无需sso验证 2.密码登录如果user.requireSSO为true则需要sso验证 3.sso页面登录成功，设为false
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_APP_TITLE(state, appTitle) {
    state.appTitle = appTitle
  },
  SET_GENDER_LIST(state, genderList) {
    state.genderList = genderList
  },
  SET_MARIAGE_LIST(state, mariageList) {
    state.mariageList = mariageList
  },
  SET_INIT_DONE(state) {
    state.initDone = true
  },
  SET_INIT_WELCOME(state, initWelcome) {
    state.initWelcome = initWelcome
  },
  SET_PENDING_SSO_STEP(state, pendingSsoStep) {
    state.pendingSsoStep = pendingSsoStep
  },
  CLEAR(state) {
    state.user = null
    state.appTitle = ''
    state.initDone = false
    state.initWelcome = false
    state.pendingSsoStep = false
    localStorage.clear()
  }
}

const actions = {
  set_user({ commit }, user, isWxLogin = false) {
    commit('SET_USER', user)
  },
  async setAppTitle({ commit }, appTitle) {
    commit('SET_APP_TITLE', appTitle)
  },
  async initDicts({ commit }) {
    {
      const res = await api.getDictDataLabel('sys_user_sex')
      commit('SET_GENDER_LIST', res)
    }
    {
      const res = await api.getDictDataLabel('sys_mariage')
      commit('SET_MARIAGE_LIST', res)
    }
  },
  async setInitDone({ commit }) {
    commit('SET_INIT_DONE')
  },
  async setInitWelcome({ commit }, initWelcome) {
    commit('SET_INIT_WELCOME', initWelcome)
  },
  async setPendingSsoStep({ commit }, pendingSsoStep) {
    commit('SET_PENDING_SSO_STEP', pendingSsoStep)
  },
  clear({ commit }) {
    commit('CLEAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
