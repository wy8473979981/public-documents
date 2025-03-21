// pages/game2Page/game2Page.ts
import { getRequest, postRequest } from '../../utils/request.js';
import { allQuestionList } from './data.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    allQuestionList: allQuestionList,
    currentQuestion: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.getStorage({
      key: 'wxCode',
      success(res) {
        console.log(1, res.data)
      }
    })

    this.init();
    // this.pp();
    // this.pp1();

  },
  init() {
    const { allQuestionList, currentIndex } = this.data;
    this.setData({ currentQuestion: allQuestionList[currentIndex] });
    console.log(allQuestionList[currentIndex]);
  },
  async pp() {
    const res = await getRequest('/fan-sail/wx/user/login', { data: { code: 111 } })
    console.log(res);

  },
  async pp1() {
    const res = await postRequest('/fan-sail/wx/user/login', { data: { code: 111 } })
    console.log(res);

  },
  onClickAnswer(e: { currentTarget: { dataset: { answer: { id: number; correct: boolean } } } }) {
    const { answer } = e.currentTarget.dataset;
    const { allQuestionList, currentIndex } = this.data;
    const currentQuestion = allQuestionList[currentIndex];

    if (!currentQuestion.isAnswered) {
      currentQuestion.isAnswered = true;
      currentQuestion.answerList.forEach((ans: { id: number; correct: boolean; icon: number }) => {
        if (ans.id === answer.id) {
          ans.icon = answer.correct ? 2 : 1;
        } else if (ans.correct) {
          ans.icon = 2;
        }
      });

      if (!answer.correct) {
        currentQuestion.isAnswerWrong = true;
      }

      this.setData({ allQuestionList, currentQuestion: allQuestionList[currentIndex] });
    }
  },
  onPrevious() {
    const { currentIndex, allQuestionList } = this.data;
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      this.setData({
        currentIndex: previousIndex,
        currentQuestion: allQuestionList[previousIndex]
      });
    }
  },
  onNext() {
    const { currentIndex, allQuestionList } = this.data;
    const currentQuestion = allQuestionList[currentIndex];
    if (!currentQuestion.isAnswered) {
      wx.showToast({
        title: '请回答问题',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (currentIndex < allQuestionList.length - 1) {
      const nextIndex = currentIndex + 1;
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: allQuestionList[nextIndex]
      });
    }
  },
  onSubmit() {
    const { allQuestionList } = this.data;
    const totalQuestions = allQuestionList.length;
    const correctQuestions = allQuestionList.filter(question => !question.isAnswerWrong).length;
    const accuracyRate = (correctQuestions / totalQuestions) * 100;

    console.log(`回答正确率: ${accuracyRate.toFixed(0)}%`);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})