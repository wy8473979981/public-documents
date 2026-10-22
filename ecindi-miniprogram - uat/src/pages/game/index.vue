<template>
  <div
    class="game-page"
    :style="{
      paddingBottom: gameStatus === 'Completed' ? '356rpx' : ' 204rpx'
    }"
  >
    <nav-bar @navigateBack="navBack" :navOption="navOption"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <!-- 活动图 -->
    <img
      :src="game.headerURL"
      alt=""
      class="game-page-header-url"
      v-if="game && game.headerURL"
    />
    <!-- 比赛奖项提示 -->
    <template v-if="medalsList.length > 0">
      <game-medal-header
        v-for="(item, index) in medalsList"
        :key="index"
        :item="item"
      ></game-medal-header>
    </template>

    <!-- 时间倒计时 -->
    <game-time
      :gameStatus="gameStatus || ''"
      :showDay="showDay"
      :showHour="showHour"
      :showMinute="showMinute"
      :showSecond="showSecond"
    ></game-time>
    <!-- 个人 -->
    <template v-if="game && game.gameType === 0">
      <game-person
        :personList="personList"
        :rankNo="myPersonRank.rankNo || 0"
        :userID="myPersonRank.userID || 0"
        :medalsList="medalsList"
        :isGrantCalculated="game.isGrantCalculated"
        @goRulePage="goRulePage"
      ></game-person>
    </template>

    <!-- 网点 -->
    <template v-if="game && game.gameType === 1">
      <!-- tab -->
      <game-tab @changeTab="changeTab" :tabIndex="tabIndex"></game-tab>
      <!-- 网点或个人排名列表 -->
      <game-team
        v-if="tabIndex === 0"
        :teamList="teamList"
        :rankNo="myTeamRank.rankNo || 0"
        :orgID="myTeamRank.orgID || 0"
        :gameStatus="gameStatus || ''"
        @goRulePage="goRulePage"
      ></game-team>
      <game-person
        v-if="tabIndex === 1"
        :personList="personList"
        :rankNo="myPersonRank.rankNo || 0"
        :userID="myPersonRank.userID || 0"
        :gameType="game.gameType || 0"
        @goRulePage="goRulePage"
      ></game-person>
    </template>
    <!-- logo -->
    <div class="logo-box">
      <img
        src="../../static/icons/2132975495.png"
        alt=""
        class="logo"
      />
    </div>
    <template v-if="gameStatus !== 'NotStarted'">
      <!-- 个人提示 -->
      <game-person-tip
        :personRankNo="myPersonRank.rankNo || 0"
        :showMedal="showMedal"
        :gameStatus="gameStatus || ''"
        v-if="game && game.gameType === 0 && gameStatus !== 'Completed'"
      ></game-person-tip>
      <!-- 网点提示 -->
      <game-team-tip
        :teamRankNo="myTeamRank.rankNo || 0"
        :personRankNo="myPersonRank.rankNo || 0"
        :gameStatus="gameStatus || ''"
        v-if="game && game.gameType === 1 && gameStatus !== 'Completed'"
      ></game-team-tip>
      <div class="game-page-fixed">
        <!-- 个人提示 -->
        <game-person-tip
          :personRankNo="myPersonRank.rankNo || 0"
          :showMedal="showMedal"
          :gameStatus="gameStatus || ''"
          v-if="game && game.gameType === 0 && gameStatus === 'Completed'"
        ></game-person-tip>
        <!-- 网点提示 -->
        <game-team-tip
          :teamRankNo="myTeamRank.rankNo || 0"
          :personRankNo="myPersonRank.rankNo || 0"
          :gameStatus="gameStatus || ''"
          v-if="game && game.gameType === 1 && gameStatus === 'Completed'"
        ></game-team-tip>
        <!-- 按钮 -->
        <game-button :gameStatus="gameStatus || ''"></game-button>
      </div>
    </template>

    <!-- 排行榜最终公布后，进入排行榜的页面，获得勋章的用户自动显示获得勋章页面 -->
    <game-show-medal
      v-if="newMedalsList.length > 0 && gameStatus === 'Completed'"
      :newUserMedal="newUserMedal"
      @knowForMedal="knowForMedal"
    ></game-show-medal>

    <!-- 规则 -->
    <game-rule
      ref="ruleRef"
      :gameType="game.gameType || 0"
      :navTitle="navOption.navTitle"
    ></game-rule>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import gameCommon from '@/mixins/game.common.js'
