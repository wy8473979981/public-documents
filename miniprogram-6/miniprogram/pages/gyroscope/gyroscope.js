Page({
  data: {
    current: 0,
  },
  onSwiperChange(e) {
    this.setData({
      current: e.detail.current,
    });
  },
  onIndicatorTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      current: parseInt(index, 10),
    });
  },
});