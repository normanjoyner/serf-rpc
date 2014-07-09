module.exports = {

    header: {
        "Command": null,
        "Seq": 0
    },

    handshake: {
        Version: 1
    },

    event: {
        Name: null,
        Payload: null,
        Coalesce: true
    },

    join: {
        Existing: [],
        Replay: false
    },
    
    "members-filtered" : {
        Tags: null,
        Status: null,
        Name: null
    },
    
    "force-leave" : {
        Node: null
    },
    
    auth : {
        Authkey: null
    },

    tags : {
        Tags: {}, Deletetags: []
    },

    stream : {
        Type: null
    },
    
    monitor : {
        LogLevel: null
    },
    
    stop : {
        Stop: null
    },
    
    query : {
        // FilterNodes: [],
        // FilterTags: {},
        // RequestAck: false,
        // Timeout: 0,
        Name: null,
        Payload: null
    },
    
    respond : {
        ID: null,
        Payload: null
    },
    
    "install-key" : {
        key: null
    },
    
    "use-key" : {
        key: null
    },
    
    "remove-key" : {
        key: null
    }
    
    // "list-keys" : {
    // },
    
    // stats : {
    //     Node: null
    // }
};
