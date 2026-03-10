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

    var data = {"OkPercent": 98.96449704142012, "KoPercent": 1.0355029585798816};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8464968152866242, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47413793103448276, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9173128-b519-4824-acb3-2312135f5c55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/445565ba-a04f-4032-b454-e25758378881"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=338e3d1e-311f-43d0-b4ee-a64555a17281"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7ef1a88-481c-432f-adc0-92454f1906e6"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba0495c8-e66f-41e7-841d-5c8a09ff8235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e71ea0fd-54f4-4293-b69f-d81730c8c8da"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ccaa5b5-0b6b-4785-865a-14e2e56e0b57"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/50f1822c-e0ec-455c-b1a7-c5638a329933"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4ffbb2c-a18e-4c6e-9d27-e8d07428822d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71d4c175-af72-4e89-bb4f-1cbfb1005b25"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a837d8e-93d5-418d-99bf-ffe47b1b2c21"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=706d80e9-6e45-4573-97a7-c8f2bf651a6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2b05ae2-a1f7-489e-b260-17a1b2b54d9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9173128-b519-4824-acb3-2312135f5c55"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fa0a818-9daf-435b-974a-14280491c43c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=445565ba-a04f-4032-b454-e25758378881"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=642530cc-9d80-4ac5-93b0-3c8a32d69792"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a837d8e-93d5-418d-99bf-ffe47b1b2c21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/338e3d1e-311f-43d0-b4ee-a64555a17281"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4874ef44-ea38-419e-afcb-221346192a79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e71ea0fd-54f4-4293-b69f-d81730c8c8da"], "isController": false}, {"data": [0.46774193548387094, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.853448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.978021978021978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ccaa5b5-0b6b-4785-865a-14e2e56e0b57"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71d4c175-af72-4e89-bb4f-1cbfb1005b25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4ffbb2c-a18e-4c6e-9d27-e8d07428822d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/706d80e9-6e45-4573-97a7-c8f2bf651a6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50f1822c-e0ec-455c-b1a7-c5638a329933"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/642530cc-9d80-4ac5-93b0-3c8a32d69792"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2b05ae2-a1f7-489e-b260-17a1b2b54d9a"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 14, 1.0355029585798816, 263.44674556213107, 80, 2555, 96.5, 654.7, 813.3499999999999, 1235.9900000000005, 5.3213890714727095, 738.0144710012339, 3.894991831697295], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1206.7758620689658, 978, 1601, 1172.0, 1430.2, 1507.6999999999998, 1601.0, 0.254486420078101, 306.23302338368217, 1.2513077393488659], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9173128-b519-4824-acb3-2312135f5c55", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/445565ba-a04f-4032-b454-e25758378881", 3, 0, 0.0, 362.0, 182, 500, 404.0, 500.0, 500.0, 500.0, 0.016644751077747634, 0.02294613307755899, 0.010673880085664986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=338e3d1e-311f-43d0-b4ee-a64555a17281", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 456.57142857142856, 88, 973, 397.5, 880.5, 973.0, 973.0, 0.06985539932340055, 0.013190469166325706, 0.04724107815571767], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 456.57142857142856, 88, 973, 397.5, 880.5, 973.0, 973.0, 0.07024304092158869, 0.013263665720894295, 0.04750322835761736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 142.94736842105263, 81, 252, 84.0, 247.0, 252.0, 252.0, 0.09429093218993172, 0.040137618235866285, 0.05294172200055582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 109.63157894736841, 81, 247, 84.0, 247.0, 247.0, 247.0, 0.09428906048395101, 0.07007224123856125, 0.04732868856323322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 169.4210526315789, 82, 570, 85.0, 403.0, 570.0, 570.0, 0.09429046425647007, 2.94111033224982, 0.05467160399245676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 177.73684210526315, 82, 726, 85.0, 570.0, 726.0, 726.0, 0.09428999632765278, 8.953507820486735, 0.05457925260290016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7ef1a88-481c-432f-adc0-92454f1906e6", 2, 0, 0.0, 248.0, 236, 260, 248.0, 260.0, 260.0, 260.0, 0.016372239231159647, 0.02769210776207862, 0.01017668971741515], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 207.42857142857144, 82, 408, 181.5, 355.0, 408.0, 408.0, 0.07029982876970278, 0.1688892579978609, 0.04544283713789311], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 84.0, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.12456506033101089, 0.09257227628115165, 0.06252582129896445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 105.53333333333333, 81, 251, 83.0, 249.2, 251.0, 251.0, 0.12439770776490491, 0.045742073792720245, 0.07024907012713445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 512.8, 404, 611, 567.0, 611.0, 611.0, 611.0, 0.07024247703071002, 20.653620516773902, 0.040060162681576805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 666.8, 566, 742, 725.0, 742.0, 742.0, 742.0, 0.06992518005733865, 62.918799930948886, 0.039810917942801206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 117.8, 83, 250, 84.0, 250.0, 250.0, 250.0, 0.07039477389198627, 0.1245657522385538, 0.038978356246832234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 83.875, 82, 89, 84.0, 86.2, 89.0, 89.0, 0.11840537560405243, 0.08799461995574599, 0.059433948301252884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 103.625, 81, 250, 83.0, 247.2, 250.0, 250.0, 0.11840712810911216, 0.03168315732607103, 0.06752906524972803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 113.25000000000001, 80, 249, 83.0, 246.2, 249.0, 249.0, 0.11840712810911216, 0.03191442124815914, 0.06961044054852102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 141.8125, 82, 361, 84.0, 286.80000000000007, 361.0, 361.0, 0.11840800438109617, 0.031914657430842326, 0.06972658851738377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 83.4, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.07055967937681691, 0.05243741797437273, 0.039620913712568095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 525.0666666666667, 83, 825, 729.0, 776.4, 825.0, 825.0, 0.08404350091607415, 50.42254402128541, 0.04459339404075549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 147.99999999999997, 82, 728, 83.0, 441.20000000000016, 728.0, 728.0, 0.12456919818959432, 7.503842505605614, 0.07251938608146825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 380.4, 83, 655, 404.0, 607.0, 655.0, 655.0, 0.08412079746515998, 16.497096079970838, 0.04471655672545776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 126.6, 82, 406, 84.0, 308.20000000000005, 406.0, 406.0, 0.12440389798880366, 2.4698871293800537, 0.07254464285714285], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 347.38461538461536, 96, 566, 367.0, 551.6, 566.0, 566.0, 0.07110780490206267, 0.013471595850586092, 0.04863555916716351], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 247.125, 166, 445, 169.5, 370.80000000000007, 445.0, 445.0, 0.11833181720692537, 0.1833912049876861, 0.26613103030034096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 443.4761904761905, 106, 883, 399.0, 783.0, 874.3999999999999, 883.0, 0.09123770463313753, 0.05604347286547218, 0.04125298559095965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 106.13333333333333, 82, 247, 85.0, 246.4, 247.0, 247.0, 0.08411891049187131, 0.06251415125421296, 0.04222374999299009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba0495c8-e66f-41e7-841d-5c8a09ff8235", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 182.6, 83, 252, 247.0, 251.4, 252.0, 252.0, 0.08404538450763412, 0.1066435250035019, 0.04322646729233787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e71ea0fd-54f4-4293-b69f-d81730c8c8da", 3, 0, 0.0, 253.66666666666669, 176, 385, 200.0, 385.0, 385.0, 385.0, 0.07652475575848787, 0.03457563834400428, 0.04907349246231155], "isController": false}, {"data": ["login", 21, 0, 0.0, 2180.8095238095243, 1408, 4409, 2001.0, 3929.800000000001, 4393.9, 4409.0, 0.08937615444199487, 25.58122679810991, 0.17013638774567802], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 98.46666666666665, 85, 248, 87.0, 159.80000000000007, 248.0, 248.0, 0.11520648842942834, 0.09326775283983994, 0.04095230643389836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ccaa5b5-0b6b-4785-865a-14e2e56e0b57", 3, 0, 0.0, 263.6666666666667, 171, 368, 252.0, 368.0, 368.0, 368.0, 0.053884149079479124, 0.03464231589582398, 0.03455461383026493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50f1822c-e0ec-455c-b1a7-c5638a329933", 3, 0, 0.0, 1041.3333333333333, 408, 2296, 420.0, 2296.0, 2296.0, 2296.0, 0.024077433024607135, 0.024147972379171417, 0.015440280943514342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 643.8000000000001, 171, 911, 813.0, 863.6, 911.0, 911.0, 0.08400208325166464, 67.04052588629197, 0.1745941736855074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4ffbb2c-a18e-4c6e-9d27-e8d07428822d", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71d4c175-af72-4e89-bb4f-1cbfb1005b25", 3, 0, 0.0, 257.6666666666667, 204, 340, 229.0, 340.0, 340.0, 340.0, 0.02124675986911996, 0.029290373712800463, 0.013625038067111432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a837d8e-93d5-418d-99bf-ffe47b1b2c21", 3, 0, 0.0, 1073.6666666666667, 167, 2555, 499.0, 2555.0, 2555.0, 2555.0, 0.07435128503804307, 0.03364202024833329, 0.047679697762026324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=706d80e9-6e45-4573-97a7-c8f2bf651a6e", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2b05ae2-a1f7-489e-b260-17a1b2b54d9a", 3, 0, 0.0, 290.3333333333333, 208, 361, 302.0, 361.0, 361.0, 361.0, 0.0203845892505266, 0.024093894390840528, 0.013072148705578584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9173128-b519-4824-acb3-2312135f5c55", 3, 0, 0.0, 292.0, 161, 432, 283.0, 432.0, 432.0, 432.0, 0.01823819077147547, 0.02514281833242142, 0.011695714785093318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 323.3157894736843, 167, 809, 327.0, 655.0, 809.0, 809.0, 0.09424930429131964, 11.999632885008408, 0.20943051873080912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 583.0, 82, 825, 659.0, 825.0, 825.0, 825.0, 0.0977803852547179, 83.56414305968794, 0.17599923696377937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fa0a818-9daf-435b-974a-14280491c43c", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 2.008402122641509, 3.752702437106918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=445565ba-a04f-4032-b454-e25758378881", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=642530cc-9d80-4ac5-93b0-3c8a32d69792", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 777.304347826087, 112, 2041, 794.0, 1376.6000000000006, 1945.7999999999986, 2041.0, 0.09138261902586128, 0.02878987063399672, 0.04122926756830851], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 98.56249999999999, 84, 258, 85.5, 151.6000000000001, 258.0, 258.0, 0.07584879542631763, 0.05888651598039309, 0.026961876499198848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 255.4, 167, 814, 170.0, 527.2000000000002, 814.0, 814.0, 0.12430904887003073, 10.094267047950144, 0.27745358869865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 267.61111111111114, 166, 494, 251.0, 492.2, 494.0, 494.0, 0.10202809173459092, 0.15812361482694903, 0.22946356959449501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a837d8e-93d5-418d-99bf-ffe47b1b2c21", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 84.00000000000001, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.054024055438503436, 0.04014873651240343, 0.027117543452530046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 112.63636363636364, 82, 249, 83.0, 248.0, 249.0, 249.0, 0.0540243207669489, 0.02183227167357523, 0.03039827281790857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 127.54545454545455, 82, 568, 84.0, 471.20000000000033, 568.0, 568.0, 0.0540245860980006, 4.4324573343900875, 0.031338480607629254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/338e3d1e-311f-43d0-b4ee-a64555a17281", 3, 0, 0.0, 238.66666666666666, 173, 362, 181.0, 362.0, 362.0, 362.0, 0.02039581477880739, 0.028117277209716567, 0.013079347367920102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 179.54545454545453, 82, 643, 83.0, 581.4000000000002, 643.0, 643.0, 0.0540245860980006, 1.4573304763740662, 0.031391238992490585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 3.0721028645833335, 6.439208984375], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 766.3793103448278, 644, 1253, 657.0, 1073.3, 1113.0499999999997, 1253.0, 0.24632947841856473, 294.6956941713349, 0.48640449742415814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 777.304347826087, 112, 2041, 794.0, 1376.6000000000006, 1945.7999999999986, 2041.0, 0.09094144161954847, 0.028650878771104345, 0.04103022073069471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 131.70000000000002, 81, 247, 84.0, 246.7, 247.0, 247.0, 0.043576022729253455, 0.011745099876244095, 0.025660489947011554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 131.2, 81, 245, 84.0, 244.9, 245.0, 245.0, 0.043577162080896646, 0.011745406967116673, 0.025618605051464627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 144.375, 81, 732, 84.0, 391.10000000000036, 732.0, 732.0, 0.0747328301322771, 4.22167965100936, 0.04353333317763994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 119.37499999999999, 81, 658, 83.5, 261.10000000000036, 658.0, 658.0, 0.07473248107166378, 1.3922482420351523, 0.043606110781561624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 82.8, 81, 85, 82.0, 85.0, 85.0, 85.0, 0.043607566784988526, 0.011668430956139508, 0.02486994043206377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 94.68749999999999, 82, 253, 84.0, 137.5000000000001, 253.0, 253.0, 0.07473073581750755, 0.055537197223753165, 0.03751132637714734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 100.30000000000001, 83, 248, 83.5, 232.00000000000006, 248.0, 248.0, 0.043606045542153964, 0.03240644595466716, 0.0218881908287765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 114.43750000000001, 80, 247, 83.5, 246.3, 247.0, 247.0, 0.0747328301322771, 0.027012196047567445, 0.04222879280789926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 88.0, 85, 102, 86.0, 101.10000000000001, 102.0, 102.0, 0.043050006888001105, 0.03388506401536024, 0.01530293213596914], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 381.3076923076923, 246, 499, 377.0, 472.2, 499.0, 499.0, 0.0711985453589502, 0.013339030357964379, 0.04845694267969418], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1177.1904761904761, 844, 1622, 1070.0, 1577.0, 1618.0, 1622.0, 0.09205277692543726, 0.04764450368211108, 0.042340681574102486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 233.8, 166, 493, 170.0, 476.80000000000007, 493.0, 493.0, 0.04355893960117435, 0.06750784877642939, 0.09796507607568801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4874ef44-ea38-419e-afcb-221346192a79", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e71ea0fd-54f4-4293-b69f-d81730c8c8da", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["addBook", 62, 4, 6.451612903225806, 781.0483870967744, 421, 1435, 701.0, 1242.4000000000003, 1355.3999999999999, 1435.0, 0.2814765716153577, 82.51869552775722, 1.0258235601565373], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 143.6206896551725, 82, 488, 85.0, 336.3, 367.0999999999998, 488.0, 0.24692514336558968, 0.18350589267696657, 0.11936322848238955], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 468.58620689655163, 403, 947, 410.0, 605.2, 660.25, 947.0, 0.24672556885132232, 72.54550930219203, 0.12408561324065527], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 125.62068965517241, 82, 257, 86.5, 249.1, 255.05, 257.0, 0.24706082807974103, 0.4371818559379792, 0.1201526292809678], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 619.9310344827587, 559, 969, 570.5, 746.9, 771.1499999999997, 969.0, 0.2467297670956078, 222.00787813729661, 0.1238467776241625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 99.72222222222221, 84, 252, 87.5, 126.0000000000002, 252.0, 252.0, 0.09686897932385452, 0.07236793865502804, 0.03443389499402641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 4, 2.197802197802198, 136.65934065934061, 82, 434, 90.0, 254.70000000000002, 317.4, 397.47999999999945, 0.7333150676100376, 1.5265566702459428, 0.3542157935718085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 103.00000000000001, 84, 251, 88.0, 220.6000000000001, 251.0, 251.0, 0.057574742483879074, 0.04458669022433213, 0.020466021742316386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 86.78947368421052, 83, 92, 86.0, 91.0, 92.0, 92.0, 0.09835183037932749, 0.07981481547384876, 0.03496100220515157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ccaa5b5-0b6b-4785-865a-14e2e56e0b57", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 264.8181818181818, 167, 728, 169.0, 666.4000000000002, 728.0, 728.0, 0.054001777149393464, 5.949256509055116, 0.12019518420742574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 260.9375, 166, 985, 170.0, 527.9000000000004, 985.0, 985.0, 0.07470142773103751, 5.69409170796644, 0.16681069549363636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71d4c175-af72-4e89-bb4f-1cbfb1005b25", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 88.6875, 84, 102, 86.0, 98.5, 102.0, 102.0, 0.11797843944019232, 0.09781610848117507, 0.04193764839475586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4ffbb2c-a18e-4c6e-9d27-e8d07428822d", 3, 0, 0.0, 232.33333333333331, 161, 374, 162.0, 374.0, 374.0, 374.0, 0.03683919690550746, 0.023684054000122797, 0.023624094369742738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 89.19999999999999, 85, 103, 87.0, 102.4, 103.0, 103.0, 0.07940162932143367, 0.061644819639198996, 0.028224797922853376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/706d80e9-6e45-4573-97a7-c8f2bf651a6e", 3, 0, 0.0, 260.6666666666667, 162, 389, 231.0, 389.0, 389.0, 389.0, 0.019989605405189303, 0.027544270729220804, 0.0128188550287184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50f1822c-e0ec-455c-b1a7-c5638a329933", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 101.72222222222223, 81, 246, 84.0, 244.2, 246.0, 246.0, 0.10207669362247503, 0.07585973031904637, 0.05123771535346891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/642530cc-9d80-4ac5-93b0-3c8a32d69792", 3, 0, 0.0, 246.0, 169, 377, 192.0, 377.0, 377.0, 377.0, 0.028690288337397788, 0.023917912901066322, 0.018398394539281788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 137.33333333333334, 81, 249, 83.5, 248.1, 249.0, 249.0, 0.10207900915308449, 0.027314109871040184, 0.05821693490761849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 118.72222222222221, 81, 247, 83.0, 245.2, 247.0, 247.0, 0.10207843026058354, 0.02751332690617291, 0.060010952164913374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 128.1111111111111, 82, 247, 83.5, 246.1, 247.0, 247.0, 0.10207785137464839, 0.0275131708783232, 0.06011029724503221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2b05ae2-a1f7-489e-b260-17a1b2b54d9a", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 42.857142857142854, 0.4437869822485207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07396449704142012], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07396449704142012], "isController": false}, {"data": ["401/Unauthorized", 6, 42.857142857142854, 0.4437869822485207], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 14, "406/Not Acceptable", 6, "401/Unauthorized", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
