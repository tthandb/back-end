const tasks = require('../models/tasks.js')
const Auth = require('../models/authentication.js')

module.exports = (response) => ({
  handleCreateTask: (postData, headers) => {
    Auth.apiAuthentication(headers.api_key, (err, result) => {
      if (err) {
        response.end(
          JSON.stringify({
            status: 500,
            success: false,
            message: 'Internal server error',
          }),
        )
      } else if (result === false) {
        response.end(
          JSON.stringify({
            status: 401,
            success: false,
            message: 'Not authorized',
          }),
        )
      } else {
        Auth.userAuthentication(headers, (err, result) => {
          if (err) {
            response.end(
              JSON.stringify({
                status: 500,
                success: false,
                message: 'Internal server error1',
              }),
            )
          } else if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'user not authorized',
              }),
            )
          } else {
            Auth.accessAuthentication(
              headers.user_id,
              headers.access_token,
              (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: 'Internal server error1',
                    }),
                  )
                } else if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'Access is denied',
                    }),
                  )
                } else {
                  if (postData.user_id === null
                        || postData.user_id === undefined) postData.user_id = headers.user_id
                  else if (postData.user_id === '') postData.user_id = headers.user_id
                  tasks.createTask(postData, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                        }),
                      )
                    } else {
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data: result,
                        }),
                      )
                    }
                  })
                }
              },
            )
          }
        })
      }
    })
  },
  handleDeleteTask: (headers, taskId) => {
    Auth.apiAuthentication(headers.api_key, (err, result) => {
      if (err) {
        response.end(
          JSON.stringify({
            status: 500,
            success: false,
            message: 'Internal server error',
          }),
        )
      } else if (result === false) {
        response.end(
          JSON.stringify({
            status: 401,
            success: false,
            message: 'Not authorized',
          }),
        )
      } else {
        Auth.userAuthentication(headers, (err, result) => {
          if (err) {
            response.end(
              JSON.stringify({
                status: 500,
                success: false,
                message: 'Internal server error',
              }),
            )
          } else if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'user not authorized',
              }),
            )
          } else {
            Auth.accessAuthentication(
              headers.user_id,
              headers.access_token,
              (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: 'Internal server error',
                    }),
                  )
                } else if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'access is denied',
                    }),
                  )
                } else {
                  tasks.deleteTask(taskId, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                          err,
                        }),
                      )
                    } else if (result === true) {
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          message: 'task deleted successfully',
                        }),
                      )
                    } else {
                      response.end(
                        JSON.stringify({
                          status: 201,
                          success: false,
                          message: 'No such task exists',
                        }),
                      )
                    }
                  })
                }
              },
            )
          }
        })
      }
    })
  },
  handleViewTask: (headers, taskId) => {
    Auth.apiAuthentication(headers.api_key, (err, result) => {
      if (err) {
        response.end(
          JSON.stringify({
            status: 500,
            success: false,
            message: 'Internal server error',
          }),
        )
      } else if (result === false) {
        response.end(
          JSON.stringify({
            status: 401,
            success: false,
            message: 'Not authorized',
          }),
        )
      } else {
        Auth.userAuthentication(headers, (err, result) => {
          if (err) {
            response.end(
              JSON.stringify({
                status: 500,
                success: false,
                message: 'Internal server error',
              }),
            )
          } else if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'user not authorized',
              }),
            )
          } else {
            Auth.accessAuthentication(
              headers.user_id,
              headers.access_token,
              (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: 'Internal server error1',
                    }),
                  )
                } else if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'access is denied',
                    }),
                  )
                } else {
                  tasks.viewTask(taskId, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                        }),
                      )
                    } else if (result === false) {
                      response.end(
                        JSON.stringify({
                          status: 201,
                          success: false,
                          message: 'No such task exists for user',
                        }),
                      )
                    } else {
                      const data = {
                        task_id: result[0].task_id,
                        task_title: result[0].task_title,
                        project_id: result[0].project_id,
                        user_id: result[0].user_id,
                        create_at: result[0].create_at,
                      }
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data,
                        }),
                      )
                    }
                  })
                }
              },
            )
          }
        })
      }
    })
  },
  handleViewAllTasks: (headers) => {
    Auth.apiAuthentication(headers.api_key, (err, result) => {
      if (err) {
        response.end(
          JSON.stringify({
            status: 500,
            success: false,
            message: 'Internal server error',
          }),
        )
      } else if (result === false) {
        response.end(
          JSON.stringify({
            status: 401,
            success: false,
            message: 'Not authorized',
          }),
        )
      } else {
        Auth.userAuthentication(headers, (err, result) => {
          if (err) {
            response.end(
              JSON.stringify({
                status: 500,
                success: false,
                message: 'Internal server error',
              }),
            )
          } else if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'user not authorized',
              }),
            )
          } else {
            Auth.accessAuthentication(
              headers.user_id,
              headers.access_token,
              (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: 'Internal server error1',
                    }),
                  )
                } else if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'access is denied',
                    }),
                  )
                } else {
                  tasks.viewAllTasks((err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                        }),
                      )
                    } else {
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data: result,
                        }),
                      )
                    }
                  })
                }
              },
            )
          }
        })
      }
    })
  },
  handleUpdateTask: (postData, headers) => {
    Auth.apiAuthentication(headers.api_key, (err, result) => {
      if (err) {
        response.end(
          JSON.stringify({
            status: 500,
            success: false,
            message: 'Internal server error',
          }),
        )
      } else if (result === false) {
        response.end(
          JSON.stringify({
            status: 401,
            success: false,
            message: 'Not authorized',
          }),
        )
      } else {
        Auth.userAuthentication(headers, (err, result) => {
          if (err) {
            response.end(
              JSON.stringify({
                status: 500,
                success: false,
                message: 'Internal server error',
                err,
              }),
            )
          } else if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'user not authorized',
              }),
            )
          } else {
            Auth.accessAuthentication(
              headers.user_id,
              headers.access_token,
              (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: 'Internal server error1',
                    }),
                  )
                } else if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'access is denied',
                    }),
                  )
                } else {
                  tasks.updateTask(postData, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                          err,
                        }),
                      )
                    } else if (result === false) {
                      response.end(
                        JSON.stringify({
                          status: 201,
                          success: false,
                          message: 'No Such task exists for user',
                        }),
                      )
                    } else {
                      const data = {
                        task_id: postData.task_id,
                        task_title: postData.task_title,
                        project_id: postData.project_id,
                        user_id: postData.user_id,
                      }
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data,
                        }),
                      )
                    }
                  })
                }
              },
            )
          }
        })
      }
    })
  },
  handleFilterTask: (postData, headers) => {
    Auth.apiAuthentication(headers.api_key, (err, result) => {
      if (err) {
        response.end(
          JSON.stringify({
            status: 500,
            success: false,
            message: 'Internal server error',
          }),
        )
      } else if (result === false) {
        response.end(
          JSON.stringify({
            status: 401,
            success: false,
            message: 'Not authorized',
          }),
        )
      } else {
        Auth.userAuthentication(headers, (err, result) => {
          if (err) {
            response.end(
              JSON.stringify({
                status: 500,
                success: false,
                message: 'Internal server error',
                err,
              }),
            )
          } else if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'user not authorized',
              }),
            )
          } else {
            Auth.accessAuthentication(
              headers.user_id,
              headers.access_token,
              (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: 'Internal server error1',
                    }),
                  )
                } else if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'access is denied',
                    }),
                  )
                } else {
                  tasks.filterTask(postData, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                          err,
                        }),
                      )
                    } else if (result === false) {
                      response.end(
                        JSON.stringify({
                          status: 201,
                          success: false,
                          message: 'No Such task exists for user',
                        }),
                      )
                    } else {
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data: result,
                        }),
                      )
                    }
                  })
                }
              },
            )
          }
        })
      }
    })
  },
})
