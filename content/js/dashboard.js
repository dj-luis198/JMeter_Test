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

    var data = {"OkPercent": 98.04753820033956, "KoPercent": 1.9524617996604414};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7092430858806404, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5eb85833-26d6-45b6-a684-b5623d9f31b7"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/26ec0e92-5c7f-469e-bb7a-b6e8937cac14"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b700faf-f3e1-4878-b80c-08ec0727f443"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36b0a1d5-05ac-4086-90cf-5990e7a831fb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12ac08db-c519-47d3-9734-b3f55865e043"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abadcc34-a03b-47bb-85f4-fa076b45d2a5"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7286178f-5d2b-4297-a179-9e7dc854afcc"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/131c9b76-056f-45be-bb82-df65750a4d83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b3a9ba1-73e2-483d-bb30-4c5836064ee9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5653688-ae3a-445b-beb3-30732c803f51"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5eb85833-26d6-45b6-a684-b5623d9f31b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3f0ca56-b236-46ee-9d38-e2245f5ed064"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d388b47-29a3-4e91-9982-0b14a2f0872c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd6d694a-b3fe-4408-9830-41ff59e53cad"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3f0ca56-b236-46ee-9d38-e2245f5ed064"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2980769230769231, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26ec0e92-5c7f-469e-bb7a-b6e8937cac14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/3dfb8cf7-398e-4b61-ba79-aa8e289c84bc"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12ac08db-c519-47d3-9734-b3f55865e043"], "isController": false}, {"data": [0.23, 500, 1500, "addBook"], "isController": true}, {"data": [0.8942307692307693, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.40384615384615385, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8519736842105263, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=131c9b76-056f-45be-bb82-df65750a4d83"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b3a9ba1-73e2-483d-bb30-4c5836064ee9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b700faf-f3e1-4878-b80c-08ec0727f443"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abadcc34-a03b-47bb-85f4-fa076b45d2a5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7286178f-5d2b-4297-a179-9e7dc854afcc"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cff2e956-9e47-4898-8830-1abb5971e4ae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd6d694a-b3fe-4408-9830-41ff59e53cad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5653688-ae3a-445b-beb3-30732c803f51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1178, 23, 1.9524617996604414, 866.4431239388799, 126, 41022, 236.5, 1435.700000000001, 1761.8499999999983, 16479.080000000016, 4.608637478629301, 667.6132886924556, 3.3650711529320403], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 5374.0192307692305, 1576, 25056, 2358.5, 21989.100000000002, 23957.999999999996, 25056.0, 0.23550404659356983, 283.3901067566451, 1.157971557225219], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5eb85833-26d6-45b6-a684-b5623d9f31b7", 1, 0, 0.0, 10569.0, 10569, 10569, 10569.0, 10569.0, 10569.0, 10569.0, 0.0946163307786924, 0.017093770697322357, 0.06523352493140315], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 3174.4615384615386, 137, 34926, 519.0, 21375.599999999988, 34926.0, 34926.0, 0.06826332841487301, 0.013532671550995332, 0.04589519150489133], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 3174.4615384615386, 137, 34926, 519.0, 21375.599999999988, 34926.0, 34926.0, 0.0682203412066604, 0.013524149672804749, 0.0458662900991294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 220.375, 128, 432, 138.0, 425.0, 432.0, 432.0, 0.12593070662867756, 0.04551767850677665, 0.07115884289357281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 153.4375, 127, 419, 135.0, 226.5000000000002, 419.0, 419.0, 0.12594161032091497, 0.09359527876388309, 0.06321678486811552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 241.25, 127, 1047, 135.0, 594.1000000000005, 1047.0, 1047.0, 0.1259316977954082, 2.346077399785916, 0.07348065374292619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 259.31250000000006, 127, 1566, 136.5, 761.7000000000008, 1566.0, 1566.0, 0.12594061899814238, 7.1144227713429995, 0.07336287034413275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26ec0e92-5c7f-469e-bb7a-b6e8937cac14", 3, 0, 0.0, 1344.3333333333333, 463, 2918, 652.0, 2918.0, 2918.0, 2918.0, 0.07278196948009412, 0.03293194582595405, 0.046673333292898904], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 969.8666666666667, 133, 10582, 278.0, 4510.600000000004, 10582.0, 10582.0, 0.07451601846010164, 0.1247415613713928, 0.04816373901509694], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 163.26666666666665, 133, 514, 137.0, 292.0000000000001, 514.0, 514.0, 0.07567960283344433, 0.056242361090088996, 0.03798761314100624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b700faf-f3e1-4878-b80c-08ec0727f443", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 170.66666666666669, 128, 418, 135.0, 395.2, 418.0, 418.0, 0.07568342129428741, 0.04298581818823981, 0.04189195623984581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 975.2, 787, 1193, 1013.0, 1193.0, 1193.0, 1193.0, 0.028715003589375447, 8.443164483129936, 0.016376525484565686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1362.2, 1133, 1679, 1278.0, 1679.0, 1679.0, 1679.0, 0.028604446275129005, 25.738331039614298, 0.016285539236718955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 428.0, 395, 498, 421.0, 498.0, 498.0, 498.0, 0.028775487888397146, 0.05091912505251527, 0.01593330237570428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 160.16666666666666, 130, 397, 139.0, 322.90000000000026, 397.0, 397.0, 0.06896274287816008, 0.05125063215847638, 0.034616064296263946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 181.41666666666666, 129, 403, 138.0, 401.8, 403.0, 403.0, 0.0689671026920159, 0.01845408802501207, 0.03933280075404032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 226.0, 133, 427, 141.0, 421.90000000000003, 427.0, 427.0, 0.06886340942740075, 0.018560840822229106, 0.040484152807905516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 155.50000000000003, 127, 396, 133.0, 321.0000000000002, 396.0, 396.0, 0.06886340942740075, 0.018560840822229106, 0.04055140223117446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 190.2, 129, 400, 141.0, 400.0, 400.0, 400.0, 0.028820437148390665, 0.021418313154223923, 0.016183350937817025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 820.4444444444445, 132, 1595, 800.0, 1578.8, 1595.0, 1595.0, 0.08767230042374945, 39.45566022873947, 0.047774554332472845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 387.53333333333336, 132, 1443, 141.0, 1284.0, 1443.0, 1443.0, 0.07557398441160615, 13.61661644408029, 0.043130309072404914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 561.8333333333334, 127, 1267, 571.0, 1199.5, 1267.0, 1267.0, 0.08767230042374945, 12.901098871827967, 0.04786017181335541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 336.00000000000006, 134, 1121, 142.0, 1077.8, 1121.0, 1121.0, 0.07558236209998036, 4.461042252429973, 0.04320890114582861], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 1284.846153846154, 138, 10569, 453.0, 6709.7999999999965, 10569.0, 10569.0, 0.06807851023272377, 0.013496032790276296, 0.046190287291313185], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/36b0a1d5-05ac-4086-90cf-5990e7a831fb", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.6882240032327586, 1.2859476023706895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12ac08db-c519-47d3-9734-b3f55865e043", 3, 0, 0.0, 494.0, 223, 988, 271.0, 988.0, 988.0, 988.0, 0.09480769838510887, 0.042898014568782984, 0.06079790553992984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 390.4166666666667, 267, 801, 285.0, 730.5000000000002, 801.0, 801.0, 0.0688061558574107, 0.1066361028766707, 0.15474665716759461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abadcc34-a03b-47bb-85f4-fa076b45d2a5", 3, 0, 0.0, 360.3333333333333, 257, 481, 343.0, 481.0, 481.0, 481.0, 0.03951267698386566, 0.03294009301942707, 0.025338533091866976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1686.9999999999998, 193, 12214, 592.0, 9407.000000000018, 12115.499999999998, 12214.0, 0.09413536665725314, 0.05782338440176974, 0.0425631589475666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 151.16666666666669, 128, 400, 136.0, 173.20000000000036, 400.0, 400.0, 0.08766973835453643, 0.06515299891386934, 0.04400609913499191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 207.16666666666663, 127, 404, 135.0, 401.3, 404.0, 404.0, 0.0876714463840399, 0.08929816267436876, 0.046318605950942955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7286178f-5d2b-4297-a179-9e7dc854afcc", 3, 0, 0.0, 471.33333333333337, 264, 781, 369.0, 781.0, 781.0, 781.0, 0.02971326697370376, 0.024480559476056058, 0.01905440622988164], "isController": false}, {"data": ["login", 20, 0, 0.0, 5623.6, 1928, 42674, 3042.0, 15189.800000000023, 41355.54999999998, 42674.0, 0.08416622830089426, 25.28843782877433, 0.1618802603892688], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/131c9b76-056f-45be-bb82-df65750a4d83", 2, 0, 0.0, 5451.0, 320, 10582, 5451.0, 10582.0, 10582.0, 10582.0, 0.013728060842765654, 0.02714777656894575, 0.008533115943769862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 164.86666666666667, 137, 432, 146.0, 268.80000000000007, 432.0, 432.0, 0.07195210867646494, 0.058250291106239686, 0.02557672613108715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b3a9ba1-73e2-483d-bb30-4c5836064ee9", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5653688-ae3a-445b-beb3-30732c803f51", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 974.1111111111111, 262, 1732, 1075.0, 1716.7, 1732.0, 1732.0, 0.08761255779995133, 52.47543026740083, 0.1858344487709905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5eb85833-26d6-45b6-a684-b5623d9f31b7", 3, 0, 0.0, 13826.666666666666, 227, 41022, 231.0, 41022.0, 41022.0, 41022.0, 0.03101576634789351, 0.019657453476350478, 0.01988966787283536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3f0ca56-b236-46ee-9d38-e2245f5ed064", 3, 0, 0.0, 523.0, 248, 921, 400.0, 921.0, 921.0, 921.0, 0.06409982479381222, 0.02900350145292936, 0.04110568191530276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d388b47-29a3-4e91-9982-0b14a2f0872c", 2, 0, 0.0, 280.5, 278, 283, 280.5, 283.0, 283.0, 283.0, 0.01662717712100428, 0.019046561291931663, 0.010335154528827368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd6d694a-b3fe-4408-9830-41ff59e53cad", 3, 0, 0.0, 602.3333333333334, 321, 1042, 444.0, 1042.0, 1042.0, 1042.0, 0.0364334118675767, 0.03037303639090622, 0.023363874146850937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 923.1111111111112, 133, 2079, 1262.0, 2079.0, 2079.0, 2079.0, 0.05144356355280682, 34.197443790761874, 0.07959350832242539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 501.0625, 267, 1701, 408.0, 1106.0000000000007, 1701.0, 1701.0, 0.12580000943500072, 9.589064256777474, 0.28091547517022314], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 2898.285714285714, 285, 37674, 1141.0, 1956.4, 34107.19999999995, 37674.0, 0.08842365880257523, 0.02792845473340267, 0.039894267936318124], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3f0ca56-b236-46ee-9d38-e2245f5ed064", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 592.8, 277, 1957, 287.0, 1571.2000000000003, 1957.0, 1957.0, 0.07551957467375543, 18.16316570505075, 0.16598081519604882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 676.2, 137, 5185, 145.5, 4709.000000000002, 5185.0, 5185.0, 0.05677527777304651, 0.04407846272419137, 0.020181837020887623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 609.8421052631579, 262, 1567, 556.0, 903.0, 1567.0, 1567.0, 0.12189645217168153, 7.854264070218772, 0.2725064857734009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 239.99999999999997, 128, 438, 149.0, 434.8, 438.0, 438.0, 0.053190717736203055, 0.03952942988012746, 0.026699246988680047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 229.72727272727275, 127, 403, 141.0, 402.0, 403.0, 403.0, 0.053125981019535876, 0.014215350389992996, 0.03029841105020405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 231.9090909090909, 129, 419, 141.0, 414.6, 419.0, 419.0, 0.053120593405319785, 0.0143176599412776, 0.03122909885742433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 183.54545454545456, 127, 402, 141.0, 397.8, 402.0, 402.0, 0.05319174657517686, 0.014336837944090639, 0.03132287420393715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 142.5, 138, 147, 142.5, 147.0, 147.0, 147.0, 0.40314452731304173, 0.11889613989115097, 0.24920945877847206], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1528.5192307692303, 1023, 2929, 1430.5, 2151.3, 2274.0999999999985, 2929.0, 0.25725254284244276, 307.76347669390907, 0.5079732828392766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 2898.285714285714, 285, 37674, 1141.0, 1956.4, 34107.19999999995, 37674.0, 0.0845325550971118, 0.026699456576431517, 0.038138711381704736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 1.8981073943661972, 4.146952024647888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 1.9965277777777777, 4.35474537037037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 164.20000000000002, 128, 400, 141.0, 374.7000000000001, 400.0, 400.0, 0.055566668889333426, 0.01497695372407815, 0.03266712370251828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 133.60000000000002, 128, 139, 134.0, 138.6, 139.0, 139.0, 0.055570374322041434, 0.01497795245398773, 0.03272357003534276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 1.967486213235294, 4.193474264705882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 137.5, 131, 143, 137.0, 143.0, 143.0, 143.0, 0.055567903978661924, 0.04129606926539231, 0.027892483051789284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26ec0e92-5c7f-469e-bb7a-b6e8937cac14", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 5.464441636029411, 3.690831801470588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 160.0, 128, 378, 135.5, 354.6000000000001, 378.0, 378.0, 0.055495127527803056, 0.014849282170525427, 0.03164956491820018], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 4016.1666666666665, 135, 41022, 716.5, 29042.100000000042, 41022.0, 41022.0, 0.06393453104021482, 0.012476807082880462, 0.04350753162095348], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 5.543023767605634, 2.5033010563380285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dfb8cf7-398e-4b61-ba79-aa8e289c84bc", 1, 0, 0.0, 24805.0, 24805, 24805, 24805.0, 24805.0, 24805.0, 24805.0, 0.04031445273130418, 0.012873853557750455, 0.024054815057448095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1946.5999999999997, 1043, 5655, 1492.5, 4238.700000000004, 5595.699999999999, 5655.0, 0.10158936562520636, 0.05258043338023376, 0.046727139853000185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 5.554855510752688, 8.06101590501792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12ac08db-c519-47d3-9734-b3f55865e043", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["addBook", 50, 10, 20.0, 3848.6600000000008, 691, 35969, 1142.5, 3373.999999999999, 32415.049999999992, 35969.0, 0.23698254860512072, 80.32653084801835, 0.8593764811409288], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 247.53846153846158, 134, 577, 143.0, 549.7, 571.4499999999999, 577.0, 0.25894995792063186, 0.1924423027125008, 0.12517600504952417], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 835.1538461538461, 628, 1205, 793.0, 1083.2, 1163.85, 1205.0, 0.25881334083228397, 76.09971561639881, 0.13016491262561156], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 210.50000000000003, 127, 549, 140.5, 415.00000000000006, 466.0999999999994, 549.0, 0.25955356786327516, 0.4592881493830612, 0.12622819999600687], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1279.3846153846157, 887, 2351, 1258.5, 1600.9, 1718.4499999999991, 2351.0, 0.25801073721606416, 232.15851488151353, 0.12950929582915718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 1634.842105263158, 134, 17646, 144.0, 10394.0, 17646.0, 17646.0, 0.12268354103441595, 0.09165323133918771, 0.04361016497707755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 152, 10, 6.578947368421052, 1212.8618421052631, 128, 24577, 147.0, 571.5000000000005, 13475.24999999999, 23007.139999999996, 0.6307760620484453, 1.433835429695443, 0.2998018061152079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 3524.545454545455, 135, 21436, 151.0, 19397.800000000007, 21436.0, 21436.0, 0.052650220652288374, 0.04077307126686004, 0.018715508122493132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 762.6875, 134, 10065, 143.5, 3123.100000000007, 10065.0, 10065.0, 0.11574492711686621, 0.09392972112706621, 0.04114370456107353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 499.4545454545455, 266, 841, 292.0, 837.6, 841.0, 841.0, 0.0530829106807642, 0.08226814379919217, 0.11938471025175776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=131c9b76-056f-45be-bb82-df65750a4d83", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.19723150927947597, 0.7526780840611353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 327.5, 267, 532, 282.5, 530.4, 532.0, 532.0, 0.0554511226079772, 0.08593840974498029, 0.12471087438102685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b3a9ba1-73e2-483d-bb30-4c5836064ee9", 3, 0, 0.0, 536.3333333333333, 242, 1089, 278.0, 1089.0, 1089.0, 1089.0, 0.05320092214931725, 0.0342030668114914, 0.03411647676893066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b700faf-f3e1-4878-b80c-08ec0727f443", 3, 0, 0.0, 366.0, 252, 485, 361.0, 485.0, 485.0, 485.0, 0.02012247882109104, 0.027740461525820496, 0.012904063566910597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 1879.3333333333335, 135, 11025, 146.0, 10737.6, 11025.0, 11025.0, 0.06891680019296703, 0.05713902672248928, 0.024497768818593755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abadcc34-a03b-47bb-85f4-fa076b45d2a5", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.23221601863753213, 0.8861865359897172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7286178f-5d2b-4297-a179-9e7dc854afcc", 1, 0, 0.0, 810.0, 810, 810, 810.0, 810.0, 810.0, 810.0, 1.2345679012345678, 0.22304205246913578, 0.8511766975308641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 1906.5, 135, 19088, 145.5, 13547.60000000001, 19088.0, 19088.0, 0.08394269512013133, 0.06517035412158634, 0.029839004905984182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cff2e956-9e47-4898-8830-1abb5971e4ae", 2, 0, 0.0, 425.0, 397, 453, 425.0, 453.0, 453.0, 453.0, 0.01299460723799623, 0.022207580728997468, 0.00807721436228965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd6d694a-b3fe-4408-9830-41ff59e53cad", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 0.19616076275787186, 0.7485918838219326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5653688-ae3a-445b-beb3-30732c803f51", 3, 0, 0.0, 359.6666666666667, 229, 461, 389.0, 461.0, 461.0, 461.0, 0.06390320794103864, 0.028914537447279856, 0.040979596238231164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 222.68421052631578, 128, 467, 136.0, 418.0, 467.0, 467.0, 0.1222328729228453, 0.09083907841238797, 0.061355172541350096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 231.68421052631578, 126, 420, 139.0, 402.0, 420.0, 420.0, 0.12223995058932523, 0.042371824978125486, 0.0691746430915127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 272.9473684210526, 126, 1435, 134.0, 424.0, 1435.0, 1435.0, 0.12245029484742048, 5.830266621419135, 0.07143353446331326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 329.94736842105266, 128, 1252, 385.0, 531.0, 1252.0, 1252.0, 0.12221714770907174, 1.9225707130727319, 0.07141687666038427], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.4244482173174873], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1697792869269949], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.1697792869269949], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.1884550084889642], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1178, 23, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 152, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
