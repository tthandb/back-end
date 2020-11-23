"use strict";
//load all modules
let tasks = require("../models/tasks.js");
let Auth = require("../models/authentication.js");

module.exports = function (response) {
  return {
    create_task: function (postData, headers) {
      Auth.api_authentication(headers.api_key, (err, result) => {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: "Internal server error",
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: "Not authorized",
              })
            );
          } else {
            Auth.user_authentication(headers, (err, result) => {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: "Internal server error1",
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: "user not authorized",
                    })
                  );
                } else {
                  if (
                    postData.user_id === null ||
                    postData.user_id === undefined ||
                    postData.user_id === ""
                  )
                    postData.user_id = headers.user_id;
                  tasks.createTask(postData, (err, result) => {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: "Internal server error2",
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
    delete_task: function (headers, task_id) {
      Auth.api_authentication(headers.api_key, function (err, result) {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: "Internal server error",
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: "Not authorized",
              })
            );
          } else {
            //check for user authentication
            Auth.user_authentication(headers, function (err, result) {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: "user not authorized",
                    })
                  );
                } else {
                  //if user is crator of task and valid also then delete task
                  tasks.deletetask(
                    headers.user_id,
                    task_id,
                    function (err, result) {
                      if (err) {
                        response.end(
                          JSON.stringify({
                            status: 500,
                            success: false,
                            message: "Internal server error",
                          })
                        );
                      } else {
                        if (result === true) {
                          response.end(
                            JSON.stringify({
                              status: 200,
                              success: true,
                              message: "task deleted successfully",
                            })
                          );
                        } else {
                          response.end(
                            JSON.stringify({
                              status: 201,
                              success: false,
                              message: "No Such task exists for user",
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
    /**
     * [delist_task admin can delist a task]
     * @param  {[Object]} headers [user info headers]
     * @param  {[int]} task [task_id]
     * @return {[Json]}         [description]
     */
    delist_task: function (headers, task) {
      console.log(task);
      //check for valid api authentication
      Auth.api_authentication(headers.api_key, function (err, result) {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: "Internal server error",
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: "Not authorized",
              })
            );
          } else {
            //check for valid user and having role of admin
            Auth.user_authentication(headers, function (err, result) {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: "user not authorized",
                    })
                  );
                }
              }
            });
          }
        }
      });
    },
    /**
     * [view_task function to view task based on task_id]
     * @param  {[object]} headers    [user info]
     * @param  {[int]} task_id [task_id]
     * @return {[json]}            [description]
     */
    view_task: function (headers, task_id) {
      //check for valid api authentication
      Auth.api_authentication(headers.api_key, function (err, result) {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: "Internal server error",
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: "Not authorized",
              })
            );
          } else {
            //check for user authentication
            Auth.user_authentication(headers, function (err, result) {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: "user not authorized",
                    })
                  );
                } else {
                  //get data of task for view
                  tasks.viewSingletask(task_id, function (err, result) {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: "Internal server error",
                        })
                      );
                    } else {
                      if (result === false) {
                        response.end(
                          JSON.stringify({
                            status: 201,
                            success: false,
                            message: "No Such task exists for user",
                          })
                        );
                      } else {
                        //append task info and send
                        let data = {
                          task_name: result[0].task_name,
                          task_sku: result[0].task_sku,
                          date_added: result[0].date_added,
                          task_desc: result[0].task_desc,
                          task_price: result[0].task_price,
                          task_url: result[0].task_url,
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
    /**
     * [search_task function to search task on basis of query staring]
     * @param  {[object]} headers      [description]
     * @param  {[string]} search_query [description]
     * @return {[Json]}              [task object]
     */
    search_task: function (headers, search_query, offset) {
      //check for valid api authentication
      Auth.api_authentication(headers.api_key, function (err, result) {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: "Internal server error",
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: "Not authorized",
              })
            );
          } else {
            Auth.user_authentication(headers, function (err, result) {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: "user not authorized",
                    })
                  );
                } else {
                  //search all task having same query string
                  tasks.searchtask(
                    search_query,
                    offset,
                    function (err, result) {
                      if (err) {
                        response.end(
                          JSON.stringify({
                            status: 500,
                            success: false,
                            message: "Internal server error",
                          })
                        );
                      } else {
                        //let task = [];
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
    /**
     * [update_task function to update task info]
     * @param  {[object]} postData [task data]
     * @param  {[object]} headers  [user info]
     * @return {[json]}          [success/ failure]
     */
    update_task: function (postData, headers) {
      //check for valid api authentication
      Auth.api_authentication(headers.api_key, function (err, result) {
        if (err) {
          response.end(
            JSON.stringify({
              status: 500,
              success: false,
              message: "Internal server error",
            })
          );
        } else {
          if (result === false) {
            response.end(
              JSON.stringify({
                status: 401,
                success: false,
                message: "Not authorized",
              })
            );
          } else {
            //check for user authentication
            Auth.user_authentication(headers, function (err, result) {
              if (err) {
                response.end(
                  JSON.stringify({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                  })
                );
              } else {
                if (result === false) {
                  response.end(
                    JSON.stringify({
                      status: 401,
                      success: false,
                      message: "user not authorized",
                    })
                  );
                } else {
                  postData.user_id = headers.user_id;
                  //update task
                  tasks.updatetask(postData, function (err, result) {
                    if (err) {
                      response.end(
                        JSON.stringify({
                          status: 500,
                          success: false,
                          message: "Internal server error",
                        })
                      );
                    } else {
                      if (result === false) {
                        response.end(
                          JSON.stringify({
                            status: 201,
                            success: false,
                            message: "No Such task exists for user",
                          })
                        );
                      } else {
                        //get upadated task info and return
                        let data = {
                          task_name: postData.task_name,
                          task_desc: postData.task_desc,
                          task_price: postData.task_price,
                          task_url: postData.task_url,
                          task_id: postData.task_id,
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
