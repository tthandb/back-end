const http = require("http");
const url = require("url");

const PORT = 2000;
const server = http
  .createServer((request, response) => {
    let urlParts = url.parse(request.url);
    let updatedPathName = urlParts.pathname;
    console.log(`server run on ${PORT}`);
    switch (updatedPathName) {
      case "/":
        if (request.method == "GET") {
          //userContoller.home();
          
          response.end(
            JSON.stringify({
              status: 405,
              message: "Method allowed",
            })
          );
        } else {
          response.end(
            JSON.stringify({
              status: 405,
              message: "Method not allowed",
            })
          );
        }
        break;
      case "/users/signup":
        if (request.method == "POST") {
          //getting post request data wait for request to end the data and
          // call corrensponding controller action
          let postData = "";

          request.on("data", function (data) {
            postData += data;
          });
          request.on("end", function () {
            userController.sign_up(
              JSON.parse(postData),
              request.headers.api_key
            );
          });
        } else {
          response.end(
            JSON.stringify({ status: 405, message: "Method not allowed" })
          );
        }
        break;
      case "/users/login":
        if (request.method == "POST") {
          let userData = "";
          request.on("data", function (data) {
            userData += data;
          });
          request.on("end", function () {
            userController.sign_in(
              JSON.parse(userData),
              request.headers.api_key
            );
          });
        } else {
          response.end(
            JSON.stringify({ status: 405, message: "Method not allowed" })
          );
        }
        break;
    }
  })
  .listen(PORT);
