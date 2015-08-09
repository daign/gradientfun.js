var app = angular.module( 'Gradientfun', [] );

app.controller( 'GradientfunController', [ '$scope', 'ColorUtils', function ( $scope, ColorUtils ) {

	$scope.rotations = 43.91;

	$scope.colornumbers = [ 0, 1, 2, 3, 4 ];
	$scope.colors = [
		new ColorUtils.Color().setHex( '#3b8f45' ),
		new ColorUtils.Color().setHex( '#e5d411' ),
		new ColorUtils.Color().setHex( '#4d91bc' ),
		new ColorUtils.Color().setHex( '#d02743' ),
		new ColorUtils.Color().setHex( '#765612' )
	];
	$scope.activecolor = 0;

	$scope.setActiveColor = function ( n ) {
		$scope.activecolor = n
	};

}]);

