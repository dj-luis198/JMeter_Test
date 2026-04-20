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

    var data = {"OkPercent": 98.07544264819091, "KoPercent": 1.924557351809084};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8162590879048248, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/81406158-72d3-4cd2-a137-e6c113cea614"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac2b3c9f-400b-4bf8-adbb-b9ed0310d964"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b5da2cf-2e09-49d7-a866-c0b1aa184088"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09e670a3-371a-4a81-969f-cf769ff6c741"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6294d17e-639e-46cd-b400-00b544c55f31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16a206e9-cea8-40be-87f8-dc12a859b231"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3b47543-b7dc-4b46-a143-b6011a2542b0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de3037b2-e7cf-4092-91cb-9db0e8b591f8"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c459ef00-83c8-42b9-8c8a-464e5509d94a"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac2b3c9f-400b-4bf8-adbb-b9ed0310d964"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c586c061-ff74-47db-8f18-e07ee0f78ac3"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29737b48-bc97-4272-9f74-2ab6cf0c9bd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b5da2cf-2e09-49d7-a866-c0b1aa184088"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3c0ad7a-06ce-4bc7-a128-45419bad5963"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81406158-72d3-4cd2-a137-e6c113cea614"], "isController": false}, {"data": [0.3389830508474576, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6294d17e-639e-46cd-b400-00b544c55f31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8660714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9224137931034483, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e268d865-9d7a-4bd2-a5cf-dfbfb9b23072"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3b47543-b7dc-4b46-a143-b6011a2542b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=777b83eb-6915-4fb4-92b6-bebbf6e69817"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de3037b2-e7cf-4092-91cb-9db0e8b591f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/777b83eb-6915-4fb4-92b6-bebbf6e69817"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2161b2a9-d8f3-45b6-a5e4-17aeeb4aa7e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e268d865-9d7a-4bd2-a5cf-dfbfb9b23072"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09e670a3-371a-4a81-969f-cf769ff6c741"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/29737b48-bc97-4272-9f74-2ab6cf0c9bd9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c586c061-ff74-47db-8f18-e07ee0f78ac3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dd70c2d-4b79-4a09-97b1-774759a4fc17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c459ef00-83c8-42b9-8c8a-464e5509d94a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 25, 1.924557351809084, 298.69976905311796, 78, 2649, 93.0, 838.0, 1041.0, 1443.0, 5.093678192469669, 697.6009323153983, 3.7230320447843717], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1340.5892857142853, 976, 1818, 1307.0, 1706.0, 1774.3, 1818.0, 0.24824125503685937, 298.7188224845071, 1.2206003116314328], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/81406158-72d3-4cd2-a137-e6c113cea614", 3, 0, 0.0, 853.3333333333334, 175, 1362, 1023.0, 1362.0, 1362.0, 1362.0, 0.0789162172826516, 0.03570753321057477, 0.0506070794423254], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 477.85714285714295, 86, 940, 421.0, 918.0, 940.0, 940.0, 0.06987457513762796, 0.013764355481909971, 0.047015217060376625], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 477.85714285714295, 86, 940, 421.0, 918.0, 940.0, 940.0, 0.06979306356652526, 0.013748298794075567, 0.04696037187239834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac2b3c9f-400b-4bf8-adbb-b9ed0310d964", 1, 0, 0.0, 1091.0, 1091, 1091, 1091.0, 1091.0, 1091.0, 1091.0, 0.9165902841429882, 0.16559492438130155, 0.6319460357470211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b5da2cf-2e09-49d7-a866-c0b1aa184088", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 135.77777777777777, 79, 244, 83.0, 242.2, 244.0, 244.0, 0.1108285666787757, 0.038903039627369726, 0.062689813161508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 99.55555555555554, 80, 244, 82.0, 240.4, 244.0, 244.0, 0.11093785631082322, 0.08244502798099265, 0.05568560365601869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 171.27777777777777, 80, 638, 84.0, 358.1000000000004, 638.0, 638.0, 0.11082924907026574, 1.8386278992623697, 0.06473457549319016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 166.16666666666669, 80, 864, 82.0, 380.7000000000008, 864.0, 864.0, 0.11093922379523084, 5.573979753976863, 0.06469047186149854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09e670a3-371a-4a81-969f-cf769ff6c741", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 242.71428571428572, 80, 442, 206.5, 440.0, 442.0, 442.0, 0.06947511550237952, 0.14164956410568158, 0.04490488422468252], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 92.11111111111111, 80, 245, 82.5, 104.60000000000022, 245.0, 245.0, 0.10771734967445423, 0.08005166318580045, 0.05406906028581003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 560.5, 478, 648, 558.0, 648.0, 648.0, 648.0, 0.021796345842619486, 6.408849384525684, 0.012430728488368925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 108.61111111111113, 79, 243, 81.0, 240.3, 243.0, 243.0, 0.10771863891515361, 0.0378113928917667, 0.06093069278045744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 788.75, 548, 1034, 786.5, 1034.0, 1034.0, 1034.0, 0.021768944423884887, 19.587734458334243, 0.0123938423819579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 83.25, 81, 87, 82.5, 87.0, 87.0, 87.0, 0.021843241973973776, 0.03865229927425829, 0.012094841991448372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6294d17e-639e-46cd-b400-00b544c55f31", 3, 0, 0.0, 347.0, 319, 389, 333.0, 389.0, 389.0, 389.0, 0.0272111311667226, 0.02729085127756261, 0.017449846483868336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 106.00000000000001, 81, 242, 82.5, 241.5, 242.0, 242.0, 0.06721333512568894, 0.049950535186180936, 0.03373794360801183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 105.07142857142857, 80, 243, 81.5, 242.0, 243.0, 243.0, 0.06721043105890034, 0.017984041123182318, 0.038330948963279106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 130.28571428571428, 80, 246, 83.5, 245.5, 246.0, 246.0, 0.06721172172426872, 0.0181156593709943, 0.03951314109180641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 106.64285714285714, 79, 243, 82.0, 241.0, 243.0, 243.0, 0.06720946309240342, 0.018115050599124355, 0.03957744750460865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 81.5, 81, 82, 81.5, 82.0, 82.0, 82.0, 0.02184336125643014, 0.016233201089983725, 0.01226555929926497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 550.75, 80, 1033, 772.0, 983.3000000000001, 1033.0, 1033.0, 0.0850837543206594, 43.074195900358944, 0.04590700611539484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 165.77777777777777, 80, 1024, 82.0, 401.20000000000095, 1024.0, 1024.0, 0.10771863891515361, 5.41216615637455, 0.06281249625976948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16a206e9-cea8-40be-87f8-dc12a859b231", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 414.49999999999994, 80, 726, 479.5, 725.3, 726.0, 726.0, 0.08508330187023733, 14.082273143322823, 0.045989851157398794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 144.7222222222222, 78, 638, 82.0, 357.20000000000044, 638.0, 638.0, 0.10771863891515361, 1.7870237003446996, 0.06291769024308506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3b47543-b7dc-4b46-a143-b6011a2542b0", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 500.64285714285717, 83, 1091, 410.5, 998.5, 1091.0, 1091.0, 0.06962610780110805, 0.013715410744303092, 0.04729485475496583], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 249.57142857142858, 163, 488, 173.0, 486.5, 488.0, 488.0, 0.06718237134575888, 0.10411955402902279, 0.15109472774344013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 542.8, 107, 1763, 433.0, 1214.2000000000003, 1736.4499999999996, 1763.0, 0.08804948380990117, 0.05408508331682405, 0.03981143652732836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.37500000000001, 81, 89, 83.0, 86.9, 89.0, 89.0, 0.08508194454784264, 0.06322984355557446, 0.04270714794686632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 151.875, 79, 247, 82.5, 246.3, 247.0, 247.0, 0.08508556417046893, 0.09465145828680217, 0.044505815731257246], "isController": false}, {"data": ["login", 20, 0, 0.0, 2451.2499999999995, 1343, 4050, 2133.0, 3988.7000000000003, 4047.55, 4050.0, 0.08968087062189199, 21.582314567984824, 0.16505133669337663], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 86.05555555555556, 83, 105, 84.0, 93.30000000000001, 105.0, 105.0, 0.10650887573964497, 0.08622642381656805, 0.03786057692307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de3037b2-e7cf-4092-91cb-9db0e8b591f8", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 645.0625000000001, 163, 1117, 855.5, 1071.5, 1117.0, 1117.0, 0.08504350506806138, 57.287311716669585, 0.1790252984495506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 477.0, 80, 1117, 359.5, 1117.0, 1117.0, 1117.0, 0.04351823141907513, 26.03728934456104, 0.06348179509984715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 320.0, 163, 944, 321.5, 532.7000000000006, 944.0, 944.0, 0.11077195746356834, 7.524458053967482, 0.24755417056419848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c459ef00-83c8-42b9-8c8a-464e5509d94a", 3, 0, 0.0, 429.0, 172, 827, 288.0, 827.0, 827.0, 827.0, 0.021185094167743574, 0.0250400641025641, 0.013585493330226186], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1005.2608695652173, 347, 2239, 948.0, 1828.6000000000004, 2184.5999999999995, 2239.0, 0.09137390599611461, 0.028926793610183025, 0.04122533649434078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 102.41666666666667, 82, 244, 84.5, 202.90000000000015, 244.0, 244.0, 0.062144610508653636, 0.04824703647888637, 0.02209046701674797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 307.611111111111, 162, 1104, 247.0, 547.8000000000009, 1104.0, 1104.0, 0.10766516134820707, 7.3134212754583245, 0.24061107455812422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac2b3c9f-400b-4bf8-adbb-b9ed0310d964", 3, 0, 0.0, 541.0, 190, 1153, 280.0, 1153.0, 1153.0, 1153.0, 0.016906647130096653, 0.023307177928372173, 0.01084182774944349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 257.8333333333333, 162, 484, 244.0, 438.10000000000014, 484.0, 484.0, 0.11410748925487808, 0.17684432172606596, 0.25663041772850026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 102.9375, 81, 251, 82.0, 241.9, 251.0, 251.0, 0.07907638779060573, 0.05876672959829195, 0.03969263996520639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 101.6875, 80, 241, 82.0, 240.3, 241.0, 241.0, 0.07901546727771962, 0.02856015608024021, 0.04464875464215871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 177.12499999999997, 80, 963, 82.5, 461.1000000000005, 963.0, 963.0, 0.07901507706439234, 4.463585045223786, 0.046027825653232456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 156.68749999999997, 80, 636, 82.5, 360.90000000000026, 636.0, 636.0, 0.07907795109028724, 1.4732033087944567, 0.04614167556293616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.5, 83, 86, 84.5, 86.0, 86.0, 86.0, 0.0266584913959719, 0.007862172267171402, 0.01647932134145529], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 923.5535714285713, 634, 1463, 871.5, 1362.7, 1427.45, 1463.0, 0.2565841321041732, 306.9638250737679, 0.5066534327291388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c586c061-ff74-47db-8f18-e07ee0f78ac3", 3, 0, 0.0, 364.0, 176, 726, 190.0, 726.0, 726.0, 726.0, 0.03322001616707453, 0.027002076943094113, 0.02130320047172423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1005.2608695652173, 347, 2239, 948.0, 1828.6000000000004, 2184.5999999999995, 2239.0, 0.09274604921992508, 0.029361181342720845, 0.041844408925395885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 99.8888888888889, 81, 240, 81.0, 240.0, 240.0, 240.0, 0.04456151469539729, 0.0120107207577438, 0.02624081382941852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 117.33333333333333, 81, 241, 82.0, 241.0, 241.0, 241.0, 0.044561735332999945, 0.012010780226472641, 0.026197426436001918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 248.24999999999997, 80, 1138, 82.5, 1055.5000000000002, 1138.0, 1138.0, 0.06110259635115662, 9.177094816590374, 0.0350464761623496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 166.25, 80, 553, 81.0, 529.6000000000001, 553.0, 553.0, 0.06110352974723507, 3.008135521264028, 0.035106682943968064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 83.58333333333333, 81, 90, 83.0, 89.4, 90.0, 90.0, 0.06110197410294664, 0.04540879130111562, 0.030670326844643138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 80.88888888888889, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.0445619559727875, 0.01192380462553103, 0.02541424051573037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29737b48-bc97-4272-9f74-2ab6cf0c9bd9", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 114.33333333333334, 80, 318, 81.0, 295.2000000000001, 318.0, 318.0, 0.061102907480014255, 0.03164541855491624, 0.03399247033963033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 99.66666666666667, 81, 239, 83.0, 239.0, 239.0, 239.0, 0.04456107342674655, 0.03311618835718176, 0.02236757005990989], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 595.1428571428571, 81, 1362, 460.0, 1257.5, 1362.0, 1362.0, 0.06811226847910169, 0.013151141123755126, 0.04635207109947797], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 110.77777777777779, 83, 244, 86.0, 244.0, 244.0, 244.0, 0.04567971414649992, 0.03595493125203021, 0.016237710888013644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1329.0, 827, 2649, 1182.0, 2057.5, 2619.45, 2649.0, 0.08792986713797075, 0.045510575764770016, 0.04044430412303147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 218.22222222222223, 163, 480, 166.0, 480.0, 480.0, 480.0, 0.04454276848153702, 0.06903259138691334, 0.10017773028611306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b5da2cf-2e09-49d7-a866-c0b1aa184088", 3, 0, 0.0, 271.6666666666667, 201, 354, 260.0, 354.0, 354.0, 354.0, 0.01722316630689386, 0.0237435251659165, 0.011044803914251597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3c0ad7a-06ce-4bc7-a128-45419bad5963", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81406158-72d3-4cd2-a137-e6c113cea614", 1, 0, 0.0, 906.0, 906, 906, 906.0, 906.0, 906.0, 906.0, 1.1037527593818985, 0.19940845750551875, 0.7609857891832229], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 880.3389830508474, 426, 2545, 706.0, 1608.0, 1674.0, 2545.0, 0.2774042485165925, 79.80339304479374, 1.0097457710545124], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6294d17e-639e-46cd-b400-00b544c55f31", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 144.17857142857144, 81, 333, 84.0, 328.6, 331.15, 333.0, 0.2575280981549951, 0.19138562763276493, 0.12448868026047127], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 511.9821428571429, 395, 807, 479.0, 652.7, 750.8, 807.0, 0.2574002574002574, 75.68422216859717, 0.129454231016731], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 116.78571428571429, 80, 330, 84.0, 244.0, 247.15, 330.0, 0.25787200338917493, 0.4563125684972509, 0.12541040789825106], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 777.8035714285716, 552, 1132, 786.0, 1034.0, 1057.9499999999998, 1132.0, 0.25702811244979923, 231.27434738955824, 0.1290160642570281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 100.75, 83, 246, 87.0, 200.70000000000016, 246.0, 246.0, 0.10711034150347216, 0.08001895629898066, 0.03807437920631237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 146.60344827586212, 81, 2203, 87.0, 244.0, 317.75, 1110.25, 0.7465568284206462, 1.5802823454327026, 0.3586804661689621], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 96.125, 82, 244, 84.5, 146.7000000000001, 244.0, 244.0, 0.07929153017786081, 0.06140447600687854, 0.02818566111791146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e268d865-9d7a-4bd2-a5cf-dfbfb9b23072", 3, 0, 0.0, 414.0, 381, 442, 419.0, 442.0, 442.0, 442.0, 0.03798862873713135, 0.03129857400184878, 0.024361197464892174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3b47543-b7dc-4b46-a143-b6011a2542b0", 3, 0, 0.0, 321.0, 179, 513, 271.0, 513.0, 513.0, 513.0, 0.019292356368406836, 0.02659607070970148, 0.012371725926354644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=777b83eb-6915-4fb4-92b6-bebbf6e69817", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 84.50000000000001, 82, 88, 85.0, 87.1, 88.0, 88.0, 0.11855052228091205, 0.09620652735882608, 0.042141005967042955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de3037b2-e7cf-4092-91cb-9db0e8b591f8", 3, 0, 0.0, 685.3333333333334, 330, 1291, 435.0, 1291.0, 1291.0, 1291.0, 0.12211006186909802, 0.055251623046239005, 0.07830625712308693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/777b83eb-6915-4fb4-92b6-bebbf6e69817", 3, 0, 0.0, 311.0, 182, 485, 266.0, 485.0, 485.0, 485.0, 0.07054839619979306, 0.03192131208258866, 0.045240996260935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2161b2a9-d8f3-45b6-a5e4-17aeeb4aa7e4", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e268d865-9d7a-4bd2-a5cf-dfbfb9b23072", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 291.375, 164, 1047, 167.0, 658.5000000000005, 1047.0, 1047.0, 0.07898192301237054, 6.02037104997828, 0.17636917940250174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09e670a3-371a-4a81-969f-cf769ff6c741", 3, 0, 0.0, 306.0, 212, 391, 315.0, 391.0, 391.0, 391.0, 0.03739948887365206, 0.024044267749174092, 0.023983396185252134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 359.1666666666667, 163, 1227, 171.0, 1142.7000000000003, 1227.0, 1227.0, 0.06107616197398156, 12.256933973487856, 0.13475723498035383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29737b48-bc97-4272-9f74-2ab6cf0c9bd9", 3, 0, 0.0, 1292.6666666666667, 438, 2332, 1108.0, 2332.0, 2332.0, 2332.0, 0.01899263085922662, 0.02618287489870597, 0.01217951913824103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c586c061-ff74-47db-8f18-e07ee0f78ac3", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 88.14285714285714, 83, 104, 85.0, 99.5, 104.0, 104.0, 0.06563802504559499, 0.05442058912471694, 0.023332266715426344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dd70c2d-4b79-4a09-97b1-774759a4fc17", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.790435488861386, 1.4769299195544554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 85.375, 83, 92, 85.0, 89.2, 92.0, 92.0, 0.08581343087459976, 0.06662273197783869, 0.030503993006205384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c459ef00-83c8-42b9-8c8a-464e5509d94a", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 95.5, 80, 242, 82.0, 196.10000000000016, 242.0, 242.0, 0.11419870574800152, 0.08486837409592692, 0.05732239722116483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 107.08333333333334, 79, 241, 80.5, 240.4, 241.0, 241.0, 0.11419761897964428, 0.030556784766037626, 0.06512832957432838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 148.25, 81, 242, 83.0, 242.0, 242.0, 242.0, 0.11419761897964428, 0.030779826990607245, 0.06713570959545494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 148.24999999999997, 81, 241, 83.0, 241.0, 241.0, 241.0, 0.11419653223197122, 0.030779534078148495, 0.067246590757694], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.0, 0.3849114703618168], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15396458814472672], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15396458814472672], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.2317167051578137], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 25, "401/Unauthorized", 16, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
