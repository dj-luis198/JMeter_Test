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

    var data = {"OkPercent": 97.94364051789795, "KoPercent": 2.0563594821020565};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8094140882159315, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36607142857142855, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a3c1245-c4e2-4493-87f2-9a6d26d4b140"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e36698fb-d101-46bc-8d81-710daf1fcc01"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=087bbf96-4fd4-4abe-ad82-f8347cb372f3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8be823d7-2796-4f39-971b-16073ee1e513"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=109ff98a-9b03-4828-a12c-051816f94f2c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8be823d7-2796-4f39-971b-16073ee1e513"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/087bbf96-4fd4-4abe-ad82-f8347cb372f3"], "isController": false}, {"data": [0.36065573770491804, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc3348a8-9a4f-4523-bead-2754aa8fc36f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9241573033707865, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b43ceec-951f-405c-8745-556794c89e3f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b43ceec-951f-405c-8745-556794c89e3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/109ff98a-9b03-4828-a12c-051816f94f2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da2fb0a6-4b66-48f2-bec4-483cc14795ed"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/da2fb0a6-4b66-48f2-bec4-483cc14795ed"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ace367b6-e266-4533-a663-aac15c49bf7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bb1a3e1-8d4a-43a4-a308-f8e615ac4bc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e36698fb-d101-46bc-8d81-710daf1fcc01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a3c1245-c4e2-4493-87f2-9a6d26d4b140"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7f5147e-9f46-4b1b-9196-348806593eda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f84460f-4375-4b2c-9931-287958dca0d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bb1a3e1-8d4a-43a4-a308-f8e615ac4bc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6c37482-e94c-467b-88d1-89b872e28e1a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/793f97c2-39bb-459a-a386-2c62e6d04dce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=793f97c2-39bb-459a-a386-2c62e6d04dce"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6c37482-e94c-467b-88d1-89b872e28e1a"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 27, 2.0563594821020565, 301.30083777608564, 77, 2430, 92.0, 814.0, 1019.6999999999996, 1636.659999999997, 5.095427697704923, 708.9780687776018, 3.7367664832526133], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1347.7678571428573, 972, 1809, 1347.5, 1601.8, 1727.65, 1809.0, 0.2447178097756025, 294.4763865066532, 1.2032755588087487], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 87.16666666666666, 81, 99, 86.0, 98.1, 99.0, 99.0, 0.08609227178373621, 0.06683921491022489, 0.030603112235624983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 268.0, 161, 1009, 166.0, 717.0, 1009.0, 1009.0, 0.07522271296087343, 6.536290215607101, 0.167802899029627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 266.72222222222223, 161, 968, 169.5, 458.6000000000008, 968.0, 968.0, 0.10344530329588231, 7.0267770232895606, 0.2311804976868481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 83.5, 78, 105, 81.0, 99.00000000000003, 105.0, 105.0, 0.05849749192003393, 0.04347323374135334, 0.02936299887392328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 80.75, 79, 84, 80.5, 83.4, 84.0, 84.0, 0.05850433663395299, 0.022977044970333427, 0.03295630030763531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 164.41666666666669, 78, 933, 81.0, 723.9000000000008, 933.0, 933.0, 0.05826232612337048, 4.383106846126769, 0.0338346320976865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a3c1245-c4e2-4493-87f2-9a6d26d4b140", 3, 0, 0.0, 278.6666666666667, 188, 459, 189.0, 459.0, 459.0, 459.0, 0.02688340666529263, 0.02696216664575735, 0.01723968461283414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 145.66666666666669, 78, 710, 81.0, 567.2000000000005, 710.0, 710.0, 0.05832519210860151, 1.4435390116553175, 0.033928098404319956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 83, 89, 86.0, 89.0, 89.0, 89.0, 0.05603025633842275, 0.016524548256058272, 0.03463589088107578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e36698fb-d101-46bc-8d81-710daf1fcc01", 3, 0, 0.0, 480.0, 306, 729, 405.0, 729.0, 729.0, 729.0, 0.034127363319909905, 0.021940606301048847, 0.021885060462312013], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 935.0892857142857, 630, 1415, 872.5, 1256.7, 1379.3, 1415.0, 0.2504125098935299, 299.5804193068045, 0.49446688965304453], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 469.6666666666667, 81, 1015, 460.0, 903.4000000000003, 1015.0, 1015.0, 0.07028394714647175, 0.014036198429153782, 0.04721058754451317], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 469.6666666666667, 81, 1015, 460.0, 903.4000000000003, 1015.0, 1015.0, 0.06964475371873965, 0.013908547007306895, 0.0467812334956443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1184.952380952381, 100, 2430, 1198.0, 2078.0000000000005, 2404.3999999999996, 2430.0, 0.0824962582054314, 0.025780080689197314, 0.03721999149502862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 112.15384615384616, 78, 322, 82.0, 291.2, 322.0, 322.0, 0.06180146517012041, 0.02367694353723063, 0.03484688984126531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 15, 0, 0.0, 102.8, 77, 242, 81.0, 239.0, 242.0, 242.0, 0.0839625862715574, 0.022630540831005703, 0.04944281203295811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 94.92307692307692, 80, 232, 83.0, 175.99999999999994, 232.0, 232.0, 0.061800289985976094, 0.04592775456965606, 0.031020848684366904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 15, 0, 0.0, 112.93333333333334, 77, 243, 81.0, 238.8, 243.0, 243.0, 0.08396164631996104, 0.022630287484677002, 0.04936026473107085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 183.3846153846154, 78, 622, 91.0, 471.59999999999985, 622.0, 622.0, 0.06175566608236306, 1.4121505609077132, 0.03595764481703696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=087bbf96-4fd4-4abe-ad82-f8347cb372f3", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 170.30769230769232, 79, 934, 81.0, 654.7999999999997, 934.0, 934.0, 0.06175507935527697, 4.289774464809105, 0.0358969954966296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 148.0, 78, 778, 82.0, 318.1000000000007, 778.0, 778.0, 0.08443053946424132, 4.24208951073675, 0.04923282542109731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 164.05555555555557, 78, 617, 82.0, 302.0000000000005, 617.0, 617.0, 0.0844947448962827, 1.4017454472588495, 0.0493527790556304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8be823d7-2796-4f39-971b-16073ee1e513", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 90.5, 79, 240, 82.0, 101.40000000000022, 240.0, 240.0, 0.08449276178674027, 0.06279198410127866, 0.042411405818734864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 15, 0, 0.0, 102.53333333333336, 79, 237, 81.0, 233.4, 237.0, 237.0, 0.08396164631996104, 0.022466299894208328, 0.04788437641685278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 107.0, 78, 238, 80.5, 237.1, 238.0, 238.0, 0.08449434826692703, 0.02965920319482519, 0.04779394938319125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 15, 0, 0.0, 106.20000000000002, 80, 249, 82.0, 247.8, 249.0, 249.0, 0.08396023643202578, 0.06239623039528479, 0.042144103052794195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 15, 0, 0.0, 107.13333333333333, 81, 248, 85.0, 245.6, 248.0, 248.0, 0.08650818367417558, 0.06809140238416554, 0.0307509559154296], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 475.3636363636364, 80, 923, 442.0, 921.2, 923.0, 923.0, 0.07069635913750442, 0.013889474677849546, 0.04810791839390726], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1627.05, 1212, 2205, 1579.5, 2045.0, 2197.15, 2205.0, 0.08814844197628807, 0.04562370531975848, 0.040544840010577815], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 209.23076923076923, 79, 401, 200.0, 362.99999999999994, 401.0, 401.0, 0.07544366679434057, 0.14490828697900346, 0.04876181708973154], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 15, 0, 0.0, 231.46666666666664, 160, 485, 167.0, 483.8, 485.0, 485.0, 0.08392265687941994, 0.13006372701917912, 0.18874402225908604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=109ff98a-9b03-4828-a12c-051816f94f2c", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8be823d7-2796-4f39-971b-16073ee1e513", 3, 0, 0.0, 456.66666666666663, 200, 923, 247.0, 923.0, 923.0, 923.0, 0.0200961937808979, 0.02375302070912769, 0.012887207600380488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 94.92857142857143, 80, 235, 83.5, 169.5, 235.0, 235.0, 0.07525586995785671, 0.055927458044852496, 0.0377749190999398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 582.0, 470, 654, 625.0, 654.0, 654.0, 654.0, 0.03173696404201974, 9.33172119473801, 0.018099987305214383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 91.57142857142856, 78, 236, 81.0, 159.0, 236.0, 236.0, 0.0752667939033897, 0.028214547323996666, 0.042474076637724796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 837.1666666666666, 762, 923, 835.5, 923.0, 923.0, 923.0, 0.03170593799375393, 28.529058739873914, 0.018051329931990764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/087bbf96-4fd4-4abe-ad82-f8347cb372f3", 3, 0, 0.0, 458.33333333333337, 211, 914, 250.0, 914.0, 914.0, 914.0, 0.034589309597380435, 0.02883568420536826, 0.02218129554259097], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 842.8360655737706, 418, 1873, 709.0, 1436.6000000000001, 1569.5, 1873.0, 0.2814146390972587, 78.3285417517254, 1.0251153554935828], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 187.5, 81, 245, 237.0, 245.0, 245.0, 245.0, 0.03180206395395061, 0.05627474598101417, 0.01760915064637695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc3348a8-9a4f-4523-bead-2754aa8fc36f", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.7676344651442308, 1.434326171875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 98.18181818181819, 78, 241, 80.0, 216.00000000000009, 241.0, 241.0, 0.06803688836383653, 0.05056257035632774, 0.03415132872950389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 122.36363636363636, 79, 236, 81.0, 235.6, 236.0, 236.0, 0.0680377300139168, 0.01820540822638008, 0.03880276789856193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 123.09090909090908, 79, 242, 81.0, 240.6, 242.0, 242.0, 0.0680377300139168, 0.018338294417813514, 0.03999874362146281], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 158.12499999999997, 79, 339, 84.5, 324.90000000000003, 334.3, 339.0, 0.2514175911501008, 0.18684451842307295, 0.12153487072197255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 132.4545454545454, 78, 335, 81.0, 316.4000000000001, 335.0, 335.0, 0.06803730918627378, 0.018338180991612857, 0.04006493890558896], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 526.2678571428572, 383, 816, 476.0, 705.6, 712.5, 816.0, 0.25133183431846434, 73.89990429193988, 0.12640224089258706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.66666666666667, 79, 85, 81.0, 85.0, 85.0, 85.0, 0.031829056745903334, 0.02365421111682855, 0.017872761356342203], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 128.9107142857143, 77, 254, 85.5, 241.0, 246.3, 254.0, 0.2517612044975341, 0.4454993188960271, 0.12243855453102732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 558.875, 79, 1100, 669.5, 1067.8, 1100.0, 1100.0, 0.08265700957271492, 41.84564081945384, 0.04459765409074706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 160.1428571428571, 78, 773, 80.0, 556.5, 773.0, 773.0, 0.07526557997505483, 4.8562731928868645, 0.04378591915401488], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 774.8392857142858, 547, 1139, 775.0, 1015.0, 1058.55, 1139.0, 0.2508421128072816, 225.7081740373934, 0.12591098240521753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 384.56249999999994, 81, 658, 470.5, 647.5, 658.0, 658.0, 0.08265615555888475, 13.680552281955643, 0.04467791220883077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 95.94444444444444, 80, 236, 85.0, 138.80000000000015, 236.0, 236.0, 0.10305795865085682, 0.07699154137490768, 0.03663388373917176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 132.57142857142856, 78, 649, 82.0, 442.0, 649.0, 649.0, 0.0752667939033897, 1.599618877852746, 0.04386012808795463], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 495.1666666666667, 83, 953, 496.5, 926.6000000000001, 953.0, 953.0, 0.06964111611495427, 0.01390782055225405, 0.04718684348739496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 145.01123595505626, 79, 800, 88.0, 279.5, 350.19999999999993, 698.880000000001, 0.7498146525577947, 1.5554112501684978, 0.36157889692997236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 85.00000000000001, 80, 91, 84.5, 90.7, 91.0, 91.0, 0.0591255333615822, 0.04578764448802215, 0.021017279437124923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b43ceec-951f-405c-8745-556794c89e3f", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b43ceec-951f-405c-8745-556794c89e3f", 3, 0, 0.0, 382.3333333333333, 226, 514, 407.0, 514.0, 514.0, 514.0, 0.07743734028548566, 0.03503837988177899, 0.04965871105547095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/109ff98a-9b03-4828-a12c-051816f94f2c", 3, 0, 0.0, 313.3333333333333, 194, 442, 304.0, 442.0, 442.0, 442.0, 0.020080993339803874, 0.027683270440777803, 0.012877459921684126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 260.45454545454544, 161, 483, 167.0, 469.00000000000006, 483.0, 483.0, 0.06800239863006077, 0.10539043615811176, 0.15293898832522457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 85.92307692307693, 81, 104, 85.0, 96.8, 104.0, 104.0, 0.06407065514709144, 0.05199483830784471, 0.022775115696817658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da2fb0a6-4b66-48f2-bec4-483cc14795ed", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 582.15, 126, 1545, 530.5, 1314.000000000001, 1535.3999999999999, 1545.0, 0.09007304924293602, 0.05532807419317066, 0.04072638847605408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 101.87499999999999, 79, 248, 81.0, 247.3, 248.0, 248.0, 0.08265487457122785, 0.06142613237178163, 0.04148887258751085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 150.06249999999997, 80, 246, 82.5, 242.5, 246.0, 246.0, 0.08265658256359391, 0.09194939415307998, 0.04323528519104002], "isController": false}, {"data": ["login", 20, 0, 0.0, 2816.2, 1841, 4695, 2604.0, 3805.5, 4650.65, 4695.0, 0.08742252179006356, 31.49480867307911, 0.17539143434131502], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da2fb0a6-4b66-48f2-bec4-483cc14795ed", 3, 0, 0.0, 895.0, 194, 1881, 610.0, 1881.0, 1881.0, 1881.0, 0.022853834492530607, 0.02292078908577044, 0.01465561652027516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 249.58333333333334, 162, 1012, 165.0, 803.5000000000007, 1012.0, 1012.0, 0.058232356809060956, 5.888240013454101, 0.12972432741627885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 96.0, 82, 243, 84.0, 166.0, 243.0, 243.0, 0.07748205460271076, 0.06272717115785861, 0.02754244909705734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 283.33333333333337, 160, 863, 245.0, 516.5000000000006, 863.0, 863.0, 0.08439728615837619, 5.732893541907941, 0.18861181702668361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ace367b6-e266-4533-a663-aac15c49bf7d", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.8425750329815304, 1.5743527374670185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bb1a3e1-8d4a-43a4-a308-f8e615ac4bc5", 2, 0, 0.0, 324.5, 211, 438, 324.5, 438.0, 438.0, 438.0, 0.011623581923005393, 0.022986087298912033, 0.007225009662102474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 85.63636363636363, 81, 95, 85.0, 93.80000000000001, 95.0, 95.0, 0.06689085237188881, 0.05545931021848985, 0.02377760767906985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e36698fb-d101-46bc-8d81-710daf1fcc01", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a3c1245-c4e2-4493-87f2-9a6d26d4b140", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 672.6875, 164, 1185, 750.0, 1150.7, 1185.0, 1185.0, 0.08261987627673527, 55.65469817442347, 0.17392331132718505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 85.56249999999999, 80, 92, 85.5, 89.9, 92.0, 92.0, 0.08088324503579084, 0.06279509746431026, 0.028751466008816274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7f5147e-9f46-4b1b-9196-348806593eda", 2, 0, 0.0, 346.5, 256, 437, 346.5, 437.0, 437.0, 437.0, 0.07479151864178603, 0.04393271334280693, 0.0464890640776336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f84460f-4375-4b2c-9931-287958dca0d6", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.8425750329815304, 1.5743527374670185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bb1a3e1-8d4a-43a4-a308-f8e615ac4bc5", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6c37482-e94c-467b-88d1-89b872e28e1a", 3, 0, 0.0, 292.6666666666667, 172, 426, 280.0, 426.0, 426.0, 426.0, 0.03556778033338866, 0.02965139499798449, 0.022808765383064995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 328.3076923076923, 164, 1017, 318.0, 797.3999999999999, 1017.0, 1017.0, 0.06173103314006771, 5.769217642254417, 0.1376195816179229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 583.6999999999999, 79, 1003, 863.5, 997.6, 1003.0, 1003.0, 0.05282034217017658, 37.92054896181617, 0.08546166299565289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/793f97c2-39bb-459a-a386-2c62e6d04dce", 3, 0, 0.0, 355.0, 181, 483, 401.0, 483.0, 483.0, 483.0, 0.030268481430286643, 0.024780348566787406, 0.019410451958875224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 82.11111111111111, 80, 86, 82.5, 84.2, 86.0, 86.0, 0.1034940749642083, 0.07691307719508059, 0.05194917434726862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 133.55555555555557, 79, 246, 83.0, 238.8, 246.0, 246.0, 0.10349705033406548, 0.036329531014616084, 0.058542765124943934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 164.88888888888889, 78, 888, 81.5, 372.3000000000008, 888.0, 888.0, 0.103498240529911, 5.200118385096829, 0.060351513086777525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=793f97c2-39bb-459a-a386-2c62e6d04dce", 1, 0, 0.0, 953.0, 953, 953, 953.0, 953.0, 953.0, 953.0, 1.0493179433368311, 0.18957404249737672, 0.7234555351521511], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1184.952380952381, 100, 2430, 1198.0, 2078.0000000000005, 2404.3999999999996, 2430.0, 0.08494767627654108, 0.02654614883641909, 0.03832600238258006], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 137.55555555555554, 79, 541, 82.0, 338.50000000000034, 541.0, 541.0, 0.1034976454285665, 1.7169985359395574, 0.06045223799283566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6c37482-e94c-467b-88d1-89b872e28e1a", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5331302361005331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15232292460015232], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15232292460015232], "isController": false}, {"data": ["401/Unauthorized", 16, 59.25925925925926, 1.2185833968012185], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 27, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
