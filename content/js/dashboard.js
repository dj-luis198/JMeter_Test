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

    var data = {"OkPercent": 97.66899766899768, "KoPercent": 2.331002331002331};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.812375249500998, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37735849056603776, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/faf415c4-e8d4-4ae2-aaf3-c92b58e7a298"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cfbab8d-82a2-4d41-a9a2-c8dbf3c59852"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/113c8118-166d-452c-8150-ec3511257778"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f4f1e78-b412-4d8d-b85a-783411d0907b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d945a6f7-0c5e-41f9-a4f2-c1a2c5ff0f55"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c80a36e9-2b4c-477a-9112-1fcaf9ac96fb"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd5d4837-4233-4d0f-b325-8f14683e787e"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c590cccb-cffd-4088-9b72-b7ee17f16e54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00d8b9b0-d0d2-458d-8f5b-c99daad6865a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ace80bba-daa5-42db-9020-06edd212cbc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c73fcfc8-e9da-4e7d-bd01-a8f05385d45a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0825b1b1-356e-4edb-b9e3-70d2a29b5b02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e6bad91-806d-4490-93a4-3fd29391221a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f15ac763-6105-49a8-9e20-35f1a464a2d1"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab393704-32e0-4ade-aee4-981f168e28a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f22cd9c6-36ea-4f67-922c-b9d21984ac37"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f4f1e78-b412-4d8d-b85a-783411d0907b"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d945a6f7-0c5e-41f9-a4f2-c1a2c5ff0f55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.35, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cfbab8d-82a2-4d41-a9a2-c8dbf3c59852"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faf415c4-e8d4-4ae2-aaf3-c92b58e7a298"], "isController": false}, {"data": [0.8301886792452831, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=113c8118-166d-452c-8150-ec3511257778"], "isController": false}, {"data": [0.9132947976878613, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c590cccb-cffd-4088-9b72-b7ee17f16e54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00d8b9b0-d0d2-458d-8f5b-c99daad6865a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ace80bba-daa5-42db-9020-06edd212cbc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e6bad91-806d-4490-93a4-3fd29391221a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0825b1b1-356e-4edb-b9e3-70d2a29b5b02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c73fcfc8-e9da-4e7d-bd01-a8f05385d45a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd5d4837-4233-4d0f-b325-8f14683e787e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 30, 2.331002331002331, 296.61383061383015, 77, 2022, 99.0, 855.4000000000001, 1028.999999999999, 1391.0, 4.9968357256282925, 672.0745074688037, 3.651799207863707], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1351.3207547169811, 997, 1750, 1317.0, 1674.2, 1733.5, 1750.0, 0.2451842119871949, 295.0391407464356, 1.2055688548393813], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/faf415c4-e8d4-4ae2-aaf3-c92b58e7a298", 3, 0, 0.0, 1126.6666666666667, 256, 1667, 1457.0, 1667.0, 1667.0, 1667.0, 0.015340403554882852, 0.021147984718401323, 0.009837433269244536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cfbab8d-82a2-4d41-a9a2-c8dbf3c59852", 3, 0, 0.0, 572.0, 280, 1035, 401.0, 1035.0, 1035.0, 1035.0, 0.021665812070746096, 0.025608256389609074, 0.013893766204221943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/113c8118-166d-452c-8150-ec3511257778", 3, 0, 0.0, 323.3333333333333, 265, 387, 318.0, 387.0, 387.0, 387.0, 0.11639185257032007, 0.05402824927255093, 0.07463930649854511], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 490.66666666666663, 84, 943, 412.0, 871.0, 943.0, 943.0, 0.06999010806472686, 0.014244080586610426, 0.046901574369155825], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 490.66666666666663, 84, 943, 412.0, 871.0, 943.0, 943.0, 0.0701478717135722, 0.01427618795420747, 0.047007294501809814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 157.70588235294122, 78, 246, 115.0, 243.6, 246.0, 246.0, 0.08276453004352441, 0.029458239208965835, 0.04679276796233727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 101.58823529411765, 78, 250, 83.0, 239.6, 250.0, 250.0, 0.08277782917577628, 0.061517507815200934, 0.04155059003549708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 180.47058823529412, 77, 708, 83.0, 404.7999999999997, 708.0, 708.0, 0.08276815665577698, 1.4525602290487019, 0.0483210464207641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 151.58823529411762, 78, 799, 81.0, 358.1999999999996, 799.0, 799.0, 0.08277782917577628, 4.402389152269817, 0.048245855630596635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f4f1e78-b412-4d8d-b85a-783411d0907b", 3, 0, 0.0, 289.6666666666667, 169, 437, 263.0, 437.0, 437.0, 437.0, 0.02756111677645178, 0.02764186223575779, 0.01767428387031576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d945a6f7-0c5e-41f9-a4f2-c1a2c5ff0f55", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 216.86666666666665, 81, 339, 256.0, 335.4, 339.0, 339.0, 0.0703977472720873, 0.13008917047987797, 0.04549729408658923], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 104.64285714285714, 78, 244, 81.5, 243.5, 244.0, 244.0, 0.09352099880426723, 0.06950144540043687, 0.0469431576029232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 500.33333333333337, 462, 631, 477.5, 631.0, 631.0, 631.0, 0.028348420992950693, 8.335377028093285, 0.016167458847542192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 91.78571428571429, 79, 235, 81.0, 159.0, 235.0, 235.0, 0.09342426628585156, 0.04504384267353557, 0.05216014420702817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 887.0, 718, 1052, 873.5, 1052.0, 1052.0, 1052.0, 0.02831631208351424, 25.47906738751345, 0.01612149408661016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 162.83333333333331, 82, 245, 163.0, 245.0, 245.0, 245.0, 0.028380200080410565, 0.050219650923539014, 0.015714427192961712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 107.76923076923076, 80, 242, 82.0, 240.0, 242.0, 242.0, 0.09144239832308709, 0.0679567042225286, 0.04589979759576833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 141.38461538461542, 79, 243, 82.0, 242.6, 243.0, 243.0, 0.09144561447935792, 0.02446884606185944, 0.052152577007758806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 128.76923076923077, 78, 242, 83.0, 239.6, 242.0, 242.0, 0.09144625773776027, 0.024647624155880697, 0.05376039761536297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 141.6153846153846, 78, 244, 81.0, 243.2, 244.0, 244.0, 0.09144561447935792, 0.024647450777639437, 0.05384932180766877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 83.33333333333333, 80, 90, 82.5, 90.0, 90.0, 90.0, 0.028401156873789992, 0.021106719122025573, 0.015947915236747313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c80a36e9-2b4c-477a-9112-1fcaf9ac96fb", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 497.0, 80, 1054, 430.5, 1024.6000000000001, 1054.0, 1054.0, 0.11443775301471955, 51.50106793668731, 0.06235963494356789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 221.0, 79, 882, 82.0, 748.5, 882.0, 882.0, 0.09352037408149633, 12.043005281396127, 0.05383162157648631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 354.125, 79, 745, 284.0, 675.0000000000001, 745.0, 745.0, 0.11443939003805109, 16.839912704202785, 0.06247228421022515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 170.35714285714286, 77, 637, 81.5, 627.0, 637.0, 637.0, 0.09341803234933006, 3.9455825364997597, 0.05386394080633107], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 441.5, 83, 1054, 421.0, 885.0, 1054.0, 1054.0, 0.07116750288482557, 0.014019044932111285, 0.04834187661080018], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 275.3076923076923, 161, 486, 317.0, 480.0, 486.0, 486.0, 0.09139032809127785, 0.14163715886802533, 0.20553898983809848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd5d4837-4233-4d0f-b325-8f14683e787e", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 620.8636363636364, 86, 1287, 630.5, 1213.2, 1277.55, 1287.0, 0.09241018360223296, 0.056763677232231, 0.04178312012483776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.37499999999999, 79, 90, 81.0, 87.2, 90.0, 90.0, 0.11443775301471955, 0.08504602543379061, 0.057442387743716655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c590cccb-cffd-4088-9b72-b7ee17f16e54", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 111.6875, 78, 245, 82.0, 240.8, 245.0, 245.0, 0.114438571520531, 0.11656194345304086, 0.06046022186778054], "isController": false}, {"data": ["login", 22, 0, 0.0, 2453.8636363636365, 1413, 4679, 2333.5, 3391.0, 4485.799999999997, 4679.0, 0.09010042101469456, 29.520566252989695, 0.17668929330553873], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 84.28571428571428, 80, 89, 84.0, 88.5, 89.0, 89.0, 0.09246905589093934, 0.07486020247420774, 0.03286985971123235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00d8b9b0-d0d2-458d-8f5b-c99daad6865a", 3, 0, 0.0, 304.3333333333333, 194, 386, 333.0, 386.0, 386.0, 386.0, 0.017433042588923045, 0.024032856563831088, 0.01117939254563099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ace80bba-daa5-42db-9020-06edd212cbc3", 3, 0, 0.0, 279.3333333333333, 179, 458, 201.0, 458.0, 458.0, 458.0, 0.027241523345985508, 0.0273213324964132, 0.017469336260283675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c73fcfc8-e9da-4e7d-bd01-a8f05385d45a", 3, 0, 0.0, 364.0, 339, 412, 341.0, 412.0, 412.0, 412.0, 0.024693187149665407, 0.024765530471392943, 0.015835149311471633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 580.9375, 163, 1137, 514.0, 1109.7, 1137.0, 1137.0, 0.1143698578239705, 68.50168114755857, 0.24258919061881243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0825b1b1-356e-4edb-b9e3-70d2a29b5b02", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e6bad91-806d-4490-93a4-3fd29391221a", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f15ac763-6105-49a8-9e20-35f1a464a2d1", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 581.0909090909091, 81, 1135, 808.0, 1118.4, 1135.0, 1135.0, 0.051892422291097626, 33.868881190530104, 0.07937274002604056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 317.3529411764706, 161, 881, 324.0, 568.1999999999997, 881.0, 881.0, 0.0827310995936443, 5.94274293135752, 0.18481903332360025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab393704-32e0-4ade-aee4-981f168e28a2", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f22cd9c6-36ea-4f67-922c-b9d21984ac37", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 940.2173913043479, 93, 1719, 980.0, 1539.2000000000003, 1702.7999999999997, 1719.0, 0.09168204666217557, 0.02888420457852169, 0.04136436089641125], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 123.36842105263156, 81, 256, 93.0, 248.0, 256.0, 256.0, 0.1094268337633616, 0.08495540316589108, 0.03889781981431994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 338.85714285714283, 161, 1126, 241.5, 911.5, 1126.0, 1126.0, 0.09336694543368947, 16.081075645565736, 0.20657176166753366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f4f1e78-b412-4d8d-b85a-783411d0907b", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 312.0, 161, 964, 184.0, 733.0000000000001, 964.0, 964.0, 0.07253209545223761, 5.88982336923672, 0.16188918153574622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 86.71428571428571, 78, 115, 83.0, 115.0, 115.0, 115.0, 0.09639748815688003, 0.0716391489134626, 0.04838702042249642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 80.71428571428572, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.0964027984355203, 0.025795280050129456, 0.05497972098275768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 103.57142857142858, 78, 242, 80.0, 242.0, 242.0, 242.0, 0.09640412609659693, 0.02598392461197339, 0.05667508194350718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.5, 83, 88, 85.5, 88.0, 88.0, 88.0, 0.02298480704254488, 0.00677872238950054, 0.014208381697198152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 126.57142857142858, 78, 242, 85.0, 242.0, 242.0, 242.0, 0.09618687736173137, 0.025925369288904154, 0.05664129594641017], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 929.9245283018869, 618, 1397, 879.0, 1319.8000000000002, 1388.9, 1397.0, 0.25548571208206394, 305.6497328547395, 0.5044844822557942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 940.2173913043479, 93, 1719, 980.0, 1539.2000000000003, 1702.7999999999997, 1719.0, 0.09060932803334423, 0.02854624719800502, 0.04088038042129398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 95.83333333333333, 78, 233, 81.0, 193.70000000000016, 233.0, 233.0, 0.061021499908467745, 0.0164472011472042, 0.03593355902813091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 109.41666666666666, 78, 242, 81.0, 241.1, 242.0, 242.0, 0.06097189195780745, 0.01643383025425279, 0.035844803670507894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 153.99999999999997, 78, 992, 81.0, 242.0, 992.0, 992.0, 0.1022632471272101, 4.869094003135176, 0.05965706491025055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 135.57894736842107, 78, 641, 82.0, 243.0, 641.0, 641.0, 0.10235193983860714, 1.6100755552592738, 0.05980875843056768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d945a6f7-0c5e-41f9-a4f2-c1a2c5ff0f55", 3, 0, 0.0, 641.6666666666666, 185, 1350, 390.0, 1350.0, 1350.0, 1350.0, 0.06871120679782873, 0.031090031721673805, 0.04406285071345136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 81.68421052631578, 78, 86, 82.0, 85.0, 86.0, 86.0, 0.10234918309191496, 0.07606223470014382, 0.05137449229418387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 95.83333333333333, 78, 242, 80.5, 200.00000000000014, 242.0, 242.0, 0.061021499908467745, 0.016328018530195474, 0.03480132416654801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 114.4736842105263, 79, 239, 82.0, 238.0, 239.0, 239.0, 0.10226489838098518, 0.03544790679900103, 0.05787091545922322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 84.25, 79, 100, 82.0, 97.30000000000001, 100.0, 100.0, 0.061021189608091414, 0.045348755167732, 0.03062977681499901], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 566.5714285714286, 82, 1828, 395.5, 1642.5, 1828.0, 1828.0, 0.07083514637577033, 0.0136768753605003, 0.0482050563645379], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 100.33333333333334, 80, 262, 84.0, 215.20000000000016, 262.0, 262.0, 0.062460636786192035, 0.04916335278288162, 0.0222028044825917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1203.7272727272727, 745, 2022, 1092.5, 1797.0, 1992.2999999999995, 2022.0, 0.0913090395949199, 0.0472595615090894, 0.04199859145430398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 208.08333333333334, 161, 322, 171.5, 321.4, 322.0, 322.0, 0.06094680867273087, 0.09445564976916396, 0.1370708011458], "isController": false}, {"data": ["addBook", 60, 14, 23.333333333333332, 829.6500000000001, 409, 2430, 708.5, 1449.5, 1553.5499999999997, 2430.0, 0.2712317992161401, 71.33893401099846, 0.9884951099166867], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 154.73584905660377, 80, 428, 84.0, 336.8, 357.59999999999985, 428.0, 0.256382968431033, 0.1905346083750157, 0.12393512634117317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cfbab8d-82a2-4d41-a9a2-c8dbf3c59852", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faf415c4-e8d4-4ae2-aaf3-c92b58e7a298", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.17140802893738138, 0.6541300996204933], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 522.5660377358491, 388, 731, 482.0, 683.2, 717.3, 731.0, 0.25622803328063737, 75.3395493559249, 0.12886468470657056], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 129.07547169811326, 78, 346, 84.0, 245.0, 274.09999999999974, 346.0, 0.2567269732858631, 0.4542864019472499, 0.12485354755503887], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 770.8113207547171, 535, 1070, 774.0, 1013.4, 1036.0, 1070.0, 0.25592613875059755, 230.28278951795346, 0.12846292511504603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 100.66666666666666, 84, 251, 86.0, 173.60000000000005, 251.0, 251.0, 0.07075571824129587, 0.05285949653768685, 0.02515144671858564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=113c8118-166d-452c-8150-ec3511257778", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 14, 8.092485549132949, 141.26011560693638, 78, 1300, 87.0, 246.2, 309.09999999999957, 1053.579999999997, 0.7230748654161233, 1.4831867461004113, 0.34955366845554553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 109.14285714285714, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.10408767155878723, 0.08060695658800612, 0.036999914499412645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 89.82352941176471, 82, 109, 86.0, 102.6, 109.0, 109.0, 0.08418008596272307, 0.06831411272951453, 0.029923389932061718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c590cccb-cffd-4088-9b72-b7ee17f16e54", 3, 0, 0.0, 437.33333333333337, 274, 713, 325.0, 713.0, 713.0, 713.0, 0.016422248862759267, 0.022639395811779133, 0.01053119474597518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 216.2857142857143, 161, 325, 173.0, 325.0, 325.0, 325.0, 0.0960759823769198, 0.1488990078439177, 0.21607713614652962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 262.3157894736842, 160, 1071, 166.0, 325.0, 1071.0, 1071.0, 0.10221538395326067, 6.586136046658632, 0.22850833290743588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00d8b9b0-d0d2-458d-8f5b-c99daad6865a", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ace80bba-daa5-42db-9020-06edd212cbc3", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 84.0, 81, 87, 84.0, 87.0, 87.0, 87.0, 0.09366736556931744, 0.0776597591487798, 0.033295821354718314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e6bad91-806d-4490-93a4-3fd29391221a", 3, 0, 0.0, 269.3333333333333, 176, 365, 267.0, 365.0, 365.0, 365.0, 0.07301579575048069, 0.03303774612407817, 0.04682328047801007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0825b1b1-356e-4edb-b9e3-70d2a29b5b02", 3, 0, 0.0, 984.6666666666667, 169, 1828, 957.0, 1828.0, 1828.0, 1828.0, 0.08361670104242154, 0.03783437970343943, 0.05362138706170912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 85.37499999999999, 81, 101, 84.0, 93.30000000000001, 101.0, 101.0, 0.1124558962032078, 0.08730706785307638, 0.03997455685348403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c73fcfc8-e9da-4e7d-bd01-a8f05385d45a", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 110.13333333333331, 79, 333, 84.0, 278.40000000000003, 333.0, 333.0, 0.0726184770452994, 0.0539674424135477, 0.0364510714856288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 124.59999999999998, 78, 245, 83.0, 244.4, 245.0, 245.0, 0.07256121748048104, 0.02668136434438521, 0.040976302111047684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 178.53333333333333, 79, 882, 83.0, 499.80000000000024, 882.0, 882.0, 0.07261812548412083, 4.374395794502808, 0.04227547383326878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd5d4837-4233-4d0f-b325-8f14683e787e", 3, 0, 0.0, 279.6666666666667, 170, 377, 292.0, 377.0, 377.0, 377.0, 0.03377883868352606, 0.0278301564804702, 0.02166155996306847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 134.73333333333335, 77, 393, 81.0, 303.6, 393.0, 393.0, 0.07256156849086451, 1.4406211300496805, 0.04231340943832509], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.0, 0.4662004662004662], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.2331002331002331], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.1554001554001554], "isController": false}, {"data": ["401/Unauthorized", 19, 63.333333333333336, 1.4763014763014763], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 30, "401/Unauthorized", 19, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
