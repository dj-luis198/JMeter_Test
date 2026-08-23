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

    var data = {"OkPercent": 98.69331283627979, "KoPercent": 1.3066871637202153};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8093667546174143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36607142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99be2943-6603-4d8f-8ed4-995d202fcf28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60edb86c-c44f-4e07-85bc-97484a3877c0"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e4dbd6c1-3941-4cb7-b42a-f62d2a167256"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a55f26a5-b7d7-4b73-90a4-fa8dec1e7df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e67f45c-610b-4db1-8371-3ed6e83a610a"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/483ffe73-7675-4ef8-8140-cdf16da7cf31"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58c42bb7-fe9a-414d-b9f9-a6a78c070d90"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73db539a-a550-4de0-a2ea-e2c892f16902"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fa7810a0-38b7-45bb-b06a-f3afbcf063de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4422e0bb-4bb8-47be-8049-f3d3453e2357"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3256f1b-ad8c-4911-8d0c-f556ac818546"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/95a38379-c0b2-49c8-a89a-5363b00d364a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb6c932f-c6a3-4289-86cc-37301e9fc6bd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d23ac30b-9803-4c2b-82d8-e6af4c16b64b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e0984ef-9349-4d3f-8936-174b7862c2e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99be2943-6603-4d8f-8ed4-995d202fcf28"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44e4300c-28d5-4dc8-a050-987d0bb398eb"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4dbd6c1-3941-4cb7-b42a-f62d2a167256"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a38379-c0b2-49c8-a89a-5363b00d364a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3256f1b-ad8c-4911-8d0c-f556ac818546"], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58c42bb7-fe9a-414d-b9f9-a6a78c070d90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.936046511627907, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a55f26a5-b7d7-4b73-90a4-fa8dec1e7df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa7810a0-38b7-45bb-b06a-f3afbcf063de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73db539a-a550-4de0-a2ea-e2c892f16902"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e0984ef-9349-4d3f-8936-174b7862c2e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d23ac30b-9803-4c2b-82d8-e6af4c16b64b"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb6c932f-c6a3-4289-86cc-37301e9fc6bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60edb86c-c44f-4e07-85bc-97484a3877c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a43cb36-d789-401a-97ec-5d112d5b247a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4422e0bb-4bb8-47be-8049-f3d3453e2357"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/44e4300c-28d5-4dc8-a050-987d0bb398eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 17, 1.3066871637202153, 319.4004611837046, 77, 3998, 94.0, 852.0, 1010.8999999999999, 2097.540000000003, 5.101740709224308, 735.1879704453926, 3.7212051330628877], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1323.303571428571, 951, 1774, 1274.0, 1601.7, 1660.6, 1774.0, 0.25912969441205325, 311.82067024936606, 1.274138682973328], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 713.3571428571429, 420, 2194, 515.5, 1601.5, 2194.0, 2194.0, 0.07607372630846809, 0.013743788444400972, 0.0517063608502869], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 713.3571428571429, 420, 2194, 515.5, 1601.5, 2194.0, 2194.0, 0.07447363101507559, 0.013454708728309556, 0.05061879608055919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 122.83333333333336, 78, 240, 79.5, 236.4, 240.0, 240.0, 0.1154460385974589, 0.030890834546585682, 0.06584031888761328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99be2943-6603-4d8f-8ed4-995d202fcf28", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 82.44444444444443, 79, 99, 82.0, 87.30000000000001, 99.0, 99.0, 0.11555498491365475, 0.08587631203055787, 0.058003185786736855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 152.88888888888889, 77, 315, 80.5, 245.7000000000001, 315.0, 315.0, 0.11544529816955065, 0.0311161155222617, 0.06798194804320219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 87.72222222222223, 78, 235, 79.0, 95.50000000000023, 235.0, 235.0, 0.11556166177669636, 0.03114747915075019, 0.06793761756794063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60edb86c-c44f-4e07-85bc-97484a3877c0", 3, 0, 0.0, 308.3333333333333, 188, 426, 311.0, 426.0, 426.0, 426.0, 0.06013952369497234, 0.037411012298532595, 0.03856603570283057], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 253.9333333333334, 79, 511, 209.0, 481.0, 511.0, 511.0, 0.07606838040275672, 0.1493584820681471, 0.04917206699342262], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e4dbd6c1-3941-4cb7-b42a-f62d2a167256", 3, 0, 0.0, 734.3333333333334, 511, 1032, 660.0, 1032.0, 1032.0, 1032.0, 0.09193711501333089, 0.04159915034782875, 0.0589570691980019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a55f26a5-b7d7-4b73-90a4-fa8dec1e7df6", 3, 0, 0.0, 280.0, 176, 455, 209.0, 455.0, 455.0, 455.0, 0.0311180723391455, 0.03120923856670159, 0.019955274253944215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 91.5625, 80, 235, 81.0, 134.9000000000001, 235.0, 235.0, 0.0909876711705564, 0.06761876734452481, 0.04567154588053318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 109.25, 77, 234, 81.0, 234.0, 234.0, 234.0, 0.0909090909090909, 0.03285910866477273, 0.05136940696022727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 495.8, 459, 626, 466.0, 626.0, 626.0, 626.0, 0.07566356950455495, 22.247601701295363, 0.0431518794830665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 887.4, 696, 1010, 928.0, 1010.0, 1010.0, 1010.0, 0.07513260905498204, 67.60445369671218, 0.042775694413139186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 204.8, 78, 238, 237.0, 238.0, 238.0, 238.0, 0.07592092076892709, 0.1343444418293905, 0.04203824421482583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 81.53333333333335, 79, 93, 81.0, 87.60000000000001, 93.0, 93.0, 0.0703713260303535, 0.052297440536229506, 0.035323107011329784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 90.66666666666667, 78, 236, 80.0, 144.80000000000007, 236.0, 236.0, 0.07037297677691766, 0.03292319082805536, 0.03934655758855266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 203.06666666666666, 78, 932, 81.0, 920.6, 932.0, 932.0, 0.07037297677691766, 8.459335781726484, 0.04056525627492376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e67f45c-610b-4db1-8371-3ed6e83a610a", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 180.0, 78, 636, 80.0, 634.8, 636.0, 636.0, 0.07037297677691766, 2.7753709242317615, 0.04063397988505747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 80.4, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.07610118413442514, 0.05655566516239993, 0.04273259851298286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 705.6923076923077, 81, 999, 858.0, 976.1999999999999, 999.0, 999.0, 0.08015191871362336, 55.48255260355011, 0.041822057345615074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 140.1875, 78, 722, 80.5, 384.60000000000036, 722.0, 722.0, 0.09091064052228162, 5.13556893903021, 0.05295722370267675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 518.076923076923, 81, 746, 627.0, 724.8, 746.0, 746.0, 0.08022858976653481, 18.15104343452421, 0.041940411372094026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 133.625, 78, 618, 80.0, 351.3000000000003, 618.0, 618.0, 0.09098974090671276, 1.6951171030856897, 0.05309215839039148], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 510.3571428571429, 169, 1184, 480.0, 1004.5, 1184.0, 1184.0, 0.07457002391567195, 0.013472123461327453, 0.051412536019984766], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/483ffe73-7675-4ef8-8140-cdf16da7cf31", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 312.00000000000006, 160, 1011, 164.0, 1000.2, 1011.0, 1011.0, 0.07034492461368912, 11.315416200143034, 0.1558075963725467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58c42bb7-fe9a-414d-b9f9-a6a78c070d90", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 748.1363636363636, 162, 2101, 657.0, 1530.4999999999995, 2039.049999999999, 2101.0, 0.1056782864746204, 0.06491371307864867, 0.047782272107177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 99.61538461538461, 79, 243, 82.0, 208.99999999999997, 243.0, 243.0, 0.08022958002900607, 0.059623740627025024, 0.04027148841299719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 132.15384615384616, 79, 274, 81.0, 260.8, 274.0, 274.0, 0.08015191871362336, 0.11405030380659958, 0.04053355745042912], "isController": false}, {"data": ["login", 22, 0, 0.0, 3257.818181818182, 1669, 6672, 2686.5, 5326.9, 6523.199999999998, 6672.0, 0.10500842453951419, 28.6962601861155, 0.1980094937162004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 83.75, 81, 100, 83.0, 89.50000000000001, 100.0, 100.0, 0.08719251016337697, 0.07058846770062452, 0.030994212597137905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73db539a-a550-4de0-a2ea-e2c892f16902", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa7810a0-38b7-45bb-b06a-f3afbcf063de", 3, 0, 0.0, 1033.6666666666667, 271, 2198, 632.0, 2198.0, 2198.0, 2198.0, 0.021472282861539564, 0.025379511416097053, 0.013769660558995096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4422e0bb-4bb8-47be-8049-f3d3453e2357", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3256f1b-ad8c-4911-8d0c-f556ac818546", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a38379-c0b2-49c8-a89a-5363b00d364a", 3, 0, 0.0, 1068.6666666666667, 461, 2179, 566.0, 2179.0, 2179.0, 2179.0, 0.021394493057487002, 0.025287566501215917, 0.013719775821370244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb6c932f-c6a3-4289-86cc-37301e9fc6bd", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d23ac30b-9803-4c2b-82d8-e6af4c16b64b", 3, 0, 0.0, 758.3333333333333, 172, 1746, 357.0, 1746.0, 1746.0, 1746.0, 0.11314777098891152, 0.050091461114882704, 0.07255895470317568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e0984ef-9349-4d3f-8936-174b7862c2e5", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99be2943-6603-4d8f-8ed4-995d202fcf28", 2, 0, 0.0, 230.5, 164, 297, 230.5, 297.0, 297.0, 297.0, 0.08858572883908403, 0.05445773076582362, 0.05506329727155955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44e4300c-28d5-4dc8-a050-987d0bb398eb", 1, 0, 0.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 0.152587890625, 0.5823083826013514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 806.4615384615385, 165, 1081, 942.0, 1057.4, 1081.0, 1081.0, 0.08011240386511537, 73.75348782638102, 0.16440735886351313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 262.7777777777778, 163, 397, 314.0, 327.7000000000001, 397.0, 397.0, 0.11538017768547364, 0.17881674022152994, 0.25949272383754474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 820.0, 79, 1091, 980.5, 1091.0, 1091.0, 1091.0, 0.059290295166852774, 59.11248218203109, 0.11778928105576252], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1227.9565217391303, 191, 3395, 1043.0, 2728.400000000002, 3368.3999999999996, 3395.0, 0.09406799070771847, 0.02963589041488074, 0.04244083174508392], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 253.0625, 161, 805, 165.0, 569.1000000000003, 805.0, 805.0, 0.09086727131263453, 6.926327806875813, 0.20290954518091106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 84.92307692307693, 81, 100, 84.0, 94.8, 100.0, 100.0, 0.09018946725775455, 0.07002014303702625, 0.032059537189279945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 350.2105263157895, 158, 928, 316.0, 782.0, 928.0, 928.0, 0.09044388908723075, 17.202617368796858, 0.1997565973461859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 86.0, 80, 115, 81.0, 115.0, 115.0, 115.0, 0.04196078065701258, 0.03118374421873689, 0.021062344978227017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 79.44444444444444, 77, 80, 80.0, 80.0, 80.0, 80.0, 0.04196351971352904, 0.011228519923346636, 0.02393231983662203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 81.11111111111111, 78, 89, 80.0, 89.0, 89.0, 89.0, 0.04196351971352904, 0.011310479922787123, 0.024669959831586406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 97.22222222222223, 79, 234, 80.0, 234.0, 234.0, 234.0, 0.041964106700735304, 0.011310638134182562, 0.024711285488811904], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 890.5535714285717, 624, 1326, 813.0, 1259.6, 1280.05, 1326.0, 0.24464724924749126, 292.68316324524574, 0.48308275193205796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4dbd6c1-3941-4cb7-b42a-f62d2a167256", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1227.9565217391303, 191, 3395, 1043.0, 2728.400000000002, 3368.3999999999996, 3395.0, 0.09321137502988844, 0.029366015740564372, 0.042054350843562946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 145.36363636363637, 78, 334, 80.0, 315.00000000000006, 334.0, 334.0, 0.0786573898617775, 0.02120062461118222, 0.04631875594399593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 136.1818181818182, 78, 237, 80.0, 236.8, 237.0, 237.0, 0.07874579425871572, 0.021224452358794475, 0.0462939142028778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a38379-c0b2-49c8-a89a-5363b00d364a", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 188.0, 78, 865, 81.0, 614.9999999999998, 865.0, 865.0, 0.08923178298830378, 6.198424941055544, 0.05186865510543079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 175.6153846153846, 78, 621, 81.0, 499.7999999999999, 621.0, 621.0, 0.0893268193468148, 2.0426128652951565, 0.052011131066493514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 92.3076923076923, 79, 233, 80.0, 172.59999999999997, 233.0, 233.0, 0.0893237504981517, 0.0663822012979428, 0.044836335699267545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 122.27272727272728, 77, 236, 79.0, 235.8, 236.0, 236.0, 0.07865682741261942, 0.0210468463975173, 0.04485897188375951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 79.15384615384616, 78, 81, 79.0, 80.6, 81.0, 81.0, 0.0893268193468148, 0.03422226402259282, 0.05036712034383955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 124.27272727272728, 80, 239, 83.0, 238.2, 239.0, 239.0, 0.07865570253843404, 0.058454091437254205, 0.0394814756882374], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 605.3076923076923, 405, 1746, 455.0, 1357.5999999999997, 1746.0, 1746.0, 0.07505947019561654, 0.013560548814637752, 0.051090283912446015], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 98.0909090909091, 81, 252, 82.0, 219.0000000000001, 252.0, 252.0, 0.07596003121266738, 0.05978885269278311, 0.027001417345127857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1873.0, 1027, 3998, 1466.5, 3650.9999999999995, 3967.0999999999995, 3998.0, 0.10586236929606335, 0.05479204660831404, 0.048692554627388515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 299.1818181818182, 160, 476, 318.0, 475.2, 476.0, 476.0, 0.0785226323641737, 0.1216947437128356, 0.17659924056122267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3256f1b-ad8c-4911-8d0c-f556ac818546", 3, 0, 0.0, 380.33333333333337, 182, 775, 184.0, 775.0, 775.0, 775.0, 0.023296085481102992, 0.027535184369103183, 0.014939221483650032], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 836.2758620689655, 410, 1691, 694.0, 1375.3, 1452.6499999999999, 1691.0, 0.27834433113377327, 98.72804814037193, 1.0084264397120577], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 137.66071428571428, 79, 368, 82.5, 321.90000000000003, 332.75, 368.0, 0.24547837598520117, 0.18243070715306453, 0.11866386339128376], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 515.9821428571428, 387, 709, 470.5, 695.0, 704.6, 709.0, 0.2453718917734692, 72.14748329499398, 0.12340480885091468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58c42bb7-fe9a-414d-b9f9-a6a78c070d90", 3, 0, 0.0, 319.0, 212, 422, 323.0, 422.0, 422.0, 422.0, 0.01988770078291249, 0.023506589043865638, 0.012753506035917187], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 106.91071428571425, 78, 248, 81.0, 238.0, 242.3, 248.0, 0.2457919108126495, 0.4349364671801962, 0.11953551912568305], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 747.4107142857143, 540, 1005, 710.5, 941.2, 960.7499999999999, 1005.0, 0.24504548656844427, 220.4923595583055, 0.12300134775017613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 93.78947368421052, 80, 262, 84.0, 102.0, 262.0, 262.0, 0.09245832076224587, 0.06907286658507626, 0.032866043708454584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, 5.813953488372093, 133.59302325581385, 79, 542, 87.5, 243.10000000000005, 286.44999999999993, 516.4500000000004, 0.6980094555932066, 1.5651790424690055, 0.3341590279609602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 86.44444444444444, 81, 94, 85.0, 94.0, 94.0, 94.0, 0.04013503208572843, 0.0310811332460768, 0.014266749686723777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a55f26a5-b7d7-4b73-90a4-fa8dec1e7df6", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 100.94444444444444, 80, 358, 83.0, 130.30000000000035, 358.0, 358.0, 0.1205836247437598, 0.097856437658266, 0.04286371035813336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa7810a0-38b7-45bb-b06a-f3afbcf063de", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73db539a-a550-4de0-a2ea-e2c892f16902", 3, 0, 0.0, 262.3333333333333, 173, 421, 193.0, 421.0, 421.0, 421.0, 0.033835985698656715, 0.028207669067141877, 0.02169820697472452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e0984ef-9349-4d3f-8936-174b7862c2e5", 3, 0, 0.0, 320.6666666666667, 253, 405, 304.0, 405.0, 405.0, 405.0, 0.04364652137224664, 0.028060507718159863, 0.02798946845811389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 185.55555555555554, 160, 314, 163.0, 314.0, 314.0, 314.0, 0.04194513576242275, 0.06500676802242666, 0.09433559341880819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d23ac30b-9803-4c2b-82d8-e6af4c16b64b", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 300.1538461538462, 161, 946, 164.0, 755.5999999999999, 946.0, 946.0, 0.08918097563987351, 8.334616024449309, 0.1988148898786453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb6c932f-c6a3-4289-86cc-37301e9fc6bd", 3, 0, 0.0, 283.6666666666667, 181, 424, 246.0, 424.0, 424.0, 424.0, 0.03413784863277916, 0.028459319774917783, 0.021891784442244447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60edb86c-c44f-4e07-85bc-97484a3877c0", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a43cb36-d789-401a-97ec-5d112d5b247a", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4422e0bb-4bb8-47be-8049-f3d3453e2357", 3, 0, 0.0, 261.6666666666667, 180, 421, 184.0, 421.0, 421.0, 421.0, 0.05526592119079638, 0.03617830973785531, 0.035440711180295854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 85.2, 81, 101, 83.0, 96.8, 101.0, 101.0, 0.07157444696810643, 0.05934248581633043, 0.02544247919569408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 86.3076923076923, 81, 98, 84.0, 96.4, 98.0, 98.0, 0.07692580801685267, 0.05972267321620886, 0.027344720818490598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44e4300c-28d5-4dc8-a050-987d0bb398eb", 3, 0, 0.0, 474.6666666666667, 275, 633, 516.0, 633.0, 633.0, 633.0, 0.018174878682684793, 0.02505553750689131, 0.011655114259403986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 97.31578947368422, 78, 244, 80.0, 237.0, 244.0, 244.0, 0.09047877558406431, 0.06724057443307904, 0.04541610415059478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 112.52631578947367, 77, 237, 79.0, 236.0, 237.0, 237.0, 0.09048006819339877, 0.045667879813896785, 0.05040208568462458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 234.57894736842104, 77, 850, 81.0, 701.0, 850.0, 850.0, 0.09048006819339877, 12.875398342964697, 0.05196465265178031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 223.3684210526316, 78, 624, 234.0, 624.0, 624.0, 624.0, 0.09048049907138436, 4.2212110546930806, 0.05205325997666555], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.4611837048424289], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07686395080707148], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7686395080707148], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 17, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
