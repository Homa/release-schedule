'use strict';
//
angular.module('releaseScheduleApp')
.controller('MainCtrl', function ($scope, Tasks, DateRange, $timeout, $rootScope) {
    $scope.addedWorkstreams = [];
    $scope.predicate = 'order';
    $scope.all = true;
    $scope.startDate = DateRange.getStartDate().format("YYYY-MM-DD");
    $scope.endDate = DateRange.getEndDate().format("YYYY-MM-DD");
    $scope.workstreams = Tasks.activeWorkstreams;
    $scope.tasksInRange = Tasks.getTasksInRange(DateRange.getStartDate(), DateRange.getEndDate());
    $scope.showAll = function () {
        $scope.all = true;
        $scope.addedWorkstreams = [];
        angular.forEach($scope.workstreams, function (workstream) {
            workstream.selected = false;
        });
    };

    $scope.filterTaskResult = function (workstream) {
        var i = $scope.addedWorkstreams.indexOf(workstream);

        if (i === -1 ) {
            $scope.all = false;
            $scope.addedWorkstreams.push(workstream);
        } else {
            $scope.addedWorkstreams.splice(i, 1);
        }

        if($scope.addedWorkstreams.length === 0) {
            $scope.all = true;
        }
    };

    var reset = function () {

        DateRange.resetDates($scope.startDate, $scope.endDate);
        $scope.tasksInRange = Tasks.getTasksInRange($scope.startDate, $scope.endDate);

        $rootScope.$broadcast('rangeChanged');
        $scope.startDate = DateRange.getStartDate().format("YYYY-MM-DD");
        $scope.endDate = DateRange.getEndDate().format("YYYY-MM-DD");
    }

    $scope.changeDateRange = function () {
        var newStartDate = moment($scope.startDate),
            newEndDate = moment($scope.endDate);

        DateRange.resetDates(newStartDate, newEndDate);
        $rootScope.$broadcast('rangeChanged');

        $scope.startDate = DateRange.getStartDate().format("YYYY-MM-DD");
        $scope.endDate = DateRange.getEndDate().format("YYYY-MM-DD");

    };

    $scope.zoomOut = function () {
        $scope.startDate = moment($scope.startDate).subtract( 30 , 'day');
        $scope.endDate = moment($scope.endDate).add( 30 , 'day');

        reset();
    };

    $scope.zoomIn = function () {
        $scope.startDate = moment($scope.startDate).add( 30 , 'day');
        $scope.endDate = moment($scope.endDate).subtract( 30 , 'day');

        reset();
    };

    $scope.shiftBack = function () {
        $scope.startDate = moment($scope.startDate).subtract( 30 , 'day');
        $scope.endDate = moment($scope.endDate).subtract( 30 , 'day');

        reset();
    };

    $scope.shiftForward = function () {
        $scope.startDate = moment($scope.startDate).add( 30 , 'day');
        $scope.endDate = moment($scope.endDate).add( 30 , 'day');

        reset();
    };

    $(window).on("resize", function () {
        $scope.$broadcast('rangeChanged');
    });

});
