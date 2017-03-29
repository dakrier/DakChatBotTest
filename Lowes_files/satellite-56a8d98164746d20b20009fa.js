_satellite.pushAsyncScript(function(event, target, $variables){
  (function() {

  $(document).on('atc.success', '.btn-add', function(event, data) {

    var $this = $(this);

    var productObj = [];
    // productObj.eVars = {};
    // productObj.events = {};
    // productObj.addCart.quantity = OK
    // productObj.addCart.price = OK
    // productObj.addCart.productId = event.currentTarget.data.productid

    // If the button clicked has an ancestor with product recommendations, substantiate a local products object.
    // Otherwise, determine if there is a product on the page and use ddo to create local object if available

    if ($this.parents('.js-recommend-product').length > 0) {
      productObj[0] = {};
    } else {
      if(typeof digitalData.products !== 'undefined'){
        try {
            if (digitalData.products.length === 1) {
              productObj = JSON.parse(JSON.stringify(digitalData.products));
            } else if (digitalData.products.length > 1) {
              var $grid3 = $this.parents('.grid_3');
              var $index = $grid3.index('.grid_3');
              productObj = [JSON.parse(JSON.stringify(digitalData.products[$index]))];
              digitalData.addCartObj = productObj;
            }
        } catch (e) {
            productObj[0] = {};
        }
      }else{
        //Mylowes
        $prev = $this.prevAll('input[name=productId]');
        var commerceId = $prev.attr('value');
        var price = $prev.data('productprice').toString();
        productObj[0] = {'ivm':[commerceId], 'sellingPrice':price, 'productId':[commerceId]};
        digitalData.addCartObj = productObj;
      }
    }

    DTMDataHelper.setGlobalLinkVars();
    s.linkTrackVars = s.apl(s.linkTrackVars, 'products,prop11', ',', 2);
    //clear evars, events for s.products
    productObj[0].eVars = {};
    productObj[0].events = {};

    // If add to cart button is located inline the add to cart modal
    if ($this.hasClass('js-add-to-cart')) {
      //Quantity will always be 1
      productObj.addCart = {quantity: 1 };

      // Define price for local object
      var price = '';

      if($this.hasClass('met-recommend-add')) {
          var recType = window.DTMDataHelper.recommendsType($this.parents('.js-recommend'));
          price = $this.data('productprice').toString();
          productObj[0].eVars.eVar42 = _satellite.getVar('pageType') + '_' + recType;
      } else {
          productObj[0].eVars.eVar42 = 'rtf-modal';

          price = $this.parent().prev();

          if (typeof price !== "undefined") {
            price = price.text().trim().replace('$', '');
          } else {
            price = "";
          }
      }

      productObj.addCart.price = productObj[0].price = price;

      // If button that launched event has product ID data attribute associated, set product ID from attributes
      /* DSD-26802: use older getAttribute() method for data attributes instead of HTM5 dataset, thx IE10

      if (event.currentTarget.dataset !== undefined && event.currentTarget.dataset.productid !== undefined) {
        productObj.addCart.productId = productObj[0].productId = [event.currentTarget.dataset.productid];
        productObj[0].ivm = [$this.parents('.js-recommend-product').data('ivm')];
      } */
      if (event.currentTarget.getAttribute('data-productid') !== undefined && event.currentTarget.getAttribute('data-productid') !== '') {
        productObj.addCart.productId = productObj[0].productId = [event.currentTarget.getAttribute('data-productid')];
        productObj[0].ivm = [$this.parents('.js-recommend-product').data('ivm')];
      }

    } else if (data.productId) {
      //Gift Cards
      productObj.addCart = {
        productId: data.productId
      };
      productObj.addCart.price = data.amount;
      productObj.addCart.quantity = data.quantity;
      productObj.addCart.giftCard = true;
    } else if(digitalData.page.siteSection === 'mylowes'){
      //MyLowes
      productObj.addCart = {'quantity':1};
      productObj.addCart.price = productObj[0].sellingPrice;
      productObj.addCart.productId = productObj[0].productId[0];
      productObj[0].eVars.eVar42 = 'mylowes-list';

    }else {
      //Product Detail Page
      var $prev = $this.prevAll('[name=productId]');
      productObj.addCart = {
        productId: ((typeof $prev !== "undefined") ? $prev.attr('value') : '')
      };
      productObj.addCart.price = ((typeof $prev !== "undefined") ? $prev.data('productprice').toString() : '');

      //Check for EPP
      var $epp = $('.epp-selection .active input');
      if ($epp.length > 0) {
        //Extended Protection Plan
        if (typeof data.quantity === 'object') {
          productObj.addCart.quantity = data.quantity.value * 2;
        } else {
          productObj.addCart.quantity = data.quantity * 2;
        }
        productObj.addCart.epp = data.epp;
        productObj[0].events.event20 = data.quantity;
        productObj[0].events.event21 = $epp.data('eppprice');

        s.linkTrackEvents = s.apl(s.linkTrackEvents, 'event20,event21', ',', 2);
        s.events = s.apl(s.events, 'event20,event21', ',', 2);

      } else {
        if (typeof data.quantity === 'object') {
          productObj.addCart.quantity = data.quantity.value;
        } else {
          productObj.addCart.quantity = data.quantity;
        }
      }
      productObj[0].eVars.eVar42 = _satellite.getVar('pageType');
    }

    productObj[0].events.event93 = productObj.addCart.quantity;
    if (productObj.addCart.price.substr(-2) === ".0") {
      productObj.addCart.price = productObj.addCart.price + "0";
    }
    productObj[0].events.event33 = productObj.addCart.price.replace(',', '');
    productObj[0].eVars.eVar19 = productObj.addCart.productId;
    //productObj[0].eVars.eVar28 = digitalData.profile.user.storeNumber;

    s.linkTrackEvents = s.apl(s.linkTrackEvents, 'scAdd,scOpen,event33,event93', ',', 2);
    s.events = s.apl(s.events, 'scAdd,scOpen,event33,event93', ',', 2);

    //Store IVM in Cookie for MOW Only to persist vendor number throughout checkout
    if (_satellite.getVar('siteId') === 'mobile' || _satellite.getVar('siteId') === 'lowes:mobile') {
      var ivm = '';
      if (productObj[0].ivm !== "undefined") {
        ivm =  productObj[0].ivm + ";"+ parseInt(productObj.addCart.quantity)+ ";"+ productObj[0].sellingPrice;
      }
      // store ivm in cookie
      var ivmData, ivmArray;
      if ($.cookie('ivm-data')) {
        ivmData = $.cookie('ivm-data');
        ivmArray = ivmData.split(',');
        ivmArray.push(ivm);
        $.cookie('ivm-data', null);
        $.cookie('ivm-data', ivmArray.toString(), { expires: 7, path: '/' });
      } else {
        ivmArray = [ivm];
        $.cookie('ivm-data', ivmArray.toString(), { expires: 7, path: '/' });
      }
    }

    s.products = window.DTMDataHelper.buildProductsString(productObj);
    var linkName = 'cart-add';
    s.prop11 = s.pageName + "|" + linkName;
    s.tl('true', 'o', linkName);
    digitalData.cache = {'ivm': productObj[0].ivm};
    _satellite.track('fb-cart-add');


  });

  $(document).on('atc.failure', '.btn-add', function(event, data) {

    DTMDataHelper.setGlobalLinkVars();
    var $this = $(this);
    var linkName = 'cart-add';

    s.linkTrackEvents = s.apl(s.linkTrackEvents, "event58", ",", 2);
    s.events = "event58";
    s.linkTrackVars = s.apl(s.linkTrackVars, "eVar54,list2", ",", 2);
    s.eVar54 = linkName;
    if(typeof data.xhr !== 'undefined'){
      var xhrResponse = (typeof data.xhr.responseJSON !== "undefined" && typeof data.xhr.responseJSON.errors !== "undefined" && data.xhr.responseJSON.errors.length > 0 ) ? data.xhr.responseJSON.errors[0] : 'no_value';
      s.list2 = linkName +"|"+ ((typeof xhrResponse !== "no_value") ? DTMDataHelper.cleanAnalyticsData(xhrResponse.errorCode) : 'error') +"|"+ ((typeof xhrResponse !== "no_value") ? DTMDataHelper.cleanAnalyticsData(xhrResponse.errorMessage) : 'error');
    }
    s.tl('true', 'o', linkName);


  });
  // if required-to-function module loads
  $(document).on('rtf-impression', '.js-recommend', function(event, data) {
    _satellite.track('product-recommendations');
  });
}());

});
