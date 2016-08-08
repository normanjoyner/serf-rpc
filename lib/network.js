var net = require('net');
var events = require('events');
var _ = require("lodash");
var msgpack = require([__dirname, "msgpack"].join("/"));

function Network(options, fn){
    this.options = options;
    this.socket = new net.Socket();
    this.emitter = new events.EventEmitter();
}

Network.prototype.connect = function(fn){
    var serve;
    var self = this;
    
    this.socket.on("data", function(data){
        var decoded = msgpack.decode(data);
        _.each(decoded, function(values, seq){
            self.emitter.emit(seq, _.last(values));
        });
    });

    this.socket.connect(this.options.rpc_port, this.options.rpc_host, fn);
};

Network.prototype.send = function(data_list, fn){
    var self = this;

    _.each(data_list, function(data){
        self.socket.write(msgpack.encode(data));

        if(_.has(data, "Seq")){
            self.emitter.once(data.Seq, function(response){
                var err = false;
                if(_.has(response, "Error") && response.Error != "")
                    err = true;

                fn(err, response);
            });
        }
    });
};

Network.prototype.conn_track = {};

module.exports = Network;

