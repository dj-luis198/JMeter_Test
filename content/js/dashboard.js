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

    var data = {"OkPercent": 98.12792511700468, "KoPercent": 1.8720748829953198};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.732706514439221, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/887af5c2-d03d-442b-9b9b-980e11842bc8"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6103158-fb37-44fa-93e2-60e7154af2dc"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9a49c463-c8ec-4b5e-ae07-d32e3bfd892d"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d96a3221-c304-4767-94b5-3d7c400b9cf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82927bb7-657d-4246-84ab-00038e2773cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d96a3221-c304-4767-94b5-3d7c400b9cf5"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33e33eb4-16ca-4d84-8295-17c7a94ec1ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6103158-fb37-44fa-93e2-60e7154af2dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7bf484f4-fff9-4cc3-863b-64ca71108060"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab3a5354-a886-440f-a4af-61e0fba773dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9418604651162791, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bf484f4-fff9-4cc3-863b-64ca71108060"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1571314f-0b2b-4b45-ac2b-5cd20d7c0b62"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c9aed2f-e8f2-4ebf-a133-774097bf980c"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2630ec1a-5612-4183-9915-dfc12be4dc05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab3a5354-a886-440f-a4af-61e0fba773dd"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b419c37b-5c72-4e5c-b477-72ad3b073831"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a791c342-3347-4e21-a978-e7d923876e1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/33e33eb4-16ca-4d84-8295-17c7a94ec1ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1571314f-0b2b-4b45-ac2b-5cd20d7c0b62"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b419c37b-5c72-4e5c-b477-72ad3b073831"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82927bb7-657d-4246-84ab-00038e2773cd"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a49c463-c8ec-4b5e-ae07-d32e3bfd892d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c9aed2f-e8f2-4ebf-a133-774097bf980c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2630ec1a-5612-4183-9915-dfc12be4dc05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 24, 1.8720748829953198, 482.64040561622454, 137, 3778, 164.5, 1317.0, 1624.6999999999998, 2223.17, 4.968356760569384, 689.402062611662, 3.6445647213728476], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2411.796296296295, 1931, 3263, 2356.0, 2843.5, 3075.75, 3263.0, 0.22910382221543396, 275.6884400813955, 1.1265017039596779], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 455.89473684210526, 287, 984, 307.0, 876.0, 984.0, 984.0, 0.09810502400991376, 0.15204362607786442, 0.22064049833479632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 185.5, 142, 448, 153.0, 435.40000000000003, 448.0, 448.0, 0.11458399643516456, 0.08895925504487873, 0.0407310299828124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/887af5c2-d03d-442b-9b9b-980e11842bc8", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 533.2857142857142, 289, 877, 582.5, 864.5, 877.0, 877.0, 0.13026163980795713, 0.20188009997580855, 0.2929614809352786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6103158-fb37-44fa-93e2-60e7154af2dc", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 218.36363636363635, 147, 622, 150.0, 582.6000000000001, 622.0, 622.0, 0.0563008306931656, 0.04184075406005763, 0.028260377906530385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 168.45454545454547, 141, 408, 145.0, 355.8000000000002, 408.0, 408.0, 0.05630371246205897, 0.015065641811136874, 0.032110711013518006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 195.18181818181816, 138, 432, 144.0, 431.4, 432.0, 432.0, 0.056304000655173825, 0.01517568767658982, 0.03310059413517055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 199.0, 140, 441, 148.0, 438.2, 441.0, 441.0, 0.05630515345713642, 0.0151759983927438, 0.033156257358059826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 178.5, 145, 212, 178.5, 212.0, 212.0, 212.0, 0.17028522775649213, 0.050220838654746705, 0.10526420817369093], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1620.1666666666665, 1118, 2647, 1480.5, 2246.5, 2457.25, 2647.0, 0.22824391666560997, 273.0590747562228, 0.4506925776346322], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 749.1538461538462, 146, 2852, 515.0, 2225.5999999999995, 2852.0, 2852.0, 0.0900339358681349, 0.017848524395733777, 0.06053213086086295], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 749.1538461538462, 146, 2852, 515.0, 2225.5999999999995, 2852.0, 2852.0, 0.09164804331427523, 0.01816850858671667, 0.06161733681360903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a49c463-c8ec-4b5e-ae07-d32e3bfd892d", 3, 0, 0.0, 348.0, 251, 541, 252.0, 541.0, 541.0, 541.0, 0.023148505378169416, 0.02736074968363709, 0.014844581899412027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1242.2727272727275, 320, 2319, 1264.5, 2174.1, 2304.6, 2319.0, 0.08550197431831609, 0.026628278223424433, 0.03857608606939652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d96a3221-c304-4767-94b5-3d7c400b9cf5", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 165.6666666666667, 139, 432, 147.0, 267.6000000000001, 432.0, 432.0, 0.07489215529637323, 0.027538469603770568, 0.04229261426046493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 216.625, 137, 430, 149.0, 430.0, 430.0, 430.0, 0.045216133116295895, 0.012187160879001627, 0.026626297137818774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 165.39999999999998, 139, 430, 148.0, 262.6000000000001, 430.0, 430.0, 0.07488916403722491, 0.055654935383132965, 0.03759084991712266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82927bb7-657d-4246-84ab-00038e2773cd", 3, 0, 0.0, 537.6666666666666, 261, 888, 464.0, 888.0, 888.0, 888.0, 0.020933494288644976, 0.024742681563173795, 0.013424148355674024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 181.75, 137, 428, 148.0, 428.0, 428.0, 428.0, 0.04514468872737122, 0.012167904383549276, 0.026540139271364723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 260.53333333333336, 138, 1152, 148.0, 802.8000000000002, 1152.0, 1152.0, 0.07488916403722491, 1.486832690742701, 0.04367071889853018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 283.6, 137, 1630, 148.0, 911.2000000000005, 1630.0, 1630.0, 0.0748910335461903, 4.511312017576926, 0.04359867330534073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 270.1111111111111, 139, 1524, 144.5, 551.1000000000015, 1524.0, 1524.0, 0.11210971804405911, 5.632789533078595, 0.06537300615980618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d96a3221-c304-4767-94b5-3d7c400b9cf5", 3, 0, 0.0, 544.3333333333334, 235, 879, 519.0, 879.0, 879.0, 879.0, 0.019508515467001344, 0.02689406347745791, 0.012510343577471567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 283.16666666666663, 137, 1172, 147.5, 516.8000000000011, 1172.0, 1172.0, 0.1121125111333952, 1.8599168771371448, 0.06548411972993341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 217.25, 137, 443, 148.5, 443.0, 443.0, 443.0, 0.045217155388754496, 0.012099121656756574, 0.025787908932649047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 164.05555555555554, 141, 419, 150.0, 182.30000000000038, 419.0, 419.0, 0.11210483047258414, 0.08331228123987942, 0.05627136998330884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 179.625, 139, 411, 149.5, 411.0, 411.0, 411.0, 0.04521817770743839, 0.033604524643906855, 0.022697405607054036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 194.05555555555557, 138, 443, 147.0, 435.8, 443.0, 443.0, 0.11210552867098895, 0.03935127878153747, 0.06341212250020242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 154.375, 146, 166, 151.5, 166.0, 166.0, 166.0, 0.044548886834690216, 0.03506484647339875, 0.01583573711701879], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 554.6153846153846, 143, 986, 487.0, 946.8, 986.0, 986.0, 0.09125880998511779, 0.017707444876168814, 0.062102881584674134], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1464.35, 884, 2342, 1315.5, 2090.1, 2329.5, 2342.0, 0.08781481611577506, 0.04545102787242263, 0.040391385147002], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 300.46153846153845, 142, 695, 257.0, 597.8, 695.0, 695.0, 0.09087858620882501, 0.2082247414329456, 0.05873793237235054], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 436.875, 288, 855, 302.5, 855.0, 855.0, 855.0, 0.045109051131109454, 0.06991021889167061, 0.10145131323725105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33e33eb4-16ca-4d84-8295-17c7a94ec1ab", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6103158-fb37-44fa-93e2-60e7154af2dc", 3, 0, 0.0, 426.6666666666667, 308, 498, 474.0, 498.0, 498.0, 498.0, 0.02063713721632535, 0.024392397536613722, 0.013234101665416973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bf484f4-fff9-4cc3-863b-64ca71108060", 3, 0, 0.0, 384.3333333333333, 294, 445, 414.0, 445.0, 445.0, 445.0, 0.023096999699739003, 0.02316466669104683, 0.014811552541824816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 176.52631578947367, 137, 445, 149.0, 414.0, 445.0, 445.0, 0.09818106655642828, 0.07296464028265812, 0.04928229317383216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 225.5263157894737, 139, 453, 150.0, 444.0, 453.0, 453.0, 0.09817700797817369, 0.02627001971290976, 0.05599157486255219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 947.4285714285713, 740, 1173, 822.0, 1173.0, 1173.0, 1173.0, 0.09437014667817084, 27.747956507158648, 0.0538204742773943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1511.857142857143, 1145, 1843, 1548.0, 1843.0, 1843.0, 1843.0, 0.09308510638297873, 83.75814234956782, 0.05299669630984042], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1332.322033898305, 744, 3154, 1128.0, 2395.0, 2504.0, 3154.0, 0.2614854144322221, 69.92828315851114, 0.9535587430861484], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 360.85714285714283, 143, 486, 432.0, 486.0, 486.0, 486.0, 0.09486508829229288, 0.1678667382672214, 0.05252783697434577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab3a5354-a886-440f-a4af-61e0fba773dd", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 148.0, 141, 156, 150.0, 156.0, 156.0, 156.0, 0.04911108928396032, 0.03649759662606816, 0.024651464738237892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 180.44444444444446, 139, 445, 149.0, 445.0, 445.0, 445.0, 0.04911135727421053, 0.021337008954637474, 0.02755053354032861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 273.6666666666667, 139, 1317, 145.0, 1317.0, 1317.0, 1317.0, 0.049111625267385516, 4.921847076289453, 0.02840331626249618], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 257.4074074074074, 138, 609, 150.0, 600.5, 605.0, 609.0, 0.2299065898040685, 0.17085831527431264, 0.11113648628224015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 258.8888888888889, 140, 1183, 143.0, 1183.0, 1183.0, 1183.0, 0.04911323328785812, 1.6163135231923602, 0.028452208390177352], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 903.9444444444446, 677, 1478, 864.5, 1158.5, 1212.25, 1478.0, 0.22941041523285155, 67.45427922115164, 0.11537730844230329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 227.28571428571428, 140, 426, 150.0, 426.0, 426.0, 426.0, 0.09487537441888834, 0.07050796868434962, 0.05327474637779374], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 219.83333333333334, 138, 600, 149.5, 443.5, 445.25, 600.0, 0.2303862382620345, 0.4076756481746157, 0.11204330727977849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 176.05263157894737, 137, 430, 146.0, 426.0, 430.0, 430.0, 0.09817751528210533, 0.026461908415879958, 0.05771764082014396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 911.8421052631577, 138, 1908, 1136.0, 1774.0, 1908.0, 1908.0, 0.0850298275684602, 40.27927088880784, 0.04614231699567243], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1361.4999999999995, 967, 2048, 1325.0, 1741.5, 1879.0, 2048.0, 0.22885719734695176, 205.9261084608294, 0.11487558538704414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 216.4736842105263, 137, 569, 149.0, 448.0, 569.0, 569.0, 0.09817751528210533, 0.026461908415879958, 0.057813517299911646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 675.2631578947368, 142, 1184, 852.0, 1172.0, 1184.0, 1184.0, 0.0850317302614502, 13.169883607225012, 0.0462263883108223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 158.6428571428571, 141, 193, 152.0, 188.0, 193.0, 193.0, 0.12551325957935128, 0.09376723005683958, 0.044616041491097526], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 795.0769230769231, 145, 3778, 537.0, 2701.599999999999, 3778.0, 3778.0, 0.09184423218221895, 0.018207401497060984, 0.06231498685920985], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 8, 4.651162790697675, 210.5581395348836, 138, 767, 154.0, 357.40000000000055, 430.09999999999997, 656.7700000000016, 0.7062958887009083, 1.4739788224158605, 0.3410854782280186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 157.09090909090907, 146, 196, 152.0, 188.8, 196.0, 196.0, 0.05776734464522973, 0.044735844046549976, 0.020534485791859004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 426.6666666666667, 290, 1465, 299.0, 1465.0, 1465.0, 1465.0, 0.0490709238419262, 6.590476390070227, 0.10896662938639537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bf484f4-fff9-4cc3-863b-64ca71108060", 1, 0, 0.0, 935.0, 935, 935, 935.0, 935.0, 935.0, 935.0, 1.0695187165775402, 0.19322359625668448, 0.7373830213903743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 157.33333333333337, 142, 231, 153.0, 189.00000000000003, 231.0, 231.0, 0.07083022467347266, 0.05748038740591385, 0.025177931426898486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1571314f-0b2b-4b45-ac2b-5cd20d7c0b62", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c9aed2f-e8f2-4ebf-a133-774097bf980c", 3, 0, 0.0, 475.6666666666667, 248, 692, 487.0, 692.0, 692.0, 692.0, 0.025471217524197655, 0.030106116806758364, 0.016334081550348108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 725.9999999999999, 238, 1400, 733.0, 1162.2000000000003, 1388.6999999999998, 1400.0, 0.08566190957528824, 0.05261849719028937, 0.038731898567732875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 192.9473684210526, 140, 444, 148.0, 441.0, 444.0, 444.0, 0.08502754444926765, 0.06318941535731706, 0.0426798416473863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2630ec1a-5612-4183-9915-dfc12be4dc05", 3, 0, 0.0, 653.0, 258, 988, 713.0, 988.0, 988.0, 988.0, 0.01952807160292921, 0.023081519528071602, 0.012522884458909683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 284.5263157894737, 139, 446, 150.0, 445.0, 446.0, 446.0, 0.08503020810024614, 0.08996874300738421, 0.04473525956589841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab3a5354-a886-440f-a4af-61e0fba773dd", 3, 0, 0.0, 364.0, 253, 582, 257.0, 582.0, 582.0, 582.0, 0.04727834336684843, 0.030395419319507046, 0.030318468890850065], "isController": false}, {"data": ["login", 20, 0, 0.0, 3067.85, 1928, 4850, 2995.0, 4430.7, 4829.549999999999, 4850.0, 0.0876716171906507, 36.8274345517679, 0.18316004946871], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 444.6363636363637, 295, 1052, 298.0, 1015.0000000000001, 1052.0, 1052.0, 0.05625907816943188, 0.08719058306141446, 0.1265279853751969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b419c37b-5c72-4e5c-b477-72ad3b073831", 3, 0, 0.0, 382.6666666666667, 244, 452, 452.0, 452.0, 452.0, 452.0, 0.030480990022555932, 0.024775726590599664, 0.01954672862774583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a791c342-3347-4e21-a978-e7d923876e1d", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 168.8421052631579, 144, 433, 152.0, 219.0, 433.0, 433.0, 0.0957444128095946, 0.0775118341983925, 0.034034146740910584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33e33eb4-16ca-4d84-8295-17c7a94ec1ab", 3, 0, 0.0, 662.0, 305, 986, 695.0, 986.0, 986.0, 986.0, 0.03235233853487043, 0.026970813472592177, 0.020746779594301674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1571314f-0b2b-4b45-ac2b-5cd20d7c0b62", 3, 0, 0.0, 362.6666666666667, 240, 475, 373.0, 475.0, 475.0, 475.0, 0.02438112575784666, 0.02445255483721535, 0.015635031817369114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 518.0, 291, 1666, 441.0, 935.2000000000012, 1666.0, 1666.0, 0.1120001991114651, 7.607889393192255, 0.2502990560872108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b419c37b-5c72-4e5c-b477-72ad3b073831", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82927bb7-657d-4246-84ab-00038e2773cd", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a49c463-c8ec-4b5e-ae07-d32e3bfd892d", 1, 0, 0.0, 3778.0, 3778, 3778, 3778.0, 3778.0, 3778.0, 3778.0, 0.2646903123345686, 0.04782002713075702, 0.18249156299629432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 155.77777777777777, 147, 188, 152.0, 188.0, 188.0, 188.0, 0.04827834072707181, 0.04002764773172262, 0.017161441430326305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1137.684210526316, 291, 2062, 1283.0, 1925.0, 2062.0, 2062.0, 0.0849712662954764, 53.56510276911295, 0.1796598983139912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c9aed2f-e8f2-4ebf-a133-774097bf980c", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 150.78947368421052, 140, 162, 151.0, 157.0, 162.0, 162.0, 0.08648707700991415, 0.06714572873328295, 0.03074345315586792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 499.1333333333334, 287, 1780, 301.0, 1312.0000000000002, 1780.0, 1780.0, 0.07483386881123905, 6.076734259319312, 0.16702666174841851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1159.3636363636363, 142, 2265, 1485.0, 2199.4, 2265.0, 2265.0, 0.1357488399644585, 103.3604490355662, 0.22749741228773818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 188.07142857142856, 142, 442, 146.0, 437.0, 442.0, 442.0, 0.130453418811383, 0.0969482926908813, 0.06548150123930747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2630ec1a-5612-4183-9915-dfc12be4dc05", 1, 0, 0.0, 1087.0, 1087, 1087, 1087.0, 1087.0, 1087.0, 1087.0, 0.9199632014719411, 0.16620428932842687, 0.6342715041398345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 289.2857142857142, 142, 447, 281.5, 444.0, 447.0, 447.0, 0.13043761820909153, 0.03490225330985456, 0.07439020413487249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 264.4285714285714, 141, 446, 149.0, 440.5, 446.0, 446.0, 0.13044612575006523, 0.03515930733107227, 0.07668805439603443], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1242.2727272727275, 320, 2319, 1264.5, 2174.1, 2304.6, 2319.0, 0.08985973711942359, 0.027985436595786395, 0.04054218608317744], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 260.1428571428571, 142, 580, 149.0, 513.0, 580.0, 580.0, 0.1304339724597984, 0.03515603163955503, 0.07680828651685392], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 33.333333333333336, 0.62402496099844], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15600624024961], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.15600624024961], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.9360374414976599], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 24, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
