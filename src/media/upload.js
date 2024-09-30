const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
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
