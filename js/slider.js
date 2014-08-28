Slider = function ( settings ) {

	var self = this;

	this.min = settings.min;
	this.max = settings.max;
	this.values = settings.values;
	this.dimensions = settings.dimensions;
	this.active = ( settings.active !== undefined ) ? settings.active : true;
	this.onChange = settings.onChange;

	this.width = undefined;

	this.domNode = document.createElement( 'div' );
	this.domNode.setAttribute( 'class', 'slider' );
	this.domNode.addEventListener( 'mousedown',  beginDrag, false );
	this.domNode.addEventListener( 'touchstart', beginDrag, false );

	this.sliderbar = document.createElement( 'div' );
	this.sliderbar.setAttribute( 'class', 'sliderbar corners' );
	this.domNode.appendChild( this.sliderbar );

	this.range = document.createElement( 'div' );
	this.domNode.appendChild( this.range );

	this.handles = new Array();

	for ( var i = 0; i < this.values.length; i++ ) {

		this.handles[ i ] = document.createElement( 'div' );
		this.domNode.appendChild( this.handles[ i ] );

		( function () {

			var n = i;
			var callback = function ( event ) {
				beginDrag( event, n );
			};

			self.handles[ i ].addEventListener( 'mousedown',  callback, false );
			self.handles[ i ].addEventListener( 'touchstart', callback, false );

		} )();

	}

	this.setActivation( this.active );
	this.resize();
	this.redraw();

	function beginDrag( event, n ) {

		if ( !self.active ) { return; }

		event.preventDefault();
		event.stopPropagation();

		if ( n === undefined ) {

			n = 0;
			var value = undefined;
			var l = self.values.length;

			if ( l === 1 ) {

				var position = ( event.offsetX || event.layerX ) - 15;
				value = Math.round( position * ( self.max - self.min ) / self.width ) + self.min;

			} else {

				var minDistance = Infinity;
				for ( var i = 0; i < l; i++ ) {

					var displacement = i * 30 / ( l-1 ) + 15;
					var position = ( event.offsetX || event.layerX ) - displacement;
					var vi = Math.round( position * ( self.max - self.min ) / self.width ) + self.min;

					var distance = Math.abs( self.values[ i ] - vi );
					if ( distance < minDistance || ( distance === minDistance && self.values[ i ] < vi ) ) {
						minDistance = distance;
						n = i;
						value = vi;
					}

				}

			}

			self.setValue( n, value );

		}

		var x0 = ( event.clientX !== undefined ) ? event.clientX : ( event.touches && event.touches[ 0 ].clientX );
		var valueStart = self.values[ n ];

		document.addEventListener( 'selectstart', cancelSelect, false );

		document.addEventListener( 'mousemove',   continueDrag, false );
		document.addEventListener( 'touchmove',   continueDrag, false );

		document.addEventListener( 'mouseup',     endDrag, false );
		document.addEventListener( 'touchend',    endDrag, false );
		document.addEventListener( 'touchcancel', endDrag, false );
		document.addEventListener( 'touchleave',  endDrag, false );

		function cancelSelect( event ) {

			event.preventDefault();
			event.stopPropagation();

		}

		function continueDrag( event ) {

			event.preventDefault();
			event.stopPropagation();
			var xt = ( event.clientX !== undefined ) ? event.clientX : ( event.touches && event.touches[ 0 ].clientX );
			var delta = Math.round( ( xt - x0 ) * ( self.max - self.min ) / self.width );
			self.setValue( n, valueStart + delta );

		}

		function endDrag() {

			document.removeEventListener( 'selectstart', cancelSelect, false );

			document.removeEventListener( 'mousemove',   continueDrag, false );
			document.removeEventListener( 'touchmove',   continueDrag, false );

			document.removeEventListener( 'mouseup',     endDrag, false );
			document.removeEventListener( 'touchend',    endDrag, false );
			document.removeEventListener( 'touchcancel', endDrag, false );
			document.removeEventListener( 'touchleave',  endDrag, false );

		}

	}

};

Slider.prototype = {

	constructor: Slider,

	setValue: function ( n, v ) {

		var lowerLimit = ( this.values[ n-1 ] !== undefined ) ? this.values[ n-1 ] : this.min;
		var upperLimit = ( this.values[ n+1 ] !== undefined ) ? this.values[ n+1 ] : this.max;

		v = Math.min( Math.max( v, lowerLimit ), upperLimit );

		if ( v !== this.values[ n ] ) {

			this.values[ n ] = v;
			this.onChange( this.values );
			this.redraw();

		}

	},

	resize: function () {
		this.width = this.dimensions[ 0 ] - ( ( this.values.length > 1 ) ? 60 : 30 );
		this.height = this.dimensions[ 1 ];

		this.domNode.style.width = this.dimensions[ 0 ] + 'px';
		this.domNode.style.height = this.height + 'px';

		for ( var i = 0; i < this.handles.length; i++ ) {
			this.handles[ i ].style.width = this.height + 'px';
			this.handles[ i ].style.height = this.height + 'px';
		}

		this.range.style.height = ( this.height * 0.6 ) + 'px';
		this.range.style.top = ( this.height * 0.2 ) + 'px';
		this.range.style.left = ( this.height * 0.2 ) + 'px';

		this.sliderbar.style.width = ( this.dimensions[ 0 ] - this.height * 0.4 ) + 'px';
		this.sliderbar.style.height = ( this.height * 0.6 ) + 'px';
		this.sliderbar.style.top = ( this.height * 0.2 ) + 'px';
		this.sliderbar.style.left = ( this.height * 0.2 ) + 'px';

	},

	redraw: function () {

		var l = this.values.length;

		if ( l === 1 ) {

			var position = ( this.values[ 0 ] - this.min ) * this.width / ( this.max - this.min );
			this.handles[ 0 ].style.left = position + 'px';
			this.range.style.width = ( position + 9 ) + 'px';

		} else {

			var positions = new Array();

			for ( var i = 0; i < l; i++ ) {

				var p = ( this.values[ i ] - this.min ) * this.width / ( this.max - this.min );
				positions[ i ] = p + i * 30 / ( l-1 );
				this.handles[ i ].style.left = positions[ i ] + 'px';

			}

			this.range.style.left = ( positions[ 0 ] + 15 ) + 'px';
			this.range.style.width = ( positions[ l-1 ] - positions[ 0 ] ) + 'px';

		}

	},

	setActivation: function ( a ) {

		this.active = a;

		var rangeClasses = 'range corners' + ( a ? '' : ' deactivated' );
		this.range.setAttribute( 'class', rangeClasses );

		var handleClasses = 'handle action corners' + ( a ? ' pointer' : ' deactivated' );
		for ( var i = 0; i < this.handles.length; i++ ) {
			this.handles[ i ].setAttribute( 'class', handleClasses );
		}

	}

};

