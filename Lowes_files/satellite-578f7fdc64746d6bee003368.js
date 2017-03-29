_satellite.pushBlockingScript(function(event, target, $variables){
  var $$FSR = {
   'timestamp': 'August 30, 2016 @ 12:26 PM',
   'version': '16.3.0.8',
   'build': '6',
   'enabled': true,
   'frames' : false,
   'sessionreplay': true,
   'auto' : true,
   'encode' : true,
   'files': '/etc/clientlibs/lowes-mobile-first/foresee/',
   'js_files': '/etc/clientlibs/lowes-mobile-first/foresee/js/', 
   'image_files': '/etc/clientlibs/lowes-mobile-first/foresee/img/',
   'html_files': '/etc/clientlibs/lowes-mobile-first/foresee/html/',
   'css_files': '/etc/clientlibs/lowes-mobile-first/foresee/css/',
   // needs to be set when foresee-transport.swf is not located at 'files'
   //'swf_files': '__swf_files_'
   'id': 'ooHPEq6j8lMgGxndybifdA==',
   'definition': 'foresee-surveydef.js',
   'swf' : {fileName:'foresee-transport.swf', scriptAccess:'always'},
   'worker' : 'foresee-worker.js',
   'embedded': false,
   'replay_id': 'lowes.com',
   'attach': false,
   'renderer':'W3C',	// or "ASRECORDED"
   'layout':'CENTERFIXED',	// or "LEFTFIXED" or "LEFTSTRETCH" or "CENTERSTRETCH"
   'triggerDelay': undefined,
   'heartbeat' : true,
   'enableAMD': false, // set true if client wants to use AMD module loading
   'pools' : [
      {
         path: '.',
         sp: 20  // CHANGE ONLY WHEN INCLUDING SESSION REPLAY
      }
   ],
   'sites': [
      {
         path: /\w+-?\w+\.(com|org|edu|gov|net|co\.uk)/
      },
      {
         path: '.',
         domain: 'default'
      }
   ],
   storageOption: 'cookie',
   nameBackup:window.name
};

var FSRCONFIG = {};

// -------------------------------- DO NOT MODIFY ANYTHING BETWEEN THE DASHED LINES --------------------------------
(function(a,c,f){for(var c=a.sites,b=0,g=c.length;b<g;b++){var d;"[object Array]"!==Object.prototype.toString.call(c[b].path)&&(c[b].path=[c[b].path]);for(var e=0,h=c[b].path.length;e<h;e++)if(d=f.location.href.toLowerCase().match(c[b].path[e])){a.siteid=b;a.site=a.sites[b];a.site.domain?"default"==a.site.domain&&(a.site.domain=null):a.site.domain=d[0];a.site.secure||(a.site.secure=null);a.site.name||(a.site.name=d[0]);break}if(d)break}f.cookie="fsr.a"+(a.site.cookie?"."+a.site.cookie:"")+"=suspended;path=/"+
(a.site.domain?";domain="+a.site.domain+";":";")+(a.site.secure?"secure":"")})($$FSR,window,window.document);
});
