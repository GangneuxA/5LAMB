const AWS = require('aws-sdk');
const uuid = require('uuid');
const { verifyRole } = require('../utils');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();


module.exports.handler = async (event) => {
  const allowedRoles = ['admin', 'editor'];
  const customToken = event.headers['X-Custom-Token'];
  if (!customToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized: Custom token is missing' }),
    };
  }
  const right = await verifyRole(allowedRoles, customToken);

  if (right.statusCode === 403 || right.statusCode === 500) {
    return right;
  }


  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      postId: uuid.v1(),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();

    const snsParams = {
      Message: `New blog post created: ${data.title}`,
      TopicArn: process.env.SNS_TOPIC_ARN,
    };
    await sns.publish(snsParams).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
