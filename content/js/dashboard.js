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

    var data = {"OkPercent": 99.48415622697127, "KoPercent": 0.5158437730287398};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8212698412698413, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fdf74fb-d190-4968-bd8a-38702d56cd8d"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1911686-d373-4ca4-a6e0-605dbc3a7192"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8a939296-5878-4238-aa10-eb04a1a22d51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6366b854-2b45-43fd-8b8a-138dda745510"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef1ac8ae-1cac-40f2-b5cf-bcb63d51aa1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3711afb0-71be-4c9b-b743-5eab3c43e510"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b8faae3-612d-44d0-86c0-383bcf0cce09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5242e13-2c9e-41f0-95e2-a4748feebf76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9de0dc6-5bbd-4eb7-a113-266fdebb04a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be3d0173-19d1-4ec7-9751-3af0b29921e8"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7e41170-a636-4811-b276-a1e6e8e78d27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f5b847d-8de3-4c0f-b8b9-87ea5ecc21ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0e920c7-0af5-4fa7-9978-e9e3d34479cf"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df88c6aa-3c99-4fb8-9560-2f2c3d50fe64"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f09fa35-60e9-4d3d-b123-11aacc802f5c"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5151fef4-b594-4b26-a4fa-6556f4588ada"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1389c2b-dc99-4bb4-a4e3-56aab6e89215"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6366b854-2b45-43fd-8b8a-138dda745510"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b8faae3-612d-44d0-86c0-383bcf0cce09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f13742d2-711c-45cd-bc5d-f973eb553c97"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fba95fe-5da1-4196-b727-0a8148736969"], "isController": false}, {"data": [0.48360655737704916, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1911686-d373-4ca4-a6e0-605dbc3a7192"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5242e13-2c9e-41f0-95e2-a4748feebf76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a939296-5878-4238-aa10-eb04a1a22d51"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3711afb0-71be-4c9b-b743-5eab3c43e510"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7540983606557377, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.963276836158192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9fdf74fb-d190-4968-bd8a-38702d56cd8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f5b847d-8de3-4c0f-b8b9-87ea5ecc21ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7e41170-a636-4811-b276-a1e6e8e78d27"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be3d0173-19d1-4ec7-9751-3af0b29921e8"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f09fa35-60e9-4d3d-b123-11aacc802f5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fba95fe-5da1-4196-b727-0a8148736969"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1389c2b-dc99-4bb4-a4e3-56aab6e89215"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 7, 0.5158437730287398, 314.9476787030214, 81, 3142, 100.0, 884.2, 1015.2999999999997, 1492.4000000000015, 5.2371579637991585, 769.8664154762938, 3.8208427103836207], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fdf74fb-d190-4968-bd8a-38702d56cd8d", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["see books", 61, 0, 0.0, 1380.9836065573777, 1014, 1915, 1354.0, 1666.8000000000002, 1850.6, 1915.0, 0.2669385647457301, 321.21713130888514, 1.3125348373972177], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1911686-d373-4ca4-a6e0-605dbc3a7192", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a939296-5878-4238-aa10-eb04a1a22d51", 3, 0, 0.0, 611.3333333333334, 173, 940, 721.0, 940.0, 940.0, 940.0, 0.01885855455465523, 0.025998039888985976, 0.012093539216364196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6366b854-2b45-43fd-8b8a-138dda745510", 3, 0, 0.0, 552.3333333333334, 293, 970, 394.0, 970.0, 970.0, 970.0, 0.01922091235263967, 0.02649757936635059, 0.012325910590722706], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 615.8461538461538, 365, 2344, 429.0, 1707.5999999999995, 2344.0, 2344.0, 0.11512575274530641, 0.020799086189337585, 0.07824953506907545], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 615.8461538461538, 365, 2344, 429.0, 1707.5999999999995, 2344.0, 2344.0, 0.11274934952298353, 0.02036975552905464, 0.07663432350390287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 111.15789473684211, 82, 253, 85.0, 251.0, 253.0, 253.0, 0.0903578647009868, 0.05274900428010938, 0.04993460944001902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 87.31578947368422, 83, 107, 86.0, 90.0, 107.0, 107.0, 0.09035743499020335, 0.06715039846439917, 0.045355196860316915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 235.68421052631578, 81, 675, 86.0, 669.0, 675.0, 675.0, 0.09035743499020335, 5.612508233226807, 0.05157377238724343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 269.3684210526316, 82, 963, 86.0, 963.0, 963.0, 963.0, 0.09035700528350699, 17.1357304888314, 0.05148528785839631], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 234.28571428571428, 168, 330, 223.5, 329.0, 330.0, 330.0, 0.08091409812568272, 0.16585809762285939, 0.05230970015547066], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 110.35714285714286, 84, 253, 86.0, 252.5, 253.0, 253.0, 0.06877612878821374, 0.051111947273272125, 0.03452239277064635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 85.0, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.06877646665815149, 0.03316008213875161, 0.038398914559977994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 660.25, 644, 670, 663.5, 670.0, 670.0, 670.0, 0.212021626205873, 62.34139788508428, 0.12091858369553694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 900.5, 833, 928, 920.5, 928.0, 928.0, 928.0, 0.20991865652059827, 188.88517613487275, 0.1195142351088953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef1ac8ae-1cac-40f2-b5cf-bcb63d51aa1e", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 83.75, 82, 85, 84.0, 85.0, 85.0, 85.0, 0.21850759313886156, 0.3866560144215011, 0.1209900442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 85.71428571428572, 83, 91, 85.0, 89.5, 91.0, 91.0, 0.06253014846443822, 0.04647015916156004, 0.03138720342843871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 108.5, 82, 252, 84.5, 247.5, 252.0, 252.0, 0.0625307070436375, 0.016731849345660816, 0.03566204386082451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 97.21428571428571, 81, 254, 86.0, 172.5, 254.0, 254.0, 0.06253042775279043, 0.016853904355244295, 0.03676105225310531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 98.07142857142856, 82, 248, 86.0, 172.5, 248.0, 248.0, 0.06253042775279043, 0.016853904355244295, 0.036822117123957644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3711afb0-71be-4c9b-b743-5eab3c43e510", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b8faae3-612d-44d0-86c0-383bcf0cce09", 3, 0, 0.0, 439.66666666666663, 270, 721, 328.0, 721.0, 721.0, 721.0, 0.041795536236729915, 0.02648955372816183, 0.026802476037225888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 86.75, 86, 88, 86.5, 88.0, 88.0, 88.0, 0.21848372296263927, 0.16236925114703954, 0.1226837311557789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 569.7222222222222, 81, 1240, 756.0, 1105.0000000000002, 1240.0, 1240.0, 0.08185985592665357, 40.93071849361948, 0.044216402213854325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 214.78571428571428, 82, 920, 86.0, 902.0, 920.0, 920.0, 0.06877545305829702, 8.856499479885636, 0.03958810258350077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 391.44444444444446, 82, 736, 492.0, 690.1, 736.0, 736.0, 0.08179884754512569, 13.371786128960428, 0.044263330371912095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 179.71428571428572, 82, 670, 86.0, 664.0, 670.0, 670.0, 0.0687757909215956, 2.9047984930732955, 0.03965546092061309], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 551.8461538461538, 178, 1890, 419.0, 1454.7999999999997, 1890.0, 1890.0, 0.11292760471863653, 0.020401959836863045, 0.0778582899720287], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5242e13-2c9e-41f0-95e2-a4748feebf76", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9de0dc6-5bbd-4eb7-a113-266fdebb04a8", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.8144087357954546, 3.3902254971590913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 208.78571428571428, 169, 342, 175.5, 340.5, 342.0, 342.0, 0.06250613899579423, 0.09687230721320844, 0.14057777158917392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 521.4347826086956, 109, 1011, 426.0, 965.0000000000001, 1009.4, 1011.0, 0.10186321099414065, 0.06257027315948678, 0.046057291689733514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 86.50000000000001, 82, 91, 86.5, 90.1, 91.0, 91.0, 0.08185613329816552, 0.060832536562406204, 0.041087941909430735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 159.44444444444446, 81, 261, 89.0, 253.8, 261.0, 261.0, 0.08179810410172048, 0.09014122669890118, 0.04283394644041917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be3d0173-19d1-4ec7-9751-3af0b29921e8", 3, 0, 0.0, 710.3333333333334, 168, 1387, 576.0, 1387.0, 1387.0, 1387.0, 0.034937345693389854, 0.029125827578376114, 0.022404482752597012], "isController": false}, {"data": ["login", 23, 0, 0.0, 2301.95652173913, 1324, 3658, 2157.0, 3383.400000000001, 3649.4, 3658.0, 0.10222313087227441, 21.41125803062694, 0.18371257050062667], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7e41170-a636-4811-b276-a1e6e8e78d27", 3, 0, 0.0, 307.6666666666667, 230, 370, 323.0, 370.0, 370.0, 370.0, 0.020802274381999098, 0.02458758407585896, 0.013340000173352287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 93.21428571428571, 88, 112, 90.0, 108.0, 112.0, 112.0, 0.06831701044762283, 0.05530742349714777, 0.024284562307553423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f5b847d-8de3-4c0f-b8b9-87ea5ecc21ad", 3, 0, 0.0, 258.6666666666667, 173, 420, 183.0, 420.0, 420.0, 420.0, 0.021711283353959054, 0.025662001906974388, 0.013922925848730252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0e920c7-0af5-4fa7-9978-e9e3d34479cf", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 676.4444444444443, 169, 1335, 842.0, 1189.2000000000003, 1335.0, 1335.0, 0.08176354890141586, 54.3994467333191, 0.1722659319681849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df88c6aa-3c99-4fb8-9560-2f2c3d50fe64", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f09fa35-60e9-4d3d-b123-11aacc802f5c", 1, 0, 0.0, 1890.0, 1890, 1890, 1890.0, 1890.0, 1890.0, 1890.0, 0.5291005291005292, 0.09558945105820106, 0.36479001322751325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 401.00000000000006, 169, 1071, 333.0, 1051.0, 1071.0, 1071.0, 0.09032049514646182, 22.85887040108242, 0.19826778511565776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5151fef4-b594-4b26-a4fa-6556f4588ada", 2, 0, 0.0, 186.5, 183, 190, 186.5, 190.0, 190.0, 190.0, 0.014933508553167022, 0.029086799618448858, 0.009282400580166808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 987.5, 919, 1015, 1008.0, 1015.0, 1015.0, 1015.0, 0.2089754976229037, 250.00734679483833, 0.47121525782352025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1389c2b-dc99-4bb4-a4e3-56aab6e89215", 3, 0, 0.0, 307.6666666666667, 179, 401, 343.0, 401.0, 401.0, 401.0, 0.08633590422470358, 0.04002028893749281, 0.05536514691493036], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 892.6086956521739, 217, 1915, 924.0, 1187.2, 1771.999999999998, 1915.0, 0.10830409907470628, 0.034452034233513056, 0.048863763449720994], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 339.0714285714286, 172, 1174, 175.0, 1155.0, 1174.0, 1174.0, 0.0687464092277323, 11.840552371260072, 0.15209951226877882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 90.73333333333332, 86, 102, 89.0, 99.6, 102.0, 102.0, 0.08332361224523806, 0.06468971849117604, 0.02961894029029947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6366b854-2b45-43fd-8b8a-138dda745510", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 303.3157894736842, 167, 985, 184.0, 512.0, 985.0, 985.0, 0.09948321089917114, 6.410091475466917, 0.22240040388874635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b8faae3-612d-44d0-86c0-383bcf0cce09", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 124.88888888888889, 84, 258, 88.0, 258.0, 258.0, 258.0, 0.04983940635729317, 0.03703885570107431, 0.02501704576918817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 123.44444444444444, 84, 262, 86.0, 262.0, 262.0, 262.0, 0.04983940635729317, 0.02165331847380662, 0.027958955172222837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 170.44444444444446, 83, 696, 85.0, 696.0, 696.0, 696.0, 0.049839130362551984, 4.994755859212764, 0.028824063024349186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 186.0, 81, 670, 85.0, 670.0, 670.0, 670.0, 0.049840234359857565, 1.6402390842964498, 0.02887337361624127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f13742d2-711c-45cd-bc5d-f973eb553c97", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.7788681402439025, 1.4553163109756098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fba95fe-5da1-4196-b727-0a8148736969", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 946.7540983606556, 656, 1551, 904.0, 1317.8000000000002, 1478.1999999999998, 1551.0, 0.2682202924040893, 320.8847181763218, 0.5296303039463559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 892.6086956521739, 217, 1915, 924.0, 1187.2, 1771.999999999998, 1915.0, 0.10254809728693404, 0.032621023474597055, 0.04626681733062844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 145.36363636363637, 82, 259, 86.0, 257.6, 259.0, 259.0, 0.060541682948710186, 0.016317875482269543, 0.035651010564523675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 152.0, 83, 330, 85.0, 314.6, 330.0, 330.0, 0.0605413497418737, 0.016317785672614396, 0.03559169193809372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 118.19999999999999, 82, 251, 86.0, 248.6, 251.0, 251.0, 0.08067986230636834, 0.02174574413726334, 0.04743093467620482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 109.26666666666667, 83, 275, 86.0, 260.0, 275.0, 275.0, 0.08067942835935693, 0.021745627174982924, 0.047509468067082256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 131.4545454545455, 81, 267, 85.0, 264.8, 267.0, 267.0, 0.060542349373386685, 0.016199808328425734, 0.03452805862700959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 109.19999999999999, 84, 256, 87.0, 251.2, 256.0, 256.0, 0.0806789944170136, 0.059957729249362636, 0.040497073369477526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 131.36363636363637, 84, 256, 87.0, 255.4, 256.0, 256.0, 0.06054101653870497, 0.044991907798783676, 0.030388752442279645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 108.20000000000002, 82, 250, 85.0, 249.4, 250.0, 250.0, 0.08067942835935693, 0.021588050166468555, 0.04601248648619575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 90.18181818181819, 86, 102, 89.0, 100.0, 102.0, 102.0, 0.06071947052621701, 0.047792864496221596, 0.021583874288616203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1911686-d373-4ca4-a6e0-605dbc3a7192", 3, 0, 0.0, 331.0, 253, 436, 304.0, 436.0, 436.0, 436.0, 0.05374514054354253, 0.034552946801268386, 0.03446547098658163], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 679.3076923076924, 370, 2077, 500.0, 1766.1999999999998, 2077.0, 2077.0, 0.10982326901632142, 0.01984111793751901, 0.07475275244567972], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1292.9565217391303, 708, 3142, 1110.0, 2512.8, 3035.9999999999986, 3142.0, 0.10076317149891789, 0.05215281337346336, 0.04634712282811555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 316.90909090909093, 170, 576, 336.0, 565.4000000000001, 576.0, 576.0, 0.06051237478064264, 0.09378236208679674, 0.13609374914044922], "isController": false}, {"data": ["addBook", 58, 3, 5.172413793103448, 1035.4999999999993, 433, 3286, 767.5, 1618.5, 2778.0499999999997, 3286.0, 0.2637742456283967, 98.9725364252905, 0.9558307822839212], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5242e13-2c9e-41f0-95e2-a4748feebf76", 3, 0, 0.0, 322.0, 180, 500, 286.0, 500.0, 500.0, 500.0, 0.04420931637660443, 0.02842233067831828, 0.028350375410778235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a939296-5878-4238-aa10-eb04a1a22d51", 1, 0, 0.0, 802.0, 802, 802, 802.0, 802.0, 802.0, 802.0, 1.2468827930174564, 0.22526691084788028, 0.8596672381546134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3711afb0-71be-4c9b-b743-5eab3c43e510", 3, 0, 0.0, 864.3333333333334, 241, 2077, 275.0, 2077.0, 2077.0, 2077.0, 0.1035983148007459, 0.04687553957455626, 0.06643511723875958], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 155.85245901639342, 83, 353, 88.0, 341.6, 345.9, 353.0, 0.2692942724198519, 0.2001298254995188, 0.13017643051545572], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 531.7049180327867, 403, 760, 500.0, 699.4000000000001, 748.0, 760.0, 0.26915643725125094, 79.14092938669839, 0.135366762875385], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 125.81967213114754, 82, 264, 88.0, 253.8, 260.6, 264.0, 0.26944534014161337, 0.47679194954746434, 0.1310388470610581], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 789.4754098360658, 566, 1169, 748.0, 989.4000000000001, 1125.1, 1169.0, 0.26867157322621704, 241.7511538631999, 0.13486053577956597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 100.89473684210525, 84, 255, 89.0, 121.0, 255.0, 255.0, 0.0989531795218999, 0.07392498274829436, 0.035174763033175356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 3, 1.694915254237288, 180.61581920903956, 84, 2471, 92.0, 282.20000000000005, 342.2, 2289.2599999999998, 0.7332896950012014, 1.6751879443238407, 0.3493653173135083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 91.55555555555556, 86, 98, 91.0, 98.0, 98.0, 98.0, 0.05310768468197348, 0.0411273378445361, 0.01887812228929526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fdf74fb-d190-4968-bd8a-38702d56cd8d", 3, 0, 0.0, 603.0, 179, 1300, 330.0, 1300.0, 1300.0, 1300.0, 0.05808775122952407, 0.03734482704372071, 0.037250283177787245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 100.36842105263158, 84, 261, 88.0, 107.0, 261.0, 261.0, 0.09511366082468549, 0.07718696498565786, 0.03380993412127493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f5b847d-8de3-4c0f-b8b9-87ea5ecc21ad", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7e41170-a636-4811-b276-a1e6e8e78d27", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be3d0173-19d1-4ec7-9751-3af0b29921e8", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 317.55555555555554, 170, 945, 177.0, 945.0, 945.0, 945.0, 0.04981568197668626, 6.690501221867978, 0.11062043529219666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 253.53333333333327, 169, 524, 178.0, 513.2, 524.0, 524.0, 0.08064125929390513, 0.12497820165959712, 0.18136408218150735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f09fa35-60e9-4d3d-b123-11aacc802f5c", 3, 0, 0.0, 349.3333333333333, 263, 521, 264.0, 521.0, 521.0, 521.0, 0.0663012729844413, 0.029999599429809055, 0.04251741789692362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 89.92857142857143, 84, 110, 88.5, 104.5, 110.0, 110.0, 0.0644433703882713, 0.05343009908168197, 0.022907604317705815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fba95fe-5da1-4196-b727-0a8148736969", 3, 0, 0.0, 267.6666666666667, 192, 394, 217.0, 394.0, 394.0, 394.0, 0.03685096242430198, 0.024123465310960702, 0.023631639315063444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 91.0, 85, 109, 88.0, 100.9, 109.0, 109.0, 0.08260101415689604, 0.06412871704563707, 0.02936207925108414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 103.05263157894736, 83, 254, 86.0, 251.0, 254.0, 254.0, 0.09952698490856612, 0.0739648784330262, 0.04995788109668261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 111.1578947368421, 82, 251, 85.0, 250.0, 251.0, 251.0, 0.09952802761640851, 0.034499229967365284, 0.056322141450280507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 171.8421052631579, 82, 900, 86.0, 256.0, 900.0, 900.0, 0.09952698490856612, 4.738811439906654, 0.058060818190389885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1389c2b-dc99-4bb4-a4e3-56aab6e89215", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 168.47368421052633, 82, 651, 87.0, 264.0, 651.0, 651.0, 0.09952750625975632, 1.5656450200888414, 0.05815831716011357], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.2947678703021371], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.2210759027266028], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
