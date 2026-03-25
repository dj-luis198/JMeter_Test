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

    var data = {"OkPercent": 98.62909367859864, "KoPercent": 1.3709063214013708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7745740498034076, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24130021-ae4b-455e-b3ee-db7814dc330d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ae3028c-e141-4035-afd6-aefadac2f18d"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/674192d4-759c-4463-a99e-b5eb38748a72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4490329d-e432-41e8-b14b-e3fd472adc0e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc8f838f-7b84-4116-9c41-d48bb44a5d4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/815c0e17-5ce0-4361-bfee-0c1967ca1a85"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f18e5a9-e2b2-4536-94df-165411eb0ada"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=529bd240-9c20-4c2c-a422-f3634d8f3416"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0335c0aa-9dc8-4aca-be07-b23808bdb72b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8182a25f-bec9-4f6c-8d26-32067921592c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18c2021a-e8ac-47c8-a84e-2d3875efb38f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53ea9797-f998-4284-a0a4-d122fd0ab6b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=299fe16d-ab46-452c-a8a7-1637840416a6"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/299fe16d-ab46-452c-a8a7-1637840416a6"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4490329d-e432-41e8-b14b-e3fd472adc0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=674192d4-759c-4463-a99e-b5eb38748a72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ae3028c-e141-4035-afd6-aefadac2f18d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24130021-ae4b-455e-b3ee-db7814dc330d"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0335c0aa-9dc8-4aca-be07-b23808bdb72b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53ea9797-f998-4284-a0a4-d122fd0ab6b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a694805a-db64-4757-a06e-1456f23ae7a7"], "isController": false}, {"data": [0.31451612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=815c0e17-5ce0-4361-bfee-0c1967ca1a85"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9466292134831461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc8f838f-7b84-4116-9c41-d48bb44a5d4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8182a25f-bec9-4f6c-8d26-32067921592c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4319a8b0-8b0a-45e5-b879-6a01a7ee670b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f18e5a9-e2b2-4536-94df-165411eb0ada"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/529bd240-9c20-4c2c-a422-f3634d8f3416"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 18, 1.3709063214013708, 407.9862909367859, 125, 2407, 162.0, 1043.0000000000007, 1261.4999999999993, 1699.599999999999, 5.077771504149618, 697.2510093061862, 3.719172895847675], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/24130021-ae4b-455e-b3ee-db7814dc330d", 3, 0, 0.0, 670.6666666666666, 324, 973, 715.0, 973.0, 973.0, 973.0, 0.04221962649703759, 0.027143151800667068, 0.027074434960665382], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2042.6851851851857, 1564, 2800, 2023.0, 2454.5, 2598.0, 2800.0, 0.24682893383613302, 297.0189567620843, 1.2136559393212203], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 471.53846153846155, 141, 759, 463.0, 689.8, 759.0, 759.0, 0.07944219358229296, 0.015050571831020345, 0.05370344802036165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 471.53846153846155, 141, 759, 463.0, 689.8, 759.0, 759.0, 0.07796101949025487, 0.014769958770614693, 0.052702164542728636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 238.31250000000003, 134, 408, 147.0, 407.3, 408.0, 408.0, 0.08296259424032189, 0.03777471637163094, 0.046443659324477075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 190.56250000000003, 131, 423, 145.0, 398.5, 423.0, 423.0, 0.0830676897837125, 0.06173292180215353, 0.041696086473465066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 251.24999999999997, 128, 1020, 141.5, 847.1000000000001, 1020.0, 1020.0, 0.08308062975117352, 3.0731516831616332, 0.04803098907489719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 339.4375, 126, 1218, 144.5, 1196.3, 1218.0, 1218.0, 0.0829501210553329, 9.349396035632262, 0.047874532757521245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ae3028c-e141-4035-afd6-aefadac2f18d", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 297.85714285714283, 137, 973, 238.0, 691.5, 973.0, 973.0, 0.07413094702284821, 0.18020811270551482, 0.04791932798972757], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/674192d4-759c-4463-a99e-b5eb38748a72", 3, 0, 0.0, 383.6666666666667, 236, 467, 448.0, 467.0, 467.0, 467.0, 0.03807299862937205, 0.038432411702370675, 0.02441530185542413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 141.88888888888889, 129, 159, 143.5, 150.9, 159.0, 159.0, 0.08001493612140934, 0.05946422498866455, 0.04016374723281679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 166.66666666666669, 128, 396, 138.5, 396.0, 396.0, 396.0, 0.08001991606799914, 0.021411579104132585, 0.045636358382530766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 724.8571428571429, 629, 948, 680.0, 948.0, 948.0, 948.0, 0.06720946309240342, 19.76181371337084, 0.03833039691988632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1142.2857142857142, 893, 1308, 1209.0, 1308.0, 1308.0, 1308.0, 0.06720946309240342, 60.47519303217893, 0.03826476267858515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 379.57142857142856, 137, 438, 422.0, 438.0, 438.0, 438.0, 0.06754865915911569, 0.11952946327765393, 0.037402431389861907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 179.33333333333334, 132, 433, 144.0, 425.2, 433.0, 433.0, 0.0745641724122504, 0.05541341328683843, 0.03742771935536787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 200.26666666666668, 128, 550, 142.0, 464.80000000000007, 550.0, 550.0, 0.07447199356561975, 0.027383972634024763, 0.042055343241418346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4490329d-e432-41e8-b14b-e3fd472adc0e", 3, 0, 0.0, 358.0, 240, 591, 243.0, 591.0, 591.0, 591.0, 0.03394855662053435, 0.03404801528250857, 0.021770396009912978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 245.93333333333334, 132, 943, 144.0, 629.2000000000002, 943.0, 943.0, 0.07447384230412138, 4.486181107041253, 0.043355800643454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 244.0666666666667, 132, 947, 142.0, 617.6000000000001, 947.0, 947.0, 0.07455490720399216, 1.4801964304353012, 0.04347580103034882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 250.42857142857142, 128, 411, 146.0, 411.0, 411.0, 411.0, 0.06774280958463981, 0.050344021576084856, 0.03803917530387489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 158.22222222222223, 128, 437, 145.0, 185.0000000000004, 437.0, 437.0, 0.08001564750440086, 0.021566717491420546, 0.04704044902114191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 951.8333333333333, 133, 1313, 1007.0, 1301.3, 1313.0, 1313.0, 0.1030697610499373, 77.2899235619621, 0.05321244825039081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc8f838f-7b84-4116-9c41-d48bb44a5d4e", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 155.38888888888889, 127, 424, 140.0, 182.80000000000038, 424.0, 424.0, 0.08001564750440086, 0.021566717491420546, 0.04711858930190793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 854.25, 144, 1092, 958.5, 1085.1, 1092.0, 1092.0, 0.10280045574868715, 25.19357406130334, 0.05317380344552861], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 504.38461538461536, 137, 1358, 446.0, 1023.5999999999997, 1358.0, 1358.0, 0.07810950953236437, 0.01479809067312372, 0.053424510538775366], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/815c0e17-5ce0-4361-bfee-0c1967ca1a85", 3, 0, 0.0, 448.33333333333337, 234, 805, 306.0, 805.0, 805.0, 805.0, 0.019454117463961248, 0.022994108239467216, 0.01247545944140744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 455.53333333333336, 272, 1367, 292.0, 1058.6000000000001, 1367.0, 1367.0, 0.07442100458433389, 6.043208447652265, 0.1661051627711405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f18e5a9-e2b2-4536-94df-165411eb0ada", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 374.4090909090909, 145, 676, 350.5, 592.5, 664.1499999999999, 676.0, 0.0900314700911364, 0.05530253387434062, 0.0407075885275353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 139.25, 130, 150, 138.0, 149.4, 150.0, 150.0, 0.10306444963583894, 0.07659379509069672, 0.05173352257111447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 337.99999999999994, 133, 440, 386.5, 439.1, 440.0, 440.0, 0.10285332259087519, 0.15625535694388493, 0.05146014219471848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=529bd240-9c20-4c2c-a422-f3634d8f3416", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["login", 22, 0, 0.0, 2343.3181818181815, 1308, 3847, 2178.0, 3227.6, 3768.849999999999, 3847.0, 0.09045234394914933, 34.55330530723989, 0.18419707612798183], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0335c0aa-9dc8-4aca-be07-b23808bdb72b", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 148.11111111111111, 131, 173, 147.0, 165.8, 173.0, 173.0, 0.08096546822780085, 0.06554723941488955, 0.02878069378410108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8182a25f-bec9-4f6c-8d26-32067921592c", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18c2021a-e8ac-47c8-a84e-2d3875efb38f", 2, 0, 0.0, 369.0, 240, 498, 369.0, 498.0, 498.0, 498.0, 0.013006522771169742, 0.025562135817362407, 0.008084620843603067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53ea9797-f998-4284-a0a4-d122fd0ab6b4", 3, 0, 0.0, 448.33333333333337, 220, 817, 308.0, 817.0, 817.0, 817.0, 0.021944261575597982, 0.025937374277668054, 0.014072329200497403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1135.5833333333335, 571, 1452, 1165.0, 1440.0, 1452.0, 1452.0, 0.10267731088122801, 102.39132181529207, 0.2090312181807292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 585.5000000000001, 270, 1375, 520.0, 1335.1000000000001, 1375.0, 1375.0, 0.08288094152749576, 12.506695630749865, 0.18375044678007543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1114.2222222222222, 137, 1691, 1360.0, 1691.0, 1691.0, 1691.0, 0.0863052713341836, 80.31155004267316, 0.16406991685925526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=299fe16d-ab46-452c-a8a7-1637840416a6", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 873.5000000000001, 156, 1616, 974.0, 1525.9999999999998, 1613.75, 1616.0, 0.09177373602536291, 0.028728177665609877, 0.04140572855831804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/299fe16d-ab46-452c-a8a7-1637840416a6", 3, 0, 0.0, 353.0, 209, 440, 410.0, 440.0, 440.0, 440.0, 0.019084090865717974, 0.022556749327285797, 0.012238170249174613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 347.38888888888886, 264, 570, 295.0, 567.3, 570.0, 570.0, 0.07996232885840449, 0.1239259920881718, 0.1798371517196343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 150.68750000000003, 139, 163, 153.0, 160.2, 163.0, 163.0, 0.08446837715130398, 0.06557847640164714, 0.03002586844050259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 478.87500000000006, 278, 873, 540.0, 685.4000000000002, 873.0, 873.0, 0.1249307025009565, 0.19361818834865036, 0.28097207798799106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 186.58333333333331, 137, 409, 146.0, 402.1, 409.0, 409.0, 0.05951731457876621, 0.04423112929144637, 0.029874902044419754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 226.91666666666666, 127, 439, 147.0, 428.8, 439.0, 439.0, 0.05952764811222946, 0.015928296467530148, 0.03394936181400587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4490329d-e432-41e8-b14b-e3fd472adc0e", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 229.16666666666666, 129, 423, 149.5, 418.5, 423.0, 423.0, 0.05952528584538307, 0.016043924700513405, 0.03499435749894591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=674192d4-759c-4463-a99e-b5eb38748a72", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 167.08333333333334, 133, 436, 139.5, 353.2000000000003, 436.0, 436.0, 0.059519676212961406, 0.016042412729274754, 0.03504918433243723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 2.152714416058394, 4.512146441605839], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1324.0925925925922, 1017, 2138, 1162.5, 1847.0, 1994.0, 2138.0, 0.23622357248782794, 282.6055172968149, 0.46644928083045706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 873.5000000000001, 156, 1616, 974.0, 1525.9999999999998, 1613.75, 1616.0, 0.0909658505927252, 0.02847528313120997, 0.041041233372889695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 171.36363636363637, 128, 432, 146.0, 377.20000000000016, 432.0, 432.0, 0.06269842626950063, 0.01689918520545134, 0.03692104593799695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 140.1818181818182, 126, 150, 142.0, 149.4, 150.0, 150.0, 0.06269235153311296, 0.01689754787415935, 0.036856245725521486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 229.56249999999997, 127, 992, 137.5, 605.6000000000004, 992.0, 992.0, 0.08503446553181086, 4.803622077936745, 0.049534237001684744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 209.5625, 127, 946, 142.5, 591.1000000000004, 946.0, 946.0, 0.08503536939895938, 1.5841885865261456, 0.04961780587488108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 177.99999999999997, 133, 427, 147.0, 396.90000000000003, 427.0, 427.0, 0.08503310976711558, 0.06319355130153803, 0.04268263517607168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 163.1818181818182, 125, 407, 137.0, 357.00000000000017, 407.0, 407.0, 0.06269556742338317, 0.01677596237695995, 0.03575606579614821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 209.68750000000003, 130, 437, 146.0, 431.4, 437.0, 437.0, 0.08504079300539477, 0.030738011241329823, 0.0480534461452603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 169.0909090909091, 127, 442, 146.0, 383.4000000000002, 442.0, 442.0, 0.06269163693563279, 0.04659017158985992, 0.0314682630712063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ae3028c-e141-4035-afd6-aefadac2f18d", 3, 0, 0.0, 369.0, 227, 622, 258.0, 622.0, 622.0, 622.0, 0.020238681517361416, 0.023921436389823993, 0.012978581572005857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 150.63636363636365, 140, 164, 149.0, 163.4, 164.0, 164.0, 0.06370090686927417, 0.05013958099280759, 0.0226436817386873], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 532.7692307692307, 138, 817, 498.0, 812.2, 817.0, 817.0, 0.08086588703657627, 0.015150204497387411, 0.05503642852699677], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24130021-ae4b-455e-b3ee-db7814dc330d", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1258.9999999999998, 778, 2407, 1126.5, 1887.6999999999998, 2336.349999999999, 2407.0, 0.09125412199016945, 0.04723113735819317, 0.0419733315013377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 344.0, 271, 874, 295.0, 760.4000000000004, 874.0, 874.0, 0.06263951528404174, 0.09707901440993576, 0.14087773798744932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0335c0aa-9dc8-4aca-be07-b23808bdb72b", 3, 0, 0.0, 354.3333333333333, 228, 531, 304.0, 531.0, 531.0, 531.0, 0.029031789809841776, 0.024032500483863167, 0.018617391251754004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53ea9797-f998-4284-a0a4-d122fd0ab6b4", 1, 0, 0.0, 1358.0, 1358, 1358, 1358.0, 1358.0, 1358.0, 1358.0, 0.7363770250368188, 0.1330368648748159, 0.5076974410898379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a694805a-db64-4757-a06e-1456f23ae7a7", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["addBook", 62, 7, 11.290322580645162, 1231.8064516129036, 691, 2463, 1089.0, 1943.7, 2208.1499999999983, 2463.0, 0.2799906067667407, 76.66725215609702, 1.0213209530631875], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 262.8518518518518, 137, 628, 148.5, 547.0, 589.25, 628.0, 0.23713956981125447, 0.17623360608043423, 0.11463289751618258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=815c0e17-5ce0-4361-bfee-0c1967ca1a85", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 792.4629629629627, 632, 1247, 726.0, 1018.0, 1079.25, 1247.0, 0.23702819318675628, 69.69415887363324, 0.11920851512810496], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 211.05555555555551, 128, 584, 146.5, 430.5, 441.5, 584.0, 0.23733342709468724, 0.4199689159136458, 0.11542192059878345], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1051.8703703703702, 873, 1548, 990.0, 1311.5, 1416.75, 1548.0, 0.23681717713924852, 213.08851227008998, 0.11887112211872435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 148.625, 135, 162, 148.0, 161.3, 162.0, 162.0, 0.1261193088661874, 0.09421999148694665, 0.044831473073527556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, 3.932584269662921, 209.7752808988764, 127, 1663, 151.0, 335.0, 417.64999999999975, 950.4200000000071, 0.7347023011041172, 1.4688080435455577, 0.35706051362088537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 148.41666666666666, 136, 161, 150.0, 159.20000000000002, 161.0, 161.0, 0.05712626332351079, 0.04423938165580474, 0.020306601415779224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc8f838f-7b84-4116-9c41-d48bb44a5d4e", 3, 0, 0.0, 596.0, 224, 1066, 498.0, 1066.0, 1066.0, 1066.0, 0.043327556325823226, 0.027855443926920857, 0.02778492381571346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 147.49999999999997, 131, 167, 148.5, 166.3, 167.0, 167.0, 0.07818302646495447, 0.06344735839099332, 0.027791622688714282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8182a25f-bec9-4f6c-8d26-32067921592c", 3, 0, 0.0, 326.0, 252, 429, 297.0, 429.0, 429.0, 429.0, 0.022489767155944047, 0.026582143406000267, 0.014422148859768804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4319a8b0-8b0a-45e5-b879-6a01a7ee670b", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.6490567835365854, 1.212763592479675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f18e5a9-e2b2-4536-94df-165411eb0ada", 3, 0, 0.0, 320.0, 254, 450, 256.0, 450.0, 450.0, 450.0, 0.020061119544211362, 0.023711564148773262, 0.012864715332713668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/529bd240-9c20-4c2c-a422-f3634d8f3416", 3, 0, 0.0, 413.3333333333333, 214, 584, 442.0, 584.0, 584.0, 584.0, 0.03676876126043313, 0.03065260338150041, 0.02357892567807724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 451.5833333333333, 275, 822, 315.0, 819.9, 822.0, 822.0, 0.05947159487949568, 0.09216935651734341, 0.13375301074949078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 467.0625, 272, 1420, 304.0, 1002.8000000000004, 1420.0, 1420.0, 0.08496673021470032, 6.476561006444196, 0.18973344675506748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 160.59999999999997, 134, 400, 144.0, 250.60000000000008, 400.0, 400.0, 0.07188900337878316, 0.0596032850279169, 0.025554294169801827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 146.25, 137, 162, 146.0, 160.20000000000002, 162.0, 162.0, 0.09798477969755365, 0.07607216783159683, 0.03483052715811477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 153.56250000000003, 130, 400, 135.0, 223.6000000000002, 400.0, 400.0, 0.12507524057440805, 0.09295142390344191, 0.06278190786645091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 262.375, 132, 465, 145.5, 445.40000000000003, 465.0, 465.0, 0.12507719608195686, 0.03346792160786735, 0.071333088390491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 223.375, 126, 471, 136.5, 471.0, 471.0, 471.0, 0.1250615537334782, 0.03370799690472655, 0.07352251498784558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 223.62500000000003, 127, 472, 143.0, 437.70000000000005, 472.0, 472.0, 0.12507817385866166, 0.0337124765478424, 0.07365443245778612], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5331302361005331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07616146230007616], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07616146230007616], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.6854531607006854], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 18, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
