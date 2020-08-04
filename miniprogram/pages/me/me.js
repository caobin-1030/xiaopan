//index.js
const app = getApp()

Page({
  data: {
    value:'',
    userInfo:'',
    active: 1,
  },
  onLoad:function (){
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
})
