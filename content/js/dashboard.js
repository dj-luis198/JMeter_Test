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

    var data = {"OkPercent": 99.01515151515152, "KoPercent": 0.9848484848484849};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7744140625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7aec266-a907-4ef8-991d-6cc00d452d89"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d982e964-dbdd-4dab-8214-051b664d561d"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a696054-dd6b-4822-a25c-029fe8e66049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=618c27dc-157e-4e5f-ad32-737b3a7a83b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e7e03b5-6bd9-4db9-ab78-8deb72d83af1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80ed812b-67c8-451f-8505-19c7887a069c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec10bd15-c12e-46e6-8b69-9ca0efcab415"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9336d02b-c7ed-4a34-9f85-44d47d27e884"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4eb8a1c9-6ab5-4d4e-86bf-a0f0a1cbe0b5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ec10bd15-c12e-46e6-8b69-9ca0efcab415"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a696054-dd6b-4822-a25c-029fe8e66049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60dbf2a0-c8fd-40c8-942d-b047434c3fd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f79dfc9-5b4e-40bd-9474-37f4ef7526d9"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a5b53ad-d4df-4416-8c85-bf13f5d9bc62"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7aec266-a907-4ef8-991d-6cc00d452d89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1953a7a2-6e05-4b23-993e-1592899da5c8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d982e964-dbdd-4dab-8214-051b664d561d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f79dfc9-5b4e-40bd-9474-37f4ef7526d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f5e1e116-ce82-4060-9f06-3266b4176e87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e7e03b5-6bd9-4db9-ab78-8deb72d83af1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/618c27dc-157e-4e5f-ad32-737b3a7a83b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92f8ed45-d128-4ffa-b92f-367672b221f3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80ed812b-67c8-451f-8505-19c7887a069c"], "isController": false}, {"data": [0.30158730158730157, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9530386740331491, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dfd0801-2d0d-4a27-b870-574aa5c279ae"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60dbf2a0-c8fd-40c8-942d-b047434c3fd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a5b53ad-d4df-4416-8c85-bf13f5d9bc62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4eb8a1c9-6ab5-4d4e-86bf-a0f0a1cbe0b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1953a7a2-6e05-4b23-993e-1592899da5c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b96f3ee9-bb47-4064-bb4a-cceb4cc58ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9336d02b-c7ed-4a34-9f85-44d47d27e884"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 13, 0.9848484848484849, 425.04469696969653, 135, 2918, 158.5, 1124.3000000000006, 1278.0, 1746.329999999999, 5.432411743886479, 751.9183123590454, 3.9634846825022843], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2098.1090909090904, 1665, 2873, 2200.0, 2423.8, 2534.3999999999996, 2873.0, 0.2420135527589545, 291.22438747194843, 1.1899787481848985], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b7aec266-a907-4ef8-991d-6cc00d452d89", 3, 0, 0.0, 341.0, 226, 491, 306.0, 491.0, 491.0, 491.0, 0.032751449251629386, 0.027303535655411083, 0.021002719734931605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d982e964-dbdd-4dab-8214-051b664d561d", 1, 0, 0.0, 1071.0, 1071, 1071, 1071.0, 1071.0, 1071.0, 1071.0, 0.9337068160597572, 0.168687266573296, 0.6437470821661998], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 596.4285714285714, 428, 1308, 460.0, 1249.0, 1308.0, 1308.0, 0.08935295694463946, 0.016142868198006154, 0.06073208792330964], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 596.4285714285714, 428, 1308, 460.0, 1249.0, 1308.0, 1308.0, 0.08753501400560224, 0.0158144312412465, 0.05949645483193277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 238.8666666666667, 138, 444, 146.0, 441.6, 444.0, 444.0, 0.08335092964070193, 0.030648831419966438, 0.04706939867860993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 164.9333333333333, 140, 429, 147.0, 261.0000000000001, 429.0, 429.0, 0.08334583520861463, 0.061939629486089574, 0.041835702438699135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 236.26666666666665, 138, 730, 145.0, 541.0000000000001, 730.0, 730.0, 0.08335000333400013, 1.6548122992654086, 0.048604555980640576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 294.3333333333333, 139, 1236, 147.0, 761.4000000000003, 1236.0, 1236.0, 0.08334907704788681, 5.020810571510729, 0.04852262024493515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a696054-dd6b-4822-a25c-029fe8e66049", 3, 0, 0.0, 362.6666666666667, 241, 495, 352.0, 495.0, 495.0, 495.0, 0.03221130616846513, 0.02685324059161432, 0.020656338916626403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=618c27dc-157e-4e5f-ad32-737b3a7a83b2", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e7e03b5-6bd9-4db9-ab78-8deb72d83af1", 3, 0, 0.0, 394.3333333333333, 264, 516, 403.0, 516.0, 516.0, 516.0, 0.06072014087072682, 0.03939298201671828, 0.03893837158702208], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 306.85714285714283, 221, 819, 246.0, 653.5, 819.0, 819.0, 0.09014287645918781, 0.2059151031170119, 0.05827596114842025], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80ed812b-67c8-451f-8505-19c7887a069c", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 147.15789473684214, 138, 183, 145.0, 152.0, 183.0, 183.0, 0.1262500415296189, 0.09382449375394532, 0.063371602877172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 189.00000000000003, 139, 442, 144.0, 429.0, 442.0, 442.0, 0.1262517193490727, 0.033782198341451096, 0.07200293369126803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 877.75, 710, 1073, 864.0, 1073.0, 1073.0, 1073.0, 0.07535795026375282, 22.157739496985684, 0.04297758100979653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1104.5, 993, 1390, 1017.5, 1390.0, 1390.0, 1390.0, 0.07545888434039504, 67.89803677205758, 0.04296145465864287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 281.5, 143, 428, 277.5, 428.0, 428.0, 428.0, 0.07670182166826461, 0.13572627037392138, 0.04247063758389262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec10bd15-c12e-46e6-8b69-9ca0efcab415", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 180.12499999999997, 138, 429, 146.0, 419.2, 429.0, 429.0, 0.07623694442326752, 0.056656557330182204, 0.03826737249371045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 217.31250000000003, 139, 429, 147.0, 428.3, 429.0, 429.0, 0.0762387607389442, 0.03471320526809837, 0.04267956014999976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 341.37500000000006, 136, 1244, 146.5, 1240.5, 1244.0, 1244.0, 0.07623839746888521, 8.592910558660682, 0.044000871976671053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 287.375, 137, 1032, 144.5, 789.1000000000003, 1032.0, 1032.0, 0.07623985056989288, 2.820111328050547, 0.044076163610719324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 146.5, 144, 149, 146.5, 149.0, 149.0, 149.0, 0.07669152750349906, 0.05699438713883084, 0.043064090150890584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 797.2500000000002, 139, 1461, 990.0, 1438.6, 1461.0, 1461.0, 0.10004689698296076, 56.27409576754729, 0.05344302016570267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 173.3684210526316, 138, 429, 144.0, 428.0, 429.0, 429.0, 0.1262500415296189, 0.0340283315060301, 0.07422121582112362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 673.125, 139, 1144, 982.5, 1067.0, 1144.0, 1144.0, 0.10004627140052275, 18.39569062410115, 0.053540387429186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 142.15789473684208, 138, 149, 142.0, 148.0, 149.0, 149.0, 0.1262500415296189, 0.0340283315060301, 0.07434450687730489], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 521.7692307692307, 413, 1071, 459.0, 900.5999999999999, 1071.0, 1071.0, 0.09333180173453565, 0.016861702461805753, 0.064347902367756], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 562.375, 289, 1388, 301.0, 1381.7, 1388.0, 1388.0, 0.07618322064565279, 11.496012656532711, 0.16890132487382153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9336d02b-c7ed-4a34-9f85-44d47d27e884", 3, 0, 0.0, 327.6666666666667, 259, 422, 302.0, 422.0, 422.0, 422.0, 0.02422011238132145, 0.024291069741813602, 0.015531777796615642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 563.5238095238095, 200, 1576, 516.0, 906.4, 1509.699999999999, 1576.0, 0.10262575319972438, 0.06303867066662756, 0.046402073956516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 143.68749999999997, 137, 150, 144.0, 148.6, 150.0, 150.0, 0.10004752257322229, 0.07435172331857633, 0.050219166604136965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 243.1875, 138, 608, 146.5, 483.40000000000015, 608.0, 608.0, 0.10004314360567995, 0.1206819268934728, 0.05180456728214042], "isController": false}, {"data": ["login", 21, 0, 0.0, 2326.857142857142, 1461, 3537, 2230.0, 3461.8, 3530.9, 3537.0, 0.10204032050378764, 23.394385307287138, 0.18618657252637258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4eb8a1c9-6ab5-4d4e-86bf-a0f0a1cbe0b5", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec10bd15-c12e-46e6-8b69-9ca0efcab415", 3, 0, 0.0, 547.0, 488, 607, 546.0, 607.0, 607.0, 607.0, 0.022316779242419735, 0.02637767754857619, 0.014311215855327759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 165.52631578947367, 145, 432, 151.0, 162.0, 432.0, 432.0, 0.11827541987774057, 0.09575226863149114, 0.042043215659665595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a696054-dd6b-4822-a25c-029fe8e66049", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60dbf2a0-c8fd-40c8-942d-b047434c3fd0", 3, 0, 0.0, 303.0, 223, 441, 245.0, 441.0, 441.0, 441.0, 0.061783059085198835, 0.03972055393661058, 0.039619995572214094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f79dfc9-5b4e-40bd-9474-37f4ef7526d9", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 953.1249999999998, 292, 1601, 1172.0, 1580.7, 1601.0, 1601.0, 0.0999543958069131, 74.79572064386248, 0.20881586057611215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a5b53ad-d4df-4416-8c85-bf13f5d9bc62", 3, 0, 0.0, 302.6666666666667, 228, 423, 257.0, 423.0, 423.0, 423.0, 0.029163871795619585, 0.029249312826270815, 0.01870209226476907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7aec266-a907-4ef8-991d-6cc00d452d89", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1953a7a2-6e05-4b23-993e-1592899da5c8", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 553.7333333333333, 286, 1384, 562.0, 1067.2000000000003, 1384.0, 1384.0, 0.08327966421639388, 6.762558139615581, 0.1858773911673588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1269.0, 1137, 1540, 1199.5, 1540.0, 1540.0, 1540.0, 0.0751455945895172, 89.90025596468158, 0.1694445096749953], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1151.7391304347825, 163, 2380, 1113.0, 2016.0000000000002, 2323.599999999999, 2380.0, 0.09429475721149905, 0.02970733264730481, 0.04254314241378179], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 354.0, 286, 582, 294.0, 581.0, 582.0, 582.0, 0.12612851832182687, 0.19547456892259693, 0.28366599384293684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 151.1764705882353, 144, 179, 150.0, 163.79999999999998, 179.0, 179.0, 0.08889586111328994, 0.06901582967291552, 0.03159970063011478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 699.4666666666667, 287, 1700, 578.0, 1529.6000000000001, 1700.0, 1700.0, 0.09528165256498208, 15.32664312217331, 0.21104017590581092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d982e964-dbdd-4dab-8214-051b664d561d", 3, 0, 0.0, 511.66666666666663, 223, 800, 512.0, 800.0, 800.0, 800.0, 0.024868198547697205, 0.02494105459812991, 0.01594737992804801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 144.08333333333334, 138, 149, 145.0, 149.0, 149.0, 149.0, 0.0627552701352899, 0.04663746149702697, 0.031500203954627944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 168.16666666666666, 137, 439, 143.5, 351.4000000000003, 439.0, 439.0, 0.06265925894983082, 0.0167662470236852, 0.03573535861982539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 191.41666666666669, 138, 443, 144.5, 437.0, 443.0, 443.0, 0.06266449429753101, 0.016890039478631408, 0.036839868717884444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 142.33333333333334, 138, 148, 142.5, 147.7, 148.0, 148.0, 0.0627552701352899, 0.016914506403652357, 0.03695451942537091], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1369.4181818181821, 1094, 2266, 1176.0, 1831.8, 1879.5999999999995, 2266.0, 0.2508117179234614, 300.0580108977691, 0.4952551695715224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1151.7391304347825, 163, 2380, 1113.0, 2016.0000000000002, 2323.599999999999, 2380.0, 0.09742336381696268, 0.030692992506872584, 0.04395468172210621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f79dfc9-5b4e-40bd-9474-37f4ef7526d9", 3, 0, 0.0, 345.6666666666667, 243, 401, 393.0, 401.0, 401.0, 401.0, 0.025428685252210176, 0.02550318335353501, 0.016306806623324885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 143.25, 138, 148, 143.5, 148.0, 148.0, 148.0, 0.041510785020833225, 0.011188453775146455, 0.02444433922613519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5e1e116-ce82-4060-9f06-3266b4176e87", 2, 0, 0.0, 550.5, 282, 819, 550.5, 819.0, 819.0, 819.0, 0.02734519203161104, 0.031484356841083416, 0.016997280007930108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 144.5, 136, 150, 144.5, 150.0, 150.0, 150.0, 0.04151035423898549, 0.011188337665976556, 0.024403548097528576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e7e03b5-6bd9-4db9-ab78-8deb72d83af1", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 293.0, 137, 1322, 140.0, 1276.3999999999999, 1322.0, 1322.0, 0.08476689104961356, 8.993500296060832, 0.04897664235851408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 277.1176470588235, 137, 992, 144.0, 768.7999999999998, 992.0, 992.0, 0.08476900446283876, 2.9525013089331575, 0.04906064567802738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 179.125, 135, 444, 143.0, 444.0, 444.0, 444.0, 0.04151207742002439, 0.011107723840904964, 0.02367485665360766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 192.94117647058823, 139, 429, 144.0, 417.8, 429.0, 429.0, 0.08476942715812989, 0.06299759186263364, 0.04255027886648317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 143.75, 138, 151, 145.0, 151.0, 151.0, 151.0, 0.0415097080829779, 0.030848523292134947, 0.020835927690088518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/618c27dc-157e-4e5f-ad32-737b3a7a83b2", 3, 0, 0.0, 322.6666666666667, 255, 454, 259.0, 454.0, 454.0, 454.0, 0.029881966233378156, 0.029969511056327506, 0.019162589023357737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 259.76470588235304, 138, 446, 147.0, 433.2, 446.0, 446.0, 0.08476942715812989, 0.037661233320368595, 0.047507498354475826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 149.5, 146, 153, 149.5, 153.0, 153.0, 153.0, 0.043057514074424916, 0.0338909729921743, 0.015305600706143231], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 505.07692307692304, 401, 800, 454.0, 778.4, 800.0, 800.0, 0.09474942421503746, 0.01711781589822454, 0.06449252800574327], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1264.7619047619046, 781, 2918, 1142.0, 1611.0, 2787.699999999998, 2918.0, 0.10071797528093121, 0.052129420799700725, 0.046326334333318946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92f8ed45-d128-4ffa-b92f-367672b221f3", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 327.125, 281, 593, 290.5, 593.0, 593.0, 593.0, 0.04147871623373257, 0.06428390885052107, 0.09328660496707626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80ed812b-67c8-451f-8505-19c7887a069c", 3, 0, 0.0, 309.6666666666667, 221, 472, 236.0, 472.0, 472.0, 472.0, 0.016993604740082817, 0.02342705601375349, 0.010897591581368212], "isController": false}, {"data": ["addBook", 63, 7, 11.11111111111111, 1293.0158730158726, 731, 2531, 1113.0, 2099.2000000000003, 2328.1999999999994, 2531.0, 0.30254715893810746, 98.84155934696636, 1.099284692074225], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 274.25454545454545, 139, 650, 150.0, 578.4, 603.8, 650.0, 0.25216633808628675, 0.1874009602379533, 0.12189681382100774], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 795.7636363636362, 677, 1179, 712.0, 1017.8, 1114.7999999999997, 1179.0, 0.25154471321615923, 73.96249775610681, 0.1265093040100801], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 229.54545454545456, 139, 577, 147.0, 440.8, 471.1999999999994, 577.0, 0.25240588702312494, 0.4466401047713891, 0.1227520817749182], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1089.6363636363635, 947, 1627, 1020.0, 1279.2, 1329.1999999999996, 1627.0, 0.25160570184266867, 226.39525279368104, 0.1262942683077458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 148.06666666666666, 142, 155, 148.0, 153.8, 155.0, 155.0, 0.09198390894819466, 0.06871844760289933, 0.03269740513392857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 7, 3.867403314917127, 204.13812154696134, 138, 870, 151.0, 353.00000000000017, 411.8, 601.8600000000022, 0.7921676069098024, 1.6580025614148726, 0.3840780260474338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 150.75, 145, 161, 150.0, 160.4, 161.0, 161.0, 0.06499027853750211, 0.05032938562523356, 0.0231020130738777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 148.40000000000003, 139, 157, 149.0, 157.0, 157.0, 157.0, 0.08084030805546724, 0.06560380468173171, 0.028736203254091867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dfd0801-2d0d-4a27-b870-574aa5c279ae", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 340.1666666666667, 282, 588, 292.0, 588.0, 588.0, 588.0, 0.06261120010017793, 0.09703513140525621, 0.14081405647530248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 575.8823529411765, 283, 1694, 297.0, 1511.6, 1694.0, 1694.0, 0.08470649200520197, 12.038000243219743, 0.18795712699247108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60dbf2a0-c8fd-40c8-942d-b047434c3fd0", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 150.6875, 141, 166, 151.5, 156.9, 166.0, 166.0, 0.07682298543724282, 0.06369405726193278, 0.02730817060464491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 171.87500000000003, 140, 429, 153.5, 261.70000000000016, 429.0, 429.0, 0.09624233820760675, 0.07471939343266344, 0.03421114365973521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a5b53ad-d4df-4416-8c85-bf13f5d9bc62", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4eb8a1c9-6ab5-4d4e-86bf-a0f0a1cbe0b5", 3, 0, 0.0, 299.0, 239, 411, 247.0, 411.0, 411.0, 411.0, 0.031753760174433994, 0.02599632384072314, 0.020362925632693672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1953a7a2-6e05-4b23-993e-1592899da5c8", 3, 0, 0.0, 400.66666666666663, 226, 746, 230.0, 746.0, 746.0, 746.0, 0.045938289564351885, 0.0373398141413368, 0.029459124492764718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 219.6, 137, 444, 145.0, 435.0, 444.0, 444.0, 0.09536949320651311, 0.07087518000991844, 0.047871015144675524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 274.8666666666667, 138, 440, 148.0, 434.0, 440.0, 440.0, 0.09537495072294214, 0.04462007785775144, 0.053325525833894986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96f3ee9-bb47-4064-bb4a-cceb4cc58ecc", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9336d02b-c7ed-4a34-9f85-44d47d27e884", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 445.6666666666667, 139, 1278, 425.0, 1275.0, 1278.0, 1278.0, 0.09537434430138292, 11.46467920441901, 0.05497685185185185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 343.1333333333333, 136, 703, 428.0, 689.2, 703.0, 703.0, 0.09537313148139906, 3.7613275463036557, 0.05506929056696148], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 46.15384615384615, 0.45454545454545453], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5303030303030303], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 13, "401/Unauthorized", 7, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
