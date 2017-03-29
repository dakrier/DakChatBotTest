var mboxTrack = function(mboxName, mboxParams) {
    if(mboxName) {
        var params = {};

        for (var i = 1, j = arguments.length; i < j; i++){
            var argument = arguments[i],
                param = argument.split('=');

            if(param.length >= 2) {
                params[param[0]] = param[1];
            }
        }

        adobe.target.trackEvent({
            "mbox": mboxName,
            "params": params,
            "success": function() {
                // Do Nothing
            },
            "error": function(e) {
                console.log(e);
            }
        });
    }
}
