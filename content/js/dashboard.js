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

    var data = {"OkPercent": 97.57623143080532, "KoPercent": 2.4237685691946833};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7686666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b7a2901-5c71-4e4f-8ca0-66949221339a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e24feef-5107-470f-b203-a7871876db09"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24c72a68-dc25-4a11-901f-2a4726d20a8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebcc6e45-808d-45d8-b71a-0f1f6eb1c086"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a5566e7-dcde-452f-88cd-809c70976898"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11fee068-8649-4fb4-9fcd-0009c520dfa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4729eb1-baed-4d95-90bb-d581f9df4fd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51154aa1-8b57-49f2-a1c8-202baaee6ae5"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a457adf-bd83-4e49-90a6-ad474c4f2fdd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=949d9fd8-3bba-480e-ac17-ad8e5d351774"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e20f309-bdc3-46d4-8c23-e04985d26c56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5dbbb671-674b-4be1-9b66-0ab1a419f453"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7be6efac-6c18-445a-a384-f3133c717a4b"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a415083e-46c6-4197-afe8-75b496a1e7fe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b7a2901-5c71-4e4f-8ca0-66949221339a"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a5566e7-dcde-452f-88cd-809c70976898"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebcc6e45-808d-45d8-b71a-0f1f6eb1c086"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e550e3f-0991-4b5f-9259-682fc2833448"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11fee068-8649-4fb4-9fcd-0009c520dfa6"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4729eb1-baed-4d95-90bb-d581f9df4fd4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8855421686746988, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a457adf-bd83-4e49-90a6-ad474c4f2fdd"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/2e20f309-bdc3-46d4-8c23-e04985d26c56"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7be6efac-6c18-445a-a384-f3133c717a4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/949d9fd8-3bba-480e-ac17-ad8e5d351774"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24c72a68-dc25-4a11-901f-2a4726d20a8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51154aa1-8b57-49f2-a1c8-202baaee6ae5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7e24feef-5107-470f-b203-a7871876db09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5dbbb671-674b-4be1-9b66-0ab1a419f453"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a415083e-46c6-4197-afe8-75b496a1e7fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1279, 31, 2.4237685691946833, 368.9499609069581, 108, 3717, 122.0, 902.0, 1125.0, 1840.0000000000032, 5.209351580319322, 734.2876296355694, 3.8043616609644832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/0b7a2901-5c71-4e4f-8ca0-66949221339a", 3, 0, 0.0, 371.0, 208, 470, 435.0, 470.0, 470.0, 470.0, 0.027765694558849387, 0.02784703936712727, 0.017805474700824643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e24feef-5107-470f-b203-a7871876db09", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1658.185185185185, 1325, 2471, 1607.0, 1919.5, 2044.25, 2471.0, 0.24343953007154417, 292.94102318141654, 1.196990267490454], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/24c72a68-dc25-4a11-901f-2a4726d20a8d", 3, 0, 0.0, 695.3333333333334, 441, 1095, 550.0, 1095.0, 1095.0, 1095.0, 0.04012733741740456, 0.033452510132152696, 0.02573270010165592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebcc6e45-808d-45d8-b71a-0f1f6eb1c086", 3, 0, 0.0, 368.6666666666667, 211, 451, 444.0, 451.0, 451.0, 451.0, 0.029186854240849918, 0.02910134587881618, 0.0187168303562742], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 630.5, 115, 1750, 523.0, 1256.5000000000005, 1750.0, 1750.0, 0.0983574309039048, 0.019174416156437495, 0.06626399672346808], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 630.5, 115, 1750, 523.0, 1256.5000000000005, 1750.0, 1750.0, 0.09628056155637528, 0.01876953818426896, 0.06486479726924257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a5566e7-dcde-452f-88cd-809c70976898", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 156.23809523809524, 110, 348, 113.0, 341.0, 347.3, 348.0, 0.10826025765941323, 0.02896807675652268, 0.061742178196384105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 125.6190476190476, 110, 336, 114.0, 133.0, 316.0999999999997, 336.0, 0.10825802527051619, 0.08045347385826447, 0.05434045409086457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 159.42857142857144, 108, 453, 113.0, 335.0, 441.29999999999984, 453.0, 0.10825969955355762, 0.029179372145294827, 0.06375058479569848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 186.57142857142856, 109, 343, 114.0, 337.0, 342.4, 343.0, 0.10813371506251158, 0.029145415387942575, 0.06357079733167184], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 379.25, 112, 1734, 222.0, 1286.7000000000005, 1734.0, 1734.0, 0.09804822747188773, 0.16881362602261238, 0.06337467827925361], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 113.94736842105263, 111, 117, 114.0, 117.0, 117.0, 117.0, 0.0933816952218061, 0.06939791998417426, 0.04687323373438314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 112.94736842105263, 110, 117, 113.0, 116.0, 117.0, 117.0, 0.09338307210647635, 0.03236921455006561, 0.0528447586293331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 666.5714285714286, 548, 790, 668.0, 790.0, 790.0, 790.0, 0.08887985982376394, 26.13362987728231, 0.05068929505574037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 999.2857142857142, 754, 1896, 790.0, 1896.0, 1896.0, 1896.0, 0.0889080817446306, 79.99964823755604, 0.050618566071405885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 241.28571428571428, 109, 342, 333.0, 342.0, 342.0, 342.0, 0.08938832843825821, 0.15817544055676158, 0.04949529514110586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 145.00000000000003, 111, 337, 113.5, 335.5, 337.0, 337.0, 0.06681429444105069, 0.049653982489882405, 0.033537643889355526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 143.99999999999997, 109, 337, 111.5, 334.5, 337.0, 337.0, 0.06674517170195421, 0.017859547896811965, 0.03806560573627076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 191.64285714285714, 109, 344, 114.0, 339.5, 344.0, 344.0, 0.06674421709033353, 0.01798965226262896, 0.03923829950037186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11fee068-8649-4fb4-9fcd-0009c520dfa6", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 193.35714285714283, 110, 348, 114.5, 346.5, 348.0, 348.0, 0.06681493218284383, 0.018008712189907128, 0.03934512119751449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 144.14285714285714, 110, 335, 111.0, 335.0, 335.0, 335.0, 0.08965163934426229, 0.0666258765048668, 0.05034149670210041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 195.05263157894737, 110, 1235, 113.0, 334.0, 1235.0, 1235.0, 0.0933821541788514, 4.446235570306932, 0.05447612304327525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 717.6666666666667, 110, 1685, 767.0, 1388.0000000000002, 1685.0, 1685.0, 0.16814635458703256, 100.8806971838288, 0.08921828059142678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 229.78947368421058, 111, 769, 115.0, 463.0, 769.0, 769.0, 0.09327762858812035, 1.467329587295587, 0.05450623763457752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 595.4, 109, 1030, 762.0, 1014.4, 1030.0, 1030.0, 0.16816709082144018, 32.97958101169322, 0.08939350889043353], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 617.6875, 115, 3110, 468.5, 1690.4000000000015, 3110.0, 3110.0, 0.09633041331767964, 0.018779256600138475, 0.06555689138745899], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 355.99999999999994, 223, 671, 232.5, 668.5, 671.0, 671.0, 0.0667079620717587, 0.10338431231238386, 0.1500277701672464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4729eb1-baed-4d95-90bb-d581f9df4fd4", 1, 0, 0.0, 3110.0, 3110, 3110, 3110.0, 3110.0, 3110.0, 3110.0, 0.3215434083601286, 0.058091338424437304, 0.2216891077170418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51154aa1-8b57-49f2-a1c8-202baaee6ae5", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 0.5717217167721519, 2.181813686708861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 457.9545454545455, 148, 1624, 323.5, 1356.2999999999997, 1598.1999999999996, 1624.0, 0.1034476272876032, 0.06354351324599845, 0.04677368304117215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 128.33333333333334, 110, 336, 113.0, 205.80000000000007, 336.0, 336.0, 0.16815389444419532, 0.12496593132034439, 0.08440537279718399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 201.33333333333334, 109, 507, 115.0, 406.80000000000007, 507.0, 507.0, 0.16816897618727297, 0.2133862855397103, 0.08649315832548544], "isController": false}, {"data": ["login", 22, 0, 0.0, 2587.3636363636365, 1236, 4215, 2380.5, 4014.9, 4188.9, 4215.0, 0.1083722488226833, 41.398809991120864, 0.22068915513980022], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 129.68421052631575, 112, 349, 117.0, 131.0, 349.0, 349.0, 0.09583907106719328, 0.07758846671357737, 0.03406779479341636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a457adf-bd83-4e49-90a6-ad474c4f2fdd", 3, 0, 0.0, 309.0, 214, 446, 267.0, 446.0, 446.0, 446.0, 0.10122140495310075, 0.044811559484445644, 0.06491086190026317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=949d9fd8-3bba-480e-ac17-ad8e5d351774", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e20f309-bdc3-46d4-8c23-e04985d26c56", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5dbbb671-674b-4be1-9b66-0ab1a419f453", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7be6efac-6c18-445a-a384-f3133c717a4b", 3, 0, 0.0, 351.6666666666667, 286, 435, 334.0, 435.0, 435.0, 435.0, 0.02252133896867282, 0.0225873194539326, 0.014442395106863754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 877.9333333333333, 227, 1798, 1028.0, 1502.2000000000003, 1798.0, 1798.0, 0.16792423258625708, 134.01725797570137, 0.34902220867944383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a415083e-46c6-4197-afe8-75b496a1e7fe", 3, 0, 0.0, 338.6666666666667, 216, 442, 358.0, 442.0, 442.0, 442.0, 0.023015312854819406, 0.027607886676435385, 0.014759168725258537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b7a2901-5c71-4e4f-8ca0-66949221339a", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 362.9047619047619, 221, 677, 445.0, 549.4000000000001, 666.1999999999998, 677.0, 0.10807027655698391, 0.16748782118743502, 0.2430525848737636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 773.0909090909091, 112, 2007, 890.0, 1836.6000000000006, 2007.0, 2007.0, 0.09607658176990531, 73.15361690118087, 0.16101186382017957], "isController": false}, {"data": ["register", 25, 8, 32.0, 861.7999999999997, 187, 3717, 721.0, 1734.8000000000006, 3180.299999999999, 3717.0, 0.09850431054862961, 0.030828770942016425, 0.0444423744858075], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 370.05263157894734, 224, 1351, 232.0, 579.0, 1351.0, 1351.0, 0.093224996074737, 6.006850273909758, 0.2084098069629259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 152.35714285714283, 111, 415, 116.0, 375.5, 415.0, 415.0, 0.10366684438125703, 0.0804835364092767, 0.03685032358864996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 424.2142857142858, 222, 1135, 349.5, 1026.5, 1135.0, 1135.0, 0.07758252841460103, 13.36244323314104, 0.1716491794262218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 112.57142857142857, 109, 116, 112.0, 116.0, 116.0, 116.0, 0.037560902320190596, 0.027913912759438518, 0.018853812297439418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 112.28571428571428, 110, 115, 112.0, 115.0, 115.0, 115.0, 0.03756130541634024, 0.010050583675856666, 0.021421681995256545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a5566e7-dcde-452f-88cd-809c70976898", 3, 0, 0.0, 341.6666666666667, 215, 523, 287.0, 523.0, 523.0, 523.0, 0.05997001499250375, 0.027134870064967516, 0.03845733383308346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 111.71428571428572, 108, 115, 111.0, 115.0, 115.0, 115.0, 0.03756130541634024, 0.010123945600497956, 0.02208193931702815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 160.42857142857144, 109, 450, 113.0, 450.0, 450.0, 450.0, 0.037493706413566294, 0.01010572555678154, 0.022078813444707496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 116.0, 115, 117, 116.0, 117.0, 117.0, 117.0, 0.02832219327064688, 0.00835283434349156, 0.017507762051093237], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1081.1851851851854, 866, 2016, 908.5, 1457.0, 1579.25, 2016.0, 0.24944798085717718, 298.42650725477876, 0.4925623215754026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 861.7999999999997, 187, 3717, 721.0, 1734.8000000000006, 3180.299999999999, 3717.0, 0.10182469859889215, 0.03186794863962202, 0.04594044018817204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 113.83333333333334, 111, 121, 112.0, 121.0, 121.0, 121.0, 0.0401061476039919, 0.010809860096388442, 0.023617194341022572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 115.5, 113, 121, 115.0, 121.0, 121.0, 121.0, 0.0401061476039919, 0.010809860096388442, 0.023578028181253048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 246.28571428571433, 110, 978, 114.0, 712.0, 978.0, 978.0, 0.10294496121180925, 6.642197610665833, 0.059888460972829884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 174.64285714285714, 110, 549, 113.0, 440.0, 549.0, 549.0, 0.10294420424130121, 2.1878372112047413, 0.059988552053001555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 113.83333333333334, 108, 121, 114.0, 121.0, 121.0, 121.0, 0.0401061476039919, 0.010731527776849395, 0.02287303730540163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 129.5, 111, 341, 113.0, 228.5, 341.0, 341.0, 0.10277039625328498, 0.07637526518432605, 0.05158592155682469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebcc6e45-808d-45d8-b71a-0f1f6eb1c086", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.66666666666667, 110, 118, 113.0, 118.0, 118.0, 118.0, 0.04010775617158098, 0.029806643014231568, 0.02013221354706311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 160.50000000000003, 109, 343, 112.0, 340.5, 343.0, 343.0, 0.10294647518622282, 0.03859056624238012, 0.058094097674144994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 155.16666666666666, 113, 349, 116.5, 349.0, 349.0, 349.0, 0.03917906792997395, 0.030838211671444335, 0.013926934303232927], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 450.6875, 113, 694, 449.5, 627.5000000000001, 694.0, 694.0, 0.09615384615384616, 0.018416184645432692, 0.06543673001802884], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3e550e3f-0991-4b5f-9259-682fc2833448", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1362.9090909090905, 779, 2993, 1176.5, 2460.3999999999996, 2928.949999999999, 2993.0, 0.10566356720202874, 0.05468915099323753, 0.048601113429839395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 229.66666666666666, 223, 234, 231.0, 234.0, 234.0, 234.0, 0.040075341642287494, 0.06210895233038112, 0.09013038261932434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11fee068-8649-4fb4-9fcd-0009c520dfa6", 3, 0, 0.0, 381.0, 219, 694, 230.0, 694.0, 694.0, 694.0, 0.02302873986735446, 0.0230962068786846, 0.014767779146708427], "isController": false}, {"data": ["addBook", 56, 15, 26.785714285714285, 1161.160714285714, 570, 4430, 935.0, 1894.9, 2609.3999999999996, 4430.0, 0.2838317283324886, 86.05257895653826, 1.03054814210593], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 209.537037037037, 110, 821, 115.0, 456.0, 477.25, 821.0, 0.2503256551346891, 0.18603303081786954, 0.12100703055827257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4729eb1-baed-4d95-90bb-d581f9df4fd4", 3, 0, 0.0, 316.6666666666667, 212, 524, 214.0, 524.0, 524.0, 524.0, 0.03166160081053698, 0.026394973852794667, 0.020303826040611282], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 673.4444444444446, 535, 951, 660.0, 873.5, 894.75, 951.0, 0.25068008578829604, 73.70826858398247, 0.1260744572079809], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 173.35185185185185, 109, 382, 115.0, 340.0, 347.5, 382.0, 0.25118732527363136, 0.4444838216756055, 0.12215946092409025], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 866.9444444444446, 750, 1309, 790.5, 1021.5, 1133.75, 1309.0, 0.2504347826086956, 225.34165760869564, 0.12570652173913044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 115.42857142857142, 112, 118, 115.5, 118.0, 118.0, 118.0, 0.07593920524197485, 0.05673192579112379, 0.026994014363358246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 15, 9.036144578313253, 204.00602409638543, 109, 2862, 117.0, 330.4000000000001, 467.8000000000005, 1858.3400000000188, 0.7368411707784771, 1.6471250710208358, 0.35201348924256276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 120.28571428571429, 114, 128, 119.0, 128.0, 128.0, 128.0, 0.039279942539055486, 0.030418939876436523, 0.01396279207442988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 127.71428571428575, 111, 349, 117.0, 127.60000000000001, 326.99999999999966, 349.0, 0.11052340727875581, 0.08969233539906844, 0.039287617431120234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a457adf-bd83-4e49-90a6-ad474c4f2fdd", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.2002927522172949, 0.7643604490022172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e20f309-bdc3-46d4-8c23-e04985d26c56", 3, 0, 0.0, 1388.3333333333333, 449, 1982, 1734.0, 1982.0, 1982.0, 1982.0, 0.020607934054611025, 0.02840970075562425, 0.013215374377468659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 275.14285714285717, 223, 566, 228.0, 566.0, 566.0, 566.0, 0.03747022455370286, 0.05807152965500629, 0.0842714132296657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7be6efac-6c18-445a-a384-f3133c717a4b", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/949d9fd8-3bba-480e-ac17-ad8e5d351774", 3, 0, 0.0, 356.3333333333333, 289, 450, 330.0, 450.0, 450.0, 450.0, 0.09982032341784787, 0.04516609685898716, 0.06401238187928396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 408.9285714285715, 226, 1090, 338.5, 939.0, 1090.0, 1090.0, 0.10268597162933298, 8.92264164933841, 0.22906650200237647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24c72a68-dc25-4a11-901f-2a4726d20a8d", 1, 0, 0.0, 1082.0, 1082, 1082, 1082.0, 1082.0, 1082.0, 1082.0, 0.9242144177449169, 0.16697233133086875, 0.6372025184842883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 134.71428571428572, 112, 352, 117.0, 246.5, 352.0, 352.0, 0.06914399731326182, 0.05732739620992117, 0.024578530294948536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51154aa1-8b57-49f2-a1c8-202baaee6ae5", 3, 0, 0.0, 387.6666666666667, 227, 599, 337.0, 599.0, 599.0, 599.0, 0.07327975768826792, 0.0331571820269181, 0.04699255294462493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 132.73333333333332, 112, 332, 117.0, 221.60000000000008, 332.0, 332.0, 0.16291420937734188, 0.12648124653807305, 0.057910910364602004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e24feef-5107-470f-b203-a7871876db09", 3, 0, 0.0, 1231.6666666666667, 209, 2954, 532.0, 2954.0, 2954.0, 2954.0, 0.031320798053934416, 0.02611086061722853, 0.020085277397868098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dbbb671-674b-4be1-9b66-0ab1a419f453", 3, 0, 0.0, 302.0, 225, 426, 255.0, 426.0, 426.0, 426.0, 0.06677053193857112, 0.030211926886267528, 0.04281834242154463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a415083e-46c6-4197-afe8-75b496a1e7fe", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 114.0, 110, 119, 113.5, 118.0, 119.0, 119.0, 0.0777332970577947, 0.05776859283299001, 0.03901847137471336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 161.64285714285714, 109, 345, 113.0, 338.5, 345.0, 345.0, 0.07773243385802725, 0.03747813775297743, 0.04339916298825685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 291.6428571428571, 109, 1023, 125.5, 908.5, 1023.0, 1023.0, 0.07763157165116809, 9.996938491535387, 0.04468580700791287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 259.07142857142856, 110, 801, 115.5, 793.0, 801.0, 801.0, 0.0777311390943212, 3.283034519566038, 0.04481902872165589], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.806451612903224, 0.6254886630179828], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.1563721657544957], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.1563721657544957], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.4855355746677092], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1279, 31, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
