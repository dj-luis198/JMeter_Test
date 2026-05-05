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

    var data = {"OkPercent": 97.87735849056604, "KoPercent": 2.1226415094339623};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7699798522498321, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e99830d5-bb9d-4578-b0c1-1c4f660bf808"], "isController": false}, {"data": [0.11320754716981132, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07b65270-899b-4872-bea2-72161fcd7026"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec876b72-91f0-4d98-89aa-45bb32f0baeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1af17362-30e1-46ed-b57c-1cf7c3aa1f1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f384366e-e908-4469-a133-235f0bb86aa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dab8e30f-fbbf-4a00-9e30-4f66a52f7460"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68b7baa2-1e02-41a3-8d1c-9ec92987d83f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9900c010-1681-41e9-9aee-fac370733513"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67884c23-bce9-47eb-b6cb-954851f46c3e"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07b65270-899b-4872-bea2-72161fcd7026"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7622ed00-bfe4-4e0f-a1a4-0101ab727b1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec876b72-91f0-4d98-89aa-45bb32f0baeb"], "isController": false}, {"data": [0.42452830188679247, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e99830d5-bb9d-4578-b0c1-1c4f660bf808"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1af17362-30e1-46ed-b57c-1cf7c3aa1f1a"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34efcc79-823f-456a-9711-8294b6297316"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5566037735849056, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6649904f-c901-4dc2-9bdc-1deb81fc637f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9900c010-1681-41e9-9aee-fac370733513"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9424242424242424, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6649904f-c901-4dc2-9bdc-1deb81fc637f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a822d97-429e-4f1f-a52f-93108ccfb9f0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34efcc79-823f-456a-9711-8294b6297316"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f384366e-e908-4469-a133-235f0bb86aa8"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f2c2a8c-4ce8-40f2-b57c-180345d2e906"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67884c23-bce9-47eb-b6cb-954851f46c3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7622ed00-bfe4-4e0f-a1a4-0101ab727b1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ececc66-db21-4b32-8e02-bc2eea560ff2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dab8e30f-fbbf-4a00-9e30-4f66a52f7460"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68b7baa2-1e02-41a3-8d1c-9ec92987d83f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe29bfbc-2669-47a5-8e9b-d050aab05f57"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 27, 2.1226415094339623, 374.8962264150939, 94, 3734, 126.0, 1037.000000000001, 1305.0, 1782.4499999999994, 5.048600719981266, 715.4709258323047, 3.6872442769129714], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e99830d5-bb9d-4578-b0c1-1c4f660bf808", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1710.0566037735846, 1237, 2554, 1645.0, 2123.2, 2194.2999999999997, 2554.0, 0.2381797673028613, 286.61187104250837, 1.171128055048737], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07b65270-899b-4872-bea2-72161fcd7026", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 509.0, 104, 1308, 471.0, 1075.2, 1308.0, 1308.0, 0.09458172807122635, 0.019248859501995674, 0.06338084160398], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 509.0, 104, 1308, 471.0, 1075.2, 1308.0, 1308.0, 0.09583807199355969, 0.019504545120564293, 0.06422273925974673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 158.7058823529412, 98, 309, 101.0, 304.2, 309.0, 309.0, 0.14283553748172545, 0.038219665302727315, 0.08146089247004655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 104.29411764705883, 99, 130, 103.0, 110.79999999999998, 130.0, 130.0, 0.142828337142089, 0.1061448872706345, 0.07169313016702514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 135.70588235294122, 96, 305, 102.0, 301.8, 305.0, 305.0, 0.14282953714828225, 0.03849702368449796, 0.08410762783243575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 146.11764705882354, 94, 306, 101.0, 301.2, 306.0, 306.0, 0.14283193722116266, 0.038497670579141496, 0.08396955684291008], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 224.0, 101, 404, 208.0, 386.0, 404.0, 404.0, 0.09468979622755852, 0.18278336316061913, 0.06119697963222483], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 114.77777777777779, 95, 302, 103.0, 150.80000000000024, 302.0, 302.0, 0.10640373122417493, 0.07907542916171593, 0.05340968539963468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 125.61111111111111, 98, 330, 102.0, 303.00000000000006, 330.0, 330.0, 0.10640687624880292, 0.0373509380061716, 0.060188698555231075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 692.25, 594, 800, 692.5, 800.0, 800.0, 800.0, 0.08753980325429218, 25.73960875179183, 0.04992504404346351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 996.375, 680, 1279, 994.0, 1279.0, 1279.0, 1279.0, 0.08725146964194179, 78.5090257555432, 0.04967539726684772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 202.0, 99, 307, 200.0, 307.0, 307.0, 307.0, 0.08782908460136574, 0.1554163098610105, 0.04863192477438904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec876b72-91f0-4d98-89aa-45bb32f0baeb", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 116.12500000000001, 100, 303, 103.0, 169.30000000000013, 303.0, 303.0, 0.07761677686631965, 0.057681999214130135, 0.03895998370047686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 126.68749999999997, 98, 304, 101.0, 299.1, 304.0, 304.0, 0.07761828298655749, 0.0280551435453121, 0.043859256829196114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 201.6875, 100, 900, 103.0, 484.90000000000043, 900.0, 900.0, 0.07761790645101825, 4.384658464535893, 0.0452139464824535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 168.875, 98, 776, 102.5, 443.50000000000034, 776.0, 776.0, 0.07761865952574999, 1.446017056094035, 0.045290184635386345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 152.75, 99, 314, 103.0, 314.0, 314.0, 314.0, 0.08801751548558163, 0.0654114543794215, 0.04942389785567328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 849.9285714285714, 99, 1396, 1075.5, 1349.0, 1396.0, 1396.0, 0.06621044517065743, 42.55958090266119, 0.0348602427558679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 193.55555555555554, 95, 993, 101.0, 376.50000000000097, 993.0, 993.0, 0.10640561821664184, 5.3461953433502405, 0.06204685246269893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 576.3571428571429, 102, 891, 670.0, 848.5, 891.0, 891.0, 0.06621013204192047, 13.910796773911315, 0.03492473622356324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 194.99999999999997, 98, 776, 103.5, 353.90000000000066, 776.0, 776.0, 0.10640687624880292, 1.765261905008217, 0.06215149900686915], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 399.4, 108, 1006, 425.0, 746.8000000000002, 1006.0, 1006.0, 0.09607870767732926, 0.019553518242143964, 0.06487189305479048], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 320.1875, 203, 1004, 211.5, 722.6000000000003, 1004.0, 1004.0, 0.07757763824577565, 5.9133299064825815, 0.17323336626342456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1af17362-30e1-46ed-b57c-1cf7c3aa1f1a", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f384366e-e908-4469-a133-235f0bb86aa8", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dab8e30f-fbbf-4a00-9e30-4f66a52f7460", 3, 0, 0.0, 270.0, 192, 398, 220.0, 398.0, 398.0, 398.0, 0.03118600372152978, 0.025998488128527918, 0.019998837021944552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68b7baa2-1e02-41a3-8d1c-9ec92987d83f", 3, 0, 0.0, 433.0, 220, 837, 242.0, 837.0, 837.0, 837.0, 0.017608423869979396, 0.02427463381815194, 0.011291860359329237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 104.07142857142858, 97, 114, 105.0, 111.0, 114.0, 114.0, 0.06620887955658968, 0.049204059904848385, 0.033233753996178804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 670.9583333333335, 130, 2223, 503.0, 1532.0, 2060.0, 2223.0, 0.10945309934692983, 0.0672324213761903, 0.0494890478492466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 175.7857142857143, 98, 309, 108.0, 307.5, 309.0, 309.0, 0.06620981891614526, 0.0887477595070206, 0.03378843716451721], "isController": false}, {"data": ["login", 24, 0, 0.0, 3031.666666666666, 1587, 6164, 2803.5, 4420.5, 5733.0, 6164.0, 0.10679672134065483, 42.73228147833362, 0.2201639440919164], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9900c010-1681-41e9-9aee-fac370733513", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 131.44444444444443, 101, 319, 105.0, 319.0, 319.0, 319.0, 0.1066894270777766, 0.08637259281980156, 0.037924757281553395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67884c23-bce9-47eb-b6cb-954851f46c3e", 1, 0, 0.0, 1006.0, 1006, 1006, 1006.0, 1006.0, 1006.0, 1006.0, 0.9940357852882703, 0.17958654324055665, 0.6853410785288271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 977.3571428571428, 210, 1502, 1176.5, 1455.0, 1502.0, 1502.0, 0.06617633156232866, 56.579230942398226, 0.13673795295335514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07b65270-899b-4872-bea2-72161fcd7026", 3, 0, 0.0, 264.3333333333333, 180, 374, 239.0, 374.0, 374.0, 374.0, 0.01784121320249777, 0.024595552705917335, 0.011441142581028843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7622ed00-bfe4-4e0f-a1a4-0101ab727b1d", 3, 0, 0.0, 331.0, 188, 579, 226.0, 579.0, 579.0, 579.0, 0.028254174554290395, 0.023554342784354722, 0.0181187252187344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 289.52941176470586, 202, 415, 208.0, 409.4, 415.0, 415.0, 0.1427036464978846, 0.22116278026576455, 0.3209438455904573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 700.642857142857, 101, 1412, 861.5, 1399.0, 1412.0, 1412.0, 0.15252039960344696, 104.28458910731989, 0.23983449834406423], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1051.9166666666667, 171, 1808, 1064.0, 1702.0, 1789.75, 1808.0, 0.10207032645492745, 0.031896977017164825, 0.04605126056853172], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 358.27777777777777, 204, 1296, 307.5, 517.5000000000013, 1296.0, 1296.0, 0.10633898505346487, 7.2233374841229985, 0.2376473238022095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 110.33333333333331, 103, 126, 107.0, 124.2, 126.0, 126.0, 0.10927104074595698, 0.08483445057913651, 0.03884244026516439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 455.85714285714283, 200, 1521, 313.0, 1345.0, 1521.0, 1521.0, 0.15400523617803005, 26.525124510483355, 0.34073228802279276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 168.33333333333331, 99, 306, 101.5, 306.0, 306.0, 306.0, 0.03486689562594795, 0.025911823800142956, 0.017501547218493403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 135.16666666666669, 99, 299, 103.5, 299.0, 299.0, 299.0, 0.03486770611172775, 0.009329835424427153, 0.019885488641844733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 183.0, 99, 399, 101.0, 399.0, 399.0, 399.0, 0.03482763224342193, 0.009387135253109817, 0.02047483848685547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 167.0, 98, 306, 101.0, 306.0, 306.0, 306.0, 0.03486730086412794, 0.009397827186034484, 0.020532209395575342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 110.0, 108, 111, 111.0, 111.0, 111.0, 111.0, 0.08346316492321389, 0.02461511309258847, 0.05159392909804139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec876b72-91f0-4d98-89aa-45bb32f0baeb", 3, 0, 0.0, 284.3333333333333, 206, 440, 207.0, 440.0, 440.0, 440.0, 0.055866962140821985, 0.0252783454999162, 0.03582614434160785], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1171.2452830188686, 787, 2116, 1084.0, 1701.2, 1756.8999999999999, 2116.0, 0.2278188281515296, 272.550521108704, 0.4498531938695243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1051.9166666666667, 171, 1808, 1064.0, 1702.0, 1789.75, 1808.0, 0.10717347813661046, 0.03349171191769077, 0.048353659081166046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 100.33333333333333, 96, 104, 100.5, 104.0, 104.0, 104.0, 0.02818343659431352, 0.007596316894561066, 0.01659630104137798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 99.83333333333334, 97, 104, 100.0, 104.0, 104.0, 104.0, 0.028184230922798696, 0.007596530990910586, 0.01656924513234845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 134.44444444444443, 97, 304, 102.0, 296.8, 304.0, 304.0, 0.1094843893508184, 0.02950946431721277, 0.06436484608319597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 156.33333333333331, 99, 304, 102.5, 303.1, 304.0, 304.0, 0.10948505528995292, 0.02950964380862012, 0.06447215658187658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 133.5, 99, 295, 101.5, 295.0, 295.0, 295.0, 0.02818396614166201, 0.007541412815249404, 0.016073668190166614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 126.22222222222221, 98, 314, 104.0, 302.3, 314.0, 314.0, 0.10948239158202056, 0.0813633789003102, 0.05495502858706892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 101.16666666666667, 97, 106, 101.5, 106.0, 106.0, 106.0, 0.02818343659431352, 0.020944917234641203, 0.01414676407175503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 146.88888888888889, 96, 306, 103.0, 305.1, 306.0, 306.0, 0.1094843893508184, 0.029295627619261952, 0.06244031580163861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 174.16666666666666, 105, 309, 109.5, 309.0, 309.0, 309.0, 0.029098245375803838, 0.0229035017313456, 0.010343516910930271], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 452.9333333333334, 101, 1144, 412.0, 959.8000000000001, 1144.0, 1144.0, 0.09693867659318715, 0.01919840196591636, 0.06596374008802032], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e99830d5-bb9d-4578-b0c1-1c4f660bf808", 3, 0, 0.0, 380.0, 278, 437, 425.0, 437.0, 437.0, 437.0, 0.0603998469870543, 0.026739515593227167, 0.03873297479313053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1679.4583333333333, 1095, 3734, 1569.5, 2482.0, 3469.75, 3734.0, 0.10922992900054615, 0.0565350218459858, 0.05024150054614965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 236.5, 200, 399, 204.5, 399.0, 399.0, 399.0, 0.028169675344491656, 0.04365749489424634, 0.06335426007652761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1af17362-30e1-46ed-b57c-1cf7c3aa1f1a", 3, 0, 0.0, 701.0, 204, 1487, 412.0, 1487.0, 1487.0, 1487.0, 0.03322811098189068, 0.027700908927285817, 0.021308391482527552], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1080.8571428571424, 514, 2712, 928.0, 1783.8000000000002, 2084.0499999999997, 2712.0, 0.2940234483700075, 89.07106166912124, 1.0698445974503965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34efcc79-823f-456a-9711-8294b6297316", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 190.67924528301884, 98, 705, 104.0, 411.4, 509.8999999999996, 705.0, 0.22893871785678802, 0.1701390276259919, 0.11066861849522469], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 648.8867924528303, 486, 911, 603.0, 816.0, 883.0, 911.0, 0.22876874932556382, 67.26560813909572, 0.11505459560807164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6649904f-c901-4dc2-9bdc-1deb81fc637f", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 163.3396226415095, 96, 423, 107.0, 308.0, 326.8999999999999, 423.0, 0.2295743777668044, 0.4062390356576656, 0.11164847668737168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9900c010-1681-41e9-9aee-fac370733513", 3, 0, 0.0, 593.3333333333333, 262, 1144, 374.0, 1144.0, 1144.0, 1144.0, 0.03168333562157424, 0.026413093270459514, 0.020317764054199626], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 977.3773584905662, 684, 1406, 969.0, 1264.6000000000001, 1340.3, 1406.0, 0.22854580187235068, 205.6459142654085, 0.11471927945545728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 126.14285714285714, 102, 364, 105.5, 248.5, 364.0, 364.0, 0.14239653366152344, 0.10638022290143109, 0.050617517824994664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 7, 4.242424242424242, 180.47272727272733, 97, 2112, 109.0, 336.6, 407.8999999999999, 1351.680000000004, 0.6928988367698317, 1.4819365669487254, 0.3334411613404443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 106.33333333333333, 100, 119, 104.5, 119.0, 119.0, 119.0, 0.036495462397508574, 0.028262599298070606, 0.012972996399114377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 117.58823529411767, 104, 299, 106.0, 150.19999999999987, 299.0, 299.0, 0.15728944032716205, 0.12764406729674965, 0.05591148074129588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6649904f-c901-4dc2-9bdc-1deb81fc637f", 3, 0, 0.0, 931.6666666666667, 317, 2071, 407.0, 2071.0, 2071.0, 2071.0, 0.021427653100581406, 0.025326760549547876, 0.013741040562547319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 387.1666666666667, 202, 706, 303.5, 706.0, 706.0, 706.0, 0.034806418303535175, 0.0539431502419046, 0.0782804505400796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a822d97-429e-4f1f-a52f-93108ccfb9f0", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34efcc79-823f-456a-9711-8294b6297316", 3, 0, 0.0, 372.6666666666667, 205, 509, 404.0, 509.0, 509.0, 509.0, 0.035145678838786776, 0.029299506349652647, 0.02253808180742511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f384366e-e908-4469-a133-235f0bb86aa8", 3, 0, 0.0, 366.3333333333333, 255, 559, 285.0, 559.0, 559.0, 559.0, 0.017176719819071883, 0.023679494932867654, 0.011015018894391802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 317.5, 201, 620, 210.0, 604.7, 620.0, 620.0, 0.10941384571432045, 0.1695700909654556, 0.2460743033985156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f2c2a8c-4ce8-40f2-b57c-180345d2e906", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67884c23-bce9-47eb-b6cb-954851f46c3e", 3, 0, 0.0, 286.3333333333333, 208, 405, 246.0, 405.0, 405.0, 405.0, 0.027503002411096544, 0.027583577613472805, 0.017637016520136783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 119.5, 102, 292, 106.0, 189.8000000000001, 292.0, 292.0, 0.08125952260030472, 0.06737239715591671, 0.02888522092432707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7622ed00-bfe4-4e0f-a1a4-0101ab727b1d", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ececc66-db21-4b32-8e02-bc2eea560ff2", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 112.7857142857143, 104, 134, 107.5, 132.0, 134.0, 134.0, 0.06393044367727913, 0.04963349875335635, 0.022725274900907814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dab8e30f-fbbf-4a00-9e30-4f66a52f7460", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68b7baa2-1e02-41a3-8d1c-9ec92987d83f", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 116.14285714285714, 99, 302, 101.5, 204.5, 302.0, 302.0, 0.1541782300339192, 0.11457971978106692, 0.0773902443724946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 144.0, 99, 299, 101.5, 298.5, 299.0, 299.0, 0.15417992797594793, 0.07433675098840346, 0.08608092518969637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 336.1428571428571, 98, 1420, 198.0, 1245.0, 1420.0, 1420.0, 0.15418332397220294, 19.854824182828384, 0.08875005506547284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe29bfbc-2669-47a5-8e9b-d050aab05f57", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 236.28571428571428, 95, 685, 113.0, 633.0, 685.0, 685.0, 0.15418162595537543, 6.511979705843483, 0.08889964565758463], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6289308176100629], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.2358490566037736], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.2358490566037736], "isController": false}, {"data": ["401/Unauthorized", 13, 48.148148148148145, 1.0220125786163523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 27, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
