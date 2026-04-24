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

    var data = {"OkPercent": 99.0625, "KoPercent": 0.9375};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7661290322580645, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64b40b64-6f27-49e6-b83b-4665f44f21e2"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24fd1ce1-139c-4091-8d45-ea80dbd52440"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f787db9d-bb50-4620-b8a1-75ede20b36f1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a34a052-d7e0-4254-8772-875afb11c3f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d18b882e-4e0c-4968-b624-71f0d41c8ba1"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd7ef1be-c435-4b47-ba9f-965f5bbb1fc8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2228413-4078-4d25-973d-79d9480a69b3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24fd1ce1-139c-4091-8d45-ea80dbd52440"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27534efe-68b9-4a95-927b-712228966e2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1873785a-3aac-435e-adc7-37a0148a51b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36984945-9b06-4a89-bb39-e97d7b2d5166"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9402d434-5a5c-4550-904a-c667935960c7"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6254e88-d5a8-446b-8338-46019b26e780"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2228413-4078-4d25-973d-79d9480a69b3"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3be53a7e-7d0e-4a1f-a388-e35065e5bbb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36984945-9b06-4a89-bb39-e97d7b2d5166"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64b40b64-6f27-49e6-b83b-4665f44f21e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9425287356321839, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd7ef1be-c435-4b47-ba9f-965f5bbb1fc8"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a34a052-d7e0-4254-8772-875afb11c3f1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aaf6bf5d-4b04-41c2-b813-bb08d405c095"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27534efe-68b9-4a95-927b-712228966e2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61bf0aba-a57e-43f0-beb9-8b5bac17f5ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3be53a7e-7d0e-4a1f-a388-e35065e5bbb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f8f83ed-f78d-4aeb-b8de-8edd865a5ad9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b1c1b17-2868-417e-9ca3-24012c77d2e9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d18b882e-4e0c-4968-b624-71f0d41c8ba1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1873785a-3aac-435e-adc7-37a0148a51b3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9402d434-5a5c-4550-904a-c667935960c7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f787db9d-bb50-4620-b8a1-75ede20b36f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 12, 0.9375, 426.3351562499999, 118, 2540, 149.0, 1140.9, 1495.7000000000003, 1953.38, 5.054573599330269, 702.4645180286374, 3.6887604966316005], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2091.759259259259, 1535, 3079, 2094.0, 2555.0, 2728.75, 3079.0, 0.24099289070972407, 289.9938981241604, 1.1849601608627545], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/64b40b64-6f27-49e6-b83b-4665f44f21e2", 3, 0, 0.0, 533.6666666666667, 214, 1122, 265.0, 1122.0, 1122.0, 1122.0, 0.020558646966914285, 0.024299624719031823, 0.013183767748965214], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 604.0, 426, 1159, 522.0, 1125.0, 1159.0, 1159.0, 0.07149889176717761, 0.012917280250906112, 0.04859690299800353], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 604.0, 426, 1159, 522.0, 1125.0, 1159.0, 1159.0, 0.0711159737417943, 0.012848100724835885, 0.048336638402625816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 197.9, 121, 374, 126.5, 370.0, 373.8, 374.0, 0.11663099702007802, 0.03996661802182166, 0.06602635641849534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 152.75, 122, 381, 128.0, 349.6000000000005, 380.6, 381.0, 0.11662895663735393, 0.08667444921975227, 0.05854226924960929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 197.3, 121, 1076, 127.0, 367.8, 1040.5999999999995, 1076.0, 0.11662691632601888, 1.7444721575104818, 0.06817663292261221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 242.84999999999997, 120, 1246, 127.0, 382.3, 1202.8499999999995, 1246.0, 0.11662759642186533, 5.27694885624774, 0.06806313634932298], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 238.2142857142857, 213, 307, 231.0, 293.5, 307.0, 307.0, 0.0755148494557537, 0.1609378624038534, 0.048819170253622014], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/24fd1ce1-139c-4091-8d45-ea80dbd52440", 3, 0, 0.0, 585.6666666666666, 214, 1013, 530.0, 1013.0, 1013.0, 1013.0, 0.024489596003297934, 0.024561342866588842, 0.015704591187010716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 144.5, 123, 381, 127.0, 256.0, 381.0, 381.0, 0.07994746309567997, 0.05941408146075436, 0.04012987893669874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 158.5, 121, 375, 124.5, 364.0, 375.0, 375.0, 0.07994746309567997, 0.03854609827827427, 0.044635846443765524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 809.0, 735, 1007, 747.0, 1007.0, 1007.0, 1007.0, 0.05722788142382969, 16.82689728310633, 0.03263777612452787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1349.75, 1080, 1587, 1366.0, 1587.0, 1587.0, 1587.0, 0.056949229761667476, 51.243017045616334, 0.03242324311626185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 182.75, 122, 356, 126.5, 356.0, 356.0, 356.0, 0.057731720693935284, 0.10215808388419016, 0.031966685188927056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 179.0, 126, 380, 127.0, 379.9, 380.0, 380.0, 0.11630205970947746, 0.08643151117081282, 0.0583781823151088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 177.60000000000002, 122, 381, 127.0, 380.7, 381.0, 381.0, 0.11597026522399656, 0.048449296350415755, 0.06516532286121839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 267.4, 121, 1296, 126.0, 1203.5000000000005, 1296.0, 1296.0, 0.11597968036000093, 10.464006159245901, 0.06718666639604742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 274.0, 120, 978, 127.0, 931.0000000000002, 978.0, 978.0, 0.11631017597729626, 3.448119664270677, 0.06749170563057562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 126.0, 123, 134, 123.5, 134.0, 134.0, 134.0, 0.057725888617897916, 0.04289980589669952, 0.03241443940946415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 311.2142857142857, 121, 1512, 127.0, 1292.0, 1512.0, 1512.0, 0.07994791964091963, 10.295224200378039, 0.04601912896741551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 831.6315789473683, 119, 1859, 1113.0, 1706.0, 1859.0, 1859.0, 0.098558452943526, 46.68788280557011, 0.05348376573693193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 272.64285714285717, 122, 999, 126.5, 998.5, 999.0, 999.0, 0.07994974587402204, 3.376739085432014, 0.04609825609616812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 573.1578947368422, 121, 1127, 604.0, 1080.0, 1127.0, 1127.0, 0.09855589675491741, 15.264533428604034, 0.05357862458762138], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 442.8333333333333, 230, 528, 474.5, 526.5, 528.0, 528.0, 0.07667633640464658, 0.013852658432480095, 0.05286473974773485], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 511.9, 249, 1422, 271.0, 1368.7000000000003, 1422.0, 1422.0, 0.11579166763159722, 14.014218040776036, 0.2574555359996295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f787db9d-bb50-4620-b8a1-75ede20b36f1", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a34a052-d7e0-4254-8772-875afb11c3f1", 3, 0, 0.0, 383.66666666666663, 230, 690, 231.0, 690.0, 690.0, 690.0, 0.03872016933620723, 0.03227941200196182, 0.024830316924586017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d18b882e-4e0c-4968-b624-71f0d41c8ba1", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 570.0, 176, 1723, 392.0, 1107.2000000000003, 1666.0999999999992, 1723.0, 0.09664726051038959, 0.05936633482522954, 0.0436989078284281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 127.42105263157895, 120, 137, 127.0, 136.0, 137.0, 137.0, 0.09855640798203161, 0.07324358054133405, 0.049470696975355714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 190.73684210526312, 122, 382, 128.0, 378.0, 382.0, 382.0, 0.09855640798203161, 0.10428054146371828, 0.05185153125534928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd7ef1be-c435-4b47-ba9f-965f5bbb1fc8", 3, 0, 0.0, 306.0, 237, 440, 241.0, 440.0, 440.0, 440.0, 0.06558093780741064, 0.0421622240135534, 0.04205548420592415], "isController": false}, {"data": ["login", 21, 0, 0.0, 2563.952380952381, 1659, 3728, 2555.0, 3636.0, 3722.6, 3728.0, 0.09325996882452471, 21.381348408696272, 0.17016561554910137], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 132.85714285714283, 126, 145, 131.0, 142.5, 145.0, 145.0, 0.08161552094021081, 0.06607350279241675, 0.02901176720921556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2228413-4078-4d25-973d-79d9480a69b3", 3, 0, 0.0, 334.0, 219, 416, 367.0, 416.0, 416.0, 416.0, 0.07014590347923681, 0.03173919460811822, 0.04498288732229704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24fd1ce1-139c-4091-8d45-ea80dbd52440", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 962.0526315789473, 252, 1986, 1234.0, 1839.0, 1986.0, 1986.0, 0.09849254566943828, 62.08879260936561, 0.2082487587995314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27534efe-68b9-4a95-927b-712228966e2f", 3, 0, 0.0, 428.0, 307, 512, 465.0, 512.0, 512.0, 512.0, 0.05435668859053106, 0.024594986048449927, 0.03485764209744342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1873785a-3aac-435e-adc7-37a0148a51b3", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36984945-9b06-4a89-bb39-e97d7b2d5166", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 446.2999999999999, 249, 1375, 372.5, 757.0, 1344.0999999999995, 1375.0, 0.1165392504195413, 7.142655377776547, 0.26060862259346446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1476.25, 1203, 1722, 1490.0, 1722.0, 1722.0, 1722.0, 0.05683998124280619, 68.00037834112514, 0.12816749676722605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9402d434-5a5c-4550-904a-c667935960c7", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1231.4090909090908, 221, 2331, 1107.0, 2158.1, 2314.6499999999996, 2331.0, 0.09283287971812562, 0.029356420237567776, 0.041883584404076205], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 178.21428571428575, 126, 379, 132.5, 374.5, 379.0, 379.0, 0.062464027412784597, 0.04849502128238648, 0.022204009744388277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 476.42857142857144, 249, 1644, 257.0, 1422.0, 1644.0, 1644.0, 0.07988906832227251, 13.75971062324886, 0.17675233461536266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6254e88-d5a8-446b-8338-46019b26e780", 2, 0, 0.0, 216.5, 213, 220, 216.5, 220.0, 220.0, 220.0, 0.01692648826148039, 0.023935112307249616, 0.010521200955500262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 535.909090909091, 248, 1652, 496.5, 1394.2999999999995, 1645.6999999999998, 1652.0, 0.101728458998807, 11.207199629384728, 0.22642349037278856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 146.6153846153846, 120, 379, 127.0, 281.3999999999999, 379.0, 379.0, 0.0695518187800611, 0.051688412198854, 0.034911752786085354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 163.7692307692308, 122, 379, 125.0, 377.8, 379.0, 379.0, 0.06946188412689083, 0.01858648071364071, 0.03961498079111743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 188.92307692307693, 120, 488, 125.0, 438.4, 488.0, 488.0, 0.06946745182699399, 0.018723649125244473, 0.04083926367172888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 191.53846153846155, 119, 490, 125.0, 445.19999999999993, 490.0, 490.0, 0.06955777308114182, 0.018747993525776503, 0.04096029020305519], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1426.111111111111, 969, 2540, 1267.5, 2039.0, 2214.0, 2540.0, 0.2434109994726095, 291.20417872452634, 0.4806416415367348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2228413-4078-4d25-973d-79d9480a69b3", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1231.4090909090908, 221, 2331, 1107.0, 2158.1, 2314.6499999999996, 2331.0, 0.0921678292381491, 0.029146112193384865, 0.041583532332055556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 126.0, 122, 130, 126.0, 130.0, 130.0, 130.0, 0.1710717646052519, 0.0461091865537593, 0.10073854888375673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 127.5, 126, 129, 127.5, 129.0, 129.0, 129.0, 0.1710278775440397, 0.04609735761929194, 0.10054568582178894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3be53a7e-7d0e-4a1f-a388-e35065e5bbb5", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36984945-9b06-4a89-bb39-e97d7b2d5166", 3, 0, 0.0, 350.0, 242, 459, 349.0, 459.0, 459.0, 459.0, 0.026115342763873776, 0.021771286724700762, 0.0167471436343852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 159.0, 120, 366, 126.0, 363.0, 366.0, 366.0, 0.06288037009589256, 0.016948224752408543, 0.036966780075905585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 160.7142857142857, 118, 379, 126.5, 376.5, 379.0, 379.0, 0.06288037009589256, 0.016948224752408543, 0.03702818668732736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 126.57142857142858, 118, 130, 127.0, 129.5, 130.0, 130.0, 0.06287782837945871, 0.046728542379656325, 0.03156172244828299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 125.5, 121, 130, 125.5, 130.0, 130.0, 130.0, 0.1710863986313088, 0.04577897775876818, 0.09757271171941831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 124.21428571428571, 120, 130, 123.0, 129.5, 130.0, 130.0, 0.0628798052522603, 0.016825260389764965, 0.035861138932929706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 146.5, 134, 159, 146.5, 159.0, 159.0, 159.0, 0.17053206002728513, 0.12673329851637108, 0.08559910044338336], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 609.0, 416, 1122, 551.0, 1013.4000000000003, 1122.0, 1122.0, 0.07539630181139616, 0.013621402182722939, 0.05131955308842102], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 257.5, 131, 384, 257.5, 384.0, 384.0, 384.0, 0.18885741265344663, 0.14865144003777148, 0.06713290840415487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1400.8095238095239, 1117, 1953, 1391.0, 1828.4, 1944.1, 1953.0, 0.09686212829158268, 0.050133718744666815, 0.044552795337241644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64b40b64-6f27-49e6-b83b-4665f44f21e2", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 275.5, 261, 290, 275.5, 290.0, 290.0, 290.0, 0.1687051876845213, 0.26146009067903836, 0.37942192113032475], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 1292.5, 636, 2750, 1038.5, 2206.9, 2460.75, 2750.0, 0.28961862054651033, 93.49771502975831, 1.0527382309249935], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 248.98148148148158, 122, 865, 130.0, 510.0, 513.75, 865.0, 0.244434586588689, 0.18165500038475815, 0.11815929722793073], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 813.759259259259, 591, 1266, 749.0, 1006.5, 1060.25, 1266.0, 0.24461950342240804, 71.92625613813753, 0.12302641041263686], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 198.7037037037037, 121, 507, 130.5, 377.0, 380.0, 507.0, 0.2452828474613225, 0.4340356636717934, 0.119287947300526], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1175.6111111111113, 840, 1916, 1122.0, 1590.0, 1653.5, 1916.0, 0.2444013976139182, 219.91280718483534, 0.12267804528667378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 134.54545454545456, 122, 148, 132.0, 146.8, 148.0, 148.0, 0.09709980535902653, 0.07254038193325713, 0.034515946436216464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, 4.022988505747127, 207.20114942528738, 122, 1699, 133.0, 379.0, 418.0, 1151.5, 0.717230008244023, 1.4998405940849135, 0.3469292624175598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 159.0, 125, 482, 130.0, 348.79999999999984, 482.0, 482.0, 0.07412475766906147, 0.05740325471832592, 0.026349034952674193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 165.90000000000003, 122, 491, 130.5, 361.6000000000004, 485.4999999999999, 491.0, 0.11800175822619756, 0.09576119246676776, 0.04194593749446867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd7ef1be-c435-4b47-ba9f-965f5bbb1fc8", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 368.3846153846154, 250, 870, 261.0, 768.3999999999999, 870.0, 870.0, 0.06941107373591757, 0.10757360744033317, 0.1561071316541193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a34a052-d7e0-4254-8772-875afb11c3f1", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 289.4285714285714, 242, 504, 254.0, 502.5, 504.0, 504.0, 0.06284254799599602, 0.09739367545863838, 0.14133436331521373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaf6bf5d-4b04-41c2-b813-bb08d405c095", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27534efe-68b9-4a95-927b-712228966e2f", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61bf0aba-a57e-43f0-beb9-8b5bac17f5ae", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3be53a7e-7d0e-4a1f-a388-e35065e5bbb5", 3, 0, 0.0, 388.3333333333333, 226, 481, 458.0, 481.0, 481.0, 481.0, 0.02890145566998391, 0.023811713639560313, 0.01853381109045192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f8f83ed-f78d-4aeb-b8de-8edd865a5ad9", 2, 0, 0.0, 359.5, 254, 465, 359.5, 465.0, 465.0, 465.0, 0.06115833893951441, 0.037596849963305, 0.03801492454589934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 130.5, 124, 136, 131.0, 135.9, 136.0, 136.0, 0.11636431339236883, 0.09647783405285268, 0.04136387702619361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 144.52631578947367, 123, 367, 132.0, 141.0, 367.0, 367.0, 0.09970455964694092, 0.07740734855402151, 0.03544185518699853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b1c1b17-2868-417e-9ca3-24012c77d2e9", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d18b882e-4e0c-4968-b624-71f0d41c8ba1", 3, 0, 0.0, 371.0, 252, 572, 289.0, 572.0, 572.0, 572.0, 0.021859994024934968, 0.025837772885592077, 0.01401829043916728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1873785a-3aac-435e-adc7-37a0148a51b3", 3, 0, 0.0, 435.6666666666667, 232, 657, 418.0, 657.0, 657.0, 657.0, 0.038907982621101095, 0.03243598420984372, 0.02495075708449517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9402d434-5a5c-4550-904a-c667935960c7", 3, 0, 0.0, 396.66666666666663, 215, 692, 283.0, 692.0, 692.0, 692.0, 0.02480917608726214, 0.029468972507298033, 0.01590953023825079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f787db9d-bb50-4620-b8a1-75ede20b36f1", 3, 0, 0.0, 520.0, 280, 760, 520.0, 760.0, 760.0, 760.0, 0.020263287650877062, 0.027934577865060015, 0.012994360895907492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 173.9090909090909, 123, 393, 128.0, 372.09999999999997, 390.45, 393.0, 0.10178823420547344, 0.07564535764684109, 0.05109292224766928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 147.59090909090907, 119, 377, 124.5, 297.1999999999998, 374.74999999999994, 377.0, 0.10178823420547344, 0.04113459180604715, 0.05727395493557268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 341.1363636363637, 120, 1486, 253.5, 1015.6999999999994, 1456.4499999999996, 1486.0, 0.1017896470675328, 8.351350751508337, 0.05904594761534618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 292.9545454545455, 122, 978, 141.5, 747.9999999999998, 959.6999999999997, 978.0, 0.10178917610915501, 2.74579555759648, 0.05914507791498753], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.390625], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.546875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
