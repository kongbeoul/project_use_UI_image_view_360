function hasJqueryObject($elem) { return $elem.length > 0 }

var App = App || {};

App.masonry = {
  init: function() {
    this.wrapperClass = ".grid";
    this.itemClass = ".grid-item";
    this.siteMapWrapperClass = '.grid-site-map';

    this.$wrapper = App.$body.find(this.wrapperClass);
    this.$siteMapWrapper = App.$body.find(this.siteMapWrapperClass);

    var options = {
      gutter: 30,
      itemSelector: this.itemClass
    }

    this.$wrapper.masonry(options);
    this.$siteMapWrapper.masonry({
      itemSelector: this.itemClass,
      gutter: 70,
      percentPosition: true
    })
  }
}

App.gnb = {
  events: {
    MOUSE_ENTER_MENU: "mouseenter.menu",
    MOUSE_LEAVE_MENU: "mouseleave.menu"
  },
  init: function() {
    this.menuClass = ".menu > a";
    this.depth02WrapClass = ".depth02MenuWrap";
    this.depth02Class = ".depth02Menu";
    this.depth02ChildClass = ".grid-item";
    this.adBannerClass = ".banner";
    this.activeClass = "active";

    this.$menu = App.$body.find(this.menuClass);
    this.$depth02MenuWrap = App.$body.find(this.depth02WrapClass);
    this.$depth02 = App.$body.find(this.depth02Class);

    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    var isMouseEntered = false;

    function handleMouseEntered() {
      if(isMouseEntered) return;
      isMouseEntered = true;
      
      var gridID = $(this).attr("data-grid-target"); 
      _this.$activeDepth02 = _this.$depth02.filter("[data-grid-id="+gridID+"]");

      if(!gridID) {
        isMouseEntered = false;
        return;
      };

      _this.$depth02MenuWrap.trigger(_this.events.MOUSE_LEAVE_MENU);
      _this.$depth02.removeClass(_this.activeClass).filter(_this.$activeDepth02).addClass(_this.activeClass);
      TweenMax.set(_this.$depth02MenuWrap, {height: _this.$activeDepth02.find(".grid").outerHeight(true) + 30, opacity:1})
      TweenMax.to(_this.$depth02MenuWrap, .65, { scaleY:1, ease: Power1.easeOut, onComplete: function(){
        _this.$activeDepth02.css({ zIndex: 20 }).siblings().css({ zIndex: 10 })
        _this.$activeDepth02.find(_this.depth02ChildClass).each(function(){
          TweenMax.to($(this), .65, { opacity:1, ease: Linear.easeInOut})
          isMouseEntered = false;
        })
        TweenMax.to(_this.$activeDepth02.find(_this.adBannerClass), .45, { opacity:1, ease: Linear.easeInOut })
      }})
    }
    function handleMouseLeaved() {
      _this.$depth02.removeClass(_this.activeClass);
      TweenMax.set(_this.$depth02MenuWrap, { opacity:0, scaleY: 0 })
      TweenMax.set([ _this.$depth02.find(_this.depth02ChildClass),  _this.$depth02.find(_this.adBannerClass)], { opacity:0, ease: Linear.easeInOut })
      isMouseEntered = false;
    }

    _this.$menu.off(_this.events.MOUSE_ENTER_MENU).on(_this.events.MOUSE_ENTER_MENU, handleMouseEntered);
    _this.$depth02MenuWrap.off(_this.events.MOUSE_LEAVE_MENU).on(_this.events.MOUSE_LEAVE_MENU, handleMouseLeaved);
  }
}
App.allMenu = {
  events: {
    CLICK_ALL_MENU: "click.allMenu"
  },
  init: function() {
    this.btnAllMenuClass = "btnFullMenu";
    this.btnAllMenuCloseClass = "icoFullMenuClose btnFullMenuClose";
    this.allMenuClass = ".allMenu";
    this.gridClass = ".grid-all-menu";
    this.gridItemClass = ".grid-item";
    this.activeClass = "active";

    this.$btnAllMenu = App.$body.find("." + this.btnAllMenuClass);
    this.$allMenu = App.$body.find(this.allMenuClass);
    this.$grid = App.$body.find(this.gridClass);

    this.masonry;


    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    function handleClicked() {
      var $this = $(this);
      if($this.hasClass(_this.btnAllMenuClass)) {
        $this.removeClass(_this.btnAllMenuClass).addClass(_this.btnAllMenuCloseClass);
        _this.$allMenu.addClass(_this.activeClass);
        if(!_this.masonry) {
          _this.masonry = new Masonry(_this.gridClass, {
            itemSelector: _this.gridItemClass,
            gutter: 70,
            columnWidth: 300,
          })
        }
        TweenMax.delayedCall(.1, function(){
          _this.$grid.find(_this.gridItemClass).each(function(idx){
            TweenMax.to($(this), .75, { y:0 + "%", opacity:1, delay:.1 * idx, ease: Quint.easeOut })
          })
        })
      } else {
        $this.removeClass(_this.btnAllMenuCloseClass).addClass(_this.btnAllMenuClass);
        _this.$allMenu.removeClass(_this.activeClass);
        TweenMax.set(_this.$grid.find(_this.gridItemClass), { y: 35 + "%", opacity: 0 })
      }
    }
    _this.$btnAllMenu.off(_this.events.CLICK_ALL_MENU).on(_this.events.CLICK_ALL_MENU, handleClicked)
  }
}

