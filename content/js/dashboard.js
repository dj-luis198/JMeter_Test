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

    var data = {"OkPercent": 98.19466248037676, "KoPercent": 1.805337519623234};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6851478494623656, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9cbb6eac-1a98-4fc3-bfa0-84c65dca11eb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b7a426a9-274e-4bf0-be94-147a1097e29b"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bdb7eae-104d-482d-82bb-d59b293aa5ba"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22538ce6-11de-4e0d-8eb4-82f331b6b686"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e004005-98c0-43f9-834e-69eefb81d8f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09d48352-4587-40b9-88c3-bb5931a09785"], "isController": false}, {"data": [0.6, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/51979bab-d1ff-4a2c-a9f7-01d2c90d51d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=187fbcf9-4981-4f82-9c91-7d47dfc749b9"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/187fbcf9-4981-4f82-9c91-7d47dfc749b9"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2997ef7b-1bbb-426c-9632-6af7acb79a20"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09d48352-4587-40b9-88c3-bb5931a09785"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e74dce0-7792-449d-b3c8-7dd87ec0350d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a36266e7-673c-4451-9795-91cbcf90acab"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4b2b7c3-6f7c-43d4-be56-398141a0ee25"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22538ce6-11de-4e0d-8eb4-82f331b6b686"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4b2b7c3-6f7c-43d4-be56-398141a0ee25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e62a435d-e5b3-4b47-ab1c-c34511c2554b"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8bdb7eae-104d-482d-82bb-d59b293aa5ba"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e004005-98c0-43f9-834e-69eefb81d8f6"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/444d5a1d-931c-4578-9399-fcf92ce616b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7a426a9-274e-4bf0-be94-147a1097e29b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.043478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c37a592d-924f-4bb7-bc4d-3faf4dbde8ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8963414634146342, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/755879fa-2d1b-485c-939a-e9d82c7077e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8c6e4923-8a4c-4cd0-b3ed-bc6760fe9dab"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/c37a592d-924f-4bb7-bc4d-3faf4dbde8ba"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2997ef7b-1bbb-426c-9632-6af7acb79a20"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/0e74dce0-7792-449d-b3c8-7dd87ec0350d"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a36266e7-673c-4451-9795-91cbcf90acab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e62a435d-e5b3-4b47-ab1c-c34511c2554b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd2eabf9-794e-4e0b-9ee5-f98b9d7b89d6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 23, 1.805337519623234, 556.0086342229193, 138, 5033, 171.5, 1525.0, 1815.25, 2907.75, 4.9664356273536, 740.098520728729, 3.6144865255221776], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9cbb6eac-1a98-4fc3-bfa0-84c65dca11eb", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.6013859463276836, 1.1236905602636533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7a426a9-274e-4bf0-be94-147a1097e29b", 3, 0, 0.0, 655.0, 377, 1004, 584.0, 1004.0, 1004.0, 1004.0, 0.021303035682584768, 0.025179466980294694, 0.013661126398011718], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2324.500000000001, 1683, 2949, 2284.0, 2688.0, 2835.85, 2949.0, 0.25467626553638917, 306.4601523310837, 1.252241207984101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bdb7eae-104d-482d-82bb-d59b293aa5ba", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 0.179765236318408, 0.6860230099502488], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 774.0000000000001, 154, 1860, 736.0, 1536.0000000000002, 1860.0, 1860.0, 0.08411183509594357, 0.01711807268944789, 0.056364786369957495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 774.0000000000001, 154, 1860, 736.0, 1536.0000000000002, 1860.0, 1860.0, 0.0874742679861674, 0.017802380320622348, 0.058618010441511784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 229.62500000000003, 139, 421, 143.0, 421.0, 421.0, 421.0, 0.08782908460136574, 0.03999053778846365, 0.04916799096458292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 142.37500000000003, 140, 145, 142.5, 145.0, 145.0, 145.0, 0.08782956672576865, 0.06527177761553705, 0.044086325485395594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22538ce6-11de-4e0d-8eb4-82f331b6b686", 3, 0, 0.0, 369.3333333333333, 263, 553, 292.0, 553.0, 553.0, 553.0, 0.08185985592665357, 0.03799874822636978, 0.05249476438004802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 362.4375, 140, 1133, 168.0, 1113.4, 1133.0, 1133.0, 0.08735388697498948, 3.2312194261395586, 0.0505014659074158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 333.75, 139, 1540, 141.5, 1339.8000000000002, 1540.0, 1540.0, 0.08716021136351255, 9.823919775153893, 0.05030437980062102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e004005-98c0-43f9-834e-69eefb81d8f6", 1, 0, 0.0, 1084.0, 1084, 1084, 1084.0, 1084.0, 1084.0, 1084.0, 0.9225092250922509, 0.16666426429889297, 0.6360268680811808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09d48352-4587-40b9-88c3-bb5931a09785", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 491.06666666666666, 142, 2222, 318.0, 1423.4000000000005, 2222.0, 2222.0, 0.08348871510867448, 0.1422406370884702, 0.053957843416914814], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/51979bab-d1ff-4a2c-a9f7-01d2c90d51d4", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.6141075721153846, 1.1474609375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 162.35714285714283, 139, 426, 141.0, 291.0, 426.0, 426.0, 0.07104759681503774, 0.05280002067992551, 0.03566256324504824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 170.21428571428572, 138, 422, 142.0, 337.5, 422.0, 422.0, 0.0709467848437397, 0.026595146606463255, 0.04003623670381238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1062.0, 845, 1124, 1110.0, 1124.0, 1124.0, 1124.0, 0.03683946833279302, 10.832026875313137, 0.021010009283546023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1432.6, 1241, 1558, 1551.0, 1558.0, 1558.0, 1558.0, 0.03672285263119239, 33.043287349436305, 0.020907639730454262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 202.6, 139, 449, 142.0, 449.0, 449.0, 449.0, 0.037108505269407746, 0.06566465971500668, 0.020547385241947453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 177.125, 140, 426, 141.5, 426.0, 426.0, 426.0, 0.14041246160596754, 0.1043494953927161, 0.07048047389205792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 209.50000000000003, 139, 419, 140.5, 419.0, 419.0, 419.0, 0.13973799126637554, 0.06362581877729258, 0.07822734716157205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 346.125, 139, 1508, 142.0, 1508.0, 1508.0, 1508.0, 0.14041739069383743, 15.826592887200954, 0.08104167763677532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 384.875, 140, 1108, 280.5, 1108.0, 1108.0, 1108.0, 0.13972578814077372, 5.16845553881757, 0.08077897126888481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 196.2, 139, 421, 140.0, 421.0, 421.0, 421.0, 0.037108229863219065, 0.027577502857333697, 0.02083714079233492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 845.0909090909091, 138, 1797, 424.5, 1684.9, 1780.4999999999998, 1797.0, 0.11639103154196954, 47.621136363335765, 0.063878671607995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 257.21428571428567, 138, 1694, 141.0, 956.5, 1694.0, 1694.0, 0.07104795737122557, 4.584144450964222, 0.04133230778990104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 568.5909090909091, 138, 1274, 280.0, 1134.6, 1253.4499999999998, 1274.0, 0.11638918427053078, 15.572695130435244, 0.0639913190862391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 280.78571428571433, 141, 1128, 144.0, 777.0, 1128.0, 1128.0, 0.07094570626450587, 1.507784311750636, 0.0413421058966017], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 878.8571428571429, 144, 1988, 803.5, 1803.5, 1988.0, 1988.0, 0.08549513899066882, 0.016841397356978847, 0.05807419527700425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=187fbcf9-4981-4f82-9c91-7d47dfc749b9", 1, 0, 0.0, 1065.0, 1065, 1065, 1065.0, 1065.0, 1065.0, 1065.0, 0.9389671361502347, 0.16963761737089203, 0.6473738262910799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 646.9999999999999, 283, 1649, 560.0, 1649.0, 1649.0, 1649.0, 0.13937525043990312, 21.031660639775954, 0.30900064678827155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/187fbcf9-4981-4f82-9c91-7d47dfc749b9", 3, 0, 0.0, 619.0, 364, 1114, 379.0, 1114.0, 1114.0, 1114.0, 0.024014408645187113, 0.02408476335801481, 0.01539986491895137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 844.1739130434783, 181, 2422, 795.0, 1405.8000000000002, 2236.199999999997, 2422.0, 0.10634067854599928, 0.0653205925834312, 0.04808177164726334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 167.18181818181816, 139, 422, 142.0, 336.6999999999998, 421.4, 422.0, 0.11639164731214653, 0.08649808945756202, 0.0584231510922298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 192.59090909090907, 138, 424, 142.0, 423.1, 424.0, 424.0, 0.11638856852641491, 0.11060220503433463, 0.06193475494915936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2997ef7b-1bbb-426c-9632-6af7acb79a20", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["login", 23, 0, 0.0, 4967.91304347826, 1920, 8271, 4688.0, 8011.8, 8250.6, 8271.0, 0.10262496820856963, 26.83205002158471, 0.19183356935216875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 148.21428571428572, 143, 154, 147.5, 153.5, 154.0, 154.0, 0.07173049827078264, 0.0580708819008582, 0.025497950557192263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09d48352-4587-40b9-88c3-bb5931a09785", 3, 0, 0.0, 424.6666666666667, 286, 643, 345.0, 643.0, 643.0, 643.0, 0.061927173643794894, 0.028020433387003548, 0.039712412785897114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e74dce0-7792-449d-b3c8-7dd87ec0350d", 1, 0, 0.0, 1619.0, 1619, 1619, 1619.0, 1619.0, 1619.0, 1619.0, 0.6176652254478073, 0.11158990889437925, 0.42585121988882024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 1014.0454545454546, 281, 1943, 844.0, 1828.0, 1925.7499999999998, 1943.0, 0.11630181377965035, 63.34258929468236, 0.24803963711190877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a36266e7-673c-4451-9795-91cbcf90acab", 1, 0, 0.0, 1988.0, 1988, 1988, 1988.0, 1988.0, 1988.0, 1988.0, 0.5030181086519115, 0.09087729502012072, 0.3468074069416499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4b2b7c3-6f7c-43d4-be56-398141a0ee25", 3, 0, 0.0, 2056.3333333333335, 891, 3287, 1991.0, 3287.0, 3287.0, 3287.0, 0.06947339169098236, 0.03220381177342411, 0.04455162162475105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 590.75, 284, 1685, 558.5, 1484.1000000000001, 1685.0, 1685.0, 0.08709331504373719, 13.142340840368838, 0.19308945163871513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 885.8000000000001, 139, 1700, 763.0, 1699.5, 1700.0, 1700.0, 0.0660358046132613, 39.5097249072197, 0.0962162309404159], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1760.0869565217392, 391, 3407, 1815.0, 2668.8, 3268.399999999998, 3407.0, 0.10692303401082247, 0.033849275712665265, 0.048240665735351546], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22538ce6-11de-4e0d-8eb4-82f331b6b686", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.5610685170807453, 2.1411587732919255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4b2b7c3-6f7c-43d4-be56-398141a0ee25", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.5236639492753623, 1.9984148550724639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 165.875, 143, 424, 147.0, 239.2000000000002, 424.0, 424.0, 0.07629838390485591, 0.059235561723008257, 0.02712169115367925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 484.71428571428567, 282, 2121, 288.0, 1345.5, 2121.0, 2121.0, 0.07089433199815676, 6.160186336573373, 0.15814737285861138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e62a435d-e5b3-4b47-ab1c-c34511c2554b", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 521.923076923077, 282, 1667, 562.0, 1228.9999999999995, 1667.0, 1667.0, 0.07126489710445241, 6.660227129449944, 0.15887382447181747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 163.76923076923075, 139, 421, 142.0, 314.5999999999999, 421.0, 421.0, 0.07113114942465844, 0.0528621139767237, 0.035704502738549256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 187.46153846153845, 138, 428, 141.0, 425.2, 428.0, 428.0, 0.07113114942465844, 0.02725126668162245, 0.04010745249259962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 294.61538461538464, 138, 1530, 144.0, 1086.7999999999997, 1530.0, 1530.0, 0.0705942405960326, 4.903780771282806, 0.0410350235676157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 242.69230769230768, 139, 1112, 142.0, 839.9999999999998, 1112.0, 1112.0, 0.07075561554664156, 1.6179500363302872, 0.04119792488747136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 160.5, 144, 177, 160.5, 177.0, 177.0, 177.0, 0.05072537283149031, 0.014960022065537183, 0.031356602541341184], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1579.3749999999998, 1106, 2367, 1513.5, 2110.6, 2251.1, 2367.0, 0.25620144753817864, 306.50600129015726, 0.5058977801974581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bdb7eae-104d-482d-82bb-d59b293aa5ba", 3, 0, 0.0, 1304.0, 318, 2850, 744.0, 2850.0, 2850.0, 2850.0, 0.04363192111348663, 0.028051121158572945, 0.02798010566196896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1760.0869565217392, 391, 3407, 1815.0, 2668.8, 3268.399999999998, 3407.0, 0.10371572871572872, 0.03283391955266955, 0.04679361979166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 175.125, 138, 420, 140.5, 420.0, 420.0, 420.0, 0.04064297181409905, 0.010954550996768883, 0.023933312503810276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 245.5, 139, 424, 142.5, 424.0, 424.0, 424.0, 0.04058585684353645, 0.010939156727359433, 0.02386004474590717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 416.0625, 139, 1677, 146.0, 1614.0, 1677.0, 1677.0, 0.07731223997719289, 8.713944485583683, 0.04462063850246191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e004005-98c0-43f9-834e-69eefb81d8f6", 3, 0, 0.0, 506.66666666666663, 268, 825, 427.0, 825.0, 825.0, 825.0, 0.022266259936318495, 0.022331493119725678, 0.01427881903468341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 247.5, 140, 852, 142.5, 841.5, 852.0, 852.0, 0.07731261355290116, 2.859792820315822, 0.04469635471027098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 142.68749999999997, 141, 146, 142.5, 146.0, 146.0, 146.0, 0.07731261355290116, 0.057455955970466585, 0.03880730797479609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 212.5, 140, 426, 142.0, 426.0, 426.0, 426.0, 0.04058379793327009, 0.010859336556363286, 0.0231454472588181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/444d5a1d-931c-4578-9399-fcf92ce616b5", 1, 0, 0.0, 2872.0, 2872, 2872, 2872.0, 2872.0, 2872.0, 2872.0, 0.34818941504178275, 0.11118939327994429, 0.20775755135793872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 212.43749999999997, 139, 431, 142.0, 425.4, 431.0, 431.0, 0.07731298713221971, 0.03520232446327875, 0.043280927610883736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 210.75, 140, 423, 141.5, 423.0, 423.0, 423.0, 0.04064173296349356, 0.030203475376190038, 0.020400244866441104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7a426a9-274e-4bf0-be94-147a1097e29b", 1, 0, 0.0, 1421.0, 1421, 1421, 1421.0, 1421.0, 1421.0, 1421.0, 0.7037297677691766, 0.127138678747361, 0.4851886875439831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 198.12500000000003, 146, 505, 153.5, 505.0, 505.0, 505.0, 0.039575552202626825, 0.031150288159489475, 0.014067872072027504], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 822.4285714285714, 139, 1991, 784.5, 1552.5, 1991.0, 1991.0, 0.08557666446612387, 0.01652317293821365, 0.058237021381940875], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 2880.8260869565215, 1243, 5033, 2519.0, 4914.8, 5023.599999999999, 5033.0, 0.10603769409508354, 0.05488279088905691, 0.04877319718631284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 459.50000000000006, 284, 844, 286.0, 844.0, 844.0, 844.0, 0.04055396719184054, 0.06285072845063569, 0.09120682269805544], "isController": false}, {"data": ["addBook", 54, 8, 14.814814814814815, 1701.6851851851854, 720, 4537, 1365.5, 2749.0, 3436.25, 4537.0, 0.25072897126831717, 101.01607081294225, 0.9056459579239641], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 234.55357142857147, 139, 572, 143.0, 566.0, 570.15, 572.0, 0.25739670807995846, 0.19128798325082852, 0.12442516650349554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c37a592d-924f-4bb7-bc4d-3faf4dbde8ba", 1, 0, 0.0, 1579.0, 1579, 1579, 1579.0, 1579.0, 1579.0, 1579.0, 0.6333122229259025, 0.11441675902469918, 0.4366390911969601], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 895.2321428571431, 690, 1420, 836.0, 1132.4, 1266.9, 1420.0, 0.2572819994486814, 75.64945040430028, 0.12939475558210053], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 203.89285714285717, 138, 444, 143.0, 423.3, 429.09999999999997, 444.0, 0.25794445903058943, 0.45644078101897273, 0.1254456451144859], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1343.232142857143, 962, 1802, 1322.0, 1659.6000000000001, 1720.3, 1802.0, 0.2569137320389775, 231.17142769484153, 0.12895865065237735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 152.6153846153846, 145, 200, 147.0, 182.0, 200.0, 200.0, 0.06916475576860664, 0.05167093570603915, 0.024585909277121894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 8, 4.878048780487805, 277.6341463414633, 141, 3053, 152.0, 499.5, 663.75, 2915.199999999999, 0.7070306437427788, 1.6546191007130664, 0.3359928041309559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 191.3076923076923, 142, 424, 148.0, 424.0, 424.0, 424.0, 0.06924396245911943, 0.05362349827156417, 0.02461406478039011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/755879fa-2d1b-485c-939a-e9d82c7077e8", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.6838028640256959, 1.2776866970021412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 148.0, 141, 159, 145.5, 159.0, 159.0, 159.0, 0.08678483868868109, 0.07042793061552147, 0.030849298127617105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c6e4923-8a4c-4cd0-b3ed-bc6760fe9dab", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.486792587652439, 0.9095726943597561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c37a592d-924f-4bb7-bc4d-3faf4dbde8ba", 3, 0, 0.0, 1614.3333333333333, 550, 3280, 1013.0, 3280.0, 3280.0, 3280.0, 0.020350986683671045, 0.024054177294404157, 0.013050600184515612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 482.53846153846155, 282, 1951, 302.0, 1400.9999999999995, 1951.0, 1951.0, 0.07054061240103965, 6.592537413655577, 0.1572591462008454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2997ef7b-1bbb-426c-9632-6af7acb79a20", 3, 0, 0.0, 753.0, 552, 1059, 648.0, 1059.0, 1059.0, 1059.0, 0.03391248318506042, 0.028271441874003822, 0.02174726298000294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e74dce0-7792-449d-b3c8-7dd87ec0350d", 3, 0, 0.0, 1260.0, 704, 2222, 854.0, 2222.0, 2222.0, 2222.0, 0.02249246502421689, 0.022558360917842524, 0.014423878938055752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 577.75, 285, 1821, 425.5, 1756.6000000000001, 1821.0, 1821.0, 0.07725885579634566, 11.658325501820412, 0.1712860521207556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 151.375, 144, 169, 149.0, 169.0, 169.0, 169.0, 0.1379167672309761, 0.11434700720615108, 0.049025100851636035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 182.77272727272728, 141, 425, 147.5, 362.6999999999999, 424.25, 425.0, 0.11373858736674491, 0.08830290718414278, 0.04043051347802261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a36266e7-673c-4451-9795-91cbcf90acab", 3, 0, 0.0, 665.3333333333334, 250, 1039, 707.0, 1039.0, 1039.0, 1039.0, 0.020491523339845084, 0.028249219187579406, 0.01314072297509597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 142.30769230769232, 140, 147, 141.0, 147.0, 147.0, 147.0, 0.07186529127555363, 0.05340770181708625, 0.03607300753479938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e62a435d-e5b3-4b47-ab1c-c34511c2554b", 3, 0, 0.0, 835.0, 286, 1265, 954.0, 1265.0, 1265.0, 1265.0, 0.044454323182929543, 0.028579846447358673, 0.02850749240571979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 227.84615384615384, 138, 430, 142.0, 428.0, 430.0, 430.0, 0.07186529127555363, 0.02753252595442635, 0.040521399963514546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 311.84615384615387, 138, 1524, 141.0, 1084.3999999999996, 1524.0, 1524.0, 0.07132041519454016, 4.9542239944507225, 0.04145713437314841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 282.8461538461538, 140, 1140, 142.0, 853.9999999999998, 1140.0, 1140.0, 0.07147098278099091, 1.6343081505783652, 0.0416144521886614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd2eabf9-794e-4e0b-9ee5-f98b9d7b89d6", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.3924646781789639], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.043478260869565, 0.23547880690737832], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.15698587127158556], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 1.0204081632653061], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 23, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
