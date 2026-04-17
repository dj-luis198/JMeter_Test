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

    var data = {"OkPercent": 98.37157660991858, "KoPercent": 1.6284233900814211};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.818674314850223, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3898305084745763, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cc8bc04-fb99-4e1f-8ac1-bce82579c1e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f451e63-ba71-4071-ac04-2be168eab6ec"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2756c065-f73e-4c4c-b7be-762fa754d2f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c027b0ec-ee39-4799-ab25-5bb6f4de5f27"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fadb2777-bd2b-4a51-8b4e-e860e99a772d"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=135868ce-68e9-493f-a465-b34e3e5fcf91"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96ebe767-8198-4d56-9a9b-b7320f6a0020"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f78c3c41-c89b-4586-9954-8c09c2818f8f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67f08ebf-6f63-4e23-8317-c2d401d5abf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa19269d-7f9d-4471-baa2-b89c64709524"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddff78b6-e9d0-417f-b03e-89354aa5e41c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb56dceb-161b-421b-9396-84ada550ae57"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c027b0ec-ee39-4799-ab25-5bb6f4de5f27"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2756c065-f73e-4c4c-b7be-762fa754d2f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f451e63-ba71-4071-ac04-2be168eab6ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa19269d-7f9d-4471-baa2-b89c64709524"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d10a53c3-de7a-42b7-a49c-f96a3803e8cd"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ad6f897b-c61c-4786-90a6-b2515e09fa76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/135868ce-68e9-493f-a465-b34e3e5fcf91"], "isController": false}, {"data": [0.35833333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/221de5f7-37a7-4388-a4a9-fcf63221ffe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/733b9295-4bf6-4824-973d-f3330f0d4c29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fadb2777-bd2b-4a51-8b4e-e860e99a772d"], "isController": false}, {"data": [0.7966101694915254, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9357541899441341, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96ebe767-8198-4d56-9a9b-b7320f6a0020"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67f08ebf-6f63-4e23-8317-c2d401d5abf0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad6f897b-c61c-4786-90a6-b2515e09fa76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddff78b6-e9d0-417f-b03e-89354aa5e41c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f78c3c41-c89b-4586-9954-8c09c2818f8f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb56dceb-161b-421b-9396-84ada550ae57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66f997f9-b799-4409-8f7d-5dd132ec7cd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 22, 1.6284233900814211, 296.281273131014, 77, 1856, 95.0, 859.5999999999999, 970.3999999999999, 1430.2000000000003, 5.302072949616571, 764.0476127548998, 3.8736233092529218], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1338.0508474576272, 990, 1736, 1318.0, 1553.0, 1584.0, 1736.0, 0.271407870828254, 326.5951097347448, 1.3345103804885343], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6cc8bc04-fb99-4e1f-8ac1-bce82579c1e2", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f451e63-ba71-4071-ac04-2be168eab6ec", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 528.6428571428572, 88, 1156, 417.0, 1010.5, 1156.0, 1156.0, 0.07676069852235655, 0.015120829563834745, 0.05164855593935905], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 528.6428571428572, 88, 1156, 417.0, 1010.5, 1156.0, 1156.0, 0.07736259849916559, 0.015239395798105721, 0.05205354527922372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 121.99999999999999, 79, 245, 82.0, 243.6, 245.0, 245.0, 0.07886435331230285, 0.035908696027208205, 0.0441494048205836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 103.24999999999999, 80, 240, 83.0, 239.3, 240.0, 240.0, 0.07892581959530787, 0.05865483272659109, 0.039617061789051014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 183.31250000000003, 80, 653, 82.0, 648.1, 653.0, 653.0, 0.07892737694728638, 2.9195229025049576, 0.04562988979764994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 207.31250000000003, 78, 887, 82.5, 765.2000000000002, 887.0, 887.0, 0.07886513076824496, 8.888972452040143, 0.04551688699612575], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 188.8, 82, 377, 183.0, 323.6, 377.0, 377.0, 0.07999189415472566, 0.1308304925100923, 0.0517030940864659], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 84.05000000000001, 79, 118, 83.0, 84.9, 116.34999999999998, 118.0, 0.09428936463111642, 0.0700724672698043, 0.04732884123085337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 98.45, 80, 245, 82.0, 227.80000000000032, 244.9, 245.0, 0.09428980915742625, 0.03939177769291695, 0.0529827697159991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 569.6, 481, 714, 490.0, 714.0, 714.0, 714.0, 0.04585809670555433, 13.48380306355015, 0.026153445777386455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 883.6, 717, 1071, 872.0, 1071.0, 1071.0, 1071.0, 0.045611282406816146, 41.04111208573553, 0.025968142229661928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 117.0, 82, 249, 85.0, 249.0, 249.0, 249.0, 0.04602610600732736, 0.08144463289577848, 0.025485158306791614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2756c065-f73e-4c4c-b7be-762fa754d2f3", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 82.76923076923076, 80, 86, 82.0, 85.6, 86.0, 86.0, 0.06402111711924671, 0.04757819348412769, 0.03213559980399689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 117.69230769230768, 77, 244, 81.0, 242.8, 244.0, 244.0, 0.06397071125589268, 0.017117162972768163, 0.0364832962631263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 130.76923076923077, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.0639710260460493, 0.017242190613974223, 0.037607966484103195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 129.30769230769232, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.06402174769521708, 0.017255861683476478, 0.03770030650411709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 83.0, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.04602525866195368, 0.03420431820483081, 0.02584426145568688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 170.7, 80, 1035, 82.0, 810.8000000000017, 1027.8, 1035.0, 0.09428980915742625, 8.507086247477748, 0.05462179178924342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 588.5882352941178, 81, 1088, 860.0, 1061.6, 1088.0, 1088.0, 0.08473435778833358, 44.858888867774525, 0.04553108816360709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 136.75, 78, 638, 82.0, 454.3000000000005, 629.9999999999999, 638.0, 0.09429158730458068, 2.7953588207422633, 0.05471490349256039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 399.52941176470597, 80, 788, 481.0, 734.4, 788.0, 788.0, 0.08466767935851781, 14.65357845456583, 0.04557794251313594], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 440.8461538461538, 85, 763, 495.0, 732.6, 763.0, 763.0, 0.07710511800048635, 0.014607805558685892, 0.05273753751460549], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 239.30769230769232, 162, 329, 169.0, 328.6, 329.0, 329.0, 0.06394396541123348, 0.09910065733166751, 0.1438114768965534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c027b0ec-ee39-4799-ab25-5bb6f4de5f27", 3, 0, 0.0, 350.6666666666667, 266, 421, 365.0, 421.0, 421.0, 421.0, 0.02556869028645456, 0.025643598558778156, 0.01639658849749853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fadb2777-bd2b-4a51-8b4e-e860e99a772d", 3, 0, 0.0, 373.3333333333333, 166, 602, 352.0, 602.0, 602.0, 602.0, 0.046667911144297185, 0.030002970218094702, 0.029927013331466613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 594.9545454545455, 113, 1476, 524.0, 1216.8, 1438.1999999999994, 1476.0, 0.10039702459727103, 0.06166965671062839, 0.045394357801305164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 82.99999999999999, 80, 86, 83.0, 86.0, 86.0, 86.0, 0.08473393544270989, 0.06297121569521702, 0.04253246368901649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 137.7058823529412, 77, 247, 83.0, 247.0, 247.0, 247.0, 0.08473520249221184, 0.0975369937694704, 0.04413940809968847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=135868ce-68e9-493f-a465-b34e3e5fcf91", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["login", 22, 0, 0.0, 2398.409090909091, 1301, 3183, 2394.0, 3017.4, 3159.5999999999995, 3183.0, 0.10126395831607243, 27.67298822029744, 0.1909487282167417], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 103.1, 82, 247, 87.0, 230.1000000000003, 246.9, 247.0, 0.09262432500023156, 0.07498590373553903, 0.032925053027426064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96ebe767-8198-4d56-9a9b-b7320f6a0020", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 682.0588235294117, 163, 1170, 944.0, 1144.4, 1170.0, 1170.0, 0.08463185144620898, 59.61231241754617, 0.17760145709911884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f78c3c41-c89b-4586-9954-8c09c2818f8f", 3, 0, 0.0, 329.3333333333333, 276, 424, 288.0, 424.0, 424.0, 424.0, 0.06520179956966812, 0.029502116341744364, 0.04181235193758014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67f08ebf-6f63-4e23-8317-c2d401d5abf0", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa19269d-7f9d-4471-baa2-b89c64709524", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 331.8125, 161, 971, 183.5, 847.1000000000001, 971.0, 971.0, 0.07883093720130466, 11.895551856591744, 0.17477142107545104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 635.25, 81, 1154, 877.5, 1154.0, 1154.0, 1154.0, 0.0629594069223868, 47.08215427907544, 0.10423809034281396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddff78b6-e9d0-417f-b03e-89354aa5e41c", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb56dceb-161b-421b-9396-84ada550ae57", 3, 0, 0.0, 381.0, 191, 526, 426.0, 526.0, 526.0, 526.0, 0.04857748919150866, 0.031799912358113254, 0.031151579982835954], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 923.5909090909093, 127, 1688, 905.0, 1587.3999999999999, 1678.85, 1688.0, 0.10106532035409614, 0.03195975418157763, 0.04559783008163321], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c027b0ec-ee39-4799-ab25-5bb6f4de5f27", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 272.49999999999994, 161, 1120, 167.5, 910.4000000000013, 1112.75, 1120.0, 0.09425203937850204, 11.407285667917076, 0.20956351880563814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 96.57142857142858, 82, 250, 86.0, 106.8, 235.6999999999998, 250.0, 0.11664722546242293, 0.09056107836193968, 0.04146444342609565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 313.9411764705882, 164, 872, 322.0, 826.4, 872.0, 872.0, 0.07935285413545065, 11.27717197076314, 0.17607782035213995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 101.88888888888887, 82, 235, 83.0, 235.0, 235.0, 235.0, 0.05065884644177891, 0.037647834123236086, 0.025428366280346056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 116.66666666666667, 78, 239, 83.0, 239.0, 239.0, 239.0, 0.050661127716702975, 0.022010325019279374, 0.028419925162256332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 189.11111111111111, 80, 891, 82.0, 891.0, 891.0, 891.0, 0.05066198324777087, 5.077220164665518, 0.02929995341912096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 196.77777777777777, 81, 640, 82.0, 640.0, 640.0, 640.0, 0.050661698067537675, 1.6672734050008724, 0.02934926280192965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 3.4696691176470584, 7.27251838235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2756c065-f73e-4c4c-b7be-762fa754d2f3", 3, 0, 0.0, 292.6666666666667, 161, 383, 334.0, 383.0, 383.0, 383.0, 0.0160621928105625, 0.02214302947680084, 0.01030029942604431], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 932.5932203389827, 639, 1394, 889.0, 1203.0, 1215.0, 1394.0, 0.2637071866912793, 315.4854747343932, 0.5207186830954754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 923.5909090909093, 127, 1688, 905.0, 1587.3999999999999, 1678.85, 1688.0, 0.10196042081846411, 0.032242810631691154, 0.04600167423645548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 108.16666666666667, 82, 239, 82.0, 239.0, 239.0, 239.0, 0.03299567756623883, 0.008893366219025306, 0.0194300718480879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 81.0, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.03302419021933566, 0.008901051270055315, 0.01941461182816413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f451e63-ba71-4071-ac04-2be168eab6ec", 3, 0, 0.0, 249.33333333333331, 171, 394, 183.0, 394.0, 394.0, 394.0, 0.025475110816732052, 0.02571559851649938, 0.016336578225573616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa19269d-7f9d-4471-baa2-b89c64709524", 3, 0, 0.0, 393.6666666666667, 187, 499, 495.0, 499.0, 499.0, 499.0, 0.031839021905247074, 0.02654288251931567, 0.020417601937935133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 113.28571428571432, 79, 244, 83.0, 242.6, 243.9, 244.0, 0.11852420433572827, 0.031945976949864265, 0.069679268564559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 90.3809523809524, 79, 242, 82.0, 90.6, 226.89999999999978, 242.0, 0.11863066320189809, 0.031974670941136596, 0.06985770499096147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 80.83333333333333, 78, 83, 81.5, 83.0, 83.0, 83.0, 0.03302419021933566, 0.008836550898533175, 0.01883410848446487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 84.95238095238095, 79, 98, 84.0, 89.0, 97.1, 98.0, 0.11862530221207944, 0.08815806150721921, 0.05954434114942269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 83.0, 81, 84, 83.5, 84.0, 84.0, 84.0, 0.0330234631705827, 0.02454185104766937, 0.016576230536796393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 111.85714285714286, 77, 244, 82.0, 239.4, 243.6, 244.0, 0.11852688020318894, 0.031715200366868916, 0.06759736136588118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 87.0, 83, 92, 86.0, 92.0, 92.0, 92.0, 0.03187132483785463, 0.025086218573545736, 0.011329260000956139], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 449.0, 81, 905, 401.0, 791.8, 905.0, 905.0, 0.07729123933529534, 0.014480495109842742, 0.05260356282885936], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d10a53c3-de7a-42b7-a49c-f96a3803e8cd", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1323.5454545454545, 750, 1856, 1282.5, 1788.3, 1847.1499999999999, 1856.0, 0.1010945785734636, 0.05232434242571846, 0.04649955713681773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 192.16666666666666, 164, 323, 166.5, 323.0, 323.0, 323.0, 0.03298008003166088, 0.05111268262719318, 0.07417297296183105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad6f897b-c61c-4786-90a6-b2515e09fa76", 3, 0, 0.0, 655.3333333333334, 183, 905, 878.0, 905.0, 905.0, 905.0, 0.039692515314695496, 0.025518462808113148, 0.025453859104801472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/135868ce-68e9-493f-a465-b34e3e5fcf91", 3, 0, 0.0, 284.6666666666667, 159, 399, 296.0, 399.0, 399.0, 399.0, 0.06315789473684211, 0.028577302631578948, 0.040501644736842105], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 876.8833333333336, 417, 1671, 715.0, 1550.8999999999999, 1579.1999999999998, 1671.0, 0.2786162061759926, 95.53556528616207, 1.010423619979104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/221de5f7-37a7-4388-a4a9-fcf63221ffe8", 2, 0, 0.0, 355.0, 333, 377, 355.0, 377.0, 377.0, 377.0, 0.04087221302597429, 0.03444601547013263, 0.025405433194367808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/733b9295-4bf6-4824-973d-f3330f0d4c29", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 146.69491525423732, 81, 332, 84.0, 327.0, 330.0, 332.0, 0.26453840290543873, 0.19659543419046766, 0.12787745062323455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fadb2777-bd2b-4a51-8b4e-e860e99a772d", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 519.7457627118644, 388, 732, 480.0, 648.0, 724.0, 732.0, 0.26436297484519083, 77.73149228138526, 0.13295598832546218], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 133.42372881355934, 78, 348, 86.0, 250.0, 251.0, 348.0, 0.2648376410597097, 0.4686384820314394, 0.12879799340599163], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 782.4406779661015, 547, 1113, 801.0, 930.0, 959.0, 1113.0, 0.2641321914465938, 237.6666101585129, 0.13258197890971604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 89.29411764705884, 82, 105, 86.0, 98.6, 105.0, 105.0, 0.08207445601533345, 0.06131538950364266, 0.02917490428670056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 11, 6.145251396648045, 143.30726256983237, 80, 524, 87.0, 287.0, 390.0, 496.7999999999996, 0.7322740586801066, 1.6204583795265992, 0.3502248022553223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 86.0, 83, 94, 85.0, 94.0, 94.0, 94.0, 0.05244296827200419, 0.04061257210908137, 0.01864183637793899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96ebe767-8198-4d56-9a9b-b7320f6a0020", 3, 0, 0.0, 303.6666666666667, 185, 486, 240.0, 486.0, 486.0, 486.0, 0.0199693802835652, 0.02752940283232377, 0.01280588514278107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 89.1875, 80, 111, 86.0, 106.10000000000001, 111.0, 111.0, 0.07971303308090873, 0.06468899461937026, 0.028335492227979275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67f08ebf-6f63-4e23-8317-c2d401d5abf0", 3, 0, 0.0, 323.0, 162, 622, 185.0, 622.0, 622.0, 622.0, 0.04692559165350143, 0.03016863395692231, 0.030092257668423772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 327.99999999999994, 165, 973, 178.0, 973.0, 973.0, 973.0, 0.050634905453379314, 6.800527130463647, 0.11243959853552601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad6f897b-c61c-4786-90a6-b2515e09fa76", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 214.4285714285714, 162, 334, 173.0, 328.4, 333.5, 334.0, 0.11846402924369179, 0.1835961078220106, 0.26642837826974824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 102.53846153846153, 84, 250, 92.0, 189.19999999999993, 250.0, 250.0, 0.0663129973474801, 0.054980209714854116, 0.02357219827586207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddff78b6-e9d0-417f-b03e-89354aa5e41c", 3, 0, 0.0, 287.0, 159, 401, 301.0, 401.0, 401.0, 401.0, 0.0803793907242183, 0.03636958108940867, 0.051545377515205104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 106.41176470588233, 82, 252, 87.0, 246.4, 252.0, 252.0, 0.08200714909382101, 0.06366765969686299, 0.029150978779444184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f78c3c41-c89b-4586-9954-8c09c2818f8f", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.1221370341614907, 4.282317546583851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb56dceb-161b-421b-9396-84ada550ae57", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.2367812090432503, 0.9036082896461337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66f997f9-b799-4409-8f7d-5dd132ec7cd9", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 83.5294117647059, 80, 92, 83.0, 89.6, 92.0, 92.0, 0.079441850901665, 0.05903832864860065, 0.03987608531587482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 138.1764705882353, 79, 244, 82.0, 243.2, 244.0, 244.0, 0.07938768743666497, 0.03527024210909736, 0.04449139927803903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 180.88235294117646, 80, 789, 83.0, 742.5999999999999, 789.0, 789.0, 0.07944630598043752, 8.429002969305687, 0.045902512956757846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 188.76470588235293, 81, 692, 84.0, 643.1999999999999, 692.0, 692.0, 0.07938768743666497, 2.7650702347540617, 0.04594617135365347], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.3700962250185048], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.14803849000740193], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07401924500370097], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0362694300518134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 22, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
