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

    var data = {"OkPercent": 98.88475836431226, "KoPercent": 1.1152416356877324};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8157051282051282, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb6d3de9-85df-4693-9dd2-8b01d4268d10"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59c0280f-342e-403a-b9ad-e85ef8e852cb"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68cbf735-c807-4e11-9c91-f1d1b53cf62d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac723ee3-5d1c-4aa0-b7ec-db382a0a57c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0dc2c31-f407-4d93-aa60-f5089ef151a5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/04c3797b-0f12-45e5-b643-f1424afef6ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf6d37b6-26ef-4821-9dd0-d07899042a5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85110477-a9b7-49ba-ab00-996553c7c989"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4cac536-92fc-4797-bdb8-1baf72cfc749"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57669c5b-1aa1-4fa9-a5ed-76436de32a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b711c201-55cf-4cef-93da-92483de348fd"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7021be2b-ddb7-40c4-8a63-de909513d08a"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68cbf735-c807-4e11-9c91-f1d1b53cf62d"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac723ee3-5d1c-4aa0-b7ec-db382a0a57c6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cf6d37b6-26ef-4821-9dd0-d07899042a5e"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b711c201-55cf-4cef-93da-92483de348fd"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59c0280f-342e-403a-b9ad-e85ef8e852cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0dc2c31-f407-4d93-aa60-f5089ef151a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb6d3de9-85df-4693-9dd2-8b01d4268d10"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04c3797b-0f12-45e5-b643-f1424afef6ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c6860a7d-3977-467b-94c7-c973ac354275"], "isController": false}, {"data": [0.8135593220338984, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9548022598870056, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4cac536-92fc-4797-bdb8-1baf72cfc749"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef2c41d7-c990-4bf2-a353-d3ab11745bda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85110477-a9b7-49ba-ab00-996553c7c989"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d231bbd7-268d-4a84-8c58-2cf655ec4765"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9ceb8220-f685-4761-9f0b-7e737771b6c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57669c5b-1aa1-4fa9-a5ed-76436de32a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7021be2b-ddb7-40c4-8a63-de909513d08a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1345, 15, 1.1152416356877324, 321.3070631970261, 81, 2873, 99.0, 907.4000000000001, 1098.4000000000005, 1545.499999999999, 5.214835722981723, 754.8232611115742, 3.816192155791763], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/cb6d3de9-85df-4693-9dd2-8b01d4268d10", 3, 0, 0.0, 375.66666666666663, 166, 689, 272.0, 689.0, 689.0, 689.0, 0.024837109953885765, 0.02490987492445379, 0.01592744355766763], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1427.6779661016951, 1011, 1965, 1436.0, 1707.0, 1768.0, 1965.0, 0.2652412571536466, 319.176413428232, 1.3041891892271589], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/59c0280f-342e-403a-b9ad-e85ef8e852cb", 3, 0, 0.0, 286.3333333333333, 190, 473, 196.0, 473.0, 473.0, 473.0, 0.08576329331046312, 0.038805656803887936, 0.05499794525443111], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 555.6153846153846, 94, 1287, 478.0, 1160.6, 1287.0, 1287.0, 0.09782674131599543, 0.018533581850881945, 0.06613152382081151], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 555.6153846153846, 94, 1287, 478.0, 1160.6, 1287.0, 1287.0, 0.10001461752102231, 0.01894808183503743, 0.06761054259853364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 123.17391304347827, 81, 308, 84.0, 255.8, 298.1999999999999, 308.0, 0.1397275919468306, 0.04651258155838791, 0.07917817773957207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68cbf735-c807-4e11-9c91-f1d1b53cf62d", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 103.21739130434784, 83, 250, 86.0, 206.00000000000014, 249.6, 250.0, 0.1399137401376021, 0.1039788635202297, 0.07023013909250732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 138.3043478260869, 81, 493, 86.0, 255.20000000000002, 445.9999999999993, 493.0, 0.13991969826012896, 1.824813788934177, 0.0818713214046721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 163.08695652173913, 81, 900, 87.0, 251.0, 770.1999999999981, 900.0, 0.13992054946191423, 5.510019195350379, 0.08173517830744803], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 201.3846153846154, 84, 326, 190.0, 314.4, 326.0, 326.0, 0.0970344770961313, 0.2154264525314802, 0.06272398403036432], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 85.55000000000001, 84, 88, 85.0, 88.0, 88.0, 88.0, 0.10454236579373791, 0.07769212926663531, 0.05247536720505985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac723ee3-5d1c-4aa0-b7ec-db382a0a57c6", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 84.30000000000001, 82, 88, 84.0, 87.0, 87.95, 88.0, 0.10454400518538266, 0.03582469865190505, 0.059183749810514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 552.6666666666666, 483, 689, 493.5, 689.0, 689.0, 689.0, 0.0659681373896408, 19.39682274086616, 0.03762245335502952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0dc2c31-f407-4d93-aa60-f5089ef151a5", 3, 0, 0.0, 546.6666666666667, 162, 1283, 195.0, 1283.0, 1283.0, 1283.0, 0.0410913872452334, 0.03385491572841333, 0.02635092215921543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 870.0, 805, 902, 897.0, 902.0, 902.0, 902.0, 0.06567641231651652, 59.09575124922009, 0.03739194177786048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 194.16666666666669, 83, 251, 246.0, 251.0, 251.0, 251.0, 0.0661448572373498, 0.11704539190827914, 0.03662513091169662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04c3797b-0f12-45e5-b643-f1424afef6ef", 3, 0, 0.0, 1157.0, 187, 2860, 424.0, 2860.0, 2860.0, 2860.0, 0.024497395110319935, 0.02042247033773742, 0.015709592567490323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf6d37b6-26ef-4821-9dd0-d07899042a5e", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 104.75, 84, 374, 86.0, 178.70000000000022, 374.0, 374.0, 0.08686116328812933, 0.06455209498268205, 0.043600232353611795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 105.125, 82, 250, 85.0, 247.9, 250.0, 250.0, 0.08686210640608036, 0.023242399565689468, 0.0495385450597177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 95.4375, 82, 251, 85.0, 136.90000000000012, 251.0, 251.0, 0.08686163484454482, 0.023411925016693723, 0.051065140797281236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 115.49999999999999, 83, 250, 85.0, 247.9, 250.0, 250.0, 0.086862577972736, 0.023412179219214, 0.0511505219898045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 112.0, 83, 250, 84.5, 250.0, 250.0, 250.0, 0.0662646610562587, 0.04924551471075475, 0.037209160261082765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 714.1428571428572, 82, 1140, 862.0, 1139.0, 1140.0, 1140.0, 0.0755201449986784, 48.54378659692741, 0.039761862057060865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 135.25, 82, 927, 85.0, 230.90000000000032, 892.9499999999995, 927.0, 0.1045445516606902, 4.730237690205743, 0.06101154694573092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85110477-a9b7-49ba-ab00-996553c7c989", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 496.1428571428571, 82, 773, 649.5, 752.5, 773.0, 773.0, 0.07545014093008466, 15.85212934444606, 0.03979868622442106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 138.0, 82, 573, 85.0, 323.8000000000002, 560.9499999999998, 573.0, 0.10454509814171088, 1.5637557663155692, 0.0611139606910431], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 465.7692307692308, 85, 1183, 435.0, 960.9999999999998, 1183.0, 1183.0, 0.10026145101456876, 0.018994845211744472, 0.06857575957689667], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4cac536-92fc-4797-bdb8-1baf72cfc749", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 232.5625, 169, 621, 177.5, 423.6000000000002, 621.0, 621.0, 0.08682062858135092, 0.13455501714707413, 0.1952616285379406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 652.4999999999999, 93, 1681, 637.0, 1097.5, 1596.8499999999988, 1681.0, 0.09948134046584399, 0.06110719057911706, 0.04498033265203688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 87.28571428571429, 83, 112, 84.0, 102.0, 112.0, 112.0, 0.07552095976351152, 0.05612446326175025, 0.03790798175629387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57669c5b-1aa1-4fa9-a5ed-76436de32a00", 3, 0, 0.0, 381.33333333333337, 193, 718, 233.0, 718.0, 718.0, 718.0, 0.04275331338178709, 0.027486261044605956, 0.027416675573606955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 170.8571428571429, 83, 272, 169.0, 266.0, 272.0, 272.0, 0.07545461404964914, 0.10113949941253193, 0.03850627485960052], "isController": false}, {"data": ["login", 22, 0, 0.0, 2803.090909090909, 1371, 4952, 2674.0, 4143.4, 4864.549999999998, 4952.0, 0.09929410915130617, 32.53279279632522, 0.194718357336932], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 96.44999999999997, 84, 248, 87.5, 101.80000000000001, 240.6999999999999, 248.0, 0.10273427266703308, 0.0831706172275102, 0.03651882348710942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b711c201-55cf-4cef-93da-92483de348fd", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 815.6428571428571, 169, 1255, 948.5, 1238.5, 1255.0, 1255.0, 0.07541518754141101, 64.47823884663244, 0.15582789378848194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 300.00000000000006, 169, 985, 232.0, 499.8, 888.1999999999987, 985.0, 0.13965208415556027, 7.471042590090774, 0.31252727579768663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 758.625, 84, 1148, 943.0, 1148.0, 1148.0, 1148.0, 0.0874852368662788, 78.50292084499803, 0.1624435959439657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7021be2b-ddb7-40c4-8a63-de909513d08a", 1, 0, 0.0, 1183.0, 1183, 1183, 1183.0, 1183.0, 1183.0, 1183.0, 0.8453085376162299, 0.15271687447168217, 0.5828006128486898], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 954.6521739130437, 195, 1532, 1009.0, 1389.6000000000001, 1510.3999999999996, 1532.0, 0.0916498973919627, 0.028874076029567052, 0.04134985604988942], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/68cbf735-c807-4e11-9c91-f1d1b53cf62d", 3, 0, 0.0, 414.0, 259, 630, 353.0, 630.0, 630.0, 630.0, 0.016280546375136352, 0.0224440474930672, 0.010440324335618036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 250.95000000000007, 169, 1012, 173.0, 408.00000000000017, 982.1999999999996, 1012.0, 0.10449648369332372, 6.40455785088613, 0.23367822071224803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 95.6923076923077, 86, 135, 90.0, 130.2, 135.0, 135.0, 0.10949581389080741, 0.08500895707342958, 0.03892234009399795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac723ee3-5d1c-4aa0-b7ec-db382a0a57c6", 3, 0, 0.0, 404.0, 184, 702, 326.0, 702.0, 702.0, 702.0, 0.030271535675004794, 0.030360221814677662, 0.01941241057283836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf6d37b6-26ef-4821-9dd0-d07899042a5e", 3, 0, 0.0, 861.3333333333333, 200, 1449, 935.0, 1449.0, 1449.0, 1449.0, 0.01891503366875993, 0.026075900907291113, 0.012129757919094096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 321.2352941176471, 169, 1256, 332.0, 589.5999999999995, 1256.0, 1256.0, 0.09298051784678998, 6.6789794636118005, 0.20771595579870264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 109.1, 83, 318, 85.0, 295.70000000000005, 318.0, 318.0, 0.047174929355543294, 0.03505871214801606, 0.02367960321166919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 117.2, 83, 249, 84.5, 248.7, 249.0, 249.0, 0.047175597007180124, 0.019708711327804353, 0.02650863136516743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 180.50000000000003, 82, 1050, 84.0, 953.6000000000004, 1050.0, 1050.0, 0.04717581956192534, 4.256332358661244, 0.027328804847787217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 172.6, 81, 647, 85.0, 607.1000000000001, 647.0, 647.0, 0.04717581956192534, 1.3985695554386643, 0.02737487498407816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 3.4696691176470584, 7.27251838235294], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 986.7627118644065, 656, 1557, 973.0, 1332.0, 1411.0, 1557.0, 0.26116479498563594, 312.4438903760773, 0.5156984525985897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b711c201-55cf-4cef-93da-92483de348fd", 3, 0, 0.0, 405.3333333333333, 169, 575, 472.0, 575.0, 575.0, 575.0, 0.07576714231594897, 0.03423333122869049, 0.04858765311276676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 954.6521739130437, 195, 1532, 1009.0, 1389.6000000000001, 1510.3999999999996, 1532.0, 0.0907476819885579, 0.028589835273229437, 0.0409428018346814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 84.6, 82, 87, 84.0, 87.0, 87.0, 87.0, 0.02861197582860282, 0.007711821610053103, 0.016848653735007324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 155.0, 87, 257, 88.0, 257.0, 257.0, 257.0, 0.028583351912512076, 0.007704106570169271, 0.016803884620441672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 252.69230769230768, 84, 937, 91.0, 921.8, 937.0, 937.0, 0.10900370612600828, 15.114356285950262, 0.06264110215324244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 237.76923076923075, 82, 668, 246.0, 660.0, 668.0, 668.0, 0.10916663867522086, 4.963145762654933, 0.06284134256071344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 150.6, 83, 250, 86.0, 250.0, 250.0, 250.0, 0.028584822602590928, 0.007648673235458901, 0.016302281640540137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59c0280f-342e-403a-b9ad-e85ef8e852cb", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 86.46153846153847, 84, 97, 85.0, 93.8, 97.0, 97.0, 0.10916388858565586, 0.08112667891961339, 0.05479515501272179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 120.2, 85, 251, 88.0, 251.0, 251.0, 251.0, 0.028610829771285026, 0.02126254048432413, 0.014361295412539556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 122.61538461538461, 83, 252, 85.0, 250.4, 252.0, 252.0, 0.10916572196330353, 0.05443525108116052, 0.060848081202502416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 88.6, 86, 92, 89.0, 92.0, 92.0, 92.0, 0.02977094236940976, 0.023432987841547133, 0.010582639670376126], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 633.7692307692307, 92, 1449, 504.0, 1382.6, 1449.0, 1449.0, 0.09678884396893823, 0.018133366651031546, 0.06587341694400393], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1500.3181818181815, 702, 2873, 1327.5, 2439.2999999999997, 2836.2499999999995, 2873.0, 0.10123460198695915, 0.052396815481531585, 0.046563962437361085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 275.6, 173, 508, 177.0, 508.0, 508.0, 508.0, 0.028568816565342596, 0.04427608582929561, 0.06425193803709375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0dc2c31-f407-4d93-aa60-f5089ef151a5", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb6d3de9-85df-4693-9dd2-8b01d4268d10", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["addBook", 59, 5, 8.474576271186441, 976.1355932203388, 430, 3616, 735.0, 1720.0, 1820.0, 3616.0, 0.2714915469496314, 89.13858467919133, 0.9865250390556696], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 144.69491525423732, 82, 353, 87.0, 338.0, 344.0, 353.0, 0.2622070724802567, 0.1948628732006595, 0.12675048913840534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04c3797b-0f12-45e5-b643-f1424afef6ef", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6860a7d-3977-467b-94c7-c973ac354275", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.5376025883838385, 1.0045112584175084], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 525.6949152542376, 405, 821, 492.0, 686.0, 751.0, 821.0, 0.26207545996464204, 77.05888695386139, 0.13180552918143618], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 126.35593220338981, 82, 278, 88.0, 250.0, 253.0, 278.0, 0.26254661314869043, 0.46458443654826853, 0.12768380209770294], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 840.593220338983, 567, 1221, 828.0, 1066.0, 1149.0, 1221.0, 0.2616025149312961, 235.39040278335102, 0.13131219987762324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 107.23529411764706, 85, 338, 91.0, 156.39999999999984, 338.0, 338.0, 0.09425906827683335, 0.07041815159353271, 0.0335061531765306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, 2.824858757062147, 165.10734463276842, 84, 2454, 90.0, 265.4000000000001, 372.29999999999984, 1539.8399999999988, 0.725017613422247, 1.6019325930746482, 0.34716426461914046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 89.39999999999999, 85, 102, 87.5, 101.10000000000001, 102.0, 102.0, 0.04842755721715885, 0.03750298132149118, 0.017214483229536937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4cac536-92fc-4797-bdb8-1baf72cfc749", 3, 0, 0.0, 364.3333333333333, 175, 484, 434.0, 484.0, 484.0, 484.0, 0.021043180606604754, 0.02900972326463904, 0.013494487563480262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 106.65217391304347, 84, 261, 89.0, 197.00000000000017, 258.19999999999993, 261.0, 0.13233601841196777, 0.10739378056674338, 0.04704131904487917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef2c41d7-c990-4bf2-a353-d3ab11745bda", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85110477-a9b7-49ba-ab00-996553c7c989", 3, 0, 0.0, 279.3333333333333, 210, 369, 259.0, 369.0, 369.0, 369.0, 0.027692392899670463, 0.027773522956993715, 0.017758468102978778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 324.3, 170, 1135, 174.0, 1077.9, 1135.0, 1135.0, 0.04715602040912563, 5.707273808779979, 0.10484846412841527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 403.53846153846155, 171, 1021, 337.0, 1011.0, 1021.0, 1021.0, 0.10892516003619668, 20.190896907049133, 0.24068761887505447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d231bbd7-268d-4a84-8c58-2cf655ec4765", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ceb8220-f685-4761-9f0b-7e737771b6c5", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.6237030029296875, 1.1653900146484375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 119.875, 85, 256, 89.5, 253.9, 256.0, 256.0, 0.08891754009625323, 0.07372167142745996, 0.031607406831090014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57669c5b-1aa1-4fa9-a5ed-76436de32a00", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 92.2142857142857, 85, 140, 88.0, 117.0, 140.0, 140.0, 0.07707086666189561, 0.059835291988483405, 0.027396284633720704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7021be2b-ddb7-40c4-8a63-de909513d08a", 3, 0, 0.0, 333.0, 198, 504, 297.0, 504.0, 504.0, 504.0, 0.021667689863132427, 0.025610475876638616, 0.013894970387490518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 96.58823529411765, 83, 256, 85.0, 128.7999999999999, 256.0, 256.0, 0.09349186620763994, 0.06947979510157616, 0.046928534405006765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 123.58823529411767, 82, 250, 86.0, 249.2, 250.0, 250.0, 0.09341018610605901, 0.033247329567620734, 0.052811526404861725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 182.88235294117646, 82, 999, 85.0, 470.19999999999953, 999.0, 999.0, 0.09302580097950697, 4.947409000588252, 0.0542187371747517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 177.23529411764707, 82, 489, 88.0, 304.1999999999998, 489.0, 489.0, 0.09328767724658676, 1.637175156531235, 0.05446246920134773], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 40.0, 0.44609665427509293], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07434944237918216], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07434944237918216], "isController": false}, {"data": ["401/Unauthorized", 7, 46.666666666666664, 0.5204460966542751], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1345, 15, "401/Unauthorized", 7, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
