// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const branch_id = event.branch_id
  delete event['branch_id']
  for(key in event){
    let table = db.collection(key)
    let data = {}
    data[key] = event[key]
    table.doc(branch_id).update({
      data: data
    })
  }
}