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

    var data = {"OkPercent": 98.46860643185299, "KoPercent": 1.5313935681470139};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7215984147952443, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18c83cb1-6f29-4e40-b633-028fa2bb5dfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2fb6948d-d37e-4702-90eb-871e674a8ac3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/779e3582-0792-4988-8476-df8ac7e67316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee1e6320-7872-4139-9a73-cb424c4ad59e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a9350986-4085-42ab-8af1-f0bd5c1ea011"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/db305f57-cc2a-40d2-9e36-f9262dfbc87e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f457f9fc-cb84-4e15-9d54-abeef38b8219"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3090012-45b8-45a1-9e66-5ffd54f7ec87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efd61088-84ed-4ac5-8819-45a1044f4483"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=073b13ef-53e4-4f75-8ddf-f7557a5b66f8"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86e8b4f4-942c-4975-8bb0-0de984520a77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e3090012-45b8-45a1-9e66-5ffd54f7ec87"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40e68ee5-438c-49ee-a729-709614f58bd9"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdf106c3-486e-49c3-b710-4711b76e3d74"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12f8795f-8532-4f4c-96aa-02778efc5c5d"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f457f9fc-cb84-4e15-9d54-abeef38b8219"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdf106c3-486e-49c3-b710-4711b76e3d74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=779e3582-0792-4988-8476-df8ac7e67316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9350986-4085-42ab-8af1-f0bd5c1ea011"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18c83cb1-6f29-4e40-b633-028fa2bb5dfb"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41d3f772-8a5c-4d85-b826-828ffda1743c"], "isController": false}, {"data": [0.25833333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/073b13ef-53e4-4f75-8ddf-f7557a5b66f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86e8b4f4-942c-4975-8bb0-0de984520a77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40e68ee5-438c-49ee-a729-709614f58bd9"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41d3f772-8a5c-4d85-b826-828ffda1743c"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18982004-0a87-4dd3-92f4-84236e6cee4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12f8795f-8532-4f4c-96aa-02778efc5c5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 20, 1.5313935681470139, 492.41960183767185, 138, 2731, 160.0, 1383.3, 1694.2999999999997, 2281.4400000000005, 5.137121009487546, 718.6381455880646, 3.7572311443861413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2353.2142857142867, 1718, 3022, 2313.5, 2872.3, 2993.35, 3022.0, 0.2622901678657074, 315.62302495649965, 1.2896787062537471], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/18c83cb1-6f29-4e40-b633-028fa2bb5dfb", 3, 0, 0.0, 551.6666666666666, 239, 1018, 398.0, 1018.0, 1018.0, 1018.0, 0.02614424652281521, 0.02622084099505002, 0.016765678922508454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fb6948d-d37e-4702-90eb-871e674a8ac3", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.698765727571116, 1.3056448304157549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/779e3582-0792-4988-8476-df8ac7e67316", 3, 0, 0.0, 464.3333333333333, 246, 615, 532.0, 615.0, 615.0, 615.0, 0.058741751679035066, 0.02722924947621938, 0.03766967799729788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee1e6320-7872-4139-9a73-cb424c4ad59e", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9350986-4085-42ab-8af1-f0bd5c1ea011", 3, 0, 0.0, 673.0, 270, 1196, 553.0, 1196.0, 1196.0, 1196.0, 0.018586093884555573, 0.02562243085973075, 0.011918816716332839], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 713.6666666666667, 148, 1367, 650.5, 1265.9000000000003, 1367.0, 1367.0, 0.08960038229496445, 0.017040697706976884, 0.060542966649991044], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 713.6666666666667, 148, 1367, 650.5, 1265.9000000000003, 1367.0, 1367.0, 0.08981027579238858, 0.017080616416569994, 0.060684791658870633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 177.9375, 140, 420, 143.5, 419.3, 420.0, 420.0, 0.08761362391851932, 0.03166796147738473, 0.04950725892563793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db305f57-cc2a-40d2-9e36-f9262dfbc87e", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.5534418327556326, 1.034106910745234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 180.75, 141, 433, 144.0, 427.4, 433.0, 433.0, 0.08761218466458222, 0.06511022707983113, 0.04397720988046413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 259.5625, 140, 1145, 143.5, 645.9000000000005, 1145.0, 1145.0, 0.08761410368033994, 1.6322297892059425, 0.05112248725488586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 311.25, 138, 1810, 144.5, 939.200000000001, 1810.0, 1810.0, 0.08761602278016592, 4.949455009514552, 0.05103804451989157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f457f9fc-cb84-4e15-9d54-abeef38b8219", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 304.84615384615387, 145, 566, 272.0, 535.1999999999999, 566.0, 566.0, 0.0806361572529122, 0.17525885951010434, 0.052123958320410876], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3090012-45b8-45a1-9e66-5ffd54f7ec87", 1, 0, 0.0, 991.0, 991, 991, 991.0, 991.0, 991.0, 991.0, 1.0090817356205852, 0.18230480575176589, 0.6957145560040363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 169.95454545454547, 141, 434, 144.0, 345.0999999999998, 433.4, 434.0, 0.11274419367402579, 0.0837874329940758, 0.056592300340282474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 257.3181818181818, 140, 428, 144.0, 427.7, 428.0, 428.0, 0.11258725512272011, 0.037812285700395076, 0.0637801202892469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1072.8, 851, 1151, 1122.0, 1151.0, 1151.0, 1151.0, 0.031584599349357256, 9.286920916111304, 0.018013091816430307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1573.2, 1387, 1700, 1542.0, 1700.0, 1700.0, 1700.0, 0.031497848696934, 28.341819624813372, 0.01793285721710207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 258.2, 143, 434, 146.0, 434.0, 434.0, 434.0, 0.03177770857299022, 0.0562316483732991, 0.017595664805552202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efd61088-84ed-4ac5-8819-45a1044f4483", 2, 0, 0.0, 315.5, 293, 338, 315.5, 338.0, 338.0, 338.0, 0.021347451114336946, 0.029999006009307487, 0.013269192025659637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 170.49999999999997, 140, 425, 146.5, 347.3000000000003, 425.0, 425.0, 0.05980294928211543, 0.044443402737978366, 0.030018277276374346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 214.83333333333334, 139, 437, 144.5, 433.1, 437.0, 437.0, 0.05980443948289095, 0.03097293724520817, 0.03327011298055359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 398.08333333333337, 139, 1544, 143.5, 1537.7, 1544.0, 1544.0, 0.0598059297579355, 8.982346426471102, 0.03430275007600337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 344.5833333333333, 142, 858, 147.5, 856.8, 858.0, 858.0, 0.05980533363900504, 2.944225140916317, 0.03436081180756637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 144.4, 142, 147, 144.0, 147.0, 147.0, 147.0, 0.031777910538826254, 0.02361620109379568, 0.01784404156232919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 284.59090909090907, 140, 1573, 143.5, 432.8, 1402.1499999999976, 1573.0, 0.11258667894884983, 4.633770446316625, 0.06574886133926972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1140.6000000000001, 139, 2004, 1541.0, 1920.6000000000001, 2004.0, 2004.0, 0.08493626948579582, 45.864639942767106, 0.04555371015781159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 238.72727272727272, 140, 1112, 144.0, 430.8, 1009.9999999999985, 1112.0, 0.11274477146122348, 1.5358572414173042, 0.06595128721218053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 791.3333333333334, 141, 1281, 845.0, 1278.6, 1281.0, 1281.0, 0.0848689905682262, 14.981730623702212, 0.04560050645570122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=073b13ef-53e4-4f75-8ddf-f7557a5b66f8", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 565.5, 152, 1161, 522.5, 1110.0000000000002, 1161.0, 1161.0, 0.08996648748341243, 0.017110325622455635, 0.061493207061619544], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 629.75, 284, 1688, 305.5, 1681.7, 1688.0, 1688.0, 0.05975976574171829, 11.9927559180843, 0.1318527643871636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 816.9523809523811, 171, 1876, 941.0, 1647.0000000000002, 1858.0999999999997, 1876.0, 0.09647188533627343, 0.05925860925441014, 0.04361961221747519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 181.53333333333333, 141, 421, 145.0, 419.8, 421.0, 421.0, 0.0850721127942786, 0.06322253694965432, 0.042702212867440636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 247.46666666666667, 141, 583, 145.0, 489.40000000000003, 583.0, 583.0, 0.08507259528130671, 0.09942859573502723, 0.04423110324977314], "isController": false}, {"data": ["login", 21, 0, 0.0, 3439.809523809524, 2028, 5244, 3421.0, 5168.2, 5242.7, 5244.0, 0.0977803852547179, 27.986684224939122, 0.18613467589294444], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86e8b4f4-942c-4975-8bb0-0de984520a77", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 181.63636363636365, 144, 431, 149.5, 367.39999999999986, 430.09999999999997, 431.0, 0.1143504633792641, 0.09257474037247065, 0.04064801627934779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3090012-45b8-45a1-9e66-5ffd54f7ec87", 3, 0, 0.0, 1236.3333333333333, 272, 2617, 820.0, 2617.0, 2617.0, 2617.0, 0.020391101323382475, 0.024101591440495368, 0.013076324741882642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40e68ee5-438c-49ee-a729-709614f58bd9", 3, 0, 0.0, 379.3333333333333, 264, 520, 354.0, 520.0, 520.0, 520.0, 0.02131241874640353, 0.02519055744407266, 0.013667143532036116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1369.9333333333332, 289, 2150, 1686.0, 2064.2000000000003, 2150.0, 2150.0, 0.08479894170920746, 60.92197781871682, 0.17769684484337633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdf106c3-486e-49c3-b710-4711b76e3d74", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1270.5714285714287, 145, 1848, 1686.0, 1848.0, 1848.0, 1848.0, 0.04405729966516452, 37.65183050212734, 0.07930068084262733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 529.3125, 285, 2236, 294.0, 1275.600000000001, 2236.0, 2236.0, 0.0875431560402042, 6.672948215829444, 0.19548668865276556], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1411.4545454545453, 172, 2581, 1510.0, 2428.2999999999997, 2561.6499999999996, 2581.0, 0.09176033867906822, 0.029017251986402787, 0.04139968405247023], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/12f8795f-8532-4f4c-96aa-02778efc5c5d", 3, 0, 0.0, 361.6666666666667, 237, 509, 339.0, 509.0, 509.0, 509.0, 0.028314708547266688, 0.023604807483577468, 0.018157544218136513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 533.5454545454544, 285, 1720, 566.0, 862.1, 1591.4499999999982, 1720.0, 0.1125020454917362, 6.284229026997934, 0.25171134148461793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 148.46666666666667, 144, 160, 147.0, 160.0, 160.0, 160.0, 0.10645319253124402, 0.08264676568587791, 0.03784078328259064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f457f9fc-cb84-4e15-9d54-abeef38b8219", 3, 0, 0.0, 627.3333333333334, 489, 744, 649.0, 744.0, 744.0, 744.0, 0.023316726642469088, 0.027559581523048583, 0.014952458165906282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 538.35, 284, 1674, 309.5, 1373.0000000000014, 1661.85, 1674.0, 0.08842084786751021, 10.701538951041377, 0.1965982289304172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdf106c3-486e-49c3-b710-4711b76e3d74", 3, 0, 0.0, 604.0, 246, 1000, 566.0, 1000.0, 1000.0, 1000.0, 0.018444626158168817, 0.025427406178334944, 0.011828096852731956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 196.36363636363637, 140, 430, 145.0, 429.8, 430.0, 430.0, 0.06131549609810479, 0.045567473174470456, 0.030777504877369008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=779e3582-0792-4988-8476-df8ac7e67316", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 194.0909090909091, 139, 432, 143.0, 431.0, 432.0, 432.0, 0.06131925591870181, 0.016407691525121382, 0.03497113814113463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 194.27272727272728, 140, 424, 144.0, 423.2, 424.0, 424.0, 0.06131788865786291, 0.01652708717731461, 0.03604821188675143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 195.0, 140, 432, 144.0, 430.6, 432.0, 432.0, 0.0613195977434388, 0.01652754782928624, 0.03610909906181015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.9402754934210527, 4.0668688322368425], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1587.0892857142862, 1115, 2420, 1441.0, 2276.4, 2393.2, 2420.0, 0.2514175911501008, 300.7828459124438, 0.4964515325249061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1411.4545454545453, 172, 2581, 1510.0, 2428.2999999999997, 2561.6499999999996, 2581.0, 0.09099783259707814, 0.028776125684551877, 0.04105566275375987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 143.8, 141, 149, 143.0, 149.0, 149.0, 149.0, 0.029979793619100727, 0.008080491248898243, 0.01765411675031029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 144.4, 140, 150, 144.0, 150.0, 150.0, 150.0, 0.029979434108201773, 0.00808039434947626, 0.01762462825501706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 207.86666666666667, 140, 560, 142.0, 479.6, 560.0, 560.0, 0.09931670109645639, 0.026768954592404255, 0.05838735748053392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9350986-4085-42ab-8af1-f0bd5c1ea011", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 0.15561073428079242, 0.5938442075796727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 218.53333333333333, 139, 429, 144.0, 428.4, 429.0, 429.0, 0.0993160435136692, 0.026768777353293652, 0.058483959217522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 144.0, 143, 145, 144.0, 145.0, 145.0, 145.0, 0.029979074605925065, 0.008021744572288544, 0.01709744098619164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 162.66666666666669, 141, 416, 143.0, 258.2000000000001, 416.0, 416.0, 0.0993120981998027, 0.07380518235356431, 0.04985001804169784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 148.0, 145, 153, 148.0, 153.0, 153.0, 153.0, 0.02997871511227029, 0.02227910371136493, 0.015047909734088797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 180.0, 139, 423, 143.0, 422.4, 423.0, 423.0, 0.09931735868795148, 0.026575152617674517, 0.05664193112672233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 147.4, 145, 151, 147.0, 151.0, 151.0, 151.0, 0.028687325365906836, 0.022580062739180576, 0.010197447688662195], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 630.3333333333334, 158, 1018, 584.0, 1012.6, 1018.0, 1018.0, 0.09030568474285457, 0.01696906136647552, 0.061460485148477594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18c83cb1-6f29-4e40-b633-028fa2bb5dfb", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1771.095238095238, 1218, 2731, 1663.0, 2674.2000000000003, 2728.1, 2731.0, 0.09665793676729831, 0.050028033678386825, 0.044458875212302254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 294.6, 290, 299, 293.0, 299.0, 299.0, 299.0, 0.029952674773857303, 0.046420795767687054, 0.06736426758222008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41d3f772-8a5c-4d85-b826-828ffda1743c", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 1477.65, 722, 3227, 1170.0, 2678.6, 2806.6, 3227.0, 0.2928271977901307, 88.72449619995704, 1.0647109216003983], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 246.23214285714283, 140, 834, 145.0, 574.2, 583.0, 834.0, 0.25317600253176004, 0.18815130656901308, 0.12238488403634884], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 887.5535714285713, 696, 1294, 842.0, 1137.5, 1142.45, 1294.0, 0.252910731544291, 74.36415250065485, 0.12719631518096666], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 191.5892857142857, 139, 596, 147.0, 425.90000000000003, 434.15, 596.0, 0.2540120292839583, 0.44948222369387925, 0.12353319392911251], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1336.2678571428567, 974, 1836, 1279.5, 1721.6000000000001, 1820.0, 1836.0, 0.25240460458114355, 227.11410688208196, 0.12669528003389433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 180.79999999999998, 140, 451, 149.0, 405.10000000000053, 449.95, 451.0, 0.08925065152975617, 0.06667651212916355, 0.031725817535968016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, 6.25, 233.05113636363637, 142, 2648, 150.0, 426.3, 540.75, 1212.719999999981, 0.7091255595443868, 1.5217767460705982, 0.34105892390196335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 154.3636363636364, 143, 185, 151.0, 181.8, 185.0, 185.0, 0.06458127847447279, 0.05001265022486027, 0.022956626332722746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/073b13ef-53e4-4f75-8ddf-f7557a5b66f8", 3, 0, 0.0, 331.6666666666667, 249, 477, 269.0, 477.0, 477.0, 477.0, 0.07959459817993686, 0.03601448290042716, 0.051042108858878776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 149.43749999999997, 142, 168, 147.0, 163.1, 168.0, 168.0, 0.0934568521395778, 0.07584242590623941, 0.03322099040899055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86e8b4f4-942c-4975-8bb0-0de984520a77", 3, 0, 0.0, 462.6666666666667, 294, 627, 467.0, 627.0, 627.0, 627.0, 0.08220078912757563, 0.03639097435335379, 0.05271339667360806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40e68ee5-438c-49ee-a729-709614f58bd9", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 444.8181818181818, 284, 863, 295.0, 862.8, 863.0, 863.0, 0.06126597788855162, 0.09495029971594865, 0.13778862019270935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41d3f772-8a5c-4d85-b826-828ffda1743c", 3, 0, 0.0, 347.3333333333333, 242, 523, 277.0, 523.0, 523.0, 523.0, 0.029184298847220194, 0.02432974913663116, 0.018715191643562428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 429.2666666666667, 285, 842, 295.0, 759.2, 842.0, 842.0, 0.0992181608921697, 0.1537687708358138, 0.2231439692721356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18982004-0a87-4dd3-92f4-84236e6cee4c", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.6927026843817787, 1.29431602494577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 147.08333333333337, 143, 157, 146.0, 154.60000000000002, 157.0, 157.0, 0.06057149202727736, 0.05021991868277195, 0.02153127255657125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 148.66666666666666, 143, 162, 147.0, 160.2, 162.0, 162.0, 0.08849296480929766, 0.0687030342025309, 0.03145648358455503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12f8795f-8532-4f4c-96aa-02778efc5c5d", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 172.64999999999998, 141, 424, 144.0, 395.3000000000006, 423.9, 424.0, 0.08847756651301063, 0.06575334776992293, 0.044411591003601036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 222.60000000000002, 139, 571, 144.5, 429.0, 563.8999999999999, 571.0, 0.08848069793574533, 0.03696488532901547, 0.04971854842991001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 342.15, 139, 1286, 151.5, 1169.1000000000017, 1284.25, 1286.0, 0.08847991505928154, 7.982901602039463, 0.05125613829410724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 285.2, 139, 1109, 145.0, 814.4000000000009, 1096.3999999999999, 1109.0, 0.08847913219667142, 2.623043366940657, 0.051342090186779446], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.38284839203675347], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07656967840735068], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07656967840735068], "isController": false}, {"data": ["401/Unauthorized", 13, 65.0, 0.9954058192955589], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 20, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
