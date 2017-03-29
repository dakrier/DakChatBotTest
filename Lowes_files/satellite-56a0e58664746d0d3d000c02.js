_satellite.pushBlockingScript(function(event, target, $variables){
  /*window._lrc = window._lrc || [];
window._lrc.push(['aw_lrid', '401516']);
window._lrc.push(['ds_lrid',!'401526']);
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript';
ga.src = '//cdn.rlcdn.com/js/ga.js?' + new Date().getTime();
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();*/
var cookieId = $.cookie('s_vi');

if(cookieId) {
	var cookieIdCleaned = cookieId.replace("[CS]v1|", "").replace("[CE]", ""),
      src = '<img src="//idsync.rlcdn.com/423876.gif?partner_uid=' + cookieIdCleaned + '" width="1" height="1" alt="" style="display:none;" />';
	
  DTMDataHelper.addTag(src, 'body');
}
});
