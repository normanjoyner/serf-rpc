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

There are two more convenience functions, `listen` and `log`, easing the use of
stream and monitor.

#### serf.listen(eventName, onEvent[, onSubscribe])
* `eventName` \<String\> name of event, e.g. "member-join". May be comma-separated list.
* `onEvent` \<Function\> handler. Passed the event data object and a "stop" function to call
to stop listening.
* `onSubscribe` \<Function\> optional, with the signature `(err, stopFn)`. Called after
subscribing to handle errors when subscribing, and to provide the stop function so that
it may be accessed prior to the first event invocation. If omitted, `listen` will throw
if an error arises when subscribing.

The `stopFn` is the same in both callbacks. It may optionally be called with a callback.

```js
var memberJoinStopFn;
serf.listen("member-join,member-update", (data, stopFn) => {
    console.log("members joined or updated", data);
}, (err, stopFn) => {
    if (err) return console.log("Error subscribing to event", err);
    memberJoinStopFn = stopFn;
});

// Stop listening after 5 seconds.
setTimeout(() => {
    // Test if function is defined in case it takes a long time to subscribe.
    if (memberJoinStopFn) {
        memberJoinStopFn(function () { serf.disconnect(); });
    } else serf.disconnect();
}, 5000);

// -Or-

try {
    serf.listen("member-join", (data, stopFn) => { /* ... */ });
} catch (e) {
    console.log("Error subscribing to event", e);
}
```

#### serf.disconnect()
Disconnects from the serf agent. If this is not called, then node.js will not exit because
the underlying socket will remain open. That is to say, you must call this to close the
underlying socket so that node.js may gracefully exit.

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
        
        console.log("Triggered the event!");
    });
});

serf.listen("user", function(data, stop) {
	console.log('listen event!!', data);
	// stop(); // call this to stop listening
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
