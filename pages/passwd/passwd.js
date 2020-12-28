// passwd.js

Page({
  data: {
    stuNum: null,
    oldPwdIn: '',
    newPwdIn: '',
    newPwd2In: ''
  },
  // 提交按钮事件
  submitBtn() {
    var that = this;

    if (that.data.oldPwdIn === '') {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    } else if (that.data.newPwdIn === '' || that.data.newPwd2In === '') {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    }

    if (that.data.newPwdIn !== that.data.newPwd2In) {
      wx.showToast({
        title: '两次输入的新密码不一致',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    } else if (that.data.oldPwdIn === that.data.newPwdIn) {
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
      success(res) {
        if (res.confirm && that.data.stuNum !== null) {
          wx.showLoading({
            title: '请稍候',
            mask: true
          });
          // 修改密码请求
          wx.request({
            url: getApp().globalData.serverUrl,
            method: 'POST',
            data: {
              request: getApp().globalData.reqCode.HTTP_REQ_CODE_APP_UPDATE_PSWD,
              wx_code: getApp().globalData.userCode,
              user_id: that.data.stuNum,
              old_passwd: that.data.oldPwdIn,
              new_passwd: that.data.newPwdIn
            },
            header: {
              'content-type': 'application/json'
            },
            // 修改密码请求成功
            success(res) {
              wx.hideLoading({
                complete(res) { /* empty statement */ }
              });
              if (res.data.result === true) {
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
                setTimeout(function () {
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
              } else if (res.data.result === false) {
                wx.showToast({
                  title: res.data.errmsg,
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
            // 修改密码请求失败
            fail(res) {
              wx.hideLoading({
                complete(res) { /* empty statement */ }
              });
              wx.showToast({
                title: '网络故障',
                icon: 'none',
                duration: 2000,
                mask: false
              });
            },
            // 修改密码请求完成
            complete(res) {
              console.log(res.errMsg);
            }
          });
        }
      }
    });
  },
  // 原密码输入事件
  oldPwdInput(e) {
    this.setData({
      oldPwdIn: e.detail.value
    });
  },
  // 新密码输入事件
  newPwdInput(e) {
    this.setData({
      newPwdIn: e.detail.value
    });
  },
  // 确认新密码输入事件
  newPwd2Input(e) {
    this.setData({
      newPwd2In: e.detail.value
    });
  },
  // 页面加载事件
  onLoad(e) {
    this.setData({
      stuNum: e.stuNum
    });
  }
});