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

    var data = {"OkPercent": 98.09741248097413, "KoPercent": 1.9025875190258752};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7498367080339647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4aff669f-800a-4680-9842-91976c1686f9"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee4671eb-6d35-4e96-ad04-b3c6f47890d6"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62cef99d-1e62-4ee6-b8c5-64fa23832c00"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a343a7e9-9ebf-4af9-80e7-19348ee5fc5e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72d50845-4ffd-4b4a-9d3e-28154a583390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=631304d6-4891-4490-b851-7bc38a0db856"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15f49ba8-c3d1-4c50-8c31-d1e90366d4b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/52ae549d-674d-4cc7-8a03-d8b008afe869"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=912d6b88-8959-45db-a6c1-bf49dd02d7d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4db05b96-ea23-4960-a428-c58e5695aabb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=949044e4-56fb-40af-a49b-192ba07ce096"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=090b3875-61da-4140-b67d-00d850a04423"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0c393ea-ec3c-445e-9f66-12d42c464cbe"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/631304d6-4891-4490-b851-7bc38a0db856"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/62cef99d-1e62-4ee6-b8c5-64fa23832c00"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a343a7e9-9ebf-4af9-80e7-19348ee5fc5e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72d50845-4ffd-4b4a-9d3e-28154a583390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ee4671eb-6d35-4e96-ad04-b3c6f47890d6"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4aff669f-800a-4680-9842-91976c1686f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15f49ba8-c3d1-4c50-8c31-d1e90366d4b6"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/34c887e6-cc3a-4838-aa63-cb4772d119c9"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9228571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e65f29a8-8e51-4e8b-8aa6-2de42368a8b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e65f29a8-8e51-4e8b-8aa6-2de42368a8b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e0c393ea-ec3c-445e-9f66-12d42c464cbe"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/090b3875-61da-4140-b67d-00d850a04423"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/912d6b88-8959-45db-a6c1-bf49dd02d7d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/949044e4-56fb-40af-a49b-192ba07ce096"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4db05b96-ea23-4960-a428-c58e5695aabb"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 25, 1.9025875190258752, 434.3987823439882, 133, 3818, 152.0, 1118.5, 1280.5, 2005.4999999999973, 5.122307767274145, 721.525698792759, 3.7460256066660174], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4aff669f-800a-4680-9842-91976c1686f9", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2083.89090909091, 1669, 2612, 2067.0, 2457.4, 2515.3999999999996, 2612.0, 0.23705261706089234, 285.2538237529955, 1.165585866114837], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee4671eb-6d35-4e96-ad04-b3c6f47890d6", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 907.2142857142857, 144, 3818, 703.5, 2556.0, 3818.0, 3818.0, 0.08250192995586146, 0.015578454547329588, 0.05579354149847077], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 907.2142857142857, 144, 3818, 703.5, 2556.0, 3818.0, 3818.0, 0.08282847406285498, 0.015640114347666604, 0.05601437332863972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 216.57142857142858, 134, 597, 143.0, 424.0, 579.6999999999998, 597.0, 0.13559322033898305, 0.03628177966101695, 0.07733050847457627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 156.52380952380952, 135, 426, 143.0, 150.8, 398.4999999999996, 426.0, 0.13558796753636662, 0.10076410478044434, 0.06805880401727778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 208.95238095238096, 135, 430, 143.0, 426.8, 429.8, 430.0, 0.13534503315953314, 0.03647971596878041, 0.07970024901874852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 208.42857142857144, 134, 445, 142.0, 437.6, 444.6, 445.0, 0.13534852244529663, 0.03648065644033386, 0.07957012745319197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62cef99d-1e62-4ee6-b8c5-64fa23832c00", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 268.2142857142857, 142, 379, 246.5, 371.0, 379.0, 379.0, 0.08244654225090839, 0.16828618299010054, 0.053294650323602685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a343a7e9-9ebf-4af9-80e7-19348ee5fc5e", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72d50845-4ffd-4b4a-9d3e-28154a583390", 1, 0, 0.0, 1148.0, 1148, 1148, 1148.0, 1148.0, 1148.0, 1148.0, 0.8710801393728222, 0.1573728767421603, 0.6005689242160279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 160.11764705882354, 137, 426, 144.0, 205.9999999999998, 426.0, 426.0, 0.14146743336467807, 0.10513351249074221, 0.07101002026312943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 234.7058823529412, 141, 570, 144.0, 457.1999999999999, 570.0, 570.0, 0.14113974495217854, 0.06270535313994421, 0.07909922746745483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 801.1428571428571, 693, 986, 713.0, 986.0, 986.0, 986.0, 0.057436839989169056, 16.888338039393467, 0.032756947806322975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1148.8571428571427, 982, 1278, 1209.0, 1278.0, 1278.0, 1278.0, 0.05736952530815631, 51.621199717147746, 0.03266253247524915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 337.1428571428571, 136, 430, 404.0, 430.0, 430.0, 430.0, 0.05764495647805786, 0.10200455189281331, 0.03191864289361211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 160.14285714285714, 134, 407, 142.0, 278.5, 407.0, 407.0, 0.08055699407330687, 0.059867062978307156, 0.040435834915702865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=631304d6-4891-4490-b851-7bc38a0db856", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15f49ba8-c3d1-4c50-8c31-d1e90366d4b6", 3, 0, 0.0, 368.0, 240, 478, 386.0, 478.0, 478.0, 478.0, 0.03263849601810349, 0.027209371192175466, 0.020930285532442666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 182.64285714285717, 134, 423, 143.5, 422.5, 423.0, 423.0, 0.08056116606533512, 0.030199198272538422, 0.04546176293726011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 281.64285714285717, 134, 1259, 141.5, 851.0, 1259.0, 1259.0, 0.08055792114530347, 5.197744746832347, 0.046864750443068565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 278.49999999999994, 135, 945, 142.5, 694.5, 945.0, 945.0, 0.0805607024893257, 1.7121284677066668, 0.04694504105718659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 146.28571428571428, 139, 153, 149.0, 153.0, 153.0, 153.0, 0.057763877771634636, 0.04292803807052144, 0.03243577120965812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 694.3333333333333, 134, 1376, 951.0, 1295.9, 1376.0, 1376.0, 0.08062746081729369, 40.31450903755448, 0.04355072699093837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 286.47058823529414, 134, 1197, 143.0, 1025.8, 1197.0, 1197.0, 0.14114443226727774, 14.974979943998871, 0.08155047677758959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 597.9444444444443, 133, 1121, 699.5, 1048.1000000000001, 1121.0, 1121.0, 0.08062854429642635, 13.180474818137839, 0.0436300510423479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 239.94117647058823, 136, 701, 143.0, 696.2, 701.0, 701.0, 0.14147920671776562, 4.927715568538353, 0.08188206615817376], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 567.4285714285714, 143, 1148, 626.0, 1015.0, 1148.0, 1148.0, 0.08250047143126532, 0.015578179140934376, 0.0564601091805346], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 506.99999999999994, 275, 1410, 421.5, 1130.5, 1410.0, 1410.0, 0.08049168923308668, 6.994124780444544, 0.17955665608775892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 459.6363636363637, 161, 1039, 409.5, 859.2999999999998, 1021.4499999999997, 1039.0, 0.09280429262037139, 0.05700576177559922, 0.0419613159015937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 142.88888888888889, 134, 150, 142.0, 149.1, 150.0, 150.0, 0.0807276249932727, 0.05999386974597707, 0.040521483639201335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 298.83333333333337, 136, 444, 407.5, 442.2, 444.0, 444.0, 0.08062818313347996, 0.0888519778541257, 0.042221312044506756], "isController": false}, {"data": ["login", 22, 0, 0.0, 2713.545454545455, 1221, 4849, 2740.5, 4147.2, 4752.999999999998, 4849.0, 0.09424666923703037, 36.00275895744977, 0.1919238369104228], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 146.23529411764707, 141, 152, 146.0, 151.2, 152.0, 152.0, 0.1377098049381116, 0.11148576981806105, 0.04895153222409436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52ae549d-674d-4cc7-8a03-d8b008afe869", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.5175622974068071, 0.9670659440842788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=912d6b88-8959-45db-a6c1-bf49dd02d7d5", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4db05b96-ea23-4960-a428-c58e5695aabb", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=949044e4-56fb-40af-a49b-192ba07ce096", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=090b3875-61da-4140-b67d-00d850a04423", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 859.0555555555557, 278, 1528, 1118.5, 1439.8000000000002, 1528.0, 1528.0, 0.0805726026293526, 53.607078750766554, 0.16975675187219394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0c393ea-ec3c-445e-9f66-12d42c464cbe", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 443.95238095238096, 278, 872, 300.0, 715.6000000000001, 859.6999999999998, 872.0, 0.13521431468878173, 0.20955577872177403, 0.3041001628205706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1039.2222222222222, 141, 1428, 1181.0, 1428.0, 1428.0, 1428.0, 0.07367085499120044, 68.55456759300945, 0.14005136495722997], "isController": false}, {"data": ["register", 24, 9, 37.5, 874.4583333333335, 277, 2133, 884.5, 1398.0, 1967.75, 2133.0, 0.098068860685011, 0.030502863406421877, 0.0442459117543702], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 507.9411764705883, 282, 1340, 298.0, 1169.6, 1340.0, 1340.0, 0.14096302622741483, 20.032855851313027, 0.312786007243012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 148.0, 136, 169, 147.0, 165.20000000000002, 169.0, 169.0, 0.06956521739130433, 0.05400815217391304, 0.024728260869565217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/631304d6-4891-4490-b851-7bc38a0db856", 3, 0, 0.0, 340.3333333333333, 237, 539, 245.0, 539.0, 539.0, 539.0, 0.06998553632249335, 0.030983180142770496, 0.04488004770680726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 532.8181818181819, 280, 2250, 560.5, 780.1999999999998, 2041.949999999997, 2250.0, 0.09929634995644501, 5.546574748430441, 0.2221650045811725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62cef99d-1e62-4ee6-b8c5-64fa23832c00", 3, 0, 0.0, 679.6666666666667, 263, 1506, 270.0, 1506.0, 1506.0, 1506.0, 0.019674066301603437, 0.023254080319375675, 0.012616507361379807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a343a7e9-9ebf-4af9-80e7-19348ee5fc5e", 3, 0, 0.0, 1079.6666666666667, 308, 2151, 780.0, 2151.0, 2151.0, 2151.0, 0.03152154497599109, 0.02627821506624778, 0.02021401158942137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72d50845-4ffd-4b4a-9d3e-28154a583390", 3, 0, 0.0, 434.33333333333337, 240, 805, 258.0, 805.0, 805.0, 805.0, 0.028672190842102246, 0.023622823900182548, 0.01838678904913458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 182.85714285714286, 141, 420, 143.0, 420.0, 420.0, 420.0, 0.04221266741845417, 0.03137093740765979, 0.021188780325278756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 142.0, 136, 148, 142.0, 148.0, 148.0, 148.0, 0.04221368567689645, 0.011295458862763307, 0.024074992612605005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 221.7142857142857, 140, 424, 142.0, 424.0, 424.0, 424.0, 0.042142272311323024, 0.011358659333911284, 0.024775046808023886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 181.14285714285714, 137, 429, 140.0, 429.0, 429.0, 429.0, 0.042140242727798115, 0.011358112297726835, 0.024815006215685803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1339.8727272727272, 1083, 2010, 1174.0, 1840.9999999999998, 1947.1999999999998, 2010.0, 0.23555007366293212, 281.7997785561637, 0.46511938373676637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee4671eb-6d35-4e96-ad04-b3c6f47890d6", 3, 0, 0.0, 678.6666666666667, 238, 1552, 246.0, 1552.0, 1552.0, 1552.0, 0.04603203829865586, 0.03013360319615786, 0.029519243310010435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 874.4583333333335, 277, 2133, 884.5, 1398.0, 1967.75, 2133.0, 0.09779433037369659, 0.030417474828146836, 0.044122051399070134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4aff669f-800a-4680-9842-91976c1686f9", 3, 0, 0.0, 1306.6666666666667, 333, 2426, 1161.0, 2426.0, 2426.0, 2426.0, 0.0198368091831202, 0.023446436895803852, 0.012720870472248303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 200.2, 142, 416, 147.0, 416.0, 416.0, 416.0, 0.024371222460518618, 0.006568806053811659, 0.01435141322626243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 201.6, 141, 418, 143.0, 418.0, 418.0, 418.0, 0.024371935229144936, 0.006568998167230471, 0.014328032234321534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15f49ba8-c3d1-4c50-8c31-d1e90366d4b6", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 243.6363636363636, 140, 981, 143.0, 868.8000000000004, 981.0, 981.0, 0.07558007709167865, 6.20098164993026, 0.043842349406696395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 265.6363636363636, 135, 971, 142.0, 860.6000000000004, 971.0, 971.0, 0.07543702037485342, 2.03493773445483, 0.04383303429984158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 144.6, 141, 150, 143.0, 150.0, 150.0, 150.0, 0.024371222460518618, 0.006521206009943459, 0.013899212809514526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 142.63636363636363, 139, 145, 142.0, 145.0, 145.0, 145.0, 0.07558007709167865, 0.05616839713551508, 0.037937655883909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 143.6, 142, 145, 144.0, 145.0, 145.0, 145.0, 0.02437157883962039, 0.01811208153999132, 0.012233390159731327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 191.1818181818182, 136, 420, 141.0, 419.4, 420.0, 420.0, 0.0754380550697802, 0.03048597537976203, 0.042447300517779375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 145.8, 144, 152, 144.0, 152.0, 152.0, 152.0, 0.02514470779335073, 0.019791635235781927, 0.008938157848417644], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 967.0714285714284, 141, 2877, 792.5, 2214.5, 2877.0, 2877.0, 0.08398622625889354, 0.015694691695561928, 0.05716054754520259], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1327.8181818181815, 798, 2588, 1210.5, 2180.8, 2529.349999999999, 2588.0, 0.09624512759041573, 0.049814372678633145, 0.04426899911629474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 347.0, 287, 562, 291.0, 562.0, 562.0, 562.0, 0.024354009887728015, 0.03774395868342222, 0.05477273903460705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34c887e6-cc3a-4838-aa63-cb4772d119c9", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.5692262700534759, 1.0636001559714794], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 1270.8166666666668, 698, 3154, 1109.5, 2003.1, 2255.9999999999995, 3154.0, 0.27089748336237957, 82.10049552370127, 0.9845827233436877], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 252.89090909090916, 137, 752, 149.0, 564.2, 582.1999999999999, 752.0, 0.23683723253540717, 0.17600891988227035, 0.11448674814943999], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 817.5272727272728, 662, 1177, 706.0, 1122.2, 1131.1999999999998, 1177.0, 0.2362867748144075, 69.4761572547558, 0.11883563381779283], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 203.99999999999997, 136, 442, 145.0, 422.4, 424.0, 442.0, 0.23729091434660868, 0.4198936882773974, 0.11540124545372181], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1076.9636363636362, 933, 1412, 991.0, 1323.6, 1353.0, 1412.0, 0.2361427160705852, 212.48163101493066, 0.11853257427761797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 190.7727272727273, 143, 547, 146.5, 439.7, 532.2999999999997, 547.0, 0.09865603573142238, 0.0737029954438849, 0.03506913770140405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, 6.857142857142857, 209.71999999999997, 136, 2274, 146.0, 352.20000000000005, 426.4, 1109.680000000014, 0.6977727095112402, 1.505300549396327, 0.33582258555690236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 149.0, 144, 170, 146.0, 170.0, 170.0, 170.0, 0.04532533880690758, 0.03510057975964621, 0.01611174152901793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e65f29a8-8e51-4e8b-8aa6-2de42368a8b0", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 180.0952380952381, 142, 486, 148.0, 380.00000000000017, 480.0999999999999, 486.0, 0.1395951739954133, 0.11328475545916841, 0.04962172200618207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e65f29a8-8e51-4e8b-8aa6-2de42368a8b0", 3, 0, 0.0, 671.3333333333334, 242, 1040, 732.0, 1040.0, 1040.0, 1040.0, 0.01946396247348035, 0.023005744707424204, 0.012481772810142022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0c393ea-ec3c-445e-9f66-12d42c464cbe", 3, 0, 0.0, 1056.0, 363, 1843, 962.0, 1843.0, 1843.0, 1843.0, 0.0200253654629197, 0.023669304035111142, 0.01284178709698952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 406.85714285714283, 283, 849, 286.0, 849.0, 849.0, 849.0, 0.04210374362429025, 0.06525257923022328, 0.09469230621751996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 437.0909090909092, 283, 1123, 289.0, 1011.0000000000005, 1123.0, 1123.0, 0.07536311318169363, 8.30258771666895, 0.167740466137983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/090b3875-61da-4140-b67d-00d850a04423", 3, 0, 0.0, 1127.6666666666665, 245, 2877, 261.0, 2877.0, 2877.0, 2877.0, 0.03196794680533652, 0.03206160289949278, 0.020500278387536763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 146.78571428571428, 141, 152, 146.0, 151.5, 152.0, 152.0, 0.08616869368260377, 0.07144259857083066, 0.03063027783248806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/912d6b88-8959-45db-a6c1-bf49dd02d7d5", 3, 0, 0.0, 454.6666666666667, 287, 698, 379.0, 698.0, 698.0, 698.0, 0.019845076105866867, 0.02735803948839394, 0.012726171851744052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 162.05555555555554, 142, 434, 145.5, 182.0000000000004, 434.0, 434.0, 0.08165931732810713, 0.06339761452719256, 0.029027335456475584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/949044e4-56fb-40af-a49b-192ba07ce096", 3, 0, 0.0, 332.0, 247, 470, 279.0, 470.0, 470.0, 470.0, 0.07349878727001004, 0.03325628720876105, 0.04713301136781243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 156.09090909090907, 136, 418, 143.0, 160.89999999999998, 380.1999999999995, 418.0, 0.09948628898053687, 0.07393463468182476, 0.04993745364843354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 218.68181818181813, 135, 442, 142.5, 429.2, 440.34999999999997, 442.0, 0.09948538921397498, 0.033412040784487514, 0.056357978389060225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 322.4545454545455, 135, 2104, 143.5, 443.7, 1854.9999999999964, 2104.0, 0.09935868485231686, 4.089341134777798, 0.05802391947430224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 258.2727272727272, 134, 1063, 141.0, 438.4, 970.2999999999987, 1063.0, 0.0993591335883551, 1.353512387712888, 0.05812121193303194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4db05b96-ea23-4960-a428-c58e5695aabb", 3, 0, 0.0, 516.6666666666666, 237, 838, 475.0, 838.0, 838.0, 838.0, 0.08785802143735723, 0.03975346673109588, 0.05634124421601359], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 36.0, 0.684931506849315], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.076103500761035], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.076103500761035], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.06544901065449], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 25, "401/Unauthorized", 14, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
