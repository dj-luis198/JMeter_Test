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

    var data = {"OkPercent": 97.93662490788505, "KoPercent": 2.0633750921149594};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7852179406190777, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1440677966101695, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e40ef988-a572-4a67-ab91-323848682460"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63d4ab47-0891-446f-838c-0ce73e0e722b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06f1f788-b970-419d-bb84-5c460361c2a3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ed13b82-4166-4a20-bf2b-d7df4628d141"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6651dce4-b5bd-4499-9286-984bd8572a70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eeaa73a2-fc4c-4271-983b-3446911076d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5dba19dd-cbb2-48e5-8e7f-e09916d289c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=450f5455-16b2-480e-a531-189dd780baea"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=315a6aee-87cd-459a-aa43-498d69c2bbb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc843940-411b-43bf-bf82-91c45eee6611"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4795b987-ebbe-449d-bbda-ca58faa7edc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1536ac5-531b-47df-8bf2-7afda2596f19"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=476d5c36-d20c-44d8-821f-ee3bc4ffa903"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7dde9596-5a38-459b-97ed-28b399036279"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/315a6aee-87cd-459a-aa43-498d69c2bbb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/450f5455-16b2-480e-a531-189dd780baea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63d4ab47-0891-446f-838c-0ce73e0e722b"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06f1f788-b970-419d-bb84-5c460361c2a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e40ef988-a572-4a67-ab91-323848682460"], "isController": false}, {"data": [0.4576271186440678, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a249782-9615-4a45-835f-cad62bad6e76"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1536ac5-531b-47df-8bf2-7afda2596f19"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ed13b82-4166-4a20-bf2b-d7df4628d141"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0c1edef-c2cf-4435-820e-a9c41abbcd47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da596e8e-1430-4f28-98a2-d9b4c4b47a53"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [0.9830508474576272, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6651dce4-b5bd-4499-9286-984bd8572a70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5dba19dd-cbb2-48e5-8e7f-e09916d289c3"], "isController": false}, {"data": [0.9314285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da596e8e-1430-4f28-98a2-d9b4c4b47a53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc843940-411b-43bf-bf82-91c45eee6611"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4795b987-ebbe-449d-bbda-ca58faa7edc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/476d5c36-d20c-44d8-821f-ee3bc4ffa903"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 28, 2.0633750921149594, 348.64038319823095, 106, 2068, 129.0, 901.2, 1048.3999999999996, 1457.0400000000009, 5.359103367112403, 768.8366254062769, 3.9172723590520273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1641.3728813559321, 1356, 2223, 1604.0, 1953.0, 2033.0, 2223.0, 0.26042011502624063, 313.3712711508583, 1.2804836710518765], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e40ef988-a572-4a67-ab91-323848682460", 3, 0, 0.0, 321.3333333333333, 192, 440, 332.0, 440.0, 440.0, 440.0, 0.025684271808087123, 0.030357939757540475, 0.01647070815818087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63d4ab47-0891-446f-838c-0ce73e0e722b", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 0.23523966471354166, 0.8977254231770833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06f1f788-b970-419d-bb84-5c460361c2a3", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 543.3333333333334, 117, 1306, 435.0, 1115.2, 1306.0, 1306.0, 0.07811523559555056, 0.015302652598112736, 0.05259555771674374], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 543.3333333333334, 117, 1306, 435.0, 1115.2, 1306.0, 1306.0, 0.08003243981560526, 0.015678229909189857, 0.053886425297720676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 159.5, 108, 342, 116.0, 340.6, 342.0, 342.0, 0.11638987699044875, 0.031143385054084923, 0.06637860172111532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 129.3125, 109, 340, 116.0, 186.70000000000016, 340.0, 340.0, 0.11642460051808948, 0.08652257909596298, 0.05843969205693163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 181.56250000000003, 110, 460, 115.5, 379.5000000000001, 460.0, 460.0, 0.11637379262190155, 0.0313663737926219, 0.06852870795996742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 132.43749999999997, 107, 342, 114.5, 228.6000000000001, 342.0, 342.0, 0.1163670215860825, 0.0313645487868738, 0.06841108104963053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ed13b82-4166-4a20-bf2b-d7df4628d141", 3, 0, 0.0, 541.3333333333334, 221, 943, 460.0, 943.0, 943.0, 943.0, 0.01834682844492282, 0.025292584135497446, 0.011765381522297513], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 248.9375, 114, 879, 210.0, 496.10000000000036, 879.0, 879.0, 0.07805982309692591, 0.1397301325553371, 0.05045016276692801], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6651dce4-b5bd-4499-9286-984bd8572a70", 1, 0, 0.0, 1159.0, 1159, 1159, 1159.0, 1159.0, 1159.0, 1159.0, 0.8628127696289906, 0.15587926013805004, 0.5948689603106125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eeaa73a2-fc4c-4271-983b-3446911076d9", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5dba19dd-cbb2-48e5-8e7f-e09916d289c3", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 117.53846153846155, 112, 132, 115.0, 130.4, 132.0, 132.0, 0.06592994182950518, 0.048996763410403744, 0.033093740332388336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 164.92307692307693, 109, 342, 114.0, 341.6, 342.0, 342.0, 0.0659326168655634, 0.02525964137728165, 0.03717624866232864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 700.5714285714286, 549, 914, 756.0, 914.0, 914.0, 914.0, 0.05443107859070161, 16.004544387572604, 0.031042724508759514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 865.8571428571428, 753, 1143, 789.0, 1143.0, 1143.0, 1143.0, 0.05441711496004229, 48.96461569613094, 0.030981619161820954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 243.57142857142858, 111, 346, 326.0, 346.0, 346.0, 346.0, 0.05460857354604673, 0.096631577407653, 0.030237364453719235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 148.9230769230769, 109, 348, 115.0, 342.0, 348.0, 348.0, 0.07629421396418866, 0.05669911799487068, 0.038296119118743144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 131.15384615384616, 108, 336, 115.0, 251.19999999999993, 336.0, 336.0, 0.07628749823951927, 0.03804059595206798, 0.04252202801511666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 283.46153846153845, 112, 1018, 116.0, 996.0, 1018.0, 1018.0, 0.07628794591771465, 10.578018270229508, 0.04384035353594629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=450f5455-16b2-480e-a531-189dd780baea", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 235.69230769230768, 110, 798, 115.0, 703.9999999999999, 798.0, 798.0, 0.0762866028988909, 3.468289713045009, 0.04391408037967256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=315a6aee-87cd-459a-aa43-498d69c2bbb3", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 115.14285714285715, 112, 119, 115.0, 119.0, 119.0, 119.0, 0.05470203022677898, 0.040652583010330874, 0.030716472051169844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 571.95, 111, 1027, 558.0, 1015.3000000000001, 1026.45, 1027.0, 0.10409510128453354, 46.846505999130805, 0.05672369777028293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 212.5384615384615, 106, 968, 114.0, 717.9999999999998, 968.0, 968.0, 0.06593161370160366, 4.579894574398754, 0.03832473158225729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 472.15, 108, 792, 458.0, 789.8, 791.9, 792.0, 0.10410593820271508, 15.319331138866911, 0.056831268999333724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 166.46153846153845, 110, 562, 114.0, 479.19999999999993, 562.0, 562.0, 0.06593094494258936, 1.507625563582789, 0.038388728534405815], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 471.0, 115, 1159, 437.0, 944.8000000000002, 1159.0, 1159.0, 0.08003286683064512, 0.015678313560768955, 0.054418181066357915], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 434.46153846153845, 226, 1131, 234.0, 1109.8, 1131.0, 1131.0, 0.07623739150832748, 14.131733310242199, 0.16845874934025334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc843940-411b-43bf-bf82-91c45eee6611", 3, 0, 0.0, 309.3333333333333, 211, 395, 322.0, 395.0, 395.0, 395.0, 0.01922694849100499, 0.0265059006703796, 0.012329781421640571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 485.29166666666663, 116, 1048, 340.0, 917.0, 1020.25, 1048.0, 0.10572128345638115, 0.06494012431060914, 0.04780171312529734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 126.05000000000001, 109, 345, 114.0, 119.9, 333.74999999999983, 345.0, 0.10421823297985983, 0.0774512454078841, 0.0523126677262187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 174.05, 112, 342, 115.0, 341.9, 342.0, 342.0, 0.10421443161448997, 0.10614809782608696, 0.05505860107757722], "isController": false}, {"data": ["login", 24, 0, 0.0, 2335.1666666666665, 1514, 3278, 2275.5, 3019.0, 3226.5, 3278.0, 0.10347682119205298, 36.24718183976398, 0.2061704926143419], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4795b987-ebbe-449d-bbda-ca58faa7edc5", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 118.15384615384616, 115, 124, 117.0, 123.6, 124.0, 124.0, 0.06852997923014476, 0.055479836700966796, 0.024360266054465517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1536ac5-531b-47df-8bf2-7afda2596f19", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 701.8000000000001, 228, 1141, 785.5, 1131.3, 1140.55, 1141.0, 0.10403391505630835, 62.310981348669664, 0.22066568701396655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 355.75, 225, 683, 266.0, 607.4000000000001, 683.0, 683.0, 0.11627146480244752, 0.1801980611733244, 0.2614972494531608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 640.1666666666667, 111, 1256, 882.5, 1218.8000000000002, 1256.0, 1256.0, 0.09007791739854974, 62.87267099322164, 0.14322447510846884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=476d5c36-d20c-44d8-821f-ee3bc4ffa903", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 865.3333333333333, 125, 1422, 919.5, 1354.0, 1416.75, 1422.0, 0.09868705102531734, 0.030984264555312033, 0.0445248218493131], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7dde9596-5a38-459b-97ed-28b399036279", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/315a6aee-87cd-459a-aa43-498d69c2bbb3", 3, 0, 0.0, 454.33333333333337, 198, 921, 244.0, 921.0, 921.0, 921.0, 0.06839165621794141, 0.03094544340590448, 0.04385793058246894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 122.33333333333333, 111, 143, 120.0, 135.8, 143.0, 143.0, 0.09974675407437783, 0.07744010692297888, 0.035456853987376497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 369.92307692307696, 226, 1086, 235.0, 839.9999999999998, 1086.0, 1086.0, 0.06589117818495147, 6.158013697762234, 0.14689396747256647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/450f5455-16b2-480e-a531-189dd780baea", 3, 0, 0.0, 353.0, 213, 452, 394.0, 452.0, 452.0, 452.0, 0.06332587495250559, 0.041454535979651284, 0.040609366424621096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63d4ab47-0891-446f-838c-0ce73e0e722b", 3, 0, 0.0, 351.6666666666667, 192, 473, 390.0, 473.0, 473.0, 473.0, 0.02156287735035363, 0.025486591034874363, 0.0138277566341786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 392.27272727272725, 226, 1101, 241.5, 826.9999999999999, 1069.3499999999995, 1101.0, 0.11889899530348969, 13.098839687673957, 0.2646410432576163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 115.0, 112, 122, 114.0, 122.0, 122.0, 122.0, 0.04854002394641182, 0.03607320138986269, 0.024364816707476245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 139.11111111111111, 108, 334, 115.0, 334.0, 334.0, 334.0, 0.04854133294500267, 0.012988598854424544, 0.027683728945196835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 163.55555555555554, 110, 335, 116.0, 335.0, 335.0, 335.0, 0.04854133294500267, 0.013083406145332752, 0.02853699456337071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06f1f788-b970-419d-bb84-5c460361c2a3", 3, 0, 0.0, 357.3333333333333, 209, 445, 418.0, 445.0, 445.0, 445.0, 0.03091986601391394, 0.02577662007214635, 0.019828169286266423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 113.55555555555556, 107, 122, 113.0, 122.0, 122.0, 122.0, 0.04854107113963648, 0.013083335580605145, 0.028584244040235154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 122.5, 115, 130, 122.5, 130.0, 130.0, 130.0, 0.11782032400589101, 0.034747790868924884, 0.07283229013254786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e40ef988-a572-4a67-ab91-323848682460", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1052.1016949152545, 871, 1752, 912.0, 1476.0, 1567.0, 1752.0, 0.2534669118278831, 303.2345459022133, 0.5004981403476363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 865.3333333333333, 125, 1422, 919.5, 1354.0, 1416.75, 1422.0, 0.10420601529223274, 0.03271702530903597, 0.04701482330567532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 114.0, 112, 118, 113.5, 118.0, 118.0, 118.0, 0.02870978237984956, 0.0077381835320688265, 0.01690624880375907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 153.66666666666669, 115, 342, 115.0, 342.0, 342.0, 342.0, 0.028709370259963347, 0.007738072452880745, 0.016877969625486263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a249782-9615-4a45-835f-cad62bad6e76", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1536ac5-531b-47df-8bf2-7afda2596f19", 3, 0, 0.0, 526.0, 264, 879, 435.0, 879.0, 879.0, 879.0, 0.029376915619706036, 0.02405043710402366, 0.01883871216498076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ed13b82-4166-4a20-bf2b-d7df4628d141", 1, 0, 0.0, 802.0, 802, 802, 802.0, 802.0, 802.0, 802.0, 1.2468827930174564, 0.22526691084788028, 0.8596672381546134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 200.44444444444446, 108, 345, 116.0, 339.6, 345.0, 345.0, 0.09958506224066391, 0.02684128630705394, 0.0585451244813278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 138.38888888888889, 109, 339, 114.0, 335.4, 339.0, 339.0, 0.09970697228700097, 0.026874144874230732, 0.05871416434478671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 114.33333333333334, 113, 116, 114.5, 116.0, 116.0, 116.0, 0.028709370259963347, 0.007681999464091755, 0.016373312726385345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 114.44444444444443, 111, 119, 114.5, 117.2, 119.0, 119.0, 0.09970586769031357, 0.07409781768782092, 0.05004767186798943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 115.5, 113, 119, 115.0, 119.0, 119.0, 119.0, 0.02870950763194411, 0.021335874324130342, 0.014410827073065697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 124.77777777777777, 106, 333, 113.0, 140.40000000000032, 333.0, 333.0, 0.09970697228700097, 0.026679404693982684, 0.056864132632430245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 118.33333333333333, 116, 123, 117.0, 123.0, 123.0, 123.0, 0.03008755478442267, 0.02368219644164519, 0.010695185489775246], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 472.26666666666665, 111, 995, 418.0, 950.6, 995.0, 995.0, 0.08122904967427151, 0.015616496333862223, 0.05527911824512761], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1314.0833333333335, 982, 2068, 1247.0, 1821.0, 2042.5, 2068.0, 0.10473717515110519, 0.05420967073250561, 0.04817500927360405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 270.0, 229, 457, 234.0, 457.0, 457.0, 457.0, 0.0286935812458753, 0.04446944671601963, 0.064532536727784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0c1edef-c2cf-4435-820e-a9c41abbcd47", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da596e8e-1430-4f28-98a2-d9b4c4b47a53", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 0.6294915069686412, 2.4022756968641117], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1013.8448275862066, 583, 1847, 908.0, 1597.9, 1691.4499999999996, 1847.0, 0.28275579649382815, 88.57831878522259, 1.0273178129448528], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 196.8983050847458, 110, 809, 116.0, 462.0, 493.0, 809.0, 0.2545846817691478, 0.18919818635382957, 0.12306583737864078], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 640.406779661017, 534, 917, 570.0, 809.0, 897.0, 917.0, 0.2549201754196462, 74.95499571982545, 0.12820692416124782], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 187.81355932203394, 109, 469, 117.0, 342.0, 366.0, 469.0, 0.25514285837841577, 0.45148326111493103, 0.12408314792231549], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 848.1525423728814, 735, 1150, 792.0, 1019.0, 1074.0, 1150.0, 0.2543881963876876, 228.89894627639276, 0.1276909501399135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6651dce4-b5bd-4499-9286-984bd8572a70", 3, 0, 0.0, 427.3333333333333, 199, 554, 529.0, 554.0, 554.0, 554.0, 0.035579169582181956, 0.029660889746083326, 0.02281606903544871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 129.6363636363636, 115, 326, 118.0, 135.5, 297.64999999999964, 326.0, 0.11868027533823879, 0.08866251038452408, 0.042187129124139564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dba19dd-cbb2-48e5-8e7f-e09916d289c3", 3, 0, 0.0, 285.3333333333333, 197, 459, 200.0, 459.0, 459.0, 459.0, 0.03229939384804212, 0.026926675665636675, 0.020712827435105136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, 6.857142857142857, 167.69714285714284, 112, 426, 120.0, 316.20000000000005, 358.0, 425.24, 0.7218072403453125, 1.593216281548132, 0.3441594644912084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 168.55555555555554, 116, 348, 118.0, 348.0, 348.0, 348.0, 0.05015771815820859, 0.03884284228462833, 0.01782950137655071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 133.4375, 114, 337, 119.0, 192.10000000000014, 337.0, 337.0, 0.12593368017567746, 0.10219813303319139, 0.04476548787494786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 282.0, 228, 452, 239.0, 452.0, 452.0, 452.0, 0.04851019792160752, 0.07518133213046009, 0.10910057208345911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 316.2777777777777, 222, 459, 233.5, 456.3, 459.0, 459.0, 0.09952064223987792, 0.1542375578463733, 0.22382425691253796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da596e8e-1430-4f28-98a2-d9b4c4b47a53", 3, 0, 0.0, 347.3333333333333, 209, 446, 387.0, 446.0, 446.0, 446.0, 0.07576331540268202, 0.03354105108972902, 0.04858519900497512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc843940-411b-43bf-bf82-91c45eee6611", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4795b987-ebbe-449d-bbda-ca58faa7edc5", 3, 0, 0.0, 494.33333333333337, 217, 995, 271.0, 995.0, 995.0, 995.0, 0.06982102543812695, 0.031592195754881654, 0.044774550818069685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 155.0, 112, 351, 119.0, 348.6, 351.0, 351.0, 0.07246336419529434, 0.06007948847832509, 0.025758461491296035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 129.49999999999997, 113, 334, 118.0, 135.8, 324.14999999999986, 334.0, 0.10193576008399508, 0.07913957936208602, 0.03623497721735762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/476d5c36-d20c-44d8-821f-ee3bc4ffa903", 3, 0, 0.0, 306.3333333333333, 228, 378, 313.0, 378.0, 378.0, 378.0, 0.029691211401425176, 0.02977819737232779, 0.01904026251979414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 125.31818181818183, 110, 339, 115.0, 121.7, 306.44999999999953, 339.0, 0.1189767995240928, 0.08841928167757288, 0.05972077632361689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 204.63636363636365, 111, 342, 118.5, 339.7, 341.7, 342.0, 0.11897551267630008, 0.04808030306307865, 0.06694485079389115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 224.45454545454547, 109, 990, 115.5, 643.5999999999997, 957.2999999999995, 990.0, 0.11897551267630008, 9.76136832993532, 0.06901509231418188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 203.72727272727275, 112, 775, 115.0, 483.4999999999999, 740.4999999999995, 775.0, 0.11897551267630008, 3.2094024792874447, 0.06913127933827982], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5158437730287398], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.2210759027266028], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.14738393515106854], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.1790714812085483], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 28, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
