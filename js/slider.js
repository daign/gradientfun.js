Slider = function ( settings ) {

	var self = this;

	this.value   = settings.value;
	this.domNode = settings.domNode;
	this.active  = ( settings.active !== undefined ) ? settings.active : true;

	this.width = undefined;

	this.domNode.classList.add( 'slider' );
	var n = undefined;
	var myHandle = new Handle(
		this.domNode,
		function ( x0, p0 ) {
			if ( !self.active ) { return; }
			if ( n === undefined ) {

				n = 0;
				var value = undefined;
				var l = self.value.getNumberOfValues();

				if ( l === 1 ) {

					var position = ( event.offsetX || event.layerX ) - 15;
					self.value.setRelative( position / self.width, n );

				} else {

					var minDistance = Infinity;
					for ( var i = 0; i < l; i++ ) {

						var displacement = i * 30 / ( l-1 ) + 15;
						var position = p0 - displacement;
						var vi = position * ( self.value.getMax() - self.value.getMin() ) / self.width + self.value.getMin();

						var distance = Math.abs( self.value.get( i ) - vi );
						if ( distance < minDistance || ( distance === minDistance && self.value.get( i ) < vi ) ) {
							minDistance = distance;
							n = i;
							value = vi;
						}

					}
					self.value.set( value, n );

				}

			}

			self.value.snap( n );
		},
		function ( x0, xt ) {
			self.value.dragRelative( ( xt - x0 ) / self.width, n );
		},
		function () {
			n = undefined;
		}
	);

	var onResize = function () {
		self.resize();
		self.redraw();
	};
	var postponedResize = postpone( onResize, 40, this );
	this.domNode.addEventListener( 'resize', onResize, false );

	var onRedraw = function () {
		self.redraw();
	};
	this.value.addListener( onRedraw );

	this.sliderbar = document.createElement( 'div' );
	this.sliderbar.setAttribute( 'class', 'bar' );
	this.domNode.appendChild( this.sliderbar );

	this.range = document.createElement( 'div' );
	this.domNode.appendChild( this.range );

	this.handles = new Array();

	for ( var i = 0; i < this.value.getNumberOfValues(); i++ ) {

		this.handles[ i ] = document.createElement( 'div' );
		this.domNode.appendChild( this.handles[ i ] );

		( function () {

			var n = i;
			var callback = function ( event ) {
				self.beginDrag( event, n );
			};

			//self.handles[ i ].addEventListener( 'mousedown',  callback, false );
			//self.handles[ i ].addEventListener( 'touchstart', callback, false );
			self.handles[ i ].style.pointerEvents = 'none';

		} )();

	}

	this.setActivation( this.active );
	onResize();
	postponedResize();

};

Slider.prototype = {

	constructor: Slider,

	resize: function () {

		this.width = this.domNode.offsetWidth - ( ( this.value.getNumberOfValues() > 1 ) ? 60 : 30 );
		this.height = this.domNode.offsetHeight;

		for ( var i = 0; i < this.handles.length; i++ ) {
			this.handles[ i ].style.width = this.height + 'px';
			this.handles[ i ].style.height = this.height + 'px';
		}

		this.range.style.height = ( this.height * 0.6 ) + 'px';
		this.range.style.top = ( this.height * 0.2 ) + 'px';
		this.range.style.left = ( this.height * 0.2 ) + 'px';

		this.sliderbar.style.width = ( this.domNode.offsetWidth - this.height * 0.4 ) + 'px';
		this.sliderbar.style.height = ( this.height * 0.6 ) + 'px';
		this.sliderbar.style.top = ( this.height * 0.2 ) + 'px';
		this.sliderbar.style.left = ( this.height * 0.2 ) + 'px';

	},

	redraw: function () {

		var l = this.value.getNumberOfValues();

		if ( l === 1 ) {

			var position = this.width * this.value.getRelative( 0 );
			this.handles[ 0 ].style.left = position + 'px';
			this.range.style.width = ( position + 9 ) + 'px';

		} else {

			var positions = new Array();

			for ( var i = 0; i < l; i++ ) {

				var p = this.width * this.value.getRelative( i );
				positions[ i ] = p + i * 30 / ( l-1 );
				this.handles[ i ].style.left = positions[ i ] + 'px';

			}

			this.range.style.left = ( positions[ 0 ] + 15 ) + 'px';
			this.range.style.width = ( positions[ l-1 ] - positions[ 0 ] ) + 'px';

		}

	},

	setActivation: function ( a ) {

		this.active = a;

		var rangeClasses = 'range' + ( a ? '' : ' deactivated' );
		this.range.setAttribute( 'class', rangeClasses );

		var handleClasses = 'handle' + ( a ? '' : ' deactivated' );
		for ( var i = 0; i < this.handles.length; i++ ) {
			this.handles[ i ].setAttribute( 'class', handleClasses );
		}

	}

};

