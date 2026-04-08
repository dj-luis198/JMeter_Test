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

    var data = {"OkPercent": 99.38223938223938, "KoPercent": 0.6177606177606177};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7541694462975317, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fa1aa62-093c-48d1-a9b4-b30a2b58ecb0"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44b5febf-9fa0-4352-a41b-bdb581c9e509"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc61c85e-7c97-4ed0-9dd0-78ee9df93202"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adc35d88-b5ee-4114-88b3-91eabed6f4d6"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92d746fd-f4de-4cff-8ed7-6b6dd280cca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4119a049-3e1e-4892-acbd-7e81d80c478c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6197c84-b2b0-4620-a5af-ad3baa5d9267"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=505e6ba4-9892-4f76-985f-7fda6c3772a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f2b4b7a-3306-49e1-aa4a-120b32bd30e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9ccb324-b47b-4a2e-a240-bd46fb9f0fb9"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc5132ac-a141-48bc-8da6-d27c33fdbfc4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b60a067-044f-4cf1-872c-56fbb079b191"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b75f15b2-eba5-4abd-b72b-2057404333f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6fa1aa62-093c-48d1-a9b4-b30a2b58ecb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc61c85e-7c97-4ed0-9dd0-78ee9df93202"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/adc35d88-b5ee-4114-88b3-91eabed6f4d6"], "isController": false}, {"data": [0.31451612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9441340782122905, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25debe64-0b04-4623-99c9-dada46ed2b29"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/0a598f19-65aa-4914-9c91-b5bd66498a6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61cbfc5a-ea3e-4200-bdb7-510578800ebe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/505e6ba4-9892-4f76-985f-7fda6c3772a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4119a049-3e1e-4892-acbd-7e81d80c478c"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9ccb324-b47b-4a2e-a240-bd46fb9f0fb9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6197c84-b2b0-4620-a5af-ad3baa5d9267"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/92d746fd-f4de-4cff-8ed7-6b6dd280cca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f076f07-65dc-419a-b96d-bd6feb4414ee"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dc5132ac-a141-48bc-8da6-d27c33fdbfc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b60a067-044f-4cf1-872c-56fbb079b191"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b75f15b2-eba5-4abd-b72b-2057404333f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 8, 0.6177606177606177, 469.4316602316602, 131, 3834, 155.0, 1269.8000000000002, 1535.0000000000002, 2254.04, 5.243339541663293, 729.9994796516925, 3.8283361443740387], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fa1aa62-093c-48d1-a9b4-b30a2b58ecb0", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2305.636363636363, 1713, 3102, 2264.0, 2965.2, 3008.2, 3102.0, 0.2366436190123786, 284.76227955167866, 1.163574825905592], "isController": true}, {"data": ["deleteBook", 11, 0, 0.0, 807.0, 444, 3078, 536.0, 2640.2000000000016, 3078.0, 3078.0, 0.06298887959961977, 0.011379826880790683, 0.04281275410286657], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 807.0, 444, 3078, 536.0, 2640.2000000000016, 3078.0, 3078.0, 0.06310632267983868, 0.011401044624775543, 0.042892578696452854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 220.1764705882353, 139, 423, 144.0, 418.2, 423.0, 423.0, 0.08026477934267867, 0.02147709916005269, 0.04577600696887143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 157.47058823529414, 138, 400, 142.0, 199.19999999999982, 400.0, 400.0, 0.08026440037771483, 0.05964961785882908, 0.04028896659584513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 245.47058823529412, 134, 543, 142.0, 453.3999999999999, 543.0, 543.0, 0.08016069862406518, 0.021605813301017567, 0.04720400514678838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 205.8235294117647, 133, 432, 141.0, 432.0, 432.0, 432.0, 0.08026667422117718, 0.021634377036176662, 0.04718802527455924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44b5febf-9fa0-4352-a41b-bdb581c9e509", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 333.3076923076924, 217, 609, 260.0, 568.1999999999999, 609.0, 609.0, 0.06680129697287354, 0.1575189837724234, 0.04318599472269754], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 142.27777777777777, 134, 153, 142.0, 149.4, 153.0, 153.0, 0.10117588866155541, 0.07519028444476922, 0.05078555348831981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 217.2777777777778, 132, 432, 141.5, 424.8, 432.0, 432.0, 0.10118157595925754, 0.03551675327996942, 0.057233024682683334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1105.0, 1047, 1146, 1122.0, 1146.0, 1146.0, 1146.0, 0.04971991116709205, 14.619304739550532, 0.028355886837482185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1285.6666666666667, 1227, 1349, 1281.0, 1349.0, 1349.0, 1349.0, 0.04963353903677845, 44.660345671748594, 0.028258157478947107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc61c85e-7c97-4ed0-9dd0-78ee9df93202", 1, 0, 0.0, 1151.0, 1151, 1151, 1151.0, 1151.0, 1151.0, 1151.0, 0.8688097306689835, 0.15696269548218938, 0.599003583840139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 229.33333333333334, 137, 402, 149.0, 402.0, 402.0, 402.0, 0.05054504405843007, 0.08944103499401883, 0.02798734373157212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 141.92857142857144, 134, 147, 141.5, 147.0, 147.0, 147.0, 0.07361872860455701, 0.05471079342584753, 0.036953150881584275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 240.64285714285714, 134, 421, 145.0, 420.0, 421.0, 421.0, 0.07361834148393542, 0.035494557501183154, 0.0411022046064048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 380.85714285714283, 134, 1534, 148.0, 1397.5, 1534.0, 1534.0, 0.07361756725490609, 9.480038547341355, 0.04237529052647077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 272.85714285714283, 131, 1067, 141.5, 1065.0, 1067.0, 1067.0, 0.07361872860455701, 3.109343695607591, 0.042447852305054976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 143.33333333333334, 138, 149, 143.0, 149.0, 149.0, 149.0, 0.050539934971950334, 0.037559463392240436, 0.02837935801647602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 847.9999999999999, 134, 1677, 831.5, 1657.9, 1676.5, 1677.0, 0.10560052377859795, 47.52399978153892, 0.05754403541841568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 264.77777777777777, 132, 1258, 142.0, 506.5000000000012, 1258.0, 1258.0, 0.10118214472419433, 5.083749523952062, 0.05900095982506732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 672.1, 133, 1219, 616.0, 1159.8, 1216.1499999999999, 1219.0, 0.10544518959045089, 15.516403811579991, 0.0575623642393184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 226.00000000000003, 135, 1118, 142.0, 492.500000000001, 1118.0, 1118.0, 0.1011753199669494, 1.678471771383123, 0.059095784221146766], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 585.2727272727273, 245, 1151, 467.0, 1103.6000000000001, 1151.0, 1151.0, 0.06325219801388098, 0.01142739905524217, 0.04360942558378903], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 525.6428571428571, 282, 1676, 293.0, 1539.5, 1676.0, 1676.0, 0.07356263858675662, 12.670076656210263, 0.1627552853442206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adc35d88-b5ee-4114-88b3-91eabed6f4d6", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 512.95, 195, 933, 550.0, 767.1000000000001, 924.9999999999999, 933.0, 0.09458053532582995, 0.05809683273432328, 0.04276444126548756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 156.7, 134, 403, 143.5, 152.4, 390.49999999999983, 403.0, 0.10559996620801082, 0.07847809988700803, 0.053006233038005425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 251.35, 133, 432, 144.5, 425.0, 431.65, 432.0, 0.10545241723303403, 0.10740905388091258, 0.05571265402643692], "isController": false}, {"data": ["login", 20, 0, 0.0, 2812.1499999999996, 1707, 6198, 2491.5, 4885.8, 6132.9, 6198.0, 0.09573133956863458, 17.313531617369016, 0.16824969904460121], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92d746fd-f4de-4cff-8ed7-6b6dd280cca2", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4119a049-3e1e-4892-acbd-7e81d80c478c", 3, 0, 0.0, 322.3333333333333, 217, 424, 326.0, 424.0, 424.0, 424.0, 0.0390182995825042, 0.032527950921482175, 0.025021500708832443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 167.66666666666666, 141, 486, 147.0, 213.30000000000044, 486.0, 486.0, 0.10024839324103055, 0.08115812304376399, 0.03563517103489758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6197c84-b2b0-4620-a5af-ad3baa5d9267", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 0.19766308807439825, 0.7543250820568927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1022.3999999999999, 286, 1822, 1105.0, 1800.1000000000001, 1821.35, 1822.0, 0.10536575086268209, 63.10868271409004, 0.22349063561889207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=505e6ba4-9892-4f76-985f-7fda6c3772a3", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f2b4b7a-3306-49e1-aa4a-120b32bd30e2", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9ccb324-b47b-4a2e-a240-bd46fb9f0fb9", 3, 0, 0.0, 318.0, 233, 426, 295.0, 426.0, 426.0, 426.0, 0.018867568536442707, 0.02601046639057125, 0.012099319666924525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 473.88235294117646, 280, 818, 562.0, 713.1999999999999, 818.0, 818.0, 0.08010479592125228, 0.12414678820998765, 0.18015756348305076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1430.0, 1366, 1493, 1431.0, 1493.0, 1493.0, 1493.0, 0.04951557264759767, 59.23783928483007, 0.11165181371416309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc5132ac-a141-48bc-8da6-d27c33fdbfc4", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b60a067-044f-4cf1-872c-56fbb079b191", 3, 0, 0.0, 549.0, 249, 942, 456.0, 942.0, 942.0, 942.0, 0.06732042277225501, 0.030460738168435697, 0.04317097423871822], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1261.9999999999998, 429, 2918, 1189.0, 2171.8, 2849.999999999999, 2918.0, 0.08467024969659828, 0.027026441309405253, 0.038200835312332426], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 471.83333333333337, 278, 1402, 427.0, 656.8000000000012, 1402.0, 1402.0, 0.10109349463362031, 6.867024627147535, 0.22592465445681903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 170.16666666666669, 139, 435, 148.0, 350.7000000000003, 435.0, 435.0, 0.07197092374680629, 0.05587586365108496, 0.025583414300622546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 656.2352941176471, 285, 2102, 560.0, 1653.9999999999995, 2102.0, 2102.0, 0.09435061799654787, 20.039739561075375, 0.2079366647195289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b75f15b2-eba5-4abd-b72b-2057404333f7", 3, 0, 0.0, 656.6666666666667, 257, 1453, 260.0, 1453.0, 1453.0, 1453.0, 0.02987839493262422, 0.02490838848387065, 0.01916029883374665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 142.125, 135, 148, 142.5, 148.0, 148.0, 148.0, 0.04405189313010727, 0.03273778385938635, 0.022111985418823372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 175.75, 135, 421, 141.5, 421.0, 421.0, 421.0, 0.04405237827777227, 0.011787452781357033, 0.025123621986542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 175.125, 136, 420, 142.0, 420.0, 420.0, 420.0, 0.04405359119368712, 0.011873819501423482, 0.025898693260351217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 142.5, 139, 145, 143.0, 145.0, 145.0, 145.0, 0.04405189313010727, 0.011873361820224223, 0.025940714411576835], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1553.1636363636362, 1078, 2519, 1409.0, 2304.2, 2420.4, 2519.0, 0.24615990547459632, 294.4928259772548, 0.4860696570992517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1261.9999999999998, 429, 2918, 1189.0, 2171.8, 2849.999999999999, 2918.0, 0.08830244850075057, 0.028185826195552082, 0.03983958125717458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 202.72727272727272, 132, 563, 140.0, 536.4000000000001, 563.0, 563.0, 0.05097335946876492, 0.013738913294315543, 0.03001653882779809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fa1aa62-093c-48d1-a9b4-b30a2b58ecb0", 3, 0, 0.0, 529.6666666666666, 237, 949, 403.0, 949.0, 949.0, 949.0, 0.08764754002570994, 0.04119890878812668, 0.056206267529508004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 192.9090909090909, 134, 438, 141.0, 435.8, 438.0, 438.0, 0.05097146987817819, 0.013738403990602716, 0.02996564928385085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc61c85e-7c97-4ed0-9dd0-78ee9df93202", 3, 0, 0.0, 490.6666666666667, 229, 736, 507.0, 736.0, 736.0, 736.0, 0.02262494626575262, 0.02674192053741789, 0.01450883598422287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 274.25, 134, 1457, 142.5, 1146.2000000000012, 1457.0, 1457.0, 0.06773882168319682, 5.096028820398981, 0.039337909467064815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 248.41666666666669, 137, 1143, 141.0, 929.4000000000008, 1143.0, 1143.0, 0.06773996883961433, 1.6765532033949015, 0.03940472796757514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 267.54545454545456, 135, 431, 143.0, 430.0, 431.0, 431.0, 0.05090612909794339, 0.013621366575035635, 0.02903240175117084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 144.5, 140, 153, 143.0, 152.4, 153.0, 153.0, 0.06773805693383686, 0.050340489576806494, 0.03400132935936733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 189.1818181818182, 134, 422, 141.0, 418.0, 422.0, 422.0, 0.05097146987817819, 0.037880164626263285, 0.02558528859119491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 164.16666666666666, 135, 421, 140.5, 338.8000000000003, 421.0, 421.0, 0.06773843930635838, 0.026603654629922327, 0.038157997792855856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 183.45454545454547, 141, 423, 149.0, 389.20000000000016, 423.0, 423.0, 0.05145091582630171, 0.04049749819921795, 0.018289192735130685], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 762.6363636363636, 424, 1453, 736.0, 1362.4000000000003, 1453.0, 1453.0, 0.06412162122775417, 0.011584472585092306, 0.04364528319896939], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1704.3999999999996, 893, 3834, 1279.5, 3645.200000000002, 3829.5, 3834.0, 0.09400925991210134, 0.04865713647794308, 0.0432405873228513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 498.3636363636363, 273, 967, 551.0, 943.4000000000001, 967.0, 967.0, 0.050871992193461564, 0.07884165196389013, 0.11441230275541207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adc35d88-b5ee-4114-88b3-91eabed6f4d6", 3, 0, 0.0, 493.0, 234, 1000, 245.0, 1000.0, 1000.0, 1000.0, 0.024066423328386346, 0.028445697625446232, 0.01543322068910192], "isController": false}, {"data": ["addBook", 62, 5, 8.064516129032258, 1430.1451612903224, 715, 5073, 1144.0, 2360.8, 2461.8999999999996, 5073.0, 0.2950568460326752, 97.89317198453094, 1.0724671288232468], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 235.65454545454543, 133, 583, 145.0, 566.6, 581.2, 583.0, 0.24764288994749972, 0.1840392961426243, 0.11971018605860582], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 898.5636363636363, 665, 1294, 839.0, 1175.8, 1275.8, 1294.0, 0.24709328445378906, 72.65362989862436, 0.12427054833369275], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 198.59999999999997, 134, 440, 145.0, 421.4, 427.79999999999995, 440.0, 0.24784040880148886, 0.43856134838700955, 0.12053176131166157], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1315.7818181818184, 936, 1953, 1260.0, 1805.0, 1857.5999999999995, 1953.0, 0.246841550164935, 222.10846073957094, 0.12390288748513341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 161.94117647058823, 142, 417, 146.0, 204.99999999999983, 417.0, 417.0, 0.08952315753442693, 0.06688009327523105, 0.031822684904815816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, 2.793296089385475, 236.45251396648044, 133, 2684, 148.0, 421.0, 499.0, 1831.999999999988, 0.7432042483049546, 1.5337588982100818, 0.36043962581326894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 146.625, 143, 152, 146.0, 152.0, 152.0, 152.0, 0.04491681966458365, 0.03478421679103011, 0.01596652574014497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25debe64-0b04-4623-99c9-dada46ed2b29", 2, 0, 0.0, 342.0, 235, 449, 342.0, 449.0, 449.0, 449.0, 0.011292353382906765, 0.022331069922252148, 0.007019123953339996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a598f19-65aa-4914-9c91-b5bd66498a6e", 2, 0, 0.0, 460.0, 307, 613, 460.0, 613.0, 613.0, 613.0, 0.027489141788993348, 0.03179774262603771, 0.017086756590521744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61cbfc5a-ea3e-4200-bdb7-510578800ebe", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 146.52941176470586, 141, 158, 145.0, 154.8, 158.0, 158.0, 0.08113783886979764, 0.06584525791093929, 0.028841966160748377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/505e6ba4-9892-4f76-985f-7fda6c3772a3", 3, 0, 0.0, 650.0, 377, 964, 609.0, 964.0, 964.0, 964.0, 0.023160478958704867, 0.023228331924404197, 0.014852260269742377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4119a049-3e1e-4892-acbd-7e81d80c478c", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 321.75, 278, 563, 290.0, 563.0, 563.0, 563.0, 0.04401699055835553, 0.06821773829698263, 0.0989952434139578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9ccb324-b47b-4a2e-a240-bd46fb9f0fb9", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 445.08333333333337, 284, 1599, 291.5, 1291.5000000000011, 1599.0, 1599.0, 0.06768227683179262, 6.843780888851601, 0.1507759314773349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6197c84-b2b0-4620-a5af-ad3baa5d9267", 3, 0, 0.0, 440.3333333333333, 249, 601, 471.0, 601.0, 601.0, 601.0, 0.056273564555157474, 0.03683793565117893, 0.03608688872840502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92d746fd-f4de-4cff-8ed7-6b6dd280cca2", 3, 0, 0.0, 797.6666666666666, 497, 963, 933.0, 963.0, 963.0, 963.0, 0.025324576657493544, 0.029932792266718442, 0.016240044275801523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 169.35714285714286, 143, 433, 149.5, 294.5, 433.0, 433.0, 0.07093600052695315, 0.05881314887439768, 0.025215531437315378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 147.75, 135, 180, 146.5, 157.70000000000002, 178.89999999999998, 180.0, 0.10201427179662435, 0.07920053327960583, 0.036262885677706316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f076f07-65dc-419a-b96d-bd6feb4414ee", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.6680668148535566, 1.2482838650627615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc5132ac-a141-48bc-8da6-d27c33fdbfc4", 3, 0, 0.0, 556.6666666666666, 223, 900, 547.0, 900.0, 900.0, 900.0, 0.024324390065919094, 0.024395652927440344, 0.015598648577428587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b60a067-044f-4cf1-872c-56fbb079b191", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b75f15b2-eba5-4abd-b72b-2057404333f7", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 160.29411764705887, 141, 433, 143.0, 202.5999999999998, 433.0, 433.0, 0.09457685203729665, 0.07028611757849879, 0.04747314643278368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 224.41176470588238, 140, 430, 143.0, 428.4, 430.0, 430.0, 0.09457737820380868, 0.05037462377675288, 0.052536951242579844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 477.05882352941177, 140, 1668, 409.0, 1452.7999999999997, 1668.0, 1668.0, 0.09442555933257793, 15.014656573893555, 0.05407989582639028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 360.8823529411765, 134, 1141, 145.0, 1082.6, 1141.0, 1141.0, 0.0945784305543965, 4.928498967286989, 0.05425981077359593], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 37.5, 0.23166023166023167], "isController": false}, {"data": ["401/Unauthorized", 5, 62.5, 0.3861003861003861], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 8, "401/Unauthorized", 5, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
