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

    var data = {"OkPercent": 99.52718676122932, "KoPercent": 0.4728132387706856};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7537364130434783, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49a40419-5630-4528-b952-7e41316e076f"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ceafb27-9101-49e4-9e32-2c7478f5d1dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f367592-22ee-4f75-b530-43362ade0083"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc74a682-8e16-4af9-96f0-53c804f1fc08"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e29f4f1-e054-443b-b8e3-6106f1675286"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bd2468e-905f-4462-9364-86d34115cc0c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d94b324b-c26d-4742-8675-7fd0503ead28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22c7d3eb-31d8-41fb-90d6-0139b3863eec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89e651bf-f9be-4506-a9d3-78bebb2e6631"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3885d27-7400-4f35-aefa-eae09545c2c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e29f4f1-e054-443b-b8e3-6106f1675286"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db023ebd-03c7-4fdb-a868-d47aa5f28d6e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e96d398d-2b71-4126-afbe-e98005653b11"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b852df2-ca8c-4587-a4c1-c8b11d88df9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d789760f-9e23-4a3e-bbd5-b2679fae5332"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5c40693-1618-4531-b6a9-fc6dddffa59a"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/979b65e8-13e1-42d2-9fc0-289f8d0875d6"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61f8c560-0107-4e6d-86e7-953583a801f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ceafb27-9101-49e4-9e32-2c7478f5d1dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f3885d27-7400-4f35-aefa-eae09545c2c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d94b324b-c26d-4742-8675-7fd0503ead28"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db023ebd-03c7-4fdb-a868-d47aa5f28d6e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc74a682-8e16-4af9-96f0-53c804f1fc08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e96d398d-2b71-4126-afbe-e98005653b11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49a40419-5630-4528-b952-7e41316e076f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89e651bf-f9be-4506-a9d3-78bebb2e6631"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e5c40693-1618-4531-b6a9-fc6dddffa59a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f367592-22ee-4f75-b530-43362ade0083"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b852df2-ca8c-4587-a4c1-c8b11d88df9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1269, 6, 0.4728132387706856, 462.7304964539008, 126, 2765, 157.0, 1316.0, 1578.0, 2039.599999999999, 4.974968342892538, 716.117040454941, 3.633645428635275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49a40419-5630-4528-b952-7e41316e076f", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2233.94642857143, 1601, 3316, 2205.5, 2673.3, 2893.9499999999994, 3316.0, 0.24060770632110817, 289.53116557918787, 1.1830662122331832], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3ceafb27-9101-49e4-9e32-2c7478f5d1dd", 3, 0, 0.0, 454.0, 236, 884, 242.0, 884.0, 884.0, 884.0, 0.04195628155462009, 0.026591432352488707, 0.02690555815839895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f367592-22ee-4f75-b530-43362ade0083", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 664.8333333333334, 479, 1218, 580.0, 1126.8000000000004, 1218.0, 1218.0, 0.08331308362550768, 0.015051680147186448, 0.05662686152671226], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 664.8333333333334, 479, 1218, 580.0, 1126.8000000000004, 1218.0, 1218.0, 0.08123476848090982, 0.014676203290008124, 0.0552142567018684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 214.6923076923077, 128, 409, 133.0, 405.8, 409.0, 409.0, 0.11100674579455214, 0.05535327363162838, 0.061874252839211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 175.46153846153845, 129, 400, 135.0, 400.0, 400.0, 400.0, 0.11100769368707784, 0.08249692860924439, 0.055720658745271504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 335.6923076923077, 132, 1062, 134.0, 953.5999999999999, 1062.0, 1062.0, 0.11101053746178675, 5.046976670708589, 0.06390277558365925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 415.61538461538464, 126, 1706, 137.0, 1500.7999999999997, 1706.0, 1706.0, 0.11101243339253997, 15.39288461004748, 0.06379545638919251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc74a682-8e16-4af9-96f0-53c804f1fc08", 3, 0, 0.0, 472.66666666666663, 233, 823, 362.0, 823.0, 823.0, 823.0, 0.024404728009306337, 0.024476226235896098, 0.015650167375759597], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 385.41666666666663, 232, 1265, 270.5, 1030.7000000000007, 1265.0, 1265.0, 0.08311055088443478, 0.2046110339645118, 0.053729672544429515], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 166.4444444444444, 129, 402, 134.5, 396.6, 402.0, 402.0, 0.08780958978286639, 0.06525693146949349, 0.04407629799647786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 185.44444444444443, 131, 506, 134.5, 416.0000000000001, 506.0, 506.0, 0.08769365682548962, 0.023464904267757967, 0.05001278865828705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1051.75, 1049, 1058, 1050.0, 1058.0, 1058.0, 1058.0, 0.16588562186372496, 48.775880748973584, 0.09460664371915564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1231.75, 1184, 1316, 1213.5, 1316.0, 1316.0, 1316.0, 0.1640823693494134, 147.64160436664204, 0.09341798958076955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e29f4f1-e054-443b-b8e3-6106f1675286", 3, 0, 0.0, 398.6666666666667, 333, 453, 410.0, 453.0, 453.0, 453.0, 0.023118180136859626, 0.027324906275044695, 0.014825135048702299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 270.25, 133, 401, 273.5, 401.0, 401.0, 401.0, 0.17245095925846088, 0.30515736150032335, 0.09548798232377667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 134.22222222222226, 132, 137, 134.0, 137.0, 137.0, 137.0, 0.09962033583122101, 0.07403425348394452, 0.050004738884030855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 194.22222222222223, 131, 403, 134.0, 403.0, 403.0, 403.0, 0.09932897757372416, 0.07630741766731414, 0.05386786348887515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 601.2222222222222, 133, 1698, 144.0, 1698.0, 1698.0, 1698.0, 0.09847042604871004, 29.552314721738988, 0.05506907290093875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bd2468e-905f-4462-9364-86d34115cc0c", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.7128034319196428, 1.3318743024553572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 413.55555555555554, 129, 1058, 144.0, 1058.0, 1058.0, 1058.0, 0.09861068501555859, 9.682657633288775, 0.05524381149471885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d94b324b-c26d-4742-8675-7fd0503ead28", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 134.25, 133, 135, 134.5, 135.0, 135.0, 135.0, 0.1724360908738199, 0.12814830581540718, 0.09682690649652972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22c7d3eb-31d8-41fb-90d6-0139b3863eec", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 148.7222222222222, 128, 397, 134.0, 168.40000000000038, 397.0, 397.0, 0.08781130326609264, 0.02366789033343903, 0.05162344195916774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 991.5624999999998, 127, 1687, 1449.0, 1637.3, 1687.0, 1687.0, 0.10254964043532322, 57.681831829004885, 0.05477993488097833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 207.0, 130, 402, 134.0, 401.1, 402.0, 402.0, 0.08769835663023937, 0.023637447685494205, 0.05164268461722103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 687.75, 130, 1214, 927.5, 1155.2, 1214.0, 1214.0, 0.10254964043532322, 18.855989660112037, 0.054880081014215945], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 629.4166666666666, 457, 1132, 551.5, 1064.8000000000002, 1132.0, 1132.0, 0.08121607536851795, 0.014672826116382636, 0.05599467696306022], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 738.0, 268, 1833, 284.0, 1833.0, 1833.0, 1833.0, 0.09832626840886247, 39.31239126070664, 0.21275218297972295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89e651bf-f9be-4506-a9d3-78bebb2e6631", 3, 0, 0.0, 527.0, 277, 844, 460.0, 844.0, 844.0, 844.0, 0.0245096036797085, 0.024581409159238895, 0.015717421630542235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 702.1904761904763, 171, 1368, 644.0, 1285.4, 1361.1, 1368.0, 0.09285461620091971, 0.057036673428104, 0.04198406962990803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 135.6875, 128, 153, 135.0, 144.60000000000002, 153.0, 153.0, 0.1025358394801433, 0.07620095101991117, 0.0514681850515563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 199.3125, 126, 405, 134.0, 401.5, 405.0, 405.0, 0.10255029771633306, 0.12370630395908244, 0.053102827503989855], "isController": false}, {"data": ["login", 21, 0, 0.0, 2844.761904761904, 1821, 4543, 2765.0, 3701.2000000000003, 4465.0999999999985, 4543.0, 0.08995309588571673, 20.623194579790535, 0.1641317719153584], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3885d27-7400-4f35-aefa-eae09545c2c2", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 153.83333333333334, 131, 408, 138.0, 186.60000000000036, 408.0, 408.0, 0.08379615189449134, 0.06783887687552081, 0.029786913368744967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e29f4f1-e054-443b-b8e3-6106f1675286", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db023ebd-03c7-4fdb-a868-d47aa5f28d6e", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e96d398d-2b71-4126-afbe-e98005653b11", 3, 0, 0.0, 526.3333333333333, 232, 1100, 247.0, 1100.0, 1100.0, 1100.0, 0.022625458165527853, 0.026742525585622276, 0.014509164253284463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1128.8125, 265, 1823, 1585.5, 1786.6000000000001, 1823.0, 1823.0, 0.1024478636418935, 76.66157878961052, 0.21402499247648502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 653.5384615384615, 269, 1841, 527.0, 1741.8, 1841.0, 1841.0, 0.11087703736556159, 20.55270637255111, 0.2450006050261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1366.0, 1318, 1451, 1347.5, 1451.0, 1451.0, 1451.0, 0.1631787214947171, 195.21848101007626, 0.36794889446416185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b852df2-ca8c-4587-a4c1-c8b11d88df9e", 3, 0, 0.0, 340.0, 240, 435, 345.0, 435.0, 435.0, 435.0, 0.04332380209687202, 0.027853030319440836, 0.027782516318632124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d789760f-9e23-4a3e-bbd5-b2679fae5332", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5c40693-1618-4531-b6a9-fc6dddffa59a", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1135.5454545454543, 389, 1912, 1119.5, 1573.8999999999999, 1865.1999999999994, 1912.0, 0.08699537738199276, 0.02751043450236667, 0.03924986752976626], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 412.27777777777777, 265, 803, 278.5, 802.1, 803.0, 803.0, 0.08763601840356387, 0.13581871211567953, 0.19709545935879647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 154.16666666666666, 134, 406, 136.0, 188.20000000000033, 406.0, 406.0, 0.08665970179433727, 0.06727974895165832, 0.030804815872205828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 448.0, 266, 801, 535.0, 645.6000000000001, 801.0, 801.0, 0.10152833994395637, 0.15734909715923706, 0.2283396161044253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 153.0, 133, 391, 135.0, 246.4000000000001, 391.0, 391.0, 0.07054507830503692, 0.05242656698255185, 0.03541032250858298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 204.0, 132, 401, 133.0, 399.2, 401.0, 401.0, 0.07045925341375082, 0.018853354917351295, 0.04018379296252977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 169.13333333333335, 131, 398, 133.0, 398.0, 398.0, 398.0, 0.07045925341375082, 0.018990970646675025, 0.04142233452644336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 194.6, 126, 529, 133.0, 452.20000000000005, 529.0, 529.0, 0.07054740079859659, 0.019014729121496734, 0.041543049493704826], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1550.3214285714284, 1037, 2765, 1433.5, 2119.9, 2304.7999999999993, 2765.0, 0.24262485431677275, 290.26367580986874, 0.4790893119419087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1135.5454545454543, 389, 1912, 1119.5, 1573.8999999999999, 1865.1999999999994, 1912.0, 0.0874601956723105, 0.02765742338288086, 0.03945958046934321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 133.125, 128, 144, 132.0, 144.0, 144.0, 144.0, 0.03741762276488169, 0.010085218635847017, 0.022034010280491855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 134.5, 133, 139, 134.0, 139.0, 139.0, 139.0, 0.03741692273873166, 0.010085029956923768, 0.02199705809444967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/979b65e8-13e1-42d2-9fc0-289f8d0875d6", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.0435814950980393, 1.9499336192810457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 232.77777777777777, 131, 1380, 135.0, 505.2000000000014, 1380.0, 1380.0, 0.08627259263519635, 4.334640789981356, 0.050306956686365575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 244.55555555555557, 131, 1065, 135.0, 472.8000000000009, 1065.0, 1065.0, 0.08627300613496933, 1.431246330401649, 0.050391448787384975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61f8c560-0107-4e6d-86e7-953583a801f8", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.7192250844594594, 1.343873170045045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 136.77777777777777, 131, 165, 134.5, 145.20000000000005, 165.0, 165.0, 0.08627259263519635, 0.0641146904251801, 0.043304797475088794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 134.25, 128, 136, 135.0, 136.0, 136.0, 136.0, 0.03741674773628676, 0.010011903202873606, 0.021339238943351043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 209.27777777777777, 126, 415, 135.0, 412.3, 415.0, 415.0, 0.0861627422728774, 0.03024484280086354, 0.04873767094927408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 135.87500000000003, 133, 141, 135.0, 141.0, 141.0, 141.0, 0.03741727274853254, 0.027807172423469983, 0.01878171698510325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 173.25, 135, 401, 139.0, 401.0, 401.0, 401.0, 0.0401004516313365, 0.031563441420759, 0.014254457415826646], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 652.5, 432, 1100, 590.5, 1035.2000000000003, 1100.0, 1100.0, 0.08013302081455216, 0.014477157080754052, 0.05454366748803013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1558.2857142857144, 800, 2683, 1586.0, 2174.0, 2634.399999999999, 2683.0, 0.09163982928808945, 0.04743077101824942, 0.04215074179168958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ceafb27-9101-49e4-9e32-2c7478f5d1dd", 1, 0, 0.0, 1132.0, 1132, 1132, 1132.0, 1132.0, 1132.0, 1132.0, 0.8833922261484098, 0.15959722835689047, 0.6090575309187279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 273.375, 270, 279, 271.0, 279.0, 279.0, 279.0, 0.03739331220611194, 0.057952330538183244, 0.08409843555730058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3885d27-7400-4f35-aefa-eae09545c2c2", 3, 0, 0.0, 760.0, 227, 1265, 788.0, 1265.0, 1265.0, 1265.0, 0.040137000963288025, 0.025438392212083914, 0.02573889710210853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d94b324b-c26d-4742-8675-7fd0503ead28", 3, 0, 0.0, 382.6666666666667, 262, 449, 437.0, 449.0, 449.0, 449.0, 0.02216410301875083, 0.026197219420925864, 0.01421330825095675], "isController": false}, {"data": ["addBook", 56, 1, 1.7857142857142858, 1401.714285714286, 759, 4099, 1100.0, 2341.1, 2543.3999999999996, 4099.0, 0.26037186681979013, 89.96568579944625, 0.9462408739079493], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 236.62500000000003, 131, 555, 136.5, 540.3, 543.6, 555.0, 0.24388438138291155, 0.18124610764882393, 0.11789332889115353], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 822.3214285714284, 627, 1200, 787.5, 1065.2, 1190.45, 1200.0, 0.2437654801962312, 71.67514495340161, 0.122596896778378], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 227.32142857142858, 130, 554, 140.0, 404.0, 426.79999999999984, 554.0, 0.2443280977312391, 0.4323462041884817, 0.11882362565445027], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1312.0714285714282, 899, 2224, 1230.0, 1642.0000000000002, 1766.0499999999995, 2224.0, 0.24321284163803847, 218.8433424284802, 0.12208144590034353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 156.00000000000003, 135, 398, 139.0, 246.8000000000001, 398.0, 398.0, 0.10387955511849195, 0.07760533170473276, 0.03692593560852644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 1, 0.5952380952380952, 211.41666666666669, 128, 2055, 142.0, 380.9, 441.2499999999991, 1042.0800000000033, 0.7011627615796195, 1.5120044777380823, 0.33671968905726996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 175.0666666666667, 132, 439, 138.0, 415.0, 439.0, 439.0, 0.06871687274093281, 0.05321531258160128, 0.024426700857128458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 156.23076923076923, 129, 398, 136.0, 296.7999999999999, 398.0, 398.0, 0.10254630360016406, 0.08321872880052378, 0.03645200635787082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db023ebd-03c7-4fdb-a868-d47aa5f28d6e", 3, 0, 0.0, 346.0, 238, 453, 347.0, 453.0, 453.0, 453.0, 0.016828500748868283, 0.023199446833156633, 0.010791714347418787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 385.5333333333333, 268, 792, 272.0, 714.6, 792.0, 792.0, 0.0704129484718043, 0.10912631760229828, 0.1583603714165677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 446.38888888888897, 265, 1521, 290.5, 651.6000000000014, 1521.0, 1521.0, 0.08610751000999804, 5.8490647094947885, 0.19243384072980899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc74a682-8e16-4af9-96f0-53c804f1fc08", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e96d398d-2b71-4126-afbe-e98005653b11", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 167.0, 135, 402, 137.0, 402.0, 402.0, 402.0, 0.09676795045480938, 0.08023045892200503, 0.034397982388233016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49a40419-5630-4528-b952-7e41316e076f", 3, 0, 0.0, 329.3333333333333, 264, 432, 292.0, 432.0, 432.0, 432.0, 0.03955696202531646, 0.025431315104166664, 0.025366932027953586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 155.375, 133, 392, 137.5, 230.30000000000018, 392.0, 392.0, 0.0970361520313912, 0.0753356844384336, 0.03449331966740859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89e651bf-f9be-4506-a9d3-78bebb2e6631", 1, 0, 0.0, 908.0, 908, 908, 908.0, 908.0, 908.0, 908.0, 1.1013215859030838, 0.19896923182819382, 0.759309609030837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5c40693-1618-4531-b6a9-fc6dddffa59a", 3, 0, 0.0, 908.6666666666666, 484, 1695, 547.0, 1695.0, 1695.0, 1695.0, 0.02040136281103578, 0.024113720171507456, 0.013082905188066563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f367592-22ee-4f75-b530-43362ade0083", 3, 0, 0.0, 373.33333333333337, 227, 634, 259.0, 634.0, 634.0, 634.0, 0.019949328705089073, 0.023579431161516416, 0.01279302654590673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 151.66666666666666, 128, 395, 135.0, 243.8000000000001, 395.0, 395.0, 0.10180811207036976, 0.07566013016167128, 0.05110290000407232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 185.66666666666666, 126, 399, 133.0, 399.0, 399.0, 399.0, 0.1016260162601626, 0.027192898882113823, 0.057958587398373985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 277.66666666666663, 133, 414, 394.0, 409.8, 414.0, 414.0, 0.10162119682670877, 0.027390088207198845, 0.05974214891570183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b852df2-ca8c-4587-a4c1-c8b11d88df9e", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 239.2, 129, 403, 134.0, 401.8, 403.0, 403.0, 0.1018101850909165, 0.027441026450286087, 0.05995267735334243], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 83.33333333333333, 0.39401103230890466], "isController": false}, {"data": ["401/Unauthorized", 1, 16.666666666666668, 0.07880220646178093], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1269, 6, "406/Not Acceptable", 5, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
