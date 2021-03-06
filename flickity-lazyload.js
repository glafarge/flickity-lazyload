/*!
 * Flickity lazyLoad v1.0.0
 * enables lazyLoad option for Flickity
 * based on slick approach
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
	/*global define: false, module: false, require: false */
	'use strict';
	// universal module definition

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( [
			'flickity/js/index',
			'fizzy-ui-utils/utils',
		], function( Flickity, utils ) {
			return factory( window, Flickity, utils );
		});
	} 
	else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			window,
			require('flickity'),
			require('fizzy-ui-utils')
		);
	} 
	else {
		// browser global
		window.Flickity = factory(
			window,
			window.Flickity,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, Flickity, utils ) {
	'use strict';

	Flickity.createMethods.push('_createLazyLoad');

	Flickity.prototype._createLazyLoad = function() {
		this.on( 'activate', this.activateLazyLoad );
	}

	Flickity.prototype.activateLazyLoad = function() {
		if ( !this.options.lazyLoad ) {
			return;
		}

		this.previousIndex = null; // Keep it to avoid bad behavior

		this.lazyLoad();
		this.previousIndex = this.selectedIndex;

		function onSelect() { 
			if(this.selectedIndex==this.previousIndex)
				return;

			this.lazyLoad();
			this.previousIndex = this.selectedIndex;
		}
		this.on('cellSelect', onSelect);
	}

	Flickity.prototype.lazyLoad = function() {
		var _this = this;

		function imageLoaded(img) {
			img.removeAttribute('data-lazy');
			classie.remove(img, 'flickity-loading');

			var cell = _this.getParentCell( img );
    		_this.cellSizeChange( cell && cell.element );
		}

		function onImageLoaded(e) {
			var img = e.target;
			eventie.unbind(img, 'load', onImageLoaded);
			imageLoaded(img);
		}

		function onImageLoadedProgressive(e) {
			var img = e.target;
			eventie.unbind(img, 'load', onImageLoadedProgressive);
			imageLoaded(img);

			_this.lazyLoad();
		}

		function loadImage(img, callback) {
			if(img.hasAttribute('data-lazy')) {
				var url = img.getAttribute('data-lazy');
				
				eventie.bind(img, 'load', callback);

				img.src = url;
			}
		}

		function loadImages(rangeStart, rangeEnd) {
			var images = utils.filterFindElements(_this.slider.children);
				images = images.slice(rangeStart, rangeEnd);

			for ( var i=0, len = images.length; i < len; i++ ) { 
				var img = images[i];
				loadImage(img, onImageLoaded);
			}
		}


		// ==========================================
		// INITIALIZATION
		// ==========================================

		// Apply loading class on images that don't have src attribute but data-lazy
		var images = utils.filterFindElements(_this.slider.children, 'img[data-lazy]');
		for( var i=0, len = images.length; i < len; i++ ) {
			var img = images[i];
			if(!img.hasAttribute('src')) {
				classie.add(img, 'flickity-loading');
			}
		}


		// ==========================================
		// LAZY LOAD ON DEMAND
		// ==========================================
		if(_this.options.lazyLoad == 'ondemand') {
			// (ugly hardcoded value) :  
			// by default 2 images loaded around the current
			// TODO : implement as an option OR compute the value
			var wrapNum = 2; 


			var rangeStart = _this.selectedIndex;
			var rangeEnd = rangeStart + wrapNum + 1;
			loadImages(rangeStart, rangeEnd); // load next imgs

			if(_this.options.wrapAround === true) {
				rangeStart -= wrapNum;
				if(rangeStart!=0) loadImages(rangeStart); // load prev imgs
			}
		}

		// ==========================================
		// PROGRESSIVE WAY
		// ==========================================
		else if(_this.options.lazyLoad == 'progressive') {
			var images = utils.filterFindElements(_this.slider.children, 'img[data-lazy]');
			if(images.length > 0) {
				var img = images[0]; // get first child
				loadImage(img, onImageLoadedProgressive);
			}
		}

	};

	return Flickity;

}));