App.topButton = {
  events: {
    SCROLL_TO_TOP: "scroll.toTop",
    CLICK_TO_TOP: "click.toTop",
  },
  init: function (){
    this.btnToTopClass = ".btnToTop";
    this.footerClass = "#footer";
    this.btnToTopActiveClass = "active";
    this.$btnToTop = App.$body.find(this.btnToTopClass);
    this.$footer = App.$body.find(this.footerClass);

    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    function handleScroll() {
      var viewTop = $(this).scrollTop(),
          viewHeight = $(this).outerHeight(true),
          viewBottom = viewTop + viewHeight;

      var elementTop = _this.$footer.offset().top,
          elemmentHeight = _this.$footer.outerHeight(true),
          elementBottom = elementTop + elemmentHeight;

      if(viewTop > 0) {
        TweenMax.to(_this.$btnToTop, .45, { opacity:1, ease: Linear.easeInOut })
        if((elementBottom >= viewTop) && (elementTop <= viewBottom)) {
          _this.$btnToTop.addClass(_this.btnToTopActiveClass)
        } else {
          _this.$btnToTop.removeClass(_this.btnToTopActiveClass);
        }
      } else {
        TweenMax.to(_this.$btnToTop, .45, { opacity:0, ease: Linear.easeInOut })
        _this.$btnToTop.removeClass(_this.btnToTopActiveClass);
      }
    }
    function handleClicked() {
      TweenMax.to($("html, body"), .65, { scrollTop: 0, ease: Power1.easeOut });
    }
    _this.$btnToTop.off(_this.events.CLICK_TO_TOP).on(_this.events.CLICK_TO_TOP, handleClicked);
    App.$window.off(_this.events.SCROLL_TO_TOP).on(_this.events.SCROLL_TO_TOP, handleScroll);
  }
}

App.cart = {
  events: {
    MOUSE_ENTER_CART: "mouseenter.cart",
    MOUSE_LEAVE_CART: "mouseleave.cart"
  },
  init: function() {
    this.btnCartClass = ".btnCart";
    this.layerCartClass = ".layerTyCart";

    App.$body = App.$body || $("body");

    this.$btnCart = App.$body.find(this.btnCartClass);
    this.$layerCart = App.$body.find(this.layerCartClass);

    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    function handleMouseEntered() {
      _this.$layerCart.show();
    }
    function handleMouseLeaved() {
      _this.$layerCart.hide();
    }
    _this.$btnCart.off(_this.events.MOUSE_ENTER_CART).on(_this.events.MOUSE_ENTER_CART, handleMouseEntered);
    _this.$layerCart.off(_this.events.MOUSE_LEAVE_CART).on(_this.events.MOUSE_LEAVE_CART, handleMouseLeaved);
  }
}

App.search = {
  events: {
    CLICK_SEARCH_BOX_OPEN: "click.searchBoxOpen",
    CLICK_SEARCH_BOX_CLOSE: "click.searchBoxClose",
  },

  init: function() {
    this.searchBoxClass = ".searchBox";
    this.layerSearchClass = ".layerTySearch";
    this.btnSearchCloseClass = ".btnSearchClose";

    this.$mainSearchBox = App.$header.find(this.searchBoxClass);
    this.$layerSearch = App.$body.find(this.layerSearchClass);
    this.$btnSearchClose = this.$layerSearch.find(this.btnSearchCloseClass);

    this.addEvents();
  },
  addEvents: function () {
    var _this = this;
    _this.$mainSearchBox.off(_this.events.CLICK_SEARCH_BOX_OPEN).on(_this.events.CLICK_SEARCH_BOX_OPEN, _.bind(_this.handleOpenClicked, _this));
    _this.$btnSearchClose.off(_this.events.CLICK_SEARCH_BOX_CLOSE).on(_this.events.CLICK_SEARCH_BOX_CLOSE, _.bind(_this.handleCloseClicked, _this));
  },
  handleOpenClicked: function() {
    var _this = this;
    App.$window.scrollTop(0);
    TweenMax.set(_this.$layerSearch, { zIndex: 300 })
    TweenMax.to(_this.$layerSearch, .65, { opacity:1, ease: Power4.easeOut })
    TweenMax.set(App.$body, { overflow: 'hidden' })
  },
  handleCloseClicked: function() {
    var _this = this;
    TweenMax.to(_this.$layerSearch, .65, { opacity:0, ease: Power4.easeOut, onComplete: function() {
      TweenMax.set(_this.$layerSearch, { zIndex: -1 })
      App.$body.removeAttr("style");

    }});
  }
}

