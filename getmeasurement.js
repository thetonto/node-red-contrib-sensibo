var rp = require('request-promise-native');


const config = require('./config');

var queryString = {
    apiKey : config.api_key
};

var options = {
    json: true,
    headers: {
        "content-type": "application/json",
    },
    qs: queryString
}
console.log(options);


var apiURI = config.api_root + '/pods/' + config.pod + '/measurements/';

rp(apiURI,options)
    .then(function(meas){
        console.log(JSON.stringify(meas));
        var mytime = meas.result[0];
        console.log("Seconds Ago: " + mytime.time.secondsAgo);
        console.log(meas);
    })
    .catch(function(err){
        console.log("failed with" + err)
    });

    // meas.result[0].time.secondsAgo