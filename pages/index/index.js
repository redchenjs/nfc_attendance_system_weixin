//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
      motto: '努力加载中(..•˘_˘•..)...',
    userInfo: {},
    userToken: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasBound: null,
    stuNum: null,
    stuNumIn: '',
    stuPwdIn: '',
    lastTime: null,
    lastLocation: null
  },
  //事件处理函数
  bindViewTap: function() {
      if (this.data.hasBound == true) {
          wx.showLoading({
              title: '正在获取密钥',
              mask: true
          });
          var that = this;
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
              success: function (res) {
                wx.hideLoading();
                if (res.data.status === true) {
                    that.setData({
                        userToken: res.data.token
                    })
                    wx.showLoading({
                        title: '请刷考勤机',
                        mask: true
                    });
                } else if (res.data.status === false) {
                    wx.showToast({
                        title: '禁止签到',
                        icon: 'none',
                        duration: 2000
                    });
                } else if (res.data.status === null) {
                    wx.showToast({
                        title: '服务器故障',
                        icon: 'none',
                        duration: 2000
                    });
                }
              },
              fail: function (res) {
                  wx.hideLoading();
                  wx.showToast({
                      title: '网络故障，请稍后重试',
                      icon: 'none',
                      duration: 2000
                  });
              },
          });
      }
  },
  unbindBtn: function () {
      var that = this;
      wx.showModal({
          title: '提示',
          content: '确认解绑您的学号 "' + that.data.stuNum + '"',
          success: function (res) {
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
                      success: function (res) {
                          wx.hideLoading();
                          if (res.data.status === true) {
                              wx.showToast({
                                  title: '解绑成功',
                                  icon: 'success',
                                  duration: 2000
                              });
                          } else if (res.data.status === false) {
                              wx.showToast({
                                  title: res.data.errMsg,
                                  icon: 'none',
                                  duration: 2000
                              });
                          } else if (res.data.status === null) {
                              wx.showToast({
                                  title: '服务器故障',
                                  icon: 'none',
                                  duration: 2000
                              });
                          }
                      },
                      fail: function (res) {
                          wx.hideLoading();
                          wx.showToast({
                              title: '网络故障，请稍后重试',
                              icon: 'none',
                              duration: 2000
                          });
                      }
                  });
              }
          }
      });
  },
  stuNumInput: function (e) {
      this.setData({
          stuNumIn: e.detail.value
      })
  },
  stuPwdInput: function (e) {
      this.setData({
          stuPwdIn: e.detail.value
      })
  },
  bindBtn: function () {
      var that = this;
      if (this.data.stuNumIn == '') {
          wx.showToast({
              title: '请输入学号',
              icon: 'none',
              duration: 2000
          });
          return;
      } else if (this.data.stuPwdIn == '') {
          wx.showToast({
              title: '请输入密码',
              icon: 'none',
              duration: 2000
          });
          return;
      }
      wx.showModal({
          title: '提示',
          content: '确认绑定学号 "' + that.data.stuNumIn + '"',
          success: function (res) {
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
                      success: function (res) {
                          wx.hideLoading();
                          if (res.data.status === true) {
                              wx.showToast({
                                  title: '绑定成功',
                                  icon: 'success',
                                  duration: 2000
                              });
                          } else if (res.data.status === false) {
                              wx.showToast({
                                  title: res.data.errMsg,
                                  icon: 'none',
                                  duration: 2000
                              });
                          } else if (res.data.status === null) {
                              wx.showToast({
                                  title: '服务器故障',
                                  icon: 'none',
                                  duration: 2000
                              });
                          }
                      },
                      fail: function (res) {
                          wx.hideLoading();
                          wx.showToast({
                              title: '网络故障，请稍后重试',
                              icon: 'none',
                              duration: 2000
                          });
                      }
                  });
              }
          }
      });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    wx.startHCE({
        aid_list: ['f222222222'],
        success: function (res) {
            wx.onHCEMessage(function (res) {
                if (res.messageType === 1) {
                    if (that.data.userToken === null) {
                        return;
                    }
                    var request_str = 'f222222222' + that.data.userToken;
                    wx.sendHCEMessage({ data: util.str2ab(request_str) });
                    console.log('sendHCEMessage: ' + request_str);
                    wx.hideLoading();
                    wx.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        userToken: null
                    });
                }
            });
        },
        fail: function (res) {
            wx.showModal({
                title: '提示',
                content: '请先打开手机的NFC开关',
                showCancel: false,
            })
        }
    });
    setInterval(function () {
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
            success: function (res) {
                if (res.data.status === true) {
                    that.setData({
                        motto: '您已绑定学号，点击头像签到',
                        hasBound: true,
                        stuNum: res.data.stuNum,
                        lastTime: res.data.lastTime,
                        lastLocation: res.data.lastLocation
                    });
                } else if (res.data.status === false) {
                    that.setData({
                        motto: '您未绑定学号，请在下方绑定',
                        hasBound: false,
                        stuNum: null,
                        lastTime: null,
                        lastLocation: null
                    });
                } else if (res.data.status === null) {
                    that.setData({
                        motto: '服务器故障',
                        hasBound: null,
                        stuNum: null,
                        lastTime: null,
                        lastLocation: null
                    });
                }
            }
        });
    }, 1000) // 循环时间 这里是1秒
  },
  onShow: function () {
      wx.hideLoading();
      this.setData({
          userToken: null
      });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
