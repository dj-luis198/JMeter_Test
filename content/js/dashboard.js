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

    var data = {"OkPercent": 98.49683544303798, "KoPercent": 1.5031645569620253};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7452380952380953, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/026d2292-d845-45f6-b66b-9faa33cfb71a"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=878fcda6-9f99-4a34-843e-b1a98a78726e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ded3148d-0087-4ff3-9e2e-cab5c61bcac7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5266215d-78e7-4ca5-9448-cb7529db19c1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa25cce0-9be7-47be-b891-8ed344c8d87d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b529d12-61f0-4c9a-afcc-5551d2f91140"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0347e5b9-25d5-43b6-9664-f168652ea11a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c60962dc-e4f3-4c08-a022-cf828bcbaada"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60f4c5f3-c744-465d-bd13-b7e09c9bdc43"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1957eb15-777b-414e-8f5b-0786648abd06"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5266215d-78e7-4ca5-9448-cb7529db19c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf8029bc-83ba-4314-9389-0787d9d5931a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c73f05e-068b-4598-9e82-b24c5baedba9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5da935e-3496-4896-a19a-5997c35df07c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e6bae11b-0a82-47d1-baf8-c9dec8d4ca39"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8295866d-0b20-409a-9f22-fb935f872363"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c73f05e-068b-4598-9e82-b24c5baedba9"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ded3148d-0087-4ff3-9e2e-cab5c61bcac7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/def388d4-7061-4e49-94b2-912ee4635fd6"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c60962dc-e4f3-4c08-a022-cf828bcbaada"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84f7fd4c-7bd3-4692-9778-2f1ddd72e18e"], "isController": false}, {"data": [0.9176470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5da935e-3496-4896-a19a-5997c35df07c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1957eb15-777b-414e-8f5b-0786648abd06"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60f4c5f3-c744-465d-bd13-b7e09c9bdc43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa25cce0-9be7-47be-b891-8ed344c8d87d"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/878fcda6-9f99-4a34-843e-b1a98a78726e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf8029bc-83ba-4314-9389-0787d9d5931a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8295866d-0b20-409a-9f22-fb935f872363"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6bae11b-0a82-47d1-baf8-c9dec8d4ca39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1264, 19, 1.5031645569620253, 445.65348101265755, 126, 2536, 144.5, 1263.5, 1543.25, 1954.4499999999975, 4.957368202248072, 707.0172703270725, 3.6145995523072942], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2181.2222222222226, 1606, 3107, 2117.5, 2682.0, 2812.0, 3107.0, 0.2507604077178481, 301.7485658913604, 1.232986965682974], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/026d2292-d845-45f6-b66b-9faa33cfb71a", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 691.6153846153846, 139, 2160, 552.0, 1642.7999999999995, 2160.0, 2160.0, 0.07179742081572917, 0.013602245740479938, 0.048535531093806095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 691.6153846153846, 139, 2160, 552.0, 1642.7999999999995, 2160.0, 2160.0, 0.07300909805683478, 0.013831801780298775, 0.049354632918679094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 205.13333333333335, 130, 410, 136.0, 408.8, 410.0, 410.0, 0.08841003394945303, 0.0413616213516126, 0.04943133929413429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=878fcda6-9f99-4a34-843e-b1a98a78726e", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 170.73333333333332, 129, 397, 137.0, 396.4, 397.0, 397.0, 0.08840586543448536, 0.06570006210512047, 0.04437560042316941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 291.3333333333333, 130, 1070, 136.0, 1045.4, 1070.0, 1070.0, 0.08840638647735913, 3.486572911693808, 0.051046630316907426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 363.33333333333337, 126, 1375, 136.0, 1324.0, 1375.0, 1375.0, 0.08840899178385771, 10.627393949730648, 0.0509617977379086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ded3148d-0087-4ff3-9e2e-cab5c61bcac7", 3, 0, 0.0, 437.66666666666663, 236, 752, 325.0, 752.0, 752.0, 752.0, 0.024832175878024353, 0.024904926393292, 0.01592427945302994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5266215d-78e7-4ca5-9448-cb7529db19c1", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 268.7692307692308, 135, 448, 245.0, 444.0, 448.0, 448.0, 0.07214166403072125, 0.14132981191835783, 0.046633039286685427], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aa25cce0-9be7-47be-b891-8ed344c8d87d", 3, 0, 0.0, 382.3333333333333, 220, 489, 438.0, 489.0, 489.0, 489.0, 0.03074936195073952, 0.024993866142902534, 0.01971882911554585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 155.35714285714286, 131, 408, 136.5, 276.0, 408.0, 408.0, 0.1510574018126888, 0.11226043240181267, 0.07582373489425981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 193.0714285714286, 132, 407, 136.5, 404.5, 407.0, 407.0, 0.15062833534171113, 0.05646461175546565, 0.08500162059950077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 877.0, 785, 1006, 858.5, 1006.0, 1006.0, 1006.0, 0.022525693368999015, 6.623301773898353, 0.012846684499507252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1432.5, 1156, 1573, 1500.5, 1573.0, 1573.0, 1573.0, 0.02243259006684912, 20.184883974438062, 0.012771679696262729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 335.75, 133, 408, 401.0, 408.0, 408.0, 408.0, 0.022574637394886844, 0.039946526327670866, 0.012499823635645353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 156.0, 128, 397, 136.0, 297.3999999999999, 397.0, 397.0, 0.0673198417465874, 0.05002968707925099, 0.033791404939205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 195.0, 128, 399, 135.0, 398.6, 399.0, 399.0, 0.06722828138655745, 0.03352323706760579, 0.03747249458295194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 358.8461538461538, 127, 1522, 135.0, 1479.6, 1522.0, 1522.0, 0.06687655616601848, 9.273043394525383, 0.03843191516451633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 284.6153846153846, 126, 1047, 134.0, 890.1999999999998, 1047.0, 1047.0, 0.06700374705570072, 3.046254490539586, 0.0385704412325597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b529d12-61f0-4c9a-afcc-5551d2f91140", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 135.25, 134, 138, 134.5, 138.0, 138.0, 138.0, 0.022608449908153173, 0.016801787480570863, 0.012695174508972729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 710.3, 131, 1753, 137.0, 1674.0000000000005, 1750.1499999999999, 1753.0, 0.0911053815948908, 36.90305778842825, 0.05003678379781894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 278.14285714285717, 128, 1624, 136.0, 1012.0, 1624.0, 1624.0, 0.14867046130320277, 9.592490698140557, 0.08648937271684648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 568.3, 129, 1336, 137.0, 1100.7, 1324.2499999999998, 1336.0, 0.09110828675422174, 12.068493715236494, 0.05012735230207863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 218.92857142857142, 129, 808, 135.0, 607.0, 808.0, 808.0, 0.14997000599880023, 3.187260148416745, 0.08739184082826291], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 631.7692307692307, 136, 1390, 594.0, 1221.9999999999998, 1390.0, 1390.0, 0.07355270900285157, 0.013934790572805866, 0.0503077986381433], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0347e5b9-25d5-43b6-9664-f168652ea11a", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c60962dc-e4f3-4c08-a022-cf828bcbaada", 3, 0, 0.0, 607.6666666666666, 245, 1019, 559.0, 1019.0, 1019.0, 1019.0, 0.018356258260316217, 0.02169647582786725, 0.011771428636986637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 539.3846153846155, 262, 1920, 274.0, 1771.1999999999998, 1920.0, 1920.0, 0.06682979992186054, 12.387896424412926, 0.1476711662185643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60f4c5f3-c744-465d-bd13-b7e09c9bdc43", 1, 0, 0.0, 845.0, 845, 845, 845.0, 845.0, 845.0, 845.0, 1.183431952662722, 0.21380362426035504, 0.8159208579881657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 556.2380952380953, 138, 1614, 437.0, 1093.2, 1565.4999999999993, 1614.0, 0.08642402093930564, 0.05308663004963208, 0.03907648603017433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 136.0, 131, 142, 137.0, 141.70000000000002, 142.0, 142.0, 0.09110413658332157, 0.06770532025381612, 0.04573000605842508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 187.75, 128, 410, 134.0, 406.7, 409.85, 410.0, 0.09110621162150835, 0.08595479594486252, 0.04851583710664893], "isController": false}, {"data": ["login", 21, 0, 0.0, 2414.333333333333, 1372, 4084, 2236.0, 3898.6000000000004, 4076.5, 4084.0, 0.08663652265751345, 19.862816803462987, 0.15808022877198918], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 141.28571428571428, 130, 156, 141.0, 151.0, 156.0, 156.0, 0.16333197223356472, 0.1322287158023683, 0.05805941200489996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1957eb15-777b-414e-8f5b-0786648abd06", 3, 0, 0.0, 403.6666666666667, 239, 630, 342.0, 630.0, 630.0, 630.0, 0.09281029575547581, 0.041994241894567505, 0.059517019087984166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 848.35, 264, 1893, 276.0, 1808.5000000000005, 1889.85, 1893.0, 0.09104731729079603, 49.09351814942914, 0.19428466114464688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5266215d-78e7-4ca5-9448-cb7529db19c1", 3, 0, 0.0, 332.3333333333333, 228, 516, 253.0, 516.0, 516.0, 516.0, 0.05898081157596729, 0.03791897879639824, 0.03782298138172382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf8029bc-83ba-4314-9389-0787d9d5931a", 1, 0, 0.0, 970.0, 970, 970, 970.0, 970.0, 970.0, 970.0, 1.0309278350515465, 0.1862516108247423, 0.7107764175257733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c73f05e-068b-4598-9e82-b24c5baedba9", 3, 0, 0.0, 330.6666666666667, 222, 435, 335.0, 435.0, 435.0, 435.0, 0.028713904229558093, 0.02333939416054901, 0.01841353884512677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5da935e-3496-4896-a19a-5997c35df07c", 3, 0, 0.0, 339.3333333333333, 235, 437, 346.0, 437.0, 437.0, 437.0, 0.05013955509501446, 0.03223490277104608, 0.03215329542225862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6bae11b-0a82-47d1-baf8-c9dec8d4ca39", 3, 0, 0.0, 662.6666666666666, 245, 970, 773.0, 970.0, 970.0, 970.0, 0.026300101693726548, 0.02637715277290739, 0.016865625109583757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 572.5333333333333, 272, 1513, 526.0, 1459.0, 1513.0, 1513.0, 0.08833350018550036, 14.208989838334972, 0.1956506516803976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8295866d-0b20-409a-9f22-fb935f872363", 3, 0, 0.0, 378.0, 278, 531, 325.0, 531.0, 531.0, 531.0, 0.0243789463419391, 0.02445036903630025, 0.01563363421016277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1091.5, 135, 1707, 1454.5, 1707.0, 1707.0, 1707.0, 0.03362324038375325, 26.819722166961803, 0.05797053798585582], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1158.904761904762, 399, 2005, 1150.0, 1743.6000000000001, 1979.6999999999996, 2005.0, 0.0902693896499697, 0.028662546155598635, 0.04072700978348242], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c73f05e-068b-4598-9e82-b24c5baedba9", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 474.7857142857142, 268, 1762, 276.5, 1289.0, 1762.0, 1762.0, 0.14845448279518583, 12.899582388924234, 0.33116450612374737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 161.23076923076923, 133, 410, 138.0, 315.5999999999999, 410.0, 410.0, 0.08119874329329611, 0.06304003995915079, 0.02886361578003885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 404.99999999999994, 263, 807, 275.5, 802.1, 807.0, 807.0, 0.0947519276095273, 0.1468469815589061, 0.21309930594213028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ded3148d-0087-4ff3-9e2e-cab5c61bcac7", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 133.45454545454547, 128, 143, 132.0, 142.0, 143.0, 143.0, 0.07590028083103907, 0.05640636104728588, 0.038098383151517666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 134.0909090909091, 127, 141, 133.0, 140.8, 141.0, 141.0, 0.07590080454852821, 0.020309394967086652, 0.0432871775940825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 158.63636363636363, 129, 400, 135.0, 348.00000000000017, 400.0, 400.0, 0.07590028083103907, 0.020457497567741, 0.04462106353543508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 132.63636363636365, 129, 136, 132.0, 136.0, 136.0, 136.0, 0.07590080454852821, 0.020457638725970496, 0.04469549330347902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 2.1685431985294117, 4.545323988970588], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1529.6296296296298, 1037, 2536, 1412.5, 2123.5, 2252.25, 2536.0, 0.23322708543885565, 279.02067703879345, 0.46053238941149033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1158.904761904762, 399, 2005, 1150.0, 1743.6000000000001, 1979.6999999999996, 2005.0, 0.0874835968255952, 0.027777994750984192, 0.03947013841154784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 135.2, 132, 139, 134.5, 139.0, 139.0, 139.0, 0.053184982688288134, 0.014335014865202661, 0.03131889117288843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 134.6, 132, 138, 135.0, 137.9, 138.0, 138.0, 0.053186962811675606, 0.01433554857033444, 0.03126811680920773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/def388d4-7061-4e49-94b2-912ee4635fd6", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 491.2307692307693, 126, 1629, 137.0, 1553.8, 1629.0, 1629.0, 0.08024344627084014, 16.678912552775497, 0.0455830033578796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 362.0769230769231, 128, 999, 137.0, 916.9999999999999, 999.0, 999.0, 0.08056519583539912, 5.483359704232771, 0.0458444530088002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 132.89999999999998, 128, 138, 132.5, 137.8, 138.0, 138.0, 0.05318583129454313, 0.014231365014360174, 0.03033254441016913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 174.6923076923077, 129, 401, 136.0, 393.0, 401.0, 401.0, 0.08089809329417036, 0.06012055566099965, 0.040607050735550355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 136.00000000000003, 131, 155, 134.0, 153.20000000000002, 155.0, 155.0, 0.053186114169312675, 0.03952600867465522, 0.026696936213893276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 266.3076923076923, 129, 508, 138.0, 471.59999999999997, 508.0, 508.0, 0.08075386842088916, 0.04959762832100284, 0.04448984908344359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 165.99999999999997, 136, 407, 138.5, 381.0000000000001, 407.0, 407.0, 0.0529739580022461, 0.04169629897442417, 0.018830586633610917], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 541.076923076923, 141, 776, 522.0, 774.8, 776.0, 776.0, 0.07584508932217826, 0.014209559252517474, 0.05161932912101376], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1250.5238095238094, 765, 1844, 1139.0, 1757.6000000000001, 1836.3999999999999, 1844.0, 0.08765083247421604, 0.045366153526693855, 0.04031595907749586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 273.4, 266, 295, 271.0, 293.1, 295.0, 295.0, 0.05314654095738179, 0.08236675830016103, 0.11952781623520534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c60962dc-e4f3-4c08-a022-cf828bcbaada", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1354.6551724137928, 680, 3528, 1055.5, 2358.0, 2565.3999999999996, 3528.0, 0.25630374645372833, 90.87110545352506, 0.9288766770219272], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 245.99999999999994, 132, 556, 139.0, 541.5, 553.75, 556.0, 0.23449611561527003, 0.17426908592111376, 0.11335505588824088], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 859.3703703703702, 633, 1212, 797.0, 1076.0, 1173.75, 1212.0, 0.23400429007865145, 68.80503095681755, 0.11768770448291553], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 214.3148148148148, 128, 541, 139.0, 405.5, 433.75, 541.0, 0.2346928131845207, 0.4152962670804214, 0.11413771578700324], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1275.9074074074074, 902, 1979, 1259.5, 1621.0, 1706.5, 1979.0, 0.2338198807518608, 210.3915397120335, 0.11736661983052389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 156.1875, 136, 396, 140.0, 225.20000000000016, 396.0, 396.0, 0.09584741092181248, 0.07160475522967437, 0.034070759351113034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84f7fd4c-7bd3-4692-9778-2f1ddd72e18e", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 204.94117647058832, 129, 1358, 140.0, 399.20000000000005, 434.34999999999997, 776.5099999999935, 0.7023284252970435, 1.5181356627398246, 0.3376727934493415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 187.8181818181818, 134, 405, 139.0, 403.8, 405.0, 405.0, 0.0758955676988464, 0.058774594907407406, 0.0269785025804493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 157.86666666666667, 131, 428, 139.0, 260.6000000000001, 428.0, 428.0, 0.08489492837697876, 0.0688942241028021, 0.03017749407150417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5da935e-3496-4896-a19a-5997c35df07c", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1957eb15-777b-414e-8f5b-0786648abd06", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 295.00000000000006, 262, 531, 272.0, 481.4000000000002, 531.0, 531.0, 0.07583069074865573, 0.11752275997862953, 0.17054500077554116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60f4c5f3-c744-465d-bd13-b7e09c9bdc43", 3, 0, 0.0, 489.33333333333337, 244, 776, 448.0, 776.0, 776.0, 776.0, 0.023270606121720782, 0.027914122252129258, 0.014922882180921205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa25cce0-9be7-47be-b891-8ed344c8d87d", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 730.0, 264, 1842, 535.0, 1810.8, 1842.0, 1842.0, 0.080179107791559, 22.231452510068646, 0.1755905596039152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/878fcda6-9f99-4a34-843e-b1a98a78726e", 3, 0, 0.0, 447.0, 251, 568, 522.0, 568.0, 568.0, 568.0, 0.04986204833294552, 0.032056492661968555, 0.031975336984343315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 138.6153846153846, 131, 152, 138.0, 147.6, 152.0, 152.0, 0.06594499173151258, 0.05467509568364666, 0.023441383779561113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 164.20000000000002, 133, 397, 139.0, 368.3000000000005, 396.8, 397.0, 0.09243083862499885, 0.07176027022155672, 0.03285627466748006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf8029bc-83ba-4314-9389-0787d9d5931a", 3, 0, 0.0, 348.3333333333333, 222, 473, 350.0, 473.0, 473.0, 473.0, 0.02437359851808521, 0.024445005544993664, 0.015630204778850215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8295866d-0b20-409a-9f22-fb935f872363", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 167.9375, 127, 400, 134.5, 399.3, 400.0, 400.0, 0.0948277394844927, 0.07047256811298724, 0.047599080170927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 199.75, 126, 403, 135.0, 400.2, 403.0, 403.0, 0.09482886353533856, 0.025374129500666767, 0.05408208623499778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 199.49999999999997, 130, 407, 134.5, 406.3, 407.0, 407.0, 0.09482998761283287, 0.025559645098771358, 0.05574966068645057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6bae11b-0a82-47d1-baf8-c9dec8d4ca39", 1, 0, 0.0, 1390.0, 1390, 1390, 1390.0, 1390.0, 1390.0, 1390.0, 0.7194244604316546, 0.12997414568345325, 0.4960094424460432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 199.43749999999997, 128, 413, 133.0, 403.2, 413.0, 413.0, 0.0948294255707546, 0.025559493610867453, 0.05584193712809085], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 21.05263157894737, 0.31645569620253167], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07911392405063292], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07911392405063292], "isController": false}, {"data": ["401/Unauthorized", 13, 68.42105263157895, 1.0284810126582278], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1264, 19, "401/Unauthorized", 13, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
