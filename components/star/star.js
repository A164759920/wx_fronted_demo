// components/star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //接收自定义的高度
    setSize:Number,
  },

  data: {
    stars: [
      {
        flag1: 2,
        flag2: 2,
        bgImgL: "/src/icons/Lstar.png",
        bgfImgL: "/src/icons/Lstar.active.png",
        bgImgR: "/src/icons/Rstar.png",
        bgfImgR: "/src/icons/Rstar.active.png",
      },
      {
        flag1: 1,
        flag2: 1,
        bgImgL: "/src/icons/Lstar.png",
        bgfImgL: "/src/icons/Lstar.active.png",
        bgImgR: "/src/icons/Rstar.png",
        bgfImgR: "/src/icons/Rstar.active.png",
      },
      {
        flag1: 1,
        flag2: 1,
        bgImgL: "/src/icons/Lstar.png",
        bgfImgL: "/src/icons/Lstar.active.png",
        bgImgR: "/src/icons/Rstar.png",
        bgfImgR: "/src/icons/Rstar.active.png",
      },
      {
        flag1: 1,
        flag2: 1,
        bgImgL: "/src/icons/Lstar.png",
        bgfImgL: "/src/icons/Lstar.active.png",
        bgImgR: "/src/icons/Rstar.png",
        bgfImgR: "/src/icons/Rstar.active.png",
      },
      {
        flag1:1,
        flag2:1,
        bgImgL: "/src/icons/Lstar.png",
        bgfImgL: "/src/icons/Lstar.active.png",
        bgImgR: "/src/icons/Rstar.png",
        bgfImgR: "/src/icons/Rstar.active.png",
      },
    ],
    star_num: 1,  // 默认1分  最低0.5分
    Lindex:0,  //左下标
    Rindex:0,   //右下标 
    oldScore:'', //旧分数
    newScore:''//新分数
  },

  /**
   * 组件的方法列表
   */
  methods: {
      //点击左边
    scoreL: function (e) {
      var _this = this;
      this.setData({
        oldScore:this.data.star_num
      })
      // console.log("旧分数",this.data.oldScore)
      var index = e.currentTarget.dataset.index;
      //改变分数
      _this.setData({
        star_num: index + 0.5 // 评分
      })
      this.setData({
        newScore:this.data.star_num
      })
      // console.log("新分数",this.data.newScore)
      this.judgeNum() //重新渲染星星
    },
    //点击右边
    scoreR: function (e) {
      this.setData({
        oldScore:this.data.star_num
      })
      var _this = this;
      var index = e.currentTarget.dataset.index;
      // 评分
      _this.setData({
        star_num: index + 1 // 评分
      })
      this.setData({
        newScore:this.data.star_num
      })
      this.judgeNum()
    },
    changeL(param){     //左移  1代表减 2代表加
      var that = this;
      // console.log("LL左下标",that.data.Lindex)
      // console.log("LL右下标",that.data.Rindex)
      var item ='stars['+that.data.Lindex+'].flag1'
      if(param===1){ //左移动
        // console.log("锚点1")
        const middle = that.data.Lindex 
        var item ='stars['+middle+'].flag1'
        that.setData({
          [item]:1,
          Lindex:that.data.Lindex-1
        })
      }
      if(param===2){
        // console.log("锚点2")
        const middle = that.data.Lindex + 1
        var item ='stars['+middle+'].flag1'
        that.setData({
          [item]:2,
          Lindex:that.data.Lindex+1
        })
      }
    },
    changeR(param){    //右移  1代表减 2代表加
      const that = this
      var item ='stars['+that.data.Lindex+'].flag2'
      if(param===1){ //左移动
        // console.log("锚点3")
        that.setData({
          [item]:1,
          Rindex:this.data.Rindex-1
        })
      }
      if(param===2){
        // console.log("锚点4")
        const middle = that.data.Rindex + 1
        var item ='stars['+middle+'].flag2'
        that.setData({
          [item]:2,
          Rindex:this.data.Rindex+1
        })
      }
    },
    judgeNum:function(){
      const isPoint = (this.data.oldScore) % 1 ==0? false:true
      const flag = this.data.newScore - this.data.oldScore //分差
      if(flag<0)  {//分差小于0 扣分
        if(isPoint) {  //是小数(左)
          const LorR={
            toL:true,
            toR:false,
          }
          const count = Math.abs(flag)*2  //变化的次数 LRLR
          for (var i=0;i<count;i++)
          {
            if(LorR.toL){
              this.changeL(1)
            }
            if(LorR.toR){
              this.changeR(1)
            }
            LorR.toL=!LorR.toL
            LorR.toR=!LorR.toR
          }
        }//是整数（右）
        else{
          const LorR={
            toL:false,
            toR:true,
          }
          const count = Math.abs(flag)*2  //变化的次数 LRLR
          for (var i=0;i<count;i++)
          {
            if(LorR.toL){
              this.changeL(1)
            }
            if(LorR.toR){
              this.changeR(1)
            }
            LorR.toL=!LorR.toL
            LorR.toR=!LorR.toR
          }
        }
      }  //分差大于0 加分
      else{
        if(isPoint) {//是小数
        const LorR={
          toL:false,
          toR:true,
        }
        const count = Math.abs(flag)*2  //变化的次数 LRLR
        for (var i=0;i<count;i++)
        {
          if(LorR.toL){
            this.changeL(2)
          }
          if(LorR.toR){
            this.changeR(2)
          }
          LorR.toL=!LorR.toL
          LorR.toR=!LorR.toR
        }
        }
        else{ //是整数
          const LorR={
            toL:true,
            toR:false,
          }
          const count = Math.abs(flag)*2  //变化的次数 LRLR
          for (var i=0;i<count;i++)
          {
            if(LorR.toL){
              this.changeL(2)
            }
            if(LorR.toR){
              this.changeR(2)
            }
            LorR.toL=!LorR.toL
            LorR.toR=!LorR.toR
          }
        }
     }
    },
    setNum(){  //向父组件传值
      //传入的参数名称 starNum    
      this.triggerEvent('myevent',{starNum:this.data.star_num})
    }
  }
})
