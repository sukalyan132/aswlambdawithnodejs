var AWS     	= require("aws-sdk");
var dynamo  	= require('dynamodb');
const Joi   	= require('joi');
const dotenv 	= require('dotenv');
/****************************************************** */
dotenv.config();
/**********************************************************/
dynamo.AWS.config.update({accessKeyId: process.env.API_KEY, secretAccessKey: process.env.SECRET_KEY, region: process.env.REGION,endpoint: process.env.END_POINT});
var Expert = dynamo.define('UNCLAIMED_EXPERTS', {
	  hashKey : 'arn',
	  schema : {
                    arn               	: Joi.string(),
					name             	: Joi.string(),
					address 			: Joi.string(),
					email				: Joi.string(),
					city		        : Joi.string(),
					pin					: Joi.string(),
					validTill     	    : Joi.string(),
					validFrom     	    : Joi.string(),
					kydCompliant    	: Joi.string(),
				    eun     			: Joi.string(),
				    telephoneR     		: Joi.string(),
					telephoneO 		    : Joi.string(),
					flag	 		    : Joi.string()
	  			}
});

module.exports=Expert;

