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

    var data = {"OkPercent": 95.78488372093024, "KoPercent": 4.215116279069767};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7387553912507702, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e5e92ee-6f8a-4692-a2c3-8fb195d89e9a"], "isController": false}, {"data": [0.525, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.525, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/34ed5cec-c3bc-4450-ba22-280f8ab4f979"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b394fe07-150e-4788-8675-624367c770c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.65, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a72531ba-2e70-49b4-bc44-7e3fefcbe9cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74ec7975-8551-4608-83f5-c7955ca7c1ec"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30da9c2c-a930-47be-9f67-aa395263b780"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad0eea47-c775-4229-8ec9-e516bd73ac2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89e3eb3d-5947-4aaf-bccf-650ce17b489b"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.82, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80efc2be-1407-467e-be2a-6e1ae7f27abc"], "isController": false}, {"data": [0.06, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a4a0385-d5d1-4f2f-a111-2d910ff74f09"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e5e92ee-6f8a-4692-a2c3-8fb195d89e9a"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/019efdbf-6feb-406c-bb2e-187ee1b7218d"], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3cd2a6c-455b-4f41-ad4f-ed4e3cdd2a3f"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f83d95f1-d87c-4d32-82df-077e4cc3fcfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d24ab0f9-df7e-4d30-b022-81e24b1f3600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.48, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b394fe07-150e-4788-8675-624367c770c4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34ed5cec-c3bc-4450-ba22-280f8ab4f979"], "isController": false}, {"data": [0.1885245901639344, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74ec7975-8551-4608-83f5-c7955ca7c1ec"], "isController": false}, {"data": [0.9196428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30da9c2c-a930-47be-9f67-aa395263b780"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/901e22e7-480e-481d-a04a-aad832fb1fd6"], "isController": false}, {"data": [0.8651685393258427, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89e3eb3d-5947-4aaf-bccf-650ce17b489b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a4a0385-d5d1-4f2f-a111-2d910ff74f09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=019efdbf-6feb-406c-bb2e-187ee1b7218d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=901e22e7-480e-481d-a04a-aad832fb1fd6"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a72531ba-2e70-49b4-bc44-7e3fefcbe9cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80efc2be-1407-467e-be2a-6e1ae7f27abc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d24ab0f9-df7e-4d30-b022-81e24b1f3600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f83d95f1-d87c-4d32-82df-077e4cc3fcfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0a84eb1-388b-4162-98d5-e36f77c5ea31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1376, 58, 4.215116279069767, 377.27180232558135, 119, 2311, 137.0, 992.0, 1134.1499999999999, 1532.23, 5.3226056011140335, 734.5720539332063, 3.8836264783672445], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1810.7500000000007, 1462, 2196, 1781.5, 2141.6, 2163.75, 2196.0, 0.2380476690457264, 286.4500281220377, 1.1704785289504223], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e5e92ee-6f8a-4692-a2c3-8fb195d89e9a", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["deleteBook", 20, 7, 35.0, 384.35, 127, 926, 417.0, 633.1, 911.4499999999998, 926.0, 0.10471368660240737, 0.023105524890443305, 0.06941883413090258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 20, 7, 35.0, 384.35, 127, 926, 417.0, 633.1, 911.4499999999998, 926.0, 0.1061317625832471, 0.023418429448910823, 0.07035893264613018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34ed5cec-c3bc-4450-ba22-280f8ab4f979", 3, 0, 0.0, 958.0, 232, 1764, 878.0, 1764.0, 1764.0, 1764.0, 0.05050079959599361, 0.03246714817776281, 0.03238495286592038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b394fe07-150e-4788-8675-624367c770c4", 3, 0, 0.0, 460.6666666666667, 244, 638, 500.0, 638.0, 638.0, 638.0, 0.04249713144362756, 0.02732156074256654, 0.027252392234357513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 197.1764705882353, 121, 382, 126.0, 374.0, 382.0, 382.0, 0.11695986900494672, 0.04162932837515222, 0.06612586343903296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 159.23529411764707, 123, 389, 130.0, 378.59999999999997, 389.0, 389.0, 0.11695101816180517, 0.0869137937706384, 0.05870392903824986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 222.0, 123, 873, 128.0, 585.7999999999997, 873.0, 873.0, 0.11696067369348047, 2.052630260650301, 0.06828304956036546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 227.88235294117646, 120, 1118, 126.0, 528.3999999999994, 1118.0, 1118.0, 0.11695986900494672, 6.220299127014978, 0.06816836115143551], "isController": false}, {"data": ["goToProfile", 20, 7, 35.0, 214.40000000000003, 124, 386, 213.5, 364.9000000000002, 385.4, 386.0, 0.10444136922635056, 0.13484053924384448, 0.06748401557481919], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a72531ba-2e70-49b4-bc44-7e3fefcbe9cf", 3, 0, 0.0, 386.0, 283, 445, 430.0, 445.0, 445.0, 445.0, 0.02979205148066496, 0.02987933288148722, 0.019104928846650382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74ec7975-8551-4608-83f5-c7955ca7c1ec", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 172.64285714285714, 123, 512, 128.0, 444.0, 512.0, 512.0, 0.08629350887898568, 0.06413023462588682, 0.043315296449022114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30da9c2c-a930-47be-9f67-aa395263b780", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad0eea47-c775-4229-8ec9-e516bd73ac2c", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 735.7777777777778, 615, 903, 640.0, 903.0, 903.0, 903.0, 0.04224618258800114, 12.421780386153578, 0.024093526007219403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 180.28571428571428, 119, 382, 127.0, 381.5, 382.0, 382.0, 0.0862972323244776, 0.041607594156444556, 0.048181016149910626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 958.8888888888889, 864, 1129, 893.0, 1129.0, 1129.0, 1129.0, 0.042198445221729386, 37.97023518746659, 0.024025091371355695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 208.22222222222223, 123, 375, 129.0, 375.0, 375.0, 375.0, 0.04239323969137721, 0.07501616242263234, 0.02347360049317469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 169.83333333333334, 122, 384, 128.0, 382.5, 384.0, 384.0, 0.07175059493201631, 0.05332246361646915, 0.03601543534673475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 189.75, 122, 392, 126.0, 389.90000000000003, 392.0, 392.0, 0.07175274005776094, 0.02818023466135696, 0.04041930881183441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 272.49999999999994, 121, 1142, 128.5, 912.2000000000008, 1142.0, 1142.0, 0.07175231102235084, 5.397965831325266, 0.04166865978641729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 252.58333333333337, 126, 621, 129.0, 550.2000000000003, 621.0, 621.0, 0.07175274005776094, 1.7758686379237147, 0.04173897997500613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 156.7777777777778, 126, 383, 129.0, 383.0, 383.0, 383.0, 0.042393040004898755, 0.03150498383176557, 0.023804685549625764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89e3eb3d-5947-4aaf-bccf-650ce17b489b", 3, 0, 0.0, 458.0, 280, 780, 314.0, 780.0, 780.0, 780.0, 0.021862542905240454, 0.021926593323908148, 0.014019924975040263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 11, 0, 0.0, 919.818181818182, 128, 1282, 1102.0, 1255.2, 1282.0, 1282.0, 0.06819210335443156, 50.206466364632476, 0.03529474099399289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 268.07142857142856, 121, 1125, 128.0, 991.0, 1125.0, 1125.0, 0.08616020875387721, 11.095206357546404, 0.04959500855447787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 11, 0, 0.0, 704.1818181818182, 129, 1005, 843.0, 983.4000000000001, 1005.0, 1005.0, 0.06808868861185734, 16.383610994620994, 0.03530770864540649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 268.2142857142857, 125, 886, 130.5, 752.5, 886.0, 886.0, 0.08617293677368525, 3.6395803454919244, 0.04968648823739413], "isController": false}, {"data": ["deleteBooks", 19, 6, 31.57894736842105, 401.52631578947376, 126, 1147, 377.0, 1030.0, 1147.0, 1147.0, 0.10676916506512919, 0.023141733608123445, 0.07120871123998336], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 489.1666666666667, 253, 1521, 385.5, 1293.000000000001, 1521.0, 1521.0, 0.07169572335010217, 7.249605720198478, 0.15971669360235163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 534.9200000000001, 137, 1130, 467.0, 1041.4, 1109.8999999999999, 1130.0, 0.10567205312345454, 0.06490988419399699, 0.04777945370718697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 11, 0, 0.0, 127.0909090909091, 120, 131, 128.0, 130.8, 131.0, 131.0, 0.06819252609913955, 0.050678234727973816, 0.03422945157710715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 11, 0, 0.0, 239.0909090909091, 121, 380, 129.0, 379.2, 380.0, 380.0, 0.06808995301793241, 0.10189313281873837, 0.034153785027638335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80efc2be-1407-467e-be2a-6e1ae7f27abc", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["login", 25, 0, 0.0, 2378.9600000000005, 1380, 3720, 2378.0, 3359.600000000001, 3694.5, 3720.0, 0.10919319333310039, 47.17379267133504, 0.22993271378935323], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 132.57142857142856, 127, 141, 130.0, 140.5, 141.0, 141.0, 0.0876748016357613, 0.07097891655863878, 0.03116565214396202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a4a0385-d5d1-4f2f-a111-2d910ff74f09", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 11, 0, 0.0, 1086.7272727272725, 260, 1410, 1232.0, 1382.0, 1410.0, 1410.0, 0.0680343635385291, 66.61324020227853, 0.13876859928069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e5e92ee-6f8a-4692-a2c3-8fb195d89e9a", 3, 0, 0.0, 341.0, 204, 477, 342.0, 477.0, 477.0, 477.0, 0.02808778368661523, 0.033198809429068984, 0.01801202274174219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 22, 13, 59.09090909090909, 543.7727272727274, 123, 1269, 131.0, 1254.3, 1267.2, 1269.0, 0.1005250147360533, 49.21433953637406, 0.1320104774481268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 455.3529411764707, 253, 1495, 264.0, 905.3999999999994, 1495.0, 1495.0, 0.11684973124561814, 8.393553546389343, 0.2610391313425347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/019efdbf-6feb-406c-bb2e-187ee1b7218d", 3, 0, 0.0, 392.0, 233, 596, 347.0, 596.0, 596.0, 596.0, 0.06272869837950863, 0.040328508886565605, 0.040226411395713535], "isController": false}, {"data": ["register", 27, 9, 33.333333333333336, 960.2222222222222, 201, 2311, 899.0, 1603.8, 2064.5999999999985, 2311.0, 0.10509066989463688, 0.03284083434207402, 0.04741395458136937], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 499.3571428571429, 250, 1502, 264.0, 1257.5, 1502.0, 1502.0, 0.086090801197892, 14.827867400180791, 0.19047349556324908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 146.33333333333334, 127, 376, 131.5, 169.00000000000034, 376.0, 376.0, 0.16349219324777242, 0.12692997424997957, 0.058116365568544104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3cd2a6c-455b-4f41-ad4f-ed4e3cdd2a3f", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.7676344651442308, 1.434326171875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 354.0434782608695, 248, 757, 260.0, 648.6000000000004, 753.0, 757.0, 0.10820016088893489, 0.16768911653392546, 0.2433446977804854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 128.41666666666666, 120, 141, 128.0, 138.9, 141.0, 141.0, 0.057944981240312325, 0.043062627660036795, 0.02908566441164115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f83d95f1-d87c-4d32-82df-077e4cc3fcfc", 3, 0, 0.0, 288.6666666666667, 202, 434, 230.0, 434.0, 434.0, 434.0, 0.10235414534288638, 0.04631258529512112, 0.06563726117366087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 146.25, 120, 374, 126.0, 300.2000000000003, 374.0, 374.0, 0.057945261043401, 0.015504884302628783, 0.03304690668881463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 186.66666666666669, 120, 376, 127.0, 375.1, 376.0, 376.0, 0.05794470143992583, 0.015617907809980009, 0.0340651467449564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 145.75, 121, 368, 126.5, 296.60000000000025, 368.0, 368.0, 0.0579455408491919, 0.015618134057008754, 0.03412222766803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 174.33333333333334, 126, 379, 134.5, 379.0, 379.0, 379.0, 0.05897327527742011, 0.017392508919707887, 0.03645515942442083], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1161.8571428571431, 959, 1672, 1022.0, 1569.6000000000004, 1628.95, 1672.0, 0.2408757554250812, 288.17114545024407, 0.4756355248725724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 9, 33.333333333333336, 960.2222222222222, 201, 2311, 899.0, 1603.8, 2064.5999999999985, 2311.0, 0.10554213476557919, 0.032981917114243496, 0.04761764283368905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 149.89999999999998, 121, 370, 126.0, 345.9000000000001, 370.0, 370.0, 0.06584882426924267, 0.017748315916319313, 0.038776211947610675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d24ab0f9-df7e-4d30-b022-81e24b1f3600", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 125.6, 121, 130, 126.0, 129.8, 130.0, 130.0, 0.0658492578788637, 0.017748432787662485, 0.03871216137019136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 208.77777777777774, 119, 1119, 127.0, 449.40000000000106, 1119.0, 1119.0, 0.16042351808775165, 8.06024606349652, 0.09354557141965901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 195.66666666666666, 122, 619, 128.0, 407.50000000000034, 619.0, 619.0, 0.16042494786189193, 2.6614074114097788, 0.09370307013243971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 150.70000000000002, 122, 372, 126.0, 347.9000000000001, 372.0, 372.0, 0.06584882426924267, 0.01761970493141845, 0.03755440759105246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 128.44444444444443, 120, 133, 129.0, 132.1, 133.0, 133.0, 0.16040922174792582, 0.11921036889665192, 0.08051791013518933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 153.4, 121, 388, 127.5, 362.4000000000001, 388.0, 388.0, 0.06584795706713199, 0.048935835281335396, 0.03305258782471274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 183.2777777777778, 125, 384, 127.0, 382.2, 384.0, 384.0, 0.16041779924603633, 0.056309850321281205, 0.09073979898758545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 181.5, 127, 379, 136.0, 377.0, 379.0, 379.0, 0.06483612668979155, 0.051033123156222646, 0.02304721690926184], "isController": false}, {"data": ["deleteAccount", 19, 6, 31.57894736842105, 412.2105263157895, 123, 878, 448.0, 780.0, 878.0, 878.0, 0.10669781494106349, 0.02220494719862079, 0.07259246383505641], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1158.6800000000003, 820, 1866, 1126.0, 1406.0, 1733.3999999999996, 1866.0, 0.10653802555208006, 0.055141751506447685, 0.049003330112333696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 307.2, 249, 761, 257.0, 711.1000000000001, 761.0, 761.0, 0.06579336934423749, 0.10196687221611805, 0.1479708296872841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b394fe07-150e-4788-8675-624367c770c4", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34ed5cec-c3bc-4450-ba22-280f8ab4f979", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["addBook", 61, 23, 37.704918032786885, 1131.3606557377054, 647, 2612, 983.0, 1881.8, 1987.2, 2612.0, 0.2682898938275732, 74.7547327670474, 0.9746941261556257], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74ec7975-8551-4608-83f5-c7955ca7c1ec", 3, 0, 0.0, 295.0, 214, 452, 219.0, 452.0, 452.0, 452.0, 0.06144644941933105, 0.028482989574585747, 0.03940413585809967], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 216.19642857142858, 120, 522, 130.0, 516.6, 518.15, 522.0, 0.24180037651772915, 0.17969735012694518, 0.11688592419558196], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 722.8928571428571, 592, 1007, 638.0, 891.6, 957.9, 1007.0, 0.24175235924400582, 71.08322055154073, 0.12158443848697559], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 216.51785714285717, 123, 525, 131.5, 383.90000000000003, 505.79999999999995, 525.0, 0.24224910995081478, 0.42866737034265273, 0.11781255542529859], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 938.8392857142853, 828, 1282, 885.0, 1145.0, 1149.35, 1282.0, 0.24145112123864426, 217.25814331633114, 0.12119714484049135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 164.91304347826087, 128, 379, 132.0, 377.2, 378.8, 379.0, 0.11055513095976274, 0.08259245623458837, 0.03929889420835316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30da9c2c-a930-47be-9f67-aa395263b780", 3, 0, 0.0, 342.3333333333333, 205, 556, 266.0, 556.0, 556.0, 556.0, 0.08811866647084741, 0.039871401821119104, 0.05650838963137024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/901e22e7-480e-481d-a04a-aad832fb1fd6", 3, 0, 0.0, 538.0, 213, 953, 448.0, 953.0, 953.0, 953.0, 0.02898326699385555, 0.02906817890887661, 0.018586274732387834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 23, 12.92134831460674, 185.08988764044935, 121, 935, 133.0, 363.2, 433.2499999999999, 838.620000000001, 0.7305441322531131, 1.5895002172650563, 0.3498493252727228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 131.33333333333334, 127, 147, 130.5, 142.8, 147.0, 147.0, 0.05863440471420614, 0.04540730755699753, 0.020842698550752964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89e3eb3d-5947-4aaf-bccf-650ce17b489b", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.24647211800818555, 0.9405908935879945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 161.64705882352942, 122, 392, 132.0, 392.0, 392.0, 392.0, 0.10843219798443679, 0.08799527004401071, 0.03854425787728027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a4a0385-d5d1-4f2f-a111-2d910ff74f09", 3, 0, 0.0, 355.3333333333333, 210, 482, 374.0, 482.0, 482.0, 482.0, 0.0224166660439815, 0.026889783324242127, 0.01437527086804803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=019efdbf-6feb-406c-bb2e-187ee1b7218d", 1, 0, 0.0, 1147.0, 1147, 1147, 1147.0, 1147.0, 1147.0, 1147.0, 0.8718395815170009, 0.15751008064516128, 0.6010925239755884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=901e22e7-480e-481d-a04a-aad832fb1fd6", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 0.17540200242718446, 0.6693719660194175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 318.16666666666663, 247, 504, 259.0, 504.0, 504.0, 504.0, 0.05790918874052341, 0.08974793215938538, 0.13023912272404822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a72531ba-2e70-49b4-bc44-7e3fefcbe9cf", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80efc2be-1407-467e-be2a-6e1ae7f27abc", 3, 0, 0.0, 295.0, 226, 407, 252.0, 407.0, 407.0, 407.0, 0.02984599466751562, 0.030127743966134744, 0.019139521319988858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 395.88888888888897, 254, 1244, 262.5, 587.900000000001, 1244.0, 1244.0, 0.16022787965105928, 10.883873383812533, 0.3580787119458786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d24ab0f9-df7e-4d30-b022-81e24b1f3600", 3, 0, 0.0, 345.3333333333333, 227, 475, 334.0, 475.0, 475.0, 475.0, 0.07892659826361484, 0.0357122303341226, 0.050613736516706136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 153.25000000000003, 126, 391, 132.0, 314.8000000000003, 391.0, 391.0, 0.07248565388100273, 0.06009796889157354, 0.025766384778012682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f83d95f1-d87c-4d32-82df-077e4cc3fcfc", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 11, 0, 0.0, 129.90909090909093, 124, 137, 128.0, 136.6, 137.0, 137.0, 0.0657183312323382, 0.05102155598604382, 0.02336081305524522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 148.08695652173913, 120, 377, 128.0, 267.00000000000034, 372.99999999999994, 377.0, 0.10839137770153727, 0.08055257659264635, 0.054407390760341956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 182.21739130434784, 119, 385, 129.0, 383.2, 384.8, 385.0, 0.10839137770153727, 0.029003161611544155, 0.06181695759540798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0a84eb1-388b-4162-98d5-e36f77c5ea31", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 181.26086956521738, 122, 386, 128.0, 376.6, 384.59999999999997, 386.0, 0.10839239933645001, 0.02921513888365254, 0.06372287539115518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 158.56521739130434, 119, 379, 127.0, 374.0, 378.0, 379.0, 0.1082668825727977, 0.029181308193449385, 0.06375481464003616], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 15.517241379310345, 0.6540697674418605], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 7, 12.068965517241379, 0.5087209302325582], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 6, 10.344827586206897, 0.436046511627907], "isController": false}, {"data": ["401/Unauthorized", 36, 62.06896551724138, 2.616279069767442], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1376, 58, "401/Unauthorized", 36, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 6, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 20, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 22, 13, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 23, "401/Unauthorized", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
