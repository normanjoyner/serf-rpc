var net = require('net').Socket();
var events = require('events');
var _ = require("lodash");
var msgpack = require([__dirname, "msgpack"].join("/"));
//var msgpack = require("msgpack-js-v5-ng");

function Network(options, fn){
    this.options = options;
}

Network.prototype.connect = function(){
    var serve;
    var self = this;
    net.connect(this.options.rpc_port, this.options.rpc_host);

    net.on("data", function(data){
        var decoded = msgpack.decode(data);
        self.emitter.emit(decoded.seq, _.last(decoded.values));
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
