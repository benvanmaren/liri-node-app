require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");
moment().format();


var searchType = process.argv[2];
var slice = process.argv.slice(3);
var searchTerm = slice.join(" ");


if (searchType === "concert-this") {
    request("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp",
        function (error, response, body) {
            var jsonData = JSON.parse(body);
            var str = jsonData[0].datetime;
            var date = moment(str);
            var adjustedDate = date.utc().format('MM-DD-YYYY');
            console.log("--------------------------------------------" +
                "\nYOU SEARCHED FOR ARIST/BAND: " + searchTerm +
                "\nVenue: " + jsonData[0].venue.name +
                "\nLocation: " + jsonData[0].venue.city + ", " + jsonData[0].venue.region +
                "\nDate: " + adjustedDate +
                "\n--------------------------------------------")
        })
}

else if (searchType === "spotify-this-song") {
    spotify.search({
        type: 'track',
        query: searchTerm,
        limit: 1
    },
        function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            else {
                song = data.tracks.items[0];
                console.log('--------------------------------------------' + '\nArtist: ' + song.artists[0].name + '\nSong: ' + song.name + '\nPreview link: ' + song.preview_url + '\nAlbum: ' + song.album.name + '\n' + '--------------------------------------------')
            }
        });
}

else if (searchType === "movie-this") {
    request("http://www.omdbapi.com/?apikey=df652355&t=" + searchTerm,
        function (error, response, body) {
            var jsonData = JSON.parse(body);
            console.log("--------------------------------------------" +
                "\n*Title: " + jsonData.Title +
                "\n*Release year: " + jsonData.Year +
                "\n*IMDB rating: + " + jsonData.Ratings[0].Value +
                "\n*Rotten Tomatoes rating: " + jsonData.Ratings[1].Value +
                "\n*County of production: " + jsonData.County +
                "\n*Language(s): " + jsonData.Language +
                "\n*Plot: " + jsonData.Plot +
                "\n*Actors: " + jsonData.Actors +
                "\n--------------------------------------------")
        })
}

else if (searchType === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
            return
        }
        var dataArr = data.split('"');
        command = dataArr[0].split(',')[0];
        input = dataArr[1];
        spotify.search({
            type: 'track',
            query: input,
            limit: 1
        },
            function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                else {
                    song = data.tracks.items[0];
                    console.log('--------------------------------------------' + '\nArtist: ' + song.artists[0].name + '\nSong: ' + song.name + '\nPreview link: ' + song.preview_url + '\nAlbum: ' + song.album.name + '\n' + '--------------------------------------------')
                }
            })
    });


}
else if (searchType !== "concert-this"||"spotify-song-this"||"movie-this") {
    console.log("--------------------------------------------" + "\nYou cannot search like that. Use the following formats:" + "\n(1) 'concert-this' --> search an artist/band," + "\n(2) 'movie-this' --> search a movie," + "\n(3) 'spotify-this-song' --> search a song"
        + "\ni.e. node liri.js movie-this Avatar"
        + "\n--------------------------------------------")
}

