let users = require("../models/users.js");
let apiAuth = require("../models/authentication.js");
module.exports = (response) => {
  return {
    home: () => {
      response.end(
        JSON.stringify({
          status: 200,
          success: true,
          message: "APIs Homepage",
        })
      );
    },
    signUp: (postData, apiKey) => {
      if (
        postData.user_role != undefined &&
        postData.user_role != null &&
        postData.email != undefined &&
        postData.email != null &&
        postData.password != undefined &&
        postData.password != null
      ) {
        apiAuth.api_authentication(apiKey, function (err, result) {
          if (err) {
            response.end(
              JSON.stringify({
                id: 1,
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
              users.signUp(postData, function (err, result) {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 500,
                      success: false,
                      message: "Email id already exists",
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
            message: "Invalid parameters",
          })
        );
      }
    },
    signIn: (userData, apiKey) => {
      console.log(userData.email, userData.password);
      if (
        userData.email == undefined ||
        userData.email == null ||
        userData.password ||
        null ||
        userData.password == undefined
      ) {
        apiAuth.api_authentication(apiKey, (err, result) => {
          if (err)
            response.end(
              JSON.stringify({
                id: 2,
                status: 500,
                success: false,
                message: "Internal server error",
              })
            );
          else {
            if (result === false) {
              response.end(
                JSON.stringify({
                  status: 401,
                  success: false,
                  message: "Not authorized",
                })
              );
            } else {
              users.login(userData, (err, result) => {
                if (err) {
                  response.end(
                    JSON.stringify({
                      status: 203,
                      success: false,
                      message: "Invalid server error",
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
            message: "Internal server error",
          })
        );
      }
    },
  };
};
