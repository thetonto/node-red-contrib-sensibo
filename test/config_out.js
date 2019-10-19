/* eslint-disable */
var config = require('./credentials')
this.flow = [
	{
		"id": "n1",
		"type": "sensibo send",
		"z": "c612c71c.4a4f98",
		"sensiboAPI": "fcfae818.98aca8",
		"name": "sensibo out",
		"pod": config.pod,
		"podSelector": "",
		"x": 550,
		"y": 240,
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

