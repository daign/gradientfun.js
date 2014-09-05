var Handle = function ( settings ) {

	this.domNode = settings.domNode;
	this.vector0 = settings.vector0;
	this.vectorT = settings.vectorT;

	this.beginning  = settings.beginning;
	this.continuing = settings.continuing;
	this.ending     = settings.ending;

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

		self.vector0.setFromEvent( event );
		this.beginning();

		var cancelSelect = function ( event ) {

			event.preventDefault();
			event.stopPropagation();

		};

		var continueDrag = function ( event ) {

			event.preventDefault();
			event.stopPropagation();

			self.vectorT.setFromEvent( event );
			self.continuing();

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

