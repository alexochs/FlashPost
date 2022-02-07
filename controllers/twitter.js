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
    #isLoggedIn = false;
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

    setAuthResult(session, result) {
        database.write(session + "/tokens", result);
    }

    getUsername() {
        return this.#user.username;
    }

    isLoggedIn() {
        if (!this.#isLoggedIn || (this.#auth.state !== this.#auth.result.state)) return false;
        else return true;
    }

    async login(req, res, next) {
        twitter.setAuthResult(
            "testSession",
            {
                state: req.query.state,
                code: req.query.code,
            }
        );

        if (!twitter.#auth || twitter.#auth.state !== twitter.#auth.result.state) {
            return;
        }

        twitter.#api = await twitter.#baseApi.loginWithOAuth2({
            code: twitter.getAuthResultCode(),
            codeVerifier: twitter.getAuthCodeVerifier(),
            redirectUri: "http://127.0.0.1/twitter",
        });

        twitter.#isLoggedIn = true;
        twitter.refresh(req, res, next);
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
        if (twitter.isLoggedIn()) {
            const text = "Magic Number: " + Math.trunc((Math.random()*100)) + "\nThis is a test post made by OmniPost gang.";
            const { data } = await twitter.#api.client.v2.tweet(text);
        }
        else {
            alert("You're not logged in!");
        }

        next();
    }
};

const twitter = new Twitter();
module.exports = twitter;