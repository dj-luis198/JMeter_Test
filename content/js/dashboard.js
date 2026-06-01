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

    var data = {"OkPercent": 97.8689818468824, "KoPercent": 2.1310181531176005};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7373567093728928, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1607499-ec80-4195-b3d1-49b7c58d607d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58758da5-6d51-4457-bea9-761c6449aea3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a72c34de-d999-4f20-a715-cf896c780c63"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ef3b2bd-091a-4379-a1e0-581398924af4"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8aa5e2d-e741-4662-8e16-f9379a4b142c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29f579db-e6df-4c40-b87b-5c7334606ad9"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbbe52a4-013a-49bb-94ea-be9c1b0b7927"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba02027b-b3ed-453d-8e35-0fd2ac1ea238"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27448e0c-03a0-4010-8efb-a76b5cc15252"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c08380f-6112-41c5-b016-bcf4083b3e9b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bad436e7-8f91-4ac4-bfcd-297232454112"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2d85a78-2a95-4cfe-9198-f73f51831ec8"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ef3b2bd-091a-4379-a1e0-581398924af4"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.29245283018867924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58758da5-6d51-4457-bea9-761c6449aea3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b75c8e4e-c214-4c0d-a04b-c53d59ef3c5b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27448e0c-03a0-4010-8efb-a76b5cc15252"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1607499-ec80-4195-b3d1-49b7c58d607d"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ba02027b-b3ed-453d-8e35-0fd2ac1ea238"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a72c34de-d999-4f20-a715-cf896c780c63"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbbe52a4-013a-49bb-94ea-be9c1b0b7927"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c2d3d2dd-a756-4d17-957b-c3d0241647c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29f579db-e6df-4c40-b87b-5c7334606ad9"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d062bfa-3d13-44eb-9d02-3bda00b6092f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b97c5a9c-9ead-46dd-9c4e-07b0743c9866"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37735849056603776, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9201183431952663, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d062bfa-3d13-44eb-9d02-3bda00b6092f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c08380f-6112-41c5-b016-bcf4083b3e9b"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bad436e7-8f91-4ac4-bfcd-297232454112"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b75c8e4e-c214-4c0d-a04b-c53d59ef3c5b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8aa5e2d-e741-4662-8e16-f9379a4b142c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1267, 27, 2.1310181531176005, 449.0552486187842, 125, 2347, 146.0, 1293.4000000000003, 1526.1999999999998, 1987.6399999999999, 4.915940139601836, 680.8927049747219, 3.5851623518815985], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2201.094339622641, 1616, 2898, 2156.0, 2621.4, 2767.7, 2898.0, 0.23653850445183316, 284.6370612322317, 1.1630579784325976], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c1607499-ec80-4195-b3d1-49b7c58d607d", 3, 0, 0.0, 581.0, 237, 1138, 368.0, 1138.0, 1138.0, 1138.0, 0.021419850489443584, 0.025317538127333873, 0.013736036934962195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58758da5-6d51-4457-bea9-761c6449aea3", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a72c34de-d999-4f20-a715-cf896c780c63", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 536.6666666666667, 136, 1326, 504.0, 951.6000000000003, 1326.0, 1326.0, 0.10127813000060766, 0.019840227420040917, 0.06819130341577373], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 536.6666666666667, 136, 1326, 504.0, 951.6000000000003, 1326.0, 1326.0, 0.09879080060064807, 0.019352963477041015, 0.06651656639400405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 182.56249999999997, 127, 396, 133.5, 395.3, 396.0, 396.0, 0.14277173476580976, 0.06500714974078008, 0.07992568061962933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 150.875, 126, 411, 133.5, 223.4000000000002, 411.0, 411.0, 0.1427832015563369, 0.10611134412536365, 0.07167047421870816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 307.0625, 127, 1009, 134.5, 1007.6, 1009.0, 1009.0, 0.1427832015563369, 5.281549231201699, 0.08254653839975726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 340.25, 127, 1544, 136.0, 1518.1000000000001, 1544.0, 1544.0, 0.1427806532214885, 16.09295871073532, 0.08240563091201142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ef3b2bd-091a-4379-a1e0-581398924af4", 3, 0, 0.0, 590.0, 312, 971, 487.0, 971.0, 971.0, 971.0, 0.04587927633088134, 0.03729184667910505, 0.029421280719998777], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 252.66666666666669, 131, 360, 246.0, 349.2, 360.0, 360.0, 0.10249121991882695, 0.19331205288205308, 0.06624562704128346], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8aa5e2d-e741-4662-8e16-f9379a4b142c", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 152.46666666666667, 128, 400, 134.0, 246.4000000000001, 400.0, 400.0, 0.08670169415110371, 0.06443358325096672, 0.043520186321940726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1006.0, 848, 1138, 1059.0, 1138.0, 1138.0, 1138.0, 0.02812844573460249, 8.270696998272914, 0.016042004208015482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 171.86666666666667, 126, 397, 134.0, 396.4, 397.0, 397.0, 0.08670369877978995, 0.023200013150060983, 0.04944820321034896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1276.8, 1140, 1527, 1188.0, 1527.0, 1527.0, 1527.0, 0.028114527338566384, 25.297501119309622, 0.016006610779672074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 339.4, 138, 396, 388.0, 396.0, 396.0, 396.0, 0.028235825615541, 0.04996417579625028, 0.01563448547266772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 146.99999999999997, 128, 391, 134.0, 140.0, 391.0, 391.0, 0.10581656976096594, 0.0786390718633741, 0.053114957868297355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 200.8421052631579, 126, 426, 134.0, 398.0, 426.0, 426.0, 0.10581656976096594, 0.04504383381786183, 0.05941304523379892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29f579db-e6df-4c40-b87b-5c7334606ad9", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 300.10526315789474, 126, 1390, 133.0, 1299.0, 1390.0, 1390.0, 0.10582010582010583, 10.048373973127262, 0.06125339390142021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbbe52a4-013a-49bb-94ea-be9c1b0b7927", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 285.36842105263156, 126, 1064, 135.0, 801.0, 1064.0, 1064.0, 0.10581833776099536, 3.300688028047429, 0.061355708690470225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 135.6, 130, 142, 135.0, 142.0, 142.0, 142.0, 0.028276864435056528, 0.021014349448318374, 0.015878122119294433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 920.4666666666666, 132, 1597, 1228.0, 1586.2, 1597.0, 1597.0, 0.07897771248953546, 42.64708550028432, 0.04235796845630163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 206.33333333333331, 126, 400, 141.0, 397.6, 400.0, 400.0, 0.0865690936793019, 0.023333076030749342, 0.05089315858880835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 709.2666666666667, 128, 1292, 1007.0, 1233.2, 1292.0, 1292.0, 0.07897688083441706, 13.941609841704006, 0.042434648276461207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 155.6, 128, 399, 133.0, 292.80000000000007, 399.0, 399.0, 0.08670219529958499, 0.023368951076841265, 0.05105607789614233], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 560.0, 133, 1118, 562.0, 1048.4, 1118.0, 1118.0, 0.09901578311582866, 0.019397037200229714, 0.0673255754467262], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 507.1578947368421, 264, 1528, 273.0, 1433.0, 1528.0, 1528.0, 0.10573707086053281, 13.462232344343901, 0.23495737996059904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 670.6190476190477, 177, 1647, 567.0, 1249.0, 1609.6999999999994, 1647.0, 0.10055593064513811, 0.06176726599198425, 0.04546620692255757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 134.06666666666666, 127, 146, 135.0, 141.2, 146.0, 146.0, 0.07897771248953546, 0.05869339766068016, 0.039643109589473854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 185.73333333333332, 127, 399, 134.0, 398.4, 399.0, 399.0, 0.07897688083441706, 0.09230422947522496, 0.04106180796508169], "isController": false}, {"data": ["login", 21, 0, 0.0, 2905.6666666666665, 1501, 4527, 2877.0, 4000.8, 4474.9, 4527.0, 0.09651844191658049, 27.62549103039182, 0.18373244139951742], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 160.26666666666668, 131, 412, 138.0, 263.2000000000001, 412.0, 412.0, 0.08995502248875563, 0.07282491566716642, 0.03197619940029985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba02027b-b3ed-453d-8e35-0fd2ac1ea238", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27448e0c-03a0-4010-8efb-a76b5cc15252", 3, 0, 0.0, 437.3333333333333, 360, 495, 457.0, 495.0, 495.0, 495.0, 0.0759320661115189, 0.035692025867523854, 0.048693414791566476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1055.7333333333333, 269, 1727, 1362.0, 1718.0, 1727.0, 1727.0, 0.0789220302955367, 56.699837075333704, 0.16538173106265883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c08380f-6112-41c5-b016-bcf4083b3e9b", 1, 0, 0.0, 1118.0, 1118, 1118, 1118.0, 1118.0, 1118.0, 1118.0, 0.8944543828264758, 0.16159576252236135, 0.6166843694096601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bad436e7-8f91-4ac4-bfcd-297232454112", 1, 0, 0.0, 1002.0, 1002, 1002, 1002.0, 1002.0, 1002.0, 1002.0, 0.998003992015968, 0.18030345558882235, 0.6880769710578842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d85a78-2a95-4cfe-9198-f73f51831ec8", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 843.6666666666666, 131, 1669, 1271.0, 1669.0, 1669.0, 1669.0, 0.04459065776174716, 29.641930050882895, 0.06899068891327612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 559.5625, 262, 1674, 403.0, 1650.2, 1674.0, 1674.0, 0.14259868274466814, 21.518075079320518, 0.3161471284190262], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1230.0000000000002, 242, 2039, 1249.5, 1585.5, 1925.75, 2039.0, 0.09584128682901115, 0.030090794644069423, 0.04324089308105777], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 159.4375, 129, 442, 138.5, 255.80000000000018, 442.0, 442.0, 0.08926578888640929, 0.06930302945771033, 0.031731198393215795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 398.33333333333337, 265, 797, 286.0, 645.2, 797.0, 797.0, 0.0865011994832995, 0.13405996443359017, 0.19454322500980348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ef3b2bd-091a-4379-a1e0-581398924af4", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 401.7142857142857, 261, 833, 272.5, 688.0, 833.0, 833.0, 0.09038089089735314, 0.14007272837314397, 0.20326874193027758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 133.62499999999997, 130, 141, 132.5, 141.0, 141.0, 141.0, 0.03970341548631721, 0.029506151547936912, 0.01992925347653032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 131.125, 128, 133, 131.5, 133.0, 133.0, 133.0, 0.039705583101303836, 0.010624345478278565, 0.02264459036246234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 132.125, 127, 135, 132.0, 135.0, 135.0, 135.0, 0.039705386035615735, 0.010701842329912052, 0.023342424212344403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 170.5, 128, 432, 134.5, 432.0, 432.0, 432.0, 0.0397049919101079, 0.01070173610077127, 0.023380966915815492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 134.0, 133, 135, 134.0, 135.0, 135.0, 135.0, 0.02365240426689373, 0.006975611414650299, 0.014621066309515362], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1513.7547169811323, 1013, 2347, 1450.0, 2046.8, 2142.2999999999997, 2347.0, 0.23913730090691693, 286.0913494619411, 0.4722027562829942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58758da5-6d51-4457-bea9-761c6449aea3", 3, 0, 0.0, 336.6666666666667, 255, 459, 296.0, 459.0, 459.0, 459.0, 0.019239402295902007, 0.02652306924581543, 0.012337767748348617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1230.0000000000002, 242, 2039, 1249.5, 1585.5, 1925.75, 2039.0, 0.09510072752056553, 0.02985828505650568, 0.04290677354931765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 165.87499999999997, 127, 395, 133.5, 395.0, 395.0, 395.0, 0.037556569582934296, 0.010122669145400259, 0.022115831502450566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 133.75, 128, 147, 132.0, 147.0, 147.0, 147.0, 0.037556569582934296, 0.010122669145400259, 0.02207915516496723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 368.8125, 128, 1499, 134.0, 1445.8, 1499.0, 1499.0, 0.0873176561758141, 9.841665546772248, 0.05039524882803333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b75c8e4e-c214-4c0d-a04b-c53d59ef3c5b", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 293.25, 125, 1039, 133.0, 864.0000000000002, 1039.0, 1039.0, 0.08731479712952604, 3.2297734931376025, 0.050478867090507244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27448e0c-03a0-4010-8efb-a76b5cc15252", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 165.875, 133, 380, 134.5, 380.0, 380.0, 380.0, 0.03755604065441401, 0.010049174940731874, 0.02141867943572049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 134.875, 127, 148, 132.5, 146.6, 148.0, 148.0, 0.08744029467379305, 0.06498248461597315, 0.04389092916243128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 173.125, 133, 435, 136.0, 435.0, 435.0, 435.0, 0.03755533543956173, 0.027909775653814917, 0.01885101798431126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 181.25000000000003, 127, 403, 133.5, 397.4, 403.0, 403.0, 0.08743981681358377, 0.039813295497395935, 0.04895007323084658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 172.0, 135, 404, 137.5, 404.0, 404.0, 404.0, 0.03705796792632876, 0.029168673973262678, 0.013172949536312177], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 597.8666666666666, 132, 1393, 487.0, 1240.0, 1393.0, 1393.0, 0.10143633855392355, 0.019501400244123453, 0.06903086242865644], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1466.6190476190475, 823, 2216, 1403.0, 2158.6, 2210.9, 2216.0, 0.09912533690813913, 0.05130510601690795, 0.045593782894271025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1607499-ec80-4195-b3d1-49b7c58d607d", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 342.75, 270, 831, 272.0, 831.0, 831.0, 831.0, 0.0375313738828552, 0.058166299171964066, 0.08440893950411672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba02027b-b3ed-453d-8e35-0fd2ac1ea238", 3, 0, 0.0, 1011.0, 227, 2090, 716.0, 2090.0, 2090.0, 2090.0, 0.034930023519549165, 0.02911972338332208, 0.022399787217940063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a72c34de-d999-4f20-a715-cf896c780c63", 3, 0, 0.0, 433.0, 325, 522, 452.0, 522.0, 522.0, 522.0, 0.021001344086021508, 0.024822877726674505, 0.01346765880516353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbbe52a4-013a-49bb-94ea-be9c1b0b7927", 3, 0, 0.0, 447.6666666666667, 342, 501, 500.0, 501.0, 501.0, 501.0, 0.023972958502808832, 0.02404319177967253, 0.015373283935720506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2d3d2dd-a756-4d17-957b-c3d0241647c5", 1, 0, 0.0, 1330.0, 1330, 1330, 1330.0, 1330.0, 1330.0, 1330.0, 0.7518796992481204, 0.24010220864661652, 0.4486313439849624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29f579db-e6df-4c40-b87b-5c7334606ad9", 3, 0, 0.0, 306.6666666666667, 210, 468, 242.0, 468.0, 468.0, 468.0, 0.08080372774530666, 0.036561582541007887, 0.05181749468042125], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1279.379310344827, 675, 3073, 1045.0, 2244.6, 2497.5499999999993, 3073.0, 0.27860639161490836, 87.29964188721004, 1.0119934347364528], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 232.75471698113202, 132, 636, 135.0, 531.2, 556.1999999999998, 636.0, 0.24057010576006538, 0.1787830571127048, 0.11629121323362535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d062bfa-3d13-44eb-9d02-3bda00b6092f", 3, 0, 0.0, 421.0, 218, 823, 222.0, 823.0, 823.0, 823.0, 0.051210269366016865, 0.0329232688795193, 0.032839918831723054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b97c5a9c-9ead-46dd-9c4e-07b0743c9866", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 862.6415094339624, 635, 1272, 792.0, 1134.8, 1188.6, 1272.0, 0.2403257547589034, 70.66375146519358, 0.12086695673909692], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 189.26415094339623, 129, 399, 136.0, 397.0, 397.3, 399.0, 0.24104604889141557, 0.4265385162023877, 0.11722747299602046], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1276.8490566037735, 877, 1772, 1308.0, 1592.8, 1702.5, 1772.0, 0.23975933591187712, 215.7358719054647, 0.12034794790889145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 158.7857142857143, 133, 396, 137.5, 278.0, 396.0, 396.0, 0.09352162353538457, 0.0698672285200871, 0.033244014616093734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, 7.100591715976331, 197.8934911242603, 128, 1273, 140.0, 360.0, 402.5, 843.9000000000069, 0.7008841923657537, 1.5047609710149135, 0.3374252588916906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 140.375, 134, 158, 138.0, 158.0, 158.0, 158.0, 0.040471083410902914, 0.03134137611801368, 0.014386205431219394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 154.125, 132, 379, 136.0, 226.40000000000015, 379.0, 379.0, 0.1267095895401234, 0.10282780166781498, 0.045041299406840735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d062bfa-3d13-44eb-9d02-3bda00b6092f", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 306.25, 266, 562, 268.0, 562.0, 562.0, 562.0, 0.039677028984069676, 0.061491645505584544, 0.08923456811553951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c08380f-6112-41c5-b016-bcf4083b3e9b", 3, 0, 0.0, 520.3333333333334, 246, 814, 501.0, 814.0, 814.0, 814.0, 0.0453898992344237, 0.029181331701818625, 0.029107454912700097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 537.4375, 261, 1632, 399.0, 1578.1000000000001, 1632.0, 1632.0, 0.08725242125468982, 13.166349893797443, 0.19344219663423784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bad436e7-8f91-4ac4-bfcd-297232454112", 3, 0, 0.0, 631.3333333333333, 226, 1393, 275.0, 1393.0, 1393.0, 1393.0, 0.03497196414207943, 0.028426104968350373, 0.022426682734341303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b75c8e4e-c214-4c0d-a04b-c53d59ef3c5b", 3, 0, 0.0, 315.6666666666667, 251, 424, 272.0, 424.0, 424.0, 424.0, 0.02563051055977035, 0.02570559994617593, 0.016436232357665233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8aa5e2d-e741-4662-8e16-f9379a4b142c", 3, 0, 0.0, 404.0, 223, 572, 417.0, 572.0, 572.0, 572.0, 0.02587723838111997, 0.025953050602939655, 0.016594452998309354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 165.6315789473684, 132, 411, 137.0, 401.0, 411.0, 411.0, 0.10225003901646225, 0.08477566711423483, 0.03634669355663307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 138.93333333333334, 133, 162, 137.0, 153.0, 162.0, 162.0, 0.08083464465090211, 0.0627573657201828, 0.028734190090750362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 153.85714285714283, 128, 434, 132.0, 286.5, 434.0, 434.0, 0.09061312725319248, 0.067340419765312, 0.045483542390762646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 185.57142857142853, 126, 381, 132.5, 380.5, 381.0, 381.0, 0.09061840589278548, 0.02424750313928049, 0.05168080961072922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 226.6428571428571, 126, 412, 134.5, 405.5, 412.0, 412.0, 0.09046265184802274, 0.02438251163091238, 0.0531821449340915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 186.35714285714286, 127, 394, 132.5, 393.5, 394.0, 394.0, 0.09061723280861642, 0.02442417603044739, 0.05336151502304266], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5524861878453039], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15785319652722968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15785319652722968], "isController": false}, {"data": ["401/Unauthorized", 16, 59.25925925925926, 1.2628255722178374], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1267, 27, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
