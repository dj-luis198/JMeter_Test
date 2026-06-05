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

    var data = {"OkPercent": 99.17293233082707, "KoPercent": 0.8270676691729323};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8262987012987013, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4017857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2810ce88-34f8-4e9d-813b-d44ccf13d927"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95e28263-8dd0-4520-82a4-ced5f8d65552"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10c31226-dd4f-4d4d-9aac-a82c8f39e770"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8761009b-7368-4f4f-9a18-9990d1fc14b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09edea54-6267-4da6-a47d-532d8e920cfd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5202928-e1b7-4dba-aa5f-76d2657ea094"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c9f12db-e4c3-4afb-b831-4d4c5d767d6d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/294d20ec-00ec-419f-8b67-77ec4ef83cfe"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0ead8c1-41de-4b8a-a224-61662730667b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/811b1fd1-ab51-45c2-8053-9dbccbe83023"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/394313ca-bd31-400a-9762-d4df2dc821cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10c31226-dd4f-4d4d-9aac-a82c8f39e770"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02508a68-cdc7-4dc5-b148-38a4c4266f92"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/61593fe1-8ec0-4b88-b6a7-c548c242d589"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76813ed4-6ee4-4eb1-96b1-ca1d5c2b946f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5202928-e1b7-4dba-aa5f-76d2657ea094"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2810ce88-34f8-4e9d-813b-d44ccf13d927"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95e28263-8dd0-4520-82a4-ced5f8d65552"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0ead8c1-41de-4b8a-a224-61662730667b"], "isController": false}, {"data": [0.4609375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8761009b-7368-4f4f-9a18-9990d1fc14b3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.967391304347826, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88f4cdf8-8d03-4ced-b7dc-8d09d9969773"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09edea54-6267-4da6-a47d-532d8e920cfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02508a68-cdc7-4dc5-b148-38a4c4266f92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/762f3edd-6d43-4361-822e-5c4609ba12a7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76813ed4-6ee4-4eb1-96b1-ca1d5c2b946f"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=394313ca-bd31-400a-9762-d4df2dc821cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=811b1fd1-ab51-45c2-8053-9dbccbe83023"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 11, 0.8270676691729323, 308.93759398496235, 77, 3884, 90.0, 846.9000000000001, 1011.3500000000001, 1965.570000000003, 5.351272838468007, 715.8680406420119, 3.91960932187705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1360.2321428571431, 957, 3867, 1302.5, 1561.2000000000003, 1646.95, 3867.0, 0.2560772621682427, 308.14790566096514, 1.259129897477639], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2810ce88-34f8-4e9d-813b-d44ccf13d927", 3, 0, 0.0, 467.6666666666667, 187, 798, 418.0, 798.0, 798.0, 798.0, 0.018244402009316808, 0.025151381025213766, 0.011699697903110063], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 1113.6153846153845, 83, 3663, 560.0, 3644.2, 3663.0, 3663.0, 0.08974863478519009, 0.01700315932453797, 0.060670670405042496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 1113.6153846153845, 83, 3663, 560.0, 3644.2, 3663.0, 3663.0, 0.09069915091641026, 0.01718323757596054, 0.061313225593207336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 118.8, 77, 239, 79.5, 235.9, 238.85, 239.0, 0.11541546682670945, 0.03088265420949061, 0.06582288342460772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 112.7, 79, 240, 80.5, 237.70000000000002, 239.9, 240.0, 0.11551545885628145, 0.08584693768518573, 0.057983345558719396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 142.2, 78, 238, 81.0, 237.0, 237.95, 238.0, 0.11551412448957196, 0.03113466636632994, 0.06802247760469911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95e28263-8dd0-4520-82a4-ced5f8d65552", 3, 0, 0.0, 366.0, 194, 642, 262.0, 642.0, 642.0, 642.0, 0.042796005706134094, 0.03503644347360913, 0.027444053138373753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 110.7, 77, 236, 79.0, 234.0, 235.9, 236.0, 0.11541613286705216, 0.031108254561822653, 0.06785206248629433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10c31226-dd4f-4d4d-9aac-a82c8f39e770", 3, 0, 0.0, 559.3333333333334, 193, 1035, 450.0, 1035.0, 1035.0, 1035.0, 0.021222260736695413, 0.025083993728821953, 0.013609327360445952], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 262.8461538461538, 79, 942, 198.0, 691.9999999999998, 942.0, 942.0, 0.09088875216734717, 0.2481757250999776, 0.058751330558895906], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 80.43478260869564, 78, 83, 81.0, 82.0, 82.8, 83.0, 0.11038110275520831, 0.08203126874679055, 0.05540613946892292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 79.60869565217389, 77, 82, 80.0, 81.0, 81.8, 82.0, 0.11038375151177747, 0.02953627725998733, 0.06295323328406059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 509.5, 469, 624, 472.5, 624.0, 624.0, 624.0, 0.06750029531379201, 19.847328042997688, 0.038496262171146996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 873.5, 846, 929, 859.5, 929.0, 929.0, 929.0, 0.06707245501953485, 60.3519129273773, 0.03818675905897346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 159.5, 82, 237, 159.5, 237.0, 237.0, 237.0, 0.0679497851088046, 0.12023926818081439, 0.03762453921551973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8761009b-7368-4f4f-9a18-9990d1fc14b3", 3, 0, 0.0, 761.6666666666666, 185, 1898, 202.0, 1898.0, 1898.0, 1898.0, 0.02383828110101074, 0.02817604123625326, 0.015286918544593478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 92.92307692307693, 78, 235, 81.0, 177.39999999999995, 235.0, 235.0, 0.0776518092871564, 0.05770803405031838, 0.03897756833359218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 135.0, 78, 242, 80.0, 240.8, 242.0, 242.0, 0.07765320080520396, 0.03872160058180167, 0.04328325946323718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 211.15384615384613, 78, 857, 80.0, 821.8, 857.0, 857.0, 0.07765273696031348, 10.767258974117745, 0.04462465728263207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 192.30769230769232, 79, 615, 81.0, 555.8, 615.0, 615.0, 0.07765320080520396, 3.5304206414154384, 0.04470075704404131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.06795440259585818, 0.050501269897898514, 0.038157989738885206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09edea54-6267-4da6-a47d-532d8e920cfd", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5202928-e1b7-4dba-aa5f-76d2657ea094", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 605.1333333333334, 80, 1005, 852.0, 959.4, 1005.0, 1005.0, 0.07268815328477765, 43.6098159747966, 0.03856825841607668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 79.39130434782608, 77, 82, 80.0, 81.0, 81.8, 82.0, 0.11038375151177747, 0.02975187052465877, 0.06489357266610354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 459.0, 78, 795, 619.0, 741.0, 795.0, 795.0, 0.07268850552432643, 14.255086681042837, 0.03863943018269044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 86.52173913043477, 77, 235, 80.0, 81.0, 204.19999999999956, 235.0, 0.11038269199389536, 0.029751584951479604, 0.06500074538312392], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 648.9166666666667, 90, 2017, 436.5, 1846.6000000000006, 2017.0, 2017.0, 0.08429274871629168, 0.016031262512204887, 0.057615136431326], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 352.99999999999994, 160, 948, 313.0, 908.4, 948.0, 948.0, 0.07761472052730248, 14.387041709329887, 0.1715021788093902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c9f12db-e4c3-4afb-b831-4d4c5d767d6d", 1, 0, 0.0, 1353.0, 1353, 1353, 1353.0, 1353.0, 1353.0, 1353.0, 0.7390983000739099, 0.23602064855875832, 0.4410049427198818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 570.8499999999999, 87, 1423, 495.5, 1205.7000000000005, 1413.35, 1423.0, 0.08497765087781914, 0.05219818593959789, 0.038422512066826425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 92.33333333333334, 79, 237, 81.0, 147.60000000000005, 237.0, 237.0, 0.07268709658661394, 0.0540184379906379, 0.0364855152788277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 123.73333333333332, 79, 248, 81.0, 247.4, 248.0, 248.0, 0.07268885776728905, 0.09223345298726976, 0.03738554533604059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/294d20ec-00ec-419f-8b67-77ec4ef83cfe", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["login", 20, 0, 0.0, 2827.05, 1431, 5457, 2628.0, 4903.300000000003, 5435.599999999999, 5457.0, 0.08621730208818305, 20.748783123609744, 0.15867688233924784], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e0ead8c1-41de-4b8a-a224-61662730667b", 3, 0, 0.0, 301.0, 174, 500, 229.0, 500.0, 500.0, 500.0, 0.03286590709903593, 0.02739895445333041, 0.021076118810254164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 84.08695652173915, 80, 101, 82.0, 90.0, 98.79999999999997, 101.0, 0.11231675277617713, 0.09092830864399497, 0.039925095713406716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/811b1fd1-ab51-45c2-8053-9dbccbe83023", 3, 0, 0.0, 692.3333333333334, 317, 1314, 446.0, 1314.0, 1314.0, 1314.0, 0.016257959626066926, 0.022412909836065573, 0.01042583999458068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/394313ca-bd31-400a-9762-d4df2dc821cb", 3, 0, 0.0, 410.66666666666663, 220, 746, 266.0, 746.0, 746.0, 746.0, 0.02077677433652834, 0.024557443885395314, 0.013323647605130478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10c31226-dd4f-4d4d-9aac-a82c8f39e770", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 712.2, 161, 1088, 941.0, 1044.2, 1088.0, 1088.0, 0.07265892929801786, 57.98776223061702, 0.15101798944265757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02508a68-cdc7-4dc5-b148-38a4c4266f92", 3, 0, 0.0, 638.6666666666666, 198, 988, 730.0, 988.0, 988.0, 988.0, 0.017036162093403598, 0.023485724760925857, 0.010924882592449572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61593fe1-8ec0-4b88-b6a7-c548c242d589", 2, 0, 0.0, 674.0, 406, 942, 674.0, 942.0, 942.0, 942.0, 0.08202099737532809, 0.05042208774196194, 0.05098277815370735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76813ed4-6ee4-4eb1-96b1-ca1d5c2b946f", 3, 0, 0.0, 427.33333333333337, 260, 717, 305.0, 717.0, 717.0, 717.0, 0.0189642965510266, 0.026143813767447153, 0.012161349025235156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 295.0, 161, 474, 315.5, 473.0, 473.95, 474.0, 0.11535888148028517, 0.17878373526290287, 0.259444828172946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 779.2, 79, 1010, 933.0, 1010.0, 1010.0, 1010.0, 0.08372965369415232, 80.14030080924711, 0.16185007472871593], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1325.3809523809523, 720, 3157, 1110.0, 2506.8, 3105.0999999999995, 3157.0, 0.08840430234271401, 0.02807033930413185, 0.03988553484602918], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 101.44444444444444, 80, 239, 85.0, 236.3, 239.0, 239.0, 0.09515250832584449, 0.07387328527250622, 0.03382374319395253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 168.21739130434784, 158, 317, 161.0, 165.2, 286.79999999999956, 317.0, 0.11033821060206285, 0.1710026760014392, 0.24815322169585033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 327.00000000000006, 160, 926, 315.0, 569.1999999999997, 926.0, 926.0, 0.1474516878881449, 10.591754252246469, 0.3294030727413871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5202928-e1b7-4dba-aa5f-76d2657ea094", 3, 0, 0.0, 488.33333333333337, 166, 999, 300.0, 999.0, 999.0, 999.0, 0.019444282408757705, 0.022982483537174227, 0.01246915245613694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 88.2, 78, 119, 81.0, 119.0, 119.0, 119.0, 0.026690011530084982, 0.019835057396869794, 0.013397134693812186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 80.8, 78, 85, 80.0, 85.0, 85.0, 85.0, 0.026690011530084982, 0.015159092486227953, 0.014773338413332194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 268.2, 78, 865, 81.0, 865.0, 865.0, 865.0, 0.026578779502445245, 4.788857552692431, 0.015168592520731447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 219.0, 79, 615, 84.0, 615.0, 615.0, 615.0, 0.02661428974444959, 1.570835678717617, 0.015214848844141397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 3.2769097222222223, 6.868489583333334], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 953.4107142857142, 621, 3534, 852.5, 1225.0000000000002, 1304.6, 3534.0, 0.25247174345264123, 302.0439785489187, 0.4985330715441803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1325.3809523809523, 720, 3157, 1110.0, 2506.8, 3105.0999999999995, 3157.0, 0.08886819999576819, 0.028217637163834873, 0.04009483241996572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 96.33333333333333, 78, 232, 80.0, 232.0, 232.0, 232.0, 0.04248429261292561, 0.011450844493327606, 0.025017605903900533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 96.44444444444444, 78, 233, 80.0, 233.0, 233.0, 233.0, 0.04251479751146718, 0.01145906651676264, 0.02499405088076489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 88.94444444444444, 79, 238, 80.0, 96.70000000000022, 238.0, 238.0, 0.09971746717633372, 0.0268769735748712, 0.05862296410171182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2810ce88-34f8-4e9d-813b-d44ccf13d927", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 97.27777777777777, 78, 237, 80.0, 235.2, 237.0, 237.0, 0.09971691475865736, 0.02687682468104437, 0.058720019140107806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 79.44444444444444, 78, 80, 80.0, 80.0, 80.0, 80.0, 0.04251479751146718, 0.011376029802873056, 0.024246720455758628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 90.0, 79, 243, 81.0, 99.00000000000023, 243.0, 243.0, 0.09971636234710157, 0.07410561693959404, 0.05005293969375997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 80.44444444444444, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.042514596678192844, 0.0315953203829148, 0.02134033466073352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 88.11111111111111, 77, 235, 79.5, 97.30000000000021, 235.0, 235.0, 0.09971746717633372, 0.026682212896792422, 0.05687011799900283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 89.88888888888889, 81, 109, 84.0, 109.0, 109.0, 109.0, 0.043488765402271076, 0.03423041495530321, 0.015458897076588549], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 725.2727272727274, 418, 1898, 642.0, 1718.2000000000007, 1898.0, 1898.0, 0.09581964999695118, 0.017311167235777313, 0.06522099223425291], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1647.6, 884, 3884, 1399.0, 3199.700000000002, 3854.7499999999995, 3884.0, 0.08536101306450306, 0.04418099309002599, 0.03926273159509857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95e28263-8dd0-4520-82a4-ced5f8d65552", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 195.22222222222223, 159, 314, 161.0, 314.0, 314.0, 314.0, 0.04246765380368619, 0.06581656893208007, 0.09551074874012627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0ead8c1-41de-4b8a-a224-61662730667b", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["addBook", 64, 4, 6.25, 823.7968750000002, 421, 1710, 681.0, 1336.0, 1472.0, 1710.0, 0.29501244583755876, 78.26159450769798, 1.0775408811192035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8761009b-7368-4f4f-9a18-9990d1fc14b3", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 193.55357142857144, 79, 2833, 81.0, 324.3, 325.45, 2833.0, 0.2532698952548076, 0.1882210842665123, 0.12243027163196266], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 513.9285714285713, 388, 787, 468.5, 651.3000000000003, 705.1, 787.0, 0.25313709181643945, 74.43070993653492, 0.1273101584819007], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 130.67857142857144, 78, 325, 83.0, 239.0, 243.3, 325.0, 0.253585288430624, 0.4487270924182527, 0.12332565785004959], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 758.1071428571428, 540, 1028, 706.0, 949.2, 986.4499999999999, 1028.0, 0.25288217948312686, 227.5438296183737, 0.12693500024836643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 92.94117647058822, 80, 236, 83.0, 121.5999999999999, 236.0, 236.0, 0.1559361212265752, 0.1164952468147754, 0.05543041809225915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 4, 2.1739130434782608, 143.20108695652164, 79, 687, 86.0, 264.5, 370.0, 580.7500000000007, 0.7784471671292222, 1.5296757862739458, 0.3789773784945509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 184.8, 82, 590, 84.0, 590.0, 590.0, 590.0, 0.027658232749560235, 0.021418924385157488, 0.00983163742269524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88f4cdf8-8d03-4ced-b7dc-8d09d9969773", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.8895617603550294, 3.5306490384615383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09edea54-6267-4da6-a47d-532d8e920cfd", 3, 0, 0.0, 310.0, 234, 432, 264.0, 432.0, 432.0, 432.0, 0.019333260296572213, 0.026652460076817486, 0.012397956635497155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 100.7, 80, 238, 85.5, 222.8000000000003, 237.95, 238.0, 0.11546344138787057, 0.09370128886066449, 0.041043645180844614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02508a68-cdc7-4dc5-b148-38a4c4266f92", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/762f3edd-6d43-4361-822e-5c4609ba12a7", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76813ed4-6ee4-4eb1-96b1-ca1d5c2b946f", 1, 0, 0.0, 2017.0, 2017, 2017, 2017.0, 2017.0, 2017.0, 2017.0, 0.49578582052553294, 0.08957068046603868, 0.3418210832920179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 388.8, 159, 947, 319.0, 947.0, 947.0, 947.0, 0.026567199073336094, 6.389660444628643, 0.058390759994580294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=394313ca-bd31-400a-9762-d4df2dc821cb", 1, 0, 0.0, 1449.0, 1449, 1449, 1449.0, 1449.0, 1449.0, 1449.0, 0.6901311249137336, 0.12468189268461007, 0.47581306073153895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 188.66666666666669, 161, 482, 162.5, 332.60000000000025, 482.0, 482.0, 0.09967163732813565, 0.1544715707419446, 0.22416384840497694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=811b1fd1-ab51-45c2-8053-9dbccbe83023", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.23076923076923, 82, 95, 85.0, 94.2, 95.0, 95.0, 0.07254261878853827, 0.06014519858541893, 0.02578663402248821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 83.4, 81, 95, 83.0, 88.4, 95.0, 95.0, 0.07172023371233492, 0.05568123613408815, 0.025494301827431558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 118.52941176470587, 79, 246, 81.0, 237.2, 246.0, 246.0, 0.14775542132023814, 0.10980651916474729, 0.07416629546738517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 143.05882352941174, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.14755535495742594, 0.052519127947852205, 0.08342370194686272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 197.88235294117646, 78, 692, 233.0, 330.3999999999997, 692.0, 692.0, 0.14775798979600704, 7.858241487075522, 0.08611859860238325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 156.2941176470588, 78, 616, 79.0, 311.9999999999997, 616.0, 616.0, 0.14755663570870584, 2.589581660663137, 0.08614534057373492], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.3007518796992481], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07518796992481203], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.45112781954887216], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 11, "401/Unauthorized", 6, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
