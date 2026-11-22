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

    var data = {"OkPercent": 96.875, "KoPercent": 3.125};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16666666666666666, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/182fc216-15cb-4659-a1dd-ba02000a02a0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc490e48-859a-412a-91ea-0e4df17a816e"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d08c9e80-84ad-4e70-a2c4-572fa3de8af7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d802265-1be0-4661-ae94-4a9cd74bc716"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0cb2b3b-6c5b-4c71-923d-8bd1ff26726d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=623a88c1-e68c-4b41-9104-656968d6cca1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49022715-748a-48ff-9e63-dec242ef7f57"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=353aefa4-a99a-437a-9eeb-b4aba1296a20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41c7eaf0-68fa-4d60-bce9-73b0a693479b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76340cd6-b180-4cee-ab6c-ff123369f65a"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a255341-5641-4b3e-adf9-5fe801c86a3b"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d802265-1be0-4661-ae94-4a9cd74bc716"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39de2ba6-ac67-4559-a105-e76bb6732a03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=182fc216-15cb-4659-a1dd-ba02000a02a0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c18e819d-581a-4595-a52b-fca5d28f518c"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/353aefa4-a99a-437a-9eeb-b4aba1296a20"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/623a88c1-e68c-4b41-9104-656968d6cca1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc490e48-859a-412a-91ea-0e4df17a816e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c18e819d-581a-4595-a52b-fca5d28f518c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0cb2b3b-6c5b-4c71-923d-8bd1ff26726d"], "isController": false}, {"data": [0.23387096774193547, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49022715-748a-48ff-9e63-dec242ef7f57"], "isController": false}, {"data": [0.861878453038674, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76340cd6-b180-4cee-ab6c-ff123369f65a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d08c9e80-84ad-4e70-a2c4-572fa3de8af7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39de2ba6-ac67-4559-a105-e76bb6732a03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a255341-5641-4b3e-adf9-5fe801c86a3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/41c7eaf0-68fa-4d60-bce9-73b0a693479b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1376, 43, 3.125, 343.1722383720929, 98, 2716, 119.5, 883.0, 1057.7499999999993, 1462.500000000001, 5.368415303104785, 750.253366598196, 3.9389247661071964], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1589.543859649123, 1251, 2004, 1578.0, 1820.4, 1938.0, 2004.0, 0.25989658851530656, 312.74242855266095, 1.2779094952876644], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/182fc216-15cb-4659-a1dd-ba02000a02a0", 3, 0, 0.0, 1053.6666666666667, 239, 1722, 1200.0, 1722.0, 1722.0, 1722.0, 0.08349336227769892, 0.03777857212434945, 0.05354229286688375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc490e48-859a-412a-91ea-0e4df17a816e", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 716.7499999999999, 108, 2716, 539.5, 2167.2000000000007, 2716.0, 2716.0, 0.07578269312745702, 0.015314727596741344, 0.05082861418320466], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 716.7499999999999, 108, 2716, 539.5, 2167.2000000000007, 2716.0, 2716.0, 0.07476076555023924, 0.01510820890727796, 0.050143191688939145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 132.72222222222223, 102, 325, 109.0, 316.90000000000003, 325.0, 325.0, 0.11296102217173841, 0.0396515740804659, 0.06389602957696097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 122.33333333333331, 103, 319, 111.5, 136.3000000000003, 319.0, 319.0, 0.11295747778502936, 0.08394593808047593, 0.05669935896631357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 200.33333333333331, 100, 780, 111.0, 479.4000000000005, 780.0, 780.0, 0.11296031327660216, 1.873981690231443, 0.06597931492707784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 170.1111111111111, 101, 785, 108.5, 382.7000000000006, 785.0, 785.0, 0.11296243998870376, 5.675633305484954, 0.06587024224167687], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 225.5625, 107, 359, 217.5, 346.40000000000003, 359.0, 359.0, 0.07569091614392628, 0.1308514104529155, 0.04891913519580294], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d08c9e80-84ad-4e70-a2c4-572fa3de8af7", 3, 0, 0.0, 444.66666666666663, 218, 861, 255.0, 861.0, 861.0, 861.0, 0.041517894212405544, 0.02631358724985469, 0.02662443085886684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 123.26315789473685, 105, 311, 111.0, 137.0, 311.0, 311.0, 0.13741230925001807, 0.10211988997974976, 0.06897453804151298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 633.1, 491, 763, 633.0, 762.4, 763.0, 763.0, 0.0472067751163647, 13.880359296666258, 0.026922613933551744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 123.05263157894736, 103, 322, 111.0, 146.0, 322.0, 322.0, 0.1374142968727399, 0.05849430544305262, 0.07715428551797958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 866.0, 712, 1020, 896.0, 1019.6, 1020.0, 1020.0, 0.04721435316336166, 42.48355797037299, 0.0268808280217186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 207.10000000000002, 104, 423, 116.5, 414.5, 423.0, 423.0, 0.04729899111251957, 0.08369704286707565, 0.02618996871171738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d802265-1be0-4661-ae94-4a9cd74bc716", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 110.63636363636363, 106, 116, 112.0, 115.8, 116.0, 116.0, 0.07400480358452358, 0.0549977104763891, 0.03714694242426281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 157.1818181818182, 104, 338, 111.0, 333.0, 338.0, 338.0, 0.07400928480118414, 0.019803265659691854, 0.04220842023817534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0cb2b3b-6c5b-4c71-923d-8bd1ff26726d", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=623a88c1-e68c-4b41-9104-656968d6cca1", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 176.09090909090907, 101, 328, 113.0, 327.6, 328.0, 328.0, 0.07400779100199821, 0.019947412418507327, 0.0435084865070341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 176.45454545454547, 102, 332, 110.0, 332.0, 332.0, 332.0, 0.07401127662723883, 0.01994835190343547, 0.04358281231076662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 136.4, 103, 353, 111.0, 332.30000000000007, 353.0, 353.0, 0.04734736393551289, 0.03518685933098174, 0.026586654553632724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49022715-748a-48ff-9e63-dec242ef7f57", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 543.9411764705883, 105, 1118, 742.0, 1076.3999999999999, 1118.0, 1118.0, 0.08829471737899729, 42.07176838899796, 0.04789055155632424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 212.89473684210526, 100, 959, 112.0, 764.0, 959.0, 959.0, 0.1374192661811186, 13.048939679270665, 0.07954439636779181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 401.70588235294116, 101, 871, 491.0, 794.9999999999999, 871.0, 871.0, 0.08829655175995803, 13.755850052328693, 0.047977773615432165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 187.89473684210526, 99, 755, 111.0, 734.0, 755.0, 755.0, 0.13741628455296312, 4.286291911966789, 0.07967686605890097], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 461.99999999999994, 107, 1139, 457.5, 908.0000000000002, 1139.0, 1139.0, 0.07540376359035021, 0.015238150710916108, 0.050979461016254224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=353aefa4-a99a-437a-9eeb-b4aba1296a20", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 312.8181818181818, 216, 451, 266.0, 449.6, 451.0, 451.0, 0.07395007697530741, 0.11460817593731723, 0.16631545632239544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41c7eaf0-68fa-4d60-bce9-73b0a693479b", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76340cd6-b180-4cee-ab6c-ff123369f65a", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 485.52173913043487, 123, 1252, 398.0, 1056.2, 1217.3999999999996, 1252.0, 0.09953392159323515, 0.061139488947407145, 0.045004107126628785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 109.17647058823528, 100, 117, 108.0, 116.2, 117.0, 117.0, 0.08829380021709887, 0.06561677926290259, 0.04431934893709846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 217.11764705882354, 107, 419, 115.0, 354.19999999999993, 419.0, 419.0, 0.08829517596709187, 0.0938339128786305, 0.04643003451302614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a255341-5641-4b3e-adf9-5fe801c86a3b", 3, 0, 0.0, 380.33333333333337, 212, 675, 254.0, 675.0, 675.0, 675.0, 0.04195276119089905, 0.026971583122404174, 0.026903300633486695], "isController": false}, {"data": ["login", 23, 0, 0.0, 2489.130434782608, 1408, 3533, 2337.0, 3315.0, 3501.7999999999997, 3533.0, 0.09864089994810632, 51.437627455836754, 0.21994424510762578], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 113.94736842105263, 104, 123, 115.0, 121.0, 123.0, 123.0, 0.13250020921085665, 0.1072682357771486, 0.04709968374292171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d802265-1be0-4661-ae94-4a9cd74bc716", 3, 0, 0.0, 414.66666666666663, 223, 680, 341.0, 680.0, 680.0, 680.0, 0.02817986267013592, 0.03380299281883166, 0.018071070787815027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39de2ba6-ac67-4559-a105-e76bb6732a03", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=182fc216-15cb-4659-a1dd-ba02000a02a0", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 661.2352941176472, 214, 1225, 851.0, 1187.3999999999999, 1225.0, 1225.0, 0.08824430175398527, 55.95481551101237, 0.18651037422072497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 5, 33.333333333333336, 709.1333333333334, 107, 1233, 858.0, 1170.6000000000001, 1233.0, 1233.0, 0.06991018871090272, 55.76416242059368, 0.12045398074440368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 338.61111111111114, 216, 902, 226.5, 677.0000000000003, 902.0, 902.0, 0.11287884963910123, 7.667573894492767, 0.2522626722186338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c18e819d-581a-4595-a52b-fca5d28f518c", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 759.375, 125, 1451, 832.0, 1357.5, 1427.75, 1451.0, 0.0958600443352705, 0.0295350038943143, 0.04324935594032712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 116.4375, 104, 148, 115.5, 128.40000000000003, 148.0, 148.0, 0.07838219156607619, 0.060853361616240796, 0.027862419658253645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 339.42105263157896, 219, 1272, 229.0, 875.0, 1272.0, 1272.0, 0.13730010189112823, 17.48077431611903, 0.30509330309720123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/353aefa4-a99a-437a-9eeb-b4aba1296a20", 3, 0, 0.0, 332.0, 217, 508, 271.0, 508.0, 508.0, 508.0, 0.034816921023617484, 0.02902543448616027, 0.022327257297046363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/623a88c1-e68c-4b41-9104-656968d6cca1", 3, 0, 0.0, 967.0, 359, 1919, 623.0, 1919.0, 1919.0, 1919.0, 0.06429627724554748, 0.029092391071390302, 0.04123166216592726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc490e48-859a-412a-91ea-0e4df17a816e", 3, 0, 0.0, 352.0, 264, 515, 277.0, 515.0, 515.0, 515.0, 0.038340128056027704, 0.031962587223791326, 0.02458660555676256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 368.94444444444446, 217, 742, 319.0, 683.5000000000001, 742.0, 742.0, 0.1432288558401566, 0.22197675216633644, 0.32212505371082095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 165.0, 108, 333, 113.0, 330.0, 333.0, 333.0, 0.09873698934463324, 0.07337778212037685, 0.049561340354630355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c18e819d-581a-4595-a52b-fca5d28f518c", 3, 0, 0.0, 534.6666666666667, 221, 1062, 321.0, 1062.0, 1062.0, 1062.0, 0.021105506426626706, 0.02908190387497098, 0.013534455618637569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 165.91666666666669, 99, 354, 112.0, 345.90000000000003, 354.0, 354.0, 0.09873617693522907, 0.02641964109399684, 0.05631047590837283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 174.25, 105, 330, 111.5, 329.7, 330.0, 330.0, 0.09873780176740665, 0.026612923132621324, 0.0580470279921668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 182.25, 100, 348, 110.5, 342.90000000000003, 348.0, 348.0, 0.09856829550774994, 0.026567235898573224, 0.05804363495231759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 109.66666666666667, 107, 112, 110.0, 112.0, 112.0, 112.0, 0.024030374393233044, 0.007087083073004277, 0.014854713858316913], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1061.298245614035, 816, 1531, 905.0, 1375.6000000000001, 1450.5999999999997, 1531.0, 0.2633305306341184, 315.0348631431964, 0.5199749345138549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 759.375, 125, 1451, 832.0, 1357.5, 1427.75, 1451.0, 0.09363515063554859, 0.028849501978042556, 0.04224554647814789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 109.75, 103, 113, 110.0, 113.0, 113.0, 113.0, 0.03831307529477122, 0.010326571075543805, 0.022561312893307664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 108.875, 99, 112, 110.5, 112.0, 112.0, 112.0, 0.03831289180918264, 0.010326521620443759, 0.022523789911257766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 171.87499999999997, 99, 916, 109.0, 505.8000000000004, 916.0, 916.0, 0.07592041642348409, 4.288766751424694, 0.04422512538731275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 174.50000000000003, 104, 523, 111.0, 383.0000000000001, 523.0, 523.0, 0.07592041642348409, 1.414379193416751, 0.0442992664189763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 107.75, 101, 115, 108.0, 115.0, 115.0, 115.0, 0.03831307529477122, 0.010251740850358706, 0.02185042575404921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 142.56249999999997, 101, 426, 110.5, 358.1000000000001, 426.0, 426.0, 0.07591897547342598, 0.056420254233669115, 0.03810776698568453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 112.25, 109, 115, 112.5, 115.0, 115.0, 115.0, 0.03831252484327783, 0.028472491607162528, 0.01923109157172344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 149.81250000000003, 103, 337, 111.5, 330.7, 337.0, 337.0, 0.07592185742824198, 0.027441970195925845, 0.04290066870548488], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 663.1333333333333, 110, 1722, 599.0, 1326.0000000000002, 1722.0, 1722.0, 0.07141224862888483, 0.013729190768300578, 0.04859845279412325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 116.24999999999999, 112, 122, 116.5, 122.0, 122.0, 122.0, 0.04011452697451223, 0.03157452025532896, 0.014259460760471144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1272.4347826086955, 834, 2491, 1088.0, 2063.8, 2418.999999999999, 2491.0, 0.0993305981429497, 0.051411344741956376, 0.0456881950442669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 225.5, 223, 229, 224.5, 229.0, 229.0, 229.0, 0.038291985965987145, 0.05934509934377109, 0.08611957390592617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0cb2b3b-6c5b-4c71-923d-8bd1ff26726d", 3, 0, 0.0, 379.0, 208, 599, 330.0, 599.0, 599.0, 599.0, 0.015786150284150705, 0.021762482569459063, 0.01012327996737529], "isController": false}, {"data": ["addBook", 62, 21, 33.87096774193548, 1041.322580645161, 545, 2805, 865.5, 1813.7000000000003, 1887.1999999999998, 2805.0, 0.2815750034061492, 71.75730157761478, 1.025086821324765], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 217.77192982456143, 105, 508, 115.0, 442.4, 460.1, 508.0, 0.26424121050289273, 0.19637457147724746, 0.12773378828020696], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 606.4035087719301, 491, 908, 550.0, 812.8000000000002, 881.2, 908.0, 0.26394021059650485, 77.6071855551774, 0.1327433676339844], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 192.80701754385973, 100, 425, 113.0, 330.6, 339.0, 425.0, 0.2644594356342851, 0.46796923571223104, 0.12861406147058005], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 832.2631578947368, 685, 1119, 783.0, 990.2, 1017.3999999999997, 1119.0, 0.2639768811826164, 237.52686170997973, 0.132504020437368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 137.11111111111111, 107, 325, 113.5, 324.1, 325.0, 325.0, 0.14546394918459374, 0.10867179797481857, 0.05170788818671106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49022715-748a-48ff-9e63-dec242ef7f57", 3, 0, 0.0, 431.66666666666663, 199, 867, 229.0, 867.0, 867.0, 867.0, 0.0370832766783273, 0.030914801944399807, 0.023780616880307543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 21, 11.602209944751381, 185.75690607734808, 100, 2159, 115.0, 305.6000000000001, 433.5000000000001, 1548.920000000005, 0.7551357575555295, 1.6183366309680756, 0.3622202203765666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 150.74999999999997, 109, 340, 114.0, 338.2, 340.0, 340.0, 0.09294328136254851, 0.07197658410205172, 0.03303843204684342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76340cd6-b180-4cee-ab6c-ff123369f65a", 3, 0, 0.0, 330.3333333333333, 214, 449, 328.0, 449.0, 449.0, 449.0, 0.015203344735841885, 0.02095903807170911, 0.009749540732294438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d08c9e80-84ad-4e70-a2c4-572fa3de8af7", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 125.72222222222224, 107, 328, 115.0, 139.00000000000028, 328.0, 328.0, 0.11742602160638799, 0.09529396870596524, 0.041741281117895726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 387.4166666666667, 219, 677, 326.5, 672.5, 677.0, 677.0, 0.09848093162961322, 0.15262620946894156, 0.2214859233818352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 358.625, 215, 1343, 226.0, 869.8000000000004, 1343.0, 1343.0, 0.0758800904870079, 5.78393488806501, 0.16944268741196722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39de2ba6-ac67-4559-a105-e76bb6732a03", 3, 0, 0.0, 361.6666666666667, 214, 582, 289.0, 582.0, 582.0, 582.0, 0.07630093087135663, 0.03452418421588077, 0.04892995892466555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 133.81818181818184, 110, 332, 114.0, 290.0000000000001, 332.0, 332.0, 0.07404615094644443, 0.06139177944680793, 0.02632109271924392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a255341-5641-4b3e-adf9-5fe801c86a3b", 1, 0, 0.0, 1139.0, 1139, 1139, 1139.0, 1139.0, 1139.0, 1139.0, 0.8779631255487269, 0.15861638498683056, 0.6053144205443372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 118.94117647058823, 109, 141, 116.0, 135.4, 141.0, 141.0, 0.09069907646999194, 0.07041578690785508, 0.03224068733894245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41c7eaf0-68fa-4d60-bce9-73b0a693479b", 3, 0, 0.0, 597.0, 244, 969, 578.0, 969.0, 969.0, 969.0, 0.07201670787622728, 0.046768662829776514, 0.04618258936073169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 151.50000000000003, 99, 411, 111.0, 346.2000000000001, 411.0, 411.0, 0.14360709099902666, 0.10672362915064385, 0.0720840280991208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 165.11111111111111, 98, 322, 109.0, 320.2, 322.0, 322.0, 0.14363230130864987, 0.03843286187360358, 0.08191529684008937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 132.16666666666666, 105, 318, 110.0, 309.0, 318.0, 318.0, 0.14386074280096864, 0.038774965833073584, 0.08457438199822571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 181.0, 105, 337, 110.5, 331.6, 337.0, 337.0, 0.1436082367302, 0.03870690755618673, 0.08456617846514708], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 25.58139534883721, 0.7994186046511628], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 6.976744186046512, 0.2180232558139535], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 4.651162790697675, 0.14534883720930233], "isController": false}, {"data": ["401/Unauthorized", 27, 62.7906976744186, 1.9622093023255813], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1376, 43, "401/Unauthorized", 27, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 21, "401/Unauthorized", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
