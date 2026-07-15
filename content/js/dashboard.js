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

    var data = {"OkPercent": 98.72849663425579, "KoPercent": 1.2715033657442034};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.819471308833011, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39655172413793105, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd2d19d6-05bc-4dc1-af50-873f58b75916"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a690fa0b-f9ba-44cf-ac61-5e863bb4fc93"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/738e845f-fd22-40e7-8a2a-f73b36f304ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3ae2a1f-21ab-45ac-b487-589963a5b854"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc4a1751-57bb-4f78-9610-e7cfe9f6e3ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c3883f31-3a65-460c-b519-21f07fc58413"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4714b415-dbba-41a1-a98a-cd4f2e1c8e9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc2c04d1-b292-48ee-a4b1-507f42d6a6ea"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/807d9e34-a2b2-4c81-8a8c-6a349a46fce5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34b224ba-6e2e-41a2-af6d-6ca4f23efb7c"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5c619ff-628b-4628-8ede-c9ba4da02860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94ba8ee8-bf62-4cc2-baff-c634f0d515da"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/65e4fd1a-7e89-4289-8ed1-40e43a77c129"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96e6b84c-5b34-4df6-9be2-49934acf7ec9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a02bb45e-7849-4ba0-b77c-ad566f5c0b7a"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a02bb45e-7849-4ba0-b77c-ad566f5c0b7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64ae2868-4c5e-47fb-8a9e-6db562217dbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a690fa0b-f9ba-44cf-ac61-5e863bb4fc93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=738e845f-fd22-40e7-8a2a-f73b36f304ad"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc4a1751-57bb-4f78-9610-e7cfe9f6e3ba"], "isController": false}, {"data": [0.3770491803278688, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd2d19d6-05bc-4dc1-af50-873f58b75916"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9555555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3ae2a1f-21ab-45ac-b487-589963a5b854"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=807d9e34-a2b2-4c81-8a8c-6a349a46fce5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f5c619ff-628b-4628-8ede-c9ba4da02860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94ba8ee8-bf62-4cc2-baff-c634f0d515da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96e6b84c-5b34-4df6-9be2-49934acf7ec9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34b224ba-6e2e-41a2-af6d-6ca4f23efb7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96cb011b-efe5-481f-9d7a-80720e4882de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1337, 17, 1.2715033657442034, 304.59386686611884, 77, 2351, 94.0, 827.6000000000001, 1039.1999999999998, 1511.41999999999, 5.388413098236776, 746.0203912153653, 3.9406643576826195], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1346.4655172413798, 997, 1825, 1320.0, 1606.2, 1671.6499999999996, 1825.0, 0.25689292437160893, 309.1278997342487, 1.2631405021592292], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd2d19d6-05bc-4dc1-af50-873f58b75916", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a690fa0b-f9ba-44cf-ac61-5e863bb4fc93", 3, 0, 0.0, 1030.3333333333333, 276, 2348, 467.0, 2348.0, 2348.0, 2348.0, 0.020698362759505724, 0.024464764055913177, 0.013273364139396575], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 518.5384615384614, 84, 1154, 517.0, 946.7999999999998, 1154.0, 1154.0, 0.07967541461859992, 0.015795028483960725, 0.05356783059168189], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 518.5384615384614, 84, 1154, 517.0, 946.7999999999998, 1154.0, 1154.0, 0.07803449124513036, 0.01546972824488424, 0.052464595601255756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/738e845f-fd22-40e7-8a2a-f73b36f304ad", 3, 0, 0.0, 845.3333333333334, 284, 1937, 315.0, 1937.0, 1937.0, 1937.0, 0.023963766784621653, 0.028324361066068105, 0.015367389507065319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 118.0, 79, 250, 84.0, 247.5, 250.0, 250.0, 0.1126833116015518, 0.05432945380789105, 0.0629127529337905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 82.35714285714285, 80, 85, 82.0, 84.5, 85.0, 85.0, 0.11268693958370225, 0.08374488381171623, 0.05656356147072554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 195.78571428571428, 80, 643, 84.0, 640.0, 643.0, 643.0, 0.11268421857518854, 4.759304748432482, 0.06497263886317721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 223.0, 80, 1106, 82.0, 1067.5, 1106.0, 1106.0, 0.11268421857518854, 14.510812780201382, 0.06486259568097488], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 206.76923076923077, 80, 454, 187.0, 385.99999999999994, 454.0, 454.0, 0.08003349093774625, 0.18728389995505812, 0.05172837710549646], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 92.30000000000003, 81, 241, 83.0, 105.80000000000004, 234.3499999999999, 241.0, 0.09543350670420385, 0.07092275254091712, 0.04790314691988357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 81.84999999999998, 79, 85, 82.0, 84.0, 84.95, 85.0, 0.09543669445465087, 0.025536771758373378, 0.054428739806168074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 637.25, 475, 806, 634.0, 806.0, 806.0, 806.0, 0.06716255016202965, 19.748019754185066, 0.038303641889282536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3ae2a1f-21ab-45ac-b487-589963a5b854", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 862.25, 773, 944, 866.0, 944.0, 944.0, 944.0, 0.06673340006673341, 60.04683068485152, 0.03799372288955622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 162.75, 79, 247, 162.5, 247.0, 247.0, 247.0, 0.06742292716638293, 0.11930697658738855, 0.03733281221029211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 96.15384615384615, 78, 243, 83.0, 181.79999999999995, 243.0, 243.0, 0.07729721373274191, 0.05744451137755527, 0.03879957798694272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 154.92307692307693, 80, 250, 82.0, 246.8, 250.0, 250.0, 0.07722512311466742, 0.03850814056754525, 0.043044652457244016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 259.8461538461538, 77, 1123, 83.0, 1028.6, 1123.0, 1123.0, 0.07682261657832065, 10.652155225267549, 0.04414761244171823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 158.30769230769232, 79, 517, 82.0, 501.4, 517.0, 517.0, 0.07711701023283404, 3.5060433041672847, 0.04439210106777399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc4a1751-57bb-4f78-9610-e7cfe9f6e3ba", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 0.21688362845138057, 0.8276748199279712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 82.75, 80, 87, 82.0, 87.0, 87.0, 87.0, 0.06761096649876609, 0.050246040532774414, 0.03796514232108448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3883f31-3a65-460c-b519-21f07fc58413", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 0.3329884645464025, 0.6221894551616267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 97.75, 79, 245, 82.0, 222.70000000000033, 244.65, 245.0, 0.09543714986495644, 0.025723294299539037, 0.0561066056823279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 530.3157894736842, 77, 1014, 715.0, 973.0, 1014.0, 1014.0, 0.0959537805789548, 45.454029853619986, 0.05207031328909359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 114.70000000000002, 80, 247, 82.5, 244.9, 246.9, 247.0, 0.09536070185476565, 0.025702689171792307, 0.056154788299241885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 380.05263157894734, 81, 733, 476.0, 732.0, 733.0, 733.0, 0.09587679327449526, 14.84958854978781, 0.05212216501153045], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 456.1538461538461, 84, 833, 470.0, 748.5999999999999, 833.0, 833.0, 0.07807432675907465, 0.015477625324308741, 0.05297230463401158], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 382.6923076923076, 164, 1205, 321.0, 1113.0, 1205.0, 1205.0, 0.07678404781874239, 14.233064180020198, 0.16966667417279954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4714b415-dbba-41a1-a98a-cd4f2e1c8e9f", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc2c04d1-b292-48ee-a4b1-507f42d6a6ea", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 616.8571428571428, 136, 1222, 607.0, 1135.8, 1214.1, 1222.0, 0.0951970806228609, 0.05847555049978467, 0.04304321125818808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 101.78947368421052, 80, 246, 85.0, 234.0, 246.0, 246.0, 0.09595038859907383, 0.07130688058974138, 0.048162597402269476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 151.73684210526318, 80, 259, 84.0, 250.0, 259.0, 259.0, 0.09587389051201704, 0.1014422239967302, 0.05044023145975567], "isController": false}, {"data": ["login", 21, 0, 0.0, 2722.3333333333335, 1393, 4674, 2618.0, 4080.8, 4616.299999999999, 4674.0, 0.09511041866700483, 21.80559380887788, 0.1735420153105129], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 89.9, 83, 113, 85.5, 109.90000000000002, 112.9, 113.0, 0.09612426945555214, 0.07781935486196555, 0.0341691739080283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/807d9e34-a2b2-4c81-8a8c-6a349a46fce5", 3, 0, 0.0, 590.6666666666666, 177, 1170, 425.0, 1170.0, 1170.0, 1170.0, 0.02213826081823012, 0.026166674814776553, 0.014196736266898873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34b224ba-6e2e-41a2-af6d-6ca4f23efb7c", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 647.157894736842, 164, 1099, 799.0, 1058.0, 1099.0, 1099.0, 0.0958327869183202, 60.41210521778001, 0.2026250696679142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5c619ff-628b-4628-8ede-c9ba4da02860", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94ba8ee8-bf62-4cc2-baff-c634f0d515da", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 364.35714285714283, 164, 1188, 246.5, 1150.0, 1188.0, 1188.0, 0.11260717790325435, 19.394921164921257, 0.2491402391696025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 517.6249999999999, 80, 1027, 484.5, 1027.0, 1027.0, 1027.0, 0.13328668299428534, 79.74643770513653, 0.1944306471901501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65e4fd1a-7e89-4289-8ed1-40e43a77c129", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.4845765364188164, 0.9054319992412746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96e6b84c-5b34-4df6-9be2-49934acf7ec9", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a02bb45e-7849-4ba0-b77c-ad566f5c0b7a", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1168.181818181818, 275, 2226, 1075.5, 1974.2, 2188.9499999999994, 2226.0, 0.09231091996223643, 0.029338875485156825, 0.04164809084233714], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 216.70000000000002, 164, 486, 169.5, 329.9, 478.1999999999999, 486.0, 0.09532116082109647, 0.14772918185847667, 0.21437952477635272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 99.13333333333334, 82, 253, 87.0, 161.80000000000007, 253.0, 253.0, 0.0813241744240893, 0.06313742057338964, 0.028908202627312994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a02bb45e-7849-4ba0-b77c-ad566f5c0b7a", 3, 0, 0.0, 298.6666666666667, 209, 472, 215.0, 472.0, 472.0, 472.0, 0.0200961937808979, 0.027704225475944855, 0.012887207600380488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64ae2868-4c5e-47fb-8a9e-6db562217dbb", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.7923968672456575, 1.480594758064516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 245.64999999999995, 165, 491, 173.0, 403.40000000000015, 486.94999999999993, 491.0, 0.12091021207651198, 0.18738721344279738, 0.271929900793171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a690fa0b-f9ba-44cf-ac61-5e863bb4fc93", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 99.0909090909091, 79, 260, 83.0, 225.20000000000013, 260.0, 260.0, 0.0532187678403824, 0.03955027570950294, 0.02671332682612945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 98.63636363636364, 80, 246, 82.0, 216.2000000000001, 246.0, 246.0, 0.053219025317741774, 0.014240247008848872, 0.030351475376524602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 113.09090909090908, 81, 244, 83.0, 243.8, 244.0, 244.0, 0.053219025317741774, 0.014344190417672585, 0.03128696605593803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 156.9090909090909, 81, 249, 98.0, 247.8, 249.0, 249.0, 0.05317837477217901, 0.014333233825313874, 0.031314999987914004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=738e845f-fd22-40e7-8a2a-f73b36f304ad", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.5, 84, 85, 84.5, 85.0, 85.0, 85.0, 0.07890168849613381, 0.023269833911945717, 0.0487741882988796], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 916.0862068965519, 646, 1455, 873.0, 1220.2, 1310.8499999999997, 1455.0, 0.2614261245830704, 312.7565314274768, 0.5162144764716488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1168.181818181818, 275, 2226, 1075.5, 1974.2, 2188.9499999999994, 2226.0, 0.0955420928061147, 0.030365828501943415, 0.04310590515275878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.85714285714286, 81, 247, 84.0, 247.0, 247.0, 247.0, 0.03975668906293484, 0.010715670098994157, 0.02341140967280245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 83.14285714285715, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.03979420710042353, 0.010725782382536029, 0.023394641283647422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 145.26666666666668, 81, 709, 82.0, 430.60000000000014, 709.0, 709.0, 0.07916444566416331, 4.768735296853476, 0.046086489135999234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 161.33333333333331, 80, 619, 82.0, 395.8000000000001, 619.0, 619.0, 0.0791648634669988, 1.5717214696429136, 0.04616404180168674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 94.86666666666666, 81, 239, 84.0, 151.40000000000003, 239.0, 239.0, 0.07923009475919333, 0.05888095909350208, 0.039769793658423216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 106.42857142857143, 80, 248, 84.0, 248.0, 248.0, 248.0, 0.039793980876149763, 0.01064799878912601, 0.02269500471842916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 114.6, 79, 246, 82.0, 244.8, 246.0, 246.0, 0.07923260580193961, 0.02913448942508821, 0.0447437254378922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 106.85714285714286, 82, 245, 84.0, 245.0, 245.0, 245.0, 0.03979375465444809, 0.029573288371127923, 0.019974599504283513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 107.71428571428571, 84, 245, 85.0, 245.0, 245.0, 245.0, 0.03938558487593541, 0.031000763095706974, 0.014000344623867665], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 520.076923076923, 81, 1937, 439.0, 1405.7999999999995, 1937.0, 1937.0, 0.0791249992391827, 0.015353055366196583, 0.05384565565713312], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1425.095238095238, 857, 2351, 1338.0, 1995.8000000000002, 2317.5999999999995, 2351.0, 0.0936901888526521, 0.048491992277251574, 0.04309382709921791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 238.0, 166, 494, 169.0, 494.0, 494.0, 494.0, 0.03973795656073663, 0.061586071349501004, 0.08937159566345357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc4a1751-57bb-4f78-9610-e7cfe9f6e3ba", 3, 0, 0.0, 329.33333333333337, 181, 609, 198.0, 609.0, 609.0, 609.0, 0.03413512959970871, 0.028457053028923835, 0.021890040791479874], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 904.5737704918033, 427, 1873, 708.0, 1629.2000000000003, 1739.9, 1873.0, 0.29493105382249984, 87.86687999055978, 1.0743046834205232], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd2d19d6-05bc-4dc1-af50-873f58b75916", 3, 0, 0.0, 391.0, 212, 522, 439.0, 522.0, 522.0, 522.0, 0.023481895458601416, 0.027754805472064374, 0.015058376970522395], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 151.2413793103448, 81, 411, 84.0, 333.4, 339.25, 411.0, 0.26237814118658254, 0.19499000531541924, 0.1268331834837484], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 505.8275862068964, 388, 830, 478.5, 655.0, 665.9, 830.0, 0.2623425379378972, 77.13741674582174, 0.13193985062306351], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 123.70689655172413, 79, 348, 85.5, 249.5, 266.15, 348.0, 0.26271923467169156, 0.46488989572764167, 0.12776775279931873], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 761.344827586207, 562, 1105, 729.5, 931.0, 984.0999999999997, 1105.0, 0.2618687495767208, 235.6299611852947, 0.1314458371898774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 86.6, 83, 95, 86.5, 90.0, 94.75, 95.0, 0.12291580881675096, 0.0918267517039204, 0.043692728915329444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, 2.7777777777777777, 159.78333333333347, 80, 1372, 89.0, 303.00000000000017, 434.29999999999984, 1063.3899999999992, 0.7442752826178644, 1.5647426784503362, 0.3587316412096954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 87.18181818181819, 82, 96, 86.0, 95.0, 96.0, 96.0, 0.054015831549174054, 0.04183061954931154, 0.019200940120995463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 104.2142857142857, 83, 253, 90.0, 187.0, 253.0, 253.0, 0.10862649555407271, 0.08815294707561956, 0.03861332459148679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 258.0909090909091, 165, 504, 185.0, 470.20000000000016, 504.0, 504.0, 0.05315704524147796, 0.0823830378888921, 0.11955144061633177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3ae2a1f-21ab-45ac-b487-589963a5b854", 3, 0, 0.0, 336.0, 179, 434, 395.0, 434.0, 434.0, 434.0, 0.05525268896419626, 0.03552215517717695, 0.035432225670399296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 284.73333333333335, 165, 791, 176.0, 605.0000000000001, 791.0, 791.0, 0.07912894853453188, 6.425507595719652, 0.1766131342844633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=807d9e34-a2b2-4c81-8a8c-6a349a46fce5", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 87.53846153846153, 82, 96, 86.0, 95.2, 96.0, 96.0, 0.07614049678745673, 0.0631282048560066, 0.02706556721741626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 87.26315789473685, 83, 94, 86.0, 93.0, 94.0, 94.0, 0.09432791361548964, 0.07323309699640064, 0.03353062554300608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5c619ff-628b-4628-8ede-c9ba4da02860", 3, 0, 0.0, 843.0, 190, 1830, 509.0, 1830.0, 1830.0, 1830.0, 0.0172748368967483, 0.023814757245354506, 0.011077939025584033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94ba8ee8-bf62-4cc2-baff-c634f0d515da", 3, 0, 0.0, 288.3333333333333, 171, 438, 256.0, 438.0, 438.0, 438.0, 0.05319997872000851, 0.034202460277349224, 0.03411587177031796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96e6b84c-5b34-4df6-9be2-49934acf7ec9", 3, 0, 0.0, 391.6666666666667, 302, 454, 419.0, 454.0, 454.0, 454.0, 0.0261276247376351, 0.026204170513233642, 0.016755019769902717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34b224ba-6e2e-41a2-af6d-6ca4f23efb7c", 3, 0, 0.0, 270.0, 173, 450, 187.0, 450.0, 450.0, 450.0, 0.022668540599356215, 0.026926271043961853, 0.014536791985915279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 91.05000000000001, 81, 245, 83.0, 85.9, 237.0499999999999, 245.0, 0.12097237595795, 0.08990232236718745, 0.060722462150767875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 140.14999999999998, 80, 261, 84.0, 246.8, 260.3, 261.0, 0.12097383940722818, 0.032369953122637234, 0.06899289278693484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96cb011b-efe5-481f-9d7a-80720e4882de", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 123.0, 80, 249, 82.5, 244.60000000000002, 248.8, 249.0, 0.12097749818533753, 0.03260721630776676, 0.07112153701911444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 119.39999999999999, 80, 326, 83.0, 246.70000000000002, 322.04999999999995, 326.0, 0.12097603464753633, 0.03260682183859377, 0.07123881727779727], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 23.529411764705884, 0.2991772625280479], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.14958863126402394], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.764705882352942, 0.14958863126402394], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.6731488406881077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1337, 17, "401/Unauthorized", 9, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
