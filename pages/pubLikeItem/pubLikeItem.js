// pages/pubLikeItem/pubLikeItem.js
const upLoadFile = require('../../utils/upLoadFile')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    titleCount:0,//统计输入的标题字数
    title:'',//输入的标题
    contentCount:0,//统计输入的正文字数
    content:'',//输入的内容
    currentTime:'' //进行操作时的时间
  },
  //选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 9-this.data.imgList.length, //默认一次最多选9张
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log("当前图片数组的长度:",this.data.imgList.length)
        if (this.data.imgList.length != 0 && this.data.imgList.length<=9) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
    console.log("获取的图片数组:",this.data.imgList)
  },
  //查看图片
  ViewImage(e) {
    console.log("查看了图片")
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  //删除图片
  DelImg(e) {
    console.log("删除了图片")
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        },
  //获取输入的标题
  getTitleInput(e){
    this.setData({
      titleCount: e.detail.value.length,
      title:e.detail.value
    })
  },
  //获取输入的内容
  getContentInput(e){
    this.setData({
      contentCount: e.detail.value.length,
      content:e.detail.value
    })
  },
  //发布按钮的绑定事件
  sendLikeItem(){
    var time = util.formatTime(new Date());
    this.setData({
      currentTime:time
    })
    console.log("时间戳",this.data.currentTime)
    const token = wx.getStorageSync('token')
    wx.showLoading({
      title: '发布中',
    });
    wx.request({
      url: 'http://124.221.249.177:8080/pubLikeitem',
      method:'POST',
      header:{
        "Authorization":"Bearer "+token
      },
      data:{
        pubDate:this.data.currentTime,  //实时更新发布时间
        title:this.data.title,
        content:this.data.content
      },
      success:(res)=>{
       
        console.log("动态文本部分发送成功",res)
        //调用图片上传API发送图片部分
        let totalFiles = this.data.imgList.length.toString();//总共需要传输的图片数量
         //用户未选择图片
        if(totalFiles=='0'){
          console.log("动态已发表完成【未选择图片】")
          wx.hideLoading();
          //登录成功跳转回上一界面
          wx.showModal({
                      cancelColor: 'cancelColor',
                      title:"提示",
                      content:"发表成功,是否返回",
                      success:(res)=>{
                        if(res.confirm){
                          wx.navigateBack({
                            delta: 1,
                          })
                        }
                      }
          })
          //登录成功跳转回上一界面
        }
        else{  //用户选择了图片
          let files = this.data.imgList;  //图片URL数组
          let uploads =[];  //构建的promise数组
          files.forEach((item,index)=>{  //item为图片的url
            const filename = 'newPic'+index  //图片名字
            uploads.push(upLoadFile(item,filename,totalFiles))
          })
          Promise.all(uploads).then(res=>{
            console.log("图片部分发送完成",res)
            console.log("动态已发表完成【选择图片】")
                      //登录成功跳转回上一界面
              wx.hideLoading();
              wx.showModal({
                        cancelColor: 'cancelColor',
                        title:"提示",
                        content:"发表成功,是否返回",
                        success:(res)=>{
                          if(res.confirm){
                            wx.navigateBack({
                              delta: 1,
                            })
                          }
                        }
              })
          })
        }

      }
    })




  },
  backTo(){
    wx.navigateBack({
      delta: 1,
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