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

    var data = {"OkPercent": 98.59985261606485, "KoPercent": 1.400147383935151};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8106734434561627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a2317e4-a40a-4fd5-ad58-e218a6e5cdb1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/911da13d-c347-4d6c-adcb-2df78b7e77c8"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f44582d8-231e-41db-94a5-cd17d8d6c7cf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b63b2780-5904-4ed2-811d-04a5ea765c1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a30d88c-f5fc-40f2-911e-cc98fb5fbd0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4aa3554-b246-43c6-a315-7807874aec43"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d394001f-8555-4b92-a8ea-48c290489e47"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11af8d60-8bfb-41e9-ab23-7d3d14dd2af5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c35d59f-672b-4537-ae33-4c6a4df19522"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8162d0a5-5fe2-481a-be7f-7a45d730241a"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3abc5ea4-ff60-4c53-b3c9-fadccbe2c2c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f44582d8-231e-41db-94a5-cd17d8d6c7cf"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d7f3fef-560c-4c5e-b50b-6398b4ff886d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee24b091-c54c-41b2-96e6-2e49ab1af0c4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a30d88c-f5fc-40f2-911e-cc98fb5fbd0c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b63b2780-5904-4ed2-811d-04a5ea765c1b"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4aa3554-b246-43c6-a315-7807874aec43"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/944158b5-30d9-4c65-83c1-b9eb6062e398"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d394001f-8555-4b92-a8ea-48c290489e47"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=911da13d-c347-4d6c-adcb-2df78b7e77c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50633c4e-915f-4fee-8c5c-8e6a64dc7be6"], "isController": false}, {"data": [0.36065573770491804, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e231f03-d38d-4c43-a514-bbea48acd7dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7966101694915254, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11af8d60-8bfb-41e9-ab23-7d3d14dd2af5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8162d0a5-5fe2-481a-be7f-7a45d730241a"], "isController": false}, {"data": [0.9447513812154696, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c35d59f-672b-4537-ae33-4c6a4df19522"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d7f3fef-560c-4c5e-b50b-6398b4ff886d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fe9340a-5b90-477f-a522-ad8bb5e66816"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a2317e4-a40a-4fd5-ad58-e218a6e5cdb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3abc5ea4-ff60-4c53-b3c9-fadccbe2c2c9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 19, 1.400147383935151, 317.4753131908617, 80, 3763, 95.0, 898.8000000000002, 1079.5999999999995, 1567.180000000002, 5.34639266240111, 767.0449046996644, 3.9075042919871086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a2317e4-a40a-4fd5-ad58-e218a6e5cdb1", 1, 0, 0.0, 1584.0, 1584, 1584, 1584.0, 1584.0, 1584.0, 1584.0, 0.6313131313131314, 0.11405559501262626, 0.4352608112373737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/911da13d-c347-4d6c-adcb-2df78b7e77c8", 3, 0, 0.0, 643.0, 277, 1204, 448.0, 1204.0, 1204.0, 1204.0, 0.026823794493969117, 0.026902379829400667, 0.017201456755572643], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1400.6440677966102, 997, 1885, 1414.0, 1673.0, 1761.0, 1885.0, 0.2568344071043009, 309.0587692353735, 1.262852773213042], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f44582d8-231e-41db-94a5-cd17d8d6c7cf", 3, 0, 0.0, 706.3333333333334, 396, 1129, 594.0, 1129.0, 1129.0, 1129.0, 0.03698042502835166, 0.030829058755731966, 0.023714660581332283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b63b2780-5904-4ed2-811d-04a5ea765c1b", 3, 0, 0.0, 365.0, 179, 678, 238.0, 678.0, 678.0, 678.0, 0.07630287153139863, 0.03452506231401175, 0.0489312034234555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a30d88c-f5fc-40f2-911e-cc98fb5fbd0c", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4aa3554-b246-43c6-a315-7807874aec43", 3, 0, 0.0, 282.3333333333333, 198, 391, 258.0, 391.0, 391.0, 391.0, 0.04493170381020849, 0.028886756193086508, 0.02881362516474958], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 701.0, 89, 2550, 481.0, 1980.7999999999995, 2550.0, 2550.0, 0.08025335366418293, 0.015204248643409657, 0.05425179759795539], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 701.0, 89, 2550, 481.0, 1980.7999999999995, 2550.0, 2550.0, 0.07849862325491523, 0.01487180948384136, 0.05306558824151007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 109.89999999999998, 82, 258, 85.0, 250.5, 257.65, 258.0, 0.10002550650415856, 0.04929968079360236, 0.055785709730981396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 96.85, 84, 251, 87.0, 109.40000000000003, 243.9999999999999, 251.0, 0.10001950380324164, 0.07433090077565124, 0.05020510249498652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 217.20000000000005, 82, 682, 87.0, 650.5, 680.4499999999999, 682.0, 0.10002500625156288, 4.434516832333084, 0.057612059264816204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 235.29999999999998, 81, 1047, 86.0, 940.8000000000002, 1042.1999999999998, 1047.0, 0.10002550650415856, 13.523384986609084, 0.05751466623989117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d394001f-8555-4b92-a8ea-48c290489e47", 3, 0, 0.0, 272.6666666666667, 180, 422, 216.0, 422.0, 422.0, 422.0, 0.030514784413048123, 0.030832646750684038, 0.019568400160711198], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 211.57142857142856, 86, 396, 209.0, 336.5, 396.0, 396.0, 0.07938668118308838, 0.14048828833809654, 0.05131117381713845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11af8d60-8bfb-41e9-ab23-7d3d14dd2af5", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 84.99999999999999, 82, 88, 85.0, 87.4, 88.0, 88.0, 0.07998549596339863, 0.05944234612123669, 0.040148969653502835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 84.06666666666665, 81, 88, 84.0, 87.4, 88.0, 88.0, 0.07998421644795427, 0.021402026666737763, 0.04561599844297392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 614.4, 483, 736, 650.0, 736.0, 736.0, 736.0, 0.049490740282493145, 14.551920890288928, 0.028225187817359373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 872.6, 598, 1006, 898.0, 1006.0, 1006.0, 1006.0, 0.049248953459738974, 44.31429489349914, 0.028039199088894358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c35d59f-672b-4537-ae33-4c6a4df19522", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 118.8, 83, 257, 84.0, 257.0, 257.0, 257.0, 0.04969931911932806, 0.08794449828537348, 0.027519056582674815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 85.07142857142858, 83, 89, 84.5, 88.5, 89.0, 89.0, 0.0712914445174333, 0.05298123952906909, 0.035784963361289765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 108.85714285714286, 82, 247, 85.5, 247.0, 247.0, 247.0, 0.07129362278544184, 0.019076613909385805, 0.040659644244822296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 109.35714285714285, 81, 261, 84.0, 254.0, 261.0, 261.0, 0.07129325973152996, 0.01921576141201393, 0.041912639021856476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 110.28571428571428, 82, 260, 84.0, 253.0, 260.0, 260.0, 0.07129289668131567, 0.01921566355863586, 0.04198204755745444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 120.0, 84, 253, 87.0, 253.0, 253.0, 253.0, 0.04969931911932806, 0.03693474790020376, 0.027907332513294567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8162d0a5-5fe2-481a-be7f-7a45d730241a", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 559.2941176470588, 81, 984, 806.0, 969.6, 984.0, 984.0, 0.09409680901115323, 49.815427984806135, 0.05056189978689841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 118.33333333333334, 82, 260, 84.0, 257.6, 260.0, 260.0, 0.07998421644795427, 0.021558245839487674, 0.047021970997723116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 427.52941176470597, 80, 747, 642.0, 711.0, 747.0, 747.0, 0.09409524652954591, 16.285223448535433, 0.050652950093541746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 94.6, 81, 249, 84.0, 152.40000000000006, 249.0, 249.0, 0.07998378995190308, 0.021558130885473877, 0.047099829434567926], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 859.1538461538462, 92, 2699, 564.0, 2454.6, 2699.0, 2699.0, 0.07850194141339725, 0.014872438119335028, 0.05369292191774204], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 208.78571428571428, 168, 351, 174.0, 343.5, 351.0, 351.0, 0.07126060001425212, 0.11044001193615051, 0.16026675960236586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 537.9090909090909, 160, 1659, 458.0, 960.3999999999999, 1558.7999999999986, 1659.0, 0.09757482214771054, 0.05993609680752923, 0.04411830337342772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 85.8235294117647, 82, 93, 85.0, 91.4, 93.0, 93.0, 0.09409472571387455, 0.06992781862134621, 0.04723114161809718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 114.0, 83, 254, 85.0, 250.0, 254.0, 254.0, 0.09409472571387455, 0.10831055341536179, 0.04901487665288455], "isController": false}, {"data": ["login", 22, 0, 0.0, 2658.8636363636365, 1549, 4732, 2606.0, 4364.299999999999, 4724.5, 4732.0, 0.09476019210475307, 25.895666370092393, 0.1786848792884371], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 90.60000000000001, 86, 108, 89.0, 103.8, 108.0, 108.0, 0.07478499314470896, 0.060543710270472395, 0.026583728031908265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3abc5ea4-ff60-4c53-b3c9-fadccbe2c2c9", 3, 0, 0.0, 373.66666666666663, 180, 684, 257.0, 684.0, 684.0, 684.0, 0.0382189948404357, 0.03186160344607936, 0.02450892572775336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f44582d8-231e-41db-94a5-cd17d8d6c7cf", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 646.5882352941177, 166, 1073, 889.0, 1057.8, 1073.0, 1073.0, 0.09404995712428425, 66.24616301243395, 0.19736552066332883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d7f3fef-560c-4c5e-b50b-6398b4ff886d", 3, 0, 0.0, 350.3333333333333, 209, 603, 239.0, 603.0, 603.0, 603.0, 0.02202061129216947, 0.0220851248018145, 0.014121290444522741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee24b091-c54c-41b2-96e6-2e49ab1af0c4", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a30d88c-f5fc-40f2-911e-cc98fb5fbd0c", 3, 0, 0.0, 311.6666666666667, 190, 548, 197.0, 548.0, 548.0, 548.0, 0.04908136053531404, 0.03155458563061368, 0.031474700603700737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b63b2780-5904-4ed2-811d-04a5ea765c1b", 1, 0, 0.0, 2088.0, 2088, 2088, 2088.0, 2088.0, 2088.0, 2088.0, 0.4789272030651341, 0.08652493414750957, 0.3301978568007663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 376.15, 169, 1134, 257.0, 1029.0000000000002, 1129.25, 1134.0, 0.09997700528878357, 18.07279150014247, 0.22101361999240177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 660.75, 86, 1150, 863.0, 1150.0, 1150.0, 1150.0, 0.06801737844019147, 50.86459453671663, 0.112612268528359], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1060.227272727273, 142, 2742, 1096.5, 1665.9999999999998, 2591.399999999998, 2742.0, 0.0966905463015866, 0.030576325099986815, 0.04362405506966115], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 204.93333333333334, 168, 346, 171.0, 343.6, 346.0, 346.0, 0.0799484066282559, 0.12390441535062706, 0.17980584029772786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 89.38461538461537, 84, 98, 89.0, 96.0, 98.0, 98.0, 0.1522818854840221, 0.11822665914042733, 0.05413145148064849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4aa3554-b246-43c6-a315-7807874aec43", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 294.74999999999994, 170, 1117, 181.5, 581.5000000000006, 1117.0, 1117.0, 0.10724651281260683, 8.174830091779555, 0.2394849192969991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 84.71428571428572, 82, 89, 85.0, 87.5, 89.0, 89.0, 0.07095217823187172, 0.05272910901802185, 0.03561466758904498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 97.57142857142858, 81, 249, 85.0, 172.5, 249.0, 249.0, 0.07095253782023668, 0.018985347033930518, 0.04046511922560373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 96.21428571428572, 82, 248, 83.5, 171.0, 248.0, 248.0, 0.07095253782023668, 0.019123926209360667, 0.041712331804475075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 85.64285714285714, 82, 94, 84.0, 92.5, 94.0, 94.0, 0.07095289741224646, 0.019124023130644558, 0.04178183314412561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 3.205672554347826, 6.719174592391305], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 996.5762711864405, 657, 1539, 983.0, 1311.0, 1417.0, 1539.0, 0.2657992900005406, 317.9883576250608, 0.5248497699034113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1060.227272727273, 142, 2742, 1096.5, 1665.9999999999998, 2591.399999999998, 2742.0, 0.09516970488739693, 0.030095391407040827, 0.04293789419724354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/944158b5-30d9-4c65-83c1-b9eb6062e398", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 112.81818181818183, 81, 247, 84.0, 246.4, 247.0, 247.0, 0.051406433281459565, 0.0138556402203934, 0.030271561785859494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 128.45454545454547, 82, 249, 84.0, 248.4, 249.0, 249.0, 0.051367544117715734, 0.013845158375478069, 0.030198497616078974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 288.6153846153845, 82, 979, 88.0, 913.8, 979.0, 979.0, 0.14589692943077753, 30.325244500106617, 0.08287804840411205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d394001f-8555-4b92-a8ea-48c290489e47", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 254.84615384615387, 83, 686, 87.0, 670.8, 686.0, 686.0, 0.14588710582426215, 9.929243876949837, 0.08301493589383907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 131.0909090909091, 81, 259, 87.0, 257.4, 259.0, 259.0, 0.05140619304427475, 0.01375517274817508, 0.029317594470562945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=911da13d-c347-4d6c-adcb-2df78b7e77c8", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 85.46153846153845, 82, 92, 85.0, 90.4, 92.0, 92.0, 0.14589201746215225, 0.10842170438349401, 0.07323095407768189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 118.54545454545455, 84, 263, 87.0, 259.8, 263.0, 263.0, 0.05140571257664124, 0.03820287819416405, 0.025803258070696874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 122.53846153846153, 82, 260, 83.0, 257.2, 260.0, 260.0, 0.145895292071152, 0.08960636327927725, 0.08037831070085853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 105.18181818181817, 84, 252, 91.0, 222.6000000000001, 252.0, 252.0, 0.05114376046122373, 0.04025573333178352, 0.018180008601450623], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 550.6153846153845, 89, 1324, 511.0, 1067.9999999999998, 1324.0, 1324.0, 0.07806448126152202, 0.014625361798845847, 0.053129822733577935], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1550.863636363636, 1023, 3763, 1326.0, 2672.4, 3602.199999999998, 3763.0, 0.09511539226452455, 0.04922964638691212, 0.04374936499667096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 280.0, 169, 522, 187.0, 517.2, 522.0, 522.0, 0.05134716283585712, 0.07957807365283716, 0.11548097266697163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50633c4e-915f-4fee-8c5c-8e6a64dc7be6", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.9121912425149699, 3.5729322604790417], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 917.2295081967213, 437, 2319, 737.0, 1590.2000000000003, 1687.3999999999999, 2319.0, 0.2877087067257806, 97.04904202728515, 1.0441876798179417], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2e231f03-d38d-4c43-a514-bbea48acd7dc", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.730745852402746, 1.365399742562929], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 159.4915254237288, 83, 405, 88.0, 338.0, 351.0, 405.0, 0.2665738929276591, 0.19810813722455914, 0.1288614033195227], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 519.9661016949152, 404, 747, 491.0, 662.0, 692.0, 747.0, 0.26653294844168574, 78.36953656865934, 0.13404733246823064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11af8d60-8bfb-41e9-ab23-7d3d14dd2af5", 3, 0, 0.0, 278.0, 190, 408, 236.0, 408.0, 408.0, 408.0, 0.01509859381762912, 0.020814630474498476, 0.009682366478102007], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 140.08474576271186, 82, 344, 90.0, 257.0, 259.0, 344.0, 0.266924844821658, 0.47233185431332453, 0.1298130592980329], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 835.406779661017, 566, 1163, 819.0, 1059.0, 1079.0, 1163.0, 0.26625029332659433, 239.57248195336334, 0.13364516676745067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 101.8125, 83, 252, 91.5, 151.9000000000001, 252.0, 252.0, 0.105919580558461, 0.07912937414767839, 0.03765110090164043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8162d0a5-5fe2-481a-be7f-7a45d730241a", 3, 0, 0.0, 572.6666666666667, 194, 1324, 200.0, 1324.0, 1324.0, 1324.0, 0.052401746724890834, 0.03321165393013101, 0.033603984716157206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, 4.972375690607735, 149.97790055248618, 84, 1811, 90.0, 290.4000000000001, 368.5000000000001, 690.8800000000093, 0.7761611327664356, 1.7004404634025017, 0.37221345154781965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 111.42857142857142, 85, 254, 88.5, 252.5, 254.0, 254.0, 0.07131650263871059, 0.05522850253173585, 0.025350788047354158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 106.7, 85, 276, 89.0, 232.5000000000003, 274.54999999999995, 276.0, 0.1016590761223162, 0.08249872290785622, 0.03613662471535459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c35d59f-672b-4537-ae33-4c6a4df19522", 3, 0, 0.0, 703.0, 229, 1422, 458.0, 1422.0, 1422.0, 1422.0, 0.04172229639519359, 0.026823416465008902, 0.026755509081553185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 184.5, 168, 333, 172.0, 258.5, 333.0, 333.0, 0.07092126726172987, 0.10991411244566925, 0.15950359228883193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 423.3846153846154, 169, 1068, 340.0, 1002.0, 1068.0, 1068.0, 0.1457480800493301, 40.41191788356971, 0.3191852296933685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d7f3fef-560c-4c5e-b50b-6398b4ff886d", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fe9340a-5b90-477f-a522-ad8bb5e66816", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 88.50000000000001, 84, 95, 87.5, 94.0, 95.0, 95.0, 0.06993251512290641, 0.05798115755795657, 0.024858823735095632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 118.23529411764706, 84, 371, 93.0, 285.3999999999999, 371.0, 371.0, 0.090577297066894, 0.0703212413751765, 0.03219739856674748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a2317e4-a40a-4fd5-ad58-e218a6e5cdb1", 3, 0, 0.0, 342.6666666666667, 209, 511, 308.0, 511.0, 511.0, 511.0, 0.026194467728415757, 0.026271209333088852, 0.016797884578443698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 87.375, 84, 94, 86.5, 93.3, 94.0, 94.0, 0.1074258090506244, 0.0798350006714113, 0.05392272055861421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 115.6875, 82, 250, 84.5, 248.6, 250.0, 250.0, 0.10730837072359375, 0.03878663155670912, 0.06063604102533148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 165.00000000000003, 83, 1032, 84.5, 490.90000000000055, 1032.0, 1032.0, 0.10742436653193861, 6.068434199638114, 0.06257679163701306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 168.625, 82, 778, 85.5, 408.4000000000004, 778.0, 778.0, 0.10742653032449527, 2.001330557308697, 0.06268296080945891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3abc5ea4-ff60-4c53-b3c9-fadccbe2c2c9", 1, 0, 0.0, 2699.0, 2699, 2699, 2699.0, 2699.0, 2699.0, 2699.0, 0.3705075954057058, 0.06693740737310115, 0.25544761948869954], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 26.31578947368421, 0.36845983787767134], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.14738393515106854], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07369196757553427], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.810611643330877], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 19, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
