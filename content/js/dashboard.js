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

    var data = {"OkPercent": 98.8425925925926, "KoPercent": 1.1574074074074074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7846715328467153, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14285714285714285, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a748dfae-a656-439b-ade2-07f5c01b22ce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3addd383-52b8-445a-9aaf-4057613281de"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb05d5f3-8c3f-49fb-9350-1a98306ff464"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c22dbcb4-6da7-4bfe-a367-7e52404324a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6137a6a-f0b6-4422-891b-fe5d98d0fdef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e2a489db-0fcd-420b-ac82-aa6541eb71b6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d579732-a1e6-42b7-977f-83fe902018bc"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f78337c4-844c-4e3f-bc8c-baebda56419d"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3782f2a7-4c51-4120-bb1a-222a5e1cce41"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c687abd6-cefd-4636-82ea-fe30ebc97236"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a748dfae-a656-439b-ade2-07f5c01b22ce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3addd383-52b8-445a-9aaf-4057613281de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/193d773c-8d0e-442c-99e7-d8913fdba3ca"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67f066b6-b1e5-4c29-8b93-539e7523779a"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68c84853-6282-4153-a2c1-b1c4c896d41e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f282ec78-f4b9-4809-b0c2-1665c00b974b"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d579732-a1e6-42b7-977f-83fe902018bc"], "isController": false}, {"data": [0.9588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c22dbcb4-6da7-4bfe-a367-7e52404324a5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2a489db-0fcd-420b-ac82-aa6541eb71b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6137a6a-f0b6-4422-891b-fe5d98d0fdef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=193d773c-8d0e-442c-99e7-d8913fdba3ca"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f78337c4-844c-4e3f-bc8c-baebda56419d"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c687abd6-cefd-4636-82ea-fe30ebc97236"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d419d64-4655-418c-b19e-a96c2abdf679"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68c84853-6282-4153-a2c1-b1c4c896d41e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67f066b6-b1e5-4c29-8b93-539e7523779a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f282ec78-f4b9-4809-b0c2-1665c00b974b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9340c89-afbc-43d1-8491-50808bf1096a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8977a2d-f447-40fb-a8d4-b4a3766ee47c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 15, 1.1574074074074074, 365.85262345679035, 100, 1917, 114.0, 1027.4999999999998, 1224.0, 1622.06, 5.079225731608382, 744.0892741099108, 3.7071079031733403], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1713.625, 1235, 2181, 1656.0, 2084.8, 2143.9, 2181.0, 0.24508194927678942, 294.9157077767019, 1.2050660298912448], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a748dfae-a656-439b-ade2-07f5c01b22ce", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3addd383-52b8-445a-9aaf-4057613281de", 3, 0, 0.0, 440.66666666666663, 194, 830, 298.0, 830.0, 830.0, 830.0, 0.01801790980234353, 0.02129655940504862, 0.01155445387715389], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 521.3846153846154, 105, 976, 463.0, 861.9999999999999, 976.0, 976.0, 0.09106319785931435, 0.017252207406940414, 0.061559323733170815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 521.3846153846154, 105, 976, 463.0, 861.9999999999999, 976.0, 976.0, 0.08819598504738838, 0.016709004979681003, 0.059621068918378005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 142.31250000000003, 102, 310, 104.0, 307.9, 310.0, 310.0, 0.0781490399878869, 0.028246985767106093, 0.04415916822557721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 104.375, 102, 114, 104.0, 108.4, 114.0, 114.0, 0.07814827658628791, 0.058076990705239355, 0.039226771645851546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 198.87499999999994, 101, 815, 105.0, 460.80000000000035, 815.0, 815.0, 0.078150185118251, 1.4559192507106782, 0.04560032774233884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 198.5, 101, 1012, 104.5, 517.8000000000005, 1012.0, 1012.0, 0.07815056683583008, 4.414748607027201, 0.04552423156012953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb05d5f3-8c3f-49fb-9350-1a98306ff464", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 204.6153846153846, 102, 271, 205.0, 264.6, 271.0, 271.0, 0.09122614962492018, 0.1950548299860354, 0.0589694273980197], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 104.42857142857143, 103, 113, 104.0, 109.0, 113.0, 113.0, 0.09709007184665318, 0.07215385222197565, 0.04873466496990208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 119.21428571428574, 101, 310, 103.0, 211.5, 310.0, 310.0, 0.09709007184665318, 0.03639523201059669, 0.05478924952841965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 750.5, 600, 863, 808.0, 863.0, 863.0, 863.0, 0.044334101791097716, 13.035697957306258, 0.025284292427735413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1151.6666666666667, 1108, 1205, 1145.0, 1205.0, 1205.0, 1205.0, 0.04420475643179206, 39.775517540999914, 0.02516735644505349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c22dbcb4-6da7-4bfe-a367-7e52404324a5", 3, 0, 0.0, 437.0, 207, 770, 334.0, 770.0, 770.0, 770.0, 0.01838753570246516, 0.02534870237628253, 0.011791486111281366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 172.16666666666669, 101, 313, 103.0, 313.0, 313.0, 313.0, 0.04456725198324271, 0.07886314511097246, 0.02467737487744006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6137a6a-f0b6-4422-891b-fe5d98d0fdef", 3, 0, 0.0, 399.0, 222, 621, 354.0, 621.0, 621.0, 621.0, 0.02399539288456616, 0.028361742045527258, 0.015387670567251087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 104.72727272727272, 103, 113, 104.0, 111.4, 113.0, 113.0, 0.07528368260399414, 0.055948127403944864, 0.037788879744583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 103.54545454545455, 102, 106, 103.0, 105.8, 106.0, 106.0, 0.07528419784687193, 0.030423798703742993, 0.04236072851149453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 213.63636363636363, 101, 1114, 104.0, 952.4000000000005, 1114.0, 1114.0, 0.07476686332617384, 6.134261373484272, 0.043370621890378186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 205.45454545454547, 101, 821, 104.0, 718.8000000000004, 821.0, 821.0, 0.07491605996009017, 2.0208846607664595, 0.04353032780884146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 104.0, 102, 110, 103.0, 110.0, 110.0, 110.0, 0.044566258885397864, 0.033120042003699, 0.025024998885843527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 663.7058823529412, 102, 1308, 947.0, 1155.9999999999998, 1308.0, 1308.0, 0.11170247716669952, 59.13597671906827, 0.06002211462645378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 211.2142857142857, 102, 1401, 104.0, 852.5, 1401.0, 1401.0, 0.09695492288620955, 6.255709357275428, 0.05640374280629099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 506.8235294117646, 102, 915, 602.0, 914.2, 915.0, 915.0, 0.11170100925147183, 19.332282577270814, 0.060130408874973715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 154.07142857142858, 101, 600, 103.5, 454.0, 600.0, 600.0, 0.09709141850562437, 2.063450000520133, 0.05657796527594769], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 518.0769230769231, 107, 798, 485.0, 783.2, 798.0, 798.0, 0.08800433252098565, 0.01667269580963986, 0.06019226619618197], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e2a489db-0fcd-420b-ac82-aa6541eb71b6", 3, 0, 0.0, 557.0, 190, 963, 518.0, 963.0, 963.0, 963.0, 0.018828254934571815, 0.022254359917783285, 0.012074108795933096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d579732-a1e6-42b7-977f-83fe902018bc", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.244140625, 0.9316934121621622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 356.2727272727273, 206, 1218, 211.0, 1057.4000000000005, 1218.0, 1218.0, 0.07471404895807864, 8.23108174481077, 0.16629580268359279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 565.3043478260869, 188, 969, 596.0, 877.8000000000001, 952.5999999999998, 969.0, 0.10014368441677189, 0.06151404052553664, 0.045279810434536515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 104.11764705882352, 102, 109, 104.0, 106.6, 109.0, 109.0, 0.11169954137482423, 0.08301108494750122, 0.05606793385415983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 194.88235294117646, 100, 419, 106.0, 337.3999999999999, 419.0, 419.0, 0.11170321113878139, 0.12857932817089276, 0.05818731150083121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f78337c4-844c-4e3f-bc8c-baebda56419d", 3, 0, 0.0, 297.6666666666667, 199, 409, 285.0, 409.0, 409.0, 409.0, 0.020908108861553473, 0.028823515959856428, 0.013407869289472766], "isController": false}, {"data": ["login", 23, 0, 0.0, 2447.130434782608, 1478, 3694, 2390.0, 3325.8000000000006, 3646.1999999999994, 3694.0, 0.09578863197174652, 30.02576662141001, 0.18596058167646765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 122.21428571428571, 104, 310, 107.0, 214.5, 310.0, 310.0, 0.0988491138883005, 0.08002530802089954, 0.03513777095248182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3782f2a7-4c51-4120-bb1a-222a5e1cce41", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c687abd6-cefd-4636-82ea-fe30ebc97236", 3, 0, 0.0, 610.3333333333333, 215, 1157, 459.0, 1157.0, 1157.0, 1157.0, 0.07844572863007608, 0.03549464934759302, 0.0503053663415527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 769.4705882352941, 206, 1416, 1052.0, 1260.8, 1416.0, 1416.0, 0.11162179908076166, 78.62327771052199, 0.23424034594550228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a748dfae-a656-439b-ade2-07f5c01b22ce", 3, 0, 0.0, 300.0, 196, 462, 242.0, 462.0, 462.0, 462.0, 0.04301815366084488, 0.03586246468926554, 0.02758651129943503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3addd383-52b8-445a-9aaf-4057613281de", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/193d773c-8d0e-442c-99e7-d8913fdba3ca", 3, 0, 0.0, 302.6666666666667, 194, 401, 313.0, 401.0, 401.0, 401.0, 0.04779581627288225, 0.030728104537416156, 0.030650311867701178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 367.625, 205, 1116, 407.5, 623.9000000000005, 1116.0, 1116.0, 0.07810478733530873, 5.953511672089254, 0.174410507168555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 967.75, 102, 1309, 1218.0, 1309.0, 1309.0, 1309.0, 0.05889454930946141, 52.84770674747489, 0.109356077825466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67f066b6-b1e5-4c29-8b93-539e7523779a", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1016.2173913043475, 278, 1779, 1012.0, 1609.0, 1747.3999999999996, 1779.0, 0.0979761534562153, 0.03086714753078794, 0.04420408486012839], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/68c84853-6282-4153-a2c1-b1c4c896d41e", 3, 0, 0.0, 376.6666666666667, 251, 608, 271.0, 608.0, 608.0, 608.0, 0.033509444078322737, 0.021936032565594735, 0.02148880365699733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 121.73333333333333, 104, 310, 106.0, 197.20000000000007, 310.0, 310.0, 0.08542141230068337, 0.06631838162015946, 0.030364642653758545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 332.14285714285717, 207, 1504, 209.5, 959.0, 1504.0, 1504.0, 0.09688514266337257, 8.418593069857648, 0.2161263157348392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f282ec78-f4b9-4809-b0c2-1665c00b974b", 3, 0, 0.0, 355.0, 210, 446, 409.0, 446.0, 446.0, 446.0, 0.04628343978524484, 0.029755792179641458, 0.02968046106019933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 504.375, 208, 1622, 411.0, 1377.0000000000002, 1622.0, 1622.0, 0.10298727463487793, 15.540731969985645, 0.22832701195296054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 103.875, 102, 107, 104.0, 107.0, 107.0, 107.0, 0.0452135776373645, 0.033601106037142954, 0.02269509658750523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 128.75, 101, 315, 102.5, 315.0, 315.0, 315.0, 0.0452135776373645, 0.029075332884965357, 0.024836559981462433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 365.125, 101, 1106, 103.0, 1106.0, 1106.0, 1106.0, 0.0452135776373645, 10.17995401284631, 0.025609252958663488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 316.75, 103, 902, 104.5, 902.0, 902.0, 902.0, 0.04521332210535835, 3.3326942830580033, 0.02565326185860664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 2.7562792056074765, 5.777234228971963], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1191.7678571428569, 806, 1743, 1109.0, 1643.6, 1722.4, 1743.0, 0.24915797950675622, 298.0795648188933, 0.49198968219009864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1016.2173913043475, 278, 1779, 1012.0, 1609.0, 1747.3999999999996, 1779.0, 0.09631974806104159, 0.030345301062029918, 0.04345676133222775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 16, 0, 0.0, 167.56249999999997, 101, 312, 104.5, 310.6, 312.0, 312.0, 0.08370608700201418, 0.02256140626226163, 0.04929176802950639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 16, 0, 0.0, 140.8125, 101, 311, 102.5, 305.4, 311.0, 311.0, 0.0837065249236178, 0.02256152429581886, 0.049210281253923745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 129.93333333333334, 101, 304, 104.0, 303.4, 304.0, 304.0, 0.08163576299505287, 0.022003389244760346, 0.047992899729513504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 129.99999999999997, 100, 304, 103.0, 302.8, 304.0, 304.0, 0.08163531870428423, 0.022003269494514106, 0.048072360526058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 118.4, 102, 312, 104.0, 193.20000000000007, 312.0, 312.0, 0.08163531870428423, 0.0606684350917581, 0.040977103333986416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 16, 0, 0.0, 116.875, 102, 304, 103.0, 169.60000000000014, 304.0, 304.0, 0.0837065249236178, 0.022398034989327416, 0.04773887749550077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 129.86666666666665, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.08163620729065756, 0.021844063278945478, 0.046558149470453135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 16, 0, 0.0, 117.125, 102, 307, 104.0, 170.50000000000014, 307.0, 307.0, 0.08370696284980356, 0.06220800657099659, 0.0420169715867178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 16, 0, 0.0, 108.43749999999999, 104, 125, 105.5, 119.4, 125.0, 125.0, 0.08410163682810677, 0.0661971868002481, 0.029895503716241077], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 553.9230769230769, 103, 1157, 483.0, 1026.1999999999998, 1157.0, 1157.0, 0.08587490008785663, 0.01608864188845511, 0.05844550742157309], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1294.7826086956522, 714, 1917, 1286.0, 1614.4, 1859.999999999999, 1917.0, 0.09864555365889226, 0.05105678070235634, 0.04537310134115064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 16, 0, 0.0, 286.0625, 208, 613, 211.0, 474.40000000000015, 613.0, 613.0, 0.08365969328264951, 0.12965618480426247, 0.18815261096674005], "isController": false}, {"data": ["addBook", 57, 5, 8.771929824561404, 1117.0701754385964, 528, 3117, 865.0, 1873.2, 2366.3999999999987, 3117.0, 0.2625856858553844, 94.71800129248591, 0.952156535331595], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 182.5535714285715, 102, 420, 105.0, 414.0, 415.3, 420.0, 0.24994867125501014, 0.18575286994635032, 0.12082479713987307], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 631.1607142857144, 501, 1018, 605.5, 814.9, 922.7499999999999, 1018.0, 0.24988955774010593, 73.47582708981298, 0.12567687718374468], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 147.33928571428572, 101, 420, 105.0, 309.3, 320.15, 420.0, 0.2503408659111737, 0.4429859853818816, 0.12174780392945753], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1006.0357142857142, 701, 1411, 1004.5, 1307.1000000000001, 1324.5, 1411.0, 0.24966228717404582, 224.6465648586956, 0.12531876524165972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 108.0625, 104, 117, 107.0, 116.3, 117.0, 117.0, 0.10300252356182726, 0.0769501274656229, 0.03661417829736828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d579732-a1e6-42b7-977f-83fe902018bc", 3, 0, 0.0, 312.6666666666667, 200, 483, 255.0, 483.0, 483.0, 483.0, 0.03436977293036684, 0.027936628583048826, 0.022040511937767796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 186.70000000000005, 102, 1506, 109.0, 325.9, 417.6499999999998, 1479.7299999999998, 0.7136530219007519, 1.5792975752064347, 0.34214185375570394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 106.125, 104, 108, 106.0, 108.0, 108.0, 108.0, 0.047819433817903594, 0.03703204200937261, 0.01699831436495792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c22dbcb4-6da7-4bfe-a367-7e52404324a5", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2a489db-0fcd-420b-ac82-aa6541eb71b6", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 109.6875, 105, 133, 107.5, 122.50000000000001, 133.0, 133.0, 0.07682630532694394, 0.062346347389346114, 0.027309350721687106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6137a6a-f0b6-4422-891b-fe5d98d0fdef", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=193d773c-8d0e-442c-99e7-d8913fdba3ca", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 470.87499999999994, 207, 1211, 208.5, 1211.0, 1211.0, 1211.0, 0.04518676253791452, 13.567292356235491, 0.09873572380721067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f78337c4-844c-4e3f-bc8c-baebda56419d", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 276.5333333333333, 205, 618, 210.0, 492.6000000000001, 618.0, 618.0, 0.08158913885383577, 0.12644722984476306, 0.18349588552771853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c687abd6-cefd-4636-82ea-fe30ebc97236", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d419d64-4655-418c-b19e-a96c2abdf679", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 128.9090909090909, 105, 313, 108.0, 275.20000000000016, 313.0, 313.0, 0.07317089394876707, 0.06066610250244457, 0.026009966208350794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 120.05882352941177, 104, 305, 106.0, 172.19999999999987, 305.0, 305.0, 0.11231352651259893, 0.08719653669679313, 0.03992394887752541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68c84853-6282-4153-a2c1-b1c4c896d41e", 1, 0, 0.0, 700.0, 700, 700, 700.0, 700.0, 700.0, 700.0, 1.4285714285714286, 0.25809151785714285, 0.9849330357142858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67f066b6-b1e5-4c29-8b93-539e7523779a", 3, 0, 0.0, 315.3333333333333, 205, 393, 348.0, 393.0, 393.0, 393.0, 0.03676785998798917, 0.030651852027747478, 0.023578347713651904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f282ec78-f4b9-4809-b0c2-1665c00b974b", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9340c89-afbc-43d1-8491-50808bf1096a", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.6912033279220778, 1.291514475108225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8977a2d-f447-40fb-a8d4-b4a3766ee47c", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 131.06249999999997, 103, 319, 104.0, 311.3, 319.0, 319.0, 0.10318985643711223, 0.0766869929185961, 0.05179647090690985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 218.43750000000006, 102, 314, 304.0, 313.3, 314.0, 314.0, 0.10332713370531102, 0.047047144619239506, 0.05784402284821243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 282.50000000000006, 102, 1302, 103.0, 1208.9, 1302.0, 1302.0, 0.10319251854240569, 11.630938104643663, 0.05955740083843921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 255.56250000000003, 101, 827, 204.0, 670.9000000000002, 827.0, 827.0, 0.10332446465011753, 3.8219709383798723, 0.0597344561258492], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 40.0, 0.46296296296296297], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07716049382716049], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07716049382716049], "isController": false}, {"data": ["401/Unauthorized", 7, 46.666666666666664, 0.5401234567901234], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 15, "401/Unauthorized", 7, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
