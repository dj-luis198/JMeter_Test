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

    var data = {"OkPercent": 98.2985305491106, "KoPercent": 1.7014694508894044};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7222222222222222, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17d70c55-7059-4495-b7bc-ef26999f185c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6ac6e42b-f13b-4d87-89f5-649b1219d54a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6c62d18-2113-4142-922d-dafb1a89f84c"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f005051d-04fd-42dd-9ced-81ab8aecc956"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b80688ad-8112-4e55-933c-99252b066e9b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/282420be-a0c2-4a00-8e5e-0df94189d5d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10f1e632-9230-4a32-bc77-1d97afb4a07c"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/58cf6ed1-0804-4635-b304-81094e8c62f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59ae8746-a510-4cf0-b189-97a98be36e7c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/36b7d875-bbcc-4b9b-ac5f-bcdc03702dbf"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8a55bdd-3f42-4e59-836a-ff73ec04b6ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0703cb2-68d1-4c25-aa08-6418f75d6a77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78752f46-baad-45f2-9366-980795e0d0d9"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4470afe5-d15d-48a0-8694-29a4657a02b6"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b80688ad-8112-4e55-933c-99252b066e9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22413793103448276, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0e10bc1-661f-4f92-9f98-8e25b1e4972a"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f005051d-04fd-42dd-9ced-81ab8aecc956"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58cf6ed1-0804-4635-b304-81094e8c62f2"], "isController": false}, {"data": [0.2818181818181818, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ac6e42b-f13b-4d87-89f5-649b1219d54a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36b7d875-bbcc-4b9b-ac5f-bcdc03702dbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=282420be-a0c2-4a00-8e5e-0df94189d5d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6c62d18-2113-4142-922d-dafb1a89f84c"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9226190476190477, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8a55bdd-3f42-4e59-836a-ff73ec04b6ab"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78752f46-baad-45f2-9366-980795e0d0d9"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59ae8746-a510-4cf0-b189-97a98be36e7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17d70c55-7059-4495-b7bc-ef26999f185c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0703cb2-68d1-4c25-aa08-6418f75d6a77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 22, 1.7014694508894044, 488.05645784996096, 134, 4086, 154.0, 1384.0, 1665.0, 2213.3599999999997, 5.169890684600683, 749.590581105409, 3.783842910842376], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2304.7931034482767, 1686, 3200, 2273.5, 2804.4, 2936.0, 3200.0, 0.2518957325388484, 303.1148948213169, 1.238569348958107], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/17d70c55-7059-4495-b7bc-ef26999f185c", 3, 0, 0.0, 442.33333333333337, 231, 710, 386.0, 710.0, 710.0, 710.0, 0.08298066550493735, 0.03754659018615329, 0.05321351270987194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ac6e42b-f13b-4d87-89f5-649b1219d54a", 3, 0, 0.0, 1151.3333333333333, 253, 2660, 541.0, 2660.0, 2660.0, 2660.0, 0.04630701551285019, 0.029770949100872118, 0.029695579609477503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6c62d18-2113-4142-922d-dafb1a89f84c", 3, 0, 0.0, 382.0, 262, 519, 365.0, 519.0, 519.0, 519.0, 0.014530167048487167, 0.02003100828461691, 0.009317848009609284], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 546.4999999999999, 144, 792, 561.5, 776.5, 792.0, 792.0, 0.08366750533380346, 0.016481378003812847, 0.05629581169432674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 546.4999999999999, 144, 792, 561.5, 776.5, 792.0, 792.0, 0.08221945547229204, 0.016196131574620028, 0.055321489082430876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 141.3888888888889, 134, 146, 142.0, 145.1, 146.0, 146.0, 0.13033655795632276, 0.045750734048253486, 0.07372444407837571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 142.44444444444443, 136, 148, 142.0, 148.0, 148.0, 148.0, 0.1303327830393605, 0.09685864052046224, 0.065420947736554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 227.5555555555556, 136, 1135, 141.0, 498.700000000001, 1135.0, 1135.0, 0.129405167579692, 2.1467974692303264, 0.07558463727012608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f005051d-04fd-42dd-9ced-81ab8aecc956", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 268.0555555555556, 138, 1577, 143.0, 549.2000000000016, 1577.0, 1577.0, 0.12899527017342696, 6.481179511699155, 0.07521924716927046], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 267.0, 143, 473, 255.5, 425.0, 473.0, 473.0, 0.08376412023741145, 0.14447791581406758, 0.054140509076440746], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b80688ad-8112-4e55-933c-99252b066e9b", 3, 0, 0.0, 605.3333333333334, 252, 1036, 528.0, 1036.0, 1036.0, 1036.0, 0.023994625203954314, 0.028360834673033238, 0.015387178272067056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/282420be-a0c2-4a00-8e5e-0df94189d5d5", 3, 0, 0.0, 471.3333333333333, 258, 618, 538.0, 618.0, 618.0, 618.0, 0.06394815935881312, 0.02968426928569906, 0.04100842250548889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 143.12499999999997, 139, 148, 143.0, 146.6, 148.0, 148.0, 0.09297676743023837, 0.06909699220157363, 0.04666997896400637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 175.3125, 138, 417, 141.0, 411.4, 417.0, 417.0, 0.09297946897100784, 0.03360744721962332, 0.05253930198569279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1011.2, 679, 1260, 1134.0, 1260.0, 1260.0, 1260.0, 0.048194164650544116, 14.17068460413313, 0.02748573452726344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1497.0, 1243, 1691, 1502.0, 1691.0, 1691.0, 1691.0, 0.047994778168135306, 43.18578576150915, 0.027325152023459847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 254.8, 142, 421, 151.0, 421.0, 421.0, 421.0, 0.048719172943320115, 0.08621009899735942, 0.026976338924670412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 142.3076923076923, 137, 146, 142.0, 145.2, 146.0, 146.0, 0.058810489981859226, 0.04370584265253405, 0.02952010922917543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 185.38461538461536, 138, 442, 141.0, 431.59999999999997, 442.0, 442.0, 0.05881102209032468, 0.022531265975109366, 0.033160722041013904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 265.61538461538464, 138, 1475, 143.0, 1048.5999999999995, 1475.0, 1475.0, 0.058812086336142745, 4.085341462125016, 0.034186292372977205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10f1e632-9230-4a32-bc77-1d97afb4a07c", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 281.9230769230769, 139, 1114, 143.0, 841.5999999999997, 1114.0, 1114.0, 0.0588115542084191, 1.3448283296387613, 0.034243416216155086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58cf6ed1-0804-4635-b304-81094e8c62f2", 3, 0, 0.0, 1577.0, 377, 3327, 1027.0, 3327.0, 3327.0, 3327.0, 0.02495362784159437, 0.025026734173161543, 0.016002163687480767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 200.6, 143, 426, 145.0, 426.0, 426.0, 426.0, 0.04871822353869689, 0.0362056329228011, 0.02735642435034249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1087.3999999999999, 139, 1974, 1251.0, 1845.0, 1974.0, 1974.0, 0.06704210244033253, 40.222424396062394, 0.03557246971931706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 267.5, 138, 1063, 140.0, 615.7000000000005, 1063.0, 1063.0, 0.09298054963127401, 5.252498716069363, 0.05416298618657709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 801.4666666666666, 139, 1260, 1060.0, 1258.2, 1260.0, 1260.0, 0.0670418027987718, 13.147700633768508, 0.03563778124036274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 252.9375, 136, 1098, 143.5, 626.2000000000005, 1098.0, 1098.0, 0.09298163031666057, 1.732225526217914, 0.05425441808027802], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 487.1428571428571, 148, 851, 512.5, 809.5, 851.0, 851.0, 0.08222863083456187, 0.016197938998102866, 0.05585535763580939], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 455.53846153846155, 283, 1618, 291.0, 1202.7999999999997, 1618.0, 1618.0, 0.05877273487619297, 5.492742980048917, 0.13102452320618832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59ae8746-a510-4cf0-b189-97a98be36e7c", 3, 0, 0.0, 671.0, 268, 1275, 470.0, 1275.0, 1275.0, 1275.0, 0.07058989623285254, 0.031940089766818044, 0.045267609237864416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36b7d875-bbcc-4b9b-ac5f-bcdc03702dbf", 3, 0, 0.0, 990.0, 272, 1783, 915.0, 1783.0, 1783.0, 1783.0, 0.026692053775591005, 0.02225206696591425, 0.017116974589164804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 690.1999999999999, 174, 2004, 621.0, 1321.5000000000005, 1970.9499999999994, 2004.0, 0.09768248308872012, 0.06000222838164546, 0.044166982099684976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 160.59999999999997, 137, 419, 142.0, 255.2000000000001, 419.0, 419.0, 0.0670415031598895, 0.04982283584441008, 0.03365169201580392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 216.26666666666665, 136, 430, 142.0, 427.6, 430.0, 430.0, 0.06704120352368566, 0.08506725629405167, 0.03448082733314562], "isController": false}, {"data": ["login", 20, 0, 0.0, 3531.8000000000006, 1892, 5509, 3374.0, 5111.5, 5490.2, 5509.0, 0.09469517622772296, 28.451947117774758, 0.1821310054497074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 146.5, 141, 165, 145.0, 159.4, 165.0, 165.0, 0.08869671267808636, 0.0718062254005211, 0.03152890958478852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8a55bdd-3f42-4e59-836a-ff73ec04b6ab", 3, 0, 0.0, 350.3333333333333, 243, 557, 251.0, 557.0, 557.0, 557.0, 0.04603768952182186, 0.028638679907617703, 0.0295228673040329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0703cb2-68d1-4c25-aa08-6418f75d6a77", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 0.23523966471354166, 0.8977254231770833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78752f46-baad-45f2-9366-980795e0d0d9", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1249.9999999999998, 284, 2113, 1395.0, 1987.0, 2113.0, 2113.0, 0.06699688687798974, 53.46898975813007, 0.1392497144257697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 428.66666666666663, 279, 1720, 286.0, 694.9000000000017, 1720.0, 1720.0, 0.12886136664638292, 8.753225728872104, 0.2879805455131188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 1007.4444444444445, 143, 2118, 1390.0, 2118.0, 2118.0, 2118.0, 0.07535353366209802, 50.0917520847811, 0.11658702652863016], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1413.8095238095239, 395, 3026, 1395.0, 2482.2000000000003, 2976.6999999999994, 3026.0, 0.08543705120120426, 0.026985140055737506, 0.03854679458491833], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 467.1875, 280, 1241, 424.0, 768.5000000000005, 1241.0, 1241.0, 0.09290064856265279, 7.081321317577964, 0.20745014210896084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 167.57142857142858, 139, 435, 146.5, 294.0, 435.0, 435.0, 0.12398157987956074, 0.09625523047290117, 0.04407157722281261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4470afe5-d15d-48a0-8694-29a4657a02b6", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 471.80952380952374, 278, 1670, 287.0, 856.4, 1588.699999999999, 1670.0, 0.11756275611886155, 6.870948283583761, 0.2629690351596614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 144.0, 137, 153, 143.0, 153.0, 153.0, 153.0, 0.04241219350563287, 0.03151921802518224, 0.021288933068257125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b80688ad-8112-4e55-933c-99252b066e9b", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 141.25, 138, 145, 140.5, 145.0, 145.0, 145.0, 0.0424137675089334, 0.011348996384226321, 0.02418910178243858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 140.375, 137, 143, 140.5, 143.0, 143.0, 143.0, 0.04241444211754102, 0.011432017601993479, 0.024935052885507514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 177.125, 135, 434, 141.0, 434.0, 434.0, 434.0, 0.042413317781783484, 0.01143171455837133, 0.024975811154702578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 150.5, 148, 153, 150.5, 153.0, 153.0, 153.0, 0.02617321433245217, 0.007719053445703667, 0.016179340500431856], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1622.1034482758616, 1098, 2591, 1549.0, 2214.1, 2347.95, 2591.0, 0.2562199604184337, 306.52814913106096, 0.5059343359043681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0e10bc1-661f-4f92-9f98-8e25b1e4972a", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1413.8095238095239, 395, 3026, 1395.0, 2482.2000000000003, 2976.6999999999994, 3026.0, 0.08678259719650887, 0.027410128355593758, 0.039153867094518645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 229.625, 139, 568, 142.0, 568.0, 568.0, 568.0, 0.04768575090155873, 0.012852800047685752, 0.02808057401722648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 211.50000000000003, 137, 431, 143.5, 431.0, 431.0, 431.0, 0.04776718275127031, 0.012874748475928325, 0.02808187892213352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 251.28571428571428, 138, 1408, 141.5, 914.0, 1408.0, 1408.0, 0.12167459000008692, 7.850667594254351, 0.07078446432761752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 251.49999999999994, 137, 1113, 144.0, 772.0, 1113.0, 1113.0, 0.12167353253028801, 2.585885082607638, 0.07090267095131321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 175.75, 137, 423, 140.5, 423.0, 423.0, 423.0, 0.04776718275127031, 0.01278145319711725, 0.027242221412833844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 162.57142857142856, 137, 420, 143.0, 284.5, 420.0, 420.0, 0.12167564748826698, 0.09042496849469842, 0.06107547149313402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 176.25, 139, 411, 143.0, 411.0, 411.0, 411.0, 0.04776518634393322, 0.03549736992942694, 0.023975884551544608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 240.1428571428572, 138, 429, 142.0, 427.0, 429.0, 429.0, 0.12167459000008692, 0.04561099655834731, 0.06866262786695752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 183.25, 143, 437, 146.5, 437.0, 437.0, 437.0, 0.045729441757839745, 0.03599407232111214, 0.016255387499857096], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 700.3571428571429, 144, 1275, 664.0, 1183.0, 1275.0, 1275.0, 0.08270761087250622, 0.015969215045695956, 0.05628455996597173], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1751.6499999999996, 1144, 4086, 1643.0, 2174.9, 3991.0499999999984, 4086.0, 0.09725639703951527, 0.05033778362396787, 0.04473414356016767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f005051d-04fd-42dd-9ced-81ab8aecc956", 3, 0, 0.0, 907.0, 473, 1157, 1091.0, 1157.0, 1157.0, 1157.0, 0.031474584273199394, 0.026239065860567592, 0.020183896815821226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 443.49999999999994, 284, 980, 291.0, 980.0, 980.0, 980.0, 0.047644571496635105, 0.07383978023941397, 0.1071537579655768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58cf6ed1-0804-4635-b304-81094e8c62f2", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["addBook", 55, 9, 16.363636363636363, 1414.3272727272727, 722, 2893, 1193.0, 2471.6, 2661.0, 2893.0, 0.26368400109309004, 87.0901483537129, 0.9569828392654243], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ac6e42b-f13b-4d87-89f5-649b1219d54a", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36b7d875-bbcc-4b9b-ac5f-bcdc03702dbf", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 851.0, 1.1750881316098707, 0.21229619565217392, 0.8101681844888367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=282420be-a0c2-4a00-8e5e-0df94189d5d5", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6c62d18-2113-4142-922d-dafb1a89f84c", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 265.49999999999994, 137, 588, 146.0, 562.3, 570.0, 588.0, 0.2581001161450523, 0.1918107308460789, 0.1247651928630868], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 934.4655172413794, 675, 1272, 845.0, 1155.3000000000002, 1264.15, 1272.0, 0.2578327821046268, 75.81139879285358, 0.12967176053113552], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 225.79310344827587, 137, 592, 145.0, 431.0, 444.8499999999997, 592.0, 0.25832427713741074, 0.45711288102830877, 0.1256303613422173], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1351.8448275862065, 949, 1980, 1262.5, 1660.1, 1842.4499999999998, 1980.0, 0.25691795900829667, 231.17523112926517, 0.12896077239283643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 162.04761904761904, 141, 433, 147.0, 161.6, 405.89999999999964, 433.0, 0.11852152858908586, 0.08854391540102606, 0.042130699615651614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, 5.357142857142857, 214.7916666666668, 135, 732, 150.0, 421.4, 497.4499999999997, 656.7900000000002, 0.7255013732704566, 1.6610848877092295, 0.3446080916075038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 179.0, 140, 411, 145.5, 411.0, 411.0, 411.0, 0.04298140516958851, 0.03328540458933953, 0.015278546368877164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 171.16666666666669, 141, 411, 147.0, 303.00000000000017, 411.0, 411.0, 0.1216972712767396, 0.09876018792086974, 0.04325957689915353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8a55bdd-3f42-4e59-836a-ff73ec04b6ab", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78752f46-baad-45f2-9366-980795e0d0d9", 3, 0, 0.0, 527.0, 247, 753, 581.0, 753.0, 753.0, 753.0, 0.027979854504756575, 0.02806182673475098, 0.01794281034321955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 324.12499999999994, 280, 578, 288.0, 578.0, 578.0, 578.0, 0.04238028892761976, 0.06568117043762946, 0.0953142630862386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 496.3571428571429, 276, 1551, 290.5, 1192.0, 1551.0, 1551.0, 0.12152250336356929, 10.5593951407274, 0.27108605312269435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59ae8746-a510-4cf0-b189-97a98be36e7c", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 0.6316925262237763, 2.4106752622377625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 167.3846153846154, 142, 422, 145.0, 315.19999999999993, 422.0, 422.0, 0.06061679924648656, 0.05025748296901083, 0.02154737785714952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 146.0, 141, 168, 144.0, 159.6, 168.0, 168.0, 0.06803183890060549, 0.05281768742771617, 0.024183192734199603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17d70c55-7059-4495-b7bc-ef26999f185c", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0703cb2-68d1-4c25-aa08-6418f75d6a77", 3, 0, 0.0, 361.0, 295, 472, 316.0, 472.0, 472.0, 472.0, 0.022596997612250584, 0.022663199753692728, 0.014490913182335174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 169.95238095238096, 138, 432, 143.0, 375.4000000000002, 431.9, 432.0, 0.11765628676758962, 0.08743792405286689, 0.05905794081888776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 220.42857142857144, 136, 422, 142.0, 421.6, 422.0, 422.0, 0.11765562758072017, 0.03989698829606638, 0.06662994013569616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 273.3333333333333, 137, 1516, 144.0, 424.0, 1406.7999999999984, 1516.0, 0.11765628676758962, 5.0715035510488224, 0.06868754762278274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 225.42857142857144, 136, 829, 141.0, 423.2, 788.4999999999994, 829.0, 0.11765562758072017, 1.6775665909842175, 0.06880206086437668], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.3866976024748647], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15467904098994587], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15467904098994587], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 1.005413766434648], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 22, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
