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

    var data = {"OkPercent": 99.10313901345292, "KoPercent": 0.8968609865470852};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7268339768339769, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9792ee58-325e-4a3c-a87c-9e60d8e8646d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1d6389c-e000-4380-87e6-9b532556b10d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/648ba440-1915-4576-9954-202840dcc3f2"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30486941-f56c-4c63-a9c9-7ca249fe2ae8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60d5fa2d-e621-4d83-b8eb-3b1252245665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09c096cd-1e11-4bb8-a6e8-ba2d29b0fcd7"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8be376d7-31b6-4673-8b02-3b1feb674fb4"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4252e5d-79c1-48f5-8a71-c0179fdd21ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1088543-22f5-4e14-945a-0e9366de2786"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a70e6e25-b729-404c-b7b3-811c205c835a"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43cc0b24-84c6-4311-9722-88fd6e0792e5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06eca994-c98c-49c5-9357-9d9353f00488"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9792ee58-325e-4a3c-a87c-9e60d8e8646d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3442dc75-8949-4718-b3df-2135e73771ab"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/1e150e4d-477b-4166-93e1-abec085ca3ea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4695b415-be8f-47c6-877c-19f4551cd77d"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a8d4818e-c0e1-4d55-bf14-053ec4c280da"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60d5fa2d-e621-4d83-b8eb-3b1252245665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.1724137931034483, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8be376d7-31b6-4673-8b02-3b1feb674fb4"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30486941-f56c-4c63-a9c9-7ca249fe2ae8"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09c096cd-1e11-4bb8-a6e8-ba2d29b0fcd7"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=648ba440-1915-4576-9954-202840dcc3f2"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4252e5d-79c1-48f5-8a71-c0179fdd21ec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3585b549-856a-4033-9707-4361b11b71eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9297752808988764, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1088543-22f5-4e14-945a-0e9366de2786"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3585b549-856a-4033-9707-4361b11b71eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4695b415-be8f-47c6-877c-19f4551cd77d"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3442dc75-8949-4718-b3df-2135e73771ab"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e150e4d-477b-4166-93e1-abec085ca3ea"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1d6389c-e000-4380-87e6-9b532556b10d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/06eca994-c98c-49c5-9357-9d9353f00488"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 12, 0.8968609865470852, 529.1831091180862, 141, 5807, 165.5, 1454.5000000000007, 1760.1, 2423.909999999997, 5.244673011492811, 753.7267820079885, 3.8318046986468897], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9792ee58-325e-4a3c-a87c-9e60d8e8646d", 2, 0, 0.0, 314.5, 276, 353, 314.5, 353.0, 353.0, 353.0, 0.08693006476289825, 0.053439917742426214, 0.05403416623201634], "isController": false}, {"data": ["see books", 58, 0, 0.0, 2516.7758620689656, 1799, 3546, 2490.0, 3009.2, 3339.0, 3546.0, 0.256530469627677, 308.69360303402567, 1.2613583150149938], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a1d6389c-e000-4380-87e6-9b532556b10d", 3, 0, 0.0, 373.3333333333333, 248, 593, 279.0, 593.0, 593.0, 593.0, 0.02844168033447416, 0.028525005569829065, 0.018238968183240264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/648ba440-1915-4576-9954-202840dcc3f2", 3, 0, 0.0, 361.6666666666667, 263, 552, 270.0, 552.0, 552.0, 552.0, 0.027259345412252167, 0.02245879011667, 0.01748076512439348], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 738.0714285714286, 447, 1963, 560.5, 1677.5, 1963.0, 1963.0, 0.07429775355435146, 0.013422933991752949, 0.050499254368973255], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 738.0714285714286, 447, 1963, 560.5, 1677.5, 1963.0, 1963.0, 0.07496773709885567, 0.01354397594071123, 0.05095463380937846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30486941-f56c-4c63-a9c9-7ca249fe2ae8", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60d5fa2d-e621-4d83-b8eb-3b1252245665", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 196.0, 147, 451, 149.0, 442.0, 451.0, 451.0, 0.09064107090039977, 0.03858395092501598, 0.050892426938526275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 166.21052631578945, 146, 456, 151.0, 154.0, 456.0, 456.0, 0.0906393412905134, 0.06735990109578192, 0.04549670060871473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09c096cd-1e11-4bb8-a6e8-ba2d29b0fcd7", 3, 0, 0.0, 729.6666666666666, 402, 1300, 487.0, 1300.0, 1300.0, 1300.0, 0.019393751333320403, 0.026735851854365857, 0.012436748088099348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 335.8947368421053, 148, 1173, 152.0, 865.0, 1173.0, 1173.0, 0.09063847651032325, 2.8271974463801857, 0.05255410431296035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 312.3157894736842, 144, 1803, 150.0, 1599.0, 1803.0, 1803.0, 0.09063847651032325, 8.606769963720758, 0.05246559017574324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8be376d7-31b6-4673-8b02-3b1feb674fb4", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 588.2142857142858, 237, 4124, 273.0, 2294.0, 4124.0, 4124.0, 0.07376340913401758, 0.15715887057682987, 0.047686891451874644], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4252e5d-79c1-48f5-8a71-c0179fdd21ec", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 166.42105263157896, 146, 453, 150.0, 161.0, 453.0, 453.0, 0.09131761709081297, 0.067863971295028, 0.04583716326628698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 180.21052631578945, 143, 450, 149.0, 449.0, 450.0, 450.0, 0.09132376196221119, 0.031655399397263174, 0.05167941093770278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1089.8, 876, 1346, 1163.0, 1346.0, 1346.0, 1346.0, 0.10649400438755298, 31.312773223680008, 0.06073486187727631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1591.6, 1343, 1719, 1637.0, 1719.0, 1719.0, 1719.0, 0.10542962572482868, 94.86576255271481, 0.06002487480231945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 382.8, 144, 453, 441.0, 453.0, 453.0, 453.0, 0.1081572173311125, 0.19138757598044517, 0.05988783420580156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 168.35294117647055, 145, 465, 152.0, 215.39999999999978, 465.0, 465.0, 0.09682802772699053, 0.07195911044945293, 0.04860313110514954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 184.35294117647058, 142, 451, 150.0, 443.0, 451.0, 451.0, 0.09683078535462852, 0.034464817673327104, 0.054745438273222306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 304.1764705882353, 141, 1601, 151.0, 690.5999999999992, 1601.0, 1601.0, 0.0968318884496645, 5.14982887989713, 0.0564370599845069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 226.0588235294118, 144, 860, 151.0, 526.3999999999997, 860.0, 860.0, 0.09683078535462852, 1.699355808280741, 0.05653097837540726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 265.6, 148, 440, 157.0, 440.0, 440.0, 440.0, 0.1081782778018174, 0.08039420840545218, 0.06074463841410645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1155.1874999999998, 141, 2286, 1493.5, 1946.5000000000005, 2286.0, 2286.0, 0.08357797302520921, 47.01070197988383, 0.04464565551248969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 272.3684210526316, 146, 1902, 149.0, 450.0, 1902.0, 1902.0, 0.09132463986849253, 4.348270457019741, 0.05327583586078279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1088543-22f5-4e14-945a-0e9366de2786", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 779.625, 147, 1339, 1010.0, 1308.9, 1339.0, 1339.0, 0.08376831777511348, 15.402633564656053, 0.04482913880933807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 265.2105263157895, 146, 1184, 151.0, 453.0, 1184.0, 1184.0, 0.09118964085679868, 1.4344839176269575, 0.05328613419515543], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 589.0714285714286, 257, 1154, 536.0, 1024.5, 1154.0, 1154.0, 0.07497616828936517, 0.013545499153840386, 0.05169255352762872], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 509.5882352941176, 296, 1748, 305.0, 1079.1999999999994, 1748.0, 1748.0, 0.09674647302196146, 6.949495673440817, 0.21612899755003784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a70e6e25-b729-404c-b7b3-811c205c835a", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 724.7727272727273, 196, 1882, 603.0, 1459.7999999999997, 1836.8499999999995, 1882.0, 0.09813017413645447, 0.060277226105302596, 0.044369404907400795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 150.875, 145, 157, 151.0, 156.3, 157.0, 157.0, 0.08376744064291511, 0.062252951493416406, 0.04204732860396325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43cc0b24-84c6-4311-9722-88fd6e0792e5", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 252.12500000000003, 144, 597, 152.5, 509.5000000000001, 597.0, 597.0, 0.08365050817683717, 0.10090750998577942, 0.04331609566481241], "isController": false}, {"data": ["login", 22, 0, 0.0, 3686.909090909091, 1823, 8551, 2977.0, 7671.0999999999985, 8483.949999999999, 8551.0, 0.0981468097825602, 26.821146991856047, 0.18507086645788165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 172.31578947368422, 150, 448, 155.0, 187.0, 448.0, 448.0, 0.08913492212422594, 0.07216098675877275, 0.03168467934884594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1308.9374999999998, 297, 2436, 1647.0, 2098.6000000000004, 2436.0, 2436.0, 0.0835099220226103, 62.49034620408259, 0.17446152410827062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06eca994-c98c-49c5-9357-9d9353f00488", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9792ee58-325e-4a3c-a87c-9e60d8e8646d", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3442dc75-8949-4718-b3df-2135e73771ab", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 590.8421052631579, 298, 1950, 307.0, 1747.0, 1950.0, 1950.0, 0.09057150620414818, 11.531382989658164, 0.20125811717331096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1858.4, 1499, 2077, 1867.0, 2077.0, 2077.0, 2077.0, 0.10447792381469795, 124.99191928557995, 0.23558547469544686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e150e4d-477b-4166-93e1-abec085ca3ea", 3, 0, 0.0, 1777.3333333333335, 538, 4124, 670.0, 4124.0, 4124.0, 4124.0, 0.03177865110218955, 0.025830498633518002, 0.020378887588318167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4695b415-be8f-47c6-877c-19f4551cd77d", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1433.6818181818182, 266, 5034, 1256.5, 2853.3999999999996, 4731.749999999995, 5034.0, 0.10243993294840752, 0.03239444612590799, 0.046218016623207306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 156.85714285714283, 152, 175, 155.0, 168.0, 175.0, 175.0, 0.06444544692917445, 0.050033330379583685, 0.022908342463104983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 488.36842105263156, 296, 2051, 304.0, 902.0, 2051.0, 2051.0, 0.09111879492995842, 5.871139515463819, 0.20370127392467832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 495.5882352941176, 294, 894, 598.0, 662.7999999999998, 894.0, 894.0, 0.10265142594907281, 0.15908966111443218, 0.23086546285226042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8d4818e-c0e1-4d55-bf14-053ec4c280da", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.6071025427756653, 1.1343720294676805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60d5fa2d-e621-4d83-b8eb-3b1252245665", 3, 0, 0.0, 376.6666666666667, 258, 606, 266.0, 606.0, 606.0, 606.0, 0.021422909659589966, 0.02532115396288124, 0.01373799870748445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 178.18181818181822, 147, 448, 150.0, 391.2000000000002, 448.0, 448.0, 0.05350949307052065, 0.039766332252603724, 0.026859257263913684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 149.72727272727272, 147, 154, 150.0, 153.6, 154.0, 154.0, 0.05351105489747768, 0.021624851020358524, 0.030109469632476345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 306.2727272727273, 145, 1604, 148.0, 1370.4000000000008, 1604.0, 1604.0, 0.05351157552672417, 4.390367285515876, 0.031040894397338044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 309.1818181818182, 145, 1185, 148.0, 1066.8000000000004, 1185.0, 1185.0, 0.05339494786711453, 1.4403457838621052, 0.03102538474700503], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1707.8103448275858, 1163, 2704, 1598.5, 2250.1, 2387.9, 2704.0, 0.25864913798485567, 309.4342900192649, 0.5107310127005646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8be376d7-31b6-4673-8b02-3b1feb674fb4", 3, 0, 0.0, 678.6666666666666, 257, 1030, 749.0, 1030.0, 1030.0, 1030.0, 0.026354396352551542, 0.02643160649811566, 0.01690044297347869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1433.6818181818182, 266, 5034, 1256.5, 2853.3999999999996, 4731.749999999995, 5034.0, 0.09919785011204849, 0.03136920650737897, 0.044755280031021874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 208.2, 144, 454, 148.0, 454.0, 454.0, 454.0, 0.027422203209494664, 0.007391140708809109, 0.016148035679028595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 151.0, 146, 160, 149.0, 160.0, 160.0, 160.0, 0.027422654403255618, 0.007391262319627491, 0.01612152143628895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 314.3571428571429, 146, 1306, 150.0, 1303.5, 1306.0, 1306.0, 0.06472461985843801, 8.33485693836367, 0.03725638693302389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 327.64285714285717, 145, 1349, 148.0, 1255.0, 1349.0, 1349.0, 0.06472491909385113, 2.7337068018955155, 0.037319767105871475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 192.71428571428572, 146, 453, 151.5, 445.0, 453.0, 453.0, 0.06472282450406136, 0.04809967719491279, 0.03248782401864018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 151.6, 146, 166, 148.0, 166.0, 166.0, 166.0, 0.027422353605765278, 0.007337621960917661, 0.015639311040788008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 211.71428571428567, 145, 446, 150.0, 443.5, 446.0, 446.0, 0.06472372216879946, 0.031206080331385458, 0.03613620760596198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 151.0, 148, 155, 152.0, 155.0, 155.0, 155.0, 0.027421752030580736, 0.020378860639914006, 0.013764434124725097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 159.6, 153, 173, 156.0, 173.0, 173.0, 173.0, 0.0260133500512463, 0.02047535170049269, 0.009246933026028957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30486941-f56c-4c63-a9c9-7ca249fe2ae8", 3, 0, 0.0, 341.0, 263, 488, 272.0, 488.0, 488.0, 488.0, 0.05635496111507683, 0.03623080996167863, 0.036139086392155385], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 564.0, 487, 749, 543.0, 725.3000000000001, 749.0, 749.0, 0.08962045736306741, 0.016191195910319797, 0.0610014245918535], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2163.0909090909086, 1097, 5807, 1581.0, 5550.4, 5802.35, 5807.0, 0.09759906304899474, 0.050515140054655475, 0.044891756539137226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09c096cd-1e11-4bb8-a6e8-ba2d29b0fcd7", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 366.0, 301, 602, 306.0, 602.0, 602.0, 602.0, 0.027399211998662916, 0.04246342718933403, 0.06162146995402412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=648ba440-1915-4576-9954-202840dcc3f2", 1, 0, 0.0, 895.0, 895, 895, 895.0, 895.0, 895.0, 895.0, 1.1173184357541899, 0.2018592877094972, 0.770338687150838], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 1644.566666666667, 752, 6492, 1198.5, 2986.6999999999994, 3738.8499999999985, 6492.0, 0.267298679544523, 91.65479426633195, 0.9700061993803126], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 270.0862068965518, 143, 628, 153.0, 600.5, 612.65, 628.0, 0.2603325074508959, 0.1934697638380193, 0.12584432733222017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4252e5d-79c1-48f5-8a71-c0179fdd21ec", 3, 0, 0.0, 410.6666666666667, 271, 559, 402.0, 559.0, 559.0, 559.0, 0.03256798567008631, 0.027150589616240572, 0.02088506893556967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3585b549-856a-4033-9707-4361b11b71eb", 3, 0, 0.0, 459.6666666666667, 418, 515, 446.0, 515.0, 515.0, 515.0, 0.01869718046518585, 0.025775572679056665, 0.011990053879041708], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 958.2931034482758, 722, 1354, 893.0, 1231.4, 1341.05, 1354.0, 0.2596821132751287, 76.35516356055518, 0.1306018440788001], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 225.31034482758616, 141, 612, 154.0, 450.3, 455.84999999999997, 612.0, 0.2605547119971968, 0.46105970521378964, 0.12671508454551172], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1432.1724137931035, 977, 2105, 1438.5, 1780.9, 1799.1, 2105.0, 0.25939293109539846, 233.40221536377624, 0.13020309236624494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 197.05882352941177, 149, 485, 156.0, 460.2, 485.0, 485.0, 0.10390816962703078, 0.07762670875456891, 0.0369361071721086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, 3.932584269662921, 282.7865168539325, 145, 5573, 156.0, 419.2, 570.9999999999997, 3406.8200000000215, 0.763237671353289, 1.6782418573688882, 0.3662386787305385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 209.81818181818184, 148, 455, 156.0, 454.8, 455.0, 455.0, 0.05260011954572624, 0.04073427226539151, 0.018697698744769873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1088543-22f5-4e14-945a-0e9366de2786", 3, 0, 0.0, 409.3333333333333, 257, 507, 464.0, 507.0, 507.0, 507.0, 0.02687281098560513, 0.026951539924039522, 0.017232889857305374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3585b549-856a-4033-9707-4361b11b71eb", 1, 0, 0.0, 870.0, 870, 870, 870.0, 870.0, 870.0, 870.0, 1.1494252873563218, 0.20765984195402298, 0.7924748563218391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 156.99999999999997, 149, 192, 154.0, 171.0, 192.0, 192.0, 0.09346667912889055, 0.07585040073838677, 0.03322448359659781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4695b415-be8f-47c6-877c-19f4551cd77d", 3, 0, 0.0, 623.3333333333334, 247, 1089, 534.0, 1089.0, 1089.0, 1089.0, 0.06672746279943949, 0.04289932911096777, 0.04279072321448431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 528.2727272727273, 297, 1753, 305.0, 1579.8000000000006, 1753.0, 1753.0, 0.05335506339551623, 5.8780094832562115, 0.11875575234277233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3442dc75-8949-4718-b3df-2135e73771ab", 2, 0, 0.0, 246.5, 237, 256, 246.5, 256.0, 256.0, 256.0, 0.04033965993666674, 0.0356517502369955, 0.025074407763367553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 534.1428571428571, 299, 1787, 303.5, 1620.5, 1787.0, 1787.0, 0.06467797299232642, 11.139824393528507, 0.14309821061457934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e150e4d-477b-4166-93e1-abec085ca3ea", 1, 0, 0.0, 1154.0, 1154, 1154, 1154.0, 1154.0, 1154.0, 1154.0, 0.8665511265164644, 0.15655464688041595, 0.5974463821490469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 247.64705882352945, 147, 1159, 154.0, 602.1999999999995, 1159.0, 1159.0, 0.10475204574583456, 0.08685008480294291, 0.037236078761214625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1d6389c-e000-4380-87e6-9b532556b10d", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06eca994-c98c-49c5-9357-9d9353f00488", 3, 0, 0.0, 440.6666666666667, 333, 508, 481.0, 508.0, 508.0, 508.0, 0.0741986545310645, 0.03357295891867827, 0.04758181947467352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 155.24999999999997, 146, 170, 153.0, 168.6, 170.0, 170.0, 0.0852029160698025, 0.06614874831591111, 0.0302869740716876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 168.0588235294118, 145, 440, 152.0, 214.3999999999998, 440.0, 440.0, 0.1027463494826419, 0.07635739448856495, 0.051573851205154245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 253.94117647058823, 142, 451, 151.0, 449.4, 451.0, 451.0, 0.10275007555152614, 0.027493672559685708, 0.058599652462979754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 289.4117647058824, 144, 453, 153.0, 453.0, 453.0, 453.0, 0.10275069658928128, 0.02769452369007972, 0.060406171237057944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 252.47058823529412, 147, 452, 150.0, 446.4, 452.0, 452.0, 0.10275069658928128, 0.02769452369007972, 0.06050651371419591], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.37369207772795215], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.523168908819133], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
