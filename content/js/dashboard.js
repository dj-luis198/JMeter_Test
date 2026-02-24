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

    var data = {"OkPercent": 98.07692307692308, "KoPercent": 1.9230769230769231};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8201840894148587, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1bcc2a0-41b8-4f33-84d7-9e8ebd878f3a"], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d17b29e-be40-4280-b1c9-6c307916624b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0504299-4ae7-4c56-929c-7515cc1d55df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f36aac4-9908-4399-be3a-742c77c9abb4"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=855dbed0-860b-415a-91be-b22c84ba7772"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68ca3114-0c59-4c2c-bcc0-a218bdfe0d96"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b2ddbb0-f21f-4e97-a7d0-2a4553c784a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a967a10-342e-47f6-812d-e2393729f8bc"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a98230a5-d3ff-4b66-873f-b8585abe82a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40945bf3-2c06-4244-843b-e5e23d2f4e10"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d2b9c77-0a3f-40eb-a183-655301bbae22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/500ac40b-1e66-4b96-9f80-b2729956e941"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc19d0d3-8298-41d8-80a1-842b29305d3d"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68ca3114-0c59-4c2c-bcc0-a218bdfe0d96"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7491a05c-4547-480a-989d-e2535afeae8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1bcc2a0-41b8-4f33-84d7-9e8ebd878f3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/855dbed0-860b-415a-91be-b22c84ba7772"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f36aac4-9908-4399-be3a-742c77c9abb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b2ddbb0-f21f-4e97-a7d0-2a4553c784a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97d2ace6-967b-409b-8872-ddbc4e4be2d2"], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74af0009-d30e-43b3-9db1-9fbe607ac6a1"], "isController": false}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8482142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9441176470588235, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a98230a5-d3ff-4b66-873f-b8585abe82a4"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc19d0d3-8298-41d8-80a1-842b29305d3d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97d2ace6-967b-409b-8872-ddbc4e4be2d2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6d2b9c77-0a3f-40eb-a183-655301bbae22"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40945bf3-2c06-4244-843b-e5e23d2f4e10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9b7509b-fd12-4fd3-b563-91f5d67ec4a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a967a10-342e-47f6-812d-e2393729f8bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d17b29e-be40-4280-b1c9-6c307916624b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=500ac40b-1e66-4b96-9f80-b2729956e941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 25, 1.9230769230769231, 283.6584615384617, 81, 3499, 102.0, 682.9000000000001, 842.95, 1394.1600000000008, 5.138807085229091, 722.1582929537567, 3.7487813862525052], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1bcc2a0-41b8-4f33-84d7-9e8ebd878f3a", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1319.053571428571, 990, 3843, 1199.5, 1532.8, 1891.7999999999975, 3843.0, 0.2417367055603759, 290.8897527850982, 1.188617492672356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d17b29e-be40-4280-b1c9-6c307916624b", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0504299-4ae7-4c56-929c-7515cc1d55df", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f36aac4-9908-4399-be3a-742c77c9abb4", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 1.136251965408805, 4.336183176100628], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 532.375, 95, 1311, 451.0, 1121.3000000000002, 1311.0, 1311.0, 0.0865093997869706, 0.01748245988126585, 0.05802318080194214], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 532.375, 95, 1311, 451.0, 1121.3000000000002, 1311.0, 1311.0, 0.0877529753743213, 0.01773377084133165, 0.058857266014918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 124.64705882352942, 82, 257, 86.0, 253.8, 257.0, 257.0, 0.08857580525827663, 0.03935232524514657, 0.04964071438992112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 95.76470588235294, 84, 254, 86.0, 121.19999999999987, 254.0, 254.0, 0.08857488224750949, 0.06582566932651827, 0.04446043894064441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 173.88235294117646, 83, 581, 86.0, 449.7999999999999, 581.0, 581.0, 0.08857672828828078, 3.085124189783456, 0.051264392090098164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 193.2941176470588, 83, 765, 87.0, 611.3999999999999, 765.0, 765.0, 0.0885771898104969, 9.397760999854109, 0.05117815803733789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=855dbed0-860b-415a-91be-b22c84ba7772", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68ca3114-0c59-4c2c-bcc0-a218bdfe0d96", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 176.25, 85, 291, 177.0, 248.30000000000004, 291.0, 291.0, 0.08676083832660034, 0.15531058516118537, 0.05607363995607733], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 115.11111111111113, 83, 259, 85.5, 252.70000000000002, 259.0, 259.0, 0.09803921568627451, 0.07285922181372549, 0.04921109068627451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 112.27777777777779, 82, 254, 85.5, 251.3, 254.0, 254.0, 0.09795438590762902, 0.034383945140101985, 0.05540757527522462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 448.0, 401, 590, 421.0, 590.0, 590.0, 590.0, 0.07753380473886613, 22.797512957837117, 0.0442184980151346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 684.0, 572, 754, 750.0, 754.0, 754.0, 754.0, 0.07735268181747862, 69.60207907087826, 0.04403966162069339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 204.0, 86, 346, 247.0, 346.0, 346.0, 346.0, 0.07793138920494397, 0.137902028554061, 0.0431514625773469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 102.9, 84, 256, 86.5, 239.20000000000005, 256.0, 256.0, 0.053217815195814956, 0.03954956773829607, 0.0267128486432118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 85.2, 84, 87, 85.0, 87.0, 87.0, 87.0, 0.053217815195814956, 0.014239923206692671, 0.03035078522886321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 116.9, 82, 247, 85.5, 246.7, 247.0, 247.0, 0.053218098410907584, 0.014343940587314934, 0.031286421136099966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 134.5, 82, 254, 86.0, 253.2, 254.0, 254.0, 0.053170277814701586, 0.014331051442243786, 0.03131023195533697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 120.2, 84, 257, 87.0, 257.0, 257.0, 257.0, 0.07793746297970508, 0.05792032160894099, 0.043763712122392995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 503.2, 82, 758, 729.0, 756.2, 758.0, 758.0, 0.0944864034065498, 56.68784359586906, 0.05013438722417844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 139.72222222222223, 81, 751, 84.0, 302.8000000000007, 751.0, 751.0, 0.09794958861172784, 4.921334449210417, 0.0571160036023682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 387.46666666666664, 82, 664, 428.0, 619.6, 664.0, 664.0, 0.0944864034065498, 18.529915576398558, 0.05022665910250516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 139.2222222222222, 82, 413, 85.5, 269.0000000000002, 413.0, 413.0, 0.09804028366322073, 1.6264623491268968, 0.05726463183150143], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 390.79999999999995, 109, 1297, 382.0, 899.8000000000002, 1297.0, 1297.0, 0.08630659555003194, 0.01690732721419571, 0.05868398983883682], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 254.4, 170, 503, 175.5, 486.80000000000007, 503.0, 503.0, 0.05314597605242319, 0.08236588280780821, 0.11952654575071349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b2ddbb0-f21f-4e97-a7d0-2a4553c784a3", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.0949337121212122, 4.178503787878788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a967a10-342e-47f6-812d-e2393729f8bc", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 554.1818181818184, 127, 1849, 382.0, 1258.7, 1764.0999999999988, 1849.0, 0.08981608116107698, 0.055170229541325604, 0.04061020075935414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 85.73333333333332, 84, 89, 85.0, 87.8, 89.0, 89.0, 0.09448342760679777, 0.07021668789919248, 0.04742625174794341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 139.6, 82, 256, 87.0, 250.6, 256.0, 256.0, 0.0944858082316036, 0.11989117203346059, 0.048596216473285714], "isController": false}, {"data": ["login", 22, 0, 0.0, 2108.8636363636365, 1249, 3494, 1944.5, 2760.9, 3384.3499999999985, 3494.0, 0.09064913018039177, 24.77221267444807, 0.17093284135578135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 91.88888888888889, 87, 99, 90.0, 99.0, 99.0, 99.0, 0.09438711301283666, 0.07641300457777497, 0.03355166907878178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a98230a5-d3ff-4b66-873f-b8585abe82a4", 3, 0, 0.0, 372.6666666666667, 219, 532, 367.0, 532.0, 532.0, 532.0, 0.0256001092271327, 0.02567510954713407, 0.01641673671140997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40945bf3-2c06-4244-843b-e5e23d2f4e10", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 595.8666666666666, 169, 846, 819.0, 844.2, 846.0, 846.0, 0.0944328676743703, 75.36514411045813, 0.1962740430015802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d2b9c77-0a3f-40eb-a183-655301bbae22", 1, 0, 0.0, 1297.0, 1297, 1297, 1297.0, 1297.0, 1297.0, 1297.0, 0.7710100231303006, 0.1392938030069391, 0.5315752698535081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/500ac40b-1e66-4b96-9f80-b2729956e941", 3, 0, 0.0, 230.0, 164, 352, 174.0, 352.0, 352.0, 352.0, 0.019587615403700753, 0.02700310912587002, 0.012561068471774248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 321.05882352941177, 171, 853, 333.0, 704.9999999999999, 853.0, 853.0, 0.08853474988933156, 12.582050271137673, 0.19645173391401716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc19d0d3-8298-41d8-80a1-842b29305d3d", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 445.3, 85, 1011, 372.0, 994.1, 1011.0, 1011.0, 0.11608873823150416, 69.45677635359468, 0.1691449193763713], "isController": false}, {"data": ["register", 24, 6, 25.0, 861.9583333333333, 104, 1595, 837.0, 1490.0, 1576.25, 1595.0, 0.09529103470181846, 0.030057621297546255, 0.042992634797109505], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 93.75, 85, 129, 89.0, 122.7, 129.0, 129.0, 0.07698192368204541, 0.059766239577369235, 0.027364668183852078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 284.55555555555554, 169, 836, 176.0, 546.2000000000005, 836.0, 836.0, 0.09790377147084099, 6.65035482468426, 0.21879623233652787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68ca3114-0c59-4c2c-bcc0-a218bdfe0d96", 3, 0, 0.0, 249.66666666666669, 158, 389, 202.0, 389.0, 389.0, 389.0, 0.0508130081300813, 0.03266786818258808, 0.032585164718834686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 283.5555555555555, 170, 995, 182.0, 408.20000000000095, 995.0, 995.0, 0.10486699369632849, 7.123348845516354, 0.23435770422847024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7491a05c-4547-480a-989d-e2535afeae8b", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 97.84615384615385, 83, 250, 85.0, 186.79999999999995, 250.0, 250.0, 0.0754589938413852, 0.0560784124153263, 0.03787687776803905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 97.0, 82, 255, 84.0, 188.19999999999993, 255.0, 255.0, 0.07546118392792878, 0.020191762105715313, 0.04303645645889687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 123.38461538461537, 81, 254, 86.0, 253.6, 254.0, 254.0, 0.07545986986074751, 0.020338793048404604, 0.04436215005485353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 111.23076923076923, 82, 254, 86.0, 253.2, 254.0, 254.0, 0.07538679223400059, 0.020319096344320477, 0.04439280831748278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 110.5, 109, 112, 110.5, 112.0, 112.0, 112.0, 0.05708088361207832, 0.01683440122153091, 0.03528535090473201], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 847.3035714285713, 651, 3499, 678.5, 1117.9000000000003, 1200.6, 3499.0, 0.23737161798429107, 283.978978835777, 0.46871622223069975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 861.9583333333333, 104, 1595, 837.0, 1490.0, 1576.25, 1595.0, 0.09671569615152126, 0.030507001813419303, 0.04363540197461213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 85.16666666666667, 85, 86, 85.0, 86.0, 86.0, 86.0, 0.030019362488805282, 0.008091156295810798, 0.017677417559325764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 140.33333333333331, 83, 254, 86.0, 254.0, 254.0, 254.0, 0.029994750918589247, 0.008084522708526009, 0.017633632864248756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1bcc2a0-41b8-4f33-84d7-9e8ebd878f3a", 3, 0, 0.0, 274.6666666666667, 185, 379, 260.0, 379.0, 379.0, 379.0, 0.07029547531457225, 0.03180687196850763, 0.04507880415680578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/855dbed0-860b-415a-91be-b22c84ba7772", 3, 0, 0.0, 250.33333333333334, 182, 357, 212.0, 357.0, 357.0, 357.0, 0.04983057604145904, 0.03203625901102917, 0.031955154557836686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 136.1875, 82, 567, 84.5, 352.8000000000002, 567.0, 567.0, 0.07564224997872562, 4.273053046787096, 0.04406308800030257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 168.43749999999997, 81, 572, 86.0, 355.7000000000002, 572.0, 572.0, 0.07558293337364423, 1.4080919649436907, 0.04410234637768792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 84.33333333333334, 81, 87, 84.5, 87.0, 87.0, 87.0, 0.030019362488805282, 0.00803252472844985, 0.01712041766939676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 108.1875, 82, 250, 86.0, 248.6, 250.0, 250.0, 0.07564081956828002, 0.05621353876119248, 0.03796814575985931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 86.33333333333334, 83, 95, 85.0, 95.0, 95.0, 95.0, 0.030017560272759564, 0.022307972038642605, 0.015067408183787516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 136.06250000000003, 82, 255, 86.0, 250.1, 255.0, 255.0, 0.07558400453504027, 0.027319853201691193, 0.04270976037508562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 528.3333333333334, 87, 2562, 89.5, 2562.0, 2562.0, 2562.0, 0.030430284218854603, 0.023951961992575013, 0.010817015093420973], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 602.8, 85, 2248, 396.0, 1678.0000000000005, 2248.0, 2248.0, 0.08494252222662665, 0.01633042110255394, 0.05780626203352398], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1177.909090909091, 654, 2165, 1161.5, 1841.2999999999997, 2136.2, 2165.0, 0.08967842133368117, 0.0464155891668467, 0.041248570750159995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f36aac4-9908-4399-be3a-742c77c9abb4", 3, 0, 0.0, 283.3333333333333, 177, 399, 274.0, 399.0, 399.0, 399.0, 0.07519362358072035, 0.034023156502995214, 0.04821986928841768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 228.16666666666669, 170, 337, 178.0, 337.0, 337.0, 337.0, 0.029980213059380808, 0.04646347473167709, 0.06742620183179102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b2ddbb0-f21f-4e97-a7d0-2a4553c784a3", 3, 0, 0.0, 351.0, 178, 688, 187.0, 688.0, 688.0, 688.0, 0.06032333306522963, 0.027962378347944985, 0.03868390824821041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97d2ace6-967b-409b-8872-ddbc4e4be2d2", 3, 0, 0.0, 278.0, 177, 375, 282.0, 375.0, 375.0, 375.0, 0.03937679656634334, 0.032826815106251725, 0.02525139623557825], "isController": false}, {"data": ["addBook", 57, 9, 15.789473684210526, 819.5087719298244, 436, 1562, 706.0, 1245.8, 1297.8999999999987, 1562.0, 0.26648713848915817, 84.95401142768146, 0.9680384545031651], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74af0009-d30e-43b3-9db1-9fbe607ac6a1", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 199.9821428571428, 83, 2848, 87.0, 342.0, 464.4999999999999, 2848.0, 0.23796168816820493, 0.17684457489844135, 0.1150303082453725], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 469.26785714285705, 404, 679, 419.0, 592.0, 652.4, 679.0, 0.2381164984968896, 70.0141567699497, 0.1197558561776349], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 137.82142857142864, 83, 357, 88.0, 256.0, 271.14999999999986, 357.0, 0.23829178829476694, 0.4216647660059743, 0.11588799860429096], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 642.4285714285714, 563, 826, 588.0, 756.0, 769.9999999999999, 826.0, 0.2379525879468516, 214.11015691061056, 0.11944104512175949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 101.38888888888889, 86, 259, 91.5, 117.70000000000022, 259.0, 259.0, 0.10769285996338443, 0.08045413854686434, 0.03828144631510931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, 5.294117647058823, 137.68235294117645, 83, 540, 92.0, 259.0, 300.9, 448.40999999999894, 0.7096165566065301, 1.5706421651549052, 0.33961967944115606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 91.9230769230769, 86, 107, 90.0, 104.2, 107.0, 107.0, 0.0735668609586328, 0.05697121166034746, 0.026150720106388997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 100.17647058823528, 87, 254, 90.0, 128.3999999999999, 254.0, 254.0, 0.08365359538232153, 0.0678868532838957, 0.02973623898355961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a98230a5-d3ff-4b66-873f-b8585abe82a4", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 236.0, 168, 504, 174.0, 437.99999999999994, 504.0, 504.0, 0.07534877790078305, 0.11677588918802997, 0.1694611674858431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc19d0d3-8298-41d8-80a1-842b29305d3d", 3, 0, 0.0, 527.0, 257, 1033, 291.0, 1033.0, 1033.0, 1033.0, 0.026737014723182774, 0.026815345821004602, 0.017145806967666037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97d2ace6-967b-409b-8872-ddbc4e4be2d2", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 288.3125, 169, 654, 189.5, 549.0000000000001, 654.0, 654.0, 0.07555152614082805, 5.7588901790689215, 0.16870899263844816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d2b9c77-0a3f-40eb-a183-655301bbae22", 3, 0, 0.0, 870.6666666666666, 162, 2248, 202.0, 2248.0, 2248.0, 2248.0, 0.0196174595389897, 0.026884604381232628, 0.012580206800719305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40945bf3-2c06-4244-843b-e5e23d2f4e10", 3, 0, 0.0, 543.6666666666667, 162, 1298, 171.0, 1298.0, 1298.0, 1298.0, 0.04306014066312616, 0.02768352142241998, 0.027613436558059423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 108.7, 84, 253, 93.5, 238.10000000000005, 253.0, 253.0, 0.0552959716884625, 0.04584597652686002, 0.019655989936133152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 91.60000000000001, 86, 103, 89.0, 102.4, 103.0, 103.0, 0.09648225691295371, 0.0749056584431623, 0.034296427262026516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9b7509b-fd12-4fd3-b563-91f5d67ec4a9", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 2.008402122641509, 3.752702437106918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a967a10-342e-47f6-812d-e2393729f8bc", 3, 0, 0.0, 313.3333333333333, 230, 396, 314.0, 396.0, 396.0, 396.0, 0.020242778388809793, 0.023926278753179805, 0.012981208797511488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d17b29e-be40-4280-b1c9-6c307916624b", 3, 0, 0.0, 265.0, 176, 425, 194.0, 425.0, 425.0, 425.0, 0.01691570341133352, 0.023319662743163237, 0.01084763532562729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=500ac40b-1e66-4b96-9f80-b2729956e941", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 95.72222222222221, 83, 253, 86.0, 116.20000000000022, 253.0, 253.0, 0.10502485588255886, 0.07805069856115947, 0.05271755461292506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 120.88888888888889, 81, 252, 85.0, 248.4, 252.0, 252.0, 0.10492751257672825, 0.03683165182136674, 0.05935190137396749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 147.66666666666669, 82, 742, 84.5, 301.9000000000007, 742.0, 742.0, 0.10502669428479738, 5.276913318332993, 0.061242779414767926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 159.05555555555554, 83, 419, 87.0, 273.2000000000002, 419.0, 419.0, 0.10492017323486381, 1.7405978956219144, 0.06128312635886197], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.46153846153846156], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.23076923076923078], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15384615384615385], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0769230769230769], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 25, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
