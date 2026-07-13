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

    var data = {"OkPercent": 98.28125, "KoPercent": 1.71875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8025520483546004, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8f21d291-819b-494d-be21-e361cb2019a4"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b498ea8-32e8-4f15-8b6d-c67734948ab2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45fa5c89-b40b-4ff5-93af-66c340a77ae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f38eaab-1a95-430b-9eb7-42fda78d92d4"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=322dafe0-2744-44c2-960c-9c9e6f4f6b0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e294bff-bf22-4425-8a83-27fa5889ac31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2b0c9c5-e5b8-4255-bc70-67345321bdd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4926680b-4665-4929-b43a-3a7348a99c8d"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79d942e9-6a6c-42ca-9214-8c4793cd1da3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f38eaab-1a95-430b-9eb7-42fda78d92d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=614e771c-a14c-43fe-ad07-a85ffbbf8d42"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/472aab7b-3c6f-45e9-a0f8-e3e5f7236115"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2caceac3-9cb3-45be-9233-da73da2b2805"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c5697cc-f761-4399-b68a-e2ae928d6b55"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/adb921b8-ce9c-4ee7-b21b-0af09a703bf2"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/45fa5c89-b40b-4ff5-93af-66c340a77ae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a45f550-7963-4666-90c0-0663712f47b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adb921b8-ce9c-4ee7-b21b-0af09a703bf2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f21d291-819b-494d-be21-e361cb2019a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b498ea8-32e8-4f15-8b6d-c67734948ab2"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/322dafe0-2744-44c2-960c-9c9e6f4f6b0d"], "isController": false}, {"data": [0.7363636363636363, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e294bff-bf22-4425-8a83-27fa5889ac31"], "isController": false}, {"data": [0.9341317365269461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2b0c9c5-e5b8-4255-bc70-67345321bdd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79d942e9-6a6c-42ca-9214-8c4793cd1da3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82b25e4d-a2a6-44db-acf7-a13b1c664cf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=472aab7b-3c6f-45e9-a0f8-e3e5f7236115"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/614e771c-a14c-43fe-ad07-a85ffbbf8d42"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2caceac3-9cb3-45be-9233-da73da2b2805"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 22, 1.71875, 319.9726562499999, 81, 3005, 100.5, 884.6000000000013, 1078.7500000000002, 1593.5100000000016, 5.008922142566447, 733.5639086370644, 3.6586394490772625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8f21d291-819b-494d-be21-e361cb2019a4", 3, 0, 0.0, 362.6666666666667, 264, 557, 267.0, 557.0, 557.0, 557.0, 0.0209669979452342, 0.02478228175102389, 0.013445633447952923], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1426.3636363636363, 1002, 2865, 1409.0, 1721.6, 1799.7999999999997, 2865.0, 0.25563322674202427, 307.61396938995455, 1.2569465787559493], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b498ea8-32e8-4f15-8b6d-c67734948ab2", 3, 0, 0.0, 295.0, 211, 460, 214.0, 460.0, 460.0, 460.0, 0.03870967741935484, 0.03227066532258065, 0.024823588709677418], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 496.7692307692307, 88, 1087, 475.0, 873.3999999999999, 1087.0, 1087.0, 0.10886586887524809, 0.020624979064255988, 0.0735940470258682], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 496.7692307692307, 88, 1087, 475.0, 873.3999999999999, 1087.0, 1087.0, 0.11336978607993442, 0.021478260253425075, 0.0766387248297273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 110.84210526315789, 82, 256, 85.0, 256.0, 256.0, 256.0, 0.10685262773106881, 0.03703814357618874, 0.060467076034080365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 85.63157894736842, 83, 88, 86.0, 87.0, 88.0, 88.0, 0.10695488192743956, 0.0794850245574038, 0.0536863372174843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 132.47368421052633, 82, 496, 85.0, 256.0, 496.0, 496.0, 0.10695729026519778, 1.6825212964630913, 0.06249986806255313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 148.47368421052633, 82, 960, 84.0, 256.0, 960.0, 960.0, 0.10685322865466161, 5.087638320450021, 0.06233471141192482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45fa5c89-b40b-4ff5-93af-66c340a77ae2", 1, 0, 0.0, 810.0, 810, 810, 810.0, 810.0, 810.0, 810.0, 1.2345679012345678, 0.22304205246913578, 0.8511766975308641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f38eaab-1a95-430b-9eb7-42fda78d92d4", 3, 0, 0.0, 306.6666666666667, 203, 468, 249.0, 468.0, 468.0, 468.0, 0.02791996277338297, 0.028001759539320614, 0.017904403210795717], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 226.38461538461536, 86, 517, 203.0, 438.99999999999994, 517.0, 517.0, 0.10999052389332611, 0.20286939101208204, 0.07109889258579262], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=322dafe0-2744-44c2-960c-9c9e6f4f6b0d", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 110.28571428571428, 83, 254, 86.5, 254.0, 254.0, 254.0, 0.0780226823083568, 0.057983653551425304, 0.0391637292055619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 145.14285714285717, 83, 261, 86.0, 260.0, 261.0, 261.0, 0.07795621088268705, 0.02922270349355191, 0.04399175125843598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 578.5714285714286, 484, 673, 576.0, 673.0, 673.0, 673.0, 0.07021204036189292, 20.64467112554916, 0.040042804268892056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 878.0000000000001, 747, 976, 896.0, 976.0, 976.0, 976.0, 0.0700434269246933, 63.02519867005043, 0.039878240133883004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e294bff-bf22-4425-8a83-27fa5889ac31", 3, 0, 0.0, 311.6666666666667, 206, 430, 299.0, 430.0, 430.0, 430.0, 0.06018295618680789, 0.027936489427860697, 0.038593887919274594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 205.42857142857144, 83, 263, 252.0, 263.0, 263.0, 263.0, 0.07050765511684126, 0.12476549909347301, 0.039040859815672846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 96.0, 83, 251, 85.5, 138.30000000000013, 251.0, 251.0, 0.07634498389597996, 0.05673684838363355, 0.038321603244661814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 147.62499999999997, 82, 258, 86.0, 257.3, 258.0, 258.0, 0.07634571247250362, 0.027595172684458397, 0.04314017371035391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 183.5625, 83, 1001, 85.0, 480.2000000000005, 1001.0, 1001.0, 0.0762852879054444, 4.309378449227373, 0.044437670151950756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 162.00000000000003, 81, 484, 86.0, 325.8000000000002, 484.0, 484.0, 0.0762852879054444, 1.4211766618273187, 0.044512167503420914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 87.0, 84, 100, 85.0, 100.0, 100.0, 100.0, 0.07061078327533162, 0.052475396555202496, 0.03964960974933172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 602.7777777777776, 81, 1346, 820.5, 1130.9000000000003, 1346.0, 1346.0, 0.10718688032584812, 53.59447527928137, 0.0578967328843394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 169.21428571428572, 83, 1079, 86.0, 670.0, 1079.0, 1079.0, 0.07802572619658024, 5.034362886854337, 0.04539164037942796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 403.7222222222222, 81, 750, 496.0, 741.0, 750.0, 750.0, 0.10718496552216943, 17.521694720842714, 0.05800037142567914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 210.92857142857144, 81, 648, 168.0, 502.5, 648.0, 648.0, 0.07795447458684128, 1.6567392165296895, 0.045426317013007256], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 421.1538461538461, 92, 810, 391.0, 772.0, 810.0, 810.0, 0.11382640597501072, 0.021564768319484454, 0.07785377301701267], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 312.75, 169, 1084, 256.0, 678.7000000000004, 1084.0, 1084.0, 0.07625402120814966, 5.812437634040272, 0.17027768676277852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 502.30434782608705, 92, 1574, 488.0, 834.6000000000004, 1444.9999999999982, 1574.0, 0.10201139866498125, 0.06266129859401681, 0.046124294513560864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 86.0, 82, 98, 85.0, 89.9, 98.0, 98.0, 0.10718432726947927, 0.07965554008991574, 0.053801508023937836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 122.44444444444443, 82, 262, 86.0, 253.9, 262.0, 262.0, 0.10718688032584812, 0.11811956994241682, 0.0561288937122985], "isController": false}, {"data": ["login", 23, 0, 0.0, 2452.652173913044, 1166, 4000, 2405.0, 3817.6000000000004, 3982.3999999999996, 4000.0, 0.10118741228591163, 36.979930556013834, 0.20373676452149353], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 89.42857142857143, 86, 98, 88.0, 95.0, 98.0, 98.0, 0.0760935733542047, 0.06160309795960518, 0.027048887403252456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2b0c9c5-e5b8-4255-bc70-67345321bdd1", 3, 0, 0.0, 339.66666666666663, 187, 640, 192.0, 640.0, 640.0, 640.0, 0.0350930550843988, 0.02925563609086762, 0.022504335454513552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4926680b-4665-4929-b43a-3a7348a99c8d", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.698765727571116, 1.3056448304157549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 691.1666666666669, 170, 1432, 906.0, 1214.2000000000003, 1432.0, 1432.0, 0.10712946595961219, 71.27606073050393, 0.2257088585652984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79d942e9-6a6c-42ca-9214-8c4793cd1da3", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f38eaab-1a95-430b-9eb7-42fda78d92d4", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=614e771c-a14c-43fe-ad07-a85ffbbf8d42", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/472aab7b-3c6f-45e9-a0f8-e3e5f7236115", 3, 0, 0.0, 580.0, 170, 1366, 204.0, 1366.0, 1366.0, 1366.0, 0.03090394025238218, 0.025763343420036052, 0.01981795647695081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2caceac3-9cb3-45be-9233-da73da2b2805", 3, 0, 0.0, 288.6666666666667, 188, 481, 197.0, 481.0, 481.0, 481.0, 0.03792140157500221, 0.03161351218541037, 0.024318086296469515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 262.15789473684214, 170, 1049, 174.0, 343.0, 1049.0, 1049.0, 0.10680097357519071, 6.881603479603824, 0.2387596805948252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 770.0, 86, 1060, 957.0, 1060.0, 1060.0, 1060.0, 0.08996491368366338, 83.71703785523646, 0.17102704945071423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c5697cc-f761-4399-b68a-e2ae928d6b55", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adb921b8-ce9c-4ee7-b21b-0af09a703bf2", 3, 0, 0.0, 755.3333333333334, 224, 1128, 914.0, 1128.0, 1128.0, 1128.0, 0.017551865763330645, 0.024196663902247808, 0.011255591000573361], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1026.3913043478258, 88, 1833, 850.0, 1768.6000000000001, 1821.7999999999997, 1833.0, 0.10275150664980946, 0.03221455184707002, 0.0463585899142695], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/45fa5c89-b40b-4ff5-93af-66c340a77ae2", 3, 0, 0.0, 615.0, 190, 1138, 517.0, 1138.0, 1138.0, 1138.0, 0.029866496759485103, 0.029953996261710154, 0.019152668820372934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a45f550-7963-4666-90c0-0663712f47b2", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 100.6470588235294, 85, 257, 90.0, 139.3999999999999, 257.0, 257.0, 0.08354465215938355, 0.06486132662764639, 0.029697513072280867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 390.7142857142857, 170, 1167, 345.5, 838.0, 1167.0, 1167.0, 0.07791542836789439, 6.77026701165114, 0.17380966791331354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adb921b8-ce9c-4ee7-b21b-0af09a703bf2", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 471.53846153846155, 169, 1142, 338.0, 1108.3999999999999, 1142.0, 1142.0, 0.08719623848841968, 24.177109079979072, 0.19095792823414204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 85.1111111111111, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.046590844381403006, 0.03462464118578876, 0.023386419933633933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 104.44444444444444, 81, 264, 85.0, 264.0, 264.0, 264.0, 0.046592291564206766, 0.012467078016203764, 0.02657216628271167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 138.0, 82, 403, 85.0, 403.0, 403.0, 403.0, 0.04655180439966276, 0.012547166029596603, 0.027367369383395488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 103.33333333333333, 83, 252, 85.0, 252.0, 252.0, 252.0, 0.04655132283342385, 0.012547036232446272, 0.02741254655132283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 3.205672554347826, 6.719174592391305], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 982.2363636363642, 655, 2506, 914.0, 1324.8, 1438.1999999999998, 2506.0, 0.2543893729995745, 304.33813016294795, 0.5023196408253316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1026.3913043478258, 88, 1833, 850.0, 1768.6000000000001, 1821.7999999999997, 1833.0, 0.1017320995736098, 0.03189494833778596, 0.045898662112312236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f21d291-819b-494d-be21-e361cb2019a4", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 85.0, 81, 92, 84.0, 92.0, 92.0, 92.0, 0.03979339270507525, 0.010725562877539813, 0.02343302324332068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 87.6, 84, 99, 85.0, 99.0, 99.0, 99.0, 0.0397937094104164, 0.010725648239526295, 0.02339434869635808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 133.58823529411765, 82, 255, 86.0, 253.4, 255.0, 255.0, 0.08429696332586231, 0.022720665896423825, 0.04955739445524327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 142.23529411764707, 83, 254, 86.0, 252.4, 254.0, 254.0, 0.08436724565756823, 0.02273960918114144, 0.049681102667493794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 106.23529411764707, 84, 252, 85.0, 251.2, 252.0, 252.0, 0.08436640827386328, 0.06269808271133785, 0.04234798227809153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 84.6, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.03979339270507525, 0.010647841407412713, 0.02269466927711323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 103.82352941176472, 83, 253, 84.0, 249.0, 253.0, 253.0, 0.08429863535385593, 0.02255647078804348, 0.048076565475245955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 85.8, 84, 88, 86.0, 88.0, 88.0, 88.0, 0.03979275930951604, 0.029572548666544636, 0.01997409988778442], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 624.4615384615385, 86, 1366, 481.0, 1274.8, 1366.0, 1366.0, 0.11031814054531106, 0.02066807711238024, 0.0750813065910846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 96.4, 87, 108, 95.0, 108.0, 108.0, 108.0, 0.03798757046694322, 0.02990037284800413, 0.01350339418942122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1459.6086956521738, 739, 3005, 1390.0, 2261.6000000000004, 2871.999999999998, 3005.0, 0.10182758376425587, 0.05270372987798399, 0.0468367108915669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 174.2, 169, 186, 171.0, 186.0, 186.0, 186.0, 0.03976585862441942, 0.06162931409858752, 0.08943434805863078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b498ea8-32e8-4f15-8b6d-c67734948ab2", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["addBook", 56, 11, 19.642857142857142, 914.1249999999999, 427, 1865, 732.5, 1599.6, 1745.2499999999998, 1865.0, 0.27071449289374455, 93.62670933844146, 0.9811275968650294], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 171.18181818181827, 83, 1753, 87.0, 344.4, 348.79999999999995, 1753.0, 0.25508074465026115, 0.1895668424598132, 0.1233056334002727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/322dafe0-2744-44c2-960c-9c9e6f4f6b0d", 3, 0, 0.0, 299.3333333333333, 181, 513, 204.0, 513.0, 513.0, 513.0, 0.05635390250774867, 0.03623012937916784, 0.0361384075326383], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 538.9272727272727, 401, 761, 505.0, 684.8, 751.6, 761.0, 0.254832551846841, 74.9292314800443, 0.12816285566515928], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 130.80000000000004, 81, 338, 88.0, 255.4, 260.79999999999995, 338.0, 0.25541953820147495, 0.4519728547080787, 0.12421770510188918], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 807.9818181818182, 567, 1151, 808.0, 1033.0, 1104.3999999999999, 1151.0, 0.2548278290522258, 229.29452852073604, 0.12791162512973053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 88.84615384615384, 84, 98, 88.0, 96.8, 98.0, 98.0, 0.09315523962393947, 0.06959351397686885, 0.03311377658507223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e294bff-bf22-4425-8a83-27fa5889ac31", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 11, 6.586826347305389, 136.86826347305393, 83, 390, 91.0, 251.60000000000014, 320.4, 381.8399999999999, 0.7125120529733512, 1.602760464220802, 0.34039400023252636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 91.33333333333333, 86, 105, 88.0, 105.0, 105.0, 105.0, 0.04732508124138946, 0.03664920842228696, 0.01682258747252516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2b0c9c5-e5b8-4255-bc70-67345321bdd1", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 99.84210526315789, 87, 245, 89.0, 125.0, 245.0, 245.0, 0.10751106232246528, 0.08724774686520376, 0.03821682293493883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79d942e9-6a6c-42ca-9214-8c4793cd1da3", 3, 0, 0.0, 304.0, 181, 435, 296.0, 435.0, 435.0, 435.0, 0.06693739122673925, 0.030287426368869653, 0.042925345285376414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82b25e4d-a2a6-44db-acf7-a13b1c664cf0", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 245.22222222222223, 168, 490, 173.0, 490.0, 490.0, 490.0, 0.046530143778144274, 0.07211263493741696, 0.10464738390729127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 279.52941176470586, 169, 506, 329.0, 501.2, 506.0, 506.0, 0.08426061311987312, 0.13058749318480337, 0.18950409376471464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 101.87500000000001, 86, 262, 89.0, 159.8000000000001, 262.0, 262.0, 0.07785622874160003, 0.064550720900018, 0.02767545631049064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=472aab7b-3c6f-45e9-a0f8-e3e5f7236115", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 108.66666666666666, 86, 256, 89.0, 255.1, 256.0, 256.0, 0.10340726953104803, 0.08028201101287422, 0.03675805284111473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/614e771c-a14c-43fe-ad07-a85ffbbf8d42", 3, 0, 0.0, 306.0, 180, 416, 322.0, 416.0, 416.0, 416.0, 0.0664687375371117, 0.029426264013825497, 0.04262480890237958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2caceac3-9cb3-45be-9233-da73da2b2805", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 98.46153846153847, 83, 257, 85.0, 188.99999999999994, 257.0, 257.0, 0.08775838092537837, 0.06521887488692671, 0.04405059355043407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 135.84615384615384, 82, 253, 85.0, 251.8, 253.0, 253.0, 0.08766192168418781, 0.05384043507286054, 0.04829571316344902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 333.1538461538462, 83, 1054, 89.0, 1022.4, 1054.0, 1054.0, 0.08724715104495241, 18.134659843072576, 0.04956152014738057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 268.0769230769231, 83, 663, 251.0, 656.6, 663.0, 663.0, 0.08752087036139386, 5.9567708964493455, 0.049802478439570204], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.546875], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.078125], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.078125], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 1.015625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 22, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
