const _ = require('lodash')
const fetch = require('node-fetch')

const apiRoot = 'https://home.sensibo.com/api/v2'

module.exports = function (RED) {
  function sensiboGet (config) {
    RED.nodes.createNode(this, config)
    // Set the node equal to to top level of this for use in functions
    var node = this
    node.api = RED.nodes.getNode(config.sensiboAPI)

    this.on('input', function (msg, send, done) {
      // If this is pre-1.0, 'send' will be undefined, so fallback to node.send
      send = send || function () { node.send.apply(node, arguments) }
      this.status({ fill: 'green', shape: 'ring', text: 'polling' })

      // Lets call our new generic routines - handy location to also test code
      // var testcall = getNames(node.api.sensibo_api);
      // testcall.then( (names) => console.log('Got pod names:', JSON.stringify(names)))

      if (config.getconfig) {
        // 20210428 - new code - working

        var apiURI = new URL(apiRoot + '/pods/' + config.pod)
        apiURI.searchParams.append('apiKey', node.api.sensibo_api)
        var options = {
          method: 'GET',
          headers: { accept: 'application/json' } // Set to JSON
        }

        fetch(apiURI, options)
          .then(res => res.json()) // new fetch code convert the message to JSON for the old code to work.
          .then(function (cfg) {
            node.status({ fill: 'green', shape: 'dot', text: 'waiting' })
            send(cfg)
            // Check done exists (1.0+)
            if (done) {
              done()
            }
          })
          .catch(function (err) {
            // grab the error messasge and send as payload.
            msg.payload = err.message
            node.status({ fill: 'red', shape: 'dot', text: 'error' })
            send(msg)
            if (done) {
              // Use done if defined (1.0+)
              done(err)
            } else {
              // Fallback to node.error (pre-1.0)
              node.error(err, msg)
            }
          })
      } else {
        // Do the call to Sensibo as a promise and prepare message
        // Now been updated to use Node-fetch directly

        apiURI = new URL(apiRoot + '/pods/' + config.pod + '/measurements/')
        apiURI.searchParams.append('apiKey', node.api.sensibo_api)
        options = {
          method: 'GET',
          headers: { accept: 'application/json' } // Set to JSON
        }
        fetch(apiURI, options)
          .then(res => res.json())
          // .then(json => console.log(JSON.stringify(json)))  // you cannot enable this as it will return a null value to the next function.  Just an FYI after some hard lessons on promises
          .then(meas => {
            msg.temperature = meas.result[0].temperature
            msg.humidity = meas.result[0].humidity
            msg.secondsAgo = meas.result[0].time.secondsAgo
            msg.time = meas.result[0].time.time
            msg.payload = meas.status
            node.status({ fill: 'green', shape: 'dot', text: 'pending' })
            send(msg)
            // Check done exists (1.0+)
            if (done) {
              done()
            }
          })
          .catch(function (err) {
            // grab the error messasge and send as payload.
            msg.payload = err.message
            node.status({ fill: 'red', shape: 'dot', text: 'error' })
            send(msg)
            if (done) {
              // Use done if defined (1.0+)
              done(err)
            } else {
              // Fallback to node.error (pre-1.0)
              node.error(err, msg)
            }
          })
      }
    })

    this.on('close', function (removed, done) {
      if (removed) {
        if (node.interval_id !== null) {
          clearInterval(node.interval_id)
        }

        console.log('Sensibo - The node and timer has been deleted')
      } else {
        // Not sure if this is needed #TODO when would a node be restarted
        // console.log('Sensibo - The node has been restarted')
      }
      done()
    })

    // Only set interval time if one has been set.
    if (config.polltime > 0) {
      // First check if we have already have a timer and cancel
      if (node.interval_id !== null) {
        clearInterval(node.interval_id)
      }
      // send trace message for testing framework
      node.trace('creating timer')
      node.interval_id = setInterval(function () {
        // Setup a timer if required
        node.emit('input', {})
      }
      // Set the timer from the configuration page and convert to millisecond
      , config.polltime * 1000)
    } else if (config.polltime === 0) {
      if (node.interval_id !== null) {
        // Kill old timer should it exist and we change to 0 polling
        clearInterval(node.interval_id)
      }
    }
  }

  function sensiboSend (config) {
    RED.nodes.createNode(this, config)

    var node = this
    node.api = RED.nodes.getNode(config.sensiboAPI)

    node.on('input', function (msg, send, done) {
      // If this is pre-1.0, 'send' will be undefined, so fallback to node.send
      send = send || function () { node.send.apply(node, arguments) }

      this.status({ fill: 'green', shape: 'ring', text: 'sending' })
      node = this
      // parse message
      const cmdData = {}
      // #TODO - Map against possible values and validate
      if (typeof msg.on !== 'undefined') {
        if (msg.on === 'true' | msg.on) {
          cmdData.on = true
        } else {
          cmdData.on = false
        };
      };
      if (typeof msg.swing !== 'undefined') {
        cmdData.swing = msg.swing
      };
      if (typeof msg.mode !== 'undefined') {
        cmdData.mode = msg.mode
      };
      if (typeof msg.fanlevel !== 'undefined') {
        cmdData.fanLevel = msg.fanlevel
      };
      if (typeof msg.targetTemperature !== 'undefined') {
        cmdData.targetTemperature = msg.targetTemperature
      };

      console.log('Compiled Command is:' + JSON.stringify(cmdData))

      // eslint-disable-next-line no-unused-vars
      // var performPatch = patchPods(node.api.sensibo_api, config.pod, cmdData)

      var apiURI = new URL(apiRoot + '/pods/' + config.pod)
      apiURI.searchParams.append('apiKey', node.api.sensibo_api)
      apiURI.searchParams.append('fields', 'acState')
      var options = {
        method: 'GET',
        headers: { accept: 'application/json' } // Set to JSON
      }

      // return requestOld('get', apiRoot + '/pods/' + id, { qs, json: true, timeout: 5000 })
      fetch(apiURI, options)
        .then(res => res.json()) // new fetch code convert the message to JSON for the old code to work.
        .then((data) => {
          var acState = _.merge(data.result.acState, cmdData)
          var newState = {}
          newState.acState = acState
          console.log('The Data is ' + JSON.stringify(newState))
          var apiURIPatch = new URL(apiRoot + '/pods/' + config.pod + '/acStates')
          apiURIPatch.searchParams.append('apiKey', node.api.sensibo_api)
          var options = {
            method: 'POST',
            headers: { accept: 'application/json' }, // Set to JSON
            body: JSON.stringify(newState)
          }

          fetch(apiURIPatch, options)
            .then(res => res.json())
            .then((cmdData) => {
              msg.payload = cmdData
              node.status({ fill: 'green', shape: 'dot', text: 'connected' })
              send(msg)
              // Check done exists (1.0+)
              if (done) {
                done()
              }
            })
        })

        .catch(function (err) {
          // grab the error messasge and send as payload.
          msg.payload = err.message
          // Report back the error
          if (done) {
            // Use done if defined (1.0+)
            done(err)
          } else {
            // Fallback to node.error (pre-1.0)
            node.error(err, msg)
          }
          node.status({ fill: 'red', shape: 'dot', text: 'error' })
          send(msg)
        })
    })
  }

  function sensiboConfig (n) {
    RED.nodes.createNode(this, n)
    this.sensibo_api = n.senAPI
    // Create the admin server here so we have access to API Key.
    RED.httpAdmin.get('/sensibo', RED.auth.needsPermission('serial.read'), function (req, res) {
      // get the query string
      const retrieveType = req.query.lkup
      console.log('Type of data to retrieve is ' + retrieveType)
      var apiURI = new URL(apiRoot + '/users/me/pods')
      apiURI.searchParams.append('apiKey', n.senAPI) // set the key directly to node-fetch
      apiURI.searchParams.append('fields', 'id,room')
      var options = {
        method: 'GET',
        headers: { accept: 'application/json' } // Set to JSON
      }

      // 20210429 - New fetch implemented
      fetch(apiURI, options)
        .then(res => res.json())
        .then(function (pods) {
          // Convert result into nice JSON to send to webclients
          var results = []
          _.forEach(pods.result, function (pods, index) {
            const item = {}
            item.value = pods.id
            item.label = pods.room.name
            results.push(item)
          })
          console.log('Sending back results of ' + JSON.stringify(results))
          // set the response back
          res.json(results)
        })
        .catch(function (err) {
          // Error Handler
          console.log('Sensibo Admin lookup failed with' + err)
        })
    }) // end of RED.http
  }

  RED.nodes.registerType('sensibo-config', sensiboConfig)
  RED.nodes.registerType('sensibo in', sensiboGet)
  RED.nodes.registerType('sensibo send', sensiboSend)
}
