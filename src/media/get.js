const AWS = require('aws-sdk');
const { verifyRole } = require('../utils');
const s3 = new AWS.S3();
  
exports.handler = async (event) => {
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
    const bucketName = process.env.S3_BUCKET;
    
    try {
        const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();
        const mediaLinks = data.Contents.map(item => {
            return `https://${bucketName}.s3.amazonaws.com/${item.Key}`;
        });

        return {
            statusCode: 200,
            body: JSON.stringify(mediaLinks),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};