import GameMedalHeader from '@/components/game/gameMedalHeader.vue'
import GameTime from '@/components/game/gameTime.vue'
import GameTab from '@/components/game/gameTab.vue'
import GameTeam from '@/components/game/gameTeam.vue'
import GamePerson from '@/components/game/gamePerson.vue'
import GameTeamTip from '@/components/game/gameTeamTip.vue'
import GamePersonTip from '@/components/game/gamePersonTip.vue'
import GameButton from '@/components/game/gameButton.vue'
import GameShowMedal from '@/components/game/gameShowMedal.vue'
import GameRule from '@/components/game/gameRule.vue'
export default {
  mixins: [pageCommon, gameCommon],
  data() {
    return {
      navOption: {
        navTitle: 'AI对练工具',
        backgroundColor: '',
        hasPlaceholder: false,
        showBackTip: true,
        color: '#fff'
      },
      tabIndex: 0,
      gameID: 0,
      myTeamRank: {}, //我的网点信息
      myPersonRank: {}, //个人在网点信息
      teamList: [], //网点
      personList: [], //个人
      medalsList: [], //勋章
      newMedalsList: [] //新勋章
    }
  },
  components: {
    GameMedalHeader,
    GameTime,
    GameTab,
    GameTeam,
    GamePerson,
    GameTeamTip,
    GamePersonTip,
    GameButton,
    GameShowMedal,
    GameRule
  },
  computed: {
    // 获得勋章
    showMedal() {
      let obj = {}
      let personRankNo = this.myPersonRank.rankNo || 0
      if (personRankNo && this.medalsList.length > 0) {
        this.medalsList.forEach((item) => {
          if (personRankNo <= Number(item.x)) {
            obj = item.medal || {}
          }
        })
      }
      return obj
    },
    // 新的勋章
    newUserMedal() {
      if (this.newMedalsList.length > 0) return this.newMedalsList[0]
      else return {}
    }
  },
  async onLoad(options) {
    if (options && options.id) {
      this.gameID = Number(options.id)
      await this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      if (!this.gameID) return
      await this.getMyNewForMedal()
      await this.getDetailForGame()
      await this.setCountdown()
      await this.getMedalsForGame()
      // 个人
      if (this.game.gameType === 0) {
        await this.getRankUserForGame()
      }
      // 网点
      if (this.game.gameType === 1) {
        await this.getRankOrgForGame()
        await this.getRankOrgUserForGame()
      }
    },
    // 活动详情
    async getDetailForGame() {
      this.game = await this.$api.getDetailForGame(this.gameID)
      if (this.game.gameName) {
        this.navOption.navTitle = this.game.gameName
      }
    },
    // 用户是否获取新勋章
    async getMyNewForMedal() {
      const res = await this.$api.getMyNewForMedal(this.gameID)
      this.newMedalsList = res.data || []
    },
    // 活动勋章
    async getMedalsForGame() {
      const res = await this.$api.getMedalsForGame(this.gameID)
      this.medalsList = res || []
    },
    // 网点：网点榜单
    async getRankOrgForGame() {
      const res = await this.$api.getRankOrgForGame(this.gameID)
      this.teamList = res.ranks || []
      this.myTeamRank = res.myRank || {}
    },
    // 网点：个人榜单
    async getRankOrgUserForGame() {
      const res = await this.$api.getRankOrgUserForGame(this.gameID)
      this.myPersonRank = res.myRank || {}
      this.personList = res.ranks || []
    },
    // 个人
    async getRankUserForGame() {
      const res = await this.$api.getRankUserForGame(this.gameID)
      this.myPersonRank = res.myRank || {}
      this.personList = res.ranks || []
    },
    changeTab(index) {
      this.tabIndex = index
    },
    async knowForMedal(userMedalID) {
      await this.$api.noticedUserForMedal(userMedalID)
      await this.fetchData()
    },
    // 打开规则
    goRulePage() {
      this.$refs.ruleRef.open()
    }
  },
  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
  },
  onUnload() {
    this.clearCountdown()
  }
}
</script>

<style scoped>
.game-page {
  /* padding-bottom: 204rpx; */
  box-sizing: border-box;
}
.game-page-header-url {
  width: 100%;
  height: 468rpx;
}
.logo-box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 120rpx 0;
}
.logo {
  width: 158rpx;
  height: 32rpx;
}
.game-page-fixed {
  width: 100%;
  position: fixed;
  z-index: 11;
  left: 0;
  bottom: 0;
  background-image: linear-gradient(
    to bottom,
    rgba(76, 0, 20, 0),
    rgba(76, 0, 20, 0.25),
    rgba(76, 0, 20, 1),
    rgba(76, 0, 20, 1)
  );
  padding-top: 40rpx;
  padding-bottom: 96rpx;
}
</style>
