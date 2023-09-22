const Twit = require("twit");

var T = new Twit({ 
  consumer_key: "Tu Consumer Key", 
  consumer_secret: "Tu Consumer Secret", 
  access_token: "Tu Access Token", 
  access_token_secret: "Tu Access Token Secret", 
  timeout_ms: 60 * 1000, // optional HTTP request timeout 
  strictSSL: true // optional - requires SSL certificates to be valid. 
});

// Retweet

const stream1 = T.stream("statuses/filter",{track:"#SEO"});
stream1.on("tweet",reTweet);

function reTweet(tweet) {
    T.post("statuses/retweet/:id", { id: tweet.id_str }, function(
      err,
      data,
      response
    ){
      console.log("RT dado a: @" + tweet.user.screen_name);
    });
}

//Me gusta 

const stream2 = T.stream("statuses/filter",{track:"#SocialMedia"});
stream2.on("tweet",MeGusta);

function meGusta(tweet) {
    T.post("favorites/create", { id: tweet.id_str }, function(
      err,
      data,
      response
    ) {
      console.log("Me gusta dado a: @" + tweet.user.screen_name);
    });
}

// Seguir automaticamente

stream1.on("tweet",seguirCuenta);

function seguirCuenta(tweet) {
    T.post(
      "friendships/create",
      { screen_name: tweet.user.screen_name },
      function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("Has seguido a: " + tweet.user.screen_name);
        }
      }
    );
}


