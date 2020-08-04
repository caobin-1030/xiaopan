//login.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:true,
    detail:''
  },
    
  onLoad: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              wx.setStorageSync('detail', JSON.stringify(res))
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  var data={data:wx.getStorageSync('detail'),code:res.code}
                  var url= app.globalData.URL + '/login';
                  app.wxRequest('POST',url,data,(res) => {
                    wx.setStorageSync('userInfo', res.data)
                    that.setData({
                      isHide: false
                    });
                    wx.switchTab({
                      url: '../index/index',
                    }) 
                  }, (err) => {
                  })
                }
              })
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
},

  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      wx.login({
        success: res => {
          // 获取到用户的 code 之后：res.code
          var data={data:JSON.stringify(e.detail),code:res.code}
          var url= app.globalData.URL + '/login';
          app.wxRequest('POST',url,data,(res) => {
            wx.setStorageSync('userInfo', res.data)
            that.setData({
              isHide: false
            });
            wx.switchTab({
              url: '../index/index',
            }) 
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
  }

})
