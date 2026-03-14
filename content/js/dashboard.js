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

    var data = {"OkPercent": 98.83211678832117, "KoPercent": 1.167883211678832};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8365746549560853, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4915254237288136, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f712edf-f1bf-444d-a8df-1886dc535d80"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e622dff4-f837-430a-affb-c6b14f8b5c02"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e89d7c4e-43d0-41e0-9e61-bfa78ed6c7d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e0ab25a-d2ba-45d8-8800-7e0bef9052c8"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6a2b2d8-f987-4f25-aa4c-f86f03c347b4"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6f1f36fe-b280-4f6c-ac64-6c1539073549"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae385072-5dd0-45ac-858b-c3e57049e727"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcbf5e2f-91bc-424f-8256-b46aa5049540"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22dea284-d0c6-41e9-aeaf-6b38e330ac8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/306ce102-85c5-413e-a26a-28d020921f51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8783bf4-155e-48cf-aff0-d46a65f323cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=306e6acb-b8c1-4dcb-bd2f-2d51f21ab915"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09351818-0c4d-4a5e-8a55-80dd3f19f310"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad0e2b34-5799-41ed-92cc-c36a902b5afd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e622dff4-f837-430a-affb-c6b14f8b5c02"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f4db508-0ab6-4bb0-bbb5-e30237b6f1a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e89d7c4e-43d0-41e0-9e61-bfa78ed6c7d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42b301ba-603e-44c2-b362-59c9a7debbef"], "isController": false}, {"data": [0.4180327868852459, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e0ab25a-d2ba-45d8-8800-7e0bef9052c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8389830508474576, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9530386740331491, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f4db508-0ab6-4bb0-bbb5-e30237b6f1a0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad0e2b34-5799-41ed-92cc-c36a902b5afd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42b301ba-603e-44c2-b362-59c9a7debbef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22dea284-d0c6-41e9-aeaf-6b38e330ac8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f1f36fe-b280-4f6c-ac64-6c1539073549"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18c46574-12d4-4daa-91c8-6a209bc11c08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae385072-5dd0-45ac-858b-c3e57049e727"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/306e6acb-b8c1-4dcb-bd2f-2d51f21ab915"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f712edf-f1bf-444d-a8df-1886dc535d80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8783bf4-155e-48cf-aff0-d46a65f323cc"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dcbf5e2f-91bc-424f-8256-b46aa5049540"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1370, 16, 1.167883211678832, 274.0503649635035, 80, 1931, 98.5, 673.6000000000004, 829.45, 1323.249999999999, 5.2827423988277715, 759.9565354657104, 3.860621728411129], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1200.559322033898, 986, 1581, 1172.0, 1430.0, 1451.0, 1581.0, 0.26343166627226333, 316.9972532923377, 1.295291445000826], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4f712edf-f1bf-444d-a8df-1886dc535d80", 3, 0, 0.0, 300.3333333333333, 169, 490, 242.0, 490.0, 490.0, 490.0, 0.021423062641035162, 0.02953342131666143, 0.013738096810820074], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 451.93333333333334, 88, 701, 405.0, 684.8, 701.0, 701.0, 0.0817064667944919, 0.015383795701150426, 0.05527421200921649], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 451.93333333333334, 88, 701, 405.0, 684.8, 701.0, 701.0, 0.08131006781259656, 0.015309161205340444, 0.0550060491302533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 114.0952380952381, 81, 247, 84.0, 245.0, 246.8, 247.0, 0.13351134846461948, 0.06437154300972726, 0.0745413527560557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 91.85714285714288, 82, 244, 84.0, 88.4, 228.49999999999977, 244.0, 0.13350625572169666, 0.09921705137129998, 0.06701388226655478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 192.66666666666669, 81, 576, 84.0, 572.0, 575.6, 576.0, 0.13309502985131386, 5.62137108082671, 0.07674131673765068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 184.1428571428571, 82, 741, 84.0, 695.8000000000001, 739.6, 741.0, 0.1329644098596276, 17.122376871394923, 0.0765361544476595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e622dff4-f837-430a-affb-c6b14f8b5c02", 3, 0, 0.0, 593.6666666666666, 198, 1188, 395.0, 1188.0, 1188.0, 1188.0, 0.05235053921055387, 0.033656352519805956, 0.033571146564059615], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 200.00000000000003, 84, 284, 193.0, 261.2, 284.0, 284.0, 0.08111966773384097, 0.1598310953318335, 0.05243731646675175], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 84.375, 82, 87, 84.5, 87.0, 87.0, 87.0, 0.09748785971496987, 0.0724494738702071, 0.04893433583349074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 103.99999999999999, 81, 249, 83.5, 247.6, 249.0, 249.0, 0.0974902357435763, 0.03523786475057732, 0.055088171540162933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 495.8333333333333, 403, 593, 495.0, 593.0, 593.0, 593.0, 0.0625854029978408, 18.40218651232411, 0.03569323764720608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 744.0, 731, 757, 743.5, 757.0, 757.0, 757.0, 0.062472017742053035, 56.212431378393006, 0.035567564788688395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 112.0, 81, 255, 83.5, 255.0, 255.0, 255.0, 0.06291484475762056, 0.11132978388750825, 0.03483663767340904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 96.23076923076923, 82, 244, 84.0, 181.59999999999994, 244.0, 244.0, 0.07548440666353116, 0.05609729831147189, 0.03788963381353029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e89d7c4e-43d0-41e0-9e61-bfa78ed6c7d8", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 120.76923076923077, 80, 249, 83.0, 248.6, 249.0, 249.0, 0.07541303137182105, 0.020178877535038057, 0.043008994454241695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 119.69230769230768, 80, 247, 83.0, 246.2, 247.0, 247.0, 0.07548659822548427, 0.02034599717796256, 0.04437786340990384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 165.30769230769232, 83, 334, 84.0, 300.0, 334.0, 334.0, 0.07541521879115207, 0.0203267581898027, 0.044409547784242866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 113.5, 83, 245, 84.5, 245.0, 245.0, 245.0, 0.06291418505158963, 0.046755561351816126, 0.035327789457679726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 488.6666666666667, 83, 821, 567.0, 770.6, 821.0, 821.0, 0.07043344743551819, 42.257087879225416, 0.037371913841111534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 123.99999999999999, 82, 570, 84.0, 340.4000000000002, 570.0, 570.0, 0.09748964172556666, 5.507218660507555, 0.05678962039970753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 393.2000000000001, 83, 670, 409.0, 611.8000000000001, 670.0, 670.0, 0.07043311671236993, 13.812777917339695, 0.037440520700293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 124.62499999999999, 82, 412, 83.5, 296.5000000000001, 412.0, 412.0, 0.09748964172556666, 1.816208700188886, 0.05688482512795515], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 389.2857142857142, 88, 758, 381.0, 698.5, 758.0, 758.0, 0.07843269074550273, 0.014810079090965112, 0.05367627852288834], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 275.3846153846154, 166, 490, 329.0, 460.4, 490.0, 490.0, 0.07537542761059896, 0.11681719103322317, 0.16952110330782166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e0ab25a-d2ba-45d8-8800-7e0bef9052c8", 3, 0, 0.0, 240.66666666666666, 170, 350, 202.0, 350.0, 350.0, 350.0, 0.10956502684343158, 0.04957532139074541, 0.07026142671925788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 493.9130434782609, 96, 1604, 492.0, 989.0000000000003, 1502.1999999999985, 1604.0, 0.09347313663334146, 0.05741660443590994, 0.04226373267698935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 94.99999999999999, 81, 247, 84.0, 151.00000000000006, 247.0, 247.0, 0.07043245527539091, 0.05234286959430906, 0.035353791026905196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 186.99999999999997, 80, 333, 245.0, 283.20000000000005, 333.0, 333.0, 0.07043443962359835, 0.08937286642343308, 0.036226046420991344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6a2b2d8-f987-4f25-aa4c-f86f03c347b4", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["login", 23, 0, 0.0, 2144.434782608696, 1171, 3255, 2102.0, 3167.2000000000003, 3247.2, 3255.0, 0.09609358679757678, 30.121357321913518, 0.18655260993315229], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6f1f36fe-b280-4f6c-ac64-6c1539073549", 3, 0, 0.0, 890.3333333333334, 246, 1381, 1044.0, 1381.0, 1381.0, 1381.0, 0.015426861250809911, 0.02126717363189452, 0.009892876518260261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 110.43750000000001, 83, 250, 88.5, 245.8, 250.0, 250.0, 0.10051766597979596, 0.08137611825903403, 0.035730889078755594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae385072-5dd0-45ac-858b-c3e57049e727", 3, 0, 0.0, 525.6666666666666, 164, 997, 416.0, 997.0, 997.0, 997.0, 0.03030456083640588, 0.030393343729481284, 0.019433588817617052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcbf5e2f-91bc-424f-8256-b46aa5049540", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 597.2, 166, 907, 660.0, 856.6, 907.0, 907.0, 0.07040468613590921, 56.18869200267303, 0.14633265656828784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 316.66666666666663, 168, 972, 174.0, 790.6000000000001, 957.0999999999998, 972.0, 0.132891206399028, 22.888545114191515, 0.29401808625588516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 664.625, 84, 1003, 819.5, 1003.0, 1003.0, 1003.0, 0.08234519104084322, 73.89061567183383, 0.15289949962430008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22dea284-d0c6-41e9-aeaf-6b38e330ac8f", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/306ce102-85c5-413e-a26a-28d020921f51", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8783bf4-155e-48cf-aff0-d46a65f323cc", 3, 0, 0.0, 499.6666666666667, 238, 834, 427.0, 834.0, 834.0, 834.0, 0.039074201909426, 0.02512094686559777, 0.025057349531760812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=306e6acb-b8c1-4dcb-bd2f-2d51f21ab915", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 917.1739130434781, 95, 1707, 977.0, 1583.0000000000005, 1701.3999999999999, 1707.0, 0.09986106286905176, 0.031460983631469264, 0.04505450297412296], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 240.25, 166, 655, 171.0, 428.9000000000002, 655.0, 655.0, 0.09743858324299964, 7.427223892930222, 0.217583496492211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 117.64705882352939, 84, 252, 89.0, 249.6, 252.0, 252.0, 0.09524556547852493, 0.0739455317924095, 0.03385682210369441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 310.3529411764706, 165, 831, 174.0, 812.6, 831.0, 831.0, 0.09645280620929124, 13.707318968366316, 0.2140212859286703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09351818-0c4d-4a5e-8a55-80dd3f19f310", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 116.07692307692308, 82, 340, 84.0, 302.4, 340.0, 340.0, 0.07428698777693331, 0.0552074196271936, 0.037288585661468476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 120.61538461538461, 81, 248, 83.0, 247.6, 248.0, 248.0, 0.07428868583314761, 0.0198780272639477, 0.042367766139217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 121.30769230769229, 82, 250, 84.0, 248.4, 250.0, 250.0, 0.07421701053881549, 0.020003803621790113, 0.043631484711295826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 122.07692307692308, 82, 252, 84.0, 250.8, 252.0, 252.0, 0.07421785795843801, 0.020004032027860243, 0.04370446127825988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 3.3513849431818183, 7.0245916193181825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad0e2b34-5799-41ed-92cc-c36a902b5afd", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 774.8135593220339, 648, 1210, 663.0, 1056.0, 1081.0, 1210.0, 0.2534288058348761, 303.1889578867904, 0.500422895896601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e622dff4-f837-430a-affb-c6b14f8b5c02", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 917.1739130434781, 95, 1707, 977.0, 1583.0000000000005, 1701.3999999999999, 1707.0, 0.096652462956893, 0.030450122076262996, 0.04360687293562946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 104.75, 82, 248, 83.0, 248.0, 248.0, 248.0, 0.05042133326610489, 0.013590124981879833, 0.029691468710411374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 84.5, 82, 90, 84.0, 90.0, 90.0, 90.0, 0.050421651056963855, 0.013590210636447289, 0.029642415953410394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 130.0, 81, 720, 83.0, 342.39999999999964, 720.0, 720.0, 0.0964074063572178, 5.127253567428474, 0.056189656761278246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 141.35294117647058, 82, 409, 83.0, 349.79999999999995, 409.0, 409.0, 0.0964052194920012, 1.6918872349565326, 0.0562825279008047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 84.94117647058822, 83, 95, 84.0, 89.39999999999999, 95.0, 95.0, 0.0964052194920012, 0.0716448945638798, 0.04839090119032092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 104.5, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.050421651056963855, 0.013491730849226658, 0.0287560978684247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 112.58823529411765, 81, 253, 84.0, 246.6, 253.0, 253.0, 0.0964052194920012, 0.034313346735549144, 0.054504835147074666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 104.75, 84, 246, 85.0, 246.0, 246.0, 246.0, 0.05042133326610489, 0.037471322866704904, 0.025309145799587804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 108.0, 84, 247, 87.0, 247.0, 247.0, 247.0, 0.04889138778204219, 0.03848286968000587, 0.01737936050064781], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 484.8571428571429, 85, 1044, 411.0, 1020.5, 1044.0, 1044.0, 0.0761917201369274, 0.014238115112083461, 0.0518556510446429], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1134.6521739130435, 760, 1911, 1085.0, 1488.6000000000001, 1838.999999999999, 1911.0, 0.09476603091020713, 0.049048824592197046, 0.043588672420612845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f4db508-0ab6-4bb0-bbb5-e30237b6f1a0", 3, 0, 0.0, 315.0, 182, 477, 286.0, 477.0, 477.0, 477.0, 0.04908778532275219, 0.03155871614988137, 0.03147882066595762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 211.0, 169, 496, 170.0, 496.0, 496.0, 496.0, 0.05039433567666995, 0.07810137765515157, 0.11333804205407313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e89d7c4e-43d0-41e0-9e61-bfa78ed6c7d8", 3, 0, 0.0, 303.3333333333333, 284, 342, 284.0, 342.0, 342.0, 342.0, 0.03428493063015702, 0.02858193598432036, 0.021986104603323352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42b301ba-603e-44c2-b362-59c9a7debbef", 3, 0, 0.0, 255.66666666666666, 173, 350, 244.0, 350.0, 350.0, 350.0, 0.0200407495240322, 0.02368748747453155, 0.012851652526804503], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 857.7704918032787, 430, 2805, 708.0, 1275.8000000000004, 1771.8, 2805.0, 0.28267830745204897, 95.33133586788033, 1.0266593375943613], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e0ab25a-d2ba-45d8-8800-7e0bef9052c8", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 149.8813559322034, 82, 354, 85.0, 337.0, 341.0, 354.0, 0.25405300665274394, 0.18880306451439274, 0.12280882645811354], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 467.4745762711864, 400, 676, 415.0, 578.0, 653.0, 676.0, 0.25400706914589044, 74.68651215735953, 0.1277476959083336], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 132.62711864406776, 81, 338, 86.0, 249.0, 249.0, 338.0, 0.25437393831216426, 0.4501226330289469, 0.1237092004682205], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 620.1186440677965, 564, 830, 573.0, 735.0, 741.0, 830.0, 0.2538431421478572, 228.4085055132902, 0.12741735846093613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 85.4705882352941, 83, 89, 85.0, 89.0, 89.0, 89.0, 0.0970064937288155, 0.07247067158451548, 0.03448277706766488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, 3.314917127071823, 153.29281767955803, 83, 1931, 90.0, 243.40000000000003, 350.50000000000034, 1364.3800000000047, 0.7523891473061559, 1.6295892230646762, 0.36146699775945995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 88.69230769230771, 83, 96, 87.0, 95.6, 96.0, 96.0, 0.07707814538124037, 0.059690399694651966, 0.027398871990987787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 87.28571428571429, 83, 94, 87.0, 91.6, 93.8, 94.0, 0.12704635376964682, 0.10310109373298486, 0.04516100856655414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 264.2307692307693, 166, 591, 170.0, 551.4, 591.0, 591.0, 0.07418058979275086, 0.11496542578231991, 0.16683388505146993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f4db508-0ab6-4bb0-bbb5-e30237b6f1a0", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 275.2352941176471, 167, 804, 173.0, 497.59999999999974, 804.0, 804.0, 0.0963587720491543, 6.921646325046479, 0.21526288408889946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad0e2b34-5799-41ed-92cc-c36a902b5afd", 3, 0, 0.0, 256.3333333333333, 169, 370, 230.0, 370.0, 370.0, 370.0, 0.06989585517578807, 0.032399641201276766, 0.04482253733603597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42b301ba-603e-44c2-b362-59c9a7debbef", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22dea284-d0c6-41e9-aeaf-6b38e330ac8f", 3, 0, 0.0, 239.0, 182, 351, 184.0, 351.0, 351.0, 351.0, 0.0859131132048455, 0.03803445115839515, 0.055094021163263555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.3076923076923, 83, 91, 86.0, 89.8, 91.0, 91.0, 0.07304273561900909, 0.06055984623099484, 0.025964409927069637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f1f36fe-b280-4f6c-ac64-6c1539073549", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18c46574-12d4-4daa-91c8-6a209bc11c08", 2, 0, 0.0, 220.0, 193, 247, 220.0, 247.0, 247.0, 247.0, 0.016855163579362537, 0.028550079324613595, 0.010476866814711187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 92.99999999999999, 85, 119, 87.0, 109.4, 119.0, 119.0, 0.07268991451666053, 0.05643406449291516, 0.025838993050844174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae385072-5dd0-45ac-858b-c3e57049e727", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/306e6acb-b8c1-4dcb-bd2f-2d51f21ab915", 3, 0, 0.0, 293.6666666666667, 188, 447, 246.0, 447.0, 447.0, 447.0, 0.02836182120707911, 0.028629559753630313, 0.018187756438133414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f712edf-f1bf-444d-a8df-1886dc535d80", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 94.35294117647058, 82, 254, 84.0, 122.79999999999988, 254.0, 254.0, 0.09663483401546158, 0.07181553582594362, 0.04850615691791724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 138.1176470588235, 81, 332, 83.0, 267.19999999999993, 332.0, 332.0, 0.09650098771599193, 0.04287331336141323, 0.05408224012851661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8783bf4-155e-48cf-aff0-d46a65f323cc", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 170.88235294117646, 81, 740, 84.0, 727.2, 740.0, 740.0, 0.09663648197729612, 10.25282652827754, 0.05583465853214868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcbf5e2f-91bc-424f-8256-b46aa5049540", 3, 0, 0.0, 362.66666666666663, 168, 663, 257.0, 663.0, 663.0, 663.0, 0.04851699712132484, 0.04044662422777113, 0.031112787867516253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 162.2941176470588, 80, 585, 84.0, 444.1999999999999, 585.0, 585.0, 0.09654757239648112, 3.3627483970263348, 0.055877573063795226], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.43795620437956206], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.072992700729927], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.072992700729927], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.583941605839416], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1370, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
