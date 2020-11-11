module.exports = (response) => {
	home: () => {
		response.end(
			JSON.stringify({
				status: 200,
				success: true,
				message: "APIs Homepage",
			})
		);
	};
	signIn: (userData, apiKey) => {
		if (
			userData.name == undefined ||
			userData.name == null ||
			userData.password == null ||
			userData.password == undefined
		) {
		}
	};
};
