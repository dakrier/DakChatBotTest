_satellite.pushBlockingScript(function(event, target, $variables){
  /*
    Conditions:
    - All Pages

    Sequential Javascript:
*/
(function($, digitalData, DTMDataHelper) {
  	$(document).on('mboxes.success', function() {
        var mboxes = [],
            tntvals = [],
            recs = [],
            debug = window.location.search.indexOf('debug=1') >= 0 || window.location.search.indexOf('mboxHighlight=1') >= 0 ? true : false;

        for(var mboxName in digitalData.mboxes) {
            var mbox = digitalData.mboxes[mboxName],
                mboxDiv = $('.at-element-marker.mbox-name-'+mboxName+', .at-element-marker#'+mboxName);

            if (mboxDiv.find('.js-recommend').length && mboxDiv.find('.js-recommend-product').length) {
                // Recommendations Mbox
                var recProductsDiv = mboxDiv.find('.js-recommend-product'),
                    recType = window.DTMDataHelper.recommendsType(mboxDiv.find('.js-recommend'));

                recProductsDiv.each(function(index, item) {
                    var recProduct = $(item);
                    recs.push(recProduct.data('productid') + ':' + (index + 1) + ':' + recType);
                });
            }

            /* Add Debug/mboxHighlight Container */
            if(debug) {
                if(mboxDiv.length) {
                    // Display Mbox (Yes Container)
                    mboxDiv.show();
                    mboxDiv.css('border', '2px solid red');
                } else {
                    // Non-Display Mbox or Global Mbox (No Container)
                    mboxDiv = $('body');
                }

                if(!mboxDiv.find('.dtm-highlight[data-mbox-name="' + mboxName + '"]').length) {
                    mboxDiv.prepend('<div class="panel-module panel-brand dtm-highlight" data-mbox-name="' + mboxName + '"><div class="panel-heading"><h4 class="panel-title">'+mboxName+'</h4></div><div class="panel-body"><p><b>Activity:</b> <span data-mbox-field="campaignName">None</span></p><p><b>Experience:</b> <span data-mbox-field="experienceName">None</span></p><p><b>TNT:</b> <span data-mbox-field="tntValue">None</span></p></div></div>');
                }
            }

            if(mbox.offers.length > 0) {
                for (var i in mbox.offers) {
                    var offer = mbox.offers[i];

                    if(debug) {
                        mboxDiv.find('.dtm-highlight[data-mbox-name="' + mboxName + '"] span[data-mbox-field]').each(function() {
                            var field = $(this).data('mbox-field');

                            if(field in offer && offer[field] != '' && offer[field] != '::') $(this).text(offer[field]);
                        });
                    }

                    if(offer.tntValue != '' && offer.tntValue != '::') tntvals.push(offer.tntValue);
                }
            }

            mboxes.push(mboxName);
        }

        // Grab s_tnt from URL
        var s_tnt = _satellite.getVar('s_tnt');

        if(s_tnt) tntvals.push(s_tnt);

        // Clear Global Vars
        DTMDataHelper.setGlobalLinkVars();
        var s = window.s;
        s.events = '';
        s.products = '';

        // Set for Non-PDP Page
        if (digitalData.page.pageType !== 'product-display') {
            s.events = s.apl(s.events, 'event71', ',');
            DTMDataHelper.productMerch();
        } else {
            s.products = ';' + _satellite.getVar('pdpProductIVM') + ';;;;eVar19=' + _satellite.getVar('pdpProductID');
        }

        if(recs.length > 0) {
            // Recommendations Present
            s.linkTrackVars = s.apl(s.linkTrackVars, 'products,list3,tnt,eVar56', ',', 2);
            s.linkTrackEvents = s.apl(s.linkTrackEvents, 'event55', ',', 2);
            s.events = s.apl(s.events, 'event55', ',', 2);
            s.eVar56 = mboxes.join(',');
            s.tnt = tntvals.join(',');
            s.list3 = recs.join(',');
            s.tl(true, 'o', 'ajax_mbox_impression');
        } else {
            // No Recommendations Present
            s.linkTrackVars = s.apl(s.linkTrackVars, 'products,tnt,eVar56', ',', 2);
            s.eVar56 = mboxes.join(',');
            s.tnt = tntvals.join(',');
            s.tl(true, 'o', 'ajax_mbox_load');
        }
    });

})(jQuery, window.digitalData, window.DTMDataHelper);

});
