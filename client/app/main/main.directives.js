'use strict';

angular.module('releaseScheduleApp')
.directive('tasksList', function ($window, DateRange) {
    return {
        restrict: 'E',
        scope: {
            task: '=info'
        },
        template:
        '<div class="task-container">' +
            '<div class="task-track">' +
                '<div class="task-wrapper">' +
                    '<div class="task-title-wrapper noselect">{{task.title}}</div>' +
                    '<div class="end-dev-to-release-line"></div>' +
                    '<div class="start-dev-point"></div>' +
                    '<div class="end-dev-point"></div>' +
                    '<div class="release-point"></div>' +
                '</div>' +
            '</div>' +
        '</div>',
        link: function (scope, element) {
            var startDevPointElem,
                endDevPointElem,
                releasePointElem,
                taskTitleElem,
                taskLineElem,
                startDevPointLeftPosition,
                endDevPointLeftPosition,
                releasePointLeftPosition,
                color,
                taskWidth,
                lineWidth;

            startDevPointElem = element.find('.start-dev-point');
            endDevPointElem = element.find('.end-dev-point');
            releasePointElem = element.find('.release-point');
            taskTitleElem = element.find('.task-title-wrapper');
            taskLineElem = element.find('.end-dev-to-release-line');

            var positionTaskTextBox = function (taskWidth, left) {
                taskTitleElem.css({
                    'left': left + 'px',
                    'background-color': color,
                    'width': taskWidth + 'px'
                });
            };

            var positionTaskLine = function (lineWidth, left) {
                taskLineElem.css({
                    'left': left + 'px',
                    'background-color': color,
                    'width': lineWidth + 'px'
                });
            };

            var positionStartPoint = function (startDevPointLeftPosition) {
                startDevPointElem.css({
                    'border-color': color,
                    'left': startDevPointLeftPosition + 'px'
                });
            };

            var positionEndPoint = function (endDevPointLeftPosition) {
                endDevPointElem.css({
                    'border-color': color,
                    'left': endDevPointLeftPosition + 'px'
                });
            };

            var positionReleasePoint = function (releasePointLeftPosition) {
                releasePointElem.css({
                    'border-color': color,
                    'background-color': color,
                    'left': releasePointLeftPosition + 'px'
                });
            };

            var refresh = function () {
                var noDays = DateRange.getNoDays();
                var columnWidth = $window.innerWidth / noDays;
                var startDate = DateRange.getStartDate();

                startDevPointLeftPosition = moment(scope.task.startDate).diff(startDate, 'days') * columnWidth;
                endDevPointLeftPosition = moment(scope.task.endDevDate).diff(startDate, 'days') * columnWidth;
                releasePointLeftPosition = moment(scope.task.releaseDate).diff(startDate, 'days') * columnWidth;
                color = scope.task.color;

                taskWidth = parseInt(moment(scope.task.endDevDate).diff(scope.task.startDate, 'days')) * columnWidth;
                lineWidth = parseInt(moment(scope.task.releaseDate).diff(scope.task.endDevDate, 'days')) * columnWidth;

                positionTaskTextBox(taskWidth, startDevPointLeftPosition);
                positionTaskLine(lineWidth, endDevPointLeftPosition);
                positionStartPoint(startDevPointLeftPosition);
                positionEndPoint(endDevPointLeftPosition);
                positionReleasePoint(releasePointLeftPosition);
            };

            refresh();

            element.find('.task-wrapper').bind('mouseenter', function (event) {
                scope.$emit('showHint', {xPos: event.clientX, yPos: event.clientY});
            });

            element.find('.task-wrapper').bind('mouseleave', function () {
                scope.$emit('hideHint');
            });

            scope.$on('rangeChanged', refresh);

        }
    };
})
.directive('taskInfo', function ($window, DateRange) {
    return {
        restrict: 'E',
        template:
            '<div class="task-info hidden">' +
                '<div class="task-info-arrow"></div>' +
                '<div class="task-info-inner ng-binding">' +
                    '<h5>{{task.title}}</h5>' +
                    '<b>Start:</b> {{task.startDate}}<br><b>Finish:</b> {{task.endDevDate}}<br><b>Release:</b> {{task.releaseDate}}' +
                    '<br>{{task.description}}' +
                '</div>' +
            '</div>',
        replace: true,
        controller: function ($scope) {
            $scope.$on('showHint', function (event) {
                $scope.$apply(function () {
                    $scope.task = event.targetScope.task;
                });
            });
        },
        link: function (scope, element) {
            scope.$on('showHint', function (event, data) {
                element.css({
                    'left': data.xPos + 'px',
                    'top': data.yPos + 'px'
                });
                element.removeClass('hidden');
            });

            scope.$on('hideHint', function (event) {
                element.addClass('hidden');
            });
        }
    };
})
.directive('timelineHeader', function ($window, DateRange) {
    return {
        restrict: 'A',
        template:
            '<div class="month"></div>',
        link: function (scope, element) {

            var refresh = function () {
                var noDays = DateRange.getNoDays();
                var columnWidth = $window.innerWidth / noDays;
                var inHTML = '';
                var firstDayOfMonthArray = DateRange.firstDayOfMonthArray();

                for (var i = 0, len = noDays; i < len; i++) {
                    if( firstDayOfMonthArray[i] ) {
                        inHTML = inHTML + '<div style="width: ' + columnWidth + 'px;left: ' + columnWidth * i  + 'px;border-color: #000;">' + moment(firstDayOfMonthArray[i]).format('MMM YYYY') + '</div>';
                    }
                }

                element.find('.month').html(inHTML);
            };

            refresh();
            scope.$on('rangeChanged', refresh);
        }
    };
})
.directive('timelineGrid', function ($window, DateRange) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            var refresh = function () {
                var noDays = DateRange.getNoDays();
                var columnWidth = $window.innerWidth / noDays;
                var inHTML = '';
                var firstDayOfWeekArray = DateRange.firstDayOfWeekArray();

                for (var i = 0, len = noDays; i < len; i++) {
                    if(firstDayOfWeekArray[i]) {
                        inHTML = inHTML + '<div style="width: ' + columnWidth + 'px;left: ' + columnWidth * i  + 'px;opacity:0.5;border-color: #c00;"><!--' + firstDayOfWeekArray[i].format('MMM YY dddd') +' --></div>';
                    } else {
                        inHTML = inHTML + '<div style="width: ' + columnWidth + 'px;left: ' + columnWidth * i  + 'px;"></div>';
                    }
                }
                element.html(inHTML);

            };

            refresh();
            scope.$on('rangeChanged', refresh);
        }
    };
})
.directive('today', function ($window, DateRange) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            var refresh = function () {
                var today = moment(),
                    startDate  = DateRange.getStartDate(),
                    endDate = DateRange.getEndDate(),
                    inHTML = '';

                if( today.isAfter(startDate) && today.isBefore(endDate) ) {

                    var noDays = DateRange.getNoDays(),
                        columnWidth = $window.innerWidth / noDays,
                        i = moment(today).diff(startDate, 'days');

                    inHTML = '<div class="today" style="width: ' + columnWidth + 'px;left: ' + columnWidth * i  + 'px;"></div>';

                } else {
                    inHTML = '';
                }
                element.html(inHTML);
            };

            refresh();
            scope.$on('rangeChanged', refresh);
        }
    };
});
