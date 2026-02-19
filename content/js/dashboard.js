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

    var data = {"OkPercent": 63.63636363636363, "KoPercent": 36.36363636363637};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4839080459770115, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=751d5a1a-fc58-442c-94f4-84b41cd5f0f9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4011512a-16fa-490e-b07e-f22c56abbdfd"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae6a92f8-5caa-41c0-a945-e24675899b24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/213dae4c-be4e-4285-930e-b869fc6f6542"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4011512a-16fa-490e-b07e-f22c56abbdfd"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80df840f-1eda-41d8-b674-3d4e7d985ebd"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/931661e6-e959-48e9-8461-5251d4f36310"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/751d5a1a-fc58-442c-94f4-84b41cd5f0f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8688524590163934, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c60e695-d189-4699-b861-ccf988f24ffd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/948212ff-13a5-4a1c-88f9-3a5286887168"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef3a885e-a4d7-4c5e-9973-d37840fbeaf8"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed676893-940b-4243-89d2-27602e3bd0c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef3a885e-a4d7-4c5e-9973-d37840fbeaf8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6f4c18ad-4590-4d24-89b5-3789702b191d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae6a92f8-5caa-41c0-a945-e24675899b24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80df840f-1eda-41d8-b674-3d4e7d985ebd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bdcdcfe6-b00f-4ab2-bbb7-212b4d46ffde"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c60e695-d189-4699-b861-ccf988f24ffd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed676893-940b-4243-89d2-27602e3bd0c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=213dae4c-be4e-4285-930e-b869fc6f6542"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef6c3118-f94f-4934-8631-a772cbf2a48d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fba48e03-3388-4da6-9b9e-81ec3f7b754a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/680936e4-e8c5-4a5c-b4d1-df11608a775e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f4c18ad-4590-4d24-89b5-3789702b191d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdcdcfe6-b00f-4ab2-bbb7-212b4d46ffde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef6c3118-f94f-4934-8631-a772cbf2a48d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fba48e03-3388-4da6-9b9e-81ec3f7b754a"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 638, 232, 36.36363636363637, 262.9545454545456, 103, 3922, 114.0, 660.7000000000004, 949.05, 1442.9600000000005, 2.5406888532254404, 2.576778183526938, 1.2195004714013213], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 57, 100.0, 632.6491228070175, 427, 1396, 649.0, 779.6, 818.0999999999996, 1396.0, 0.25299825120507063, 1.628736925649584, 0.4247109314663246], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 23, 100.0, 131.91304347826085, 105, 418, 110.0, 231.60000000000028, 396.3999999999997, 418.0, 0.1193936877076412, 0.05934705765936462, 0.059930034650124586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 131.125, 106, 426, 111.5, 210.4000000000002, 426.0, 426.0, 0.09949877492133379, 0.07724758404537144, 0.03536870514781786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=751d5a1a-fc58-442c-94f4-84b41cd5f0f9", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 156.94444444444446, 104, 333, 110.5, 325.8, 333.0, 333.0, 0.08994648184330324, 0.04470972583812632, 0.04514891764400182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 113.5, 111, 118, 112.5, 118.0, 118.0, 118.0, 0.048658840703120244, 0.014350556535490543, 0.03007914664558117], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 196.78947368421055, 103, 1042, 112.0, 443.2, 460.59999999999957, 1042.0, 0.24762690879075525, 0.12308798493602971, 0.11970246079240611], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 404.2352941176471, 109, 1413, 398.0, 809.7999999999995, 1413.0, 1413.0, 0.08633210437043583, 0.018498319697939202, 0.057463815104563415], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 404.2352941176471, 109, 1413, 398.0, 809.7999999999995, 1413.0, 1413.0, 0.08774691724433387, 0.01880147066414093, 0.0584055336690083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4011512a-16fa-490e-b07e-f22c56abbdfd", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 0.21925250303398058, 0.8367149575242719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1011.5833333333335, 200, 3922, 899.5, 1466.5, 3310.5, 3922.0, 0.09924655324991108, 0.031014547890597217, 0.04477725351704973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae6a92f8-5caa-41c0-a945-e24675899b24", 3, 0, 0.0, 409.0, 189, 811, 227.0, 811.0, 811.0, 811.0, 0.08052826542116283, 0.03643694301283084, 0.05164084729156601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/213dae4c-be4e-4285-930e-b869fc6f6542", 3, 0, 0.0, 311.3333333333333, 181, 466, 287.0, 466.0, 466.0, 466.0, 0.02252979565475341, 0.026629455736461468, 0.014447818177039133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4011512a-16fa-490e-b07e-f22c56abbdfd", 3, 0, 0.0, 282.6666666666667, 196, 391, 261.0, 391.0, 391.0, 391.0, 0.03136533294300919, 0.026147987521825043, 0.020113836555250033], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 499.3333333333333, 109, 811, 528.0, 775.0, 811.0, 811.0, 0.08574760478357306, 0.020917726245055224, 0.056908273643472895], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 178.4, 110, 434, 115.0, 434.0, 434.0, 434.0, 0.04387234901331087, 0.034532337211648986, 0.015595249063325349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1091.8695652173915, 691, 1712, 1043.0, 1448.6000000000001, 1662.9999999999993, 1712.0, 0.09844499706805118, 0.05095297699811242, 0.04528085314360557], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 183.41176470588235, 107, 389, 189.0, 284.19999999999993, 389.0, 389.0, 0.08693562161526386, 0.13927777752918735, 0.05403012926559855], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 191.6, 110, 313, 113.0, 313.0, 313.0, 313.0, 0.04479564227991901, 0.022266583906717555, 0.022485312628787474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80df840f-1eda-41d8-b674-3d4e7d985ebd", 3, 0, 0.0, 374.66666666666663, 181, 751, 192.0, 751.0, 751.0, 751.0, 0.02254537256228159, 0.031080616146244317, 0.014457807274640213], "isController": false}, {"data": ["addBook", 63, 63, 100.0, 659.0317460317461, 427, 2205, 634.0, 860.4, 1145.5999999999995, 2205.0, 0.30450228376712823, 0.9663246302472268, 0.5931261932381159], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/931661e6-e959-48e9-8461-5251d4f36310", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/751d5a1a-fc58-442c-94f4-84b41cd5f0f9", 3, 0, 0.0, 353.33333333333337, 190, 676, 194.0, 676.0, 676.0, 676.0, 0.03545931634438088, 0.02956097303318992, 0.02273921002553071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 150.44444444444446, 107, 329, 113.0, 325.4, 329.0, 329.0, 0.08710422019946867, 0.06507297700448586, 0.030962828274029876], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 409.9375, 111, 1274, 389.0, 959.0000000000003, 1274.0, 1274.0, 0.08547419480637423, 0.017883638903579767, 0.05740710691219129], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 22, 12.021857923497267, 170.9836065573771, 105, 1650, 114.0, 313.0, 335.1999999999998, 1019.1599999999975, 0.764561129377948, 1.6039741119810489, 0.3674782904329588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 132.7, 106, 330, 111.0, 308.5000000000001, 330.0, 330.0, 0.048228564814368255, 0.03734887880643948, 0.017143747648857465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 20, 100.0, 153.14999999999998, 105, 335, 111.0, 325.7, 334.55, 335.0, 0.09542622121706604, 0.047433541601061134, 0.04789948994684759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 125.92857142857143, 108, 327, 111.0, 220.0, 327.0, 327.0, 0.12697376177908382, 0.1030421836312682, 0.04513520438240869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c60e695-d189-4699-b861-ccf988f24ffd", 3, 0, 0.0, 265.6666666666667, 183, 413, 201.0, 413.0, 413.0, 413.0, 0.04185443029144635, 0.034892316398565784, 0.026840243383512142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/948212ff-13a5-4a1c-88f9-3a5286887168", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 499.6521739130433, 113, 854, 478.0, 798.2, 847.3999999999999, 854.0, 0.10149685801030854, 0.06234523797703523, 0.04589164576052037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef3a885e-a4d7-4c5e-9973-d37840fbeaf8", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["login", 23, 8, 34.78260869565217, 1820.3478260869567, 1225, 2789, 1913.0, 2249.0, 2692.9999999999986, 2789.0, 0.10095999789300873, 0.15275172235561624, 0.15109277537936816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed676893-940b-4243-89d2-27602e3bd0c7", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef3a885e-a4d7-4c5e-9973-d37840fbeaf8", 3, 0, 0.0, 320.3333333333333, 191, 570, 200.0, 570.0, 570.0, 570.0, 0.04259488009541253, 0.026497010371853303, 0.02731507610285244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 129.2, 105, 319, 107.5, 298.6000000000001, 319.0, 319.0, 0.047980270512765155, 0.023849568057614706, 0.024083846722227818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 149.7826086956522, 107, 342, 113.0, 318.40000000000003, 337.99999999999994, 342.0, 0.12578478769715398, 0.10183162988373111, 0.0447125612517227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f4c18ad-4590-4d24-89b5-3789702b191d", 3, 0, 0.0, 590.6666666666666, 217, 941, 614.0, 941.0, 941.0, 941.0, 0.017275334277718275, 0.02381544292517477, 0.01107825798408366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 122.75, 106, 311, 110.0, 175.90000000000015, 311.0, 311.0, 0.09562572092828668, 0.047532706984861256, 0.047999629450331406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae6a92f8-5caa-41c0-a945-e24675899b24", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80df840f-1eda-41d8-b674-3d4e7d985ebd", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdcdcfe6-b00f-4ab2-bbb7-212b4d46ffde", 3, 0, 0.0, 425.33333333333337, 185, 715, 376.0, 715.0, 715.0, 715.0, 0.029696501752093603, 0.029609500282116764, 0.019043655094929817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c60e695-d189-4699-b861-ccf988f24ffd", 1, 0, 0.0, 1274.0, 1274, 1274, 1274.0, 1274.0, 1274.0, 1274.0, 0.7849293563579278, 0.14180852629513344, 0.541171997645212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed676893-940b-4243-89d2-27602e3bd0c7", 3, 0, 0.0, 324.3333333333333, 196, 452, 325.0, 452.0, 452.0, 452.0, 0.08385744234800838, 0.03794330887491265, 0.05377576869322152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=213dae4c-be4e-4285-930e-b869fc6f6542", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 187.25, 106, 338, 116.0, 337.7, 338.0, 338.0, 0.10104122987385003, 0.08377344156533073, 0.03591699968172013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef6c3118-f94f-4934-8631-a772cbf2a48d", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, 100.0, 123.0, 105, 316, 108.0, 214.0, 316.0, 316.0, 0.10723203480445472, 0.05330186105026119, 0.053825454970204814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fba48e03-3388-4da6-9b9e-81ec3f7b754a", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/680936e4-e8c5-4a5c-b4d1-df11608a775e", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f4c18ad-4590-4d24-89b5-3789702b191d", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdcdcfe6-b00f-4ab2-bbb7-212b4d46ffde", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 131.2142857142857, 106, 326, 115.5, 227.5, 326.0, 326.0, 0.1070794835709478, 0.0831329974989292, 0.03806341017561035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef6c3118-f94f-4934-8631-a772cbf2a48d", 3, 0, 0.0, 380.3333333333333, 190, 562, 389.0, 562.0, 562.0, 562.0, 0.05552265324252295, 0.035695716195957954, 0.03560534729419603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 171.42857142857142, 105, 338, 109.5, 337.5, 338.0, 338.0, 0.14301475095002655, 0.07108838694683937, 0.07178670116046255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 16, 100.0, 120.75, 104, 314, 107.0, 176.80000000000013, 314.0, 314.0, 0.09934247698048541, 0.04938019607721394, 0.056419784442347215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fba48e03-3388-4da6-9b9e-81ec3f7b754a", 3, 0, 0.0, 381.3333333333333, 258, 528, 358.0, 528.0, 528.0, 528.0, 0.04535490210900295, 0.029158831922291937, 0.029085012094640563], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1011.5833333333335, 200, 3922, 899.5, 1466.5, 3310.5, 3922.0, 0.10154431986460757, 0.031732599957689865, 0.04581394118891475], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.4482758620689653, 1.2539184952978057], "isController": false}, {"data": ["401/Unauthorized", 31, 13.362068965517242, 4.858934169278997], "isController": false}, {"data": ["404/Not Found", 193, 83.1896551724138, 30.25078369905956], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 638, 232, "404/Not Found", 193, "401/Unauthorized", 31, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 22, "401/Unauthorized", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
