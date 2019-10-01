var rp = require('request-promise-native');
const _ = require('lodash');

const api_Key = "k3UFQF3fUCMaCv8VDmcoYzGBT1tglj";
const api_Root = "https://home.sensibo.com/api/v2"

var queryString = {apiKey : api_Key, fields: 'id,room',
    //fields: '*',
}
var options = {
    json: true,
    headers: {
        "content-type": "application/json",
    },
    qs: {apiKey : api_Key, fields: 'id, room'}
}

var apiURI = api_Root + '/users/me/pods'

rp(apiURI,options)
    .then(function(pods){
        console.log(JSON.stringify(pods));
        console.log("POD ID= " + pods.result[0].id);
        
        //Test harness with two pods
        pods = {"status":"success","result":[{"id":"KN6PnUwG","room":{"name":"Living Room","icon":"lounge"}},{"id":"2ND POD","room":{"name":"Bedroom","icon":"lounge"}}]}
        var results = [];
        _.forEach(pods.result, function(pods, index) {
            sel = pods.id + " | " + pods.room.name;
            console.log(sel);
            //Formula to get back the POD ID for use in the Node Properties HTML
            console.log(sel.split("|")[0].trim())
            results.push(sel);
          });
          //prepare results for sending to client
          results = JSON.stringify(results);
          console.log(results);

    })
    .catch(function(err){
        console.log("failed with" + err)
    });

