'use strict';
let projects = require('../models/projects.js');
let Auth = require('../models/authentication.js');

module.exports = (response) => {
  return {
    handleCreateProject: (postData, headers) => {
      Auth.apiAuthentication(headers.api_key, (err, result) => {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: 'Internal server error',
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'Not authorized',
              })
            );
          } else {
            Auth.userAuthentication(headers, (err, result) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                  })
                );
              } else {
                if (result === false)
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'user not authorized',
                    })
                  );
                else
                  projects.createProject(postData, (err, result) => {
                    if (err)
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                        })
                      );
                    else
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data: result,
                        })
                      );
                  });
              }
            });
          }
        }
      });
    },
    handleUpdateProject: (postData, headers) => {
      Auth.apiAuthentication(headers.api_key, function (err, result) {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: 'Internal server error',
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'Not authorized',
              })
            );
          } else {
            Auth.userAuthentication(headers, (err, result) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'user not authorized',
                    })
                  );
                } else {
                  projects.updateProject(postData, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                        })
                      );
                    } else {
                      if (result === false) {
                        response.end(
                          JSON.stringify({
                            status: 201,
                            success: false,
                            message: 'No such task exists for user',
                          })
                        );
                      } else {
                        const data = {
                          project_id: postData.project_id,
                          project_name: postData.project_name,
                        };
                        response.end(
                          JSON.stringify({
                            status: 200,
                            success: true,
                            data: data,
                          })
                        );
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    },
    handleDeleteProject: (headers, projectId) => {
      Auth.apiAuthentication(headers.api_key, (err, result) => {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: 'Internal server error',
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'Not authorized',
              })
            );
          } else {
            Auth.userAuthentication(headers, (err, result) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'user not authorized',
                    })
                  );
                } else {
                  projects.deleteProject(projectId, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 409,
                          success: false,
                          message: 'Project is not empty',
                        })
                      );
                    } else {
                      if (result === true) {
                        response.end(
                          JSON.stringify({
                            status: 200,
                            success: true,
                            message: 'Project deleted successfully',
                          })
                        );
                      } else {
                        response.end(
                          JSON.stringify({
                            status: 201,
                            success: false,
                            message: 'No such task exists',
                          })
                        );
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    },
    handleViewProject: (headers, projectId) => {
      Auth.apiAuthentication(headers.api_key, (err, result) => {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: 'Internal server error',
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'Not authorized',
              })
            );
          } else {
            Auth.userAuthentication(headers, (err, result) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'user not authorized',
                    })
                  );
                } else {
                  projects.viewProject(projectId, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                        })
                      );
                    } else {
                      if (result === false) {
                        response.end(
                          JSON.stringify({
                            status: 201,
                            success: false,
                            message: 'No such project exists for user',
                          })
                        );
                      } else {
                        let data = {
                          project_id: result[0].project_id,
                          project_name: result[0].project_name,
                          tasks: [],
                        };
                        response.end(
                          JSON.stringify({
                            status: 200,
                            success: true,
                            data: data,
                          })
                        );
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    },
    handleViewAllProjects: (headers) => {
      Auth.apiAuthentication(headers.api_key, (err, result) => {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: 'Internal server error',
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: 'Not authorized',
              })
            );
          } else {
            Auth.userAuthentication(headers, (err, result) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: 'user not authorized',
                    })
                  );
                } else {
                  projects.viewAllProjects((err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error',
                        })
                      );
                    } else {
                      response.end(
                        JSON.stringify({
                          status: 200,
                          success: true,
                          data: result,
                        })
                      );
                    }
                  });
                }
              }
            });
          }
        }
      });
    },
  };
};