App.tabs = {
  events: {
    CLICK_TAB: 'click.tab'
  },
  init: function() {
    this.wrapperClass = '.tabWrap';
    this.tabClass = '.tab';
    this.btnTabClass = '.btnTab';
    this.tabConClass = '.tabCon';
    this.activeClass = 'on';

    this.$wrapper = App.$body.find(this.wrapperClass);
    this.$btnTab = this.$wrapper.find(this.btnTabClass);
    this.$tabCon = this.$wrapper.find(this.tabConClass);

    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    function handleClicked() {
      var activeIndex = parseInt($(this).parent(_this.tabClass).index());
      $(this).parent(_this.tabClass).addClass(_this.activeClass).siblings().removeClass(_this.activeClass);
      _this.$tabCon.removeClass(_this.activeClass).eq(activeIndex).addClass(_this.activeClass);
    }
    _this.$btnTab.off(_this.events.CLICK_TAB).on(_this.events.CLICK_TAB, handleClicked)
  }
}

/**
 * @params { String } el
 * @params { Array } count
 * @params { Object } styles 
 */

App.Image360VR = function Image360VR(el, styles) {
  this.$el = el;
  this.count = 0;
  this.currPos = 0;

  styles && TweenMax.set(this.$el, styles)

  this._init();
}

App.Image360VR.utils = {
  getCurrentPos: function(e) {
    var x = 0, y= 0, rect = this.$el.get(0).getBoundingClientRect();
      x = (e.pageX - rect.left) - window.pageXOffset;
      y = (e.pageY - rect.top) - window.pageYOffset
      return {
        x: x,
        y: y
      };
  }
}

App.Image360VR.events = {
  CLICK_PREV_360_VR: 'click.prev',
  CLICK_NEXT_360_VR: 'click.next',
  MOUSE_DOWN_360_VR: 'mousedown.360vr',
  MOUSE_MOVE_360_VR: 'mousemove.360vr',
  MOUSE_UP_360_VR: 'mouseup.360vr',
}

App.Image360VR.prototype._init = function() {
  var _this = this;
  _this.preloadWrapperClass = '.img-360vr-preload';

  _this.btn360VRPrevClass = '.btn-360vr-prev';
  _this.btn360VRNextClass = '.btn-360vr-next';
  _this.overlayClass = '.overlay';

  _this.$preloadWrapper = _this.$el.find(_this.preloadWrapperClass);
  _this.$btn360VRPrev = _this.$el.find(_this.btn360VRPrevClass);
  _this.$btn360VRNext = _this.$el.find(_this.btn360VRNextClass);

  _this.distance = 40;
  _this.isMouseDown = false;

  _this.canvasEl = _this.$el.find(".canvas");
  // _this.ctx = _this.canvasEl.getContext("2d");

  _this.$el.append("<div class='overlay'></div>")

  _this.visible = false;

  _this.$btn360VRPrev.show();
  _this.$btn360VRNext.show();

  _this.$overlay = _this.$el.find(_this.overlayClass);

  _this.imageLen = _this.$preloadWrapper.find("img").length || 0;

  TweenMax.delayedCall(.1, function(){
    _this.render();
  })


  _this._addEvents();
}

App.Image360VR.prototype._addEvents = function() {
  var _this = this;

  _this.$overlay.off(App.Image360VR.events.MOUSE_DOWN_360_VR).on(App.Image360VR.events.MOUSE_DOWN_360_VR,  function(e){
    _this.handleMouseDown.apply(_this, [e]);
  })

  _this.$overlay.off(App.Image360VR.events.MOUSE_MOVE_360_VR).on(App.Image360VR.events.MOUSE_MOVE_360_VR, function(e){
    _this.handleMouseMove.apply(_this, [e]);
  })

  $(document).on(App.Image360VR.events.MOUSE_UP_360_VR, function(){
    _this.handleMouseUp.apply(_this);
  })

  _this.$btn360VRPrev.off(App.Image360VR.events.CLICK_PREV_360_VR).on(App.Image360VR.events.CLICK_PREV_360_VR, function(){
    _this.handlePrevClicked.apply(_this)
  })
  _this.$btn360VRNext.off(App.Image360VR.events.CLICK_NEXT_360_VR).on(App.Image360VR.events.CLICK_NEXT_360_VR, function(){
    _this.handleNextClicked.apply(_this)
  })
}
/**
 * @param { Array } data - Image name Array
 * @param { Object } options - Image path ext option
 * @command [Instance].create([imageName, imageName, imageName], { basePath: "/inc/images", ext: "png"})
 */

App.Image360VR.prototype.create = function(data, options) {
  var _this = this, fragment = document.createDocumentFragment();

  _this.imageData = data;
  _this.basePath = options.basePath || "";
  _this.options = options;
  _this.imageLen = data.length;

  _.each(_this.imageData, function(value){
    var image = new Image();
    image.src = _this.basePath + value + '.' + _this.options.ext;
    fragment.appendChild(image);
  })

  _this.$preloadWrapper.html("").append(fragment);

  TweenMax.delayedCall(.1, function(){
    _this.render();
  })
  
}


App.Image360VR.prototype.handleMouseDown = function(e) {
  var _this = this;
  _this.isMouseDown = true;
  _this.currPos = App.Image360VR.utils.getCurrentPos.apply(_this, [e]);
}

