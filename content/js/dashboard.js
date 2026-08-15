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

    var data = {"OkPercent": 97.52130131680867, "KoPercent": 2.4786986831913245};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7249009247027741, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=615529fa-992b-46ac-b3d4-9759a3534a31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5f769cb-f668-41b2-96dc-3a8d50a6e8de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0529e205-dc05-4424-9345-82896dceaf03"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da9a86f1-1bcd-4ddc-86f2-3ddac24f4523"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76944aa6-d282-4c12-81d8-8a4a7b8227d7"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5714fd95-8d45-4821-9c4e-825280144895"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ea5e397-3e1a-405c-afdc-669b19db1495"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9533dd3-fb83-4488-9ab0-29393dd72555"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61981857-c514-45ab-90b3-232954d8b0e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afb41440-dab4-4a35-9952-9ccd7502086b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b316589d-fc3a-464a-b839-3b433c0aac62"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/615529fa-992b-46ac-b3d4-9759a3534a31"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba10dc2d-43b6-45e8-bd5e-4f963d67fa66"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a67a5816-af88-4f48-92e9-312c0bd0970f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5f769cb-f668-41b2-96dc-3a8d50a6e8de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d697153-1f98-4b02-b6b9-946cf394f9ac"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/992a8089-e3e6-413d-aab9-96331915e048"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/120f5c73-d9ab-4454-983d-759d3046fb7d"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dfbef54-0be1-4fb5-9df5-0249571e61c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da9a86f1-1bcd-4ddc-86f2-3ddac24f4523"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24561403508771928, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76944aa6-d282-4c12-81d8-8a4a7b8227d7"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ea5e397-3e1a-405c-afdc-669b19db1495"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44545454545454544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8994082840236687, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5714fd95-8d45-4821-9c4e-825280144895"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba10dc2d-43b6-45e8-bd5e-4f963d67fa66"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/61981857-c514-45ab-90b3-232954d8b0e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b316589d-fc3a-464a-b839-3b433c0aac62"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afb41440-dab4-4a35-9952-9ccd7502086b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a67a5816-af88-4f48-92e9-312c0bd0970f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=992a8089-e3e6-413d-aab9-96331915e048"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0529e205-dc05-4424-9345-82896dceaf03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1291, 32, 2.4786986831913245, 447.67854376452397, 126, 2688, 146.0, 1261.6, 1528.3999999999999, 1970.6799999999967, 5.157934269299304, 720.2893459791285, 3.7597191952264137], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2115.072727272727, 1544, 2801, 2103.0, 2488.8, 2729.5999999999995, 2801.0, 0.24550612202993388, 295.4259995028501, 1.2071516840046066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=615529fa-992b-46ac-b3d4-9759a3534a31", 1, 0, 0.0, 1131.0, 1131, 1131, 1131.0, 1131.0, 1131.0, 1131.0, 0.8841732979664013, 0.15973833996463307, 0.6095960433244916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5f769cb-f668-41b2-96dc-3a8d50a6e8de", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0529e205-dc05-4424-9345-82896dceaf03", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.2599482913669065, 0.9920188848920864], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 635.4375, 134, 1552, 575.0, 1308.4000000000003, 1552.0, 1552.0, 0.10170482716535933, 0.020553264327667527, 0.06821498692139488], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 635.4375, 134, 1552, 575.0, 1308.4000000000003, 1552.0, 1552.0, 0.09941902010128312, 0.020091331515829373, 0.06668186107745364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 163.125, 128, 396, 130.0, 395.3, 396.0, 396.0, 0.08868491358763732, 0.023730142893567018, 0.050578114780449414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 132.375, 127, 137, 132.0, 136.3, 137.0, 137.0, 0.08868393047179851, 0.06590671004788932, 0.04451517603760199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 210.3125, 127, 400, 131.5, 395.1, 400.0, 400.0, 0.08868294737775609, 0.023902825660410822, 0.05222247780154973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 163.0625, 127, 399, 131.0, 387.1, 399.0, 399.0, 0.08868147277755915, 0.02390242820957649, 0.052135006457119736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da9a86f1-1bcd-4ddc-86f2-3ddac24f4523", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 267.4117647058824, 131, 763, 229.0, 509.39999999999975, 763.0, 763.0, 0.09426690843356124, 0.15721259683152286, 0.06092583793577651], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 148.2857142857143, 126, 380, 132.0, 256.5, 380.0, 380.0, 0.08419938414164742, 0.06257395637870478, 0.042264143992975366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 147.5, 126, 393, 128.0, 263.0, 393.0, 393.0, 0.08420039694472846, 0.03156340214711012, 0.04751543047452938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 877.0, 657, 1039, 910.0, 1039.0, 1039.0, 1039.0, 0.04176830287031777, 12.281267882054667, 0.023820985230728106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1353.0, 902, 1715, 1526.0, 1715.0, 1715.0, 1715.0, 0.04177423532262242, 37.58853037456868, 0.02378357343075085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 342.8, 127, 429, 387.0, 429.0, 429.0, 429.0, 0.041997043408144065, 0.07431508071831744, 0.023254222277751646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 130.7272727272727, 128, 134, 132.0, 133.8, 134.0, 134.0, 0.056887822385875274, 0.04227698519106551, 0.02855502022103505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 178.0, 128, 393, 131.0, 393.0, 393.0, 393.0, 0.056811432526094524, 0.015201496593896387, 0.032400270112538286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 200.09090909090912, 126, 392, 132.0, 390.4, 392.0, 392.0, 0.05681407336246346, 0.015313168210976478, 0.033400461097854495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 129.9090909090909, 127, 132, 130.0, 132.0, 132.0, 132.0, 0.05688870500620604, 0.01533328377120397, 0.03349989171752172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 181.2, 130, 379, 132.0, 379.0, 379.0, 379.0, 0.042086479297660837, 0.03127715893117177, 0.023632544527495098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 261.7142857142857, 127, 1202, 130.5, 799.0, 1202.0, 1202.0, 0.0842019161950357, 5.432861987420836, 0.048984652697167806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 941.0, 127, 1519, 1346.0, 1516.9, 1519.0, 1519.0, 0.07598423327159615, 42.73939671190103, 0.040589233983948335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76944aa6-d282-4c12-81d8-8a4a7b8227d7", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 278.7142857142857, 129, 1009, 132.5, 767.5, 1009.0, 1009.0, 0.08406691726614385, 1.786644825531123, 0.0489882133678408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 668.375, 127, 1170, 790.5, 1079.0, 1170.0, 1170.0, 0.07589412769186984, 13.954791854425578, 0.04061521677260222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5714fd95-8d45-4821-9c4e-825280144895", 3, 0, 0.0, 432.0, 225, 815, 256.0, 815.0, 815.0, 815.0, 0.031313605761703465, 0.0257990677678618, 0.02008066515317572], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 599.875, 134, 1598, 475.0, 1271.1000000000004, 1598.0, 1598.0, 0.09961895748760989, 0.020131736342863547, 0.06735102490785247], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 333.27272727272725, 258, 526, 264.0, 525.0, 526.0, 526.0, 0.056772142425822035, 0.0879857324509566, 0.12768187891276186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ea5e397-3e1a-405c-afdc-669b19db1495", 1, 0, 0.0, 1598.0, 1598, 1598, 1598.0, 1598.0, 1598.0, 1598.0, 0.6257822277847309, 0.11305635951188986, 0.4314475125156445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9533dd3-fb83-4488-9ab0-29393dd72555", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.6808868603411514, 1.2722381396588487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 715.6363636363636, 160, 1852, 708.5, 1457.4999999999995, 1814.6499999999994, 1852.0, 0.09900009900009901, 0.06081158424908425, 0.04476274007524007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 132.8125, 128, 149, 132.0, 139.9, 149.0, 149.0, 0.07598242906327912, 0.05646741066128458, 0.038139617713403774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61981857-c514-45ab-90b3-232954d8b0e9", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 228.375, 129, 395, 133.5, 395.0, 395.0, 395.0, 0.07588872815234662, 0.09154448383807243, 0.03929687314724785], "isController": false}, {"data": ["login", 22, 0, 0.0, 3016.3181818181824, 1453, 6232, 2926.0, 3827.2, 5883.2499999999945, 6232.0, 0.1007778215499629, 27.540138811428665, 0.19003204276644284], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 138.28571428571428, 130, 166, 135.0, 156.0, 166.0, 166.0, 0.08223007976317738, 0.06657103137077543, 0.029230223665816957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afb41440-dab4-4a35-9952-9ccd7502086b", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b316589d-fc3a-464a-b839-3b433c0aac62", 3, 0, 0.0, 347.0, 246, 539, 256.0, 539.0, 539.0, 539.0, 0.028540713327561768, 0.02862432869863861, 0.01830247566904189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/615529fa-992b-46ac-b3d4-9759a3534a31", 3, 0, 0.0, 826.3333333333334, 465, 1251, 763.0, 1251.0, 1251.0, 1251.0, 0.024521423550375177, 0.028983492484183682, 0.015725001430416375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba10dc2d-43b6-45e8-bd5e-4f963d67fa66", 3, 0, 0.0, 348.3333333333333, 220, 503, 322.0, 503.0, 503.0, 503.0, 0.034892241128647694, 0.029088225758615475, 0.02237555827585806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1092.25, 262, 1652, 1480.5, 1650.6, 1652.0, 1652.0, 0.07583980736688929, 56.75081120450204, 0.15843780069298624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 378.1875, 259, 533, 271.0, 533.0, 533.0, 533.0, 0.0886171296911693, 0.13733924298816963, 0.19930200163941691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 771.6363636363637, 130, 1906, 134.0, 1894.2, 1906.0, 1906.0, 0.07979340761374187, 43.402853339716806, 0.11062267873723305], "isController": false}, {"data": ["register", 24, 6, 25.0, 1276.6249999999998, 171, 2688, 1355.5, 2023.5, 2547.75, 2688.0, 0.09748568179048703, 0.03074987814289776, 0.04398279783906739], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 137.875, 130, 169, 135.0, 151.50000000000003, 169.0, 169.0, 0.0779358685221898, 0.06050685104994228, 0.027703765763747158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 480.0, 260, 1335, 394.5, 1057.5, 1335.0, 1335.0, 0.08399983200033599, 7.298956105212789, 0.18738243773512453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a67a5816-af88-4f48-92e9-312c0bd0970f", 3, 0, 0.0, 393.3333333333333, 225, 515, 440.0, 515.0, 515.0, 515.0, 0.037401820221917466, 0.024045766581473633, 0.023984891223039522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5f769cb-f668-41b2-96dc-3a8d50a6e8de", 3, 0, 0.0, 541.3333333333334, 289, 889, 446.0, 889.0, 889.0, 889.0, 0.04267971717574085, 0.03533024764905891, 0.027369480089911937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d697153-1f98-4b02-b6b9-946cf394f9ac", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 465.50000000000006, 263, 1516, 519.5, 629.5000000000014, 1516.0, 1516.0, 0.09102448052834654, 6.183062042981254, 0.2034223308335314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 130.66666666666666, 128, 133, 130.5, 133.0, 133.0, 133.0, 0.03477051460361614, 0.025840196888038944, 0.017453168463143254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 128.33333333333334, 126, 133, 127.0, 133.0, 133.0, 133.0, 0.03477011161205827, 0.00930372127119528, 0.019829829278751984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 129.33333333333334, 128, 131, 129.0, 131.0, 131.0, 131.0, 0.034770313106669525, 0.00937168595453202, 0.02044114110372564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 130.0, 127, 134, 129.5, 134.0, 134.0, 134.0, 0.03477091760451559, 0.009371848885592091, 0.02047545245656533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 138.0, 134, 145, 135.0, 145.0, 145.0, 145.0, 0.052609427609427606, 0.015515671033249159, 0.03252125749684343], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1432.4363636363632, 1009, 2250, 1312.0, 1953.2, 2133.3999999999996, 2250.0, 0.23732163121944486, 283.91917728680966, 0.4686175178962085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1276.6249999999998, 171, 2688, 1355.5, 2023.5, 2547.75, 2688.0, 0.09672972907615048, 0.03051142821444981, 0.04364173323552883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 15, 0, 0.0, 165.33333333333331, 127, 393, 132.0, 385.8, 393.0, 393.0, 0.08037723716643447, 0.02166417720501554, 0.04733151758921873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 15, 0, 0.0, 198.46666666666667, 127, 390, 134.0, 386.4, 390.0, 390.0, 0.08037637577563203, 0.021663945033275817, 0.047252517789971166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/992a8089-e3e6-413d-aab9-96331915e048", 3, 0, 0.0, 426.6666666666667, 243, 575, 462.0, 575.0, 575.0, 575.0, 0.02850166734753983, 0.028585168326097074, 0.018277436417530425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/120f5c73-d9ab-4454-983d-759d3046fb7d", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 414.1875, 126, 1562, 133.0, 1383.5000000000002, 1562.0, 1562.0, 0.07686210458050105, 12.984455502546057, 0.0439480099920736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 346.18750000000006, 128, 1143, 133.0, 1052.0, 1143.0, 1143.0, 0.076966000269381, 4.260085026384907, 0.04408257730272652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dfbef54-0be1-4fb5-9df5-0249571e61c2", 2, 0, 0.0, 324.0, 290, 358, 324.0, 358.0, 358.0, 358.0, 0.05710859198766455, 0.03360149089117958, 0.035497674609520004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 197.25000000000003, 129, 401, 134.0, 396.1, 401.0, 401.0, 0.07729207224876454, 0.05744069041143536, 0.038796997202993136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da9a86f1-1bcd-4ddc-86f2-3ddac24f4523", 3, 0, 0.0, 385.6666666666667, 225, 587, 345.0, 587.0, 587.0, 587.0, 0.07200288011520461, 0.032579428177127084, 0.046173721948877956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 15, 0, 0.0, 148.26666666666665, 127, 390, 131.0, 241.2000000000001, 390.0, 390.0, 0.08037508372404555, 0.021506614199598123, 0.045838914936369726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 195.625, 127, 410, 130.5, 397.40000000000003, 410.0, 410.0, 0.07719772266718132, 0.04239655203608994, 0.04281118824182187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 15, 0, 0.0, 184.13333333333333, 128, 397, 130.0, 397.0, 397.0, 397.0, 0.08037594508715432, 0.05973251387824652, 0.04034495681132551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 15, 0, 0.0, 151.93333333333334, 130, 384, 135.0, 242.4000000000001, 384.0, 384.0, 0.08041213901650594, 0.0632931484836951, 0.028584002541023595], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 481.125, 130, 889, 504.5, 837.2, 889.0, 889.0, 0.09863088009567196, 0.019426382450484215, 0.06711643568033732], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1641.6363636363635, 1054, 2559, 1491.0, 2470.8999999999996, 2555.1, 2559.0, 0.09833193284822912, 0.05089445743121234, 0.045228848019058514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 15, 0, 0.0, 385.9333333333333, 259, 790, 268.0, 788.2, 790.0, 790.0, 0.08031913469518888, 0.12447897144654761, 0.18063961640919923], "isController": false}, {"data": ["addBook", 57, 14, 24.56140350877193, 1312.2280701754387, 650, 3873, 1048.0, 2281.0, 2621.699999999997, 3873.0, 0.272891791223417, 86.97438875380612, 0.9907101589953752], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/76944aa6-d282-4c12-81d8-8a4a7b8227d7", 3, 0, 0.0, 409.6666666666667, 344, 535, 350.0, 535.0, 535.0, 535.0, 0.04221724996833706, 0.02714162392170107, 0.027072910949747397], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 224.96363636363643, 128, 541, 134.0, 529.4, 532.4, 541.0, 0.238488589405036, 0.17723614896214102, 0.11528501147997346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ea5e397-3e1a-405c-afdc-669b19db1495", 3, 0, 0.0, 347.3333333333333, 229, 491, 322.0, 491.0, 491.0, 491.0, 0.06362807270567775, 0.02816867802074275, 0.0408031586035759], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 847.9272727272727, 631, 1194, 780.0, 1093.6, 1149.8, 1194.0, 0.23838728832292375, 70.09377796987218, 0.11989204442022043], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 194.76363636363638, 128, 403, 135.0, 394.0, 397.0, 403.0, 0.23893201732474337, 0.4227976712816748, 0.11619935998800995], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1198.0181818181816, 876, 1691, 1172.0, 1547.0, 1605.7999999999997, 1691.0, 0.23789544711367944, 214.05874148847937, 0.11941236310198362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 183.05555555555554, 130, 403, 140.0, 389.5, 403.0, 403.0, 0.09190613320262239, 0.06866034365234973, 0.032669758286869674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 14, 8.284023668639053, 207.5562130177515, 129, 2013, 138.0, 370.0, 455.0, 1411.0000000000098, 0.707743721391868, 1.5379365619254817, 0.3387932092722803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 194.83333333333334, 132, 479, 139.5, 479.0, 479.0, 479.0, 0.03557052152312973, 0.02754631207797058, 0.012644208822675022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5714fd95-8d45-4821-9c4e-825280144895", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 141.43750000000003, 129, 172, 137.0, 169.2, 172.0, 172.0, 0.08451924397536265, 0.06858934740578745, 0.030043950006867187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 263.0, 257, 268, 263.5, 268.0, 268.0, 268.0, 0.03474393718296157, 0.05384631670835939, 0.0781399290355083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba10dc2d-43b6-45e8-bd5e-4f963d67fa66", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61981857-c514-45ab-90b3-232954d8b0e9", 3, 0, 0.0, 422.0, 231, 529, 506.0, 529.0, 529.0, 529.0, 0.09066731141199226, 0.041024597286025144, 0.05814277457084139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b316589d-fc3a-464a-b839-3b433c0aac62", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 653.9375, 263, 1695, 391.5, 1692.2, 1695.0, 1695.0, 0.07681192121017182, 17.326803182353903, 0.16906686417732034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afb41440-dab4-4a35-9952-9ccd7502086b", 3, 0, 0.0, 353.0, 243, 471, 345.0, 471.0, 471.0, 471.0, 0.017732906955437205, 0.02444624380087128, 0.011371688379626073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 141.18181818181816, 128, 165, 138.0, 163.20000000000002, 165.0, 165.0, 0.05914042086474048, 0.04903341534586394, 0.02102257147926322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a67a5816-af88-4f48-92e9-312c0bd0970f", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.16145135165326185, 0.6161332663092046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 152.625, 131, 398, 135.0, 230.00000000000017, 398.0, 398.0, 0.07711103507106264, 0.059866477423334764, 0.027410563247916797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=992a8089-e3e6-413d-aab9-96331915e048", 1, 0, 0.0, 947.0, 947, 947, 947.0, 947.0, 947.0, 947.0, 1.0559662090813093, 0.19077514519535377, 0.7280392027455121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0529e205-dc05-4424-9345-82896dceaf03", 3, 0, 0.0, 326.6666666666667, 218, 523, 239.0, 523.0, 523.0, 523.0, 0.017876189511443742, 0.024643770371407633, 0.011463572049981826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 131.83333333333334, 127, 141, 132.0, 135.60000000000002, 141.0, 141.0, 0.09108850766661607, 0.06769370540458479, 0.045722161074844385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 202.11111111111111, 127, 396, 131.5, 390.6, 396.0, 396.0, 0.09108666390033095, 0.03197323759956278, 0.051522870975740584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 257.72222222222223, 126, 1386, 130.5, 495.0000000000014, 1386.0, 1386.0, 0.09109035150754531, 4.5767020690793805, 0.053116270507980526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 267.72222222222223, 127, 1029, 136.5, 462.0000000000009, 1029.0, 1029.0, 0.09108666390033095, 1.5111036382796765, 0.053203072024249294], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 18.75, 0.46475600309837334], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.23237800154918667], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.23237800154918667], "isController": false}, {"data": ["401/Unauthorized", 20, 62.5, 1.549186676994578], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1291, 32, "401/Unauthorized", 20, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
