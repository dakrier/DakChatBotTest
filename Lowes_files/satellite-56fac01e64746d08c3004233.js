_satellite.pushBlockingScript(function(event, target, $variables){
  $('.js-predictive-input').on('keyup', function(event){
  var e = event;
	var c = true;
	switch(e.which) {
  	case 13: // enter
  	case 38: // up
  	case 40: // down
    	c = false;
    	break;

  	default: 
    	break;
	}
	if(c === true){
		digitalData.search.typedTerm = $(this).val();
	}
});
});
