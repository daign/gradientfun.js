var main = function () {

	this.node = document.createElement( 'canvas' );
	this.node.width = 420;
	this.node.height = 420;
	document.body.appendChild( this.node );

	var ctx = this.node.getContext( '2d' );

	var g1 = new Gradient();
	g1.addColorStop( 0.00, new Color().setFromHex( '#3b8f45', 1 ) );
	g1.addColorStop( 0.25, new Color().setFromHex( '#e5d411', 1 ) );
	g1.addColorStop( 0.50, new Color().setFromHex( '#4d91bc', 1 ) );
	g1.addColorStop( 0.75, new Color().setFromHex( '#d02743', 1 ) );
	g1.addColorStop( 1.00, new Color().setFromHex( '#765612', 1 ) );

	var steps = 200;
	var rotations = 3.32;
	var startRadius = [ 40, 200 ];
	var endRadius = [ 140, 160 ];

	var render = function () {
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		ctx.clearRect( 0, 0, 420, 420 );
		ctx.translate( 210, 210 );
		ctx.lineWidth = 6;
		ctx.lineCap = 'round';
		for ( var i = 0; i <= steps; i++ ) {
			ctx.save();
			ctx.rotate( ( rotations*Math.PI ) * i/steps );
			ctx.strokeStyle = g1.colorAt( i/steps ).getRGBA();
			ctx.beginPath();
			ctx.moveTo( 0, startRadius[ 0 ] - i/steps * ( startRadius[ 0 ] - endRadius[ 0 ] ) );
			ctx.lineTo( 0, startRadius[ 1 ] - i/steps * ( startRadius[ 1 ] - endRadius[ 1 ] ) );
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	};
	var throttledRender = throttle( render, 40, this );

	render();

	document.body.appendChild( document.createElement( 'br' ) );

	document.body.appendChild( document.createTextNode( 'rotations:' ) );
	var rotationsSlider = new Slider( {
		min: 50,
		max: 1000,
		values: [ 332 ],
		onChange: function ( v ) { rotations = v[ 0 ]/100; throttledRender(); }
	} );
	document.body.appendChild( rotationsSlider.domNode );

	document.body.appendChild( document.createTextNode( 'start radii:' ) );
	var startRadiusSlider = new Slider( {
		min: 0,
		max: 200,
		values: [ 40, 200 ],
		onChange: function ( v ) { startRadius = v; throttledRender(); }
	} );
	document.body.appendChild( startRadiusSlider.domNode );

	document.body.appendChild( document.createTextNode( 'end radii:' ) );
	var endRadiusSlider = new Slider( {
		min: 0,
		max: 200,
		values: [ 140, 160 ],
		onChange: function ( v ) { endRadius = v; throttledRender(); }
	} );
	document.body.appendChild( endRadiusSlider.domNode );

};

