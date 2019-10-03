var rp = require('request-promise-native');
const promise_retry = require('promise-retry');
const _ = require('lodash');

const api_root = 'https://home.sensibo.com/api/v2';
const pod = 'KN6PnUwG';


module.exports = function(RED) {
    
    const request = (method, url, options) => {
        return promise_retry({minTimeout: 5}, (retry, number) => {
          if (number > 1) {
            console.log('retrying...', number);
          }
          return rp[method](url, options).catch(retry);
        })
      
        .catch( (error) => {
          throw {
            status: 500,
            reason: {error, id, patch},
          };
        });
      }

      const get_names = (api_key) => {
        console.log("Getting Names")
        return request('get', api_root + '/users/me/pods', {
          qs: {
            apiKey: api_key,
            fields: 'id,room',
          },
          json: true,
        })
      
        .then( (pods) => {
            //Test harness with two pods
            pods = {"status":"success","result":[{"id":"KN6PnUwG","room":{"name":"Living Room","icon":"lounge"}},{"id":"2NDPOD","room":{"name":"Bedroom","icon":"lounge"}}]}
            var results = [];
            _.forEach(pods.result, function(pods, index) {
                item = {}
                item ["podID"] = pods.id;
                item ["podName"] = pods.room.name;
                results.push(item);
              //results.push([pods.id, pods.room.name]);
            });
            return results;
        });
      };

      const get_measurements = (api_key, podname) => {
        console.log("Getting measurements for pod")
        return request('get', api_root + '/pods/' + podname + '/measurements/', {
          qs: {
            apiKey: api_key
          },
          json: true,
        })
      
        .then( (meas) => {
            return meas;
        });
      }
     
    function sensiboMeasurement(config) {
        RED.nodes.createNode(this,config);
        //Set the node equal to to top level of this for use in functions
        var node = this;
        node.api = RED.nodes.getNode(config.sensiboAPI);      
        
        this.on('input', function(msg) {
            this.status({fill:"green",shape:"ring",text:"polling"});
            
            //Lets call our new generic routines - handy location to also test code
            //var testcall = get_names(node.api.sensibo_api);
            //testcall.then( (names) => console.log('Got pod names:', JSON.stringify(names)))


            //Do the call to Sensibo as a promise and prepare message
            get_measurements(node.api.sensibo_api, config.pod)
                .then(function(meas){
                    console.log(JSON.stringify(meas));
                    var mytime = meas.result[0];
                    msg.temperature = meas.result[0].temperature;
                    msg.humidity = meas.result[0].humidity;
                    msg.secondsAgo = meas.result[0].time.secondsAgo;
                    msg.time = meas.result[0].time.time;
                    msg.payload = meas.status;

                    console.log("The message is " + JSON.stringify(msg));
                    node.status({fill:"green",shape:"dot",text:"waiting"});
                    node.send(msg);
                    
                })
                .catch(function(err){
                    //grab the error messasge and send as payload.
                    msg.payload = err.message;
                    node.status({fill:"red",shape:"dot",text:"error"});
                    node.send(msg);
                    

                });
        });

        this.on('close', function(removed, done) {
            if (removed) {
                if (node.interval_id !== null) {
                    clearInterval(node.interval_id);
                }
                console.log("Sensibo - The node and timer has been deleted")
            } else {
                //Not sure if this is needed #TODO when would a node be restarted
                console.log("The node has been restarted")
            }
            done();
        });

        //Only set interval time if one has been set.
        if (config.polltime>0){
            //First check if we have already have a timer and cancel
            if (node.interval_id !== null) {
                console.log("Cleaning up old timer");
                clearInterval(node.interval_id);
            }

            console.log("Setting up timer for " + config.polltime)
            node.interval_id = setInterval(function(){
                //Setup a timer if required
                node.emit("input",{});
                console.log("Entered Timer");
            }
            //Set the timer from the configuration page and convert to millisecond
            ,config.polltime * 1000);
        } else if (config.polltime==0){
            if (node.interval_id !== null) {
                //Kill old timer should it exist and we change to 0 polling
                clearInterval(node.interval_id);
            }
        } 
    }



    function sensiboConfig(n) {
        RED.nodes.createNode(this,n);
            this.sensibo_api = n.senAPI;
            console.log("Value of sensibo_ap: " + n.senAPI); 

            //Create the admin server here so we have access to API Key.  still need to can do the http lookup.
            RED.httpAdmin.get("/sensibopods", RED.auth.needsPermission('serial.read'), function(req,res) {
            


                var options = {
                    json: true,
                    qs: {apiKey : n.senAPI, fields: 'id, room'}
                };
                rp(api_root + '/users/me/pods',options)
                    .then(function(pods){
                        //Test harness with two pods
                        pods = {"status":"success","result":[{"id":"KN6PnUwG","room":{"name":"Living Room","icon":"lounge"}},{"id":"2NDPOD","room":{"name":"Bedroom","icon":"lounge"}}]}
                        var results = [];
                        _.forEach(pods.result, function(pods, index) {
                            sel = pods.id + " - " + pods.room.name;
                            results.push(sel);
                        });
                            res.json(results);
                     })
                    .catch(function(err){
                        //Error Handler
                        console.log("failed with" + err)
                    })
                 }); //end of RED.http                    
                    
                 RED.httpAdmin.get("/sensibopods2", RED.auth.needsPermission('serial.read'), function(req, res) {
                    
                    get_names(n.senAPI)
                        .then(function(pods){
                            
                            console.log("got some new better: " + pods);
                            res.json(pods);
                         })
                        .catch(function(err){
                            //Error Handler
                            console.log("failed with" + err)
                        })
                     }); //end of RED.http

    }
    
    RED.nodes.registerType("sensibo-config",sensiboConfig);
    RED.nodes.registerType("sensibo in",sensiboMeasurement);


}

