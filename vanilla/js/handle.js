// domNode will be responsive to drag actions by mouse or touch, callback functions will be called
// on start, end and during the drag action, with access to start and current drag event positions
var Handle = function ( settings ) {

	this.domNode = settings.domNode;
	this.vector0 = settings.vector0; // drag start position
	this.vectorT = settings.vectorT; // current drag position

	// callbacks:
	this.beginning  = settings.beginning;
	this.continuing = settings.continuing;
	this.ending     = settings.ending;

	var self = this;

	var beginDrag = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		self.vector0.setFromEvent( event );
		self.beginning();

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

	};

	this.domNode.addEventListener( 'mousedown',  beginDrag, false );
	this.domNode.addEventListener( 'touchstart', beginDrag, false );

};

