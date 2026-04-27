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

    var data = {"OkPercent": 98.92058596761758, "KoPercent": 1.079414032382421};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7493324432576769, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9df9fed2-43b9-4400-9434-706dd0cd7b22"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cc907e3-d8a1-4502-ac3c-179d5788d0b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cc907e3-d8a1-4502-ac3c-179d5788d0b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42d01495-0725-4911-848a-f462e06636fc"], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3a8d7a3-6f2b-4e4b-b123-59f8dbad1eca"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df5cd084-0a10-4c18-86f4-70dc3cb6f7ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9bc77d5-3b21-46f7-80fa-773c55f15324"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87a45c86-af58-4780-93e8-ef109623a98f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f97195b5-9ba6-48bd-adb4-c7e065f8955c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9df9fed2-43b9-4400-9434-706dd0cd7b22"], "isController": false}, {"data": [0.9636363636363636, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9576271186440678, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f97195b5-9ba6-48bd-adb4-c7e065f8955c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0577a5ec-cb60-401c-bbe7-7c560fd84d6d"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f7f56f3-4611-413a-9235-b8b568977c82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bbd2e26-e0a2-43eb-b421-a2931fd70d23"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0577a5ec-cb60-401c-bbe7-7c560fd84d6d"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcfd94b5-adfd-4d8b-be5c-733dfaf2a1fd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fcfd94b5-adfd-4d8b-be5c-733dfaf2a1fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f7f5d177-452d-45b1-9175-222bb281c815"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/42d01495-0725-4911-848a-f462e06636fc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f7f56f3-4611-413a-9235-b8b568977c82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3a8d7a3-6f2b-4e4b-b123-59f8dbad1eca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df5cd084-0a10-4c18-86f4-70dc3cb6f7ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bbd2e26-e0a2-43eb-b421-a2931fd70d23"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c6fdd7e-6184-46ec-8f29-d0e6d4b94475"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c6fdd7e-6184-46ec-8f29-d0e6d4b94475"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 14, 1.079414032382421, 473.75867386275974, 135, 2561, 160.0, 1322.4, 1610.6999999999994, 2039.2399999999998, 5.114171815669002, 710.906124807282, 3.7518885185955546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9df9fed2-43b9-4400-9434-706dd0cd7b22", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2397.163636363636, 1683, 3137, 2416.0, 2870.0, 2939.5999999999995, 3137.0, 0.25062428230319156, 301.5855216559316, 1.2323176380825875], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 485.78571428571433, 284, 1355, 424.0, 972.0, 1355.0, 1355.0, 0.126000126000126, 10.948467003154503, 0.28107449982449983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 151.25, 145, 165, 151.0, 159.70000000000002, 164.75, 165.0, 0.11751088444567177, 0.0912315948577237, 0.04177144720529739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 513.4615384615385, 288, 858, 573.0, 752.8, 858.0, 858.0, 0.09083286752375629, 0.140773203867384, 0.20428524795626046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cc907e3-d8a1-4502-ac3c-179d5788d0b0", 1, 0, 0.0, 760.0, 760, 760, 760.0, 760.0, 760.0, 760.0, 1.3157894736842104, 0.2377158717105263, 0.9071751644736842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 200.7, 140, 430, 146.0, 428.1, 430.0, 430.0, 0.05318385125540481, 0.03952432695836237, 0.02669580033718562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cc907e3-d8a1-4502-ac3c-179d5788d0b0", 3, 0, 0.0, 345.3333333333333, 236, 561, 239.0, 561.0, 561.0, 561.0, 0.019958884697523105, 0.023590726021063275, 0.012799154574909022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 259.5, 138, 441, 147.5, 440.0, 441.0, 441.0, 0.05318639704709124, 0.022219863922603156, 0.02988618443446904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 314.3, 138, 1273, 147.0, 1188.6000000000004, 1273.0, 1273.0, 0.05318469982555419, 4.798470083938753, 0.030809730406756584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 271.7, 137, 1126, 144.5, 1057.5000000000002, 1126.0, 1126.0, 0.05318667992787886, 1.5767669113697167, 0.03086281759096252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42d01495-0725-4911-848a-f462e06636fc", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 0.19831400933040613, 0.7568091383095499], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1648.4181818181814, 1103, 2561, 1549.0, 2225.0, 2334.5999999999995, 2561.0, 0.24293071615975126, 290.62959290885243, 0.4796932696045088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3a8d7a3-6f2b-4e4b-b123-59f8dbad1eca", 3, 0, 0.0, 399.6666666666667, 224, 537, 438.0, 537.0, 537.0, 537.0, 0.019774830595617895, 0.027261200381654232, 0.012681125088986738], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 516.6363636363636, 448, 750, 491.0, 717.0000000000001, 750.0, 750.0, 0.08383060121783001, 0.015145176977830615, 0.056978611765243825], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 516.6363636363636, 448, 750, 491.0, 717.0000000000001, 750.0, 750.0, 0.08202589035375529, 0.014819130581488992, 0.055751972349818046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1125.4761904761904, 150, 2035, 1081.0, 1783.8000000000002, 2013.7999999999997, 2035.0, 0.08700263493694381, 0.027188323417794938, 0.03925314193444144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 204.25, 137, 575, 144.5, 536.0000000000001, 575.0, 575.0, 0.0538090049369762, 0.014503208361919368, 0.031686357399410794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 196.11764705882354, 140, 447, 145.0, 441.4, 447.0, 447.0, 0.10028078620136381, 0.044552596535003895, 0.05620056009768528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 168.91666666666669, 140, 427, 145.0, 344.2000000000003, 427.0, 427.0, 0.05380876365397378, 0.01450314332861012, 0.03163366769501193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 161.41176470588235, 139, 429, 145.0, 207.3999999999998, 429.0, 429.0, 0.10027723706718575, 0.07452243887512534, 0.05033447251223972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 273.0, 137, 1129, 145.0, 881.7999999999997, 1129.0, 1129.0, 0.10028196930191952, 3.4928173039487502, 0.058038881015443425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 400.0, 135, 1619, 147.0, 1574.2, 1619.0, 1619.0, 0.10028492717544553, 10.639915078576191, 0.05794265840594159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df5cd084-0a10-4c18-86f4-70dc3cb6f7ca", 3, 0, 0.0, 378.6666666666667, 247, 530, 359.0, 530.0, 530.0, 530.0, 0.04382441019647944, 0.02817487309181214, 0.02810354429917464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 203.20000000000002, 137, 444, 146.0, 442.3, 443.95, 444.0, 0.10990460280476547, 0.02962272497472194, 0.06461188563327032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 219.90000000000003, 138, 549, 144.0, 441.3, 543.6999999999999, 549.0, 0.10990701866221177, 0.029623376123799266, 0.06472063696612665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 167.75, 136, 428, 144.5, 344.6000000000003, 428.0, 428.0, 0.05373936408419167, 0.01437947828034035, 0.03064823107926556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 160.15, 139, 431, 145.0, 158.20000000000002, 417.3999999999998, 431.0, 0.10990520675917022, 0.0816775999450474, 0.05516726198653661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 146.08333333333331, 139, 159, 145.0, 156.9, 159.0, 159.0, 0.05380562717184172, 0.03998640847438628, 0.027007902701490862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 187.0, 137, 450, 144.0, 426.6, 448.84999999999997, 450.0, 0.10973936899862825, 0.029363854595336077, 0.06258573388203018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 198.91666666666669, 144, 436, 152.0, 435.1, 436.0, 436.0, 0.05708767239287736, 0.044934242137362454, 0.020292883545905624], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 618.8181818181818, 428, 1146, 530.0, 1110.0, 1146.0, 1146.0, 0.08508729182620534, 0.0153722158084453, 0.05791586172154797], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a9bc77d5-3b21-46f7-80fa-773c55f15324", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.6722861842105263, 1.2561677631578947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1317.0500000000002, 839, 1840, 1326.0, 1624.5, 1829.3999999999999, 1840.0, 0.09209799226376865, 0.04766790615214588, 0.04236147886351078], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 278.5454545454545, 224, 391, 262.0, 383.0, 391.0, 391.0, 0.08490864601585477, 0.2181362214494678, 0.05489211295165611], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 378.75, 288, 722, 298.0, 682.4000000000001, 722.0, 722.0, 0.05370256832533016, 0.08322849212138571, 0.12077833481761265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87a45c86-af58-4780-93e8-ef109623a98f", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f97195b5-9ba6-48bd-adb4-c7e065f8955c", 3, 0, 0.0, 364.0, 273, 428, 391.0, 428.0, 428.0, 428.0, 0.019515114456146284, 0.023066204619227593, 0.012514575351109433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 144.35714285714283, 138, 152, 144.0, 151.0, 152.0, 152.0, 0.12739549019964694, 0.09467575004094854, 0.06394656441661965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 186.64285714285714, 139, 450, 145.0, 437.5, 450.0, 450.0, 0.12704174228675136, 0.047622929900181486, 0.07169138498185118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 999.3333333333334, 843, 1181, 991.0, 1181.0, 1181.0, 1181.0, 0.0952305372589477, 28.00093990556305, 0.05431116578049361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1583.0, 1214, 1897, 1598.0, 1897.0, 1897.0, 1897.0, 0.09416195856873823, 84.72709583921846, 0.05360978695856874], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1353.9344262295083, 719, 2481, 1144.0, 2318.6, 2439.9, 2481.0, 0.2749258601573838, 76.521843859576, 1.0022707791556622], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 288.6666666666667, 137, 447, 279.5, 447.0, 447.0, 447.0, 0.09682572982393854, 0.17133615472751626, 0.05361346563493472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 194.25, 143, 433, 146.5, 432.4, 433.0, 433.0, 0.05611462347087651, 0.04170237154427443, 0.028166910609404808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 212.49999999999997, 137, 434, 145.0, 427.70000000000005, 434.0, 434.0, 0.05603941438811965, 0.014994921428071076, 0.031959978518224484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 193.16666666666666, 139, 442, 146.5, 437.20000000000005, 442.0, 442.0, 0.056113836269178076, 0.015124432431926902, 0.032988798275434765], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 258.20000000000005, 139, 715, 150.0, 587.1999999999999, 616.7999999999997, 715.0, 0.24499977727292976, 0.18207502978974563, 0.11843250952158225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 312.25, 143, 445, 412.0, 445.0, 445.0, 445.0, 0.05611436106785629, 0.015124573881570642, 0.03304390598038803], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 935.690909090909, 680, 1359, 877.0, 1194.3999999999999, 1293.1999999999998, 1359.0, 0.24503688918986347, 72.04898141228125, 0.12323632610623018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 145.33333333333334, 139, 158, 144.0, 158.0, 158.0, 158.0, 0.0968022974411926, 0.07193998862573005, 0.054356758817075926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9df9fed2-43b9-4400-9434-706dd0cd7b22", 3, 0, 0.0, 490.0, 248, 786, 436.0, 786.0, 786.0, 786.0, 0.02257455245949749, 0.031120842990225217, 0.014476519643623065], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 237.67272727272723, 137, 578, 149.0, 450.8, 522.3999999999997, 578.0, 0.24563989191844754, 0.4346674649963154, 0.11946158806190126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 944.7222222222222, 138, 1768, 1337.0, 1733.8, 1768.0, 1768.0, 0.0815490698875529, 40.77532247277167, 0.04404853189021683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 279.6428571428571, 138, 1216, 144.0, 830.5, 1216.0, 1216.0, 0.12616477119117567, 8.140382315867022, 0.07339663725825929], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1386.6363636363637, 951, 1911, 1322.0, 1786.3999999999999, 1874.9999999999998, 1911.0, 0.2437284244951498, 219.307264789607, 0.12234024432666699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 677.8888888888889, 137, 1333, 834.0, 1282.6000000000001, 1333.0, 1333.0, 0.08154759208082273, 13.33071300344312, 0.04412736997689485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 256.2857142857143, 137, 1178, 145.0, 796.5, 1178.0, 1178.0, 0.12620799076878694, 2.6822543395265397, 0.07354503033499207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 155.0, 144, 171, 153.0, 169.0, 171.0, 171.0, 0.09017382739342147, 0.06736618941012444, 0.03205397770625529], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 583.6363636363636, 416, 982, 488.0, 967.8000000000001, 982.0, 982.0, 0.0818653389597148, 0.014790124714401602, 0.05644231377495963], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 203.55367231638428, 138, 927, 152.0, 335.0000000000001, 430.1, 582.2399999999996, 0.7125718610605646, 1.4674503174869966, 0.3449082437921706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 180.89999999999998, 147, 448, 149.0, 419.80000000000007, 448.0, 448.0, 0.05436998776675275, 0.0421048831045263, 0.01932683158896289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 531.0, 291, 879, 566.0, 877.8, 879.0, 879.0, 0.056000709342318336, 0.08679016184205, 0.12594690782749915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f97195b5-9ba6-48bd-adb4-c7e065f8955c", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 168.35294117647058, 140, 430, 151.0, 220.3999999999998, 430.0, 430.0, 0.10521169211345534, 0.0853817540491029, 0.037399468680954825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0577a5ec-cb60-401c-bbe7-7c560fd84d6d", 3, 0, 0.0, 563.0, 236, 966, 487.0, 966.0, 966.0, 966.0, 0.027184501209710304, 0.027264143303098128, 0.017432769330445734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 690.1999999999999, 153, 1610, 558.0, 1461.9000000000003, 1603.1, 1610.0, 0.09056453402283132, 0.055629972558946195, 0.040948612551338776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 159.2777777777778, 138, 428, 144.0, 177.8000000000004, 428.0, 428.0, 0.08154980881100378, 0.060604887212083874, 0.04093418137583589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 280.3333333333335, 138, 573, 147.0, 464.1000000000002, 573.0, 573.0, 0.08154870043084897, 0.08986638471958573, 0.04270334508238684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f7f56f3-4611-413a-9235-b8b568977c82", 3, 0, 0.0, 590.3333333333334, 275, 939, 557.0, 939.0, 939.0, 939.0, 0.016993027194507855, 0.023426259820553633, 0.010897221215228018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bbd2e26-e0a2-43eb-b421-a2931fd70d23", 3, 0, 0.0, 331.3333333333333, 245, 462, 287.0, 462.0, 462.0, 462.0, 0.04287551807917679, 0.02717403440760326, 0.027495042518222094], "isController": false}, {"data": ["login", 20, 0, 0.0, 2855.8500000000004, 1493, 4129, 2808.0, 4016.6000000000004, 4124.55, 4129.0, 0.08904243762577245, 32.07839901418891, 0.17864139048670596], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 574.9000000000001, 284, 1703, 436.5, 1618.0000000000005, 1703.0, 1703.0, 0.05314315170775518, 6.431893854193792, 0.11816047637521192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 147.9285714285714, 138, 163, 148.0, 158.5, 163.0, 163.0, 0.1279859581120243, 0.1036136321043634, 0.04549500854763363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0577a5ec-cb60-401c-bbe7-7c560fd84d6d", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 427.95, 284, 857, 297.5, 690.0000000000002, 849.1499999999999, 857.0, 0.10965032511321396, 0.16993658784635796, 0.24660615110911305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcfd94b5-adfd-4d8b-be5c-733dfaf2a1fd", 1, 0, 0.0, 982.0, 982, 982, 982.0, 982.0, 982.0, 982.0, 1.0183299389002036, 0.1839756237270876, 0.7020907586558045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcfd94b5-adfd-4d8b-be5c-733dfaf2a1fd", 3, 0, 0.0, 586.3333333333333, 262, 1146, 351.0, 1146.0, 1146.0, 1146.0, 0.016901218014444906, 0.023299693454158263, 0.01083834618764859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7f5d177-452d-45b1-9175-222bb281c815", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.6261488970588235, 1.1699601715686274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42d01495-0725-4911-848a-f462e06636fc", 3, 0, 0.0, 703.6666666666666, 307, 1031, 773.0, 1031.0, 1031.0, 1031.0, 0.03977777483127594, 0.025573276462164708, 0.025508533990108596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f7f56f3-4611-413a-9235-b8b568977c82", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3a8d7a3-6f2b-4e4b-b123-59f8dbad1eca", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 151.83333333333334, 145, 171, 150.0, 166.50000000000003, 171.0, 171.0, 0.0573879858251675, 0.047580468716374225, 0.02039963558629001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1105.888888888889, 285, 1914, 1482.5, 1873.5, 1914.0, 1914.0, 0.08149516462023253, 54.22088358868485, 0.1717004786709044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df5cd084-0a10-4c18-86f4-70dc3cb6f7ca", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 181.66666666666666, 144, 430, 151.5, 425.5, 430.0, 430.0, 0.08060760219252679, 0.06258109740533085, 0.028653483591874754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bbd2e26-e0a2-43eb-b421-a2931fd70d23", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 580.8235294117649, 282, 1758, 303.0, 1722.8, 1758.0, 1758.0, 0.10019154265507588, 14.238646723515544, 0.22231725173125091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1728.5, 1353, 2039, 1742.0, 2039.0, 2039.0, 2039.0, 0.09392758183440567, 112.3700423848213, 0.21179568989808858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c6fdd7e-6184-46ec-8f29-d0e6d4b94475", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 166.23076923076923, 137, 427, 146.0, 316.19999999999993, 427.0, 427.0, 0.09093134683314098, 0.06757690912111355, 0.04564327370335396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 255.61538461538464, 136, 445, 151.0, 439.0, 445.0, 445.0, 0.09092117134444436, 0.024328516551150155, 0.051853480532378426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c6fdd7e-6184-46ec-8f29-d0e6d4b94475", 3, 0, 0.0, 334.3333333333333, 231, 510, 262.0, 510.0, 510.0, 510.0, 0.06814619630647616, 0.030834379188151646, 0.043700523022056646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 253.23076923076925, 137, 444, 150.0, 438.4, 444.0, 444.0, 0.09092053545201494, 0.024505925571050902, 0.05345133041221972], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1125.4761904761904, 150, 2035, 1081.0, 1783.8000000000002, 2013.7999999999997, 2035.0, 0.08780622420692165, 0.02743944506466301, 0.03961569881210722], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 276.6923076923077, 137, 446, 152.0, 445.2, 446.0, 446.0, 0.09092562284051646, 0.024507296781232955, 0.05354311579378069], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 50.0, 0.5397070161912105], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.5397070161912105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 14, "406/Not Acceptable", 7, "401/Unauthorized", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
