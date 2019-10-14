var should = require('should')
var helper = require('node-red-node-test-helper')
var sensibo = require('../sensibo.js')

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
    var flow = [{ id: 'n1', type: 'sensibo in', name: 'sensibo in' }]
    helper.load(sensibo, flow, function () {
      var n1 = helper.getNode('n1')
      n1.should.have.property('name', 'sensibo in')
      done()
    })
  })
})
