/* eslint-disable */
this.flow = [
	{
		"id": "n1",
		"type": "sensibo send",
		"z": "c612c71c.4a4f98",
		"sensiboAPI": "fcfae818.98aca8",
		"name": "sensibo out",
		"pod": "KN6PnUwG",
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
		"senAPI": "k3UFQF3fUCMaCv8VDmcoYzGBT1tglj"
	},
	{ 
		id: 'nh', 
		type: 'helper' 
	}
]

