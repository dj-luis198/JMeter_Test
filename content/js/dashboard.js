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

    var data = {"OkPercent": 97.36279401282965, "KoPercent": 2.6372059871703493};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8011677934849416, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c17ea61-c9d0-40b0-b673-5909be51d4e4"], "isController": false}, {"data": [0.4344262295081967, 500, 1500, "see books"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a53a099-ffe0-48af-87df-1997546a244a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/16b01641-e448-447d-bf90-e19c06199a83"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7190ea5b-69bc-4f44-8ea7-12eccc3c6061"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93d7806b-df0b-4c86-a8eb-30b3bc954f19"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1647fdd1-e1a6-41db-97b7-9832ba4b3950"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aba95320-298f-45c2-a8f5-e3ac0ef41783"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aba95320-298f-45c2-a8f5-e3ac0ef41783"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=868aa110-21ca-4c36-aee5-8304fa635b52"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=358bd39f-cdd0-4a47-a262-b05c658bc3a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5900185-4599-4501-97f9-2834d4537bb5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/508b6c3c-e77f-43aa-ac96-d58d506725d5"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93d7806b-df0b-4c86-a8eb-30b3bc954f19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7190ea5b-69bc-4f44-8ea7-12eccc3c6061"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ade93294-b79e-468e-b469-ada3b08629e3"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d49cade-3808-4f4a-8b33-616465e687ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a53a099-ffe0-48af-87df-1997546a244a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.28225806451612906, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1647fdd1-e1a6-41db-97b7-9832ba4b3950"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c17ea61-c9d0-40b0-b673-5909be51d4e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8360655737704918, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8702702702702703, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16b01641-e448-447d-bf90-e19c06199a83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ade93294-b79e-468e-b469-ada3b08629e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/358bd39f-cdd0-4a47-a262-b05c658bc3a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/868aa110-21ca-4c36-aee5-8304fa635b52"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5900185-4599-4501-97f9-2834d4537bb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=508b6c3c-e77f-43aa-ac96-d58d506725d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1403, 37, 2.6372059871703493, 303.73200285103337, 77, 3515, 93.0, 791.0000000000007, 1021.7999999999997, 1806.6400000000003, 5.666649164542851, 796.1061358554399, 4.1651412787421895], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/0c17ea61-c9d0-40b0-b673-5909be51d4e4", 3, 0, 0.0, 334.0, 261, 446, 295.0, 446.0, 446.0, 446.0, 0.0613710287830125, 0.027768792320438596, 0.039355770410981324], "isController": false}, {"data": ["see books", 61, 0, 0.0, 1309.3770491803282, 983, 1766, 1304.0, 1546.4, 1653.8999999999999, 1766.0, 0.2621096821597838, 315.40654141574674, 1.2887912594477648], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 606.5333333333333, 82, 2850, 490.0, 1650.0000000000007, 2850.0, 2850.0, 0.07712835701173894, 0.015696825782467182, 0.0516850376772024], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 606.5333333333333, 82, 2850, 490.0, 1650.0000000000007, 2850.0, 2850.0, 0.07804167425405166, 0.015882700111859733, 0.05229706725891626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 24, 0, 0.0, 113.99999999999999, 78, 251, 81.0, 237.5, 247.75, 251.0, 0.1108821599844765, 0.03660879907690602, 0.06284946649510732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 24, 0, 0.0, 108.66666666666667, 79, 252, 82.5, 241.5, 250.5, 252.0, 0.1108775496061537, 0.08240021020535446, 0.055655332517151365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a53a099-ffe0-48af-87df-1997546a244a", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 24, 0, 0.0, 147.20833333333331, 78, 470, 82.0, 285.0, 433.5, 470.0, 0.1108821599844765, 1.3871008097862747, 0.0648978267096643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 24, 0, 0.0, 132.45833333333331, 78, 860, 80.5, 236.0, 704.5, 860.0, 0.11088267227240177, 4.185825390110652, 0.06478984268520871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16b01641-e448-447d-bf90-e19c06199a83", 3, 0, 0.0, 443.3333333333333, 322, 514, 494.0, 514.0, 514.0, 514.0, 0.026621941804435216, 0.0266999357745654, 0.017072013461828572], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 203.68750000000003, 77, 328, 210.5, 323.8, 328.0, 328.0, 0.08205591084625286, 0.14116381244583026, 0.05302783105713656], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 108.91666666666666, 79, 247, 82.5, 243.4, 247.0, 247.0, 0.13360053440213762, 0.0992871158984636, 0.06706120574482298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7190ea5b-69bc-4f44-8ea7-12eccc3c6061", 3, 0, 0.0, 316.0, 193, 534, 221.0, 534.0, 534.0, 534.0, 0.05872335427799636, 0.03813577206530037, 0.03765788018478282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 120.91666666666667, 78, 244, 81.0, 243.7, 244.0, 244.0, 0.13336000533440023, 0.05237592657420373, 0.0751235316507746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 556.125, 467, 627, 577.0, 627.0, 627.0, 627.0, 0.057594977717942995, 16.93483578231978, 0.03284713572976436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93d7806b-df0b-4c86-a8eb-30b3bc954f19", 3, 0, 0.0, 396.66666666666663, 247, 684, 259.0, 684.0, 684.0, 684.0, 0.021524663677130042, 0.029673486547085202, 0.013803251121076233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 833.875, 627, 1160, 762.0, 1160.0, 1160.0, 1160.0, 0.05737399236925901, 51.62521918658022, 0.032665075733669925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 200.375, 81, 251, 235.5, 251.0, 251.0, 251.0, 0.057750474636713414, 0.1021912695719968, 0.03197706945216456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 92.07142857142857, 79, 240, 80.0, 162.5, 240.0, 240.0, 0.13157276443776136, 0.09778015013392227, 0.06604336027442319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 113.14285714285714, 77, 238, 80.0, 237.5, 238.0, 238.0, 0.13157771073580138, 0.035207317130478095, 0.0750404131540117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 91.35714285714288, 78, 236, 80.5, 159.5, 236.0, 236.0, 0.13157276443776136, 0.035462971664865374, 0.07735039471829332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1647fdd1-e1a6-41db-97b7-9832ba4b3950", 3, 0, 0.0, 467.0, 284, 641, 476.0, 641.0, 641.0, 641.0, 0.04810313311740371, 0.030925679657185005, 0.0308473867972934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 117.42857142857143, 77, 281, 81.0, 261.0, 281.0, 281.0, 0.1315764741264262, 0.03546397154188831, 0.07748106825999511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 82.87500000000001, 79, 95, 81.5, 95.0, 95.0, 95.0, 0.057821015047919165, 0.04297050044088524, 0.0324678551294468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 465.9523809523809, 79, 979, 239.0, 947.6, 976.5, 979.0, 0.09989012086704625, 42.8147248592025, 0.054636700224990606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 158.58333333333334, 78, 697, 81.5, 560.8000000000004, 697.0, 697.0, 0.13336296954878862, 10.03296956615359, 0.07744776617026006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aba95320-298f-45c2-a8f5-e3ac0ef41783", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 359.6190476190476, 78, 712, 239.0, 689.8000000000001, 710.8, 712.0, 0.09989012086704625, 14.000299075778548, 0.05473424917114983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 153.58333333333334, 80, 631, 81.5, 514.6000000000004, 631.0, 631.0, 0.13359904699346478, 3.3065546684516987, 0.0777153310473052], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 506.07142857142856, 85, 1127, 480.0, 1036.5, 1127.0, 1127.0, 0.07478552579566457, 0.014731746989882586, 0.050799487318511555], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 222.21428571428572, 160, 477, 164.0, 419.5, 477.0, 477.0, 0.13146897801650875, 0.2037512383908197, 0.29567681286330044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 584.952380952381, 139, 1807, 432.0, 1417.4, 1771.2999999999995, 1807.0, 0.09388453989869411, 0.05766931210574081, 0.04244974802060095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 99.61904761904762, 79, 256, 83.0, 211.4000000000001, 253.89999999999998, 256.0, 0.09988869545363738, 0.07423368871115042, 0.05013944283512657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 123.57142857142856, 77, 333, 81.0, 247.8, 324.6999999999999, 333.0, 0.09988917058692023, 0.09817046740996893, 0.05297321899987157], "isController": false}, {"data": ["login", 21, 0, 0.0, 2804.7619047619046, 1275, 6461, 2724.0, 4132.8, 6233.199999999997, 6461.0, 0.09531287586178726, 43.56570539187208, 0.2040158278944478], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aba95320-298f-45c2-a8f5-e3ac0ef41783", 3, 0, 0.0, 410.66666666666663, 229, 769, 234.0, 769.0, 769.0, 769.0, 0.023170317278877937, 0.0232381990677809, 0.014858569348759615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 93.83333333333331, 82, 126, 86.5, 122.4, 126.0, 126.0, 0.11846235858555944, 0.0959036086595984, 0.04210966652846058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=868aa110-21ca-4c36-aee5-8304fa635b52", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 567.4761904761905, 159, 1062, 496.0, 1037.4, 1059.6, 1062.0, 0.09985117420226043, 56.965210966808996, 0.21240198388829984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=358bd39f-cdd0-4a47-a262-b05c658bc3a0", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5900185-4599-4501-97f9-2834d4537bb5", 3, 0, 0.0, 303.6666666666667, 200, 411, 300.0, 411.0, 411.0, 411.0, 0.017460844057201726, 0.024071183132242616, 0.011197220961161262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/508b6c3c-e77f-43aa-ac96-d58d506725d5", 3, 0, 0.0, 349.3333333333333, 205, 515, 328.0, 515.0, 515.0, 515.0, 0.057026631436881026, 0.03666262926036459, 0.03656981247742696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 0, 0.0, 286.70833333333337, 160, 1096, 172.0, 489.5, 945.75, 1096.0, 0.11083607344737133, 5.689553534112111, 0.24809132488362212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 595.0769230769231, 77, 1241, 783.0, 1183.8, 1241.0, 1241.0, 0.0881057268722467, 64.87373189173161, 0.14436313961369027], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1233.0454545454545, 149, 3314, 1079.5, 2400.9999999999995, 3195.9499999999985, 3314.0, 0.09528305564097345, 0.02967444595068669, 0.04298903486926732], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 295.9166666666667, 161, 932, 172.0, 799.7000000000005, 932.0, 932.0, 0.13323858589447504, 13.47259179930383, 0.2968158406799609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 85.3125, 80, 91, 86.0, 89.6, 91.0, 91.0, 0.09860960457548565, 0.07655726136475692, 0.03505263287644216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 214.25, 157, 478, 166.0, 371.60000000000014, 478.0, 478.0, 0.0882977842774758, 0.13684431996909577, 0.19858378631936202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93d7806b-df0b-4c86-a8eb-30b3bc954f19", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7190ea5b-69bc-4f44-8ea7-12eccc3c6061", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 81.75, 78, 87, 81.0, 86.10000000000001, 87.0, 87.0, 0.05426009576906903, 0.040324153203380404, 0.027236024634083478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 119.00000000000001, 79, 238, 80.5, 237.4, 238.0, 238.0, 0.05426058646650539, 0.014518945988107887, 0.030945490719178858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 92.83333333333334, 78, 237, 80.0, 190.20000000000016, 237.0, 237.0, 0.05426058646650539, 0.014624923696050281, 0.0318992900906604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 120.33333333333333, 78, 244, 82.0, 243.1, 244.0, 244.0, 0.05426034111667782, 0.014624857566604569, 0.03195213446616867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 89.0, 85, 93, 89.0, 93.0, 93.0, 93.0, 0.017670966601873124, 0.005211554603286799, 0.010923556502915708], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 893.0983606557376, 628, 1415, 850.0, 1164.2000000000003, 1304.6, 1415.0, 0.2795959151495151, 334.4939177861962, 0.552092715265937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ade93294-b79e-468e-b469-ada3b08629e3", 3, 0, 0.0, 556.3333333333333, 193, 1150, 326.0, 1150.0, 1150.0, 1150.0, 0.08618460742911317, 0.03899629047085524, 0.05526812390473729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1233.0454545454545, 149, 3314, 1079.5, 2400.9999999999995, 3195.9499999999985, 3314.0, 0.09847982954036778, 0.030670032140235278, 0.04443132934340812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 120.74999999999999, 77, 246, 80.5, 246.0, 246.0, 246.0, 0.054503338329472684, 0.014690352909115684, 0.032095227551437525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 117.625, 78, 233, 79.0, 233.0, 233.0, 233.0, 0.05450370965873865, 0.0146904529939569, 0.0320422199360944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 163.0, 78, 929, 82.0, 444.6000000000005, 929.0, 929.0, 0.09768665783416469, 5.518348158682818, 0.056904386130936756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 146.4375, 78, 651, 82.0, 366.8000000000003, 651.0, 651.0, 0.09768606142011112, 1.819867952103303, 0.05699943525245742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 82.62500000000003, 79, 90, 83.0, 86.5, 90.0, 90.0, 0.09768546501334018, 0.0725963270265155, 0.049033524430524264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 123.0, 79, 244, 80.5, 244.0, 244.0, 244.0, 0.05444658449769623, 0.014568714992547624, 0.031051567721342384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 110.5625, 78, 242, 82.0, 237.1, 242.0, 242.0, 0.09768427222164561, 0.03530799927347322, 0.055197814467040716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 123.0, 79, 247, 82.5, 247.0, 247.0, 247.0, 0.054443249717575644, 0.04046026663581549, 0.027327959330892458], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 570.1538461538462, 83, 1150, 515.0, 1015.9999999999999, 1150.0, 1150.0, 0.07118957784580338, 0.013337350296531974, 0.04845083948940645], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 87.75, 80, 99, 84.0, 99.0, 99.0, 99.0, 0.05669577049552103, 0.044625772479873, 0.02015357466832974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1533.9523809523807, 787, 2833, 1537.0, 2429.6000000000004, 2801.0999999999995, 2833.0, 0.09650291806442719, 0.04994779938881485, 0.04438757266439961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d49cade-3808-4f4a-8b33-616465e687ed", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a53a099-ffe0-48af-87df-1997546a244a", 3, 0, 0.0, 268.0, 179, 438, 187.0, 438.0, 438.0, 438.0, 0.03819028948239428, 0.031837672970186116, 0.024490517669373935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 286.5, 162, 494, 251.0, 494.0, 494.0, 494.0, 0.05435668859053106, 0.08424225077458282, 0.12224946662499321], "isController": false}, {"data": ["addBook", 62, 19, 30.64516129032258, 928.0483870967746, 412, 3627, 721.5, 1625.4, 2293.299999999997, 3627.0, 0.291190546639802, 74.16526171630996, 1.0609090560847083], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1647fdd1-e1a6-41db-97b7-9832ba4b3950", 1, 0, 0.0, 946.0, 946, 946, 946.0, 946.0, 946.0, 946.0, 1.0570824524312896, 0.1909768102536998, 0.7288088002114165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c17ea61-c9d0-40b0-b673-5909be51d4e4", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.6124205508474576, 2.337129237288136], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 141.7213114754098, 80, 351, 84.0, 324.6, 329.0, 351.0, 0.28032315285424114, 0.20832609308796632, 0.13550777408481385], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 503.9508196721312, 386, 736, 470.0, 656.0, 715.6, 736.0, 0.2803038309721948, 82.418633268963, 0.14097311811589874], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 124.98360655737704, 77, 347, 84.0, 242.60000000000002, 255.1, 347.0, 0.2807191933695047, 0.49674138514213134, 0.13652163896290365], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 749.8524590163934, 542, 1090, 730.0, 964.8000000000001, 983.0, 1090.0, 0.2800940381295228, 252.02910786174604, 0.14059407773298316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 88.31250000000001, 81, 121, 84.0, 118.9, 121.0, 121.0, 0.08375472428991698, 0.06257066804861962, 0.029772187149931427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 19, 10.27027027027027, 177.85945945945937, 79, 2617, 89.0, 350.4, 484.49999999999983, 2455.3199999999974, 0.7932084208721005, 1.7044936864897313, 0.3787963799146765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 115.24999999999999, 79, 238, 87.0, 237.7, 238.0, 238.0, 0.05692518607420198, 0.044083664606291185, 0.020235124737313984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 86.79166666666667, 81, 102, 85.5, 93.0, 100.0, 102.0, 0.11231906101264993, 0.09114955048975791, 0.039925916219340406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 216.66666666666666, 160, 324, 167.0, 323.7, 324.0, 324.0, 0.054239739649249684, 0.08406100275718677, 0.12198644571506057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 277.75000000000006, 161, 1013, 173.0, 533.5000000000005, 1013.0, 1013.0, 0.09763420126070162, 7.442134811855842, 0.21802031782983577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16b01641-e448-447d-bf90-e19c06199a83", 1, 0, 0.0, 1127.0, 1127, 1127, 1127.0, 1127.0, 1127.0, 1127.0, 0.8873114463176576, 0.16030529059449866, 0.6117596495119787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ade93294-b79e-468e-b469-ada3b08629e3", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/358bd39f-cdd0-4a47-a262-b05c658bc3a0", 3, 0, 0.0, 415.33333333333337, 180, 815, 251.0, 815.0, 815.0, 815.0, 0.021545997112836387, 0.0216091201512529, 0.013816931742281147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 113.57142857142857, 81, 323, 84.5, 283.0, 323.0, 323.0, 0.1367334381623026, 0.11336590722636221, 0.048604464346756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 102.0, 79, 250, 87.0, 211.2000000000001, 248.79999999999998, 250.0, 0.1020551972824159, 0.07923230648390688, 0.036277433408983775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/868aa110-21ca-4c36-aee5-8304fa635b52", 3, 0, 0.0, 1460.0, 288, 3515, 577.0, 3515.0, 3515.0, 3515.0, 0.017613179355005372, 0.024281189638166587, 0.011294909937942898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5900185-4599-4501-97f9-2834d4537bb5", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.23043885522959182, 0.8794044961734694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=508b6c3c-e77f-43aa-ac96-d58d506725d5", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 92.0625, 78, 243, 81.0, 135.9000000000001, 243.0, 243.0, 0.08841244405150024, 0.06570495109686689, 0.04437890258053821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 90.5625, 77, 237, 81.0, 129.2000000000001, 237.0, 237.0, 0.08841439828476068, 0.023657758916039474, 0.05042383652177757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 109.87500000000001, 78, 242, 81.0, 239.2, 242.0, 242.0, 0.08834019810289424, 0.023810444019920714, 0.051934374275334316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 110.1875, 79, 245, 81.5, 235.20000000000002, 245.0, 245.0, 0.08834263691728368, 0.02381110135661162, 0.052022080137814515], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.62162162162162, 0.5702066999287242], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.2851033499643621], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 2.7027027027027026, 0.07127583749109052], "isController": false}, {"data": ["401/Unauthorized", 24, 64.86486486486487, 1.7106200997861725], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1403, 37, "401/Unauthorized", 24, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
