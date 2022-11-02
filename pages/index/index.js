// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },


  getUserProfile() {
    return new Promise((resolve,reject)=>{
      wx.getUserProfile({
        desc: '授权登录',
        success:(res)=>{
          console.log("获取用户信息成功",res)
          resolve(res)
        },
        fail:(res)=>{
          console.log("获取用户信息失败",res)
          reject(res)
        }
      })
    })
    // wx.getUserProfile({
    //   desc: '授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     console.log("登录成功",res.userInfo)
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // })
  },
  getLogin(){
    return new Promise((resolve,reject)=>{
      wx.login({
        success:(res)=>{
          console.log("login成功")
          resolve(res)
        },
        fail:(res)=>{
          console.log("login失败")
          reject(res)
        }
      })
    })
  },

  login(){
    let userRes = this.getUserProfile()
    let loginRes = this.getLogin()
    //使用all方法确保二者均可成功请求
    Promise.all([userRes,loginRes]).then((res)=>{
      console.log(res)
      
    })
  }
})
