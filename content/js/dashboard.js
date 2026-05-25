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

    var data = {"OkPercent": 98.60088365243004, "KoPercent": 1.3991163475699557};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8207964601769911, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0883aeb-2475-441d-a170-8cf9e28b2fe7"], "isController": false}, {"data": [0.35833333333333334, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30b99fc8-b817-4094-bc6a-14c631c9c57a"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e67271ef-81d2-4d03-8329-4d2c362dd1fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f2563b0-ead1-418a-a163-7e6ea923bf98"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/362da63d-86a3-4c9d-858f-ce39d2947f48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca618b5a-b660-4754-a35c-35f074606f0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d96205e4-b1cd-4860-890d-30dcecea1a70"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c94f2ca-7222-4c55-b2d1-032b74e74a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d96205e4-b1cd-4860-890d-30dcecea1a70"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/980bca24-6a07-4d58-8f30-edf0a3419802"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e70d6b7-6891-459a-9bf1-a020e15cf50b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c94f2ca-7222-4c55-b2d1-032b74e74a00"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8cd64e7f-6cdd-49a1-86f7-38000286742d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30052be9-48d5-41cd-9519-1bdeadb70e58"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e9ff783-1af9-41bb-a7ab-c6ae15496ba0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78bb6ad6-4425-4eba-af4b-1277267f7960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e84732f-b6c9-462e-9436-528ad8992b7b"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e67271ef-81d2-4d03-8329-4d2c362dd1fe"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f2563b0-ead1-418a-a163-7e6ea923bf98"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30b99fc8-b817-4094-bc6a-14c631c9c57a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=362da63d-86a3-4c9d-858f-ce39d2947f48"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3448275862068966, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cd64e7f-6cdd-49a1-86f7-38000286742d"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0883aeb-2475-441d-a170-8cf9e28b2fe7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca618b5a-b660-4754-a35c-35f074606f0a"], "isController": false}, {"data": [0.9204545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e9ff783-1af9-41bb-a7ab-c6ae15496ba0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39c7edf1-237f-4751-8d42-80c948a708d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e70d6b7-6891-459a-9bf1-a020e15cf50b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e84732f-b6c9-462e-9436-528ad8992b7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30052be9-48d5-41cd-9519-1bdeadb70e58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=980bca24-6a07-4d58-8f30-edf0a3419802"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78bb6ad6-4425-4eba-af4b-1277267f7960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1358, 19, 1.3991163475699557, 300.4123711340203, 77, 2346, 92.0, 856.0, 1062.5999999999995, 1489.1500000000012, 5.329419336608951, 773.4399796160993, 3.897722726706356], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0883aeb-2475-441d-a170-8cf9e28b2fe7", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1335.8500000000001, 945, 2192, 1327.0, 1655.3, 1733.1499999999999, 2192.0, 0.2758050058608563, 331.88759707043374, 1.3561310590912226], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30b99fc8-b817-4094-bc6a-14c631c9c57a", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 555.2666666666665, 393, 841, 521.0, 810.4, 841.0, 841.0, 0.09039302888961202, 0.016330771820877173, 0.06143901182340818], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 555.2666666666665, 393, 841, 521.0, 810.4, 841.0, 841.0, 0.09011119721736624, 0.016279854966028077, 0.06124745435867861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e67271ef-81d2-4d03-8329-4d2c362dd1fe", 3, 0, 0.0, 260.0, 187, 378, 215.0, 378.0, 378.0, 378.0, 0.04609286175214332, 0.029633268867344745, 0.029558247933503364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 137.93750000000003, 78, 240, 80.0, 237.2, 240.0, 240.0, 0.08209127523665376, 0.0450840633898566, 0.04552498332520972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 91.56249999999999, 79, 239, 81.0, 133.30000000000013, 239.0, 239.0, 0.08209043287311384, 0.06100665958636683, 0.04120554931326222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 181.5, 79, 624, 80.0, 512.0000000000001, 624.0, 624.0, 0.08209169642490662, 4.543793434844847, 0.04701833979805443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 257.4375, 79, 1117, 80.0, 939.9000000000002, 1117.0, 1117.0, 0.08209127523665376, 13.867828838087787, 0.04693793129986404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f2563b0-ead1-418a-a163-7e6ea923bf98", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 222.53333333333333, 164, 510, 189.0, 384.00000000000006, 510.0, 510.0, 0.09086173267266758, 0.18277642032031788, 0.05874069045830658], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/362da63d-86a3-4c9d-858f-ce39d2947f48", 3, 0, 0.0, 325.3333333333333, 253, 423, 300.0, 423.0, 423.0, 423.0, 0.06549217368524461, 0.028993931058571832, 0.04199856190101949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 92.25, 79, 237, 80.5, 141.40000000000012, 232.49999999999994, 237.0, 0.1105057849778436, 0.08212392809388572, 0.055468724100206646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 103.59999999999998, 78, 237, 80.0, 236.9, 237.0, 237.0, 0.11040939804796183, 0.03783462673342755, 0.06250422660976902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 531.1666666666667, 394, 623, 540.5, 623.0, 623.0, 623.0, 0.0599029572093209, 17.613458384916434, 0.03416340528344083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 764.1666666666667, 619, 943, 736.5, 943.0, 943.0, 943.0, 0.05981159348053631, 53.818576951353236, 0.03405288964761003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca618b5a-b660-4754-a35c-35f074606f0a", 3, 0, 0.0, 582.0, 182, 1099, 465.0, 1099.0, 1099.0, 1099.0, 0.04213128107181979, 0.02708635420470185, 0.027017781156082353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 131.83333333333331, 78, 240, 79.5, 240.0, 240.0, 240.0, 0.06013590715015936, 0.10641236694930543, 0.03329790952552769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 81.66666666666666, 78, 91, 81.0, 87.4, 91.0, 91.0, 0.0931995402156016, 0.06926254892975862, 0.0467818004597844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 80.49999999999999, 77, 89, 79.5, 87.2, 89.0, 89.0, 0.09320098793047206, 0.024938545598583346, 0.053153688429097345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 98.3888888888889, 79, 236, 80.5, 232.4, 236.0, 236.0, 0.09312528454948056, 0.025100174351227182, 0.054747481737096974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 107.1666666666667, 79, 236, 81.0, 234.2, 236.0, 236.0, 0.09312624815040924, 0.02510043407178999, 0.05483899183075856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 82.16666666666667, 78, 87, 81.0, 87.0, 87.0, 87.0, 0.06013470173187941, 0.044689949236289286, 0.03376704442952213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d96205e4-b1cd-4860-890d-30dcecea1a70", 3, 0, 0.0, 332.0, 265, 431, 300.0, 431.0, 431.0, 431.0, 0.10037809080871282, 0.04659477782982568, 0.06437006474386857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 612.0625, 78, 1088, 845.5, 1078.2, 1088.0, 1088.0, 0.08099092395458433, 45.55554593261049, 0.043263706448396125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 126.40000000000002, 77, 859, 80.0, 222.50000000000034, 827.9499999999996, 859.0, 0.11040878853956776, 4.995571788139336, 0.06443387893676336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 358.25, 77, 705, 459.0, 648.3000000000001, 705.0, 705.0, 0.08099092395458433, 14.89194909087688, 0.04334279914757053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 107.50000000000001, 78, 625, 80.0, 86.50000000000001, 598.0999999999997, 625.0, 0.1105063955576429, 1.6529231531618642, 0.06459875818437992], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 567.1333333333332, 185, 1537, 418.0, 1312.6000000000001, 1537.0, 1537.0, 0.09007872880897905, 0.01627398909146594, 0.06210506107337814], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0c94f2ca-7222-4c55-b2d1-032b74e74a00", 3, 0, 0.0, 380.3333333333333, 160, 510, 471.0, 510.0, 510.0, 510.0, 0.028207153334085522, 0.02828979147861898, 0.018088571636767085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 190.33333333333334, 160, 318, 164.0, 318.0, 318.0, 318.0, 0.09308531268907953, 0.1442640539429387, 0.20935104992475603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d96205e4-b1cd-4860-890d-30dcecea1a70", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/980bca24-6a07-4d58-8f30-edf0a3419802", 3, 0, 0.0, 525.0, 260, 945, 370.0, 945.0, 945.0, 945.0, 0.0635176049628422, 0.02944305646715081, 0.040732318286718465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 461.04545454545456, 101, 1233, 310.5, 1011.3, 1200.5999999999995, 1233.0, 0.09741064786936347, 0.059835251474442984, 0.044044072229995394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 80.1875, 78, 83, 80.0, 82.3, 83.0, 83.0, 0.08099092395458433, 0.06018954407171746, 0.04065364737564097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e70d6b7-6891-459a-9bf1-a020e15cf50b", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 168.5, 79, 241, 234.5, 240.3, 241.0, 241.0, 0.08092701900267564, 0.09762216818657724, 0.04190581233024293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c94f2ca-7222-4c55-b2d1-032b74e74a00", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["login", 22, 0, 0.0, 2343.909090909091, 1383, 3438, 2171.5, 3148.1, 3395.9999999999995, 3438.0, 0.09964354785381385, 32.64728314223663, 0.19540361581524274], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8cd64e7f-6cdd-49a1-86f7-38000286742d", 3, 0, 0.0, 492.6666666666667, 208, 1059, 211.0, 1059.0, 1059.0, 1059.0, 0.07246726895019083, 0.03363877783950915, 0.04647152338277211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 101.3, 81, 242, 83.0, 221.90000000000026, 241.6, 242.0, 0.11029006286533584, 0.08928756065953457, 0.03920467078416234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30052be9-48d5-41cd-9519-1bdeadb70e58", 3, 0, 0.0, 640.6666666666667, 194, 1498, 230.0, 1498.0, 1498.0, 1498.0, 0.01749822101419689, 0.02412271028487104, 0.011221189908192666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 703.3125, 160, 1171, 926.5, 1160.5, 1171.0, 1171.0, 0.08089346835801427, 60.53245795119596, 0.16899546111804886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e9ff783-1af9-41bb-a7ab-c6ae15496ba0", 3, 0, 0.0, 254.33333333333331, 170, 402, 191.0, 402.0, 402.0, 402.0, 0.020789732644038196, 0.028660324787598234, 0.0133319574572771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78bb6ad6-4425-4eba-af4b-1277267f7960", 1, 0, 0.0, 1163.0, 1163, 1163, 1163.0, 1163.0, 1163.0, 1163.0, 0.8598452278589854, 0.15534313198624247, 0.5928229793637145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e84732f-b6c9-462e-9436-528ad8992b7b", 3, 0, 0.0, 321.0, 164, 498, 301.0, 498.0, 498.0, 498.0, 0.02251745102454402, 0.02674680299106808, 0.014439901861442618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 389.62499999999994, 160, 1198, 315.5, 1020.9000000000002, 1198.0, 1198.0, 0.08205633167169263, 18.509807935296017, 0.18061007279935176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 847.0, 698, 1029, 821.0, 1029.0, 1029.0, 1029.0, 0.0597633371847484, 71.49772837065221, 0.1347593218355313], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 883.25, 145, 1676, 943.0, 1322.0, 1594.25, 1676.0, 0.1020516636547252, 0.031891144892101625, 0.04604284043797172], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e67271ef-81d2-4d03-8329-4d2c362dd1fe", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 236.4, 159, 939, 163.0, 460.20000000000033, 915.8499999999997, 939.0, 0.11036004966202234, 6.7639340340046905, 0.24679050558697752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 85.19999999999999, 80, 108, 83.0, 101.4, 108.0, 108.0, 0.09497157184282838, 0.07373281212407086, 0.0337594259285054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f2563b0-ead1-418a-a163-7e6ea923bf98", 3, 0, 0.0, 295.0, 168, 428, 289.0, 428.0, 428.0, 428.0, 0.036599202137393406, 0.030511248917273606, 0.02347019147482585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 301.92857142857144, 161, 856, 315.0, 666.5, 856.0, 856.0, 0.07590132827324479, 6.595256802317702, 0.16931671862293304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 82.08333333333333, 79, 94, 81.0, 90.70000000000002, 94.0, 94.0, 0.05032185016669113, 0.037397390602394484, 0.025259209946952382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 92.75, 78, 236, 80.0, 190.10000000000016, 236.0, 236.0, 0.05032353841573114, 0.013465478052646808, 0.028700143002721664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 93.16666666666667, 77, 236, 80.5, 190.40000000000015, 236.0, 236.0, 0.050323116342851394, 0.013563652451784165, 0.02958448831874662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 106.5, 77, 237, 80.0, 237.0, 237.0, 237.0, 0.05032353841573114, 0.013563766213615033, 0.0296338805319198], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 950.6666666666667, 614, 1818, 863.0, 1324.1, 1397.7999999999997, 1818.0, 0.2618989419282746, 313.3221853502462, 0.5171481060341516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30b99fc8-b817-4094-bc6a-14c631c9c57a", 3, 0, 0.0, 483.3333333333333, 166, 793, 491.0, 793.0, 793.0, 793.0, 0.06903852349611082, 0.031238134003774107, 0.044272751070097115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=362da63d-86a3-4c9d-858f-ce39d2947f48", 1, 0, 0.0, 1537.0, 1537, 1537, 1537.0, 1537.0, 1537.0, 1537.0, 0.6506180871828238, 0.11754330676642812, 0.44857067338972023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 883.25, 145, 1676, 943.0, 1322.0, 1594.25, 1676.0, 0.10185935769186696, 0.031831049278708425, 0.04595607739613529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 79.28571428571429, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.03793256673422276, 0.010224012127583478, 0.022337243887437817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 79.0, 77, 80, 79.0, 80.0, 80.0, 80.0, 0.03793256673422276, 0.010224012127583478, 0.022300200365236427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 152.6, 78, 699, 80.0, 422.4000000000002, 699.0, 699.0, 0.09127085539045672, 5.498005399051391, 0.05313437427743906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 156.93333333333334, 78, 615, 80.0, 388.8000000000001, 615.0, 615.0, 0.09127418765972983, 1.8121372801813314, 0.05322544914506511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 79.14285714285715, 79, 80, 79.0, 80.0, 80.0, 80.0, 0.03793236118110535, 0.010149870081662956, 0.021633299736099145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 91.80000000000001, 79, 237, 81.0, 147.60000000000005, 237.0, 237.0, 0.09135646072890276, 0.06789283849091307, 0.04585666095181251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 80.71428571428572, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.03793195008155369, 0.02818966212115465, 0.01904006088077988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 100.4, 77, 238, 80.0, 233.8, 238.0, 238.0, 0.09135868638390138, 0.033593350305747074, 0.05159148734986723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 106.85714285714286, 83, 239, 85.0, 239.0, 239.0, 239.0, 0.03930177587881578, 0.030934796248364763, 0.013970553144422797], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 693.1333333333333, 378, 1498, 471.0, 1452.4, 1498.0, 1498.0, 0.08972096779017256, 0.016209354532404224, 0.0610698384274905], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1393.681818181818, 956, 2346, 1407.5, 1800.5, 2269.349999999999, 2346.0, 0.09666123313371323, 0.05002973980553518, 0.04446039141208881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 161.2857142857143, 160, 163, 161.0, 163.0, 163.0, 163.0, 0.03791551340313399, 0.05876164040114613, 0.08527287828849373], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 909.2758620689657, 406, 2334, 687.0, 1667.7000000000003, 1885.55, 2334.0, 0.2695455369300622, 90.01340048686663, 0.978055638497609], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cd64e7f-6cdd-49a1-86f7-38000286742d", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 159.55000000000004, 79, 637, 82.0, 322.0, 325.95, 637.0, 0.26279021894805077, 0.19529624669869788, 0.12703238122977065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0883aeb-2475-441d-a170-8cf9e28b2fe7", 3, 0, 0.0, 500.6666666666667, 183, 929, 390.0, 929.0, 929.0, 929.0, 0.018398699825212354, 0.021746640320750667, 0.011798645395725369], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 504.7666666666666, 384, 785, 467.0, 692.6999999999999, 716.8, 785.0, 0.26303906568523866, 77.342219030438, 0.13229015510536907], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 128.71666666666667, 77, 241, 83.0, 239.9, 240.0, 241.0, 0.26348031143372813, 0.4662366448417142, 0.12813788583398106], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 789.5833333333334, 533, 1163, 775.0, 1022.1, 1134.1999999999996, 1163.0, 0.2626786214625946, 236.3586853318069, 0.13185235491384142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 82.92857142857142, 80, 88, 82.0, 86.5, 88.0, 88.0, 0.0802710869278535, 0.05996814599590618, 0.028533862931385424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca618b5a-b660-4754-a35c-35f074606f0a", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, 6.25, 157.5000000000001, 79, 1853, 86.0, 287.50000000000006, 407.4000000000002, 1393.3099999999938, 0.7019811023496424, 1.576945174428344, 0.33408604353878246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 103.08333333333333, 81, 244, 89.5, 206.5000000000001, 244.0, 244.0, 0.04985272673643279, 0.03860665263866328, 0.01772108645709134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 86.8125, 81, 103, 84.0, 98.10000000000001, 103.0, 103.0, 0.0790185891230912, 0.06412543707157109, 0.028088639102348826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e9ff783-1af9-41bb-a7ab-c6ae15496ba0", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39c7edf1-237f-4751-8d42-80c948a708d8", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.9176320043103449, 1.7145968031609196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e70d6b7-6891-459a-9bf1-a020e15cf50b", 3, 0, 0.0, 271.6666666666667, 164, 462, 189.0, 462.0, 462.0, 462.0, 0.018215821047774028, 0.02511197986240983, 0.01168136961722488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 203.25000000000003, 160, 319, 167.5, 318.7, 319.0, 319.0, 0.05030497390429479, 0.07796288436144125, 0.11313706533358486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 266.8666666666667, 162, 780, 166.0, 597.6000000000001, 780.0, 780.0, 0.09122533875009123, 7.407770707391685, 0.20361186773238135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e84732f-b6c9-462e-9436-528ad8992b7b", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30052be9-48d5-41cd-9519-1bdeadb70e58", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 83.99999999999999, 80, 95, 83.0, 93.2, 95.0, 95.0, 0.0905592030790129, 0.07508277677156441, 0.03219096671949287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 83.6875, 81, 91, 82.5, 91.0, 91.0, 91.0, 0.07630748099466801, 0.05924262440504011, 0.027124924884823397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=980bca24-6a07-4d58-8f30-edf0a3419802", 1, 0, 0.0, 920.0, 920, 920, 920.0, 920.0, 920.0, 920.0, 1.0869565217391304, 0.19637398097826086, 0.7494055706521738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78bb6ad6-4425-4eba-af4b-1277267f7960", 3, 0, 0.0, 691.6666666666667, 171, 1422, 482.0, 1422.0, 1422.0, 1422.0, 0.03762699109494544, 0.02419052975667879, 0.024129287909193525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 93.35714285714285, 79, 241, 81.0, 169.0, 241.0, 241.0, 0.0759346744843222, 0.05643192117438398, 0.03811564715326329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 146.28571428571428, 78, 239, 80.5, 237.5, 239.0, 239.0, 0.07593591009188246, 0.028465372546998904, 0.04285166801362507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 184.6428571428571, 78, 775, 81.0, 505.5, 775.0, 775.0, 0.07593549821822777, 4.899497545995216, 0.04417564558733396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 151.6428571428571, 77, 615, 81.0, 427.5, 615.0, 615.0, 0.07593591009188246, 1.6138393704641854, 0.04425004135795103], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 42.10526315789474, 0.5891016200294551], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8100147275405007], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1358, 19, "401/Unauthorized", 11, "406/Not Acceptable", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