App.Image360VR.prototype.handleMouseMove = function(e){
  var _this = this;

  if(!_this.isMouseDown) return;
    var pos = App.Image360VR.utils.getCurrentPos.apply(_this, [e]);
    if(Math.abs(pos.x - _this.currPos.x) >= _this.distance) {
      if (pos.x >= _this.currPos.x) {
        _this.count++;
        if(_this.count > _this.imageLen - 1) {
          _this.count = 0
        }
      } else {
        _this.count--;
        if(_this.count < 0) {
          _this.count = _this.imageLen - 1;
        }
      }
      _this.render();
      _this.currPos = pos;
    }
}

App.Image360VR.prototype.handleMouseUp = function() {
  var _this = this;
  _this.isMouseDown = false;
}

App.Image360VR.prototype.handlePrevClicked = function() {
  var _this = this;
  _this.count--;
  if(_this.count < 0) {
    _this.count = _this.imageLen - 1;
  }
  _this.render();
}

App.Image360VR.prototype.handleNextClicked = function() {
  var _this = this;
  _this.count++;
  if(_this.count > _this.imageLen - 1) {
    _this.count = 0
  }
  _this.render();
}

App.Image360VR.prototype.render = function() {
  var _this = this, src = _this.$preloadWrapper.find("img").eq(_this.count).attr("src");
  _this.canvasEl.attr("src", src)
  // _this.ctx.drawImage(_this.$preloadWrapper.find("img").eq(_this.count).get(0), 0, 0 )
}

App.Image360VR.prototype.show = function() {
  this.visible = true;
  this.$el.addClass("active");
}

App.Image360VR.prototype.hide = function() {
  this.visible = false;
  this.$el.removeClass("active")
  this.count = 0;
  this.render();
}

App.Image360VR.prototype.isVisible = function() {
  return this.visible;
}

App.ImageZoom = function ImageZoom(el) {
  this.$el = el;
  this._init();
}
App.ImageZoom.prototype.utils = {
  getCursorPos: function(e) {
    var x = 0, y= 0, rect = this.$el.get(0).getBoundingClientRect();
    x = (e.pageX - rect.left) - window.pageXOffset;
    y = (e.pageY - rect.top) - window.pageYOffset
    return {
      x: x,
      y: y
    };
  }
}

App.ImageZoom.prototype.events = {
  MOUSE_ENTER_ZOOM: 'mouseenter.zoom',
  MOUSE_MOVE_ZOOM: 'mousemove.zoom',
  MOUSE_LEAVE_ZOOM: 'mouseleave.zoom'
}
App.ImageZoom.prototype._init = function() {
  var _this = this;
  _this.wrapperClass = '.img-zoom-viewer';
  _this.imgViewerClass = '.img-viewer';
  _this.imgZoomAreaClass = '.img-zoom-area';
  _this.zoomViewerClass = '.zoom-viewer';

  _this.$imgViewer = _this.$el.find(_this.imgViewerClass);
  _this.$imgZoomArea = _this.$el.find(_this.imgZoomAreaClass);
  _this.$zoomViewer = _this.$el.find(_this.zoomViewerClass);

  _this.isZoomStart = false;

  var width =  _this.$imgViewer.find("img").get(0).offsetWidth || 500, // [2019-07-20] 수정
      height =  _this.$imgViewer.find("img").get(0).offsetHeight || 500; // [2019-07-20] 수정

  _this.params = {
    cx: _this.$zoomViewer.outerWidth(true) / _this.$imgZoomArea.outerWidth(true),
    cy: _this.$zoomViewer.outerHeight(true) / _this.$imgZoomArea.outerHeight(true),
    src: _this.$imgViewer.find("img").attr("src")
  }

  TweenMax.set(_this.$zoomViewer, { 
    backgroundImage: 'url("'+ _this.params.src +'")', // [2019-07-20] 수정
    backgroundSize: (width * _this.params.cx) + "px " + (height * _this.params.cy) + "px",
  })

  _this._addEvents();

}

App.ImageZoom.prototype._addEvents = function() {
  var _this = this;
  function handleZoomAreaEnter() {
    _this.isZoomStart = true;
    _this.$imgZoomArea.css({opacity:1 });
    _this.$zoomViewer.show();
  }

  function handleZoomAreaMove(e) {
    if(!_this.isZoomStart) return;

    var pos = _this.utils.getCursorPos.apply(_this, [e]), 
        x, 
        y,
        zoomWidth = _this.$imgZoomArea.outerWidth(true),
        zoomHeight = _this.$imgZoomArea.outerHeight(true),
        viewerWidth = _this.$imgViewer.outerWidth(true),
        viewerHeight = _this.$imgViewer.outerHeight(true);

    x = pos.x - ( zoomWidth / 2);
    y = pos.y - ( zoomHeight / 2);

    if (x > viewerWidth - zoomWidth) { x = viewerWidth - zoomWidth }
    if (x < 0) { x = 0; }
    if (y > viewerHeight - zoomHeight ) { y = viewerHeight - zoomHeight }
    if (y < 0) { y = 0; }

    TweenMax.set(_this.$imgZoomArea, { y: y, x: x })
    
    TweenMax.set(_this.$zoomViewer, {
      backgroundPositionX: '-' + (x * _this.params.cx) + "px",
      backgroundPositionY: '-' + (y * _this.params.cy) + "px"
    })
  }

  function handleZoomAreaEnd() {
    _this.isZoomStart = false;
    _this.$imgZoomArea.css({ opacity:0 });
    _this.$zoomViewer.hide();
  }

  _this.$el.off(_this.events.MOUSE_ENTER_ZOOM).on(_this.events.MOUSE_ENTER_ZOOM, handleZoomAreaEnter);
  _this.$el.off(_this.events.MOUSE_MOVE_ZOOM).on(_this.events.MOUSE_MOVE_ZOOM, handleZoomAreaMove);
  _this.$el.off(_this.events.MOUSE_LEAVE_ZOOM).on(_this.events.MOUSE_LEAVE_ZOOM, handleZoomAreaEnd);

}
App.ImageZoom.prototype.changeSource = function(src) {
  var _this = this;
  TweenMax.set(_this.$zoomViewer, { backgroundImage: 'url("'+ src +'")' }) // [2019-07-20] 수정
}

