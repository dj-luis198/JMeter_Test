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

    var data = {"OkPercent": 97.82445611402851, "KoPercent": 2.175543885971493};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7633612363168062, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22910da5-218b-4f54-8a17-19961c144287"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/276928bf-1864-4ab9-a2b6-844c537f86f4"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84730849-10fc-4016-a80e-0be988b5ad74"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd32b4f6-c337-4614-a308-aac619a5d779"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47bffdae-ef55-4568-a450-5d3e190b1106"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ebe711a0-3a60-434e-965d-c34f08f499dd"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f45da1eb-962e-4b1c-8908-e2a2add74ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4415e1d2-e6b5-4651-875e-acb5956057f3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8185e27-df78-499e-bdc0-bf91abe37efb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ada7862c-a581-4c43-a0c5-dd0994c7df8b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e76b3c6-b000-41c3-8b57-5c199431e965"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d602082c-9325-4d27-ba8d-eb441ea142c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5546ec69-cbe3-4749-8106-90d37a9e916e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3416eeb4-a443-403d-b52d-0f4d92fd97b8"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ada7862c-a581-4c43-a0c5-dd0994c7df8b"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22910da5-218b-4f54-8a17-19961c144287"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebe711a0-3a60-434e-965d-c34f08f499dd"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21666666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=276928bf-1864-4ab9-a2b6-844c537f86f4"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8813559322033898, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3416eeb4-a443-403d-b52d-0f4d92fd97b8"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a48f759-c36c-489a-8c3c-e937b525038f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4415e1d2-e6b5-4651-875e-acb5956057f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47bffdae-ef55-4568-a450-5d3e190b1106"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f45da1eb-962e-4b1c-8908-e2a2add74ede"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e76b3c6-b000-41c3-8b57-5c199431e965"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d602082c-9325-4d27-ba8d-eb441ea142c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8185e27-df78-499e-bdc0-bf91abe37efb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd32b4f6-c337-4614-a308-aac619a5d779"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5546ec69-cbe3-4749-8106-90d37a9e916e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84730849-10fc-4016-a80e-0be988b5ad74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 29, 2.175543885971493, 398.35108777194296, 105, 4099, 126.0, 1111.6000000000001, 1343.1999999999998, 1901.5600000000013, 5.140684293339092, 723.0746740252272, 3.7605549977053965], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22910da5-218b-4f54-8a17-19961c144287", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.23341610142118863, 0.890766311369509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/276928bf-1864-4ab9-a2b6-844c537f86f4", 2, 0, 0.0, 336.5, 227, 446, 336.5, 446.0, 446.0, 446.0, 0.022096029343526967, 0.031050963110679012, 0.013734494801909098], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1808.6140350877192, 1316, 2522, 1770.0, 2206.2000000000003, 2324.899999999999, 2522.0, 0.2599866813840414, 312.85241718483456, 1.2783524812193832], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/84730849-10fc-4016-a80e-0be988b5ad74", 3, 0, 0.0, 366.0, 206, 504, 388.0, 504.0, 504.0, 504.0, 0.04624277456647399, 0.029729648362235066, 0.029654383429672446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd32b4f6-c337-4614-a308-aac619a5d779", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 693.4, 131, 1763, 526.0, 1374.2000000000003, 1763.0, 1763.0, 0.08724785370279892, 0.01642713495498011, 0.05902294582199111], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 693.4, 131, 1763, 526.0, 1374.2000000000003, 1763.0, 1763.0, 0.08826073397626374, 0.01661784131896841, 0.05970815668928103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 181.0, 106, 345, 113.0, 345.0, 345.0, 345.0, 0.12334163319740059, 0.04458185740936317, 0.06969585205941983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 128.56249999999997, 107, 331, 115.0, 189.60000000000014, 331.0, 331.0, 0.12333307638942419, 0.09165671009018732, 0.061907423109535197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47bffdae-ef55-4568-a450-5d3e190b1106", 3, 0, 0.0, 399.0, 228, 516, 453.0, 516.0, 516.0, 516.0, 0.09470294841846076, 0.043898762548140666, 0.06073073189595302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 257.3125, 109, 889, 220.5, 507.5000000000004, 889.0, 889.0, 0.123115751890981, 2.2936170013234944, 0.07183756030748159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 243.8125, 109, 1143, 112.0, 581.6000000000006, 1143.0, 1143.0, 0.12313375404032631, 6.955862140699554, 0.07172781668462368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebe711a0-3a60-434e-965d-c34f08f499dd", 3, 0, 0.0, 527.0, 254, 912, 415.0, 912.0, 912.0, 912.0, 0.0820681165367255, 0.03713368554233347, 0.052628316919710025], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 219.73333333333335, 116, 256, 222.0, 254.8, 256.0, 256.0, 0.08719358720230656, 0.15229359098069534, 0.05636361506065767], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f45da1eb-962e-4b1c-8908-e2a2add74ede", 3, 0, 0.0, 412.6666666666667, 217, 520, 501.0, 520.0, 520.0, 520.0, 0.061275761351334786, 0.027725686288527132, 0.03929467768949529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 123.71428571428571, 108, 336, 113.0, 123.4, 314.7999999999997, 336.0, 0.11627906976744187, 0.08641442587209303, 0.05836664244186047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 121.14285714285714, 108, 324, 111.0, 114.6, 303.0999999999997, 324.0, 0.11627456300143406, 0.047744809863405076, 0.0653828132353674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 783.6666666666666, 547, 995, 814.0, 995.0, 995.0, 995.0, 0.05552111190280104, 16.325050373842153, 0.03166438413206622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1142.5, 768, 1351, 1191.5, 1351.0, 1351.0, 1351.0, 0.05517241379310345, 49.644234913793106, 0.031411637931034485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 149.0, 107, 333, 114.0, 333.0, 333.0, 333.0, 0.055807204710128074, 0.09875259270971883, 0.03090105963929943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 146.28571428571428, 109, 346, 115.5, 337.5, 346.0, 346.0, 0.0688647643595331, 0.051177818044535826, 0.034566883672656264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 158.5, 107, 335, 112.5, 332.0, 335.0, 335.0, 0.06886374815543532, 0.01842643261190359, 0.0392738563698967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 190.78571428571425, 106, 340, 114.5, 339.0, 340.0, 340.0, 0.06879201226463305, 0.018541597055701874, 0.040442179085262785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 197.85714285714286, 106, 454, 113.5, 396.0, 454.0, 454.0, 0.06886340942740075, 0.01856084082222911, 0.04055140223117447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 112.5, 109, 118, 111.5, 118.0, 118.0, 118.0, 0.055808242877473, 0.04147468049780953, 0.03133763638139353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 945.923076923077, 113, 1415, 1222.0, 1384.2, 1415.0, 1415.0, 0.07586323609222635, 52.51385187921989, 0.03958428770256943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 222.42857142857142, 106, 1319, 113.0, 690.6000000000004, 1264.7999999999993, 1319.0, 0.11627198786341918, 9.992329422764948, 0.0674035807619691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 678.5384615384617, 110, 1008, 854.0, 999.2, 1008.0, 1008.0, 0.07586367880485528, 17.163519053454714, 0.039658604327147524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 205.23809523809524, 108, 921, 112.0, 723.6000000000004, 910.8999999999999, 921.0, 0.11627198786341918, 3.2843376095586647, 0.06751712762511697], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 536.9333333333333, 119, 1179, 486.0, 943.8000000000002, 1179.0, 1179.0, 0.0881575080811049, 0.016598405818395532, 0.06036149169850132], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 394.2857142857143, 220, 681, 443.0, 670.0, 681.0, 681.0, 0.06875451201485099, 0.10655606500739112, 0.1546305089552752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 592.952380952381, 116, 1294, 497.0, 1119.8, 1276.7999999999997, 1294.0, 0.10334086245331207, 0.06347793211243485, 0.04672540948816747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 112.84615384615384, 108, 120, 112.0, 119.2, 120.0, 120.0, 0.07586190798534113, 0.056377843727387314, 0.03807912178170444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 213.46153846153842, 107, 342, 115.0, 339.2, 342.0, 342.0, 0.07586367880485528, 0.10794845281862744, 0.038364955357142856], "isController": false}, {"data": ["login", 21, 0, 0.0, 3210.2380952380954, 1940, 5397, 3141.0, 5154.400000000001, 5388.3, 5397.0, 0.10255959445006081, 35.1957400224166, 0.2033306915080656], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 119.42857142857142, 111, 141, 117.0, 135.2, 140.5, 141.0, 0.11269117252481889, 0.09123142775690904, 0.04005819023343172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4415e1d2-e6b5-4651-875e-acb5956057f3", 3, 0, 0.0, 1549.3333333333333, 212, 3974, 462.0, 3974.0, 3974.0, 3974.0, 0.03739669163934631, 0.031176083101681604, 0.023981602385908924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1059.8461538461538, 228, 1534, 1333.0, 1501.6, 1534.0, 1534.0, 0.07581147435822672, 69.793944276015, 0.15558095462683258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8185e27-df78-499e-bdc0-bf91abe37efb", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ada7862c-a581-4c43-a0c5-dd0994c7df8b", 1, 0, 0.0, 787.0, 787, 787, 787.0, 787.0, 787.0, 787.0, 1.2706480304955527, 0.22956043519695044, 0.8760522554002541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e76b3c6-b000-41c3-8b57-5c199431e965", 3, 0, 0.0, 561.6666666666666, 213, 1029, 443.0, 1029.0, 1029.0, 1029.0, 0.02225024104427798, 0.026299031650967884, 0.014268546503003781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 445.75, 225, 1260, 447.5, 851.9000000000004, 1260.0, 1260.0, 0.1230059581010955, 9.376088614741496, 0.27467626849894294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 982.0, 116, 1469, 1233.0, 1469.0, 1469.0, 1469.0, 0.05776632079082093, 51.83531611716454, 0.10726117011098354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d602082c-9325-4d27-ba8d-eb441ea142c5", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5546ec69-cbe3-4749-8106-90d37a9e916e", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.6339089912280702, 2.419133771929825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3416eeb4-a443-403d-b52d-0f4d92fd97b8", 3, 0, 0.0, 330.6666666666667, 256, 442, 294.0, 442.0, 442.0, 442.0, 0.05350454788657036, 0.03391059724451578, 0.03431118467986446], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1304.5217391304345, 115, 3006, 1276.0, 1900.6, 2786.199999999997, 3006.0, 0.094293210888816, 0.02970684548212529, 0.04254244475647754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 129.3888888888889, 110, 325, 118.0, 147.70000000000027, 325.0, 325.0, 0.08004696088371845, 0.062145833889215005, 0.028454193126634292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 371.23809523809524, 220, 1430, 229.0, 884.4000000000002, 1380.4999999999993, 1430.0, 0.11620121623939664, 13.402657143123932, 0.2585077187349561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ada7862c-a581-4c43-a0c5-dd0994c7df8b", 3, 0, 0.0, 443.0, 204, 782, 343.0, 782.0, 782.0, 782.0, 0.017136492160054837, 0.023624037857367264, 0.010989221860451832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 379.84615384615387, 223, 1306, 233.0, 965.5999999999997, 1306.0, 1306.0, 0.08956745807553981, 8.37073564164749, 0.19967649138429952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 152.72727272727272, 111, 321, 116.0, 320.2, 321.0, 321.0, 0.05324092000309766, 0.039566738400739564, 0.026724446173429877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 152.0909090909091, 110, 329, 114.0, 327.2, 329.0, 329.0, 0.053245043370508054, 0.014247208870624225, 0.03036631379724287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 132.36363636363637, 105, 328, 113.0, 287.0000000000001, 328.0, 328.0, 0.05318917455236474, 0.014336144703567059, 0.031269417070823806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 152.0, 106, 331, 114.0, 327.6, 331.0, 331.0, 0.05324530110217773, 0.014351272562696341, 0.03135441070763005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 2.4783350840336134, 5.194655987394958], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1253.1578947368419, 856, 2042, 1138.0, 1745.6000000000001, 1868.5999999999995, 2042.0, 0.2566931616041071, 307.094262260476, 0.5068687234018598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1304.5217391304345, 115, 3006, 1276.0, 1900.6, 2786.199999999997, 3006.0, 0.08984024061560095, 0.028303948087965315, 0.040533389808991835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 112.0, 107, 116, 113.0, 115.8, 116.0, 116.0, 0.053494920414147946, 0.014418552767875813, 0.03150140332981564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22910da5-218b-4f54-8a17-19961c144287", 3, 0, 0.0, 292.6666666666667, 211, 435, 232.0, 435.0, 435.0, 435.0, 0.028430090407687496, 0.023423358991489927, 0.018231535840867306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 111.45454545454545, 106, 117, 111.0, 116.6, 117.0, 117.0, 0.053495180570550416, 0.014418622888156167, 0.03144931514010874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 194.83333333333331, 106, 1196, 111.0, 424.7000000000012, 1196.0, 1196.0, 0.08231243054888672, 4.135668212597003, 0.04799772154619328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebe711a0-3a60-434e-965d-c34f08f499dd", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 164.6111111111111, 106, 645, 112.0, 360.6000000000005, 645.0, 645.0, 0.08239004362095087, 1.366829010335373, 0.04812343802208968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 124.22222222222221, 109, 315, 114.0, 136.8000000000003, 315.0, 315.0, 0.08238627261617609, 0.06122651705166992, 0.04135404699679151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 109.9090909090909, 107, 115, 109.0, 114.4, 115.0, 115.0, 0.05349674156210485, 0.014314557800797588, 0.030509860422137925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 161.16666666666666, 108, 345, 112.0, 336.90000000000003, 345.0, 345.0, 0.0823071611802847, 0.02889145685961599, 0.04655677422231164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 112.81818181818183, 108, 118, 112.0, 117.8, 118.0, 118.0, 0.05349440010893405, 0.03975511570595587, 0.026851681304679787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 200.63636363636363, 112, 349, 126.0, 348.6, 349.0, 349.0, 0.05352850149393182, 0.04213278535557524, 0.019027709515421074], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 775.3571428571429, 116, 3974, 502.5, 2443.0, 3974.0, 3974.0, 0.0844783162264743, 0.015786649635234698, 0.05749546117617953], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1969.1428571428569, 1127, 4099, 1685.0, 3668.4, 4057.8999999999996, 4099.0, 0.10464733846935825, 0.054163173231210816, 0.04813368790924584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 226.54545454545453, 218, 231, 227.0, 231.0, 231.0, 231.0, 0.053464499572284004, 0.0828595320519675, 0.12024291261227545], "isController": false}, {"data": ["addBook", 60, 19, 31.666666666666668, 1119.4499999999998, 564, 3752, 925.5, 1898.3, 2202.049999999999, 3752.0, 0.2711374214831217, 82.17368099411406, 0.9843426965181437], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=276928bf-1864-4ab9-a2b6-844c537f86f4", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 202.05263157894737, 108, 573, 116.0, 445.2, 458.2, 573.0, 0.25774128201418034, 0.19154405821561643, 0.12459173300490162], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 721.263157894737, 525, 1021, 669.0, 901.0, 972.0999999999999, 1021.0, 0.2576573970274473, 75.75982975683019, 0.1295835541690775], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 189.52631578947373, 106, 440, 118.0, 339.0, 344.29999999999995, 440.0, 0.25816971261634625, 0.4568393742781439, 0.1255551922684965], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1049.4561403508771, 744, 1592, 1020.0, 1351.6000000000001, 1423.1999999999998, 1592.0, 0.2572550435528275, 231.47854039496548, 0.12912997303335289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 134.0769230769231, 111, 333, 116.0, 250.5999999999999, 333.0, 333.0, 0.09107021513586976, 0.06803585408099644, 0.0323726155365787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 19, 10.734463276836157, 176.10169491525411, 109, 2149, 119.0, 299.20000000000005, 362.19999999999993, 1315.9599999999987, 0.7336939625691724, 1.6039435402806275, 0.3509018645464155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 140.54545454545453, 114, 366, 119.0, 317.60000000000014, 366.0, 366.0, 0.0525315428036562, 0.040681165471972036, 0.018673321855987163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 132.56250000000003, 113, 341, 118.0, 197.50000000000014, 341.0, 341.0, 0.12453493983405718, 0.10106302246298976, 0.044268279394137515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3416eeb4-a443-403d-b52d-0f4d92fd97b8", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 327.27272727272725, 223, 652, 235.0, 649.2, 652.0, 652.0, 0.05315627461497943, 0.08238184356833239, 0.11954970745927504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 359.27777777777777, 220, 1306, 229.5, 713.800000000001, 1306.0, 1306.0, 0.08226277472339141, 5.58790159515518, 0.18384159160188474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a48f759-c36c-489a-8c3c-e937b525038f", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4415e1d2-e6b5-4651-875e-acb5956057f3", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.2516212569637883, 0.9602411211699164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47bffdae-ef55-4568-a450-5d3e190b1106", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f45da1eb-962e-4b1c-8908-e2a2add74ede", 1, 0, 0.0, 1179.0, 1179, 1179, 1179.0, 1179.0, 1179.0, 1179.0, 0.8481764206955047, 0.15323499787955894, 0.5847778837998303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e76b3c6-b000-41c3-8b57-5c199431e965", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 119.5714285714286, 113, 131, 117.0, 131.0, 131.0, 131.0, 0.07236002212149248, 0.059993807403463974, 0.02572172661349928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d602082c-9325-4d27-ba8d-eb441ea142c5", 3, 0, 0.0, 330.6666666666667, 219, 479, 294.0, 479.0, 479.0, 479.0, 0.04517528008673654, 0.029043352269304903, 0.028969824795205396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 139.0, 112, 343, 120.0, 260.19999999999993, 343.0, 343.0, 0.07391529307413704, 0.057385408197206, 0.02627457683494715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8185e27-df78-499e-bdc0-bf91abe37efb", 3, 0, 0.0, 387.0, 222, 703, 236.0, 703.0, 703.0, 703.0, 0.016823121698462368, 0.02319203137792582, 0.010788264891266558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd32b4f6-c337-4614-a308-aac619a5d779", 3, 0, 0.0, 340.6666666666667, 234, 548, 240.0, 548.0, 548.0, 548.0, 0.042407022602943045, 0.02726362944036866, 0.027194607593684184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5546ec69-cbe3-4749-8106-90d37a9e916e", 3, 0, 0.0, 370.0, 250, 563, 297.0, 563.0, 563.0, 563.0, 0.09205842641463115, 0.04165404059776605, 0.059034863293236775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84730849-10fc-4016-a80e-0be988b5ad74", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 130.6923076923077, 110, 331, 114.0, 246.5999999999999, 331.0, 331.0, 0.08963848111041392, 0.06661609777834474, 0.04499431571362574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 145.84615384615384, 109, 328, 112.0, 327.6, 328.0, 328.0, 0.08963848111041392, 0.03434166568983707, 0.05054285150351314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 212.0, 108, 975, 113.0, 721.7999999999997, 975.0, 975.0, 0.08964033539276259, 6.226804755161215, 0.05210613846673654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 217.92307692307693, 109, 832, 112.0, 635.9999999999998, 832.0, 832.0, 0.08964157162361573, 2.0498102227593056, 0.05219439766035498], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.689655172413794, 0.450112528132033], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.4482758620689653, 0.07501875468867217], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.4482758620689653, 0.07501875468867217], "isController": false}, {"data": ["401/Unauthorized", 21, 72.41379310344827, 1.5753938484621155], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 29, "401/Unauthorized", 21, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
