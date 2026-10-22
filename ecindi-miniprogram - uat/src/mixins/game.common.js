export default {
  data() {
    return {
      game: {},
      timer: null,
      diffDate: 0,
      showDay: '',
      showHour: '',
      showMinute: '',
      showSecond: ''
    }
  },
  computed: {
    // 当前日期
    nowDate() {
      return this.$dayjs().format('YYYY-MM-DD')
    },

    openDate() {
      if (this.game.openDate)
        return this.$dayjs(this.game.openDate).format('YYYY-MM-DD')
      else return this.nowDate
    },
    closeDate() {
      if (this.game.closeDate)
        return this.$dayjs(this.game.closeDate).format('YYYY-MM-DD')
      else return this.nowDate
    },
    // 判断活动：未开始、进行中、已完成
    gameStatus() {
      let isOk = this.openDate && this.closeDate
      if (!isOk) return ''
      if (this.nowDate < this.openDate) return 'NotStarted'
      if (this.nowDate >= this.openDate && this.nowDate <= this.closeDate)
        return 'InProgress'
      if (this.nowDate > this.closeDate) return 'Completed'
      return ''
    },
    // 判断活动：未开始、进行中、已完成
    gameLabelStatus() {
      if (this.gameStatus === 'NotStarted') return '未开始'
      if (this.gameStatus === 'InProgress') return '进行中'
      if (this.gameStatus === 'Completed') return '已完成'
      if (this.gameStatus === '') return ''
    }
  },
  methods: {
    // 设计倒计时
    async setCountdown() {
      this.clearCountdown()
      this.timer = setInterval(() => {
        let nowDateSecond = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        let closeDate = `${this.closeDate} 23:59:59`
        let diffDate = this.$dayjs(closeDate).diff(
          this.$dayjs(nowDateSecond),
          'second'
        )
        let oneDay = 24 * 60 * 60
        let oneHour = 60 * 60
        let showDay = parseInt(diffDate / oneDay)
        this.showDay = showDay > 9 ? showDay : `0${showDay}`
        let sumDay = diffDate % oneDay
        let showHour = parseInt(sumDay / oneHour)
        this.showHour = showHour > 9 ? showHour : `0${showHour}`
        let sumHour = sumDay % oneHour
        let showMinute = parseInt(sumHour / 60)
        this.showMinute = showMinute > 9 ? showMinute : `0${showMinute}`
        let showSecond = sumHour % 60
        this.showSecond = showSecond > 9 ? showSecond : `0${showDay}`
      }, 1000)
    },
    async clearCountdown() {
      if (this.timer) clearInterval(this.timer)
    }
  }
}
