var _ = require("lodash");
var Network = require([__dirname, "network"].join("/"));
var schemas = require([__dirname, "schema"].join("/"));

var rpc = {

    seq: 0,

    network: null,

    connect: function(options, fn){
        rpc.network = new Network(options);
        rpc.network.connect(function(err){
            if(err)
                return fn(err);
            else{
                rpc.handshake(function(err){
                    return fn(err);
                });
            }
        });
    },

    send: function(command, body, fn){
        var header_schema = schemas.header;
        var command_schema = schemas[command];
        var data = [];

        data.push(_.defaults({
            "Command": command,
            "Seq": rpc.seq
        }, header_schema));

        if(!_.isFunction(body))
            data.push(_.defaults(body, command_schema));
        else
            fn = body;

        this.seq++;
        rpc.network.send(data, fn);
    },

    commands: [
        "event",
        "join",
        "leave",
        "members"
    ],

    handshake: function(fn){
        rpc.send("handshake", {}, function(err, response){
            return fn(err);
        });
    }
}

module.exports = rpc;
