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

    var data = {"OkPercent": 97.56457564575646, "KoPercent": 2.4354243542435423};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7795425667090216, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/821ceb5e-b8ed-4cdc-ba4e-046342d5ce7f"], "isController": false}, {"data": [0.14655172413793102, 500, 1500, "see books"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5310da55-f084-420a-926b-2da8cacc7859"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4482758620689655, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=821ceb5e-b8ed-4cdc-ba4e-046342d5ce7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/efce31f4-8d81-4fef-9808-7b9a4a676a1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55cc585e-cc25-4316-bef7-181cf0c97f4c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e6b1649a-ddc4-49ea-b7c4-e8a9cc1ade3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/405ae0b2-8fb0-4f26-8246-3d65c359fadd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d804219-07d1-4cc5-bda2-45ce2fae6646"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5310da55-f084-420a-926b-2da8cacc7859"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d804219-07d1-4cc5-bda2-45ce2fae6646"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5603448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9148351648351648, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d51abefc-314e-4634-8dc2-4d176e5e6a52"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/55cc585e-cc25-4316-bef7-181cf0c97f4c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6b1649a-ddc4-49ea-b7c4-e8a9cc1ade3e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab9afb5e-c4b8-41e0-8586-ac5728638c2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa754179-b82c-4efe-bda7-fd59de4c9f16"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19c93e2e-40fc-4f09-bd3c-79fb1eb45941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa754179-b82c-4efe-bda7-fd59de4c9f16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff90e218-a1b2-480f-8466-2b85f32ff81f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efce31f4-8d81-4fef-9808-7b9a4a676a1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19c93e2e-40fc-4f09-bd3c-79fb1eb45941"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad1f925d-6054-402e-840a-24f1578cc4e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad1f925d-6054-402e-840a-24f1578cc4e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e246d0a1-01ac-4291-ac84-763aadd96ed0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e246d0a1-01ac-4291-ac84-763aadd96ed0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1355, 33, 2.4354243542435423, 358.44354243542415, 94, 4251, 114.0, 1014.4000000000001, 1216.0, 1730.6400000000003, 5.285371029145603, 731.3785597022639, 3.874542040153217], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/821ceb5e-b8ed-4cdc-ba4e-046342d5ce7f", 3, 0, 0.0, 367.0, 191, 476, 434.0, 476.0, 476.0, 476.0, 0.01806216998910249, 0.024900159473909198, 0.011582836874522107], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1690.293103448276, 1228, 2736, 1668.5, 2078.1, 2177.4999999999995, 2736.0, 0.2672133790974638, 321.5475565308908, 1.3138860974177051], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 306.5555555555556, 200, 1220, 208.0, 664.7000000000008, 1220.0, 1220.0, 0.08466325191550607, 5.750959921063276, 0.18920619970179722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 108.61538461538461, 103, 122, 106.0, 120.4, 122.0, 122.0, 0.11031252386569027, 0.08564302389963258, 0.03921265496788209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5310da55-f084-420a-926b-2da8cacc7859", 3, 0, 0.0, 296.0, 194, 473, 221.0, 473.0, 473.0, 473.0, 0.04723665564478035, 0.039379256219492995, 0.03029173555345615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 303.3157894736843, 204, 611, 209.0, 412.0, 611.0, 611.0, 0.1432945683816764, 0.22207859377121136, 0.32227284275683665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 121.75000000000003, 101, 311, 104.0, 252.5000000000002, 311.0, 311.0, 0.06254267234415148, 0.04647946645888601, 0.03139348982899791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 134.66666666666666, 97, 305, 102.5, 302.3, 305.0, 305.0, 0.06248080017078086, 0.02453876478061429, 0.03519629710141155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 177.5, 99, 1012, 101.5, 739.900000000001, 1012.0, 1012.0, 0.06224873557255868, 4.683006622033458, 0.036149656335105695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 185.25, 95, 912, 101.5, 730.2000000000007, 912.0, 912.0, 0.06228071996512279, 1.5414376823008575, 0.03622905162033673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 105.25, 104, 106, 105.5, 106.0, 106.0, 106.0, 0.06108082520194847, 0.0180140714951059, 0.037757971047688854], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1169.9999999999998, 777, 1853, 1098.5, 1592.5, 1734.8, 1853.0, 0.25853384564637916, 309.296360300345, 0.5105033553681433], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 443.49999999999994, 104, 1208, 446.5, 1044.0, 1208.0, 1208.0, 0.08590854421835498, 0.018325078698362827, 0.05721643277042782], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 443.49999999999994, 104, 1208, 446.5, 1044.0, 1208.0, 1208.0, 0.08540855793750533, 0.018218427048890297, 0.05688343409509632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 992.1739130434779, 128, 1854, 1060.0, 1789.2, 1849.1999999999998, 1854.0, 0.08971478499656745, 0.02812729162766024, 0.0404767877621232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 168.66666666666669, 99, 305, 102.0, 305.0, 305.0, 305.0, 0.0140889387741684, 0.003797409278975077, 0.008296513750804244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 145.6842105263158, 99, 306, 103.0, 306.0, 306.0, 306.0, 0.0996486075418262, 0.03454102638065768, 0.05639037669795983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=821ceb5e-b8ed-4cdc-ba4e-046342d5ce7f", 1, 0, 0.0, 1208.0, 1208, 1208, 1208.0, 1208.0, 1208.0, 1208.0, 0.8278145695364238, 0.14955634312913907, 0.5707393418874173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 104.33333333333333, 100, 110, 103.0, 110.0, 110.0, 110.0, 0.014102317010684855, 0.0038010151317861528, 0.008290619961359652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 124.89473684210527, 98, 305, 104.0, 304.0, 305.0, 305.0, 0.0996486075418262, 0.0740552640032517, 0.05001892995751823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 187.3157894736842, 100, 890, 103.0, 307.0, 890.0, 890.0, 0.0996480849211469, 1.5675418161387942, 0.058228776596860564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 192.1052631578947, 99, 1215, 103.0, 307.0, 1215.0, 1215.0, 0.0996486075418262, 4.744602298801595, 0.05813176889390046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 243.0, 102, 1111, 109.0, 788.1999999999997, 1111.0, 1111.0, 0.10380401801398959, 7.210675307519403, 0.060339204581749656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 173.07692307692307, 102, 585, 103.0, 473.7999999999999, 585.0, 585.0, 0.10397088815131764, 2.3774749320190347, 0.060537736933658576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efce31f4-8d81-4fef-9808-7b9a4a676a1f", 3, 0, 0.0, 535.6666666666666, 215, 944, 448.0, 944.0, 944.0, 944.0, 0.01821637409145834, 0.025112742277775414, 0.011681724270889626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 104.33333333333333, 99, 110, 104.0, 110.0, 110.0, 110.0, 0.014102250719214787, 0.003773453805727394, 0.008042689863302184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 151.0769230769231, 99, 310, 105.0, 308.0, 310.0, 310.0, 0.10380401801398959, 0.07714341573109969, 0.052104751229678364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 101.33333333333333, 101, 102, 101.0, 102.0, 102.0, 102.0, 0.014102449595494738, 0.01048043373258935, 0.007078768644613569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 148.69230769230768, 99, 304, 104.0, 304.0, 304.0, 304.0, 0.10380401801398959, 0.03976866675716247, 0.05853012013318854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 104.66666666666667, 104, 106, 104.0, 106.0, 106.0, 106.0, 0.014209726083846855, 0.011184608616777898, 0.005051113568867438], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 357.14285714285717, 102, 556, 437.5, 526.5, 556.0, 556.0, 0.08696894587425533, 0.01787182718649248, 0.059172370121197436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1597.0, 866, 4251, 1332.0, 2413.5, 4159.399999999999, 4251.0, 0.08974123115995028, 0.046448098158958645, 0.041277460816734945], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 251.7142857142857, 102, 789, 208.5, 632.5, 789.0, 789.0, 0.08639308855291578, 0.16258364509410675, 0.055827676643011415], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 273.6666666666667, 202, 408, 211.0, 408.0, 408.0, 408.0, 0.014082193066866948, 0.021824648825310395, 0.03167118225878377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55cc585e-cc25-4316-bef7-181cf0c97f4c", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6b1649a-ddc4-49ea-b7c4-e8a9cc1ade3e", 3, 0, 0.0, 679.3333333333334, 194, 1288, 556.0, 1288.0, 1288.0, 1288.0, 0.027799914746928108, 0.02788135980966325, 0.017827419287580852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/405ae0b2-8fb0-4f26-8246-3d65c359fadd", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.7807724633251835, 1.4588745415647923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d804219-07d1-4cc5-bda2-45ce2fae6646", 3, 0, 0.0, 357.0, 295, 463, 313.0, 463.0, 463.0, 463.0, 0.040089265431026415, 0.025773534904387104, 0.025708285448932958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 113.83333333333331, 97, 298, 103.0, 132.40000000000026, 298.0, 298.0, 0.08470468652207262, 0.06294947894853249, 0.04251778210189974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 122.5, 97, 303, 101.0, 297.6, 303.0, 303.0, 0.08470388932025129, 0.02973275628808734, 0.04791247558880968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 788.1666666666666, 607, 910, 808.0, 910.0, 910.0, 910.0, 0.050835394991019085, 14.94729402133392, 0.02899206120581557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1033.5, 886, 1219, 1039.0, 1219.0, 1219.0, 1219.0, 0.05076657528683115, 45.67985368121129, 0.028903235734592345], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1122.5806451612905, 524, 4362, 879.0, 1980.8000000000002, 2572.4999999999986, 4362.0, 0.2998167249374979, 82.1186241344001, 1.09288031993346], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 237.83333333333334, 101, 308, 303.5, 308.0, 308.0, 308.0, 0.05105253305651515, 0.09033905263516158, 0.02826834594047275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5310da55-f084-420a-926b-2da8cacc7859", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 103.64705882352939, 100, 106, 104.0, 106.0, 106.0, 106.0, 0.09853415947463905, 0.07322704625019562, 0.04945952926754343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d804219-07d1-4cc5-bda2-45ce2fae6646", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.22140203737745098, 0.8449180453431373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 136.35294117647058, 99, 298, 102.0, 296.4, 298.0, 298.0, 0.09853587285394665, 0.02636604410349744, 0.05619623998701645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 125.82352941176471, 99, 313, 102.0, 303.4, 313.0, 313.0, 0.09853587285394665, 0.026558496980165307, 0.05792831587702723], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 188.5344827586207, 100, 523, 104.5, 404.2, 409.5, 523.0, 0.25969374048535865, 0.19299505518491986, 0.12553554837915287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 161.52941176470588, 99, 309, 104.0, 305.8, 309.0, 309.0, 0.09853415947463905, 0.026558035170898806, 0.05802353336250717], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 654.637931034483, 473, 996, 604.5, 817.9000000000001, 884.25, 996.0, 0.2592723387706021, 76.23467625043025, 0.13039575631529304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 136.83333333333334, 103, 296, 104.0, 296.0, 296.0, 296.0, 0.05114173933055463, 0.03800670276421101, 0.028717285268621988], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 169.94827586206895, 98, 311, 105.5, 307.1, 309.05, 311.0, 0.25985779506180584, 0.4598264889179611, 0.12637615423904228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 157.5, 94, 1119, 101.0, 214.50000000000142, 1119.0, 1119.0, 0.08470468652207262, 4.25586363045463, 0.04939268504444643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 642.2631578947368, 100, 1341, 919.0, 1271.0, 1341.0, 1341.0, 0.09126191208115586, 43.23145634498444, 0.049524222232362435], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 979.9310344827584, 675, 1546, 966.5, 1211.4, 1338.2, 1546.0, 0.25904190226081053, 233.08635900137114, 0.13002689234575843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 160.49999999999997, 95, 783, 101.0, 352.8000000000007, 783.0, 783.0, 0.08470468652207262, 1.4052283232472014, 0.049475404464878144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 448.7894736842105, 98, 807, 603.0, 806.0, 807.0, 807.0, 0.09126191208115586, 14.134826566342607, 0.049613345193379184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 110.05263157894737, 104, 136, 108.0, 114.0, 136.0, 136.0, 0.1469223631302196, 0.10976133573693164, 0.052226308768945254], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 521.9999999999999, 104, 1291, 470.5, 1249.5, 1291.0, 1291.0, 0.08538095150971818, 0.018212538345195185, 0.05712709869428131], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, 5.4945054945054945, 201.96703296703294, 96, 2870, 109.0, 364.80000000000024, 567.5499999999995, 1899.7299999999855, 0.7907920521053753, 1.6466404644382553, 0.3810625806542718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 158.91666666666669, 103, 316, 110.5, 316.0, 316.0, 316.0, 0.05961103797719878, 0.046163626089764286, 0.021189861155957376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 290.3529411764706, 202, 418, 211.0, 414.0, 418.0, 418.0, 0.09847479914037292, 0.15261670530837093, 0.22147213126980356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 129.21052631578948, 103, 315, 106.0, 307.0, 315.0, 315.0, 0.10597829118372173, 0.0860038671617898, 0.03767197069421358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d51abefc-314e-4634-8dc2-4d176e5e6a52", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 625.4, 119, 1746, 505.5, 1166.0000000000005, 1718.1499999999996, 1746.0, 0.09088058745211729, 0.05582411084705252, 0.04109151561555694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 103.47368421052632, 100, 108, 104.0, 107.0, 108.0, 108.0, 0.09126191208115586, 0.06782257333374961, 0.045809201962611436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 161.47368421052636, 98, 457, 104.0, 305.0, 457.0, 457.0, 0.0912623504378191, 0.09656284673689064, 0.048014053201147024], "isController": false}, {"data": ["login", 20, 0, 0.0, 2919.4, 1694, 5186, 2843.5, 4134.1, 5134.849999999999, 5186.0, 0.08935512406958977, 32.191047328616875, 0.1792687176646145], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/55cc585e-cc25-4316-bef7-181cf0c97f4c", 3, 0, 0.0, 868.0, 287, 1886, 431.0, 1886.0, 1886.0, 1886.0, 0.03451687875371057, 0.03461800242193432, 0.022134847377867778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6b1649a-ddc4-49ea-b7c4-e8a9cc1ade3e", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 317.83333333333337, 205, 1116, 207.0, 966.6000000000006, 1116.0, 1116.0, 0.06221420350265965, 6.290869587688327, 0.13859469455418338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab9afb5e-c4b8-41e0-8586-ac5728638c2a", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 107.66666666666666, 103, 128, 106.0, 117.20000000000002, 128.0, 128.0, 0.08594634083453898, 0.06957960600764923, 0.030551238343527524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa754179-b82c-4efe-bda7-fd59de4c9f16", 3, 0, 0.0, 318.3333333333333, 214, 497, 244.0, 497.0, 497.0, 497.0, 0.07804167425405166, 0.03531182526469134, 0.05004625595067766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 396.8461538461538, 206, 1211, 217.0, 972.5999999999998, 1211.0, 1211.0, 0.10355182768975874, 9.677677511729236, 0.23085243316924353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19c93e2e-40fc-4f09-bd3c-79fb1eb45941", 3, 0, 0.0, 507.3333333333333, 344, 789, 389.0, 789.0, 789.0, 789.0, 0.0179360400810709, 0.02472627921332528, 0.011501952786363828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa754179-b82c-4efe-bda7-fd59de4c9f16", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff90e218-a1b2-480f-8466-2b85f32ff81f", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 122.11764705882354, 104, 302, 107.0, 173.19999999999987, 302.0, 302.0, 0.1060915257833611, 0.08796064979499373, 0.03771222205580414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 765.7368421052632, 203, 1447, 1023.0, 1373.0, 1447.0, 1447.0, 0.091217221811478, 57.50249553365675, 0.192866100619797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efce31f4-8d81-4fef-9808-7b9a4a676a1f", 1, 0, 0.0, 1291.0, 1291, 1291, 1291.0, 1291.0, 1291.0, 1291.0, 0.774593338497289, 0.13994117931835787, 0.5340457978311387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19c93e2e-40fc-4f09-bd3c-79fb1eb45941", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 167.3157894736842, 99, 1022, 106.0, 309.0, 1022.0, 1022.0, 0.08921570008498969, 0.06926414215582695, 0.031713393389586175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad1f925d-6054-402e-840a-24f1578cc4e9", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad1f925d-6054-402e-840a-24f1578cc4e9", 3, 0, 0.0, 282.6666666666667, 190, 455, 203.0, 455.0, 455.0, 455.0, 0.01595939928821079, 0.022001320307803614, 0.010234380402921633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e246d0a1-01ac-4291-ac84-763aadd96ed0", 3, 0, 0.0, 294.6666666666667, 217, 441, 226.0, 441.0, 441.0, 441.0, 0.04138102266300675, 0.026604010338358828, 0.02653665841345159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 373.00000000000006, 202, 1315, 220.0, 613.0, 1315.0, 1315.0, 0.09959532845490952, 6.417315647081333, 0.22265104909263414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 560.7857142857143, 102, 1331, 106.0, 1299.0, 1331.0, 1331.0, 0.11259631005806753, 57.74764402274446, 0.15144266535572393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e246d0a1-01ac-4291-ac84-763aadd96ed0", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 114.1578947368421, 101, 302, 104.0, 107.0, 302.0, 302.0, 0.14362928525531996, 0.10674012312431493, 0.07209516857542428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 165.6315789473684, 97, 309, 103.0, 307.0, 309.0, 309.0, 0.1434059671977719, 0.038372299816591314, 0.08178621566747929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 155.26315789473682, 99, 308, 102.0, 306.0, 308.0, 308.0, 0.1434070495886482, 0.03865268133444033, 0.08430766001207637], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 992.1739130434779, 128, 1854, 1060.0, 1789.2, 1849.1999999999998, 1854.0, 0.08914728682170543, 0.02794937015503876, 0.04022074854651163], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 133.42105263157896, 100, 307, 102.0, 303.0, 307.0, 307.0, 0.1436336284122436, 0.03871375140798754, 0.08458113079353799], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.21212121212121, 0.5166051660516605], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.2952029520295203], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 12.121212121212121, 0.2952029520295203], "isController": false}, {"data": ["401/Unauthorized", 18, 54.54545454545455, 1.3284132841328413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1355, 33, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
