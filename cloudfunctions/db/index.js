const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const db = cloud.database()
  const table = db.collection(event.table);
  const _ = db.command
  if(event.opt === 'add'){
    table.where({
      time: event.data.time,
      name:event.data.name
    }).get().then(res => {
      if (res.data.length === 0){
        table.add({data:event.data})
      }else{
        table.where({
          time: event.data.time,
          name: event.data.name,
          branch_id:event.data.branch_id
        })
        .update({
          data: { performance: _.set(event.data.performance),user_info:_.set(event.data.user_info)}
        })
      }
    })
  }
}