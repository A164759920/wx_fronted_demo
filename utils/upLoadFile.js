module.exports=function(filePath,filename,total){
  const token = wx.getStorageSync('token')
  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      filePath , //文件路径
      name: 'pic',
      url: 'http://124.221.249.177:8080/uploadImg',
      formData:{
        'picNumber': filename,
        'total':total,
      },
      header:{
        "Authorization":"Bearer "+token
      },
      success:resolve,
      fail:reject
    })
  })
}