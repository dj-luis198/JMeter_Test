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

    var data = {"OkPercent": 97.25315515961395, "KoPercent": 2.7468448403860433};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.727243793761935, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98393800-31b5-477c-8fbd-8f319835bb58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b7d3ecb-c5c9-4f44-8396-ae449aa4b543"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cb0eedd-dc76-491b-97aa-5aa66d70856f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1892eb28-0d38-4808-8082-745dc51a25cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36f5a8c8-45f2-46cd-975b-833d0cba088c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a370816-8d0c-4192-b354-f8f5c8d791ee"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89cccb4f-1448-48cc-a035-83a1353371d9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/964a0838-dcf4-4c18-9b31-3f0b49abd918"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/978137c4-f63a-4986-ad30-981ddc4ab655"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c6efdd0-8907-4bed-8de9-ee2be8790f55"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36f5a8c8-45f2-46cd-975b-833d0cba088c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71e9179a-a016-44c9-a312-e2b8d17bf751"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4cb5d37-00ea-472c-9748-9d3ca9550e78"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/45a197ed-780c-4dfe-8eaf-c40f180cea1c"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bf69629-9445-4f42-959c-baca2aca504a"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/639d1265-69e3-4332-934c-4855c9b4742c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b7d3ecb-c5c9-4f44-8396-ae449aa4b543"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98393800-31b5-477c-8fbd-8f319835bb58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1892eb28-0d38-4808-8082-745dc51a25cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9cb0eedd-dc76-491b-97aa-5aa66d70856f"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=964a0838-dcf4-4c18-9b31-3f0b49abd918"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "addBook"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89cccb4f-1448-48cc-a035-83a1353371d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8908045977011494, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71e9179a-a016-44c9-a312-e2b8d17bf751"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c6efdd0-8907-4bed-8de9-ee2be8790f55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0367b0b1-0886-4f15-8762-cd398e4c450b"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b4cb5d37-00ea-472c-9748-9d3ca9550e78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0b7c2c2-b875-432b-906a-f4fbbbab2d54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7bf69629-9445-4f42-959c-baca2aca504a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1347, 37, 2.7468448403860433, 477.4677060133636, 139, 2675, 158.0, 1317.8000000000002, 1638.6, 2092.2799999999997, 5.313881974223531, 749.1406001898026, 3.8840556603987584], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 2401.7000000000003, 1735, 3286, 2351.0, 2836.8, 3131.0, 3286.0, 0.25441084807856207, 306.14131886583647, 1.250936152417539], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/98393800-31b5-477c-8fbd-8f319835bb58", 3, 0, 0.0, 369.3333333333333, 256, 474, 378.0, 474.0, 474.0, 474.0, 0.02126483222047378, 0.02931528790810757, 0.01363662743305122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b7d3ecb-c5c9-4f44-8396-ae449aa4b543", 3, 0, 0.0, 351.0, 238, 481, 334.0, 481.0, 481.0, 481.0, 0.03640379084808698, 0.02340412985838925, 0.023344878896722442], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 439.375, 146, 769, 487.0, 654.9000000000001, 769.0, 769.0, 0.09847123409074124, 0.020602990140567684, 0.06575166631791438], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 439.375, 146, 769, 487.0, 654.9000000000001, 769.0, 769.0, 0.10097695201070356, 0.021127257781536363, 0.06742479583722516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 186.5, 141, 439, 147.0, 431.5, 439.0, 439.0, 0.0722811944983685, 0.019340866496633764, 0.041222868737350794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cb0eedd-dc76-491b-97aa-5aa66d70856f", 1, 0, 0.0, 1296.0, 1296, 1296, 1296.0, 1296.0, 1296.0, 1296.0, 0.7716049382716049, 0.13940128279320987, 0.5319854359567902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 174.42857142857144, 143, 452, 150.0, 321.5, 452.0, 452.0, 0.07228044813877847, 0.05371623147813517, 0.036281396819660285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 210.64285714285717, 144, 448, 147.0, 445.5, 448.0, 448.0, 0.07228156768394368, 0.019482141289812946, 0.0425642434701348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 148.21428571428572, 142, 151, 149.0, 151.0, 151.0, 151.0, 0.07228194087337238, 0.019482241876026145, 0.04249387539625992], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 249.88235294117644, 141, 439, 255.0, 354.99999999999994, 439.0, 439.0, 0.10068167415856771, 0.15193054334049952, 0.06506599461649167], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1892eb28-0d38-4808-8082-745dc51a25cf", 3, 0, 0.0, 330.6666666666667, 236, 411, 345.0, 411.0, 411.0, 411.0, 0.07320644216691069, 0.03312400866276233, 0.046945537457296245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36f5a8c8-45f2-46cd-975b-833d0cba088c", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 148.9444444444444, 141, 154, 149.0, 153.1, 154.0, 154.0, 0.11298300233498204, 0.08396490700871224, 0.05671217109392653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1124.4, 898, 1220, 1162.0, 1220.0, 1220.0, 1220.0, 0.030319752105706785, 8.91501382959693, 0.0172917336227859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 200.2222222222222, 146, 444, 149.5, 438.6, 444.0, 444.0, 0.11297732921593734, 0.049084334438000546, 0.06337812413697873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1618.4, 1313, 1962, 1595.0, 1962.0, 1962.0, 1962.0, 0.030202903103046266, 27.17662530316164, 0.017195598153394505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 262.2, 144, 439, 149.0, 439.0, 439.0, 439.0, 0.03050770929813964, 0.05398434496897366, 0.016892452316450368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 150.3125, 143, 176, 149.5, 159.9, 176.0, 176.0, 0.07559328920575076, 0.05617821590388313, 0.037944287745855364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 149.5625, 143, 170, 148.0, 160.9, 170.0, 170.0, 0.075595074980865, 0.020227588422614268, 0.04311281620002457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 195.9375, 142, 605, 147.0, 495.8000000000001, 605.0, 605.0, 0.07559543214601258, 0.020375331320604952, 0.04444184585146443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 166.625, 141, 438, 147.5, 251.1000000000002, 438.0, 438.0, 0.07559614648643286, 0.020375523857671354, 0.04451609016730372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 148.0, 144, 152, 149.0, 152.0, 152.0, 152.0, 0.03050640634533252, 0.02267126487187309, 0.01713006215680293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 922.1578947368421, 142, 2004, 442.0, 1989.0, 2004.0, 2004.0, 0.08982304859426929, 38.2972912810776, 0.049149680064483496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 333.72222222222223, 139, 1551, 149.0, 1470.0000000000002, 1551.0, 1551.0, 0.11297803832466122, 11.322382930430635, 0.06533994620990063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 594.7368421052631, 141, 1312, 441.0, 1192.0, 1312.0, 1312.0, 0.08982347323733253, 12.523255489277913, 0.04923763065769692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 292.83333333333337, 143, 1197, 148.5, 1134.9, 1197.0, 1197.0, 0.11298229316394358, 3.718240402781875, 0.06545274123288788], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 500.3999999999999, 148, 1296, 462.0, 1087.8000000000002, 1296.0, 1296.0, 0.09486585967442038, 0.020029295763290707, 0.06360212388848835], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3a370816-8d0c-4192-b354-f8f5c8d791ee", 2, 0, 0.0, 364.5, 230, 499, 364.5, 499.0, 499.0, 499.0, 0.05704181164793794, 0.033506493853744795, 0.035456165150305176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 348.875, 292, 756, 299.5, 641.9000000000001, 756.0, 756.0, 0.07554118174736196, 0.117074077571351, 0.16989388824626425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89cccb4f-1448-48cc-a035-83a1353371d9", 3, 0, 0.0, 352.6666666666667, 243, 459, 356.0, 459.0, 459.0, 459.0, 0.05629785317519892, 0.024923528749437023, 0.03610246443852275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/964a0838-dcf4-4c18-9b31-3f0b49abd918", 3, 0, 0.0, 543.3333333333334, 255, 822, 553.0, 822.0, 822.0, 822.0, 0.02918401494221565, 0.024329512456710375, 0.018715009582084906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/978137c4-f63a-4986-ad30-981ddc4ab655", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 515.9090909090908, 162, 1063, 468.0, 863.3, 1033.8999999999996, 1063.0, 0.09914956712200354, 0.060903396210683816, 0.044830321853015276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 164.8421052631579, 143, 441, 150.0, 158.0, 441.0, 441.0, 0.08982219932018778, 0.06675263054947549, 0.04508653364314113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 270.10526315789474, 140, 447, 151.0, 444.0, 447.0, 447.0, 0.08969922433776008, 0.08781819619580869, 0.04758816784613278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c6efdd0-8907-4bed-8de9-ee2be8790f55", 3, 0, 0.0, 413.0, 263, 491, 485.0, 491.0, 491.0, 491.0, 0.03363190995616641, 0.0280375395174942, 0.021567338090380153], "isController": false}, {"data": ["login", 22, 0, 0.0, 2569.045454545455, 1519, 3953, 2393.5, 3590.0, 3904.8499999999995, 3953.0, 0.09751297587440329, 26.647935529794648, 0.18387567538816812], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/36f5a8c8-45f2-46cd-975b-833d0cba088c", 3, 0, 0.0, 338.6666666666667, 248, 510, 258.0, 510.0, 510.0, 510.0, 0.06119451697127937, 0.02768892532229112, 0.03924257761504569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 183.11111111111111, 148, 432, 153.0, 427.5, 432.0, 432.0, 0.11057258168549472, 0.08951627950905774, 0.039305097396015704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71e9179a-a016-44c9-a312-e2b8d17bf751", 3, 0, 0.0, 517.0, 229, 982, 340.0, 982.0, 982.0, 982.0, 0.03264559937320449, 0.026896488285670758, 0.02093484074388439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4cb5d37-00ea-472c-9748-9d3ca9550e78", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1105.3157894736844, 293, 2157, 884.0, 2142.0, 2157.0, 2157.0, 0.08963490288765916, 50.86840630616924, 0.19072755677663453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45a197ed-780c-4dfe-8eaf-c40f180cea1c", 2, 0, 0.0, 749.5, 230, 1269, 749.5, 1269.0, 1269.0, 1269.0, 0.019730676268929118, 0.027900409411532583, 0.012264233833177133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 7, 58.333333333333336, 846.9999999999999, 141, 2112, 298.5, 2061.6000000000004, 2112.0, 2112.0, 0.05792819799858076, 28.884985146847985, 0.07673317698754062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 387.57142857142856, 294, 901, 301.0, 748.5, 901.0, 901.0, 0.07222563287710808, 0.11193562439059623, 0.16243714112888666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bf69629-9445-4f42-959c-baca2aca504a", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1094.3478260869565, 184, 1980, 1049.0, 1862.2000000000003, 1973.3999999999999, 1980.0, 0.09122314370818113, 0.028739628325182745, 0.04115731679021453], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 162.38461538461536, 147, 257, 152.0, 224.99999999999997, 257.0, 257.0, 0.06824935163115951, 0.05298655717458184, 0.024260511712638728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 550.4444444444446, 296, 1702, 329.5, 1619.2, 1702.0, 1702.0, 0.11287106362165619, 15.159161916676073, 0.25064087641245597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 600.9565217391304, 288, 2058, 585.0, 1339.400000000001, 1974.199999999999, 2058.0, 0.11018808627248076, 11.61881251227639, 0.2453640533525923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 190.57142857142858, 147, 440, 150.0, 440.0, 440.0, 440.0, 0.037292162785618005, 0.0277141951951712, 0.018718917648249667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 228.7142857142857, 143, 436, 150.0, 436.0, 436.0, 436.0, 0.03729355354288759, 0.017980820458177945, 0.020821540356952585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 418.57142857142856, 147, 1762, 149.0, 1762.0, 1762.0, 1762.0, 0.037292560134253215, 4.802317174888788, 0.021466113715670865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 348.42857142857144, 143, 1275, 149.0, 1275.0, 1275.0, 1275.0, 0.03729355354288759, 1.5751219532498668, 0.021503105021310604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 150.5, 148, 154, 150.0, 154.0, 154.0, 154.0, 0.03563569627696063, 0.01050974636293175, 0.022028706780582108], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1654.6333333333334, 1142, 2675, 1545.0, 2190.2, 2504.6, 2675.0, 0.2620682425703653, 313.524727776613, 0.5174824086692175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1094.3478260869565, 184, 1980, 1049.0, 1862.2000000000003, 1973.3999999999999, 1980.0, 0.09073443608547972, 0.02858566218385953, 0.04093682565575355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/639d1265-69e3-4332-934c-4855c9b4742c", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 229.71428571428572, 142, 443, 146.0, 443.0, 443.0, 443.0, 0.04190036094168069, 0.011293456660062373, 0.024673747702962358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 228.28571428571428, 146, 437, 148.0, 437.0, 437.0, 437.0, 0.041830502802643686, 0.011274627708525055, 0.024591760436710446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 235.84615384615384, 145, 440, 149.0, 438.8, 440.0, 440.0, 0.06700547383178533, 0.01806006911872339, 0.03939188988938942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b7d3ecb-c5c9-4f44-8396-ae449aa4b543", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 213.30769230769226, 147, 435, 149.0, 433.4, 435.0, 435.0, 0.06690959998352995, 0.018034228120560804, 0.039400867959051324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 195.69230769230768, 148, 444, 151.0, 442.8, 444.0, 444.0, 0.06700409240379758, 0.04979503351493161, 0.03363291356987496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 189.42857142857142, 146, 443, 147.0, 443.0, 443.0, 443.0, 0.04189935774270203, 0.011211351583496442, 0.023895727462634752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98393800-31b5-477c-8fbd-8f319835bb58", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 192.84615384615384, 145, 439, 148.0, 438.6, 439.0, 439.0, 0.06690477905983346, 0.0179022553343695, 0.038156631807561264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 230.85714285714283, 143, 443, 148.0, 443.0, 443.0, 443.0, 0.04182650366280668, 0.03108395438222254, 0.020994944221369757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1892eb28-0d38-4808-8082-745dc51a25cf", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 191.7142857142857, 146, 438, 151.0, 438.0, 438.0, 438.0, 0.0407012239439486, 0.03203631494025642, 0.014468013198825477], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 485.2857142857143, 144, 982, 477.5, 902.0, 982.0, 982.0, 0.0867765009235499, 0.01729355909169797, 0.059047486503154945], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1285.2727272727273, 674, 2099, 1225.5, 1865.3, 2065.6999999999994, 2099.0, 0.09913705698127662, 0.05131117207038731, 0.045599173670098914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cb0eedd-dc76-491b-97aa-5aa66d70856f", 3, 0, 0.0, 371.0, 239, 561, 313.0, 561.0, 561.0, 561.0, 0.030163486094632912, 0.025146057255323855, 0.019343120965633735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 503.0, 292, 887, 299.0, 887.0, 887.0, 887.0, 0.04172105303937871, 0.06465948356786524, 0.09383162612274333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=964a0838-dcf4-4c18-9b31-3f0b49abd918", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.23709194553805774, 0.9047941272965879], "isController": false}, {"data": ["addBook", 57, 16, 28.07017543859649, 1449.1228070175446, 745, 4247, 1161.0, 2547.2000000000003, 2640.9999999999995, 4247.0, 0.2784277138153877, 82.9029489372121, 1.011714189677659], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 256.16666666666663, 142, 600, 151.0, 589.8, 595.9, 600.0, 0.2633993441356331, 0.19574892664767266, 0.12732683139368983], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 947.9000000000001, 705, 1493, 879.0, 1272.5, 1348.85, 1493.0, 0.2633218934599619, 77.42537978697258, 0.13243239758972694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89cccb4f-1448-48cc-a035-83a1353371d9", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 198.48333333333335, 140, 454, 150.0, 440.0, 447.95, 454.0, 0.2639694851275193, 0.46710225297955554, 0.12837578475928182], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 1396.9666666666672, 992, 2085, 1337.0, 1884.8999999999999, 1903.95, 2085.0, 0.26280057816127195, 236.46842218365381, 0.13191357145985722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 153.695652173913, 149, 177, 153.0, 156.6, 172.99999999999994, 177.0, 0.11071531722345239, 0.0827121266366612, 0.03935583541927409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 16, 9.195402298850574, 216.00000000000009, 142, 1790, 154.0, 415.0, 448.25, 1676.75, 0.7268474038180375, 1.6313313591315428, 0.34470343242198925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 151.42857142857144, 144, 160, 152.0, 160.0, 160.0, 160.0, 0.036992997753996566, 0.028647897674725857, 0.013149854670365967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 154.0, 149, 167, 152.5, 164.5, 167.0, 167.0, 0.0721921135272551, 0.05858559213002831, 0.025662040355391463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71e9179a-a016-44c9-a312-e2b8d17bf751", 1, 0, 0.0, 949.0, 949, 949, 949.0, 949.0, 949.0, 949.0, 1.053740779768177, 0.1903730900948367, 0.7265048735511065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c6efdd0-8907-4bed-8de9-ee2be8790f55", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 0.2558981055240793, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0367b0b1-0886-4f15-8762-cd398e4c450b", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 651.5714285714286, 296, 1912, 301.0, 1912.0, 1912.0, 1912.0, 0.037262584106975555, 6.417929075328976, 0.08244242764404651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 456.6923076923076, 298, 881, 304.0, 879.0, 881.0, 881.0, 0.06685282607465917, 0.10360882322312902, 0.15035357270501962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4cb5d37-00ea-472c-9748-9d3ca9550e78", 3, 0, 0.0, 782.3333333333334, 261, 1389, 697.0, 1389.0, 1389.0, 1389.0, 0.017649965876732638, 0.024331902828112865, 0.011318500252982843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0b7c2c2-b875-432b-906a-f4fbbbab2d54", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.040182206840391, 1.9435820439739413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 191.8125, 149, 466, 153.5, 459.7, 466.0, 466.0, 0.07723237774355954, 0.06403348506277544, 0.02745369677603093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 184.89473684210526, 146, 478, 153.0, 444.0, 478.0, 478.0, 0.08725763045015753, 0.06774396114050316, 0.03101736082407943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bf69629-9445-4f42-959c-baca2aca504a", 3, 0, 0.0, 398.0, 256, 475, 463.0, 475.0, 475.0, 475.0, 0.03829510205644698, 0.03192505090057315, 0.024557731461979346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 198.65217391304347, 140, 442, 150.0, 439.0, 441.4, 442.0, 0.11041978722587088, 0.08206001765516381, 0.055425557259860966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 237.65217391304347, 141, 448, 149.0, 445.2, 448.0, 448.0, 0.11042402826855123, 0.043968942641918876, 0.06216977814372407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 333.91304347826076, 140, 1632, 148.0, 1069.4000000000015, 1602.5999999999997, 1632.0, 0.11026785500256493, 8.65489360050915, 0.06400142569145137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 307.0869565217391, 140, 1313, 148.0, 883.600000000001, 1284.7999999999995, 1313.0, 0.11042296797733928, 2.850480399923184, 0.06419929095251813], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 16.216216216216218, 0.44543429844098], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.2969561989606533], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.22271714922049], "isController": false}, {"data": ["401/Unauthorized", 24, 64.86486486486487, 1.78173719376392], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1347, 37, "401/Unauthorized", 24, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
