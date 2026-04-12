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

    var data = {"OkPercent": 97.91987673343606, "KoPercent": 2.0801232665639446};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8122945430637738, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67146e76-894a-4fd4-9c8d-bd6c4ed46135"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=559d2418-5736-4765-859f-bbbde4ad6f38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74a3cf96-d2ae-42b0-be69-fc145f28eff0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05fe6fff-da85-4297-8f67-942ad594e787"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e10108f9-2eab-4d0f-81c6-7ddb5aac26c0"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f283c3cf-371a-42b1-8d1b-06a9fecca60f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa0f58ec-21b9-4e3a-9946-d018dca015d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fed586f-51aa-4643-81dc-7def59c1b85a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bda37f3a-4abb-4482-ad54-81a24302d927"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f5dab18-1b26-466b-8e63-d430c6847741"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ae63dce-494b-4cac-b4e4-cec690e3037d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01ab2d6a-cc96-420c-82f4-26a9a14d47fb"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4588c028-8596-42a0-ad1b-dca864d8fcd9"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/559d2418-5736-4765-859f-bbbde4ad6f38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0d93689-84a0-450a-9721-f22b872a3853"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67146e76-894a-4fd4-9c8d-bd6c4ed46135"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74a3cf96-d2ae-42b0-be69-fc145f28eff0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f283c3cf-371a-42b1-8d1b-06a9fecca60f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5ae63dce-494b-4cac-b4e4-cec690e3037d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9281437125748503, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa0f58ec-21b9-4e3a-9946-d018dca015d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cf15798-a74c-43b6-9e54-47ee3125ee50"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e10108f9-2eab-4d0f-81c6-7ddb5aac26c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05fe6fff-da85-4297-8f67-942ad594e787"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cf15798-a74c-43b6-9e54-47ee3125ee50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bda37f3a-4abb-4482-ad54-81a24302d927"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4588c028-8596-42a0-ad1b-dca864d8fcd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0d93689-84a0-450a-9721-f22b872a3853"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f5dab18-1b26-466b-8e63-d430c6847741"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01ab2d6a-cc96-420c-82f4-26a9a14d47fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 27, 2.0801232665639446, 305.1779661016942, 77, 2600, 100.5, 859.1000000000001, 1014.0, 1479.7799999999993, 5.037822480797668, 718.2814413319762, 3.6830457855296506], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1367.0545454545454, 993, 2146, 1327.0, 1575.6, 1746.8, 2146.0, 0.2431025185420921, 292.5331682998736, 1.1953331844330408], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67146e76-894a-4fd4-9c8d-bd6c4ed46135", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 416.06249999999994, 84, 880, 419.0, 667.2000000000003, 880.0, 880.0, 0.09088069069324926, 0.017716853398085826, 0.06122687157422396], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 416.06249999999994, 84, 880, 419.0, 667.2000000000003, 880.0, 880.0, 0.09054895302773061, 0.01765218237125071, 0.06100337790039616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 126.42857142857144, 77, 244, 82.0, 242.8, 243.9, 244.0, 0.09593202530778192, 0.032530521230670836, 0.054327576460108266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 89.04761904761907, 78, 236, 82.0, 85.8, 220.99999999999977, 236.0, 0.09593158707390387, 0.07129290797191488, 0.04815315991795565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 130.14285714285714, 77, 643, 82.0, 245.0, 603.3999999999994, 643.0, 0.09593421653723161, 1.3678566839881223, 0.05609992433759708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 138.7142857142857, 77, 688, 80.0, 243.0, 643.5999999999993, 688.0, 0.09593202530778192, 4.1350923131609605, 0.05600495934309404], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 252.06250000000003, 81, 1039, 176.0, 605.0000000000005, 1039.0, 1039.0, 0.09122058848682148, 0.17269219928562876, 0.058961549809291955], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 100.49999999999999, 79, 238, 82.0, 233.8, 238.0, 238.0, 0.08911663139133341, 0.06622827782109837, 0.044732371616352906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 110.5, 77, 246, 81.0, 241.8, 246.0, 246.0, 0.08904124835830199, 0.04054246293658037, 0.04984657775527013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 515.125, 456, 633, 484.0, 633.0, 633.0, 633.0, 0.06794055201698514, 19.97677813163482, 0.038747346072186835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 816.5, 553, 963, 867.0, 963.0, 963.0, 963.0, 0.06777535857400646, 60.984386781263495, 0.03858694731313063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 125.375, 80, 245, 89.0, 245.0, 245.0, 245.0, 0.06816981099919901, 0.12062861086967637, 0.037746369957564294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 134.83333333333331, 78, 246, 81.0, 246.0, 246.0, 246.0, 0.19105846388995032, 0.14198778419946503, 0.09590239300726022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=559d2418-5736-4765-859f-bbbde4ad6f38", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 136.0, 78, 245, 85.0, 245.0, 245.0, 245.0, 0.19203072491598655, 0.05138322131541046, 0.10951752280364858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74a3cf96-d2ae-42b0-be69-fc145f28eff0", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 131.16666666666669, 78, 235, 81.0, 235.0, 235.0, 235.0, 0.1920860545524395, 0.051773194391087206, 0.11292559066461774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05fe6fff-da85-4297-8f67-942ad594e787", 3, 0, 0.0, 246.0, 176, 381, 181.0, 381.0, 381.0, 381.0, 0.11979873811995848, 0.05303589968852328, 0.07682406057822858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 134.16666666666666, 81, 237, 84.5, 237.0, 237.0, 237.0, 0.19203072491598655, 0.051758281325012, 0.11308059289486318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 88.875, 77, 142, 81.5, 142.0, 142.0, 142.0, 0.06814193966031243, 0.05064064070458765, 0.03826329619597622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 673.2857142857142, 83, 1035, 854.5, 983.5, 1035.0, 1035.0, 0.07583020533736318, 48.74309107275367, 0.03992511090167531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 228.37500000000003, 78, 923, 83.5, 833.4000000000001, 923.0, 923.0, 0.08903827532860689, 10.035598354600497, 0.05138830148360026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 455.35714285714283, 80, 728, 548.5, 714.0, 728.0, 728.0, 0.07589803640937233, 15.946232509568574, 0.040034943591495085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 169.5625, 77, 641, 80.5, 634.7, 641.0, 641.0, 0.08911911326482301, 3.296515129361963, 0.051521987356225804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e10108f9-2eab-4d0f-81c6-7ddb5aac26c0", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.16145135165326185, 0.6161332663092046], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 443.87499999999994, 83, 1334, 409.0, 1183.5000000000002, 1334.0, 1334.0, 0.09069523566590143, 0.01768069962871638, 0.061721916361987365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f283c3cf-371a-42b1-8d1b-06a9fecca60f", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa0f58ec-21b9-4e3a-9946-d018dca015d0", 3, 0, 0.0, 247.33333333333331, 165, 380, 197.0, 380.0, 380.0, 380.0, 0.029648077322185655, 0.02471638216865803, 0.019012601668198483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fed586f-51aa-4643-81dc-7def59c1b85a", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.879713326446281, 1.6437456955922864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 298.1666666666667, 162, 492, 242.0, 492.0, 492.0, 492.0, 0.19052457767051947, 0.29527588355772894, 0.4284942406007875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bda37f3a-4abb-4482-ad54-81a24302d927", 3, 0, 0.0, 917.0, 164, 2199, 388.0, 2199.0, 2199.0, 2199.0, 0.017387574839020037, 0.023970175600016227, 0.011150235166949697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f5dab18-1b26-466b-8e63-d430c6847741", 3, 0, 0.0, 302.33333333333337, 156, 570, 181.0, 570.0, 570.0, 570.0, 0.024105485605007512, 0.028491867913991626, 0.01545827039123203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 528.695652173913, 105, 1065, 448.0, 1010.8000000000001, 1056.8, 1065.0, 0.0988868777113277, 0.06074203718791516, 0.0447115472464304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 98.21428571428571, 80, 243, 85.5, 171.0, 243.0, 243.0, 0.07589597913944802, 0.056403164184687445, 0.03809622390398074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 161.35714285714283, 77, 252, 161.0, 250.5, 252.0, 252.0, 0.07589844787674092, 0.10173441506692617, 0.038732773762990835], "isController": false}, {"data": ["login", 23, 0, 0.0, 2512.130434782609, 1441, 4137, 2463.0, 3617.6000000000004, 4067.599999999999, 4137.0, 0.09548164261636306, 39.85986414882267, 0.1991322521940021], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ae63dce-494b-4cac-b4e4-cec690e3037d", 1, 0, 0.0, 1334.0, 1334, 1334, 1334.0, 1334.0, 1334.0, 1334.0, 0.7496251874062968, 0.13543033170914542, 0.516831428035982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 104.9375, 82, 245, 85.0, 242.9, 245.0, 245.0, 0.0858277008904624, 0.06948355863104817, 0.03050906555090656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01ab2d6a-cc96-420c-82f4-26a9a14d47fb", 3, 0, 0.0, 284.6666666666667, 173, 391, 290.0, 391.0, 391.0, 391.0, 0.04418392294323839, 0.028406005147427024, 0.02833409121034493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 773.4999999999999, 168, 1116, 942.5, 1074.0, 1116.0, 1116.0, 0.07579489900329708, 64.8028833530039, 0.1566124789533807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 261.4761904761905, 159, 767, 168.0, 452.0000000000001, 738.5999999999996, 767.0, 0.09589566551591867, 5.604616463002539, 0.2145032276311944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 631.1666666666667, 81, 1106, 836.5, 1066.4, 1106.0, 1106.0, 0.10154002369267219, 80.99383620324927, 0.1750672967084109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4588c028-8596-42a0-ad1b-dca864d8fcd9", 3, 0, 0.0, 241.0, 165, 386, 172.0, 386.0, 386.0, 386.0, 0.055556584381192244, 0.03636858437193281, 0.03562710652049112], "isController": false}, {"data": ["register", 25, 9, 36.0, 865.3199999999998, 170, 2436, 842.0, 1475.800000000001, 2239.1999999999994, 2436.0, 0.10068060086182594, 0.031368299706012646, 0.04542425546695663], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 350.375, 162, 1005, 314.0, 916.1000000000001, 1005.0, 1005.0, 0.08899716877756826, 13.429631485668674, 0.19731037345436947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 87.52631578947368, 81, 106, 85.0, 95.0, 106.0, 106.0, 0.11620866182667783, 0.09022059194551649, 0.04130854775870189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/559d2418-5736-4765-859f-bbbde4ad6f38", 3, 0, 0.0, 371.66666666666663, 177, 653, 285.0, 653.0, 653.0, 653.0, 0.06850879196163508, 0.030998444279515872, 0.04393304692852249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0d93689-84a0-450a-9721-f22b872a3853", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 315.3125, 164, 950, 320.0, 619.6000000000004, 950.0, 950.0, 0.08410207889826277, 6.410653244829036, 0.18780265250072276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 82.99999999999999, 80, 88, 83.0, 88.0, 88.0, 88.0, 0.08949488036640257, 0.06650937886604721, 0.04492223487141691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 91.6470588235294, 79, 232, 82.0, 119.9999999999999, 232.0, 232.0, 0.08949723611476705, 0.02394750263227165, 0.051041392471703084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 90.58823529411767, 78, 241, 81.0, 119.39999999999989, 241.0, 241.0, 0.08949864962331597, 0.024122682906284384, 0.052615417063707245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 91.05882352941177, 77, 241, 81.0, 119.39999999999989, 241.0, 241.0, 0.08949723611476705, 0.024122301921558308, 0.0527019857199263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.0, 83, 87, 85.0, 87.0, 87.0, 87.0, 1.0416666666666667, 0.30721028645833337, 0.6439208984375], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 942.2545454545456, 623, 1783, 888.0, 1221.2, 1392.2, 1783.0, 0.24526635926616305, 293.4238340650446, 0.4843052523790837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 865.3199999999998, 170, 2436, 842.0, 1475.800000000001, 2239.1999999999994, 2436.0, 0.09956866852793698, 0.031021863288235363, 0.044922582871002814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 81.0, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.06898216810954369, 0.018592849998275447, 0.04062133532231918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 81.0, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.0689893066574681, 0.018594774060020698, 0.04055816660917558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 114.78947368421052, 79, 245, 82.0, 236.0, 245.0, 245.0, 0.11940973880690817, 0.03218465616279947, 0.07019986597827998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 121.89473684210526, 78, 246, 80.0, 241.0, 246.0, 246.0, 0.11952617308648034, 0.0322160388397154, 0.07038504137807386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 80.5, 79, 82, 80.5, 82.0, 82.0, 82.0, 0.06898216810954369, 0.018458119201186493, 0.039341392749974134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 99.1578947368421, 80, 250, 83.0, 235.0, 250.0, 250.0, 0.11940973880690817, 0.08874102659380577, 0.05993809154956132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 0.06898454746136866, 0.05126683654111479, 0.03462700917494481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 88.89473684210526, 78, 234, 80.0, 88.0, 234.0, 234.0, 0.1195246692626586, 0.031982186892547323, 0.06816641293885999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 88.0, 83, 93, 88.0, 93.0, 93.0, 93.0, 0.10163634515702814, 0.07999892011383271, 0.03612854456753735], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 467.5625, 82, 1055, 400.0, 882.8000000000002, 1055.0, 1055.0, 0.09220998518877112, 0.017660823579245838, 0.06275276701994617], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1377.478260869565, 925, 2600, 1275.0, 1778.4000000000003, 2452.399999999998, 2600.0, 0.09894898964477312, 0.05121383253098609, 0.04551267004168764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 164.5, 164, 165, 164.5, 165.0, 165.0, 165.0, 0.06878761822871883, 0.1066073731728289, 0.1547049656061909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67146e76-894a-4fd4-9c8d-bd6c4ed46135", 3, 0, 0.0, 295.6666666666667, 161, 524, 202.0, 524.0, 524.0, 524.0, 0.019425648331013047, 0.022960458688121216, 0.012457202868520737], "isController": false}, {"data": ["addBook", 56, 10, 17.857142857142858, 904.732142857143, 417, 3604, 735.0, 1494.2, 1664.05, 3604.0, 0.2837468775176202, 85.95785670085985, 1.0319174860279996], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 146.45454545454544, 79, 346, 84.0, 328.6, 335.4, 346.0, 0.2461940635896885, 0.18296258046069622, 0.11900982566103105], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 512.1272727272727, 385, 738, 477.0, 697.8, 727.0, 738.0, 0.24607290021520192, 72.35360305253433, 0.1237573668074502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74a3cf96-d2ae-42b0-be69-fc145f28eff0", 3, 0, 0.0, 310.3333333333333, 176, 419, 336.0, 419.0, 419.0, 419.0, 0.024420223200840058, 0.029006964342404087, 0.015660104070851208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f283c3cf-371a-42b1-8d1b-06a9fecca60f", 3, 0, 0.0, 798.3333333333334, 399, 1039, 957.0, 1039.0, 1039.0, 1039.0, 0.03517658646404953, 0.029325272765114204, 0.022557902127010927], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 121.40000000000003, 78, 335, 83.0, 242.8, 285.19999999999976, 335.0, 0.24633630728438857, 0.4358997937493282, 0.11980027444104054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ae63dce-494b-4cac-b4e4-cec690e3037d", 3, 0, 0.0, 607.0, 419, 842, 560.0, 842.0, 842.0, 842.0, 0.027188689505165852, 0.027268343868950516, 0.017435455183976798], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 794.2363636363636, 538, 1456, 778.0, 980.0, 1063.8, 1456.0, 0.2456750032384432, 221.05879976454284, 0.1233173356099217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 88.68750000000001, 82, 111, 86.5, 99.10000000000001, 111.0, 111.0, 0.08638749109128999, 0.06453752996566098, 0.030708053473856987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 10, 5.9880239520958085, 157.07185628742522, 79, 2458, 88.0, 294.20000000000005, 325.6, 1706.5999999999924, 0.7397039412489038, 1.6045114881115847, 0.3542280779656813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 127.47058823529412, 84, 269, 88.0, 253.79999999999998, 269.0, 269.0, 0.09250442116718814, 0.07163672459529316, 0.03288243096177391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa0f58ec-21b9-4e3a-9946-d018dca015d0", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cf15798-a74c-43b6-9e54-47ee3125ee50", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e10108f9-2eab-4d0f-81c6-7ddb5aac26c0", 3, 0, 0.0, 427.66666666666663, 161, 809, 313.0, 809.0, 809.0, 809.0, 0.03159457837035165, 0.026030559197708338, 0.02026084615546639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05fe6fff-da85-4297-8f67-942ad594e787", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.0883377259036144, 4.153332078313253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 93.80952380952381, 80, 244, 85.0, 98.4, 229.4999999999998, 244.0, 0.09680943753716792, 0.07856312753260404, 0.034412729749540155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cf15798-a74c-43b6-9e54-47ee3125ee50", 3, 0, 0.0, 288.6666666666667, 226, 401, 239.0, 401.0, 401.0, 401.0, 0.111428889796828, 0.05041867083905954, 0.07145667737622108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 194.76470588235293, 160, 323, 170.0, 321.4, 323.0, 323.0, 0.08945532232857466, 0.13863827786664842, 0.2011871165260815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 231.3157894736842, 161, 485, 167.0, 481.0, 485.0, 485.0, 0.119232893217531, 0.1847876968127165, 0.268157571367162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bda37f3a-4abb-4482-ad54-81a24302d927", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4588c028-8596-42a0-ad1b-dca864d8fcd9", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 89.0, 82, 105, 85.0, 105.0, 105.0, 105.0, 0.20197259905072878, 0.16745579745514524, 0.07179494731881375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0d93689-84a0-450a-9721-f22b872a3853", 3, 0, 0.0, 500.3333333333333, 176, 1055, 270.0, 1055.0, 1055.0, 1055.0, 0.01726300767628408, 0.02040429064862874, 0.011070353229908736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 99.64285714285714, 80, 234, 87.5, 168.5, 234.0, 234.0, 0.07745033497269876, 0.06012989873368702, 0.027531173759826513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f5dab18-1b26-466b-8e63-d430c6847741", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01ab2d6a-cc96-420c-82f4-26a9a14d47fb", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 102.75, 80, 242, 83.0, 240.6, 242.0, 242.0, 0.08420698075870489, 0.06257960191149846, 0.04226795713864679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 131.75, 78, 248, 82.0, 246.6, 248.0, 248.0, 0.0842096398985274, 0.030437590788518015, 0.04758379188113809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 159.93749999999997, 78, 709, 82.0, 397.50000000000034, 709.0, 709.0, 0.0842096398985274, 4.757027434250692, 0.04905375996042147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 186.43750000000003, 80, 630, 160.5, 375.90000000000026, 630.0, 630.0, 0.08413967185527976, 1.5675019555900296, 0.04909516985696256], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 33.333333333333336, 0.6933744221879815], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15408320493066255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15408320493066255], "isController": false}, {"data": ["401/Unauthorized", 14, 51.851851851851855, 1.078582434514638], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 27, "401/Unauthorized", 14, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
