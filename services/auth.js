//const Expert = require("../models/expert");
//const config = require("../config");
const axios = require("axios");
//const AMQPService = require("./amqp");
const { Otp, Jwt } = require("../utils");

class Auth {
	static async checkIfUserExists(query) {
		try {
			const expert = await Expert.findOne(query);
			return { expert };
		} catch (e) {
			return { error: e };
		}
	}
	/*static async signup(DTO) {
		try {
			DTO.roles = ["expert"];
			const newExpert = await Expert.create(DTO);
			console.log(newExpert);
			let indexExpert = { ...newExpert._doc };
			delete indexExpert._id;
			delete indexExpert.__v;
			const consumerObj = {
				content: indexExpert,
				index: "experts",
				type: "index"
			};
			await AMQPService.sendToQueue(JSON.stringify(consumerObj));
			return { expert: newExpert };
		} catch (e) {
			console.log(e);
			return { error: e };
		}
	}*/

	static async sendOTP(phone) {
		//console.log(phone);
		//return false;

		const otp = Otp.generateOTP();
		const params = {
			url: "",
			otp: otp,
			sender: "",
			mobile: '91'+phone,
			authKey: ''
		};
		const url = `${params.url}?otp=${params.otp}&sender=${params.sender}&message=${params.otp} is your ZFunds verification code&mobile=${params.mobile}&authkey=${params.authKey}`;
		//console.log(url);
		const response = await axios.post(url);
		return new Promise((resolve, reject) => {
			const error = Otp.checkError(response.data);
			if (error) {
				reject({
					status: 400,
					title: "bad request",
					detail: "unable to send OTP"
				});
			} else {
				resolve({ message: 'OTP sent to '+ phone });
			}
		});
	}
	static async verifyOTP(phone, otp) {
		const params = {
			url: "",
			otp: otp,
			mobile: `91${phone}`,
			authKey: ''
		};
		const url = `${params.url}?otp=${params.otp}&mobile=${params.mobile}&authkey=${params.authKey}`;
		const response = await axios.post(url);
		return new Promise((resolve, reject) => {
			const error = Otp.checkError(response.data);
			if (error) {
				reject({
					status: 401,
					title: "unauthorized",
					detail: "unable to verify OTP"
				});
			} else {
				resolve({ message: "OTP verified" });
			}
		});
	}
	static generateToken(payload) {
		const token = Jwt.generateToken(payload);
		return { token };
	}
	static authenticate(data) {
		const token = Jwt.verifyToken(data);
		//console.log(token);
		return { token };
	}
}
module.exports = Auth;
