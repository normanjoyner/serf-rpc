var net = require('net').Socket();
var events = require('events');
var _ = require("lodash");
var msgpack = require([__dirname, "msgpack"].join("/"));

function Network(options, fn){
    this.options = options;
}

Network.prototype.connect = function(fn){
    var serve;
    var self = this;

    net.connect(this.options.rpc_port, this.options.rpc_host, function(){
        net.on("data", function(data){
            var decoded = msgpack.decode(data);
            self.emitter.emit(decoded.seq, _.last(decoded.values));
        });
        fn();
    });

    net.on("error", function(){
        var address = [self.options.rpc_host,self.options.rpc_port].join(":");
        fn(new Error(["Could not connect to Serf RPC at", address].join(" ")));
    });
}

Network.prototype.emitter = new events.EventEmitter();

Network.prototype.send = function(data_list, fn){
    var self = this;

    _.each(data_list, function(data){
        net.write(msgpack.encode(data));

        if(_.has(data, "Seq")){
            self.emitter.once(data.Seq, function(response){
                var err = false;
                if(_.has(response, "Error") && response.Error != "")
                    err = true;

                fn(err, response);
            });
        }
    });

}

Network.prototype.conn_track = {};

module.exports = Network;
