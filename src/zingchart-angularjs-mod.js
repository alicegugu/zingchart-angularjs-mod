(function(){
    'use strict';
    angular.module('zingchart-angularjs', [] )
    .directive('zingchart', ['$http', function($http){
        return {
            restrict : 'EA',
            scope : {
                zcValues : '=?',
                zcJson : '=?',
                zcRender : '=',
				zcOnClickNode: '&',
				id: "@",
				zcUrl: "=",
            },
            controller : ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs,$http){

                $scope.$watchCollection('zcValues', function(){
                    if($scope.zcValues){
                        if(isMultiArray($scope.zcValues)){
                            zingchart.exec($attrs.id, 'setseriesvalues', {
                                values : $scope.zcValues
                            });
                        }
                        else{
                            zingchart.exec($attrs.id, 'setseriesvalues', {
                                values : [$scope.zcValues]
                            });
                        }
                    }
                });

                $scope.$watch('zcJson', function(){
                    if($scope.zcJson){
                        var _json = $scope.zcJson;
                        //Inject values
                        if($scope.zcValues){
                            for(var i = 0; i < $scope.zcValues.length; i++){
                                if(_json.series){
                                    if(_json.series[i]){
                                        _json.series[i].values = $scope.zcValues[i];
                                    }
                                    else{
                                        _json.series.push({'values' : $scope.zcValues[i]});
                                    }
                                }
                                else{

                                    _json.series = [{'values' : $scope.zcValues[i]}];
                                }
                            }
                        }
                        //Inject type
                        if(!_json.type){
                            _json.type = 'line';
                        }
                        else{
                            _json.type = ($attrs.zcType) ? $attrs.zcType : _json.type
                        }
                        zingchart.exec($attrs.id, 'setdata', {
                            data : _json
                        });
                    }
                },true);

                $scope.$watch('zcUrl', function () {
                	if($scope.zcUrl){
						//Ajax
						var req = {
							method: 'GET',
							url: $scope.zcUrl,
						}

						$http(req).success(function (data, status) {
							$scope.zcJson = data;
						}).error(function (data, status) {
							$scope.zcJson = data || "Request failed";
						});	}
                })

            }],
            link : function($scope, $element, $attrs){
                //Setup json :
                if(!$attrs.id){
                    throw new Error('ZingChart-AngularJS : Attribute ID needed');
                }
                //Defaults
                var _json = {
                    data : {
                        type : 'line',
                        series : []
                    },
                    width : 600,
                    height: 400
                };

                //Add render object.
                if($scope.zcRender){
                    mergeObject($scope.zcRender, _json);
                }

                //Add JSON object
                if($scope.zcJson){
                    mergeObject($scope.zcJson, _json.data);
                }

                //Add Values
                if($scope.zcValues){
                    if(typeof _json.data.series === 'undefined'){
                        _json.data.series = [];
                    }
                    //Single Series
                    if(!isMultiArray($scope.zcValues)){
                        if(_json.data.series[0]){
                            _json.data.series[0].values = $scope.zcValues;
                        }
                        else{
                            _json.data.series.push({'values' : $scope.zcValues});
                        }
                    }
                    //Multi Series
                    else{
                        for(var i = 0; i < $scope.zcValues.length; i++){
                            if(_json.data.series[i]){
                                _json.data.series[i].values = $scope.zcValues[i];
                            }
                            else{
                                _json.data.series.push({'values' : $scope.zcValues[i]});
                            }
                        }
                    }
                }

                //Add other properties
                _json.data.type = ($attrs.zcType) ? $attrs.zcType : _json.data.type;
                _json.height = ($attrs.zcHeight) ? $attrs.zcHeight : _json.height;
                _json.width = ($attrs.zcWidth) ? $attrs.zcWidth : _json.width;
                _json.id = $attrs.id;

                zingchart.render(_json);


                // Shows label and sets it to the plotindex and nodeindex
                // of the clicked node
                if ($scope.zcOnClickNode) {
                	zingchart.bind($attrs.id, "node_click", function (p) {
                		$scope.zcOnClickNode({
                			p: p
                		});
                	});
                }

            }
        };
    }]);

    /**
    *   Helper function to merge an object into another, overwriting properties.
    *   A shallow, not a recursive merge
    *   @param {object} fromObj - The object that has properties to be merged
    *   @param {object} intoObj - The object being merged into (Result)
    */
    function mergeObject(fromObj, intoObj){
        for(var property in fromObj){
            if (fromObj.hasOwnProperty(property)) {
                intoObj[property] = fromObj[property];
            }
        }
    }

    /**
    *   Determines whether an array is multidimensional or not.
    *   @param {array} _array - The array to test
    *   @returns {boolean} - true if the array is multidimensional, false otherwise
    */
    function isMultiArray(_array){
        if(typeof _array[0] === "string" || typeof _array[0] === "number"){
            return false;
        }
        else{
            return true;
        }
    }

})();
