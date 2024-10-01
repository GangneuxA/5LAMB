const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { verifyRole } = require('../utils');

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
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request: Missing post ID' }),
    };
  }
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      postId: event.pathParameters.id,
    },
    UpdateExpression: 'SET title = :title, content = :content',
    ExpressionAttributeValues: {
      ':title': data.title,
      ':content': data.content,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update post' }),
    };
  }
};
