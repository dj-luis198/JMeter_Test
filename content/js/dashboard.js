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

    var data = {"OkPercent": 98.27315541601256, "KoPercent": 1.7268445839874411};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7847035040431267, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52e5c324-a7ce-4c37-8b52-5b5a0ff1ef2f"], "isController": false}, {"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82b2f370-0728-47c9-a610-38225e3a0396"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0c75b45-40ef-4f46-b91d-5dff03551e41"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b112236b-2fe4-4e2b-8c04-42ca190a6f12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bf5fe86-8645-490a-9779-956dbacf613b"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/706b1279-deec-4139-81ee-bc278e18b29d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/212d0ebe-f50e-4333-813a-89007a690979"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7428bec6-e8d5-4487-8eb7-5592f71cfd91"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0d6f8ac-37ed-4068-87ca-e1550b791edc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0b5016b-6312-4355-beb4-eae449684b84"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f97482e-3873-41a7-9a12-136a70ba1e71"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2de25d7d-b229-408f-b92e-beee75906bee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12361615-7f45-4e49-9787-83e821794205"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbdfde40-8849-4f50-ae66-51e07a14ef94"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82b2f370-0728-47c9-a610-38225e3a0396"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0c75b45-40ef-4f46-b91d-5dff03551e41"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=706b1279-deec-4139-81ee-bc278e18b29d"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fac82cf-c70b-43b9-8bcf-8888c7bfa70b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bf5fe86-8645-490a-9779-956dbacf613b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b112236b-2fe4-4e2b-8c04-42ca190a6f12"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9260355029585798, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0e6f428-3289-4c67-89e7-0d81e43424e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7428bec6-e8d5-4487-8eb7-5592f71cfd91"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0b5016b-6312-4355-beb4-eae449684b84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/12361615-7f45-4e49-9787-83e821794205"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2de25d7d-b229-408f-b92e-beee75906bee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db43b753-f044-420a-82e0-96bf7fa4bc4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8e1ffc8-ebc8-4e00-9e67-e576ea5b0678"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f97482e-3873-41a7-9a12-136a70ba1e71"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1fac82cf-c70b-43b9-8bcf-8888c7bfa70b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 22, 1.7268445839874411, 341.69230769230745, 98, 1722, 119.0, 887.0, 1055.5, 1476.75, 4.949841092228672, 700.4224417645756, 3.606962365278069], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/52e5c324-a7ce-4c37-8b52-5b5a0ff1ef2f", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1638.1636363636367, 1242, 2177, 1596.0, 1946.8, 2067.9999999999995, 2177.0, 0.24855611493234753, 299.0970837235853, 1.222148475277705], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 523.7692307692307, 114, 1377, 469.0, 1157.7999999999997, 1377.0, 1377.0, 0.09023266144705425, 0.01788792018921095, 0.0606657391790216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 523.7692307692307, 114, 1377, 469.0, 1157.7999999999997, 1377.0, 1377.0, 0.09164222873900293, 0.01816735589259531, 0.061613427525095875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82b2f370-0728-47c9-a610-38225e3a0396", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.23554636571056062, 0.8988958604954368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 138.23076923076923, 98, 321, 111.0, 300.59999999999997, 321.0, 321.0, 0.10636034886194426, 0.05303635785348453, 0.05928438916433492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 162.0769230769231, 101, 344, 113.0, 342.0, 344.0, 344.0, 0.10634729755155799, 0.07903348968431213, 0.05338135834130938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0c75b45-40ef-4f46-b91d-5dff03551e41", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 297.6923076923076, 107, 748, 329.0, 673.9999999999999, 748.0, 748.0, 0.10634729755155799, 4.83496740046302, 0.06121840002535974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 308.46153846153845, 103, 1012, 113.0, 999.2, 1012.0, 1012.0, 0.10635599806922957, 14.74722745764168, 0.061119545164483646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b112236b-2fe4-4e2b-8c04-42ca190a6f12", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bf5fe86-8645-490a-9779-956dbacf613b", 3, 0, 0.0, 299.6666666666667, 207, 448, 244.0, 448.0, 448.0, 448.0, 0.04832162876103344, 0.031066151303073254, 0.030987502818761677], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 243.21428571428572, 113, 418, 214.5, 395.0, 418.0, 418.0, 0.07946057620269258, 0.14350127775444413, 0.05135893548368788], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 123.71428571428572, 106, 331, 112.0, 151.40000000000003, 313.89999999999975, 331.0, 0.10845874952226504, 0.0806026449086364, 0.054441208256293186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 120.42857142857142, 103, 316, 111.0, 125.4, 297.1999999999997, 316.0, 0.10846211056937444, 0.02902208817969589, 0.061857297434096355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 683.75, 526, 791, 709.0, 791.0, 791.0, 791.0, 0.03092050338579512, 9.091654652762747, 0.01763434958721128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/706b1279-deec-4139-81ee-bc278e18b29d", 3, 0, 0.0, 333.6666666666667, 230, 435, 336.0, 435.0, 435.0, 435.0, 0.04129842240026431, 0.02655090632829493, 0.0264836888439195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 903.5, 766, 980, 934.0, 980.0, 980.0, 980.0, 0.03081213073587071, 27.72480939808503, 0.017542453338879518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/212d0ebe-f50e-4333-813a-89007a690979", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 275.0, 114, 332, 327.0, 332.0, 332.0, 332.0, 0.030966703052542753, 0.0547965487609448, 0.01714660217850756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 110.90909090909092, 103, 115, 111.0, 114.8, 115.0, 115.0, 0.05167011917008394, 0.03839937567229871, 0.02593597778654604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 131.27272727272725, 101, 343, 111.0, 297.00000000000017, 343.0, 343.0, 0.051670604593047016, 0.02793625550174506, 0.02867938742149591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 331.8181818181818, 108, 1013, 114.0, 1008.2, 1013.0, 1013.0, 0.05167206091666236, 8.46496069106684, 0.02957014423551186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 270.72727272727275, 107, 768, 115.0, 720.4000000000002, 768.0, 768.0, 0.05167206091666236, 2.773813480301201, 0.029620605232500787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 110.75, 106, 115, 111.0, 115.0, 115.0, 115.0, 0.031018812910029933, 0.023052067016145292, 0.017417790452409387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 662.9375000000001, 104, 1118, 852.0, 1106.1, 1118.0, 1118.0, 0.10745178101327028, 60.43917400220948, 0.05739855880298716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 132.5714285714286, 105, 339, 111.0, 289.20000000000016, 338.2, 339.0, 0.10846323096470296, 0.029234230220955094, 0.06376451664135858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 520.1250000000001, 102, 789, 741.5, 786.9, 789.0, 789.0, 0.1074532242683107, 19.757620574270327, 0.057504264549838154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 142.33333333333337, 103, 338, 112.0, 329.0, 337.3, 338.0, 0.10845818936799864, 0.029232871353093385, 0.06386746893447576], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 478.69230769230774, 116, 822, 461.0, 800.0, 822.0, 822.0, 0.09190006927851377, 0.018218470765174116, 0.06235287152370315], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 466.6363636363637, 218, 1122, 433.0, 1117.6, 1122.0, 1122.0, 0.05164295003309844, 11.298742985654997, 0.11374378083905709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 505.45454545454544, 148, 1494, 453.0, 983.0, 1419.149999999999, 1494.0, 0.09110824902369229, 0.05596395374599848, 0.041194452439423365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 124.25, 103, 311, 113.0, 173.80000000000013, 311.0, 311.0, 0.10745105940028878, 0.07985376582384741, 0.05393539505053557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 151.06250000000003, 103, 339, 111.0, 329.90000000000003, 339.0, 339.0, 0.10745394591036997, 0.12962156902908642, 0.05564204572165398], "isController": false}, {"data": ["login", 22, 0, 0.0, 2134.9999999999995, 1338, 2996, 2096.5, 2921.6, 2989.7, 2996.0, 0.09149891864914324, 20.030107563217435, 0.16563871184079187], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 125.71428571428572, 108, 342, 116.0, 121.2, 319.99999999999966, 342.0, 0.10474076660265842, 0.08479501515000373, 0.03723206937828873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7428bec6-e8d5-4487-8eb7-5592f71cfd91", 3, 0, 0.0, 547.3333333333334, 315, 901, 426.0, 901.0, 901.0, 901.0, 0.017952139595837496, 0.02121882124755402, 0.011512277019466104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 790.1875, 215, 1231, 966.0, 1219.8, 1231.0, 1231.0, 0.10736957951388423, 80.3444912065992, 0.22430700485847346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0d6f8ac-37ed-4068-87ca-e1550b791edc", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0b5016b-6312-4355-beb4-eae449684b84", 3, 0, 0.0, 358.6666666666667, 206, 447, 423.0, 447.0, 447.0, 447.0, 0.04924086992203529, 0.031208324784571195, 0.031576990151826016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 513.7692307692307, 216, 1352, 451.0, 1246.8, 1352.0, 1352.0, 0.10624734381640459, 19.694523881644546, 0.23477055426378765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 567.125, 111, 1087, 509.5, 1087.0, 1087.0, 1087.0, 0.061569246161542315, 36.83734896294301, 0.08981353657598029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f97482e-3873-41a7-9a12-136a70ba1e71", 3, 0, 0.0, 434.6666666666667, 300, 558, 446.0, 558.0, 558.0, 558.0, 0.03868422070637387, 0.024870226528349085, 0.02480726392954314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2de25d7d-b229-408f-b92e-beee75906bee", 3, 0, 0.0, 326.6666666666667, 205, 525, 250.0, 525.0, 525.0, 525.0, 0.0178899410824607, 0.021145304710421486, 0.01147239060301028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12361615-7f45-4e49-9787-83e821794205", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 785.7391304347825, 117, 1706, 803.0, 1336.6000000000001, 1634.599999999999, 1706.0, 0.0973396646436945, 0.030815410138560897, 0.043916919009166853], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cbdfde40-8849-4f50-ae66-51e07a14ef94", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82b2f370-0728-47c9-a610-38225e3a0396", 3, 0, 0.0, 336.3333333333333, 205, 540, 264.0, 540.0, 540.0, 540.0, 0.03222964697793343, 0.02686853056982016, 0.0206681004383232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0c75b45-40ef-4f46-b91d-5dff03551e41", 3, 0, 0.0, 298.0, 205, 480, 209.0, 480.0, 480.0, 480.0, 0.040584415584415584, 0.026091868743235932, 0.026025813379329004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=706b1279-deec-4139-81ee-bc278e18b29d", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 0.21978596411192217, 0.8387507603406327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 289.0952380952381, 213, 669, 230.0, 445.6, 646.6999999999997, 669.0, 0.10839436968674027, 0.16799010223911798, 0.2437814779185184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 146.2142857142857, 111, 335, 115.5, 332.0, 335.0, 335.0, 0.08191302007454085, 0.06359458101490231, 0.02911751885462194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 429.1428571428571, 219, 1027, 330.0, 1008.0, 1027.0, 1027.0, 0.10529165789236183, 18.13493102456304, 0.23295485526157456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fac82cf-c70b-43b9-8bcf-8888c7bfa70b", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 130.25, 107, 342, 111.5, 274.2000000000003, 342.0, 342.0, 0.05791729410401946, 0.0430420515753504, 0.029071766767056643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 147.41666666666666, 106, 338, 111.0, 336.2, 338.0, 338.0, 0.05791981002302312, 0.015498074166316735, 0.03303239165375538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 200.5, 103, 340, 112.0, 339.4, 340.0, 340.0, 0.05791841226325849, 0.01561082205533139, 0.0340496915844547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 127.33333333333334, 104, 328, 108.0, 263.80000000000024, 328.0, 328.0, 0.057918132719401126, 0.015610746709526085, 0.03410608791972547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 118.5, 116, 121, 118.5, 121.0, 121.0, 121.0, 0.024311380157051518, 0.007169957819755427, 0.015028421522864852], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1064.2727272727273, 803, 1722, 903.0, 1459.8, 1609.9999999999998, 1722.0, 0.24157878323355397, 289.01221112118907, 0.47702373017406846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 785.7391304347825, 117, 1706, 803.0, 1336.6000000000001, 1634.599999999999, 1706.0, 0.09250135735687426, 0.029283717750206117, 0.041734010838746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 108.72727272727272, 101, 114, 109.0, 113.8, 114.0, 114.0, 0.05117826319584991, 0.01379414125200642, 0.0301371999092749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 111.0909090909091, 107, 117, 111.0, 116.4, 117.0, 117.0, 0.05117802508653739, 0.01379407707410578, 0.030087081154390145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 140.07142857142858, 105, 323, 111.5, 319.0, 323.0, 323.0, 0.08115800884622296, 0.021874619571833537, 0.04771203254436155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 109.14285714285714, 104, 115, 109.0, 114.5, 115.0, 115.0, 0.08115942028985507, 0.021875, 0.047792119565217395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bf5fe86-8645-490a-9779-956dbacf613b", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 108.9090909090909, 105, 113, 109.0, 112.8, 113.0, 113.0, 0.05117731077189342, 0.013693928858885545, 0.029187060049595467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 126.78571428571429, 104, 323, 113.0, 219.5, 323.0, 323.0, 0.08115518610623214, 0.06031161779965104, 0.040736099275979806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 110.45454545454545, 103, 117, 110.0, 116.6, 117.0, 117.0, 0.05117802508653739, 0.038033669034038035, 0.025688969623515835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 126.35714285714285, 102, 337, 111.5, 225.5, 337.0, 337.0, 0.08116224332440548, 0.02171724088953819, 0.046287841895950005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 175.36363636363637, 113, 335, 116.0, 334.8, 335.0, 335.0, 0.05044645109216567, 0.039706874590122586, 0.017932136911668263], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 556.8461538461538, 111, 1578, 448.0, 1340.7999999999997, 1578.0, 1578.0, 0.0946714536437586, 0.018369618747132548, 0.06442523276433362], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b112236b-2fe4-4e2b-8c04-42ca190a6f12", 3, 0, 0.0, 531.6666666666666, 289, 985, 321.0, 985.0, 985.0, 985.0, 0.023903049232313737, 0.02825259497478228, 0.015328452795461607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1185.7272727272725, 787, 1716, 1049.5, 1655.2, 1707.6, 1716.0, 0.0910309670798921, 0.047115637258147276, 0.041870688959598806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 223.63636363636363, 217, 235, 223.0, 233.6, 235.0, 235.0, 0.05115208444744124, 0.07927574025204027, 0.11504223679927458], "isController": false}, {"data": ["addBook", 57, 9, 15.789473684210526, 1051.894736842105, 552, 2483, 906.0, 1689.8, 1759.1999999999996, 2483.0, 0.2649339059624073, 89.99102325782717, 0.9614475413436332], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 203.63636363636363, 108, 462, 115.0, 452.6, 457.59999999999997, 462.0, 0.24258034922749183, 0.18027699781457157, 0.11726296178477388], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 646.1454545454546, 503, 1046, 566.0, 824.6, 890.1999999999998, 1046.0, 0.24231636825038771, 71.24905792627855, 0.12186809536030241], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 161.76363636363635, 105, 342, 113.0, 328.0, 334.2, 342.0, 0.2429833048380185, 0.4299665511391499, 0.11816961504817695], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 855.3999999999999, 688, 1260, 784.0, 1019.4, 1143.3999999999996, 1260.0, 0.242100907658312, 217.84282227895088, 0.12152330716442614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 115.14285714285714, 106, 124, 115.5, 123.5, 124.0, 124.0, 0.1022069398512159, 0.07635577049431656, 0.0363313731502369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, 5.325443786982248, 176.4319526627219, 104, 1086, 116.0, 299.0, 411.0, 1049.6000000000006, 0.690943731014379, 1.501090587220403, 0.33146981030732686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 153.66666666666666, 110, 342, 117.0, 335.70000000000005, 342.0, 342.0, 0.057782592993860606, 0.044747652582159625, 0.020539906103286383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 115.92307692307692, 113, 125, 115.0, 122.6, 125.0, 125.0, 0.104010817124981, 0.08440721585044846, 0.03697259514989559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0e6f428-3289-4c67-89e7-0d81e43424e3", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7428bec6-e8d5-4487-8eb7-5592f71cfd91", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 335.50000000000006, 216, 681, 229.5, 612.6000000000003, 681.0, 681.0, 0.057885165479216814, 0.0897107007964034, 0.13018509384632454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 270.7857142857143, 215, 661, 227.5, 549.0, 661.0, 661.0, 0.08110300081103, 0.12569381082725062, 0.182402549675588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0b5016b-6312-4355-beb4-eae449684b84", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 116.63636363636364, 110, 126, 117.0, 125.8, 126.0, 126.0, 0.0506478318123636, 0.04199219649286786, 0.01800372146455112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12361615-7f45-4e49-9787-83e821794205", 3, 0, 0.0, 792.0, 380, 1578, 418.0, 1578.0, 1578.0, 1578.0, 0.022010432945216034, 0.026015586596380015, 0.01411476331447773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2de25d7d-b229-408f-b92e-beee75906bee", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 127.0, 108, 325, 114.5, 183.60000000000014, 325.0, 325.0, 0.10812710341005853, 0.0839463351669888, 0.03843580629029424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db43b753-f044-420a-82e0-96bf7fa4bc4b", 2, 0, 0.0, 218.0, 216, 220, 218.0, 220.0, 220.0, 220.0, 0.03180914512922465, 0.02808151093439364, 0.0197719930417495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8e1ffc8-ebc8-4e00-9e67-e576ea5b0678", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f97482e-3873-41a7-9a12-136a70ba1e71", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fac82cf-c70b-43b9-8bcf-8888c7bfa70b", 3, 0, 0.0, 443.66666666666663, 254, 705, 372.0, 705.0, 705.0, 705.0, 0.03902997502081599, 0.03253768425400708, 0.02502898788769775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 126.71428571428571, 103, 321, 111.5, 218.5, 321.0, 321.0, 0.1055615876462782, 0.07844957831915793, 0.05298696879901074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 192.5, 102, 460, 112.0, 392.0, 460.0, 460.0, 0.1055615876462782, 0.050895765472312705, 0.05893658953130655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 262.8571428571429, 106, 915, 113.0, 851.5, 915.0, 915.0, 0.10538042332821486, 13.570272864729171, 0.0606584300575076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 241.28571428571428, 107, 873, 112.5, 710.0, 873.0, 873.0, 0.10541454268912498, 4.4522643890850775, 0.060781013523179904], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.3924646781789639], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15698587127158556], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15698587127158556], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 1.0204081632653061], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 22, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
