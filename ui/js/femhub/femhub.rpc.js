
FEMhub.RPC = {};

FEMhub.RPC.ajax = function(config) {
    config = config || {};

    if (Ext.isDefined(config.data)) {
        config.jsonData = config.data;
    }

    Ext.Ajax.request(config);
};

FEMhub.RPC.init = function(ready, scope) {
    FEMhub.RPC.ajax({
        url: FEMhub.client,
        method: "POST",
        data: Ext.encode({
            jsonrpc: "2.0",
            method: "system.describe",
            params: {},
            id: 0,
        }),
        success: function(result, evt) {
            var response = Ext.decode(result.responseText);

            Ext.each(response.result.procs, function(proc) {
                var items = proc.name.split(".");
                var namespace = FEMhub;

                Ext.each(items, function(item, i) {
                    if (i == items.length - 1) {
                        if (!Ext.isDefined(namespace[item])) {
                            namespace[item] = function(params, handler, handler_scope) {
                                return FEMhub.RPC.call(proc.name, params, handler, handler_scope);
                            };
                        } else {
                            FEMhub.log("'" + item + "' method name already in use");
                        }
                    } else {
                        if (!Ext.isDefined(namespace[item])) {
                            namespace = namespace[item] = {};
                        } else {
                            namespace = namespace[item];
                        }
                    }
                });
            });

            ready.call(scope || this);
        },
        failure: FEMhub.RPC.failure,
    });
};

FEMhub.RPC.call = function(method, params, handler, scope, url) {
    FEMhub.RPC.ajax({
        url: url || FEMhub.client,
        method: "POST",
        data: Ext.encode({
            jsonrpc: "2.0",
            method: method,
            params: params || {},
            id: 0,
        }),
        success: function(result, evt) {
            if (Ext.isDefined(handler)) {
                handler.call(scope || this, Ext.decode(result.responseText).result);
            }
        },
        failure: FEMhub.RPC.failure,
    });
};

FEMhub.RPC.failure = function(result, request) {
    var msg;

    if (!Ext.isDefined(result.responseText) || result.status >= 500) {
        if (result.status > 0) {
            msg = String.format("{0}: {1}", result.status, result.statusText);
        } else {
            msg = result.statusText; // e.g. "communication failed"
        }

        if (FEMhub.verbose) {
            FEMhub.msg.error("Critical Error", msg);
        } else {
            FEMhub.log(msg);
        }
    } else {
        var response = Ext.decode(result.responseText);

        if (response.error) {
            msg = String.format("{0}: {1}", response.error.code, response.error.message);
        } else {
            msg = result.statusText;
        }

        FEMhub.msg.error("System Error", msg);
    }
};

FEMhub.RPC.Engine = {};

FEMhub.RPC.Engine.init = function(params, handler, scope) {
    FEMhub.RPC.call('init', params, handler, scope, FEMhub.async);
};

FEMhub.RPC.Engine.kill = function(params, handler, scope) {
    FEMhub.RPC.call('kill', params, handler, scope, FEMhub.async);
};

FEMhub.RPC.Engine.stat = function(params, handler, scope) {
    FEMhub.RPC.call('stat', params, handler, scope, FEMhub.async);
};

FEMhub.RPC.Engine.complete = function(params, handler, scope) {
    FEMhub.RPC.call('complete', params, handler, scope, FEMhub.async);
};

FEMhub.RPC.Engine.evaluate = function(params, handler, scope) {
    FEMhub.RPC.call('evaluate', params, handler, scope, FEMhub.async);
};

FEMhub.RPC.Engine.interrupt = function(params, handler, scope) {
    FEMhub.RPC.call('interrupt', params, handler, scope, FEMhub.async);
};

