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

    var data = {"OkPercent": 97.96806966618287, "KoPercent": 2.0319303338171264};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8242990654205608, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4827586206896552, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acfee808-af6f-41fb-85ce-c086d1806dc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15044302-f94b-4881-841b-42b7abf09d67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5df8d31-6c45-4015-b68c-67be9e0b08f1"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13924064-0368-426b-a453-9cb4412ba179"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0b896ff-79f9-44ca-9fd5-e5cb690b15d0"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fba9dbc8-c0d0-4a20-985b-d353b08bf3e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b5fb240-4ff7-44bc-b96e-5b77fc4c11fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee0bcb85-ae8f-4640-acab-de13037c3326"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42cf060d-334c-4ed6-a9dd-771fbf0ff042"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d1a21a9-2eef-4273-95e3-8c055b4c3be5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c5b8954-53c5-4037-b317-69afafe6bade"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bec2591-9b48-4745-ad42-4f6f6f1e50f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66fb8e9d-1556-4e87-af6b-899e17806696"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15044302-f94b-4881-841b-42b7abf09d67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d1a21a9-2eef-4273-95e3-8c055b4c3be5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5df8d31-6c45-4015-b68c-67be9e0b08f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0b896ff-79f9-44ca-9fd5-e5cb690b15d0"], "isController": false}, {"data": [0.3968253968253968, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b5fb240-4ff7-44bc-b96e-5b77fc4c11fe"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a003e47-a798-48ac-9a5d-6cdbe8503532"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9239130434782609, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13924064-0368-426b-a453-9cb4412ba179"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fba9dbc8-c0d0-4a20-985b-d353b08bf3e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac73645e-b7c5-4bd4-bd73-b8995ac7fa22"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee0bcb85-ae8f-4640-acab-de13037c3326"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a003e47-a798-48ac-9a5d-6cdbe8503532"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42cf060d-334c-4ed6-a9dd-771fbf0ff042"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c5b8954-53c5-4037-b317-69afafe6bade"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acfee808-af6f-41fb-85ce-c086d1806dc7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66fb8e9d-1556-4e87-af6b-899e17806696"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1378, 28, 2.0319303338171264, 266.3149492017416, 77, 4516, 90.0, 661.2000000000003, 817.1999999999998, 1299.42, 5.349378881987578, 746.5355649201765, 3.916262040227096], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1225.2241379310344, 952, 4866, 1157.0, 1372.8, 1419.9999999999998, 4866.0, 0.25906041467532587, 311.7355030852755, 1.2737980350490874], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/acfee808-af6f-41fb-85ce-c086d1806dc7", 3, 0, 0.0, 328.0, 156, 493, 335.0, 493.0, 493.0, 493.0, 0.02741628893113028, 0.032405125360981134, 0.017581409242944875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15044302-f94b-4881-841b-42b7abf09d67", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 1.136251965408805, 4.336183176100628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5df8d31-6c45-4015-b68c-67be9e0b08f1", 3, 0, 0.0, 239.0, 160, 360, 197.0, 360.0, 360.0, 360.0, 0.021481200369476646, 0.025390051608583885, 0.01377537914318652], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 519.1333333333333, 84, 1042, 489.0, 1028.2, 1042.0, 1042.0, 0.0834441285929651, 0.016346574409910938, 0.056183540228414396], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 519.1333333333333, 84, 1042, 489.0, 1028.2, 1042.0, 1042.0, 0.08213327492744894, 0.016089780225045175, 0.05530093289711439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 144.66666666666669, 79, 246, 82.0, 243.6, 246.0, 246.0, 0.10269822469002253, 0.03776299303706036, 0.05799507818758173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 103.6, 80, 243, 83.0, 239.4, 243.0, 243.0, 0.10269681845256434, 0.07632058480703267, 0.05154898894982233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 144.93333333333334, 78, 565, 81.0, 375.4000000000001, 565.0, 565.0, 0.10269822469002253, 2.0389475528724694, 0.0598872394888367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 166.06666666666666, 79, 557, 82.0, 371.0000000000001, 557.0, 557.0, 0.10269822469002253, 6.186371228835608, 0.05978694825378785], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 172.46666666666667, 82, 239, 182.0, 218.60000000000002, 239.0, 239.0, 0.08335695113615525, 0.16335466055660214, 0.05387811268748367], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 11, 0, 0.0, 81.36363636363636, 80, 84, 80.0, 84.0, 84.0, 84.0, 0.0672478511254845, 0.049976186236810244, 0.03375526902197171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 11, 0, 0.0, 80.2727272727273, 78, 84, 80.0, 83.6, 84.0, 84.0, 0.06724620670261282, 0.01799361390284757, 0.038351352260083876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 459.00000000000006, 387, 559, 392.0, 559.0, 559.0, 559.0, 0.04406728444802579, 12.957244799273518, 0.025132123161764705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 666.5714285714286, 553, 732, 701.0, 732.0, 732.0, 732.0, 0.0440273724464124, 39.61590711914751, 0.025066365367439874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 150.71428571428572, 79, 245, 84.0, 245.0, 245.0, 245.0, 0.04420056955591056, 0.07821428909698236, 0.024474338806837196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 93.78571428571429, 79, 241, 82.0, 165.0, 241.0, 241.0, 0.06611663919677728, 0.049135510184323744, 0.03318745365931985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 103.42857142857144, 78, 235, 80.5, 234.0, 235.0, 235.0, 0.06611851271128406, 0.024785218143864435, 0.03731157699736942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 151.14285714285714, 77, 567, 82.5, 406.5, 567.0, 567.0, 0.06608730132505039, 4.264073829251656, 0.038446435062145665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 137.92857142857142, 78, 564, 81.0, 400.0, 564.0, 564.0, 0.06608823723788934, 1.4045502193893447, 0.038511518825706435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 81.42857142857142, 80, 84, 80.0, 84.0, 84.0, 84.0, 0.0442008486562942, 0.03284848225335926, 0.024819812477899578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 352.9545454545454, 78, 785, 82.5, 719.0, 775.9999999999999, 785.0, 0.09557363731542341, 39.10374497966888, 0.052453500167253864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 11, 0, 0.0, 81.54545454545455, 78, 88, 81.0, 87.4, 88.0, 88.0, 0.06724744001222681, 0.01812528656579551, 0.039534139538438026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13924064-0368-426b-a453-9cb4412ba179", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 301.72727272727275, 77, 657, 163.5, 638.1999999999999, 655.35, 657.0, 0.09557239174254535, 12.787440077196427, 0.052546148975637724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 11, 0, 0.0, 95.18181818181819, 79, 233, 82.0, 203.2000000000001, 233.0, 233.0, 0.0672470289039957, 0.01812517575928009, 0.03959956877842716], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 563.3333333333334, 85, 1896, 414.0, 1431.0000000000002, 1896.0, 1896.0, 0.08225848907607265, 0.01611430948111345, 0.05593148827542336], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 257.14285714285717, 159, 657, 169.0, 567.5, 657.0, 657.0, 0.06606017137895889, 5.740133994505209, 0.14736357984787288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 475.86363636363643, 145, 1637, 404.0, 1146.9999999999998, 1579.6999999999991, 1637.0, 0.09663363553306627, 0.05935796557646356, 0.043692747316220394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 82.68181818181817, 79, 93, 82.0, 89.1, 92.55, 93.0, 0.09557239174254535, 0.07102596691023146, 0.04797286069889484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 116.31818181818184, 78, 250, 80.5, 240.8, 248.79999999999998, 250.0, 0.09557280692989735, 0.09082131794900757, 0.05085790169902386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0b896ff-79f9-44ca-9fd5-e5cb690b15d0", 1, 0, 0.0, 1896.0, 1896, 1896, 1896.0, 1896.0, 1896.0, 1896.0, 0.5274261603375527, 0.09528695279535865, 0.3636356144514768], "isController": false}, {"data": ["login", 22, 0, 0.0, 2018.1363636363635, 1274, 3401, 1917.5, 2866.9, 3324.799999999999, 3401.0, 0.09542853920594781, 36.45423994828424, 0.19433059590785073], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 11, 0, 0.0, 86.81818181818183, 83, 110, 84.0, 105.40000000000002, 110.0, 110.0, 0.06606170162932179, 0.0534815924323318, 0.02348287050104798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fba9dbc8-c0d0-4a20-985b-d353b08bf3e3", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b5fb240-4ff7-44bc-b96e-5b77fc4c11fe", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee0bcb85-ae8f-4640-acab-de13037c3326", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.5206457132564842, 1.9868966138328532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42cf060d-334c-4ed6-a9dd-771fbf0ff042", 3, 0, 0.0, 246.66666666666669, 162, 382, 196.0, 382.0, 382.0, 382.0, 0.05100913063438355, 0.03312604674986822, 0.03271093338207539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 445.8181818181818, 162, 867, 250.0, 801.3, 857.9999999999999, 867.0, 0.09553835865099838, 52.03398654971903, 0.2037569238168443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d1a21a9-2eef-4273-95e3-8c055b4c3be5", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c5b8954-53c5-4037-b317-69afafe6bade", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.5161830357142857, 1.9698660714285716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bec2591-9b48-4745-ad42-4f6f6f1e50f1", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66fb8e9d-1556-4e87-af6b-899e17806696", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 324.40000000000003, 163, 809, 322.0, 615.2, 809.0, 809.0, 0.10263849354061748, 8.334553056403273, 0.22908564284199145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 506.09090909090907, 80, 812, 654.0, 808.6, 812.0, 812.0, 0.06915107624220479, 52.652282653452524, 0.11588821610654294], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 843.5416666666666, 247, 1571, 887.5, 1265.5, 1495.5, 1571.0, 0.10033906241507762, 0.031502938053171343, 0.045270162925552596], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 0, 0.0, 178.0909090909091, 161, 313, 164.0, 284.2000000000001, 313.0, 313.0, 0.06721292443434214, 0.10416690534892674, 0.1511634423557519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 114.16666666666667, 81, 283, 84.0, 252.40000000000003, 283.0, 283.0, 0.1151307373484112, 0.08938372674998721, 0.04092537929181805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 270.22222222222223, 161, 806, 241.0, 377.6000000000007, 806.0, 806.0, 0.11641669415394168, 7.907890697255153, 0.26016907907927334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15044302-f94b-4881-841b-42b7abf09d67", 3, 0, 0.0, 281.3333333333333, 169, 386, 289.0, 386.0, 386.0, 386.0, 0.09094216078574027, 0.041148959470110345, 0.05831902888929308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d1a21a9-2eef-4273-95e3-8c055b4c3be5", 3, 0, 0.0, 284.0, 177, 494, 181.0, 494.0, 494.0, 494.0, 0.021937842778793418, 0.02592978747714808, 0.014068212979890311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 93.21428571428572, 80, 237, 82.0, 161.5, 237.0, 237.0, 0.06168949912533103, 0.0458454187835712, 0.030965236865644674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 91.85714285714286, 78, 236, 80.5, 159.5, 236.0, 236.0, 0.0616900427864511, 0.016506905979968362, 0.03518260252664789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 104.0, 78, 244, 81.0, 244.0, 244.0, 244.0, 0.0616900427864511, 0.016627394344785648, 0.03626699781000348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 115.64285714285715, 78, 244, 82.0, 243.0, 244.0, 244.0, 0.06169113013743902, 0.01662768741985661, 0.03632788229773021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 89.5, 85, 94, 89.5, 94.0, 94.0, 94.0, 0.027745023236456962, 0.008182614274814455, 0.017150976278005135], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 835.7758620689654, 621, 4516, 661.0, 1037.2, 1069.3499999999997, 4516.0, 0.2477118683881218, 296.349513171438, 0.4891341776179514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 843.5416666666666, 247, 1571, 887.5, 1265.5, 1495.5, 1571.0, 0.09538154605537694, 0.029946452203909846, 0.043033470974203264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 98.33333333333333, 77, 235, 81.0, 235.0, 235.0, 235.0, 0.05430159103661737, 0.014635975709088275, 0.03197642519050808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 82.44444444444444, 79, 87, 81.0, 87.0, 87.0, 87.0, 0.054301263409395326, 0.014635887403313584, 0.03192320368403905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 169.33333333333337, 78, 784, 81.5, 584.2000000000003, 784.0, 784.0, 0.1127332168423426, 11.297847519712654, 0.06519835566077321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 146.16666666666669, 78, 543, 82.0, 405.30000000000024, 543.0, 543.0, 0.11273392288999674, 3.7100665521582283, 0.06530885571936769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 116.55555555555556, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.05430060816681147, 0.0145296549196351, 0.030968315595134667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 82.0, 79, 87, 82.0, 84.30000000000001, 87.0, 87.0, 0.11272898074213246, 0.08377612728980742, 0.0565846641615782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 84.0, 79, 90, 83.0, 90.0, 90.0, 90.0, 0.05430060816681147, 0.04035426056146829, 0.02725635995873154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 90.27777777777779, 78, 241, 81.0, 102.40000000000022, 241.0, 241.0, 0.1127332168423426, 0.048978276935410126, 0.06324118175726033], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 456.06666666666666, 80, 1299, 382.0, 1000.8000000000002, 1299.0, 1299.0, 0.08, 0.015380208333333333, 0.05444270833333333], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 142.88888888888889, 81, 461, 85.0, 461.0, 461.0, 461.0, 0.05579077220627708, 0.04391343984205012, 0.019831876057700055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1095.1363636363637, 584, 1883, 1012.0, 1507.5, 1827.3499999999992, 1883.0, 0.09576959576524259, 0.04956824780818221, 0.04405027305217702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 201.88888888888889, 164, 323, 171.0, 323.0, 323.0, 323.0, 0.05427342953801251, 0.08411321550471275, 0.12206221506449492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5df8d31-6c45-4015-b68c-67be9e0b08f1", 1, 0, 0.0, 1121.0, 1121, 1121, 1121.0, 1121.0, 1121.0, 1121.0, 0.8920606601248885, 0.16116330285459413, 0.6150340098126673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0b896ff-79f9-44ca-9fd5-e5cb690b15d0", 3, 0, 0.0, 263.3333333333333, 205, 368, 217.0, 368.0, 368.0, 368.0, 0.08421761832575375, 0.03810627912525967, 0.05400674091853349], "isController": false}, {"data": ["addBook", 63, 13, 20.634920634920636, 775.5238095238097, 415, 2128, 679.0, 1203.0, 1289.6, 2128.0, 0.2833918859954927, 81.8347575790461, 1.0310382995137355], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5b5fb240-4ff7-44bc-b96e-5b77fc4c11fe", 3, 0, 0.0, 384.33333333333337, 160, 802, 191.0, 802.0, 802.0, 802.0, 0.020897476977946194, 0.02470011032126388, 0.013401051317237633], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 215.24137931034474, 79, 3927, 86.0, 329.3, 333.05, 3927.0, 0.2482972374791837, 0.18452558371255742, 0.12002649663300384], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 472.1724137931034, 383, 738, 407.0, 621.8, 653.7999999999998, 738.0, 0.24824303849479115, 72.99169576210613, 0.1248487937742358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a003e47-a798-48ac-9a5d-6cdbe8503532", 3, 0, 0.0, 263.3333333333333, 182, 389, 219.0, 389.0, 389.0, 389.0, 0.04751120472578116, 0.030545126736138607, 0.03046779730136357], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 122.13793103448272, 79, 257, 85.0, 246.1, 247.05, 257.0, 0.24858350262727044, 0.4398762761334122, 0.12089314873865302], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 615.3620689655173, 538, 869, 566.5, 727.2, 743.5999999999998, 869.0, 0.24809225609964755, 223.23384813813178, 0.1245306832375184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 85.88888888888887, 80, 103, 84.0, 95.80000000000001, 103.0, 103.0, 0.11285903279808893, 0.08431363290091604, 0.040117859314945666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 13, 7.065217391304348, 136.00543478260872, 80, 1301, 87.0, 236.0, 299.5, 847.1000000000031, 0.7538264888073154, 1.6095949514109666, 0.3628182061899807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 98.07142857142858, 83, 245, 86.0, 174.0, 245.0, 245.0, 0.06226456212446686, 0.04821855250459201, 0.02213310606768158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13924064-0368-426b-a453-9cb4412ba179", 3, 0, 0.0, 572.6666666666667, 180, 1299, 239.0, 1299.0, 1299.0, 1299.0, 0.031189894474190363, 0.025351942220720486, 0.020001332068409833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fba9dbc8-c0d0-4a20-985b-d353b08bf3e3", 3, 0, 0.0, 238.66666666666669, 162, 376, 178.0, 376.0, 376.0, 376.0, 0.03457774806652759, 0.028826045832805063, 0.02217388140985005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 88.53333333333333, 82, 103, 88.0, 96.4, 103.0, 103.0, 0.09807639497325783, 0.07959129318630592, 0.03486309352565024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac73645e-b7c5-4bd4-bd73-b8995ac7fa22", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee0bcb85-ae8f-4640-acab-de13037c3326", 3, 0, 0.0, 341.0, 165, 630, 228.0, 630.0, 630.0, 630.0, 0.04163428444543133, 0.03470878986482736, 0.026699069126790275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a003e47-a798-48ac-9a5d-6cdbe8503532", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 210.21428571428572, 161, 481, 165.5, 406.0, 481.0, 481.0, 0.06166694563618264, 0.09557172141076352, 0.1386904060548131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42cf060d-334c-4ed6-a9dd-771fbf0ff042", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 265.7777777777778, 160, 864, 166.0, 666.0000000000003, 864.0, 864.0, 0.11267323509896465, 15.132592532894327, 0.25020157945966925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 85.4285714285714, 82, 97, 85.0, 92.5, 97.0, 97.0, 0.06676490645759714, 0.05535488826416012, 0.02373283784234898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c5b8954-53c5-4037-b317-69afafe6bade", 3, 0, 0.0, 298.6666666666667, 182, 479, 235.0, 479.0, 479.0, 479.0, 0.01994813484939158, 0.027500114286189245, 0.012792260954850723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 92.77272727272728, 80, 241, 85.0, 101.89999999999999, 220.89999999999972, 241.0, 0.09751340809361288, 0.07570621038517795, 0.034662969283276446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acfee808-af6f-41fb-85ce-c086d1806dc7", 1, 0, 0.0, 1102.0, 1102, 1102, 1102.0, 1102.0, 1102.0, 1102.0, 0.9074410163339383, 0.16394198049001812, 0.6256380444646098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66fb8e9d-1556-4e87-af6b-899e17806696", 3, 0, 0.0, 687.3333333333334, 202, 1480, 380.0, 1480.0, 1480.0, 1480.0, 0.03096007182736664, 0.031050775162798378, 0.019853952311169362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 81.66666666666667, 79, 86, 81.5, 84.2, 86.0, 86.0, 0.11647997515093864, 0.08656373153307062, 0.058467487526936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 116.16666666666669, 77, 245, 82.0, 243.2, 245.0, 245.0, 0.11647922140111562, 0.04088653225180219, 0.06588608736588712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 143.11111111111111, 77, 726, 82.0, 289.5000000000007, 726.0, 726.0, 0.11647997515093864, 5.852366737606207, 0.06792137439899569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 160.44444444444443, 79, 564, 82.0, 276.90000000000043, 564.0, 564.0, 0.11648223645894001, 1.932409463372808, 0.06803644518863651], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5079825834542816], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.14513788098693758], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.14513788098693758], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.2336719883889695], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1378, 28, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
