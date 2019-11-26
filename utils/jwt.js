const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
/***********************************************/
/*************** generate jwt token ************/
const generateToken = payload => {
	const privateKey = fs.readFileSync(
		path.resolve(__dirname, "../keys/jwtRS256.key")
	);
	const token = jwt.sign(payload, privateKey, {
		algorithm: "RS256"
	});
	return `Bearer ${token}`;
};
/**************** verify Token ******************/
const verifyToken = token => {
	console.log(token);
	var tokenTrim = token.slice(7, token.length).trimLeft();
	const publicKey = fs.readFileSync(
		path.resolve(__dirname, "../keys/jwtRS256.key.pub")
	);

	try {
		return jwt.verify(tokenTrim, publicKey);
		//console.log(data);
	} catch (e) {
		return null;
	}
};
/***************************************************/
exports.generateToken 	= generateToken;
exports.verifyToken 	= verifyToken;