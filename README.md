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

###Prerequisites
First run a serf agent as described in the serf
[docs](http://www.serfdom.io/docs/agent/options.html).


###Configuration
Simply require the serf-rpc module, instantiate a new Serf object, and call the ```.connect()``` method to start interacting with Serf's RPC protocol.

An optional object can be passed to the ```.connect([OPTIONS], fn)``` method to configure the RPC address. If ommitted, serf-rpc defaults to 127.0.0.1:7373. The object can be configured as follows:
```javascript

var options = {
    rpc_host: "127.0.0.1",
    rpc_port: 7070
}

serf.connect(options, function(err){
    // interact with the RPC protocol
});
```

All operations listed in the [Serf RPC docs](https://www.serf.io/docs/agent/rpc.html)
are supported, but not all are rigorously tested yet. Methods with dashes in their names
can either be called using bracket notation (e.g. `serf['members-filtered']`) or using
their camel-cased aliases (e.g.`serf.membersFiltered(...)`).

For specific details about these operations, consult the
[official Serf RPC docs](http://www.serfdom.io/docs/agent/rpc.html).

There are two more convenience functions, listen and log, easing the use of
stream and monitor.

###Examples
Example using the default RPC address, triggering a custom user event:
```javascript
var SerfRPC = require("serf-rpc");
var serf = new SerfRPC();

serf.connect(function(err){
    if(err)
        throw err;

    serf.event({"Name": "deploy", "Payload": "4f33de567283e4a456539b8dc493ae8a853a93f6", "Coalesce": false}, function(err, response){
        if(err)
            throw err;
        else
            console.log("Triggered the event!");
    });
});

serf.listen("user", function(data, stop) {
	console.log('listen event!!', data);
	// serf.stop();
	// serf.leave(function(data) { console.log('leaving', data); });
});

serf.listen("query", function(data, stop) {
	console.log('query event!!', data);
	serf.respond({ ID: data.ID, Payload: "my response" }, function(err, data) {
		if(err)
			console.log("Error", err);
		else
			console.log("Response...\n", data);

	});
});
```
