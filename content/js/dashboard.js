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

    var data = {"OkPercent": 96.70498084291188, "KoPercent": 3.2950191570881224};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7290980908492429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82ec94e5-3f38-4b3e-b098-89d92a1b86f4"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c91d34a6-60c6-4451-b539-7a6bee4b0bf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.19642857142857142, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b4fa047-c836-4afb-8b4d-032307250af1"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/754436a2-9fc1-4c7c-aa81-a95715b9d5df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=754436a2-9fc1-4c7c-aa81-a95715b9d5df"], "isController": false}, {"data": [0.475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecc69623-169c-484a-96f1-34b99c264cf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecc69623-169c-484a-96f1-34b99c264cf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c91d34a6-60c6-4451-b539-7a6bee4b0bf9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1159c705-86b1-4a3c-b0a0-bb1c54bc762b"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d431a86-e98c-4819-9f88-d1b5858f5b11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3f4e0002-4543-4482-a361-41825841eadc"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c868de8d-6e6e-48e8-817d-1d337efcd350"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1159c705-86b1-4a3c-b0a0-bb1c54bc762b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88197c90-015e-4fb1-8a38-db3a6e532e19"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f4e0002-4543-4482-a361-41825841eadc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b4fa047-c836-4afb-8b4d-032307250af1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88197c90-015e-4fb1-8a38-db3a6e532e19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b53d0ee-820d-436d-b28c-065482e686ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d431a86-e98c-4819-9f88-d1b5858f5b11"], "isController": false}, {"data": [0.475, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c868de8d-6e6e-48e8-817d-1d337efcd350"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b53d0ee-820d-436d-b28c-065482e686ec"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82ec94e5-3f38-4b3e-b098-89d92a1b86f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 43, 3.2950191570881224, 454.403831417624, 132, 3548, 150.0, 1250.0, 1597.5000000000002, 2021.94, 5.0721370604147875, 710.0262332179794, 3.728999245252402], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82ec94e5-3f38-4b3e-b098-89d92a1b86f4", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2400.875000000001, 1625, 4121, 2366.0, 2927.3, 3163.899999999999, 4121.0, 0.25129461601285197, 302.39239012731883, 1.2356136636960053], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 170.75000000000003, 140, 554, 145.0, 272.60000000000025, 554.0, 554.0, 0.09512145821195439, 0.07384917898291381, 0.03381270584878066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 447.5882352941176, 281, 1559, 293.0, 1022.9999999999995, 1559.0, 1559.0, 0.11673258624478136, 8.385138783028456, 0.2607774325869314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 454.00000000000006, 272, 847, 547.0, 689.2, 847.0, 847.0, 0.06871309534171023, 0.10649187725321692, 0.15453736188667835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 197.8, 135, 423, 144.0, 423.0, 423.0, 423.0, 0.041165138067873086, 0.03059245123989396, 0.020662969694225354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 198.2, 134, 429, 140.0, 429.0, 429.0, 429.0, 0.041168527484108944, 0.01101579739320884, 0.023478925830780886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 249.8, 133, 430, 144.0, 430.0, 430.0, 430.0, 0.04107012312822914, 0.011069681624405511, 0.024144740354681584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c91d34a6-60c6-4451-b539-7a6bee4b0bf9", 3, 0, 0.0, 325.6666666666667, 240, 487, 250.0, 487.0, 487.0, 487.0, 0.017114007815396903, 0.023593041373113896, 0.010974803188910124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 194.0, 135, 414, 137.0, 414.0, 414.0, 414.0, 0.04107552145374486, 0.011071136641829668, 0.024188026793562644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 142.66666666666666, 141, 145, 142.0, 145.0, 145.0, 145.0, 0.053482609238229374, 0.015773191396430925, 0.03306102699980389], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1659.5892857142862, 1069, 3548, 1599.5, 2306.4, 2473.0999999999995, 3548.0, 0.24861927509722787, 297.4350870611426, 0.49092595141269024], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 521.2142857142858, 141, 1229, 495.5, 1041.5, 1229.0, 1229.0, 0.08261146647154624, 0.016947567166072652, 0.05530289088500484], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 521.2142857142858, 141, 1229, 495.5, 1041.5, 1229.0, 1229.0, 0.0802586622027563, 0.016464894359535874, 0.05372784466795845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b4fa047-c836-4afb-8b4d-032307250af1", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 12, 50.0, 676.2916666666667, 148, 1258, 583.0, 1245.0, 1255.5, 1258.0, 0.09385228432549536, 0.0287789231232476, 0.04234351109216685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 174.74999999999997, 133, 425, 141.0, 413.1, 425.0, 425.0, 0.09137218173926949, 0.0330264929357882, 0.051631082674692186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 245.83333333333334, 135, 540, 143.0, 507.3000000000001, 540.0, 540.0, 0.06091246878235975, 0.016417813851495402, 0.035869354175549734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 157.81249999999997, 134, 408, 141.0, 226.7000000000002, 408.0, 408.0, 0.09137844382510166, 0.06790917553799058, 0.04586769543564673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 224.91666666666666, 139, 557, 144.5, 519.2000000000002, 557.0, 557.0, 0.06091123203118655, 0.01641748050840575, 0.03580914226833428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 224.625, 134, 1191, 141.0, 659.7000000000005, 1191.0, 1191.0, 0.09137792195183242, 1.7023488230809207, 0.05331866051388658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 351.37499999999994, 134, 1628, 143.0, 910.5000000000007, 1628.0, 1628.0, 0.09137583451836369, 5.161847885291917, 0.05322820829121479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 211.5, 133, 431, 142.0, 429.6, 431.0, 431.0, 0.09736742816109441, 0.02624356462154498, 0.057241398196268396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 247.0625, 132, 430, 148.0, 427.2, 430.0, 430.0, 0.09754372702387992, 0.026291082674405136, 0.057440300190819915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 176.8125, 138, 423, 143.0, 406.90000000000003, 423.0, 423.0, 0.09753540230305469, 0.07248480581310997, 0.0489581999841505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 190.49999999999997, 132, 445, 140.0, 444.4, 445.0, 445.0, 0.06100350770169285, 0.01632320420924203, 0.0347910629861217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 243.75, 137, 421, 146.5, 418.9, 421.0, 421.0, 0.09738046547862499, 0.026056882364397703, 0.05553729671827831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 190.91666666666663, 134, 445, 144.5, 437.20000000000005, 445.0, 445.0, 0.06099823613433845, 0.04533169697092926, 0.030618255247119103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/754436a2-9fc1-4c7c-aa81-a95715b9d5df", 3, 0, 0.0, 316.0, 238, 468, 242.0, 468.0, 468.0, 468.0, 0.03414872909813207, 0.0277569585149856, 0.02189876182399745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 191.41666666666666, 137, 426, 146.5, 423.90000000000003, 426.0, 426.0, 0.06111348774674571, 0.04810299914441117, 0.021723935097476013], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 436.5, 139, 797, 480.0, 679.5, 797.0, 797.0, 0.07940739396276927, 0.01582498078624664, 0.05403314230655791], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=754436a2-9fc1-4c7c-aa81-a95715b9d5df", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 997.1999999999998, 797, 1794, 883.0, 1282.6000000000001, 1768.5499999999997, 1794.0, 0.08483239240071429, 0.04390739059802595, 0.039019586739000425], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 250.0666666666667, 139, 561, 240.0, 448.20000000000005, 561.0, 561.0, 0.07580275113451451, 0.13133714947544495, 0.04898555389070254], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 442.66666666666663, 282, 977, 295.0, 950.9000000000001, 977.0, 977.0, 0.060864581378481324, 0.09432821352309557, 0.13688587003383057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecc69623-169c-484a-96f1-34b99c264cf1", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 160.88235294117646, 134, 446, 142.0, 216.3999999999998, 446.0, 446.0, 0.11684651866107637, 0.08683613349714757, 0.058651475187298095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 206.35294117647058, 134, 423, 142.0, 420.6, 423.0, 423.0, 0.1168489280829215, 0.041589841360396465, 0.06606314052114622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 962.0, 691, 1198, 968.0, 1198.0, 1198.0, 1198.0, 0.0542318955855237, 15.94597797055208, 0.030929127951118983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1371.1111111111113, 1110, 1594, 1372.0, 1594.0, 1594.0, 1594.0, 0.054094665664913597, 48.674475253568744, 0.030798037190082644], "isController": false}, {"data": ["addBook", 57, 18, 31.57894736842105, 1266.9999999999998, 684, 3083, 1002.0, 2384.0, 2727.199999999999, 3083.0, 0.263653309774137, 61.8828169086765, 0.9617329047425217], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 333.55555555555554, 138, 445, 419.0, 445.0, 445.0, 445.0, 0.05445733267984534, 0.09636395196863258, 0.030153620731906552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 166.25, 134, 446, 144.0, 357.20000000000033, 446.0, 446.0, 0.07686001229760196, 0.05711959898288584, 0.03858012336031974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 225.08333333333331, 136, 575, 145.0, 535.4000000000001, 575.0, 575.0, 0.07685804319422027, 0.020565531089078472, 0.04383310275920375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecc69623-169c-484a-96f1-34b99c264cf1", 3, 0, 0.0, 584.0, 336, 939, 477.0, 939.0, 939.0, 939.0, 0.04784765307261679, 0.03076143060495383, 0.030683553565447615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 165.08333333333334, 132, 430, 141.0, 345.4000000000003, 430.0, 430.0, 0.07686247381871986, 0.020716838646451838, 0.04518672777233335], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 260.53571428571433, 139, 604, 149.0, 571.7, 598.15, 604.0, 0.24987617742993426, 0.18569899514080077, 0.120789753738103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 189.0, 133, 444, 142.0, 435.90000000000003, 444.0, 444.0, 0.07686542785218778, 0.02071763485078499, 0.04526352831530199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c91d34a6-60c6-4451-b539-7a6bee4b0bf9", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 914.0892857142858, 666, 1320, 879.5, 1181.3, 1256.2, 1320.0, 0.24982267051512544, 73.45616002480382, 0.1256432376125875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 142.77777777777777, 138, 149, 142.0, 149.0, 149.0, 149.0, 0.054455685173532116, 0.040469508219783144, 0.03057814353005954], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 214.26785714285708, 134, 603, 144.0, 443.6, 461.2999999999999, 603.0, 0.2504304272969166, 0.4431444670527469, 0.12179136015025825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 860.8499999999998, 134, 1919, 419.5, 1780.6000000000004, 1912.6499999999999, 1919.0, 0.09327836128574893, 37.78324284117726, 0.05123022498740742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 250.94117647058818, 134, 1416, 142.0, 637.5999999999993, 1416.0, 1416.0, 0.11684732179065084, 6.2143135069489785, 0.06810276464200042], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1394.607142857143, 927, 2953, 1379.5, 1800.7, 2014.0999999999995, 2953.0, 0.24933436628999364, 224.35150107080204, 0.12515416432915696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 588.2, 133, 1281, 154.5, 1265.4, 1280.25, 1281.0, 0.09327357606226945, 12.355314830382001, 0.05131868432957285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 144.73333333333332, 138, 158, 142.0, 156.2, 158.0, 158.0, 0.0723672784113935, 0.054063445297574245, 0.025724305997800033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 211.11764705882348, 133, 1064, 141.0, 547.1999999999996, 1064.0, 1064.0, 0.1168489280829215, 2.0506691534295163, 0.06821781112745469], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 600.0, 141, 2548, 460.5, 1855.0, 2548.0, 2548.0, 0.07948719404527363, 0.016306629302954085, 0.05358842985822891], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 18, 10.588235294117647, 187.25294117647047, 134, 1001, 144.0, 253.9, 367.29999999999984, 964.0799999999996, 0.704266196051138, 1.5039166068558243, 0.3363914863020225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 147.0, 135, 159, 147.0, 159.0, 159.0, 159.0, 0.03994407829039345, 0.030933255941681646, 0.014198871579788297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 418.75, 283, 891, 296.0, 836.7000000000002, 891.0, 891.0, 0.07678673125283951, 0.11900443603345343, 0.1726951582766498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 164.875, 140, 471, 143.0, 248.40000000000023, 471.0, 471.0, 0.08788890841975742, 0.07132390907892423, 0.03124176041483565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1159c705-86b1-4a3c-b0a0-bb1c54bc762b", 3, 0, 0.0, 860.3333333333334, 242, 1847, 492.0, 1847.0, 1847.0, 1847.0, 0.03597596805334037, 0.029991684304884338, 0.023070526388372568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 407.50000000000006, 178, 946, 370.5, 703.7000000000004, 934.7999999999998, 946.0, 0.08487199181833999, 0.05213328403685142, 0.03837473848817521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 155.40000000000003, 134, 442, 140.0, 148.9, 427.3499999999998, 442.0, 0.09327662114767556, 0.06931983270837998, 0.04682049147451683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d431a86-e98c-4819-9f88-d1b5858f5b11", 3, 0, 0.0, 420.66666666666663, 232, 797, 233.0, 797.0, 797.0, 797.0, 0.06851035648222156, 0.030999152184338533, 0.0439340502180913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 226.55, 134, 447, 141.5, 444.20000000000005, 446.95, 447.0, 0.09327705617610708, 0.08800289450364947, 0.04967185423128046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f4e0002-4543-4482-a361-41825841eadc", 3, 0, 0.0, 523.3333333333334, 489, 561, 520.0, 561.0, 561.0, 561.0, 0.02082089862998487, 0.028689734342684226, 0.01335194345737962], "isController": false}, {"data": ["login", 20, 0, 0.0, 2416.0000000000005, 1351, 3339, 2529.0, 3066.9, 3325.45, 3339.0, 0.08571955134386826, 46.25974875733438, 0.19329591407043575], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c868de8d-6e6e-48e8-817d-1d337efcd350", 3, 0, 0.0, 363.0, 245, 471, 373.0, 471.0, 471.0, 471.0, 0.060156406657309, 0.02721920743934229, 0.03857686234208944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 455.6, 270, 854, 299.0, 854.0, 854.0, 854.0, 0.04101958274880428, 0.06357234162339101, 0.0922540029985315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1159c705-86b1-4a3c-b0a0-bb1c54bc762b", 1, 0, 0.0, 1162.0, 1162, 1162, 1162.0, 1162.0, 1162.0, 1162.0, 0.8605851979345955, 0.15547681798623064, 0.5933331540447505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 145.8235294117647, 140, 151, 145.0, 151.0, 151.0, 151.0, 0.11779134302917761, 0.09536037438592601, 0.04187114146740298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 498.0, 281, 842, 564.5, 833.6, 842.0, 842.0, 0.0972804046864835, 0.15076562718500908, 0.2187859101493862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88197c90-015e-4fb1-8a38-db3a6e532e19", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f4e0002-4543-4482-a361-41825841eadc", 1, 0, 0.0, 2548.0, 2548, 2548, 2548.0, 2548.0, 2548.0, 2548.0, 0.3924646781789639, 0.07090426314756672, 0.270585998822606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b4fa047-c836-4afb-8b4d-032307250af1", 3, 0, 0.0, 555.3333333333334, 240, 962, 464.0, 962.0, 962.0, 962.0, 0.021824054472839964, 0.025795293551719372, 0.013995243265460524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88197c90-015e-4fb1-8a38-db3a6e532e19", 3, 0, 0.0, 321.6666666666667, 232, 499, 234.0, 499.0, 499.0, 499.0, 0.018432613437375196, 0.02178672506221007, 0.011820393382691776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b53d0ee-820d-436d-b28c-065482e686ec", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 170.58333333333334, 136, 418, 149.0, 340.0000000000003, 418.0, 418.0, 0.077716683829101, 0.06443502399502612, 0.027625852454875748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d431a86-e98c-4819-9f88-d1b5858f5b11", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1019.7500000000002, 279, 2056, 715.0, 1916.6000000000004, 2049.6, 2056.0, 0.09321228165023024, 50.26088606575428, 0.19890444983781064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 146.1, 141, 152, 145.5, 151.9, 152.0, 152.0, 0.09549411040074103, 0.07413849391463781, 0.033945172056513415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c868de8d-6e6e-48e8-817d-1d337efcd350", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b53d0ee-820d-436d-b28c-065482e686ec", 3, 0, 0.0, 541.6666666666666, 243, 899, 483.0, 899.0, 899.0, 899.0, 0.048154093097913325, 0.030958442014446228, 0.03088006621187801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 530.0, 279, 1763, 428.5, 1107.1000000000006, 1763.0, 1763.0, 0.09130022939182635, 6.959329893763623, 0.20387635452449698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 913.6250000000002, 139, 1737, 1320.0, 1708.3, 1737.0, 1737.0, 0.09263333410527778, 62.348034744013574, 0.1442476961076631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82ec94e5-3f38-4b3e-b098-89d92a1b86f4", 3, 0, 0.0, 345.0, 231, 562, 242.0, 562.0, 562.0, 562.0, 0.018022780794924788, 0.02130231675337627, 0.011557577527995386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 160.86666666666667, 134, 419, 142.0, 260.6000000000001, 419.0, 419.0, 0.06884018063663398, 0.051159548305154755, 0.034554543796122925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 211.86666666666667, 132, 427, 141.0, 421.6, 427.0, 427.0, 0.0687612883114978, 0.018399016598975, 0.03921542224015109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 179.13333333333335, 133, 425, 141.0, 423.8, 425.0, 425.0, 0.0688420762770205, 0.018555090871540687, 0.04047161124879527], "isController": false}, {"data": ["register", 24, 12, 50.0, 676.2916666666667, 148, 1258, 583.0, 1245.0, 1255.5, 1258.0, 0.09593859929645028, 0.029418672049888073, 0.04328479772945315], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 272.6, 134, 443, 145.0, 433.4, 443.0, 443.0, 0.06884460395994162, 0.018555772161078014, 0.04054032830844218], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 12, 27.906976744186046, 0.9195402298850575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.30232558139535, 0.3065134099616858], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.976744186046512, 0.22988505747126436], "isController": false}, {"data": ["401/Unauthorized", 24, 55.81395348837209, 1.839080459770115], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 43, "401/Unauthorized", 24, "406/Not Acceptable", 12, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 12, "406/Not Acceptable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
