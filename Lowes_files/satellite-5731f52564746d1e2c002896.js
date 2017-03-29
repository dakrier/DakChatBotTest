_satellite.pushAsyncScript(function(event, target, $variables){
  digitalData.scrollDepth = 0;

function setScrollDepth(){
  // console.log(digitalData.scrollDepth);
  if(typeof digitalData.scrollDepth !== 'undefined'){
    var scroll = Math.floor((($(document).scrollTop()+$(window).outerHeight())/$(document).height())*100);
    
    if(scroll >= 100){
      if(!$('body.js-menu-open .nav-drawer-offpage').is( ":visible" )){
        digitalData.scrollDepth = "100";
        //clear interval
        clearInterval(digitalData.scrollDepthFunc);
      }
      
    }else if(digitalData.scrollDepth < scroll){
      digitalData.scrollDepth = (Math.floor(scroll)).toString();
    }
  }
}

digitalData.scrollDepthFunc = setInterval(function() {
     setScrollDepth(); 
}, 1000 );

$('body').on('click', function(event, data) {
  
  //Set scrollDepth to cookie
  if(typeof digitalData.scrollDepth !== 'undefined'){
    var z = {};
    var append = _satellite.readCookie('clickTracking');
    var viewportPercent = Math.round(($(window).outerHeight()/$(document).height())*100);
    var pageHeight = $(document).height();
    
    if (typeof(append) !== 'undefined') {
      z=JSON.parse(decodeURIComponent(append));
    }
    
    var scrollDifference = digitalData.scrollDepth-viewportPercent;
    
    z.prop9 = viewportPercent+'|'+digitalData.scrollDepth+'|'+(scrollDifference < 0 ? 0 : scrollDifference)+'|'+pageHeight;
    DTMDataHelper.delayClickTracking.set(z);  
  }
  setScrollDepth();
  
});
});
