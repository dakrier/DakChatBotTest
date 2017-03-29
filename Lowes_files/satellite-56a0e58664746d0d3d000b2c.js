_satellite.pushAsyncScript(function(event, target, $variables){
   (function(Analytics) {
    Flashtalking = {
        action: '',
        category: '',
        product_id: '',
        spot_name: '',
        ftx_value: '',
        ftx_ref: '',
        ftx_num_items: '',
        u1: '',
        flashtalking_remarketing_req: '',
        flashtalking_reporting_req: '',
        pixelList: [
        ],
        matchFlashtalkingToDataObject: function() {
            // Scoping
            if (_satellite.getVar("pageType") !== "") {
                switch (_satellite.getVar("pageType")) {
                    case "home":
	                  case "hp":
                        this.action = "homepage";
                        this.category = "";
                        this.product_id = "";
                        break;
                    case "product-display":
                        this.action = "v";
                        this.category = _satellite.getVar("scPageName");
                        this.category = this.category.replace(/:/g,'|');
                        if (typeof window.digitalData.products !== "undefined" && typeof window.digitalData.products[0] !== "undefined" && typeof (window.digitalData.products[0].ivm[0]) !== "undefined")
                            this.product_id = window.digitalData.products[0].ivm[0];
                        else
                            this.product_id = "";
                        break;
                    case "search-results":
                    case "category":
                    case "sub-category":
                    case "sub-sub-category":
                    case "department":
                        if(_satellite.getQueryParam('Ntt') || _satellite.getQueryParam('UserSearch')){
                            this.action = "s";
                        }else{
                            this.action = "cat_view";
                        }
                        this.category = _satellite.getVar("scPageName");
                        this.category = this.category.replace(/:/g,'|');

                        var element, url, start, end, results;
                        element = $('#productResults li div.titleArea .productTitle a')[0];

                        if (typeof element !== "undefined") {
                            url = element.href;
                            start = url.search('pd') + 3;
                            end = url.search('__');
                            results = url.substring(start,end);

                            if(results.search('_') > -1) {
                                results = results.split('_')[0];
                            }
                            this.product_id = results;
                        } else {
                            this.product_id = "";
                        }

                        break;
                    case "shopping-cart":
                        this.action = "c";
                        this.category = "basket";
                        if (typeof window.digitalData.products[0] !== "undefined" && typeof (window.digitalData.products[0].ivm[0]) !== "undefined"){
                            var productsObj = window.digitalData.products;
                            var ivms = '';
                            $.each(productsObj,function(index, item){
                                ivms = ivms + this.ivm[0] +',';
                            });
                            this.product_id = ivms.slice(0,-1);
                        }
                        else{
                            this.product_id = "";
                        }
                        break;
                    case "order-confirmation":
                        this.action = "p";
                        this.category = "confirmation";
                        if (typeof (window.digitalData.products[0].ivm[0]) !== "undefined"){
                            var productsObj = window.digitalData.products;
                            var ivms = '';
                            $.each(productsObj,function(index, item){
                                ivms = ivms + this.ivm[0] +',';
                            });
                            this.product_id = ivms.slice(0,-1);
                        }
                        else{
                            this.product_id = "";
                        }

                        this.spot_name = "Confirmation_page";
                        this.ftx_value = window.digitalData.cart.orderId;
                        this.ftx_ref = window.digitalData.cart.grandTotal;
                        this.ftx_num_items = window.digitalData.products.length;
                        this.u1 = this.product_id;
                        break;
                    default:
                        break;
                }
            }
        },
        addPixel: function() {

            this.flashtalking_remarketing_req = window.location.protocol + "//elb.flashtalking.com/services/lowes/segment/?action=" + this.action;

            if (this.category !== "")
                this.flashtalking_remarketing_req += "&category=" + this.category;
            if (this.product_id !== "")
                this.flashtalking_remarketing_req += "&productId=" + this.product_id;

            var flashtalkingTag = document.createElement('img');
            flashtalkingTag.setAttribute('src', this.flashtalking_remarketing_req);
            flashtalkingTag.style.display = "none";
            flashtalkingTag.width = "1";
            flashtalkingTag.height = "1";

            Analytics.addTag(flashtalkingTag, "body");

            if (this.spot_name !== "") {
                this.flashtalking_reporting_req = "https://servedby.flashtalking.com/spot/8/6466;41724;4774/?spotName=" + this.spot_name;
                this.flashtalking_reporting_req += "&ftXRef=" + this.ftx_value;
                this.flashtalking_reporting_req += "&ftXValue=" + this.ftx_ref;
                this.flashtalking_reporting_req += "&ftXNumItems=" + this.ftx_num_items;
                this.flashtalking_reporting_req += "&U1=" + this.u1;

                var flashtalkingRepTag = document.createElement('img');
                flashtalkingRepTag.setAttribute('src', this.flashtalking_reporting_req);
                flashtalkingRepTag.style.display = "none";
                flashtalkingRepTag.width = "1";
                flashtalkingRepTag.height = "1";

                Analytics.addTag(flashtalkingRepTag, "body");
            }
        },
        checkObj: function() {
            this.matchFlashtalkingToDataObject();
            //var myObj = Analytics.isTracked(this.pixelList);
            if (this.action !== "") {
                this.addPixel();
            }
        }
    };
    Flashtalking.checkObj();
})(window.DTMDataHelper);
});
