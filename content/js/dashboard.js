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

    var data = {"OkPercent": 97.02467343976778, "KoPercent": 2.9753265602322205};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7764303482587065, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.17796610169491525, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9d27fff-cc32-4229-8ad3-b74260123d03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47a73d1a-11db-4ea2-9a58-a5156c3e3d2d"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f21f404-6dae-4a6b-ba42-675667eb6697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d35f9cdb-dd6f-4045-b1c1-e332cf08c4e0"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5c3def0-862b-4a1a-ade6-01db7fc2db98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdc7cf09-ee7e-4432-be87-f89a6b2c4a8f"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5833d59-bd30-4e15-9a68-a9421dd3c841"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5833d59-bd30-4e15-9a68-a9421dd3c841"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49d9d3ca-72ed-4c1c-ba02-cab4b0826c76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f327362-490f-4478-9c31-068b98e6198c"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.04, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85592299-47fe-4c9a-ba1b-0b48d04b94c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d1fb7c8-b611-47c3-ad37-6020efade9c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7deb0411-d086-4cec-b45d-2a368066c09c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b345c98-283a-4471-b8f7-11b6166ca166"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf3ab514-9e68-44eb-aa33-bb4a8a21ce25"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9d27fff-cc32-4229-8ad3-b74260123d03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4152542372881356, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47a73d1a-11db-4ea2-9a58-a5156c3e3d2d"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d35f9cdb-dd6f-4045-b1c1-e332cf08c4e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f21f404-6dae-4a6b-ba42-675667eb6697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f46ae87-5514-4e1d-8081-fa1c000a922f"], "isController": false}, {"data": [0.211864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5508474576271186, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8757062146892656, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5c3def0-862b-4a1a-ade6-01db7fc2db98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19a0b065-20ec-49ee-8b83-c21cfa090afb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d1fb7c8-b611-47c3-ad37-6020efade9c9"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f46ae87-5514-4e1d-8081-fa1c000a922f"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7deb0411-d086-4cec-b45d-2a368066c09c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49d9d3ca-72ed-4c1c-ba02-cab4b0826c76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf3ab514-9e68-44eb-aa33-bb4a8a21ce25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f327362-490f-4478-9c31-068b98e6198c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1378, 41, 2.9753265602322205, 348.7895500725686, 97, 2175, 113.5, 1001.0, 1205.2499999999998, 1588.9900000000007, 5.3856946881729675, 770.2999719332221, 3.9407876786112097], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1651.1525423728815, 1210, 2338, 1639.0, 2005.0, 2096.0, 2338.0, 0.25295507260668054, 304.38977871254446, 1.2437781157955436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c9d27fff-cc32-4229-8ad3-b74260123d03", 3, 0, 0.0, 275.6666666666667, 193, 435, 199.0, 435.0, 435.0, 435.0, 0.026575954076751354, 0.026653813317210586, 0.017042522633854224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47a73d1a-11db-4ea2-9a58-a5156c3e3d2d", 3, 0, 0.0, 310.3333333333333, 195, 465, 271.0, 465.0, 465.0, 465.0, 0.0469630557294928, 0.030192719747964933, 0.030116282482780213], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 454.93750000000006, 104, 1065, 435.5, 849.4000000000002, 1065.0, 1065.0, 0.07735485087435155, 0.015632440871885863, 0.05188308448841853], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 454.93750000000006, 104, 1065, 435.5, 849.4000000000002, 1065.0, 1065.0, 0.07814942169427946, 0.01579301362486324, 0.05241601531972882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f21f404-6dae-4a6b-ba42-675667eb6697", 3, 0, 0.0, 375.0, 308, 411, 406.0, 411.0, 411.0, 411.0, 0.02502669514148425, 0.02958070639932595, 0.01604901999632942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 166.26315789473685, 99, 318, 104.0, 309.0, 318.0, 318.0, 0.10337041973830961, 0.06034545782214847, 0.05712575827643426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 103.1578947368421, 100, 108, 103.0, 105.0, 108.0, 108.0, 0.1034779483045955, 0.07690109244120819, 0.05194107952008017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 290.4736842105263, 100, 813, 103.0, 812.0, 813.0, 813.0, 0.10347907544169227, 6.427552563285624, 0.059063277795024294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 318.1578947368421, 100, 1105, 103.0, 997.0, 1105.0, 1105.0, 0.1034779483045955, 19.624048275185988, 0.05896158176936399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d35f9cdb-dd6f-4045-b1c1-e332cf08c4e0", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 0.6229795258620691, 2.3774245689655173], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 213.375, 102, 396, 204.5, 334.4000000000001, 396.0, 396.0, 0.07794156331290615, 0.11783999419091785, 0.05037373131838154], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5c3def0-862b-4a1a-ade6-01db7fc2db98", 3, 0, 0.0, 395.3333333333333, 308, 482, 396.0, 482.0, 482.0, 482.0, 0.047898837654872906, 0.030794337359496743, 0.030716377011751183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 129.99999999999997, 100, 310, 104.0, 306.5, 310.0, 310.0, 0.08706440589426027, 0.06470313758352741, 0.04370225061489237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 705.0, 508, 812, 796.0, 812.0, 812.0, 812.0, 0.044664347429070536, 13.132801140057468, 0.02547263564314179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 152.875, 101, 305, 103.0, 304.3, 305.0, 305.0, 0.08698157621488797, 0.03143950771146037, 0.049150111852870666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1065.333333333333, 878, 1304, 1094.0, 1304.0, 1304.0, 1304.0, 0.04457276999955427, 40.1066567961712, 0.025376879794668107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 172.77777777777777, 101, 306, 105.0, 306.0, 306.0, 306.0, 0.04477166451099393, 0.07922485946671973, 0.024790560329817926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 102.81818181818183, 101, 105, 103.0, 104.8, 105.0, 105.0, 0.05739120453703559, 0.0426510807155118, 0.028807694464879192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 130.0, 100, 413, 102.0, 351.0000000000002, 413.0, 413.0, 0.05739150397044859, 0.015356711023342691, 0.03273109210814646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 157.9090909090909, 100, 306, 103.0, 305.8, 306.0, 306.0, 0.057329886591060704, 0.01545219599524683, 0.0337037028591978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 176.09090909090907, 99, 306, 104.0, 305.8, 306.0, 306.0, 0.057329886591060704, 0.01545219599524683, 0.033759689076571876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 149.55555555555554, 101, 304, 104.0, 304.0, 304.0, 304.0, 0.04477433733980737, 0.03327467843319669, 0.025141839814833238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 909.0833333333334, 99, 1376, 1116.0, 1358.3, 1376.0, 1376.0, 0.06640583928680129, 44.818542801676195, 0.03475930650168505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 196.5625, 99, 1214, 102.0, 579.8000000000006, 1214.0, 1214.0, 0.08707435605792621, 4.91885609636138, 0.05072251307475877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 599.1666666666666, 101, 911, 756.0, 910.7, 911.0, 911.0, 0.06640400194785072, 14.648210533196469, 0.03482319242773031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 173.0625, 102, 607, 104.0, 394.2000000000002, 607.0, 607.0, 0.08698015765153574, 1.6204195263658603, 0.050752582223430286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdc7cf09-ee7e-4432-be87-f89a6b2c4a8f", 2, 0, 0.0, 214.5, 209, 220, 214.5, 220.0, 220.0, 220.0, 0.019076142422479327, 0.032265506519271674, 0.011857387355378994], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 352.2666666666667, 105, 755, 382.0, 638.0000000000001, 755.0, 755.0, 0.08949346697691068, 0.018213318865222837, 0.06042556940218364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5833d59-bd30-4e15-9a68-a9421dd3c841", 3, 0, 0.0, 310.6666666666667, 220, 384, 328.0, 384.0, 384.0, 384.0, 0.04954419342053112, 0.0318521425799313, 0.0317715042442859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5833d59-bd30-4e15-9a68-a9421dd3c841", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 290.18181818181813, 205, 515, 208.0, 494.20000000000005, 515.0, 515.0, 0.05729942596393262, 0.08880291894996198, 0.12886775194818048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49d9d3ca-72ed-4c1c-ba02-cab4b0826c76", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f327362-490f-4478-9c31-068b98e6198c", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 462.8, 116, 1021, 360.0, 922.4000000000002, 1009.6, 1021.0, 0.11005749403488382, 0.06760367553509954, 0.04976232396303829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 104.66666666666667, 98, 110, 104.0, 109.4, 110.0, 110.0, 0.066404369407507, 0.04934934093663363, 0.03333188073775254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 186.75, 102, 307, 104.0, 306.4, 307.0, 307.0, 0.0664051043390202, 0.09257156879292121, 0.033688917679805655], "isController": false}, {"data": ["login", 25, 0, 0.0, 2432.0, 1479, 3703, 2541.0, 3261.8, 3572.7999999999997, 3703.0, 0.10966643856047446, 47.378244721480144, 0.23092924622966784], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 110.0625, 100, 128, 106.5, 121.7, 128.0, 128.0, 0.0858862115055316, 0.06953092708797431, 0.030529864246106937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85592299-47fe-4c9a-ba1b-0b48d04b94c7", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d1fb7c8-b611-47c3-ad37-6020efade9c9", 3, 0, 0.0, 280.0, 205, 395, 240.0, 395.0, 395.0, 395.0, 0.0207507625905252, 0.024526698882225587, 0.013306966895616747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7deb0411-d086-4cec-b45d-2a368066c09c", 3, 0, 0.0, 425.0, 201, 786, 288.0, 786.0, 786.0, 786.0, 0.04397988653189275, 0.028274829394690164, 0.028203247548121327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b345c98-283a-4471-b8f7-11b6166ca166", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1016.1666666666667, 202, 1485, 1224.0, 1466.1000000000001, 1485.0, 1485.0, 0.06636544130253239, 59.572818486715846, 0.13652226767947703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 770.6, 102, 1407, 1138.0, 1405.2, 1407.0, 1407.0, 0.07424198928935567, 53.29948414191109, 0.1201212186080122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 453.36842105263156, 204, 1210, 396.0, 1099.0, 1210.0, 1210.0, 0.10331252582813145, 26.146974005005223, 0.22678734917730606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf3ab514-9e68-44eb-aa33-bb4a8a21ce25", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["register", 25, 9, 36.0, 890.0799999999997, 137, 1988, 951.0, 1752.000000000001, 1983.8, 1988.0, 0.11050309850688213, 0.03442862162855046, 0.04985589014665971], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 119.94444444444443, 102, 309, 106.0, 154.20000000000024, 309.0, 309.0, 0.08547170886436589, 0.06635743022184656, 0.030382521510380064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 367.25000000000006, 204, 1520, 217.0, 885.1000000000006, 1520.0, 1520.0, 0.0869229808063193, 6.625675563030026, 0.19410181736938464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 285.16666666666674, 203, 609, 208.5, 604.5, 609.0, 609.0, 0.08302200083022002, 0.12866788605230386, 0.18671842569530925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9d27fff-cc32-4229-8ad3-b74260123d03", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 124.63636363636363, 100, 308, 103.0, 274.4000000000001, 308.0, 308.0, 0.05612731716526433, 0.041711805041763826, 0.028173282248970574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 119.72727272727272, 98, 304, 102.0, 263.8000000000002, 304.0, 304.0, 0.056070383623370135, 0.015003208117972087, 0.03197764066020328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 157.36363636363637, 101, 307, 103.0, 306.2, 307.0, 307.0, 0.05607066943281969, 0.015112797620564682, 0.032963420897028764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 106.66666666666667, 105, 109, 106.0, 109.0, 109.0, 109.0, 0.0178788528927984, 0.005272864817993278, 0.011052064337052135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 120.45454545454544, 99, 305, 102.0, 265.40000000000015, 305.0, 305.0, 0.05612846274345721, 0.01512837472382245, 0.03305220999443818], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1133.6949152542372, 782, 1873, 1017.0, 1585.0, 1637.0, 1873.0, 0.27074404133664953, 323.9039992967538, 0.5346137222487357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47a73d1a-11db-4ea2-9a58-a5156c3e3d2d", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 890.0799999999997, 137, 1988, 951.0, 1752.000000000001, 1983.8, 1988.0, 0.10966836287067908, 0.034168549306895946, 0.049479280904544655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 117.92307692307692, 100, 306, 102.0, 225.19999999999993, 306.0, 306.0, 0.06629744091878054, 0.017869232122640064, 0.039040387572289705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 117.46153846153847, 98, 299, 102.0, 221.39999999999992, 299.0, 299.0, 0.06623056387683153, 0.01785120666992725, 0.038936327591652914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d35f9cdb-dd6f-4045-b1c1-e332cf08c4e0", 3, 0, 0.0, 280.6666666666667, 198, 440, 204.0, 440.0, 440.0, 440.0, 0.07293414047115454, 0.03300079923662266, 0.04677091690370262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 146.5, 100, 305, 102.5, 301.4, 305.0, 305.0, 0.08500108612498938, 0.02291044899462604, 0.049971341647698835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f21f404-6dae-4a6b-ba42-675667eb6697", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 136.33333333333331, 99, 304, 103.0, 304.0, 304.0, 304.0, 0.08500068472773809, 0.022910340805523156, 0.05005411415119733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 114.61111111111111, 99, 304, 103.0, 132.10000000000028, 304.0, 304.0, 0.08499747368619877, 0.06316706784687233, 0.042664747533892745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 133.84615384615384, 100, 310, 103.0, 308.0, 310.0, 310.0, 0.0662268524414784, 0.01772085700094246, 0.037770001783030645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 157.22222222222226, 97, 305, 103.5, 302.3, 305.0, 305.0, 0.08500028333427778, 0.022744216439054797, 0.0484767240890803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 135.15384615384616, 99, 313, 104.0, 309.8, 313.0, 313.0, 0.06629642662260504, 0.04926912173808832, 0.03327769851954979], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 383.2, 103, 786, 406.0, 603.6000000000001, 786.0, 786.0, 0.08939586275947149, 0.017704571257442205, 0.060831090987109114], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 127.23076923076924, 103, 310, 105.0, 252.39999999999995, 310.0, 310.0, 0.07127466514614048, 0.05610095713651291, 0.025335916126167122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1358.9599999999998, 1014, 2103, 1259.0, 1862.6000000000001, 2045.1, 2103.0, 0.10946907498631638, 0.05665879857690202, 0.050351498357963875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 270.6153846153846, 202, 624, 208.0, 618.8, 624.0, 624.0, 0.06619144602851323, 0.10258381332739307, 0.14886611348014256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f46ae87-5514-4e1d-8081-fa1c000a922f", 3, 0, 0.0, 295.0, 205, 398, 282.0, 398.0, 398.0, 398.0, 0.02419940308139066, 0.024270299770105672, 0.015518497418730338], "isController": false}, {"data": ["addBook", 59, 20, 33.898305084745765, 1006.5762711864407, 520, 2800, 776.0, 1780.0, 1991.0, 2800.0, 0.265946657411122, 76.5882134004999, 0.9658394124494589], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 176.30508474576266, 99, 425, 105.0, 411.0, 415.0, 425.0, 0.2719808967993841, 0.20212642818782356, 0.13147514054267104], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 622.1186440677967, 487, 909, 600.0, 809.0, 821.0, 909.0, 0.2719357678498177, 79.9581448651383, 0.13676457074478138], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 170.83050847457628, 98, 410, 106.0, 305.0, 309.0, 410.0, 0.27242420604504697, 0.48206314585314947, 0.13248755333050136], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 955.8305084745762, 678, 1408, 911.0, 1212.0, 1277.0, 1408.0, 0.27132299853301634, 244.13691101496644, 0.13619142699801795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 131.33333333333334, 102, 309, 106.0, 298.20000000000005, 309.0, 309.0, 0.0834798094805237, 0.062365287356055295, 0.029674463526279907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 20, 11.299435028248588, 161.05649717514123, 100, 2175, 108.0, 294.2000000000001, 338.0, 946.4999999999982, 0.7511681301006227, 1.6986740901104684, 0.35700876734158626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 124.0, 103, 300, 106.0, 262.60000000000014, 300.0, 300.0, 0.056753103362879344, 0.043950401334729806, 0.020173954711023515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5c3def0-862b-4a1a-ade6-01db7fc2db98", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19a0b065-20ec-49ee-8b83-c21cfa090afb", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 126.94736842105263, 101, 309, 106.0, 305.0, 309.0, 309.0, 0.10428902330585225, 0.08463298668668284, 0.03707148875325217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d1fb7c8-b611-47c3-ad37-6020efade9c9", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 283.72727272727275, 206, 614, 208.0, 572.6000000000001, 614.0, 614.0, 0.056040389837330035, 0.08685165885922144, 0.12603615019079206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f46ae87-5514-4e1d-8081-fa1c000a922f", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 307.33333333333337, 205, 608, 216.0, 428.90000000000026, 608.0, 608.0, 0.08495615318538376, 0.1316654444386758, 0.19106837967376838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7deb0411-d086-4cec-b45d-2a368066c09c", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 0.23929014900662252, 0.9131829470198676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49d9d3ca-72ed-4c1c-ba02-cab4b0826c76", 3, 0, 0.0, 328.6666666666667, 254, 392, 340.0, 392.0, 392.0, 392.0, 0.08219853686604378, 0.03815596144888621, 0.05271195235224813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 110.45454545454545, 104, 148, 106.0, 140.40000000000003, 148.0, 148.0, 0.05958539399487566, 0.04940234326332952, 0.021180745521615956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 108.5, 105, 113, 107.5, 112.7, 113.0, 113.0, 0.06805305870143423, 0.052834161784804885, 0.024190735710275444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf3ab514-9e68-44eb-aa33-bb4a8a21ce25", 3, 0, 0.0, 357.0, 180, 449, 442.0, 449.0, 449.0, 449.0, 0.08300132802124834, 0.03852861124944666, 0.05322676308654272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 124.94444444444446, 100, 301, 103.0, 301.0, 301.0, 301.0, 0.08306107757904646, 0.061728007849271835, 0.041692767456669805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 124.16666666666669, 98, 308, 101.0, 305.3, 308.0, 308.0, 0.0830629940517667, 0.022225840205257887, 0.0473718637951482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 125.2777777777778, 100, 305, 102.5, 300.5, 305.0, 305.0, 0.0830629940517667, 0.022388072615515245, 0.04883195548746441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f327362-490f-4478-9c31-068b98e6198c", 3, 0, 0.0, 285.6666666666667, 210, 407, 240.0, 407.0, 407.0, 407.0, 0.12347711557458019, 0.055870179247612776, 0.07918291591208429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 147.61111111111114, 99, 309, 103.0, 306.3, 309.0, 309.0, 0.0830637606656176, 0.022388279241904743, 0.048913523126335366], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 21.951219512195124, 0.6531204644412192], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.317073170731708, 0.21770682148040638], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.317073170731708, 0.21770682148040638], "isController": false}, {"data": ["401/Unauthorized", 26, 63.41463414634146, 1.8867924528301887], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1378, 41, "401/Unauthorized", 26, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
