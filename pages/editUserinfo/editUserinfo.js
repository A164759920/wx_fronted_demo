// pages/editUserinfo/editUserinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:[], //图片的url
    newUsername:[], //新用户名
    Genderindex: null,  //性别选择
    Gradeindex:null, //年级选择
    gender: ['男', '女'],
    grade:['大一','大二','大三','大四','研究生','博士生']
  },
  selectGender(e) {  //选择性别
    console.log(e);
    this.setData({
      Genderindex: e.detail.value
    })
  },
  selectGrade(e) {  //选择年级
    console.log(e);
    this.setData({
      Gradeindex: e.detail.value
    })
  },

  ChooseImage() {  //选择图片
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          imgUrl:this.data.imgUrl = res.tempFilePaths
        })
        console.log("我要的数据", typeof this.data.imgUrl)
        console.log("我要的数据", this.data.imgUrl)
      }
    });
  },

  getUsername(e){
      this.setData({
        newUsername:e.detail.value
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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