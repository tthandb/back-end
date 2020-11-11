const http = require("http");
const url = require("url");
import getLow from "./controllers/usersController"

const PORT = 2000;
const server = http
	.createServer((request, response) => {
		let urlParts = url.parse(request.url);
		let updatedPathName = urlParts.pathname;

		switch (updatedPathName) {
			case "/":
				if (request.method == "GET") {
					//userContoller.home();
					getLow("vi")
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
		}
	})
	.listen(PORT);
