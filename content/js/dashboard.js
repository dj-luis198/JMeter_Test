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

    var data = {"OkPercent": 98.97557131599685, "KoPercent": 1.024428684003152};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7698036560595802, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.045454545454545456, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be1a105c-d11d-4a7d-8b27-cf698aef8504"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/833cf3b5-9efd-4e79-a766-b06202f32553"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58d71370-eda0-4658-8481-055f09283c45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2053e7c-52ef-42d8-8e04-6a4c973b62ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cce2efe5-3a4b-4f88-b868-fb920013765f"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/73b40e51-ada8-49a9-9797-c5c88225e4da"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5dfde42-83b8-4774-8bc3-d79628cc6b9b"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2219f6c4-d1c6-454a-a456-76fce228b8e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ad473b6-aa81-4e7c-966b-9642ee26a8e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e21b7b2-432d-405d-a712-5ed02d3ac641"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ad473b6-aa81-4e7c-966b-9642ee26a8e9"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73b40e51-ada8-49a9-9797-c5c88225e4da"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2053e7c-52ef-42d8-8e04-6a4c973b62ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca472b7e-9a1f-454e-9df9-d11ef74ea329"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b67682a8-4e83-4d40-a446-89db33fc2688"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2d90f0d-cf95-4bfe-a689-72a7fc28f9f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0e0f1a8-1e8c-4b2d-a3c9-d6c968dad78c"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=833cf3b5-9efd-4e79-a766-b06202f32553"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6bd2e4f-54be-4987-8d0a-2eca6ea3a5d9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58d71370-eda0-4658-8481-055f09283c45"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5dfde42-83b8-4774-8bc3-d79628cc6b9b"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9502923976608187, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2219f6c4-d1c6-454a-a456-76fce228b8e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/996387e4-ffe1-468e-b379-b06c86ebf0f2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca472b7e-9a1f-454e-9df9-d11ef74ea329"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a6bd2e4f-54be-4987-8d0a-2eca6ea3a5d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be1a105c-d11d-4a7d-8b27-cf698aef8504"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2d90f0d-cf95-4bfe-a689-72a7fc28f9f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b67682a8-4e83-4d40-a446-89db33fc2688"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1269, 13, 1.024428684003152, 416.9141055949564, 106, 3034, 132.0, 1184.0, 1429.5, 1977.4999999999993, 4.994666845094481, 700.1524595364091, 3.6452885586115693], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1865.163636363636, 1398, 2616, 1844.0, 2208.6, 2416.6, 2616.0, 0.23907014752801467, 287.6817510421285, 1.1755060476597206], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be1a105c-d11d-4a7d-8b27-cf698aef8504", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/833cf3b5-9efd-4e79-a766-b06202f32553", 3, 0, 0.0, 718.3333333333334, 246, 1417, 492.0, 1417.0, 1417.0, 1417.0, 0.02200203885560062, 0.026005665066629508, 0.014109380385915762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58d71370-eda0-4658-8481-055f09283c45", 3, 0, 0.0, 726.6666666666667, 360, 1460, 360.0, 1460.0, 1460.0, 1460.0, 0.022881026290299207, 0.02704459845705613, 0.01467305396871401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2053e7c-52ef-42d8-8e04-6a4c973b62ff", 3, 0, 0.0, 361.3333333333333, 213, 481, 390.0, 481.0, 481.0, 481.0, 0.039761431411530816, 0.02556276921802518, 0.025498053346587144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cce2efe5-3a4b-4f88-b868-fb920013765f", 2, 0, 0.0, 242.0, 197, 287, 242.0, 287.0, 287.0, 287.0, 0.07147196512168102, 0.04393711137118965, 0.04442568925776364], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 554.9230769230769, 119, 811, 527.0, 770.5999999999999, 811.0, 811.0, 0.088958230689221, 0.016853414798543822, 0.06013635201114031], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 554.9230769230769, 119, 811, 527.0, 770.5999999999999, 811.0, 811.0, 0.09165838215904845, 0.017364966932475977, 0.06196167225430266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 131.0, 109, 345, 115.0, 223.20000000000007, 345.0, 345.0, 0.0920409152548613, 0.03384421154683962, 0.05197675123181425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 129.73333333333332, 109, 348, 115.0, 213.60000000000008, 348.0, 348.0, 0.09204148002699883, 0.06840192021537707, 0.04620050852917715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 256.73333333333335, 108, 1021, 114.0, 688.6000000000001, 1021.0, 1021.0, 0.09203978573137882, 1.827337292833782, 0.05367189848932031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 265.2, 110, 1442, 116.0, 786.2000000000004, 1442.0, 1442.0, 0.09203978573137882, 5.544324491250084, 0.053582015886067015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73b40e51-ada8-49a9-9797-c5c88225e4da", 3, 0, 0.0, 625.0, 206, 1148, 521.0, 1148.0, 1148.0, 1148.0, 0.020900243139495192, 0.02096147432056793, 0.013402825190366383], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 304.35714285714283, 115, 922, 231.5, 678.5, 922.0, 922.0, 0.08242421387906013, 0.17825616120998744, 0.05328021693758721], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 125.04545454545455, 109, 328, 116.0, 119.4, 296.79999999999956, 328.0, 0.12487370727332585, 0.09280165159668063, 0.06268074759618114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 134.72727272727272, 110, 355, 115.0, 267.89999999999986, 351.69999999999993, 355.0, 0.12470453527721251, 0.04188185874944025, 0.07064449925460699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 786.0, 568, 910, 880.0, 910.0, 910.0, 910.0, 0.05113171529860922, 15.034422030525635, 0.02916105638123807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1201.3333333333333, 1166, 1254, 1184.0, 1254.0, 1254.0, 1254.0, 0.05086814975583288, 45.77125056696792, 0.02896106573012751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 189.33333333333334, 114, 338, 116.0, 338.0, 338.0, 338.0, 0.05180631346273399, 0.0916728906196035, 0.02868572239586931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 148.6153846153846, 111, 325, 117.0, 324.6, 325.0, 325.0, 0.06085287646866077, 0.045223670891260594, 0.030545291508683237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 183.46153846153848, 108, 347, 115.0, 345.4, 347.0, 347.0, 0.06085287646866077, 0.03034415519823995, 0.033918895988391144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5dfde42-83b8-4774-8bc3-d79628cc6b9b", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 294.53846153846155, 106, 1251, 114.0, 1200.6, 1251.0, 1251.0, 0.060566812182315424, 8.39813994369616, 0.03480589792628553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 345.15384615384613, 110, 923, 342.0, 919.4, 923.0, 923.0, 0.06062641072994199, 2.75631563974854, 0.03489935287136008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2219f6c4-d1c6-454a-a456-76fce228b8e3", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ad473b6-aa81-4e7c-966b-9642ee26a8e9", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 117.66666666666667, 116, 120, 117.0, 120.0, 120.0, 120.0, 0.05180541884681138, 0.03849992552971041, 0.02908995687198881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 853.6250000000001, 106, 1566, 1207.0, 1474.3000000000002, 1566.0, 1566.0, 0.07157203501661813, 40.257635911380405, 0.03823232729891613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 208.13636363636363, 108, 1301, 115.5, 340.59999999999997, 1157.749999999998, 1301.0, 0.12487796017528324, 5.139647129296937, 0.07292677752423768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 601.6875, 108, 1038, 731.5, 981.3000000000001, 1038.0, 1038.0, 0.07156979396845561, 13.159668715724779, 0.038301022553431326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 182.1363636363636, 111, 911, 115.0, 344.7, 826.0999999999988, 911.0, 0.12471089746496757, 1.6988649005430594, 0.07295100349757382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e21b7b2-432d-405d-a712-5ed02d3ac641", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 568.2307692307692, 117, 2137, 468.0, 1549.3999999999996, 2137.0, 2137.0, 0.09190916546477758, 0.01741247861344419, 0.06286305225036057], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2ad473b6-aa81-4e7c-966b-9642ee26a8e9", 3, 0, 0.0, 483.0, 260, 767, 422.0, 767.0, 767.0, 767.0, 0.016367415748727434, 0.02256380393745465, 0.01049603158365659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 554.6153846153845, 223, 1577, 459.0, 1441.0, 1577.0, 1577.0, 0.06053381512041573, 11.220842090849615, 0.13375917756663377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 962.2105263157896, 191, 2450, 945.0, 1865.0, 2450.0, 2450.0, 0.08973481002196142, 0.05512030810919309, 0.040573454140789195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 116.62499999999999, 106, 136, 116.0, 124.80000000000001, 136.0, 136.0, 0.07159317180123946, 0.053205472403069554, 0.03593641631429402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 218.06250000000003, 113, 351, 151.5, 351.0, 351.0, 351.0, 0.07157107455022052, 0.08633610335757803, 0.037061095976810975], "isController": false}, {"data": ["login", 19, 0, 0.0, 3346.4736842105262, 1960, 5681, 3270.0, 4543.0, 5681.0, 5681.0, 0.09034583434378017, 17.19260888604775, 0.15996729272763585], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 154.68181818181816, 112, 354, 120.0, 344.1, 352.65, 354.0, 0.12323204033048592, 0.0997650014003641, 0.04380513933622742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73b40e51-ada8-49a9-9797-c5c88225e4da", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 987.8125000000001, 230, 1680, 1324.5, 1593.2, 1680.0, 1680.0, 0.07153203741125556, 53.52731357242172, 0.14943838967971532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2053e7c-52ef-42d8-8e04-6a4c973b62ff", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca472b7e-9a1f-454e-9df9-d11ef74ea329", 3, 0, 0.0, 337.0, 213, 470, 328.0, 470.0, 470.0, 470.0, 0.02757302255473245, 0.027653802894248267, 0.017681918760684544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b67682a8-4e83-4d40-a446-89db33fc2688", 3, 0, 0.0, 381.33333333333337, 217, 642, 285.0, 642.0, 642.0, 642.0, 0.06727513286838742, 0.030440245666360187, 0.04314193090843854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 449.1333333333334, 225, 1793, 445.0, 1063.4000000000005, 1793.0, 1793.0, 0.09197657663181777, 7.468773473188827, 0.20528860525186252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 837.4, 114, 1371, 1283.0, 1371.0, 1371.0, 1371.0, 0.060642078325308366, 43.53589556221271, 0.09811698766540128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2d90f0d-cf95-4bfe-a689-72a7fc28f9f3", 3, 0, 0.0, 692.6666666666666, 435, 1153, 490.0, 1153.0, 1153.0, 1153.0, 0.017090608710513572, 0.023560783818041987, 0.010959797903552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0e0f1a8-1e8c-4b2d-a3c9-d6c968dad78c", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1499.2608695652173, 166, 2351, 1421.0, 2283.4, 2343.4, 2351.0, 0.09499539478847005, 0.030218473919633896, 0.04285925038307926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=833cf3b5-9efd-4e79-a766-b06202f32553", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 122.76470588235296, 114, 145, 120.0, 134.6, 145.0, 145.0, 0.0886404638503332, 0.0688175476181786, 0.03150891488429813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 366.4090909090909, 226, 1410, 235.5, 617.2999999999998, 1300.9499999999985, 1410.0, 0.12462259181002984, 6.961268174718042, 0.2788297726204166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 371.1666666666667, 224, 693, 348.0, 682.2, 693.0, 693.0, 0.10952702579361456, 0.16974549798287727, 0.24632884804950622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 115.33333333333334, 110, 124, 114.0, 124.0, 124.0, 124.0, 0.02850383376564148, 0.021183024898098795, 0.014307588433144258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 114.33333333333333, 109, 117, 115.5, 117.0, 117.0, 117.0, 0.028503969177707995, 0.007627038627628897, 0.01625616992166159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 112.83333333333333, 109, 117, 113.5, 117.0, 117.0, 117.0, 0.02850383376564148, 0.0076826739446455555, 0.016757136647379073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 111.66666666666666, 108, 116, 111.5, 116.0, 116.0, 116.0, 0.028504104591061112, 0.00768274694055944, 0.016785131902743996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6bd2e4f-54be-4987-8d0a-2eca6ea3a5d9", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 2.520699786324786, 5.2834535256410255], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1295.0363636363634, 885, 2141, 1245.0, 1706.4, 1945.8, 2141.0, 0.24012119571623788, 287.26842971106873, 0.47414556419749315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58d71370-eda0-4658-8481-055f09283c45", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1499.2608695652173, 166, 2351, 1421.0, 2283.4, 2343.4, 2351.0, 0.0917080017225155, 0.029172738999027097, 0.04137607108965055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 112.5, 111, 114, 112.0, 114.0, 114.0, 114.0, 0.030788493313765534, 0.008298461088475867, 0.01813033346503967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 112.5, 109, 118, 111.5, 118.0, 118.0, 118.0, 0.030787229457221142, 0.008298120439641636, 0.01809952356762415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 261.47058823529414, 112, 1012, 115.0, 996.8, 1012.0, 1012.0, 0.08977513967955555, 9.524859709841468, 0.051870309909063064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 217.9411764705882, 108, 904, 115.0, 867.1999999999999, 904.0, 904.0, 0.08982637090893719, 3.1286491963181757, 0.051987631371067454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 113.5, 111, 116, 113.5, 116.0, 116.0, 116.0, 0.030788019355401503, 0.008238200491582042, 0.017558792288627417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 143.8235294117647, 111, 342, 118.0, 339.6, 342.0, 342.0, 0.09020051042877078, 0.0670337777698189, 0.045276428086316586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 114.66666666666667, 112, 119, 114.0, 119.0, 119.0, 119.0, 0.030787229457221142, 0.022879962516548138, 0.015453746036144208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 207.4705882352941, 108, 347, 117.0, 344.6, 347.0, 347.0, 0.09009343218879344, 0.04002657425023715, 0.05049124106352647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 180.0, 116, 488, 118.5, 488.0, 488.0, 488.0, 0.031086794329768717, 0.024468707255657796, 0.011050383921909972], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 624.1538461538461, 114, 1460, 492.0, 1335.1999999999998, 1460.0, 1460.0, 0.09403595066729357, 0.017617612752721615, 0.06399982820355167], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1768.3157894736842, 1246, 3034, 1693.0, 2445.0, 3034.0, 3034.0, 0.08920983561913974, 0.04617305945131256, 0.041033039625600405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 230.83333333333334, 228, 233, 231.0, 233.0, 233.0, 233.0, 0.030768599618469367, 0.047685319916514535, 0.06919930168099116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5dfde42-83b8-4774-8bc3-d79628cc6b9b", 3, 0, 0.0, 288.0, 210, 442, 212.0, 442.0, 442.0, 442.0, 0.08329631274988894, 0.03768941234451355, 0.05341592972567748], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 1262.2931034482758, 588, 2452, 1041.5, 2026.4, 2194.7499999999995, 2452.0, 0.28286611654084004, 94.43961951459198, 1.0276710044551414], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 207.65454545454543, 111, 474, 118.0, 455.4, 463.2, 474.0, 0.240958577030076, 0.17907175499989048, 0.11647899963856213], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 780.5636363636364, 526, 1311, 848.0, 1013.0, 1060.3999999999994, 1311.0, 0.24077503294240224, 70.79585416858193, 0.12109291207552456], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 163.19999999999996, 110, 444, 117.0, 345.6, 351.2, 444.0, 0.24137098720733768, 0.42711350470673426, 0.11738549963794351], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1072.8181818181818, 754, 1702, 1073.0, 1349.2, 1482.3999999999999, 1702.0, 0.2406517725096917, 216.53888792491446, 0.12079590924802884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 119.0, 114, 127, 118.0, 122.5, 127.0, 127.0, 0.11112414418975065, 0.08301754912613209, 0.039501160629950426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 5, 2.9239766081871346, 200.20467836257308, 112, 1753, 123.0, 352.00000000000006, 441.80000000000007, 1367.0800000000006, 0.7223419085033583, 1.5526242317196808, 0.3478011276031766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 161.5, 117, 334, 125.5, 334.0, 334.0, 334.0, 0.02822984741767471, 0.021861590822476604, 0.010034828574251557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2219f6c4-d1c6-454a-a456-76fce228b8e3", 3, 0, 0.0, 448.0, 367, 591, 386.0, 591.0, 591.0, 591.0, 0.03576793762071679, 0.02981825789279157, 0.022937121455993515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 121.46666666666667, 111, 136, 119.0, 134.8, 136.0, 136.0, 0.09166238908850921, 0.07438617708256948, 0.032583114871306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 231.33333333333331, 226, 239, 230.0, 239.0, 239.0, 239.0, 0.028488405219075835, 0.04415146394792319, 0.06407109103469888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 459.8235294117647, 231, 1333, 453.0, 1167.3999999999999, 1333.0, 1333.0, 0.08971875808128518, 12.750314716581082, 0.19907895613544366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/996387e4-ffe1-468e-b379-b06c86ebf0f2", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.428064259383378, 0.7998387231903485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca472b7e-9a1f-454e-9df9-d11ef74ea329", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 139.61538461538458, 114, 345, 118.0, 274.99999999999994, 345.0, 345.0, 0.05952244683042971, 0.04935015367093244, 0.02115836977175431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6bd2e4f-54be-4987-8d0a-2eca6ea3a5d9", 3, 0, 0.0, 434.0, 210, 561, 531.0, 561.0, 561.0, 561.0, 0.020534302552413806, 0.024270850445252127, 0.013168156259197655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 120.81249999999999, 114, 136, 120.0, 126.9, 136.0, 136.0, 0.07183746772926254, 0.05577225277808957, 0.025535974856886294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be1a105c-d11d-4a7d-8b27-cf698aef8504", 3, 0, 0.0, 536.3333333333334, 201, 922, 486.0, 922.0, 922.0, 922.0, 0.027613630087811345, 0.027874305632260083, 0.01770795939875923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2d90f0d-cf95-4bfe-a689-72a7fc28f9f3", 1, 0, 0.0, 2137.0, 2137, 2137, 2137.0, 2137.0, 2137.0, 2137.0, 0.46794571829667764, 0.08454097449695835, 0.32262663781001405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b67682a8-4e83-4d40-a446-89db33fc2688", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 139.44444444444446, 109, 344, 115.0, 342.2, 344.0, 344.0, 0.10975609756097561, 0.08156678734756098, 0.055092416158536585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 177.16666666666663, 107, 345, 116.0, 345.0, 345.0, 345.0, 0.10960238689642575, 0.029327201181270173, 0.06250761127686781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 178.22222222222223, 108, 361, 116.0, 345.70000000000005, 361.0, 361.0, 0.1097540898642098, 0.0295821570337128, 0.06452340048657647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 179.0, 107, 355, 115.0, 353.2, 355.0, 355.0, 0.1097540898642098, 0.0295821570337128, 0.06463058221495949], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.31520882584712373], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07880220646178093], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07880220646178093], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5516154452324665], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1269, 13, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
