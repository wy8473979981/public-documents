// pages/game2Page/game2Page.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    allQuestionList: [
      {
        num: 1,
        isAnswered: false,
        isAnswerWrong: false,
        rightAnswers: 'D.800',
        question: '1.每年福利年度，符合条件的员工可以获得多少积分/人/年的超级积分？',
        answerList: [
          {
            id: 1,
            text: 'A.500',
            icon: 0,
            correct: false
          }, {
            id: 2,
            text: 'B.600',
            icon: 0,
            correct: false
          }, {
            id: 3,
            text: 'C.700',
            icon: 0,
            correct: false
          }, {
            id: 4,
            text: 'D.800',
            icon: 0,
            correct: true
          }
        ]
      },
      {
        num: 2,
        isAnswered: false,
        isAnswerWrong: false,
        rightAnswers: 'D.800',
        question: '2.每年福利年度，符合条件的员工可以获得多少积分/人/年的超级积分？',
        answerList: [
          {
            id: 1,
            text: 'A.500',
            icon: 0,
            correct: false
          }, {
            id: 2,
            text: 'B.600',
            icon: 0,
            correct: false
          }, {
            id: 3,
            text: 'C.700',
            icon: 0,
            correct: false
          }, {
            id: 4,
            text: 'D.800',
            icon: 0,
            correct: true
          }
        ]
      }
    ],
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
    const { allQuestionList, currentIndex } = this.data;
    this.setData({ currentQuestion: allQuestionList[currentIndex] });
    console.log(allQuestionList[currentIndex]);

  },
  onClickAnswer(e: any) {
    const { answer } = e.currentTarget.dataset;
    const { allQuestionList, currentIndex } = this.data;
    const currentQuestion = allQuestionList[currentIndex];
    if (!currentQuestion.isAnswered) {
      currentQuestion.isAnswered = true;
      if (answer.correct) {
        currentQuestion.answerList.forEach((ans: any) => {
          if (ans.id === answer.id) {
            ans.icon = 2;
          }
        });
        this.setData({ allQuestionList });
      } else {
        currentQuestion.answerList.forEach((ans: any) => {
          if (ans.id === answer.id) {
            ans.icon = 1;
          } else {
            if (ans.correct) {
              ans.icon = 2;
            }
          }
        });
        currentQuestion.isAnswerWrong = true;
        this.setData({ allQuestionList });
      }
      this.setData({ currentQuestion: allQuestionList[currentIndex] })
    }
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