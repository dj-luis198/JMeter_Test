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

    var data = {"OkPercent": 97.52906976744185, "KoPercent": 2.4709302325581395};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.800251256281407, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce4bcd9b-c634-4987-8c1d-de61b795ab53"], "isController": false}, {"data": [0.3644067796610169, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6783409f-7656-41e7-87f0-34d4caae509d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71f4de08-0c51-4f4b-975a-fdb9c9a30f2e"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05f302e1-7b7f-48c4-a409-b387ceed92e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6783409f-7656-41e7-87f0-34d4caae509d"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25449015-2359-4dfe-b076-6e949cd13cca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f6d30e6-8e9e-434d-89d5-898d004dd008"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bef58a65-74c6-4ceb-82df-a0ce7e9dfd2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e065bd2a-94db-44b5-9697-58d33504c3cb"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.31746031746031744, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e065bd2a-94db-44b5-9697-58d33504c3cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71f4de08-0c51-4f4b-975a-fdb9c9a30f2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bef58a65-74c6-4ceb-82df-a0ce7e9dfd2a"], "isController": false}, {"data": [0.788135593220339, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2787e10b-ba2f-4ab7-8856-a1171c12d675"], "isController": false}, {"data": [0.8891891891891892, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1b91c6a-a095-4619-8037-0ba118254a90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1b91c6a-a095-4619-8037-0ba118254a90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ed363a3-3831-4b18-a5fa-bbc71c394374"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2787e10b-ba2f-4ab7-8856-a1171c12d675"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ed363a3-3831-4b18-a5fa-bbc71c394374"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f6d30e6-8e9e-434d-89d5-898d004dd008"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05f302e1-7b7f-48c4-a409-b387ceed92e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d1842a8-792b-48d7-9a99-a903502f0d13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a078738-4f07-4269-b14f-e33d3ff665dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d1efe81-08bb-43ea-8f8c-613cabadc060"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d1efe81-08bb-43ea-8f8c-613cabadc060"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1376, 34, 2.4709302325581395, 310.9447674418601, 80, 2841, 94.0, 887.8999999999999, 1061.4499999999996, 1788.1400000000003, 5.433216061155269, 759.3448066403396, 3.988248134553043], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/ce4bcd9b-c634-4987-8c1d-de61b795ab53", 2, 0, 0.0, 972.0, 285, 1659, 972.0, 1659.0, 1659.0, 1659.0, 0.02420867881135387, 0.02787307843611935, 0.015047679749440174], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1365.7457627118647, 996, 2175, 1375.0, 1613.0, 1715.0, 2175.0, 0.25087914003733425, 301.89244161478996, 1.2335707715702908], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 90.85, 85, 107, 89.5, 99.9, 106.64999999999999, 107.0, 0.10155119449592526, 0.07884101525806697, 0.036098276168473435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 249.3333333333333, 166, 1071, 172.0, 407.70000000000107, 1071.0, 1071.0, 0.09870044415199868, 6.704470778842463, 0.220576643636563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6783409f-7656-41e7-87f0-34d4caae509d", 3, 0, 0.0, 884.0, 217, 1830, 605.0, 1830.0, 1830.0, 1830.0, 0.02106593638087213, 0.029041093936521312, 0.013509080296327506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71f4de08-0c51-4f4b-975a-fdb9c9a30f2e", 2, 0, 0.0, 253.0, 168, 338, 253.0, 338.0, 338.0, 338.0, 0.016924769400016925, 0.02892416645510705, 0.010520132542100364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 297.6470588235294, 165, 994, 181.0, 599.5999999999997, 994.0, 994.0, 0.08002636162500588, 5.748456109071223, 0.17877672203784775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05f302e1-7b7f-48c4-a409-b387ceed92e6", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 84.66666666666667, 83, 86, 85.0, 86.0, 86.0, 86.0, 0.05731279412607541, 0.042592808915960345, 0.0287683361140652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 121.22222222222223, 82, 253, 83.0, 253.0, 253.0, 253.0, 0.05725445789570782, 0.024874875153473752, 0.032118657478386436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 231.66666666666669, 83, 896, 87.0, 896.0, 896.0, 896.0, 0.05701832188743316, 5.714236890933454, 0.032976091108943006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 166.44444444444443, 82, 484, 87.0, 484.0, 484.0, 484.0, 0.057167539000965495, 1.8813802347997868, 0.033118217309695615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 91.33333333333333, 89, 96, 89.0, 96.0, 96.0, 96.0, 0.02186971481891876, 0.0064498573001108075, 0.013519071758179275], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 940.2881355932203, 653, 1802, 901.0, 1245.0, 1345.0, 1802.0, 0.246576143967034, 294.9907919221237, 0.4868915655286551], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 576.8571428571429, 86, 2397, 476.5, 1688.5, 2397.0, 2397.0, 0.08342271481349064, 0.01711399304314146, 0.05584596777797641], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 576.8571428571429, 86, 2397, 476.5, 1688.5, 2397.0, 2397.0, 0.08318528333501685, 0.01706528447881449, 0.05568702317007231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1126.7619047619046, 90, 2315, 995.0, 1970.6000000000001, 2282.8999999999996, 2315.0, 0.09129680591603302, 0.02853025184876032, 0.04119055110664771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 104.55555555555556, 81, 247, 86.0, 247.0, 247.0, 247.0, 0.041484786606867115, 0.011181446390132152, 0.024429029613223505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 120.74999999999999, 81, 336, 84.0, 276.50000000000006, 336.0, 336.0, 0.10606422188635219, 0.02838046562193408, 0.06048975154456023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 103.66666666666667, 82, 245, 86.0, 245.0, 245.0, 245.0, 0.04148746387133355, 0.01118216799657037, 0.0243900910649832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 116.25000000000001, 81, 250, 86.0, 247.9, 250.0, 250.0, 0.10595254650323487, 0.07874012489156419, 0.053183211819006565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 167.1875, 82, 260, 166.5, 253.70000000000002, 260.0, 260.0, 0.10606492499221086, 0.02858781181430683, 0.06245815407256167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 104.875, 82, 246, 85.0, 244.6, 246.0, 246.0, 0.10606422188635219, 0.02858762230530586, 0.06235416169490626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 187.39999999999998, 80, 805, 85.5, 692.900000000001, 801.8, 805.0, 0.0995996095695305, 8.98615106335033, 0.05769774257484911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6783409f-7656-41e7-87f0-34d4caae509d", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 193.65, 83, 747, 85.0, 698.800000000001, 746.95, 747.0, 0.09960556197458066, 2.9528963741085303, 0.057798461841109205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 104.55555555555556, 82, 245, 87.0, 245.0, 245.0, 245.0, 0.041485360277306586, 0.011100574917951177, 0.023659619533151415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 94.45000000000002, 81, 244, 85.0, 108.90000000000005, 237.3499999999999, 244.0, 0.0996844985620511, 0.0740819369196493, 0.050036945567279556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 86.0, 82, 89, 85.0, 89.0, 89.0, 89.0, 0.0414868901427149, 0.03083156581895121, 0.02082447415366744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 101.25, 81, 258, 83.5, 233.30000000000032, 257.55, 258.0, 0.09968797663313828, 0.041646988675445855, 0.0560160759323318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 124.88888888888889, 85, 250, 90.0, 250.0, 250.0, 250.0, 0.042932581536127765, 0.03379263742003807, 0.015261191092920416], "isController": false}, {"data": ["deleteAccount", 11, 3, 27.272727272727273, 362.1818181818182, 84, 605, 423.0, 583.8000000000001, 605.0, 605.0, 0.08019596978799101, 0.016389481751771604, 0.05456515558018139], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1520.6666666666665, 843, 2380, 1402.0, 2309.4, 2376.9, 2380.0, 0.09209597277467624, 0.047666860908767976, 0.042360549977414556], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 261.9285714285714, 83, 1207, 192.5, 780.0, 1207.0, 1207.0, 0.0841604097409663, 0.16192777496408156, 0.05439077819824586], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/25449015-2359-4dfe-b076-6e949cd13cca", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.8970110603932585, 1.6760665379213484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 210.99999999999997, 166, 337, 178.0, 337.0, 337.0, 337.0, 0.041468157062948666, 0.06426754419814407, 0.0932628571445027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f6d30e6-8e9e-434d-89d5-898d004dd008", 3, 0, 0.0, 658.0, 322, 1207, 445.0, 1207.0, 1207.0, 1207.0, 0.027828797239383314, 0.027910326918795567, 0.017845940938015992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bef58a65-74c6-4ceb-82df-a0ce7e9dfd2a", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 85.22222222222223, 83, 91, 85.0, 89.2, 91.0, 91.0, 0.09874646844227447, 0.07338482664508873, 0.04956609841731355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e065bd2a-94db-44b5-9697-58d33504c3cb", 3, 0, 0.0, 353.3333333333333, 208, 499, 353.0, 499.0, 499.0, 499.0, 0.029579672848818295, 0.024659356173770717, 0.018968735518285165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 551.7142857142857, 412, 670, 491.0, 670.0, 670.0, 670.0, 0.0353935765714748, 10.40688668936069, 0.02018539913841922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 103.11111111111111, 81, 254, 84.0, 249.5, 254.0, 254.0, 0.09874863534871985, 0.03466274255133557, 0.055856839851657604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 935.2857142857143, 720, 1068, 948.0, 1068.0, 1068.0, 1068.0, 0.0353421116406818, 31.800894179091102, 0.020121534264177236], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 974.5714285714289, 427, 4166, 743.0, 1557.6000000000001, 2259.7999999999993, 4166.0, 0.2997430773622609, 80.85099304762585, 1.0916563704324864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 158.0, 83, 261, 88.0, 261.0, 261.0, 261.0, 0.035496957403651115, 0.06281297540567951, 0.019655053562373227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e065bd2a-94db-44b5-9697-58d33504c3cb", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 85.35294117647061, 83, 90, 85.0, 88.4, 90.0, 90.0, 0.1041188179451845, 0.07737736372684122, 0.05226276603889144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 94.8235294117647, 83, 259, 84.0, 122.99999999999989, 259.0, 259.0, 0.10411626724808457, 0.02785923557224138, 0.05937880866492323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71f4de08-0c51-4f4b-975a-fdb9c9a30f2e", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 103.4705882352941, 82, 256, 83.0, 248.79999999999998, 256.0, 256.0, 0.1041188179451845, 0.02806327514928801, 0.061210476956055734], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 145.6949152542373, 82, 496, 86.0, 336.0, 343.0, 496.0, 0.2471773602295817, 0.18369333118624187, 0.11948514972035443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 103.58823529411764, 82, 252, 84.0, 248.8, 252.0, 252.0, 0.10411818025919302, 0.02806310327298562, 0.061311779976849015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bef58a65-74c6-4ceb-82df-a0ce7e9dfd2a", 3, 0, 0.0, 311.3333333333333, 169, 421, 344.0, 421.0, 421.0, 421.0, 0.08856088560885608, 0.04007149446494465, 0.056791974169741695], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 541.2542372881358, 405, 757, 495.0, 737.0, 746.0, 757.0, 0.24722086041239794, 72.69114146637587, 0.12433471007068841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 134.0, 82, 261, 88.0, 261.0, 261.0, 261.0, 0.035496957403651115, 0.026380063070486817, 0.01993237354208925], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 131.6440677966102, 81, 272, 87.0, 250.0, 258.0, 272.0, 0.2476421528917468, 0.4382105283592238, 0.12043534388680655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 565.9375000000001, 84, 1010, 807.5, 995.3000000000001, 1010.0, 1010.0, 0.07016466770451905, 35.5213126891157, 0.0378574012761199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 144.11111111111111, 82, 986, 84.0, 320.90000000000106, 986.0, 986.0, 0.09874917709019092, 4.961508607979482, 0.05758225669299978], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 792.1355932203387, 566, 1266, 805.0, 987.0, 1008.0, 1266.0, 0.24712973473345595, 222.36776972090047, 0.12404754262987923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 99.58823529411765, 83, 278, 88.0, 133.19999999999987, 278.0, 278.0, 0.08291671747347884, 0.06194461803438605, 0.02947430191440068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 430.625, 81, 816, 607.5, 813.9, 816.0, 816.0, 0.0701655907942745, 11.613218964333953, 0.03792642041467864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 116.50000000000001, 82, 492, 84.5, 272.4000000000003, 492.0, 492.0, 0.09874755188360955, 1.6381957416489745, 0.057677742164656064], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 496.2307692307692, 89, 1468, 433.0, 1304.7999999999997, 1468.0, 1468.0, 0.07828307158685807, 0.016207042164466712, 0.0526846483133009], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2787e10b-ba2f-4ab7-8856-a1171c12d675", 1, 0, 0.0, 1060.0, 1060, 1060, 1060.0, 1060.0, 1060.0, 1060.0, 0.9433962264150944, 0.17043779481132074, 0.6504274764150944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 15, 8.108108108108109, 189.58378378378382, 83, 2841, 91.0, 303.4000000000001, 473.4999999999995, 2834.98, 0.7774481210970003, 1.6519746591310231, 0.37350669550929155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 104.66666666666667, 83, 250, 86.0, 250.0, 250.0, 250.0, 0.058093750403428825, 0.04498861725578033, 0.02065051283871884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1b91c6a-a095-4619-8037-0ba118254a90", 3, 0, 0.0, 306.3333333333333, 168, 497, 254.0, 497.0, 497.0, 497.0, 0.03039421294185587, 0.030483258487583962, 0.019491080564927103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1b91c6a-a095-4619-8037-0ba118254a90", 1, 0, 0.0, 1468.0, 1468, 1468, 1468.0, 1468.0, 1468.0, 1468.0, 0.6811989100817438, 0.12306816246594006, 0.46965471730245234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ed363a3-3831-4b18-a5fa-bbc71c394374", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 200.76470588235293, 168, 343, 171.0, 339.0, 343.0, 343.0, 0.1040627314630608, 0.16127690901550534, 0.2340395220306924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2787e10b-ba2f-4ab7-8856-a1171c12d675", 3, 0, 0.0, 282.0, 192, 423, 231.0, 423.0, 423.0, 423.0, 0.03572661990449083, 0.029783813012825854, 0.022910625394481427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 90.625, 85, 105, 90.0, 100.80000000000001, 105.0, 105.0, 0.1064233120264994, 0.0863650120058799, 0.03783016169691971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ed363a3-3831-4b18-a5fa-bbc71c394374", 3, 0, 0.0, 700.3333333333334, 189, 1461, 451.0, 1461.0, 1461.0, 1461.0, 0.05559055701738131, 0.025153279379609383, 0.03564889235815143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 557.8095238095237, 112, 1210, 506.0, 1048.2, 1194.6, 1210.0, 0.0929845379996812, 0.0571164789080073, 0.04204281356821523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 85.0625, 82, 92, 84.5, 89.2, 92.0, 92.0, 0.07016497539840551, 0.05214408816229159, 0.035219528666777765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f6d30e6-8e9e-434d-89d5-898d004dd008", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 137.25, 81, 261, 85.5, 255.4, 261.0, 261.0, 0.07016497539840551, 0.07805339609444206, 0.036701284128682565], "isController": false}, {"data": ["login", 21, 0, 0.0, 2861.190476190477, 1362, 4646, 2918.0, 3804.4, 4562.999999999999, 4646.0, 0.09071940488070399, 36.299308595285616, 0.18702017939762314], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 317.55555555555554, 168, 980, 174.0, 980.0, 980.0, 980.0, 0.05698727284239853, 7.653682604634964, 0.1265456313714937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 97.05555555555554, 83, 254, 87.0, 113.60000000000022, 254.0, 254.0, 0.10345184316700576, 0.08375154100141384, 0.03677389737577158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 310.54999999999995, 168, 887, 188.0, 800.0000000000007, 884.3, 887.0, 0.09955598032773828, 12.04921946555861, 0.2213565000099556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 97.47058823529412, 84, 253, 87.0, 127.39999999999989, 253.0, 253.0, 0.10607299069677477, 0.08794528232574392, 0.037705633411744155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 652.1875, 169, 1096, 891.5, 1081.3, 1096.0, 1096.0, 0.0701382161221457, 47.24675737464985, 0.1476481368440433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05f302e1-7b7f-48c4-a409-b387ceed92e6", 3, 0, 0.0, 671.6666666666666, 234, 1393, 388.0, 1393.0, 1393.0, 1393.0, 0.018595656054745613, 0.021979435916269958, 0.011924948706982049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d1842a8-792b-48d7-9a99-a903502f0d13", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 114.25, 84, 266, 88.5, 259.7, 266.0, 266.0, 0.07295642221705448, 0.056640972326717096, 0.025933728209968584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a078738-4f07-4269-b14f-e33d3ff665dc", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d1efe81-08bb-43ea-8f8c-613cabadc060", 2, 0, 0.0, 195.5, 195, 196, 195.5, 196.0, 196.0, 196.0, 0.0117637371040032, 0.02326324964414695, 0.0073121276041973006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 614.8461538461539, 83, 1209, 804.0, 1187.0, 1209.0, 1209.0, 0.06560752568786966, 42.27163061196681, 0.09972225621757475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 300.31249999999994, 168, 586, 331.0, 523.0000000000001, 586.0, 586.0, 0.10589224140783735, 0.16411229210374792, 0.2381541327756342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d1efe81-08bb-43ea-8f8c-613cabadc060", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 95.99999999999999, 82, 251, 85.0, 125.39999999999989, 251.0, 251.0, 0.08005877255773651, 0.05949680265277098, 0.04018575106902008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 122.70588235294119, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.08006254297474734, 0.028496525521112964, 0.04526513947365942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 180.64705882352942, 81, 905, 85.0, 384.19999999999953, 905.0, 905.0, 0.08006292003598121, 4.258001619213688, 0.04666351026453731], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1126.7619047619046, 90, 2315, 995.0, 1970.6000000000001, 2282.8999999999996, 2315.0, 0.08905776880603218, 0.027830552751885056, 0.04018036053553405], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 165.41176470588235, 82, 649, 85.0, 329.7999999999997, 649.0, 649.0, 0.08006216591706503, 1.4050707755433631, 0.04674125644618174], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.58823529411765, 0.5087209302325582], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.823529411764707, 0.2180232558139535], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.2180232558139535], "isController": false}, {"data": ["401/Unauthorized", 21, 61.76470588235294, 1.5261627906976745], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1376, 34, "401/Unauthorized", 21, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
