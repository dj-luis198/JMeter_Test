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

    var data = {"OkPercent": 98.67354458364038, "KoPercent": 1.3264554163596167};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.817258883248731, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3c3a0c3-7001-40b0-8855-85e1e4794f41"], "isController": false}, {"data": [0.4152542372881356, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae485ec1-29b0-4012-b05d-8f0a6a956f94"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea1c9448-de6e-46cf-8b81-a6172f3e0003"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46f3dc17-e3d5-43e1-95cd-91947ac4e417"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2a85ca6-d458-434f-8211-b670569d0dd0"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b567a9f-17cc-4b71-81be-12cd1cbd13b6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da0113a3-fc2e-4fbe-b195-480c7f8ce6e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9466193-7e9a-4c6c-8f30-e842f7199648"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea0e3a5d-58aa-436f-ba7e-9924e51cbe31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a390aed7-9020-4aa0-883d-cd7a46a78734"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df0252a6-2ffc-42a6-a95f-0281b7140eed"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=455aaa8d-d5b6-408b-add3-4a5f9300e804"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea1c9448-de6e-46cf-8b81-a6172f3e0003"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9466193-7e9a-4c6c-8f30-e842f7199648"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/511d3a98-c45f-4933-a20e-0f838ebad2a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2ca226c-e07e-45fa-b40a-1349e3499f03"], "isController": false}, {"data": [0.4098360655737705, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bbef9cc-fbcf-4b9b-860b-4fc949051322"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46f3dc17-e3d5-43e1-95cd-91947ac4e417"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3c3a0c3-7001-40b0-8855-85e1e4794f41"], "isController": false}, {"data": [0.8389830508474576, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9530386740331491, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=511d3a98-c45f-4933-a20e-0f838ebad2a7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df0252a6-2ffc-42a6-a95f-0281b7140eed"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2a85ca6-d458-434f-8211-b670569d0dd0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da0113a3-fc2e-4fbe-b195-480c7f8ce6e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae485ec1-29b0-4012-b05d-8f0a6a956f94"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea0e3a5d-58aa-436f-ba7e-9924e51cbe31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b567a9f-17cc-4b71-81be-12cd1cbd13b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c1bb7aa-135b-4af0-9f3e-6abe8478a121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/455aaa8d-d5b6-408b-add3-4a5f9300e804"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 18, 1.3264554163596167, 304.9071481208548, 77, 3324, 95.0, 810.6000000000001, 1022.0999999999999, 1638.5800000000036, 5.308204442149568, 752.2054691595082, 3.8843344342381143], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/b3c3a0c3-7001-40b0-8855-85e1e4794f41", 3, 0, 0.0, 290.3333333333333, 172, 387, 312.0, 387.0, 387.0, 387.0, 0.03286014721345951, 0.027394152673720643, 0.021072425133631265], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1293.64406779661, 948, 1746, 1275.0, 1598.0, 1695.0, 1746.0, 0.2674621019801262, 321.8480607722628, 1.3151090658886087], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae485ec1-29b0-4012-b05d-8f0a6a956f94", 1, 0, 0.0, 856.0, 856, 856, 856.0, 856.0, 856.0, 856.0, 1.1682242990654206, 0.21105614778037385, 0.8054358936915889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea1c9448-de6e-46cf-8b81-a6172f3e0003", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 611.7857142857142, 82, 3014, 457.5, 1865.0, 3014.0, 3014.0, 0.09552141044185475, 0.018816438552441254, 0.06427173026800578], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 611.7857142857142, 82, 3014, 457.5, 1865.0, 3014.0, 3014.0, 0.09453263739305996, 0.018621663504324867, 0.06360643277716631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 107.78947368421052, 77, 249, 81.0, 246.0, 249.0, 249.0, 0.11619373776908024, 0.0402760365704501, 0.06575313799535225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 97.31578947368422, 79, 238, 81.0, 236.0, 238.0, 238.0, 0.1161923166301782, 0.08634995405816955, 0.05832309643350742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 165.1578947368421, 77, 619, 87.0, 319.0, 619.0, 619.0, 0.11607873804083528, 1.8260087585989908, 0.0678299328117936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 144.05263157894737, 78, 776, 82.0, 242.0, 776.0, 776.0, 0.11607873804083528, 5.526895567701397, 0.0677165746691756], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 209.21428571428575, 79, 382, 212.5, 362.0, 382.0, 382.0, 0.09452434001755453, 0.20816981466477616, 0.061095321889136446], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 94.10000000000001, 79, 238, 81.0, 144.3000000000001, 233.54999999999995, 238.0, 0.10538407225131993, 0.07831765525708444, 0.05289786439177582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 112.0, 78, 239, 80.0, 237.9, 238.95, 239.0, 0.10538684877514136, 0.02819921539491087, 0.060103437192072805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 549.2, 465, 635, 547.0, 635.0, 635.0, 635.0, 0.07195694096652563, 21.157729839464064, 0.041037942894971646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 793.0, 695, 940, 775.0, 940.0, 940.0, 940.0, 0.07156351978015688, 64.39298089343477, 0.04074368362483541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 176.2, 81, 247, 234.0, 247.0, 247.0, 247.0, 0.07220008086409056, 0.12776029934153527, 0.0399779744628314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 91.4, 78, 235, 80.0, 147.40000000000003, 235.0, 235.0, 0.07343797428691727, 0.05457646331283598, 0.03686242068698777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 114.0, 77, 283, 80.0, 253.60000000000002, 283.0, 283.0, 0.07343977204294759, 0.019650876503679332, 0.04188361999324354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 100.46666666666667, 78, 237, 79.0, 236.4, 237.0, 237.0, 0.07343977204294759, 0.019794313558450714, 0.04317455348618598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 111.26666666666668, 78, 236, 81.0, 235.4, 236.0, 236.0, 0.07344013160471584, 0.019794410471583566, 0.04324648374769888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 81.6, 79, 85, 81.0, 85.0, 85.0, 85.0, 0.07236413633403285, 0.05377842553730371, 0.040634158586004776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 509.26315789473693, 79, 1020, 700.0, 951.0, 1020.0, 1020.0, 0.09137470844254214, 43.28488883244764, 0.049585432346646786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46f3dc17-e3d5-43e1-95cd-91947ac4e417", 3, 0, 0.0, 632.0, 181, 1326, 389.0, 1326.0, 1326.0, 1326.0, 0.01957675065092696, 0.026988131187068904, 0.012554101166121781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 109.95, 77, 332, 80.5, 237.0, 327.24999999999994, 332.0, 0.10538795942563561, 0.02840534843894085, 0.061956593334211565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 354.94736842105266, 79, 709, 464.0, 628.0, 709.0, 709.0, 0.09137514788346303, 14.152364752758087, 0.049674904356670865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 112.9, 78, 239, 80.0, 237.60000000000002, 238.95, 239.0, 0.10538684877514136, 0.02840504908392482, 0.06205885723770531], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 572.7142857142857, 83, 1249, 484.5, 1173.0, 1249.0, 1249.0, 0.09462400475823567, 0.018639661651594412, 0.06427515055355043], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 238.53333333333333, 160, 471, 167.0, 406.80000000000007, 471.0, 471.0, 0.07340814438892614, 0.11376828627463456, 0.165096637234079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2a85ca6-d458-434f-8211-b670569d0dd0", 3, 0, 0.0, 271.3333333333333, 165, 435, 214.0, 435.0, 435.0, 435.0, 0.03302291790502609, 0.02684187044558924, 0.02117680607841842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 712.1904761904761, 95, 1272, 772.0, 1189.8, 1264.1999999999998, 1272.0, 0.0902911243824732, 0.055462028551343405, 0.04082499080965341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 89.57894736842105, 79, 241, 81.0, 83.0, 241.0, 241.0, 0.0913738295733804, 0.06790574639193601, 0.045865379297575705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 131.05263157894737, 78, 257, 81.0, 241.0, 257.0, 257.0, 0.09137558732861066, 0.09668266040022508, 0.04807362828411075], "isController": false}, {"data": ["login", 21, 0, 0.0, 2813.9523809523807, 1486, 4688, 2696.0, 3900.8, 4613.299999999999, 4688.0, 0.09090672969533259, 26.019307770956164, 0.1730499897729929], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3b567a9f-17cc-4b71-81be-12cd1cbd13b6", 3, 0, 0.0, 299.0, 174, 535, 188.0, 535.0, 535.0, 535.0, 0.021600760346764204, 0.02977839194939662, 0.013852050092163245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da0113a3-fc2e-4fbe-b195-480c7f8ce6e7", 1, 0, 0.0, 1097.0, 1097, 1097, 1097.0, 1097.0, 1097.0, 1097.0, 0.9115770282588879, 0.16468920920692798, 0.6284896308113036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 92.1, 80, 237, 84.0, 95.20000000000002, 229.9499999999999, 237.0, 0.10839932142024791, 0.08775687251697806, 0.03853257128610375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9466193-7e9a-4c6c-8f30-e842f7199648", 3, 0, 0.0, 354.3333333333333, 209, 512, 342.0, 512.0, 512.0, 512.0, 0.03366398850935859, 0.028064282087391715, 0.021587909297993625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea0e3a5d-58aa-436f-ba7e-9924e51cbe31", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a390aed7-9020-4aa0-883d-cd7a46a78734", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df0252a6-2ffc-42a6-a95f-0281b7140eed", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 608.6315789473684, 161, 1101, 782.0, 1034.0, 1101.0, 1101.0, 0.09133824957455605, 57.578790319527634, 0.19312199695459048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=455aaa8d-d5b6-408b-add3-4a5f9300e804", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 289.15789473684214, 159, 1013, 183.0, 485.0, 1013.0, 1013.0, 0.11602061503138664, 7.475660954941256, 0.2593707160151193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 521.2222222222222, 79, 1024, 775.0, 1024.0, 1024.0, 1024.0, 0.12866884927159136, 85.53345524111113, 0.19907651060803178], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1021.2727272727273, 112, 1921, 1092.0, 1631.8999999999999, 1882.8999999999994, 1921.0, 0.0882477998218999, 0.027765465426918788, 0.03981492531027124], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 251.04999999999995, 160, 477, 203.0, 416.70000000000016, 474.4, 477.0, 0.10533966775868789, 0.1632559108721071, 0.23691138168775216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 84.61111111111113, 80, 94, 83.5, 91.30000000000001, 94.0, 94.0, 0.1483117182736516, 0.11514435158940725, 0.05272018110508709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 387.7857142857143, 159, 1025, 317.5, 1021.5, 1025.0, 1025.0, 0.12195334413491524, 21.004660087719298, 0.2698183711824248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea1c9448-de6e-46cf-8b81-a6172f3e0003", 3, 0, 0.0, 366.6666666666667, 306, 412, 382.0, 412.0, 412.0, 412.0, 0.024089033066212722, 0.024159606405273894, 0.01544771977227834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 125.99999999999999, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.06708065010732904, 0.04985192844890371, 0.033671341948405396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 102.57142857142857, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.0671843057461777, 0.032392433127621384, 0.03750998766688102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 214.14285714285714, 80, 859, 82.0, 859.0, 859.0, 859.0, 0.06718301613352146, 8.65143479228451, 0.038671473851410364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 236.28571428571428, 79, 628, 233.0, 628.0, 628.0, 628.0, 0.06703183054353239, 2.831140983500594, 0.038649910105527256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.0, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.37885963250615645, 0.11173399318052661, 0.23419740954726273], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 876.406779661017, 624, 1408, 809.0, 1179.0, 1349.0, 1408.0, 0.25328410749549235, 303.0158483676054, 0.5001371731991071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1021.2727272727273, 112, 1921, 1092.0, 1631.8999999999999, 1882.8999999999994, 1921.0, 0.08912294915940855, 0.028040814259671865, 0.04020976807778003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 83.50000000000001, 80, 91, 81.0, 91.0, 91.0, 91.0, 0.03995824363540101, 0.010769995354854177, 0.023530098547018364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 82.125, 79, 90, 81.0, 90.0, 90.0, 90.0, 0.039959441167215275, 0.010770318127100992, 0.02349178084244492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9466193-7e9a-4c6c-8f30-e842f7199648", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 201.16666666666669, 78, 941, 81.0, 791.6000000000003, 941.0, 941.0, 0.13977976920806998, 14.00838690748909, 0.08084051322471927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 170.55555555555557, 77, 621, 80.5, 482.4000000000002, 621.0, 621.0, 0.13978085468227033, 4.600179433965195, 0.08097764574095502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 82.625, 78, 92, 80.5, 92.0, 92.0, 92.0, 0.03995844321905218, 0.010692005314472949, 0.0227887996483657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 111.27777777777779, 79, 319, 81.0, 247.90000000000012, 319.0, 319.0, 0.13977759831024414, 0.10387768780673416, 0.07016180227682177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 81.75, 80, 84, 81.5, 84.0, 84.0, 84.0, 0.03995844321905218, 0.0296956789938464, 0.020057265443938304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 109.33333333333334, 78, 309, 79.0, 243.3000000000001, 309.0, 309.0, 0.13977976920806998, 0.060728970910276917, 0.0784137811204125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 110.375, 81, 305, 83.0, 305.0, 305.0, 305.0, 0.03791666864149316, 0.029844565356487777, 0.013478190806155772], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 585.6428571428572, 79, 1445, 469.0, 1337.5, 1445.0, 1445.0, 0.09797403688022674, 0.018916862031561635, 0.06667373770950698], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1662.6666666666665, 796, 3324, 1616.0, 2173.0, 3209.8999999999983, 3324.0, 0.08958012515623201, 0.04636471321562789, 0.04120335834822781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 166.375, 160, 176, 165.5, 176.0, 176.0, 176.0, 0.039941286309125586, 0.061901192746662406, 0.0898288890331213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/511d3a98-c45f-4933-a20e-0f838ebad2a7", 3, 0, 0.0, 315.0, 212, 502, 231.0, 502.0, 502.0, 502.0, 0.028385167803650333, 0.023663546466519695, 0.018202728051168997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2ca226c-e07e-45fa-b40a-1349e3499f03", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["addBook", 61, 4, 6.557377049180328, 965.8360655737705, 406, 2741, 742.0, 1572.0000000000002, 2223.7, 2741.0, 0.2692098910361933, 85.49674551859313, 0.979411304719117], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9bbef9cc-fbcf-4b9b-860b-4fc949051322", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46f3dc17-e3d5-43e1-95cd-91947ac4e417", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 140.72881355932208, 79, 405, 82.0, 324.0, 342.0, 405.0, 0.254138363262792, 0.18886649847947723, 0.12285008771004105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3c3a0c3-7001-40b0-8855-85e1e4794f41", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 498.06779661016935, 385, 725, 470.0, 630.0, 711.0, 725.0, 0.2540365984930032, 74.69519476587729, 0.1277625470936491], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 119.0, 78, 331, 82.0, 240.0, 244.0, 331.0, 0.25445512101713047, 0.4502662883623441, 0.12374868190090914], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 733.7288135593222, 541, 1086, 704.0, 935.0, 1017.0, 1086.0, 0.25368815276326595, 228.26904579259275, 0.12733956105499875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 83.35714285714286, 80, 92, 82.0, 90.5, 92.0, 92.0, 0.12194484608818355, 0.09110137427486369, 0.043347582007908995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 4, 2.2099447513812156, 172.2817679558011, 79, 2415, 88.0, 290.8, 490.60000000000036, 1272.7400000000096, 0.7273457906369298, 1.557268905716295, 0.3499260661543098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 83.28571428571428, 80, 87, 83.0, 87.0, 87.0, 87.0, 0.0675623503976527, 0.05232123424349471, 0.024016304242915603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 85.84210526315789, 81, 98, 84.0, 96.0, 98.0, 98.0, 0.11585648430449523, 0.09402025239944876, 0.041183359655113536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 396.57142857142856, 162, 942, 395.0, 942.0, 942.0, 942.0, 0.06687876790201305, 11.518878771484804, 0.14796740794615304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=511d3a98-c45f-4933-a20e-0f838ebad2a7", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df0252a6-2ffc-42a6-a95f-0281b7140eed", 3, 0, 0.0, 370.33333333333337, 197, 701, 213.0, 701.0, 701.0, 701.0, 0.034968703010805326, 0.028628348981827933, 0.02242459144898649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 326.49999999999994, 160, 1094, 163.0, 1029.2, 1094.0, 1094.0, 0.1396897335806359, 18.761046644730204, 0.3101942705867745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2a85ca6-d458-434f-8211-b670569d0dd0", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da0113a3-fc2e-4fbe-b195-480c7f8ce6e7", 3, 0, 0.0, 541.0, 169, 1230, 224.0, 1230.0, 1230.0, 1230.0, 0.022607725813501334, 0.02672156654584093, 0.014497792920767456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.86666666666665, 82, 238, 84.0, 237.4, 238.0, 238.0, 0.07627338414835683, 0.06323838197456537, 0.027112804521486213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 107.78947368421053, 80, 331, 85.0, 242.0, 331.0, 331.0, 0.08715316480663464, 0.06766285744265092, 0.03098022655235841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae485ec1-29b0-4012-b05d-8f0a6a956f94", 3, 0, 0.0, 287.3333333333333, 169, 436, 257.0, 436.0, 436.0, 436.0, 0.03661304889062462, 0.023538662616856647, 0.023479071065927896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea0e3a5d-58aa-436f-ba7e-9924e51cbe31", 3, 0, 0.0, 622.3333333333333, 205, 1445, 217.0, 1445.0, 1445.0, 1445.0, 0.027979854504756575, 0.02806182673475098, 0.01794281034321955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b567a9f-17cc-4b71-81be-12cd1cbd13b6", 1, 0, 0.0, 1249.0, 1249, 1249, 1249.0, 1249.0, 1249.0, 1249.0, 0.8006405124099278, 0.14464696757405923, 0.5520041032826261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c1bb7aa-135b-4af0-9f3e-6abe8478a121", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 92.71428571428571, 78, 240, 81.0, 167.0, 240.0, 240.0, 0.12204051745179399, 0.09069612673907738, 0.06125861911154504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 136.57142857142858, 78, 251, 80.0, 245.0, 251.0, 251.0, 0.12203945361193197, 0.05884045084861006, 0.06813642485420644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/455aaa8d-d5b6-408b-add3-4a5f9300e804", 3, 0, 0.0, 497.0, 212, 1057, 222.0, 1057.0, 1057.0, 1057.0, 0.019860841702471353, 0.0273797736360567, 0.012736281951129089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 258.14285714285717, 78, 945, 156.5, 941.0, 945.0, 945.0, 0.12203945361193197, 15.715525080197356, 0.07024759843789499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 224.7857142857143, 79, 620, 235.5, 541.0, 620.0, 620.0, 0.12203838979061699, 5.154385373263132, 0.07036616420265346], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.4421518054532056], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.14738393515106854], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.14738393515106854], "isController": false}, {"data": ["401/Unauthorized", 8, 44.44444444444444, 0.5895357406042742], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 18, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
