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

    var data = {"OkPercent": 96.875, "KoPercent": 3.125};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8072139303482587, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4830508474576271, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49c61c94-becd-4e5c-bc52-ea97992c32a8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=927be769-ecb7-410d-89ec-e00c15ffcf03"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/194bf6f2-034d-4acb-a90c-a2ee2759bcec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13b43f1b-535a-477f-a06c-25995f8cbdb1"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae17fc9a-4914-4edd-b773-226a29e6bffe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b05a81d7-78c9-49d6-946d-59223f8a40e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8269230769230769, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.057692307692307696, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7d755b8-10d8-4d57-919e-43ee17a7bc1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d2d5506-a008-4eea-ad71-3d999773f7b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93ec4752-c844-4c60-890a-f1f1166b57ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d33b856-69c5-4d3a-a625-51e23ddc0e03"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3705667e-7a57-4f0e-8b3e-126fb45ce83b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/115f0ed7-0e6d-43c6-9c3f-f90a217b6c00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c598cd96-c79d-4acb-b6af-e1b6264c57ec"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "register"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49c61c94-becd-4e5c-bc52-ea97992c32a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d21e9c1-54d7-4b4f-9008-525a0a1901a4"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69abab27-ce55-447a-8f4c-e121e1ac3c97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/927be769-ecb7-410d-89ec-e00c15ffcf03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b05a81d7-78c9-49d6-946d-59223f8a40e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13b43f1b-535a-477f-a06c-25995f8cbdb1"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "addBook"], "isController": true}, {"data": [0.9830508474576272, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.847457627118644, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9017341040462428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae17fc9a-4914-4edd-b773-226a29e6bffe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7d755b8-10d8-4d57-919e-43ee17a7bc1f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=115f0ed7-0e6d-43c6-9c3f-f90a217b6c00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c598cd96-c79d-4acb-b6af-e1b6264c57ec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d2d5506-a008-4eea-ad71-3d999773f7b3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=194bf6f2-034d-4acb-a90c-a2ee2759bcec"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d21e9c1-54d7-4b4f-9008-525a0a1901a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d33b856-69c5-4d3a-a625-51e23ddc0e03"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1376, 43, 3.125, 268.09738372093045, 78, 2625, 92.0, 679.6999999999987, 837.2999999999997, 1283.5300000000002, 5.476813099772728, 793.9812668351801, 4.012258927931747], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1192.0, 950, 1973, 1154.0, 1383.0, 1497.0, 1973.0, 0.25670031326139925, 308.89722622938785, 1.2621934348351027], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/49c61c94-becd-4e5c-bc52-ea97992c32a8", 3, 0, 0.0, 438.6666666666667, 164, 798, 354.0, 798.0, 798.0, 798.0, 0.1220156993533168, 0.05520892646520519, 0.07824574470248505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=927be769-ecb7-410d-89ec-e00c15ffcf03", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 426.6875, 82, 1143, 397.0, 930.9000000000002, 1143.0, 1143.0, 0.09372235922608761, 0.019609390101747334, 0.06258072570394278], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 426.6875, 82, 1143, 397.0, 930.9000000000002, 1143.0, 1143.0, 0.09514464960009515, 0.019906973805488656, 0.06353042398834478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 107.78947368421053, 79, 247, 83.0, 245.0, 247.0, 247.0, 0.0844658424578671, 0.02260121175142147, 0.04817192577675233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 100.73684210526315, 80, 247, 83.0, 243.0, 247.0, 247.0, 0.08446471597627875, 0.06277114146283998, 0.04239732813653055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 114.84210526315789, 79, 245, 82.0, 238.0, 245.0, 245.0, 0.08440693025322078, 0.022750305419813415, 0.04970447162372279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 119.42105263157895, 79, 320, 82.0, 244.0, 320.0, 320.0, 0.08437619347905251, 0.02274202089865087, 0.049603973119521104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/194bf6f2-034d-4acb-a90c-a2ee2759bcec", 3, 0, 0.0, 631.0, 263, 906, 724.0, 906.0, 906.0, 906.0, 0.04382761139517896, 0.0281769311541271, 0.02810559715120526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13b43f1b-535a-477f-a06c-25995f8cbdb1", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 176.875, 79, 288, 179.0, 272.6, 288.0, 288.0, 0.09384659600800042, 0.14483100464247378, 0.06064744619950613], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae17fc9a-4914-4edd-b773-226a29e6bffe", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 99.8421052631579, 80, 244, 82.0, 238.0, 244.0, 244.0, 0.0903179190751445, 0.06712103165643064, 0.045335361723265896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 105.89473684210526, 78, 244, 81.0, 244.0, 244.0, 244.0, 0.090319636439695, 0.04558690531649902, 0.05031271688596908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 477.8181818181818, 387, 629, 408.0, 618.6, 629.0, 629.0, 0.07627130396194755, 22.42629581045194, 0.04349847804079821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 662.6363636363636, 545, 729, 724.0, 729.0, 729.0, 729.0, 0.07609349815646206, 68.4690633992868, 0.04332276311056386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 170.0909090909091, 82, 249, 237.0, 247.6, 249.0, 249.0, 0.07635124348411547, 0.1351059113215012, 0.04227651860888034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 96.16666666666667, 80, 250, 82.5, 200.80000000000018, 250.0, 250.0, 0.08427321375900669, 0.06262882389707432, 0.04230120300012641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 94.25, 79, 236, 82.0, 190.10000000000016, 236.0, 236.0, 0.0842761730189832, 0.022550460358595113, 0.04806375492488886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 115.33333333333334, 79, 334, 82.0, 305.2000000000001, 334.0, 334.0, 0.0842767648959182, 0.02271522178835295, 0.049545519987639404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 116.08333333333334, 79, 338, 82.0, 308.3000000000001, 338.0, 338.0, 0.08427558115036168, 0.022714902731933426, 0.049627124446941506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b05a81d7-78c9-49d6-946d-59223f8a40e9", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 96.72727272727272, 79, 239, 82.0, 209.4000000000001, 239.0, 239.0, 0.0764302886285627, 0.056800243795250206, 0.04291739839982769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 414.7368421052631, 78, 788, 566.0, 736.0, 788.0, 788.0, 0.08745845723281441, 41.42973108538247, 0.04746023804811136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 182.9473684210526, 79, 718, 82.0, 569.0, 718.0, 718.0, 0.0903179190751445, 12.852324371755685, 0.05187152691949346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 325.8947368421052, 78, 637, 398.0, 572.0, 637.0, 637.0, 0.08745724951553287, 13.5455528563998, 0.04754499013804436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 182.6842105263158, 79, 568, 82.0, 561.0, 568.0, 568.0, 0.09025013537520306, 4.210463835227003, 0.051920732177973265], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 294.68749999999994, 82, 792, 241.5, 591.1000000000003, 792.0, 792.0, 0.09536809102884289, 0.01995372412395468, 0.06405215293465498], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 226.41666666666669, 163, 589, 167.0, 508.0000000000003, 589.0, 589.0, 0.084224711530363, 0.1305318527330919, 0.1894233502484629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 26, 0, 0.0, 426.26923076923083, 87, 1037, 379.5, 843.6, 974.6999999999997, 1037.0, 0.11025545340434915, 0.06772527362435118, 0.049851830982630525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 82.1578947368421, 79, 87, 82.0, 85.0, 87.0, 87.0, 0.08745765208425395, 0.06499538401964575, 0.04389964176885403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 107.68421052631578, 78, 252, 82.0, 248.0, 252.0, 252.0, 0.08745845723281441, 0.09253802429043573, 0.0460127861962936], "isController": false}, {"data": ["login", 26, 0, 0.0, 2135.153846153847, 1187, 3906, 2045.5, 3072.7000000000003, 3667.999999999999, 3906.0, 0.11083875093253757, 56.24658208328893, 0.2449909410636257], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 98.05263157894736, 83, 266, 86.0, 109.0, 266.0, 266.0, 0.09350393700787402, 0.07569801150344489, 0.033237727608267716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7d755b8-10d8-4d57-919e-43ee17a7bc1f", 3, 0, 0.0, 265.0, 204, 377, 214.0, 377.0, 377.0, 377.0, 0.1228551537737008, 0.055588757729636756, 0.0787840667103485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d2d5506-a008-4eea-ad71-3d999773f7b3", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93ec4752-c844-4c60-890a-f1f1166b57ad", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d33b856-69c5-4d3a-a625-51e23ddc0e03", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 498.4736842105263, 162, 873, 651.0, 817.0, 873.0, 873.0, 0.0874242514873626, 55.11144201557762, 0.1848463935770783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3705667e-7a57-4f0e-8b3e-126fb45ce83b", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/115f0ed7-0e6d-43c6-9c3f-f90a217b6c00", 3, 0, 0.0, 253.0, 179, 389, 191.0, 389.0, 389.0, 389.0, 0.03721114846007864, 0.031021403387454884, 0.02386261799034991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 246.73684210526315, 162, 488, 170.0, 485.0, 488.0, 488.0, 0.08434435580888457, 0.13071727799677715, 0.18969243303502067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 8, 42.10526315789474, 478.31578947368416, 79, 968, 643.0, 810.0, 968.0, 968.0, 0.13135063013736512, 90.99117768802151, 0.20811810625229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c598cd96-c79d-4acb-b6af-e1b6264c57ec", 3, 0, 0.0, 255.33333333333331, 168, 392, 206.0, 392.0, 392.0, 392.0, 0.06314194308806197, 0.029268921535612055, 0.04049141532665432], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 783.1923076923075, 87, 1376, 873.5, 1330.0, 1367.25, 1376.0, 0.10611378662966289, 0.0328257642233287, 0.04787555607705493], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 310.0, 162, 813, 171.0, 804.0, 813.0, 813.0, 0.09021499658132644, 17.15908153417724, 0.19925105972944998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 103.3076923076923, 82, 284, 87.0, 208.79999999999993, 284.0, 284.0, 0.07631033652858409, 0.059244841347875346, 0.027125939937895128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49c61c94-becd-4e5c-bc52-ea97992c32a8", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 207.6842105263158, 162, 328, 167.0, 326.0, 328.0, 328.0, 0.10880831982773925, 0.16863164410802947, 0.24471246148758152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 84.16666666666667, 81, 89, 84.0, 89.0, 89.0, 89.0, 0.02770185417743961, 0.020587022489288617, 0.013905032272660116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 109.5, 80, 245, 83.0, 245.0, 245.0, 245.0, 0.027702109977376613, 0.0074124786462902255, 0.0157988595964726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 109.5, 79, 246, 82.5, 246.0, 246.0, 246.0, 0.027702109977376613, 0.007466584329839789, 0.016285810748418672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 108.5, 81, 234, 83.0, 234.0, 234.0, 234.0, 0.02770236578203779, 0.007466653277189872, 0.01631301422516483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 85.0, 82, 89, 84.5, 89.0, 89.0, 89.0, 0.03874617381533573, 0.011427094230694719, 0.023951492212019063], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 775.9999999999999, 620, 1628, 651.0, 1038.0, 1144.0, 1628.0, 0.25372633679375917, 303.544908352112, 0.5010104033173644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d21e9c1-54d7-4b4f-9008-525a0a1901a4", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 783.1923076923075, 87, 1376, 873.5, 1330.0, 1367.25, 1376.0, 0.11092954693813117, 0.034315495364424894, 0.05004829168497715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69abab27-ce55-447a-8f4c-e121e1ac3c97", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 115.22222222222223, 79, 241, 80.0, 241.0, 241.0, 241.0, 0.05521404645341775, 0.014881910958147752, 0.03251374024551846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 115.88888888888889, 79, 241, 81.0, 241.0, 241.0, 241.0, 0.05521336899707983, 0.014881728362494172, 0.03245942200804888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 137.0, 78, 329, 83.0, 295.0, 329.0, 329.0, 0.07374756774848676, 0.019877274119709323, 0.043355503695887726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 105.99999999999999, 79, 244, 82.0, 240.8, 244.0, 244.0, 0.07374673103432626, 0.019877048599095754, 0.04342703009150268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 107.0, 80, 247, 83.0, 242.6, 247.0, 247.0, 0.07374547599868393, 0.05480498753417819, 0.03701677213215189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 80.33333333333333, 78, 85, 80.0, 85.0, 85.0, 85.0, 0.05521472392638037, 0.014774252300613498, 0.031489647239263806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 143.15384615384616, 81, 246, 83.0, 246.0, 246.0, 246.0, 0.07374673103432626, 0.019733012015044335, 0.0420586825430142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 83.44444444444444, 80, 100, 81.0, 100.0, 100.0, 100.0, 0.05521370772317074, 0.041032843337239194, 0.02771469313448219], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 407.56250000000006, 80, 1244, 390.5, 880.0000000000003, 1244.0, 1244.0, 0.09665804799072082, 0.019562871529371962, 0.06576806146243626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 103.1111111111111, 82, 240, 88.0, 240.0, 240.0, 240.0, 0.05295238991786496, 0.04167932253300699, 0.01882291985361606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 26, 0, 0.0, 1176.923076923077, 782, 2625, 1048.5, 1771.1000000000001, 2347.449999999999, 2625.0, 0.10902381751090238, 0.05642834304763503, 0.05014669731214358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/927be769-ecb7-410d-89ec-e00c15ffcf03", 3, 0, 0.0, 340.6666666666667, 266, 473, 283.0, 473.0, 473.0, 473.0, 0.016355547801814377, 0.022547443014545532, 0.010488420953637473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 201.0, 161, 325, 163.0, 325.0, 325.0, 325.0, 0.055185607593539604, 0.08552691333100326, 0.12411372489054853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b05a81d7-78c9-49d6-946d-59223f8a40e9", 3, 0, 0.0, 307.66666666666663, 161, 596, 166.0, 596.0, 596.0, 596.0, 0.023076035537094728, 0.02727509278489289, 0.01479810872658744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13b43f1b-535a-477f-a06c-25995f8cbdb1", 3, 0, 0.0, 303.3333333333333, 183, 449, 278.0, 449.0, 449.0, 449.0, 0.1208118556701031, 0.054664218548646906, 0.07747374859052834], "isController": false}, {"data": ["addBook", 57, 16, 28.07017543859649, 770.9649122807017, 417, 2051, 678.0, 1234.8000000000002, 1416.2999999999997, 2051.0, 0.2670677368117735, 73.98485067780152, 0.970907077119323], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 157.9830508474576, 80, 730, 84.0, 332.0, 339.0, 730.0, 0.25433007733358626, 0.1890089734871671, 0.12294276199230975], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 454.3728813559324, 389, 667, 405.0, 569.0, 582.0, 667.0, 0.2547528681286891, 74.90580182115917, 0.12812278035769029], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 132.79661016949154, 79, 355, 84.0, 245.0, 274.0, 355.0, 0.255088805492624, 0.4513876128443699, 0.12405686048371756], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 612.9322033898306, 539, 853, 563.0, 725.0, 785.0, 853.0, 0.2545736969278564, 229.06585998851182, 0.12778406271574042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 95.73684210526316, 83, 241, 86.0, 104.0, 241.0, 241.0, 0.10513443374040649, 0.07854281426895601, 0.03737200574366012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 16, 9.248554913294798, 136.50289017341035, 80, 1087, 88.0, 258.5999999999999, 331.29999999999995, 693.3199999999952, 0.7178482808985966, 1.6567418998290442, 0.34035714248665966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 86.66666666666667, 83, 93, 85.5, 93.0, 93.0, 93.0, 0.027768136063866713, 0.021504035057271782, 0.00987070461645262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae17fc9a-4914-4edd-b773-226a29e6bffe", 3, 0, 0.0, 250.66666666666669, 178, 395, 179.0, 395.0, 395.0, 395.0, 0.020442651548190145, 0.02416252206102813, 0.01310938266599433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 96.05263157894736, 81, 255, 86.0, 110.0, 255.0, 255.0, 0.08793731457954393, 0.07136319181211036, 0.03125896729194726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7d755b8-10d8-4d57-919e-43ee17a7bc1f", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=115f0ed7-0e6d-43c6-9c3f-f90a217b6c00", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 220.83333333333331, 165, 336, 169.5, 336.0, 336.0, 336.0, 0.027691242644513673, 0.04291601765316718, 0.06227825372101073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c598cd96-c79d-4acb-b6af-e1b6264c57ec", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d2d5506-a008-4eea-ad71-3d999773f7b3", 3, 0, 0.0, 485.0, 244, 836, 375.0, 836.0, 836.0, 836.0, 0.01966555447030829, 0.027110554421144406, 0.012611048927899523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 283.2307692307692, 165, 565, 318.0, 536.1999999999999, 565.0, 565.0, 0.07371118822435418, 0.1142379450312989, 0.16577818992254656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=194bf6f2-034d-4acb-a90c-a2ee2759bcec", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d21e9c1-54d7-4b4f-9008-525a0a1901a4", 3, 0, 0.0, 563.3333333333333, 191, 1244, 255.0, 1244.0, 1244.0, 1244.0, 0.0901361055193342, 0.04078424045308415, 0.05780212495868762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 102.75, 83, 245, 85.0, 210.80000000000013, 245.0, 245.0, 0.08979549076977185, 0.07444958170267216, 0.031919490859567336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 95.52631578947367, 81, 270, 85.0, 92.0, 270.0, 270.0, 0.08684404181312076, 0.06742286449358498, 0.030870342988257773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 81.57894736842104, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.10886131069018071, 0.08090181390158938, 0.05464327509253212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 114.21052631578948, 78, 241, 82.0, 238.0, 241.0, 241.0, 0.10886255815552448, 0.029129239193958698, 0.06208567769807256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 99.26315789473684, 79, 242, 82.0, 235.0, 242.0, 242.0, 0.10885943954576967, 0.02934102081507073, 0.06399744395171224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 115.8421052631579, 79, 246, 82.0, 245.0, 246.0, 246.0, 0.10885943954576967, 0.02934102081507073, 0.06410375199814365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d33b856-69c5-4d3a-a625-51e23ddc0e03", 3, 0, 0.0, 315.0, 232, 425, 288.0, 425.0, 425.0, 425.0, 0.02679695943833573, 0.026875466155440227, 0.01718424807731816], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 25.58139534883721, 0.7994186046511628], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.30232558139535, 0.29069767441860467], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.30232558139535, 0.29069767441860467], "isController": false}, {"data": ["401/Unauthorized", 24, 55.81395348837209, 1.744186046511628], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1376, 43, "401/Unauthorized", 24, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
