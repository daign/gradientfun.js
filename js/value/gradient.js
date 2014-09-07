Value.Gradient = function () {
	this.stops = [];
};

Value.Gradient.prototype = {

	constructor: Value.Gradient,

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
		while ( pos > this.stops[ u ].position && u < this.stops.length ) {
			u++;
		}
		if ( u === 0 ) {
			return this.stops[ 0 ].color.clone();
		} else {
			var sL = this.stops[ u-1 ];
			var sU = this.stops[ u ];
			var f = ( pos - sL.position ) / ( sU.position - sL.position );
			return sU.color.clone().sub( sL.color ).multiplyScalar( f ).add( sL.color ).confine();
		}
	},

	copy: function ( g ) {
		this.stops = [];
		for ( var i = 0; i < g.stops.length; i++ ) {
			this.stops.push( { position: g.stops[ i ].position, color: g.stops[ i ].color.clone() } );
		}
		return this;
	},

	clone: function () {
		return new Value.Gradient().copy( this );
	}

};

