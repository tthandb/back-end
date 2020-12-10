const db = require('../config/database.js')

module.exports = {
  createTask: (task, callback) => {
    db.query('insert into tasks set ?', task, (error, result) => {
      if (!error) {
        const data = {
          task_id: result.insertId,
          task_title: task.task_title,
          project_id: task.project_id,
          user_id: task.user_id,
        }
        callback(0, data)
      } else callback(error)
    })
  },
  deleteTask: (taskId, callback) => {
    module.exports.taskAuth(taskId, (err, result) => {
      if (err) callback(err)
      else if (result === true) {
        db.query(
          'delete from tasks where task_id = ?',
          [taskId],
          (error) => {
            if (!error) callback(0, true)
            else callback(error)
          },
        )
      } else callback(0, false)
    })
  },
  viewTask: (taskId, callback) => {
    module.exports.checkTaskExist(taskId, (err, result) => {
      if (err) {
        callback(err)
      } else if (result === true) {
        db.query(
          'select * from tasks where task_id = ?',
          [taskId],
          (error, result) => {
            if (!error) {
              callback(0, result)
            } else callback(error)
          },
        )
      } else {
        callback(0, false)
      }
    })
  },
  viewAllTasks: (callback) => {
    db.query('select * from tasks', (error, result) => {
      if (!error) {
        callback(0, result)
      } else callback(error)
    })
  },
  updateTask: (task, callback) => {
    module.exports.taskAuth(task.task_id, (err, result) => {
      if (err) {
        callback(err)
      } else if (result === true) {
        db.query(
          'update tasks set ? where task_id = ?',
          [
            {
              task_title: task.task_title,
              project_id: task.project_id,
              user_id: task.user_id,
              status_id: task.status_id,
            },
            task.task_id,
          ],
          (error, result) => {
            if (!error) {
              callback(0, result)
            } else callback(error)
          },
        )
      } else {
        callback(0, false)
      }
    })
  },
  filterTask: (task, callback) => {
    task.keyword = `%${task.keyword}%`
    const data = [task.keyword, task.project_id, task.user_id, task.status_id]
      .filter((e) => e !== undefined)
    let conditions = []
    if (task.keyword !== undefined) conditions.push('task_title like ?')
    if (task.project_id !== undefined) conditions.push('project_id = ?')
    if (task.user_id !== undefined) conditions.push('user_id = ?')
    if (task.status_id !== undefined) conditions.push('status_id = ?')
    conditions = conditions.join(' && ')
    db.query(`select * from tasks where ${conditions}`, data, (error, result) => {
      if (!error) {
        callback(0, result)
      } else callback(error)
    })
  },
  countTask: (userId, projectId, statusId, callback) => {
    let conditions = []
    const data = [userId, projectId, statusId].filter((e) => e !== undefined)
    if (userId !== undefined) conditions.push('user_id = ?')
    if (projectId !== undefined) conditions.push('project_id = ?')
    if (statusId !== undefined) conditions.push('status_id = ?')
    conditions = conditions.join(' && ')
    db.query(`select count(*) as tasks from tasks where ${conditions}`, data, (error, result) => {
      if (!error) {
        callback(0, result)
      } else callback(error)
    })
  },
  taskAuth: (taskId, callback) => {
    db.query(
      'select count(*) as task_count from tasks where task_id = ?',
      [taskId],
      (error, rows) => {
        if (!error) {
          if (rows[0].task_count) {
            callback(0, true)
          } else {
            callback(0, false)
          }
        } else callback(error)
      },
    )
  },
  checkTaskExist: (taskId, callback) => {
    db.query(
      'select count(*) as task_count from tasks where task_id = ?',
      [taskId],
      (error, rows) => {
        if (!error) {
          if (rows[0].task_count) {
            callback(0, true)
          } else {
            callback(0, false)
          }
        } else callback(error)
      },
    )
  },
}
