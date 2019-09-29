var rp = require('request-promise-native');
const api_Key = "k3UFQF3fUCMaCv8VDmcoYzGBT1tglj";
const api_Root = "https://home.sensibo.com/api/v2"

var queryString = {
    apiKey : api_Key,
    fields: 'id,room',
}



var apiURI = api_Root + '/users/me/pods'

rp(apiURI,options)
    .then(function(pods){
        console.log(pods);
        console.log(pods.result.room);
    })
    .catch(function(err){
        console.log("failed with" + err)
    });