App.ProductView = function ProductView(el) {
  this.$el = $(el);
  this._init();
}

App.ProductView.prototype.events = {
  CLICK_THUMB: 'click.thumb',
  CLICK_RUN_360_VR: 'click.run',
}

App.ProductView.prototype._init = function() {
  var _this = this;
  _this.swiperContainerClass = 'swiper-container-thumb';
  _this.swiperWrapperClass = 'swiper-wrapper-thumb';
  _this.swiperSlideClass = 'swiper-slide-thumb';
  _this.btnPrevClass = '.swiper-button-prev';
  _this.btnNextClass = '.swiper-button-next';

  _this.thumbActiveClass = 'on';

  _this.viewWrapClass = '.viewWrap';
  _this.viewClass = '.view';

  _this.vrClass = '.img-360vr-area'
  _this.btn360VRRunClass = '.btn-360vr-run';
  _this.btn360VRBackClass = 'back';

  _this.$thumb = _this.$el.next().find("." + _this.swiperSlideClass)
  _this.$viewWrap = _this.$el.find(_this.viewWrapClass);
  _this.$btn360VRRun = _this.$el.find(_this.btn360VRRunClass);
  
  _this.swiperEl = new Swiper(_this.$el.next().find("." + _this.swiperContainerClass), {
    containerModifierClass: _this.swiperContainerClass,
    wrapperClass: _this.swiperWrapperClass,
    slideClass: _this.swiperSlideClass,
    direction: 'vertical',
    slidesPerView: 5,
    slidePerGroup: 5,
    spaceBetween: 10,
    allowTouchMove: false,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    freemode: true,
    navigation: {
      nextEl: _this.$el.next().find("." + _this.swiperContainerClass).find(_this.btnNextClass).get(0),
      prevEl: _this.$el.next().find("." + _this.swiperContainerClass).find(_this.btnPrevClass).get(0),
      disabledClass: _this.thumbActiveClass
    },
    on: {
      init: function() {
        var activeIndex = this.activeIndex;
        _this.$thumb.removeClass(_this.thumbActiveClass).eq(activeIndex).addClass(_this.thumbActiveClass);
        _this.$viewWrap.find(_this.viewClass).removeClass(_this.thumbActiveClass).eq(activeIndex).addClass(_this.thumbActiveClass);
      },
    }
  })

  TweenMax.delayedCall(2, function(){ // [2019-07-20] 추가
    if(hasJqueryObject(_this.$el.find(_this.vrClass)) && hasJqueryObject(_this.$el.find(".img-360vr-preload img"))) {
      _this.VR =  new App.Image360VR(_this.$el.find(_this.vrClass), {
        height: _this.$viewWrap.find(_this.viewClass).eq(0).outerHeight(true) || 500, 
      })
    }  
    _this.ImageZoom = new App.ImageZoom(_this.$el.find(".img-zoom-viewer"));
    _this._addEvents();
  })
    
}

App.ProductView.prototype._addEvents = function() {
  var _this = this;
  function handleThumbClicked() {
    if(_this.VR && _this.VR.isVisible()) _this.$btn360VRRun.trigger(_this.events.CLICK_RUN_360_VR);
    
    var idx = $(this).parent().index();
    $(this).parent().addClass(_this.thumbActiveClass).siblings().removeClass(_this.thumbActiveClass)
    _this.$viewWrap.find(_this.viewClass).removeClass(["img-viewer", _this.thumbActiveClass].join(" ")).eq(idx).addClass(_this.thumbActiveClass);
    
    var src = _this.$viewWrap.find(_this.viewClass).eq(idx).find("img").attr("src");
    
    _this.ImageZoom.changeSource(src);
  }
  function handleClicked() {
    if(!_this.VR) return;

    if($(this).toggleClass(_this.btn360VRBackClass).hasClass(_this.btn360VRBackClass)) {
      _this.VR && _this.VR.show();
    } else {
      _this.VR && _this.VR.hide();
    }
  }
  _this.$btn360VRRun.off(_this.events.CLICK_RUN_360_VR).on(_this.events.CLICK_RUN_360_VR, handleClicked)
  _this.$thumb.find("button").off(_this.events.CLICK_THUMB).on(_this.events.CLICK_THUMB, handleThumbClicked)
}


