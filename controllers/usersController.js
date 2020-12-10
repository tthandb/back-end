const users = require('../models/users.js')
const tasks = require('../models/tasks.js')
const Auth = require('../models/authentication.js')

module.exports = (response) => ({
  home: () => {
    response.end(
      JSON.stringify({
        status: 200,
        success: true,
        message: 'Homepage',
      }),
    )
  },
  signUp: (postData, apiKey) => {
    if (
      postData.username !== undefined
        && postData.username != null
        && postData.password !== undefined
        && postData.password != null
    ) {
      Auth.apiAuthentication(apiKey, (err, result) => {
        if (err) {
          response.end(
            JSON.stringify({
              id: 1,
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
          users.signUp(postData, (err, result) => {
            if (err) {
              response.end(
                JSON.stringify({
                  status: 500,
                  success: false,
                  message: 'username id already exists',
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
      })
    } else {
      response.end(
        JSON.stringify({
          status: 202,
          success: false,
          message: 'Invalid parameters',
        }),
      )
    }
  },
  signIn: (userData, apiKey) => {
    if (
      userData.username === undefined
        || userData.username == null
        || userData.password
        || null
        || userData.password === undefined
    ) {
      Auth.apiAuthentication(apiKey, (err, result) => {
        if (err) {
          response.end(
            JSON.stringify({
              id: 2,
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
          users.login(userData, (err, result) => {
            if (err) {
              response.end(
                JSON.stringify({
                  status: 203,
                  success: false,
                  message: 'Invalid server error',
                  err,
                }),
              )
            } else if (result.message === null) {
              response.end(
                JSON.stringify({
                  status: 401,
                  success: true,
                  message: result.message,
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
      })
    } else {
      response.end(
        JSON.stringify({
          status: 500,
          success: false,
          message: 'Internal server error',
        }),
      )
    }
  },
  signOut: (headers) => {
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
            users.logOut(headers.access_token, (err) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 203,
                    success: false,
                    message: 'Invalid server error',
                    err,
                  }),
                )
              } else {
                response.end(
                  JSON.stringify({
                    status: 200,
                    success: true,
                    message: 'Log out successful',
                  }),
                )
              }
            })
          }
        })
      }
    })
  },
  getUserInfo: (headers, userParams) => {
    Auth.apiAuthentication(headers.api_key, (err, result) => {
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
          } else if (userParams.user_id === undefined) {
            response.end(
              JSON.stringify({
                status: 201,
                success: false,
                message: 'User_id not found',
              }),
            )
          } else {
            let userInfo = {}
            users.getUserInfo(userParams.user_id, (err, result) => {
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
                    message: 'No such project exists for user',
                  }),
                )
              } else {
                userInfo = { ...userInfo, ...result[0] }
                tasks.countTask(
                  userParams.user_id,
                  userParams.project_id,
                  userParams.status_id,
                  (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: err,
                        }),
                      )
                    } else {
                      userInfo = { ...userInfo, ...result[0] }
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data: userInfo,
                        }),
                      )
                    }
                  },
                )
              }
            })
          }
        })
      }
    })
  },
})
