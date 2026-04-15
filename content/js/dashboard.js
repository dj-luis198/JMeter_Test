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

    var data = {"OkPercent": 98.7082066869301, "KoPercent": 1.2917933130699089};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7990131578947368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8ee27b0-8051-4034-9139-067fe98d445b"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86433af7-4be4-4e40-b81b-0408315ceae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1996d1f0-ca76-491d-a26b-86631dd52cae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eee082e5-cdf3-4920-9452-c1dfc0f04a43"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f28b3715-48a5-4e9c-84db-9de86f228566"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f5ca250-fe5b-4ca4-bd8f-5ce51b31641e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/467037bb-7b02-4e3d-961e-b84b02b85171"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93123651-f067-41a2-903d-b085143e8427"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ccccada-4cf2-4676-a2b7-677105c771db"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46a0375c-a1bc-4a25-a9ea-234537a3c642"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d4746d9-ce5d-4864-a362-f59eeda65306"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=467037bb-7b02-4e3d-961e-b84b02b85171"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46a0375c-a1bc-4a25-a9ea-234537a3c642"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f5ca250-fe5b-4ca4-bd8f-5ce51b31641e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8ee27b0-8051-4034-9139-067fe98d445b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eee082e5-cdf3-4920-9452-c1dfc0f04a43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a55487f1-eeec-4712-b6f7-a30fc3efc6b8"], "isController": false}, {"data": [0.29838709677419356, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1996d1f0-ca76-491d-a26b-86631dd52cae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ca03681-dbd1-49a3-97d7-de392eab5659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86433af7-4be4-4e40-b81b-0408315ceae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/339367ab-89f9-44b1-b188-5bc6530a3fc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ca03681-dbd1-49a3-97d7-de392eab5659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f28b3715-48a5-4e9c-84db-9de86f228566"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93123651-f067-41a2-903d-b085143e8427"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fb8da18-a56c-4880-abc8-3d80e5661e6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ccccada-4cf2-4676-a2b7-677105c771db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c1f3b87-13de-40f3-a3f9-cdeafc60f577"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 17, 1.2917933130699089, 349.9551671732525, 98, 5016, 114.0, 993.4999999999998, 1210.1499999999999, 1601.579999999998, 5.098660632993294, 698.5706267168267, 3.7350629717035955], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1705.9285714285716, 1222, 2334, 1670.5, 2130.1, 2170.6, 2334.0, 0.2520240682985225, 303.2697942966053, 1.2392003748858016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d8ee27b0-8051-4034-9139-067fe98d445b", 3, 0, 0.0, 519.6666666666666, 199, 941, 419.0, 941.0, 941.0, 941.0, 0.02870978237984956, 0.028793893070415525, 0.01841089560166134], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 442.3636363636364, 386, 612, 416.0, 589.2, 612.0, 612.0, 0.07362193130404518, 0.013300837198484726, 0.05003990643321821], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 442.3636363636364, 386, 612, 416.0, 589.2, 612.0, 612.0, 0.07407706708688566, 0.013383063878001806, 0.0503492565356176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 135.15789473684208, 98, 315, 102.0, 308.0, 315.0, 315.0, 0.1304264257667701, 0.03489925845712403, 0.07438382094511108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 113.8421052631579, 101, 294, 104.0, 106.0, 294.0, 294.0, 0.13042194932764054, 0.09692490570149848, 0.0654657050336008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 113.21052631578948, 101, 306, 102.0, 110.0, 306.0, 306.0, 0.13024046502700776, 0.03510387533931069, 0.07669433633914617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 145.21052631578945, 101, 306, 103.0, 304.0, 306.0, 306.0, 0.13024046502700776, 0.03510387533931069, 0.07656714838501824], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 247.8181818181818, 180, 388, 199.0, 382.20000000000005, 388.0, 388.0, 0.07300917260695844, 0.18018954176788393, 0.04719928932207665], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/86433af7-4be4-4e40-b81b-0408315ceae2", 3, 0, 0.0, 304.6666666666667, 196, 489, 229.0, 489.0, 489.0, 489.0, 0.023971426060136317, 0.02404165484742187, 0.015372301216949396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 103.46666666666667, 101, 107, 103.0, 105.8, 107.0, 107.0, 0.09429632935821919, 0.07007764320469219, 0.04733233719738736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 129.4, 100, 306, 103.0, 305.4, 306.0, 306.0, 0.09429692214846107, 0.034673764081673705, 0.05325074887472339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 635.6, 587, 794, 599.0, 794.0, 794.0, 794.0, 0.046618307941894935, 13.707330408422996, 0.026587003748111956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1191.2, 905, 1403, 1203.0, 1403.0, 1403.0, 1403.0, 0.04635638791025404, 41.7115593274847, 0.026392357569998148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 229.6, 101, 335, 302.0, 335.0, 335.0, 335.0, 0.04673246597876477, 0.08269455893898608, 0.025876277548788695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1996d1f0-ca76-491d-a26b-86631dd52cae", 3, 0, 0.0, 261.6666666666667, 198, 381, 206.0, 381.0, 381.0, 381.0, 0.019134971712133488, 0.02637910325549652, 0.0122707989169606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 103.3076923076923, 99, 108, 103.0, 107.2, 108.0, 108.0, 0.0733278431461029, 0.05449461780682062, 0.03680714001669619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 132.0, 98, 306, 102.0, 301.6, 306.0, 306.0, 0.07333073855335376, 0.028093957829184505, 0.041347695581540965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 202.61538461538458, 100, 1205, 103.0, 841.3999999999996, 1205.0, 1205.0, 0.07332867038198597, 5.093726071233163, 0.04262449304505765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 156.30769230769232, 100, 602, 103.0, 481.5999999999999, 602.0, 602.0, 0.07332825676171137, 1.6767779458216996, 0.0426958622415884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 104.4, 101, 111, 103.0, 111.0, 111.0, 111.0, 0.04683402023229674, 0.034805360739040836, 0.026298400032783813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 681.578947368421, 98, 1502, 901.0, 1317.0, 1502.0, 1502.0, 0.09156185244084622, 43.373540356488846, 0.04968698797648306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 216.60000000000002, 101, 1211, 103.0, 667.4000000000003, 1211.0, 1211.0, 0.09417673834562863, 5.6730509829697064, 0.05482606733636791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 452.4210526315791, 100, 902, 596.0, 807.0, 902.0, 902.0, 0.09156096996800184, 14.18114524702186, 0.04977592410318439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 175.46666666666667, 101, 796, 104.0, 499.60000000000014, 796.0, 796.0, 0.09417851223064945, 1.8697990897646795, 0.0549190712272088], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 488.27272727272725, 180, 820, 521.0, 788.4000000000001, 820.0, 820.0, 0.07403070255136722, 0.013374687472659116, 0.0510406992199856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eee082e5-cdf3-4920-9452-c1dfc0f04a43", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 337.6923076923077, 201, 1308, 210.0, 949.9999999999997, 1308.0, 1308.0, 0.07328485258470037, 6.849006778848865, 0.16337699595523988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 488.9523809523811, 144, 1133, 492.0, 1008.4, 1120.6, 1133.0, 0.09099062796531958, 0.05589170409197852, 0.041141270261663046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 115.26315789473684, 99, 305, 104.0, 111.0, 305.0, 305.0, 0.09155788144700003, 0.06804252713004592, 0.04595776471070119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f28b3715-48a5-4e9c-84db-9de86f228566", 3, 0, 0.0, 289.3333333333333, 197, 394, 277.0, 394.0, 394.0, 394.0, 0.09101941747572816, 0.04118391611043689, 0.058368571753640776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 178.10526315789474, 100, 309, 104.0, 309.0, 309.0, 309.0, 0.09156096996800184, 0.09687881002062532, 0.048171159981109525], "isController": false}, {"data": ["login", 21, 0, 0.0, 2196.904761904762, 1050, 3281, 2203.0, 3128.0, 3265.7999999999997, 3281.0, 0.0910501990097207, 26.06037153223394, 0.1733230978637889], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 107.73333333333333, 103, 128, 105.0, 122.60000000000001, 128.0, 128.0, 0.09640536527992905, 0.07804692169634882, 0.03426909468934978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f5ca250-fe5b-4ca4-bd8f-5ce51b31641e", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/467037bb-7b02-4e3d-961e-b84b02b85171", 3, 0, 0.0, 615.6666666666667, 197, 1436, 214.0, 1436.0, 1436.0, 1436.0, 0.027951959898254865, 0.023029430502110374, 0.017924922200378283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93123651-f067-41a2-903d-b085143e8427", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ccccada-4cf2-4676-a2b7-677105c771db", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 808.8421052631579, 200, 1606, 1005.0, 1425.0, 1606.0, 1606.0, 0.09151334168191888, 57.689166769518835, 0.19349220480926693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46a0375c-a1bc-4a25-a9ea-234537a3c642", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 293.2105263157895, 206, 600, 210.0, 421.0, 600.0, 600.0, 0.13014857487310513, 0.20170487140978308, 0.2927071952468371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1296.2, 1008, 1507, 1305.0, 1507.0, 1507.0, 1507.0, 0.0463117335408099, 55.40493387842244, 0.10442753197825201], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1265.238095238095, 194, 5016, 961.0, 3756.800000000002, 4943.199999999999, 5016.0, 0.0896631228384783, 0.02831993723581401, 0.04045347924939157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 120.73333333333333, 101, 318, 105.0, 199.20000000000007, 318.0, 318.0, 0.08159224547299024, 0.06334554213967504, 0.029003493507977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 348.40000000000003, 205, 1315, 209.0, 772.0000000000003, 1315.0, 1315.0, 0.09411587546587359, 7.642490945268482, 0.21006344782529585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 465.2857142857143, 209, 988, 409.5, 799.0, 988.0, 988.0, 0.07354524871427146, 6.390531139517963, 0.16406089940585944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 118.23076923076923, 99, 305, 103.0, 224.99999999999994, 305.0, 305.0, 0.06337135614702154, 0.04709531448035488, 0.03180945025348543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 149.69230769230768, 98, 305, 105.0, 304.2, 305.0, 305.0, 0.06337259184151002, 0.01695711930134155, 0.036142181284611184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 149.0, 100, 305, 102.0, 304.6, 305.0, 305.0, 0.06337228291337009, 0.017080810628994282, 0.037255971009617965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 150.07692307692307, 99, 306, 105.0, 304.4, 306.0, 306.0, 0.06337166506612589, 0.017080644099854245, 0.037317494174681554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d4746d9-ce5d-4864-a362-f59eeda65306", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=467037bb-7b02-4e3d-961e-b84b02b85171", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1180.4285714285713, 807, 1907, 1103.0, 1692.1000000000001, 1743.85, 1907.0, 0.24371349737572787, 291.5660713819426, 0.48123895673215017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1265.238095238095, 194, 5016, 961.0, 3756.800000000002, 4943.199999999999, 5016.0, 0.0899989714403264, 0.02842601441697809, 0.04060500469280351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 142.4, 100, 306, 102.5, 305.6, 306.0, 306.0, 0.04550335814783131, 0.012264577000782657, 0.02679543453431863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 123.80000000000001, 101, 305, 102.0, 286.00000000000006, 305.0, 305.0, 0.04550356520433376, 0.012264632808980583, 0.026751119387704025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46a0375c-a1bc-4a25-a9ea-234537a3c642", 3, 0, 0.0, 587.0, 388, 895, 478.0, 895.0, 895.0, 895.0, 0.0323631577811819, 0.02697983303307515, 0.020753717717750114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 215.4, 99, 1204, 102.0, 664.0000000000003, 1204.0, 1204.0, 0.08468021926531442, 5.1009963774507865, 0.04929755993948187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 167.6666666666667, 98, 599, 102.0, 477.20000000000005, 599.0, 599.0, 0.08468165343751059, 1.6812505821863675, 0.04938109178644416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f5ca250-fe5b-4ca4-bd8f-5ce51b31641e", 3, 0, 0.0, 512.0, 180, 938, 418.0, 938.0, 938.0, 938.0, 0.04973887092762994, 0.03197730145900688, 0.03189634626543977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 142.70000000000002, 100, 304, 103.0, 303.9, 304.0, 304.0, 0.04550397932299179, 0.012175869467284915, 0.025951488207643758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 118.06666666666668, 100, 306, 104.0, 192.60000000000008, 306.0, 306.0, 0.08467830711128423, 0.06292987471844463, 0.042504540874218844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 143.8, 102, 306, 104.0, 305.4, 306.0, 306.0, 0.04550294404047942, 0.03381615274883285, 0.02284034495781877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 141.46666666666664, 98, 303, 103.0, 301.2, 303.0, 303.0, 0.0846811753747142, 0.03113797386174387, 0.04782060645835098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 107.69999999999999, 103, 116, 106.5, 115.8, 116.0, 116.0, 0.04636777995706344, 0.03649651430214173, 0.016482296781612393], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 573.3636363636364, 381, 1436, 454.0, 1327.8000000000004, 1436.0, 1436.0, 0.07548930796892586, 0.013638205052979769, 0.05138285903744269], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1136.095238095238, 680, 1580, 1115.0, 1519.2, 1575.6, 1580.0, 0.08947630795188731, 0.04631097970166042, 0.04115560648958879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 309.09999999999997, 206, 612, 210.5, 611.4, 612.0, 612.0, 0.045481420839587026, 0.07048731921135216, 0.10228878143903215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8ee27b0-8051-4034-9139-067fe98d445b", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eee082e5-cdf3-4920-9452-c1dfc0f04a43", 3, 0, 0.0, 337.0, 202, 454, 355.0, 454.0, 454.0, 454.0, 0.02857959416976279, 0.028663323449557018, 0.018327409021625225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a55487f1-eeec-4712-b6f7-a30fc3efc6b8", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["addBook", 62, 12, 19.35483870967742, 1016.0645161290323, 513, 2434, 829.5, 1898.7000000000003, 2108.2, 2434.0, 0.2778923212076662, 76.11337964685265, 1.0126471820822203], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1996d1f0-ca76-491d-a26b-86631dd52cae", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 182.28571428571425, 102, 425, 104.0, 413.0, 414.0, 425.0, 0.24446355528586958, 0.18167652887944016, 0.11817330065088422], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 647.9107142857142, 490, 922, 604.0, 816.9, 910.35, 922.0, 0.24429505607880264, 71.83085784645183, 0.12286323621150717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ca03681-dbd1-49a3-97d7-de392eab5659", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 150.05357142857147, 101, 413, 104.0, 307.3, 308.15, 413.0, 0.24483443071622812, 0.4332421762283256, 0.11906986962566564], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 994.6785714285711, 700, 1492, 969.5, 1249.1000000000004, 1328.8999999999999, 1492.0, 0.24419385503606222, 219.72606000845957, 0.12257386864114841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 108.5, 104, 126, 106.5, 120.0, 126.0, 126.0, 0.07328922020269704, 0.054752200639710195, 0.026052027493927463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, 6.666666666666667, 161.8111111111112, 100, 903, 107.0, 302.40000000000015, 393.1499999999998, 667.2899999999993, 0.7421762256215726, 1.5243684415330063, 0.3585332871191193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 123.46153846153847, 103, 316, 106.0, 236.39999999999992, 316.0, 316.0, 0.062438162204739536, 0.0483529908480063, 0.022194815471216007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86433af7-4be4-4e40-b81b-0408315ceae2", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/339367ab-89f9-44b1-b188-5bc6530a3fc3", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ca03681-dbd1-49a3-97d7-de392eab5659", 3, 0, 0.0, 374.6666666666667, 249, 462, 413.0, 462.0, 462.0, 462.0, 0.019561305130278293, 0.02312080043230484, 0.012544196323778721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 127.84210526315789, 102, 307, 106.0, 305.0, 307.0, 307.0, 0.12455014454372038, 0.10107536144124182, 0.044273684193275605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f28b3715-48a5-4e9c-84db-9de86f228566", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 285.76923076923083, 202, 612, 210.0, 530.8, 612.0, 612.0, 0.06333924499619965, 0.09816345879782112, 0.1424514465100076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 354.26666666666665, 200, 1510, 210.0, 904.6000000000004, 1510.0, 1510.0, 0.0846286213997574, 6.87209750275043, 0.18888821793280486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 106.6923076923077, 100, 122, 106.0, 117.19999999999999, 122.0, 122.0, 0.07342143906020558, 0.06087382984581498, 0.026099027165932452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93123651-f067-41a2-903d-b085143e8427", 3, 0, 0.0, 300.3333333333333, 186, 524, 191.0, 524.0, 524.0, 524.0, 0.02073183373069348, 0.024504325610725266, 0.013294828271310597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fb8da18-a56c-4880-abc8-3d80e5661e6d", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 140.26315789473685, 103, 320, 106.0, 307.0, 320.0, 320.0, 0.0936694258064198, 0.07272186866807007, 0.03329655370462579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ccccada-4cf2-4676-a2b7-677105c771db", 3, 0, 0.0, 329.3333333333333, 194, 435, 359.0, 435.0, 435.0, 435.0, 0.018280421668393148, 0.02520103703308756, 0.011722796447504721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c1f3b87-13de-40f3-a3f9-cdeafc60f577", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 148.0, 102, 309, 104.5, 308.5, 309.0, 309.0, 0.0736617243157352, 0.054742746293236805, 0.03697473271317177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 202.49999999999997, 100, 306, 204.0, 305.5, 306.0, 306.0, 0.07358661144166684, 0.027584713301305637, 0.041525926797090176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 272.71428571428567, 101, 883, 301.0, 594.5, 883.0, 883.0, 0.0735881586140196, 4.748042891712397, 0.042810075532988524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 251.14285714285717, 102, 784, 300.0, 544.5, 784.0, 784.0, 0.07366366224158524, 1.565548080666972, 0.04292593710701752], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.3799392097264438], "isController": false}, {"data": ["401/Unauthorized", 12, 70.58823529411765, 0.9118541033434651], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 17, "401/Unauthorized", 12, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
