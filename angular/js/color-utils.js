app.factory( 'ColorUtils', function () {

	var Color = function () {

		this.red   = 0;  // 0 <= red <= 255
		this.green = 0;  // 0 <= green <= 255
		this.blue  = 0;  // 0 <= blue <= 255
		this.hex = '#000000';

	};

	Color.prototype = {

		constructor: Color,

		setRGB: function ( r, g, b ) {

			this.red = r;
			this.green = g;
			this.blue = b;
			this.updateFromRGB();
			return this;

		},

		updateFromRGB: function () {

			this.HexFromRGB();
			return this;

		},

		HexFromRGB: function () {

			this.hex = '#' + (( 1 << 24 ) + ( this.red << 16 ) + ( this.green << 8 ) + this.blue ).toString( 16 ).slice( 1 );
			return this;

		},

		confine: function () {

			this.red   = Math.max( 0, Math.min( 255, this.red ) );
			this.green = Math.max( 0, Math.min( 255, this.green ) );
			this.blue  = Math.max( 0, Math.min( 255, this.blue ) );
			this.updateFromRGB();
			return this;

		},

		add: function ( color ) {

			this.red   += color.red;
			this.green += color.green;
			this.blue  += color.blue;
			this.updateFromRGB();
			return this;

		},

		sub: function ( color ) {

			this.red   -= color.red;
			this.green -= color.green;
			this.blue  -= color.blue;
			this.updateFromRGB();
			return this;

		},

		multiplyScalar: function ( s ) {

			this.red = Math.round( this.red * s );
			this.green = Math.round( this.green * s );
			this.blue = Math.round( this.blue * s );
			this.updateFromRGB();
			return this;

		},

		copy: function ( color2 ) {

			this.red = color2.red;
			this.green = color2.green;
			this.blue = color2.blue;
			this.hex = color2.hex;
			return this;

		},

		clone: function () {

			var newColor = new Color();
			newColor.red = this.red;
			newColor.green = this.green;
			newColor.blue = this.blue;
			newColor.hex = this.hex;
			return newColor;

		}

	};

	var Gradient = function () {

		this.stops = [];

	};

	Gradient.prototype = {

		constructor: Gradient,

		addColorStop: function ( pos, col ) {

			this.stops.push( { position: pos, color: col } );
			this.stops.sort( function ( a, b ) {
				if ( a.position < b.position ) {
					return -1;
				} else if ( a.position > b.position ) {
					return 1;
				} else {
					return 0;
				}
			} );

		},

		colorAt: function ( pos ) {

			var u = 0;
			while ( this.stops[ u ] && pos > this.stops[ u ].position && u < this.stops.length ) {
				u++;
			}
			if ( u === 0 ) {
				return this.stops[ 0 ].color.clone();
			} else if ( u === this.stops.length ) {
				return this.stops[ this.stops.length-1 ].color.clone();
			} else {
				var sL = this.stops[ u-1 ];
				var sU = this.stops[ u ];
				var f = ( pos - sL.position ) / ( sU.position - sL.position );
				return sU.color.clone().sub( sL.color ).multiplyScalar( f ).add( sL.color ).confine();
			}

		}

	};

	return { Color: Color, Gradient: Gradient };

} );

