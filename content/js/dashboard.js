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

    var data = {"OkPercent": 98.54604200323102, "KoPercent": 1.4539579967689822};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7636300897170463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1404fcf5-15ba-4f8d-a56d-58f88db845cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7715cf02-467c-40bb-955e-c2d19b49415b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5235135f-99d4-4118-9173-2adf7a44ee7c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25b722bb-8f1a-4e70-a8ce-d7e051670bbf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc68e81a-1fbb-4a75-bd84-11ff7fab9887"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3bc097c-f1d5-4178-b048-ce4ef57179d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f8779334-3ffc-47d9-be0c-d0e7a80f78cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/87997189-e19b-40de-ab74-db1cb4293dde"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42e86a51-99f7-4ce7-8db5-11faa785c916"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/794b330a-abf5-4491-bca7-443ab861fdc6"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3bc097c-f1d5-4178-b048-ce4ef57179d1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2ce2c42-3f80-4290-bf45-46fe75d9420c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7715cf02-467c-40bb-955e-c2d19b49415b"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25b722bb-8f1a-4e70-a8ce-d7e051670bbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13823d73-9e24-4ba5-b9c4-552a0c127a1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59c33794-44e3-4beb-82c8-b07d792d5efb"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc68e81a-1fbb-4a75-bd84-11ff7fab9887"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4777a471-ff53-4ebd-92ad-87d863bd3e8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8779334-3ffc-47d9-be0c-d0e7a80f78cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5235135f-99d4-4118-9173-2adf7a44ee7c"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.99, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13823d73-9e24-4ba5-b9c4-552a0c127a1e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59c33794-44e3-4beb-82c8-b07d792d5efb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=794b330a-abf5-4491-bca7-443ab861fdc6"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42e86a51-99f7-4ce7-8db5-11faa785c916"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2ce2c42-3f80-4290-bf45-46fe75d9420c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/422fafcf-def3-4322-8f6b-cc65196744b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08682c6f-daf5-4603-a38f-f34cbef80218"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1404fcf5-15ba-4f8d-a56d-58f88db845cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/510d0f08-c3ea-4e60-9110-c9c5036f22a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1238, 18, 1.4539579967689822, 401.6324717285944, 125, 1886, 152.0, 1041.0, 1215.05, 1614.8799999999992, 4.829787068030555, 665.8519768892933, 3.515832255604191], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 50, 0, 0.0, 1927.3200000000004, 1539, 2454, 1862.0, 2289.7, 2367.7, 2454.0, 0.23651956726379975, 284.6124536347736, 1.162964864426984], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1404fcf5-15ba-4f8d-a56d-58f88db845cf", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7715cf02-467c-40bb-955e-c2d19b49415b", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5235135f-99d4-4118-9173-2adf7a44ee7c", 3, 0, 0.0, 349.3333333333333, 246, 430, 372.0, 430.0, 430.0, 430.0, 0.02393909893231619, 0.032807163575863, 0.01535157060438245], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 466.57142857142856, 135, 874, 457.5, 745.0, 874.0, 874.0, 0.08794522268986746, 0.017324031032100007, 0.05917408050128777], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 466.57142857142856, 135, 874, 457.5, 745.0, 874.0, 874.0, 0.08536949747855091, 0.016816647661790442, 0.05744099976828279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 213.80000000000004, 126, 546, 136.0, 468.6, 546.0, 546.0, 0.0938021774612128, 0.043884273908611666, 0.05244616536698538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 135.2, 127, 144, 136.0, 142.2, 144.0, 144.0, 0.09379396592152572, 0.06970430475222761, 0.04708017430045333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 242.40000000000006, 128, 926, 136.0, 780.2, 926.0, 926.0, 0.0937992446034168, 3.699256562820481, 0.05416051434815779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 350.8666666666667, 125, 1213, 136.0, 1184.8, 1213.0, 1213.0, 0.09380159087498124, 11.275622979357395, 0.054070265990044525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25b722bb-8f1a-4e70-a8ce-d7e051670bbf", 3, 0, 0.0, 291.3333333333333, 218, 435, 221.0, 435.0, 435.0, 435.0, 0.03280481137233461, 0.027348021459814104, 0.021036939584472388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc68e81a-1fbb-4a75-bd84-11ff7fab9887", 3, 0, 0.0, 562.0, 265, 850, 571.0, 850.0, 850.0, 850.0, 0.051834061889869894, 0.033324307367348, 0.03323994203224079], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 228.71428571428572, 132, 372, 230.5, 318.5, 372.0, 372.0, 0.08855491036978, 0.1816005726814427, 0.05723701168292282], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3bc097c-f1d5-4178-b048-ce4ef57179d1", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 136.5625, 129, 145, 137.0, 143.6, 145.0, 145.0, 0.08368463445505613, 0.06219141291044698, 0.042005763779198096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 150.31249999999997, 127, 389, 136.0, 218.90000000000018, 389.0, 389.0, 0.08368726070673892, 0.03024877672761889, 0.0472886144789422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 853.0, 663, 912, 901.0, 912.0, 912.0, 912.0, 0.04124357631298925, 12.126980851638608, 0.023521727116001683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1074.0, 901, 1206, 1176.0, 1206.0, 1206.0, 1206.0, 0.0411603938226481, 37.03619471387352, 0.023434091404886562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 190.6, 125, 428, 133.0, 428.0, 428.0, 428.0, 0.041323680121656915, 0.07312354334027571, 0.022881373661112765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 134.3333333333333, 127, 146, 133.5, 143.60000000000002, 146.0, 146.0, 0.1314290721107509, 0.09767336316043108, 0.06597123346184176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 175.33333333333331, 125, 401, 131.5, 397.7, 401.0, 401.0, 0.13143770947884947, 0.03516985585664527, 0.07496056868715634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 176.41666666666669, 125, 406, 132.0, 403.90000000000003, 406.0, 406.0, 0.131436269838662, 0.03542618210495186, 0.07727015082311964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 201.33333333333331, 128, 411, 136.0, 409.5, 411.0, 411.0, 0.13143051159326638, 0.03542463007787258, 0.07739511571361292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8779334-3ffc-47d9-be0c-d0e7a80f78cc", 3, 0, 0.0, 558.6666666666666, 241, 862, 573.0, 862.0, 862.0, 862.0, 0.016131634134537828, 0.02223875994784105, 0.010344830483411303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 133.0, 126, 140, 131.0, 140.0, 140.0, 140.0, 0.041423304751253054, 0.030784311441116773, 0.0232601564765337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 749.875, 126, 1235, 932.0, 1224.5, 1235.0, 1235.0, 0.10243409006517369, 57.61683738348122, 0.05471821022036134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 199.9375, 128, 946, 136.0, 547.7000000000004, 946.0, 946.0, 0.08368594756029311, 4.727443899359803, 0.04874869894503402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 578.8750000000001, 126, 950, 676.0, 923.4, 950.0, 950.0, 0.10242818823740293, 18.833658022687846, 0.05481508511142267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 240.31249999999997, 128, 894, 136.5, 656.0000000000002, 894.0, 894.0, 0.08350382029977871, 1.5556561932434971, 0.04872415295812283], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 426.4285714285714, 149, 758, 434.0, 666.0, 758.0, 758.0, 0.08537886872998933, 0.01681849367281598, 0.05799521649641714], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87997189-e19b-40de-ab74-db1cb4293dde", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.6212761429961089, 1.160855423151751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 404.16666666666663, 264, 545, 403.0, 543.5, 545.0, 545.0, 0.13123216062816462, 0.20338421769228246, 0.2951442050065069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42e86a51-99f7-4ce7-8db5-11faa785c916", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 489.27272727272725, 180, 1171, 479.0, 754.6, 1109.7999999999993, 1171.0, 0.09256259545517656, 0.0568572974036192, 0.04185203290600269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 162.25, 132, 544, 138.0, 261.9000000000003, 544.0, 544.0, 0.10242884396245983, 0.07612143579632025, 0.0514144783170941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/794b330a-abf5-4491-bca7-443ab861fdc6", 3, 0, 0.0, 423.3333333333333, 231, 555, 484.0, 555.0, 555.0, 555.0, 0.03873066694208474, 0.032288163424049166, 0.024837048787730125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 289.43749999999994, 127, 523, 383.0, 443.9000000000001, 523.0, 523.0, 0.1024268768124756, 0.12355742146739304, 0.05303891741192889], "isController": false}, {"data": ["login", 22, 0, 0.0, 2278.181818181818, 1398, 3769, 2361.5, 2801.3, 3625.599999999998, 3769.0, 0.08994827973914998, 24.580687216356274, 0.1696112803319909], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 141.43749999999997, 131, 157, 139.5, 152.8, 157.0, 157.0, 0.08785078544092859, 0.071121387822783, 0.03122820888720508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3bc097c-f1d5-4178-b048-ce4ef57179d1", 3, 0, 0.0, 501.33333333333337, 240, 992, 272.0, 992.0, 992.0, 992.0, 0.020269859394741997, 0.023958287585386786, 0.012998575197800045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2ce2c42-3f80-4290-bf45-46fe75d9420c", 3, 0, 0.0, 552.3333333333333, 232, 1113, 312.0, 1113.0, 1113.0, 1113.0, 0.017118304603112106, 0.023598964841855394, 0.010977558615928012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7715cf02-467c-40bb-955e-c2d19b49415b", 3, 0, 0.0, 535.3333333333334, 221, 973, 412.0, 973.0, 973.0, 973.0, 0.05408231328081339, 0.03476971638333544, 0.034681691784896614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 932.1875, 266, 1374, 1070.0, 1362.8, 1374.0, 1374.0, 0.10233843319858772, 76.57969215719824, 0.21379638009773322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25b722bb-8f1a-4e70-a8ce-d7e051670bbf", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13823d73-9e24-4ba5-b9c4-552a0c127a1e", 3, 0, 0.0, 344.6666666666667, 220, 490, 324.0, 490.0, 490.0, 490.0, 0.03495159204501765, 0.029137704175550196, 0.022413618596577076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59c33794-44e3-4beb-82c8-b07d792d5efb", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 535.2666666666667, 256, 1341, 516.0, 1320.6, 1341.0, 1341.0, 0.09371368594669566, 15.074425993911733, 0.2075672727599305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 731.3333333333334, 132, 1333, 1032.0, 1333.0, 1333.0, 1333.0, 0.0740052461496715, 49.19546918298208, 0.11450095538717078], "isController": false}, {"data": ["register", 24, 6, 25.0, 1062.8749999999998, 183, 1777, 1124.0, 1666.0, 1763.25, 1777.0, 0.09922357552154393, 0.03129806141939325, 0.044766886612259076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 168.58823529411765, 130, 395, 139.0, 393.4, 395.0, 395.0, 0.0896562999372406, 0.0696062094239319, 0.03187001286831599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 398.125, 262, 1082, 277.0, 809.0000000000002, 1082.0, 1082.0, 0.08344241690960578, 6.36037072716155, 0.1863296060214134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc68e81a-1fbb-4a75-bd84-11ff7fab9887", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 571.2666666666668, 273, 1609, 526.0, 1267.0000000000002, 1609.0, 1609.0, 0.13254630284179272, 21.32089259717853, 0.29357797975134314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4777a471-ff53-4ebd-92ad-87d863bd3e8e", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.486792587652439, 0.9095726943597561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 137.375, 132, 143, 138.0, 143.0, 143.0, 143.0, 0.0465013543519455, 0.03455813541194387, 0.023341500133691392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 166.375, 131, 389, 136.0, 389.0, 389.0, 389.0, 0.04650243556506272, 0.021173594318564935, 0.02603273553483614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 267.25, 127, 1210, 133.0, 1210.0, 1210.0, 1210.0, 0.04621258946468492, 5.208669924052497, 0.026671523802371862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 262.625, 127, 912, 136.5, 912.0, 912.0, 912.0, 0.046292277869397915, 1.7123509063160027, 0.026762723143245667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 153.5, 149, 158, 153.5, 158.0, 158.0, 158.0, 0.04467875971763024, 0.013176743588597979, 0.027618803614511658], "isController": false}, {"data": ["https://demoqa.com/books", 50, 0, 0.0, 1251.0200000000002, 1008, 1886, 1087.0, 1732.7, 1795.6499999999999, 1886.0, 0.2337551835211946, 279.65246594186976, 0.46157517683579635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1062.8749999999998, 183, 1777, 1124.0, 1666.0, 1763.25, 1777.0, 0.09487853570793224, 0.029927506868810655, 0.042806526852602236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 185.70000000000002, 127, 409, 132.5, 407.8, 409.0, 409.0, 0.054481364649221736, 0.014684430315610545, 0.032082287972149126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 235.9, 127, 408, 136.0, 406.2, 408.0, 408.0, 0.054403412182012056, 0.014663419689682936, 0.031983255989815676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 150.4705882352941, 126, 408, 134.0, 195.19999999999982, 408.0, 408.0, 0.08987148377819719, 0.024223173362092208, 0.0528346027680417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 176.9411764705882, 127, 392, 134.0, 387.2, 392.0, 392.0, 0.09000375898052214, 0.024258825662718853, 0.05300026041528793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 136.11764705882354, 127, 151, 137.0, 143.0, 151.0, 151.0, 0.09000090000900009, 0.0668854344793448, 0.045176233012330126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 159.1, 127, 410, 132.0, 382.7000000000001, 410.0, 410.0, 0.054481364649221736, 0.014578021400280033, 0.031071403276509268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 149.1764705882353, 126, 409, 133.0, 193.7999999999998, 409.0, 409.0, 0.08987100866990907, 0.024047515991753015, 0.051254559632057516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 184.9, 128, 398, 135.0, 396.3, 398.0, 398.0, 0.05447661591261951, 0.04048506319287446, 0.02734470759676409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 138.29999999999998, 134, 149, 138.0, 148.1, 149.0, 149.0, 0.05361412839511468, 0.04220018309224847, 0.01905814720295092], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 626.0, 133, 1178, 532.0, 1145.5, 1178.0, 1178.0, 0.08746774626856348, 0.016888303688015045, 0.05952394898131314], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1210.8636363636365, 780, 1779, 1180.5, 1597.8999999999999, 1755.7499999999995, 1779.0, 0.09090007602551813, 0.04704789091164513, 0.04181048418751859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 427.5, 261, 807, 278.0, 805.3, 807.0, 807.0, 0.0543608254147731, 0.08424866204418448, 0.12225877043967036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8779334-3ffc-47d9-be0c-d0e7a80f78cc", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5235135f-99d4-4118-9173-2adf7a44ee7c", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1264.406779661017, 692, 2409, 1102.0, 1971.0, 2133.0, 2409.0, 0.2720373290545089, 89.29742397363543, 0.9889090035134313], "isController": true}, {"data": ["https://demoqa.com/books-0", 50, 0, 0.0, 237.6, 128, 618, 139.0, 535.8, 554.25, 618.0, 0.23479690068091102, 0.17449261857243487, 0.11350045491899508], "isController": false}, {"data": ["https://demoqa.com/books-3", 50, 0, 0.0, 766.4599999999998, 623, 1215, 681.0, 955.9, 1066.6, 1215.0, 0.2343621833180998, 68.91026345238932, 0.11786769961798964], "isController": false}, {"data": ["https://demoqa.com/books-1", 50, 0, 0.0, 231.11999999999995, 128, 532, 138.0, 406.8, 408.9, 532.0, 0.23497455225599068, 0.4157948131717335, 0.11427473342137047], "isController": false}, {"data": ["https://demoqa.com/books-2", 50, 0, 0.0, 1000.1799999999997, 875, 1371, 936.0, 1215.7, 1234.8999999999999, 1371.0, 0.23436987315902463, 210.88642384678303, 0.11764269023802605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 139.46666666666667, 130, 158, 139.0, 150.20000000000002, 158.0, 158.0, 0.1210575588339736, 0.09043850830858378, 0.043032179116764054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 4, 2.380952380952381, 212.3630952380953, 128, 1003, 144.0, 367.4999999999999, 402.54999999999995, 969.19, 0.7006451774342207, 1.4377700729108889, 0.3411466587461788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 150.50000000000003, 138, 171, 146.0, 171.0, 171.0, 171.0, 0.04694229618241776, 0.03635277428970438, 0.016686519346093814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 156.93333333333337, 129, 416, 139.0, 256.4000000000001, 416.0, 416.0, 0.09864137940104954, 0.08004979129128141, 0.03506392783396683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13823d73-9e24-4ba5-b9c4-552a0c127a1e", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59c33794-44e3-4beb-82c8-b07d792d5efb", 3, 0, 0.0, 396.0, 231, 666, 291.0, 666.0, 666.0, 666.0, 0.054257397091803515, 0.024550059230991825, 0.03479396883816827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=794b330a-abf5-4491-bca7-443ab861fdc6", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 441.0, 271, 1342, 278.0, 1342.0, 1342.0, 1342.0, 0.046176579239009974, 6.968024387366666, 0.10237537013414297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42e86a51-99f7-4ce7-8db5-11faa785c916", 3, 0, 0.0, 559.6666666666667, 230, 1178, 271.0, 1178.0, 1178.0, 1178.0, 0.018937720150996755, 0.026107176054515385, 0.01214430621662227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 332.23529411764713, 260, 540, 277.0, 532.8, 540.0, 540.0, 0.08980644070661821, 0.1391824427748077, 0.2019767899876384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2ce2c42-3f80-4290-bf45-46fe75d9420c", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/422fafcf-def3-4322-8f6b-cc65196744b3", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08682c6f-daf5-4603-a38f-f34cbef80218", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 161.75, 137, 390, 140.0, 317.40000000000026, 390.0, 390.0, 0.14846340377097045, 0.12309124004057999, 0.05277410055921215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 153.1875, 129, 399, 135.5, 228.20000000000016, 399.0, 399.0, 0.09980537950995559, 0.07748562178751434, 0.03547769349767952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1404fcf5-15ba-4f8d-a56d-58f88db845cf", 3, 0, 0.0, 330.3333333333333, 228, 509, 254.0, 509.0, 509.0, 509.0, 0.061878635369827975, 0.028723611340291243, 0.03968128635369828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/510d0f08-c3ea-4e60-9110-c9c5036f22a6", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 151.86666666666667, 128, 392, 134.0, 245.00000000000009, 392.0, 392.0, 0.13300938159504852, 0.09884779237678898, 0.06676447474595208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 255.6, 128, 410, 137.0, 409.4, 410.0, 410.0, 0.13301527902171698, 0.06222967415690482, 0.07437078230719435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 361.7333333333333, 127, 1216, 380.0, 1016.2000000000002, 1216.0, 1216.0, 0.13301527902171698, 15.989389121788788, 0.07667430211316939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 290.26666666666665, 126, 909, 145.0, 752.4000000000001, 909.0, 909.0, 0.13270460838870066, 5.233607110312917, 0.07662481587235585], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.48465266558966075], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.16155088852988692], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.16155088852988692], "isController": false}, {"data": ["401/Unauthorized", 8, 44.44444444444444, 0.6462035541195477], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1238, 18, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
