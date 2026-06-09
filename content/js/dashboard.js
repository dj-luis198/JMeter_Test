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

    var data = {"OkPercent": 98.9938080495356, "KoPercent": 1.0061919504643964};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8019179894179894, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/293bdb7d-ca27-4439-8769-e6961f3cef29"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb8cd397-6697-4311-9a81-2a0acf03340d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38c7341c-3edb-4b1c-84bf-31908f864238"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3252e807-d2cf-48d2-8861-982e76bf2c23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c3d877b-269a-48a9-b92e-dbf73f147123"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b780924-2cd4-4c81-a38a-08e14a0096f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd1e9f12-627e-4639-98a8-a53eab0c9bf6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3eef869-9be9-4d31-9bb3-588eb7ca47d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e43dc3b1-9fde-425c-80c4-fbfb9fffb27a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4aca9ff2-be2f-41f8-ac8e-4a2be9e292ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a9168c4-c45d-49bd-9406-6552d202b121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90d40b2c-f022-48b9-bd97-152d75f36f3d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a9168c4-c45d-49bd-9406-6552d202b121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=933af3d5-6b95-4b2b-b78a-9ae0d8d3ae70"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fca7fec-d94f-4168-8dea-a89868a0266a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e4dc716-9be8-458e-a86a-cf91df5f5f10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2cf894d-bae7-4acd-a0dd-8c174341ca15"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/58eb955e-53cb-4758-aa40-bcd61ea1aca1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dea18df5-2704-44ea-98a4-1cd1c7609276"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38c7341c-3edb-4b1c-84bf-31908f864238"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3252e807-d2cf-48d2-8861-982e76bf2c23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb8cd397-6697-4311-9a81-2a0acf03340d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3eef869-9be9-4d31-9bb3-588eb7ca47d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e43dc3b1-9fde-425c-80c4-fbfb9fffb27a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=293bdb7d-ca27-4439-8769-e6961f3cef29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0c3d877b-269a-48a9-b92e-dbf73f147123"], "isController": false}, {"data": [0.9221556886227545, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3fca7fec-d94f-4168-8dea-a89868a0266a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90d40b2c-f022-48b9-bd97-152d75f36f3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd1e9f12-627e-4639-98a8-a53eab0c9bf6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/933af3d5-6b95-4b2b-b78a-9ae0d8d3ae70"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e4dc716-9be8-458e-a86a-cf91df5f5f10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dea18df5-2704-44ea-98a4-1cd1c7609276"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58eb955e-53cb-4758-aa40-bcd61ea1aca1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 13, 1.0061919504643964, 344.5619195046437, 81, 3843, 133.5, 898.0, 1148.7499999999995, 2063.259999999999, 5.082792073676881, 737.5079749024848, 3.700669015867989], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/293bdb7d-ca27-4439-8769-e6961f3cef29", 3, 0, 0.0, 377.3333333333333, 204, 531, 397.0, 531.0, 531.0, 531.0, 0.07506192608902344, 0.03396356681762454, 0.04813541484224485], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1404.859649122807, 1026, 1834, 1358.0, 1743.0, 1789.6999999999998, 1834.0, 0.26472719166248676, 318.5564236836789, 1.3016615332232626], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb8cd397-6697-4311-9a81-2a0acf03340d", 3, 0, 0.0, 351.3333333333333, 181, 561, 312.0, 561.0, 561.0, 561.0, 0.023073018412268692, 0.0318080185468613, 0.014796173916721786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38c7341c-3edb-4b1c-84bf-31908f864238", 3, 0, 0.0, 410.0, 228, 570, 432.0, 570.0, 570.0, 570.0, 0.03985651654045436, 0.025623899794074666, 0.025559029161684604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3252e807-d2cf-48d2-8861-982e76bf2c23", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.6383889134275619, 2.4362301236749118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c3d877b-269a-48a9-b92e-dbf73f147123", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 651.4666666666666, 408, 2080, 507.0, 1342.6000000000004, 2080.0, 2080.0, 0.0920736834997821, 0.01663440571040985, 0.06258133175375814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 651.4666666666666, 408, 2080, 507.0, 1342.6000000000004, 2080.0, 2080.0, 0.09254574844831628, 0.01671969088177589, 0.06290218839846498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b780924-2cd4-4c81-a38a-08e14a0096f0", 2, 0, 0.0, 444.0, 419, 469, 444.0, 469.0, 469.0, 469.0, 0.052543085329970575, 0.030863931470680957, 0.032659837707545186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 133.79999999999998, 82, 251, 85.0, 249.8, 250.95, 251.0, 0.10309384632831266, 0.04306987056567594, 0.05792988200909288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 119.05000000000001, 83, 258, 85.5, 254.70000000000002, 257.85, 258.0, 0.10309065792457887, 0.07661327214902786, 0.05174667790354838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 207.1, 82, 658, 169.0, 611.2000000000008, 657.65, 658.0, 0.10300623702765202, 3.0537124413508234, 0.05977178324397542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 188.7, 81, 806, 85.5, 724.600000000001, 804.5, 806.0, 0.103005706516141, 9.293458509945202, 0.05967088389196762], "isController": false}, {"data": ["goToProfile", 16, 0, 0.0, 244.6875, 181, 427, 196.0, 421.4, 427.0, 427.0, 0.08848774444739403, 0.15541524256702946, 0.057205944164233254], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd1e9f12-627e-4639-98a8-a53eab0c9bf6", 3, 0, 0.0, 421.0, 192, 749, 322.0, 749.0, 749.0, 749.0, 0.0496310756708467, 0.03219880657942627, 0.03182721974985938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 119.06666666666666, 83, 252, 85.0, 249.6, 252.0, 252.0, 0.07377097554738063, 0.05482393788237956, 0.0370295717103063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 116.86666666666667, 82, 252, 84.0, 250.8, 252.0, 252.0, 0.07377278964426762, 0.04190063911826762, 0.04083439176794031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 498.0, 417, 661, 457.0, 661.0, 661.0, 661.0, 0.04057618178129438, 11.930744699736255, 0.02314110367214445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 697.75, 576, 898, 658.5, 898.0, 898.0, 898.0, 0.04047927461139896, 36.42332245031169, 0.023046305760200777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 129.25, 84, 253, 90.0, 253.0, 253.0, 253.0, 0.04081549356135589, 0.07222429134099305, 0.022599985204383586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3eef869-9be9-4d31-9bb3-588eb7ca47d8", 3, 0, 0.0, 326.3333333333333, 199, 466, 314.0, 466.0, 466.0, 466.0, 0.06286013619696175, 0.02844257464641173, 0.04031069931901519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e43dc3b1-9fde-425c-80c4-fbfb9fffb27a", 3, 0, 0.0, 1037.0, 427, 2115, 569.0, 2115.0, 2115.0, 2115.0, 0.03187894501944616, 0.025912020089048523, 0.02044320367457973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4aca9ff2-be2f-41f8-ac8e-4a2be9e292ed", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 116.75, 81, 290, 87.0, 277.40000000000003, 290.0, 290.0, 0.05780541733102754, 0.042958908778234335, 0.029015609871238433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 127.74999999999999, 82, 274, 85.0, 266.8, 274.0, 274.0, 0.0578073665854152, 0.022703316336361797, 0.03256368745965527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 186.0, 82, 980, 84.0, 761.6000000000008, 980.0, 980.0, 0.05780903747952597, 4.34900569208257, 0.03357139416128721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 187.33333333333334, 82, 658, 85.0, 538.6000000000004, 658.0, 658.0, 0.057809315971268774, 1.4307711612205474, 0.033628010299693124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 85.75, 84, 89, 85.0, 89.0, 89.0, 89.0, 0.040815077089476855, 0.030332298501066293, 0.02291862238911054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 507.35000000000014, 82, 1207, 409.5, 972.5, 1195.2999999999997, 1207.0, 0.09615893148195337, 43.27494670691719, 0.05239910524114256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 298.93333333333334, 82, 971, 87.0, 955.4, 971.0, 971.0, 0.07377315247435152, 13.2921497911605, 0.04210256865821391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 366.15, 82, 734, 286.5, 676.2, 731.1999999999999, 734.0, 0.09615939381118142, 14.14998626723657, 0.052493262832471105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 230.86666666666665, 82, 659, 84.0, 653.6, 659.0, 659.0, 0.07377315247435152, 4.354258601334802, 0.042174612752427135], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 531.4666666666666, 200, 1554, 446.0, 1414.8000000000002, 1554.0, 1554.0, 0.09258459145505944, 0.016726708417173823, 0.06383273590553902], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a9168c4-c45d-49bd-9406-6552d202b121", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90d40b2c-f022-48b9-bd97-152d75f36f3d", 3, 0, 0.0, 316.0, 181, 418, 349.0, 418.0, 418.0, 418.0, 0.08377314233056883, 0.0379051653123342, 0.05372170911172545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 347.5, 169, 1228, 254.5, 1021.3000000000008, 1228.0, 1228.0, 0.057780923628064196, 5.842592763962519, 0.1287186688960473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a9168c4-c45d-49bd-9406-6552d202b121", 3, 0, 0.0, 388.0, 192, 546, 426.0, 546.0, 546.0, 546.0, 0.019352341633337634, 0.022873812653206035, 0.012410193039607791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=933af3d5-6b95-4b2b-b78a-9ae0d8d3ae70", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 651.4545454545454, 127, 1610, 498.5, 1360.7999999999997, 1582.2499999999995, 1610.0, 0.09956012526473942, 0.06115558475734482, 0.0450159550757562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 84.85, 82, 93, 84.0, 88.80000000000001, 92.8, 93.0, 0.09615800683683429, 0.07146117500276454, 0.048266812025520335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 129.95000000000002, 81, 342, 84.0, 250.9, 337.44999999999993, 342.0, 0.09615939381118142, 0.09794360131353733, 0.05080296098813393], "isController": false}, {"data": ["login", 22, 0, 0.0, 3236.0, 1876, 6554, 2725.5, 5168.7, 6355.699999999997, 6554.0, 0.09646541933956265, 21.117328532717124, 0.17462947139142598], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 89.13333333333335, 85, 105, 88.0, 100.8, 105.0, 105.0, 0.07604948286351652, 0.06156740360728047, 0.02703321461164064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fca7fec-d94f-4168-8dea-a89868a0266a", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e4dc716-9be8-458e-a86a-cf91df5f5f10", 3, 0, 0.0, 735.6666666666667, 183, 1653, 371.0, 1653.0, 1653.0, 1653.0, 0.02924803306977606, 0.02933372066666017, 0.018756062873521755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2cf894d-bae7-4acd-a0dd-8c174341ca15", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 593.9999999999999, 168, 1292, 501.5, 1058.5, 1280.35, 1292.0, 0.09611918779286314, 57.57046550222276, 0.20387780848251832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58eb955e-53cb-4758-aa40-bcd61ea1aca1", 3, 0, 0.0, 511.0, 183, 847, 503.0, 847.0, 847.0, 847.0, 0.03996270147861996, 0.02569216647795391, 0.025627123018516055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dea18df5-2704-44ea-98a4-1cd1c7609276", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38c7341c-3edb-4b1c-84bf-31908f864238", 1, 0, 0.0, 1322.0, 1322, 1322, 1322.0, 1322.0, 1322.0, 1322.0, 0.7564296520423601, 0.13665965393343418, 0.5215227874432677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 357.5, 167, 891, 332.5, 826.8000000000008, 889.5, 891.0, 0.10295904289273727, 12.461090732013055, 0.2289229969318205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 784.25, 662, 983, 746.0, 983.0, 983.0, 983.0, 0.040444484888929336, 48.38566470510915, 0.09119757383646272], "isController": false}, {"data": ["register", 25, 4, 16.0, 1435.3599999999997, 501, 3120, 1367.0, 2284.4, 2891.9999999999995, 3120.0, 0.09966591983670736, 0.031752939147975986, 0.04496645992632695], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 452.6666666666667, 168, 1198, 340.0, 1113.4, 1198.0, 1198.0, 0.07374051205411569, 17.735284466315335, 0.16207069963768828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 88.23076923076923, 83, 95, 87.0, 94.2, 95.0, 95.0, 0.13210710837863932, 0.10256362418068188, 0.04695994868146944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 264.25, 167, 496, 198.0, 461.70000000000005, 496.0, 496.0, 0.07821207203331834, 0.12121343585632442, 0.17590078309837123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 101.18181818181819, 83, 250, 84.0, 219.80000000000013, 250.0, 250.0, 0.06207885142837794, 0.046134771422847276, 0.031160673470885022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3252e807-d2cf-48d2-8861-982e76bf2c23", 3, 0, 0.0, 327.6666666666667, 184, 466, 333.0, 466.0, 466.0, 466.0, 0.06048874909266876, 0.027369583736591662, 0.038789985583514805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 83.45454545454547, 81, 90, 83.0, 88.80000000000001, 90.0, 90.0, 0.06208060319771544, 0.025087971036576763, 0.034931362133089526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 196.54545454545456, 82, 990, 85.0, 842.2000000000005, 990.0, 990.0, 0.06176374804882705, 5.067418333235072, 0.035827799161136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 166.63636363636363, 83, 661, 85.0, 578.8000000000003, 661.0, 661.0, 0.06187805522897693, 1.6691803161687357, 0.03595453404418093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb8cd397-6697-4311-9a81-2a0acf03340d", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 945.6315789473681, 654, 1425, 870.0, 1288.6000000000001, 1395.3, 1425.0, 0.24828487422410975, 297.03502736033977, 0.490265640313623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 4, 16.0, 1435.3599999999997, 501, 3120, 1367.0, 2284.4, 2891.9999999999995, 3120.0, 0.09940634530583356, 0.03167024032478041, 0.04484934719853038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 116.6, 83, 246, 85.0, 246.0, 246.0, 246.0, 0.023666398447484263, 0.006378833956548492, 0.013936365492024424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 83.4, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.023684783947400832, 0.006383789423322881, 0.013924062437827442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 121.84615384615384, 82, 250, 84.0, 249.6, 250.0, 250.0, 0.12627611730079943, 0.0340353597412311, 0.07423654552254029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3eef869-9be9-4d31-9bb3-588eb7ca47d8", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 158.99999999999997, 81, 250, 85.0, 249.6, 250.0, 250.0, 0.1264751379065446, 0.03408900201387335, 0.07447705874770155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 117.0, 84, 244, 85.0, 244.0, 244.0, 244.0, 0.02366662248897135, 0.006332670470681788, 0.013497370638241475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 84.84615384615384, 82, 93, 84.0, 91.4, 93.0, 93.0, 0.1264714466387781, 0.0939890340743263, 0.0634827378636054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 118.8, 84, 252, 86.0, 252.0, 252.0, 252.0, 0.02368422299169631, 0.017601263375664936, 0.011888369743878814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 121.23076923076925, 82, 250, 84.0, 248.4, 250.0, 250.0, 0.12627366417033348, 0.03378807029557751, 0.0720154490971433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 116.8, 88, 225, 90.0, 225.0, 225.0, 225.0, 0.023855986182612803, 0.018777270374205, 0.008480057588350645], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 689.1333333333332, 418, 1653, 561.0, 1321.2000000000003, 1653.0, 1653.0, 0.09333059563586134, 0.01686148456311948, 0.06352678238105015], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1935.2727272727273, 1026, 3843, 1626.0, 3489.4999999999995, 3813.5999999999995, 3843.0, 0.09968915110156512, 0.05159692390998976, 0.045853115399255046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 237.6, 171, 499, 172.0, 499.0, 499.0, 499.0, 0.023656544819689814, 0.036663024051609115, 0.05320412374975161], "isController": false}, {"data": ["addBook", 55, 9, 16.363636363636363, 988.9272727272728, 423, 2240, 762.0, 1696.2, 1914.5999999999988, 2240.0, 0.2791594761953101, 104.32956421778245, 1.0105503644934524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e43dc3b1-9fde-425c-80c4-fbfb9fffb27a", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=293bdb7d-ca27-4439-8769-e6961f3cef29", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 152.05263157894737, 83, 483, 86.0, 342.0, 347.59999999999985, 483.0, 0.24899201915054406, 0.18504192048199614, 0.12036235300734308], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 517.1578947368424, 406, 848, 491.0, 660.4, 780.6999999999997, 848.0, 0.24869326957477816, 73.12407864870111, 0.12507522835059642], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 117.6842105263158, 81, 331, 88.0, 247.8, 258.0999999999999, 331.0, 0.24931111402703054, 0.44116380724314397, 0.12124700662642698], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 789.1052631578945, 567, 1071, 779.0, 979.8, 1049.3, 1071.0, 0.24878227622688942, 223.85472946155002, 0.12487704099670036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 91.875, 84, 120, 88.0, 115.10000000000001, 120.0, 120.0, 0.07907130749348897, 0.0590718263989444, 0.02810737883557616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c3d877b-269a-48a9-b92e-dbf73f147123", 3, 0, 0.0, 1195.6666666666667, 190, 2584, 813.0, 2584.0, 2584.0, 2584.0, 0.04173796903042697, 0.033925686415682346, 0.026765559567038136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 9, 5.389221556886228, 164.6167664670659, 83, 1056, 92.0, 285.4000000000001, 497.19999999999993, 901.6399999999985, 0.694721778487753, 1.58079185932716, 0.33055834622936636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 119.36363636363636, 85, 267, 87.0, 264.40000000000003, 267.0, 267.0, 0.06422045129462592, 0.04973322058265464, 0.022828363546136557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 92.4, 84, 128, 88.0, 109.7, 127.1, 128.0, 0.10253938794239337, 0.08321311658215712, 0.03644954805764764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fca7fec-d94f-4168-8dea-a89868a0266a", 3, 0, 0.0, 484.6666666666667, 173, 1100, 181.0, 1100.0, 1100.0, 1100.0, 0.02722495984318423, 0.02730472046772481, 0.01745871448277114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90d40b2c-f022-48b9-bd97-152d75f36f3d", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd1e9f12-627e-4639-98a8-a53eab0c9bf6", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/933af3d5-6b95-4b2b-b78a-9ae0d8d3ae70", 3, 0, 0.0, 653.6666666666666, 200, 1248, 513.0, 1248.0, 1248.0, 1248.0, 0.02121355687708158, 0.025073706061420318, 0.01360374578380557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 299.2727272727273, 168, 1074, 176.0, 959.6000000000004, 1074.0, 1074.0, 0.06173359149198866, 6.801053417094592, 0.13740437431601987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e4dc716-9be8-458e-a86a-cf91df5f5f10", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 270.3076923076923, 167, 336, 328.0, 335.2, 336.0, 336.0, 0.12616826965070801, 0.19553617571843124, 0.28375539551326223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 94.25, 83, 112, 90.5, 110.80000000000001, 112.0, 112.0, 0.05945980764752226, 0.04929821942651015, 0.021136103499705176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dea18df5-2704-44ea-98a4-1cd1c7609276", 3, 0, 0.0, 430.33333333333337, 230, 793, 268.0, 793.0, 793.0, 793.0, 0.08367734017628026, 0.03878793372754658, 0.05366027348544015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 101.69999999999999, 83, 251, 88.0, 143.50000000000006, 245.74999999999994, 251.0, 0.09335891367568047, 0.07248079723844333, 0.03318617634565204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58eb955e-53cb-4758-aa40-bcd61ea1aca1", 1, 0, 0.0, 1554.0, 1554, 1554, 1554.0, 1554.0, 1554.0, 1554.0, 0.6435006435006435, 0.11625744047619048, 0.44366352960102956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 100.0, 83, 249, 86.5, 155.9000000000001, 249.0, 249.0, 0.07824458278521373, 0.058148562011277, 0.03927511284335924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 126.68750000000001, 82, 254, 84.5, 249.8, 254.0, 254.0, 0.07824726134585289, 0.020937255477308295, 0.04462539123630673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 119.9375, 82, 335, 83.5, 272.70000000000005, 335.0, 335.0, 0.07824611336883751, 0.021089772743944486, 0.04600015649222674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 152.43749999999997, 83, 335, 88.0, 279.70000000000005, 335.0, 335.0, 0.07824611336883751, 0.021089772743944486, 0.04607656871231349], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.30959752321981426], "isController": false}, {"data": ["401/Unauthorized", 9, 69.23076923076923, 0.6965944272445821], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 13, "401/Unauthorized", 9, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