App.products = {
  main: {
    init: function() {
      var _this = this;
      this.swiperContainerClass = 'swiper-container-product';
      this.swiperWrapperClass = 'swiper-wrapper-product';
      this.swiperSlideClass = 'swiper-slide-product';
      this.btnPrevClass = '.swiper-button-prev';
      this.btnNextClass = '.swiper-button-next';
      this.paginationClass = '.swiper-pagination'

      this.all = [];

      $('.' + this.swiperContainerClass).each(function() {
        var s = new Swiper($(this), {
          containerModifierClass: _this.swiperContainerClass,
          wrapperClass: _this.swiperWrapperClass,
          slideClass: _this.swiperSlideClass,
          slidesPerView: $(this).hasClass("swiper-container-main-product") ? 5 : 4, // 메인 페이지, 서브 페이지 구분
          slidesPerGroup: $(this).hasClass("swiper-container-main-product") ? 5 : 4,
          spaceBetween: 30,
          allowTouchMove: false,
          navigation: {
            nextEl: $(this).find(_this.btnNextClass).get(0),
            prevEl: $(this).find(_this.btnPrevClass).get(0)
          },
          pagination: {
            el: $(this).find(_this.paginationClass).get(0),
            type: 'fraction',
            renderFraction: function (currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                     '<span> / </span>' +
                     '<span class="' + totalClass + '"></span>';
          }
          },
        })
        _this.all.push(s)
      })
    }
  },
  list: {
    events: {
      CLICK_CHANGE_VIEW: 'click.changeView'
    },
    init: function() {
      this.productListViewClass = '.productListView';
      this.btnChangeViewClass = '.btnChangeView';
      this.smallViewClass = 'viewTySM';
      this.bigViewClass = 'viewTyBG';
      this.viewClasses = [this.smallViewClass, this.bigViewClass];
      this.activeClass = 'on';

      this.$productList = App.$body.find(this.productListViewClass);
      this.$btnChangeView = App.$body.find(this.btnChangeViewClass);

      this.addEvents();
    },
    addEvents: function() {
      var _this = this;
      function handleClicked() {
        var viewType = $(this).attr("data-view-type");
        _this.$productList.removeClass(_this.viewClasses.join(" ")).addClass(viewType);
        $(this).addClass(_this.activeClass).siblings(_this.btnChangeViewClass).removeClass(_this.activeClass);
      }

      _this.$btnChangeView.off(_this.events.CLICK_CHANGE_VIEW).on(_this.events.CLICK_CHANGE_VIEW, handleClicked)

    }
  },
  combo: {
    init: function (){
      var _this = this;
      this.swiperContainerClass = 'swiper-container-option';
      this.swiperWrapperClass = 'swiper-wrapper-option';
      this.swiperSlideClass = 'swiper-slide-option';
      this.btnPrevClass = '.swiper-button-prev';
      this.btnNextClass = '.swiper-button-next';

      this.all = [];

      $('.' + this.swiperContainerClass).each(function() {
        var s = new Swiper($(this), {
          containerModifierClass: _this.swiperContainerClass,
          wrapperClass: _this.swiperWrapperClass,
          slideClass: _this.swiperSlideClass,
          width: 75,
          spaceBetween: 10,
          allowTouchMove: false,
          slideToClickedSlide: true,
          navigation: {
            nextEl: $(this).find(_this.btnNextClass).get(0),
            prevEl: $(this).find(_this.btnPrevClass).get(0)
          },
        })
        _this.all.push(s)
      })
    }
  }
}

App.starPoints = {
  events: {
    MOUSE_DOWN_STAR_POINT: 'mousedown.starpoint',
    MOUSE_MOVE_STAR_POINT: 'mousemove.starpoint',
    MOUSE_UP_STAR_POINT: 'mouseup.starpoint'
  },
  utils: {
    getCurrentPosX: function(e) {
      var x = 0, rect = this.$wrapper.get(0).getBoundingClientRect();
      x = (e.pageX - rect.left)- window.pageXOffset;
      return x;
    }
  },
  init: function() {
    var _this = this;

    _this.wrapperClass = '.star-point-wrap';
    _this.childClass = '.star-point';
    _this.childActiveClass = 'star-point-active';
  
    _this.isMouseMoveStart = false;

    _this.$wrapper = App.$body.find(_this.wrapperClass);
    _this.$child = _this.$wrapper.find(_this.childClass);

    _this.grid = [];

    _this.$child.each(function(idx){
      _this.grid.push($(this).outerWidth(true) * idx);
    })

    _this.addEvents();

  },
  addEvents: function() {
    var _this = this;
    function handleMouseDown() {
      _this.isMouseMoveStart = true;
    }
    function handleMouseMove(e) {
      if(!_this.isMouseMoveStart) return;

      var pos = _this.utils.getCurrentPosX.apply(_this, [e]);

      _this.$child.each(function(idx){
        var offsetLeft = _this.grid[idx];
        
        if(offsetLeft < pos) {
          $(this).addClass(_this.childActiveClass)
        } else {
          if (pos < 0) return;
          $(this).removeClass(_this.childActiveClass);
        }
      })
    }
    function handleMouseUp() {
      _this.isMouseMoveStart = false;
    }
    function handleStarPointMouseDown() {
      var index = $(this).index();
      _this.$child.removeClass(_this.childActiveClass);
      for(var i = 0; i <= index; i++) {
        _this.$child.eq(i).addClass(_this.childActiveClass);
      }
    }

    _this.$wrapper.off(_this.events.MOUSE_DOWN_STAR_POINT).on(_this.events.MOUSE_DOWN_STAR_POINT, handleMouseDown);
    _this.$wrapper.off(_this.events.MOUSE_MOVE_STAR_POINT).on(_this.events.MOUSE_MOVE_STAR_POINT, handleMouseMove);
    $(document).off(_this.events.MOUSE_UP_STAR_POINT).on(_this.events.MOUSE_UP_STAR_POINT, handleMouseUp);
    _this.$child.off(_this.events.MOUSE_DOWN_STAR_POINT).on(_this.events.MOUSE_DOWN_STAR_POINT, handleStarPointMouseDown);
  }
}

