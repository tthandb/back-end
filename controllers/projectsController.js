const projects = require('../models/projects.js')
const Auth = require('../models/authentication.js')

module.exports = (response) => ({
  handleCreateProject: (postData, headers) => {
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
        Auth.userAuthentication(headers, (err) => {
          if (err) {
            response.end(
              JSON.stringify({
                status: 500,
                success: false,
                message: 'Internal server error',
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
                } else if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'user not authorized',
                    }),
                  )
                } else {
                  projects.createProject(postData, (err, result) => {
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
  handleUpdateProject: (postData, headers) => {
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
                  projects.updateProject(postData, (err, result) => {
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
                        project_id: postData.project_id,
                        project_name: postData.project_name,
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
  handleDeleteProject: (headers, projectId) => {
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
                  projects.deleteProject(projectId, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 409,
                          success: false,
                          message: 'Project is not empty',
                        }),
                      )
                    } else if (result === true) {
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          message: 'Project deleted successfully',
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
  handleViewProject: (headers, projectId) => {
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
                  projects.viewProject(projectId, (err, result) => {
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
                          message: 'No such project exists for user',
                        }),
                      )
                    } else {
                      const data = {
                        project_id: result[0].project_id,
                        project_name: result[0].project_name,
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
  handleViewAllProjects: (headers) => {
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
                  projects.viewAllProjects((err, result) => {
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
