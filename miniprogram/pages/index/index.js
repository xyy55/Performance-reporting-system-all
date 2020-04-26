// miniprogram/pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:[],
    key_index: 0,
    name_index:0,
    num:0,
    array:[],
    performance:{}
  },
  bindKeyChange: function (e) {
    this.setData({
      key_index: e.detail.value
    })
  },
  bindNameChange: function (e) {
    const db = wx.cloud.database();
    db.collection('performance').where({
      name: this.data.name[e.detail.value],
      time: app.globalData.time
    }).get().then(res => {
      if (res.data.length != 0) {
        this.setData({
          name_index: e.detail.value,
          performance: res.data[0].performance
        })
      }else{
        this.setData({
          name_index: e.detail.value,
          performance:{}
        })
      }
      
    })
  },
  add:function(e){
    let data = this.data
    if(data.num === 0){
      return
    }
    let performance = data.performance;
    performance[data.array[data.key_index]] = data.num;
    this.setData({
      performance:performance
    })
  },
  del:function(e){
    let key = e.currentTarget.dataset.key
    let performance = this.data.performance;
    delete performance[key];
    this.setData({
      performance:performance
    })
  },
  num_input:function(e){
    this.setData({
      num:e.detail.value
    })
  },
  name_input:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  submit:function(e){
    let that = this
    wx.showModal({
      title: '提示',
      content: '真的要提交吗？',
      success(res) {
        if (res.confirm) {
          let data = that.data
          let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
          let time = [year, month, day].join('/')
          let upload_data = {
            'time': time,
            'name': data.name[data.name_index],
            'performance': data.performance,
            'branch_id': app.globalData.branch_id,
            'user_info': app.globalData.user_info
          }
          let arg_data = {
            'table': 'performance',
            'opt': 'add',
            'data': upload_data
          }
          wx.cloud.callFunction({
            name: 'db',
            data: arg_data,
            success: res => {
              wx.showToast({
                title: '成功',
                icon: 'none'
              })
              console.log('[云函数] [login] user openid: ', res)
            },
            fail: err => {
              wx.showToast({
                title: '失败',
                icon: 'none'
              })
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    db.collection('name').doc(app.globalData.branch_id).get().then(res => {
      this.setData({
        name: res.data.name
      })
      app.globalData.name =  res.data.name
      db.collection('performance_title').doc(app.globalData.branch_id).get().then(res => {
        this.setData({
          array: res.data.performance_title
        })
        app.globalData.array = res.data.performance_title
      });
      db.collection('performance').where({
        name: this.data.name[this.data.name_index],
        time: app.globalData.time
      }).get().then(res => {
        if (res.data.length != 0) {
          this.setData({
            performance: res.data[0].performance
          })
        }
      })
    });
    
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
    this.onLoad()
    wx.stopPullDownRefresh();
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