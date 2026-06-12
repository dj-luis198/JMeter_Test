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

    var data = {"OkPercent": 98.97476340694006, "KoPercent": 1.025236593059937};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.754421768707483, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fd653cf-6a9c-4618-96e8-fa8c6e3889b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1c05bd3-b49c-43b6-b14b-2d64827398ca"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b5d926b-8e5b-402e-8795-e8fc83f472fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a1996ff9-3a15-4ee9-bac3-e4a5d286334a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3cd702f-cdc9-40ef-b56c-5378cd770949"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/881968d4-cc0c-429b-b659-f7c656c9b1e5"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03f2328e-8a2b-41dd-b055-8f4d025a1475"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e75b5f75-f33c-4840-97e1-1b19f948c6f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d14f39df-9129-49e3-8892-052a4952a6d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44dfa254-c15f-45d7-99ee-3e45c01bd0f4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec833592-f072-48af-84d1-461cb1b1ea2f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6598f644-3d18-416d-bae9-bac0a291eded"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66e9d371-e397-426f-a3db-789635a94bc7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecf858eb-aa2a-4f76-b49d-06796f03fbee"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b5d926b-8e5b-402e-8795-e8fc83f472fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb235edb-5d56-4a48-96b6-4a0752bb730c"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3cd702f-cdc9-40ef-b56c-5378cd770949"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1996ff9-3a15-4ee9-bac3-e4a5d286334a"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9454022988505747, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44dfa254-c15f-45d7-99ee-3e45c01bd0f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec77fe3c-6ae7-4018-b695-341b3bfebbb4"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/341ed2fa-1a64-4df3-8912-bca4c03ea51f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec833592-f072-48af-84d1-461cb1b1ea2f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb235edb-5d56-4a48-96b6-4a0752bb730c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6fd653cf-6a9c-4618-96e8-fa8c6e3889b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66e9d371-e397-426f-a3db-789635a94bc7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6598f644-3d18-416d-bae9-bac0a291eded"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03f2328e-8a2b-41dd-b055-8f4d025a1475"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecf858eb-aa2a-4f76-b49d-06796f03fbee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 13, 1.025236593059937, 450.23659305993675, 127, 2317, 154.0, 1240.5000000000007, 1497.55, 1945.9299999999998, 4.963983714375196, 687.0073910458425, 3.6243184248257907], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2209.0740740740753, 1649, 2899, 2154.0, 2677.0, 2809.75, 2899.0, 0.2480751208217718, 298.5190180876624, 1.2197834309937707], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 637.1666666666665, 402, 1296, 551.0, 1186.2000000000003, 1296.0, 1296.0, 0.06715089926245929, 0.012771130499378855, 0.045373853888037066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 637.1666666666665, 402, 1296, 551.0, 1186.2000000000003, 1296.0, 1296.0, 0.06902105142068331, 0.01312680641033015, 0.04663751545783964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 173.31818181818184, 127, 420, 135.5, 409.3, 419.25, 420.0, 0.10926085034739984, 0.029235813471862847, 0.06231282871375147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 174.95454545454547, 127, 424, 139.0, 405.79999999999995, 422.34999999999997, 424.0, 0.1092630209238685, 0.08120035051080463, 0.05484491479967619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 178.27272727272728, 129, 535, 135.0, 412.7, 518.0499999999997, 535.0, 0.10926519158658025, 0.029450383669820456, 0.06434268606123818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 178.3636363636364, 128, 530, 135.5, 418.0, 514.5499999999997, 530.0, 0.10910533624280896, 0.029407297659194608, 0.06414200431462012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fd653cf-6a9c-4618-96e8-fa8c6e3889b9", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 0.6294915069686412, 2.4022756968641117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1c05bd3-b49c-43b6-b14b-2d64827398ca", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 242.08333333333331, 132, 306, 240.0, 304.2, 306.0, 306.0, 0.06777516717874571, 0.15764565660017169, 0.043810071036847094], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 158.64285714285714, 131, 418, 140.5, 281.5, 418.0, 418.0, 0.1382770677360093, 0.10276254740928037, 0.06940860626592656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1104.6666666666667, 1101, 1107, 1106.0, 1107.0, 1107.0, 1107.0, 0.014836575124998145, 4.362445707407902, 0.008461484250975504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 154.28571428571428, 132, 400, 135.0, 270.5, 400.0, 400.0, 0.13828389684021297, 0.06667259311938839, 0.07720593682401398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1245.3333333333333, 1054, 1515, 1167.0, 1515.0, 1515.0, 1515.0, 0.014832173951736105, 13.346016193952922, 0.008444489661974756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b5d926b-8e5b-402e-8795-e8fc83f472fc", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.26183197463768115, 0.9992074275362319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1996ff9-3a15-4ee9-bac3-e4a5d286334a", 3, 0, 0.0, 769.0, 232, 1624, 451.0, 1624.0, 1624.0, 1624.0, 0.01582412017891805, 0.021814827134673812, 0.010147629151194193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 245.33333333333331, 133, 469, 134.0, 469.0, 469.0, 469.0, 0.014883536328231589, 0.026336882643316052, 0.00824117685362042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 155.85714285714283, 131, 416, 134.0, 280.5, 416.0, 416.0, 0.07268687015529031, 0.05401826971501555, 0.03648540162091721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 208.5, 130, 396, 138.0, 395.0, 396.0, 396.0, 0.07268762493185535, 0.027247718776771113, 0.04101861646893902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 223.57142857142858, 133, 1081, 136.0, 748.5, 1081.0, 1081.0, 0.07269064419487324, 4.690133616112919, 0.04228794451626972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3cd702f-cdc9-40ef-b56c-5378cd770949", 3, 0, 0.0, 414.33333333333337, 237, 706, 300.0, 706.0, 706.0, 706.0, 0.02177700348432056, 0.02184080329921603, 0.013965070593786296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 235.42857142857142, 129, 1042, 134.5, 716.0, 1042.0, 1042.0, 0.07269026677327906, 1.544860846815647, 0.04235871153906063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 140.33333333333334, 133, 153, 135.0, 153.0, 153.0, 153.0, 0.01490816569929236, 0.011079212985509262, 0.008371284450286237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 886.1176470588236, 133, 1948, 1174.0, 1830.3999999999999, 1948.0, 1948.0, 0.0901866332799287, 42.97325207860296, 0.04891671595985104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 361.0, 129, 1460, 139.0, 1425.5, 1460.0, 1460.0, 0.1364948131970985, 17.577001507536465, 0.07856830346696826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 663.7058823529412, 131, 1177, 786.0, 1175.4, 1177.0, 1177.0, 0.09018471952552227, 14.050010493920489, 0.04900374896552821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 333.64285714285717, 129, 1122, 138.5, 1121.0, 1122.0, 1122.0, 0.13694476235192848, 5.783967497627922, 0.0789610355469476], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 458.5, 132, 690, 478.5, 673.5, 690.0, 690.0, 0.06905083867997813, 0.013132471516529045, 0.047197102382253935], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/881968d4-cc0c-429b-b659-f7c656c9b1e5", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 418.6428571428571, 268, 1216, 279.0, 1013.5, 1216.0, 1216.0, 0.07263369788532177, 6.311324201483284, 0.16202745942889163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03f2328e-8a2b-41dd-b055-8f4d025a1475", 3, 0, 0.0, 308.3333333333333, 247, 427, 251.0, 427.0, 427.0, 427.0, 0.023834493278672896, 0.028171564158483493, 0.015284489504878127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 691.15, 167, 1476, 674.5, 1334.2000000000003, 1469.6499999999999, 1476.0, 0.08597195594796977, 0.05280894559694628, 0.03887208555069337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 170.0, 131, 414, 140.0, 402.0, 414.0, 414.0, 0.09018089226035754, 0.06701919825208212, 0.045266580685374785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e75b5f75-f33c-4840-97e1-1b19f948c6f3", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 229.6470588235294, 127, 414, 140.0, 406.8, 414.0, 414.0, 0.09018567639257294, 0.09584300397877984, 0.04742415450928382], "isController": false}, {"data": ["login", 20, 0, 0.0, 2791.6, 2046, 4719, 2559.5, 3627.1000000000004, 4664.9, 4719.0, 0.08579382884989083, 15.51627894335248, 0.15078432986440285], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d14f39df-9129-49e3-8892-052a4952a6d4", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.6412368222891567, 1.1981519829317269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 142.92857142857142, 132, 178, 141.5, 163.0, 178.0, 178.0, 0.13689521649000663, 0.11082630319356984, 0.048661971486682054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44dfa254-c15f-45d7-99ee-3e45c01bd0f4", 3, 0, 0.0, 449.33333333333337, 237, 794, 317.0, 794.0, 794.0, 794.0, 0.051105584136826684, 0.03244006805560288, 0.03277278670232701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec833592-f072-48af-84d1-461cb1b1ea2f", 3, 0, 0.0, 418.66666666666663, 252, 751, 253.0, 751.0, 751.0, 751.0, 0.024233416265468998, 0.024304412602184237, 0.015540309258780574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6598f644-3d18-416d-bae9-bac0a291eded", 3, 0, 0.0, 493.33333333333337, 222, 786, 472.0, 786.0, 786.0, 786.0, 0.018719113462786402, 0.025805809086881643, 0.012004118984924874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1059.0000000000002, 271, 2086, 1308.0, 1971.6, 2086.0, 2086.0, 0.09011492303125399, 57.14095746443111, 0.1904640603796489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66e9d371-e397-426f-a3db-789635a94bc7", 3, 0, 0.0, 329.6666666666667, 222, 489, 278.0, 489.0, 489.0, 489.0, 0.02510313203410679, 0.02517667636623796, 0.016098037144267698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecf858eb-aa2a-4f76-b49d-06796f03fbee", 3, 0, 0.0, 435.6666666666667, 306, 529, 472.0, 529.0, 529.0, 529.0, 0.06035731530661516, 0.02731011337115725, 0.038705700245453084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 396.00000000000006, 265, 925, 281.5, 826.2, 910.4499999999998, 925.0, 0.10903179763698358, 0.16897799106434858, 0.2452150683183332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 893.8, 131, 1651, 1235.0, 1651.0, 1651.0, 1651.0, 0.024703679366004774, 17.73515741184492, 0.03996978122421554], "isController": false}, {"data": ["register", 20, 3, 15.0, 1265.6, 551, 1901, 1266.0, 1774.9000000000003, 1895.25, 1901.0, 0.08909995678652097, 0.028418013561013422, 0.040199394565793634], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 579.3571428571429, 268, 1592, 411.0, 1558.0, 1592.0, 1592.0, 0.13631008597271851, 23.477396562551725, 0.30158226191983023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 158.21052631578945, 132, 397, 144.0, 174.0, 397.0, 397.0, 0.11224803270553206, 0.08714568945400193, 0.0399006678757946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 438.8, 266, 566, 531.0, 564.2, 566.0, 566.0, 0.08948439093940713, 0.1386833285359757, 0.20125249251313929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 136.57142857142858, 132, 142, 135.0, 142.0, 142.0, 142.0, 0.04750948492931268, 0.035307341827350534, 0.0238475344274089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b5d926b-8e5b-402e-8795-e8fc83f472fc", 3, 0, 0.0, 627.3333333333334, 218, 1228, 436.0, 1228.0, 1228.0, 1228.0, 0.0225066394586403, 0.031027219435983612, 0.01443296866325566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 214.28571428571428, 134, 423, 138.0, 423.0, 423.0, 423.0, 0.0475085175985123, 0.03309954476659744, 0.025954709112133673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 565.7142857142857, 132, 1451, 397.0, 1451.0, 1451.0, 1451.0, 0.04751012983839769, 12.223346286913674, 0.026764216557958968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 432.14285714285717, 131, 1063, 133.0, 1063.0, 1063.0, 1063.0, 0.047509807381666644, 4.000421225345804, 0.026810431202405356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 2.234256628787879, 4.683061079545454], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1502.0555555555557, 1040, 2317, 1430.5, 2094.0, 2219.0, 2317.0, 0.25486725663716814, 304.9098451327434, 0.5032632743362832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, 15.0, 1265.6, 551, 1901, 1266.0, 1774.9000000000003, 1895.25, 1901.0, 0.08683419878084785, 0.027695360665844635, 0.039177148278077834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 135.33333333333334, 132, 143, 133.5, 143.0, 143.0, 143.0, 0.040290359188552165, 0.01085951087503945, 0.023725670498727494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 135.0, 131, 143, 135.0, 143.0, 143.0, 143.0, 0.04028954754838103, 0.010859292112649575, 0.023685847289184943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb235edb-5d56-4a48-96b6-4a0752bb730c", 3, 0, 0.0, 316.6666666666667, 234, 468, 248.0, 468.0, 468.0, 468.0, 0.02100149110586852, 0.024823051499156437, 0.013467753085469068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 351.2631578947369, 131, 1541, 140.0, 1523.0, 1541.0, 1541.0, 0.10853793686519587, 10.306451419990402, 0.062826595650485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 336.3157894736842, 129, 1067, 212.0, 1066.0, 1067.0, 1067.0, 0.10853545682002536, 3.3854404683019346, 0.06293115174684961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 151.26315789473685, 128, 402, 135.0, 153.0, 402.0, 402.0, 0.10853173696476717, 0.08065688655291779, 0.0544778445311429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 133.66666666666666, 131, 142, 132.0, 142.0, 142.0, 142.0, 0.040290359188552165, 0.010780818767249309, 0.022978095474721155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 193.0526315789474, 128, 422, 134.0, 421.0, 422.0, 422.0, 0.10853731684327783, 0.046201997229442175, 0.060940668646996654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 135.0, 132, 142, 134.0, 142.0, 142.0, 142.0, 0.040290088638195005, 0.029942145950846093, 0.02022373589846898], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 578.5000000000001, 131, 1031, 480.5, 959.9000000000003, 1031.0, 1031.0, 0.07073261303955722, 0.01329114611884258, 0.04813939150796037], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 140.83333333333331, 134, 154, 138.0, 154.0, 154.0, 154.0, 0.04035892537634698, 0.03176688852864811, 0.01434633675487334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1484.4999999999998, 1012, 2296, 1447.0, 2163.2000000000007, 2291.1, 2296.0, 0.08737020064566578, 0.04522090463105748, 0.04018687939854354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 272.0, 266, 286, 270.0, 286.0, 286.0, 286.0, 0.04025359766529134, 0.062385214350407565, 0.0905312845929355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3cd702f-cdc9-40ef-b56c-5378cd770949", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1996ff9-3a15-4ee9-bac3-e4a5d286334a", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 1352.6666666666663, 682, 2945, 1136.5, 2344.6, 2498.9499999999994, 2945.0, 0.28558237385588564, 92.17296616265344, 1.0384805143576539], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 249.44444444444446, 131, 622, 141.0, 549.5, 561.75, 622.0, 0.2567564997432435, 0.19081220342246905, 0.12411569079385305], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 862.1111111111112, 645, 1208, 790.0, 1122.5, 1178.0, 1208.0, 0.2565028215310369, 75.42034622537098, 0.12900288387547262], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 220.92592592592595, 130, 450, 140.5, 401.0, 421.0, 450.0, 0.25698988697204045, 0.45475163593099344, 0.12498140987507436], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1248.4074074074076, 900, 1734, 1242.5, 1569.0, 1684.75, 1734.0, 0.2555704901274066, 229.96277626164266, 0.1282844061772334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 141.93333333333337, 133, 170, 141.0, 155.60000000000002, 170.0, 170.0, 0.09214834655150171, 0.06884129405458868, 0.03275585756322912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, 3.4482758620689653, 211.68390804597706, 131, 1009, 145.0, 386.0, 481.25, 800.5, 0.7647746551921166, 1.5795625236245043, 0.3703089563243348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 182.28571428571428, 136, 435, 140.0, 435.0, 435.0, 435.0, 0.050497763670466024, 0.0391061783112105, 0.01795037692973597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 168.5909090909091, 136, 397, 143.5, 329.1999999999998, 396.55, 397.0, 0.11007925706508685, 0.08933189709090546, 0.0391297359098551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44dfa254-c15f-45d7-99ee-3e45c01bd0f4", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec77fe3c-6ae7-4018-b695-341b3bfebbb4", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 707.2857142857142, 275, 1593, 532.0, 1593.0, 1593.0, 1593.0, 0.04746502844511347, 16.27673695516928, 0.10328014071685754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 580.2105263157894, 266, 1681, 533.0, 1656.0, 1681.0, 1681.0, 0.10844686959549317, 13.80723849856736, 0.2409787989937272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/341ed2fa-1a64-4df3-8912-bca4c03ea51f", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.44537787656903766, 0.8321892433751744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec833592-f072-48af-84d1-461cb1b1ea2f", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb235edb-5d56-4a48-96b6-4a0752bb730c", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fd653cf-6a9c-4618-96e8-fa8c6e3889b9", 3, 0, 0.0, 508.0, 243, 1031, 250.0, 1031.0, 1031.0, 1031.0, 0.07364854912358226, 0.033324050547454215, 0.047229050056463884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 140.78571428571428, 135, 151, 141.5, 148.0, 151.0, 151.0, 0.07326007326007326, 0.06074004120879121, 0.026041666666666668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 158.41176470588235, 133, 411, 142.0, 210.19999999999982, 411.0, 411.0, 0.08563541477765016, 0.06648452612132019, 0.030440713846742833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66e9d371-e397-426f-a3db-789635a94bc7", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6598f644-3d18-416d-bae9-bac0a291eded", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03f2328e-8a2b-41dd-b055-8f4d025a1475", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecf858eb-aa2a-4f76-b49d-06796f03fbee", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 141.20000000000002, 133, 151, 141.0, 150.4, 151.0, 151.0, 0.08969575200918485, 0.06665865945213835, 0.045023063020235364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 206.33333333333334, 130, 421, 139.0, 408.40000000000003, 421.0, 421.0, 0.08969897025582146, 0.024001482275483477, 0.05115644397402318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 222.6, 129, 426, 138.0, 409.2, 426.0, 426.0, 0.08956239812277213, 0.02413986511902843, 0.05265289420889534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 241.4, 132, 402, 141.0, 400.2, 402.0, 402.0, 0.0897021887334051, 0.024177543057050593, 0.05282267559203445], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 23.076923076923077, 0.23659305993690852], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07886435331230283], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07886435331230283], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.6309148264984227], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 13, "401/Unauthorized", 8, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
