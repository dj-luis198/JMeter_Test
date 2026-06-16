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

    var data = {"OkPercent": 98.21826280623608, "KoPercent": 1.78173719376392};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.806687898089172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3275862068965517, 500, 1500, "see books"], "isController": true}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ff0fe00-c387-4469-95de-c9740fa66ffd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b6d600e-74cb-494c-a22b-8ca7792a3f2a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63333efb-cc3f-4f20-b782-8b9987aa51c0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b18245f-3147-4814-98b4-243e58e28c40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24009d7b-8e6b-4f45-b1c3-d65b4ae0890b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f1ba854-8124-4085-8ed8-36b5b7923d0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc6b60e9-0f0a-49c8-aa19-f34eb6ad0c5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5dbae4c-3d76-41d6-a2af-d077d48a84de"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc6b60e9-0f0a-49c8-aa19-f34eb6ad0c5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fcb71902-d4c1-43a7-b166-453552b0f413"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e88bc25d-e1bf-4bed-9a17-30169a74c9d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80dfc8c7-112a-4854-a3e4-1b5ad5016935"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=722bb099-2905-4972-9456-95f2ab7fb315"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ff0fe00-c387-4469-95de-c9740fa66ffd"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24009d7b-8e6b-4f45-b1c3-d65b4ae0890b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e64e526-4e63-41b7-b558-3b308d4b73e5"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49cfab21-b975-41ef-9176-20ce1966e865"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63333efb-cc3f-4f20-b782-8b9987aa51c0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0da99c3a-2f13-4334-82e7-60a261c7a2b2"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e88bc25d-e1bf-4bed-9a17-30169a74c9d5"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=627bf0dd-d01a-4803-b353-0f184c431a2f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/c5dbae4c-3d76-41d6-a2af-d077d48a84de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7844827586206896, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9339080459770115, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b18245f-3147-4814-98b4-243e58e28c40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcb71902-d4c1-43a7-b166-453552b0f413"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/627bf0dd-d01a-4803-b353-0f184c431a2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/722bb099-2905-4972-9456-95f2ab7fb315"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e64e526-4e63-41b7-b558-3b308d4b73e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b6d600e-74cb-494c-a22b-8ca7792a3f2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80dfc8c7-112a-4854-a3e4-1b5ad5016935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1347, 24, 1.78173719376392, 318.6540460282111, 80, 2187, 97.0, 898.2, 1068.6, 1515.52, 5.267480056311591, 770.6238069837127, 3.8516019107813233], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1410.6206896551723, 1020, 1869, 1413.5, 1682.5, 1706.0, 1869.0, 0.2513270501570794, 302.43023253845735, 1.23577314212978], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 528.6666666666666, 85, 1047, 459.0, 958.2, 1047.0, 1047.0, 0.08517258805426062, 0.016685176917660822, 0.0573473245870549], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 528.6666666666666, 85, 1047, 459.0, 958.2, 1047.0, 1047.0, 0.08256183881727414, 0.016173735221430854, 0.05558948808907872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 116.35000000000001, 81, 248, 84.0, 247.8, 248.0, 248.0, 0.12965544066642898, 0.044429779423681565, 0.07339966694758679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 85.19999999999999, 83, 90, 85.0, 88.7, 89.95, 90.0, 0.12965880286027318, 0.09635776267252724, 0.06508264127947307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 134.35000000000002, 81, 536, 83.0, 300.30000000000007, 524.3999999999999, 536.0, 0.12966300584780158, 1.9394622672549044, 0.07579714384813868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 149.5, 81, 904, 84.0, 248.60000000000002, 871.2499999999995, 904.0, 0.12966132462009233, 5.866674780629247, 0.075669538665007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ff0fe00-c387-4469-95de-c9740fa66ffd", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b6d600e-74cb-494c-a22b-8ca7792a3f2a", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63333efb-cc3f-4f20-b782-8b9987aa51c0", 3, 0, 0.0, 457.0, 187, 978, 206.0, 978.0, 978.0, 978.0, 0.08371470030137293, 0.0378787218160509, 0.05368423163857573], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 263.2, 83, 1041, 184.0, 649.2000000000003, 1041.0, 1041.0, 0.0848085306073987, 0.15415717282282368, 0.05481634712696968], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4b18245f-3147-4814-98b4-243e58e28c40", 3, 0, 0.0, 273.3333333333333, 180, 435, 205.0, 435.0, 435.0, 435.0, 0.04428697962798937, 0.02847226066578093, 0.028400178993209332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24009d7b-8e6b-4f45-b1c3-d65b4ae0890b", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 97.62499999999999, 82, 253, 85.5, 147.30000000000013, 253.0, 253.0, 0.06794891939984117, 0.05049719498367102, 0.034107172433123396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f1ba854-8124-4085-8ed8-36b5b7923d0c", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 116.875, 82, 251, 84.5, 250.3, 251.0, 251.0, 0.06795497982586536, 0.03732049001911234, 0.03768548258653642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 554.1249999999999, 485, 668, 496.5, 668.0, 668.0, 668.0, 0.08634087376964256, 25.38708367509929, 0.049241279571749265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 946.125, 729, 1126, 978.0, 1126.0, 1126.0, 1126.0, 0.0861141011840689, 77.48561961786866, 0.04902785252960172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 192.75, 82, 280, 249.0, 280.0, 280.0, 280.0, 0.08655947718075784, 0.1531696998550129, 0.047928929259267276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 102.77777777777777, 83, 245, 85.0, 245.0, 245.0, 245.0, 0.05596249269378568, 0.04158931341794033, 0.028090548090435388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 119.55555555555556, 82, 247, 83.0, 247.0, 247.0, 247.0, 0.05601822459573515, 0.014989251503155693, 0.0319478937147552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 119.88888888888889, 83, 247, 84.0, 247.0, 247.0, 247.0, 0.05601927062909641, 0.015098944036748642, 0.03293320402218363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 120.11111111111113, 83, 247, 85.0, 247.0, 247.0, 247.0, 0.05601892194696875, 0.015098850056018923, 0.03298770501369352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc6b60e9-0f0a-49c8-aa19-f34eb6ad0c5c", 3, 0, 0.0, 371.0, 317, 431, 365.0, 431.0, 431.0, 431.0, 0.08511121198365865, 0.03945259305492511, 0.054579781122333186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 83.74999999999999, 81, 88, 83.5, 88.0, 88.0, 88.0, 0.08671522719389525, 0.06444364052202567, 0.04869263245750954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 230.56249999999997, 82, 983, 84.0, 967.6, 983.0, 983.0, 0.06795555706567905, 11.479856187725103, 0.03885544791206551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 522.2631578947368, 81, 1154, 732.0, 1049.0, 1154.0, 1154.0, 0.10458581265928694, 49.543088580742996, 0.05675457494123928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 171.1875, 82, 664, 84.5, 482.70000000000016, 664.0, 664.0, 0.06795497982586536, 3.76132306487577, 0.03892148014440434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 387.89473684210526, 83, 739, 490.0, 738.0, 739.0, 739.0, 0.10458581265928694, 16.198458804198843, 0.05685670952391437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5dbae4c-3d76-41d6-a2af-d077d48a84de", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 406.8, 86, 1247, 406.0, 865.4000000000002, 1247.0, 1247.0, 0.08262869419120279, 0.016186832084721953, 0.05618320847219545], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 242.0, 168, 493, 171.0, 493.0, 493.0, 493.0, 0.05593293020191788, 0.08668511741254264, 0.1257944709521649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc6b60e9-0f0a-49c8-aa19-f34eb6ad0c5c", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcb71902-d4c1-43a7-b166-453552b0f413", 3, 0, 0.0, 281.6666666666667, 183, 420, 242.0, 420.0, 420.0, 420.0, 0.019651899356072765, 0.02322787974020189, 0.012602292230294057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 594.1249999999999, 138, 1342, 493.5, 1180.5, 1333.0, 1342.0, 0.09892664589207102, 0.060766465103625655, 0.04472952836721571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 93.73684210526315, 83, 251, 84.0, 89.0, 251.0, 251.0, 0.10458408560482628, 0.07772313393093047, 0.05249630859461007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 154.84210526315792, 82, 258, 89.0, 255.0, 258.0, 258.0, 0.1045869640606164, 0.11066135085073238, 0.055024268304094855], "isController": false}, {"data": ["login", 24, 0, 0.0, 2582.0, 1525, 4134, 2513.5, 3681.0, 4072.25, 4134.0, 0.10048147372828135, 40.205378637220015, 0.20714491312539252], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e88bc25d-e1bf-4bed-9a17-30169a74c9d5", 3, 0, 0.0, 305.3333333333333, 199, 407, 310.0, 407.0, 407.0, 407.0, 0.01840411761458097, 0.025371561880778125, 0.01180211969424626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 89.25, 84, 111, 87.0, 97.70000000000002, 111.0, 111.0, 0.06877490403751671, 0.05567812055380991, 0.02444732916958602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80dfc8c7-112a-4854-a3e4-1b5ad5016935", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 626.9999999999999, 170, 1239, 820.0, 1137.0, 1239.0, 1239.0, 0.1045357512269196, 65.89837366957624, 0.22102627457965623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=722bb099-2905-4972-9456-95f2ab7fb315", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff0fe00-c387-4469-95de-c9740fa66ffd", 3, 0, 0.0, 339.6666666666667, 196, 485, 338.0, 485.0, 485.0, 485.0, 0.03749531308586427, 0.031258299743782025, 0.024044845956755403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 280.45, 168, 995, 175.5, 385.50000000000006, 964.6999999999996, 995.0, 0.129582356066398, 7.942063374275958, 0.28977601284809057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 715.0, 83, 1210, 937.0, 1193.2, 1210.0, 1210.0, 0.12905307307630262, 102.93973826423617, 0.22250312550411358], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1083.375, 115, 1981, 994.5, 1894.0, 1968.5, 1981.0, 0.10357283112018333, 0.03236650972505729, 0.04672914841555146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 351.3125, 168, 1068, 178.5, 1051.2, 1068.0, 1068.0, 0.06792468850162382, 15.32207097997283, 0.1495056223599584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 100.46666666666667, 83, 257, 87.0, 171.20000000000005, 257.0, 257.0, 0.10113200423405991, 0.07851556969343519, 0.035949267130075985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 258.0555555555555, 165, 497, 178.5, 434.9000000000001, 497.0, 497.0, 0.10363589256412471, 0.16061539208912687, 0.23307955134294844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 100.0909090909091, 82, 256, 84.0, 222.80000000000013, 256.0, 256.0, 0.0512423951627179, 0.03808150656135578, 0.02572128038441113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 142.36363636363635, 82, 249, 83.0, 248.8, 249.0, 249.0, 0.051242872582268104, 0.02070823472962397, 0.028833214348936015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 164.54545454545456, 82, 812, 83.0, 699.6000000000004, 812.0, 812.0, 0.05120303866760384, 4.200962944419102, 0.029701762664606134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 163.90909090909093, 81, 643, 83.0, 564.4000000000003, 643.0, 643.0, 0.05124311129537927, 1.3822993046076872, 0.02977505002026432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.0, 86, 88, 87.0, 88.0, 88.0, 88.0, 0.13901438798915688, 0.04099838395773962, 0.08593369882532842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24009d7b-8e6b-4f45-b1c3-d65b4ae0890b", 3, 0, 0.0, 950.3333333333334, 187, 2187, 477.0, 2187.0, 2187.0, 2187.0, 0.02771772271190199, 0.027798926977659517, 0.017774711504702775], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 995.3620689655173, 658, 1498, 974.0, 1321.1, 1348.55, 1498.0, 0.24945270935748723, 298.4321641850423, 0.4925716585164446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1083.375, 115, 1981, 994.5, 1894.0, 1968.5, 1981.0, 0.10086873195395342, 0.031521478735610446, 0.04550913492453758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 103.74999999999999, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.04006791511612182, 0.010799555246142211, 0.023594680483419395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 124.5, 83, 246, 84.0, 246.0, 246.0, 246.0, 0.040067714437399204, 0.010799501156955254, 0.02355543368292414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e64e526-4e63-41b7-b558-3b308d4b73e5", 3, 0, 0.0, 591.3333333333334, 289, 1041, 444.0, 1041.0, 1041.0, 1041.0, 0.03247807729782397, 0.03257322791490744, 0.020827412850492583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 149.73333333333332, 81, 742, 84.0, 448.00000000000017, 742.0, 742.0, 0.09759779298857456, 5.879129657448012, 0.056817673496343334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49cfab21-b975-41ef-9176-20ce1966e865", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63333efb-cc3f-4f20-b782-8b9987aa51c0", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 122.46666666666667, 83, 664, 84.0, 316.6000000000002, 664.0, 664.0, 0.09770141145972422, 1.93974194207609, 0.05697340771124674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 104.125, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.0401004516313365, 0.010730003659166211, 0.022869788820996596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 95.73333333333333, 83, 250, 84.0, 154.00000000000006, 250.0, 250.0, 0.097700138734197, 0.07260723200851944, 0.04904088995056373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 105.37499999999999, 83, 252, 84.5, 252.0, 252.0, 252.0, 0.0400996476243465, 0.02980061703332782, 0.020128143436439552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 127.86666666666665, 82, 255, 84.0, 253.8, 255.0, 255.0, 0.09759715797075989, 0.035887288295498164, 0.05511443673426896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 93.375, 85, 124, 89.0, 124.0, 124.0, 124.0, 0.04225850584487959, 0.03326206612399702, 0.015021578249547042], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 419.71428571428567, 84, 978, 425.5, 731.5, 978.0, 978.0, 0.09519729639678233, 0.018380727987325162, 0.06478409763162726], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0da99c3a-2f13-4334-82e7-60a261c7a2b2", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.44290698682385576, 0.8275723821081831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1373.5833333333335, 713, 2053, 1398.0, 2040.0, 2051.0, 2053.0, 0.09989012086704625, 0.05170094146438917, 0.0459455536409949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 231.37500000000003, 168, 500, 171.0, 500.0, 500.0, 500.0, 0.04005006257822278, 0.062069774718397995, 0.0900735294117647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e88bc25d-e1bf-4bed-9a17-30169a74c9d5", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 928.8793103448274, 428, 2242, 729.5, 1614.4, 1892.8999999999994, 2242.0, 0.2666102801246633, 89.03263831988407, 0.9678897652680353], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=627bf0dd-d01a-4803-b353-0f184c431a2f", 1, 0, 0.0, 1247.0, 1247, 1247, 1247.0, 1247.0, 1247.0, 1247.0, 0.8019246190858059, 0.14487895950280671, 0.5528894346431436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5dbae4c-3d76-41d6-a2af-d077d48a84de", 2, 0, 0.0, 350.0, 175, 525, 350.0, 525.0, 525.0, 525.0, 0.021196320318792657, 0.030210966313747936, 0.013175251838780789], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 163.62068965517238, 83, 364, 86.5, 337.1, 343.79999999999995, 364.0, 0.2501973539472946, 0.18593768198622188, 0.12094500996475668], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 535.896551724138, 405, 758, 491.5, 707.4000000000001, 756.05, 758.0, 0.2501811656716933, 73.56156950399428, 0.12582353546965044], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 124.29310344827586, 82, 341, 86.0, 250.1, 253.69999999999996, 341.0, 0.25053562789411843, 0.44333062279701435, 0.12184252215944433], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 829.6896551724138, 572, 1102, 819.0, 1020.5, 1057.55, 1102.0, 0.24987829203879147, 224.84092641568978, 0.125427189558534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 90.44444444444444, 84, 113, 87.0, 105.80000000000001, 113.0, 113.0, 0.09814024240639874, 0.07331766156337406, 0.03488578929289955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 156.67816091954018, 84, 1114, 89.0, 294.0, 442.75, 1065.25, 0.7044848151132237, 1.5629017132341927, 0.33682231293701337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 103.45454545454544, 84, 249, 86.0, 219.4000000000001, 249.0, 249.0, 0.052882072977260705, 0.04095262096774194, 0.018797924378635644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b18245f-3147-4814-98b4-243e58e28c40", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 104.80000000000003, 84, 255, 88.0, 233.7000000000003, 254.65, 255.0, 0.12416884479515244, 0.1007659277585661, 0.044138144048276845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 310.6363636363636, 166, 895, 171.0, 817.4000000000003, 895.0, 895.0, 0.051182787693796646, 5.638694667335145, 0.11392078038629046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcb71902-d4c1-43a7-b166-453552b0f413", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 269.00000000000006, 167, 993, 171.0, 601.2000000000003, 993.0, 993.0, 0.09754257733500672, 7.920749399300295, 0.21771173038906483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/627bf0dd-d01a-4803-b353-0f184c431a2f", 3, 0, 0.0, 263.3333333333333, 176, 437, 177.0, 437.0, 437.0, 437.0, 0.022881898892516093, 0.027447850722305274, 0.014673613547609604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/722bb099-2905-4972-9456-95f2ab7fb315", 3, 0, 0.0, 259.3333333333333, 176, 397, 205.0, 397.0, 397.0, 397.0, 0.02618417951873478, 0.026260890982168574, 0.016791286996063647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e64e526-4e63-41b7-b558-3b308d4b73e5", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b6d600e-74cb-494c-a22b-8ca7792a3f2a", 3, 0, 0.0, 289.3333333333333, 184, 394, 290.0, 394.0, 394.0, 394.0, 0.09628963923481833, 0.04356855421106689, 0.061748238702015665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 110.55555555555556, 84, 292, 88.0, 292.0, 292.0, 292.0, 0.05686772567009137, 0.04714912020889411, 0.02021469935929029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 99.47368421052633, 85, 249, 89.0, 121.0, 249.0, 249.0, 0.10250323694432456, 0.07958014977611134, 0.036436697507552865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80dfc8c7-112a-4854-a3e4-1b5ad5016935", 3, 0, 0.0, 329.6666666666667, 198, 403, 388.0, 403.0, 403.0, 403.0, 0.0727114084199811, 0.03290001878378051, 0.04662808417557381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 93.55555555555554, 82, 248, 85.0, 104.00000000000023, 248.0, 248.0, 0.10368902509274408, 0.07705795712458813, 0.0520470301735063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 120.83333333333331, 82, 257, 84.5, 249.8, 257.0, 257.0, 0.10368962239695843, 0.027745074742936145, 0.05913548777326536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 130.38888888888889, 80, 257, 85.0, 249.8, 257.0, 257.0, 0.10368962239695843, 0.027947593536680203, 0.060958156916961895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 134.66666666666663, 81, 342, 84.0, 256.5000000000001, 342.0, 342.0, 0.10368902509274408, 0.027947432544528677, 0.06105906458098113], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 33.333333333333336, 0.5939123979213066], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.14847809948032664], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.14847809948032664], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.89086859688196], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1347, 24, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
