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

    var data = {"OkPercent": 98.80418535127055, "KoPercent": 1.195814648729447};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.842801807617818, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49122807017543857, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae2102f5-4042-4a8c-881e-204b1c84a092"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fae15507-939b-43ce-a09f-69adac53090b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=713fe1d5-bd19-42e3-9536-9b55e57d5951"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1b37778-41eb-49cc-a5d2-cd1644b4d84d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27ea1557-946c-49d7-8012-7e51a69bfe43"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0d47070-00e2-4ce3-b086-87624775a564"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f96dddf7-cf9c-4ea4-aba9-907eae30e1af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d88d7146-980c-4462-b25e-1f903376ebb1"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92db4413-36a6-45db-aa76-961089920db0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d70fdb27-3ec7-4e7c-8c3f-e1e417234e30"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31d29168-eecf-49d6-8411-6bbec64ec64c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae2102f5-4042-4a8c-881e-204b1c84a092"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5afc8e24-6e24-4a7b-8ad1-f3a50100c137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/610c08ca-3993-464d-9da6-1707b31529d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2eb65fa8-f9d9-4d4b-bc31-d8e0105e3099"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1b37778-41eb-49cc-a5d2-cd1644b4d84d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5afc8e24-6e24-4a7b-8ad1-f3a50100c137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/713fe1d5-bd19-42e3-9536-9b55e57d5951"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=610c08ca-3993-464d-9da6-1707b31529d2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fae15507-939b-43ce-a09f-69adac53090b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f96dddf7-cf9c-4ea4-aba9-907eae30e1af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4274193548387097, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9419889502762431, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27ea1557-946c-49d7-8012-7e51a69bfe43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0d47070-00e2-4ce3-b086-87624775a564"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d70fdb27-3ec7-4e7c-8c3f-e1e417234e30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92db4413-36a6-45db-aa76-961089920db0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bac4a92-c939-43f9-b376-e23a94a89ecd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31d29168-eecf-49d6-8411-6bbec64ec64c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2eb65fa8-f9d9-4d4b-bc31-d8e0105e3099"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 16, 1.195814648729447, 261.810164424514, 79, 1786, 95.5, 646.0, 804.05, 1203.3699999999983, 5.163371704877418, 723.5334464469018, 3.7845023718515205], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1179.4736842105265, 966, 1519, 1150.0, 1367.6000000000001, 1420.7999999999997, 1519.0, 0.2583768494342907, 310.91355516629045, 1.2704369500992712], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae2102f5-4042-4a8c-881e-204b1c84a092", 3, 0, 0.0, 317.3333333333333, 180, 544, 228.0, 544.0, 544.0, 544.0, 0.11703206678629945, 0.05295396251072794, 0.07504986053678708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fae15507-939b-43ce-a09f-69adac53090b", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.5282574926900584, 2.0159448099415203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=713fe1d5-bd19-42e3-9536-9b55e57d5951", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 466.6153846153846, 357, 794, 388.0, 761.6, 794.0, 794.0, 0.08064516129032258, 0.01456968245967742, 0.05481350806451613], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 466.6153846153846, 357, 794, 388.0, 761.6, 794.0, 794.0, 0.07919103313840156, 0.014306973760355751, 0.05382515533625731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 127.38095238095238, 80, 245, 82.0, 242.8, 244.8, 245.0, 0.11853423946174167, 0.031717169543473846, 0.06760155844302455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 91.90476190476191, 81, 241, 83.0, 93.80000000000001, 226.3999999999998, 241.0, 0.11864071636394452, 0.08816951675093924, 0.05955207833112059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1b37778-41eb-49cc-a5d2-cd1644b4d84d", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 120.04761904761905, 80, 245, 82.0, 242.8, 244.8, 245.0, 0.11853357040047414, 0.031948501397002796, 0.06980053022606046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 112.38095238095237, 80, 244, 82.0, 241.8, 243.8, 244.0, 0.11864138663533028, 0.03197756124155386, 0.06974815893991097], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 208.0, 162, 448, 184.0, 371.5999999999999, 448.0, 448.0, 0.08113792823662316, 0.18033562821040935, 0.05245440282484818], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 105.57142857142857, 81, 246, 82.5, 243.5, 246.0, 246.0, 0.08362602441879913, 0.06214785603779896, 0.04197634428834253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 104.42857142857142, 79, 246, 82.0, 244.0, 246.0, 246.0, 0.0836265239440658, 0.04031993118731744, 0.04668992031586933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 544.0, 411, 598, 564.0, 598.0, 598.0, 598.0, 0.05199396869963084, 15.287953159933448, 0.029652810274008217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 585.8333333333333, 551, 725, 560.0, 725.0, 725.0, 725.0, 0.051927820329741664, 46.72474401207322, 0.029564374269765027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 165.66666666666669, 82, 259, 163.0, 259.0, 259.0, 259.0, 0.0521412680756396, 0.09226560327447163, 0.028871190428601222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 95.30769230769229, 81, 244, 83.0, 181.59999999999994, 244.0, 244.0, 0.10339287702610273, 0.07683787052428143, 0.05189837772599297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 119.92307692307693, 80, 244, 82.0, 243.6, 244.0, 244.0, 0.10326229417044633, 0.03956112532070886, 0.058224667972007975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 156.15384615384613, 79, 717, 82.0, 529.3999999999999, 717.0, 717.0, 0.10339287702610273, 7.182115679231552, 0.06010021652854439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27ea1557-946c-49d7-8012-7e51a69bfe43", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 142.6153846153846, 80, 550, 82.0, 427.19999999999993, 550.0, 550.0, 0.10339369934702902, 2.36427650755967, 0.06020166493681054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 109.33333333333334, 81, 239, 84.0, 239.0, 239.0, 239.0, 0.05214081496093784, 0.03874917986843134, 0.029278289650917246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 502.6428571428573, 80, 726, 639.0, 725.5, 726.0, 726.0, 0.08105088258621787, 52.0989035154373, 0.0426738324330896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 184.92857142857147, 81, 716, 83.0, 635.0, 716.0, 716.0, 0.08362702347530016, 10.768997614389821, 0.04813687205065408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0d47070-00e2-4ce3-b086-87624775a564", 2, 0, 0.0, 211.5, 166, 257, 211.5, 257.0, 257.0, 257.0, 0.026582312129509025, 0.030606001953799943, 0.016523087568781732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 380.35714285714283, 80, 577, 402.5, 573.5, 577.0, 577.0, 0.08104947491518752, 17.02855347673301, 0.04275224116271261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 174.42857142857142, 81, 562, 83.5, 483.5, 562.0, 562.0, 0.08362702347530016, 3.532051736754077, 0.04821853906576668], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 373.61538461538464, 158, 705, 372.0, 606.9999999999999, 705.0, 705.0, 0.07919151554285785, 0.014307060913504591, 0.05459883786450941], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 277.8461538461538, 164, 798, 170.0, 673.9999999999999, 798.0, 798.0, 0.10319344007239416, 9.644183561284995, 0.23005346462052595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f96dddf7-cf9c-4ea4-aba9-907eae30e1af", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d88d7146-980c-4462-b25e-1f903376ebb1", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 486.95238095238096, 154, 1114, 411.0, 1009.8000000000002, 1109.6, 1114.0, 0.09254974548819991, 0.05684940421101342, 0.04184622281351226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 82.64285714285712, 81, 85, 82.5, 85.0, 85.0, 85.0, 0.08104853649499816, 0.06023235964130234, 0.04068256617034087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 174.1428571428571, 80, 328, 161.0, 328.0, 328.0, 328.0, 0.08104994413343136, 0.10863948984849449, 0.04136170419086104], "isController": false}, {"data": ["login", 21, 0, 0.0, 2146.3809523809523, 1387, 3024, 2128.0, 2716.6, 2993.4999999999995, 3024.0, 0.08922501699524132, 30.619665751402106, 0.17689407317513595], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/92db4413-36a6-45db-aa76-961089920db0", 3, 0, 0.0, 473.0, 188, 850, 381.0, 850.0, 850.0, 850.0, 0.023552502453385672, 0.027838260549558392, 0.01510365554465162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 89.14285714285714, 82, 117, 86.5, 107.0, 117.0, 117.0, 0.07983758753621205, 0.0646341406909373, 0.028379767444512878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d70fdb27-3ec7-4e7c-8c3f-e1e417234e30", 3, 0, 0.0, 476.0, 169, 867, 392.0, 867.0, 867.0, 867.0, 0.04626630887387804, 0.029744778654267296, 0.029669475417167884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 587.8571428571429, 165, 811, 722.5, 810.0, 811.0, 811.0, 0.08100961121173018, 69.26134152639467, 0.1673874653539252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31d29168-eecf-49d6-8411-6bbec64ec64c", 3, 0, 0.0, 675.0, 187, 1470, 368.0, 1470.0, 1470.0, 1470.0, 0.03137747097583935, 0.026158106500366072, 0.02012162038489698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae2102f5-4042-4a8c-881e-204b1c84a092", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 1.1434434335443038, 4.363627373417722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5afc8e24-6e24-4a7b-8ad1-f3a50100c137", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 243.8095238095238, 165, 484, 176.0, 329.0, 468.4999999999998, 484.0, 0.11847806463260516, 0.18361785993353946, 0.2664599441883689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 705.8333333333334, 642, 838, 652.5, 838.0, 838.0, 838.0, 0.05188919926317337, 62.07752192318669, 0.1170040635729173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/610c08ca-3993-464d-9da6-1707b31529d2", 3, 0, 0.0, 556.3333333333334, 342, 879, 448.0, 879.0, 879.0, 879.0, 0.03236071409309099, 0.03245552087266059, 0.020752150639124105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2eb65fa8-f9d9-4d4b-bc31-d8e0105e3099", 3, 0, 0.0, 292.3333333333333, 175, 393, 309.0, 393.0, 393.0, 393.0, 0.01652309929281135, 0.022778426271177106, 0.010595867710559363], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 918.190476190476, 214, 1786, 922.0, 1494.4, 1759.5999999999997, 1786.0, 0.09552445198531653, 0.030011309412797546, 0.04309794611056273], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d1b37778-41eb-49cc-a5d2-cd1644b4d84d", 2, 0, 0.0, 301.5, 180, 423, 301.5, 423.0, 423.0, 423.0, 0.02316503932265425, 0.026354756651261916, 0.014398972196161552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5afc8e24-6e24-4a7b-8ad1-f3a50100c137", 3, 0, 0.0, 237.0, 162, 365, 184.0, 365.0, 365.0, 365.0, 0.023916388306480543, 0.02826836130886421, 0.015337006824142798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 94.84210526315789, 81, 243, 85.0, 101.0, 243.0, 243.0, 0.09608722697320178, 0.07459897015985881, 0.03415600646313032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 315.35714285714283, 164, 963, 167.5, 883.0, 963.0, 963.0, 0.0835845846144661, 14.396208655482253, 0.18492856130033733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/713fe1d5-bd19-42e3-9536-9b55e57d5951", 3, 0, 0.0, 230.66666666666666, 162, 354, 176.0, 354.0, 354.0, 354.0, 0.09207537904364373, 0.04166171122091952, 0.0590457346080658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 260.0952380952381, 163, 798, 174.0, 456.4000000000001, 766.8999999999996, 798.0, 0.105789720261754, 6.182873903691053, 0.23663464166251064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=610c08ca-3993-464d-9da6-1707b31529d2", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fae15507-939b-43ce-a09f-69adac53090b", 3, 0, 0.0, 544.6666666666666, 215, 773, 646.0, 773.0, 773.0, 773.0, 0.024189841879066917, 0.024260710556446994, 0.015512366048750593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 82.625, 81, 85, 82.0, 85.0, 85.0, 85.0, 0.036225649571178874, 0.026921600902018675, 0.018183578007408146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 81.75, 80, 85, 81.0, 85.0, 85.0, 85.0, 0.03622646977580344, 0.009693410857978653, 0.020660408544012895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 82.75, 80, 88, 82.0, 88.0, 88.0, 88.0, 0.03622630573190723, 0.00976412146680312, 0.02129710551817202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 82.625, 80, 88, 82.0, 88.0, 88.0, 88.0, 0.03622646977580344, 0.00976416568175952, 0.021332579369931125], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 764.5087719298243, 633, 1173, 649.0, 1008.8000000000002, 1068.7999999999997, 1173.0, 0.2558015339116543, 306.0275655603624, 0.5051081070013328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 918.190476190476, 214, 1786, 922.0, 1494.4, 1759.5999999999997, 1786.0, 0.08972671805301567, 0.02818981153116508, 0.04048217162157543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 101.11111111111113, 82, 242, 83.0, 242.0, 242.0, 242.0, 0.05025378159706518, 0.013544964571083973, 0.02959280303030303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 100.88888888888889, 81, 243, 82.0, 243.0, 243.0, 243.0, 0.05029871850042754, 0.01355707647081836, 0.029570145055915407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 146.26315789473685, 80, 714, 83.0, 333.0, 714.0, 714.0, 0.09552683047004228, 4.5483507559817395, 0.05572725770122224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 124.89473684210525, 79, 394, 83.0, 248.0, 394.0, 394.0, 0.09552683047004228, 1.502711280838826, 0.05582054562160314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 117.26315789473685, 81, 249, 83.0, 240.0, 249.0, 249.0, 0.09552635018954439, 0.07099175048265946, 0.04794974999748615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 100.22222222222221, 79, 245, 81.0, 245.0, 245.0, 245.0, 0.050299561834928015, 0.013459062444111599, 0.028686468858982385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 142.89473684210526, 80, 250, 83.0, 248.0, 250.0, 250.0, 0.09552731075536963, 0.03311246832515486, 0.054058166705212775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 101.22222222222223, 80, 243, 83.0, 243.0, 243.0, 243.0, 0.05029590758965246, 0.0373781110114507, 0.025246187989337268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 85.66666666666667, 83, 92, 85.0, 92.0, 92.0, 92.0, 0.04985459077690071, 0.03924101578728708, 0.017721749065226423], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 411.54545454545456, 342, 646, 381.0, 625.6000000000001, 646.0, 646.0, 0.09044862518089725, 0.016340816072720695, 0.06156512866316932], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1116.7619047619048, 793, 1700, 1072.0, 1489.2, 1681.0999999999997, 1700.0, 0.09245277204228174, 0.0478515324046966, 0.0425246637030417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f96dddf7-cf9c-4ea4-aba9-907eae30e1af", 3, 0, 0.0, 281.0, 163, 361, 319.0, 361.0, 361.0, 361.0, 0.017270958307906644, 0.023809410297521042, 0.011075451779484404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 221.44444444444446, 165, 490, 167.0, 490.0, 490.0, 490.0, 0.05022797921677837, 0.07784355763381572, 0.11296390247679747], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 785.3870967741937, 417, 1483, 695.0, 1266.3000000000002, 1437.0999999999995, 1483.0, 0.27553351287452554, 80.7769059030833, 1.0032270335039863], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 147.59649122807016, 80, 388, 84.0, 330.2, 336.1, 388.0, 0.25646447966956576, 0.19059518459818317, 0.12397452874651861], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 465.82456140350865, 396, 671, 407.0, 568.0, 657.5999999999999, 671.0, 0.2564125633159093, 75.39380731326868, 0.1289574903395442], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 114.56140350877197, 80, 331, 84.0, 245.0, 249.49999999999997, 331.0, 0.2567822036418024, 0.45438413378803305, 0.1248804076304859], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 613.4736842105261, 550, 804, 562.0, 726.8, 736.3999999999999, 804.0, 0.2562258383529623, 230.55245974697698, 0.12861336026701428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 86.95238095238095, 82, 97, 86.0, 95.2, 96.9, 97.0, 0.10479407963352012, 0.07828854581996376, 0.03725102049472786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 10, 5.524861878453039, 138.93370165745847, 81, 502, 89.0, 275.40000000000003, 350.80000000000007, 476.5800000000002, 0.7614864552174444, 1.5748140064074245, 0.3675467146697631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 108.75, 83, 244, 87.0, 244.0, 244.0, 244.0, 0.03755339623527203, 0.029081878139229217, 0.013349058818006854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27ea1557-946c-49d7-8012-7e51a69bfe43", 3, 0, 0.0, 261.3333333333333, 196, 381, 207.0, 381.0, 381.0, 381.0, 0.054608999563128, 0.0351083249144459, 0.035019443079219455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0d47070-00e2-4ce3-b086-87624775a564", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 88.38095238095238, 83, 101, 86.0, 97.6, 100.69999999999999, 101.0, 0.11486079964994804, 0.09321223096592463, 0.04082942487556746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 166.375, 162, 174, 165.5, 174.0, 174.0, 174.0, 0.036212203512583745, 0.05612184274850625, 0.08144209442332066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 298.94736842105266, 164, 954, 169.0, 497.0, 954.0, 954.0, 0.09548650373653766, 6.152568037274916, 0.21346553659645898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d70fdb27-3ec7-4e7c-8c3f-e1e417234e30", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92db4413-36a6-45db-aa76-961089920db0", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bac4a92-c939-43f9-b376-e23a94a89ecd", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 112.00000000000001, 83, 249, 86.0, 246.6, 249.0, 249.0, 0.097272625238505, 0.08064888557372142, 0.03457737850274982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31d29168-eecf-49d6-8411-6bbec64ec64c", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 109.14285714285714, 84, 247, 86.0, 246.5, 247.0, 247.0, 0.0777881495310486, 0.06039216687224963, 0.027651256278614925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2eb65fa8-f9d9-4d4b-bc31-d8e0105e3099", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 99.23809523809526, 81, 242, 83.0, 212.4000000000001, 241.9, 242.0, 0.10592098294672174, 0.07871666799067896, 0.05316736839317869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 121.42857142857143, 80, 245, 83.0, 242.8, 244.8, 245.0, 0.10592205145794138, 0.035918136124967845, 0.059985060577325625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 136.61904761904762, 80, 557, 83.0, 244.8, 525.7999999999995, 557.0, 0.10583557183967422, 4.561978736184678, 0.06178663359725029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 143.47619047619045, 80, 553, 83.0, 243.8, 522.0999999999996, 553.0, 0.10583610523132748, 1.5090405610573532, 0.061890300561939324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.4484304932735426], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7473841554559043], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 16, "401/Unauthorized", 10, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
