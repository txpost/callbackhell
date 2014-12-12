var Twit = require('twit'),
	async = require('async');

// authentication for the Twitter API
var t = new Twit({
	consumer_key: process.env.BOT_CONSUMER_KEY,
	consumer_secret: process.env.BOT_CONSUMER_SECRET,
	access_token: process.env.BOT_ACCESS_TOKEN,
	access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});


// get the most recent tweet that matches our query
getPublicTweet = function (cb) {

	var query = '"hell is like"';

	t.get('search/tweets', {q: query, count: 1}, function (err, data, response) {
		if (!err) {
			var botData = {
				baseTweet: data.statuses[0].text,
				tweetID: data.statuses[0].id_str,
				tweetUsername: data.statuses[0].user.screen_name
			};
			cb(null, botData);
		} else {
			console.log("There was an error getting a public Tweet. ABORT!");
			cb(err, botData);
		}
	});
}


// format the tweet
formatTweet = function (botData, cb) {
	
	var tweetText = botData.baseTweet;

	// find and replace "hell is like" with "callback hell is like"
	var ourText = tweetText.replace("hell is like", "callback hell is like");

	var tweet = ourText;
	botData.tweetBlock = tweet;
	cb(null, botData);
}


// post the tweet
postTweet = function (botData, cb) {
	t.post('statuses/update', {status: botData.tweetBlock}, function (err, data, response) {
		cb(err, botData);
	});
}


// run each function in sequence
run = function () {
	async.waterfall([
		getPublicTweet,
		formatTweet,
		postTweet
	],
	function (err, botData) {
		if (err) {
			console.log("There was an error posting to Twitter: ", err);
		} else {
			console.log("Tweet successful!");
			console.log("Tweet: ", botData.tweetBlock);
		}
	});
}


// run every two hours: 60000 * 60 * 2
setInterval(function () {
	try {
		run();
	}
	catch (e) {
		console.log(e);
	}
}, 60000 * 5);