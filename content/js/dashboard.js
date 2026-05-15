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

    var data = {"OkPercent": 97.97145003756575, "KoPercent": 2.02854996243426};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8136746597537265, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c29a2c3a-604d-484d-adb1-7f5fde126fea"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fcb74f5-7a83-4cd1-a2c8-d2cb0893fb7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/415ad494-6da4-4dff-9722-557e394075e4"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85df6613-217d-4611-9f32-714036afa4ef"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d2e9340-4c7d-45ca-b4da-cbb08af426f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fb335ac-ac4b-457c-acf2-60c44ae1070c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbb4c3ba-a9fc-4acb-92b5-31676b762d1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3d9d007-4655-4037-8909-880296d3e8a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60d36f42-00be-42ee-b367-44fff6314a4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfc3000e-0391-4bc8-a42f-ede3b259ac60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0495a9c2-b995-4f58-a03f-256f9689c4f8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49547e7d-6f5b-49b9-9acc-460f568b8e21"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3d9d007-4655-4037-8909-880296d3e8a6"], "isController": false}, {"data": [0.35, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8508771929824561, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d2e9340-4c7d-45ca-b4da-cbb08af426f1"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60d36f42-00be-42ee-b367-44fff6314a4c"], "isController": false}, {"data": [0.9180790960451978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17d5991b-f56b-4055-af09-097973245756"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c29a2c3a-604d-484d-adb1-7f5fde126fea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fb335ac-ac4b-457c-acf2-60c44ae1070c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0495a9c2-b995-4f58-a03f-256f9689c4f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfa91eb6-33f8-4b3f-8966-df91c937b972"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbb4c3ba-a9fc-4acb-92b5-31676b762d1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cfc3000e-0391-4bc8-a42f-ede3b259ac60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49547e7d-6f5b-49b9-9acc-460f568b8e21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/85df6613-217d-4611-9f32-714036afa4ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71889740-f08b-48d2-8370-5b4257aba0a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 27, 2.02854996243426, 297.53568745304307, 77, 2717, 93.0, 844.0, 1017.1999999999989, 1553.0000000000048, 5.237847878100995, 728.4148028539089, 3.8406915860427686], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c29a2c3a-604d-484d-adb1-7f5fde126fea", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1358.228070175439, 949, 1952, 1291.0, 1715.6000000000001, 1777.4999999999995, 1952.0, 0.25832415602779024, 310.85195756317614, 1.2701778570311757], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6fcb74f5-7a83-4cd1-a2c8-d2cb0893fb7c", 1, 0, 0.0, 1601.0, 1601, 1601, 1601.0, 1601.0, 1601.0, 1601.0, 0.6246096189881324, 0.19946029825109307, 0.3726918722673329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/415ad494-6da4-4dff-9722-557e394075e4", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 473.53846153846155, 84, 1085, 488.0, 916.1999999999998, 1085.0, 1085.0, 0.07055822410377487, 0.013987616692447555, 0.047438108903905124], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 473.53846153846155, 84, 1085, 488.0, 916.1999999999998, 1085.0, 1085.0, 0.0724004076699878, 0.01435281519239016, 0.048676656298557004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 119.12500000000001, 79, 238, 80.5, 237.3, 238.0, 238.0, 0.10541573329819476, 0.04799813051785479, 0.05901325108709975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 110.0, 78, 243, 80.5, 241.6, 243.0, 243.0, 0.10541434425689475, 0.07834015232372744, 0.052913059519574125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 186.1875, 77, 625, 81.5, 513.7000000000002, 625.0, 625.0, 0.10530680479409228, 3.8952976809467077, 0.0608804965215846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 231.0625, 78, 951, 81.0, 890.1, 951.0, 951.0, 0.10530680479409228, 11.869241548306205, 0.060777657845027866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85df6613-217d-4611-9f32-714036afa4ef", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 175.78571428571428, 78, 223, 187.0, 217.0, 223.0, 223.0, 0.07552299675251113, 0.15743088971484676, 0.04881390122131475], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2d2e9340-4c7d-45ca-b4da-cbb08af426f1", 3, 0, 0.0, 405.0, 223, 719, 273.0, 719.0, 719.0, 719.0, 0.020081396594195135, 0.02768382635951055, 0.01287771851906394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 91.1, 78, 241, 80.0, 124.00000000000009, 235.3499999999999, 241.0, 0.09876348121518588, 0.07339746992651998, 0.049574638031841346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 103.8, 78, 242, 80.0, 238.70000000000002, 241.85, 242.0, 0.09876445664734176, 0.02642720812633949, 0.05632660418168709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 554.2857142857143, 452, 652, 611.0, 652.0, 652.0, 652.0, 0.058863101244534144, 17.307706204801548, 0.033570362428523376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fb335ac-ac4b-457c-acf2-60c44ae1070c", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 861.5714285714286, 690, 1048, 844.0, 1048.0, 1048.0, 1048.0, 0.05878055539227623, 52.89084706716518, 0.03346588261103227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 157.57142857142858, 78, 240, 150.0, 240.0, 240.0, 240.0, 0.059047313768990035, 0.10448606694278315, 0.03269514346388413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbb4c3ba-a9fc-4acb-92b5-31676b762d1d", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 100.43749999999997, 79, 236, 80.5, 235.3, 236.0, 236.0, 0.07461920884983816, 0.055454314389381684, 0.037455345067203924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 128.125, 77, 238, 80.0, 236.6, 238.0, 238.0, 0.0746206008823886, 0.01996684047048289, 0.04255706144073725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 118.93749999999999, 78, 240, 80.5, 237.9, 240.0, 240.0, 0.07462094889864145, 0.02011267763283695, 0.043868956286115375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 113.9375, 77, 319, 80.0, 260.20000000000005, 319.0, 319.0, 0.07462129691814044, 0.02011277143496754, 0.04394203324378778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3d9d007-4655-4037-8909-880296d3e8a6", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 103.14285714285714, 78, 243, 80.0, 243.0, 243.0, 243.0, 0.05912711485019723, 0.04394114687597665, 0.033201260780140046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 104.69999999999999, 77, 238, 80.0, 236.8, 237.95, 238.0, 0.09876348121518588, 0.02661984454628057, 0.05806212469877139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 522.5555555555554, 79, 1166, 684.0, 1015.7000000000003, 1166.0, 1166.0, 0.09246322018574833, 46.2325030211073, 0.04994378364633846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 120.24999999999999, 79, 254, 80.0, 241.5, 253.39999999999998, 254.0, 0.09876543209876543, 0.02662037037037037, 0.058159722222222224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 360.38888888888886, 79, 639, 466.0, 627.3000000000001, 639.0, 639.0, 0.09246274521890555, 15.115030236601891, 0.0500338227437806], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 397.75, 87, 761, 406.0, 695.6000000000003, 761.0, 761.0, 0.09024388409677152, 0.018022338181435327, 0.06114669425372067], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60d36f42-00be-42ee-b367-44fff6314a4c", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 255.1875, 158, 474, 169.5, 473.3, 474.0, 474.0, 0.07459068362361541, 0.11560099112370865, 0.1677561956886585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 582.3181818181819, 105, 2520, 407.0, 1217.8999999999996, 2341.6499999999974, 2520.0, 0.0975687638037626, 0.0599323754224284, 0.04411556410267782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 81.05555555555556, 79, 90, 80.0, 83.70000000000002, 90.0, 90.0, 0.09246227025694238, 0.0687146363921222, 0.046411725500066774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 147.7777777777778, 78, 326, 82.0, 262.1000000000001, 326.0, 326.0, 0.09246369515747081, 0.10189467100903576, 0.04841903134005579], "isController": false}, {"data": ["login", 22, 0, 0.0, 2614.8181818181815, 1357, 5452, 2522.0, 3703.4999999999995, 5209.749999999996, 5452.0, 0.10020724680589402, 38.27973319108839, 0.20406195199161903], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 93.80000000000001, 79, 213, 85.0, 122.60000000000008, 208.64999999999992, 213.0, 0.09877030964492074, 0.07996151044496023, 0.03510975850659292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 613.2777777777776, 161, 1246, 764.5, 1095.7000000000003, 1246.0, 1246.0, 0.09242381453621216, 61.492002772714436, 0.19472582539601038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfc3000e-0391-4bc8-a42f-ede3b259ac60", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0495a9c2-b995-4f58-a03f-256f9689c4f8", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 381.0, 159, 1097, 314.5, 1050.8, 1097.0, 1097.0, 0.10525069399676354, 15.882280901768212, 0.23334510551382073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 643.1818181818181, 78, 1130, 920.0, 1109.0, 1130.0, 1130.0, 0.09230665950590763, 70.28316247860164, 0.15469396408851369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49547e7d-6f5b-49b9-9acc-460f568b8e21", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1003.8181818181818, 133, 2005, 975.0, 1816.2999999999997, 1986.9999999999998, 2005.0, 0.10120619381906173, 0.03168084511772121, 0.04566138822695949], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 236.25, 160, 479, 165.5, 333.90000000000003, 471.7999999999999, 479.0, 0.09872301776520705, 0.15300139569666366, 0.22203038077467954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 85.0, 82, 93, 84.0, 89.5, 93.0, 93.0, 0.09931719428926132, 0.07710661080074488, 0.03530415890751087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 275.57142857142856, 159, 970, 162.5, 722.5, 970.0, 970.0, 0.10014807608392409, 8.70211753941542, 0.22340509717940096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 81.1818181818182, 78, 93, 80.0, 91.0, 93.0, 93.0, 0.056629222738177366, 0.04208480322632126, 0.028425215319749182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 80.00000000000001, 78, 82, 79.0, 82.0, 82.0, 82.0, 0.05663068044336674, 0.015153131290510241, 0.0322971849403576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 94.27272727272727, 77, 233, 80.0, 203.0000000000001, 233.0, 233.0, 0.05663068044336674, 0.015263738088251192, 0.03329264612002615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 80.90909090909092, 78, 88, 80.0, 87.2, 88.0, 88.0, 0.05663068044336674, 0.015263738088251192, 0.03334794951889663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 99.5, 87, 112, 99.5, 112.0, 112.0, 112.0, 0.04618084418583172, 0.013619741156368338, 0.028547338251593238], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 957.3859649122809, 624, 1502, 925.0, 1343.2, 1431.4999999999998, 1502.0, 0.2593467192640013, 310.2688397476147, 0.5121084632341901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1003.8181818181818, 133, 2005, 975.0, 1816.2999999999997, 1986.9999999999998, 2005.0, 0.10011148779322428, 0.03133816636709062, 0.04516748765670861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.028250316638965663, 0.007614343156596213, 0.016635684505172162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 105.83333333333334, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.028229183329726272, 0.007608647069340284, 0.01659567223095236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 110.375, 77, 242, 81.0, 237.8, 242.0, 242.0, 0.10305891749489536, 0.027777598856046016, 0.06058737141789747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 134.31249999999997, 77, 324, 81.5, 263.1000000000001, 324.0, 324.0, 0.10306090899721736, 0.02777813562815624, 0.06068918762238483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 79.5, 78, 81, 79.5, 81.0, 81.0, 81.0, 0.02825018362619357, 0.007559131165602576, 0.01611143284931352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 102.43749999999999, 77, 243, 81.0, 236.70000000000002, 243.0, 243.0, 0.10306024515455815, 0.07659067047130738, 0.05173141211859658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 82.5, 80, 86, 83.0, 86.0, 86.0, 86.0, 0.02824965158763042, 0.020994125838073, 0.0141800008945723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 80.62500000000001, 77, 92, 79.5, 86.4, 92.0, 92.0, 0.10305891749489536, 0.0275763119078138, 0.05877578888380751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 86.16666666666666, 82, 95, 83.5, 95.0, 95.0, 95.0, 0.027872363158310376, 0.021938598345310707, 0.009907754091430642], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 425.0, 79, 719, 449.0, 700.7, 719.0, 719.0, 0.08936550491510277, 0.0174396550119154, 0.06081334245606196], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1409.7272727272723, 795, 2717, 1318.5, 2222.9, 2648.599999999999, 2717.0, 0.10025154022820895, 0.051888004219678464, 0.046111792429185956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 190.16666666666666, 159, 325, 164.5, 325.0, 325.0, 325.0, 0.028217898613090285, 0.04373223154196707, 0.06346271533783879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3d9d007-4655-4037-8909-880296d3e8a6", 3, 0, 0.0, 285.6666666666667, 176, 483, 198.0, 483.0, 483.0, 483.0, 0.03568285082189499, 0.029747324529581082, 0.022882557330446987], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 868.6166666666668, 407, 1895, 738.5, 1555.9999999999998, 1692.0499999999997, 1895.0, 0.2728202796407866, 71.7565824997158, 0.9946039843128339], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 155.35087719298244, 79, 445, 82.0, 324.0, 348.99999999999955, 445.0, 0.2600839569264464, 0.19328505002053295, 0.12572417839706151], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 500.91228070175436, 387, 884, 468.0, 647.8000000000002, 722.7999999999996, 884.0, 0.2600305649962364, 76.45761993624689, 0.1307770907940056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d2e9340-4c7d-45ca-b4da-cbb08af426f1", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 136.3508771929825, 78, 553, 84.0, 242.4, 247.2, 553.0, 0.2603964421622955, 0.4607796417949995, 0.12663811347346013], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 797.6842105263157, 540, 1199, 794.0, 1007.6, 1113.1999999999996, 1199.0, 0.2597639338285558, 233.73604427522443, 0.1303893183475368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 84.64285714285714, 80, 95, 83.0, 93.5, 95.0, 95.0, 0.10436857015058894, 0.07797066031757866, 0.03709976517071716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60d36f42-00be-42ee-b367-44fff6314a4c", 3, 0, 0.0, 536.6666666666666, 185, 982, 443.0, 982.0, 982.0, 982.0, 0.02065091690071039, 0.024408684657057107, 0.013242938246874829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, 6.779661016949152, 153.2090395480226, 79, 1090, 86.0, 323.40000000000055, 448.79999999999995, 706.2399999999994, 0.7401584022614557, 1.5615656545592922, 0.35567198646806447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 131.9090909090909, 82, 269, 89.0, 263.20000000000005, 269.0, 269.0, 0.05789504155285028, 0.04483473432754909, 0.02057987805198975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17d5991b-f56b-4055-af09-097973245756", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c29a2c3a-604d-484d-adb1-7f5fde126fea", 3, 0, 0.0, 321.0, 179, 506, 278.0, 506.0, 506.0, 506.0, 0.044217135613954926, 0.036862006610461774, 0.028355389700355213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fb335ac-ac4b-457c-acf2-60c44ae1070c", 3, 0, 0.0, 287.6666666666667, 169, 489, 205.0, 489.0, 489.0, 489.0, 0.03808846681224925, 0.03175278759966482, 0.024425221230511402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0495a9c2-b995-4f58-a03f-256f9689c4f8", 3, 0, 0.0, 321.0, 211, 455, 297.0, 455.0, 455.0, 455.0, 0.04631416441528367, 0.029775545156310302, 0.0297001640293323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 99.87500000000001, 79, 235, 82.0, 201.40000000000003, 235.0, 235.0, 0.10456559530500477, 0.08485743134615133, 0.037169801456075915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfa91eb6-33f8-4b3f-8966-df91c937b972", 2, 0, 0.0, 201.0, 198, 204, 201.0, 204.0, 204.0, 204.0, 0.013337156651573452, 0.0262119411731363, 0.008290136922584474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbb4c3ba-a9fc-4acb-92b5-31676b762d1d", 3, 0, 0.0, 368.6666666666667, 185, 516, 405.0, 516.0, 516.0, 516.0, 0.05262603936427744, 0.03383347257306248, 0.03374781821211802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 177.18181818181822, 158, 312, 164.0, 284.4000000000001, 312.0, 312.0, 0.05660620095201338, 0.0877285555769973, 0.1273086726489129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 248.0625, 160, 559, 165.5, 507.20000000000005, 559.0, 559.0, 0.10300517601009451, 0.15963790461720703, 0.2316610550305153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfc3000e-0391-4bc8-a42f-ede3b259ac60", 3, 0, 0.0, 265.3333333333333, 206, 375, 215.0, 375.0, 375.0, 375.0, 0.02112705812757926, 0.02497146746785166, 0.013548276208115608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49547e7d-6f5b-49b9-9acc-460f568b8e21", 3, 0, 0.0, 345.0, 199, 427, 409.0, 427.0, 427.0, 427.0, 0.08409957389549227, 0.03805286709464006, 0.053931041853554615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 94.5625, 80, 243, 83.5, 140.1000000000001, 243.0, 243.0, 0.07446640169038732, 0.061740209995252766, 0.02647047872587987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85df6613-217d-4611-9f32-714036afa4ef", 3, 0, 0.0, 647.3333333333334, 189, 1095, 658.0, 1095.0, 1095.0, 1095.0, 0.018815029445521082, 0.025938037012298756, 0.012065627606665538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 82.61111111111111, 80, 87, 82.0, 86.1, 87.0, 87.0, 0.09026221172506131, 0.07007661945451536, 0.03208539557414288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71889740-f08b-48d2-8370-5b4257aba0a9", 2, 0, 0.0, 217.0, 162, 272, 217.0, 272.0, 272.0, 272.0, 0.03037528666676792, 0.034557821256625605, 0.018880732386130642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 91.0, 78, 234, 80.0, 160.0, 234.0, 234.0, 0.10020685558044821, 0.07447013388351668, 0.050299144305029665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 135.2857142857143, 78, 238, 80.5, 237.5, 238.0, 238.0, 0.10031671419768125, 0.037604772746814945, 0.05661008774129753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 183.35714285714286, 78, 891, 81.0, 565.5, 891.0, 891.0, 0.10031671419768125, 6.472618295350321, 0.05835947240573812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 107.2142857142857, 77, 460, 80.0, 273.0, 460.0, 460.0, 0.10031671419768125, 2.131996083169722, 0.05845743794694679], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5259203606311045], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15026296018031554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15026296018031554], "isController": false}, {"data": ["401/Unauthorized", 16, 59.25925925925926, 1.2021036814425243], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 27, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
