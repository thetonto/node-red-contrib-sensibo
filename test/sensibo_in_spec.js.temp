/* eslint-disable no-undef */

var helper = require('node-red-node-test-helper')
var sensibo = require('../sensibo.js')
var config = require('./config_in')

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
      n1.api.should.have.property('sensibo_api', 'k3UFQF3fUCMaCv8VDmcoYzGBT1tglj')
      done()
    })
  })

  it('should get measurements', function (done) {
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      var nh = helper.getNode('nh')
      nh.on('input', function (msg) {
        msg.should.have.property('payload', 'success')
        done()
      })
      n1.receive({ payload: 'getMeasurement' })
    })
  })

  it('should create a polling timer', function (done) {
    helper.load(sensibo, config.timerflow, function () {
      const n1 = helper.getNode('n1')
      // n1.receive({somethingBadAndWeird: true});
      // because the emit happens asynchronously, this listener
      // will be registered before `call:trace` is emitted.
      n1.on('call:trace', call => {
        call.should.be.calledWithExactly('creating timer')
        done()
      })
    })
  })
})
