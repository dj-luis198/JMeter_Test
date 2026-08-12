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

    var data = {"OkPercent": 97.14714714714715, "KoPercent": 2.8528528528528527};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8026400515132003, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36363636363636365, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b816f3d6-81c0-4f1d-819e-8371b69d3a71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d2b23bd-1c86-4288-bee3-63ab6603214e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8de20f4d-925b-43df-85bd-591f69fac465"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d46f38e-1a7e-4059-b42f-e9044001bf45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efb99c11-e460-43e0-9a59-a15f4b32b198"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fa7a9e9-fc72-4ad3-9594-f26234527a32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41ea7e2b-4e97-40a4-bfbf-d59f77b27e68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a687b640-cced-4c53-b5e0-5769f6a113f4"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f65f9cf-bb40-4d56-82da-eca05fe9509e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=613b3a7c-ef22-4612-9425-8889c9e90096"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83516f70-df15-45d2-9d7c-2274fa727b07"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8de20f4d-925b-43df-85bd-591f69fac465"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6276612-01f3-4ac3-834c-246731d74d14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b816f3d6-81c0-4f1d-819e-8371b69d3a71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d46f38e-1a7e-4059-b42f-e9044001bf45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54c641df-c917-47b2-b338-6345905610b3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d2b23bd-1c86-4288-bee3-63ab6603214e"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5fa7a9e9-fc72-4ad3-9594-f26234527a32"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8971428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83516f70-df15-45d2-9d7c-2274fa727b07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a687b640-cced-4c53-b5e0-5769f6a113f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41ea7e2b-4e97-40a4-bfbf-d59f77b27e68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54c641df-c917-47b2-b338-6345905610b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6276612-01f3-4ac3-834c-246731d74d14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/613b3a7c-ef22-4612-9425-8889c9e90096"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f65f9cf-bb40-4d56-82da-eca05fe9509e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 38, 2.8528528528528527, 304.37837837837833, 77, 2873, 95.0, 811.7, 1035.6999999999998, 1627.6800000000003, 5.313292805514337, 747.8799892834135, 3.897543630480829], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1369.3999999999999, 979, 2020, 1353.0, 1711.8, 1793.6, 2020.0, 0.24562453387162325, 295.56759014978627, 1.2077339141051004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b816f3d6-81c0-4f1d-819e-8371b69d3a71", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d2b23bd-1c86-4288-bee3-63ab6603214e", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 0.5865716314935066, 2.2384841720779223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8de20f4d-925b-43df-85bd-591f69fac465", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 462.1333333333334, 85, 930, 474.0, 918.0, 930.0, 930.0, 0.07939952783747446, 0.016159044532548513, 0.053206988283276344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 462.1333333333334, 85, 930, 474.0, 918.0, 930.0, 930.0, 0.07950684553940095, 0.016180885361729645, 0.05327890371986028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d46f38e-1a7e-4059-b42f-e9044001bf45", 3, 0, 0.0, 328.0, 257, 417, 310.0, 417.0, 417.0, 417.0, 0.022095215649304736, 0.030460038500913268, 0.014169132431357529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 121.38461538461539, 78, 257, 82.0, 251.79999999999998, 257.0, 257.0, 0.07862253321802028, 0.03920495609233914, 0.04382355742771263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 82.76923076923076, 81, 87, 83.0, 85.8, 87.0, 87.0, 0.07869821052376685, 0.05848568184432284, 0.03950281270431266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 184.23076923076923, 81, 645, 90.0, 580.1999999999999, 645.0, 645.0, 0.07869916336735559, 3.5779742229971063, 0.04530286124429431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 231.76923076923077, 79, 977, 83.0, 967.8, 977.0, 977.0, 0.07862348422994345, 10.901861921285796, 0.045182516102694366], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 238.59999999999997, 81, 484, 205.0, 446.20000000000005, 484.0, 484.0, 0.07859822682400286, 0.1397318867111358, 0.05079717432824716], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 85.92857142857143, 80, 107, 84.0, 100.0, 107.0, 107.0, 0.14477766287487073, 0.10759355610134436, 0.07267160031023785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 105.71428571428571, 80, 244, 83.0, 239.5, 244.0, 244.0, 0.1447791600740442, 0.05427198704226517, 0.08170085135316808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 547.6, 386, 730, 565.0, 729.2, 730.0, 730.0, 0.08014104824491104, 23.564129117246353, 0.04570544157717583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 803.8000000000001, 564, 928, 830.0, 926.3, 928.0, 928.0, 0.07994308052666502, 71.93292438283942, 0.04551446869828682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 176.4, 79, 243, 235.0, 243.0, 243.0, 243.0, 0.08033612635265952, 0.14215728608497954, 0.04448299183784956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 101.05882352941177, 78, 242, 82.0, 241.2, 242.0, 242.0, 0.09201773235830622, 0.06838427180143655, 0.046188588312665424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 128.05882352941177, 77, 245, 81.0, 244.2, 245.0, 245.0, 0.09193612062019026, 0.024600094775324346, 0.052432318791202255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 110.05882352941177, 79, 247, 82.0, 244.6, 247.0, 247.0, 0.09201823043530036, 0.02480178867201455, 0.054096655002002746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 137.64705882352942, 79, 246, 82.0, 245.2, 246.0, 246.0, 0.09194208730171607, 0.02478126571804066, 0.05414167836224101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 98.8, 80, 250, 82.0, 233.60000000000005, 250.0, 250.0, 0.08033741715203857, 0.05970388130146616, 0.04511134263908415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efb99c11-e460-43e0-9a59-a15f4b32b198", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.8895151462395543, 1.6620604108635098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 480.52380952380963, 79, 1037, 241.0, 1005.8000000000001, 1035.0, 1037.0, 0.10360853734347711, 44.40850587546747, 0.056670555070404464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 138.50000000000003, 80, 547, 82.5, 394.5, 547.0, 547.0, 0.14478065730418416, 9.341513413540094, 0.08422647055781919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 347.4761904761905, 81, 732, 84.0, 709.0, 731.1, 732.0, 0.10360802616842718, 14.521389506973806, 0.05677145518706182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 156.49999999999997, 78, 643, 82.0, 445.0, 643.0, 643.0, 0.1447821545652916, 3.07700455417438, 0.0843687304156282], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 346.73333333333335, 83, 703, 428.0, 563.2, 703.0, 703.0, 0.07964150702969036, 0.016208291079089325, 0.05377357222688273], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fa7a9e9-fc72-4ad3-9594-f26234527a32", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 259.5882352941176, 159, 486, 169.0, 485.2, 486.0, 486.0, 0.0918963625257445, 0.14242141340659814, 0.20667707314139605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41ea7e2b-4e97-40a4-bfbf-d59f77b27e68", 3, 0, 0.0, 718.6666666666666, 201, 1496, 459.0, 1496.0, 1496.0, 1496.0, 0.026675677117604168, 0.026927498288310717, 0.017106472630755275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a687b640-cced-4c53-b5e0-5769f6a113f4", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 612.2173913043478, 126, 1539, 511.0, 1377.0000000000002, 1522.1999999999998, 1539.0, 0.10755554308534766, 0.06606683261785516, 0.04863107075050388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 96.80952380952381, 80, 374, 83.0, 85.8, 345.1999999999996, 374.0, 0.10360751499842122, 0.0769973817517564, 0.052006115926941904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 128.09523809523807, 80, 247, 82.0, 244.8, 246.8, 247.0, 0.10360853734347711, 0.101825838365748, 0.05494567335681793], "isController": false}, {"data": ["login", 23, 0, 0.0, 2810.6521739130435, 1666, 4534, 2633.0, 4150.4000000000015, 4524.4, 4534.0, 0.1047225308248493, 54.60897588763728, 0.23350474296310125], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8f65f9cf-bb40-4d56-82da-eca05fe9509e", 3, 0, 0.0, 274.6666666666667, 193, 396, 235.0, 396.0, 396.0, 396.0, 0.02847785846504343, 0.023740818857088612, 0.018262168351606625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=613b3a7c-ef22-4612-9425-8889c9e90096", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 86.14285714285712, 83, 93, 85.5, 92.0, 93.0, 93.0, 0.14591236919998332, 0.11812632233084588, 0.05186728748905658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83516f70-df15-45d2-9d7c-2274fa727b07", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 579.0, 164, 1123, 619.0, 1087.8, 1120.6, 1123.0, 0.10356408397567725, 59.083430309077144, 0.22030003224048567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 354.15384615384613, 162, 1060, 193.0, 1051.2, 1060.0, 1060.0, 0.07858213646694714, 14.566366628357876, 0.17363983955643408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, 37.5, 595.1875, 81, 1162, 793.5, 1054.9, 1162.0, 1162.0, 0.11622923310499132, 86.9182692831562, 0.19268201906522642], "isController": false}, {"data": ["register", 23, 10, 43.47826086956522, 917.6521739130435, 106, 2320, 916.0, 1869.8000000000006, 2258.999999999999, 2320.0, 0.10355788885987266, 0.03199249317868688, 0.04672240688795036], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 89.1875, 82, 106, 85.5, 101.10000000000001, 106.0, 106.0, 0.07798335055465658, 0.06054371454194529, 0.027720644142475583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 278.2142857142857, 165, 725, 256.5, 529.0, 725.0, 725.0, 0.1446520085964622, 12.569175867782898, 0.32268214529261036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8de20f4d-925b-43df-85bd-591f69fac465", 3, 0, 0.0, 1144.3333333333333, 253, 2102, 1078.0, 2102.0, 2102.0, 2102.0, 0.018055321505091603, 0.024890718285827774, 0.011578445105804183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 234.76190476190476, 161, 490, 168.0, 451.4000000000001, 488.9, 490.0, 0.11558339341835135, 0.17913168491691756, 0.2599497607836554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 101.22222222222223, 80, 242, 84.0, 242.0, 242.0, 242.0, 0.04929157059374435, 0.03663172384945259, 0.024742057895688084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 136.44444444444446, 81, 244, 83.0, 244.0, 244.0, 244.0, 0.049248414474656214, 0.01317779840435137, 0.028086986380077374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 116.88888888888889, 80, 244, 82.0, 244.0, 244.0, 244.0, 0.049292650465815546, 0.013285909695864347, 0.028978687090254845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 117.55555555555556, 81, 249, 83.0, 249.0, 249.0, 249.0, 0.04924706706356155, 0.013273623544475572, 0.02899998187434337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.33333333333333, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.03316749585406302, 0.009781820066334991, 0.020502953980099502], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 945.1272727272726, 628, 1665, 868.0, 1340.6, 1458.6, 1665.0, 0.2452324580763966, 293.3832764561235, 0.48423831077194723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 10, 43.47826086956522, 917.6521739130435, 106, 2320, 916.0, 1869.8000000000006, 2258.999999999999, 2320.0, 0.10518805795404654, 0.032496106898507245, 0.04745789333473584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6276612-01f3-4ac3-834c-246731d74d14", 3, 0, 0.0, 332.6666666666667, 229, 470, 299.0, 470.0, 470.0, 470.0, 0.024151672503320856, 0.028546459264179043, 0.015487888942559272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 123.5, 82, 243, 84.5, 243.0, 243.0, 243.0, 0.038017754291254015, 0.01024697283631456, 0.022387408044556807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 123.25, 83, 242, 84.0, 242.0, 242.0, 242.0, 0.0380181156320987, 0.010247070228964102, 0.022350493760276775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 137.37500000000003, 78, 331, 83.0, 270.80000000000007, 331.0, 331.0, 0.07751074250446899, 0.020891567315657653, 0.04556783885516633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b816f3d6-81c0-4f1d-819e-8371b69d3a71", 3, 0, 0.0, 427.0, 397, 484, 400.0, 484.0, 484.0, 484.0, 0.08211528986697324, 0.037155030245798436, 0.05265856804620354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 122.125, 78, 245, 82.5, 244.3, 245.0, 245.0, 0.07745033497269876, 0.02087528559811021, 0.04560796092630601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 83.18750000000001, 79, 95, 83.0, 88.0, 95.0, 95.0, 0.07750999152234468, 0.05760264018408623, 0.03890638246336441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 121.75, 79, 243, 82.5, 243.0, 243.0, 243.0, 0.03801956106416751, 0.010173202862872948, 0.021683030919408035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 117.12500000000001, 78, 332, 81.5, 271.80000000000007, 332.0, 332.0, 0.07751111800098827, 0.020740279621358187, 0.04420555948493862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 83.0, 81, 84, 83.5, 84.0, 84.0, 84.0, 0.038017392957277955, 0.02825316019578957, 0.01908294919925866], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 439.53333333333336, 81, 1078, 417.0, 914.2, 1078.0, 1078.0, 0.07880220646178093, 0.015606530732860521, 0.053622438928289995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 88.25, 84, 99, 85.0, 99.0, 99.0, 99.0, 0.04398891479347204, 0.03462408723001804, 0.015636684555492015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1405.3043478260868, 773, 2873, 1287.0, 1941.2000000000003, 2701.1999999999975, 2873.0, 0.10749974293539734, 0.05563951538648494, 0.04944568254157435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 207.0, 165, 326, 168.5, 326.0, 326.0, 326.0, 0.03798706540422986, 0.05887253202784452, 0.08543380041595836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d46f38e-1a7e-4059-b42f-e9044001bf45", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54c641df-c917-47b2-b338-6345905610b3", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["addBook", 60, 16, 26.666666666666668, 859.9833333333335, 416, 2384, 708.0, 1457.1, 1684.1499999999994, 2384.0, 0.2834052080430398, 74.60464973477995, 1.0317951491065651], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 155.9090909090909, 78, 613, 84.0, 331.4, 368.5999999999996, 613.0, 0.24602997092373072, 0.1828406326884366, 0.11893050352270185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d2b23bd-1c86-4288-bee3-63ab6603214e", 3, 0, 0.0, 395.66666666666663, 191, 805, 191.0, 805.0, 805.0, 805.0, 0.07640003056001222, 0.03541459749917233, 0.048993509180737], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 506.7272727272727, 389, 816, 478.0, 699.4, 724.4, 816.0, 0.24622933352434762, 72.39959963949786, 0.12383604176273341], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 123.81818181818177, 78, 332, 86.0, 245.4, 247.0, 332.0, 0.2466467256526048, 0.43644908875246086, 0.1199512396240207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa7a9e9-fc72-4ad3-9594-f26234527a32", 3, 0, 0.0, 917.3333333333334, 182, 2142, 428.0, 2142.0, 2142.0, 2142.0, 0.01929558259795724, 0.022806725394916256, 0.012373794830070235], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 787.1636363636364, 541, 1368, 760.0, 1015.0, 1084.9999999999998, 1368.0, 0.24594195769798327, 221.29900585649287, 0.12345133423512052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 92.9047619047619, 82, 244, 85.0, 90.0, 228.5999999999998, 244.0, 0.11888856178808396, 0.08881811500769946, 0.042261168448107976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, 9.142857142857142, 155.05142857142866, 80, 2047, 89.0, 254.20000000000005, 321.39999999999964, 1511.2000000000064, 0.7278141453798358, 1.5703849240058059, 0.34969601412583284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 88.33333333333334, 81, 101, 86.0, 101.0, 101.0, 101.0, 0.048908258974665525, 0.037875243522372815, 0.017385357682400633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 87.53846153846153, 81, 97, 86.0, 96.6, 97.0, 97.0, 0.0810817553576329, 0.0657997448263603, 0.028822030224783576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83516f70-df15-45d2-9d7c-2274fa727b07", 3, 0, 0.0, 529.6666666666666, 416, 752, 421.0, 752.0, 752.0, 752.0, 0.032717873774442977, 0.032813726920266545, 0.020981188585824435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 256.4444444444444, 166, 487, 172.0, 487.0, 487.0, 487.0, 0.049224172350235455, 0.07628785304670281, 0.110706317307219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a687b640-cced-4c53-b5e0-5769f6a113f4", 3, 0, 0.0, 351.6666666666667, 205, 605, 245.0, 605.0, 605.0, 605.0, 0.04014989293361884, 0.025812512546841544, 0.025747164413811564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41ea7e2b-4e97-40a4-bfbf-d59f77b27e68", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 252.87499999999997, 164, 417, 245.0, 355.4000000000001, 417.0, 417.0, 0.07741810615957807, 0.11998294382348673, 0.17411513523975422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54c641df-c917-47b2-b338-6345905610b3", 3, 0, 0.0, 476.0, 378, 654, 396.0, 654.0, 654.0, 654.0, 0.04814018421643827, 0.030949499943836452, 0.03087114677942168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6276612-01f3-4ac3-834c-246731d74d14", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 86.29411764705883, 83, 95, 85.0, 92.6, 95.0, 95.0, 0.08790436005625879, 0.07288164227320676, 0.031247252988748243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/613b3a7c-ef22-4612-9425-8889c9e90096", 3, 0, 0.0, 281.6666666666667, 173, 481, 191.0, 481.0, 481.0, 481.0, 0.07736345350456444, 0.035004948037547064, 0.0496113292330703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 108.57142857142857, 83, 246, 86.0, 241.8, 245.6, 246.0, 0.10115412034450204, 0.07853273991589757, 0.03595712871620971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f65f9cf-bb40-4d56-82da-eca05fe9509e", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 98.4761904761905, 79, 245, 84.0, 209.2000000000001, 244.2, 245.0, 0.11573755132409269, 0.08601198882581498, 0.05809482556697622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 97.61904761904762, 77, 243, 83.0, 212.4000000000001, 242.9, 243.0, 0.11574074074074074, 0.030969690393518517, 0.0660083912037037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 127.04761904761901, 79, 245, 82.0, 243.8, 244.9, 245.0, 0.11563685621933559, 0.03116774640286779, 0.06798182367582033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 112.14285714285715, 78, 243, 82.0, 241.8, 242.9, 243.0, 0.11563749297915221, 0.03116791802953712, 0.06809512526018435], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 26.31578947368421, 0.7507507507507507], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.894736842105263, 0.22522522522522523], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.22522522522522523], "isController": false}, {"data": ["401/Unauthorized", 22, 57.89473684210526, 1.6516516516516517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 38, "401/Unauthorized", 22, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
