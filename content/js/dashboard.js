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

    var data = {"OkPercent": 98.68928296067848, "KoPercent": 1.3107170393215113};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8030605455755156, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc111d71-d886-4d9d-af2f-dc9ebc34892e"], "isController": false}, {"data": [0.22321428571428573, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/471ecaf8-8676-426a-a8bb-a506a821a7c1"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53e14bf2-e5d4-4790-b863-7cdb9e3a8005"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed471291-c851-4175-91d2-64b922b3b403"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ff0debb-c3de-49cc-a7a9-e6e2867e0eed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6ecdc4b-ad1f-446c-be9c-9c9ba3fd9e99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb44d6f4-259c-49bf-b7b6-e19daa965d5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86488641-db1c-4a98-8001-6ec21805b1cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e606404b-0ce1-4756-a4e6-e18059f8f53b"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb5bd6a9-862f-4b48-abac-e573cd605b4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6506a00e-08ca-453d-9f85-7f7b466d9f3d"], "isController": false}, {"data": [0.8913043478260869, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a545207e-468b-44bb-b5ff-f67f420bdf0b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/585f1529-d023-4553-95a6-cef284fc72f6"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=471ecaf8-8676-426a-a8bb-a506a821a7c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=766adac1-ef8a-4c18-8709-cfa42e55901d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9950e829-59e9-4e97-a227-29155644d19b"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed471291-c851-4175-91d2-64b922b3b403"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/337914e3-4d03-4cd9-829f-48b1e5eda9da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6ecdc4b-ad1f-446c-be9c-9c9ba3fd9e99"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb44d6f4-259c-49bf-b7b6-e19daa965d5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc111d71-d886-4d9d-af2f-dc9ebc34892e"], "isController": false}, {"data": [0.5178571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53e14bf2-e5d4-4790-b863-7cdb9e3a8005"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ff0debb-c3de-49cc-a7a9-e6e2867e0eed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb5bd6a9-862f-4b48-abac-e573cd605b4d"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/766adac1-ef8a-4c18-8709-cfa42e55901d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a545207e-468b-44bb-b5ff-f67f420bdf0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e606404b-0ce1-4756-a4e6-e18059f8f53b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=585f1529-d023-4553-95a6-cef284fc72f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 17, 1.3107170393215113, 325.1811873554357, 97, 2044, 115.0, 840.2, 963.0999999999999, 1347.2199999999998, 5.059114011444442, 703.2576784768731, 3.702906930537623], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/fc111d71-d886-4d9d-af2f-dc9ebc34892e", 3, 0, 0.0, 305.6666666666667, 205, 484, 228.0, 484.0, 484.0, 484.0, 0.015461446882199237, 0.021314852716833907, 0.00991505545505615], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1543.9464285714287, 1205, 2016, 1503.5, 1832.3, 1887.8999999999999, 2016.0, 0.2525560020384877, 303.9096474208282, 1.2418158889294781], "isController": true}, {"data": ["deleteBook", 12, 0, 0.0, 686.25, 431, 1549, 558.5, 1370.8000000000006, 1549.0, 1549.0, 0.08037185377680736, 0.014520305613973985, 0.05462774436392375], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 686.25, 431, 1549, 558.5, 1370.8000000000006, 1549.0, 1549.0, 0.08046940486169321, 0.014537929589270747, 0.054694048616932105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 153.2608695652174, 98, 331, 108.0, 322.8, 329.59999999999997, 331.0, 0.11076117002321169, 0.051336146907837076, 0.06195514834773229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 117.26086956521738, 100, 319, 108.0, 112.0, 277.5999999999994, 319.0, 0.11076277022504105, 0.08231491029419555, 0.05559771864811631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 240.91304347826087, 100, 638, 110.0, 593.8000000000002, 636.1999999999999, 638.0, 0.11076223681929383, 4.273930587593666, 0.06398268647785718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 247.43478260869563, 103, 992, 108.0, 959.0, 986.1999999999999, 992.0, 0.11076437047310835, 13.02587021515979, 0.06387575066940207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/471ecaf8-8676-426a-a8bb-a506a821a7c1", 3, 0, 0.0, 285.0, 206, 434, 215.0, 434.0, 434.0, 434.0, 0.030411467150546902, 0.02471921662594909, 0.019502145275578576], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 221.58333333333334, 199, 334, 211.5, 303.10000000000014, 334.0, 334.0, 0.08112328711559393, 0.18227652646985257, 0.05244493756887029], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53e14bf2-e5d4-4790-b863-7cdb9e3a8005", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed471291-c851-4175-91d2-64b922b3b403", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ff0debb-c3de-49cc-a7a9-e6e2867e0eed", 3, 0, 0.0, 329.0, 200, 549, 238.0, 549.0, 549.0, 549.0, 0.031615888037601826, 0.026356864994888766, 0.020274511534529818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 107.56249999999999, 100, 113, 108.0, 112.3, 113.0, 113.0, 0.0852828458885673, 0.0633791462121091, 0.04280799100265976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 146.1875, 100, 325, 106.5, 323.6, 325.0, 325.0, 0.08528693723947506, 0.022820918753531413, 0.04864020639438812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 690.2, 546, 771, 756.0, 771.0, 771.0, 771.0, 0.06029617481067001, 17.72907741576624, 0.03438766219671024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 827.0, 741, 964, 774.0, 964.0, 964.0, 964.0, 0.060317996477429005, 54.2742392581188, 0.03434120307259874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 251.6, 103, 391, 322.0, 391.0, 391.0, 391.0, 0.06061781678871054, 0.10726512111439795, 0.03356474816328015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6ecdc4b-ad1f-446c-be9c-9c9ba3fd9e99", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 107.9090909090909, 104, 111, 108.0, 111.0, 111.0, 111.0, 0.0834148523936271, 0.061990920577685765, 0.04187034583039485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 144.9090909090909, 103, 323, 108.0, 319.8, 323.0, 323.0, 0.08341675008341676, 0.02232049758091425, 0.04757361528194862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 163.0909090909091, 100, 320, 108.0, 318.6, 320.0, 320.0, 0.08341675008341676, 0.022483420920920923, 0.049039925342008676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb44d6f4-259c-49bf-b7b6-e19daa965d5e", 3, 0, 0.0, 584.6666666666666, 334, 967, 453.0, 967.0, 967.0, 967.0, 0.04380137536318641, 0.028160063913506884, 0.028088772612460032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 145.36363636363637, 100, 331, 107.0, 330.0, 331.0, 331.0, 0.08342181101167905, 0.022484784999241617, 0.04912436722660397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 109.4, 104, 113, 111.0, 113.0, 113.0, 113.0, 0.06077771159760293, 0.04516781106032796, 0.03412810953966961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 638.8666666666668, 106, 999, 737.0, 997.8, 999.0, 999.0, 0.0729323673846453, 43.756334100136144, 0.03869783816307677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 133.625, 98, 324, 108.0, 319.1, 324.0, 324.0, 0.08528375504373457, 0.022986637101631582, 0.05013752005500802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 544.1333333333333, 108, 855, 685.0, 805.2, 855.0, 855.0, 0.07293165817418025, 14.302771828445291, 0.038768684179178496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 120.375, 99, 328, 107.5, 177.50000000000017, 328.0, 328.0, 0.08528739185825236, 0.02298761733679458, 0.05022294657277946], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 593.0833333333333, 416, 1312, 458.5, 1174.0000000000005, 1312.0, 1312.0, 0.08052394245222247, 0.014547782571934722, 0.05551748376100494], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/86488641-db1c-4a98-8001-6ec21805b1cb", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 293.6363636363636, 214, 442, 219.0, 440.0, 442.0, 442.0, 0.08334659301858628, 0.12917094054735978, 0.18744844113457443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e606404b-0ce1-4756-a4e6-e18059f8f53b", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 396.0, 164, 734, 348.0, 594.6, 720.8999999999999, 734.0, 0.08774678784080225, 0.053899149952992796, 0.039674573017862744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 123.06666666666668, 105, 324, 108.0, 198.60000000000008, 324.0, 324.0, 0.0729323673846453, 0.054200714433315506, 0.03660862972237079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 194.40000000000003, 105, 354, 114.0, 333.6, 354.0, 354.0, 0.07293201277768864, 0.0925419875675229, 0.03751060553019142], "isController": false}, {"data": ["login", 21, 0, 0.0, 1875.857142857143, 1272, 2696, 1675.0, 2555.8, 2682.2, 2696.0, 0.08945648793828355, 25.60421983692295, 0.17028931053541838], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 112.5, 107, 120, 111.5, 120.0, 120.0, 120.0, 0.08752878876567996, 0.07086070887377802, 0.031113749131550298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 786.8, 218, 1113, 965.0, 1107.0, 1113.0, 1113.0, 0.07289373551237006, 58.17515677468303, 0.15150602254117282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb5bd6a9-862f-4b48-abac-e573cd605b4d", 3, 0, 0.0, 335.3333333333333, 207, 575, 224.0, 575.0, 575.0, 575.0, 0.027338588417551372, 0.02741868193830592, 0.017531581765161525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6506a00e-08ca-453d-9f85-7f7b466d9f3d", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 417.2608695652175, 210, 1103, 226.0, 1067.2, 1096.8, 1103.0, 0.11070252786815811, 17.423803269575092, 0.24527810851494963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 943.0, 857, 1068, 888.0, 1068.0, 1068.0, 1068.0, 0.06021339627640357, 72.0361555101279, 0.13577415234591392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a545207e-468b-44bb-b5ff-f67f420bdf0b", 3, 0, 0.0, 305.6666666666667, 220, 466, 231.0, 466.0, 466.0, 466.0, 0.03153280988868918, 0.02628760616045996, 0.020221235508046123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/585f1529-d023-4553-95a6-cef284fc72f6", 3, 0, 0.0, 399.33333333333337, 203, 766, 229.0, 766.0, 766.0, 766.0, 0.021786492374727667, 0.02575089642338417, 0.013971155591866378], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 738.0909090909092, 138, 1644, 804.0, 1095.7, 1562.2499999999989, 1644.0, 0.09426241800240798, 0.029657848845928078, 0.042528551872180166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=471ecaf8-8676-426a-a8bb-a506a821a7c1", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 122.93749999999999, 104, 316, 110.0, 176.70000000000016, 316.0, 316.0, 0.08556836109848384, 0.0664324678450143, 0.030416878359226674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 284.24999999999994, 204, 439, 221.5, 438.3, 439.0, 439.0, 0.085235596515995, 0.1320985270223477, 0.19169685427376607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 331.2631578947369, 213, 640, 224.0, 440.0, 640.0, 640.0, 0.1202272928610299, 0.18632882204145945, 0.2703939994716327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=766adac1-ef8a-4c18-8709-cfa42e55901d", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 155.66666666666666, 104, 323, 110.0, 323.0, 323.0, 323.0, 0.07083044764842913, 0.052638643223100176, 0.035553564542277906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 131.66666666666666, 106, 321, 109.0, 321.0, 321.0, 321.0, 0.07083156254426973, 0.018952976696415925, 0.04039612551352883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 179.33333333333334, 106, 325, 109.0, 325.0, 325.0, 325.0, 0.07071024512884977, 0.01905862075738529, 0.0415698902027027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 130.88888888888889, 102, 324, 107.0, 324.0, 324.0, 324.0, 0.07083434993742965, 0.019092070881572838, 0.041712024426045005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9950e829-59e9-4e97-a227-29155644d19b", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1002.4464285714284, 793, 1575, 869.5, 1387.3, 1439.85, 1575.0, 0.2390343014222541, 285.9681262698697, 0.47199937253495877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed471291-c851-4175-91d2-64b922b3b403", 3, 0, 0.0, 299.3333333333333, 208, 449, 241.0, 449.0, 449.0, 449.0, 0.053646149994635385, 0.034489305416472944, 0.034401990719216055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 738.0909090909092, 138, 1644, 804.0, 1095.7, 1562.2499999999989, 1644.0, 0.09011592184491869, 0.028353233932740755, 0.04065776942612542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 144.0, 100, 318, 109.0, 318.0, 318.0, 318.0, 0.031182924230691276, 0.008404772546553507, 0.01836260088975277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 145.66666666666666, 100, 316, 109.0, 316.0, 316.0, 316.0, 0.031183248358981557, 0.008404859909256747, 0.01833233936729189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 196.6875, 97, 923, 108.5, 503.00000000000045, 923.0, 923.0, 0.08793721283003936, 4.967599130314705, 0.05122514399718601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 188.625, 98, 771, 109.5, 465.8000000000003, 771.0, 771.0, 0.08793721283003936, 1.638249235358454, 0.051311020181590346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 105.16666666666666, 101, 113, 103.5, 113.0, 113.0, 113.0, 0.031216182468991924, 0.008352767574710731, 0.01780297906434696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 132.875, 101, 303, 110.0, 296.7, 303.0, 303.0, 0.0879343130681381, 0.06534962133286434, 0.044138903239280255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/337914e3-4d03-4cd9-829f-48b1e5eda9da", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.8607437668463612, 1.6083010444743935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 142.66666666666666, 102, 333, 105.5, 333.0, 333.0, 333.0, 0.0312173193687858, 0.023199589882466794, 0.015669631011285063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 145.5, 99, 319, 108.5, 312.7, 319.0, 319.0, 0.08793721283003936, 0.031784922752654605, 0.04969010720095851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 216.66666666666666, 107, 333, 211.0, 333.0, 333.0, 333.0, 0.030193540595215333, 0.02376561886693707, 0.01073286013345545], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 504.5, 433, 766, 464.5, 708.7000000000003, 766.0, 766.0, 0.0825150589982672, 0.01490750577605413, 0.05616503527518772], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1037.8095238095239, 820, 1958, 933.0, 1408.6000000000001, 1906.1999999999994, 1958.0, 0.09002019024266872, 0.04659248127794376, 0.04140577109794625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 292.16666666666663, 211, 652, 217.0, 652.0, 652.0, 652.0, 0.031165593185123623, 0.048300582407022646, 0.07009214951693331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6ecdc4b-ad1f-446c-be9c-9c9ba3fd9e99", 3, 0, 0.0, 287.3333333333333, 205, 448, 209.0, 448.0, 448.0, 448.0, 0.05682033410356453, 0.03601210628243494, 0.036437518940111366], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1052.3389830508472, 550, 2679, 900.0, 1569.0, 1890.0, 2679.0, 0.29058886108867393, 83.59631073738154, 1.0579106430017338], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb44d6f4-259c-49bf-b7b6-e19daa965d5e", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 195.6428571428572, 104, 475, 111.0, 440.3, 446.45, 475.0, 0.23973936905735335, 0.17816568344984954, 0.11588963640956047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc111d71-d886-4d9d-af2f-dc9ebc34892e", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 0.21872162530266345, 0.8346890133171914], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 619.0714285714284, 486, 850, 540.0, 784.3, 834.25, 850.0, 0.2397003745318352, 70.47986891385767, 0.12055243445692884], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 152.6071428571428, 99, 448, 109.5, 326.8, 335.6, 448.0, 0.2401228056634679, 0.42490480845918344, 0.11677847384805372], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 801.1428571428571, 688, 1125, 748.5, 953.8000000000001, 1062.55, 1125.0, 0.23951993361876125, 215.5204573012947, 0.12022777917972978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 114.5263157894737, 107, 155, 113.0, 116.0, 155.0, 155.0, 0.11280851644926287, 0.08427589363641222, 0.04009990233157392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 185.57471264367805, 100, 2044, 112.0, 303.0, 412.0, 1382.5, 0.7250997012089162, 1.534793553644876, 0.3485179733046627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 134.77777777777777, 110, 321, 111.0, 321.0, 321.0, 321.0, 0.07565568258238063, 0.05858882449983188, 0.02689323091795562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53e14bf2-e5d4-4790-b863-7cdb9e3a8005", 3, 0, 0.0, 308.3333333333333, 215, 463, 247.0, 463.0, 463.0, 463.0, 0.02542825418082879, 0.02550275101924919, 0.016306530187575757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ff0debb-c3de-49cc-a7a9-e6e2867e0eed", 1, 0, 0.0, 1312.0, 1312, 1312, 1312.0, 1312.0, 1312.0, 1312.0, 0.7621951219512195, 0.13770126714939024, 0.5254978086890244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 120.08695652173914, 106, 306, 111.0, 121.20000000000002, 269.9999999999995, 306.0, 0.11191397221613994, 0.09082081143712138, 0.039781919811206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb5bd6a9-862f-4b48-abac-e573cd605b4d", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 337.0, 216, 645, 220.0, 645.0, 645.0, 645.0, 0.07064974212844123, 0.10949330152132446, 0.15889292590019546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 359.50000000000006, 205, 1036, 221.5, 744.8000000000003, 1036.0, 1036.0, 0.08788166733493351, 6.698751127700302, 0.19624259528295152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/766adac1-ef8a-4c18-8709-cfa42e55901d", 3, 0, 0.0, 312.6666666666667, 199, 534, 205.0, 534.0, 534.0, 534.0, 0.01954690279325241, 0.02694698350567186, 0.012534960450100014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 110.18181818181817, 104, 118, 109.0, 117.6, 118.0, 118.0, 0.08210548315344768, 0.0680737843723409, 0.029185933464702107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a545207e-468b-44bb-b5ff-f67f420bdf0b", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 112.2, 103, 133, 110.0, 124.60000000000001, 133.0, 133.0, 0.07176484096911241, 0.05571586774457458, 0.02551015831323918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e606404b-0ce1-4756-a4e6-e18059f8f53b", 3, 0, 0.0, 305.6666666666667, 220, 433, 264.0, 433.0, 433.0, 433.0, 0.049198071435599726, 0.031629619493915836, 0.03154954450785529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 118.52631578947368, 102, 310, 109.0, 113.0, 310.0, 310.0, 0.12031179752157697, 0.08941140421281257, 0.06039088274032282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=585f1529-d023-4553-95a6-cef284fc72f6", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 852.0, 1.1737089201877935, 0.21204702171361503, 0.8092172828638498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 164.1052631578947, 102, 334, 108.0, 330.0, 334.0, 334.0, 0.12030798845043311, 0.03219178597208855, 0.06861314966313764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 154.3684210526316, 102, 330, 109.0, 330.0, 330.0, 330.0, 0.12030875024536652, 0.03242696783957145, 0.07072838637471744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 174.0, 102, 331, 109.0, 323.0, 331.0, 331.0, 0.12030646488950801, 0.0324263518647502, 0.07084452961755208], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.4626060138781804], "isController": false}, {"data": ["401/Unauthorized", 11, 64.70588235294117, 0.8481110254433307], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 17, "401/Unauthorized", 11, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
