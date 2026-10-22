const SpeechTranscription = require('./util/st')
const sleep = require('./util/util').sleep
const EventBus = require('./util/eventbus')

export class AliAsr {
  _config = null
  _client = null
  _event = null

  _stResult = null // 识别结果对象
  _stText = '' // 识别结果文本（sentence）
  _outputText = '' // 识别结果文本（整段）

  _stProcessing = false // 是否正在识别中
  _hasCompleteEventTriggered = false // 是否触发过完成事件

  // 构造函数
  constructor({ url, token, appkey }) {
    this._event = new EventBus()
    this.init({
      url,
      token,
      appkey
    })
  }

  // 初始化
  init({ url, token, appkey }) {
    this._config = { url, token, appkey }
    // this._init_internal()
  }

  // 内部初始化
  _init_internal() {
    // log
    console.log('[asr] 开始初始化:', this._config)
    // 初始化录音管理器
    this.initRecorderManager()

    // 初始化st
    let st = new SpeechTranscription(this._config)

    st.on('started', (msg) => {
      this._hasCompleteEventTriggered = false
      console.log('[asr] Client recv started')
      this._stResult = null
      this._stText = ''
    })

    st.on('changed', (msg) => {
      console.log('[asr] Client recv changed:', msg)
      this._voiceConverted(msg)
    })

    st.on('completed', (msg) => {
      console.log('[asr] Client recv completed:', msg)
      this._emit_completed() // 触发完成事件
    })

    st.on('begin', (msg) => {
      console.log('[asr] Client recv sentenceBegin:', msg)
    })

    st.on('end', (msg) => {
      console.log('[asr] Client recv sentenceEnd:', msg)
      this._voiceConverted(msg, true)
    })

    st.on('closed', () => {
      console.log('[asr] Client recv closed')
    })

    st.on('failed', (msg) => {
      console.log('[asr] Client recv failed:', msg)
      const errMsg = '[asr] Client recv failed: ' + msg
      this._emit_error(errMsg) // 触发错误事件
    })

    this._client = st
  }

  // 初始化录音管理器
  async initRecorderManager() {
    wx.getRecorderManager().onFrameRecorded((res) => {
      if (res.isLastFrame) {
        console.log('[asr] record done')
      }
      if (this._client && this._stProcessing) {
        console.log('[asr] send ' + res.frameBuffer.byteLength)
        this._client.sendAudio(res.frameBuffer)
      }
    })

    wx.getRecorderManager().onStart(() => {
      console.log('[asr] start recording...')
    })

    wx.getRecorderManager().onStop((res) => {
      console.log('[asr] stop recording...')
      if (res.tempFilePath) {
        wx.getFileSystemManager().removeSavedFile({
          filePath: res.tempFilePath
        })
      }
    })

    wx.getRecorderManager().onError((res) => {
      console.log('[asr] recording failed:' + res)
    })
  }

  // 开始
  async start() {
    // 清空文字
    this._outputText = ''

    // 判断是否需要初始化
    let shouldInit = false
    if (!this._client) {
      console.log('[asr] st is null, 需要初始化')
      shouldInit = true
    } else if (!this._client._client) {
      console.log('[asr] st._client is null，需要初始化')
      shouldInit = true
    }

    // 是否需要初始化
    if (shouldInit) {
      this._init_internal()
    }

    if (this._stProcessing) {
      console.log('[asr] st is started!')
      return
    }

    let st = this._client
    try {
      await st.start(st.defaultStartParams())
      this._stProcessing = true
    } catch (e) {
      console.log('[asr] start failed:' + e)
      const errMsg = '[asr] start failed:' + e
      this._emit_error(errMsg) // 触发错误事件

      wx.showModal({
        title: '语音识别无法启动',
        content: errMsg,
        showCancel: false
      })

      return
    }

    wx.getRecorderManager().start({
      duration: 600000,
      numberOfChannels: 1,
      sampleRate: 16000,
      format: 'PCM',
      frameSize: 4
    })
  }

  // 停止
  async stop(forced = false) {
    console.log('[asr] 调用停止方法, forced:', forced)
    wx.getRecorderManager().stop()

    try {
      // await sleep(500)
      if (this._stProcessing && this._client) {
        try {
          console.log('[asr] prepare close st')
          // 是否需要等待语音识别彻底完成
          const shouldWait = !forced
          if (shouldWait) {
            await this._waitForStCompleted()
          }
          await this._client.close()
        } catch (e) {
          console.log('[asr] close st failed:' + e)
        }
      }
    } finally {
      // 清空状态
      this._stProcessing = false
    }
  }

  // 等待语音识别完成
  async _waitForStCompleted() {
    if (this._hasCompleteEventTriggered) {
      console.log(
        '[asr] _hasCompleteEventTriggered',
        this._hasCompleteEventTriggered
      )
      return
    }

    const MAX_WAIT_SECONDS = 500 // 最大等待毫秒数
    const SLEEP_INTERVAL = 250 // 等待间隔
    for (let i = 0; i < MAX_WAIT_SECONDS / SLEEP_INTERVAL; i++) {
      if (this._hasCompleteEventTriggered) {
        return
      }
      console.log('[asr] _waitForStCompleted ...')
      await sleep(SLEEP_INTERVAL)
    }
    console.log('[asr] _waitForStCompleted timeout')
  }

  // 析构函数
  shutdown() {
    console.log('[asr] st shutdown...')
    this._stProcessing = false
    wx.getRecorderManager().stop()
    if (this._client) {
      this._client.shutdown()
    } else {
      console.log('[asr] st is null')
    }
  }

  async _voiceConverted(msg, isSentenceEnded = false) {
    if (typeof msg === 'string') {
      msg = JSON.parse(msg)
    }
    this._stResult = msg

    let text = msg && msg.payload && msg.payload.result
    // console.log('[asr] stResult', msg)
    // console.log('[asr] text', text)

    // 如果一句结束，则拼接结果
    if (isSentenceEnded) {
      this._outputText += text
      text = ''
    }
    this._stText = text

    this._emit_handling() // 触发进行中事件
  }

  // 触发事件
  _emit_handling() {
    this._event.emit('handling', this._outputText + this._stText)
  }
  _emit_completed() {
    this._hasCompleteEventTriggered = true
    this._event.emit('completed', this._outputText)
  }
  _emit_error(errMsg) {
    this._hasCompleteEventTriggered = true
    this._event.emit('error', errMsg)
  }

  on(which, handler) {
    this._event.off(which)
    this._event.on(which, handler)
  }
}

export default AliAsr
