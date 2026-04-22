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

    var data = {"OkPercent": 99.88479262672811, "KoPercent": 0.1152073732718894};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6905, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09090909090909091, 500, 1500, "see books"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afb53859-6d17-406c-af8b-233488907f05"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/22d22a69-abc3-4fdf-b7ac-f9a964b4a7c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d7901622-bb0a-4045-8b12-33db234ff536"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7170694-a9eb-4dc2-b784-5acc4b2fbc2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.15625, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.171875, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5972222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccb4a4d7-ce61-4ded-8430-623a8ab035e5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/57849b00-04ae-40e5-a28b-83e4249917e4"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd8ef5ee-4b6e-4eee-8d80-ecab9e4727f2"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.38235294117647056, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63e447ac-51b5-4daa-b2d1-84ee0441d406"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8a2c473-7266-4843-8246-7a09376be4c1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/d7170694-a9eb-4dc2-b784-5acc4b2fbc2c"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd8ef5ee-4b6e-4eee-8d80-ecab9e4727f2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db61f98c-1211-43d0-8d74-51dd5d30a551"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a93e26f3-6d7c-4370-98f6-03daecff162a"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d723f30b-f6fa-4970-b5e8-367d84e83484"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/afb53859-6d17-406c-af8b-233488907f05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b507b688-705e-41b7-96bf-f93a4761b637"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22d22a69-abc3-4fdf-b7ac-f9a964b4a7c7"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edd4e1e4-20ed-4b22-87a9-b67182d80bb5"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/db61f98c-1211-43d0-8d74-51dd5d30a551"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edd4e1e4-20ed-4b22-87a9-b67182d80bb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.15625, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 868, 1, 0.1152073732718894, 1952.1612903225814, 78, 46205, 242.0, 5258.700000000002, 12359.749999999982, 34595.57999999981, 3.3920692794979113, 525.8643183584514, 2.471351022017187], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 44, 0, 0.0, 12020.386363636362, 1217, 34942, 12182.0, 26863.0, 30936.25, 34942.0, 0.19376516542701, 233.16444937664863, 0.9527418046142532], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 3578.999999999999, 83, 14849, 87.5, 14399.000000000002, 14849.0, 14849.0, 0.049770062312118016, 0.03863984329895881, 0.0176917018375107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 306.764705882353, 164, 999, 325.0, 465.3999999999995, 999.0, 999.0, 0.10355372001510667, 7.438474052178893, 0.2313362027612295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afb53859-6d17-406c-af8b-233488907f05", 1, 0, 0.0, 894.0, 894, 894, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 0.20208508109619686, 0.7712003635346756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22d22a69-abc3-4fdf-b7ac-f9a964b4a7c7", 3, 0, 0.0, 6658.333333333333, 256, 17280, 2439.0, 17280.0, 17280.0, 17280.0, 0.032622524765933386, 0.014760842911669077, 0.020920043551070563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 7, 0, 0.0, 391.0, 322, 481, 330.0, 481.0, 481.0, 481.0, 0.04290556485176127, 0.06649524552709486, 0.09649562095078731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7901622-bb0a-4045-8b12-33db234ff536", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 0.35053341108671787, 0.6549722145993414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 110.66666666666667, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.06906872337976287, 0.0513293930585933, 0.03466926154023253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 110.33333333333333, 81, 252, 82.5, 252.0, 252.0, 252.0, 0.06907031357922365, 0.018481705000690705, 0.03939166321315099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 109.5, 80, 245, 83.0, 245.0, 245.0, 245.0, 0.06907110870641325, 0.018616822268525447, 0.040606257266856224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 82.16666666666667, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.06907031357922365, 0.018616607956900125, 0.04067324129714049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7170694-a9eb-4dc2-b784-5acc4b2fbc2c", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/books", 44, 0, 0.0, 966.0909090909089, 642, 1474, 880.5, 1313.5, 1438.0, 1474.0, 0.20597129509132955, 246.41327613728922, 0.4067128502682308], "isController": false}, {"data": ["deleteBook", 7, 0, 0.0, 2470.5714285714284, 465, 11108, 851.0, 11108.0, 11108.0, 11108.0, 0.043451002787071466, 0.007850034683211153, 0.029533103456837635], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 7, 0, 0.0, 2470.5714285714284, 465, 11108, 851.0, 11108.0, 11108.0, 11108.0, 0.04428950149002537, 0.008001521265287788, 0.030103020544001623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 16, 1, 6.25, 7964.687500000001, 133, 22669, 4450.5, 21332.7, 22669.0, 22669.0, 0.06425444761254569, 0.020691312597887635, 0.028989799606441508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 81.16666666666667, 80, 82, 81.5, 82.0, 82.0, 82.0, 0.03880230226993468, 0.010458433033693332, 0.022849402606221304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 11, 0, 0.0, 156.36363636363635, 80, 245, 118.0, 243.8, 245.0, 245.0, 0.0830621229168397, 0.03356700847988764, 0.046737192386978876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 108.66666666666667, 79, 240, 82.5, 240.0, 240.0, 240.0, 0.03880054579434418, 0.010457959608631828, 0.022810477117378117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 11, 0, 0.0, 97.54545454545455, 81, 246, 83.0, 213.80000000000013, 246.0, 246.0, 0.08315819713028622, 0.061800183609519346, 0.0417415169189132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 11, 0, 0.0, 175.72727272727272, 80, 649, 82.0, 567.6000000000004, 649.0, 649.0, 0.08316071185569349, 2.2432867806598424, 0.04832092143958752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 11, 0, 0.0, 186.0909090909091, 80, 752, 83.0, 650.0000000000003, 752.0, 752.0, 0.08316008316008316, 6.822884674447174, 0.04823934511434511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 177.1, 83, 245, 233.5, 244.9, 245.0, 245.0, 0.05006784192580947, 0.013494848019065833, 0.029434414882165333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 96.60000000000001, 78, 244, 80.5, 227.90000000000006, 244.0, 244.0, 0.05010873595702675, 0.013505870238417365, 0.02950739041219446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 113.4, 81, 239, 83.0, 238.4, 239.0, 239.0, 0.05010848486974299, 0.037238825181517984, 0.025152110569382713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 108.16666666666666, 79, 243, 81.5, 243.0, 243.0, 243.0, 0.03880230226993468, 0.010382647287072366, 0.022129438013322126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 145.5, 79, 244, 87.5, 243.4, 244.0, 244.0, 0.05007034884012037, 0.013397730060735333, 0.02855574582288115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 83.33333333333333, 81, 85, 83.5, 85.0, 85.0, 85.0, 0.03880104762828596, 0.028835544184692988, 0.01947630711029198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 6788.666666666667, 88, 17698, 2853.5, 17698.0, 17698.0, 17698.0, 0.03511400346458167, 0.027638561320754713, 0.012481930919050517], "isController": false}, {"data": ["deleteAccount", 6, 0, 0.0, 4748.666666666667, 389, 17280, 420.5, 17280.0, 17280.0, 17280.0, 0.04143961212523051, 0.007486648674968403, 0.02820645473758366], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 14, 0, 0.0, 6394.714285714286, 963, 23654, 3360.0, 20686.0, 23654.0, 23654.0, 0.06241724142543145, 0.03230579878464714, 0.02870949288220529], "isController": false}, {"data": ["goToProfile", 7, 0, 0.0, 1097.4285714285713, 175, 4092, 396.0, 4092.0, 4092.0, 4092.0, 0.043891550249554816, 0.07962691398510195, 0.028375201430864538], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 194.0, 162, 329, 168.0, 329.0, 329.0, 329.0, 0.03877897920800398, 0.060099843753029604, 0.08721483312112613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 83.23529411764707, 80, 98, 83.0, 87.6, 98.0, 98.0, 0.10370849372563613, 0.07707242551289951, 0.05205680251462595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 133.7058823529412, 78, 245, 83.0, 242.6, 245.0, 245.0, 0.10370975908833022, 0.03691323916080503, 0.05863461908015544], "isController": false}, {"data": ["addBook", 32, 0, 0.0, 18774.937499999996, 658, 51377, 2462.5, 49198.1, 51010.4, 51377.0, 0.16537638631923843, 74.83766991454692, 0.5967237064465782], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 4, 0, 0.0, 122.0, 80, 239, 84.5, 239.0, 239.0, 239.0, 0.026932037004618842, 0.020014922031752872, 0.013518620137084068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 4, 0, 0.0, 120.0, 81, 234, 82.5, 234.0, 234.0, 234.0, 0.02690576926957563, 0.007199395292835666, 0.01534469653655485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 4, 0, 0.0, 121.5, 78, 241, 83.5, 241.0, 241.0, 241.0, 0.026904321506642005, 0.007251555406087102, 0.015816798385740707], "isController": false}, {"data": ["https://demoqa.com/books-0", 44, 0, 0.0, 157.65909090909088, 81, 436, 84.0, 333.0, 335.5, 436.0, 0.20664262097986175, 0.15356936969304177, 0.09989072010256989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 4, 0, 0.0, 81.0, 78, 85, 80.5, 85.0, 85.0, 85.0, 0.026933487751996443, 0.007259416620655291, 0.015860247182083842], "isController": false}, {"data": ["https://demoqa.com/books-3", 44, 0, 0.0, 532.2272727272726, 393, 756, 480.5, 726.5, 737.25, 756.0, 0.2065533752699277, 60.733550546897, 0.10388182447657496], "isController": false}, {"data": ["https://demoqa.com/books-1", 44, 0, 0.0, 132.84090909090907, 78, 380, 85.0, 245.5, 307.75, 380.0, 0.20693320290270847, 0.3661747691989334, 0.10063743656791878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 652.0666666666667, 80, 1124, 804.0, 1091.6, 1124.0, 1124.0, 0.07914773716619442, 47.48529294886001, 0.04199570689482321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 174.35294117647058, 78, 917, 84.0, 381.7999999999995, 917.0, 917.0, 0.10360673321875648, 5.5101367475561, 0.0603856798734779], "isController": false}, {"data": ["https://demoqa.com/books-2", 44, 0, 0.0, 805.9318181818184, 557, 1137, 793.0, 1002.5, 1110.0, 1137.0, 0.2063393062309781, 185.6644704524458, 0.10357265957297142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 479.53333333333336, 80, 739, 635.0, 720.4, 739.0, 739.0, 0.07914982534271874, 15.522228898656563, 0.04207410963042308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 139.8235294117647, 80, 482, 83.0, 292.39999999999986, 482.0, 482.0, 0.10371102448190242, 1.8201022659333688, 0.06054774481902426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 7, 0, 0.0, 1408.5714285714284, 82, 7076, 88.0, 7076.0, 7076.0, 7076.0, 0.044406663537054185, 0.03317490000570943, 0.015785181179187233], "isController": false}, {"data": ["deleteBooks", 6, 0, 0.0, 8025.0, 364, 28882, 1093.5, 28882.0, 28882.0, 28882.0, 0.04100489325059457, 0.0074081105970312455, 0.028270951791913832], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 108, 0, 0.0, 6261.537037037037, 80, 46205, 297.5, 17652.30000000002, 39017.7, 45980.08999999999, 0.45057824207733255, 1.1390431522537257, 0.20884549234016989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 4146.666666666666, 85, 12107, 1355.0, 12107.0, 12107.0, 12107.0, 0.06325310730889655, 0.04898409579683102, 0.02248450298870932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 4, 0, 0.0, 245.75, 162, 481, 170.0, 481.0, 481.0, 481.0, 0.02688822564598962, 0.04167149814471243, 0.06047224967061923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccb4a4d7-ce61-4ded-8430-623a8ab035e5", 1, 0, 0.0, 5164.0, 5164, 5164, 5164.0, 5164.0, 5164.0, 5164.0, 0.19364833462432224, 0.06183887248257165, 0.11554602778853602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57849b00-04ae-40e5-a28b-83e4249917e4", 1, 0, 0.0, 19196.0, 19196, 19196, 19196.0, 19196.0, 19196.0, 19196.0, 0.05209418628881017, 0.01663554581683684, 0.031083542795374033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 11, 0, 0.0, 8652.90909090909, 82, 14189, 11332.0, 13955.800000000001, 14189.0, 14189.0, 0.08421374980860512, 0.0683414317294442, 0.029935356377277598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 14, 0, 0.0, 4856.071428571428, 257, 18800, 2945.5, 15215.0, 18800.0, 18800.0, 0.0625636808894768, 0.03843022976511807, 0.02828807055842554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 126.39999999999999, 81, 251, 84.0, 246.8, 251.0, 251.0, 0.07921126701061959, 0.058866966987384285, 0.039760343011189914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 162.0, 78, 325, 84.0, 278.20000000000005, 325.0, 325.0, 0.07921461351190066, 0.10051385529602501, 0.0407418910640635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd8ef5ee-4b6e-4eee-8d80-ecab9e4727f2", 1, 0, 0.0, 28882.0, 28882, 28882, 28882.0, 28882.0, 28882.0, 28882.0, 0.03462364102208988, 0.0062552476455924105, 0.02387137750155806], "isController": false}, {"data": ["login", 14, 0, 0.0, 15009.571428571428, 1780, 41461, 9407.0, 36507.5, 41461.0, 41461.0, 0.06350300732098957, 0.09215377820213914, 0.09581264288176648], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 223.0, 165, 499, 169.0, 499.0, 499.0, 499.0, 0.06900279461318183, 0.10694085454210896, 0.1551889023380447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 7166.705882352941, 80, 22124, 1553.0, 20220.8, 22124.0, 22124.0, 0.09871897611000778, 0.07991995233905903, 0.03509151103910433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 292.9, 167, 479, 321.5, 478.9, 479.0, 479.0, 0.05004704422156827, 0.0775631437301063, 0.11255697543190599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63e447ac-51b5-4daa-b2d1-84ee0441d406", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8a2c473-7266-4843-8246-7a09376be4c1", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7170694-a9eb-4dc2-b784-5acc4b2fbc2c", 3, 0, 0.0, 3750.0, 408, 8717, 2125.0, 8717.0, 8717.0, 8717.0, 0.027193372068781103, 0.017482718045521706, 0.01743845799983684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 4, 0, 0.0, 7772.75, 286, 11679, 9563.0, 11679.0, 11679.0, 11679.0, 0.02420208743004084, 0.02006598850400847, 0.00860308576614733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd8ef5ee-4b6e-4eee-8d80-ecab9e4727f2", 3, 0, 0.0, 3384.3333333333335, 179, 9578, 396.0, 9578.0, 9578.0, 9578.0, 0.01886590741870366, 0.01572773076149091, 0.012098254431916085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 779.6666666666667, 163, 1316, 895.0, 1250.0, 1316.0, 1316.0, 0.07911100328574368, 63.13704444423202, 0.16442830598290148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db61f98c-1211-43d0-8d74-51dd5d30a551", 1, 0, 0.0, 1293.0, 1293, 1293, 1293.0, 1293.0, 1293.0, 1293.0, 0.7733952049497294, 0.13972471964423822, 0.5332197409126064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a93e26f3-6d7c-4370-98f6-03daecff162a", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 1458.1999999999998, 82, 16276, 84.0, 9186.400000000005, 16276.0, 16276.0, 0.07799135855747183, 0.06054993169256846, 0.027723490737226315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d723f30b-f6fa-4970-b5e8-367d84e83484", 2, 0, 0.0, 177.5, 170, 185, 177.5, 185.0, 185.0, 185.0, 0.010665699643232347, 0.017946289536415364, 0.006629607248942762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afb53859-6d17-406c-af8b-233488907f05", 3, 0, 0.0, 1296.6666666666667, 175, 3311, 404.0, 3311.0, 3311.0, 3311.0, 0.04687280283736699, 0.030134695834570256, 0.03005840546536881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b507b688-705e-41b7-96bf-f93a4761b637", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22d22a69-abc3-4fdf-b7ac-f9a964b4a7c7", 1, 0, 0.0, 16098.0, 16098, 16098, 16098.0, 16098.0, 16098.0, 16098.0, 0.062119517952540684, 0.011222764473847683, 0.042828495775872784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 11, 0, 0.0, 330.72727272727275, 165, 835, 321.0, 765.8000000000002, 835.0, 835.0, 0.08300821781356355, 9.144832007402824, 0.18475666093784193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edd4e1e4-20ed-4b22-87a9-b67182d80bb5", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db61f98c-1211-43d0-8d74-51dd5d30a551", 3, 0, 0.0, 5304.0, 389, 11431, 4092.0, 11431.0, 11431.0, 11431.0, 0.01400998444891726, 0.014051029325232448, 0.008984267371213217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 7, 0, 0.0, 150.42857142857144, 82, 242, 86.0, 242.0, 242.0, 242.0, 0.042969301503311706, 0.031933240667988486, 0.021568575168654507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edd4e1e4-20ed-4b22-87a9-b67182d80bb5", 3, 0, 0.0, 356.0, 182, 453, 433.0, 453.0, 453.0, 453.0, 0.03186776999968132, 0.020487905517373246, 0.020436037402139392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 7, 0, 0.0, 239.14285714285714, 233, 245, 240.0, 245.0, 245.0, 245.0, 0.04292793013785998, 0.011486575056419566, 0.02448233515674827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 7, 0, 0.0, 171.57142857142856, 80, 245, 235.0, 245.0, 245.0, 245.0, 0.04297035659257349, 0.011581853925342075, 0.025261869793680905], "isController": false}, {"data": ["register", 16, 1, 6.25, 7964.687500000001, 133, 22669, 4450.5, 21332.7, 22669.0, 22669.0, 0.06368387325317125, 0.020507575395735566, 0.028732372502895624], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 7, 0, 0.0, 147.85714285714286, 79, 241, 83.0, 241.0, 241.0, 241.0, 0.04292793013785998, 0.011570418669970073, 0.025278849485478094], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 100.0, 0.1152073732718894], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 868, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 16, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
