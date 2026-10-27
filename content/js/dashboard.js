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

    var data = {"OkPercent": 96.02400600150038, "KoPercent": 3.975993998499625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7930923176242737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ff736de-29ae-4400-b8b6-b226a1bc4a78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74aeac59-91c1-4d77-9bf2-0caa1dc3c73f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.59375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1fa0f2b2-e2dc-43df-941c-855635bc0240"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ff736de-29ae-4400-b8b6-b226a1bc4a78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.28225806451612906, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2baea926-cc67-4763-b304-417f9311067f"], "isController": false}, {"data": [0.8272727272727273, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f09381d-e2d9-48a8-933d-cdf66e1fc2aa"], "isController": false}, {"data": [0.8519553072625698, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f09381d-e2d9-48a8-933d-cdf66e1fc2aa"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fa0f2b2-e2dc-43df-941c-855635bc0240"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2baea926-cc67-4763-b304-417f9311067f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7805fd5-105e-4a48-a0cf-d504c9f6b00f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45175e11-ffd5-4350-a9cf-b9f3a72802c7"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c23d314-81c5-43fc-8987-3ee95cd80dff"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80972623-ef65-4263-91e0-a86beb13dbe2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c23d314-81c5-43fc-8987-3ee95cd80dff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74aeac59-91c1-4d77-9bf2-0caa1dc3c73f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c32a8826-4145-44ce-82bf-0fbfbd016c10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c32a8826-4145-44ce-82bf-0fbfbd016c10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf296105-b07b-4c5c-8099-b80920dfb45d"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7805fd5-105e-4a48-a0cf-d504c9f6b00f"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f294983f-2bd6-401d-9db3-5456356eb18a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f294983f-2bd6-401d-9db3-5456356eb18a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 53, 3.975993998499625, 282.2685671417852, 78, 2727, 86.0, 793.6000000000001, 963.8999999999999, 1363.1600000000021, 5.147234857553268, 696.2432537267255, 3.781720124414034], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1342.763636363636, 971, 1793, 1311.0, 1622.8, 1685.2, 1793.0, 0.25158498540807084, 302.74250505457104, 1.237041407743786], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 249.2777777777778, 162, 890, 166.0, 523.7000000000006, 890.0, 890.0, 0.09995057999100444, 6.789389334926065, 0.22337045849552167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 83.66666666666667, 82, 88, 83.0, 86.8, 88.0, 88.0, 0.09730150492994293, 0.07554169572197716, 0.034587644330565645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 340.2142857142857, 165, 1020, 323.0, 755.5, 1020.0, 1020.0, 0.07337333927307985, 6.3755934969602475, 0.1636774128036477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 94.46153846153845, 79, 240, 83.0, 177.59999999999994, 240.0, 240.0, 0.057387035827167907, 0.042647982680151145, 0.02880560196793389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 130.46153846153845, 78, 242, 81.0, 242.0, 242.0, 242.0, 0.057346784830452024, 0.015344745159710795, 0.03270558822361717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 106.23076923076923, 79, 241, 81.0, 240.2, 241.0, 241.0, 0.057387542488853575, 0.015467736061448814, 0.03373759822098618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ff736de-29ae-4400-b8b6-b226a1bc4a78", 3, 0, 0.0, 374.33333333333337, 187, 737, 199.0, 737.0, 737.0, 737.0, 0.0378587112894677, 0.03156124987380429, 0.024277884518310994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 149.23076923076923, 80, 324, 83.0, 292.0, 324.0, 324.0, 0.05734703780493185, 0.015456818783360537, 0.03376978886364639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 82.75, 82, 83, 83.0, 83.0, 83.0, 83.0, 0.06776674685731711, 0.01998589604581032, 0.041890967539728256], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 932.3272727272725, 635, 1457, 873.0, 1291.2, 1339.6, 1457.0, 0.23624719187996926, 282.63377430124524, 0.46649591990361117], "isController": false}, {"data": ["deleteBook", 13, 4, 30.76923076923077, 589.6153846153845, 82, 2727, 460.0, 1971.3999999999994, 2727.0, 2727.0, 0.06373830034467712, 0.013756019898607072, 0.042383671473188236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 4, 30.76923076923077, 589.6153846153845, 82, 2727, 460.0, 1971.3999999999994, 2727.0, 2727.0, 0.063067914441097, 0.013611337003400815, 0.04193788901987609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 11, 47.82608695652174, 620.6086956521739, 90, 1270, 509.0, 1145.2, 1247.5999999999997, 1270.0, 0.08979569527245185, 0.027603635944826403, 0.04051329220300074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 99.11111111111111, 80, 243, 81.0, 243.0, 243.0, 243.0, 0.04923817599912465, 0.013271227124764067, 0.02899474621823454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 108.05555555555554, 79, 242, 81.0, 241.1, 242.0, 242.0, 0.17135350227519372, 0.04585044885097957, 0.09772504426632142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 98.66666666666667, 79, 242, 81.0, 242.0, 242.0, 242.0, 0.04923844537815126, 0.013271299730829833, 0.02894682042738971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 90.83333333333331, 80, 242, 82.0, 100.70000000000022, 242.0, 242.0, 0.17161162382732056, 0.12753559153573335, 0.08614099086644801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 126.16666666666667, 79, 245, 81.5, 244.1, 245.0, 245.0, 0.17135187106723657, 0.04618468399859111, 0.10090349438822623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 108.72222222222221, 79, 243, 82.0, 242.1, 243.0, 243.0, 0.17161816864345372, 0.04625645951718089, 0.1008927124251554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74aeac59-91c1-4d77-9bf2-0caa1dc3c73f", 3, 0, 0.0, 297.6666666666667, 205, 476, 212.0, 476.0, 476.0, 476.0, 0.09199349912606175, 0.04162466269050321, 0.05899322697862685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 113.60000000000001, 79, 258, 81.0, 247.20000000000002, 258.0, 258.0, 0.0980225582580738, 0.02642014265549645, 0.05762654303843791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 123.2, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.0980225582580738, 0.02642014265549645, 0.05772226819298681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 98.33333333333331, 80, 240, 81.0, 240.0, 240.0, 240.0, 0.04923817599912465, 0.013175058812265777, 0.02808114724950078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 81.93333333333334, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.09802127715189378, 0.07284589053963982, 0.04920208638288418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 99.88888888888889, 81, 238, 82.0, 238.0, 238.0, 238.0, 0.04923763724991383, 0.03659164252654729, 0.024714985885210653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 124.60000000000001, 80, 257, 81.0, 247.4, 257.0, 257.0, 0.09802383939774154, 0.026229035151348806, 0.055904220906524464], "isController": false}, {"data": ["deleteAccount", 13, 4, 30.76923076923077, 443.3076923076923, 80, 1196, 452.0, 1012.3999999999999, 1196.0, 1196.0, 0.0642263930951687, 0.013320993940486837, 0.04369729884787732], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 123.22222222222223, 83, 244, 84.0, 244.0, 244.0, 244.0, 0.04943425244424915, 0.03891016354498517, 0.017572331923541688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1218.4285714285716, 800, 2143, 1192.0, 1673.2000000000003, 2101.3999999999996, 2143.0, 0.09282998850676333, 0.04804677139510211, 0.04269816854168509], "isController": false}, {"data": ["goToProfile", 16, 6, 37.5, 211.3125, 80, 962, 185.5, 499.30000000000047, 962.0, 962.0, 0.07187457885988949, 0.10298191764745518, 0.046439470935717174], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 217.88888888888889, 163, 481, 165.0, 481.0, 481.0, 481.0, 0.04921555867861693, 0.07627450353805183, 0.11068694495786602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fa0f2b2-e2dc-43df-941c-855635bc0240", 3, 0, 0.0, 1063.3333333333333, 962, 1196, 1032.0, 1196.0, 1196.0, 1196.0, 0.016702763193791027, 0.023026107462794595, 0.01071108186581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ff736de-29ae-4400-b8b6-b226a1bc4a78", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 90.83333333333334, 80, 240, 82.0, 99.60000000000022, 240.0, 240.0, 0.09999666677777408, 0.07431392911902937, 0.05019363937868738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 108.22222222222223, 80, 246, 81.0, 245.1, 246.0, 246.0, 0.09999777782715939, 0.03510121650074443, 0.056563413174151686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 577.8888888888888, 474, 723, 634.0, 723.0, 723.0, 723.0, 0.04901053181872638, 14.410723657519851, 0.02795131892786739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 770.5555555555555, 548, 945, 808.0, 945.0, 945.0, 945.0, 0.04896040735058916, 44.05466059727617, 0.02787491941932957], "isController": false}, {"data": ["addBook", 62, 24, 38.70967741935484, 803.0483870967741, 410, 3319, 643.0, 1425.5, 1527.1999999999994, 3319.0, 0.2816005813689422, 60.870076070479634, 1.0274952664418404], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 136.11111111111111, 80, 241, 83.0, 241.0, 241.0, 241.0, 0.04911671769347894, 0.0869135668560389, 0.02719646380097906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 92.37499999999999, 80, 251, 82.0, 134.10000000000014, 251.0, 251.0, 0.10644030362096607, 0.07910260845269061, 0.053428043028492744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 100.68749999999999, 79, 240, 81.0, 239.3, 240.0, 240.0, 0.1064417198320882, 0.028481475814445472, 0.06070504334173779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 130.5625, 79, 243, 81.0, 242.3, 243.0, 243.0, 0.10644101172181643, 0.028689178940645828, 0.06257567290677098], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 147.1818181818182, 80, 329, 83.0, 325.4, 328.2, 329.0, 0.2370546604946253, 0.17617050452774402, 0.11459185248519485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 130.87499999999997, 79, 244, 81.5, 242.6, 244.0, 244.0, 0.10633066177545622, 0.02865943618166594, 0.06261463774472667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2baea926-cc67-4763-b304-417f9311067f", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 509.54545454545445, 392, 728, 478.0, 655.1999999999999, 722.1999999999999, 728.0, 0.23701584127695516, 69.69052700202973, 0.11920230298596866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 81.22222222222223, 80, 85, 81.0, 85.0, 85.0, 85.0, 0.04915910617820722, 0.036533281056265327, 0.027603990285614406], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 127.05454545454543, 80, 330, 84.0, 244.0, 273.59999999999985, 330.0, 0.2373410893524472, 0.4199824745181976, 0.11542564697023311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 637.0714285714287, 80, 1106, 837.5, 1049.5, 1106.0, 1106.0, 0.07135648681434062, 41.282599601231915, 0.03800768229033935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 130.33333333333331, 79, 807, 81.0, 299.4000000000008, 807.0, 807.0, 0.09999777782715939, 5.024242733842026, 0.058310336159196466], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 782.4000000000001, 551, 1132, 787.0, 986.4, 1096.6, 1132.0, 0.23661409531676172, 212.90577888923664, 0.11876918456329642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 418.00000000000006, 80, 717, 482.0, 680.5, 717.0, 717.0, 0.07141436142808319, 13.505713069210719, 0.038108249506475754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 83.64285714285714, 80, 86, 84.0, 86.0, 86.0, 86.0, 0.07549204637368563, 0.056397866675653816, 0.026835063359396064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 129.88888888888889, 80, 638, 81.0, 282.50000000000057, 638.0, 638.0, 0.09999666677777408, 1.6589182270313212, 0.05840734128306834], "isController": false}, {"data": ["deleteBooks", 13, 4, 30.76923076923077, 525.4615384615385, 82, 2249, 411.0, 1915.3999999999996, 2249.0, 2249.0, 0.0638874009130984, 0.01378819882987768, 0.042645991925615405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f09381d-e2d9-48a8-933d-cdf66e1fc2aa", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 24, 13.40782122905028, 140.2569832402236, 81, 2189, 84.0, 244.0, 317.0, 1348.9999999999882, 0.7204349978467445, 1.4880392760332606, 0.3467085566245809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 108.46153846153845, 82, 248, 84.0, 246.4, 248.0, 248.0, 0.05686117562667576, 0.044034094015579964, 0.0202123710235449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 254.00000000000003, 162, 495, 242.0, 376.7000000000001, 495.0, 495.0, 0.10627274901033502, 0.1647020045697282, 0.2390099032917984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f09381d-e2d9-48a8-933d-cdf66e1fc2aa", 3, 0, 0.0, 273.3333333333333, 184, 404, 232.0, 404.0, 404.0, 404.0, 0.017577472710973617, 0.024231965146801194, 0.011272012122597012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fa0f2b2-e2dc-43df-941c-855635bc0240", 1, 0, 0.0, 2249.0, 2249, 2249, 2249.0, 2249.0, 2249.0, 2249.0, 0.444642063139173, 0.08033084148510448, 0.3065598599377501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2baea926-cc67-4763-b304-417f9311067f", 3, 0, 0.0, 392.0, 209, 686, 281.0, 686.0, 686.0, 686.0, 0.028549133057992806, 0.03374410876743877, 0.018307875040444607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7805fd5-105e-4a48-a0cf-d504c9f6b00f", 3, 0, 0.0, 339.0, 186, 536, 295.0, 536.0, 536.0, 536.0, 0.02367405560246526, 0.023743413187238105, 0.015181604666945493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 92.99999999999999, 82, 243, 84.0, 105.30000000000021, 243.0, 243.0, 0.15987494226738197, 0.12974226271893985, 0.056830545884108435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45175e11-ffd5-4350-a9cf-b9f3a72802c7", 2, 0, 0.0, 275.5, 201, 350, 275.5, 350.0, 350.0, 350.0, 0.019034204465424365, 0.02674826193920475, 0.0118313194748463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 458.99999999999994, 105, 1405, 333.0, 1011.6, 1366.9999999999995, 1405.0, 0.09197133997862761, 0.05649411410796559, 0.04158469766611776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 83.78571428571429, 80, 97, 82.0, 94.5, 97.0, 97.0, 0.07141363286251345, 0.053072045515989, 0.03584629618294132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 139.14285714285714, 80, 245, 82.5, 244.5, 245.0, 245.0, 0.07141363286251345, 0.08806153751001067, 0.03687246864176371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c23d314-81c5-43fc-8987-3ee95cd80dff", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["login", 21, 0, 0.0, 2298.1428571428573, 1320, 3369, 2236.0, 3271.0, 3359.7999999999997, 3369.0, 0.09222256378727328, 47.40560138855342, 0.20468314275833296], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 257.9230769230769, 163, 483, 174.0, 452.2, 483.0, 483.0, 0.05732554293903649, 0.08884339516040128, 0.12892648963730569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 93.44444444444446, 83, 244, 84.0, 105.40000000000022, 244.0, 244.0, 0.09772570566103296, 0.07911583007128548, 0.03473843443419531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80972623-ef65-4263-91e0-a86beb13dbe2", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.697240038209607, 1.302794077510917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 228.9333333333333, 162, 340, 166.0, 330.4, 340.0, 340.0, 0.09796878061524394, 0.15183247542616418, 0.22033408374697927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c23d314-81c5-43fc-8987-3ee95cd80dff", 3, 0, 0.0, 404.0, 301, 508, 403.0, 508.0, 508.0, 508.0, 0.06256256256256257, 0.028307930326159494, 0.04011987247664331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74aeac59-91c1-4d77-9bf2-0caa1dc3c73f", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c32a8826-4145-44ce-82bf-0fbfbd016c10", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c32a8826-4145-44ce-82bf-0fbfbd016c10", 3, 0, 0.0, 278.6666666666667, 185, 444, 207.0, 444.0, 444.0, 444.0, 0.0589147895760099, 0.03787653301192043, 0.037780643054928224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 83.37500000000001, 82, 85, 83.5, 85.0, 85.0, 85.0, 0.10647997178280746, 0.08828271098008159, 0.03785030246966985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf296105-b07b-4c5c-8099-b80920dfb45d", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 722.5714285714286, 165, 1189, 922.5, 1137.0, 1189.0, 1189.0, 0.07132667617689016, 54.89544492402435, 0.14868348150601182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 85.07142857142857, 81, 96, 84.0, 92.5, 96.0, 96.0, 0.06951099018405517, 0.05396605194953502, 0.02470898479198836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7805fd5-105e-4a48-a0cf-d504c9f6b00f", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 456.1052631578946, 80, 1028, 83.0, 961.0, 1028.0, 1028.0, 0.09548890318430364, 54.12614932202879, 0.13512052804107028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 236.27777777777777, 162, 484, 166.5, 343.60000000000025, 484.0, 484.0, 0.17121496038276057, 0.2653497481713291, 0.38506645875146245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f294983f-2bd6-401d-9db3-5456356eb18a", 3, 0, 0.0, 632.0, 186, 1258, 452.0, 1258.0, 1258.0, 1258.0, 0.08890205956437991, 0.04022586679508076, 0.057010760853459776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f294983f-2bd6-401d-9db3-5456356eb18a", 1, 0, 0.0, 1415.0, 1415, 1415, 1415.0, 1415.0, 1415.0, 1415.0, 0.7067137809187278, 0.12767778268551236, 0.4872460247349823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 93.85714285714286, 80, 247, 82.0, 165.5, 247.0, 247.0, 0.07346767422334173, 0.05459853523824517, 0.03687732866288833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 126.92857142857142, 80, 244, 82.0, 242.5, 244.0, 244.0, 0.07346883084851252, 0.027540562010317123, 0.041459461604664224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 176.2142857142857, 79, 940, 81.0, 591.0, 940.0, 940.0, 0.07340681005463565, 4.736341950222318, 0.042704575603771014], "isController": false}, {"data": ["register", 23, 11, 47.82608695652174, 620.6086956521739, 90, 1270, 509.0, 1145.2, 1247.5999999999997, 1270.0, 0.09237467166828657, 0.028396425903464452, 0.04167685381909023], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 211.42857142857144, 80, 632, 239.0, 438.0, 632.0, 632.0, 0.07340604026845637, 1.5600729308672399, 0.04277581336514262], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 20.754716981132077, 0.8252063015753939], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 11.320754716981131, 0.450112528132033], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 7.547169811320755, 0.30007501875468867], "isController": false}, {"data": ["401/Unauthorized", 32, 60.37735849056604, 2.4006001500375094], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 53, "401/Unauthorized", 32, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 24, "401/Unauthorized", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
