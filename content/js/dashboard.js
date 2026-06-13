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

    var data = {"OkPercent": 98.1904012588513, "KoPercent": 1.8095987411487018};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7155346334902488, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02fd99ec-0993-4a25-af39-492166d2ab09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d8eb341-3eee-4b56-b75b-84a99e0087ea"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cc2ba62-cb9f-4fee-b20d-4a2dd65e103c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98499c6c-371e-4450-8e56-3bdd1810744c"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8938986a-098e-4317-8965-adddf6aaa45d"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/598d8015-05a7-45de-8592-0cfacf7cc029"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d29df996-cec9-4be9-ae57-1003ce854948"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae36bcce-1c1e-443a-997f-bb7d8af8e3f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8938986a-098e-4317-8965-adddf6aaa45d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a44e68c-0ef3-42ad-8d13-c6b479a4b832"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02909b2c-6c2c-40fe-9c82-e43e0cc8e6c6"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c190a8a-97c5-4121-a11e-342f4eeaa6b6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02fd99ec-0993-4a25-af39-492166d2ab09"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5cc2ba62-cb9f-4fee-b20d-4a2dd65e103c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d29df996-cec9-4be9-ae57-1003ce854948"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.18867924528301888, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02909b2c-6c2c-40fe-9c82-e43e0cc8e6c6"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/501f6c4a-91a3-47dc-b8f1-3bc8c9f11372"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6d29788-0b3a-4ee0-80e8-f41a8eaa2199"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=598d8015-05a7-45de-8592-0cfacf7cc029"], "isController": false}, {"data": [0.2830188679245283, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7c638803-e357-4ee1-9a70-753f9fc4d635"], "isController": false}, {"data": [0.9424242424242424, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae36bcce-1c1e-443a-997f-bb7d8af8e3f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c638803-e357-4ee1-9a70-753f9fc4d635"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=501f6c4a-91a3-47dc-b8f1-3bc8c9f11372"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95022287-082b-44ad-a38a-53f0575d6ab5"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa32a6ec-7252-4c67-9c78-3d51e145f8f5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a44e68c-0ef3-42ad-8d13-c6b479a4b832"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d8eb341-3eee-4b56-b75b-84a99e0087ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c190a8a-97c5-4121-a11e-342f4eeaa6b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 23, 1.8095987411487018, 502.98190401258853, 140, 2822, 165.0, 1443.6, 1701.5999999999988, 2143.84, 4.970707631659223, 714.3523064501384, 3.6287849215676307], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2451.3962264150946, 1825, 3475, 2431.0, 2982.6, 3111.1, 3475.0, 0.2577281988689136, 310.13377951261407, 1.2672475403368946], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/02fd99ec-0993-4a25-af39-492166d2ab09", 3, 0, 0.0, 688.6666666666666, 250, 1242, 574.0, 1242.0, 1242.0, 1242.0, 0.022400262829750536, 0.02246588859975957, 0.01436475187975539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d8eb341-3eee-4b56-b75b-84a99e0087ea", 1, 0, 0.0, 1132.0, 1132, 1132, 1132.0, 1132.0, 1132.0, 1132.0, 0.8833922261484098, 0.15959722835689047, 0.6090575309187279], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 638.3333333333334, 151, 1180, 622.0, 1115.8, 1180.0, 1180.0, 0.08164376105592598, 0.01599388522247925, 0.05497133963804599], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 638.3333333333334, 151, 1180, 622.0, 1115.8, 1180.0, 1180.0, 0.08100970496265453, 0.015869674624520016, 0.05454442504712064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cc2ba62-cb9f-4fee-b20d-4a2dd65e103c", 1, 0, 0.0, 1458.0, 1458, 1458, 1458.0, 1458.0, 1458.0, 1458.0, 0.6858710562414265, 0.12391225137174211, 0.47287594307270236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 248.28571428571425, 141, 469, 154.0, 463.8, 468.5, 469.0, 0.14824227022448114, 0.05026890971339828, 0.08395156095580969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 177.76190476190476, 141, 469, 148.0, 380.4000000000002, 465.59999999999997, 469.0, 0.14823599169878446, 0.11016366179958494, 0.07440751927067893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 250.57142857142858, 141, 919, 147.0, 437.6, 870.9999999999993, 919.0, 0.1482527356159548, 2.113828648958701, 0.08669448243911047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 258.2857142857143, 140, 1584, 146.0, 466.8, 1472.3999999999983, 1584.0, 0.1482506424194505, 6.390254869768871, 0.08654848237229266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98499c6c-371e-4450-8e56-3bdd1810744c", 2, 0, 0.0, 266.0, 256, 276, 266.0, 276.0, 276.0, 276.0, 0.02335548211553957, 0.03282083863697407, 0.014517348014200133], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 283.0, 147, 467, 255.5, 457.2, 467.0, 467.0, 0.0861178091629349, 0.16573893789829486, 0.05565804939125474], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 146.0, 142, 157, 146.0, 151.6, 157.0, 157.0, 0.08049239883447007, 0.05981905811819504, 0.04040341113370861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 166.99999999999997, 140, 427, 145.0, 275.2000000000001, 427.0, 427.0, 0.08049412661189488, 0.029598361139582183, 0.045456123322368244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1116.5, 844, 1259, 1148.5, 1259.0, 1259.0, 1259.0, 0.08964087623956524, 26.35739397165107, 0.05112331223037705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8938986a-098e-4317-8965-adddf6aaa45d", 3, 0, 0.0, 369.3333333333333, 261, 564, 283.0, 564.0, 564.0, 564.0, 0.02885031494927153, 0.024051320502957156, 0.018501015771505504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1611.375, 1408, 1729, 1643.0, 1729.0, 1729.0, 1729.0, 0.08928172849426365, 80.3358562396768, 0.05083129659390206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 276.5, 142, 579, 150.0, 579.0, 579.0, 579.0, 0.09033321665292848, 0.15984744978037735, 0.05001849008028364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 151.74999999999997, 145, 159, 152.5, 159.0, 159.0, 159.0, 0.04913039206052864, 0.036511941755920214, 0.024661153827257542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/598d8015-05a7-45de-8592-0cfacf7cc029", 3, 0, 0.0, 375.0, 241, 478, 406.0, 478.0, 478.0, 478.0, 0.019139977032027564, 0.026386003493045807, 0.01227400870868955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 183.125, 143, 420, 150.0, 420.0, 420.0, 420.0, 0.049130995516796665, 0.022370436191119572, 0.027504241386722347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 328.125, 141, 1586, 149.5, 1586.0, 1586.0, 1586.0, 0.04913431479127129, 5.5379806813854655, 0.028357793009415364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 309.125, 141, 1157, 150.0, 1157.0, 1157.0, 1157.0, 0.04913612549366451, 1.8175448021656748, 0.028406822551024797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 217.25, 143, 429, 147.0, 429.0, 429.0, 429.0, 0.09065977652365087, 0.0673750878266585, 0.050907589356542236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 907.85, 141, 1747, 880.5, 1720.5, 1745.75, 1747.0, 0.10068364192869583, 45.31122768913422, 0.05486471894161356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 246.00000000000006, 140, 1299, 146.0, 796.2000000000003, 1299.0, 1299.0, 0.0804928307718726, 4.848755019063385, 0.04685982374753155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 694.3, 144, 1268, 790.0, 1232.7, 1266.3, 1268.0, 0.10083898031623104, 14.838593819326798, 0.05504784179372378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 241.73333333333332, 140, 717, 146.0, 547.2, 717.0, 717.0, 0.08049542249364086, 1.598138090568083, 0.04693994135908471], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 666.0714285714284, 150, 1458, 572.0, 1295.0, 1458.0, 1458.0, 0.09440641963653529, 0.018596800296705893, 0.0641273517313463], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d29df996-cec9-4be9-ae57-1003ce854948", 3, 0, 0.0, 980.0, 453, 1466, 1021.0, 1466.0, 1466.0, 1466.0, 0.0172775230942892, 0.023818460385519134, 0.0110796616197102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 519.625, 291, 1743, 309.0, 1743.0, 1743.0, 1743.0, 0.04908276581385361, 7.406566593425977, 0.10881850496963004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae36bcce-1c1e-443a-997f-bb7d8af8e3f0", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8938986a-098e-4317-8965-adddf6aaa45d", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.17354857108549473, 0.6622988712776178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 554.4583333333334, 158, 1248, 534.0, 974.5, 1201.25, 1248.0, 0.10124318190446863, 0.06218941544717848, 0.04577694650563376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 176.75, 142, 436, 148.5, 397.3000000000006, 435.4, 436.0, 0.10084304788027913, 0.07494292913759025, 0.050618483018030735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 235.35, 141, 467, 146.5, 462.9000000000001, 466.95, 467.0, 0.10084406482256486, 0.10271519493157731, 0.05327796784082773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a44e68c-0ef3-42ad-8d13-c6b479a4b832", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 0.580913384244373, 2.216891077170418], "isController": false}, {"data": ["login", 24, 0, 0.0, 3110.7083333333335, 1927, 5103, 3003.5, 4524.5, 4999.5, 5103.0, 0.10224556829364928, 40.91124099493458, 0.21078163541786485], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 153.06666666666666, 146, 173, 151.0, 165.8, 173.0, 173.0, 0.07822359432201004, 0.06332749970014288, 0.027806043294152004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02909b2c-6c2c-40fe-9c82-e43e0cc8e6c6", 3, 0, 0.0, 834.6666666666666, 414, 1354, 736.0, 1354.0, 1354.0, 1354.0, 0.020330988492660514, 0.024030540109651798, 0.013037775823743884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1103.0499999999997, 293, 1905, 1172.5, 1865.8, 1903.1, 1905.0, 0.10060868252930227, 60.25944267505911, 0.21340044770863725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c190a8a-97c5-4121-a11e-342f4eeaa6b6", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02fd99ec-0993-4a25-af39-492166d2ab09", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 527.0952380952381, 285, 1741, 317.0, 925.8000000000001, 1660.699999999999, 1741.0, 0.14807398058115512, 8.654174981138196, 0.33121775204306836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 1182.7692307692307, 147, 2038, 1713.0, 1977.2, 2038.0, 2038.0, 0.13897797733589906, 102.33182746017745, 0.22808382443339748], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1074.625, 161, 2146, 1138.5, 1842.0, 2090.5, 2146.0, 0.10421054002770264, 0.03256579375865708, 0.04701686473906115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 158.7142857142857, 148, 173, 158.0, 172.5, 173.0, 173.0, 0.06837072560874363, 0.05308078794819453, 0.024303656368733093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 452.06666666666666, 288, 1447, 302.0, 944.2000000000003, 1447.0, 1447.0, 0.08042938568035217, 6.531106986498587, 0.17951566596871835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cc2ba62-cb9f-4fee-b20d-4a2dd65e103c", 3, 0, 0.0, 396.3333333333333, 330, 471, 388.0, 471.0, 471.0, 471.0, 0.020875519278542053, 0.0246741570639278, 0.013386970370679638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d29df996-cec9-4be9-ae57-1003ce854948", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 504.57142857142856, 291, 1395, 444.0, 1009.0, 1395.0, 1395.0, 0.10222186525697846, 8.882314282493775, 0.22803119774819836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 150.55555555555554, 145, 158, 147.0, 158.0, 158.0, 158.0, 0.046211669987060736, 0.03434285240249338, 0.023196092161473843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 184.55555555555554, 143, 465, 148.0, 465.0, 465.0, 465.0, 0.046209771826415565, 0.020076380902014745, 0.02592279951633772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 337.3333333333333, 142, 1551, 153.0, 1551.0, 1551.0, 1551.0, 0.046211669987060736, 4.631220644357555, 0.026726150285485428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 266.55555555555554, 141, 1235, 145.0, 1235.0, 1235.0, 1235.0, 0.046211669987060736, 1.5208232512733881, 0.02677127886945717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 151.5, 150, 153, 151.5, 153.0, 153.0, 153.0, 0.15511090429657207, 0.045745598728090586, 0.09588398673801768], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1690.7547169811314, 1133, 2790, 1586.0, 2323.2000000000003, 2461.9, 2790.0, 0.2633710500554073, 315.083338457888, 0.5200549445430015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1074.625, 161, 2146, 1138.5, 1842.0, 2090.5, 2146.0, 0.10263691336589205, 0.032074035426841264, 0.04630688864750207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 146.5, 141, 156, 144.5, 156.0, 156.0, 156.0, 0.05970238361766594, 0.016091658084449022, 0.03515677472798102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 183.75, 142, 432, 147.0, 432.0, 432.0, 432.0, 0.05969703753451235, 0.016090217147974033, 0.03509532870681293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 190.78571428571425, 142, 464, 145.5, 451.5, 464.0, 464.0, 0.0711801671717069, 0.019185279432999126, 0.04184615296617925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 231.5, 142, 462, 145.5, 461.5, 462.0, 462.0, 0.07117944337675279, 0.0191850843476404, 0.04191523862908392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 148.64285714285714, 142, 157, 147.0, 157.0, 157.0, 157.0, 0.07117763395376504, 0.05289665960821797, 0.03572783579319847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 181.24999999999997, 142, 424, 145.0, 424.0, 424.0, 424.0, 0.059703720288070444, 0.01597540953020635, 0.03404977797679018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 186.28571428571428, 140, 436, 144.5, 429.0, 436.0, 436.0, 0.07117871959651835, 0.019045868329537138, 0.04059411351988937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 187.75, 142, 447, 146.5, 447.0, 447.0, 447.0, 0.059697483004872806, 0.04436502399092599, 0.0299653381489303], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 675.4285714285714, 147, 1684, 569.0, 1484.0, 1684.0, 1684.0, 0.09195764693518299, 0.017755215312261895, 0.06257943662804445], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 263.37500000000006, 149, 467, 158.0, 467.0, 467.0, 467.0, 0.06408510501946585, 0.05044198695868113, 0.02278025217488825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1579.9583333333335, 1074, 2822, 1553.0, 2135.0, 2657.75, 2822.0, 0.10031893060019981, 0.05192288400205654, 0.04614278936786534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 375.25, 289, 879, 302.0, 879.0, 879.0, 879.0, 0.05962718105048186, 0.09241048469444796, 0.1341029276945896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02909b2c-6c2c-40fe-9c82-e43e0cc8e6c6", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["addBook", 56, 6, 10.714285714285714, 1444.8214285714287, 753, 3744, 1195.5, 2417.1000000000004, 2503.9, 3744.0, 0.26331380422618655, 85.40660658302143, 0.9568222299740448], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 249.88679245283018, 141, 621, 156.0, 584.2, 617.2, 621.0, 0.26558029294007407, 0.19736972942128553, 0.12838109863802408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/501f6c4a-91a3-47dc-b8f1-3bc8c9f11372", 3, 0, 0.0, 753.0, 235, 1284, 740.0, 1284.0, 1284.0, 1284.0, 0.03787400580734756, 0.03157400028405505, 0.02428769252619619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6d29788-0b3a-4ee0-80e8-f41a8eaa2199", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.663900077962578, 1.2404983108108107], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 931.8867924528304, 695, 1393, 861.0, 1248.4, 1325.4999999999998, 1393.0, 0.2651537891977347, 77.96401795854096, 0.1333537123406576], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 231.05660377358492, 141, 627, 150.0, 452.40000000000003, 467.09999999999997, 627.0, 0.265813388970249, 0.47036509845126084, 0.12927252705779685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=598d8015-05a7-45de-8592-0cfacf7cc029", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1439.132075471698, 980, 2179, 1406.0, 1784.4, 1876.6, 2179.0, 0.2641731380778164, 237.7034540092635, 0.13260253219921644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 177.07142857142856, 143, 467, 151.0, 325.0, 467.0, 467.0, 0.10547807939485719, 0.07879954173541577, 0.03749416103489064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c638803-e357-4ee1-9a70-753f9fc4d635", 3, 0, 0.0, 793.0, 250, 1684, 445.0, 1684.0, 1684.0, 1684.0, 0.035232771174895476, 0.022651277041151878, 0.022593932035984404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, 3.6363636363636362, 226.24848484848482, 142, 1598, 158.0, 386.4000000000001, 468.39999999999975, 1380.860000000001, 0.7152517686225551, 1.5490306103373388, 0.3441260151698398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 161.55555555555554, 147, 199, 157.0, 199.0, 199.0, 199.0, 0.045278690339036774, 0.03506445453013297, 0.016095159456454476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae36bcce-1c1e-443a-997f-bb7d8af8e3f0", 3, 0, 0.0, 439.0, 243, 776, 298.0, 776.0, 776.0, 776.0, 0.02320239448711107, 0.02327037025221003, 0.014879139693883076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c638803-e357-4ee1-9a70-753f9fc4d635", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 172.52380952380955, 143, 435, 159.0, 189.2, 410.49999999999966, 435.0, 0.14714537963507945, 0.11941192429370218, 0.05230558416715715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=501f6c4a-91a3-47dc-b8f1-3bc8c9f11372", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.2086190098152425, 0.7961352482678984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 526.7777777777778, 294, 1698, 310.0, 1698.0, 1698.0, 1698.0, 0.0461746839599409, 6.201496540746593, 0.10253525469186094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95022287-082b-44ad-a38a-53f0575d6ab5", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 427.7857142857143, 292, 611, 312.0, 610.0, 611.0, 611.0, 0.07112520067467334, 0.11023016940498688, 0.15996224331423112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa32a6ec-7252-4c67-9c78-3d51e145f8f5", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a44e68c-0ef3-42ad-8d13-c6b479a4b832", 3, 0, 0.0, 376.6666666666667, 250, 504, 376.0, 504.0, 504.0, 504.0, 0.07332632659545865, 0.033178253244689954, 0.047022416469092956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d8eb341-3eee-4b56-b75b-84a99e0087ea", 3, 0, 0.0, 364.3333333333333, 262, 477, 354.0, 477.0, 477.0, 477.0, 0.04987531172069826, 0.03206501974231089, 0.031983842477140485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 187.625, 147, 430, 152.5, 430.0, 430.0, 430.0, 0.04575821359934108, 0.037938206392422444, 0.016265614990390774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 167.35000000000002, 143, 452, 153.0, 162.60000000000002, 437.5499999999998, 452.0, 0.09644038537577995, 0.07487315075561042, 0.03428154323904678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c190a8a-97c5-4121-a11e-342f4eeaa6b6", 3, 0, 0.0, 474.3333333333333, 365, 591, 467.0, 591.0, 591.0, 591.0, 0.04936321453253036, 0.03128586546055879, 0.031655446819363546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 149.28571428571428, 142, 159, 146.5, 158.5, 159.0, 159.0, 0.10233768512156256, 0.07605368982178623, 0.05136872085203433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 251.35714285714286, 142, 464, 154.0, 450.0, 464.0, 464.0, 0.1023391812865497, 0.03836291575292397, 0.057751393457602336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 269.07142857142856, 141, 1253, 150.0, 858.5, 1253.0, 1253.0, 0.10234741097602877, 6.603642574055663, 0.0595408347893471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 319.2142857142857, 142, 1116, 155.5, 789.5, 1116.0, 1116.0, 0.10234890742541324, 2.1751855759319234, 0.05964165545702442], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 34.78260869565217, 0.6294256490952006], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.043478260869565, 0.23603461841070023], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.15735641227380015], "isController": false}, {"data": ["401/Unauthorized", 10, 43.47826086956522, 0.7867820613690008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 23, "401/Unauthorized", 10, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
