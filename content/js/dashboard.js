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

    var data = {"OkPercent": 98.48484848484848, "KoPercent": 1.5151515151515151};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7227011494252874, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21296296296296297, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f43a243-bf1c-404b-bc01-bff1b489a5bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab380973-2ad0-4f34-8e10-1367623023f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23134d37-40f6-4b6f-9e1d-a534a5607507"], "isController": false}, {"data": [0.4, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/db2b7050-6b58-4a2f-bded-03a09fa07a04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b2b0935-7a91-49d7-86c1-cd3a36de14c1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3585964d-1ba4-443a-a585-846505677e06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b7fb38a-e7f1-42b7-adfd-fab9d13a7056"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cef6ad7-77f8-4d32-9731-e3efc8f21dbe"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3585964d-1ba4-443a-a585-846505677e06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ab6902b-f92d-4538-b397-b48bb6038d98"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68ec7d43-ae04-438d-a8e3-91bd7f40b8c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94075edf-5d20-4194-8797-7eb547757895"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/149c2d93-d541-43ee-a8f5-b1f484c7043c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/510fc5d1-cbc4-4b27-85b4-6ce9e3627d64"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48b874ac-6e24-4470-8232-49ec0da2b5ed"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b2b0935-7a91-49d7-86c1-cd3a36de14c1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/761f50f3-66cb-457c-906f-a37bea0e40ca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ab380973-2ad0-4f34-8e10-1367623023f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/23134d37-40f6-4b6f-9e1d-a534a5607507"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f1501a3-216b-4f66-be8c-b2dc2ebb3050"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2792ed5e-a236-4b3c-934e-480417acc4a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db2b7050-6b58-4a2f-bded-03a09fa07a04"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2604166666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8b7fb38a-e7f1-42b7-adfd-fab9d13a7056"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d1dd77f-7bfd-4517-a2fe-6fccb308eb0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.77, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d1dd77f-7bfd-4517-a2fe-6fccb308eb0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=510fc5d1-cbc4-4b27-85b4-6ce9e3627d64"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/68ec7d43-ae04-438d-a8e3-91bd7f40b8c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4cef6ad7-77f8-4d32-9731-e3efc8f21dbe"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/8f1501a3-216b-4f66-be8c-b2dc2ebb3050"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/48b874ac-6e24-4470-8232-49ec0da2b5ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1188, 18, 1.5151515151515151, 591.4048821548816, 80, 10883, 176.0, 1203.3000000000004, 2449.8999999999983, 6492.009999999971, 4.689331770222743, 701.957998156388, 3.4064912755929755], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2504.425925925925, 1071, 9234, 1576.0, 5784.5, 6757.0, 9234.0, 0.2203982678328728, 265.21185687836464, 1.0836965610727682], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4f43a243-bf1c-404b-bc01-bff1b489a5bf", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab380973-2ad0-4f34-8e10-1367623023f3", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23134d37-40f6-4b6f-9e1d-a534a5607507", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 1178.7333333333336, 88, 4162, 702.0, 3670.0000000000005, 4162.0, 4162.0, 0.08271481036251144, 0.0162037021081248, 0.055692484945904515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 1178.7333333333336, 88, 4162, 702.0, 3670.0000000000005, 4162.0, 4162.0, 0.08441288028002567, 0.01653635135173159, 0.05683580780312665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db2b7050-6b58-4a2f-bded-03a09fa07a04", 3, 0, 0.0, 3171.3333333333335, 338, 8408, 768.0, 8408.0, 8408.0, 8408.0, 0.030173497611264772, 0.025154403444807644, 0.019349541111390495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 123.94736842105266, 84, 267, 86.0, 254.0, 267.0, 267.0, 0.1054155870815972, 0.053206263627738726, 0.058721943502793514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 88.31578947368423, 83, 99, 87.0, 97.0, 99.0, 99.0, 0.10541383251406443, 0.07833977201484671, 0.052912802648661245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 184.52631578947367, 83, 658, 85.0, 499.0, 658.0, 658.0, 0.1054155870815972, 4.917981731894873, 0.0606453878600081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 223.6315789473684, 80, 926, 85.0, 883.0, 926.0, 926.0, 0.10541617195042112, 15.0008198794788, 0.06054277885351591], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 808.0, 86, 5159, 332.0, 3521.000000000001, 5159.0, 5159.0, 0.0825195984046211, 0.13152635469674048, 0.05333688626048686], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 114.28571428571428, 83, 266, 87.5, 260.0, 266.0, 266.0, 0.07743448489474442, 0.05754652637197314, 0.03886848167568225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 121.35714285714286, 81, 258, 86.5, 255.0, 258.0, 258.0, 0.07743448489474442, 0.02902712903350701, 0.04369733417958163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 664.3333333333334, 659, 673, 661.0, 673.0, 673.0, 673.0, 0.047591097292066564, 13.993362777019845, 0.027141797674381712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 922.6666666666666, 883, 949, 936.0, 949.0, 949.0, 949.0, 0.04737315836846843, 42.62645117307783, 0.026971241532047944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 155.0, 81, 262, 122.0, 262.0, 262.0, 262.0, 0.048, 0.0849375, 0.026578125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b2b0935-7a91-49d7-86c1-cd3a36de14c1", 3, 0, 0.0, 299.0, 205, 481, 211.0, 481.0, 481.0, 481.0, 0.021377722987465528, 0.02526774484618728, 0.013709021577248402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3585964d-1ba4-443a-a585-846505677e06", 3, 0, 0.0, 567.3333333333334, 219, 1002, 481.0, 1002.0, 1002.0, 1002.0, 0.02369930324048473, 0.023768734792947086, 0.015197795372316055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 3, 0, 0.0, 142.0, 86, 252, 88.0, 252.0, 252.0, 252.0, 0.01599334676774462, 0.011885680556888335, 0.00802791038927806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 3, 0, 0.0, 141.66666666666666, 84, 254, 87.0, 254.0, 254.0, 254.0, 0.0160074274463351, 0.004283237422163884, 0.009129235965487986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 3, 0, 0.0, 140.0, 86, 248, 86.0, 248.0, 248.0, 248.0, 0.01600751285936866, 0.00431452495037671, 0.00941066673958978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 3, 0, 0.0, 142.33333333333334, 85, 255, 87.0, 255.0, 255.0, 255.0, 0.0160074274463351, 0.004314501928895007, 0.009426248779433656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 97.66666666666667, 81, 128, 84.0, 128.0, 128.0, 128.0, 0.04803150866968731, 0.035695291110968794, 0.02697081785651387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b7fb38a-e7f1-42b7-adfd-fab9d13a7056", 1, 0, 0.0, 3921.0, 3921, 3921, 3921.0, 3921.0, 3921.0, 3921.0, 0.2550369803621525, 0.04607601695995919, 0.1758360431012497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 524.578947368421, 84, 1095, 772.0, 1076.0, 1095.0, 1095.0, 0.08788077816116409, 41.629787695650364, 0.04768941487590309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 157.6428571428571, 83, 756, 86.0, 505.5, 756.0, 756.0, 0.07736131602650179, 4.991493924719151, 0.0450051182799264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 387.52631578947376, 84, 768, 498.0, 760.0, 768.0, 768.0, 0.08788077816116409, 13.611149815912896, 0.047775235948326104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 167.42857142857144, 84, 670, 87.0, 479.5, 670.0, 670.0, 0.07743448489474442, 1.6456880572517394, 0.04512330404650494], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 1883.4999999999998, 89, 7930, 521.0, 6828.5, 7930.0, 7930.0, 0.08506346341967275, 0.016756363050861877, 0.057780971455132064], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 3, 0, 0.0, 341.3333333333333, 174, 508, 342.0, 508.0, 508.0, 508.0, 0.015985847196615263, 0.02477494091897307, 0.0359525450134814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cef6ad7-77f8-4d32-9731-e3efc8f21dbe", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 972.5238095238095, 164, 4290, 578.0, 2790.600000000001, 4159.0999999999985, 4290.0, 0.10610454834830586, 0.06517554776473085, 0.0479750057473297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 87.63157894736842, 82, 94, 88.0, 93.0, 94.0, 94.0, 0.08788037168771941, 0.06530953403745554, 0.044111827194812284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3585964d-1ba4-443a-a585-846505677e06", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 141.3157894736842, 82, 269, 89.0, 262.0, 269.0, 269.0, 0.08788077816116409, 0.09298487352105901, 0.04623497354326047], "isController": false}, {"data": ["login", 21, 0, 0.0, 5334.904761904761, 1423, 12533, 3236.0, 12191.0, 12513.699999999999, 12533.0, 0.09919135429262395, 17.091896398468204, 0.1731558895457036], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3ab6902b-f92d-4538-b397-b48bb6038d98", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68ec7d43-ae04-438d-a8e3-91bd7f40b8c9", 1, 0, 0.0, 4597.0, 4597, 4597, 4597.0, 4597.0, 4597.0, 4597.0, 0.2175331738090059, 0.039300426908853596, 0.14997892647378724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94075edf-5d20-4194-8797-7eb547757895", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 965.4999999999999, 89, 3058, 498.0, 2678.0, 3058.0, 3058.0, 0.07747605159905037, 0.06272231130430933, 0.027540315216849937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/149c2d93-d541-43ee-a8f5-b1f484c7043c", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/510fc5d1-cbc4-4b27-85b4-6ce9e3627d64", 3, 0, 0.0, 339.6666666666667, 245, 442, 332.0, 442.0, 442.0, 442.0, 0.08165264962848044, 0.03694569758580333, 0.05236188794534716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 614.1052631578949, 170, 1178, 864.0, 1171.0, 1178.0, 1178.0, 0.08784542903245195, 55.37694845640555, 0.18573691478762214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 345.2631578947368, 170, 1012, 181.0, 967.0, 1012.0, 1012.0, 0.10536355973559292, 20.040370013253625, 0.23270854879719177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 487.1428571428571, 86, 1078, 87.0, 1078.0, 1078.0, 1078.0, 0.07231180851833104, 37.086797736123884, 0.09725978598287244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48b874ac-6e24-4470-8232-49ec0da2b5ed", 1, 0, 0.0, 7930.0, 7930, 7930, 7930.0, 7930.0, 7930.0, 7930.0, 0.12610340479192939, 0.02278235340479193, 0.08694238650693568], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 2673.739130434783, 515, 6460, 2084.0, 5614.200000000001, 6309.799999999997, 6460.0, 0.09838057026511425, 0.031144935967081004, 0.044386546350080845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b2b0935-7a91-49d7-86c1-cd3a36de14c1", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 424.75, 86, 3297, 97.0, 2398.900000000001, 3297.0, 3297.0, 0.072482479625628, 0.05627301884997486, 0.025765256429422453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 314.0, 169, 844, 181.5, 684.0, 844.0, 844.0, 0.07732542404710223, 6.7190000562680545, 0.17249351709168034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/761f50f3-66cb-457c-906f-a37bea0e40ca", 2, 0, 0.0, 293.0, 241, 345, 293.0, 345.0, 345.0, 345.0, 0.024874693730333446, 0.02808119721900924, 0.015461662655622302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab380973-2ad0-4f34-8e10-1367623023f3", 3, 0, 0.0, 1847.0, 209, 4607, 725.0, 4607.0, 4607.0, 4607.0, 0.02340659597874681, 0.023475169990403295, 0.01501008921814167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23134d37-40f6-4b6f-9e1d-a534a5607507", 3, 0, 0.0, 3143.0, 233, 7717, 1479.0, 7717.0, 7717.0, 7717.0, 0.046755189826070694, 0.0211555058132286, 0.029982983059036218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 321.7894736842106, 169, 862, 182.0, 844.0, 862.0, 862.0, 0.10486172050488159, 13.35078448812303, 0.2330122719257579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f1501a3-216b-4f66-be8c-b2dc2ebb3050", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2792ed5e-a236-4b3c-934e-480417acc4a2", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 88.16666666666666, 84, 95, 87.5, 95.0, 95.0, 95.0, 0.05452166327420762, 0.04051854077311719, 0.027367319260686244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 114.5, 84, 252, 88.0, 252.0, 252.0, 252.0, 0.05452364508741958, 0.014589334720657193, 0.03109551633891898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 167.5, 83, 253, 167.0, 253.0, 253.0, 253.0, 0.054525131541879844, 0.014696226860897303, 0.03205481366036295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 113.33333333333333, 82, 256, 84.5, 256.0, 256.0, 256.0, 0.054524140563234375, 0.014695959761184263, 0.03210747730432649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 92.0, 89, 95, 92.0, 95.0, 95.0, 95.0, 0.04062728528479727, 0.01198187515235232, 0.02511432771999675], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 987.648148148148, 668, 1789, 919.0, 1352.5, 1430.75, 1789.0, 0.22071626515380655, 264.05338651301, 0.4358284063876922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 2673.739130434783, 515, 6460, 2084.0, 5614.200000000001, 6309.799999999997, 6460.0, 0.0953324408006267, 0.03017997106867666, 0.04301131606434525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 85.66666666666667, 82, 98, 83.0, 98.0, 98.0, 98.0, 0.030548031688491538, 0.008233649166038734, 0.01798873350406289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 88.66666666666667, 84, 95, 86.5, 95.0, 95.0, 95.0, 0.030547565104498124, 0.008233523407071761, 0.017958627141511595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 161.375, 83, 799, 86.0, 416.8000000000004, 799.0, 799.0, 0.07329866917103786, 4.140663474643242, 0.042697906406761806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 142.74999999999997, 84, 657, 86.0, 375.60000000000025, 657.0, 657.0, 0.07329833337914479, 1.3655304136545632, 0.042769291205116224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 111.3125, 83, 273, 89.0, 263.90000000000003, 273.0, 273.0, 0.07329699024233817, 0.0544716890375189, 0.036791653305236156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 89.33333333333333, 84, 104, 86.5, 104.0, 104.0, 104.0, 0.030547409579667645, 0.008173818578934507, 0.017421569525904203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 140.375, 82, 269, 88.5, 266.9, 269.0, 269.0, 0.07329967656517715, 0.02649418241082636, 0.04141897007082581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 87.33333333333333, 84, 92, 88.0, 92.0, 92.0, 92.0, 0.03054678749618165, 0.022701274691986562, 0.015333055442419306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db2b7050-6b58-4a2f-bded-03a09fa07a04", 1, 0, 0.0, 5727.0, 5727, 5727, 5727.0, 5727.0, 5727.0, 5727.0, 0.17461148943600488, 0.03154602104068448, 0.12038643705255805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 756.3333333333334, 89, 2111, 97.5, 2111.0, 2111.0, 2111.0, 0.031259117242529076, 0.02460434423581878, 0.011111639332305256], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 3168.5714285714284, 86, 10883, 610.0, 9645.5, 10883.0, 10883.0, 0.08187565427420156, 0.015808580568567935, 0.05571839307331965], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 3619.285714285715, 877, 10000, 2112.0, 8670.6, 9874.699999999999, 10000.0, 0.09763082530590991, 0.050531579504035404, 0.04490636593660505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 179.33333333333331, 170, 189, 178.5, 189.0, 189.0, 189.0, 0.030533418826906047, 0.047320835623339746, 0.06867037456871546], "isController": false}, {"data": ["addBook", 48, 5, 10.416666666666666, 2693.437499999999, 442, 13691, 1305.0, 8069.400000000001, 9920.799999999992, 13691.0, 0.25428712194656794, 108.78885452591345, 0.9174140489661639], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b7fb38a-e7f1-42b7-adfd-fab9d13a7056", 3, 0, 0.0, 1541.3333333333333, 266, 3850, 508.0, 3850.0, 3850.0, 3850.0, 0.028561092176164815, 0.02381020737733011, 0.018315544136407777], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 155.2222222222222, 84, 661, 90.0, 348.5, 366.25, 661.0, 0.22134141092852722, 0.16449298214512617, 0.10699609219689547], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 546.2037037037037, 409, 877, 505.5, 741.5, 769.5, 877.0, 0.22149938677484587, 65.12817418363119, 0.11139861737211486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d1dd77f-7bfd-4517-a2fe-6fccb308eb0f", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.2211310434516524, 0.8438838739290087], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 131.1481481481482, 82, 341, 90.0, 256.5, 265.25, 341.0, 0.22187890342515287, 0.39262165332654, 0.10790595107981066], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 830.9259259259255, 580, 1163, 826.5, 1052.0, 1087.25, 1163.0, 0.2213450400265614, 199.16665609897814, 0.11110483454458259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 321.3684210526315, 86, 2885, 103.0, 1206.0, 2885.0, 2885.0, 0.10280105830984239, 0.07679961875686467, 0.03654256369607679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 150, 5, 3.3333333333333335, 753.6066666666663, 82, 10172, 109.5, 2316.1000000000004, 4193.299999999998, 9280.520000000015, 0.6195147134744451, 1.4981487157976252, 0.29222057305111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 469.0, 86, 2355, 94.5, 2355.0, 2355.0, 2355.0, 0.05303398594599373, 0.041070264507004905, 0.018851924691739956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 857.8947368421054, 87, 3319, 151.0, 3137.0, 3319.0, 3319.0, 0.10340529979373364, 0.08391582434432876, 0.036757352661053753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d1dd77f-7bfd-4517-a2fe-6fccb308eb0f", 3, 0, 0.0, 714.0, 208, 1439, 495.0, 1439.0, 1439.0, 1439.0, 0.029817220438710705, 0.024857389825370477, 0.01912106909643883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 258.5, 169, 351, 258.5, 351.0, 351.0, 351.0, 0.05447661591261951, 0.08442811470051481, 0.12251918598316673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 307.0625, 168, 1073, 187.0, 681.0000000000005, 1073.0, 1073.0, 0.07326812470234824, 5.584838657006722, 0.1636100836401436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=510fc5d1-cbc4-4b27-85b4-6ce9e3627d64", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68ec7d43-ae04-438d-a8e3-91bd7f40b8c9", 3, 0, 0.0, 5418.333333333334, 213, 10883, 5159.0, 10883.0, 10883.0, 10883.0, 0.04190412336573919, 0.018960524569784334, 0.026872110361492906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 3, 0, 0.0, 90.66666666666667, 86, 96, 90.0, 96.0, 96.0, 96.0, 0.016174076190681577, 0.013409951841688143, 0.005749378645906342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 552.8947368421053, 85, 5118, 92.0, 2961.0, 5118.0, 5118.0, 0.09213684746502437, 0.07153202513153747, 0.03275176999733288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cef6ad7-77f8-4d32-9731-e3efc8f21dbe", 3, 0, 0.0, 422.3333333333333, 346, 482, 439.0, 482.0, 482.0, 482.0, 0.029294300305637202, 0.02381115490337763, 0.018785732943393647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f1501a3-216b-4f66-be8c-b2dc2ebb3050", 3, 0, 0.0, 2609.333333333333, 179, 5976, 1673.0, 5976.0, 5976.0, 5976.0, 0.056131422370242864, 0.03608709608763986, 0.03599573635070913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48b874ac-6e24-4470-8232-49ec0da2b5ed", 3, 0, 0.0, 2299.3333333333335, 179, 4290, 2429.0, 4290.0, 4290.0, 4290.0, 0.04047381344270257, 0.02602076222309166, 0.02595488687569143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 108.3157894736842, 84, 296, 88.0, 257.0, 296.0, 296.0, 0.10501298844857128, 0.0780418791107058, 0.05271159771734925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 140.36842105263156, 82, 261, 87.0, 260.0, 261.0, 261.0, 0.10491325330476747, 0.04465931146536206, 0.05890585830084703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 186.05263157894737, 83, 773, 86.0, 756.0, 773.0, 773.0, 0.10491383261274097, 9.962316866693172, 0.06072880257425414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 183.26315789473685, 83, 670, 88.0, 669.0, 670.0, 670.0, 0.10501589056238773, 3.275658076551057, 0.06089043284510156], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.4208754208754209], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.16835016835016836], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.16835016835016836], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.7575757575757576], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1188, 18, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 150, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
