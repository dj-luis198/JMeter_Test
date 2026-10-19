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

    var data = {"OkPercent": 99.46808510638297, "KoPercent": 0.5319148936170213};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8386571056062582, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.34210526315789475, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0c33a3b-60d5-4924-bc8d-bee29e9ab95c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60877b5a-0137-416b-a96d-fe2277571fa3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/728b0a2d-7b4f-4458-ac92-c0fd5402330e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ced222f6-3813-400e-91a6-4254d8faefd1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6b3de45-fc71-4bc1-85fc-04d48e0f9d7b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3be99a4-2f85-49ad-8c86-557b48c531dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70437e50-20b8-49ee-a55a-a5e77ed2dce0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/657f87cf-23ba-4ed6-a9a4-cb6892e35b32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2091926f-0af4-4232-93e7-27029d529644"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d6945a8-a213-45cd-a79e-a2ea5edb8cb0"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2704fcd2-9462-4e60-bbe7-0e2841c8a61f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83bbb4ac-c450-4766-bb79-d358a54ba0c3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81e4c8ee-d394-4290-bfb4-0bbc27c6f922"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce7cdc67-4da1-4b45-829f-c1e45afbff0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6b3de45-fc71-4bc1-85fc-04d48e0f9d7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=657f87cf-23ba-4ed6-a9a4-cb6892e35b32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aafb0218-dcba-4f3f-bdb4-8c2b61207dab"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee2f806b-0a39-417c-88f9-54651643648f"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba103b8f-e8e3-4df8-bb71-27a0e3ab87b1"], "isController": false}, {"data": [0.6304347826086957, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cfa9cad-39e3-42b4-a184-f095bc7df96c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4e7998d-db69-42ce-921a-7ddaefcce22e"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2091926f-0af4-4232-93e7-27029d529644"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6304347826086957, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3be99a4-2f85-49ad-8c86-557b48c531dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2704fcd2-9462-4e60-bbe7-0e2841c8a61f"], "isController": false}, {"data": [0.3898305084745763, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60877b5a-0137-416b-a96d-fe2277571fa3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d6945a8-a213-45cd-a79e-a2ea5edb8cb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f0456d7-e6ce-4fea-bb9a-19e9fae414ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70437e50-20b8-49ee-a55a-a5e77ed2dce0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81e4c8ee-d394-4290-bfb4-0bbc27c6f922"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ced222f6-3813-400e-91a6-4254d8faefd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0c33a3b-60d5-4924-bc8d-bee29e9ab95c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=728b0a2d-7b4f-4458-ac92-c0fd5402330e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cfa9cad-39e3-42b4-a184-f095bc7df96c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 7, 0.5319148936170213, 289.90425531914934, 77, 1644, 86.0, 798.3, 998.9999999999973, 1336.9199999999983, 5.22809345415685, 754.3329716196661, 3.801655852604313], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1353.7368421052633, 966, 1766, 1343.0, 1675.6000000000001, 1708.7999999999997, 1766.0, 0.24579984130817265, 295.77969825374305, 1.2085958994010246], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0c33a3b-60d5-4924-bc8d-bee29e9ab95c", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60877b5a-0137-416b-a96d-fe2277571fa3", 3, 0, 0.0, 649.0, 180, 1286, 481.0, 1286.0, 1286.0, 1286.0, 0.02786679671171799, 0.02794843771770935, 0.017870309089220195], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 582.5, 413, 1132, 503.0, 1000.0, 1132.0, 1132.0, 0.07919492699924764, 0.014307677241075015, 0.053827801944801135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 582.5, 413, 1132, 503.0, 1000.0, 1132.0, 1132.0, 0.08021038036908233, 0.014491133172148665, 0.05451799290711065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/728b0a2d-7b4f-4458-ac92-c0fd5402330e", 3, 0, 0.0, 396.66666666666663, 186, 741, 263.0, 741.0, 741.0, 741.0, 0.030227918505531706, 0.025199771905164946, 0.019384439927049957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 110.1875, 79, 243, 80.0, 241.6, 243.0, 243.0, 0.10295281543777468, 0.06620549703688929, 0.056553670589597906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 80.87500000000001, 80, 83, 81.0, 82.3, 83.0, 83.0, 0.10295149054454904, 0.0765098479535174, 0.05167682240224434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 268.5625, 78, 637, 237.5, 635.6, 637.0, 637.0, 0.10284693162607426, 7.580893530928001, 0.05835358132299722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ced222f6-3813-400e-91a6-4254d8faefd1", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 331.31250000000006, 77, 1146, 81.0, 1032.6000000000001, 1146.0, 1146.0, 0.10284627053711465, 23.1561039663307, 0.058252770421412595], "isController": false}, {"data": ["goToProfile", 16, 0, 0.0, 198.87499999999997, 174, 296, 180.0, 285.5, 296.0, 296.0, 0.08534334695270912, 0.1600291934253619, 0.055173140315130306], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a6b3de45-fc71-4bc1-85fc-04d48e0f9d7b", 3, 0, 0.0, 396.0, 193, 799, 196.0, 799.0, 799.0, 799.0, 0.03299567756623883, 0.027507138752323444, 0.021159337501787265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3be99a4-2f85-49ad-8c86-557b48c531dd", 3, 0, 0.0, 391.6666666666667, 176, 644, 355.0, 644.0, 644.0, 644.0, 0.05098312458576211, 0.032777236672161515, 0.03269425632615604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70437e50-20b8-49ee-a55a-a5e77ed2dce0", 3, 0, 0.0, 346.6666666666667, 296, 402, 342.0, 402.0, 402.0, 402.0, 0.07797270955165693, 0.03619436322287199, 0.05000203053931124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 80.99999999999999, 77, 84, 81.0, 83.2, 84.0, 84.0, 0.09317008472997117, 0.06924065867139459, 0.04676701518672381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/657f87cf-23ba-4ed6-a9a4-cb6892e35b32", 3, 0, 0.0, 310.0, 182, 416, 332.0, 416.0, 416.0, 416.0, 0.04469340325367976, 0.028326190148084143, 0.02866080872713188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 108.35294117647061, 77, 242, 81.0, 240.4, 242.0, 242.0, 0.09308998516036118, 0.02490884368548727, 0.05309038216176849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 578.6666666666666, 474, 633, 629.0, 633.0, 633.0, 633.0, 0.050250414565920165, 14.775290353176663, 0.028658439557126346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 839.3333333333334, 682, 958, 878.0, 958.0, 958.0, 958.0, 0.05020584396023697, 45.175306647881314, 0.02858399123908023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 185.66666666666666, 79, 240, 238.0, 240.0, 240.0, 240.0, 0.05057998381440518, 0.08950286198408416, 0.02800669025660912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 81.73333333333332, 80, 84, 82.0, 83.4, 84.0, 84.0, 0.08013762301125132, 0.059555401476135014, 0.04022533030056951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 101.2, 79, 240, 80.0, 238.2, 240.0, 240.0, 0.08013847929221696, 0.02144330402936274, 0.045703976471342486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 101.33333333333334, 79, 238, 81.0, 236.8, 238.0, 238.0, 0.08007131685287695, 0.021581722120501995, 0.04707317650921087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2091926f-0af4-4232-93e7-27029d529644", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 143.46666666666667, 80, 241, 81.0, 240.4, 241.0, 241.0, 0.08007388150133189, 0.021582413373405863, 0.04715288139189759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 79.33333333333333, 78, 80, 80.0, 80.0, 80.0, 80.0, 0.05071679740329997, 0.037690901195225855, 0.028478670416892074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 555.0588235294117, 79, 1038, 759.0, 1028.4, 1038.0, 1038.0, 0.1307028739255455, 69.19490333273107, 0.0702317717543401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 99.23529411764706, 77, 243, 81.0, 241.4, 243.0, 243.0, 0.09317263793660972, 0.02511293756885184, 0.0547753203494522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 414.35294117647055, 80, 715, 609.0, 714.2, 715.0, 715.0, 0.1307028739255455, 22.62096743191918, 0.07035941127965802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 108.70588235294117, 78, 242, 81.0, 241.2, 242.0, 242.0, 0.09308998516036118, 0.0250906600627536, 0.05481763774579863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d6945a8-a213-45cd-a79e-a2ea5edb8cb0", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 527.6153846153846, 398, 1550, 418.0, 1162.3999999999996, 1550.0, 1550.0, 0.09613393675865944, 0.0173679475589375, 0.06627984311681012], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2704fcd2-9462-4e60-bbe7-0e2841c8a61f", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 226.26666666666668, 162, 322, 164.0, 322.0, 322.0, 322.0, 0.08003628311501214, 0.12404060674172292, 0.18000347657604782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83bbb4ac-c450-4766-bb79-d358a54ba0c3", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81e4c8ee-d394-4290-bfb4-0bbc27c6f922", 3, 0, 0.0, 359.0, 175, 621, 281.0, 621.0, 621.0, 621.0, 0.04481290611696168, 0.028810380722981557, 0.028737443050265148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 369.30434782608694, 127, 945, 329.0, 673.8000000000003, 905.7999999999995, 945.0, 0.10030615181990249, 0.06161383739718619, 0.04535326981700669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 90.94117647058823, 79, 240, 82.0, 114.39999999999989, 240.0, 240.0, 0.13086083335257756, 0.09725106853643704, 0.06568600424143055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce7cdc67-4da1-4b45-829f-c1e45afbff0b", 2, 0, 0.0, 191.0, 174, 208, 191.0, 208.0, 208.0, 208.0, 0.03300602359930687, 0.0291703626536843, 0.0205159511923426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 146.64705882352942, 80, 243, 82.0, 241.4, 243.0, 243.0, 0.13086486278434242, 0.15063592144259266, 0.06816880605057542], "isController": false}, {"data": ["login", 23, 0, 0.0, 1667.0434782608697, 1101, 2402, 1522.0, 2283.8, 2380.9999999999995, 2402.0, 0.10067584129985643, 15.851901084070894, 0.17367352055756907], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 83.05882352941177, 81, 85, 83.0, 84.2, 85.0, 85.0, 0.09269356597600872, 0.07504195917393675, 0.03294966603053435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6b3de45-fc71-4bc1-85fc-04d48e0f9d7b", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=657f87cf-23ba-4ed6-a9a4-cb6892e35b32", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aafb0218-dcba-4f3f-bdb4-8c2b61207dab", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 647.7058823529412, 163, 1121, 839.0, 1112.2, 1121.0, 1121.0, 0.1306175135035459, 92.00332840556354, 0.2741031931179937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee2f806b-0a39-417c-88f9-54651643648f", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 458.625, 162, 1226, 322.5, 1114.0, 1226.0, 1226.0, 0.10279275054126807, 30.863448062356653, 0.22460818294539778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 919.6666666666666, 761, 1039, 959.0, 1039.0, 1039.0, 1039.0, 0.0501378791677112, 59.982334231637, 0.1130550419904738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba103b8f-e8e3-4df8-bb71-27a0e3ab87b1", 2, 0, 0.0, 257.0, 175, 339, 257.0, 339.0, 339.0, 339.0, 0.017400988376139764, 0.02921972608669172, 0.010816141700598593], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 686.521739130435, 178, 1478, 519.0, 1196.0000000000005, 1441.1999999999994, 1478.0, 0.10206526852040862, 0.03262344350465506, 0.04604897857073123], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cfa9cad-39e3-42b4-a184-f095bc7df96c", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 92.81249999999999, 81, 235, 82.0, 134.9000000000001, 235.0, 235.0, 0.07844790813749956, 0.06090438180596891, 0.0278857798457518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 210.41176470588235, 159, 328, 164.0, 324.8, 328.0, 328.0, 0.0930466765916455, 0.14420417553802872, 0.20926415643609333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4e7998d-db69-42ce-921a-7ddaefcce22e", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 406.3125, 162, 1346, 164.0, 1216.5000000000002, 1346.0, 1346.0, 0.1107519364283885, 33.2531877954827, 0.24199947046730394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2091926f-0af4-4232-93e7-27029d529644", 3, 0, 0.0, 314.3333333333333, 211, 457, 275.0, 457.0, 457.0, 457.0, 0.032969206760885335, 0.027485071131063587, 0.021142362408510453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.75, 80, 86, 81.0, 86.0, 86.0, 86.0, 0.04874690000182801, 0.03622694423963976, 0.024468658789980075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 100.25, 77, 240, 81.0, 240.0, 240.0, 240.0, 0.04869971754163826, 0.013030979107821175, 0.027774057660465572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 100.625, 79, 240, 81.0, 240.0, 240.0, 240.0, 0.04869971754163826, 0.013126095743644688, 0.02863010738287718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 81.125, 78, 85, 81.0, 85.0, 85.0, 85.0, 0.04874719703617042, 0.013138892951155308, 0.028705624817198013], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 957.1578947368422, 636, 1438, 882.0, 1347.2, 1376.0999999999997, 1438.0, 0.24593559076317695, 294.2244675979859, 0.4856267231671326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 686.521739130435, 178, 1478, 519.0, 1196.0000000000005, 1441.1999999999994, 1478.0, 0.10085286444059546, 0.032235918966915876, 0.04550197594878428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 94.72727272727272, 79, 239, 81.0, 207.40000000000012, 239.0, 239.0, 0.04956808176029777, 0.013360147036955258, 0.029189016895956595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 94.7272727272727, 78, 240, 80.0, 208.40000000000012, 240.0, 240.0, 0.04956830512446151, 0.013360207240577515, 0.02914074187981038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 150.25, 79, 1016, 80.5, 472.1000000000006, 1016.0, 1016.0, 0.0788853500044373, 4.456256725284234, 0.045952257107077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 141.25, 77, 476, 81.5, 368.2000000000001, 476.0, 476.0, 0.07888612787441328, 1.4696296881779276, 0.04602974746578314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3be99a4-2f85-49ad-8c86-557b48c531dd", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 80.18181818181817, 78, 82, 81.0, 81.8, 82.0, 82.0, 0.04956830512446151, 0.013263394144631301, 0.028269424016294453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 91.1875, 79, 233, 82.0, 128.7000000000001, 233.0, 233.0, 0.07889196238825694, 0.05862967126705423, 0.03960006705816803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 82.54545454545453, 81, 89, 82.0, 87.80000000000001, 89.0, 89.0, 0.049567635038009365, 0.03683688502336438, 0.02488062930618829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 106.62500000000001, 77, 341, 81.0, 270.30000000000007, 341.0, 341.0, 0.0788935184043786, 0.028516077636152954, 0.04457984578782574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 98.9090909090909, 80, 244, 83.0, 214.2000000000001, 244.0, 244.0, 0.04971571649386689, 0.03913170653716476, 0.017672383597429245], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 598.0769230769231, 402, 1048, 481.0, 990.4, 1048.0, 1048.0, 0.09141796292649995, 0.01651594056777587, 0.062224922031025844], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 935.5217391304349, 744, 1524, 808.0, 1429.8000000000002, 1517.0, 1524.0, 0.10157305752568031, 0.052571992664658763, 0.04671963876425335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 193.45454545454544, 162, 324, 165.0, 323.4, 324.0, 324.0, 0.04954954954954954, 0.0767921241554054, 0.1114380982545045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2704fcd2-9462-4e60-bbe7-0e2841c8a61f", 3, 0, 0.0, 267.6666666666667, 175, 430, 198.0, 430.0, 430.0, 430.0, 0.026599281819390877, 0.026677209402846125, 0.017057482156315112], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 940.0847457627116, 414, 2241, 685.0, 1718.0, 2028.0, 2241.0, 0.2663512586225577, 103.65337236949917, 0.9643065330546426], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60877b5a-0137-416b-a96d-fe2277571fa3", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d6945a8-a213-45cd-a79e-a2ea5edb8cb0", 3, 0, 0.0, 420.33333333333337, 176, 904, 181.0, 904.0, 904.0, 904.0, 0.03367759317467445, 0.02757133686012573, 0.02159663364391558], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 148.96491228070175, 79, 369, 82.0, 325.0, 331.79999999999984, 369.0, 0.2466091245376079, 0.18327103884093712, 0.11921046547472257], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 522.1052631578947, 382, 728, 476.0, 640.2, 717.0, 728.0, 0.24660699065921945, 72.51064337654724, 0.12402597674755664], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 121.10526315789477, 78, 334, 81.0, 240.2, 242.1, 334.0, 0.24694781169579497, 0.4369818699148246, 0.12009766623486902], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 805.8421052631579, 554, 1262, 791.0, 1039.0, 1118.9999999999995, 1262.0, 0.2463565167781754, 221.67202684556688, 0.12365942346092007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 102.93750000000001, 81, 243, 83.0, 240.2, 243.0, 243.0, 0.11142682043567886, 0.08324366956376399, 0.03960875257674522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 4, 2.2857142857142856, 155.79999999999995, 79, 1644, 84.0, 234.0, 315.79999999999984, 1347.6000000000035, 0.7306614782743028, 1.612596793074582, 0.3509743827476212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 106.375, 82, 244, 83.5, 244.0, 244.0, 244.0, 0.049076141633744755, 0.03800525421441366, 0.017445034721370205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f0456d7-e6ce-4fea-bb9a-19e9fae414ce", 2, 0, 0.0, 179.0, 178, 180, 179.0, 180.0, 180.0, 180.0, 0.021833822774860536, 0.031087610943111976, 0.013571511910350324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 82.5, 80, 86, 82.0, 85.3, 86.0, 86.0, 0.1005088259312771, 0.08156526791883913, 0.035727746717758656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 184.25, 163, 320, 165.0, 320.0, 320.0, 320.0, 0.048675716293587586, 0.07543785327922216, 0.1094728267813791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70437e50-20b8-49ee-a55a-a5e77ed2dce0", 1, 0, 0.0, 1550.0, 1550, 1550, 1550.0, 1550.0, 1550.0, 1550.0, 0.6451612903225806, 0.11655745967741934, 0.4448084677419355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81e4c8ee-d394-4290-bfb4-0bbc27c6f922", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 277.625, 162, 1100, 165.5, 660.4000000000004, 1100.0, 1100.0, 0.07885269331230595, 6.010520558683653, 0.1760806053176285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ced222f6-3813-400e-91a6-4254d8faefd1", 3, 0, 0.0, 263.3333333333333, 180, 416, 194.0, 416.0, 416.0, 416.0, 0.04442601587489634, 0.028561647575820397, 0.028489339607274018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0c33a3b-60d5-4924-bc8d-bee29e9ab95c", 3, 0, 0.0, 253.33333333333331, 169, 416, 175.0, 416.0, 416.0, 416.0, 0.04224459621206787, 0.02715920492149546, 0.027090447440681547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 104.39999999999999, 81, 241, 83.0, 239.8, 241.0, 241.0, 0.08184690264038108, 0.06785939486492533, 0.029094016172947962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=728b0a2d-7b4f-4458-ac92-c0fd5402330e", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 92.41176470588233, 78, 249, 83.0, 122.59999999999988, 249.0, 249.0, 0.14266292945737735, 0.11075881730333495, 0.0507122132055521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cfa9cad-39e3-42b4-a184-f095bc7df96c", 3, 0, 0.0, 471.0, 175, 1048, 190.0, 1048.0, 1048.0, 1048.0, 0.03777290926947194, 0.03148972026012944, 0.024222861738561106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 100.4375, 78, 239, 81.0, 235.5, 239.0, 239.0, 0.11081483533608062, 0.08235360321363024, 0.0556238528933061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 132.625, 77, 278, 81.0, 252.10000000000002, 278.0, 278.0, 0.11081560283687943, 0.07126179147273937, 0.06087282870678192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 304.125, 78, 1107, 80.0, 1088.1, 1107.0, 1107.0, 0.11081637034830971, 24.95059256456785, 0.06276708476759729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 193.4375, 77, 634, 81.0, 576.6, 634.0, 634.0, 0.11081637034830971, 8.168324439165275, 0.06287530387926556], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.22796352583586627], "isController": false}, {"data": ["401/Unauthorized", 4, 57.142857142857146, 0.303951367781155], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 7, "401/Unauthorized", 4, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
