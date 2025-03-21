Page({
  data: {
    croppedImagePath: "" // 存储裁剪后的图片
  },

  // 选择图片并裁剪
  chooseAndCropImage() {
    const _this = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        wx.getImageInfo({
          src: tempFilePath,
          success(imgInfo) {
            _this.cropImage(tempFilePath, imgInfo.width, imgInfo.height);
          }
        });
      }
    });
  },

  // 裁剪图片
  cropImage(imagePath, imgWidth, imgHeight) {
    const _this = this;
    const targetWidth = 1242;
    const targetHeight = 2208;

    const ctx = wx.createCanvasContext('cropCanvas');
    ctx.drawImage(imagePath, 0, 0, imgWidth, imgHeight, 0, 0, targetWidth, targetHeight);
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'cropCanvas',
        fileType: 'jpg',
        quality: 1,
        success(res) {
          _this.setData({
            croppedImagePath: res.tempFilePath
          });
          wx.showToast({ title: '裁剪完成', icon: 'success' });
        },
        fail(err) {
          console.error("裁剪失败：", err);
        }
      });
    });
  },

  // 下载裁剪后的图片
  saveImage() {
    const _this = this;
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.croppedImagePath,
      success() {
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail(err) {
        console.error("保存失败：", err);
        if (err.errMsg.includes("auth deny") || err.errMsg.includes("auth denied")) {
          wx.showModal({
            title: "提示",
            content: "请授权微信访问相册，以便保存图片。",
            showCancel: false,
            success() {
              wx.openSetting(); // 打开设置引导用户授权
            }
          });
        }
      }
    });
  }
});
