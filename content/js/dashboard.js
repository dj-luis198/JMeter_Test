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

    var data = {"OkPercent": 97.92147806004618, "KoPercent": 2.0785219399538106};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7875166002656042, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13636363636363635, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94a45750-866f-43e7-b005-699e88efbe6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e9eac345-d70c-4468-b331-56a4ce185a44"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bbcbd58-8f59-48d3-bc66-99e830191f0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae0b452b-0d12-42c5-8c44-056fa22d6d75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e38bbd39-0eec-4c7d-b4fd-85c0c937cf26"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9eac345-d70c-4468-b331-56a4ce185a44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db8af301-d0cf-454a-84b5-5fc9df7f5ffd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05ea1b23-0a0b-4fa2-8c1a-02451f1c016e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=755ff74c-31e4-4c9f-b56b-dfed442bd943"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5e338a2-fcbf-4a39-b4ae-b0617cb50665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f81702b-7198-427b-a31e-b6d8f67180cb"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3445e21-9e78-4f66-9d18-ede4f1516751"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d80654d1-2ebf-4e0c-ba10-d161874f4000"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80d83140-0608-48e1-8c6a-c084b95fcb59"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5e338a2-fcbf-4a39-b4ae-b0617cb50665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60ce7096-ac05-43da-99f1-8de2cd086141"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/312a1609-1164-4a44-8916-6a8a778ae832"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9209039548022598, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/755ff74c-31e4-4c9f-b56b-dfed442bd943"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/db8af301-d0cf-454a-84b5-5fc9df7f5ffd"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e38bbd39-0eec-4c7d-b4fd-85c0c937cf26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05ea1b23-0a0b-4fa2-8c1a-02451f1c016e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3445e21-9e78-4f66-9d18-ede4f1516751"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f81702b-7198-427b-a31e-b6d8f67180cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d80654d1-2ebf-4e0c-ba10-d161874f4000"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60ce7096-ac05-43da-99f1-8de2cd086141"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 27, 2.0785219399538106, 347.56120092378717, 106, 2313, 124.0, 896.0, 1115.0, 1496.0, 5.215631637483488, 714.3048896985755, 3.818842874579919], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1644.2545454545455, 1323, 2146, 1606.0, 1927.8, 2030.6, 2146.0, 0.24194754577207664, 291.14368278394744, 1.1896541923460993], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 541.4615384615386, 134, 1311, 463.0, 1237.0, 1311.0, 1311.0, 0.07335432395526514, 0.014541921643475415, 0.04931799875297649], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 541.4615384615386, 134, 1311, 463.0, 1237.0, 1311.0, 1311.0, 0.07333859866862236, 0.014538804228252286, 0.04930742623829403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94a45750-866f-43e7-b005-699e88efbe6b", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 176.11111111111106, 109, 339, 113.5, 336.3, 339.0, 339.0, 0.09604200236903607, 0.033712660336787284, 0.054325841834829094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 138.16666666666669, 109, 339, 113.5, 336.3, 339.0, 339.0, 0.09615230525151841, 0.0714569377894585, 0.04826395009695358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 198.27777777777777, 108, 760, 114.5, 384.7000000000006, 760.0, 760.0, 0.0960363657705051, 1.5932178818379226, 0.056094157654365116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 164.83333333333334, 107, 997, 113.5, 242.8000000000012, 997.0, 997.0, 0.09614871000480743, 4.830851925978847, 0.056065881897334545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9eac345-d70c-4468-b331-56a4ce185a44", 3, 0, 0.0, 360.0, 230, 521, 329.0, 521.0, 521.0, 521.0, 0.022863065479819537, 0.027023369387117423, 0.01466153613126448], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 268.53846153846155, 112, 1077, 215.0, 753.7999999999997, 1077.0, 1077.0, 0.07323242281020972, 0.14998013394491796, 0.047332614622824856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0bbcbd58-8f59-48d3-bc66-99e830191f0a", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.7567202310426541, 1.4139329087677726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 129.66666666666669, 113, 336, 115.0, 205.80000000000007, 336.0, 336.0, 0.08170869217067311, 0.06072296361511938, 0.0410139333747324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 806.4, 782, 888, 788.0, 888.0, 888.0, 888.0, 0.029933846199898223, 8.801544680007185, 0.017071646660879458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 158.53333333333333, 110, 336, 114.0, 334.8, 336.0, 336.0, 0.08161222224640362, 0.030009494221854668, 0.04608752706805371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 858.6, 773, 1013, 776.0, 1013.0, 1013.0, 1013.0, 0.02990341197930684, 26.907142663571662, 0.01702508709368739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 205.6, 111, 336, 139.0, 336.0, 336.0, 336.0, 0.030055663088039048, 0.05318443507375659, 0.016642149385662247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 113.42857142857144, 111, 117, 114.0, 116.0, 117.0, 117.0, 0.07096764382353389, 0.052740602489950474, 0.03562243059110978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 143.78571428571428, 110, 334, 113.5, 331.0, 334.0, 334.0, 0.07096872306990419, 0.034217062908703806, 0.039622883611294166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 268.2142857142857, 111, 981, 113.0, 980.5, 981.0, 981.0, 0.07065746773729553, 9.098854292314991, 0.04067141627847117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 239.42857142857144, 110, 790, 114.0, 778.5, 790.0, 790.0, 0.07072528782666242, 2.9871369961454715, 0.04077952212438557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 113.8, 112, 115, 114.0, 115.0, 115.0, 115.0, 0.030054940431108065, 0.022335751628977774, 0.016876553464733532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 587.9375, 111, 1132, 768.5, 1067.6000000000001, 1132.0, 1132.0, 0.10262528302128833, 51.95470722329658, 0.055371551630138474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 201.19999999999996, 109, 777, 115.0, 509.40000000000015, 777.0, 777.0, 0.08161399843301123, 4.916292304956146, 0.0475125243481762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 462.1875, 107, 840, 564.5, 802.9000000000001, 840.0, 840.0, 0.10262594127230511, 16.98578340073506, 0.055472127435762575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 195.0, 109, 875, 114.0, 558.8000000000002, 875.0, 875.0, 0.08171047255889963, 1.6222614224431433, 0.04764848324935313], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 496.3333333333333, 115, 1883, 421.0, 1499.6000000000013, 1883.0, 1883.0, 0.07331781439595286, 0.014642083050754257, 0.04967806987798694], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 414.64285714285717, 225, 1096, 233.0, 1093.5, 1096.0, 1096.0, 0.07061683808063433, 12.162706081370775, 0.15623778391751955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae0b452b-0d12-42c5-8c44-056fa22d6d75", 1, 0, 0.0, 1632.0, 1632, 1632, 1632.0, 1632.0, 1632.0, 1632.0, 0.6127450980392157, 0.19567153033088236, 0.3656125536151961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e38bbd39-0eec-4c7d-b4fd-85c0c937cf26", 3, 0, 0.0, 347.3333333333333, 194, 428, 420.0, 428.0, 428.0, 428.0, 0.03128356465791422, 0.026079820666965597, 0.02006140051305046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 581.6999999999999, 128, 1111, 618.5, 878.3000000000001, 1099.4999999999998, 1111.0, 0.09528392226737621, 0.05852889365837855, 0.04308247657206561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 127.5625, 110, 320, 113.5, 184.90000000000015, 320.0, 320.0, 0.10261541026923718, 0.07626008517079053, 0.05150812585780069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 210.1875, 108, 349, 114.5, 344.8, 349.0, 349.0, 0.10262462477871565, 0.11416237861431101, 0.05367999477255818], "isController": false}, {"data": ["login", 20, 0, 0.0, 2497.6000000000004, 1416, 3896, 2370.5, 3605.1000000000013, 3884.2, 3896.0, 0.09278116171292582, 27.876865662445898, 0.1784497050718822], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 119.66666666666666, 112, 142, 116.0, 136.0, 142.0, 142.0, 0.08056935678796831, 0.06522655935275949, 0.028639888545723108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9eac345-d70c-4468-b331-56a4ce185a44", 1, 0, 0.0, 1883.0, 1883, 1883, 1883.0, 1883.0, 1883.0, 1883.0, 0.5310674455655868, 0.09594480217737653, 0.36614610993096125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db8af301-d0cf-454a-84b5-5fc9df7f5ffd", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05ea1b23-0a0b-4fa2-8c1a-02451f1c016e", 3, 0, 0.0, 665.6666666666667, 229, 1419, 349.0, 1419.0, 1419.0, 1419.0, 0.01934997000754649, 0.02287100947181032, 0.012408672172808133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=755ff74c-31e4-4c9f-b56b-dfed442bd943", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 719.75, 226, 1248, 897.5, 1181.5, 1248.0, 1248.0, 0.10254043938578276, 69.0736595340979, 0.21585813930759568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5e338a2-fcbf-4a39-b4ae-b0617cb50665", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f81702b-7198-427b-a31e-b6d8f67180cb", 3, 0, 0.0, 348.3333333333333, 238, 471, 336.0, 471.0, 471.0, 471.0, 0.03327344113928263, 0.02773869881435638, 0.021337460626427985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 631.3333333333333, 111, 1129, 898.0, 1129.0, 1129.0, 1129.0, 0.04080355807026373, 27.124430875372333, 0.06313128629816521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 387.9444444444444, 223, 1113, 232.0, 726.0000000000006, 1113.0, 1113.0, 0.09597594203053102, 6.519402261499784, 0.21448790169930737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3445e21-9e78-4f66-9d18-ede4f1516751", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d80654d1-2ebf-4e0c-ba10-d161874f4000", 3, 0, 0.0, 320.0, 215, 436, 309.0, 436.0, 436.0, 436.0, 0.06780886940011753, 0.030681747547579224, 0.043484203358799337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80d83140-0608-48e1-8c6a-c084b95fcb59", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1029.5714285714284, 203, 1990, 1078.0, 1705.0, 1964.8999999999996, 1990.0, 0.08777833045615473, 0.027577678597553074, 0.03960311393627293], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b5e338a2-fcbf-4a39-b4ae-b0617cb50665", 3, 0, 0.0, 594.0, 235, 1077, 470.0, 1077.0, 1077.0, 1077.0, 0.01965267178072859, 0.02709279459354999, 0.01260278756771983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 117.75000000000001, 113, 130, 116.0, 125.80000000000001, 130.0, 130.0, 0.08619575054949792, 0.06691955242856527, 0.030639895703141837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 369.66666666666674, 228, 990, 236.0, 795.0000000000001, 990.0, 990.0, 0.08156030296933876, 6.622940857225971, 0.182039835071474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 367.54999999999995, 218, 548, 447.5, 477.6, 544.5999999999999, 548.0, 0.10287007509515482, 0.15942852458594794, 0.23135720990638825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60ce7096-ac05-43da-99f1-8de2cd086141", 3, 0, 0.0, 494.0, 269, 728, 485.0, 728.0, 728.0, 728.0, 0.02018435040032295, 0.027825756492632713, 0.0129437403283321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 115.0, 107, 129, 114.0, 129.0, 129.0, 129.0, 0.04273524565643712, 0.03175929877397329, 0.021451090104891286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 113.55555555555556, 111, 119, 113.0, 119.0, 119.0, 119.0, 0.042738898571096154, 0.01143599434421909, 0.024374528091328278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 136.66666666666666, 109, 329, 112.0, 329.0, 329.0, 329.0, 0.04269490222867389, 0.01150761036632226, 0.02509993275552899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 113.33333333333333, 107, 122, 114.0, 122.0, 122.0, 122.0, 0.042738898571096154, 0.011519468755490762, 0.025167534998409166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 116.0, 115, 117, 116.0, 117.0, 117.0, 117.0, 0.012584552461853075, 0.003711459808085575, 0.007779318074563473], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1093.9636363636364, 853, 1646, 929.0, 1433.6, 1570.4, 1646.0, 0.2479320215475466, 296.61289288773185, 0.4895688941104875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1029.5714285714284, 203, 1990, 1078.0, 1705.0, 1964.8999999999996, 1990.0, 0.08761280148190796, 0.027525673679862823, 0.03952843191859519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 156.5, 110, 461, 113.0, 461.0, 461.0, 461.0, 0.05745021579737309, 0.015484628476635716, 0.03383054699786716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 139.375, 108, 337, 112.0, 337.0, 337.0, 337.0, 0.05745227870100398, 0.015485184493629978, 0.03377565603320742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 153.8125, 109, 778, 113.0, 315.30000000000047, 778.0, 778.0, 0.08662086588383058, 4.893238302461116, 0.050458346191118116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 167.375, 111, 756, 114.0, 459.2000000000003, 756.0, 756.0, 0.08663118397756252, 1.613918230314417, 0.05054895744784532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 128.6875, 110, 336, 114.0, 196.70000000000016, 336.0, 336.0, 0.08693431569110063, 0.06460645921965585, 0.0436369514308845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 139.0, 109, 333, 112.0, 333.0, 333.0, 333.0, 0.05735959446766711, 0.01534817273841874, 0.0327128937198414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 153.875, 110, 337, 113.5, 332.1, 337.0, 337.0, 0.08683099432342375, 0.031385079857380094, 0.04906502352577253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 141.375, 111, 335, 114.0, 335.0, 335.0, 335.0, 0.057449803234423925, 0.04269462916152012, 0.028837108264154192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 119.375, 115, 128, 119.0, 128.0, 128.0, 128.0, 0.054951848442801994, 0.043253115082908605, 0.01953366487615227], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 572.5, 111, 1419, 476.0, 1221.0000000000007, 1419.0, 1419.0, 0.0744943694672411, 0.014537556801956718, 0.05069351542033448], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1310.3, 939, 1913, 1248.5, 1719.2000000000003, 1903.9499999999998, 1913.0, 0.09535115446410267, 0.049351671744115644, 0.04385780639901597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 326.5, 224, 797, 229.5, 797.0, 797.0, 797.0, 0.057312337913544335, 0.08882292994999498, 0.12889679122548106], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 1036.0327868852457, 570, 2788, 916.0, 1631.0, 1727.5, 2788.0, 0.2818202818202818, 78.46240922412798, 1.026191455878956], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/312a1609-1164-4a44-8916-6a8a778ae832", 2, 0, 0.0, 306.0, 191, 421, 306.0, 421.0, 421.0, 421.0, 0.06000240009600384, 0.036886241074642986, 0.03729641373154926], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 224.6, 112, 598, 116.0, 448.4, 456.4, 598.0, 0.24904457445074352, 0.18508097769239826, 0.12038775815734183], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 649.9636363636365, 531, 945, 561.0, 886.4, 905.1999999999999, 945.0, 0.24898369383154217, 73.20947302318265, 0.12522129133129317], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 188.96363636363634, 110, 466, 116.0, 342.6, 446.7999999999999, 466.0, 0.24921045596451244, 0.44098568965595364, 0.1211980537796164], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 858.290909090909, 738, 1175, 782.0, 1011.4, 1121.9999999999998, 1175.0, 0.24847863309645038, 223.58151083903329, 0.12472462637849169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 140.9, 112, 342, 117.0, 314.4000000000003, 341.45, 342.0, 0.11062314014845626, 0.08264326388043851, 0.03932306934964656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, 7.344632768361582, 176.45197740113002, 112, 2313, 119.0, 309.00000000000034, 373.99999999999994, 885.5999999999979, 0.7403410588131957, 1.5437333214125875, 0.35725066949627526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 171.0, 111, 347, 122.0, 347.0, 347.0, 347.0, 0.04370311020467623, 0.033844303117488525, 0.015535089955568505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 130.83333333333331, 113, 347, 115.5, 154.40000000000032, 347.0, 347.0, 0.0994370756660903, 0.0806955174594932, 0.035346772990680536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/755ff74c-31e4-4c9f-b56b-dfed442bd943", 3, 0, 0.0, 349.6666666666667, 204, 481, 364.0, 481.0, 481.0, 481.0, 0.02495300517358974, 0.02502610968093424, 0.016001764385407482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 254.44444444444446, 221, 443, 229.0, 443.0, 443.0, 443.0, 0.04266858833345976, 0.06612797820820375, 0.09596265520699006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db8af301-d0cf-454a-84b5-5fc9df7f5ffd", 3, 0, 0.0, 619.6666666666666, 215, 885, 759.0, 885.0, 885.0, 885.0, 0.02501500900540324, 0.02508829516459876, 0.016041525957241013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 313.37499999999994, 227, 1115, 230.0, 650.9000000000004, 1115.0, 1115.0, 0.08656790711263566, 6.598610187757675, 0.19330892636858452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e38bbd39-0eec-4c7d-b4fd-85c0c937cf26", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05ea1b23-0a0b-4fa2-8c1a-02451f1c016e", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3445e21-9e78-4f66-9d18-ede4f1516751", 3, 0, 0.0, 440.66666666666663, 202, 706, 414.0, 706.0, 706.0, 706.0, 0.029373464012611008, 0.023875501184729715, 0.01883649873204547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 133.07142857142856, 111, 339, 117.0, 233.0, 339.0, 339.0, 0.0736644374404765, 0.06107530018258257, 0.026185405496419383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f81702b-7198-427b-a31e-b6d8f67180cb", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 119.1875, 113, 131, 118.0, 127.5, 131.0, 131.0, 0.10298064607482832, 0.07995079456004738, 0.03660640153441163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d80654d1-2ebf-4e0c-ba10-d161874f4000", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60ce7096-ac05-43da-99f1-8de2cd086141", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 117.05, 106, 206, 112.0, 117.80000000000001, 201.59999999999994, 206.0, 0.10293095905921104, 0.07649458969146444, 0.051666516559018036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 202.25, 110, 343, 114.5, 341.8, 342.95, 343.0, 0.1029346673666224, 0.02754306529145951, 0.05870492748252684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 169.85, 109, 369, 114.0, 334.9, 367.29999999999995, 369.0, 0.10293201854834974, 0.02774339562435989, 0.06051276871690092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 178.29999999999995, 106, 341, 113.5, 338.6, 340.9, 341.0, 0.1029346673666224, 0.027744109563659945, 0.06061484806843097], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.4618937644341801], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15396458814472672], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15396458814472672], "isController": false}, {"data": ["401/Unauthorized", 17, 62.96296296296296, 1.308698999230177], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 27, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
