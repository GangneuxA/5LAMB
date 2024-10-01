const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const cognito = new AWS.CognitoIdentityServiceProvider();



const handleNewPasswordRequired = async (username, newPassword, session) => {
    const params = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: process.env.COGNITO_APP_CLIENT_ID,
        ChallengeResponses: {
            USERNAME: username,
            NEW_PASSWORD: newPassword
        },
        Session: session
    };

    try {
        const response = await cognito.respondToAuthChallenge(params).promise();
        return response.AuthenticationResult.IdToken;
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Error setting new password:',
                error: error.message,
            }),
        };
    }
};

exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_APP_CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    };

    try {
        const response = await cognito.initiateAuth(params).promise();
        
        let idToken = null
        if (!response.AuthenticationResult?.IdToken) {
            const session = response.Session;
            idToken = await handleNewPasswordRequired(username, password, session);
        } else {
            idToken = response.AuthenticationResult.IdToken;
        }
        
        const customToken = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Authentication successful',
                idToken,
                customToken,
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Authentication failed',
                error: error.message,
            }),
        };
    }
};