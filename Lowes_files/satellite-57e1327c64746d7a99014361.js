_satellite.pushAsyncScript(function(event, target, $variables){
  // Engagement Attributes 
lpTag.sdes = lpTag.sdes || [];
window.engagementAttributes = window.engagementAttributes || {};
prodArray = [];

engagementAttributes = {
    arrOfObj: [],
    loadCartItems: function() {
        for (i in _satellite.getVar('products')) {
            prodArray.push({
                "product": {
                    "name": digitalData.products[i].productName,
                    "category": _satellite.getVar('scPageName'),
                    "sku": digitalData.products[i].ivm,
                    "price": digitalData.products[i].productUnitPrice
                },
                "quantity": digitalData.products[i].productQuantity
            });
        }
    },
    cartUpdate: function() {
        this.loadCartItems();
        var cartUpdateObj = {
            "type": "cart",
            "total": _satellite.getVar('subTotal'),
            "numItems": _satellite.getVar('products').length,
            "products": prodArray
        }
        this.arrOfObj.push(cartUpdateObj);
    },
    transaction: function() {
        this.loadCartItems();
        var transactionObj = {
            "type": "purchase",
            "total": _satellite.getVar('cartTotal') || "-",
            "orderId": _satellite.getVar('orderId') || 0,
            "cart": {
                "products": prodArray
            }
        }
        this.arrOfObj.push(transactionObj);
    },
    viewedProducts: function() {
        var viewedProductsObj = {
            "type": "prodView",
            "products": [{
                "product": {
                    "name": digitalData.products[0].productName || "-",
                    "category": _satellite.getVar('scPageName') || "-",
                    "sku": digitalData.products[0].ivm || 0,
                    "price": digitalData.products[0].sellingPrice || 0
                }
            }]
        }
        this.arrOfObj.push(viewedProductsObj);
    },
    customerInfo: function() {
        var customerInfoObj = {
            "type": "ctmrinfo",
            "info": {
                "userName": digitalData.profile.user.CurrentStore.storeName || "-",
                "companySize": parseInt(digitalData.profile.user.CurrentStore.storeNumber) || 0,
                "socialId": digitalData.profile.user.CurrentStore.zip || "-",
                "cstatus": _satellite.getVar('visitorStatus') || "-",
                "customerId": _satellite.getVar('userID') || "-"
            }
        }
        this.arrOfObj.push(customerInfoObj);
    },
    personalInfo: function() {
        var filters = "";
        if (digitalData.search.filters && digitalData.search.filters.length > 0) {
            for (var filter in digitalData.search.filters) {
                filters += digitalData.search.filters[filter].groupName + ': ' + digitalData.search.filters[filter].filterName + ', '
            }
            filters = filters.slice(0, -2);
        }
        var personalInfoObj = {
            "type": "personal",
            "personal": {
                "contacts": [{
                    "phone": _satellite.getVar('predictiveSearchTerm') || '-',
                    "email": "-"
                }],
                "company": filters || "-"
            }
        }
        engagementAttributes.arrOfObj.push(personalInfoObj);
    },

    updateFilters: function() {
        // When the digitalData object has been updated then update LiveEngage
        $(document).on("update-refinement", function() {
            engagementAttributes.personalInfo();
            engagementAttributes.sendObjects();
        });
    },
    lead: function() {
        var leadObj = {
            "type": "lead",
            "lead": {
                "topic": "product brand",
                "leadId": _satellite.getVar('brandName') || "-"
            }
        }
        this.arrOfObj.push(leadObj);
    },
    // Push the data to LiveEngage
    sendObjects: function() {
        lpTag.sdes.push(this.arrOfObj);
    },
    init: function() {
        // Once the transaction is complete send details to LiveEngage
        if (_satellite.getVar("siteSectionTwo") == "order-confirmation") {
            this.transaction();
            // Display cart details when in the checkout funnel. 
            // Currently digitalData only has cart details in the checkout funnel.
        } else if (_satellite.getVar("siteSection") == "checkout") {
            this.cartUpdate();
            // Update LiveEngage product list when the product detail page is hit
        } else if (digitalData.page.pageName == "product-display") {
            this.viewedProducts();
        } else if (digitalData.page.pageType == "product-list") {
            // If the user refreshes the page keep the filters up-to-date
            this.updateFilters();
            // Update LiveEngage when the filters change on product list page.
            $(".js-refinements-checkbox").change(this.updateFilters);
        }
        this.customerInfo();
        this.personalInfo();
        // DSD-36873 Stop sending data to the Lead Generation dropdown
        // this.lead();
        this.sendObjects();
    }
};
// Update LiveEngage when lpTag.sdes.push is fired
lpTag.events.bind("lp_sdes", "VAR_ADDED", engagementAttributes.init());

});
