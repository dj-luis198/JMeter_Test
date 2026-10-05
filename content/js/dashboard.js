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

    var data = {"OkPercent": 98.12938425565082, "KoPercent": 1.8706157443491815};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7933911882510013, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c54b9c0f-6ab4-404e-82da-d8938dc09f7b"], "isController": false}, {"data": [0.39090909090909093, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b49f28b7-8e6d-4d29-b9e8-1ae8526e3c1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9fb9b55-f17a-4ffb-ac02-af16e5004cbe"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb8e97e9-241c-43c2-aa2c-014a3834ca4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4136a6e-080d-4926-9079-e4d39b90797e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f0875795-b50b-4140-a993-6646f23c8106"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a95a492-68af-44aa-8c63-367c7d9ff1a9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c92e3d0-fe6b-48cf-905e-71732ce7065e"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd41040e-0697-4d52-82d1-4031e443350c"], "isController": false}, {"data": [0.5227272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d9786cd-ebf7-47a2-bd4d-a559bfecb291"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9453cd7-b837-454e-b7c9-bc5faac40926"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d02f9e48-fe17-4918-9c6a-0affa9dd1385"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e0e62156-13a5-4a29-90aa-726acd1e07a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29f3b974-f4d7-4217-b065-481ec9477f5a"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4136a6e-080d-4926-9079-e4d39b90797e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a4116bf-6d1e-450a-90af-0410dc45f9f3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0e62156-13a5-4a29-90aa-726acd1e07a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0875795-b50b-4140-a993-6646f23c8106"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a95a492-68af-44aa-8c63-367c7d9ff1a9"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b49f28b7-8e6d-4d29-b9e8-1ae8526e3c1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7818181818181819, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c92e3d0-fe6b-48cf-905e-71732ce7065e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289940828402367, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb8e97e9-241c-43c2-aa2c-014a3834ca4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31654271-d545-4e63-ac73-9e17caf0988d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d9786cd-ebf7-47a2-bd4d-a559bfecb291"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0220400f-14be-420c-887b-aabb8aff0bd2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29f3b974-f4d7-4217-b065-481ec9477f5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c54b9c0f-6ab4-404e-82da-d8938dc09f7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9fb9b55-f17a-4ffb-ac02-af16e5004cbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd41040e-0697-4d52-82d1-4031e443350c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 24, 1.8706157443491815, 330.7264224473886, 79, 3036, 99.0, 884.6000000000001, 1137.3999999999996, 1931.16, 5.072710163607753, 731.7357421766889, 3.6957030601331637], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c54b9c0f-6ab4-404e-82da-d8938dc09f7b", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1339.290909090909, 968, 1739, 1322.0, 1591.2, 1670.3999999999999, 1739.0, 0.2542647126808747, 305.96550072089826, 1.2502176058087928], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b49f28b7-8e6d-4d29-b9e8-1ae8526e3c1f", 3, 0, 0.0, 441.3333333333333, 329, 505, 490.0, 505.0, 505.0, 505.0, 0.08217602103706138, 0.0381455097652505, 0.05269751349056346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9fb9b55-f17a-4ffb-ac02-af16e5004cbe", 3, 0, 0.0, 394.6666666666667, 357, 440, 387.0, 440.0, 440.0, 440.0, 0.06266449429753101, 0.028354051781760453, 0.040185238856164096], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 654.5, 86, 1530, 531.5, 1412.5, 1530.0, 1530.0, 0.10526948989412896, 0.020736679649903757, 0.07083074075884264], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 654.5, 86, 1530, 531.5, 1412.5, 1530.0, 1530.0, 0.10723696304920645, 0.02112424551136712, 0.07215455814541333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 117.22222222222223, 79, 244, 82.0, 241.3, 244.0, 244.0, 0.10001666944490747, 0.035107847835750404, 0.056574099155414795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 111.66666666666667, 81, 263, 83.0, 242.30000000000004, 263.0, 263.0, 0.10001778093883357, 0.07432962040473863, 0.050204237697812945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 149.55555555555554, 80, 642, 82.5, 284.70000000000056, 642.0, 642.0, 0.10001666944490747, 1.6592500659832194, 0.05841902469856087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 164.7777777777778, 80, 759, 83.0, 297.30000000000075, 759.0, 759.0, 0.10001722518878252, 5.025219838208248, 0.05832167623312904], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 236.26666666666668, 81, 373, 227.0, 363.4, 373.0, 373.0, 0.09661462358942649, 0.16145838365344978, 0.06244097450340083], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cb8e97e9-241c-43c2-aa2c-014a3834ca4e", 3, 0, 0.0, 312.0, 197, 511, 228.0, 511.0, 511.0, 511.0, 0.08534607834769993, 0.038616877898210576, 0.05473039529458621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 84.06666666666668, 81, 93, 84.0, 88.8, 93.0, 93.0, 0.08495647396650449, 0.06313659832862296, 0.04264416759646807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 92.73333333333335, 80, 240, 82.0, 148.80000000000007, 240.0, 240.0, 0.08495791751152597, 0.02273288027163878, 0.04845256233079215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 613.4, 484, 655, 643.0, 655.0, 655.0, 655.0, 0.05208821660363992, 15.315665173037056, 0.029706561031763393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 837.0, 642, 954, 881.0, 954.0, 954.0, 954.0, 0.05187367722123086, 46.67602594786177, 0.029533548652321863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 114.8, 81, 243, 83.0, 243.0, 243.0, 243.0, 0.052305632270482884, 0.09255645085362792, 0.02896220068101933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4136a6e-080d-4926-9079-e4d39b90797e", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.2113029970760234, 0.8063779239766082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 85.76923076923076, 81, 92, 85.0, 91.6, 92.0, 92.0, 0.05853113856571696, 0.043498238719248634, 0.029379887912869645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 109.0769230769231, 80, 244, 83.0, 244.0, 244.0, 244.0, 0.058531929167360795, 0.022424341853481074, 0.03300335489259391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 175.76923076923077, 79, 950, 83.0, 667.5999999999997, 950.0, 950.0, 0.058531929167360795, 4.0658805354883585, 0.03402344260043854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 139.23076923076923, 81, 640, 82.0, 481.1999999999998, 640.0, 640.0, 0.05853219270598829, 1.338440243696533, 0.034080756134624045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0875795-b50b-4140-a993-6646f23c8106", 3, 0, 0.0, 640.6666666666666, 173, 1150, 599.0, 1150.0, 1150.0, 1150.0, 0.03400358171060685, 0.03410320157889964, 0.021805682281867023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 84.6, 83, 86, 85.0, 86.0, 86.0, 86.0, 0.05230508510037346, 0.03887125953260176, 0.029370531184291736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 125.1333333333333, 80, 243, 83.0, 243.0, 243.0, 243.0, 0.08495695514272769, 0.02289855431581332, 0.04994539745695514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 643.5625, 80, 1115, 880.0, 1057.6000000000001, 1115.0, 1115.0, 0.0796475595489957, 44.79993411964557, 0.04254610847002016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 114.33333333333334, 80, 243, 83.0, 242.4, 243.0, 243.0, 0.08495743632440148, 0.022898684009311335, 0.05002864658556064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 388.0, 79, 737, 480.5, 671.9000000000001, 737.0, 737.0, 0.07964835252360827, 14.64508803009712, 0.042624313655212236], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 432.1428571428572, 83, 967, 458.5, 911.0, 967.0, 967.0, 0.10759381796663055, 0.021194541150792737, 0.0730851422543979], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a95a492-68af-44aa-8c63-367c7d9ff1a9", 3, 0, 0.0, 575.6666666666666, 345, 793, 589.0, 793.0, 793.0, 793.0, 0.03152750775051232, 0.026283185986022806, 0.020217835373863697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c92e3d0-fe6b-48cf-905e-71732ce7065e", 3, 0, 0.0, 372.6666666666667, 176, 520, 422.0, 520.0, 520.0, 520.0, 0.044745398681502256, 0.02876697994660382, 0.02869415214927065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 275.1538461538462, 164, 1033, 171.0, 754.1999999999998, 1033.0, 1033.0, 0.0585092737198846, 5.468120603365633, 0.13043717819899453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd41040e-0697-4d52-82d1-4031e443350c", 3, 0, 0.0, 602.6666666666667, 218, 1247, 343.0, 1247.0, 1247.0, 1247.0, 0.04055917583754698, 0.026075642017954197, 0.02600962773436444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 960.818181818182, 94, 2384, 853.5, 1976.3999999999999, 2334.649999999999, 2384.0, 0.10635160808465588, 0.06532730613793804, 0.04808671342108953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 93.12500000000001, 81, 244, 82.5, 136.9000000000001, 244.0, 244.0, 0.07964676659017259, 0.05919061462414193, 0.039978943386082724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 146.49999999999997, 80, 260, 89.5, 253.70000000000002, 260.0, 260.0, 0.0796475595489957, 0.09607875774696967, 0.041243279737163054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d9786cd-ebf7-47a2-bd4d-a559bfecb291", 3, 0, 0.0, 449.0, 227, 656, 464.0, 656.0, 656.0, 656.0, 0.01615082719153266, 0.02226521912634792, 0.010357138531028431], "isController": false}, {"data": ["login", 22, 0, 0.0, 3407.409090909091, 2011, 5529, 3060.0, 5151.9, 5473.65, 5529.0, 0.10707315529987783, 29.26050111605513, 0.201902860313335], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 112.73333333333332, 84, 260, 88.0, 255.2, 260.0, 260.0, 0.08537862574564001, 0.06912000072571832, 0.03034943337052047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9453cd7-b837-454e-b7c9-bc5faac40926", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 738.1250000000001, 162, 1198, 963.5, 1142.0, 1198.0, 1198.0, 0.07961466502129692, 59.575531381239806, 0.1663238985808686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d02f9e48-fe17-4918-9c6a-0affa9dd1385", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0e62156-13a5-4a29-90aa-726acd1e07a5", 3, 0, 0.0, 1200.3333333333333, 259, 1890, 1452.0, 1890.0, 1890.0, 1890.0, 0.016047758128189493, 0.02212313010184977, 0.010291042810069434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29f3b974-f4d7-4217-b065-481ec9477f5a", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 305.05555555555554, 165, 843, 259.0, 539.7000000000005, 843.0, 843.0, 0.09997111945437984, 6.790784528566748, 0.2234163602736987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 502.0999999999999, 81, 1040, 406.0, 1035.5, 1040.0, 1040.0, 0.08247218625518543, 49.343737242583686, 0.12016455262962566], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1267.0416666666665, 159, 2477, 1285.0, 1901.0, 2340.75, 2477.0, 0.09700144289646309, 0.03073922677724831, 0.04376432286930268], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d4136a6e-080d-4926-9079-e4d39b90797e", 3, 0, 0.0, 415.6666666666667, 373, 477, 397.0, 477.0, 477.0, 477.0, 0.02502982721075949, 0.02510315678266601, 0.01605102851731647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 242.06666666666666, 167, 328, 176.0, 327.4, 328.0, 328.0, 0.08491607461292422, 0.13160333047920972, 0.19097824202496533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 87.875, 83, 101, 86.0, 97.5, 101.0, 101.0, 0.08474172311701243, 0.06579069324025867, 0.030123034389250514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a4116bf-6d1e-450a-90af-0410dc45f9f3", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 295.8888888888888, 164, 1034, 169.5, 967.4000000000001, 1034.0, 1034.0, 0.0825388964549544, 11.085396519151317, 0.1832854292481165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0e62156-13a5-4a29-90aa-726acd1e07a5", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 113.63636363636364, 81, 258, 84.0, 255.20000000000002, 258.0, 258.0, 0.05320924292921719, 0.039543197137826454, 0.026708545767204727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 127.72727272727273, 80, 243, 84.0, 243.0, 243.0, 243.0, 0.053210272484968096, 0.014237904942266854, 0.030346483526583368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 96.81818181818183, 79, 243, 82.0, 211.6000000000001, 243.0, 243.0, 0.053210272484968096, 0.014341831255714057, 0.0312818203476082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 127.18181818181819, 80, 243, 84.0, 242.8, 243.0, 243.0, 0.05321078727778449, 0.014341970008465352, 0.03133408664892974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 83.5, 83, 84, 83.5, 84.0, 84.0, 84.0, 0.0399696230864543, 0.011787916183700389, 0.024707784583716377], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 902.9636363636363, 634, 1385, 817.0, 1238.0, 1325.1999999999998, 1385.0, 0.2450030514016402, 293.1088263184505, 0.4837853222012856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1267.0416666666665, 159, 2477, 1285.0, 1901.0, 2340.75, 2477.0, 0.09735834361004739, 0.030852326661582396, 0.043925346433439344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 114.8, 80, 241, 86.0, 241.0, 241.0, 241.0, 0.03193235450022672, 0.008606767423889234, 0.018803915784801478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 114.4, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.03193215056647635, 0.00860671245737058, 0.018772611954119885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 249.25000000000003, 80, 1046, 84.0, 994.9000000000001, 1046.0, 1046.0, 0.08570403183904783, 14.478138399624509, 0.049003623673596196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 177.4375, 81, 630, 83.0, 527.8000000000001, 630.0, 630.0, 0.08570357276768975, 4.743711584043066, 0.04908705608227543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 103.875, 82, 243, 84.0, 242.3, 243.0, 243.0, 0.08570357276768975, 0.06369181530880069, 0.04301917617440677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 83.4, 81, 89, 83.0, 89.0, 89.0, 89.0, 0.03196460878515308, 0.008553030085089789, 0.018229815947782616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 113.6875, 80, 247, 83.0, 244.9, 247.0, 247.0, 0.08570357276768975, 0.04706791673362258, 0.04752823865766779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 116.0, 82, 248, 83.0, 248.0, 248.0, 248.0, 0.03196481313370242, 0.023755100385495647, 0.016044837842502973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 124.0, 84, 247, 89.0, 247.0, 247.0, 247.0, 0.031385546328204936, 0.024703857754426933, 0.011156580921354098], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 674.1428571428572, 81, 1890, 536.0, 1568.5, 1890.0, 1890.0, 0.10795888308824096, 0.020844739703421523, 0.07346867071769524], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1877.3636363636363, 1168, 3036, 1795.5, 2798.7999999999997, 3018.1499999999996, 3036.0, 0.1051745898190997, 0.05443606699621372, 0.04837620293437106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 232.6, 163, 491, 172.0, 491.0, 491.0, 491.0, 0.03191523314077809, 0.04946237792423324, 0.07177810734688667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0875795-b50b-4140-a993-6646f23c8106", 1, 0, 0.0, 967.0, 967, 967, 967.0, 967.0, 967.0, 967.0, 1.0341261633919339, 0.18682943381592554, 0.7129815149948294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a95a492-68af-44aa-8c63-367c7d9ff1a9", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 918.6315789473688, 419, 1979, 759.0, 1525.4, 1584.4999999999995, 1979.0, 0.27184669753954893, 98.1018898636355, 0.9844056647247911], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b49f28b7-8e6d-4d29-b9e8-1ae8526e3c1f", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 138.61818181818177, 81, 339, 84.0, 332.0, 333.4, 339.0, 0.2457858892086588, 0.1826592399294818, 0.11881251480301379], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 532.8545454545457, 396, 739, 486.0, 656.6, 717.8, 739.0, 0.24546996340266, 72.17631961026065, 0.12345413198473623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c92e3d0-fe6b-48cf-905e-71732ce7065e", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 128.36363636363637, 80, 335, 87.0, 254.79999999999998, 326.0, 335.0, 0.24582543712232274, 0.4349957930328602, 0.11955182391300462], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 763.0181818181817, 551, 1052, 727.0, 934.5999999999999, 986.5999999999998, 1052.0, 0.245398773006135, 220.81024731595093, 0.1231786809815951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 96.2777777777778, 82, 246, 86.5, 111.00000000000021, 246.0, 246.0, 0.08715989482706024, 0.06511456986591903, 0.03098261886430657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, 5.9171597633136095, 148.8579881656805, 82, 688, 90.0, 283.0, 397.5, 626.400000000001, 0.693583734845811, 1.5618779805632392, 0.3319547800847075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 102.54545454545453, 84, 245, 89.0, 215.2000000000001, 245.0, 245.0, 0.05378210424927516, 0.04164961784147969, 0.01911785736985953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb8e97e9-241c-43c2-aa2c-014a3834ca4e", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31654271-d545-4e63-ac73-9e17caf0988d", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.7461120035046729, 1.3941114193925235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 113.66666666666669, 83, 365, 88.5, 257.00000000000017, 365.0, 365.0, 0.10088215842982524, 0.0818682359913914, 0.03586045475435195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d9786cd-ebf7-47a2-bd4d-a559bfecb291", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 257.09090909090907, 163, 501, 171.0, 498.2, 501.0, 501.0, 0.053187888634231725, 0.0824308391235603, 0.11962080812952702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0220400f-14be-420c-887b-aabb8aff0bd2", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.6373970808383234, 1.1909774201596806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 364.5, 163, 1131, 170.0, 1079.2, 1131.0, 1131.0, 0.08566502832299999, 19.32383752389251, 0.18855299385888827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29f3b974-f4d7-4217-b065-481ec9477f5a", 3, 0, 0.0, 552.0, 330, 753, 573.0, 753.0, 753.0, 753.0, 0.028853922209825723, 0.02405432772765745, 0.01850332902127496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 102.53846153846153, 84, 242, 89.0, 189.59999999999997, 242.0, 242.0, 0.057255858815860754, 0.047470922006509556, 0.020352668563450502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c54b9c0f-6ab4-404e-82da-d8938dc09f7b", 3, 0, 0.0, 348.0, 188, 552, 304.0, 552.0, 552.0, 552.0, 0.03281270507940675, 0.03290883605131907, 0.021042001629697688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.25, 84, 254, 87.0, 155.3000000000001, 254.0, 254.0, 0.08376042424654881, 0.06502884499609991, 0.0297742133063904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9fb9b55-f17a-4ffb-ac02-af16e5004cbe", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 83.66666666666667, 81, 87, 84.0, 86.1, 87.0, 87.0, 0.0825707011628707, 0.06136357771967247, 0.041446621482144085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 126.66666666666669, 80, 243, 83.0, 242.1, 243.0, 243.0, 0.0825707011628707, 0.03587381591320902, 0.04632058648134131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd41040e-0697-4d52-82d1-4031e443350c", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 202.16666666666666, 81, 946, 83.0, 881.2, 946.0, 946.0, 0.0825714587165643, 8.275109822907158, 0.04775454372388104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 141.2222222222222, 80, 490, 84.0, 406.3000000000001, 490.0, 490.0, 0.0825707011628707, 2.717396757953164, 0.04783474104910663], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.833333333333332, 0.3897116134060795], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.2338269680436477], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1558846453624318], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.0911925175370225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 24, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
