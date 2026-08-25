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

    var data = {"OkPercent": 98.37083010085337, "KoPercent": 1.6291698991466252};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.735981308411215, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/85cd7452-2d4d-40a1-9ea5-2edcf23e40b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/419ec324-9224-49a6-90c4-2764dd2ce8c7"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d44d4ea8-684d-4107-b3e2-89638591d8ed"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f0b7a19-c65d-424c-b414-c09b931b1486"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/785d4ac7-b557-4550-821f-53493e4a3350"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58bb9eb9-ae0c-4d84-ab68-f79186e859de"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7002948-1636-4cf0-b4fc-f0f09e135097"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5cf63c0-c8be-4164-bde9-c577b3206899"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce7bce94-ac76-43e1-ae9b-b464c8389d5e"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d46e4a9-a40e-46fc-a113-0e5d5737a5da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e516aaf-c935-4723-8f6e-3d35950a3582"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=962e08a0-de59-42f8-8e20-bb024954a24a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbf0ad2d-a75b-46cd-a6c2-47c862b14b3b"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d49133a5-bac5-454a-9748-297e1f55a228"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85cd7452-2d4d-40a1-9ea5-2edcf23e40b2"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d49133a5-bac5-454a-9748-297e1f55a228"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=785d4ac7-b557-4550-821f-53493e4a3350"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.29245283018867924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fbf0ad2d-a75b-46cd-a6c2-47c862b14b3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f0b7a19-c65d-424c-b414-c09b931b1486"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa5132fb-644f-4c9d-9e16-2f7d14925a6c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce7bce94-ac76-43e1-ae9b-b464c8389d5e"], "isController": false}, {"data": [0.31746031746031744, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=419ec324-9224-49a6-90c4-2764dd2ce8c7"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3584905660377358, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9441340782122905, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5cf63c0-c8be-4164-bde9-c577b3206899"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4f71e00f-bcda-4985-9f6d-b70ac5c55b6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/962e08a0-de59-42f8-8e20-bb024954a24a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e516aaf-c935-4723-8f6e-3d35950a3582"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 21, 1.6291698991466252, 473.1140418929407, 139, 3026, 156.0, 1293.0, 1574.5, 2128.5999999999976, 5.003687745040953, 671.9802379626664, 3.6558487757656923], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/85cd7452-2d4d-40a1-9ea5-2edcf23e40b2", 3, 0, 0.0, 596.3333333333334, 466, 779, 544.0, 779.0, 779.0, 779.0, 0.01700516390143807, 0.023442991250843172, 0.010905004194607095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/419ec324-9224-49a6-90c4-2764dd2ce8c7", 3, 0, 0.0, 434.0, 239, 630, 433.0, 630.0, 630.0, 630.0, 0.029812775768175856, 0.024853684486425248, 0.019118218835711732], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2375.396226415095, 1693, 3065, 2325.0, 2842.4, 3027.7999999999997, 3065.0, 0.24033120360587495, 289.1993823303851, 1.181706650542559], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d44d4ea8-684d-4107-b3e2-89638591d8ed", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 683.8571428571429, 147, 1159, 702.5, 1122.5, 1159.0, 1159.0, 0.08213166879817901, 0.016849137690809465, 0.05498169820424973], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 683.8571428571429, 147, 1159, 702.5, 1122.5, 1159.0, 1159.0, 0.08376211559171952, 0.017183620393083642, 0.05607317406066771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f0b7a19-c65d-424c-b414-c09b931b1486", 3, 0, 0.0, 546.6666666666666, 263, 928, 449.0, 928.0, 928.0, 928.0, 0.026243963888305688, 0.02632085050125971, 0.016829625279935614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 199.93333333333334, 140, 432, 143.0, 430.2, 432.0, 432.0, 0.11348419165210287, 0.053092278724740316, 0.06345066653048564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 164.86666666666667, 140, 436, 145.0, 273.4000000000001, 436.0, 436.0, 0.11346273127486725, 0.08432142431657615, 0.05695297253445485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 362.3333333333333, 141, 1135, 145.0, 1134.4, 1135.0, 1135.0, 0.11348333308114815, 4.475558054290427, 0.06552628132139993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 380.4, 141, 1695, 144.0, 1622.4, 1695.0, 1695.0, 0.11348333308114815, 13.641509342515397, 0.06541545775393787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/785d4ac7-b557-4550-821f-53493e4a3350", 3, 0, 0.0, 419.66666666666663, 245, 759, 255.0, 759.0, 759.0, 759.0, 0.029247747923409898, 0.0243826440207854, 0.01875588001598877], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 276.0, 144, 544, 263.0, 506.5, 544.0, 544.0, 0.08233598964918987, 0.16156485245684712, 0.053211700899814744], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 165.9375, 142, 436, 145.5, 252.6000000000002, 436.0, 436.0, 0.09071220419317165, 0.06741405018652696, 0.045533274370400605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 179.5625, 139, 434, 143.5, 427.7, 434.0, 434.0, 0.09071477573606536, 0.024273289601251864, 0.05173577053697477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1024.0, 849, 1133, 1057.0, 1133.0, 1133.0, 1133.0, 0.16233766233766234, 47.73266284496753, 0.09258319805194805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1379.75, 1274, 1440, 1402.5, 1440.0, 1440.0, 1440.0, 0.1603399206317393, 144.27414243195574, 0.09128727903154689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 353.75, 145, 430, 420.0, 430.0, 430.0, 430.0, 0.16911889058007779, 0.29926116184677826, 0.09364297945205478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 201.4, 140, 435, 144.0, 435.0, 435.0, 435.0, 0.09133031740329642, 0.06787340971084821, 0.04584353822782652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 258.00000000000006, 141, 433, 145.0, 433.0, 433.0, 433.0, 0.09133031740329642, 0.024437995086428924, 0.052086821644067485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 275.40000000000003, 139, 432, 146.0, 431.4, 432.0, 432.0, 0.09117487949720093, 0.02457447923947994, 0.05360085689190914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 238.4, 140, 435, 144.0, 433.8, 435.0, 435.0, 0.0911765420992487, 0.02457492736268813, 0.05369087391195993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 143.5, 142, 146, 143.0, 146.0, 146.0, 146.0, 0.16914034420060045, 0.12569902532876653, 0.09497626749545435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58bb9eb9-ae0c-4d84-ab68-f79186e859de", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 24, 0, 0.0, 764.9583333333333, 142, 1858, 147.0, 1845.5, 1857.5, 1858.0, 0.12108369910700773, 45.41542311500429, 0.06684829221532718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 214.74999999999997, 142, 434, 144.5, 428.4, 434.0, 434.0, 0.09057048081604002, 0.024411574907448292, 0.05324553657349229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 24, 0, 0.0, 563.0416666666666, 141, 1274, 146.5, 1148.0, 1243.0, 1274.0, 0.12108492089118501, 14.853615740787456, 0.0669672137350662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 214.125, 140, 431, 144.0, 431.0, 431.0, 431.0, 0.09071477573606536, 0.024450466897611364, 0.053418954852390045], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 494.92307692307696, 148, 812, 513.0, 801.2, 812.0, 812.0, 0.07936895574875452, 0.016431854119859333, 0.05341545031198105], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d7002948-1636-4cf0-b4fc-f0f09e135097", 2, 0, 0.0, 253.5, 232, 275, 253.5, 275.0, 275.0, 275.0, 0.01593562009481694, 0.026953607425998966, 0.009905295107764632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5cf63c0-c8be-4164-bde9-c577b3206899", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce7bce94-ac76-43e1-ae9b-b464c8389d5e", 3, 0, 0.0, 440.0, 247, 641, 432.0, 641.0, 641.0, 641.0, 0.02965393853727006, 0.029740815310328465, 0.019016360325007167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 518.4666666666666, 288, 869, 572.0, 863.0, 869.0, 869.0, 0.09109514584332849, 0.14117968403648665, 0.20487511804412648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 748.1999999999999, 217, 1590, 652.0, 1517.1000000000004, 1586.95, 1590.0, 0.09074368991066284, 0.05574002046270207, 0.04102961760609072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 24, 0, 0.0, 145.33333333333331, 143, 150, 145.0, 149.5, 150.0, 150.0, 0.1210812556126207, 0.08998323781367613, 0.06077711463367875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 24, 0, 0.0, 191.16666666666669, 139, 434, 144.0, 427.5, 432.75, 434.0, 0.12108369910700773, 0.10817519928358811, 0.06481840598355279], "isController": false}, {"data": ["login", 20, 0, 0.0, 2903.8999999999996, 1960, 4858, 2709.0, 4510.900000000001, 4842.3, 4858.0, 0.09180291749671804, 22.092999654591523, 0.16895681476007307], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 151.5625, 144, 182, 149.0, 163.8, 182.0, 182.0, 0.09046703607373063, 0.07323942666515888, 0.032158204229333937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d46e4a9-a40e-46fc-a113-0e5d5737a5da", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e516aaf-c935-4723-8f6e-3d35950a3582", 1, 0, 0.0, 812.0, 812, 812, 812.0, 812.0, 812.0, 812.0, 1.2315270935960592, 0.22249268780788176, 0.8490802032019704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=962e08a0-de59-42f8-8e20-bb024954a24a", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbf0ad2d-a75b-46cd-a6c2-47c862b14b3b", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 24, 0, 0.0, 911.8333333333333, 289, 2003, 296.5, 1991.5, 2002.75, 2003.0, 0.12099396542597438, 60.42223782435205, 0.25921933055047214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d49133a5-bac5-454a-9748-297e1f55a228", 3, 0, 0.0, 369.3333333333333, 275, 478, 355.0, 478.0, 478.0, 478.0, 0.03578927276197748, 0.029836044122208437, 0.022950803170929568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85cd7452-2d4d-40a1-9ea5-2edcf23e40b2", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 652.5333333333333, 287, 1836, 571.0, 1767.0, 1836.0, 1836.0, 0.11334013374135782, 18.23146150921833, 0.2510380657561676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 833.75, 144, 1586, 781.0, 1586.0, 1586.0, 1586.0, 0.11686680106348789, 69.92229727262104, 0.1699789959315745], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1327.3333333333335, 205, 3026, 1288.0, 1823.0000000000002, 2909.8999999999983, 3026.0, 0.08747193608717203, 0.027774292206250495, 0.03946487741432957], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 436.0, 287, 870, 296.0, 687.3000000000002, 870.0, 870.0, 0.09049466647059488, 0.14024905828987702, 0.2035246258611133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 167.68750000000003, 144, 441, 148.0, 254.80000000000018, 441.0, 441.0, 0.09927898636154925, 0.07707694741936684, 0.03529057718320696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d49133a5-bac5-454a-9748-297e1f55a228", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 799.0769230769231, 288, 2663, 576.0, 2170.5999999999995, 2663.0, 2663.0, 0.08620346670556873, 23.901840879175893, 0.1887837789113165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=785d4ac7-b557-4550-821f-53493e4a3350", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 144.5, 143, 149, 144.0, 148.7, 149.0, 149.0, 0.04947531429193404, 0.036768275562658013, 0.024834288619193453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 171.60000000000002, 141, 430, 143.0, 401.60000000000014, 430.0, 430.0, 0.04947604864485102, 0.013238708328798029, 0.0282168089927666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 229.1, 142, 434, 145.0, 433.5, 434.0, 434.0, 0.049409311678879, 0.013317353538447856, 0.029047271123715978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 201.8, 142, 430, 143.0, 429.7, 430.0, 430.0, 0.04940613821861228, 0.01331649819173534, 0.029093653658030474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 152.66666666666666, 148, 155, 155.0, 155.0, 155.0, 155.0, 0.10993037742762916, 0.03242087303041407, 0.06795500870282155], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1594.1886792452833, 1115, 2465, 1437.0, 2237.6, 2424.2, 2465.0, 0.2522440199129996, 301.7715420259954, 0.4980834065078957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1327.3333333333335, 205, 3026, 1288.0, 1823.0000000000002, 2909.8999999999983, 3026.0, 0.084717728596671, 0.026899769850170646, 0.03822225645670117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 189.28571428571428, 142, 425, 145.0, 425.0, 425.0, 425.0, 0.04480860325182435, 0.012077318845218283, 0.02638631617270516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 229.71428571428572, 141, 434, 145.0, 434.0, 434.0, 434.0, 0.04480602192934731, 0.01207662309814439, 0.02634104023580769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbf0ad2d-a75b-46cd-a6c2-47c862b14b3b", 3, 0, 0.0, 784.0, 276, 1083, 993.0, 1083.0, 1083.0, 1083.0, 0.03853812062431755, 0.024776298252938533, 0.02471357344723489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 196.62500000000003, 141, 433, 144.0, 428.1, 433.0, 433.0, 0.09816011141172645, 0.026457217528941895, 0.0577074092479095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 224.25, 141, 581, 144.0, 477.4000000000001, 581.0, 581.0, 0.09798938040089905, 0.026411200186179824, 0.05770273084154505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 180.625, 143, 437, 144.0, 431.4, 437.0, 437.0, 0.09815710043925302, 0.07294682952565582, 0.04927026330642193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 188.57142857142858, 141, 421, 145.0, 421.0, 421.0, 421.0, 0.044889923494744674, 0.012011561560117226, 0.02560128449309657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 196.31249999999994, 140, 428, 144.0, 426.6, 428.0, 428.0, 0.09816071362838807, 0.02626565970134603, 0.055982281991190076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 145.57142857142858, 144, 150, 145.0, 150.0, 150.0, 150.0, 0.04488934775777708, 0.03336015004264488, 0.02253234838622795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f0b7a19-c65d-424c-b414-c09b931b1486", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 238.71428571428572, 145, 508, 148.0, 508.0, 508.0, 508.0, 0.046605458164943374, 0.036683593047797225, 0.016566783957069713], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 597.0909090909091, 144, 993, 630.0, 950.2000000000002, 993.0, 993.0, 0.08001280204832772, 0.015087641295334525, 0.05445473548495031], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1508.8999999999999, 876, 2041, 1474.0, 2006.2, 2039.5, 2041.0, 0.08952351111210582, 0.046335411024820396, 0.04117731809941586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 377.42857142857144, 288, 581, 292.0, 581.0, 581.0, 581.0, 0.044764761179999106, 0.06937663671158065, 0.10067699706790816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa5132fb-644f-4c9d-9e16-2f7d14925a6c", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.7807724633251835, 1.4588745415647923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce7bce94-ac76-43e1-ae9b-b464c8389d5e", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["addBook", 63, 7, 11.11111111111111, 1390.3650793650795, 732, 3212, 1151.0, 2508.8, 2833.4, 3212.0, 0.2947382209975251, 85.0694175396727, 1.0737897457999803], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=419ec324-9224-49a6-90c4-2764dd2ce8c7", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 238.2452830188679, 140, 591, 146.0, 579.6, 587.0, 591.0, 0.2538131839187798, 0.18862483687714005, 0.12269289652323827], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 908.6037735849058, 702, 1305, 850.0, 1157.4, 1275.0, 1305.0, 0.2531875355298546, 74.4455420631679, 0.12733552812292495], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 186.67924528301882, 142, 570, 147.0, 428.2, 435.6, 570.0, 0.25438575439775374, 0.45014354196165013, 0.12371494696297007], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1351.3018867924534, 969, 1876, 1288.0, 1718.6, 1847.0, 1876.0, 0.25298450111933707, 227.6358988064979, 0.12698636091341725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 150.23076923076923, 144, 162, 147.0, 162.0, 162.0, 162.0, 0.08457484874113591, 0.06318335867868063, 0.03006371576345065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 7, 3.910614525139665, 218.11731843575416, 141, 1178, 152.0, 377.0, 485.0, 800.3999999999946, 0.7731279721155632, 1.5574840488366368, 0.3765632963434071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 149.9, 146, 160, 148.5, 159.6, 160.0, 160.0, 0.04905375310264988, 0.037987916221095076, 0.017437076298207576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5cf63c0-c8be-4164-bde9-c577b3206899", 3, 0, 0.0, 432.6666666666667, 305, 524, 469.0, 524.0, 524.0, 524.0, 0.02655313725316646, 0.031384909298908664, 0.017027890751542294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 150.53333333333333, 145, 163, 149.0, 159.4, 163.0, 163.0, 0.10275591360282785, 0.08338883223041986, 0.03652651616350521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f71e00f-bcda-4985-9f6d-b70ac5c55b6d", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.5622111575704226, 1.0504924075704227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/962e08a0-de59-42f8-8e20-bb024954a24a", 3, 0, 0.0, 334.6666666666667, 244, 497, 263.0, 497.0, 497.0, 497.0, 0.060210737581535376, 0.038709702709483186, 0.03861170346211741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e516aaf-c935-4723-8f6e-3d35950a3582", 3, 0, 0.0, 441.6666666666667, 325, 674, 326.0, 674.0, 674.0, 674.0, 0.025527569775357386, 0.03017272325987066, 0.016370218898910823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 375.8, 288, 581, 291.0, 580.2, 581.0, 581.0, 0.04937028205242137, 0.07651429454803976, 0.11103492145188126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 459.62500000000006, 286, 866, 295.5, 863.2, 866.0, 866.0, 0.09790064308484928, 0.15172687556216383, 0.22018084084414827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 166.6, 143, 432, 148.0, 266.4000000000001, 432.0, 432.0, 0.09577687818458121, 0.07940875935420844, 0.03404568716717535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 24, 0, 0.0, 183.29166666666663, 143, 428, 148.0, 422.5, 427.25, 428.0, 0.11820738500637827, 0.09177233503913157, 0.04201903138898603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 166.53846153846155, 141, 423, 145.0, 313.7999999999999, 423.0, 423.0, 0.08766665093162675, 0.06515070445211715, 0.044004549393414215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 381.6923076923077, 143, 1812, 146.0, 1261.1999999999994, 1812.0, 1812.0, 0.08668978394238464, 0.053243364897305946, 0.047760131868498264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 493.0769230769231, 139, 1291, 424.0, 1289.8, 1291.0, 1291.0, 0.08699201680953432, 18.081629199455968, 0.04941658887572856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 574.6153846153845, 142, 2516, 423.0, 2012.3999999999996, 2516.0, 2516.0, 0.08628471300376997, 5.872636607782882, 0.0490990610729836], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 19.047619047619047, 0.3103180760279286], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 14.285714285714286, 0.23273855702094648], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07757951900698215], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.008533747090768], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 21, "401/Unauthorized", 13, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
