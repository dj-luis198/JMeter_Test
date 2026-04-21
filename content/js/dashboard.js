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

    var data = {"OkPercent": 96.6923076923077, "KoPercent": 3.3076923076923075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7705727452271232, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da52175d-e32a-459f-a79a-97e91664f7ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f51ecfa-7fc9-4e2a-b5a8-03b358d186ef"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b38cbe3-2e39-4d84-a9ae-3c593cb28c4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62307062-968d-4fe2-ba65-e72b5ad7f0fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0861a64c-0370-4290-a7fe-5600c5e0bc6f"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95dbc520-cb0f-484b-8d01-3da102814b62"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d95c7f4a-3a13-42b9-a916-cb531cac6a46"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a2acba8-5e57-4978-b39b-07494ac956df"], "isController": false}, {"data": [0.74, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f51ecfa-7fc9-4e2a-b5a8-03b358d186ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21dab506-39d5-45f5-b7c9-4d69bbff66be"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28dc8de9-e98d-4c4c-aaf4-f8616ee179c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f19136d1-d14c-41ec-9269-7834772e7e19"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9553b3b-be93-48b2-be1b-e4dc2376fd60"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da52175d-e32a-459f-a79a-97e91664f7ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a2acba8-5e57-4978-b39b-07494ac956df"], "isController": false}, {"data": [0.7090909090909091, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8680981595092024, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b38cbe3-2e39-4d84-a9ae-3c593cb28c4d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d95c7f4a-3a13-42b9-a916-cb531cac6a46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95dbc520-cb0f-484b-8d01-3da102814b62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0861a64c-0370-4290-a7fe-5600c5e0bc6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62307062-968d-4fe2-ba65-e72b5ad7f0fe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f19136d1-d14c-41ec-9269-7834772e7e19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f587c818-bd6a-4555-87ef-214fa42fc8f0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21dab506-39d5-45f5-b7c9-4d69bbff66be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28dc8de9-e98d-4c4c-aaf4-f8616ee179c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9553b3b-be93-48b2-be1b-e4dc2376fd60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 43, 3.3076923076923075, 344.4215384615379, 81, 9959, 111.5, 931.9000000000001, 1129.6000000000004, 1886.5100000000004, 5.177426420805289, 765.6804224207456, 3.7945922963379664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1440.290909090909, 1000, 1936, 1439.0, 1776.2, 1820.2, 1936.0, 0.24580566157476516, 295.7885669083011, 1.2086245176063892], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 730.2, 88, 2148, 493.0, 2124.0, 2148.0, 2148.0, 0.1321888714595414, 0.02690250079313323, 0.0885820347612669], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 730.2, 88, 2148, 493.0, 2124.0, 2148.0, 2148.0, 0.12584314909896305, 0.025611047140843654, 0.08432965714034028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da52175d-e32a-459f-a79a-97e91664f7ba", 3, 0, 0.0, 908.3333333333334, 193, 2274, 258.0, 2274.0, 2274.0, 2274.0, 0.056542963228226245, 0.026246831238102418, 0.036259647643100815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 143.3913043478261, 82, 270, 85.0, 257.0, 267.4, 270.0, 0.12475861919329992, 0.04967672939855497, 0.07024028916878214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 93.91304347826087, 82, 250, 85.0, 101.00000000000003, 221.39999999999958, 250.0, 0.12487444688764014, 0.09280220125145913, 0.0626811188478975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 178.1304347826087, 82, 573, 87.0, 432.00000000000017, 554.7999999999997, 573.0, 0.12476606363069247, 3.220735916352491, 0.07253828589058559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 186.82608695652172, 82, 934, 84.0, 652.400000000001, 930.8, 934.0, 0.12487648087218078, 9.801520625658316, 0.07248053216383794], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 216.7333333333333, 82, 575, 200.0, 399.2000000000001, 575.0, 575.0, 0.13429067664595606, 0.1991191510814876, 0.08679059551200559], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f51ecfa-7fc9-4e2a-b5a8-03b358d186ef", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b38cbe3-2e39-4d84-a9ae-3c593cb28c4d", 3, 0, 0.0, 481.3333333333333, 397, 575, 472.0, 575.0, 575.0, 575.0, 0.01816673428728874, 0.021472464907924933, 0.011649891453762634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 85.3684210526316, 83, 89, 85.0, 88.0, 89.0, 89.0, 0.0958845348338422, 0.07125794043804093, 0.04812954189901845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 102.78947368421053, 81, 252, 85.0, 251.0, 252.0, 252.0, 0.0958874382409197, 0.025657380935558596, 0.054685804621774525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 12, 0, 0.0, 585.1666666666666, 408, 705, 587.0, 696.3000000000001, 705.0, 705.0, 0.06405192476033905, 18.833392603603986, 0.03652961333988086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 12, 0, 0.0, 853.6666666666667, 574, 1095, 912.5, 1059.9, 1095.0, 1095.0, 0.06393623426236233, 57.52993597718542, 0.03640119587398168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 12, 0, 0.0, 174.58333333333331, 84, 270, 185.5, 268.2, 270.0, 270.0, 0.06422641953767683, 0.1136506564475297, 0.03556287097447535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62307062-968d-4fe2-ba65-e72b5ad7f0fe", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 86.90909090909093, 84, 90, 87.0, 89.8, 90.0, 90.0, 0.05358769626493757, 0.039824450056267086, 0.026898511601736244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 101.36363636363636, 83, 246, 85.0, 218.0000000000001, 246.0, 246.0, 0.0535892626604633, 0.014339314422819284, 0.03056262636104548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 101.9090909090909, 84, 251, 86.0, 220.80000000000013, 251.0, 251.0, 0.05358900158818314, 0.014443910584314988, 0.03150447163680298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 87.36363636363636, 83, 104, 86.0, 101.00000000000001, 104.0, 104.0, 0.05358874051844671, 0.014443840217862589, 0.031556650910765004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 12, 0, 0.0, 88.25, 81, 105, 86.5, 102.9, 105.0, 105.0, 0.0642253882959934, 0.04773000048169041, 0.036064060810738485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0861a64c-0370-4290-a7fe-5600c5e0bc6f", 3, 0, 0.0, 690.0, 182, 1666, 222.0, 1666.0, 1666.0, 1666.0, 0.025848921669151034, 0.030552550319234182, 0.0165762941693449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 559.2105263157895, 83, 1248, 267.0, 1112.0, 1248.0, 1248.0, 0.10657930902951125, 45.44155321287535, 0.058318427422295274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 94.1578947368421, 81, 249, 86.0, 95.0, 249.0, 249.0, 0.09588647041902389, 0.025844400230127528, 0.05637075702368396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95dbc520-cb0f-484b-8d01-3da102814b62", 3, 0, 0.0, 597.0, 200, 1240, 351.0, 1240.0, 1240.0, 1240.0, 0.07822481812729785, 0.03631139018539282, 0.05016370172876848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 363.6842105263158, 83, 841, 254.0, 797.0, 841.0, 841.0, 0.10658110260955415, 14.859616648108465, 0.05842349194751722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 94.26315789473685, 83, 252, 85.0, 95.0, 252.0, 252.0, 0.0958855026166649, 0.025844139377147964, 0.056463826247899356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d95c7f4a-3a13-42b9-a916-cb531cac6a46", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 518.3333333333334, 95, 2305, 444.0, 1364.2000000000005, 2305.0, 2305.0, 0.125500957990646, 0.025541405903565063, 0.0847376585495436], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 190.81818181818184, 171, 341, 174.0, 311.0000000000001, 341.0, 341.0, 0.05356525465409019, 0.08301568275004018, 0.12046951315270481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a2acba8-5e57-4978-b39b-07494ac956df", 3, 0, 0.0, 564.3333333333334, 184, 946, 563.0, 946.0, 946.0, 946.0, 0.02650083035935126, 0.026578469510794674, 0.016994347593724604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 599.4000000000001, 112, 1830, 484.0, 1456.0, 1723.1999999999998, 1830.0, 0.11521533746572345, 0.07077192115814457, 0.052094434811162056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 104.3157894736842, 82, 257, 86.0, 247.0, 257.0, 257.0, 0.10659425737463955, 0.0792170213497077, 0.05350532059625461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 172.42105263157896, 82, 676, 88.0, 267.0, 676.0, 676.0, 0.10658110260955415, 0.10434605481634393, 0.05654451794489196], "isController": false}, {"data": ["login", 25, 0, 0.0, 3341.76, 1375, 11776, 2937.0, 5952.40000000001, 10848.099999999999, 11776.0, 0.1167973239397139, 67.22208843250984, 0.2691858949127758], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8f51ecfa-7fc9-4e2a-b5a8-03b358d186ef", 3, 0, 0.0, 290.6666666666667, 181, 402, 289.0, 402.0, 402.0, 402.0, 0.05301664722722935, 0.03408459579224543, 0.0339983056763157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 101.26315789473682, 87, 257, 90.0, 115.0, 257.0, 257.0, 0.09291317019736713, 0.0752197442320482, 0.03302772846859535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 704.4210526315791, 171, 1336, 763.0, 1203.0, 1336.0, 1336.0, 0.10652493244076652, 60.453610932401524, 0.22666661585707717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21dab506-39d5-45f5-b7c9-4d69bbff66be", 3, 0, 0.0, 334.6666666666667, 251, 456, 297.0, 456.0, 456.0, 456.0, 0.043321299638989175, 0.027851421480144405, 0.02778091155234657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28dc8de9-e98d-4c4c-aaf4-f8616ee179c1", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f19136d1-d14c-41ec-9269-7834772e7e19", 3, 0, 0.0, 957.6666666666666, 274, 1838, 761.0, 1838.0, 1838.0, 1838.0, 0.02839403346710078, 0.028477219112023926, 0.018208413388733247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 331.04347826086956, 170, 1017, 330.0, 805.2000000000007, 1014.4, 1017.0, 0.12470044783726049, 13.149072396403747, 0.2776798143183223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 6, 33.333333333333336, 657.1666666666667, 82, 1181, 861.0, 1077.5000000000002, 1181.0, 1181.0, 0.09585940620423379, 76.46266725469312, 0.16527322427106908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9553b3b-be93-48b2-be1b-e4dc2376fd60", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["register", 25, 12, 48.0, 848.92, 182, 1737, 892.0, 1531.0000000000007, 1732.8, 1737.0, 0.11679677827766799, 0.03589675982377702, 0.05269542144949474], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da52175d-e32a-459f-a79a-97e91664f7ba", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 199.5263157894737, 169, 338, 175.0, 337.0, 338.0, 338.0, 0.09584245518104136, 0.14853708630108656, 0.21555192800970532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 109.76923076923079, 85, 260, 92.0, 211.59999999999997, 260.0, 260.0, 0.07515406583496168, 0.05834715072147903, 0.02671492183977153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 354.85714285714283, 168, 919, 340.5, 762.5, 919.0, 919.0, 0.0802315252586034, 6.971518480114043, 0.1789762958824035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 86.5, 84, 90, 85.0, 90.0, 90.0, 90.0, 0.03815580286168521, 0.02835602146263911, 0.019152424483306837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 85.16666666666667, 82, 88, 84.5, 88.0, 88.0, 88.0, 0.03815580286168521, 0.010209658187599365, 0.02176073131955485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 139.33333333333331, 84, 252, 85.5, 252.0, 252.0, 252.0, 0.038115324266121194, 0.010273270993602979, 0.022407641804887656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 85.66666666666667, 83, 88, 86.0, 88.0, 88.0, 88.0, 0.03815628815628816, 0.010284312042124542, 0.022468986092032968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 105.0, 95, 117, 103.0, 117.0, 117.0, 117.0, 0.232252070914299, 0.06849621622667802, 0.14356988368042115], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 988.8363636363632, 655, 1571, 940.0, 1339.3999999999999, 1438.1999999999998, 1571.0, 0.2558175230352051, 306.046694110848, 0.5051396792745945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 12, 48.0, 848.92, 182, 1737, 892.0, 1531.0000000000007, 1732.8, 1737.0, 0.11754914729848549, 0.0361279957400189, 0.05303486919130889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 95.5, 85, 123, 87.0, 123.0, 123.0, 123.0, 0.033046107581603236, 0.008906958684103995, 0.01945976842940112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 92.75, 85, 114, 86.0, 114.0, 114.0, 114.0, 0.03304856486607069, 0.008907620999058116, 0.01942894145446734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 165.69230769230768, 83, 1028, 86.0, 682.3999999999996, 1028.0, 1028.0, 0.071770467004908, 4.98548653648148, 0.04171874051111614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 149.23076923076923, 83, 489, 89.0, 406.5999999999999, 489.0, 489.0, 0.07176888211685077, 1.6411201362780659, 0.041787906046252286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 90.30769230769232, 84, 116, 87.0, 108.39999999999999, 116.0, 116.0, 0.0717692783323028, 0.053336348448127374, 0.036024813537894176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 94.5, 84, 122, 86.0, 122.0, 122.0, 122.0, 0.03304638059516531, 0.008842488557690719, 0.01884676393318022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 115.46153846153847, 82, 273, 87.0, 262.2, 273.0, 273.0, 0.07177086323785968, 0.027496349347437228, 0.04046815651016938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 134.0, 87, 268, 90.5, 268.0, 268.0, 268.0, 0.033055938912624885, 0.024565985852058145, 0.016592531837001163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 147.0, 92, 252, 122.0, 252.0, 252.0, 252.0, 0.03613728554779608, 0.028443996241722305, 0.012845675722068137], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 654.5333333333333, 86, 2274, 456.0, 1909.2000000000003, 2274.0, 2274.0, 0.12286219775899351, 0.02433247432180067, 0.08360388613131513], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 2051.5199999999995, 940, 9959, 1363.0, 4394.800000000009, 9085.699999999997, 9959.0, 0.11597376209606339, 0.060025482334876555, 0.05334340033910728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 231.25, 174, 392, 179.5, 392.0, 392.0, 392.0, 0.03302210004045208, 0.05117780543378656, 0.0742674769464464], "isController": false}, {"data": ["addBook", 54, 19, 35.18518518518518, 936.7222222222222, 429, 4347, 728.0, 1613.0, 1700.75, 4347.0, 0.2444600375744132, 71.46657189360329, 0.8868086718237171], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 162.09090909090907, 84, 361, 88.0, 340.4, 345.2, 361.0, 0.2570814246985136, 0.19105367597223522, 0.12427275900953538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a2acba8-5e57-4978-b39b-07494ac956df", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 558.672727272727, 406, 871, 508.0, 750.0, 805.1999999999997, 871.0, 0.25673581417928565, 75.48885380004015, 0.12912006279524618], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 143.7454545454545, 82, 382, 90.0, 254.0, 279.7999999999996, 382.0, 0.2574327866397064, 0.45553536073354306, 0.1251968044400135], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 821.0545454545454, 567, 1195, 786.0, 1075.8, 1146.1999999999998, 1195.0, 0.2562656962738968, 230.58832397429654, 0.12863336707498332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 104.42857142857144, 84, 281, 91.5, 188.0, 281.0, 281.0, 0.08431703204047218, 0.06299075147554806, 0.029972069983136593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 19, 11.656441717791411, 161.39877300613497, 82, 3728, 92.0, 277.0, 323.9999999999998, 1757.4399999999546, 0.6987850571460418, 1.6453467560082653, 0.3307833238482908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 92.66666666666666, 87, 97, 93.0, 97.0, 97.0, 97.0, 0.03746511061573909, 0.029013508513946386, 0.013317676039188505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b38cbe3-2e39-4d84-a9ae-3c593cb28c4d", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d95c7f4a-3a13-42b9-a916-cb531cac6a46", 3, 0, 0.0, 319.3333333333333, 200, 520, 238.0, 520.0, 520.0, 520.0, 0.06021557174685374, 0.026657935408763375, 0.03861480349651753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95dbc520-cb0f-484b-8d01-3da102814b62", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 98.0, 84, 250, 90.0, 104.80000000000001, 221.1999999999996, 250.0, 0.1209762255417631, 0.09817504240742689, 0.0430032676730486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0861a64c-0370-4290-a7fe-5600c5e0bc6f", 1, 0, 0.0, 2305.0, 2305, 2305, 2305.0, 2305.0, 2305.0, 2305.0, 0.4338394793926247, 0.07837920281995661, 0.2991119848156182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62307062-968d-4fe2-ba65-e72b5ad7f0fe", 3, 0, 0.0, 320.6666666666667, 264, 416, 282.0, 416.0, 416.0, 416.0, 0.03038743985819195, 0.025332758293238795, 0.01948673714864523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f19136d1-d14c-41ec-9269-7834772e7e19", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 228.0, 170, 338, 179.0, 338.0, 338.0, 338.0, 0.03809451248547646, 0.05903905401801871, 0.08567545141997296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f587c818-bd6a-4555-87ef-214fa42fc8f0", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.7769730839416059, 1.451775395377129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 285.46153846153845, 171, 1113, 185.0, 815.7999999999997, 1113.0, 1113.0, 0.07173442811106696, 6.704108244493003, 0.15992056964033463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21dab506-39d5-45f5-b7c9-4d69bbff66be", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 90.72727272727273, 86, 111, 89.0, 107.20000000000002, 111.0, 111.0, 0.05233908111605953, 0.043394413933139205, 0.018604907740474286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 107.15789473684211, 85, 258, 89.0, 252.0, 258.0, 258.0, 0.10308942736535978, 0.0800352487846299, 0.03664506988378023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28dc8de9-e98d-4c4c-aaf4-f8616ee179c1", 3, 0, 0.0, 283.0, 187, 367, 295.0, 367.0, 367.0, 367.0, 0.050747682522498144, 0.03262587011130658, 0.03254327297178429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9553b3b-be93-48b2-be1b-e4dc2376fd60", 3, 0, 0.0, 286.3333333333333, 207, 418, 234.0, 418.0, 418.0, 418.0, 0.06721333512568894, 0.04321169820092306, 0.04310230149661693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 97.14285714285714, 82, 254, 85.0, 171.0, 254.0, 254.0, 0.08034986627486541, 0.05971313304216072, 0.0403318664700008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 214.0, 81, 519, 253.5, 392.5, 519.0, 519.0, 0.08027062668424975, 0.03009028653746918, 0.04529780760850869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 186.64285714285714, 82, 832, 87.5, 550.0, 832.0, 832.0, 0.08027522935779816, 5.179504954486812, 0.046700293864678895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 180.0714285714286, 83, 664, 86.0, 587.0, 664.0, 664.0, 0.08035078858559655, 1.7076672408400102, 0.04682271818108772], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 12, 27.906976744186046, 0.9230769230769231], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 6.976744186046512, 0.23076923076923078], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.976744186046512, 0.23076923076923078], "isController": false}, {"data": ["401/Unauthorized", 25, 58.13953488372093, 1.9230769230769231], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 43, "401/Unauthorized", 25, "406/Not Acceptable", 12, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 12, "406/Not Acceptable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
