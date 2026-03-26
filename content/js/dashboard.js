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

    var data = {"OkPercent": 98.48714069591529, "KoPercent": 1.51285930408472};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.761437908496732, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca1a45a6-b95a-47c5-84a1-492502adae78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdcc08dd-74fb-462f-b604-f1be98b014b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02c13cb9-eeb0-4987-ad0f-76a1a6f6d871"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3477d235-06a5-4b53-a4f0-8b306d1c582e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/967205a5-fe80-4336-bbdf-6b0c03513a77"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/758bdb49-b821-40fb-9ab1-a2eaa158ead9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/932ea6b9-a3bb-4dba-8cce-8bfdb05701e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b20a635d-2f83-4ad0-8c86-401108dd047f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc666b33-316c-4897-8db1-cec3952caf10"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e9c66a2-31b5-4091-8f43-086fcaf33396"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6881ea3-2c51-4bc9-aae3-58ac97635565"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adbca780-4f38-4f82-bf7a-ae33364b8d5f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6455a4c7-4bc3-4edb-a4ba-43f55d5d8b06"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdcc08dd-74fb-462f-b604-f1be98b014b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=967205a5-fe80-4336-bbdf-6b0c03513a77"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=932ea6b9-a3bb-4dba-8cce-8bfdb05701e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3477d235-06a5-4b53-a4f0-8b306d1c582e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c0ce9cf-e947-430a-a810-74dc4209cf83"], "isController": false}, {"data": [0.2903225806451613, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc666b33-316c-4897-8db1-cec3952caf10"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.45535714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ca1a45a6-b95a-47c5-84a1-492502adae78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/adbca780-4f38-4f82-bf7a-ae33364b8d5f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6881ea3-2c51-4bc9-aae3-58ac97635565"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c0ce9cf-e947-430a-a810-74dc4209cf83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e9c66a2-31b5-4091-8f43-086fcaf33396"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02c13cb9-eeb0-4987-ad0f-76a1a6f6d871"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 20, 1.51285930408472, 442.8555219364593, 138, 2686, 170.0, 1157.1000000000006, 1360.199999999999, 1864.3999999999996, 5.119189603630675, 707.4910145843174, 3.755823737676383], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2214.9107142857147, 1695, 3962, 2161.0, 2607.9000000000005, 2810.4, 3962.0, 0.25574279581677856, 307.74443898564874, 1.257485329040508], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca1a45a6-b95a-47c5-84a1-492502adae78", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdcc08dd-74fb-462f-b604-f1be98b014b8", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02c13cb9-eeb0-4987-ad0f-76a1a6f6d871", 3, 0, 0.0, 387.0, 271, 476, 414.0, 476.0, 476.0, 476.0, 0.017743814801890308, 0.024449729185026584, 0.011378683320222625], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 636.0000000000001, 159, 1323, 517.0, 1240.6, 1323.0, 1323.0, 0.06432331868740847, 0.01218625373570043, 0.04348298864693425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 636.0000000000001, 159, 1323, 517.0, 1240.6, 1323.0, 1323.0, 0.06549415338730723, 0.01240807202845469, 0.04427448064395866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 285.92857142857144, 139, 604, 156.0, 529.0, 604.0, 604.0, 0.12710633352701917, 0.04764714260422719, 0.07172783469821324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 175.71428571428575, 141, 457, 156.5, 309.0, 457.0, 457.0, 0.1271017176889276, 0.09445742886843157, 0.063799104386825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 263.07142857142856, 140, 759, 158.0, 616.0, 759.0, 759.0, 0.12711556620905065, 2.701542723314811, 0.07407390067734437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 294.64285714285717, 145, 1301, 157.0, 871.0, 1301.0, 1301.0, 0.12711787458913687, 8.20187829428242, 0.07395110728748615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3477d235-06a5-4b53-a4f0-8b306d1c582e", 3, 0, 0.0, 521.6666666666667, 245, 1036, 284.0, 1036.0, 1036.0, 1036.0, 0.03316089667064597, 0.027644875121589953, 0.021265288555069196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/967205a5-fe80-4336-bbdf-6b0c03513a77", 3, 0, 0.0, 789.0, 254, 1220, 893.0, 1220.0, 1220.0, 1220.0, 0.027044081853421074, 0.027123312561976018, 0.017342721761471197], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 320.61538461538464, 158, 893, 271.0, 686.5999999999998, 893.0, 893.0, 0.06432395523052717, 0.15100087146589344, 0.04157959996684842], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/758bdb49-b821-40fb-9ab1-a2eaa158ead9", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/932ea6b9-a3bb-4dba-8cce-8bfdb05701e6", 3, 0, 0.0, 549.3333333333334, 243, 899, 506.0, 899.0, 899.0, 899.0, 0.030505475732894055, 0.025431159945293512, 0.019562430727148857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 152.34782608695653, 140, 162, 152.0, 161.0, 161.8, 162.0, 0.11903344839900012, 0.08846138108558504, 0.059749211403404355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b20a635d-2f83-4ad0-8c86-401108dd047f", 2, 0, 0.0, 316.5, 256, 377, 316.5, 377.0, 377.0, 377.0, 0.014994414580568738, 0.029469003265033773, 0.009320258672394532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 165.82608695652175, 143, 477, 152.0, 160.6, 413.7999999999991, 477.0, 0.11903344839900012, 0.039623906056732376, 0.06745161355014671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 971.1666666666667, 740, 1145, 1024.0, 1145.0, 1145.0, 1145.0, 0.05976095617529881, 17.571705366035857, 0.0340824203187251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1199.0, 1055, 1373, 1168.5, 1373.0, 1373.0, 1373.0, 0.05976750440785345, 53.77890552625288, 0.034027788154080627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 300.1666666666667, 145, 453, 302.0, 453.0, 453.0, 453.0, 0.06033364505716613, 0.1067622703550635, 0.0334073991673957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 179.14285714285717, 147, 449, 158.5, 312.0, 449.0, 449.0, 0.07430721788468582, 0.05522245391625576, 0.03729874022727393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 245.1428571428571, 149, 518, 158.5, 491.5, 518.0, 518.0, 0.07418947993174567, 0.027810704879548082, 0.04186613369474209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 353.0714285714286, 145, 1731, 165.0, 1100.0, 1731.0, 1731.0, 0.07430130239568629, 4.794056235803144, 0.043224948519811915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 321.7142857142858, 145, 1225, 158.0, 871.5, 1225.0, 1225.0, 0.07416314833159403, 1.5761634840522745, 0.04321700203418921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 208.16666666666666, 150, 469, 157.0, 469.0, 469.0, 469.0, 0.060326972189265825, 0.04483283773049931, 0.033875008797683445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 805.0588235294117, 145, 1424, 1003.0, 1417.6, 1424.0, 1424.0, 0.0749350929856345, 39.67109796165527, 0.040265559500667805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 243.26086956521743, 138, 1370, 151.0, 466.8, 1190.3999999999974, 1370.0, 0.11903344839900012, 4.687492924302489, 0.0695338902459852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 632.6470588235294, 152, 1092, 744.0, 1074.4, 1092.0, 1092.0, 0.07493707489740233, 12.969486284311262, 0.04033980519666574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 241.39130434782604, 139, 758, 150.0, 471.0, 700.9999999999992, 758.0, 0.11904207360940743, 1.5525306306900817, 0.06965518072398284], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 444.8333333333333, 160, 795, 457.5, 707.7000000000003, 795.0, 795.0, 0.06366216610520173, 0.01210762387596488, 0.04351387802063715], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc666b33-316c-4897-8db1-cec3952caf10", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 589.4285714285714, 305, 1891, 473.0, 1396.0, 1891.0, 1891.0, 0.07410387245664923, 6.439071357728504, 0.16530704807224067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e9c66a2-31b5-4091-8f43-086fcaf33396", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 561.95, 162, 1277, 525.5, 991.3000000000002, 1263.1999999999998, 1277.0, 0.08996972518747443, 0.05526460658488419, 0.040679670665820955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 170.88235294117646, 144, 435, 155.0, 226.19999999999982, 435.0, 435.0, 0.07493641424849797, 0.05569005004209663, 0.03761456730832808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 355.11764705882354, 144, 634, 433.0, 510.7999999999999, 634.0, 634.0, 0.07493311117869783, 0.08625400286068172, 0.039033401434307904], "isController": false}, {"data": ["login", 20, 0, 0.0, 2595.0, 1711, 4106, 2499.5, 3341.5000000000005, 4069.0499999999993, 4106.0, 0.08973076284608034, 32.32637482951155, 0.18002234295994868], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b6881ea3-2c51-4bc9-aae3-58ac97635565", 3, 0, 0.0, 353.3333333333333, 291, 434, 335.0, 434.0, 434.0, 434.0, 0.023023261168200273, 0.023090712128653983, 0.014764265788201347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 185.4782608695652, 149, 464, 161.0, 338.4000000000004, 460.79999999999995, 464.0, 0.11642445318471498, 0.09425378094739133, 0.041385254843004156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adbca780-4f38-4f82-bf7a-ae33364b8d5f", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1018.0, 304, 1577, 1186.0, 1572.2, 1577.0, 1577.0, 0.07488228064997819, 52.7449870511468, 0.1571418080436784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6455a4c7-4bc3-4edb-a4ba-43f55d5d8b06", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 614.0, 301, 1759, 598.0, 1261.0, 1759.0, 1759.0, 0.12692311179206367, 11.028667553806335, 0.28313344831962867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1096.375, 158, 1814, 1252.0, 1814.0, 1814.0, 1814.0, 0.07955133049600255, 71.3836073918102, 0.14771182716976256], "isController": false}, {"data": ["register", 20, 6, 30.0, 983.25, 191, 1846, 1112.5, 1502.1000000000004, 1829.6499999999996, 1846.0, 0.09093513142399869, 0.02852379317713709, 0.041027373747936906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 159.875, 153, 170, 159.0, 169.3, 170.0, 170.0, 0.07781911918484473, 0.0604162106952652, 0.027662265022737775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 439.43478260869557, 288, 1524, 320.0, 627.2, 1345.1999999999975, 1524.0, 0.11893496325943852, 6.362727640873293, 0.2661644492406261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 431.57894736842104, 291, 780, 319.0, 631.0, 780.0, 780.0, 0.11404356464169312, 0.17674525106090525, 0.2564866497752141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 156.54545454545456, 150, 174, 153.0, 173.2, 174.0, 174.0, 0.07311885136931667, 0.05433930262895507, 0.03670223594123903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 184.0, 144, 486, 151.0, 423.4000000000002, 486.0, 486.0, 0.07311593528575037, 0.019564224871382423, 0.04169893184265451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 180.54545454545453, 140, 471, 150.0, 411.4000000000002, 471.0, 471.0, 0.07310913199521468, 0.019705195733085205, 0.04298017330187425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdcc08dd-74fb-462f-b604-f1be98b014b8", 3, 0, 0.0, 648.3333333333334, 236, 921, 788.0, 921.0, 921.0, 921.0, 0.04326507066628209, 0.027815271668589558, 0.02774485325930199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 212.27272727272728, 153, 454, 164.0, 450.40000000000003, 454.0, 454.0, 0.07311836533923598, 0.019707684407840948, 0.04305700615191337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.84326171875, 3.863525390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=967205a5-fe80-4336-bbdf-6b0c03513a77", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1452.4285714285718, 1112, 2686, 1260.0, 1987.2000000000007, 2159.0, 2686.0, 0.25128446747885397, 300.6235837203563, 0.49618866527562766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 983.25, 191, 1846, 1112.5, 1502.1000000000004, 1829.6499999999996, 1846.0, 0.0901327204308344, 0.028272099416390632, 0.040665348475630365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=932ea6b9-a3bb-4dba-8cce-8bfdb05701e6", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 156.5, 153, 161, 156.0, 161.0, 161.0, 161.0, 0.021586732794024795, 0.005818299073389495, 0.012711718627731395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 149.0, 147, 154, 147.5, 154.0, 154.0, 154.0, 0.02158836387187306, 0.0058187386998407855, 0.012691596729362873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 242.875, 140, 1338, 150.0, 719.9000000000005, 1338.0, 1338.0, 0.07558828948425166, 4.270004802513783, 0.04403165495835558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 228.50000000000003, 140, 782, 152.0, 562.9000000000002, 782.0, 782.0, 0.07559578931453519, 1.4083314680466048, 0.04410984776897927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3477d235-06a5-4b53-a4f0-8b306d1c582e", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 156.8125, 142, 175, 156.5, 168.70000000000002, 175.0, 175.0, 0.07559221778117943, 0.05617741965964604, 0.03794374994094358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 153.25, 143, 163, 153.5, 163.0, 163.0, 163.0, 0.021586732794024795, 0.0057761374859011646, 0.012311183546592264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 191.3125, 139, 448, 156.5, 436.1, 448.0, 448.0, 0.07559400350567191, 0.02732346733157892, 0.04271541042819278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 157.0, 148, 166, 157.0, 166.0, 166.0, 166.0, 0.02158801433444152, 0.01604343643409179, 0.010836171257717714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 157.75, 156, 159, 158.0, 159.0, 159.0, 159.0, 0.021744566576426715, 0.017115352207617122, 0.007729513900214184], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 598.75, 158, 1220, 517.5, 1164.8000000000002, 1220.0, 1220.0, 0.06408818534303201, 0.01204261230119311, 0.04361730908396621], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1264.1, 774, 2046, 1179.0, 1846.8, 2036.1499999999999, 2046.0, 0.09090206665848549, 0.047048921219723934, 0.04181139980092447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 316.75, 304, 325, 319.0, 325.0, 325.0, 325.0, 0.021569272414518278, 0.033428159493984866, 0.04850979919007382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c0ce9cf-e947-430a-a810-74dc4209cf83", 3, 0, 0.0, 384.3333333333333, 255, 544, 354.0, 544.0, 544.0, 544.0, 0.12116316639741517, 0.05482317750403877, 0.07769903574313408], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1365.6612903225805, 787, 3429, 1208.5, 2237.1000000000004, 2401.249999999999, 3429.0, 0.27613605490653687, 75.65203217486093, 1.0063299388826288], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 257.73214285714295, 140, 691, 159.5, 594.1000000000001, 633.2, 691.0, 0.25290273631728455, 0.18794822493891947, 0.12225278757524985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc666b33-316c-4897-8db1-cec3952caf10", 3, 0, 0.0, 373.6666666666667, 278, 529, 314.0, 529.0, 529.0, 529.0, 0.024401948902319, 0.02447343898699376, 0.01564838520103139], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 886.9285714285717, 689, 1381, 785.5, 1114.1000000000001, 1178.1999999999998, 1381.0, 0.2527110024052672, 74.3054255021503, 0.1270958654674928], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 240.17857142857144, 138, 630, 155.0, 470.90000000000003, 592.8, 630.0, 0.2534372426028005, 0.4484651206994868, 0.12325365900019009], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1182.3571428571427, 959, 2512, 1064.5, 1490.5, 1563.45, 2512.0, 0.2519809754363545, 226.7329246329402, 0.1264826380608264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 205.47368421052633, 149, 460, 161.0, 435.0, 460.0, 460.0, 0.11343419025898817, 0.08474331596496675, 0.0403223098186247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, 5.555555555555555, 225.21111111111114, 141, 1869, 164.0, 361.70000000000005, 449.84999999999997, 1438.8899999999987, 0.7446540047906074, 1.5477951842087843, 0.35980702213897725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 161.36363636363635, 147, 177, 161.0, 175.0, 177.0, 177.0, 0.07317819555874878, 0.0566702237090701, 0.02601256170252398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca1a45a6-b95a-47c5-84a1-492502adae78", 3, 0, 0.0, 448.3333333333333, 243, 585, 517.0, 585.0, 585.0, 585.0, 0.023414999648775005, 0.02767573688955145, 0.015015478290392827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 159.0, 148, 178, 159.0, 175.5, 178.0, 178.0, 0.13044977217879072, 0.10586304753962412, 0.046370817454179515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adbca780-4f38-4f82-bf7a-ae33364b8d5f", 3, 0, 0.0, 334.0, 264, 469, 269.0, 469.0, 469.0, 469.0, 0.01640464798359535, 0.02261513157894737, 0.010519907723855092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6881ea3-2c51-4bc9-aae3-58ac97635565", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 429.1818181818182, 306, 657, 327.0, 650.6, 657.0, 657.0, 0.07303437927417106, 0.11318902334776315, 0.16425603073087494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 445.56250000000006, 297, 1498, 319.0, 889.0000000000007, 1498.0, 1498.0, 0.07553297958721227, 5.757476474132315, 0.16866757758653247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c0ce9cf-e947-430a-a810-74dc4209cf83", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 189.85714285714286, 152, 473, 170.0, 331.5, 473.0, 473.0, 0.07653953813855843, 0.06345905066370713, 0.027207413947690693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e9c66a2-31b5-4091-8f43-086fcaf33396", 3, 0, 0.0, 778.6666666666666, 271, 1625, 440.0, 1625.0, 1625.0, 1625.0, 0.023514288849524227, 0.02358317836763807, 0.015079150076029535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 190.35294117647058, 147, 455, 158.0, 439.0, 455.0, 455.0, 0.07462621048103177, 0.05793734114494166, 0.026527285756929263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02c13cb9-eeb0-4987-ad0f-76a1a6f6d871", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 152.63157894736844, 140, 160, 155.0, 160.0, 160.0, 160.0, 0.11415250775035447, 0.08483404140431618, 0.057299207991877155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 227.63157894736844, 138, 469, 151.0, 457.0, 469.0, 469.0, 0.1141456498492076, 0.030542878963557497, 0.0650986909296262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 195.89473684210526, 140, 472, 151.0, 429.0, 472.0, 472.0, 0.1141408498086639, 0.03076452592499144, 0.06710233553204654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 226.1052631578947, 145, 630, 157.0, 478.0, 630.0, 630.0, 0.11414016412154125, 0.030764341110884167, 0.06721339742704041], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.45385779122541603], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07564296520423601], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07564296520423601], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9077155824508321], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
