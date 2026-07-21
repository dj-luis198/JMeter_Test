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

    var data = {"OkPercent": 97.61171032357473, "KoPercent": 2.3882896764252695};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7894910773298083, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4017857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f663e06a-778f-4b40-88d6-67b751c94a7b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49982dbe-7305-45a0-bf57-8384e16fab30"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8eb9406e-a208-4853-8ce1-373b4f1d48e0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbd7a9ad-404e-42c8-862e-d3093e2f9955"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eaa90b27-f68d-4c42-a0d7-927721142bcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=deeaec6f-bc13-4541-bd7a-6e276570371d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c98d46e0-6a43-4882-bf3e-22925e89fec3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2b2428c9-b13c-440a-bb3c-eafc0d7e9c03"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ef92525-46f4-449f-9cc2-c9b38ed1d0ba"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b2428c9-b13c-440a-bb3c-eafc0d7e9c03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58f7ec6e-706f-405d-accf-a8627845e8ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1665d0b0-6239-4dbe-a040-e4e55bc035fd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a2b56108-44d0-41a1-b408-ed4b56eb973c"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82a8186e-18f4-42a6-9738-39f08cba1bd6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdb493b0-b6f6-4cec-b3c9-944ae26e4fef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3121a3f0-0461-4eb5-82d3-62ea6eb958ec"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/deeaec6f-bc13-4541-bd7a-6e276570371d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/49982dbe-7305-45a0-bf57-8384e16fab30"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82a8186e-18f4-42a6-9738-39f08cba1bd6"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8eb9406e-a208-4853-8ce1-373b4f1d48e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c98d46e0-6a43-4882-bf3e-22925e89fec3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f663e06a-778f-4b40-88d6-67b751c94a7b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7946428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9088235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaa90b27-f68d-4c42-a0d7-927721142bcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdb493b0-b6f6-4cec-b3c9-944ae26e4fef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62ed3116-942a-4268-918e-918e89a73ef5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ef92525-46f4-449f-9cc2-c9b38ed1d0ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2b56108-44d0-41a1-b408-ed4b56eb973c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 31, 2.3882896764252695, 321.7241910631745, 77, 3932, 95.0, 861.1000000000001, 1103.1499999999999, 1989.3699999999997, 5.060803724252479, 721.6162957124504, 3.6962449521114626], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1320.267857142857, 962, 1834, 1288.5, 1640.0, 1678.7, 1834.0, 0.2645877628159698, 318.38788056638316, 1.3009759626742263], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f663e06a-778f-4b40-88d6-67b751c94a7b", 3, 0, 0.0, 1415.0, 428, 2765, 1052.0, 2765.0, 2765.0, 2765.0, 0.06196810708088904, 0.028038954701313724, 0.03973866241840866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49982dbe-7305-45a0-bf57-8384e16fab30", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 626.7857142857143, 83, 1533, 548.0, 1274.0, 1533.0, 1533.0, 0.08100633006607802, 0.01661827683623992, 0.054228358652633285], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 626.7857142857143, 83, 1533, 548.0, 1274.0, 1533.0, 1533.0, 0.08072421149743411, 0.016560400810125123, 0.05403949900536239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 112.13333333333333, 78, 244, 80.0, 242.8, 244.0, 244.0, 0.1143196835631159, 0.05348315404196294, 0.06391780224219006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 97.2, 80, 237, 84.0, 166.80000000000004, 237.0, 237.0, 0.11432055483575947, 0.08495892795899702, 0.05738355975154332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 200.33333333333334, 78, 699, 86.0, 648.6, 699.0, 699.0, 0.11418392747036926, 4.503188110408246, 0.0659308107249157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8eb9406e-a208-4853-8ce1-373b4f1d48e0", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 219.0, 79, 882, 83.0, 870.0, 882.0, 882.0, 0.1143196835631159, 13.742044659937047, 0.06589755717889506], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 429.92857142857144, 82, 2765, 188.0, 1767.5, 2765.0, 2765.0, 0.07977389798058077, 0.13441812776359574, 0.051555884820736655], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cbd7a9ad-404e-42c8-862e-d3093e2f9955", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaa90b27-f68d-4c42-a0d7-927721142bcc", 3, 0, 0.0, 309.6666666666667, 179, 519, 231.0, 519.0, 519.0, 519.0, 0.024155950818484134, 0.024226720205647662, 0.015490632523572183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 89.7, 79, 237, 82.0, 84.9, 229.3999999999999, 237.0, 0.11657117544544761, 0.0866315083144391, 0.05851326579976569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 577.8333333333333, 485, 632, 619.0, 632.0, 632.0, 632.0, 0.03133175630159949, 9.2125766648912, 0.017868892265755956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 89.10000000000001, 79, 236, 81.0, 85.80000000000001, 228.4999999999999, 236.0, 0.11657185489135503, 0.03994635144665672, 0.06599287527394386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 852.6666666666666, 706, 1008, 855.0, 1008.0, 1008.0, 1008.0, 0.03125830298673085, 28.126275973696135, 0.017796475235609458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 183.66666666666669, 78, 239, 235.0, 239.0, 239.0, 239.0, 0.03137238498099356, 0.05551441561089877, 0.017371232699436866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=deeaec6f-bc13-4541-bd7a-6e276570371d", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 82.89999999999999, 79, 89, 82.0, 88.9, 89.0, 89.0, 0.048213450588445166, 0.035830503806451926, 0.02420089218990314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 114.5, 79, 251, 81.0, 250.6, 251.0, 251.0, 0.04821414795957726, 0.020142590329206202, 0.027092207749942143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 173.50000000000003, 79, 841, 81.0, 782.0000000000002, 841.0, 841.0, 0.04821414795957726, 4.350013206156465, 0.027930305243770735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 165.5, 78, 619, 81.0, 580.9000000000001, 619.0, 619.0, 0.04817721506790578, 1.4282568249047296, 0.027955958196630486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c98d46e0-6a43-4882-bf3e-22925e89fec3", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 153.0, 79, 347, 83.0, 347.0, 347.0, 347.0, 0.03139750285193984, 0.023333495771802947, 0.017630433730337312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 558.375, 79, 1066, 796.0, 1024.7, 1066.0, 1066.0, 0.11719379458857654, 59.330109569331114, 0.06323200342791849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 135.4, 77, 847, 82.0, 244.8, 816.9499999999996, 847.0, 0.11657321380693143, 5.27448825269867, 0.0680313989951389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 350.3125, 79, 707, 466.5, 653.1, 707.0, 707.0, 0.11719551141191292, 19.397216217478245, 0.0633473784829041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 129.64999999999998, 78, 742, 80.0, 244.60000000000002, 717.1499999999996, 742.0, 0.11657525223970203, 1.7436993808396917, 0.06814643163152895], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 410.2857142857143, 87, 783, 423.5, 755.5, 783.0, 783.0, 0.08088791823387008, 0.016593984899958978, 0.054532765745699936], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2b2428c9-b13c-440a-bb3c-eafc0d7e9c03", 3, 0, 0.0, 636.0, 565, 770, 573.0, 770.0, 770.0, 770.0, 0.02075148027225942, 0.020812275624619556, 0.013307427127718444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 289.79999999999995, 165, 923, 171.5, 863.7000000000002, 923.0, 923.0, 0.04815795810257645, 5.828537916867325, 0.10707620996869732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ef92525-46f4-449f-9cc2-c9b38ed1d0ba", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 739.4545454545454, 93, 2545, 449.5, 1777.8999999999996, 2446.4499999999985, 2545.0, 0.09543599064727291, 0.058622302848764324, 0.043151234052429065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.12500000000001, 78, 93, 83.0, 92.3, 93.0, 93.0, 0.11733216001173322, 0.0871970446962197, 0.05889524438088952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b2428c9-b13c-440a-bb3c-eafc0d7e9c03", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 140.06249999999997, 78, 247, 81.5, 244.9, 247.0, 247.0, 0.11733732280230862, 0.13052917757537089, 0.06137578469334624], "isController": false}, {"data": ["login", 22, 0, 0.0, 3066.818181818182, 1721, 5250, 2760.0, 4794.5, 5184.149999999999, 5250.0, 0.09639398852035228, 31.582595202755993, 0.18903114456907508], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 93.44999999999999, 83, 238, 85.0, 97.20000000000002, 230.9999999999999, 238.0, 0.11724566484154249, 0.09491860952503782, 0.041677169924142055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58f7ec6e-706f-405d-accf-a8627845e8ae", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1665d0b0-6239-4dbe-a040-e4e55bc035fd", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2b56108-44d0-41a1-b408-ed4b56eb973c", 3, 0, 0.0, 1236.0, 179, 3187, 342.0, 3187.0, 3187.0, 3187.0, 0.0796241738991958, 0.036960960931072005, 0.0510610750590546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 642.8125000000002, 160, 1152, 880.0, 1115.6000000000001, 1152.0, 1152.0, 0.117120018739203, 78.89480820910681, 0.24654964882294383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82a8186e-18f4-42a6-9738-39f08cba1bd6", 3, 0, 0.0, 343.0, 172, 482, 375.0, 482.0, 482.0, 482.0, 0.06486206001902621, 0.03006626740465277, 0.04159448510334688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb493b0-b6f6-4cec-b3c9-944ae26e4fef", 3, 0, 0.0, 594.3333333333334, 421, 706, 656.0, 706.0, 706.0, 706.0, 0.029098809858676782, 0.029184060278184622, 0.01866036960338322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3121a3f0-0461-4eb5-82d3-62ea6eb958ec", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 544.5833333333334, 82, 1310, 436.5, 1270.7, 1310.0, 1310.0, 0.055155930411601134, 33.00021329832464, 0.08045817485579022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 369.8666666666667, 163, 1099, 325.0, 1019.2, 1099.0, 1099.0, 0.11411269770024876, 18.355733200233548, 0.2527492245091252], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1261.1666666666665, 84, 3066, 1172.0, 2555.0, 3041.5, 3066.0, 0.09507134312039993, 0.029849059387899002, 0.042893516134399186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/deeaec6f-bc13-4541-bd7a-6e276570371d", 3, 0, 0.0, 341.6666666666667, 172, 454, 399.0, 454.0, 454.0, 454.0, 0.035076642463783364, 0.029241953564371485, 0.02249381043413191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 87.05555555555557, 81, 103, 87.0, 93.10000000000002, 103.0, 103.0, 0.09600870478923422, 0.07453800811273556, 0.0341280942805481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 243.49999999999997, 161, 927, 167.0, 459.50000000000034, 904.3499999999997, 927.0, 0.11651345147797314, 7.141074168458061, 0.26055093021426823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49982dbe-7305-45a0-bf57-8384e16fab30", 3, 0, 0.0, 538.0, 197, 898, 519.0, 898.0, 898.0, 898.0, 0.018710357430194776, 0.02579373818908687, 0.011998503951003811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 313.46666666666664, 165, 865, 321.0, 584.8000000000002, 865.0, 865.0, 0.08090658525666267, 6.569857021208313, 0.18058075926784933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.375, 79, 84, 81.5, 84.0, 84.0, 84.0, 0.042254041863191975, 0.03140168540809482, 0.021209548357110038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 81.0, 79, 83, 80.5, 83.0, 83.0, 83.0, 0.042254041863191975, 0.011306257295424416, 0.024098008250101676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 80.0, 77, 83, 80.0, 83.0, 83.0, 83.0, 0.04225538095866896, 0.011389145649016243, 0.024841542321404994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 80.125, 78, 85, 79.5, 85.0, 85.0, 85.0, 0.042255157770195326, 0.011389085492747959, 0.024882675913503693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 89.66666666666667, 87, 92, 90.0, 92.0, 92.0, 92.0, 0.03060131585658183, 0.009024997449890345, 0.018916633727750293], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 927.5535714285713, 625, 1473, 878.0, 1270.9, 1291.65, 1473.0, 0.27281939356146234, 326.38684206680176, 0.5387117322082781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1261.1666666666665, 84, 3066, 1172.0, 2555.0, 3041.5, 3066.0, 0.09436224880965954, 0.029626428703423385, 0.042573592724670616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 124.72727272727273, 78, 243, 85.0, 241.6, 243.0, 243.0, 0.04913126982000089, 0.013242412568672117, 0.02893179267720756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 111.18181818181819, 78, 243, 83.0, 241.8, 243.0, 243.0, 0.04916706521787714, 0.013252060547005949, 0.028904856700353556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82a8186e-18f4-42a6-9738-39f08cba1bd6", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 122.33333333333334, 77, 659, 81.5, 279.2000000000006, 659.0, 659.0, 0.09284715810323572, 4.66497025828274, 0.05414069310403524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 119.72222222222221, 79, 628, 80.0, 282.40000000000055, 628.0, 628.0, 0.09284715810323572, 1.5403097710028009, 0.05423136415687044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 82.09090909090911, 78, 92, 80.0, 91.4, 92.0, 92.0, 0.04916772451770932, 0.01315620753696519, 0.028040967889006098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 82.05555555555556, 79, 88, 81.0, 86.2, 88.0, 88.0, 0.09284667918377452, 0.06900031529184807, 0.046604680762168074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 96.63636363636364, 79, 243, 82.0, 211.40000000000012, 243.0, 243.0, 0.04916596642411456, 0.036538379344483576, 0.024679010490229383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 89.5, 78, 245, 80.0, 100.10000000000022, 245.0, 245.0, 0.092845721359674, 0.032590701887863, 0.05251787602517151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 86.9090909090909, 83, 97, 85.0, 96.2, 97.0, 97.0, 0.050515023627254234, 0.03976084867535831, 0.01795651230500053], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 628.2857142857143, 82, 3187, 488.5, 1991.0, 3187.0, 3187.0, 0.08159078723453854, 0.016260105966034923, 0.05551884273667156], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1749.6818181818182, 842, 3932, 1589.5, 2889.5, 3784.399999999998, 3932.0, 0.09767792922790036, 0.05055595946365937, 0.044928031900723704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8eb9406e-a208-4853-8ce1-373b4f1d48e0", 3, 0, 0.0, 303.6666666666667, 175, 495, 241.0, 495.0, 495.0, 495.0, 0.04816955684007707, 0.030968383710661528, 0.030889982739242133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 225.1818181818182, 159, 480, 169.0, 449.4000000000001, 480.0, 480.0, 0.049112404900525056, 0.0761146353292317, 0.1104549496932707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c98d46e0-6a43-4882-bf3e-22925e89fec3", 3, 0, 0.0, 371.66666666666663, 173, 736, 206.0, 736.0, 736.0, 736.0, 0.025542131746315547, 0.02561696221041608, 0.016379557142005736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f663e06a-778f-4b40-88d6-67b751c94a7b", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 922.3859649122805, 408, 3036, 729.0, 1550.4, 2060.8999999999955, 3036.0, 0.27097307858694675, 86.40556086821913, 0.9835865931315455], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 159.94642857142858, 79, 345, 88.0, 321.6, 336.3, 345.0, 0.2737623254154099, 0.20345032191516302, 0.13233628035217568], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 511.8928571428571, 388, 733, 470.0, 678.8000000000001, 698.45, 733.0, 0.2735269839254053, 80.4260152247073, 0.1375648405484216], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 137.3571428571428, 78, 356, 86.0, 247.60000000000002, 255.74999999999997, 356.0, 0.27393373738559595, 0.48473430873310536, 0.1332216808769793], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 766.1964285714286, 542, 1147, 726.5, 946.3000000000001, 969.05, 1147.0, 0.27331072012494206, 245.92546639742307, 0.13718917006271505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 95.73333333333335, 80, 235, 86.0, 150.40000000000003, 235.0, 235.0, 0.08252186829509821, 0.06164963793530285, 0.02933394537052319], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, 7.0588235294117645, 164.74117647058824, 79, 1935, 89.5, 313.60000000000014, 465.84999999999985, 1560.8299999999958, 0.7125253575200765, 1.5960068651294281, 0.3403528323406877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 127.875, 83, 246, 87.0, 246.0, 246.0, 246.0, 0.041183829169476605, 0.03189333645644038, 0.014639564275087386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaa90b27-f68d-4c42-a0d7-927721142bcc", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 85.4, 79, 96, 85.0, 92.4, 96.0, 96.0, 0.11510835533181901, 0.09341312820384921, 0.04091742318435754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdb493b0-b6f6-4cec-b3c9-944ae26e4fef", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 164.25, 161, 169, 164.0, 169.0, 169.0, 169.0, 0.04223552641304233, 0.06545681681396306, 0.09498868879808252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 206.38888888888889, 159, 740, 166.0, 367.4000000000006, 740.0, 740.0, 0.09280646757960732, 6.304107902664061, 0.2074047315830721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 88.4, 84, 95, 87.5, 94.8, 95.0, 95.0, 0.049808238282611945, 0.04129608818548588, 0.017705272202022213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62ed3116-942a-4268-918e-918e89a73ef5", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 108.56250000000001, 81, 242, 88.5, 241.3, 242.0, 242.0, 0.11070289418878995, 0.08594609460946094, 0.03935141941867142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ef92525-46f4-449f-9cc2-c9b38ed1d0ba", 3, 0, 0.0, 405.33333333333337, 198, 795, 223.0, 795.0, 795.0, 795.0, 0.021832789939450398, 0.02580561857752096, 0.014000845110910574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 83.06666666666668, 78, 91, 82.0, 89.8, 91.0, 91.0, 0.08094325877559831, 0.06015412102366241, 0.040629721690095245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 133.93333333333334, 77, 249, 82.0, 244.8, 249.0, 249.0, 0.08094587958490952, 0.029764474472367776, 0.045711234343717794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2b56108-44d0-41a1-b408-ed4b56eb973c", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 170.46666666666667, 77, 783, 82.0, 460.20000000000016, 783.0, 783.0, 0.08094806372231576, 4.876177499204011, 0.047124842825842936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 200.73333333333332, 79, 702, 233.0, 469.8000000000001, 702.0, 702.0, 0.08094544277157197, 1.6070726923803356, 0.04720236529329232], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.539291217257319], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.23112480739599384], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.23112480739599384], "isController": false}, {"data": ["401/Unauthorized", 18, 58.064516129032256, 1.386748844375963], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 31, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
