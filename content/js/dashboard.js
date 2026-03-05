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

    var data = {"OkPercent": 96.15942028985508, "KoPercent": 3.8405797101449277};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7927509293680297, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4824561403508772, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fcf1b1f-e716-4a49-945f-2daa913e9ea2"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7cad888-209d-4300-9c43-390381d46ef6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a8c38fc-2f4d-4b8d-9553-670881609fe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3576bba3-a01f-45ae-8a9c-e72ca636423f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c92c146e-da9b-411e-87d3-aee66a897284"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe40a817-e776-473f-bded-1940c75d84a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2875deb-6e8c-437a-bbcc-0bfb1e72340a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afddf073-24e7-4031-be71-545ad0a943b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0921e6e2-9963-4a6f-a36d-758204dc15bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/79b0d69c-bcb1-462f-a381-8cd76306afee"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e01b64d-e9d5-4d4e-88f1-9ff6601ea29d"], "isController": false}, {"data": [0.7884615384615384, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.057692307692307696, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/393a9777-8022-4ae0-a57e-23a5c7b05b16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2875deb-6e8c-437a-bbcc-0bfb1e72340a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55c46c46-6b61-4510-a3c3-09a7da454d7b"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dd11649-ed84-4c90-bcea-6c489575698a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f651335-ed2f-481c-9232-610e52925e42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a8c38fc-2f4d-4b8d-9553-670881609fe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7cad888-209d-4300-9c43-390381d46ef6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4fcf1b1f-e716-4a49-945f-2daa913e9ea2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afddf073-24e7-4031-be71-545ad0a943b3"], "isController": false}, {"data": [0.2786885245901639, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79b0d69c-bcb1-462f-a381-8cd76306afee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c92c146e-da9b-411e-87d3-aee66a897284"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3576bba3-a01f-45ae-8a9c-e72ca636423f"], "isController": false}, {"data": [0.8508771929824561, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=393a9777-8022-4ae0-a57e-23a5c7b05b16"], "isController": false}, {"data": [0.8575418994413407, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/26a766d7-aa0c-458e-b892-3367df8b436c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e01b64d-e9d5-4d4e-88f1-9ff6601ea29d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dd11649-ed84-4c90-bcea-6c489575698a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1380, 53, 3.8405797101449277, 282.12826086956494, 81, 2942, 96.0, 688.5000000000005, 845.0, 1597.260000000003, 5.354773120591043, 755.4650728375253, 3.914453891959692], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1240.9649122807014, 995, 1734, 1286.0, 1457.0, 1483.3999999999996, 1734.0, 0.2557934983575365, 307.80588165876475, 1.257734633037301], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fcf1b1f-e716-4a49-945f-2daa913e9ea2", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 358.6875, 86, 950, 398.5, 670.7000000000003, 950.0, 950.0, 0.08671522719389525, 0.018762541528464273, 0.05764255001029743], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 358.6875, 86, 950, 398.5, 670.7000000000003, 950.0, 950.0, 0.08599284109597875, 0.01860623911653105, 0.05716235549171781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7cad888-209d-4300-9c43-390381d46ef6", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 123.27777777777774, 83, 254, 86.5, 253.1, 254.0, 254.0, 0.12423817839221993, 0.033243418827605724, 0.07085458611431292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a8c38fc-2f4d-4b8d-9553-670881609fe3", 3, 0, 0.0, 320.3333333333333, 184, 390, 387.0, 390.0, 390.0, 390.0, 0.08156606851549755, 0.03690652188689505, 0.0523063655519304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 89.7777777777778, 84, 137, 87.0, 96.50000000000006, 137.0, 137.0, 0.12423131871544817, 0.09232425150630474, 0.062358298652090194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 85.77777777777776, 82, 96, 85.0, 94.2, 96.0, 96.0, 0.12424075096631695, 0.03348676490889012, 0.07316130159442297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 103.83333333333333, 82, 251, 86.0, 243.8, 251.0, 251.0, 0.12423817839221993, 0.033486071519778025, 0.07303846034386366], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 166.25, 83, 242, 184.0, 239.9, 242.0, 242.0, 0.08672885848560573, 0.11274645732940163, 0.05604238432538499], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3576bba3-a01f-45ae-8a9c-e72ca636423f", 3, 0, 0.0, 309.0, 170, 449, 308.0, 449.0, 449.0, 449.0, 0.022989562738516715, 0.027172884864438213, 0.014742655792603492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c92c146e-da9b-411e-87d3-aee66a897284", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe40a817-e776-473f-bded-1940c75d84a6", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 108.27777777777779, 84, 352, 87.0, 230.5000000000002, 352.0, 352.0, 0.09920306868159122, 0.07372415553387784, 0.04979529033431434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 93.61111111111111, 82, 244, 84.5, 103.60000000000022, 244.0, 244.0, 0.09927529038022435, 0.04313132190564435, 0.055691542021024304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 548.0, 412, 597, 580.0, 595.9, 597.0, 597.0, 0.06897978892184589, 20.282348287576742, 0.03934003586949024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 722.3, 570, 757, 749.5, 756.6, 757.0, 757.0, 0.06889519662689117, 61.9920190297145, 0.03922451136081793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2875deb-6e8c-437a-bbcc-0bfb1e72340a", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 100.1, 81, 243, 85.0, 227.30000000000007, 243.0, 243.0, 0.06921277390955274, 0.12247416633213826, 0.03832386992843399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afddf073-24e7-4031-be71-545ad0a943b3", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 109.14285714285715, 83, 251, 85.5, 249.5, 251.0, 251.0, 0.1499716125162023, 0.11145351281721674, 0.07527871956379685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 145.14285714285717, 82, 259, 86.0, 256.5, 259.0, 259.0, 0.14996197392803967, 0.056214819188705724, 0.08462558378054136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 179.64285714285714, 81, 753, 84.5, 511.0, 753.0, 753.0, 0.1499667930672494, 9.676132399923945, 0.08724351661417828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0921e6e2-9963-4a6f-a36d-758204dc15bb", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 0.3875436134708738, 0.7241258343446603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 155.92857142857144, 82, 416, 88.5, 335.0, 416.0, 416.0, 0.14996358027336218, 3.1871235847187114, 0.0873880963730237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 101.8, 82, 253, 85.0, 236.40000000000006, 253.0, 253.0, 0.06921229487206107, 0.051436090232068826, 0.038864325733823354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 459.63157894736827, 82, 785, 583.0, 759.0, 785.0, 785.0, 0.0884510818963912, 41.89994487810044, 0.047998896107221335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 186.22222222222223, 82, 754, 85.0, 601.9000000000002, 754.0, 754.0, 0.09927529038022435, 9.949127015150513, 0.0574150713679032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 366.2631578947368, 84, 676, 412.0, 653.0, 676.0, 676.0, 0.08852113791593287, 13.710330009131654, 0.04812335915588106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 158.94444444444443, 83, 595, 85.0, 435.7000000000003, 595.0, 595.0, 0.09927583791564862, 3.267161793418012, 0.057512337091107646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79b0d69c-bcb1-462f-a381-8cd76306afee", 3, 0, 0.0, 430.33333333333337, 239, 709, 343.0, 709.0, 709.0, 709.0, 0.10135819987837016, 0.04586194590850733, 0.06499858520846004], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 273.0, 85, 499, 268.0, 485.7, 499.0, 499.0, 0.08620829000468758, 0.018652855716956632, 0.057516041140212394], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 315.7142857142857, 168, 839, 257.0, 679.5, 839.0, 839.0, 0.1498239568507004, 13.018579424756268, 0.3342194573162249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e01b64d-e9d5-4d4e-88f1-9ff6601ea29d", 3, 0, 0.0, 249.33333333333334, 193, 349, 206.0, 349.0, 349.0, 349.0, 0.025281680051911715, 0.025355747473938803, 0.016212535710373073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 26, 0, 0.0, 497.0384615384615, 115, 1587, 344.0, 1162.3000000000002, 1467.9999999999995, 1587.0, 0.1092037784507344, 0.06707927406788275, 0.04937631779559573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 115.05263157894737, 82, 257, 86.0, 252.0, 257.0, 257.0, 0.08852155033847846, 0.0657860349683419, 0.04443366882224407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 141.63157894736847, 81, 342, 85.0, 257.0, 342.0, 342.0, 0.0884506701302087, 0.0935878646844406, 0.046534799519573206], "isController": false}, {"data": ["login", 26, 0, 0.0, 2428.576923076924, 1271, 3656, 2269.5, 3533.1, 3626.95, 3656.0, 0.10520480543180503, 48.54802668914408, 0.22582837403950035], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/393a9777-8022-4ae0-a57e-23a5c7b05b16", 3, 0, 0.0, 332.66666666666663, 172, 592, 234.0, 592.0, 592.0, 592.0, 0.04634922596792634, 0.02979808635633285, 0.029722648163025677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 89.11111111111111, 85, 111, 88.0, 93.00000000000003, 111.0, 111.0, 0.09918994875185981, 0.08030123780790213, 0.035258927095387665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2875deb-6e8c-437a-bbcc-0bfb1e72340a", 3, 0, 0.0, 445.0, 175, 793, 367.0, 793.0, 793.0, 793.0, 0.036562180080924295, 0.030480385152098666, 0.023446450116998974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55c46c46-6b61-4510-a3c3-09a7da454d7b", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 585.157894736842, 170, 903, 678.0, 871.0, 903.0, 903.0, 0.08841568401165226, 55.73643193708293, 0.18694263945247425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dd11649-ed84-4c90-bcea-6c489575698a", 3, 0, 0.0, 257.3333333333333, 175, 368, 229.0, 368.0, 368.0, 368.0, 0.03852723233205337, 0.03211856836015257, 0.024706591046271206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f651335-ed2f-481c-9232-610e52925e42", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.7807724633251835, 1.4588745415647923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 223.16666666666666, 170, 343, 175.5, 338.5, 343.0, 343.0, 0.12415762500258662, 0.19242006921787594, 0.2792334085751533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 456.20000000000005, 83, 914, 385.0, 841.6, 910.4, 914.0, 0.13770880096946994, 82.39222457379125, 0.20088136860170483], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 934.3076923076925, 105, 1917, 920.5, 1750.4, 1894.9499999999998, 1917.0, 0.10727178958225889, 0.03332903558535327, 0.048398014440433214], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a8c38fc-2f4d-4b8d-9553-670881609fe3", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 100.71428571428571, 86, 235, 89.0, 169.0, 235.0, 235.0, 0.0854205436407456, 0.06631770722108667, 0.030364333872296284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 296.8333333333333, 169, 840, 173.0, 697.8000000000002, 840.0, 840.0, 0.09915661787793821, 13.317241614379913, 0.22018665200434084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7cad888-209d-4300-9c43-390381d46ef6", 3, 0, 0.0, 286.6666666666667, 184, 371, 305.0, 371.0, 371.0, 371.0, 0.08809537792917131, 0.039860864362483116, 0.05649345524754801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 225.06666666666666, 169, 353, 175.0, 346.4, 353.0, 353.0, 0.07876372457900789, 0.12206838955750539, 0.17714146260298355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fcf1b1f-e716-4a49-945f-2daa913e9ea2", 3, 0, 0.0, 943.3333333333333, 242, 2179, 409.0, 2179.0, 2179.0, 2179.0, 0.03015772490123345, 0.025141254385435827, 0.01933942645033525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 109.21428571428572, 84, 257, 87.0, 237.0, 257.0, 257.0, 0.06502614980167024, 0.048325097655342826, 0.03264007909966651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 115.07142857142857, 82, 330, 85.5, 293.0, 330.0, 330.0, 0.06497786111446315, 0.024357632926138736, 0.036667891770089764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 155.85714285714286, 81, 733, 85.5, 494.5, 733.0, 733.0, 0.0648343251441406, 4.183229509169426, 0.03771751337207956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 121.85714285714286, 82, 419, 86.5, 337.0, 419.0, 419.0, 0.064928740707074, 1.3799078446672632, 0.03783584680991183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 88.2, 85, 94, 87.0, 94.0, 94.0, 94.0, 0.07419608541453353, 0.02188204862811438, 0.04586535358144504], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 787.2807017543861, 650, 1275, 677.0, 1038.4, 1098.0, 1275.0, 0.2535068446848065, 303.282319482001, 0.5005769921412878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 934.3076923076925, 105, 1917, 920.5, 1750.4, 1894.9499999999998, 1917.0, 0.10550834733347943, 0.032781139165510134, 0.047602398894597164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 113.66666666666667, 84, 248, 86.0, 248.0, 248.0, 248.0, 0.05847896219335094, 0.015761907778676622, 0.0344363419947174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 141.66666666666669, 84, 251, 90.5, 251.0, 251.0, 251.0, 0.05847896219335094, 0.015761907778676622, 0.03437923363320046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 120.14285714285714, 82, 254, 85.0, 252.0, 254.0, 254.0, 0.08592488937170494, 0.023159442838467346, 0.050514436915787476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 120.35714285714283, 83, 259, 84.0, 256.5, 259.0, 259.0, 0.08592488937170494, 0.023159442838467346, 0.05059834794056453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 110.78571428571429, 83, 259, 86.0, 256.0, 259.0, 259.0, 0.08592436201161206, 0.0638558979402703, 0.043130002025359965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 86.33333333333333, 84, 93, 85.5, 93.0, 93.0, 93.0, 0.058479532163742694, 0.015647843567251463, 0.03335160818713451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 133.57142857142856, 82, 261, 86.0, 257.5, 261.0, 261.0, 0.08592436201161206, 0.022991479678888385, 0.0490037377097475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 87.5, 85, 95, 86.0, 95.0, 95.0, 95.0, 0.05847896219335094, 0.043459463114394595, 0.02935369781970936], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 325.625, 85, 709, 369.5, 627.1000000000001, 709.0, 709.0, 0.08666027547135066, 0.01801014636108087, 0.05896008854242833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 121.83333333333334, 87, 257, 94.5, 257.0, 257.0, 257.0, 0.05717226001943857, 0.04500082185123778, 0.020322951803784805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 26, 0, 0.0, 1321.538461538462, 779, 2942, 1235.0, 1917.6000000000001, 2654.999999999999, 2942.0, 0.10731030839331704, 0.055541468211384795, 0.04935855005200422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 230.16666666666669, 170, 338, 182.0, 338.0, 338.0, 338.0, 0.058429417263945155, 0.09055418476355562, 0.13140912886607978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afddf073-24e7-4031-be71-545ad0a943b3", 3, 0, 0.0, 244.33333333333334, 175, 371, 187.0, 371.0, 371.0, 371.0, 0.02354825036499788, 0.02783323472503493, 0.01510092878224148], "isController": false}, {"data": ["addBook", 61, 23, 37.704918032786885, 834.4098360655739, 431, 3060, 649.0, 1387.6000000000004, 1552.1, 3060.0, 0.27646845540246556, 77.05408750538207, 1.004172166764866], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79b0d69c-bcb1-462f-a381-8cd76306afee", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 156.68421052631572, 83, 395, 87.0, 343.2, 345.29999999999995, 395.0, 0.2543461964088102, 0.18902095260459428, 0.12295055392808696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c92c146e-da9b-411e-87d3-aee66a897284", 3, 0, 0.0, 259.0, 181, 408, 188.0, 408.0, 408.0, 408.0, 0.063299151791366, 0.02864121777018188, 0.04059222950162468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3576bba3-a01f-45ae-8a9c-e72ca636423f", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 475.8771929824561, 401, 683, 421.0, 596.4000000000001, 667.6999999999999, 683.0, 0.2541704011879122, 74.73453720084814, 0.1278298404411863], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 129.61403508771937, 83, 351, 87.0, 255.2, 345.59999999999997, 351.0, 0.25473835689290714, 0.45076748309565207, 0.12388642747330834], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 623.157894736842, 564, 845, 587.0, 750.0, 758.4, 845.0, 0.2539925851989163, 228.54297463332605, 0.1274923718674248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 90.0, 86, 97, 89.0, 96.4, 97.0, 97.0, 0.07787555486332841, 0.05817851510785764, 0.027682326142823767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=393a9777-8022-4ae0-a57e-23a5c7b05b16", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 23, 12.849162011173185, 153.89944134078212, 83, 2050, 90.0, 278.0, 347.0, 1605.1999999999937, 0.7428125622468628, 1.6449949242870658, 0.3549246410949638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 142.14285714285714, 85, 260, 88.5, 259.0, 260.0, 260.0, 0.06912999896305001, 0.05353524333759635, 0.024573554318896684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26a766d7-aa0c-458e-b892-3367df8b436c", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.41364758743523317, 0.772901149611399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 90.8888888888889, 85, 106, 89.0, 104.2, 106.0, 106.0, 0.12350846376055825, 0.10023001307131241, 0.04390339922738594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 272.42857142857144, 170, 821, 176.0, 704.0, 821.0, 821.0, 0.06480521404236408, 5.631087603630481, 0.14456408657050807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 281.42857142857144, 169, 515, 260.0, 511.0, 515.0, 515.0, 0.08588008686157357, 0.13309736118097387, 0.19314632816621477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 91.21428571428571, 86, 108, 90.5, 102.5, 108.0, 108.0, 0.1544912822776429, 0.1280889635290223, 0.054916822997130875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 94.94736842105263, 84, 152, 91.0, 106.0, 152.0, 152.0, 0.08754671077792164, 0.06796839362153097, 0.031120119846839336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e01b64d-e9d5-4d4e-88f1-9ff6601ea29d", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 91.2, 83, 167, 86.0, 120.80000000000003, 167.0, 167.0, 0.07879930866739862, 0.05856081435145542, 0.039553559233440325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 110.53333333333333, 83, 270, 85.0, 258.6, 270.0, 270.0, 0.07880013658690341, 0.021085192797667518, 0.044940702897218354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 130.40000000000003, 83, 269, 85.0, 260.0, 269.0, 269.0, 0.07880013658690341, 0.021239099314438813, 0.04632586154816002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dd11649-ed84-4c90-bcea-6c489575698a", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 87.33333333333333, 82, 114, 85.0, 101.4, 114.0, 114.0, 0.07879972262497636, 0.02123898773876316, 0.046402571037949945], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 18.867924528301888, 0.7246376811594203], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 9.433962264150944, 0.36231884057971014], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.433962264150944, 0.36231884057971014], "isController": false}, {"data": ["401/Unauthorized", 33, 62.264150943396224, 2.391304347826087], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1380, 53, "401/Unauthorized", 33, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 23, "401/Unauthorized", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
