'use strict';
let projects = require('../models/projects.js');
let Auth = require('../models/authentication.js');

module.exports = (response) => {
  return {
    create_project: (postData, headers) => {
      Auth.api_authentication(headers.api_key, (err, result) => {
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
            Auth.user_authentication(headers, (err, result) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: 'Internal server error1',
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
                  projects.createTask(postData, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: 'Internal server error2',
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
    delete_project: (headers, project_id) => {
      Auth.api_authentication(headers.api_key, (err, result) => {
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
            Auth.user_authentication(headers, function (err, result) {
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
                  projects.deleteTask(
                    headers.user_id,
                    project_id,
                    (err, result) => {
                      if (err) {
                        response.end(
                          JSON.stringify({
                            status: 500,
                            success: false,
                            message: 'Internal server error',
                            err,
                          })
                        );
                      } else {
                        if (result === true) {
                          response.end(
                            JSON.stringify({
                              status: 200,
                              success: true,
                              message: 'project deleted successfully',
                            })
                          );
                        } else {
                          response.end(
                            JSON.stringify({
                              status: 201,
                              success: false,
                              message: 'No such project exists',
                            })
                          );
                        }
                      }
                    }
                  );
                }
              }
            });
          }
        }
      });
    },
    view_project: (headers, project_id) => {
      Auth.api_authentication(headers.api_key, (err, result) => {
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
            Auth.user_authentication(headers, (err, result) => {
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
                  projects.viewTask(project_id, (err, result) => {
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
                          project_title: result[0].project_title,
                          project_id: result[0].project_id,
                          user_id: result[0].user_id,
                          create_at: result[0].create_at,
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
    search_project: function (headers, search_query, offset) {
      //check for valid api authentication
      Auth.api_authentication(headers.api_key, function (err, result) {
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
            Auth.user_authentication(headers, function (err, result) {
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
                  //search all project having same query string
                  projects.searchproject(
                    search_query,
                    offset,
                    function (err, result) {
                      if (err) {
                        response.end(
                          JSON.stringify({
                            status: 500,
                            success: false,
                            message: 'Internal server error',
                          })
                        );
                      } else {
                        //let project = [];
                        response.end(
                          JSON.stringify({
                            status: 200,
                            success: true,
                            data: result,
                          })
                        );
                      }
                    }
                  );
                }
              }
            });
          }
        }
      });
    },
    update_project: (postData, headers) => {
      Auth.api_authentication(headers.api_key, function (err, result) {
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
            Auth.user_authentication(headers, (err, result) => {
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
                  postData.user_id = headers.user_id;
                  projects.updateTask(postData, function (err, result) {
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
                            message: 'No Such project exists for user',
                          })
                        );
                      } else {
                        const data = {
                          project_id: postData.project_id,
                          project_title: postData.project_title,
                          project_id: postData.project_id,
                          user_id: postData.user_id,
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
  };
};
