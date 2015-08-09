app.factory( 'ColorUtils', function () {

	var CHANNEL_MAX = {
		red:        255,
		green:      255,
		blue:       255,
		hue:        360,
		saturation:   1,
		lightness:    1
	};

	var Color = function () {

		this.red   = 0;  // 0 <= red <= 255
		this.green = 0;  // 0 <= green <= 255
		this.blue  = 0;  // 0 <= blue <= 255
		this.hex   = '#000000';
		this.hue        = 0;  // 0 <= hue < 360
		this.saturation = 0;  // 0 <= saturation <= 1
		this.lightness  = 0;  // 0 <= lightness <= 1
		this.hash = 0;

	};

	Color.prototype = {

		constructor: Color,

		setRGB: function ( r, g, b ) {

			this.red   = r;
			this.green = g;
			this.blue  = b;
			this.updateFromRGB();
			return this;

		},

		setHex: function ( hex ) {

			this.hex = hex;
			this.updateFromHex();
			return this;

		},

		setHSL: function ( h, s, l ) {

			this.hue        = h;
			this.saturation = s;
			this.lightness  = l;
			this.updateFromHSL();
			return this;

		},

		setChannel: function ( c, v ) {

			     if ( c === 'red' )        { this.red   = Math.round( v ); this.updateFromRGB(); }
			else if ( c === 'green' )      { this.green = Math.round( v ); this.updateFromRGB(); }
			else if ( c === 'blue' )       { this.blue  = Math.round( v ); this.updateFromRGB(); }
			else if ( c === 'hue' )        { this.hue        = v; this.updateFromHSL(); }
			else if ( c === 'saturation' ) { this.saturation = v; this.updateFromHSL(); }
			else if ( c === 'lightness' )  { this.lightness  = v; this.updateFromHSL(); }
			return this;

		},

		updateFromRGB: function () {

			this.HexFromRGB();
			this.HSLFromRGB();
			this.calculateHash();
			return this;

		},

		updateFromHex: function () {

			this.RGBFromHex();
			this.HSLFromRGB();
			this.calculateHash();
			return this;

		},

		updateFromHSL: function () {

			this.RGBFromHSL();
			this.HexFromRGB();
			this.calculateHash();
			return this;

		},

		HexFromRGB: function () {

			this.hex = '#' + ( ( 1 << 24 ) + ( this.red << 16 ) + ( this.green << 8 ) + this.blue ).toString( 16 ).slice( 1 );
			return this;

		},

		RGBFromHex: function () {

			this.red   = parseInt( this.hex.substring( 1, 3 ), 16 );
			this.green = parseInt( this.hex.substring( 3, 5 ), 16 );
			this.blue  = parseInt( this.hex.substring( 5, 7 ), 16 );
			return this;

		},

		HSLFromRGB: function () {

			var norm = {
				red:   this.red   / 255,
				green: this.green / 255,
				blue:  this.blue  / 255
			};
			var max = Math.max( norm.red, norm.green, norm.blue );
			var min = Math.min( norm.red, norm.green, norm.blue );
			var c = max - min;

			if ( c === 0 ) {
				this.hue = 0;
			} else if ( norm.red >= norm.green && norm.red >= norm.blue ) {
				this.hue = ( ( ( ( norm.green - norm.blue ) / c ) + 6 ) % 6 ) * 60;
			} else if ( norm.green >= norm.red && norm.green >= norm.blue ) {
				this.hue = ( ( ( norm.blue - norm.red ) / c ) + 2 ) * 60;
			} else {
				this.hue = ( ( ( norm.red - norm.green ) / c ) + 4 ) * 60;
			}

			this.lightness = 0.5 * ( max + min );
			if ( this.lightness === 0 || this.lightness === 1 ) {
				this.saturation = 0;
			} else {
				this.saturation = c / ( 1 - Math.abs( 2 * this.lightness - 1 ) );
			}
			return this;
		},

		RGBFromHSL: function () {

			var c = ( 1 - Math.abs( 2 * this.lightness - 1 ) ) * this.saturation;
			var hi = this.hue / 60;
			var x = c * ( 1 - Math.abs( hi % 2 - 1 ) );
			var m = this.lightness - 0.5 * c;

			var norm = undefined;
			     if ( hi < 1 ) { norm = { red: c+m, green: x+m, blue: 0+m }; }
			else if ( hi < 2 ) { norm = { red: x+m, green: c+m, blue: 0+m }; }
			else if ( hi < 3 ) { norm = { red: 0+m, green: c+m, blue: x+m }; }
			else if ( hi < 4 ) { norm = { red: 0+m, green: x+m, blue: c+m }; }
			else if ( hi < 5 ) { norm = { red: x+m, green: 0+m, blue: c+m }; }
			else               { norm = { red: c+m, green: 0+m, blue: x+m }; }

			this.red   = Math.round( norm.red   * 255 );
			this.green = Math.round( norm.green * 255 );
			this.blue  = Math.round( norm.blue  * 255 );
			return this;

		},

		calculateHash: function () {

			this.hash = ( ( Math.round( this.hue * 10 ) * 256 + this.red ) * 256 + this.green ) * 256 + this.blue;

		},

		confine: function () {

			this.red   = Math.max( 0, Math.min( 255, this.red ) );
			this.green = Math.max( 0, Math.min( 255, this.green ) );
			this.blue  = Math.max( 0, Math.min( 255, this.blue ) );
			this.updateFromRGB();
			return this;

		},

		add: function ( c ) {

			this.red   += c.red;
			this.green += c.green;
			this.blue  += c.blue;
			this.updateFromRGB();
			return this;

		},

		sub: function ( c ) {

			this.red   -= c.red;
			this.green -= c.green;
			this.blue  -= c.blue;
			this.updateFromRGB();
			return this;

		},

		multiplyScalar: function ( s ) {

			this.red   = Math.round( this.red   * s );
			this.green = Math.round( this.green * s );
			this.blue  = Math.round( this.blue  * s );
			this.updateFromRGB();
			return this;

		},

		copy: function ( c ) {

			this.red        = c.red;
			this.green      = c.green;
			this.blue       = c.blue;
			this.hex        = c.hex;
			this.hue        = c.hue;
			this.saturation = c.saturation;
			this.lightness  = c.lightness;
			this.hash       = c.hash;
			return this;

		},

		clone: function () {

			return new Color().copy( this );

		}

	};

	var Gradient = function () {

		this.stops = [];

	};

	Gradient.prototype = {

		constructor: Gradient,

		addColorStop: function ( pos, col ) {

			this.stops.push( { position: pos, color: col } );
			this.sortStops();
			return this;

		},

		setStops: function ( stops ) {

			this.stops = stops;
			this.sortStops();
			return this;

		},

		sortStops: function () {

			this.stops.sort( function ( a, b ) {
				if ( a.position < b.position ) {
					return -1;
				} else if ( a.position > b.position ) {
					return 1;
				} else {
					return 0;
				}
			} );
			return this;

		},

		copy: function ( g ) {

			this.stops = [];
			for ( var i = 0; i < g.stops.length; i++ ) {
				this.stops.push( { position: g.stops[ i ].position, color: g.stops[ i ].color.clone() } );
			}
			this.sortStops();
			return this;

		},

		clone: function () {

			return new Gradient().copy( this );

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

	return {
		CHANNEL_MAX: CHANNEL_MAX,
		Color:       Color,
		Gradient:    Gradient
	};

} );

