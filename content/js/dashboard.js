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

    var data = {"OkPercent": 98.03149606299213, "KoPercent": 1.968503937007874};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8014208389715832, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.42727272727272725, 500, 1500, "see books"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60bcf49b-5b33-4b1a-855d-238342e69631"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf44bae2-fceb-4fc8-8378-e9ddc1a6b9a9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd7fd4da-6e6f-4bf9-9dc2-f893b6d7eec4"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ca3350f-f11d-4aa8-b05e-e2eb6e53cb71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e362893-1b3a-4fb4-987f-765e0323d8fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/e126ad0e-c7e2-4e7f-ab06-d56f3a4db839"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d51b0a7-ae27-4e4b-9f4e-3448758a1a13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e362893-1b3a-4fb4-987f-765e0323d8fd"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cf68813-6caa-4240-840f-db7232c56a7b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4337f2a9-f84a-4481-a451-2eb26a4c50a4"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0b081289-3c70-4e37-b48e-25cf12e80cb2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a171a5d9-83c7-4beb-bdc7-37d47e0c0a55"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ec27762-71dd-497e-b167-89354f01e9d3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7205dc3b-b781-4b7e-9545-5d07355e1500"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d684928-d749-4d09-bb01-04b0407e00c7"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ca3350f-f11d-4aa8-b05e-e2eb6e53cb71"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf44bae2-fceb-4fc8-8378-e9ddc1a6b9a9"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4337f2a9-f84a-4481-a451-2eb26a4c50a4"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a10a50c-0370-4aa7-997a-f6d519665ba3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60bcf49b-5b33-4b1a-855d-238342e69631"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d51b0a7-ae27-4e4b-9f4e-3448758a1a13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9272727272727272, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e126ad0e-c7e2-4e7f-ab06-d56f3a4db839"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b081289-3c70-4e37-b48e-25cf12e80cb2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7205dc3b-b781-4b7e-9545-5d07355e1500"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a171a5d9-83c7-4beb-bdc7-37d47e0c0a55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ec27762-71dd-497e-b167-89354f01e9d3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1270, 25, 1.968503937007874, 324.62440944881854, 77, 5734, 99.0, 853.9000000000001, 1081.2500000000002, 1950.7199999999975, 5.013342596832515, 730.5403719335219, 3.665540319659803], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1335.2909090909095, 1100, 1662, 1330.0, 1577.6, 1628.2, 1662.0, 0.23912731573066437, 287.7514904357226, 1.1757871432655227], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 536.0769230769231, 82, 920, 550.0, 857.5999999999999, 920.0, 920.0, 0.07878692379486309, 0.01561889211948946, 0.05297047535787445], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 536.0769230769231, 82, 920, 550.0, 857.5999999999999, 920.0, 920.0, 0.08009611533840609, 0.015878429114937923, 0.05385067850651551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 119.85000000000002, 77, 239, 81.0, 236.8, 238.9, 239.0, 0.09858238529939471, 0.04118510198347759, 0.055394828614523155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60bcf49b-5b33-4b1a-855d-238342e69631", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 88.89999999999999, 78, 249, 81.0, 84.7, 240.7999999999999, 249.0, 0.0985809275479473, 0.07326180260155069, 0.04948300464809074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 177.90000000000003, 78, 619, 84.0, 454.00000000000034, 611.4999999999999, 619.0, 0.09858238529939471, 2.9225633823123482, 0.05720473959462923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 165.15, 77, 854, 80.5, 643.1000000000009, 845.6999999999998, 854.0, 0.09858238529939471, 8.894374288358406, 0.05710846773398529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf44bae2-fceb-4fc8-8378-e9ddc1a6b9a9", 3, 0, 0.0, 344.0, 182, 447, 403.0, 447.0, 447.0, 447.0, 0.027738994553910736, 0.027820261139517896, 0.0177883526273451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd7fd4da-6e6f-4bf9-9dc2-f893b6d7eec4", 1, 0, 0.0, 1825.0, 1825, 1825, 1825.0, 1825.0, 1825.0, 1825.0, 0.547945205479452, 0.17497859589041095, 0.3269477739726028], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 173.85714285714286, 78, 294, 181.0, 248.5, 294.0, 294.0, 0.07581419025029514, 0.1341185601937594, 0.049002112643640815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 92.42857142857143, 78, 234, 80.5, 161.0, 234.0, 234.0, 0.09467327576296516, 0.07035777622618798, 0.04752154662320712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ca3350f-f11d-4aa8-b05e-e2eb6e53cb71", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 93.64285714285715, 78, 236, 79.5, 178.0, 236.0, 236.0, 0.0946790380609733, 0.025334039481158872, 0.05399663889414884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 595.1428571428572, 460, 692, 618.0, 692.0, 692.0, 692.0, 0.053712698449237664, 15.793316773516569, 0.030633023334330853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 838.7142857142858, 665, 1005, 816.0, 1005.0, 1005.0, 1005.0, 0.05352623167682391, 48.162997351885274, 0.03047440729256674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 168.85714285714283, 79, 239, 232.0, 239.0, 239.0, 239.0, 0.05390461962590194, 0.09538590894739679, 0.02984757746863906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 100.75, 78, 236, 79.5, 234.6, 236.0, 236.0, 0.08404773911581778, 0.062461259245251304, 0.04218802529836947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 109.50000000000001, 78, 244, 80.0, 238.4, 244.0, 244.0, 0.08404994668081507, 0.022489927139202472, 0.04793473521640235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 128.24999999999997, 78, 238, 79.5, 236.6, 238.0, 238.0, 0.08404950515853837, 0.022653968187262296, 0.04941191611859385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 100.0, 77, 243, 79.5, 237.4, 243.0, 243.0, 0.08404950515853837, 0.022653968187262296, 0.049493995713475236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e362893-1b3a-4fb4-987f-765e0323d8fd", 1, 0, 0.0, 1999.0, 1999, 1999, 1999.0, 1999.0, 1999.0, 1999.0, 0.5002501250625312, 0.09037721985992996, 0.344899012006003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 128.0, 79, 258, 81.0, 258.0, 258.0, 258.0, 0.05390378943639738, 0.04005935914169766, 0.030268241138602044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 549.9411764705883, 78, 999, 696.0, 992.6, 999.0, 999.0, 0.12765637906435381, 67.58207026263423, 0.0685947707817076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 102.64285714285715, 78, 234, 81.0, 234.0, 234.0, 234.0, 0.09467775748968689, 0.02551861432339217, 0.05566016602421045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e126ad0e-c7e2-4e7f-ab06-d56f3a4db839", 3, 0, 0.0, 1422.6666666666667, 168, 2536, 1564.0, 2536.0, 2536.0, 2536.0, 0.019136680551391554, 0.02638145902836694, 0.012271894754635861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 404.17647058823536, 77, 703, 468.0, 646.1999999999999, 703.0, 703.0, 0.1278060955989595, 22.119617107973596, 0.06880002997804742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 144.35714285714286, 78, 315, 81.5, 277.0, 315.0, 315.0, 0.09467839777100001, 0.025518786899214847, 0.05575300181241504], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 871.1538461538461, 89, 4262, 452.0, 3356.7999999999993, 4262.0, 4262.0, 0.08031334560686, 0.01592149331854744, 0.05449144662869287], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6d51b0a7-ae27-4e4b-9f4e-3448758a1a13", 3, 0, 0.0, 322.3333333333333, 186, 502, 279.0, 502.0, 502.0, 502.0, 0.024382512861775535, 0.024453946004925266, 0.015635921333886003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 240.93749999999997, 158, 478, 163.0, 474.5, 478.0, 478.0, 0.08401243384020836, 0.13020286377383852, 0.1889459327480467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e362893-1b3a-4fb4-987f-765e0323d8fd", 3, 0, 0.0, 311.6666666666667, 183, 477, 275.0, 477.0, 477.0, 477.0, 0.03559225512528474, 0.022882390583475704, 0.022824460480732726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 572.9545454545455, 170, 1579, 482.5, 1207.4, 1523.7999999999993, 1579.0, 0.10649833475331112, 0.06541743414046162, 0.048153055655061575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 81.82352941176472, 78, 93, 80.0, 90.6, 93.0, 93.0, 0.12778976328825611, 0.09496875963121378, 0.06414447102555043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 153.58823529411765, 78, 246, 81.0, 240.4, 246.0, 246.0, 0.12765637906435381, 0.1469427001201472, 0.0664974750319141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cf68813-6caa-4240-840f-db7232c56a7b", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.769484186746988, 1.4377823795180724], "isController": false}, {"data": ["login", 22, 0, 0.0, 3160.954545454545, 1769, 6344, 2920.0, 5202.599999999999, 6208.249999999998, 6344.0, 0.10915838882218099, 41.699119902737394, 0.2222900499647716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 86.14285714285714, 81, 110, 82.5, 103.5, 110.0, 110.0, 0.08734441775587236, 0.07071144757775213, 0.03104821099915775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4337f2a9-f84a-4481-a451-2eb26a4c50a4", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 642.235294117647, 159, 1084, 787.0, 1075.2, 1084.0, 1084.0, 0.12756537725584363, 89.85348887789368, 0.26769823049938096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b081289-3c70-4e37-b48e-25cf12e80cb2", 3, 0, 0.0, 965.0, 203, 2287, 405.0, 2287.0, 2287.0, 2287.0, 0.0337655321447866, 0.02814893483815055, 0.021653026798577345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a171a5d9-83c7-4beb-bdc7-37d47e0c0a55", 3, 0, 0.0, 302.6666666666667, 163, 555, 190.0, 555.0, 555.0, 555.0, 0.02854750304506699, 0.023798878677869978, 0.018306829752207675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ec27762-71dd-497e-b167-89354f01e9d3", 3, 0, 0.0, 474.3333333333333, 171, 1050, 202.0, 1050.0, 1050.0, 1050.0, 0.0357240673041428, 0.029037433612774926, 0.022908988473034284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 298.5500000000001, 159, 936, 168.0, 746.3000000000004, 927.4999999999999, 936.0, 0.09854207007326603, 11.926506323321458, 0.21910213392852743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 644.5454545454546, 78, 1084, 782.0, 1083.0, 1084.0, 1084.0, 0.07567210588591398, 57.617456221966926, 0.1268166142408024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7205dc3b-b781-4b7e-9545-5d07355e1500", 3, 0, 0.0, 515.0, 173, 759, 613.0, 759.0, 759.0, 759.0, 0.047794293361372656, 0.03072712545205436, 0.0306493352610365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d684928-d749-4d09-bb01-04b0407e00c7", 2, 0, 0.0, 277.0, 180, 374, 277.0, 374.0, 374.0, 374.0, 0.031181303690307288, 0.02755769515598447, 0.019381738084844325], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1180.1739130434783, 375, 2128, 1190.0, 1833.8000000000002, 2085.3999999999996, 2128.0, 0.09382240642234768, 0.029271698471102697, 0.04233003102258264], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 258.0714285714286, 159, 468, 245.0, 432.0, 468.0, 468.0, 0.09462080711548469, 0.14664377040261153, 0.21280441287789184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 98.25, 81, 240, 84.5, 196.80000000000015, 240.0, 240.0, 0.06818956699624958, 0.05294014234572111, 0.02423926014319809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ca3350f-f11d-4aa8-b05e-e2eb6e53cb71", 3, 0, 0.0, 376.6666666666667, 190, 552, 388.0, 552.0, 552.0, 552.0, 0.08032773716764399, 0.0363462092002035, 0.05151225332690711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 300.44444444444446, 160, 1087, 168.5, 803.5000000000005, 1087.0, 1087.0, 0.0896356311593373, 12.038524336073861, 0.19904440013843727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 80.42857142857143, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.03601100907991872, 0.026762087802556782, 0.018075838542068574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 146.14285714285714, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.036011564856828306, 0.009635907002706012, 0.020537845582409894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 100.85714285714285, 77, 234, 79.0, 234.0, 234.0, 234.0, 0.036011935384298796, 0.009706341959049285, 0.021171079200535035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 145.42857142857142, 77, 236, 81.0, 236.0, 236.0, 236.0, 0.036011564856828306, 0.009706242090317004, 0.021206028914714323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 164.0, 89, 239, 164.0, 239.0, 239.0, 239.0, 0.026494277236116998, 0.007813741919245443, 0.016377810049279354], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 904.9636363636364, 619, 1311, 857.0, 1246.6, 1266.6, 1311.0, 0.2426627605315638, 290.3090248210914, 0.4791641619090059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf44bae2-fceb-4fc8-8378-e9ddc1a6b9a9", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1180.1739130434783, 375, 2128, 1190.0, 1833.8000000000002, 2085.3999999999996, 2128.0, 0.09079281868279357, 0.028326495910375643, 0.04096316624165101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 106.0, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.038184456380622664, 0.0102919042588397, 0.022485573435073694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 79.0, 78, 80, 79.0, 80.0, 80.0, 80.0, 0.038222890414973176, 0.01030226343216074, 0.022470878935365094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4337f2a9-f84a-4481-a451-2eb26a4c50a4", 3, 0, 0.0, 319.0, 183, 473, 301.0, 473.0, 473.0, 473.0, 0.025554533374220586, 0.030204593320896794, 0.016387510008858904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 174.25000000000003, 77, 737, 83.5, 586.7000000000005, 737.0, 737.0, 0.06720731215556253, 5.056043066235607, 0.03902924638200636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 140.00000000000003, 77, 619, 80.0, 502.90000000000043, 619.0, 619.0, 0.06720693575577, 1.663360721326441, 0.039094659568867506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 81.66666666666667, 78, 96, 81.0, 91.80000000000001, 96.0, 96.0, 0.06726268882598581, 0.04998721308259298, 0.03376271685210616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 80.33333333333334, 79, 82, 80.5, 82.0, 82.0, 82.0, 0.03822264691829909, 0.0102275441949355, 0.021798853320592452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 105.83333333333334, 78, 235, 79.5, 234.4, 235.0, 235.0, 0.06726419694956867, 0.026417400266814647, 0.03789085052774368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 80.83333333333333, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.038222403424727346, 0.02840551660763429, 0.019185854844052594], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 674.9230769230769, 79, 2038, 477.0, 1848.3999999999999, 2038.0, 2038.0, 0.08016081492717698, 0.015554040336305449, 0.05455054254997718], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 117.5, 79, 275, 86.5, 275.0, 275.0, 275.0, 0.039146093219896656, 0.030812256968004596, 0.013915212824260139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1749.8181818181815, 1015, 5734, 1476.5, 2526.2, 5258.949999999993, 5734.0, 0.10653546662534381, 0.05514042706194553, 0.04900215310599311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 188.0, 161, 318, 162.5, 318.0, 318.0, 318.0, 0.03816478281058182, 0.059147959297259134, 0.08583349102809565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a10a50c-0370-4aa7-997a-f6d519665ba3", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60bcf49b-5b33-4b1a-855d-238342e69631", 3, 0, 0.0, 1148.0, 294, 2038, 1112.0, 2038.0, 2038.0, 2038.0, 0.046056772648417954, 0.02961006705098485, 0.029535104855919064], "isController": false}, {"data": ["addBook", 55, 9, 16.363636363636363, 931.0909090909091, 399, 3617, 773.0, 1525.2, 1836.5999999999956, 3617.0, 0.263747224659886, 87.13229553296121, 0.9569640956107667], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d51b0a7-ae27-4e4b-9f4e-3448758a1a13", 1, 0, 0.0, 982.0, 982, 982, 982.0, 982.0, 982.0, 982.0, 1.0183299389002036, 0.1839756237270876, 0.7020907586558045], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 131.6727272727273, 79, 339, 81.0, 318.4, 320.2, 339.0, 0.24357083704225288, 0.18101309276284616, 0.11774176204679218], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 487.47272727272735, 381, 714, 464.0, 625.4, 697.4, 714.0, 0.2432917820459512, 71.53586196896039, 0.12235865991568834], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 130.00000000000003, 78, 324, 84.0, 242.6, 317.2, 324.0, 0.2437003460544914, 0.4312353779792367, 0.11851833235853194], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 771.4545454545458, 539, 1047, 768.0, 936.8, 961.7999999999998, 1047.0, 0.2430466561199148, 218.69380840714953, 0.12199802856019161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 83.72222222222221, 80, 101, 82.0, 92.00000000000001, 101.0, 101.0, 0.08682858590000242, 0.0648670588022479, 0.03086484889414148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, 5.454545454545454, 175.769696969697, 79, 3285, 88.0, 281.6, 447.29999999999944, 2044.2000000000064, 0.6941493725310368, 1.5782941989095545, 0.3312287219553136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 109.28571428571428, 82, 239, 86.0, 239.0, 239.0, 239.0, 0.03509264458169568, 0.02717623745437956, 0.012474338503649634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 91.4, 79, 236, 83.0, 98.30000000000001, 229.1499999999999, 236.0, 0.09828927516574028, 0.07976405045188495, 0.03493876578157174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e126ad0e-c7e2-4e7f-ab06-d56f3a4db839", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 249.99999999999997, 161, 317, 315.0, 317.0, 317.0, 317.0, 0.035996379792660856, 0.05578735813569607, 0.08095670181884565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 258.75, 158, 817, 175.5, 667.3000000000005, 817.0, 817.0, 0.06717495717596479, 6.792482606234396, 0.1496457745552458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 94.8125, 80, 238, 84.0, 142.8000000000001, 238.0, 238.0, 0.0857586964678137, 0.07110266923942757, 0.03048453663504315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b081289-3c70-4e37-b48e-25cf12e80cb2", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 83.58823529411765, 80, 92, 82.0, 89.6, 92.0, 92.0, 0.12715318967516098, 0.09871756424975878, 0.045198985392342385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7205dc3b-b781-4b7e-9545-5d07355e1500", 1, 0, 0.0, 901.0, 901, 901, 901.0, 901.0, 901.0, 901.0, 1.1098779134295227, 0.2005150527192009, 0.7652087957824639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a171a5d9-83c7-4beb-bdc7-37d47e0c0a55", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 89.61111111111111, 79, 240, 80.0, 103.20000000000022, 240.0, 240.0, 0.08967135448580951, 0.06664052808955179, 0.04501081660713485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 113.83333333333333, 77, 240, 79.0, 237.3, 240.0, 240.0, 0.08967314139959846, 0.03895955492230818, 0.050304919817266064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 182.11111111111111, 78, 847, 80.0, 705.7000000000003, 847.0, 847.0, 0.08967314139959846, 8.986823107896717, 0.05186174518878687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ec27762-71dd-497e-b167-89354f01e9d3", 1, 0, 0.0, 4262.0, 4262, 4262, 4262.0, 4262.0, 4262.0, 4262.0, 0.23463162834350068, 0.04238950316752699, 0.16176750938526516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 166.77777777777777, 78, 622, 80.0, 479.80000000000024, 622.0, 622.0, 0.08967358813917341, 2.9511523367442507, 0.05194957542046949], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 32.0, 0.6299212598425197], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15748031496062992], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15748031496062992], "isController": false}, {"data": ["401/Unauthorized", 13, 52.0, 1.0236220472440944], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1270, 25, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
