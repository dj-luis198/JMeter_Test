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

    var data = {"OkPercent": 98.27586206896552, "KoPercent": 1.7241379310344827};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7102081934184016, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c43da30-7ac7-4fb9-b047-24b7c561e7ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc81acc2-8f51-437d-b35c-f8ccbeb6f7b4"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75333ac8-eb6b-47c6-95d3-c64a1988f5b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0d04af13-d61d-4638-aa73-a0253904398f"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5df8ec9e-d838-408a-a836-45b8f940fb55"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a918b8f-026f-4e87-9cf7-2a2c7cf9d5b3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45d00fa0-cb24-4a5c-9637-72527400d56d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78f788db-b321-43c0-a059-7b3fc91f2fc3"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/36a59b17-5c61-4795-8840-c984c0d6c685"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31a96901-2b36-40a1-baf7-e661030ee778"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c8ed65b3-152b-4df1-a2c1-7f5fd6aeab10"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24912fff-48e1-4c9c-b2c5-91c050b8f866"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db074cf0-3b7c-4a5e-bd89-2b3c9b862a45"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3d61586-ef09-4bda-92e4-a869d72bec98"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/75333ac8-eb6b-47c6-95d3-c64a1988f5b4"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a918b8f-026f-4e87-9cf7-2a2c7cf9d5b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45d00fa0-cb24-4a5c-9637-72527400d56d"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21818181818181817, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2cce49a-6f10-4d66-99e5-ee3abf2c3ba0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6c42e73d-76a2-4a60-a4cc-06b2a6a30354"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc81acc2-8f51-437d-b35c-f8ccbeb6f7b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c43da30-7ac7-4fb9-b047-24b7c561e7ee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78f788db-b321-43c0-a059-7b3fc91f2fc3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36a59b17-5c61-4795-8840-c984c0d6c685"], "isController": false}, {"data": [0.911042944785276, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3d61586-ef09-4bda-92e4-a869d72bec98"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5df8ec9e-d838-408a-a836-45b8f940fb55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24912fff-48e1-4c9c-b2c5-91c050b8f866"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d04af13-d61d-4638-aa73-a0253904398f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8ed65b3-152b-4df1-a2c1-7f5fd6aeab10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1276, 22, 1.7241379310344827, 520.755485893416, 135, 4509, 160.0, 1430.6999999999991, 1683.1499999999999, 2464.2100000000005, 4.9687699568542545, 739.2611056851724, 3.627755293190527], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2304.7999999999997, 1712, 3029, 2334.0, 2637.6, 2789.7999999999997, 3029.0, 0.24339621806530984, 292.8878008778306, 1.1967773026941748], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9c43da30-7ac7-4fb9-b047-24b7c561e7ee", 3, 0, 0.0, 434.6666666666667, 256, 641, 407.0, 641.0, 641.0, 641.0, 0.034309633001292326, 0.02860252933473622, 0.022001945642104784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc81acc2-8f51-437d-b35c-f8ccbeb6f7b4", 3, 0, 0.0, 372.0, 298, 471, 347.0, 471.0, 471.0, 471.0, 0.019896274091071878, 0.027428620044169728, 0.01275900389303763], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 1041.2142857142858, 154, 4180, 626.5, 2906.0, 4180.0, 4180.0, 0.09185507892975711, 0.0180942203472122, 0.061804833381447905], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 1041.2142857142858, 154, 4180, 626.5, 2906.0, 4180.0, 4180.0, 0.09058029619756856, 0.017843105221954075, 0.06094709382824682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 189.47058823529412, 135, 424, 142.0, 422.4, 424.0, 424.0, 0.09117725931885223, 0.024397040091177262, 0.05199953070528292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 160.70588235294116, 138, 425, 144.0, 212.19999999999982, 425.0, 425.0, 0.09131684258587812, 0.0678633957107942, 0.045836774501114605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75333ac8-eb6b-47c6-95d3-c64a1988f5b4", 1, 0, 0.0, 1218.0, 1218, 1218, 1218.0, 1218.0, 1218.0, 1218.0, 0.8210180623973727, 0.14832845853858787, 0.5660534688013137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 188.58823529411768, 136, 420, 141.0, 413.6, 420.0, 420.0, 0.09131193769303074, 0.02461142070632469, 0.05377060393447025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 205.11764705882356, 135, 435, 142.0, 417.4, 435.0, 435.0, 0.09131782362768112, 0.024613007149648425, 0.053684892406117214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d04af13-d61d-4638-aa73-a0253904398f", 3, 0, 0.0, 451.6666666666667, 331, 521, 503.0, 521.0, 521.0, 521.0, 0.056624072780808214, 0.025620918348087048, 0.03631166125592193], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 738.7857142857143, 138, 3521, 289.5, 3440.5, 3521.0, 3521.0, 0.09212405161579007, 0.16662141004086362, 0.0595439078035652], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5df8ec9e-d838-408a-a836-45b8f940fb55", 3, 0, 0.0, 1754.0, 477, 3360, 1425.0, 3360.0, 3360.0, 3360.0, 0.03822727388567497, 0.031868505345447135, 0.02451423488111318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a918b8f-026f-4e87-9cf7-2a2c7cf9d5b3", 3, 0, 0.0, 714.0, 287, 1512, 343.0, 1512.0, 1512.0, 1512.0, 0.04210821812056986, 0.027071526949259597, 0.027002991437995647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45d00fa0-cb24-4a5c-9637-72527400d56d", 3, 0, 0.0, 514.0, 243, 1006, 293.0, 1006.0, 1006.0, 1006.0, 0.06209380303845677, 0.028095828848780893, 0.03981926822453119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 142.22222222222226, 137, 152, 140.5, 152.0, 152.0, 152.0, 0.09003736550668529, 0.0669125343267456, 0.04519453698284788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 140.66666666666666, 135, 149, 140.0, 144.5, 149.0, 149.0, 0.09003691513520544, 0.03911760071629368, 0.05050898993587371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1017.125, 804, 1270, 1088.0, 1270.0, 1270.0, 1270.0, 0.07355983632936416, 21.62903429727369, 0.04195209415659051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78f788db-b321-43c0-a059-7b3fc91f2fc3", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1484.0, 1216, 1725, 1520.5, 1725.0, 1725.0, 1725.0, 0.0734672886897109, 66.10599550472027, 0.04182756768173971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 317.125, 139, 434, 412.0, 434.0, 434.0, 434.0, 0.07400486581992766, 0.13095392272041886, 0.04097730363271385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 147.1818181818182, 137, 178, 143.0, 173.8, 178.0, 178.0, 0.06889295287722023, 0.05119876673785605, 0.03458103298719844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 164.45454545454547, 135, 424, 138.0, 368.20000000000016, 424.0, 424.0, 0.06889467882553361, 0.027841670633329995, 0.03876548955932459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 323.27272727272725, 140, 1568, 145.0, 1338.6000000000008, 1568.0, 1568.0, 0.06877321095869857, 5.642511036928088, 0.039893835263151316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 252.9090909090909, 136, 809, 142.0, 733.6000000000003, 809.0, 809.0, 0.06876848152941104, 1.8550517678188514, 0.03995824854492145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 210.375, 137, 432, 142.5, 432.0, 432.0, 432.0, 0.07419911332059581, 0.055142114489231855, 0.041664541171233006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 965.5000000000001, 137, 1681, 1287.5, 1655.8, 1681.0, 1681.0, 0.09129033178329958, 51.34872773015149, 0.04876544090377429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 319.44444444444446, 135, 1691, 139.5, 1555.1000000000001, 1691.0, 1691.0, 0.09003961743166992, 9.02355044031874, 0.052073693675217095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 795.5, 135, 1256, 1104.0, 1233.6, 1256.0, 1256.0, 0.09129137353577195, 16.785911565761168, 0.04885514911875296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 276.61111111111114, 136, 1117, 140.0, 729.1000000000006, 1117.0, 1117.0, 0.09003961743166992, 2.963198338518948, 0.05216162298911521], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 474.92857142857144, 142, 1218, 476.5, 946.5, 1218.0, 1218.0, 0.09125395977004001, 0.017975807923450965, 0.06198598355473282], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/36a59b17-5c61-4795-8840-c984c0d6c685", 3, 0, 0.0, 1509.0, 499, 3521, 507.0, 3521.0, 3521.0, 3521.0, 0.03073896471166851, 0.025165526122996842, 0.019712161615230133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 496.6363636363637, 280, 1725, 290.0, 1494.6000000000008, 1725.0, 1725.0, 0.06870705808869457, 7.569304829013117, 0.15292566169581512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 816.0, 176, 2174, 758.0, 1579.5, 2049.0, 2174.0, 0.0996243332433947, 0.061195025009858656, 0.04504498661298022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 143.9375, 137, 175, 141.5, 155.40000000000003, 175.0, 175.0, 0.09128668583687069, 0.06784098429869004, 0.04582163722671049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 211.18749999999997, 137, 428, 143.5, 424.5, 428.0, 428.0, 0.0912918944209241, 0.11012530525727197, 0.04727297560224122], "isController": false}, {"data": ["login", 24, 0, 0.0, 3759.166666666667, 1908, 7891, 3465.0, 6486.0, 7814.75, 7891.0, 0.10174406281000144, 40.71057497053662, 0.20974777010929008], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 149.72222222222223, 141, 213, 146.0, 161.70000000000007, 213.0, 213.0, 0.08773255218868346, 0.07102566969181504, 0.031186180660821076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31a96901-2b36-40a1-baf7-e661030ee778", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1132.625, 280, 1828, 1431.0, 1801.4, 1828.0, 1828.0, 0.09121382801632728, 68.25516720991152, 0.19055584139055481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8ed65b3-152b-4df1-a2c1-7f5fd6aeab10", 3, 0, 0.0, 1404.0, 464, 3187, 561.0, 3187.0, 3187.0, 3187.0, 0.016998708098184538, 0.023434091404886562, 0.010900864242650892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24912fff-48e1-4c9c-b2c5-91c050b8f866", 3, 0, 0.0, 459.0, 254, 637, 486.0, 637.0, 637.0, 637.0, 0.02614538577516711, 0.03090296085599993, 0.01676640949774714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 433.1764705882353, 280, 838, 299.0, 631.5999999999998, 838.0, 838.0, 0.0911088482769709, 0.14120092013237578, 0.20490593513853905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 1176.75, 138, 1969, 1589.0, 1938.7, 1969.0, 1969.0, 0.11005640390700235, 87.78696347503096, 0.18975056747833266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db074cf0-3b7c-4a5e-bd89-2b3c9b862a45", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1272.25, 153, 2217, 1299.0, 1965.5, 2163.5, 2217.0, 0.10293713972001099, 0.032167856162503436, 0.046442342334614334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3d61586-ef09-4bda-92e4-a869d72bec98", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75333ac8-eb6b-47c6-95d3-c64a1988f5b4", 3, 0, 0.0, 689.0, 292, 957, 818.0, 957.0, 957.0, 957.0, 0.03560366005625379, 0.023306953246460402, 0.022831774189720037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 502.5555555555555, 279, 1831, 286.0, 1693.3000000000002, 1831.0, 1831.0, 0.08997255836969724, 12.083775386007268, 0.19979257888843902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 184.73684210526318, 138, 429, 146.0, 406.0, 429.0, 429.0, 0.10343513528226904, 0.08030364506777724, 0.03676795824486907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 575.8461538461538, 278, 1528, 553.0, 1486.3999999999999, 1528.0, 1528.0, 0.06945520406473225, 12.874554092581116, 0.15347241793600505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a918b8f-026f-4e87-9cf7-2a2c7cf9d5b3", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 197.1, 138, 430, 142.5, 427.5, 430.0, 430.0, 0.05087738042543666, 0.03781024072632549, 0.02553806009636176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 248.39999999999998, 138, 543, 143.0, 543.0, 543.0, 543.0, 0.05087634504337209, 0.021254785556205642, 0.028588133728472947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45d00fa0-cb24-4a5c-9637-72527400d56d", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 333.6, 138, 1260, 142.0, 1175.3000000000002, 1260.0, 1260.0, 0.05080655404547186, 4.583907222469199, 0.02943207798806046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 265.1, 135, 1129, 139.5, 1057.3000000000002, 1129.0, 1129.0, 0.0508070703119046, 1.5062212463736453, 0.02948199333919308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 144.0, 142, 146, 144.0, 146.0, 146.0, 146.0, 0.16249593760155998, 0.047923606597335064, 0.10044914892752681], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1583.8000000000002, 1086, 2458, 1551.0, 2042.0, 2208.4, 2458.0, 0.24191242770117216, 289.41136589804495, 0.4776825476677443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1272.25, 153, 2217, 1299.0, 1965.5, 2163.5, 2217.0, 0.10263603551206829, 0.03207376109752134, 0.04630649258454643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 140.2, 138, 143, 139.0, 143.0, 143.0, 143.0, 0.02506919096706911, 0.006756930377842846, 0.014762423977678392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 140.6, 137, 145, 139.0, 145.0, 145.0, 145.0, 0.025069316660566464, 0.006756964256168305, 0.014738016239903333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2cce49a-6f10-4d66-99e5-ee3abf2c3ba0", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.7374963914549654, 1.3780131351039262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 197.5263157894737, 136, 429, 142.0, 414.0, 429.0, 429.0, 0.10072842556169351, 0.027149458452175205, 0.059217297058729974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 207.1052631578947, 136, 550, 142.0, 433.0, 550.0, 550.0, 0.10072895957587807, 0.027149602385685884, 0.05931597912524851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 139.2, 136, 143, 139.0, 143.0, 143.0, 143.0, 0.025068688205683573, 0.006707832586286425, 0.014296986242303912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 156.89473684210526, 138, 416, 143.0, 152.0, 416.0, 416.0, 0.10072522159548751, 0.07485536487711522, 0.05055933974617244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 143.2, 139, 151, 141.0, 151.0, 151.0, 151.0, 0.0250689395838556, 0.01863033498370519, 0.01258343256455252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 154.3157894736842, 136, 410, 140.0, 144.0, 410.0, 410.0, 0.10072789155317108, 0.026952580357000853, 0.05744637565141787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c42e73d-76a2-4a60-a4cc-06b2a6a30354", 1, 0, 0.0, 1444.0, 1444, 1444, 1444.0, 1444.0, 1444.0, 1444.0, 0.6925207756232687, 0.22114677112188366, 0.4132130799861496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 147.4, 141, 156, 144.0, 156.0, 156.0, 156.0, 0.025947471937809097, 0.020423498419798958, 0.009223515415393077], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 872.5714285714286, 138, 3187, 510.0, 2513.5, 3187.0, 3187.0, 0.09399758291929636, 0.01814908688062307, 0.0639676631529475], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 2004.3333333333335, 1021, 4509, 1722.5, 3506.5, 4375.5, 4509.0, 0.10329511414110114, 0.053463291498812106, 0.04751171753951038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 286.4, 280, 296, 286.0, 296.0, 296.0, 296.0, 0.025050978741739442, 0.03882412428041064, 0.05634023832248626], "isController": false}, {"data": ["addBook", 54, 6, 11.11111111111111, 1563.944444444444, 713, 4209, 1217.5, 2642.0, 3179.0, 4209.0, 0.24621220756600995, 88.28054559513822, 0.8922209267267911], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 236.98181818181817, 136, 640, 144.0, 553.6, 570.8, 640.0, 0.24352230664328853, 0.18097702671439703, 0.11771830252776154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc81acc2-8f51-437d-b35c-f8ccbeb6f7b4", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c43da30-7ac7-4fb9-b047-24b7c561e7ee", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 918.4545454545455, 673, 1299, 840.0, 1165.3999999999999, 1274.1999999999998, 1299.0, 0.24341129870992012, 71.57100383649399, 0.12241876839414927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78f788db-b321-43c0-a059-7b3fc91f2fc3", 3, 0, 0.0, 364.0, 254, 477, 361.0, 477.0, 477.0, 477.0, 0.02357471219205532, 0.027864511708773722, 0.015117898117952144], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 247.34545454545457, 135, 635, 150.0, 424.4, 431.2, 635.0, 0.24400307000226257, 0.43177105746494115, 0.1186655555284441], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1344.5454545454545, 937, 1904, 1356.0, 1656.6, 1768.0, 1904.0, 0.24253542119583194, 218.23379832380465, 0.12174141259243908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 172.92307692307693, 141, 419, 152.0, 319.7999999999999, 419.0, 419.0, 0.06629101756711965, 0.04952405120981107, 0.023564385150812068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36a59b17-5c61-4795-8840-c984c0d6c685", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 6, 3.6809815950920246, 261.88343558282224, 138, 3358, 148.0, 479.4, 535.8, 2809.5199999999872, 0.6731698452948319, 1.547255755240813, 0.3209728607756734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 173.9, 141, 435, 145.5, 406.2000000000001, 435.0, 435.0, 0.050039781626392985, 0.038751510575907845, 0.01778757862500688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 179.41176470588238, 140, 429, 148.0, 415.4, 429.0, 429.0, 0.09286471250177535, 0.07536189071188995, 0.03301050327211546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3d61586-ef09-4bda-92e4-a869d72bec98", 3, 0, 0.0, 813.6666666666666, 246, 1840, 355.0, 1840.0, 1840.0, 1840.0, 0.08340979230961715, 0.0377407588900937, 0.053488701448550065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 559.4000000000001, 279, 1404, 291.0, 1358.5000000000002, 1404.0, 1404.0, 0.050770441448988395, 6.144725704757191, 0.11288490340923514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5df8ec9e-d838-408a-a836-45b8f940fb55", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24912fff-48e1-4c9c-b2c5-91c050b8f866", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 409.3684210526316, 281, 828, 289.0, 697.0, 828.0, 828.0, 0.10064998702144905, 0.1559878216826559, 0.2263641797953097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d04af13-d61d-4638-aa73-a0253904398f", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 198.72727272727272, 138, 433, 149.0, 430.0, 433.0, 433.0, 0.06413021932535008, 0.05317046504611545, 0.02279628890080804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 185.6875, 139, 462, 148.0, 437.5, 462.0, 462.0, 0.08987501755371437, 0.06977601460469035, 0.0319477601460469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8ed65b3-152b-4df1-a2c1-7f5fd6aeab10", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 141.92307692307693, 138, 147, 142.0, 146.6, 147.0, 147.0, 0.06950942387381366, 0.05165690582809784, 0.034890472530410374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 269.3846153846153, 136, 429, 143.0, 428.2, 429.0, 429.0, 0.06951165389612819, 0.034661835829514646, 0.03874522775760751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 390.2307692307692, 138, 1386, 145.0, 1343.2, 1386.0, 1386.0, 0.0695101671986868, 9.638217542093754, 0.03994537102388476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 309.6923076923077, 135, 1124, 142.0, 1106.0, 1124.0, 1124.0, 0.0695112822158058, 3.1602569243931127, 0.04001389390172174], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.6269592476489029], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15673981191222572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15673981191222572], "isController": false}, {"data": ["401/Unauthorized", 10, 45.45454545454545, 0.7836990595611285], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1276, 22, "401/Unauthorized", 10, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
