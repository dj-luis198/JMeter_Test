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

    var data = {"OkPercent": 98.52071005917159, "KoPercent": 1.4792899408284024};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7897255902999362, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd791c9f-94cb-4c3f-ba46-663c92a606b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c275dc93-5caa-4e9c-9c3c-2d5a9ad13040"], "isController": false}, {"data": [0.14912280701754385, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72355c83-6a3e-4298-a0e4-f7487cf73dc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaab1169-c68c-4759-bfa3-d120b602af23"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0dbf763f-5117-4f2b-9640-f851eb892597"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1585dd72-21c3-439f-86c9-afc445b82116"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9768d23e-0b79-4215-93f9-cc5cb4476552"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5aaf32ce-7031-4479-8c46-4f42680188ad"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65104c47-d712-4938-9153-67fd2903736c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9768d23e-0b79-4215-93f9-cc5cb4476552"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4970fc7-94d4-45dd-8bb6-8ba7ac04ee05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47915804-8d1d-4417-8eba-4fd1baff383f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aaab1169-c68c-4759-bfa3-d120b602af23"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b99500b-315a-4a2a-84c9-bfd1d37f50a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=832d3dd2-bb79-4b7f-9074-c2c788a0eb8d"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd791c9f-94cb-4c3f-ba46-663c92a606b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d4970fc7-94d4-45dd-8bb6-8ba7ac04ee05"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/529d9e74-f740-40ea-bce3-119f1d554e44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c275dc93-5caa-4e9c-9c3c-2d5a9ad13040"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=446fbc1a-1537-4c48-a436-cfa40f516ca6"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.296875, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5614035087719298, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.927027027027027, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/72355c83-6a3e-4298-a0e4-f7487cf73dc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65104c47-d712-4938-9153-67fd2903736c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b99500b-315a-4a2a-84c9-bfd1d37f50a4"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/446fbc1a-1537-4c48-a436-cfa40f516ca6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1585dd72-21c3-439f-86c9-afc445b82116"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7ffe21c-7ecd-429b-8592-f92adeb2e6da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dbf763f-5117-4f2b-9640-f851eb892597"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/832d3dd2-bb79-4b7f-9074-c2c788a0eb8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 20, 1.4792899408284024, 356.1427514792898, 96, 3384, 113.0, 997.7, 1204.35, 1610.8700000000006, 5.272352904473701, 731.2099651722971, 3.857092840402134], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/cd791c9f-94cb-4c3f-ba46-663c92a606b6", 3, 0, 0.0, 313.6666666666667, 219, 499, 223.0, 499.0, 499.0, 499.0, 0.019982681675880902, 0.023618853243855327, 0.01281441500699394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c275dc93-5caa-4e9c-9c3c-2d5a9ad13040", 2, 0, 0.0, 212.0, 209, 215, 212.0, 215.0, 215.0, 215.0, 0.03225390272222939, 0.02847414849696813, 0.02004844636982325], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1649.5087719298253, 1230, 2239, 1634.0, 2007.0, 2133.0, 2239.0, 0.25322529054270176, 304.71564337410484, 1.2451067752758822], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72355c83-6a3e-4298-a0e4-f7487cf73dc4", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaab1169-c68c-4759-bfa3-d120b602af23", 1, 0, 0.0, 1112.0, 1112, 1112, 1112.0, 1112.0, 1112.0, 1112.0, 0.8992805755395684, 0.16246768210431653, 0.6200118030575539], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 650.9230769230769, 134, 1693, 503.0, 1389.3999999999996, 1693.0, 1693.0, 0.06511134039207044, 0.012335546910216471, 0.044015696528563845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 650.9230769230769, 134, 1693, 503.0, 1389.3999999999996, 1693.0, 1693.0, 0.06467018207143567, 0.012251968087752462, 0.04371747058750373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dbf763f-5117-4f2b-9640-f851eb892597", 3, 0, 0.0, 361.66666666666663, 213, 629, 243.0, 629.0, 629.0, 629.0, 0.024890894910641687, 0.02496381745432521, 0.015961934561837282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 115.49999999999999, 97, 307, 103.0, 167.70000000000016, 307.0, 307.0, 0.07333293611326272, 0.033390118616024166, 0.04105283752629674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1585dd72-21c3-439f-86c9-afc445b82116", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 115.625, 99, 303, 103.0, 169.30000000000013, 303.0, 303.0, 0.07333125561442426, 0.054497153830641465, 0.03680885291583405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 219.9375, 99, 801, 102.5, 647.0000000000001, 801.0, 801.0, 0.07333226390448473, 2.7125597256915004, 0.04239521506978023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 284.625, 100, 1205, 104.5, 1142.0, 1205.0, 1205.0, 0.07333125561442426, 8.265243519923185, 0.04232301959777807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9768d23e-0b79-4215-93f9-cc5cb4476552", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 224.99999999999997, 126, 303, 224.0, 287.4, 303.0, 303.0, 0.06509960239165924, 0.1358572756943123, 0.04208098547026951], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 103.2173913043478, 100, 107, 103.0, 105.6, 106.8, 107.0, 0.12834463324126, 0.09538111903964733, 0.06442298973242934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 146.0, 97, 309, 103.0, 304.6, 308.2, 309.0, 0.12834391705634857, 0.04272317891142038, 0.07272749308058882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 768.6, 601, 1005, 808.0, 1005.0, 1005.0, 1005.0, 0.027804810232170164, 8.175537414847769, 0.01585743083553455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1004.6, 902, 1211, 998.0, 1211.0, 1211.0, 1211.0, 0.02778997448880342, 25.00546789458985, 0.01582183117868398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 223.6, 102, 314, 296.0, 314.0, 314.0, 314.0, 0.027914403273801215, 0.04939540891809356, 0.01545651040648954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 120.30769230769229, 98, 305, 104.0, 232.19999999999993, 305.0, 305.0, 0.073924540104063, 0.05493806154217964, 0.03710665391942225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 164.53846153846152, 99, 308, 105.0, 306.4, 308.0, 308.0, 0.07384895049279973, 0.036824619393870536, 0.0411628014315335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 325.9230769230769, 100, 1295, 108.0, 1257.3999999999999, 1295.0, 1295.0, 0.07345504268868057, 10.18521044516581, 0.04221237053548726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 227.92307692307693, 100, 808, 106.0, 725.5999999999999, 808.0, 808.0, 0.07374380268427443, 3.352683990787697, 0.04245032752175442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 109.2, 103, 132, 103.0, 132.0, 132.0, 132.0, 0.027914247431889236, 0.020744865523112995, 0.01567450417317999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 665.1875, 102, 1327, 905.0, 1234.6000000000001, 1327.0, 1327.0, 0.07834457904478372, 39.662445227652206, 0.04227087883031543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 146.30434782608697, 98, 910, 102.0, 229.6000000000003, 790.3999999999983, 910.0, 0.12834391705634857, 5.054135717065835, 0.07497263972746449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 516.4375, 97, 918, 766.0, 913.8, 918.0, 918.0, 0.07834611354310506, 12.967190346167406, 0.04234821664659048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 167.08695652173913, 98, 807, 103.0, 307.8, 707.3999999999986, 807.0, 0.12834463324126, 1.6738533557936441, 0.0750983946457967], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 563.6153846153845, 107, 1112, 533.0, 1019.5999999999999, 1112.0, 1112.0, 0.06506376248723748, 0.012326533127464916, 0.04450161939951152], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 464.23076923076917, 205, 1601, 234.0, 1481.3999999999999, 1601.0, 1601.0, 0.07340361258702562, 13.606450280698237, 0.16219706011473548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5aaf32ce-7031-4479-8c46-4f42680188ad", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 601.4285714285713, 144, 1189, 542.0, 1112.0, 1183.0, 1189.0, 0.09015351856303877, 0.055377503101710336, 0.04076277255340523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 105.87499999999999, 100, 134, 104.0, 122.10000000000001, 134.0, 134.0, 0.07834227741000431, 0.05822116514552078, 0.03932415096556857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 140.93749999999997, 100, 306, 103.0, 305.3, 306.0, 306.0, 0.07834381181816401, 0.08715175257555281, 0.04097939863779697], "isController": false}, {"data": ["login", 21, 0, 0.0, 2619.1428571428573, 1548, 4919, 2272.0, 3771.0, 4806.0999999999985, 4919.0, 0.08810203054203726, 25.21654728535618, 0.16771096634292665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 117.52173913043478, 101, 310, 107.0, 124.80000000000001, 273.1999999999995, 310.0, 0.13021423071697089, 0.10541757545348521, 0.04628708982517324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65104c47-d712-4938-9153-67fd2903736c", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9768d23e-0b79-4215-93f9-cc5cb4476552", 3, 0, 0.0, 620.6666666666666, 246, 1149, 467.0, 1149.0, 1149.0, 1149.0, 0.0677629201301048, 0.03066095669949404, 0.043454737192808096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4970fc7-94d4-45dd-8bb6-8ba7ac04ee05", 1, 0, 0.0, 881.0, 881, 881, 881.0, 881.0, 881.0, 881.0, 1.1350737797956867, 0.20506704029511919, 0.782580164585698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47915804-8d1d-4417-8eba-4fd1baff383f", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaab1169-c68c-4759-bfa3-d120b602af23", 3, 0, 0.0, 582.0, 230, 1259, 257.0, 1259.0, 1259.0, 1259.0, 0.0269752636832025, 0.027054292776024388, 0.017298590317678688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 796.8750000000001, 205, 1431, 1009.5, 1360.3000000000002, 1431.0, 1431.0, 0.07830278708982798, 52.74660503125994, 0.16483539591846721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b99500b-315a-4a2a-84c9-bfd1d37f50a4", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=832d3dd2-bb79-4b7f-9074-c2c788a0eb8d", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 433.56250000000006, 203, 1304, 306.5, 1250.1000000000001, 1304.0, 1304.0, 0.07329665446582773, 11.060431158980444, 0.1625016892588334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 828.4285714285714, 102, 1315, 1008.0, 1315.0, 1315.0, 1315.0, 0.038883488404388274, 33.23023711984447, 0.06998810929037634], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1233.3636363636365, 247, 3206, 1164.5, 2137.5999999999995, 3064.099999999998, 3206.0, 0.08920389577741196, 0.02820883138841809, 0.04024628891519953], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 108.0625, 103, 121, 106.5, 118.9, 121.0, 121.0, 0.09714396735962698, 0.07541938872158539, 0.034531644647367396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 294.69565217391306, 206, 1015, 209.0, 413.0, 894.5999999999983, 1015.0, 0.12827090815802974, 6.862177701915141, 0.2870573520841234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 321.8571428571429, 202, 606, 307.5, 509.5, 606.0, 606.0, 0.08770995570647237, 0.13593330049430827, 0.19726174608594324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 130.46666666666667, 99, 307, 103.0, 299.8, 307.0, 307.0, 0.06791263718352712, 0.05047023134439856, 0.03408896046126263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 115.0, 96, 305, 102.0, 185.00000000000006, 305.0, 305.0, 0.06791478957734362, 0.018172512054875148, 0.03873265343082879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 154.86666666666665, 97, 304, 103.0, 304.0, 304.0, 304.0, 0.06791509707331207, 0.018305241008041147, 0.03992664886536511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 154.6, 98, 306, 102.0, 304.2, 306.0, 306.0, 0.06791448208415962, 0.01830507524924615, 0.039992610055418217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 2.7562792056074765, 5.777234228971963], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1136.0877192982457, 789, 1818, 1046.0, 1548.8000000000002, 1699.8999999999999, 1818.0, 0.24841363921623316, 297.18907505687366, 0.4905199008742417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1233.3636363636365, 247, 3206, 1164.5, 2137.5999999999995, 3064.099999999998, 3206.0, 0.08686347825056955, 0.027468724212404896, 0.03919035835133119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd791c9f-94cb-4c3f-ba46-663c92a606b6", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 101.5, 97, 106, 102.0, 106.0, 106.0, 106.0, 0.04817187725805675, 0.012983826292210607, 0.028366837877547086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 102.375, 97, 110, 102.5, 110.0, 110.0, 110.0, 0.04817187725805675, 0.012983826292210607, 0.028319795028662265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4970fc7-94d4-45dd-8bb6-8ba7ac04ee05", 3, 0, 0.0, 860.3333333333334, 224, 1990, 367.0, 1990.0, 1990.0, 1990.0, 0.022646807932421926, 0.026767760287312505, 0.0145228553472888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 218.6875, 98, 972, 103.0, 923.0, 972.0, 972.0, 0.0930384016002605, 10.486456825093619, 0.05369696811108785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 189.50000000000003, 97, 802, 102.5, 668.3000000000002, 802.0, 802.0, 0.09304110672396448, 3.441589629114888, 0.053789389824791964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/529d9e74-f740-40ea-bce3-119f1d554e44", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 102.1875, 98, 106, 102.5, 106.0, 106.0, 106.0, 0.0930356966338522, 0.06914078626793117, 0.046699558661914095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 125.625, 100, 293, 101.5, 293.0, 293.0, 293.0, 0.04814781378833017, 0.012883301736330535, 0.027459300051157053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 152.9375, 97, 309, 103.0, 306.9, 309.0, 309.0, 0.0930384016002605, 0.042362455806759236, 0.052084241911473955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 103.375, 98, 111, 103.0, 111.0, 111.0, 111.0, 0.04817158719358354, 0.03579939243585652, 0.02417987872802924], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 757.0833333333334, 102, 1990, 499.5, 1852.9000000000005, 1990.0, 1990.0, 0.06751016871916332, 0.012685626592818043, 0.045946251708851145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 159.25, 100, 321, 106.5, 321.0, 321.0, 321.0, 0.04702286486804208, 0.03701213777699407, 0.016715158996061835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c275dc93-5caa-4e9c-9c3c-2d5a9ad13040", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=446fbc1a-1537-4c48-a436-cfa40f516ca6", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1440.904761904762, 753, 3384, 1307.0, 2449.2000000000003, 3292.699999999999, 3384.0, 0.08848960879165332, 0.04580028580036744, 0.0407017634188171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 232.0, 200, 404, 207.5, 404.0, 404.0, 404.0, 0.04811769588413259, 0.07457303063292815, 0.10821782580191149], "isController": false}, {"data": ["addBook", 64, 11, 17.1875, 1035.4218750000005, 521, 2476, 856.5, 1811.5, 1980.0, 2476.0, 0.3000665772718322, 90.89031094106036, 1.0914775231379463], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 176.3508771929824, 100, 419, 105.0, 412.2, 417.1, 419.0, 0.2495862123321861, 0.18548350350077505, 0.120649585062922], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 663.3684210526316, 475, 923, 609.0, 827.2000000000002, 909.0, 923.0, 0.24925551313838928, 73.28939692464611, 0.12535799733034225], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 156.57894736842104, 98, 546, 106.0, 304.8, 327.59999999999945, 546.0, 0.24997587952039715, 0.4423401305575778, 0.12157030078238065], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 957.5087719298247, 686, 1513, 907.0, 1207.2, 1302.2, 1513.0, 0.24891264476235392, 223.97203529892442, 0.12494247989047844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 108.28571428571429, 101, 122, 107.0, 118.5, 122.0, 122.0, 0.08570973785064466, 0.06403120064037418, 0.03046713337659634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 11, 5.945945945945946, 170.24324324324328, 98, 1262, 109.0, 307.8, 358.99999999999966, 1047.8599999999965, 0.7601219482130971, 1.5785731445320526, 0.36758219845756873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 107.0, 104, 113, 106.0, 113.0, 113.0, 113.0, 0.06926806742091896, 0.05364216549295774, 0.024622633341029786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72355c83-6a3e-4298-a0e4-f7487cf73dc4", 3, 0, 0.0, 739.0, 193, 1533, 491.0, 1533.0, 1533.0, 1533.0, 0.042731390479446206, 0.02708268791128963, 0.027402616941571943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 134.18749999999997, 103, 305, 107.0, 295.90000000000003, 305.0, 305.0, 0.07435427955350256, 0.06034024053609435, 0.02643062281003411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65104c47-d712-4938-9153-67fd2903736c", 3, 0, 0.0, 306.6666666666667, 206, 491, 223.0, 491.0, 491.0, 491.0, 0.022564195135159528, 0.027066751000345984, 0.014469877739669358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 300.7333333333333, 201, 614, 210.0, 603.2, 614.0, 614.0, 0.06788098201153976, 0.10520226411358752, 0.15266591950446884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b99500b-315a-4a2a-84c9-bfd1d37f50a4", 3, 0, 0.0, 359.6666666666667, 231, 455, 393.0, 455.0, 455.0, 455.0, 0.03491904601166296, 0.022449581989920035, 0.02239274760513543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 348.4375, 201, 1070, 209.5, 1025.9, 1070.0, 1070.0, 0.09298000929800093, 14.030640272692933, 0.2061404942468619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/446fbc1a-1537-4c48-a436-cfa40f516ca6", 3, 0, 0.0, 594.0, 303, 979, 500.0, 979.0, 979.0, 979.0, 0.024362909905959167, 0.028796134722831292, 0.015623350427975117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1585dd72-21c3-439f-86c9-afc445b82116", 3, 0, 0.0, 437.0, 264, 696, 351.0, 696.0, 696.0, 696.0, 0.02295543584720862, 0.027132548034249512, 0.01472077103483105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7ffe21c-7ecd-429b-8592-f92adeb2e6da", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.7732105024213075, 1.444745006053269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dbf763f-5117-4f2b-9640-f851eb892597", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 166.23076923076923, 103, 449, 108.0, 397.79999999999995, 449.0, 449.0, 0.07327493884360874, 0.06075236628732795, 0.026046950917064045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/832d3dd2-bb79-4b7f-9074-c2c788a0eb8d", 3, 0, 0.0, 382.3333333333333, 234, 464, 449.0, 464.0, 464.0, 464.0, 0.048310734645238176, 0.031059147436310348, 0.030980516683307032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 122.12499999999999, 101, 309, 107.0, 185.10000000000014, 309.0, 309.0, 0.07499238358604204, 0.05822162592861663, 0.026657448852850884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 117.21428571428571, 101, 299, 103.0, 203.5, 299.0, 299.0, 0.08776769145894979, 0.06522579414087969, 0.04405526700185566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 187.35714285714286, 99, 306, 103.0, 305.5, 306.0, 306.0, 0.08776769145894979, 0.0234847143161643, 0.050055011535182305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 172.64285714285714, 99, 307, 103.5, 306.5, 307.0, 307.0, 0.08776769145894979, 0.02365613558854506, 0.05159780298660916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 130.99999999999997, 98, 305, 103.0, 304.0, 305.0, 305.0, 0.08776714123613749, 0.023655987286302683, 0.05168318961463956], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.3698224852071006], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07396449704142012], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07396449704142012], "isController": false}, {"data": ["401/Unauthorized", 13, 65.0, 0.9615384615384616], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 20, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
