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

    var data = {"OkPercent": 97.73926149208742, "KoPercent": 2.260738507912585};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7743506493506493, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35196def-7627-4aaf-9f6e-77c33091d37e"], "isController": false}, {"data": [0.1810344827586207, 500, 1500, "see books"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c5a4f5df-cde9-4d66-835e-213a6c286b0d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7c83131-a4fb-49ec-b700-202cc71ff2ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b84ff5b1-b65b-428e-b64f-a4898ce79bd4"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0e07be8-e113-4a0c-bc30-374c3ab470b0"], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ce31f78-1d1c-47a8-9f9f-1f40f43a7bc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aba627b6-f393-4f0b-ba0f-eee075d5285c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aba627b6-f393-4f0b-ba0f-eee075d5285c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7c83131-a4fb-49ec-b700-202cc71ff2ef"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0e07be8-e113-4a0c-bc30-374c3ab470b0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5689655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd87dc93-b191-4639-bfdd-0de65ffac068"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6be5ee1-e084-4156-8490-72107dd46782"], "isController": false}, {"data": [0.9252873563218391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6be5ee1-e084-4156-8490-72107dd46782"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd87dc93-b191-4639-bfdd-0de65ffac068"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94514d85-d2c7-434a-8a5b-c306fcc8b646"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=357da4a7-e7b5-487f-aef4-5ea980f43aa7"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2797e435-6480-4e12-9b6d-72c3e6c21453"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/357da4a7-e7b5-487f-aef4-5ea980f43aa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fcde9ffd-0db9-4d62-b1d9-cd1898d9e4ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ce31f78-1d1c-47a8-9f9f-1f40f43a7bc0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcde9ffd-0db9-4d62-b1d9-cd1898d9e4ec"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd1b189b-85be-4f4e-b52c-ae2bbd84131d"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd1b189b-85be-4f4e-b52c-ae2bbd84131d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b84ff5b1-b65b-428e-b64f-a4898ce79bd4"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 30, 2.260738507912585, 366.21477015825224, 97, 2348, 115.0, 1069.8000000000002, 1273.7999999999997, 1699.8000000000004, 5.343975644035647, 755.0509129019056, 3.9200145378689335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/35196def-7627-4aaf-9f6e-77c33091d37e", 2, 0, 0.0, 244.5, 194, 295, 244.5, 295.0, 295.0, 295.0, 0.014337431449155884, 0.024502446324241013, 0.008911889763073945], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1674.6896551724135, 1216, 2222, 1651.0, 2007.1, 2024.85, 2222.0, 0.2522166802196894, 303.5027118049365, 1.2401474461973987], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 414.3888888888889, 199, 1411, 209.0, 1407.4, 1411.0, 1411.0, 0.11060315587671435, 22.196148792351792, 0.24403261410558916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 121.93333333333334, 102, 313, 106.0, 205.00000000000006, 313.0, 313.0, 0.09666505558240696, 0.07504757733204447, 0.03436140647655872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5a4f5df-cde9-4d66-835e-213a6c286b0d", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 0.3050008954154728, 0.5698946394460364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7c83131-a4fb-49ec-b700-202cc71ff2ef", 3, 0, 0.0, 663.6666666666666, 302, 952, 737.0, 952.0, 952.0, 952.0, 0.02823502837620352, 0.028317748185899425, 0.0181064472334378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b84ff5b1-b65b-428e-b64f-a4898ce79bd4", 3, 0, 0.0, 359.6666666666667, 190, 451, 438.0, 451.0, 451.0, 451.0, 0.021974480303540822, 0.025973091791066643, 0.01409170774673679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 354.5, 207, 760, 405.5, 654.7000000000004, 760.0, 760.0, 0.09058791557206268, 0.140393576184437, 0.20373434527584022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 102.9, 100, 106, 103.0, 105.9, 106.0, 106.0, 0.04497413986957499, 0.033423164492916574, 0.02257491005172026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 123.0, 99, 302, 102.5, 282.80000000000007, 302.0, 302.0, 0.044975353506278556, 0.012034420762422194, 0.025650006296549493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 101.6, 98, 105, 102.0, 104.9, 105.0, 105.0, 0.044975151228946006, 0.012122208729676854, 0.026440469765454586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 142.9, 98, 309, 102.5, 308.6, 309.0, 309.0, 0.044975151228946006, 0.012122208729676854, 0.026484390811576605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 182.0, 109, 321, 116.0, 321.0, 321.0, 321.0, 0.12083618640995691, 0.03563723466387401, 0.07469658788818624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0e07be8-e113-4a0c-bc30-374c3ab470b0", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1154.7758620689654, 801, 1782, 1073.0, 1562.8, 1596.6499999999999, 1782.0, 0.25797269047724947, 308.6250236289641, 0.50939529311035], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 436.9230769230769, 105, 654, 485.0, 646.0, 654.0, 654.0, 0.07838219156607619, 0.01622756309766421, 0.052409847290387925], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 436.9230769230769, 105, 654, 485.0, 646.0, 654.0, 654.0, 0.07890216738184401, 0.016335214340772394, 0.05275752643222607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1149.0869565217395, 344, 1878, 1158.0, 1797.6000000000001, 1874.3999999999999, 1878.0, 0.09284601286926474, 0.0288251548106345, 0.0418895097125003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 159.66666666666669, 99, 307, 103.0, 305.6, 306.9, 307.0, 0.0971682398667407, 0.026000095433092726, 0.055416261799000555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 130.375, 101, 304, 103.5, 304.0, 304.0, 304.0, 0.038939483175709555, 0.010495407574702964, 0.02293018394038365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 132.14285714285717, 99, 306, 103.0, 302.8, 305.9, 306.0, 0.09725509084088604, 0.07227648840811941, 0.048817496769741626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 131.375, 102, 304, 103.5, 304.0, 304.0, 304.0, 0.03897780701113304, 0.010505737045969452, 0.02291468732490438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ce31f78-1d1c-47a8-9f9f-1f40f43a7bc0", 3, 0, 0.0, 278.0, 199, 428, 207.0, 428.0, 428.0, 428.0, 0.03105268605734396, 0.025584097790083842, 0.019913343597971225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 168.57142857142858, 98, 409, 101.0, 385.20000000000005, 408.6, 409.0, 0.09711925782388116, 0.02617667496034297, 0.05719034420683627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 121.52380952380953, 98, 307, 102.0, 261.60000000000014, 306.09999999999997, 307.0, 0.09725599166377213, 0.026213529003126085, 0.05717588572420979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aba627b6-f393-4f0b-ba0f-eee075d5285c", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 181.53333333333336, 98, 304, 103.0, 304.0, 304.0, 304.0, 0.09604302727621974, 0.025886597195543603, 0.05646279533230887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 140.86666666666667, 99, 305, 102.0, 297.8, 305.0, 305.0, 0.09604302727621974, 0.025886597195543603, 0.05655658735113331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 129.625, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.038939483175709555, 0.010419353896625407, 0.022207673998646853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.66666666666666, 99, 306, 104.0, 185.4000000000001, 306.0, 306.0, 0.09604241232928461, 0.07137526931893123, 0.04820878900122293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 130.625, 103, 307, 104.0, 307.0, 307.0, 307.0, 0.038975148470956206, 0.028964929674216478, 0.01956369757233544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 140.79999999999998, 98, 301, 102.0, 301.0, 301.0, 301.0, 0.09604425719371487, 0.025699342256911985, 0.05477524043079051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aba627b6-f393-4f0b-ba0f-eee075d5285c", 3, 0, 0.0, 348.3333333333333, 213, 512, 320.0, 512.0, 512.0, 512.0, 0.0659108884787767, 0.02982296060725899, 0.042267073666403025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 157.25, 104, 312, 107.0, 312.0, 312.0, 312.0, 0.039731020987911835, 0.03127265909790717, 0.014123136366796785], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 517.6153846153846, 99, 1129, 446.0, 1128.6, 1129.0, 1129.0, 0.0779058896852602, 0.015637360069036606, 0.05301018244960088], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7c83131-a4fb-49ec-b700-202cc71ff2ef", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1534.7142857142858, 986, 2348, 1448.0, 2074.4, 2324.2999999999997, 2348.0, 0.09502262443438914, 0.049181631787330315, 0.04370669541855204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0e07be8-e113-4a0c-bc30-374c3ab470b0", 3, 0, 0.0, 555.3333333333333, 257, 1128, 281.0, 1128.0, 1128.0, 1128.0, 0.06979503524649279, 0.031580435869995115, 0.04475788393085639], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 209.07142857142856, 103, 304, 211.0, 303.0, 304.0, 304.0, 0.07305135510263716, 0.13434193121693122, 0.047211272672009856], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 289.125, 206, 612, 213.5, 612.0, 612.0, 612.0, 0.038917320153334246, 0.06031424519857563, 0.08752596514953981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 125.72222222222223, 99, 308, 103.5, 301.7, 308.0, 308.0, 0.11068136679190059, 0.08225441418812143, 0.05555685794046573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 125.83333333333331, 99, 300, 103.5, 297.3, 300.0, 300.0, 0.11067320048450267, 0.05731805402696737, 0.06156917305599449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 801.5714285714287, 787, 809, 804.0, 809.0, 809.0, 809.0, 0.07320031789852344, 21.523323941471116, 0.041747056301501655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1077.2857142857142, 881, 1403, 1101.0, 1403.0, 1403.0, 1403.0, 0.07274238802868128, 65.45372861568637, 0.041414855684298035], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1113.344827586207, 520, 3596, 869.5, 1893.7, 2035.199999999997, 3596.0, 0.27125492818759617, 73.79954074465324, 0.9884189418368635], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 130.42857142857142, 99, 303, 102.0, 303.0, 303.0, 303.0, 0.07373932096619579, 0.13048403280346363, 0.04083026854280568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 103.69230769230768, 99, 116, 103.0, 111.19999999999999, 116.0, 116.0, 0.07482574235770159, 0.05560780267012784, 0.03755901520689318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 117.61538461538461, 98, 303, 102.0, 225.79999999999993, 303.0, 303.0, 0.07482358899978128, 0.020021155650332103, 0.042672828101437764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 116.76923076923075, 98, 302, 102.0, 222.79999999999993, 302.0, 302.0, 0.07473884522734982, 0.020144454377684133, 0.043938266432484954], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 181.86206896551724, 99, 424, 105.0, 409.4, 417.0, 424.0, 0.2590222357191663, 0.19249601697488822, 0.12521094402440167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 163.15384615384616, 99, 303, 103.0, 303.0, 303.0, 303.0, 0.0748240196614501, 0.02016741154937522, 0.04406141001548281], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 661.8965517241379, 486, 918, 605.0, 888.5, 906.35, 918.0, 0.2589609415462647, 76.1431151271141, 0.13023914540656867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.14285714285714, 98, 112, 103.0, 112.0, 112.0, 112.0, 0.07373854419045613, 0.054799836063415146, 0.04140592081007057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd87dc93-b191-4639-bfdd-0de65ffac068", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 154.13793103448273, 98, 321, 106.0, 306.0, 310.54999999999995, 321.0, 0.2594254174289152, 0.4590613831847601, 0.12616587683554664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 697.6842105263158, 98, 1490, 1006.0, 1453.0, 1490.0, 1490.0, 0.10440478283805169, 49.457333388512176, 0.056656337232943554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 264.94444444444446, 97, 1105, 103.0, 1102.3, 1105.0, 1105.0, 0.11067592245307033, 16.622590444901835, 0.06348013520908527], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 971.3103448275859, 694, 1322, 928.5, 1206.1, 1257.0, 1322.0, 0.2585015822079601, 232.60017806803495, 0.12975567700672996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 449.0526315789474, 99, 927, 506.0, 811.0, 927.0, 927.0, 0.10440478283805169, 16.170420545212764, 0.05675829502868384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 217.16666666666669, 99, 840, 104.0, 633.9000000000003, 840.0, 840.0, 0.11067456145205025, 5.448524512109641, 0.06358743520926714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 123.33333333333333, 103, 298, 107.0, 242.5000000000002, 298.0, 298.0, 0.1000108345070716, 0.07471512538858377, 0.03555072632868561], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 590.9999999999999, 109, 2132, 437.0, 1746.3999999999996, 2132.0, 2132.0, 0.07908264136022143, 0.016372578094108345, 0.05322276021230648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6be5ee1-e084-4156-8490-72107dd46782", 1, 0, 0.0, 1168.0, 1168, 1168, 1168.0, 1168.0, 1168.0, 1168.0, 0.8561643835616438, 0.1546781357020548, 0.590285209760274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 189.0919540229885, 100, 1787, 110.0, 349.5, 412.25, 1400.75, 0.7213182713234532, 1.5818025183956888, 0.34493940434241893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 111.1, 104, 140, 108.0, 137.70000000000002, 140.0, 140.0, 0.04668795637477356, 0.03615580996601117, 0.016596109492595292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6be5ee1-e084-4156-8490-72107dd46782", 3, 0, 0.0, 547.0, 208, 1129, 304.0, 1129.0, 1129.0, 1129.0, 0.021172534987614067, 0.025025219576831598, 0.013577439428906156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd87dc93-b191-4639-bfdd-0de65ffac068", 3, 0, 0.0, 357.33333333333337, 211, 647, 214.0, 647.0, 647.0, 647.0, 0.04272104581120146, 0.02746551610583427, 0.0273959831536676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 283.53846153846155, 202, 408, 208.0, 408.0, 408.0, 408.0, 0.07469590149334344, 0.11576405827142193, 0.16799283314372068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94514d85-d2c7-434a-8a5b-c306fcc8b646", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.9337308114035087, 1.7446774488304093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 127.99999999999997, 104, 313, 106.0, 272.40000000000015, 312.7, 313.0, 0.098478276161223, 0.07991742918943, 0.03500594972918474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=357da4a7-e7b5-487f-aef4-5ea980f43aa7", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 744.904761904762, 287, 1680, 658.0, 1131.4, 1626.5999999999992, 1680.0, 0.09361250663088588, 0.05750221354572971, 0.04232674860361344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 104.47368421052632, 100, 118, 104.0, 112.0, 118.0, 118.0, 0.10440363544448475, 0.07758902985669228, 0.05240573107271988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 171.31578947368422, 99, 411, 103.0, 308.0, 411.0, 411.0, 0.1044053565442926, 0.110469195611678, 0.05492872273783815], "isController": false}, {"data": ["login", 21, 0, 0.0, 2933.0476190476193, 1878, 4163, 2919.0, 3982.8, 4150.7, 4163.0, 0.09653618957868848, 38.62676282695888, 0.19901161738340956], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 268.40000000000003, 203, 414, 209.5, 413.5, 414.0, 414.0, 0.04495331598135336, 0.0696688598265701, 0.10110106123540703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 118.1111111111111, 103, 309, 106.5, 133.50000000000028, 309.0, 309.0, 0.10693154005180239, 0.08656860029584393, 0.038010820877789134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 313.0666666666667, 202, 607, 213.0, 488.20000000000005, 607.0, 607.0, 0.09597850081581726, 0.14874793046357615, 0.21585789783088588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2797e435-6480-4e12-9b6d-72c3e6c21453", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 122.76923076923079, 101, 317, 106.0, 237.79999999999993, 317.0, 317.0, 0.07891509949372928, 0.06542863229509391, 0.02805185177316158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 824.8947368421052, 204, 1595, 1110.0, 1555.0, 1595.0, 1595.0, 0.10434457874995196, 65.77786030286013, 0.22062206702491638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/357da4a7-e7b5-487f-aef4-5ea980f43aa7", 3, 0, 0.0, 375.3333333333333, 206, 474, 446.0, 474.0, 474.0, 474.0, 0.01768899214019116, 0.02438570368284816, 0.011343526860734565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 106.10526315789473, 101, 118, 105.0, 111.0, 118.0, 118.0, 0.10105684181412987, 0.07845721605686841, 0.03592254923861648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcde9ffd-0db9-4d62-b1d9-cd1898d9e4ec", 3, 0, 0.0, 362.3333333333333, 213, 525, 349.0, 525.0, 525.0, 525.0, 0.02269580808424684, 0.03128800365780774, 0.014554277970692147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ce31f78-1d1c-47a8-9f9f-1f40f43a7bc0", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcde9ffd-0db9-4d62-b1d9-cd1898d9e4ec", 1, 0, 0.0, 870.0, 870, 870, 870.0, 870.0, 870.0, 870.0, 1.1494252873563218, 0.20765984195402298, 0.7924748563218391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd1b189b-85be-4f4e-b52c-ae2bbd84131d", 1, 0, 0.0, 2132.0, 2132, 2132, 2132.0, 2132.0, 2132.0, 2132.0, 0.46904315196998125, 0.08473924132270168, 0.32338326688555347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 331.33333333333337, 203, 700, 213.0, 610.0, 690.9999999999999, 700.0, 0.09707256867884234, 0.15044352196613553, 0.21831848209704482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 684.0, 99, 1508, 985.0, 1388.8, 1508.0, 1508.0, 0.1349471629954118, 86.9479006633172, 0.20511725481138537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd1b189b-85be-4f4e-b52c-ae2bbd84131d", 3, 0, 0.0, 289.3333333333333, 209, 437, 222.0, 437.0, 437.0, 437.0, 0.07540909433677702, 0.03412065140889325, 0.04835804552195661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 133.16666666666666, 100, 454, 103.0, 353.50000000000034, 454.0, 454.0, 0.09065840667850263, 0.06737406980697314, 0.04550627053979526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 185.91666666666663, 100, 307, 103.5, 306.7, 307.0, 307.0, 0.0909001386227114, 0.024322888654905197, 0.051841485308265094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 150.41666666666669, 100, 302, 103.0, 300.5, 302.0, 302.0, 0.09090151578277568, 0.024500799175826257, 0.05344014892698336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b84ff5b1-b65b-428e-b64f-a4898ce79bd4", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1149.0869565217395, 344, 1878, 1158.0, 1797.6000000000001, 1874.3999999999999, 1878.0, 0.09259743867432675, 0.028747981979733238, 0.041777360026893515], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 169.08333333333337, 98, 304, 103.5, 304.0, 304.0, 304.0, 0.09090289298456923, 0.02450117037474718, 0.05352973092743677], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 30.0, 0.6782215523737755], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22607385079125847], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22607385079125847], "isController": false}, {"data": ["401/Unauthorized", 15, 50.0, 1.1303692539562924], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 30, "401/Unauthorized", 15, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
