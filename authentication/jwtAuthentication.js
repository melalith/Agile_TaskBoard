const {verify, sign} = require('jsonwebtoken');
const {writeFile, readFile} = require("node:fs/promises");

const app_json = {"id": "beep_login1"}
const app_secret = "beep_secret";

// Extract and Verify jwsAuthToken
module.exports.jwtAuthenticateToken = async function (req, res, next) {
    try {
        const auth_token = req.headers.jwttoken;

        const token = JSON.parse(await readFile("./Token.json", ("utf-8")));

        if (!auth_token) {
            return res.status(400).json(
                { error: 'Auth token is missing. Attach Authtoken & secret with header as jwttoken=<Token>' }
            );
        }

        const verifyResult = verify(auth_token, token.secret);
        // 'verifyResult' can be compared with decoded json
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while processing the token.' });
    }
};

function generateToken () {
    const jwt = sign(app_json, app_secret);

    jsonData = JSON.stringify({Token: jwt, secret: app_secret, ...app_json}, null, 2);
    try {
        writeFile("Token.json", jsonData, 'utf8');
    } catch(err) {
        console.error("Unable to generate Token");
    }
}

generateToken();