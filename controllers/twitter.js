const TwitterApi = require("twitter-api-v2").default;

class Twitter {
    #api = null;
    #auth = {
        url: "",
        codeVerifier: "",
        state: "",
    };

    constructor()  {
        this.#api = new TwitterApi({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        });

        const { url, codeVerifier, state } = this.#api.generateOAuth2AuthLink("https://google.com", { scope: ['tweet.read', 'users.read', 'offline.access'] });
        this.#auth.url = url;
        this.#auth.codeVerifier = codeVerifier;
        this.#auth.state = state;
        console.log(url+"\n");
        console.log(codeVerifier+"\n");
        console.log(state+"\n");
    }

    getAuthUrl() {
        return this.#auth.url;
    }
};

module.exports = Twitter;