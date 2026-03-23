<template>
  <div class="chat-page">
    <nav-bar :navOption="navOption" @navigateBack="customNavBack"></nav-bar>
    <!-- 背景图 -->
    <image class="bg-img" mode="aspectFill" :src="bgURL"></image>

    <template v-if="pageLoaded">
      <!-- 客户-时间 -->
      <view class="chat-page-bg-box">
        <div class="chat-page-bg-ai">
          <div v-if="isPreCase">
            <div class="chat-page-bg-ai-name">案前准备客户</div>
          </div>
          <div v-else>
            <div class="chat-page-bg-ai-name">
              {{ aiHuman && aiHuman.name ? aiHuman.name : '' }}
            </div>
            <div class="chat-page-bg-ai-gender" v-if="!isKnowledge">
              {{ aiHumanInfo }}
            </div>
          </div>
        </div>
        <view class="chat-page-bg-time-box">
          <image
            src="../../static/icons/reckon-time.png"
            mode=""
            class="chat-page-bg-time-img"
          />
          <text>{{ secToTime(second) }}</text>
        </view>
      </view>

      <!-- pre case -->
      <div class="big-box" v-if="preCaseLists.length > 0">
        <div
          class="small-box"
          v-for="(item, index) in preCaseLists"
          :key="index"
        >
          <p class="content_title">{{ item.title }}:</p>
          <div v-for="(itemContent, index) in item.content" :key="index">
            <p class="content_text">{{ itemContent }}</p>
          </div>
        </div>
      </div>

      <div
        class="chat-page-tags"
        v-if="!isKnowledge && tags && tags.length > 0"
      >
        <div
          v-for="(item, index) in tags"
          :key="index"
          class="chat-page-tags-item"
        >
          {{ item }}
        </div>
      </div>
      <!-- 正文 -->
      <view class="chat-page-content-fixed">
        <view
          class="chat-page-content"
          @click.stop="changePlayState"
          :style="{
            backgroundColor: playState
              ? 'rgba(255, 255, 255, 0.75)'
              : 'rgba(237, 23, 31, 0.75)'
          }"
        >
          <image
            src="../../static/icons/audio-play.png"
            mode=""
            class="chat-page-content-play"
            v-if="playState"
          />
          <image
            v-else
            src="../../static/icons/audio-stop.png"
            mode=""
            class="chat-page-content-play"
          />
        </view>
        <scroll-view
          :scroll-y="true"
          scroll-anchoring
          scroll-with-animation
          id="scroll-view"
          class="chat-page-scroll"
          :scroll-top="scrollTop"
        >
          <view
            class="chat-page-list-box"
            id="scroll-view-content"
            :style="{ marginTop: marginTop + 'px' }"
          >
            <view
              v-for="(item, index) of list"
              :key="index"
              class="chat-page-list-item"
            >
              <image
                v-if="index % 2 === 0"
                src="../../static/icons/write-icon-0.png"
                mode=""
                class="chat-page-list-item-cir"
              />
              <image
                v-else
                src="../../static/icons/write-icon-1.png"
                mode=""
                class="chat-page-list-item-cir"
              />
              <view
                :class="[
                  'chat-page-list-item-text',
                  index % 2 === 0 ? 'item-text-0' : 'item-text-1'
                ]"
              >
                {{ item }}
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="chat-page-list-write">
          <image
            src="../../static/icons/write-waiting.png"
            mode=""
            class="chat-page-list-write-img"
          />
          <public-ellipsis v-if="isAiThinking" color="#ed171f" />
        </view>
      </view>

      <!-- 按钮 -->
      <view class="chat-page-butt-fixed">
        <view class="chat-page-butt-box">
          <view @click.stop="changeChatType" class="chat-page-butt-change">
            <image
              src="../../static/icons/write.png"
              mode=""
              class="chat-page-butt-img"
              v-if="chatType"
            />
            <image
              v-else
              src="../../static/icons/audio.png"
              mode=""
              class="chat-page-butt-img"
            />
          </view>
          <div class="chat-page-butt-content">
            <div
              v-if="chatType"
              class="chat-page-butt-audio"
              @touchstart="handlerTouchstart"
              @touchend="handlerTouchend"
            >
              <span> 按住 说话</span>
              <!-- 按住说话 -->
              <div class="chat-page-popup" v-show="audioPopup">
                <div class="chat-page-popup-box">
                  <div class="chat-page-popup-title">
                    <span>我在听</span>
                    <public-ellipsis />
                  </div>
                  <img
                    src="../../static/icons/audio-tips.png"
                    alt=""
                    srcset=""
                    class="chat-page-popup-tips-img"
                    v-if="audioSecond > 10"
                  />
                  <div v-else class="chat-page-popup-time">
                    {{ audioSecond }}” 后将停止录入<span
                      class="chat-page-popup-time-text"
                      >...</span
                    >
                  </div>
                  <div class="chat-page-popup-text">松开 结束录音</div>
                  <img
                    src="../../static/icons/audio-end.png"
                    alt=""
                    srcset=""
                    class="chat-page-popup-end-img"
                  />
                </div>
              </div>
            </div>
            <template v-else>
              <input
                type="text"
                :disabled="isAiThinking"
                :maxlength="-1"
                :value="inputValue"
                :auto-blur="true"
                :always-system="true"
                placeholder="输入文字，和客户互动"
                @input="changeInputValue"
                @confirm="confirmInput"
                class="chat-page-butt-content-input"
              />
              <view
                @click.stop="confirmEnterInput()"
                class="chat-page-butt-content-butt"
              >
                <image
                  src="../../static/icons/enter.png"
                  mode=""
                  :style="{ opacity: inputValue ? 1 : 0.5 }"
                  class="chat-page-butt-img"
                />
              </view>
            </template>
          </div>
        </view>
        <view class="chat-page-butt-tips"
          >- 内容由AI大模型生成，请仔细甄别 -</view
        >
      </view>
    </template>
    <img
      src="../../static/icons/bg-img.png"
      alt=""
      srcset=""
      class="chat-page-butt-fixed-bg"
    />

    <!-- 挂断电话 -->
    <div class="chat-page-handle-click" v-if="isHangUp">
      <div class="chat-page-handle-click-title">
        {{ leaveText }}
      </div>
      <div class="chat-page-handle-click-text">
        {{
          chats.length <= 1
            ? '长时间未对话，客户已挂断'
            : '评价生成中，大约需要两分钟'
        }}
        <div class="handle-click-sub-text">...</div>
      </div>
      <div
        class="chat-page-handle-click-butt"
        v-if="trainingID"
        @click.stop="goTrainingResult"
      >
        查看训练结果
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import pageCommon from '@/mixins/page.common.js'
import { getAiHuman, getPrecase } from '@/api/index'
import PublicEllipsis from '@/components/PublicEllipsis.vue'

