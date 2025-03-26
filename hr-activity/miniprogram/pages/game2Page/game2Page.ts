// pages/game2Page/game2Page.ts
import { postRequest } from '../../utils/request.js';
interface Answer {
  id: number;
  text: string;
  icon: number;
  correct: boolean;
}

interface Question {
  num: number;
  isAnswered: boolean;
  isAnswerWrong: boolean;
  rightAnswer: string;
  question: string;
  answerList: Answer[];
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    currentIndex: 0,
    allAnswersCompleted: false,
    allQuestionList: [] as Question[], // 明确类型为 Question[]
    currentQuestionList: [] as Question[], // 明确类型为 Question[]
    currentQuestion: {} as Question, // 明确类型为 Question
    answerResult: {
      pass: false, // 是否通过
      accuracyRate: 0, // 正确率
      wrongNum: 0, // 错题数
      correctNum: 0, // 正确题数
    },
    openId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const openId = wx.getStorageSync('openId');
    this.setData({ openId: openId });
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  init() {
    const data = wx.getStorageSync('dict');
    const dict = JSON.parse(data);
    const { bu_question } = dict;
    const order = ['A', 'B', 'C', 'D'];

    if (Array.isArray(bu_question) && bu_question.length > 0) {
      const list = bu_question.map((item: any, index: number): Question => {
        const qna = JSON.parse(item.enumvalue);
        const rightAnswerIndex = qna.options.findIndex((n: any) => n.correct)
        const rightAnswer = `${order[rightAnswerIndex]}.${qna.options[rightAnswerIndex]?.answer}`;
        return {
          num: index + 1,
          isAnswered: false,
          isAnswerWrong: false,
          rightAnswer: rightAnswer,
          question: qna.question,
          answerList: qna.options.map(
            (answerItem: any, answerIndex: number): Answer => ({
              id: answerIndex + 1,
              text: `${order[answerIndex]}.${answerItem.answer}`,
              icon: 0,
              correct: answerItem.correct,
            })
          ),
        };
      });

      const shuffledList = list.sort(() => 0.5 - Math.random());
      const currentQuestionList = shuffledList.slice(0, 5);
      this.setData({
        allQuestionList: list,
        currentQuestionList,
        currentQuestion: currentQuestionList[0],
      });
      console.log('currentQuestionList', currentQuestionList);
    }
  },
  onClickAnswer(e: any) {
    const { answer } = e.currentTarget.dataset;
    const { currentQuestionList, currentIndex } = this.data;
    const currentQuestion = currentQuestionList[currentIndex];

    // 类型保护：确保 currentQuestion 存在
    if (!currentQuestion) {
      console.error('当前题目不存在');
      return;
    }

    if (!currentQuestion.isAnswered) {
      currentQuestion.isAnswered = true;
      currentQuestion.answerList.forEach(
        (ans: { id: number; correct: boolean; icon: number }) => {
          if (ans.id === answer.id) {
            ans.icon = answer.correct ? 2 : 1;
          } else if (ans.correct) {
            ans.icon = 2;
          }
        }
      );

      // 更新当前问题是否回答错误的状态
      if (!answer.correct) {
        currentQuestion.isAnswerWrong = true;
      }

      this.setData({
        currentQuestionList,
        currentQuestion: currentQuestionList[currentIndex],
      });
    }

    // 检查所有问题是否已回答
    const allAnswered = currentQuestionList.every(
      (question) => question?.isAnswered
    );

    if (allAnswered) {
      this.setData({ allAnswersCompleted: true });
    }
  },
  onPrevious() {
    const { currentIndex, currentQuestionList } = this.data;
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      this.setData({
        currentIndex: previousIndex,
        currentQuestion: currentQuestionList[previousIndex],
      });
    }
  },
  onNext() {
    const { currentIndex, currentQuestionList } = this.data;
    const currentQuestion = currentQuestionList[currentIndex];
    if (!currentQuestion.isAnswered) {
      wx.showToast({
        title: '请回答问题',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (currentIndex < currentQuestionList.length - 1) {
      const nextIndex = currentIndex + 1;
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: currentQuestionList[nextIndex],
      });
    }
  },
  onSubmit() {
    const { currentQuestionList } = this.data;
    const totalQuestions = currentQuestionList.length;
    const correctNum = currentQuestionList.filter((question) => !question.isAnswerWrong).length;
    const wrongNum = totalQuestions - correctNum;

    this.setData({
      show: true,
      answerResult: {
        pass: correctNum >= 4,
        accuracyRate: Number(((correctNum / totalQuestions) * 100).toFixed(0)),
        wrongNum: wrongNum,
        correctNum: correctNum,
      },
    });
  },
  async onContinue() {
    const { answerResult, openId } = this.data;
    const params = {
      data: {
        status: 1,
        type: 2,
        openId: openId,
        score: answerResult.accuracyRate,
      },
    }
    const result = await postRequest('/activity/record', params);
    if (result.code === '200') {
      // 继续闯关
      wx.redirectTo({ url: '/pages/homePage/homePage' });
      this.onClickHide();
    } else {
      wx.showModal({
        title: '提示',
        content: '保存失败，请重新答题！',
        showCancel: false, // 禁用取消按钮
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            this.onAgain();
          }
        },
      });
    }
  },
  onAgain() {
    // 重新答题
    this.setData({
      currentIndex: 0,
      allAnswersCompleted: false
    });
    this.init();
    this.onClickHide();
  },
  onClickHide() {
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});