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

    var data = {"OkPercent": 99.77203647416414, "KoPercent": 0.22796352583586627};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8260300850228908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f7b5099-c288-40b8-83df-3634cfd75a90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72c89cd3-a3f9-4b8c-81b9-d3e90831bf7a"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "see books"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e87f070a-ff0c-4697-bbd5-afebbf07d027"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7feaaaa5-8a22-4052-8732-17e4a68ca382"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0249853f-093b-4f2b-8335-4b268d2fa38a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c29b2ad4-b08e-4f4c-bfeb-e6979d17388c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/20532baa-9574-4a69-8063-29bdc448c810"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f07d14bf-0335-40f5-b3fb-c36a07d8c733"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39d0bb31-8470-409c-aec7-705feb8afc32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99406c71-3408-4bc6-85db-626901faa05c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9a7f069-6c26-439d-8c4b-b9da04fd4b85"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e87f070a-ff0c-4697-bbd5-afebbf07d027"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60573099-6936-45e0-8b2f-6efe49692f62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4196b169-b6a3-47a6-8fc4-f9e765aecbc6"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d6b8003-c15a-4686-b90f-6eb18c29b71f"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c29b2ad4-b08e-4f4c-bfeb-e6979d17388c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fdfe7d7-5143-4e43-85f2-d5ced9d2a979"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=420b7110-3d8d-4b4c-badb-0cb32b133fba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0249853f-093b-4f2b-8335-4b268d2fa38a"], "isController": false}, {"data": [0.3548387096774194, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5350877192982456, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9834254143646409, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f07d14bf-0335-40f5-b3fb-c36a07d8c733"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd674f8b-9c45-43c4-83d1-7f688e0f622d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5ae6b586-3574-4db6-87ac-d473344e3949"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4196b169-b6a3-47a6-8fc4-f9e765aecbc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd674f8b-9c45-43c4-83d1-7f688e0f622d"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9a7f069-6c26-439d-8c4b-b9da04fd4b85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99406c71-3408-4bc6-85db-626901faa05c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/420b7110-3d8d-4b4c-badb-0cb32b133fba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39d0bb31-8470-409c-aec7-705feb8afc32"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72c89cd3-a3f9-4b8c-81b9-d3e90831bf7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60573099-6936-45e0-8b2f-6efe49692f62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d6b8003-c15a-4686-b90f-6eb18c29b71f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f7b5099-c288-40b8-83df-3634cfd75a90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 3, 0.22796352583586627, 333.9004559270518, 93, 2072, 105.0, 916.6999999999991, 1115.4499999999996, 1470.8799999999974, 5.088743668071613, 706.483361468524, 3.710208693834345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/4f7b5099-c288-40b8-83df-3634cfd75a90", 2, 0, 0.0, 197.0, 193, 201, 197.0, 201.0, 201.0, 201.0, 0.01408004505614418, 0.027671963550283365, 0.00875190300608962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72c89cd3-a3f9-4b8c-81b9-d3e90831bf7a", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1671.157894736842, 1198, 2201, 1706.0, 2027.8, 2127.0, 2201.0, 0.24141903567919223, 290.5080485916693, 1.187055512348372], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 485.07142857142856, 420, 960, 441.0, 736.5, 960.0, 960.0, 0.0779761838455626, 0.014087494151786211, 0.05299943745753083], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 485.07142857142856, 420, 960, 441.0, 736.5, 960.0, 960.0, 0.07998720204767237, 0.01445081286994081, 0.05436630139177732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 163.73684210526312, 97, 304, 102.0, 303.0, 304.0, 304.0, 0.10437037199797851, 0.044428218590011205, 0.058601045626332095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 122.42105263157896, 97, 304, 102.0, 301.0, 304.0, 304.0, 0.1043675054518289, 0.07756217934457206, 0.05238759551000005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 232.57894736842104, 96, 797, 103.0, 498.0, 797.0, 797.0, 0.10436807874846195, 3.2554515155343644, 0.06051481786396994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e87f070a-ff0c-4697-bbd5-afebbf07d027", 3, 0, 0.0, 580.3333333333334, 222, 953, 566.0, 953.0, 953.0, 953.0, 0.03199215125889115, 0.026670540160813883, 0.020515800123702986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 219.68421052631578, 96, 937, 101.0, 930.0, 937.0, 937.0, 0.10436922536062314, 9.910602522851368, 0.06041355962229327], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 340.00000000000006, 191, 1376, 195.5, 1164.5, 1376.0, 1376.0, 0.07722135501414805, 0.17657597926330829, 0.04992239943297462], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 111.89999999999999, 99, 302, 102.0, 103.9, 292.09999999999985, 302.0, 0.10377427020744477, 0.07712130823033737, 0.052089819225221295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 130.59999999999997, 98, 301, 101.5, 299.20000000000005, 300.95, 301.0, 0.10367260192312677, 0.035526089858227715, 0.05869043685042635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 368.0015057884856, 0.7137828535669587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7feaaaa5-8a22-4052-8732-17e4a68ca382", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1093.0, 1093, 1093, 1093.0, 1093.0, 1093.0, 1093.0, 0.9149130832570906, 823.2404005603843, 0.5208928979871912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 5.840037128712871, 1.8274288366336635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 101.55555555555557, 101, 103, 101.0, 103.0, 103.0, 103.0, 0.09788566953797964, 0.07274511183437744, 0.04913401771730618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0249853f-093b-4f2b-8335-4b268d2fa38a", 3, 0, 0.0, 300.3333333333333, 191, 494, 216.0, 494.0, 494.0, 494.0, 0.020519134092541295, 0.024252921839198385, 0.01315842908929243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 143.88888888888889, 99, 304, 101.0, 304.0, 304.0, 304.0, 0.09788673417225889, 0.07519944422087597, 0.053085709352533636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c29b2ad4-b08e-4f4c-bfeb-e6979d17388c", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 499.6666666666667, 100, 1118, 300.0, 1118.0, 1118.0, 1118.0, 0.09767638727602261, 29.31401288175188, 0.054625010852931914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 365.22222222222223, 100, 900, 300.0, 900.0, 900.0, 900.0, 0.0976732071540198, 9.590605974073188, 0.054718616377626324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 2.468983596345515, 1.8655263704318938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20532baa-9574-4a69-8063-29bdc448c810", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.5702427455357142, 1.0654994419642856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 708.2777777777778, 96, 1386, 988.5, 1308.6000000000001, 1386.0, 1386.0, 0.08965974128183543, 44.83073649562411, 0.04842949133040113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 155.4, 99, 996, 101.0, 271.3000000000004, 960.6999999999995, 996.0, 0.10377588559746372, 4.695458515914032, 0.060562958235394836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 500.6666666666665, 101, 870, 648.0, 861.0, 870.0, 870.0, 0.08966018788790484, 14.65689178637962, 0.048517291340818294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 165.79999999999998, 96, 801, 101.5, 300.0, 775.9499999999996, 801.0, 0.10366937762089146, 1.5506569884823322, 0.06060204047252503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f07d14bf-0335-40f5-b3fb-c36a07d8c733", 3, 0, 0.0, 656.3333333333334, 193, 1340, 436.0, 1340.0, 1340.0, 1340.0, 0.033737053405755536, 0.028125193285201803, 0.02163476406553985], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 528.0, 194, 2072, 410.5, 1399.5, 2072.0, 2072.0, 0.08003567304284195, 0.014459569836841563, 0.055180844890865645], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 602.4444444444445, 203, 1221, 404.0, 1221.0, 1221.0, 1221.0, 0.09756414842759115, 39.00768368483528, 0.21110315579368436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 361.3157894736843, 113, 629, 397.0, 621.0, 629.0, 629.0, 0.0934469123172867, 0.05740049594489583, 0.04225187539346068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 124.33333333333334, 99, 305, 102.0, 302.3, 305.0, 305.0, 0.08965884808304402, 0.06663123378046533, 0.0450045389791842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 146.05555555555557, 99, 304, 102.0, 304.0, 304.0, 304.0, 0.08965974128183543, 0.09880472357403654, 0.04695072823634308], "isController": false}, {"data": ["login", 19, 0, 0.0, 1780.8421052631581, 1071, 3046, 1580.0, 2761.0, 3046.0, 3046.0, 0.08957700793935165, 5.768762073743093, 0.14297054006685272], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 113.0, 98, 298, 103.0, 105.0, 288.34999999999985, 298.0, 0.10480147979689473, 0.0848441667496345, 0.037253651021552425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39d0bb31-8470-409c-aec7-705feb8afc32", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.2485062757909216, 0.9483536795048143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99406c71-3408-4bc6-85db-626901faa05c", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9a7f069-6c26-439d-8c4b-b9da04fd4b85", 3, 0, 0.0, 386.0, 198, 747, 213.0, 747.0, 747.0, 747.0, 0.052326798297634834, 0.033947691734110094, 0.03355592208539734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 834.0555555555555, 202, 1490, 1090.5, 1410.8000000000002, 1490.0, 1490.0, 0.08961331853054072, 59.6221056142744, 0.188804449425728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e87f070a-ff0c-4697-bbd5-afebbf07d027", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60573099-6936-45e0-8b2f-6efe49692f62", 2, 0, 0.0, 196.5, 195, 198, 196.5, 198.0, 198.0, 198.0, 0.012328784012032893, 0.024380651976920516, 0.00766335060904193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4196b169-b6a3-47a6-8fc4-f9e765aecbc6", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 417.5263157894736, 199, 1039, 403.0, 1032.0, 1039.0, 1039.0, 0.10430906226153028, 13.28042114612327, 0.23178421508803135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1394.0, 1394, 1394, 1394.0, 1394.0, 1394.0, 1394.0, 0.7173601147776184, 858.2120920014348, 1.617562993185079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d6b8003-c15a-4686-b90f-6eb18c29b71f", 3, 0, 0.0, 332.0, 192, 527, 277.0, 527.0, 527.0, 527.0, 0.041031813332603875, 0.02552467294225456, 0.026312718836337772], "isController": false}, {"data": ["register", 21, 1, 4.761904761904762, 724.5714285714287, 429, 1245, 786.0, 990.6, 1220.1999999999996, 1245.0, 0.08476115517345764, 0.027339256523581764, 0.038241849306774836], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 308.7, 203, 1098, 206.0, 581.2000000000004, 1073.1499999999996, 1098.0, 0.10361352156456417, 6.350441369317446, 0.23170371389716357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 103.0, 99, 105, 103.0, 105.0, 105.0, 105.0, 0.08887203611759548, 0.06899733272801602, 0.031591231588676515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c29b2ad4-b08e-4f4c-bfeb-e6979d17388c", 3, 0, 0.0, 267.6666666666667, 195, 407, 201.0, 407.0, 407.0, 407.0, 0.08360271987515326, 0.038753344108795, 0.05361242127410545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 389.6, 198, 1212, 206.0, 1198.8, 1212.0, 1212.0, 0.10981127102885839, 17.663822116264512, 0.24322195648911402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 101.07692307692307, 95, 104, 102.0, 103.6, 104.0, 104.0, 0.0592352276455364, 0.04402149242016914, 0.029733307626763388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 134.3846153846154, 96, 330, 102.0, 318.8, 330.0, 330.0, 0.059174021694106724, 0.0158336737736184, 0.03374768424742024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 124.07692307692307, 93, 408, 101.0, 286.39999999999986, 408.0, 408.0, 0.059235767467716506, 0.015965890450282967, 0.034824152358950526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 101.46153846153847, 100, 103, 101.0, 103.0, 103.0, 103.0, 0.059235767467716506, 0.015965890450282967, 0.03488199978811822], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1149.385964912281, 768, 1788, 1098.0, 1612.4, 1714.5, 1788.0, 0.24544315407371048, 293.63534211869114, 0.4846543530635181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 1, 4.761904761904762, 724.5714285714287, 429, 1245, 786.0, 990.6, 1220.1999999999996, 1245.0, 0.08204342832139146, 0.02646266828669881, 0.037015687387190285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fdfe7d7-5143-4e43-85f2-d5ced9d2a979", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 160.6, 96, 304, 102.0, 303.7, 304.0, 304.0, 0.05212296850730243, 0.014048768855483857, 0.03069350586904625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 121.0, 100, 302, 101.0, 282.00000000000006, 302.0, 302.0, 0.05217736128648502, 0.014063429409247916, 0.030674581537562483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 140.13333333333333, 100, 300, 101.0, 300.0, 300.0, 300.0, 0.08935113207884343, 0.02408292231812577, 0.05252869288228881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 152.6, 97, 304, 101.0, 302.8, 304.0, 304.0, 0.08935166432366747, 0.024083065774738496, 0.05261626326872215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=420b7110-3d8d-4b4c-badb-0cb32b133fba", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 160.9, 98, 301, 102.0, 300.9, 301.0, 301.0, 0.05212324018910311, 0.013947038878724857, 0.02972653542034787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 114.73333333333333, 99, 304, 101.0, 183.4000000000001, 304.0, 304.0, 0.08935219657483247, 0.06640334139985107, 0.044850614296351454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 121.9, 99, 303, 102.0, 283.1000000000001, 303.0, 303.0, 0.05217654455616023, 0.03877573281956829, 0.02619017959166636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 112.6, 96, 286, 101.0, 175.60000000000008, 286.0, 286.0, 0.08935219657483247, 0.02390869322412509, 0.05095867460908414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 123.4, 102, 304, 103.5, 284.1000000000001, 304.0, 304.0, 0.05323367988458938, 0.04190072850290922, 0.018922909646475132], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 480.91666666666663, 406, 747, 440.5, 692.7000000000002, 747.0, 747.0, 0.07256981821260537, 0.013110758173175776, 0.049395667279478465], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 953.6842105263157, 731, 1479, 859.0, 1477.0, 1479.0, 1479.0, 0.09217976023559206, 0.047710227465687295, 0.042399088936488145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 304.5, 202, 604, 206.5, 584.3000000000001, 604.0, 604.0, 0.05209472905531418, 0.08073665528396837, 0.11716226661561384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0249853f-093b-4f2b-8335-4b268d2fa38a", 1, 0, 0.0, 2072.0, 2072, 2072, 2072.0, 2072.0, 2072.0, 2072.0, 0.48262548262548266, 0.08719308035714285, 0.3327476472007722], "isController": false}, {"data": ["addBook", 62, 2, 3.225806451612903, 1042.4032258064517, 510, 2387, 823.0, 1774.7000000000003, 1885.2999999999995, 2387.0, 0.2932731650323783, 102.95299765381468, 1.0652724587525484], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 176.03508771929822, 98, 412, 103.0, 410.0, 410.0, 412.0, 0.2461905255519851, 0.1829599511182233, 0.11900811537913342], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 660.9473684210527, 482, 909, 598.0, 896.4, 906.1, 909.0, 0.24609592560131596, 72.36037328056663, 0.1237689469576931], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 136.56140350877192, 96, 304, 103.0, 300.0, 303.0, 304.0, 0.24656112120425644, 0.43629760900596937, 0.11990960777316377], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 971.7719298245615, 665, 1397, 987.0, 1206.2, 1302.6, 1397.0, 0.24592179686859575, 221.28086510677105, 0.12344121444380686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 103.53333333333333, 101, 112, 103.0, 107.8, 112.0, 112.0, 0.11325028312570781, 0.08460592440543602, 0.04025693657984145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 2, 1.1049723756906078, 165.65745856353598, 97, 1045, 104.0, 302.6, 324.6, 980.2200000000005, 0.7660111135093043, 1.6025091029946381, 0.3707018669404839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 120.61538461538463, 102, 304, 103.0, 231.59999999999994, 304.0, 304.0, 0.06206820818631921, 0.04806649325366322, 0.022063308378730658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f07d14bf-0335-40f5-b3fb-c36a07d8c733", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd674f8b-9c45-43c4-83d1-7f688e0f622d", 3, 0, 0.0, 530.3333333333334, 209, 937, 445.0, 937.0, 937.0, 937.0, 0.02315457997591924, 0.027367929652526938, 0.014848477393411752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ae6b586-3574-4db6-87ac-d473344e3949", 1, 0, 0.0, 894.0, 894, 894, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 0.3571990352348993, 0.6674269435123042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4196b169-b6a3-47a6-8fc4-f9e765aecbc6", 3, 0, 0.0, 669.6666666666666, 227, 1376, 406.0, 1376.0, 1376.0, 1376.0, 0.04918839153959666, 0.031623396253484176, 0.031543337022462696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 114.05263157894736, 99, 305, 104.0, 109.0, 305.0, 305.0, 0.10756036117637069, 0.08728775404058987, 0.03823434713691302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd674f8b-9c45-43c4-83d1-7f688e0f622d", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 245.07692307692307, 198, 510, 205.0, 479.2, 510.0, 510.0, 0.059146022429991583, 0.0916647828089811, 0.1330207906799518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9a7f069-6c26-439d-8c4b-b9da04fd4b85", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99406c71-3408-4bc6-85db-626901faa05c", 3, 0, 0.0, 295.0, 192, 493, 200.0, 493.0, 493.0, 493.0, 0.020308829602150028, 0.024004349051239177, 0.013023565858149596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 282.79999999999995, 202, 609, 204.0, 486.6000000000001, 609.0, 609.0, 0.08929793959887365, 0.13839436537442626, 0.2008331590783262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/420b7110-3d8d-4b4c-badb-0cb32b133fba", 3, 0, 0.0, 296.6666666666667, 196, 406, 288.0, 406.0, 406.0, 406.0, 0.015858080749347178, 0.02186164452261891, 0.010169407251371724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 103.11111111111113, 100, 108, 103.0, 108.0, 108.0, 108.0, 0.092845721359674, 0.07697853265074535, 0.03300375251457162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39d0bb31-8470-409c-aec7-705feb8afc32", 3, 0, 0.0, 274.0, 191, 415, 216.0, 415.0, 415.0, 415.0, 0.03452879701671194, 0.028785237356705493, 0.02214249027438884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72c89cd3-a3f9-4b8c-81b9-d3e90831bf7a", 3, 0, 0.0, 532.0, 280, 887, 429.0, 887.0, 887.0, 887.0, 0.07677150241830233, 0.03473710558640633, 0.049231725183611845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 126.22222222222223, 100, 305, 104.0, 300.5, 305.0, 305.0, 0.08768169595884806, 0.06807319168680098, 0.03116810286037177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60573099-6936-45e0-8b2f-6efe49692f62", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d6b8003-c15a-4686-b90f-6eb18c29b71f", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f7b5099-c288-40b8-83df-3634cfd75a90", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 101.26666666666667, 95, 105, 102.0, 103.8, 105.0, 105.0, 0.1098933302074786, 0.08166877371864377, 0.05516130051430078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 153.33333333333337, 95, 301, 101.0, 300.4, 301.0, 301.0, 0.10989735586961777, 0.05141421870306467, 0.06144521433647639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 260.0, 100, 1109, 101.0, 1095.8, 1109.0, 1109.0, 0.10989655071359493, 13.210352415343024, 0.06334792057409959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 220.06666666666672, 97, 804, 102.0, 799.8, 804.0, 804.0, 0.10989655071359493, 4.3341024565542305, 0.06345524142440583], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 33.333333333333336, 0.07598784194528875], "isController": false}, {"data": ["401/Unauthorized", 2, 66.66666666666667, 0.1519756838905775], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 3, "401/Unauthorized", 2, "406/Not Acceptable", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
