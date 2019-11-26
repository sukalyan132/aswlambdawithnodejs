const constructSuccessResponse = data => {
	return { data };
};
const constructErrorResponse = e => {
	const errors = [];
	const errorObj = {
		status: e.status || 500,
		title: e.title || "internal server error",
		detail: e.detail || "internal server error"
	};
	errors.push(errorObj);
	return { errors, status: errorObj.status };
};
exports.constructSuccessResponse = constructSuccessResponse;
exports.constructErrorResponse = constructErrorResponse;
