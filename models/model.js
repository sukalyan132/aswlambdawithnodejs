var AWS     	= require("aws-sdk");
var dynamo  	= require('dynamodb');
const Joi   	= require('joi');
const dotenv 	= require('dotenv');
/****************************************************** */
dotenv.config();
/**********************************************************/
dynamo.AWS.config.update({accessKeyId: process.env.API_KEY, secretAccessKey: process.env.SECRET_KEY, region: process.env.REGION,endpoint: process.env.END_POINT});
var Expert = dynamo.define('tm_users', {
	  hashKey : 'id',
	  timestamps : true,
	  schema : {
					id               	: dynamo.types.uuid(),
					name             	: Joi.string(),
					location			: Joi.string(),
					mobile_no			: Joi.string(),
					email				: Joi.string(),
					primary_language	: Joi.string(),
					role				: Joi.array().meta({dynamoType : 'SS'}),
					image_url 			: Joi.string(),
					about 				: Joi.string(),
					address 			: Joi.string(),
					location_id1        : Joi.string(),
					location_id2        : Joi.string(),
					city		        : Joi.string(),
					state		        : Joi.string(),
					pin					: Joi.string(),
				    profile_picture     : Joi.string(),
				    about			    : Joi.string(),
				    arn     			: Joi.number(),
					arn_valid_till     	: Joi.string(),
					arn_valid_from     	: Joi.string(),
					kyd_compliant    	: Joi.string(),
					status 		    	: Joi.string(),
					profilestatus 		: Joi.string(),
					isavlable	    	: Joi.string(),
					bucketsize	    	: Joi.string(),
					exp_yr 				: Joi.number(),
				    euin     			: Joi.string(),
				    rating     			: Joi.array().items(Joi.number()),
				    answer_count 		: Joi.number(),
				    tags    			: Joi.array().meta({dynamoType : 'SS'}),
				    capabilities    	: Joi.array().meta({dynamoType : 'SS'}),
				    supported_languages : Joi.array().meta({dynamoType : 'SS'}),
				    certifications		: Joi.array().items(Joi.object().keys({
				                      										      name 		: Joi.string(),
				                      										      url 		: Joi.string(),
				                      										      created_at: Joi.date()
				                      										    })),
				   	products 			: Joi.array().meta({dynamoType : 'SS'}),
					reviews 			: Joi.array().items(Joi.object().keys({
																				review_text 		: Joi.string(),
																				review_on 			: Joi.date(),
																				rating 				: Joi.number(),
																				review_by 			: Joi.object().keys({
																														user_name	: Joi.string(),
																														user_id 	: Joi.string(),
																														user_imgurl : Joi.string()
																													})
				                      										    }))
	  			}
});

module.exports=Expert;

