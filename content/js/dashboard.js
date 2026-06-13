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

    var data = {"OkPercent": 97.81297134238311, "KoPercent": 2.1870286576168927};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.805699481865285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3482142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ece1441f-70f2-4fec-bd12-deafe085812b"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b638b7b-06e0-4971-9ef2-22f129a26040"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/80741242-10c4-49f9-aca1-e7328758eb44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/15953769-4a3d-4b02-99a6-1fdb28264fb2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5585baa3-890c-4baa-82f1-41d731b4147a"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=490eddd1-ad6e-4cbd-95c8-19ce58461bcf"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e698983f-18f2-4a67-9ccd-4433ae8eb4c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/40f2e76f-30bb-4bd1-a91c-5462c07fb603"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3844512-6559-4d40-9b42-f1dff645317a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7237323e-6ed0-4cbc-b5bc-609b70354b59"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96d9edfa-00b4-47a9-9457-c6eed9b98e27"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c22d6a5c-28e8-42fb-9903-debecbdf2dc2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e698983f-18f2-4a67-9ccd-4433ae8eb4c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5867c41-18ed-4673-82ae-8ad096d5af12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c22d6a5c-28e8-42fb-9903-debecbdf2dc2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/490eddd1-ad6e-4cbd-95c8-19ce58461bcf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15953769-4a3d-4b02-99a6-1fdb28264fb2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5585baa3-890c-4baa-82f1-41d731b4147a"], "isController": false}, {"data": [0.35, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8482142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9147727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b638b7b-06e0-4971-9ef2-22f129a26040"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd1a4b31-8b8b-4452-8318-b942bd2362a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fabde078-9e70-4d17-8e4c-239fdb53a741"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80741242-10c4-49f9-aca1-e7328758eb44"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ece1441f-70f2-4fec-bd12-deafe085812b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3844512-6559-4d40-9b42-f1dff645317a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7237323e-6ed0-4cbc-b5bc-609b70354b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96d9edfa-00b4-47a9-9457-c6eed9b98e27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40f2e76f-30bb-4bd1-a91c-5462c07fb603"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 29, 2.1870286576168927, 305.7805429864257, 79, 3129, 92.0, 875.0, 1036.0, 1516.0300000000002, 5.157205308109958, 719.8799275849714, 3.775510433520279], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1362.5892857142856, 970, 1938, 1314.0, 1683.0000000000002, 1723.1999999999998, 1938.0, 0.2556295562544792, 307.60930160635786, 1.2569285309973661], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ece1441f-70f2-4fec-bd12-deafe085812b", 3, 0, 0.0, 1228.0, 180, 2914, 590.0, 2914.0, 2914.0, 2914.0, 0.0319461600715594, 0.026632199200281127, 0.02048630707713933], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 426.9285714285715, 83, 971, 424.0, 747.5, 971.0, 971.0, 0.08618566855454322, 0.0169774224328983, 0.05799016175203152], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 426.9285714285715, 83, 971, 424.0, 747.5, 971.0, 971.0, 0.08900530217300087, 0.01753285249278421, 0.05988735663788828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 102.625, 79, 245, 82.0, 244.3, 245.0, 245.0, 0.0963159162051529, 0.02577203226583193, 0.054930170960751264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 94.18750000000001, 81, 246, 83.5, 136.80000000000013, 246.0, 246.0, 0.09631533641141096, 0.07157809668855833, 0.04834578409713401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 122.375, 80, 247, 83.0, 245.6, 247.0, 247.0, 0.09631533641141096, 0.025959993017138108, 0.05671694126570391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 112.68750000000001, 80, 246, 82.5, 244.6, 246.0, 246.0, 0.0963159162051529, 0.025960149289670116, 0.056623224175294966], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 201.0, 81, 410, 187.0, 383.0, 410.0, 410.0, 0.08502292784954343, 0.1640510750440702, 0.05495492367775177], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b638b7b-06e0-4971-9ef2-22f129a26040", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80741242-10c4-49f9-aca1-e7328758eb44", 3, 0, 0.0, 1248.3333333333333, 201, 3129, 415.0, 3129.0, 3129.0, 3129.0, 0.019931833130693032, 0.023558751984878383, 0.01278180705321135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 92.0, 80, 242, 83.0, 99.20000000000002, 234.8999999999999, 242.0, 0.10105144023565196, 0.07509779884700306, 0.050723086212036236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 130.65, 80, 251, 83.0, 244.70000000000002, 250.7, 251.0, 0.10096930533117933, 0.03459973558663166, 0.05716006474656704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 641.0, 634, 648, 640.0, 648.0, 648.0, 648.0, 0.06481421468319737, 19.057531151331933, 0.036964356811511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 911.7142857142857, 805, 1025, 892.0, 1025.0, 1025.0, 1025.0, 0.06468245534600493, 58.201387019963775, 0.036826046354219606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 104.57142857142857, 80, 239, 81.0, 239.0, 239.0, 239.0, 0.06515567552473589, 0.1152950039558803, 0.03607741017824731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 93.73333333333333, 81, 242, 83.0, 149.00000000000006, 242.0, 242.0, 0.07328369584334878, 0.054461809117957435, 0.036784980140118426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15953769-4a3d-4b02-99a6-1fdb28264fb2", 3, 0, 0.0, 669.0, 208, 1508, 291.0, 1508.0, 1508.0, 1508.0, 0.06454527851287678, 0.029205057660448806, 0.04139134071301018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 105.86666666666667, 81, 244, 82.0, 243.4, 244.0, 244.0, 0.0732847699591071, 0.019609401336714204, 0.041795220367303265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 110.13333333333334, 80, 295, 83.0, 263.20000000000005, 295.0, 295.0, 0.07328584410635242, 0.0197528251692903, 0.04308406069533609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 129.20000000000002, 80, 300, 84.0, 267.6, 300.0, 300.0, 0.07328441191702251, 0.019752439149509974, 0.043154785533168524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 83.85714285714286, 81, 88, 83.0, 88.0, 88.0, 88.0, 0.0651514305392677, 0.048418201797248754, 0.03658405523445208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5585baa3-890c-4baa-82f1-41d731b4147a", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 642.5625, 80, 1223, 887.0, 1087.2, 1223.0, 1223.0, 0.07136421619789296, 40.14074256975852, 0.0381213147072729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 123.25, 80, 733, 82.0, 228.80000000000032, 708.5499999999997, 733.0, 0.10105092966855295, 4.572164771435428, 0.05897269098625708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 441.4375, 81, 800, 593.0, 752.4000000000001, 800.0, 800.0, 0.0713645345025223, 13.121927282884554, 0.03819117666736545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 142.65, 79, 651, 82.0, 246.4, 630.7999999999997, 651.0, 0.10105092966855295, 1.5114909906780518, 0.05907137353476152], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 535.1428571428571, 93, 1894, 408.0, 1367.0, 1894.0, 1894.0, 0.08924473456066091, 0.017580017466469477, 0.06062117920980162], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=490eddd1-ad6e-4cbd-95c8-19ce58461bcf", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 248.13333333333333, 165, 543, 170.0, 415.20000000000005, 543.0, 543.0, 0.07325363338021566, 0.1135288243890647, 0.16474913835413738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 670.0, 115, 1710, 556.0, 1387.3999999999996, 1679.2499999999995, 1710.0, 0.08932269039943483, 0.05486716041137159, 0.04038711489740071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.31250000000001, 82, 86, 83.0, 85.3, 86.0, 86.0, 0.07135307732443798, 0.053027042816305964, 0.03581590014136828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 129.6875, 81, 335, 83.5, 274.1000000000001, 335.0, 335.0, 0.07136389789610308, 0.0860861864025013, 0.03695381529239127], "isController": false}, {"data": ["login", 22, 0, 0.0, 2919.636363636363, 1616, 5128, 2858.5, 4272.999999999999, 5062.299999999999, 5128.0, 0.09200709291043527, 35.14722817523796, 0.1873631655876744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 86.0, 82, 92, 85.5, 91.7, 92.0, 92.0, 0.09967853671908096, 0.08069678412120909, 0.03543260484936081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 730.1249999999999, 165, 1309, 977.0, 1172.5000000000002, 1309.0, 1309.0, 0.07132635820988673, 53.3734041423897, 0.14900870293017596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e698983f-18f2-4a67-9ccd-4433ae8eb4c4", 3, 0, 0.0, 323.3333333333333, 172, 502, 296.0, 502.0, 502.0, 502.0, 0.03248124208269724, 0.027078275056571496, 0.020829442351208843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 248.75000000000003, 163, 492, 173.5, 381.4000000000001, 492.0, 492.0, 0.09626665864444511, 0.14919451881712342, 0.21650597154116902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 678.7272727272727, 81, 1114, 951.0, 1101.4, 1114.0, 1114.0, 0.10156033607238482, 77.32899922675654, 0.17020192329886435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40f2e76f-30bb-4bd1-a91c-5462c07fb603", 3, 0, 0.0, 706.0, 189, 1524, 405.0, 1524.0, 1524.0, 1524.0, 0.03351580828957658, 0.027940750335158082, 0.021492884873198524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3844512-6559-4d40-9b42-f1dff645317a", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7237323e-6ed0-4cbc-b5bc-609b70354b59", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96d9edfa-00b4-47a9-9457-c6eed9b98e27", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 874.5652173913044, 96, 1560, 876.0, 1428.6000000000001, 1536.1999999999996, 1560.0, 0.09378338484623602, 0.02925952411048498, 0.042312425584922896], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c22d6a5c-28e8-42fb-9903-debecbdf2dc2", 3, 0, 0.0, 559.3333333333334, 185, 1100, 393.0, 1100.0, 1100.0, 1100.0, 0.03403058214982531, 0.028369896121647985, 0.021822997016652298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 272.45000000000005, 165, 818, 174.0, 469.0000000000003, 801.2499999999998, 818.0, 0.10092752394505505, 6.185817388361542, 0.2256972041814273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 90.66666666666666, 83, 122, 88.0, 109.4, 122.0, 122.0, 0.091690404293556, 0.071185421302126, 0.032593073401224984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e698983f-18f2-4a67-9ccd-4433ae8eb4c4", 1, 0, 0.0, 1894.0, 1894, 1894, 1894.0, 1894.0, 1894.0, 1894.0, 0.5279831045406547, 0.09538757259767688, 0.3640196013727561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5867c41-18ed-4673-82ae-8ad096d5af12", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c22d6a5c-28e8-42fb-9903-debecbdf2dc2", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 360.1764705882353, 165, 1043, 170.0, 979.8, 1043.0, 1043.0, 0.09036544850498339, 19.193303571428572, 0.19915386212624583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/490eddd1-ad6e-4cbd-95c8-19ce58461bcf", 3, 0, 0.0, 373.3333333333333, 253, 502, 365.0, 502.0, 502.0, 502.0, 0.04053889707174033, 0.033795610482007486, 0.025996623447698066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 82.125, 80, 84, 82.5, 84.0, 84.0, 84.0, 0.03958847777354401, 0.02942073397037792, 0.019871560132423458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 121.25, 80, 245, 81.5, 245.0, 245.0, 245.0, 0.039558331231796987, 0.010584944099133178, 0.02256061078063422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 141.875, 81, 242, 83.0, 242.0, 242.0, 242.0, 0.03955774441741332, 0.010662048300005934, 0.023255627089143378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 140.625, 79, 244, 82.5, 244.0, 244.0, 244.0, 0.039589457327513684, 0.010670595920306421, 0.023312932391104248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 0.07681671531725304, 0.022654929712705482, 0.04748533280841911], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 943.035714285714, 637, 1599, 882.5, 1296.8, 1385.8999999999999, 1599.0, 0.26592713596474565, 318.14130584469854, 0.5251022157428864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 874.5652173913044, 96, 1560, 876.0, 1428.6000000000001, 1536.1999999999996, 1560.0, 0.08952656019493435, 0.027931435305382883, 0.0403918660254489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 117.66666666666669, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.0538081202432127, 0.014502969909303425, 0.03168583643228248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 81.77777777777777, 81, 82, 82.0, 82.0, 82.0, 82.0, 0.053859641773538164, 0.014516856571773958, 0.031663578464521454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 81.93333333333334, 80, 84, 82.0, 83.4, 84.0, 84.0, 0.09166350936801065, 0.024706180259346622, 0.05388811781205314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 103.99999999999999, 80, 243, 83.0, 242.4, 243.0, 243.0, 0.09166406951803033, 0.024706331237281613, 0.053977962811887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 100.26666666666667, 81, 333, 83.0, 191.4000000000001, 333.0, 333.0, 0.0916601486116543, 0.06811852841159073, 0.04600909803358428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 118.33333333333331, 80, 250, 82.0, 250.0, 250.0, 250.0, 0.05380779854360225, 0.01439778984467482, 0.03068726010689816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 103.73333333333332, 81, 243, 83.0, 241.8, 243.0, 243.0, 0.09166350936801065, 0.024527149967612228, 0.05227684518644358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 118.55555555555556, 81, 246, 83.0, 246.0, 246.0, 246.0, 0.053859319457576806, 0.04002631065157808, 0.027034853712103984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 86.33333333333333, 83, 95, 85.0, 95.0, 95.0, 95.0, 0.056004281216164076, 0.04408149478537915, 0.019907771838558325], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 587.8571428571428, 81, 1508, 467.0, 1434.0, 1508.0, 1508.0, 0.08913507146722695, 0.017210231432846276, 0.060658604717792], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1412.7727272727273, 958, 2764, 1355.0, 1805.4, 2620.299999999998, 2764.0, 0.08963092429853617, 0.04639100574045329, 0.04122672396934623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 238.0, 164, 496, 165.0, 496.0, 496.0, 496.0, 0.053781110878723594, 0.08335021773880308, 0.12095497886103558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15953769-4a3d-4b02-99a6-1fdb28264fb2", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5585baa3-890c-4baa-82f1-41d731b4147a", 3, 0, 0.0, 621.6666666666667, 184, 1360, 321.0, 1360.0, 1360.0, 1360.0, 0.03573853686430077, 0.029258600329985826, 0.022918267455297046], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 836.5000000000001, 418, 2215, 674.0, 1454.1, 1600.6, 2215.0, 0.25734836819688867, 72.8308322177103, 0.936728792617962], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 158.9285714285714, 80, 390, 84.0, 334.3, 350.15, 390.0, 0.266844563042028, 0.19830928952635088, 0.12899224482988658], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 508.44642857142856, 396, 764, 480.5, 652.0, 719.9, 764.0, 0.26674414949104264, 78.4316366897051, 0.13415355174598337], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 129.94642857142856, 80, 324, 85.0, 247.3, 254.54999999999995, 324.0, 0.26715900254278124, 0.47274620371828086, 0.12992693678350103], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 783.2321428571428, 553, 1270, 745.5, 1000.9000000000001, 1059.95, 1270.0, 0.26634451663226383, 239.65726424943165, 0.13369246245017932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 85.88235294117646, 82, 92, 85.0, 90.4, 92.0, 92.0, 0.09098888865100944, 0.06797509747853732, 0.03234370651266351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, 7.386363636363637, 141.8238636363637, 81, 1256, 87.0, 260.0000000000001, 301.50000000000006, 1081.2099999999978, 0.722846042007212, 1.533015659268447, 0.3475816808326694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 85.25, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.041389015355324695, 0.032052235524191876, 0.014712501552088074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b638b7b-06e0-4971-9ef2-22f129a26040", 3, 0, 0.0, 312.66666666666663, 170, 570, 198.0, 570.0, 570.0, 570.0, 0.021588791099661057, 0.025517220209267347, 0.013844374500759205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd1a4b31-8b8b-4452-8318-b942bd2362a3", 2, 0, 0.0, 192.0, 183, 201, 192.0, 201.0, 201.0, 201.0, 0.014942099364960777, 0.029103532405678, 0.009287740474411655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 97.75000000000001, 83, 247, 85.5, 143.4000000000001, 247.0, 247.0, 0.09658686177212744, 0.07838250208265421, 0.03433361102056093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fabde078-9e70-4d17-8e4c-239fdb53a741", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.8630701013513513, 1.6126478040540542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 245.25, 164, 330, 244.5, 330.0, 330.0, 330.0, 0.039541125241571565, 0.06128102124841218, 0.0889289174134173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80741242-10c4-49f9-aca1-e7328758eb44", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 205.8, 163, 576, 167.0, 426.6000000000001, 576.0, 576.0, 0.09161480250902405, 0.14198505037287223, 0.2060438380647289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ece1441f-70f2-4fec-bd12-deafe085812b", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 108.86666666666667, 82, 257, 85.0, 248.0, 257.0, 257.0, 0.07181259784466455, 0.05953993708019552, 0.025527134390095605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 86.3125, 83, 95, 85.5, 93.6, 95.0, 95.0, 0.07091758490164617, 0.0550580859343835, 0.02520898525800704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3844512-6559-4d40-9b42-f1dff645317a", 3, 0, 0.0, 343.6666666666667, 189, 432, 410.0, 432.0, 432.0, 432.0, 0.034702942809550254, 0.028930415538821027, 0.022254165799093097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7237323e-6ed0-4cbc-b5bc-609b70354b59", 3, 0, 0.0, 407.0, 177, 844, 200.0, 844.0, 844.0, 844.0, 0.043089209025752986, 0.027702209578731166, 0.02763207740258248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96d9edfa-00b4-47a9-9457-c6eed9b98e27", 3, 0, 0.0, 245.0, 167, 381, 187.0, 381.0, 381.0, 381.0, 0.028739761459979883, 0.028655562940077595, 0.01843012046750012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 112.47058823529412, 80, 248, 84.0, 244.8, 248.0, 248.0, 0.0904058157529475, 0.06718635330858695, 0.045379481735366226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 138.8235294117647, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.09040725810740383, 0.048153498229081354, 0.050220484024505685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40f2e76f-30bb-4bd1-a91c-5462c07fb603", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 236.9411764705882, 80, 880, 83.0, 815.1999999999999, 880.0, 880.0, 0.09040677731747138, 14.375627986415052, 0.05177823815804169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 189.99999999999997, 80, 643, 82.0, 643.0, 643.0, 643.0, 0.09040773890245005, 4.711163477799582, 0.051867077689497276], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.6033182503770739], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.15082956259426847], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.15082956259426847], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.2820512820512822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 29, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
