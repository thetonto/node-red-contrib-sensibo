/* eslint-disable no-undef */

var helper = require('node-red-node-test-helper')
var sensibo = require('../sensibo.js')
var config = require('./config_out')

var flow = config.flow

helper.init(require.resolve('node-red'))

describe('sensibo Node', function () {
  // Change timeout as the cloud is quite slow
  this.timeout(5000)
  beforeEach(function (done) {
    helper.startServer(done)
  })

  afterEach(function (done) {
    helper.unload()
    helper.stopServer(done)
  })

  it('should be loaded', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      n1.should.have.property('name', 'sensibo out')
      done()
    })
  })

  it('should have an API Property', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      n1.api.should.have.property('sensibo_api', 'k3UFQF3fUCMaCv8VDmcoYzGBT1tglj')
      done()
    })
  })

  it('should change temperature', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      var nh = helper.getNode('nh')
      nh.on('input', function (msg) {
        console.log('Message back ' + msg.payload.status)
        msg.payload.should.have.property('status', 'success')
        done()
      })
      console.log('the node is ' + JSON.stringify(nh))
      n1.receive({ targetTemperature: 23 })
    })
  })
})
