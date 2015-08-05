app.directive( 'valueSlider', [ '$document', function ( $document ) {
	return {
		restrict: 'E',
		templateUrl: 'html/value-slider.html',
		scope: {
			value: '=',
			max: '=',
			width: '='
		},
		link: function ( scope, element, attrs ) {

			scope.left = function () {
				return Math.round( scope.value * ( scope.width - 24 ) / scope.max );
			};

			scope.begin = function ( event ) {

				event.preventDefault();
				event.stopPropagation();

				var startValue = scope.value;
				var startPos = event.clientX;

				function cancelSelect( event ) {
					event.preventDefault();
					event.stopPropagation();
				}

				function mousemove( event ) {
					event.preventDefault();
					event.stopPropagation();
					scope.value = Math.max( 0, Math.min( scope.max, startValue + ( event.clientX - startPos ) * scope.max / ( scope.width - 24 ) ) );
					scope.$apply();
				}

				function mouseup() {
					$document.off( 'selectstart', cancelSelect );
					$document.off( 'mousemove', mousemove );
					$document.off( 'mouseup', mouseup );
				}

				$document.on( 'selectstart', cancelSelect );
				$document.on( 'mousemove', mousemove );
				$document.on( 'mouseup', mouseup );

			};

		}
	};
}]);

