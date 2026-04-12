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

    var data = {"OkPercent": 99.45226917057903, "KoPercent": 0.5477308294209703};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.793010752688172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1111111111111111, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=037c58a1-f267-4fee-80d1-61d1bbc14805"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3e9afdda-ba07-47b4-8991-32edf99dda6f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e553f52-fce7-4d91-a950-676da48aa016"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea18d9da-5e49-4134-9bef-79688cf36e94"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c69146d-ad20-4935-8b1d-e7f244a52dbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5a5da22-2d9f-49f6-a621-c4435d109e20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f1b1e79-7655-4635-9246-f1e2c06de9dc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be3de6c7-2253-4216-acf9-4d0b5138a15c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8758d160-e69f-4198-9f1b-d91520b20add"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=801cb6f8-135b-437d-968b-d633ed741c3d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cccd62f9-4456-4167-872e-ca3fd3f18950"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d27506a8-d25b-494c-9c2e-49ac0189f24a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f1b1e79-7655-4635-9246-f1e2c06de9dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ac96760-aece-4e06-9b1c-2f8d566af510"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c69146d-ad20-4935-8b1d-e7f244a52dbc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea18d9da-5e49-4134-9bef-79688cf36e94"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/56dd990f-992f-4e7b-8d97-0629389fdf74"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89955b5d-8313-4127-b6bd-81c896879c29"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e553f52-fce7-4d91-a950-676da48aa016"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/801cb6f8-135b-437d-968b-d633ed741c3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be3de6c7-2253-4216-acf9-4d0b5138a15c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d9887aa-6ed4-4091-ae92-7d7f0565b7ab"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4074074074074074, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21d2cfa1-edd0-47c2-b627-1c098fc61961"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42caa3de-08fa-4519-a6af-c4b255d34196"], "isController": false}, {"data": [0.35, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/037c58a1-f267-4fee-80d1-61d1bbc14805"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d27506a8-d25b-494c-9c2e-49ac0189f24a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5a5da22-2d9f-49f6-a621-c4435d109e20"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cccd62f9-4456-4167-872e-ca3fd3f18950"], "isController": false}, {"data": [0.9626436781609196, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ac96760-aece-4e06-9b1c-2f8d566af510"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89955b5d-8313-4127-b6bd-81c896879c29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e9afdda-ba07-47b4-8991-32edf99dda6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 7, 0.5477308294209703, 376.60328638497646, 100, 5396, 114.5, 1101.0, 1297.1999999999998, 1857.850000000003, 5.183490703786625, 711.8014705695958, 3.778436413768698], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1698.5740740740746, 1229, 2200, 1651.0, 2060.0, 2148.75, 2200.0, 0.2303990169641943, 277.24772124305605, 1.1328701664206233], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=037c58a1-f267-4fee-80d1-61d1bbc14805", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e9afdda-ba07-47b4-8991-32edf99dda6f", 3, 0, 0.0, 1086.6666666666667, 237, 2587, 436.0, 2587.0, 2587.0, 2587.0, 0.0540491847581299, 0.0343085645437348, 0.034660447257003874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e553f52-fce7-4d91-a950-676da48aa016", 1, 0, 0.0, 1840.0, 1840, 1840, 1840.0, 1840.0, 1840.0, 1840.0, 0.5434782608695652, 0.09818699048913043, 0.3747027853260869], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 502.15384615384613, 375, 1217, 461.0, 931.3999999999997, 1217.0, 1217.0, 0.09626777251184834, 0.01739212686981635, 0.06543200162914692], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 502.15384615384613, 375, 1217, 461.0, 931.3999999999997, 1217.0, 1217.0, 0.10082052395650758, 0.01821464544136123, 0.06852644987668874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 149.76923076923075, 101, 309, 103.0, 307.8, 309.0, 309.0, 0.06017571308220002, 0.023054096808835647, 0.03393020600923929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 118.92307692307692, 102, 303, 104.0, 224.19999999999993, 303.0, 303.0, 0.06017515599251976, 0.04472001338897221, 0.030205107597807774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 219.53846153846155, 100, 800, 105.0, 606.7999999999998, 800.0, 800.0, 0.06017627018219523, 1.3760349305889867, 0.03503803111344615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 213.15384615384613, 102, 1127, 104.0, 798.1999999999997, 1127.0, 1127.0, 0.06017571308220002, 4.180064863921883, 0.03497894139348436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea18d9da-5e49-4134-9bef-79688cf36e94", 3, 0, 0.0, 507.66666666666663, 275, 839, 409.0, 839.0, 839.0, 839.0, 0.02010939510939511, 0.02772242457301051, 0.012895673296063922], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 297.15384615384613, 188, 753, 237.0, 637.3999999999999, 753.0, 753.0, 0.0958581888701269, 0.23843572339750918, 0.06197082132033595], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0c69146d-ad20-4935-8b1d-e7f244a52dbc", 3, 0, 0.0, 758.0, 205, 1710, 359.0, 1710.0, 1710.0, 1710.0, 0.02927171961595504, 0.024402628234525017, 0.018771252488096166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 113.89999999999999, 101, 309, 104.0, 106.0, 298.84999999999985, 309.0, 0.13263303093002282, 0.09856810208764391, 0.06657556435354661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5a5da22-2d9f-49f6-a621-c4435d109e20", 3, 0, 0.0, 307.3333333333333, 188, 532, 202.0, 532.0, 532.0, 532.0, 0.05059619179329769, 0.03252847616919367, 0.03244612559661343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 113.1, 101, 305, 103.0, 105.0, 294.9999999999999, 305.0, 0.13263391051190057, 0.04545042890490812, 0.0750858182849109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 674.0, 604, 812, 606.0, 812.0, 812.0, 812.0, 0.056064287049149696, 16.48476190198094, 0.03197416370771818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1176.6666666666667, 1114, 1301, 1115.0, 1301.0, 1301.0, 1301.0, 0.05553601510579611, 49.97140401409689, 0.03161864922527259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f1b1e79-7655-4635-9246-f1e2c06de9dc", 3, 0, 0.0, 526.0, 205, 909, 464.0, 909.0, 909.0, 909.0, 0.018722033961769607, 0.025809835230499442, 0.012005991830952514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be3de6c7-2253-4216-acf9-4d0b5138a15c", 1, 0, 0.0, 1346.0, 1346, 1346, 1346.0, 1346.0, 1346.0, 1346.0, 0.7429420505200593, 0.13422292904903416, 0.5122237184249628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 237.0, 103, 305, 303.0, 305.0, 305.0, 305.0, 0.05638355855432556, 0.0997724688480839, 0.03122019306670175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8758d160-e69f-4198-9f1b-d91520b20add", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 103.5, 102, 105, 103.5, 105.0, 105.0, 105.0, 0.07319304666056724, 0.05439444190301921, 0.036739478499542545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 160.42857142857144, 101, 308, 103.5, 306.0, 308.0, 308.0, 0.07311659485572529, 0.01956440135787962, 0.04169930800365583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 103.71428571428571, 101, 114, 103.0, 111.5, 114.0, 114.0, 0.07319381198600952, 0.01972801963685413, 0.04302995587458763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 147.07142857142858, 101, 307, 103.0, 305.5, 307.0, 307.0, 0.07311621299797363, 0.01970710428461008, 0.04305573870876768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 170.66666666666669, 102, 307, 103.0, 307.0, 307.0, 307.0, 0.0565973663358865, 0.04206112869297815, 0.03178074769837377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 596.3809523809525, 101, 1419, 306.0, 1316.4, 1408.8, 1419.0, 0.0967171438045761, 41.45472910852124, 0.05290118328819867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 173.40000000000006, 100, 909, 103.0, 306.8, 878.8999999999995, 909.0, 0.13263391051190057, 6.0011728257157255, 0.07740432121280448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 445.2857142857143, 103, 918, 305.0, 890.8000000000001, 917.0, 918.0, 0.0967162529360291, 13.55545928706305, 0.052995145477363795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 159.4, 101, 814, 103.0, 306.7, 788.6499999999996, 814.0, 0.1326356697106553, 1.983926525641791, 0.07753487489140455], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 898.9230769230769, 275, 2021, 445.0, 1948.6, 2021.0, 2021.0, 0.10023284861755771, 0.018108473627195483, 0.06910585070702709], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=801cb6f8-135b-437d-968b-d633ed741c3d", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cccd62f9-4456-4167-872e-ca3fd3f18950", 3, 0, 0.0, 878.3333333333334, 258, 2073, 304.0, 2073.0, 2073.0, 2073.0, 0.023531072781608115, 0.03243948347334322, 0.01508991320955989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 294.3571428571429, 207, 414, 211.0, 412.5, 414.0, 414.0, 0.07307652155757387, 0.11325433565612276, 0.1643508097139576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d27506a8-d25b-494c-9c2e-49ac0189f24a", 3, 0, 0.0, 306.3333333333333, 190, 412, 317.0, 412.0, 412.0, 412.0, 0.04774561138255375, 0.03125534651377461, 0.030618116674359017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 628.952380952381, 118, 2041, 556.0, 1019.0, 1939.6999999999985, 2041.0, 0.09359498330889465, 0.05749144970829563, 0.04231882546095529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 103.71428571428572, 101, 106, 104.0, 105.0, 105.9, 106.0, 0.0967162529360291, 0.07187604344171694, 0.048547025399530236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f1b1e79-7655-4635-9246-f1e2c06de9dc", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 151.14285714285714, 101, 309, 102.0, 306.8, 308.8, 309.0, 0.09671669836825113, 0.09505258106931824, 0.051290793721704614], "isController": false}, {"data": ["login", 21, 0, 0.0, 2980.190476190476, 1545, 5841, 2611.0, 4807.0, 5740.699999999999, 5841.0, 0.09612083762444217, 16.56280842344662, 0.16779576467559218], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 107.24999999999999, 104, 113, 107.0, 110.9, 112.9, 113.0, 0.13746932715637822, 0.11129108614515387, 0.04886604988761883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ac96760-aece-4e06-9b1c-2f8d566af510", 1, 0, 0.0, 2021.0, 2021, 2021, 2021.0, 2021.0, 2021.0, 2021.0, 0.4948045522018803, 0.08939340054428502, 0.341144544779812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c69146d-ad20-4935-8b1d-e7f244a52dbc", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea18d9da-5e49-4134-9bef-79688cf36e94", 1, 0, 0.0, 1484.0, 1484, 1484, 1484.0, 1484.0, 1484.0, 1484.0, 0.6738544474393532, 0.12174128200808626, 0.46459105458221023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 701.7619047619047, 207, 1522, 410.0, 1423.2, 1512.1999999999998, 1522.0, 0.09666995037609215, 55.15031907557058, 0.20563493024802745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56dd990f-992f-4e7b-8d97-0629389fdf74", 1, 0, 0.0, 1390.0, 1390, 1390, 1390.0, 1390.0, 1390.0, 1390.0, 0.7194244604316546, 0.22973808453237413, 0.42926596223021585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 411.38461538461536, 207, 1231, 407.0, 981.7999999999997, 1231.0, 1231.0, 0.06014620153604145, 5.6211035092995285, 0.134086450043953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1348.0, 1217, 1423, 1404.0, 1423.0, 1423.0, 1423.0, 0.05543032408262814, 66.3139383014301, 0.12498888506522302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89955b5d-8313-4127-b6bd-81c896879c29", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1226.8260869565215, 317, 2263, 1058.0, 2066.0000000000005, 2242.3999999999996, 2263.0, 0.09095510772248411, 0.02893323993957417, 0.04103638649198013], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 118.3125, 102, 306, 105.0, 170.90000000000015, 306.0, 306.0, 0.07825147088311675, 0.0607518743672635, 0.02781595254048291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 289.24999999999994, 205, 1219, 208.0, 410.9, 1178.5999999999995, 1219.0, 0.13254161806807338, 8.12343564648831, 0.2963936047012512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e553f52-fce7-4d91-a950-676da48aa016", 3, 0, 0.0, 595.3333333333334, 280, 938, 568.0, 938.0, 938.0, 938.0, 0.01977470024850207, 0.027261020687632243, 0.012681041500504255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/801cb6f8-135b-437d-968b-d633ed741c3d", 3, 0, 0.0, 276.3333333333333, 206, 416, 207.0, 416.0, 416.0, 416.0, 0.024293661783640647, 0.02436483462089741, 0.015578943266201847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 309.07142857142856, 205, 413, 309.0, 412.5, 413.0, 413.0, 0.08415383320710258, 0.13042200517546074, 0.1892639432382395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be3de6c7-2253-4216-acf9-4d0b5138a15c", 3, 0, 0.0, 779.0, 187, 1397, 753.0, 1397.0, 1397.0, 1397.0, 0.01832967758097135, 0.025268940284965385, 0.011754383084151549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 103.77777777777777, 102, 106, 103.0, 106.0, 106.0, 106.0, 0.060493221398468855, 0.044956388168198046, 0.03036476152227831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 171.33333333333334, 100, 315, 103.0, 315.0, 315.0, 315.0, 0.06041038790181299, 0.04640902195581987, 0.032761623126438946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d9887aa-6ed4-4091-ae92-7d7f0565b7ab", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 437.8888888888889, 103, 1106, 106.0, 1106.0, 1106.0, 1106.0, 0.060128273650454304, 18.0453130741415, 0.03362642387092464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 326.1111111111111, 101, 904, 104.0, 904.0, 904.0, 904.0, 0.06020630694513198, 5.911702747247234, 0.033728858806175835], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1195.0555555555557, 809, 1713, 1205.5, 1613.5, 1704.0, 1713.0, 0.2373657674606698, 283.9719795755548, 0.4687046697319085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1226.8260869565215, 317, 2263, 1058.0, 2066.0000000000005, 2242.3999999999996, 2263.0, 0.09328660891008793, 0.029674901237872742, 0.04208829425435608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 189.0, 102, 305, 104.0, 305.0, 305.0, 305.0, 0.03647296051020461, 0.009830602637516088, 0.021477729675442755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 132.28571428571428, 101, 303, 103.0, 303.0, 303.0, 303.0, 0.03647296051020461, 0.009830602637516088, 0.02144211154994451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 165.12499999999997, 101, 894, 103.5, 478.90000000000043, 894.0, 894.0, 0.07778998648398984, 4.394379316432649, 0.045314186462597605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 198.43749999999997, 102, 809, 105.0, 457.60000000000036, 809.0, 809.0, 0.0777896082807038, 1.4492017904979995, 0.04538993256613332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 116.625, 102, 306, 103.5, 168.80000000000013, 306.0, 306.0, 0.07779149933391027, 0.05781184667295482, 0.039047686189091685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 160.14285714285714, 102, 306, 102.0, 306.0, 306.0, 306.0, 0.03651119850617039, 0.009769598037783874, 0.0208227928980503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 141.50000000000003, 101, 307, 104.5, 305.6, 307.0, 307.0, 0.0777896082807038, 0.02811706910634326, 0.04395606649552953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 197.71428571428572, 103, 364, 104.0, 364.0, 364.0, 364.0, 0.03651081763368175, 0.027133527557843568, 0.01832671900753166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 107.28571428571429, 104, 113, 106.0, 113.0, 113.0, 113.0, 0.03841341615997542, 0.030235559985293148, 0.01365476902561626], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 809.6153846153848, 382, 2073, 532.0, 1927.8, 2073.0, 2073.0, 0.1012153629349341, 0.018285978655237116, 0.06889366012270416], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/21d2cfa1-edd0-47c2-b627-1c098fc61961", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1695.4285714285713, 1038, 5396, 1427.0, 2601.4, 5123.899999999996, 5396.0, 0.09538170851349878, 0.04936748585171324, 0.04387186006822063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 389.2857142857143, 206, 671, 216.0, 671.0, 671.0, 671.0, 0.03645301726831504, 0.056495057035953096, 0.08198369020403275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42caa3de-08fa-4519-a6af-c4b255d34196", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["addBook", 60, 3, 5.0, 1070.5999999999997, 532, 2477, 835.0, 1846.6, 2021.7999999999997, 2477.0, 0.29489826010026543, 95.18011736797159, 1.0728748126167305], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/037c58a1-f267-4fee-80d1-61d1bbc14805", 3, 0, 0.0, 262.3333333333333, 188, 394, 205.0, 394.0, 394.0, 394.0, 0.08333564821245035, 0.03770721061696158, 0.05344115461540598], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 196.48148148148147, 102, 424, 105.0, 414.0, 419.75, 424.0, 0.23831905625653724, 0.17711015801877425, 0.1152030594208847], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 654.888888888889, 503, 915, 606.5, 817.0, 911.0, 915.0, 0.23827804400201213, 70.06165651227131, 0.11983710220804321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d27506a8-d25b-494c-9c2e-49ac0189f24a", 1, 0, 0.0, 974.0, 974, 974, 974.0, 974.0, 974.0, 974.0, 1.026694045174538, 0.18548671714579057, 0.7078574178644764], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 154.87037037037032, 100, 428, 105.5, 310.0, 346.75, 428.0, 0.2386961883754956, 0.4223803645863262, 0.11608466973730158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5a5da22-2d9f-49f6-a621-c4435d109e20", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 997.0370370370373, 705, 1305, 1014.0, 1219.5, 1298.25, 1305.0, 0.23785088511361785, 214.01864452249234, 0.11938999506679647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 123.35714285714285, 105, 317, 106.0, 226.5, 317.0, 317.0, 0.08507948855073168, 0.0635603600989353, 0.030243099445767904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cccd62f9-4456-4167-872e-ca3fd3f18950", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, 1.7241379310344827, 176.66091954022983, 102, 2052, 109.0, 307.0, 388.0, 1035.0, 0.733784006038958, 1.51534452661443, 0.3557478561066433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 107.66666666666667, 104, 114, 106.0, 114.0, 114.0, 114.0, 0.05937968027341044, 0.045984459430482884, 0.021107620722188865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 106.76923076923076, 105, 110, 106.0, 109.6, 110.0, 110.0, 0.05969600955136153, 0.048444710876153735, 0.02122006589521054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 564.8888888888889, 207, 1212, 408.0, 1212.0, 1212.0, 1212.0, 0.06008692575258874, 24.023699597918323, 0.13001230321531818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 321.5625, 206, 1004, 209.5, 731.0000000000002, 1004.0, 1004.0, 0.07775029520815212, 5.926490626533746, 0.1736189148245516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ac96760-aece-4e06-9b1c-2f8d566af510", 3, 0, 0.0, 615.6666666666666, 280, 1185, 382.0, 1185.0, 1185.0, 1185.0, 0.01662851346632449, 0.022923748219363348, 0.01066346729448543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89955b5d-8313-4127-b6bd-81c896879c29", 3, 0, 0.0, 380.6666666666667, 204, 481, 457.0, 481.0, 481.0, 481.0, 0.07676168056905992, 0.034732661455401465, 0.04922542666700783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 140.42857142857142, 104, 332, 106.0, 321.5, 332.0, 332.0, 0.07257684073012302, 0.06017357205065863, 0.025798798853285915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 122.66666666666669, 103, 396, 107.0, 117.4, 368.1999999999996, 396.0, 0.09910615685201091, 0.07694276825912956, 0.03522914169348825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 104.0, 102, 106, 104.0, 106.0, 106.0, 106.0, 0.08420546132563456, 0.06257847272344522, 0.04226719445446891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e9afdda-ba07-47b4-8991-32edf99dda6f", 1, 0, 0.0, 1189.0, 1189, 1189, 1189.0, 1189.0, 1189.0, 1189.0, 0.8410428931875525, 0.15194622582001682, 0.5798596509671993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 174.42857142857144, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.08420698075870489, 0.022531946023325332, 0.04802429371394888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 174.92857142857144, 100, 309, 103.5, 307.0, 309.0, 309.0, 0.0842074872485805, 0.022696549297468963, 0.049504792308247524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 131.28571428571428, 100, 309, 103.0, 306.0, 309.0, 309.0, 0.08420698075870489, 0.02269641278261968, 0.04958672792724517], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.3129890453834116], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.2347417840375587], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
