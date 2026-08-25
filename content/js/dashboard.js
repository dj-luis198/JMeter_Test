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

    var data = {"OkPercent": 98.94419306184012, "KoPercent": 1.0558069381598794};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7846502590673575, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.19642857142857142, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7da5d9b4-dbc6-4d32-96bc-a0179263ffdf"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad3c6a07-5ab5-4f49-8cc4-c3f080983049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f1f560d-b748-4b97-a401-b750abd1a1d0"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28078657-1834-4bd3-9522-53627be179fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83787066-d68e-4f25-a67c-b8dbf58ebcd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14ca10c6-730a-4eff-a843-454433946d23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/39a0d7c1-053b-482f-84cc-b3be50cc19dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddd9de01-fa67-47b4-ab9b-2bb2ef1039cd"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4354c0ae-de78-4ca8-97b9-14c347c5a563"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f1f560d-b748-4b97-a401-b750abd1a1d0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78db64da-4c53-4f1a-a8b8-2147735f2e26"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd4dd30b-cfa7-469a-8d6c-94347af4e204"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22688a42-2b1a-4c4f-9a23-3c02620156a4"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bfebfe7c-0469-4f5d-b74a-2ce394cdf704"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83787066-d68e-4f25-a67c-b8dbf58ebcd7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14ca10c6-730a-4eff-a843-454433946d23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d857a802-95a2-4b23-8c27-5a174a661e50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/422d9f85-d023-4075-9c1f-4c2d953cf161"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5535714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9630681818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28078657-1834-4bd3-9522-53627be179fb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78db64da-4c53-4f1a-a8b8-2147735f2e26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd4dd30b-cfa7-469a-8d6c-94347af4e204"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=422d9f85-d023-4075-9c1f-4c2d953cf161"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ddd9de01-fa67-47b4-ab9b-2bb2ef1039cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7da5d9b4-dbc6-4d32-96bc-a0179263ffdf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad3c6a07-5ab5-4f49-8cc4-c3f080983049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4354c0ae-de78-4ca8-97b9-14c347c5a563"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfebfe7c-0469-4f5d-b74a-2ce394cdf704"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22688a42-2b1a-4c4f-9a23-3c02620156a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39a0d7c1-053b-482f-84cc-b3be50cc19dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 14, 1.0558069381598794, 373.00000000000017, 97, 2708, 120.5, 1011.3, 1264.9499999999996, 1974.6800000000003, 5.196046929003033, 734.660605326242, 3.803429174226275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1653.2142857142856, 1218, 2541, 1644.5, 2068.6, 2159.7999999999997, 2541.0, 0.24951544990754565, 300.2517519688328, 1.2268655178559493], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7da5d9b4-dbc6-4d32-96bc-a0179263ffdf", 3, 0, 0.0, 356.0, 206, 433, 429.0, 433.0, 433.0, 433.0, 0.03680349387835218, 0.023661100393797384, 0.023601198873813088], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 788.8571428571429, 476, 1749, 635.5, 1433.5, 1749.0, 1749.0, 0.07221296635391575, 0.01304628786667423, 0.049082250568677106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 788.8571428571429, 476, 1749, 635.5, 1433.5, 1749.0, 1749.0, 0.07316779989651982, 0.013218791973492352, 0.04973123899216582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 150.05882352941177, 99, 310, 104.0, 307.6, 310.0, 310.0, 0.11261261261261261, 0.05998070680975092, 0.0625553747681505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad3c6a07-5ab5-4f49-8cc4-c3f080983049", 3, 0, 0.0, 428.0, 376, 500, 408.0, 500.0, 500.0, 500.0, 0.07077808710423253, 0.03202524123531354, 0.045388291534940776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 115.05882352941174, 100, 307, 103.0, 146.19999999999987, 307.0, 307.0, 0.11261410458538136, 0.08369075545847189, 0.056527001715709006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 266.8235294117647, 102, 814, 105.0, 787.6, 814.0, 814.0, 0.11261485058659089, 5.868380047795068, 0.06460733644349054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 317.05882352941177, 98, 1415, 104.0, 1246.9999999999998, 1415.0, 1415.0, 0.11261485058659089, 17.906945096534113, 0.06449736100346457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f1f560d-b748-4b97-a401-b750abd1a1d0", 3, 0, 0.0, 669.3333333333333, 202, 1513, 293.0, 1513.0, 1513.0, 1513.0, 0.04557815894623296, 0.029302364556904333, 0.02922818135549445], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 313.35714285714283, 200, 440, 311.0, 436.5, 440.0, 440.0, 0.07231442311168963, 0.16820568869157382, 0.046750144628846226], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28078657-1834-4bd3-9522-53627be179fb", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 115.29411764705881, 98, 306, 104.0, 146.79999999999984, 306.0, 306.0, 0.1536584263569395, 0.11419342036878022, 0.07712932729244813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83787066-d68e-4f25-a67c-b8dbf58ebcd7", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 156.52941176470586, 97, 411, 102.0, 330.19999999999993, 411.0, 411.0, 0.1536598152466692, 0.06826775109821574, 0.08611587531861814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 712.0000000000001, 608, 800, 774.0, 800.0, 800.0, 800.0, 0.07832781308745859, 23.030977775881748, 0.044671330901441236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1116.857142857143, 876, 1309, 1135.0, 1309.0, 1309.0, 1309.0, 0.07813895338453296, 70.30956760903175, 0.04448731428045186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 243.28571428571425, 102, 309, 294.0, 309.0, 309.0, 309.0, 0.07875787578757876, 0.13936452238973898, 0.04360909723784879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 103.76470588235293, 99, 108, 104.0, 107.2, 108.0, 108.0, 0.07530287258311001, 0.055962388706783904, 0.03779851221456889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 127.11764705882351, 99, 308, 103.0, 307.2, 308.0, 308.0, 0.07530220546871193, 0.020149222947682684, 0.04294578905637477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14ca10c6-730a-4eff-a843-454433946d23", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.17371544471153846, 0.6629356971153846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 112.70588235294116, 98, 292, 102.0, 144.79999999999987, 292.0, 292.0, 0.07530420684736723, 0.020296837001829448, 0.044270637228628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 150.47058823529412, 97, 308, 104.0, 307.2, 308.0, 308.0, 0.07530253902443347, 0.020296387471429332, 0.04434319436692712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.71428571428571, 100, 110, 105.0, 110.0, 110.0, 110.0, 0.07893816886002007, 0.05866401025632351, 0.044325631928233925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 814.7333333333332, 100, 1461, 1070.0, 1342.2, 1461.0, 1461.0, 0.08024351231202957, 48.14271166566808, 0.042577124045770895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 226.5294117647059, 99, 1107, 104.0, 1031.8, 1107.0, 1107.0, 0.15339360799812318, 16.274578928906575, 0.08862780958439356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 516.2, 101, 1011, 590.0, 894.0000000000001, 1011.0, 1011.0, 0.08024394158241052, 15.73679819986091, 0.04265571504038945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 191.76470588235296, 100, 814, 104.0, 569.1999999999998, 814.0, 814.0, 0.15365703749231713, 5.351868966701616, 0.0889300696653892], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 597.0, 264, 1040, 521.0, 1035.0, 1040.0, 1040.0, 0.07344416407426255, 0.013268721048572822, 0.05063630843401304], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 268.8235294117647, 205, 413, 212.0, 412.2, 413.0, 413.0, 0.07526753180053218, 0.1166499736010201, 0.16927844310217346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39a0d7c1-053b-482f-84cc-b3be50cc19dd", 3, 0, 0.0, 607.0, 412, 786, 623.0, 786.0, 786.0, 786.0, 0.05887432294528613, 0.03785051686749352, 0.0377546927741581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddd9de01-fa67-47b4-ab9b-2bb2ef1039cd", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 608.8636363636365, 168, 1630, 502.0, 1438.6999999999998, 1608.9999999999998, 1630.0, 0.09286187640084251, 0.05704113306262689, 0.04198735231795907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 116.13333333333334, 100, 309, 102.0, 187.20000000000007, 309.0, 309.0, 0.08024308304624142, 0.05963377558416965, 0.0402782662946954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 245.06666666666666, 98, 418, 301.0, 353.20000000000005, 418.0, 418.0, 0.08016246259085079, 0.10171656223279178, 0.041229391566908934], "isController": false}, {"data": ["login", 22, 0, 0.0, 2992.227272727273, 1648, 5498, 2995.0, 4274.7, 5329.849999999998, 5498.0, 0.09140691867277154, 34.91795823301078, 0.18614097128160811], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4354c0ae-de78-4ca8-97b9-14c347c5a563", 3, 0, 0.0, 389.0, 272, 569, 326.0, 569.0, 569.0, 569.0, 0.018384042650978948, 0.025343886922817662, 0.011789246101050954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 122.11764705882354, 100, 326, 107.0, 165.19999999999987, 326.0, 326.0, 0.14209294550317622, 0.11503423029505182, 0.050509601721832165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f1f560d-b748-4b97-a401-b750abd1a1d0", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78db64da-4c53-4f1a-a8b8-2147735f2e26", 3, 0, 0.0, 469.0, 430, 537, 440.0, 537.0, 537.0, 537.0, 0.020178376851366076, 0.023968390993045183, 0.012939909634502334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd4dd30b-cfa7-469a-8d6c-94347af4e204", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22688a42-2b1a-4c4f-9a23-3c02620156a4", 3, 0, 0.0, 398.3333333333333, 200, 502, 493.0, 502.0, 502.0, 502.0, 0.06675567423230974, 0.030205204161103696, 0.042808814530485094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 945.3333333333334, 205, 1566, 1171.0, 1446.6000000000001, 1566.0, 1566.0, 0.08011836152609456, 63.94099862697158, 0.1665220502422245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 476.5882352941176, 204, 1515, 225.0, 1350.1999999999998, 1515.0, 1515.0, 0.112534339522722, 23.90189808608877, 0.24801125550259823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 0, 0.0, 1221.857142857143, 977, 1415, 1238.0, 1415.0, 1415.0, 1415.0, 0.07804747516417844, 93.37191398889496, 0.17598791030672659], "isController": false}, {"data": ["register", 24, 9, 37.5, 1161.375, 150, 2573, 907.0, 2350.5, 2541.0, 2573.0, 0.09551630542930599, 0.029708928983626915, 0.043094270613612665], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 396.6470588235294, 205, 1413, 213.0, 1176.9999999999998, 1413.0, 1413.0, 0.15325256021924133, 21.779373853422943, 0.34005552869879563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 118.875, 100, 298, 107.0, 174.10000000000014, 298.0, 298.0, 0.10015837543115051, 0.07775967623805141, 0.03560317251654178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfebfe7c-0469-4f5d-b74a-2ce394cdf704", 3, 0, 0.0, 397.0, 295, 564, 332.0, 564.0, 564.0, 564.0, 0.024199793495095507, 0.02427069132760067, 0.015518747781685596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83787066-d68e-4f25-a67c-b8dbf58ebcd7", 3, 0, 0.0, 394.0, 201, 756, 225.0, 756.0, 756.0, 756.0, 0.040882517272863544, 0.03323035339529306, 0.026216978850111063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14ca10c6-730a-4eff-a843-454433946d23", 3, 0, 0.0, 454.3333333333333, 293, 673, 397.0, 673.0, 673.0, 673.0, 0.018186006474218305, 0.02507087806585759, 0.011662250245511088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 282.0, 202, 415, 215.0, 414.2, 415.0, 415.0, 0.0983688136142438, 0.15245244844316888, 0.2212337673375034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d857a802-95a2-4b23-8c27-5a174a661e50", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.7603236607142857, 1.4206659226190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 103.85714285714285, 103, 106, 104.0, 106.0, 106.0, 106.0, 0.03419237607705985, 0.02541054511195561, 0.017162970023055432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 103.57142857142858, 102, 106, 104.0, 106.0, 106.0, 106.0, 0.034193211182157006, 0.009149355335850606, 0.019500815752323916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 161.7142857142857, 102, 309, 104.0, 309.0, 309.0, 309.0, 0.034159338675203245, 0.009207009252300875, 0.02008195496335191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 103.14285714285714, 99, 107, 104.0, 107.0, 107.0, 107.0, 0.03419337820807159, 0.009216183970144296, 0.020135358456510908], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1152.75, 779, 2089, 1027.5, 1627.0, 1724.1999999999998, 2089.0, 0.2478336682038255, 296.49522809548677, 0.4893746846759132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1161.375, 150, 2573, 907.0, 2350.5, 2541.0, 2573.0, 0.09596123166240839, 0.02984731668405964, 0.043295008816438156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 142.70000000000002, 99, 309, 102.0, 308.8, 309.0, 309.0, 0.05078359080613872, 0.013687764709467079, 0.029904790289161768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 121.89999999999999, 98, 300, 102.5, 280.50000000000006, 300.0, 300.0, 0.05078539615148268, 0.013688251306454315, 0.029856258284367745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 138.93749999999997, 97, 309, 103.0, 297.8, 309.0, 309.0, 0.11006246044630329, 0.02966527254216768, 0.06470468866081501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 151.3125, 99, 310, 103.0, 300.2, 310.0, 310.0, 0.11006018916595013, 0.029664660361134996, 0.06481083404987102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 122.60000000000001, 100, 308, 102.5, 287.70000000000005, 308.0, 308.0, 0.05083651485188782, 0.013602739325602794, 0.028992699876467267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 118.74999999999997, 100, 351, 103.5, 180.20000000000016, 351.0, 351.0, 0.11006473182040188, 0.08179615323762288, 0.055247336089537656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 143.5, 99, 307, 105.0, 306.3, 307.0, 307.0, 0.05083444745497339, 0.03777833448558081, 0.02551650975767219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 153.93749999999997, 99, 312, 104.0, 309.9, 312.0, 312.0, 0.11005564688645696, 0.02944848363954024, 0.0627661111149325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 107.2, 104, 124, 106.0, 122.30000000000001, 124.0, 124.0, 0.04960563520015874, 0.03904506051887494, 0.017633253137556426], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 612.7142857142858, 408, 1513, 550.5, 1134.5, 1513.0, 1513.0, 0.07338833964123585, 0.013258635579715464, 0.049952805400333394], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1639.8181818181818, 1046, 2545, 1606.0, 2143.9, 2486.0499999999993, 2545.0, 0.09258791643519688, 0.04792148018618588, 0.042586824844704815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 288.80000000000007, 200, 617, 209.5, 616.0, 617.0, 617.0, 0.05075523794055547, 0.0786607056754507, 0.11414971970419847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/422d9f85-d023-4075-9c1f-4c2d953cf161", 3, 0, 0.0, 361.3333333333333, 210, 609, 265.0, 609.0, 609.0, 609.0, 0.019051247856734614, 0.026263683161872102, 0.012217108814377342], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1059.2500000000002, 526, 2202, 883.0, 1821.3, 1956.9999999999998, 2202.0, 0.264371918414826, 80.06321965616229, 0.962633920899922], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 189.5892857142857, 99, 704, 105.5, 416.3, 453.09999999999974, 704.0, 0.24882143063436138, 0.18491514522729394, 0.1202798907851649], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 656.535714285714, 486, 925, 606.5, 823.6, 909.1, 925.0, 0.24897852115650523, 73.2079520849728, 0.1252186898394533], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 162.91071428571428, 98, 401, 105.0, 308.0, 309.0, 401.0, 0.24952656789573355, 0.4415450595967472, 0.12135178790241728], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 961.142857142857, 678, 1349, 909.5, 1223.0, 1266.5, 1349.0, 0.24864797662709018, 223.73388644557718, 0.12480962889289489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 106.11764705882354, 101, 113, 106.0, 112.2, 113.0, 113.0, 0.09758953840148336, 0.07290624695032692, 0.03469003122865229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 5, 2.840909090909091, 167.5284090909091, 100, 1028, 110.0, 315.6, 375.0500000000002, 636.8399999999948, 0.705835171445759, 1.4784964344796472, 0.34073747994786446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 171.7142857142857, 105, 322, 117.0, 322.0, 322.0, 322.0, 0.03604661342066912, 0.0279150043384674, 0.012813444614378479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 118.58823529411765, 100, 302, 107.0, 152.39999999999986, 302.0, 302.0, 0.11076866940764826, 0.0898913713649958, 0.03937480045349996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28078657-1834-4bd3-9522-53627be179fb", 3, 0, 0.0, 318.6666666666667, 203, 423, 330.0, 423.0, 423.0, 423.0, 0.04594251060506287, 0.030074996362884573, 0.029461831345043567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78db64da-4c53-4f1a-a8b8-2147735f2e26", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 0.17540200242718446, 0.6693719660194175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 267.2857142857143, 207, 413, 212.0, 413.0, 413.0, 413.0, 0.03414134516899966, 0.05291241678047115, 0.07678468547285763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd4dd30b-cfa7-469a-8d6c-94347af4e204", 3, 0, 0.0, 363.0, 250, 444, 395.0, 444.0, 444.0, 444.0, 0.02138595228081181, 0.02527747159232672, 0.01371429882591122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 323.18750000000006, 205, 646, 306.5, 485.00000000000017, 646.0, 646.0, 0.1099762176429347, 0.17044165761654043, 0.2473390910465612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=422d9f85-d023-4075-9c1f-4c2d953cf161", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddd9de01-fa67-47b4-ab9b-2bb2ef1039cd", 3, 0, 0.0, 1178.3333333333333, 290, 2708, 537.0, 2708.0, 2708.0, 2708.0, 0.01831703117558706, 0.025251506194209374, 0.011746273247365399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 109.17647058823528, 104, 122, 107.0, 116.39999999999999, 122.0, 122.0, 0.07720464681144809, 0.06401049330363226, 0.02744383929625694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7da5d9b4-dbc6-4d32-96bc-a0179263ffdf", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad3c6a07-5ab5-4f49-8cc4-c3f080983049", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 123.26666666666668, 103, 309, 107.0, 198.60000000000008, 309.0, 309.0, 0.07810994756218854, 0.060642000304628796, 0.027765645422496706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4354c0ae-de78-4ca8-97b9-14c347c5a563", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfebfe7c-0469-4f5d-b74a-2ce394cdf704", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22688a42-2b1a-4c4f-9a23-3c02620156a4", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39a0d7c1-053b-482f-84cc-b3be50cc19dd", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 104.17647058823529, 100, 124, 103.0, 110.39999999999999, 124.0, 124.0, 0.09843887524899245, 0.07315623443797192, 0.049411701052716916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 127.52941176470591, 97, 309, 104.0, 308.2, 309.0, 309.0, 0.09843146564452344, 0.0263381070181635, 0.05613669525039228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 138.64705882352945, 97, 307, 103.0, 307.0, 307.0, 307.0, 0.09843374540401263, 0.026530970440925276, 0.057868276106655854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 174.3529411764706, 99, 312, 104.0, 307.2, 312.0, 312.0, 0.09843089572115106, 0.026530202362341496, 0.05796272472642001], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 64.28571428571429, 0.6787330316742082], "isController": false}, {"data": ["401/Unauthorized", 5, 35.714285714285715, 0.3770739064856712], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 14, "406/Not Acceptable", 9, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
