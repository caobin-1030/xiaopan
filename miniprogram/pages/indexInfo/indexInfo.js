//index.js
const app = getApp()

Page({
  data: {
    height:'',
    scrollTop:0,
    searchInfo:'',
    jcrList:[[]],
    sort:'',active1:'',active2:'',active3:'',active4:'',
    u:0,i:0,o:0,p:0,isShowLoadmore:false,isShowNoDatasTips:false,endloading: false,show:false,
    ifs:'',_ifid:'',_zhid:'',_cbid:'',_sgid:'',_oaid:'',page:1,testImg:'../../images/def.png',
    gzList:null,gz:'关注',gz1:'已关注'
  },
  onLoad:function (option){
    var data={openId:wx.getStorageSync('userInfo').openId}
    var url= app.globalData.URL + 'getJcrComment';
    app.wxRequest('POST',url,data,(res) => {
      this.setData({
        gzList:res.data.toString()
      })
    })
    this.setData({
      height:wx.getSystemInfoSync().windowHeight,
      searchInfo:option.search
    })
    this.reviewpage()
    
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
  reviewpage:function(){
    var data={title:this.data.searchInfo,sort:this.data.sort,page:this.data.page,ifsFilter:this.data._ifid,areaFilter:this.data._zhid,country:this.data._cbid,review:this.data._sgid,oa:this.data._oaid}
    var url= app.globalData.URL + '/searchJcr';
    app.wxRequest('POST',url,data,(res) => {
      var page1=this.data.page-1
      this.setData({
        ['jcrList[' + page1 + ']' ]: res.data,
        page:this.data.page+1
      })
      if(this.data.page*10>=res.msg){
        this.setData({
          isShowLoadmore:true,isShowNoDatasTips:true,endloading: true,
        })
      }
    }, (err)  => {
    })
  },
  onClose:function(){
    this.setData({
      show:false
    })
  },
  saixuan:function(){
    this.setData({
      show:true
    })
  },
  onReachBottom: function () {
    var that = this;
    var endloading = that.data.endloading
    if (!endloading){
      that.reviewpage()  //页面上拉调用这个方法
    }
  },
  onPageScroll: function (e) {
    var _this = this;
    _this.setData({
      scrollTop:e.scrollTop
    })
  },
  toInfomation:function (e){
    wx.navigateTo({
      url: `../infomation/infomation?id=${e.currentTarget.dataset.id}`,
    })
    app.globalData.jcrList=e.currentTarget.dataset.jcr
  },
  cn:function (e) {
    var a=this.data.u+1
    this.setData({
      u:a,i:0,o:0,p:0,active1:'#FF6B00',active2:'',active3:'',active4:'',jcrList:[[]],page:1
    })
    if(this.data.u%2==1){
      this.setData({
        sort:'cn_asc'
      })
    }else if(this.data.u%2==0){
      this.setData({
        sort:'cn_desc'
      })
    }
    this.reviewpage()
  },
  if:function (e) {
    var a=this.data.i+1
    this.setData({
      u:0,i:a,o:0,p:0,active1:'',active2:'#FF6B00',active3:'',active4:'',jcrList:[[]],page:1
    })
    if(this.data.i%2==1){
      this.setData({
        sort:'if_asc'
      })
    }else if(this.data.i%2==0){
      this.setData({
        sort:'if_desc'
      })
    }
    this.reviewpage()
  },
  errimg:function (e) {
    var errorImgIndex= e.target.dataset.errorimg //获取循环的下标
    var errorImgIndex1= e.target.dataset.errorimg1 //获取循环的下标
    var jcrList=this.data.jcrList
    jcrList[errorImgIndex1][errorImgIndex].journalInfo.imgUrl="../../images/def.png"
    this.setData({jcrList:jcrList})
  },
  review:function (e) {
    var a=this.data.o+1
    this.setData({
      u:0,i:0,o:a,p:0,active1:'',active2:'',active3:'#FF6B00',active4:'',jcrList:[[]],page:1
    })
    if(this.data.o%2==1){
      this.setData({
        sort:'re_asc'
      })
    }else if(this.data.o%2==0){
      this.setData({
        sort:'re_desc'
      })
    }
    this.reviewpage()
  },
  rate:function (e) {
    var a=this.data.p+1
    this.setData({
      u:0,i:0,o:0,p:a,active1:'',active2:'',active3:'',active4:'#FF6B00',jcrList:[[]],page:1
    })
    if(this.data.p%2==1){
      this.setData({
        sort:'ra_asc'
      })
    }else if(this.data.p%2==0){
      this.setData({
        sort:'ra_desc'
      })
    }
    this.reviewpage()
  },
  ifChange:function(){

  },
  ifsClick:function(e){
    this.setData({
      _ifid:e.target.dataset.ifid
    })
  },
  zhClick:function(e){
    this.setData({
      _zhid:e.target.dataset.zhid
    })
  },
  sgClick:function(e){
    this.setData({
      _sgid:e.target.dataset.sgid
    })
  },
  oaClick:function(e){
    this.setData({
      _oaid:e.target.dataset.oaid
    })
  },
  cbClick:function(e){
    this.setData({
      _cbid:e.target.dataset.cbid
    })
  },
  czClick:function(){
    this.setData({
      _cbid:'',_oaid:'',_ifid:'',_sgid:'',_zhid:'',show:false,jcrList:[[]],page:1,u:0,i:0,o:0,p:0,active1:'',active2:'',active3:'',active4:''
    })
    this.reviewpage()
  },
  qzClick:function(){
    this.setData({
      show:false
    })
  },
  qdClick:function(){
    this.setData({
      show:false,jcrList:[[]],page:1,u:0,i:0,o:0,p:0,active1:'',active2:'',active3:'',active4:''
    })
    this.reviewpage()
  },
  fuanzhu:function () {
    
  },
  onShareAppMessage:function(e){
    return{
      title:"小盼选刊",
      imageUrl:"../../images/xiaopan.png",
      path:"/pages/indexInfo/indexInfo"
    }
  },
  onShareTimeline: function () {
    return{
      title:"小盼选刊",
      imageUrl:"../../images/xiaopan.png",
      path:`/pages/indexInfo/indexInfo?search=${this.data.searchInfo}`
    }
  },
})
