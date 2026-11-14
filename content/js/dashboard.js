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

    var data = {"OkPercent": 97.71217712177122, "KoPercent": 2.2878228782287824};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8233609166136219, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/827905d0-ac1a-4bf8-8015-819a0eccd379"], "isController": false}, {"data": [0.5, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac4e8811-2ad2-47bc-af55-7c4f9f7d9536"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b24c51b-cc1d-43bc-ac43-a490f4c2db73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2440de50-b05b-4c07-8344-590c13f8ff42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3fb0008a-aed0-411f-85c7-42c807566a54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab46853d-44c1-496c-8ffa-811b45f23a4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87041132-36e5-4a1f-a145-b5e0703fa183"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab46853d-44c1-496c-8ffa-811b45f23a4d"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa9d559f-2110-4bcb-bba9-9f1eb939bf40"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df33cb84-158a-46aa-b071-bc783bc10967"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bc46a86-1fe2-46dd-a62d-95228ea3678b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9dd0c0c2-5d7a-4d40-be5b-e1f00b45a61c"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2796c9df-7db9-45d6-b171-a046835cb7f7"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/081d8316-4ca8-42a2-b228-27502d6ac238"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87041132-36e5-4a1f-a145-b5e0703fa183"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac4e8811-2ad2-47bc-af55-7c4f9f7d9536"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=827905d0-ac1a-4bf8-8015-819a0eccd379"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc83536b-d494-4257-b7e0-d3e4cf77027c"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2440de50-b05b-4c07-8344-590c13f8ff42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8389830508474576, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.888268156424581, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2796c9df-7db9-45d6-b171-a046835cb7f7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df33cb84-158a-46aa-b071-bc783bc10967"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa9d559f-2110-4bcb-bba9-9f1eb939bf40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fb0008a-aed0-411f-85c7-42c807566a54"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9bc46a86-1fe2-46dd-a62d-95228ea3678b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=081d8316-4ca8-42a2-b228-27502d6ac238"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dd0c0c2-5d7a-4d40-be5b-e1f00b45a61c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1355, 31, 2.2878228782287824, 250.90996309963109, 77, 1538, 83.0, 621.8000000000002, 774.2, 1059.4400000000014, 5.260562860814436, 746.5694155594734, 3.858274358250154], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/827905d0-ac1a-4bf8-8015-819a0eccd379", 3, 0, 0.0, 288.0, 186, 414, 264.0, 414.0, 414.0, 414.0, 0.026952240629604343, 0.0320145592634851, 0.017283826185000177], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1144.0677966101694, 935, 1467, 1187.0, 1338.0, 1348.0, 1467.0, 0.2555163378878759, 307.47180168115676, 1.2563718371732964], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ac4e8811-2ad2-47bc-af55-7c4f9f7d9536", 3, 0, 0.0, 282.3333333333333, 184, 469, 194.0, 469.0, 469.0, 469.0, 0.07253735673872044, 0.03282126493060593, 0.046516469002369554], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 556.6923076923077, 80, 1197, 507.0, 1039.8, 1197.0, 1197.0, 0.07584862947361051, 0.014369759880742615, 0.05127417492736035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 556.6923076923077, 80, 1197, 507.0, 1039.8, 1197.0, 1197.0, 0.07652550653998752, 0.014497996356208574, 0.05173174829877913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b24c51b-cc1d-43bc-ac43-a490f4c2db73", 2, 0, 0.0, 191.5, 177, 206, 191.5, 206.0, 206.0, 206.0, 0.012263242769285481, 0.024239065786165834, 0.007622611350244345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 112.88888888888889, 77, 234, 79.0, 233.1, 234.0, 234.0, 0.11412991788986462, 0.049585090194337884, 0.0640247043718099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 107.44444444444446, 78, 279, 79.5, 238.50000000000006, 279.0, 279.0, 0.11424001827840292, 0.08489907608385218, 0.05734313417490147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 146.88888888888889, 77, 535, 79.5, 399.1000000000002, 535.0, 535.0, 0.1142429185257586, 3.759727506838708, 0.0661830449228543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 186.55555555555551, 77, 701, 80.0, 693.8, 701.0, 701.0, 0.11412991788986462, 11.43782148574961, 0.06600612655739783], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 200.6428571428571, 78, 278, 191.0, 277.5, 278.0, 278.0, 0.07479831169525031, 0.13529541159106695, 0.04835072227119731], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 87.77777777777777, 77, 233, 79.5, 95.30000000000021, 233.0, 233.0, 0.08931096589809619, 0.06637270024262812, 0.044829918429317814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 87.44444444444444, 77, 231, 79.0, 97.80000000000021, 231.0, 231.0, 0.08931140903632989, 0.03880239602663465, 0.05010199486955572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 496.7142857142857, 385, 545, 539.0, 545.0, 545.0, 545.0, 0.07329075489477542, 21.549915421160087, 0.0417986336509266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 626.8571428571429, 535, 696, 693.0, 696.0, 696.0, 696.0, 0.07317506611889903, 65.84305312183126, 0.04166119487042787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2440de50-b05b-4c07-8344-590c13f8ff42", 1, 0, 0.0, 1348.0, 1348, 1348, 1348.0, 1348.0, 1348.0, 1348.0, 0.741839762611276, 0.13402378523738873, 0.5114637425816023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 165.99999999999997, 77, 233, 231.0, 233.0, 233.0, 233.0, 0.07365087381501004, 0.130327522805467, 0.04078129438780341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 79.4, 78, 81, 79.5, 80.9, 81.0, 81.0, 0.06296039790971479, 0.04678990508720015, 0.0316031684820248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fb0008a-aed0-411f-85c7-42c807566a54", 3, 0, 0.0, 582.6666666666667, 176, 1337, 235.0, 1337.0, 1337.0, 1337.0, 0.05111516246102469, 0.03286212430355591, 0.0327789290521545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 109.4, 77, 234, 79.0, 233.7, 234.0, 234.0, 0.06296158713568852, 0.016847143432791655, 0.035907780163322356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 93.80000000000001, 77, 234, 78.0, 218.60000000000005, 234.0, 234.0, 0.0628994112615106, 0.016953356941579026, 0.0369779741986615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 109.30000000000001, 77, 233, 79.0, 232.8, 233.0, 233.0, 0.06296119072203893, 0.016970008436799557, 0.03707577930213816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab46853d-44c1-496c-8ffa-811b45f23a4d", 3, 0, 0.0, 496.0, 176, 894, 418.0, 894.0, 894.0, 894.0, 0.03996270147861996, 0.02569216647795391, 0.025627123018516055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 101.14285714285714, 78, 234, 79.0, 234.0, 234.0, 234.0, 0.07365009890156138, 0.05473410670321115, 0.04135625670741972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 177.99999999999997, 77, 703, 79.0, 694.9, 703.0, 703.0, 0.08930919338913504, 8.950349127622838, 0.0516512587634646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 367.0952380952381, 77, 741, 236.0, 703.0, 737.3, 741.0, 0.09595744972515045, 41.12911039162063, 0.05248565493244138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 143.38888888888889, 77, 542, 79.0, 404.30000000000024, 542.0, 542.0, 0.08930963650977941, 2.939174710736011, 0.05173873148065454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 297.0476190476191, 78, 551, 233.0, 548.6, 550.8, 551.0, 0.09595701125895598, 13.449046255848808, 0.0525791231242689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87041132-36e5-4a1f-a145-b5e0703fa183", 3, 0, 0.0, 289.3333333333333, 182, 397, 289.0, 397.0, 397.0, 397.0, 0.09195402298850575, 0.04160680076628352, 0.058967911877394634], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 457.61538461538464, 84, 1348, 417.0, 1042.7999999999997, 1348.0, 1348.0, 0.07667897462515778, 0.014527071364531845, 0.05244606850676544], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 205.09999999999997, 157, 314, 160.0, 313.8, 314.0, 314.0, 0.06286777649248101, 0.09743277470074939, 0.14139110279510134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab46853d-44c1-496c-8ffa-811b45f23a4d", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 346.8095238095238, 111, 659, 334.0, 632.0, 656.5999999999999, 659.0, 0.09255056125304645, 0.056849905300943575, 0.041846591660313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 87.33333333333334, 78, 236, 80.0, 85.6, 220.99999999999977, 236.0, 0.09595613433858807, 0.07131115061686087, 0.048165481494174094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 127.4285714285714, 77, 319, 79.0, 236.8, 310.7999999999999, 319.0, 0.09595744972515045, 0.09430639613519948, 0.050888149026488826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa9d559f-2110-4bcb-bba9-9f1eb939bf40", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["login", 21, 0, 0.0, 1899.4761904761906, 1168, 2742, 1923.0, 2516.0, 2722.7999999999997, 2742.0, 0.09740214563012231, 38.973255465245984, 0.20079680607928535], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df33cb84-158a-46aa-b071-bc783bc10967", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 81.16666666666667, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.08714259433185836, 0.07054805732530331, 0.03097646907890278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bc46a86-1fe2-46dd-a62d-95228ea3678b", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dd0c0c2-5d7a-4d40-be5b-e1f00b45a61c", 3, 0, 0.0, 585.6666666666666, 204, 1048, 505.0, 1048.0, 1048.0, 1048.0, 0.05508731339172588, 0.03491373671018564, 0.03532617427789713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 456.8095238095238, 158, 823, 472.0, 786.6, 819.4, 823.0, 0.09592107066185539, 54.723082327970126, 0.2040419240739049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2796c9df-7db9-45d6-b171-a046835cb7f7", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 312.22222222222223, 159, 781, 160.0, 772.9, 781.0, 781.0, 0.1140713326066567, 15.320364188572588, 0.2533061872607671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 585.8888888888889, 78, 928, 624.0, 928.0, 928.0, 928.0, 0.08191722719287867, 76.22824642522322, 0.15572806211146203], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 621.4782608695652, 89, 1253, 586.0, 1100.8000000000002, 1233.1999999999998, 1253.0, 0.09184863345207098, 0.028515506445378015, 0.04143952017075859], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 275.72222222222223, 158, 785, 160.5, 773.3000000000001, 785.0, 785.0, 0.08927375797884213, 11.989922914589812, 0.198240826501411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 82.70000000000002, 78, 100, 80.0, 91.7, 99.6, 100.0, 0.10142707900155183, 0.0787446560607751, 0.03605415698883288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/081d8316-4ca8-42a2-b228-27502d6ac238", 3, 0, 0.0, 420.0, 266, 716, 278.0, 716.0, 716.0, 716.0, 0.03833082053509825, 0.024643024269797868, 0.02458063686658319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 249.4375, 157, 525, 164.0, 484.40000000000003, 525.0, 525.0, 0.09190384560153939, 0.142433010712542, 0.20669390275424337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87041132-36e5-4a1f-a145-b5e0703fa183", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 96.77777777777777, 79, 233, 80.0, 233.0, 233.0, 233.0, 0.04418392294323839, 0.032835903671684, 0.022178258196117708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 79.0, 77, 81, 79.0, 81.0, 81.0, 81.0, 0.044184139857530697, 0.01182270929781583, 0.025198767262497975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 113.33333333333334, 77, 234, 79.0, 234.0, 234.0, 234.0, 0.044184139857530697, 0.01190900644597507, 0.02597544159593113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 123.11111111111113, 78, 316, 79.0, 316.0, 316.0, 316.0, 0.044150976717718275, 0.011900067943447504, 0.025999061485140744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 3.510974702380952, 7.359095982142857], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 740.1016949152541, 614, 1141, 623.0, 1014.0, 1022.0, 1141.0, 0.264345207959031, 316.24876998270554, 0.5219785258722272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 621.4782608695652, 89, 1253, 586.0, 1100.8000000000002, 1233.1999999999998, 1253.0, 0.0908014212396368, 0.02819038689301224, 0.04096704747335175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 122.85714285714286, 78, 234, 79.0, 234.0, 234.0, 234.0, 0.03637327291905908, 0.009803733716465141, 0.021419026924016232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 78.28571428571429, 77, 79, 78.0, 79.0, 79.0, 79.0, 0.03637327291905908, 0.009803733716465141, 0.021383506149681212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 117.35000000000001, 78, 235, 79.0, 233.9, 234.95, 235.0, 0.09591774094536526, 0.02585282861418048, 0.05638914067295887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 125.55000000000001, 77, 239, 80.0, 234.0, 238.75, 239.0, 0.09598863494562243, 0.025871936762687297, 0.0565245574923929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 87.55, 78, 235, 79.0, 84.80000000000001, 227.4999999999999, 235.0, 0.09598863494562243, 0.07133530390001824, 0.048181795275439386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 123.14285714285712, 77, 238, 79.0, 238.0, 238.0, 238.0, 0.03637346192218158, 0.009732742740896241, 0.02074424000249418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 109.5, 77, 234, 79.0, 232.9, 233.95, 234.0, 0.0959877135726627, 0.025684212420810135, 0.05474299289690919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 123.71428571428574, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.03637308391790075, 0.027031168810080542, 0.01825758313847753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 102.85714285714286, 79, 234, 81.0, 234.0, 234.0, 234.0, 0.035852574214828625, 0.028219897282374874, 0.012744469740427363], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 513.0769230769231, 79, 1337, 445.0, 1088.6, 1337.0, 1337.0, 0.07592925729504942, 0.014225328102002197, 0.051676612912646316], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac4e8811-2ad2-47bc-af55-7c4f9f7d9536", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 939.0, 758, 1538, 886.0, 1220.8, 1507.0999999999995, 1538.0, 0.09578849899422076, 0.04957803170599317, 0.04405896779909959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=827905d0-ac1a-4bf8-8015-819a0eccd379", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 248.28571428571428, 158, 474, 159.0, 474.0, 474.0, 474.0, 0.0363581590305876, 0.05634804529447512, 0.0817703518041438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc83536b-d494-4257-b7e0-d3e4cf77027c", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.6597849948347108, 1.232809271694215], "isController": false}, {"data": ["addBook", 60, 18, 30.0, 759.733333333333, 396, 1987, 660.5, 1136.7, 1513.2999999999997, 1987.0, 0.2617732520091097, 74.12237875671885, 0.9516164975502387], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2440de50-b05b-4c07-8344-590c13f8ff42", 3, 0, 0.0, 343.3333333333333, 277, 445, 308.0, 445.0, 445.0, 445.0, 0.03163956210846042, 0.026376601093674196, 0.020289693148980152], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 143.03389830508473, 78, 428, 80.0, 315.0, 320.0, 428.0, 0.2651649640679002, 0.19706107192936725, 0.12818032931016662], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 449.44067796610165, 381, 636, 390.0, 593.0, 624.0, 636.0, 0.26494348620722175, 77.90218189661367, 0.1332479447233586], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 107.28813559322032, 77, 283, 81.0, 236.0, 237.0, 283.0, 0.26549309717947334, 0.4697983321183649, 0.12911676015173604], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 593.1525423728814, 534, 788, 540.0, 697.0, 703.0, 788.0, 0.2647639562017591, 238.2350731957346, 0.1328990952028361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 101.5625, 79, 244, 81.5, 237.70000000000002, 244.0, 244.0, 0.0912918944209241, 0.06820146409375677, 0.03245141559493787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 18, 10.05586592178771, 133.57541899441324, 78, 1038, 82.0, 238.0, 317.0, 934.7999999999986, 0.7371260320793955, 1.6316739311157782, 0.35153193655156795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 80.55555555555556, 79, 81, 81.0, 81.0, 81.0, 81.0, 0.046643241394321966, 0.036121182056345034, 0.016580214714387885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 90.6111111111111, 79, 234, 82.0, 106.2000000000002, 234.0, 234.0, 0.11507700569631178, 0.09338768723987802, 0.040906279368610826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2796c9df-7db9-45d6-b171-a046835cb7f7", 3, 0, 0.0, 699.3333333333334, 191, 1430, 477.0, 1430.0, 1430.0, 1430.0, 0.02746976037212369, 0.027550238185713893, 0.01761569919696734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df33cb84-158a-46aa-b071-bc783bc10967", 3, 0, 0.0, 562.3333333333334, 191, 1074, 422.0, 1074.0, 1074.0, 1074.0, 0.04508498519709653, 0.028985301355555222, 0.028911920845794324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 237.88888888888889, 159, 549, 162.0, 549.0, 549.0, 549.0, 0.044133223490643754, 0.06839787664028481, 0.09925665400288337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa9d559f-2110-4bcb-bba9-9f1eb939bf40", 3, 0, 0.0, 276.0, 185, 423, 220.0, 423.0, 423.0, 423.0, 0.02181881654739047, 0.021882738861494153, 0.013991884309361727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 237.05000000000004, 158, 469, 162.5, 318.8, 461.4999999999999, 469.0, 0.09588095420725627, 0.14859675227237862, 0.21563851322198357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fb0008a-aed0-411f-85c7-42c807566a54", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bc46a86-1fe2-46dd-a62d-95228ea3678b", 3, 0, 0.0, 583.6666666666666, 236, 947, 568.0, 947.0, 947.0, 947.0, 0.025225558535908583, 0.02529946153943175, 0.01617654632673825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 83.10000000000001, 80, 97, 81.5, 95.80000000000001, 97.0, 97.0, 0.0635873435751348, 0.0527203659133686, 0.0226033135364737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=081d8316-4ca8-42a2-b228-27502d6ac238", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 96.33333333333334, 79, 240, 82.0, 204.80000000000013, 239.5, 240.0, 0.096884919170296, 0.07521827220740754, 0.03443956111131616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dd0c0c2-5d7a-4d40-be5b-e1f00b45a61c", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 101.87499999999999, 78, 290, 79.0, 250.80000000000004, 290.0, 290.0, 0.09195032383754677, 0.06833417621130185, 0.04615475239501859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 107.8125, 77, 235, 78.0, 234.3, 235.0, 235.0, 0.0919482101706214, 0.024603329674560803, 0.052439213612932516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 126.81249999999999, 77, 234, 79.0, 234.0, 234.0, 234.0, 0.09194715337359852, 0.024782631182727728, 0.05405486946377569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 107.625, 77, 232, 79.0, 231.3, 232.0, 232.0, 0.09194715337359852, 0.024782631182727728, 0.0541446616057421], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6642066420664207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.225806451612903, 0.07380073800738007], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.225806451612903, 0.07380073800738007], "isController": false}, {"data": ["401/Unauthorized", 20, 64.51612903225806, 1.4760147601476015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1355, 31, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
