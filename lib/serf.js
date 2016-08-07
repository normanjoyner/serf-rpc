var _ = require("lodash");
var rpc = require([__dirname, "rpc"].join("/"));

exports.initialize = function(){
    var serf = {};
    serf.options = {};

    serf.connect = function(options, fn){
        if(_.isFunction(options)){
            fn = options;
            options = {};
        }
        serf.options = _.defaults(options, {
            rpc_host: "127.0.0.1",
            rpc_port: "7373"
        });
        rpc.connect(serf.options, fn);
        serf.events = rpc.network.emitter;
    };

    _.each(rpc.commands, function(command){
        serf[command] = function(body, fn){
            rpc.send(command, body, fn);
        };
    });

    serf.listen = function(type, onEvent, onSubscribe){
        serf.stream({ Type: type }, function(err, res){
            if(err) {
                if (typeof onSubscribe === "function") return onSubscribe(err);
                throw err;
            }

            function stopFn(cb) {
                if (typeof cb !== "function") cb = function () {};
                serf.stop({ Stop: res.Seq }, cb);
            }

            serf.events.on(res.Seq, function(data){
                onEvent(data, stopFn);
            });

            if (typeof onSubscribe === "function") onSubscribe(null, stopFn);
        });
    };

    serf.log = function(level, listener){
        serf.monitor({ LogLevel: level }, function(err, res){
            if(err)
                throw err;
            else{
                serf.events.on(res.Seq, function(data) {
                    listener(data, function(){
                        serf.stop({ Stop: res.Seq });
                    });
                });
            }
        });
    };

    return serf;
};
