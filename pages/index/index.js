// index.js

import { reqCode } from '../../app.js';
import { str2ab } from '../../utils/util.js';

const RX_FRAME_PRFX = 'FF55AA55AA';

Page({
  data: {
    prompt: '正在加载数据，请稍候...',
    avaliable: false,
    userToken: null,
    hasBound: null,
    stuNum: null,
    stuNumIn: '',
    stuPwdIn: '',
    lastTime: null,
    lastLocation: null
  },
  // 点击头像事件
  coverTap() {
    var that = this;

    if (!that.data.hasBound) {
      return;
    }

    wx.startHCE({
      aid_list: [RX_FRAME_PRFX],
      // 开启HCE成功
      success(res) {
        that.setData({
          avaliable: true
        });
        // HCE消息回调
        wx.onHCEMessage(function (res) {
          if (res.messageType === 1 && that.data.userToken !== null) {
            // 发送HCE消息
            wx.sendHCEMessage({
              data: str2ab(RX_FRAME_PRFX + that.data.userToken),
              complete(res) {
                console.log(res.errMsg);
                wx.hideLoading({
                  complete(res) {
                    wx.showToast({
                      title: '数据传输完成',
                      icon: 'success',
                      duration: 1500,
                      mask: true
                    });
                    wx.stopHCE({
                      complete(res) {
                        console.log(res.errMsg);
                        that.setData({
                          avaliable: false,
                          userToken: null
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      },
      // 开启HCE失败
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '请检查NFC开关是否打开',
          showCancel: false
        });
      },
      // 开启HCE完成
      complete(res) {
        console.log(res.errMsg);
      }
    });

    setTimeout(function () {
      if (that.data.avaliable && that.data.hasBound) {
        wx.showLoading({
          title: '正在获取密钥',
          mask: true
        });
        // 获取验证口令
        wx.request({
          url: getApp().globalData.serverUrl,
          method: 'POST',
          data: {
            request: reqCode.HTTP_REQ_CODE_APP_GET_TOKEN,
            wx_code: getApp().globalData.userCode
          },
          header: {
            'content-type': 'application/json'
          },
          // 获取验证口令成功
          success(res) {
            wx.hideLoading({
              complete(res) { /* empty statement */ }
            });
            if (res.data.status === true) {
              that.setData({
                userToken: res.data.user_token
              });
              wx.showLoading({
                title: '请刷考勤终端',
                mask: true
              });
            } else if (res.data.status === false) {
              wx.showToast({
                title: res.data.hints,
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
          // 获取验证口令失败
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
            wx.stopHCE({
              complete(res) {
                console.log(res.errMsg);
                that.setData({
                  avaliable: false,
                  userToken: null
                });
              }
            });
          },
          // 获取验证口令完成
          complete(res) {
            console.log(res.errMsg);
          }
        });
      }
    }, 250);
  },
  // 学号输入事件
  stuNumInput(e) {
    this.setData({
      stuNumIn: e.detail.value
    });
  },
  // 密码输入事件
  stuPwdInput(e) {
    this.setData({
      stuPwdIn: e.detail.value
    });
  },
  // 提交按钮事件
  submitBtn() {
    var that = this;

    if (that.data.stuNumIn === '') {
      wx.showToast({
        title: '请输入学号',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    } else if (that.data.stuPwdIn === '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000,
        mask: false
      });
      return;
    }

    wx.showModal({
      title: '提示',
      content: '确认绑定学号 "' + that.data.stuNumIn + '"',
      success(res) {
        if (res.confirm && that.data.stuNum !== null) {
          wx.showLoading({
            title: '请稍候',
            mask: true
          });
          // 绑定用户请求
          wx.request({
            url: getApp().globalData.serverUrl,
            method: 'POST',
            data: {
              request: reqCode.HTTP_REQ_CODE_APP_BIND_USER,
              wx_code: getApp().globalData.userCode,
              user_id: that.data.stuNumIn,
              user_passwd: that.data.stuPwdIn
            },
            header: {
              'content-type': 'application/json'
            },
            // 绑定用户请求成功
            success(res) {
              wx.hideLoading({
                complete(res) { /* empty statement */ }
              });
              if (res.data.status === true) {
                wx.showToast({
                  title: '学号绑定成功',
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
                  title: res.data.hints,
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
            // 绑定用户请求失败
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
            // 绑定用户请求完成
            complete(res) {
              console.log(res.errMsg);
            }
          });
        }
      }
    });
  },
  // 选项按钮事件
  optionBtn() {
    var that = this;

    wx.showActionSheet({
      itemList: ['修改密码', '解绑学号'],
      success(res) {
        if (that.data.stuNum !== null) {
          switch (res.tapIndex) {
            case 0: // 修改密码
              wx.navigateTo({
                url: '../passwd/passwd?stuNum=' + that.data.stuNum
              });
              break;
            case 1: // 解绑学号
              wx.showModal({
                title: '提示',
                content: '确认解绑您的学号 "' + that.data.stuNum + '"',
                success(res) {
                  if (res.confirm && that.data.stuNum !== null) {
                    wx.showLoading({
                      title: '请稍候',
                      mask: true
                    });
                    // 解绑用户请求
                    wx.request({
                      url: getApp().globalData.serverUrl,
                      method: 'POST',
                      data: {
                        request: reqCode.HTTP_REQ_CODE_APP_UNBIND_USER,
                        wx_code: getApp().globalData.userCode,
                        user_id: that.data.stuNum
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      // 解绑用户请求成功
                      success(res) {
                        wx.hideLoading({
                          complete(res) { /* empty statement */ }
                        });
                        if (res.data.status === true) {
                          wx.showToast({
                            title: '学号解绑成功',
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
                            title: res.data.hints,
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
                      // 解绑用户请求失败
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
                      // 解绑用户请求完成
                      complete(res) {
                        console.log(res.errMsg);
                      }
                    });
                  }
                }
              });
              break;
            default:
              break;
          }
        }
      }
    });
  },
  // 页面加载事件
  onLoad() {
    var that = this;

    var timer = setInterval(function () {
      // 获取用户信息
      wx.request({
        url: getApp().globalData.serverUrl,
        method: 'POST',
        data: {
          request: reqCode.HTTP_REQ_CODE_APP_GET_INFO,
          wx_code: getApp().globalData.userCode
        },
        header: {
          'content-type': 'application/json'
        },
        // 获取用户信息成功
        success(res) {
          if (res.data.status === true) {
            that.setData({
              prompt: '请点击上方NFC标志签到',
              hasBound: true,
              stuNum: res.data.user_id,
              lastTime: res.data.last_time,
              lastLocation: res.data.last_location
            });
          } else if (res.data.status === false) {
            that.setData({
              prompt: '您未绑定学号，请在下方绑定',
              userToken: null,
              hasBound: false,
              stuNum: '',
              lastTime: null,
              lastLocation: null
            });
          } else {
            that.setData({
              prompt: '当前会话异常，请重启应用后再试',
              userToken: null,
              hasBound: null,
              stuNum: null,
              lastTime: null,
              lastLocation: null
            });
            wx.hideToast({
              complete(res) { /* empty statement */ }
            });
            wx.hideLoading({
              complete(res) { /* empty statement */ }
            });
            if (getCurrentPages().length != 1) {
              wx.navigateBack({
                delta: 1
              });
            }
            clearInterval(timer);
          }
        },
        // 获取用户信息完成
        complete(res) { /* empty statement */ }
      });
    }, 1000);
  },
  // 页面隐藏事件
  onHide() {
    let that = this;

    if (that.data.avaliable) {
      wx.hideLoading({
        complete(res) { /* empty statement */ }
      });
      wx.stopHCE({
        complete(res) {
          console.log(res.errMsg);
          that.setData({
            avaliable: false,
            userToken: null
          });
        }
      });
    }
  }
});