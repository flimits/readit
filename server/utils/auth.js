const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const secret = process.env.JWT_SECRET
const expiration = process.env.JWT_EXPIRATION

module.exports = {
    AuthenticationError: new GraphQLError("Could not authenticate user.", {
        extensions: {
            code: "UNAUTHENTICATED"
        }
    }),
    authMiddleware: function ({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            // Get the token which will be the last element in the split
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration })
            req.user = data; // Set a user object to the req for context checking
        } catch (error) {
            console.log("Invalid token");
        }

        return req;
    },
    signToken: function ({ _id, userName, email }) {
        const payload = { _id, userName, email };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
    }
}