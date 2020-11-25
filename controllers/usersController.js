let users = require('../models/users.js');
let tasks = require('../models/tasks.js');
let Auth = require('../models/authentication.js');

module.exports = (response) => {
  return {
    home: () => {
      response.end(
        JSON.stringify({
          status: 200,
          success: true,
          message: 'Homepage',
        })
      );
    },
    signUp: (postData, apiKey) => {
      if (
        postData.username != undefined &&
        postData.username != null &&
        postData.password != undefined &&
        postData.password != null
      ) {
        Auth.apiAuthentication(apiKey, function (err, result) {
          if (err) {
            response.end(
              JSON.stringify({
                id: 1,
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
              users.signUp(postData, function (err, result) {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: 'username id already exists',
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
      } else {
        response.end(
          JSON.stringify({
            status: 202,
            success: false,
            message: 'Invalid parameters',
          })
        );
      }
    },
    signIn: (userData, apiKey) => {
      console.log(userData.username, userData.password);
      if (
        userData.username == undefined ||
        userData.username == null ||
        userData.password ||
        null ||
        userData.password == undefined
      ) {
        Auth.apiAuthentication(apiKey, (err, result) => {
          if (err)
            response.end(
              JSON.stringify({
                id: 2,
                status: 500,
                success: false,
                message: 'Internal server error',
              })
            );
          else {
            if (result === false) {
              response.end(
                JSON.stringify({
                  status: 401,
                  success: false,
                  message: 'Not authorized',
                })
              );
            } else {
              users.login(userData, (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 203,
                      success: false,
                      message: 'Invalid server error',
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
      } else {
        response.end(
          JSON.stringify({
            status: 500,
            success: false,
            message: 'Internal server error',
          })
        );
      }
    },
    getUserInfo: (headers, userId) => {
      Auth.apiAuthentication(headers.api_key, (err, result) => {
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
                    err,
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
                  let userInfo = {};
                  users.getUserInfo(userId, (err, result) => {
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
                      if (result === false) {
                        response.end(
                          JSON.stringify({
                            status: 201,
                            success: false,
                            message: 'No such project exists for user',
                          })
                        );
                      } else {
                        userInfo ={...userInfo,...result[0]}
                        tasks.countTask(null, userId, (err, result) => {
                          if (err) {
                            response.end(
                              JSON.stringify({
                                status: 500,
                                success: false,
                                message: err,
                              })
                            );
                          } else {
                            userInfo ={...userInfo,...result[0]}
                          }
                        });
                        response.end(
                          JSON.stringify({
                            status: 200,
                            success: true,
                            data: userInfo,
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
