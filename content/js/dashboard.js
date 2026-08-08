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

    var data = {"OkPercent": 99.59349593495935, "KoPercent": 0.4065040650406504};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7587904360056259, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/827982e6-39ba-40d3-bae5-352347e67cd8"], "isController": false}, {"data": [0.0660377358490566, 500, 1500, "see books"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a77fbfc7-c78f-4d00-bbf3-6bc3d275232f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e55b2e25-ae22-472e-bcf5-34b251139680"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/19960197-897f-42ea-8a4c-37a0e5a98e26"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7a25d3c-74c5-4eb7-b78d-c11b2ab5f79c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c82f15d9-646a-477b-b1a3-1427968fa402"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12d28103-5e37-4e24-bec9-7c647d49c191"], "isController": false}, {"data": [0.45, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb8f5456-780d-4572-8a78-81078d9c8f57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b354166b-3dfc-4afd-988f-b3284415cd09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0bf3efd2-7fc1-4496-b305-7bb053562361"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/99841ce4-8da8-49c9-b180-c78bb7c1b14b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8009649-ea8f-4441-88c3-d7740593d2aa"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33bdcb4c-962e-4306-99f2-d341a147db5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b2ce99a-6b50-43fb-aa97-b8563e80c0ce"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.37735849056603776, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.35, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bf3efd2-7fc1-4496-b305-7bb053562361"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8009649-ea8f-4441-88c3-d7740593d2aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a77fbfc7-c78f-4d00-bbf3-6bc3d275232f"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb8f5456-780d-4572-8a78-81078d9c8f57"], "isController": false}, {"data": [0.9461077844311377, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c82f15d9-646a-477b-b1a3-1427968fa402"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/12d28103-5e37-4e24-bec9-7c647d49c191"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7a25d3c-74c5-4eb7-b78d-c11b2ab5f79c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/788f8947-24da-4a3a-964f-86819b5a476a"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99841ce4-8da8-49c9-b180-c78bb7c1b14b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e02b07d-93b9-457e-99c3-5a3dd1cf884a"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=827982e6-39ba-40d3-bae5-352347e67cd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b2ce99a-6b50-43fb-aa97-b8563e80c0ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1230, 5, 0.4065040650406504, 488.3699186991867, 96, 8419, 129.5, 1160.9, 1521.45, 5413.1300000000265, 4.765373171336474, 670.5215798398563, 3.4849061405513884], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/827982e6-39ba-40d3-bae5-352347e67cd8", 3, 0, 0.0, 2107.333333333333, 320, 5602, 400.0, 5602.0, 5602.0, 5602.0, 0.02059096056831051, 0.02433781830193212, 0.013204489687360583], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1891.018867924528, 1249, 3878, 1869.0, 2325.8, 2773.7999999999997, 3878.0, 0.24600360186405745, 296.02483436095923, 1.2095977884624312], "isController": true}, {"data": ["deleteBook", 11, 0, 0.0, 1191.6363636363635, 453, 2395, 816.0, 2394.0, 2395.0, 2395.0, 0.07724176672986448, 0.013954811372094656, 0.052500263324204766], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 1191.6363636363635, 453, 2395, 816.0, 2394.0, 2395.0, 2395.0, 0.07626654464019524, 0.013778623787535273, 0.05183741706013271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 125.95000000000002, 99, 330, 105.0, 286.6000000000004, 328.79999999999995, 330.0, 0.09417348639663989, 0.025198764914725908, 0.05370831646058369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a77fbfc7-c78f-4d00-bbf3-6bc3d275232f", 3, 0, 0.0, 720.0, 212, 1366, 582.0, 1366.0, 1366.0, 1366.0, 0.020874792991636165, 0.024673298617392876, 0.013386504620287516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 106.95000000000002, 104, 112, 106.5, 111.0, 111.95, 112.0, 0.09417082587814295, 0.06998437352858085, 0.047269340333364725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 168.10000000000002, 100, 329, 106.5, 326.5, 328.9, 329.0, 0.09407470472302054, 0.02535607275737663, 0.05539750678513808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 137.05000000000007, 100, 319, 107.0, 315.6, 318.85, 319.0, 0.0940800150528024, 0.02535750405720065, 0.05530875884940142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e55b2e25-ae22-472e-bcf5-34b251139680", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.5563343858885018, 1.0395116506968642], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 454.3636363636364, 200, 1070, 345.0, 1028.0000000000002, 1070.0, 1070.0, 0.07768032428004464, 0.21489671385746367, 0.05021911589198198], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19960197-897f-42ea-8a4c-37a0e5a98e26", 1, 0, 0.0, 5561.0, 5561, 5561, 5561.0, 5561.0, 5561.0, 5561.0, 0.1798237727027513, 0.05742419304082, 0.10729719250134868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7a25d3c-74c5-4eb7-b78d-c11b2ab5f79c", 1, 0, 0.0, 971.0, 971, 971, 971.0, 971.0, 971.0, 971.0, 1.0298661174047374, 0.1860597966014418, 0.710044412976313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 131.46666666666664, 102, 483, 105.0, 262.20000000000016, 483.0, 483.0, 0.09881292736591085, 0.07343421652876773, 0.049599457681716974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 130.6, 99, 310, 104.0, 308.2, 310.0, 310.0, 0.09868421052631579, 0.026405736019736843, 0.05628083881578947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 776.5, 606, 849, 825.5, 849.0, 849.0, 849.0, 0.2066115702479339, 60.750661802685954, 0.1178331611570248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1020.5, 838, 1185, 1029.5, 1185.0, 1185.0, 1185.0, 0.20060180541624872, 180.5018571339017, 0.11420981695085256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 263.5, 106, 333, 307.5, 333.0, 333.0, 333.0, 0.2098085496984002, 0.3712627852084972, 0.11617328874901652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 105.72727272727273, 103, 111, 105.0, 110.4, 111.0, 111.0, 0.06579655704561496, 0.048897636632532215, 0.0330267874232872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 124.81818181818183, 101, 307, 104.0, 271.0000000000001, 307.0, 307.0, 0.06579655704561496, 0.026589659771985023, 0.03702224596547476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c82f15d9-646a-477b-b1a3-1427968fa402", 3, 0, 0.0, 2864.6666666666665, 261, 7696, 637.0, 7696.0, 7696.0, 7696.0, 0.02296263978506969, 0.023029913143815015, 0.014725390747587011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 176.63636363636363, 100, 907, 103.0, 747.2000000000006, 907.0, 907.0, 0.06579852491670506, 5.398452360746394, 0.03816828496144805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 190.0, 102, 807, 107.0, 711.6000000000004, 807.0, 807.0, 0.06579576993013686, 1.7748619223430473, 0.038230940535577566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 157.25, 102, 318, 104.5, 318.0, 318.0, 318.0, 0.212122819112266, 0.15764205600042425, 0.11911193456011031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 790.2666666666668, 103, 1304, 1006.0, 1296.2, 1304.0, 1304.0, 0.0807976342452693, 48.47516137644156, 0.04287114056633755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 133.00000000000003, 101, 328, 104.0, 320.8, 328.0, 328.0, 0.09881553116641853, 0.026633873634698744, 0.05809272437713277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 576.2000000000002, 101, 1052, 777.0, 925.4000000000001, 1052.0, 1052.0, 0.08080024563274672, 15.845896088190775, 0.042951432655688605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 147.86666666666667, 99, 318, 108.0, 316.8, 318.0, 318.0, 0.09867706942260757, 0.0265965538678122, 0.05810768834163317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12d28103-5e37-4e24-bec9-7c647d49c191", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 2061.0, 457, 8054, 944.5, 7732.500000000002, 8054.0, 8054.0, 0.1187338225166821, 0.021450934732017764, 0.08186140497732185], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb8f5456-780d-4572-8a78-81078d9c8f57", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b354166b-3dfc-4afd-988f-b3284415cd09", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bf3efd2-7fc1-4496-b305-7bb053562361", 3, 0, 0.0, 1431.0, 207, 3445, 641.0, 3445.0, 3445.0, 3445.0, 0.01721664275466284, 0.02034948888091822, 0.011040620516499282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 308.45454545454544, 207, 1011, 216.0, 897.4000000000004, 1011.0, 1011.0, 0.0657529005995469, 7.2438518235969225, 0.14635040580000358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 908.5500000000001, 164, 2576, 907.5, 1619.6000000000001, 2528.249999999999, 2576.0, 0.08631218253300361, 0.05301793243482351, 0.03902591846951238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 105.0, 98, 111, 106.0, 110.4, 111.0, 111.0, 0.08079458783987589, 0.06004363412709527, 0.0405550958493127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 191.26666666666665, 99, 331, 108.0, 327.4, 331.0, 331.0, 0.08079632861482773, 0.1025208622853511, 0.041555403389136665], "isController": false}, {"data": ["login", 20, 0, 0.0, 5843.25, 1743, 12818, 3089.5, 12150.700000000003, 12789.3, 12818.0, 0.08789740614754459, 21.15311165058144, 0.16176899572818607], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 110.73333333333333, 105, 116, 112.0, 116.0, 116.0, 116.0, 0.0950407724913988, 0.07694218788610314, 0.03378402459655192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99841ce4-8da8-49c9-b180-c78bb7c1b14b", 3, 0, 0.0, 2065.333333333333, 382, 4744, 1070.0, 4744.0, 4744.0, 4744.0, 0.02000013333422223, 0.027571798395322637, 0.012825606337375582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8009649-ea8f-4441-88c3-d7740593d2aa", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 897.9333333333332, 210, 1414, 1110.0, 1400.2, 1414.0, 1414.0, 0.08074804993459407, 64.44354142610477, 0.16783082644283306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33bdcb4c-962e-4306-99f2-d341a147db5f", 2, 0, 0.0, 388.5, 345, 432, 388.5, 432.0, 432.0, 432.0, 0.02489172101359088, 0.028319194317220093, 0.015472246508936128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 309.1499999999999, 210, 439, 218.5, 438.6, 439.0, 439.0, 0.09402517053815307, 0.14572065004301651, 0.21146481225524072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1179.75, 1013, 1289, 1208.5, 1289.0, 1289.0, 1289.0, 0.19957092251658934, 238.756205408372, 0.45000904305742656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b2ce99a-6b50-43fb-aa97-b8563e80c0ce", 3, 0, 0.0, 316.3333333333333, 200, 455, 294.0, 455.0, 455.0, 455.0, 0.02964778432225165, 0.024716137906668774, 0.019012413774360595], "isController": false}, {"data": ["register", 20, 4, 20.0, 1600.3000000000002, 815, 3215, 1503.0, 2549.800000000001, 3184.0499999999997, 3215.0, 0.09335499169140574, 0.029611036427117758, 0.04211914664202095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 229.10526315789474, 101, 1901, 111.0, 512.0, 1901.0, 1901.0, 0.09123342792799281, 0.07083063984643974, 0.03243063258377869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 309.9333333333333, 208, 801, 218.0, 579.0000000000001, 801.0, 801.0, 0.09860571518725225, 0.15281959961149347, 0.22176656452758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 471.83333333333337, 209, 1801, 407.5, 1321.3000000000009, 1801.0, 1801.0, 0.10016750232332958, 13.45300857266874, 0.222431416563253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 135.71428571428572, 104, 314, 104.0, 314.0, 314.0, 314.0, 0.03494251955533148, 0.025968024786725837, 0.017539506886172247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 104.42857142857143, 101, 110, 104.0, 110.0, 110.0, 110.0, 0.0349428684101494, 0.01684745441203632, 0.01950911821671567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 305.5714285714286, 101, 1251, 110.0, 1251.0, 1251.0, 1251.0, 0.0349428684101494, 4.499737655495765, 0.020113598641221603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 229.85714285714283, 100, 781, 106.0, 781.0, 781.0, 781.0, 0.03494304284017052, 1.4758463236175035, 0.020147823110829348], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1273.0188679245289, 815, 2257, 1216.0, 1743.8, 1804.6, 2257.0, 0.24222149098753246, 289.78111303631493, 0.4782928269304596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, 20.0, 1600.3000000000002, 815, 3215, 1503.0, 2549.800000000001, 3184.0499999999997, 3215.0, 0.0915755108768813, 0.02904660735626079, 0.04131629494640543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 107.4, 104, 116, 105.0, 116.0, 116.0, 116.0, 0.05945798104479564, 0.016025783953480074, 0.03501285407227712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 106.8, 104, 114, 106.0, 114.0, 114.0, 114.0, 0.0594558599695586, 0.01602521225742009, 0.03495354267741629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 190.15789473684208, 98, 865, 105.0, 333.0, 865.0, 865.0, 0.09411857950295482, 4.4812992342339, 0.05490572971620772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 166.73684210526315, 98, 836, 109.0, 321.0, 836.0, 836.0, 0.09422266303000247, 1.482195713488718, 0.05505846299280932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 130.68421052631578, 99, 333, 108.0, 312.0, 333.0, 333.0, 0.09422079403334424, 0.07002150806579586, 0.047294422005018495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 104.0, 99, 108, 103.0, 108.0, 108.0, 108.0, 0.05945798104479564, 0.015909655084251958, 0.033909629814610015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 137.0, 99, 312, 105.0, 310.0, 312.0, 312.0, 0.09412557342290125, 0.03262658651130993, 0.05326493438456737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 105.6, 99, 110, 107.0, 110.0, 110.0, 110.0, 0.05945444600347214, 0.044184407625627246, 0.029843344966586603], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 3045.7000000000003, 455, 7696, 2135.5, 7525.6, 7696.0, 7696.0, 0.11128545832916012, 0.02010528299892053, 0.0757480121635006], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 317.6, 107, 928, 123.0, 928.0, 928.0, 928.0, 0.060607529879512234, 0.047704754963756694, 0.02154408288685786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 3822.2499999999995, 874, 8419, 2191.0, 8255.800000000001, 8413.55, 8419.0, 0.08822737960271211, 0.04566456170843498, 0.04058114823523184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 214.8, 204, 220, 218.0, 220.0, 220.0, 220.0, 0.05937889674009857, 0.09202569250638323, 0.13354453046137402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bf3efd2-7fc1-4496-b305-7bb053562361", 1, 0, 0.0, 8054.0, 8054, 8054, 8054.0, 8054.0, 8054.0, 8054.0, 0.12416190712689348, 0.022431594549292277, 0.08560381487459646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8009649-ea8f-4441-88c3-d7740593d2aa", 3, 0, 0.0, 400.0, 224, 649, 327.0, 649.0, 649.0, 649.0, 0.023529965410950846, 0.023598900856490742, 0.015089203079288141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a77fbfc7-c78f-4d00-bbf3-6bc3d275232f", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.19680181100217864, 0.751038262527233], "isController": false}, {"data": ["addBook", 57, 1, 1.7543859649122806, 1336.2456140350882, 543, 5508, 956.0, 2093.400000000001, 3025.4999999999864, 5508.0, 0.27266986854442127, 86.8387381962649, 0.992833558664683], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 223.35849056603774, 102, 551, 113.0, 438.4, 465.39999999999986, 551.0, 0.2433425160697888, 0.18084341282139577, 0.11763139204545454], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 687.7169811320753, 503, 1102, 647.0, 892.6, 926.1999999999999, 1102.0, 0.24328778190397934, 71.53468579440347, 0.1223566481255365], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 157.92452830188674, 98, 433, 111.0, 321.2, 326.09999999999997, 433.0, 0.24374652201307034, 0.43131708778094086, 0.11854078902588773], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1047.830188679245, 701, 1818, 1041.0, 1322.4, 1397.0999999999997, 1818.0, 0.24273178595636324, 218.41048768050314, 0.12183997849762764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 162.16666666666669, 105, 673, 113.0, 471.4000000000003, 673.0, 673.0, 0.10674447152591222, 0.0797456257005106, 0.03794432386272661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb8f5456-780d-4572-8a78-81078d9c8f57", 3, 0, 0.0, 418.33333333333337, 205, 826, 224.0, 826.0, 826.0, 826.0, 0.022134340691771927, 0.030513975530486365, 0.01419422238372093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 1, 0.5988023952095808, 255.67065868263475, 99, 3990, 114.0, 460.80000000000007, 750.7999999999995, 3422.1999999999944, 0.6940173213424872, 1.430944010308443, 0.3359373701314893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 145.0, 108, 320, 114.0, 320.0, 320.0, 320.0, 0.036055711224657984, 0.02792204980581424, 0.012816678599390143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c82f15d9-646a-477b-b1a3-1427968fa402", 1, 0, 0.0, 1321.0, 1321, 1321, 1321.0, 1321.0, 1321.0, 1321.0, 0.757002271006813, 0.13676310560181681, 0.5219175813777441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12d28103-5e37-4e24-bec9-7c647d49c191", 3, 0, 0.0, 2662.666666666667, 860, 5992, 1136.0, 5992.0, 5992.0, 5992.0, 0.01777324889065305, 0.02100737849022175, 0.01139755869615446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 185.0, 103, 1522, 113.0, 146.20000000000005, 1453.299999999999, 1522.0, 0.09478493298705239, 0.07692019464085989, 0.03369308164774128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7a25d3c-74c5-4eb7-b78d-c11b2ab5f79c", 3, 0, 0.0, 293.6666666666667, 204, 466, 211.0, 466.0, 466.0, 466.0, 0.03829510205644698, 0.03192505090057315, 0.024557731461979346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/788f8947-24da-4a3a-964f-86819b5a476a", 1, 0, 0.0, 1923.0, 1923, 1923, 1923.0, 1923.0, 1923.0, 1923.0, 0.5200208008320333, 0.1660613299531981, 0.31028584893395733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 443.57142857142856, 208, 1356, 220.0, 1356.0, 1356.0, 1356.0, 0.03492438869846781, 6.015209493321958, 0.07726923554255039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 345.2105263157895, 209, 964, 218.0, 667.0, 964.0, 964.0, 0.09406778821875217, 6.061154660440039, 0.2102939169703241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99841ce4-8da8-49c9-b180-c78bb7c1b14b", 1, 0, 0.0, 4839.0, 4839, 4839, 4839.0, 4839.0, 4839.0, 4839.0, 0.20665426741062204, 0.03733499948336433, 0.142478430460839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 130.9090909090909, 105, 330, 110.0, 287.8000000000002, 330.0, 330.0, 0.07051010858556722, 0.05846004120033845, 0.02506414016127585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e02b07d-93b9-457e-99c3-5a3dd1cf884a", 1, 0, 0.0, 4076.0, 4076, 4076, 4076.0, 4076.0, 4076.0, 4076.0, 0.2453385672227674, 0.07834542136898921, 0.14638853962217863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 174.79999999999998, 104, 555, 114.0, 439.20000000000005, 555.0, 555.0, 0.07887181752216299, 0.0612334911426949, 0.028036466384831375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=827982e6-39ba-40d3-bae5-352347e67cd8", 1, 0, 0.0, 2381.0, 2381, 2381, 2381.0, 2381.0, 2381.0, 2381.0, 0.41999160016799664, 0.07587738870222596, 0.2895645212095758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b2ce99a-6b50-43fb-aa97-b8563e80c0ce", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 142.72222222222223, 98, 322, 108.0, 321.1, 322.0, 322.0, 0.10022606545875697, 0.07448440997472076, 0.05030878676347762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 197.77777777777777, 101, 328, 108.0, 323.5, 328.0, 328.0, 0.1002294139920262, 0.04354585217275096, 0.05622678714613449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 273.94444444444446, 96, 1479, 106.5, 999.3000000000008, 1479.0, 1479.0, 0.10023053021950487, 10.044858817641686, 0.057967526700299574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 239.33333333333334, 101, 705, 110.0, 632.1000000000001, 705.0, 705.0, 0.10022997210265776, 3.2985622915355792, 0.058065084750009745], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 80.0, 0.3252032520325203], "isController": false}, {"data": ["401/Unauthorized", 1, 20.0, 0.08130081300813008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1230, 5, "406/Not Acceptable", 4, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
