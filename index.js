const http = require("http");
const url = require("url");
const users = require("./controllers/usersController.js");
const PORT = 2000;
const server = http
	.createServer((request, response) => {
		let urlParts = url.parse(request.url);
		let updatedPathName = urlParts.pathname;
		let userController = users(response);

		switch (updatedPathName) {
			case "/":
				if (request.method == "GET") {
					userController.home();
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
					let postData = "";
					request.on("data", function (data) {
						postData += data;
					});
					request.on("end", function () {
						userController.signUp(
							JSON.parse(postData),
							request.headers.api_key
						);
					});
				} else {
					response.end(
						JSON.stringify({
							status: 405,
							message: "Method not allowed",
						})
					);
				}
				break;
			case "/users/login":
				if (request.method == "POST") {
					let userData = "";
					request.on("data", (data) => {
						userData += data;
					});
					request.on("end", () => {
						userController.signIn(
							JSON.parse(userData),
							request.headers.api_key
						);
					});
				} else {
					response.end(
						JSON.stringify({
							status: 405,
							message: "Method not allowed",
						})
					);
				}
				break;
		}
	})
	.listen(PORT);
