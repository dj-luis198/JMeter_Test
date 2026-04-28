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

    var data = {"OkPercent": 99.39347990902199, "KoPercent": 0.6065200909780136};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8382161458333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bbc0211-be5b-4a09-b815-bdd864969425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f876082-6e7b-4358-ad75-95fdae5a52b4"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37cd1dd3-8550-487b-8534-cebb4c39e997"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ff7b2fe-012f-4be3-bf39-fb8f239ef806"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af858c11-9719-4e35-a8b4-48dd39029cbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a53f7baf-e0a1-46f8-8f31-bffd5d065a24"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0288900-22ce-4aab-846f-a853801760e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9a2a6808-08cd-4e41-807b-4e9c11ee8998"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=caceb9ce-8b6f-47eb-90c1-8f2c1b9d2222"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/daa72583-a13c-446d-a5b2-041d3442b6ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23cbf5a2-784d-4a33-8fa9-f098bce8093d"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15fc8964-7cd6-45d8-b6ee-cf123d3e9472"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f876082-6e7b-4358-ad75-95fdae5a52b4"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cf64545-b70b-40cb-a1f7-f9d237bfe762"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/37cd1dd3-8550-487b-8534-cebb4c39e997"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bbc0211-be5b-4a09-b815-bdd864969425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c63fb64-caed-49fc-8a06-4dc9d92558ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df2b4ba2-1b48-42aa-b802-4a077c640ef7"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0288900-22ce-4aab-846f-a853801760e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92eaa9a5-85d9-414a-ab72-6ab57ac3e095"], "isController": false}, {"data": [0.4435483870967742, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af858c11-9719-4e35-a8b4-48dd39029cbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ff7b2fe-012f-4be3-bf39-fb8f239ef806"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92eaa9a5-85d9-414a-ab72-6ab57ac3e095"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daa72583-a13c-446d-a5b2-041d3442b6ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40e4ace9-5025-4f01-8b2b-7a84b52fff38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c63fb64-caed-49fc-8a06-4dc9d92558ef"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23cbf5a2-784d-4a33-8fa9-f098bce8093d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a53f7baf-e0a1-46f8-8f31-bffd5d065a24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/caceb9ce-8b6f-47eb-90c1-8f2c1b9d2222"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a2a6808-08cd-4e41-807b-4e9c11ee8998"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0cf64545-b70b-40cb-a1f7-f9d237bfe762"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1319, 8, 0.6065200909780136, 295.4670204700532, 77, 3140, 95.0, 793.0, 1014.0, 1561.7999999999981, 5.33340881245729, 729.0826661307312, 3.8937521923484386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/5bbc0211-be5b-4a09-b815-bdd864969425", 3, 0, 0.0, 279.0, 179, 383, 275.0, 383.0, 383.0, 383.0, 0.04998000799680128, 0.0324577200369852, 0.03205098169065707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f876082-6e7b-4358-ad75-95fdae5a52b4", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 1.1507265127388535, 4.391421178343949], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1329.9821428571424, 957, 1872, 1287.0, 1667.1000000000001, 1748.65, 1872.0, 0.24485584112353853, 294.6437690815392, 1.2039542578681801], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 524.8571428571429, 383, 1209, 435.5, 984.0, 1209.0, 1209.0, 0.08491796318199739, 0.015341624207685076, 0.05771767810026385], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 524.8571428571429, 383, 1209, 435.5, 984.0, 1209.0, 1209.0, 0.08333333333333333, 0.015055338541666666, 0.056640625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 95.35, 77, 237, 80.0, 220.60000000000034, 236.95, 237.0, 0.13363892099935185, 0.055830791409690154, 0.07509358900686236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 88.95000000000002, 79, 240, 81.0, 84.80000000000001, 232.2499999999999, 240.0, 0.13363624214887077, 0.09931365261258854, 0.0670791293598824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 149.45, 78, 626, 80.0, 580.8000000000009, 625.65, 626.0, 0.13363802803725827, 3.9618194065803367, 0.07754659790990125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 192.85000000000002, 78, 1220, 80.0, 827.3000000000014, 1203.6499999999996, 1220.0, 0.13363802803725827, 12.057190916122092, 0.07741609202314612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37cd1dd3-8550-487b-8534-cebb4c39e997", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 205.14285714285714, 165, 301, 191.5, 288.0, 301.0, 301.0, 0.08510483091493772, 0.2117053906311739, 0.055018943423524196], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 91.20000000000002, 78, 244, 80.0, 147.40000000000006, 244.0, 244.0, 0.08316146630297386, 0.0618026131411749, 0.04174315789035992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 111.86666666666666, 79, 240, 81.0, 238.8, 240.0, 240.0, 0.0831619273608285, 0.030579333706637984, 0.04696266653175954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 592.3333333333334, 538, 620, 619.0, 620.0, 620.0, 620.0, 0.08538737405362327, 25.106723099419366, 0.04869748676495702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 828.6666666666666, 700, 938, 848.0, 938.0, 938.0, 938.0, 0.08483683049601268, 76.3363292075533, 0.04830065642497596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 185.0, 78, 240, 237.0, 240.0, 240.0, 240.0, 0.08672525439407955, 0.1534630478145236, 0.048020721915471784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ff7b2fe-012f-4be3-bf39-fb8f239ef806", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 83.75000000000001, 80, 92, 80.5, 91.4, 92.0, 92.0, 0.06607820355390605, 0.04910694619582275, 0.03316816076826924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 119.41666666666667, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.06607856741665841, 0.01768117917203555, 0.037685432979813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 79.91666666666667, 77, 87, 79.5, 85.2, 87.0, 87.0, 0.06607929515418502, 0.017810435022026432, 0.038847398127753306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 112.49999999999999, 78, 315, 80.0, 291.6000000000001, 315.0, 315.0, 0.06607893128341805, 0.017810336947483768, 0.03891171441787215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af858c11-9719-4e35-a8b4-48dd39029cbc", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 184.33333333333334, 84, 236, 233.0, 236.0, 236.0, 236.0, 0.08671272075613493, 0.0644417778275573, 0.04869122503396248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 509.31578947368416, 77, 1085, 652.0, 1020.0, 1085.0, 1085.0, 0.08692708190361159, 41.178014582589874, 0.04717188171969219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 150.60000000000002, 77, 536, 79.0, 356.0000000000001, 536.0, 536.0, 0.08309052435660237, 5.005235784942335, 0.04837210083312099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 380.3157894736842, 78, 719, 468.0, 702.0, 719.0, 719.0, 0.08686548194340941, 13.453898717133987, 0.047223283435209776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 163.66666666666666, 78, 714, 80.0, 427.20000000000016, 714.0, 714.0, 0.0830900640901361, 1.649651523733292, 0.04845297552443679], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 496.0714285714286, 157, 1175, 428.0, 1008.0, 1175.0, 1175.0, 0.08294919954022444, 0.01498593937006008, 0.057189584839256305], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 211.00000000000003, 159, 396, 170.0, 373.80000000000007, 396.0, 396.0, 0.06604874397305212, 0.10236265301292354, 0.14854517321283106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a53f7baf-e0a1-46f8-8f31-bffd5d065a24", 3, 0, 0.0, 269.3333333333333, 159, 484, 165.0, 484.0, 484.0, 484.0, 0.04456658991309515, 0.02865202313748793, 0.02857948637005125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 542.75, 112, 1449, 476.5, 841.0000000000001, 1418.8499999999995, 1449.0, 0.09560275144718665, 0.058724736972930076, 0.043226634687546305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 89.73684210526315, 79, 234, 82.0, 85.0, 234.0, 234.0, 0.08692549112902488, 0.06459990112225383, 0.04363252191437381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 130.42105263157893, 78, 242, 80.0, 239.0, 242.0, 242.0, 0.08692509344447545, 0.09197368285608407, 0.04573217806834142], "isController": false}, {"data": ["login", 20, 0, 0.0, 2542.2999999999997, 1960, 4022, 2332.5, 3190.2000000000003, 3980.5999999999995, 4022.0, 0.09488026111047858, 17.159609465432748, 0.1667539120317659], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0288900-22ce-4aab-846f-a853801760e5", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.5161830357142857, 1.9698660714285716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 94.39999999999999, 81, 240, 82.0, 150.60000000000005, 240.0, 240.0, 0.0786971941827034, 0.06371091208736437, 0.02797439324463285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a2a6808-08cd-4e41-807b-4e9c11ee8998", 3, 0, 0.0, 504.3333333333333, 194, 1049, 270.0, 1049.0, 1049.0, 1049.0, 0.020630892698727074, 0.024385016728215494, 0.013230097205889432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=caceb9ce-8b6f-47eb-90c1-8f2c1b9d2222", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daa72583-a13c-446d-a5b2-041d3442b6ba", 3, 0, 0.0, 423.66666666666663, 172, 910, 189.0, 910.0, 910.0, 910.0, 0.018130612935587976, 0.02499451360098147, 0.01162672769632432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23cbf5a2-784d-4a33-8fa9-f098bce8093d", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 608.7368421052631, 160, 1165, 734.0, 1106.0, 1165.0, 1165.0, 0.08683173837140219, 54.737927210724635, 0.18359360718464085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15fc8964-7cd6-45d8-b6ee-cf123d3e9472", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f876082-6e7b-4358-ad75-95fdae5a52b4", 3, 0, 0.0, 495.0, 173, 1034, 278.0, 1034.0, 1034.0, 1034.0, 0.07150007150007151, 0.03318981183564517, 0.0458512828304495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 299.05, 159, 1303, 163.0, 924.2000000000011, 1286.5499999999997, 1303.0, 0.13356484573260316, 16.165298496560705, 0.29697308668358485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1013.6666666666666, 784, 1172, 1085.0, 1172.0, 1172.0, 1172.0, 0.08463578400947921, 101.25382183462169, 0.190843774685437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cf64545-b70b-40cb-a1f7-f9d237bfe762", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1087.7826086956525, 104, 1868, 1037.0, 1755.8, 1848.1999999999998, 1868.0, 0.09043511084199021, 0.028767826529729562, 0.04080177852441355], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 94.83333333333333, 80, 280, 83.0, 110.80000000000027, 280.0, 280.0, 0.08674991445494548, 0.06734978710125161, 0.030836883653906397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 307.86666666666673, 161, 793, 316.0, 604.6000000000001, 793.0, 793.0, 0.08305279943302622, 6.744136039793364, 0.1853710366512004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 281.6470588235294, 158, 782, 316.0, 416.3999999999997, 782.0, 782.0, 0.1260276816095959, 9.052824363745543, 0.28154242360498477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37cd1dd3-8550-487b-8534-cebb4c39e997", 3, 0, 0.0, 839.3333333333334, 301, 1805, 412.0, 1805.0, 1805.0, 1805.0, 0.019810218110501397, 0.027309984927725718, 0.012703818254455648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 100.0, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.050895441677004806, 0.0378236631994147, 0.0255471259980278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 119.25, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.050895765472312705, 0.02317397524557207, 0.028492185114260993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 196.625, 79, 856, 80.5, 856.0, 856.0, 856.0, 0.050895765472312705, 5.736515654026491, 0.029374411517711727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 147.74999999999997, 77, 627, 79.0, 627.0, 627.0, 627.0, 0.05089706069474488, 1.8826817780570047, 0.02942486321414938], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 917.5178571428572, 617, 1529, 856.0, 1327.1000000000001, 1408.3, 1529.0, 0.24892982401550476, 297.8066115316741, 0.4915391642181159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1087.7826086956525, 104, 1868, 1037.0, 1755.8, 1848.1999999999998, 1868.0, 0.09394158467200092, 0.029883252053440508, 0.04238380089693791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 97.77777777777777, 79, 239, 80.0, 239.0, 239.0, 239.0, 0.045345761430910694, 0.012222099760675148, 0.026702630998866356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bbc0211-be5b-4a09-b815-bdd864969425", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 79.77777777777777, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.045345761430910694, 0.012222099760675148, 0.026658348028718984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 169.16666666666669, 78, 887, 85.0, 302.0000000000009, 887.0, 887.0, 0.08705535269508863, 4.373969429364254, 0.05076339685149808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 112.33333333333334, 78, 484, 80.0, 259.9000000000004, 484.0, 484.0, 0.08712192713702827, 1.445329705068076, 0.05088729750202074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 97.83333333333331, 78, 237, 81.0, 235.2, 237.0, 237.0, 0.08711939713377184, 0.06474400509648473, 0.04372985363941281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 114.77777777777777, 78, 241, 80.0, 241.0, 241.0, 241.0, 0.04530969174306384, 0.012123882360937003, 0.025840683572216097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 115.88888888888889, 79, 238, 80.0, 235.3, 238.0, 238.0, 0.08705577373237121, 0.03055831467276702, 0.04924281124857325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 81.33333333333333, 80, 87, 80.0, 87.0, 87.0, 87.0, 0.0453437052860684, 0.033697812229197315, 0.02276041456742105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 85.77777777777777, 81, 94, 84.0, 94.0, 94.0, 94.0, 0.04589073924881958, 0.036121031088426354, 0.016312723717353837], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 564.0714285714286, 374, 1049, 418.0, 1041.5, 1049.0, 1049.0, 0.07978981084115559, 0.014415151372669709, 0.0543100567932475], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c63fb64-caed-49fc-8a06-4dc9d92558ef", 1, 0, 0.0, 1175.0, 1175, 1175, 1175.0, 1175.0, 1175.0, 1175.0, 0.851063829787234, 0.15375664893617022, 0.5867686170212766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df2b4ba2-1b48-42aa-b802-4a077c640ef7", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1553.0, 1070, 3140, 1478.0, 1946.5, 3080.449999999999, 3140.0, 0.09489961992702219, 0.049117967345040786, 0.04365011815002681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 198.33333333333334, 160, 321, 164.0, 321.0, 321.0, 321.0, 0.045289399261279575, 0.07018972326919012, 0.10185692040891295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0288900-22ce-4aab-846f-a853801760e5", 3, 0, 0.0, 387.3333333333333, 173, 579, 410.0, 579.0, 579.0, 579.0, 0.018859621550260892, 0.025999510828566042, 0.012094223455082669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92eaa9a5-85d9-414a-ab72-6ab57ac3e095", 3, 0, 0.0, 258.0, 168, 406, 200.0, 406.0, 406.0, 406.0, 0.01985124798178979, 0.027366547917604088, 0.012730129727905562], "isController": false}, {"data": ["addBook", 62, 4, 6.451612903225806, 833.8709677419356, 405, 1820, 687.5, 1444.8000000000002, 1548.85, 1820.0, 0.30349013657056145, 94.82066700523765, 1.104798172940428], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 140.44642857142853, 78, 352, 81.0, 322.0, 337.79999999999995, 352.0, 0.24978032712302128, 0.18562776263732342, 0.12074341984950736], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 500.12499999999994, 388, 709, 467.5, 627.3, 650.5999999999999, 709.0, 0.2497602747363022, 73.43781359409495, 0.1256118569230426], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 138.78571428571425, 77, 326, 85.0, 241.3, 258.0999999999999, 326.0, 0.25011165698972754, 0.4425803930326038, 0.12163633318445734], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 775.4464285714286, 535, 1205, 770.0, 1009.8000000000001, 1084.05, 1205.0, 0.24934657838610427, 224.36248953634896, 0.1251602942289625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 87.29411764705883, 81, 104, 83.0, 102.4, 104.0, 104.0, 0.1303601006073247, 0.09738816109824551, 0.04633894201275996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 4, 2.2222222222222223, 136.2777777777778, 79, 529, 86.0, 248.60000000000002, 296.95, 402.63999999999965, 0.7817895162025877, 1.6051540152492387, 0.37889137088963304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af858c11-9719-4e35-a8b4-48dd39029cbc", 3, 0, 0.0, 303.6666666666667, 166, 382, 363.0, 382.0, 382.0, 382.0, 0.026671882501466952, 0.02675002278223297, 0.01710403923433916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 125.75, 81, 252, 84.5, 252.0, 252.0, 252.0, 0.052009517741746746, 0.040276901923051917, 0.018487758259761535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 92.45000000000002, 80, 245, 82.5, 94.0, 237.4499999999999, 245.0, 0.12446170313394568, 0.10100358916436412, 0.04424224603589475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ff7b2fe-012f-4be3-bf39-fb8f239ef806", 3, 0, 0.0, 364.33333333333337, 182, 670, 241.0, 670.0, 670.0, 670.0, 0.023755226149752947, 0.028495445430286332, 0.01523365739421006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92eaa9a5-85d9-414a-ab72-6ab57ac3e095", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 297.5, 160, 937, 162.5, 937.0, 937.0, 937.0, 0.05086890447455601, 7.676094088794852, 0.11277844764000076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daa72583-a13c-446d-a5b2-041d3442b6ba", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40e4ace9-5025-4f01-8b2b-7a84b52fff38", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.9706259498480243, 1.8136160714285714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c63fb64-caed-49fc-8a06-4dc9d92558ef", 3, 0, 0.0, 281.3333333333333, 191, 424, 229.0, 424.0, 424.0, 424.0, 0.031919987232005106, 0.0259453802468479, 0.020469523062190777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 294.2222222222222, 160, 967, 243.5, 524.2000000000007, 967.0, 967.0, 0.0870191587181111, 5.910990693482265, 0.194471201492862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23cbf5a2-784d-4a33-8fa9-f098bce8093d", 3, 0, 0.0, 255.0, 189, 374, 202.0, 374.0, 374.0, 374.0, 0.09409993413004611, 0.04257776967472789, 0.060344033280010034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a53f7baf-e0a1-46f8-8f31-bffd5d065a24", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caceb9ce-8b6f-47eb-90c1-8f2c1b9d2222", 3, 0, 0.0, 311.3333333333333, 184, 411, 339.0, 411.0, 411.0, 411.0, 0.06416975037967103, 0.04125496647130543, 0.041150523518213515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a2a6808-08cd-4e41-807b-4e9c11ee8998", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 85.33333333333333, 80, 97, 83.0, 95.80000000000001, 97.0, 97.0, 0.06572029442691903, 0.054488798797318605, 0.023361510909568874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 108.63157894736842, 81, 239, 85.0, 238.0, 239.0, 239.0, 0.09074626865671642, 0.07045242537313433, 0.032257462686567165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cf64545-b70b-40cb-a1f7-f9d237bfe762", 3, 0, 0.0, 325.3333333333333, 212, 385, 379.0, 385.0, 385.0, 385.0, 0.018750585955811118, 0.02584919645926435, 0.012024301540673146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 81.0, 78, 87, 80.0, 84.6, 87.0, 87.0, 0.12611743759041508, 0.09372594727178309, 0.06330504191550132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 134.7058823529412, 78, 240, 80.0, 239.2, 240.0, 240.0, 0.1261249230267014, 0.04489143055339165, 0.07130753058529384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 171.47058823529412, 77, 697, 82.0, 328.1999999999997, 697.0, 697.0, 0.12610995304258807, 6.706929799874632, 0.07350135475471614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 157.76470588235293, 78, 617, 81.0, 318.59999999999974, 617.0, 617.0, 0.12611650197335234, 2.2133127327591327, 0.07362833235036649], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 50.0, 0.3032600454890068], "isController": false}, {"data": ["401/Unauthorized", 4, 50.0, 0.3032600454890068], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1319, 8, "406/Not Acceptable", 4, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
