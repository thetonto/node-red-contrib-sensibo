/* eslint-disable */
this.flow = [
	{
		"id": "n1",
		"type": "sensibo in",
		"z": "c612c71c.4a4f98",
		"sensiboAPI": "fcfae818.98aca8",
		"name": "sensibo in",
		"pod": "KN6PnUwG",
		"getconfig": "",
		"polltime": "",
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
		"senAPI": "k3UFQF3fUCMaCv8VDmcoYzGBT1tglj"
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
		"pod": "KN6PnUwG",
		"polltime": "10",
	},
	{
		"id": "fcfae818.98aca8",
		"type": "sensibo-config",
		"z": "",
		"senAPI": "k3UFQF3fUCMaCv8VDmcoYzGBT1tglj"
	}
]

