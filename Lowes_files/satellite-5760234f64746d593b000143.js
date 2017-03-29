_satellite.pushBlockingScript(function(event, target, $variables){
  // Multi Page
$(window).load(function() {
  // Check if in app visitor
  if (document.cookie.indexOf('NativeAppSiteId') !== -1) return;

  var accountObj = {};
  var siteTypeObj = {};
  var productArray = [];

  var criteoInit = function() {
    //insert criteo script after to first document script tag
    DTMDataHelper.loadScript("//static.criteo.net/js/ld/ld.js", function() {});
    window.criteo_q = window.criteo_q || [];
    accountObj = { event: "setAccount", account: 19813 };
    siteTypeObj = { event: "setSiteType", type: (_satellite.getVar('siteId') === 'lowes:dt' ? 'd' : 'm') };
  };

  switch (_satellite.getVar('pageType')) {
    case 'hp':
    case 'home':
      //console.log('Criteo home');
      criteoInit();
      window.criteo_q.push(accountObj, siteTypeObj, { event: "viewHome" });
      break;
    case 'super-category':
    case 'category':
    case 'sub-category':
    case 'sub-sub-category':
      //console.log('Criteo category page');
      criteoInit();
      window.criteo_q.push(accountObj, siteTypeObj, { event: "viewList" });
      break;
    case 'product-list':
    case 'search-results':
    case 'hiddencatalog':
      //console.log('Criteo PLP');
      criteoInit();
      var topThree = [];
      for(key in digitalData.products){
        if(key > 2)
          continue;
        topThree.push(digitalData.products[key].ivm);
      }
      window.criteo_q.push(accountObj, siteTypeObj, { event: "viewList", item: topThree });
      break;
    case 'product-detail':
    case 'product-display':
      //console.log('Criteo PDP');
      criteoInit();
      window.criteo_q.push(accountObj, siteTypeObj, { event: "viewItem", item: _satellite.getVar('pdpProductIVM') });
      break;
      // Desktop Cart & Order Confirmation
    case 'order-confirmation':
      criteoInit();
      for (var i = 0; i <= (digitalData.products.length - 1); i++) {
        productArray.push({ id: digitalData.products[i].ivm[0], price: digitalData.products[i].productUnitPrice, quantity: digitalData.products[i].productQuantity });
      }
      window.criteo_q.push(accountObj, siteTypeObj,{ event: "trackTransaction", id: _satellite.getVar('orderId'),new_customer: "",deduplication:"",item: productArray });
      break;
      // MOW Cart & Order Confirmation
    case 'shopping-cart':
    case 'checkout':
      // Check to make sure we are in cart or order confirmation
      if (_satellite.getVar('siteSectionTwo') === 'shopping-cart' || _satellite.getVar('siteSectionTwo') === 'order-confirmation') {
        //console.log('Criteo Cart');
        criteoInit();
        for (var i = 0; i <= (digitalData.products.length - 1); i++) {
          productArray.push({ id: digitalData.products[i].ivm[0], price: digitalData.products[i].productUnitPrice, quantity: digitalData.products[i].productQuantity });
        }
        window.criteo_q.push(accountObj, siteTypeObj, { event: "viewBasket", item: productArray });
      }
      break;
    default:
      break;
  }
});

});
