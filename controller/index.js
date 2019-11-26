const express 	= require("express");
var AWS     	= require("aws-sdk");
var dynamo  	= require('dynamodb');
const {check} 	= require("express-validator/check");
var XLSX        = require('xlsx');
var NodeGeocoder= require('node-geocoder');
const dotenv 	= require('dotenv');
/****************************************************** */
dotenv.config();
var database 	= require("../models/model");
var uemodel 	= require("../models/unclameexpertmodel");
const validate 	= require("../middleware/validate");
var services 	= require("../services/auth")
const router 	= express.Router();
var DB 			= new AWS.DynamoDB.DocumentClient();
var options 	= {provider: 'google',httpAdapter: 'https',apiKey: process.env.GOOGLE_API_KEY,formatter: null};
var geocoder 	= NodeGeocoder(options);
/***********************************************************************/
const finduserbylocation= async (req,res)=>{
	// Using callback 
	geocoder.geocode(req.params.latlong, async (err, res2) => {
		console.log(res2[0].city);
		if(res2[0].city=='Bengaluru')
		{
			var city = "Bangalore";
		}
		var expertData=await database.scan()
								  .where('city').equals(city)
								  .where('role').ne('user')
								  .exec()
								  .promise();
			console.log(expertData);
			if(expertData[0].Items.length>0)
			{
				res.json(expertData[0].Items);
				
			}
			else
			{
				
				res.status(200).json({"status":"failed","message":"Sorry,no data found."});
			}
	});
}
/********************** create expert ***************************/
const createExpert = async (req, res) => {
	var expertData=await database.scan()
								  .where('mobile_no').equals(req.body.mobile_no)
								  .exec()
								  .promise();
			if(expertData[0].Items.length>0)
			{
				res.status(200).json({"status":"failed","message":"Sorry,this mobile already registered."});
			}
			else
			{
				const otpService= await services.sendOTP(expert.attrs.mobile_no);
				res.json(otpService);
			}
	
};
/*********************************************************************/
const validateOtp = async (req, res) => {

	try {
		const otpService= await services.verifyOTP(req.body.mobile_no,req.body.otp);
		 if(!otpService.message)
		 {
		 	res.json({"status":"failed","message":"some error occurred"});
		 }
		 else
		 {
		 	var userData=await database.scan()
							  .where('mobile_no').gte(req.body.mobile_no)
							  .attributes(['name','mobile_no','id'])
							  .returnConsumedCapacity()
							  .exec()
							  .promise();
			if(userData[0].Items.length>0)
			{
				var createToken=await services.generateToken(userData[0].Items[0].attrs);
				createToken.status="success";
				createToken.username=userData[0].Items[0].attrs.name;
				res.json(createToken);
			}
			else
			{
				res.json({"status":"failed","message":"some error occurred"});
			}
		 }

	} catch (e) {
		//return { error: e };
		res.json({ error: e });
	}
};
/***********************************token validation test**************************************/
const validateToken= async(req,res) => {
	var createToken=await services.authenticate(req.body.token);
	console.log(createToken);
	res.json(createToken);
};
/**************************** expert auth**********************************************/
const validateExpert= async(req,res) =>{
	var userData=await database.scan()
								  .where('phone').equals(req.body.phone)
								  .exec()
								  .promise();
			if(userData[0].Items.length>0)
			{
				const otpService= await services.sendOTP(userData[0].Items[0].attrs.phone);
				otpService.status="success";
				//console.log(otpService);
				res.status(200).json(otpService);
			}
			else
			{
				res.status(200).json({"status":"failed","message":"Sorry,this mobile no not registered."});
			}

};
/*********************************** insert demo expert****************************************** */
const insertExpert= async(req,res) =>{
	var workbook = XLSX.readFile('./uploads/UNCLAIMED_EXPERTS.xlsx');
	var sheet_name_list = workbook.SheetNames;
	var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
	var dataarray=[];
	console.log(xlData[0]);
	var data2={
		"name"				: xlData[0].name,
		"address"			: xlData[0].address,
		"email"				: xlData[0].email,
		"city"				: xlData[0].city,
		"pin"				: xlData[0].pin.toString(),
		"arn_valid_till"	: xlData[0].validTill.toString(),
		"arn_valid_from"	: xlData[0].validFrom.toString(),
		"kyd_compliant"		: xlData[0].kydCompliant,
		"euin"				: xlData[0].eun,
		"arn"				: xlData[0].arn.toString(),
		"status"			: 'unclaimed',
		"profilestatus"		: "incomplete",
		"bucketsize"		: '3',
		"role"				: ['expert'],
		"mobile_no" 		: '8670021081'
	};
	xlData.forEach(function(element) {
		if(!element.telephoneR)
		{
			var mobileno="";
		}
		else
		{
			var mobileno='8670021081';
			var pin =element.pin.toString();
		}
		if(!element.eun)
		{
			var eun="121121213";
		}
		else
		{
			var eun= element.eun.toString();
			
		}
		var arn=element.arn.toString();
		var data={
			"name"				: element.name,
			"address"			: element.address,
			"email"				: element.email,
			"city"				: element.city,
			"pin"				: pin,
			"arn_valid_till"	: element.validTill.toString(),
			"arn_valid_from"	: element.validFrom.toString(),
			"kyd_compliant"		: element.kydCompliant,
			"euin"				: eun,
			"arn"				: arn,
			"status"			: 'unclaimed',
			"profilestatus"		: "incomplete",
			"bucketsize"		: '3',
			"role"			: ['expert'],
			"mobile_no" 		: '8670021081'
		};
		
		dataarray.push(data);
		
	  });
	  //console.log(dataarray);
	 
	  database.create(dataarray, function (err, acc) {
			console.log(err);
			console.log(acc);
		  });
	
	
};
/**********************************get all expert****************************************/
const getExpert = async (req, res) => {
	try {
		var items =await database.scan().filterExpression('contains(#rolekey,:rolevalue)').expressionAttributeNames({ "#rolekey": "role" }).expressionAttributeValues({ ":rolevalue" : "expert"}).exec().promise();
		const response={"status":"success","data" : items[0].Items};
		res.json(response);

	} catch (e) {
		res.json({ "status": "failed","message":"error"});
	}
	
};
/***************************serch expertby arn no **********************************************/
const getExpertByArnNo = async (req, res) => {
	var expertdata=await database.scan().where('arn').equals(parseInt(req.params.arnno)).exec().promise();
	if(expertdata[0].Items.length>0)
	{
		const response={"status":"success","data" : expertdata[0].Items};
		res.json(response);
	}
	else
	{
		const response={"status":"failed","message" : "sorry on data found"};
		res.json(response);
	}
};
/***************************Clame profile **********************************************/
const clameProfile = async (req, res) => {
	try {
		var expertdata=await database.scan().where('arn').equals(req.body.arnno).exec().promise();
		if(expertdata[0].Items[0].attrs.status=='claimed')
		{
			const response={"status":"failed","message" : "This profile already claimed."};
			res.json(response);
		}
		else
		{
			const otpService= await services.sendOTP(expertdata[0].Items[0].attrs.mobile_no);
			otpService.status="success";
			res.status(200).json(otpService);
		}

	} catch (e) {
		res.json({ "status": "failed","message":"error"});
	}
};
/*********************************************************************/
const validateClameprofileWithOtp = async (req, res) => {

	try {
		const otpService= await services.verifyOTP(req.body.mobile_no,req.body.otp);
		 if(!otpService.message)
		 {
		 	res.json({"status":"failed","message":"some error occurred"});
		 }
		 else
		 {
			var expertdata=await database.scan().where('arn').equals(req.body.arnno).exec().promise();
			 database.update({id:  expertdata[0].Items[0].attrs.id,status:'claimed' }, async (err, acc) => {
				if(err)
				{
					res.json({"status":"failed","message":"some error occurred"});
				}
				else
				{
					var tokendata 		= {"id":expertdata[0].Items[0].attrs.id,"mobile_no":expertdata[0].Items[0].attrs.mobile_no};
					var createToken		= await services.generateToken(tokendata);
					createToken.status	= "success";
					createToken.username= expertdata[0].Items[0].attrs.name;
					res.json(createToken);
				}
			});
			
		 }

	} catch (e) {
		const response={"status":"failed","message" : "error"};
		res.json(response);
	}
};
/***********************************************************************/
router.get('/getexpertbylocation/:latlong',finduserbylocation);
router.get('/insertExpert',insertExpert);
router.get("/expert", getExpert);
router.get("/expert/arn/:arnno", getExpertByArnNo);
router.post("/expert/clame",clameProfile);
router.post("/expert/profile/verifyotp",validateClameprofileWithOtp);
router.post("/validatetoken",validateToken);
router.post(
	"/",
	[
		check("phone")
			.not()
			.isEmpty()
			.withMessage("cannot be empty")
			.isMobilePhone(["en-IN"])
			.withMessage("invalid mobile number")
			.isLength({ min: 10, max: 10 })
			.withMessage("must be 10 digit long")

	],
	validate,
	createExpert
);
router.post(
	"/otpverification",
	[
		check("otp")
			.not()
			.isEmpty()
			.withMessage("otp cannot be empty"),
		check("phone")
			.not()
			.isEmpty()
			.withMessage("cannot be empty")
			.isMobilePhone(["en-IN"])
			.withMessage("invalid mobile number")
			.isLength({ min: 10, max: 10 })
			.withMessage("must be 10 digit long")

	],
	validate,
	validateOtp
);
module.exports = router;
