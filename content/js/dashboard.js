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

    var data = {"OkPercent": 97.3186119873817, "KoPercent": 2.6813880126182967};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7131809011432414, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2020a151-c967-4b92-abaf-ae06499250f8"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a23b2e4d-c100-4762-926d-f8f4f41c1756"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f2f1b31-e171-439c-a44a-6da691fe3764"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bf1226a-24c5-4e8e-ae9f-04750f4459f6"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/423d393d-6287-4cd3-9b25-ef204ed52f97"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2306fa8-d37a-4a2c-83fc-c86267495987"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4caf308a-9359-4829-abed-61d4938c4f5d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d20861a-182f-4d1b-9884-3d3dcdb746d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b549725c-6732-420b-9250-0f6df9cc7803"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/961dfb19-5380-4706-bc29-7fd1d38ce6e6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2306fa8-d37a-4a2c-83fc-c86267495987"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4caf308a-9359-4829-abed-61d4938c4f5d"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f2f1b31-e171-439c-a44a-6da691fe3764"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49291808-1204-4d8c-9a52-27ad58800985"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/272454a9-d890-4256-974c-442fd36eb2e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=423d393d-6287-4cd3-9b25-ef204ed52f97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/20f5cdd7-c943-41f0-b388-c0db767e465f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7bf1226a-24c5-4e8e-ae9f-04750f4459f6"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.27358490566037735, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b376330a-e9ae-4b6e-84f0-b9f33119f187"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2020a151-c967-4b92-abaf-ae06499250f8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a23b2e4d-c100-4762-926d-f8f4f41c1756"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.940625, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7f59bf4e-f2a7-4457-b869-899940e2b8f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b376330a-e9ae-4b6e-84f0-b9f33119f187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0d20861a-182f-4d1b-9884-3d3dcdb746d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b549725c-6732-420b-9250-0f6df9cc7803"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49291808-1204-4d8c-9a52-27ad58800985"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=272454a9-d890-4256-974c-442fd36eb2e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 34, 2.6813880126182967, 486.7381703470036, 135, 3071, 158.0, 1355.4000000000005, 1647.1, 2217.269999999999, 4.998561139735013, 738.9062510779133, 3.6504881222577885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2020a151-c967-4b92-abaf-ae06499250f8", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2356.944444444445, 1675, 3913, 2231.0, 2911.0, 3174.5, 3913.0, 0.24441577839636092, 294.11463460689794, 1.201790472876638], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a23b2e4d-c100-4762-926d-f8f4f41c1756", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f2f1b31-e171-439c-a44a-6da691fe3764", 3, 0, 0.0, 675.6666666666667, 228, 1427, 372.0, 1427.0, 1427.0, 1427.0, 0.017880344733046453, 0.024649498679834545, 0.011466236694043461], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 565.8125, 141, 1565, 505.0, 1333.3000000000002, 1565.0, 1565.0, 0.08456302059109552, 0.017692995275041225, 0.05646480989175933], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 565.8125, 141, 1565, 505.0, 1333.3000000000002, 1565.0, 1565.0, 0.0836037391772347, 0.017492286248752476, 0.055824274084408425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 170.66666666666669, 135, 422, 140.5, 407.6, 422.0, 422.0, 0.1045265816904271, 0.036690917075578526, 0.05912511614064632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 157.5555555555556, 138, 409, 142.5, 178.60000000000036, 409.0, 409.0, 0.10451808453190414, 0.0776740843054483, 0.05246317914980345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 298.8888888888889, 136, 1146, 142.5, 630.3000000000009, 1146.0, 1146.0, 0.10452293988188907, 1.7340078994663521, 0.0610511051849185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bf1226a-24c5-4e8e-ae9f-04750f4459f6", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 217.55555555555554, 136, 1253, 139.5, 508.7000000000012, 1253.0, 1253.0, 0.10452172600210205, 5.251541922285194, 0.060948324168326434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/423d393d-6287-4cd3-9b25-ef204ed52f97", 3, 0, 0.0, 423.66666666666663, 230, 774, 267.0, 774.0, 774.0, 774.0, 0.022890977902576, 0.02295804131439995, 0.01467943569924307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2306fa8-d37a-4a2c-83fc-c86267495987", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 275.93749999999994, 139, 567, 253.0, 469.0000000000001, 567.0, 567.0, 0.08416977042695116, 0.13844036703280516, 0.05439389216800286], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4caf308a-9359-4829-abed-61d4938c4f5d", 3, 0, 0.0, 339.6666666666667, 234, 509, 276.0, 509.0, 509.0, 509.0, 0.07479245094861758, 0.03384163633417267, 0.04796260689087782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 261.9285714285714, 137, 1564, 140.5, 992.0, 1564.0, 1564.0, 0.10003715665818733, 0.07434401974304741, 0.05021396340069168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 1017.8888888888889, 693, 1240, 1090.0, 1240.0, 1240.0, 1240.0, 0.045444905626079314, 13.362311166949436, 0.02591779773987336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 198.35714285714283, 136, 415, 141.5, 413.5, 415.0, 415.0, 0.1000378714799174, 0.03750024562870229, 0.05645273299892102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1454.6666666666667, 1223, 1682, 1486.0, 1682.0, 1682.0, 1682.0, 0.04532566490232319, 40.784112953130744, 0.02580552991997502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 294.44444444444446, 137, 429, 409.0, 429.0, 429.0, 429.0, 0.045539183937823836, 0.08058300907747733, 0.025215544231197377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d20861a-182f-4d1b-9884-3d3dcdb746d3", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 218.45454545454544, 139, 428, 142.0, 427.4, 428.0, 428.0, 0.06282375651796474, 0.046688358115401535, 0.031534580908431524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 214.63636363636363, 137, 412, 143.0, 412.0, 412.0, 412.0, 0.06282483294305785, 0.02538872865383517, 0.03535012350791022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 343.4545454545455, 137, 1556, 141.0, 1328.2000000000007, 1556.0, 1556.0, 0.06232118070309623, 5.113153000269114, 0.036151153650038244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 328.6363636363636, 138, 1104, 146.0, 968.4000000000004, 1104.0, 1104.0, 0.06248118464326083, 1.6854499248805757, 0.03630498521751972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 172.1111111111111, 137, 422, 140.0, 422.0, 422.0, 422.0, 0.04560194568301581, 0.033889727211694365, 0.02560656129661532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 952.0625000000001, 138, 1832, 1243.0, 1801.9, 1832.0, 1832.0, 0.07730701029632744, 39.13716939928829, 0.041711057801485256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 277.2142857142857, 135, 1076, 141.0, 828.5, 1076.0, 1076.0, 0.10003572704537333, 6.45448848919257, 0.05819600750267953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 711.1874999999999, 137, 1282, 963.5, 1244.2, 1282.0, 1282.0, 0.0773085044186642, 12.79545400325179, 0.0417873605427057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 246.07142857142858, 135, 1076, 139.5, 754.0, 1076.0, 1076.0, 0.10003858631186315, 2.126085128370943, 0.05829536481928744], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 450.75, 141, 937, 481.0, 841.1000000000001, 937.0, 937.0, 0.08376919492568101, 0.01752690430940152, 0.05626197637708703], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 639.3636363636364, 281, 1979, 553.0, 1753.6000000000008, 1979.0, 1979.0, 0.06227002547410133, 6.8601511640249075, 0.13859834949051797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b549725c-6732-420b-9250-0f6df9cc7803", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 504.8333333333333, 181, 1043, 438.5, 987.0, 1036.25, 1043.0, 0.10398883853133097, 0.06387595648067107, 0.047018390859381094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 140.5625, 136, 146, 140.0, 145.3, 146.0, 146.0, 0.07730701029632744, 0.05745179183154802, 0.03880449540264873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 207.68749999999994, 136, 421, 139.5, 415.4, 421.0, 421.0, 0.07730775735027662, 0.08599921786292368, 0.04043746829174015], "isController": false}, {"data": ["login", 24, 0, 0.0, 2908.1249999999995, 1777, 5087, 2769.5, 4118.0, 4886.5, 5087.0, 0.10261979792451459, 46.17498816799075, 0.2186433048064548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 169.64285714285714, 140, 419, 149.5, 291.5, 419.0, 419.0, 0.09346792714842707, 0.07566885899027934, 0.033224927228542436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/961dfb19-5380-4706-bc29-7fd1d38ce6e6", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2306fa8-d37a-4a2c-83fc-c86267495987", 3, 0, 0.0, 430.0, 320, 595, 375.0, 595.0, 595.0, 595.0, 0.02284704663843787, 0.02291398134538642, 0.014651263632071162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4caf308a-9359-4829-abed-61d4938c4f5d", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1111.0000000000002, 279, 1978, 1382.5, 1944.4, 1978.0, 1978.0, 0.07725437935762984, 52.04037284442175, 0.16262839013944416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 464.5555555555555, 281, 1394, 286.5, 1021.4000000000005, 1394.0, 1394.0, 0.10442955356365852, 7.093634647042613, 0.23338010907086704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 928.1176470588235, 139, 1909, 1361.0, 1838.6, 1909.0, 1909.0, 0.08554793452060447, 54.1934567467127, 0.1287985877671486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f2f1b31-e171-439c-a44a-6da691fe3764", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49291808-1204-4d8c-9a52-27ad58800985", 3, 0, 0.0, 524.0, 266, 1033, 273.0, 1033.0, 1033.0, 1033.0, 0.028451930463481948, 0.023719203749016038, 0.01824554134539695], "isController": false}, {"data": ["register", 24, 9, 37.5, 1157.458333333333, 288, 2249, 1065.0, 1887.0, 2162.75, 2249.0, 0.10454600895610809, 0.03251748423097699, 0.04716821888449409], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/272454a9-d890-4256-974c-442fd36eb2e0", 3, 0, 0.0, 363.6666666666667, 261, 493, 337.0, 493.0, 493.0, 493.0, 0.03695218387406696, 0.030805515267410634, 0.023696550205700488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=423d393d-6287-4cd3-9b25-ef204ed52f97", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 180.0, 139, 424, 146.5, 418.4, 424.0, 424.0, 0.08603306896088184, 0.06679325178115338, 0.030582067482188467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 600.7142857142858, 277, 1980, 420.0, 1597.0, 1980.0, 1980.0, 0.09993718234252755, 8.68379245322583, 0.22293464643652564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20f5cdd7-c943-41f0-b388-c0db767e465f", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.5458733974358975, 1.019965277777778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 583.8666666666667, 283, 1678, 560.0, 1501.6000000000001, 1678.0, 1678.0, 0.10211584020913325, 16.42596447347371, 0.22617727862987774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 170.44444444444446, 137, 417, 139.0, 417.0, 417.0, 417.0, 0.049112429264459516, 0.03649859245141963, 0.02465213734563691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 187.66666666666666, 135, 575, 138.0, 575.0, 575.0, 575.0, 0.04911082129663481, 0.013140981479763614, 0.028008515270737045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 185.22222222222223, 136, 546, 140.0, 546.0, 546.0, 546.0, 0.04911189326348531, 0.013237189981173774, 0.02887242162560367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 201.77777777777777, 139, 422, 142.0, 422.0, 422.0, 422.0, 0.04911135727421053, 0.013237045515314558, 0.028920066832372023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 142.25, 141, 144, 142.0, 144.0, 144.0, 144.0, 0.038742045773727085, 0.011425876780923416, 0.023948940405048087], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1610.055555555556, 1095, 3071, 1469.0, 2287.0, 2381.0, 3071.0, 0.24724029467380307, 295.7853470635636, 0.48820300374065406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1157.458333333333, 288, 2249, 1065.0, 1887.0, 2162.75, 2249.0, 0.10314506493841381, 0.032081741389535935, 0.046536152345260914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 181.5, 136, 428, 144.0, 428.0, 428.0, 428.0, 0.040529928819312507, 0.010924082377080325, 0.023866745193403757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 179.375, 135, 410, 144.0, 410.0, 410.0, 410.0, 0.04052951815469104, 0.01092397169013157, 0.02382692375891016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 242.6875, 136, 1238, 141.0, 662.6000000000006, 1238.0, 1238.0, 0.08744459565072442, 4.939771040331086, 0.050938184868805775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 245.31249999999994, 136, 1266, 142.0, 678.0000000000006, 1266.0, 1266.0, 0.08743121622286218, 1.6288226396303844, 0.0510157731378517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 146.25, 140, 163, 145.0, 163.0, 163.0, 163.0, 0.04053033949225617, 0.010845032246951358, 0.023114959241677346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 175.93749999999997, 137, 442, 140.0, 418.90000000000003, 442.0, 442.0, 0.08797250859106528, 0.06537800687285224, 0.04415807560137457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 142.75, 137, 158, 141.5, 158.0, 158.0, 158.0, 0.04053341980462892, 0.03012298092902598, 0.020345876737870375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 172.6875, 136, 420, 139.0, 410.90000000000003, 420.0, 420.0, 0.08783728143613954, 0.03174880253081167, 0.04963363962010376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 182.625, 145, 421, 149.0, 421.0, 421.0, 421.0, 0.0402653486475876, 0.03169323340815978, 0.014313073152072156], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 724.875, 139, 2449, 505.0, 1733.6000000000008, 2449.0, 2449.0, 0.08287707775423839, 0.016773705434146392, 0.05639121477076719], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1529.8333333333333, 795, 2688, 1579.5, 2065.0, 2553.25, 2688.0, 0.10389790299399124, 0.05377528182306187, 0.04778897686540026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bf1226a-24c5-4e8e-ae9f-04750f4459f6", 3, 0, 0.0, 391.0, 339, 481, 353.0, 481.0, 481.0, 481.0, 0.04879794397996031, 0.030927603166986565, 0.03129295235694069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 327.74999999999994, 284, 586, 288.5, 586.0, 586.0, 586.0, 0.04049915204900398, 0.06276577568532159, 0.09108354215708608], "isController": false}, {"data": ["addBook", 53, 9, 16.9811320754717, 1339.0188679245284, 703, 2748, 1121.0, 2388.6, 2563.7999999999997, 2748.0, 0.2654805197407307, 90.96390247598153, 0.9625576590503812], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b376330a-e9ae-4b6e-84f0-b9f33119f187", 3, 0, 0.0, 612.0, 226, 1234, 376.0, 1234.0, 1234.0, 1234.0, 0.0951022349025202, 0.0430312846726898, 0.060986784751941664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2020a151-c967-4b92-abaf-ae06499250f8", 3, 0, 0.0, 696.0, 243, 1355, 490.0, 1355.0, 1355.0, 1355.0, 0.0274323335771763, 0.027351965412399416, 0.017591698290051208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a23b2e4d-c100-4762-926d-f8f4f41c1756", 3, 0, 0.0, 389.0, 245, 501, 421.0, 501.0, 501.0, 501.0, 0.025697472225315435, 0.025772757788475542, 0.016479173269489392], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 264.5925925925926, 138, 589, 145.0, 571.5, 582.0, 589.0, 0.24873215692235412, 0.18484880021280417, 0.12023673601227079], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 878.4814814814818, 678, 1303, 828.5, 1132.5, 1147.25, 1303.0, 0.24849522336959523, 73.06584648862444, 0.12497562503451323], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 268.40740740740745, 135, 2925, 144.0, 424.0, 466.25, 2925.0, 0.2492695018764454, 0.44109017324230376, 0.12122676946725568], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1309.8518518518515, 949, 1919, 1253.0, 1689.0, 1766.0, 1919.0, 0.24792933095810915, 223.08724780938365, 0.12444890245358212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 148.9333333333333, 142, 164, 148.0, 159.8, 164.0, 164.0, 0.0971880264351432, 0.07260628928016068, 0.034547306271867306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 9, 5.625, 188.86875, 138, 526, 146.0, 293.30000000000007, 364.69999999999993, 488.17999999999915, 0.6863123579118947, 1.5661653034251277, 0.3268947985029812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 174.22222222222226, 138, 417, 145.0, 417.0, 417.0, 417.0, 0.051741979993101074, 0.04006971692825112, 0.018392656950672645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f59bf4e-f2a7-4457-b869-899940e2b8f1", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.43329163839891455, 0.8096060888738128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b376330a-e9ae-4b6e-84f0-b9f33119f187", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.5392957089552238, 2.058069029850746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 163.66666666666669, 139, 422, 148.0, 187.10000000000036, 422.0, 422.0, 0.10362634642287609, 0.08409520886465824, 0.036835927830006734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 406.2222222222223, 277, 964, 283.0, 964.0, 964.0, 964.0, 0.04907386707525205, 0.07605490922697754, 0.11036827722100144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 440.0, 275, 1407, 283.0, 1017.8000000000004, 1407.0, 1407.0, 0.08736390341920477, 6.659284743873607, 0.19508641177337804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d20861a-182f-4d1b-9884-3d3dcdb746d3", 3, 0, 0.0, 1087.3333333333335, 246, 2449, 567.0, 2449.0, 2449.0, 2449.0, 0.04043889682689456, 0.025998314203488526, 0.02593249568651767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 146.27272727272725, 141, 155, 146.0, 154.0, 155.0, 155.0, 0.06238020165817918, 0.05171952266386145, 0.022174212308180882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 146.93750000000003, 140, 177, 144.0, 164.4, 177.0, 177.0, 0.07830431995145132, 0.0607929046498084, 0.027834738732742465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b549725c-6732-420b-9250-0f6df9cc7803", 3, 0, 0.0, 588.0, 287, 1050, 427.0, 1050.0, 1050.0, 1050.0, 0.02017701971967394, 0.02384855423246617, 0.01293903933846278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49291808-1204-4d8c-9a52-27ad58800985", 1, 0, 0.0, 937.0, 937, 937, 937.0, 937.0, 937.0, 937.0, 1.0672358591248667, 0.19281116595517608, 0.735809098185699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=272454a9-d890-4256-974c-442fd36eb2e0", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 143.33333333333334, 136, 150, 143.0, 149.4, 150.0, 150.0, 0.10221395424903407, 0.0759617374839013, 0.05130661375390968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 233.73333333333332, 136, 433, 142.0, 432.4, 433.0, 433.0, 0.10221952665544524, 0.04782223428034046, 0.05715242805448983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 398.93333333333334, 136, 1542, 146.0, 1361.4, 1542.0, 1542.0, 0.10221813349688234, 12.287351677229207, 0.05892183294149715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 362.6, 137, 1117, 143.0, 1094.8, 1117.0, 1117.0, 0.10221952665544524, 4.031335821810921, 0.059022459759579676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.7097791798107256], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.31545741324921134], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.764705882352942, 0.31545741324921134], "isController": false}, {"data": ["401/Unauthorized", 17, 50.0, 1.3406940063091484], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 34, "401/Unauthorized", 17, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
