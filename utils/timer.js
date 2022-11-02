//返回显示时间
function cutYear(date){
  return parseInt(date.split(' ')[0].split('/')[0])
}
function cutMonth(date){
  return parseInt(date.split(' ')[0].split('/')[1])
}
function cutDay(date){
  return parseInt(date.split(' ')[0].split('/')[2])
}
function cutSecond(data){
  return data.split(' ')[1].split(':')[0]+":"+data.split(' ')[1].split(':')[1]
}
function timer(faultDate, completeTime) {
// var stime = Date.parse(new Date(faultDate));    //开始时间
// var etime = Date.parse(new Date(completeTime));    //结束时间
// var usedTime = etime - stime; //两个时间戳相差的毫秒数  
// var days = Math.floor(usedTime / (24 * 3600 * 1000));
// //计算出小时数
// var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
// var hours = Math.floor(leave1 / (3600 * 1000));
// //计算相差分钟数
// var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数  
// var minutes = Math.floor(leave2 / (60 * 1000));   
// var dayStr = days == 0 ? "" : days + "天";  
// var hoursStr = hours == 0 ? "" : hours + "时";
// var time = dayStr + hoursStr + minutes + "分";
const startYear = cutYear(faultDate)
const startMonth = cutMonth(faultDate)
const startDay = cutDay(faultDate)
const endYear = cutYear(completeTime)
const endMonth =   cutMonth(completeTime)
const endDay = cutDay(completeTime)
const yearFlag = endYear - startYear  //相差年份
const monthFlag = endMonth - startMonth //相差月份
const dayFlag = endDay - startDay //相差天数
//先判断相差年份，若相差一年及以上直接显示去年 2022/12/31 XX:XX
//若为同一年先判断月份 不同月直接显示  12/31 XX:XX
//若为同一月 根据相差天数进行判断
//若为同一天 XX:XX
//若相差一天 昨天 XX:XX
//若相差两天 前天 XX:XX
//其余情况 12/31 XX:XX
if(yearFlag>=1){ // eg:2022/12/31 XX:XX
  return startYear + '年' + startMonth + '月' + startDay + '日 '+ cutSecond(faultDate)
} 
else{  //同一年
  if(monthFlag>=1)  //不同月  12/31 XX:XX
  {
    return startMonth +'月' +startDay +'日 ' + cutSecond(faultDate)
  }
  else{ //同一月 
      if(dayFlag==0) { //同一天
        return cutSecond(faultDate)
      }
      if(dayFlag ==1) { //昨天
        return "昨天 "+cutSecond(faultDate)
      }
      if(dayFlag==2){  //前天
        return "前天 " +cutSecond(faultDate)
      }
      if(dayFlag>=3){
        return startMonth +'月' +startDay + '日 ' + cutSecond(faultDate)
      }
  }
}
}

module.exports={
  timer
}