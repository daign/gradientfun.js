var Handle = function ( node, beginning, continuing, ending ) {

	this.domNode = node;

	this.beginning = beginning;
	this.continuing = continuing;
	this.ending = ending;

	var self = this;

	this.domNode.addEventListener( 'mousedown',  function ( event ) { self.beginDrag( event ); }, false );
	this.domNode.addEventListener( 'touchstart', function ( event ) { self.beginDrag( event ); }, false );

};

Handle.prototype = {

	constructor: Handle,

	beginDrag: function ( event ) {

		var self = this;
		event.preventDefault();
		event.stopPropagation();

		var x0 = ( event.clientX !== undefined ) ? event.clientX : ( event.touches && event.touches[ 0 ].clientX );
		var p0 = ( event.offsetX || event.layerX );
		this.beginning( x0, p0 );

		var cancelSelect = function ( event ) {

			event.preventDefault();
			event.stopPropagation();

		};

		var continueDrag = function ( event ) {

			event.preventDefault();
			event.stopPropagation();

			var xt = ( event.clientX !== undefined ) ? event.clientX : ( event.touches && event.touches[ 0 ].clientX );
			self.continuing( x0, xt );

		};

		var endDrag = function () {

			self.ending();

			document.removeEventListener( 'selectstart', cancelSelect, false );

			document.removeEventListener( 'mousemove',   continueDrag, false );
			document.removeEventListener( 'touchmove',   continueDrag, false );

			document.removeEventListener( 'mouseup',     endDrag, false );
			document.removeEventListener( 'touchend',    endDrag, false );
			document.removeEventListener( 'touchcancel', endDrag, false );
			document.removeEventListener( 'touchleave',  endDrag, false );

		};

		document.addEventListener( 'selectstart', cancelSelect, false );

		document.addEventListener( 'mousemove',   continueDrag, false );
		document.addEventListener( 'touchmove',   continueDrag, false );

		document.addEventListener( 'mouseup',     endDrag, false );
		document.addEventListener( 'touchend',    endDrag, false );
		document.addEventListener( 'touchcancel', endDrag, false );
		document.addEventListener( 'touchleave',  endDrag, false );

	}

};

