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

    var data = {"OkPercent": 97.50972762645914, "KoPercent": 2.490272373540856};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7320830542531815, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/470b1fe2-88ce-4374-98a0-1db0503b615b"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45c344a0-d360-4411-ad53-b1c9fcf116a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fe918d2-4271-456e-b2c1-8418b2527306"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e5beb9e-ad19-442e-9d29-45478220b43b"], "isController": false}, {"data": [0.2830188679245283, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22a87c91-9112-4a8c-8ea3-9f2bd9a6f0c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fe918d2-4271-456e-b2c1-8418b2527306"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22a87c91-9112-4a8c-8ea3-9f2bd9a6f0c1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f34c4bf2-cb20-4bbd-baf5-50b6cfa59c63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c59159b4-4cdb-448a-af1f-82c115155b80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45c344a0-d360-4411-ad53-b1c9fcf116a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96b11f84-1bb1-44c6-bd8b-de5ab5453eb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f34c4bf2-cb20-4bbd-baf5-50b6cfa59c63"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96b11f84-1bb1-44c6-bd8b-de5ab5453eb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.39622641509433965, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8930635838150289, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afe069e8-6974-43f2-8002-af094d3bf8e9"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92aba10b-82c8-4c11-b667-f9a771ac09e8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/afe069e8-6974-43f2-8002-af094d3bf8e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f3b309b-c300-41e6-8496-9a3b7170158b"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92aba10b-82c8-4c11-b667-f9a771ac09e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f3b309b-c300-41e6-8496-9a3b7170158b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8feb3c67-657c-471d-930c-4338fc31f19d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3c9c40c7-d1c8-4aa9-b742-0bc69e9e64c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e5beb9e-ad19-442e-9d29-45478220b43b"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c9c40c7-d1c8-4aa9-b742-0bc69e9e64c0"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=470b1fe2-88ce-4374-98a0-1db0503b615b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 32, 2.490272373540856, 450.83891050583696, 118, 2990, 155.0, 1244.8000000000002, 1590.1000000000001, 2059.600000000004, 5.026029749402547, 695.7671283475901, 3.685914301059182], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2234.5849056603774, 1547, 3233, 2111.0, 2854.2, 2961.3999999999996, 3233.0, 0.23221781154429227, 279.43474148927197, 1.1418131651616323], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 153.78947368421052, 122, 437, 132.0, 155.0, 437.0, 437.0, 0.09859630004410887, 0.07654693216315092, 0.035047903531304325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 297.9285714285714, 253, 492, 293.5, 396.5, 492.0, 492.0, 0.07148218306587083, 0.11078342238821973, 0.1607651050788091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/470b1fe2-88ce-4374-98a0-1db0503b615b", 3, 0, 0.0, 385.0, 240, 603, 312.0, 603.0, 603.0, 603.0, 0.06747334802752913, 0.04337886144347982, 0.04326904154109126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 531.9473684210526, 248, 2001, 297.0, 1762.0, 2001.0, 2001.0, 0.10155920099634921, 12.93031431069365, 0.2256737734722022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45c344a0-d360-4411-ad53-b1c9fcf116a1", 3, 0, 0.0, 331.6666666666667, 222, 513, 260.0, 513.0, 513.0, 513.0, 0.02721903154685756, 0.02269138665087963, 0.017454912808368944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 247.14285714285717, 121, 443, 150.0, 442.5, 443.0, 443.0, 0.06070065903572667, 0.04511054836541797, 0.03046888549254249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fe918d2-4271-456e-b2c1-8418b2527306", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 194.85714285714283, 120, 449, 143.0, 444.0, 449.0, 449.0, 0.060703290985561285, 0.02275526546849933, 0.034255693643498245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 306.1428571428571, 121, 1513, 136.5, 973.0, 1513.0, 1513.0, 0.060708818823202906, 3.9170442786816646, 0.03531749086115459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 299.78571428571433, 120, 714, 356.5, 576.5, 714.0, 714.0, 0.06070960859648058, 1.2902401037917488, 0.03537723704066677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 137.0, 122, 152, 137.0, 152.0, 152.0, 152.0, 0.03160855959793912, 0.009322055662673452, 0.019539275610835415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e5beb9e-ad19-442e-9d29-45478220b43b", 3, 0, 0.0, 289.6666666666667, 219, 410, 240.0, 410.0, 410.0, 410.0, 0.029682692022281805, 0.029595731010497776, 0.019034799246059622], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1530.1509433962265, 964, 2629, 1393.0, 2215.8, 2329.4999999999995, 2629.0, 0.22938261452900827, 274.4213532762762, 0.45294106111099086], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 691.7692307692307, 133, 1795, 532.0, 1732.6, 1795.0, 1795.0, 0.08336967396044428, 0.016527386537080267, 0.056051576167816745], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 691.7692307692307, 133, 1795, 532.0, 1732.6, 1795.0, 1795.0, 0.08234101849505955, 0.016323463627438563, 0.05535998464023309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 1099.9545454545455, 329, 2391, 1076.5, 1873.6999999999998, 2319.299999999999, 2391.0, 0.08605582676179746, 0.026663248881274252, 0.03882596871479534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 177.8, 120, 381, 126.0, 381.0, 381.0, 381.0, 0.02825321662871318, 0.0076151247944578485, 0.01663739221397856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 151.5, 121, 434, 127.5, 235.9000000000002, 434.0, 434.0, 0.16757962650690741, 0.060571688731317484, 0.09469312635503838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22a87c91-9112-4a8c-8ea3-9f2bd9a6f0c1", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 178.4, 121, 357, 145.0, 357.0, 357.0, 357.0, 0.028290623921419962, 0.007625207228820224, 0.016631792578803532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 155.125, 121, 481, 129.0, 248.60000000000025, 481.0, 481.0, 0.16754628466113766, 0.12451437756555249, 0.08410038116779761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 305.5, 120, 953, 147.0, 696.1000000000003, 953.0, 953.0, 0.16757787134208926, 3.121935648788203, 0.09778103332704917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 325.93749999999994, 120, 1843, 145.5, 866.5000000000009, 1843.0, 1843.0, 0.1675568122316473, 9.465333820949839, 0.09760511571892345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fe918d2-4271-456e-b2c1-8418b2527306", 3, 0, 0.0, 327.3333333333333, 238, 485, 259.0, 485.0, 485.0, 485.0, 0.027260336210813266, 0.0275176766242617, 0.017481400499772832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 149.73684210526318, 119, 437, 129.0, 151.0, 437.0, 437.0, 0.09677238625424653, 0.026083182232589885, 0.0568915786377504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 208.26315789473682, 120, 489, 142.0, 447.0, 489.0, 489.0, 0.0967748507629933, 0.02608384649471304, 0.056987534189536095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 162.26315789473682, 121, 417, 129.0, 381.0, 417.0, 417.0, 0.09676499348109517, 0.07191226566319671, 0.04857149086844035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 179.6, 119, 380, 127.0, 380.0, 380.0, 380.0, 0.028253376278465275, 0.007559985449511216, 0.016113253658812228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 142.68421052631578, 120, 360, 127.0, 147.0, 360.0, 360.0, 0.09677189336756002, 0.025894041779991647, 0.05519022043618658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 191.4, 122, 439, 126.0, 439.0, 439.0, 439.0, 0.028294306053849725, 0.021027311432597305, 0.014202415343436288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 138.6, 130, 153, 132.0, 153.0, 153.0, 153.0, 0.027659915803216296, 0.0217713790404222, 0.009832235695674542], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 571.3076923076924, 120, 1179, 508.0, 1161.4, 1179.0, 1179.0, 0.0814174145586863, 0.015797865219733077, 0.05540567596808438], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1500.0476190476193, 1091, 2990, 1299.0, 2179.6000000000004, 2912.499999999999, 2990.0, 0.08693888196597792, 0.044997663517547165, 0.03998848965427305], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 237.9230769230769, 120, 319, 244.0, 316.2, 319.0, 319.0, 0.08368146970408945, 0.16840015714414455, 0.05408619030453618], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/22a87c91-9112-4a8c-8ea3-9f2bd9a6f0c1", 3, 0, 0.0, 577.3333333333334, 243, 1032, 457.0, 1032.0, 1032.0, 1032.0, 0.02135185725571696, 0.02523717242692327, 0.013692434503177869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 423.4, 255, 820, 298.0, 820.0, 820.0, 820.0, 0.028233434032581384, 0.04375630840791665, 0.06349765486038567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f34c4bf2-cb20-4bbd-baf5-50b6cfa59c63", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.23221601863753213, 0.8861865359897172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c59159b4-4cdb-448a-af1f-82c115155b80", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45c344a0-d360-4411-ad53-b1c9fcf116a1", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 137.7857142857143, 121, 151, 136.0, 150.5, 151.0, 151.0, 0.07153002728359611, 0.053158545666813134, 0.03590472072633633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 897.375, 631, 1169, 944.0, 1169.0, 1169.0, 1169.0, 0.0391177002704011, 11.501902709389714, 0.022309313435463128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 134.5, 120, 149, 130.0, 148.5, 149.0, 149.0, 0.07153002728359611, 0.019139870581743493, 0.04079446868517591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1212.875, 833, 1424, 1250.0, 1424.0, 1424.0, 1424.0, 0.03907242073182644, 35.157432856487, 0.022245333287748845], "isController": false}, {"data": ["addBook", 60, 15, 25.0, 1327.1000000000004, 639, 3089, 1051.5, 2447.6, 2519.0499999999997, 3089.0, 0.2899335085820319, 76.27916077990906, 1.0562328682517976], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 250.87500000000003, 120, 384, 254.0, 384.0, 384.0, 384.0, 0.039260913306995805, 0.06947341300026992, 0.021739197114322872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 166.3, 121, 451, 134.0, 421.2000000000001, 451.0, 451.0, 0.05985945001137329, 0.04448539204946785, 0.030046637993990113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96b11f84-1bb1-44c6-bd8b-de5ab5453eb5", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 182.6, 119, 438, 127.5, 432.20000000000005, 438.0, 438.0, 0.05986231667165519, 0.016017846453157736, 0.03414022747680335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 136.4, 120, 150, 134.5, 149.9, 150.0, 150.0, 0.05986590038314176, 0.016135730962643677, 0.03519460159243295], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 255.03773584905662, 121, 743, 150.0, 569.6, 602.6999999999999, 743.0, 0.23056510201418193, 0.17134769788358636, 0.11145481005568364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 231.6, 120, 417, 135.0, 417.0, 417.0, 417.0, 0.05978358342799067, 0.016113543970825612, 0.035204590631912475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f34c4bf2-cb20-4bbd-baf5-50b6cfa59c63", 3, 0, 0.0, 807.0, 228, 1719, 474.0, 1719.0, 1719.0, 1719.0, 0.03979993897342691, 0.033179571520490336, 0.025522747323454106], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 855.3962264150942, 593, 1330, 832.0, 1163.4, 1208.4999999999998, 1330.0, 0.23071464950962253, 67.83776740317603, 0.11603324657954649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 157.125, 120, 362, 127.5, 362.0, 362.0, 362.0, 0.0392638036809816, 0.029179447852760738, 0.02204754601226994], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 213.39622641509433, 119, 586, 143.0, 381.6, 494.99999999999966, 586.0, 0.2312219425260779, 0.40915445298559877, 0.11244973376756523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 938.6875, 121, 1735, 1242.0, 1664.3000000000002, 1735.0, 1735.0, 0.10753989057816134, 54.44275879516675, 0.05802323197698646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96b11f84-1bb1-44c6-bd8b-de5ab5453eb5", 3, 0, 0.0, 384.3333333333333, 244, 595, 314.0, 595.0, 595.0, 595.0, 0.04594954739695814, 0.029541131545895938, 0.0294663438710962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 133.35714285714286, 120, 151, 129.0, 149.5, 151.0, 151.0, 0.07153039275294934, 0.01927967617169338, 0.042052047302026864], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1266.0000000000002, 831, 2054, 1185.0, 1736.2, 1851.6, 2054.0, 0.230160591295587, 207.09890462693357, 0.11552982805266769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 695.5, 122, 1255, 970.0, 1210.2, 1255.0, 1255.0, 0.10754422756358553, 17.799816817732697, 0.058130595660590416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 152.78947368421052, 128, 361, 145.0, 157.0, 361.0, 361.0, 0.10073697046816181, 0.07525760000795291, 0.03580884497110439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 150.71428571428572, 121, 361, 131.5, 258.0, 361.0, 361.0, 0.07153295114299436, 0.0192803657377602, 0.04212340775315], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 642.4615384615383, 122, 1491, 537.0, 1444.2, 1491.0, 1491.0, 0.0823519723297373, 0.016325635139586594, 0.055874625456895075], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, 8.670520231213873, 204.6069364161849, 121, 1717, 149.0, 338.0, 441.39999999999986, 1248.5799999999942, 0.7161752104023414, 1.4875900911157016, 0.3458583895475677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 163.14285714285714, 123, 403, 146.5, 286.0, 403.0, 403.0, 0.061526832291039495, 0.04764724414726008, 0.021870866165955447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 411.90000000000003, 249, 869, 290.0, 839.1000000000001, 869.0, 869.0, 0.0597314474124337, 0.0925720771909495, 0.13433742518636213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 157.43750000000003, 121, 374, 148.5, 225.60000000000014, 374.0, 374.0, 0.15923408405569212, 0.12922219126003923, 0.05660274081667181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afe069e8-6974-43f2-8002-af094d3bf8e9", 1, 0, 0.0, 1374.0, 1374, 1374, 1374.0, 1374.0, 1374.0, 1374.0, 0.727802037845706, 0.131487672852984, 0.5017853893740902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 473.952380952381, 179, 850, 431.0, 769.4000000000001, 842.9999999999999, 850.0, 0.08884789663181854, 0.054575514630286974, 0.04017243763723827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 172.9375, 121, 451, 146.5, 405.50000000000006, 451.0, 451.0, 0.10752615909839315, 0.0799095772205832, 0.053973091578685635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 180.99999999999997, 119, 386, 148.0, 367.1, 386.0, 386.0, 0.10752688172043011, 0.11961578040994622, 0.05624422463037634], "isController": false}, {"data": ["login", 21, 0, 0.0, 2902.8095238095243, 1718, 4964, 2793.0, 3918.0, 4861.999999999998, 4964.0, 0.08871952378739423, 40.552009378392995, 0.1899028534416838], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 623.2857142857143, 249, 1873, 542.5, 1375.5, 1873.0, 1873.0, 0.060662784248474766, 5.271141488090596, 0.13532337055428453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92aba10b-82c8-4c11-b667-f9a771ac09e8", 1, 0, 0.0, 1491.0, 1491, 1491, 1491.0, 1491.0, 1491.0, 1491.0, 0.670690811535882, 0.1211697266934943, 0.46240987592219984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afe069e8-6974-43f2-8002-af094d3bf8e9", 3, 0, 0.0, 687.6666666666666, 251, 1014, 798.0, 1014.0, 1014.0, 1014.0, 0.019944421545293783, 0.027494995196718476, 0.01278987970189738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 169.21428571428572, 131, 406, 153.5, 286.0, 406.0, 406.0, 0.07084590004655587, 0.057354737440034005, 0.025183503532174162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f3b309b-c300-41e6-8496-9a3b7170158b", 3, 0, 0.0, 562.3333333333333, 233, 1135, 319.0, 1135.0, 1135.0, 1135.0, 0.016284699981544005, 0.02244977357481734, 0.01044298794389378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 374.6842105263158, 249, 828, 279.0, 798.0, 828.0, 828.0, 0.09670195439739412, 0.1498691422154927, 0.21748496189179561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92aba10b-82c8-4c11-b667-f9a771ac09e8", 3, 0, 0.0, 622.3333333333333, 240, 1179, 448.0, 1179.0, 1179.0, 1179.0, 0.05374128943267112, 0.03455047090804866, 0.034463001361446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f3b309b-c300-41e6-8496-9a3b7170158b", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8feb3c67-657c-471d-930c-4338fc31f19d", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c9c40c7-d1c8-4aa9-b742-0bc69e9e64c0", 3, 0, 0.0, 990.0, 248, 2214, 508.0, 2214.0, 2214.0, 2214.0, 0.0379588273252945, 0.031644712493515366, 0.024342086533473358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 169.5, 124, 425, 144.0, 398.0000000000001, 425.0, 425.0, 0.06199166831977782, 0.051397389065909536, 0.02203610084804602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e5beb9e-ad19-442e-9d29-45478220b43b", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1138.0, 255, 1885, 1371.5, 1813.6000000000001, 1885.0, 1885.0, 0.10742003920831432, 72.36067311452655, 0.22613019728361575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 150.31249999999997, 131, 174, 151.0, 167.0, 174.0, 174.0, 0.11145165784341042, 0.08652741014210086, 0.0396175814990248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c9c40c7-d1c8-4aa9-b742-0bc69e9e64c0", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 958.8333333333335, 120, 1556, 1228.0, 1553.0, 1556.0, 1556.0, 0.058573729682237514, 46.72158716503148, 0.10098820288475618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 575.4375000000001, 255, 1970, 520.0, 1232.9000000000008, 1970.0, 1970.0, 0.16729751772308077, 12.752198148879106, 0.37358074849955036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=470b1fe2-88ce-4374-98a0-1db0503b615b", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 162.421052631579, 120, 381, 138.0, 380.0, 381.0, 381.0, 0.10163090863381315, 0.0755284389358709, 0.05101395218533199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 181.05263157894737, 118, 378, 128.0, 378.0, 378.0, 378.0, 0.10164450103249414, 0.0432678740517638, 0.05707054529599949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 359.3157894736842, 121, 1880, 146.0, 1381.0, 1880.0, 1880.0, 0.10164069479439157, 9.651509080124965, 0.058834164513488794], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 1099.9545454545455, 329, 2391, 1076.5, 1873.6999999999998, 2319.299999999999, 2391.0, 0.08520064752492118, 0.02639828301331454, 0.038440135895032805], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 252.94736842105266, 120, 1010, 130.0, 711.0, 1010.0, 1010.0, 0.10164667615368977, 3.1705654631343556, 0.058936891123035275], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 28.125, 0.7003891050583657], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.25, 0.1556420233463035], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.1556420233463035], "isController": false}, {"data": ["401/Unauthorized", 19, 59.375, 1.4785992217898833], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 32, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
