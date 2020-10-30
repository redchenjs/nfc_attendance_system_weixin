// app.js

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
  },

  globalData: {
    reqCode: {
      HTTP_REQ_CODE_APP_GET_INFO    : 110,  // 微信端获取用户信息
      HTTP_REQ_CODE_APP_GET_TOKEN   : 111,  // 微信端获取验证口令
      HTTP_REQ_CODE_APP_BIND_USER   : 112,  // 微信端请求绑定用户
      HTTP_REQ_CODE_APP_UNBIND_USER : 113,  // 微信端请求解绑用户
      HTTP_REQ_CODE_APP_UPDATE_PSWD : 114   // 微信端请求修改密码
    },
    userCode: null,
    serverUrl: 'https://server.zyiot.top/nas/'
  }
});