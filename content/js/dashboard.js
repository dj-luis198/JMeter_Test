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

    var data = {"OkPercent": 97.63138415988156, "KoPercent": 2.368615840118431};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7562141491395793, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017241379310344827, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0abe3a2b-c735-4e72-9cc1-f559ec678e0a"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02d4d595-a6e4-42d9-9e8e-8ef7d03cd372"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8007c0b-c636-4ac3-a4d4-c75638e6e8ac"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ac137de8-c155-42d7-8b5b-8d242d66e214"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8741319-8023-4886-8e6c-f6411cb2d095"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b9d2d6e-9e5a-403a-a072-57650b7f5745"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9e5a94e-a4be-453d-933d-2c6320ec24ea"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87d328a2-7db7-4a10-a062-e0481fe1ba37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05c8a157-5f83-4c05-812f-302c342aef0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=753427fb-b884-4e37-bf17-10e754b379f6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3952d12a-6bbe-423f-a16b-b394295caf36"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8007c0b-c636-4ac3-a4d4-c75638e6e8ac"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d66cb479-f4a1-4934-b8fe-4c99284dcb2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/002f5658-6eef-429e-a2cb-31c7111d532c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac137de8-c155-42d7-8b5b-8d242d66e214"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3620689655172414, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87d328a2-7db7-4a10-a062-e0481fe1ba37"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02d4d595-a6e4-42d9-9e8e-8ef7d03cd372"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4e7f5505-a1b3-4eaf-92d7-650cda812270"], "isController": false}, {"data": [0.25396825396825395, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0abe3a2b-c735-4e72-9cc1-f559ec678e0a"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8741319-8023-4886-8e6c-f6411cb2d095"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9021739130434783, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/adcf4b64-e613-43c4-bf67-adfe705f86d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/753427fb-b884-4e37-bf17-10e754b379f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3952d12a-6bbe-423f-a16b-b394295caf36"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9e5a94e-a4be-453d-933d-2c6320ec24ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b9d2d6e-9e5a-403a-a072-57650b7f5745"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d66cb479-f4a1-4934-b8fe-4c99284dcb2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 32, 2.368615840118431, 400.02220577350107, 103, 3622, 128.0, 1131.8, 1409.0, 2062.7600000000007, 5.356180024739129, 733.9043039369509, 3.9212760040855246], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1902.6724137931035, 1376, 2659, 1903.5, 2292.4, 2523.35, 2659.0, 0.2571697142755795, 309.4609616789413, 1.2645014759546316], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0abe3a2b-c735-4e72-9cc1-f559ec678e0a", 3, 0, 0.0, 1752.6666666666665, 400, 3622, 1236.0, 3622.0, 3622.0, 3622.0, 0.027132378876538632, 0.02721186826777849, 0.017399344526946973], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 639.6, 117, 2082, 595.0, 1318.2000000000005, 2082.0, 2082.0, 0.07559455114475348, 0.015384672322818971, 0.05065720800344711], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 639.6, 117, 2082, 595.0, 1318.2000000000005, 2082.0, 2082.0, 0.07534470201170354, 0.015333824120350604, 0.05048977980510837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02d4d595-a6e4-42d9-9e8e-8ef7d03cd372", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 167.23529411764707, 106, 350, 116.0, 347.6, 350.0, 350.0, 0.15277191153607664, 0.06787327457605795, 0.08561826567934075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 129.2352941176471, 108, 355, 116.0, 166.99999999999983, 355.0, 355.0, 0.15244449227016751, 0.11329126818124753, 0.07651998928404892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8007c0b-c636-4ac3-a4d4-c75638e6e8ac", 2, 0, 0.0, 256.5, 244, 269, 256.5, 269.0, 269.0, 269.0, 0.023045988269591974, 0.032847285038544415, 0.014324972200776649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 238.88235294117646, 110, 915, 115.0, 883.0, 915.0, 915.0, 0.15278014936506368, 5.321326985467912, 0.08842256461701611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 260.11764705882354, 109, 1265, 115.0, 1065.7999999999997, 1265.0, 1265.0, 0.15278152242293522, 16.20963857621102, 0.08827415857823313], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 227.06666666666666, 114, 400, 226.0, 363.40000000000003, 400.0, 400.0, 0.07669456644561588, 0.13955814662467214, 0.04956685944698105], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 115.60000000000001, 107, 120, 116.0, 118.8, 120.0, 120.0, 0.10968359937699716, 0.08151290930263168, 0.05505602546853177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 746.25, 651, 861, 736.5, 861.0, 861.0, 861.0, 0.026435269937150147, 7.772847095094275, 0.015076364886030943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 129.4, 106, 337, 116.0, 205.60000000000008, 337.0, 337.0, 0.10968680760202701, 0.04033275321199535, 0.06194162559505094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1294.5, 920, 1481, 1388.5, 1481.0, 1481.0, 1481.0, 0.026424966308167958, 23.777231134225612, 0.015044682966466716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 284.0, 118, 348, 335.0, 348.0, 348.0, 348.0, 0.026565716942285978, 0.04700886630802949, 0.014709728033472804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 131.3846153846154, 110, 326, 116.0, 242.79999999999993, 326.0, 326.0, 0.06193366428142657, 0.046026873552896114, 0.03108779632876295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 147.99999999999997, 105, 346, 114.0, 343.2, 346.0, 346.0, 0.061934549473794544, 0.016572330620917678, 0.03532204774677345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 166.38461538461536, 105, 347, 116.0, 346.2, 347.0, 347.0, 0.06193543469146625, 0.016693535131684263, 0.03641126141041278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 131.23076923076923, 108, 345, 115.0, 253.39999999999992, 345.0, 345.0, 0.061933959342737765, 0.016693137479097286, 0.036470876448897335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 114.5, 110, 117, 115.5, 117.0, 117.0, 117.0, 0.026565540509128585, 0.019742555007272317, 0.014917173625731382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 725.9444444444445, 109, 1481, 619.5, 1481.0, 1481.0, 1481.0, 0.11320185147917086, 50.94486819255949, 0.061686165161501307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 230.66666666666663, 107, 1385, 116.0, 762.8000000000004, 1385.0, 1385.0, 0.1096916202914872, 6.607641815268342, 0.06385823363583844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 477.44444444444446, 110, 1033, 375.0, 1026.7, 1033.0, 1033.0, 0.11320042764605999, 16.6575976943274, 0.061795936576315956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 170.13333333333333, 105, 929, 114.0, 461.60000000000025, 929.0, 929.0, 0.10968600552817467, 2.177681388661392, 0.06396208017681385], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 500.92857142857144, 117, 1327, 521.0, 1114.5, 1327.0, 1327.0, 0.07153441316233201, 0.014675133168974503, 0.04822684871749016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ac137de8-c155-42d7-8b5b-8d242d66e214", 3, 0, 0.0, 870.3333333333334, 239, 2120, 252.0, 2120.0, 2120.0, 2120.0, 0.03290808771102311, 0.027241297867555917, 0.02110316822614438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 318.69230769230774, 227, 672, 234.0, 587.9999999999999, 672.0, 672.0, 0.061899161504435314, 0.0959316106518934, 0.1392126649850728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8741319-8023-4886-8e6c-f6411cb2d095", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b9d2d6e-9e5a-403a-a072-57650b7f5745", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9e5a94e-a4be-453d-933d-2c6320ec24ea", 3, 0, 0.0, 485.0, 226, 878, 351.0, 878.0, 878.0, 878.0, 0.04116129740409418, 0.03431448002991054, 0.026395753869161955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 506.10526315789474, 116, 1362, 388.0, 1005.0, 1362.0, 1362.0, 0.11327729088415907, 0.06958146090442974, 0.05121815007750552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 115.94444444444444, 107, 124, 116.0, 119.5, 124.0, 124.0, 0.11319544451222197, 0.08412278640019621, 0.056818807108673916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 197.44444444444446, 107, 433, 117.0, 390.70000000000005, 433.0, 433.0, 0.11319615636162399, 0.11529647566911506, 0.05980382870277205], "isController": false}, {"data": ["login", 19, 0, 0.0, 3036.3157894736846, 1753, 4320, 3037.0, 4102.0, 4320.0, 4320.0, 0.10811856623400272, 27.38066013142096, 0.2008718037448857], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87d328a2-7db7-4a10-a062-e0481fe1ba37", 3, 0, 0.0, 380.0, 265, 548, 327.0, 548.0, 548.0, 548.0, 0.0929022668153103, 0.042035856404062925, 0.05957599792518271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 139.99999999999997, 112, 396, 119.0, 245.4000000000001, 396.0, 396.0, 0.10598759238585137, 0.0858044082889363, 0.0376752769809081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05c8a157-5f83-4c05-812f-302c342aef0f", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=753427fb-b884-4e37-bf17-10e754b379f6", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3952d12a-6bbe-423f-a16b-b394295caf36", 3, 0, 0.0, 597.0, 219, 1142, 430.0, 1142.0, 1142.0, 1142.0, 0.026769700268589325, 0.02684812712484496, 0.01716676742484407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 844.6666666666667, 229, 1595, 749.5, 1593.2, 1595.0, 1595.0, 0.11311221989015546, 67.74842050371072, 0.23992162265763448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8007c0b-c636-4ac3-a4d4-c75638e6e8ac", 1, 0, 0.0, 1327.0, 1327, 1327, 1327.0, 1327.0, 1327.0, 1327.0, 0.7535795026375283, 0.13614473436322533, 0.5195577430293896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 633.0999999999999, 114, 1599, 116.0, 1598.9, 1599.0, 1599.0, 0.043028519302593764, 20.597735382136282, 0.05591606507418117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 452.05882352941177, 226, 1383, 239.0, 1186.1999999999998, 1383.0, 1383.0, 0.15228471867637705, 21.641829770878683, 0.33790796348302027], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1223.238095238095, 198, 2179, 1264.0, 1956.8, 2156.7999999999997, 2179.0, 0.08688097306689835, 0.02744120019858508, 0.039198251520417025], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d66cb479-f4a1-4934-b8fe-4c99284dcb2c", 3, 0, 0.0, 327.6666666666667, 218, 529, 236.0, 529.0, 529.0, 529.0, 0.034138237101436084, 0.028459643625253193, 0.02189203355788707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 162.33333333333331, 111, 357, 119.0, 352.2, 356.7, 357.0, 0.11393043733012158, 0.0884518532006315, 0.040498710144691655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 363.80000000000007, 223, 1503, 234.0, 881.4000000000003, 1503.0, 1503.0, 0.10959144310012274, 8.8991533832705, 0.24460439087249397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/002f5658-6eef-429e-a2cb-31c7111d532c", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.5935612221189591, 1.1090700511152416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac137de8-c155-42d7-8b5b-8d242d66e214", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 366.8235294117647, 226, 688, 452.0, 513.5999999999998, 688.0, 688.0, 0.09776407802723593, 0.15151522639572598, 0.21987370282883234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 139.1, 113, 324, 118.0, 304.50000000000006, 324.0, 324.0, 0.05193968763471857, 0.03859970926759846, 0.026071288519770842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 204.1, 110, 347, 115.5, 346.4, 347.0, 347.0, 0.05188040528972612, 0.013882061571664998, 0.02958804364179693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 159.4, 109, 347, 115.0, 344.8, 347.0, 347.0, 0.051937259790173475, 0.013998714552820193, 0.030533428118832452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 181.79999999999998, 108, 346, 115.0, 345.8, 346.0, 346.0, 0.0519367202999865, 0.013998569143355736, 0.030583830411027205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 127.66666666666667, 117, 145, 121.0, 145.0, 145.0, 145.0, 0.0237676474782526, 0.00700959915862528, 0.01469230552122451], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1315.8620689655181, 863, 2172, 1255.0, 1720.0, 2049.7999999999997, 2172.0, 0.25655997310543727, 306.9349225122529, 0.5066057281437444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1223.238095238095, 198, 2179, 1264.0, 1956.8, 2156.7999999999997, 2179.0, 0.08500062738558307, 0.026847296372901803, 0.03834989243372987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 178.20000000000002, 109, 338, 115.0, 336.8, 338.0, 338.0, 0.045625641610585146, 0.012297536215353028, 0.026867443253108244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 159.79999999999998, 107, 344, 116.0, 343.9, 344.0, 344.0, 0.045625641610585146, 0.012297536215353028, 0.026822886962472908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 293.85714285714283, 103, 1233, 115.0, 1063.6000000000001, 1216.8999999999999, 1233.0, 0.11005597132255833, 14.172362513560467, 0.06334974018929626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 254.90476190476187, 108, 915, 115.0, 889.2, 914.5, 915.0, 0.1100565481025727, 4.648323062480674, 0.06345754928961118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 177.5, 109, 341, 116.0, 339.6, 341.0, 341.0, 0.045625641610585146, 0.012208423634082354, 0.026020873731036842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 144.38095238095238, 106, 347, 116.0, 328.0, 345.5, 347.0, 0.11005135730007337, 0.08178621377476156, 0.05524062270726339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 136.8, 112, 321, 117.0, 300.80000000000007, 321.0, 321.0, 0.04562480894611254, 0.03390671836717934, 0.022901515428029144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 155.66666666666666, 105, 352, 115.0, 344.4, 351.3, 352.0, 0.11005770168073832, 0.05306353473892741, 0.0614468362341399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 117.0, 111, 119, 117.5, 119.0, 119.0, 119.0, 0.0454433911676225, 0.03576891921982786, 0.01615370545411581], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 915.5384615384617, 115, 3622, 529.0, 3021.1999999999994, 3622.0, 3622.0, 0.06848124404081482, 0.013745634320692398, 0.04659728880120948], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1903.5789473684213, 1157, 3178, 1723.0, 3070.0, 3178.0, 3178.0, 0.11092493884532977, 0.05741232186330544, 0.051021138863428045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 341.3, 227, 659, 236.5, 639.0, 659.0, 659.0, 0.04560046694878156, 0.07067181742941048, 0.10255651892875384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87d328a2-7db7-4a10-a062-e0481fe1ba37", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02d4d595-a6e4-42d9-9e8e-8ef7d03cd372", 3, 0, 0.0, 527.3333333333334, 260, 868, 454.0, 868.0, 868.0, 868.0, 0.06480741396815796, 0.041664922717158846, 0.04155944190015338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e7f5505-a1b3-4eaf-92d7-650cda812270", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.5774610081374322, 1.0789867766726944], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 1176.9365079365075, 575, 3024, 931.0, 2081.0, 2483.5999999999995, 3024.0, 0.30415093610899224, 87.78667187515087, 1.106724315539699], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0abe3a2b-c735-4e72-9cc1-f559ec678e0a", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 208.41379310344823, 110, 721, 118.0, 461.2, 468.14999999999986, 721.0, 0.2576655501159495, 0.19148777699046637, 0.12455512432362792], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 737.2758620689655, 529, 1127, 685.0, 918.1, 1028.3499999999997, 1127.0, 0.2575431273728381, 75.72623068426545, 0.12952608456739415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8741319-8023-4886-8e6c-f6411cb2d095", 3, 0, 0.0, 639.0, 280, 1298, 339.0, 1298.0, 1298.0, 1298.0, 0.04365223717715533, 0.02806418242997454, 0.02799313386686068], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 189.8620689655172, 109, 437, 118.5, 348.0, 379.99999999999983, 437.0, 0.25815066206743076, 0.45680566373650827, 0.1255459274507622], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1102.6206896551723, 743, 1696, 1098.5, 1364.1000000000001, 1606.3, 1696.0, 0.25741625095421544, 231.62359509810665, 0.12921089159225266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 122.0, 112, 140, 121.0, 130.39999999999998, 140.0, 140.0, 0.09771912075784052, 0.07300305408178516, 0.03473609370688863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 15, 8.152173913043478, 196.68478260869563, 107, 2226, 123.0, 346.0, 437.75, 1138.0000000000073, 0.7444269126512117, 1.5535233847149736, 0.3584285044200348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 116.7, 113, 121, 116.5, 120.9, 121.0, 121.0, 0.05365814396480026, 0.04155362125399082, 0.01907379336248759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adcf4b64-e613-43c4-bf67-adfe705f86d8", 2, 0, 0.0, 213.0, 204, 222, 213.0, 222.0, 222.0, 222.0, 0.01372655333109133, 0.023458465165439285, 0.008532178901601203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/753427fb-b884-4e37-bf17-10e754b379f6", 3, 0, 0.0, 313.6666666666667, 218, 462, 261.0, 462.0, 462.0, 462.0, 0.02600194147829705, 0.026078119041221745, 0.016674422106850644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 137.05882352941177, 116, 350, 120.0, 198.79999999999987, 350.0, 350.0, 0.14021659339662326, 0.1137890518677675, 0.049842617183955926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 389.5, 228, 671, 448.0, 651.0, 671.0, 671.0, 0.05184758882788156, 0.08035363620102348, 0.11660644245176878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3952d12a-6bbe-423f-a16b-b394295caf36", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.2002927522172949, 0.7643604490022172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 453.19047619047615, 223, 1378, 233.0, 1315.2, 1375.0, 1378.0, 0.10998680158380995, 18.943600093881592, 0.2433427296760103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9e5a94e-a4be-453d-933d-2c6320ec24ea", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 120.23076923076923, 115, 137, 119.0, 132.6, 137.0, 137.0, 0.06514821218271567, 0.05401448451477111, 0.023158153549324715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 146.05555555555557, 112, 353, 121.0, 337.70000000000005, 353.0, 353.0, 0.11246977374830515, 0.087317841923733, 0.039979489887092844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b9d2d6e-9e5a-403a-a072-57650b7f5745", 3, 0, 0.0, 313.6666666666667, 211, 503, 227.0, 503.0, 503.0, 503.0, 0.018060321473722232, 0.0248976111462284, 0.011581651465896093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d66cb479-f4a1-4934-b8fe-4c99284dcb2c", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 129.35294117647058, 107, 350, 115.0, 171.59999999999985, 350.0, 350.0, 0.09783102854939603, 0.07270450461532264, 0.049106590502333555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 195.29411764705878, 108, 349, 115.0, 348.2, 349.0, 349.0, 0.09783102854939603, 0.02617744318606886, 0.055794258469577425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 177.88235294117646, 107, 349, 115.0, 345.0, 349.0, 349.0, 0.09782877662237517, 0.026367912448999557, 0.05751262063151353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 195.05882352941177, 110, 347, 117.0, 345.4, 347.0, 347.0, 0.09783159154735048, 0.026368671159246813, 0.057609814163137055], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 15.625, 0.3700962250185048], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.22205773501110287], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.22205773501110287], "isController": false}, {"data": ["401/Unauthorized", 21, 65.625, 1.5544041450777202], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 32, "401/Unauthorized", 21, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
