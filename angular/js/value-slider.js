app.directive( 'valueSlider', [ '$document', function ( $document ) {
	return {
		restrict: 'E',
		templateUrl: 'html/value-slider.html',
		scope: {
			value: '=',
			min: '=',
			max: '=',
			width: '='
		},
		link: function ( scope, element, attrs ) {

			if ( scope.min === undefined ) {
				scope.min = 0;
			}

			scope.left = function () {
				return Math.round( ( ( scope.value - scope.min ) / ( scope.max - scope.min ) ) * ( scope.width - 16 ) );
			};

			scope.begin = function ( event, withJump ) {

				event.preventDefault();
				event.stopPropagation();

				if ( withJump ) {
					scope.value = Math.round( Math.max( scope.min, Math.min( scope.max,
						( ( event.layerX - 10 ) / ( scope.width - 24 ) ) * ( scope.max - scope.min ) + scope.min
					)));
				}

				var startValue = scope.value;
				var startPos = event.clientX;

				function cancelSelect( event ) {
					event.preventDefault();
					event.stopPropagation();
				}

				function mousemove( event ) {
					event.preventDefault();
					event.stopPropagation();
					scope.value = Math.round( Math.max( scope.min, Math.min( scope.max,
						startValue + ( ( event.clientX - startPos ) / ( scope.width - 24 ) ) * ( scope.max - scope.min )
					)));
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

