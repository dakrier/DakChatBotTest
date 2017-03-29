_satellite.pushBlockingScript(function(event, target, $variables){
  ;(function(dd, ddh) {
    var params = [],
        productIds = [],
        url = "//googleads.g.doubleclick.net/pagead/viewthroughconversion/1031919983/?value=0&amp;guid=ON&amp;script=0&";

    if ('products' in dd) {
        for (x in dd.products) {
            productIds.push(dd.products[x].productId[0]);
        }
        if (productIds.length > 0) {
            params.push('data.ecomm_prodid=' + productIds.join(','));
        }
    }

    //if you are on the product detail page (desktop/mow), the shopping cart page (desktop)
    switch(dd.page.pageType) {
        case 'product-display':
            params.push('data.ecomm_pagetype=product');
        break;

        case 'shopping-cart':
            params.push('data.ecomm_pagetype=cart');
        break;
    }

    ddh.addTag('<img src=' + url + params.join('&') + ' style="display:none;" width="1" height="1" />', 'body');
})(window.digitalData, window.DTMDataHelper);
});
