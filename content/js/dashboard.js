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

    var data = {"OkPercent": 96.26168224299066, "KoPercent": 3.7383177570093458};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7814765985497693, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4722222222222222, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7df9a256-1e64-4dd6-9fdc-3e1d554a1a09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed67b99d-6872-4013-9d46-30d69889c8f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b96fa343-d43a-4505-b5ec-42c2dac5f422"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=500af434-d1cc-4ce6-975d-e75cac3ec3d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d48be6f-5f8d-484f-8ab8-7c5bf2681e5b"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fd8dbf4-064d-48a1-9d6e-a7f124b80021"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7d3690c6-5f28-4b51-b482-0971bcafea2c"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6871a451-7828-4231-85c8-df076e8bdbc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29adad3c-5606-499c-8b4e-9c6727dea8f5"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1451101-7140-46c4-8333-4e6e6e197e34"], "isController": false}, {"data": [0.1, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=840540ec-aaf1-4102-982a-076a17726949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4033f22e-025f-4ca0-a442-cb906c9b30c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52bc04e8-b792-46ae-b73f-b7b8f8cb85e5"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/500af434-d1cc-4ce6-975d-e75cac3ec3d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5535634-3dfb-45d2-9403-a3ee6f4b987f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b96fa343-d43a-4505-b5ec-42c2dac5f422"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b003da84-0f22-4ae0-967f-719e2a944d66"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fd8dbf4-064d-48a1-9d6e-a7f124b80021"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7df9a256-1e64-4dd6-9fdc-3e1d554a1a09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/840540ec-aaf1-4102-982a-076a17726949"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e2c8064-820d-4a0b-b4d0-5c602c9eb2bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29adad3c-5606-499c-8b4e-9c6727dea8f5"], "isController": false}, {"data": [0.33962264150943394, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6871a451-7828-4231-85c8-df076e8bdbc7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d3690c6-5f28-4b51-b482-0971bcafea2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8425925925925926, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.89375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b003da84-0f22-4ae0-967f-719e2a944d66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5535634-3dfb-45d2-9403-a3ee6f4b987f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52bc04e8-b792-46ae-b73f-b7b8f8cb85e5"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1451101-7140-46c4-8333-4e6e6e197e34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 48, 3.7383177570093458, 292.8559190031151, 81, 2696, 99.0, 672.5, 852.25, 1640.000000000009, 5.206559291518661, 750.4027154117601, 3.7940299754776734], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1239.666666666667, 989, 1624, 1187.5, 1468.5, 1530.5, 1624.0, 0.24810589527174484, 298.55579450026187, 1.2199347487238628], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7df9a256-1e64-4dd6-9fdc-3e1d554a1a09", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed67b99d-6872-4013-9d46-30d69889c8f0", 2, 0, 0.0, 211.5, 196, 227, 211.5, 227.0, 227.0, 227.0, 0.04943031561256519, 0.0436859722943081, 0.03072499598378686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96fa343-d43a-4505-b5ec-42c2dac5f422", 3, 0, 0.0, 297.0, 194, 473, 224.0, 473.0, 473.0, 473.0, 0.0770574334737491, 0.035769498741395254, 0.04941508591903832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=500af434-d1cc-4ce6-975d-e75cac3ec3d8", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d48be6f-5f8d-484f-8ab8-7c5bf2681e5b", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["deleteBook", 19, 6, 31.57894736842105, 546.6842105263158, 86, 2457, 483.0, 1395.0, 2457.0, 2457.0, 0.09933290114807922, 0.021529957038520252, 0.06601430981931868], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 6, 31.57894736842105, 546.6842105263158, 86, 2457, 483.0, 1395.0, 2457.0, 2457.0, 0.10035918022395943, 0.021752398386330023, 0.06669635075533488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 131.8571428571428, 82, 253, 85.0, 252.8, 253.0, 253.0, 0.10956388357011307, 0.03715308031032665, 0.062047478335046355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 101.52380952380953, 83, 259, 85.0, 219.0000000000001, 258.3, 259.0, 0.10956216870487083, 0.08142266639102216, 0.05499507296318711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fd8dbf4-064d-48a1-9d6e-a7f124b80021", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 139.80952380952377, 84, 414, 85.0, 254.4, 398.0999999999998, 414.0, 0.10956502684343158, 1.5622085602894604, 0.06407088042020796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d3690c6-5f28-4b51-b482-0971bcafea2c", 3, 0, 0.0, 1046.0, 180, 2085, 873.0, 2085.0, 2085.0, 2085.0, 0.021620686673008732, 0.021684028528496064, 0.013864828367782293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 146.85714285714283, 81, 744, 85.0, 255.0, 695.1999999999994, 744.0, 0.10956388357011307, 4.72268537328676, 0.06396321588258926], "isController": false}, {"data": ["goToProfile", 19, 6, 31.57894736842105, 191.8421052631579, 83, 383, 194.0, 316.0, 383.0, 383.0, 0.09909355474658127, 0.1282623863683777, 0.06403187552806434], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 101.5, 83, 368, 86.0, 123.20000000000039, 368.0, 368.0, 0.09904912836767037, 0.0736097526248019, 0.049718019512678284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6871a451-7828-4231-85c8-df076e8bdbc7", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 106.66666666666666, 83, 268, 85.0, 247.30000000000004, 268.0, 268.0, 0.09904967341121573, 0.043033299949924886, 0.05556497521006785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29adad3c-5606-499c-8b4e-9c6727dea8f5", 3, 0, 0.0, 1033.6666666666665, 343, 2375, 383.0, 2375.0, 2375.0, 2375.0, 0.02842874335478124, 0.02851203068882845, 0.018230672008111667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 570.5555555555554, 417, 670, 584.0, 670.0, 670.0, 670.0, 0.051583321392749674, 15.167209216936524, 0.029418612981802553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 623.6666666666665, 566, 768, 581.0, 768.0, 768.0, 768.0, 0.05158420835434912, 46.415561352609586, 0.029368743623618687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 160.33333333333334, 82, 253, 95.0, 253.0, 253.0, 253.0, 0.051680773603757765, 0.0914507439160245, 0.02861620960286197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 119.3, 85, 254, 86.0, 253.7, 254.0, 254.0, 0.05258729490954985, 0.03908098772086664, 0.02639635701514514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 118.99999999999999, 84, 251, 85.5, 250.9, 251.0, 251.0, 0.052587571453362715, 0.01407128376779432, 0.029991349344495922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 135.4, 84, 251, 84.5, 251.0, 251.0, 251.0, 0.052588124549714184, 0.014174142945040151, 0.030916065409109312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 134.8, 84, 251, 86.0, 251.0, 251.0, 251.0, 0.05258729490954985, 0.014173919331089609, 0.03096693245161969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 85.77777777777777, 82, 90, 86.0, 90.0, 90.0, 90.0, 0.05173008391769169, 0.03844393931773767, 0.029047654543625706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 422.7647058823528, 83, 838, 576.0, 771.5999999999999, 838.0, 838.0, 0.0948877812445928, 45.213313706330695, 0.05146659182625489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 164.11111111111111, 82, 770, 84.5, 675.5000000000001, 770.0, 770.0, 0.0990502184607596, 9.926570857362183, 0.05728490282073011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 343.5882352941177, 84, 667, 408.0, 602.1999999999999, 667.0, 667.0, 0.0948883108764331, 14.78278992914076, 0.05155954346163722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 161.27777777777774, 83, 569, 84.5, 461.00000000000017, 569.0, 569.0, 0.0990507635163021, 3.259754608611914, 0.05738194731049663], "isController": false}, {"data": ["deleteBooks", 18, 6, 33.333333333333336, 423.44444444444446, 87, 1230, 445.0, 1062.6000000000004, 1230.0, 1230.0, 0.0994376249875703, 0.021751980466031003, 0.0661946429360616], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 272.90000000000003, 171, 505, 179.5, 504.6, 505.0, 505.0, 0.052562970438585425, 0.08146233797464363, 0.11821535246099828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 488.75999999999993, 120, 1458, 476.0, 1008.0000000000002, 1339.1999999999998, 1458.0, 0.11532695190866106, 0.07084048120170684, 0.052144901107138736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 85.76470588235294, 83, 91, 86.0, 87.8, 91.0, 91.0, 0.09488619238454583, 0.07051600820765563, 0.04762842078677398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 164.23529411764707, 84, 342, 87.0, 338.0, 342.0, 342.0, 0.0948877812445928, 0.10084007083093789, 0.04989675721007597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1451101-7140-46c4-8333-4e6e6e197e34", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["login", 25, 0, 0.0, 2360.16, 1293, 4422, 2248.0, 3669.2000000000016, 4336.2, 4422.0, 0.11536739901891564, 49.841181453017775, 0.24293399917627675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 88.72222222222221, 86, 99, 88.0, 96.30000000000001, 99.0, 99.0, 0.09650543111120642, 0.0781279320226466, 0.034304664965311656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=840540ec-aaf1-4102-982a-076a17726949", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4033f22e-025f-4ca0-a442-cb906c9b30c2", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52bc04e8-b792-46ae-b73f-b7b8f8cb85e5", 3, 0, 0.0, 305.6666666666667, 191, 447, 279.0, 447.0, 447.0, 447.0, 0.03904470618858593, 0.03254996502245071, 0.025038434632654392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 520.764705882353, 172, 924, 667.0, 858.4, 924.0, 924.0, 0.09484066767830046, 60.137504149279216, 0.2004522452830715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/500af434-d1cc-4ce6-975d-e75cac3ec3d8", 3, 0, 0.0, 263.6666666666667, 185, 418, 188.0, 418.0, 418.0, 418.0, 0.03915937867119175, 0.025634606285080276, 0.02511197134838794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5535634-3dfb-45d2-9403-a3ee6f4b987f", 1, 0, 0.0, 1044.0, 1044, 1044, 1044.0, 1044.0, 1044.0, 1044.0, 0.9578544061302682, 0.17304986829501914, 0.6603957136015326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 289.7619047619048, 170, 828, 175.0, 512.2, 796.4999999999995, 828.0, 0.1095124609535928, 6.400449261833865, 0.24496181567749103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 12, 57.142857142857146, 368.1904761904762, 83, 853, 88.0, 820.2, 851.3, 853.0, 0.11218248350650391, 57.535403422901254, 0.1508860663345709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b96fa343-d43a-4505-b5ec-42c2dac5f422", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b003da84-0f22-4ae0-967f-719e2a944d66", 3, 0, 0.0, 362.0, 256, 517, 313.0, 517.0, 517.0, 517.0, 0.028481102788299965, 0.02856454351912506, 0.018264248858382463], "isController": false}, {"data": ["register", 27, 10, 37.03703703703704, 758.0000000000001, 116, 1876, 662.0, 1387.6, 1764.7999999999995, 1876.0, 0.10646225912913872, 0.033130833244614785, 0.048032777068029386], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 297.9444444444445, 169, 866, 173.0, 763.4000000000002, 866.0, 866.0, 0.0990022770523722, 13.296512851045575, 0.21984392359774277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 126.84615384615384, 85, 263, 88.0, 259.4, 263.0, 263.0, 0.11804981702278361, 0.09165000442686813, 0.04196302089481761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 316.61538461538464, 171, 913, 335.0, 717.7999999999998, 913.0, 913.0, 0.08798884572171159, 8.223202743221474, 0.19615722464567567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 85.875, 85, 88, 85.5, 88.0, 88.0, 88.0, 0.04658963846440552, 0.034623744991613865, 0.02338581461982855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 104.875, 83, 245, 84.0, 245.0, 245.0, 245.0, 0.046546808634433, 0.012454907779135393, 0.02654622679932507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fd8dbf4-064d-48a1-9d6e-a7f124b80021", 3, 0, 0.0, 268.6666666666667, 185, 418, 203.0, 418.0, 418.0, 418.0, 0.04553388479927146, 0.029273900546406616, 0.0291997894057828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 126.25, 84, 252, 85.0, 252.0, 252.0, 252.0, 0.04659045245153137, 0.012557582887326814, 0.027390090210763558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7df9a256-1e64-4dd6-9fdc-3e1d554a1a09", 3, 0, 0.0, 342.66666666666663, 178, 664, 186.0, 664.0, 664.0, 664.0, 0.033171163202122954, 0.02765343390645732, 0.0212718722357364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 125.5, 83, 250, 84.5, 250.0, 250.0, 250.0, 0.04654545454545455, 0.012545454545454545, 0.02740909090909091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 115.66666666666667, 87, 252, 88.5, 252.0, 252.0, 252.0, 0.040577279428671904, 0.011967127331502845, 0.0250834158968255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/840540ec-aaf1-4102-982a-076a17726949", 3, 0, 0.0, 373.3333333333333, 287, 461, 372.0, 461.0, 461.0, 461.0, 0.02884338044418806, 0.024045539491395058, 0.01849656883953466], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 784.6481481481483, 647, 1275, 671.5, 1095.5, 1134.25, 1275.0, 0.2390152571405808, 285.9453426881249, 0.4719617675178266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 10, 37.03703703703704, 758.0000000000001, 116, 1876, 662.0, 1387.6, 1764.7999999999995, 1876.0, 0.10997157031256363, 0.03422292357383165, 0.049616079574613677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e2c8064-820d-4a0b-b4d0-5c602c9eb2bb", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 108.0, 83, 250, 84.0, 250.0, 250.0, 250.0, 0.04828818388140422, 0.013015174561784732, 0.028435327031725337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 85.42857142857142, 83, 90, 85.0, 90.0, 90.0, 90.0, 0.04834120604403193, 0.013029465691555482, 0.028419341834479712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 135.61538461538458, 83, 578, 85.0, 447.1999999999999, 578.0, 578.0, 0.1070399341292713, 7.435456013277069, 0.0622201780568135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 149.30769230769232, 81, 586, 85.0, 451.5999999999999, 586.0, 586.0, 0.10703376503618565, 2.4475129315313238, 0.06232111724725623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 116.0, 85, 299, 85.0, 299.0, 299.0, 299.0, 0.04834220758143935, 0.012935317263002328, 0.027570165261289633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 98.07692307692307, 83, 252, 86.0, 185.99999999999994, 252.0, 252.0, 0.10704434105973898, 0.07955150736959117, 0.053731241508501795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 85.57142857142857, 85, 86, 86.0, 86.0, 86.0, 86.0, 0.04834287529610011, 0.03592668759798065, 0.02426585732636275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 143.23076923076925, 83, 342, 85.0, 306.0, 342.0, 342.0, 0.10703905278672057, 0.041008050571835555, 0.060354201488666215], "isController": false}, {"data": ["deleteAccount", 18, 6, 33.333333333333336, 485.5, 84, 2375, 450.0, 1023.2000000000021, 2375.0, 2375.0, 0.09709628175183269, 0.02035481948182951, 0.06605834272829762], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 113.28571428571428, 86, 268, 87.0, 268.0, 268.0, 268.0, 0.04760123763217843, 0.037467380401890446, 0.016920752439563428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1376.92, 844, 2696, 1107.0, 2220.6000000000004, 2570.2999999999997, 2696.0, 0.11835047837263359, 0.06125561868896074, 0.054436596985850016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 225.71428571428572, 170, 385, 173.0, 385.0, 385.0, 385.0, 0.04825955366807079, 0.07479288249143393, 0.1085368672827803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29adad3c-5606-499c-8b4e-9c6727dea8f5", 1, 0, 0.0, 1230.0, 1230, 1230, 1230.0, 1230.0, 1230.0, 1230.0, 0.8130081300813008, 0.14688135162601626, 0.5605309959349594], "isController": false}, {"data": ["addBook", 53, 14, 26.41509433962264, 908.0000000000002, 429, 2785, 737.0, 1417.4, 1725.9999999999986, 2785.0, 0.271350969439737, 86.88189357058198, 0.9839872529042234], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6871a451-7828-4231-85c8-df076e8bdbc7", 3, 0, 0.0, 310.0, 209, 504, 217.0, 504.0, 504.0, 504.0, 0.09775808133472368, 0.04423298602059437, 0.06268991543925964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d3690c6-5f28-4b51-b482-0971bcafea2c", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 142.87037037037035, 83, 357, 86.0, 342.0, 343.25, 357.0, 0.2398156084432858, 0.17822234182162158, 0.11592649040959617], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 477.7777777777778, 403, 703, 418.0, 630.0, 674.25, 703.0, 0.23951670850816573, 70.42586500461292, 0.12046006336104038], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 119.83333333333334, 83, 260, 86.0, 250.0, 253.0, 260.0, 0.24014301850880082, 0.42494057572065136, 0.11678830392322538], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 638.6296296296297, 563, 883, 583.5, 754.5, 789.25, 883.0, 0.23943068703305476, 215.44015306659722, 0.1201829815771388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 99.46153846153848, 85, 253, 86.0, 188.19999999999993, 253.0, 253.0, 0.0890270710778439, 0.06650948181108456, 0.03164634167220232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 14, 8.75, 174.6375000000001, 84, 2433, 89.0, 296.6, 356.34999999999985, 1892.539999999988, 0.6968792874409285, 1.6100914449900912, 0.33093684667566803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 108.25, 85, 254, 87.0, 254.0, 254.0, 254.0, 0.046510546266365894, 0.036018421083230626, 0.016533045743122254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 103.80952380952377, 84, 254, 87.0, 220.80000000000013, 253.7, 254.0, 0.11503067484662577, 0.09335008866947853, 0.040889810199386506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b003da84-0f22-4ae0-967f-719e2a944d66", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5535634-3dfb-45d2-9403-a3ee6f4b987f", 3, 0, 0.0, 342.0, 208, 458, 360.0, 458.0, 458.0, 458.0, 0.028048655066989538, 0.023383009644062567, 0.017986930495432745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 234.25, 169, 338, 175.5, 338.0, 338.0, 338.0, 0.04652190600248892, 0.07209986799409172, 0.10462885695676953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52bc04e8-b792-46ae-b73f-b7b8f8cb85e5", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 261.69230769230774, 168, 671, 172.0, 604.1999999999999, 671.0, 671.0, 0.1069571513196867, 9.995929971862042, 0.23844406398094517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 87.3, 86, 91, 87.0, 90.9, 91.0, 91.0, 0.055092776235180045, 0.04567750685905064, 0.019583760302349155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 88.23529411764706, 86, 95, 88.0, 94.2, 95.0, 95.0, 0.09706021730069826, 0.07535436792388195, 0.034501874118607584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1451101-7140-46c4-8333-4e6e6e197e34", 3, 0, 0.0, 323.0, 200, 453, 316.0, 453.0, 453.0, 453.0, 0.05190850261272797, 0.032290738441706754, 0.03328767908433401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 89.61538461538461, 82, 116, 86.0, 113.2, 116.0, 116.0, 0.08814037371518454, 0.06550275820044478, 0.04424233602500475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 148.84615384615384, 82, 253, 85.0, 253.0, 253.0, 253.0, 0.08814216653445342, 0.03376840815247239, 0.04969915129263877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 180.46153846153845, 83, 828, 85.0, 597.9999999999998, 828.0, 828.0, 0.08804128459006623, 6.115727781850628, 0.05117664213926777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 167.92307692307693, 82, 415, 85.0, 384.2, 415.0, 415.0, 0.08804068834273562, 2.0132032461617646, 0.05126227278730047], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 20.833333333333332, 0.778816199376947], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 12.5, 0.4672897196261682], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 6, 12.5, 0.4672897196261682], "isController": false}, {"data": ["401/Unauthorized", 26, 54.166666666666664, 2.0249221183800623], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 48, "401/Unauthorized", 26, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 12, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
