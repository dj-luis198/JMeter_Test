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

    var data = {"OkPercent": 97.97449362340585, "KoPercent": 2.0255063765941483};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7554627249357326, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad6a58cf-f248-4dd1-8198-2b5746fd6863"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35a112d9-3433-4cd0-a17f-2ae68eb3275f"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/693317f7-85e1-4ca6-87ae-530f878e0619"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45bbf486-e9ef-4e2f-b3ac-91cdd3cd839c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/481ca63c-987b-4d32-8c53-d8e70c52a4b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3eaef5c3-8315-4689-97d5-cdca77b5d471"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/183f0f46-4736-4400-9bec-959069c7dda3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f379a637-4ac1-49e6-8d88-996047d2fb2d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76b0b678-094a-4723-bc95-0cd6d6e4f88d"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b98bef78-156d-4e1b-854c-3f8880515dcb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7fc06d5-1a15-48d3-b9a7-1e1660cbb418"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d88ca5db-1470-4dc6-83c2-fb026478ba6a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccefe724-a10d-4dbb-ab03-613edb567300"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/45bbf486-e9ef-4e2f-b3ac-91cdd3cd839c"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/77b25846-f2d7-428d-b218-28ef8ff21fd9"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=693317f7-85e1-4ca6-87ae-530f878e0619"], "isController": false}, {"data": [0.275, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43513fe5-ce28-4723-ae9e-60a9a2aaf0d0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7bbceb7-cca1-420f-a40f-0722550763cc"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=481ca63c-987b-4d32-8c53-d8e70c52a4b2"], "isController": false}, {"data": [0.9204545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7bbceb7-cca1-420f-a40f-0722550763cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=183f0f46-4736-4400-9bec-959069c7dda3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f379a637-4ac1-49e6-8d88-996047d2fb2d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3eaef5c3-8315-4689-97d5-cdca77b5d471"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ccefe724-a10d-4dbb-ab03-613edb567300"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77b25846-f2d7-428d-b218-28ef8ff21fd9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7fc06d5-1a15-48d3-b9a7-1e1660cbb418"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35a112d9-3433-4cd0-a17f-2ae68eb3275f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad6a58cf-f248-4dd1-8198-2b5746fd6863"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d88ca5db-1470-4dc6-83c2-fb026478ba6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 27, 2.0255063765941483, 404.3278319579897, 127, 1956, 145.0, 1068.400000000002, 1239.1999999999998, 1638.2400000000011, 5.172982517414673, 727.6127352981838, 3.781241207773056], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/ad6a58cf-f248-4dd1-8198-2b5746fd6863", 3, 0, 0.0, 397.33333333333337, 239, 696, 257.0, 696.0, 696.0, 696.0, 0.041385589537722964, 0.02660694639876395, 0.026539587040792394], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2023.8928571428564, 1621, 2536, 1998.5, 2353.3, 2409.2999999999997, 2536.0, 0.24560649453744843, 295.5468301137684, 1.2076452148398953], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35a112d9-3433-4cd0-a17f-2ae68eb3275f", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 542.2, 142, 1212, 515.0, 951.6000000000001, 1212.0, 1212.0, 0.08610149644400819, 0.016867148619793014, 0.057972765379162294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 542.2, 142, 1212, 515.0, 951.6000000000001, 1212.0, 1212.0, 0.08633491038436301, 0.01691287404599924, 0.05812992468717985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 273.73333333333335, 135, 558, 143.0, 474.00000000000006, 558.0, 558.0, 0.09973735828983676, 0.05664770271618072, 0.05520618620964792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 158.59999999999997, 132, 425, 139.0, 263.0000000000001, 425.0, 425.0, 0.09974465368656239, 0.07412664204636132, 0.05006714062001277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 398.53333333333336, 137, 968, 411.0, 938.6, 968.0, 968.0, 0.09974001103789457, 5.886881424919045, 0.05701933834139011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 352.00000000000006, 130, 1366, 137.0, 1202.2, 1366.0, 1366.0, 0.09974465368656239, 17.971590384864747, 0.056924585560963935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/693317f7-85e1-4ca6-87ae-530f878e0619", 3, 0, 0.0, 330.0, 234, 517, 239.0, 517.0, 517.0, 517.0, 0.02997721731484072, 0.030260205368919622, 0.01922367125984252], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 234.0625, 137, 293, 240.0, 279.0, 293.0, 293.0, 0.08751394753538845, 0.16895469204662306, 0.05656571682127464], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 157.00000000000003, 130, 407, 139.0, 274.0, 407.0, 407.0, 0.11290140481605135, 0.0839042666650538, 0.05667121296430703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 157.07142857142856, 132, 414, 138.0, 276.5, 414.0, 414.0, 0.11290413632368003, 0.04232329998629021, 0.06371334143823741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 894.4285714285714, 673, 1092, 957.0, 1092.0, 1092.0, 1092.0, 0.03782046086933031, 11.120471253072912, 0.02156948158953994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1153.7142857142856, 943, 1247, 1230.0, 1247.0, 1247.0, 1247.0, 0.03785072754505588, 34.05815117952329, 0.021549779451921464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 287.4285714285714, 136, 419, 378.0, 419.0, 419.0, 419.0, 0.03796424852481777, 0.06717892414743146, 0.021021219642159843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45bbf486-e9ef-4e2f-b3ac-91cdd3cd839c", 1, 0, 0.0, 1656.0, 1656, 1656, 1656.0, 1656.0, 1656.0, 1656.0, 0.6038647342995169, 0.10909665609903382, 0.41633642814009664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/481ca63c-987b-4d32-8c53-d8e70c52a4b2", 3, 0, 0.0, 760.6666666666666, 249, 1562, 471.0, 1562.0, 1562.0, 1562.0, 0.0336398295581969, 0.028044141763848396, 0.02157241674142184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 136.85714285714286, 132, 141, 138.0, 140.5, 141.0, 141.0, 0.07069850119177473, 0.0525405853583404, 0.03548733360602755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 262.14285714285717, 130, 550, 139.0, 480.5, 550.0, 550.0, 0.07060152499293985, 0.01889142367975148, 0.04026493222253601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 215.07142857142856, 127, 416, 139.0, 414.5, 416.0, 416.0, 0.07060010085728693, 0.01902893343419062, 0.04150513741805345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 174.78571428571428, 130, 415, 136.5, 410.5, 415.0, 415.0, 0.07070207157069702, 0.01905641772803943, 0.04163413003626006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 138.57142857142856, 137, 142, 138.0, 142.0, 142.0, 142.0, 0.038015173484959565, 0.028251510763724834, 0.021346410892433353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 666.3500000000001, 136, 1478, 412.5, 1358.0000000000002, 1472.6, 1478.0, 0.09358914365933552, 37.90912804895882, 0.05140091249415068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 215.64285714285714, 129, 1236, 138.0, 689.0, 1236.0, 1236.0, 0.11291051035550681, 7.285193109736919, 0.06568594143170527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 520.3000000000002, 127, 1098, 412.5, 1091.5, 1097.9, 1098.0, 0.0935900195603141, 12.397231943560538, 0.05149279005886812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 215.85714285714286, 132, 958, 138.0, 685.0, 958.0, 958.0, 0.11289867344058707, 2.3993960676988833, 0.06578930789081086], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 557.5333333333334, 141, 1656, 502.0, 1149.0000000000002, 1656.0, 1656.0, 0.08651167619256346, 0.01694750219162913, 0.05882343399447479], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 422.3571428571429, 269, 689, 412.0, 619.5, 689.0, 689.0, 0.07054993675702098, 0.10933862268885966, 0.15866846128068293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 449.26086956521743, 209, 1008, 403.0, 788.4000000000001, 970.7999999999995, 1008.0, 0.09773758732640954, 0.06003607659014805, 0.04419189739465588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 151.04999999999998, 130, 408, 139.0, 142.9, 394.7499999999998, 408.0, 0.09358739190656234, 0.06955078636806049, 0.04697648382809868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 205.55, 131, 416, 139.0, 414.9, 415.95, 416.0, 0.09359220938449084, 0.08830022801402011, 0.04983967947008091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3eaef5c3-8315-4689-97d5-cdca77b5d471", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["login", 23, 0, 0.0, 2100.2173913043475, 1237, 3166, 2092.0, 2832.4000000000005, 3117.999999999999, 3166.0, 0.09327223326168944, 34.08725088329819, 0.1877998714972221], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/183f0f46-4736-4400-9bec-959069c7dda3", 3, 0, 0.0, 316.6666666666667, 236, 469, 245.0, 469.0, 469.0, 469.0, 0.023186075988499706, 0.023254003945497263, 0.014868675031687636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f379a637-4ac1-49e6-8d88-996047d2fb2d", 3, 0, 0.0, 359.3333333333333, 244, 573, 261.0, 573.0, 573.0, 573.0, 0.05583784689262382, 0.03589835534275132, 0.03580747343049119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 193.71428571428572, 135, 526, 141.5, 510.5, 526.0, 526.0, 0.11480491365030424, 0.09294264982041231, 0.040809559149131584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76b0b678-094a-4723-bc95-0cd6d6e4f88d", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 832.9999999999999, 272, 1619, 686.0, 1496.1000000000004, 1613.4499999999998, 1619.0, 0.09352655920465014, 50.430347300648144, 0.1995750825371885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b98bef78-156d-4e1b-854c-3f8880515dcb", 2, 0, 0.0, 258.5, 242, 275, 258.5, 275.0, 275.0, 275.0, 0.015303155510666301, 0.02588385287546292, 0.009512166486854589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7fc06d5-1a15-48d3-b9a7-1e1660cbb418", 3, 0, 0.0, 567.6666666666666, 235, 1013, 455.0, 1013.0, 1013.0, 1013.0, 0.05208785484851115, 0.03348747178574529, 0.03340269337616113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 889.6363636363636, 137, 1385, 1229.0, 1384.2, 1385.0, 1385.0, 0.05938594928439931, 45.217022746168254, 0.09952313251434709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 663.5333333333333, 275, 1522, 558.0, 1348.0, 1522.0, 1522.0, 0.09964923469387756, 23.96657515545281, 0.219014226173868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d88ca5db-1470-4dc6-83c2-fb026478ba6a", 3, 0, 0.0, 347.3333333333333, 241, 457, 344.0, 457.0, 457.0, 457.0, 0.020156549198777168, 0.02778743029193402, 0.012925912083851243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccefe724-a10d-4dbb-ab03-613edb567300", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 818.3913043478261, 215, 1609, 852.0, 1517.4, 1600.1999999999998, 1609.0, 0.09325105616957097, 0.029235979906424594, 0.042072253857755655], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 139.07692307692307, 133, 147, 139.0, 145.0, 147.0, 147.0, 0.06833437587060623, 0.05305256720423042, 0.024290735172754558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 414.57142857142856, 272, 1643, 279.0, 1098.0, 1643.0, 1643.0, 0.1127722644670705, 9.79906493416919, 0.2515664772361129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 395.875, 270, 1374, 279.0, 800.0000000000006, 1374.0, 1374.0, 0.0873519793412569, 6.658375834962084, 0.19505978492304837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 202.61538461538464, 136, 419, 138.0, 419.0, 419.0, 419.0, 0.07525935531678399, 0.05593004823835217, 0.037776668586745096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 242.23076923076923, 132, 418, 139.0, 417.6, 418.0, 418.0, 0.07526414821247647, 0.02013903965841656, 0.04292408452742799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 171.07692307692307, 135, 561, 138.0, 397.39999999999986, 561.0, 561.0, 0.07538198370589429, 0.02031780029572932, 0.04431636151459801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 222.07692307692307, 132, 418, 138.0, 417.2, 418.0, 418.0, 0.07538154659739296, 0.02031768248132857, 0.04438971933420699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 141.5, 141, 142, 141.5, 142.0, 142.0, 142.0, 0.02173653150166828, 0.006410578626468575, 0.01343674261773049], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1297.1607142857142, 1046, 1956, 1105.0, 1791.3, 1833.3, 1956.0, 0.24554403349922171, 293.7560289829654, 0.48485355052287726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45bbf486-e9ef-4e2f-b3ac-91cdd3cd839c", 3, 0, 0.0, 709.3333333333333, 245, 1618, 265.0, 1618.0, 1618.0, 1618.0, 0.030296297792409766, 0.024803121402314637, 0.019428289925471107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 818.3913043478261, 215, 1609, 852.0, 1517.4, 1600.1999999999998, 1609.0, 0.09351988517384534, 0.029320262912859794, 0.0421935419436685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 188.72727272727272, 131, 435, 138.0, 431.0, 435.0, 435.0, 0.05057261998354091, 0.013630901479938761, 0.029780556494214034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 163.0909090909091, 135, 409, 139.0, 356.0000000000002, 409.0, 409.0, 0.05057261998354091, 0.013630901479938761, 0.029731169170011357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 240.61538461538464, 128, 938, 138.0, 728.7999999999998, 938.0, 938.0, 0.0672675904749092, 4.672697289698227, 0.03910130822527398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77b25846-f2d7-428d-b218-28ef8ff21fd9", 3, 0, 0.0, 378.0, 241, 575, 318.0, 575.0, 575.0, 575.0, 0.07389526577663924, 0.03343568340804966, 0.047387263535149514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 237.23076923076923, 130, 916, 138.0, 710.3999999999999, 916.0, 916.0, 0.06726724240526961, 1.5381823259201384, 0.039166796565748556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 164.0909090909091, 133, 417, 139.0, 362.0000000000002, 417.0, 417.0, 0.05057192246864541, 0.01353194019180551, 0.028841799532899334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 160.53846153846155, 131, 407, 139.0, 307.7999999999999, 407.0, 407.0, 0.06726445797782343, 0.049988527852659795, 0.03376360488339965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 164.45454545454547, 132, 416, 140.0, 361.4000000000002, 416.0, 416.0, 0.05057099247871421, 0.0375825442151382, 0.025384267709042094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 177.92307692307693, 132, 414, 137.0, 405.59999999999997, 414.0, 414.0, 0.067268634705441, 0.025771487154278027, 0.03792956521176684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 165.0909090909091, 138, 395, 142.0, 345.00000000000017, 395.0, 395.0, 0.050093812048017196, 0.03942930909248229, 0.017806784751443615], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 564.1999999999999, 139, 1618, 552.0, 1064.8000000000004, 1618.0, 1618.0, 0.0858079389505117, 0.016496799721410226, 0.05839520741208977], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 981.0869565217392, 794, 1384, 883.0, 1362.6000000000001, 1381.8, 1384.0, 0.09465994443872826, 0.048993916555201154, 0.04353987678773537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 382.54545454545456, 274, 832, 283.0, 780.6000000000001, 832.0, 832.0, 0.05053846436578822, 0.0783247489731503, 0.11366219085391627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=693317f7-85e1-4ca6-87ae-530f878e0619", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 1231.8, 684, 3235, 1066.5, 2024.8, 2334.999999999999, 3235.0, 0.2877946297522088, 87.22123548885516, 1.0459957649221516], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 239.76785714285708, 132, 564, 141.0, 556.2, 562.15, 564.0, 0.24657654880894722, 0.18324682973008674, 0.11919471841838755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43513fe5-ce28-4723-ae9e-60a9a2aaf0d0", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 791.2321428571429, 644, 1393, 688.5, 979.6000000000001, 1104.9, 1393.0, 0.2464973171408072, 72.4783957206305, 0.12397081867921456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7bbceb7-cca1-420f-a40f-0722550763cc", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 194.03571428571428, 129, 547, 139.0, 412.90000000000003, 419.45, 547.0, 0.24707590083432238, 0.4372085276482345, 0.12015995958544193], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1051.5357142857144, 909, 1417, 962.0, 1257.2, 1333.05, 1417.0, 0.24618955716653407, 221.52179629352827, 0.1235756175621079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 157.74999999999997, 134, 411, 141.5, 224.80000000000018, 411.0, 411.0, 0.0828474674564792, 0.061892883402545486, 0.029449685697420337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=481ca63c-987b-4d32-8c53-d8e70c52a4b2", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 12, 6.818181818181818, 198.76136363636363, 132, 1580, 141.0, 328.1000000000001, 375.6, 1543.8099999999995, 0.7144712912444791, 1.5514450093063945, 0.3432771638635847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 163.76923076923077, 137, 420, 141.0, 311.5999999999999, 420.0, 420.0, 0.08048538880633978, 0.06232901691740961, 0.02861004055225359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 140.73333333333335, 136, 151, 140.0, 146.2, 151.0, 151.0, 0.09643635522009991, 0.07826036248818655, 0.03428011064464489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7bbceb7-cca1-420f-a40f-0722550763cc", 3, 0, 0.0, 350.6666666666667, 232, 587, 233.0, 587.0, 587.0, 587.0, 0.043706293706293704, 0.02770057091346154, 0.028027799023892772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=183f0f46-4736-4400-9bec-959069c7dda3", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 480.4615384615385, 273, 837, 281.0, 837.0, 837.0, 837.0, 0.07508157902336193, 0.11636178311530797, 0.1688602309480493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 443.38461538461536, 269, 1074, 293.0, 973.5999999999999, 1074.0, 1074.0, 0.06721646286290427, 6.281871267547374, 0.14984848019699595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f379a637-4ac1-49e6-8d88-996047d2fb2d", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3eaef5c3-8315-4689-97d5-cdca77b5d471", 3, 0, 0.0, 337.0, 221, 552, 238.0, 552.0, 552.0, 552.0, 0.023907049391964044, 0.02397708957572956, 0.015331018002008192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccefe724-a10d-4dbb-ab03-613edb567300", 3, 0, 0.0, 375.6666666666667, 250, 584, 293.0, 584.0, 584.0, 584.0, 0.017871716816689802, 0.024637604400612405, 0.011460703817994435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 163.6428571428571, 135, 409, 141.5, 293.5, 409.0, 409.0, 0.07341758875662069, 0.06087063755309665, 0.026097658503330012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 167.49999999999997, 134, 418, 141.5, 372.00000000000057, 416.95, 418.0, 0.09053460685346973, 0.07028809809424652, 0.03218222352994432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77b25846-f2d7-428d-b218-28ef8ff21fd9", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7fc06d5-1a15-48d3-b9a7-1e1660cbb418", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35a112d9-3433-4cd0-a17f-2ae68eb3275f", 3, 0, 0.0, 385.0, 273, 601, 281.0, 601.0, 601.0, 601.0, 0.033254630707326, 0.02739826507820381, 0.0213253979470808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad6a58cf-f248-4dd1-8198-2b5746fd6863", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d88ca5db-1470-4dc6-83c2-fb026478ba6a", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.2584607474964235, 0.9863420958512161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 138.0625, 132, 141, 138.5, 141.0, 141.0, 141.0, 0.08741831850864348, 0.06496615271980244, 0.04387989815765894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 168.93750000000003, 131, 401, 138.0, 396.1, 401.0, 401.0, 0.0874216619950716, 0.03159857680266199, 0.04939878825380695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 255.18749999999994, 127, 1235, 138.5, 658.9000000000005, 1235.0, 1235.0, 0.08741879613390374, 4.938313618004448, 0.05092315614636092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 188.0625, 133, 684, 137.5, 489.4000000000002, 684.0, 684.0, 0.08741879613390374, 1.6285912563446925, 0.051008526064460435], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5251312828207052], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15003750937734434], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15003750937734434], "isController": false}, {"data": ["401/Unauthorized", 16, 59.25925925925926, 1.2003000750187547], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 27, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
