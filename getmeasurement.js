var rp = require('request-promise-native');

const config = require('./config');

var pollIntervalSec = 60;
var pollInterval = pollIntervalSec * 1000;

function getMeasurements(){
      var options = {
        json: true,
        headers: {
            "content-type": "application/json",
        },
        qs: {
            apiKey : config.api_key
        }
    }
    console.log(options);


    var apiURI = config.api_root + '/pods/' + config.pod + '/measurements/';

    rp(apiURI,options)
        .then(function(meas){
            console.log(JSON.stringify(meas));
            var mytime = meas.result[0];
            console.log("Seconds Ago: " + mytime.time.secondsAgo);
            console.log("Temperature: " + meas.result[0].temperature);
            console.log("Humidity = " + meas.result[0].humidity);

        })
        .catch(function(err){
            console.log("failed with" + err)
        });
};
console.log("Beginning Polling");
polltimer = setInterval(getMeasurements, 15000);    // meas.result[0].time.secondsAgo