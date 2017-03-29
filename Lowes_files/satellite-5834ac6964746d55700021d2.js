_satellite.pushBlockingScript(function(event, target, $variables){
  var mboxes = document.querySelectorAll('.dtmmboxtarget .mbox-target');

for (i = 0; i < mboxes.length; i++) {
  	var mboxDiv = mboxes[i],
        mboxName = mboxDiv.getAttribute('data-dtm-name') || false;

    DTMDataHelper.fireTargetMbox(mboxDiv, mboxName);
}
});
