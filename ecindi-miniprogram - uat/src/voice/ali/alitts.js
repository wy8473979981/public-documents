const SpeechSynthesizer = require('./util/tts.js')

const fs = wx.getFileSystemManager()

const sleep = require('./util/util').sleep

export class AliTts {
  _config = null
  _client = null

  _userDataPath = '/' // 用户路径
  saveFile = null // 保存的文件路径
  saveFd = null // 保存的文件句柄

  _audioContext = null // 播放器

  voice = '' // 语音名称
  volume = 50 // 音量
  speech_rate = 0 // 语速
  pitch_rate = 0 // 音调

  _ttsProcessing = false // 是否正在合成中
  _isPlaying = false // 是否正在播放

  constructor({
    url,
    token,
    appkey,
    userDataPath,
    voice,
    volume,
    speech_rate,
    pitch_rate,
    emotion
  }) {
    this.init({
      url,
      token,
      appkey,
      userDataPath,
      voice,
      volume,
      speech_rate,
      pitch_rate,
      emotion
    })
  }

  init({
    url,
    token,
    appkey,
    userDataPath,
    voice,
    volume,
    speech_rate,
    pitch_rate,
    emotion
  }) {
    this._config = { url, token, appkey }
    this._userDataPath = userDataPath
    this.voice = voice
    this.volume = volume
    this.speech_rate = speech_rate
    this.pitch_rate = pitch_rate
    this.emotion = emotion
    let tts = new SpeechSynthesizer(this._config)

    tts.on('meta', (msg) => {
      console.log('Client recv metainfo:', msg)
    })

    tts.on('data', (msg) => {
      console.log(`recv size: ${msg.byteLength}`)
      //console.log(dumpFile.write(msg, "binary"))
      const filePath = this.saveFile
      if (!filePath) {
        console.log('未设置保存文件')
      }

      try {
        fs.appendFileSync(filePath, msg, 'binary')
        console.log(`append ${msg.byteLength}`)
      } catch (e) {
        console.error(e)
      }
    })

    tts.on('completed', async (msg) => {
      console.log('Client recv completed:', msg)
      // 这里为什么需要sleep？
      await sleep(100)
      // await sleep(500)
      fs.close({
        fd: this.saveFd,
        success: (res) => {
          this.playVoice(this.saveFile)
          this.saveFile = null
          this.saveFd = null
        },
        fail: (res) => {
          console.log('saved file error:' + res.errMsg)
        }
      })
    })

    tts.on('closed', () => {
      console.log('Client recv closed')
    })

    tts.on('failed', (msg) => {
      console.log('Client recv failed:', msg)
    })

    // 赋值给全局变量
    this._client = tts
  }

  async start(inputText) {
    if (!inputText) {
      wx.showToast({
        title: '请输入文字',
        icon: 'error',
        duration: 1000,
        mask: true
      })
      return
    }

    // if (this._ttsProcessing || this._isPlaying) {
    //   wx.showToast({
    //     title: '正在合成中',
    //     icon: 'error',
    //     duration: 1000
    //     // mask: true
    //   })
    //   return
    // }

    if (!this._client) {
      wx.showToast({
        title: 'tts未初始化',
        icon: 'error',
        duration: 1000
        // mask: true
      })
      return
    }

    // 先停止播放之前的声音
    this.stopVoice()

    // 设置开始标识
    this._ttsProcessing = true

    // 等待转换完成，再返回
    try {
      await this._convertVoice(inputText)
    } finally {
      this._ttsProcessing = false
    }
  }

  // 内部合成方法
  async _convertVoice(inputText, savePath) {
    return new Promise((resolve, reject) => {
      // 设置文件路径
      let savePath = `${this._userDataPath}/${new Date().getTime()}.mp3`
      console.log(`saving to ${savePath}`)

      // 打开文件
      fs.open({
        filePath: savePath,
        flag: 'a+',
        success: async (res) => {
          console.log(`打开文件成功 ${savePath}`)
          this.saveFd = res.fd
          this.saveFile = savePath
          let param = this._client.defaultStartParams()

          let emotion = this.emotion
          let ttsText = this._build_tts_text(inputText, emotion)

          param.text = ttsText
          // 设置语音合成参数
          param.voice = this.voice
          param.volume = this.volume
          param.speech_rate = this.speech_rate
          param.pitch_rate = this.pitch_rate
          try {
            // 开始计时
            const beginTime = new Date().getTime()
            await this._client.start(param)
            // 合成结束
            console.log('tts 合成成功')
            // 结束计时
            const endTime = new Date().getTime()
            // 耗时
            const diffTime = endTime - beginTime
            console.log('耗时', diffTime / 1000)

            // 文件信息
            fs.fstat({
              fd: res.fd,
              success(res) {
                console.log('$$$$$$$文件信息$$$$$$$', res.stats)
              }
            })

            // 成功
            resolve()
          } catch (e) {
            console.log('tts 合成失败', e)
            // 失败
            reject()
            // } finally {
            //   this._ttsProcessing = false
          }
        },
        fail: (res) => {
          console.log(`打开文件错误 ${savePath}`, res)
          // 失败
          reject()
        }
      })
    })
  }

  // 构建tts文本
  _build_tts_text(inputText, emotion) {
    // 如果emotion存在，则构建emotion标签
    if (emotion) {
      // SSML标记语言文档：https://help.aliyun.com/zh/isi/developer-reference/ssml-overview
      return `<speak><emotion category="${emotion}" intensity="1">${inputText}</emotion></speak>`
    }
    return inputText
  }

  async stop() {
    // 停止录音
    this.stopVoice()
    if (this._client && this._client._client) {
      this._client._client.shutdown()
    }
  }

  async stopVoice() {
    if (this._audioContext) {
      // 停止播放
      this._audioContext.stop()
    }
    this._ttsProcessing = false
    this._isPlaying = false
  }

  // 设置音色
  async setVoice({ voice, volume, speech_rate, pitch_rate, emotion }) {
    this.voice = voice
    this.volume = volume
    this.speech_rate = speech_rate
    this.pitch_rate = pitch_rate
    this.emotion = emotion
  }

  // 播放wav文件
  playVoice(url) {
    const isLocal = url.indexOf('http') === -1
    let ctx = this._audioContext
    // 如果不存在，则初始化
    if (!ctx) {
      ctx = wx.createInnerAudioContext()
      this._audioContext = ctx
    }
    ctx.autoplay = true
    ctx.src = url
    ctx.onPlay(() => {
      // 开始播放
      console.log('ctx开始播放..')
      this._isPlaying = true
    })
    ctx.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      if (isLocal) {
        fs.unlink({
          filePath: url,
          success: (res) => {
            console.log(`remove ${url} done`)
            // this.saveFile = null
            // this.saveFd = null
          },
          failed: (res) => {
            console.log('remove failed:' + res.errMsg)
          }
        })
      }
    })
    ctx.onEnded((res) => {
      // 结束
      console.log('ctx播放完毕...')
      this._isPlaying = false
      this._audioContext = null
      fs.unlink({
        filePath: this.saveFile,
        success: (res) => {
          console.log(`remove ${this.saveFile} done`)
          this.saveFile = null
          this.saveFd = null
        },
        failed: (res) => {
          console.log('remove failed:' + res.errMsg)
        }
      })
    })
  }

  shutdown() {
    if (this._client) {
      this._client.shutdown()
    }
  }

  async on(which, handler) {
    return await this._client.on(which, handler)
  }
}

export default AliTts
