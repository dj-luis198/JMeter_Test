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

    var data = {"OkPercent": 98.1941309255079, "KoPercent": 1.8058690744920993};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7975499677627337, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41379310344827586, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3e4aae0-218b-4026-886b-e524036483c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41b7afe0-4d3b-46e4-a6da-6fafef61b87e"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dec6855f-e385-4f7d-9414-05f46e7edd0a"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=592e4850-7bda-4925-b6dd-2762edc4c9b6"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/393595fa-f4bb-43fa-a165-a75cfefcb4e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7f2a997-8d5e-449a-b84f-84577cd967b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a01f098-cc7b-45ae-8d0e-23b615ccec73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d59f3da-78a2-4d9a-9552-353c5f355894"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8003443-db33-4966-8415-e20532c79f90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5a76e68-eaa0-4e3f-be13-72bae2cd6822"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/592e4850-7bda-4925-b6dd-2762edc4c9b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bff2a6f0-8d3c-4f35-a79f-8172641b0f6b"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d938561-24fe-4de1-86ed-b410f8fadae3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e98be5e6-2ec0-467b-9b13-ccb0e38d4739"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e77d97b-8c27-4ddb-b61c-89cc38838324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3412558e-b6a9-4ab6-a7b2-b75bc71f803e"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3e4aae0-218b-4026-886b-e524036483c1"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4df0a6c-969a-4172-bd37-671f52ab9a13"], "isController": false}, {"data": [0.37719298245614036, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d59f3da-78a2-4d9a-9552-353c5f355894"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8448275862068966, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a01f098-cc7b-45ae-8d0e-23b615ccec73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/931463fc-fe04-41ec-9463-a0ab08f0fb34"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/41b7afe0-4d3b-46e4-a6da-6fafef61b87e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9476744186046512, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8003443-db33-4966-8415-e20532c79f90"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=393595fa-f4bb-43fa-a165-a75cfefcb4e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bff2a6f0-8d3c-4f35-a79f-8172641b0f6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e98be5e6-2ec0-467b-9b13-ccb0e38d4739"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dec6855f-e385-4f7d-9414-05f46e7edd0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5a76e68-eaa0-4e3f-be13-72bae2cd6822"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e77d97b-8c27-4ddb-b61c-89cc38838324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 24, 1.8058690744920993, 322.7945823927764, 77, 3797, 106.0, 862.0, 1056.0, 1770.2000000000016, 5.203153996131892, 752.7755767293929, 3.7993955835832467], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1330.8620689655172, 962, 1796, 1307.5, 1629.6, 1763.8, 1796.0, 0.2713069510711947, 326.47561526452427, 1.334014158831509], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3e4aae0-218b-4026-886b-e524036483c1", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41b7afe0-4d3b-46e4-a6da-6fafef61b87e", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 629.6, 90, 1112, 638.0, 1098.8, 1112.0, 1112.0, 0.08266876829046498, 0.016824386046614164, 0.05539776250089558], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 629.6, 90, 1112, 638.0, 1098.8, 1112.0, 1112.0, 0.08278876722006358, 0.016848807703770754, 0.0554781758461012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 112.0, 77, 238, 82.0, 237.4, 238.0, 238.0, 0.08309282576542341, 0.030553924474160905, 0.04692364392508351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 124.8, 79, 361, 82.0, 289.6, 361.0, 361.0, 0.08307993951780403, 0.06174202536430553, 0.04170223526577273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 150.2, 78, 619, 81.0, 401.8000000000001, 619.0, 619.0, 0.08309282576542341, 1.6497063534159462, 0.04845458596229802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dec6855f-e385-4f7d-9414-05f46e7edd0a", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 168.93333333333334, 77, 933, 81.0, 520.2000000000003, 933.0, 933.0, 0.0830923654734603, 5.005346690777301, 0.048373172660395966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=592e4850-7bda-4925-b6dd-2762edc4c9b6", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 217.9375, 79, 419, 203.5, 365.1000000000001, 419.0, 419.0, 0.08369426485050112, 0.1491366004828113, 0.05409170962536355], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 103.0625, 80, 250, 83.0, 241.60000000000002, 250.0, 250.0, 0.08835092989353713, 0.06565923598533374, 0.04434802535671688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 130.625, 79, 242, 82.5, 240.6, 242.0, 242.0, 0.0882768361581921, 0.0484811384125618, 0.048955281575520836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 566.3333333333333, 463, 645, 582.0, 645.0, 645.0, 645.0, 0.034471268197957004, 10.135697404026244, 0.019659395144147353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/393595fa-f4bb-43fa-a165-a75cfefcb4e4", 3, 0, 0.0, 316.3333333333333, 199, 473, 277.0, 473.0, 473.0, 473.0, 0.027498464669055978, 0.027579026577266103, 0.017634106574882902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 844.1666666666666, 697, 969, 841.5, 969.0, 969.0, 969.0, 0.03438434824467902, 30.939096991799335, 0.01957624514321081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 213.83333333333334, 82, 244, 239.5, 244.0, 244.0, 244.0, 0.03452104920975565, 0.06108607535945043, 0.019114682521417434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7f2a997-8d5e-449a-b84f-84577cd967b7", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 82.47619047619047, 79, 89, 82.0, 84.8, 88.6, 89.0, 0.10111710323574731, 0.07514659722890986, 0.05075604596013097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 103.47619047619048, 77, 249, 81.0, 240.4, 248.29999999999998, 249.0, 0.10112245929821012, 0.027058158054403883, 0.057671402568510464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 96.33333333333334, 79, 247, 81.0, 205.0000000000001, 245.79999999999998, 247.0, 0.10112002465402506, 0.02725500664503019, 0.0594475144938702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 103.52380952380955, 78, 244, 81.0, 236.4, 243.29999999999998, 244.0, 0.10112197235999422, 0.027255531612654694, 0.05954741145808254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 136.16666666666666, 80, 247, 86.0, 247.0, 247.0, 247.0, 0.034553653184982984, 0.025679033275168017, 0.019402686114614466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 509.99999999999994, 78, 980, 687.0, 977.9, 980.0, 980.0, 0.08481854133313542, 42.93993012575674, 0.04576391024077863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 222.125, 79, 865, 84.0, 862.2, 865.0, 865.0, 0.08835141776415693, 14.925366132071565, 0.050517338965736215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 406.99999999999983, 78, 743, 622.0, 719.9, 743.0, 743.0, 0.08481764206955046, 14.038303365537534, 0.04584625477099237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 221.0625, 79, 621, 158.5, 618.9, 621.0, 621.0, 0.08827488800123584, 4.886034447206099, 0.05055978692648908], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 467.06666666666666, 82, 1026, 489.0, 849.0000000000001, 1026.0, 1026.0, 0.08298112456020004, 0.01688795542807196, 0.05602846632902569], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2a01f098-cc7b-45ae-8d0e-23b615ccec73", 3, 0, 0.0, 358.3333333333333, 210, 467, 398.0, 467.0, 467.0, 467.0, 0.020104408896871085, 0.02376273069809209, 0.012892475757433604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 196.04761904761904, 161, 333, 166.0, 324.6, 332.2, 333.0, 0.10107573460399971, 0.1566476472817847, 0.22732169608692515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d59f3da-78a2-4d9a-9552-353c5f355894", 3, 0, 0.0, 516.6666666666666, 252, 996, 302.0, 996.0, 996.0, 996.0, 0.05517241379310345, 0.036117097701149424, 0.03538074712643678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 729.6521739130434, 194, 2035, 679.0, 1381.8000000000006, 1936.1999999999985, 2035.0, 0.09573998684615832, 0.058809034888899984, 0.043288685458761036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.8125, 79, 92, 82.0, 88.5, 92.0, 92.0, 0.0848153939940099, 0.0630317527631265, 0.0425733520633995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8003443-db33-4966-8415-e20532c79f90", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 140.8125, 79, 247, 82.0, 245.6, 247.0, 247.0, 0.08481764206955046, 0.09435341457273114, 0.0443656733725615], "isController": false}, {"data": ["login", 23, 0, 0.0, 3101.260869565217, 1766, 5699, 2934.0, 4463.8, 5480.599999999997, 5699.0, 0.0933847084570004, 29.272236218650143, 0.18129369160918093], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5a76e68-eaa0-4e3f-be13-72bae2cd6822", 3, 0, 0.0, 399.3333333333333, 184, 570, 444.0, 570.0, 570.0, 570.0, 0.09400557766427475, 0.04253507583116598, 0.06028352473913452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 87.0625, 81, 104, 84.5, 103.3, 104.0, 104.0, 0.08437883989642497, 0.06831060378333623, 0.029994040744432314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/592e4850-7bda-4925-b6dd-2762edc4c9b6", 3, 0, 0.0, 478.3333333333333, 385, 631, 419.0, 631.0, 631.0, 631.0, 0.09215174320380894, 0.04169626401474428, 0.05909470511442175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bff2a6f0-8d3c-4f35-a79f-8172641b0f6b", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 594.0625, 162, 1063, 768.5, 1061.6, 1063.0, 1063.0, 0.08477899176584043, 57.10912931478705, 0.17846847082542946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d938561-24fe-4de1-86ed-b410f8fadae3", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e98be5e6-2ec0-467b-9b13-ccb0e38d4739", 3, 0, 0.0, 386.0, 172, 625, 361.0, 625.0, 625.0, 625.0, 0.025897342932615114, 0.02597321405448801, 0.016607345565511647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 328.8666666666666, 163, 1018, 315.0, 701.8000000000002, 1018.0, 1018.0, 0.08304084502363895, 6.7431653059501535, 0.1853443548141546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 530.9166666666667, 79, 1217, 472.5, 1159.4, 1217.0, 1217.0, 0.06760411032990807, 40.448054163568145, 0.09861683574736345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e77d97b-8c27-4ddb-b61c-89cc38838324", 3, 0, 0.0, 397.6666666666667, 263, 518, 412.0, 518.0, 518.0, 518.0, 0.026385224274406333, 0.026462524736147755, 0.016920212181178538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3412558e-b6a9-4ab6-a7b2-b75bc71f803e", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1222.4347826086955, 241, 2192, 1166.0, 2009.6000000000004, 2176.7999999999997, 2192.0, 0.09548877799274286, 0.030083505974276153, 0.04308185100844453], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 86.55555555555557, 80, 98, 85.5, 96.2, 98.0, 98.0, 0.09208008921537533, 0.07148795988889002, 0.03273159421327795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 386.0625, 162, 949, 320.0, 944.8, 949.0, 949.0, 0.08823350998417312, 19.90322123828838, 0.19420634991755684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 322.5, 161, 1092, 319.5, 863.4000000000008, 1092.0, 1092.0, 0.08414793206456951, 8.508726896571673, 0.18745650165490935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 113.18181818181817, 79, 266, 82.0, 263.2, 266.0, 266.0, 0.07448083472702774, 0.055351479714129015, 0.0373858877438401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 109.27272727272727, 78, 242, 81.0, 241.6, 242.0, 242.0, 0.07457374326294024, 0.01995430239652893, 0.04253033795464561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 109.63636363636363, 79, 241, 81.0, 240.4, 241.0, 241.0, 0.07457222659110015, 0.02009954544838246, 0.04384031289828348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 80.45454545454545, 78, 87, 80.0, 86.0, 87.0, 87.0, 0.07457070998095057, 0.020099136674553084, 0.04391224425636055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 83.33333333333333, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.020811077042607214, 0.006137641862175174, 0.01286465992965856], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 912.5517241379309, 626, 1445, 887.0, 1293.9, 1390.1, 1445.0, 0.2741798241467335, 328.01439000898176, 0.5413980511959913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3e4aae0-218b-4026-886b-e524036483c1", 3, 0, 0.0, 575.0, 342, 890, 493.0, 890.0, 890.0, 890.0, 0.028792997542997543, 0.028877352027986795, 0.018464259492091524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1222.4347826086955, 241, 2192, 1166.0, 2009.6000000000004, 2176.7999999999997, 2192.0, 0.09368215680763795, 0.029514334388275883, 0.042266754340946025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 81.66666666666667, 78, 89, 80.5, 89.0, 89.0, 89.0, 0.03660478424530086, 0.009866133253616247, 0.021555356347574627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 108.33333333333333, 79, 242, 80.5, 242.0, 242.0, 242.0, 0.036568196639382725, 0.009856271750458626, 0.021498099977449614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 214.77777777777774, 78, 927, 82.5, 867.6000000000001, 927.0, 927.0, 0.09070569027030297, 9.090302632606681, 0.05245891158210881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 160.61111111111111, 79, 630, 82.0, 503.1000000000002, 630.0, 630.0, 0.09077750936773465, 2.9874823172976543, 0.05258909749504506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 83.22222222222221, 80, 96, 82.0, 90.60000000000001, 96.0, 96.0, 0.0907692695595169, 0.06745645911600817, 0.04556191850936688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 106.83333333333333, 78, 238, 80.5, 238.0, 238.0, 238.0, 0.03656908814978699, 0.00978508804007972, 0.02085580808542539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 142.05555555555557, 79, 246, 81.0, 244.2, 246.0, 246.0, 0.0907765937596135, 0.03943896282698486, 0.05092393551835957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 109.0, 79, 250, 81.0, 250.0, 250.0, 250.0, 0.03660344438411654, 0.02720236442999286, 0.018373213294371], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 517.1333333333333, 80, 1361, 493.0, 1142.0000000000002, 1361.0, 1361.0, 0.08172427319879702, 0.016185236918668, 0.05561081402824391], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 87.33333333333334, 82, 99, 85.5, 99.0, 99.0, 99.0, 0.037221305475254034, 0.02929723848931128, 0.013231010930656708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1814.3913043478262, 1096, 3797, 1676.0, 2946.400000000001, 3682.3999999999983, 3797.0, 0.09523375746860391, 0.049290909627304764, 0.043803808366906685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 219.83333333333334, 160, 492, 166.5, 492.0, 492.0, 492.0, 0.03654948495684115, 0.05664456311182315, 0.08220064829648942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4df0a6c-969a-4172-bd37-671f52ab9a13", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 952.4736842105266, 426, 2690, 771.0, 1691.0, 1795.7999999999997, 2690.0, 0.2706964021123818, 91.96964059709927, 0.9826147684477223], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d59f3da-78a2-4d9a-9552-353c5f355894", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 141.22413793103448, 78, 424, 84.0, 328.3, 333.05, 424.0, 0.27498316913361337, 0.20435760909246073, 0.13292643429798692], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 497.6034482758619, 387, 734, 471.0, 641.2, 710.1999999999999, 734.0, 0.27495058000350797, 80.84459973950803, 0.13828080927910802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a01f098-cc7b-45ae-8d0e-23b615ccec73", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/931463fc-fe04-41ec-9463-a0ab08f0fb34", 2, 0, 0.0, 224.0, 197, 251, 224.0, 251.0, 251.0, 251.0, 0.027782022253399825, 0.031607476489463666, 0.017268805824500966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41b7afe0-4d3b-46e4-a6da-6fafef61b87e", 3, 0, 0.0, 464.6666666666667, 225, 658, 511.0, 658.0, 658.0, 658.0, 0.027962641910407697, 0.028044563712879594, 0.017931772318848686], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 134.18965517241384, 79, 333, 85.0, 246.9, 290.7999999999999, 333.0, 0.27535392474292386, 0.48724737464275203, 0.13391235793161727], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 768.310344827586, 540, 1061, 776.5, 980.3000000000001, 1034.45, 1061.0, 0.2746537232153427, 247.13390293891322, 0.1378632946608263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 87.5, 83, 98, 85.0, 97.4, 98.0, 98.0, 0.08891984616866613, 0.06642937726467733, 0.03160822656776804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, 3.488372093023256, 169.81976744186048, 81, 1573, 90.0, 368.80000000000126, 441.0, 1122.5900000000063, 0.7185708794973347, 1.6106157880884344, 0.3431701430666266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 102.09090909090911, 81, 242, 87.0, 214.60000000000008, 242.0, 242.0, 0.07898894154818324, 0.06117014711690364, 0.028078100315955767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 87.39999999999999, 81, 102, 86.0, 99.0, 102.0, 102.0, 0.08413731209333632, 0.06827940073199462, 0.029908185158178148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 224.90909090909093, 160, 508, 164.0, 505.40000000000003, 508.0, 508.0, 0.07443597829176198, 0.11536122807522095, 0.16740825977141388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8003443-db33-4966-8415-e20532c79f90", 3, 0, 0.0, 552.6666666666666, 178, 1101, 379.0, 1101.0, 1101.0, 1101.0, 0.04011231448054552, 0.02578835322235593, 0.025723066252172747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 335.2777777777777, 161, 1008, 317.5, 951.3000000000001, 1008.0, 1008.0, 0.09066046146174883, 12.176164294384591, 0.20132013279239258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=393595fa-f4bb-43fa-a165-a75cfefcb4e4", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 0.17608583089668617, 0.6719816033138402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bff2a6f0-8d3c-4f35-a79f-8172641b0f6b", 3, 0, 0.0, 611.6666666666667, 178, 1361, 296.0, 1361.0, 1361.0, 1361.0, 0.02654820268667811, 0.02662598062423674, 0.017024726332277307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 112.80952380952381, 81, 253, 90.0, 245.4, 252.39999999999998, 253.0, 0.09892687890407861, 0.08202042987261987, 0.0351654139854342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e98be5e6-2ec0-467b-9b13-ccb0e38d4739", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.125, 83, 259, 85.0, 153.30000000000013, 259.0, 259.0, 0.08239395640329782, 0.06396796419982595, 0.029288476690234773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dec6855f-e385-4f7d-9414-05f46e7edd0a", 3, 0, 0.0, 339.0, 200, 519, 298.0, 519.0, 519.0, 519.0, 0.021436686745696584, 0.02533743801224749, 0.013746833622728605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5a76e68-eaa0-4e3f-be13-72bae2cd6822", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 83.58333333333333, 79, 95, 82.0, 94.4, 95.0, 95.0, 0.08419634587858886, 0.06257169845078724, 0.042262618927338555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e77d97b-8c27-4ddb-b61c-89cc38838324", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 118.99999999999997, 78, 242, 81.0, 239.60000000000002, 242.0, 242.0, 0.08419811817205886, 0.03306804348131153, 0.047429962075764276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 223.24999999999997, 79, 1010, 157.0, 780.8000000000009, 1010.0, 1010.0, 0.0841975273992787, 6.334226305851027, 0.04889595992197696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 166.5, 79, 468, 82.0, 400.80000000000024, 468.0, 468.0, 0.08419693663478878, 2.0838604777825336, 0.048977840418739434], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.45146726862302483], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.22573363431151242], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 12.5, 0.22573363431151242], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.9029345372460497], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 24, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
