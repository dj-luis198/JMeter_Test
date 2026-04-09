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

    var data = {"OkPercent": 81.93717277486911, "KoPercent": 18.06282722513089};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5866666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bdce5e2-8fbf-49e5-a6ea-de746677f7f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2505c44-f073-406c-9863-6d303c76962c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.08181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b2505c44-f073-406c-9863-6d303c76962c"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5757575757575758, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2521f9fd-7750-4adb-9eb6-a3a51880e15e"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bef32105-b872-4a4f-a6ee-e4968ec65010"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN="], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/989e03a4-2ad0-457b-9b75-17cbbe703cd9"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16151e80-6197-4b0f-9377-e01dcdad6ab7"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/16151e80-6197-4b0f-9377-e01dcdad6ab7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f70f4c8-d730-4fe2-b67c-b99959abd564"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/books?book=-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1146, 207, 18.06282722513089, 527.3516579406624, 0, 5027, 156.0, 1446.1999999999998, 1861.0, 4155.53, 4.6208745791415495, 630.9674838019899, 2.935601884286607], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 15, 27.272727272727273, 2858.090909090909, 1, 9902, 2461.0, 5158.399999999998, 8047.999999999999, 9902.0, 0.2360423846289199, 222.50566401136868, 0.8784112818603573], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 2, 15.384615384615385, 1011.6923076923076, 0, 2711, 737.0, 2529.0, 2711.0, 2711.0, 0.07447850722155064, 41.19532565906317, 0.13293898813786545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 224.41666666666669, 145, 467, 151.5, 461.3, 467.0, 467.0, 0.08835808586933311, 0.06859831861925764, 0.031408538336364505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 622.4615384615385, 286, 1861, 315.0, 1821.0, 1861.0, 1861.0, 0.12114547708020762, 22.456114250086202, 0.2676903702159185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 191.42857142857142, 144, 442, 149.0, 442.0, 442.0, 442.0, 0.06787220633150724, 0.050440184588161144, 0.03406866606874485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 189.71428571428572, 145, 442, 148.0, 442.0, 442.0, 442.0, 0.06787089017520385, 0.01816076553516197, 0.03870761705304595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bdce5e2-8fbf-49e5-a6ea-de746677f7f6", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 232.28571428571428, 139, 450, 148.0, 450.0, 450.0, 450.0, 0.06787681328058336, 0.018294922329532233, 0.039904142182530446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 10, 10, 100.0, 137.0, 2, 160, 151.5, 159.4, 160.0, 160.0, 0.10446373541425094, 0.05220126309714083, 0.042050734118900625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 228.71428571428572, 141, 443, 149.0, 443.0, 443.0, 443.0, 0.06787352253885759, 0.01829403537180146, 0.039968490323174934], "isController": false}, {"data": ["https://demoqa.com/books", 55, 15, 27.272727272727273, 1428.1818181818185, 0, 4895, 1469.0, 2217.6, 2572.3999999999933, 4895.0, 0.2410937767120946, 209.92485904918092, 0.34622984127262446], "isController": false}, {"data": ["deleteBook", 13, 10, 76.92307692307692, 348.07692307692304, 0, 1009, 153.0, 992.1999999999999, 1009.0, 1009.0, 0.0733319795121731, 0.031245416751280487, 0.03490320178704393], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 10, 76.92307692307692, 348.07692307692304, 0, 1009, 153.0, 992.1999999999999, 1009.0, 1009.0, 0.07342475656869168, 0.0312849473600976, 0.03494736009759845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 15, 68.18181818181819, 978.1363636363636, 0, 5027, 803.0, 2290.0, 4629.949999999994, 5027.0, 0.11936022917164, 0.1508639544315198, 0.029373806397708282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 224.79999999999998, 142, 467, 149.0, 446.0, 467.0, 467.0, 0.10357470843719575, 0.04845624054880785, 0.05791012995173418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 146.42857142857144, 138, 150, 148.0, 150.0, 150.0, 150.0, 0.08034709946970914, 0.02165605415394504, 0.04731377048851036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 149.93333333333334, 142, 159, 151.0, 157.2, 159.0, 159.0, 0.10356827220503756, 0.07696821791800156, 0.051986417884169245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 191.42857142857142, 141, 449, 149.0, 449.0, 449.0, 449.0, 0.08035078858559655, 0.02165704848596157, 0.047237475320829225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 281.8666666666667, 139, 1158, 150.0, 1156.8, 1158.0, 1158.0, 0.10357327809425168, 4.084725099257725, 0.059804127826687384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 416.46666666666664, 144, 1703, 151.0, 1548.2, 1703.0, 1703.0, 0.1033584609236112, 12.424427200329369, 0.059579154493336825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 328.75000000000006, 140, 1279, 147.0, 1258.3000000000002, 1279.0, 1279.0, 0.09083958486309718, 13.64333977884346, 0.052102652515878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 342.0, 139, 1184, 149.0, 1095.2000000000003, 1184.0, 1184.0, 0.09084027252081756, 4.472079627176382, 0.052191758137774415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 178.75000000000003, 143, 496, 150.0, 394.60000000000036, 496.0, 496.0, 0.09083614673065568, 0.06750615982620017, 0.04559548771441116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 144.85714285714286, 139, 149, 146.0, 149.0, 149.0, 149.0, 0.08035078858559655, 0.02150011335200533, 0.045825059115223034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 219.5, 142, 443, 150.0, 440.0, 443.0, 443.0, 0.0908388972157878, 0.047045796051535936, 0.050535050566986116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 148.71428571428572, 143, 152, 150.0, 152.0, 152.0, 152.0, 0.08034709946970914, 0.059711076852000645, 0.04033047766350635], "isController": false}, {"data": ["deleteAccount", 12, 10, 83.33333333333333, 631.3333333333334, 142, 2549, 157.5, 2351.3000000000006, 2549.0, 2549.0, 0.12174954090277285, 24.30118062178505, 0.0884586508121709], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 156.28571428571428, 150, 168, 154.0, 168.0, 168.0, 168.0, 0.07406937125685142, 0.058300696516623285, 0.026329346813958904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 10, 45.45454545454545, 917.5, 0, 4155, 1065.5, 2234.499999999999, 3914.8499999999967, 4155.0, 0.11838076635403383, 0.16034582317680166, 0.029700288149547192], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 491.3076923076923, 1, 2053, 320.0, 1471.3999999999996, 2053.0, 2053.0, 0.07356602833989768, 6.882247845364208, 0.09224490272307484], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 341.7142857142857, 285, 595, 301.0, 595.0, 595.0, 595.0, 0.08020808268307494, 0.12430686251761713, 0.18038985783117345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2505c44-f073-406c-9863-6d303c76962c", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 11, 0, 0.0, 228.54545454545453, 143, 607, 148.0, 601.4, 607.0, 607.0, 0.07344153719813859, 0.05457911114041354, 0.03686420910140941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 15, 0, 0.0, 693.6666666666667, 140, 1331, 824.0, 1235.6000000000001, 1331.0, 1331.0, 0.11451780370121542, 17.97282373228791, 0.057050145437610694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 11, 0, 0.0, 223.72727272727272, 138, 452, 147.0, 446.6, 452.0, 452.0, 0.0735338355917134, 0.07991843175725812, 0.0385687056707957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 15, 0, 0.0, 976.2, 143, 1951, 1320.0, 1925.2, 1951.0, 1951.0, 0.11382780130219006, 54.63962710960859, 0.05659524209276207], "isController": false}, {"data": ["addBook", 55, 39, 70.9090909090909, 1804.0181818181825, 1, 11708, 1116.0, 3088.6, 5718.599999999977, 11708.0, 0.24884738416154265, 77.0815730208715, 0.704734731516295], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 15, 0, 0.0, 205.00000000000003, 140, 450, 147.0, 447.6, 450.0, 450.0, 0.11514546710677824, 0.12304672507100636, 0.05534628799800414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 147.69230769230768, 140, 157, 146.0, 157.0, 157.0, 157.0, 0.11296096764102742, 0.08394853161603698, 0.05670111071043759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 211.84615384615384, 140, 437, 148.0, 433.4, 437.0, 437.0, 0.11294722757997532, 0.030222207379798086, 0.06441521572920468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 211.76923076923077, 138, 441, 144.0, 441.0, 441.0, 441.0, 0.11294722757997532, 0.030442807433665224, 0.06640061621400893], "isController": false}, {"data": ["https://demoqa.com/books-0", 40, 0, 0.0, 216.72499999999997, 139, 625, 150.5, 549.2999999999998, 608.3, 625.0, 0.27545553459032873, 0.20470865412425798, 0.13315477502169212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 212.0, 140, 443, 149.0, 439.4, 443.0, 443.0, 0.11294134000556019, 0.030441220548373647, 0.06650744924155547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 15, 0, 0.0, 177.60000000000002, 143, 595, 150.0, 329.20000000000016, 595.0, 595.0, 0.11474293757219244, 0.08527282762933441, 0.05188083993742685], "isController": false}, {"data": ["https://demoqa.com/books-3", 40, 0, 0.0, 923.8250000000002, 687, 1249, 879.0, 1179.5, 1192.6499999999999, 1249.0, 0.27450092300935364, 80.71238565320927, 0.1380546634275558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2505c44-f073-406c-9863-6d303c76962c", 3, 0, 0.0, 501.33333333333337, 225, 773, 506.0, 773.0, 773.0, 773.0, 0.044585135315885684, 0.029186428099038444, 0.028591379092543875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 11, 0, 0.0, 897.7272727272726, 143, 2096, 1162.0, 2006.2000000000003, 2096.0, 2096.0, 0.07367321241996411, 36.16790930911271, 0.039858359063144645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 6, 0, 0.0, 840.1666666666667, 162, 2024, 434.5, 2024.0, 2024.0, 2024.0, 0.04149951583898188, 12.454569377680176, 0.023208388089638952], "isController": false}, {"data": ["https://demoqa.com/books-1", 40, 0, 0.0, 228.92499999999998, 137, 450, 154.0, 433.9, 445.0, 450.0, 0.2763862497840732, 0.4890741060632234, 0.13441440663327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 11, 0, 0.0, 707.1818181818181, 143, 1340, 876.0, 1315.6000000000001, 1340.0, 1340.0, 0.07345281658163946, 11.789490070514704, 0.03981085273711905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 6, 0, 0.0, 592.5, 148, 1198, 439.0, 1198.0, 1198.0, 1198.0, 0.041580329732014774, 4.082803978198047, 0.023294188629165827], "isController": false}, {"data": ["https://demoqa.com/books-2", 40, 0, 0.0, 1367.8250000000003, 986, 1829, 1334.0, 1759.9, 1786.9499999999998, 1829.0, 0.2733229926134461, 245.93650920415178, 0.1371953302766712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 196.84615384615387, 145, 451, 151.0, 447.4, 451.0, 451.0, 0.12470741721346072, 0.09316520914872799, 0.044329589712597366], "isController": false}, {"data": ["deleteBooks", 12, 10, 83.33333333333333, 191.75, 2, 490, 152.0, 475.30000000000007, 490.0, 490.0, 0.1227269938022868, 0.05480167765243715, 0.05527109242365358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 67, 40.60606060606061, 414.6, 0, 5006, 153.0, 608.4000000000002, 2769.1999999999953, 4960.46, 0.6965905061046659, 1.5948896444960907, 0.244458081610855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 197.42857142857144, 149, 453, 156.0, 453.0, 453.0, 453.0, 0.06637210096144729, 0.051399488342214555, 0.02359320776363947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 429.00000000000006, 288, 599, 312.0, 596.2, 599.0, 599.0, 0.11280315848843768, 0.1748228637901861, 0.2536969472645234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 199.49999999999997, 145, 884, 153.0, 378.6000000000005, 884.0, 884.0, 0.10016464563626461, 0.08128595754271084, 0.035605401378515936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2521f9fd-7750-4adb-9eb6-a3a51880e15e", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 10, 45.45454545454545, 1085.045454545455, 0, 5006, 394.5, 4980.2, 5006.0, 5006.0, 0.11579983472205409, 0.16573234513088012, 0.02855929872672818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 6, 0, 0.0, 196.66666666666666, 138, 444, 150.0, 444.0, 444.0, 444.0, 0.04158321147142194, 0.03090314836889853, 0.02087282294561609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 6, 0, 0.0, 194.0, 140, 442, 146.0, 442.0, 442.0, 442.0, 0.041495784719868874, 0.03187827211552427, 0.022503898874772638], "isController": false}, {"data": ["login", 22, 10, 45.45454545454545, 2489.3636363636356, 0, 5006, 2456.5, 4980.8, 5006.0, 5006.0, 0.1205406797398513, 33.25151142431141, 0.14462955315022108], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 469.1428571428571, 294, 884, 319.0, 884.0, 884.0, 884.0, 0.0677749484426285, 0.10503793279145648, 0.15242744752282564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 2, 15.384615384615385, 131.6153846153846, 1, 178, 152.0, 171.6, 178.0, 178.0, 0.07205169986587298, 0.0753262850836354, 0.02167180035028211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 559.2500000000001, 294, 1429, 303.0, 1410.4, 1429.0, 1429.0, 0.0907344957430399, 18.20885084288566, 0.20019479562054834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bef32105-b872-4a4f-a6ee-e4968ec65010", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.8209150064267352, 1.533880944730077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 175.3846153846154, 146, 436, 152.0, 333.19999999999993, 436.0, 436.0, 0.10833513891898199, 0.08982083295138252, 0.03850975641260688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 15, 15, 100.0, 304.33333333333326, 0, 1396, 1.0, 1192.6000000000001, 1396.0, 1396.0, 0.223463687150838, 0.344288291433892, 0.03063896648044693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 8, 57.142857142857146, 742.7857142857143, 0, 2163, 451.0, 2133.0, 2163.0, 2163.0, 0.07062289392441332, 12.19655801670736, 0.06548972878286487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/989e03a4-2ad0-457b-9b75-17cbbe703cd9", 2, 0, 0.0, 281.0, 247, 315, 281.0, 315.0, 315.0, 315.0, 0.036468400131286244, 0.030734598938769557, 0.022668102230042668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 8, 57.142857142857146, 464.28571428571433, 0, 2795, 150.0, 2783.5, 2795.0, 2795.0, 0.06969924774597612, 0.11729659954795059, 0.010618244773801048], "isController": false}, {"data": ["https://demoqa.com/books?book=", 15, 12, 80.0, 1687.6666666666665, 0, 5007, 1538.0, 4496.400000000001, 5007.0, 5007.0, 0.2242152466367713, 54.07683459454409, 0.08881025784753363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16151e80-6197-4b0f-9377-e01dcdad6ab7", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 35, 22, 62.857142857142854, 564.4571428571429, 0, 2549, 152.0, 1836.6, 2152.199999999998, 2549.0, 0.1760643087463718, 48.352107827756285, 0.16596910354341998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 1, 6.25, 534.9375, 0, 1861, 304.0, 1669.9, 1861.0, 1861.0, 0.10054672280525356, 15.17743698155596, 0.2087829624363728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16151e80-6197-4b0f-9377-e01dcdad6ab7", 3, 0, 0.0, 495.33333333333337, 286, 880, 320.0, 880.0, 880.0, 880.0, 0.04698070658982711, 0.030754622705775492, 0.03012760155662741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f70f4c8-d730-4fe2-b67c-b99959abd564", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/books?book=-1", 3, 0, 0.0, 286.0, 145, 448, 265.0, 448.0, 448.0, 448.0, 1.2140833670578712, 2.148358458114124, 0.5904428874949413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 216.76923076923075, 140, 444, 151.0, 443.2, 444.0, 444.0, 0.12162718461135437, 0.09038895262621159, 0.06105114540062123], "isController": false}, {"data": ["https://demoqa.com/books?book=-0", 3, 0, 0.0, 600.6666666666666, 580, 622, 600.0, 622.0, 622.0, 622.0, 1.1525163273146368, 0.8565087159047252, 0.5638776171724932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 211.76923076923075, 139, 451, 145.0, 443.4, 451.0, 451.0, 0.12132637728770218, 0.06049913554956182, 0.06762633109035082], "isController": false}, {"data": ["https://demoqa.com/books?book=-3", 3, 0, 0.0, 1415.6666666666667, 1151, 1693, 1403.0, 1693.0, 1693.0, 1693.0, 0.9454774661203907, 278.0017678458872, 0.47550868657421996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 377.15384615384613, 140, 1418, 150.0, 1370.3999999999999, 1418.0, 1418.0, 0.1213343040077654, 16.824105947014242, 0.06972712031696254], "isController": false}, {"data": ["register", 22, 15, 68.18181818181819, 978.1363636363636, 0, 5027, 803.0, 2290.0, 4629.949999999994, 5027.0, 0.1191837000037922, 0.15064083247105733, 0.029330363672808238], "isController": true}, {"data": ["https://demoqa.com/books?book=-2", 3, 0, 0.0, 1934.0, 1386, 2680, 1736.0, 2680.0, 2680.0, 2680.0, 0.7869884575026234, 708.1335974390084, 0.3950313155823715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 338.61538461538464, 139, 1324, 148.0, 1262.0, 1324.0, 1324.0, 0.12163970319912419, 5.530220448569797, 0.0700214126814069], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 132, 63.768115942028984, 11.518324607329843], "isController": false}, {"data": ["400/Bad Request", 6, 2.898550724637681, 0.5235602094240838], "isController": false}, {"data": ["406/Not Acceptable", 5, 2.4154589371980677, 0.4363001745200698], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 5, 2.4154589371980677, 0.4363001745200698], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 10, 4.830917874396135, 0.8726003490401396], "isController": false}, {"data": ["401/Unauthorized", 49, 23.67149758454106, 4.275741710296684], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1146, 207, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 132, "401/Unauthorized", 49, "Test failed: code expected to contain /204/", 10, "400/Bad Request", 6, "406/Not Acceptable", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 10, 10, "401/Unauthorized", 9, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 55, 15, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 10, "401/Unauthorized", 9, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 15, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 9, "406/Not Acceptable", 5, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 10, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 67, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 35, "401/Unauthorized", 31, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 10, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 15, 15, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 9, "400/Bad Request", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=", 15, 12, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 11, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 35, 22, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 12, "Test failed: code expected to contain /204/", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
