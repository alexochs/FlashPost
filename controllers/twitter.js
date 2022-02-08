const { response } = require("express");
const res = require("express/lib/response");
const TwitterApi = require("twitter-api-v2").default;
const database = require("../database/database");

class Twitter {
    #baseApi = null;
    #auth = {
        url: null,
        codeVerifier: null,
        state: null,
        result: {
            state: null,
            code: null,
        },
    };
    #api = {
        client: null,
        accessToken: null,
        refreshToken: null,
    }
    #user = {
        id: null,
        name: null,
        username: null,
    }
    #callbackUrl = "http://127.0.0.1/twitter";

    constructor()  {
        this.#baseApi = new TwitterApi({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
        });

        const { url, codeVerifier, state } = this.#baseApi.generateOAuth2AuthLink(this.#callbackUrl, { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] });
        this.#auth.url = url;
        this.#auth.codeVerifier = codeVerifier;
        this.#auth.state = state;
        console.log("Auth State:" + state);
    }

    getAuthUrl() {
        return this.#auth.url;
    }

    getAuthState() {
        return this.#auth.state;
    }

    getAuthCodeVerifier() {
        return this.#auth.codeVerifier;
    }

    getAuthResultState() {
        return this.#auth.result.state;
    }

    getAuthResultCode() {
        return this.#auth.result.code;
    }

    async getAuthResult(session) {
        return await database.read(session + "/twitter/tokens");
    }

    async setAuthResult(session, result) {
        await database.write(session + "/twitter/tokens", result);
    }

    async setTokens(session, tokens) {
        await database.setTwitterTokens(session, tokens);
    }

    async setUserData(session, userData) {
        await database.setTwitterUserData(session, userData);
    }

    async getStateToken(session) {
        return await database.getTwitterStateToken(session);
    }

    async getUsername(session) {
        if (await twitter.isLoggedIn(session)) {
            const userName = await database.getTwitterUsername(session);
            return userName;
        }
        else {
            console.log("Cannot get username: not logged in!");
            return null;
        }
    }

    async isLoggedIn(session) {
        const stateToken = await twitter.getStateToken(session);
        if (this.#auth.state !== stateToken) return false;
        else return true;
    }

    async login(req, res, next) {
        console.log("Saving Twitter tokens...");
        await twitter.setTokens(
            req.session.id,
            {
                state: req.query.state,
                code: req.query.code,
            }
        );
        console.log("Twitter tokens saved!");

        console.log("Checking if Twitter tokens match...");
        if (twitter.#auth.state !== req.query.state) {
            console.log("Tokens do not match! Abort login...");
            return;
        }
        console.log("Twitter tokens match!");

        console.log("Logging in...");
        twitter.#api = await twitter.#baseApi.loginWithOAuth2({
            code: req.query.code,
            codeVerifier: twitter.#auth.codeVerifier,
            redirectUri: "http://127.0.0.1/twitter",
        });
        console.log("Successfully logged in!");

        console.log("Fetch and save Twitter user data...");
        const { data } = await twitter.#api.client.v2.me();
        console.log("Successfully fetched user data!");
        twitter.setUserData(req.session.id, data);
        console.log("Successfully saved user data!\nTwitter ready! " + "@" + await twitter.getUsername(req.session.id));
        
        next();
    }

    async refresh(req, res, next) {
        if (!this.isLoggedIn()) {
            return;
        }

        this.#api = await this.#baseApi.refreshOAuth2Token(this.#api.refreshToken);

        const { data } = await this.#api.client.v2.me();
        this.#user = data;

        next();
    }

    async tweet(req, res, next) {
        if (await twitter.isLoggedIn(req.session.id)) {
            const text = req.body.contentText + "\n\nThis post was made by #OmniPost gang.";
            const { data } = await twitter.#api.client.v2.tweet(text);
            console.log("Tweet successfully posted:\n===\n" + text + "\n===\n");
        }
        else {
            console.error("You're not logged in!");
        }

        next();
    }
};

const twitter = new Twitter();
module.exports = twitter;