
/// <reference path="../node_modules/@types/angular/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/highcharts/highcharts.d.ts" />

var app = angular
    .module('AnchorGlassTestApp', ['ngSanitize']);

var app = angular.module('AnchorGlassTestApp', []);

app.controller('TableCtrl', function ($scope, $http, $timeout) {
    var request = {
        method: 'get',
        url: 'sampleApiOutput.json',
        dataType: 'json',
        contentType: 'application/json'
    };

    $scope.orderBy = "order";
    $scope.limitTo = "3";

    $scope.orderByChanged = function ($event) {
        $timeout($scope.updateSparkline, 100);
    };

    $scope.limitToChanged = function ($event) {
        $timeout($scope.updateSparkline, 100);
    };

    $scope.showChart = function ($event, machine) {
        $event.stopPropagation();

        $("#chartTitle").text(machine.machineName);

        var categories = machine.details.slice(0, 4).map(y => y.defect);
        var series = machine.details.slice(0, 4).map(x => x.rejectCount);
        var options = {
            chart: {
                type: 'column'
            },
            title: { text: "" },
            xAxis: {
                categories: categories,
                title: { text: 'Defect Type' }
            },
            yAxis: {
                title: {
                    text: 'Reject Count'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                data: series
            }] as Highcharts.SeriesOptionsType[]
        };

        Highcharts.chart(
            $("#chart")[0],
            options,
            null);
    };

    $scope.updateSparkline = function () {
        let $tds = $('div[data-sparkline]');
        for (var i = 0; i < $tds.length; i += 1) {
            let $td = $($tds[i]);
            let ary = $td.data('sparkline');
            let series = [{
                data: ary,
                pointStart: 1
            }];
            $scope.sparkLine({ series, chart: { renderTo: $td[0] } });
        }
        angular.element($($tds[0])[0]).click();
    };

    $scope.sparkLine = function (options) {
        var defaultOptions = {
            chart: {
                renderTo: (options.chart && options.chart.renderTo),
                backgroundColor: '#F6F6F6',
                borderWidth: 0,
                type: 'area',
                margin: [2, 0, 2, 0],
                width: 120,
                height: 20,
                style: {
                    overflow: 'visible'
                },
                skipClone: true
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                startOnTick: false,
                endOnTick: false,
                tickPositions: []
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickPositions: [0]
            },
            legend: {
                enabled: false
            },
            // no need for tooltip for a sparkline, too small
            //tooltip: {
            //    backgroundColor: null,
            //    borderWidth: 0,
            //    shadow: false,
            //    useHTML: true,
            //    hideDelay: 0,
            //    shared: true,
            //    padding: 0,
            //    positioner: function (w, h, point) {
            //        return { x: point.plotX - w / 2, y: point.plotY - h };
            //    }
            //},
            tooltip: { enabled: false },
            plotOptions: {
                series: {
                    animation: false,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        radius: 1,
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    fillOpacity: 0.25
                },
                column: {
                    negativeColor: '#910000',
                    borderColor: 'silver'
                }
            }
        };

        options = Highcharts.merge(defaultOptions, options);

        return new Highcharts.Chart(options);
    };

    $scope.machines = [];

    $http(request)
        .then(function (response) {
            $scope.machines = response.data; //.sort((a, b) => a.order < b.order ? 1 : -1);
            $scope.machines.map(machine => {
                machine.rejectHistorySparkline = machine.rejectHistory.map(a => a.rejectCount);
                return machine;
            })
        }, function (err) {
            console.log(err);
        });

    $timeout($scope.updateSparkline, 100);
});
