// pages/Personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile:true,
    token:'',
    resLogin:'',
    user:{},
    userData:'', //用于渲染的数据
    hasUserInfo: false,//用户信息缓存标识符
  },
  toUserHomepag(){
    wx.navigateTo({
      url: '../userHomepage/userHomepage',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  setlogin(user){
    var that = this
    wx.login({
      success:res=>{
        if(res.code){
          console.log(that.resLogin)
          wx.request({
            url: 'http://124.221.249.177:8080/login',
            method:'GET',
            data:{
              code:res.code
            },
            success:(res)=>{
              console.log("服务器返回信息",res.data)
              console.log("用户信息",user) //user为传入的参数
              //根据新老用户设置storage
              switch(res.data.code){
                //新用户默认使用微信头像及其昵称
                case 0:{  
                  that.setData({
                    hasUserInfo:true,
                    user,
                    token:res.data.token,
                    userData:user
                    // openid:res.data.openid
                  })  
                  //将新用户信息存储到user中
                  wx.setStorageSync('user', user)  
                  wx.setStorageSync('token', res.data.data.token)
                  wx.setStorageSync('openid', res.data.data.openid)
                } 
                break
                //老用户可从数据库中获取信息，TODO
                case 1: {
                  that.setData({
                    hasUserInfo:true,
                    token:res.data.token
                  })
                  //待完善
                  // wx.setStorageSync('key', data)
                }
                
                break
                case 2:  //登录失败
                break
              }
            }
          })
        }else{
          console.log("登录失败!")
          that.setData({
            resLogin:2
          })
        }
      }
    })
  
  },
  
  login(){
    var that = this
    wx.getUserProfile({
      desc: '授权登录',
      success:(res)=>{
        this.setlogin(res.userInfo)
        // let user = res.userInfo
        //信息存储到本地
        // wx.setStorageSync('user', user)
        // that.setData({
        //   user,
        //   canIUseGetUserProfile:false
        // })
        console.log("状态",this.data.canIUseGetUserProfile)
      }
    })
  
  },

  onLoad: function (options) {
    var that = this
    //生成页面时异步读取本地缓存
    wx.getStorage({
      key:'user',
      //读取成功，将数据渲染到页面
      success:(res)=>{
          console.log("读取缓存成功",res.data)
          that.setData({
            userData:res.data,
            canIUseGetUserProfile:false //若读取到缓存，则不允许使用登录
          })
          console.log("埋点1",this.data.canIUseGetUserProfile)
          console.log(that.data.userData)
      },
      fail:(err)=>{
        console.log("读取缓存失败")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})