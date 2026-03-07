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

    var data = {"OkPercent": 97.54601226993866, "KoPercent": 2.4539877300613497};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7690789473684211, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5860a886-c7cd-4d6c-95f8-bb090a06fe47"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19d44c62-5d3e-4d99-8f9c-694376247972"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2e31ab9-8fda-4f1b-8f44-97a4a88dd224"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf53d805-9ec5-4968-9c81-d7963889918e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c817b332-f455-4540-8db9-5deddd595fe7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cef37806-7e3b-4f5b-a0af-36119cdbbcc7"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94b34883-07ca-49a4-9ab9-b7b812a27454"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb945acd-41b1-4e46-bed0-69b4019c84fc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6b3d7fc-cc96-4773-bbf7-77e71c044358"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a426c457-273b-4709-bf7b-dac678399d3d"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f88bf91d-688d-47b1-85fb-c22afa7919be"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/858bb120-a8f2-4b82-a4d9-61a4c9bba2f5"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2e31ab9-8fda-4f1b-8f44-97a4a88dd224"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56a34cfc-586c-4c1d-b51a-1a8a70b51e6c"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5860a886-c7cd-4d6c-95f8-bb090a06fe47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf53d805-9ec5-4968-9c81-d7963889918e"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cef37806-7e3b-4f5b-a0af-36119cdbbcc7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b6b3d7fc-cc96-4773-bbf7-77e71c044358"], "isController": false}, {"data": [0.24166666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/19d44c62-5d3e-4d99-8f9c-694376247972"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/428ffaf1-7167-4443-8565-79be1b17d455"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c817b332-f455-4540-8db9-5deddd595fe7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb945acd-41b1-4e46-bed0-69b4019c84fc"], "isController": false}, {"data": [0.8936781609195402, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd38573c-894e-4f65-ab6e-4ce275158b53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=428ffaf1-7167-4443-8565-79be1b17d455"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56a34cfc-586c-4c1d-b51a-1a8a70b51e6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22e34f33-b94e-47e0-b090-78740bc8c8d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f88bf91d-688d-47b1-85fb-c22afa7919be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/94b34883-07ca-49a4-9ab9-b7b812a27454"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 32, 2.4539877300613497, 396.6019938650312, 114, 16407, 135.0, 961.5, 1125.0, 1568.2000000000007, 5.097573179884914, 714.1640448170601, 3.7235644628979547], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5860a886-c7cd-4d6c-95f8-bb090a06fe47", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2086.6481481481483, 1425, 16910, 1822.5, 2180.5, 2363.0, 16910.0, 0.23045309639340905, 277.31329715033013, 1.1331360745515766], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19d44c62-5d3e-4d99-8f9c-694376247972", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 525.5, 125, 905, 484.0, 895.0, 905.0, 905.0, 0.07223904933411077, 0.014230125231551954, 0.04860615721797101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 525.5, 125, 905, 484.0, 895.0, 905.0, 905.0, 0.07388018744458985, 0.014553407459788068, 0.04971039955988517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 214.38888888888886, 121, 364, 122.5, 361.3, 364.0, 364.0, 0.09220177846986026, 0.04005815114944884, 0.05172343692373889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 151.38888888888889, 119, 380, 125.0, 367.40000000000003, 380.0, 380.0, 0.09219941709479637, 0.06851929336830082, 0.046279785533911454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 270.9444444444444, 120, 628, 126.5, 599.2, 628.0, 628.0, 0.09219988936013276, 3.034292756418137, 0.05341310864732517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 244.72222222222223, 119, 1128, 123.0, 1082.1000000000001, 1128.0, 1128.0, 0.09220130618517096, 9.240189604943014, 0.05332388910231784], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 252.50000000000006, 123, 483, 236.0, 404.5, 483.0, 483.0, 0.07203424713921133, 0.11876907782014078, 0.046558965819749734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2e31ab9-8fda-4f1b-8f44-97a4a88dd224", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf53d805-9ec5-4968-9c81-d7963889918e", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 124.83333333333334, 120, 142, 123.0, 130.3, 142.0, 142.0, 0.08280544859851778, 0.061538033577609404, 0.04156445369105287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 175.27777777777774, 116, 368, 122.0, 366.2, 368.0, 368.0, 0.08280697234707163, 0.02906690055802699, 0.046839490760122005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 738.4285714285714, 604, 844, 823.0, 844.0, 844.0, 844.0, 0.09356037317223129, 27.50985620940148, 0.053358650324788155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c817b332-f455-4540-8db9-5deddd595fe7", 3, 0, 0.0, 410.33333333333337, 218, 772, 241.0, 772.0, 772.0, 772.0, 0.0655752038295919, 0.029671072045290604, 0.042051807143325536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 924.1428571428571, 796, 1132, 863.0, 1132.0, 1132.0, 1132.0, 0.09290843210384508, 83.5991705226431, 0.05289610929349774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 293.5714285714286, 121, 383, 359.0, 383.0, 383.0, 383.0, 0.09386901249798851, 0.16610415102183124, 0.05197629891246044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 123.18750000000001, 117, 128, 123.0, 128.0, 128.0, 128.0, 0.0817887192908918, 0.06078243689489127, 0.041054103237810925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 184.0, 118, 384, 122.5, 374.2, 384.0, 384.0, 0.08169100377820893, 0.029527229270907788, 0.04616060259879506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 183.125, 114, 862, 123.0, 506.4000000000004, 862.0, 862.0, 0.08179373664461644, 4.620552345754905, 0.047646449129407915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 221.18750000000003, 119, 977, 123.5, 559.1000000000004, 977.0, 977.0, 0.0816918379642394, 1.5218993958633296, 0.04766686834339164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 122.85714285714286, 121, 126, 122.0, 126.0, 126.0, 126.0, 0.09416955901740791, 0.06998343204321038, 0.052878414487314014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 204.94444444444443, 118, 1107, 123.5, 440.10000000000105, 1107.0, 1107.0, 0.0828065914046758, 4.160496605217276, 0.04828587480563453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 866.2499999999999, 121, 1125, 1071.5, 1118.1, 1125.0, 1125.0, 0.062036342957582646, 46.519795490087105, 0.032027877581616564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 161.94444444444443, 119, 598, 122.0, 383.80000000000035, 598.0, 598.0, 0.08280697234707163, 1.373745747516941, 0.048366963123294984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 675.0833333333333, 119, 966, 782.5, 938.7, 966.0, 966.0, 0.062038267271195116, 15.203878910349534, 0.03208945530401336], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 428.5714285714286, 124, 907, 463.0, 799.0, 907.0, 907.0, 0.07416707723441564, 0.014609920906109778, 0.050379394399326136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cef37806-7e3b-4f5b-a0af-36119cdbbcc7", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 362.125, 243, 1096, 251.0, 687.9000000000004, 1096.0, 1096.0, 0.08163848438153745, 6.222866564767382, 0.1823013665516925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 547.695652173913, 176, 1012, 581.0, 927.0, 996.5999999999998, 1012.0, 0.10418790061380263, 0.06399823192000181, 0.04710839646893615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 130.66666666666669, 121, 208, 123.0, 184.60000000000008, 208.0, 208.0, 0.062036342957582646, 0.04610318065500039, 0.031139336211130353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 266.0, 120, 389, 354.0, 385.40000000000003, 389.0, 389.0, 0.062036022250253314, 0.09424548041729564, 0.031038205142786244], "isController": false}, {"data": ["login", 23, 0, 0.0, 2395.869565217391, 1325, 3170, 2515.0, 3057.8, 3155.3999999999996, 3170.0, 0.10338937337049357, 37.78465879399667, 0.20817032415939943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94b34883-07ca-49a4-9ab9-b7b812a27454", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb945acd-41b1-4e46-bed0-69b4019c84fc", 3, 0, 0.0, 354.0, 286, 479, 297.0, 479.0, 479.0, 479.0, 0.022694434568162735, 0.026824053358398076, 0.014553397167734565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6b3d7fc-cc96-4773-bbf7-77e71c044358", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 143.11111111111114, 123, 363, 129.0, 174.00000000000028, 363.0, 363.0, 0.08398460282281582, 0.06799144115245538, 0.02985390178467281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a426c457-273b-4709-bf7b-dac678399d3d", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1007.6666666666669, 249, 1294, 1194.5, 1280.5, 1294.0, 1294.0, 0.06199595992994457, 61.82328140418266, 0.12621182727925562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f88bf91d-688d-47b1-85fb-c22afa7919be", 1, 0, 0.0, 907.0, 907, 907, 907.0, 907.0, 907.0, 907.0, 1.1025358324145536, 0.1991886025358324, 0.7601467750826901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 504.7777777777778, 244, 1251, 481.0, 1208.7, 1251.0, 1251.0, 0.09213995034680454, 12.374867228890993, 0.20460547784802027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 712.1818181818181, 122, 1254, 961.0, 1253.0, 1254.0, 1254.0, 0.0999727347087158, 76.12018455194038, 0.16754130975643006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/858bb120-a8f2-4b82-a4d9-61a4c9bba2f5", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.5774610081374322, 1.0789867766726944], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 984.6521739130435, 178, 1852, 974.0, 1588.8000000000002, 1809.1999999999994, 1852.0, 0.10108334981431429, 0.031691552947898126, 0.04560596446700508], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 372.1666666666667, 245, 1233, 253.0, 583.2000000000011, 1233.0, 1233.0, 0.08275900119081007, 5.621609000213795, 0.18495056299109422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 142.92857142857144, 120, 364, 125.5, 251.0, 364.0, 364.0, 0.06877443948831817, 0.05339421815743452, 0.0244471640368631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 438.57894736842115, 243, 1231, 254.0, 738.0, 1231.0, 1231.0, 0.11478143198898098, 7.395815556055626, 0.25660045149880384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 150.55555555555554, 121, 360, 124.0, 360.0, 360.0, 360.0, 0.05278747177336579, 0.0392297519721986, 0.026496836417490247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 175.66666666666669, 120, 366, 123.0, 366.0, 366.0, 366.0, 0.05271326910123877, 0.014104917708729903, 0.03006303628430023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 202.55555555555557, 118, 375, 122.0, 375.0, 375.0, 375.0, 0.052789639153488804, 0.01422845742808878, 0.031034533955469006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 213.88888888888889, 120, 457, 125.0, 457.0, 457.0, 457.0, 0.052712034157398134, 0.014207540456486216, 0.031040387301670972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 125.0, 124, 126, 125.0, 126.0, 126.0, 126.0, 0.02625533311453889, 0.0077432720708894, 0.016230103380374138], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1449.7962962962963, 925, 16407, 1000.0, 1638.0, 1853.0, 16407.0, 0.2305052333225195, 275.7643956387556, 0.4551577947052094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2e31ab9-8fda-4f1b-8f44-97a4a88dd224", 3, 0, 0.0, 268.6666666666667, 207, 376, 223.0, 376.0, 376.0, 376.0, 0.07449899426357744, 0.03453338796592913, 0.04777442014949465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56a34cfc-586c-4c1d-b51a-1a8a70b51e6c", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 984.6521739130435, 178, 1852, 974.0, 1588.8000000000002, 1809.1999999999994, 1852.0, 0.10342842752815053, 0.0324267794186423, 0.046663997576177285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 182.125, 119, 360, 124.0, 360.0, 360.0, 360.0, 0.03785136714406703, 0.010202126300549317, 0.02228942811315666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 180.125, 119, 359, 121.0, 359.0, 359.0, 359.0, 0.03785190442394133, 0.010202271114265436, 0.022252779749231132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 174.07142857142856, 119, 370, 122.5, 365.5, 370.0, 370.0, 0.06610009442870633, 0.017816041076487252, 0.03885962582625118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 185.0, 115, 507, 124.0, 441.0, 507.0, 507.0, 0.06602060786116809, 0.017794616962580462, 0.038877369668246446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 123.49999999999999, 119, 127, 124.0, 127.0, 127.0, 127.0, 0.03785172532895515, 0.010128293691536828, 0.021587312101669736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 123.07142857142857, 118, 134, 122.0, 130.5, 134.0, 134.0, 0.0660991581800069, 0.04912251892088403, 0.033178679008323775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 123.625, 120, 127, 123.0, 127.0, 127.0, 127.0, 0.03785190442394133, 0.028130175065057963, 0.018999881712798674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 172.7857142857143, 117, 366, 121.5, 365.0, 366.0, 366.0, 0.0660230986526572, 0.01766633694416804, 0.037653798450343556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 200.5, 123, 481, 127.0, 481.0, 481.0, 481.0, 0.04020989565532078, 0.03164958583807475, 0.014293361346227308], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 443.4285714285715, 122, 772, 425.0, 761.5, 772.0, 772.0, 0.07384160974709249, 0.014257364381972098, 0.050251028508135766], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5860a886-c7cd-4d6c-95f8-bb090a06fe47", 3, 0, 0.0, 702.0, 255, 1454, 397.0, 1454.0, 1454.0, 1454.0, 0.07889753839680202, 0.035699081501157165, 0.05059510112034504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf53d805-9ec5-4968-9c81-d7963889918e", 3, 0, 0.0, 283.3333333333333, 218, 406, 226.0, 406.0, 406.0, 406.0, 0.05438920918089851, 0.034967020876391454, 0.03487849677290692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1220.3478260869567, 791, 1610, 1104.0, 1567.0, 1603.3999999999999, 1610.0, 0.10414025428333393, 0.0539007175489912, 0.04790044899165067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 308.49999999999994, 244, 487, 248.5, 487.0, 487.0, 487.0, 0.03782953067738503, 0.058628383969736374, 0.0850795011230642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cef37806-7e3b-4f5b-a0af-36119cdbbcc7", 3, 0, 0.0, 286.0, 206, 423, 229.0, 423.0, 423.0, 423.0, 0.05296703684740196, 0.03405270109818323, 0.03396649172831441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6b3d7fc-cc96-4773-bbf7-77e71c044358", 3, 0, 0.0, 628.3333333333334, 483, 850, 552.0, 850.0, 850.0, 850.0, 0.025294256517486763, 0.025368360784627838, 0.016220600696435196], "isController": false}, {"data": ["addBook", 60, 17, 28.333333333333332, 1094.1, 611, 1850, 972.0, 1716.2, 1761.55, 1850.0, 0.27783823331928703, 84.22483802175705, 1.008755377327474], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19d44c62-5d3e-4d99-8f9c-694376247972", 3, 0, 0.0, 732.0, 243, 1202, 751.0, 1202.0, 1202.0, 1202.0, 0.02064295937465595, 0.028457985986871076, 0.013237835276065176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/428ffaf1-7167-4443-8565-79be1b17d455", 3, 0, 0.0, 274.0, 214, 385, 223.0, 385.0, 385.0, 385.0, 0.031077777317366263, 0.02544290688579953, 0.019929434021878755], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 231.4444444444445, 121, 718, 127.0, 493.0, 563.5, 718.0, 0.23132777861074816, 0.17191449172146422, 0.11182348673078159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c817b332-f455-4540-8db9-5deddd595fe7", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 687.4629629629629, 583, 1004, 612.5, 857.0, 904.25, 1004.0, 0.23148247377603642, 68.06353323166681, 0.11641940819790894], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 179.7777777777778, 117, 487, 124.0, 365.0, 376.5, 487.0, 0.23194879945019545, 0.41044064902710364, 0.11280322473261457], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1214.851851851852, 802, 16286, 854.0, 1149.5, 1234.0, 16286.0, 0.2312475376419603, 208.07694086004815, 0.1160754241679371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 127.63157894736842, 123, 134, 128.0, 134.0, 134.0, 134.0, 0.12033846777462505, 0.08990129672616032, 0.042776564716761244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb945acd-41b1-4e46-bed0-69b4019c84fc", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.2614530571635311, 0.9977613965267729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, 9.770114942528735, 175.44827586206893, 117, 712, 129.0, 320.0, 373.25, 576.25, 0.7076392503904216, 1.534946010734562, 0.34022889740450935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 127.22222222222223, 123, 136, 126.0, 136.0, 136.0, 136.0, 0.054071590786200927, 0.04187380028657943, 0.01922076078728236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd38573c-894e-4f65-ab6e-4ce275158b53", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 144.7222222222222, 125, 380, 128.0, 170.30000000000032, 380.0, 380.0, 0.09590741737309584, 0.07783111702836194, 0.03409208976934266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=428ffaf1-7167-4443-8565-79be1b17d455", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 421.0, 244, 722, 483.0, 722.0, 722.0, 722.0, 0.05267316302343956, 0.0816331149591783, 0.11846317816697392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 378.35714285714283, 242, 629, 365.0, 563.5, 629.0, 629.0, 0.06598202461129518, 0.10225925103332563, 0.14839511980450468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56a34cfc-586c-4c1d-b51a-1a8a70b51e6c", 3, 0, 0.0, 389.0, 326, 427, 414.0, 427.0, 427.0, 427.0, 0.041368468952964046, 0.026595939512403643, 0.02652860801996718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22e34f33-b94e-47e0-b090-78740bc8c8d2", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 127.25, 120, 138, 126.0, 134.5, 138.0, 138.0, 0.08164306671769359, 0.0676903941829315, 0.02902155887230514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f88bf91d-688d-47b1-85fb-c22afa7919be", 3, 0, 0.0, 352.0, 285, 479, 292.0, 479.0, 479.0, 479.0, 0.042162071000927566, 0.03514878379992692, 0.027037525999943784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 129.83333333333337, 122, 147, 127.0, 146.4, 147.0, 147.0, 0.06039437527051648, 0.046888211269590425, 0.021468313084441405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94b34883-07ca-49a4-9ab9-b7b812a27454", 3, 0, 0.0, 376.0, 298, 515, 315.0, 515.0, 515.0, 515.0, 0.028434132332451872, 0.028517435454519603, 0.018234127830380923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 160.5789473684211, 119, 365, 125.0, 361.0, 365.0, 365.0, 0.11487025706754371, 0.08536744690273512, 0.0576594845046069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 209.94736842105263, 118, 373, 124.0, 371.0, 373.0, 373.0, 0.1150274249597404, 0.03987175955635738, 0.06509313059245178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 211.26315789473685, 116, 1111, 123.0, 362.0, 1111.0, 1111.0, 0.11502394314184873, 5.47667326730051, 0.06710124150184947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 221.78947368421055, 117, 582, 123.0, 372.0, 582.0, 582.0, 0.11502672857929883, 1.8094598322123272, 0.06721519722543423], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5368098159509203], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.25, 0.15337423312883436], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.15337423312883436], "isController": false}, {"data": ["401/Unauthorized", 21, 65.625, 1.6104294478527608], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 32, "401/Unauthorized", 21, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
