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

    var data = {"OkPercent": 99.84591679506934, "KoPercent": 0.15408320493066255};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8020625415834997, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ca7d393-6d9f-406c-af8b-593e87886a15"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69b6c3fd-8aa1-4124-9a21-35e403023eab"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e14aa63-7495-4f3e-b609-79a18ccad45c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c20a67b8-a727-425a-9cbb-194eb60845a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd8d6304-de63-4b7e-b34d-f8eb05da8f01"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33b2bcea-0a89-4275-b341-3fab283fe0d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00bc0e79-cb1d-4211-bf71-a4cf497c5ea0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c05c2b1-02d6-4078-88fc-63090028b6a1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be94216b-b898-44b8-9087-f468666aad0a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e40cfda2-d900-4dc3-879e-6ebedd402aae"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ec4f788-608c-4b06-be39-d34cbd3a085e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3f3d726-3f11-41b6-8d2c-06b768b7a63f"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33b2bcea-0a89-4275-b341-3fab283fe0d8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d5c23e5-dd85-4509-9b98-b65d1be9f0dc"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f96c50b-5e39-47e2-8db0-cc8d77f32b43"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc28e972-290f-4e4a-adf2-a3477534d88d"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac06c1c4-0532-4d2e-8d40-3eb3480695b7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c20a67b8-a727-425a-9cbb-194eb60845a4"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/278f0a38-156a-4e28-865c-e80dc82b98f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ca7d393-6d9f-406c-af8b-593e87886a15"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c05c2b1-02d6-4078-88fc-63090028b6a1"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6206896551724138, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4827586206896552, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e40cfda2-d900-4dc3-879e-6ebedd402aae"], "isController": false}, {"data": [0.9801136363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be94216b-b898-44b8-9087-f468666aad0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a62c5b3b-5194-495e-8dc5-993aac72e0ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00bc0e79-cb1d-4211-bf71-a4cf497c5ea0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd8d6304-de63-4b7e-b34d-f8eb05da8f01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f96c50b-5e39-47e2-8db0-cc8d77f32b43"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d5c23e5-dd85-4509-9b98-b65d1be9f0dc"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ec4f788-608c-4b06-be39-d34cbd3a085e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc28e972-290f-4e4a-adf2-a3477534d88d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 2, 0.15408320493066255, 345.4884437596308, 95, 3431, 133.5, 817.1000000000001, 1015.05, 1721.5199999999995, 5.022656126053964, 706.9353203031587, 3.665896719940487], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ca7d393-6d9f-406c-af8b-593e87886a15", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1560.5, 1207, 4250, 1438.5, 1907.3, 2016.349999999999, 4250.0, 0.2622618730019489, 315.5893134504167, 1.2895395806296999], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/69b6c3fd-8aa1-4124-9a21-35e403023eab", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 661.9166666666666, 482, 1454, 579.0, 1278.8000000000006, 1454.0, 1454.0, 0.0758629409533443, 0.013705707105828802, 0.051563092679226194], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 661.9166666666666, 482, 1454, 579.0, 1278.8000000000006, 1454.0, 1454.0, 0.07456287514446557, 0.013470831935279426, 0.05067945419975395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 115.73333333333333, 100, 295, 103.0, 181.60000000000008, 295.0, 295.0, 0.07775203321566859, 0.028590070547011473, 0.043907626049004514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 104.93333333333335, 101, 132, 103.0, 116.4, 132.0, 132.0, 0.07782868350187568, 0.05783948061028065, 0.039066350898402435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 210.39999999999998, 101, 707, 106.0, 470.0000000000001, 707.0, 707.0, 0.07758634066610459, 1.5403818314772957, 0.045243545139733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 156.46666666666667, 100, 700, 104.0, 461.20000000000016, 700.0, 700.0, 0.07758914993327333, 4.6738420870058865, 0.045169412675998055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e14aa63-7495-4f3e-b609-79a18ccad45c", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 314.24999999999994, 205, 724, 232.5, 660.4000000000002, 724.0, 724.0, 0.07645454777134994, 0.20353659027052168, 0.049426670531868805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c20a67b8-a727-425a-9cbb-194eb60845a4", 1, 0, 0.0, 1949.0, 1949, 1949, 1949.0, 1949.0, 1949.0, 1949.0, 0.513083632632119, 0.09269577347357619, 0.3537471139045664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd8d6304-de63-4b7e-b34d-f8eb05da8f01", 3, 0, 0.0, 454.33333333333337, 215, 928, 220.0, 928.0, 928.0, 928.0, 0.016629435208948856, 0.022925018915982552, 0.01066405838594702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33b2bcea-0a89-4275-b341-3fab283fe0d8", 1, 0, 0.0, 1506.0, 1506, 1506, 1506.0, 1506.0, 1506.0, 1506.0, 0.6640106241699867, 0.11996285690571049, 0.4578041998671979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 150.8125, 100, 308, 104.0, 306.6, 308.0, 308.0, 0.09432460634215073, 0.07009865764294598, 0.04734653091783737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00bc0e79-cb1d-4211-bf71-a4cf497c5ea0", 3, 0, 0.0, 542.6666666666666, 226, 724, 678.0, 724.0, 724.0, 724.0, 0.07569831697408594, 0.034251517120436024, 0.048543517069970475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 140.625, 99, 308, 102.5, 305.2, 308.0, 308.0, 0.09432571849668386, 0.042948599852616065, 0.05280490051584377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 585.7235122011953, 1.1360806772908367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 701.0, 701, 701, 701.0, 701.0, 701.0, 701.0, 1.4265335235378032, 1283.5973720577747, 0.8121768009985735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 5.878841362126246, 1.8395712209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 103.94444444444446, 100, 136, 102.5, 107.20000000000005, 136.0, 136.0, 0.08888669415569986, 0.06605739673094492, 0.04461695390237278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 137.72222222222223, 97, 307, 102.0, 302.5, 307.0, 307.0, 0.08890249865411494, 0.031206551990675117, 0.050287405108930254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 215.11111111111111, 96, 894, 113.0, 365.70000000000084, 894.0, 894.0, 0.08881345227757165, 4.462302582806209, 0.051788573409252386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 173.72222222222223, 99, 491, 102.0, 415.4000000000001, 491.0, 491.0, 0.08890205956437991, 1.4748616307354177, 0.05192706018175532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.215185072815534, 5.4516838592233015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 510.65, 101, 999, 498.5, 959.6000000000001, 997.25, 999.0, 0.0904727654357847, 40.71596930541796, 0.04930058897770299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 223.75, 101, 901, 103.5, 863.2, 901.0, 901.0, 0.09432571849668386, 10.631551676492263, 0.05443994104642594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 426.6499999999999, 100, 890, 411.0, 804.7000000000003, 886.25, 890.0, 0.09055223279168007, 13.32488485717649, 0.04943232239311441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 275.43749999999994, 100, 1052, 104.5, 811.9000000000002, 1052.0, 1052.0, 0.09421407793859597, 3.4849778228893102, 0.0544675138082508], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 915.1666666666667, 221, 1949, 613.5, 1913.0000000000002, 1949.0, 1949.0, 0.07412761068178869, 0.013392195289190341, 0.0511075128333426], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4c05c2b1-02d6-4078-88fc-63090028b6a1", 3, 0, 0.0, 635.6666666666667, 236, 1212, 459.0, 1212.0, 1212.0, 1212.0, 0.024965048931495905, 0.025038188723287395, 0.016009487758804338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be94216b-b898-44b8-9087-f468666aad0a", 3, 0, 0.0, 530.0, 211, 959, 420.0, 959.0, 959.0, 959.0, 0.07302290485115498, 0.0338491590195458, 0.0468278393739503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e40cfda2-d900-4dc3-879e-6ebedd402aae", 1, 0, 0.0, 1637.0, 1637, 1637, 1637.0, 1637.0, 1637.0, 1637.0, 0.6108735491753208, 0.11036289706780697, 0.421168677458766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 356.88888888888886, 203, 994, 392.5, 557.5000000000007, 994.0, 994.0, 0.08875345768678905, 6.028797222694752, 0.19834702848492916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ec4f788-608c-4b06-be39-d34cbd3a085e", 3, 0, 0.0, 624.3333333333334, 212, 1095, 566.0, 1095.0, 1095.0, 1095.0, 0.021829453754302224, 0.025801675319619584, 0.013998705695304484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3f3d726-3f11-41b6-8d2c-06b768b7a63f", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 565.421052631579, 106, 1287, 572.0, 1046.0, 1287.0, 1287.0, 0.07905401469572526, 0.048559546136339046, 0.03574414922277421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 114.54999999999998, 97, 339, 103.0, 108.50000000000001, 327.49999999999983, 339.0, 0.09055182280819313, 0.06729486050491697, 0.04545277043301882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 173.89999999999998, 97, 345, 103.5, 308.40000000000003, 343.2, 345.0, 0.09046990066404907, 0.09214854139902653, 0.04779708619067436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33b2bcea-0a89-4275-b341-3fab283fe0d8", 3, 0, 0.0, 415.3333333333333, 223, 585, 438.0, 585.0, 585.0, 585.0, 0.017561626674940146, 0.024210120106891768, 0.01126185043933336], "isController": false}, {"data": ["login", 19, 0, 0.0, 2469.052631578948, 1708, 4138, 2466.0, 3492.0, 4138.0, 4138.0, 0.07710381826224226, 4.96548827387885, 0.12306254463905268], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 112.37499999999999, 103, 198, 105.5, 145.50000000000006, 198.0, 198.0, 0.09313480098257215, 0.07539916993608624, 0.03310651128677369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d5c23e5-dd85-4509-9b98-b65d1be9f0dc", 3, 0, 0.0, 379.0, 246, 614, 277.0, 614.0, 614.0, 614.0, 0.028886428193153915, 0.028971056400751045, 0.018524174329594145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 647.15, 205, 1104, 722.0, 1062.9, 1102.15, 1104.0, 0.0904281774200841, 54.16184206436226, 0.1918066419496315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f96c50b-5e39-47e2-8db0-cc8d77f32b43", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc28e972-290f-4e4a-adf2-a3477534d88d", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 0.21688362845138057, 0.8276748199279712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 330.33333333333326, 204, 810, 240.0, 576.0000000000001, 810.0, 810.0, 0.0775442260569278, 6.296823384624531, 0.1730760873639099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 805.0, 805, 805, 805.0, 805.0, 805.0, 805.0, 1.2422360248447206, 1486.146156832298, 2.801096661490683], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1098.4761904761906, 561, 2498, 970.0, 1706.2, 2420.299999999999, 2498.0, 0.08327715430067018, 0.026721185113217274, 0.037572309850497684], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 474.0000000000001, 207, 1315, 309.5, 1240.1000000000001, 1315.0, 1315.0, 0.09415586326214757, 14.20807609044259, 0.20874741071376027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 120.93333333333331, 103, 309, 105.0, 204.60000000000008, 309.0, 309.0, 0.09034457420602177, 0.07014056298221416, 0.0321146728622968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac06c1c4-0532-4d2e-8d40-3eb3480695b7", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.9337308114035087, 1.7446774488304093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c20a67b8-a727-425a-9cbb-194eb60845a4", 3, 0, 0.0, 689.3333333333334, 229, 1155, 684.0, 1155.0, 1155.0, 1155.0, 0.08065817067268914, 0.03649572175619723, 0.05172415241705651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 348.7058823529411, 204, 593, 404.0, 529.0, 593.0, 593.0, 0.08745665750944018, 0.13554073776121245, 0.19669207250414134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 123.00000000000001, 102, 302, 103.0, 282.4000000000001, 302.0, 302.0, 0.04924652811976756, 0.036598249901506945, 0.0247194486851177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 144.89999999999998, 100, 304, 103.0, 303.9, 304.0, 304.0, 0.049247255696676304, 0.02057419529984192, 0.027672725515495652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 166.5, 100, 695, 103.0, 640.8000000000002, 695.0, 695.0, 0.049247255696676304, 4.443223031279395, 0.028528781327410532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 175.50000000000003, 100, 779, 102.0, 717.2000000000003, 779.0, 779.0, 0.04924774075989264, 1.4599935208441062, 0.028577155819851763], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1016.5862068965513, 791, 3431, 815.5, 1366.9, 1587.7499999999995, 3431.0, 0.26777717245773275, 320.3545926670606, 0.5287553151460309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1098.4761904761906, 561, 2498, 970.0, 1706.2, 2420.299999999999, 2498.0, 0.08195057989791299, 0.026295526473939713, 0.036973796789878714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 133.5, 100, 295, 101.5, 295.0, 295.0, 295.0, 0.030057710804745112, 0.008101492365341455, 0.017699999624278612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 135.16666666666669, 100, 304, 102.0, 304.0, 304.0, 304.0, 0.030057560227836306, 0.008101451780159004, 0.01767055786831783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 235.66666666666666, 100, 907, 104.0, 785.2, 907.0, 907.0, 0.09212740606075495, 11.074373975082606, 0.05310521180090653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 214.53333333333333, 98, 793, 103.0, 617.2, 793.0, 793.0, 0.09212740606075495, 3.633322559545013, 0.053195179970887733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 101.0, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.03005725907854463, 0.008042665026876198, 0.017142030568232484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 102.33333333333333, 100, 107, 102.0, 105.8, 107.0, 107.0, 0.09224127858710958, 0.06855040332499063, 0.046300798040795246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 136.33333333333334, 102, 304, 103.0, 304.0, 304.0, 304.0, 0.030057409652436154, 0.022337586665531164, 0.01508741070444549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 117.80000000000001, 98, 349, 101.0, 203.2000000000001, 349.0, 349.0, 0.09224354756384791, 0.04315508677043041, 0.05157471266134934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/278f0a38-156a-4e28-865c-e80dc82b98f1", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.6164786438223938, 1.1518912886100385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 105.83333333333334, 103, 112, 105.5, 112.0, 112.0, 112.0, 0.031187948976515476, 0.024548327026436983, 0.011086341237745734], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 767.4166666666665, 498, 1212, 646.0, 1194.9, 1212.0, 1212.0, 0.07382162235318725, 0.013336914194667617, 0.050247725371261244], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1512.6315789473683, 872, 3210, 1280.0, 2609.0, 3210.0, 3210.0, 0.07766704546383577, 0.04019876376546187, 0.03572380704440103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ca7d393-6d9f-406c-af8b-593e87886a15", 3, 0, 0.0, 353.0, 214, 606, 239.0, 606.0, 606.0, 606.0, 0.018248175182481754, 0.025156582649026763, 0.0117021175486618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 273.16666666666663, 205, 609, 206.5, 609.0, 609.0, 609.0, 0.030041758043680717, 0.0465588574368372, 0.06756461794394207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c05c2b1-02d6-4078-88fc-63090028b6a1", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["addBook", 59, 0, 0.0, 1096.7627118644068, 640, 2824, 882.0, 1761.0, 1835.0, 2824.0, 0.26001040041601664, 90.57560594266991, 0.9451371169253551], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 175.8448275862069, 95, 489, 103.5, 409.1, 416.34999999999997, 489.0, 0.2688982127541204, 0.19983548818934144, 0.12998497589188437], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 581.9137931034486, 466, 1069, 505.0, 785.1, 896.9, 1069.0, 0.26882717193815125, 79.04411445200971, 0.13520116557436315], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 164.4310344827586, 96, 446, 105.5, 307.2, 388.15, 446.0, 0.2690778516453183, 0.47614166716925466, 0.1308601270696958], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 833.7413793103448, 686, 3313, 704.5, 990.3000000000001, 1282.899999999999, 3313.0, 0.2683309353183654, 241.4446472749374, 0.13468955151722636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 129.0, 103, 308, 105.0, 290.4, 308.0, 308.0, 0.08681220477467126, 0.06485482094982765, 0.030859025915996426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e40cfda2-d900-4dc3-879e-6ebedd402aae", 3, 0, 0.0, 417.0, 235, 512, 504.0, 512.0, 512.0, 512.0, 0.02365389619093425, 0.028373895658721587, 0.015168676919316561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 0, 0.0, 193.05681818181822, 97, 1600, 109.5, 346.60000000000014, 435.55000000000007, 948.5799999999913, 0.7454847345057776, 1.5797166668255058, 0.3589639046139575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 127.19999999999999, 103, 316, 105.0, 295.9000000000001, 316.0, 316.0, 0.04948388309927457, 0.03832101493918431, 0.017589974070445255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be94216b-b898-44b8-9087-f468666aad0a", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a62c5b3b-5194-495e-8dc5-993aac72e0ea", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.8821434737569062, 1.648286429558011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00bc0e79-cb1d-4211-bf71-a4cf497c5ea0", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd8d6304-de63-4b7e-b34d-f8eb05da8f01", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 117.26666666666668, 103, 289, 105.0, 179.20000000000005, 289.0, 289.0, 0.08086645713269107, 0.06562502527076784, 0.02874549843388628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f96c50b-5e39-47e2-8db0-cc8d77f32b43", 3, 0, 0.0, 318.3333333333333, 205, 498, 252.0, 498.0, 498.0, 498.0, 0.018149918325367536, 0.025021127639300624, 0.011639107780264989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 319.79999999999995, 203, 1081, 207.5, 1013.5000000000002, 1081.0, 1081.0, 0.049221318737571615, 5.95723601837678, 0.1094405258805694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d5c23e5-dd85-4509-9b98-b65d1be9f0dc", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 358.66666666666663, 203, 1009, 209.0, 941.2, 1009.0, 1009.0, 0.0920691623547609, 14.809894202941917, 0.20392480289526826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ec4f788-608c-4b06-be39-d34cbd3a085e", 1, 0, 0.0, 1829.0, 1829, 1829, 1829.0, 1829.0, 1829.0, 1829.0, 0.5467468562055768, 0.09877750820120285, 0.3769563285948606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 112.77777777777779, 97, 260, 104.0, 125.00000000000021, 260.0, 260.0, 0.08949124228759502, 0.0741973288107111, 0.031811340031918545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 136.29999999999998, 101, 709, 105.5, 115.80000000000001, 679.3499999999996, 709.0, 0.08808593663978577, 0.06838703088733368, 0.03131179778992385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc28e972-290f-4e4a-adf2-a3477534d88d", 3, 0, 0.0, 484.66666666666663, 221, 904, 329.0, 904.0, 904.0, 904.0, 0.016342984773785853, 0.022530123866205433, 0.010480364584751996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 113.4705882352941, 101, 290, 103.0, 140.39999999999986, 290.0, 290.0, 0.08759319658489584, 0.06509611582139231, 0.04396767875452779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 173.58823529411765, 95, 322, 103.0, 309.2, 322.0, 322.0, 0.08759680735400963, 0.023438989467772103, 0.04995755419408361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 190.8823529411765, 100, 410, 102.0, 332.3999999999999, 410.0, 410.0, 0.08750392480839214, 0.023585042233511946, 0.05144273704555866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 191.05882352941174, 95, 407, 105.0, 338.99999999999994, 407.0, 407.0, 0.08750347440266011, 0.023584920835091984, 0.0515279248679727], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 100.0, 0.15408320493066255], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
