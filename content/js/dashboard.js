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

    var data = {"OkPercent": 98.52598913886735, "KoPercent": 1.474010861132661};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7872340425531915, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13392857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/923c6978-cc56-4a5f-91b2-33b71f004c7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/760f683d-a8eb-49bc-a6d5-aec4cc7ac0ed"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/985211e7-2c82-4432-b26f-21ec1678e940"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85c7256f-f65a-47e2-8775-0e5069f89faf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58ff30e1-8ba6-4eaf-a751-d8502732631d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d040f64-1c58-42a0-aba1-f57dd670e947"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=985211e7-2c82-4432-b26f-21ec1678e940"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea250f3a-382a-4912-a021-98e5d1b8bb84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=414a6e06-e5d3-4629-b4ee-06f409ede09c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a1e3c75-8f47-4fc7-b741-ad4596aa48d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c53a1505-8fda-48ac-aea6-1b43b15ec2c3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d14fb03-fb94-4bfd-9cf5-0fcd3126e25c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58017616-9dff-4f5b-95a5-cf2b2cccb8bc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f51dc029-0092-4b1f-b634-c461bbf4fc6e"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba217dfc-d255-4a64-b80d-03fe3e5948cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ea9d7a9-db31-4a3b-a0ae-16c31aa05a3c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e29f54f9-ceb9-4c57-96ca-305296a46157"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=923c6978-cc56-4a5f-91b2-33b71f004c7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df9ddef3-fa8c-4e45-93c1-40d9da491c90"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85c7256f-f65a-47e2-8775-0e5069f89faf"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/414a6e06-e5d3-4629-b4ee-06f409ede09c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a1e3c75-8f47-4fc7-b741-ad4596aa48d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ea9d7a9-db31-4a3b-a0ae-16c31aa05a3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d040f64-1c58-42a0-aba1-f57dd670e947"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c53a1505-8fda-48ac-aea6-1b43b15ec2c3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df9ddef3-fa8c-4e45-93c1-40d9da491c90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f51dc029-0092-4b1f-b634-c461bbf4fc6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c182b463-c3f8-45d6-99d6-488d28dd8aa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2d14fb03-fb94-4bfd-9cf5-0fcd3126e25c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58017616-9dff-4f5b-95a5-cf2b2cccb8bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 19, 1.474010861132661, 356.87897595034923, 105, 2548, 133.0, 898.0, 1103.0, 1448.2999999999988, 5.009287973822682, 719.2340421242645, 3.6512496988209326], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1645.9821428571427, 1319, 2154, 1621.0, 1905.3, 1952.7499999999998, 2154.0, 0.25501375252736846, 306.86793340099547, 1.253900628882129], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 581.1428571428571, 116, 2036, 452.0, 1387.0, 2036.0, 2036.0, 0.08428758925453649, 0.016603526231501884, 0.05671303612927307], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 581.1428571428571, 116, 2036, 452.0, 1387.0, 2036.0, 2036.0, 0.08527693685242826, 0.016798414458095524, 0.05737872020637019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 159.0, 107, 342, 113.0, 341.0, 342.0, 342.0, 0.10991808210302216, 0.038100716781598556, 0.06220179296639978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 161.73684210526315, 110, 343, 116.0, 340.0, 343.0, 343.0, 0.1100607071690069, 0.08179316226134205, 0.05524531590319292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 217.2105263157895, 109, 779, 115.0, 346.0, 779.0, 779.0, 0.10992126166467073, 1.729146869992074, 0.06423184744375213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 183.47368421052633, 109, 988, 114.0, 342.0, 988.0, 988.0, 0.11006453257330877, 5.240539202162478, 0.06420808206759121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/923c6978-cc56-4a5f-91b2-33b71f004c7b", 3, 0, 0.0, 378.33333333333337, 206, 719, 210.0, 719.0, 719.0, 719.0, 0.04355084561225231, 0.027602049611671623, 0.027928113885461275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/760f683d-a8eb-49bc-a6d5-aec4cc7ac0ed", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.8294439935064934, 1.54981737012987], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 365.7142857142857, 114, 2442, 202.5, 1434.5, 2442.0, 2442.0, 0.08417862704659286, 0.16838661326835547, 0.05440842342450681], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/985211e7-2c82-4432-b26f-21ec1678e940", 3, 0, 0.0, 320.0, 187, 489, 284.0, 489.0, 489.0, 489.0, 0.018849786054928278, 0.02227980897312649, 0.01208791618756794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 151.78947368421052, 107, 361, 115.0, 336.0, 361.0, 361.0, 0.08902216183291946, 0.06615807144028486, 0.04468495232628965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 146.89473684210523, 106, 335, 113.0, 332.0, 335.0, 335.0, 0.08892882885412864, 0.030825247830604623, 0.05032413680530203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 653.0, 553, 796, 567.0, 796.0, 796.0, 796.0, 0.052133837988885066, 15.329079375071684, 0.029732579478036016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 951.8, 755, 1015, 999.0, 1015.0, 1015.0, 1015.0, 0.0518839045751227, 46.68522853887142, 0.029539371452438026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 246.6, 112, 341, 332.0, 341.0, 341.0, 341.0, 0.05224933382099378, 0.09245682898793041, 0.028931027613772926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85c7256f-f65a-47e2-8775-0e5069f89faf", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 155.90909090909088, 113, 341, 116.0, 339.6, 341.0, 341.0, 0.05363185146902517, 0.03985726461711733, 0.026920675444413022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 154.0909090909091, 109, 338, 113.0, 337.2, 338.0, 338.0, 0.05357464652909347, 0.014335403465792589, 0.030554290598623617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 175.09090909090907, 107, 343, 115.0, 342.4, 343.0, 343.0, 0.05363002111072649, 0.014454966627500499, 0.03152858662954819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 153.54545454545453, 111, 335, 114.0, 333.6, 335.0, 335.0, 0.05357621216180016, 0.0144404634342352, 0.031549273372622554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 113.6, 112, 116, 113.0, 116.0, 116.0, 116.0, 0.052375216047766196, 0.03892337833237312, 0.02940991135494684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 630.3125, 111, 1123, 770.5, 1052.3000000000002, 1123.0, 1123.0, 0.10157698265573022, 57.13473403098733, 0.05426036085223089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 183.8421052631579, 109, 1018, 112.0, 340.0, 1018.0, 1018.0, 0.08902257893725782, 4.238661664124837, 0.051932888103303675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 525.3125000000001, 113, 909, 667.0, 832.0000000000001, 909.0, 909.0, 0.1014552487238832, 18.654761857582194, 0.05429441044989061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 181.36842105263156, 105, 752, 114.0, 342.0, 752.0, 752.0, 0.08892799640543678, 1.3989064927968322, 0.05196455546532744], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 638.6428571428571, 117, 2251, 455.5, 1706.0, 2251.0, 2251.0, 0.0853939711856343, 0.016821468654313006, 0.05800547512595611], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 352.2727272727273, 226, 679, 231.0, 678.2, 679.0, 679.0, 0.05354439560546542, 0.08298335529870471, 0.12042260066346373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 431.26086956521726, 155, 1200, 349.0, 841.8000000000002, 1138.599999999999, 1200.0, 0.10354763191067891, 0.06360494186700882, 0.04681889997523861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 113.49999999999999, 109, 118, 114.0, 117.3, 118.0, 118.0, 0.10158601160620183, 0.0754950730784371, 0.05099141598201927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58ff30e1-8ba6-4eaf-a751-d8502732631d", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 184.3125, 106, 343, 116.0, 343.0, 343.0, 343.0, 0.10157827240753203, 0.1225337509681679, 0.05259949115634165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d040f64-1c58-42a0-aba1-f57dd670e947", 3, 0, 0.0, 282.6666666666667, 213, 416, 219.0, 416.0, 416.0, 416.0, 0.017433245198593718, 0.024033135877618617, 0.011179522474358602], "isController": false}, {"data": ["login", 23, 0, 0.0, 2144.5652173913045, 1196, 4362, 2166.0, 2915.4, 4079.799999999996, 4362.0, 0.101179844974881, 26.454211961602248, 0.1891322467314511], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 119.57894736842105, 112, 132, 118.0, 126.0, 132.0, 132.0, 0.09460219775842582, 0.07658713080247559, 0.03362812498444043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=985211e7-2c82-4432-b26f-21ec1678e940", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 0.15561073428079242, 0.5938442075796727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea250f3a-382a-4912-a021-98e5d1b8bb84", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=414a6e06-e5d3-4629-b4ee-06f409ede09c", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a1e3c75-8f47-4fc7-b741-ad4596aa48d1", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c53a1505-8fda-48ac-aea6-1b43b15ec2c3", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 762.1249999999998, 226, 1236, 903.0, 1167.4, 1236.0, 1236.0, 0.10138067811001071, 75.86300549752568, 0.2117955230926176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d14fb03-fb94-4bfd-9cf5-0fcd3126e25c", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 0.179765236318408, 0.6860230099502488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58017616-9dff-4f5b-95a5-cf2b2cccb8bc", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f51dc029-0092-4b1f-b634-c461bbf4fc6e", 3, 0, 0.0, 597.6666666666666, 427, 878, 488.0, 878.0, 878.0, 878.0, 0.027567195037904894, 0.02298163622788881, 0.017678181713760625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 417.0000000000001, 223, 1321, 234.0, 688.0, 1321.0, 1321.0, 0.10984246278363927, 7.077578497615263, 0.2455591035554271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 643.3333333333334, 114, 1128, 869.0, 1128.0, 1128.0, 1128.0, 0.09328261522994165, 62.01022578279662, 0.14432691086846117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba217dfc-d255-4a64-b80d-03fe3e5948cf", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ea9d7a9-db31-4a3b-a0ae-16c31aa05a3c", 3, 0, 0.0, 277.3333333333333, 193, 429, 210.0, 429.0, 429.0, 429.0, 0.07802543629223127, 0.035304478009831206, 0.050035842934796744], "isController": false}, {"data": ["register", 24, 6, 25.0, 887.4583333333335, 163, 1959, 887.0, 1402.5, 1870.25, 1959.0, 0.09876665144014124, 0.031153933999185174, 0.04456073531771997], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e29f54f9-ceb9-4c57-96ca-305296a46157", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 384.8947368421053, 224, 1355, 239.0, 696.0, 1355.0, 1355.0, 0.08888265150983557, 5.727056069164737, 0.1987022475030992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 130.63157894736847, 113, 333, 117.0, 139.0, 333.0, 333.0, 0.13294708705935038, 0.1032157560665855, 0.04725853485312846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 339.3333333333333, 227, 1327, 230.0, 543.1000000000013, 1327.0, 1327.0, 0.09287111037731469, 6.308498923920502, 0.20754919589096932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 113.85714285714286, 110, 117, 115.0, 117.0, 117.0, 117.0, 0.04049730692908922, 0.030096143137731343, 0.020327749767140486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 111.99999999999999, 109, 114, 113.0, 114.0, 114.0, 114.0, 0.04049777551504492, 0.010836318838986631, 0.02309638759842406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 113.14285714285714, 109, 116, 113.0, 116.0, 116.0, 116.0, 0.0404975412207116, 0.010915352907144923, 0.023808124819207407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=923c6978-cc56-4a5f-91b2-33b71f004c7b", 1, 0, 0.0, 2251.0, 2251, 2251, 2251.0, 2251.0, 2251.0, 2251.0, 0.444247001332741, 0.0802594680142159, 0.30628748334073747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 112.42857142857142, 111, 116, 112.0, 116.0, 116.0, 116.0, 0.04049847841431101, 0.010915605510107262, 0.02384822508186478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 118.0, 117, 119, 118.0, 119.0, 119.0, 119.0, 0.12236906510034265, 0.03608931412139011, 0.07564415840675477], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1074.392857142857, 853, 1673, 904.0, 1436.4, 1483.9999999999998, 1673.0, 0.24956548865813988, 298.56708743705155, 0.49279435358081913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 887.4583333333335, 163, 1959, 887.0, 1402.5, 1870.25, 1959.0, 0.09779552585469214, 0.030847612159243715, 0.04412259076647244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 230.33333333333331, 115, 459, 117.0, 459.0, 459.0, 459.0, 0.014458737173895233, 0.0038970815039014494, 0.008514275894393384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 189.66666666666669, 113, 342, 114.0, 342.0, 342.0, 342.0, 0.014466894922119883, 0.0038992802719776246, 0.008504951897574383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 286.36842105263156, 108, 1015, 114.0, 984.0, 1015.0, 1015.0, 0.1264853709682788, 17.998986608777418, 0.07264327380754253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df9ddef3-fa8c-4e45-93c1-40d9da491c90", 3, 0, 0.0, 287.0, 210, 408, 243.0, 408.0, 408.0, 408.0, 0.027474288644876502, 0.02755477972489079, 0.01761860306979385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 275.7894736842105, 111, 777, 116.0, 774.0, 777.0, 777.0, 0.12647779316221108, 5.900602496105816, 0.07276243518013101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 115.33333333333333, 112, 121, 113.0, 121.0, 121.0, 121.0, 0.014482888467275913, 0.003875304140657813, 0.008259772328993295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 150.05263157894737, 110, 344, 114.0, 343.0, 344.0, 344.0, 0.1268442486147273, 0.09426608710528073, 0.06366986698043929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 191.33333333333331, 114, 341, 119.0, 341.0, 341.0, 341.0, 0.014482468971310229, 0.010762850475749106, 0.007269520557864705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 170.36842105263156, 108, 340, 112.0, 339.0, 340.0, 340.0, 0.12685017658879846, 0.06402491437613081, 0.07066212036746494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 119.0, 116, 122, 119.0, 122.0, 122.0, 122.0, 0.014833934107664695, 0.011675928604275139, 0.005273000014833934], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 411.07142857142856, 114, 719, 418.0, 642.0, 719.0, 719.0, 0.08393587299303332, 0.01620636833459237, 0.05712042249721212], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1224.3043478260863, 732, 2548, 1132.0, 1600.2000000000003, 2367.7999999999975, 2548.0, 0.10263183728837762, 0.05311999390902357, 0.04720663609650962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 424.0, 230, 801, 241.0, 801.0, 801.0, 801.0, 0.014450379804149186, 0.02239526635662574, 0.032499242860308176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85c7256f-f65a-47e2-8775-0e5069f89faf", 3, 0, 0.0, 288.6666666666667, 195, 456, 215.0, 456.0, 456.0, 456.0, 0.04245443224272614, 0.027294109270632853, 0.027225010259821124], "isController": false}, {"data": ["addBook", 56, 5, 8.928571428571429, 1131.6607142857142, 575, 3951, 951.5, 1675.6000000000006, 1824.25, 3951.0, 0.26996798950981526, 93.34581069037083, 0.9796885244321031], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 215.87500000000003, 108, 462, 116.0, 453.3, 455.6, 462.0, 0.25038899719206625, 0.18608010435855704, 0.12103765000983671], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 643.8571428571429, 526, 915, 564.5, 821.3000000000004, 900.1, 915.0, 0.2503084157265202, 73.59898524521286, 0.1258875332999589], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 175.39285714285717, 106, 462, 115.5, 338.3, 342.45, 462.0, 0.25080166962254347, 0.44380139194926643, 0.12197190573440103], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 852.7321428571428, 737, 1135, 782.0, 1013.2, 1036.9999999999998, 1135.0, 0.25010607177151023, 225.0458830195842, 0.12554152430718385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 131.11111111111114, 114, 339, 118.0, 156.3000000000003, 339.0, 339.0, 0.09511329049712547, 0.07105631565459081, 0.03380980248140007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 5, 2.9761904761904763, 188.38095238095238, 109, 2387, 120.0, 301.2, 393.2499999999998, 1356.1400000000035, 0.7157250763653096, 1.6007666951927133, 0.34245234889893367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 181.28571428571428, 116, 519, 129.0, 519.0, 519.0, 519.0, 0.04203446826397646, 0.032552083333333336, 0.014941939890710382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 119.52631578947367, 112, 156, 116.0, 137.0, 156.0, 156.0, 0.11120931348734849, 0.09024896436326815, 0.039531435653705906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/414a6e06-e5d3-4629-b4ee-06f409ede09c", 3, 0, 0.0, 308.6666666666667, 209, 420, 297.0, 420.0, 420.0, 420.0, 0.052588216733570566, 0.03380915626588603, 0.033723563465212894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a1e3c75-8f47-4fc7-b741-ad4596aa48d1", 3, 0, 0.0, 261.3333333333333, 203, 375, 206.0, 375.0, 375.0, 375.0, 0.02072911196484343, 0.028576754287471327, 0.013293082868079932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ea9d7a9-db31-4a3b-a0ae-16c31aa05a3c", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 228.57142857142858, 227, 232, 228.0, 232.0, 232.0, 232.0, 0.04047014748478033, 0.06272082427572889, 0.09101831021235264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 474.7368421052632, 226, 1129, 442.0, 1100.0, 1129.0, 1129.0, 0.12618883162424951, 24.00138039789331, 0.27870375635925293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d040f64-1c58-42a0-aba1-f57dd670e947", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c53a1505-8fda-48ac-aea6-1b43b15ec2c3", 3, 0, 0.0, 369.3333333333333, 202, 565, 341.0, 565.0, 565.0, 565.0, 0.025762129669386003, 0.025837604658651783, 0.01652063653928725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df9ddef3-fa8c-4e45-93c1-40d9da491c90", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f51dc029-0092-4b1f-b634-c461bbf4fc6e", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 120.27272727272728, 113, 151, 117.0, 145.20000000000002, 151.0, 151.0, 0.055560045256182314, 0.046064920334471474, 0.019749859837158556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c182b463-c3f8-45d6-99d6-488d28dd8aa5", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 130.9375, 112, 332, 116.5, 192.70000000000016, 332.0, 332.0, 0.10014897159524794, 0.07775237540842002, 0.03559982974674829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d14fb03-fb94-4bfd-9cf5-0fcd3126e25c", 3, 0, 0.0, 1005.0, 217, 2442, 356.0, 2442.0, 2442.0, 2442.0, 0.02715104124243165, 0.027230585308571587, 0.017411312255074984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58017616-9dff-4f5b-95a5-cf2b2cccb8bc", 3, 0, 0.0, 483.0, 202, 842, 405.0, 842.0, 842.0, 842.0, 0.030413008657569796, 0.030502109268871272, 0.019503133807100424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 125.27777777777777, 107, 328, 114.0, 138.1000000000003, 328.0, 328.0, 0.09292576779915644, 0.06905909110855278, 0.046644379539810946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 136.5, 109, 340, 111.0, 335.5, 340.0, 340.0, 0.09292768677174379, 0.03261947338396171, 0.052564239490136756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 198.38888888888889, 108, 999, 114.5, 405.90000000000094, 999.0, 999.0, 0.09292768677174379, 4.669016303969045, 0.05418765068482542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 186.38888888888889, 106, 794, 113.0, 382.70000000000067, 794.0, 794.0, 0.09292672727554324, 1.5416298025048916, 0.05427783994403746], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.46547711404189296], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.1551590380139643], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.526315789473685, 0.1551590380139643], "isController": false}, {"data": ["401/Unauthorized", 9, 47.36842105263158, 0.6982156710628394], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 19, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
