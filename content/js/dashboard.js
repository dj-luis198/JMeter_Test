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

    var data = {"OkPercent": 98.07098765432099, "KoPercent": 1.9290123456790123};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8053713527851459, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbd96d3e-5c70-47c2-9af7-5192f6e95fae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fe9f3b2-6e42-4c78-b241-e24b44c2500a"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/246e0288-60ad-403d-bbe9-d67ed72b2155"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f285f17-4006-40ca-b30e-fd72767d8fb2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b6738fb-50bf-46fa-8fde-99e68b499175"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1067ce0d-dde5-4f02-8691-a9bf56814600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a0e89d6-5a4f-45e7-8129-f5fe464bc944"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43f62a0e-4105-4e03-9306-f89d0282e769"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dc187c4-d36a-44b9-86bb-597c0936c53d"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c83a4b47-4633-4571-b90f-1b944f117afc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ab45b31-336f-41c2-8261-e7394542cb87"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c67fafa-10dd-4b50-817e-28300087d59b"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=246e0288-60ad-403d-bbe9-d67ed72b2155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c14c1ae-1e8f-43c6-8a1d-df0d766612e5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c83a4b47-4633-4571-b90f-1b944f117afc"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fe9f3b2-6e42-4c78-b241-e24b44c2500a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ab51834-4e1b-4344-915d-01a1940c7873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f285f17-4006-40ca-b30e-fd72767d8fb2"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cbd96d3e-5c70-47c2-9af7-5192f6e95fae"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a0e89d6-5a4f-45e7-8129-f5fe464bc944"], "isController": false}, {"data": [0.9393063583815029, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43f62a0e-4105-4e03-9306-f89d0282e769"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9dc187c4-d36a-44b9-86bb-597c0936c53d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ab45b31-336f-41c2-8261-e7394542cb87"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b6738fb-50bf-46fa-8fde-99e68b499175"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ab51834-4e1b-4344-915d-01a1940c7873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18c5063d-a0d2-4d98-8af5-923c3335af62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 25, 1.9290123456790123, 310.49074074074133, 80, 2711, 94.0, 889.5999999999999, 1068.8999999999992, 1678.5399999999995, 5.085703522320587, 716.8593127347135, 3.719343007108605], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1396.1090909090908, 1005, 2292, 1395.0, 1727.3999999999999, 1775.8, 2292.0, 0.2529212403257626, 304.3493840002598, 1.2436117627345844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbd96d3e-5c70-47c2-9af7-5192f6e95fae", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fe9f3b2-6e42-4c78-b241-e24b44c2500a", 3, 0, 0.0, 298.0, 224, 426, 244.0, 426.0, 426.0, 426.0, 0.017697026899480887, 0.024396780247168473, 0.011348679359367626], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 526.0714285714286, 86, 1090, 499.5, 1060.0, 1090.0, 1090.0, 0.07573831330776264, 0.015537554369289195, 0.050701771262178986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 526.0714285714286, 86, 1090, 499.5, 1060.0, 1090.0, 1090.0, 0.0777009401813762, 0.015940183110590637, 0.05201561962337244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 119.05263157894737, 82, 257, 84.0, 254.0, 257.0, 257.0, 0.09412557342290125, 0.05494851269209048, 0.05201676426002437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 93.89473684210525, 83, 247, 84.0, 95.0, 247.0, 247.0, 0.0941237082759509, 0.06994935741992055, 0.04724568950570192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 224.3157894736842, 82, 653, 88.0, 647.0, 653.0, 653.0, 0.09412697233162419, 5.846651216219564, 0.05372533037328776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 245.78947368421055, 81, 903, 84.0, 896.0, 903.0, 903.0, 0.09412510712923378, 17.850331171758505, 0.053632346712309084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/246e0288-60ad-403d-bbe9-d67ed72b2155", 3, 0, 0.0, 326.3333333333333, 250, 438, 291.0, 438.0, 438.0, 438.0, 0.03773869726017058, 0.024262346057564093, 0.02420092239665887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f285f17-4006-40ca-b30e-fd72767d8fb2", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 188.57142857142856, 81, 289, 198.0, 269.5, 289.0, 289.0, 0.0758939219810482, 0.1368165820088037, 0.04904835289860572], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b6738fb-50bf-46fa-8fde-99e68b499175", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1067ce0d-dde5-4f02-8691-a9bf56814600", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.6823417467948718, 1.274956597222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 101.75, 83, 350, 85.0, 168.7000000000002, 350.0, 350.0, 0.12246647480252282, 0.09101268293429673, 0.061472429734860085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 93.625, 81, 243, 83.5, 135.9000000000001, 243.0, 243.0, 0.12247022442668626, 0.03277035302042191, 0.06984629986834451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 611.8333333333334, 485, 664, 646.0, 664.0, 664.0, 664.0, 0.04398149844965218, 12.932020867388452, 0.02508319833456726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 944.0, 728, 1050, 991.5, 1050.0, 1050.0, 1050.0, 0.04384042086804034, 39.44768776030249, 0.024959927115300304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 136.83333333333334, 81, 247, 83.5, 247.0, 247.0, 247.0, 0.04408782294330306, 0.07801478044264173, 0.024411909774270345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 98.15384615384615, 83, 249, 85.0, 185.79999999999995, 249.0, 249.0, 0.060457805102638755, 0.04493006804991024, 0.030346984201910465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 121.61538461538461, 81, 249, 84.0, 247.8, 249.0, 249.0, 0.060414536666976486, 0.016165608444093316, 0.03445516544288502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 120.99999999999999, 81, 251, 84.0, 249.8, 251.0, 251.0, 0.06041369439035611, 0.016283378566150673, 0.03551664455370545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 108.23076923076923, 82, 249, 83.0, 247.0, 249.0, 249.0, 0.06045977332235756, 0.016295798278291685, 0.03560277667322423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 113.16666666666666, 83, 248, 86.5, 248.0, 248.0, 248.0, 0.04408652715730073, 0.032763522623736184, 0.024755618276804607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a0e89d6-5a4f-45e7-8129-f5fe464bc944", 3, 0, 0.0, 314.3333333333333, 188, 466, 289.0, 466.0, 466.0, 466.0, 0.02814047726249437, 0.028406126299152033, 0.018045813869503227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 531.2222222222223, 81, 1074, 726.5, 985.8000000000002, 1074.0, 1074.0, 0.10407271213487823, 52.03736110990657, 0.05621462250514582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 104.375, 81, 254, 83.5, 248.4, 254.0, 254.0, 0.12246928699911976, 0.033009300011481495, 0.07199854567721688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 401.7777777777777, 81, 735, 486.0, 729.6, 735.0, 735.0, 0.10407211040894558, 17.012831404626585, 0.05631593040466706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 114.6875, 82, 250, 84.0, 247.9, 250.0, 250.0, 0.12247022442668626, 0.03300955267750528, 0.07211869661063654], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 441.69230769230774, 85, 699, 454.0, 691.4, 699.0, 699.0, 0.07416662387822982, 0.014702953757110011, 0.050320984590457606], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 234.15384615384613, 168, 496, 174.0, 432.4, 496.0, 496.0, 0.06038815648893968, 0.09358984799604225, 0.13581437929104304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43f62a0e-4105-4e03-9306-f89d0282e769", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 484.9047619047618, 125, 1083, 418.0, 961.8000000000001, 1071.2999999999997, 1083.0, 0.09196771495263663, 0.056491887407430115, 0.04158305861628003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 85.44444444444446, 83, 92, 84.5, 91.1, 92.0, 92.0, 0.10406910188365075, 0.07734041653658029, 0.05223781090644188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 139.72222222222226, 82, 255, 85.0, 253.2, 255.0, 255.0, 0.10407090697795432, 0.11468577813238975, 0.05449720020351644], "isController": false}, {"data": ["login", 21, 0, 0.0, 2452.5238095238096, 1562, 3410, 2165.0, 3268.8, 3396.7999999999997, 3410.0, 0.09135002283750572, 31.34891154816539, 0.18110702769863193], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 89.37500000000003, 85, 97, 88.0, 96.3, 97.0, 97.0, 0.1248829222603809, 0.10110150640024976, 0.04439197627224477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dc187c4-d36a-44b9-86bb-597c0936c53d", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 627.8333333333334, 168, 1163, 817.0, 1072.1000000000001, 1163.0, 1163.0, 0.10401858465379148, 69.20630930504028, 0.21915460701200837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c83a4b47-4633-4571-b90f-1b944f117afc", 3, 0, 0.0, 342.0, 190, 456, 380.0, 456.0, 456.0, 456.0, 0.04767353165522502, 0.030649487310894993, 0.030571893672133234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ab45b31-336f-41c2-8261-e7394542cb87", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 380.1052631578948, 168, 988, 176.0, 981.0, 988.0, 988.0, 0.09408315960960441, 23.81114883120243, 0.2065274292643192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 616.6363636363636, 81, 1249, 813.0, 1227.2, 1249.0, 1249.0, 0.0790849156307741, 51.61673888407589, 0.12096537743275984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c67fafa-10dd-4b50-817e-28300087d59b", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1198.2608695652175, 163, 2711, 1139.0, 2035.8000000000002, 2588.199999999998, 2711.0, 0.08949729757073205, 0.028059105182671767, 0.040378663552420126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=246e0288-60ad-403d-bbe9-d67ed72b2155", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c14c1ae-1e8f-43c6-8a1d-df0d766612e5", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 239.0, 167, 596, 173.0, 415.4000000000002, 596.0, 596.0, 0.12238778569898724, 0.1896771639690359, 0.27525299850074963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 99.9230769230769, 85, 249, 87.0, 185.79999999999995, 249.0, 249.0, 0.09361745029273458, 0.07268151658469138, 0.03327807803374549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c83a4b47-4633-4571-b90f-1b944f117afc", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 287.4736842105263, 166, 518, 330.0, 505.0, 518.0, 518.0, 0.10112299749853638, 0.15672089553728247, 0.2274279914444622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 84.4, 83, 86, 85.0, 86.0, 86.0, 86.0, 0.03251250105665628, 0.024162122367300226, 0.016319751506954423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 115.4, 81, 248, 83.0, 248.0, 248.0, 248.0, 0.03251292388724518, 0.008699747212016776, 0.018542526904444516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 84.2, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.03251250105665628, 0.008763135050426888, 0.019113794566510824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 83.8, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.03251334672883219, 0.00876336298550555, 0.019146043044419737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.5, 85, 88, 86.5, 88.0, 88.0, 88.0, 0.170852554245686, 0.05038815564667692, 0.10561490902101486], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 969.5454545454547, 655, 1762, 895.0, 1368.0, 1397.1999999999998, 1762.0, 0.24264134961530318, 290.2834099216048, 0.47912188371303027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1198.2608695652175, 163, 2711, 1139.0, 2035.8000000000002, 2588.199999999998, 2711.0, 0.09322762131750896, 0.02922863263453151, 0.04206168071161049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 112.63636363636364, 82, 245, 84.0, 244.8, 245.0, 245.0, 0.0589272034756336, 0.015882722811791868, 0.034700296577936586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 112.72727272727272, 83, 244, 84.0, 244.0, 244.0, 244.0, 0.05887642373897405, 0.01586903608589535, 0.03461289754967029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fe9f3b2-6e42-4c78-b241-e24b44c2500a", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.2584607474964235, 0.9863420958512161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 151.3846153846154, 82, 962, 83.0, 612.3999999999996, 962.0, 962.0, 0.09089192949582946, 6.31374588582925, 0.05283366514714005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 151.92307692307693, 80, 648, 84.0, 489.59999999999985, 648.0, 648.0, 0.0910919117389446, 2.082974768416332, 0.053038867780090114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 97.81818181818181, 81, 244, 83.0, 212.2000000000001, 244.0, 244.0, 0.0589272034756336, 0.015767630617503522, 0.03360692073219729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 86.38461538461539, 83, 99, 85.0, 97.0, 99.0, 99.0, 0.09141667721474481, 0.06793758921916095, 0.04588688680505745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 115.27272727272727, 83, 249, 85.0, 248.8, 249.0, 249.0, 0.0589272034756336, 0.04379257992671599, 0.02957869393210515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 83.3076923076923, 81, 86, 84.0, 85.6, 86.0, 86.0, 0.09142696392151346, 0.035026856670651946, 0.05155129140586539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 152.8181818181818, 85, 264, 102.0, 263.4, 264.0, 264.0, 0.06108531953175326, 0.0480808276783136, 0.02171392217730292], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 578.0, 84, 1834, 449.0, 1533.9999999999998, 1834.0, 1834.0, 0.07512149457102738, 0.014576233509387297, 0.051121215393549954], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1404.3333333333333, 933, 2020, 1355.0, 1801.2, 1999.7999999999997, 2020.0, 0.09256565549707757, 0.04790995841157335, 0.042576585682737825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ab51834-4e1b-4344-915d-01a1940c7873", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 244.27272727272728, 168, 495, 171.0, 494.6, 495.0, 495.0, 0.05884964984458342, 0.09120546318686903, 0.13235424178913635], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 918.6610169491527, 439, 3311, 752.0, 1563.0, 1722.0, 3311.0, 0.28375616207767224, 87.39815663700853, 1.032063469400024], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9f285f17-4006-40ca-b30e-fd72767d8fb2", 3, 0, 0.0, 507.3333333333333, 172, 1084, 266.0, 1084.0, 1084.0, 1084.0, 0.022359859580081836, 0.022425366981195356, 0.014338842243737375], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 158.85454545454553, 83, 570, 86.0, 339.8, 344.0, 570.0, 0.2435018218363579, 0.18096180314205895, 0.1177084002040988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbd96d3e-5c70-47c2-9af7-5192f6e95fae", 3, 0, 0.0, 658.6666666666666, 234, 1304, 438.0, 1304.0, 1304.0, 1304.0, 0.04033938872379621, 0.025934340081216638, 0.025868683524049], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 533.8363636363637, 403, 738, 490.0, 658.8, 732.0, 738.0, 0.2436237032574704, 71.6334578259685, 0.1225255929468723], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 120.74545454545454, 82, 349, 86.0, 247.4, 251.79999999999998, 349.0, 0.24406262203131102, 0.4318764366413433, 0.11869451735507118], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 808.9636363636363, 567, 1156, 805.0, 1047.2, 1076.1999999999998, 1156.0, 0.2432917820459512, 218.9143731462825, 0.12212107028478408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 101.89473684210525, 85, 349, 88.0, 98.0, 349.0, 349.0, 0.10047593865679534, 0.07506259089106293, 0.03571605631940772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a0e89d6-5a4f-45e7-8129-f5fe464bc944", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, 4.624277456647399, 161.91907514450855, 82, 2077, 90.0, 282.79999999999995, 359.79999999999905, 1752.139999999996, 0.7202721213054828, 1.5324119527180904, 0.34701558707382163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 86.6, 83, 89, 87.0, 89.0, 89.0, 89.0, 0.033243354653404784, 0.025744121328271478, 0.011816973724452482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 99.57894736842104, 85, 252, 87.0, 121.0, 252.0, 252.0, 0.0919954292797242, 0.07465644700336993, 0.03270150025177696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 202.8, 170, 333, 170.0, 333.0, 333.0, 333.0, 0.03249454091712592, 0.0503601918315223, 0.07308098411341894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43f62a0e-4105-4e03-9306-f89d0282e769", 3, 0, 0.0, 429.0, 241, 603, 443.0, 603.0, 603.0, 603.0, 0.06779048221629683, 0.03067342782573327, 0.04347241209834139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 264.3076923076923, 167, 1047, 171.0, 762.9999999999998, 1047.0, 1047.0, 0.0908284251049767, 8.488582255619136, 0.20248761807695262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dc187c4-d36a-44b9-86bb-597c0936c53d", 3, 0, 0.0, 314.6666666666667, 203, 449, 292.0, 449.0, 449.0, 449.0, 0.018726591760299626, 0.02581611852372035, 0.01200891463795256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ab45b31-336f-41c2-8261-e7394542cb87", 3, 0, 0.0, 781.6666666666666, 186, 1834, 325.0, 1834.0, 1834.0, 1834.0, 0.023489249753362876, 0.023558065914749682, 0.015063093103556273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b6738fb-50bf-46fa-8fde-99e68b499175", 3, 0, 0.0, 331.0, 195, 501, 297.0, 501.0, 501.0, 501.0, 0.021983014457495842, 0.025983178872124806, 0.01409718049520404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 103.61538461538461, 85, 251, 91.0, 193.79999999999995, 251.0, 251.0, 0.06120757843986591, 0.05074729892133414, 0.021757381398546084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ab51834-4e1b-4344-915d-01a1940c7873", 3, 0, 0.0, 404.66666666666663, 201, 799, 214.0, 799.0, 799.0, 799.0, 0.042118859421286875, 0.02707836828028697, 0.027009815449197633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 91.2222222222222, 85, 121, 86.0, 111.10000000000002, 121.0, 121.0, 0.10289418476365778, 0.07988366883506633, 0.03657566724020647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 103.05263157894736, 82, 262, 84.0, 259.0, 262.0, 262.0, 0.10117145899893504, 0.07518699247870074, 0.05078333000532481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18c5063d-a0d2-4d98-8af5-923c3335af62", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 139.94736842105263, 81, 330, 83.0, 255.0, 330.0, 330.0, 0.10117038157208123, 0.02707098100659205, 0.05769873324032758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 135.57894736842104, 82, 251, 84.0, 248.0, 251.0, 251.0, 0.10117145899893504, 0.027268869808306707, 0.05947775226304579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 143.21052631578945, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.1011709202826396, 0.027268724607430208, 0.05957623528362469], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5401234567901234], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.23148148148148148], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15432098765432098], "isController": false}, {"data": ["401/Unauthorized", 13, 52.0, 1.0030864197530864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 25, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
