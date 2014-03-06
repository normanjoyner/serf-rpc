serf-rpc
====================

##About

###Description
A simple nodejs module for interacting with the Serf RPC protocol.

###Author
Norman Joyner - norman.joyner@gmail.com

##Getting Started

###Installation
```npm install serf-rpc```

###Configuration
Simply require the serf-rpc module, instantiate a new Serf object, and call the ```.connect()``` method to start interacting with Serf's RPC protocol.

An optional object can be passed to the ```.connect([OPTIONS], fn)``` method to configure the RPC address. If ommitted, serf-rpc defaults to 127.0.0.1:7373. The object can be configured as follows:
```javascript

var options = {
    rpc_host: "127.0.0.1",
    rpc_port: 7070
}

serf.connect(options, function(){
    // interact with the RPC protocol
});
```

###Supported Operations
* event
* leave
* members

###Examples
Example using the default RPC address, triggering a custom user event:
```javascript
var SerfRPC = require("serf-rpc");
var serf = new SerfRPC();

serf.connect(function(){
    serf.event({"Name": "deploy": "Payload": "4f33de567283e4a456539b8dc493ae8a853a93f6", "Coalesece": false}, function(err, response){
        if(err)
            throw err;
        else
            console.log("Triggered the event!");
    });
})
```
