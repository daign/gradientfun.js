var main = function () {

	this.node = document.createElement( 'canvas' );
	this.node.width = 420;
	this.node.height = 420;
	document.body.appendChild( this.node );

	var ctx = this.node.getContext( '2d' );

	var g1 = new Value.Gradient();
	g1.addColorStop( 0.00, new Value.Color().setFromHex( '#3b8f45', 1 ) );
	g1.addColorStop( 0.25, new Value.Color().setFromHex( '#e5d411', 1 ) );
	g1.addColorStop( 0.50, new Value.Color().setFromHex( '#4d91bc', 1 ) );
	g1.addColorStop( 0.75, new Value.Color().setFromHex( '#d02743', 1 ) );
	g1.addColorStop( 1.00, new Value.Color().setFromHex( '#765612', 1 ) );

	var steps = 200;
	var rotations  = new Value.Limited( { values:     [ 3.32 ], minimum: 0.5, maximum:  10 } );
	var startRadii = new Value.Limited( { values:  [ 40, 200 ], minimum:   0, maximum: 200, gap: 1 } );
	var endRadii   = new Value.Limited( { values: [ 140, 160 ], minimum:   0, maximum: 200, gap: 1 } );

	var randomize = function () {
		rotations.randomizeAnimated( 1000 );
		startRadii.randomizeAnimated( 1000 );
		endRadii.randomizeAnimated( 1000 );
	};
	this.node.addEventListener( 'click', randomize, false );

	var render = function () {
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		ctx.clearRect( 0, 0, 420, 420 );
		ctx.translate( 210, 210 );
		ctx.lineWidth = 6;
		ctx.lineCap = 'round';
		for ( var i = 0; i <= steps; i++ ) {
			ctx.save();
			ctx.rotate( ( rotations.get( 0 )*Math.PI ) * i/steps );
			ctx.strokeStyle = g1.colorAt( i/steps ).getRGBA();
			ctx.beginPath();
			ctx.moveTo( 0, startRadii.get( 0 ) - i/steps * ( startRadii.get( 0 ) - endRadii.get( 0 ) ) );
			ctx.lineTo( 0, startRadii.get( 1 ) - i/steps * ( startRadii.get( 1 ) - endRadii.get( 1 ) ) );
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	};
	var throttledRender = throttle( render, 40, this );
	/*rotations.addListener( throttledRender );
	startRadii.addListener( throttledRender );
	endRadii.addListener( throttledRender );*/
	rotations.addListener( render );
	startRadii.addListener( render );
	endRadii.addListener( render );

	document.body.appendChild( document.createElement( 'br' ) );

	document.body.appendChild( document.createTextNode( 'rotations:' ) );
	var s1 = document.createElement( 'div' );
	document.body.appendChild( s1 );
	new Slider( { value: rotations, domNode: s1 } );

	document.body.appendChild( document.createTextNode( 'start radii:' ) );
	var s2 = document.createElement( 'div' );
	document.body.appendChild( s2 );
	new Slider( { value: startRadii, domNode: s2 } );

	document.body.appendChild( document.createTextNode( 'end radii:' ) );
	var s3 = document.createElement( 'div' );
	document.body.appendChild( s3 );
	new Slider( { value: endRadii, domNode: s3 } );

	var onResize = function () {
		var event = new Event( 'resize' );
		s1.dispatchEvent( event );
		s2.dispatchEvent( event );
		s3.dispatchEvent( event );
	};
	window.addEventListener( 'resize', onResize, false );

	var animate = function () {
		requestAnimationFrame( animate );
		TWEEN.update();
	};
	animate();

	randomize();

};

