/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-03-21 16:33:11
 * @LastEditors: wangyang
 * @LastEditTime: 2025-03-23 15:19:34
 */
Page({
  data: {
    croppedImagePath: '', // 存储裁剪后的图片
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
          },
        });
      },
    });
  },

  /**
   * 裁剪图片
   * @param imagePath 图片路径 (string)
   * @param imgWidth 原始图片宽度 (number)
   * @param imgHeight 原始图片高度 (number)
   */
  cropImage(imagePath: string, imgWidth: number, imgHeight: number) {
    const _this = this;
    const targetWidth = 1242;
    const targetHeight = 2208;

    const query = wx.createSelectorQuery();
    query
      .select('#cropCanvas')
      .node()
      .exec((res) => {
        // 检查 res[0] 是否存在并且包含 node 属性
        if (res[0] && res[0].node) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 设置 Canvas 尺寸
          canvas.width = 1242;
          canvas.height = 2208;

          // 绘制图片到 Canvas
          const img = canvas.createImage();
          img.src = imagePath;
          img.onload = () => {
            ctx.drawImage(
              img,
              0,
              0,
              imgWidth,
              imgHeight,
              0,
              0,
              targetWidth,
              targetHeight
            );

            // 将 Canvas 转为图片
            wx.canvasToTempFilePath({
              canvas: canvas,
              fileType: 'jpg',
              quality: 1,
              success(res) {
                _this.setData({
                  croppedImagePath: res.tempFilePath,
                });
                wx.showToast({ title: '裁剪完成', icon: 'success' });
              },
              fail(err) {
                console.error('裁剪失败：', err);
              },
            });
          };
        } else {
          console.error('Canvas node not found');
        }
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
        console.error('保存失败：', err);
        if (
          err.errMsg.includes('auth deny') ||
          err.errMsg.includes('auth denied')
        ) {
          wx.showModal({
            title: '提示',
            content: '请授权微信访问相册，以便保存图片。',
            showCancel: false,
            success() {
              wx.openSetting(); // 打开设置引导用户授权
            },
          });
        }
      },
    });
  },
});
