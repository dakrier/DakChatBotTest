_satellite.pushBlockingScript(function(event, target, $variables){
  $('body').append('<div id="liveperson-persist-button" class="sticky sticky-bottom lowes-white"></div>');

var lwsLPID = (window.location.hostname === 'www.lowes.com') ? '22554410' : '51200453';
//BEGIN LivePerson Monitor
window.lpTag=window.lpTag||{};if(typeof window.lpTag._tagCount==='undefined'){window.lpTag={site:lwsLPID||'',section:lpTag.section||'',autoStart:lpTag.autoStart===false?false:true,ovr:lpTag.ovr||{},_v:'1.6.0',_tagCount:1,protocol:'https:',events:{bind:function(app,ev,fn){lpTag.defer(function(){lpTag.events.bind(app,ev,fn);},0);},trigger:function(app,ev,json){lpTag.defer(function(){lpTag.events.trigger(app,ev,json);},1);}},defer:function(fn,fnType){if(fnType==0){this._defB=this._defB||[];this._defB.push(fn);}else if(fnType==1){this._defT=this._defT||[];this._defT.push(fn);}else{this._defL=this._defL||[];this._defL.push(fn);}},load:function(src,chr,id){var t=this;setTimeout(function(){t._load(src,chr,id);},0);},_load:function(src,chr,id){var url=src;if(!src){url=this.protocol+'//'+((this.ovr&&this.ovr.domain)?this.ovr.domain:'lptag.liveperson.net')+'/tag/tag.js?site='+this.site;}var s=document.createElement('script');s.setAttribute('charset',chr?chr:'UTF-8');s.setAttribute('async','async');s.setAttribute('defer','defer');if(id){s.setAttribute('id',id);}s.setAttribute('src',url);document.getElementsByTagName('head').item(0).appendChild(s);},init:function(){this._timing=this._timing||{};this._timing.start=(new Date()).getTime();var that=this;if(window.attachEvent){window.attachEvent('onload',function(){that._domReady('domReady');});}else{window.addEventListener('DOMContentLoaded',function(){that._domReady('contReady');},false);window.addEventListener('load',function(){that._domReady('domReady');},false);}if(typeof(window._lptStop)=='undefined'){this.load();}},start:function(){this.autoStart=true;},_domReady:function(n){if(!this.isDom){this.isDom=true;this.events.trigger('LPT','DOM_READY',{t:n});}this._timing[n]=(new Date()).getTime();},vars:lpTag.vars||[],dbs:lpTag.dbs||[],ctn:lpTag.ctn||[],sdes:lpTag.sdes||[],ev:lpTag.ev||[]};lpTag.init();}else{window.lpTag._tagCount+=1;}
//END LivePerson Monitor

// BEGIN LivePerson Site Section
lpTag.section = lpTag.section || [];
// Currently supported install pages
var installPages = ["window_install", "roofing_install", "fencing_install"];
//Find where the user is and choose the correct campaign on LiveEngage's end
if ((digitalData.page.pageType).indexOf("category") > -1 || digitalData.page.pageType == "product-list" || digitalData.page.pageType == "product-display") {
    lpTag.section = [_satellite.getVar('siteSection'), "shopping_funnel"];
} else if (_satellite.getVar('siteSection') == "checkout" && _satellite.getVar('siteSectionTwo') != "shopping-cart" && _satellite.getVar('siteSectionTwo') != "order-confirmation") {
    lpTag.section = ["checkout"];
} else if (installPages.indexOf(_satellite.getVar('siteSectionTwo')) > -1) {
    lpTag.section = [_satellite.getVar('siteSectionTwo'), "install"];
}
// END LivePerson Site Section

var debug = (window.location.search && window.location.search.indexOf('debug=1') !== -1 ? true : false),
    activeChat = function(event) {
        var events = JSON.parse(window.sessionStorage.getItem('lpevents') || '[]');
        
        if(event && events.indexOf(event) !== -1) {
            return false;
        } else if(event) {
            events.push(event);
            window.sessionStorage.setItem('lpevents', JSON.stringify(events));
            return true;
        }
        
        return false;
    };

// Analytics
lpTag.events.bind("lpUnifiedWindow", "conversationInfo", function(data,info){
    // Chat Active

    if(debug) {
        console.log(info);
        console.log(data);
    }
    
    if(data.state == 'ended') {
        window.sessionStorage.setItem('lpevents', '[]');
    }
    
    if(data.state == 'chatting') {
        try {
            if (lpTag.section.indexOf("shopping_funnel") > -1) {
                if(!activeChat('event80')) return false;
                // Pay for Performance
                s["linkTrackVars"] = "eVar60,eVar73";
                s["linkTrackEvents"] = "event80";
                s["eVar73"] = data.conversationId; 
                s["eVar60"] = "live:chat_active";
                s["events"] = s["apl"](s["events"], 'event80', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lp_chat_active');
            } else if (lpTag.section.indexOf('checkout') > -1) {
                if(!activeChat('event90')) return false;
                // Checkout Funnel
                s["linkTrackVars"] = "eVar73,eVar74";
                s["linkTrackEvents"] = "event90";
                s["eVar73"] = data.conversationId;
                s["eVar74"] = "lps:chat_participation";
                s["events"] = s["apl"](s["events"], 'event90', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_chat_participation');
            } else if (lpTag.section.indexOf("install") > -1) {
                if(!activeChat('event90')) return false;
                // Install Funnel
                s["linkTrackVars"] = "eVar73,eVar74";
                s["linkTrackEvents"] = "event90";
                s["eVar73"] = data.conversationId;
                s["eVar74"] = "lps:chat_participation";
                s["events"] = s["apl"](s["events"], 'event90', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_chat_participation');
            }
        } catch(e) { }
    }
});

lpTag.events.bind("LP_OFFERS", "OFFER_IMPRESSION", function(data,info){
    // Chat Invite Visible / Qualified

    if(debug) {
        console.log(info);
        console.log(data);
    }
    
    if(data.state == 1) {
        // Qualified but Online
        try {
            if (lpTag.section.indexOf("shopping_funnel") > -1) {
                if(!activeChat('event77')) return false;
                // Pay for Performance
                // Qualified Call
                s["linkTrackVars"] = "eVar60";
                s["linkTrackEvents"] = "event77";
                s["eVar60"] = "qualified";
                s["events"] = s["apl"](s["events"], 'event77', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lp_qualified');
                // Invite Visible Call
                if(!activeChat('event78')) return false;
                s["linkTrackVars"] = "eVar60";
                s["linkTrackEvents"] = "event78";
                s["eVar60"] = "live:invite_true";
                s["events"] = s["apl"](s["events"], 'event78', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lp_invite_true');
            } else if (lpTag.section.indexOf('checkout') > -1) {
                if(!activeChat('event87')) return false;
                // Checkout Funnel
                // Qualified Call
                s["linkTrackVars"] = "eVar74";
                s["linkTrackEvents"] = "event87";
                s["eVar74"] = "lps:qualified";
                s["events"] = s["apl"](s["events"], 'event87', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_qualified');
                // Invite Visible Call
                if(!activeChat('event88')) return false;
                s["linkTrackVars"] = "eVar74";
                s["linkTrackEvents"] = "event88";
                s["eVar74"] = "lps:support_live";
                s["events"] = s["apl"](s["events"], 'event88', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_support_live');
            } else if (lpTag.section.indexOf("install") > -1) {
                if(!activeChat('event87')) return false;
                // Install Funnel
                // Qualified Call
                s["linkTrackVars"] = "eVar74";
                s["linkTrackEvents"] = "event87";
                s["eVar74"] = "lps:qualified";
                s["events"] = s["apl"](s["events"], 'event87', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_qualified');
                // Invite Visible Call
                if(!activeChat('event88')) return false;
                s["linkTrackVars"] = "eVar74";
                s["linkTrackEvents"] = "event88";
                s["eVar74"] = "lps:support_live";
                s["events"] = s["apl"](s["events"], 'event88', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_support_live');
            }
        } catch(e) { }
    } else if(data.state == 2) {
        // Qualified but Offline (Control)
        try {
            if (lpTag.section.indexOf("shopping_funnel") > -1) {
                if(!activeChat('event77')) return false;
                // Pay for Performance
                s["linkTrackVars"] = "eVar60";
                s["linkTrackEvents"] = "event77";
                s["eVar60"] = "qualified-control";
                s["events"] = s["apl"](s["events"], 'event77', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lp_qualified-control');
            }
        } catch(e) { }
    }
});

lpTag.events.bind("LP_OFFERS", "OFFER_CLICK", function(data,info){
    // Chat Clicked

    if(debug) {
        console.log(info);
        console.log(data);
    }

    if (data.state == 1){
        try {
            if (lpTag.section.indexOf("shopping_funnel") > -1) {
                if(!activeChat('event79')) return false;
                // Pay for Performance
                s["linkTrackVars"] = "eVar60";
                s["linkTrackEvents"] = "event79";
                s["eVar60"] = "live:invite_accepted";
                s["events"] = s["apl"](s["events"], 'event79', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lp_invite_accepted');
            } else if (lpTag.section.indexOf('checkout') > -1) {
                if(!activeChat('event89')) return false;
                // Checkout Funnel
                s["linkTrackVars"] = "eVar74";
                s["linkTrackEvents"] = "event89";
                s["eVar74"] = "lps:chat_initiation";
                s["events"] = s["apl"](s["events"], 'event89', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_chat_initiation');
            } else if (lpTag.section.indexOf("install") > -1) {
                if(!activeChat('event89')) return false;
                // Install Funnel
                s["linkTrackVars"] = "eVar74";
                s["linkTrackEvents"] = "event89";
                s["eVar74"] = "lps:chat_initiation";
                s["events"] = s["apl"](s["events"], 'event89', ',', 2);
                DTMDataHelper.setGlobalClickVarsNoCache();
                s.channel = _satellite.getVar('siteSectionLast');
                s["tl"](true,'o','lps_chat_initiation');
            }
        } catch(e) { }
    }
});

lpTag.events.bind("lpUnifiedWindow", "cobrowseAccepted", function(data,info){
    if(debug) {
        console.log(info);
        console.log(data);
    }
    
    if(!activeChat('event94')) return false;
    
    try {
        if (lpTag.section.indexOf("shopping_funnel") > -1) {
            // Pay for Performance
            s["linkTrackVars"] = "eVar60";
            s["linkTrackEvents"] = "event94";
            s["eVar60"] = "live:chat_screen-share";
            s["events"] = s["apl"](s["events"], 'event94', ',', 2);
            DTMDataHelper.setGlobalClickVarsNoCache();
            s.channel = _satellite.getVar('siteSectionLast');
            s["tl"](true,'o','live:chat_screen-share');
        } else if (lpTag.section.indexOf('checkout') > -1) {
            // Checkout Funnel
            s["linkTrackVars"] = "eVar74";
            s["linkTrackEvents"] = "event94";
            s["eVar74"] = "lps_chat_screen-share";
            s["events"] = s["apl"](s["events"], 'event94', ',', 2);
            DTMDataHelper.setGlobalClickVarsNoCache();
            s.channel = _satellite.getVar('siteSectionLast');
            s["tl"](true,'o','lps_chat_screen-share');
        } else if (lpTag.section.indexOf("install") > -1) {
            // Install Funnel
            s["linkTrackVars"] = "eVar74";
            s["linkTrackEvents"] = "event94";
            s["eVar74"] = "lps_chat_screen-share";
            s["events"] = s["apl"](s["events"], 'event94', ',', 2);
            DTMDataHelper.setGlobalClickVarsNoCache();
            s.channel = _satellite.getVar('siteSectionLast');
            s["tl"](true,'o','lps_chat_screen-share');
        }
    } catch(e) { }
});
});
