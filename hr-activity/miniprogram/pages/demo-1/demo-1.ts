Page({
  data: {
    targetSize: 3145728,
    compressedWidth: 1204,
  },

  // 选择图片
  chooseImage() {
    const { compressedWidth } = this.data;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        wx.compressImage({
          src: tempFilePath,
          quality: 80, // 质量压缩
          compressedWidth: compressedWidth,
          // compressedHeight: 2208,
          success: (res) => {
            const url = res.tempFilePath;
            this.saveImage(url);
            this.getFileSize(url);
          },
          fail() {
            wx.showToast({ title: '压缩失败', icon: 'none' });
          },
        });

      },
      fail: (err) => {
        console.error('选择图片失败:', err);
      }
    });
  },

  getFileSize: function (filePath: string) {
    const fs = wx.getFileSystemManager();
    fs.stat({
      path: filePath,
      success: (res: any) => {
        const fileSizeInBytes = res.stats.size; // 文件大小，单位字节
        const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2); // 转换为 KB 并保留两位小数
        console.log('文件大小：', fileSizeInBytes, '字节，', fileSizeInKB, 'KB');
      },
      fail: (err) => {
        console.error('获取文件大小失败：', err);
      }
    });
  },
  // 下载裁剪后的图片
  saveImage(url: any) {
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success() {
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail(err) {
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
