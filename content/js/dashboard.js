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

    var data = {"OkPercent": 98.30377794911334, "KoPercent": 1.6962220508866614};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7691798941798942, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05660377358490566, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78ce6ded-5921-4b89-a431-3f10a3fdf9a7"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86b54dd3-71f9-4b1a-881d-60a9d576266e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afd3651f-6e53-4d70-b4bc-c3934236a246"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7b49463-5d0a-4308-8a8d-645ea2184897"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12ff1671-6323-4429-b22f-a1bb52e10820"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af541218-a379-4b6a-ad50-0fa768fa9ec4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7b49463-5d0a-4308-8a8d-645ea2184897"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/879b0433-be76-4290-a316-840888e97ae5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db6df10d-cdcd-44fa-b871-88fbcb637d97"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af541218-a379-4b6a-ad50-0fa768fa9ec4"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5fd707c-35e8-4f6a-8765-c3ef067337d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3721a67-1e0c-46d9-a37f-1177f1e00a68"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ed1218e1-75ab-476f-8b77-54d5f898ecc1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5164b1f-c394-4ec4-aa9e-38904bdd6202"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe347654-f3bb-43fb-8f45-3a76d02c2a6c"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afd3651f-6e53-4d70-b4bc-c3934236a246"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed1218e1-75ab-476f-8b77-54d5f898ecc1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b285cf2e-93d7-41b1-8a86-9858d236f7ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4056603773584906, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b6e945f-4312-4861-928f-6baef2c8921d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12ff1671-6323-4429-b22f-a1bb52e10820"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db6df10d-cdcd-44fa-b871-88fbcb637d97"], "isController": false}, {"data": [0.5188679245283019, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.92, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3721a67-1e0c-46d9-a37f-1177f1e00a68"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b6e945f-4312-4861-928f-6baef2c8921d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5fd707c-35e8-4f6a-8765-c3ef067337d3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b285cf2e-93d7-41b1-8a86-9858d236f7ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5164b1f-c394-4ec4-aa9e-38904bdd6202"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=879b0433-be76-4290-a316-840888e97ae5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78ce6ded-5921-4b89-a431-3f10a3fdf9a7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 22, 1.6962220508866614, 397.3847340015418, 96, 2689, 126.0, 1097.4, 1348.7999999999993, 2015.2399999999998, 5.102602838888364, 709.274350101698, 3.730807302731486], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1831.0943396226414, 1296, 2946, 1780.0, 2218.6, 2569.8999999999987, 2946.0, 0.23810379528464637, 286.51976187795384, 1.1707545012287053], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78ce6ded-5921-4b89-a431-3f10a3fdf9a7", 3, 0, 0.0, 393.0, 260, 640, 279.0, 640.0, 640.0, 640.0, 0.10653787421428317, 0.04945410437160411, 0.06832018626371675], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 616.7142857142858, 118, 1552, 515.5, 1383.5, 1552.0, 1552.0, 0.08293593199253577, 0.015660405127217794, 0.056087043852374036], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 616.7142857142858, 118, 1552, 515.5, 1383.5, 1552.0, 1552.0, 0.0833402783565297, 0.01573675596478278, 0.05636049097841487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 121.33333333333333, 101, 315, 108.0, 196.80000000000007, 315.0, 315.0, 0.1023115591599539, 0.03762081289944138, 0.057776722926656254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 140.73333333333335, 103, 330, 113.0, 328.8, 330.0, 330.0, 0.10231016349164126, 0.0760332367354873, 0.05135490628389024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 217.79999999999995, 103, 892, 112.0, 557.2000000000002, 892.0, 892.0, 0.10231574639336993, 2.031353914429931, 0.05966420185191501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86b54dd3-71f9-4b1a-881d-60a9d576266e", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 253.40000000000003, 103, 1142, 114.0, 662.0000000000002, 1142.0, 1142.0, 0.10231714221400653, 6.163415450655853, 0.059565096723805104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afd3651f-6e53-4d70-b4bc-c3934236a246", 3, 0, 0.0, 339.0, 227, 476, 314.0, 476.0, 476.0, 476.0, 0.06194379632879768, 0.039823892496541474, 0.03972307251553757], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 306.6428571428571, 112, 705, 226.5, 644.5, 705.0, 705.0, 0.08377564881248017, 0.16800710821420237, 0.05415380423725264], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 125.0625, 102, 340, 112.5, 186.00000000000017, 340.0, 340.0, 0.07818264443021955, 0.058102531651754954, 0.039244022692512544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 137.6875, 101, 334, 113.5, 319.3, 334.0, 334.0, 0.07818302646495447, 0.0355984727434424, 0.04376798820413588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 789.0, 555, 1007, 807.0, 1007.0, 1007.0, 1007.0, 0.09400894427955574, 27.64175100891742, 0.05361447603443414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1054.4285714285713, 724, 1292, 1075.0, 1292.0, 1292.0, 1292.0, 0.09373200680226564, 84.34022448397182, 0.05336499996652429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 144.85714285714286, 104, 340, 110.0, 340.0, 340.0, 340.0, 0.09496676163342829, 0.16804665242165243, 0.05258413461538462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 120.5294117647059, 98, 308, 111.0, 153.59999999999985, 308.0, 308.0, 0.10304029481646705, 0.07657584409700334, 0.051721397984046937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 132.76470588235296, 97, 321, 110.0, 313.0, 321.0, 321.0, 0.10303592317156693, 0.02757015912989193, 0.05876267493378426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 158.76470588235296, 96, 341, 109.0, 329.0, 341.0, 341.0, 0.10289498054074339, 0.02773341272387224, 0.060490994419460466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 175.5294117647059, 99, 359, 113.0, 347.0, 359.0, 359.0, 0.10303592317156693, 0.0277714011673364, 0.060674474289506695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 110.14285714285714, 106, 115, 110.0, 115.0, 115.0, 115.0, 0.09496289663967007, 0.07057301205350482, 0.05332389215606474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7b49463-5d0a-4308-8a8d-645ea2184897", 3, 0, 0.0, 705.0, 195, 1047, 873.0, 1047.0, 1047.0, 1047.0, 0.0207507625905252, 0.02860660142281062, 0.013306966895616747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 671.3499999999999, 103, 1348, 643.5, 1337.4, 1347.9, 1348.0, 0.09714491106383391, 43.71867266354346, 0.052936387083612625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 297.43750000000006, 103, 1346, 110.5, 1273.2, 1346.0, 1346.0, 0.07818531875177138, 8.812350119354775, 0.04512453455302431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 449.29999999999995, 98, 918, 470.0, 838.3000000000001, 914.05, 918.0, 0.09705534095541277, 14.281826114437951, 0.05298235897858959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 218.1875, 103, 881, 110.5, 729.8000000000002, 881.0, 881.0, 0.07818264443021955, 2.891975253971434, 0.04519934131122068], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 487.85714285714283, 115, 948, 453.5, 923.0, 948.0, 948.0, 0.08311367576167747, 0.015693967653938403, 0.05687976233941251], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/12ff1671-6323-4429-b22f-a1bb52e10820", 3, 0, 0.0, 483.0, 226, 918, 305.0, 918.0, 918.0, 918.0, 0.03803824111173099, 0.031141333462240708, 0.024393012692093118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 325.64705882352945, 216, 637, 228.0, 504.9999999999999, 637.0, 637.0, 0.10282714152643868, 0.15936198593990056, 0.2312606513040901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af541218-a379-4b6a-ad50-0fa768fa9ec4", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7b49463-5d0a-4308-8a8d-645ea2184897", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/879b0433-be76-4290-a316-840888e97ae5", 3, 0, 0.0, 698.0, 217, 957, 920.0, 957.0, 957.0, 957.0, 0.0760841998478316, 0.03442611907177276, 0.04879097451179305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db6df10d-cdcd-44fa-b871-88fbcb637d97", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.25409854078762306, 0.9696949718706048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af541218-a379-4b6a-ad50-0fa768fa9ec4", 3, 0, 0.0, 687.0, 402, 1213, 446.0, 1213.0, 1213.0, 1213.0, 0.020520958739192293, 0.024255078509767974, 0.013159599191474225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 825.7272727272726, 142, 1520, 897.0, 1257.8, 1483.9999999999995, 1520.0, 0.0976957133785398, 0.060010355190528844, 0.04417296415455462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 111.94999999999999, 99, 119, 113.5, 117.0, 118.9, 119.0, 0.09713924911360436, 0.07219039899946574, 0.048759349652727185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 197.90000000000003, 105, 355, 115.5, 337.8, 354.15, 355.0, 0.09704498034839149, 0.09884561963219952, 0.051270834344218544], "isController": false}, {"data": ["login", 22, 0, 0.0, 3164.1818181818185, 1393, 4894, 3084.0, 4243.7, 4797.399999999999, 4894.0, 0.09567338844700346, 36.54777373868771, 0.19482920669365814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 116.5625, 110, 132, 116.0, 125.0, 132.0, 132.0, 0.08196469370818521, 0.06635618269930228, 0.02913588721658146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5fd707c-35e8-4f6a-8765-c3ef067337d3", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3721a67-1e0c-46d9-a37f-1177f1e00a68", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 797.1000000000003, 213, 1464, 759.5, 1450.1000000000001, 1463.7, 1464.0, 0.09699038825252417, 58.092269911520525, 0.20572570633250245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed1218e1-75ab-476f-8b77-54d5f898ecc1", 3, 0, 0.0, 848.6666666666666, 217, 2015, 314.0, 2015.0, 2015.0, 2015.0, 0.030979574134120905, 0.03107033460521696, 0.019866458673248107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 410.66666666666663, 216, 1248, 235.0, 901.8000000000002, 1248.0, 1248.0, 0.10223206679161698, 8.301549987220993, 0.22817851209746123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 931.3333333333334, 112, 1401, 1099.0, 1401.0, 1401.0, 1401.0, 0.12034016152323902, 111.98278801411992, 0.2287716612290742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5164b1f-c394-4ec4-aa9e-38904bdd6202", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe347654-f3bb-43fb-8f45-3a76d02c2a6c", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1299.0434782608697, 151, 2689, 1374.0, 2219.0, 2596.5999999999985, 2689.0, 0.09325105616957097, 0.029093442626274096, 0.042072253857755655], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 453.375, 216, 1583, 232.0, 1497.6000000000001, 1583.0, 1583.0, 0.07813949853976812, 11.79121408330159, 0.17323847320303573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 143.39999999999998, 107, 322, 117.0, 311.2, 322.0, 322.0, 0.09429751494615612, 0.07320949646698643, 0.03351981976601643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afd3651f-6e53-4d70-b4bc-c3934236a246", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed1218e1-75ab-476f-8b77-54d5f898ecc1", 1, 0, 0.0, 898.0, 898, 898, 898.0, 898.0, 898.0, 898.0, 1.1135857461024499, 0.20118492483296213, 0.7677651726057906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 421.69230769230774, 211, 1037, 447.0, 886.9999999999999, 1037.0, 1037.0, 0.10197038152610441, 9.529879772998243, 0.22732684889950427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 130.79999999999998, 100, 337, 109.5, 314.70000000000005, 337.0, 337.0, 0.08469049857296511, 0.0629389349746352, 0.042510660416507876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b285cf2e-93d7-41b1-8a86-9858d236f7ed", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 149.6, 98, 336, 108.5, 334.0, 336.0, 336.0, 0.08469121582709442, 0.02266151673498425, 0.04830045902638978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 107.1, 99, 113, 107.0, 112.8, 113.0, 113.0, 0.08468906410115262, 0.022826349308513794, 0.049787906825091675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 130.4, 104, 335, 107.0, 313.1000000000001, 335.0, 335.0, 0.08469336766237837, 0.022827509252750417, 0.049873145215248195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 2.5645380434782608, 5.375339673913043], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1262.5283018867924, 839, 2432, 1145.0, 1756.8, 2044.999999999999, 2432.0, 0.24789291026276647, 296.56610219385226, 0.48949166460089244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1299.0434782608697, 151, 2689, 1374.0, 2219.0, 2596.5999999999985, 2689.0, 0.09369780421232737, 0.02923282376665173, 0.04227381400985864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 162.5, 102, 338, 110.0, 338.0, 338.0, 338.0, 0.04116518043213148, 0.011095302538347939, 0.0242408240239993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 136.875, 97, 347, 108.0, 347.0, 347.0, 347.0, 0.041164968611711435, 0.011095245446125347, 0.024200499125244416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 211.33333333333334, 104, 1163, 112.0, 672.2000000000003, 1163.0, 1163.0, 0.08928252562408485, 5.378231701918384, 0.05197684532100044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 184.86666666666667, 99, 658, 107.0, 470.2000000000001, 658.0, 658.0, 0.08928146278748632, 1.7725741668551496, 0.052063415506999666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 148.375, 100, 432, 110.0, 432.0, 432.0, 432.0, 0.041164121351829744, 0.01101461840859507, 0.023476412958465403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 110.53333333333335, 103, 116, 111.0, 115.4, 116.0, 116.0, 0.0892819942026225, 0.06635116951972239, 0.04481537599623825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 132.12499999999997, 100, 301, 108.0, 301.0, 301.0, 301.0, 0.041164544977410955, 0.030592010476376694, 0.020662671990614483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 137.46666666666664, 100, 349, 109.0, 334.6, 349.0, 349.0, 0.0892793371902007, 0.032828756279313386, 0.05041725070233079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b6e945f-4312-4861-928f-6baef2c8921d", 3, 0, 0.0, 487.0, 322, 703, 436.0, 703.0, 703.0, 703.0, 0.02261658851378858, 0.022682848050450073, 0.014503476358126141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 119.375, 111, 134, 117.0, 134.0, 134.0, 134.0, 0.041548728868576176, 0.032703394011789455, 0.014769274715001689], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 690.0714285714287, 113, 2015, 561.5, 1467.5, 2015.0, 2015.0, 0.08360604830040848, 0.015623647000334424, 0.056901800590617016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1619.2272727272727, 901, 2656, 1507.5, 2448.8999999999996, 2633.3499999999995, 2656.0, 0.09525417711215313, 0.04930147838812613, 0.043813200605297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 313.875, 217, 649, 224.0, 649.0, 649.0, 649.0, 0.04114083536466208, 0.06376025949581907, 0.09252670297345388], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 1146.1147540983607, 569, 2995, 924.0, 1965.2000000000003, 2199.2999999999997, 2995.0, 0.28510401622755976, 84.98156354138916, 1.0372037006851844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12ff1671-6323-4429-b22f-a1bb52e10820", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.1905739055907173, 0.7272712289029536], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 199.50943396226415, 99, 475, 114.0, 444.8, 462.3, 475.0, 0.24936482544462218, 0.1853189767220288, 0.12054256698739062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db6df10d-cdcd-44fa-b871-88fbcb637d97", 3, 0, 0.0, 408.6666666666667, 213, 570, 443.0, 570.0, 570.0, 570.0, 0.02544529262086514, 0.02551983937659033, 0.016317456530958438], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 715.4528301886793, 488, 1120, 673.0, 942.6000000000001, 1033.3999999999999, 1120.0, 0.24889289622105448, 73.18277551093485, 0.12517562651742484], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 156.6603773584905, 99, 342, 113.0, 330.0, 336.79999999999995, 342.0, 0.24981146304675714, 0.442049190469457, 0.1214903404270362], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1056.4528301886792, 725, 2133, 1004.0, 1344.4, 1617.9999999999986, 2133.0, 0.24846584063494742, 223.57000015968617, 0.12471820516246385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 115.69230769230771, 109, 133, 115.0, 127.39999999999999, 133.0, 133.0, 0.10031483424902772, 0.07494223457080683, 0.03565878873695907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, 5.714285714285714, 197.57142857142858, 98, 1516, 120.0, 351.80000000000007, 452.79999999999995, 1219.6000000000035, 0.7307743702812854, 1.520801818688615, 0.35406670717244604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 155.09999999999997, 107, 324, 114.5, 323.9, 324.0, 324.0, 0.08298204268596275, 0.06426246079098483, 0.029497522986025825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 117.86666666666666, 108, 136, 116.0, 130.6, 136.0, 136.0, 0.10075296045782145, 0.08176338880903285, 0.03581452891274122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 286.2, 210, 672, 223.0, 648.9000000000001, 672.0, 672.0, 0.08461024291600741, 0.13112935108174195, 0.190290419370669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 351.06666666666666, 217, 1276, 224.0, 786.4000000000003, 1276.0, 1276.0, 0.08922463789667788, 7.245307806412277, 0.19914637115962286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3721a67-1e0c-46d9-a37f-1177f1e00a68", 3, 0, 0.0, 460.3333333333333, 224, 705, 452.0, 705.0, 705.0, 705.0, 0.03586328914179149, 0.029547521099568447, 0.022998268101995196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b6e945f-4312-4861-928f-6baef2c8921d", 1, 0, 0.0, 837.0, 837, 837, 837.0, 837.0, 837.0, 837.0, 1.194743130227001, 0.21584714755077658, 0.823719384707288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5fd707c-35e8-4f6a-8765-c3ef067337d3", 3, 0, 0.0, 558.3333333333334, 280, 912, 483.0, 912.0, 912.0, 912.0, 0.02913526532514956, 0.024288871906806, 0.018683747620619997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b285cf2e-93d7-41b1-8a86-9858d236f7ed", 3, 0, 0.0, 505.0, 229, 702, 584.0, 702.0, 702.0, 702.0, 0.0880540064572938, 0.03984214484884062, 0.05646692471382448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 127.0, 107, 305, 116.0, 164.19999999999987, 305.0, 305.0, 0.10475656423117925, 0.08685383108620233, 0.037237684941551996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5164b1f-c394-4ec4-aa9e-38904bdd6202", 3, 0, 0.0, 407.3333333333333, 219, 526, 477.0, 526.0, 526.0, 526.0, 0.017621559390528996, 0.02429274219364919, 0.011300283853952516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 125.29999999999998, 102, 318, 117.0, 129.4, 308.59999999999985, 318.0, 0.09611503046846466, 0.07462055588127871, 0.03416588973683705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=879b0433-be76-4290-a316-840888e97ae5", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 140.46153846153845, 106, 315, 114.0, 307.8, 315.0, 315.0, 0.10205763901428021, 0.07584556961901098, 0.051228150833339876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 190.84615384615384, 98, 348, 112.0, 339.59999999999997, 348.0, 348.0, 0.10205844023300727, 0.0390999132503258, 0.05754587232489127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 259.38461538461536, 104, 930, 116.0, 695.9999999999998, 930.0, 930.0, 0.10205603661456575, 7.089252971891413, 0.059323137869855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 219.2307692307692, 101, 863, 112.0, 656.1999999999998, 863.0, 863.0, 0.10205844023300727, 2.3337434888677793, 0.05942420149083829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78ce6ded-5921-4b89-a431-3f10a3fdf9a7", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.6168080185042406], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07710100231303008], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07710100231303008], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9252120277563608], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 22, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
