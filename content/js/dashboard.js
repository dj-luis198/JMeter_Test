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

    var data = {"OkPercent": 97.7183320220299, "KoPercent": 2.2816679779701023};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7080808080808081, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=885fb156-a9cc-4d69-8916-d1ad8260d437"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f87ac7b7-93fe-4f5e-8d64-2504ec77d32a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a2948dc-c07e-4098-87c8-27c15afb6042"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e734967-b55f-4d08-95e5-f69e9d6761b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2481e9b5-c794-496d-bbd8-63e1b6c5f1ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab377efc-1a02-4c36-b0c8-8004908ae7f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/5dbb9d84-90a8-4886-89c7-906e1dc035c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90493cbc-093f-4859-8188-bb7e575eb74e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c008f523-f2e5-4c9e-a9a3-0b214cceb645"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a2948dc-c07e-4098-87c8-27c15afb6042"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cba2175-379b-4488-b1fc-c0c25fa0bb66"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f87ac7b7-93fe-4f5e-8d64-2504ec77d32a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/885fb156-a9cc-4d69-8916-d1ad8260d437"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d805a19e-34ab-4e7e-8c70-e6ddb44fb0b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.23148148148148148, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b5f4af1-675d-4b90-ae3d-7b4281508a58"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab377efc-1a02-4c36-b0c8-8004908ae7f4"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db2cd9d9-0097-4a91-84d6-a4393ccee3b1"], "isController": false}, {"data": [0.9049079754601227, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db2cd9d9-0097-4a91-84d6-a4393ccee3b1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2481e9b5-c794-496d-bbd8-63e1b6c5f1ae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6b5f4af1-675d-4b90-ae3d-7b4281508a58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e734967-b55f-4d08-95e5-f69e9d6761b6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90493cbc-093f-4859-8188-bb7e575eb74e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/5caeab09-e0d9-47f2-9733-8dab3a77ded8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cf7ceb3-0695-4240-86b5-d28679b5094b"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c008f523-f2e5-4c9e-a9a3-0b214cceb645"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2cba2175-379b-4488-b1fc-c0c25fa0bb66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a691ff85-ac3c-4be0-86fd-0f83b1c058d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 29, 2.2816679779701023, 501.9142407553117, 125, 5115, 159.0, 1383.3999999999999, 1667.5999999999995, 2408.639999999996, 4.972710733778047, 733.40993029133, 3.627664432500636], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2279.5999999999995, 1597, 3374, 2206.0, 2824.6, 2963.199999999999, 3374.0, 0.25018195050946146, 301.05239001944597, 1.2301426961085336], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 591.0666666666667, 130, 1138, 530.0, 1089.4, 1138.0, 1138.0, 0.08798015167778149, 0.017905335556298498, 0.058957011798138344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 591.0666666666667, 130, 1138, 530.0, 1089.4, 1138.0, 1138.0, 0.08582806921175501, 0.01746735314817358, 0.05751486434873661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=885fb156-a9cc-4d69-8916-d1ad8260d437", 1, 0, 0.0, 1097.0, 1097, 1097, 1097.0, 1097.0, 1097.0, 1097.0, 0.9115770282588879, 0.16468920920692798, 0.6284896308113036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f87ac7b7-93fe-4f5e-8d64-2504ec77d32a", 3, 0, 0.0, 841.6666666666666, 238, 1766, 521.0, 1766.0, 1766.0, 1766.0, 0.057763401109057304, 0.03713630116874615, 0.03704228521642021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 216.31578947368422, 127, 408, 142.0, 386.0, 408.0, 408.0, 0.10469184781111386, 0.04456506391712813, 0.05878154530677466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 148.63157894736844, 128, 379, 134.0, 157.0, 379.0, 379.0, 0.10468723311642873, 0.07779978945468971, 0.05254808381039489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 307.57894736842104, 127, 1013, 145.0, 1000.0, 1013.0, 1013.0, 0.10469069409930189, 3.265514540986407, 0.06070187706281993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a2948dc-c07e-4098-87c8-27c15afb6042", 3, 0, 0.0, 438.6666666666667, 360, 576, 380.0, 576.0, 576.0, 576.0, 0.06728569506122999, 0.03044502478356435, 0.04314870418965595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 279.42105263157896, 126, 1499, 130.0, 1084.0, 1499.0, 1499.0, 0.10468780993101624, 9.94085440060719, 0.06059797057170564], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 292.8, 128, 725, 278.0, 518.0000000000001, 725.0, 725.0, 0.08884940026654821, 0.148319496890271, 0.05742239560195469], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8e734967-b55f-4d08-95e5-f69e9d6761b6", 3, 0, 0.0, 541.3333333333334, 249, 1003, 372.0, 1003.0, 1003.0, 1003.0, 0.08459759742823304, 0.039214511307878855, 0.05425041241328746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2481e9b5-c794-496d-bbd8-63e1b6c5f1ae", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 177.53846153846155, 128, 448, 132.0, 424.4, 448.0, 448.0, 0.06859434360489658, 0.05097685105793583, 0.0344311451298016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1005.0, 851, 1107, 1015.0, 1107.0, 1107.0, 1107.0, 0.03525063199347359, 10.364856237221646, 0.02010387605877791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 155.92307692307693, 127, 416, 133.0, 308.7999999999999, 416.0, 416.0, 0.0685010907481373, 0.02624365706246246, 0.03862448821781239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1394.4285714285713, 1235, 1686, 1394.0, 1686.0, 1686.0, 1686.0, 0.03520630897056752, 31.678698697806645, 0.020044216923672722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 206.14285714285714, 128, 393, 135.0, 393.0, 393.0, 393.0, 0.03540789899643898, 0.0626553837710424, 0.019605740948223534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 164.2, 129, 436, 133.0, 407.0000000000001, 436.0, 436.0, 0.053507697082225275, 0.03976499753864593, 0.026858355761976357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 184.0, 128, 415, 129.0, 411.7, 415.0, 415.0, 0.053507697082225275, 0.01431748925832981, 0.030516108492206602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 183.4, 128, 385, 133.5, 384.7, 385.0, 385.0, 0.053507124473623664, 0.014421842143281379, 0.03145633684875141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 157.5, 126, 392, 130.5, 367.2000000000001, 392.0, 392.0, 0.05350741077639253, 0.01442191931082455, 0.031508758494301466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab377efc-1a02-4c36-b0c8-8004908ae7f4", 3, 0, 0.0, 512.3333333333334, 256, 905, 376.0, 905.0, 905.0, 905.0, 0.01767325682776822, 0.024364011284374487, 0.011333436181869596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 212.0, 129, 412, 142.0, 412.0, 412.0, 412.0, 0.03540700350529335, 0.026313212565945546, 0.01988186231986687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 816.6666666666666, 126, 1967, 778.0, 1490.0000000000007, 1967.0, 1967.0, 0.09234984172263239, 41.560720542003786, 0.050323448907450066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 273.1538461538462, 129, 1394, 132.0, 1010.7999999999996, 1394.0, 1394.0, 0.06849459419587346, 4.757930266246391, 0.03981454100718666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 666.8888888888888, 127, 1274, 588.5, 1254.2, 1274.0, 1274.0, 0.09235931879871312, 13.590800033736807, 0.050418807820781876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 234.84615384615387, 125, 921, 142.0, 711.7999999999998, 921.0, 921.0, 0.06859904911164232, 1.568636399315065, 0.03994224982454474], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 512.0714285714286, 131, 1340, 508.5, 1218.5, 1340.0, 1340.0, 0.08910160128306305, 0.018279004560092665, 0.060070241099386475], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 378.6, 258, 829, 274.5, 801.0000000000001, 829.0, 829.0, 0.0534696452823732, 0.08286750689758425, 0.12025448543486864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 869.4347826086957, 255, 2938, 675.0, 1676.8000000000002, 2692.7999999999965, 2938.0, 0.0982309880329031, 0.06033915182880474, 0.04441498775315834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 164.33333333333331, 128, 435, 132.5, 398.1000000000001, 435.0, 435.0, 0.09235694934734422, 0.06863636567707906, 0.04635885934036615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 242.55555555555557, 128, 528, 144.5, 438.0000000000001, 528.0, 528.0, 0.09235837100357631, 0.09407205171555674, 0.04879480343060038], "isController": false}, {"data": ["login", 23, 0, 0.0, 3693.0000000000005, 1794, 7581, 3420.0, 6266.000000000002, 7409.599999999998, 7581.0, 0.09981945698215403, 36.479997896467694, 0.20098244181176655], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5dbb9d84-90a8-4886-89c7-906e1dc035c5", 2, 0, 0.0, 396.5, 283, 510, 396.5, 510.0, 510.0, 510.0, 0.030744635061181826, 0.03497802719362971, 0.019110312711369364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 144.6153846153846, 130, 159, 143.0, 157.4, 159.0, 159.0, 0.06687827639248288, 0.05414266711852374, 0.0237731373113904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90493cbc-093f-4859-8188-bb7e575eb74e", 3, 0, 0.0, 620.0, 246, 1252, 362.0, 1252.0, 1252.0, 1252.0, 0.062185187488340274, 0.039979083753083344, 0.039877870882822374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c008f523-f2e5-4c9e-a9a3-0b214cceb645", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1015.3888888888888, 267, 2100, 1065.5, 1630.2000000000007, 2100.0, 2100.0, 0.0922868686040073, 55.275102789306516, 0.1957491002030311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a2948dc-c07e-4098-87c8-27c15afb6042", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cba2175-379b-4488-b1fc-c0c25fa0bb66", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 931.8461538461538, 128, 2069, 1376.0, 1911.3999999999999, 2069.0, 2069.0, 0.06533845318751132, 42.09826432168634, 0.09931327086809674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 517.1052631578947, 263, 1628, 514.0, 1214.0, 1628.0, 1628.0, 0.1046105733760585, 13.3188089380788, 0.23245420018334378], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1503.4166666666665, 512, 4233, 1442.0, 2534.5, 3810.5, 4233.0, 0.09872480460715755, 0.0309961178527355, 0.04454185520361991], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f87ac7b7-93fe-4f5e-8d64-2504ec77d32a", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 173.5294117647059, 131, 404, 145.0, 388.0, 404.0, 404.0, 0.08663347415519622, 0.06725938667322362, 0.030795492766104906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 496.46153846153845, 262, 1784, 294.0, 1423.9999999999995, 1784.0, 1784.0, 0.06843690117711469, 6.39593017593548, 0.15256925452473205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/885fb156-a9cc-4d69-8916-d1ad8260d437", 3, 0, 0.0, 387.0, 234, 582, 345.0, 582.0, 582.0, 582.0, 0.022085781174080128, 0.022150485611113564, 0.01416308232843029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 571.0588235294117, 257, 1665, 290.0, 1362.5999999999997, 1665.0, 1665.0, 0.08358572945757779, 17.7533150807094, 0.1842122306204028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d805a19e-34ab-4e7e-8c70-e6ddb44fb0b9", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 190.66666666666666, 127, 390, 131.0, 390.0, 390.0, 390.0, 0.0628127551768179, 0.046680182314021906, 0.031529058750863675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 167.0, 126, 401, 134.0, 401.0, 401.0, 401.0, 0.06292738180140119, 0.02733954391632057, 0.03530105945239194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 368.3333333333333, 129, 1131, 382.0, 1131.0, 1131.0, 1131.0, 0.06280880998241353, 6.294545458312397, 0.03632497365519359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 346.6666666666667, 125, 1249, 146.0, 1249.0, 1249.0, 1249.0, 0.06292914178634856, 2.070994232369352, 0.036456020833041995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 145.0, 131, 155, 149.0, 155.0, 155.0, 155.0, 0.08667013347200556, 0.02556091827006414, 0.053576361804472186], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1555.1818181818185, 1031, 2766, 1414.0, 2211.2, 2397.7999999999993, 2766.0, 0.24639038091952892, 294.7685547356231, 0.48652475607352286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1503.4166666666665, 512, 4233, 1442.0, 2534.5, 3810.5, 4233.0, 0.09545248454862906, 0.029968724396859613, 0.043065476427213506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 174.83333333333334, 128, 385, 132.0, 385.0, 385.0, 385.0, 0.03970722539144706, 0.010702338093788467, 0.02338228213969002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 135.5, 128, 144, 136.0, 144.0, 144.0, 144.0, 0.039774083207382065, 0.010720358364489698, 0.02338281063558985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 164.70588235294116, 127, 383, 134.0, 383.0, 383.0, 383.0, 0.08474238315520817, 0.0228407204598022, 0.0498192525971048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 195.05882352941177, 126, 446, 130.0, 408.4, 446.0, 446.0, 0.08474660764314698, 0.02284185909131696, 0.04990449649298597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 136.1176470588235, 130, 146, 135.0, 145.2, 146.0, 146.0, 0.08474153830816011, 0.06297686587159164, 0.04253627997108818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 217.33333333333334, 128, 390, 137.0, 390.0, 390.0, 390.0, 0.039706174310105216, 0.010624503672821122, 0.02264492753623188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 131.29411764705884, 127, 146, 129.0, 140.4, 146.0, 146.0, 0.08474703011510641, 0.022676451417518707, 0.048332290612521624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 180.66666666666666, 129, 391, 142.5, 391.0, 391.0, 391.0, 0.03977039226863574, 0.02955592628557793, 0.01996287268171755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 139.33333333333334, 130, 148, 140.0, 148.0, 148.0, 148.0, 0.037379917016584226, 0.02942208312047547, 0.013287392376988923], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 971.3571428571428, 146, 5115, 588.5, 3276.5, 5115.0, 5115.0, 0.08982074345912515, 0.017900241633839322, 0.06111895594613321], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1827.2608695652173, 1212, 2805, 1854.0, 2240.2, 2692.5999999999985, 2805.0, 0.0977637602492551, 0.050600383722758976, 0.0449675108177726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 403.5, 261, 782, 290.5, 782.0, 782.0, 782.0, 0.039667585632400484, 0.06147701015490192, 0.08921332979630694], "isController": false}, {"data": ["addBook", 54, 10, 18.51851851851852, 1540.9814814814813, 660, 5517, 1160.0, 2404.0, 4290.75, 5517.0, 0.2552950075642965, 91.55843160516736, 0.924225546047655], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b5f4af1-675d-4b90-ae3d-7b4281508a58", 1, 0, 0.0, 1340.0, 1340, 1340, 1340.0, 1340.0, 1340.0, 1340.0, 0.746268656716418, 0.13482392723880596, 0.5145172574626865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab377efc-1a02-4c36-b0c8-8004908ae7f4", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 238.85454545454547, 128, 586, 145.0, 538.4, 582.4, 586.0, 0.24739114789492625, 0.1838522104961317, 0.11958849434373876], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 830.0000000000001, 627, 1148, 783.0, 1032.2, 1139.6, 1148.0, 0.24723101265822786, 72.69412656373616, 0.12433981593651108], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 201.43636363636364, 127, 515, 138.0, 396.6, 436.39999999999964, 515.0, 0.24791972809967278, 0.438701706363874, 0.12057033651722365], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1314.4909090909084, 885, 2152, 1278.0, 1702.6, 1855.1999999999996, 2152.0, 0.24706997470901895, 222.31399754586516, 0.12401754589886302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 158.41176470588235, 130, 386, 146.0, 203.59999999999985, 386.0, 386.0, 0.0839979049934284, 0.06275234113278587, 0.02985863029063275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db2cd9d9-0097-4a91-84d6-a4393ccee3b1", 3, 0, 0.0, 482.6666666666667, 366, 595, 487.0, 595.0, 595.0, 595.0, 0.032206810666895694, 0.02684949287692704, 0.02065345605917465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 10, 6.134969325153374, 276.5766871165644, 128, 4960, 144.0, 405.4, 502.3999999999993, 4714.879999999995, 0.6749650094826373, 1.5701493230680679, 0.32103217367719283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 171.88888888888889, 132, 403, 148.0, 403.0, 403.0, 403.0, 0.06577312656211175, 0.05093563414429162, 0.023380291082625664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db2cd9d9-0097-4a91-84d6-a4393ccee3b1", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2481e9b5-c794-496d-bbd8-63e1b6c5f1ae", 3, 0, 0.0, 640.0, 310, 1135, 475.0, 1135.0, 1135.0, 1135.0, 0.09971415276208204, 0.04511805740211394, 0.06394429718141328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b5f4af1-675d-4b90-ae3d-7b4281508a58", 3, 0, 0.0, 2026.6666666666667, 240, 5115, 725.0, 5115.0, 5115.0, 5115.0, 0.018657296557728784, 0.025720589492832492, 0.011964477284741442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 139.94736842105263, 130, 152, 141.0, 151.0, 152.0, 152.0, 0.10963267284456396, 0.08896948352913343, 0.03897098917521609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e734967-b55f-4d08-95e5-f69e9d6761b6", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90493cbc-093f-4859-8188-bb7e575eb74e", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5caeab09-e0d9-47f2-9733-8dab3a77ded8", 1, 0, 0.0, 4308.0, 4308, 4308, 4308.0, 4308.0, 4308.0, 4308.0, 0.23212627669452182, 0.07412626218662953, 0.1385050342386258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cf7ceb3-0695-4240-86b5-d28679b5094b", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 579.8888888888889, 270, 1377, 528.0, 1377.0, 1377.0, 1377.0, 0.06263789035585281, 8.412589476486433, 0.13909336221056076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 338.5882352941177, 259, 581, 282.0, 541.0, 581.0, 581.0, 0.0846815971945485, 0.1312399362770981, 0.1904508968154738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c008f523-f2e5-4c9e-a9a3-0b214cceb645", 3, 0, 0.0, 674.0, 287, 1438, 297.0, 1438.0, 1438.0, 1438.0, 0.055119701618681904, 0.03493426401418414, 0.035346944071876094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 140.5, 132, 157, 142.0, 155.8, 157.0, 157.0, 0.05651505561081473, 0.04685672091170088, 0.020089336174156796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cba2175-379b-4488-b1fc-c0c25fa0bb66", 3, 0, 0.0, 430.0, 278, 692, 320.0, 692.0, 692.0, 692.0, 0.014845752630172506, 0.020466068485931174, 0.009520225482239532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 142.11111111111111, 128, 172, 137.5, 159.40000000000003, 172.0, 172.0, 0.09438711301283666, 0.07327905746602063, 0.03355166907878178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a691ff85-ac3c-4be0-86fd-0f83b1c058d8", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.8677606997282609, 1.6214121942934783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 151.1764705882353, 128, 434, 132.0, 203.5999999999998, 434.0, 434.0, 0.08422095615556106, 0.06258998792420115, 0.042274972132771864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 204.4705882352941, 127, 446, 134.0, 446.0, 446.0, 446.0, 0.08409264040997635, 0.04479015176248281, 0.04671276612847377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 383.0588235294118, 127, 1534, 131.0, 1220.3999999999996, 1534.0, 1534.0, 0.08364248250888087, 13.300034002821704, 0.047904156170355136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 314.11764705882354, 128, 1047, 141.0, 822.1999999999998, 1047.0, 1047.0, 0.08401367940379939, 4.377967891330776, 0.048198794589024846], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5507474429583006], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.23603461841070023], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.344827586206897, 0.23603461841070023], "isController": false}, {"data": ["401/Unauthorized", 16, 55.172413793103445, 1.2588512981904012], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 29, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
