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

    var data = {"OkPercent": 97.30941704035874, "KoPercent": 2.690582959641256};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7474457215836526, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9a17106-dd5b-4dde-a03e-03fe87359154"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ae52119-5033-45f4-ac8f-bd341fa97f0a"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8bfba0f-4a00-4292-8036-79b270393746"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0da9f980-752c-4736-8ef9-ff298a3e8e9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/614ebe9f-1147-4f23-bc37-45d99577a452"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1da1e0e9-5d53-4646-88c0-9b13426a98e7"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/76792ed5-d2ef-4568-9de7-69e36a2efad9"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76792ed5-d2ef-4568-9de7-69e36a2efad9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75c54b1e-d6cc-4eef-b339-5ea43e55de91"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1da1e0e9-5d53-4646-88c0-9b13426a98e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c27ae06-0fb6-4197-b1e7-860b0ed8f16f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f266ef98-edc7-4dc6-9ea8-ada5c9583d86"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28d223d2-7c77-4ad8-910c-2208b2dbae26"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c258af2d-a190-465c-9ee9-c6778116b4f3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea782b94-8582-4a6a-8384-53e44355a1ce"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32358a5c-7570-4b47-9dd5-2a465d6db170"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0da9f980-752c-4736-8ef9-ff298a3e8e9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9a17106-dd5b-4dde-a03e-03fe87359154"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad2a0a14-dc46-4a6e-a2e7-076d45135438"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87c518f0-adcb-47e8-86ab-628b9711b782"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=614ebe9f-1147-4f23-bc37-45d99577a452"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ae52119-5033-45f4-ac8f-bd341fa97f0a"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.92, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75c54b1e-d6cc-4eef-b339-5ea43e55de91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c27ae06-0fb6-4197-b1e7-860b0ed8f16f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03605fa1-bab8-4e23-96bc-bafcd9cf8200"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28d223d2-7c77-4ad8-910c-2208b2dbae26"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a8bfba0f-4a00-4292-8036-79b270393746"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad2a0a14-dc46-4a6e-a2e7-076d45135438"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea782b94-8582-4a6a-8384-53e44355a1ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 36, 2.690582959641256, 431.27877428998494, 137, 2242, 164.0, 1110.1000000000001, 1274.1999999999998, 1740.0299999999977, 5.2400925828016875, 734.2892186649415, 3.823880183550104], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2068.017543859649, 1726, 2767, 2024.0, 2481.4, 2570.6999999999994, 2767.0, 0.25840847579800613, 310.95189114911307, 1.2705924566825793], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9a17106-dd5b-4dde-a03e-03fe87359154", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ae52119-5033-45f4-ac8f-bd341fa97f0a", 3, 0, 0.0, 655.0, 254, 1193, 518.0, 1193.0, 1193.0, 1193.0, 0.023713352989068147, 0.023782825702903305, 0.015206805139474039], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 433.625, 146, 880, 445.5, 823.3000000000001, 880.0, 880.0, 0.0983713395102337, 0.02058208934576911, 0.06568496424816629], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 433.625, 146, 880, 445.5, 823.3000000000001, 880.0, 880.0, 0.09979853171410216, 0.02088069865209608, 0.06663793560499741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 185.8571428571429, 138, 433, 145.0, 432.5, 433.0, 433.0, 0.07970985612370969, 0.02132861384560201, 0.04545952732055319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 150.99999999999997, 141, 176, 148.5, 168.5, 176.0, 176.0, 0.07983713225020958, 0.059332087541415515, 0.04007449802403098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 206.35714285714283, 140, 434, 149.5, 429.0, 434.0, 434.0, 0.07971711811229863, 0.021486254491205493, 0.04694279513839461], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8bfba0f-4a00-4292-8036-79b270393746", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0da9f980-752c-4736-8ef9-ff298a3e8e9e", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 245.42857142857142, 138, 446, 146.5, 446.0, 446.0, 446.0, 0.07972074960281984, 0.021487233291385036, 0.04686708130947025], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 235.125, 143, 355, 243.0, 331.90000000000003, 355.0, 355.0, 0.09787010190724361, 0.16424782239023256, 0.06324759759484225], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 188.85714285714286, 139, 443, 149.0, 437.0, 442.8, 443.0, 0.10105044341896957, 0.07509705804866781, 0.05072258585678746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 184.76190476190476, 139, 427, 147.0, 416.0, 426.0, 427.0, 0.10105190218175869, 0.04149406139624857, 0.056822898120434624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 968.3333333333333, 735, 1041, 1004.5, 1041.0, 1041.0, 1041.0, 0.05168314784825828, 15.196561509406333, 0.0294755452572098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1129.8333333333333, 960, 1306, 1111.5, 1306.0, 1306.0, 1306.0, 0.05155037760651597, 46.385120386241205, 0.029349482563084773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 201.33333333333334, 143, 436, 147.5, 436.0, 436.0, 436.0, 0.052067966051686135, 0.09213589305239774, 0.028830602296197303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 177.16666666666666, 137, 435, 148.0, 374.4000000000002, 435.0, 435.0, 0.06318782581222684, 0.046958921331156867, 0.03171732662840293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 146.91666666666669, 142, 155, 145.5, 154.1, 155.0, 155.0, 0.06321545407133865, 0.01691507267143241, 0.03605256365006032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/614ebe9f-1147-4f23-bc37-45d99577a452", 3, 0, 0.0, 516.0, 233, 902, 413.0, 902.0, 902.0, 902.0, 0.029642804209278197, 0.02972964836223507, 0.019009220147225926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 169.16666666666669, 139, 427, 147.0, 343.6000000000003, 427.0, 427.0, 0.06321711919587825, 0.01703898915826406, 0.037164751714764355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 197.0, 144, 450, 149.5, 443.70000000000005, 450.0, 450.0, 0.06321645313553607, 0.017038809634187458, 0.037226094961648686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 146.83333333333334, 139, 159, 144.5, 159.0, 159.0, 159.0, 0.05206435153850159, 0.03869235500078096, 0.029235353647107824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1da1e0e9-5d53-4646-88c0-9b13426a98e7", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 227.76190476190473, 140, 1028, 145.0, 809.0000000000006, 1022.4999999999999, 1028.0, 0.10105433354667026, 8.684535363603116, 0.058581813708742166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 678.9473684210526, 137, 1323, 999.0, 1314.0, 1323.0, 1323.0, 0.10966810966810966, 51.95061102092352, 0.05951253607503607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 274.61904761904765, 138, 1104, 148.0, 901.8000000000004, 1095.3, 1104.0, 0.10105481983369265, 2.854497901909455, 0.05868078195978981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 616.421052631579, 139, 1211, 741.0, 1147.0, 1211.0, 1211.0, 0.1096649447346397, 16.985124888170617, 0.05961791326368648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76792ed5-d2ef-4568-9de7-69e36a2efad9", 3, 0, 0.0, 600.6666666666666, 270, 949, 583.0, 949.0, 949.0, 949.0, 0.023160478958704867, 0.027374902050474402, 0.014852260269742377], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 428.75, 146, 836, 465.5, 795.4000000000001, 836.0, 836.0, 0.09996126500980869, 0.020914747097999523, 0.06713707032274993], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76792ed5-d2ef-4568-9de7-69e36a2efad9", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75c54b1e-d6cc-4eef-b339-5ea43e55de91", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.23221601863753213, 0.8861865359897172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 376.0, 284, 886, 299.0, 792.7000000000003, 886.0, 886.0, 0.06313762423642935, 0.09785098599923182, 0.14199799669579766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1da1e0e9-5d53-4646-88c0-9b13426a98e7", 3, 0, 0.0, 1098.3333333333333, 240, 1861, 1194.0, 1861.0, 1861.0, 1861.0, 0.06821437504263399, 0.03086522829077514, 0.04374424441210578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c27ae06-0fb6-4197-b1e7-860b0ed8f16f", 3, 0, 0.0, 317.0, 250, 450, 251.0, 450.0, 450.0, 450.0, 0.08942944017170452, 0.04046449278602516, 0.057348957401776667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f266ef98-edc7-4dc6-9ea8-ada5c9583d86", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 541.913043478261, 154, 1686, 520.0, 941.2000000000002, 1547.199999999998, 1686.0, 0.0990022297023907, 0.06081289304961303, 0.04476370346895204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 148.3684210526316, 139, 153, 149.0, 152.0, 153.0, 153.0, 0.10966304586224013, 0.08149763466910619, 0.05504570856756975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 256.63157894736844, 144, 456, 150.0, 452.0, 456.0, 456.0, 0.10966177998383932, 0.11603091091423295, 0.05769418071107007], "isController": false}, {"data": ["login", 23, 0, 0.0, 2746.9565217391305, 1654, 3904, 2627.0, 3811.4, 3891.0, 3904.0, 0.10123774143000511, 31.733836624293538, 0.19653928547062346], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 183.09523809523813, 148, 444, 157.0, 378.6000000000002, 442.5, 444.0, 0.10409076714895389, 0.08426879488914332, 0.0370010148849797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28d223d2-7c77-4ad8-910c-2208b2dbae26", 3, 0, 0.0, 320.6666666666667, 237, 458, 267.0, 458.0, 458.0, 458.0, 0.022116391194727452, 0.030489230699762622, 0.014182711801306343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 864.578947368421, 286, 1469, 1163.0, 1465.0, 1469.0, 1469.0, 0.10956818601217937, 69.07077415509954, 0.2316666564547195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c258af2d-a190-465c-9ee9-c6778116b4f3", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 462.2142857142857, 291, 623, 567.5, 610.5, 623.0, 623.0, 0.0796400270776092, 0.12342648727750567, 0.17911228746067773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 638.9285714285714, 143, 1459, 171.5, 1458.0, 1459.0, 1459.0, 0.11344851058312534, 58.1847149403585, 0.15258887981750996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea782b94-8582-4a6a-8384-53e44355a1ce", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["register", 25, 8, 32.0, 962.16, 157, 1628, 954.0, 1590.2, 1624.4, 1628.0, 0.09876348121518588, 0.030909883261565203, 0.044559305001382686], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/32358a5c-7570-4b47-9dd5-2a465d6db170", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 466.99999999999994, 285, 1549, 301.0, 1327.8000000000004, 1537.9999999999998, 1549.0, 0.10097707339590706, 11.646703346488403, 0.22463923987103787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 171.18750000000003, 141, 419, 152.5, 241.90000000000018, 419.0, 419.0, 0.08073590779959329, 0.06268070966862956, 0.02869909222563668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 461.1111111111111, 292, 718, 446.5, 718.0, 718.0, 718.0, 0.08363612708974157, 0.12961966180802723, 0.18809961004655745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 154.11111111111111, 140, 204, 149.0, 204.0, 204.0, 204.0, 0.05603915268801136, 0.04164628437068031, 0.02812902781409945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0da9f980-752c-4736-8ef9-ff298a3e8e9e", 3, 0, 0.0, 323.0, 234, 500, 235.0, 500.0, 500.0, 500.0, 0.03853218079299228, 0.02477247951372388, 0.02470976437571445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 173.88888888888889, 139, 414, 145.0, 414.0, 414.0, 414.0, 0.056038803758335774, 0.02434671986202001, 0.031436698722937924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 277.22222222222223, 138, 1030, 146.0, 1030.0, 1030.0, 1030.0, 0.05603985056039851, 5.616176885507472, 0.03241020003113325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 271.44444444444446, 139, 970, 147.0, 970.0, 970.0, 970.0, 0.05603915268801136, 1.8442451098056063, 0.03246452215725831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 152.75, 146, 167, 149.0, 167.0, 167.0, 167.0, 0.14099897775741127, 0.04158368289329902, 0.08716050089886848], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1339.8245614035088, 1109, 2117, 1179.0, 1862.6000000000001, 1943.2999999999993, 2117.0, 0.2502821162450657, 299.4244231710744, 0.49420941313234656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9a17106-dd5b-4dde-a03e-03fe87359154", 3, 0, 0.0, 539.0, 237, 1034, 346.0, 1034.0, 1034.0, 1034.0, 0.020536973397773793, 0.024274007294048383, 0.013169869008338012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 962.16, 157, 1628, 954.0, 1590.2, 1624.4, 1628.0, 0.09904206514590877, 0.030997071326133635, 0.044684994235751806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 189.28571428571428, 139, 449, 149.0, 449.0, 449.0, 449.0, 0.06746207667546886, 0.018183137853934966, 0.0397262033547927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 188.14285714285714, 142, 449, 145.0, 449.0, 449.0, 449.0, 0.06746207667546886, 0.018183137853934966, 0.03966032242053931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad2a0a14-dc46-4a6e-a2e7-076d45135438", 3, 0, 0.0, 363.0, 261, 500, 328.0, 500.0, 500.0, 500.0, 0.0195757287065011, 0.026986722354177133, 0.012553445817645562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87c518f0-adcb-47e8-86ab-628b9711b782", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 303.75, 139, 990, 146.5, 987.9, 990.0, 990.0, 0.08459252836493217, 9.53451350374322, 0.04882244556999503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 367.25000000000006, 145, 1039, 293.5, 1015.2, 1039.0, 1039.0, 0.08458984498910906, 3.1289775400744393, 0.048903504134328674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 188.25, 143, 440, 150.5, 433.0, 440.0, 440.0, 0.0845885033650364, 0.06286313580155536, 0.04245946360315304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 184.28571428571428, 139, 427, 144.0, 427.0, 427.0, 427.0, 0.06746662811430774, 0.018052593850898753, 0.03847706134644114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 238.62499999999997, 144, 442, 150.0, 437.8, 442.0, 442.0, 0.08458984498910906, 0.03851563986930869, 0.04735461781250661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 189.28571428571428, 145, 445, 147.0, 445.0, 445.0, 445.0, 0.06746532764054473, 0.05013780696724076, 0.033864432038320305], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 531.3125, 143, 1194, 500.0, 1082.0, 1194.0, 1194.0, 0.10142116406141051, 0.020526890870827468, 0.0690089805271365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 151.99999999999997, 146, 161, 151.0, 161.0, 161.0, 161.0, 0.0700392219643, 0.05512852822580645, 0.024896754682622268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1403.95652173913, 842, 2242, 1313.0, 2007.8000000000002, 2211.7999999999997, 2242.0, 0.09995176241031502, 0.051732845778776335, 0.04597390634302576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 420.42857142857144, 292, 895, 297.0, 895.0, 895.0, 895.0, 0.06736728644570196, 0.10440613631770412, 0.1515106061371598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=614ebe9f-1147-4f23-bc37-45d99577a452", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ae52119-5033-45f4-ac8f-bd341fa97f0a", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 1305.745762711864, 729, 3406, 1151.0, 2026.0, 2169.0, 3406.0, 0.277869354306975, 85.60632973290396, 1.0097462160905195], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 255.47368421052636, 139, 800, 152.0, 590.6, 603.5, 800.0, 0.25142695826312494, 0.18685147972484187, 0.12153939876977231], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 823.543859649123, 684, 1159, 743.0, 1033.6, 1044.8999999999996, 1159.0, 0.2509730710297821, 73.79441597300497, 0.12622180818392362], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 251.7894736842104, 139, 553, 152.0, 449.0, 453.3999999999999, 553.0, 0.25164451900578344, 0.4452928402719527, 0.12238180709460951], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1078.59649122807, 956, 1493, 1028.0, 1310.4, 1327.0, 1493.0, 0.25096975594291976, 225.82302755521334, 0.12597505327603592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 155.16666666666669, 145, 188, 152.0, 169.10000000000002, 188.0, 188.0, 0.08423141176525642, 0.06292678710978629, 0.02994163465093099], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, 6.857142857142857, 213.14857142857124, 140, 1635, 155.0, 354.6, 407.9999999999999, 919.8400000000086, 0.7560799630168886, 1.6499757514354718, 0.36219268049788944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 192.55555555555554, 149, 420, 152.0, 420.0, 420.0, 420.0, 0.06007489336706427, 0.046522842226642554, 0.02135474725157363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75c54b1e-d6cc-4eef-b339-5ea43e55de91", 3, 0, 0.0, 486.33333333333337, 284, 820, 355.0, 820.0, 820.0, 820.0, 0.025617816337335404, 0.025692868533636195, 0.016428091856950114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 152.07142857142858, 141, 174, 152.0, 164.5, 174.0, 174.0, 0.0777186252685456, 0.0630704859357045, 0.027626542575928323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 434.77777777777777, 287, 1181, 300.0, 1181.0, 1181.0, 1181.0, 0.05598686174977605, 7.519322271262565, 0.12432412388337313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c27ae06-0fb6-4197-b1e7-860b0ed8f16f", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03605fa1-bab8-4e23-96bc-bafcd9cf8200", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 589.9374999999999, 289, 1183, 579.5, 1163.4, 1183.0, 1183.0, 0.08452147637888864, 12.754251578834767, 0.18738757983317575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28d223d2-7c77-4ad8-910c-2208b2dbae26", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8bfba0f-4a00-4292-8036-79b270393746", 3, 0, 0.0, 978.0, 246, 2176, 512.0, 2176.0, 2176.0, 2176.0, 0.0663232595671302, 0.03000954778590852, 0.042531517365640134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad2a0a14-dc46-4a6e-a2e7-076d45135438", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 153.5, 147, 160, 153.5, 159.1, 160.0, 160.0, 0.0665232720580083, 0.05515454880590726, 0.023646944364370134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 173.05263157894737, 149, 443, 155.0, 190.0, 443.0, 443.0, 0.11270145384875464, 0.08749771075171871, 0.04006184492279951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea782b94-8582-4a6a-8384-53e44355a1ce", 3, 0, 0.0, 490.33333333333337, 244, 905, 322.0, 905.0, 905.0, 905.0, 0.07956926504522187, 0.03688366973450388, 0.051025863326525735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 148.83333333333334, 140, 160, 149.0, 158.2, 160.0, 160.0, 0.08369601606963509, 0.062199871317375297, 0.04201147681620355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 284.5, 139, 575, 152.0, 476.00000000000017, 575.0, 575.0, 0.08369134631479105, 0.02239397352563745, 0.04773022094515427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 202.72222222222223, 137, 573, 149.0, 459.6000000000002, 573.0, 573.0, 0.08369134631479105, 0.022557433186408526, 0.04920135789209396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 257.61111111111114, 141, 453, 149.0, 438.6, 453.0, 453.0, 0.08369368112707491, 0.022558062491281908, 0.049284462616822435], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.5979073243647235], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.29895366218236175], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.11111111111111, 0.29895366218236175], "isController": false}, {"data": ["401/Unauthorized", 20, 55.55555555555556, 1.4947683109118086], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 36, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
