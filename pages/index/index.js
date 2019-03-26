// index.js
// 获取应用实例
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    prompt: '正在加载数据，请稍候...',
    userToken: null,
    nfcAvaliable: null,
    hasBound: null,
    stuNum: null,
    stuNumIn: '',
    stuPwdIn: '',
    lastTime: null,
    lastLocation: null
  },
  // 点击头像事件
  coverTap: function() {
    var that = this;
    that.setData({
      nfcAvaliable: null
    });
    wx.startHCE({
      aid_list: ['f222222222'],
      success: function(res) {
        that.setData({
          nfcAvaliable: true
        });
        wx.onHCEMessage(function(res) {
          if (res.messageType === 1) {
            if (that.data.userToken === null) {
              return;
            }
            var request_str = 'f222222222' + that.data.userToken;
            wx.sendHCEMessage({
              data: util.str2ab(request_str)
            });
            wx.hideLoading();
            wx.showToast({
              title: '数据传输完成',
              icon: 'success',
              duration: 1000,
              mask: true
            });
            that.setData({
              userToken: null
            });
          }
        });
      },
      fail: function(res) {
        that.setData({
          nfcAvaliable: false
        });
      }
    });
    setTimeout(function() {
      if (that.data.nfcAvaliable == true && that.data.hasBound == true) {
        wx.showLoading({
          title: '正在获取密钥',
          mask: true
        });
        wx.request({
          url: app.globalData.serverUrl,
          method: 'POST',
          data: {
            request: '102',
            code: app.globalData.userCode
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            wx.hideLoading();
            if (res.data.status === true) {
              that.setData({
                userToken: res.data.token
              });
              wx.showLoading({
                title: '请刷考勤终端',
                mask: true
              });
            } else if (res.data.status === false) {
              wx.showToast({
                title: res.data.errMsg,
                icon: 'none',
                duration: 2000,
                mask: true
              });
            } else {
              wx.showToast({
                title: '系统维护中，请稍后再试',
                icon: 'none',
                duration: 2000,
                mask: true
              });
            }
          },
          fail: function(res) {
            wx.hideLoading();
            wx.showToast({
              title: '网络故障',
              icon: 'none',
              duration: 2000,
              mask: true
            });
          }
        });
      }
    }, 200);
  },
  // 学号输入事件
  stuNumInput: function(e) {
    this.setData({
      stuNumIn: e.detail.value
    });
  },
  // 密码输入事件
  stuPwdInput: function(e) {
    this.setData({
      stuPwdIn: e.detail.value
    });
  },
  // 绑定用户事件
  bindBtn: function() {
    var that = this;
    if (this.data.stuNumIn == '') {
      wx.showToast({
        title: '请输入学号',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    } else if (this.data.stuPwdIn == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认绑定学号 "' + that.data.stuNumIn + '"',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候',
            mask: true
          });
          wx.request({
            url: app.globalData.serverUrl,
            method: 'POST',
            data: {
              request: '103',
              code: getApp().globalData.userCode,
              stuNum: that.data.stuNumIn,
              stuPwd: that.data.stuPwdIn
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              wx.hideLoading();
              if (res.data.status === true) {
                wx.showToast({
                  title: '微信绑定成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true
                });
                that.setData({
                  stuNumIn: '',
                  stuPwdIn: ''
                });
              } else if (res.data.status === false) {
                wx.showToast({
                  title: res.data.errMsg,
                  icon: 'none',
                  duration: 2000,
                  mask: true
                });
              } else {
                wx.showToast({
                  title: '系统维护中，请稍后再试',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                });
              }
            },
            fail: function(res) {
              wx.hideLoading();
              wx.showToast({
                title: '网络故障',
                icon: 'none',
                duration: 2000,
                mask: true
              });
            }
          });
        }
      }
    });
  },
  // 解绑用户事件
  unbindBtn: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认解绑您的学号 "' + that.data.stuNum + '"',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候',
            mask: true
          });
          wx.request({
            url: app.globalData.serverUrl,
            method: 'POST',
            data: {
              request: '104',
              code: getApp().globalData.userCode,
              stuNum: that.data.stuNum
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              wx.hideLoading();
              if (res.data.status === true) {
                wx.showToast({
                  title: '微信解绑成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true
                });
                that.setData({
                  stuNumIn: '',
                  stuPwdIn: ''
                });
              } else if (res.data.status === false) {
                wx.showToast({
                  title: res.data.errMsg,
                  icon: 'none',
                  duration: 2000,
                  mask: true
                });
              } else {
                wx.showToast({
                  title: '系统维护中，请稍后再试',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                });
              }
            },
            fail: function(res) {
              wx.hideLoading();
              wx.showToast({
                title: '网络故障',
                icon: 'none',
                duration: 2000,
                mask: true
              });
            }
          });
        }
      }
    });
  },
  // 页面加载事件
  onLoad: function() {
    var that = this;
    setInterval(function() {
      wx.request({
        url: app.globalData.serverUrl,
        method: 'POST',
        data: {
          request: '101',
          code: getApp().globalData.userCode
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.status === true) {
            that.setData({
              prompt: '请点击上方NFC标志签到',
              hasBound: true,
              stuNum: res.data.stuNum,
              lastTime: res.data.lastTime,
              lastLocation: res.data.lastLocation
            });
          } else if (res.data.status === false) {
            that.setData({
              prompt: '您未绑定学号，请在下方绑定',
              hasBound: false,
              stuNum: null,
              lastTime: null,
              lastLocation: null
            });
          } else {
            that.setData({
              prompt: '当前会话已过期，请重启小程序',
              hasBound: null,
              stuNum: null,
              lastTime: null,
              lastLocation: null
            });
          }
        }
      });
    }, 1000);
  },
  // 页面恢复事件
  onShow: function() {
    wx.hideLoading();
    this.setData({
      userToken: null
    });
  }
});