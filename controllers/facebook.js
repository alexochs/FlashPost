const {FB, FacebookApiException} = require('fb');

class Facebook {
    constructor() {
        const url = FB.getLoginUrl({
            client_id: process.env.FACEBOOK_TEST_APP_ID,
            client_secret: process.env.FACEBOOK_TEST_APP_SECRET,
            scope: 'email,user_likes',
            redirect_uri: '127.0.0.1/facebook'
        });

        console.log(url);

        /*FB.api('oauth/access_token', {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            grant_type: 'client_credentials'
        }, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'fb error occurred' : res.error);
                return;
            }
        
            var accessToken = res.access_token;
            console.log("accessToken: " + accessToken);
        });

        FB.api("4", (res) => {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
              }
              console.log(res.id);
              console.log(res.name);
        });*/
    }

    async login(req, res, next) {

    }
}

const facebook = new Facebook();
module.exports = facebook;