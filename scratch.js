RED.httpAdmin.get("/sensibopods", RED.auth.needsPermission('serial.read'), function(req,res) {
  //get the available PODS for the API Key
  api_config = RED.nodes.getNode(config.sensiboAPI);
  var options = {
      json: true,
      headers: {"content-type": "application/json"},
      qs: {apiKey : n.sensibo_api, fields: 'id, room'}
  }

  rp(api_root + '/users/me/pods',options)
      .then(function(pods){
          //console.log(JSON.stringify(pods));
          //console.log("POD ID= " + pods.result[0].id);
          
          //Test harness with two pods
          //pods = {"status":"success","result":[{"id":"KN6PnUwG","room":{"name":"Living Room","icon":"lounge"}},{"id":"2ND POD","room":{"name":"Bedroom","icon":"lounge"}}]}
          var results = [];
          _.forEach(pods.result, function(pods, index) {
              sel = pods.id + " | " + pods.room.name;
              results.push(sel);
          });
          //prepare results for sending to client
          results = JSON.stringify(results);
      })
      .catch(function(err){
          console.log("failed with" + err)
      });
  })


  <option value="KN6PnUwG | Living Room">KN6PnUwG | Living Room</option>
  <option value="BB2PnUwG | Bedroom">BB2PnUwG | Bedroom"</option>