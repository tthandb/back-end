const users = require('../models/users.js')
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
  getAllUsers: (headers) => {
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
                  users.getAllUsers((err, result) => {
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
})
