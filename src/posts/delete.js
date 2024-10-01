const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { verifyRole } = require('../utils');

module.exports.handler = async (event) => {
  const allowedRoles = ['admin'];
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
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request: Missing post ID' }),
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      postId: event.pathParameters.id,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 204,
      body: JSON.stringify({ error: 'Delete Successful' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete post' }),
    };
  }
};
