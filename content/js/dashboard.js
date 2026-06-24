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

    var data = {"OkPercent": 97.50550256786501, "KoPercent": 2.494497432134996};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7993046776232617, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3103448275862069, 500, 1500, "see books"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cfae497-c998-47dd-8996-7ccf5354eb09"], "isController": false}, {"data": [0.46551724137931033, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a40e9d6-cf7b-404d-b3a1-85429fc0e18b"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dcd2ae9c-0868-42a8-ae95-8ea47d672a9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a40e9d6-cf7b-404d-b3a1-85429fc0e18b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fda6df6-93e5-4876-a97d-6ecf127c8692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fca98e8-c70b-41aa-becb-2399276c4884"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3203125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b5f2f24-85de-4d98-980a-f68075797b2e"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.646551724137931, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9193548387096774, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fca98e8-c70b-41aa-becb-2399276c4884"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63efa342-7c9c-4c4b-aa1a-bd79dec23df3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31a733bf-f445-4286-bdeb-7292786ca31c"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcd2ae9c-0868-42a8-ae95-8ea47d672a9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/065403bd-21b5-425d-b87e-ee14cba7b758"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78a822cc-2991-48aa-a664-a241fd1a3c25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7c98264-f706-4de2-a96c-4a4543664313"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7c98264-f706-4de2-a96c-4a4543664313"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22c026bf-a6f2-4321-bc7e-f7843569c1b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a964f087-578a-4002-b36c-cec3da78fbe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cfae497-c998-47dd-8996-7ccf5354eb09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78a822cc-2991-48aa-a664-a241fd1a3c25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31a733bf-f445-4286-bdeb-7292786ca31c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ef56843-4e2a-4939-b9ef-2f45be0cd3ef"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a964f087-578a-4002-b36c-cec3da78fbe8"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63efa342-7c9c-4c4b-aa1a-bd79dec23df3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ef56843-4e2a-4939-b9ef-2f45be0cd3ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 34, 2.494497432134996, 307.8187820983129, 85, 2563, 95.0, 896.6000000000008, 1105.3999999999999, 1522.5199999999993, 5.319979391422461, 722.5651970695227, 3.899518608706343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1506.9827586206895, 1052, 2923, 1457.0, 1776.0000000000002, 1956.7999999999993, 2923.0, 0.2561305736000035, 308.2106926510398, 1.2593920293711112], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 271.9, 175, 872, 179.0, 503.10000000000036, 854.3999999999997, 872.0, 0.09862662425721824, 6.044795943055453, 0.22055186219394926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 113.77777777777777, 88, 269, 92.0, 262.7, 269.0, 269.0, 0.11593082793932953, 0.0900048908318037, 0.04120978649405855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 305.0, 176, 1019, 179.0, 608.0, 1019.0, 1019.0, 0.09103409945714928, 5.8656822556572905, 0.2035119323544772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 88.9, 87, 91, 89.0, 90.9, 91.0, 91.0, 0.04797911948719917, 0.03565635735327985, 0.02408326896134802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 105.3, 86, 259, 88.5, 242.10000000000005, 259.0, 259.0, 0.047940706933664444, 0.012827884472484431, 0.027341184423105503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 139.6, 85, 260, 89.5, 260.0, 260.0, 260.0, 0.047980500724505555, 0.012932244335901889, 0.028207286558742526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 122.69999999999999, 86, 261, 88.5, 260.9, 261.0, 261.0, 0.047980500724505555, 0.012932244335901889, 0.0282541425164813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 91.0, 89, 95, 89.0, 95.0, 95.0, 95.0, 0.2421893921046258, 0.07142694962460644, 0.1497127785178009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cfae497-c998-47dd-8996-7ccf5354eb09", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1052.155172413793, 684, 2563, 950.5, 1405.1000000000001, 1585.9999999999993, 2563.0, 0.25011211922585985, 299.22104763557803, 0.4938737354245007], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 463.71428571428567, 90, 1070, 463.0, 906.0, 1070.0, 1070.0, 0.06918431690370531, 0.014193015904980281, 0.04631430589598632], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 463.71428571428567, 90, 1070, 463.0, 906.0, 1070.0, 1070.0, 0.07031253923690806, 0.014424468324201075, 0.04706957582705124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a40e9d6-cf7b-404d-b3a1-85429fc0e18b", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 889.9565217391304, 199, 1651, 956.0, 1593.8000000000002, 1644.6, 1651.0, 0.0911309750221884, 0.028292700805122355, 0.04111573287133891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 144.33333333333334, 86, 260, 88.0, 260.0, 260.0, 260.0, 0.04393287057376329, 0.011841281521834637, 0.025870625933573498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 125.55555555555554, 85, 262, 87.5, 262.0, 262.0, 262.0, 0.11270639358324933, 0.030157765470517888, 0.06427786509044689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 125.44444444444444, 86, 263, 88.0, 263.0, 263.0, 263.0, 0.04393265611957493, 0.011841223719729179, 0.02582759666404698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 99.11111111111111, 87, 263, 89.0, 117.20000000000023, 263.0, 263.0, 0.11270498218635143, 0.08375829242559905, 0.05657261801150843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 145.66666666666666, 86, 265, 89.0, 261.4, 265.0, 265.0, 0.11258514251402624, 0.030345214193233636, 0.0662976962265213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 107.94444444444444, 86, 266, 87.5, 260.6, 266.0, 266.0, 0.11269933695223426, 0.03037599316290689, 0.0662548836379346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 122.50000000000001, 85, 351, 88.0, 286.2000000000001, 351.0, 351.0, 0.11133240143989906, 0.030007561325597794, 0.06545127506525315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 136.22222222222223, 86, 272, 88.0, 264.8, 272.0, 272.0, 0.11133309004991433, 0.030007746927515976, 0.0655604036133773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 87.55555555555556, 86, 89, 88.0, 89.0, 89.0, 89.0, 0.043932441667480226, 0.011755360368056232, 0.025055220638484817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 88.44444444444443, 86, 95, 88.0, 92.30000000000001, 95.0, 95.0, 0.11133102424542306, 0.0827372162605146, 0.05588295552944087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 127.33333333333333, 86, 265, 90.0, 265.0, 265.0, 265.0, 0.04393179832375783, 0.032648533715214555, 0.022051703455480003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 97.50000000000001, 86, 266, 88.0, 107.60000000000025, 266.0, 266.0, 0.11133171283840201, 0.02978993097433804, 0.06349386747815115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 110.88888888888889, 88, 262, 91.0, 262.0, 262.0, 262.0, 0.04371648402891117, 0.03440965442119375, 0.015539843932152016], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 426.30769230769226, 87, 1271, 436.0, 967.7999999999997, 1271.0, 1271.0, 0.06985303995056555, 0.014020982778538998, 0.04753071182934365], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1338.5263157894738, 899, 2186, 1347.0, 1702.0, 2186.0, 2186.0, 0.09791341362233251, 0.05067784103499631, 0.04503634552355333], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 200.53333333333333, 86, 476, 191.0, 390.80000000000007, 476.0, 476.0, 0.07344912179333375, 0.146539605296661, 0.04746936406526199], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 273.5555555555555, 173, 524, 179.0, 524.0, 524.0, 524.0, 0.043913149548670406, 0.0680568050134179, 0.0987617025494023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcd2ae9c-0868-42a8-ae95-8ea47d672a9c", 3, 0, 0.0, 436.6666666666667, 185, 711, 414.0, 711.0, 711.0, 711.0, 0.07830444769262894, 0.050342214906556694, 0.05021476626122364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a40e9d6-cf7b-404d-b3a1-85429fc0e18b", 3, 0, 0.0, 258.6666666666667, 192, 374, 210.0, 374.0, 374.0, 374.0, 0.03902895948794005, 0.03253683764603336, 0.02502833665079489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fda6df6-93e5-4876-a97d-6ecf127c8692", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 96.85000000000001, 86, 257, 88.0, 93.60000000000001, 248.84999999999988, 257.0, 0.09866944256698422, 0.07332758378269041, 0.04952743503850575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fca98e8-c70b-41aa-becb-2399276c4884", 3, 0, 0.0, 291.6666666666667, 175, 454, 246.0, 454.0, 454.0, 454.0, 0.0231728229132873, 0.027389492186896545, 0.014860176152075515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 122.19999999999996, 85, 263, 88.0, 262.0, 262.95, 263.0, 0.09867187654174807, 0.033812462381347066, 0.0558594597961439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 584.0, 502, 687, 533.0, 687.0, 687.0, 687.0, 0.06592392379194409, 19.383822475113718, 0.03759723778759312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 937.4, 600, 1106, 943.0, 1106.0, 1106.0, 1106.0, 0.06554626255210928, 58.97864226242758, 0.03731784283972628], "isController": false}, {"data": ["addBook", 64, 13, 20.3125, 904.9374999999998, 441, 2203, 759.5, 1563.0, 1753.0, 2203.0, 0.30651487794481774, 81.37780589077295, 1.1172948101403741], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 156.8, 86, 262, 89.0, 262.0, 262.0, 262.0, 0.06613581651279067, 0.11702939406364911, 0.0366201249636253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 102.66666666666667, 87, 263, 88.0, 211.40000000000018, 263.0, 263.0, 0.075122073369225, 0.0558280252284963, 0.03770775948416176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 101.66666666666667, 86, 260, 87.0, 209.00000000000017, 260.0, 260.0, 0.07520540476175555, 0.038949153312484726, 0.04183790258393237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 265.41666666666663, 85, 1108, 88.0, 1084.3000000000002, 1108.0, 1108.0, 0.07489608168665976, 11.248760021251762, 0.042957973936163574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b5f2f24-85de-4d98-980a-f68075797b2e", 2, 0, 0.0, 205.5, 198, 213, 205.5, 213.0, 213.0, 213.0, 0.0468263445014165, 0.04133888225515675, 0.029106414331202736], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 154.25862068965517, 86, 594, 89.0, 352.0, 356.4999999999999, 594.0, 0.25122907326792715, 0.18670441870790289, 0.121443741472289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 229.66666666666669, 85, 686, 89.5, 680.9, 686.0, 686.0, 0.07505676167601749, 3.6950551276277688, 0.04312343240825875], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 603.9310344827587, 425, 2303, 520.0, 742.6, 894.7499999999994, 2303.0, 0.25115727208560135, 73.8485771994665, 0.12631444836336395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 88.0, 86, 90, 88.0, 90.0, 90.0, 90.0, 0.06628662335940606, 0.04926183630518361, 0.03722149260904149], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 129.41379310344834, 85, 357, 89.0, 262.1, 267.0, 357.0, 0.25182245648464535, 0.4456077062013451, 0.12246834309507167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 661.0625000000001, 86, 1212, 890.0, 1206.4, 1212.0, 1212.0, 0.0778626697162879, 43.79597433269259, 0.04159265657696238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 130.70000000000002, 86, 778, 88.0, 238.50000000000034, 751.8499999999997, 778.0, 0.09867041614248008, 4.46445571702558, 0.05758343817065049], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 867.3275862068964, 592, 1219, 858.5, 1103.6, 1146.8999999999999, 1219.0, 0.25079454305666654, 225.66537069217134, 0.12588710462024086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 103.42105263157895, 89, 262, 91.0, 123.0, 262.0, 262.0, 0.09117082533589252, 0.06811101697456813, 0.03240837931861804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 493.93750000000006, 87, 783, 686.0, 782.3, 783.0, 783.0, 0.0778626697162879, 14.316751271351404, 0.04166869434035719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 152.29999999999998, 86, 693, 88.5, 260.0, 671.3499999999997, 693.0, 0.09867138973718875, 1.4758985109253895, 0.05768036513347772], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 469.0769230769231, 89, 1716, 422.0, 1268.7999999999997, 1716.0, 1716.0, 0.06903803464647217, 0.014293030610402439, 0.0464627217846863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 13, 6.989247311827957, 153.84408602150546, 87, 1251, 94.0, 274.0, 354.20000000000005, 880.3799999999981, 0.7644757176207543, 1.5799742811462203, 0.3690125380696577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 118.7, 89, 366, 91.0, 339.10000000000014, 366.0, 366.0, 0.04959653221046784, 0.03840825199502051, 0.01763001730918974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fca98e8-c70b-41aa-becb-2399276c4884", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 398.6666666666667, 174, 1196, 181.5, 1172.3000000000002, 1196.0, 1196.0, 0.07477287738494323, 15.005628898315118, 0.16497739678227386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 93.77777777777777, 87, 150, 91.0, 98.70000000000007, 150.0, 150.0, 0.11287460258733673, 0.0916003854981219, 0.040123393888467355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63efa342-7c9c-4c4b-aa1a-bd79dec23df3", 3, 0, 0.0, 363.3333333333333, 167, 513, 410.0, 513.0, 513.0, 513.0, 0.01550764268323572, 0.021378537357911225, 0.00994467971548645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31a733bf-f445-4286-bdeb-7292786ca31c", 3, 0, 0.0, 553.6666666666667, 189, 1271, 201.0, 1271.0, 1271.0, 1271.0, 0.019445038598401618, 0.022983377327733163, 0.012469637382438536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 471.6842105263158, 148, 1365, 450.0, 910.0, 1365.0, 1365.0, 0.10151687584486084, 0.06235753408829831, 0.04590069679313532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 90.12499999999999, 87, 104, 88.0, 101.2, 104.0, 104.0, 0.07786304863034031, 0.057865019538758763, 0.039083600582026284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 131.43749999999997, 86, 257, 90.0, 257.0, 257.0, 257.0, 0.0778626697162879, 0.09392564723344202, 0.04031902404009927], "isController": false}, {"data": ["login", 19, 0, 0.0, 2383.473684210526, 1389, 3425, 2270.0, 3365.0, 3425.0, 3425.0, 0.09507510933637574, 30.062318567605907, 0.18493613861200348], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 263.8, 177, 349, 265.5, 349.0, 349.0, 349.0, 0.04791957179070648, 0.07426597698422967, 0.10777224007226271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcd2ae9c-0868-42a8-ae95-8ea47d672a9c", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/065403bd-21b5-425d-b87e-ee14cba7b758", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 119.3, 89, 287, 91.5, 263.6, 285.84999999999997, 287.0, 0.10224635236137951, 0.08277561143318712, 0.03634538306595912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78a822cc-2991-48aa-a664-a241fd1a3c25", 3, 0, 0.0, 624.6666666666666, 191, 1265, 418.0, 1265.0, 1265.0, 1265.0, 0.020480332054450375, 0.024207059143785584, 0.013133546271896888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7c98264-f706-4de2-a96c-4a4543664313", 3, 0, 0.0, 324.0, 198, 453, 321.0, 453.0, 453.0, 453.0, 0.02592240559923961, 0.02599835014689363, 0.016623417653158213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 240.77777777777777, 175, 440, 179.0, 375.2000000000001, 440.0, 440.0, 0.11127046140151328, 0.1724474826603531, 0.2502498755934425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7c98264-f706-4de2-a96c-4a4543664313", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22c026bf-a6f2-4321-bc7e-f7843569c1b8", 2, 0, 0.0, 266.0, 198, 334, 266.0, 334.0, 334.0, 334.0, 0.012715043167571554, 0.02513207751090315, 0.00790344235953056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a964f087-578a-4002-b36c-cec3da78fbe8", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cfae497-c998-47dd-8996-7ccf5354eb09", 3, 0, 0.0, 371.6666666666667, 195, 476, 444.0, 476.0, 476.0, 476.0, 0.058512609467340215, 0.03761796995377504, 0.037522734586803455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78a822cc-2991-48aa-a664-a241fd1a3c25", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 105.41666666666667, 88, 260, 90.0, 212.30000000000018, 260.0, 260.0, 0.07748984560148264, 0.064246952066073, 0.02754521855365203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 776.6875, 176, 1304, 977.5, 1297.7, 1304.0, 1304.0, 0.07782896112929823, 58.239291905423215, 0.16259336435141722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 93.625, 88, 108, 91.0, 103.80000000000001, 108.0, 108.0, 0.07637012782450145, 0.05929126134812368, 0.027147193875115747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31a733bf-f445-4286-bdeb-7292786ca31c", 1, 0, 0.0, 1716.0, 1716, 1716, 1716.0, 1716.0, 1716.0, 1716.0, 0.5827505827505828, 0.1052820877039627, 0.4017792103729604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ef56843-4e2a-4939-b9ef-2f45be0cd3ef", 3, 0, 0.0, 279.3333333333333, 196, 436, 206.0, 436.0, 436.0, 436.0, 0.020607226267344413, 0.024357043807528504, 0.013214920490451984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a964f087-578a-4002-b36c-cec3da78fbe8", 3, 0, 0.0, 541.3333333333334, 203, 918, 503.0, 918.0, 918.0, 918.0, 0.10334137099552188, 0.046759279193937305, 0.06627034533241474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 264.8888888888889, 175, 523, 182.5, 379.9000000000002, 523.0, 523.0, 0.11252320791163178, 0.174388995073984, 0.25306733185594527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 521.818181818182, 86, 1196, 88.0, 1194.6, 1196.0, 1196.0, 0.09945300845350571, 54.0965033226346, 0.13787803444690566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63efa342-7c9c-4c4b-aa1a-bd79dec23df3", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 97.36842105263158, 86, 257, 89.0, 94.0, 257.0, 257.0, 0.09107293504103076, 0.06768213238889102, 0.04571434434676739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ef56843-4e2a-4939-b9ef-2f45be0cd3ef", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 132.8421052631579, 85, 262, 88.0, 261.0, 262.0, 262.0, 0.09107380813145306, 0.03156875832846008, 0.051537963997085635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 163.94736842105266, 86, 929, 88.0, 351.0, 929.0, 929.0, 0.09107380813145306, 4.336327522085398, 0.05312950875267229], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 889.9565217391304, 199, 1651, 956.0, 1593.8000000000002, 1644.6, 1651.0, 0.09008585573729398, 0.027968231027135425, 0.04064420444397443], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 170.31578947368422, 86, 516, 88.0, 359.0, 516.0, 516.0, 0.09107468123861566, 1.432675513493433, 0.05321895821349822], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6603081438004402], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.823529411764707, 0.22010271460014674], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.22010271460014674], "isController": false}, {"data": ["401/Unauthorized", 19, 55.88235294117647, 1.3939838591342626], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 34, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
