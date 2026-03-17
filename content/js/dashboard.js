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

    var data = {"OkPercent": 98.0840088430361, "KoPercent": 1.915991156963891};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7607323232323232, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5808fca7-6340-4ade-97e1-4f4fcc319f06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70fa902a-9d2a-4d4e-ae28-839a3cd9373b"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c69b518-5ac9-40e4-86f4-398df5404030"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fba0088-a867-435f-a03b-b25c3cb30eac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=754d7308-929a-4fb7-83a2-94f83d676f76"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d1e3fe70-139d-4640-bfdf-ece0b8789659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a13ae6ad-bf83-41e2-b4c5-7d1644167a51"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=511b4d68-d9de-4666-963f-922bcb27c40e"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d8947dd-0af6-4fda-89c7-f1a0afdde898"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f269b20-72c9-4a4c-a53b-d2f39bb14dae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eeae34bb-a794-4d07-ae6a-c173ed320d33"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c69b518-5ac9-40e4-86f4-398df5404030"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70fa902a-9d2a-4d4e-ae28-839a3cd9373b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a67334c-2a97-4154-9870-18cb47f26716"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3620689655172414, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a13ae6ad-bf83-41e2-b4c5-7d1644167a51"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0de723f-59a7-48cf-ac10-69a97834f6db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff0da722-0d48-4e3f-9d9a-051df6588d27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5808fca7-6340-4ade-97e1-4f4fcc319f06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d8947dd-0af6-4fda-89c7-f1a0afdde898"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45d4cbf1-d8ee-4938-9b47-c042e67bce60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/511b4d68-d9de-4666-963f-922bcb27c40e"], "isController": false}, {"data": [0.29838709677419356, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8fba0088-a867-435f-a03b-b25c3cb30eac"], "isController": false}, {"data": [0.896551724137931, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9478021978021978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45d4cbf1-d8ee-4938-9b47-c042e67bce60"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f269b20-72c9-4a4c-a53b-d2f39bb14dae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1e3fe70-139d-4640-bfdf-ece0b8789659"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/754d7308-929a-4fb7-83a2-94f83d676f76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b971a2f2-1457-4bb8-959d-1af4683843b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a67334c-2a97-4154-9870-18cb47f26716"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa7d3f02-e4eb-4228-9036-0bb63e430ca7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 26, 1.915991156963891, 419.65585851142123, 136, 2227, 155.0, 1102.6000000000001, 1263.5999999999995, 1820.7800000000007, 5.308266735513752, 742.8445926800097, 3.8727173010573503], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2070.7758620689665, 1666, 2632, 2032.0, 2424.7000000000003, 2525.7, 2632.0, 0.2524164523302826, 303.74247255651085, 1.2411297241044656], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5808fca7-6340-4ade-97e1-4f4fcc319f06", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70fa902a-9d2a-4d4e-ae28-839a3cd9373b", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 514.4375, 149, 996, 505.5, 962.4000000000001, 996.0, 996.0, 0.08238207777897918, 0.01664838009803467, 0.05525492265095228], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 514.4375, 149, 996, 505.5, 962.4000000000001, 996.0, 996.0, 0.08341196648924246, 0.016856507632194935, 0.05594568479921176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 208.52941176470588, 137, 436, 145.0, 425.59999999999997, 436.0, 436.0, 0.08027766628101905, 0.028573093995702785, 0.04538676421977192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 192.94117647058826, 139, 439, 144.0, 423.0, 439.0, 439.0, 0.08038775268944319, 0.05974128886393191, 0.04035088367419317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c69b518-5ac9-40e4-86f4-398df5404030", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 215.94117647058823, 138, 691, 142.0, 598.9999999999999, 691.0, 691.0, 0.08038965337872984, 1.410818097720717, 0.046932447569395186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 329.7647058823529, 139, 1305, 147.0, 610.5999999999995, 1305.0, 1305.0, 0.08027994087618473, 4.269543480147243, 0.04678999770966051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fba0088-a867-435f-a03b-b25c3cb30eac", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=754d7308-929a-4fb7-83a2-94f83d676f76", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 227.6875, 141, 301, 237.5, 282.8, 301.0, 301.0, 0.08249548852797113, 0.15028337683681361, 0.05331693896622841], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 165.61111111111114, 137, 545, 141.5, 191.30000000000055, 545.0, 545.0, 0.08484842771149649, 0.06305630223481332, 0.04258993344112226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 188.33333333333334, 138, 437, 141.0, 420.8, 437.0, 437.0, 0.08485442751546236, 0.02978559820014331, 0.04799762702236386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 967.25, 692, 1121, 1028.0, 1121.0, 1121.0, 1121.0, 0.024044675006161448, 7.06993281016128, 0.01371297871445145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1124.75, 1000, 1256, 1121.5, 1256.0, 1256.0, 1256.0, 0.024056677532266018, 21.64624073066144, 0.01369633105596786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 309.5, 139, 536, 281.5, 536.0, 536.0, 536.0, 0.024124870328821983, 0.042689711949048276, 0.013358204566837954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1e3fe70-139d-4640-bfdf-ece0b8789659", 3, 0, 0.0, 983.0, 220, 1826, 903.0, 1826.0, 1826.0, 1826.0, 0.03807106598984772, 0.03173828125, 0.0244140625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 160.6, 138, 416, 142.0, 255.8000000000001, 416.0, 416.0, 0.07940667333682723, 0.05901218594660695, 0.039858427827274605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 215.46666666666664, 136, 422, 143.0, 420.2, 422.0, 422.0, 0.07929040374673588, 0.045034471503028896, 0.04388847738637685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a13ae6ad-bf83-41e2-b4c5-7d1644167a51", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 343.8666666666667, 139, 1247, 143.0, 1076.0, 1247.0, 1247.0, 0.0794045715858681, 14.306796229010725, 0.04531643714334113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 307.4, 138, 982, 141.0, 973.6, 982.0, 982.0, 0.07940751406836458, 4.686811387963939, 0.045395662827754514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 143.0, 138, 147, 143.5, 147.0, 147.0, 147.0, 0.024182334804425366, 0.017971442173991898, 0.013578947766156823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=511b4d68-d9de-4666-963f-922bcb27c40e", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 704.7647058823529, 138, 1428, 962.0, 1408.0, 1428.0, 1428.0, 0.07871172063821315, 37.50554255670716, 0.042692788733111706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 268.88888888888897, 137, 1271, 143.5, 524.9000000000012, 1271.0, 1271.0, 0.08485242748652967, 4.263286660078818, 0.0494788352118718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 584.8235294117646, 138, 1109, 700.0, 1091.4, 1109.0, 1109.0, 0.07871172063821315, 12.262615072484234, 0.04276965564779746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 251.61111111111111, 139, 983, 143.5, 490.7000000000008, 983.0, 983.0, 0.08485322748678883, 1.4076925785245908, 0.04956216618504603], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 366.7333333333333, 145, 524, 423.0, 497.6, 524.0, 524.0, 0.08178977845875342, 0.01664549788164474, 0.055224075025763784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 525.8000000000001, 280, 1393, 289.0, 1387.6, 1393.0, 1393.0, 0.07923135026067114, 19.055882531600105, 0.17413874696940088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 543.952380952381, 159, 1068, 440.0, 929.4, 1054.3999999999999, 1068.0, 0.09051724137931035, 0.055600922683189655, 0.04092722925646552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 159.8235294117647, 137, 414, 144.0, 206.7999999999998, 414.0, 414.0, 0.07870625436935456, 0.058491659741287914, 0.03950685033774243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 242.58823529411762, 138, 434, 142.0, 434.0, 434.0, 434.0, 0.07871172063821315, 0.0836492895109687, 0.04139057276667068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d8947dd-0af6-4fda-89c7-f1a0afdde898", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["login", 21, 0, 0.0, 2402.8095238095234, 1441, 4911, 2104.0, 3460.8, 4767.899999999998, 4911.0, 0.09459757740108922, 21.688016697035494, 0.17260626601964926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 151.5555555555556, 143, 170, 149.5, 162.8, 170.0, 170.0, 0.09050547306707964, 0.073270544113876, 0.03217186737931346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f269b20-72c9-4a4c-a53b-d2f39bb14dae", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eeae34bb-a794-4d07-ae6a-c173ed320d33", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 883.2941176470589, 282, 1574, 1101.0, 1558.0, 1574.0, 1574.0, 0.07865454461332037, 49.874047904087725, 0.1662417658523608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c69b518-5ac9-40e4-86f4-398df5404030", 3, 0, 0.0, 966.6666666666667, 232, 2227, 441.0, 2227.0, 2227.0, 2227.0, 0.04602427013178283, 0.029589171064541366, 0.02951426177070708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 550.7647058823529, 286, 1447, 570.0, 979.7999999999996, 1447.0, 1447.0, 0.0802223574991388, 5.762534890826809, 0.1792145715064343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 602.9000000000001, 141, 1394, 148.5, 1392.5, 1394.0, 1394.0, 0.059241004253504106, 28.35864559513513, 0.07698437925794718], "isController": false}, {"data": ["register", 24, 6, 25.0, 1110.125, 173, 2123, 1050.5, 1909.0, 2077.5, 2123.0, 0.09404351863824985, 0.029664117695463576, 0.04242979063561663], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 147.85714285714286, 140, 155, 147.5, 154.0, 155.0, 155.0, 0.07169523380327852, 0.05566182702500628, 0.025485415141009164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 499.38888888888874, 283, 1416, 427.5, 1025.4000000000005, 1416.0, 1416.0, 0.08479087273361063, 5.75962887947684, 0.18949140785822965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70fa902a-9d2a-4d4e-ae28-839a3cd9373b", 3, 0, 0.0, 337.3333333333333, 237, 443, 332.0, 443.0, 443.0, 443.0, 0.030766390794695876, 0.03085652670522721, 0.01972974930519234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a67334c-2a97-4154-9870-18cb47f26716", 3, 0, 0.0, 441.3333333333333, 220, 694, 410.0, 694.0, 694.0, 694.0, 0.016209381990295983, 0.02234594164352327, 0.010394688320599962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 593.4666666666667, 282, 1404, 578.0, 1246.2, 1404.0, 1404.0, 0.0807193710346609, 12.984210071826787, 0.17878604960743477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 166.0, 140, 412, 143.5, 332.8000000000003, 412.0, 412.0, 0.06573757559821194, 0.04885380374046805, 0.032997181501446225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 187.75, 139, 432, 141.0, 426.90000000000003, 432.0, 432.0, 0.06573901610605895, 0.017590322669004056, 0.03749178262298675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 212.0, 137, 431, 144.5, 429.2, 431.0, 431.0, 0.06573901610605895, 0.017718719184836203, 0.03864735126547606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 141.5, 138, 147, 141.5, 146.4, 147.0, 147.0, 0.06573793571925518, 0.0177184279868305, 0.03871091331905359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 153.0, 145, 165, 149.0, 165.0, 165.0, 165.0, 0.07345020076388209, 0.021662070928410538, 0.04540427449564195], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1343.3448275862074, 1088, 2039, 1151.5, 1844.1000000000001, 1938.8499999999997, 2039.0, 0.26323672243049184, 314.92263591865077, 0.519789699955522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a13ae6ad-bf83-41e2-b4c5-7d1644167a51", 3, 0, 0.0, 329.0, 260, 426, 301.0, 426.0, 426.0, 426.0, 0.07659313725490197, 0.03390842013888889, 0.04911734387765523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1110.125, 173, 2123, 1050.5, 1909.0, 2077.5, 2123.0, 0.09388238883738396, 0.029613292572729513, 0.042357093401241594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0de723f-59a7-48cf-ac10-69a97834f6db", 2, 0, 0.0, 261.5, 248, 275, 261.5, 275.0, 275.0, 275.0, 0.03888327241620655, 0.034326638929932346, 0.02416914345011276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 140.9166666666667, 136, 146, 140.5, 146.0, 146.0, 146.0, 0.06446864406324375, 0.017376314220171163, 0.03796346911146092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 142.66666666666666, 139, 150, 141.0, 149.7, 150.0, 150.0, 0.06446864406324375, 0.017376314220171163, 0.0379005114512429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 264.0, 139, 990, 145.5, 711.0, 990.0, 990.0, 0.07532429800444414, 4.860061787781861, 0.04382007849867914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 297.0714285714286, 139, 980, 147.0, 784.0, 980.0, 980.0, 0.07532105600120513, 1.6007720912622194, 0.04389174817480941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 145.64285714285714, 140, 155, 145.5, 153.5, 155.0, 155.0, 0.0753174090811276, 0.05597319170970519, 0.037805808855175385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 141.91666666666669, 138, 150, 141.0, 149.1, 150.0, 150.0, 0.06446829771459885, 0.017250306224414143, 0.03676707604035715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 223.6428571428571, 139, 435, 144.0, 430.0, 435.0, 435.0, 0.07532348747747021, 0.028235799505017083, 0.042506069593522176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 144.16666666666666, 137, 152, 143.0, 152.0, 152.0, 152.0, 0.06446933677169797, 0.04791129422193569, 0.03236058505923121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff0da722-0d48-4e3f-9d9a-051df6588d27", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 203.66666666666663, 143, 434, 151.5, 431.3, 434.0, 434.0, 0.06462313939211167, 0.05086547885746289, 0.022971506580789693], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 472.4666666666666, 142, 903, 443.0, 855.0, 903.0, 903.0, 0.08130962705984389, 0.01610311754661752, 0.05532866028837815], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1194.6190476190477, 704, 2153, 1156.0, 1656.2, 2105.399999999999, 2153.0, 0.09309666093309453, 0.04818479520951182, 0.04282082744090578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 289.41666666666663, 282, 302, 286.5, 302.0, 302.0, 302.0, 0.06441846233130415, 0.09983603488259735, 0.1448786315908139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5808fca7-6340-4ade-97e1-4f4fcc319f06", 3, 0, 0.0, 316.0, 241, 406, 301.0, 406.0, 406.0, 406.0, 0.017697131295017078, 0.02439692416484288, 0.011348746305723842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d8947dd-0af6-4fda-89c7-f1a0afdde898", 3, 0, 0.0, 322.6666666666667, 240, 464, 264.0, 464.0, 464.0, 464.0, 0.024546101669953118, 0.029012661186067636, 0.01574082691725509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45d4cbf1-d8ee-4938-9b47-c042e67bce60", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.554184240797546, 2.114886886503067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/511b4d68-d9de-4666-963f-922bcb27c40e", 3, 0, 0.0, 310.6666666666667, 226, 447, 259.0, 447.0, 447.0, 447.0, 0.02216950805861618, 0.02620360799506359, 0.014216774373526652], "isController": false}, {"data": ["addBook", 62, 8, 12.903225806451612, 1284.064516129032, 722, 2265, 1125.5, 2050.6, 2223.95, 2265.0, 0.2805709165618297, 93.10768492791138, 1.0191024389305723], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8fba0088-a867-435f-a03b-b25c3cb30eac", 3, 0, 0.0, 438.33333333333337, 245, 823, 247.0, 823.0, 823.0, 823.0, 0.032232417216408446, 0.026199331311644498, 0.02066987692588693], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 263.4137931034483, 139, 643, 146.5, 576.3, 589.05, 643.0, 0.2644043380546223, 0.19649580201129646, 0.1278126438838262], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 794.5517241379309, 679, 1259, 704.0, 1008.6, 1050.9499999999998, 1259.0, 0.2643296281611317, 77.72168724905775, 0.13293921728806915], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 214.01724137931035, 139, 577, 145.0, 422.2, 425.15, 577.0, 0.2649793270438815, 0.46888919980811844, 0.1288668992850127], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1075.2758620689656, 946, 1414, 985.5, 1298.1000000000001, 1375.6, 1414.0, 0.26398554451570033, 237.5346569923171, 0.13250836902448238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 149.26666666666665, 142, 159, 149.0, 156.0, 159.0, 159.0, 0.08156473793249702, 0.06093459425621116, 0.0289937154369423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 8, 4.395604395604396, 206.10439560439553, 140, 872, 150.0, 334.0, 424.25, 688.5699999999972, 0.769182004522114, 1.6392498098176362, 0.3705089227225662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 146.41666666666666, 141, 154, 147.0, 152.8, 154.0, 154.0, 0.06446171779734311, 0.04992006075516902, 0.022914126248274304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 164.88235294117646, 144, 425, 149.0, 208.9999999999998, 425.0, 425.0, 0.0826812055892495, 0.06709773617643196, 0.02939058479930353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45d4cbf1-d8ee-4938-9b47-c042e67bce60", 3, 0, 0.0, 426.3333333333333, 238, 593, 448.0, 593.0, 593.0, 593.0, 0.06233766233766233, 0.028206168831168832, 0.03997564935064935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 380.3333333333333, 282, 843, 289.0, 763.8000000000003, 843.0, 843.0, 0.06568647843841345, 0.10180121218922085, 0.14773042953483026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f269b20-72c9-4a4c-a53b-d2f39bb14dae", 3, 0, 0.0, 407.0, 235, 734, 252.0, 734.0, 734.0, 734.0, 0.027670681990075448, 0.027751748441218246, 0.017744545416812706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1e3fe70-139d-4640-bfdf-ece0b8789659", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 524.7857142857143, 285, 1135, 566.0, 932.0, 1135.0, 1135.0, 0.07525789267149392, 6.539347068906665, 0.1678813760905675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/754d7308-929a-4fb7-83a2-94f83d676f76", 3, 0, 0.0, 421.3333333333333, 261, 584, 419.0, 584.0, 584.0, 584.0, 0.04268032437046522, 0.02793949619433774, 0.027369869469341297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 145.73333333333332, 142, 152, 145.0, 150.8, 152.0, 152.0, 0.08413731209333632, 0.06975837692113529, 0.029908185158178148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b971a2f2-1457-4bb8-959d-1af4683843b3", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 148.47058823529412, 142, 155, 149.0, 155.0, 155.0, 155.0, 0.07720815318097592, 0.059941876737183444, 0.02744508570105003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a67334c-2a97-4154-9870-18cb47f26716", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa7d3f02-e4eb-4228-9036-0bb63e430ca7", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 162.93333333333334, 140, 425, 144.0, 260.0000000000001, 425.0, 425.0, 0.08078109937690844, 0.0600336099861595, 0.04054832527317475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 237.53333333333333, 137, 449, 144.0, 437.6, 449.0, 449.0, 0.0807815344183191, 0.037792715255862044, 0.045166133957325806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 368.40000000000003, 139, 1262, 148.0, 1091.6000000000001, 1262.0, 1262.0, 0.08078283957066613, 9.710675839333703, 0.04656583734105976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 398.4, 138, 1151, 418.0, 1060.4, 1151.0, 1151.0, 0.08078327463082044, 3.1859324678751846, 0.04664497804041318], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 23.076923076923077, 0.4421518054532056], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.2210759027266028], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.538461538461538, 0.2210759027266028], "isController": false}, {"data": ["401/Unauthorized", 14, 53.84615384615385, 1.0316875460574797], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 26, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
