import { debug as DEBUG } from './apiroot'
import fetch from './fetch'

export const debug = DEBUG

export const refreshToken = async () => fetch(`/api/v1/refreshtoken`)

export const getLoginHint = async (username) =>
  fetch(`/api/v1/mp/user/loginhint`, { username }, 'GET')

export const newLogin = async (data, appID = '', envVersion = '') =>
  fetch(
    `/api/v1/mp/user/login?appID=${appID}&envVersion=${envVersion}`,
    data,
    'POST'
  )

export const updateUserInfo = async (data) =>
  fetch(`/api/v1/mp/my/profile`, data, 'POST')

export const logoutUserInfo = async () =>
  fetch(`/api/v1/mp/user/logout`, null, 'POST')

export const getUserInfo = async () => fetch(`/api/v1/mp/my/profile`)

export const wxlogin = async ({ code, appID, envVersion }) =>
  fetch(`/api/v1/mp/wechat/login`, { code, appID, envVersion }, 'GET')

export const getLastLoginName = async () =>
  fetch(`/api/v1/mp/wechat/lastloginname`)

// export const getWXPhoneNumber = async (detail) =>
//   fetch(`/api/v1/mp/wechat/getphonenumber`, detail, 'POST')

// export const getWXUserProfile = async (detail) =>
//   fetch(`/api/v1/mp/wechat/getuserprofile`, detail, 'POST')

// // user
// export const saveUserInfo = async (data) => {
//   return fetch(`/api/v1/mp/user/update`, data, 'POST')
// }

// // 获取用户信息
// export const myProfile = async () => {
//   return fetch(`/api/v1/mp/my/info`)
// }

// export const putMyProfile = async (data) => {
//   return fetch(`/api/v1/mp/my/info`, data, 'PUT')
// }

// // 注册用户
// export const postRegisterUser = async (data) => {
//   return fetch(`/api/v1/mp/register`, data, 'POST')
// }

// export const profileDetail = async () => {
//   return fetch(`/api/v1/mp/user/profiledetail`)
// }

// // AI对话 // TODO: 已作废
// export const postAIForDialogue = async (data) => {
//   return fetch(`/api/v1/mp/chat/send`, data, 'POST')
// }

// 随机获取一个AI虚拟客户
export const getRandomAiHuman = async () => fetch(`/api/v1/mp/aihuman/random`)

// 获取AI虚拟客户
export const getAiHuman = async (id) => fetch(`/api/v1/mp/aihuman/${id}`)
// 产品知识-详情
export const getAiKnowledge = async (id) =>
  fetch(`/api/v1/mp/aiknowledge/${id}`)

// 获取所有AI虚拟客户
export const getAllAiHuman = async (data) => fetch(`/api/v1/mp/aihuman`, data)

// 准备训练对话，记录sessionID，方便控制同时在线人数
export const prepareChat = async (ai) =>
  fetch(`/api/v1/mp/training/limit/prepare/${ai}`, null, 'POST')

// 释放限流
export const releaseLimit = async ({ ai, sessionID }) =>
  fetch(`/api/v1/mp/training/limit/release`, { ai, sessionID }, 'POST')

// 训练对话
export const chatTraining = async (ai, input) =>
  fetch(`/api/v1/mp/training/chat/ai/${ai}`, input, 'POST')

// 生成培训评价
export const completeTraining = async (input) =>
  fetch(`/api/v1/mp/training/complete`, input, 'POST')

// 获取单个评价
export const getTraining = async (id) => fetch(`/api/v1/mp/my/trainings/${id}`)

// 历史训练
export const getSearchTraining = async (data) =>
  fetch(`/api/v1/mp/my/trainings`, data)

// 星级弹框知晓
export const knowTrainingNoticeStar = async (id) =>
  fetch(`/api/v1/mp/my/trainings/${id}/noticestar`, null, 'post')

// 点赞、点踩
export const reactTraining = async (id, data) =>
  fetch(`/api/v1/mp/my/trainings/${id}/reaction`, data, 'post')

// 字典
export const getDictDataLabel = async (dictType) =>
  fetch(`/api/v1/mp/dict/databytype/${dictType}/labelvalue`)

// 组织
export const getSearchTeam = async (data) => fetch(`/api/v1/mp/teams`, data)

// 省市列表
export const getSearchCity = async (data) => fetch(`/api/v1/mp/cities`, data)

// 网点列表
export const getSearchOrgs = async (data) => fetch(`/api/v1/mp/orgs`, data)

// 语音
export const getTtsToken = async (lang = 'zh', vendorVal = 0) => {
  let vendor = ''
  if (vendorVal === 1) {
    vendor = 'huoshan'
  }
  return await fetch(`/api/v1/mp/voice/tts/token`, { lang, vendor }, 'GET')
}

// 语音识别
export const getAsrToken = async (lang = 'zh') =>
  fetch(`/api/v1/mp/voice/asr/token`, { lang }, 'GET')

// 头条资讯
export const getAllHeadlines = async () =>
  fetch(`/api/v1/mp/headlines`, { pageSize: 255, status: 1 })

// 用户协议
export const getLegalStatement = async () => {
  return fetch(`/api/v1/mp/config/law`)
}
// 隐私协议
export const getPrivacyStatement = async () => {
  return fetch(`/api/v1/mp/config/privacy`)
}

