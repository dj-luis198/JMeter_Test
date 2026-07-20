/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.72659176029963, "KoPercent": 1.2734082397003745};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8165374677002584, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4051724137931034, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da9bd39c-dfb7-4536-8f9d-d332d54ad34b"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/71706e0c-5f5a-4bdf-b892-6f59657d350e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e4b5994-9aed-4470-9f70-efbe33b36463"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd97240d-05e1-4cb6-b042-02f83010f21e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d4ac5a0-87e1-4f3c-abf6-281711df0b44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b376cc1b-ebb2-462b-b5a0-eaf29835bbef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d3792f66-018a-460e-9815-36810c2048e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6b1c691-5b45-42b6-bb3c-31dff9195500"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3976872-20ff-4d3d-a082-00a99b35c0b5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b64109f-e488-478c-93f3-a9a8e2d8c0ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25fecc77-19fd-4db4-a014-0b0b3e51647f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5a0445b-0a79-4390-a85c-312f2351083d"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb20e6fb-db07-4fb9-b18b-e55fd08db74d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba8c0419-18bd-4fa9-9a2a-63482eb03b37"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71706e0c-5f5a-4bdf-b892-6f59657d350e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb6832f7-c63c-477d-94ee-4635cbda2217"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da9bd39c-dfb7-4536-8f9d-d332d54ad34b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b376cc1b-ebb2-462b-b5a0-eaf29835bbef"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d4ac5a0-87e1-4f3c-abf6-281711df0b44"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9241573033707865, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd97240d-05e1-4cb6-b042-02f83010f21e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5a0445b-0a79-4390-a85c-312f2351083d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b64109f-e488-478c-93f3-a9a8e2d8c0ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d620bda9-cf21-43e0-8316-15a51cfc6da9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3976872-20ff-4d3d-a082-00a99b35c0b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25fecc77-19fd-4db4-a014-0b0b3e51647f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb20e6fb-db07-4fb9-b18b-e55fd08db74d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6b1c691-5b45-42b6-bb3c-31dff9195500"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3792f66-018a-460e-9815-36810c2048e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a082a3c-d987-41f5-83e2-39aa7a540045"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 17, 1.2734082397003745, 307.1520599250933, 77, 2874, 95.0, 860.0, 1060.6000000000001, 1513.4400000000046, 5.248796904979084, 737.1762550792431, 3.839215571479964], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1330.9655172413786, 982, 1752, 1302.5, 1609.2, 1748.05, 1752.0, 0.2437292252352197, 293.28710980999625, 1.1984146963470033], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da9bd39c-dfb7-4536-8f9d-d332d54ad34b", 3, 0, 0.0, 590.0, 201, 1240, 329.0, 1240.0, 1240.0, 1240.0, 0.038954462233648866, 0.025043965791489747, 0.024980563346448], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 700.1538461538461, 394, 2062, 473.0, 1685.5999999999997, 2062.0, 2062.0, 0.06562971713591914, 0.011856931318501018, 0.04460769836582005], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 700.1538461538461, 394, 2062, 473.0, 1685.5999999999997, 2062.0, 2062.0, 0.06542164248582112, 0.011819339706911042, 0.04446627262708154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 90.93333333333334, 78, 237, 81.0, 144.60000000000005, 237.0, 237.0, 0.09149465671204801, 0.03364334772849266, 0.0516682716354365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71706e0c-5f5a-4bdf-b892-6f59657d350e", 3, 0, 0.0, 1409.0, 181, 2874, 1172.0, 2874.0, 2874.0, 2874.0, 0.07095050020102642, 0.032103253671688384, 0.045498855923184256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 82.26666666666668, 79, 87, 83.0, 85.8, 87.0, 87.0, 0.09149242442725743, 0.06799388182533486, 0.045924908355088195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 177.93333333333334, 80, 639, 83.0, 447.60000000000014, 639.0, 639.0, 0.09136091214734687, 1.8138590887358086, 0.0532760214911319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 165.46666666666667, 77, 1024, 82.0, 556.6000000000003, 1024.0, 1024.0, 0.09140879230703604, 5.506314490807322, 0.053214675833952875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e4b5994-9aed-4470-9f70-efbe33b36463", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 197.5, 81, 341, 181.0, 335.0, 341.0, 341.0, 0.0707857215087471, 0.13935938922034583, 0.0457569253084235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd97240d-05e1-4cb6-b042-02f83010f21e", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 85.60000000000001, 80, 103, 82.0, 102.4, 103.0, 103.0, 0.13440498911319587, 0.09988495772963094, 0.06746500430095966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 92.33333333333334, 78, 246, 82.0, 150.60000000000005, 246.0, 246.0, 0.13420657075370412, 0.04934887445422661, 0.07578826788526233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 595.2, 429, 647, 632.0, 647.0, 647.0, 647.0, 0.03569694719707571, 10.496087726140159, 0.020358415198332237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 840.0, 694, 1073, 847.0, 1073.0, 1073.0, 1073.0, 0.035583642911026656, 32.01822444071409, 0.020259046696414592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 147.2, 79, 244, 87.0, 244.0, 244.0, 244.0, 0.03583715596330275, 0.06341496738818807, 0.01984342522577408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 106.99999999999999, 79, 245, 84.0, 243.0, 245.0, 245.0, 0.06049632916916935, 0.044958697751697134, 0.030366321477493203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d4ac5a0-87e1-4f3c-abf6-281711df0b44", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 92.14285714285715, 79, 235, 81.0, 160.5, 235.0, 235.0, 0.06050181937613981, 0.01618896338775616, 0.03450494386295474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 103.71428571428572, 78, 243, 81.0, 239.0, 243.0, 243.0, 0.06050234230496638, 0.01630727194938547, 0.035568759831630624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 115.07142857142857, 79, 241, 81.0, 240.5, 241.0, 241.0, 0.06050234230496638, 0.01630727194938547, 0.03562784415028782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 145.4, 80, 250, 81.0, 250.0, 250.0, 250.0, 0.03579713050201896, 0.026603140929723077, 0.020100927772129788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 579.8749999999999, 78, 1042, 748.0, 1017.5, 1042.0, 1042.0, 0.07281597582509602, 40.95732422052773, 0.03889681521125735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 155.26666666666668, 78, 1045, 82.0, 557.2000000000003, 1045.0, 1045.0, 0.13325397318930057, 8.026998990045929, 0.07757532736059414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 432.7499999999999, 79, 732, 622.0, 722.2, 732.0, 732.0, 0.07281630721200014, 13.388867382162736, 0.03896810190642194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 123.39999999999999, 77, 469, 82.0, 381.40000000000003, 469.0, 469.0, 0.13393933441080086, 2.659201548561938, 0.0781051183800484], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 465.6666666666667, 172, 731, 491.5, 686.3000000000002, 731.0, 731.0, 0.07013278473910604, 0.012670473805404899, 0.04835326760332897], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b376cc1b-ebb2-462b-b5a0-eaf29835bbef", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 234.35714285714286, 161, 488, 169.0, 484.5, 488.0, 488.0, 0.06047516198704104, 0.093724689524838, 0.13601005669546437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 793.3181818181818, 104, 1590, 818.0, 1373.3, 1558.3499999999995, 1590.0, 0.09511909342856772, 0.05842764625641514, 0.043007949470143414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.875, 80, 90, 83.0, 90.0, 90.0, 90.0, 0.07281465030764189, 0.05411323133214403, 0.036549541267703066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3792f66-018a-460e-9815-36810c2048e0", 3, 0, 0.0, 859.6666666666666, 181, 1882, 516.0, 1882.0, 1882.0, 1882.0, 0.02668398160584201, 0.026762157333202877, 0.01711179810010051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 123.9375, 80, 275, 82.0, 256.1, 275.0, 275.0, 0.0728156444412082, 0.08783742655859611, 0.037705561977490865], "isController": false}, {"data": ["login", 22, 0, 0.0, 2830.9545454545455, 1823, 4294, 2694.5, 4257.2, 4290.1, 4294.0, 0.09390192370895525, 25.661122396088984, 0.17706648256198593], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 97.93333333333334, 83, 241, 86.0, 153.40000000000003, 241.0, 241.0, 0.13548666811185778, 0.10968598424290049, 0.04816127655538695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6b1c691-5b45-42b6-bb3c-31dff9195500", 3, 0, 0.0, 337.6666666666667, 170, 448, 395.0, 448.0, 448.0, 448.0, 0.018950520191779265, 0.0223988733126141, 0.012152514576108449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3976872-20ff-4d3d-a082-00a99b35c0b5", 3, 0, 0.0, 319.3333333333333, 183, 520, 255.0, 520.0, 520.0, 520.0, 0.029959853795913476, 0.02497629738650209, 0.019212536451155452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b64109f-e488-478c-93f3-a9a8e2d8c0ab", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25fecc77-19fd-4db4-a014-0b0b3e51647f", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5a0445b-0a79-4390-a85c-312f2351083d", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 665.25, 161, 1127, 835.0, 1103.2, 1127.0, 1127.0, 0.07278815008916548, 54.467260757292465, 0.15206254890453835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb20e6fb-db07-4fb9-b18b-e55fd08db74d", 3, 0, 0.0, 342.6666666666667, 191, 551, 286.0, 551.0, 551.0, 551.0, 0.03487398865432903, 0.029073009421789267, 0.02236385340137636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba8c0419-18bd-4fa9-9a2a-63482eb03b37", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 308.1333333333333, 161, 1112, 320.0, 685.4000000000003, 1112.0, 1112.0, 0.09131363799621353, 7.414940870614663, 0.20380894866042892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 835.3333333333334, 81, 1154, 930.0, 1154.0, 1154.0, 1154.0, 0.03999893336177702, 39.878975623150055, 0.07946402679261887], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1126.3181818181818, 107, 2259, 1100.5, 1760.8999999999999, 2189.099999999999, 2259.0, 0.09131699865930043, 0.028877055151316416, 0.04119966150448906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71706e0c-5f5a-4bdf-b892-6f59657d350e", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 110.57894736842104, 81, 331, 88.0, 263.0, 331.0, 331.0, 0.09444936022985992, 0.0733273841628307, 0.03357379601920802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 259.5333333333333, 163, 1127, 168.0, 693.8000000000002, 1127.0, 1127.0, 0.13315815638093886, 10.812841079069313, 0.2972044970838364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 322.8095238095239, 162, 1101, 172.0, 872.0000000000003, 1087.7999999999997, 1101.0, 0.10812870405173701, 12.471572971750088, 0.24054915704664467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 109.66666666666667, 80, 244, 82.5, 242.5, 244.0, 244.0, 0.06244178604322012, 0.046404491385635266, 0.031342849634975724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 120.74999999999999, 78, 242, 81.0, 240.5, 242.0, 242.0, 0.06244568526333866, 0.01670909937710429, 0.035613554876747826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 121.25, 78, 239, 83.0, 238.7, 239.0, 239.0, 0.06244633518070408, 0.016831238779174147, 0.036711615018343614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 120.33333333333334, 79, 242, 81.5, 239.9, 242.0, 242.0, 0.06244633518070408, 0.016831238779174147, 0.03677259776754352], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 911.8793103448278, 624, 1415, 872.5, 1269.5, 1363.6, 1415.0, 0.2462939135678221, 294.65314624550405, 0.48633427073646124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1126.3181818181818, 107, 2259, 1100.5, 1760.8999999999999, 2189.099999999999, 2259.0, 0.09422446838126647, 0.02979648050195944, 0.0425114300704542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 108.5, 80, 245, 81.5, 245.0, 245.0, 245.0, 0.029645001111687542, 0.007990254205884532, 0.017456968428073816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 106.33333333333333, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.029645879963832028, 0.0079904910840016, 0.017428534900612188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 138.78947368421055, 79, 851, 82.0, 237.0, 851.0, 851.0, 0.09237650719564372, 4.398353365968981, 0.05388946117755737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 129.10526315789474, 77, 640, 82.0, 237.0, 640.0, 640.0, 0.09237471072130064, 1.4531259875585851, 0.05397862285107252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 90.21052631578947, 78, 233, 82.0, 89.0, 233.0, 233.0, 0.09238010035396166, 0.06865357067320783, 0.04637048006048466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 80.0, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.029669335258543532, 0.007938865098477467, 0.016920792764638107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 98.26315789473685, 79, 237, 82.0, 233.0, 237.0, 237.0, 0.09237336341139693, 0.03201922095222352, 0.05227337228410157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 82.16666666666667, 80, 83, 82.5, 83.0, 83.0, 83.0, 0.029668455015205084, 0.02204852955719831, 0.014892173708804112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb6832f7-c63c-477d-94ee-4635cbda2217", 2, 0, 0.0, 182.5, 175, 190, 182.5, 190.0, 190.0, 190.0, 0.019432380175085744, 0.0332096340882813, 0.012078818341252028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 85.16666666666666, 81, 89, 85.0, 89.0, 89.0, 89.0, 0.030877698582199006, 0.024304126032473047, 0.010976056917891053], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 601.8333333333334, 389, 1240, 518.0, 1219.6000000000001, 1240.0, 1240.0, 0.07035936043341366, 0.012711407890802273, 0.047891088107509104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1311.227272727273, 908, 2307, 1191.5, 1975.7999999999997, 2282.2499999999995, 2307.0, 0.09450943161168653, 0.04891601440839244, 0.043470646766703466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 191.66666666666669, 163, 328, 164.5, 328.0, 328.0, 328.0, 0.029632556301856974, 0.0459246746592256, 0.06664431363591466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da9bd39c-dfb7-4536-8f9d-d332d54ad34b", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b376cc1b-ebb2-462b-b5a0-eaf29835bbef", 3, 0, 0.0, 326.6666666666667, 172, 552, 256.0, 552.0, 552.0, 552.0, 0.018376722817764164, 0.025333795941807045, 0.011784552067381318], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 898.2, 404, 1737, 755.5, 1534.5, 1684.5999999999997, 1737.0, 0.27522935779816515, 83.37201207712155, 1.0009631235665137], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 143.43103448275863, 80, 576, 84.0, 329.2, 332.15, 576.0, 0.2468683893540135, 0.18346371513516044, 0.11933579368187176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d4ac5a0-87e1-4f3c-abf6-281711df0b44", 3, 0, 0.0, 308.0, 193, 536, 195.0, 536.0, 536.0, 536.0, 0.02088031403992316, 0.02467982430955762, 0.01339004513627885], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 514.1034482758622, 384, 727, 479.0, 655.5, 720.15, 727.0, 0.24710293115201093, 72.65646634820212, 0.12427539994461487], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 120.20689655172416, 78, 328, 84.0, 240.0, 242.34999999999997, 328.0, 0.24742443956231472, 0.4378252778192522, 0.12032946377151633], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 767.0517241379308, 539, 1084, 774.5, 968.3, 1032.6, 1084.0, 0.24693460490463218, 222.1921915579232, 0.12394959660252043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 102.61904761904762, 82, 247, 87.0, 212.2000000000001, 246.29999999999998, 247.0, 0.10680880714906948, 0.07979368893460757, 0.0379671931662708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, 6.179775280898877, 155.74719101123588, 80, 1194, 91.0, 290.29999999999995, 448.09999999999997, 1051.0100000000014, 0.7174989116589542, 1.5419345740757162, 0.34414140598547266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 112.00000000000001, 81, 238, 85.5, 237.7, 238.0, 238.0, 0.06606801702352572, 0.05116400146450771, 0.02348511542633141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd97240d-05e1-4cb6-b042-02f83010f21e", 3, 0, 0.0, 302.3333333333333, 214, 389, 304.0, 389.0, 389.0, 389.0, 0.03510291003124159, 0.028738222242373896, 0.022510655195815736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 90.86666666666666, 83, 116, 88.0, 106.4, 116.0, 116.0, 0.0964394553099564, 0.07826287828376345, 0.034281212629711066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5a0445b-0a79-4390-a85c-312f2351083d", 3, 0, 0.0, 308.6666666666667, 180, 402, 344.0, 402.0, 402.0, 402.0, 0.08130301634190629, 0.03678749762866202, 0.05213767649529798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 258.0, 160, 483, 172.0, 480.6, 483.0, 483.0, 0.06241580368149215, 0.0967323051196563, 0.14037460535007465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 256.7368421052632, 161, 1085, 170.0, 322.0, 1085.0, 1085.0, 0.09233565468409057, 5.949546537777432, 0.20642163345417966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b64109f-e488-478c-93f3-a9a8e2d8c0ab", 3, 0, 0.0, 1115.3333333333333, 341, 2548, 457.0, 2548.0, 2548.0, 2548.0, 0.03418842379970142, 0.028501482210623486, 0.02192421708509499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d620bda9-cf21-43e0-8316-15a51cfc6da9", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3976872-20ff-4d3d-a082-00a99b35c0b5", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25fecc77-19fd-4db4-a014-0b0b3e51647f", 3, 0, 0.0, 266.0, 174, 439, 185.0, 439.0, 439.0, 439.0, 0.08704482808646452, 0.03938551791672711, 0.05581976280284346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 100.35714285714286, 84, 257, 87.0, 177.0, 257.0, 257.0, 0.06303296624134422, 0.05226073079970825, 0.02240624971860283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb20e6fb-db07-4fb9-b18b-e55fd08db74d", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 111.5625, 81, 272, 91.0, 257.3, 272.0, 272.0, 0.07112628471851773, 0.05522011362423984, 0.0252831715210356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6b1c691-5b45-42b6-bb3c-31dff9195500", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3792f66-018a-460e-9815-36810c2048e0", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 98.76190476190477, 79, 237, 83.0, 209.8000000000001, 237.0, 237.0, 0.10826137388838768, 0.08045596243072561, 0.0543421349400696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 119.9047619047619, 78, 247, 82.0, 245.4, 246.9, 247.0, 0.1081782778018174, 0.044420302873421115, 0.06083015881601451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 194.85714285714286, 79, 887, 83.0, 740.2000000000005, 884.6999999999999, 887.0, 0.10826528087107151, 9.304238891853297, 0.06276204386806071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 177.57142857142858, 79, 655, 83.0, 569.4000000000002, 652.3, 655.0, 0.10826695537854768, 3.058219266362488, 0.06286874403887299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a082a3c-d987-41f5-83e2-39aa7a540045", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.37453183520599254], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.0749063670411985], "isController": false}, {"data": ["401/Unauthorized", 11, 64.70588235294117, 0.8239700374531835], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 17, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