App.colorList = {
  events: {
    CLICK_COLOR: 'click.color'
  },
  init: function() {
    this.wrapperClass = '.colorList';
    this.colorClass = '.color';
    this.activeClass = "active"
    
    this.$wrapper = App.$body.find(this.wrapperClass);
    this.$color = this.$wrapper.find(this.colorClass);
    
    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    function handleClicked() {
      $(this).addClass(_this.activeClass).siblings().removeClass(_this.activeClass)
    }
    _this.$color.off(_this.events.CLICK_COLOR).on(_this.events.CLICK_COLOR, handleClicked);
  }
}

App.popup = {
  params: {
    zIndex: {
      dim: 200,
      popup: 300,
    }
  },
  events: {
    CLICK_OPEN_POPUP: 'click.openPopup',
    CLICK_CLOSE_POPUP: 'click.closePopup',
  },
  init: function() {
    this.wrapperClass = "[class*='popTy']";
    this.btnPopOpenClass = '.btnPopOpen';
    this.btnPopCloseClass = '.btnPopClose';

    this.$wrapper = App.$body.find(this.wrapperClass);
    this.$btnPopOpen = App.$body.find(this.btnPopOpenClass);
    this.$btnPopClose = this.$wrapper.find(this.btnPopCloseClass);

    this.addEvents();
  },
  addEvents: function() {
    var _this = this;

    $(document).off(_this.events.CLICK_OPEN_POPUP).on(_this.events.CLICK_OPEN_POPUP, _this.btnPopOpenClass, function(){
      var id = $(this).attr("data-id");
      _this.handleOpenPopup.apply(_this, [id])
    })

    $(document).off(_this.events.CLICK_CLOSE_POPUP).on(_this.events.CLICK_CLOSE_POPUP, _this.btnPopCloseClass, function() {
      var id = $(this).parents(_this.wrapperClass).attr("id");
      _this.handleClosePopup.apply(null, [id])
    });
  },
  handleOpenPopup: function(id) {
    if(!hasJqueryObject($("#" + id))) return false;

    TweenMax.set(App.$dim, { zIndex: this.params.zIndex.dim })
    console.log(id)
    TweenMax.set($("#" + id), { zIndex: this.params.zIndex.popup })
    TweenMax.to($("#" + id), .45, { opacity:1, ease: Power1.easeOut })
    TweenMax.to(App.$dim, .65, { opacity:1, ease: Linear.easeInOut})

    // [2019-07-12] 개발 확인 용 확인 후 삭제 부탁드립니다.
    if(id === 'quickView') {
      new App.ProductView($("#" + id).find("[id*='productView0']"));
    }

  },
  handleClosePopup: function(id) {
    if(!hasJqueryObject($("#" + id))) return false;
    TweenMax.to(App.$dim, .65, { opacity:0, ease: Linear.easeInOut, onComplete: function(){
      App.$dim.removeAttr("style");
    }})
    TweenMax.to($("#" + id), .45, { opacity:0, ease: Power1.easeOut, onComplete: function() {
      TweenMax.set($("#" + id), { zIndex: -1, })
    }})
  }
}

App.tooltip = {
  events: {
    CLICK_TOOLTIP: 'click.tooltip'
  },
  init: function() {
    this.btnTooltipClass = '.btnTooltip';
    this.toolTipClass = '.tooltipBox';
    this.toggleClass = 'on';

    this.$btnTooltip = App.$body.find(this.btnTooltipClass);
    
    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    
    function handleClicked() {
      if($(this).toggleClass(_this.toggleClass).hasClass(_this.toggleClass)) {
        $(this).next(_this.toolTipClass).show();
      } else {
        $(this).next(_this.toolTipClass).hide();
      }
    }

    _this.$btnTooltip.off(_this.events.CLICK_TOOLTIP).on(_this.events.CLICK_TOOLTIP, handleClicked);
  }
}

