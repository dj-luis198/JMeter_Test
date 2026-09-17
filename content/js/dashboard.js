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

    var data = {"OkPercent": 97.74774774774775, "KoPercent": 2.2522522522522523};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7623216601815823, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.034482758620689655, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa7e22c5-baaa-406a-8070-c63d2758662e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0b84d80c-d226-4655-be2c-14e184a351a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc6f70e3-60ee-482a-8472-ea6180ae3e3a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=becd1078-60c8-49e2-99ae-7289f62d4acf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/19d897a6-6136-45b4-9503-0b6757de8d9e"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dab5f8b2-8ff2-49db-ae3a-2d0331acc3e9"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91b8fda4-cbce-45bf-a0c2-81a811a2741d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ec3ca19-f4bb-4184-b8ca-94b4b6aad2da"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5d4f70c-082e-48bb-8340-35e3cf890f14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5df971c-05b8-49cc-b4df-776ffae9b76c"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0230ce83-18b7-4497-96ae-014b56047ddc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2a6cbfb-a6aa-48a2-90f1-835482765e10"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00472452-168c-4280-8e84-c0b13443966c"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19d897a6-6136-45b4-9503-0b6757de8d9e"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/becd1078-60c8-49e2-99ae-7289f62d4acf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91b8fda4-cbce-45bf-a0c2-81a811a2741d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dab5f8b2-8ff2-49db-ae3a-2d0331acc3e9"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ff8e022-dc73-4f20-bd3b-77faabc36052"], "isController": false}, {"data": [0.24166666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b84d80c-d226-4655-be2c-14e184a351a0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa7e22c5-baaa-406a-8070-c63d2758662e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ec3ca19-f4bb-4184-b8ca-94b4b6aad2da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5d4f70c-082e-48bb-8340-35e3cf890f14"], "isController": false}, {"data": [0.46551724137931033, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8932584269662921, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5df971c-05b8-49cc-b4df-776ffae9b76c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0230ce83-18b7-4497-96ae-014b56047ddc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00472452-168c-4280-8e84-c0b13443966c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 30, 2.2522522522522523, 391.51201201201167, 101, 2516, 122.0, 1127.2000000000003, 1319.35, 1855.0200000000004, 5.175026224795058, 728.4600452802654, 3.795845585735654], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1855.4310344827586, 1254, 2576, 1778.0, 2328.0, 2375.3999999999996, 2576.0, 0.25426998211342194, 305.97298648587923, 1.2502435155674603], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fa7e22c5-baaa-406a-8070-c63d2758662e", 3, 0, 0.0, 698.0, 359, 1288, 447.0, 1288.0, 1288.0, 1288.0, 0.01969343880263892, 0.02714899522434109, 0.012628930482161026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b84d80c-d226-4655-be2c-14e184a351a0", 3, 0, 0.0, 790.3333333333334, 242, 1157, 972.0, 1157.0, 1157.0, 1157.0, 0.0253318471982977, 0.025406061594386464, 0.01624470669942919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc6f70e3-60ee-482a-8472-ea6180ae3e3a", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=becd1078-60c8-49e2-99ae-7289f62d4acf", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19d897a6-6136-45b4-9503-0b6757de8d9e", 3, 0, 0.0, 1081.0, 311, 2449, 483.0, 2449.0, 2449.0, 2449.0, 0.03936904543187843, 0.02531050284113278, 0.025246425618750165], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 717.3076923076924, 113, 1312, 748.0, 1246.0, 1312.0, 1312.0, 0.09015131551573488, 0.01787179399384197, 0.060611048217084365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 717.3076923076924, 113, 1312, 748.0, 1246.0, 1312.0, 1312.0, 0.09440950485845837, 0.018715946763932664, 0.06347393843774056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 151.94444444444443, 102, 440, 110.0, 342.8000000000002, 440.0, 440.0, 0.08742532420224391, 0.030688034265870127, 0.04945184625285347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 124.94444444444443, 103, 330, 113.0, 141.9000000000003, 330.0, 330.0, 0.08742022904100008, 0.06496757255879011, 0.04388085715534575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 205.0555555555556, 103, 868, 112.0, 476.5000000000006, 868.0, 868.0, 0.0874287213063794, 1.4504193391117242, 0.051066493792560785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dab5f8b2-8ff2-49db-ae3a-2d0331acc3e9", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 179.38888888888889, 103, 942, 109.5, 390.30000000000086, 942.0, 942.0, 0.0874265980853575, 4.39262211340444, 0.05097987609708238], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 268.30769230769226, 108, 397, 257.0, 394.2, 397.0, 397.0, 0.08940422400572187, 0.16778738944823837, 0.05778500175369824], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 111.44999999999999, 106, 120, 111.0, 115.80000000000001, 119.8, 120.0, 0.09325530972419742, 0.0693039948243303, 0.046809794138903786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 132.35000000000002, 107, 345, 109.0, 294.9000000000004, 343.4, 345.0, 0.09325487489858533, 0.024952964572473025, 0.05318442084059944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 822.3333333333334, 639, 982, 841.0, 982.0, 982.0, 982.0, 0.13217314682233727, 38.86329372728274, 0.07537999779711421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1035.6666666666665, 955, 1188, 1000.5, 1188.0, 1188.0, 1188.0, 0.13157317661506074, 118.38977559920619, 0.07490933785798869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 220.0, 107, 333, 219.5, 333.0, 333.0, 333.0, 0.1333926189417519, 0.2360424077367719, 0.0738609520898177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 127.30769230769229, 107, 330, 110.0, 244.39999999999992, 330.0, 330.0, 0.06460140930459068, 0.0480094457820249, 0.03242687927984336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 127.6153846153846, 107, 319, 110.0, 243.79999999999993, 319.0, 319.0, 0.06460076725834343, 0.01728575217654893, 0.036842625077023995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 161.23076923076925, 104, 334, 112.0, 332.4, 334.0, 334.0, 0.06460237239789099, 0.017412358185369053, 0.03797912908547888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 161.0769230769231, 102, 336, 112.0, 332.0, 336.0, 336.0, 0.0646030144760447, 0.017412531245496424, 0.03804259543853023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91b8fda4-cbce-45bf-a0c2-81a811a2741d", 3, 0, 0.0, 673.6666666666667, 390, 1220, 411.0, 1220.0, 1220.0, 1220.0, 0.029581131182456418, 0.02466057192652047, 0.018969670712708053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 109.83333333333333, 107, 113, 109.5, 113.0, 113.0, 113.0, 0.13405424728540147, 0.09962429900799856, 0.07527460174717368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 723.6842105263158, 106, 1327, 1066.0, 1320.0, 1327.0, 1327.0, 0.08334137504496048, 39.47943818866294, 0.04522606073831685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 130.45, 105, 324, 109.5, 299.6000000000004, 323.8, 324.0, 0.09316365126982057, 0.025110515381318827, 0.05477003717229686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 461.42105263157885, 102, 903, 637.0, 874.0, 903.0, 903.0, 0.08334210618661612, 12.908191267940484, 0.04530784627548514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 130.14999999999998, 103, 330, 110.0, 295.8000000000004, 329.3, 330.0, 0.09316625518237295, 0.02511121721712396, 0.05486255065915126], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 683.7692307692307, 110, 1421, 563.0, 1386.6, 1421.0, 1421.0, 0.09479433275727547, 0.018792235888405194, 0.06431658754985817], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ec3ca19-f4bb-4184-b8ca-94b4b6aad2da", 3, 0, 0.0, 380.6666666666667, 328, 437, 377.0, 437.0, 437.0, 437.0, 0.053526504540831805, 0.03329724940674791, 0.034325264956197477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 309.8461538461538, 219, 667, 224.0, 579.3999999999999, 667.0, 667.0, 0.06456483302540875, 0.10006288087043327, 0.14520782271241828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5d4f70c-082e-48bb-8340-35e3cf890f14", 3, 0, 0.0, 315.3333333333333, 228, 410, 308.0, 410.0, 410.0, 410.0, 0.03296848213108269, 0.027484467037012617, 0.021141897720778936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5df971c-05b8-49cc-b4df-776ffae9b76c", 3, 0, 0.0, 430.3333333333333, 397, 494, 400.0, 494.0, 494.0, 494.0, 0.021488432060740633, 0.02539859922283504, 0.013780016653534845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 736.8499999999998, 115, 1660, 827.0, 1282.5, 1641.3499999999997, 1660.0, 0.10393875928303044, 0.06384519491115835, 0.04699574760551083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 121.00000000000001, 103, 307, 112.0, 116.0, 307.0, 307.0, 0.08333918169696118, 0.06193468483533932, 0.04183236268773247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0230ce83-18b7-4497-96ae-014b56047ddc", 3, 0, 0.0, 386.3333333333333, 335, 488, 336.0, 488.0, 488.0, 488.0, 0.02302131774022745, 0.023088763007044523, 0.014763019514403671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 228.68421052631578, 102, 440, 319.0, 349.0, 440.0, 440.0, 0.08334137504496048, 0.08818182291712358, 0.04384674727385976], "isController": false}, {"data": ["login", 20, 0, 0.0, 3105.1000000000004, 1777, 4291, 3099.5, 4146.3, 4284.7, 4291.0, 0.10389448476127645, 37.428992583881815, 0.2084383100523109], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c2a6cbfb-a6aa-48a2-90f1-835482765e10", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 151.0, 109, 605, 115.0, 316.90000000000043, 591.5999999999998, 605.0, 0.09271492478501726, 0.07505925063162043, 0.032957258419674104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00472452-168c-4280-8e84-c0b13443966c", 3, 0, 0.0, 459.6666666666667, 204, 670, 505.0, 670.0, 670.0, 670.0, 0.04475607936744741, 0.028773846598537968, 0.028701001417275846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 851.8421052631579, 216, 1441, 1179.0, 1431.0, 1441.0, 1441.0, 0.08329935596445309, 52.511145912796536, 0.17612487696904333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 360.72222222222223, 213, 1059, 228.5, 700.8000000000005, 1059.0, 1059.0, 0.08737355105527833, 5.935063665890822, 0.1952632006873386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 800.4444444444447, 108, 1302, 1066.0, 1302.0, 1302.0, 1302.0, 0.09384090837999312, 74.8526037919547, 0.16161489776554372], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1215.0476190476193, 432, 1805, 1256.0, 1750.6, 1799.8999999999999, 1805.0, 0.0856269113149847, 0.026758409785932722, 0.038632454128440366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 129.5625, 108, 335, 115.5, 190.10000000000014, 335.0, 335.0, 0.08224867888059549, 0.06385517549811856, 0.029236835070836673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 278.25, 216, 456, 225.5, 443.6, 455.4, 456.0, 0.09311463808668043, 0.14430950258160335, 0.20941700343127442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19d897a6-6136-45b4-9503-0b6757de8d9e", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 403.75, 219, 1272, 327.0, 836.6000000000005, 1272.0, 1272.0, 0.08224783328364194, 6.269313983995086, 0.18366206228731224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/becd1078-60c8-49e2-99ae-7289f62d4acf", 3, 0, 0.0, 556.3333333333333, 219, 1116, 334.0, 1116.0, 1116.0, 1116.0, 0.04365922519428355, 0.028068675051663418, 0.02799761511482376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 112.33333333333333, 102, 128, 113.0, 128.0, 128.0, 128.0, 0.06040025233883199, 0.04488729690415151, 0.030318095412265277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 155.0, 101, 323, 110.0, 323.0, 323.0, 323.0, 0.06031605613414291, 0.01613925720776871, 0.03439900076400338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 170.88888888888889, 102, 447, 111.0, 447.0, 447.0, 447.0, 0.060308376833542184, 0.016254992193415665, 0.03545472934940663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 131.22222222222223, 107, 306, 110.0, 306.0, 306.0, 306.0, 0.0603970096769431, 0.016278881514488572, 0.03556581722187177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91b8fda4-cbce-45bf-a0c2-81a811a2741d", 1, 0, 0.0, 714.0, 714, 714, 714.0, 714.0, 714.0, 714.0, 1.4005602240896358, 0.253030899859944, 0.9656206232492998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 112.5, 110, 115, 112.5, 115.0, 115.0, 115.0, 0.10846575193882532, 0.03198892293508325, 0.0670496298606215], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1304.8103448275858, 817, 2085, 1244.0, 1857.4, 1927.7499999999995, 2085.0, 0.2585234743772036, 309.28395265677443, 0.5104828761627985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1215.0476190476193, 432, 1805, 1256.0, 1750.6, 1799.8999999999999, 1805.0, 0.0830745495183654, 0.025960796724489192, 0.03748090027098127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 143.14285714285714, 104, 337, 111.0, 337.0, 337.0, 337.0, 0.05521680484014735, 0.014882654429570966, 0.03251536456895396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 145.0, 108, 340, 112.0, 340.0, 340.0, 340.0, 0.05521767596690095, 0.01488288922545377, 0.03246195403522888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 244.875, 103, 1233, 110.0, 1171.4, 1233.0, 1233.0, 0.08025521157280151, 9.045649932410063, 0.046319169960474305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 235.125, 108, 1010, 110.0, 830.1000000000001, 1010.0, 1010.0, 0.08025561413100726, 2.968654382959727, 0.04639777691948857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 136.9375, 103, 335, 110.0, 321.7, 335.0, 335.0, 0.08025521157280151, 0.059642789069240185, 0.04028435424650388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 112.57142857142857, 105, 122, 112.0, 122.0, 122.0, 122.0, 0.05521898270856999, 0.014775391857566579, 0.03149207607598132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 163.62500000000003, 102, 338, 111.5, 333.1, 338.0, 338.0, 0.0802576269826142, 0.036543084551410025, 0.04492937955838241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 143.42857142857142, 107, 338, 111.0, 338.0, 338.0, 338.0, 0.05521332060797754, 0.041032555647139556, 0.027714498820801223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 143.57142857142858, 109, 326, 114.0, 326.0, 326.0, 326.0, 0.051972350709422584, 0.040907924484174414, 0.018474546541240058], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 609.75, 109, 1220, 491.0, 1188.8000000000002, 1220.0, 1220.0, 0.09268985972934561, 0.01741706429972811, 0.06308311335583637], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1580.05, 782, 2516, 1467.5, 2266.1000000000004, 2504.0, 2516.0, 0.10251836360188019, 0.0530612624111294, 0.04715444263328669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dab5f8b2-8ff2-49db-ae3a-2d0331acc3e9", 3, 0, 0.0, 389.6666666666667, 257, 636, 276.0, 636.0, 636.0, 636.0, 0.023867867485599718, 0.02393779287862394, 0.015305891584189926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 290.14285714285717, 218, 679, 228.0, 679.0, 679.0, 679.0, 0.05516502222362324, 0.08549501002821297, 0.12406742791113703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ff8e022-dc73-4f20-bd3b-77faabc36052", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["addBook", 60, 16, 26.666666666666668, 1097.6666666666667, 546, 2132, 911.0, 1972.4, 2023.95, 2132.0, 0.27427819122675495, 77.64271412126982, 0.9976333506280971], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 218.2758620689655, 107, 519, 115.0, 448.0, 466.5, 519.0, 0.25936045289701154, 0.19274736782678298, 0.1253744376797077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b84d80c-d226-4655-be2c-14e184a351a0", 1, 0, 0.0, 1154.0, 1154, 1154, 1154.0, 1154.0, 1154.0, 1154.0, 0.8665511265164644, 0.15655464688041595, 0.5974463821490469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa7e22c5-baaa-406a-8070-c63d2758662e", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ec3ca19-f4bb-4184-b8ca-94b4b6aad2da", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 698.4482758620685, 525, 1073, 647.5, 887.5, 967.5999999999999, 1073.0, 0.2591935505494456, 76.2115098973951, 0.13035613137984817], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 178.25862068965517, 102, 435, 115.0, 333.2, 349.19999999999993, 435.0, 0.25981588908549286, 0.4597523349833135, 0.1263557741841557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5d4f70c-082e-48bb-8340-35e3cf890f14", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1084.5344827586207, 703, 1641, 1072.0, 1411.8000000000002, 1531.2499999999998, 1641.0, 0.2591055497728359, 233.14362914457195, 0.13005884041331803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 115.625, 107, 128, 115.5, 124.5, 128.0, 128.0, 0.08660070579575224, 0.06469681634155318, 0.030783844638333804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 16, 8.98876404494382, 183.0337078651686, 105, 949, 116.0, 361.99999999999994, 463.5999999999998, 892.1200000000006, 0.7487296833462327, 1.6281847301208063, 0.3581638350943904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 162.77777777777777, 112, 332, 114.0, 332.0, 332.0, 332.0, 0.060548977395048435, 0.04688997956472013, 0.021523269308396126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5df971c-05b8-49cc-b4df-776ffae9b76c", 1, 0, 0.0, 1335.0, 1335, 1335, 1335.0, 1335.0, 1335.0, 1335.0, 0.7490636704119851, 0.13532888576779026, 0.5164442883895132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 115.94444444444446, 108, 137, 115.0, 124.40000000000002, 137.0, 137.0, 0.08655011251514627, 0.07023744482430327, 0.030765860308118398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 286.3333333333333, 213, 561, 229.0, 561.0, 561.0, 561.0, 0.06026718451802993, 0.09340236506847022, 0.13554231049318646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 412.99999999999994, 214, 1550, 226.5, 1343.5000000000002, 1550.0, 1550.0, 0.08021015059455774, 12.103674517861798, 0.17782919373759248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 118.15384615384615, 109, 136, 117.0, 132.8, 136.0, 136.0, 0.06592994182950518, 0.05466261778637684, 0.023436034009706917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 117.52631578947368, 109, 133, 115.0, 130.0, 133.0, 133.0, 0.08224680968953994, 0.06385372431951587, 0.02923617063182865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0230ce83-18b7-4497-96ae-014b56047ddc", 1, 0, 0.0, 1421.0, 1421, 1421, 1421.0, 1421.0, 1421.0, 1421.0, 0.7037297677691766, 0.127138678747361, 0.4851886875439831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 123.625, 105, 315, 111.0, 175.70000000000016, 315.0, 315.0, 0.0822947902254363, 0.061158530626520526, 0.0413081271248772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00472452-168c-4280-8e84-c0b13443966c", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 177.8125, 106, 334, 111.0, 331.2, 334.0, 334.0, 0.0822947902254363, 0.02974546800018516, 0.046501780267766676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 257.0, 103, 1162, 113.0, 585.9000000000005, 1162.0, 1162.0, 0.08229563678820705, 4.648904833132738, 0.04793881576578662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 176.74999999999997, 104, 636, 109.5, 502.3000000000001, 636.0, 636.0, 0.08229648336839505, 1.5331637950766128, 0.04801967657482036], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5255255255255256], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.666666666666667, 0.15015015015015015], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.3333333333333335, 0.07507507507507508], "isController": false}, {"data": ["401/Unauthorized", 20, 66.66666666666667, 1.5015015015015014], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 30, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
