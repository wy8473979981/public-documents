<template>
  <view class="comm">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="top-coontent">
      <div class="title">
        <p class="_title1">建立客户人设</p>
        <p class="_title2">
          选择训练的客户维度, AI对练工具将生成最相似的陪练客户
        </p>
      </div>
      <p class="solid-line"></p>
    </div>

    <!-- 可以滑动的内容部分 (需要分类显示)-->
    <div class="move-content">
      <div
        class="content"
        v-for="(category, index) in groupedList"
        :key="index"
      >
        <div style="display: flex">
          <image
            src="/subpages/static/images/number1.png"
            v-if="category.groupName === mapping[1]"
            class="img-category"
            mode="aspectFill"
          />
          <image
            src="/subpages/static/images/number2.png"
            v-else-if="category.groupName === mapping[2]"
            class="img-category"
            mode="aspectFill"
          />
          <image
            src="/subpages/static/images/number3.png"
            v-else
            class="img-category"
            mode="aspectFill"
          />
          <p class="p-category">{{ category.groupName }}</p>
        </div>

        <div
          class="content"
          v-for="(item, _colorIndex) in category.items"
          :key="item.id"
        >
          <!-- 单选 || 多选 -->
          <p class="content_title" v-if="item.dimType !== 3">
            {{ item.title }}:
          </p>

          <div v-if="item.dimType !== 3">
            <span
              v-for="(item1, index1) in item.options"
              :key="item1"
              :class="[
                'content_select',
                item1 === item.defaultValue ||
                selectedIndexes.includes(`${item.id}-${index1}`)
                  ? getColor(_colorIndex)
                  : ''
              ]"
              @click="() => selectItem(`${item.id}-${index1}`, item1)"
              >{{ item1 }}</span
            >
          </div>

          <!-- 自由输入 -->
          <span v-if="item.dimType === 3 && item.isRequired" class="isRequired"
            >*</span
          >
          <div v-if="item.dimType === 3" class="input">
            <textarea
              placeholder="请自由输入客户人设, 限100字以内…"
              placeholder-class="placeholder-input"
              class="text-input"
              maxlength="100"
              v-model="item.defaultValue"
            />
          </div>
        </div>

        <p class="solid-line"></p>
      </div>
    </div>

    <div class="_button" @click="goNext">准备好了 开始训练</div>
  </view>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import { getPrecaseDims, getPrecasePrompt } from '@/api/index'

export default {
  mixins: [pageCommon],
  data() {
    return {
      navOption: {
        navTitle: '案前准备',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      preCaseList: [],
      preCaseSubmitList: [],
      selectedIndexes: [], // 用于存储当前选中的索引(支持多选)
      groupedList: [],
      mapping: {
        1: '客观事实',
        2: '状态判断',
        3: '自由输入'
      }
    }
  },
  async onShow() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      await this.getPrecaseDimsData()
    },
    // 点击时选中该项
    getLastData() {
      this.preCaseSubmitList = []
      for (const item of this.preCaseList) {
        this.preCaseSubmitList.push({
          name: item.name, // 此处使用name作为key，不要使用title
          value: item.defaultValue
        })
      }
    },

    //提交数据
    async goNext() {
      this.getLastData()

      // 自由输入和多选提交验证必填
      let itemByFind = this.preCaseList.find(
        (item) => item.dimType !== 0 && item.isRequired
      )

      if (itemByFind) {
        let _item = this.preCaseSubmitList.find(
          (item) => item.name === itemByFind.name
        )
        if (_item && !_item.value) {
          return uni.showModal({
            title: '提示',
            content: itemByFind.title + '为必填项',
            showCancel: false
          })
        }
      }
      //console.log(this.preCaseSubmitList)
      if (this.preCaseSubmitList) {
        const res = await getPrecasePrompt(this.preCaseSubmitList)
        if (res && res.id) {
          return uni.navigateTo({
            url: `/subpages/precase/precase?id=${res.id}`
          })
        }
      }
    },
    // 获取数据
    async getPrecaseDimsData() {
      if (this.preCaseList.length <= 0) {
        const res = await getPrecaseDims()
        this.preCaseList = res || []
        //没有默认值或者找不到就给第一个加
        for (const item of this.preCaseList) {
          if (
            item.options.length > 0 &&
            item.options.indexOf(item.defaultValue) < 0
          ) {
            item.defaultValue = item.options[0]
          }

          //如果是多选的话，需要selectedIndexes赋值默认选中
          if (item.dimType === 1) {
            const index =
              item.options.indexOf(item.defaultValue) > -1
                ? item.options.indexOf(item.defaultValue)
                : 0
            this.selectedIndexes.push(item.id + '-' + index)
          }
        }

        // 使用reduce进行分组
        const grouped = this.preCaseList.reduce((acc, item) => {
          const groupName = this.mapping[item.dimCate] || '未分类' // 处理空值
          acc[groupName] = acc[groupName] || []
          acc[groupName].push(item)
          return acc
        }, {})

        // 转换数据结构用于v-for渲染
        this.groupedList = Object.keys(grouped).map((groupName) => ({
          groupName,
          items: grouped[groupName]
        }))
      }
    },
    //获取默认背景色
    getColor(index) {
      let _colorIndex = ((index % 6) + 1).toString()
      let _res = 'selected_bg' + _colorIndex
      return _res
    },
    // 点击时选中该项
    selectItem(index, itemValue) {
      //获取当前的选择项
      const selectId = parseInt(index.split('-')[0])

      let itemByFind = this.preCaseList.find((item) => item.id === selectId)

      //区分多选处理
      if (itemByFind.dimType === 1) {
        let _temp =
          itemByFind.defaultValue !== ''
            ? itemByFind.defaultValue.split(',')
            : []
        if (_temp.includes(itemValue)) {
          const _index = _temp.indexOf(itemValue)
          _temp.splice(_index, 1)

          if (this.selectedIndexes.includes(index)) {
            const _index1 = this.selectedIndexes.indexOf(index)
            this.selectedIndexes.splice(_index1, 1)
          }
        } else {
          this.selectedIndexes.push(index)
          _temp.push(itemValue)
        }
        itemByFind.defaultValue = _temp.length > 0 ? _temp.join(',') : ''
      } else {
        itemByFind.defaultValue = itemValue
      }
    }
  }
}
</script>

