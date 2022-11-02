// pages/userHomepage/userHomepage.js
var app = getApp() ;  // 导入app 使用全局变量
const util = require('../../utils/util')   // 导入工具函数包
const {timer} = require('../../utils/timer')  // 导入 时间管理
Page({

  /**
   * 页面的初始数据
   */
  data: {
    APP_HOST:app.globalData.APP_HOST, //域名
    pageNum:1, //当前页面显示到第几页，用于分页查询，默认第一页
    pageSize:5,//一页显示的动态条数 
    selectItem:0,//动态索引
    pageData:'', //页面初始化渲染数据  包含接口请求得到的所有信息
    userData:'',//用户信息 用于更新上半部分的 XX大学等的信息
    likeItem:'', //动态信息表  只为pageData中的一部分
    TabCur: 0, //选中的TabCur的值
    scrollLeft:0,
    itemsList:[{msg:'动态'},
     {msg:'回复'},
    {msg:'收藏'}]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    console.log(this.data.TabCur)
  },

  toEditUserinfo(){
    wx.navigateTo({
      url: '../editUserinfo/editUserinfo',
    })
  },
  toSubFans0(){   //选中关注
    wx.navigateTo({
      url: './subscribeFansList/subscribeFansList?select=0',
    })
  },
  toSubFans1(){   //选中粉丝
    wx.navigateTo({
      url: './subscribeFansList/subscribeFansList?select=1',
    })
  },
  toDetailPage(e){
    //获取动态索引
    this.setData({
      selectItem:e.currentTarget.dataset.id
    })
    console.log("我选择的item为",this.data.selectItem)
    wx.navigateTo({
      url: './detailPage/detailPage?likeItem='+JSON.stringify(this.data.likeItem[this.data.selectItem]),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
   getPageData(){
    //获取小程序当前的时间
    const currentTime = util.formatTime(new Date())
    this.setData({
      currentTime:currentTime
    })
    console.log("小程序现在的时间",this.data.currentTime)
    var that = this;
    const token = wx.getStorageSync('token');
    // console.log("读取的token",token)
    wx.request({
      url: this.data.APP_HOST+'/userhomepage',
      method:'POST',
      header:{
        "Authorization":"Bearer "+token
      },
      success:(res)=>{
        console.log("userHomepage服务器返回数据",res)
        that.setData({
          pageData:res.data
        })
        wx.request({
          url: this.data.APP_HOST+'/userhomepage/findItem',
          method:'POST',
          data:{
              pageNum:that.data.pageNum, //页数
              pageSize:that.data.pageSize,  //一页内容量
              openid:"暂定未处理"
          },
          success:(res)=>{
            console.log("分页动态查询成功",res.data);
            that.setData({
              likeItem:res.data.data.likeItem
            })
            that.data.likeItem.forEach((item,index)=>{
              //开始时间，结束时间
              // console.log("开始时间",item.pubDate)
              // console.log("结束时间",this.data.currentTime)
              const newDate = timer(item.pubDate,this.data.currentTime)
              // console.log("输出时间:",newDate)
              const params = 'likeItem['+index+'].pubDate'
              that.setData({
                [params]:newDate
              })
            })
          }
        })

        //查询动态:
        //更新时间状态

        // 停止pulldown  配合169行 onPullDownRefresh理解 
        // on 之后必须要调用stop来终止
       wx.stopPullDownRefresh({
         success: (res) => {
           wx.showToast({
             title: '已刷新',
           })
         },
       })
        // console.log("保存的数据",that.data.pageData.data.likeItem[0])
      }
    })
  },
  toPubLikeItem(){   // 跳转至"发布动态页"
    wx.navigateTo({
      url: '../pubLikeItem/pubLikeItem',
    })
  },
  // 在onLoad周期中从本次storage中读取登录页存储下的用户信息
  onLoad: function (options) {
    this.getPageData()
    const res = wx.getStorageSync('user') //
    this.setData({
      userData:res
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
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    //重置页码
    this.setData({
      pageNum:1
    })
    this.getPageData()
    const res = wx.getStorageSync('user') //
    this.setData({
      userData:res
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //触底新增
    const that = this
    this.setData({
      pageNum:this.data.pageNum+1, //页码自增
    })
    wx.request({
      url: this.data.APP_HOST+'/userhomepage/findItem',
      method:'POST',
      data:{
          pageNum:this.data.pageNum, //页数
          pageSize:this.data.pageSize,  //一页内容量
          openid:"暂定未处理"
      },
      success:(res)=>{
        console.log("触底查询成功",res.data.data.likeItem);
       res.data.data.likeItem.forEach(item=>{
          that.data.likeItem.push(item)
        })
            that.setData({
          likeItem:that.data.likeItem
        })
        // console.log("新数组",that.data.likeItem)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})