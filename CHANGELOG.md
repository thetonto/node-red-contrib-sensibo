**V 0.1.0**

Initial release with basic functionality to and from the cloud.

**V 0.1.1**

Added support for msg.targetTemperature

**V 0.2.0**

Support for retreiving full device informationn so you can see all available functions on the pod.  

**V 0.3.0**

- Updated the pod selection system to be similar the serial node with refresh button.  This also makes initial setup after entering the API key easier to use.
- Node V1 compliant with send msg and done

**V 0.3.2**
- New testing scripts created using Node Red Helper Script
- Minor bug fixes found from the testing scripts
- Linting of code and various clean ups based off that

**V 0.3.3**
- Linting introduced a type error on the patch function.  Function worked but would report an error

**V 0.4.0**
- Scrapped as went very totally wrong
  
**V 0.5.0**
- Removed the deprecated requests and promises library.  requests has been replaced by node-fetch which is very light weight and seems to have worked well.
- Code has been heavily refactored to accomodate node-fetch and also make the code easier to read/maintain.  

**V 0.5.1**
- Fixed the testing suite and added on/off testing in binary.

**V 0.5.2**
- Get config was not returning all fields.  Query string was missing after migration to node-fetch

**V 0.6.0**
- New feature which allows for getting of the AC State Only 
- Improved the send function with fields 
- Fixed potential issue where TargetTemp is sent as a string.  Now converted to in to prevent failure
- Examples now provided to show the different functions