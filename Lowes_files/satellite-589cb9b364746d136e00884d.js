_satellite.pushBlockingScript(function(event, target, $variables){
  (function(dd, DTMDataHelper) {
    if(!dd || !DTMDataHelper) return false;

    var mboxName = 'lwscom_global',
        mboxDiv = $('#' + mboxName),
        params = {
            'pageType': dd.page.pageType,
            'siteSection': dd.page.siteSection,
            'siteSectionTwo': dd.page.siteSectionTwo,
            'siteSectionThree': dd.page.siteSectionThree,
            'siteSectionFour': dd.page.siteSectionFour
        };
 
    DTMDataHelper.fireTargetMbox(mboxDiv, mboxName, params);
})(window.digitalData, window.DTMDataHelper);
});
