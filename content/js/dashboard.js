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

    var data = {"OkPercent": 99.22057677318784, "KoPercent": 0.779423226812159};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.811662198391421, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5a52fbd-0793-42b2-9631-68e0e9ff00af"], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/674ced38-ba2d-4ace-b757-1442bda091e8"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a30d5b3-c05f-4cea-ac4c-de0624259319"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73b2b05e-ff76-4cf1-b156-d386ceb09779"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2604b7cc-2cf5-41d6-a745-182c0fb017f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffd38ac3-4795-4206-9f44-50476ddbb800"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93e8b5c1-a50c-4497-92ce-5e1e35a26f6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c736d5c3-1835-4a38-8dbe-20e50bcb61ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39a792d0-410d-4deb-a911-d2afc871c742"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ce7d875-20da-4ca6-9c3f-8d9a9ba599f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df7fd925-6ac7-46ad-ae4c-7660810d5003"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff3ce282-a247-4781-89c0-7e778e7c2b73"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=674ced38-ba2d-4ace-b757-1442bda091e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cacf186d-307c-4df6-ba80-edfb5e07a2ab"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21c0ae70-ad7b-4068-b823-913fed76166d"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffd38ac3-4795-4206-9f44-50476ddbb800"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93e8b5c1-a50c-4497-92ce-5e1e35a26f6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a872e1a0-c5be-409d-b8aa-4d869ae5fac4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ce7d875-20da-4ca6-9c3f-8d9a9ba599f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4eeb5f9-a046-4291-a7c0-80bb6e05d7fb"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df7fd925-6ac7-46ad-ae4c-7660810d5003"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cacf186d-307c-4df6-ba80-edfb5e07a2ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a30d5b3-c05f-4cea-ac4c-de0624259319"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2547ebd9-b1d6-466f-89f0-781860dac721"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ad773ad2-8ac3-45eb-8a92-f2bf44d3b89b"], "isController": false}, {"data": [0.4067796610169492, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/73b2b05e-ff76-4cf1-b156-d386ceb09779"], "isController": false}, {"data": [0.5818181818181818, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.953757225433526, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5a52fbd-0793-42b2-9631-68e0e9ff00af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2604b7cc-2cf5-41d6-a745-182c0fb017f5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c736d5c3-1835-4a38-8dbe-20e50bcb61ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad773ad2-8ac3-45eb-8a92-f2bf44d3b89b"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72bf7a52-2321-4818-8f73-54666e5be358"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21c0ae70-ad7b-4068-b823-913fed76166d"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 10, 0.779423226812159, 327.8246297739673, 98, 2153, 122.0, 814.0, 1008.5999999999999, 1405.6800000000019, 5.17257366785062, 726.8402725982608, 3.7670290445756516], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/c5a52fbd-0793-42b2-9631-68e0e9ff00af", 3, 0, 0.0, 326.6666666666667, 206, 435, 339.0, 435.0, 435.0, 435.0, 0.08091487754881864, 0.03661187493257093, 0.051888772386449455], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1516.181818181818, 1202, 2225, 1554.0, 1771.0, 1859.7999999999997, 2225.0, 0.25107391159459325, 302.1245088009965, 1.2345284617956807], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/674ced38-ba2d-4ace-b757-1442bda091e8", 3, 0, 0.0, 697.0, 192, 1202, 697.0, 1202.0, 1202.0, 1202.0, 0.040304162076470425, 0.03359992157481796, 0.02584609351909074], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 511.3846153846154, 367, 966, 416.0, 962.8, 966.0, 966.0, 0.06975371572678006, 0.012601989657670225, 0.04741072865804582], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 511.3846153846154, 367, 966, 416.0, 962.8, 966.0, 966.0, 0.06884353453297605, 0.012437552625586493, 0.04679208987788216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 165.56249999999997, 100, 313, 104.5, 307.4, 313.0, 313.0, 0.11024446710580713, 0.05019676053523689, 0.06171644606289447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 116.62500000000001, 101, 309, 103.5, 169.70000000000016, 309.0, 309.0, 0.11024370749588308, 0.08192916152770217, 0.05533717348914444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a30d5b3-c05f-4cea-ac4c-de0624259319", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 203.625, 101, 694, 105.0, 558.2000000000002, 694.0, 694.0, 0.11023915005615306, 4.077745084022902, 0.06373200862621349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 241.375, 98, 925, 103.5, 909.6, 925.0, 925.0, 0.11024674599838764, 12.426027555657381, 0.06362873719242881], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 300.61538461538464, 181, 1099, 206.0, 816.9999999999998, 1099.0, 1099.0, 0.0699402280051433, 0.13464229440262976, 0.04521526458926256], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73b2b05e-ff76-4cf1-b156-d386ceb09779", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2604b7cc-2cf5-41d6-a745-182c0fb017f5", 3, 0, 0.0, 291.0, 201, 370, 302.0, 370.0, 370.0, 370.0, 0.020695078710282692, 0.02446088242091031, 0.013271258157310192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 121.33333333333333, 101, 313, 104.0, 250.90000000000023, 313.0, 313.0, 0.09868258745744314, 0.07333735259288499, 0.04953403315734938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 171.08333333333334, 101, 311, 105.0, 309.5, 311.0, 311.0, 0.0985229763791164, 0.05102540866509577, 0.05480981986715818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 670.3333333333334, 505, 808, 698.0, 808.0, 808.0, 808.0, 0.029917129551143333, 8.796629430228268, 0.017062112947136433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 872.6666666666666, 710, 1022, 886.0, 1022.0, 1022.0, 1022.0, 0.029853419709227693, 26.86215953107741, 0.016996624697734126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 240.33333333333334, 114, 304, 303.0, 304.0, 304.0, 304.0, 0.030125926372235948, 0.05330876815087064, 0.01668105493462674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 104.0, 101, 107, 104.0, 106.8, 107.0, 107.0, 0.056973859357438456, 0.0423409247763776, 0.028598206747776724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 140.0, 99, 309, 104.0, 308.2, 309.0, 309.0, 0.05697533485958169, 0.01524535327297401, 0.03249374566210519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffd38ac3-4795-4206-9f44-50476ddbb800", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 120.63636363636363, 99, 308, 103.0, 267.20000000000016, 308.0, 308.0, 0.05697562996918136, 0.015356712765130915, 0.033495438712350764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 103.0909090909091, 100, 105, 103.0, 105.0, 105.0, 105.0, 0.05697533485958169, 0.01535663322387163, 0.03355090519563258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 104.33333333333333, 103, 106, 104.0, 106.0, 106.0, 106.0, 0.030128951914192743, 0.022390754303418633, 0.016918112647129713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 220.66666666666669, 100, 714, 102.5, 711.9, 714.0, 714.0, 0.0985229763791164, 14.797320405955713, 0.05650959777994893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 24, 0, 0.0, 430.4166666666666, 100, 1018, 204.0, 965.5, 1016.25, 1018.0, 0.13177400757700544, 49.425086562482846, 0.07275023334980509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 221.41666666666666, 99, 702, 103.5, 644.1000000000001, 702.0, 702.0, 0.09868664522973429, 4.858357679465777, 0.05669984662450554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 24, 0, 0.0, 360.3333333333333, 99, 831, 206.0, 721.5, 804.5, 831.0, 0.13177473109718935, 16.16494610276233, 0.07287931905407706], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 454.6153846153846, 195, 625, 474.0, 623.0, 625.0, 625.0, 0.06900468701066387, 0.012466667086887517, 0.04757549709914912], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/93e8b5c1-a50c-4497-92ce-5e1e35a26f6d", 3, 0, 0.0, 305.3333333333333, 206, 387, 323.0, 387.0, 387.0, 387.0, 0.02361591082632072, 0.023685098065069705, 0.01514431781505593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 246.0, 205, 414, 210.0, 413.4, 414.0, 414.0, 0.05694348100676074, 0.08825127378684501, 0.12806722339704102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 542.5000000000001, 156, 1229, 471.0, 1028.1999999999998, 1204.0999999999997, 1229.0, 0.10050159432074626, 0.061733889480224034, 0.045441638838384306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 24, 0, 0.0, 113.08333333333334, 98, 302, 104.0, 114.5, 256.25, 302.0, 0.13177617816139287, 0.0979313199031445, 0.06614546442866791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 24, 0, 0.0, 180.0, 98, 327, 104.0, 316.0, 325.25, 327.0, 0.13177617816139287, 0.11772777375128343, 0.0705422932898472], "isController": false}, {"data": ["login", 22, 0, 0.0, 2346.7727272727275, 1287, 3233, 2349.0, 3137.6, 3225.7999999999997, 3233.0, 0.10018853660980208, 16.485617216887686, 0.17381786065596166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 108.83333333333334, 105, 127, 106.0, 124.30000000000001, 127.0, 127.0, 0.09509243777388604, 0.07698401456499172, 0.03380238998993605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c736d5c3-1835-4a38-8dbe-20e50bcb61ec", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39a792d0-410d-4deb-a911-d2afc871c742", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ce7d875-20da-4ca6-9c3f-8d9a9ba599f1", 3, 0, 0.0, 390.6666666666667, 194, 537, 441.0, 537.0, 537.0, 537.0, 0.04134452391780708, 0.0344672284353854, 0.02651325264260415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df7fd925-6ac7-46ad-ae4c-7660810d5003", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff3ce282-a247-4781-89c0-7e778e7c2b73", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=674ced38-ba2d-4ace-b757-1442bda091e8", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cacf186d-307c-4df6-ba80-edfb5e07a2ab", 2, 0, 0.0, 215.0, 213, 217, 215.0, 217.0, 217.0, 217.0, 0.02404192912439294, 0.03423157486656729, 0.014944031140308699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 24, 0, 0.0, 563.0416666666667, 207, 1128, 415.0, 1070.0, 1125.25, 1128.0, 0.131699527527945, 65.76840543768142, 0.282155091284235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21c0ae70-ad7b-4068-b823-913fed76166d", 3, 0, 0.0, 313.0, 192, 431, 316.0, 431.0, 431.0, 431.0, 0.04448266658758637, 0.02859806852554788, 0.02852566835206548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 399.4375, 205, 1027, 311.0, 1014.4, 1027.0, 1027.0, 0.11016173119160567, 16.623354136400877, 0.24423307640404568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 977.6666666666666, 814, 1129, 990.0, 1129.0, 1129.0, 1129.0, 0.02982255579303146, 35.67814472637805, 0.06724636848252895], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1001.727272727273, 380, 2091, 911.0, 1813.2999999999997, 2061.45, 2091.0, 0.0961172980553723, 0.030702240625286713, 0.043365421583576175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 413.25, 206, 818, 412.5, 815.6, 818.0, 818.0, 0.09843488532335859, 19.754186430545985, 0.21718478278701972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 108.87500000000001, 103, 122, 108.0, 118.5, 122.0, 122.0, 0.07065265389031175, 0.05485240219023227, 0.025114810562571754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffd38ac3-4795-4206-9f44-50476ddbb800", 3, 0, 0.0, 320.3333333333333, 191, 411, 359.0, 411.0, 411.0, 411.0, 0.06518055012384304, 0.04190481331204102, 0.04179872517707382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 431.7894736842105, 205, 1002, 407.0, 998.0, 1002.0, 1002.0, 0.11753643629525153, 14.964503947909709, 0.26117664218506426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93e8b5c1-a50c-4497-92ce-5e1e35a26f6d", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a872e1a0-c5be-409d-b8aa-4d869ae5fac4", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 123.0, 102, 307, 104.0, 268.0000000000001, 307.0, 307.0, 0.05368262830148164, 0.039895000134206576, 0.026946163034142153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 121.27272727272727, 100, 304, 103.0, 265.0000000000001, 304.0, 304.0, 0.05368367625815016, 0.021694610646937104, 0.030206599797954165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 211.81818181818184, 101, 902, 104.0, 782.2000000000005, 902.0, 902.0, 0.053683938253710296, 4.40450881789188, 0.031140878244828044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 177.9090909090909, 99, 716, 104.0, 634.4000000000003, 716.0, 716.0, 0.053684724255734506, 1.4481625945583212, 0.031193760675939482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ce7d875-20da-4ca6-9c3f-8d9a9ba599f1", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4eeb5f9-a046-4291-a7c0-80bb6e05d7fb", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.6867439516129031, 1.283182123655914], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 969.1454545454543, 783, 1796, 820.0, 1335.8, 1433.7999999999997, 1796.0, 0.24617202501107774, 294.50732515631927, 0.4860935884496086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1001.727272727273, 380, 2091, 911.0, 1813.2999999999997, 2061.45, 2091.0, 0.10050021698910487, 0.03210225326054681, 0.045342871336881294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df7fd925-6ac7-46ad-ae4c-7660810d5003", 3, 0, 0.0, 338.6666666666667, 207, 536, 273.0, 536.0, 536.0, 536.0, 0.04658529768005217, 0.02994985772073667, 0.02987403529612721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 102.6, 101, 105, 102.0, 105.0, 105.0, 105.0, 0.029244554663921576, 0.007882321374260112, 0.017221158654633507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 102.8, 101, 105, 102.0, 105.0, 105.0, 105.0, 0.029244383616126524, 0.007882275271534102, 0.01719249896182438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 141.25000000000003, 99, 314, 104.0, 306.3, 314.0, 314.0, 0.07067824611932254, 0.019049996024348658, 0.04155107828499236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 153.25000000000006, 100, 311, 103.5, 306.1, 311.0, 311.0, 0.0706798072208258, 0.019050416789988207, 0.04162101929116988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 117.875, 102, 301, 104.5, 175.70000000000013, 301.0, 301.0, 0.0707391802213252, 0.052570816551199696, 0.03550775257203238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 101.8, 101, 103, 102.0, 103.0, 103.0, 103.0, 0.02924506781931227, 0.007825340412589418, 0.01667882774070153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 129.06249999999997, 100, 313, 103.0, 311.6, 313.0, 313.0, 0.07074074401577518, 0.018928675644846096, 0.040344330571496785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 102.4, 99, 104, 103.0, 104.0, 104.0, 104.0, 0.029244383616126524, 0.021733374933469024, 0.014679309744813508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 111.4, 108, 124, 108.0, 124.0, 124.0, 124.0, 0.029424399889364256, 0.02316022100666757, 0.010459454648172451], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 493.58333333333337, 370, 734, 433.0, 722.9000000000001, 734.0, 734.0, 0.08191797280323303, 0.014799633758396592, 0.05575862016001311], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1255.0909090909092, 784, 2153, 1196.0, 1750.3, 2101.0999999999995, 2153.0, 0.09939504560877206, 0.05144470134047773, 0.045717838361066056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cacf186d-307c-4df6-ba80-edfb5e07a2ab", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 207.0, 205, 211, 206.0, 211.0, 211.0, 211.0, 0.029226263889781914, 0.04529500077449599, 0.06573055247867944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a30d5b3-c05f-4cea-ac4c-de0624259319", 3, 0, 0.0, 476.6666666666667, 394, 549, 487.0, 549.0, 549.0, 549.0, 0.034753999606121334, 0.028248937830887038, 0.022286907299498386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2547ebd9-b1d6-466f-89f0-781860dac721", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.816715952685422, 1.526035006393862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad773ad2-8ac3-45eb-8a92-f2bf44d3b89b", 3, 0, 0.0, 696.0, 255, 1099, 734.0, 1099.0, 1099.0, 1099.0, 0.039615989013165716, 0.02464393066541656, 0.025404784621073064], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 987.7796610169494, 536, 1643, 869.0, 1491.0, 1612.0, 1643.0, 0.2928126892115894, 102.06907719646739, 1.062381393800808], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 190.25454545454548, 98, 733, 105.0, 421.0, 437.5999999999998, 733.0, 0.2469468390804598, 0.18352201615256825, 0.11937371615705819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73b2b05e-ff76-4cf1-b156-d386ceb09779", 3, 0, 0.0, 748.3333333333334, 191, 1634, 420.0, 1634.0, 1634.0, 1634.0, 0.017756942964699197, 0.02447937938004593, 0.011387102096503066], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 582.090909090909, 484, 822, 513.0, 722.4, 741.9999999999997, 822.0, 0.24724434934277956, 72.69804799181397, 0.12434652335110497], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 147.1090909090909, 99, 403, 105.0, 308.8, 314.2, 403.0, 0.24769307675332922, 0.43830063972366456, 0.12046010959292769], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 775.8181818181818, 673, 1041, 708.0, 994.8, 1009.9999999999999, 1041.0, 0.24702780634816546, 222.27605438064515, 0.1239963793583565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 121.68421052631577, 102, 312, 107.0, 138.0, 312.0, 312.0, 0.11694682612468994, 0.08736750193885527, 0.041570942099010876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, 4.046242774566474, 169.3410404624278, 102, 1069, 111.0, 304.79999999999995, 330.19999999999993, 1020.1599999999994, 0.7404015287365668, 1.5942798565311547, 0.35664256260244714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 130.72727272727272, 103, 311, 107.0, 277.60000000000014, 311.0, 311.0, 0.05349309939017867, 0.041425808414464534, 0.019015125173852575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5a52fbd-0793-42b2-9631-68e0e9ff00af", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 0.5699181782334385, 2.1749309936908516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2604b7cc-2cf5-41d6-a745-182c0fb017f5", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c736d5c3-1835-4a38-8dbe-20e50bcb61ec", 3, 0, 0.0, 656.6666666666666, 181, 1373, 416.0, 1373.0, 1373.0, 1373.0, 0.084158554717087, 0.038079554380452775, 0.053968864841361125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 107.4375, 104, 113, 106.5, 113.0, 113.0, 113.0, 0.11041869388487471, 0.08960735802571376, 0.03925039509188906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad773ad2-8ac3-45eb-8a92-f2bf44d3b89b", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 355.6363636363637, 208, 1004, 213.0, 926.2000000000003, 1004.0, 1004.0, 0.053655657501304806, 5.911125271936628, 0.11942480373004376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 299.5625, 204, 614, 217.5, 477.5000000000001, 614.0, 614.0, 0.07064454315057, 0.10948524412104943, 0.15888123327711207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72bf7a52-2321-4818-8f73-54666e5be358", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 127.90909090909092, 103, 334, 107.0, 290.20000000000016, 334.0, 334.0, 0.058017795640226376, 0.048102645018117375, 0.02062351329398672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 24, 0, 0.0, 128.16666666666666, 104, 308, 108.0, 228.0, 304.5, 308.0, 0.13243498270068038, 0.10281817504593838, 0.04707649775688248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 146.94736842105263, 100, 319, 104.0, 310.0, 319.0, 319.0, 0.1177681083962463, 0.08752102586869476, 0.059114070034834564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 177.05263157894737, 100, 318, 103.0, 312.0, 318.0, 318.0, 0.11761283094084075, 0.05006524803927031, 0.06603631605662748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21c0ae70-ad7b-4068-b823-913fed76166d", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 249.6315789473684, 100, 896, 106.0, 689.0, 896.0, 896.0, 0.11762448074982511, 11.16928358565848, 0.06808629225969008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 199.00000000000003, 101, 698, 104.0, 515.0, 698.0, 698.0, 0.11777029833076098, 3.6734938573491767, 0.06828570803193434], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 30.0, 0.2338269680436477], "isController": false}, {"data": ["401/Unauthorized", 7, 70.0, 0.5455962587685113], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 10, "401/Unauthorized", 7, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
