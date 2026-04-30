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

    var data = {"OkPercent": 97.69762087490406, "KoPercent": 2.3023791250959325};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7293729372937293, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbc4ec4e-016f-40dc-8355-85f601c1d31b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ab1b33e-4499-4e7d-bb91-77f81fc5142d"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e66e0c2e-9fcd-420c-9bdb-36104fb3c346"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b794aefb-a88f-42c0-872c-8e23c769d957"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/596bd523-a03b-4d4d-8295-3bc58cf4c32d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c0a8cf7-f185-47d9-bb59-f953628247cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6db6e4b8-8c7f-4a15-8527-df42b8ad9414"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/343da0ff-8286-408e-a8b4-c1fa10e81b02"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d7594da-c5ea-4696-9331-e53b8923c784"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cfb64ea4-15c2-4229-a13b-677836ed977f"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c20053b-eb1b-41ed-b5d2-304d6013f60f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2e5062c-667b-4b10-a4c6-38309473ba25"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b794aefb-a88f-42c0-872c-8e23c769d957"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.17543859649122806, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbc4ec4e-016f-40dc-8355-85f601c1d31b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=596bd523-a03b-4d4d-8295-3bc58cf4c32d"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=343da0ff-8286-408e-a8b4-c1fa10e81b02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0eab44b8-db1b-44eb-8688-26e38f38297d"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c0a8cf7-f185-47d9-bb59-f953628247cb"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9017341040462428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c20053b-eb1b-41ed-b5d2-304d6013f60f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6db6e4b8-8c7f-4a15-8527-df42b8ad9414"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d7594da-c5ea-4696-9331-e53b8923c784"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0eab44b8-db1b-44eb-8688-26e38f38297d"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7bcfe648-7ca8-435f-bafb-701879e32f56"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfb64ea4-15c2-4229-a13b-677836ed977f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2e5062c-667b-4b10-a4c6-38309473ba25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 30, 2.3023791250959325, 490.68073676132013, 137, 2992, 161.0, 1407.6000000000001, 1754.7999999999997, 2326.2800000000007, 5.147328958959631, 721.6950993344618, 3.7721226757024744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2461.7368421052624, 1862, 3529, 2421.0, 2990.4, 3143.4999999999995, 3529.0, 0.2507290938122699, 301.71265222445095, 1.2328329954538857], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbc4ec4e-016f-40dc-8355-85f601c1d31b", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ab1b33e-4499-4e7d-bb91-77f81fc5142d", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 569.1999999999999, 147, 1540, 479.0, 1208.8000000000002, 1540.0, 1540.0, 0.1029710582678895, 0.02095621928030095, 0.06900267596037674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 569.1999999999999, 147, 1540, 479.0, 1208.8000000000002, 1540.0, 1540.0, 0.10348039046600668, 0.02105987634093339, 0.06934398822048221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e66e0c2e-9fcd-420c-9bdb-36104fb3c346", 2, 0, 0.0, 303.5, 233, 374, 303.5, 374.0, 374.0, 374.0, 0.03624107563512485, 0.031180066049360345, 0.02252680140796579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 216.05555555555557, 137, 468, 151.5, 450.0, 468.0, 468.0, 0.10092401543016058, 0.03542634439198888, 0.057087336418991656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 151.94444444444446, 141, 161, 152.0, 157.4, 161.0, 161.0, 0.100922883703197, 0.07500226025208293, 0.05065855685883131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 240.11111111111114, 141, 876, 152.5, 507.00000000000057, 876.0, 876.0, 0.1009308063249972, 1.6744153547998206, 0.05895296554334417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 250.4444444444444, 142, 1636, 153.0, 564.1000000000017, 1636.0, 1636.0, 0.10092741076334766, 5.070950787023539, 0.05885242029538089], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 251.53333333333333, 143, 374, 261.0, 338.0, 374.0, 374.0, 0.1035311007426631, 0.19484202663855224, 0.06691101803856879], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 180.49999999999997, 144, 460, 151.0, 402.7000000000005, 458.4, 460.0, 0.10446810066546179, 0.07763693809220355, 0.05243808959184313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1147.4, 858, 1391, 1156.0, 1391.0, 1391.0, 1391.0, 0.02289545021613305, 6.732022564038575, 0.01305756145138838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 219.54999999999998, 139, 443, 149.0, 430.9, 442.4, 443.0, 0.10447792381469795, 0.035802054166579604, 0.05914634026892618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1701.8, 1529, 1923, 1657.0, 1923.0, 1923.0, 1923.0, 0.022801169243958832, 20.516532165894468, 0.012981525067605467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 202.8, 145, 427, 146.0, 427.0, 427.0, 427.0, 0.022940725752799915, 0.04059433111725923, 0.012702530763513234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 152.93333333333334, 142, 199, 149.0, 178.0, 199.0, 199.0, 0.06929942897270526, 0.051500845164285845, 0.034785064933564945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 187.93333333333334, 143, 464, 147.0, 452.0, 464.0, 464.0, 0.06930070963926671, 0.03242154293409964, 0.03874703739466292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 340.2, 139, 1622, 148.0, 1415.6000000000001, 1622.0, 1622.0, 0.06930134999029781, 8.330518567564196, 0.0399475359905011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 300.3999999999999, 142, 1183, 148.0, 1147.0, 1183.0, 1183.0, 0.06930102981330302, 2.733095457548499, 0.04001502821706931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b794aefb-a88f-42c0-872c-8e23c769d957", 3, 0, 0.0, 403.6666666666667, 263, 491, 457.0, 491.0, 491.0, 491.0, 0.03429355281207133, 0.028589123942615452, 0.021991633802011887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/596bd523-a03b-4d4d-8295-3bc58cf4c32d", 3, 0, 0.0, 384.3333333333333, 261, 471, 421.0, 471.0, 471.0, 471.0, 0.036971310263235725, 0.022998754528985504, 0.023708815500838015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 205.0, 146, 435, 147.0, 435.0, 435.0, 435.0, 0.022970235169267664, 0.01707065328497333, 0.012898325412430573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1005.2666666666668, 140, 1997, 1419.0, 1905.8, 1997.0, 1997.0, 0.12152932502612881, 58.33651292869469, 0.06587585678174143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 236.9, 143, 1615, 149.0, 413.00000000000057, 1556.2999999999993, 1615.0, 0.1044757407330018, 4.727124261160621, 0.06097138931840027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 623.6666666666667, 142, 1288, 851.0, 1235.2, 1288.0, 1288.0, 0.12152735580779234, 19.0729273003103, 0.06599346841098931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 260.65, 139, 895, 149.5, 465.3, 873.5499999999997, 895.0, 0.10447246628151151, 1.5626693596621362, 0.0610715022618289], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 533.7857142857142, 149, 1304, 468.5, 1133.5, 1304.0, 1304.0, 0.09940499013050455, 0.02039272293344126, 0.0670165478244508], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 534.4, 295, 1772, 304.0, 1563.8000000000002, 1772.0, 1772.0, 0.06925143812153166, 11.139522134779456, 0.1533856234591555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c0a8cf7-f185-47d9-bb59-f953628247cb", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 159.13333333333335, 142, 230, 156.0, 188.60000000000002, 230.0, 230.0, 0.12151062002819046, 0.0903023260170439, 0.06099263544383779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 658.7894736842105, 223, 1635, 434.0, 1207.0, 1635.0, 1635.0, 0.08972930086706842, 0.055116924067759795, 0.040570963185012375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 251.73333333333332, 145, 475, 156.0, 467.8, 475.0, 475.0, 0.12151258870418975, 0.1298507572259486, 0.06385739687631639], "isController": false}, {"data": ["login", 19, 0, 0.0, 3114.8421052631575, 1853, 4977, 3193.0, 4920.0, 4977.0, 4977.0, 0.08914537734299856, 28.187364192589204, 0.17340187117320008], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 168.3, 140, 431, 155.5, 166.60000000000002, 417.79999999999984, 431.0, 0.10559160335570116, 0.08548382732605103, 0.037534515255346894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6db6e4b8-8c7f-4a15-8527-df42b8ad9414", 3, 0, 0.0, 792.0, 314, 1680, 382.0, 1680.0, 1680.0, 1680.0, 0.032311569696055836, 0.026936826169140296, 0.020720635514723303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/343da0ff-8286-408e-a8b4-c1fa10e81b02", 3, 0, 0.0, 431.0, 251, 612, 430.0, 612.0, 612.0, 612.0, 0.03611759890202499, 0.029757045189135828, 0.023161350858394936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d7594da-c5ea-4696-9331-e53b8923c784", 3, 0, 0.0, 439.0, 275, 547, 495.0, 547.0, 547.0, 547.0, 0.017651627480053663, 0.02433419348243075, 0.01131956579938337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfb64ea4-15c2-4229-a13b-677836ed977f", 3, 0, 0.0, 490.0, 290, 703, 477.0, 703.0, 703.0, 703.0, 0.02054077000499825, 0.020600948042122275, 0.013172303681590678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1168.4666666666667, 299, 2157, 1577.0, 2067.0, 2157.0, 2157.0, 0.12135529594511504, 77.51876867101792, 0.25637096341946863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c20053b-eb1b-41ed-b5d2-304d6013f60f", 3, 0, 0.0, 337.0, 232, 516, 263.0, 516.0, 516.0, 516.0, 0.060984286382208854, 0.027593801455491635, 0.0391077617750493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 949.4545454545455, 143, 2197, 157.0, 2171.8, 2197.0, 2197.0, 0.04783253395022807, 26.018044823432724, 0.06631328570372529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 473.2777777777777, 296, 1787, 315.0, 742.1000000000016, 1787.0, 1787.0, 0.10083468713237353, 6.849444490154614, 0.22534626911657613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2e5062c-667b-4b10-a4c6-38309473ba25", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["register", 20, 6, 30.0, 1176.1, 714, 1806, 1163.5, 1759.3000000000002, 1804.3, 1806.0, 0.08375279524954145, 0.02627089632241476, 0.03778690566922671], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 524.8499999999999, 292, 1771, 312.5, 901.9000000000001, 1727.6999999999994, 1771.0, 0.10438631286665692, 6.3978055142722186, 0.23343185335288835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 169.35294117647058, 142, 435, 152.0, 218.9999999999998, 435.0, 435.0, 0.10867133314156038, 0.08436885727298878, 0.03862926295266404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b794aefb-a88f-42c0-872c-8e23c769d957", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 580.9285714285716, 295, 1616, 453.0, 1467.0, 1616.0, 1616.0, 0.06365227670554002, 10.963163376071291, 0.14082888619882244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 182.22222222222223, 138, 446, 151.0, 446.0, 446.0, 446.0, 0.048351742811707565, 0.03593327761690377, 0.024270308403532902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 213.44444444444446, 137, 446, 151.0, 446.0, 446.0, 446.0, 0.048274197441467534, 0.01291711923726768, 0.027531378228336952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 214.2222222222222, 142, 440, 157.0, 440.0, 440.0, 440.0, 0.04834888555818788, 0.013031535560605328, 0.02842385654885655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 181.77777777777777, 138, 467, 148.0, 467.0, 467.0, 467.0, 0.04835382102639044, 0.013032865823519299, 0.028473978592688905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 156.0, 149, 164, 155.0, 164.0, 164.0, 164.0, 0.028635517586980384, 0.00844524053834773, 0.017701447883357993], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1753.666666666667, 1148, 2886, 1641.0, 2368.6, 2524.3999999999996, 2886.0, 0.24497268769420533, 293.0725007682257, 0.483725365739925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 1176.1, 714, 1806, 1163.5, 1759.3000000000002, 1804.3, 1806.0, 0.08137987719776531, 0.02552657866789279, 0.03671631178258552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 227.71428571428572, 143, 429, 152.0, 429.0, 429.0, 429.0, 0.04937435636999732, 0.01330793199035084, 0.02907493837022303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 186.0, 144, 424, 146.0, 424.0, 424.0, 424.0, 0.0493760977364586, 0.013308401343029857, 0.029027744958347732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 163.47058823529412, 141, 417, 148.0, 207.3999999999998, 417.0, 417.0, 0.11296131407232182, 0.030446604183555492, 0.06640889753079857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 191.41176470588235, 141, 599, 149.0, 464.5999999999999, 599.0, 599.0, 0.11295606009262397, 0.030445188071840053, 0.06651611741782447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 150.05882352941174, 144, 159, 150.0, 158.2, 159.0, 159.0, 0.1129575611798085, 0.08394600005647879, 0.05669940082658357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 146.57142857142858, 143, 151, 146.0, 151.0, 151.0, 151.0, 0.049471363148074855, 0.013237454592355967, 0.02821413679538644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 163.76470588235293, 144, 429, 147.0, 212.9999999999998, 429.0, 429.0, 0.1129598128853923, 0.030225574932224112, 0.0644223932862003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 191.0, 144, 447, 149.0, 447.0, 447.0, 447.0, 0.04947101351972127, 0.036765079383308474, 0.024832129833141335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbc4ec4e-016f-40dc-8355-85f601c1d31b", 3, 0, 0.0, 388.0, 266, 548, 350.0, 548.0, 548.0, 548.0, 0.017517736708417272, 0.02414961424483957, 0.01123370485533269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 196.57142857142858, 147, 436, 156.0, 436.0, 436.0, 436.0, 0.04923509759099701, 0.03875340689291366, 0.017501538596799718], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 517.7142857142857, 145, 1680, 476.5, 1191.5, 1680.0, 1680.0, 0.10179153094462541, 0.020285881969084457, 0.0692645357397336], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1647.4736842105265, 962, 2992, 1295.0, 2816.0, 2992.0, 2992.0, 0.08844902310381587, 0.0457792795361547, 0.04068309558779031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 421.14285714285717, 294, 876, 302.0, 876.0, 876.0, 876.0, 0.04932147738962558, 0.07643865685286699, 0.11092515862139425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=596bd523-a03b-4d4d-8295-3bc58cf4c32d", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 0.22611271902377972, 0.862895025031289], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1481.9999999999998, 747, 3546, 1180.5, 2597.2000000000003, 2898.0499999999997, 3546.0, 0.2825161472591063, 82.66172165735905, 1.0279455048271293], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=343da0ff-8286-408e-a8b4-c1fa10e81b02", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0eab44b8-db1b-44eb-8688-26e38f38297d", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 280.5087719298246, 138, 915, 157.0, 590.6, 626.0, 915.0, 0.2468408699191921, 0.18344326368018085, 0.1193224908300782], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 959.1228070175439, 680, 1416, 882.0, 1247.4, 1287.1999999999994, 1416.0, 0.2470730512654908, 72.6476806694596, 0.12426037246262478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c0a8cf7-f185-47d9-bb59-f953628247cb", 3, 0, 0.0, 373.0, 239, 505, 375.0, 505.0, 505.0, 505.0, 0.018600498493359624, 0.021985159514774994, 0.011928054046848456], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 247.8421052631578, 139, 603, 154.0, 448.4, 482.7999999999993, 603.0, 0.24770438871337125, 0.4383206565904577, 0.120465610917245], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1471.017543859649, 998, 2167, 1422.0, 1905.8, 1930.4, 2167.0, 0.24597910472236728, 221.33243081433108, 0.12346998030009451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 183.7857142857143, 151, 538, 153.0, 355.5, 538.0, 538.0, 0.06315409599422592, 0.04718055023006135, 0.022449307560447492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 235.21387283237, 139, 1750, 159.0, 382.19999999999993, 504.8999999999994, 1718.1799999999996, 0.728687982545185, 1.569012253962504, 0.3488284392598552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 157.77777777777777, 151, 162, 159.0, 162.0, 162.0, 162.0, 0.046009682482069006, 0.035630545125274145, 0.01635500431979797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c20053b-eb1b-41ed-b5d2-304d6013f60f", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 156.83333333333331, 150, 169, 156.5, 163.60000000000002, 169.0, 169.0, 0.09716704093971325, 0.07885333107509933, 0.0345398465840387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6db6e4b8-8c7f-4a15-8527-df42b8ad9414", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d7594da-c5ea-4696-9331-e53b8923c784", 1, 0, 0.0, 1304.0, 1304, 1304, 1304.0, 1304.0, 1304.0, 1304.0, 0.7668711656441718, 0.1385460601993865, 0.5287217216257668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 436.0, 297, 913, 305.0, 913.0, 913.0, 913.0, 0.048236164260218026, 0.07475663347750587, 0.10848426395633019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0eab44b8-db1b-44eb-8688-26e38f38297d", 3, 0, 0.0, 344.6666666666667, 240, 482, 312.0, 482.0, 482.0, 482.0, 0.03141163905932612, 0.025716234451238665, 0.020143531558226707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 376.23529411764713, 291, 752, 303.0, 621.5999999999999, 752.0, 752.0, 0.1128428431086212, 0.1748843672005682, 0.2537861989054244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bcfe648-7ca8-435f-bafb-701879e32f56", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.3486200191048035, 0.6513970387554585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfb64ea4-15c2-4229-a13b-677836ed977f", 1, 0, 0.0, 963.0, 963, 963, 963.0, 963.0, 963.0, 963.0, 1.0384215991692627, 0.18760546469366562, 0.7159430166147456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 172.53333333333336, 145, 433, 153.0, 274.0000000000001, 433.0, 433.0, 0.06969159147718297, 0.057781407386844084, 0.024773182907904884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 175.93333333333334, 146, 429, 158.0, 277.80000000000007, 429.0, 429.0, 0.12225138144061028, 0.0949119611770363, 0.043456545746466936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2e5062c-667b-4b10-a4c6-38309473ba25", 3, 0, 0.0, 345.6666666666667, 245, 455, 337.0, 455.0, 455.0, 455.0, 0.02363749537099049, 0.027938719300802887, 0.015158159466422938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 155.42857142857144, 143, 240, 150.0, 197.5, 240.0, 240.0, 0.06369542666836521, 0.04733615204553313, 0.03197211846439426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 252.57142857142858, 139, 449, 154.5, 447.0, 449.0, 449.0, 0.06369803491562286, 0.030711552548603874, 0.03556355130194233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 419.2857142857143, 141, 1466, 287.0, 1302.0, 1466.0, 1466.0, 0.06369861455513343, 8.202733992879406, 0.03666580408126123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 312.0, 142, 1173, 149.5, 1151.5, 1173.0, 1173.0, 0.06369629606038409, 2.690262115945458, 0.03672667293771867], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.0, 0.4604758250191865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.23023791250959325], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.23023791250959325], "isController": false}, {"data": ["401/Unauthorized", 18, 60.0, 1.3814274750575595], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 30, "401/Unauthorized", 18, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
