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

    var data = {"OkPercent": 98.06918744971843, "KoPercent": 1.9308125502815767};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.71157822191592, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/636b5839-bd49-4d26-b07c-f261b3561b29"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=863b61d2-3b59-40ba-9fa4-c977c41aa51d"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f1a7e63-3c4d-4dc8-a1e8-c5ae7de50793"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3934a22f-cd23-4eb1-b9d8-c0610731eea3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06ae0bc0-206f-41c5-95c2-2a1d6d8acb48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2ae55c1-c104-49dc-b906-8cdf136d5a45"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b4268ff-2a21-427e-93e2-d93372a7509a"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7514a98-8952-454d-8ae0-d813145c0580"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d95f17b-e7ec-49c8-8345-93df4f4bb4e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/863b61d2-3b59-40ba-9fa4-c977c41aa51d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=878fa01f-a3b3-43f2-bf3f-e9d7cf49b6cc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/54ec9a07-c950-48f8-b72a-2dde93458cab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca1d405d-1428-4fe9-9381-b1d75043a9ed"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e966d366-0754-49f0-8bb2-273426d85b22"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a697b88-a05e-4663-ac79-875f9fb12f45"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e966d366-0754-49f0-8bb2-273426d85b22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f1a7e63-3c4d-4dc8-a1e8-c5ae7de50793"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/06ae0bc0-206f-41c5-95c2-2a1d6d8acb48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21929824561403508, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78c2d1db-7caa-4f1b-855f-45b70d74efce"], "isController": false}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3173076923076923, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb40bd48-9333-4a3a-a975-289e4a0354e9"], "isController": false}, {"data": [0.9006024096385542, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2ae55c1-c104-49dc-b906-8cdf136d5a45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a697b88-a05e-4663-ac79-875f9fb12f45"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7514a98-8952-454d-8ae0-d813145c0580"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d95f17b-e7ec-49c8-8345-93df4f4bb4e1"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/878fa01f-a3b3-43f2-bf3f-e9d7cf49b6cc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b4268ff-2a21-427e-93e2-d93372a7509a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=636b5839-bd49-4d26-b07c-f261b3561b29"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54ec9a07-c950-48f8-b72a-2dde93458cab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e8f171f-2a7b-487c-a091-ab3964ce3363"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1243, 24, 1.9308125502815767, 512.6146419951737, 138, 4060, 170.0, 1427.2000000000003, 1706.8, 2287.1599999999994, 4.9121503600135945, 702.8778974166258, 3.5758498146088065], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2409.423076923077, 1869, 3193, 2336.0, 2868.2, 2974.049999999999, 3193.0, 0.23756875788088666, 285.87481875388335, 1.1681237264943989], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/636b5839-bd49-4d26-b07c-f261b3561b29", 3, 0, 0.0, 1250.6666666666665, 264, 2820, 668.0, 2820.0, 2820.0, 2820.0, 0.09296848368403111, 0.042065817812761475, 0.05961846121664756], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 712.2857142857143, 154, 1513, 603.0, 1417.0, 1513.0, 1513.0, 0.06724206663688805, 0.013245786564074484, 0.045243929602359234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 712.2857142857143, 154, 1513, 603.0, 1417.0, 1513.0, 1513.0, 0.06697186703214171, 0.013192560860684165, 0.04506212537611879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 185.49999999999997, 143, 435, 144.5, 432.0, 435.0, 435.0, 0.09889519934446611, 0.03707190299087339, 0.05580790755418044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 169.0, 142, 455, 146.0, 305.0, 455.0, 455.0, 0.09889310361878122, 0.07349380063856689, 0.049639702402396034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 298.14285714285717, 142, 844, 150.0, 643.5, 844.0, 844.0, 0.09869371814484007, 2.097503115020479, 0.05751167141336454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 379.5, 145, 1546, 292.0, 1062.0, 1546.0, 1546.0, 0.09869441389617348, 6.367944505981586, 0.057415695584129935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=863b61d2-3b59-40ba-9fa4-c977c41aa51d", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 265.7857142857142, 145, 566, 260.0, 424.5, 566.0, 566.0, 0.06703825011013427, 0.10754831991371219, 0.04332982878909766], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f1a7e63-3c4d-4dc8-a1e8-c5ae7de50793", 1, 0, 0.0, 1515.0, 1515, 1515, 1515.0, 1515.0, 1515.0, 1515.0, 0.6600660066006601, 0.11925020627062707, 0.45508457095709576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 144.52941176470583, 139, 150, 145.0, 147.6, 150.0, 150.0, 0.08319345414327871, 0.06182638535452646, 0.04175921428676294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 161.4705882352941, 142, 428, 144.0, 208.7999999999998, 428.0, 428.0, 0.0831950826812307, 0.03696178592926461, 0.04662518535375038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 932.0, 712, 1126, 850.0, 1126.0, 1126.0, 1126.0, 0.03369090615061183, 9.90624505164816, 0.019214344914020808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1387.8, 985, 1700, 1562.0, 1700.0, 1700.0, 1700.0, 0.03359221735508318, 30.22633622492341, 0.01912525656056005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 202.4, 144, 427, 146.0, 427.0, 427.0, 427.0, 0.0339153202284536, 0.06001421899800578, 0.018779283759309758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 167.53846153846152, 144, 434, 145.0, 319.9999999999999, 434.0, 434.0, 0.06435101996366643, 0.04782336542221694, 0.032301195567699746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 234.07692307692307, 142, 435, 146.0, 433.0, 435.0, 435.0, 0.06434719767954106, 0.03208659091021586, 0.03586660207197977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 321.15384615384613, 142, 1289, 147.0, 1281.8, 1289.0, 1289.0, 0.06434879024274344, 8.92254563504831, 0.036979285258187146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 365.1538461538462, 141, 1147, 153.0, 1144.6, 1147.0, 1147.0, 0.0643478346953625, 2.9255062442148825, 0.037041575816598775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3934a22f-cd23-4eb1-b9d8-c0610731eea3", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06ae0bc0-206f-41c5-95c2-2a1d6d8acb48", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 0.17608583089668617, 0.6719816033138402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 144.8, 143, 146, 145.0, 146.0, 146.0, 146.0, 0.033914630093129575, 0.02520413427819493, 0.019043859671435064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1025.5000000000002, 143, 1790, 1359.0, 1670.3000000000002, 1790.0, 1790.0, 0.07638288832344334, 42.96363107840703, 0.040802187414964365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 285.99999999999994, 138, 1135, 146.0, 1011.7999999999998, 1135.0, 1135.0, 0.0831950826812307, 8.826736376193482, 0.048068482399346184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 748.8124999999999, 143, 1289, 853.5, 1286.9, 1289.0, 1289.0, 0.07638325297178594, 14.044728212870579, 0.040876975223182316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 355.5882352941176, 142, 1283, 146.0, 1185.3999999999999, 1283.0, 1283.0, 0.08319467554076539, 2.8976674904570814, 0.0481494919619262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2ae55c1-c104-49dc-b906-8cdf136d5a45", 3, 0, 0.0, 368.3333333333333, 271, 479, 355.0, 479.0, 479.0, 479.0, 0.07346818827447715, 0.033242441960131264, 0.04711338896507812], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 652.8461538461539, 148, 1515, 526.0, 1352.6, 1515.0, 1515.0, 0.07175145296692258, 0.013593536987874003, 0.04907579471633339], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 556.5384615384615, 290, 1436, 303.0, 1428.0, 1436.0, 1436.0, 0.06430072956597008, 11.919095655063682, 0.14208277946086312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b4268ff-2a21-427e-93e2-d93372a7509a", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 807.0000000000001, 191, 1934, 708.5, 1866.8999999999999, 1933.25, 1934.0, 0.09733221253815864, 0.05978707195947441, 0.04400860781754634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 163.6875, 143, 435, 145.0, 235.5000000000002, 435.0, 435.0, 0.07638252367858234, 0.056764746600977696, 0.0383404464558509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7514a98-8952-454d-8ae0-d813145c0580", 3, 0, 0.0, 335.6666666666667, 242, 501, 264.0, 501.0, 501.0, 501.0, 0.01947356463600662, 0.02684588093538022, 0.012487930446918307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 297.49999999999994, 142, 578, 288.0, 482.1000000000001, 578.0, 578.0, 0.07638288832344334, 0.09214058867337245, 0.03955276028662679], "isController": false}, {"data": ["login", 22, 0, 0.0, 3474.9999999999995, 2356, 5780, 3136.5, 4592.1, 5602.399999999998, 5780.0, 0.09726551274399274, 26.580309847304196, 0.18340904569268518], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d95f17b-e7ec-49c8-8345-93df4f4bb4e1", 1, 0, 0.0, 810.0, 810, 810, 810.0, 810.0, 810.0, 810.0, 1.2345679012345678, 0.22304205246913578, 0.8511766975308641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 149.0, 145, 162, 148.0, 155.6, 162.0, 162.0, 0.08472717848527742, 0.0685926083635693, 0.030117864227188453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/863b61d2-3b59-40ba-9fa4-c977c41aa51d", 3, 0, 0.0, 612.0, 234, 1093, 509.0, 1093.0, 1093.0, 1093.0, 0.061623153873015216, 0.027882872357907276, 0.03951745219070312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=878fa01f-a3b3-43f2-bf3f-e9d7cf49b6cc", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.19723150927947597, 0.7526780840611353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54ec9a07-c950-48f8-b72a-2dde93458cab", 3, 0, 0.0, 851.6666666666666, 251, 2048, 256.0, 2048.0, 2048.0, 2048.0, 0.034348916291691, 0.02829983956193682, 0.02202713707507528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca1d405d-1428-4fe9-9381-b1d75043a9ed", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1208.5625, 290, 1937, 1506.0, 1816.6000000000001, 1937.0, 1937.0, 0.07632968700057724, 57.11738738091376, 0.15946121378514147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e966d366-0754-49f0-8bb2-273426d85b22", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 1012.4999999999999, 145, 1845, 1141.5, 1845.0, 1845.0, 1845.0, 0.052738096022888335, 39.43847781786239, 0.08731528275859796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 591.2142857142857, 292, 1688, 577.5, 1286.5, 1688.0, 1688.0, 0.09859085499397892, 8.566806692822585, 0.21993132970894572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a697b88-a05e-4663-ac79-875f9fb12f45", 1, 0, 0.0, 1109.0, 1109, 1109, 1109.0, 1109.0, 1109.0, 1109.0, 0.9017132551848511, 0.1629071798917944, 0.6216890216411182], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1481.2608695652175, 329, 4060, 1436.0, 2654.8000000000006, 3813.9999999999964, 4060.0, 0.09721294707389029, 0.03077529438616364, 0.04385974760560285], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 502.2352941176471, 289, 1426, 294.0, 1332.3999999999999, 1426.0, 1426.0, 0.0831348692092896, 11.81465023601745, 0.1844698180691193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e966d366-0754-49f0-8bb2-273426d85b22", 3, 0, 0.0, 462.0, 341, 566, 479.0, 566.0, 566.0, 566.0, 0.03906402593851322, 0.025572186250765006, 0.025050823925413752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 178.55, 142, 434, 148.0, 402.00000000000057, 433.65, 434.0, 0.11877895236964009, 0.09221608118541395, 0.042222205725145505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f1a7e63-3c4d-4dc8-a1e8-c5ae7de50793", 3, 0, 0.0, 709.3333333333334, 281, 1252, 595.0, 1252.0, 1252.0, 1252.0, 0.06574621959237344, 0.02974845222441376, 0.04216147545474468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 541.1666666666666, 289, 1852, 434.5, 989.8000000000013, 1852.0, 1852.0, 0.09970807690816333, 6.772916715712886, 0.22282851041672438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 146.8, 144, 149, 147.0, 149.0, 149.0, 149.0, 0.025899757578269067, 0.019247769059631603, 0.01300046425315459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 205.0, 145, 438, 147.0, 438.0, 438.0, 438.0, 0.025900428393085623, 0.006930388066118614, 0.014771338067931643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 146.4, 144, 150, 146.0, 150.0, 150.0, 150.0, 0.025900428393085623, 0.006980974840323859, 0.015226619035778852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06ae0bc0-206f-41c5-95c2-2a1d6d8acb48", 3, 0, 0.0, 1385.0, 238, 3301, 616.0, 3301.0, 3301.0, 3301.0, 0.08870490833826139, 0.04013666099940864, 0.05688433249556475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 205.4, 145, 440, 147.0, 440.0, 440.0, 440.0, 0.025900428393085623, 0.006980974840323859, 0.015251912422881474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 1.9927153716216217, 4.176784206081082], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1641.9230769230771, 1145, 2589, 1578.0, 2255.9, 2369.8999999999987, 2589.0, 0.2408533619887077, 288.1443551151233, 0.47559130658317084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1481.2608695652175, 329, 4060, 1436.0, 2654.8000000000006, 3813.9999999999964, 4060.0, 0.09479376174618352, 0.030009438161495598, 0.042768279225328894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 288.6666666666667, 146, 434, 288.0, 434.0, 434.0, 434.0, 0.04858929092028117, 0.013096332318357034, 0.02861263908684526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 193.16666666666666, 145, 431, 145.5, 431.0, 431.0, 431.0, 0.04858850395996307, 0.013096120207958797, 0.028564725960837666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 246.15, 142, 1611, 144.5, 432.5, 1552.0999999999992, 1611.0, 0.11666365285563456, 5.278580270790921, 0.06808417865871799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 251.7, 142, 861, 146.0, 440.20000000000005, 839.9999999999998, 861.0, 0.11685928972923702, 1.7479479326130907, 0.06831247151554813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 240.5, 144, 436, 145.0, 436.0, 436.0, 436.0, 0.04870169400725655, 0.013031507966785445, 0.0277751848635135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 174.25000000000003, 144, 433, 145.5, 403.2000000000006, 432.9, 433.0, 0.11685382754712131, 0.08684156519859308, 0.05865514390548863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 289.5, 145, 435, 289.0, 435.0, 435.0, 435.0, 0.0487005081086346, 0.03619246745182708, 0.02444537223421698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 215.79999999999995, 139, 434, 145.5, 433.6, 434.0, 434.0, 0.11666977786074295, 0.039979907276694045, 0.0660483107674538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 157.0, 147, 179, 151.5, 179.0, 179.0, 179.0, 0.045401920501237196, 0.0357362772695285, 0.016138963928174162], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 884.6923076923076, 145, 2820, 595.0, 2511.2, 2820.0, 2820.0, 0.07275617168217866, 0.013630851275191824, 0.04951704593153085], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1758.4090909090912, 1091, 2783, 1728.0, 2348.2, 2722.099999999999, 2783.0, 0.09738089652394463, 0.05040222183368228, 0.04479140845974407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 579.1666666666667, 292, 869, 578.0, 869.0, 869.0, 869.0, 0.04853073208609352, 0.07521315607483439, 0.10914675390065759], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 1462.8070175438597, 730, 4883, 1161.0, 2433.8, 2582.499999999999, 4883.0, 0.2687981891490415, 96.98070389315272, 0.9731131811322534], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78c2d1db-7caa-4f1b-855f-45b70d74efce", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.6751288319238901, 1.2614792547568712], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 252.51923076923077, 142, 613, 146.5, 581.7, 585.05, 613.0, 0.24292481476982875, 0.18053299222640593, 0.11742947588971214], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 932.8269230769229, 701, 1431, 862.5, 1222.8000000000002, 1292.8, 1431.0, 0.24265615156676543, 71.34896550316154, 0.12203898247742599], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 226.53846153846152, 143, 466, 148.0, 435.4, 439.79999999999995, 466.0, 0.24314631329402467, 0.4302549996960671, 0.11824889064494559], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1387.6153846153845, 993, 2005, 1412.0, 1714.5, 1852.9499999999998, 2005.0, 0.24154589371980675, 217.34341976147343, 0.12124471618357488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 200.7222222222222, 145, 440, 148.5, 438.2, 440.0, 440.0, 0.09892447116626456, 0.07390353558807851, 0.03516455810988311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb40bd48-9333-4a3a-a975-289e4a0354e9", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 13, 7.831325301204819, 222.24096385542168, 144, 2878, 153.0, 339.90000000000015, 429.95000000000005, 1704.160000000022, 0.7157486256332866, 1.5617252344507921, 0.34415169909453486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 209.8, 145, 442, 152.0, 442.0, 442.0, 442.0, 0.02713792579405571, 0.02101599136199822, 0.009646684559605741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2ae55c1-c104-49dc-b906-8cdf136d5a45", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 149.35714285714286, 144, 158, 149.0, 155.5, 158.0, 158.0, 0.09458373024720133, 0.07675691390178155, 0.03362156036130985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a697b88-a05e-4663-ac79-875f9fb12f45", 3, 0, 0.0, 480.66666666666663, 283, 793, 366.0, 793.0, 793.0, 793.0, 0.022032578839911283, 0.026041762294178993, 0.014128964946167066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7514a98-8952-454d-8ae0-d813145c0580", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 353.6, 290, 589, 294.0, 589.0, 589.0, 589.0, 0.025880185095083802, 0.040109232173728505, 0.05820514284568163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d95f17b-e7ec-49c8-8345-93df4f4bb4e1", 3, 0, 0.0, 593.3333333333333, 283, 1131, 366.0, 1131.0, 1131.0, 1131.0, 0.020697220363305208, 0.02446341378227904, 0.013272631548083093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 493.34999999999997, 288, 1758, 293.0, 862.7, 1713.2499999999993, 1758.0, 0.11655894677335696, 7.143862561339146, 0.26065266817999033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/878fa01f-a3b3-43f2-bf3f-e9d7cf49b6cc", 3, 0, 0.0, 1106.3333333333333, 283, 2197, 839.0, 2197.0, 2197.0, 2197.0, 0.043076216185170296, 0.027693856434150822, 0.027623745405203605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b4268ff-2a21-427e-93e2-d93372a7509a", 3, 0, 0.0, 357.6666666666667, 230, 546, 297.0, 546.0, 546.0, 546.0, 0.01966207447993813, 0.02323990639214041, 0.012608817293449908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 151.6153846153846, 145, 174, 149.0, 166.4, 174.0, 174.0, 0.06675670262970057, 0.0553480864576326, 0.023729921637901375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 149.37500000000003, 143, 157, 149.0, 154.9, 157.0, 157.0, 0.0725278212189207, 0.05630822057523628, 0.02578137394891322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=636b5839-bd49-4d26-b07c-f261b3561b29", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54ec9a07-c950-48f8-b72a-2dde93458cab", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e8f171f-2a7b-487c-a091-ab3964ce3363", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 181.61111111111111, 142, 463, 146.5, 429.70000000000005, 463.0, 463.0, 0.0997887804147887, 0.0741594354449748, 0.05008929016914198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 191.88888888888889, 141, 432, 145.0, 431.1, 432.0, 432.0, 0.09978988684935608, 0.035028242616934345, 0.05644582032830873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 309.66666666666663, 141, 1709, 144.0, 558.8000000000018, 1709.0, 1709.0, 0.09979099330845952, 5.013853146811955, 0.058189756731734085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 293.7222222222222, 143, 1125, 146.5, 503.100000000001, 1125.0, 1125.0, 0.09979099330845952, 1.6555061586288717, 0.05828720887363688], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.833333333333332, 0.4022526146419952], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.16090104585679807], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.08045052292839903], "isController": false}, {"data": ["401/Unauthorized", 16, 66.66666666666667, 1.2872083668543846], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1243, 24, "401/Unauthorized", 16, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
