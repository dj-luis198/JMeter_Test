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

    var data = {"OkPercent": 98.46508058326938, "KoPercent": 1.5349194167306217};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8230059327620303, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81843d5e-a960-4f9a-92c8-445163be1857"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b10acd9c-d017-4d43-9ed5-30012e585f9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bc1d0af-d3b3-440f-abec-ec86033c9ea5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15183a21-cde3-46e8-ad3f-f9669b11d873"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ca509e8-a30a-40f9-a02a-2ef635833264"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07dbe933-3786-4dfa-8adf-73a5b198f7c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e382c932-ebe4-4334-8ac1-8f78d7a6d4b1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b80742a2-24ee-4afe-b24f-7d3e37cce5c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb326405-b292-43d1-8922-f963d89aeb4b"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87e961c6-f845-47a4-8c09-f6a0e4fdacbf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bc1d0af-d3b3-440f-abec-ec86033c9ea5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e7158c6-c395-4aeb-81ba-7ee3bc10e67e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57aedae0-27ce-45bd-a8c8-2b591856051e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b10acd9c-d017-4d43-9ed5-30012e585f9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4af1ef7-8bc5-432a-a238-6827b9de8e2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=162998cd-03f4-46fc-9ddd-d2fefee91b6d"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4a08278-31f2-4c2c-8009-ba12425e5c4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81843d5e-a960-4f9a-92c8-445163be1857"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93dd6aff-6ab4-44ec-9f7b-993263d0c28e"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ca509e8-a30a-40f9-a02a-2ef635833264"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15183a21-cde3-46e8-ad3f-f9669b11d873"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8392857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9396551724137931, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40fdb311-b52d-4f11-b85e-99456418459e"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4a08278-31f2-4c2c-8009-ba12425e5c4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e382c932-ebe4-4334-8ac1-8f78d7a6d4b1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57aedae0-27ce-45bd-a8c8-2b591856051e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e7158c6-c395-4aeb-81ba-7ee3bc10e67e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87e961c6-f845-47a4-8c09-f6a0e4fdacbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6f7c2b7-69df-4faa-aaf4-c624d5994278"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b80742a2-24ee-4afe-b24f-7d3e37cce5c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/162998cd-03f4-46fc-9ddd-d2fefee91b6d"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 20, 1.5349194167306217, 284.63545663852625, 81, 1945, 102.0, 703.4000000000005, 851.0, 1482.2400000000043, 5.232973758825373, 752.9261930253958, 3.811295202421305], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81843d5e-a960-4f9a-92c8-445163be1857", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1258.1964285714284, 1023, 1730, 1224.5, 1465.7, 1563.2499999999998, 1730.0, 0.24726572676254102, 297.54398953177366, 1.2158036467279238], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 506.99999999999994, 97, 1115, 435.0, 994.1999999999999, 1115.0, 1115.0, 0.08443532254293211, 0.015996535716141437, 0.0570788362052168], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 506.99999999999994, 97, 1115, 435.0, 994.1999999999999, 1115.0, 1115.0, 0.08491681418241438, 0.016087755811902724, 0.057404327736444334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b10acd9c-d017-4d43-9ed5-30012e585f9f", 3, 0, 0.0, 711.3333333333333, 169, 1683, 282.0, 1683.0, 1683.0, 1683.0, 0.029303170603059252, 0.024428847628396727, 0.018791421252612867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 158.68421052631578, 84, 266, 90.0, 257.0, 266.0, 266.0, 0.09144903400941444, 0.05338600577091536, 0.050537624057834296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 110.00000000000001, 84, 262, 88.0, 257.0, 262.0, 262.0, 0.09151907209294484, 0.06801368541282327, 0.045938284234153956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 200.42105263157893, 82, 582, 88.0, 581.0, 582.0, 582.0, 0.09152259885644921, 5.684881821444227, 0.052238818888819316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 244.3684210526316, 81, 755, 90.0, 727.0, 755.0, 755.0, 0.09152171714009084, 17.356611962370124, 0.05214893895019773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bc1d0af-d3b3-440f-abec-ec86033c9ea5", 3, 0, 0.0, 499.3333333333333, 191, 851, 456.0, 851.0, 851.0, 851.0, 0.03139618850271577, 0.026173710532374703, 0.02013362348644208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15183a21-cde3-46e8-ad3f-f9669b11d873", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ca509e8-a30a-40f9-a02a-2ef635833264", 1, 0, 0.0, 1283.0, 1283, 1283, 1283.0, 1283.0, 1283.0, 1283.0, 0.779423226812159, 0.14081376656274358, 0.5373757794232269], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 167.60000000000002, 86, 279, 173.0, 234.60000000000002, 279.0, 279.0, 0.08582119440216956, 0.1372356886006568, 0.05546529927280841], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 97.6, 84, 250, 87.0, 156.40000000000006, 250.0, 250.0, 0.08810469186852429, 0.06547624073432323, 0.04422442541056786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 120.53333333333335, 84, 268, 86.0, 259.6, 268.0, 268.0, 0.08810469186852429, 0.032396829405821954, 0.04975391258252473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 418.75, 410, 422, 421.5, 422.0, 422.0, 422.0, 0.04474873584821229, 13.157614137244373, 0.02552076341343357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 744.25, 732, 760, 742.5, 760.0, 760.0, 760.0, 0.04458016628402024, 40.113311985934956, 0.025381090765218554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 255.25, 247, 263, 255.5, 263.0, 263.0, 263.0, 0.044836514857700106, 0.07933961418178966, 0.02482646867608981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 87.6153846153846, 84, 99, 86.0, 95.8, 99.0, 99.0, 0.1570959010054138, 0.11674802799328114, 0.07885477843435809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07dbe933-3786-4dfa-8adf-73a5b198f7c3", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.995849609375, 3.729248046875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 126.53846153846153, 85, 264, 88.0, 260.8, 264.0, 264.0, 0.15710349494851839, 0.06018838823899067, 0.08858314551409097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 163.76923076923077, 82, 760, 86.0, 560.3999999999999, 760.0, 760.0, 0.15710729219539313, 10.91335089082856, 0.09132333436057333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 176.61538461538464, 83, 589, 88.0, 458.5999999999999, 589.0, 589.0, 0.15710159639391413, 3.592400852276161, 0.0914734430325442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 89.75, 85, 101, 86.5, 101.0, 101.0, 101.0, 0.044916567475913494, 0.03338037875895524, 0.02522170536977564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 523.3749999999999, 84, 782, 739.0, 772.9, 782.0, 782.0, 0.07875721120715115, 44.29913350147177, 0.0420705024710075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 154.26666666666668, 83, 771, 86.0, 467.4000000000002, 771.0, 771.0, 0.08801164100638378, 5.301675714141124, 0.05123698527858619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 379.9375, 85, 604, 425.5, 597.0, 604.0, 604.0, 0.07875721120715115, 14.481232248862943, 0.042147413810076986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 136.33333333333334, 82, 410, 86.0, 377.0, 410.0, 410.0, 0.08810313940853426, 1.7491799983847758, 0.051376290343895924], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 673.2307692307692, 93, 1335, 488.0, 1314.2, 1335.0, 1335.0, 0.0849001769842151, 0.016084603842712625, 0.058069118948413344], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 292.6923076923077, 172, 851, 178.0, 653.7999999999998, 851.0, 851.0, 0.156932808614404, 14.666521554117676, 0.3498568931227215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e382c932-ebe4-4334-8ac1-8f78d7a6d4b1", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b80742a2-24ee-4afe-b24f-7d3e37cce5c2", 3, 0, 0.0, 423.6666666666667, 200, 584, 487.0, 584.0, 584.0, 584.0, 0.04770233741453331, 0.03066800663857529, 0.030590366115439655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb326405-b292-43d1-8922-f963d89aeb4b", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.8144087357954546, 3.3902254971590913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 487.09090909090907, 113, 1517, 388.5, 1133.3999999999999, 1466.7499999999993, 1517.0, 0.1078695758764403, 0.06625972971316499, 0.04877306018632018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 97.31249999999999, 84, 251, 86.5, 140.40000000000012, 251.0, 251.0, 0.07875721120715115, 0.05852952903187698, 0.03953242828171454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 139.43750000000006, 84, 266, 86.5, 263.9, 266.0, 266.0, 0.07875798655207379, 0.09500566688325113, 0.040782639032458136], "isController": false}, {"data": ["login", 22, 0, 0.0, 2173.6818181818185, 1107, 4301, 1965.5, 3043.2, 4116.649999999998, 4301.0, 0.11085301394228589, 24.266929333722995, 0.20067505391487495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 103.79999999999998, 87, 259, 92.0, 166.00000000000006, 259.0, 259.0, 0.08807623879229862, 0.07130390816290581, 0.0313083505081999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87e961c6-f845-47a4-8c09-f6a0e4fdacbf", 3, 0, 0.0, 305.0, 200, 510, 205.0, 510.0, 510.0, 510.0, 0.04520114509567576, 0.029059980977851438, 0.02898641140575561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bc1d0af-d3b3-440f-abec-ec86033c9ea5", 1, 0, 0.0, 1175.0, 1175, 1175, 1175.0, 1175.0, 1175.0, 1175.0, 0.851063829787234, 0.15375664893617022, 0.5867686170212766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e7158c6-c395-4aeb-81ba-7ee3bc10e67e", 1, 0, 0.0, 1335.0, 1335, 1335, 1335.0, 1335.0, 1335.0, 1335.0, 0.7490636704119851, 0.13532888576779026, 0.5164442883895132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57aedae0-27ce-45bd-a8c8-2b591856051e", 3, 0, 0.0, 249.66666666666669, 162, 410, 177.0, 410.0, 410.0, 410.0, 0.06897978892184589, 0.03121155813846543, 0.044235085994803525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b10acd9c-d017-4d43-9ed5-30012e585f9f", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4af1ef7-8bc5-432a-a238-6827b9de8e2c", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=162998cd-03f4-46fc-9ddd-d2fefee91b6d", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 643.0, 173, 872, 828.5, 866.4, 872.0, 872.0, 0.07872349847227211, 58.90867282329527, 0.1644621524480548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4a08278-31f2-4c2c-8009-ba12425e5c4e", 3, 0, 0.0, 247.33333333333331, 170, 388, 184.0, 388.0, 388.0, 388.0, 0.024102193299590263, 0.02432972051498353, 0.0154561591146461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81843d5e-a960-4f9a-92c8-445163be1857", 3, 0, 0.0, 308.6666666666667, 173, 475, 278.0, 475.0, 475.0, 475.0, 0.05263896687254351, 0.03384178371525828, 0.033756108313447504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93dd6aff-6ab4-44ec-9f7b-993263d0c28e", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 391.5263157894737, 174, 840, 341.0, 816.0, 840.0, 840.0, 0.09140855776539752, 23.134244028675827, 0.2006562548109767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 460.24999999999994, 85, 861, 452.5, 861.0, 861.0, 861.0, 0.05771506074510143, 34.53136047023346, 0.08394469589573775], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 963.3478260869565, 203, 1853, 848.0, 1622.0000000000002, 1818.3999999999996, 1853.0, 0.09209098589406334, 0.029294568033216818, 0.041548862776423105], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7ca509e8-a30a-40f9-a02a-2ef635833264", 3, 0, 0.0, 280.0, 177, 410, 253.0, 410.0, 410.0, 410.0, 0.026332651610241647, 0.026409798050506025, 0.01688649859120314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 109.94736842105263, 86, 272, 89.0, 255.0, 272.0, 272.0, 0.08814741960027464, 0.0684347642404476, 0.03133365306103513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 283.1333333333333, 169, 865, 178.0, 647.8000000000002, 865.0, 865.0, 0.08796776860958146, 7.143246256238381, 0.196341081461086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 241.60000000000002, 169, 519, 178.0, 415.20000000000005, 519.0, 519.0, 0.09223674096848578, 0.14294893351268256, 0.20744259223674097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 104.1, 84, 259, 87.5, 242.00000000000006, 259.0, 259.0, 0.048118101067259486, 0.03575964346893014, 0.024153031199776732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 121.1, 83, 265, 87.5, 263.8, 265.0, 265.0, 0.04811833260353862, 0.020102561218548656, 0.02703836775398059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 154.4, 84, 597, 87.0, 562.8000000000002, 597.0, 597.0, 0.04807969690559071, 4.3378826618002, 0.027852418168355868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 152.2, 85, 576, 88.0, 542.8000000000002, 576.0, 576.0, 0.04811879568278165, 1.4265249297465583, 0.02792205897920787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 3.1712029569892475, 6.646925403225807], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 803.8035714285714, 654, 1361, 691.5, 1103.3, 1205.5999999999997, 1361.0, 0.25506834465199113, 305.1504163079768, 0.5036603446155528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 963.3478260869565, 203, 1853, 848.0, 1622.0000000000002, 1818.3999999999996, 1853.0, 0.0955506626230734, 0.030395107182917203, 0.04310977161314444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 87.75, 83, 103, 85.0, 103.0, 103.0, 103.0, 0.051004144086707046, 0.01374721071087026, 0.030034666879183936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 109.0, 84, 253, 86.5, 253.0, 253.0, 253.0, 0.05094957266045931, 0.013732502006139423, 0.029952776114840336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 129.99999999999997, 82, 597, 85.0, 253.0, 597.0, 597.0, 0.08537714229224146, 4.065090276498369, 0.04980625848154505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 121.05263157894736, 82, 417, 86.0, 260.0, 417.0, 417.0, 0.08537790958928732, 1.3430608682708727, 0.04989008296261346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 87.47368421052632, 84, 96, 87.0, 91.0, 96.0, 96.0, 0.08537637500898698, 0.06344865369320224, 0.04285493823693292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 134.5, 85, 441, 90.0, 441.0, 441.0, 441.0, 0.051004144086707046, 0.013647593241950908, 0.02908830092445011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 111.8421052631579, 82, 258, 86.0, 252.0, 258.0, 258.0, 0.08537714229224146, 0.029594132792911, 0.048314264835401854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 88.75, 86, 95, 87.5, 95.0, 95.0, 95.0, 0.05100219309430306, 0.0379029970163717, 0.025600710205538838], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 502.8461538461539, 85, 1683, 421.0, 1213.7999999999997, 1683.0, 1683.0, 0.08355937214773297, 0.015654828285490235, 0.05686958470992042], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 94.75, 87, 107, 93.0, 107.0, 107.0, 107.0, 0.052277331242240085, 0.041147977520747565, 0.01858295759001503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1285.6363636363637, 795, 1945, 1212.5, 1764.1, 1921.1499999999996, 1945.0, 0.10767739851405189, 0.05573146602778077, 0.04952739716808442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 244.875, 176, 527, 181.5, 527.0, 527.0, 527.0, 0.05092006186787517, 0.07891615057062294, 0.11452041257980128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15183a21-cde3-46e8-ad3f-f9669b11d873", 3, 0, 0.0, 246.33333333333334, 179, 362, 198.0, 362.0, 362.0, 362.0, 0.018461197639428193, 0.025450251303052868, 0.011838723746638524], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 844.5762711864406, 441, 1730, 710.0, 1285.0, 1496.0, 1730.0, 0.27195206268725514, 100.34613840314589, 0.9845523522124914], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 149.67857142857142, 84, 560, 89.0, 344.6, 351.0, 560.0, 0.25585379782981155, 0.19014134780125644, 0.12367932609937178], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 482.3928571428572, 404, 697, 426.0, 631.8000000000002, 688.05, 697.0, 0.25551525106654804, 75.1299677183857, 0.12850620537038304], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 147.62499999999997, 82, 381, 89.0, 262.90000000000003, 335.6, 381.0, 0.2560081922621524, 0.45301449646388686, 0.12450398412749208], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 642.5892857142859, 568, 835, 592.0, 772.4000000000001, 784.3, 835.0, 0.25563189007828724, 230.01802404537466, 0.12831522607445278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 102.6, 85, 256, 92.0, 164.80000000000007, 256.0, 256.0, 0.09156502948393949, 0.06840551519063838, 0.03254850657436911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 141.32758620689654, 83, 1158, 92.5, 265.0, 295.25, 657.75, 0.731664241802417, 1.6237331880166854, 0.3509504802072208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 109.50000000000001, 88, 253, 92.0, 238.40000000000006, 253.0, 253.0, 0.04842427412013094, 0.03750043884498421, 0.017213316191140294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 105.9473684210526, 84, 277, 92.0, 137.0, 277.0, 277.0, 0.09678323103176018, 0.07854186033925069, 0.034403414155821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40fdb311-b52d-4f11-b85e-99456418459e", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 278.8, 171, 683, 179.0, 667.2, 683.0, 683.0, 0.048059131955958616, 5.816577028876329, 0.10685647620832672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4a08278-31f2-4c2c-8009-ba12425e5c4e", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e382c932-ebe4-4334-8ac1-8f78d7a6d4b1", 3, 0, 0.0, 328.6666666666667, 254, 453, 279.0, 453.0, 453.0, 453.0, 0.023755038047652607, 0.028077650765308142, 0.015233536768839725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 237.57894736842107, 169, 686, 177.0, 351.0, 686.0, 686.0, 0.08534339487041279, 5.499007953218344, 0.19079003700085342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57aedae0-27ce-45bd-a8c8-2b591856051e", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e7158c6-c395-4aeb-81ba-7ee3bc10e67e", 3, 0, 0.0, 332.6666666666667, 173, 421, 404.0, 421.0, 421.0, 421.0, 0.035675212862103414, 0.02293572441492651, 0.02287765928982543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87e961c6-f845-47a4-8c09-f6a0e4fdacbf", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 90.3076923076923, 85, 102, 89.0, 98.8, 102.0, 102.0, 0.14903983949555746, 0.12356916380051591, 0.05297900544568645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 112.25, 86, 261, 91.0, 254.0, 261.0, 261.0, 0.07658140603461479, 0.05945529081788942, 0.02722229667636698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6f7c2b7-69df-4faa-aaf4-c624d5994278", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.6451231060606061, 1.2054135101010102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b80742a2-24ee-4afe-b24f-7d3e37cce5c2", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 97.99999999999999, 83, 265, 86.0, 160.00000000000006, 265.0, 265.0, 0.09228611155545165, 0.06858372157587764, 0.04632330208935756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 108.66666666666666, 82, 259, 86.0, 256.0, 259.0, 259.0, 0.09228667934070396, 0.0246938966204618, 0.052632246811495226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 129.79999999999998, 82, 258, 87.0, 255.0, 258.0, 258.0, 0.09228611155545165, 0.024873991005180326, 0.05425413980115419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 108.00000000000001, 83, 253, 86.0, 251.8, 253.0, 253.0, 0.09228724713294285, 0.024874297078801004, 0.0543449316612935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/162998cd-03f4-46fc-9ddd-d2fefee91b6d", 3, 0, 0.0, 242.33333333333331, 164, 397, 166.0, 397.0, 397.0, 397.0, 0.06118578042462932, 0.028362158634333383, 0.03923697507699211], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 20.0, 0.3069838833461243], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 15.0, 0.23023791250959325], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07674597083653108], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.920951650038373], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 20, "401/Unauthorized", 12, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
