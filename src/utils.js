const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const cognito = new AWS.CognitoIdentityServiceProvider();

const verifyRole = async (allowedRoles, customToken) => {
  try {
    const decodedToken = jwt.decode(customToken);
    const username = decodedToken['username'];

    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    };

    const groupsData = await cognito.adminListGroupsForUser(params).promise();
    const userRole = groupsData.Groups.map(group => group.GroupName);

    if (!allowedRoles.some(role => userRole.includes(role))) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Access Denied" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Access Granted" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = { verifyRole };