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

    var data = {"OkPercent": 97.2027972027972, "KoPercent": 2.797202797202797};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7249169435215946, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a78c830-92a4-400c-add5-a9e746474a6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d20a7372-2155-4710-a894-d9988307e5db"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0cbf887c-7705-407b-bc0a-023a0c9a8502"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cad9e94b-ee2d-45d7-a6a8-2ce529db2f31"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/08216253-f58b-4972-b29d-9feb7a23736a"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3989720b-bd18-429e-aab2-c016db8c5ecc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df6dc4af-18a3-4cf4-a98a-6fb0453c47d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62fe997f-db53-411f-a3b2-799ea161993e"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66102cb9-1f48-494b-b4c7-313323309324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60e27eae-bcaf-480f-b703-b28f885ade17"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45e7ef4b-a276-40c4-9e1a-976665dc57da"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=917e2f2b-77cd-4207-87b0-304ef528b55a"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ca5efe42-887b-427b-802e-919ffbe2a090"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08216253-f58b-4972-b29d-9feb7a23736a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3989720b-bd18-429e-aab2-c016db8c5ecc"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cad9e94b-ee2d-45d7-a6a8-2ce529db2f31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df6dc4af-18a3-4cf4-a98a-6fb0453c47d3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62fe997f-db53-411f-a3b2-799ea161993e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d20a7372-2155-4710-a894-d9988307e5db"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66102cb9-1f48-494b-b4c7-313323309324"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cbf887c-7705-407b-bc0a-023a0c9a8502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60e27eae-bcaf-480f-b703-b28f885ade17"], "isController": false}, {"data": [0.22321428571428573, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35c9cbdd-0465-4916-8fdc-2976dd342a3d"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b7a9462-c4ec-4c3c-8869-c689879de89b"], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8952095808383234, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35c9cbdd-0465-4916-8fdc-2976dd342a3d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/917e2f2b-77cd-4207-87b0-304ef528b55a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca5efe42-887b-427b-802e-919ffbe2a090"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 36, 2.797202797202797, 461.43745143745156, 133, 3127, 149.0, 1336.0000000000002, 1537.599999999999, 2107.1599999999953, 5.077543999463446, 711.2775856588971, 3.712084860476035], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2340.745454545455, 1680, 3127, 2351.0, 2799.2, 2981.9999999999995, 3127.0, 0.24313905785825435, 292.5776078114501, 1.1955128479651471], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2a78c830-92a4-400c-add5-a9e746474a6e", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d20a7372-2155-4710-a894-d9988307e5db", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 0.580913384244373, 2.216891077170418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cbf887c-7705-407b-bc0a-023a0c9a8502", 3, 0, 0.0, 476.66666666666663, 291, 843, 296.0, 843.0, 843.0, 843.0, 0.01835929133135461, 0.021700060815152536, 0.01177337367277623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cad9e94b-ee2d-45d7-a6a8-2ce529db2f31", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08216253-f58b-4972-b29d-9feb7a23736a", 3, 0, 0.0, 389.6666666666667, 238, 633, 298.0, 633.0, 633.0, 633.0, 0.01805130179971479, 0.024885176797458376, 0.011575867365051475], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 636.0, 143, 1489, 520.0, 1425.4, 1489.0, 1489.0, 0.0924465042895178, 0.018814308099546397, 0.06194999144869835], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 636.0, 143, 1489, 520.0, 1425.4, 1489.0, 1489.0, 0.09067114783628417, 0.01845299532136877, 0.06076029457544747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 209.79999999999998, 135, 419, 138.0, 413.6, 419.0, 419.0, 0.14222997638982393, 0.05229914756834151, 0.08031919369826385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 177.66666666666666, 135, 425, 139.0, 420.8, 425.0, 425.0, 0.1422245820967696, 0.10569619821840007, 0.07139007343529255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 321.3333333333333, 134, 981, 401.0, 644.4000000000002, 981.0, 981.0, 0.14223267368980003, 2.8238556492447446, 0.08294127983330331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 268.93333333333334, 134, 1531, 140.0, 871.0000000000005, 1531.0, 1531.0, 0.14222727919214906, 8.567536104987436, 0.08279924026928365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3989720b-bd18-429e-aab2-c016db8c5ecc", 3, 0, 0.0, 345.6666666666667, 240, 520, 277.0, 520.0, 520.0, 520.0, 0.07961572145112922, 0.03602404063055652, 0.05105565470661607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df6dc4af-18a3-4cf4-a98a-6fb0453c47d3", 1, 0, 0.0, 1507.0, 1507, 1507, 1507.0, 1507.0, 1507.0, 1507.0, 0.6635700066357001, 0.11988325315195754, 0.4575004147312542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62fe997f-db53-411f-a3b2-799ea161993e", 3, 0, 0.0, 588.0, 280, 1145, 339.0, 1145.0, 1145.0, 1145.0, 0.030224873055533168, 0.03031342248831305, 0.0193824869529298], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 338.73333333333335, 139, 1423, 246.0, 886.0000000000003, 1423.0, 1423.0, 0.09251663757532397, 0.1581456273553194, 0.05979249096420839], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 139.00000000000003, 135, 148, 138.0, 146.2, 148.0, 148.0, 0.09577993601900274, 0.07118020635787214, 0.04807703819703848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 191.6, 135, 409, 138.0, 405.4, 409.0, 409.0, 0.09578054760931753, 0.035219305527176135, 0.05408857226323049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1094.142857142857, 831, 1218, 1111.0, 1218.0, 1218.0, 1218.0, 0.07242553103434005, 21.2955108780561, 0.04130518566802206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1375.4285714285713, 1202, 1656, 1373.0, 1656.0, 1656.0, 1656.0, 0.07234095324707535, 65.0925168935503, 0.04118630443656732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 257.14285714285717, 137, 422, 145.0, 422.0, 422.0, 422.0, 0.07294402067441957, 0.1290767240840315, 0.040389902072652244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 164.83333333333334, 138, 428, 141.0, 343.1000000000003, 428.0, 428.0, 0.06648346777767929, 0.04940812400274798, 0.03337158441184292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 184.25000000000003, 135, 414, 139.0, 414.0, 414.0, 414.0, 0.06648309944209599, 0.01778942309290459, 0.03791614265057037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66102cb9-1f48-494b-b4c7-313323309324", 3, 0, 0.0, 335.0, 248, 489, 268.0, 489.0, 489.0, 489.0, 0.04715868898844612, 0.030871133969975633, 0.03024173740470015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 231.16666666666666, 136, 430, 141.0, 425.20000000000005, 430.0, 430.0, 0.06648346777767929, 0.01791937217445262, 0.03908500742398723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 162.33333333333334, 136, 413, 139.5, 332.60000000000025, 413.0, 413.0, 0.06648494116082707, 0.01791976929725417, 0.03915080031247922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 222.2857142857143, 141, 421, 145.0, 421.0, 421.0, 421.0, 0.07313989572340582, 0.054354942036632645, 0.041069765664998384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 897.2352941176468, 134, 1743, 1198.0, 1629.3999999999999, 1743.0, 1743.0, 0.0780632955568209, 41.327187594709144, 0.04194646522509781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 260.3333333333333, 135, 1690, 139.0, 920.2000000000005, 1690.0, 1690.0, 0.0956163108677499, 5.7597684511591885, 0.055664130975222624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 735.9411764705883, 138, 1199, 1083.0, 1194.2, 1199.0, 1199.0, 0.0780632955568209, 13.510546580827656, 0.04202269891216502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 204.33333333333334, 134, 793, 140.0, 581.2000000000002, 793.0, 793.0, 0.09559620164425467, 1.897945577879039, 0.05574577982601491], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 686.8000000000001, 145, 3127, 515.0, 2155.0000000000005, 3127.0, 3127.0, 0.09087659564155848, 0.018494807159864048, 0.06135945139313821], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60e27eae-bcaf-480f-b703-b28f885ade17", 3, 0, 0.0, 420.3333333333333, 265, 639, 357.0, 639.0, 639.0, 639.0, 0.029081602977956145, 0.024244135815932842, 0.018649335243025263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 397.75, 278, 842, 284.5, 760.7000000000003, 842.0, 842.0, 0.06643083719462574, 0.10295482287878033, 0.14940450982346004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45e7ef4b-a276-40c4-9e1a-976665dc57da", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 365.3636363636363, 175, 667, 347.0, 604.4999999999999, 662.8, 667.0, 0.09951869141967937, 0.06113013369431477, 0.04499722082745269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 140.41176470588235, 135, 147, 140.0, 145.4, 147.0, 147.0, 0.07806222018137987, 0.058013036677763745, 0.039183575364481686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 238.7058823529412, 138, 428, 142.0, 421.6, 428.0, 428.0, 0.0780632955568209, 0.0898570953795713, 0.040663945548555375], "isController": false}, {"data": ["login", 22, 0, 0.0, 2445.1363636363635, 1412, 4095, 2206.5, 3565.2999999999997, 4020.449999999999, 4095.0, 0.10015113717063934, 38.258298994107015, 0.20394769037820712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 164.33333333333334, 137, 420, 144.0, 267.6000000000001, 420.0, 420.0, 0.09559437395244498, 0.07739036719392274, 0.03398081261590818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=917e2f2b-77cd-4207-87b0-304ef528b55a", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1061.1764705882354, 277, 1891, 1333.0, 1772.6, 1891.0, 1891.0, 0.07801206892595737, 54.94952249873804, 0.1637097248353716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca5efe42-887b-427b-802e-919ffbe2a090", 3, 0, 0.0, 737.3333333333334, 528, 1114, 570.0, 1114.0, 1114.0, 1114.0, 0.02504382669671926, 0.0251171972827448, 0.016060006052258116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08216253-f58b-4972-b29d-9feb7a23736a", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 557.1999999999999, 277, 1674, 549.0, 1174.8000000000002, 1674.0, 1674.0, 0.14203872922683586, 11.533970189621703, 0.31702563503148523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 926.0769230769232, 139, 2069, 1346.0, 1925.0, 2069.0, 2069.0, 0.1201711977370839, 77.42758818717127, 0.1826580540123314], "isController": false}, {"data": ["register", 25, 8, 32.0, 815.3600000000001, 182, 1558, 929.0, 1457.2, 1537.3, 1558.0, 0.1030426431674484, 0.032249127228812374, 0.04648994252281364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 162.62500000000003, 141, 426, 143.0, 242.6000000000002, 426.0, 426.0, 0.0889615408138869, 0.06906682123734383, 0.031623047711186354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 441.53333333333336, 275, 1826, 286.0, 1078.4000000000005, 1826.0, 1826.0, 0.09551098376313276, 7.755777917064629, 0.2131772823145495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3989720b-bd18-429e-aab2-c016db8c5ecc", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 485.0588235294118, 276, 2066, 284.0, 1078.799999999999, 2066.0, 2066.0, 0.10890594370203334, 7.822935151315199, 0.24329292535778804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 215.27272727272725, 136, 415, 143.0, 414.2, 415.0, 415.0, 0.04924035560489538, 0.0365936627102787, 0.024716350371988504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cad9e94b-ee2d-45d7-a6a8-2ce529db2f31", 3, 0, 0.0, 1511.0, 244, 3083, 1206.0, 3083.0, 3083.0, 3083.0, 0.028115686678787652, 0.02343889114074713, 0.018029916262113175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 165.36363636363637, 133, 410, 140.0, 358.6000000000002, 410.0, 410.0, 0.049181793794151836, 0.013159972167575786, 0.02804899177322722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 203.90909090909096, 136, 567, 140.0, 536.0000000000001, 567.0, 567.0, 0.049241898588548126, 0.013272230478944613, 0.028948850537408175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 214.45454545454547, 137, 431, 140.0, 425.40000000000003, 431.0, 431.0, 0.04917717642535575, 0.013254785833396667, 0.028958825570790544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 149.66666666666666, 145, 157, 147.0, 157.0, 157.0, 157.0, 0.142843538710599, 0.04212768426816494, 0.08830074219121989], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1635.4363636363635, 1091, 2547, 1502.0, 2216.0, 2401.5999999999995, 2547.0, 0.24485798237022527, 292.9352733227228, 0.4834988675318315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 815.3600000000001, 182, 1558, 929.0, 1457.2, 1537.3, 1558.0, 0.10106359325542004, 0.03162974645165724, 0.045597050863285214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 208.375, 137, 421, 140.5, 421.0, 421.0, 421.0, 0.046243041867294034, 0.012463944878294095, 0.027231010005838184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 175.125, 138, 422, 139.5, 422.0, 422.0, 422.0, 0.04624277456647399, 0.012463872832369943, 0.0271856936416185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 172.87499999999997, 133, 421, 139.0, 418.2, 421.0, 421.0, 0.08519656444853861, 0.022963136511520175, 0.050086261521504145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df6dc4af-18a3-4cf4-a98a-6fb0453c47d3", 3, 0, 0.0, 569.6666666666667, 241, 1147, 321.0, 1147.0, 1147.0, 1147.0, 0.028514399771884802, 0.023771281841079746, 0.01828560141621519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62fe997f-db53-411f-a3b2-799ea161993e", 1, 0, 0.0, 3127.0, 3127, 3127, 3127.0, 3127.0, 3127.0, 3127.0, 0.3197953309881676, 0.0577755236648545, 0.2204838903102015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 190.8125, 134, 428, 139.5, 419.6, 428.0, 428.0, 0.08532286706164044, 0.022997179012707775, 0.0502438367560246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 157.625, 135, 406, 141.5, 224.7000000000002, 406.0, 406.0, 0.08532150208504422, 0.06340787410812367, 0.04282739460128195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 206.5, 135, 413, 140.5, 413.0, 413.0, 413.0, 0.046169650380322495, 0.01235398848067223, 0.026331128732527673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 174.5, 136, 427, 139.0, 424.2, 427.0, 427.0, 0.08532377707030146, 0.02283077628638926, 0.0486612166104063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 175.62499999999997, 139, 422, 140.0, 422.0, 422.0, 422.0, 0.04624197268255464, 0.03436537227678133, 0.023211302694172934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 142.74999999999997, 141, 144, 143.0, 144.0, 144.0, 144.0, 0.04771077726820017, 0.03755360007633725, 0.01695969035705553], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 739.0666666666666, 140, 3083, 570.0, 1921.4000000000005, 3083.0, 3083.0, 0.094388300884733, 0.018693308026781107, 0.06422828911765815], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d20a7372-2155-4710-a894-d9988307e5db", 3, 0, 0.0, 358.6666666666667, 259, 548, 269.0, 548.0, 548.0, 548.0, 0.08970487097449391, 0.0405891180516102, 0.05752558457674252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1293.9545454545455, 849, 2711, 1134.5, 2149.5999999999995, 2661.3499999999995, 2711.0, 0.0986971969996052, 0.051083510165811294, 0.0453968552605606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 421.625, 280, 844, 283.0, 844.0, 844.0, 844.0, 0.046131578795619806, 0.07149493705922717, 0.10375100192022696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66102cb9-1f48-494b-b4c7-313323309324", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cbf887c-7705-407b-bc0a-023a0c9a8502", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.26685976735598227, 1.0183945716395864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60e27eae-bcaf-480f-b703-b28f885ade17", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["addBook", 56, 16, 28.571428571428573, 1308.2857142857142, 696, 3651, 1088.0, 2240.7000000000003, 2643.2999999999997, 3651.0, 0.2525423346636903, 71.15742287030147, 0.9181700122888904], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35c9cbdd-0465-4916-8fdc-2976dd342a3d", 3, 0, 0.0, 728.3333333333334, 298, 1423, 464.0, 1423.0, 1423.0, 1423.0, 0.028054950295979725, 0.028319791949164428, 0.017990967474960956], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 258.87272727272733, 137, 574, 143.0, 560.4, 566.4, 574.0, 0.24633079090098847, 0.18306419128481663, 0.11907591942967705], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 888.2363636363638, 662, 1238, 830.0, 1132.0, 1211.2, 1238.0, 0.24624256235533248, 72.40348935504596, 0.12384269493456664], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 211.19999999999996, 135, 568, 142.0, 417.2, 447.59999999999945, 568.0, 0.24683158008114028, 0.43677619444045523, 0.12004113953164829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b7a9462-c4ec-4c3c-8869-c689879de89b", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1374.9999999999995, 948, 1951, 1348.0, 1691.8, 1829.1999999999996, 1951.0, 0.2455094097061029, 220.90979841306066, 0.12323421541888369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 161.8235294117647, 137, 430, 144.0, 220.3999999999998, 430.0, 430.0, 0.1109559178665135, 0.08289187223426057, 0.03944136142911222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 16, 9.580838323353293, 201.37125748502993, 135, 1627, 144.0, 347.80000000000024, 419.2, 1295.1599999999967, 0.6817940573686831, 1.5157685926668354, 0.32521251204366747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 193.36363636363637, 141, 412, 146.0, 411.8, 412.0, 412.0, 0.05006759124818505, 0.03877304673809643, 0.01779746407650328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 141.8, 135, 152, 142.0, 150.2, 152.0, 152.0, 0.14142404585910395, 0.11476892784073768, 0.050271828801478353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 448.3636363636364, 278, 978, 287.0, 950.0000000000001, 978.0, 978.0, 0.04914531823827437, 0.07616564457435687, 0.11052897256127528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 386.8125, 274, 835, 284.0, 649.5000000000002, 835.0, 835.0, 0.08513174136976971, 0.13193757182990679, 0.19146328161580045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35c9cbdd-0465-4916-8fdc-2976dd342a3d", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/917e2f2b-77cd-4207-87b0-304ef528b55a", 3, 0, 0.0, 380.3333333333333, 246, 580, 315.0, 580.0, 580.0, 580.0, 0.045960810748701605, 0.02954837279579612, 0.029473566788718156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 165.66666666666666, 138, 416, 143.5, 336.2000000000003, 416.0, 416.0, 0.06742254834758571, 0.05590014018271511, 0.02396660898293086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 158.2941176470588, 137, 421, 142.0, 202.5999999999998, 421.0, 421.0, 0.07698159687001883, 0.05976598585123533, 0.02736455201238951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca5efe42-887b-427b-802e-919ffbe2a090", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 172.64705882352942, 136, 439, 139.0, 422.2, 439.0, 439.0, 0.10900300720061042, 0.08100711765592239, 0.0547144000987439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 155.29411764705884, 133, 413, 139.0, 204.19999999999982, 413.0, 413.0, 0.10900720088744686, 0.0387987486614557, 0.06162964563041429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 292.6470588235294, 135, 1626, 140.0, 677.1999999999991, 1626.0, 1626.0, 0.1090044050603692, 5.79720216349699, 0.06353163452105388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 258.3529411764706, 134, 1058, 141.0, 556.3999999999995, 1058.0, 1058.0, 0.10900720088744686, 1.9130488232031444, 0.06363971637288157], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.6216006216006216], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.2331002331002331], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.2331002331002331], "isController": false}, {"data": ["401/Unauthorized", 22, 61.111111111111114, 1.7094017094017093], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 36, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
