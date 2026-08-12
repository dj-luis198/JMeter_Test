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

    var data = {"OkPercent": 98.2536066818527, "KoPercent": 1.7463933181473046};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7703318152244633, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da15ee08-1c76-4e64-8165-349352f7a1dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47f7b7c3-3bc1-4e08-a57b-2e49029b2e7f"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1b7d638f-d65e-4cba-8eff-6a8de3545842"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf238c88-15f8-49b4-94b2-4df4fd463e13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41e64ed5-a8c1-42f8-bebe-956da75e8f47"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0852038-33f2-411b-b443-937f43a3bb9a"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fc2bc60-04bd-4e45-b71f-56ef2422187d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35fc13eb-ea29-4b52-a99c-865e4924e316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4f2b383-a755-4504-afe2-35d0f41e9b4a"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f20efab-e8d7-4f00-9a98-afd1f22085d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56b75cd5-60a7-4934-acc3-daa4de25a969"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3fbaf8f-0c99-449b-9f2e-5255e9213b3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf238c88-15f8-49b4-94b2-4df4fd463e13"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41e64ed5-a8c1-42f8-bebe-956da75e8f47"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1300561-f24c-4640-bf96-28c33e8b41b1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b6ee519-0b34-47c2-a39b-e8b1988d62dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d41255ee-b383-4f88-8ec9-10daa750883e"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35fc13eb-ea29-4b52-a99c-865e4924e316"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da15ee08-1c76-4e64-8165-349352f7a1dc"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0852038-33f2-411b-b443-937f43a3bb9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b7d638f-d65e-4cba-8eff-6a8de3545842"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5614035087719298, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9132947976878613, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5f20efab-e8d7-4f00-9a98-afd1f22085d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4f2b383-a755-4504-afe2-35d0f41e9b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56b75cd5-60a7-4934-acc3-daa4de25a969"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc63779d-3d2a-4fe4-9e5e-583715386ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf2affc8-20f7-4db7-bdba-7da0dcde894c"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3fbaf8f-0c99-449b-9f2e-5255e9213b3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b6ee519-0b34-47c2-a39b-e8b1988d62dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1300561-f24c-4640-bf96-28c33e8b41b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d41255ee-b383-4f88-8ec9-10daa750883e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 23, 1.7463933181473046, 389.53986332574067, 96, 4761, 118.0, 1077.4000000000003, 1278.7999999999993, 2039.799999999991, 5.259080599303581, 758.2220865911414, 3.835073839767754], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da15ee08-1c76-4e64-8165-349352f7a1dc", 1, 0, 0.0, 1191.0, 1191, 1191, 1191.0, 1191.0, 1191.0, 1191.0, 0.8396305625524769, 0.15169106842989083, 0.5788859151973131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47f7b7c3-3bc1-4e08-a57b-2e49029b2e7f", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1721.9298245614034, 1208, 4746, 1655.0, 2096.0, 2175.1999999999994, 4746.0, 0.2628133011194924, 316.2535456021422, 1.2922509483756295], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 503.6666666666667, 108, 996, 467.0, 833.4000000000001, 996.0, 996.0, 0.08246334504312833, 0.01615444044497221, 0.05552317151276258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 503.6666666666667, 108, 996, 467.0, 833.4000000000001, 996.0, 996.0, 0.0795494320170554, 0.015583609436153625, 0.05356121262502519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b7d638f-d65e-4cba-8eff-6a8de3545842", 3, 0, 0.0, 887.6666666666666, 313, 1788, 562.0, 1788.0, 1788.0, 1788.0, 0.02459419576979833, 0.029069506783899, 0.015771668511231348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 126.06249999999999, 98, 307, 101.0, 301.4, 307.0, 307.0, 0.08726860184791264, 0.03154325318257682, 0.04931229955493013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 116.5625, 99, 298, 103.5, 172.0000000000001, 298.0, 298.0, 0.08726574601304624, 0.0648527663241486, 0.04380331391670484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 159.375, 100, 812, 103.0, 455.7000000000004, 812.0, 812.0, 0.08726669793723342, 1.6257577033314061, 0.05091977736083689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 202.0, 100, 1110, 103.0, 547.9000000000005, 1110.0, 1110.0, 0.08726764988218867, 4.929775321594925, 0.050835110502661665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf238c88-15f8-49b4-94b2-4df4fd463e13", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41e64ed5-a8c1-42f8-bebe-956da75e8f47", 3, 0, 0.0, 358.6666666666667, 214, 440, 422.0, 440.0, 440.0, 440.0, 0.04678216663807756, 0.030076425491602603, 0.030000282642256775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0852038-33f2-411b-b443-937f43a3bb9a", 1, 0, 0.0, 734.0, 734, 734, 734.0, 734.0, 734.0, 734.0, 1.3623978201634876, 0.24613632493188012, 0.9393094346049047], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 249.81250000000003, 98, 522, 221.5, 438.0000000000001, 522.0, 522.0, 0.0856260602914497, 0.14715411252602228, 0.05534545767129226], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6fc2bc60-04bd-4e45-b71f-56ef2422187d", 2, 0, 0.0, 282.5, 195, 370, 282.5, 370.0, 370.0, 370.0, 0.03546979746745646, 0.031347819050828216, 0.022047388757847692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 103.14285714285714, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.12146873047823974, 0.09027119520892622, 0.060971608853335184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 131.2857142857143, 99, 305, 102.0, 300.5, 305.0, 305.0, 0.1214708383223142, 0.045534618104360804, 0.06854764802089298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 661.2, 503, 806, 607.0, 806.0, 806.0, 806.0, 0.03494841613778064, 10.275994741137081, 0.019931518578578018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1111.0, 999, 1209, 1105.0, 1209.0, 1209.0, 1209.0, 0.03485753724527855, 31.364873286316325, 0.019845648646481827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 222.2, 103, 308, 297.0, 308.0, 308.0, 308.0, 0.035118771685841516, 0.062143763959711745, 0.019445647994015762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35fc13eb-ea29-4b52-a99c-865e4924e316", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 102.93333333333332, 100, 107, 102.0, 105.8, 107.0, 107.0, 0.07970329121457188, 0.0592326216936418, 0.0400073160979394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 182.33333333333334, 98, 309, 106.0, 306.0, 309.0, 309.0, 0.07961825699711782, 0.03724848924357348, 0.04451572858666978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 307.0666666666667, 99, 1514, 106.0, 1297.4, 1514.0, 1514.0, 0.07926316957562499, 9.528000622876409, 0.045689850483241125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 209.13333333333333, 98, 813, 103.0, 687.0000000000001, 813.0, 813.0, 0.07949462616327137, 3.135110722765141, 0.04590090100534204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 103.4, 103, 104, 103.0, 104.0, 104.0, 104.0, 0.03511901835319899, 0.026099192350375423, 0.01972015190731389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 588.7727272727273, 99, 1394, 300.5, 1216.1, 1367.4499999999996, 1394.0, 0.10673549488882528, 43.67059462890009, 0.05857944153078106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 186.92857142857142, 101, 1071, 103.0, 688.0, 1071.0, 1071.0, 0.12125831485587583, 7.823808758856187, 0.07054229533328714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 417.1363636363635, 99, 906, 104.5, 839.3, 897.7499999999999, 906.0, 0.10683760683760683, 14.294708655060218, 0.058739817040598295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 223.21428571428572, 101, 599, 200.0, 453.5, 599.0, 599.0, 0.12126146570465904, 2.577127570309996, 0.07066254774670212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4f2b383-a755-4504-afe2-35d0f41e9b4a", 3, 0, 0.0, 374.6666666666667, 229, 462, 433.0, 462.0, 462.0, 462.0, 0.04299719085019779, 0.027643050758183796, 0.027573068351201054], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 565.0000000000001, 109, 1191, 521.5, 1159.5, 1191.0, 1191.0, 0.08487163165711861, 0.016025914264496375, 0.058082838880300684], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 451.73333333333335, 206, 1617, 401.0, 1401.0, 1617.0, 1617.0, 0.07921796029595829, 12.742698868437452, 0.1754605616685415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 757.5, 151, 2107, 542.0, 1565.9999999999998, 2038.899999999999, 2107.0, 0.10422786105478594, 0.06402277793306677, 0.04712646451988857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 112.90909090909089, 99, 305, 103.0, 110.7, 275.8999999999996, 305.0, 0.10683345635367701, 0.07939478543471505, 0.05362538727127928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f20efab-e8d7-4f00-9a98-afd1f22085d5", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.3093562714041096, 1.180570419520548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 148.40909090909088, 99, 308, 102.0, 305.0, 307.55, 308.0, 0.10673290575484422, 0.1014265823153278, 0.05679661195796664], "isController": false}, {"data": ["login", 22, 0, 0.0, 3216.1363636363635, 1655, 4870, 3145.5, 4305.2, 4786.449999999999, 4870.0, 0.09787695976367164, 26.74740351472826, 0.18456202284982115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 138.35714285714283, 102, 326, 107.0, 316.0, 326.0, 326.0, 0.125387357371881, 0.10150988209110287, 0.04457128719078582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56b75cd5-60a7-4934-acc3-daa4de25a969", 3, 0, 0.0, 930.3333333333334, 199, 2137, 455.0, 2137.0, 2137.0, 2137.0, 0.06722990386123748, 0.030419780718463574, 0.043112926629764924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3fbaf8f-0c99-449b-9f2e-5255e9213b3e", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 0.6294915069686412, 2.4022756968641117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf238c88-15f8-49b4-94b2-4df4fd463e13", 3, 0, 0.0, 389.3333333333333, 248, 522, 398.0, 522.0, 522.0, 522.0, 0.035695163305372125, 0.029409003361294542, 0.022890453031114283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 703.5, 204, 1499, 507.5, 1320.8, 1472.4499999999996, 1499.0, 0.10667701110410706, 58.10053929471949, 0.22751259213014596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41e64ed5-a8c1-42f8-bebe-956da75e8f47", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1300561-f24c-4640-bf96-28c33e8b41b1", 3, 0, 0.0, 498.3333333333333, 220, 1035, 240.0, 1035.0, 1035.0, 1035.0, 0.03829363559776365, 0.02382133386306196, 0.024556791057159633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 357.93749999999994, 203, 1409, 215.5, 711.8000000000006, 1409.0, 1409.0, 0.08721674997683306, 6.648068021229102, 0.1947578133943124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 796.7499999999999, 98, 1312, 1139.5, 1312.0, 1312.0, 1312.0, 0.053031407851299936, 39.65782157334243, 0.08780090145107189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b6ee519-0b34-47c2-a39b-e8b1988d62dc", 1, 0, 0.0, 1128.0, 1128, 1128, 1128.0, 1128.0, 1128.0, 1128.0, 0.8865248226950354, 0.16016317597517732, 0.6112173093971632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d41255ee-b383-4f88-8ec9-10daa750883e", 3, 0, 0.0, 295.0, 199, 482, 204.0, 482.0, 482.0, 482.0, 0.022448200776707748, 0.026533013352938097, 0.014395493336625736], "isController": false}, {"data": ["register", 24, 6, 25.0, 1177.5416666666667, 317, 2143, 1143.5, 1851.5, 2075.75, 2143.0, 0.09789365485960419, 0.030878564960597807, 0.044166863813610485], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35fc13eb-ea29-4b52-a99c-865e4924e316", 3, 0, 0.0, 383.6666666666667, 209, 517, 425.0, 517.0, 517.0, 517.0, 0.061566245279921196, 0.02785712270152684, 0.03948095807338696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 361.5, 205, 1173, 305.0, 792.0, 1173.0, 1173.0, 0.12114708987383396, 10.52677452092816, 0.2702486003184438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 133.74999999999997, 101, 307, 106.5, 298.6, 307.0, 307.0, 0.10139224222606667, 0.07871760993137013, 0.03604177360379714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 476.0833333333333, 202, 1218, 407.5, 1155.3000000000002, 1218.0, 1218.0, 0.06109513020899625, 12.260740571621312, 0.1347990861186773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 124.4, 101, 287, 105.0, 270.70000000000005, 287.0, 287.0, 0.054373830962634304, 0.04040867711187959, 0.027293114369916046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 141.20000000000002, 96, 305, 102.0, 304.9, 305.0, 305.0, 0.05437323966636581, 0.014549089520101787, 0.03100973824722425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 131.7, 99, 403, 101.5, 373.4000000000001, 403.0, 403.0, 0.054373535312892504, 0.014655366939803058, 0.03196569165855594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 130.4, 98, 391, 102.0, 362.2000000000001, 391.0, 391.0, 0.05437323966636581, 0.014655287253825158, 0.03201861671759627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 2.705705275229358, 5.67122993119266], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1206.4561403508774, 795, 4152, 1104.0, 1676.4, 1729.4999999999995, 4152.0, 0.25193815581269946, 301.4056222264703, 0.49747944438796704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da15ee08-1c76-4e64-8165-349352f7a1dc", 3, 0, 0.0, 355.0, 247, 541, 277.0, 541.0, 541.0, 541.0, 0.048320072157974424, 0.04028245598846761, 0.030986504606513546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1177.5416666666667, 317, 2143, 1143.5, 1851.5, 2075.75, 2143.0, 0.10049914575726107, 0.03170041414022981, 0.04534238802720177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 139.3, 100, 300, 101.5, 298.2, 300.0, 300.0, 0.0562284223429259, 0.015155316959616747, 0.033111072922640934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 100.5, 97, 102, 101.0, 102.0, 102.0, 102.0, 0.05622968702556202, 0.015155657831108511, 0.03305690584901204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 397.9375, 98, 4658, 101.0, 1603.200000000003, 4658.0, 4658.0, 0.09793779725651745, 5.532535098840661, 0.05705067974952408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 157.1875, 96, 603, 101.0, 393.7000000000002, 603.0, 603.0, 0.09805483716768602, 1.8267381560481448, 0.05721461446063711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 139.5, 99, 300, 102.0, 298.2, 300.0, 300.0, 0.05622937084956957, 0.015045749621857483, 0.03206831306264515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 116.06249999999999, 99, 301, 103.0, 173.60000000000014, 301.0, 301.0, 0.09805123176859909, 0.07286815173428116, 0.04921712219634759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0852038-33f2-411b-b443-937f43a3bb9a", 3, 0, 0.0, 415.3333333333333, 205, 526, 515.0, 526.0, 526.0, 526.0, 0.02087319533831971, 0.024671410245260046, 0.013385480083492782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 102.7, 99, 106, 103.0, 105.8, 106.0, 106.0, 0.056227790022940934, 0.04178647285884575, 0.028223714913859024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 139.12500000000003, 99, 305, 102.0, 303.6, 305.0, 305.0, 0.09805363533853018, 0.03544150564421239, 0.05540652807398147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 125.8, 103, 311, 105.5, 290.70000000000005, 311.0, 311.0, 0.054705792249283354, 0.043059441946213264, 0.019446199588612444], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 531.9285714285714, 99, 1035, 496.0, 999.5, 1035.0, 1035.0, 0.08400840084008401, 0.015698835508550855, 0.057175639438943895], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b7d638f-d65e-4cba-8eff-6a8de3545842", 1, 0, 0.0, 928.0, 928, 928, 928.0, 928.0, 928.0, 928.0, 1.0775862068965516, 0.19468110183189655, 0.7429451778017241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1685.181818181818, 951, 3434, 1664.0, 2412.7999999999997, 3288.199999999998, 3434.0, 0.10086468543972418, 0.05220535476860724, 0.046393815275498136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 243.5, 201, 404, 206.0, 402.5, 404.0, 404.0, 0.05619556055071649, 0.08709214315819051, 0.1263851327620118], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1210.2931034482754, 514, 5227, 922.5, 1911.6000000000001, 2419.399999999999, 5227.0, 0.2782468529321461, 98.6720674565719, 1.0081529251300083], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 175.94736842105257, 100, 425, 104.0, 411.6, 419.1, 425.0, 0.2531656813932107, 0.18814363626975913, 0.12237989481410089], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 653.3508771929822, 487, 911, 603.0, 885.6, 903.6999999999999, 911.0, 0.25299825120507063, 74.3898861868503, 0.12724033141661267], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 231.77192982456137, 97, 4048, 106.0, 310.2, 420.79999999999956, 4048.0, 0.25356210269710006, 0.44868606453822785, 0.12331438197573812], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 970.2280701754383, 689, 1393, 909.0, 1270.8, 1298.0, 1393.0, 0.2524424918288351, 227.1481978941535, 0.12671429765627076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 109.66666666666667, 103, 128, 106.0, 126.2, 128.0, 128.0, 0.06303679773067529, 0.04709292017965487, 0.022407611693325977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, 6.358381502890174, 186.93641618497108, 98, 1380, 108.0, 325.79999999999995, 468.9999999999983, 1317.0999999999992, 0.7261920253201751, 1.619806008609363, 0.34712939676739607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 107.1, 104, 118, 106.0, 117.10000000000001, 118.0, 118.0, 0.05598007109469029, 0.04335175427547793, 0.019899165896940692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f20efab-e8d7-4f00-9a98-afd1f22085d5", 3, 0, 0.0, 1043.3333333333333, 199, 2489, 442.0, 2489.0, 2489.0, 2489.0, 0.031444892825323624, 0.026214313322152925, 0.0201648564016561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4f2b383-a755-4504-afe2-35d0f41e9b4a", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 108.5, 100, 127, 105.5, 124.2, 127.0, 127.0, 0.08657821259280103, 0.07026024869591567, 0.030775849007597236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56b75cd5-60a7-4934-acc3-daa4de25a969", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc63779d-3d2a-4fe4-9e5e-583715386ce7", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.9337308114035087, 1.7446774488304093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf2affc8-20f7-4db7-bdba-7da0dcde894c", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 298.9, 205, 691, 211.5, 663.0000000000001, 691.0, 691.0, 0.05434310059994783, 0.08422119204308322, 0.12221890691570299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 566.125, 200, 4761, 209.0, 1853.200000000003, 4761.0, 4761.0, 0.09787429270530662, 7.460435703089158, 0.2185564497629607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3fbaf8f-0c99-449b-9f2e-5255e9213b3e", 3, 0, 0.0, 453.6666666666667, 329, 522, 510.0, 522.0, 522.0, 522.0, 0.10364842454394693, 0.045886021282476507, 0.06646725141652847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 128.66666666666666, 103, 422, 106.0, 240.2000000000001, 422.0, 422.0, 0.08095112171270986, 0.06711670149813542, 0.028775594046314835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b6ee519-0b34-47c2-a39b-e8b1988d62dc", 3, 0, 0.0, 524.0, 206, 964, 402.0, 964.0, 964.0, 964.0, 0.01916798180319594, 0.02642461033090326, 0.012291967497492189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 118.86363636363637, 100, 306, 106.0, 131.9, 280.19999999999965, 306.0, 0.10203419072972998, 0.07921599768567904, 0.036269966235958705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1300561-f24c-4640-bf96-28c33e8b41b1", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 119.91666666666667, 99, 299, 102.5, 245.30000000000018, 299.0, 299.0, 0.06118578042462932, 0.0454710731476005, 0.03071239368970651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 202.5, 99, 306, 200.0, 306.0, 306.0, 306.0, 0.061187028349989805, 0.03168898506016724, 0.03403926805017336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 285.0833333333333, 98, 919, 103.5, 915.4, 919.0, 919.0, 0.061128119444345395, 9.180928170002394, 0.03506111538441946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d41255ee-b383-4f88-8ec9-10daa750883e", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 294.83333333333337, 97, 904, 198.5, 875.5000000000001, 904.0, 904.0, 0.06118640438094655, 3.0122154513517096, 0.035154298089964404], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.45558086560364464], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15186028853454822], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07593014426727411], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0630220197418374], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 23, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
