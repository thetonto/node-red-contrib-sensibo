# Node Red Sensibo Controller #

Set of nodes for the Sensibo Sky air conditioning controllers.

[https://sensibo.com/](https://sensibo.com/ "Sensibo Home Page")

This is a beta release of two nodes to communicate with the Sensibo Cloud.
    Sensibo -> Trigger or Poll the cloud for measurements.
    Sensibo-send ->  Send commands to the cloud.

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
## Features ##

- Retries on top of the Sensibo API to improve reliability
- Lookup of available PODS via room name.
- User defined polling of temperature and humidity from cloud (min 60 seconds)
- Help pages have been populated

## Caution ##
*This is an initial release and also my first attempt at building a custom node.  Please log any problems into the issues.*

## Roadmap ##
- Upgrade the Sensib node to multi-purpose get measurements, all available device fields or just nominated fields.
- Upgrade the Sensib-Send node to validate commands against available device options from the cloud, and/or populate the node with the available options


## Credits: ##

LukeGT -  [https://github.com/LukeGT/sensibo-controller](https://github.com/LukeGT/sensibo-controller)
