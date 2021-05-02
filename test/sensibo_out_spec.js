/* eslint-disable no-undef */

var helper = require('node-red-node-test-helper')
var sensibo = require('../sensibo.js')
var config = require('./config_out')
var cred = require('./credentials')

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

  it('send should be loaded', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      n1.should.have.property('name', 'sensibo out')
      done()
    })
  })

  it('send should have an API Property', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      n1.api.should.have.property('sensibo_api', cred.api)
      done()
    })
  })

  it('should turn on', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      var nh = helper.getNode('nh')
      nh.on('input', function (msg) {
        console.log('Message back ' + msg.payload.status)
        msg.payload.should.have.property('status', 'success')
        done()
      })
      console.log('the node is ' + JSON.stringify(nh))
      n1.receive({ on: true })
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

  it('should change mode', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      var nh = helper.getNode('nh')
      nh.on('input', function (msg) {
        // console.log('mode Message back ' + msg.payload.status)
        msg.payload.should.have.property('status', 'success')
        done()
      })
      n1.receive({ mode: 'auto' })
    })
  })
  it('should turn off', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      var nh = helper.getNode('nh')
      nh.on('input', function (msg) {
        msg.payload.should.have.property('status', 'success')
        done()
      })
      console.log('the node is ' + JSON.stringify(nh))
      n1.receive({ on: false })
    })
  })


})
