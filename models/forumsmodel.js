var AWS     = require("aws-sdk");
var dynamo  = require('dynamodb');
const Joi   = require('joi');
/**********************************************************/
dynamo.AWS.config.update({accessKeyId: 'AKIAYV5VQ7QDKKWSCORK', secretAccessKey: '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', region: "ap-south-1",endpoint: "https://dynamodb.ap-south-1.amazonaws.com"});
//dynamo.AWS.config.update({accessKeyId: 'AKIAYV5VQ7QDPPXOQYAS', secretAccessKey: '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', region: "ap-south-1",endpoint: "http://localhost:8000"});
//var dynamodb = new AWS.DynamoDB();

var Forums = dynamo.define('forum', {
	  hashKey : 'id',
	  timestamps : true,
	  schema : {
				    id                    : dynamo.types.uuid(),
				    question              : Joi.string(),
				    locale    			  : Joi.string(),
				    posted_on             : Joi.date(),
				    related_videos 	      : Joi.array().items(Joi.string()),
				    tags    			  : Joi.array().items(Joi.string()),
				    likes    			  : Joi.array().items(Joi.string()),
				  	posted_by			  : Joi.object().keys({
		                              						      name	: Joi.string(),
		                              						      id 	: Joi.string()
		                              						    }),
				    answers				  : Joi.array().items(Joi.object().keys({
				                      										      reply_by 		: Joi.object().keys({
															                              						      name	: Joi.string(),
															                              						      id 	: Joi.string()
															                              						    }),
				                      										      reply_content : Joi.string(),
				                      										      reply_on 		: Joi.date(),
				                      										      tags 			: Joi.array().items(Joi.string()),
				                      										      likes 		: Joi.array().items(Joi.string()),
				                      										      comments 		: Joi.array().items(Joi.object().keys({
				                      										      														comment_by 	:Joi.object().keys({
																											                              						      name 	: Joi.string(),
																											                              						      id 	: Joi.string()
																											                              						    }),
				                      										      														commented_on : Joi.date(),
				                      										      														comment_text : Joi.string(),
				                      										      														}))
				                      										      
				                      										    }))
	  			}
});

module.exports=Forums;
/*dynamo.createTables(function(err) {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Tables has been created');
  }
});*/