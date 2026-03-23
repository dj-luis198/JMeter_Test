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

    var data = {"OkPercent": 99.14129586260734, "KoPercent": 0.8587041373926619};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7711409395973154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80256dd3-9dbf-4dbe-a72a-ce5b165b4e2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c105d3b-79fe-432f-b53e-1c61d3269a1d"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15a703cb-7620-4cb7-a036-c64c294530d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bd6fd96-4d5b-4b55-8ada-f1f51448e41a"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6df6030b-7cf0-40fe-ade0-bd12bb0d10d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=314e1934-f522-41d7-9369-f8bd52bc78f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55150dc0-7dcd-425d-bcbd-eca7f523453b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=075892c4-5a06-46b4-9c36-7683edf7f561"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f44fcdb3-ff40-408d-b2ff-88beacfa8e2a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bfece7e-68fc-46cb-8fa1-039140a7fc8f"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81148ee9-a7e8-476b-847a-1b0dbd2b29f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/075892c4-5a06-46b4-9c36-7683edf7f561"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dae5889-d7dc-4409-95cb-c42dc752e0d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b51be0c-e2a3-4829-8220-0c7cf8c4e86d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80256dd3-9dbf-4dbe-a72a-ce5b165b4e2b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/350112bb-f026-4536-995e-bbd61a0e33b9"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15a703cb-7620-4cb7-a036-c64c294530d2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37719298245614036, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/314e1934-f522-41d7-9369-f8bd52bc78f0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c105d3b-79fe-432f-b53e-1c61d3269a1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4bc1cdb8-9069-4f70-8e40-d0f0ef3bb8ce"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7e9aa5b-8195-4e4c-829e-6d573b90942e"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6df6030b-7cf0-40fe-ade0-bd12bb0d10d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1540d3fb-b46f-418e-9cb4-86c60fb0b383"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9670658682634731, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55150dc0-7dcd-425d-bcbd-eca7f523453b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1540d3fb-b46f-418e-9cb4-86c60fb0b383"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b51be0c-e2a3-4829-8220-0c7cf8c4e86d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3dae5889-d7dc-4409-95cb-c42dc752e0d5"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bc1cdb8-9069-4f70-8e40-d0f0ef3bb8ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81148ee9-a7e8-476b-847a-1b0dbd2b29f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/205050be-46c2-4617-89e7-0dc9ce9ffbb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 11, 0.8587041373926619, 427.63387978142094, 131, 2817, 159.0, 1118.9999999999998, 1267.0, 1834.5400000000002, 5.135359415026038, 751.5089080170337, 3.7437890739315365], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2026.1754385964919, 1639, 2628, 1999.0, 2422.6, 2458.7999999999993, 2628.0, 0.24353770561845758, 293.0582365880688, 1.197472995887631], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80256dd3-9dbf-4dbe-a72a-ce5b165b4e2b", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c105d3b-79fe-432f-b53e-1c61d3269a1d", 3, 0, 0.0, 378.3333333333333, 228, 493, 414.0, 493.0, 493.0, 493.0, 0.018428084400626554, 0.025404602030160633, 0.011817489019933045], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 521.4615384615385, 146, 874, 469.0, 836.8, 874.0, 874.0, 0.08379096088895764, 0.015874459387165803, 0.05664324346752778], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 521.4615384615385, 146, 874, 469.0, 836.8, 874.0, 874.0, 0.08416690945582857, 0.015945684017998767, 0.05689738718396944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15a703cb-7620-4cb7-a036-c64c294530d2", 3, 0, 0.0, 686.6666666666667, 251, 1465, 344.0, 1465.0, 1465.0, 1465.0, 0.01876172607879925, 0.025864554018136334, 0.012031445434646654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 194.62500000000003, 133, 427, 142.0, 424.9, 427.0, 427.0, 0.111731843575419, 0.040385496682960896, 0.0631355839734637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 178.81249999999997, 133, 434, 143.0, 427.0, 434.0, 434.0, 0.11195387500349856, 0.0832000965602172, 0.05619559741386549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 316.3125, 133, 992, 271.0, 595.1000000000004, 992.0, 992.0, 0.11129273467116474, 2.073357019267555, 0.06493887594337983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 281.9375, 141, 979, 143.5, 590.5000000000005, 979.0, 979.0, 0.11130279926540153, 6.287528010479853, 0.06483605445489454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bd6fd96-4d5b-4b55-8ada-f1f51448e41a", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 271.15384615384613, 143, 434, 246.0, 426.0, 434.0, 434.0, 0.08420834439917346, 0.17996117711929732, 0.05443305315165923], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6df6030b-7cf0-40fe-ade0-bd12bb0d10d5", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 157.05, 135, 424, 142.5, 147.0, 410.1499999999998, 424.0, 0.09359483730877405, 0.06955631952341508, 0.04698022107100572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 198.75, 134, 427, 143.5, 425.6, 426.95, 427.0, 0.09347366846759268, 0.039050815791441554, 0.052524168785403155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 902.0, 660, 986, 981.0, 986.0, 986.0, 986.0, 0.034019680385102787, 10.002915592920505, 0.019401848969628932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1122.25, 975, 1273, 1120.5, 1273.0, 1273.0, 1273.0, 0.03402170584833123, 30.612790726108255, 0.019369779794508896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 347.0, 142, 425, 410.5, 425.0, 425.0, 425.0, 0.03418160687733931, 0.06048542154466681, 0.01892672958930799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 189.16666666666669, 134, 432, 143.0, 429.0, 432.0, 432.0, 0.06840686120817917, 0.0508375208783441, 0.034337037754886814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=314e1934-f522-41d7-9369-f8bd52bc78f0", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 210.16666666666666, 133, 424, 141.5, 423.7, 424.0, 424.0, 0.0684107610127073, 0.01830522316160332, 0.03901551214005963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 253.24999999999994, 133, 430, 143.0, 428.2, 430.0, 430.0, 0.0684107610127073, 0.018438837929206264, 0.040218045048486126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 235.0, 135, 426, 142.5, 425.1, 426.0, 426.0, 0.06840725116862388, 0.018437891916543155, 0.04028278560027363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 211.75, 133, 428, 143.0, 428.0, 428.0, 428.0, 0.0342641768031523, 0.02546390483124893, 0.019240138341613845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55150dc0-7dcd-425d-bcbd-eca7f523453b", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=075892c4-5a06-46b4-9c36-7683edf7f561", 1, 0, 0.0, 1240.0, 1240, 1240, 1240.0, 1240.0, 1240.0, 1240.0, 0.8064516129032258, 0.1456968245967742, 0.5560105846774194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 254.45000000000002, 133, 1260, 143.0, 922.5000000000011, 1245.8999999999999, 1260.0, 0.09360009360009361, 8.44485821048321, 0.05422224172224172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 911.6666666666667, 134, 1297, 1256.0, 1290.4, 1297.0, 1297.0, 0.08185851574139258, 49.11164538004181, 0.04343404318309567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 198.04999999999998, 133, 705, 142.5, 646.2000000000012, 704.8, 705.0, 0.09360009360009361, 2.7748588686088684, 0.05431364806364806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 708.8000000000001, 133, 1013, 982.0, 1011.2, 1013.0, 1013.0, 0.08186208966627555, 16.054136423172427, 0.043515882950855456], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 549.0, 147, 1240, 442.0, 1176.8, 1240.0, 1240.0, 0.08403687279403209, 0.015921048166056863, 0.0574786453417715], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f44fcdb3-ff40-408d-b2ff-88beacfa8e2a", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.6310986907114624, 1.1792088685770752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 520.1666666666666, 277, 857, 566.0, 853.7, 857.0, 857.0, 0.06835114260326719, 0.10593092120252444, 0.15372332169465266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bfece7e-68fc-46cb-8fa1-039140a7fc8f", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 418.90909090909093, 147, 891, 374.5, 840.5, 885.4499999999999, 891.0, 0.10046258453698165, 0.06170992741578268, 0.04542400062560791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 143.39999999999998, 136, 149, 143.0, 147.8, 149.0, 149.0, 0.08185762230893066, 0.060833643141695544, 0.04108868932303746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 198.13333333333333, 133, 425, 143.0, 425.0, 425.0, 425.0, 0.0818580690227238, 0.10386808367531815, 0.042101480812468624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81148ee9-a7e8-476b-847a-1b0dbd2b29f2", 1, 0, 0.0, 1082.0, 1082, 1082, 1082.0, 1082.0, 1082.0, 1082.0, 0.9242144177449169, 0.16697233133086875, 0.6372025184842883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/075892c4-5a06-46b4-9c36-7683edf7f561", 3, 0, 0.0, 325.6666666666667, 231, 470, 276.0, 470.0, 470.0, 470.0, 0.0179972644158088, 0.02127215725709692, 0.01154121448539822], "isController": false}, {"data": ["login", 22, 0, 0.0, 2264.181818181818, 1298, 4585, 1958.5, 3387.2, 4429.449999999998, 4585.0, 0.09715254716314563, 21.26774827995831, 0.1758733655187946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dae5889-d7dc-4409-95cb-c42dc752e0d5", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b51be0c-e2a3-4829-8220-0c7cf8c4e86d", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 162.25, 143, 437, 146.5, 157.8, 423.0499999999998, 437.0, 0.09078075992574133, 0.07349340818206988, 0.03226972325485337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1056.466666666667, 279, 1441, 1401.0, 1436.8, 1441.0, 1441.0, 0.08179379239644906, 65.2781293538154, 0.17000435040733308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80256dd3-9dbf-4dbe-a72a-ce5b165b4e2b", 3, 0, 0.0, 321.6666666666667, 244, 465, 256.0, 465.0, 465.0, 465.0, 0.02599608325678931, 0.026072243656955686, 0.016670665369750957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350112bb-f026-4536-995e-bbd61a0e33b9", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.6237030029296875, 1.1653900146484375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 550.6875, 286, 1133, 566.5, 937.7000000000002, 1133.0, 1133.0, 0.11118214414764989, 8.474822293149096, 0.24827331090001947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 943.1666666666666, 143, 1702, 1127.5, 1702.0, 1702.0, 1702.0, 0.050967100736474605, 40.654126901709944, 0.08787345346703702], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1026.2608695652175, 170, 1880, 1075.0, 1579.8000000000002, 1834.1999999999994, 1880.0, 0.09767823091983166, 0.0310718964865565, 0.04406967059078342], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 441.1499999999999, 284, 1685, 290.0, 1064.6000000000013, 1656.7499999999995, 1685.0, 0.09340992947550325, 11.30536545175377, 0.20769114006818923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 161.15789473684208, 135, 430, 145.0, 167.0, 430.0, 430.0, 0.09472246318287418, 0.07353941233436032, 0.0336708755845373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15a703cb-7620-4cb7-a036-c64c294530d2", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 481.1875, 278, 1127, 307.5, 927.5000000000002, 1127.0, 1127.0, 0.07487026387088623, 5.706961187079732, 0.16718771203492697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 144.42857142857142, 143, 151, 143.0, 151.0, 151.0, 151.0, 0.045999369151508776, 0.034185078051072446, 0.023089527093628433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 176.85714285714286, 131, 399, 142.0, 399.0, 399.0, 399.0, 0.046000578292984255, 0.022178850248403124, 0.025682800548064034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 262.7142857142857, 141, 986, 143.0, 986.0, 986.0, 986.0, 0.04599967143091835, 5.923567900854279, 0.026478047478232295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 260.2857142857143, 134, 977, 142.0, 977.0, 977.0, 977.0, 0.04600208980922276, 1.9429336888090059, 0.026524363446082264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 2.0062712585034013, 4.205197704081633], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1316.2280701754387, 1060, 2046, 1133.0, 1837.2, 1859.599999999999, 2046.0, 0.25010750234750023, 299.2155242439733, 0.49386461889320854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1026.2608695652175, 170, 1880, 1075.0, 1579.8000000000002, 1834.1999999999994, 1880.0, 0.10084225202671004, 0.032078386217056366, 0.04549718792611332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 180.71428571428572, 134, 429, 141.0, 429.0, 429.0, 429.0, 0.03771226618394966, 0.010164634244892681, 0.022207516121993794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 140.85714285714286, 133, 144, 142.0, 144.0, 144.0, 144.0, 0.03771226618394966, 0.010164634244892681, 0.022170687737048528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/314e1934-f522-41d7-9369-f8bd52bc78f0", 3, 0, 0.0, 645.6666666666667, 246, 1372, 319.0, 1372.0, 1372.0, 1372.0, 0.07020664154829047, 0.03176667700264445, 0.04502183719079825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 299.8947368421052, 134, 1264, 142.0, 980.0, 1264.0, 1264.0, 0.09382855054642784, 8.909690251583973, 0.0543121472169958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 228.8421052631579, 134, 989, 142.0, 660.0, 989.0, 989.0, 0.09383133077519494, 2.926789030129734, 0.054405388696287735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c105d3b-79fe-432f-b53e-1c61d3269a1d", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 224.28571428571428, 141, 429, 145.0, 429.0, 429.0, 429.0, 0.03771226618394966, 0.010090977475002155, 0.02150777680803379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 142.8947368421053, 135, 152, 143.0, 144.0, 152.0, 152.0, 0.09382716049382717, 0.06972897376543209, 0.04709683641975309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 143.42857142857144, 135, 150, 144.0, 150.0, 150.0, 150.0, 0.037710640865405334, 0.028025193065013144, 0.018928974028142913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 183.05263157894737, 133, 426, 141.0, 400.0, 426.0, 426.0, 0.0938317941626747, 0.039942173070275075, 0.0526839288359919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 185.85714285714283, 143, 430, 145.0, 430.0, 430.0, 430.0, 0.038212527158188944, 0.030077438368652624, 0.013583359263262476], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 715.3846153846154, 160, 1678, 492.0, 1592.8, 1678.0, 1678.0, 0.08558036654729302, 0.016033461100431853, 0.05824505115072678], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1342.3636363636363, 750, 2817, 1199.5, 2291.5999999999995, 2757.449999999999, 2817.0, 0.09823884542564212, 0.05084627741756868, 0.04518603144089594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bc1cdb8-9069-4f70-8e40-d0f0ef3bb8ce", 3, 0, 0.0, 721.0, 240, 1678, 245.0, 1678.0, 1678.0, 1678.0, 0.022013824681900232, 0.030347834481721188, 0.01411693835395295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 369.2857142857143, 286, 579, 290.0, 579.0, 579.0, 579.0, 0.037681611911695834, 0.058399138773302044, 0.08474682835218311], "isController": false}, {"data": ["addBook", 55, 3, 5.454545454545454, 1373.6909090909094, 713, 3754, 1163.0, 2040.2, 2340.7999999999975, 3754.0, 0.26031066895108995, 97.26396755316254, 0.9435614670399364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f7e9aa5b-8195-4e4c-829e-6d573b90942e", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 246.66666666666663, 133, 587, 143.0, 570.4, 573.2, 587.0, 0.251124553372779, 0.18662674327801249, 0.1213932167182867], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 806.2456140350876, 657, 1138, 706.0, 1082.8000000000002, 1133.1, 1138.0, 0.2510382855406352, 73.81359120452133, 0.12625460649748743], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 222.5263157894737, 133, 574, 145.0, 429.4, 446.69999999999925, 574.0, 0.251670073779069, 0.44533806024186817, 0.12239423509958629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6df6030b-7cf0-40fe-ade0-bd12bb0d10d5", 3, 0, 0.0, 434.0, 249, 792, 261.0, 792.0, 792.0, 792.0, 0.028672190842102246, 0.028756191401209965, 0.01838678904913458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1540d3fb-b46f-418e-9cb4-86c60fb0b383", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1059.1578947368423, 915, 1432, 987.0, 1276.2, 1353.3999999999996, 1432.0, 0.25079638853200514, 225.66703125412494, 0.12588803096235412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 180.12500000000003, 136, 431, 145.5, 413.5, 431.0, 431.0, 0.07472619853816874, 0.05582572449384676, 0.026562828386614667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 3, 1.7964071856287425, 213.61077844311387, 134, 2035, 149.0, 324.6, 427.6, 1424.3599999999938, 0.6862346264952314, 1.5427197106514299, 0.3275995053049635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 227.28571428571428, 143, 425, 146.0, 425.0, 425.0, 425.0, 0.048099717585943884, 0.0372490977008335, 0.01709794648562849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55150dc0-7dcd-425d-bcbd-eca7f523453b", 3, 0, 0.0, 365.6666666666667, 246, 454, 397.0, 454.0, 454.0, 454.0, 0.02847326360547446, 0.023736988311725292, 0.018259221778250224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1540d3fb-b46f-418e-9cb4-86c60fb0b383", 3, 0, 0.0, 341.0, 234, 534, 255.0, 534.0, 534.0, 534.0, 0.02184296365330848, 0.021906956710886535, 0.014007369269862536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 163.5625, 143, 426, 146.0, 234.9000000000002, 426.0, 426.0, 0.10881910863547639, 0.08830925710554774, 0.038681792522767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b51be0c-e2a3-4829-8220-0c7cf8c4e86d", 3, 0, 0.0, 389.0, 218, 492, 457.0, 492.0, 492.0, 492.0, 0.0676178240584218, 0.031343678860414274, 0.04336169055829784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 408.42857142857144, 286, 1131, 287.0, 1131.0, 1131.0, 1131.0, 0.04595618406108233, 7.915273106933475, 0.10167677497554475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dae5889-d7dc-4409-95cb-c42dc752e0d5", 3, 0, 0.0, 394.0, 313, 474, 395.0, 474.0, 474.0, 474.0, 0.07711685774510307, 0.03489336987815536, 0.04945319328055113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 447.3157894736842, 278, 1408, 287.0, 1132.0, 1408.0, 1408.0, 0.09376187444791528, 11.937574292406275, 0.208347405325181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bc1cdb8-9069-4f70-8e40-d0f0ef3bb8ce", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81148ee9-a7e8-476b-847a-1b0dbd2b29f2", 3, 0, 0.0, 406.0, 333, 451, 434.0, 451.0, 451.0, 451.0, 0.03786874692316431, 0.02434595546004216, 0.024284320129763573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/205050be-46c2-4617-89e7-0dc9ce9ffbb6", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 170.91666666666669, 143, 426, 147.0, 345.0000000000003, 426.0, 426.0, 0.07010942913397328, 0.05812783724096027, 0.024921711137467065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 148.86666666666667, 143, 176, 147.0, 162.8, 176.0, 176.0, 0.07760801742558684, 0.06025231821615385, 0.027587224944251573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 161.56250000000006, 136, 422, 144.0, 236.50000000000017, 422.0, 422.0, 0.07501769948847306, 0.055750458311257814, 0.037655368688549955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 212.25, 137, 428, 143.5, 426.6, 428.0, 428.0, 0.07501980991855661, 0.027115924947368916, 0.04239095460363752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 248.9375, 134, 982, 143.0, 591.4000000000004, 982.0, 982.0, 0.07492144954274503, 4.232334817226783, 0.043643207668210365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 278.81250000000006, 137, 660, 150.5, 597.7, 660.0, 660.0, 0.07492951942079482, 1.3959190193364992, 0.04372108188859854], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.312256049960968], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.078064012490242], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 9.090909090909092, 0.078064012490242], "isController": false}, {"data": ["401/Unauthorized", 5, 45.45454545454545, 0.39032006245121], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 11, "401/Unauthorized", 5, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