import AliTts from '@/voice/ali/alitts.js'
import AliAsr from '@/voice/ali/aliasr'

// import VolcTts from '@/voice/volc/volctts.js'

const wxlog = require('@/utils/wxlog.js')

import { enableLoading, disableLoading } from '@/utils/loading'

// 最大等待时间，超过后自动结束对话
const MAX_WAITING_SECONDS = 60

// 语音输入最大秒数
const MAX_ASR_SECONDS = 3 * 60 // 3分钟

export default {
  name: 'Chat',
  mixins: [pageCommon],
  components: { PublicEllipsis },
  data() {
    return {
      navOption: {
        navTitle: '',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      lists: [
        { name: 'inquiry', text: '建议询问的维度' },
        { name: 'potential', text: '潜在需求' },
        { name: 'questions', text: '用户可能会问' },
        { name: 'challenges', text: '用户可能的异议' }
      ],
      shouldRestoreLoading: true, // 是否需要恢复loading转圈圈
      greetingCtx: null, // 问候语audioCtx
      trainingID: 0, // 评价结果
      sessionID: '', // 会话ID
      ai: 0, // ai人物id
      aiHuman: {},
      aliVoiceData: null, // 语音token和其他配置，仅asr使用
      tts: null, // 语音合成
      asr: null, // 语音识别
      asrTextOngoing: '', // 语音识别中的文字
      asrTextCompleted: '', // 语音识别完成的文字
      list: ['你好，哪位？'],
      chats: [
        {
          speaker: 'ai',
          content: '你好，哪位？'
        }
      ],
      playState: true, //是否播放录音状态
      second: 0, //秒
      startTimestamp: 0, // 开始时间戳
      lastTalkTimestamp: null, // 最近一次对话的时间戳(new Date().getTime() 毫秒级别)
      timer: null,
      inputValue: '', //键盘输入的文字
      scrollTop: 0, //滚动条位置
      scrollViewHeight: 0,
      marginTop: 0,
      hasLeaveCalled: false,
      audioPopup: false,
      isTouchStarted: false, // 是否长按开始
      isTouchEnding: false, // 是否长按结束
      isAiThinking: false, // ai是否正在思考
      chatType: true, //默认true为语音说话状态，false为输入文本状态
      pageLoaded: false, // 页面是否加载完成
      isHangUp: false, //是否挂断的显示
      hangUpTimer: null,
      hangUpTimerSecond: 2000, //几秒
      audioSecond: MAX_ASR_SECONDS, //语音输入的最多时间：秒
      audioTimer: null, //语音输入的计时器
      preCaseID: 0,
      preCaseLists: [],
      difEntry: 0
    }
  },
  computed: {
    bgURL() {
      // 定向训练
      if (this.isOrient) {
        const url =
          this.aiHuman && (this.aiHuman.bgURL || this.aiHuman.avatarURL)
        return url ? url : '/static/icons/bg.jpeg'
      } else {
        // 其他
        return 'https://cdn.edesoft.com/cindi/upload/202407/30/073070.jpg'
      }
    },
    listLen() {
      return this.list.length
    },
    // 虚拟人物基本信息
    aiHumanInfo() {
      const aihuman = this.aiHuman || {}
      return this.getAihumanInfo(aihuman)
    },
    voiceLang() {
      // 根据人设的language，获取tts的token
      switch (this.aiHuman && this.aiHuman.language) {
        case 1:
          return 'hk'
        case 2:
          return 'en'
        default:
          return 'zh'
      }
    },
    voiceVendor() {
      // 返回人设voice的voiceVendor
      return (
        (this.aiHuman && this.aiHuman.voice && this.aiHuman.voice.vendor) || 0
      )
    },
    tags() {
      const str = this.aiHuman.tags || ''
      // split str by multiple separators
      if (!str) return []
      return str.split(/[-_ ，,;；]+/)
    },
    aiHumanName() {
      return this.aiHuman && this.aiHuman.name ? this.aiHuman.name : '虚拟人物'
    },
    trainingType() {
      return (this.aiHuman && this.aiHuman.trainingType) || {}
    },
    trainingTypeName() {
      return this.trainingType.name || '训练'
    },
    // 是否KYC
    isKyc() {
      return this.trainingType.name === 'KYC'
    },
    isFC() {
      return this.trainingType.name === 'FC'
    },
    // 是否定向训练
    isOrient() {
      return this.trainingType.isOrient
    },
    // 是否产品知识测试
    isKnowledge() {
      return this.trainingType.hasPdf
    },
    // 是否PreCase
    isPreCase() {
      return this.trainingType.isPreCase
    },
    leaveText() {
      let text = '';
      if (this.isKyc) {
        text = '客户已离开门店';
      } else if(this.isFC) {
        text = '客户已离开银行';
      } else {
        text = '电话已挂断'
      }
      return text;
    }
  },
  watch: {
    listLen(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.scrollToBottom()
      }
    }
  },
  async onLoad(options) {
    await this.waitingUserLoaded()
    // 禁止loading转圈圈
    this.shouldRestoreLoading = disableLoading()
    this.ai = parseInt(options.ai) || 0
    this.preCaseID = parseInt(options.precaseid) || 0
    this.difEntry = parseInt(options.difEntry) || 0
    this.sessionID = options.sessionID || ''

    // 获取数据
    await this.fetchData()
  },
  async onShow() {
    console.log('onShow')
    if (this.hasLeaveCalled) {
      // 如果已离开，则退出当前页面
      await this.customNavBack()
    }
  },
  methods: {
    async fetchData() {
      this.pageLoaded = false
      // 加载人设
      await this.loadAiHuman()
      // 设置标题
      this.setPageTitle()
      if (this.preCaseID > 0) {
        // 获取precase数据
        await this.getPrecaseData()
      }
      // 获取麦克风权限
      let hasAuth = await this.getAppRecordAuth()
      if (!hasAuth) {
        uni.showToast({
          title: '麦克风授权失败',
          icon: 'none',
          mask: true
        })
      }
      // 获取tts的配置
      await this.initTts()
      // 初始化语音
      if (this.chatType) {
        await this.initAsr()
      }
      this.pageLoaded = true
      this.isHangUp = false
      // 尽早播放问候语，改善用户体验
      this.greeting()
      // 打开计时
      await this.openReckonTime()
      // 计算对话框的高度，以及底部距离
      await this.getScrollHeight()
      await this.scrollToBottom()
      // 生成对话sessionID
      await this.genTalkSession()
      // 默认Ai发送一条对话
      // await this.sayHello()
    },
    // 获取precase数据
    async getPrecaseData() {
      const res = await getPrecase(this.preCaseID)

      let parsedObject = JSON.parse(res.plan) || []
      //转化数据
      for (let key in parsedObject) {
        if (parsedObject.hasOwnProperty(key)) {
          let _nameData = this.lists.find((item) => item.name === key)
          this.preCaseLists.push({
            title: _nameData ? _nameData.text : '',
            content: parsedObject[key]
          })
        }
      }
    },
    // 获取ai人信息
    async loadAiHuman() {
      if (!this.ai) return
      const res = await getAiHuman(this.ai)
      if (res) {
        this.aiHuman = res
      }

      // 设置问候语
      if (this.aiHuman && this.aiHuman.greeting) {
        this.list[0] = this.aiHuman.greeting
        this.chats[0].content = this.aiHuman.greeting
      }
    },
    setPageTitle() {
      // 设置标题
      let title = ''
      if (this.isPreCase) {
        title = '案前准备'
      } else if (this.isKnowledge) {
        title = '产品知识测试'
      } else if (this.isKyc) {
        title = 'KYC训练'
      } else {
        title = this.trainingType.name || ''
      }
      // 设置页面标题
      if (title) {
        this.navOption.navTitle = title
      }
    },
    // 计时
    openReckonTime() {
      this.clearTimer()
      this.startTimestamp = new Date().getTime() // 记录开始时间戳
      this.second = 0
      this.timer = setInterval(() => {
        this.second++
        // 如果超过x秒未对话，则挂断电话
        if (this.isHoldingTalkTimeout()) {
          this.hangUpByNoTalk()
        }
      }, 1000)
    },
    // 关闭计时
    clearTimer() {
      if (this.timer) clearInterval(this.timer)
    },
    // 生成对话sessionID
    async genTalkSession() {
      if (this.sessionID) return

      const datetimeStr = dayjs().format('YYYYMMDDHHmm')
      const userID = this.user.id
      const sessionID =
        datetimeStr + `${userID}`.padStart(5, '0') + '0000' + Date.now()
      this.sessionID = sessionID
      console.log('sessionID', sessionID)
    },
    // 获取麦克风权限
    getAppRecordAuth() {
      return new Promise((resolve, reject) => [
        uni.getSetting({
          success: (res) => {
            if (res.authSetting['scope.record']) {
              // 用户已经授权麦克风访问权限
              console.log('麦克风已授权')
              resolve(true)
            } else {
              // 用户未授权麦克风访问权限
              console.log('麦克风未授权')
              uni.authorize({
                scope: 'scope.record',
                success: () => {
                  console.log('麦克风授权成功')
                  resolve(true)
                },
                fail: () => {
                  console.log('麦克风授权失败')
                  // uni.showToast({
                  //   title: '麦克风授权失败',
                  //   icon: 'none',
                  //   mask: true
                  // })
                  resolve(false)
                }
              })
            }
          }
        })
      ])
    },
    async initTts() {
      try {
        const data = await this.$api.getTtsToken(
          this.voiceLang,
          this.voiceVendor
        )
        if (!data) return

        // 音色
        const voiceObj =
          (this.aiHuman && this.aiHuman.voice && this.aiHuman.voice) || {}

        // 赋值给全局变量

        // 火山引擎
        // const voiceVendor = this.voiceVendor
        // if (voiceVendor === 1) {
        //   voiceObj.volume = voiceObj.volume || 1
        //   voiceObj.speech_rate = voiceObj.speechRate || 1
        //   voiceObj.pitch_rate = voiceObj.pitchRate || 1

        //   const tts = new VolcTts({
        //     url: data.url,
        //     appkey: data.appKey,
        //     token: data.token,
        //     cluster: data.cluster,
        //     userDataPath: wx.env.USER_DATA_PATH,
        //     ...voiceObj
        //   })
        //   this.tts = tts
        // } else {
        // 默认阿里
        voiceObj.volume = voiceObj.volume || 50
        voiceObj.speech_rate = voiceObj.speechRate || 0
        voiceObj.pitch_rate = voiceObj.pitchRate || 0

        const tts = new AliTts({
          url: data.url,
          appkey: data.appKey,
          token: data.token,
          userDataPath: wx.env.USER_DATA_PATH,
          ...voiceObj
        })
        this.tts = tts
        // }
      } catch (ex) {
        console.error(ex)
      }
    },
    // async sayHello() {
    //   // const hello = (this.list && this.list[0]) || ''
    //   // if (hello) {
    //   //   this.playAudio(hello)
    //   // }
    // },
    greeting() {
      if (!this.playState) return
      // if (!this.tts) return
      const url = this.aiHuman && this.aiHuman.greetingURL
      if (url) {
        // this.tts.playVoice(this.aiHuman.greetingURL)
        this.greetingCtx = wx.createInnerAudioContext()
        this.greetingCtx.src = url
        this.greetingCtx.autoplay = true
        this.greetingCtx.onEnded(() => {
          this.greetingCtx = null
        })
      }
    },
    // 是否播放AI回答
    async changePlayState() {
      // 先结束播放上次语音
      await this.stopAudio()
      this.playState = !this.playState
      this.greetingCtx && this.greetingCtx.stop()
    },
    // 更改状态
    changeChatType() {
      this.inputValue = ''
      this.chatType = !this.chatType
      this.greetingCtx && this.greetingCtx.stop()
    },
    // 长按--1
    async handlerTouchstart() {
      if (this.isTouchStarted) {
        return
      }
      // 设置标记，防止重入
      this.isTouchStarted = true
      // console.log('================= touch [start] =================')
      let hasAuth = await this.getAppRecordAuth()
      if (!hasAuth) {
        return uni.showToast({
          title: '麦克风授权失败',
          icon: 'none',
          mask: true
        })
      }
      if (this.isAiThinking) {
        return uni.showToast({
          title: '正在思考，请稍候',
          mask: true,
          icon: 'none'
        })
      }

      // 防止点一下立即松开
      if (!this.isTouchStarted) {
        return uni.showToast({
          title: '说话时间太短',
          icon: 'error',
          mask: true
        })
      }

      await this.touchAudioStart()
      // this.initAsr()
      // 结束上次的语音播放
      await this.stopAudio()
      this.audioPopup = true
      this.handleAudioTimer()
    },
    // 长按结束
    async handlerTouchend() {
      if (this.isTouchEnding) {
        return
      }
      if (!this.isTouchStarted) {
        return
      }
      try {
        // 设置标记，防止重入
        this.isTouchEnding = true
        // console.log('================= touch [end] =================')
        this.clearAudioTimer()
        this.audioPopup = false
        await this.touchAudioEnd()
      } finally {
        // 结束语音识别
        this.isTouchStarted = false
        this.isTouchEnding = false
      }
    },
    // 开始语音识别
    async touchAudioStart() {
      // 更新最近一次对话的时间戳
      this.lastTalkTimestamp = new Date().getTime()

      this.asrTextOngoing = ''
      this.asrTextCompleted = ''
      if (this.asr) {
        try {
          await this.asr.start()
        } catch (ex) {
          console.error(ex)
        }
      }
    },
    // 停止语音识别
    async touchAudioEnd() {
      // 更新最近一次对话的时间戳
      this.lastTalkTimestamp = new Date().getTime()

      try {
        // 结束
        await this.stopAsr()
        // 如果结束时没有识别到内容，则使用handling记录的内容
        const text = this.asrTextCompleted || this.asrTextOngoing
        // 如果没有识别到内容，则提示重新说一遍
        if (!text) {
          return uni.showToast({
            title: '听不清楚，请重新说一遍！',
            icon: 'none',
            mask: true
          })
          // await this.handlerTouchend()
          // return
        } else {
          this.list.push(text)
          await this.postAIForDialogue(text)
        }
      } catch (ex) {
        console.error('postAIForDialogue', ex)
        // 记录错误
        wxlog.error('postAIForDialogue:', ex)
      } finally {
        // 结束语音识别
        this.asrTextOngoing = ''
        this.asrTextCompleted = ''
      }
    },
    // 初始化语音识别
    async initAsr() {
      if (!this.aliVoiceData) {
        this.aliVoiceData = await this.$api.getAsrToken(this.voiceLang)
      }
      const data = this.aliVoiceData || {}
      let asr = new AliAsr({
        url: data.url,
        appkey: data.appKey,
        token: data.token
      })
      asr.on('handling', (text) => {
        console.log('语音识别中:', text)
        this.asrTextOngoing = text
      })
      asr.on('completed', async (text) => {
        wxlog.info('asr.oncomplete语音识别正常结束:', text)

        // 更新最近一次对话的时间戳
        this.lastTalkTimestamp = new Date().getTime()
        console.log('语音识别completed:', text)
        this.asrTextCompleted = text
      })
      asr.on('error', (errMsg) => {
        // 记录实时log
        wxlog.error('asr.onerror语音识别错误:', errMsg)
      })

      // 赋值给全局变量
      this.asr = asr
    },
    async stopAsr(forced = false) {
      if (this.asr) {
        await this.asr.stop(forced)
      }
    },
    // 判断语音内容
    async postAIForDialogue(text) {
      // 更新最近一次对话的时间戳
      this.lastTalkTimestamp = new Date().getTime()

      // 记录小程序log
      const delayInfo = {
        sessionID: this.sessionID,
        user: text
      }

      try {
        // 开始思考
        this.isAiThinking = true

        if (text) {
          // 追加对话内容
          this.chats.push({
            speaker: 'user',
            content: text
          })

          // 记录API调用时间
          const chatAPI_startTime = new Date().getTime()
          let res
          try {
            res = await this.$api.chatTraining(this.ai, {
              message: text,
              sessionID: this.sessionID,
              preCaseID: this.preCaseID,
              chats: this.chats
            })
          } finally {
            // 计算用时
            const chatAPI_endTime = new Date().getTime()
            const usedTime = (chatAPI_endTime - chatAPI_startTime) / 1000
            delayInfo.apiTime = usedTime
            delayInfo.ai = res && res.response
          }

          if (res.response) {
            // 判断是否挂断电话，如果是，则结束对话
            let text = res.response || ''
            const originalText = text

            const isCuttingOff =
              text.includes('#挂断电话#') || text.includes('#离开门店#') || text.includes('#离开银行#')

            if (isCuttingOff) {
              // 如果有挂断电话，则不播放任何语音
              text = ''
            }

            // 显示对话
            if (this.isKyc) {
              this.list.push(isCuttingOff ? '#离开门店#' : res.response)
            } else if(this.isFC) {
              this.list.push(isCuttingOff ? '#离开银行#' : res.response)
            } else {
              this.list.push(isCuttingOff ? '#挂断电话#' : res.response)
            }

            // 如果有内容，则播放语音
            if (text) {
              // 记录tts时间
              const tts_startTime = new Date().getTime()
              try {
                await this.playAudio(text)
              } finally {
                // 计算用时
                const tts_endTime = new Date().getTime()
                const usedTime = (tts_endTime - tts_startTime) / 1000
                delayInfo.ttsTime = usedTime
              }
            }

            // !!!请注意，先tts，再显示文字
            // 否则用户先看到文字，过一会儿才能听到声音，感觉会有延迟
            // 追加对话内容
            if (originalText) {
              let contentText = ''
              if (this.isKyc) {
                contentText = isCuttingOff ? '#离开门店#' : originalText
              } else if(this.isFC)  {
                contentText = isCuttingOff ? '#离开银行#' : originalText
              } else {
                contentText = isCuttingOff ? '#挂断电话#' : originalText
              }

              this.chats.push({
                speaker: 'ai',
                content: contentText // 如果是挂断电话，则只记录挂断电话这几个文字，不要包含其他内容
              })
            }

            // 如果是挂断，则挂断电话
            if (isCuttingOff) {
              this.hangUpByAI()
            }
          }
        }
      } catch (ex) {
        // 记录错误
        wxlog.info('对话错误', ex)
      } finally {
        // 更新最近一次对话的时间戳
        this.lastTalkTimestamp = new Date().getTime()

        // 结束思考
        this.isAiThinking = false

        // 记录小程序log
        wxlog.info('API_001对话', delayInfo)
      }
    },

    // 播放声音
    async playAudio(audioText) {
      if (!this.playState) return
      if (!audioText) return
      if (this.hasLeaveCalled) return // 如果已离开页面，则不播放声音
      const tts = this.tts
      if (tts) {
        await tts.start(audioText)
      }
    },
    // 结束播放声音
    async stopAudio() {
      if (this.playState && this.tts) {
        await this.tts.stop()
      }
      this.greetingCtx && this.greetingCtx.stop()
    },
    // 语音输入的计时器
    async handleAudioTimer() {
      this.audioSecond = MAX_ASR_SECONDS
      await this.clearAudioTimer()
      this.audioTimer = setInterval(async () => {
        this.audioSecond--
        // 更新最近一次对话的时间戳，防止超时退出对话页面
        this.lastTalkTimestamp = new Date().getTime()
        if (this.audioSecond === 0) {
          await this.handlerTouchend()
        }
      }, 1000)
    },
    // 关闭语音输入的计时器
    async clearAudioTimer() {
      if (this.audioTimer) clearInterval(this.audioTimer)
    },
    // 打开键盘
    openKeyboard() {
      this.inputValue = ''
    },
    changeInputValue(e) {
      // 更新最近一次对话的时间戳
      this.lastTalkTimestamp = new Date().getTime()
      this.inputValue = e.detail.value
    },
    confirmInput(e) {
      if (this.isAiThinking)
        return uni.showToast({
          title: '正在思考，请稍后',
          mask: true,
          icon: 'none'
        })
      this.inputValue = e.detail.value
      if (!this.inputValue) return
      this.list.push(this.inputValue)
      this.postAIForDialogue(this.inputValue)
      this.inputValue = ''
    },
    async confirmEnterInput() {
      if (this.isAiThinking)
        return uni.showToast({
          title: '正在思考，请稍后',
          mask: true,
          icon: 'none'
        })
      if (!this.inputValue) return
      this.list.push(this.inputValue)
      await this.postAIForDialogue(this.inputValue)
      this.inputValue = ''
      // 结束上次语音播放
      await this.stopAudio()
    },

    // 是否超过x秒未对话
    isHoldingTalkTimeout() {
      // 如果正在思考(等待AI返回)，则不挂断
      if (this.isAiThinking) return false

      const startTimestamp = this.lastTalkTimestamp || this.startTimestamp // 开始时间，或最近一次对话的时间
      if (!startTimestamp) {
        return false
      }
      const newTimestamp = new Date().getTime()
      return newTimestamp - startTimestamp > MAX_WAITING_SECONDS * 1000
    },

    // AI挂断
    async hangUpByAI() {
      await this.leavePage()
      this.isHangUp = true
      // if (!this.trainingID) {
      //   await this.hangUpTimerFun()
      // }
    },
    // 未对话挂断
    async hangUpByNoTalk() {
      // 是否已对话
      const hasAnyChat = this.chats.length > 1

      console.log('hasAnyChat', hasAnyChat)

      // 如果进入页面后未对话，则直接跳回
      if (!hasAnyChat) {
        await this.leavePage()
        this.isHangUp = true
        await this.hangUpTimerFun()
      } else {
        // 如果已对话，则提示挂断电话
        await this.leavePage()
        this.isHangUp = true
      }
    },

    // 挂断跳转（显示2秒后，自动返回）
    async hangUpTimerFun() {
      this.hangUpTimer = setTimeout(async () => {
        // this.isHangUp = false
        this.clearHangUpTimer()
        // 是否PreCase
        if (this.isPreCase) {
          if (this.difEntry !== 1) {
            uni.navigateBack({
              delta: 2
            })
          } else {
            this.navBack()
          }
        } else if (this.isOrient || this.isKnowledge) {
          // 定向训练 或者 产品知识测试
          this.navBack()
        } else {
          // 其他
          uni.redirectTo({
            url: `/pages/home/index`
          })
        }
      }, this.hangUpTimerSecond)
    },
    // 关闭挂断的延时器
    clearHangUpTimer() {
      if (this.hangUpTimer) clearTimeout(this.hangUpTimer)
    },
    // 训练结果
    async goTrainingResult() {
      this.isHangUp = false
      if (!this.trainingID) return
      uni.redirectTo({
        url: `/pages/training/result?id=${this.trainingID}&precaseid=${this.preCaseID}&difEntry=${this.difEntry}`
      })
    },
    // 返回
    async customNavBack() {
      await this.leavePage()
      if (this.trainingID) {
        return this.goTrainingResult()
      } else {
        if (this.isPreCase && this.difEntry !== 1) {
          uni.navigateBack({
            delta: 2
          })
        } else {
          this.navBack()
        }
      }
    },
    async leavePage() {
      // 防止重复调用
      if (this.hasLeaveCalled) {
        return
      }
      this.hasLeaveCalled = true
      // this.isHangUp = false

      this.clearTimer()
      this.clearHangUpTimer()
      await this.stopAsr(true)
      await this.stopAudio()
      this.clearAudioTimer()
      // 生成评价结果
      await this.completeTraining()

      // 释放限流
      // 如果有trainingID，不要释放限流（因为后台还在评价中），后台评价完成后，会自动释放资源
      // 没有trainingID，立即释放限流
      if (!this.trainingID) {
        await this.$api.releaseLimit({ ai: this.ai, sessionID: this.sessionID })
      }

      // 恢复loading转圈圈
      if (this.shouldRestoreLoading) {
        enableLoading()
      }
    },
    // 评价
    async completeTraining() {
      if (this.trainingID) return
      if (this.chats && this.chats.length > 1) {
        const res = await this.$api.completeTraining({
          ai: this.ai,
          sessionID: this.sessionID,
          totalSeconds: this.second,
          chats: this.chats,
          preCaseID: this.preCaseID
        })

        if (res && res.id) {
          this.trainingID = res.id
        }
      }
    },
    // 秒转分/秒
    secToTime(s) {
      var t = ''
      if (s > -1) {
        var min = Math.floor(s / 60) % 60
        var sec = s % 60
        if (min < 10) {
          t += '0'
        }
        t += min + ':'
        if (sec < 10) {
          t += '0'
        }
        t += sec.toFixed(0)
      }
      return t
    },
    getScrollHeight() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('#scroll-view')
        .boundingClientRect((res) => {
          this.scrollViewHeight = res.height
          this.marginTop = res.height
          this.scrollTop = res.height
        })
        .exec()
    },
    scrollToBottom() {
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select('#scroll-view-content')
          .boundingClientRect((res) => {
            let sonHeight = res.height
            if (sonHeight < this.scrollViewHeight) {
              this.marginTop = this.scrollViewHeight - sonHeight
              this.scrollTop = 0
            } else {
              this.scrollTop = sonHeight - this.scrollViewHeight
              this.marginTop = 0
            }
          })
          .exec()
      })
    }
  },
  onHide() {
    console.log('onHide')
    // 不要在这里调用leavePage，否则会触发后台生成评价
    // 前台继续对话的内容将不再记录
    // this.leavePage()
  },
  onUnload() {
    console.log('onUnload')
    if (this.asr) {
      this.asr.shutdown()
    }
    if (this.tts) {
      this.tts.shutdown()
    }
    this.leavePage()
  },
  async onPullDownRefresh() {
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {}
}
</script>

