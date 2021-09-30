class ErrorResponse extends Error {
	constructor(statusCode, message) {
		super(message);
		this.statusCode = statusCode;
	}
}

exports.ErrorResponse = ErrorResponse;

class ValidationError extends Error {
	constructor(statusCode, message) {
		super('Validation Error :' + message);
		this.statusCode = statusCode;
	}
}

exports.ValidationError = ValidationError;

class AuthenticationError extends Error {
	constructor(statusCode, message) {
		super('Authentication Error :' + message);
		this.statusCode = statusCode;
	}
}
exports.AuthenticationError = AuthenticationError;

class AuthorizationError extends Error {
	constructor(statusCode, message) {
		super('Authorization Error :' + message);
		this.statusCode = statusCode;
	}
}
exports.AuthorizationError = AuthorizationError;

// db.questions.aggregate( [ { $group : { _id : "$subject",count: { $sum: 1 } } } ] )
