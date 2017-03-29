_satellite.pushBlockingScript(function(event, target, $variables){
  var pageType = digitalData.page.pageType, 
    pageURL = encodeURIComponent(location.href),
    timeStamp = Date.now(),
	src="https://track.eyeviewads.com/conv/6c13beaf/9e0fcf49.gif?page="+pageType+"&url="+pageURL+"&time="+timeStamp;

var imgPixel = '<img src="'+src+'" width="1" height="1" style="display: none;">';

DTMDataHelper.addTag(imgPixel, 'body');
});
