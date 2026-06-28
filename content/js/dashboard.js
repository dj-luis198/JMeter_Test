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

    var data = {"OkPercent": 98.84615384615384, "KoPercent": 1.1538461538461537};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.814777998674619, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36607142857142855, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d79b8f1-da70-44a7-a29c-0bd7b217c640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f836184f-04b8-4f70-891b-1339698a33e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4685172-477b-4464-a8bf-c9a027f9d8aa"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03162121-efb9-4a78-9b48-1c826e751a36"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e799a7c5-60ad-4645-9971-43aa67fb7d66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/53455657-6d87-4579-a1b0-49b081b8b5e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1a2e5be-872d-4383-9d8c-8bf0fc3d82fb"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4ec965f-9114-47b5-bfbd-4b2bad7bd6a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9b80b3e-689d-4bd6-8ae5-2f4226f99034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cab8c53e-cd70-4f6d-93f3-e1ce7c710e74"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03162121-efb9-4a78-9b48-1c826e751a36"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0da7a229-183d-458f-bc54-b80f5ff1ac82"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9a2925a-b639-4c7b-8bf8-f51977d10ac5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5947615d-1733-4863-bc93-08c479376146"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae2f59d-d3b2-4f53-913f-98cec42c2720"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f836184f-04b8-4f70-891b-1339698a33e5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/59aec36e-dafd-4be0-b0e7-66a836f5d112"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e799a7c5-60ad-4645-9971-43aa67fb7d66"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0da7a229-183d-458f-bc54-b80f5ff1ac82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9a2925a-b639-4c7b-8bf8-f51977d10ac5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4067796610169492, 500, 1500, "addBook"], "isController": true}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9482758620689655, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9b80b3e-689d-4bd6-8ae5-2f4226f99034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4ec965f-9114-47b5-bfbd-4b2bad7bd6a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cab8c53e-cd70-4f6d-93f3-e1ce7c710e74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53455657-6d87-4579-a1b0-49b081b8b5e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce1a3e76-8185-4a00-93c3-fd8bce6e322b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1a2e5be-872d-4383-9d8c-8bf0fc3d82fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59aec36e-dafd-4be0-b0e7-66a836f5d112"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cae2f59d-d3b2-4f53-913f-98cec42c2720"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 15, 1.1538461538461537, 326.6630769230764, 77, 4754, 96.0, 833.6000000000004, 1066.000000000001, 2283.3100000000004, 5.087485177807607, 724.2897982286257, 3.718977652732175], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1390.732142857143, 988, 2696, 1330.5, 1689.8000000000002, 1882.2999999999988, 2696.0, 0.2507376612444647, 301.72267931940394, 1.2328751214510547], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8d79b8f1-da70-44a7-a29c-0bd7b217c640", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f836184f-04b8-4f70-891b-1339698a33e5", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4685172-477b-4464-a8bf-c9a027f9d8aa", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 587.7692307692308, 94, 2065, 440.0, 1601.3999999999996, 2065.0, 2065.0, 0.07717331940255978, 0.014620726527438083, 0.052169674076294734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 587.7692307692308, 94, 2065, 440.0, 1601.3999999999996, 2065.0, 2065.0, 0.0771939408694413, 0.014624633328780869, 0.05218361432422643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 107.77777777777776, 78, 244, 81.0, 235.9, 244.0, 244.0, 0.1102812785276224, 0.038710930559554955, 0.06238024142409891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 92.55555555555557, 80, 241, 82.5, 110.5000000000002, 241.0, 241.0, 0.11027519788271621, 0.08195256405151076, 0.055352980187222775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 165.66666666666663, 79, 635, 85.0, 284.00000000000057, 635.0, 635.0, 0.11027925157147934, 1.8295035863731604, 0.06441332586906176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 143.88888888888889, 78, 725, 82.0, 291.20000000000067, 725.0, 725.0, 0.11028262987311371, 5.54099014846799, 0.064307601230264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03162121-efb9-4a78-9b48-1c826e751a36", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 238.8461538461538, 87, 966, 180.0, 663.5999999999997, 966.0, 966.0, 0.0771311942282134, 0.15480703480990127, 0.0498583177834868], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e799a7c5-60ad-4645-9971-43aa67fb7d66", 3, 0, 0.0, 257.3333333333333, 171, 430, 171.0, 430.0, 430.0, 430.0, 0.023785360903209436, 0.02385504457773056, 0.01525298208962324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 108.3, 80, 271, 82.0, 239.0, 269.4, 271.0, 0.09214891264283082, 0.06848176027460376, 0.046254434666420936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 121.6, 78, 248, 82.0, 242.9, 247.75, 248.0, 0.09214976179286577, 0.03849772274901169, 0.05178024700743648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 619.2, 474, 718, 643.0, 718.0, 718.0, 718.0, 0.06689321167687902, 19.668825296671397, 0.03815003478447007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 803.8, 724, 942, 771.0, 942.0, 942.0, 942.0, 0.0666266906522753, 59.950813366146974, 0.037932969385035646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 144.2, 78, 242, 82.0, 242.0, 242.0, 242.0, 0.06740270419649237, 0.11927119141019939, 0.03732161453067497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 83.4, 79, 94, 83.0, 88.60000000000001, 94.0, 94.0, 0.08154345450690674, 0.060600164921636744, 0.04093099181303717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 112.80000000000001, 79, 242, 82.0, 239.6, 242.0, 242.0, 0.08154389779831477, 0.021819363278064694, 0.04650550421310139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 103.2, 78, 245, 82.0, 244.4, 245.0, 245.0, 0.08154522770145749, 0.02197898715390846, 0.047939674879177156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 113.66666666666666, 77, 245, 82.0, 243.8, 245.0, 245.0, 0.08154478439559006, 0.02197886766912388, 0.048019047842325004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 81.8, 80, 86, 81.0, 86.0, 86.0, 86.0, 0.06739543598107536, 0.05008586599765465, 0.03784411688390463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 161.20000000000002, 77, 731, 82.0, 522.1000000000006, 722.0999999999999, 731.0, 0.09215146013988591, 8.314158510302534, 0.053383052885722974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 618.3333333333333, 80, 1107, 728.0, 1026.6000000000001, 1107.0, 1107.0, 0.08338568101085682, 50.02787991558589, 0.04424435548427624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 176.35000000000002, 79, 634, 82.5, 592.3000000000009, 633.85, 634.0, 0.09214976179286577, 2.731862479151116, 0.05347205904035238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 462.0, 79, 654, 635.0, 651.0, 654.0, 654.0, 0.08338521746864716, 16.3528400310193, 0.044325540405696875], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 426.6153846153846, 88, 712, 414.0, 686.8, 712.0, 712.0, 0.07734136096997966, 0.014652562527515676, 0.05289912046511904], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 219.46666666666667, 162, 329, 168.0, 328.4, 329.0, 329.0, 0.08150623522699486, 0.12631874541527427, 0.1833094333278996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53455657-6d87-4579-a1b0-49b081b8b5e6", 3, 0, 0.0, 995.6666666666666, 200, 2203, 584.0, 2203.0, 2203.0, 2203.0, 0.07727975270479134, 0.03496707560535806, 0.04955765391550747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1a2e5be-872d-4383-9d8c-8bf0fc3d82fb", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 774.3333333333333, 103, 2284, 731.0, 1438.6000000000004, 2208.3999999999987, 2284.0, 0.09219057987874743, 0.05662878392942592, 0.04168382664439459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 83.00000000000001, 80, 93, 83.0, 87.60000000000001, 93.0, 93.0, 0.08338336335134414, 0.061967519053098524, 0.041854539807217664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 155.79999999999998, 78, 248, 83.0, 246.2, 248.0, 248.0, 0.0833861445582202, 0.10580702847914791, 0.04288740507877211], "isController": false}, {"data": ["login", 21, 0, 0.0, 3391.5714285714284, 1471, 6453, 3090.0, 6050.000000000001, 6441.0, 6453.0, 0.0917980617494962, 26.274424670674453, 0.1747467288744246], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 95.35, 83, 244, 86.0, 101.4, 236.8999999999999, 244.0, 0.09001872389457007, 0.07287648643417831, 0.031998843259397954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4ec965f-9114-47b5-bfbd-4b2bad7bd6a5", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9b80b3e-689d-4bd6-8ae5-2f4226f99034", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cab8c53e-cd70-4f6d-93f3-e1ce7c710e74", 3, 0, 0.0, 310.3333333333333, 180, 389, 362.0, 389.0, 389.0, 389.0, 0.030071268907310326, 0.025069179580606036, 0.01928398429277387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03162121-efb9-4a78-9b48-1c826e751a36", 3, 0, 0.0, 523.3333333333334, 175, 966, 429.0, 966.0, 966.0, 966.0, 0.04368401892974153, 0.027686453403713143, 0.02801351474335639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0da7a229-183d-458f-bc54-b80f5ff1ac82", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9a2925a-b639-4c7b-8bf8-f51977d10ac5", 3, 0, 0.0, 422.0, 179, 620, 467.0, 620.0, 620.0, 620.0, 0.033425438987432034, 0.03352336507821553, 0.021434933204831093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 713.8, 164, 1188, 813.0, 1115.4, 1188.0, 1188.0, 0.08334537210930468, 66.51641673762599, 0.17322923206963228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5947615d-1733-4863-bc93-08c479376146", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 274.27777777777777, 162, 821, 176.5, 515.9000000000004, 821.0, 821.0, 0.11021577800093071, 7.486678194037939, 0.24631121568003134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 752.5, 87, 1022, 840.5, 1022.0, 1022.0, 1022.0, 0.07986051030866087, 79.62100676651448, 0.15865517396281162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae2f59d-d3b2-4f53-913f-98cec42c2720", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1289.7272727272725, 222, 3845, 1231.0, 2739.1999999999994, 3721.699999999998, 3845.0, 0.09046945422245616, 0.028464466065730172, 0.04081727329177222], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 323.35, 163, 817, 320.5, 695.7000000000005, 811.9499999999999, 817.0, 0.09211411096065807, 11.14853306839012, 0.20480996858908815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 88.89473684210527, 82, 117, 86.0, 94.0, 117.0, 117.0, 0.09459230715615696, 0.0734383634659617, 0.03362460918441517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f836184f-04b8-4f70-891b-1339698a33e5", 3, 0, 0.0, 284.3333333333333, 203, 414, 236.0, 414.0, 414.0, 414.0, 0.019064565327910524, 0.02628204237099644, 0.012225648989578036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 309.25, 162, 955, 318.0, 627.4000000000003, 955.0, 955.0, 0.10781671159029649, 8.218293305677223, 0.24075819154312667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 82.0, 80, 83, 82.5, 83.0, 83.0, 83.0, 0.018826630268514815, 0.013991275033534934, 0.0094500858965006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 79.75, 79, 81, 79.5, 81.0, 81.0, 81.0, 0.018827073331450627, 0.005037712981267062, 0.010737315259342935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59aec36e-dafd-4be0-b0e7-66a836f5d112", 3, 0, 0.0, 1100.0, 205, 2664, 431.0, 2664.0, 2664.0, 2664.0, 0.0764876854826373, 0.03460868581408393, 0.049049720182550605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 81.0, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.018826984717195155, 0.005074460724556506, 0.011068207812257308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 81.75, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.018826984717195155, 0.005074460724556506, 0.011086593539520193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e799a7c5-60ad-4645-9971-43aa67fb7d66", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 3.3513849431818183, 7.0245916193181825], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 976.0892857142859, 631, 2360, 878.0, 1341.7, 1520.2999999999988, 2360.0, 0.24753022299820984, 296.13220213494816, 0.4887754989281057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1289.7272727272725, 222, 3845, 1231.0, 2739.1999999999994, 3721.699999999998, 3845.0, 0.08668242710795902, 0.027272951142631993, 0.0391086731678487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 122.0, 79, 244, 83.0, 244.0, 244.0, 244.0, 0.0475352949565052, 0.012812247468745545, 0.027991975448020158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 122.99999999999999, 80, 242, 84.5, 242.0, 242.0, 242.0, 0.047534730062151656, 0.012812095212064315, 0.02794522216544463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 179.73684210526312, 80, 935, 82.0, 769.0, 935.0, 935.0, 0.09236123939061026, 8.770358589473735, 0.053462802118475164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 166.57894736842104, 79, 665, 81.0, 482.0, 665.0, 665.0, 0.0924344809803893, 2.883218459165852, 0.053595465663022805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 82.73684210526316, 80, 87, 83.0, 85.0, 87.0, 87.0, 0.09243178291179575, 0.06869197929284822, 0.046396422281897484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 122.5, 79, 244, 83.0, 244.0, 244.0, 244.0, 0.04753557740871684, 0.012719480673816811, 0.027110133990908822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 115.47368421052633, 79, 247, 82.0, 246.0, 247.0, 247.0, 0.09235944351004774, 0.03931542512079643, 0.05185724511224103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 122.75000000000001, 82, 244, 83.5, 244.0, 244.0, 244.0, 0.047535012507650166, 0.03532631300617361, 0.023860348075129087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0da7a229-183d-458f-bc54-b80f5ff1ac82", 3, 0, 0.0, 440.3333333333333, 210, 643, 468.0, 643.0, 643.0, 643.0, 0.031905389883864384, 0.03199886270578976, 0.020460162132556258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 87.25, 84, 98, 85.5, 98.0, 98.0, 98.0, 0.048499839344282175, 0.03817467823387835, 0.017240177266912803], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 459.25, 389, 620, 430.5, 609.2, 620.0, 620.0, 0.07874532449635803, 0.014226450226392809, 0.053599112474571824], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1926.7619047619048, 959, 4754, 1518.0, 3666.8000000000006, 4659.899999999999, 4754.0, 0.09291007631899126, 0.0480882230947904, 0.04273500580687977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9a2925a-b639-4c7b-8bf8-f51977d10ac5", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 267.875, 167, 489, 171.5, 489.0, 489.0, 489.0, 0.047510734456566284, 0.07363235896735418, 0.10685275532565638], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 953.5084745762714, 421, 3905, 735.0, 1462.0, 1653.0, 3905.0, 0.27730906800652383, 91.02824840106648, 1.0077423281741313], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 188.51785714285717, 80, 1570, 84.5, 327.6, 459.14999999999884, 1570.0, 0.24837998589556506, 0.18458707936184085, 0.1200664970881882], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 519.4821428571427, 382, 725, 484.0, 700.5, 713.8, 725.0, 0.24815765101057774, 72.96658900661606, 0.1248058498734839], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 110.53571428571428, 79, 253, 84.5, 243.60000000000002, 247.75, 253.0, 0.24851666614892362, 0.4397580068963375, 0.120860644279457], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 785.0714285714286, 546, 1145, 775.5, 977.7000000000002, 1041.9, 1145.0, 0.2479335183979953, 223.09101567515398, 0.12445100435211873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 87.49999999999999, 81, 101, 85.5, 96.80000000000001, 101.0, 101.0, 0.11332568384967348, 0.08466225404785177, 0.04028373918093862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, 3.4482758620689653, 171.87931034482767, 80, 2831, 87.0, 286.0, 392.0, 2352.5, 0.7195464376248351, 1.5411635032296884, 0.3463616834802063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 86.25, 83, 89, 86.5, 89.0, 89.0, 89.0, 0.018556921035661762, 0.014370740606718533, 0.006596405524395392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 96.66666666666666, 81, 241, 85.5, 125.80000000000018, 241.0, 241.0, 0.10765485852357343, 0.08736444085262648, 0.03826793799080149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9b80b3e-689d-4bd6-8ae5-2f4226f99034", 3, 0, 0.0, 563.0, 178, 1023, 488.0, 1023.0, 1023.0, 1023.0, 0.02401556208423058, 0.024085920176274225, 0.01540060459177547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 165.0, 163, 168, 164.5, 168.0, 168.0, 168.0, 0.018819455553150847, 0.02916648043247109, 0.04232539662002578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 297.7368421052632, 164, 1018, 168.0, 850.0, 1018.0, 1018.0, 0.09232129755154202, 11.754162923706165, 0.20514631255375287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4ec965f-9114-47b5-bfbd-4b2bad7bd6a5", 3, 0, 0.0, 339.0, 166, 457, 394.0, 457.0, 457.0, 457.0, 0.014955805594468347, 0.020617785381697083, 0.009590799811556848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 110.39999999999998, 80, 252, 88.0, 249.6, 252.0, 252.0, 0.08452085129401422, 0.07007636987169735, 0.030044521358419122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cab8c53e-cd70-4f6d-93f3-e1ce7c710e74", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53455657-6d87-4579-a1b0-49b081b8b5e6", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce1a3e76-8185-4a00-93c3-fd8bce6e322b", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 88.26666666666667, 82, 104, 85.0, 102.2, 104.0, 104.0, 0.0861935216949094, 0.06691782201899706, 0.030639103414987334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1a2e5be-872d-4383-9d8c-8bf0fc3d82fb", 3, 0, 0.0, 370.3333333333333, 179, 529, 403.0, 529.0, 529.0, 529.0, 0.044060627423334504, 0.028326738008165906, 0.02825502474738574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59aec36e-dafd-4be0-b0e7-66a836f5d112", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.5313648897058824, 2.0278033088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 92.25000000000001, 79, 246, 82.0, 133.30000000000013, 246.0, 246.0, 0.10787704713552727, 0.08017034459974244, 0.054149220925450214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 111.49999999999999, 78, 256, 81.0, 246.20000000000002, 256.0, 256.0, 0.10799937900357073, 0.03903639663446935, 0.06102650456634874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae2f59d-d3b2-4f53-913f-98cec42c2720", 3, 0, 0.0, 319.3333333333333, 181, 398, 379.0, 398.0, 398.0, 398.0, 0.029149703158856167, 0.02401624306479979, 0.01869300625746961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 178.5, 79, 871, 82.0, 429.3000000000004, 871.0, 871.0, 0.10799646311583296, 6.100752104665448, 0.06291004907089293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 180.3125, 80, 637, 83.0, 417.2000000000002, 637.0, 637.0, 0.1079971920730061, 2.011961849148172, 0.06301593971056753], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 40.0, 0.46153846153846156], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07692307692307693], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6153846153846154], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 15, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