<style>
page {
  background-color: #100f12;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>

<style scoped>
.big-box {
  overflow-x: auto;
  white-space: nowrap;
  margin-left: 32rpx;
  margin-top: 24rpx;
  margin-right: 32rpx;
  bottom: 880rpx;
  height: calc(30vh - 100rpx);
}

.small-box {
  display: inline-block;
  width: 562rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  padding: 32rpx 40rpx;
  margin-left: 16rpx;
  vertical-align: top;
  overflow-y: auto;
  max-height: calc(28vh - 230rpx);
}

.content_title {
  height: 42rpx;
  font-weight: 500;
  font-size: 30rpx;
  color: #ff8433;
  line-height: 42rpx;
  text-align: left;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-style: normal;
}

.content_text {
  margin-top: 12rpx;
  font-weight: 400;
  font-size: 28rpx;
  text-align: left;
  color: rgba(255, 255, 255, 0.8);
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-style: normal;
  white-space: break-spaces;
}

.chat-page {
  width: 100vw;
  height: 100vh;
  /* background-color: #100f12; */
  background-repeat: no-repeat;
  background-size: contain;
}

.bg-img {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
}

/*客户- 时间 */
.chat-page-bg-box {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 48rpx;
  box-sizing: border-box;
  margin-top: 32rpx;
}

.chat-page-bg-ai {
  display: flex;
  align-items: baseline;
}

.chat-page-bg-ai-name {
  width: 458rpx;
  height: 54rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  font-size: 42rpx;
  color: #ffffff;
  line-height: 54rpx;
  text-align: left;
  font-style: normal;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-page-bg-ai-gender {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
  margin-right: 24rpx;
}

.chat-page-bg-time-box {
  background-color: rgba(0, 0, 0, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 32rpx;
  height: 64rpx;
  width: 156rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 26rpx;
  flex-shrink: 0;
}

.chat-page-bg-time-img {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}

.chat-page-tags {
  width: 100%;
  padding: 24rpx 48rpx;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}

.chat-page-tags-item {
  border-radius: 8rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  padding: 10rpx 16rpx;
  color: #ffffff;
  font-size: 26rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
}

/* 正文 */
.chat-page-content-fixed {
  position: fixed;
  left: 0;
  bottom: 288rpx;
  width: 100vw;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.chat-page-content {
  width: 80rpx;
  height: 80rpx;
  /* background-color: rgba(255, 255, 255, 0.75); */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.chat-page-content-play {
  width: 40rpx;
  height: 40rpx;
}

.chat-page-scroll {
  width: 100%;
  height: 432rpx;
  display: flex;
  align-items: flex-end;
  margin-top: 24rpx;
}

.chat-page-list-box {
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow-anchor: auto;
  box-sizing: border-box;
}

.chat-page-list-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}

.chat-page-list-item-cir {
  width: 36rpx;
  height: 36rpx;
  margin-right: 6rpx;
}

.chat-page-list-item-text {
  font-size: 26rpx;
  line-height: 38rpx;
  flex: 1;
}

.item-text-0 {
  color: #ffffff;
}

.item-text-1 {
  color: #cfcfcf;
}

.chat-page-list-write {
  display: flex;
  align-items: center;
  height: 38rpx;
  margin-top: 16rpx;
}

.chat-page-list-write-img {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}

/* 底部按钮 */
/* 底部背景图 */
.chat-page-butt-fixed-bg {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 960rpx;
  z-index: -1;
}

.chat-page-butt-fixed {
  position: fixed;
  bottom: 44rpx;
  left: 0;
  width: 100vw;
  padding: 0 16rpx;
  box-sizing: border-box;
  z-index: 6;
}

.chat-page-butt-tips {
  font-family: SourceHanSansCN-Light, SourceHanSansCN;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-top: 16rpx;
  line-height: 32rpx;
}

.chat-page-butt-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.chat-page-butt-change {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.chat-page-butt-img {
  width: 40rpx;
  height: 40rpx;
}

.chat-page-butt-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.chat-page-butt-content-input {
  border-radius: 40rpx;
  height: 80rpx;
  flex: 1;
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.6);
  font-size: 28rpx;
  color: #000000;
  padding: 0 40rpx;
  box-sizing: border-box;
  margin: 0 16rpx;
}

.chat-page-butt-content-input::placeholder {
  color: #787878;
  font-size: 28rpx;
}

.chat-page-butt-content-butt {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #ed171f;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
}

.chat-page-butt-audio {
  flex: 1;
  margin: 0 16rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #ed171f;
  position: relative;
}

/* 按住说话 */
.chat-page-popup {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  bottom: -96rpx;
  right: -32rpx;
  z-index: 999;
}

.chat-page-popup-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.chat-page-popup-title {
  margin-bottom: 212rpx;
  margin-left: 50rpx;
  margin-right: 50rpx;
  color: #ffffff;
  font-size: 42rpx;
  display: flex;
  align-items: center;
}

.chat-page-popup-tips-img {
  width: 240rpx;
  height: 48rpx;
}

.chat-page-popup-time {
  color: #ff8433;
  font-size: 30rpx;
  position: relative;
}

.chat-page-popup-time-text {
  position: absolute;
  right: -24rpx;
  bottom: 10rpx;
}

.chat-page-popup-text {
  color: #cfcfcf;
  font-size: 26rpx;
  margin-top: 40rpx;
  margin-bottom: 16rpx;
}

.chat-page-popup-end-img {
  width: 100%;
  height: 224rpx;
}

/* 挂断电话 */
.chat-page-handle-click {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-page-handle-click-title {
  color: #fff;
  font-size: 42rpx;
  line-height: 54rpx;
  margin-top: 152px;
}

.chat-page-handle-click-text {
  margin-top: 32rpx;
  color: #cfcfcf;
  font-size: 26rpx;
  line-height: 38rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.handle-click-sub-text {
  position: absolute;
  bottom: 9rpx;
  right: -24rpx;
}

.chat-page-handle-click-butt {
  margin-top: 160rpx;
  width: 356rpx;
  height: 92rpx;
  border: 2rpx solid #fff;
  border-radius: 46rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 38rpx;
}
</style>
