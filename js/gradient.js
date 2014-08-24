var Gradient = function () {
	this.stops = [];
};

Gradient.prototype = {

	constructor: Gradient,

	addStop: function ( pos, col ) {
		var r = parseInt( col.substring( 1, 3 ), 16 );
		var g = parseInt( col.substring( 3, 5 ), 16 );
		var b = parseInt( col.substring( 5, 7 ), 16 );
		this.stops.push( { position: pos, color: [ r, g, b ] } );
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

	getColor: function ( pos ) {
		var u = 0;
		while ( pos > this.stops[ u ].position && u < this.stops.length ) {
			u++;
		}
		var l = Math.max( 0, u-1 );
		var sL = this.stops[ l ];
		var sU = this.stops[ u ];
		var f = ( pos - sL.position ) / Math.max( 1, sU.position - sL.position );
		var r = sL.color[ 0 ] + Math.round( f * ( sU.color[ 0 ]- sL.color[ 0 ] ) );
		var g = sL.color[ 1 ] + Math.round( f * ( sU.color[ 1 ]- sL.color[ 1 ] ) );
		var b = sL.color[ 2 ] + Math.round( f * ( sU.color[ 2 ]- sL.color[ 2 ] ) );
		return '#' + ( ( 1 << 24 ) + ( r << 16 ) + ( g << 8 ) + b ).toString( 16 ).slice( 1 );
	}

};

