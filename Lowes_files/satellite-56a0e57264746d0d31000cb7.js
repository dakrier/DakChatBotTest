_satellite.pushBlockingScript(function(event, target, $variables){
  (function() {
  // Do we need this > window.digitalData = window.digitalData || {};
  // GLOBAL.JS
  window.DTMDataHelper = {
    tracked: false,
    current_url: location.href,
    /**
     * Used to separate the path into: path, query parameters and hash values
     * @param  {string} path [string for url needed to be separated]
     * @return {array} h [returns the path, query parameters and hash values separated in an array]
     */
    cleanUrl: function(path) {
      var h = path.split(/[\?,\#]/);
      return h;
    },
    /**
     * Used to determine if displayed page is in the path varialbe of myArr. Mostly used for 3rd party tags
     * @param  {array} myArr [Array of objects that contain the path name along with other parameters required for the tag]
     * @return {object} myReturn  [returns the object which matches the index of the matched path]
     */
    isTracked: function(myArr) {

      var myReturn = [];

      for (var i = 0; i < myArr.length; i++) {
        var decoded_url = decodeURIComponent(location.pathname + location.search + location.hash);
        var decoded_path = decodeURIComponent(myArr[i].path);
        url = this.cleanUrl(decoded_url);
        path = this.cleanUrl(decoded_path);

        if (url.length >= 1) {
          //Itterate through all hashes and query parameters
          for (var j = 1; j < url.length; j++) {
            if (j in url) {
              if (url[j].indexOf(path[j])) {
                continue;
              }
            }
          }
          //check the path only
          if (url[0] === path[0]) {
            myReturn.push(myArr[i]);
          }

        }
      }
      return (myReturn.length > 0 ? myReturn : false);
    },
    /**
     * Used to add an element to the page. Mostly used for 3rd party tags
     * @param  {string} myString [String to append to element]
     * @param  {string} target [Target to apply the element to. Usually 'body']
     */
    addTag: function(myString, target) {
      $(myString).appendTo(target);
    },
    /**
     * Used to add an script to the page, has exception for IE
     * @param  {string} scriptPath [Script url to append to element]
     * @param:optional  {string} callback [name of function to callback after script is loaded on page]
     */
    loadScript: function(scriptPath, callback) {
      var script = document.createElement('script');
      script.src = scriptPath;
      script.async = true;
      script.type = "text/javascript";
      if (script.readyState) { //IE
        //console.log("Loading script in IE.");
        script.onreadystatechange = function() {
          if (script.readyState === "loaded" ||
            script.readyState === "complete") {
            script.onreadystatechange = null;
            //console.log("Doing callback in IE");
            callback();
          }
        };
      } else { //Others
        //console.log("Loading script in non-IE.");
        script.onload = function() {
          //console.log("Doing call back in non-IE");
          callback();
        };
      }
      document.getElementsByTagName('head')[0].appendChild(script);
    },
    /**
     * Used to build the s.products string.
     * @param  {object} productsObj [Object which contains all information needed to build proper s.products string. Format based on digitalData.products.]
     * @param  {array} excludeArr [Array of objects that you want to explicitly exclude]
     * @return {string} productString  [returns the build product string]
     */
    buildProductsString: function(productsObj, excludeArr) {
      //console.log(productsObj);
      var productString = this.processProductString(productsObj, excludeArr);
      if (productString !== '') {
        return productString;
      }
    },
    /**
     * Processes the object to a s.products string.
     * @param  {array} obj [Array of 1 or more objects, which contains all information needed to build proper s.products string. Format based on digitalData.products.]
      var obj = [
        {
        brandName: "The_Hillman_Group",
        eVars:[
          {eVar13: "Some Value"},
          {eVar23: "Some Value"}
        ],
        events:[
          {event13: "Some Value"},
          {event23: "Some Value"}
        ],
        ivm: ["3216-37672-35005"],
        price: "6.88",
        productId: ["3032585"],
        productName: "25Count_516in18_Zinc_Plated_Standard_SAE_Regular_Wing_Nuts"
        },
        {
        brandName: "The_Hillman_Group",
        ivm: ["3216-37672-35005"],
        price: "6.88",
        productId: ["3032585"],
        productName: "25Count_516in18_Zinc_Plated_Standard_SAE_Regular_Wing_Nuts"
        }
      ]
     * @param  {array} excludeArr [Array of objects that you want to explicitly exclude]
     * @return {string} productString  [returns the build product string]
     */
    processProductString: function(obj, excludeArr) {
      //var productObject = jQuery.extend(true, {}, obj);
      var productObject = JSON.parse(JSON.stringify(obj));

      //Exclude from s.products all in excludeArr
      if (typeof excludeArr === 'object') {

        for (i = 0; i < productObject.length; i++) {
          for (var key in productObject[i]) {
            if ($.inArray(key, excludeArr) > -1) {

              delete productObject[i][key];

            }
          }
        }
      }

      //Build s.products string
      /* Category1;Product1;Quantity;Price;eventX=$x.xx|eventY=$x.xx;eVarX=$x.xx|eVarX=$x.xx,
       * Category2;Product2;Quantity;Price;eventX=$x.xx|eventY=$x.xx;eVarX=$x.xx|eVarX=$x.xx,
       * repeat…
       */
      if (productObject.length > 0) {

        //Create checkObj with same length as productObject
        var s_products = [];
        for (i = 0; i < productObject.length; i++) {
          var checkObj = {
            prodCategory: "category",
            prodIVM: "ivm",
            prodId: "id",
            prodQuantity: "quantity",
            prodPrice: "price",
            prodEvents: "event",
            prodEvars: "evar"
          };

          //Organize productObject into checkObj. Not case-sensitive.
          var a = {};
          for (var key in productObject[i]) {
            for (var check in checkObj) {
              //If indexes of productObject match values of checkObj, proceed.
              if (key.toLowerCase().indexOf(checkObj[check]) > -1) {
                if (typeof productObject[i][key] !== 'undefined') {
                  a[check] = productObject[i][key];
                  break;
                }
              }
            }

          }
          s_products.push(a);
        }
        var products = "";
        for (j = 0; j < s_products.length; j++) {

          //Category
          var categoryPs = ''
          if ('prodCategory' in s_products[j]) {
            if (typeof s_products[j].prodCategory[0] === 'object') {
              categoryPs += s_products[j].prodCategory[0];
            } else {
              categoryPs += s_products[j].prodCategory;
            }
          }

          //Product ID
          var productIdPs = '';
          if ('prodIVM' in s_products[j]) {
            if (typeof s_products[j].prodIVM[0] === 'object') {
              productIdPs += s_products[j].prodIVM[0];
            } else {
              productIdPs += s_products[j].prodIVM;
            }
          } else if ('prodId' in s_products[j]) {
            if (typeof s_products[j].prodIVM[0] === 'object') {
              productIdPs += s_products[j].prodId[0];
            } else {
              productIdPs += s_products[j].prodId;
            }
          }

          //Quantity
          var quantityPs = "";
          if (_satellite.getVar("pageType") === "order-confirmation") {
            if ('prodQuantity' in s_products[j]) {
              if (typeof s_products[j].prodQuantity[0] === 'object') {
                quantityPs += s_products[j].prodQuantity[0];
              } else {
                quantityPs += s_products[j].prodQuantity;
              }
            }
          }


          //Price
          var pricePs = "";
          if (_satellite.getVar("pageType") === "order-confirmation") {
            if ('prodPrice' in s_products[j]) {
              if (typeof s_products[j].prodPrice[0] === 'object') {
                pricePs += s_products[j].prodPrice[0];
              } else {
                pricePs += s_products[j].prodPrice;
              }
            }
            pricePs = (parseFloat(pricePs) * quantityPs).toFixed(2);
          }


          //Events +s_products.prodEvents
          var eventsPs = "";
          if ('prodEvents' in s_products[j]) {
            var flag = false;
            for (var k in s_products[j]['prodEvents']) {
              if (s_products[j]['prodEvents'][k] !== "") {
                flag = true;
                eventsPs += k + "=" + s_products[j]['prodEvents'][k] + "|";
              }
            }
            if (flag) {
              eventsPs = eventsPs.substr(0, eventsPs.length - 1);
            }
          }


          //Evars +s_products.prodEvars
          var evarsPs = "";
          if ('prodEvars' in s_products[j]) {
            for (var k in s_products[j]['prodEvars']) {
              evarsPs += k + "=" + s_products[j]['prodEvars'][k] + "|";
            }
            evarsPs = evarsPs.substr(0, evarsPs.length - 1);
          }

          products += categoryPs +";"+productIdPs +";"+quantityPs +";"+pricePs +";"+eventsPs +";"+evarsPs+",";
        }

        return products.substr(0, products.length - 1);
      }
    },
    nameLink: function(element) {
      var name = $(element).data('linkid') || $(element).attr('title') || '';
      var href = $(element).attr('href') || '';
      return [name, href];
    },
    /**
     * delayClickTracking function is designed to delay normal click events to the subsequent page view call.
     * This makes reports in SiteCatalyst much easier to follow the user's path through the site.
     */
    delayClickTracking: {
      storage: {},
      obj: {},
      /**
       * On page load, this processes then deletes the "clickTracking" cookie. It directly assigns data processed to "s."
       * @set {object} "s." [AppMeasurement]
       * @parent delayClickTracking
       */
      process: function() {
        var append = _satellite.readCookie('clickTracking');
        _satellite.removeCookie('clickTracking');
        if (typeof(append) !== 'undefined' && typeof(s) !== 'undefined') {
          var jsonAppend = JSON.parse(decodeURIComponent(append));
          for (var key in jsonAppend) {
            if (key === 'search') {
              this.search(jsonAppend[key]);
            }
            if (key === 'products') {
              continue;
            }
            if (key === 'events') {
              if (jsonAppend[key] !== "") {
                if (typeof s['events'] !== "undefined") {
                  if (s['events'] !== "") {
                    s['events'] = s['events'] + ',' + jsonAppend[key]
                  } else {
                    s['events'] = jsonAppend[key];
                  }
                } else {
                  s['events'] = jsonAppend[key];
                }
              }
              continue;
            }

            s[key] = jsonAppend[key];
          }
        }
      },

      /**
       * Sets "clickTracking" cookie with obj that will be processed on the next page load.
       * @param  {object} obj [Object that follows the standard "s." format, contains only link related parameters]
       * @set {cookie} clickTracking [JSON format of object]
       * @parent delayClickTracking
       */
      set: function(obj) {
        var append = _satellite.readCookie('clickTracking');
        if (typeof(append) != 'undefined' && typeof(s) != 'undefined') {
          var jsonAppend = JSON.parse(decodeURIComponent(append));
          var newObj = {};
          for (key in jsonAppend) {
            newObj[key] = jsonAppend[key];
          }
          for (key in obj) {
            newObj[key] = obj[key];
          }

          _satellite.setCookie('clickTracking', encodeURIComponent(JSON.stringify(newObj)), '.0005');
        }else{
          _satellite.setCookie('clickTracking', encodeURIComponent(JSON.stringify(obj)), '.0005');
        }
      },
      /**
       * If jsonAppend from delayClickTracking.process() contains a "search" index. This assigns directly to the "s." object.
       * @param  {object} obj [Object that follows the standard "s." format, contains only search related parameters]
       * @set {object} "s." [AppMeasurement]
       * @parent delayClickTracking
       */
      search: function(obj) {

        //Set common variables for all search related tracking
        s['prop12'] = "D=v14";
        s['eVar13'] = "non-browse";
        s['eVar14'] = "intsearch";
        s['eVar23'] = "non-internal campaign";

        s['eVar15'] = DTMDataHelper.cleanAnalyticsData(_satellite.getVar('predictiveSearchTerm'));
        s['eVar79'] = _satellite.getVar('predictiveSearchTerm');
        s['prop13'] = "D=v15";
        s['events'] = s.apl(s['events'], 'event7', ',', 2);

        //Prepare data for storing in search variables
        var typedTerm = "",
          position = "",
          selectedKeyword = "",
          selectedProduct = "";
        if (typeof obj === "object") {
          for (var key in obj) {
            switch (key) {
              case "typedTerm":
                typedTerm = DTMDataHelper.cleanAnalyticsData(obj[key]);
                break;
              case "position":
                position = obj[key];
                break;
              case "selectedKeyword":
                selectedKeyword = DTMDataHelper.cleanAnalyticsData(obj[key]);
                break;
              case "selectedProduct":
                selectedProduct = DTMDataHelper.cleanAnalyticsData(obj[key]);
                break;
              default:
                break;
            }

          }
        }

        //Set additional variables based on scenarios
        if (digitalData.page.pageType === "search-results") {
          //Search Results Page
          if (typeof Lowes.ProductList !== 'undefined') {
            if (typeof Lowes.ProductList.productCount !== 'undefined') {
              //Set # of Total Results
              s['prop14'] = Lowes.ProductList.productCount;
            } else {
              //Desktop-Null search results page
              s['prop14'] = 'zero';
              s['eVar16'] = 'search'
              s['events'] = (s['events'] !== "") ? s['events'] + ',event8' : 'event8';
            }
            s['prop33'] = _satellite.getVar('correctedSearchTerm');
          } else {
            //Mobile-Null search results page
            s['prop14'] = 'zero';
            s['eVar16'] = 'search'
            s['events'] = (s['events'] !== "") ? s['events'] + ',event8' : 'event8';
          }
        } else if (digitalData.page.pageType === "product-list") {
          //Product List Page
          if (typeof Lowes.ProductList.productCount !== 'undefined') {
            s['prop14'] = Lowes.ProductList.productCount;
          }
          if(_satellite.getVar('siteSectionLast') !== typedTerm){
            s['prop33'] = _satellite.getVar('siteSectionLast');
          }
          s['events'] = (s['events'] !== "") ? s['events'] + ',event13' : 'event13';
        } else if (digitalData.page.pageType === "product-display") {
          if (selectedProduct === "") {
            //redirect to Product Display Page
            s['prop33'] = _satellite.getVar('siteSectionLast');
            s['events'] = (s['events'] !== "") ? s['events'] + ',event13' : 'event13';
          }
        } else {
          //redirect to Category Page
          if(_satellite.getVar('siteSectionLast') !== typedTerm){
            s['prop33'] = _satellite.getVar('siteSectionLast');
          }
          s['events'] = (s['events'] !== "") ? s['events'] + ',event13' : 'event13';
        }

        //Selected Keyword
        if (selectedKeyword !== "") {
          s['eVar30'] = typedTerm + ":" + selectedKeyword + ":" + position + ":keyword";
          s['eVar15'] = selectedKeyword;
        }

        //Selecting Product in Predictive Search
        if (selectedProduct !== "") {
          s['eVar30'] = typedTerm + ":" + selectedProduct + ":" + position + ":product";
          s['eVar15'] = null;
          s['prop13'] = null;
          //Remove event7 for selecting a product in predictive search
          var x = s['events'].split(",");
          x = $.grep(x, function(n, i) {
            return n !== "event7";
          });
          s['events'] = x.join(",");
        }

        //eVar30 is directly tied to event10.
        if (typeof s['eVar30'] !== "undefined")
          s['events'] = (s['events'] !== "") ? s['events'] + ',event10' : 'event10';

      },
    },
    /**
     * Lower cases, replaces special characters & spaces with _
     * @param  {string} dataString [Any string you want to clean]
     * @returns {string} cleanString [Cleaned String]
     */
    cleanAnalyticsData: function(dataString) {
      var cleanString = '',
        dataString = dataString;

      // Exit if no content is passed in
      if (dataString === undefined || dataString === '') {
        return cleanString;
      }

      // convert all text to lowercase
      cleanString = dataString.toLowerCase().trim();
      // replace spaces with underscores
      cleanString = cleanString.replace(/\s/g, '_');
      // replace dashes with underscores
      // cleanString = cleanString.replace(/-/g, '_');
      // remove all special characters
      cleanString = cleanString.replace(/[^A-Za-z0-9\_\,\:\.\;\-\/]/g, '');
      // replace double underscores resulting from whitespace replacement
      cleanString = cleanString.replace(/_+/g, '_');

      return cleanString;
    },

    /**
     * Used to find an ancestor element with described attribute
     * @param  {HTMLElement} element [selected HTML of type vanilla JS HTML element]
     * @param  {object} name    [name.type = attribute (eg class, id, etc), name.value = attribute value]
     * @return {HTMLElement} parent  [parent element that contains the specified attribute:value]
     */
    findParent: function(element, name) {
      var parent = '';

      if(element && 'hasAttribute' in element) {
          if (element.hasAttribute(name.type) && name.value !== undefined) {
            if (name.value === null) {
              return (parent = element);
            } else if (element.classList.contains(name.value) === true) { //regex not functioning
              return (parent = element);
            } else {
              parent = DTMDataHelper.findParent(element.parentElement, name);
            }
          } else {
            parent = DTMDataHelper.findParent(element.parentElement, name);
          }
      }

      if (parent !== undefined) {
        return parent;
      }
    },
    /**
     * [recommendsType - Function to scrape widget id/name/header and reduce to abbreviation]
     * @param  {HTMLElement} element - element with id or data-algorithm-name attributes, or header element
     * @return {string} recType - abbreviation of widget name
     */
    recommendsType: function(element) {
      var widget, widgetType = '';

      //if element doesn't exist, exit
      if (element === undefined) {
        return false;
      } else if ($(element).data('algorithm-name') !== '' && $(element).data('algorithm-name') !== undefined) {
        widgetType = $(element).data('algorithm-name');
      } else {
        // if no matching attributes are found, traverse the dom looking for an id'ed parent
        widget = DTMDataHelper.findParent(element, {
          'type': 'id',
          'value': null
        });
        //last ditch, look for a header element
        if (widget !== undefined && widget !== null && widget !== '') {
          widgetType = $(widget.getElementsByTagName('h2').item(0)).text();
        } else {
          //nadda
          return false;
        }
      }

      // select any uppercased character or first character in word (for camelcase)
      // merge array into string, lowercase string
      // TODO: strip excess non-alphabetic characters
      widgetType = widgetType.match(/(\b[A-Za-z0-9])/g);
      if (widgetType !== null) {
        widgetType = widgetType.join('').toLowerCase();
        return widgetType;
      } else {
        return null;
      }
    },
    /**
     * Caching of only global Vars, used for on-page click tracking
     * @sets {object} digitalData.globalVars
     */
    cacheGlobalVars: function() {
      if (typeof s === "object") {
        //Capture global vars before clearing.
        digitalData.globalVars = {};
        digitalData.globalVars.channel = s.channel;
        digitalData.globalVars.prop1 = s.prop1;
        digitalData.globalVars.prop2 = s.prop2;
        digitalData.globalVars.prop3 = s.prop3;
        digitalData.globalVars.prop4 = s.prop4;
        digitalData.globalVars.prop6 = s.prop6;
        digitalData.globalVars.prop10 = s.prop10;
        digitalData.globalVars.prop23 = s.prop23;

        digitalData.globalVars.eVar2 = s.eVar2;
        digitalData.globalVars.eVar3 = s.eVar3;
        digitalData.globalVars.eVar4 = s.eVar4;
        digitalData.globalVars.eVar5 = s.eVar5;
        digitalData.globalVars.eVar27 = s.eVar27;
        digitalData.globalVars.eVar49 = s.eVar49;
        digitalData.globalVars.eVar88 = s.eVar88;
      }

    },
    /**
     * Sets standard link tracking global variables. Stores existing global vars, then clears all vars, resets link tracking global vars
     * @sets {object} "s." [AppMeasurement]
     */
    setGlobalLinkVars: function() {
      if (typeof digitalData.globalVars === "object") {
        //capture global vars before clearing.
        t = {};
        t.channel = digitalData.globalVars.channel;
        t.prop1 = digitalData.globalVars.prop1;
        t.prop2 = digitalData.globalVars.prop2;
        t.prop3 = digitalData.globalVars.prop3;
        t.prop4 = digitalData.globalVars.prop4;
        t.prop6 = digitalData.globalVars.prop6;
        t.prop10 = digitalData.globalVars.prop10;
        t.prop23 = digitalData.globalVars.prop23;

        t.eVar2 = digitalData.globalVars.eVar2;
        t.eVar3 = digitalData.globalVars.eVar3;
        t.eVar4 = digitalData.globalVars.eVar4;
        t.eVar5 = digitalData.globalVars.eVar5;
        t.eVar27 = digitalData.globalVars.eVar27;
        t.eVar49 = digitalData.globalVars.eVar49;
        t.eVar88 = digitalData.globalVars.eVar88;

        //clear all variables
        s.clearVars();
        var u = [];
        //reassign mandatory variables
        for (key in t) {
          s[key] = t[key],
            u.push(key)
        }
        s.linkTrackVars = u.join(',');
        s.linkTrackVars = s.apl(s.linkTrackVars, 'prop11', ',',2);
      }

    },
    /*
     * Fill in existing global vars for click events
    */
    setGlobalClickVarsNoCache: function() {
      s.linkTrackVars = s.apl(s.linkTrackVars, 'channel,prop1,prop2,prop3,prop4,prop6,prop10,prop23,eVar2,eVar3,eVar4,eVar5,eVar27,eVar49,eVar88', ',', 2);
    },
    /**
     * Sets s.products string and accociated Events with ;productmerch counter, reads from "productnum" cookie.
     * Same function as in Global Custom Code.
     * @sets {object} "s." [AppMeasurement]
     * @sets {cookie} "productnum"
     */
    productMerch: function() {
      // exit method if page is PDP; no product strings are set on PDP
      if (digitalData.page.pageType === 'product-display') { return false; }
      else {
        //Read and parse 'productnum' cookie then increment
        if (!_satellite.readCookie('productnum'))
        { s.productNum = 1; }
        else
        { s.productNum = parseInt(_satellite.readCookie('productnum')) + 1; _satellite.removeCookie('productnum'); }


        //Set s.products string
        s.products = ';productmerch' + s.productNum;
        s.linkTrackVars = s.apl(s.linkTrackVars, 'events,products', ',', 2);
        s.linkTrackEvents = s.apl(s.linkTrackEvents, 'event71', ',', 2);
        s.events = s.apl(s.events, 'event71', ',', 2);

        //Set Cookie with new productNum
        var end_date = new Date();
        end_date.setTime(end_date.getTime() + (30 * 86400000));
        _satellite.setCookie('productnum', s.productNum, end_date);
        return true;
      }
    },
    waitForElement: function(selector, callback, maxTries, tryNum) {
        maxTries = maxTries || 0;
        tryNum = tryNum || 1;
        var intervalMs = 200,
        elm = (typeof($) == 'function') ? $(selector) : document.querySelectorAll(selector);
        if (elm.length > 0) {
            callback(elm);
        } else if (tryNum <= maxTries || maxTries === 0) {
            setTimeout(function () {
                DTMDataHelper.waitForElement(selector, callback, maxTries, ++tryNum);
            }, intervalMs);
        }
    },
    formError: function(errorCode, errorMsg, secondaryMsg) {
      //substantiate ddo form errors if not present
      window.digitalData.form.formErrorCode = '' || window.digitalData.form.formErrorCode;
      window.digitalData.form.formErrors = {} || window.digitalData.form.formErrors;
      // does an error code exist?
      if (errorCode !== undefined && errorCode !== '') {
        //yes? let's push it to the ddo
        window.digitalData.form.formErrorCode = errorCode;
      } else {
        //no? set it as 'na'
        window.digitalData.form.formErrorCode = 'na';
      }
      // does a primary or secondary error message exist?
      if ((errorMsg !== undefined && errorMsg !== '') || (secondaryMsg !== undefined && secondaryMsg !== '')) {
        //yes? okay, let's make sure that we combine all messages into one
        var msg = [];
        if (errorMsg !== undefined && errorMsg.length > 0) {
          if (errorMsg.typeOf === ('array' || 'object')) {
            for (var i = errorMsg.length - 1; i >= 0; i--) {
              msg.push(errorMsg[i]);
            }
          } else {
            msg.push(errorMsg);
          }
        }
        if (secondaryMsg !== undefined && secondaryMsg.length > 0) {
          if (secondaryMsg.typeOf === ('array' || 'object')) {
            for (var i = secondaryMsg.length - 1; i >= 0; i--) {
              msg.push(secondaryMsg[i]);
            }
          } else {
            msg.push(secondaryMsg);
          }
        }
        window.digitalData.form.formErrors = msg;
      } else {
        //no? set it as 'na'
        digitalData.form.formErrors = 'na';
      }
    },
    /**
     * Utility to generate l2 string for UI errors only shown in the DOM
     * @function
     * @param  {string} formName - Required (pass null if you have no value) Form Name for Shown Errors
     * @param  {string} errorCode - Required (pass null if you have no value) Primary Error Code for Shown Errors
     * @param  {string} errorElement - Class or Id Selector to be used via jQuery to collect errors
     * @memberOf DTMDataHelper
     */
    compileUIErrorMessages: function(formName, errorCode, errorElement) {

      var cleansedFormName = (typeof formName !== "undefined" && formName !== '' && formName !== null) ? formName : 'no_value', // No Error Codes are available on page load,
        cleansedErrorCode = (typeof errorCode !== "undefined" && errorCode !== '' && errorCode !== null) ? errorCode : 'no_value', // No Error Codes are available on page load
        errorMessages = $(errorElement),
        errorMessageArray = [],
        errorList = '';

      // Begin s.list2 var assignments
      errorList = cleansedFormName + '|' + cleansedErrorCode;

      // Detect Error Messages, sanitize them, and add them to an array
      if (typeof errorMessages !== "undefined" && errorMessages.length > 0) {
        errorMessages.each(function(index, item) {
          errorMessageArray.push(DTMDataHelper.cleanAnalyticsData($(item).text().trim()));
        });

        // cycle through and format errors
        if (errorMessageArray.length > 0) {
          for (var i = 0; i < errorMessageArray.length; i++) {
            errorList = errorList + '|' + errorMessageArray[i];
          }
        }
      }
      // Return final error string
      return errorList;
    },
    filterCartIVM: function(cart){
      if ($.cookie('ivm-data')) {
        var updatedIvm = [];
        var ivmData = $.cookie('ivm-data');
        var ivmArray = ivmData.split(',');
        $.each(cart, function(x,i){
          $.each(ivmArray, function(y,j){
            if(j.indexOf(i.itemNumber) !== -1 && j.indexOf(i.modelNumber) !== -1){
              for(k=1; k <= i.quantity; k++){
                updatedIvm.push(j);
              }
              return false;
            }
          });
        });
        $.cookie('ivm-data', null);
        $.cookie('ivm-data', updatedIvm.toString(), { expires: 7, path: '/' });
      }
    },
    getParamsFromUrl: function(url) {
      var query_string = {};

      if(url) {
        var splitUrl = url.split('?');

        if(splitUrl.length > 1) {
            var query = splitUrl[1];
        } else {
            return false;
        }
      } else {
        return false;
      }

      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");

        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      }

      return query_string;
    },
    fireTargetMbox: function(mboxDiv, mboxName, params, debug) {
      var params = params || {},
          debug = debug || (window.location.search.indexOf('debug=1') == -1 ? false : true);

      if(debug) {
        	console.log('AEM Mboxes: ' + mboxName);
      		console.log(mboxDiv);
      }

      if(mboxName) {
          (function(mboxName, mboxDiv) {
              adobe.target.getOffer({
                  "mbox": mboxName,
                  "params": params,
                  "success": function(offers) {
                    	if(debug) console.log(offers);
                    	adobe.target.applyOffer( { "mbox": mboxName, "element": mboxDiv, "offer": offers } );
                    	$(mboxDiv).show();
                  },
                  "error": function(status, error) {
                      if (console && console.log) {
                          console.log(status);
                          console.log(error);
                      }

                    	$(mboxDiv).show();
                  },
                  "timeout": 1000
              });
          })(mboxName, mboxDiv);
      }
    },
  };

}());

});
