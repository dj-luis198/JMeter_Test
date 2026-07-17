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

    var data = {"OkPercent": 97.6461655277145, "KoPercent": 2.3538344722854974};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7986885245901639, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3728813559322034, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51645896-0941-4756-8249-be403d5e1ad3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78a3743f-c647-4584-bb9b-abf12b3d7047"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e06911e6-2469-4a2f-93d8-131bc6648089"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c6929aa0-4755-4efb-9dda-2d65d3452183"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8cffa6c-cb04-46d2-afc4-828d04836272"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7df3a4f-36f1-4a12-830a-36ebce19dcea"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87d648ae-92de-4b89-8fa4-11236ee74145"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbb3cffe-2488-4ca8-a56a-6c861a941acb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a06a222-8024-4a25-85ab-1367488e01f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdea3cfd-22b6-4789-b1f3-913aadb53d4d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/c195eecc-507d-4bec-a292-a1ccf6c5a6f1"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28ac8a72-11b5-4202-a58f-d3a622b855b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cec5af4f-fccc-4185-8e7e-223a8e9b1770"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28ac8a72-11b5-4202-a58f-d3a622b855b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6929aa0-4755-4efb-9dda-2d65d3452183"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51645896-0941-4756-8249-be403d5e1ad3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8cffa6c-cb04-46d2-afc4-828d04836272"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/490642ee-cb24-497a-9355-75d453df53d8"], "isController": false}, {"data": [0.8220338983050848, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a06a222-8024-4a25-85ab-1367488e01f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9152046783625731, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8cb3c9d4-e1a2-4675-a6bc-4da30d87725d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bdea3cfd-22b6-4789-b1f3-913aadb53d4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87d648ae-92de-4b89-8fa4-11236ee74145"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cec5af4f-fccc-4185-8e7e-223a8e9b1770"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d3a8fe5-bc91-4805-b2d2-5ac7208fd6ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbb3cffe-2488-4ca8-a56a-6c861a941acb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 31, 2.3538344722854974, 309.88154897494263, 77, 2076, 94.0, 878.0, 1029.8999999999992, 1425.539999999997, 5.103503863472553, 745.0671745184222, 3.7349509969657984], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1376.8644067796606, 995, 1717, 1361.0, 1643.0, 1698.0, 1717.0, 0.25653846990021084, 308.7021045530143, 1.2613976522925407], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/51645896-0941-4756-8249-be403d5e1ad3", 3, 0, 0.0, 490.33333333333337, 298, 751, 422.0, 751.0, 751.0, 751.0, 0.016544330533664955, 0.022807695250674182, 0.010609482796653634], "isController": false}, {"data": ["deleteBook", 12, 3, 25.0, 460.0, 86, 794, 500.0, 785.9, 794.0, 794.0, 0.07495830444315349, 0.01568341477240785, 0.05005150455371699], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 3, 25.0, 460.0, 86, 794, 500.0, 785.9, 794.0, 794.0, 0.07320376267340141, 0.01531631460232056, 0.04887995383587717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78a3743f-c647-4584-bb9b-abf12b3d7047", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 94.46666666666665, 79, 246, 84.0, 150.00000000000006, 246.0, 246.0, 0.08998740176375307, 0.04209957480952667, 0.050313268642390066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 107.60000000000001, 81, 253, 86.0, 252.4, 253.0, 253.0, 0.08998848147437129, 0.06687620547069975, 0.045169999490065275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 192.93333333333337, 80, 642, 86.0, 557.4000000000001, 642.0, 642.0, 0.08998848147437129, 3.5489676071462855, 0.051960145976315035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e06911e6-2469-4a2f-93d8-131bc6648089", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.6129288627639156, 1.145258517274472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 230.2, 79, 1007, 85.0, 926.0, 1007.0, 1007.0, 0.08998686191815995, 10.817065239725, 0.05187133303537683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6929aa0-4755-4efb-9dda-2d65d3452183", 3, 0, 0.0, 732.3333333333334, 459, 989, 749.0, 989.0, 989.0, 989.0, 0.023721790837062925, 0.023791288271155887, 0.015212216129236317], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 220.53846153846155, 84, 749, 191.0, 568.5999999999999, 749.0, 749.0, 0.06385696040868455, 0.0981695233446311, 0.04126813629776992], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 86.6470588235294, 79, 92, 86.0, 92.0, 92.0, 92.0, 0.09167336241715694, 0.06812834843696917, 0.046015730744549475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 621.1666666666667, 412, 693, 659.0, 693.0, 693.0, 693.0, 0.03090409942878923, 9.08683134474038, 0.017624994205481356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 131.76470588235293, 78, 251, 86.0, 251.0, 251.0, 251.0, 0.0916753398728409, 0.03262984868176254, 0.051830692499339394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 890.3333333333334, 583, 1042, 969.5, 1042.0, 1042.0, 1042.0, 0.03084357168560119, 27.753100019919806, 0.01756035380147021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 136.5, 81, 252, 83.5, 252.0, 252.0, 252.0, 0.030996538719842953, 0.0548493439065971, 0.017163122513819292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 123.5294117647059, 80, 258, 86.0, 250.0, 258.0, 258.0, 0.08042388116188855, 0.05976813824628631, 0.040369018473838586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8cffa6c-cb04-46d2-afc4-828d04836272", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 102.41176470588233, 80, 249, 84.0, 244.2, 249.0, 249.0, 0.08042350069306134, 0.035730431661312984, 0.04507190215771521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 203.8235294117647, 79, 885, 86.0, 773.8, 885.0, 885.0, 0.08042464211034261, 8.532801352908061, 0.04646777632960857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7df3a4f-36f1-4a12-830a-36ebce19dcea", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 199.5294117647059, 80, 676, 88.0, 643.1999999999999, 676.0, 676.0, 0.08042502258996959, 2.801200580006339, 0.04654653622437635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 82.66666666666666, 78, 86, 82.5, 86.0, 86.0, 86.0, 0.03099589820947028, 0.02303503763418641, 0.017404923310981847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 546.6875, 82, 1000, 732.0, 993.7, 1000.0, 1000.0, 0.07226379899824309, 36.58401135924819, 0.03898998920559502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 161.0, 82, 871, 85.0, 378.99999999999955, 871.0, 871.0, 0.09167632863267453, 4.875639754159139, 0.053432216814517215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 450.8125000000001, 82, 851, 652.0, 768.4000000000001, 851.0, 851.0, 0.07226445176122019, 11.960604794181808, 0.03906091215804236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 117.17647058823529, 79, 501, 83.0, 298.5999999999998, 501.0, 501.0, 0.09167682302058953, 1.6089050720202336, 0.053522033108814995], "isController": false}, {"data": ["deleteBooks", 12, 3, 25.0, 423.33333333333337, 89, 1069, 407.5, 954.7000000000004, 1069.0, 1069.0, 0.07308116272129889, 0.015290663196326455, 0.049083564122630194], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 349.82352941176464, 162, 1131, 176.0, 893.3999999999997, 1131.0, 1131.0, 0.08039155415789846, 11.424786053543139, 0.17838261503085617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87d648ae-92de-4b89-8fa4-11236ee74145", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 683.9999999999999, 140, 1955, 658.5, 1194.1, 1846.3999999999985, 1955.0, 0.0946611132146914, 0.05814632833207119, 0.04280087443203332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.9375, 78, 89, 84.5, 86.9, 89.0, 89.0, 0.07226445176122019, 0.053704343545203675, 0.03627336738795623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 123.87499999999999, 78, 256, 85.0, 248.3, 256.0, 256.0, 0.07226314624705867, 0.08038745748894599, 0.03779877705916093], "isController": false}, {"data": ["login", 22, 0, 0.0, 2713.227272727273, 1551, 4080, 2435.5, 3798.7, 4042.7999999999993, 4080.0, 0.09373628574228486, 30.711823567539124, 0.18381931958108402], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fbb3cffe-2488-4ca8-a56a-6c861a941acb", 3, 0, 0.0, 335.3333333333333, 184, 559, 263.0, 559.0, 559.0, 559.0, 0.04764476066448559, 0.03063099033605438, 0.030553443525077027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a06a222-8024-4a25-85ab-1367488e01f0", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 91.35294117647058, 85, 110, 89.0, 103.6, 110.0, 110.0, 0.09040389268526151, 0.07318830765242362, 0.03213575872796405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 645.8125000000001, 170, 1086, 816.5, 1079.0, 1086.0, 1086.0, 0.0722363935980496, 48.66013923141606, 0.15206501557597238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdea3cfd-22b6-4789-b1f3-913aadb53d4d", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c195eecc-507d-4bec-a292-a1ccf6c5a6f1", 2, 0, 0.0, 590.0, 188, 992, 590.0, 992.0, 992.0, 992.0, 0.06374095675176085, 0.03918450417503267, 0.03962023337157791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 528.9166666666666, 82, 1124, 377.5, 1115.6000000000001, 1124.0, 1124.0, 0.061659884079417936, 36.891578319614005, 0.08994575375354544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 362.93333333333334, 166, 1094, 180.0, 1012.4000000000001, 1094.0, 1094.0, 0.08994261661060243, 14.467826167530117, 0.19921469789774124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28ac8a72-11b5-4202-a58f-d3a622b855b0", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cec5af4f-fccc-4185-8e7e-223a8e9b1770", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1041.5454545454545, 225, 1886, 1033.5, 1575.8, 1844.5999999999995, 1886.0, 0.09729691480328334, 0.030612594643362582, 0.0438976314835126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 101.61111111111111, 83, 259, 91.0, 122.20000000000022, 259.0, 259.0, 0.09049318787391283, 0.07025594175757881, 0.03216750037705495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 267.88235294117646, 164, 957, 175.0, 468.1999999999996, 957.0, 957.0, 0.09162987996485725, 6.581960401069375, 0.2046986673916207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 248.26315789473685, 166, 934, 174.0, 348.0, 934.0, 934.0, 0.09909355474658127, 6.384984409063409, 0.2215293052889881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28ac8a72-11b5-4202-a58f-d3a622b855b0", 3, 0, 0.0, 578.3333333333333, 182, 1311, 242.0, 1311.0, 1311.0, 1311.0, 0.042422614081479695, 0.027273653258763804, 0.027204606035323896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 108.85714285714286, 81, 244, 87.0, 244.0, 244.0, 244.0, 0.0501335701547695, 0.03725746766384725, 0.025164702206593278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 108.85714285714286, 82, 250, 84.0, 250.0, 250.0, 250.0, 0.050134288272157566, 0.013414838854073411, 0.02859221128021486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 132.71428571428572, 79, 253, 85.0, 253.0, 253.0, 253.0, 0.05013500641011868, 0.0135129509464773, 0.029473900252823676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 134.14285714285717, 83, 252, 86.0, 252.0, 252.0, 252.0, 0.050135365486814396, 0.013513047728867942, 0.02952307166850496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 149.66666666666666, 89, 261, 99.0, 261.0, 261.0, 261.0, 0.03392590582168544, 0.010005491756004885, 0.020971775766725473], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 934.1355932203393, 637, 1354, 899.0, 1287.0, 1343.0, 1354.0, 0.25118033470843926, 300.4990047245318, 0.495983043730922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1041.5454545454545, 225, 1886, 1033.5, 1575.8, 1844.5999999999995, 1886.0, 0.09450821362292941, 0.02973518368960066, 0.042639447943157605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 110.5, 81, 245, 84.5, 245.0, 245.0, 245.0, 0.05330348338263905, 0.014366954505476932, 0.03138867234348765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 139.16666666666666, 81, 252, 84.5, 252.0, 252.0, 252.0, 0.053224990907397386, 0.014345798330509451, 0.03129047317016917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 136.33333333333331, 77, 249, 83.5, 248.1, 249.0, 249.0, 0.0940016502511933, 0.025336382294266945, 0.05526268891720544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 129.94444444444446, 80, 340, 84.0, 331.90000000000003, 340.0, 340.0, 0.09400214115988197, 0.025336514609499438, 0.055354776483797684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 103.05555555555556, 81, 251, 84.5, 250.1, 251.0, 251.0, 0.09407681894916192, 0.06991451095733617, 0.04722215326159105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 109.5, 81, 239, 84.0, 239.0, 239.0, 239.0, 0.05323018506361007, 0.014243233112723788, 0.030357839919090118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 101.33333333333334, 77, 244, 83.0, 243.1, 244.0, 244.0, 0.09407927747114903, 0.025173556667084797, 0.053654587932764675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.5, 84, 244, 87.5, 244.0, 244.0, 244.0, 0.053298274912502, 0.03960936250821682, 0.02675323564943948], "isController": false}, {"data": ["deleteAccount", 12, 3, 25.0, 594.5833333333334, 82, 1483, 515.0, 1431.4, 1483.0, 1483.0, 0.07448697098732479, 0.015075610094846743, 0.05068241897990093], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 95.0, 85, 128, 87.5, 128.0, 128.0, 128.0, 0.05463137479854681, 0.04300086727307493, 0.019419746510420936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1418.6363636363637, 784, 2076, 1320.0, 1997.1, 2064.2999999999997, 2076.0, 0.09623460246360582, 0.04980892510323348, 0.044264157969099945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 254.16666666666666, 167, 497, 177.5, 497.0, 497.0, 497.0, 0.05318017443097213, 0.08241888361518826, 0.11960345870559455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6929aa0-4755-4efb-9dda-2d65d3452183", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51645896-0941-4756-8249-be403d5e1ad3", 1, 0, 0.0, 1069.0, 1069, 1069, 1069.0, 1069.0, 1069.0, 1069.0, 0.9354536950420954, 0.16900286482694107, 0.6449514733395697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8cffa6c-cb04-46d2-afc4-828d04836272", 3, 0, 0.0, 284.6666666666667, 191, 471, 192.0, 471.0, 471.0, 471.0, 0.019508896056601808, 0.023058854681484754, 0.01251058764046405], "isController": false}, {"data": ["addBook", 56, 13, 23.214285714285715, 880.357142857143, 409, 1595, 724.0, 1510.1000000000001, 1558.25, 1595.0, 0.25518690162089247, 82.7919511886697, 0.9259336394436926], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 144.57627118644066, 81, 498, 87.0, 333.0, 345.0, 498.0, 0.2521626149690566, 0.18739819335102745, 0.1218950140719561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/490642ee-cb24-497a-9355-75d453df53d8", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 521.6779661016949, 396, 747, 487.0, 672.0, 731.0, 747.0, 0.25193004030880645, 74.07579671540873, 0.12670309644437042], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 119.2033898305085, 80, 261, 87.0, 251.0, 256.0, 261.0, 0.25246906184208273, 0.44675189458774794, 0.12278280546616914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a06a222-8024-4a25-85ab-1367488e01f0", 3, 0, 0.0, 345.33333333333337, 191, 635, 210.0, 635.0, 635.0, 635.0, 0.05678914191606565, 0.02569560783311564, 0.036417516137581166], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 786.6271186440679, 551, 1132, 796.0, 976.0, 1006.0, 1132.0, 0.2515766178721735, 226.36908298590532, 0.12627966951786834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 113.89473684210526, 83, 406, 88.0, 259.0, 406.0, 406.0, 0.09549610225119495, 0.07134230295133216, 0.033945880097104454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, 7.60233918128655, 143.9590643274854, 80, 995, 90.0, 274.80000000000007, 335.60000000000014, 835.8800000000002, 0.7220125148835913, 1.6459653790249031, 0.34249248167523794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 111.85714285714286, 87, 246, 90.0, 246.0, 246.0, 246.0, 0.053866457357003794, 0.041714942074320326, 0.01914784226362244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 89.6, 87, 96, 89.0, 94.8, 96.0, 96.0, 0.0888157310422822, 0.07207604735950832, 0.03157121689393625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cb3c9d4-e1a2-4675-a6bc-4da30d87725d", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.732421875, 1.3685313933486238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdea3cfd-22b6-4789-b1f3-913aadb53d4d", 3, 0, 0.0, 773.3333333333334, 177, 1677, 466.0, 1677.0, 1677.0, 1677.0, 0.03809910848086155, 0.03176165912092657, 0.024432045477635823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 269.42857142857144, 172, 498, 190.0, 498.0, 498.0, 498.0, 0.05010271055664112, 0.07764941567713814, 0.11268217032416454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 270.94444444444446, 166, 591, 184.0, 508.20000000000016, 591.0, 591.0, 0.09395945127680454, 0.14561879802371955, 0.2113170080961727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87d648ae-92de-4b89-8fa4-11236ee74145", 3, 0, 0.0, 655.6666666666667, 191, 1483, 293.0, 1483.0, 1483.0, 1483.0, 0.07563533682936667, 0.03422302024505849, 0.048503129412061315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 106.82352941176471, 82, 414, 88.0, 156.39999999999978, 414.0, 414.0, 0.08179093275341959, 0.0678129901441926, 0.029074120627192116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 91.375, 82, 120, 88.5, 112.30000000000001, 120.0, 120.0, 0.07148537677261395, 0.05549890091233212, 0.025410817524640115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cec5af4f-fccc-4185-8e7e-223a8e9b1770", 3, 0, 0.0, 434.66666666666663, 200, 749, 355.0, 749.0, 749.0, 749.0, 0.024287564766839378, 0.024358719741742228, 0.015575033395401556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d3a8fe5-bc91-4805-b2d2-5ac7208fd6ba", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbb3cffe-2488-4ca8-a56a-6c861a941acb", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 89.47368421052632, 81, 107, 87.0, 107.0, 107.0, 107.0, 0.09921981889772004, 0.0737366036925439, 0.04980369815764463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 108.21052631578948, 81, 251, 83.0, 243.0, 251.0, 251.0, 0.09922344597805595, 0.03439365335505805, 0.05614978105563302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 132.26315789473682, 81, 847, 84.0, 244.0, 847.0, 847.0, 0.09922240964232933, 4.724309596438959, 0.05788313884870671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 129.63157894736844, 79, 495, 84.0, 249.0, 495.0, 495.0, 0.09913905557004957, 1.559534388859901, 0.05793132826767545], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 19.35483870967742, 0.45558086560364464], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22779043280182232], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.22779043280182232], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.442672741078208], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 31, "401/Unauthorized", 19, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
