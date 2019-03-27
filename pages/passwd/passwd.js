// passwd.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    stuNum: null,
    oldPwdIn: '',
    newPwdIn: '',
    newPwd2In: ''
  },
  // 提交按钮事件
  submitBtn: function() {
    var that = this;
    if (this.data.oldPwdIn === '') {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    } else if (this.data.newPwdIn === '' || this.data.newPwd2In === '') {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    }
    if (this.data.newPwdIn !== this.data.newPwd2In) {
      wx.showToast({
        title: '两次输入的新密码不一致',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    } else if (this.data.oldPwdIn === this.data.newPwdIn) {
      wx.showToast({
        title: '新密码不能与旧密码相同',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认修改学号 "' + that.data.stuNum + '" 的密码',
      success: function(res) {
        if (that.data.stuNum === null) {
          return;
        }
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候',
            mask: true
          });
          wx.request({
            url: app.globalData.serverUrl,
            method: 'POST',
            data: {
              request: '106',
              code: app.globalData.userCode,
              stuNum: that.data.stuNum,
              oldPwd: that.data.oldPwdIn,
              newPwd: that.data.newPwdIn
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              wx.hideLoading();
              if (res.data.status === true) {
                wx.showToast({
                  title: '密码修改成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true
                });
                that.setData({
                  oldPwdIn: '',
                  newPwdIn: '',
                  newPwd2In: ''
                });
                setTimeout(function() {
                  wx.showModal({
                    title: '提示',
                    content: '您的学号已自动解绑，请使用新密码重新绑定',
                    showCancel: false,
                    complete(res) {
                      wx.navigateBack({
                        delta: 1
                      });
                    }
                  });
                }, 2100);
              } else if (res.data.status === false) {
                wx.showToast({
                  title: res.data.errMsg,
                  icon: 'none',
                  duration: 2000,
                  mask: false
                });
              } else {
                wx.showToast({
                  title: '系统维护中，请稍后再试',
                  icon: 'none',
                  duration: 2000,
                  mask: false
                });
              }
            },
            fail: function(res) {
              wx.hideLoading();
              wx.showToast({
                title: '网络故障',
                icon: 'none',
                duration: 2000,
                mask: false
              });
            }
          });
        }
      }
    });
  },
  // 原密码输入事件
  oldPwdInput: function(e) {
    this.setData({
      oldPwdIn: e.detail.value
    });
  },
  // 新密码输入事件
  newPwdInput: function(e) {
    this.setData({
      newPwdIn: e.detail.value
    });
  },
  // 确认新密码输入事件
  newPwd2Input: function(e) {
    this.setData({
      newPwd2In: e.detail.value
    });
  },
  // 页面加载事件
  onLoad: function(options) {
    this.setData({
      stuNum: options.stuNum
    });
  }
});