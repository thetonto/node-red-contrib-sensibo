# Node Red Sensibo Controller #

Set of nodes for the Sensibo Sky air conditioning controllers.

[https://sensibo.com/](https://sensibo.com/ "Sensibo Home Page")

This is a release of two nodes to communicate with the Sensibo Cloud.
- Sensibo-in -> Either trigger or timer poll the cloud for measurements.  Can also retreive full config of the node 
- Sensibo-send ->  Send commands to the cloud.

Once the API key is setup there is automatic pod discovery of available pods for configuration (no need to lookup podID's)

## Update for April 2021 ##
The code has now been updated to remove the deprecated call to the requests module and the other modules relied on it.  I have updated all the code to node-fetch with is a simple library that will hopefully be supported going foward.  The old versions will continue to work and I've updated the code to V0.5.0 which will mean current users will need to force an upgrade.

All testing so far is that the new version works the same way and I have fixed the issue of Binary true/false vs String true/false when calling the node.

There have been some very good feedback as to the way the messages go in and out of the nodes and in the interest of maintaining compatibility with all the current users this remains the same.


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

- Lookup of available PODS via room name.
- User defined polling of temperature and humidity from cloud (min 60 seconds)
- Option to retrieve all device information
- EHelp pages have been populated

## Device Information ##
While there are many common options each device type has additional supported options.  To find the full range of option you can configure the Sensibo mode to retrieve the full configuration in the msg.payload

Good stuff is here:  result.remoteCapabilities.modes.heat.fanLevels

## Roadmap ##
The nodes work very well so far and now updated there is no major roadmap ahead unless requested.


## Credits: ##

LukeGT
The lastest version (0.5.0 onwards no longer uses any of the code from LukeGT due to the deprecation of his work this remains as a credit to the original work.  