// 活动广告
export const getBannerGameForHome = async () => {
  return fetch(`/api/v1/mp/banner/games`)
}
// 活动详情
export const getDetailForGame = async (id) => {
  return fetch(`/api/v1/mp/games/${id}`)
}
// 活动勋章
export const getMedalsForGame = async (id) => {
  return fetch(`/api/v1/mp/games/${id}/medals`)
}
// 网点赛：网点榜单
export const getRankOrgForGame = async (id) => {
  return fetch(`/api/v1/mp/games/${id}/my/ranks/org`)
}
// 网点赛：个人榜单
export const getRankOrgUserForGame = async (id) => {
  return fetch(`/api/v1/mp/games/${id}/my/ranks/org/user`)
}
// 个人赛：个人榜单
export const getRankUserForGame = async (id) => {
  return fetch(`/api/v1/mp/games/${id}/my/ranks/user`)
}

// 勋章
// 我的勋章统计信息
export const getSummaryForMedal = async () => {
  return fetch(`/api/v1/mp/my/medals/summary`)
}
// 我的勋章列表
export const getMyListForMedal = async () => {
  return fetch(`/api/v1/mp/my/medals`)
}
// 我的（活动）新勋章
export const getMyNewForMedal = async (id) => {
  return fetch(`/api/v1/mp/my/new/medals/games/${id}`)
}
// 勋章已通知（知道了）
export const noticedUserForMedal = async (id) => {
  return fetch(`/api/v1/mp/my/usermedals/${id}/noticed`, null, 'post')
}
// 佩戴
export const wearUserForMedal = async (id) => {
  return fetch(`/api/v1/mp/my/usermedals/${id}/wear`, null, 'post')
}
// 取消佩戴
export const unWearUserForMedal = async (id) => {
  return fetch(`/api/v1/mp/my/usermedals/${id}/unwear`, null, 'post')
}

// 成就墙
export const getWallForData = async (id) => {
  return fetch(`/api/v1/mp/my/achievement`)
}

// 解锁
export const unlockForAiHuman = async (id) => {
  return fetch(`/api/v1/mp/aihuman/${id}/unlock`, null, 'post')
}

// 产品知识测试
export const getAiKnowledgeForList = async (data) =>
  fetch(`/api/v1/mp/aiknowledge`, data)

// 训练类型
export const getTrainingTypeForList = async () =>
  fetch(`/api/v1/mp/trainingtypes/list`)

// export const getAiKeyWordForList = async (data) =>
//   fetch(`/api/v1/mp/aikeywords`, data)

// 我的统计信息
export const getMySummary = async () => fetch(`/api/v1/mp/my/summary`)

// 近30天统计信息
export const getMySummary30days = async () =>
  fetch(`/api/v1/mp/my/summary/30days`)

// 定向训练
export const getTargetedTraining = async () =>
  fetch(`/api/v1/mp/trainingtypes`, { isOrient: 1, pageSize: 5 })

// PreCase
export const getPreCaseForList = async () =>
  fetch(`/api/v1/mp/trainingtypes`, { isPreCase: 1, pageSize: 1 })

export const getPrecaseDims = async () => fetch(`/api/v1/mp/precase/dims`)

export const getPrecasePrompt = async (data) =>
  fetch(`/api/v1/mp/precase/prompt`, data, 'POST')

export const getPrecase = async (id) => fetch(`/api/v1/mp/precase/${id}`)

// 友邦SSO

// 友邦分公司列表
export const getAiaCompanyList = async () => fetch(`/api/v1/mp/aiacompany/list`)

// 友邦SSO 获取验证码
export const sendIPassportSmsCode = async (data) =>
  fetch(`/api/v1/mp/ipassport/sendsms`, data, 'POST')

// 友邦SSO 登录
export const loginIPassport = async (data) =>
  fetch(`/api/v1/mp/ipassport/ssologin`, data, 'POST')

export default {
  refreshToken,
  getLoginHint,
  newLogin,
  updateUserInfo,
  getUserInfo,
  logoutUserInfo,
  wxlogin,
  getLastLoginName,
  // getWXPhoneNumber,
  // getWXUserProfile,
  // saveUserInfo,
  // myProfile,
  // putMyProfile,
  // postRegisterUser,
  // profileDetail,

  // postAIForDialogue,
  prepareChat,
  releaseLimit,
  chatTraining,
  completeTraining,
  getTraining,
  getSearchTraining,
  knowTrainingNoticeStar,

  getRandomAiHuman,
  getAiHuman,
  getAiKnowledge,
  getAllAiHuman,

  getDictDataLabel,

  getSearchTeam,
  getSearchCity,
  getSearchOrgs,

  getTtsToken,
  getAsrToken,
  getAllHeadlines,

  getLegalStatement,
  getPrivacyStatement,

  getBannerGameForHome,
  getDetailForGame,
  getMedalsForGame,
  getRankOrgForGame,
  getRankOrgUserForGame,
  getRankUserForGame,

  getSummaryForMedal,
  getMyListForMedal,
  getMyNewForMedal,
  noticedUserForMedal,
  wearUserForMedal,
  unWearUserForMedal,

  getWallForData,
  unlockForAiHuman,

  getAiKnowledgeForList,

  getTrainingTypeForList,
  // getAiKeyWordForList,

  getMySummary,
  getMySummary30days,
  getTargetedTraining,
  getPreCaseForList,

  getPrecaseDims,
  getPrecasePrompt,
  getPrecase,

  // 友邦SSO
  getAiaCompanyList,
  sendIPassportSmsCode,
  loginIPassport,
  reactTraining
}
