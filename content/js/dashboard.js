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

    var data = {"OkPercent": 98.98753894080997, "KoPercent": 1.0124610591900312};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7338056680161943, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a7fa9ad-603f-43ea-841f-6c674c128206"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b9a2b55-8a47-472d-8df0-7737af5a18f3"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7be9caf7-7dc1-405c-b65e-404b09ce6aed"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27d313a3-52ff-43eb-bd99-662073c18a32"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2b254d7-8d71-4190-acfe-879059ab746e"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82582a79-79e6-4abf-9701-de2124822160"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cb2e7723-eb15-4d8e-b128-eceaa1282adb"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a3be1f9-cde6-4aff-981a-8ea2f1ce2229"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98cd473b-6141-4fd8-ba66-1cd09689f376"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a0c10d8-6e83-4d1e-8810-97fdcb989470"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24f7af63-005c-47e7-af4d-89eebaacd084"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/818c23c5-7384-4165-8a12-adbcc17037b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e809108-06a2-4d6e-b163-16343fe7ec41"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.125, 500, 1500, "register"], "isController": true}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2b254d7-8d71-4190-acfe-879059ab746e"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2543859649122807, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a0c10d8-6e83-4d1e-8810-97fdcb989470"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b9a2b55-8a47-472d-8df0-7737af5a18f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82582a79-79e6-4abf-9701-de2124822160"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e5558f0-a03c-49a6-854f-0ccfb7cfe73e"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7be9caf7-7dc1-405c-b65e-404b09ce6aed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a7fa9ad-603f-43ea-841f-6c674c128206"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9502923976608187, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98cd473b-6141-4fd8-ba66-1cd09689f376"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e5558f0-a03c-49a6-854f-0ccfb7cfe73e"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/27d313a3-52ff-43eb-bd99-662073c18a32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24f7af63-005c-47e7-af4d-89eebaacd084"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a3be1f9-cde6-4aff-981a-8ea2f1ce2229"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86cf0918-05e6-4f96-985e-827b5d8bdc13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 13, 1.0124610591900312, 474.9914330218066, 1, 3032, 156.5, 1369.0, 1641.75, 2136.7500000000077, 5.110834252142451, 727.1466509843033, 3.743508371031043], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/4a7fa9ad-603f-43ea-841f-6c674c128206", 3, 0, 0.0, 447.0, 242, 622, 477.0, 622.0, 622.0, 622.0, 0.04031120248317007, 0.025916219044355756, 0.025850608363230807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b9a2b55-8a47-472d-8df0-7737af5a18f3", 3, 0, 0.0, 554.3333333333334, 345, 920, 398.0, 920.0, 920.0, 920.0, 0.019256320887331268, 0.02654639288992445, 0.012348617235690949], "isController": false}, {"data": ["see books", 57, 1, 1.7543859649122806, 2314.4912280701756, 1677, 3132, 2267.0, 2831.4, 2928.3, 3132.0, 0.24832922355729437, 298.83062241732165, 1.218548198469508], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7be9caf7-7dc1-405c-b65e-404b09ce6aed", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 701.9090909090909, 503, 1240, 605.0, 1164.8000000000002, 1240.0, 1240.0, 0.07411899467690856, 0.013390638686746177, 0.05037775419446129], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 701.9090909090909, 503, 1240, 605.0, 1164.8000000000002, 1240.0, 1240.0, 0.07263267017504474, 0.013122113264046168, 0.049367518009600715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 177.33333333333334, 135, 442, 139.0, 426.40000000000003, 442.0, 442.0, 0.07893324352484292, 0.03692801353968237, 0.044132727564541084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 142.33333333333331, 138, 150, 141.0, 150.0, 150.0, 150.0, 0.07893199745312755, 0.058659423888505924, 0.03962016278408941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 324.5999999999999, 136, 1124, 140.0, 940.4000000000001, 1124.0, 1124.0, 0.07881587036365643, 3.108341937399181, 0.045508981396827394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 435.7333333333333, 135, 1824, 145.0, 1650.6000000000001, 1824.0, 1824.0, 0.07881959770477331, 9.474680107378566, 0.045434161333207226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27d313a3-52ff-43eb-bd99-662073c18a32", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2b254d7-8d71-4190-acfe-879059ab746e", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.27624474388379205, 1.0542096712538225], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 335.8181818181818, 242, 614, 270.0, 588.2, 614.0, 614.0, 0.07415297083765893, 0.1797143067202815, 0.04793873700637715], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 165.73913043478262, 135, 413, 141.0, 320.60000000000036, 413.0, 413.0, 0.11770666475606573, 0.08747536316344337, 0.05908322820763456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 173.47826086956522, 134, 415, 139.0, 404.6, 413.0, 415.0, 0.11770786953873867, 0.031496051028920315, 0.0671302693463119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1034.8, 827, 1098, 1086.0, 1098.0, 1098.0, 1098.0, 0.08837201081673413, 25.984305407041482, 0.05039966241891868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1526.2, 1264, 1676, 1522.0, 1676.0, 1676.0, 1676.0, 0.0874294007588872, 78.66912848734022, 0.049776699846124255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 195.8, 138, 414, 142.0, 414.0, 414.0, 414.0, 0.0898391878537418, 0.15897325038181653, 0.049744940930733984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 198.0, 140, 408, 143.0, 407.6, 408.0, 408.0, 0.07296766802629755, 0.05422694860157464, 0.036626348989762636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 220.3, 133, 416, 142.5, 415.6, 416.0, 416.0, 0.07297033026371477, 0.019525264152595555, 0.04161589147852483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 249.8, 136, 425, 142.0, 424.5, 425.0, 425.0, 0.07297246019352296, 0.019668358411535487, 0.04289982523095783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82582a79-79e6-4abf-9701-de2124822160", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 168.4, 135, 410, 143.0, 383.7000000000001, 410.0, 410.0, 0.07297139521307647, 0.01966807136602452, 0.04297046026707531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 142.6, 139, 147, 142.0, 147.0, 147.0, 147.0, 0.08984080209868114, 0.06676645546591439, 0.05044771602220864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 174.91304347826087, 135, 419, 139.0, 409.40000000000003, 418.2, 419.0, 0.11754965195081314, 0.031683304627367605, 0.069106338353896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1070.1333333333334, 137, 1671, 1243.0, 1653.6, 1671.0, 1671.0, 0.07132599785070994, 42.792580357652334, 0.03784550016167226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 229.73913043478265, 137, 553, 142.0, 419.2, 526.3999999999996, 553.0, 0.11753943959239367, 0.031680552077637356, 0.069215119213099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 758.6, 136, 1202, 1065.0, 1139.0, 1202.0, 1202.0, 0.07142006903940007, 14.00633109153672, 0.037965160397571716], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 602.2727272727274, 488, 666, 606.0, 663.6, 666.0, 666.0, 0.07262835410944433, 0.013121333506100783, 0.05007384570436299], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 478.0999999999999, 283, 834, 432.5, 832.5, 834.0, 834.0, 0.07289267282852728, 0.11296940603405546, 0.1639373296133773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 691.0, 228, 1607, 610.0, 1449.4000000000005, 1600.1499999999999, 1607.0, 0.0869962374127319, 0.05343811848887536, 0.03933521281454577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 140.8, 137, 149, 140.0, 146.0, 149.0, 149.0, 0.07141938893570826, 0.05307632322272851, 0.03584918546186919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 268.8, 136, 563, 143.0, 549.2, 563.0, 563.0, 0.07132667617689016, 0.09050500772705658, 0.036684944127436996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb2e7723-eb15-4d8e-b128-eceaa1282adb", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.45167742220650636, 0.8439599540311175], "isController": false}, {"data": ["login", 20, 0, 0.0, 3198.25, 2030, 4982, 2823.0, 4732.500000000001, 4970.849999999999, 4982.0, 0.08671259543805035, 26.05351484763513, 0.16677778976097674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a3be1f9-cde6-4aff-981a-8ea2f1ce2229", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 158.43478260869566, 139, 415, 145.0, 166.8, 366.79999999999933, 415.0, 0.11683785953041341, 0.09458846245186787, 0.041532207879951634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98cd473b-6141-4fd8-ba66-1cd09689f376", 3, 0, 0.0, 389.6666666666667, 271, 556, 342.0, 556.0, 556.0, 556.0, 0.027886483421485607, 0.02283024277507692, 0.017882933704533414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a0c10d8-6e83-4d1e-8810-97fdcb989470", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24f7af63-005c-47e7-af4d-89eebaacd084", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1212.0666666666666, 277, 1810, 1384.0, 1799.2, 1810.0, 1810.0, 0.07127854705809678, 56.88610441802254, 0.14814893325714448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/818c23c5-7384-4165-8a12-adbcc17037b0", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e809108-06a2-4d6e-b163-16343fe7ec41", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 636.2, 281, 1965, 558.0, 1791.0, 1965.0, 1965.0, 0.07875628081339486, 12.668434868227616, 0.17443798369482466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1669.0, 1406, 1822, 1662.0, 1822.0, 1822.0, 1822.0, 0.08721589422456348, 104.34053064330443, 0.19666162086378622], "isController": false}, {"data": ["register", 20, 5, 25.0, 1482.3999999999999, 307, 2629, 1586.0, 2218.4000000000005, 2610.1499999999996, 2629.0, 0.08627234453723515, 0.02721285867727241, 0.03892365544551039], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 409.3478260869565, 278, 834, 285.0, 774.8000000000002, 833.6, 834.0, 0.11745480543356143, 0.18203200803033398, 0.26415861026708204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 163.75000000000003, 141, 415, 147.0, 174.4, 402.99999999999983, 415.0, 0.10307950006442469, 0.08002754155392346, 0.03664154103852596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2b254d7-8d71-4190-acfe-879059ab746e", 3, 0, 0.0, 470.6666666666667, 384, 620, 408.0, 620.0, 620.0, 620.0, 0.02007817101247524, 0.02013699377911335, 0.012875650030786528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 488.12499999999994, 280, 1599, 423.0, 875.9000000000008, 1599.0, 1599.0, 0.0991307472599642, 7.55620853740327, 0.22136215327472228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 141.87500000000003, 137, 147, 141.5, 147.0, 147.0, 147.0, 0.04671778370834088, 0.03471897793168692, 0.02345013752547579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 176.125, 136, 422, 141.5, 422.0, 422.0, 422.0, 0.046719420679183575, 0.012501094986422167, 0.026644669606096884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 139.5, 136, 142, 139.5, 142.0, 142.0, 142.0, 0.046719420679183575, 0.012592343854936197, 0.027465909422723155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 172.375, 135, 405, 140.5, 405.0, 405.0, 405.0, 0.04671969351881052, 0.012592417393741897, 0.027511694523283926], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, 1.7543859649122806, 1587.3333333333335, 1076, 2567, 1483.0, 2220.2, 2331.7999999999997, 2567.0, 0.25738166087934217, 307.9184538629262, 0.5060322415684928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, 25.0, 1482.3999999999999, 307, 2629, 1586.0, 2218.4000000000005, 2610.1499999999996, 2629.0, 0.08700380641653073, 0.02744358346927678, 0.039253670473083195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a0c10d8-6e83-4d1e-8810-97fdcb989470", 3, 0, 0.0, 450.3333333333333, 270, 585, 496.0, 585.0, 585.0, 585.0, 0.040951717924566935, 0.03413976224115101, 0.026261355570116166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 177.85714285714286, 138, 408, 139.0, 408.0, 408.0, 408.0, 0.045559865663481816, 0.012279807542110333, 0.026828709956132357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b9a2b55-8a47-472d-8df0-7737af5a18f3", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 138.2857142857143, 134, 141, 138.0, 141.0, 141.0, 141.0, 0.04556016219417741, 0.01227988746639938, 0.02678439222743633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 249.59999999999997, 134, 1540, 140.0, 419.20000000000005, 1483.999999999999, 1540.0, 0.09791729904922303, 4.430380073646049, 0.0571439237420075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 220.04999999999998, 134, 666, 141.0, 421.90000000000003, 653.8499999999998, 666.0, 0.09791490215853402, 1.4645831854410334, 0.05723814495322116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 168.85, 135, 422, 142.0, 386.70000000000056, 421.55, 422.0, 0.09791490215853402, 0.07276683646742617, 0.0491486911225454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 175.85714285714286, 135, 402, 140.0, 402.0, 402.0, 402.0, 0.04555956913664617, 0.012190744085391648, 0.025983191773243514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 181.29999999999998, 135, 422, 141.0, 414.8, 421.65, 422.0, 0.0977803852547179, 0.04085004766793782, 0.05494417351129364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 177.7142857142857, 136, 405, 141.0, 405.0, 405.0, 405.0, 0.04555956913664617, 0.03385823448533958, 0.022868768101793092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 182.28571428571428, 140, 407, 145.0, 407.0, 407.0, 407.0, 0.044157630123073624, 0.034756884647653655, 0.015696657582811326], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 609.2727272727273, 477, 920, 573.0, 877.4000000000001, 920.0, 920.0, 0.07324690198898633, 0.0132330828788696, 0.049856533873362766], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1780.05, 1404, 3032, 1641.5, 2473.2000000000003, 3004.3999999999996, 3032.0, 0.08689003197553176, 0.04497237983108578, 0.03996602056687057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 357.2857142857143, 278, 814, 282.0, 814.0, 814.0, 814.0, 0.045517797458806394, 0.07054369586633373, 0.10237059330823352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82582a79-79e6-4abf-9701-de2124822160", 3, 0, 0.0, 351.6666666666667, 248, 545, 262.0, 545.0, 545.0, 545.0, 0.03523773726743093, 0.02937625167379252, 0.022597116672148095], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1368.3859649122808, 713, 2967, 1125.0, 2359.8, 2743.7, 2967.0, 0.2636069758730247, 78.44796009533786, 0.9599651241033894], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e5558f0-a03c-49a6-854f-0ccfb7cfe73e", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 245.24561403508764, 137, 578, 143.0, 566.0, 570.1, 578.0, 0.2585256779495739, 0.19212699308557202, 0.12497090877445223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7be9caf7-7dc1-405c-b65e-404b09ce6aed", 3, 0, 0.0, 571.3333333333334, 485, 707, 522.0, 707.0, 707.0, 707.0, 0.01985282439515062, 0.023465366334242153, 0.012731140644025625], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 870.421052631579, 669, 1261, 817.0, 1220.4, 1246.7, 1261.0, 0.25845300009521954, 75.99376347526332, 0.12998368657132622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a7fa9ad-603f-43ea-841f-6c674c128206", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 1, 1.7543859649122806, 193.17543859649126, 1, 432, 143.0, 426.0, 427.4, 432.0, 0.25909090909090904, 0.45897993607954546, 0.12379261363636364], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1337.947368421053, 935, 2014, 1338.0, 1652.4, 1772.8999999999999, 2014.0, 0.2581054156855642, 232.2437067347967, 0.12955681998279298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 166.3125, 140, 431, 146.5, 247.6000000000002, 431.0, 431.0, 0.10001500225033755, 0.07471823898584788, 0.03555220783117467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, 3.508771929824561, 214.75438596491225, 136, 872, 148.0, 399.40000000000015, 449.60000000000014, 682.6400000000003, 0.7019128150398161, 1.5083966256362367, 0.3364254204806666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 181.12499999999997, 143, 406, 148.0, 406.0, 406.0, 406.0, 0.0461677852736307, 0.03575298215038002, 0.01641120492148591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 146.53333333333333, 138, 161, 144.0, 156.2, 161.0, 161.0, 0.0784494210432727, 0.0636635438349215, 0.027886317636475845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98cd473b-6141-4fd8-ba66-1cd09689f376", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e5558f0-a03c-49a6-854f-0ccfb7cfe73e", 3, 0, 0.0, 401.6666666666667, 257, 606, 342.0, 606.0, 606.0, 606.0, 0.02274157235231244, 0.022808198052563355, 0.014583625499367026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 353.0, 279, 566, 288.0, 566.0, 566.0, 566.0, 0.04667907552090931, 0.07234345005047174, 0.10498233488735755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 463.05, 275, 1678, 286.5, 833.3000000000001, 1635.7999999999993, 1678.0, 0.09771254922269668, 5.996110544344398, 0.2180974633822222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 174.7, 142, 416, 147.5, 390.2000000000001, 416.0, 416.0, 0.0738519711091089, 0.061230784640267044, 0.026252067855191054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27d313a3-52ff-43eb-bd99-662073c18a32", 3, 0, 0.0, 542.6666666666666, 367, 647, 614.0, 647.0, 647.0, 647.0, 0.01664299662701935, 0.02294371442559471, 0.010672754998446653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 143.8, 137, 154, 143.0, 152.2, 154.0, 154.0, 0.07227383109123849, 0.056111030974154874, 0.025691088395713678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24f7af63-005c-47e7-af4d-89eebaacd084", 3, 0, 0.0, 399.6666666666667, 270, 555, 374.0, 555.0, 555.0, 555.0, 0.0446149727848666, 0.02868312866214568, 0.02861051314654531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a3be1f9-cde6-4aff-981a-8ea2f1ce2229", 3, 0, 0.0, 398.6666666666667, 255, 573, 368.0, 573.0, 573.0, 573.0, 0.026448029621793177, 0.02652551408357577, 0.016960487745746274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86cf0918-05e6-4f96-985e-827b5d8bdc13", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.808445411392405, 1.510581487341772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 158.5625, 137, 403, 142.0, 227.30000000000018, 403.0, 403.0, 0.09922111425311307, 0.07373756635412015, 0.049804348365332145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 208.43749999999997, 137, 415, 140.5, 414.3, 415.0, 415.0, 0.09921803783927918, 0.03586237915553048, 0.05606448939917277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 309.75, 135, 1195, 146.0, 654.6000000000006, 1195.0, 1195.0, 0.0992198836646864, 5.604960538779471, 0.05779752012303265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 252.875, 138, 1112, 142.0, 628.3000000000005, 1112.0, 1112.0, 0.09921742257940495, 1.8483968441108258, 0.057892978507025836], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3894080996884735], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 7.6923076923076925, 0.0778816199376947], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.4672897196261682], "isController": false}, {"data": ["Assertion failed", 1, 7.6923076923076925, 0.0778816199376947], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 13, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Assertion failed", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
