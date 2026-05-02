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

    var data = {"OkPercent": 98.5837922895358, "KoPercent": 1.4162077104642015};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7481456507080243, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2faaf8f1-10d3-4961-904f-fdf34400234b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f9ca113-c908-42d5-a161-9e2aaee2d77b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a36a8ee-c71c-40bf-8695-a2901fdb24b0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b67d3a3-690a-4eb5-83f4-a87a663a82e8"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ce360d9-d01e-40cf-9027-a08bb5fa019f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63853f46-f89c-492a-a173-ebcc7856c6a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea2975ff-e8c9-4589-ad48-ef0d3ed262bc"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82355994-eac6-417c-a09b-9c2b574a8c3b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b4c190a1-29b5-4d8e-b74a-5259d7cae580"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b85429ee-16bf-49b2-9852-659ab1aeaa57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a36a8ee-c71c-40bf-8695-a2901fdb24b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69886966-8a1e-4194-8a2c-e76453254fa0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15058cd1-127a-4ffc-acb5-5182f438c6b1"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0048f3b-071d-4a5d-b5e5-c883efe6c2fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/699c3ca8-6d94-4b8a-ae63-c1ceb8104584"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.29245283018867924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ce360d9-d01e-40cf-9027-a08bb5fa019f"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af7ffa48-ad6f-492c-9085-777a41d08dca"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63853f46-f89c-492a-a173-ebcc7856c6a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea2975ff-e8c9-4589-ad48-ef0d3ed262bc"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f9ca113-c908-42d5-a161-9e2aaee2d77b"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4056603773584906, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.930635838150289, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2faaf8f1-10d3-4961-904f-fdf34400234b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69886966-8a1e-4194-8a2c-e76453254fa0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b85429ee-16bf-49b2-9852-659ab1aeaa57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af7ffa48-ad6f-492c-9085-777a41d08dca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4c190a1-29b5-4d8e-b74a-5259d7cae580"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b67d3a3-690a-4eb5-83f4-a87a663a82e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0048f3b-071d-4a5d-b5e5-c883efe6c2fa"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46295f58-d1c8-487e-b3ea-43f1f767900d"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15058cd1-127a-4ffc-acb5-5182f438c6b1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 18, 1.4162077104642015, 447.67663257277707, 124, 2573, 147.0, 1287.3999999999992, 1556.9999999999993, 2086.5199999999995, 4.9355581529906525, 681.4686982137725, 3.6001211925139502], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2224.320754716982, 1552, 2801, 2225.0, 2679.2000000000003, 2743.8999999999996, 2801.0, 0.2407110513622883, 289.65560223747735, 1.1835743589932828], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2faaf8f1-10d3-4961-904f-fdf34400234b", 3, 0, 0.0, 352.0, 217, 480, 359.0, 480.0, 480.0, 480.0, 0.016128251858781025, 0.022234097207661997, 0.010342661511002157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f9ca113-c908-42d5-a161-9e2aaee2d77b", 3, 0, 0.0, 381.0, 257, 556, 330.0, 556.0, 556.0, 556.0, 0.017536885916711483, 0.024176012974372763, 0.011245984783828652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a36a8ee-c71c-40bf-8695-a2901fdb24b0", 3, 0, 0.0, 336.0, 235, 459, 314.0, 459.0, 459.0, 459.0, 0.0714217693552995, 0.03310696600323779, 0.045801069540996095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b67d3a3-690a-4eb5-83f4-a87a663a82e8", 3, 0, 0.0, 451.66666666666663, 218, 797, 340.0, 797.0, 797.0, 797.0, 0.07050363093699326, 0.031901056966933794, 0.04521228937040257], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 560.0714285714286, 141, 1096, 540.0, 911.5, 1096.0, 1096.0, 0.07947816905006558, 0.015007491881872732, 0.0537486641280961], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 560.0714285714286, 141, 1096, 540.0, 911.5, 1096.0, 1096.0, 0.08164741148545801, 0.015417099811044563, 0.05521565669304656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 230.87500000000003, 128, 400, 136.5, 399.3, 400.0, 400.0, 0.08734101206397729, 0.04796718912058519, 0.04843630588460069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 151.99999999999997, 133, 399, 136.0, 217.00000000000017, 399.0, 399.0, 0.08733624454148471, 0.06490515829694324, 0.043838700873362446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 377.8125, 127, 1067, 258.0, 1059.3, 1067.0, 1067.0, 0.08734148884485422, 4.834370598807789, 0.050025178913581055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 411.9375, 129, 1578, 137.5, 1402.3000000000002, 1578.0, 1578.0, 0.08733815148802375, 14.754193212119807, 0.04993797626585733], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 257.74999999999994, 134, 554, 235.0, 395.10000000000014, 554.0, 554.0, 0.08862547428476472, 0.15884320388013404, 0.057284165812723296], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 147.11764705882354, 128, 381, 134.0, 185.79999999999984, 381.0, 381.0, 0.0948936075200393, 0.07052151886987296, 0.04763214283720723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 225.58823529411765, 128, 412, 135.0, 403.2, 412.0, 412.0, 0.0947545022323046, 0.033725809732959515, 0.05357156542798379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 956.5, 631, 1125, 1035.0, 1125.0, 1125.0, 1125.0, 0.050505050505050504, 14.850161773989898, 0.028803661616161616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1362.25, 1129, 1712, 1304.0, 1712.0, 1712.0, 1712.0, 0.05036451316402463, 45.31807747636015, 0.02867432731897105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 266.75, 137, 393, 268.5, 393.0, 393.0, 393.0, 0.051130625966688395, 0.09047724048011659, 0.028311586838976877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ce360d9-d01e-40cf-9027-a08bb5fa019f", 3, 0, 0.0, 449.3333333333333, 224, 570, 554.0, 570.0, 570.0, 570.0, 0.0170061278747442, 0.023444320165866433, 0.010905622367593123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 134.6666666666667, 129, 139, 134.5, 138.7, 139.0, 139.0, 0.06526989099928203, 0.04850623735395862, 0.03276242575549899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 220.74999999999997, 127, 407, 134.0, 404.90000000000003, 407.0, 407.0, 0.06527024601443561, 0.0174648900468314, 0.0372244371801078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 220.9166666666667, 127, 403, 134.5, 402.1, 403.0, 403.0, 0.06526776098945926, 0.01759170120419019, 0.03837030480044382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 156.58333333333334, 131, 399, 134.5, 321.0000000000003, 399.0, 399.0, 0.06526776098945926, 0.01759170120419019, 0.03843404284828509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63853f46-f89c-492a-a173-ebcc7856c6a5", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 199.5, 128, 409, 130.5, 409.0, 409.0, 409.0, 0.05096580194689363, 0.037875952423423884, 0.028618492304163908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 763.272727272727, 127, 1775, 258.0, 1584.0, 1746.3499999999997, 1775.0, 0.10511931041732367, 43.009336282049446, 0.05769243403763271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 228.76470588235293, 124, 1264, 133.0, 573.5999999999995, 1264.0, 1264.0, 0.09489731552240972, 5.046942117173065, 0.0553095222478383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 561.5000000000001, 127, 1168, 396.5, 1112.8, 1163.5, 1168.0, 0.10512031497868925, 14.064937626622198, 0.05779564192675981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 215.0, 127, 1008, 134.0, 528.7999999999996, 1008.0, 1008.0, 0.09475344595988028, 1.6628990269657158, 0.05531820262467045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea2975ff-e8c9-4589-ad48-ef0d3ed262bc", 3, 0, 0.0, 305.0, 229, 451, 235.0, 451.0, 451.0, 451.0, 0.0286046644672858, 0.023250601293884322, 0.01834348600278419], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 533.9230769230769, 233, 1020, 506.0, 977.1999999999999, 1020.0, 1020.0, 0.08214123237122782, 0.014839968738942525, 0.05663252934969418], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 381.25, 265, 540, 275.0, 539.4, 540.0, 540.0, 0.06522164488988412, 0.10108081097680284, 0.1466850079896515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 602.8000000000001, 206, 1458, 477.0, 1014.2000000000003, 1436.4499999999998, 1458.0, 0.09317667228832589, 0.05723449889585644, 0.042129686786616105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 170.22727272727275, 127, 400, 135.0, 392.4, 399.4, 400.0, 0.10511479012876562, 0.07811753446092835, 0.05276269738885306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 229.5909090909091, 127, 410, 135.0, 400.4, 408.65, 410.0, 0.10512081726657205, 0.0998946402717851, 0.05593875876205903], "isController": false}, {"data": ["login", 20, 0, 0.0, 2766.6499999999996, 1592, 4528, 2506.0, 4353.600000000001, 4521.4, 4528.0, 0.08948145496845779, 21.534323827792942, 0.1646843262046441], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 136.2941176470588, 130, 140, 136.0, 139.2, 140.0, 140.0, 0.09174807059204491, 0.07427651418047386, 0.03261357196826596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82355994-eac6-417c-a09b-9c2b574a8c3b", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4c190a1-29b5-4d8e-b74a-5259d7cae580", 3, 0, 0.0, 441.6666666666667, 315, 690, 320.0, 690.0, 690.0, 690.0, 0.02667164537380311, 0.026923428484428205, 0.01710388717004952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85429ee-16bf-49b2-9852-659ab1aeaa57", 3, 0, 0.0, 317.3333333333333, 246, 427, 279.0, 427.0, 427.0, 427.0, 0.02674583433630212, 0.022296901606533116, 0.01715146277425624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a36a8ee-c71c-40bf-8695-a2901fdb24b0", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69886966-8a1e-4194-8a2c-e76453254fa0", 3, 0, 0.0, 349.6666666666667, 232, 489, 328.0, 489.0, 489.0, 489.0, 0.02354954431631748, 0.02361853712193169, 0.015101758562221821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 971.818181818182, 264, 1916, 791.0, 1722.7, 1887.0499999999995, 1916.0, 0.1050485371991195, 57.2136076950441, 0.2240395072029872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 630.375, 270, 1715, 525.5, 1537.9, 1715.0, 1715.0, 0.08727240991850939, 19.686421665853032, 0.19209092080574253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1087.0, 134, 2122, 1324.5, 2122.0, 2122.0, 2122.0, 0.060945260998080224, 48.61324930928704, 0.10472982838830258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15058cd1-127a-4ffc-acb5-5182f438c6b1", 3, 0, 0.0, 330.0, 232, 520, 238.0, 520.0, 520.0, 520.0, 0.05525370660281794, 0.02500086333916567, 0.03543287825766645], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1261.086956521739, 276, 2573, 1231.0, 2099.4, 2486.9999999999986, 2573.0, 0.0910948812598026, 0.02869921955450642, 0.0410994483808875], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d0048f3b-071d-4a5d-b5e5-c883efe6c2fa", 3, 0, 0.0, 508.6666666666667, 307, 610, 609.0, 610.0, 610.0, 610.0, 0.05151983513652757, 0.03312228984200584, 0.033038435943671646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 137.71428571428572, 135, 142, 137.0, 141.5, 142.0, 142.0, 0.06285270468656703, 0.04879677756427812, 0.022342172369053125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 474.11764705882354, 265, 1402, 521.0, 905.1999999999996, 1402.0, 1402.0, 0.09468220197384543, 6.801214891004077, 0.21151747199913115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/699c3ca8-6d94-4b8a-ae63-c1ceb8104584", 2, 0, 0.0, 361.5, 327, 396, 361.5, 396.0, 396.0, 396.0, 0.03216985684413704, 0.027111900836416278, 0.019996204962200417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 441.22222222222223, 269, 1376, 274.0, 696.5000000000011, 1376.0, 1376.0, 0.1110206498408704, 7.5413510962518195, 0.24810995053413268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 135.66666666666663, 127, 150, 136.0, 150.0, 150.0, 150.0, 0.0457417016929512, 0.033993588855796744, 0.022960190107594647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 133.11111111111111, 127, 136, 134.0, 136.0, 136.0, 136.0, 0.0457423991380099, 0.012239665394350306, 0.026087462008396272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 132.77777777777777, 127, 137, 134.0, 137.0, 137.0, 137.0, 0.04574216665396051, 0.012328943355950294, 0.026891390943051003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 132.44444444444446, 128, 134, 134.0, 134.0, 134.0, 134.0, 0.045743096604337466, 0.01232919400663783, 0.026936608644937], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1537.056603773585, 1021, 2255, 1424.0, 2124.6, 2206.7, 2255.0, 0.23024057968496137, 275.44777787974493, 0.4546352071513593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ce360d9-d01e-40cf-9027-a08bb5fa019f", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1261.086956521739, 276, 2573, 1231.0, 2099.4, 2486.9999999999986, 2573.0, 0.0904906165165047, 0.028508847424951807, 0.040826821123657396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 132.4, 127, 136, 135.0, 136.0, 136.0, 136.0, 0.024958568775832118, 0.006727114240361001, 0.014697282199049578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 133.0, 128, 137, 133.0, 137.0, 137.0, 137.0, 0.024958942539522484, 0.00672721498135567, 0.01467312832889896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 291.92857142857144, 126, 1587, 135.0, 993.5, 1587.0, 1587.0, 0.06308323833298037, 4.070246178113271, 0.03669881471101118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 198.21428571428572, 126, 794, 134.0, 596.5, 794.0, 794.0, 0.06316121901152692, 1.342343323520787, 0.036805861022760594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 132.85714285714286, 128, 138, 133.0, 137.5, 138.0, 138.0, 0.06315779976270713, 0.04693660705021496, 0.031702254959015096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 131.4, 128, 134, 133.0, 134.0, 134.0, 134.0, 0.024958817950381868, 0.006678433709379523, 0.01423432586232716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 189.57142857142858, 127, 397, 133.5, 396.5, 397.0, 397.0, 0.06308409109342754, 0.023647733366076982, 0.035599211561511496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 134.6, 130, 137, 135.0, 137.0, 137.0, 137.0, 0.024958568775832118, 0.01854831136563305, 0.012528031592556357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 139.0, 136, 146, 138.0, 146.0, 146.0, 146.0, 0.025146984122194224, 0.01979342695555522, 0.008938967012186229], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 535.9230769230769, 427, 797, 489.0, 754.1999999999999, 797.0, 797.0, 0.08246010199680309, 0.014897577020906808, 0.05612762801930835], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af7ffa48-ad6f-492c-9085-777a41d08dca", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1587.6, 1016, 2270, 1538.5, 2146.1000000000004, 2264.15, 2270.0, 0.09126252578166354, 0.04723548697683757, 0.04197719691715188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63853f46-f89c-492a-a173-ebcc7856c6a5", 3, 0, 0.0, 323.6666666666667, 231, 464, 276.0, 464.0, 464.0, 464.0, 0.04153801420600086, 0.026704940773714745, 0.026637333328718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 269.2, 259, 273, 271.0, 273.0, 273.0, 273.0, 0.024941636570425203, 0.03865466527076641, 0.05609432521649341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea2975ff-e8c9-4589-ad48-ef0d3ed262bc", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.1978795865279299, 0.7551512869660459], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1315.2833333333326, 670, 2698, 1085.0, 2277.9, 2539.9499999999994, 2698.0, 0.26774239611595035, 86.45565823352491, 0.9726753545355562], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f9ca113-c908-42d5-a161-9e2aaee2d77b", 1, 0, 0.0, 1020.0, 1020, 1020, 1020.0, 1020.0, 1020.0, 1020.0, 0.9803921568627451, 0.1771216299019608, 0.6759344362745098], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 230.2830188679246, 129, 598, 136.0, 533.6, 548.5999999999999, 598.0, 0.23126028126486284, 0.1718643301196881, 0.11179085861924522], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 834.1320754716977, 629, 1368, 791.0, 1105.4, 1169.5, 1368.0, 0.23090462332049563, 67.8936260112969, 0.11612879004888207], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 225.86792452830187, 128, 539, 137.0, 404.6, 496.99999999999994, 539.0, 0.23170614414745255, 0.4100112628859219, 0.11268521463421032], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1301.6037735849059, 884, 1753, 1250.0, 1626.0, 1712.8, 1753.0, 0.23082015190579053, 207.69237842337859, 0.11586089656208626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 166.16666666666666, 130, 396, 138.5, 382.5, 396.0, 396.0, 0.11082583719684516, 0.08279469282772124, 0.03939512181606605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 202.36416184971088, 128, 701, 138.0, 359.2, 467.59999999999997, 649.9399999999994, 0.6916320517484699, 1.4540662804887798, 0.3346422828055474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 235.66666666666666, 134, 443, 140.0, 443.0, 443.0, 443.0, 0.04672994247024861, 0.03618832458877651, 0.016611034237471182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2faaf8f1-10d3-4961-904f-fdf34400234b", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 138.43749999999997, 130, 153, 137.0, 152.3, 153.0, 153.0, 0.09035566247642282, 0.07332573781045641, 0.03211861439591592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 271.22222222222223, 261, 285, 271.0, 285.0, 285.0, 285.0, 0.045709642195078594, 0.0708410177378806, 0.1028020566164707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69886966-8a1e-4194-8a2c-e76453254fa0", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 464.85714285714283, 261, 1722, 275.0, 1129.5, 1722.0, 1722.0, 0.06304375236414071, 5.478029780011077, 0.14063470986364537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b85429ee-16bf-49b2-9852-659ab1aeaa57", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af7ffa48-ad6f-492c-9085-777a41d08dca", 3, 0, 0.0, 355.3333333333333, 242, 454, 370.0, 454.0, 454.0, 454.0, 0.044485964678144044, 0.028600188879991696, 0.028527783338523363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4c190a1-29b5-4d8e-b74a-5259d7cae580", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 160.0, 135, 411, 136.5, 330.3000000000003, 411.0, 411.0, 0.06535057862491492, 0.054182266848196055, 0.023230088495575223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b67d3a3-690a-4eb5-83f4-a87a663a82e8", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 173.0909090909091, 130, 400, 139.0, 393.3, 399.4, 400.0, 0.10297889868748712, 0.07994943794585183, 0.03660578039281769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 134.5, 126, 156, 134.0, 140.70000000000002, 156.0, 156.0, 0.111358574610245, 0.08275769070155903, 0.055896784521158135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 225.7777777777778, 126, 491, 134.5, 415.4000000000001, 491.0, 491.0, 0.11111111111111112, 0.03900221836419753, 0.06284963348765432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0048f3b-071d-4a5d-b5e5-c883efe6c2fa", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 223.77777777777777, 127, 1250, 133.5, 481.4000000000012, 1250.0, 1250.0, 0.1113613303966938, 5.595187885511272, 0.06493660910935682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46295f58-d1c8-487e-b3ea-43f1f767900d", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.9072043678977273, 1.6951127485795456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 263.3333333333333, 129, 1182, 134.0, 483.6000000000011, 1182.0, 1182.0, 0.11135719676816669, 1.8473864117927272, 0.06504294598557306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15058cd1-127a-4ffc-acb5-5182f438c6b1", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.47206923682140045], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15735641227380015], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7867820613690008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
