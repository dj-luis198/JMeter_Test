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

    var data = {"OkPercent": 97.87234042553192, "KoPercent": 2.127659574468085};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8073015873015873, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39166666666666666, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36770ecc-a78c-43ef-b204-4b7d8ca23d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef7e8a8e-8dd3-40b6-b339-06cd72d3e740"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c1abda7-2db0-47c3-b768-536d8d5ac95f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75fff359-c4d0-403a-80db-72a83c5fa13b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dddc3605-cf5e-4bea-9645-983f1a76aec2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c46e5d73-30ba-49d9-a0c9-9a94710c7a20"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f90de76-56dc-4ae8-abae-8a02875c7013"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3f0189d-2b85-4206-b8aa-711587e1b608"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/b75900c2-06fd-4b34-95c4-1076db64e874"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f14c8c32-4944-4801-8224-32402ee5a656"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c1abda7-2db0-47c3-b768-536d8d5ac95f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b75900c2-06fd-4b34-95c4-1076db64e874"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9120879120879121, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/df74afe6-3d6a-4d29-9859-f021754b5e55"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f14c8c32-4944-4801-8224-32402ee5a656"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75fff359-c4d0-403a-80db-72a83c5fa13b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f90de76-56dc-4ae8-abae-8a02875c7013"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dddc3605-cf5e-4bea-9645-983f1a76aec2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c46e5d73-30ba-49d9-a0c9-9a94710c7a20"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/36770ecc-a78c-43ef-b204-4b7d8ca23d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fa7f02c-767b-4cf0-b838-2ffdce95b30e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9fa7f02c-767b-4cf0-b838-2ffdce95b30e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92c03028-b7dd-4f8e-b8ae-116562534db6"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bddaa8c-ae52-48ae-a8b1-dc1907901226"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6bddaa8c-ae52-48ae-a8b1-dc1907901226"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 29, 2.127659574468085, 298.22303741746174, 77, 3152, 90.0, 847.8000000000004, 1017.7999999999997, 1586.0399999999986, 5.4212506662211934, 755.3556306753096, 3.9815494639405293], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1316.333333333334, 970, 1751, 1297.0, 1648.6, 1679.8, 1751.0, 0.2683195148783171, 322.87920063284275, 1.3193249584104751], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 196.75, 159, 396, 162.5, 340.00000000000006, 396.0, 396.0, 0.08738680677684686, 0.13543248276841405, 0.19653497656941243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 110.24999999999999, 81, 361, 83.0, 272.80000000000007, 361.0, 361.0, 0.08057895982635234, 0.06255886041206066, 0.028643302125773686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36770ecc-a78c-43ef-b204-4b7d8ca23d63", 1, 0, 0.0, 1697.0, 1697, 1697, 1697.0, 1697.0, 1697.0, 1697.0, 0.5892751915144372, 0.10646085002946376, 0.40627762227460223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef7e8a8e-8dd3-40b6-b339-06cd72d3e740", 2, 0, 0.0, 171.0, 164, 178, 171.0, 178.0, 178.0, 178.0, 0.03750304712257871, 0.033108158787901514, 0.02331122020851694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 306.25, 159, 923, 316.0, 605.9000000000003, 923.0, 923.0, 0.09181945998680095, 6.998908074732433, 0.2050358131760925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 102.78571428571429, 78, 238, 80.5, 237.0, 238.0, 238.0, 0.07036095168212933, 0.05228973069345744, 0.035317899574818824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c1abda7-2db0-47c3-b768-536d8d5ac95f", 3, 0, 0.0, 646.3333333333333, 211, 1450, 278.0, 1450.0, 1450.0, 1450.0, 0.025778732545649836, 0.025854256176154673, 0.016531283566058003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 101.85714285714286, 79, 239, 79.5, 236.0, 239.0, 239.0, 0.07036236618585716, 0.026376071141378098, 0.03970644129768307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 145.5, 77, 850, 79.0, 543.0, 850.0, 850.0, 0.07036236618585716, 4.539908850894607, 0.0409334635874755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 140.14285714285717, 78, 468, 80.0, 351.5, 468.0, 468.0, 0.07030759573132454, 1.4942227715003138, 0.04097026051475204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 0.08541898009737764, 0.025191925770906294, 0.052802943751601605], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 908.85, 619, 1413, 856.0, 1299.1, 1340.55, 1413.0, 0.26933125050499607, 322.2138102965337, 0.5318240122276388], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 653.9999999999999, 83, 1321, 536.5, 1294.3000000000002, 1321.0, 1321.0, 0.10277228231545951, 0.020524347396007295, 0.06903339992120791], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 653.9999999999999, 83, 1321, 536.5, 1294.3000000000002, 1321.0, 1321.0, 0.09873698934463324, 0.019718471016579586, 0.06632284424239931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1172.772727272727, 144, 3152, 1002.5, 1846.8999999999999, 2957.899999999997, 3152.0, 0.08766931135755929, 0.027443358651167794, 0.039553927585148814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 95.39999999999999, 77, 234, 79.0, 219.70000000000005, 234.0, 234.0, 0.05088980829809214, 0.013716393642845149, 0.029967338284911684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 99.38888888888889, 78, 238, 80.0, 234.4, 238.0, 238.0, 0.1090757045987529, 0.03828775004090339, 0.06169831250795344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75fff359-c4d0-403a-80db-72a83c5fa13b", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.16145135165326185, 0.6161332663092046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 96.5, 78, 234, 80.5, 219.70000000000005, 234.0, 234.0, 0.05089006727666894, 0.013716463445664675, 0.02991779345757295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 80.38888888888889, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.10917692727603566, 0.08113636880572572, 0.054801699824103836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 137.0, 77, 464, 79.5, 259.70000000000033, 464.0, 464.0, 0.10917891391242639, 1.8112492759315086, 0.06377062647467353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 150.38888888888889, 79, 1013, 80.0, 311.9000000000011, 1013.0, 1013.0, 0.1090757045987529, 5.480349945537895, 0.06360382340643425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 99.875, 78, 234, 81.0, 234.0, 234.0, 234.0, 0.0825091017852907, 0.02223878134056663, 0.048506327416743156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 99.1875, 77, 238, 80.0, 236.6, 238.0, 238.0, 0.08250739988242695, 0.02223832262456039, 0.04858590051670259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dddc3605-cf5e-4bea-9645-983f1a76aec2", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 80.56250000000001, 78, 84, 80.0, 83.3, 84.0, 84.0, 0.0825725477243522, 0.061364950017804704, 0.04144754836945022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 111.20000000000002, 79, 237, 81.0, 236.6, 237.0, 237.0, 0.05088929034884609, 0.013616860894124831, 0.029022798402076284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 99.43749999999999, 78, 235, 80.0, 234.3, 235.0, 235.0, 0.08257467847484569, 0.022095177638777067, 0.04709337131768543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 113.2, 79, 238, 81.0, 237.6, 238.0, 238.0, 0.05088877241014315, 0.0378187068399599, 0.025543778338685135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 129.5, 80, 287, 83.0, 284.7, 287.0, 287.0, 0.05017360065827764, 0.039492111455636504, 0.01783514710899713], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 827.75, 78, 2115, 663.5, 1938.6000000000006, 2115.0, 2115.0, 0.10213374413794864, 0.019931373571191475, 0.06950214587252007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c46e5d73-30ba-49d9-a0c9-9a94710c7a20", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1395.9, 956, 2112, 1289.0, 2011.3000000000004, 2107.75, 2112.0, 0.08939945913327224, 0.046271204434213176, 0.04112025903493284], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 261.7692307692308, 78, 616, 211.0, 582.8, 616.0, 616.0, 0.09509388692605353, 0.2029817305441565, 0.06146242511356405], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4f90de76-56dc-4ae8-abae-8a02875c7013", 3, 0, 0.0, 386.6666666666667, 249, 489, 422.0, 489.0, 489.0, 489.0, 0.017175736409698564, 0.023678139223656716, 0.011014388257521542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 226.7, 159, 475, 163.5, 474.4, 475.0, 475.0, 0.05086780474901825, 0.07883516224286324, 0.11440288509471586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3f0189d-2b85-4206-b8aa-711587e1b608", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 80.5, 78, 88, 80.0, 83.80000000000001, 88.0, 88.0, 0.0874264388479381, 0.0649721874641415, 0.04388397418734393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b75900c2-06fd-4b34-95c4-1076db64e874", 3, 0, 0.0, 862.0, 526, 1527, 533.0, 1527.0, 1527.0, 1527.0, 0.020179598425991322, 0.023851602176033364, 0.012940693001042614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 80.0, 78, 88, 79.5, 83.80000000000001, 88.0, 88.0, 0.0874264388479381, 0.023393402582358436, 0.0498603909054647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 555.6666666666667, 456, 701, 544.0, 701.0, 701.0, 701.0, 0.030455461425620146, 8.954916875624972, 0.017369130344298992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f14c8c32-4944-4801-8224-32402ee5a656", 1, 0, 0.0, 2062.0, 2062, 2062, 2062.0, 2062.0, 2062.0, 2062.0, 0.48496605237633367, 0.08761593719689623, 0.3343613603297769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 778.0, 689, 864, 774.5, 864.0, 864.0, 864.0, 0.030393751044785193, 27.348350616613224, 0.017304254745224384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 212.0, 81, 242, 238.0, 242.0, 242.0, 242.0, 0.03048826963825668, 0.053949945883321394, 0.01688168836415189], "isController": false}, {"data": ["addBook", 61, 14, 22.950819672131146, 804.639344262295, 410, 1850, 677.0, 1478.0000000000005, 1581.8, 1850.0, 0.2837314876832627, 73.41614927822896, 1.0344180321244512], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 100.74999999999999, 79, 235, 81.0, 233.6, 235.0, 235.0, 0.0844550013196094, 0.06276392187912379, 0.042392451834257064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 108.87499999999999, 78, 235, 80.0, 234.3, 235.0, 235.0, 0.08438774057098854, 0.03050196531136439, 0.04768443006629712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 165.81249999999997, 78, 841, 80.0, 417.50000000000045, 841.0, 841.0, 0.08445723033070285, 4.771013890905012, 0.049197986222914304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c1abda7-2db0-47c3-b768-536d8d5ac95f", 1, 0, 0.0, 1104.0, 1104, 1104, 1104.0, 1104.0, 1104.0, 1104.0, 0.9057971014492754, 0.16364498414855072, 0.6245046422101449], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 145.53333333333336, 78, 338, 82.0, 319.0, 321.9, 338.0, 0.2703616086515715, 0.200923031429537, 0.13069237918215612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 142.4375, 77, 618, 80.0, 351.3000000000003, 618.0, 618.0, 0.08438729549266359, 1.5721151247086, 0.04923965728209618], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 498.0999999999999, 384, 716, 467.0, 692.3999999999999, 699.95, 716.0, 0.27037866532078175, 79.50030502093182, 0.13598145765644784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 79.5, 79, 82, 79.0, 82.0, 82.0, 82.0, 0.03051338774887482, 0.02267645320009154, 0.017133982378518577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b75900c2-06fd-4b34-95c4-1076db64e874", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.17489260648596322, 0.6674280009680542], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 122.18333333333334, 78, 266, 83.0, 238.0, 239.95, 266.0, 0.2705566703492436, 0.4787584830789349, 0.13157931819719074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 90.375, 78, 236, 80.0, 134.5000000000001, 236.0, 236.0, 0.0874264388479381, 0.023564157345733316, 0.051397183775838615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 534.0666666666667, 79, 1089, 700.0, 987.6, 1089.0, 1089.0, 0.06911869061552499, 37.32332344696062, 0.03707029774027961], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 761.4999999999999, 538, 1091, 769.5, 981.3, 1009.9, 1091.0, 0.26981328920387093, 242.77847190681547, 0.13543362368241177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 104.75, 78, 317, 80.0, 258.90000000000003, 317.0, 317.0, 0.0874269165619365, 0.02356428610458445, 0.051482842467624725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 403.8, 78, 627, 588.0, 626.4, 627.0, 627.0, 0.06911932760718104, 12.201478304019059, 0.03713813872018653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 87.93750000000001, 81, 142, 83.0, 111.90000000000003, 142.0, 142.0, 0.09213193292795283, 0.06882903192371477, 0.03275002303298324], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 775.6666666666667, 81, 2062, 484.5, 1952.5000000000005, 2062.0, 2062.0, 0.09902379046565937, 0.01977574721701889, 0.0670957095879785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 14, 7.6923076923076925, 139.8626373626374, 79, 654, 88.0, 266.1, 365.94999999999993, 594.2399999999991, 0.7496375378937656, 1.5976215612437394, 0.35882590080071175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 94.42857142857143, 80, 235, 83.0, 165.0, 235.0, 235.0, 0.0678334011667345, 0.0525311397707231, 0.024112654320987654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df74afe6-3d6a-4d29-9859-f021754b5e55", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.46013823847262253, 0.8597690021613833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 287.375, 159, 1076, 168.5, 652.5000000000005, 1076.0, 1076.0, 0.084349925666628, 6.429545283059899, 0.1883561023217317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 84.77777777777777, 80, 107, 82.0, 100.70000000000002, 107.0, 107.0, 0.11148341064914312, 0.09047140063421673, 0.039628868629187596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f14c8c32-4944-4801-8224-32402ee5a656", 3, 0, 0.0, 409.6666666666667, 251, 606, 372.0, 606.0, 606.0, 606.0, 0.02103462298944062, 0.028997925898528974, 0.013488999768619146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 740.8499999999999, 135, 2286, 639.0, 1408.5000000000002, 2242.4499999999994, 2286.0, 0.08761592682317791, 0.05381876755056534, 0.039615404413214234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 91.06666666666665, 79, 234, 80.0, 145.20000000000005, 234.0, 234.0, 0.06911805363560962, 0.05136605353193254, 0.03469402301631186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 142.46666666666664, 78, 238, 81.0, 236.8, 238.0, 238.0, 0.06911932760718104, 0.08078321414089285, 0.03593665040826483], "isController": false}, {"data": ["login", 20, 0, 0.0, 2727.0499999999997, 1592, 5170, 2486.5, 3957.4, 5109.449999999999, 5170.0, 0.0894522392131781, 32.226033998000744, 0.17946355492143856], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 282.71428571428567, 159, 1089, 163.5, 780.5, 1089.0, 1089.0, 0.07027794928943973, 6.106627296896726, 0.15677237850699516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 103.25, 79, 237, 83.0, 237.0, 237.0, 237.0, 0.08858082446602371, 0.07171240574446647, 0.031487714946906865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 201.3125, 158, 318, 164.0, 316.6, 318.0, 318.0, 0.0824712510373337, 0.127814331441649, 0.18547977650290967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75fff359-c4d0-403a-80db-72a83c5fa13b", 3, 0, 0.0, 690.6666666666666, 171, 1466, 435.0, 1466.0, 1466.0, 1466.0, 0.038556942177439046, 0.024436968235505802, 0.02472564325831866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f90de76-56dc-4ae8-abae-8a02875c7013", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dddc3605-cf5e-4bea-9645-983f1a76aec2", 3, 0, 0.0, 1021.3333333333334, 616, 1491, 957.0, 1491.0, 1491.0, 1491.0, 0.019418355524198506, 0.022951838837358327, 0.012452526166234068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 96.31249999999999, 81, 272, 84.0, 146.0000000000001, 272.0, 272.0, 0.08674860795593171, 0.07192340640096291, 0.0308364192343351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 637.0666666666667, 160, 1177, 781.0, 1073.8000000000002, 1177.0, 1177.0, 0.06909226581176503, 49.63785396831429, 0.14478338279188027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c46e5d73-30ba-49d9-a0c9-9a94710c7a20", 3, 0, 0.0, 399.66666666666663, 194, 721, 284.0, 721.0, 721.0, 721.0, 0.0345873156784302, 0.028834021957180905, 0.022180016890139157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36770ecc-a78c-43ef-b204-4b7d8ca23d63", 3, 0, 0.0, 912.6666666666666, 269, 2115, 354.0, 2115.0, 2115.0, 2115.0, 0.022630066306094276, 0.031197373309345463, 0.014512119343426342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fa7f02c-767b-4cf0-b838-2ffdce95b30e", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 85.26666666666667, 81, 94, 84.0, 92.8, 94.0, 94.0, 0.06937635283888036, 0.05386152393252919, 0.024661125423195755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fa7f02c-767b-4cf0-b838-2ffdce95b30e", 3, 0, 0.0, 462.66666666666663, 203, 970, 215.0, 970.0, 970.0, 970.0, 0.04652461151949381, 0.029910842366862072, 0.029835118715300393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92c03028-b7dd-4f8e-b8ae-116562534db6", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 546.7, 78, 945, 779.5, 943.9, 945.0, 945.0, 0.04958915386026768, 35.60082838681523, 0.08023370128485498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 257.94444444444446, 159, 1094, 162.0, 397.4000000000011, 1094.0, 1094.0, 0.10902219207287528, 7.405600929944156, 0.24364377907258453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bddaa8c-ae52-48ae-a8b1-dc1907901226", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bddaa8c-ae52-48ae-a8b1-dc1907901226", 3, 0, 0.0, 308.33333333333337, 160, 572, 193.0, 572.0, 572.0, 572.0, 0.05496418167494183, 0.03533667278906579, 0.03524721285795423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 89.68749999999999, 79, 234, 80.0, 127.60000000000011, 234.0, 234.0, 0.09186163341466916, 0.06826826467633128, 0.0461102339600976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 118.06249999999999, 77, 235, 80.0, 234.3, 235.0, 235.0, 0.09186216082767808, 0.03320359597299252, 0.05190795196183127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 215.3125, 78, 843, 234.5, 476.9000000000004, 843.0, 843.0, 0.09186268824674318, 5.189350396229611, 0.05351181009685772], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1172.772727272727, 144, 3152, 1002.5, 1846.8999999999999, 2957.899999999997, 3152.0, 0.09040328081724566, 0.02829918041207459, 0.04078741771246825], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 148.37500000000003, 78, 628, 80.0, 412.4000000000002, 628.0, 628.0, 0.09186268824674318, 1.711379903170985, 0.05360151975334868], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5135730007336757], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.1467351430667645], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.1467351430667645], "isController": false}, {"data": ["401/Unauthorized", 18, 62.06896551724138, 1.3206162876008805], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 29, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