<style scoped>
.isRequired {
  color: red;
  float: left;
  margin-top: 27rpx;
  margin-right: 10rpx;
}

.input {
  height: 192rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 28rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  margin-top: 48rpx;
  padding: 24rpx 40rpx;
  display: flex;
}
.placeholder-input {
  width: 622rpx;
  height: 144rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #787878;
  line-height: 36rpx;
  margin-top: 24rpx 40rpx;
}

.text-input {
  width: 622rpx;
  height: 144rpx;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 36rpx;
}

.img-category {
  width: 38rpx;
  height: 38rpx;
  margin: 34rpx 16rpx 0 21rpx;
}

.p-category {
  flex: 1;
  height: 42rpx;
  font-weight: 500;
  font-size: 30rpx;
  color: #ffffff;
  line-height: 42rpx;
  margin-top: 32rpx;
}

.top-coontent {
  position: fixed;
  width: 100%;
}

.move-content {
  margin-top: 180rpx;
  overflow-y: auto;
  height: calc(100vh - 550rpx);
}

.solid-line {
  background: rgba(255, 255, 255, 0.1);
  height: 2rpx;
  margin-top: 36rpx;
}

.comm {
  width: 100%;
  font-family: SourceHanSansCN, SourceHanSansCN;
  color: #ffffff;
  font-style: normal;
}

.title {
  text-align: left;
  margin: 48rpx 40rpx 28rpx 40rpx;
}

._title1 {
  height: 46rpx;
  font-weight: 500;
  font-size: 34rpx;
  line-height: 46rpx;
}

._title2 {
  height: 38rpx;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 38rpx;
  margin-top: 16rpx;
  color: rgba(255, 255, 255, 0.8);
}

.content {
  margin: 8rpx 19rpx 0 19rpx;
}

.content_title {
  width: 670rpx;
  height: 42rpx;
  font-weight: 500;
  font-size: 30rpx;
  color: #ffffff;
  line-height: 42rpx;
  margin: 48rpx 16rpx 12rpx 16rpx;
}

.content_select {
  margin: 12rpx 5rpx;
  min-width: 120rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 32rpx;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 400;
  font-size: 30rpx;
  line-height: 56rpx;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  padding: 6rpx 24rpx 8rpx 24rpx;
}

._button {
  width: 654rpx;
  height: 112rpx;
  background: #ed171f;
  border-radius: 56rpx;
  font-weight: 400;
  font-size: 38rpx;
  line-height: 112rpx;
  text-align: center;
  margin-left: 48rpx;
  position: fixed;
  bottom: 96rpx;
}

.selected {
  /* 这里定义选中时的样式 */
  color: red;
  font-weight: bold;
}

/* 选中显示不同的颜色 */
.selected_bg1 {
  background: linear-gradient(90deg, #f32159 0%, #f15116 100%, #f15116 100%);
}

.selected_bg2 {
  background: linear-gradient(270deg, #f99129 0%, #ed171f 100%);
}

.selected_bg3 {
  background: linear-gradient(90deg, #9856d5 0%, #f32159 100%);
}

.selected_bg4 {
  background: linear-gradient(90deg, #0058e3 0%, #3ea7ff 100%);
}

.selected_bg5 {
  background: linear-gradient(90deg, #00898a 0%, #67b71e 100%);
}

.selected_bg6 {
  background: linear-gradient(90deg, #8b30c6 0%, #8554ec 100%);
}
</style>
