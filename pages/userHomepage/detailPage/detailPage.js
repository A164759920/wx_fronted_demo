// pages/userHomepage/detailPage/detailPage.js
var app = getApp() ;
const util = require('../../../utils/util') //获取当前时间
const {timer} = require('../../../utils/timer') //计算时间差
Page({

  /**
   * 页面的初始数据
   */
  data: {
    APP_HOST:app.globalData.APP_HOST,
    UserOpenid:wx.getStorageSync('openid'), //当前操作者的openid
    likeItem:'', //接收详情评论的数组
    picNum:3,  //设置图片排版
    picSelectUrl:'', //选中的全屏预览图片Url
    commentIndex:'',//选中的评论索引
    showComment:false, //是否显示输入框
    canIsend:false,  //是否能发送的标识 取非
    // canIdelete:false, //是否能删除评论的标识 当openid和pubID一致时可使用操作按钮
    commentTxt:null, //读取键盘输入的评论内容
    isAppreciate:'',//是否已点赞标识符
    AppreciateNum:'',//点赞数
    AppreciateColor:'',//点赞图表颜色
    isFavor:false,//是否已收藏
    currentTime:'',//当前时间
    picList:[
      'http://124.221.249.177:8080/likePic/pic1.jpg',
      'http://124.221.249.177:8080/likePic/pic2.jpg',
      'http://124.221.249.177:8080/likePic/pic3.jpg',
      // 'http://124.221.249.177:8080/likePic/pic4.jpg',
      // 'http://124.221.249.177:8080/likePic/pic5.jpg',
      // 'http://124.221.249.177:8080/likePic/pic6.jpg',
      // 'http://124.221.249.177:8080/likePic/pic7.jpg',
    ],

    commentList:[  //评论区数组
      {
        pubOpenid:"oWN_H5wZoIbaVQZVysG4piketXRY",//发布该条评论的用户的openid，
        pubAvatar:'http://124.221.249.177:8080/likePic/pic5.jpg',
        pubNickname:'桎梏',
        pubDate:'2022/08/21 20:50:54',
        pubContent:'这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论'
      },
      {
        pubOpenid:"oWN_H5wZoIbaVQZVysG4piketXRX",//发布该条评论的用户的openid，
        pubAvatar:'http://124.221.249.177:8080/likePic/pic6.jpg',
        pubNickname:'其他用户',
        pubDate:'2022/08/16 20:50:54',
        pubContent:'这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论'
      },
      // {
      //   pubAvatar:'http://124.221.249.177:8080/likePic/pic5.jpg',
      //   pubNickname:'桎梏',
      //   pubDate:'2022/8/16',
      //   pubContent:'这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论'
      // }
    ]
  },


  viewPic(e){  //全屏预览图片
      //获取点击图片的url
      this.setData({
        picSelectUrl: e.currentTarget.dataset.id
      })
      console.log("我选中的图片",this.data.picSelectUrl)
    wx.previewImage({
      urls: this.data.picList,
      current:this.data.picSelectUrl
    })
  },
  addComment(){
    this.setData({
      showComment:true
    })
  },
  //发送评论到后端
  sendComment(){
    const that = this
    const token = wx.getStorageSync('token');
    const currentTime = util.formatTime(new Date())
    this.setData({
      currentTime:currentTime
    })
    wx.request({
      url: this.data.APP_HOST+'/comment',
      method:'POST',
      header:{   //token
        "Authorization":"Bearer "+token
      },
      data:{ //待优化
        funcSelect:0,  //0为新增评论
        comment:this.data.commentTxt, //评论数据
        pubDate:this.data.currentTime //发布的时间
        // subOpenid:this.likeItem.subOpenid //该条动态详情的发布者openid
      },
      success:(res)=>{
        console.log("评论成功",res.data.code)
        //向commentList里添加一个元素
        //模拟后台返回数据
        const commentObj ={
          pubOpenid:this.data.UserOpenid,//发布该条评论的用户的openid 
          pubAvatar:'http://124.221.249.177:8080/likePic/pic5.jpg',
          pubNickname:'桎梏',
          pubDate:'2022/08/22 19:55:54', //后台返回的数据
          pubContent:this.data.commentTxt
        }
        //更新时间
        const currentTime = util.formatTime(new Date())
        this.setData({
          currentTime:currentTime
        })
        commentObj.pubDate = timer(commentObj.pubDate,this.data.currentTime)
        // console.log("插入后的评论数组",this.data.commentList.push(commentObj))

        this.data.commentList.push(commentObj)

        this.setData({
          commentList:this.data.commentList,
          showComment:false
        })
        console.log("插入后的评论数组",this.data.commentList)
      }
    })
    this.setData({
      // showComment:false,
      canIsend:false,
    })
  },
  //获取输入的评论内容
  getCommentTxt(event){
    console.log("输入的值",event.detail.value)
    if(event.detail.value){
      this.setData({
        canIsend:true,
      })
    }
    if(event.detail.value==''){
      this.setData({
        canIsend:false
      })
    }
    this.setData({  //读取输入的内容
      commentTxt:event.detail.value
    })
  },
  //删除评论
  deleteComment(e){
    this.setData({
      commentIndex:e.currentTarget.dataset.id
    })
    wx.showModal({
      // cancelColor: 'cancelColor',
      title:"提示",
      content:"确认删除？",
      success:(res)=>{
        //调用后端的删除API
        const token = wx.getStorageSync('token');
        if(res.confirm){
          wx.request({
            url: this.data.APP_HOST+'/comment',
            method:'POST',
            header:{   //token
              "Authorization":"Bearer "+token
            },
            data:{
              funcSelect:1,  //1为删除评论
            },
            success:(res)=>{
              console.log("删除API的返回数据",res)
              if(res.data.code==0){
                console.log("选中的评论[用于删除]",this.data.commentIndex)
                console.log("删除前的评论数组",this.data.commentList)
                this.data.commentList.splice(this.data.commentIndex,1)
                console.log("删除后的评论数组",this.data.commentList)
                this.setData({
                  commentList:this.data.commentList
                })
              }
            }
          })

        }
        else{
          console.log("已取消删除")
        }
      },
    })

  },
  //点赞/取消点赞
  ChangeAppreciate(){
    const token = wx.getStorageSync('token')
    //原来是非点赞，触发点赞事件
    //原来是点赞，触发取消点赞事件
    //可以先改变前端的动画，若成功点赞则不改变css，若点赞失败再收回css
    this.setData({
      isAppreciate:!this.data.isAppreciate
    })
    if(this.data.isAppreciate){ //点赞
      this.setData({
         AppreciateColor:'red',
         AppreciateNum:this.data.AppreciateNum+1
      })
      wx.request({
        url: this.data.APP_HOST+'/appreciate',
        method:"POST",
        header:{   //token
          "Authorization":"Bearer "+token
        },
        data:{
          funcSelect:1, //1表示点赞
        },
        success:(res)=>{
          if(res.data.code==0){
            console.log("点赞成功,已同步到数据库")
          }
          else{
            console.log("点赞失败");
            //点赞失败归还css变化
            this.setData({
              isAppreciate:!this.data.isAppreciate,
              AppreciateColor:'',
              AppreciateNum:this.data.AppreciateNum-1
            })
          }
        }
      })
    }
    else{
      this.setData({  //取消点赞
        AppreciateColor:'',
        AppreciateNum:this.data.AppreciateNum-1
      })
      wx.request({
        url: this.data.APP_HOST+'/appreciate',
        method:"POST",
        header:{   //token
          "Authorization":"Bearer "+token
        },
        data:{
          funcSelect:2, //2表示取消点赞
        },
        success:(res)=>{
          if(res.data.code==0){
            console.log("取消点赞成功,已同步到数据库")
          }
          else{
            console.log("取消点赞失败");
            //点赞失败归还css变化
            this.setData({
              isAppreciate:!this.data.isAppreciate,
              AppreciateColor:'red',
              AppreciateNum:this.data.AppreciateNum+1
            })
          }
        }
      })
    }
  },
  //收藏/取消收藏
  ChangeFavor(){
    const token = wx.getStorageSync('token')
    //原来是非收藏，触发收藏事件
    //原来是收藏，触发取消收藏事件
    //可以先改变前端的动画，若成功收藏则不改变css，若收藏失败再收回css
    this.setData({
      isFavor:!this.data.isFavor
    })
    if(this.data.isFavor){//收藏 1
      wx.request({
        url: this.data.APP_HOST+'/favor',
        method:'POST',
        header:{   //token
          "Authorization":"Bearer "+token
        },
        data:{
          funcSelect:1
        },
        success:(res)=>{
          if(res.data.code==0){
            console.log("收藏成功，已同步到数据库")
          }
          if(res.data.code==1){
            console.log("收藏失败")
            //归还css变化
            this.setData({
              isFavor:!this.data.isFavor
            })
          }
        }
      })
    } 
    else{  //取消收藏
      wx.request({
        url: this.data.APP_HOST+'/favor',
        method:"POST",
        header:{
          "Authorization":"Bearer "+token
        },
        data:{
          funcSelect:2
        },
        success:(res)=>{
          if(res.data.code==0){
            console.log("取消收藏成功")
          }
          if(res.code == 1){
            console.log("取消收藏失败")
            this.setData({
              isFavor:!this.data.isFavor
            })
          }
        }
      })
    }

  },
  //删除动态
  deleteLikeItem(){
    const token = wx.getStorageSync('token')
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"提示",
      content:"确认删除该条动态？",
      success:(res)=>{
        if(res.confirm){  //确认删除
          wx.showLoading({
            title: '正在删除',
          })
          wx.request({
            url: this.data.APP_HOST+'/delLikeItem',
            header:{   //token
              "Authorization":"Bearer "+token
            },
            method:'POST',
            data:{
              msg:"请求删除动态"
            },
            success:(res)=>{
              if(res.data.code==0){
                console.log("删除成功")
                wx.hideLoading({   //删除成功，跳转回上一页
                  success: (res) => {
                    wx.navigateBack({
                      delta: 1,
                    })
                  },
                })
              }else{
                wx.hideLoading({
                  success: (res) => {
                    console.log("删除失败")
                  },
                })
              }
            },
            fail:(res)=>{
              wx.hideLoading({
                success: (res) => {
                  console.log("删除失败")
                },
              })
            }
          })
        }
        else{
          console.log("取消删除")
        }
      }
    })
  },
  //获取评分组件的评分
  setStarNum(e){
    console.log("获得的评分为",e.detail.starNum)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that =this
    const currenTime = util.formatTime(new Date())
    this.setData({
      currentTime:currenTime
    })
    console.log("打开页面的时间",this.data.currentTime)
    const token = wx.getStorageSync('token')
    // console.log("这是我接收的数据",options)
    //接收渲染详情页的数据，不包括评论
    this.setData({
      likeItem:JSON.parse(options.likeItem)
    })
    console.log("详情页接收的数据",this.data.likeItem)
    const length = this.data.likeItem.pic.length
    //设置图片的排版数据
    if(length ==1){
      this.setData({
        picNum:1,
        picList:this.data.likeItem.pic
      })
    }
    else if(length==2 || length==4){
      this.setData({
        picNum:2,
        picList:this.data.likeItem.pic
      })
    }
    else{
      this.setData({
        picNum:3,
        picList:this.data.likeItem.pic
      })
    }
    console.log("设置的picNum",this.data.picNum)
    //请求评论区数据:commentlist 【待完成】

    //请求完更新时间状态
    that.data.commentList.forEach((item,index)=>{
      //开始时间,结束时间
      const newDate = timer(item.pubDate,that.data.currentTime)
      const params = 'commentList['+index+'].pubDate'
      that.setData({
        [params]:newDate
      })
    })
    //请求点赞状态
    wx.request({
      url: this.data.APP_HOST+'/appreciate',
      method:"POST",
      header:{   //token
        "Authorization":"Bearer "+token
      },
      data:{
        funcSelect:0, //0表示查询
      },
      success:(res)=>{
        console.log("点赞状态查询结果为",res.data)
        this.setData({
          isAppreciate:res.data.flag,  //根据查询结果给标识符赋初值
          AppreciateNum:res.data.AppreciateNum //设置初始点赞数
        })
        if(this.data.isAppreciate){
          this.setData({
            AppreciateColor:"red",
          })
        }
      },
      fail:(res)=>{
        console.log("点赞执行失败",res)
      }
    })
    //请求收藏状态
    wx.request({
      url: this.data.APP_HOST+'/favor',
      method:"POST",
      header:{   //token
        "Authorization":"Bearer "+token
      },
      data:{
        funcSelect:0, //0表示查询
      },
      success:(res)=>{
        console.log("收藏状态查询结果为",res.data)
        if(res.data.code==0){
          this.setData({
            isFavor:res.data.flag
          })
        }
      },
      fail:(res)=>{
        console.log("收藏状态查询失败",res)
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