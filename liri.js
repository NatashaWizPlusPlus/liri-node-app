//required node modules
var keys = require ("./keys.js");
var Twitter = require('twitter');
var spotify = require('spotify-web-api-node');
var requestModule = require('request');
var inq = require('inquirer');
var fs = require ('fs');

//This happens when the commands are called
if(process.argv.length<3){
    console.log("List Of Commands\n"
                +"1: node liri.js my-tweets\n"
                +"2: node liri.js spotify-this-song [nameOfSong]\n"
                +"3: node liri.js movie-this [nameOfMovie]\n"
                +"4: node liri.js do-what-it-says\n");
}

                // node liri.js my-tweets
                //my-tweets
                if(process.argv[2]=="my-tweets"){
                    // run getTweets();
                    getTweets();
                    //console.log("User Wants Tweets");

                //spotify-this-song    
                }else if(process.argv[2]=="spotify-this-song"){
                    // run getSpotify();
                    getSpotify(process.argv[3]);
                    //console.log("User Wants Spotify");

                }else if(process.argv[2]=="movie-this"){
                    // run getMOvieInfo();
                    getMovieInfo(process.argv[3]);
                  // console.log("User Wants Movies");
                }else if(process.argv[2]=="do-what-it-says"){
                    // run do what it says 
                    //console.log("Do what it says");
                    doWhatItSays();
                }

            //This is the function to get the tweets
            function getTweets(){

                // twitter credentials 
                var client = new Twitter({
                    consumer_key: keys.twitterKeys.consumer_key,
                    consumer_secret: keys.twitterKeys.consumer_secret,
                    access_token_key: keys.twitterKeys.access_token_key,
                    access_token_secret: keys.twitterKeys.access_token_secret
                });
              
              inq.prompt({
                  type:'input',
                  name : 'screenNameQuestion',
                  message : 'Please enter your screen name.'

              }).then(function(answers){

                    var screenName = String(answers.screenNameQuestion);

                    var params = {count : 20,
                              screen_name : screenName
                            };
                            
                    client.get('statuses/user_timeline', params, function(error, tweets, response) {
                        if (!error) {
                            //console.log(tweets);
                            for(prop in tweets){
                                var i = 1;
                                // console.log(prop);
                                // console.log(tweets[prop]);
                                var tweetNumber = parseInt(prop)+1;
                                var tweetCreatedAt = tweets[prop].created_at;
                                var tweetText = tweets[prop].text;
                                console.log("Tweet #"+tweetNumber
                                            +"\nTweet Date: "+tweetCreatedAt
                                            +"\nTweet: "+tweetText+"\n");
                                            
                            }
                        }else{
                            console.log('Invalid Screen Name');
                        }
                    });
              });
             }
            
             // node liri.js spotify-this-song '<song name here>'
            // This will show the following information about the song in your terminal/bash window
            // Artist(s)
            // The song's name
            // A preview link of the song from Spotify
            // The album that the song is from
            // if no song is provided then your program will default to
            // "The Sign" by Ace of Base     
 
            function getSpotify(query){
                query = String(query);
                spotify = new spotify();
                spotify.searchTracks(query)
                .then(function(data) {

                    //the object is returned in data.body  
                    for (prop in data.body.tracks.items){
                        //console.log(data.body.tracks.items[prop]);
                        var tracks = data.body.tracks.items[prop];
                        var albumName = tracks.album.name;
                        var trackName = tracks.name;
                        var artists = [];

                        //Artist Name 
                        for (var name in tracks.artists){
                            artists.push(tracks.artists[name].name)
                        }
                        //console.log(artists);
                        artists = artists.join(", ");
                        console.log("Artist: "+artists);
                        // Track Name 
                        console.log("Track Name:"+trackName);
                        // Album Name 
                        console.log("Album Name:"+albumName);
                        // newline after data
                        console.log("\n");

                    }

                }, function(err) {
                    console.error(err);
                });
            }
            getSpotify('Jah');

            // node liri.js movie-this '<movie name here>'
            // This will output the following information to your terminal/bash window:
            //    * Title of the movie.
            //    * Year the movie came out.
            //    * IMDB Rating of the movie.
            //    * Country where the movie was produced.
            //    * Language of the movie.
            //    * Plot of the movie.
            //    * Actors in the movie.
            //    * Rotten Tomatoes URL.
            // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
            // If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
            // It's on Netflix!
            function getMovieInfo(query){

                query = String(query);
                //console.log(typeof query);

                var url = 'http://www.omdbapi.com/?apikey='+keys.movieKeys.key+'&t='+query;

                requestModule(url, function (error, response, body) {
                if(!error){
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
                    body = JSON.parse(body);
                    //console.log('body:', body); // Print the HTML for the Google homepage. 
                    console.log("Title: "+body.Title
                                +"\nYear of Release: "+body.Released
                                +"\nIMDB Rating: "+body.imdbRating
                                +"\nCountry of Production: "+body.Country
                                +"\nLanguage: "+body.Language
                                +"\nPlot: "+body.Plot
                                +"\nActors: "+body.Actors
                                +"\nWebsite: "+body.Website+"\n");
                    
                }else{
                    console.log(error);
                }
                




                });
            }
            getMovieInfo(1);

            // node liri.js do-what-it-says
            // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
            // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
            // Feel free to change the text in that document to test out the feature for other commands.

            function doWhatItSays(){
              var commands = fs.readFileSync('./random.txt','utf8');
            //    console.log(command);
            //    console.log(typeof command);
            //    console.log("node app.js "+command);
              commands = commands.split(",");
              console.log(commands);
              handleWhatItSays(commands);
            }

            function handleWhatItSays(commands){
                // The user will pass 2 parameters which are the command and
                // the parameter to pass to the called function
                if(commands[0]=="my-tweets"){
                    // run getTweets();
                    getTweets();
                    //console.log("User Wants Tweets");
                }else if(commands[0]=="spotify-this-song"){
                    // run getSpotify();
                    getSpotify(commands[1]);
                    //console.log("User Wants Spotify");
                }else if(commands[0]=="movie-this"){
                    // run getMOvieInfo();
                    getMovieInfo(commands[1]);
                  // console.log("User Wants Movies");
                }else if(commands[0]=="do-what-it-says"){
                    // run do what it says 
                    console.log("Nope!");
                    //doWhatItSays();

                }
            }



            // var client = new Twitter({
            //   consumer_key: 'VLJDu9qWc1YJAlhmq7DCz5eou',
            //   consumer_secret: 'B3FhZQzGbgsAkqjIdOsKD3ZdVN1VCnWjnm21hGmr05OWaRCMp0',
            //   access_token_key: '866509799764054016-aooGYFJ2rUb2ZhA28oFf6OpGQLk58vw',
            //   access_token_secret: 'VyOyYIW2o82E0DMwRWtNyExDsviruZdStGfNoCpojdp2j'
            // });
            
            // var params = {
            //   screen_name: 'wizplusplus',
            //   count: '10',
            // };
            // client.get('statuses/user_timeline', params, function(error, tweets, response) {
            //   if (!error) {
            //     console.log(tweets);
            //   }
            // });




            // client.get(path, params, callback);
            // client.post(path, params, callback);
            // client.stream(path, params, callback);