App.mainSwiper = {
  events: {
    CLICK_PLAY_PAUSE: 'click.play',
  },
  init: function() {
    var _this = this;
    _this.wrapperClass = '.mainVisual';
    _this.swiperContainerClass = '.swiper-container-visual';
    _this.swiperWrapperClass = 'swiper-wrapper-visual';
    _this.swiperSlideClass = 'swiper-slide-visual';
    _this.btnNextClass = '.swiper-button-next';
    _this.btnPrevClass = '.swiper-button-prev'
    _this.btnPauseClass = '.icoPause';
    _this.paginationClass = '.swiper-pagination';
    _this.$wrap = App.$body.find(_this.wrapperClass);

    _this.swiperOptions = {
      containerModifierClass: _this.swiperContainerClass,
      wrapperClass: _this.swiperWrapperClass,
      slideClass: _this.swiperSlideClass,
      speed: 600,
      allowTouchMove: false,
      loop: true,
      navigation: {
        nextEl: _this.$wrap.find(_this.btnNextClass).get(0),
        prevEl: _this.$wrap.find(_this.btnPrevClass).get(0)
      },
      pagination: {
        el: _this.$wrap.find(_this.paginationClass).get(0),
        type: 'fraction',
        renderFraction: function (currentClass, totalClass) {
          return '<span class="' + currentClass + '"></span>' +
                  '<span> / </span>' +
                  '<span class="' + totalClass + '"></span>';
        }
      },
      autoplay: {
        delay: 3000,
      },
      on: {
        init: function() {
          var swiper = this;
          function handlePlayPause() {
            if($(this).toggleClass("on").hasClass("on")) {
              swiper.autoplay.stop();
            } else {
              swiper.autoplay.start();
            }
          }
          
          _this.$wrap.off(_this.events.CLICK_PLAY_PAUSE).on(_this.events.CLICK_PLAY_PAUSE, _this.btnPauseClass, handlePlayPause)
        }
      }
    }

    _this.el = new Swiper(_this.swiperContainerClass, _this.swiperOptions)
  
  }
}

App.floatingTotal = {
  events: {
    SCROLL_FLOATING_TOTAL: "scroll.floating"
  },
  init: function() {
    this.wrapperClass = ".totalSummary";

    this.$wrap = $(".checkoutWrap").find(this.wrapperClass);

    this.defaultsOffsetTop = this.$wrap.offset().top;

    this.addEvents();
  },
  addEvents: function() {
    var _this = this;
    function handleScroll() {
      var sTop = $(this).scrollTop(), gap = 0;
      if(sTop >= _this.defaultsOffsetTop) {
        gap = sTop - _this.defaultsOffsetTop;
        TweenMax.to(_this.$wrap, .35, { y: gap + 20, ease: Power4.easeOut })
      } else {
        TweenMax.to(_this.$wrap, .35, { y: 0, ease: Power4.easeOut })
      }
    }
    App.$window.off(_this.events.SCROLL_FLOATING_TOTAL).on(_this.events.SCROLL_FLOATING_TOTAL, handleScroll);
    App.$window.trigger(_this.events.SCROLL_FLOATING_TOTAL)
  }
}

$(function(){
  App.$window = $(window);
  App.$body = $("body");
  App.$header = $("#header");
  App.$dim = $(".dim");
  hasJqueryObject(App.$body.find(".grid")) && App.masonry.init(); // Handle 2depth Menu, SITE MAP 
  hasJqueryObject(App.$body.find("#gnb")) && App.gnb.init(); // Handle GNB
  hasJqueryObject(App.$body.find(".allMenu")) && App.allMenu.init(); // Handle All Menu
  hasJqueryObject(App.$body.find(".btnToTop")) && App.topButton.init(); // Handle Top Button
  hasJqueryObject(App.$body.find(".layerTyCart")) && App.cart.init(); // Handle 2depth Menu Cart Layer
  hasJqueryObject(App.$body.find(".layerTySearch")) && App.search.init(); // Handle Search Layer
  hasJqueryObject(App.$body.find(".tabWrap")) && App.tabs.init(); // Handle Tab
  hasJqueryObject(App.$body.find(".swiper-container-product")) && App.products.main.init(); // Create Product Main Swiper
  hasJqueryObject(App.$body.find(".productListView")) && App.products.list.init(); // Product List Change View Type
  hasJqueryObject(App.$body.find(".productComboList")) && App.products.combo.init();  // Create Product Combo Color Thumbnail Swiper
  // hasJqueryObject(App.$body.find(".productViewSection")) && App.products.detail.init(); // Create Product Detail Thumbnail Swiper && Clicked Thumbanil image Zoom Change Source && Clicked Start 360 VR Image
  hasJqueryObject(App.$body.find(".star-point-wrap")) && App.starPoints.init(); // Handle Comment Input Form Star Points
  // hasJqueryObject(App.$body.find(".img-zoom-viewer")) && App.imageZoom.init(); // Create Product Image Zoom Viewer
  hasJqueryObject(App.$body.find(".colorList")) && App.colorList.init(); // Handle Product Detail Color Thumbnail Clicked Activate
  hasJqueryObject(App.$body.find("[class*='popTy']")) && App.popup.init(); // Handle Popup
  hasJqueryObject(App.$body.find(".tooltipBox")) && App.tooltip.init(); // Handle ToolTip
  hasJqueryObject(App.$body.find(".mainVisual")) && App.mainSwiper.init();
  hasJqueryObject(App.$body.find(".checkoutWrap .totalSummary")) && App.floatingTotal.init();

  hasJqueryObject(App.$body.find("[id*='productView0']")) && new App.ProductView("#productView01"); // [2019-07-12] 추가

})
