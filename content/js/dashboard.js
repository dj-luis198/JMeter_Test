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

    var data = {"OkPercent": 98.27973074046372, "KoPercent": 1.7202692595362752};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7787467700258398, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/179a5205-809f-46bc-98d9-edabb3b1a99b"], "isController": false}, {"data": [0.043859649122807015, 500, 1500, "see books"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c12fda35-cefb-4ecb-b343-2a92e46940cd"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bccb4a96-713f-4dd5-b356-416e41e84570"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54cdc36d-0c70-4880-937d-c62a0918fac2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7593ce1f-cce0-4c9c-8f46-690ed4cfa080"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c12fda35-cefb-4ecb-b343-2a92e46940cd"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2bee01c-9aab-465f-ada6-dad4d27c4738"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c66e4867-1841-4cab-a51b-3f00c6f84809"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a404dd10-8ab7-454c-b7ed-035d9236f02e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f2538a60-0869-48b4-a146-8742352868bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/338a0d6f-8486-4040-bda4-ad1fb9c6c890"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25042bde-cdf6-4971-879b-b1d137bb543c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/024c32cd-e7db-4826-82e2-0d661175fdb8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/915ddeb1-f1c1-41b0-9cd5-f4ec63cac55a"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.26229508196721313, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da2c718b-13f4-4a60-85b7-351c88fbe159"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=179a5205-809f-46bc-98d9-edabb3b1a99b"], "isController": false}, {"data": [0.9273743016759777, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bccb4a96-713f-4dd5-b356-416e41e84570"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2bee01c-9aab-465f-ada6-dad4d27c4738"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2538a60-0869-48b4-a146-8742352868bd"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c66e4867-1841-4cab-a51b-3f00c6f84809"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=915ddeb1-f1c1-41b0-9cd5-f4ec63cac55a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a404dd10-8ab7-454c-b7ed-035d9236f02e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/41d3f65f-c1bc-4d5d-b558-b25315bd57b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7593ce1f-cce0-4c9c-8f46-690ed4cfa080"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=338a0d6f-8486-4040-bda4-ad1fb9c6c890"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25042bde-cdf6-4971-879b-b1d137bb543c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1337, 23, 1.7202692595362752, 384.30590875093463, 100, 3484, 116.0, 1049.6000000000006, 1325.0, 1967.8599999999997, 5.316462743008473, 755.094653515347, 3.8951129400396844], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/179a5205-809f-46bc-98d9-edabb3b1a99b", 3, 0, 0.0, 367.66666666666663, 204, 670, 229.0, 670.0, 670.0, 670.0, 0.026346989856408903, 0.026424178303253856, 0.016895693364949723], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1941.3684210526317, 1319, 3907, 1836.0, 2390.8, 2972.299999999998, 3907.0, 0.24764950209415895, 298.0065980127214, 1.2176906670352445], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 596.3333333333333, 112, 1596, 468.5, 1380.9000000000008, 1596.0, 1596.0, 0.09278087476901428, 0.017645581407485872, 0.06269202500057988], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 596.3333333333333, 112, 1596, 468.5, 1380.9000000000008, 1596.0, 1596.0, 0.09396803520669053, 0.017871362164553692, 0.06349418915373954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 151.70000000000002, 102, 337, 108.5, 332.0, 336.8, 337.0, 0.09564572822266325, 0.03995824466177279, 0.053744679706367614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 142.25, 104, 336, 112.0, 316.90000000000003, 335.09999999999997, 336.0, 0.09574004662540271, 0.07115056199407369, 0.04805701559126659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 247.65, 104, 873, 113.0, 789.3000000000011, 871.35, 873.0, 0.09564938760479587, 2.835612030540849, 0.05550279894020478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 269.34999999999997, 105, 1923, 111.0, 975.3000000000015, 1879.1999999999994, 1923.0, 0.09574279655134446, 8.638178771548112, 0.05546350284595463], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 241.30769230769232, 112, 527, 218.0, 432.9999999999999, 527.0, 527.0, 0.07811091750285405, 0.16382051575737547, 0.05049161997536502], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 109.72222222222223, 102, 116, 111.0, 114.2, 116.0, 116.0, 0.09454029780193807, 0.07025895178444812, 0.047454797920113444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 132.38888888888889, 101, 327, 108.5, 325.2, 327.0, 327.0, 0.0944292017060209, 0.025267188737743876, 0.053854154097965054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 760.9999999999999, 617, 940, 715.0, 940.0, 940.0, 940.0, 0.06529972574115189, 19.200287522854904, 0.03724124983675069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1176.8571428571427, 737, 1944, 1161.0, 1944.0, 1944.0, 1944.0, 0.06508903249802409, 58.567225856037005, 0.03705752533823051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 233.28571428571428, 108, 332, 312.0, 332.0, 332.0, 332.0, 0.06560203928624982, 0.11608485858074674, 0.036324566675101214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 122.35294117647057, 106, 313, 110.0, 154.59999999999985, 313.0, 313.0, 0.10352849469568713, 0.07693865670255655, 0.05196645143904608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 149.1176470588235, 104, 406, 107.0, 341.19999999999993, 406.0, 406.0, 0.10339374771925557, 0.03680076176864129, 0.058455955023719745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 200.23529411764707, 105, 1008, 111.0, 464.7999999999995, 1008.0, 1008.0, 0.10296602726782675, 5.47606196018546, 0.06001225371434801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c12fda35-cefb-4ecb-b343-2a92e46940cd", 3, 0, 0.0, 554.6666666666667, 218, 1218, 228.0, 1218.0, 1218.0, 1218.0, 0.024044819543629328, 0.028420162683241563, 0.01541936669952792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 187.94117647058823, 102, 850, 108.0, 429.1999999999996, 850.0, 850.0, 0.10306403307749203, 1.808747730317801, 0.060170023447067525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 137.57142857142858, 104, 309, 109.0, 309.0, 309.0, 309.0, 0.06574004507888806, 0.04885563896975958, 0.036914576094102175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 110.11111111111111, 105, 114, 110.5, 114.0, 114.0, 114.0, 0.0945363255831053, 0.025480494004821354, 0.05557701953225527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 831.0000000000001, 106, 1348, 1030.0, 1323.4, 1348.0, 1348.0, 0.06809329689585358, 40.85309658523465, 0.0361302324024223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 155.88888888888889, 101, 331, 110.0, 326.5, 331.0, 331.0, 0.09442969709051612, 0.02545175429392817, 0.055606550142169156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 622.4, 109, 1003, 838.0, 964.6, 1003.0, 1003.0, 0.06809484249662931, 13.354214333056413, 0.03619755136620952], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 454.6666666666667, 113, 851, 448.0, 784.4000000000002, 851.0, 851.0, 0.09391729017312087, 0.017861711192593055, 0.06419362957064145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bccb4a96-713f-4dd5-b356-416e41e84570", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 352.7647058823529, 214, 1122, 224.0, 734.7999999999996, 1122.0, 1122.0, 0.10289684893532025, 7.3912896682484535, 0.2298687705793698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54cdc36d-0c70-4880-937d-c62a0918fac2", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7593ce1f-cce0-4c9c-8f46-690ed4cfa080", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c12fda35-cefb-4ecb-b343-2a92e46940cd", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 458.7272727272728, 118, 1336, 391.0, 824.3, 1259.649999999999, 1336.0, 0.09427494000685635, 0.05790911842218032, 0.04262626681950634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 107.8, 103, 114, 107.0, 113.4, 114.0, 114.0, 0.06809576989077439, 0.050606328991093075, 0.03418088449595511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 196.26666666666668, 102, 338, 114.0, 336.2, 338.0, 338.0, 0.0680942242478993, 0.08640341344997118, 0.035022420023333625], "isController": false}, {"data": ["login", 22, 0, 0.0, 2203.5909090909095, 1150, 4532, 2257.5, 3187.4, 4332.649999999997, 4532.0, 0.09722553672915618, 37.140703132595746, 0.19799000013258028], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 118.77777777777781, 107, 190, 113.5, 136.9000000000001, 190.0, 190.0, 0.09183158088066487, 0.07434412163092888, 0.032643257266173835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2bee01c-9aab-465f-ada6-dad4d27c4738", 3, 0, 0.0, 319.0, 204, 481, 272.0, 481.0, 481.0, 481.0, 0.06784107098437395, 0.03149133047647046, 0.043504853463286676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c66e4867-1841-4cab-a51b-3f00c6f84809", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 851.0, 1.1750881316098707, 0.21229619565217392, 0.8101681844888367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a404dd10-8ab7-454c-b7ed-035d9236f02e", 3, 0, 0.0, 292.0, 204, 466, 206.0, 466.0, 466.0, 466.0, 0.05019492362005789, 0.03227049939766091, 0.032188801930831394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2538a60-0869-48b4-a146-8742352868bd", 3, 0, 0.0, 426.6666666666667, 218, 546, 516.0, 546.0, 546.0, 546.0, 0.04101049868766404, 0.03418876534476159, 0.026299050265201223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/338a0d6f-8486-4040-bda4-ad1fb9c6c890", 3, 0, 0.0, 292.6666666666667, 218, 430, 230.0, 430.0, 430.0, 430.0, 0.016299918500407497, 0.022470753531649006, 0.010452747215430588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 955.2666666666667, 222, 1456, 1136.0, 1436.2, 1456.0, 1456.0, 0.06806085547957948, 54.31812363452909, 0.1414611205198942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25042bde-cdf6-4971-879b-b1d137bb543c", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/024c32cd-e7db-4826-82e2-0d661175fdb8", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/915ddeb1-f1c1-41b0-9cd5-f4ec63cac55a", 3, 0, 0.0, 870.3333333333334, 206, 1904, 501.0, 1904.0, 1904.0, 1904.0, 0.03572108973137741, 0.029779202735044773, 0.022907079026957516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 477.80000000000007, 211, 2241, 328.0, 1105.5000000000011, 2186.699999999999, 2241.0, 0.09559178484201068, 11.56943451186055, 0.2125423591096581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1047.2222222222222, 110, 2048, 1176.0, 2048.0, 2048.0, 2048.0, 0.0836050497450046, 77.798853217401, 0.15893668310899312], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 818.6818181818182, 123, 3484, 790.5, 1098.1999999999998, 3131.349999999995, 3484.0, 0.09563304730358275, 0.02993626818114638, 0.04314694126392113], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 281.27777777777777, 214, 442, 226.0, 441.1, 442.0, 442.0, 0.0943782049265423, 0.14626778439299085, 0.2122587948689716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 113.85714285714285, 110, 123, 113.5, 121.0, 123.0, 123.0, 0.07932146155458733, 0.06158258001552434, 0.028196300786982213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 453.23529411764713, 207, 1665, 438.0, 932.1999999999994, 1665.0, 1665.0, 0.10287256509715406, 7.38954531082643, 0.2298145211433378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 204.38461538461536, 103, 1339, 111.0, 850.5999999999996, 1339.0, 1339.0, 0.06604684245287812, 0.049083639752578366, 0.033152418965604835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 148.3846153846154, 101, 418, 108.0, 385.2, 418.0, 418.0, 0.06604751356514317, 0.017672869840673074, 0.037667722580120716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 132.69230769230768, 105, 343, 109.0, 282.19999999999993, 343.0, 343.0, 0.06604852025911342, 0.017802140226089166, 0.038829305855455354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 152.15384615384616, 101, 442, 110.0, 391.99999999999994, 442.0, 442.0, 0.0660505337391207, 0.01780268292187238, 0.03889499203582988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 2.609928097345133, 5.470478429203539], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1381.842105263158, 872, 3220, 1304.0, 1878.2, 2149.799999999999, 3220.0, 0.2562799836340502, 306.59995776438427, 0.506052858308642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 818.6818181818182, 123, 3484, 790.5, 1098.1999999999998, 3131.349999999995, 3484.0, 0.096956021630007, 0.030350402367489763, 0.04374383007135082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 157.25, 105, 311, 106.5, 311.0, 311.0, 311.0, 0.059765718383934976, 0.016108728783169976, 0.03519407049366483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 169.0, 107, 329, 120.0, 329.0, 329.0, 329.0, 0.05976036095258015, 0.01610728478800012, 0.035132555950637946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 201.21428571428572, 102, 988, 110.5, 660.0, 988.0, 988.0, 0.0765520936997627, 4.939281416774204, 0.04453435138504609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 234.42857142857136, 102, 966, 112.0, 654.0, 966.0, 966.0, 0.07655376808582771, 1.6269704905729503, 0.04461008500202321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 124.5, 105, 319, 110.0, 216.5, 319.0, 319.0, 0.07655125653419653, 0.056890142795433175, 0.03842514244001662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 161.25, 101, 336, 104.0, 336.0, 336.0, 336.0, 0.05976750440785345, 0.015992476765382662, 0.03408615485760392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 138.57142857142858, 103, 329, 109.0, 320.0, 329.0, 329.0, 0.07655418669378872, 0.02869714001760746, 0.04320056991857915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 112.0, 106, 120, 111.0, 120.0, 120.0, 120.0, 0.059764825412003765, 0.044415070447787953, 0.0299991408806347], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 595.9166666666665, 110, 1218, 491.0, 1191.0, 1218.0, 1218.0, 0.09253761268382212, 0.01738845602921104, 0.06297949665322301], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 116.25, 105, 133, 113.5, 133.0, 133.0, 133.0, 0.054509280204954894, 0.04290476547382192, 0.019376345697855058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1028.2727272727275, 776, 1969, 807.0, 1692.9999999999998, 1939.7499999999995, 1969.0, 0.09594166746618056, 0.049657308356519235, 0.04412941931305766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 329.0, 214, 444, 329.0, 444.0, 444.0, 444.0, 0.059664981130949715, 0.09246906743634493, 0.1341879409615012], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 1140.7049180327874, 547, 3915, 883.0, 1955.4000000000005, 2684.7999999999993, 3915.0, 0.2752210792275762, 82.0559857059872, 1.000698979764483], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da2c718b-13f4-4a60-85b7-351c88fbe159", 2, 0, 0.0, 313.0, 221, 405, 313.0, 405.0, 405.0, 405.0, 0.020169016357072266, 0.028717212742784534, 0.012536698155543454], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 197.12280701754383, 104, 493, 113.0, 442.2, 448.99999999999994, 493.0, 0.25766322060944136, 0.19148604578494616, 0.12455399824382174], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 772.4035087719298, 500, 2015, 667.0, 970.8000000000001, 1150.5999999999954, 2015.0, 0.25742583200480523, 75.69174195149104, 0.12946709324460423], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 187.05263157894734, 102, 2160, 111.0, 318.2, 333.7999999999995, 2160.0, 0.2580762003939058, 0.4566739014782786, 0.12550971464469246], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1140.6666666666665, 764, 3108, 1090.0, 1450.0, 1507.8999999999971, 3108.0, 0.2568145978824059, 231.08222660649923, 0.12890888995269206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 114.58823529411767, 106, 148, 113.0, 126.39999999999998, 148.0, 148.0, 0.10139628651011874, 0.07575015544945396, 0.03604321122039378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=179a5205-809f-46bc-98d9-edabb3b1a99b", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 12, 6.70391061452514, 165.9832402234636, 102, 3240, 114.0, 232.0, 309.0, 1038.3999999999687, 0.7528916929547845, 1.6289801853312302, 0.3618025433753943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 144.9230769230769, 108, 335, 112.0, 331.0, 335.0, 335.0, 0.06875287572124411, 0.05324319379584627, 0.024439498791535993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bccb4a96-713f-4dd5-b356-416e41e84570", 3, 0, 0.0, 550.6666666666667, 206, 1128, 318.0, 1128.0, 1128.0, 1128.0, 0.027216809101300966, 0.027296545846714933, 0.017453487607279588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 255.7, 107, 2570, 112.0, 327.3, 2457.9499999999985, 2570.0, 0.092973093586716, 0.07544984450250097, 0.033049029360902954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2bee01c-9aab-465f-ada6-dad4d27c4738", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2538a60-0869-48b4-a146-8742352868bd", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 398.0769230769231, 213, 1758, 221.0, 1277.1999999999996, 1758.0, 1758.0, 0.06600961709344423, 0.10230201399149999, 0.1484571759435567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 362.0, 214, 1307, 226.5, 880.0, 1307.0, 1307.0, 0.07650440446785722, 6.647659605606133, 0.1706620294979125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c66e4867-1841-4cab-a51b-3f00c6f84809", 3, 0, 0.0, 282.0, 208, 426, 212.0, 426.0, 426.0, 426.0, 0.023693313746860636, 0.023762727751978394, 0.015193954453553208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=915ddeb1-f1c1-41b0-9cd5-f4ec63cac55a", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a404dd10-8ab7-454c-b7ed-035d9236f02e", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 148.8235294117647, 104, 326, 113.0, 321.2, 326.0, 326.0, 0.1054172040877071, 0.08740156862349935, 0.03747252176555214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41d3f65f-c1bc-4d5d-b558-b25315bd57b9", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.3079420805207329, 0.5753902483124398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 125.53333333333333, 105, 323, 113.0, 199.4000000000001, 323.0, 323.0, 0.06954360847875674, 0.05399137572325353, 0.02472057957643306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7593ce1f-cce0-4c9c-8f46-690ed4cfa080", 3, 0, 0.0, 531.0, 319, 747, 527.0, 747.0, 747.0, 747.0, 0.02416626389560174, 0.024237063496858384, 0.015497246052843564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=338a0d6f-8486-4040-bda4-ad1fb9c6c890", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25042bde-cdf6-4971-879b-b1d137bb543c", 3, 0, 0.0, 317.6666666666667, 233, 428, 292.0, 428.0, 428.0, 428.0, 0.04280821917808219, 0.027521560181221462, 0.027451885345319636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 134.47058823529412, 102, 327, 111.0, 311.0, 327.0, 327.0, 0.10294171077012511, 0.07650257997662618, 0.051671913413910454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 161.17647058823528, 100, 344, 109.0, 339.2, 344.0, 344.0, 0.10295043844774962, 0.036642975449348386, 0.0582053202667022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 252.58823529411765, 102, 1337, 111.0, 617.7999999999994, 1337.0, 1337.0, 0.1029448276279695, 5.474934495676317, 0.05999989781211963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 256.0, 103, 989, 111.0, 712.1999999999998, 989.0, 989.0, 0.10294794467456338, 1.8067104081886005, 0.06010224963968219], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.5235602094240838], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07479431563201197], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07479431563201197], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0471204188481675], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1337, 23, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
