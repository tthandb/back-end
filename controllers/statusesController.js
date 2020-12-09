const statuses = require('../models/statuses.js')
const Auth = require('../models/authentication.js')

module.exports = (response) => ({
  handleViewStatus: (headers, statusId) => {
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
                  statuses.viewStatus(statusId, (err, result) => {
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
                          message: 'No such status exists for user',
                        }),
                      )
                    } else {
                      const data = {
                        status_id: result[0].id,
                        status_name: result[0].name,
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
  handleViewAllStatuses: (headers) => {
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
                  statuses.viewAllStatuses((err, result) => {
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
