// rgb color with transparency value a
Value.Color = function ( r, g, b, a ) {

	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.a = ( a !== undefined ) ? a : 1;

};

Value.Color.prototype = {

	constructor: Value.Color,

	setFromHex: function ( hex, a ) {
		this.r = parseInt( hex.substring( 1, 3 ), 16 );
		this.g = parseInt( hex.substring( 3, 5 ), 16 );
		this.b = parseInt( hex.substring( 5, 7 ), 16 );
		this.a = a;
		return this;
	},

	getRGBA: function () {
		return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
	},

	getHex: function () {
		return '#' + ( ( 1 << 24 ) + ( this.r << 16 ) + ( this.g << 8 ) + this.b ).toString( 16 ).slice( 1 );
	},

	// confine to the conceptual limitations of color values
	confine: function () {
		this.r = Math.max( 0, Math.min( 255, this.r ) );
		this.g = Math.max( 0, Math.min( 255, this.g ) );
		this.b = Math.max( 0, Math.min( 255, this.b ) );
		this.a = Math.max( 0, Math.min(   1, this.a ) );
		return this;
	},

	add: function ( color ) {
		this.r += color.r;
		this.g += color.g;
		this.b += color.b;
		this.a += color.a;
		return this;
	},

	sub: function ( color ) {
		this.r -= color.r;
		this.g -= color.g;
		this.b -= color.b;
		this.a -= color.a;
		return this;
	},

	multiplyScalar: function ( s ) {
		this.r = Math.round( this.r * s );
		this.g = Math.round( this.g * s );
		this.b = Math.round( this.b * s );
		this.a *= s;
		return this;
	},

	// sets this color to the values of another color
	copy: function ( c ) {
		this.r = c.r;
		this.g = c.g;
		this.b = c.b;
		this.a = c.a;
	},

	// generates a new color instance with the same values
	clone: function () {
		return new Value.Color( this.r, this.g, this.b, this.a );
	}

};

