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

    var data = {"OkPercent": 97.44744744744744, "KoPercent": 2.5525525525525525};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8177993527508091, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4818181818181818, 500, 1500, "see books"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3308f710-f0e5-4d15-9468-5ceaa46815ad"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/881e69dd-9665-4b56-a414-04b196af1d18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba0ac95a-b38b-4d5a-ad4c-b5906cfc6f19"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eafee81c-50f7-426c-baed-6876c153deb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=881e69dd-9665-4b56-a414-04b196af1d18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3978dcfc-40ab-4706-af44-56f1a473246f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3548387096774194, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3308f710-f0e5-4d15-9468-5ceaa46815ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba0ac95a-b38b-4d5a-ad4c-b5906cfc6f19"], "isController": false}, {"data": [0.8090909090909091, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd59fed2-ba45-447b-bb9c-353b447cdf0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db14e7d4-e1eb-4dd1-87a0-2a35d6bd3913"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/db14e7d4-e1eb-4dd1-87a0-2a35d6bd3913"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8994413407821229, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eafee81c-50f7-426c-baed-6876c153deb7"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/321b7826-bcc4-46c0-9ae8-56e48f0348b9"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=321b7826-bcc4-46c0-9ae8-56e48f0348b9"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24404c6c-2219-4d2a-89e0-0cddb6640db0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24404c6c-2219-4d2a-89e0-0cddb6640db0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3978dcfc-40ab-4706-af44-56f1a473246f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39300181-81b1-409b-bac7-d2d3238f00e4"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dae26759-43a9-466b-8a2f-08f8347f4a7d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6cba3bd0-5d33-4885-8821-4e5dfacd584b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/208a12be-2156-40e2-a391-933eebf12227"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39300181-81b1-409b-bac7-d2d3238f00e4"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cba3bd0-5d33-4885-8821-4e5dfacd584b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dae26759-43a9-466b-8a2f-08f8347f4a7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 34, 2.5525525525525525, 266.18543543543603, 80, 2229, 89.0, 671.0, 830.0, 1236.2900000000063, 5.237784401469097, 727.8606907438774, 3.8451654023597555], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1225.127272727273, 1002, 1818, 1191.0, 1432.0, 1476.7999999999997, 1818.0, 0.24736333175920303, 297.6621090675527, 1.216283569733972], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 244.375, 170, 1001, 172.0, 537.6000000000005, 1001.0, 1001.0, 0.08117706747843735, 6.1876952134069, 0.18127100773718924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 122.66666666666667, 85, 284, 88.0, 266.6, 284.0, 284.0, 0.08082070734283066, 0.06274654525151405, 0.028729235813271838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3308f710-f0e5-4d15-9468-5ceaa46815ad", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 341.5882352941177, 170, 998, 331.0, 887.5999999999999, 998.0, 998.0, 0.09948269001193792, 14.137908656237565, 0.22074436276948106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 104.55555555555554, 84, 258, 85.0, 258.0, 258.0, 258.0, 0.04315780892599395, 0.032073332610040424, 0.021663197058555555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 103.11111111111111, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.04315842980041624, 0.011548251723939503, 0.02461379199554989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 140.66666666666666, 83, 251, 86.0, 251.0, 251.0, 251.0, 0.0431243082142224, 0.01162334869836463, 0.02535237650875184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 103.22222222222221, 84, 243, 85.0, 243.0, 243.0, 243.0, 0.04315842980041624, 0.01163254553214344, 0.0254145831734873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.5, 85, 88, 86.5, 88.0, 88.0, 88.0, 2.638522427440633, 0.778157981530343, 1.6310397427440633], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 798.6, 659, 1465, 673.0, 1085.6, 1128.3999999999996, 1465.0, 0.24237403160557372, 289.9636046471916, 0.47859403506491216], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 561.6923076923076, 86, 2072, 440.0, 1590.7999999999997, 2072.0, 2072.0, 0.0781188969611749, 0.015486461018670416, 0.05252134373516492], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 561.6923076923076, 86, 2072, 440.0, 1590.7999999999997, 2072.0, 2072.0, 0.0785389341662488, 0.01556973011303565, 0.05280374555197767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 772.3181818181818, 93, 1922, 695.0, 1866.6, 1914.05, 1922.0, 0.09583258917875827, 0.029692448174171375, 0.04323696894588508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 105.93333333333332, 82, 250, 85.0, 245.2, 250.0, 250.0, 0.08538299967554461, 0.022846622960057832, 0.04869499200245903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 128.27272727272725, 84, 249, 85.0, 249.0, 249.0, 249.0, 0.05809777327079901, 0.01565916545189504, 0.03421187234598808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/881e69dd-9665-4b56-a414-04b196af1d18", 3, 0, 0.0, 259.3333333333333, 184, 399, 195.0, 399.0, 399.0, 399.0, 0.07251806908554716, 0.03281253776982765, 0.046504100292489546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 107.93333333333334, 84, 252, 86.0, 251.4, 252.0, 252.0, 0.08538251366120218, 0.06345321571892076, 0.042858019552595626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 128.1818181818182, 83, 249, 85.0, 248.6, 249.0, 249.0, 0.05809777327079901, 0.01565916545189504, 0.034155136239278315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 150.60000000000002, 83, 255, 85.0, 252.6, 255.0, 255.0, 0.08538251366120218, 0.0230132556352459, 0.05027896068135246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 117.73333333333333, 83, 251, 85.0, 250.4, 251.0, 251.0, 0.08538251366120218, 0.0230132556352459, 0.05019557932035519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 96.0, 83, 251, 85.0, 153.20000000000005, 251.0, 251.0, 0.0837408722449253, 0.022570781972265024, 0.04923047372211429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 117.46666666666667, 82, 251, 84.0, 250.4, 251.0, 251.0, 0.08374040474528961, 0.022570655966503837, 0.04931197662247034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 112.45454545454545, 83, 248, 85.0, 244.4, 248.0, 248.0, 0.05804749340369393, 0.015532239445910291, 0.03310521108179419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 96.66666666666669, 84, 253, 85.0, 154.60000000000005, 253.0, 253.0, 0.08366147221881379, 0.062174199568864545, 0.041994137422334266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 100.72727272727273, 84, 251, 86.0, 218.2000000000001, 251.0, 251.0, 0.05809685273504138, 0.04317549309703759, 0.02916189678301882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 95.73333333333333, 81, 252, 84.0, 155.40000000000006, 252.0, 252.0, 0.0837408722449253, 0.022407225581161653, 0.04775846620218396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 107.27272727272727, 86, 253, 87.0, 228.80000000000007, 253.0, 253.0, 0.055966257434608514, 0.04405156591044381, 0.019894255572458497], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 489.8461538461538, 85, 1489, 424.0, 1134.9999999999995, 1489.0, 1489.0, 0.07625796309114587, 0.014796748697748632, 0.0518945979298896], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1020.6818181818179, 756, 1509, 999.0, 1344.3, 1488.7499999999998, 1509.0, 0.09475937579414818, 0.0490453800497056, 0.0435856113271912], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 209.07692307692304, 84, 458, 188.0, 422.0, 458.0, 458.0, 0.07818796386513178, 0.14986222190646314, 0.05053554996210891], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 245.45454545454544, 172, 501, 173.0, 468.0000000000001, 501.0, 501.0, 0.058020855860370174, 0.08992099438516354, 0.13049026469378175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba0ac95a-b38b-4d5a-ad4c-b5906cfc6f19", 3, 0, 0.0, 622.0, 185, 1489, 192.0, 1489.0, 1489.0, 1489.0, 0.019777177137583226, 0.023375953836772365, 0.01268262987012987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eafee81c-50f7-426c-baed-6876c153deb7", 3, 0, 0.0, 317.33333333333337, 174, 604, 174.0, 604.0, 604.0, 604.0, 0.04440365886149019, 0.028547274170391643, 0.028475002590213433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=881e69dd-9665-4b56-a414-04b196af1d18", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 95.81249999999999, 82, 253, 85.5, 137.5000000000001, 253.0, 253.0, 0.08121209044996573, 0.060353907062914, 0.040764662589142964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 95.0625, 83, 252, 85.0, 136.5000000000001, 252.0, 252.0, 0.08121415156591036, 0.02935487094563728, 0.045891150829907114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 543.1111111111111, 404, 675, 579.0, 675.0, 675.0, 675.0, 0.04457652303120357, 13.106977851040119, 0.025422548291233284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3978dcfc-40ab-4706-af44-56f1a473246f", 3, 0, 0.0, 320.0, 188, 467, 305.0, 467.0, 467.0, 467.0, 0.016991775980425474, 0.023424534920931602, 0.010896418841613992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 678.5555555555555, 572, 832, 724.0, 832.0, 832.0, 832.0, 0.04457806858088195, 40.111424468963754, 0.02537989646743572], "isController": false}, {"data": ["addBook", 62, 17, 27.419354838709676, 788.8387096774192, 430, 2476, 660.0, 1367.3000000000002, 1400.4, 2476.0, 0.2866270011881152, 73.04420593052069, 1.0441289645252856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 181.55555555555554, 84, 290, 249.0, 290.0, 290.0, 290.0, 0.04464927990633573, 0.07900829608425815, 0.02472279463563707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3308f710-f0e5-4d15-9468-5ceaa46815ad", 3, 0, 0.0, 313.3333333333333, 219, 398, 323.0, 398.0, 398.0, 398.0, 0.02209017208244052, 0.026109835557077327, 0.014165898112762967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 103.88888888888889, 82, 252, 85.0, 250.2, 252.0, 252.0, 0.08034494764187579, 0.059709477690886206, 0.040329397546800934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 129.83333333333334, 82, 251, 85.0, 249.2, 251.0, 251.0, 0.0803460235413849, 0.028203058393704444, 0.04544746318589838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 176.44444444444446, 81, 749, 85.0, 302.6000000000007, 749.0, 749.0, 0.08034674082373265, 4.036904994721666, 0.04685149578849167], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 156.9818181818181, 83, 578, 86.0, 340.0, 345.4, 578.0, 0.24298974583272587, 0.180581246658891, 0.11746086346406182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 121.05555555555556, 83, 409, 84.0, 265.9000000000002, 409.0, 409.0, 0.0803460235413849, 1.3329192583838843, 0.04692954044306368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba0ac95a-b38b-4d5a-ad4c-b5906cfc6f19", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 488.76363636363635, 401, 678, 420.0, 596.2, 671.4, 678.0, 0.24320249039350164, 71.50960725837832, 0.12231375249282553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 103.44444444444444, 84, 252, 85.0, 252.0, 252.0, 252.0, 0.04468541468064823, 0.033208594308567686, 0.025091907657590565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd59fed2-ba45-447b-bb9c-353b447cdf0d", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db14e7d4-e1eb-4dd1-87a0-2a35d6bd3913", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 129.6181818181818, 80, 349, 86.0, 253.0, 254.39999999999998, 349.0, 0.24355897226970394, 0.4309852126491245, 0.1184495783108521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 135.99999999999997, 81, 747, 84.5, 399.80000000000035, 747.0, 747.0, 0.08121332710697826, 4.587764839514852, 0.04730834923760989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 447.625, 83, 756, 659.5, 755.3, 756.0, 756.0, 0.07452779653911545, 37.7301746235764, 0.040211530847520785], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 638.6181818181818, 562, 852, 585.0, 757.6, 832.0, 852.0, 0.2430305467303554, 218.6793131501067, 0.12198994240176042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 125.0625, 83, 566, 85.0, 346.9000000000002, 566.0, 566.0, 0.08121373933435189, 1.5129925327773577, 0.04738789966042505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 370.43749999999994, 83, 673, 493.0, 616.3000000000001, 673.0, 673.0, 0.07452814369026103, 12.33527205974828, 0.04028449954351512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 96.4705882352941, 83, 252, 87.0, 123.19999999999989, 252.0, 252.0, 0.09845768925594944, 0.07355481668047005, 0.03499863172770078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db14e7d4-e1eb-4dd1-87a0-2a35d6bd3913", 3, 0, 0.0, 981.6666666666666, 191, 2229, 525.0, 2229.0, 2229.0, 2229.0, 0.024318869010465222, 0.028744079875325262, 0.015595108056841302], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 374.5384615384615, 85, 760, 402.0, 677.1999999999999, 760.0, 760.0, 0.07847350915423666, 0.01555676011553715, 0.05324314413169062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 17, 9.497206703910615, 138.53631284916204, 83, 1440, 87.0, 224.0, 324.0, 1130.3999999999955, 0.7210909017664713, 1.524906464640361, 0.34759857720506776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 86.55555555555556, 84, 89, 87.0, 89.0, 89.0, 89.0, 0.04482897745102434, 0.034716190545568654, 0.015935300578293808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eafee81c-50f7-426c-baed-6876c153deb7", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 291.3333333333333, 169, 832, 175.5, 535.0000000000005, 832.0, 832.0, 0.08031483414986748, 5.455582933711259, 0.17948831642259883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 88.53333333333333, 86, 102, 87.0, 96.0, 102.0, 102.0, 0.08397950899980405, 0.06815133982308316, 0.029852091089774095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/321b7826-bcc4-46c0-9ae8-56e48f0348b9", 3, 0, 0.0, 259.6666666666667, 177, 405, 197.0, 405.0, 405.0, 405.0, 0.03847929813760197, 0.03170283319865579, 0.02467585199579293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 354.45454545454544, 95, 798, 267.0, 725.5999999999999, 793.8, 798.0, 0.09372670145915434, 0.0575723586111407, 0.0423783816167856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 85.50000000000001, 84, 88, 85.5, 87.3, 88.0, 88.0, 0.07452710224652634, 0.05538586407188139, 0.03740911186983841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 105.9375, 83, 253, 85.0, 249.5, 253.0, 253.0, 0.0745274493912039, 0.08290632889429213, 0.038983169023597254], "isController": false}, {"data": ["login", 22, 0, 0.0, 1933.1363636363635, 1305, 3703, 1914.5, 2602.8, 3540.8499999999976, 3703.0, 0.0959040262253919, 47.06350879728723, 0.20975600054055], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=321b7826-bcc4-46c0-9ae8-56e48f0348b9", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 246.55555555555554, 170, 509, 174.0, 509.0, 509.0, 509.0, 0.04310633854760377, 0.06680640554203826, 0.09694716569837059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 99.43750000000001, 86, 250, 87.5, 147.1000000000001, 250.0, 250.0, 0.07948928136721564, 0.06435216235685719, 0.028255955486002435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24404c6c-2219-4d2a-89e0-0cddb6640db0", 3, 0, 0.0, 397.6666666666667, 311, 458, 424.0, 458.0, 458.0, 458.0, 0.031090982578686095, 0.025919272911463245, 0.01993790223958711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 216.06666666666663, 170, 506, 171.0, 404.6000000000001, 506.0, 506.0, 0.08362182864214875, 0.12959750200692388, 0.18806745250280135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24404c6c-2219-4d2a-89e0-0cddb6640db0", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3978dcfc-40ab-4706-af44-56f1a473246f", 1, 0, 0.0, 760.0, 760, 760, 760.0, 760.0, 760.0, 760.0, 1.3157894736842104, 0.2377158717105263, 0.9071751644736842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 87.5, 84, 101, 87.0, 91.10000000000002, 101.0, 101.0, 0.08300630386763262, 0.06882065623400399, 0.02950614707794753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39300181-81b1-409b-bac7-d2d3238f00e4", 3, 0, 0.0, 299.6666666666667, 207, 420, 272.0, 420.0, 420.0, 420.0, 0.027262565770939922, 0.027182694972782872, 0.01748283026326551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 544.8125, 169, 844, 747.5, 844.0, 844.0, 844.0, 0.07449760676438269, 50.1833457762767, 0.1568251011537817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dae26759-43a9-466b-8a2f-08f8347f4a7d", 3, 0, 0.0, 294.0, 198, 478, 206.0, 478.0, 478.0, 478.0, 0.04390522325806027, 0.03660197811324621, 0.02815536777942016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cba3bd0-5d33-4885-8821-4e5dfacd584b", 3, 0, 0.0, 451.0, 368, 588, 397.0, 588.0, 588.0, 588.0, 0.08601164024197941, 0.038918027323031054, 0.05515720419163394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 97.8125, 83, 254, 88.0, 139.90000000000012, 254.0, 254.0, 0.07547276612404892, 0.058594579168573135, 0.026828209833158013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/208a12be-2156-40e2-a391-933eebf12227", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39300181-81b1-409b-bac7-d2d3238f00e4", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 569.6153846153846, 84, 920, 670.0, 886.0, 920.0, 920.0, 0.06436025902528864, 53.31108391958928, 0.11359256954621066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 282.2, 169, 503, 335.0, 503.0, 503.0, 503.0, 0.08533928053297225, 0.1322592169978779, 0.1919300420580421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cba3bd0-5d33-4885-8821-4e5dfacd584b", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dae26759-43a9-466b-8a2f-08f8347f4a7d", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 108.11764705882354, 83, 306, 86.0, 261.19999999999993, 306.0, 306.0, 0.09953278141430227, 0.07396918618777737, 0.04996079067085095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 143.35294117647058, 82, 264, 85.0, 254.39999999999998, 264.0, 264.0, 0.0995351124746771, 0.044221309735705, 0.05578266069065658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 192.94117647058823, 83, 773, 84.0, 752.1999999999999, 773.0, 773.0, 0.09953394693084147, 10.560238438692943, 0.05750875679172815], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 772.3181818181818, 93, 1922, 695.0, 1866.6, 1914.05, 1922.0, 0.09990554384945143, 0.030954398795684082, 0.04507457154145172], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 183.05882352941177, 83, 604, 85.0, 451.9999999999999, 604.0, 604.0, 0.09953278141430227, 3.4667231173667137, 0.05760528336104638], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6756756756756757], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.882352941176471, 0.15015015015015015], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.15015015015015015], "isController": false}, {"data": ["401/Unauthorized", 21, 61.76470588235294, 1.5765765765765767], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 34, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
