//index.js
const app = getApp()

Page({
  data: {
    value:'',
    userInfo:'',
    active:0,commList:[],plList:[],isShowLoadmoreGZ:false,isShowNoDatasTipsGZ:false,isShowLoadmorePL:false,isShowNoDatasTipsPL:false,endloadingGZ:false,endloadingPL:false,
    pageGZ:1,pagePL:1,
    height:'',
    scrollTop:0,
  },
  onLoad:function (){
    console.log(wx.getStorageSync('userInfo'))
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
      height:wx.getSystemInfoSync().windowHeight-130,
    })
    this.getComm()
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      wx.login({
        success: res => {
          // 获取到用户的 code 之后：res.code
          var data={data:JSON.stringify(e.detail),code:res.code}
          wx.setStorageSync('detail', JSON.stringify(e.detail))
          var url= app.globalData.URL + 'login';
          app.wxRequest('POST',url,data,(res) => {
            wx.setStorageSync('userInfo', res.data)
            that.setData({
              userInfo: res.data,
              pageGZ:1
            });
            this.getComm()
          }, (err) => {
          })
        }
      })
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
          }
        }
      });
    }
  },
  bindscrollfxGZ: function (e) {
    console.log(1)
    var that = this;
    var endloadingGZ = that.data.endloadingGZ
    if (!endloadingGZ){
      console.log(1)
      that.getComm()  //页面上拉调用这个方法
    }  
  },
  bindscrollfxPL: function (e) {
    var that = this;
    var endloadingPL = that.data.endloadingPL
    if (!endloadingPL){
      that.getPL()  //页面上拉调用这个方法
    }       
  },
  getComm:function (){
    var data={openId:wx.getStorageSync('userInfo').openId,pageNo:this.data.pageGZ}
    var url= app.globalData.URL + 'getMyComment';
    app.wxRequest('POST',url,data,(res) => {
      var page1=this.data.pageGZ-1
      if(this.data.pageGZ*20>=res.msg){
        this.setData({
          isShowLoadmoreGZ:true,isShowNoDatasTipsGZ:true,endloadingGZ: true,
        })
      }
      this.setData({
        ['commList[' + page1 + ']' ]: res.data,
        pageGZ:this.data.pageGZ+1,
      })
    })
  },
  onPageScroll: function (e) {
    var _this = this;
    _this.setData({
      scrollTop:e.scrollTop
    })
  },
  getPL:function(){
    var data={openId:wx.getStorageSync('userInfo').openId,pageNo:this.data.pagePL}
    var url= app.globalData.URL + 'getMyPinglun';
    app.wxRequest('POST',url,data,(res) => {
      var page1=this.data.pagePL-1
      if(this.data.pagePL*20>=res.msg){
        this.setData({
          isShowLoadmorePL:true,isShowNoDatasTipsPL:true,endloadingPL: true,
        })
      }
      this.setData({
        ['plList[' + page1 + ']' ]: res.data,
        pagePL:this.data.pagePL+1,
      })
      
    })
  },
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none',
    // });
    switch (event.detail.name){
      case 0:
        this.getComm()
        break;
      case 1:
        this.getPL()
        break;
      case 2:

    }
  },
  toinfomation:function (e){
    wx.navigateTo({
      url: `../infomation/infomation?id=${e.currentTarget.dataset.id}`,
    })
  },
  onReachBottom: function () {
    switch (this.data.active){
      case "0":
        var that = this;
        var endloadingGZ = that.data.endloadingGZ
        if (!endloadingGZ){
          that.getComm()
        }
        break;
      case '1':
        var that = this;
        var endloadingPL = that.data.endloadingPL
        if (!endloadingPL){
          that.getPL()
        }
    }
    
  },
})
