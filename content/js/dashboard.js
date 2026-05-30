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

    var data = {"OkPercent": 96.96, "KoPercent": 3.04};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7180887372013652, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3db07f95-18d6-46aa-a5c6-abb8db009545"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1acfc70-951d-48cd-a024-9c2115221e61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6da262cb-9470-4411-8bfa-8fa66ef4543a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21485097-75d8-4832-a24d-865faa3286ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d04bb0d4-1a38-4877-96e6-151f310854e6"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e70e89c-8e2b-4ca5-ab79-72320e5df6d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=145275a1-dff5-434b-8e55-fe31f7082bea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/346f26b0-0eab-4ce4-90b2-396353a18600"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78bfc9a9-9055-4518-8e3b-dc3eb1aa4d48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea3a0900-64c5-4322-a8d0-d28d2270ca00"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd0c43da-bc06-4b42-ab21-04c2cfa810f5"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/072dafa0-3fec-4d2d-8a48-bbbc84f3dfe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f50c5c4-b2b1-46ef-a968-832e5d1bf12b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21485097-75d8-4832-a24d-865faa3286ba"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b595f43c-0486-4bd6-acd2-5b09e952149f"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc92ea98-0b5e-475d-a755-10d37ba89d0e"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77dbe17f-9761-4cea-b6ee-6df7ca792336"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b595f43c-0486-4bd6-acd2-5b09e952149f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e70e89c-8e2b-4ca5-ab79-72320e5df6d6"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2830188679245283, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78bfc9a9-9055-4518-8e3b-dc3eb1aa4d48"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/145275a1-dff5-434b-8e55-fe31f7082bea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6da262cb-9470-4411-8bfa-8fa66ef4543a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d04bb0d4-1a38-4877-96e6-151f310854e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd0c43da-bc06-4b42-ab21-04c2cfa810f5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1acfc70-951d-48cd-a024-9c2115221e61"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea3a0900-64c5-4322-a8d0-d28d2270ca00"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41509433962264153, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8819875776397516, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=072dafa0-3fec-4d2d-8a48-bbbc84f3dfe7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 38, 3.04, 462.22800000000007, 126, 3277, 158.5, 1268.8000000000002, 1534.3500000000001, 2109.7400000000002, 4.976431619848398, 708.1067968351886, 3.6299219707963086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2225.9811320754716, 1603, 3262, 2220.0, 2679.4, 2869.9, 3262.0, 0.23959350475570504, 288.3112627594843, 1.1780793910595457], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3db07f95-18d6-46aa-a5c6-abb8db009545", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1acfc70-951d-48cd-a024-9c2115221e61", 1, 0, 0.0, 2658.0, 2658, 2658, 2658.0, 2658.0, 2658.0, 2658.0, 0.3762227238525207, 0.06796992569601204, 0.2593879326561324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6da262cb-9470-4411-8bfa-8fa66ef4543a", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21485097-75d8-4832-a24d-865faa3286ba", 3, 0, 0.0, 397.6666666666667, 225, 497, 471.0, 497.0, 497.0, 497.0, 0.03182247303045411, 0.026529086403318025, 0.020406989541013866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d04bb0d4-1a38-4877-96e6-151f310854e6", 3, 0, 0.0, 850.3333333333334, 224, 1734, 593.0, 1734.0, 1734.0, 1734.0, 0.06640988179041042, 0.030048742086155752, 0.04258706612210564], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 658.7333333333335, 135, 3277, 490.0, 1875.4000000000008, 3277.0, 3277.0, 0.07896316105326327, 0.01667171427706594, 0.05266267069203315], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 658.7333333333335, 135, 3277, 490.0, 1875.4000000000008, 3277.0, 3277.0, 0.08031698436496038, 0.01695755080049261, 0.05356557212465196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e70e89c-8e2b-4ca5-ab79-72320e5df6d6", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 154.21428571428572, 128, 378, 138.5, 261.5, 378.0, 378.0, 0.12281779103430127, 0.046039537459426266, 0.06930775177647162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 178.57142857142858, 129, 420, 141.5, 419.5, 420.0, 420.0, 0.12282102345004256, 0.0912761707475414, 0.06165039653644714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 308.21428571428567, 133, 1137, 143.0, 781.5, 1137.0, 1137.0, 0.12251362964129761, 2.6037393730365004, 0.07139221972819476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 283.8571428571429, 126, 1378, 139.5, 898.0, 1378.0, 1378.0, 0.1225372206807818, 7.906326107101907, 0.07128630165162668], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 442.0, 130, 2097, 258.0, 1576.2000000000005, 2097.0, 2097.0, 0.08295915298704801, 0.12490456456814575, 0.05361154246990138], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=145275a1-dff5-434b-8e55-fe31f7082bea", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 137.06666666666666, 127, 145, 137.0, 144.4, 145.0, 145.0, 0.08085904651012356, 0.06009153749433986, 0.04058745108027686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 910.5714285714286, 698, 1113, 838.0, 1113.0, 1113.0, 1113.0, 0.039562551219374346, 11.632703658829513, 0.02256301749229943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 189.4, 130, 421, 141.0, 406.6, 421.0, 421.0, 0.08086035416835126, 0.045926154281555755, 0.044757469475216305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/346f26b0-0eab-4ce4-90b2-396353a18600", 2, 0, 0.0, 313.0, 273, 353, 313.0, 353.0, 353.0, 353.0, 0.01733387646146246, 0.024511184683786758, 0.010774426140352398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1331.7142857142858, 1168, 1548, 1310.0, 1548.0, 1548.0, 1548.0, 0.039550033617528575, 35.58718977059568, 0.022517255467792145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 360.57142857142856, 136, 423, 392.0, 423.0, 423.0, 423.0, 0.03972487685288176, 0.07029441099357592, 0.02199609880428121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78bfc9a9-9055-4518-8e3b-dc3eb1aa4d48", 3, 0, 0.0, 753.6666666666666, 306, 1400, 555.0, 1400.0, 1400.0, 1400.0, 0.020041285047197228, 0.02368812044478292, 0.012851995944979992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 187.54545454545453, 129, 422, 136.0, 418.0, 422.0, 422.0, 0.05618551435284503, 0.04175505510011237, 0.028202494509142917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 159.63636363636365, 127, 407, 136.0, 354.0000000000002, 407.0, 407.0, 0.056188097317784555, 0.015034705727610322, 0.03204477425154901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 185.63636363636363, 128, 425, 137.0, 418.40000000000003, 425.0, 425.0, 0.05618637531477139, 0.01514398397155948, 0.03303144330028553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 197.81818181818178, 128, 534, 137.0, 511.20000000000005, 534.0, 534.0, 0.05618436644465329, 0.015143442518285458, 0.03308512984973236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 140.57142857142858, 131, 154, 140.0, 154.0, 154.0, 154.0, 0.03978131642059081, 0.029564044722724225, 0.02233814154476535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 819.0588235294118, 129, 1592, 1190.0, 1576.8, 1592.0, 1592.0, 0.08947415512713225, 42.63376160039, 0.04853027186985195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 422.8, 128, 1533, 141.0, 1450.2, 1533.0, 1533.0, 0.08086209777844865, 14.569407434124344, 0.04614825189621619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 592.4117647058824, 127, 1256, 754.0, 1107.1999999999998, 1256.0, 1256.0, 0.0895991229827021, 13.958779544651986, 0.04868555286611782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 301.59999999999997, 126, 1045, 136.0, 923.8000000000001, 1045.0, 1045.0, 0.08086166186887472, 4.772638485703658, 0.04622696958792897], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 557.6666666666667, 141, 2658, 431.0, 1433.4000000000008, 2658.0, 2658.0, 0.08045699573577922, 0.016987111794995575, 0.05394180612545928], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea3a0900-64c5-4322-a8d0-d28d2270ca00", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.6124205508474576, 2.337129237288136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 416.63636363636357, 270, 957, 282.0, 930.0000000000001, 957.0, 957.0, 0.05614479231530915, 0.0870134623089801, 0.12627095381070016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd0c43da-bc06-4b42-ab21-04c2cfa810f5", 3, 0, 0.0, 735.0, 365, 1353, 487.0, 1353.0, 1353.0, 1353.0, 0.04358184670811784, 0.02801892814079842, 0.02794799414550526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 597.0, 153, 1504, 437.0, 1264.4, 1459.5999999999995, 1504.0, 0.09693884002141084, 0.059545439817839274, 0.043830745048743375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 151.0, 128, 409, 136.0, 196.19999999999982, 409.0, 409.0, 0.08960195648507337, 0.06658895398939534, 0.04497598206379659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 257.4117647058824, 128, 564, 143.0, 453.5999999999999, 564.0, 564.0, 0.0894656793865812, 0.09507784171942511, 0.04704554395133067], "isController": false}, {"data": ["login", 23, 0, 0.0, 2915.4347826086955, 1661, 4558, 2977.0, 4363.800000000001, 4553.4, 4558.0, 0.09978611064110407, 36.46781114963361, 0.20091530030196145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 180.5333333333333, 129, 435, 143.0, 425.4, 435.0, 435.0, 0.08199051096486434, 0.0663770835838599, 0.029145064444541617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/072dafa0-3fec-4d2d-8a48-bbbc84f3dfe7", 3, 0, 0.0, 433.6666666666667, 280, 566, 455.0, 566.0, 566.0, 566.0, 0.023077988214840684, 0.02314559950843885, 0.014799360932043017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f50c5c4-b2b1-46ef-a968-832e5d1bf12b", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21485097-75d8-4832-a24d-865faa3286ba", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 974.0, 258, 1724, 1333.0, 1716.8, 1724.0, 1724.0, 0.08940357298749928, 56.68989762633514, 0.18896057335300212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b595f43c-0486-4bd6-acd2-5b09e952149f", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 760.8, 130, 1689, 142.0, 1626.6000000000001, 1689.0, 1689.0, 0.0810876557558721, 45.28245111090088, 0.11398200360840068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 527.5, 268, 1513, 419.5, 1178.5, 1513.0, 1513.0, 0.12236585642988874, 10.632676204101879, 0.27296736109290193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc92ea98-0b5e-475d-a755-10d37ba89d0e", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1110.2916666666665, 259, 2391, 1073.0, 1828.0, 2259.25, 2391.0, 0.09953756506231466, 0.03125129606204508, 0.044908549862098995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 157.33333333333331, 131, 379, 143.0, 196.3000000000003, 379.0, 379.0, 0.09406600297875675, 0.07302975817198401, 0.033437524496354946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 578.2, 264, 1677, 285.0, 1594.2, 1677.0, 1677.0, 0.08080111613275084, 19.433425940390325, 0.17758885934411042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77dbe17f-9761-4cea-b6ee-6df7ca792336", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b595f43c-0486-4bd6-acd2-5b09e952149f", 3, 0, 0.0, 1044.6666666666667, 281, 2097, 756.0, 2097.0, 2097.0, 2097.0, 0.060521697028384676, 0.02738449181948395, 0.038811114305311784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e70e89c-8e2b-4ca5-ab79-72320e5df6d6", 3, 0, 0.0, 353.3333333333333, 291, 444, 325.0, 444.0, 444.0, 444.0, 0.019383350993719795, 0.022910464667381697, 0.01243007859948828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 405.5882352941176, 264, 804, 283.0, 614.3999999999999, 804.0, 804.0, 0.07933655968676061, 0.12295617209266511, 0.17842978218614225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 169.22222222222223, 128, 419, 141.0, 419.0, 419.0, 419.0, 0.05384030964160301, 0.04001218323951161, 0.02702531167557026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 136.55555555555554, 126, 147, 134.0, 147.0, 147.0, 147.0, 0.053839343399296496, 0.014406230558014885, 0.03070525053241129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 225.77777777777777, 127, 426, 141.0, 426.0, 426.0, 426.0, 0.05383805513016845, 0.014511038296803216, 0.03165088787925919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 200.66666666666666, 127, 422, 142.0, 422.0, 422.0, 422.0, 0.05383612284206874, 0.01451051748477634, 0.031702326243913524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 218.75, 141, 424, 155.0, 424.0, 424.0, 424.0, 0.10394470141884517, 0.03065556623876098, 0.06425487890442284], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1506.6037735849063, 1032, 2692, 1404.0, 2012.6000000000001, 2215.8999999999996, 2692.0, 0.24223477577286606, 289.7970062581126, 0.4783190591921242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78bfc9a9-9055-4518-8e3b-dc3eb1aa4d48", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1110.2916666666665, 259, 2391, 1073.0, 1828.0, 2259.25, 2391.0, 0.10183947552670104, 0.03197401502132264, 0.04594710712239832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 137.66666666666669, 132, 143, 137.5, 143.0, 143.0, 143.0, 0.02988404988644061, 0.008054685320954696, 0.017597736407737975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 135.16666666666666, 128, 145, 134.5, 145.0, 145.0, 145.0, 0.02988404988644061, 0.008054685320954696, 0.017568552765270747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 269.0555555555556, 128, 1523, 138.0, 542.9000000000016, 1523.0, 1523.0, 0.10161511581300561, 5.1055035258328205, 0.05925343233280079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 244.44444444444446, 128, 833, 138.0, 595.4000000000003, 833.0, 833.0, 0.10162314749470713, 1.6859011115031757, 0.05935735709244883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 136.83333333333334, 132, 143, 136.5, 143.0, 143.0, 143.0, 0.029884198729921554, 0.00799635786327979, 0.017043332088158385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 171.44444444444443, 131, 424, 139.5, 386.20000000000005, 424.0, 424.0, 0.10162142631317465, 0.07552139201594328, 0.05100919250485525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 135.66666666666666, 130, 142, 135.0, 142.0, 142.0, 142.0, 0.02988315685669034, 0.022208088249942724, 0.014999943969080894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 222.72222222222223, 128, 426, 137.5, 412.5, 426.0, 426.0, 0.10162257376105145, 0.03567155231304269, 0.057482473634587805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/145275a1-dff5-434b-8e55-fe31f7082bea", 3, 0, 0.0, 373.3333333333333, 243, 575, 302.0, 575.0, 575.0, 575.0, 0.024240073689824018, 0.02865094647387728, 0.015544578505518656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 195.0, 130, 401, 155.0, 401.0, 401.0, 401.0, 0.02940138774550159, 0.023142107932494414, 0.010451274550158767], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 458.0666666666666, 133, 900, 471.0, 813.6, 900.0, 900.0, 0.08133519862055502, 0.01657946008339569, 0.05534076567600395], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1528.2608695652175, 994, 2846, 1315.0, 2644.0000000000005, 2823.5999999999995, 2846.0, 0.09735202492211838, 0.0503872785241433, 0.04477812865070094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6da262cb-9470-4411-8bfa-8fa66ef4543a", 3, 0, 0.0, 562.0, 515, 636, 535.0, 636.0, 636.0, 636.0, 0.03095591877166914, 0.02550437187861152, 0.01985128905605085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 276.66666666666663, 268, 283, 276.5, 283.0, 283.0, 283.0, 0.029863077788340457, 0.04628193793954718, 0.06716276186186336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d04bb0d4-1a38-4877-96e6-151f310854e6", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd0c43da-bc06-4b42-ab21-04c2cfa810f5", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1acfc70-951d-48cd-a024-9c2115221e61", 3, 0, 0.0, 516.6666666666666, 227, 900, 423.0, 900.0, 900.0, 900.0, 0.06620032217490125, 0.029953921817419512, 0.042452680561378735], "isController": false}, {"data": ["addBook", 54, 15, 27.77777777777778, 1338.8148148148148, 693, 3003, 1136.0, 2271.0, 2418.75, 3003.0, 0.26363711815336843, 82.84010237145249, 0.9565713535080824], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ea3a0900-64c5-4322-a8d0-d28d2270ca00", 3, 0, 0.0, 320.6666666666667, 243, 441, 278.0, 441.0, 441.0, 441.0, 0.08301510874979245, 0.038480961868393386, 0.05323560033759478], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 245.6037735849056, 129, 571, 143.0, 534.6, 555.0, 571.0, 0.24354603019970775, 0.1809946572089625, 0.11772977045786653], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 850.6981132075472, 630, 1264, 798.0, 1121.6000000000001, 1208.2, 1264.0, 0.24343752153044118, 71.57871421640677, 0.1224319566290793], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 202.96226415094347, 128, 531, 141.0, 419.0, 455.89999999999975, 531.0, 0.24402933877257849, 0.4318175408749142, 0.11867833077025788], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1257.9811320754714, 889, 2126, 1251.0, 1577.8, 1659.5999999999995, 2126.0, 0.24286303441323376, 218.5285852727054, 0.12190585907070522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 148.0588235294118, 133, 190, 145.0, 169.99999999999997, 190.0, 190.0, 0.0811692187223965, 0.060639113596321605, 0.02885312071772688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 15, 9.316770186335404, 213.64596273291937, 128, 1001, 146.0, 402.60000000000014, 542.3000000000003, 844.7599999999989, 0.6916312617330304, 1.5509389713273736, 0.3298320619418085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 145.33333333333334, 133, 156, 148.0, 156.0, 156.0, 156.0, 0.053571747450877685, 0.041486714578658206, 0.01904308210167918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 163.7142857142857, 131, 408, 145.0, 286.5, 408.0, 408.0, 0.12635949275689334, 0.10254368992283044, 0.044916850940926935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=072dafa0-3fec-4d2d-8a48-bbbc84f3dfe7", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 401.1111111111111, 269, 846, 286.0, 846.0, 846.0, 846.0, 0.05379461217073214, 0.08337114210444523, 0.12098534358319935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 515.3333333333334, 265, 1664, 400.0, 1023.200000000001, 1664.0, 1664.0, 0.10153887810821788, 6.897278396687012, 0.22692000146667268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 144.0, 135, 154, 145.0, 152.8, 154.0, 154.0, 0.05905184214905759, 0.048959974594287005, 0.020991084513922814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 174.99999999999997, 131, 409, 143.0, 402.6, 409.0, 409.0, 0.0883529962060184, 0.06859436717166467, 0.031406729120108105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 151.88235294117646, 128, 384, 137.0, 197.59999999999985, 384.0, 384.0, 0.07938917038316949, 0.058999178380460926, 0.03984964216498938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 200.88235294117646, 126, 422, 136.0, 422.0, 422.0, 422.0, 0.07939324877173974, 0.021243896644000674, 0.04527896219013282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 199.29411764705878, 129, 419, 141.0, 407.8, 419.0, 419.0, 0.0793880581680972, 0.02139756255311995, 0.04667149513397902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 212.47058823529414, 128, 422, 138.0, 403.59999999999997, 422.0, 422.0, 0.07938917038316949, 0.021397862329838653, 0.04674967748149532], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.42105263157895, 0.56], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.32], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.526315789473685, 0.32], "isController": false}, {"data": ["401/Unauthorized", 23, 60.526315789473685, 1.84], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 38, "401/Unauthorized", 23, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
