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

    var data = {"OkPercent": 98.65067466266866, "KoPercent": 1.3493253373313343};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7440129449838188, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e09c1254-d062-4424-90c1-fedfa603b84a"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26d8b62d-2e34-4683-bdc2-4a521221f38e"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9138413-96f6-49ea-b73c-8a218701820a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50ecac93-e7c7-4f9e-969c-8db065733038"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=168fc97c-f7ea-4a3a-882c-e4ada7ed5565"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1c6b9c3-ebf7-4bbb-a52e-82c8acfd0bd0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/de482b77-e43c-4c25-adbf-fb5057754822"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de482b77-e43c-4c25-adbf-fb5057754822"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/168fc97c-f7ea-4a3a-882c-e4ada7ed5565"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1d26eb1-00de-4877-8102-e4885203a597"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=740a1a34-6899-47a8-96c4-029cd1e2504d"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/acba7156-01f2-4db9-bf3a-1c2c703811dc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faed66f4-8c28-483a-9f2d-c8bd64937120"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4913d3b9-b24d-4844-9d39-44df6d1b6a74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50ecac93-e7c7-4f9e-969c-8db065733038"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acba7156-01f2-4db9-bf3a-1c2c703811dc"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/740a1a34-6899-47a8-96c4-029cd1e2504d"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e09c1254-d062-4424-90c1-fedfa603b84a"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44bf3aca-4f5a-41f7-b1ed-1b3d064b5476"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de5c44bd-dc9f-4cf7-987b-cd2eca19c4b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e76b578e-90a6-41a1-878a-79be81911e07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de5c44bd-dc9f-4cf7-987b-cd2eca19c4b2"], "isController": false}, {"data": [0.930939226519337, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e76b578e-90a6-41a1-878a-79be81911e07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f33d2d96-517d-4080-9bbe-2de8962c2c1a"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4913d3b9-b24d-4844-9d39-44df6d1b6a74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/faed66f4-8c28-483a-9f2d-c8bd64937120"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1d26eb1-00de-4877-8102-e4885203a597"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 18, 1.3493253373313343, 460.1499250374812, 125, 3737, 161.0, 1266.5, 1548.75, 2223.7000000000016, 5.203640207677514, 722.0569508055598, 3.8088638332865243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/e09c1254-d062-4424-90c1-fedfa603b84a", 3, 0, 0.0, 1522.3333333333335, 371, 3737, 459.0, 3737.0, 3737.0, 3737.0, 0.02649193762031755, 0.026569550718814575, 0.01698864489323749], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2211.052631578947, 1559, 3308, 2157.0, 2891.4, 3005.199999999999, 3308.0, 0.24235827355871237, 291.6387981780079, 1.1916737376641766], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 576.1666666666667, 161, 805, 533.0, 801.1, 805.0, 805.0, 0.07008772647096616, 0.013329672588106113, 0.047358267650425785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 576.1666666666667, 161, 805, 533.0, 801.1, 805.0, 805.0, 0.07154397867989436, 0.013606630710849048, 0.048342257078382384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 192.0, 126, 392, 129.0, 390.4, 392.0, 392.0, 0.07642819571013033, 0.027202958445540413, 0.04321038041010471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 135.82352941176467, 127, 160, 131.0, 159.2, 160.0, 160.0, 0.07651281589666269, 0.05686157509507842, 0.038405847041879514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26d8b62d-2e34-4683-bdc2-4a521221f38e", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 206.35294117647058, 126, 746, 131.0, 517.1999999999998, 746.0, 746.0, 0.07650592920951374, 1.3426597201908148, 0.04466508263765442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 263.3529411764706, 125, 1632, 129.0, 630.3999999999992, 1632.0, 1632.0, 0.07642957015110576, 4.064768476005611, 0.0445458650478584], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 290.6153846153846, 160, 515, 266.0, 457.4, 515.0, 515.0, 0.0705230094880572, 0.1658021805850155, 0.04558672600997087], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b9138413-96f6-49ea-b73c-8a218701820a", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 151.39999999999998, 127, 381, 130.5, 173.8, 370.6999999999998, 381.0, 0.10369679058433141, 0.07706372815886348, 0.052050928086275726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 158.25, 125, 380, 128.5, 356.80000000000047, 379.95, 380.0, 0.10369679058433141, 0.03553437872660341, 0.05870413037278996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 890.8, 752, 1039, 904.0, 1039.0, 1039.0, 1039.0, 0.058393478616308135, 17.169621559164273, 0.03330253077336323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1445.0, 1260, 1615, 1541.0, 1615.0, 1615.0, 1615.0, 0.05797908114752197, 52.169679132893855, 0.033009574520513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 239.6, 127, 406, 156.0, 406.0, 406.0, 406.0, 0.05899565791957712, 0.10439466030300171, 0.032666541055078345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50ecac93-e7c7-4f9e-969c-8db065733038", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 156.66666666666666, 127, 377, 131.5, 311.30000000000024, 377.0, 377.0, 0.06079920555704739, 0.04518378459854791, 0.0305183512268773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 153.25, 126, 385, 130.5, 316.9000000000002, 385.0, 385.0, 0.06078996560301113, 0.01626606501486821, 0.034669277257967285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 157.16666666666669, 127, 376, 131.0, 311.2000000000002, 376.0, 376.0, 0.06079920555704739, 0.01638728587279793, 0.03574328295443606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 236.83333333333331, 126, 412, 134.5, 404.5, 412.0, 412.0, 0.06079920555704739, 0.01638728587279793, 0.03580265717861286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 186.2, 128, 386, 130.0, 386.0, 386.0, 386.0, 0.05899635402532123, 0.04384397013014595, 0.03312783551226534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 196.35000000000002, 126, 1131, 128.5, 356.80000000000047, 1093.3999999999994, 1131.0, 0.10369732823833794, 4.691904098442466, 0.060517112651592535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 959.235294117647, 128, 1978, 1163.0, 1743.6, 1978.0, 1978.0, 0.1195154702230721, 63.27222317668604, 0.06422034170879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 233.84999999999997, 126, 996, 131.5, 468.9, 969.6499999999996, 996.0, 0.10369410239792612, 1.551026814646792, 0.06061649384316267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 654.2352941176471, 129, 1244, 751.0, 1170.3999999999999, 1244.0, 1244.0, 0.11949110845575316, 20.68052822098826, 0.06432394171294017], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 607.0833333333334, 161, 1350, 578.5, 1206.6000000000006, 1350.0, 1350.0, 0.07168544427054087, 0.01363353542157015, 0.04899788789292584], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=168fc97c-f7ea-4a3a-882c-e4ada7ed5565", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1c6b9c3-ebf7-4bbb-a52e-82c8acfd0bd0", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de482b77-e43c-4c25-adbf-fb5057754822", 3, 0, 0.0, 770.0, 313, 1482, 515.0, 1482.0, 1482.0, 1482.0, 0.027267025985475764, 0.027346909850667588, 0.01748569049198804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 422.0, 259, 762, 413.5, 696.3000000000002, 762.0, 762.0, 0.06075057333353584, 0.09415152332062635, 0.1366294632686846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de482b77-e43c-4c25-adbf-fb5057754822", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/168fc97c-f7ea-4a3a-882c-e4ada7ed5565", 3, 0, 0.0, 753.6666666666666, 285, 1215, 761.0, 1215.0, 1215.0, 1215.0, 0.016858289220809872, 0.02324051264652663, 0.010810816980792788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 786.0476190476189, 179, 1428, 790.0, 1401.6, 1425.5, 1428.0, 0.09367765074295299, 0.057542228825505304, 0.04235620341209691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 138.58823529411765, 126, 163, 132.0, 161.4, 163.0, 163.0, 0.11951378978227399, 0.08881835353936574, 0.0599903202618055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 238.9411764705883, 126, 387, 157.0, 387.0, 387.0, 387.0, 0.1195154702230721, 0.1375718630704227, 0.062256794805998265], "isController": false}, {"data": ["login", 21, 0, 0.0, 3488.0952380952376, 1849, 6283, 3282.0, 5349.400000000001, 6204.5999999999985, 6283.0, 0.09165422787859744, 26.23325656609797, 0.17447292681409904], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f1d26eb1-00de-4877-8102-e4885203a597", 3, 0, 0.0, 513.3333333333334, 261, 663, 616.0, 663.0, 663.0, 663.0, 0.042503152317130186, 0.034547646919229846, 0.02725625327628466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 156.84999999999997, 128, 388, 142.0, 174.20000000000002, 377.34999999999985, 388.0, 0.1002229961664704, 0.08113756232617574, 0.03562614316855002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=740a1a34-6899-47a8-96c4-029cd1e2504d", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 0.20718355791284404, 0.790657253440367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1126.764705882353, 260, 2113, 1378.0, 1896.9999999999998, 2113.0, 2113.0, 0.11938202247191011, 84.08936232663272, 0.25052531381671345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acba7156-01f2-4db9-bf3a-1c2c703811dc", 3, 0, 0.0, 498.6666666666667, 282, 639, 575.0, 639.0, 639.0, 639.0, 0.023878886288743493, 0.028224035193498576, 0.015312957678653868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faed66f4-8c28-483a-9f2d-c8bd64937120", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 455.23529411764713, 258, 1760, 292.0, 822.3999999999992, 1760.0, 1760.0, 0.07638218048659942, 5.48668717565655, 0.17063572018286793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1210.7142857142856, 156, 2002, 1418.0, 2002.0, 2002.0, 2002.0, 0.08104947491518752, 69.26573155834983, 0.14588453199717483], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1265.4090909090908, 153, 3618, 1196.5, 2797.9999999999995, 3519.7499999999986, 3618.0, 0.08539775947332873, 0.026868755288838513, 0.038529067262380735], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4913d3b9-b24d-4844-9d39-44df6d1b6a74", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50ecac93-e7c7-4f9e-969c-8db065733038", 3, 0, 0.0, 392.3333333333333, 331, 497, 349.0, 497.0, 497.0, 497.0, 0.020303331776744565, 0.027989781925297278, 0.013020040234435806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 142.8421052631579, 129, 183, 136.0, 177.0, 183.0, 183.0, 0.0919758345596778, 0.07140701999506235, 0.032694534941135465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 411.8500000000001, 256, 1260, 314.0, 824.8000000000005, 1239.4999999999998, 1260.0, 0.1036247953410292, 6.351132335664028, 0.23172892465959255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acba7156-01f2-4db9-bf3a-1c2c703811dc", 1, 0, 0.0, 1350.0, 1350, 1350, 1350.0, 1350.0, 1350.0, 1350.0, 0.7407407407407407, 0.13382523148148148, 0.5107060185185185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 549.6923076923077, 256, 1603, 516.0, 1266.9999999999998, 1603.0, 1603.0, 0.08111413382584172, 7.580710513015699, 0.18083114104187986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 176.9230769230769, 127, 395, 134.0, 391.0, 395.0, 395.0, 0.06492468736265933, 0.04824969441697631, 0.03258914971133485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 207.84615384615384, 125, 380, 133.0, 380.0, 380.0, 380.0, 0.06484631423526242, 0.02484346473856959, 0.03656373457405948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 271.0769230769231, 126, 1396, 133.0, 991.9999999999997, 1396.0, 1396.0, 0.06492760571962262, 4.5101518447555975, 0.03774112177422174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 223.3846153846154, 127, 764, 131.0, 623.9999999999999, 764.0, 764.0, 0.06483434824024617, 1.4825499754377565, 0.03775022785532963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.8318128881987576, 3.8395283385093166], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1512.3157894736846, 1012, 2670, 1381.0, 2215.6, 2376.6999999999994, 2670.0, 0.2411891896466367, 288.54612174659053, 0.4762544350249017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1265.4090909090908, 153, 3618, 1196.5, 2797.9999999999995, 3519.7499999999986, 3618.0, 0.0877738944479022, 0.027616360255980594, 0.03960111253411212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 134.5, 127, 158, 131.0, 158.0, 158.0, 158.0, 0.06499467856069284, 0.017518096955811743, 0.038273233566501745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 128.625, 126, 133, 128.0, 133.0, 133.0, 133.0, 0.0649936225007921, 0.017517812314666623, 0.03820914135300474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 251.26315789473682, 126, 1383, 131.0, 393.0, 1383.0, 1383.0, 0.08973947214297859, 4.272795338801931, 0.05235110037123803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 246.42105263157893, 126, 1216, 131.0, 464.0, 1216.0, 1216.0, 0.08974031985339265, 1.4116849719207263, 0.05243923192913348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 178.3684210526316, 126, 416, 135.0, 395.0, 416.0, 416.0, 0.08973904829377731, 0.06669083569488723, 0.045044795725587436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 132.37500000000003, 127, 156, 129.0, 156.0, 156.0, 156.0, 0.06499415052645263, 0.017391012933835957, 0.03706697647211751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 178.68421052631575, 126, 462, 130.0, 415.0, 462.0, 462.0, 0.08973947214297859, 0.031106239727192005, 0.05078287357597627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 131.24999999999997, 128, 136, 130.5, 136.0, 136.0, 136.0, 0.0649936225007921, 0.048300924534280074, 0.032623751919342914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/740a1a34-6899-47a8-96c4-029cd1e2504d", 3, 0, 0.0, 351.3333333333333, 222, 536, 296.0, 536.0, 536.0, 536.0, 0.03711447340747981, 0.030940809373878834, 0.02380062259529141], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 674.0833333333334, 156, 1482, 555.5, 1353.3000000000004, 1482.0, 1482.0, 0.07089014390699214, 0.013320747255960679, 0.048246604288262954], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 174.87500000000003, 129, 431, 138.0, 431.0, 431.0, 431.0, 0.06275986506629011, 0.04939887816741194, 0.02230917078528281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e09c1254-d062-4424-90c1-fedfa603b84a", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1798.8571428571431, 1265, 3480, 1586.0, 3086.2000000000007, 3454.8999999999996, 3480.0, 0.09583920918961103, 0.049604278193841646, 0.0440822925081121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 270.125, 257, 292, 265.5, 292.0, 292.0, 292.0, 0.0649255790550082, 0.10062196675810352, 0.14601914898797252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44bf3aca-4f5a-41f7-b1ed-1b3d064b5476", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["addBook", 62, 8, 12.903225806451612, 1368.9838709677413, 665, 3499, 1061.5, 2527.3, 2862.799999999999, 3499.0, 0.29442771799523215, 86.33708378694593, 1.0721095998276173], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 245.00000000000006, 127, 771, 142.0, 528.8000000000001, 632.2, 771.0, 0.2421513233357407, 0.1799581611899401, 0.11705557133905434], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 866.298245614035, 624, 1408, 798.0, 1142.4, 1266.0, 1408.0, 0.24201663545925842, 71.16092653362121, 0.12171735084132626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de5c44bd-dc9f-4cf7-987b-cd2eca19c4b2", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e76b578e-90a6-41a1-878a-79be81911e07", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.2491918103448276, 0.950969827586207], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 193.01754385964915, 126, 471, 139.0, 391.0, 399.29999999999995, 471.0, 0.24284977823980775, 0.4297302716509098, 0.11810467730803151], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1262.0877192982455, 879, 2159, 1230.0, 1851.0, 1890.6999999999994, 2159.0, 0.24207727786224528, 217.8215601469133, 0.12151144611444735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 159.46153846153848, 129, 381, 139.0, 292.9999999999999, 381.0, 381.0, 0.0868606554638693, 0.06489101702134768, 0.030876248621922293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de5c44bd-dc9f-4cf7-987b-cd2eca19c4b2", 3, 0, 0.0, 495.66666666666663, 233, 915, 339.0, 915.0, 915.0, 915.0, 0.02827334671605078, 0.023570325826759782, 0.018131019866738294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 8, 4.419889502762431, 227.32596685082862, 127, 2466, 150.0, 397.8, 481.6, 1737.840000000006, 0.7276966992320991, 1.522755127296667, 0.3513120087544727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 141.61538461538464, 129, 177, 136.0, 170.6, 177.0, 177.0, 0.06462549525499729, 0.05004689232149693, 0.02297234401642482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e76b578e-90a6-41a1-878a-79be81911e07", 3, 0, 0.0, 533.0, 266, 1053, 280.0, 1053.0, 1053.0, 1053.0, 0.04043889682689456, 0.025998314203488526, 0.02593249568651767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 142.35294117647064, 128, 165, 136.0, 165.0, 165.0, 165.0, 0.07812715424138533, 0.06340201677206173, 0.027771761859242444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 490.38461538461536, 257, 1782, 296.0, 1381.9999999999995, 1782.0, 1782.0, 0.06479040304614571, 6.055138190453882, 0.14443996328128506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f33d2d96-517d-4080-9bbe-2de8962c2c1a", 2, 0, 0.0, 231.0, 225, 237, 231.0, 237.0, 237.0, 237.0, 0.014304412195941838, 0.02444601693642404, 0.008891365588590801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 483.6315789473684, 255, 1799, 316.0, 858.0, 1799.0, 1799.0, 0.08968440529798824, 5.778716194289463, 0.20049461392043577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4913d3b9-b24d-4844-9d39-44df6d1b6a74", 3, 0, 0.0, 780.3333333333334, 352, 1533, 456.0, 1533.0, 1533.0, 1533.0, 0.0748671108781912, 0.033875418008035736, 0.0480104845149859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 185.41666666666666, 130, 435, 140.0, 420.6, 435.0, 435.0, 0.06157856655360157, 0.05105488574610131, 0.02188925607960056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faed66f4-8c28-483a-9f2d-c8bd64937120", 3, 0, 0.0, 331.0, 212, 536, 245.0, 536.0, 536.0, 536.0, 0.01932031144342047, 0.026634609037397686, 0.012389652846203882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 157.88235294117644, 130, 381, 135.0, 212.99999999999986, 381.0, 381.0, 0.12072063115586454, 0.09372353688370343, 0.042912411856186224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1d26eb1-00de-4877-8102-e4885203a597", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 154.46153846153848, 128, 381, 131.0, 292.19999999999993, 381.0, 381.0, 0.08118505195843326, 0.06033381302770284, 0.04075109053382295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 193.53846153846155, 125, 474, 129.0, 436.79999999999995, 474.0, 474.0, 0.08119874329329611, 0.031108292577810257, 0.0457840870762831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 357.69230769230774, 128, 1472, 378.0, 1067.1999999999996, 1472.0, 1472.0, 0.08119519324455991, 5.640168716194694, 0.04719714583281285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 306.0, 127, 764, 377.0, 660.8, 764.0, 764.0, 0.08119874329329611, 1.8567502896609016, 0.047278505053060256], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.4497751124437781], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07496251874062969], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07496251874062969], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7496251874062968], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
