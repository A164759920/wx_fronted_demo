// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const subDomain = wx.getExtConfigSync().subDomain
    console.log("获取的subdomain",subDomain)
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    APP_HOST:'http://124.221.249.177:8080'
  }
})
