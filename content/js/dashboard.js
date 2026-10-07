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

    var data = {"OkPercent": 98.40891010342084, "KoPercent": 1.5910898965791567};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7428571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02830188679245283, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d8004f35-eaff-4deb-8cb3-3d1409d9e532"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71ec79f4-d01a-4445-9abf-60f61f5b14ac"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d115954f-4967-4b4b-959d-7997d4a727e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e827d19d-a23c-4954-8f1f-c4accb74cbe2"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be721b27-f4a2-46f1-8da1-b815dc69ed19"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d15cd867-03b1-43a7-b0ce-58e08396ab0a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/011f659d-b2f0-40b0-8ff9-f9388ace239e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c68abc3-f6d0-461a-a60b-d9e34f89e00f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10f9d4fc-566d-40c8-b483-d66a4608bd69"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/05e77e9b-ea26-4366-91f3-02032e07a668"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8004f35-eaff-4deb-8cb3-3d1409d9e532"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc245b56-50bd-4207-99da-3e19602e0d40"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6deab9bf-250b-4c8a-898a-e7bf37a40b59"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5207266c-6644-43c9-9263-80468aa93659"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a4c4b9a-e5be-4093-8eba-a2adfb40e271"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3490566037735849, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/10f9d4fc-566d-40c8-b483-d66a4608bd69"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71ec79f4-d01a-4445-9abf-60f61f5b14ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=011f659d-b2f0-40b0-8ff9-f9388ace239e"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9101796407185628, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d115954f-4967-4b4b-959d-7997d4a727e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6988e47-2c0f-4f37-a698-3810e6d5ba3e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be721b27-f4a2-46f1-8da1-b815dc69ed19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b6988e47-2c0f-4f37-a698-3810e6d5ba3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c68abc3-f6d0-461a-a60b-d9e34f89e00f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05e77e9b-ea26-4366-91f3-02032e07a668"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d15cd867-03b1-43a7-b0ce-58e08396ab0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc245b56-50bd-4207-99da-3e19602e0d40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a4c4b9a-e5be-4093-8eba-a2adfb40e271"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6deab9bf-250b-4c8a-898a-e7bf37a40b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1652496-6e15-41fc-8b63-5474f33e5367"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1257, 20, 1.5910898965791567, 457.875099443119, 109, 5726, 161.0, 1210.2, 1463.2999999999997, 2345.7200000000194, 4.914552470764864, 686.0812275067345, 3.5856430776945003], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1988.2075471698104, 1483, 2514, 2009.0, 2303.0, 2459.7, 2514.0, 0.23821295339116363, 286.6489917735067, 1.1712912307856533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d8004f35-eaff-4deb-8cb3-3d1409d9e532", 3, 0, 0.0, 766.0, 425, 1293, 580.0, 1293.0, 1293.0, 1293.0, 0.03960134644577916, 0.025459850009900337, 0.025395394693419577], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 870.9333333333334, 117, 1694, 851.0, 1669.4, 1694.0, 1694.0, 0.08477737461426293, 0.016607755222286278, 0.0570812244961398], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 870.9333333333334, 117, 1694, 851.0, 1669.4, 1694.0, 1694.0, 0.0826683126846259, 0.016194593285679643, 0.05566117772033861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 138.00000000000003, 111, 366, 123.0, 227.4000000000001, 366.0, 366.0, 0.07192209398779242, 0.026446353310094504, 0.04061538041992913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 155.86666666666665, 115, 381, 124.0, 354.0, 381.0, 381.0, 0.07191554238702068, 0.05344504663722924, 0.03609823123723499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 258.73333333333335, 111, 886, 123.0, 569.8000000000002, 886.0, 886.0, 0.07184080078545942, 1.4263111694485022, 0.04189310238511459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 254.46666666666664, 111, 1448, 124.0, 791.6000000000004, 1448.0, 1448.0, 0.07183804830390368, 4.327405235137905, 0.04182134296442101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71ec79f4-d01a-4445-9abf-60f61f5b14ac", 3, 0, 0.0, 474.0, 226, 714, 482.0, 714.0, 714.0, 714.0, 0.06568432115254089, 0.029078996343572788, 0.04212178146826352], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 524.8666666666667, 113, 3033, 278.0, 1747.8000000000006, 3033.0, 3033.0, 0.08444471967167894, 0.16564029680911552, 0.05458119641278831], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d115954f-4967-4b4b-959d-7997d4a727e1", 3, 0, 0.0, 1315.3333333333333, 215, 3033, 698.0, 3033.0, 3033.0, 3033.0, 0.02908949869097256, 0.02917472183166877, 0.018654398574614563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 118.66666666666667, 111, 129, 119.0, 126.0, 129.0, 129.0, 0.08129244142879595, 0.0604136210227673, 0.040804995014063594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 119.73333333333335, 112, 128, 121.0, 128.0, 128.0, 128.0, 0.08129332256648439, 0.02175231482736008, 0.04636259802619813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 829.8, 598, 984, 886.0, 984.0, 984.0, 984.0, 0.06647875339041642, 19.546960799141093, 0.03791366404297186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1285.8, 1008, 1620, 1341.0, 1620.0, 1620.0, 1620.0, 0.06614369055335811, 59.51620902811768, 0.03765798007090603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 212.0, 110, 366, 131.0, 366.0, 366.0, 366.0, 0.06725673239891314, 0.11901288975276425, 0.03724078834978881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 146.0, 112, 393, 124.0, 340.6000000000002, 393.0, 393.0, 0.06900921586710079, 0.05128516921373409, 0.03463939155829083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 178.81818181818184, 109, 352, 123.0, 349.2, 352.0, 352.0, 0.06891237478308264, 0.018439444033754537, 0.03930158874347682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 162.9090909090909, 112, 362, 121.0, 361.6, 362.0, 362.0, 0.06900921586710079, 0.018600140214179512, 0.04056987104686981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 159.09090909090912, 112, 344, 122.0, 341.6, 344.0, 344.0, 0.06900878293601004, 0.018600023525721456, 0.04063700792032622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 162.4, 117, 330, 122.0, 330.0, 330.0, 330.0, 0.06725040013988083, 0.049978080572704406, 0.03776267585979636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 769.8235294117648, 112, 1424, 1076.0, 1342.3999999999999, 1424.0, 1424.0, 0.10063399416322834, 53.27625391066661, 0.05407458532874758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 160.66666666666666, 112, 354, 115.0, 347.4, 354.0, 354.0, 0.08129993170805737, 0.021912872218187336, 0.04779546766430716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 622.8235294117648, 112, 1099, 882.0, 998.1999999999999, 1099.0, 1099.0, 0.10062922864736558, 17.4160707837833, 0.05417029536158449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 167.26666666666665, 113, 368, 124.0, 353.0, 368.0, 368.0, 0.08129772854146455, 0.021912278395941617, 0.047873564756350705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e827d19d-a23c-4954-8f1f-c4accb74cbe2", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.5935612221189591, 1.1090700511152416], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 715.0, 120, 1978, 753.0, 1472.2000000000003, 1978.0, 1978.0, 0.0830284344711919, 0.01626514058097763, 0.056455011042781784], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be721b27-f4a2-46f1-8da1-b815dc69ed19", 1, 0, 0.0, 1135.0, 1135, 1135, 1135.0, 1135.0, 1135.0, 1135.0, 0.881057268722467, 0.15917538546255505, 0.6074476872246696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 353.45454545454544, 234, 755, 253.0, 700.4000000000002, 755.0, 755.0, 0.06886319387493192, 0.10672450066359078, 0.15487493700582833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 952.0476190476189, 149, 3300, 792.0, 2717.800000000001, 3264.9999999999995, 3300.0, 0.09624594964961891, 0.059119826493760054, 0.04351745574977886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 135.23529411764707, 112, 338, 124.0, 186.79999999999987, 338.0, 338.0, 0.10062625042914136, 0.07478181306306306, 0.050509660859940096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 216.47058823529412, 112, 458, 125.0, 382.79999999999995, 458.0, 458.0, 0.10063220704188668, 0.11583571718206143, 0.0524203155707622], "isController": false}, {"data": ["login", 21, 0, 0.0, 3955.523809523809, 2100, 9283, 3544.0, 8601.600000000002, 9271.2, 9283.0, 0.09302861294338102, 26.626632811357908, 0.17708920530307393], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 143.1333333333333, 116, 344, 129.0, 228.20000000000007, 344.0, 344.0, 0.07924851276957702, 0.06415724324802671, 0.028170369773560584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d15cd867-03b1-43a7-b0ce-58e08396ab0a", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/011f659d-b2f0-40b0-8ff9-f9388ace239e", 3, 0, 0.0, 392.6666666666667, 230, 584, 364.0, 584.0, 584.0, 584.0, 0.017053496819522843, 0.023509622080299233, 0.010935998936998698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c68abc3-f6d0-461a-a60b-d9e34f89e00f", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 0.23992571381142097, 0.9156083997343958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10f9d4fc-566d-40c8-b483-d66a4608bd69", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05e77e9b-ea26-4366-91f3-02032e07a668", 3, 0, 0.0, 1426.0, 491, 1992, 1795.0, 1992.0, 1992.0, 1992.0, 0.025532566788939292, 0.025607369230703763, 0.016373423364000782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 910.8823529411765, 230, 1550, 1199.0, 1459.6, 1550.0, 1550.0, 0.10055423126290199, 70.8275920533322, 0.21101485651798443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8004f35-eaff-4deb-8cb3-3d1409d9e532", 1, 0, 0.0, 1007.0, 1007, 1007, 1007.0, 1007.0, 1007.0, 1007.0, 0.9930486593843098, 0.1794082050645482, 0.684660501489573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 486.40000000000003, 232, 1572, 458.0, 1077.6000000000004, 1572.0, 1572.0, 0.07179335002129869, 5.82983502785582, 0.1602403267435015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 948.75, 113, 1951, 1174.5, 1951.0, 1951.0, 1951.0, 0.09632751354605659, 72.03541259030705, 0.15948365066225167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc245b56-50bd-4207-99da-3e19602e0d40", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6deab9bf-250b-4c8a-898a-e7bf37a40b59", 3, 0, 0.0, 1196.0, 469, 2217, 902.0, 2217.0, 2217.0, 2217.0, 0.029145455252011034, 0.02429736682955738, 0.0186902821765826], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1574.913043478261, 194, 2797, 1463.0, 2590.6000000000004, 2767.7999999999997, 2797.0, 0.0940114693992667, 0.02976178311145264, 0.042415330920372286], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 141.76470588235293, 115, 385, 126.0, 200.19999999999982, 385.0, 385.0, 0.08434003919331233, 0.06547883902215167, 0.029980248306997744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 318.6, 232, 488, 247.0, 476.0, 488.0, 488.0, 0.08123564836878819, 0.12589938863404965, 0.18270087714191327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5207266c-6644-43c9-9263-80468aa93659", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a4c4b9a-e5be-4093-8eba-a2adfb40e271", 3, 0, 0.0, 394.3333333333333, 201, 580, 402.0, 580.0, 580.0, 580.0, 0.029319781078967943, 0.029405678875097735, 0.018802073152853795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 470.1666666666667, 237, 1392, 366.5, 1137.3000000000004, 1392.0, 1392.0, 0.10484378276368211, 14.08105698550826, 0.23281553974161834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 121.77777777777777, 113, 129, 124.0, 129.0, 129.0, 129.0, 0.06635895772197072, 0.0493155926039255, 0.03330908620028608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 146.11111111111111, 111, 366, 122.0, 366.0, 366.0, 366.0, 0.06636238285196028, 0.01775712197405968, 0.03784729647025859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 118.33333333333333, 111, 127, 117.0, 127.0, 127.0, 127.0, 0.06636385087305333, 0.017887131680627652, 0.03901468576716611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 146.66666666666666, 110, 339, 125.0, 339.0, 339.0, 339.0, 0.06635895772197072, 0.01788581282349992, 0.0390766127991683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 121.0, 120, 122, 121.0, 122.0, 122.0, 122.0, 0.04678690902285541, 0.013798482934474934, 0.0289219857533862], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1330.6037735849059, 926, 1968, 1228.0, 1808.6, 1884.6, 1968.0, 0.2406258087070222, 287.8721222799069, 0.4751419777398427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1574.913043478261, 194, 2797, 1463.0, 2590.6000000000004, 2767.7999999999997, 2797.0, 0.09096518011105663, 0.028797400768853523, 0.04104093087041812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 124.875, 115, 145, 123.5, 145.0, 145.0, 145.0, 0.03719096631428226, 0.01002412763939639, 0.021900539733898636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 152.5, 115, 335, 124.5, 335.0, 335.0, 335.0, 0.037155211250597966, 0.010014490532387734, 0.02184320036412107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10f9d4fc-566d-40c8-b483-d66a4608bd69", 3, 0, 0.0, 502.3333333333333, 207, 721, 579.0, 721.0, 721.0, 721.0, 0.01731511782937683, 0.02387028776282906, 0.0111037702226147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 295.70588235294116, 112, 1445, 122.0, 1162.5999999999997, 1445.0, 1445.0, 0.08214425497576745, 8.715246864626268, 0.047461334819983284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 295.1764705882353, 112, 1006, 330.0, 724.3999999999997, 1006.0, 1006.0, 0.08214425497576745, 2.861081380796606, 0.047541553818983055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71ec79f4-d01a-4445-9abf-60f61f5b14ac", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 147.75, 112, 336, 117.5, 336.0, 336.0, 336.0, 0.03715486612637299, 0.009941829412720897, 0.021189884587697095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 164.9411764705882, 115, 381, 125.0, 373.0, 381.0, 381.0, 0.08214187351117855, 0.061044888419928584, 0.04123137010229079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 158.625, 115, 383, 125.5, 383.0, 383.0, 383.0, 0.0371907934190891, 0.027638861124928523, 0.01866803497794121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 182.52941176470588, 113, 352, 123.0, 341.59999999999997, 352.0, 352.0, 0.08214465189995748, 0.03649510212513046, 0.046036490345587384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 224.375, 127, 661, 135.5, 661.0, 661.0, 661.0, 0.03829125284192892, 0.030139404092377645, 0.01361134378365442], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 969.2142857142857, 116, 4118, 641.0, 2956.5, 4118.0, 4118.0, 0.08388859594458559, 0.01567644730298164, 0.057094100908992855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=011f659d-b2f0-40b0-8ff9-f9388ace239e", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2190.619047619048, 1278, 5726, 1689.0, 4778.400000000001, 5638.699999999999, 5726.0, 0.0946730623579904, 0.049000706103256755, 0.04354591051817723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 314.875, 241, 719, 258.0, 719.0, 719.0, 719.0, 0.037132791504017305, 0.05754857433288619, 0.08351251839233578], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1298.7894736842106, 638, 2596, 1140.0, 2207.2, 2376.1, 2596.0, 0.26348390436921026, 83.97612758543582, 0.9575306993417525], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 223.98113207547163, 113, 500, 129.0, 491.0, 500.0, 500.0, 0.2419174468123953, 0.17978435256272737, 0.11694251579310125], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 765.6981132075471, 557, 1114, 727.0, 974.4, 1010.9999999999998, 1114.0, 0.24188322060662487, 71.12169813715691, 0.1216502525511834], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 175.05660377358487, 111, 456, 124.0, 366.0, 375.5999999999999, 456.0, 0.24237767930231816, 0.4288948778279301, 0.11787508231694768], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1103.471698113207, 789, 1560, 1088.0, 1380.6000000000001, 1459.5, 1560.0, 0.24121828889758692, 217.04864036657216, 0.12108027391929656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 155.22222222222223, 115, 367, 128.5, 351.70000000000005, 367.0, 367.0, 0.11152347259310662, 0.08331587552121733, 0.039643109398330864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 8, 4.790419161676646, 231.99401197604797, 115, 928, 135.0, 482.20000000000005, 612.6, 818.5199999999988, 0.6788176378772112, 1.4545349375142267, 0.32694853307305216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 140.44444444444446, 125, 217, 131.0, 217.0, 217.0, 217.0, 0.07123183588185013, 0.05516293540459683, 0.025320691661126413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d115954f-4967-4b4b-959d-7997d4a727e1", 1, 0, 0.0, 1104.0, 1104, 1104, 1104.0, 1104.0, 1104.0, 1104.0, 0.9057971014492754, 0.16364498414855072, 0.6245046422101449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6988e47-2c0f-4f37-a698-3810e6d5ba3e", 1, 0, 0.0, 995.0, 995, 995, 995.0, 995.0, 995.0, 995.0, 1.0050251256281408, 0.18157192211055276, 0.6929177135678392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be721b27-f4a2-46f1-8da1-b815dc69ed19", 3, 0, 0.0, 475.3333333333333, 341, 548, 537.0, 548.0, 548.0, 548.0, 0.057052659604815245, 0.036679362864423866, 0.03658650371793165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 127.66666666666667, 115, 146, 125.0, 144.8, 146.0, 146.0, 0.06960201567437392, 0.056483667016996815, 0.024741341509250107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6988e47-2c0f-4f37-a698-3810e6d5ba3e", 3, 0, 0.0, 1785.0, 346, 4118, 891.0, 4118.0, 4118.0, 4118.0, 0.021486431318622292, 0.025396234413384615, 0.0137787336255488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c68abc3-f6d0-461a-a60b-d9e34f89e00f", 3, 0, 0.0, 384.6666666666667, 238, 490, 426.0, 490.0, 490.0, 490.0, 0.02399827212440704, 0.02422481831308146, 0.015389516954779256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 273.33333333333326, 236, 492, 246.0, 492.0, 492.0, 492.0, 0.06629736578466615, 0.10274796826197771, 0.14910432949422475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05e77e9b-ea26-4366-91f3-02032e07a668", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 529.9411764705883, 230, 1777, 464.0, 1328.1999999999996, 1777.0, 1777.0, 0.0820966519053667, 11.667104754422352, 0.18216609450531937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d15cd867-03b1-43a7-b0ce-58e08396ab0a", 3, 0, 0.0, 412.33333333333337, 217, 719, 301.0, 719.0, 719.0, 719.0, 0.03809572185043619, 0.03175883582648669, 0.024429873712682067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 149.27272727272725, 118, 331, 127.0, 295.20000000000016, 331.0, 331.0, 0.06801080753559748, 0.05638786679465064, 0.024175716741169414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc245b56-50bd-4207-99da-3e19602e0d40", 3, 0, 0.0, 430.0, 278, 523, 489.0, 523.0, 523.0, 523.0, 0.06816167950378296, 0.030175743530320587, 0.04371045202553791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 133.8235294117647, 114, 223, 126.0, 173.39999999999995, 223.0, 223.0, 0.10146285564223004, 0.07877243187067663, 0.03606687446657396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a4c4b9a-e5be-4093-8eba-a2adfb40e271", 1, 0, 0.0, 1978.0, 1978, 1978, 1978.0, 1978.0, 1978.0, 1978.0, 0.5055611729019212, 0.09133673533872598, 0.34856073053589487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6deab9bf-250b-4c8a-898a-e7bf37a40b59", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 131.66666666666669, 113, 340, 119.0, 153.7000000000003, 340.0, 340.0, 0.1049238427774507, 0.07797562925160155, 0.05266685076915006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 184.61111111111111, 110, 369, 122.5, 368.1, 369.0, 369.0, 0.1049287359002011, 0.04558752805386342, 0.05886301699262585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 317.05555555555554, 112, 1278, 128.5, 1023.3000000000004, 1278.0, 1278.0, 0.10493240604177476, 10.516069323156835, 0.06068681903240663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1652496-6e15-41fc-8b63-5474f33e5367", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 265.0, 110, 958, 128.0, 691.6000000000004, 958.0, 958.0, 0.10492139638720659, 3.4529567796708966, 0.06078291398777083], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.39777247414478917], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.15910898965791567], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07955449482895784], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.954653937947494], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1257, 20, "401/Unauthorized", 12, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
