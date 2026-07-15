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

    var data = {"OkPercent": 99.53125, "KoPercent": 0.46875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7554054054054054, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91969073-8b58-489c-a62f-fd402fa919a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f1eb810-9957-4ad8-8b81-f97c420b6574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bdedc91-d0ce-4b51-ae27-a41d621690a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=765b8ed3-df70-4995-9ff9-a1b168926e8d"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bf989cc-53ab-4959-92fc-cb3fe433f288"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6018c5ea-7daf-44c8-8d73-6672c2f9c8b0"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/daeecfca-208e-490f-aa73-bae41fb97bf7"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65905b12-5398-4553-b330-0f0745e40fe9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bfe5fda-ec81-4c8a-9961-88b7729c347b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=313a34f7-dcb3-4a0e-adc9-060134f44b8b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f1eb810-9957-4ad8-8b81-f97c420b6574"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/39107a8e-3f8b-49ff-9b74-d6b8477aa724"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26107bc0-2cf8-4b71-a30e-ad36416f4f3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5660c89-8493-4afd-a793-0e187ade06d5"], "isController": false}, {"data": [0.225, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b93e277-1d0b-4d17-85db-a052d9d2ec12"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91969073-8b58-489c-a62f-fd402fa919a6"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6bdedc91-d0ce-4b51-ae27-a41d621690a7"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6018c5ea-7daf-44c8-8d73-6672c2f9c8b0"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/765b8ed3-df70-4995-9ff9-a1b168926e8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/309c6c4b-c441-4749-8ec3-535c1e957b5a"], "isController": false}, {"data": [0.3225806451612903, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daeecfca-208e-490f-aa73-bae41fb97bf7"], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9719101123595506, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/313a34f7-dcb3-4a0e-adc9-060134f44b8b"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bfe5fda-ec81-4c8a-9961-88b7729c347b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d09d65e7-0303-4379-ac03-4483a9dc1966"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/945c3ecd-1edc-47f7-9f4f-e0d45b69380a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5660c89-8493-4afd-a793-0e187ade06d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26107bc0-2cf8-4b71-a30e-ad36416f4f3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b93e277-1d0b-4d17-85db-a052d9d2ec12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 6, 0.46875, 453.27578125000014, 128, 2454, 153.0, 1296.7000000000003, 1547.3000000000006, 1979.5700000000002, 5.084611106697387, 706.6600018558333, 3.712784023198538], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2241.185185185186, 1585, 2998, 2199.0, 2666.5, 2835.25, 2998.0, 0.24106066693451184, 290.0773211156868, 1.1852934160305344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91969073-8b58-489c-a62f-fd402fa919a6", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f1eb810-9957-4ad8-8b81-f97c420b6574", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 648.5454545454546, 508, 1330, 529.0, 1250.4000000000003, 1330.0, 1330.0, 0.06342580046243174, 0.011458762778857297, 0.043109723751809076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 648.5454545454546, 508, 1330, 529.0, 1250.4000000000003, 1330.0, 1330.0, 0.06501297304325726, 0.011745507825197846, 0.04418850511533892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 195.1578947368421, 131, 429, 140.0, 419.0, 429.0, 429.0, 0.11198802317562669, 0.047670888566022834, 0.06287814376904532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bdedc91-d0ce-4b51-ae27-a41d621690a7", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 154.10526315789477, 133, 403, 141.0, 148.0, 403.0, 403.0, 0.11198340288092039, 0.083222040617559, 0.05621041902421199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=765b8ed3-df70-4995-9ff9-a1b168926e8d", 1, 0, 0.0, 1979.0, 1979, 1979, 1979.0, 1979.0, 1979.0, 1979.0, 0.5053057099545225, 0.09129058236483072, 0.3483846008084891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 288.21052631578954, 130, 1059, 139.0, 1041.0, 1059.0, 1059.0, 0.11198802317562669, 3.493132997565734, 0.06493302268936291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 282.84210526315786, 130, 1433, 135.0, 1232.0, 1433.0, 1433.0, 0.11198274286994088, 10.63356032554562, 0.06482060290919378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bf989cc-53ab-4959-92fc-cb3fe433f288", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.9337308114035087, 1.7446774488304093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6018c5ea-7daf-44c8-8d73-6672c2f9c8b0", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.2086190098152425, 0.7961352482678984], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 442.54545454545456, 222, 1944, 252.0, 1681.8000000000009, 1944.0, 1944.0, 0.06387327542156362, 0.15770983096808658, 0.04129307454011241], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 170.83333333333334, 130, 427, 140.5, 424.3, 427.0, 427.0, 0.14624515562921978, 0.10868414397835571, 0.07340821288419822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 150.22222222222223, 130, 401, 135.5, 167.00000000000037, 401.0, 401.0, 0.1462380267615589, 0.05133246707613314, 0.08271905745529584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 867.6666666666666, 798, 975, 830.0, 975.0, 975.0, 975.0, 0.10971328262141603, 32.25934791453335, 0.06257085649502633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1298.3333333333333, 1039, 1440, 1416.0, 1440.0, 1440.0, 1440.0, 0.1073191672032625, 96.56597529646919, 0.06110065867138871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 445.3333333333333, 411, 508, 417.0, 508.0, 508.0, 508.0, 0.11139578923916676, 0.1971183301771193, 0.06168106689317144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 155.85714285714286, 132, 404, 135.0, 274.0, 404.0, 404.0, 0.0685897938386768, 0.05097346983518852, 0.034428861360429566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 212.35714285714286, 130, 424, 137.5, 416.5, 424.0, 424.0, 0.06859281833192064, 0.025712737563877062, 0.038707861349416714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 283.07142857142856, 131, 1663, 136.0, 1041.0, 1663.0, 1663.0, 0.06859281833192064, 4.425734379516714, 0.039904025173564325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 228.64285714285714, 129, 796, 139.0, 661.5, 796.0, 796.0, 0.06859080197345535, 1.4577363534924965, 0.039969835357578545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 222.66666666666666, 136, 392, 140.0, 392.0, 392.0, 392.0, 0.11257458065968703, 0.08366138269728694, 0.06321326550714848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1091.0666666666666, 134, 1820, 1417.0, 1739.6000000000001, 1820.0, 1820.0, 0.07801447948739286, 46.805386298447, 0.041394401550927856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 261.44444444444446, 130, 1298, 139.0, 508.70000000000124, 1298.0, 1298.0, 0.14487271322446418, 7.278918517650325, 0.08447764332338004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 718.8, 132, 1172, 831.0, 1103.0, 1172.0, 1172.0, 0.07801488524010382, 15.299653548897131, 0.04147080325426092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 229.83333333333334, 134, 1032, 139.0, 464.1000000000009, 1032.0, 1032.0, 0.1451835361869964, 2.408556426992846, 0.08480067006234826], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 712.6363636363636, 280, 1979, 498.0, 1845.6000000000004, 1979.0, 1979.0, 0.06503795851760755, 0.011750021802497457, 0.04484062374358489], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 490.5, 269, 1797, 281.5, 1313.0, 1797.0, 1797.0, 0.06854311606797518, 5.955883286679135, 0.15290240317060871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daeecfca-208e-490f-aa73-bae41fb97bf7", 3, 0, 0.0, 604.0, 567, 633, 612.0, 633.0, 633.0, 633.0, 0.01998747451596999, 0.027554347192426082, 0.01281748854051461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 590.0999999999999, 182, 1345, 466.5, 1049.9000000000003, 1330.85, 1345.0, 0.09816288166955428, 0.060297316963036765, 0.04438419356738636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 139.66666666666666, 131, 161, 141.0, 153.20000000000002, 161.0, 161.0, 0.07801813141374055, 0.0579802714900943, 0.03916144486978774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 227.26666666666668, 132, 421, 140.0, 418.6, 421.0, 421.0, 0.07801853720443977, 0.09899617774183146, 0.04012672160905431], "isController": false}, {"data": ["login", 20, 0, 0.0, 2541.35, 1534, 4141, 2400.5, 3790.600000000001, 4125.0, 4141.0, 0.09660669001328342, 17.47184348961478, 0.16978814454775992], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/65905b12-5398-4553-b330-0f0745e40fe9", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 142.6111111111111, 134, 173, 141.5, 149.60000000000002, 173.0, 173.0, 0.13995148348572495, 0.11330056622037693, 0.04974837889531628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bfe5fda-ec81-4c8a-9961-88b7729c347b", 3, 0, 0.0, 380.0, 251, 511, 378.0, 511.0, 511.0, 511.0, 0.034290416971470374, 0.02858650972133321, 0.02198962286256401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=313a34f7-dcb3-4a0e-adc9-060134f44b8b", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.6452287946428571, 2.462332589285714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f1eb810-9957-4ad8-8b81-f97c420b6574", 3, 0, 0.0, 693.0, 252, 938, 889.0, 938.0, 938.0, 938.0, 0.02103462298944062, 0.024862212263886355, 0.013488999768619146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1249.2, 283, 1954, 1580.0, 1872.4, 1954.0, 1954.0, 0.07796055196070789, 62.218890288389076, 0.16203714982718745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39107a8e-3f8b-49ff-9b74-d6b8477aa724", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.605950545540797, 1.1322195208728651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 525.5789473684212, 265, 1575, 309.0, 1376.0, 1575.0, 1575.0, 0.1118917359119471, 14.245831986829167, 0.24863360498978254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1521.3333333333333, 1431, 1581, 1552.0, 1581.0, 1581.0, 1581.0, 0.10679957280170879, 127.76941860982556, 0.24082052109291563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26107bc0-2cf8-4b71-a30e-ad36416f4f3e", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5660c89-8493-4afd-a793-0e187ade06d5", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["register", 20, 3, 15.0, 1396.45, 746, 1947, 1413.5, 1922.8000000000002, 1946.1, 1947.0, 0.0996661185030149, 0.03178804131160612, 0.04496654955897743], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b93e277-1d0b-4d17-85db-a052d9d2ec12", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 449.5, 267, 1447, 282.5, 907.9000000000009, 1447.0, 1447.0, 0.1447178002894356, 9.83031304017929, 0.3234166465669722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 168.14285714285714, 141, 393, 145.5, 291.5, 393.0, 393.0, 0.08231614101930901, 0.06390755088901433, 0.0292608157529575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91969073-8b58-489c-a62f-fd402fa919a6", 3, 0, 0.0, 495.0, 222, 1030, 233.0, 1030.0, 1030.0, 1030.0, 0.04168866901976043, 0.026801797302743114, 0.026733944651343763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 480.90000000000003, 272, 2158, 289.5, 789.6000000000006, 2090.849999999999, 2158.0, 0.1038356904035055, 6.364058030198015, 0.23220053462401097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 194.39999999999998, 131, 421, 142.0, 418.9, 421.0, 421.0, 0.062097530381216744, 0.0461486529493222, 0.03117004942963418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 162.6, 131, 391, 140.0, 365.9000000000001, 391.0, 391.0, 0.06210177238458386, 0.025944470923950167, 0.034895859209071824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 267.9, 132, 1453, 137.0, 1321.8000000000004, 1453.0, 1453.0, 0.06209830161145093, 5.602679784286025, 0.035973352066320984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bdedc91-d0ce-4b51-ae27-a41d621690a7", 3, 0, 0.0, 951.6666666666666, 396, 1944, 515.0, 1944.0, 1944.0, 1944.0, 0.028504646257339946, 0.028588155963171998, 0.018279346721015527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 241.5, 131, 920, 139.5, 868.2000000000002, 920.0, 920.0, 0.06209868723375188, 1.840971374833886, 0.03603421870536657], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1553.9074074074072, 1044, 2454, 1413.5, 2094.0, 2201.0, 2454.0, 0.23944130362487528, 286.4550424010642, 0.4728030428999002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, 15.0, 1396.45, 746, 1947, 1413.5, 1922.8000000000002, 1946.1, 1947.0, 0.09767103418974553, 0.031151718521846568, 0.04406642362857659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 134.83333333333331, 131, 138, 135.0, 138.0, 138.0, 138.0, 0.029818405908020155, 0.00803699221739606, 0.017559080822789213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 135.16666666666666, 130, 140, 135.5, 140.0, 140.0, 140.0, 0.02981885048331387, 0.008037112044330691, 0.01753022264741694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 242.0714285714286, 128, 1378, 134.5, 888.5, 1378.0, 1378.0, 0.08170029995681555, 5.271453121899765, 0.047529331866618424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 243.42857142857144, 131, 1100, 138.0, 757.0, 1100.0, 1100.0, 0.0818277992413394, 1.7390576323418532, 0.04768341482018341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 134.0, 132, 142, 132.5, 142.0, 142.0, 142.0, 0.029818554098311773, 0.007978792795837329, 0.01700589413419343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 156.71428571428572, 131, 390, 140.0, 267.5, 390.0, 390.0, 0.08182732097351132, 0.06081112427816613, 0.04107347947303205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 140.33333333333334, 132, 154, 139.0, 154.0, 154.0, 154.0, 0.02981514609421586, 0.022157545095408467, 0.014965805754323196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 175.64285714285717, 131, 419, 136.5, 415.5, 419.0, 419.0, 0.0816907654424722, 0.030622640449766016, 0.04609921124648438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 140.5, 134, 149, 140.0, 149.0, 149.0, 149.0, 0.02948982601002654, 0.023211718519610732, 0.010482711589501622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6018c5ea-7daf-44c8-8d73-6672c2f9c8b0", 3, 0, 0.0, 471.3333333333333, 245, 639, 530.0, 639.0, 639.0, 639.0, 0.020704648193519446, 0.028543029003761343, 0.01327739483764105], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 602.7272727272727, 452, 1030, 530.0, 1001.8000000000001, 1030.0, 1030.0, 0.06678891061215071, 0.012066355921140512, 0.045460811227215875], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1380.1000000000001, 961, 2147, 1382.5, 1966.8000000000004, 2138.75, 2147.0, 0.09609378753663576, 0.049736042377360304, 0.044199388603276796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/765b8ed3-df70-4995-9ff9-a1b168926e8d", 3, 0, 0.0, 383.3333333333333, 250, 605, 295.0, 605.0, 605.0, 605.0, 0.028257368108734353, 0.02834015336686541, 0.018120773168687068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 278.8333333333333, 265, 293, 278.0, 293.0, 293.0, 293.0, 0.029795454206869836, 0.046177134595998474, 0.06701067484220824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/309c6c4b-c441-4749-8ec3-535c1e957b5a", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["addBook", 62, 3, 4.838709677419355, 1377.693548387097, 694, 3167, 1082.5, 2353.5000000000005, 2518.2499999999995, 3167.0, 0.2954589860038219, 98.04759540465967, 1.0740172414614737], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 263.5925925925926, 132, 568, 143.0, 528.5, 543.0, 568.0, 0.24098106067367595, 0.179088464035808, 0.11648986819674764], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 864.7037037037038, 650, 1265, 791.5, 1138.0, 1188.75, 1265.0, 0.24074470361652045, 70.78693633974427, 0.12107765855713674], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 207.9814814814815, 130, 555, 140.5, 418.5, 424.25, 555.0, 0.24112632786929167, 0.4266805723624575, 0.11726651492080786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daeecfca-208e-490f-aa73-bae41fb97bf7", 1, 0, 0.0, 1312.0, 1312, 1312, 1312.0, 1312.0, 1312.0, 1312.0, 0.7621951219512195, 0.13770126714939024, 0.5254978086890244], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1287.9444444444448, 908, 1945, 1256.5, 1580.5, 1773.75, 1945.0, 0.24002987038387, 215.97929929891274, 0.12048374353252848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 181.34999999999997, 134, 403, 144.0, 396.6, 402.7, 403.0, 0.10041370446238503, 0.07501609757199663, 0.03569393400811343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, 1.6853932584269662, 213.53370786516854, 132, 1187, 145.0, 349.59999999999985, 440.04999999999995, 1107.2100000000007, 0.751203825231164, 1.5580580260114876, 0.36501832641916326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 167.29999999999998, 136, 399, 143.5, 373.80000000000007, 399.0, 399.0, 0.06267941983928996, 0.04853982415288764, 0.022280575020997607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 143.10526315789474, 133, 176, 142.0, 152.0, 176.0, 176.0, 0.11936022917164, 0.09686362347815708, 0.042428831463356416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/313a34f7-dcb3-4a0e-adc9-060134f44b8b", 3, 0, 0.0, 327.3333333333333, 245, 452, 285.0, 452.0, 452.0, 452.0, 0.06682556300536832, 0.030236827010892565, 0.042853632526229035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 491.79999999999995, 265, 1874, 283.0, 1766.8000000000004, 1874.0, 1874.0, 0.0620432068892777, 7.509063882400204, 0.13794919281787837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 443.1428571428572, 266, 1523, 282.5, 1164.0, 1523.0, 1523.0, 0.08162694155510984, 7.092769702338612, 0.18208911767106675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bfe5fda-ec81-4c8a-9961-88b7729c347b", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d09d65e7-0303-4379-ac03-4483a9dc1966", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.8895151462395543, 1.6620604108635098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/945c3ecd-1edc-47f7-9f4f-e0d45b69380a", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 163.0, 133, 422, 143.0, 289.0, 422.0, 422.0, 0.06773363265148144, 0.05615806066514427, 0.02407718973158129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5660c89-8493-4afd-a793-0e187ade06d5", 3, 0, 0.0, 327.0, 247, 484, 250.0, 484.0, 484.0, 484.0, 0.024428177087998437, 0.029016412172560645, 0.015665204708124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 157.4, 133, 392, 143.0, 246.2000000000001, 392.0, 392.0, 0.07794515778698109, 0.06051406293032222, 0.02770706780709093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26107bc0-2cf8-4b71-a30e-ad36416f4f3e", 3, 0, 0.0, 368.6666666666667, 257, 536, 313.0, 536.0, 536.0, 536.0, 0.048649174585671195, 0.03127673170791036, 0.031197550108649826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b93e277-1d0b-4d17-85db-a052d9d2ec12", 3, 0, 0.0, 422.0, 234, 566, 466.0, 566.0, 566.0, 566.0, 0.021109813248518794, 0.024951084604613198, 0.013537217480332691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 162.99999999999997, 130, 397, 138.5, 364.40000000000055, 396.6, 397.0, 0.10391229802047072, 0.07722388554060373, 0.052159102717306595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 232.54999999999998, 131, 417, 143.0, 416.0, 416.95, 417.0, 0.10390905879174546, 0.03560711790041356, 0.05882429822419419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 259.85, 128, 1768, 139.5, 417.9, 1700.499999999999, 1768.0, 0.10391337780825903, 4.701679508087059, 0.060643197830288674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 237.39999999999998, 131, 769, 140.5, 420.8, 751.5999999999997, 769.0, 0.1039106783808638, 1.5542662964415788, 0.06074309773318855], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 50.0, 0.234375], "isController": false}, {"data": ["401/Unauthorized", 3, 50.0, 0.234375], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 6, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
