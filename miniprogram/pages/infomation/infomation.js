//index.js
const app = getApp()
import * as echarts from '../../ec-canvas/echarts';
function initChart(canvas, width, height) {
  console.log(getCurrentPages())
  const chart = echarts.init(canvas, null, {
    width:width,
    height: height
  });
  canvas.setChart(chart);
  if(app.globalData.jcrList!=null){
    var a=app.globalData.jcrList.ifs!=undefined?Object.values(app.globalData.jcrList.ifs[0]).splice(1,Object.values(app.globalData.jcrList.ifs[0]).length):[]
    for(var i in a){
      if(a[i]<0){
        a[i]=0
      }
    }
    var option = {
      //折线图标题
      title: {
        text: '影响因子',
        textStyle:{
          color: '#6C7B8A',
          fontWeight : 'normal'
        },
        top:'3%'
        
      },
      // 折线图线条的颜色
      color: ["#DCE0E6", "#67E0E3", "#9FE6B8"],
      // 折线图的线条代表意义
      // 刻度
      grid: {
        left: '0%',
        right: '4%',
        bottom: '10%',
        top: '25%',
        containLabel: true
    },
      // 悬浮图标
      tooltip: {
        show: true,
        trigger: 'axis',
        position: function (pos, params, dom, rect, size) {
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#DCE0E6',
            type:'dashed'
          }
        },
        axisLine:{//y轴坐标是否显示
          show:false
        },
        axisTick:{//y轴刻度小标是否显示
          show:false
        }
      },
      series: [{
        name: '影响因子',
        type: 'line',
        // 设置折线是否平滑
        smooth: true,
        data:a.reverse(),
        areaStyle:{
          normal: {
            color:  {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#DCE0E6" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0.0001)" // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
          }
        }
        }],
        
    };
    chart.setOption(option);
    return chart
  }
}
function initChart1(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width:width,
    height: height
  });
  canvas.setChart(chart);
  if(app.globalData.jcrList!=null){
    var a=[app.globalData.jcrList.jcrId.issn,app.globalData.jcrList.jcrId.review2,app.globalData.jcrList.jcrId.review,app.globalData.jcrList.jcrId.proof]

    var option = {
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      grid: {
          left: '0%',
          right: '4%',
          bottom: '10%',
          top: '25%',
          containLabel: true
      },
      xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
      },
      yAxis: {
          type: 'category',
          data: ['一审周期', '二审周期', '审稿周期', '见刊时间'].reverse()
      },
      series: [
          {
              name: '周期',
              type: 'bar',
              data: a,
              barWidth:10,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: 'rgba(98, 159, 232, 0.8)'},
                        {offset: 1, color: 'rgba(51, 102, 204, 0.8)'}
                    ]
                )
              },
          }
      ]
    };
    chart.setOption(option);
    return chart
  }
}
Page({
  data: {
    height:'',
    scrollTop:0,
    ec: {
      onInit: initChart
    },
    ec1: {
      onInit: initChart1
    },jcrList:null,gz:'关注',gz1:'已关注',gzList:null,
    show: false,message:'',comm:null,jcrid:'',more1:false
  },
  onLoad:function (option){
    wx.showShareMenu({
      withShareTicket: true
    })
    var data={openId:wx.getStorageSync('userInfo').openId}
    var url= app.globalData.URL + 'getJcrComment';
    app.wxRequest('POST',url,data,(res) => {
      this.setData({
        gzList:res.data.toString()
      })
    })
    this.setData({
      height:wx.getSystemInfoSync().windowHeight,
      width:wx.getSystemInfoSync().windowWidth,
      jcrid:option.id
    })
    var url1= app.globalData.URL + '/searchInfo';
    app.wxRequest('post',url1,{jcrid:option.id},(res) => {
      app.globalData.jcrList=res.data
      if(res.data.journalInfo.scope.length>150){
        this.setData({
          more1:true
        })
      }
      this.setData({
        jcrList:res.data
      })
    })
    this.getpinglun()
  },
  more:function(){
    this.setData({
      more1:false
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  getpinglun:function () {
    var url2= app.globalData.URL + 'getPingLun';
    app.wxRequest('POST',url2,{jcrId:this.data.jcrid},(res) => {
      this.setData({
        comm:res.data
      })
    })  
  },
  gunazhu:function (e) {
    var a=this.data.gzList.split(",")
    if(a.indexOf(e.target.dataset.id.toString())==-1){
      var data={jcrId:e.target.dataset.id,openId:wx.getStorageSync('userInfo').openId,isCollect:1}
      a.push(e.target.dataset.id.toString())
      this.setData({
        gzList:a.toString()
      })
    }else{
      var b=a.indexOf(e.target.dataset.id.toString())
      var data={jcrId:e.target.dataset.id,openId:wx.getStorageSync('userInfo').openId,isCollect:0}
      a.splice(b,1)
      this.setData({
        gzList:a.toString()
      })
    }
    var url= app.globalData.URL + 'putJcrComment';
    app.wxRequest('POST',url,data,(res) => {
    })
  },
  errimg:function (e) {
    var jcrList=this.data.jcrList
    jcrList.journalInfo.imgUrl="../../images/def.png"
    this.setData({jcrList:jcrList})
  },
  onPageScroll: function (e) {
    var _this = this;
    _this.setData({
      scrollTop:e.scrollTop
    })
  },
  fuzhi:function (event) {
    console.log(event)
    switch (event.target.dataset.fu){
      case "1":
        wx.setClipboardData({
        //准备复制的数据
          data: app.globalData.jcrList.journalInfo.editorPageUrl,
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            });
          }
        });
        break;
      case "2":
        wx.setClipboardData({
          //准备复制的数据
          data: app.globalData.jcrList.journalInfo.homePageUrl,
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            });
          }
        });
        break;
      case "3":
          wx.setClipboardData({
          //准备复制的数据
          data: app.globalData.jcrList.journalInfo.contact,
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            });
          }
        });
    }
  },
  comment:function (event) {
    
    this.setData({ 
      show: true ,
      message:''
    })
  },
  submit:function(e){
    if(this.data.message!=""){
      var data={jcrId:e.target.dataset.id,openId:wx.getStorageSync('userInfo').openId,content:this.data.message}
      var url= app.globalData.URL + 'putPingLun';
      app.wxRequest('POST',url,data,(res) => {
        if(res){
          this.setData({
            show:false
          })
          this.getpinglun()
        }
      })
    }else{
      Notify({ type: 'warning', message: "评论内容不为空！"}); 
    }
    
  },
  inputeidt: function (e) {
    this.setData({
      message:e.detail.value
    })
  },
  onShareAppMessage:function(e){
    return{
      title:"小盼选刊",
      imageUrl:"../../images/xiaopan.png",
      path:"/pages/infomation/infomation"
    }
  },
  onShareTimeline: function () {
    return{
      title:"小盼选刊",
      imageUrl:"../../images/xiaopan.png",
      path:`/pages/infomation/infomation?id=${this.data.jcrid}`
    }
  },
})
