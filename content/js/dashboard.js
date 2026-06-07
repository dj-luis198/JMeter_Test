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

    var data = {"OkPercent": 98.71309613928842, "KoPercent": 1.2869038607115821};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7631061598951507, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba4b01e6-e407-42b2-a9e3-ead4120919a4"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ed6db1b-b0b4-4e45-bfd9-ead2e4b390b1"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba4b01e6-e407-42b2-a9e3-ead4120919a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b5844661-3fdd-4840-8e55-cc6bf8d520c1"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2ae8e1e-c7ab-4cd2-85c1-cd98979bf3c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f5e74fb-0174-4c79-89a2-97e4a32697a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d34c49d-c2d8-4943-975b-f7f02d74fa99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d3435ca-c7a0-4fcb-8a61-69a741e37b46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d3435ca-c7a0-4fcb-8a61-69a741e37b46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/502c1d7c-440b-4cfe-beaf-603899b23202"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5844661-3fdd-4840-8e55-cc6bf8d520c1"], "isController": false}, {"data": [0.9581005586592178, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=502c1d7c-440b-4cfe-beaf-603899b23202"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8103639c-e45b-4015-a9c3-0f9696c5706d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f5e74fb-0174-4c79-89a2-97e4a32697a5"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a47d14e6-b2f7-4791-89e1-69a6cd561dba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2ae8e1e-c7ab-4cd2-85c1-cd98979bf3c8"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ed6db1b-b0b4-4e45-bfd9-ead2e4b390b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a47d14e6-b2f7-4791-89e1-69a6cd561dba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c64a4dee-f557-4e8c-a4e2-7da1247ec37d"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62d35841-7798-4035-8152-eab314bf17c4"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a13b138b-518d-44d2-8652-cfb635c6d07d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c64a4dee-f557-4e8c-a4e2-7da1247ec37d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62d35841-7798-4035-8152-eab314bf17c4"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a13b138b-518d-44d2-8652-cfb635c6d07d"], "isController": false}, {"data": [0.225, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 17, 1.2869038607115821, 431.0507191521574, 126, 2520, 144.0, 1188.0, 1486.9999999999973, 1932.0999999999988, 5.167160174142295, 705.2872593356523, 3.80021409024146], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2152.5263157894738, 1583, 3061, 2152.0, 2530.6, 2644.0999999999995, 3061.0, 0.25323091549639926, 304.72208670604334, 1.2451344331292677], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 406.8823529411764, 265, 791, 270.0, 694.1999999999999, 791.0, 791.0, 0.10801812162840495, 0.16740699123464714, 0.2429352872170084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 138.25, 133, 164, 136.5, 148.60000000000002, 164.0, 164.0, 0.15885781232935198, 0.12333199297054181, 0.05646898797644933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 497.62500000000006, 266, 1565, 523.0, 1023.9000000000005, 1565.0, 1565.0, 0.07940604279985708, 6.052699440993866, 0.177316252555882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 176.91666666666666, 132, 395, 133.0, 394.1, 395.0, 395.0, 0.06221097816394667, 0.04623296326441739, 0.031226994898699793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 176.00000000000003, 130, 397, 133.0, 394.90000000000003, 397.0, 397.0, 0.06221162320493546, 0.01664646949038312, 0.035480066359064755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 197.91666666666663, 130, 397, 132.5, 395.8, 397.0, 397.0, 0.062210010627543486, 0.01676754192695508, 0.036572682029083176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 217.66666666666669, 128, 394, 133.0, 393.4, 394.0, 394.0, 0.062129166537230905, 0.016745751918238017, 0.03658582756049828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 2.152714416058394, 4.512146441605839], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1471.2631578947369, 1041, 2520, 1350.0, 1962.4, 2101.7999999999993, 2520.0, 0.2586277303374865, 309.408679030509, 0.5106887409593728], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 528.1666666666666, 144, 926, 495.0, 850.4000000000003, 926.0, 926.0, 0.07028971075784023, 0.013368087080165415, 0.047494748406766554], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 528.1666666666666, 144, 926, 495.0, 850.4000000000003, 926.0, 926.0, 0.07032678512822917, 0.013375138089572882, 0.04751979955401097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 1190.35, 249, 2181, 1169.5, 2060.6000000000004, 2175.9, 2181.0, 0.08054285886877556, 0.025264029559229205, 0.036338672653685844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 208.41176470588235, 129, 400, 132.0, 397.6, 400.0, 400.0, 0.08165853283633709, 0.029064583493448103, 0.04616746784094839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 218.5, 127, 396, 133.0, 396.0, 396.0, 396.0, 0.030980373933113373, 0.008350178911659465, 0.018243325665690785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 166.88235294117646, 131, 392, 135.0, 384.0, 392.0, 392.0, 0.08165657167285495, 0.06068422953422131, 0.04098777132797602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 174.5, 132, 384, 132.5, 384.0, 384.0, 384.0, 0.030979574134120905, 0.008349963340837275, 0.018212601199942172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba4b01e6-e407-42b2-a9e3-ead4120919a4", 3, 0, 0.0, 556.0, 218, 952, 498.0, 952.0, 952.0, 952.0, 0.045382346267302025, 0.029176475871719232, 0.029102611375841463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 216.35294117647058, 126, 787, 133.0, 474.1999999999997, 787.0, 787.0, 0.08165970957964463, 1.433107263030728, 0.04767392167152622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 241.2941176470588, 129, 1441, 134.0, 606.5999999999992, 1441.0, 1441.0, 0.08165853283633709, 4.342861400551915, 0.04759349001364178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 164.0625, 127, 392, 132.5, 389.9, 392.0, 392.0, 0.15284531099244372, 0.04119658772843209, 0.08985632540766711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 182.0625, 128, 400, 133.0, 397.9, 400.0, 400.0, 0.15284239083709866, 0.04119580065531175, 0.09000386882301806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 175.5, 127, 398, 132.0, 398.0, 398.0, 398.0, 0.030979414179277874, 0.008289413559689587, 0.01766794714911941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 149.81249999999997, 128, 389, 134.0, 216.80000000000018, 389.0, 389.0, 0.15284239083709866, 0.11358697209671101, 0.07671971571315304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 220.33333333333331, 128, 399, 134.0, 399.0, 399.0, 399.0, 0.030979734090615725, 0.023023025041951722, 0.015550374338453594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 149.0625, 126, 398, 133.0, 214.6000000000002, 398.0, 398.0, 0.15284677111196024, 0.04089845242644249, 0.08717042414978983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 179.16666666666669, 133, 392, 137.0, 392.0, 392.0, 392.0, 0.03196164602477027, 0.025157311226528166, 0.01136136636036756], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 480.41666666666663, 134, 673, 479.5, 662.5, 673.0, 673.0, 0.06883220429398235, 0.012934046200749125, 0.04684600622644648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ed6db1b-b0b4-4e45-bfd9-ead2e4b390b1", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1357.4736842105265, 842, 2358, 1304.0, 1854.0, 2358.0, 2358.0, 0.08092923802992678, 0.0418872032772082, 0.037224288195405776], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 245.08333333333337, 133, 403, 233.0, 374.5000000000001, 403.0, 403.0, 0.07047547453486186, 0.184017382849206, 0.045555557798698555], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba4b01e6-e407-42b2-a9e3-ead4120919a4", 1, 0, 0.0, 1002.0, 1002, 1002, 1002.0, 1002.0, 1002.0, 1002.0, 0.998003992015968, 0.18030345558882235, 0.6880769710578842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 442.5, 261, 797, 268.0, 797.0, 797.0, 797.0, 0.030958634105063283, 0.04797983625462445, 0.06962669369527417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 148.88235294117646, 128, 397, 134.0, 188.99999999999983, 397.0, 397.0, 0.10810948310948311, 0.0803430826624186, 0.054265892888939765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 163.05882352941177, 128, 395, 133.0, 392.6, 395.0, 395.0, 0.10811360832347591, 0.02892883660218008, 0.06165854224698236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1065.5, 777, 1193, 1096.5, 1193.0, 1193.0, 1193.0, 0.05939535528321685, 17.464206564671642, 0.03387391355995961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1446.8333333333335, 1290, 1577, 1434.0, 1577.0, 1577.0, 1577.0, 0.05933837709538644, 53.39277601616971, 0.03378347055333037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5844661-3fdd-4840-8e55-cc6bf8d520c1", 3, 0, 0.0, 944.0, 231, 1963, 638.0, 1963.0, 1963.0, 1963.0, 0.03156167150612296, 0.026311666903379202, 0.020239743771830156], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1210.196721311476, 669, 2407, 1059.0, 2183.0, 2282.0, 2407.0, 0.29347522780413177, 70.14578987083482, 1.0728543608133594], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 216.16666666666669, 126, 396, 132.5, 396.0, 396.0, 396.0, 0.06002521058844715, 0.10621648592408812, 0.033236615628564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2ae8e1e-c7ab-4cd2-85c1-cd98979bf3c8", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f5e74fb-0174-4c79-89a2-97e4a32697a5", 3, 0, 0.0, 349.6666666666667, 240, 488, 321.0, 488.0, 488.0, 488.0, 0.01915635416267576, 0.02640858068975646, 0.012284510970205484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d34c49d-c2d8-4943-975b-f7f02d74fa99", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.8230307667525772, 1.5378342461340206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 150.86666666666667, 126, 399, 133.0, 243.60000000000008, 399.0, 399.0, 0.09059721685349827, 0.06732859572803923, 0.04547555611591612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d3435ca-c7a0-4fcb-8a61-69a741e37b46", 3, 0, 0.0, 297.0, 219, 440, 232.0, 440.0, 440.0, 440.0, 0.020115867396202126, 0.023894140666908058, 0.012899823818528056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 218.9333333333333, 130, 396, 134.0, 394.8, 396.0, 396.0, 0.09046662686135085, 0.024206890390634898, 0.05159424813186416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 166.66666666666666, 126, 396, 133.0, 390.0, 396.0, 396.0, 0.09046280772431761, 0.02438255364444498, 0.053182236572303906], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 237.33333333333334, 130, 540, 135.0, 535.0, 536.2, 540.0, 0.2604880723882643, 0.1935853741088566, 0.12591952717987387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 218.73333333333332, 128, 401, 132.0, 399.2, 401.0, 401.0, 0.09060268908781213, 0.024420256043199362, 0.05335295070307687], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 852.6842105263158, 632, 1297, 784.0, 1140.2, 1191.2, 1297.0, 0.2599048839319505, 76.42066553034276, 0.13071388205561965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 130.66666666666669, 126, 133, 132.0, 133.0, 133.0, 133.0, 0.0600294144130624, 0.04461170348470751, 0.033707923132334845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d3435ca-c7a0-4fcb-8a61-69a741e37b46", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 208.54385964912277, 127, 404, 136.0, 397.2, 399.0, 404.0, 0.26099379109507503, 0.461836669398707, 0.12692862105990954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 848.421052631579, 130, 1703, 1095.0, 1587.0, 1703.0, 1703.0, 0.09030761625917336, 42.77939921372961, 0.049006363716301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 148.2941176470588, 129, 397, 133.0, 188.19999999999982, 397.0, 397.0, 0.10811223321716568, 0.02913962535931419, 0.06355816835618529], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1232.421052631579, 905, 1980, 1183.0, 1551.8, 1585.8999999999996, 1980.0, 0.25927593782835934, 233.2969446164422, 0.1301443672302507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 139.625, 132, 187, 136.0, 157.60000000000002, 187.0, 187.0, 0.07594780487110234, 0.05673835031874345, 0.02699707126277466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 621.421052631579, 131, 1060, 780.0, 1058.0, 1060.0, 1060.0, 0.09041849486518126, 14.004196429421228, 0.049154832452149584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 224.94117647058823, 127, 536, 133.0, 535.2, 536.0, 536.0, 0.10811154567712805, 0.029139440045788417, 0.06366334183916818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/502c1d7c-440b-4cfe-beaf-603899b23202", 3, 0, 0.0, 378.3333333333333, 235, 471, 429.0, 471.0, 471.0, 471.0, 0.016533480297602647, 0.022792737324331774, 0.010602524800220448], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 516.7500000000001, 137, 1002, 512.0, 885.9000000000004, 1002.0, 1002.0, 0.07049037806339435, 0.013406251101412157, 0.04818104535762119], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5844661-3fdd-4840-8e55-cc6bf8d520c1", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 7, 3.910614525139665, 182.7318435754189, 129, 509, 138.0, 293.0, 334.0, 495.3999999999998, 0.7709768147028293, 1.5715777876303445, 0.3723651113609248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 163.08333333333334, 133, 409, 138.0, 334.3000000000003, 409.0, 409.0, 0.0651430432658379, 0.050447688779110794, 0.023156316160903315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=502c1d7c-440b-4cfe-beaf-603899b23202", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 424.2666666666667, 260, 794, 520.0, 637.4000000000001, 794.0, 794.0, 0.09038594799795126, 0.1400805658913561, 0.20328011546804856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 152.23529411764707, 133, 400, 136.0, 195.19999999999982, 400.0, 400.0, 0.08332108023329902, 0.06761700944714012, 0.029618040239180514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8103639c-e45b-4015-a9c3-0f9696c5706d", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f5e74fb-0174-4c79-89a2-97e4a32697a5", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 621.8421052631579, 172, 1852, 527.0, 1158.0, 1852.0, 1852.0, 0.08180135187497309, 0.05024711946226374, 0.036986353435656774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 134.36842105263153, 131, 149, 134.0, 137.0, 149.0, 149.0, 0.09041892515692442, 0.0671960957465034, 0.04538606204165933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a47d14e6-b2f7-4791-89e1-69a6cd561dba", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 230.26315789473685, 130, 405, 135.0, 401.0, 405.0, 405.0, 0.090304611713934, 0.09554948276845422, 0.04751017709209644], "isController": false}, {"data": ["login", 19, 0, 0.0, 2936.5789473684217, 1403, 4364, 2932.0, 4223.0, 4364.0, 4364.0, 0.08087136770508341, 30.661920173575492, 0.16436556811071715], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 441.5833333333333, 265, 792, 397.5, 789.9, 792.0, 792.0, 0.06208480784751971, 0.09621932622462284, 0.13963018796175578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 151.8235294117647, 133, 394, 136.0, 196.3999999999998, 394.0, 394.0, 0.10375343301800427, 0.08399569919133354, 0.03688110314311871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2ae8e1e-c7ab-4cd2-85c1-cd98979bf3c8", 3, 0, 0.0, 405.3333333333333, 308, 458, 450.0, 458.0, 458.0, 458.0, 0.018265618626060166, 0.025180629844194273, 0.011713303611112802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 350.1875, 262, 782, 268.5, 613.3000000000002, 782.0, 782.0, 0.15264699428527814, 0.23657302727610982, 0.34330666781151914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ed6db1b-b0b4-4e45-bfd9-ead2e4b390b1", 3, 0, 0.0, 414.33333333333337, 217, 673, 353.0, 673.0, 673.0, 673.0, 0.04176644205602272, 0.02685179787130367, 0.026783818636186445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 174.6666666666667, 133, 396, 140.0, 389.4, 396.0, 396.0, 0.09195458669478435, 0.0762396915076874, 0.03268698198916162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 998.6315789473683, 266, 1841, 1230.0, 1719.0, 1841.0, 1841.0, 0.09024713465347475, 56.890961534236915, 0.19081498654605217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a47d14e6-b2f7-4791-89e1-69a6cd561dba", 3, 0, 0.0, 364.3333333333333, 280, 469, 344.0, 469.0, 469.0, 469.0, 0.01630496812378732, 0.02247771484512998, 0.010455985417923508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 152.6315789473684, 133, 401, 136.0, 179.0, 401.0, 401.0, 0.09022185078255585, 0.07004528454309755, 0.03207104852036165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c64a4dee-f557-4e8c-a4e2-7da1247ec37d", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 470.82352941176464, 264, 1575, 272.0, 946.9999999999994, 1575.0, 1575.0, 0.08160443928149692, 5.861812632607214, 0.18230210473449757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62d35841-7798-4035-8152-eab314bf17c4", 3, 0, 0.0, 425.3333333333333, 330, 543, 403.0, 543.0, 543.0, 543.0, 0.018235308419849744, 0.02155351721109193, 0.01169386640205208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1217.0, 133, 1708, 1530.0, 1708.0, 1708.0, 1708.0, 0.0790185891230912, 70.90556383467336, 0.14672262684952886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a13b138b-518d-44d2-8652-cfb635c6d07d", 3, 0, 0.0, 987.3333333333334, 217, 2251, 494.0, 2251.0, 2251.0, 2251.0, 0.021471821812508052, 0.025378966471750242, 0.013769364899297157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c64a4dee-f557-4e8c-a4e2-7da1247ec37d", 3, 0, 0.0, 323.3333333333333, 240, 459, 271.0, 459.0, 459.0, 459.0, 0.030927197377373667, 0.031017804400940187, 0.0198328707140059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 153.0, 131, 399, 133.5, 241.50000000000017, 399.0, 399.0, 0.07945888499319634, 0.05905098777326407, 0.0398846356313505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 197.81249999999997, 130, 399, 134.0, 394.8, 399.0, 399.0, 0.07946006883228462, 0.02872085739897397, 0.044899982742266295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62d35841-7798-4035-8152-eab314bf17c4", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 277.43749999999994, 128, 1430, 134.0, 704.1000000000008, 1430.0, 1430.0, 0.07945849038800575, 4.488633594863505, 0.04628612257465373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a13b138b-518d-44d2-8652-cfb635c6d07d", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["register", 20, 6, 30.0, 1190.35, 249, 2181, 1169.5, 2060.6000000000004, 2175.9, 2181.0, 0.08060161042017619, 0.025282458268516207, 0.03636517970129043], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 269.75000000000006, 128, 1039, 132.5, 591.0000000000005, 1039.0, 1039.0, 0.0794592796023063, 1.480307367737546, 0.04636417926013479], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.45420136260408783], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.0757002271006813], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.0757002271006813], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.6813020439061317], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 17, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
