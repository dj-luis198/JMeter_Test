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

    var data = {"OkPercent": 99.12698412698413, "KoPercent": 0.873015873015873};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7089857045609258, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7d134fe-a87d-4601-a3cf-2e056a9d0f6e"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d3d04e46-2258-4c1a-b0a8-9b809c0e1f1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1538069-9c76-47b6-9767-8cfbbaa0f69c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b2f5d6a-96b7-406e-8580-ac0f4211b866"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f0d6a7b6-3e9f-4a55-b53d-c57d6d0ea96e"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eedc3117-eb08-42b7-9158-a7914a7aa9e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e926202e-c54e-4fa9-945c-69fd966e5f0c"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1538069-9c76-47b6-9767-8cfbbaa0f69c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23535851-0062-4cd7-9c71-051991a4e0d3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b48fc86a-c4d5-45b8-9090-87a3364fb4d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7792c7ab-555d-49ec-9f05-ad323df50f30"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f302fc08-be96-4a2b-8359-e2623ffc500d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=469ea015-5d67-4de2-ae13-027b36aa5b49"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eed7656-4676-46d8-81bc-fc712e5ba105"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3d04e46-2258-4c1a-b0a8-9b809c0e1f1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0d6a7b6-3e9f-4a55-b53d-c57d6d0ea96e"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74a53d20-68f7-41e6-9942-833fa75e836c"], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.11363636363636363, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/0b2f5d6a-96b7-406e-8580-ac0f4211b866"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7d134fe-a87d-4601-a3cf-2e056a9d0f6e"], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9325153374233128, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b48fc86a-c4d5-45b8-9090-87a3364fb4d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/7eed7656-4676-46d8-81bc-fc712e5ba105"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/eedc3117-eb08-42b7-9158-a7914a7aa9e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7792c7ab-555d-49ec-9f05-ad323df50f30"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6bd032e5-130b-4107-8917-fef17a66be2d"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f302fc08-be96-4a2b-8359-e2623ffc500d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8018c1f4-f4d3-4360-ad1d-0cdbf9f16156"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23535851-0062-4cd7-9c71-051991a4e0d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/74a53d20-68f7-41e6-9942-833fa75e836c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/469ea015-5d67-4de2-ae13-027b36aa5b49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e926202e-c54e-4fa9-945c-69fd966e5f0c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 11, 0.873015873015873, 533.512698412699, 134, 4325, 170.5, 1480.700000000002, 1774.8000000000002, 2428.120000000001, 4.879106581372655, 707.3146922701978, 3.5649462390704136], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2372.309090909091, 1763, 3257, 2339.0, 2946.0, 3017.9999999999995, 3257.0, 0.25756781057994904, 309.94227663895083, 1.2664589123730894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d7d134fe-a87d-4601-a3cf-2e056a9d0f6e", 3, 0, 0.0, 414.6666666666667, 315, 519, 410.0, 519.0, 519.0, 519.0, 0.03179683939416422, 0.02650771669546047, 0.020390551304200363], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 974.4285714285714, 494, 2225, 831.0, 1817.5, 2225.0, 2225.0, 0.09184603979557696, 0.0165932786740056, 0.062426605173556214], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 974.4285714285714, 494, 2225, 831.0, 1817.5, 2225.0, 2225.0, 0.08931191548541026, 0.016135453481250877, 0.06070419255648979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3d04e46-2258-4c1a-b0a8-9b809c0e1f1b", 3, 0, 0.0, 619.0, 260, 1065, 532.0, 1065.0, 1065.0, 1065.0, 0.019196682813209878, 0.026464176990216092, 0.012310372767585762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 194.4375, 136, 425, 142.0, 418.0, 425.0, 425.0, 0.11149359608657478, 0.029833247390353018, 0.06358619151812468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 181.0625, 137, 699, 142.5, 351.10000000000036, 699.0, 699.0, 0.11149670387869158, 0.08286034340984794, 0.05596611893910886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 194.6875, 137, 426, 142.0, 416.90000000000003, 426.0, 426.0, 0.11149437301836172, 0.03005121772760531, 0.06565537786139856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 233.00000000000003, 136, 480, 144.0, 440.80000000000007, 480.0, 480.0, 0.11127493253957216, 0.029992071661056552, 0.0654174896375219], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 450.2857142857143, 240, 813, 476.0, 695.5, 813.0, 813.0, 0.09260177927704469, 0.2079793588980388, 0.05986560339980818], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1538069-9c76-47b6-9767-8cfbbaa0f69c", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 158.55, 139, 407, 145.0, 159.5, 394.64999999999986, 407.0, 0.15717833453836721, 0.11680928963251705, 0.07889615620382887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 183.6, 137, 426, 142.5, 415.8, 425.55, 426.0, 0.15686151481164853, 0.05375264213614011, 0.08880138685186782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1000.5000000000001, 678, 1170, 1100.0, 1170.0, 1170.0, 1170.0, 0.10103051121438673, 29.70632482572237, 0.05761896342695494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1346.8333333333335, 1212, 1611, 1269.0, 1611.0, 1611.0, 1611.0, 0.09996334677284996, 89.9471951430309, 0.05691272575055813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 282.0, 137, 428, 278.5, 428.0, 428.0, 428.0, 0.10171387885877028, 0.17998588719930836, 0.05632008721965112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 187.17647058823528, 137, 423, 144.0, 413.4, 423.0, 423.0, 0.0832337792052643, 0.06185635349141223, 0.04177945557764243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 209.1764705882353, 136, 449, 142.0, 432.2, 449.0, 449.0, 0.0832337792052643, 0.02227153857640861, 0.04746926470300229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 237.64705882352942, 136, 431, 142.0, 423.8, 431.0, 431.0, 0.08312267439870524, 0.022404158334026023, 0.048867041003926324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 173.47058823529412, 135, 414, 142.0, 409.2, 414.0, 414.0, 0.08323296417065695, 0.02243388487412238, 0.04901316151846303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 141.83333333333334, 138, 148, 141.5, 148.0, 148.0, 148.0, 0.10220594497913295, 0.07595578528234392, 0.057391033557618605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1051.3333333333333, 136, 1968, 1403.0, 1767.6000000000001, 1968.0, 1968.0, 0.08391749232154946, 50.34694419696554, 0.044526534011759634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 241.75, 137, 1579, 143.5, 416.5, 1520.8999999999992, 1579.0, 0.15718698177416948, 7.112104588779208, 0.09173334014476921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 811.4666666666666, 137, 1166, 1090.0, 1150.4, 1166.0, 1166.0, 0.08391655337931961, 16.4570413680636, 0.044607985569150035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 216.4, 135, 1109, 142.0, 413.5, 1074.2499999999995, 1109.0, 0.15685167321522403, 2.3461426007183808, 0.09169083162757138], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 1043.357142857143, 263, 4325, 560.0, 3446.0, 4325.0, 4325.0, 0.08948031113582472, 0.016165876523562082, 0.06169248013856665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b2f5d6a-96b7-406e-8580-ac0f4211b866", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0d6a7b6-3e9f-4a55-b53d-c57d6d0ea96e", 3, 0, 0.0, 1290.3333333333335, 356, 3018, 497.0, 3018.0, 3018.0, 3018.0, 0.016939677807328104, 0.02335271338347478, 0.010863009531392047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 462.7058823529412, 280, 850, 292.0, 836.4, 850.0, 850.0, 0.08306378321329802, 0.12873264058545308, 0.18681239525412632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eedc3117-eb08-42b7-9158-a7914a7aa9e4", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e926202e-c54e-4fa9-945c-69fd966e5f0c", 3, 0, 0.0, 1273.0, 500, 2374, 945.0, 2374.0, 2374.0, 2374.0, 0.02783215355926857, 0.027913693071649242, 0.017848093265546577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 1009.0000000000002, 292, 1979, 944.0, 1876.6999999999998, 1969.9999999999998, 1979.0, 0.09742704043222178, 0.0598453207342456, 0.044051484101678404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 145.6, 136, 170, 143.0, 164.6, 170.0, 170.0, 0.08391749232154946, 0.06236446450849524, 0.042122647512965246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 253.59999999999994, 137, 429, 150.0, 427.8, 429.0, 429.0, 0.08391655337931961, 0.10648005373456634, 0.04316020649066568], "isController": false}, {"data": ["login", 22, 0, 0.0, 3968.4999999999995, 2569, 6535, 3894.0, 5590.0, 6407.199999999998, 6535.0, 0.0949622525046294, 31.113500192622297, 0.18622347261849778], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d1538069-9c76-47b6-9767-8cfbbaa0f69c", 3, 0, 0.0, 643.3333333333333, 229, 1246, 455.0, 1246.0, 1246.0, 1246.0, 0.055714444898414, 0.02520933541952977, 0.03572833868811054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 164.25, 137, 439, 146.0, 189.50000000000003, 426.5999999999998, 439.0, 0.1541402059313151, 0.12478733468462913, 0.05479202632714717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23535851-0062-4cd7-9c71-051991a4e0d3", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b48fc86a-c4d5-45b8-9090-87a3364fb4d2", 3, 0, 0.0, 1132.0, 364, 2621, 411.0, 2621.0, 2621.0, 2621.0, 0.01963273693441357, 0.023205230406528537, 0.0125900038283837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7792c7ab-555d-49ec-9f05-ad323df50f30", 1, 0, 0.0, 1199.0, 1199, 1199, 1199.0, 1199.0, 1199.0, 1199.0, 0.8340283569641368, 0.1506789512093411, 0.5750234570475395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1236.3999999999999, 283, 2108, 1547.0, 1908.2, 2108.0, 2108.0, 0.08385041086701325, 66.91947893083739, 0.1742789301386327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f302fc08-be96-4a2b-8359-e2623ffc500d", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 467.75, 282, 1126, 446.5, 780.9000000000003, 1126.0, 1126.0, 0.11116823923405082, 0.1722890582660534, 0.2500199755429874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1489.3333333333335, 1353, 1750, 1415.0, 1750.0, 1750.0, 1750.0, 0.09972409666589103, 119.30468931788718, 0.22486615156400627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=469ea015-5d67-4de2-ae13-027b36aa5b49", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1675.608695652174, 697, 3188, 1538.0, 2566.0000000000005, 3082.3999999999987, 3188.0, 0.09910631953601005, 0.031071716349095547, 0.04471398400941079], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eed7656-4676-46d8-81bc-fc712e5ba105", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3d04e46-2258-4c1a-b0a8-9b809c0e1f1b", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 154.84615384615384, 145, 197, 149.0, 184.2, 197.0, 197.0, 0.06675670262970057, 0.05182771346739449, 0.023729921637901375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 456.95000000000005, 281, 1987, 294.0, 566.0, 1915.949999999999, 1987.0, 0.15666859891271992, 9.60217099839023, 0.3503470943849974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0d6a7b6-3e9f-4a55-b53d-c57d6d0ea96e", 1, 0, 0.0, 4325.0, 4325, 4325, 4325.0, 4325.0, 4325.0, 4325.0, 0.23121387283236994, 0.04177203757225433, 0.15941112716763006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 594.5294117647059, 283, 1804, 562.0, 1789.6, 1804.0, 1804.0, 0.08517034068136273, 12.10391975356964, 0.18898637117985972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 142.57142857142856, 138, 146, 144.0, 146.0, 146.0, 146.0, 0.04253302385495024, 0.03160901479845423, 0.021349584239691816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 176.85714285714286, 136, 407, 138.0, 407.0, 407.0, 407.0, 0.04253560838073015, 0.020508239754994894, 0.023748256799620823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 404.42857142857144, 139, 1698, 144.0, 1698.0, 1698.0, 1698.0, 0.04213593051183116, 5.426018005962234, 0.02425402473379121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 299.0, 137, 1265, 138.0, 1265.0, 1265.0, 1265.0, 0.04224604094244882, 1.7842940724278196, 0.024358661720862304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74a53d20-68f7-41e6-9942-833fa75e836c", 1, 0, 0.0, 1034.0, 1034, 1034, 1034.0, 1034.0, 1034.0, 1034.0, 0.9671179883945842, 0.17472346470019343, 0.6667825193423598], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1629.2363636363636, 1104, 2647, 1530.0, 2248.2, 2435.5999999999995, 2647.0, 0.257893897761481, 308.5307601481249, 0.5092397082751119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1675.608695652174, 697, 3188, 1538.0, 2566.0000000000005, 3082.3999999999987, 3188.0, 0.09345832368274556, 0.029300962214393395, 0.04216576713030122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 140.25, 135, 143, 141.5, 143.0, 143.0, 143.0, 0.02991280417582746, 0.008062435500515995, 0.01761466886525777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 207.25, 136, 410, 141.5, 410.0, 410.0, 410.0, 0.02991280417582746, 0.008062435500515995, 0.017585457142429817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 286.9230769230769, 136, 1347, 144.0, 980.9999999999997, 1347.0, 1347.0, 0.06682808218825985, 4.64216714635093, 0.03884583082728025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 242.07692307692307, 137, 1102, 144.0, 823.9999999999998, 1102.0, 1102.0, 0.06683083060440774, 1.528203012142648, 0.03891269290976296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 150.53846153846155, 140, 229, 143.0, 200.59999999999997, 229.0, 229.0, 0.06682842572791578, 0.04966448435443741, 0.033544737132957726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 214.75, 138, 433, 144.0, 433.0, 433.0, 433.0, 0.029913475272773504, 0.008004191625722598, 0.017060028866503638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 169.07692307692307, 134, 424, 142.0, 339.19999999999993, 424.0, 424.0, 0.06683186131874684, 0.02560415360018096, 0.03768328959273692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 165.25, 138, 234, 144.5, 234.0, 234.0, 234.0, 0.02991369897844718, 0.022230786057224908, 0.015015274682540871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 219.0, 146, 413, 158.5, 413.0, 413.0, 413.0, 0.029832045583365652, 0.023481082754094447, 0.010604359953462008], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 1196.923076923077, 519, 3018, 945.0, 2859.2, 3018.0, 3018.0, 0.0978083407943542, 0.017670452194292505, 0.06657462259146961], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2011.0909090909092, 1258, 4295, 1797.5, 3421.3999999999987, 4227.499999999999, 4295.0, 0.10008507231146474, 0.051801844067457345, 0.04603522369013662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 381.0, 282, 577, 332.5, 577.0, 577.0, 577.0, 0.029881966233378156, 0.04631121134020618, 0.06720524241745106], "isController": false}, {"data": ["addBook", 54, 4, 7.407407407407407, 1545.537037037037, 734, 3524, 1281.5, 2577.5, 3092.5, 3524.0, 0.2614822167881268, 87.90490116486697, 0.9498874930392466], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 255.3272727272727, 139, 594, 147.0, 578.8, 586.4, 594.0, 0.25959804782268037, 0.19292393983697242, 0.12548929069553397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b2f5d6a-96b7-406e-8580-ac0f4211b866", 2, 0, 0.0, 1247.0, 813, 1681, 1247.0, 1681.0, 1681.0, 1681.0, 0.06516993059402391, 0.037389974828114306, 0.040508457835054905], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 908.4363636363636, 670, 1359, 840.0, 1191.0, 1274.0, 1359.0, 0.25898440443004594, 76.15001399398686, 0.13025094558737663], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 185.92727272727276, 136, 584, 145.0, 421.2, 452.59999999999945, 584.0, 0.25984824862280426, 0.4598095961958216, 0.12637151153726223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7d134fe-a87d-4601-a3cf-2e056a9d0f6e", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1370.8545454545451, 963, 2026, 1357.0, 1777.8, 1848.7999999999995, 2026.0, 0.2586470408427191, 232.7310620032801, 0.12982869042300546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 180.94117647058823, 142, 521, 154.0, 297.7999999999998, 521.0, 521.0, 0.08118627474390505, 0.06065185564364001, 0.028859183600372502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 4, 2.4539877300613497, 254.23926380368098, 137, 2486, 153.0, 454.99999999999994, 568.1999999999999, 1821.6799999999846, 0.6968253832539608, 1.544211005566053, 0.33321639420651683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 194.28571428571428, 143, 438, 160.0, 438.0, 438.0, 438.0, 0.043658862125313405, 0.03381003678259134, 0.0155193611461075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b48fc86a-c4d5-45b8-9090-87a3364fb4d2", 1, 0, 0.0, 2567.0, 2567, 2567, 2567.0, 2567.0, 2567.0, 2567.0, 0.38955979742890534, 0.07037945559018309, 0.2685832197117257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 148.6875, 141, 162, 146.0, 159.2, 162.0, 162.0, 0.10632076976237308, 0.08628179655520705, 0.03779371112646856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eed7656-4676-46d8-81bc-fc712e5ba105", 3, 0, 0.0, 910.3333333333333, 569, 1584, 578.0, 1584.0, 1584.0, 1584.0, 0.020670410307644608, 0.028495829314086885, 0.0132554389017122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 547.7142857142858, 281, 1836, 291.0, 1836.0, 1836.0, 1836.0, 0.042098679304289253, 7.250874957149558, 0.09314215333241116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eedc3117-eb08-42b7-9158-a7914a7aa9e4", 3, 0, 0.0, 1063.0, 539, 2030, 620.0, 2030.0, 2030.0, 2030.0, 0.024101031524149233, 0.02417164001494264, 0.01545541409588997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7792c7ab-555d-49ec-9f05-ad323df50f30", 3, 0, 0.0, 493.0, 357, 692, 430.0, 692.0, 692.0, 692.0, 0.052330449344125035, 0.034256684124686014, 0.03355826341403852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bd032e5-130b-4107-8917-fef17a66be2d", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.3193359375, 0.5966796875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 462.00000000000006, 284, 1490, 293.0, 1158.7999999999997, 1490.0, 1490.0, 0.0667783062966806, 6.240922323987795, 0.1488716793845095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f302fc08-be96-4a2b-8359-e2623ffc500d", 3, 0, 0.0, 744.6666666666667, 247, 1431, 556.0, 1431.0, 1431.0, 1431.0, 0.08811607824707748, 0.03900972214063326, 0.05650672986547612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8018c1f4-f4d3-4360-ad1d-0cdbf9f16156", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23535851-0062-4cd7-9c71-051991a4e0d3", 3, 0, 0.0, 416.3333333333333, 240, 533, 476.0, 533.0, 533.0, 533.0, 0.035710034519700035, 0.029769986459945243, 0.022899989584573264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 154.35294117647058, 141, 179, 149.0, 171.79999999999998, 179.0, 179.0, 0.08048823214699992, 0.06673291903594036, 0.028611051271003878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74a53d20-68f7-41e6-9942-833fa75e836c", 3, 0, 0.0, 547.3333333333334, 373, 727, 542.0, 727.0, 727.0, 727.0, 0.018161675232923485, 0.02503733548549185, 0.01164664720340471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 184.5333333333333, 140, 425, 148.0, 419.6, 425.0, 425.0, 0.0800991092979046, 0.0621863202068693, 0.02847273025823953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/469ea015-5d67-4de2-ae13-027b36aa5b49", 3, 0, 0.0, 408.6666666666667, 252, 559, 415.0, 559.0, 559.0, 559.0, 0.08607086501219338, 0.03894482498924114, 0.05519518361784537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 147.70588235294116, 136, 250, 140.0, 170.79999999999993, 250.0, 250.0, 0.08523311256285943, 0.06334218619173439, 0.042783027204404044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 224.9411764705882, 136, 433, 143.0, 427.4, 433.0, 433.0, 0.08523524928803498, 0.03786818807408447, 0.04776855997553247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 376.29411764705884, 137, 1663, 143.0, 1649.4, 1663.0, 1663.0, 0.08523567664592598, 9.043236972102864, 0.049247497455464355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e926202e-c54e-4fa9-945c-69fd966e5f0c", 1, 0, 0.0, 997.0, 997, 997, 997.0, 997.0, 997.0, 997.0, 1.0030090270812437, 0.18120768555667002, 0.6915277081243731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 336.82352941176464, 137, 1133, 147.0, 888.9999999999998, 1133.0, 1133.0, 0.08523524928803498, 2.9687405990533873, 0.04933048808461353], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 63.63636363636363, 0.5555555555555556], "isController": false}, {"data": ["401/Unauthorized", 4, 36.36363636363637, 0.31746031746031744], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 11, "406/Not Acceptable", 7, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
