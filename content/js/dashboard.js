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

    var data = {"OkPercent": 98.33711262282691, "KoPercent": 1.6628873771730914};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8094928478543563, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3090909090909091, 500, 1500, "see books"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e07bfb8-da95-4b9e-8670-9088f0103c1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/453057df-17fa-4f3c-9c61-6350c5e3b2fd"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f826a457-6def-4984-817e-99ef5b411958"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2614d87b-bbd0-41b8-827c-384f226419f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f7123a7-8742-4902-a65c-ee0be39a3c2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4d8f3ce6-f3c1-447f-bfc4-25d988f7ff96"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d44f526-04cd-4c44-9f9a-3bd2804f6e09"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e5df7c3-b0ad-47a9-a6f1-62fb4e4be8a0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1100eaca-8bf3-4a47-af5b-bf804c99bc36"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65916268-b18e-45a6-a144-271dfddbab5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/754f576e-96a2-4c02-8818-d443ec05aabb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83b13db2-9454-44ab-a9f9-2c70d6a37c8a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b34ee3c0-8d61-43b6-bf3a-6a459f79331a"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f826a457-6def-4984-817e-99ef5b411958"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=453057df-17fa-4f3c-9c61-6350c5e3b2fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d8f3ce6-f3c1-447f-bfc4-25d988f7ff96"], "isController": false}, {"data": [0.3412698412698413, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7818181818181819, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2614d87b-bbd0-41b8-827c-384f226419f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1100eaca-8bf3-4a47-af5b-bf804c99bc36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e5df7c3-b0ad-47a9-a6f1-62fb4e4be8a0"], "isController": false}, {"data": [0.9281767955801105, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43e3cfc5-953e-427e-ae4e-67aa817959ea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d44f526-04cd-4c44-9f9a-3bd2804f6e09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbb0ced1-2695-4b33-820b-de9a07a18383"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65916268-b18e-45a6-a144-271dfddbab5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=754f576e-96a2-4c02-8818-d443ec05aabb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1564700d-21ef-4a3a-a88e-5335be103cb3"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e07bfb8-da95-4b9e-8670-9088f0103c1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b34ee3c0-8d61-43b6-bf3a-6a459f79331a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83b13db2-9454-44ab-a9f9-2c70d6a37c8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 22, 1.6628873771730914, 312.8102796674224, 81, 2312, 99.0, 901.6000000000001, 1095.3999999999996, 1555.1599999999999, 5.251813125960153, 715.7499834702357, 3.840068917642202], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1430.3636363636365, 993, 1943, 1393.0, 1746.4, 1807.7999999999995, 1943.0, 0.2373533803436877, 285.61458392896446, 1.1670647168266284], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 537.2142857142858, 89, 845, 509.5, 844.0, 845.0, 845.0, 0.07993605115907275, 0.015093951624414756, 0.054058315847322146], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 537.2142857142858, 89, 845, 509.5, 844.0, 845.0, 845.0, 0.07994837619137357, 0.015096278902765643, 0.054066650891138865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 111.76923076923077, 83, 260, 86.0, 258.4, 260.0, 260.0, 0.12847500172947118, 0.049220440866909784, 0.07244090767588722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 99.07692307692308, 84, 248, 86.0, 185.59999999999994, 248.0, 248.0, 0.12847373206309048, 0.09547706064454282, 0.06448779128948097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 148.6153846153846, 82, 594, 84.0, 454.79999999999984, 594.0, 594.0, 0.12847500172947118, 2.937804047209622, 0.07480541905086623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e07bfb8-da95-4b9e-8670-9088f0103c1b", 3, 0, 0.0, 319.6666666666667, 201, 445, 313.0, 445.0, 445.0, 445.0, 0.01840795714627576, 0.021757582160848728, 0.01180458189393335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/453057df-17fa-4f3c-9c61-6350c5e3b2fd", 3, 0, 0.0, 338.3333333333333, 194, 470, 351.0, 470.0, 470.0, 470.0, 0.024015754334843657, 0.028385808590435324, 0.01540072787748763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 200.07692307692307, 84, 919, 87.0, 652.1999999999998, 919.0, 919.0, 0.12847500172947118, 8.924428363450838, 0.07467995518198978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f826a457-6def-4984-817e-99ef5b411958", 3, 0, 0.0, 358.6666666666667, 236, 550, 290.0, 550.0, 550.0, 550.0, 0.14522218995062447, 0.06826199293252008, 0.09312751113370123], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 230.8571428571429, 85, 376, 209.5, 360.5, 376.0, 376.0, 0.08000457168981084, 0.16695150437167838, 0.05171612484999143], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2614d87b-bbd0-41b8-827c-384f226419f2", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 97.875, 83, 254, 85.5, 144.80000000000013, 254.0, 254.0, 0.17100959791368292, 0.1270881875120241, 0.08583880207776662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 621.6, 487, 812, 655.0, 812.0, 812.0, 812.0, 0.023003312476996687, 6.763737650096614, 0.013119076647037172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 94.62500000000001, 81, 251, 84.0, 137.6000000000001, 251.0, 251.0, 0.17100045956373508, 0.045755982344202556, 0.09752369959494267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 967.6, 818, 1127, 982.0, 1127.0, 1127.0, 1127.0, 0.022951045420118887, 20.651391012657502, 0.013066854960868467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 186.4, 89, 255, 247.0, 255.0, 255.0, 255.0, 0.023028527740164517, 0.04074969947771299, 0.01275114768425125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f7123a7-8742-4902-a65c-ee0be39a3c2b", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 84.92307692307693, 83, 91, 84.0, 89.4, 91.0, 91.0, 0.0675879423110917, 0.05022892978392655, 0.0339259788553722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 109.15384615384616, 81, 252, 84.0, 249.2, 252.0, 252.0, 0.067589347918768, 0.025894356549407815, 0.038110400050951974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 193.6153846153846, 82, 1358, 83.0, 913.1999999999996, 1358.0, 1358.0, 0.067589347918768, 4.695047951067912, 0.039288339407709344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d8f3ce6-f3c1-447f-bfc4-25d988f7ff96", 3, 0, 0.0, 693.3333333333334, 181, 1360, 539.0, 1360.0, 1360.0, 1360.0, 0.04142902517503763, 0.026634871328352645, 0.026567441274356816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 142.61538461538458, 82, 687, 84.0, 511.39999999999986, 687.0, 687.0, 0.06758899651136795, 1.545539792371802, 0.03935414002100458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 85.0, 82, 92, 83.0, 92.0, 92.0, 92.0, 0.023044872976660153, 0.017126121421131228, 0.012940236290605067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 551.3333333333334, 84, 1231, 537.0, 1103.2000000000003, 1231.0, 1231.0, 0.08101940414729328, 36.46161976496496, 0.04414924561932582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 104.81250000000001, 81, 249, 84.0, 248.3, 249.0, 249.0, 0.1709986320109439, 0.046089475034199724, 0.10052849264705882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 384.4444444444444, 82, 742, 415.0, 692.5000000000001, 742.0, 742.0, 0.08101976882359295, 11.922169751606893, 0.04422856520741061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 106.25, 83, 250, 86.5, 247.2, 250.0, 250.0, 0.1710077701655569, 0.046091938052435256, 0.1007008646580379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d44f526-04cd-4c44-9f9a-3bd2804f6e09", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 493.15384615384625, 92, 975, 430.0, 916.1999999999999, 975.0, 975.0, 0.08107821553084403, 0.015360521301741934, 0.05545501445375112], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e5df7c3-b0ad-47a9-a6f1-62fb4e4be8a0", 3, 0, 0.0, 451.3333333333333, 345, 543, 466.0, 543.0, 543.0, 543.0, 0.03980099502487562, 0.03318045190713101, 0.025523424543946932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 305.61538461538464, 168, 1442, 169.0, 1002.3999999999996, 1442.0, 1442.0, 0.06755808696284825, 6.313798544383065, 0.1506100771331466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1100eaca-8bf3-4a47-af5b-bf804c99bc36", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 545.6666666666667, 170, 1143, 450.0, 1118.0, 1142.6, 1143.0, 0.0866218707849179, 0.05320816086300133, 0.03916594352872753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 86.66666666666666, 83, 92, 86.0, 91.1, 92.0, 92.0, 0.08101685150511306, 0.060208812495499066, 0.04066666179065246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65916268-b18e-45a6-a144-271dfddbab5b", 3, 0, 0.0, 584.3333333333334, 218, 1100, 435.0, 1100.0, 1100.0, 1100.0, 0.019316206297083253, 0.026628949761766788, 0.012387020314210288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 121.61111111111111, 83, 256, 84.5, 249.70000000000002, 256.0, 256.0, 0.08101940414729328, 0.0825226938726825, 0.042804196917661776], "isController": false}, {"data": ["login", 21, 0, 0.0, 2672.666666666667, 1623, 3788, 2630.0, 3583.4, 3773.0, 3788.0, 0.08902077151335312, 25.479509160396354, 0.1694598810406952], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/754f576e-96a2-4c02-8818-d443ec05aabb", 3, 0, 0.0, 524.6666666666666, 192, 823, 559.0, 823.0, 823.0, 823.0, 0.06235709831635835, 0.028214963105383496, 0.039988113178133444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 93.625, 85, 114, 91.5, 113.3, 114.0, 114.0, 0.17046302017856, 0.13800180051565064, 0.060594276704097505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83b13db2-9454-44ab-a9f9-2c70d6a37c8a", 3, 0, 0.0, 374.0, 188, 672, 262.0, 672.0, 672.0, 672.0, 0.030364679804451462, 0.030453638827316065, 0.019472141671474406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 653.5555555555557, 169, 1317, 666.0, 1192.8000000000002, 1317.0, 1317.0, 0.08098586796603993, 48.50638280416943, 0.1717786183810925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b34ee3c0-8d61-43b6-bf3a-6a459f79331a", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 777.2857142857142, 85, 1222, 982.0, 1222.0, 1222.0, 1222.0, 0.03211745813259922, 27.447916666666668, 0.05780963236980959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 313.7692307692308, 169, 1005, 182.0, 804.9999999999998, 1005.0, 1005.0, 0.12836590206669105, 11.996734692366179, 0.28617149005657977], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1169.9090909090908, 104, 1900, 1177.0, 1838.3999999999999, 1899.85, 1900.0, 0.09238728750923873, 0.029067875260364175, 0.04168254573170732], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f826a457-6def-4984-817e-99ef5b411958", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 24, 0, 0.0, 89.08333333333334, 84, 99, 89.0, 96.0, 99.0, 99.0, 0.12164956814403309, 0.09444473308057257, 0.04324261992619926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 226.68749999999997, 170, 505, 177.0, 390.2000000000001, 505.0, 505.0, 0.17084343267167096, 0.2647739527831463, 0.3842308842215412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 303.7222222222222, 169, 1035, 262.5, 561.6000000000007, 1035.0, 1035.0, 0.12529234881389908, 8.510791401725555, 0.28000447224078406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 85.16666666666669, 82, 90, 84.5, 89.4, 90.0, 90.0, 0.057086314507535395, 0.04242449740257269, 0.028654653961790226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 83.41666666666667, 82, 86, 83.5, 85.4, 86.0, 86.0, 0.05708821556510198, 0.015275557680505801, 0.03255812293947222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=453057df-17fa-4f3c-9c61-6350c5e3b2fd", 1, 0, 0.0, 975.0, 975, 975, 975.0, 975.0, 975.0, 975.0, 1.0256410256410255, 0.18529647435897437, 0.7071314102564102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 97.83333333333333, 82, 246, 84.0, 198.90000000000015, 246.0, 246.0, 0.05708848715509039, 0.015387131303520457, 0.03356178639391056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 125.16666666666667, 81, 250, 84.5, 249.7, 250.0, 250.0, 0.05708848715509039, 0.015387131303520457, 0.033617536869647954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 3.205672554347826, 6.719174592391305], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 997.0909090909089, 654, 1541, 945.0, 1394.8, 1438.5999999999995, 1541.0, 0.24475882355558914, 292.81664490723637, 0.4833030676068372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1169.9090909090908, 104, 1900, 1177.0, 1838.3999999999999, 1899.85, 1900.0, 0.09041554160964323, 0.02844750350360224, 0.04079294943716325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 83.5, 82, 84, 84.0, 84.0, 84.0, 84.0, 0.019703851117700955, 0.005310803621567836, 0.011602951390599293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 84.75, 83, 87, 84.5, 87.0, 87.0, 87.0, 0.019703851117700955, 0.005310803621567836, 0.011583709348492163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 24, 0, 0.0, 213.16666666666666, 81, 975, 85.0, 857.5, 956.25, 975.0, 0.11950643840936931, 13.469697298594307, 0.06897295419915749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 24, 0, 0.0, 196.625, 82, 662, 86.0, 653.0, 660.0, 662.0, 0.11950643840936931, 4.420541989707508, 0.06908965970541663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 83.0, 82, 85, 82.5, 85.0, 85.0, 85.0, 0.019704045240487873, 0.005272371480364919, 0.01123746330121574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 24, 0, 0.0, 107.04166666666666, 83, 261, 86.0, 248.0, 258.0, 261.0, 0.11950346311077473, 0.08881067912822224, 0.0599851367567756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 85.75, 82, 92, 84.5, 92.0, 92.0, 92.0, 0.01970394817861629, 0.014643266175709959, 0.009890458363094505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 24, 0, 0.0, 128.41666666666666, 82, 333, 84.5, 248.5, 312.25, 333.0, 0.11950643840936931, 0.054413942293328556, 0.06690143146305758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 97.25, 86, 104, 99.5, 104.0, 104.0, 104.0, 0.019987008444511067, 0.01573196172487883, 0.0071047569080097935], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 478.99999999999994, 88, 823, 466.0, 762.5999999999999, 823.0, 823.0, 0.07882131813496634, 0.014767155005153701, 0.05364491754077487], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1520.8095238095236, 1039, 2312, 1500.0, 1902.8, 2272.5999999999995, 2312.0, 0.08739876309940986, 0.04523568793231174, 0.040200017011544964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 171.5, 169, 177, 170.0, 177.0, 177.0, 177.0, 0.01969579839380764, 0.03052464067477805, 0.04429631220794824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d8f3ce6-f3c1-447f-bfc4-25d988f7ff96", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["addBook", 63, 12, 19.047619047619047, 895.9047619047618, 430, 2037, 776.0, 1567.4, 1713.8, 2037.0, 0.29219559480355645, 84.33573712281259, 1.063711176829353], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 162.8909090909091, 82, 398, 87.0, 342.0, 362.99999999999994, 398.0, 0.24565415468172153, 0.18256133956327159, 0.11874883453852751], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 540.0545454545454, 402, 779, 493.0, 683.0, 760.8, 779.0, 0.24553242590501023, 72.19468565990188, 0.12348554623152369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2614d87b-bbd0-41b8-827c-384f226419f2", 3, 0, 0.0, 381.0, 287, 480, 376.0, 480.0, 480.0, 480.0, 0.061614294516327786, 0.039050465958102284, 0.03951177089751489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1100eaca-8bf3-4a47-af5b-bf804c99bc36", 3, 0, 0.0, 343.6666666666667, 184, 433, 414.0, 433.0, 433.0, 433.0, 0.03040561084872195, 0.02516974882431638, 0.01949838976952547], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 128.4909090909091, 82, 347, 88.0, 256.6, 265.99999999999994, 347.0, 0.24598045573469893, 0.4352701033117914, 0.11962721382410162], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 830.5090909090908, 567, 1203, 814.0, 1051.2, 1077.5999999999997, 1203.0, 0.24517889143478686, 220.61239749154134, 0.123068310739727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 108.88888888888889, 87, 267, 89.0, 248.10000000000002, 267.0, 267.0, 0.12331638874806461, 0.09212601307838811, 0.04383512256278859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e5df7c3-b0ad-47a9-a6f1-62fb4e4be8a0", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 12, 6.629834254143646, 154.30386740331502, 83, 705, 92.0, 314.4000000000001, 384.70000000000005, 629.5600000000006, 0.7742851765027977, 1.5827218837695283, 0.3750986906131825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 94.08333333333334, 84, 114, 93.5, 110.10000000000001, 114.0, 114.0, 0.05830648805445826, 0.045153364284360745, 0.02072613442560821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43e3cfc5-953e-427e-ae4e-67aa817959ea", 2, 0, 0.0, 225.5, 193, 258, 225.5, 258.0, 258.0, 258.0, 0.011562832431432404, 0.022865952806299432, 0.00718724886973313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d44f526-04cd-4c44-9f9a-3bd2804f6e09", 3, 0, 0.0, 569.0, 302, 998, 407.0, 998.0, 998.0, 998.0, 0.019715310910453056, 0.027179147690679917, 0.012642956540882983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 103.3846153846154, 85, 257, 90.0, 196.59999999999997, 257.0, 257.0, 0.13420740205440562, 0.10891245225313581, 0.047706537449026996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbb0ced1-2695-4b33-820b-de9a07a18383", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65916268-b18e-45a6-a144-271dfddbab5b", 1, 0, 0.0, 828.0, 828, 828, 828.0, 828.0, 828.0, 828.0, 1.2077294685990339, 0.21819331219806765, 0.8326728562801933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 211.66666666666666, 166, 335, 171.5, 334.7, 335.0, 335.0, 0.05706351168850931, 0.08843729790006277, 0.12833717521351265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=754f576e-96a2-4c02-8818-d443ec05aabb", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1564700d-21ef-4a3a-a88e-5335be103cb3", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 24, 0, 0.0, 366.125, 167, 1061, 330.5, 947.0, 1043.75, 1061.0, 0.11945171662071094, 18.02520862833345, 0.26482935513493067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e07bfb8-da95-4b9e-8670-9088f0103c1b", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b34ee3c0-8d61-43b6-bf3a-6a459f79331a", 3, 0, 0.0, 269.6666666666667, 172, 419, 218.0, 419.0, 419.0, 419.0, 0.07230135203528305, 0.03271447894825633, 0.04636512484033451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 98.76923076923076, 83, 158, 89.0, 140.39999999999998, 158.0, 158.0, 0.07136348165958521, 0.05916757414940219, 0.02536748762118068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 93.22222222222221, 84, 119, 90.5, 107.30000000000001, 119.0, 119.0, 0.08300898341664975, 0.06444545099241851, 0.02950709957388722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83b13db2-9454-44ab-a9f9-2c70d6a37c8a", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 95.55555555555556, 83, 248, 85.0, 122.9000000000002, 248.0, 248.0, 0.1255125094134382, 0.09327638639026023, 0.06300139632666722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 121.61111111111111, 82, 260, 84.0, 252.8, 260.0, 260.0, 0.1255098839033574, 0.044056475089774436, 0.07099425182163652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 168.55555555555554, 81, 951, 85.0, 318.300000000001, 951.0, 951.0, 0.12565357309896616, 6.313280808249157, 0.07327064907051259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 170.94444444444446, 83, 493, 84.5, 282.4000000000003, 493.0, 493.0, 0.1255098839033574, 2.0821757443433393, 0.07330942980162466], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.45351473922902497], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07558578987150416], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07558578987150416], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0582010582010581], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
