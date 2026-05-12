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

    var data = {"OkPercent": 99.08045977011494, "KoPercent": 0.9195402298850575};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7570677186061802, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1addf662-972f-49fd-b7a0-32146336f164"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d11175c-60a3-44d0-97e4-07bb0e662911"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37ed44fb-080b-42cb-b977-15e3590b2684"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9241eb7b-74df-4222-a888-eb108e780b12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb131a46-5ce9-47b3-a018-129c2de9eca9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3ab4195-a4b6-439c-9e2d-7902c34fc292"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/859b35c3-746e-41a5-a9f3-976b004dd3b3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22703f93-bec7-4059-b159-0b83ab182ca9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2c8bc42-d6bb-443f-9e13-f4d12beec45c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc66dd9c-fe3d-45df-a165-25c76c7b1ec7"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a6ed699-3804-41ee-a09d-aa4b05eeb126"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aac65c6f-de8a-4ae9-8c17-c234fbce3741"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1addf662-972f-49fd-b7a0-32146336f164"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=941902f5-5ddf-4415-a0e8-2a98d2eb281c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37ed44fb-080b-42cb-b977-15e3590b2684"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22703f93-bec7-4059-b159-0b83ab182ca9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2830188679245283, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b684f93e-6471-4ac5-a3a5-a99dc8098850"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=859b35c3-746e-41a5-a9f3-976b004dd3b3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb131a46-5ce9-47b3-a018-129c2de9eca9"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc66dd9c-fe3d-45df-a165-25c76c7b1ec7"], "isController": false}, {"data": [0.3125, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b2c8bc42-d6bb-443f-9e13-f4d12beec45c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=015d88b9-169d-4812-849f-b34a0e63e9aa"], "isController": false}, {"data": [0.8962264150943396, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.42452830188679247, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9475138121546961, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd667367-a4da-400b-88ad-20dbc61a4024"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a6ed699-3804-41ee-a09d-aa4b05eeb126"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/015d88b9-169d-4812-849f-b34a0e63e9aa"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/322911d8-93c8-44de-afb0-dc46eb1459c4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aac65c6f-de8a-4ae9-8c17-c234fbce3741"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d11175c-60a3-44d0-97e4-07bb0e662911"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3ab4195-a4b6-439c-9e2d-7902c34fc292"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/941902f5-5ddf-4415-a0e8-2a98d2eb281c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 12, 0.9195402298850575, 445.19693486590046, 125, 2819, 150.0, 1216.6000000000013, 1529.7, 1983.6200000000013, 5.142553149567513, 701.076791334995, 3.7500746569168326], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2208.0943396226417, 1599, 2981, 2146.0, 2672.0, 2825.0, 2981.0, 0.2375137242600103, 285.8094083653566, 1.1678531266105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1addf662-972f-49fd-b7a0-32146336f164", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d11175c-60a3-44d0-97e4-07bb0e662911", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37ed44fb-080b-42cb-b977-15e3590b2684", 3, 0, 0.0, 384.3333333333333, 255, 613, 285.0, 613.0, 613.0, 613.0, 0.04884641060292753, 0.031403535462494095, 0.03132403284107006], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 614.2, 434, 1688, 488.0, 1370.0000000000002, 1688.0, 1688.0, 0.08080329246482364, 0.014598251080070677, 0.05492098784718481], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 614.2, 434, 1688, 488.0, 1370.0000000000002, 1688.0, 1688.0, 0.07905929974542905, 0.01428317427041443, 0.053735617795721315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9241eb7b-74df-4222-a888-eb108e780b12", 2, 0, 0.0, 237.0, 220, 254, 237.0, 254.0, 254.0, 254.0, 0.036683785766691124, 0.032384904622157006, 0.022801982070799705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 149.0, 128, 399, 134.0, 145.0, 399.0, 399.0, 0.08265793102848218, 0.03518570028669251, 0.04641011711323702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 134.94736842105263, 128, 154, 135.0, 140.0, 154.0, 154.0, 0.0826550543565739, 0.06142626598178978, 0.041488962831327136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 257.2105263157894, 125, 1049, 134.0, 1047.0, 1049.0, 1049.0, 0.0826590098320717, 2.5783017380144435, 0.04792744088793178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 283.0526315789474, 126, 1654, 134.0, 1179.0, 1654.0, 1654.0, 0.08265936943952597, 7.849096824031253, 0.04784692735546574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb131a46-5ce9-47b3-a018-129c2de9eca9", 3, 0, 0.0, 432.3333333333333, 322, 573, 402.0, 573.0, 573.0, 573.0, 0.024076080414108584, 0.028457111973837323, 0.015439413546807912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3ab4195-a4b6-439c-9e2d-7902c34fc292", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/859b35c3-746e-41a5-a9f3-976b004dd3b3", 3, 0, 0.0, 412.3333333333333, 246, 544, 447.0, 544.0, 544.0, 544.0, 0.020389992591636024, 0.024100280957106254, 0.013075613738777008], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 278.2, 219, 544, 238.0, 410.80000000000007, 544.0, 544.0, 0.08107582210883618, 0.1801878476125873, 0.052414252183642145], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 189.07142857142856, 126, 396, 136.5, 389.5, 396.0, 396.0, 0.09098471456795258, 0.06761657010372257, 0.04567006180461682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 212.71428571428572, 127, 417, 135.0, 412.0, 417.0, 417.0, 0.09098944522435397, 0.043869911090313525, 0.05080074773826236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 998.0, 803, 1133, 1028.0, 1133.0, 1133.0, 1133.0, 0.10781671159029649, 31.701693059299192, 0.06148921832884097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22703f93-bec7-4059-b159-0b83ab182ca9", 3, 0, 0.0, 434.6666666666667, 230, 676, 398.0, 676.0, 676.0, 676.0, 0.019773005892355755, 0.02337102356612752, 0.012679954950501575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1266.75, 1003, 1446, 1309.0, 1446.0, 1446.0, 1446.0, 0.1073191672032625, 96.5659752964692, 0.06110065867138871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 265.5, 132, 398, 266.0, 398.0, 398.0, 398.0, 0.10959804915472504, 0.19393717291832205, 0.060685638545633885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2c8bc42-d6bb-443f-9e13-f4d12beec45c", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 146.8888888888889, 126, 397, 133.0, 163.90000000000038, 397.0, 397.0, 0.08458964622730178, 0.06286398513571939, 0.042460037266438586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 192.2777777777778, 125, 405, 135.0, 400.5, 405.0, 405.0, 0.08459481433788109, 0.029694468791563077, 0.04785077768482792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc66dd9c-fe3d-45df-a165-25c76c7b1ec7", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.6452287946428571, 2.462332589285714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 236.94444444444449, 128, 1188, 135.0, 480.6000000000011, 1188.0, 1188.0, 0.08448681301660166, 4.24491689343162, 0.049265639447831744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 198.11111111111114, 126, 1057, 133.0, 462.10000000000093, 1057.0, 1057.0, 0.08448720957521709, 1.4016204382773996, 0.049348377728232806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 199.5, 133, 395, 135.0, 395.0, 395.0, 395.0, 0.11039659978472664, 0.08204278558220407, 0.06199027819943146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 929.5, 127, 1714, 1253.0, 1709.5, 1714.0, 1714.0, 0.08243758787617873, 41.2195900476077, 0.04452846272218075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a6ed699-3804-41ee-a09d-aa4b05eeb126", 3, 0, 0.0, 293.6666666666667, 220, 432, 229.0, 432.0, 432.0, 432.0, 0.06091370558375634, 0.0275618654822335, 0.0390625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 315.0, 129, 1369, 136.5, 1252.0, 1369.0, 1369.0, 0.0909746635561996, 11.715183610426996, 0.0523662753673102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 552.3888888888888, 128, 1196, 770.5, 1066.4, 1196.0, 1196.0, 0.08254078890651798, 13.493072449031063, 0.044664812747049164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 339.1428571428571, 134, 1063, 137.0, 967.5, 1063.0, 1063.0, 0.09098589718593618, 3.8428594349125884, 0.05246159501527263], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 686.3846153846154, 225, 2819, 489.0, 2107.3999999999996, 2819.0, 2819.0, 0.07104252168163114, 0.012834830577247812, 0.04898048858128084], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 399.16666666666663, 262, 1323, 269.5, 849.6000000000007, 1323.0, 1323.0, 0.08443172756695905, 5.735233059418828, 0.18868878699751396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 677.6666666666666, 151, 1665, 544.0, 1604.4, 1660.8, 1665.0, 0.10062193941600943, 0.06180781239518548, 0.04549605268516833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 148.38888888888889, 129, 382, 134.0, 171.40000000000032, 382.0, 382.0, 0.08253813949862665, 0.0613393790609911, 0.04143027705302159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 316.27777777777777, 129, 533, 396.0, 428.60000000000014, 533.0, 533.0, 0.08243909811626661, 0.09084759987725735, 0.04316960584951201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aac65c6f-de8a-4ae9-8c17-c234fbce3741", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["login", 21, 0, 0.0, 2743.0952380952385, 1298, 5125, 2633.0, 4443.400000000001, 5067.9, 5125.0, 0.09814735189097232, 22.501859614818382, 0.17908331687807294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 176.21428571428572, 127, 428, 137.5, 405.5, 428.0, 428.0, 0.08585901948999741, 0.0695089132394608, 0.030520198334335023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1094.7777777777776, 267, 1853, 1388.0, 1846.7, 1853.0, 1853.0, 0.0823851413820565, 54.81300861382423, 0.17357555232371868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1addf662-972f-49fd-b7a0-32146336f164", 3, 0, 0.0, 351.3333333333333, 219, 509, 326.0, 509.0, 509.0, 509.0, 0.02858694719990852, 0.028670698021783254, 0.018332124343691338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 449.5263157894737, 263, 1790, 275.0, 1313.0, 1790.0, 1790.0, 0.08260761816150224, 10.517436695119194, 0.18356163425042282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1467.0, 1137, 1584, 1573.5, 1584.0, 1584.0, 1584.0, 0.10693471635566487, 127.93109728385821, 0.24112525396995135], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1187.2727272727273, 172, 2262, 1153.5, 1948.2, 2216.9999999999995, 2262.0, 0.08851302147245435, 0.02799035710980845, 0.03993458585964249], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=941902f5-5ddf-4415-a0e8-2a98d2eb281c", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 140.33333333333331, 128, 164, 138.0, 158.3, 164.0, 164.0, 0.06402082810941159, 0.04970367026072482, 0.022757403742017405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 590.5714285714286, 268, 1519, 407.5, 1507.5, 1519.0, 1519.0, 0.09089492546616111, 15.65530676225783, 0.2011024864631486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37ed44fb-080b-42cb-b977-15e3590b2684", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.17371544471153846, 0.6629356971153846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 465.52941176470586, 269, 809, 529.0, 797.8, 809.0, 809.0, 0.12264361928534842, 0.1900736560603984, 0.2758283742325756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22703f93-bec7-4059-b159-0b83ab182ca9", 1, 0, 0.0, 2819.0, 2819, 2819, 2819.0, 2819.0, 2819.0, 2819.0, 0.35473572188719404, 0.06408799663001065, 0.24457365200425682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 194.64285714285717, 127, 434, 134.0, 427.5, 434.0, 434.0, 0.08004207926452764, 0.05948439679717338, 0.040177371818327354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 206.49999999999997, 128, 403, 134.5, 399.5, 403.0, 403.0, 0.08005352149722958, 0.030008902380448642, 0.04517529219535346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 261.5, 128, 1399, 134.0, 899.0, 1399.0, 1399.0, 0.08005214825657858, 5.1651113528956, 0.04657051593609551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 237.0, 128, 761, 134.0, 595.0, 761.0, 761.0, 0.08017409231474058, 1.7039119767208797, 0.046719752176153935], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1511.7735849056603, 1054, 2378, 1399.0, 2112.6, 2258.7999999999997, 2378.0, 0.23253569203499444, 278.19353016053736, 0.45916715751441284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b684f93e-6471-4ac5-a3a5-a99dc8098850", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1187.2727272727273, 172, 2262, 1153.5, 1948.2, 2216.9999999999995, 2262.0, 0.08713285383859827, 0.0275539085025823, 0.03931189304046133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 186.2, 133, 396, 134.0, 396.0, 396.0, 396.0, 0.029655814615571673, 0.007993168783103303, 0.017463336145693086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 183.0, 133, 378, 134.0, 378.0, 378.0, 378.0, 0.029658981036047527, 0.007994022232372184, 0.01743623689814513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=859b35c3-746e-41a5-a9f3-976b004dd3b3", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 300.6666666666667, 127, 1382, 134.0, 1086.500000000001, 1382.0, 1382.0, 0.06530043642458343, 4.912587755964107, 0.03792186802781799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 230.49999999999997, 127, 1053, 133.0, 855.9000000000008, 1053.0, 1053.0, 0.06530008108093402, 1.6161663784847116, 0.037985431279827175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 137.41666666666666, 134, 141, 136.5, 141.0, 141.0, 141.0, 0.065299370405237, 0.048528145389048205, 0.032777223035441234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 133.8, 132, 136, 133.0, 136.0, 136.0, 136.0, 0.029702323315729758, 0.007947691980966752, 0.01693960626600213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 156.58333333333334, 132, 398, 134.0, 320.90000000000026, 398.0, 398.0, 0.06530043642458343, 0.02564615121948565, 0.03678463712003309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 136.4, 134, 142, 135.0, 142.0, 142.0, 142.0, 0.029701793988356897, 0.02207330588392539, 0.014908908310561958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 136.8, 134, 144, 135.0, 144.0, 144.0, 144.0, 0.03058683909487426, 0.024075187803192042, 0.010872665459506084], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 607.1538461538463, 432, 979, 573.0, 940.1999999999999, 979.0, 979.0, 0.07083040476852079, 0.012796508674000338, 0.048211711058260734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb131a46-5ce9-47b3-a018-129c2de9eca9", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1407.7619047619046, 913, 2779, 1298.0, 2097.8, 2716.2999999999993, 2779.0, 0.09904071988454682, 0.05126131009649396, 0.04555486236877105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 324.4, 268, 531, 274.0, 531.0, 531.0, 531.0, 0.02963191238436146, 0.045923676712872695, 0.06664286545037544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc66dd9c-fe3d-45df-a165-25c76c7b1ec7", 3, 0, 0.0, 333.3333333333333, 230, 450, 320.0, 450.0, 450.0, 450.0, 0.0732314602353171, 0.03313532868720402, 0.046961580945174046], "isController": false}, {"data": ["addBook", 64, 7, 10.9375, 1299.6249999999998, 677, 2914, 1052.0, 2327.0, 2482.0, 2914.0, 0.3058220880003058, 98.36392555949912, 1.1116149452028938], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b2c8bc42-d6bb-443f-9e13-f4d12beec45c", 3, 0, 0.0, 567.6666666666666, 317, 882, 504.0, 882.0, 882.0, 882.0, 0.04832785617630002, 0.030629666658612022, 0.030991496310973646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=015d88b9-169d-4812-849f-b34a0e63e9aa", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 238.86792452830187, 129, 584, 136.0, 537.0, 540.9, 584.0, 0.2340172819555014, 0.17391323395325836, 0.1131235884452863], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 843.1509433962265, 633, 1226, 792.0, 1059.2, 1084.3, 1226.0, 0.23358719413299486, 68.68239089990568, 0.11747793454930894], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 214.6037735849057, 127, 545, 135.0, 404.2, 457.0999999999997, 545.0, 0.23448941036974114, 0.41493633944333097, 0.11403879527747177], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1271.339622641509, 917, 1845, 1262.0, 1580.8, 1673.0999999999997, 1845.0, 0.23313509518949926, 209.77536845929592, 0.1170228895775416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 155.1764705882353, 133, 400, 141.0, 197.59999999999982, 400.0, 400.0, 0.11450124604297165, 0.08554048166296221, 0.04070161480433758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 7, 3.867403314917127, 201.79005524861884, 129, 785, 140.0, 376.6, 418.8, 675.940000000001, 0.7419401119058843, 1.5166491386731158, 0.36154288828882375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 136.4285714285714, 129, 151, 135.0, 147.5, 151.0, 151.0, 0.08025452148241566, 0.06215023001519104, 0.028527974433202444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd667367-a4da-400b-88ad-20dbc61a4024", 2, 0, 0.0, 278.0, 272, 284, 278.0, 284.0, 284.0, 284.0, 0.01694369609786679, 0.033490274318439824, 0.010531897037394737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a6ed699-3804-41ee-a09d-aa4b05eeb126", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 152.89473684210526, 129, 399, 138.0, 150.0, 399.0, 399.0, 0.08484377581595152, 0.06885271260064035, 0.03015931093457652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/015d88b9-169d-4812-849f-b34a0e63e9aa", 3, 0, 0.0, 483.33333333333337, 233, 979, 238.0, 979.0, 979.0, 979.0, 0.061720775212936674, 0.03968051140805662, 0.039580054417150144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 515.7142857142857, 262, 1529, 278.0, 1190.0, 1529.0, 1529.0, 0.07985944737262418, 6.939187699292104, 0.17814628396878637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/322911d8-93c8-44de-afb0-dc46eb1459c4", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aac65c6f-de8a-4ae9-8c17-c234fbce3741", 3, 0, 0.0, 1007.6666666666666, 224, 2302, 497.0, 2302.0, 2302.0, 2302.0, 0.04566835639585331, 0.03780424163888508, 0.029286022818955412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 462.83333333333337, 268, 1524, 277.5, 1228.2000000000012, 1524.0, 1524.0, 0.06525179034599762, 6.598019106879714, 0.14536153230235505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 152.44444444444446, 130, 406, 136.0, 181.90000000000035, 406.0, 406.0, 0.08229436695058223, 0.0682303882236761, 0.02925307575196478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d11175c-60a3-44d0-97e4-07bb0e662911", 3, 0, 0.0, 483.0, 302, 701, 446.0, 701.0, 701.0, 701.0, 0.02050791263629217, 0.028271813155825956, 0.013151233038247258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3ab4195-a4b6-439c-9e2d-7902c34fc292", 3, 0, 0.0, 595.0, 233, 1108, 444.0, 1108.0, 1108.0, 1108.0, 0.021781114321808702, 0.02574453974690345, 0.013967706775378627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 139.72222222222223, 134, 154, 138.0, 147.70000000000002, 154.0, 154.0, 0.08181632235631008, 0.06351950807936184, 0.0290831458375946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/941902f5-5ddf-4415-a0e8-2a98d2eb281c", 3, 0, 0.0, 385.33333333333337, 230, 690, 236.0, 690.0, 690.0, 690.0, 0.02771593019281049, 0.022834967225912547, 0.017773562005155164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 165.76470588235293, 133, 398, 134.0, 391.6, 398.0, 398.0, 0.12276850193540932, 0.0912371386453579, 0.061624033198047254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 240.7058823529412, 127, 401, 134.0, 400.2, 401.0, 401.0, 0.12300211997771493, 0.032912676634662, 0.07014964654979053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 228.94117647058826, 132, 419, 138.0, 403.8, 419.0, 419.0, 0.12299589049024715, 0.033151236108699425, 0.07230813093274295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 230.35294117647058, 126, 542, 134.0, 426.7999999999999, 542.0, 542.0, 0.12300123001230011, 0.033152675276752766, 0.07243138837638376], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.3831417624521073], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5363984674329502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
