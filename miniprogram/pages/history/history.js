// miniprogram/pages/history/history.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_time:'',
    end_time:'',
    performance:''
  },
  input_start_time:function(e){
    let time = e.detail.value.replace(/-/g, '/')
    this.setData({
      start_time: time
    })
  },
  input_end_time:function(e){
    let time = e.detail.value.replace(/-/g, '/')
    this.setData({
      end_time: time
    })
  },
  create:function(e){
    const db = wx.cloud.database();
    const _ = db.command
    let start = new Date(this.data.start_time),
        end = new Date(this.data.end_time),
        daymis = 24*3600*1000,
        now = start,
        all_time = [],
        all_performance = {};
    while(now <= end){
      let month = '' + (now.getMonth() + 1),
          day = '' + now.getDate(),
          year = now.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      let now_time = [year, month, day].join('/')
      all_time.push(now_time);
      now=new Date(now.getTime()+daymis);
    }
    wx.cloud.callFunction({
      name: 'get_all_db',
      data: {"time":all_time,"branch_id":app.globalData.branch_id},
      success: res => {
        console.log('[云函数]调用成功', res)
        for(let i of res.result.data){
          if(Object.keys(all_performance).indexOf(i.name) === -1){
            all_performance[i.name] = i.performance
          }else{
            for(let p of Object.keys(i.performance)){
              if(Object.keys(all_performance[i.name]).indexOf(p) === -1){
                all_performance[i.name][p] = parseFloat(i.performance[p])
              }else{
                all_performance[i.name][p] = parseFloat(all_performance[i.name][p]) + parseFloat(i.performance[p])
              }
            }
          }
        }
        this.setData({
          performance:all_performance
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      start_time:app.globalData.time,
      end_time:app.globalData.time
    })
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