const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    const { username, password, email } = JSON.parse(event.body);

    const params = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: username,
        MessageAction: 'SUPPRESS',
        TemporaryPassword: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            },
            {
                Name: 'email_verified',
                Value: 'true'
            }
        ]
    };

    try {

        await cognito.adminCreateUser(params).promise();

        const groupParams = {
            GroupName: 'guest-author',
            UserPoolId: process.env.USER_POOL_ID,
            Username: username
        };

        await cognito.adminAddUserToGroup(groupParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User created and added to group successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};