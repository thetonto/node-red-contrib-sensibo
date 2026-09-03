# Node Red Sensibo Controller #

Set of nodes for the Sensibo Sky air conditioning controllers.

[https://sensibo.com/](https://sensibo.com/ "Sensibo Home Page")

This is a release of two nodes to communicate with the Sensibo Cloud.
- Sensibo-in -> Either trigger or timer poll the cloud for measurements.  Can also retrieve full config of the node 
- Sensibo-send ->  Send commands to the cloud.

Once the API key is set up there is automatic pod discovery of available pods for configuration (no need to look up pod IDs), though it will store the ID after lookup.

## Requirements ##

- Node-RED 3.0 or newer
- Node.js 18 or newer

## Recent Updates ##

- **0.6.x** – Package modernised. The HTTP layer was refactored onto a single `node-fetch` helper with proper error handling, so failed requests now surface a meaningful message on the node and via `catch`/`done` instead of failing silently. The Sensibo API key is now stored as a Node-RED **credential** (encrypted, password field) rather than plain text in the flow. ESLint flat config and GitHub Actions CI were also added.
- **0.5.0** – Removed the deprecated `request` module and its promise dependencies; all calls moved to `node-fetch`. Also fixed binary vs string `true`/`false` handling when calling the send node. Existing users need to force an upgrade.

The way messages go in and out of the nodes is unchanged, to keep compatibility with existing flows.

## Installation ##

In your Node-RED user directory, typically `~/.node-red`, run:

```
npm install node-red-contrib-sensibo
```

Then restart Node-RED, e.g.:

```
sudo systemctl restart nodered.service
```

## Support / Issues ##

Please log any issues, feature requests on Github.  All feedback is appreciated.  

## Development ##

Before publishing a new release, run:

```
npm run check
```

This runs both linting and the automated test suite. `npm publish` now also runs the same check automatically via `prepublishOnly`.

## Features ##

- Lookup of available pods via room name.
- User defined polling of temperature and humidity from cloud (min 60 seconds)
- Option to retrieve all device information
- Option to retrieve the current AC State
- API key stored as an encrypted Node-RED credential
- Clear error reporting on the node status and via `msg` / `done` when a request fails
- Example flows provided to show the various deployments.  Help pages also well populated.

## Device Information ##
While there are many common options each device type has additional supported options.  To find the full range of option you can configure the Sensibo mode to retrieve the full configuration in the msg.payload.  The examples provided has a nifty flow to show you the various modes you pod supports.  

Good stuff is here from a call to get config:  msg.result.remoteCapabilities.modes.heat.fanLevels

## Change Log / Roadmap ##
The nodes work very well so far and now updated there is no major roadmap ahead unless requested.  The changelog file has detailed information on the various releases


## Credits: ##

LukeGT
The latest version (0.5.0 onwards no longer uses any of the code from LukeGT due to the deprecation of his work this remains as a credit to the original work.  

