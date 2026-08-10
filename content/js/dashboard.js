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

    var data = {"OkPercent": 98.2985305491106, "KoPercent": 1.7014694508894044};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7182302062541583, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/1579020c-ba34-47df-bbc9-a2c510bd447c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c7b393e1-1c25-4495-aa89-703dc968ba30"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c024dfc1-5f63-4ec3-9415-2d2072f80789"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/131bde93-bd45-471f-8222-676d26235572"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c639102c-4eb7-4eec-893e-702398dc2288"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a60cdee-b513-4ecc-bbf8-40058168f347"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5acb8f8d-3d7a-4d8c-a9df-09e280eb4441"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c02bfe47-7326-4501-97d9-9bae4e08f5a4"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de2d982d-9e1c-4b91-aa84-11481050a66e"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56d81b28-1391-4a2b-a7ab-11c05d8f90c7"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=557e3edd-f397-4f19-b3ac-47ae0e1f8eb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e685dd2a-7891-4b64-aad5-ac3c8ca8d9fc"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/420f7141-da89-448d-ba92-14f4d110cebe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3854837-9b09-4e16-bd59-ec957c4ebaf7"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8adb4068-d6f8-4566-8a33-6ad051074fbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7b393e1-1c25-4495-aa89-703dc968ba30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65f79b98-5a5c-4e82-bcab-be634ad65380"], "isController": false}, {"data": [0.21929824561403508, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5acb8f8d-3d7a-4d8c-a9df-09e280eb4441"], "isController": false}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8911764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c02bfe47-7326-4501-97d9-9bae4e08f5a4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/de2d982d-9e1c-4b91-aa84-11481050a66e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3a60cdee-b513-4ecc-bbf8-40058168f347"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56d81b28-1391-4a2b-a7ab-11c05d8f90c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c639102c-4eb7-4eec-893e-702398dc2288"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/557e3edd-f397-4f19-b3ac-47ae0e1f8eb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=131bde93-bd45-471f-8222-676d26235572"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8adb4068-d6f8-4566-8a33-6ad051074fbf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1579020c-ba34-47df-bbc9-a2c510bd447c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=420f7141-da89-448d-ba92-14f4d110cebe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 22, 1.7014694508894044, 493.860015467904, 131, 4335, 165.0, 1367.4000000000005, 1602.7999999999997, 2356.8599999999956, 5.166461553214954, 739.519219771405, 3.77674429886162], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2284.7678571428573, 1654, 3158, 2205.0, 2753.7000000000003, 3088.65, 3158.0, 0.25411461476678177, 305.78568690215, 1.2494795755378383], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1579020c-ba34-47df-bbc9-a2c510bd447c", 3, 0, 0.0, 2094.6666666666665, 827, 4335, 1122.0, 4335.0, 4335.0, 4335.0, 0.025064331784914615, 0.025137762444440732, 0.016073155474050062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7b393e1-1c25-4495-aa89-703dc968ba30", 3, 0, 0.0, 570.6666666666666, 527, 599, 586.0, 599.0, 599.0, 599.0, 0.05944478570154755, 0.037675455000297224, 0.03812051687241168], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 560.0769230769232, 150, 923, 561.0, 813.3999999999999, 923.0, 923.0, 0.08495121839651308, 0.016094273797776892, 0.05742758521260676], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 560.0769230769232, 150, 923, 561.0, 813.3999999999999, 923.0, 923.0, 0.08470766083052603, 0.016048131055783253, 0.05726293868794349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 189.56249999999997, 132, 417, 140.5, 410.0, 417.0, 417.0, 0.08674014279596007, 0.039494718338492565, 0.0485583856033048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 190.87499999999997, 131, 419, 140.0, 416.2, 419.0, 419.0, 0.0868677655439008, 0.06455700154190284, 0.04360354637652833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c024dfc1-5f63-4ec3-9415-2d2072f80789", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 367.31249999999994, 134, 1130, 275.0, 1071.9, 1130.0, 1130.0, 0.08644069627980853, 3.197440511242693, 0.0499735275367643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 337.9375, 131, 1224, 139.5, 1200.2, 1224.0, 1224.0, 0.08635811631358792, 9.733514792200783, 0.04984145189583052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/131bde93-bd45-471f-8222-676d26235572", 3, 0, 0.0, 622.0, 341, 1111, 414.0, 1111.0, 1111.0, 1111.0, 0.030747471020508562, 0.025632901459479957, 0.019717616507292274], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 1071.4615384615383, 167, 4335, 414.0, 4147.4, 4335.0, 4335.0, 0.08478666371000353, 0.17363050175769276, 0.05480688410641379], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c639102c-4eb7-4eec-893e-702398dc2288", 3, 0, 0.0, 406.3333333333333, 298, 495, 426.0, 495.0, 495.0, 495.0, 0.021660649819494587, 0.0256021547833935, 0.013890455776173285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a60cdee-b513-4ecc-bbf8-40058168f347", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 173.12500000000003, 132, 418, 139.5, 414.5, 418.0, 418.0, 0.09515879624122754, 0.0707185975972404, 0.04776525514452243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 192.0, 131, 428, 140.0, 421.7, 428.0, 428.0, 0.09515709842217636, 0.03439455181006643, 0.05376980085403496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 957.3333333333334, 654, 1104, 1044.5, 1104.0, 1104.0, 1104.0, 0.040483371455174784, 11.903455382264235, 0.02308817278302937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1463.6666666666667, 1244, 1596, 1478.5, 1596.0, 1596.0, 1596.0, 0.04030145488252126, 36.263319945693794, 0.022945066598154196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5acb8f8d-3d7a-4d8c-a9df-09e280eb4441", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 281.66666666666663, 139, 433, 280.5, 433.0, 433.0, 433.0, 0.04059539918809202, 0.07183482746955344, 0.022478116542625166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 182.4375, 135, 531, 138.5, 452.6000000000001, 531.0, 531.0, 0.08735388697498948, 0.06491826951949903, 0.04384755654799277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 155.125, 131, 417, 139.5, 225.9000000000002, 417.0, 417.0, 0.08735531775496834, 0.023374372133653638, 0.04981982965713038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 239.24999999999997, 133, 418, 142.0, 417.3, 418.0, 418.0, 0.08722007806196987, 0.023508536665140318, 0.05127586620440026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 187.50000000000003, 132, 410, 137.5, 407.9, 410.0, 410.0, 0.08735674858181779, 0.023545373641193072, 0.05144152284651965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 231.66666666666666, 135, 429, 141.0, 429.0, 429.0, 429.0, 0.040666662148148645, 0.03022200185033313, 0.022835283921079565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c02bfe47-7326-4501-97d9-9bae4e08f5a4", 1, 0, 0.0, 867.0, 867, 867, 867.0, 867.0, 867.0, 867.0, 1.1534025374855825, 0.20837838811995388, 0.7952169838523645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 866.9444444444445, 133, 1693, 1241.5, 1582.3000000000002, 1693.0, 1693.0, 0.11342440893280234, 56.71329981930862, 0.06126591880072592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 308.8125, 135, 1196, 142.0, 658.4000000000005, 1196.0, 1196.0, 0.09515653249595585, 5.375420630902679, 0.05543053870491959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 655.3333333333334, 134, 1278, 828.5, 1258.2, 1278.0, 1278.0, 0.11341797674931477, 18.5406148593302, 0.061373204215368134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 227.12499999999997, 131, 1002, 141.0, 597.4000000000004, 1002.0, 1002.0, 0.09515596657646674, 1.772732890511166, 0.0555231347943739], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 497.3846153846154, 143, 935, 495.0, 907.8, 935.0, 935.0, 0.08478279300607175, 0.01606236508122844, 0.05798883190506936], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de2d982d-9e1c-4b91-aa84-11481050a66e", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.5735367063492064, 2.1887400793650795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 442.375, 274, 942, 294.5, 860.8000000000001, 942.0, 942.0, 0.08715498880603113, 0.13507321019059707, 0.19601361251981417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56d81b28-1391-4a2b-a7ab-11c05d8f90c7", 3, 0, 0.0, 1564.0, 673, 2161, 1858.0, 2161.0, 2161.0, 2161.0, 0.0186492938134076, 0.022042833931146807, 0.01195934531654068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 799.1818181818181, 179, 3843, 544.5, 1632.6999999999996, 3532.1999999999953, 3843.0, 0.0988084598006764, 0.060693868373657665, 0.044676090710657396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 139.94444444444443, 133, 151, 139.5, 149.2, 151.0, 151.0, 0.11341154529531107, 0.08428338473606613, 0.05692727957206044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 237.16666666666666, 133, 575, 140.5, 442.7000000000002, 575.0, 575.0, 0.11341869140034277, 0.12498700410827704, 0.059392209711160396], "isController": false}, {"data": ["login", 22, 0, 0.0, 3578.818181818182, 1964, 6493, 3399.5, 5697.799999999999, 6405.8499999999985, 6493.0, 0.09898896273065552, 32.43281440525631, 0.1941199571872736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=557e3edd-f397-4f19-b3ac-47ae0e1f8eb4", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 167.87499999999997, 139, 437, 145.0, 264.1000000000002, 437.0, 437.0, 0.09359188090433156, 0.07576920827118247, 0.0332689889152116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e685dd2a-7891-4b64-aad5-ac3c8ca8d9fc", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.7657936151079137, 1.430886540767386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1008.7777777777778, 274, 1831, 1382.0, 1728.4, 1831.0, 1831.0, 0.113309454414977, 75.38777013288681, 0.23872934856506167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/420f7141-da89-448d-ba92-14f4d110cebe", 3, 0, 0.0, 1642.6666666666665, 496, 3866, 566.0, 3866.0, 3866.0, 3866.0, 0.07289692374981775, 0.03379076152986344, 0.046747050711959955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3854837-9b09-4e16-bd59-ec957c4ebaf7", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.071597105704698, 2.002280830536913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 590.9375, 267, 1362, 543.5, 1335.4, 1362.0, 1362.0, 0.08629430673311328, 13.021770856929432, 0.19131801744223675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1310.375, 141, 1914, 1632.0, 1914.0, 1914.0, 1914.0, 0.053686230823949424, 48.174138629591845, 0.0996852120438348], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1209.0, 228, 2224, 1282.0, 1887.0000000000002, 2169.399999999999, 2224.0, 0.09959339912271206, 0.031224425064627456, 0.04493374061981736], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 501.50000000000006, 275, 1336, 406.5, 993.7000000000004, 1336.0, 1336.0, 0.09507906418431077, 7.24737033035518, 0.21231461439497032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 149.21052631578945, 136, 181, 144.0, 178.0, 181.0, 181.0, 0.1258444827129421, 0.09770152710623925, 0.04473378096436614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 474.17647058823536, 270, 1342, 305.0, 818.7999999999995, 1342.0, 1342.0, 0.08644844367375373, 6.209767307486944, 0.1931234792066067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8adb4068-d6f8-4566-8a33-6ad051074fbf", 3, 0, 0.0, 384.6666666666667, 268, 521, 365.0, 521.0, 521.0, 521.0, 0.019690336639122074, 0.023273311307503985, 0.01262694113902034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 172.875, 136, 403, 140.0, 403.0, 403.0, 403.0, 0.03596152117234559, 0.02672531016812011, 0.018050997932212532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 137.0, 133, 144, 136.0, 144.0, 144.0, 144.0, 0.035962329459890766, 0.009622732687509832, 0.02050976602009395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 172.75, 134, 415, 139.0, 415.0, 415.0, 415.0, 0.03596216779947495, 0.009692928039702235, 0.021141821303988204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 173.0, 133, 415, 139.5, 415.0, 415.0, 415.0, 0.03596119786750097, 0.00969266661272487, 0.021176369447366294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1576.5892857142856, 1064, 2549, 1506.0, 2160.4, 2473.65, 2549.0, 0.2496478182563883, 298.66558225895614, 0.4929569223773605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1209.0, 228, 2224, 1282.0, 1887.0000000000002, 2169.399999999999, 2224.0, 0.0991815367101053, 0.031095298363935868, 0.044747919882879544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 135.66666666666666, 131, 142, 134.0, 142.0, 142.0, 142.0, 0.0339097999321804, 0.009139750762970498, 0.019968368514750763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7b393e1-1c25-4495-aa89-703dc968ba30", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 137.33333333333334, 136, 138, 138.0, 138.0, 138.0, 138.0, 0.03390903336648884, 0.009139544149561444, 0.019934802818970976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 204.7894736842105, 132, 1125, 139.0, 416.0, 1125.0, 1125.0, 0.12096902556266514, 5.7597384542227745, 0.07056940995766084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 230.10526315789477, 133, 1079, 140.0, 411.0, 1079.0, 1079.0, 0.12096979575205012, 1.90294889742398, 0.070687993827357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 0.03390941664500231, 0.00907341812571351, 0.019338964180352882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 184.94736842105263, 135, 423, 141.0, 418.0, 423.0, 423.0, 0.12075529257736282, 0.08974099380016906, 0.06061349646949658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 144.0, 133, 163, 136.0, 163.0, 163.0, 163.0, 0.033899071165450066, 0.02519257144229248, 0.017015744706095053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 208.89473684210532, 133, 422, 140.0, 414.0, 422.0, 422.0, 0.12097287660766586, 0.04193262129122628, 0.06845761572010696], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 622.1538461538462, 141, 1111, 586.0, 998.1999999999999, 1111.0, 1111.0, 0.08460347004386365, 0.015850439775345247, 0.05758018619271369], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 143.33333333333334, 140, 147, 143.0, 147.0, 147.0, 147.0, 0.03512962832853229, 0.027650859797653343, 0.012487485069907961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1917.8181818181818, 1264, 3378, 1722.5, 2950.0, 3316.949999999999, 3378.0, 0.0983996636520588, 0.05092951341366324, 0.04526000154308563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 283.3333333333333, 272, 305, 273.0, 305.0, 305.0, 305.0, 0.033846674564224064, 0.05245573489592147, 0.07612196437637501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65f79b98-5a5c-4e82-bcab-be634ad65380", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1524.7719298245615, 706, 3365, 1268.0, 2528.2, 2671.999999999998, 3365.0, 0.26953158248139286, 85.92452399008407, 0.978765189227721], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5acb8f8d-3d7a-4d8c-a9df-09e280eb4441", 3, 0, 0.0, 484.33333333333337, 232, 829, 392.0, 829.0, 829.0, 829.0, 0.051366344770906104, 0.033023610326347506, 0.03294000624957195], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 261.69642857142867, 133, 818, 142.5, 558.5, 581.1999999999999, 818.0, 0.25142662158946527, 0.18685122952107716, 0.12153923602225125], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 879.3928571428573, 652, 1278, 819.0, 1132.3000000000002, 1244.6, 1278.0, 0.2514627498349776, 73.93839780059902, 0.12646808219239594], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 177.26785714285717, 131, 544, 140.0, 410.1, 421.0, 544.0, 0.25191183085919927, 0.44576585695006743, 0.12251180836707151], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1310.8928571428573, 919, 1985, 1358.0, 1612.1000000000001, 1754.8499999999997, 1985.0, 0.2505917993833652, 225.48294157854934, 0.1257853367998532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 164.2941176470588, 138, 407, 147.0, 220.59999999999985, 407.0, 407.0, 0.08815781285652056, 0.06586008480003733, 0.03133734753884129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 264.1058823529412, 134, 2795, 149.0, 414.9, 589.2999999999998, 2537.9799999999973, 0.717172484201112, 1.5875062818508956, 0.3429392918765451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 221.375, 145, 413, 159.5, 413.0, 413.0, 413.0, 0.03817012424375441, 0.029559480981735595, 0.013568286352272077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c02bfe47-7326-4501-97d9-9bae4e08f5a4", 3, 0, 0.0, 470.6666666666667, 243, 652, 517.0, 652.0, 652.0, 652.0, 0.01834615525739656, 0.025291656092146623, 0.011764949823265371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de2d982d-9e1c-4b91-aa84-11481050a66e", 3, 0, 0.0, 603.6666666666666, 223, 1061, 527.0, 1061.0, 1061.0, 1061.0, 0.07713073659853452, 0.034899649697904614, 0.04946209345674251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 146.25, 136, 167, 145.0, 160.0, 167.0, 167.0, 0.08867999822640005, 0.07196589699818205, 0.03152296811954064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 348.125, 271, 818, 281.5, 818.0, 818.0, 818.0, 0.035938742413556095, 0.055698031455384295, 0.08082707400236297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a60cdee-b513-4ecc-bbf8-40058168f347", 3, 0, 0.0, 496.3333333333333, 260, 688, 541.0, 688.0, 688.0, 688.0, 0.01632066849458154, 0.02249935907374766, 0.010466053689559125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56d81b28-1391-4a2b-a7ab-11c05d8f90c7", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c639102c-4eb7-4eec-893e-702398dc2288", 1, 0, 0.0, 935.0, 935, 935, 935.0, 935.0, 935.0, 935.0, 1.0695187165775402, 0.19322359625668448, 0.7373830213903743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 463.63157894736844, 276, 1549, 285.0, 831.0, 1549.0, 1549.0, 0.12064717685606158, 7.773768386788499, 0.26971365940349495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/557e3edd-f397-4f19-b3ac-47ae0e1f8eb4", 3, 0, 0.0, 392.6666666666667, 301, 542, 335.0, 542.0, 542.0, 542.0, 0.06621201085876978, 0.029959210642477214, 0.04246017623430224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 150.25, 138, 176, 147.5, 173.2, 176.0, 176.0, 0.08915437079302813, 0.07391802812820399, 0.031691592742834215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=131bde93-bd45-471f-8222-676d26235572", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8adb4068-d6f8-4566-8a33-6ad051074fbf", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1579020c-ba34-47df-bbc9-a2c510bd447c", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 177.38888888888886, 134, 425, 145.0, 421.4, 425.0, 425.0, 0.11809551302659117, 0.09168548130482419, 0.04197926439617108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=420f7141-da89-448d-ba92-14f4d110cebe", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 140.64705882352942, 134, 166, 140.0, 148.39999999999998, 166.0, 166.0, 0.08650783150309901, 0.06428951149790854, 0.043422876359953996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 184.3529411764706, 132, 414, 138.0, 412.4, 414.0, 414.0, 0.08651135334290047, 0.03079183968937335, 0.04891111785390777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 288.17647058823525, 133, 1208, 142.0, 675.9999999999995, 1208.0, 1208.0, 0.08651179359303834, 4.60097329743518, 0.05042214256634691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 310.3529411764706, 135, 1117, 141.0, 665.7999999999996, 1117.0, 1117.0, 0.08651179359303834, 1.5182601110658762, 0.05050662673977761], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5413766434648105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07733952049497293], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07733952049497293], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 1.005413766434648], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 22, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
