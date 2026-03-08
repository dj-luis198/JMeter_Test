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

    var data = {"OkPercent": 99.11242603550296, "KoPercent": 0.8875739644970414};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8461783439490446, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48333333333333334, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc879414-dba4-444c-bec0-1604ea74106d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac6e420b-823f-44b2-91a1-833bf31f1548"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cefc4836-af74-4881-8f06-223c313bb42d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7bf5162-83ac-4ed0-8908-814bb3b40759"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/783ebfb5-eec3-4fb3-b3d7-05cb9dcc8e25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ccf3c2d-025f-4523-ad16-2cd95d580730"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bbca490-935b-42b3-9868-378ee3c82a6c"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f69831e2-b006-4018-aa2b-f059d00ad26e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d321087-358d-4eca-9c2b-c69b5830d648"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f1744dd-f620-4c99-a8c8-1f1b91948ae1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57128305-0036-47f2-a089-e9f29472d630"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ca4e6da-984c-452d-ad32-5303c07c79cf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7bf5162-83ac-4ed0-8908-814bb3b40759"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf4ecd01-3be8-4af6-af25-97ee04de8e3d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40d85ad6-0290-4af8-86c8-96a15411f359"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a190b388-9805-4e36-b5c7-c51526a8a922"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=151acafb-33a7-4321-a705-6956f63f54fb"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6aec7595-b66b-45a1-96fa-d25cc4b52100"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99b186d5-e561-4b05-aab6-ac7809d16aa8"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/151acafb-33a7-4321-a705-6956f63f54fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cefc4836-af74-4881-8f06-223c313bb42d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ccf3c2d-025f-4523-ad16-2cd95d580730"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf4ecd01-3be8-4af6-af25-97ee04de8e3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d321087-358d-4eca-9c2b-c69b5830d648"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40d85ad6-0290-4af8-86c8-96a15411f359"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57128305-0036-47f2-a089-e9f29472d630"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a190b388-9805-4e36-b5c7-c51526a8a922"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f1744dd-f620-4c99-a8c8-1f1b91948ae1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f69831e2-b006-4018-aa2b-f059d00ad26e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99b186d5-e561-4b05-aab6-ac7809d16aa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6aec7595-b66b-45a1-96fa-d25cc4b52100"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 12, 0.8875739644970414, 260.5857988165688, 77, 1736, 93.0, 647.0, 814.6999999999998, 1238.8200000000002, 5.292165090499155, 743.3359830957502, 3.8665639605318782], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1171.0666666666668, 944, 1584, 1144.5, 1415.2, 1480.6499999999999, 1584.0, 0.26464594782946216, 318.4573939321095, 1.3012620579309981], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bc879414-dba4-444c-bec0-1604ea74106d", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac6e420b-823f-44b2-91a1-833bf31f1548", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 395.0, 88, 512, 397.5, 495.0, 512.0, 512.0, 0.07572274657219354, 0.014298372975092627, 0.051208986329339866], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 395.0, 88, 512, 397.5, 495.0, 512.0, 512.0, 0.07787165638575394, 0.014704141590139224, 0.05266222856165489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 145.0666666666667, 79, 246, 83.0, 245.4, 246.0, 246.0, 0.08818549524974131, 0.050086605505126516, 0.048812049519095096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 103.73333333333333, 78, 245, 83.0, 243.8, 245.0, 245.0, 0.08818445837105668, 0.06553552033239661, 0.04426446445578431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 195.99999999999997, 78, 568, 82.0, 558.4, 568.0, 568.0, 0.08818601369822746, 5.20493832490667, 0.05041415275287339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 206.4, 78, 721, 82.0, 617.2, 721.0, 721.0, 0.08818601369822746, 15.889001137232135, 0.05032803359887122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cefc4836-af74-4881-8f06-223c313bb42d", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 185.78571428571428, 82, 321, 175.0, 291.0, 321.0, 321.0, 0.0754001594174799, 0.1633652589052974, 0.04873976543818265], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7bf5162-83ac-4ed0-8908-814bb3b40759", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/783ebfb5-eec3-4fb3-b3d7-05cb9dcc8e25", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.8458724710982661, 3.449015534682081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 97.27777777777779, 79, 342, 82.5, 114.30000000000035, 342.0, 342.0, 0.08944588275632456, 0.06647296560308887, 0.04489764036792073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 88.94444444444443, 77, 239, 80.0, 99.50000000000023, 239.0, 239.0, 0.08944677171693077, 0.02393399946331937, 0.051012611994812086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 506.3333333333333, 406, 562, 551.0, 562.0, 562.0, 562.0, 0.030439855918015322, 8.950328338237531, 0.01736023032824311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 603.3333333333334, 542, 704, 564.0, 704.0, 704.0, 704.0, 0.030391133893205555, 27.345995699021408, 0.017302764706776212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 184.0, 79, 239, 234.0, 239.0, 239.0, 239.0, 0.030491523356506893, 0.05395570343944383, 0.016883489983534578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 82.46153846153847, 79, 87, 83.0, 85.4, 87.0, 87.0, 0.09928363042050437, 0.07378402612305061, 0.04983572855091723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 104.46153846153847, 79, 240, 80.0, 238.0, 240.0, 240.0, 0.09916926668141492, 0.026535526436237977, 0.05655747240424445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 92.6923076923077, 79, 237, 81.0, 174.99999999999994, 237.0, 237.0, 0.09916775369781296, 0.02672880861386365, 0.05829979270125332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 105.15384615384616, 79, 244, 81.0, 240.0, 244.0, 244.0, 0.09928514694201747, 0.026760449761715648, 0.05846576524027005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ccf3c2d-025f-4523-ad16-2cd95d580730", 3, 0, 0.0, 403.33333333333337, 175, 849, 186.0, 849.0, 849.0, 849.0, 0.08093670749473912, 0.03662175241461177, 0.051902771407759125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 187.33333333333334, 84, 240, 238.0, 240.0, 240.0, 240.0, 0.030491213448657878, 0.022659974057059225, 0.017121530989236602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 386.61904761904765, 78, 741, 236.0, 737.6, 740.8, 741.0, 0.1036463782994097, 44.424725198285394, 0.05669125286261426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 91.77777777777779, 78, 236, 82.0, 127.10000000000016, 236.0, 236.0, 0.08944632723441895, 0.024108580387401983, 0.052584657221797074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bbca490-935b-42b3-9868-378ee3c82a6c", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 318.9047619047619, 78, 649, 243.0, 645.0, 649.0, 649.0, 0.1036474014115789, 14.526908222693844, 0.05679303063767829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 100.83333333333334, 79, 245, 82.0, 236.0, 245.0, 245.0, 0.08944632723441895, 0.024108580387401983, 0.05267200715073694], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 332.07142857142856, 87, 597, 362.0, 520.0, 597.0, 597.0, 0.07805617814650029, 0.014738983973393995, 0.053418607965632976], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 201.23076923076923, 160, 328, 166.0, 328.0, 328.0, 328.0, 0.09910425004764628, 0.15359223127501428, 0.22288778111301694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f69831e2-b006-4018-aa2b-f059d00ad26e", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d321087-358d-4eca-9c2b-c69b5830d648", 3, 0, 0.0, 461.6666666666667, 167, 1036, 182.0, 1036.0, 1036.0, 1036.0, 0.03154972236244321, 0.03164215318967693, 0.020232081072269897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 440.5238095238095, 149, 1109, 424.0, 813.0000000000001, 1081.6999999999996, 1109.0, 0.0890929069318524, 0.05472601412122575, 0.04028321866156999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 89.76190476190477, 79, 247, 82.0, 85.6, 230.89999999999978, 247.0, 0.10364330908408927, 0.07702398262987493, 0.0520240828800995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 131.04761904761907, 79, 318, 82.0, 247.0, 310.8999999999999, 318.0, 0.1036474014115789, 0.10186403373476136, 0.05496628374710034], "isController": false}, {"data": ["login", 21, 0, 0.0, 2014.5238095238099, 1481, 2861, 2053.0, 2660.2000000000003, 2846.1, 2861.0, 0.0890645675703186, 15.346925874158128, 0.15547780887379975], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 85.05555555555556, 82, 91, 85.0, 88.30000000000001, 91.0, 91.0, 0.09145040339789054, 0.07403553165708131, 0.0325077605828439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f1744dd-f620-4c99-a8c8-1f1b91948ae1", 3, 0, 0.0, 279.0, 156, 483, 198.0, 483.0, 483.0, 483.0, 0.01632777463316933, 0.022509155459463578, 0.010470610685984238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57128305-0036-47f2-a089-e9f29472d630", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ca4e6da-984c-452d-ad32-5303c07c79cf", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7bf5162-83ac-4ed0-8908-814bb3b40759", 3, 0, 0.0, 410.66666666666663, 160, 682, 390.0, 682.0, 682.0, 682.0, 0.04144562334217507, 0.02664554235051945, 0.02657808528127763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 487.00000000000017, 161, 828, 495.0, 820.0, 827.3, 828.0, 0.10360189246123562, 59.10500009404338, 0.2203804579080311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf4ecd01-3be8-4af6-af25-97ee04de8e3d", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.5282574926900584, 2.0159448099415203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40d85ad6-0290-4af8-86c8-96a15411f359", 3, 0, 0.0, 537.6666666666667, 175, 1242, 196.0, 1242.0, 1242.0, 1242.0, 0.08386447500838645, 0.03892927778709605, 0.053780278569831155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a190b388-9805-4e36-b5c7-c51526a8a922", 3, 0, 0.0, 314.6666666666667, 162, 433, 349.0, 433.0, 433.0, 433.0, 0.047598648198391165, 0.030601344463483903, 0.030523872705348502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=151acafb-33a7-4321-a705-6956f63f54fb", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 356.26666666666665, 162, 800, 323.0, 708.2, 800.0, 800.0, 0.08814196732871078, 21.198969473498646, 0.19372296061523092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 619.25, 82, 945, 725.0, 945.0, 945.0, 945.0, 0.0384172109104879, 34.472825075633885, 0.07116938388398002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6aec7595-b66b-45a1-96fa-d25cc4b52100", 3, 0, 0.0, 547.6666666666667, 168, 1272, 203.0, 1272.0, 1272.0, 1272.0, 0.020241685727587392, 0.02790479786989994, 0.012980508100047906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99b186d5-e561-4b05-aab6-ac7809d16aa8", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 932.7727272727275, 200, 1736, 863.0, 1533.6999999999998, 1715.1499999999996, 1736.0, 0.08639817778388674, 0.027459648123785027, 0.038980427867339525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 86.58823529411764, 81, 105, 84.0, 96.19999999999999, 105.0, 105.0, 0.08048137329628034, 0.062483097432170766, 0.02860861316391215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 208.22222222222223, 161, 588, 166.5, 348.60000000000036, 588.0, 588.0, 0.08940900646725147, 0.13856649732766413, 0.20108295106843763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 276.0, 161, 945, 168.0, 400.0, 945.0, 945.0, 0.09271503789117207, 5.9739916782153815, 0.20726976629710778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 84.375, 80, 94, 83.0, 94.0, 94.0, 94.0, 0.0587406015037594, 0.043653904047227444, 0.02948502848919173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 99.75, 79, 233, 81.5, 233.0, 233.0, 233.0, 0.05874189545411157, 0.015718046244557197, 0.033501237251173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/151acafb-33a7-4321-a705-6956f63f54fb", 3, 0, 0.0, 380.3333333333333, 170, 522, 449.0, 522.0, 522.0, 522.0, 0.0197046923440702, 0.027164509139693135, 0.01263614710866481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cefc4836-af74-4881-8f06-223c313bb42d", 3, 0, 0.0, 295.3333333333333, 177, 388, 321.0, 388.0, 388.0, 388.0, 0.018660894230051506, 0.025573686428553656, 0.011966784385807767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 121.125, 79, 243, 82.0, 243.0, 243.0, 243.0, 0.05874189545411157, 0.01583277650911601, 0.03453380963220231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 119.375, 80, 235, 81.0, 235.0, 235.0, 235.0, 0.058741032814209455, 0.01583254400070489, 0.03459066678414873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 752.6000000000001, 616, 1236, 646.5, 1043.0, 1138.6999999999996, 1236.0, 0.2800832780946868, 335.0769733033955, 0.5530550667065007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 932.7727272727275, 200, 1736, 863.0, 1533.6999999999998, 1715.1499999999996, 1736.0, 0.08627281818003568, 0.02741980549400992, 0.03892386913982079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 117.0, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.0533447135388883, 0.014378067321028486, 0.031412951429638326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 98.77777777777777, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.053345662108576206, 0.01437832299020218, 0.03136141463804968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 175.76470588235293, 79, 730, 82.0, 707.6, 730.0, 730.0, 0.08137748141481932, 8.633894603595929, 0.047018308138226834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 145.58823529411765, 78, 399, 80.0, 390.2, 399.0, 399.0, 0.0813790396315923, 2.8344289584919027, 0.04709868016361974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 91.23529411764706, 79, 242, 82.0, 117.19999999999989, 242.0, 242.0, 0.08143907638506312, 0.06052259485257132, 0.040878598888596136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 99.88888888888889, 79, 240, 82.0, 240.0, 240.0, 240.0, 0.0533447135388883, 0.014273878427397845, 0.03042315694014723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 109.76470588235291, 78, 244, 81.0, 243.2, 244.0, 244.0, 0.08144219759793424, 0.03618301678667414, 0.04564281248652611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 133.22222222222223, 80, 372, 84.0, 372.0, 372.0, 372.0, 0.05334502972503601, 0.03964410900464102, 0.026776704373699715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 85.55555555555556, 81, 92, 85.0, 92.0, 92.0, 92.0, 0.054229934924078085, 0.04268489018438178, 0.01927704718004338], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 635.3076923076922, 349, 1272, 449.0, 1260.0, 1272.0, 1272.0, 0.07312943347190423, 0.013211860539357698, 0.04977657727530982], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1189.2857142857142, 737, 1692, 1121.0, 1658.6000000000001, 1690.0, 1692.0, 0.09000398589080374, 0.04658409425988865, 0.041398317729070856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 251.88888888888889, 162, 608, 168.0, 608.0, 608.0, 608.0, 0.053319114902692616, 0.08263421420954413, 0.11991593908291123], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 786.9166666666667, 414, 1872, 682.5, 1180.8, 1231.35, 1872.0, 0.272624418969207, 87.99108425855246, 0.9915204576228059], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 139.9833333333333, 79, 535, 84.0, 322.9, 328.0, 535.0, 0.2808226230705146, 0.20869728140298985, 0.1357492172069382], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 455.6666666666667, 381, 653, 404.5, 625.9, 646.0999999999999, 653.0, 0.2805796776139504, 82.4997413406097, 0.14111184958123485], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 120.9333333333333, 78, 290, 84.0, 243.9, 248.85, 290.0, 0.2809896455315622, 0.49721995869452207, 0.13665316745577924], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 608.4333333333333, 534, 830, 560.0, 723.8, 794.8499999999999, 830.0, 0.28056524544782885, 252.45310103505193, 0.14083060171892972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 101.31578947368422, 81, 240, 84.0, 239.0, 240.0, 240.0, 0.09408129614316202, 0.0702853433100771, 0.03344296073838963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, 2.7777777777777777, 138.92777777777783, 80, 1373, 87.0, 241.0, 263.69999999999993, 851.3599999999985, 0.7609449244973536, 1.6371503814764867, 0.36489191675685273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 88.5, 80, 96, 86.5, 96.0, 96.0, 96.0, 0.05810870686336464, 0.045000199748679845, 0.02065582939283665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 86.73333333333332, 82, 94, 87.0, 94.0, 94.0, 94.0, 0.09034892755822989, 0.0733202722664932, 0.03211622034296453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ccf3c2d-025f-4523-ad16-2cd95d580730", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf4ecd01-3be8-4af6-af25-97ee04de8e3d", 3, 0, 0.0, 292.3333333333333, 246, 370, 261.0, 370.0, 370.0, 370.0, 0.024918392265331043, 0.02499139536767088, 0.01597956795660877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 245.625, 164, 327, 246.5, 327.0, 327.0, 327.0, 0.058703963251319005, 0.09097967742172194, 0.13202658922635516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d321087-358d-4eca-9c2b-c69b5830d648", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40d85ad6-0290-4af8-86c8-96a15411f359", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.0883377259036144, 4.153332078313253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 287.0, 160, 813, 168.0, 793.8, 813.0, 813.0, 0.08134399418151195, 11.560141360609888, 0.18049600547157985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57128305-0036-47f2-a089-e9f29472d630", 3, 0, 0.0, 239.33333333333334, 176, 349, 193.0, 349.0, 349.0, 349.0, 0.08304728158564943, 0.037576732227881736, 0.05325623200642232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a190b388-9805-4e36-b5c7-c51526a8a922", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.5576051311728395, 2.1279417438271606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 111.30769230769229, 81, 252, 85.0, 251.6, 252.0, 252.0, 0.10971760376753371, 0.09096703671741808, 0.0390011794642405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 89.14285714285715, 80, 113, 87.0, 100.6, 111.79999999999998, 113.0, 0.10149340292880964, 0.07879614778164419, 0.0360777330723503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f1744dd-f620-4c99-a8c8-1f1b91948ae1", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f69831e2-b006-4018-aa2b-f059d00ad26e", 3, 0, 0.0, 506.6666666666667, 216, 866, 438.0, 866.0, 866.0, 866.0, 0.049203719801216975, 0.03163325084876417, 0.03155316666940021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99b186d5-e561-4b05-aab6-ac7809d16aa8", 3, 0, 0.0, 447.3333333333333, 162, 828, 352.0, 828.0, 828.0, 828.0, 0.017635336511612868, 0.02431173506727881, 0.011309118791626742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 89.94736842105264, 79, 236, 81.0, 90.0, 236.0, 236.0, 0.09303692096758398, 0.06914169614876114, 0.046700173220056804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 138.4736842105263, 77, 245, 82.0, 243.0, 245.0, 245.0, 0.09296818041698675, 0.03222540135342098, 0.052609974629472867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 159.26315789473685, 77, 709, 82.0, 320.0, 709.0, 709.0, 0.0927535099880885, 4.416303725334889, 0.05410939239128312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6aec7595-b66b-45a1-96fa-d25cc4b52100", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 120.99999999999999, 78, 385, 80.0, 240.0, 385.0, 385.0, 0.09290044983375709, 1.4613962723694502, 0.05428583543174261], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.2958579881656805], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07396449704142012], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5177514792899408], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 12, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
