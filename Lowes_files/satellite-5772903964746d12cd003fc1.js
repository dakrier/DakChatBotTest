_satellite.pushBlockingScript(function(event, target, $variables){
  (function() {
    var doubleClick = {
        pixelList: [
            { path: '/projects/2016/bright-now/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/style-a-room-with-rugs/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/fashionable-furbabies/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/spectacular-ceilings/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/open-shelving-ideas/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/luxe-bath-ideas/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/colorstories-berry/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/colorstories-yellow/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/luxe-kitchen-additions/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/copper-accents/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/instacharm/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/brass-is-back/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/global-chic/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/colorstories-navy/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/2016/pantone-colors/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/decorate-and-entertain/area-rug-buying-guide/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/decorate-and-entertain/seattle-makeover-monica/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/organize-store-and-move/kitchen-org-stow-vs-style/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/bed-and-bath/9-interior-design-tips-from-pros/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/organize-store-and-move/storage-for-small-bedrooms/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/organize-store-and-move/renter-friendly-decorating-tips/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/organize-store-and-move/storage-for-small-closets/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/organize-store-and-move/4-4-4-projects/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/decorate-and-entertain/5-ways-to-hide-the-ugly/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/kitchen-and-dining/9-ideas-for-small-kitchens/article', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/bed-and-bath/bath-blogger-gwen-rope-rug/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/bed-and-bath/bath-blogger-amber-wall-panels/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/bed-and-bath/bath-blogger-monica-floor/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/bed-and-bath/bath-blogger-monica-painted-door/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/bed-and-bath/bath-blogger-monica-accent-wall/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/decorate-and-entertain/hang-curtains-drapes/project', src: '1160694',type:'conte00',cat:'lawna0' },
            { path: '/projects/decorate-and-entertain/how-to-hang-heavy-mirrors/project', src: '1160694',type:'conte00',cat:'lawna0' },
          	{ path: '/projects/utility-and-storage/she-shed-room-ideas/article', src: '1160694',type:'conte00',cat:'lawna0' },
        ],
        addPixel: function(myObj) {
            for (var i = 0; i < myObj.length; i++) {
                
          			//DoubleCick
          			var axel = Math.random() + '';
                var a = axel * 10000000000000;
                var src = myObj[i].src,
                        type = myObj[i].type,
                        cat = myObj[i].cat;

      					tgtURL = '<img src="//ad.doubleclick.net/ddm/activity/src=1160694;type=conte00;cat=lawna0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=' + a + '?" width="1" height="1" style="display:none" alt=""/>';
                window.DTMDataHelper.addTag(tgtURL, "body");
      
      					//Outbrain
     						tgtURL = '<img src="//traffic.outbrain.com/network/trackpxl?advid=15413&action=view" width="1" height="1" style="display:none" alt=""/>';
                window.DTMDataHelper.addTag(tgtURL, "body");
      
            }
        },
        checkObj: function() {
            //console.log('Checking DoubleClick Object');
            var myObj = window.DTMDataHelper.isTracked(this.pixelList);
            if (!!myObj) {
                this.addPixel(myObj);
            }
        }
    };
    doubleClick.checkObj();
}());
});
