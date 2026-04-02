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

    var data = {"OkPercent": 98.31158864159632, "KoPercent": 1.6884113584036837};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8116370808678501, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3125, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ef67a6a-ace2-4930-b243-4264c82a8c3e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/42e1a7d0-aba7-43ec-a0af-6faec3c015f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f16d57c0-2031-4648-b613-7e19c6128bc6"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f4eb3b0-bceb-4bb9-bd70-4264357e090b"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f09549b7-8e3c-4bf0-aec5-18f51e84bbc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/51d8d9aa-7f6b-4606-8d17-562caafe27b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4935f9ce-298a-400d-8bea-03cf09b529a0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=319f52a5-d064-4a59-9929-96f207bb1f1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65eafba1-8da0-4933-b104-efee72e5b32b"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aa8e0f4-5793-438f-bb83-2c3ff11aac73"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c24a1792-89e2-43e4-b380-4842e53b5ed9"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bebbcab-646c-44cc-8d4e-b977283ad289"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74dcefd6-545b-40ff-b1e9-810341947f1c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/319f52a5-d064-4a59-9929-96f207bb1f1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f4eb3b0-bceb-4bb9-bd70-4264357e090b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74dcefd6-545b-40ff-b1e9-810341947f1c"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4d841e4-c7cc-4d03-92a5-06d51282faa6"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4935f9ce-298a-400d-8bea-03cf09b529a0"], "isController": false}, {"data": [0.3644067796610169, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/34daf2a7-7314-4565-9b3d-2ea1c84aabb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7232142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42e1a7d0-aba7-43ec-a0af-6faec3c015f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9425287356321839, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51d8d9aa-7f6b-4606-8d17-562caafe27b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8aa8e0f4-5793-438f-bb83-2c3ff11aac73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bebbcab-646c-44cc-8d4e-b977283ad289"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f09549b7-8e3c-4bf0-aec5-18f51e84bbc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c24a1792-89e2-43e4-b380-4842e53b5ed9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65eafba1-8da0-4933-b104-efee72e5b32b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cc74d71-38d0-4f73-abce-14a9550f9d71"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f16d57c0-2031-4648-b613-7e19c6128bc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ef67a6a-ace2-4930-b243-4264c82a8c3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 22, 1.6884113584036837, 312.6055257099004, 81, 3742, 97.0, 839.6000000000001, 1041.8, 1518.0800000000008, 5.066450995792862, 701.0413056828432, 3.700667687425636], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1437.7500000000005, 1023, 1963, 1406.5, 1714.9, 1883.0, 1963.0, 0.23787374850797938, 286.24323729047995, 1.1696233630250743], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ef67a6a-ace2-4930-b243-4264c82a8c3e", 1, 0, 0.0, 3382.0, 3382, 3382, 3382.0, 3382.0, 3382.0, 3382.0, 0.29568302779420463, 0.053419297013601416, 0.20385958752217623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42e1a7d0-aba7-43ec-a0af-6faec3c015f3", 3, 0, 0.0, 909.6666666666667, 193, 1531, 1005.0, 1531.0, 1531.0, 1531.0, 0.04379945688673461, 0.028443983232107922, 0.02808754233947499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f16d57c0-2031-4648-b613-7e19c6128bc6", 3, 0, 0.0, 273.3333333333333, 164, 382, 274.0, 382.0, 382.0, 382.0, 0.020503707753818816, 0.02826601638587978, 0.013148536547859071], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 458.2, 91, 1314, 416.0, 946.2000000000003, 1314.0, 1314.0, 0.08107801326436297, 0.01588305611409298, 0.05459041752474231], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 458.2, 91, 1314, 416.0, 946.2000000000003, 1314.0, 1314.0, 0.08036001285760205, 0.015742400956284153, 0.05410698261545055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 126.2666666666667, 83, 360, 86.0, 300.6, 360.0, 360.0, 0.08710194411539265, 0.032028110700764174, 0.04918764734745547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 98.60000000000001, 83, 256, 87.0, 158.20000000000005, 256.0, 256.0, 0.08710093256065128, 0.06473028288931214, 0.043720585289233165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 131.13333333333335, 82, 748, 86.0, 356.2000000000002, 748.0, 748.0, 0.08710143833508505, 1.729292449611818, 0.05079216036245812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 174.4, 83, 745, 89.0, 451.00000000000017, 745.0, 745.0, 0.08710042679209128, 5.2467856766977325, 0.0507065114827396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f4eb3b0-bceb-4bb9-bd70-4264357e090b", 3, 0, 0.0, 499.0, 180, 1011, 306.0, 1011.0, 1011.0, 1011.0, 0.02901746851604666, 0.029102480630839766, 0.018608207349157527], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 198.39999999999998, 82, 328, 185.0, 313.0, 328.0, 328.0, 0.08082636879455554, 0.16169483465619158, 0.05224246024689762], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 96.16666666666667, 83, 257, 86.0, 109.40000000000023, 257.0, 257.0, 0.11079309389714707, 0.08233744575754778, 0.0556129397100914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 104.72222222222223, 84, 249, 86.0, 249.0, 249.0, 249.0, 0.11079377585188102, 0.038890827352521175, 0.06267013384503643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 592.75, 502, 695, 587.0, 695.0, 695.0, 695.0, 0.022052540176971638, 6.484179025277725, 0.012576839319679137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 869.75, 740, 919, 910.0, 919.0, 919.0, 919.0, 0.02200195817427751, 19.797400640532008, 0.012526505483988076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 169.5, 84, 256, 169.0, 256.0, 256.0, 256.0, 0.022082489138175655, 0.039075654607787384, 0.012227315763032808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 97.16666666666666, 82, 269, 87.5, 110.60000000000025, 269.0, 269.0, 0.0982409413665315, 0.07300913708977584, 0.04931234752187225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 111.8888888888889, 82, 251, 85.0, 244.70000000000002, 251.0, 251.0, 0.09815843862643624, 0.026265050960589384, 0.05598098452913942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 102.77777777777774, 81, 257, 84.5, 248.9, 257.0, 257.0, 0.09824469478648153, 0.02648001539166885, 0.05775713502095887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f09549b7-8e3c-4bf0-aec5-18f51e84bbc4", 3, 0, 0.0, 336.0, 215, 524, 269.0, 524.0, 524.0, 524.0, 0.051268029256955366, 0.03356120014184155, 0.03287695886595119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 94.88888888888889, 82, 249, 86.0, 105.00000000000023, 249.0, 249.0, 0.09815576228855613, 0.026456045304337393, 0.05780070767578061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51d8d9aa-7f6b-4606-8d17-562caafe27b9", 3, 0, 0.0, 1331.0, 206, 3090, 697.0, 3090.0, 3090.0, 3090.0, 0.024698676150958308, 0.024771035553744318, 0.015838669276493446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4935f9ce-298a-400d-8bea-03cf09b529a0", 3, 0, 0.0, 319.6666666666667, 185, 408, 366.0, 408.0, 408.0, 408.0, 0.018857487679774715, 0.025996569115835262, 0.012092855055063865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=319f52a5-d064-4a59-9929-96f207bb1f1b", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 87.25, 84, 93, 86.0, 93.0, 93.0, 93.0, 0.02210335528933292, 0.016426419311701516, 0.012411552042350029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 175.0, 82, 930, 87.5, 399.90000000000083, 930.0, 930.0, 0.11079309389714707, 5.566637670036624, 0.06460526113316714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 560.8333333333333, 82, 1215, 581.5, 1111.5000000000002, 1215.0, 1215.0, 0.10227098401731789, 46.025588209078826, 0.0557296963688119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 137.49999999999997, 83, 661, 86.0, 302.8000000000006, 661.0, 661.0, 0.11079036616216016, 1.8379828421114182, 0.06471186426333639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 367.5, 82, 756, 376.0, 700.2, 756.0, 756.0, 0.10227040294538761, 15.049229616230313, 0.055829253170382495], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 639.8000000000001, 87, 3382, 408.0, 1834.000000000001, 3382.0, 3382.0, 0.08043024820774597, 0.01575615995163461, 0.05468837970583977], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 220.33333333333334, 169, 521, 174.5, 367.10000000000025, 521.0, 521.0, 0.0981076131507805, 0.15204763874051624, 0.22064632137328855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65eafba1-8da0-4933-b104-efee72e5b32b", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 451.00000000000006, 219, 874, 365.0, 830.7, 872.0, 874.0, 0.08722159955691428, 0.053576548946581135, 0.03943710995590948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 96.0, 83, 253, 86.0, 109.00000000000023, 253.0, 253.0, 0.10227156509585118, 0.07600455179486597, 0.051335531698503425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 142.11111111111114, 83, 260, 86.0, 256.4, 260.0, 260.0, 0.10227040294538761, 0.10416799831253835, 0.0540315312436081], "isController": false}, {"data": ["login", 20, 0, 0.0, 2567.7, 1421, 4564, 2393.5, 4035.3000000000015, 4540.849999999999, 4564.0, 0.0824905548314718, 19.851915920470855, 0.15181806605018724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 103.11111111111111, 86, 267, 91.0, 132.9000000000002, 267.0, 267.0, 0.11443538850814398, 0.09264349323559702, 0.040678204508754305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aa8e0f4-5793-438f-bb83-2c3ff11aac73", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c24a1792-89e2-43e4-b380-4842e53b5ed9", 1, 0, 0.0, 802.0, 802, 802, 802.0, 802.0, 802.0, 802.0, 1.2468827930174564, 0.22526691084788028, 0.8596672381546134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 667.7777777777777, 171, 1303, 751.0, 1200.4, 1303.0, 1303.0, 0.10222103595340992, 61.22515971149532, 0.2168204004793031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bebbcab-646c-44cc-8d4e-b977283ad289", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74dcefd6-545b-40ff-b1e9-810341947f1c", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 0.23929014900662252, 0.9131829470198676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 283.00000000000006, 170, 833, 180.0, 644.0000000000001, 833.0, 833.0, 0.08705543690221933, 7.069162189357183, 0.19430478797648343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 520.75, 82, 1012, 455.0, 1012.0, 1012.0, 1012.0, 0.04257923729941187, 25.47548201027224, 0.06211204659765282], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1025.4347826086955, 198, 2693, 853.0, 2183.400000000002, 2690.2, 2693.0, 0.09391511706723506, 0.029731280267208927, 0.04237185945806894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/319f52a5-d064-4a59-9929-96f207bb1f1b", 3, 0, 0.0, 351.6666666666667, 227, 500, 328.0, 500.0, 500.0, 500.0, 0.053947131810825395, 0.03468280772343104, 0.03459500314691602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f4eb3b0-bceb-4bb9-bd70-4264357e090b", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 301.94444444444446, 172, 1188, 184.5, 503.10000000000105, 1188.0, 1188.0, 0.110727665307177, 7.521449400148252, 0.24745518605323538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 89.05882352941177, 85, 100, 88.0, 93.6, 100.0, 100.0, 0.0838859939996842, 0.06512633323217669, 0.02981884942957524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74dcefd6-545b-40ff-b1e9-810341947f1c", 3, 0, 0.0, 350.6666666666667, 226, 443, 383.0, 443.0, 443.0, 443.0, 0.018884314688219966, 0.02232062064873916, 0.012110058572849391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 420.30769230769226, 172, 1041, 340.0, 1022.6, 1041.0, 1041.0, 0.14932402164049668, 27.67942618296213, 0.3299553858590152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 86.77777777777777, 83, 95, 85.0, 95.0, 95.0, 95.0, 0.04281371751509183, 0.031817616239243056, 0.021490479299567582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 84.77777777777779, 82, 88, 83.0, 88.0, 88.0, 88.0, 0.0428135138477932, 0.01145595976005404, 0.02441708211631956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 141.22222222222223, 83, 253, 88.0, 253.0, 253.0, 253.0, 0.042780138607649086, 0.011530584234092919, 0.025150042423637456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 156.2222222222222, 84, 253, 86.0, 253.0, 253.0, 253.0, 0.04278176546085469, 0.011531022721870988, 0.02519277790321814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 167.0, 87, 247, 167.0, 247.0, 247.0, 247.0, 0.07698229407236336, 0.022703762509622787, 0.0475876876443418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4d841e4-c7cc-4d03-92a5-06d51282faa6", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 978.7321428571427, 658, 1596, 915.5, 1356.5, 1500.5, 1596.0, 0.2408498559201755, 288.14016063825215, 0.47558438346737775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1025.4347826086955, 198, 2693, 853.0, 2183.400000000002, 2690.2, 2693.0, 0.09151533478696822, 0.028971566583374447, 0.04128914518708918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 112.57142857142857, 85, 266, 86.0, 266.0, 266.0, 266.0, 0.06090663882363177, 0.016416242495432002, 0.03586592110415035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 109.28571428571429, 83, 251, 84.0, 251.0, 251.0, 251.0, 0.06100324188656883, 0.016442280039739254, 0.03586323399972113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 177.94117647058823, 83, 908, 85.0, 849.5999999999999, 908.0, 908.0, 0.08448506353773749, 8.963599284237572, 0.04881380796545058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 208.41176470588235, 82, 672, 87.0, 664.0, 672.0, 672.0, 0.08441458485403726, 2.940156886988733, 0.04885552288628362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 96.88235294117646, 84, 256, 86.0, 129.59999999999988, 256.0, 256.0, 0.08448422381361786, 0.0627856389864875, 0.042407120156444905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 109.71428571428571, 83, 263, 84.0, 263.0, 263.0, 263.0, 0.06100324188656883, 0.01632313308292955, 0.034790911388433786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 162.76470588235296, 82, 262, 88.0, 255.6, 262.0, 262.0, 0.08441500402212666, 0.03750377074374584, 0.04730886829273137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 112.0, 86, 253, 90.0, 253.0, 253.0, 253.0, 0.0609995207180515, 0.04533265162738007, 0.030618900047928197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 178.42857142857142, 90, 377, 98.0, 377.0, 377.0, 377.0, 0.06346500811445462, 0.049953902871338295, 0.022559827103185038], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 517.6, 84, 1531, 438.0, 1219.0000000000002, 1531.0, 1531.0, 0.08068637207175708, 0.015512165151555903, 0.054909807764718536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1450.1, 679, 3742, 1244.0, 2677.8000000000015, 3692.0999999999995, 3742.0, 0.08422967748456492, 0.04359543854181582, 0.03874236142112312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 251.14285714285717, 173, 516, 180.0, 516.0, 516.0, 516.0, 0.06085845193486407, 0.09431871408264578, 0.1368720847714765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4935f9ce-298a-400d-8bea-03cf09b529a0", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 874.7118644067797, 433, 2139, 719.0, 1513.0, 1575.0, 2139.0, 0.3034089798772993, 93.428712710265, 1.103629071915642], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/34daf2a7-7314-4565-9b3d-2ea1c84aabb9", 1, 0, 0.0, 1078.0, 1078, 1078, 1078.0, 1078.0, 1078.0, 1078.0, 0.9276437847866419, 0.29622999768089053, 0.5535062036178108], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 141.80357142857142, 83, 348, 90.0, 339.90000000000003, 342.6, 348.0, 0.24154276816638845, 0.17950590485802892, 0.11676139672105693], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 551.0357142857141, 404, 792, 505.0, 701.0, 734.65, 792.0, 0.24142301623569784, 70.98638277188111, 0.12141880211072695], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 120.94642857142858, 82, 359, 88.0, 254.60000000000002, 278.2999999999999, 359.0, 0.24184005735064218, 0.42794353898375354, 0.11761362164123028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42e1a7d0-aba7-43ec-a0af-6faec3c015f3", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 829.3035714285716, 571, 1275, 824.5, 1077.1000000000001, 1164.4999999999998, 1275.0, 0.24124205193596746, 217.07002239027793, 0.12109220185067117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 89.92307692307692, 86, 96, 88.0, 95.6, 96.0, 96.0, 0.14703886350269196, 0.1098483697066009, 0.05226772101072252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 137.17241379310343, 84, 823, 92.0, 226.0, 281.25, 721.0, 0.7413151100469499, 1.5689746911719595, 0.35661144437154374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 107.66666666666667, 84, 267, 89.0, 267.0, 267.0, 267.0, 0.042881442341136174, 0.03320799196925877, 0.015243012707200748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51d8d9aa-7f6b-4606-8d17-562caafe27b9", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aa8e0f4-5793-438f-bb83-2c3ff11aac73", 3, 0, 0.0, 487.3333333333333, 175, 862, 425.0, 862.0, 862.0, 862.0, 0.027403016158645193, 0.022844767051526806, 0.017572897731943694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bebbcab-646c-44cc-8d4e-b977283ad289", 3, 0, 0.0, 248.33333333333331, 159, 426, 160.0, 426.0, 426.0, 426.0, 0.04506466779829055, 0.03662971207432666, 0.028898891784711063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 104.4666666666667, 85, 263, 92.0, 174.20000000000005, 263.0, 263.0, 0.08616876439736439, 0.06992797188887676, 0.030630302969375623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f09549b7-8e3c-4bf0-aec5-18f51e84bbc4", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c24a1792-89e2-43e4-b380-4842e53b5ed9", 3, 0, 0.0, 307.0, 230, 388, 303.0, 388.0, 388.0, 388.0, 0.030214218811372633, 0.030302737030546575, 0.01937565464140758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 246.66666666666666, 169, 347, 175.0, 347.0, 347.0, 347.0, 0.04276245456489202, 0.06627345253367543, 0.09617376256147103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 360.82352941176464, 171, 1164, 337.0, 970.3999999999999, 1164.0, 1164.0, 0.08437813315862097, 11.991335769441715, 0.1872285242140425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65eafba1-8da0-4933-b104-efee72e5b32b", 3, 0, 0.0, 335.6666666666667, 166, 438, 403.0, 438.0, 438.0, 438.0, 0.07828401440425865, 0.03542147787171859, 0.0502016628829393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cc74d71-38d0-4f73-abce-14a9550f9d71", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.7159998598654709, 1.3378468329596411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 113.05555555555556, 86, 508, 90.0, 137.20000000000059, 508.0, 508.0, 0.10296186978755534, 0.08536584711878367, 0.036599727151045064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f16d57c0-2031-4648-b613-7e19c6128bc6", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 102.44444444444444, 85, 283, 90.0, 143.50000000000023, 283.0, 283.0, 0.09793946252999396, 0.07603698506967305, 0.03481441832120879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ef67a6a-ace2-4930-b243-4264c82a8c3e", 3, 0, 0.0, 320.0, 243, 463, 254.0, 463.0, 463.0, 463.0, 0.03028161905723226, 0.030192903376400525, 0.019418876804279804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 111.23076923076923, 83, 251, 86.0, 251.0, 251.0, 251.0, 0.1509784565356251, 0.11220176310899482, 0.0757841080657337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 149.76923076923077, 82, 263, 86.0, 259.4, 263.0, 263.0, 0.1506844551597835, 0.07513847756540286, 0.08399028375042018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 291.53846153846155, 82, 954, 250.0, 869.5999999999999, 954.0, 954.0, 0.14946995653873574, 20.72537033337549, 0.08589582087750362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 243.0, 84, 670, 248.0, 602.0, 670.0, 670.0, 0.1502542764678687, 6.831151756819233, 0.08649327828825705], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.3837298541826554], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15349194167306215], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15349194167306215], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 0.9976976208749041], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 22, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
