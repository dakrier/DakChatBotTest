_satellite.pushAsyncScript(function(event, target, $variables){
  (function(){
  var r = '';
	for (w_m in window)
  	if (w_m.substring(0, 4) == 's_i_' && window[w_m].src)
    	if (window[w_m].src.indexOf('/b/ss/') >= 0)
      	r += window[w_m].src;
	var sc_length = r.length;
	_satellite.setCookie("sc_length", sc_length);
})();
});
