const AWS = require('aws-sdk');
const { verifyRole } = require('../utils');
const s3 = new AWS.S3();
  
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
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}-${data.filename}`,
    Body: Buffer.from(data.file, 'base64'),
    ContentType: data.contentType,
  };

  try {
    await s3.putObject(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'File uploaded successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not upload file' }),
    };
  }
};