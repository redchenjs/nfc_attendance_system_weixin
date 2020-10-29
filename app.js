// app.js

export const reqCode = {
  HTTP_REQ_CODE_APP_GET_INFO    : 110,  // 微信端获取用户信息
  HTTP_REQ_CODE_APP_GET_TOKEN   : 111,  // 微信端获取验证口令
  HTTP_REQ_CODE_APP_BIND_USER   : 112,  // 微信端请求绑定用户
  HTTP_REQ_CODE_APP_UNBIND_USER : 113,  // 微信端请求解绑用户
  HTTP_REQ_CODE_APP_UPDATE_PSWD : 114   // 微信端请求修改密码
};

App({
  onLaunch() {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      console.log('hasUpdate:', res.hasUpdate);
    });

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    wx.login({
      success(res) {
        getApp().globalData.userCode = res.code;
      }
    });

    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success(res) {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    userCode: null,
    serverUrl: 'https://server.zyiot.top/nas/'
  }
});