_satellite.pushAsyncScript(function(event, target, $variables){
  ;
(function($) {
    var liveChat = {
        // Collapse LivePerson Window
        collapseLiveChat: function() {
            // Animate window down and animate button up after
            $('.liveperson-invite .expanded').animate({
                bottom: "-=360px"
            }, 300, function() {
                // Animation complete.
                $('.liveperson-invite .collapsed').animate({
                    bottom: "+=36px"
                }, 300, function() {
                    // Animation complete.    
                });
            });
        },
        // Expand LivePerson window
        expandLiveChat: function() {
            // Animate button down and animate window up after
            $('.liveperson-invite .collapsed').animate({
                bottom: "-=36px"
            }, 300, function() {
                // Animation complete.
                $('.liveperson-invite .expanded').show();
                $('.liveperson-invite .expanded').animate({
                    bottom: "+=360px"
                }, 300, function() {
                    // Animation complete.
                });
            });
        },

        removeLiveChat: function() {
            $(".liveperson-invite").remove();
        },

        startChat: function() {
            liveChat.collapseLiveChat();
            liveChat.removeLiveChat();
        },

        // Checks sessionStorage to see if the user has see the expanded window on this campaign
        hasUserSeenLiveChat: function(siteSec) {
            var hasViewedSiteSec = eval("sessionStorage." + siteSec);
            if (!hasViewedSiteSec) {
                liveChat.expandLiveChat();
                sessionStorage.setItem(siteSec, true);
                setTimeout(liveChat.collapseLiveChat, 15000);
            }
        },

        // Find which campaign the user has hit and decide if we should show the expanded window or not
        checkSiteSection: function() {            
            if (lpTag.section.indexOf("shopping_funnel") > -1){
                liveChat.hasUserSeenLiveChat("hasViewedShoppingFun");
            } else if (lpTag.section.indexOf("checkout") > -1){
                liveChat.hasUserSeenLiveChat("hasViewedCheckoutFun");
            } else if (lpTag.section.indexOf(_satellite.getVar('siteSectionTwo')) > -1) {
                liveChat.hasUserSeenLiveChat("hasViewedInstallPage");
            }
        },

        bindClickHandlers: function() {
            $('.liveperson-invite .collapsed').on('click', liveChat.expandLiveChat);
            $('.liveperson-invite .expanded .liveperson-top i').on('click', liveChat.collapseLiveChat);
            $('.start-chat-btn').on('click', liveChat.startChat);
        },
        
        // Watch the DOM to see if LivePerson has injected the invite (agent is available)
        checkForLiveChat: function() {
            if ($('.liveperson-invite').length > 0) {
                liveChat.checkSiteSection();
                liveChat.bindClickHandlers();
                clearInterval(domCheck);
            }
        },

        init: function() {
            // Check to see if LiveEngage has injected the markup into the DOM
            domCheck = setInterval(function() { liveChat.checkForLiveChat() }, 500);
        }
    }
    liveChat.init();
}(jQuery));

});
