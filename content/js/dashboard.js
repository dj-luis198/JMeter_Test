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

    var data = {"OkPercent": 98.46743295019157, "KoPercent": 1.5325670498084292};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8111404087013843, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfe1f431-f56c-4ff4-9145-153ebd85c8fa"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dd93642-54f0-499d-96b9-c46aba91fea0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f731eac2-f749-4a2b-816b-7b7f18f7ba6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c04c2402-498a-4515-9f2a-c76d834fd657"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc29a77c-1772-47e6-9d3f-d7e046a104dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b05275e-c60e-481b-a3ba-d049e4ff9247"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97e127a0-1a72-4489-a37d-7a285412c8bc"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbe8a747-1206-4fb8-8e61-e737f95a7a9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ea560ae-f9a7-4e02-b326-1052c210becb"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7d90a75-1c2f-49a3-991c-369df2f0299f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b05275e-c60e-481b-a3ba-d049e4ff9247"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9dfc59e8-9ddd-442c-b68a-c6d6953ef4ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18283b0b-1d6e-47e5-919f-7f244031be4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29a20d34-6650-4eb9-b718-0fbecb597bbf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9dd93642-54f0-499d-96b9-c46aba91fea0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18283b0b-1d6e-47e5-919f-7f244031be4c"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc29a77c-1772-47e6-9d3f-d7e046a104dc"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97e127a0-1a72-4489-a37d-7a285412c8bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c0629b0-c769-46a6-975e-aa5ecd8a3e8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbe8a747-1206-4fb8-8e61-e737f95a7a9c"], "isController": false}, {"data": [0.3644067796610169, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c04c2402-498a-4515-9f2a-c76d834fd657"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7321428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eee7a1bc-8925-47bd-ac27-fefd872d0baa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9339080459770115, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eee7a1bc-8925-47bd-ac27-fefd872d0baa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dfc59e8-9ddd-442c-b68a-c6d6953ef4ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7d90a75-1c2f-49a3-991c-369df2f0299f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f731eac2-f749-4a2b-816b-7b7f18f7ba6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/caf05830-45b5-4152-92db-c835e348a8fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29a20d34-6650-4eb9-b718-0fbecb597bbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d3d6703-e922-44df-8d6c-9515905d3e12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 20, 1.5325670498084292, 317.57011494252833, 97, 3244, 119.0, 803.0, 940.4000000000001, 1310.5200000000004, 5.139960534555896, 728.9691178961216, 3.752784299143734], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bfe1f431-f56c-4ff4-9145-153ebd85c8fa", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.647740238336714, 1.2103036257606492], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1463.4107142857138, 1197, 2154, 1424.5, 1721.0, 1736.65, 2154.0, 0.2490117346779967, 299.64528160281293, 1.2243887540075324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dd93642-54f0-499d-96b9-c46aba91fea0", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f731eac2-f749-4a2b-816b-7b7f18f7ba6b", 3, 0, 0.0, 288.6666666666667, 179, 359, 328.0, 359.0, 359.0, 359.0, 0.08433836552247617, 0.03816091408731832, 0.054084173202889996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c04c2402-498a-4515-9f2a-c76d834fd657", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 538.5384615384615, 103, 939, 480.0, 925.4, 939.0, 939.0, 0.07491802239472577, 0.014193453461500782, 0.05064507839018459], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 538.5384615384615, 103, 939, 480.0, 925.4, 939.0, 939.0, 0.073908989607259, 0.01400228904668774, 0.049962965555568194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc29a77c-1772-47e6-9d3f-d7e046a104dc", 3, 0, 0.0, 451.66666666666663, 298, 726, 331.0, 726.0, 726.0, 726.0, 0.03988725203424985, 0.024812675337712066, 0.025578739097484444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 160.4, 100, 303, 102.0, 298.0, 302.75, 303.0, 0.11886507625194642, 0.031805694231477846, 0.06779023879993819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 113.44999999999999, 101, 298, 103.0, 121.20000000000005, 289.2499999999999, 298.0, 0.11899237258891705, 0.08843085501969324, 0.059728593272171254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 141.24999999999997, 98, 304, 102.0, 302.40000000000003, 303.95, 304.0, 0.11900936603710711, 0.032076743189689026, 0.0700807106644293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 130.95000000000002, 99, 306, 101.0, 301.40000000000003, 305.8, 306.0, 0.1188700215749089, 0.032039185502612165, 0.06988257127743669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b05275e-c60e-481b-a3ba-d049e4ff9247", 3, 0, 0.0, 329.6666666666667, 198, 576, 215.0, 576.0, 576.0, 576.0, 0.023992130581169377, 0.024062420026231397, 0.015385578530242082], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 221.00000000000003, 100, 523, 197.0, 432.9999999999999, 523.0, 523.0, 0.07426492010808403, 0.1553582853943753, 0.0480055316654194], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 114.74999999999999, 99, 303, 102.0, 167.20000000000013, 303.0, 303.0, 0.19865658484498577, 0.14763443463577558, 0.09971629356476826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 138.0, 99, 303, 102.0, 301.6, 303.0, 303.0, 0.19868125318200444, 0.07181337776756776, 0.11226751965081769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97e127a0-1a72-4489-a37d-7a285412c8bc", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 0.6062552432885906, 2.3136010906040267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 584.6, 498, 708, 511.0, 708.0, 708.0, 708.0, 0.03196256544335275, 9.398055497401444, 0.018228650604412113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 777.2, 689, 899, 707.0, 899.0, 899.0, 899.0, 0.03188246846823869, 28.687901171122775, 0.01815183507517886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 220.8, 99, 305, 297.0, 305.0, 305.0, 305.0, 0.03204429803760719, 0.0567033867618596, 0.01774327830793289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 114.76470588235294, 99, 305, 102.0, 158.59999999999985, 305.0, 305.0, 0.07108895737589749, 0.05283075836236133, 0.03568332430782355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 148.2941176470588, 97, 302, 102.0, 302.0, 302.0, 302.0, 0.0710316299669912, 0.031557825491998495, 0.039808397401078006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 208.35294117647055, 99, 915, 102.0, 736.5999999999998, 915.0, 915.0, 0.0710901464875195, 7.5424407521128405, 0.04107448836003395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 204.52941176470588, 99, 845, 103.0, 729.8, 845.0, 845.0, 0.07103252035917385, 2.474060072620306, 0.0411105608121942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbe8a747-1206-4fb8-8e61-e737f95a7a9c", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 153.0, 102, 303, 104.0, 303.0, 303.0, 303.0, 0.032043681947230465, 0.0238137128533617, 0.017993278437165545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 521.0, 99, 910, 694.5, 909.1, 910.0, 910.0, 0.09699321047526673, 48.49754191251751, 0.05239064689082875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 162.625, 99, 883, 102.0, 470.7000000000004, 883.0, 883.0, 0.1986738520376487, 11.223144591880446, 0.11573139916060296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 428.6111111111112, 100, 807, 498.5, 796.2, 807.0, 807.0, 0.09699268782903421, 15.855547072437373, 0.05248508400644463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 150.49999999999997, 100, 681, 102.0, 416.40000000000026, 681.0, 681.0, 0.19867878607261708, 3.7013382490811106, 0.11592829558436399], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 397.7692307692308, 112, 652, 406.0, 604.4, 652.0, 652.0, 0.07379864324032812, 0.013981383582640288, 0.050476010118929354], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 348.9411764705883, 201, 1019, 211.0, 846.1999999999998, 1019.0, 1019.0, 0.07100077683202886, 10.090222703594728, 0.15754520948361553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ea560ae-f9a7-4e02-b326-1052c210becb", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 516.6363636363635, 174, 1217, 532.0, 880.0999999999999, 1175.5999999999995, 1217.0, 0.09857337443544341, 0.06054946535145889, 0.04456979723008818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 105.22222222222221, 99, 132, 103.0, 113.10000000000002, 132.0, 132.0, 0.09699425578462964, 0.07208264516806949, 0.048686569798144175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 169.6111111111111, 98, 410, 102.5, 398.3, 410.0, 410.0, 0.09699164255346665, 0.1068844533173836, 0.050790111432620445], "isController": false}, {"data": ["login", 22, 0, 0.0, 2202.8636363636365, 1228, 3837, 2020.5, 3138.6, 3734.8499999999985, 3837.0, 0.09374707040404986, 25.61880473683706, 0.17677448289968212], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.18749999999999, 102, 129, 105.0, 116.4, 129.0, 129.0, 0.20612181799443471, 0.16687010460682264, 0.07326986499020922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7d90a75-1c2f-49a3-991c-369df2f0299f", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b05275e-c60e-481b-a3ba-d049e4ff9247", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 644.7222222222223, 203, 1016, 854.0, 1013.3, 1016.0, 1016.0, 0.09693836335729865, 64.4956512373105, 0.2042374350378329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dfc59e8-9ddd-442c-b68a-c6d6953ef4ee", 3, 0, 0.0, 498.0, 209, 869, 416.0, 869.0, 869.0, 869.0, 0.02703506447862878, 0.027114268769093515, 0.017336939135058172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18283b0b-1d6e-47e5-919f-7f244031be4c", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29a20d34-6650-4eb9-b718-0fbecb597bbf", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dd93642-54f0-499d-96b9-c46aba91fea0", 3, 0, 0.0, 362.33333333333337, 212, 649, 226.0, 649.0, 649.0, 649.0, 0.029749509133099303, 0.024800941695920353, 0.01907764745840027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 315.55000000000007, 204, 602, 311.5, 411.6, 592.4999999999999, 602.0, 0.11877824695185324, 0.18408308389901473, 0.26713506125988085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 696.1428571428572, 99, 1203, 811.0, 1203.0, 1203.0, 1203.0, 0.04460615947339242, 38.120891852366356, 0.08028859786910003], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 868.3913043478262, 185, 1722, 899.0, 1617.6000000000004, 1716.3999999999999, 1722.0, 0.09512426123603637, 0.02996866586155698, 0.04291739129985235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 120.13333333333333, 101, 301, 105.0, 193.60000000000008, 301.0, 301.0, 0.07127414411631941, 0.05533490680905657, 0.02533573091634791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18283b0b-1d6e-47e5-919f-7f244031be4c", 3, 0, 0.0, 260.6666666666667, 195, 388, 199.0, 388.0, 388.0, 388.0, 0.03630335079927877, 0.030264609829737284, 0.02328046909979791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 304.56249999999994, 203, 1187, 206.0, 641.0000000000006, 1187.0, 1187.0, 0.19840285700114083, 15.12319238334532, 0.44303997352561875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc29a77c-1772-47e6-9d3f-d7e046a104dc", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 399.4736842105263, 202, 1022, 398.0, 995.0, 1022.0, 1022.0, 0.10060255636390593, 12.808516229773591, 0.22354802216697908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97e127a0-1a72-4489-a37d-7a285412c8bc", 3, 0, 0.0, 424.3333333333333, 315, 523, 435.0, 523.0, 523.0, 523.0, 0.08695148107356095, 0.03934328082430004, 0.05575990159990725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 132.85714285714286, 101, 306, 103.0, 306.0, 306.0, 306.0, 0.03973524970766209, 0.029529809597198097, 0.019945232763416323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 128.85714285714286, 99, 296, 101.0, 296.0, 296.0, 296.0, 0.039735700824231966, 0.010632404322108945, 0.022661766876319794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 157.85714285714286, 99, 302, 100.0, 302.0, 302.0, 302.0, 0.03973615195104506, 0.010710134705555114, 0.02336051120559485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 130.0, 100, 302, 101.0, 302.0, 302.0, 302.0, 0.039735700824231966, 0.010710013112781273, 0.023399050387706913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 2.6332310267857144, 5.519321986607142], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 938.1249999999999, 782, 1735, 806.5, 1295.3, 1313.45, 1735.0, 0.2383090272310619, 285.1004461910983, 0.4705672393175851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 868.3913043478262, 185, 1722, 899.0, 1617.6000000000004, 1716.3999999999999, 1722.0, 0.0931373938537419, 0.029342708151951634, 0.042020972617606206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 232.33333333333331, 101, 298, 298.0, 298.0, 298.0, 298.0, 0.027640598511093094, 0.007450005067443061, 0.016276641506044076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 101.33333333333333, 100, 103, 101.0, 103.0, 103.0, 103.0, 0.027640089185354436, 0.007449867788240063, 0.01624934930623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 181.13333333333333, 98, 899, 103.0, 541.4000000000002, 899.0, 899.0, 0.07280775839473454, 4.385818967452505, 0.04238587080505966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 166.73333333333335, 99, 487, 102.0, 375.4000000000001, 487.0, 487.0, 0.07280634483026413, 1.44548086467242, 0.04245614782842942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c0629b0-c769-46a6-975e-aa5ecd8a3e8f", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 114.33333333333333, 100, 295, 102.0, 179.80000000000007, 295.0, 295.0, 0.07287567409998542, 0.05415858202157119, 0.03658017235096924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 166.66666666666666, 101, 297, 102.0, 297.0, 297.0, 297.0, 0.027640343845877442, 0.007395951380635175, 0.01576363359960198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 141.26666666666668, 99, 303, 101.0, 301.2, 303.0, 303.0, 0.07287638222204948, 0.026797253046232778, 0.04115427990846726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 173.33333333333334, 103, 307, 110.0, 307.0, 307.0, 307.0, 0.027638561320754717, 0.02053998551278744, 0.013873262225456958], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 454.46153846153845, 99, 726, 416.0, 695.1999999999999, 726.0, 726.0, 0.07397501920505306, 0.01385920206561015, 0.05034658007795829], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 102.33333333333333, 102, 103, 102.0, 103.0, 103.0, 103.0, 0.028683979041572646, 0.022577428815925348, 0.010196258174934027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1202.7727272727273, 687, 3244, 1086.5, 1810.4999999999995, 3051.2499999999973, 3244.0, 0.09596677804629088, 0.0496703050434904, 0.044140969199026374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 406.6666666666667, 207, 605, 408.0, 605.0, 605.0, 605.0, 0.0276121051468964, 0.04279336998840292, 0.06210027163408439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbe8a747-1206-4fb8-8e61-e737f95a7a9c", 3, 0, 0.0, 258.6666666666667, 178, 374, 224.0, 374.0, 374.0, 374.0, 0.03747142803612246, 0.031238387760582555, 0.024029529046601963], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 996.5254237288137, 521, 3389, 850.0, 1506.0, 1690.0, 3389.0, 0.28843380444188055, 94.68039189415457, 1.0474821928791072], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c04c2402-498a-4515-9f2a-c76d834fd657", 3, 0, 0.0, 342.6666666666667, 182, 502, 344.0, 502.0, 502.0, 502.0, 0.023154937404485883, 0.027368352120992263, 0.014848706603788146], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 184.91071428571425, 100, 701, 104.0, 404.3, 412.0, 701.0, 0.23902205832138224, 0.17763260388923033, 0.11554288952059004], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 566.2321428571428, 490, 811, 503.0, 703.3, 721.2999999999998, 811.0, 0.2392661365782379, 70.35218853744301, 0.1203340432986255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eee7a1bc-8925-47bd-ac27-fefd872d0baa", 3, 0, 0.0, 353.3333333333333, 192, 588, 280.0, 588.0, 588.0, 588.0, 0.02198768689533861, 0.025988701535473467, 0.014100176817648783], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 159.87500000000003, 99, 491, 104.0, 302.6, 308.0, 491.0, 0.23967062408518577, 0.4241046590257389, 0.11655856522892824], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 750.9821428571429, 679, 995, 701.0, 902.5, 908.3, 995.0, 0.23906185298549834, 215.10827554226486, 0.11999784417436148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 126.47368421052632, 102, 311, 105.0, 302.0, 311.0, 311.0, 0.09926387996384704, 0.07415709782455371, 0.03528520733089876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 171.64942528735625, 100, 2195, 107.0, 304.0, 377.75, 1034.75, 0.7039262091146308, 1.5079759024111494, 0.3382738068147339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 105.14285714285715, 101, 111, 105.0, 111.0, 111.0, 111.0, 0.039715410714083084, 0.03075617255494911, 0.014117587402271722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eee7a1bc-8925-47bd-ac27-fefd872d0baa", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 127.80000000000005, 103, 304, 106.0, 283.80000000000035, 303.85, 304.0, 0.11673038200017509, 0.09472944086147021, 0.04149400297662474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dfc59e8-9ddd-442c-b68a-c6d6953ef4ee", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7d90a75-1c2f-49a3-991c-369df2f0299f", 3, 0, 0.0, 265.0, 191, 407, 197.0, 407.0, 407.0, 407.0, 0.02069122485154046, 0.024820040227189647, 0.01326878677003083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 292.57142857142856, 203, 609, 207.0, 609.0, 609.0, 609.0, 0.039712256336941476, 0.06154624102219348, 0.08931379525778928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 323.99999999999994, 199, 1195, 206.0, 722.2000000000003, 1195.0, 1195.0, 0.07277031747263836, 5.909167710718583, 0.16242088502047272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f731eac2-f749-4a2b-816b-7b7f18f7ba6b", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 140.47058823529412, 102, 429, 106.0, 330.5999999999999, 429.0, 429.0, 0.07373127984490409, 0.06113071932453473, 0.026209165882368247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caf05830-45b5-4152-92db-c835e348a8fb", 1, 0, 0.0, 1136.0, 1136, 1136, 1136.0, 1136.0, 1136.0, 1136.0, 0.8802816901408451, 0.2811055787852113, 0.5252462037852114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29a20d34-6650-4eb9-b718-0fbecb597bbf", 3, 0, 0.0, 255.0, 187, 389, 189.0, 389.0, 389.0, 389.0, 0.02005655949778375, 0.027649586417029356, 0.01286179108419075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 111.0, 102, 161, 105.0, 135.80000000000004, 161.0, 161.0, 0.09240104105172918, 0.07173713636340302, 0.03284568256135686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d3d6703-e922-44df-8d6c-9515905d3e12", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 123.36842105263158, 99, 310, 102.0, 299.0, 310.0, 310.0, 0.10065638558812467, 0.07480420843023718, 0.05052478729716414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 180.63157894736838, 99, 409, 101.0, 305.0, 409.0, 409.0, 0.10065798535691203, 0.04284793558418716, 0.056516644327657635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 238.05263157894737, 99, 890, 103.0, 712.0, 890.0, 890.0, 0.10065905189768802, 9.55829508399733, 0.058265945850727925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 200.99999999999994, 98, 683, 102.0, 499.0, 683.0, 683.0, 0.10065798535691203, 3.1397261970353574, 0.058363627303213636], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.45977011494252873], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07662835249042145], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07662835249042145], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9195402298850575], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
