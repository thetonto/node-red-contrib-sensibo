/* cSpell:disable */

const _ = require('lodash')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const apiRoot = 'https://home.sensibo.com/api/v2'

module.exports = function (RED) {
  function getConfigApiKey (configNode) {
    return configNode && configNode.sensibo_api
  }

  function createConfigError (message, statusCode) {
    const err = new Error(message)
    if (statusCode) {
      err.statusCode = statusCode
    }
    return err
  }

  function parseSensiboResponse (res) {
    return res.text().then((body) => {
      let data = {}

      if (body) {
        try {
          data = JSON.parse(body)
        } catch {
          throw createConfigError('Sensibo returned an invalid JSON response', res.status)
        }
      }

      if (!res.ok) {
        const message = data.message || data.reason || `Sensibo request failed with status ${res.status}`
        throw createConfigError(message, res.status)
      }

      if (data && data.status && data.status !== 'success') {
        const message = data.message || data.reason || `Sensibo request returned status ${data.status}`
        throw createConfigError(message, res.status)
      }

      return data
    })
  }

  function sensiboRequest (path, apiKey, options = {}, query = {}) {
    if (!apiKey) {
      return Promise.reject(createConfigError('Sensibo API key is not configured'))
    }

    const apiURI = new URL(apiRoot + path)
    apiURI.searchParams.append('apiKey', apiKey)
    Object.entries(query).forEach(([key, value]) => {
      if (typeof value !== 'undefined' && value !== null && value !== '') {
        apiURI.searchParams.append(key, value)
      }
    })

    const requestOptions = {
      method: 'GET',
      headers: { accept: 'application/json' },
      ...options
    }

    return fetch(apiURI, requestOptions).then(parseSensiboResponse)
  }

  function sensiboGet (config) {
    RED.nodes.createNode(this, config)
    // Set the node equal to to top level of this for use in functions
    var node = this
    node.api = RED.nodes.getNode(config.sensiboAPI)
    node.interval_id = null

    this.on('input', function (msg, send, done) {
      // If this is pre-1.0, 'send' will be undefined, so fallback to node.send
      send = send || function () { node.send.apply(node, arguments) }

      if (!node.api || !getConfigApiKey(node.api)) {
        const err = createConfigError('Sensibo API configuration is missing')
        node.status({ fill: 'red', shape: 'dot', text: 'error' })
        if (done) {
          done(err)
        } else {
          node.error(err, msg)
        }
        return
      }

      if (!config.pod) {
        const err = createConfigError('A Sensibo pod must be selected')
        node.status({ fill: 'red', shape: 'dot', text: 'error' })
        if (done) {
          done(err)
        } else {
          node.error(err, msg)
        }
        return
      }

      // Set the status on the node
      this.status({ fill: 'green', shape: 'ring', text: 'polling' })

      if (config.getconfig || config.getACState) {
        const fields = config.getconfig ? '*' : 'acState'
        sensiboRequest(`/pods/${config.pod}`, getConfigApiKey(node.api), {}, { fields })
          .then(function (cfg) {
            node.status({ fill: 'green', shape: 'dot', text: 'Connected' })
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

        sensiboRequest(`/pods/${config.pod}/measurements/`, getConfigApiKey(node.api))
          .then(meas => {
            if (!meas.result || !meas.result[0]) {
              throw createConfigError('No measurement data was returned for this pod')
            }
            msg.temperature = meas.result[0].temperature
            msg.payload = meas.status
            msg.humidity = meas.result[0].humidity
            msg.secondsAgo = meas.result[0].time.secondsAgo
            msg.time = meas.result[0].time.time
            node.status({ fill: 'green', shape: 'dot', text: 'Connected' })
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
        if (node.interval_id) {
          clearInterval(node.interval_id)
          node.interval_id = null
        }
      }
      done()
    })

    // Only set interval time if one has been set.
    if (config.polltime > 0) {
      // First check if we have already have a timer and cancel
      if (node.interval_id) {
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
    } else if (Number(config.polltime) === 0) {
      if (node.interval_id) {
        // Kill old timer should it exist and we change to 0 polling
        clearInterval(node.interval_id)
        node.interval_id = null
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

      if (!node.api || !getConfigApiKey(node.api)) {
        const err = createConfigError('Sensibo API configuration is missing')
        node.status({ fill: 'red', shape: 'dot', text: 'error' })
        if (done) {
          done(err)
        } else {
          node.error(err, msg)
        }
        return
      }

      if (!config.pod) {
        const err = createConfigError('A Sensibo pod must be selected')
        node.status({ fill: 'red', shape: 'dot', text: 'error' })
        if (done) {
          done(err)
        } else {
          node.error(err, msg)
        }
        return
      }

      // parse message
      const cmdData = {}
      // #TODO - Map against possible values and validate
      if (typeof msg.on !== 'undefined') {
        if (typeof msg.on === 'string') {
          cmdData.on = msg.on.trim().toLowerCase() === 'true'
        } else {
          cmdData.on = Boolean(msg.on)
        }
      }
      if (typeof msg.swing !== 'undefined') {
        cmdData.swing = msg.swing
      }
      if (typeof msg.mode !== 'undefined') {
        cmdData.mode = msg.mode
      }
      if (typeof msg.fanlevel !== 'undefined') {
        cmdData.fanLevel = msg.fanlevel
      }
      if (typeof msg.targetTemperature !== 'undefined') {
        if (typeof msg.targetTemperature === 'string') {
          cmdData.targetTemperature = parseInt(msg.targetTemperature, 10)
        } else {
          cmdData.targetTemperature = msg.targetTemperature
        }
        if (Number.isNaN(cmdData.targetTemperature)) {
          const err = createConfigError('targetTemperature must be a valid number')
          node.status({ fill: 'red', shape: 'dot', text: 'error' })
          if (done) {
            done(err)
          } else {
            node.error(err, msg)
          }
          return
        }
      }

      sensiboRequest(`/pods/${config.pod}`, getConfigApiKey(node.api), {}, { fields: 'acState' })
        .then((data) => {
          var acState = _.merge(data.result, cmdData)
          var newState = {}
          newState.acState = acState
          return sensiboRequest(`/pods/${config.pod}/acStates`, getConfigApiKey(node.api), {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json'
            },
            body: JSON.stringify(newState)
          })
        })
        .then((cmdResponse) => {
          msg.payload = cmdResponse
          node.status({ fill: 'green', shape: 'dot', text: 'Connected' })
          send(msg)
          // Check done exists (1.0+)
          if (done) {
            done()
          }
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
    const credentialApiKey = this.credentials && this.credentials.senAPI
    this.sensibo_api = credentialApiKey || n.senAPI
  }

  RED.httpAdmin.get('/sensibo', RED.auth.needsPermission('flows.read'), function (req, res) {
    const configNodeId = req.query.config
    const configNode = RED.nodes.getNode(configNodeId)
    const apiKey = getConfigApiKey(configNode)

    if (!configNodeId || !configNode) {
      res.status(400).json({ error: 'A valid Sensibo API configuration must be selected.' })
      return
    }

    sensiboRequest('/users/me/pods', apiKey, {}, { fields: 'id,room' })
      .then(function (pods) {
        // Convert result into nice JSON to send to webclients
        var results = []
        _.forEach(pods.result, function (pod) {
          const item = {}
          item.value = pod.id
          item.label = pod.room.name
          results.push(item)
        })
        // set the response back
        res.json(results)
      })
      .catch(function (err) {
        res.status(err.statusCode || 500).json({
          error: err.message || 'Sensibo pod lookup failed'
        })
      })
  })

  RED.nodes.registerType('sensibo-config', sensiboConfig, {
    credentials: {
      senAPI: { type: 'password' }
    }
  })
  RED.nodes.registerType('sensibo in', sensiboGet)
  RED.nodes.registerType('sensibo send', sensiboSend)
}
