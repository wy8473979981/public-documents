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
        isAnswerWrong: false, // true:表示回答错误
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
      },
      {
        num: 3,
        isAnswered: false,
        isAnswerWrong: false,
        rightAnswers: 'C.700',
        question: '3.每年福利年度，符合条件的员工可以获得多少积分/人/年的超级积分？',
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
            correct: true
          }, {
            id: 4,
            text: 'D.800',
            icon: 0,
            correct: false
          }
        ]
      },
      {
        num: 4,
        isAnswered: false,
        isAnswerWrong: false,
        rightAnswers: 'B.600',
        question: '4.每年福利年度，符合条件的员工可以获得多少积分/人/年的超级积分？',
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
            correct: true
          }, {
            id: 3,
            text: 'C.700',
            icon: 0,
            correct: false
          }, {
            id: 4,
            text: 'D.800',
            icon: 0,
            correct: false
          }
        ]
      },
      {
        num: 5,
        isAnswered: false,
        isAnswerWrong: false,
        rightAnswers: 'A.500',
        question: '5.每年福利年度，符合条件的员工可以获得多少积分/人/年的超级积分？',
        answerList: [
          {
            id: 1,
            text: 'A.500',
            icon: 0,
            correct: true
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
            correct: false
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
    this.init();
  },
  init() {
    const { allQuestionList, currentIndex } = this.data;
    this.setData({ currentQuestion: allQuestionList[currentIndex] });
    console.log(allQuestionList[currentIndex]);
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