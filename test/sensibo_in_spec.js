var fs = require('fs')
var path = require('path')
var helper = require('node-red-node-test-helper')
var sensibo = require('../sensibo.js')
var config = require('./config_in')

var credentialsPath = path.join(__dirname, 'credentials.js')
var hasLiveCredentials = fs.existsSync(credentialsPath)
var cred = hasLiveCredentials ? require('./credentials') : require('./credentials_sample')

var flow = config.flow
var nodeCredentials = {
  'fcfae818.98aca8': {
    senAPI: cred.api
  }
}

helper.init(require.resolve('node-red'))

describe('sensibo Node', function () {
  this.timeout(30000)

  beforeEach(function (done) {
    helper.startServer(done)
  })

  afterEach(function (done) {
    helper.unload()
    helper.stopServer(done)
  })

  it('should be loaded', function (done) {
    helper.load(sensibo, flow, nodeCredentials, function () {
      var n1 = helper.getNode('n1')
      // n1.pod = 'mytestingPod'
      // console.log('Testing:' + JSON.stringify(n1))
      n1.should.have.property('name', 'sensibo in')
      done()
    })
  })

  it('should have an API Property', function (done) {
    helper.load(sensibo, flow, nodeCredentials, function () {
      var n1 = helper.getNode('n1')
      n1.api.should.have.property('sensibo_api', cred.api)
      done()
    })
  })

  ;(hasLiveCredentials ? it : it.skip)('should get measurements', function (done) {
    helper.load(sensibo, flow, nodeCredentials, function () {
      var n1 = helper.getNode('n1')
      var nh = helper.getNode('nh')
      nh.on('input', function (msg) {
        console.log('Testing:' + JSON.stringify(msg))
        msg.should.have.property('payload', 'success')
        done()
      })
      n1.receive({ payload: 'getMeasurement' })
    })
  })


  ;(hasLiveCredentials ? it : it.skip)('should get full configuration', function (done) {
    helper.load(sensibo, config.configflow, nodeCredentials, function () {
      var n1 = helper.getNode('n1')
      var nh = helper.getNode('nh')
      nh.on('input', function (msg) {
        console.log('Testing:' + JSON.stringify(msg))
        msg.should.have.property('status', 'success')
        done()
      })
      n1.receive({ payload: 'getMeasurement' })
    })
  })
})
