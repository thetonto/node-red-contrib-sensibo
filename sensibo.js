var rp = require('request-promise-native');

module.exports = function(RED) {
  
    
    
    
    
    
    function sensiboMeasurement(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }

    function sensiboCredentials(n) {
        RED.nodes.createNode(this,n);
        this.sensibo_api = n.sensibo_api;
    }

    RED.nodes.registerType("sensibo-credentials",sensiboCredentials,{
        credentials: {
            key_identifier: {type:"text"}
        }
    });

    RED.nodes.registerType("sensibo in",sensiboMeasurement);
}

