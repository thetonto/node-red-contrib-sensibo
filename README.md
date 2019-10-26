# Node Red Sensibo Controller #

Set of nodes for the Sensibo Sky air conditioning controllers.

[https://sensibo.com/](https://sensibo.com/ "Sensibo Home Page")

This is an initial release of two nodes to communicate with the Sensibo Cloud.
- Sensibo: Trigger -> or Poll the cloud for measurements.
- Sensibo-send ->  Send commands to the cloud.

Once the API key is setup there is automatic pod discovery of available pods for configuration (no need to lookup podID's)

## Installation ##

In your node-red user directory, typically ~/.node-red, run:

```
[cd ./node.red/]
npm install node-red-contrib-sensibo
```
restart node-red
```
sudo systemctl restart nodered.service
```
## Support / Issues ##

Please log any issues, feature reqeusts on Github.  All feedback is appreciated.  

## Features ##

- Retries on top of the Sensibo API to improve reliability
- Lookup of available PODS via room name.
- User defined polling of temperature and humidity from cloud (min 60 seconds)
- Option to retrieve all device information
-EHelp pages have been populated

## Device Information ##
While there are many common options each device type has additional supported options.  To find the full range of option you can configure the Sensibo mode to retrieve the full configuration in the msg.payload

Good stuff is here:  result.remoteCapabilities.modes.heat.fanLevels

## Roadmap ##
- Upgrade the Sensib node to multi-purpose get measurements, all available device fields or just nominated fields. - All available device fields done.
- Upgrade the Sensibo-Send node to validate commands against available device options from the cloud, and/or populate the node with the available options


## Credits: ##

LukeGT -  [https://github.com/LukeGT/sensibo-controller](https://github.com/LukeGT/sensibo-controller)
