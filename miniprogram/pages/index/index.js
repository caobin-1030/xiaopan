//index.js
const app = getApp()

Page({
  data: {
    value:'',search1:['nature','NC','Molecular Cancer','oncogene','journal of medical virology'],search2:['Science Advances','gyt','lancet','blood','protein cell'],search3:['NEJM','JAMA','Autophagy','immunity'],search:null,i:1
  },
  onLoad:function (params) {
    this.setData({
      search:this.data.search1
    })
  },
  
  onSearch() {
    Toast('搜索' + this.data.value);
  },
  onClick() {
    Toast('搜索' + this.data.value);
  },
  replace:function() {
    var t=this.data.i+1
    if(t%3==1){
      this.setData({
        search:this.data.search1,
        i:t
      })
    }else if(t%3==2){
      this.setData({
        search:this.data.search2,
        i:t
      })
    }else {
      this.setData({
        search:this.data.search3,
        i:t
      })
    }
  },
  xinxi:function(){
  },
  bindconfirm:function(e){
    wx.navigateTo({
      url: `../indexInfo/indexInfo?search=${e.detail.value}`,
    })
  },
  onShareAppMessage:function(e){
    return{
      title:"小盼选刊",
      imageUrl:"../../images/xiaopan.png",
      path:"/pages/index/index"
    }
  },
  onShareTimeline: function () {
    return{
      title:"小盼选刊",
      imageUrl:"../../images/xiaopan.png",
      path:`/pages/index/index`
    }
  },
  toindexInfo:function (e) {
    wx.navigateTo({
      url: `../indexInfo/indexInfo?search=${e.target.dataset.item}`,
    })
  }
})
