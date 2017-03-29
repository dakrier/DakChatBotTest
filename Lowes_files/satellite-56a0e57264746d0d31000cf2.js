_satellite.pushAsyncScript(function(event, target, $variables){
  /* All Pages 
p = current URL 
r = referring URL if available; variable set to blank if not available 
pid = Lowe's Chango ID 
uid = Lowe's user ID if available, variable set to blank if user is not logged in 
pt = Page Type

Product Display Page:
productId = Product ID
sku = item number
na = product name
sp = Selling price
op = Original (was) price
pc = Product Category

Shopping Cart:
quantity = number of products in cart
prodId = Array of all product IDs  */

// All pages
var pid = '1739',
    currentURL = escape(document.location.href),
    referrerURL = escape(document.referrer) || '',
    uid = (window.digitalData.profile.user.Details.id !== undefined && window.digitalData.profile.user.Details.id !== '') ? window.digitalData.profile.user.Details.id : '',
    pageType = window.digitalData.page.pageType,
    up = window.digitalData.profile.visitorStatus,
    quantity = '',
    productId = '',
    sku = '',
    na = '',
    sp = '',
    op = '',
    prodId = [],
    cd_value = [],
    pageTypeArray = ['super-category', 'category', 'product-list', 'product-display'];
    siteSection = window.digitalData.page.siteSection,
    productQuantity = '',
    catid = ($.inArray(pageType, pageTypeArray) > -1) ? '&__catid='+DTMDataHelper.cleanAnalyticsData(siteSection) : '',
    pc = ($.inArray(pageType, pageTypeArray) > -1) ? '&__pc='+DTMDataHelper.cleanAnalyticsData(siteSection) : '',
    ivm = '';

// Product Display Page
if (pageType === 'product-display') {
    sku = '&__sku='+digitalData.products[0].productId[0];
    na = digitalData.products[0].productName;
    sp = digitalData.products[0].sellingPrice;
    op = digitalData.products[0].wasPrice ? digitalData.products[0].wasPrice : '';
    ivm = '&__prodId='+digitalData.products[0].ivm;
}
if($.inArray(pageType, pageTypeArray) > -1) {
    if(window.digitalData.page.siteSectionTwo) {
        pc = pc + '>' +DTMDataHelper.cleanAnalyticsData(window.digitalData.page.siteSectionTwo);
    }
    if(window.digitalData.page.siteSectionThree) {
        pc = pc + '>' +DTMDataHelper.cleanAnalyticsData(window.digitalData.page.siteSectionThree);
    }
}

// Cart Only
if (window.digitalData.cart !== undefined && window.digitalData.cart !== '') {
    var cart = {},
        cartString = '';
        cart.products = {};
        cart.finalPrice = '',
        productQuantity = 0;
        
    quantity = window.digitalData.products.length;
    if(_satellite.getVar('totalPromotionCodes').length > 0){
        cd_value = _satellite.getVar('totalPromotionCodes').join(',');
    }

    for (var i = quantity - 1; i >= 0; i--) {
        prodId.push(window.digitalData.products[i].productId);
        productQuantity = productQuantity + parseInt(digitalData.products[i].productQuantity);
    }
}

var imgSrc = 'https://cc.chango.com/c/o?pt=' + pageType + '&p=' + currentURL + sku + ivm + '&sp=' + sp + '&pid=1739&__cd='+cd_value +pc+catid+'&r='+referrerURL+'&puid2='+uid+'&na=' + na + '&__quantity='+productQuantity+'&__crt='+prodId.join(',')+'&op='+op,
    imgPixel = '<img width="1" height="1" src="'+imgSrc+'" style="display: none;" />';

DTMDataHelper.addTag(imgPixel, 'body');
});
