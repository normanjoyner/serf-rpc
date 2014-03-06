var _ = require("lodash");
var msgpack = require("msgpack-js-v5-ng");

exports.decode = function(data){
    var values = [];
    var cache = new Buffer(0);
    var head, trailing, value, decoded;
    while(data.length > 0) {
        head = data.slice(0, 1);
        data = data.slice(1, data.length);
        cache = Buffer.concat([cache, head]);

        try{
            decoded = msgpack.decode(cache);
        } catch(err){}

        if(decoded.trailing == 0){
            values.push(decoded.value);
            cache = new Buffer(0);
        }
    }

    if(values.length == 1)
        var seq = decoded.value.Seq;
    else
        var seq = _.first(values).Seq

    return {
        seq: seq,
        values: values
    }
}

exports.encode = function(data){
    return msgpack.encode(data);
}
