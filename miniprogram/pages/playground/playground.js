// miniprogram/pages/playground/playground.js
const app = getApp()
const ctx = wx.createCanvasContext("red_top");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    performance: [],
    isHidden: true,
    imgPath:'',
    time:''
  },
  create:function(e){
    let head = app.globalData.branch_name + app.globalData.time+'业绩： '
    let performance = this.data.performance
    let personal_performance = ''
    let total_performance = {}
    let total_performance_sum = ''
    let business_performance = ''
    for(let item of performance){
      personal_performance += '⭕'+item.name + "  "
      for(let key in item.performance){
        if(key.indexOf('定投') != -1 ){
          personal_performance += key + item.performance[key] + '户  '
        }else if (key.indexOf('期') != -1 || key.indexOf('贷') != -1 || key.indexOf('基金') != -1 || key.indexOf('保险') != -1){
          personal_performance += key + item.performance[key] + '万  '
        }else{
          personal_performance += key + item.performance[key] + '  '
        }
        if(key in total_performance == false){
          total_performance[key] = parseFloat(item.performance[key])
        }else{
          total_performance[key] += parseFloat(item.performance[key])
        }
      }
      personal_performance += "\n"
    }
    for(let key in total_performance){
      if(key.indexOf('对公') != -1){
        business_performance += key + total_performance[key] + '  '
      }else{
        if(key.indexOf('定投') != -1 ){
          total_performance_sum += key + total_performance[key] + '户  '
        }else if (key.indexOf('期') != -1 || key.indexOf('贷') != -1 || key.indexOf('基金') != -1 || key.indexOf('保险') != -1) {
          total_performance_sum += key + total_performance[key] + '万  '
        }else{
          total_performance_sum += key + total_performance[key] + '  '
        }
      }
    }
    let finall = head + '\n' + personal_performance + '⭕' + head + total_performance_sum + '\n\n' + business_performance
    wx.setClipboardData({ data: finall })
    wx.showModal({
      title: '内容已经复制到剪切板',
      content: finall,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  create_red_top:function(e){
    let name = app.globalData.branch_name + e.currentTarget.dataset.name
    let key = e.currentTarget.dataset.key
    if(key.indexOf('定投') != -1 ){
      key = '成功营销' + key + e.currentTarget.dataset.value + "户"
    } else if (key.indexOf('期') != -1 || key.indexOf('贷') != -1 || key.indexOf('基金') != -1 || key.indexOf('保险') != -1) {
      key = '成功营销' + key + e.currentTarget.dataset.value + "万"
    } else if (key.indexOf('对公') != -1) {
      key = '成功办理' + key + e.currentTarget.dataset.value
    } else if (key.indexOf('卡') != -1) {
      key = '成功营销' + key + e.currentTarget.dataset.value + "张"
    }else{
      key = '成功营销'+ key + e.currentTarget.dataset.value
    }
    this.draw_image(name,key)
    console.log(e.currentTarget.dataset)
  },
  draw_image: function (name, performance, e) {
    let that = this
    this.setData({
      isHidden:false
    })
    ctx.drawImage("../../images/red-top.jpg", 0, 0, 200, 300)
    ctx.fillStyle = 'white'
    ctx.font = '15px Microsoft YaHei'
    ctx.textAlign = 'center';
    ctx.fillText(name, 100, 180)
    ctx.fillText(performance, 100, 200)
    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 200,
        height: 300,
        canvasId: 'red_top',
        success: function (res) {
          console.log(res);
          that.setData({
            imgPath:res.tempFilePath
          })
        }
      })
    });

  },
  hidde_red_top:function(e){
    this.setData({
      isHidden:true
    })
  },
  save_img:function(e){
    let that = this;
    wx.showModal({
      title: '提示',
      content: "是否保存到本地",
      success(res) {
        if (res.confirm) {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.imgPath,
            //保存成功失败之后，都要隐藏画板，否则影响界面显示。
            success: (res) => {
              wx.showToast({
                title: '图片保存成功',
              })
            },
            fail: (err) => {
              wx.showToast({
                title: '图片保存失败',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  input_time:function(e){
    let time = e.detail.value.replace(/-/g, '/')
    app.globalData.time = time
    const db = wx.cloud.database();
    db.collection('performance').where({
      time: time,
      branch_id: app.globalData.branch_id
    }).get().then(res => {
      this.setData({ performance: res.data,time:time,})
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    db.collection('performance').where({
      time:app.globalData.time,
      branch_id: app.globalData.branch_id
    }).get().then(res => {
      this.setData({performance:res.data,time:app.globalData.time})
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
    const db = wx.cloud.database();
    db.collection('performance').where({
      time: app.globalData.time,
      branch_id: app.globalData.branch_id
    }).get().then(res => {
      this.setData({ performance: res.data,time:app.globalData.time,})
    })
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