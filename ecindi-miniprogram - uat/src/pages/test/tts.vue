<template>
  <div>
    <textarea
      v-model="inputText"
      style="width: 100%"
      :disabled="ttsProcessing"
    ></textarea>
    <radio-group @change="onLangChanged">
      <radio
        :disabled="ttsProcessing"
        value="zh"
        :checked="lang === 'zh'"
      /><span>中文</span>
      <radio
        :disabled="ttsProcessing"
        value="hk"
        :checked="lang === 'hk'"
      /><span>粤语</span>
    </radio-group>
    <button :disabled="ttsProcessing" @click="clickStart">合成</button>
    <button :disabled="!ttsProcessing" @click="clickStop">停止</button>
  </div>
</template>

<script>
import AliTts from '@/voice/ali/alitts.js'

export default {
  name: 'tts',
  data() {
    return {
      tts: null,
      ttsProcessing: false,
      voice: '',
      voiceZh: 'aicheng', // 音色
      voiceHk: 'jiajia', // 音色
      lang: 'zh',
      inputText: '',
      inputTextZh:
        '东亚银行的小陈理财经理啊，那你的工号是多少呢？这个活动是关于什么内容的？哎呀，周四上午十点我可能要带孩子去上兴趣班，不过你先说说看，是关于什么的呢？',
      inputTextHk:
        '你喺教我做嘢呀。人生落嚟嘅时候，都系一半，为咗揾到另一半而喺人世间行走。有人好好彩，好快就稳到啦。而有人就要搵一世。',
      accessToken: {}
    }
  },
  async created() {
    this.setVoiceAndLang()
    await this.initToken()
    await this.initTTs()
  },
  methods: {
    setVoiceAndLang() {
      if (this.lang === 'hk') {
        this.inputText = this.inputTextHk
        this.voice = this.voiceHk
        // this.voice = 'kelly'
        // this.voice = 'jiajia'
      } else {
        this.inputText = this.inputTextZh
        this.voice = this.voiceZh
      }
    },

    async onLangChanged(e) {
      this.lang = e.detail.value
      this.setVoiceAndLang()
      if (this.tts) {
        await this.tts.stop()
      }
      await this.initTTs()
    },

    async initToken() {
      const data = await this.$api.getTtsToken(this.lang)
      if (data) {
        this.accessToken = data
      }
    },

    async initTTs() {
      let tts = new AliTts({
        url: this.accessToken.url,
        appkey: this.accessToken.appKey,
        token: this.accessToken.token,
        userDataPath: wx.env.USER_DATA_PATH,
        voice: this.voice
      })

      // 赋值给全局变量
      this.tts = tts
    },

    async clickStart() {
      if (this.tts) {
        try {
          this.ttsProcessing = true
          await this.tts.start(this.inputText)
        } catch (ex) {
          console.error(ex)
        } finally {
          this.ttsProcessing = false
        }
      }
    },
    async clickStop() {
      try {
        if (this.tts) {
          await this.tts.stop()
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.ttsProcessing = false
      }
    }
  }
}
</script>

<style scoped></style>
