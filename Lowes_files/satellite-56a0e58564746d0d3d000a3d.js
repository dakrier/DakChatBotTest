_satellite.pushAsyncScript(function(event, target, $variables){
  // Facebook Multipage Tag
!function(f, b, e, v, n, t, s) {
    if (f.fbq)
        return;
    n = f.fbq = function() {
        n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq)
        f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script', '//connect.facebook.net/en_US/fbevents.js');

window.fbq('init', '625799750871183'); // init
window.fbq('track', 'PageView'); // page view

// page specific conditions
if (_satellite.getVar("pageType") === "product-display") {
	fbq('track', 'ViewContent', {
		content_ids: [digitalData.products[0].ivm],
		content_type: 'product'
	});
} else if (_satellite.getVar("pageType") === "checkout-login") {
    var orderProducts = [];
    for(var k in digitalData.products){
      orderProducts.push(digitalData.products[k].ivm[0]);
    }
    window.fbq('track', 'InitiateCheckout',{
      content_ids: orderProducts,
      content_type: 'product'
    });
} else if (_satellite.getVar("pageType") === "review-and-pay") {
    var orderProducts = [];
    for(var k in digitalData.products){
      orderProducts.push(digitalData.products[k].ivm[0]);
    }
    window.fbq('track', 'AddPaymentInfo',{
      content_ids: orderProducts,
      content_type: 'product'
    });
} else if (_satellite.getVar("pageType") === "order-confirmation") {
    var revenue = '1.00', orderProducts = [], orderId;
    if (typeof (digitalData) !== "undefined" && typeof (digitalData.cart) !== "undefined") {
        revenue = digitalData.cart.subTotal;
    }
    if (typeof (digitalData) !== "undefined" && typeof (digitalData.products) !== "undefined") {
      var orderProducts = [];
      for(var k in digitalData.products){
      	orderProducts.push(digitalData.products[k].ivm[0]);
      }
      //orderProducts = orderProducts.join(',');
    }
  	if (typeof (digitalData) !== "undefined" && typeof (digitalData.cart) !== "undefined") {
    	orderId = digitalData.cart.orderId;
    }
    window.fbq('track', 'Purchase', {
    	content_ids: orderProducts,
			content_type: 'product',
    	value: revenue,
    	currency: 'USD',
      order_id: orderId
    });
}
});
