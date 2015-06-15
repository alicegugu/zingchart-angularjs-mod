var app = angular.module('app', ['zingchart-angularjs']);

app.controller('MainController', ['$scope', '$http', function ($scope, $http) {

	$scope.myTypes = ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)'];
	$scope.showScatterPlot = false;
	$scope.scatterplots = [];
	var scatterploturlbase = '/scatterplot';
	var i = 0
	$scope.myTypes.forEach(function (elem1) {
		console.log(elem1);
		$scope.myTypes.forEach(function (elem2) {
			console.log(elem2);
			$scope.scatterplots.push({
				id: 'scatter' + i,
				url: scatterploturlbase + '?' + 'xname=' + elem1 + '&yname=' + elem2
			});
			i++;
		});
	});



	$scope.onSelectFlowerFeature = function (title) {
		$scope.boxplotUrl = '/boxplot/' + title;
		$scope.showScatterPlot = false;
		$scope.$apply();
	}
	$scope.zcOnClickNode = function (p) {
		$scope.showScatterPlot = true;
		console.log(p);
		var scatters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		scatters.forEach(function (elem) {
			$scope['url' + elem] = scatterploturlbase + '?' + 'xname=' + $scope.myTypes[Math.floor(elem / 4)] + '&yname=' + $scope.myTypes[elem % 4] + '&group=' + p.scaletext;
		});

		$scope.$apply();
	}
}]);

app.directive('select', [function () {
	return {
		restrict: 'E',
		scope: {
			title: '@',
			types: "=",
			onSelect: "&"
		},
		templateUrl: '/static/templates/select.html',
		replace: true,
		link: function (scope, element, attrs) {
			var i = 0;
			for (var i in scope.types) {
				element.find('ul').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="#" id=' + i + '>' + scope.types[i] + '</a></li>');
				angular.forEach(element.find('a'), function (node) {
					if (node.id == i) {
						node.addEventListener('click', function (event) {;
							scope.title = event.target.innerHTML;
							scope.$apply();
							scope.onSelect({
								title: scope.title
							});
						})

					}
				});
				i++;
			}



		}
	};
}]);
