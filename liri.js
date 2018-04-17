//requirements and instantiations
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// captures user input
var actionInput = process.argv[2];
var dataInput = process.argv[3];
takeAction(actionInput, dataInput);

function takeAction(action, data) {
    switch (action) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            getSpotify(data);
            break;
        case "movie-this":
            getMovie(data);
            break;
        case "do-what-it-says":
            getRandomText();
            break;
        case "clear-log":
            clearLog();
            break;
        default:
            console.log("improper command")
            break;
    }
}

function getTweets() {
    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (error) throw error;
        var tweetsString = ""
        for (var i = 0; i < tweets.length; i++) {
            tweetsString += "\n" + tweets[i].created_at + "\n" + tweets[i].text + "\n";
        }
        fs.appendFile('log.txt', tweetsString, (err) => {
            if (err) throw err;
        })
        console.log(tweetsString);
    });
}

function getSpotify(song) {
    if (song == "" || song == null) {
        song = "The Sign"
    }
    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songString;
        for (var i = 0; i < data.tracks.items.length; i++) {
            songString += "\n Song name: " + data.tracks.items[i].name + "\n" +
                "Artist(s): " + data.tracks.items[i].artists[0].name + "\n" +
                "Album: " + data.tracks.items[i].album.name + "\n" +
                "Link: " + data.tracks.items[i].href + "\n"
        }
        fs.appendFile('log.txt', songString, (err) => {
            if (err) throw err;
        })
        console.log(songString);
    });
}

function getMovie(title) {
    if (title == "" || title == null) {
        title = "Mr. Nobody"
    }
    var keyString = "&apikey=" + process.env.OMDB_KEY
    request("http://www.omdbapi.com/?t=" + title + "&plot=short" + keyString, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            returnObject = JSON.parse(body);
            console.log(JSON.parse(body, null, 2));
            var movieString = "\n Title: " + returnObject.Title + "\n" +
                "Year: " + returnObject.Year + "\n" +
                "IMDB rating: " + returnObject.imdbRating + "\n" +
                "Rotten Tomatoes rating: " + returnObject.Ratings[1].Value + "\n" +
                "Country: " + returnObject.Country + "\n" +
                "Language: " + returnObject.Language + "\n" +
                "Plot: " + returnObject.Plot + "\n" +
                "Actors: " + returnObject.Actors + "\n"
            fs.appendFile('log.txt', movieString, (err) => {
                if (err) throw err;
            })
            console.log(movieString)
        }
    });
}

function getRandomText() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArray = data.split(",")
        takeAction(dataArray[0], dataArray[1])
    })
}

function clearLog() {
    fs.writeFile('log.txt', "", err => {
        if (err) throw err;
    });
}