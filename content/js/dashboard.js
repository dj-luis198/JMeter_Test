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

    var data = {"OkPercent": 97.82445611402851, "KoPercent": 2.175543885971493};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7922286448298009, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92733957-6604-4237-99f0-0781db4b3f23"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff3a149f-49c9-4d1b-a561-ae12d8dadbe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=350eedb7-9a90-4c83-a85a-4743f581563e"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf526774-4eef-45cb-9243-0c5055bddbf9"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98a5e269-1c07-4ac2-81bc-9f427aec273c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89f38830-7d8d-4e85-9cfe-d0c5168aee01"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/625d7ead-e19e-44a3-ac01-4c9790efe43b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7618adb-df05-49de-9654-6150b8841ac7"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=625d7ead-e19e-44a3-ac01-4c9790efe43b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89f38830-7d8d-4e85-9cfe-d0c5168aee01"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d6e2976a-8671-4981-b655-da3aad593447"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98a5e269-1c07-4ac2-81bc-9f427aec273c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d396cd83-d1de-4864-aa69-bb8d586ff211"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4fb17f7-1ce0-4602-9349-a00694b09e13"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b1fa76b-3e4d-4534-9a77-5e375e977771"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4738080-9297-4c24-bdf2-73b75b85a4da"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92733957-6604-4237-99f0-0781db4b3f23"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/350eedb7-9a90-4c83-a85a-4743f581563e"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/692a71ae-6496-4691-8d21-5115a06fefe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a6ebbff-3c4e-4699-ac07-12b919093883"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7618adb-df05-49de-9654-6150b8841ac7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9098837209302325, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff3a149f-49c9-4d1b-a561-ae12d8dadbe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d396cd83-d1de-4864-aa69-bb8d586ff211"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a6ebbff-3c4e-4699-ac07-12b919093883"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4738080-9297-4c24-bdf2-73b75b85a4da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d182ed24-bde3-4064-824c-4d1e3db0cef3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6e2976a-8671-4981-b655-da3aad593447"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b1fa76b-3e4d-4534-9a77-5e375e977771"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af7a1003-2e4e-429a-85ae-f12e750b491f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcf043d8-65d9-493c-b0b8-c7175a6d4a1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 29, 2.175543885971493, 319.79294823705845, 81, 2152, 96.0, 898.2000000000003, 1071.0, 1707.2200000000055, 5.288612225303609, 772.360670248779, 3.854847487462855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/92733957-6604-4237-99f0-0781db4b3f23", 3, 0, 0.0, 316.6666666666667, 183, 468, 299.0, 468.0, 468.0, 468.0, 0.10785547366528851, 0.050697690095272335, 0.06916513122415963], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1386.310344827586, 993, 1879, 1378.5, 1679.3, 1746.75, 1879.0, 0.25801056063915445, 310.4731539733626, 1.2686359109552174], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ff3a149f-49c9-4d1b-a561-ae12d8dadbe3", 3, 0, 0.0, 365.6666666666667, 192, 532, 373.0, 532.0, 532.0, 532.0, 0.04582181423836508, 0.029041364688182553, 0.029384431656764062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=350eedb7-9a90-4c83-a85a-4743f581563e", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 484.3333333333334, 88, 1465, 446.0, 976.0000000000002, 1465.0, 1465.0, 0.09634096996088556, 0.019606892714695852, 0.06455973983121062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 484.3333333333334, 88, 1465, 446.0, 976.0000000000002, 1465.0, 1465.0, 0.09397318631750406, 0.01912501174664829, 0.06297304731549931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 107.21428571428571, 83, 248, 84.0, 246.5, 248.0, 248.0, 0.11016595714544267, 0.07675345842415467, 0.06018553127532833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 96.78571428571428, 84, 248, 85.0, 168.0, 248.0, 248.0, 0.11030570438071226, 0.08197523538449417, 0.05536829301922471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 282.8571428571429, 82, 659, 166.0, 659.0, 659.0, 659.0, 0.10981167298083787, 9.246363468793875, 0.06196822226666981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 304.0, 82, 904, 84.5, 902.0, 904.0, 904.0, 0.10975055267242595, 28.236483778476348, 0.06182655297032032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf526774-4eef-45cb-9243-0c5055bddbf9", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 211.18749999999997, 82, 445, 188.5, 394.6, 445.0, 445.0, 0.09312829586859597, 0.16024046562692804, 0.06018893584915544], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/98a5e269-1c07-4ac2-81bc-9f427aec273c", 3, 0, 0.0, 495.66666666666663, 250, 920, 317.0, 920.0, 920.0, 920.0, 0.04951230380749617, 0.03183164063144692, 0.03175105419946857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 93.61111111111111, 82, 247, 84.0, 105.70000000000022, 247.0, 247.0, 0.10668310376709893, 0.0792830487956663, 0.05354991732059458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 83.44444444444446, 81, 86, 83.5, 85.1, 86.0, 86.0, 0.10668310376709893, 0.02854606487518077, 0.060842707617173614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 639.0, 494, 733, 652.0, 733.0, 733.0, 733.0, 0.03663808895727999, 10.772814652487726, 0.020895160108448742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 851.0, 656, 980, 896.5, 980.0, 980.0, 980.0, 0.036599202137393406, 32.9320264177616, 0.02083724106064488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 138.16666666666666, 83, 246, 85.5, 246.0, 246.0, 246.0, 0.03678408965508785, 0.06509059614747968, 0.020367752768002748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89f38830-7d8d-4e85-9cfe-d0c5168aee01", 3, 0, 0.0, 361.6666666666667, 186, 454, 445.0, 454.0, 454.0, 454.0, 0.07078142695356739, 0.032856222277274444, 0.045390433300302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/625d7ead-e19e-44a3-ac01-4c9790efe43b", 3, 0, 0.0, 401.0, 174, 557, 472.0, 557.0, 557.0, 557.0, 0.020490263709693944, 0.02421879802405557, 0.013139915204458681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 98.66666666666666, 83, 249, 84.5, 201.60000000000016, 249.0, 249.0, 0.06217358865953743, 0.046205176728425765, 0.03120822712011937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 118.25, 83, 333, 84.0, 307.2000000000001, 333.0, 333.0, 0.06217648796107752, 0.032201429800154405, 0.03458971937678434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7618adb-df05-49de-9654-6150b8841ac7", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 245.58333333333331, 82, 982, 83.5, 977.5, 982.0, 982.0, 0.06217648796107752, 9.338384282431516, 0.03566242571205032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 190.66666666666666, 83, 642, 84.5, 594.6000000000001, 642.0, 642.0, 0.062176810122384685, 3.060973267857698, 0.03572333003450813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 84.83333333333333, 84, 89, 84.0, 89.0, 89.0, 89.0, 0.03678386414492842, 0.027336445912393096, 0.020655001839193207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 558.5, 81, 1071, 778.5, 1006.6, 1071.0, 1071.0, 0.08917275549387774, 45.14427894944741, 0.04811322989293696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 93.16666666666666, 82, 246, 84.0, 104.70000000000022, 246.0, 246.0, 0.10668373606443697, 0.028754600736117776, 0.0627183682722569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 411.0, 83, 828, 565.5, 762.9000000000001, 828.0, 828.0, 0.08917275549387774, 14.75912514211908, 0.04820031266197395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 120.55555555555556, 82, 251, 84.0, 248.3, 251.0, 251.0, 0.10668436836927016, 0.028754771162029846, 0.06282292395182608], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 413.99999999999994, 84, 797, 433.0, 771.8000000000001, 797.0, 797.0, 0.09418679124439588, 0.019168483686847756, 0.06359447994763213], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 359.58333333333337, 168, 1065, 171.5, 1060.5, 1065.0, 1065.0, 0.06214654154496302, 12.471740721391875, 0.13711889928117166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=625d7ead-e19e-44a3-ac01-4c9790efe43b", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89f38830-7d8d-4e85-9cfe-d0c5168aee01", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 660.7916666666666, 155, 1465, 608.5, 1236.5, 1410.0, 1465.0, 0.10230615115733833, 0.06284235261520099, 0.046257566392429346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 85.75000000000001, 82, 103, 84.0, 93.20000000000002, 103.0, 103.0, 0.08917126455999554, 0.06626887922866856, 0.04475979490609151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 115.24999999999999, 82, 251, 84.0, 250.3, 251.0, 251.0, 0.08917126455999554, 0.09919650072451652, 0.04664292830073009], "isController": false}, {"data": ["login", 24, 0, 0.0, 2579.0416666666665, 1640, 5169, 2479.5, 3454.5, 4800.75, 5169.0, 0.10248658066334439, 30.7929388747614, 0.19711652403950858], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 101.33333333333333, 86, 255, 89.0, 154.20000000000016, 255.0, 255.0, 0.11149376873714725, 0.09026204519833503, 0.039632550605782815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6e2976a-8671-4981-b655-da3aad593447", 3, 0, 0.0, 889.0, 177, 1940, 550.0, 1940.0, 1940.0, 1940.0, 0.021289731962274593, 0.02516374243327443, 0.013652595040911767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98a5e269-1c07-4ac2-81bc-9f427aec273c", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d396cd83-d1de-4864-aa69-bb8d586ff211", 3, 0, 0.0, 375.66666666666663, 180, 757, 190.0, 757.0, 757.0, 757.0, 0.025763235862424322, 0.025838714092490018, 0.01652134591438018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4fb17f7-1ce0-4602-9349-a00694b09e13", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b1fa76b-3e4d-4534-9a77-5e375e977771", 3, 0, 0.0, 449.0, 203, 897, 247.0, 897.0, 897.0, 897.0, 0.04275026718916993, 0.02748430263626648, 0.02741472212326327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4738080-9297-4c24-bdf2-73b75b85a4da", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 646.125, 169, 1160, 865.0, 1106.1000000000001, 1160.0, 1160.0, 0.08912804915411911, 60.03875699272214, 0.18762368257602344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92733957-6604-4237-99f0-0781db4b3f23", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 448.8571428571429, 168, 1149, 333.0, 1071.0, 1149.0, 1149.0, 0.10967746989745157, 37.610665913613325, 0.23864948353662835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 524.0833333333333, 82, 1065, 496.0, 1043.1000000000001, 1065.0, 1065.0, 0.07048002772214423, 42.168737445745066, 0.10281205215815718], "isController": false}, {"data": ["register", 24, 6, 25.0, 1131.2499999999998, 348, 1973, 1042.5, 1938.5, 1970.0, 1973.0, 0.10070620224323067, 0.031765725902894046, 0.04543580609020758], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 216.11111111111111, 168, 494, 172.0, 350.9000000000002, 494.0, 494.0, 0.10662812257495069, 0.16525276418598314, 0.23980914676768694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 87.64285714285714, 84, 94, 87.0, 92.5, 94.0, 94.0, 0.11953449851008786, 0.09280266241749985, 0.04249077876725779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350eedb7-9a90-4c83-a85a-4743f581563e", 3, 0, 0.0, 300.6666666666667, 181, 474, 247.0, 474.0, 474.0, 474.0, 0.025745106284380443, 0.025820531400447964, 0.016509719850335114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 281.52631578947364, 167, 585, 187.0, 499.0, 585.0, 585.0, 0.10220658640759986, 0.15840024670787206, 0.22986500829756104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/692a71ae-6496-4691-8d21-5115a06fefe3", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 86.66666666666667, 82, 94, 84.0, 94.0, 94.0, 94.0, 0.049559198462563535, 0.03683061526368247, 0.02487639454077896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 84.44444444444444, 82, 92, 83.0, 92.0, 92.0, 92.0, 0.049558925562493805, 0.013260884379026663, 0.028264074734859746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 102.88888888888889, 82, 250, 84.0, 250.0, 250.0, 250.0, 0.049559198462563535, 0.013357752710612828, 0.029135388158655514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 84.66666666666666, 83, 91, 84.0, 91.0, 91.0, 91.0, 0.049558925562493805, 0.013357679155515908, 0.029183625111507582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 88.33333333333333, 84, 91, 90.0, 91.0, 91.0, 91.0, 0.027315687399273404, 0.008055993744707586, 0.016885576292714907], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 962.7931034482762, 652, 1541, 906.5, 1312.7, 1397.75, 1541.0, 0.26604772345715255, 318.2855704086126, 0.5253403289359009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1131.2499999999998, 348, 1973, 1042.5, 1938.5, 1970.0, 1973.0, 0.10265754725455223, 0.03238123805001989, 0.046316198077737424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 108.15384615384615, 81, 248, 83.0, 248.0, 248.0, 248.0, 0.06696095146361188, 0.018048068949176637, 0.03943110716070113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 95.84615384615384, 81, 248, 83.0, 182.39999999999995, 248.0, 248.0, 0.0669599167636727, 0.01804779006520866, 0.039365107316143524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 247.57142857142856, 82, 897, 88.0, 896.5, 897.0, 897.0, 0.11310298026352995, 14.56473845440738, 0.06510364070414684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 177.35714285714286, 83, 655, 84.0, 569.5, 655.0, 655.0, 0.11332361988020075, 4.786310354945766, 0.0653413115185365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 95.6923076923077, 81, 244, 83.0, 180.39999999999995, 244.0, 244.0, 0.06696026166009941, 0.017917101264518787, 0.03818827422802544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 96.0, 82, 250, 84.0, 170.5, 250.0, 250.0, 0.1138498320714977, 0.08460910371719702, 0.05714727898901349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 96.61538461538461, 83, 243, 84.0, 180.99999999999994, 243.0, 243.0, 0.06695922698147805, 0.04976169114541484, 0.03361039323093722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 108.07142857142857, 82, 249, 83.0, 248.5, 249.0, 249.0, 0.11385075792075987, 0.05489232971179494, 0.06356455541279032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 127.07692307692307, 83, 250, 89.0, 249.6, 250.0, 250.0, 0.06513287105695618, 0.051266693429596374, 0.023152700258527396], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 504.0666666666667, 82, 920, 472.0, 906.2, 920.0, 920.0, 0.09505101070908054, 0.018824555636524933, 0.06467924244344465], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1375.1666666666667, 829, 2152, 1238.5, 2082.5, 2150.75, 2152.0, 0.10322491849532478, 0.05342695976808801, 0.04747943028447067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 218.76923076923077, 167, 492, 169.0, 429.5999999999999, 492.0, 492.0, 0.06692992436918546, 0.1037283105213841, 0.1505269685764005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a6ebbff-3c4e-4699-ac07-12b919093883", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 0.23929014900662252, 0.9131829470198676], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 998.8771929824561, 434, 3130, 737.0, 1767.0000000000002, 2408.1, 3130.0, 0.2598669663495074, 93.77837397506417, 0.9408646289715196], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7618adb-df05-49de-9654-6150b8841ac7", 3, 0, 0.0, 340.3333333333333, 187, 418, 416.0, 418.0, 418.0, 418.0, 0.022989562738516715, 0.0316929681632872, 0.014742655792603492], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 149.06896551724134, 82, 359, 86.0, 336.0, 337.15, 359.0, 0.26699811259954886, 0.1984234020393132, 0.129066470446071], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 530.8448275862069, 405, 814, 492.0, 661.1, 736.2499999999999, 814.0, 0.2668764868011172, 78.47054825287927, 0.13422010810798374], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 121.81034482758622, 82, 349, 87.0, 249.1, 251.05, 349.0, 0.2673821444047981, 0.4731410602163029, 0.13003545694686472], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 811.0344827586207, 567, 1203, 816.5, 1043.7, 1065.3999999999996, 1203.0, 0.2665367682876391, 239.8302526268807, 0.13378896376938137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 97.78947368421052, 84, 255, 86.0, 123.0, 255.0, 255.0, 0.1021835000537808, 0.07633825931752178, 0.03632304103474239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 11, 6.395348837209302, 175.8255813953488, 83, 2132, 89.5, 276.1, 451.2499999999999, 2083.0900000000006, 0.7347256098863311, 1.685332766359392, 0.34969214676571225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 90.88888888888889, 84, 103, 88.0, 103.0, 103.0, 103.0, 0.04956602194122571, 0.038384624413468744, 0.01761917186192008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff3a149f-49c9-4d1b-a561-ae12d8dadbe3", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 93.5, 86, 112, 88.0, 108.0, 112.0, 112.0, 0.11651325754423343, 0.09455323927661911, 0.04141682201767673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d396cd83-d1de-4864-aa69-bb8d586ff211", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 191.1111111111111, 167, 336, 170.0, 336.0, 336.0, 336.0, 0.0495362853290035, 0.07677156720422709, 0.11140826671161626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a6ebbff-3c4e-4699-ac07-12b919093883", 3, 0, 0.0, 640.3333333333334, 176, 962, 783.0, 962.0, 962.0, 962.0, 0.04368847206850352, 0.028087477973728663, 0.028016370434554665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 346.1428571428571, 167, 980, 184.5, 980.0, 980.0, 980.0, 0.11302536612145384, 19.46694790136115, 0.2500654689341708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4738080-9297-4c24-bdf2-73b75b85a4da", 3, 0, 0.0, 325.0, 263, 421, 291.0, 421.0, 421.0, 421.0, 0.038528221922558274, 0.024769934341488477, 0.02470722564695306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d182ed24-bde3-4064-824c-4d1e3db0cef3", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6e2976a-8671-4981-b655-da3aad593447", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b1fa76b-3e4d-4534-9a77-5e375e977771", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af7a1003-2e4e-429a-85ae-f12e750b491f", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.6412368222891567, 1.1981519829317269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 116.5, 83, 248, 88.0, 247.7, 248.0, 248.0, 0.06556875430294949, 0.054363156643754025, 0.023307643131126578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.125, 83, 258, 87.0, 155.8000000000001, 258.0, 258.0, 0.08415737428992215, 0.06533702398485167, 0.029915316642120764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcf043d8-65d9-493c-b0b8-c7175a6d4a1d", 2, 0, 0.0, 234.5, 210, 259, 234.5, 259.0, 259.0, 259.0, 0.017842964073191837, 0.030179700951922135, 0.011090865852135357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 113.63157894736842, 83, 250, 85.0, 250.0, 250.0, 250.0, 0.10234036250033665, 0.07605567955347284, 0.05137006477067679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 118.26315789473684, 81, 248, 84.0, 248.0, 248.0, 248.0, 0.10234532389601715, 0.027385369870613966, 0.05836881753444729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 144.10526315789474, 81, 257, 84.0, 250.0, 257.0, 257.0, 0.10226049515608181, 0.027562399085037673, 0.0601179864101184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 140.00000000000003, 82, 334, 84.0, 249.0, 334.0, 334.0, 0.1023497344293733, 0.02758645185791702, 0.06027040025479697], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.689655172413794, 0.450112528132033], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.2250562640660165], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.344827586206897, 0.2250562640660165], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.275318829707427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 29, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
