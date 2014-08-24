var main = function () {

	this.node = document.createElement( 'canvas' );
	this.node.width = 400;
	this.node.height = 400;
	document.body.appendChild( this.node );

	var ctx = this.node.getContext( '2d' );

	var g1 = new Gradient();
	g1.addStop(   0, '#3b8f45' );
	g1.addStop(  25, '#e5d411' );
	g1.addStop(  50, '#4d91bc' );
	g1.addStop(  75, '#d02743' );
	g1.addStop( 100, '#765612' );

	var steps = 200;

	ctx.setTransform( 1, 0, 0, 1, 0, 0 );
	ctx.translate( 200, 200 );
	ctx.lineWidth = 6;
	ctx.lineCap = 'round';
	for ( var i = 0; i <= steps; i++ ) {
		ctx.save();
		ctx.rotate( ( 8.1*Math.PI ) * i/steps );
		ctx.strokeStyle = g1.getColor( i*100/steps );
		ctx.beginPath();
		ctx.moveTo( 0, 80 );
		ctx.lineTo( 0, 197 - 80*i/steps );
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

};

