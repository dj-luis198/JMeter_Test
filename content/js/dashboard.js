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

    var data = {"OkPercent": 98.92224788298691, "KoPercent": 1.077752117013087};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8292440318302388, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3090909090909091, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ecd762a5-7db3-4e88-bbd5-7d424cbd494d"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b635c2d-d370-416d-b0db-65bb993a6576"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bc4bc73-0348-47a5-8075-aa7b293dac04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bde8fa9-cab1-4efb-9ae9-4f51f4f1264e"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad3a230c-fcdc-4c60-b91c-0ad33460c726"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba56c5c6-a082-47b3-85a3-36827742f6dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5450c96f-3be3-4749-b587-7660bfb6b24b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80b81023-1b67-44a9-baaf-97e95b41405f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7b59391-79da-4c3c-8914-a901d1f09220"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c7cca21-0ce4-4b59-9708-925a1bcc7654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02ff0fea-2fdb-45dd-ad87-d9854966633f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84a94934-9c78-48c3-9978-8b4e80586f23"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51977036-583f-49f6-b830-b2d8cac2ab43"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bc4bc73-0348-47a5-8075-aa7b293dac04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b635c2d-d370-416d-b0db-65bb993a6576"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ae84e3a-78cb-4b46-b960-1338c85ba299"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5450c96f-3be3-4749-b587-7660bfb6b24b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf441604-a344-40fc-b175-c5629d6b848b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba56c5c6-a082-47b3-85a3-36827742f6dd"], "isController": false}, {"data": [0.4426229508196721, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf4fbaca-6b43-455d-a73a-436fcaf17fec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c7cca21-0ce4-4b59-9708-925a1bcc7654"], "isController": false}, {"data": [0.7545454545454545, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad3a230c-fcdc-4c60-b91c-0ad33460c726"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9717514124293786, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cf4fbaca-6b43-455d-a73a-436fcaf17fec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02ff0fea-2fdb-45dd-ad87-d9854966633f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ae84e3a-78cb-4b46-b960-1338c85ba299"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51977036-583f-49f6-b830-b2d8cac2ab43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80b81023-1b67-44a9-baaf-97e95b41405f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3d92702-df78-4ecd-8cad-6381b191574b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 14, 1.077752117013087, 305.63356428021564, 97, 1645, 111.0, 789.0, 975.0, 1283.0, 5.1024215880747095, 708.1857100158101, 3.725839969951097], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1460.1454545454544, 1189, 1841, 1414.0, 1704.2, 1793.1999999999998, 1841.0, 0.25230399420159544, 303.6066694697258, 1.24057676836429], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ecd762a5-7db3-4e88-bbd5-7d424cbd494d", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 475.76923076923083, 103, 814, 457.0, 764.4, 814.0, 814.0, 0.06744137787922805, 0.012776979793525628, 0.045590817272774434], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 475.76923076923083, 103, 814, 457.0, 764.4, 814.0, 814.0, 0.06714043713589225, 0.012719965629260836, 0.0453873793408875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 138.37499999999997, 97, 306, 101.0, 301.1, 306.0, 306.0, 0.11594959091534955, 0.04191000228275757, 0.06551887894862708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 100.8125, 99, 102, 101.0, 102.0, 102.0, 102.0, 0.1159529520896896, 0.08617206693384159, 0.05820294665439498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 162.87500000000003, 99, 491, 101.0, 360.8000000000001, 491.0, 491.0, 0.11562782294489611, 2.154118676603433, 0.0674683830171635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b635c2d-d370-416d-b0db-65bb993a6576", 3, 0, 0.0, 261.0, 180, 406, 197.0, 406.0, 406.0, 406.0, 0.023828624532363243, 0.023898434955797902, 0.015280726018475127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 186.5, 99, 698, 100.0, 418.0000000000003, 698.0, 698.0, 0.11545427649856042, 6.522046185769539, 0.06725437102674932], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 235.0769230769231, 101, 557, 197.0, 462.5999999999999, 557.0, 557.0, 0.06716610694910877, 0.14332839544045464, 0.043416793141307156], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 100.78571428571429, 98, 103, 101.0, 103.0, 103.0, 103.0, 0.0779753152430602, 0.05794845205075079, 0.0391399531591142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 642.25, 491, 696, 691.0, 696.0, 696.0, 696.0, 0.017441125301404445, 5.12826993847643, 0.009946891773457225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 114.64285714285714, 98, 295, 101.0, 200.0, 295.0, 295.0, 0.0779774867856009, 0.04596189755429183, 0.04306820175560742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 789.25, 681, 902, 787.0, 902.0, 902.0, 902.0, 0.01741136526867913, 15.666777074672991, 0.009912915968398371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 249.25, 102, 300, 297.5, 300.0, 300.0, 300.0, 0.017456043500460403, 0.030889014475424074, 0.009665602211680712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 101.50000000000001, 99, 111, 101.0, 104.70000000000002, 111.0, 111.0, 0.09060934786438801, 0.06733761105937429, 0.04548164531474164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 135.11111111111111, 99, 296, 100.5, 296.0, 296.0, 296.0, 0.09060980398079073, 0.02424520145579752, 0.05167590383279471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 144.94444444444449, 98, 301, 101.0, 298.3, 301.0, 301.0, 0.09061071622737249, 0.024422419608158993, 0.053269190594607656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 124.3888888888889, 98, 300, 100.0, 300.0, 300.0, 300.0, 0.09060980398079073, 0.0244221737291975, 0.05335714043009454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 100.5, 99, 102, 100.5, 102.0, 102.0, 102.0, 0.017470529400717166, 0.01298346960346266, 0.009810111724035517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bc4bc73-0348-47a5-8075-aa7b293dac04", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bde8fa9-cab1-4efb-9ae9-4f51f4f1264e", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 403.2173913043478, 99, 984, 102.0, 891.6, 965.9999999999998, 984.0, 0.10879694233289026, 38.32485469843143, 0.06030210959636335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 278.0, 99, 889, 101.0, 887.5, 889.0, 889.0, 0.07797705246741672, 15.051632601022057, 0.04440601676506628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 314.86956521739137, 98, 697, 104.0, 695.8, 697.0, 697.0, 0.1087959130578747, 12.535523122087936, 0.06040778511624607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 211.42857142857142, 98, 693, 100.0, 686.0, 693.0, 693.0, 0.07797705246741672, 4.929622664169544, 0.04448216623036649], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 342.33333333333337, 102, 481, 371.0, 476.8, 481.0, 481.0, 0.07440014880029759, 0.014149832987165975, 0.05085342201934404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad3a230c-fcdc-4c60-b91c-0ad33460c726", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba56c5c6-a082-47b3-85a3-36827742f6dd", 3, 0, 0.0, 340.0, 183, 429, 408.0, 429.0, 429.0, 429.0, 0.05100219309430306, 0.033387177836146954, 0.03270648450383366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5450c96f-3be3-4749-b587-7660bfb6b24b", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 271.22222222222223, 201, 402, 210.5, 401.1, 402.0, 402.0, 0.09056284810094739, 0.14035472650019873, 0.20367796794578302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 544.2380952380952, 121, 1164, 544.0, 865.8000000000001, 1137.2999999999997, 1164.0, 0.08960955835289097, 0.05504337129293792, 0.040516821794324726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 110.2608695652174, 99, 297, 101.0, 105.6, 258.79999999999944, 297.0, 0.1087959130578747, 0.08085321273148696, 0.05461044854662851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80b81023-1b67-44a9-baaf-97e95b41405f", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.6383889134275619, 2.4362301236749118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 160.56521739130432, 98, 302, 102.0, 299.8, 301.8, 302.0, 0.10879642769294809, 0.09305346634879189, 0.05847253658871166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7b59391-79da-4c3c-8914-a901d1f09220", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["login", 21, 0, 0.0, 2005.6666666666667, 987, 2994, 1880.0, 2699.4, 2966.9999999999995, 2994.0, 0.08883060848966816, 20.36584628339079, 0.16208363956980607], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c7cca21-0ce4-4b59-9708-925a1bcc7654", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 117.92857142857143, 101, 305, 103.5, 206.0, 305.0, 305.0, 0.07710779669978629, 0.06242418307043247, 0.027409412108127165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02ff0fea-2fdb-45dd-ad87-d9854966633f", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84a94934-9c78-48c3-9978-8b4e80586f23", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 532.1304347826086, 201, 1084, 395.0, 996.0, 1067.1999999999998, 1084.0, 0.10874190345610137, 51.00858669507352, 0.23367597128977355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51977036-583f-49f6-b830-b2d8cac2ab43", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 629.3333333333333, 101, 1007, 792.5, 1007.0, 1007.0, 1007.0, 0.02610511660285416, 20.82285842868952, 0.045008382189784195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 352.49999999999994, 202, 799, 398.0, 526.0000000000002, 799.0, 799.0, 0.11536853034913402, 8.793928201566848, 0.25762164620077005], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 943.4090909090909, 497, 1645, 860.5, 1540.2, 1632.2499999999998, 1645.0, 0.09355929320206681, 0.029586133024304153, 0.042211321737651235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 121.41666666666667, 101, 297, 104.5, 243.0000000000002, 297.0, 297.0, 0.06377347661107746, 0.049511634673639233, 0.022669478014093938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 380.4285714285714, 200, 991, 205.5, 990.0, 991.0, 991.0, 0.07793190977711474, 20.07353888976253, 0.17099791810469595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 407.0499999999999, 198, 1078, 397.0, 781.8000000000002, 1063.6499999999999, 1078.0, 0.12320126158091857, 14.91099815737113, 0.27393030504632365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bc4bc73-0348-47a5-8075-aa7b293dac04", 3, 0, 0.0, 321.0, 197, 397, 369.0, 397.0, 397.0, 397.0, 0.05856058092096274, 0.02649713785160749, 0.03755349753069551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 101.0, 99, 102, 101.5, 102.0, 102.0, 102.0, 0.05462888775584529, 0.0405982261544905, 0.027421140924320783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 134.5, 100, 297, 101.5, 297.0, 297.0, 297.0, 0.05462888775584529, 0.014617495356544542, 0.031155537548255518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 134.16666666666669, 99, 297, 100.5, 297.0, 297.0, 297.0, 0.054628390374477614, 0.01472405834312092, 0.03211551855999563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 2.891390931372549, 6.060431985294118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 134.0, 100, 294, 102.0, 294.0, 294.0, 294.0, 0.05462888775584529, 0.014724192402942676, 0.032169159489037806], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 946.2, 780, 1424, 802.0, 1285.6, 1377.6, 1424.0, 0.26744728857076167, 319.95993685204814, 0.5281039233301564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 943.4090909090909, 497, 1645, 860.5, 1540.2, 1632.2499999999998, 1645.0, 0.0895291580189639, 0.028311688642005454, 0.04039303809058723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.42857142857142, 99, 302, 101.0, 302.0, 302.0, 302.0, 0.05331789653281336, 0.014370839299859849, 0.0313971597746938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 156.00000000000003, 97, 296, 102.0, 296.0, 296.0, 296.0, 0.053238011940525534, 0.014349307905844771, 0.03129812811347302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 167.25, 100, 701, 101.0, 579.2000000000005, 701.0, 701.0, 0.06535378180550715, 4.916600958317902, 0.03795284724642732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 183.08333333333334, 100, 495, 102.0, 437.1000000000002, 495.0, 495.0, 0.06535378180550715, 1.6174954626775444, 0.03801666929897177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 102.24999999999999, 99, 112, 101.5, 109.60000000000001, 112.0, 112.0, 0.0653502227353425, 0.04856593701327699, 0.03280274852145121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 99.71428571428571, 98, 102, 100.0, 102.0, 102.0, 102.0, 0.05331789653281336, 0.014266702783194198, 0.030407862866370115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b635c2d-d370-416d-b0db-65bb993a6576", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 116.83333333333333, 99, 298, 101.0, 238.9000000000002, 298.0, 298.0, 0.06535449366606033, 0.025667381708366462, 0.036815088310259564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 129.85714285714286, 100, 296, 101.0, 296.0, 296.0, 296.0, 0.053238011940525534, 0.03956457723314446, 0.026722986462334102], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 418.41666666666663, 101, 658, 414.5, 635.2, 658.0, 658.0, 0.07314441755709836, 0.013744340831652027, 0.04978082389567168], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 104.57142857142858, 102, 108, 105.0, 108.0, 108.0, 108.0, 0.05145621076463929, 0.0405016658948235, 0.018291074920242872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ae84e3a-78cb-4b46-b960-1338c85ba299", 3, 0, 0.0, 448.3333333333333, 207, 715, 423.0, 715.0, 715.0, 715.0, 0.08218727740945701, 0.03809722754917538, 0.05270473193249685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1040.2857142857142, 623, 1358, 1025.0, 1304.0, 1352.8999999999999, 1358.0, 0.08999511455092438, 0.046579502648427654, 0.04139423725926307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 288.2857142857143, 200, 599, 204.0, 599.0, 599.0, 599.0, 0.053118028258791035, 0.0823225691862318, 0.11946369050780833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5450c96f-3be3-4749-b587-7660bfb6b24b", 3, 0, 0.0, 293.0, 185, 397, 297.0, 397.0, 397.0, 397.0, 0.01659686761785159, 0.022880121862500484, 0.010643173570041548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf441604-a344-40fc-b175-c5629d6b848b", 2, 0, 0.0, 266.5, 212, 321, 266.5, 321.0, 321.0, 321.0, 0.01447995250575578, 0.028203384055400297, 0.009000478290931205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba56c5c6-a082-47b3-85a3-36827742f6dd", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 923.5081967213117, 529, 1722, 809.0, 1422.0, 1482.8, 1722.0, 0.28322955987983633, 89.94904969372902, 1.0302529652045522], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf4fbaca-6b43-455d-a73a-436fcaf17fec", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 177.72727272727272, 99, 413, 102.0, 402.0, 403.0, 413.0, 0.2683476614721065, 0.1994263382619854, 0.12971884026239522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c7cca21-0ce4-4b59-9708-925a1bcc7654", 3, 0, 0.0, 298.6666666666667, 192, 400, 304.0, 400.0, 400.0, 400.0, 0.0233586645072879, 0.027609150659492963, 0.014979351913853247], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 576.7636363636364, 486, 858, 500.0, 757.4, 805.1999999999999, 858.0, 0.2680259644061519, 78.80853283500808, 0.13479821452067212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad3a230c-fcdc-4c60-b91c-0ad33460c726", 3, 0, 0.0, 264.0, 180, 369, 243.0, 369.0, 369.0, 369.0, 0.01983602221634488, 0.027345557970774925, 0.012720365809309705], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 151.90909090909088, 99, 411, 103.0, 302.0, 311.7999999999999, 411.0, 0.26853764165360594, 0.47518574870735747, 0.1305974077573201], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 763.7636363636364, 677, 1036, 690.0, 904.4, 983.5999999999999, 1036.0, 0.2680233521436995, 241.16788339369953, 0.1345351591815054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 125.09999999999998, 99, 298, 104.0, 280.2000000000004, 297.95, 298.0, 0.11948787496788763, 0.08926584409222074, 0.042474205554991304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, 2.824858757062147, 152.19209039548028, 100, 432, 107.0, 266.6, 312.29999999999995, 410.15999999999997, 0.7765644263294826, 1.6186823248232987, 0.37596415875477673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 137.0, 103, 300, 104.0, 300.0, 300.0, 300.0, 0.053842081175911057, 0.04169606481689206, 0.019139177292999632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 118.125, 102, 297, 104.5, 171.0000000000001, 297.0, 297.0, 0.11398040961709707, 0.09249777382012467, 0.040516473731077474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf4fbaca-6b43-455d-a73a-436fcaf17fec", 3, 0, 0.0, 472.6666666666667, 279, 582, 557.0, 582.0, 582.0, 582.0, 0.06381349442695482, 0.028873944418446353, 0.04092206511103548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02ff0fea-2fdb-45dd-ad87-d9854966633f", 3, 0, 0.0, 363.66666666666663, 190, 658, 243.0, 658.0, 658.0, 658.0, 0.018873622225577535, 0.026018811889752882, 0.012103201752730384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 269.5, 202, 399, 207.5, 399.0, 399.0, 399.0, 0.054578201466334346, 0.08458555246784434, 0.12274765427438282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 303.3333333333333, 200, 802, 206.0, 682.3000000000004, 802.0, 802.0, 0.06531358685890633, 6.604267741143205, 0.14549919650681165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ae84e3a-78cb-4b46-b960-1338c85ba299", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 127.83333333333336, 101, 321, 105.0, 299.40000000000003, 321.0, 321.0, 0.09337068160597571, 0.07741377801120448, 0.03319035947712418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 121.95652173913044, 100, 300, 104.0, 229.40000000000023, 299.4, 300.0, 0.10826790186220792, 0.08405564646528836, 0.03848585574008172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51977036-583f-49f6-b830-b2d8cac2ab43", 3, 0, 0.0, 330.6666666666667, 198, 430, 364.0, 430.0, 430.0, 430.0, 0.02747781166707883, 0.027558313068447228, 0.017620862299526464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80b81023-1b67-44a9-baaf-97e95b41405f", 3, 0, 0.0, 329.0, 256, 429, 302.0, 429.0, 429.0, 429.0, 0.08351660588513682, 0.037789089251412826, 0.05355719843545558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3d92702-df78-4ecd-8cad-6381b191574b", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.698765727571116, 1.3056448304157549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 120.95, 99, 308, 101.0, 278.6000000000004, 307.5, 308.0, 0.1232794807468271, 0.09161687973470256, 0.061880520609247196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 175.8, 98, 400, 100.0, 327.50000000000006, 396.49999999999994, 400.0, 0.1232825203878468, 0.05150416232609459, 0.06927418186637407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 277.59999999999997, 99, 975, 295.5, 659.8000000000006, 960.6499999999999, 975.0, 0.12328100054860046, 11.122751373812651, 0.07141629836467753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 203.20000000000002, 98, 776, 101.5, 650.5000000000008, 771.65, 776.0, 0.1232794807468271, 3.654730965648173, 0.07153580806617642], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.3849114703618168], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07698229407236336], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07698229407236336], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.5388760585065435], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 14, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
