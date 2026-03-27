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

    var data = {"OkPercent": 98.36702954898911, "KoPercent": 1.6329704510108864};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7804551539491299, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5addc561-0769-4000-a282-2da45a56abf6"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f336738d-ad68-404b-9ab7-ad712778bd04"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/715a6a77-890d-4dab-beb3-b9f59e1a6312"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5adf5c6-935f-427b-af0a-c6d927322db5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75f80238-56f1-4194-816d-b0292cf03e00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78bc2ebb-2883-4bcd-99cc-61966bf8b84f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f7e26a4-f8a1-4eb3-9be9-851b0a3525f5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38739349-59ff-4a29-98cd-b455df980cb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e602e9dc-f271-4ade-b717-cc05558afe9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1cbb8398-dce1-4f8e-99e3-fb880808cdb7"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4def94d7-b414-4db4-98b7-6a66983c6bd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f7e26a4-f8a1-4eb3-9be9-851b0a3525f5"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64dd565c-635e-4a76-8270-0fa2432a6336"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf43f1ba-2b62-4d29-8161-7e78e8c03db1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e60b9bb-5b5a-4988-99e9-88264c33292d"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75f80238-56f1-4194-816d-b0292cf03e00"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e602e9dc-f271-4ade-b717-cc05558afe9b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38739349-59ff-4a29-98cd-b455df980cb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78bc2ebb-2883-4bcd-99cc-61966bf8b84f"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.953757225433526, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5adf5c6-935f-427b-af0a-c6d927322db5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1cbb8398-dce1-4f8e-99e3-fb880808cdb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4def94d7-b414-4db4-98b7-6a66983c6bd3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf43f1ba-2b62-4d29-8161-7e78e8c03db1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64dd565c-635e-4a76-8270-0fa2432a6336"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/26cb7603-8f8a-488d-a799-4af6b381f2f2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e60b9bb-5b5a-4988-99e9-88264c33292d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1286, 21, 1.6329704510108864, 388.6656298600311, 112, 2276, 127.0, 1126.0, 1352.6499999999999, 1740.4699999999978, 5.010910224438903, 702.4759991805156, 3.665754741564059], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1902.509090909091, 1388, 2764, 1842.0, 2308.8, 2329.6, 2764.0, 0.24727102702897116, 297.55057851585684, 1.2158297080965526], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5addc561-0769-4000-a282-2da45a56abf6", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 475.923076923077, 116, 806, 482.0, 745.5999999999999, 806.0, 806.0, 0.07466158202149105, 0.014801075342151058, 0.05019690197508601], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 475.923076923077, 116, 806, 482.0, 745.5999999999999, 806.0, 806.0, 0.07604874139332994, 0.015076068850435524, 0.051129524900112897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 198.57894736842104, 113, 345, 116.0, 344.0, 345.0, 345.0, 0.09179098709128855, 0.03181735284455438, 0.051943810026474455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 140.10526315789474, 114, 345, 116.0, 341.0, 345.0, 345.0, 0.09178876988555389, 0.06821411512002588, 0.046073659883959665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 209.89473684210526, 113, 773, 116.0, 344.0, 773.0, 773.0, 0.09179054364157242, 1.443936585415932, 0.05363726822887731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 236.5789473684211, 113, 1293, 116.0, 344.0, 1293.0, 1293.0, 0.09179010019614095, 4.370432574434525, 0.053547370334405826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f336738d-ad68-404b-9ab7-ad712778bd04", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 208.53846153846155, 114, 308, 211.0, 280.79999999999995, 308.0, 308.0, 0.07512149457102738, 0.16648959242255262, 0.04855358618457929], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/715a6a77-890d-4dab-beb3-b9f59e1a6312", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5adf5c6-935f-427b-af0a-c6d927322db5", 3, 0, 0.0, 321.3333333333333, 209, 447, 308.0, 447.0, 447.0, 447.0, 0.015357130059534475, 0.02117104355538037, 0.009848159575938448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75f80238-56f1-4194-816d-b0292cf03e00", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 116.36842105263158, 114, 121, 116.0, 119.0, 121.0, 121.0, 0.10216536809106698, 0.0759256299973652, 0.05128222578008635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 163.57894736842104, 114, 347, 116.0, 343.0, 347.0, 347.0, 0.10216646681471843, 0.035413787633555766, 0.05781521379677476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 726.6, 571, 1021, 679.0, 1021.0, 1021.0, 1021.0, 0.026321607934385496, 7.739426692347783, 0.015011542025079228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1178.8, 792, 1362, 1250.0, 1362.0, 1362.0, 1362.0, 0.02630582095206027, 23.670023933364725, 0.014976849233448377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 298.0, 115, 346, 343.0, 346.0, 346.0, 346.0, 0.026447889722879012, 0.046800367361188255, 0.014644485813351954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 132.57142857142856, 114, 345, 116.0, 232.0, 345.0, 345.0, 0.09199329763117259, 0.06836611279035384, 0.04617632322502218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78bc2ebb-2883-4bcd-99cc-61966bf8b84f", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 131.35714285714283, 114, 342, 115.0, 231.0, 342.0, 342.0, 0.09199511111695206, 0.02461587934184069, 0.052465961808886734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f7e26a4-f8a1-4eb3-9be9-851b0a3525f5", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38739349-59ff-4a29-98cd-b455df980cb9", 3, 0, 0.0, 855.0, 199, 2160, 206.0, 2160.0, 2160.0, 2160.0, 0.02058530895117851, 0.02469298941572031, 0.013200865440697155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 163.42857142857142, 114, 342, 115.0, 340.5, 342.0, 342.0, 0.09199390211848814, 0.02479523143037376, 0.054082352612626824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e602e9dc-f271-4ade-b717-cc05558afe9b", 3, 0, 0.0, 709.3333333333334, 228, 1501, 399.0, 1501.0, 1501.0, 1501.0, 0.01864987349169148, 0.02204351909125383, 0.011959717050336008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 130.57142857142858, 112, 339, 115.0, 227.5, 339.0, 339.0, 0.09199450661374793, 0.024795394360736744, 0.05417254637508789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 160.6, 114, 341, 116.0, 341.0, 341.0, 341.0, 0.026447609929490672, 0.019654913238615627, 0.014850952841266736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 789.5999999999999, 114, 1482, 1024.0, 1408.8, 1482.0, 1482.0, 0.10661890139883999, 57.573019787135365, 0.057182715476799734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 187.21052631578945, 113, 1245, 116.0, 342.0, 1245.0, 1245.0, 0.10216646681471843, 4.86448596992273, 0.05960060641175237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 568.6, 113, 1024, 677.0, 960.4000000000001, 1024.0, 1024.0, 0.10662041709907169, 18.821460668616634, 0.05728764989053637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 156.42105263157896, 113, 674, 115.0, 342.0, 674.0, 674.0, 0.10216811494450657, 1.6071838468177322, 0.0597013414270197], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 568.4615384615385, 117, 1514, 484.0, 1256.7999999999997, 1514.0, 1514.0, 0.07573550830177687, 0.015013972837168656, 0.05138545004369356], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1cbb8398-dce1-4f8e-99e3-fb880808cdb7", 3, 0, 0.0, 284.0, 208, 431, 213.0, 431.0, 431.0, 431.0, 0.10439866369710468, 0.04723767660773942, 0.06694836181096882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 296.85714285714283, 230, 685, 233.0, 571.0, 685.0, 685.0, 0.09192323097024971, 0.14246305424783817, 0.20673750090281745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4def94d7-b414-4db4-98b7-6a66983c6bd3", 3, 0, 0.0, 305.0, 221, 473, 221.0, 473.0, 473.0, 473.0, 0.023958982222435192, 0.028459090537000655, 0.015364321281965276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f7e26a4-f8a1-4eb3-9be9-851b0a3525f5", 3, 0, 0.0, 314.6666666666667, 208, 431, 305.0, 431.0, 431.0, 431.0, 0.028768699654775604, 0.028852982954545456, 0.018448677838511698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 568.35, 141, 1526, 439.0, 1201.0, 1509.9999999999998, 1526.0, 0.0847260172417445, 0.052043618012751265, 0.03830873631145284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 117.60000000000001, 114, 129, 116.0, 124.8, 129.0, 129.0, 0.10660829270372844, 0.07922745190189194, 0.05351236567355119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 193.4, 114, 346, 116.0, 346.0, 346.0, 346.0, 0.10661890139883999, 0.12461084100989424, 0.05543349912572501], "isController": false}, {"data": ["login", 20, 0, 0.0, 2363.85, 1395, 4066, 2307.5, 3451.8000000000006, 4036.7, 4066.0, 0.08188599831314844, 24.603323912605124, 0.15749460320092368], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 123.78947368421052, 115, 199, 118.0, 128.0, 199.0, 199.0, 0.10451562508595036, 0.08461274726196566, 0.03715203860477141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 908.3333333333334, 232, 1601, 1139.0, 1529.0, 1601.0, 1601.0, 0.10652047323495575, 76.5273454698618, 0.2232144838550469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64dd565c-635e-4a76-8270-0fa2432a6336", 3, 0, 0.0, 437.3333333333333, 193, 706, 413.0, 706.0, 706.0, 706.0, 0.01625848828575919, 0.02241363863612961, 0.010426179011375523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf43f1ba-2b62-4d29-8161-7e78e8c03db1", 3, 0, 0.0, 274.6666666666667, 211, 391, 222.0, 391.0, 391.0, 391.0, 0.07960515841426524, 0.03601926113145465, 0.05104888088414796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 449.8421052631579, 231, 1409, 455.0, 690.0, 1409.0, 1409.0, 0.0917378037004133, 5.91102466600197, 0.20508510341023214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 796.7777777777777, 114, 1479, 908.0, 1479.0, 1479.0, 1479.0, 0.047321348763598316, 31.45717467229966, 0.07321561545357513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e60b9bb-5b5a-4988-99e9-88264c33292d", 3, 0, 0.0, 499.3333333333333, 221, 867, 410.0, 867.0, 867.0, 867.0, 0.04437344692935747, 0.02852785080907585, 0.028455628401964264], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1119.2727272727275, 158, 2166, 1075.5, 1871.1999999999998, 2132.3999999999996, 2166.0, 0.08872541902595621, 0.02777395485489361, 0.04003041366210134], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 340.89473684210526, 231, 1361, 234.0, 465.0, 1361.0, 1361.0, 0.10210168252825262, 6.578809820166694, 0.2282541468732703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 134.21428571428572, 116, 345, 118.0, 232.5, 345.0, 345.0, 0.09436442191681102, 0.07326144084361794, 0.03354360310324142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 499.6111111111111, 230, 1738, 458.0, 1402.3000000000006, 1738.0, 1738.0, 0.11075151052754635, 14.874495080787073, 0.24593420821899264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 116.0, 115, 118, 116.0, 118.0, 118.0, 118.0, 0.0645726011278681, 0.04798803658037854, 0.03241241892551192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 165.11111111111111, 114, 345, 115.0, 345.0, 345.0, 345.0, 0.06457445434586077, 0.01727871141676353, 0.03682761849412373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 165.55555555555554, 114, 344, 115.0, 344.0, 344.0, 344.0, 0.06446899041561009, 0.017376407572957407, 0.03790071506855203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 139.66666666666666, 112, 340, 115.0, 340.0, 340.0, 340.0, 0.06457538099474787, 0.017405083158740633, 0.03802632298811812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 120.5, 117, 124, 120.5, 124.0, 124.0, 124.0, 0.04425072460561542, 0.013050506670796734, 0.027354207690775935], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1314.7999999999997, 910, 2276, 1245.0, 1821.4, 1843.6, 2276.0, 0.23299457334457355, 278.7425117397493, 0.46007326885032007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1119.2727272727275, 158, 2166, 1075.5, 1871.1999999999998, 2132.3999999999996, 2166.0, 0.08838287461282275, 0.027666727262501155, 0.03987586725695714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 115.66666666666667, 114, 117, 115.5, 117.0, 117.0, 117.0, 0.026136502239027023, 0.007044604119112753, 0.015390928564583297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 154.5, 116, 342, 117.0, 342.0, 342.0, 342.0, 0.02613593298746782, 0.007044450688028436, 0.015365069978960574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 326.07142857142856, 114, 1352, 116.0, 1131.5, 1352.0, 1352.0, 0.0921331455572081, 11.864366128071653, 0.0530331136396541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75f80238-56f1-4194-816d-b0292cf03e00", 3, 0, 0.0, 322.3333333333333, 202, 525, 240.0, 525.0, 525.0, 525.0, 0.03350383060463247, 0.03360198635835697, 0.021485203870809228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 273.35714285714283, 112, 896, 115.0, 889.0, 896.0, 896.0, 0.0921331455572081, 3.891314353356937, 0.053123087414612316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 152.33333333333334, 114, 340, 115.0, 340.0, 340.0, 340.0, 0.026136502239027023, 0.006993556263177153, 0.0149059739331951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 134.85714285714286, 114, 347, 117.0, 245.0, 347.0, 347.0, 0.09213193292795283, 0.06846914156071494, 0.046245911645476326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 156.0, 116, 346, 116.5, 346.0, 346.0, 346.0, 0.02613513607694184, 0.01942269390093041, 0.013118613226121198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 197.5714285714286, 114, 352, 115.0, 350.0, 352.0, 352.0, 0.09213253923859038, 0.04442104570432035, 0.05143895396663486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 156.66666666666666, 116, 342, 119.5, 342.0, 342.0, 342.0, 0.02713286966273843, 0.021356536082194507, 0.009644887262926552], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 518.3846153846155, 116, 2160, 423.0, 1505.9999999999995, 2160.0, 2160.0, 0.0737546805854987, 0.014311023133439238, 0.05019107958413707], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1119.7, 739, 1679, 1065.0, 1434.4, 1666.9499999999998, 1679.0, 0.08225070838422596, 0.042571167425429456, 0.03783211293844768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 311.6666666666667, 233, 689, 235.0, 689.0, 689.0, 689.0, 0.026121482307049314, 0.040483195723913346, 0.058747825930795486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e602e9dc-f271-4ade-b717-cc05558afe9b", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38739349-59ff-4a29-98cd-b455df980cb9", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78bc2ebb-2883-4bcd-99cc-61966bf8b84f", 3, 0, 0.0, 310.3333333333333, 238, 423, 270.0, 423.0, 423.0, 423.0, 0.01860869025835065, 0.025653581785193686, 0.011933307229476164], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 1175.1186440677968, 588, 2926, 940.0, 2159.0, 2326.0, 2926.0, 0.2821049813045682, 86.86832596842098, 1.02664155065697], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 191.41818181818178, 114, 469, 116.0, 461.4, 466.2, 469.0, 0.23411527836306598, 0.17398606136161446, 0.11317095975558365], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 744.9454545454545, 563, 1037, 683.0, 975.8, 1026.6, 1037.0, 0.23392907270515578, 68.78291455155797, 0.11764987543276878], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 159.4727272727273, 114, 361, 117.0, 343.4, 347.4, 361.0, 0.2344985780858947, 0.41495256200355585, 0.11404325379567926], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1119.8545454545456, 791, 1810, 1129.0, 1367.8, 1485.6, 1810.0, 0.23349012549032927, 210.0948253480595, 0.11720109814651293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 131.66666666666669, 114, 347, 117.5, 151.7000000000003, 347.0, 347.0, 0.10735565138041475, 0.0802022200254075, 0.0381615792016318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, 3.468208092485549, 188.01734104046233, 115, 1547, 121.0, 343.0, 354.0999999999999, 1063.039999999994, 0.7371677418805022, 1.5491874376816288, 0.35567577881984985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 169.44444444444446, 116, 342, 120.0, 342.0, 342.0, 342.0, 0.06817148916830784, 0.05279295987350401, 0.024232834040296924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 119.63157894736842, 116, 128, 119.0, 123.0, 128.0, 128.0, 0.09467054649818632, 0.07682736732421175, 0.03365242082552716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5adf5c6-935f-427b-af0a-c6d927322db5", 1, 0, 0.0, 1514.0, 1514, 1514, 1514.0, 1514.0, 1514.0, 1514.0, 0.6605019815059445, 0.1193289712681638, 0.45538515521796563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1cbb8398-dce1-4f8e-99e3-fb880808cdb7", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 332.77777777777777, 230, 462, 235.0, 462.0, 462.0, 462.0, 0.06441408234982572, 0.09982924676677092, 0.14486878090981312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4def94d7-b414-4db4-98b7-6a66983c6bd3", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 510.7142857142857, 232, 1469, 459.0, 1364.0, 1469.0, 1469.0, 0.09206226039152764, 15.856362940665873, 0.20368518241479308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf43f1ba-2b62-4d29-8161-7e78e8c03db1", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 140.3571428571429, 115, 350, 121.0, 251.5, 350.0, 350.0, 0.09638089730615393, 0.07990955255168425, 0.0342603970892969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 134.13333333333333, 116, 347, 118.0, 213.20000000000007, 347.0, 347.0, 0.10391913705548589, 0.08067940816319462, 0.036940005750192254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64dd565c-635e-4a76-8270-0fa2432a6336", 1, 0, 0.0, 871.0, 871, 871, 871.0, 871.0, 871.0, 871.0, 1.1481056257175661, 0.20742142652123996, 0.7915650114810563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26cb7603-8f8a-488d-a799-4af6b381f2f2", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 0.28360207593250447, 0.5299109125222026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e60b9bb-5b5a-4988-99e9-88264c33292d", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.22140203737745098, 0.8449180453431373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 137.94444444444446, 115, 494, 116.0, 161.90000000000052, 494.0, 494.0, 0.11160921892148291, 0.08294396054614112, 0.056022596216447486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 152.66666666666666, 113, 343, 115.0, 341.2, 343.0, 343.0, 0.11161129506306039, 0.048490844773491075, 0.06261180506467254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 291.2777777777778, 113, 1249, 116.0, 1243.6, 1249.0, 1249.0, 0.11083129629515605, 11.107241689961764, 0.06409839510125671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 297.77777777777777, 113, 917, 225.0, 902.6, 917.0, 917.0, 0.11105832412988888, 3.6549226987789756, 0.06433815023106301], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 33.333333333333336, 0.5443234836702955], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15552099533437014], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.15552099533437014], "isController": false}, {"data": ["401/Unauthorized", 10, 47.61904761904762, 0.7776049766718507], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1286, 21, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
