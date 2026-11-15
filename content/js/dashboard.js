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

    var data = {"OkPercent": 97.30909090909091, "KoPercent": 2.690909090909091};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8052434456928839, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44262188-6d45-45d3-9cc9-47e347f78692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e31a476d-604b-4942-849e-a57cc6c7c961"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "see books"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e50849f2-eda2-4f71-86f4-f16baa103b74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3944cbe1-5702-4107-8899-6289a1e2888e"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86524b13-cb21-4d25-bd25-2cd45fce67e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85f7177d-7d22-47b1-95bc-872593b1a4b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cd9db65-2343-4514-b081-c7c8604e1e08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5775ac1f-121a-4418-b80b-4ece1ec28e4b"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f699add-b98b-4c74-884c-3e3515e2098d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0452c7c1-a20e-4072-9779-db8d91b72df5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2532f35-635f-4e74-971c-5140bc43432a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7599c22a-eca8-4ac3-b936-e53ab2f9a176"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c56d2a0-cc93-4fc3-9d8f-058100b153d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85f7177d-7d22-47b1-95bc-872593b1a4b5"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cc03fd8-8da3-4c91-a9fe-c559b9edeeeb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e50849f2-eda2-4f71-86f4-f16baa103b74"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/922f0068-f19c-4c26-9509-bc706e1d7048"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86524b13-cb21-4d25-bd25-2cd45fce67e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e31a476d-604b-4942-849e-a57cc6c7c961"], "isController": false}, {"data": [0.8583333333333333, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8cd9db65-2343-4514-b081-c7c8604e1e08"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8944444444444445, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44262188-6d45-45d3-9cc9-47e347f78692"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5775ac1f-121a-4418-b80b-4ece1ec28e4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0452c7c1-a20e-4072-9779-db8d91b72df5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d2532f35-635f-4e74-971c-5140bc43432a"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3944cbe1-5702-4107-8899-6289a1e2888e"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3cc03fd8-8da3-4c91-a9fe-c559b9edeeeb"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f74f537f-f66e-4cca-bf74-813ec34e920c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f699add-b98b-4c74-884c-3e3515e2098d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1375, 37, 2.690909090909091, 281.23636363636405, 79, 4989, 88.0, 703.6000000000008, 832.0000000000002, 1827.4400000000003, 5.33978508821325, 765.4156182281818, 3.9031515593628767], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44262188-6d45-45d3-9cc9-47e347f78692", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e31a476d-604b-4942-849e-a57cc6c7c961", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1183.6833333333334, 966, 1613, 1143.0, 1412.8999999999999, 1484.45, 1613.0, 0.2603330527521543, 313.2679613196608, 1.280055586530368], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 650.1333333333333, 82, 1851, 586.0, 1381.8000000000002, 1851.0, 1851.0, 0.08021604855744807, 0.01632521925719939, 0.053754152851680524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 650.1333333333333, 82, 1851, 586.0, 1381.8000000000002, 1851.0, 1851.0, 0.08165087175914082, 0.016617228197856392, 0.05471565254015862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e50849f2-eda2-4f71-86f4-f16baa103b74", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 98.63157894736841, 80, 242, 81.0, 242.0, 242.0, 242.0, 0.12331256490134994, 0.05249150197949117, 0.069236557307892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 107.8421052631579, 80, 244, 82.0, 242.0, 244.0, 244.0, 0.12344074844074845, 0.09173672808926715, 0.06196146943217256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 191.0526315789474, 80, 722, 83.0, 563.0, 722.0, 722.0, 0.12331336522173689, 3.8463933274489057, 0.07149969536731157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 156.15789473684214, 79, 713, 81.0, 554.0, 713.0, 713.0, 0.1234423524214192, 11.721732005840773, 0.07145393569952832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3944cbe1-5702-4107-8899-6289a1e2888e", 3, 0, 0.0, 503.0, 179, 1147, 183.0, 1147.0, 1147.0, 1147.0, 0.03657198585883214, 0.030488559825673535, 0.02345273832744118], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 288.0, 82, 1280, 210.0, 706.0000000000006, 1280.0, 1280.0, 0.0803313668884147, 0.12706221758503827, 0.05191826440316304], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/86524b13-cb21-4d25-bd25-2cd45fce67e7", 3, 0, 0.0, 290.6666666666667, 193, 424, 255.0, 424.0, 424.0, 424.0, 0.042430414120841815, 0.027278667932507356, 0.02720960801369088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 90.88888888888889, 80, 239, 82.0, 100.40000000000022, 239.0, 239.0, 0.22488755622188905, 0.1671283498875562, 0.1128830116191904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 108.33333333333331, 80, 241, 82.0, 240.1, 241.0, 241.0, 0.22487069934787499, 0.0601704800989431, 0.12824657072183493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 544.0, 395, 631, 558.0, 631.0, 631.0, 631.0, 0.06279829188646069, 18.464782914154735, 0.03581465084149711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 668.3333333333334, 554, 754, 714.0, 754.0, 754.0, 754.0, 0.06274378575088625, 56.45696871045835, 0.03572229208277997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 81.16666666666667, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.06316188390845737, 0.11176692738488747, 0.0349734259532181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85f7177d-7d22-47b1-95bc-872593b1a4b5", 3, 0, 0.0, 369.6666666666667, 233, 439, 437.0, 439.0, 439.0, 439.0, 0.025375987548848775, 0.025450331262370795, 0.016273012848708364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 95.08333333333334, 80, 239, 82.0, 192.80000000000018, 239.0, 239.0, 0.11621938345617076, 0.08637006915053316, 0.05833668271139822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cd9db65-2343-4514-b081-c7c8604e1e08", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 95.66666666666666, 80, 243, 81.0, 196.50000000000017, 243.0, 243.0, 0.11621713234225946, 0.04564321945668491, 0.0654667146869401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 148.66666666666666, 79, 560, 83.5, 464.00000000000034, 560.0, 560.0, 0.11621713234225946, 8.743078800663406, 0.06749067841751005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 181.33333333333334, 79, 637, 82.5, 520.0000000000005, 637.0, 637.0, 0.11621938345617076, 2.8764108246249505, 0.06760548119667226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.5, 80, 83, 81.5, 83.0, 83.0, 83.0, 0.06316121901152692, 0.046939148113058576, 0.03546650481604295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 493.4666666666667, 81, 795, 710.0, 789.6, 795.0, 795.0, 0.0761788679820218, 45.704097074096644, 0.04042042799827328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 134.83333333333331, 80, 242, 82.5, 242.0, 242.0, 242.0, 0.22443890274314215, 0.06049329800498753, 0.13194552680798005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 389.20000000000005, 79, 638, 551.0, 597.2, 638.0, 638.0, 0.07617925486531509, 14.939664443078861, 0.04049502708172511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 122.83333333333333, 80, 332, 83.0, 251.0000000000001, 332.0, 332.0, 0.22486227185848667, 0.060607409211857734, 0.13241401360416744], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 524.0, 82, 1385, 468.0, 1327.4, 1385.0, 1385.0, 0.08171848526615712, 0.016630988602995257, 0.055175938196309594], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 278.16666666666663, 162, 877, 169.0, 713.8000000000006, 877.0, 877.0, 0.11612378795796319, 11.742006888196986, 0.25868917411794307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5775ac1f-121a-4418-b80b-4ece1ec28e4b", 3, 0, 0.0, 319.0, 196, 472, 289.0, 472.0, 472.0, 472.0, 0.028276278087769568, 0.028359118746229827, 0.01813289968519077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 418.68181818181824, 90, 1649, 342.5, 727.9999999999999, 1519.3999999999983, 1649.0, 0.10679093247900588, 0.06559716457938936, 0.04828535325955051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 84.8, 80, 120, 82.0, 101.4, 120.0, 120.0, 0.07617809422722402, 0.056612821979411594, 0.038237832453899556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f699add-b98b-4c74-884c-3e3515e2098d", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 124.79999999999998, 79, 245, 82.0, 245.0, 245.0, 245.0, 0.0761788679820218, 0.0966618578756253, 0.03918053756887839], "isController": false}, {"data": ["login", 22, 0, 0.0, 2609.1818181818185, 1347, 9111, 1943.0, 3815.2, 8329.94999999999, 9111.0, 0.10261241890120756, 33.62000617132076, 0.20122564995638972], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 94.00000000000001, 82, 244, 84.0, 112.60000000000021, 244.0, 244.0, 0.24455524910669402, 0.19798466944282164, 0.08693174870589515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0452c7c1-a20e-4072-9779-db8d91b72df5", 3, 0, 0.0, 303.6666666666667, 187, 429, 295.0, 429.0, 429.0, 429.0, 0.027109576909869693, 0.027188999498472824, 0.0173847221720193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2532f35-635f-4e74-971c-5140bc43432a", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 580.7333333333333, 162, 878, 795.0, 873.2, 878.0, 878.0, 0.0761467703616464, 60.771344375989905, 0.15826729451794017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 308.05263157894734, 162, 803, 168.0, 796.0, 803.0, 803.0, 0.12324697396245507, 15.691558180274646, 0.27386597580791633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 430.00000000000006, 82, 836, 440.5, 824.9000000000001, 836.0, 836.0, 0.07574705533322391, 45.320040185390916, 0.11049527725000316], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 949.9583333333334, 136, 2967, 652.5, 2186.5, 2817.0, 2967.0, 0.09559125180727211, 0.030012292437537093, 0.04312808431148409], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7599c22a-eca8-4ac3-b936-e53ab2f9a176", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.8043726385390427, 1.5029715050377832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 259.11111111111114, 163, 483, 245.5, 421.80000000000007, 483.0, 483.0, 0.22420686820372931, 0.34747685531183437, 0.5042465014386607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 93.5, 82, 248, 84.0, 109.40000000000022, 248.0, 248.0, 0.10401197293377326, 0.08075148289291968, 0.03697300600380222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 270.5, 163, 875, 174.5, 492.10000000000036, 875.0, 875.0, 0.07472515155194799, 5.6959000483962114, 0.16686367155026668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 96.73333333333333, 81, 293, 82.0, 170.60000000000008, 293.0, 293.0, 0.09633911368015415, 0.07159576710019268, 0.048357719171483626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 91.73333333333333, 80, 240, 81.0, 146.40000000000006, 240.0, 240.0, 0.09633973243244978, 0.025778404967276604, 0.05494375365288152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 91.7333333333333, 80, 238, 81.0, 145.60000000000005, 238.0, 238.0, 0.09633973243244978, 0.02596656850718373, 0.056637225512045676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 91.86666666666667, 80, 240, 81.0, 145.80000000000007, 240.0, 240.0, 0.09633973243244978, 0.02596656850718373, 0.05673130728199924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 86.33333333333333, 82, 93, 84.0, 93.0, 93.0, 93.0, 0.05035077708032627, 0.01484954558423685, 0.03112504091000638], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 782.8499999999999, 631, 1275, 654.5, 1072.0, 1145.5, 1275.0, 0.2695320922877884, 322.45408689265435, 0.5322205962948322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 949.9583333333334, 136, 2967, 652.5, 2186.5, 2817.0, 2967.0, 0.09341829208007504, 0.029330059476312627, 0.04214770599706511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c56d2a0-cc93-4fc3-9d8f-058100b153d0", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.8970110603932585, 1.6760665379213484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 81.99999999999999, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.053127703820640866, 0.014319576420407109, 0.031285161527193794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 82.14285714285714, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.05312810704554597, 0.014319685102119811, 0.03123351605607292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85f7177d-7d22-47b1-95bc-872593b1a4b5", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 183.88888888888889, 79, 729, 82.0, 717.3000000000001, 729.0, 729.0, 0.10031487725360158, 10.05331187129044, 0.05801630813386463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 171.11111111111111, 79, 587, 81.5, 562.7, 587.0, 587.0, 0.10039432660505429, 3.3039711882226297, 0.058160298366361204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cc03fd8-8da3-4c91-a9fe-c559b9edeeeb", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 81.42857142857143, 80, 84, 81.0, 84.0, 84.0, 84.0, 0.05312810704554597, 0.01421591926804648, 0.030299623549412933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 82.33333333333334, 80, 87, 82.0, 84.30000000000001, 87.0, 87.0, 0.10067677163152301, 0.0748193586050674, 0.05053502013535433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 83.14285714285714, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.05312649418264889, 0.039481701243159965, 0.02666700977527493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 108.16666666666666, 79, 243, 81.5, 241.2, 243.0, 243.0, 0.10067508235781042, 0.043739478055628576, 0.05647679858831162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 84.85714285714286, 82, 90, 85.0, 90.0, 90.0, 90.0, 0.0493405981490227, 0.03883644737120341, 0.01753904074828541], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 514.1999999999999, 82, 1147, 437.0, 1047.4, 1147.0, 1147.0, 0.08188175183278655, 0.016216425070008898, 0.05571797331746647], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1601.8181818181818, 831, 4989, 1187.0, 3037.8999999999996, 4704.749999999996, 4989.0, 0.1043183035947139, 0.05399287197773278, 0.04798234471983423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 167.28571428571428, 165, 171, 167.0, 171.0, 171.0, 171.0, 0.05309304936136646, 0.08228385677391463, 0.11940751238205759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e50849f2-eda2-4f71-86f4-f16baa103b74", 3, 0, 0.0, 437.0, 174, 957, 180.0, 957.0, 957.0, 957.0, 0.04561488869967157, 0.029325978249300572, 0.02925173526639095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/922f0068-f19c-4c26-9509-bc706e1d7048", 1, 0, 0.0, 2368.0, 2368, 2368, 2368.0, 2368.0, 2368.0, 2368.0, 0.4222972972972973, 0.13485470333614866, 0.25197621938344594], "isController": false}, {"data": ["addBook", 60, 18, 30.0, 804.45, 413, 2303, 689.5, 1335.5, 1396.0, 2303.0, 0.29371450949676914, 94.88674781549834, 1.0649732444439006], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86524b13-cb21-4d25-bd25-2cd45fce67e7", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 143.96666666666667, 81, 377, 83.0, 327.9, 332.79999999999995, 377.0, 0.2702045448404442, 0.20080630724958792, 0.13061645478126943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e31a476d-604b-4942-849e-a57cc6c7c961", 3, 0, 0.0, 342.66666666666663, 173, 634, 221.0, 634.0, 634.0, 634.0, 0.04099368697220628, 0.02598135043453308, 0.026288269314858843], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 462.4166666666665, 393, 715, 402.5, 591.4, 642.3499999999999, 715.0, 0.2701643950343784, 79.43730244228614, 0.1358736947682665], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 123.58333333333327, 80, 335, 83.0, 243.0, 247.0, 335.0, 0.2705493504561011, 0.4787455302992727, 0.13157575832728355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cd9db65-2343-4514-b081-c7c8604e1e08", 3, 0, 0.0, 555.0, 224, 981, 460.0, 981.0, 981.0, 981.0, 0.03185220576524925, 0.026553873360938576, 0.020426056431491212], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 633.4833333333333, 549, 908, 564.0, 749.1999999999999, 816.3499999999999, 908.0, 0.2699771869277046, 242.9259473668225, 0.13551589265707048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 100.37500000000001, 81, 283, 84.0, 184.3000000000001, 283.0, 283.0, 0.07268795515153167, 0.05430301337004075, 0.025838296557771024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 18, 10.0, 136.2388888888889, 81, 1343, 85.0, 246.0, 323.24999999999983, 665.8399999999981, 0.7616371814346706, 1.7151381736786653, 0.36241401169113074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 100.0, 82, 327, 84.0, 183.00000000000009, 327.0, 327.0, 0.09566448551639689, 0.07408392286572532, 0.03400573508590671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44262188-6d45-45d3-9cc9-47e347f78692", 3, 0, 0.0, 321.66666666666663, 177, 584, 204.0, 584.0, 584.0, 584.0, 0.06873324627122139, 0.0441888546177286, 0.04407698409970903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5775ac1f-121a-4418-b80b-4ece1ec28e4b", 1, 0, 0.0, 1289.0, 1289, 1289, 1289.0, 1289.0, 1289.0, 1289.0, 0.7757951900698216, 0.14015831070597362, 0.5348744181536075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 100.6842105263158, 82, 244, 84.0, 242.0, 244.0, 244.0, 0.128851122700177, 0.10456570601938192, 0.04580254752232855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0452c7c1-a20e-4072-9779-db8d91b72df5", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2532f35-635f-4e74-971c-5140bc43432a", 3, 0, 0.0, 1056.3333333333333, 309, 2473, 387.0, 2473.0, 2473.0, 2473.0, 0.06477802729314217, 0.02931037042235274, 0.04154059692952151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 200.46666666666667, 162, 534, 165.0, 408.6000000000001, 534.0, 534.0, 0.0962884030247397, 0.14922821835963077, 0.21655487516208546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3944cbe1-5702-4107-8899-6289a1e2888e", 1, 0, 0.0, 1385.0, 1385, 1385, 1385.0, 1385.0, 1385.0, 1385.0, 0.7220216606498194, 0.13044336642599277, 0.4978000902527076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 294.0555555555556, 161, 816, 169.5, 798.9, 816.0, 816.0, 0.1002679382126683, 13.466497626992128, 0.2226544439585782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 85.66666666666669, 82, 92, 85.0, 91.10000000000001, 92.0, 92.0, 0.11776251226692835, 0.09763708292443572, 0.04186089303238469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cc03fd8-8da3-4c91-a9fe-c559b9edeeeb", 3, 0, 0.0, 297.6666666666667, 199, 416, 278.0, 416.0, 416.0, 416.0, 0.02173346083630357, 0.025688214940305428, 0.013937147736822279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f74f537f-f66e-4cca-bf74-813ec34e920c", 2, 0, 0.0, 746.5, 213, 1280, 746.5, 1280.0, 1280.0, 1280.0, 0.06199051545113598, 0.036473911679013114, 0.03853219051235161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 94.2, 82, 239, 84.0, 147.20000000000005, 239.0, 239.0, 0.07663500789340581, 0.059496905542243766, 0.0272413504621091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f699add-b98b-4c74-884c-3e3515e2098d", 3, 0, 0.0, 369.6666666666667, 325, 437, 347.0, 437.0, 437.0, 437.0, 0.030674532980235376, 0.03096410376683265, 0.01967084308953896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 83.25, 80, 90, 82.5, 88.6, 90.0, 90.0, 0.07475657390621787, 0.05555639916272637, 0.037524295886519524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 121.4375, 81, 242, 82.0, 241.3, 242.0, 242.0, 0.07475622462376595, 0.02702065199108532, 0.04224201218059235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 155.6875, 80, 792, 81.5, 406.3000000000004, 792.0, 792.0, 0.07475482752659637, 4.222922290312709, 0.04354614708946752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 148.5625, 80, 508, 84.0, 320.4000000000002, 508.0, 508.0, 0.07475482752659637, 1.3926645511439826, 0.04361914985072396], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.91891891891892, 0.509090909090909], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.21818181818181817], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.21818181818181817], "isController": false}, {"data": ["401/Unauthorized", 24, 64.86486486486487, 1.7454545454545454], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1375, 37, "401/Unauthorized", 24, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
