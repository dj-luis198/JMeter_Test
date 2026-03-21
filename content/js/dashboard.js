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

    var data = {"OkPercent": 97.99382716049382, "KoPercent": 2.006172839506173};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7547666009204471, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b927416e-7c0f-4bf8-832e-0e5708927f02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8169292-72ad-4779-81b9-e77c31f0f777"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=279579ad-112e-4b06-ac16-af65f42e387d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28fe5f7c-91d0-4242-ade0-c192dc58a16c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c339b6cc-e3c9-460a-82ac-99d714a5d760"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37dde45d-06f9-4b4c-8c8a-1c449fb7025d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9689829-4070-4d24-80f3-720b16899eb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d56c972-fcf1-472d-8f2a-2ba9e594f6e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a7ffe4f-cfd9-4381-adf7-88ae678811b2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/37dde45d-06f9-4b4c-8c8a-1c449fb7025d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df108b83-1447-4f5a-b343-e8dc811ea570"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1ea9b4c-fd83-4dda-bfe8-88c720449b30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8169292-72ad-4779-81b9-e77c31f0f777"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a603089-9756-4d6b-bbe0-d0da8b3e7c84"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9689829-4070-4d24-80f3-720b16899eb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d768f1ae-29d1-4ed7-a169-2d21908db4d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b927416e-7c0f-4bf8-832e-0e5708927f02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28fe5f7c-91d0-4242-ade0-c192dc58a16c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c339b6cc-e3c9-460a-82ac-99d714a5d760"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acc8ae56-bccf-4ad1-a538-57db0351bbd8"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a7ffe4f-cfd9-4381-adf7-88ae678811b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1ea9b4c-fd83-4dda-bfe8-88c720449b30"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f7871c3-30fc-4b9b-82b4-b04fa0f73b75"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.937125748502994, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f7871c3-30fc-4b9b-82b4-b04fa0f73b75"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/279579ad-112e-4b06-ac16-af65f42e387d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d768f1ae-29d1-4ed7-a169-2d21908db4d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a603089-9756-4d6b-bbe0-d0da8b3e7c84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df108b83-1447-4f5a-b343-e8dc811ea570"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6569847f-b270-4d1b-aca3-1117a3627219"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 26, 2.006172839506173, 415.23688271604937, 131, 2134, 157.5, 1059.3, 1250.4499999999996, 1650.7499999999993, 5.129788396228656, 732.5560778381564, 3.7424265982101157], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2010.7636363636366, 1585, 2759, 2020.0, 2316.4, 2421.399999999999, 2759.0, 0.23103322257740663, 278.0106040967441, 1.135988550466057], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b927416e-7c0f-4bf8-832e-0e5708927f02", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8169292-72ad-4779-81b9-e77c31f0f777", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.5329323377581121, 2.033785029498525], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 581.625, 144, 1225, 481.0, 1185.1000000000001, 1225.0, 1225.0, 0.084112247794682, 0.0169980256621211, 0.05641537420750491], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 581.625, 144, 1225, 481.0, 1185.1000000000001, 1225.0, 1225.0, 0.08239904829099223, 0.016651809624723835, 0.055266305033551864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 165.65, 132, 428, 139.5, 368.7000000000005, 426.25, 428.0, 0.1252261898053359, 0.04291198242450426, 0.070892209209134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=279579ad-112e-4b06-ac16-af65f42e387d", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 168.05, 134, 400, 143.0, 369.8000000000005, 399.7, 400.0, 0.12522932620361035, 0.09306593480561279, 0.06285925162954661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 223.14999999999998, 132, 1000, 141.5, 425.20000000000005, 971.2999999999996, 1000.0, 0.12522148550248252, 1.873027272456908, 0.07320076291190042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 214.35000000000002, 132, 1176, 134.5, 395.7, 1136.9999999999995, 1176.0, 0.1252308944616637, 5.66621490599856, 0.07308396731473654], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 261.88235294117646, 140, 497, 248.0, 463.4, 497.0, 497.0, 0.08269447795462505, 0.15435384146252482, 0.053446436780071604], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28fe5f7c-91d0-4242-ade0-c192dc58a16c", 3, 0, 0.0, 342.3333333333333, 241, 493, 293.0, 493.0, 493.0, 493.0, 0.02393107849393746, 0.02828572461311423, 0.015346427289406508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c339b6cc-e3c9-460a-82ac-99d714a5d760", 3, 0, 0.0, 323.3333333333333, 243, 469, 258.0, 469.0, 469.0, 469.0, 0.05275652862041678, 0.03391736459157654, 0.03383149784577508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37dde45d-06f9-4b4c-8c8a-1c449fb7025d", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 194.43749999999997, 133, 432, 143.0, 406.8, 432.0, 432.0, 0.07233305756355138, 0.05375532891197519, 0.03630780428482949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 175.4375, 131, 453, 143.5, 414.50000000000006, 453.0, 453.0, 0.07233796296296297, 0.039727599532515916, 0.04011613351327402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 845.2857142857142, 660, 975, 921.0, 975.0, 975.0, 975.0, 0.054814687203902805, 16.117338056858493, 0.03126150129597582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1191.7142857142856, 972, 1352, 1280.0, 1352.0, 1352.0, 1352.0, 0.05479366272152295, 49.303434033811605, 0.03119600133461707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 290.4285714285714, 136, 417, 396.0, 417.0, 417.0, 417.0, 0.055154590437769865, 0.09759777136058495, 0.030539699978726086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 168.9090909090909, 132, 453, 142.0, 392.8000000000002, 453.0, 453.0, 0.05406255529124973, 0.04017734821937602, 0.027136868573928087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 163.27272727272728, 132, 394, 143.0, 345.00000000000017, 394.0, 394.0, 0.054060695417127415, 0.014465459515911046, 0.03083149035508048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 210.45454545454547, 132, 399, 144.0, 398.6, 399.0, 399.0, 0.05406388385111789, 0.01457190619424662, 0.031783650467161105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 187.54545454545453, 133, 418, 140.0, 413.6, 418.0, 418.0, 0.0540644152933486, 0.014572049434535364, 0.031836760177626176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9689829-4070-4d24-80f3-720b16899eb0", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 222.42857142857142, 142, 424, 152.0, 424.0, 424.0, 424.0, 0.055029283440116344, 0.04089578583782084, 0.030900232400455956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 377.0, 133, 1280, 142.0, 1254.8, 1280.0, 1280.0, 0.07234057944804137, 12.220626015876498, 0.041362704362136946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 844.625, 133, 1355, 1208.5, 1304.6000000000001, 1355.0, 1355.0, 0.07578412890880327, 42.62684257564203, 0.04048234229796425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d56c972-fcf1-472d-8f2a-2ba9e594f6e5", 2, 0, 0.0, 243.5, 239, 248, 243.5, 248.0, 248.0, 248.0, 0.016231263035733124, 0.02773897491458298, 0.010089061447504037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a7ffe4f-cfd9-4381-adf7-88ae678811b2", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 330.4375, 131, 981, 146.5, 973.3, 981.0, 981.0, 0.07234090652198485, 4.0040850712105795, 0.04143353679213292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 684.0, 140, 1058, 922.0, 1056.6, 1058.0, 1058.0, 0.07568984195014877, 13.917229462034447, 0.04050589198113431], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 443.87500000000006, 142, 791, 460.0, 749.0, 791.0, 791.0, 0.08234603864087864, 0.016641097042233224, 0.05567303894195634], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 408.0, 270, 850, 297.0, 792.0000000000002, 850.0, 850.0, 0.05402352478943104, 0.08372591195393267, 0.12150017342779264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 478.7391304347826, 188, 1025, 440.0, 914.8000000000001, 1009.1999999999998, 1025.0, 0.1031237529872261, 0.06334457092672385, 0.04662724378231024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37dde45d-06f9-4b4c-8c8a-1c449fb7025d", 3, 0, 0.0, 592.0, 262, 934, 580.0, 934.0, 934.0, 934.0, 0.086878457038603, 0.03931023935014914, 0.05571307303582289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 140.625, 132, 154, 142.0, 148.4, 154.0, 154.0, 0.07578448786264062, 0.056320307874481945, 0.038040260509177026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df108b83-1447-4f5a-b343-e8dc811ea570", 3, 0, 0.0, 349.3333333333333, 256, 423, 369.0, 423.0, 423.0, 423.0, 0.02053233500557795, 0.024268524871501804, 0.013166894518550966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 170.93749999999997, 132, 399, 141.5, 395.5, 399.0, 399.0, 0.07578448786264062, 0.09141873889875667, 0.03924289520426288], "isController": false}, {"data": ["login", 23, 0, 0.0, 2283.4347826086955, 1503, 3791, 2060.0, 3316.4, 3696.3999999999987, 3791.0, 0.10304705666244025, 37.65955580138127, 0.20748108330458467], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 168.125, 141, 436, 149.5, 246.30000000000018, 436.0, 436.0, 0.0730893974692796, 0.059171006349641404, 0.02598099675665799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1ea9b4c-fd83-4dda-bfe8-88c720449b30", 3, 0, 0.0, 447.33333333333337, 254, 778, 310.0, 778.0, 778.0, 778.0, 0.04884800130261337, 0.03140455812912155, 0.03132505291866808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8169292-72ad-4779-81b9-e77c31f0f777", 3, 0, 0.0, 305.0, 229, 432, 254.0, 432.0, 432.0, 432.0, 0.08973975471133713, 0.04060490203410111, 0.057547954681423874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1003.1249999999997, 284, 1488, 1349.5, 1453.0, 1488.0, 1488.0, 0.07564224997872562, 56.602979314799406, 0.15802508131541873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a603089-9756-4d6b-bbe0-d0da8b3e7c84", 3, 0, 0.0, 443.3333333333333, 379, 496, 455.0, 496.0, 496.0, 496.0, 0.017568517217146872, 0.02420818143886156, 0.011266269178964628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 430.59999999999997, 267, 1310, 291.5, 815.0000000000001, 1285.3999999999996, 1310.0, 0.12511573205214824, 7.66830534064322, 0.27978761213497483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 847.6153846153845, 140, 1678, 1114.0, 1604.8, 1678.0, 1678.0, 0.10142225204209804, 65.34744191625643, 0.15415999457781038], "isController": false}, {"data": ["register", 26, 7, 26.923076923076923, 850.5000000000001, 233, 1650, 861.0, 1319.7, 1551.2999999999997, 1650.0, 0.10074473608753942, 0.031709768945822586, 0.04545319147699533], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 605.8125, 276, 1641, 331.5, 1482.1000000000001, 1641.0, 1641.0, 0.07228632613783195, 16.305944780870778, 0.15910580402725194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 165.08333333333337, 134, 419, 143.0, 337.7000000000003, 419.0, 419.0, 0.07161656491146401, 0.05560075107872451, 0.025457450808371977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 403.99999999999994, 266, 826, 286.0, 795.4000000000001, 826.0, 826.0, 0.09165389452673493, 0.1420456353651644, 0.20613175692877983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9689829-4070-4d24-80f3-720b16899eb0", 3, 0, 0.0, 468.66666666666663, 218, 943, 245.0, 943.0, 943.0, 943.0, 0.019391745580297985, 0.022920386784525387, 0.01243546184674057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 195.4, 133, 417, 143.5, 415.2, 417.0, 417.0, 0.04371947833918446, 0.03249074513292907, 0.02194512877572345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d768f1ae-29d1-4ed7-a169-2d21908db4d3", 3, 0, 0.0, 512.3333333333334, 242, 922, 373.0, 922.0, 922.0, 922.0, 0.03751641343087601, 0.024559084443193897, 0.024058377102482334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b927416e-7c0f-4bf8-832e-0e5708927f02", 3, 0, 0.0, 555.6666666666666, 310, 965, 392.0, 965.0, 965.0, 965.0, 0.028686447565954926, 0.028957250619149163, 0.01839593154457396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 189.6, 132, 400, 140.0, 399.5, 400.0, 400.0, 0.04372444852539297, 0.01826691316324523, 0.0245693825014757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 296.6, 132, 1182, 136.5, 1105.7000000000003, 1182.0, 1182.0, 0.04372234561639763, 3.9447504287522515, 0.025328218183249093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 307.5, 131, 1002, 147.5, 944.9000000000002, 1002.0, 1002.0, 0.04372253678158407, 1.2961938848566994, 0.025371026714469974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 143.66666666666666, 142, 146, 143.0, 146.0, 146.0, 146.0, 0.04052301707369786, 0.011951124176031986, 0.02504987285903393], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1286.327272727273, 1049, 2134, 1123.0, 1745.8, 1826.5999999999992, 2134.0, 0.2427527276579217, 290.41665678184916, 0.4793418118401539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, 26.923076923076923, 850.5000000000001, 233, 1650, 861.0, 1319.7, 1551.2999999999997, 1650.0, 0.103443474109292, 0.032559206469195724, 0.04667078617040323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 203.25, 132, 417, 137.0, 417.0, 417.0, 417.0, 0.07718655024362005, 0.020804187370350717, 0.04545262675478798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28fe5f7c-91d0-4242-ade0-c192dc58a16c", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 174.5, 131, 419, 140.0, 419.0, 419.0, 419.0, 0.07718506083147607, 0.02080378592723378, 0.045376373652879484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 209.66666666666663, 133, 430, 144.5, 426.1, 430.0, 430.0, 0.07201714007933889, 0.019410869787009306, 0.04233820149195508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 204.0, 132, 420, 139.0, 412.8, 420.0, 420.0, 0.07202535292422933, 0.019413083405358685, 0.042413367005185824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 170.375, 131, 394, 141.0, 394.0, 394.0, 394.0, 0.07740012964521716, 0.020710581565224123, 0.04414226143828791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 164.91666666666669, 133, 424, 142.5, 342.4000000000003, 424.0, 424.0, 0.0720249206225354, 0.05352633261108343, 0.036153133984358585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c339b6cc-e3c9-460a-82ac-99d714a5d760", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 170.5, 133, 401, 137.5, 401.0, 401.0, 401.0, 0.07738964719994583, 0.05751320460855349, 0.038845975254660305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 239.08333333333334, 132, 530, 141.5, 500.3000000000001, 530.0, 530.0, 0.07202535292422933, 0.01927240888792855, 0.04107695908959954], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 557.4374999999999, 145, 965, 494.5, 949.6, 965.0, 965.0, 0.08076117406556799, 0.01590675712338793, 0.05495644101910506], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 145.25, 135, 159, 145.0, 159.0, 159.0, 159.0, 0.08088815190794929, 0.06366782269317102, 0.028753210248528848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1091.5217391304348, 701, 1919, 1066.0, 1538.8000000000002, 1853.1999999999991, 1919.0, 0.10325059818009598, 0.053440251011182494, 0.04749124193635274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc8ae56-bccf-4ad1-a538-57db0351bbd8", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 380.5, 276, 797, 281.0, 797.0, 797.0, 797.0, 0.0770764887805536, 0.11945350360814312, 0.17334682974767082], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1294.232142857143, 712, 2253, 1100.0, 2173.7000000000003, 2232.15, 2253.0, 0.27321737857683015, 88.64094365196497, 0.9923855139901935], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5a7ffe4f-cfd9-4381-adf7-88ae678811b2", 3, 0, 0.0, 378.3333333333333, 225, 497, 413.0, 497.0, 497.0, 497.0, 0.034299041913429223, 0.028593699980563877, 0.021995153831202985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1ea9b4c-fd83-4dda-bfe8-88c720449b30", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 241.67272727272723, 133, 605, 144.0, 548.0, 586.0, 605.0, 0.24403338376689931, 0.18135684086583045, 0.11796535641075699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f7871c3-30fc-4b9b-82b4-b04fa0f73b75", 3, 0, 0.0, 434.0, 250, 797, 255.0, 797.0, 797.0, 797.0, 0.08673779165582444, 0.03924659192760285, 0.05562286769595512], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 786.7818181818183, 652, 1126, 708.0, 987.6, 1071.3999999999999, 1126.0, 0.24393705536927637, 71.7255937511088, 0.12268318702654035], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 180.85454545454544, 132, 441, 143.0, 407.0, 432.0, 441.0, 0.24427074080653757, 0.43224470931781844, 0.1187957313688044], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1040.6363636363633, 915, 1516, 976.0, 1262.3999999999999, 1310.1999999999996, 1516.0, 0.24341668510732462, 219.0267611404625, 0.12218376576676257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 176.94444444444443, 135, 433, 144.5, 430.3, 433.0, 433.0, 0.09289747215656322, 0.06940094355446372, 0.03302214830565333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, 4.191616766467066, 207.04191616766465, 133, 591, 150.0, 354.60000000000025, 471.59999999999985, 569.9199999999998, 0.7008590769643989, 1.557527002222185, 0.33563431680928657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 145.7, 134, 171, 144.5, 169.10000000000002, 171.0, 171.0, 0.0431799437797132, 0.03343915568096931, 0.015349120640444927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 156.85000000000002, 134, 397, 145.5, 156.9, 384.99999999999983, 397.0, 0.13286299831928305, 0.10782143711262132, 0.04722864393380765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f7871c3-30fc-4b9b-82b4-b04fa0f73b75", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 553.4, 267, 1581, 422.0, 1507.8000000000002, 1581.0, 1581.0, 0.04369216249989077, 5.288044506748254, 0.09714679255835089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 453.8333333333333, 269, 954, 414.5, 842.7000000000004, 954.0, 954.0, 0.07195927105258423, 0.11152281558637811, 0.16183808714267725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/279579ad-112e-4b06-ac16-af65f42e387d", 3, 0, 0.0, 614.6666666666666, 293, 1031, 520.0, 1031.0, 1031.0, 1031.0, 0.019435464539994948, 0.026793356877239126, 0.012463497768160822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d768f1ae-29d1-4ed7-a169-2d21908db4d3", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.2633586916909621, 1.0050337099125364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 147.63636363636363, 134, 180, 146.0, 175.8, 180.0, 180.0, 0.053230871970074575, 0.044133799123626284, 0.018921911520612445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a603089-9756-4d6b-bbe0-d0da8b3e7c84", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 148.12499999999997, 138, 185, 146.0, 163.3, 185.0, 185.0, 0.0765579543714592, 0.05943708371612311, 0.027213960342979637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df108b83-1447-4f5a-b343-e8dc811ea570", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6569847f-b270-4d1b-aca3-1117a3627219", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.4860516552511415, 0.9081882610350076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 171.16666666666669, 133, 395, 142.5, 395.0, 395.0, 395.0, 0.09172441907867916, 0.06816629191296371, 0.04604135879535263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 151.5, 131, 395, 134.5, 170.00000000000034, 395.0, 395.0, 0.09172067995597408, 0.024542447566344626, 0.052309450287391465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 227.88888888888889, 132, 425, 141.0, 418.7, 425.0, 425.0, 0.09171740847366945, 0.024720707752668724, 0.053919804590965834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 198.5, 131, 431, 140.0, 418.40000000000003, 431.0, 431.0, 0.09172254947921975, 0.024722093414320946, 0.05401239974215772], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5401234567901234], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.23148148148148148], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.538461538461538, 0.23148148148148148], "isController": false}, {"data": ["401/Unauthorized", 13, 50.0, 1.0030864197530864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 26, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
