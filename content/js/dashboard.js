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

    var data = {"OkPercent": 97.4006116207951, "KoPercent": 2.599388379204893};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7936351706036745, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0fce472-3ba3-4ba1-b35d-659b48f064f0"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acc31bff-bba5-4838-961c-cdbf755b0b5d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7028b6b-a0e5-417f-a29c-af8cf346e616"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21ef253e-e39f-4996-a1a4-224f7d044dd2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/d36542cb-dd77-428a-8742-4fb2a3a5f0d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2658dd12-cdf7-4653-80d7-f59ef63c5df1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9659cdad-6dda-4d55-a723-1ea37e3b9cc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d839b304-bc48-407b-8dc6-d5f8aec08e90"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7dfe6aa-58fb-48d2-a810-de77855d2266"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7caec5f6-0cce-4363-8d56-91657f3d2353"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7028b6b-a0e5-417f-a29c-af8cf346e616"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0cfd309-c902-4ecf-8588-5619dae7e7a0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dbba8034-ad6f-4169-b51b-f976137977d7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e48855c-cb76-4e22-8ed3-4d25cb52bb9d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2658dd12-cdf7-4653-80d7-f59ef63c5df1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0fce472-3ba3-4ba1-b35d-659b48f064f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e48855c-cb76-4e22-8ed3-4d25cb52bb9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d36542cb-dd77-428a-8742-4fb2a3a5f0d9"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9659cdad-6dda-4d55-a723-1ea37e3b9cc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7dfe6aa-58fb-48d2-a810-de77855d2266"], "isController": false}, {"data": [0.3050847457627119, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8815028901734104, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d839b304-bc48-407b-8dc6-d5f8aec08e90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21ef253e-e39f-4996-a1a4-224f7d044dd2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbba8034-ad6f-4169-b51b-f976137977d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acc31bff-bba5-4838-961c-cdbf755b0b5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0cfd309-c902-4ecf-8588-5619dae7e7a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7caec5f6-0cce-4363-8d56-91657f3d2353"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 34, 2.599388379204893, 319.41284403669704, 81, 2320, 108.0, 918.0, 1075.7499999999998, 1430.2800000000007, 5.07738351713617, 709.1877331197862, 3.723494944451561], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1482.4, 1022, 2083, 1463.0, 1788.6, 1845.599999999999, 2083.0, 0.24389919424575285, 293.4923970662253, 1.1992504326439117], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e0fce472-3ba3-4ba1-b35d-659b48f064f0", 3, 0, 0.0, 396.0, 185, 796, 207.0, 796.0, 796.0, 796.0, 0.026404499326685267, 0.026481856258306416, 0.016932572810406894], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 564.8000000000001, 102, 1277, 502.0, 1149.2, 1277.0, 1277.0, 0.08829814161844607, 0.01729746797720731, 0.05945178259231571], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 564.8000000000001, 102, 1277, 502.0, 1149.2, 1277.0, 1277.0, 0.0871571094054142, 0.017073941549537196, 0.05868351728325479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 122.73333333333333, 83, 260, 89.0, 258.8, 260.0, 260.0, 0.10911074740861976, 0.040120931078377886, 0.061616316603018736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 91.73333333333332, 84, 115, 87.0, 109.0, 115.0, 115.0, 0.10910360478310203, 0.08108187816400453, 0.05476489536964301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 158.60000000000002, 85, 747, 91.0, 473.40000000000015, 747.0, 747.0, 0.10911074740861976, 2.1662603427895983, 0.06362662529550828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 166.53333333333333, 84, 1071, 87.0, 580.8000000000003, 1071.0, 1071.0, 0.10910916007768573, 6.572555375171847, 0.06351914774835063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acc31bff-bba5-4838-961c-cdbf755b0b5d", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 213.26666666666665, 97, 507, 185.0, 432.6, 507.0, 507.0, 0.08866715532121155, 0.16413237156562552, 0.05731038528834559], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7028b6b-a0e5-417f-a29c-af8cf346e616", 3, 0, 0.0, 670.3333333333334, 174, 996, 841.0, 996.0, 996.0, 996.0, 0.03599409696809723, 0.03000679763518783, 0.02308215202706756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21ef253e-e39f-4996-a1a4-224f7d044dd2", 3, 0, 0.0, 281.3333333333333, 198, 390, 256.0, 390.0, 390.0, 390.0, 0.020718088963474008, 0.024488079761189496, 0.013286014081394466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 102.13333333333334, 85, 257, 87.0, 166.40000000000006, 257.0, 257.0, 0.08952765210748093, 0.06653373364628222, 0.044938684749262894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d36542cb-dd77-428a-8742-4fb2a3a5f0d9", 2, 0, 0.0, 379.5, 252, 507, 379.5, 507.0, 507.0, 507.0, 0.031236821965733207, 0.035965051853124465, 0.019416247247255065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 114.73333333333333, 84, 265, 86.0, 259.0, 265.0, 265.0, 0.08953566802561914, 0.023957786170917622, 0.051063310670860916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 564.75, 423, 711, 517.5, 711.0, 711.0, 711.0, 0.06505545977946199, 19.128465219724816, 0.03710194190547442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 894.1250000000001, 741, 1140, 879.0, 1140.0, 1140.0, 1140.0, 0.06482929635902464, 58.33351482159788, 0.036909648220030636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 201.75, 83, 294, 252.0, 294.0, 294.0, 294.0, 0.06538725602380095, 0.11570479288586655, 0.03620563883349135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 104.2, 85, 300, 88.0, 181.20000000000007, 300.0, 300.0, 0.0704926969565953, 0.05238763904684474, 0.035384029527041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 170.0, 83, 299, 98.0, 293.0, 299.0, 299.0, 0.07048971555050118, 0.01886150591878645, 0.040201165899895204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 133.53333333333336, 83, 296, 85.0, 272.0, 296.0, 296.0, 0.07049302823950712, 0.01900007401767965, 0.041442190429866486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2658dd12-cdf7-4653-80d7-f59ef63c5df1", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 133.46666666666667, 82, 266, 91.0, 260.0, 266.0, 266.0, 0.07049335952553269, 0.019000163309616232, 0.04151122636122677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9659cdad-6dda-4d55-a723-1ea37e3b9cc4", 3, 0, 0.0, 349.0, 261, 403, 383.0, 403.0, 403.0, 403.0, 0.03145445395067942, 0.026222284038961582, 0.02017098772227814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 129.875, 84, 258, 87.5, 258.0, 258.0, 258.0, 0.06538885937308431, 0.04859465037394254, 0.036717377089378396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 564.3333333333335, 85, 1398, 749.5, 1095.6000000000004, 1398.0, 1398.0, 0.08076855769791663, 40.38505884045517, 0.043626940128063035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 151.66666666666666, 85, 299, 92.0, 294.8, 299.0, 299.0, 0.0895292551762831, 0.024130932059232554, 0.05263340978136956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 420.50000000000006, 82, 867, 504.0, 802.2, 867.0, 867.0, 0.08084328529146251, 13.215578865993272, 0.04374625257687972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 115.46666666666665, 84, 290, 87.0, 267.8, 290.0, 290.0, 0.08953085830249494, 0.024131364151844338, 0.05272178472305122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d839b304-bc48-407b-8dc6-d5f8aec08e90", 3, 0, 0.0, 576.0, 198, 1085, 445.0, 1085.0, 1085.0, 1085.0, 0.028662876797401232, 0.028746850069268616, 0.018380816175416804], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 418.93333333333334, 99, 1153, 418.0, 893.8000000000002, 1153.0, 1153.0, 0.08715153909618044, 0.01707285033466191, 0.059258507442741436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f7dfe6aa-58fb-48d2-a810-de77855d2266", 3, 0, 0.0, 290.3333333333333, 179, 490, 202.0, 490.0, 490.0, 490.0, 0.025325004220834037, 0.025399198569137263, 0.01624031846192808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 289.8, 171, 554, 336.0, 462.20000000000005, 554.0, 554.0, 0.07046090828808178, 0.10920064595037673, 0.1584682341674339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7caec5f6-0cce-4363-8d56-91657f3d2353", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 638.9047619047618, 144, 1673, 669.0, 1152.4, 1625.1999999999994, 1673.0, 0.09500413946607673, 0.05835703488687721, 0.04295597321561868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 108.16666666666669, 85, 256, 88.0, 248.8, 256.0, 256.0, 0.08083929148852083, 0.060076856272230805, 0.04057753498544893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 182.16666666666669, 84, 281, 250.0, 261.20000000000005, 281.0, 281.0, 0.08078305710015753, 0.08902264842764755, 0.042302412496241344], "isController": false}, {"data": ["login", 21, 0, 0.0, 2576.6190476190473, 1560, 3230, 2675.0, 3040.8, 3212.2, 3230.0, 0.09297424613382094, 42.496762158042934, 0.19901002489274758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 94.66666666666666, 86, 112, 90.0, 108.4, 112.0, 112.0, 0.0948532620036803, 0.07679038496196383, 0.03371737047787073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7028b6b-a0e5-417f-a29c-af8cf346e616", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0cfd309-c902-4ecf-8588-5619dae7e7a0", 3, 0, 0.0, 312.6666666666667, 185, 486, 267.0, 486.0, 486.0, 486.0, 0.025287646984448096, 0.02552636500611118, 0.016216362161250896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbba8034-ad6f-4169-b51b-f976137977d7", 3, 0, 0.0, 509.6666666666667, 185, 824, 520.0, 824.0, 824.0, 824.0, 0.0749175906502847, 0.03389825879033064, 0.048042855983418245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e48855c-cb76-4e22-8ed3-4d25cb52bb9d", 3, 0, 0.0, 500.0, 179, 892, 429.0, 892.0, 892.0, 892.0, 0.020035529672619446, 0.02368131778687539, 0.012848305161152443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 685.888888888889, 173, 1491, 837.0, 1194.9000000000005, 1491.0, 1491.0, 0.08073486669776454, 53.71503731744949, 0.1700986226856005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 297.20000000000005, 170, 1156, 199.0, 689.2000000000003, 1156.0, 1156.0, 0.10903381502049836, 8.853872313225075, 0.24335978387680632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 715.9166666666667, 97, 1227, 929.5, 1212.0, 1227.0, 1227.0, 0.08625460923068076, 68.80135967812656, 0.14871339120778018], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 1019.4999999999999, 134, 2078, 1067.0, 1727.0, 2029.8499999999995, 2078.0, 0.09261052223915404, 0.02869413375485153, 0.04178326296336833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 101.47619047619047, 86, 249, 92.0, 111.4, 235.3999999999998, 249.0, 0.09548579535120584, 0.07413203838301625, 0.033942216316248955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 281.59999999999997, 171, 513, 249.0, 446.40000000000003, 513.0, 513.0, 0.08947424931104828, 0.13866761099280628, 0.20122968375326583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2658dd12-cdf7-4653-80d7-f59ef63c5df1", 3, 0, 0.0, 335.0, 181, 457, 367.0, 457.0, 457.0, 457.0, 0.10598834128245893, 0.04795696431725843, 0.06796778396043102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 340.4736842105263, 172, 1111, 341.0, 544.0, 1111.0, 1111.0, 0.1192171823332685, 7.681628259648749, 0.26651682491701856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 94.66666666666667, 86, 100, 98.0, 100.0, 100.0, 100.0, 0.7915567282321899, 0.5882565138522428, 0.39732437335092347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 85.66666666666667, 84, 87, 86.0, 87.0, 87.0, 87.0, 0.7940709370037057, 0.21247601244044467, 0.4528685812599259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 93.33333333333333, 85, 99, 96.0, 99.0, 99.0, 99.0, 0.7915567282321899, 0.21334927440633245, 0.4653487796833773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 102.5, 99, 106, 102.5, 106.0, 106.0, 106.0, 0.03400435255712731, 0.010028627414309032, 0.021020268719396083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 89.33333333333333, 84, 98, 86.0, 98.0, 98.0, 98.0, 0.7917656373713381, 0.21340558194774345, 0.4662448040380047], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1009.6909090909091, 664, 1673, 964.0, 1381.6, 1477.599999999999, 1673.0, 0.2448994131319518, 292.984838917411, 0.48358067710235014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 1019.4999999999999, 134, 2078, 1067.0, 1727.0, 2029.8499999999995, 2078.0, 0.09015211119853134, 0.027932427919289272, 0.04067409704464988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 148.75, 83, 256, 87.5, 256.0, 256.0, 256.0, 0.050124371095781405, 0.013510084396909832, 0.02951659743237909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0fce472-3ba3-4ba1-b35d-659b48f064f0", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 109.125, 86, 254, 86.5, 254.0, 254.0, 254.0, 0.050124057041176916, 0.013509999749379714, 0.029467463221473145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 129.7142857142857, 81, 839, 85.0, 224.0000000000001, 780.5999999999992, 839.0, 0.09681523964076937, 4.173162736332916, 0.056520578424954365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 131.0952380952381, 82, 504, 87.0, 255.4, 479.19999999999965, 504.0, 0.09681479330041631, 1.3804121918638692, 0.0566148635487693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 95.76190476190477, 83, 252, 87.0, 98.8, 236.6999999999998, 252.0, 0.09681077642242691, 0.07194628989987, 0.0485944717589135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 132.25, 83, 295, 85.0, 295.0, 295.0, 295.0, 0.050124371095781405, 0.013412185234613384, 0.02858655539056283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e48855c-cb76-4e22-8ed3-4d25cb52bb9d", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 113.66666666666667, 83, 301, 86.0, 260.4, 297.09999999999997, 301.0, 0.09681434696417869, 0.03282971624175925, 0.05482724689963579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 112.625, 86, 293, 86.5, 293.0, 293.0, 293.0, 0.050123742990507814, 0.03725016446853169, 0.025159769430782245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 185.0, 88, 301, 181.5, 301.0, 301.0, 301.0, 0.052356706239610466, 0.04121045432531839, 0.018611172921111533], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 476.8571428571429, 98, 841, 469.5, 818.5, 841.0, 841.0, 0.08398572242718738, 0.016215993281142208, 0.05715434626113561], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d36542cb-dd77-428a-8742-4fb2a3a5f0d9", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1246.238095238095, 713, 2205, 1200.0, 1584.8, 2144.199999999999, 2205.0, 0.09449541697227684, 0.04890876073760422, 0.043464200580021865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 268.375, 172, 589, 177.5, 589.0, 589.0, 589.0, 0.05009643563860432, 0.07763969077975101, 0.11266805788643137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9659cdad-6dda-4d55-a723-1ea37e3b9cc4", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7dfe6aa-58fb-48d2-a810-de77855d2266", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["addBook", 59, 17, 28.8135593220339, 947.5593220338984, 443, 3702, 737.0, 1505.0, 2270.0, 3702.0, 0.26916795167750945, 72.04461376822587, 0.9794227659060011], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 149.89090909090908, 85, 366, 90.0, 348.4, 353.0, 366.0, 0.24563111565652734, 0.18254421778771218, 0.11873769750974708], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 530.3272727272727, 418, 773, 502.0, 674.4, 678.5999999999999, 773.0, 0.2455938235386051, 72.21273860277208, 0.12351642492420081], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 130.14545454545456, 84, 346, 90.0, 265.8, 288.79999999999995, 346.0, 0.24596945506585274, 0.43525063728449725, 0.11962186388944791], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 857.981818181818, 577, 1323, 857.0, 1069.4, 1117.999999999999, 1323.0, 0.24533090678763708, 220.74918117325043, 0.12314461532113816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 98.47368421052632, 87, 144, 99.0, 116.0, 144.0, 144.0, 0.11777102832703155, 0.08798323893572181, 0.04186392022562449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, 9.826589595375722, 171.42774566473975, 85, 2320, 99.0, 273.19999999999993, 395.1999999999991, 1861.1999999999944, 0.7287677926760943, 1.5887411036619528, 0.3493397319040217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 164.0, 97, 290, 105.0, 290.0, 290.0, 290.0, 0.5367686527106817, 0.4156811929683306, 0.19080448201825012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d839b304-bc48-407b-8dc6-d5f8aec08e90", 1, 0, 0.0, 1153.0, 1153, 1153, 1153.0, 1153.0, 1153.0, 1153.0, 0.8673026886383347, 0.15669042714657416, 0.5979645490026019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 95.86666666666667, 86, 113, 93.0, 111.8, 113.0, 113.0, 0.10620371288180235, 0.08618680215310327, 0.037752101063453176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 188.66666666666666, 172, 198, 196.0, 198.0, 198.0, 198.0, 0.7712082262210798, 1.1952221240359897, 1.7344653759640103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21ef253e-e39f-4996-a1a4-224f7d044dd2", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 253.8571428571429, 167, 926, 177.0, 476.4000000000001, 884.1999999999994, 926.0, 0.09677330162855642, 5.655909853365406, 0.21646635889300558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbba8034-ad6f-4169-b51b-f976137977d7", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc31bff-bba5-4838-961c-cdbf755b0b5d", 3, 0, 0.0, 330.3333333333333, 206, 482, 303.0, 482.0, 482.0, 482.0, 0.030743059754260473, 0.02516887867251468, 0.019714787667933963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0cfd309-c902-4ecf-8588-5619dae7e7a0", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.13333333333333, 87, 254, 97.0, 167.60000000000005, 254.0, 254.0, 0.07361240614418217, 0.06103216095352603, 0.026166909996564753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 107.55555555555556, 87, 257, 96.5, 133.7000000000002, 257.0, 257.0, 0.08292026755606331, 0.06437657490924838, 0.02947556385781938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7caec5f6-0cce-4363-8d56-91657f3d2353", 3, 0, 0.0, 464.66666666666663, 187, 734, 473.0, 734.0, 734.0, 734.0, 0.04632417658776115, 0.02978198201849879, 0.02970658459566715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 108.47368421052632, 85, 259, 88.0, 252.0, 259.0, 259.0, 0.11928229725148476, 0.08864631660974599, 0.059874121862561684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 149.15789473684208, 83, 293, 86.0, 255.0, 293.0, 293.0, 0.1192837949825469, 0.04134713781672987, 0.0675017774854976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 174.57894736842107, 83, 1017, 86.0, 291.0, 1017.0, 1017.0, 0.1192837949825469, 5.679499010022978, 0.06958630104090807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 183.10526315789474, 83, 668, 97.0, 387.0, 668.0, 668.0, 0.11928229725148476, 1.8764032345906105, 0.06970191393154451], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6880733944954128], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.882352941176471, 0.1529051987767584], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.1529051987767584], "isController": false}, {"data": ["401/Unauthorized", 21, 61.76470588235294, 1.6055045871559632], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 34, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
