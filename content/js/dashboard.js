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

    var data = {"OkPercent": 98.54182655410591, "KoPercent": 1.4581734458940905};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7638705416116248, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/186235dc-cbf4-49dc-a04f-03fd4471d3dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97ef511a-a1d4-420f-bc6e-0949ca462db7"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e858ca32-62f7-4b33-a28e-ba4a7c09d3c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4a1d1eb-726a-40a9-bca6-95f262a483da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/13218b0e-b318-46d5-96ea-d41d07c0aba5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4afcd1a-1e28-4821-a9a4-b09b8f6417ba"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ceedff04-059d-430c-82e3-f016107a8da7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8abda34-aac2-4697-9caa-e62e8594283f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7686174b-7dae-4fe1-93d9-bc94d9888cae"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89728e11-3335-4b56-976d-e7c583347dc3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbc78988-0527-4aa7-986e-4628ad31fbb8"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e469550-6a5a-4c88-aea2-2f4887f5b1b7"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8abda34-aac2-4697-9caa-e62e8594283f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ceedff04-059d-430c-82e3-f016107a8da7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4a1d1eb-726a-40a9-bca6-95f262a483da"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0706940-3892-4bce-8188-4881b992ce38"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=859530ac-e678-41cd-9221-8dbe08af1afd"], "isController": false}, {"data": [0.39090909090909093, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97ef511a-a1d4-420f-bc6e-0949ca462db7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4afcd1a-1e28-4821-a9a4-b09b8f6417ba"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e858ca32-62f7-4b33-a28e-ba4a7c09d3c5"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7686174b-7dae-4fe1-93d9-bc94d9888cae"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/adf35682-4857-4003-b096-1ab311972f7f"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9350282485875706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cbc78988-0527-4aa7-986e-4628ad31fbb8"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adf35682-4857-4003-b096-1ab311972f7f"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/859530ac-e678-41cd-9221-8dbe08af1afd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e469550-6a5a-4c88-aea2-2f4887f5b1b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f0706940-3892-4bce-8188-4881b992ce38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 19, 1.4581734458940905, 429.70990023023785, 134, 6323, 146.0, 1103.6000000000001, 1268.6, 1812.6800000000003, 5.126570823792325, 699.9536212922853, 3.752972190172958], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2042.4545454545457, 1635, 2726, 1984.0, 2379.8, 2560.2, 2726.0, 0.2479309039109973, 298.3450911512333, 1.2190743175701868], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/186235dc-cbf4-49dc-a04f-03fd4471d3dc", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97ef511a-a1d4-420f-bc6e-0949ca462db7", 3, 0, 0.0, 387.3333333333333, 233, 477, 452.0, 477.0, 477.0, 477.0, 0.025276567779116497, 0.02535062022378188, 0.016209257332311038], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 600.7142857142858, 140, 1289, 561.5, 1198.5, 1289.0, 1289.0, 0.07227522405319457, 0.014237251166728616, 0.04863049743422954], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 600.7142857142858, 140, 1289, 561.5, 1198.5, 1289.0, 1289.0, 0.07356766385883416, 0.014491844498977936, 0.04950011757689135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e858ca32-62f7-4b33-a28e-ba4a7c09d3c5", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4a1d1eb-726a-40a9-bca6-95f262a483da", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 217.0555555555556, 136, 425, 140.0, 422.3, 425.0, 425.0, 0.0964588870787962, 0.04190770224213324, 0.05411159355440281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13218b0e-b318-46d5-96ea-d41d07c0aba5", 2, 0, 0.0, 533.0, 386, 680, 533.0, 680.0, 680.0, 680.0, 0.02334975599504985, 0.026359685478786747, 0.014513788760594953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 185.77777777777777, 137, 416, 140.5, 415.1, 416.0, 416.0, 0.09645785327688762, 0.07168401010128074, 0.04841732088312523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4afcd1a-1e28-4821-a9a4-b09b8f6417ba", 3, 0, 0.0, 688.3333333333333, 325, 1362, 378.0, 1362.0, 1362.0, 1362.0, 0.018717011267640783, 0.025802911041164944, 0.01200277089754308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 291.22222222222223, 135, 960, 139.0, 718.8000000000004, 960.0, 960.0, 0.09645992090286486, 3.174490135633367, 0.0558810240560325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 272.72222222222223, 136, 1205, 139.0, 1204.1, 1205.0, 1205.0, 0.09646043782320946, 9.667029370193726, 0.05578712387127891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ceedff04-059d-430c-82e3-f016107a8da7", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 270.06666666666666, 138, 680, 238.0, 467.0000000000001, 680.0, 680.0, 0.0776763382338472, 0.16098117675768606, 0.050206424868856445], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c8abda34-aac2-4697-9caa-e62e8594283f", 3, 0, 0.0, 321.6666666666667, 240, 482, 243.0, 482.0, 482.0, 482.0, 0.023276203185736342, 0.02792083617820261, 0.014926471443978058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 170.68421052631578, 137, 428, 140.0, 416.0, 428.0, 428.0, 0.10137712825273852, 0.07533983847688867, 0.050886566329987885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 183.31578947368422, 136, 422, 140.0, 417.0, 422.0, 422.0, 0.10137821008766548, 0.04315451973406895, 0.05692103037611316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 843.4, 680, 1098, 815.0, 1098.0, 1098.0, 1098.0, 0.05970220539946746, 17.554430687232088, 0.034048914016883786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1163.2, 962, 1384, 1229.0, 1384.0, 1384.0, 1384.0, 0.05949264670886678, 53.53158808555638, 0.03387130178834896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 250.8, 137, 423, 140.0, 423.0, 423.0, 423.0, 0.05989386806578743, 0.10598407122578792, 0.03316388983720847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 159.49999999999997, 135, 405, 141.0, 274.5, 405.0, 405.0, 0.06924385708067898, 0.051459546131246786, 0.03475717044870019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 220.0, 138, 430, 141.5, 426.5, 430.0, 430.0, 0.06918944564427729, 0.018513582135285134, 0.039459605719001895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 198.7857142857143, 134, 422, 139.0, 418.0, 422.0, 422.0, 0.06919081343685597, 0.018649086434152584, 0.040676630555651655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 217.85714285714283, 134, 422, 141.0, 418.5, 422.0, 422.0, 0.06924488453415505, 0.018663660284596473, 0.040776040404390125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 195.4, 138, 418, 140.0, 418.0, 418.0, 418.0, 0.06009326474688717, 0.04465915475818471, 0.033743776591269654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7686174b-7dae-4fe1-93d9-bc94d9888cae", 1, 0, 0.0, 1016.0, 1016, 1016, 1016.0, 1016.0, 1016.0, 1016.0, 0.984251968503937, 0.17781895915354332, 0.678595595472441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 269.2105263157894, 136, 1234, 139.0, 968.0, 1234.0, 1234.0, 0.10137821008766548, 9.626584284643336, 0.05868222666567067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 920.2, 136, 1347, 1230.0, 1300.2, 1347.0, 1347.0, 0.07126263130139818, 42.754563109592425, 0.037811877936614266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 291.3157894736842, 135, 1103, 141.0, 976.0, 1103.0, 1103.0, 0.10138037382678897, 3.162258954821704, 0.058782483405633544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 697.2000000000002, 136, 1113, 942.0, 1108.8, 1113.0, 1113.0, 0.07126263130139818, 13.975455665141647, 0.037881470349994534], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 604.0833333333334, 235, 1129, 497.5, 1095.1000000000001, 1129.0, 1129.0, 0.0759589821496392, 0.013723058298518801, 0.05237015761488796], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89728e11-3335-4b56-976d-e7c583347dc3", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 421.2142857142857, 279, 821, 285.0, 697.5, 821.0, 821.0, 0.06914092401906315, 0.10715492814282539, 0.1554995586092797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbc78988-0527-4aa7-986e-4628ad31fbb8", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 698.8499999999999, 167, 2542, 520.5, 1205.0, 2475.2999999999993, 2542.0, 0.08698980479487804, 0.053434167203103795, 0.039332304316434114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 157.73333333333332, 137, 415, 139.0, 253.0000000000001, 415.0, 415.0, 0.07126127709710062, 0.0529588201864195, 0.03576982073038058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 233.66666666666669, 137, 426, 142.0, 425.4, 426.0, 426.0, 0.07126060001425212, 0.09042116499204256, 0.03665095964274686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e469550-6a5a-4c88-aea2-2f4887f5b1b7", 3, 0, 0.0, 330.0, 237, 511, 242.0, 511.0, 511.0, 511.0, 0.02610034713461689, 0.026176812995362838, 0.016737527296613045], "isController": false}, {"data": ["login", 20, 0, 0.0, 3174.4999999999995, 1404, 7762, 2625.0, 7186.0000000000055, 7746.5, 7762.0, 0.08550479895684146, 25.69062242817597, 0.1644547866655266], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8abda34-aac2-4697-9caa-e62e8594283f", 1, 0, 0.0, 1129.0, 1129, 1129, 1129.0, 1129.0, 1129.0, 1129.0, 0.8857395925597874, 0.16002131310894596, 0.6106759300265722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 186.21052631578948, 138, 419, 144.0, 419.0, 419.0, 419.0, 0.10182644486365976, 0.08243566678903703, 0.03619611907262905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ceedff04-059d-430c-82e3-f016107a8da7", 3, 0, 0.0, 315.0, 236, 472, 237.0, 472.0, 472.0, 472.0, 0.02340933564305445, 0.02347791768107121, 0.01501184609922437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4a1d1eb-726a-40a9-bca6-95f262a483da", 3, 0, 0.0, 393.0, 232, 485, 462.0, 485.0, 485.0, 485.0, 0.050159674965306225, 0.03224783790901035, 0.03216619781303817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1081.3999999999999, 280, 1489, 1371.0, 1443.4, 1489.0, 1489.0, 0.07121323616682887, 56.83398099051677, 0.14801318780117265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0706940-3892-4bce-8188-4881b992ce38", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 538.7222222222222, 278, 1345, 284.0, 1344.1, 1345.0, 1345.0, 0.09638502605073065, 12.945002637201407, 0.214032070109397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1010.5714285714286, 138, 1802, 1120.0, 1802.0, 1802.0, 1802.0, 0.0822832424299417, 70.32012222000188, 0.14770347103042128], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1190.9545454545453, 175, 4553, 947.0, 2546.4999999999995, 4286.899999999996, 4553.0, 0.09424263193968471, 0.02965162354352296, 0.04251962495716244], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 500.47368421052636, 277, 1374, 284.0, 1117.0, 1374.0, 1374.0, 0.10130145714148615, 12.897498878686173, 0.22510104320507146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 160.8235294117647, 137, 417, 144.0, 207.3999999999998, 417.0, 417.0, 0.09950015802966275, 0.0772486578452948, 0.03536919679960668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 401.0, 275, 580, 286.0, 569.5, 580.0, 580.0, 0.12838383097351624, 0.19896986304196318, 0.2887382448554765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 140.2, 139, 143, 140.0, 142.9, 143.0, 143.0, 0.0471620251373594, 0.03504912219680713, 0.023673125899026103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 166.0, 136, 411, 139.0, 384.10000000000014, 411.0, 411.0, 0.047101824724689836, 0.012603417943911146, 0.02686275941329967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 168.3, 136, 424, 140.0, 396.0000000000001, 424.0, 424.0, 0.04716224756406991, 0.012711699538753219, 0.02772624319684579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 166.10000000000002, 135, 417, 138.0, 389.4000000000001, 417.0, 417.0, 0.04716335972909366, 0.012711999301982276, 0.027772954996722148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=859530ac-e678-41cd-9221-8dbe08af1afd", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 0.5663450235109718, 2.161295062695925], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1309.5272727272732, 1076, 2155, 1129.0, 1797.0, 1980.7999999999997, 2155.0, 0.24076238503596115, 288.0355150509322, 0.47541166263936857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1190.9545454545453, 175, 4553, 947.0, 2546.4999999999995, 4286.899999999996, 4553.0, 0.09346787041954328, 0.02940785979819437, 0.04217007434944238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 169.88888888888889, 135, 416, 140.0, 416.0, 416.0, 416.0, 0.039925295336281884, 0.010761114758607228, 0.023510696374783185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 169.22222222222223, 135, 405, 141.0, 405.0, 405.0, 405.0, 0.03992494111071186, 0.010761019283746556, 0.02347149858266459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 220.8235294117647, 135, 426, 141.0, 423.6, 426.0, 426.0, 0.10105753740615024, 0.027238164379001433, 0.05941077882666254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 202.52941176470588, 135, 414, 138.0, 413.2, 414.0, 414.0, 0.10123024521538224, 0.027284714530708493, 0.05961116978991747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 201.33333333333334, 139, 414, 142.0, 414.0, 414.0, 414.0, 0.039924586891427305, 0.010682946101807696, 0.022769490961517133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 156.76470588235296, 138, 415, 141.0, 197.3999999999998, 415.0, 415.0, 0.10122723131613265, 0.07522844046052436, 0.05081132509423065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 172.00000000000003, 136, 415, 142.0, 415.0, 415.0, 415.0, 0.03992334717342702, 0.02966959687400192, 0.02003964887416161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 188.52941176470588, 137, 424, 139.0, 420.8, 424.0, 424.0, 0.10123024521538224, 0.0270869992080222, 0.05773287422439768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 178.77777777777777, 139, 425, 144.0, 425.0, 425.0, 425.0, 0.03966854724964739, 0.03122348543282793, 0.014100928905148096], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 673.9166666666666, 452, 1362, 528.0, 1276.2000000000003, 1362.0, 1362.0, 0.07702627237773683, 0.013915879286993471, 0.052429015475861894], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97ef511a-a1d4-420f-bc6e-0949ca462db7", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4afcd1a-1e28-4821-a9a4-b09b8f6417ba", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1780.0999999999995, 849, 6323, 1254.5, 4505.000000000002, 6235.5999999999985, 6323.0, 0.08620280934955671, 0.04461668843287603, 0.039649925003555866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 375.55555555555554, 282, 825, 286.0, 825.0, 825.0, 825.0, 0.03989821521983917, 0.06183444097059058, 0.08973202114383749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e858ca32-62f7-4b33-a28e-ba4a7c09d3c5", 3, 0, 0.0, 361.6666666666667, 295, 455, 335.0, 455.0, 455.0, 455.0, 0.016309932205048467, 0.022484558231894616, 0.010459168764305169], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 1274.2131147540983, 709, 2385, 1115.0, 2024.6000000000001, 2137.1, 2385.0, 0.28879294019618984, 80.38223047570352, 1.052491778573931], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7686174b-7dae-4fe1-93d9-bc94d9888cae", 3, 0, 0.0, 405.66666666666663, 236, 712, 269.0, 712.0, 712.0, 712.0, 0.024850688778257305, 0.024923493530537355, 0.015936151332411098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adf35682-4857-4003-b096-1ab311972f7f", 3, 0, 0.0, 555.6666666666667, 261, 1076, 330.0, 1076.0, 1076.0, 1076.0, 0.04688818730267887, 0.03014458656340846, 0.03006827115438717], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 236.25454545454554, 139, 794, 142.0, 561.0, 569.6, 794.0, 0.24177843424285986, 0.17968104341681285, 0.11687531733419494], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 814.8545454545454, 668, 1453, 700.0, 1028.9999999999998, 1127.8, 1453.0, 0.24164034251420186, 71.0502839136729, 0.12152810194806052], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 202.69090909090912, 135, 574, 142.0, 415.0, 448.3999999999995, 574.0, 0.2422075234060543, 0.42859378165211953, 0.11779233071896], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1061.0545454545454, 936, 1583, 971.0, 1265.2, 1293.1999999999996, 1583.0, 0.2416605153080952, 217.4465564680986, 0.1213022508480087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 180.92857142857144, 139, 415, 142.0, 415.0, 415.0, 415.0, 0.1336706927006254, 0.09986140616794768, 0.04751575404592543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 9, 5.084745762711864, 214.2824858757062, 135, 1366, 145.0, 411.4000000000001, 431.9999999999999, 790.3599999999992, 0.7139399806389158, 1.4704017109853986, 0.34528684908438206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 143.5, 141, 150, 143.0, 149.5, 150.0, 150.0, 0.04834678179646972, 0.037440427699805164, 0.017185770091713844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 143.55555555555554, 137, 155, 143.0, 149.60000000000002, 155.0, 155.0, 0.09416392893762164, 0.07641623529996443, 0.033472334114545185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbc78988-0527-4aa7-986e-4628ad31fbb8", 3, 0, 0.0, 1103.3333333333333, 263, 2502, 545.0, 2502.0, 2502.0, 2502.0, 0.01961309893500873, 0.027038240231042305, 0.012577410449859112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 365.2, 278, 564, 284.5, 563.3, 564.0, 564.0, 0.04707056348171544, 0.07295017992722891, 0.10586280048670962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adf35682-4857-4003-b096-1ab311972f7f", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 429.2352941176471, 279, 830, 289.0, 617.9999999999998, 830.0, 830.0, 0.10097230389099743, 0.1564873498779423, 0.22708907798922567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/859530ac-e678-41cd-9221-8dbe08af1afd", 3, 0, 0.0, 356.0, 232, 598, 238.0, 598.0, 598.0, 598.0, 0.06077303297949923, 0.02749821479215623, 0.03897229002917106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e469550-6a5a-4c88-aea2-2f4887f5b1b7", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 162.42857142857142, 140, 413, 144.0, 279.5, 413.0, 413.0, 0.07121420214659951, 0.05904380627193652, 0.02531442341929905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 142.4, 138, 152, 142.0, 147.8, 152.0, 152.0, 0.07347754526216789, 0.057045555159593225, 0.02611897116741124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0706940-3892-4bce-8188-4881b992ce38", 3, 0, 0.0, 594.3333333333334, 291, 937, 555.0, 937.0, 937.0, 937.0, 0.06289440030189312, 0.028458078261598775, 0.04033267206859683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 141.5, 136, 145, 142.5, 145.0, 145.0, 145.0, 0.12854768660074006, 0.0955320209991828, 0.0645249130007621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 197.35714285714286, 135, 415, 141.0, 415.0, 415.0, 415.0, 0.12855831037649218, 0.03439939164370982, 0.0733184113865932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 238.2142857142857, 137, 436, 139.5, 426.0, 436.0, 436.0, 0.12855476892280285, 0.034649527561224205, 0.07557614344875714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 197.21428571428572, 134, 414, 140.5, 412.0, 414.0, 414.0, 0.1285606714540212, 0.03465111847784165, 0.075705161022241], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.4604758250191865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15349194167306215], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8442056792018419], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
