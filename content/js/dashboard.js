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

    var data = {"OkPercent": 98.11035525321239, "KoPercent": 1.8896447467876039};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7610677083333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f64ba9e-2c93-4d56-a73e-7579dc64830f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/391f599c-7e22-480c-8df2-78ddf6980948"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fe92a2fa-324c-4178-a9f0-20e1a6a889d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c33c756-ab7f-4cc6-ba95-aac68aac9498"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdef5b64-a5de-4029-8ce5-a8254d0d64ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02f7aa30-6e2f-4c4a-8bb9-39220f132d54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8faf3f0a-f0f0-4d23-855e-24258a75154c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e353f47a-216a-4053-bd12-2fe59092f482"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac32a3af-b483-4f30-bc70-2b4e8876e1bb"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b411186-d8d9-4024-92bc-ad8dbb99b134"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca1f124c-d86c-404a-a2af-9489be2a6ba5"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2457dfbb-c94b-4548-bdb7-cd8ca639e50b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=391f599c-7e22-480c-8df2-78ddf6980948"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a22c87ee-add8-4bd2-b8b8-acad033ae2a0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3df6085c-12a4-41bb-a387-d9a24da0f04c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d08acc47-9e94-41b3-babb-628a592e844c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02f7aa30-6e2f-4c4a-8bb9-39220f132d54"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac32a3af-b483-4f30-bc70-2b4e8876e1bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8faf3f0a-f0f0-4d23-855e-24258a75154c"], "isController": false}, {"data": [0.25806451612903225, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e353f47a-216a-4053-bd12-2fe59092f482"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9111111111111111, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2457dfbb-c94b-4548-bdb7-cd8ca639e50b"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fdef5b64-a5de-4029-8ce5-a8254d0d64ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d08acc47-9e94-41b3-babb-628a592e844c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3df6085c-12a4-41bb-a387-d9a24da0f04c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe92a2fa-324c-4178-a9f0-20e1a6a889d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca1f124c-d86c-404a-a2af-9489be2a6ba5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a22c87ee-add8-4bd2-b8b8-acad033ae2a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 25, 1.8896447467876039, 415.39304610733194, 133, 7120, 147.0, 1088.6000000000001, 1263.8, 1793.32, 5.259391771019678, 716.8025119260584, 3.8504824773901807], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7f64ba9e-2c93-4d56-a73e-7579dc64830f", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.647740238336714, 1.2103036257606492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/391f599c-7e22-480c-8df2-78ddf6980948", 3, 0, 0.0, 326.6666666666667, 234, 489, 257.0, 489.0, 489.0, 489.0, 0.042660902704701235, 0.02742684988339353, 0.027357414820397597], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2028.303571428571, 1635, 2696, 1962.5, 2375.3, 2552.15, 2696.0, 0.24634442469778817, 296.43548157723114, 1.2112736116732064], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fe92a2fa-324c-4178-a9f0-20e1a6a889d4", 3, 0, 0.0, 1190.3333333333333, 232, 2878, 461.0, 2878.0, 2878.0, 2878.0, 0.032819884474006654, 0.02736058728448276, 0.021046605603448277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c33c756-ab7f-4cc6-ba95-aac68aac9498", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 522.923076923077, 140, 736, 517.0, 732.4, 736.0, 736.0, 0.09554397595231622, 0.01810110481909116, 0.06458835934456833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 522.923076923077, 140, 736, 517.0, 732.4, 736.0, 736.0, 0.09371936097814176, 0.017755425810312014, 0.06335490756026876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdef5b64-a5de-4029-8ce5-a8254d0d64ed", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 194.60000000000002, 135, 445, 140.0, 422.8, 445.0, 445.0, 0.08466110161025416, 0.03113059257127054, 0.04780927053172816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 140.33333333333334, 136, 149, 140.0, 146.0, 149.0, 149.0, 0.08465966813410092, 0.06291602290044022, 0.04249518498137487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 293.8, 135, 1078, 140.0, 685.0000000000002, 1078.0, 1078.0, 0.08466301298730619, 1.6808804988626935, 0.04937022183120453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 286.93333333333334, 134, 1262, 140.0, 756.2000000000003, 1262.0, 1262.0, 0.08466253513495209, 5.0999311146810475, 0.04928726492036077], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 270.9999999999999, 138, 436, 243.0, 433.6, 436.0, 436.0, 0.09523530445994256, 0.2038845358927211, 0.061560982187335175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 138.47058823529406, 135, 143, 138.0, 142.2, 143.0, 143.0, 0.0895335303071, 0.06653810211299131, 0.04494163532993106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 153.8235294117647, 135, 415, 138.0, 194.19999999999982, 415.0, 415.0, 0.08940404316637567, 0.023922566237877863, 0.050988243368323624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 877.4, 679, 1092, 963.0, 1092.0, 1092.0, 1092.0, 0.06032745743897878, 17.73827554717004, 0.03440550307066759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1178.6, 933, 1261, 1238.0, 1261.0, 1261.0, 1261.0, 0.060350758609035715, 54.3037186817282, 0.03435985573151154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 249.0, 138, 417, 142.0, 417.0, 417.0, 417.0, 0.060736367722264734, 0.10747490069603878, 0.03363039111183995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02f7aa30-6e2f-4c4a-8bb9-39220f132d54", 3, 0, 0.0, 419.0, 263, 524, 470.0, 524.0, 524.0, 524.0, 0.016132935387593774, 0.02224055383022774, 0.010345664945820225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 161.21428571428572, 136, 423, 139.5, 288.5, 423.0, 423.0, 0.08006542489005301, 0.059501746427080414, 0.040189090228014895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 178.78571428571428, 138, 418, 140.0, 408.5, 418.0, 418.0, 0.08006542489005301, 0.021423756269408716, 0.04566231263260836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 157.85714285714286, 135, 405, 138.5, 274.5, 405.0, 405.0, 0.08006634068227961, 0.021580380887020675, 0.04707025106516829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 238.35714285714286, 137, 424, 141.0, 423.0, 424.0, 424.0, 0.0799392461729086, 0.021546124945041767, 0.047073599064710814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 139.6, 135, 145, 138.0, 145.0, 145.0, 145.0, 0.06093102607847916, 0.045281748872776015, 0.034214199213989764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8faf3f0a-f0f0-4d23-855e-24258a75154c", 3, 0, 0.0, 398.0, 235, 518, 441.0, 518.0, 518.0, 518.0, 0.016781433022503903, 0.023134560172625006, 0.010761530942165587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 721.3000000000001, 137, 1376, 695.5, 1268.7, 1370.6499999999999, 1376.0, 0.09772639541076847, 43.98036134640098, 0.05325325062422735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 186.52941176470586, 135, 414, 139.0, 411.6, 414.0, 414.0, 0.08940451335019747, 0.024097310238920415, 0.05256007523126844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 550.5000000000001, 136, 1133, 542.0, 1087.5000000000002, 1131.45, 1133.0, 0.09772782799902271, 14.380783502321036, 0.05334946860493525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 170.7058823529412, 134, 415, 139.0, 410.2, 415.0, 415.0, 0.0895335303071, 0.02413208434058555, 0.052723358178888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e353f47a-216a-4053-bd12-2fe59092f482", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 487.07692307692304, 141, 764, 490.0, 743.1999999999999, 764.0, 764.0, 0.0935999251200599, 0.017732798313761348, 0.06401948003441597], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac32a3af-b483-4f30-bc70-2b4e8876e1bb", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 401.49999999999994, 278, 845, 289.5, 704.5, 845.0, 845.0, 0.07987630583496415, 0.12379267320321104, 0.17964368392375238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 481.6, 149, 1016, 442.5, 974.5000000000002, 1014.6, 1016.0, 0.08938667334087161, 0.054906462433015855, 0.040416044684398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 167.10000000000005, 134, 417, 141.0, 383.40000000000055, 416.65, 417.0, 0.09772448535842898, 0.07262532554469185, 0.04905311081468017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 248.45, 135, 418, 142.0, 415.9, 417.9, 418.0, 0.09772496286451411, 0.09953821901141427, 0.05163008291963099], "isController": false}, {"data": ["login", 20, 0, 0.0, 2588.5499999999997, 1433, 4781, 2252.0, 4392.4000000000015, 4764.599999999999, 4781.0, 0.09075316047881367, 27.267535956685787, 0.17454916949514018], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 143.11764705882354, 140, 154, 143.0, 147.6, 154.0, 154.0, 0.08587463313851579, 0.06952155358577108, 0.030525748498456785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b411186-d8d9-4024-92bc-ad8dbb99b134", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca1f124c-d86c-404a-a2af-9489be2a6ba5", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 918.1999999999999, 278, 1519, 975.0, 1407.8, 1513.4499999999998, 1519.0, 0.09765672683948652, 58.49137256224395, 0.2071390729446921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2457dfbb-c94b-4548-bdb7-cd8ca639e50b", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=391f599c-7e22-480c-8df2-78ddf6980948", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a22c87ee-add8-4bd2-b8b8-acad033ae2a0", 3, 0, 0.0, 649.6666666666666, 430, 1002, 517.0, 1002.0, 1002.0, 1002.0, 0.020159935488206437, 0.02779209856528459, 0.012928083630132384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3df6085c-12a4-41bb-a387-d9a24da0f04c", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 523.6666666666667, 274, 1405, 556.0, 918.4000000000003, 1405.0, 1405.0, 0.08459330359408748, 6.869229591160564, 0.18880938978620454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 986.1428571428571, 138, 1407, 1351.0, 1407.0, 1407.0, 1407.0, 0.06693568436956147, 57.20393808927307, 0.12048049661496682], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1259.6086956521738, 182, 7120, 894.0, 3533.2000000000035, 6600.799999999992, 7120.0, 0.09496950653018586, 0.02977474678239183, 0.04284757032904869], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d08acc47-9e94-41b3-babb-628a592e844c", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 143.23529411764704, 138, 157, 143.0, 149.79999999999998, 157.0, 157.0, 0.08639528383391777, 0.06707446352340296, 0.030710823550337957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 359.6470588235294, 276, 557, 283.0, 552.2, 557.0, 557.0, 0.08933779671972632, 0.13845613612715396, 0.2009227986772751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02f7aa30-6e2f-4c4a-8bb9-39220f132d54", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 508.2142857142857, 278, 1475, 287.0, 1442.0, 1475.0, 1475.0, 0.07158232734598295, 12.328997329723538, 0.15837390197822873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 140.29999999999998, 136, 150, 139.0, 149.4, 150.0, 150.0, 0.060253304893773424, 0.044778090843907783, 0.03024433468300736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 179.0, 135, 546, 138.0, 505.70000000000016, 546.0, 546.0, 0.06010590660744231, 0.016083025791444525, 0.03427914986205695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 220.0, 138, 413, 139.0, 412.5, 413.0, 413.0, 0.0601561654053924, 0.01621396645692217, 0.03536524567777952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 194.0, 135, 415, 140.0, 414.7, 415.0, 415.0, 0.060254030994673545, 0.016240344291533104, 0.03548162176737124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 2.0916445035460995, 4.3841422872340425], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1335.392857142857, 1073, 2123, 1121.0, 1797.1000000000001, 1959.75, 2123.0, 0.255568891789393, 305.7492447026502, 0.5046487296856959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1259.6086956521738, 182, 7120, 894.0, 3533.2000000000035, 6600.799999999992, 7120.0, 0.09689432620528117, 0.03037821436395194, 0.04371599483089834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 139.27272727272725, 135, 149, 139.0, 147.8, 149.0, 149.0, 0.05390043120344963, 0.014527850597804782, 0.03174019532781262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 163.8181818181818, 133, 414, 138.0, 360.20000000000016, 414.0, 414.0, 0.05382789753125688, 0.014508300506471582, 0.03164491632208657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 220.2941176470588, 135, 967, 141.0, 524.5999999999996, 967.0, 967.0, 0.08570708343836653, 4.55817624306781, 0.049953128938744644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 251.47058823529412, 136, 966, 140.0, 524.3999999999996, 966.0, 966.0, 0.08570708343836653, 1.5041376512477944, 0.05003682726241492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 190.27272727272725, 137, 424, 140.0, 421.2, 424.0, 424.0, 0.05382895116735421, 0.014403449824077201, 0.030699323712631697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 140.11764705882354, 137, 143, 140.0, 143.0, 143.0, 143.0, 0.08570362677582956, 0.06369185544570927, 0.04301920328396132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 164.63636363636363, 136, 416, 139.0, 361.6000000000002, 416.0, 416.0, 0.053898846564683515, 0.04005568577707437, 0.027054694467038405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 220.58823529411765, 135, 425, 141.0, 421.0, 425.0, 425.0, 0.08570492299160597, 0.030504808298253135, 0.048455184517657734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 193.54545454545453, 141, 426, 143.0, 422.40000000000003, 426.0, 426.0, 0.05360597657906151, 0.04219376672140974, 0.01905524948708827], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 661.4615384615383, 138, 1260, 518.0, 1179.6, 1260.0, 1260.0, 0.09288500835965076, 0.01740198398805356, 0.06321650959573587], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1323.6499999999999, 832, 2727, 1234.5, 2088.3000000000006, 2696.5499999999997, 2727.0, 0.09142397410873053, 0.047319049099245294, 0.04205145684102742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 358.09090909090907, 274, 831, 285.0, 777.6000000000001, 831.0, 831.0, 0.05378946802216126, 0.08336316967887687, 0.12097377427249745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac32a3af-b483-4f30-bc70-2b4e8876e1bb", 3, 0, 0.0, 458.33333333333337, 241, 863, 271.0, 863.0, 863.0, 863.0, 0.05057572028254969, 0.03251531496029806, 0.03243299770723401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8faf3f0a-f0f0-4d23-855e-24258a75154c", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["addBook", 62, 14, 22.580645161290324, 1241.9193548387095, 705, 2747, 1088.0, 2017.8000000000002, 2263.2499999999995, 2747.0, 0.2953914174500098, 80.92748233755854, 1.0758327760004003], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e353f47a-216a-4053-bd12-2fe59092f482", 3, 0, 0.0, 688.3333333333333, 369, 1260, 436.0, 1260.0, 1260.0, 1260.0, 0.029899537553819168, 0.02492601421723011, 0.019173857090177007], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 254.23214285714292, 136, 561, 142.5, 558.0, 559.0, 561.0, 0.25668292325180597, 0.19075752401818782, 0.12408012403285541], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 790.4821428571431, 668, 1112, 692.5, 1014.8000000000004, 1097.5, 1112.0, 0.25660059201422303, 75.44909399371329, 0.12905205555402818], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 194.4464285714285, 135, 428, 141.5, 406.90000000000003, 422.45, 428.0, 0.25722291121216295, 0.4551639796058977, 0.12509473611685268], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1076.2857142857142, 933, 1524, 970.5, 1266.1000000000001, 1410.45, 1524.0, 0.2562694490206846, 230.59170070245284, 0.1286352507779608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 145.64285714285717, 140, 164, 143.0, 163.0, 164.0, 164.0, 0.07021943573667712, 0.05245885579937304, 0.024960815047021943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 14, 7.777777777777778, 207.9944444444445, 136, 1291, 144.5, 328.60000000000014, 413.84999999999997, 1244.83, 0.760796977100011, 1.5816297182620862, 0.36701272142362024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 143.1, 138, 148, 143.0, 147.8, 148.0, 148.0, 0.06129817270147177, 0.04747016694557335, 0.021789584827476293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 162.46666666666667, 139, 432, 143.0, 267.6000000000001, 432.0, 432.0, 0.08492617084880877, 0.06891957810093759, 0.03018859979391249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2457dfbb-c94b-4548-bdb7-cd8ca639e50b", 3, 0, 0.0, 490.33333333333337, 240, 981, 250.0, 981.0, 981.0, 981.0, 0.03305894409732553, 0.02755988145613629, 0.021199908812412533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 376.70000000000005, 276, 684, 282.0, 672.2, 684.0, 684.0, 0.06005537105211004, 0.09307409556611196, 0.13506593704395453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 443.8235294117647, 279, 1108, 291.0, 672.7999999999996, 1108.0, 1108.0, 0.08564231738035265, 6.151861618387909, 0.19132261492443325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdef5b64-a5de-4029-8ce5-a8254d0d64ed", 3, 0, 0.0, 318.0, 231, 480, 243.0, 480.0, 480.0, 480.0, 0.08049369466058491, 0.03642130064394956, 0.051618677891065196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d08acc47-9e94-41b3-babb-628a592e844c", 3, 0, 0.0, 335.6666666666667, 234, 471, 302.0, 471.0, 471.0, 471.0, 0.027931920598860377, 0.027850088800230904, 0.017912071477784813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 163.14285714285717, 140, 423, 143.0, 286.0, 423.0, 423.0, 0.0767804845945442, 0.06365881974684377, 0.027293062883216885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3df6085c-12a4-41bb-a387-d9a24da0f04c", 3, 0, 0.0, 855.3333333333334, 236, 1271, 1059.0, 1271.0, 1271.0, 1271.0, 0.02623868456728036, 0.031013236869724934, 0.016826239777845805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe92a2fa-324c-4178-a9f0-20e1a6a889d4", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 142.75, 139, 153, 142.0, 146.0, 152.65, 153.0, 0.1001963849144323, 0.07778918555368522, 0.0356166837000521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca1f124c-d86c-404a-a2af-9489be2a6ba5", 3, 0, 0.0, 454.33333333333337, 242, 838, 283.0, 838.0, 838.0, 838.0, 0.04454805993198996, 0.02823407314048973, 0.028567603537115956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a22c87ee-add8-4bd2-b8b8-acad033ae2a0", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 146.28571428571425, 137, 211, 141.5, 179.0, 211.0, 211.0, 0.07173454120637003, 0.05331053306449961, 0.03600737712897871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 219.78571428571428, 136, 427, 141.0, 424.5, 427.0, 427.0, 0.07163433740796267, 0.03453798410741057, 0.03999450590215772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 339.2857142857142, 136, 1269, 140.0, 1266.0, 1269.0, 1269.0, 0.07163800293715812, 9.225121864558123, 0.04123582590941886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 262.14285714285717, 136, 763, 139.5, 727.0, 763.0, 763.0, 0.07173674663605899, 3.029856737873928, 0.04136271956568524], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5291005291005291], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.07558578987150416], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07558578987150416], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.2093726379440666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 25, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
