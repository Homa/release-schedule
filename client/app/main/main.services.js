'use strict';

angular.module('releaseScheduleApp')
.factory('DateRange', function () {
    moment().startOf('isoWeek');
    var startDate = moment().subtract( 180 , 'day'),
        endDate = moment().add( 180 , 'day'),
        noDays = moment(endDate).diff(startDate, 'days'),
        firstDayOfWeek,
        firstDayOfMonth;

    var getNoDays = function () {
        return noDays;
    }

    var getStartDate = function () {
        return startDate;
    };

    var getEndDate = function () {
        return endDate;
    };

    var firstDays = function (startDate, noDays) {
        firstDayOfWeek = [];
        firstDayOfMonth = [];
        for(var i = 0; i < noDays; i++) {

            if(startDate.day() === 1) {
                firstDayOfWeek.push(startDate);
            } else {
                firstDayOfWeek.push(0);
            }

            if(startDate.get('date') === 1) {
                firstDayOfMonth.push(startDate);
            } else {
                firstDayOfMonth.push(0);
            }

            startDate = moment(startDate).add(1, 'day');
        }
    };

    var getFirstDayOfWeek = function () {
        return firstDayOfWeek;
    };

    var getFirstDayOfMonth = function () {
        return firstDayOfMonth;
    };

    var resetDates = function (newStartDate, newEndDate) {
        startDate = newStartDate;
        endDate = newEndDate;
        noDays = moment(endDate).diff(startDate, 'days');
        firstDays(startDate, noDays);
    };

    resetDates(startDate, endDate);

    return {
        startDate: startDate,
        endDate: endDate,
        noDays: noDays,
        getNoDays: getNoDays,
        getStartDate: getStartDate,
        getEndDate: getEndDate,
        resetDates: resetDates,
        firstDayOfWeekArray: getFirstDayOfWeek,
        firstDayOfMonthArray: getFirstDayOfMonth
    };
})

// Provide task list
// API:
//
// Tasks.getTasksInRange(startDate, endDate)
// @startDate - Start date
// @endDate - End date
// @return - An array of task objects
//
//
// Tasks.activeWorkstreams
// @return -  An array of active work streams

.factory('Tasks', function (DateRange) {

    var workstreamList =
    [
        {
        'name': 'Drupal',
        'color': '#00a8e1',
        'active': true,
        'tasks': [
        {
            'title': 'task5',
            'startDate': '2014-10-21',
            'endDevDate': '2014-12-27',
            'releaseDate': '2015-03-11',
            'description': '',
            'order': 7
        }, {
            'title': 'task7',
            'startDate': '2014-01-01',
            'endDevDate': '2014-02-21',
            'releaseDate': '2014-03-07',
            'description': '',
            'order': 5
        }, {
            'title': 'task1',
            'startDate': '2012-12-20',
            'endDevDate': '2014-01-01',
            'releaseDate': '2014-03-11',
            'description': '',
            'order': 1
        }, {
            'title': 'task1 very long task1 very long task1 very long task1 ',
            'startDate': '2014-01-07',
            'endDevDate': '2014-02-10',
            'releaseDate': '2014-03-11',
            'description': '',
            'order': 6
        }, {
            'title': 'task3',
            'startDate': '2014-01-22',
            'endDevDate': '2014-02-10',
            'releaseDate': '2014-03-11',
            'description': '',
            'order': 9,
            'workstream': 1
        }]
        }, {
        'name': 'XYZ',
        'color': '#ec7a08',
        'active': true,
        'tasks': [
        {
            'title': 'task6',
            'startDate': '2014-01-19',
            'endDevDate': '2014-02-20',
            'releaseDate': '2014-03-12',
            'description': '',
            'order': 10
        }, {
            'title': 'task8',
            'startDate': '2014-01-09',
            'endDevDate': '2014-02-10',
            'releaseDate': '2014-03-11',
            'description': '',
            'order': 4
        },{
            'title': 'task22',
            'startDate': '2014-04-01',
            'endDevDate': '2014-06-10',
            'releaseDate': '2015-11-15',
            'description': 'wedewdwedwdwd ewd ewd ew d ewd ewd ewdew d wed ewdew descriptionde    de ewd ewdew d ewd ew de ewdew  wd descdew',
            'order': 2
        }]
        }, {
        'name': 'Work Stream 1',
        'color': '#3f9c35',
        'active': true,
        'tasks': [
        {
            'title': 'task2',
            'startDate': '2014-04-25',
            'endDevDate': '2014-06-10',
            'releaseDate': '2014-12-11',
            'description': 'wedewdwedwdwd ewd ewd ew d ewd ewd ewdew d wed ewdew descde    de ewd ewdew d ewd ew de ewdew  wd descdew',
            'order': 3
        }, {
            'title': 'task4',
            'startDate': '2014-08-22',
            'endDevDate': '2014-10-10',
            'releaseDate': '2014-11-10',
            'description': '',
            'order': 8
        }]
        }
    ];

    var tasksInRange,
        activeWorkstreams = [],
        startDate = DateRange.getStartDate(),
        endDate = DateRange.getEndDate(),
        tasksInRange = [],
        allTasks = [];

        var build = function (startDate, endDate) {
            for( var i = 0, workstreamlenght = workstreamList.length; i < workstreamlenght; i++ ){
                var taskLength = workstreamList[i].tasks.length;
                if( workstreamList[i].active === true ) {
                    var workstream = {};
                    workstream.name = workstreamList[i].name;
                    workstream.color = workstreamList[i].color;
                    activeWorkstreams.push(workstream);

                    for( var j = 0; j < taskLength; j++ ) {
                        var task = workstreamList[i].tasks[j];
                        task.color = workstreamList[i].color;
                        task.workstream = workstreamList[i].name;
                        allTasks.push(task);
                    }
                }
            }
        };

        build();

        var getTasksInRange = function (startDate, endDate) {
            tasksInRange = [];
            for( var i = 0, allTasksLenght = allTasks.length; i < allTasksLenght; i++ ){
                var task = allTasks[i];
                if (moment(task.startDate).isAfter(startDate) && moment(task.startDate).isBefore(endDate)) {
                    tasksInRange.push(task);
                } else if (moment(task.releaseDate).isAfter(startDate) && moment(task.releaseDate).isBefore(endDate)) {
                    tasksInRange.push(task);
                } else if (moment(task.startDate).isBefore(startDate) && moment(task.releaseDate).isAfter(endDate)) {
                    tasksInRange.push(task);
                }
            }
            return tasksInRange;
        };

        getTasksInRange(startDate, endDate);

        return {
            getTasksInRange : getTasksInRange,
            activeWorkstreams : activeWorkstreams
        };
    });
