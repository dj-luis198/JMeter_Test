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

    var data = {"OkPercent": 98.16581071166544, "KoPercent": 1.834189288334556};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7707147375079064, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbaee9b0-cfa9-4f90-9729-fdf8eb6aaa33"], "isController": false}, {"data": [0.017543859649122806, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c08b248b-1246-442e-ad87-ebbfdd934d16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11565cd0-a9e4-426e-8fd9-3e18e7552c8c"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b76b7c9a-2c70-446a-9da8-9cbf2fae2631"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96c4f364-f8be-4aea-b2d4-4cac643b5dc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5cb8619c-8d0a-4048-8734-263ef71e0b8a"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40aadf1f-b59f-43ff-a611-9fe84eb34e89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c88642c-c05d-44a6-baa5-65291b72cb09"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96c4f364-f8be-4aea-b2d4-4cac643b5dc7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=557b0791-33cc-4206-adee-969319b1f4bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b76b7c9a-2c70-446a-9da8-9cbf2fae2631"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0d10a18-132f-4521-b3ca-135da8a3df26"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f677a91-1834-4c90-9766-11a4b4150f4f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/61c010c7-c3cf-4694-96ce-bab9695e04df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/77fd0bc2-518d-46a7-a19f-c55c3013dd5f"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cb8619c-8d0a-4048-8734-263ef71e0b8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61c010c7-c3cf-4694-96ce-bab9695e04df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c08b248b-1246-442e-ad87-ebbfdd934d16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbaee9b0-cfa9-4f90-9729-fdf8eb6aaa33"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.296875, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.927027027027027, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f13c8105-3d1d-4fa5-9564-616933112d43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/40aadf1f-b59f-43ff-a611-9fe84eb34e89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/557b0791-33cc-4206-adee-969319b1f4bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11565cd0-a9e4-426e-8fd9-3e18e7552c8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f677a91-1834-4c90-9766-11a4b4150f4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0d10a18-132f-4521-b3ca-135da8a3df26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c88642c-c05d-44a6-baa5-65291b72cb09"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 25, 1.834189288334556, 377.79310344827576, 119, 2166, 139.0, 1000.0, 1145.8, 1588.2799999999977, 5.320560864405721, 731.9788583459224, 3.9028915606360473], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bbaee9b0-cfa9-4f90-9729-fdf8eb6aaa33", 3, 0, 0.0, 316.6666666666667, 205, 419, 326.0, 419.0, 419.0, 419.0, 0.01917079903890394, 0.02642849411775983, 0.012293774123255457], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1821.40350877193, 1463, 2325, 1812.0, 2110.0, 2179.7, 2325.0, 0.2524603814366324, 303.79572678278, 1.2413457231771918], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c08b248b-1246-442e-ad87-ebbfdd934d16", 3, 0, 0.0, 515.6666666666666, 215, 885, 447.0, 885.0, 885.0, 885.0, 0.024907220603252882, 0.024980190976113974, 0.015972403837372452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11565cd0-a9e4-426e-8fd9-3e18e7552c8c", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 542.7857142857142, 149, 1030, 447.5, 942.0, 1030.0, 1030.0, 0.06983135727218767, 0.013755842141228932, 0.04698613785208721], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 542.7857142857142, 149, 1030, 447.5, 942.0, 1030.0, 1030.0, 0.07088248696268543, 0.01396290061262721, 0.04769339210672877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 187.05882352941174, 125, 388, 129.0, 380.8, 388.0, 388.0, 0.085158394613982, 0.030310283377081373, 0.048146192543130226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 143.47058823529412, 124, 377, 129.0, 182.59999999999982, 377.0, 377.0, 0.08515626174029345, 0.06328507342222979, 0.04274445169385823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 237.76470588235296, 121, 625, 129.0, 528.1999999999999, 625.0, 625.0, 0.085158394613982, 1.494508301064981, 0.04971649612028373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 260.70588235294116, 123, 1144, 128.0, 537.5999999999995, 1144.0, 1144.0, 0.08515583517837642, 4.528859101217729, 0.04963184189566908], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 288.57142857142856, 125, 524, 227.0, 510.5, 524.0, 524.0, 0.06994124935054555, 0.15369901782502698, 0.045206167444346745], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b76b7c9a-2c70-446a-9da8-9cbf2fae2631", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 156.31578947368425, 121, 378, 129.0, 376.0, 378.0, 378.0, 0.13487899933980277, 0.10023722509530267, 0.06770293521548695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 180.0, 122, 388, 129.0, 376.0, 388.0, 388.0, 0.13466199838405601, 0.04667765815697337, 0.07620418391285243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 795.2857142857142, 624, 1016, 872.0, 1016.0, 1016.0, 1016.0, 0.0923568139537952, 27.155969837254098, 0.05267224545802383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 981.0, 867, 1124, 899.0, 1124.0, 1124.0, 1124.0, 0.09233366749327283, 83.08199631572178, 0.05256887514509576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 233.71428571428572, 125, 379, 128.0, 379.0, 379.0, 379.0, 0.09297136481963555, 0.16451573540349573, 0.05147926157493492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 141.8421052631579, 126, 380, 128.0, 134.0, 380.0, 380.0, 0.09788113109374436, 0.07274173902572213, 0.04913173963103965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96c4f364-f8be-4aea-b2d4-4cac643b5dc7", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 168.4736842105263, 120, 402, 127.0, 386.0, 402.0, 402.0, 0.09788012260773253, 0.033928019472992815, 0.05538960474461015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 234.42105263157893, 125, 906, 130.0, 378.0, 906.0, 906.0, 0.09775925497157263, 4.654643926384709, 0.0570295818219238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 180.3684210526316, 125, 618, 128.0, 390.0, 618.0, 618.0, 0.09775321942510817, 1.537734109313824, 0.05712152300802091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 127.71428571428571, 126, 131, 127.0, 131.0, 131.0, 131.0, 0.09328358208955224, 0.06932500583022387, 0.0523809176772388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cb8619c-8d0a-4048-8734-263ef71e0b8a", 3, 0, 0.0, 862.6666666666666, 205, 1923, 460.0, 1923.0, 1923.0, 1923.0, 0.02620980071814854, 0.026286587243689992, 0.016807717257406454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 725.8235294117646, 125, 1291, 879.0, 1262.2, 1291.0, 1291.0, 0.08093927649809078, 42.84974954947771, 0.04349184239218412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 193.57894736842104, 125, 869, 129.0, 374.0, 869.0, 869.0, 0.1346467295018071, 6.410979521738359, 0.07854853926015165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 539.0588235294118, 127, 1009, 630.0, 1000.2, 1009.0, 1009.0, 0.08093889113719142, 14.008230771061966, 0.04357067720856048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 165.5263157894737, 119, 878, 126.0, 132.0, 878.0, 878.0, 0.13488474453539304, 2.121841855623629, 0.07881911290208078], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 564.5714285714286, 132, 2166, 445.0, 1464.5, 2166.0, 2166.0, 0.07089253704135061, 0.01396488034352498, 0.04815510084463394], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 392.89473684210526, 255, 1037, 259.0, 766.0, 1037.0, 1037.0, 0.09768486861385171, 6.294217264643733, 0.21838010692637133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40aadf1f-b59f-43ff-a611-9fe84eb34e89", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.2367812090432503, 0.9036082896461337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c88642c-c05d-44a6-baa5-65291b72cb09", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96c4f364-f8be-4aea-b2d4-4cac643b5dc7", 3, 0, 0.0, 514.0, 226, 831, 485.0, 831.0, 831.0, 831.0, 0.024830737141816616, 0.024903483442036783, 0.01592335682596964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 469.3809523809523, 196, 1319, 436.0, 828.0, 1270.8999999999992, 1319.0, 0.09663036125950775, 0.05935595432834997, 0.043691266858546955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 143.17647058823533, 122, 380, 128.0, 183.19999999999982, 380.0, 380.0, 0.08093773507650998, 0.06015001600900789, 0.04062694905207629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 215.41176470588238, 119, 384, 128.0, 383.2, 384.0, 384.0, 0.08094197412713604, 0.09317068460245588, 0.04216347779095069], "isController": false}, {"data": ["login", 21, 0, 0.0, 2445.4285714285716, 1512, 3731, 2446.0, 3269.0, 3688.2999999999993, 3731.0, 0.09718442827789193, 38.88614081358407, 0.20034797665491197], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=557b0791-33cc-4206-adee-969319b1f4bd", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 133.6842105263158, 127, 151, 132.0, 145.0, 151.0, 151.0, 0.13324356924457909, 0.10787003799194927, 0.04736392500490897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b76b7c9a-2c70-446a-9da8-9cbf2fae2631", 3, 0, 0.0, 301.0, 203, 383, 317.0, 383.0, 383.0, 383.0, 0.026806537220876933, 0.0316844194820977, 0.017190390079794126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0d10a18-132f-4521-b3ca-135da8a3df26", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 872.1176470588236, 250, 1424, 1021.0, 1395.2, 1424.0, 1424.0, 0.08088844056602876, 56.97555834584329, 0.16974584227467812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f677a91-1834-4c90-9766-11a4b4150f4f", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61c010c7-c3cf-4694-96ce-bab9695e04df", 3, 0, 0.0, 587.0, 268, 996, 497.0, 996.0, 996.0, 996.0, 0.018968373398753145, 0.026149434031158717, 0.012163963410007715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77fd0bc2-518d-46a7-a19f-c55c3013dd5f", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.5859375, 1.094825114678899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 502.8235294117648, 256, 1271, 507.0, 959.7999999999997, 1271.0, 1271.0, 0.08509999249117713, 6.112905320001001, 0.19011107582659625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 815.1, 125, 1252, 1010.0, 1250.9, 1252.0, 1252.0, 0.11712756362954893, 98.09710259349708, 0.20795861663562787], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 959.7727272727275, 197, 1846, 1002.0, 1625.4, 1814.3499999999995, 1846.0, 0.0925992179575138, 0.028986580479243042, 0.04177816278942517], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cb8619c-8d0a-4048-8734-263ef71e0b8a", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61c010c7-c3cf-4694-96ce-bab9695e04df", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 148.37499999999997, 127, 378, 132.0, 218.40000000000015, 378.0, 378.0, 0.08294066114074511, 0.06439240781923083, 0.029482813139874244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 364.8947368421052, 248, 1254, 261.0, 754.0, 1254.0, 1254.0, 0.13452089321873098, 8.6677060691933, 0.30072914527902467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 397.0555555555556, 247, 762, 384.0, 539.7000000000004, 762.0, 762.0, 0.09390700076690718, 0.14553750997761883, 0.2111990456701047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 176.72727272727272, 125, 398, 130.0, 394.0, 398.0, 398.0, 0.06583830113241879, 0.04892865933766669, 0.03304774099810864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 152.0, 120, 386, 127.0, 336.8000000000002, 386.0, 386.0, 0.06583987741811914, 0.01761731094977016, 0.037549305090021065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 173.1818181818182, 122, 386, 127.0, 383.8, 386.0, 386.0, 0.06584145377929945, 0.017746329338951802, 0.03870757341322096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c08b248b-1246-442e-ad87-ebbfdd934d16", 1, 0, 0.0, 2166.0, 2166, 2166, 2166.0, 2166.0, 2166.0, 2166.0, 0.4616805170821791, 0.08340907779316713, 0.3183070752539243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 198.63636363636363, 126, 389, 129.0, 388.4, 389.0, 389.0, 0.06583987741811914, 0.017745904460352423, 0.038770943440552576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 257.5, 132, 383, 257.5, 383.0, 383.0, 383.0, 0.07865963973885, 0.02319844843860615, 0.04862456245575396], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1184.7894736842104, 955, 1792, 1027.0, 1590.4, 1645.4999999999998, 1792.0, 0.2526024701862611, 302.2003731702939, 0.4987912057779491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbaee9b0-cfa9-4f90-9729-fdf8eb6aaa33", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 959.7727272727275, 197, 1846, 1002.0, 1625.4, 1814.3499999999995, 1846.0, 0.08924804465647616, 0.02793755375166326, 0.040266207647746084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 188.0, 123, 373, 128.0, 373.0, 373.0, 373.0, 0.029965015844002126, 0.008076508176703698, 0.017645414603450472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 252.25, 127, 378, 252.0, 378.0, 378.0, 378.0, 0.02990877822640945, 0.008061350381336922, 0.017583090324510244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 245.5625, 122, 1145, 127.5, 708.9000000000004, 1145.0, 1145.0, 0.08149544134874956, 4.603701556371925, 0.04747268629348546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 214.87499999999997, 125, 629, 127.5, 544.3000000000001, 629.0, 629.0, 0.08150125308176613, 1.5183488451017746, 0.047555662808940684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 130.8125, 126, 149, 129.5, 140.60000000000002, 149.0, 149.0, 0.08165806705148031, 0.060685340845875506, 0.04098852193795008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 127.5, 126, 128, 128.0, 128.0, 128.0, 128.0, 0.02996524032122738, 0.00801804282032842, 0.01708955112069999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 158.4375, 121, 383, 127.0, 379.5, 383.0, 383.0, 0.08166056764302083, 0.029516228123899497, 0.04614340425043255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 193.0, 125, 386, 130.5, 386.0, 386.0, 386.0, 0.02996389350832247, 0.022268088827962305, 0.015040469983669678], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 496.83333333333337, 127, 996, 448.0, 946.5000000000002, 996.0, 996.0, 0.06903018344771251, 0.012971247849997413, 0.046980747409929996], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 135.0, 132, 143, 132.5, 143.0, 143.0, 143.0, 0.029421283356380005, 0.02315776795433817, 0.010458346818088205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1213.857142857143, 716, 1829, 1165.0, 1732.8000000000002, 1824.6, 1829.0, 0.0996436553088716, 0.05157337628291206, 0.045832189111795436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 447.0, 254, 764, 385.0, 764.0, 764.0, 764.0, 0.029879064486490928, 0.046306714199278426, 0.067198716320692], "isController": false}, {"data": ["addBook", 64, 11, 17.1875, 1147.2343750000002, 639, 3040, 1007.5, 1946.0, 2197.0, 3040.0, 0.3065222180714005, 81.40072234774466, 1.1174104320526452], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 232.71929824561403, 126, 593, 132.0, 509.4, 514.5999999999999, 593.0, 0.25359030484224016, 0.1884592011571726, 0.12258515712588756], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 715.0350877192984, 594, 1013, 634.0, 898.2, 912.1999999999994, 1013.0, 0.25322529054270176, 74.45664329052937, 0.1273545162397377], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 204.56140350877192, 124, 520, 131.0, 384.2, 403.09999999999934, 520.0, 0.25378902562823913, 0.44908761175622003, 0.12342474097935849], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 946.6842105263156, 828, 1282, 881.0, 1127.6, 1146.8999999999999, 1282.0, 0.25323316554784997, 227.8596474963792, 0.12711117880038564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 161.05555555555551, 128, 392, 131.0, 388.4, 392.0, 392.0, 0.09804135166343493, 0.07324378322512473, 0.034850636724111636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 11, 5.945945945945946, 191.50270270270272, 122, 1513, 133.0, 316.0, 380.7, 949.6999999999911, 0.7683298585442433, 1.5956188131276423, 0.3715514059398128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 132.0909090909091, 129, 139, 132.0, 138.2, 139.0, 139.0, 0.06413246268656717, 0.04966508096723414, 0.02279708634561567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f13c8105-3d1d-4fa5-9564-616933112d43", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 132.52941176470586, 126, 157, 130.0, 149.0, 157.0, 157.0, 0.08446491476496396, 0.06854525797820805, 0.030024637670358283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 376.99999999999994, 251, 784, 260.0, 780.2, 784.0, 784.0, 0.0657886867381969, 0.10195961509132666, 0.14796029839655028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 395.9375, 253, 1275, 260.0, 852.9000000000004, 1275.0, 1275.0, 0.08144068573057385, 6.207789427790107, 0.18185967578972015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40aadf1f-b59f-43ff-a611-9fe84eb34e89", 3, 0, 0.0, 949.3333333333334, 476, 1858, 514.0, 1858.0, 1858.0, 1858.0, 0.08077979428079056, 0.03655075327158167, 0.051802146723033016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 134.3157894736842, 127, 157, 133.0, 146.0, 157.0, 157.0, 0.09983396036066332, 0.08277249252558902, 0.03548785309695454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/557b0791-33cc-4206-adee-969319b1f4bd", 2, 0, 0.0, 351.5, 233, 470, 351.5, 470.0, 470.0, 470.0, 0.018138450794917604, 0.025826036385732293, 0.011274535088833063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 146.0, 128, 381, 131.0, 186.59999999999982, 381.0, 381.0, 0.08497408290471406, 0.06597108975512468, 0.030205631032535075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11565cd0-a9e4-426e-8fd9-3e18e7552c8c", 3, 0, 0.0, 403.6666666666667, 253, 524, 434.0, 524.0, 524.0, 524.0, 0.019391244206865794, 0.026732395578149947, 0.012435140327970577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f677a91-1834-4c90-9766-11a4b4150f4f", 3, 0, 0.0, 294.0, 209, 449, 224.0, 449.0, 449.0, 449.0, 0.06013470173187941, 0.02787493986529827, 0.038562943493425275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 141.55555555555557, 121, 378, 128.0, 157.50000000000034, 378.0, 378.0, 0.09396877104508936, 0.06983421363800098, 0.047167918278492114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 182.55555555555554, 121, 388, 126.5, 383.5, 388.0, 388.0, 0.09396975218088134, 0.02514425009527489, 0.05359212429065889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0d10a18-132f-4521-b3ca-135da8a3df26", 3, 0, 0.0, 311.3333333333333, 228, 404, 302.0, 404.0, 404.0, 404.0, 0.06331785563528915, 0.04070728023427606, 0.04060422382861967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 195.83333333333334, 120, 385, 127.0, 381.4, 385.0, 385.0, 0.09396729937981582, 0.025327123660965983, 0.05524249436196203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 240.16666666666663, 120, 385, 129.5, 385.0, 385.0, 385.0, 0.09397024275646045, 0.02532791699295223, 0.055335992560689114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c88642c-c05d-44a6-baa5-65291b72cb09", 3, 0, 0.0, 406.0, 283, 498, 437.0, 498.0, 498.0, 498.0, 0.021997521612564984, 0.026000325838288887, 0.014106483586182625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5135730007336757], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1467351430667645], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07336757153338225], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1005135730007336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 25, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
