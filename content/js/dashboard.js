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

    var data = {"OkPercent": 98.97151898734177, "KoPercent": 1.0284810126582278};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7610169491525424, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5767d32-2316-438f-97b6-bb99f0071e33"], "isController": false}, {"data": [0.01818181818181818, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=710e3c80-724e-43d3-9436-3cbf8e61010c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=821be531-368b-425f-a704-820e3fa14408"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd044d32-248c-4942-af1c-2c873f27a20c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dff014d8-423f-4fe0-bb9a-24ba5ed4ff3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/199c1d7b-f806-41fb-897b-8bf039ed00d1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22b7c4b6-eef5-41e1-a4e9-32edc3440bb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a36c6dee-5f96-4091-bafe-445014158b13"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49b21f22-874a-42f1-ab66-d40325a93ae4"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c4c416b-d28b-4b57-98cc-d0e733120b70"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5241e81-cc15-4fe1-a9ec-deaf546889c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2438474e-8b7f-4ee1-a839-fc7533f13748"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/24e9f83a-ed1d-4e69-ae88-e91106ae2d9e"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd044d32-248c-4942-af1c-2c873f27a20c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/821be531-368b-425f-a704-820e3fa14408"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1dd4c8be-d5af-48cb-8beb-af517ab2fa5e"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/710e3c80-724e-43d3-9436-3cbf8e61010c"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c4c416b-d28b-4b57-98cc-d0e733120b70"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a36c6dee-5f96-4091-bafe-445014158b13"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22b7c4b6-eef5-41e1-a4e9-32edc3440bb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b5767d32-2316-438f-97b6-bb99f0071e33"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4636363636363636, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9910179640718563, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac16d58f-7303-4142-a205-0c9d4c838ac2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=199c1d7b-f806-41fb-897b-8bf039ed00d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24e9f83a-ed1d-4e69-ae88-e91106ae2d9e"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/49b21f22-874a-42f1-ab66-d40325a93ae4"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2438474e-8b7f-4ee1-a839-fc7533f13748"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5241e81-cc15-4fe1-a9ec-deaf546889c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c7a89b8-5e03-4b97-994b-0a30611288d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1dd4c8be-d5af-48cb-8beb-af517ab2fa5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1264, 13, 1.0284810126582278, 441.50474683544337, 117, 3789, 157.5, 1227.5, 1480.5, 2066.149999999999, 4.965976773058005, 698.8279093775536, 3.626055920768312], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5767d32-2316-438f-97b6-bb99f0071e33", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2050.2545454545448, 1446, 2697, 2039.0, 2499.0, 2672.4, 2697.0, 0.24055809477988935, 289.4729949619481, 1.1828222726726005], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=710e3c80-724e-43d3-9436-3cbf8e61010c", 1, 0, 0.0, 1846.0, 1846, 1846, 1846.0, 1846.0, 1846.0, 1846.0, 0.5417118093174431, 0.09786785617551462, 0.3734848997833153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=821be531-368b-425f-a704-820e3fa14408", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 637.2857142857144, 125, 1542, 551.5, 1263.5, 1542.0, 1542.0, 0.1174900762846281, 0.022185102992640086, 0.07945495881553219], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 637.2857142857144, 125, 1542, 551.5, 1263.5, 1542.0, 1542.0, 0.11586047089005669, 0.021877392208383334, 0.07835290633922291], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd044d32-248c-4942-af1c-2c873f27a20c", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 164.1764705882353, 120, 358, 124.0, 356.4, 358.0, 358.0, 0.10359473738734072, 0.03687229968129384, 0.05856958900311394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 159.35294117647055, 121, 459, 125.0, 386.99999999999994, 459.0, 459.0, 0.10359410610473974, 0.07698741674385443, 0.05199938529085569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 207.05882352941177, 120, 714, 123.0, 536.3999999999999, 714.0, 714.0, 0.10359347482983249, 1.81803929925108, 0.06047911791679616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 223.52941176470586, 118, 1347, 123.0, 570.1999999999994, 1347.0, 1347.0, 0.10359599997562446, 5.509565919429735, 0.0603794241585872], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 321.9285714285714, 119, 1147, 239.5, 779.0, 1147.0, 1147.0, 0.11877794463250953, 0.28020857194973997, 0.07677980000763572], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dff014d8-423f-4fe0-bb9a-24ba5ed4ff3b", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 171.65, 120, 380, 123.5, 363.9, 379.2, 380.0, 0.10573898331967538, 0.07858141240846969, 0.05307601311163393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 171.65, 119, 373, 122.5, 369.6, 372.85, 373.0, 0.10574177857671566, 0.028294186845722748, 0.060305858094533156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 956.0, 927, 982, 957.5, 982.0, 982.0, 982.0, 0.06270280438292603, 18.436706417632028, 0.0357601931246375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1259.25, 1090, 1324, 1311.5, 1324.0, 1324.0, 1324.0, 0.06233248145608676, 56.086876383001936, 0.035488121766502526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 188.75, 125, 377, 126.5, 377.0, 377.0, 377.0, 0.0635011350827896, 0.11236724293946754, 0.03516127303900557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 140.9230769230769, 120, 354, 123.0, 263.19999999999993, 354.0, 354.0, 0.06285871777886302, 0.04671434006808083, 0.03155212982259336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 178.53846153846152, 118, 369, 123.0, 365.4, 369.0, 369.0, 0.0628596296117209, 0.0240823400705962, 0.03544353815095982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 247.15384615384613, 119, 1263, 121.0, 905.3999999999996, 1263.0, 1263.0, 0.06286084543001653, 4.366585750957419, 0.03653975525371604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 245.61538461538467, 120, 953, 123.0, 735.7999999999997, 953.0, 953.0, 0.06286023751498974, 1.4374085051110208, 0.03660078883553828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 183.0, 120, 364, 124.0, 364.0, 364.0, 364.0, 0.06350617597561363, 0.047195507731876925, 0.03566020623630648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 838.4117647058823, 120, 1555, 1080.0, 1480.6, 1555.0, 1555.0, 0.08523952305979803, 45.12632646173247, 0.045802533243414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 158.84999999999997, 119, 377, 122.5, 360.6, 376.2, 377.0, 0.10573898331967538, 0.028499960347881253, 0.06216295699066853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 626.4117647058824, 118, 1075, 948.0, 1032.6, 1075.0, 1075.0, 0.08524123268850849, 14.75284429936721, 0.04588669528515699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 207.65, 119, 371, 125.0, 368.9, 370.9, 371.0, 0.10573898331967538, 0.028499960347881253, 0.06226621771656665], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 863.0714285714286, 123, 3036, 610.0, 2441.0, 3036.0, 3036.0, 0.11345586566825505, 0.021423341822263284, 0.0776447752560861], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/199c1d7b-f806-41fb-897b-8bf039ed00d1", 3, 0, 0.0, 363.6666666666667, 231, 614, 246.0, 614.0, 614.0, 614.0, 0.07860399308284861, 0.036947970706911915, 0.05040685754336321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 467.46153846153845, 244, 1618, 477.0, 1185.1999999999996, 1618.0, 1618.0, 0.06282105181770298, 5.87108787940291, 0.14004960597911442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22b7c4b6-eef5-41e1-a4e9-32edc3440bb4", 1, 0, 0.0, 1069.0, 1069, 1069, 1069.0, 1069.0, 1069.0, 1069.0, 0.9354536950420954, 0.16900286482694107, 0.6449514733395697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a36c6dee-5f96-4091-bafe-445014158b13", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.21793011158021713, 0.8316684258142341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 647.6999999999999, 191, 2150, 524.0, 1420.5000000000005, 2114.7999999999993, 2150.0, 0.08720600674974492, 0.05356697094295855, 0.03943005969251162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 137.88235294117646, 120, 361, 125.0, 173.79999999999984, 361.0, 361.0, 0.08523695874531197, 0.06334504453631094, 0.04278495780770542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 192.76470588235296, 119, 369, 124.0, 366.6, 369.0, 369.0, 0.08524037786558093, 0.09811849101967549, 0.04440255896628492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49b21f22-874a-42f1-ab66-d40325a93ae4", 1, 0, 0.0, 944.0, 944, 944, 944.0, 944.0, 944.0, 944.0, 1.0593220338983051, 0.19138142213983053, 0.7303528866525424], "isController": false}, {"data": ["login", 20, 0, 0.0, 2975.0499999999997, 1636, 4726, 2820.5, 4456.3, 4713.05, 4726.0, 0.08458734065859703, 20.35652176326541, 0.15567705293475778], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5c4c416b-d28b-4b57-98cc-d0e733120b70", 3, 0, 0.0, 334.0, 236, 529, 237.0, 529.0, 529.0, 529.0, 0.02419998870667194, 0.02860356738083522, 0.015518872966192617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5241e81-cc15-4fe1-a9ec-deaf546889c6", 3, 0, 0.0, 335.3333333333333, 223, 526, 257.0, 526.0, 526.0, 526.0, 0.028617216117216116, 0.028701055617559524, 0.018351535075167888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 131.29999999999998, 123, 206, 126.0, 140.10000000000002, 202.74999999999994, 206.0, 0.1045735230297041, 0.08465961971838351, 0.037172619514465134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2438474e-8b7f-4ee1-a839-fc7533f13748", 3, 0, 0.0, 316.6666666666667, 216, 483, 251.0, 483.0, 483.0, 483.0, 0.019363458571880387, 0.0266940908372114, 0.01241732206595194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24e9f83a-ed1d-4e69-ae88-e91106ae2d9e", 3, 0, 0.0, 968.6666666666666, 356, 1980, 570.0, 1980.0, 1980.0, 1980.0, 0.017914084052882376, 0.02469601105597554, 0.011487872911516367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 992.7058823529412, 244, 1683, 1208.0, 1606.1999999999998, 1683.0, 1683.0, 0.08518485112694547, 60.00182994754868, 0.17876193684044375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd044d32-248c-4942-af1c-2c873f27a20c", 3, 0, 0.0, 362.6666666666667, 223, 517, 348.0, 517.0, 517.0, 517.0, 0.028009896830213342, 0.023350698496802203, 0.017962075766770925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/821be531-368b-425f-a704-820e3fa14408", 3, 0, 0.0, 428.0, 234, 529, 521.0, 529.0, 529.0, 529.0, 0.05034993202759176, 0.031321197950757766, 0.03228820510883977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1dd4c8be-d5af-48cb-8beb-af517ab2fa5e", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 434.88235294117646, 244, 1807, 253.0, 958.1999999999992, 1807.0, 1807.0, 0.10351399570112464, 7.435620574015551, 0.23124745972087754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1001.8333333333334, 119, 1671, 1326.0, 1671.0, 1671.0, 1671.0, 0.09332275675423453, 74.43929792123559, 0.160899733446876], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1498.875, 331, 3789, 1396.5, 2784.0, 3728.25, 3789.0, 0.09360958562156764, 0.02925299550673989, 0.04223401226285571], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 418.54999999999995, 240, 742, 370.0, 741.2, 742.0, 742.0, 0.1056680333065641, 0.16376481333741919, 0.23764988350099328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 157.11764705882354, 124, 389, 128.0, 358.59999999999997, 389.0, 389.0, 0.11882212328144767, 0.0922495976647958, 0.042237551635202104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 414.25000000000006, 241, 1444, 252.5, 781.8000000000006, 1444.0, 1444.0, 0.11863803535413453, 9.04314514297737, 0.26492255624184363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 174.2, 122, 362, 126.0, 362.0, 362.0, 362.0, 0.07123420381530395, 0.05293870029633429, 0.03575623121197874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 172.6, 119, 370, 124.0, 370.0, 370.0, 370.0, 0.07125146065494344, 0.01906533224556103, 0.04063559865477242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 174.0, 122, 370, 123.0, 370.0, 370.0, 370.0, 0.07124841472277242, 0.019203674280747252, 0.041886275061629875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 123.8, 120, 131, 122.0, 131.0, 131.0, 131.0, 0.07125146065494344, 0.019204495254652718, 0.04195764724114344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 2.3977388211382116, 5.025724085365853], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1408.1636363636364, 944, 2188, 1327.0, 1959.2, 2060.9999999999995, 2188.0, 0.2533721530183533, 303.1211814225234, 0.500311028713975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/710e3c80-724e-43d3-9436-3cbf8e61010c", 3, 0, 0.0, 1087.0, 242, 2749, 270.0, 2749.0, 2749.0, 2749.0, 0.015992153183504627, 0.022046474196660837, 0.010255384691244828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1498.875, 331, 3789, 1396.5, 2784.0, 3728.25, 3789.0, 0.09432590385832249, 0.02947684495572578, 0.04255719490482909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 242.33333333333334, 117, 370, 242.0, 370.0, 370.0, 370.0, 0.03773656106718995, 0.01017118247514104, 0.02222182258155814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 122.16666666666666, 119, 124, 122.5, 124.0, 124.0, 124.0, 0.03779479943559766, 0.010186879535375932, 0.022219208261943155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 289.2352941176471, 119, 1299, 122.0, 1109.3999999999999, 1299.0, 1299.0, 0.11553779445146733, 12.258196280872378, 0.06675546510758608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 256.52941176470586, 118, 1075, 122.0, 794.1999999999997, 1075.0, 1075.0, 0.11553229807332903, 4.023985694383091, 0.0668651139182439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 242.33333333333331, 118, 370, 241.5, 370.0, 370.0, 370.0, 0.03773727310464546, 0.010097668779953961, 0.021522038567493112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 150.8235294117647, 120, 357, 123.0, 357.0, 357.0, 357.0, 0.11572655856444608, 0.08600381940189791, 0.058089307716919225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 207.83333333333331, 119, 363, 142.5, 363.0, 363.0, 363.0, 0.037791228655828984, 0.02808508301473228, 0.018969425321382908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 178.88235294117644, 118, 374, 123.0, 361.2, 374.0, 374.0, 0.11572734637194769, 0.051415171004173, 0.06485730648005066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 128.5, 124, 132, 128.5, 132.0, 132.0, 132.0, 0.04033233846898444, 0.03174596172461079, 0.014336885940146808], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 829.9999999999999, 120, 2899, 531.5, 2824.0, 2899.0, 2899.0, 0.10926317596834491, 0.02041825114531222, 0.07436389564196018], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1600.3000000000002, 1122, 2498, 1542.5, 2146.3, 2480.5, 2498.0, 0.087809032915216, 0.04544803461432077, 0.040388725100651106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 453.0, 242, 734, 387.0, 734.0, 734.0, 734.0, 0.037704784108690326, 0.058435051152823776, 0.08479894316632208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c4c416b-d28b-4b57-98cc-d0e733120b70", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["addBook", 56, 1, 1.7857142857142858, 1233.0714285714287, 619, 2509, 1005.5, 2102.2000000000003, 2193.85, 2509.0, 0.2922526942045247, 94.722918514991, 1.0637072547817237], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a36c6dee-5f96-4091-bafe-445014158b13", 3, 0, 0.0, 432.3333333333333, 303, 534, 460.0, 534.0, 534.0, 534.0, 0.02691959118114193, 0.026998457170930433, 0.017262888875927605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22b7c4b6-eef5-41e1-a4e9-32edc3440bb4", 3, 0, 0.0, 373.3333333333333, 222, 583, 315.0, 583.0, 583.0, 583.0, 0.017312719655130628, 0.02386698168602806, 0.011102232330926866], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 221.50909090909093, 118, 498, 126.0, 488.6, 495.4, 498.0, 0.25477588986269895, 0.18934028533741593, 0.12315826707230076], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 753.5818181818181, 583, 1110, 712.0, 1069.4, 1091.4, 1110.0, 0.2545282896624492, 74.83976829537777, 0.12800983317984505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5767d32-2316-438f-97b6-bb99f0071e33", 3, 0, 0.0, 915.6666666666666, 411, 1786, 550.0, 1786.0, 1786.0, 1786.0, 0.023931651204160916, 0.024001763463548105, 0.015346794554751629], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 193.1090909090909, 118, 508, 125.0, 368.4, 376.19999999999993, 508.0, 0.25525595210470137, 0.4516833839977723, 0.1241381485821692], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1184.8000000000002, 818, 1716, 1179.0, 1478.4, 1578.3999999999999, 1716.0, 0.2539899512339293, 228.5406045870008, 0.12749104974046843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 158.625, 124, 377, 127.0, 370.0, 377.0, 377.0, 0.13098005828612594, 0.09785131307508431, 0.046559317593896324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 1, 0.5988023952095808, 183.6467065868263, 120, 535, 132.0, 321.40000000000003, 375.79999999999995, 471.75999999999937, 0.7719616145554057, 1.6325050659980955, 0.3716166730996801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 127.8, 126, 132, 126.0, 132.0, 132.0, 132.0, 0.06498908183425184, 0.05032845888140792, 0.02310158768326921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac16d58f-7303-4142-a205-0c9d4c838ac2", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.6751288319238901, 1.2614792547568712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=199c1d7b-f806-41fb-897b-8bf039ed00d1", 1, 0, 0.0, 3036.0, 3036, 3036, 3036.0, 3036.0, 3036.0, 3036.0, 0.32938076416337286, 0.05950726696310935, 0.22709259716732544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 142.1764705882353, 124, 364, 127.0, 183.19999999999985, 364.0, 364.0, 0.10383581724896164, 0.08426519934949915, 0.036910388162716835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24e9f83a-ed1d-4e69-ae88-e91106ae2d9e", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 349.8, 246, 732, 260.0, 732.0, 732.0, 732.0, 0.07110858280594469, 0.11020441495413497, 0.1599248693379791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49b21f22-874a-42f1-ab66-d40325a93ae4", 3, 0, 0.0, 1450.6666666666665, 306, 2899, 1147.0, 2899.0, 2899.0, 2899.0, 0.031788079470198675, 0.025838162251655628, 0.020384933774834437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 472.0588235294118, 244, 1422, 258.0, 1241.1999999999998, 1422.0, 1422.0, 0.11543502026903149, 16.404962231104307, 0.2561413446652045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2438474e-8b7f-4ee1-a839-fc7533f13748", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 130.99999999999997, 122, 160, 129.0, 150.0, 160.0, 160.0, 0.06256436911052718, 0.05187221618636482, 0.022239678082257706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5241e81-cc15-4fe1-a9ec-deaf546889c6", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 146.82352941176467, 124, 371, 130.0, 198.99999999999983, 371.0, 371.0, 0.0839017264014056, 0.06513854735265376, 0.029824441806749646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c7a89b8-5e03-4b97-994b-0a30611288d8", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.44290698682385576, 0.8275723821081831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1dd4c8be-d5af-48cb-8beb-af517ab2fa5e", 3, 0, 0.0, 293.3333333333333, 216, 425, 239.0, 425.0, 425.0, 425.0, 0.05141123849673539, 0.0330524726663582, 0.03296879552036742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 124.0625, 121, 128, 124.0, 126.6, 128.0, 128.0, 0.11874633556230102, 0.08824800914346782, 0.05960509421779562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 167.4375, 119, 374, 122.0, 369.1, 374.0, 374.0, 0.11874633556230102, 0.042920886181637356, 0.06709921720189103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 272.625, 119, 1321, 123.5, 656.0000000000007, 1321.0, 1321.0, 0.11874721686210479, 6.708065359674187, 0.06917257310375538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 234.9375, 119, 721, 123.0, 477.40000000000026, 721.0, 721.0, 0.11874633556230102, 2.2122158205371787, 0.06928802294772934], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 61.53846153846154, 0.6329113924050633], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07911392405063292], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07911392405063292], "isController": false}, {"data": ["401/Unauthorized", 3, 23.076923076923077, 0.23734177215189872], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1264, 13, "406/Not Acceptable", 8, "401/Unauthorized", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
