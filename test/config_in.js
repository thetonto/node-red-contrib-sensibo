/* eslint-disable */
var config = require('./credentials')
this.flow = [
	{
		"id": "n1",
		"type": "sensibo in",
		"z": "c612c71c.4a4f98",
		"sensiboAPI": "fcfae818.98aca8",
		"name": "sensibo in",
		"pod": config.pod,
		"getconfig": false,
		"polltime": "0",
		"x": 360,
		"y": 140,
		"wires": [
			[
				"nh"
			]
		]
	},
	{
		"id": "fcfae818.98aca8",
		"type": "sensibo-config",
		"z": "",
		"senAPI": config.api
	},
	{ 
		id: 'nh', 
		type: 'helper' 
	}
]
this.timerflow = [
	{
		"id": "n1",
		"type": "sensibo in",
		"sensiboAPI": "fcfae818.98aca8",
		"name": "sensibo in",
		"pod": config.pod,
		"polltime": "10",
	},
	{
		"id": "fcfae818.98aca8",
		"type": "sensibo-config",
		"z": "",
		"senAPI": config.api
	}
]

this.configflow = [
	{
		"id": "n1",
		"type": "sensibo in",
		"z": "c612c71c.4a4f98",
		"sensiboAPI": "fcfae818.98aca8",
		"name": "sensibo in",
		"pod": config.pod,
		"getconfig": true,
		"polltime": "0",
		"x": 360,
		"y": 140,
		"wires": [
			[
				"nh"
			]
		]
	},
	{
		"id": "fcfae818.98aca8",
		"type": "sensibo-config",
		"z": "",
		"senAPI": config.api
	},
	{ 
		id: 'nh', 
		type: 'helper' 
	}
]