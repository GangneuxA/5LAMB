const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { verifyRole } = require('../utils');


module.exports.handler = async (event) => {
    const allowedRoles = ['admin', 'editor' , 'guest-author'];
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
  const title = event.queryStringParameters.title;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'TitleIndex', // Assurez-vous d'avoir un index secondaire global sur le titre
    KeyConditionExpression: 'title = :title',
    ExpressionAttributeValues: {
      ':title': title,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};