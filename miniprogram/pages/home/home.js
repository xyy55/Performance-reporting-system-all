// miniprogram/pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:'',
    branch_id:'',
    is_auth:false
  },
  id_input:function(e){
    this.setData({
      branch_id:e.detail.value
    })
  },
  submit:function(e){
    let that = this
    const db = wx.cloud.database();
    if(this.data.branch_id == ''){
      wx.showToast({
        title: '机构号不能为空！',
        icon: 'none'
      })
      return
    }
    db.collection("branch").doc(this.data.branch_id).get({
      success:function(res){
        app.globalData.branch_id = that.data.branch_id
        app.globalData.branch_name = res.data.branch
        app.globalData.user_info = that.data.user_info
        let data = {
          branch_name:res.data.branch,
          branch_id:that.data.branch_id,
          user_info:that.data.user_info
        }
        wx.setStorageSync('info',data)
        wx.switchTab({
          url: '../index/index',
          success: function (res) {
            return
          }
        })
      },
      fail:function(res){
        wx.showToast({
          title: '查无此机构号！',
          icon: 'none'
        })
      }
    })
  },
  get_info:function(e){
    if(e.detail.userInfo != undefined){
      this.setData({
        user_info:e.detail.userInfo,
        is_auth:true
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let user_info = ''
    let info = wx.getStorageSync('info')
    if(info == ''){
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              complete: (r) => {
                console.log(r.userInfo)
                user_info = r.userInfo
                that.setData({
                  user_info:user_info
                })
              }
            })
            that.setData({
              is_auth:true
            })
          }
        }
      })
    }else{
      app.globalData.branch_id = info.branch_id
      app.globalData.branch_name = info.branch_name
      app.globalData.user_info = info.user_info
      wx.switchTab({
        url: '../index/index'
      })
    }
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