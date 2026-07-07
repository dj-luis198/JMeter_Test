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

    var data = {"OkPercent": 97.38415545590433, "KoPercent": 2.615844544095665};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.758819756254009, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.044642857142857144, 500, 1500, "see books"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae0b660c-54c7-43c9-a551-bbc0552a7ae2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e13616cd-e2d1-43f1-aa8c-d084fdaca653"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7cc64f03-b953-4224-87cb-6f22f40d7267"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e804d83-0b94-40fe-a785-5057f2cf1148"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5af3d42e-64e4-4c00-8485-a9ceea3bced3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a4e9565-5ace-4339-bbde-7293ec68756c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c64554f-da40-4301-bc66-42bc2b4cf2ad"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7b8760d-2abd-4584-94a7-9e2cdba0ee62"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/052c2b43-6041-43ef-b260-69c1c3b0af3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ceec0995-e9ed-4cbd-9c9e-de6fe9c059ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a714bb5-3f1e-4ddc-879c-586beb178a1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a4e9565-5ace-4339-bbde-7293ec68756c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe2f31b8-f08e-4918-b27a-bd207ab7c487"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16b55a72-5d6b-43e8-ad95-449318667339"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acbf938c-e9ed-42f1-87ca-4fce4199c97d"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c64554f-da40-4301-bc66-42bc2b4cf2ad"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acbf938c-e9ed-42f1-87ca-4fce4199c97d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5af3d42e-64e4-4c00-8485-a9ceea3bced3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e804d83-0b94-40fe-a785-5057f2cf1148"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cc64f03-b953-4224-87cb-6f22f40d7267"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae0b660c-54c7-43c9-a551-bbc0552a7ae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fe6bbcc-68b3-42e1-8056-4119f8caca0b"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ceec0995-e9ed-4cbd-9c9e-de6fe9c059ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/01cb55c3-5267-4ad5-8ed2-137578743124"], "isController": false}, {"data": [0.22950819672131148, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8904494382022472, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7b8760d-2abd-4584-94a7-9e2cdba0ee62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a714bb5-3f1e-4ddc-879c-586beb178a1c"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e13616cd-e2d1-43f1-aa8c-d084fdaca653"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe2f31b8-f08e-4918-b27a-bd207ab7c487"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 35, 2.615844544095665, 393.7810164424517, 102, 2499, 127.0, 1115.0, 1366.1, 1773.8799999999992, 5.337993106089621, 757.5686554730387, 3.899802075603616], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1836.9464285714282, 1309, 2304, 1860.5, 2205.8, 2268.95, 2304.0, 0.26177031524625105, 314.9977692187909, 1.2871225949852287], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 482.4, 120, 810, 488.0, 789.6, 810.0, 810.0, 0.087631666579035, 0.017834413393623922, 0.05872348594388068], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 482.4, 120, 810, 488.0, 789.6, 810.0, 810.0, 0.08670820953327861, 0.017646475455796156, 0.05810466150560135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae0b660c-54c7-43c9-a551-bbc0552a7ae2", 3, 0, 0.0, 290.6666666666667, 217, 425, 230.0, 425.0, 425.0, 425.0, 0.04163717366865138, 0.026768690753771633, 0.026700921916420314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e13616cd-e2d1-43f1-aa8c-d084fdaca653", 3, 0, 0.0, 625.0, 232, 1223, 420.0, 1223.0, 1223.0, 1223.0, 0.02439421044072207, 0.02446567785412262, 0.015643422711009918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cc64f03-b953-4224-87cb-6f22f40d7267", 3, 0, 0.0, 353.3333333333333, 211, 539, 310.0, 539.0, 539.0, 539.0, 0.02760219713489194, 0.027683062946810565, 0.01770062771996651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 152.1764705882353, 106, 341, 115.0, 339.4, 341.0, 341.0, 0.10963851536551547, 0.029336868369288317, 0.06252821579439553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 126.88235294117646, 106, 331, 114.0, 168.59999999999985, 331.0, 331.0, 0.1096328589025106, 0.08147520080547907, 0.055030556128799264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 149.94117647058823, 103, 341, 114.0, 324.2, 341.0, 341.0, 0.10963356592846732, 0.029549672066657207, 0.06455960962389237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 184.58823529411765, 104, 443, 114.0, 362.19999999999993, 443.0, 443.0, 0.10940214943046528, 0.029487298088680097, 0.06431649800501964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e804d83-0b94-40fe-a785-5057f2cf1148", 3, 0, 0.0, 371.0, 327, 456, 330.0, 456.0, 456.0, 456.0, 0.0323589688275267, 0.032453770494013594, 0.02075103144213138], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 214.53333333333333, 114, 327, 217.0, 327.0, 327.0, 327.0, 0.08759226385125665, 0.15566445484034852, 0.05660992208668131], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5af3d42e-64e4-4c00-8485-a9ceea3bced3", 1, 0, 0.0, 885.0, 885, 885, 885.0, 885.0, 885.0, 885.0, 1.1299435028248588, 0.2041401836158192, 0.7790430790960452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a4e9565-5ace-4339-bbde-7293ec68756c", 3, 0, 0.0, 324.3333333333333, 223, 476, 274.0, 476.0, 476.0, 476.0, 0.018477116091720404, 0.025472196174621067, 0.01184893186871393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 128.2777777777778, 109, 346, 115.0, 149.8000000000003, 346.0, 346.0, 0.08935130949308023, 0.06640268215257232, 0.04485016902289379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 860.8571428571428, 552, 1047, 900.0, 1047.0, 1047.0, 1047.0, 0.029765574837033477, 8.752067312189853, 0.016975679399245654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 135.8888888888889, 104, 338, 113.0, 327.20000000000005, 338.0, 338.0, 0.08935175303175462, 0.03136424924671508, 0.050541524365726655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c64554f-da40-4301-bc66-42bc2b4cf2ad", 2, 0, 0.0, 284.0, 217, 351, 284.0, 351.0, 351.0, 351.0, 0.07269819344989277, 0.042774083548398824, 0.0451878907527898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1254.4285714285716, 989, 1595, 1239.0, 1595.0, 1595.0, 1595.0, 0.029715285118160708, 26.737865783220627, 0.016917979710827827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 142.57142857142858, 109, 317, 115.0, 317.0, 317.0, 317.0, 0.029883879781420764, 0.052880459144467214, 0.016547031089907786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 117.61538461538461, 104, 169, 115.0, 148.59999999999997, 169.0, 169.0, 0.06487252548741722, 0.04821092958586378, 0.032562966895051226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7b8760d-2abd-4584-94a7-9e2cdba0ee62", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/052c2b43-6041-43ef-b260-69c1c3b0af3f", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.47169266986706054, 0.881358474889217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 164.30769230769232, 102, 348, 113.0, 345.6, 348.0, 348.0, 0.06487187804086929, 0.017358295491404475, 0.036997242945183265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ceec0995-e9ed-4cbd-9c9e-de6fe9c059ff", 2, 0, 0.0, 347.5, 249, 446, 347.5, 446.0, 446.0, 446.0, 0.03636429753268241, 0.03213836842488045, 0.022603393925344096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 114.23076923076923, 105, 138, 113.0, 132.0, 138.0, 138.0, 0.06487349668147113, 0.017485434652427766, 0.03813852051000549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 129.30769230769232, 104, 326, 111.0, 249.19999999999993, 326.0, 326.0, 0.06487414416032897, 0.017485609168213664, 0.038202254813162466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 112.85714285714285, 109, 118, 112.0, 118.0, 118.0, 118.0, 0.0298842625204387, 0.022208909939505715, 0.016780713817629155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 762.2777777777777, 111, 1756, 673.0, 1567.0000000000002, 1756.0, 1756.0, 0.09094629621208676, 40.92907503353644, 0.04955862625619571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 175.16666666666669, 105, 1022, 113.0, 401.900000000001, 1022.0, 1022.0, 0.08935175303175462, 4.4893487203463875, 0.05210246536378574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 517.6111111111111, 109, 1029, 503.0, 1019.1, 1029.0, 1029.0, 0.09105026480452014, 13.39817094876905, 0.049704197290748785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 188.83333333333331, 104, 837, 113.5, 382.50000000000074, 837.0, 837.0, 0.08935175303175462, 1.4823219262996958, 0.052189722935105806], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 448.1333333333333, 117, 1179, 472.0, 1002.6000000000001, 1179.0, 1179.0, 0.08670119300841579, 0.017645047483353368, 0.05854023910744011], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 284.7692307692308, 210, 466, 229.0, 463.6, 466.0, 466.0, 0.06483499493788308, 0.10048157906876999, 0.14581542318549293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 727.5217391304346, 123, 2100, 703.0, 1435.0000000000005, 1986.1999999999985, 2100.0, 0.10193815456483489, 0.06261630783328236, 0.04609117730812358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 148.94444444444443, 108, 333, 113.5, 330.3, 333.0, 333.0, 0.09105026480452014, 0.06766528468382794, 0.045702964950706394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a714bb5-3f1e-4ddc-879c-586beb178a1c", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 186.0, 105, 345, 113.5, 343.2, 345.0, 345.0, 0.09094445819839028, 0.09263190420011823, 0.04804780457551674], "isController": false}, {"data": ["login", 23, 0, 0.0, 2972.6521739130435, 1676, 4997, 2732.0, 4256.200000000001, 4883.399999999999, 4997.0, 0.1018424629935485, 37.219325250787065, 0.20505568264338755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a4e9565-5ace-4339-bbde-7293ec68756c", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 132.0, 112, 326, 119.0, 158.60000000000025, 326.0, 326.0, 0.09195496250280974, 0.07444400772932547, 0.03268711557717065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe2f31b8-f08e-4918-b27a-bd207ab7c487", 1, 0, 0.0, 1179.0, 1179, 1179, 1179.0, 1179.0, 1179.0, 1179.0, 0.8481764206955047, 0.15323499787955894, 0.5847778837998303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 925.6666666666666, 229, 1866, 895.0, 1686.0000000000002, 1866.0, 1866.0, 0.09089302396041103, 54.44026130955387, 0.1927926250410281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16b55a72-5d6b-43e8-ad95-449318667339", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acbf938c-e9ed-42f1-87ca-4fce4199c97d", 3, 0, 0.0, 369.3333333333333, 216, 572, 320.0, 572.0, 572.0, 572.0, 0.09644131545954286, 0.043637183752853054, 0.06184550503102196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 790.7692307692308, 114, 1708, 1110.0, 1649.2, 1708.0, 1708.0, 0.05515907027265553, 35.539579019611175, 0.08384079236004448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 353.47058823529414, 216, 673, 241.0, 576.9999999999999, 673.0, 673.0, 0.109320540686533, 0.1694254863960233, 0.24586445820418504], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1053.4782608695652, 266, 1625, 1025.0, 1530.8000000000002, 1610.7999999999997, 1625.0, 0.0997770200508429, 0.031281993718385866, 0.04501658521825139], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 342.50000000000006, 216, 1368, 233.0, 543.6000000000013, 1368.0, 1368.0, 0.08930077493228024, 6.06597509469603, 0.19957017800621135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 164.9333333333333, 110, 349, 121.0, 345.4, 349.0, 349.0, 0.09485986036628555, 0.07364608299921584, 0.03371971598957807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c64554f-da40-4301-bc66-42bc2b4cf2ad", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 464.83333333333337, 224, 1675, 339.5, 1460.8000000000004, 1675.0, 1675.0, 0.08520024424070016, 11.442829156943583, 0.18919520381791763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acbf938c-e9ed-42f1-87ca-4fce4199c97d", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 154.45454545454547, 107, 339, 117.0, 335.40000000000003, 339.0, 339.0, 0.052566688011927855, 0.039065673415114355, 0.026386013318487226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 153.36363636363635, 108, 347, 113.0, 343.8, 347.0, 347.0, 0.052508723608399484, 0.02121978958322394, 0.029545480311615406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 252.54545454545456, 111, 989, 115.0, 859.2000000000005, 989.0, 989.0, 0.05234854613810498, 4.294946320432589, 0.03036624649026793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 223.36363636363635, 105, 908, 114.0, 793.2000000000004, 908.0, 908.0, 0.052368733009916735, 1.4126633101085937, 0.0304290977938481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 133.66666666666666, 117, 155, 129.0, 155.0, 155.0, 155.0, 0.03796603305575945, 0.011197013655116555, 0.02346923723075755], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1271.2321428571427, 851, 1842, 1202.5, 1738.8000000000002, 1792.8, 1842.0, 0.2541342191726116, 304.0328774800777, 0.5018158116865437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1053.4782608695652, 266, 1625, 1025.0, 1530.8000000000002, 1610.7999999999997, 1625.0, 0.10311034600245672, 0.03232705480987349, 0.04652048813782715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 144.0, 110, 331, 113.0, 331.0, 331.0, 331.0, 0.03451863759868632, 0.009303851540270922, 0.02032689303907017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 110.28571428571429, 107, 114, 109.0, 114.0, 114.0, 114.0, 0.03455595596583897, 0.009313910006417535, 0.02031512255022955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5af3d42e-64e4-4c00-8485-a9ceea3bced3", 3, 0, 0.0, 416.0, 225, 786, 237.0, 786.0, 786.0, 786.0, 0.019127041811713402, 0.02636817124759318, 0.012265713661808397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e804d83-0b94-40fe-a785-5057f2cf1148", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 338.8666666666667, 106, 1290, 115.0, 1266.0, 1290.0, 1290.0, 0.0901599437401951, 16.244655910209712, 0.051454561642353534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cc64f03-b953-4224-87cb-6f22f40d7267", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 270.66666666666663, 109, 879, 117.0, 760.8000000000001, 879.0, 879.0, 0.09016427931691542, 5.321700043729676, 0.051545087023556924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 196.14285714285717, 109, 473, 112.0, 473.0, 473.0, 473.0, 0.03451710569137763, 0.009236022421325653, 0.019685536839613802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.0, 108, 125, 116.0, 123.8, 125.0, 125.0, 0.09015940182242205, 0.06700322733092107, 0.045255793492895435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 113.14285714285714, 109, 116, 113.0, 116.0, 116.0, 116.0, 0.03455561479375234, 0.02568049107231009, 0.01734529883202022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 157.33333333333334, 106, 335, 114.0, 330.2, 335.0, 335.0, 0.09016156953260243, 0.05120895394547029, 0.04990583751081939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 123.0, 114, 130, 122.0, 130.0, 130.0, 130.0, 0.03701960452485338, 0.02913847778030451, 0.013159312545943973], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 416.84615384615375, 115, 786, 456.0, 700.3999999999999, 786.0, 786.0, 0.09006138029456999, 0.01807722416970335, 0.06128124870103778], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae0b660c-54c7-43c9-a551-bbc0552a7ae2", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fe6bbcc-68b3-42e1-8056-4119f8caca0b", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1555.7826086956522, 878, 2499, 1510.0, 2351.2000000000007, 2498.0, 2499.0, 0.10085286444059546, 0.052199236478042574, 0.0463883780776567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 311.5714285714286, 227, 583, 229.0, 583.0, 583.0, 583.0, 0.03449754328209627, 0.053464454285826926, 0.07758578337760517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ceec0995-e9ed-4cbd-9c9e-de6fe9c059ff", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01cb55c3-5267-4ad5-8ed2-137578743124", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.5764186597472923, 1.0770391471119132], "isController": false}, {"data": ["addBook", 61, 16, 26.229508196721312, 1185.9016393442614, 580, 3189, 937.0, 2200.8000000000006, 2448.5, 3189.0, 0.28045203350712167, 89.12918637876656, 1.0176578103017848], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 209.19642857142858, 105, 609, 117.0, 458.3, 466.75, 609.0, 0.2557895217649477, 0.1900935801397707, 0.12364825515004796], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 717.5714285714286, 511, 1133, 657.5, 919.8000000000001, 988.4, 1133.0, 0.2553532995294204, 75.08234858917302, 0.12842475513442528], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 168.875, 109, 464, 115.0, 335.3, 362.79999999999984, 464.0, 0.2562342713337909, 0.45341455044612217, 0.12461393273850377], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1060.3928571428567, 743, 1429, 1048.5, 1349.3, 1376.6999999999998, 1429.0, 0.25470174880040025, 229.18108128851796, 0.1278483387533259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 118.38888888888889, 114, 128, 117.5, 124.4, 128.0, 128.0, 0.08971291866028708, 0.06702185817882776, 0.03189013905502393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 16, 8.98876404494382, 188.37078651685383, 106, 2232, 120.5, 331.1, 397.2999999999999, 1700.3300000000054, 0.7687523753584632, 1.6721308908889887, 0.36920965885533635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 118.0, 115, 125, 117.0, 124.6, 125.0, 125.0, 0.05420748654668743, 0.04197903987453431, 0.019269067483392795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 122.17647058823529, 108, 148, 119.0, 143.2, 148.0, 148.0, 0.10212418300653595, 0.08287616804534313, 0.036301955678104576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7b8760d-2abd-4584-94a7-9e2cdba0ee62", 3, 0, 0.0, 332.0, 227, 486, 283.0, 486.0, 486.0, 486.0, 0.019958884697523105, 0.027514933819664824, 0.012799154574909022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a714bb5-3f1e-4ddc-879c-586beb178a1c", 3, 0, 0.0, 332.3333333333333, 202, 437, 358.0, 437.0, 437.0, 437.0, 0.09120204292576153, 0.0412665493707059, 0.05848568507934578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 429.4545454545455, 222, 1103, 239.0, 1016.6000000000004, 1103.0, 1103.0, 0.0523194147835641, 5.763914363225158, 0.11645064346934796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 487.2, 219, 1409, 242.0, 1383.2, 1409.0, 1409.0, 0.09009604238117833, 21.668942843070713, 0.19801772752253902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 137.07692307692304, 110, 346, 120.0, 258.3999999999999, 346.0, 346.0, 0.06869910321247576, 0.05695853381581242, 0.02442038434505974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e13616cd-e2d1-43f1-aa8c-d084fdaca653", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 131.83333333333331, 111, 329, 117.0, 171.50000000000026, 329.0, 329.0, 0.08751075653049022, 0.06794047992357394, 0.03110733923544769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe2f31b8-f08e-4918-b27a-bd207ab7c487", 3, 0, 0.0, 340.6666666666667, 223, 472, 327.0, 472.0, 472.0, 472.0, 0.040214477211796246, 0.03313243548927614, 0.02578858076407507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 125.61111111111111, 109, 326, 113.0, 141.50000000000028, 326.0, 326.0, 0.0857383741146322, 0.06371767841917492, 0.04303664481925874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 150.5, 103, 343, 112.5, 342.1, 343.0, 343.0, 0.08573469873779471, 0.0372484520123839, 0.04809552869730888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 309.44444444444446, 108, 1348, 114.5, 1327.3, 1348.0, 1348.0, 0.0852462432454192, 8.543170192348676, 0.04930148399501783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 286.44444444444446, 107, 1027, 117.0, 980.2, 1027.0, 1027.0, 0.08538777911130296, 2.8101066220594584, 0.04946672663576894], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.0, 0.523168908819133], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.2242152466367713], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.2242152466367713], "isController": false}, {"data": ["401/Unauthorized", 22, 62.857142857142854, 1.6442451420029895], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 35, "401/Unauthorized", 22, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
