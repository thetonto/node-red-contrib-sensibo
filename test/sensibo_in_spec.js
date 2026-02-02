/* eslint-disable no-undef */

var helper = require('node-red-node-test-helper')
var sensibo = require('../sensibo.js')
var config = require('./config_in')
var cred = require('./credentials')

var flow = config.flow

helper.init(require.resolve('node-red'))

describe('sensibo Node', function () {
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
      // n1.pod = 'mytestingPod'
      // console.log('Testing:' + JSON.stringify(n1))
      n1.should.have.property('name', 'sensibo in')
      done()
    })
  })

  it('should have an API Property', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      n1.api.should.have.property('sensibo_api', cred.api)
      done()
    })
  })

  it('should get measurements', function (done) {
    helper.load(sensibo, flow, function () {
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


  it('should get full configuration', function (done) {
    helper.load(sensibo, config.configflow, function () {
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
