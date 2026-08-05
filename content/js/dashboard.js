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

    var data = {"OkPercent": 98.14677538917717, "KoPercent": 1.8532246108228316};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8029336734693877, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3706896551724138, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80c2291f-a614-41c1-8ebb-076ddc7f68a9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3f8d9cf-b76e-4190-a53c-047e53a9b07a"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91d94118-8707-4269-b224-1a06bd318e53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63c7c5c6-8711-4733-8c6b-1b4943590fc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6f4c11c0-d96e-4987-9a20-7fa0e0e97121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f72ccc5-bcaf-4536-906f-0abf8c712e79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9899ab41-95bd-4b4e-85bc-10fc364eb9cf"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e0d8243-4fb8-47b7-ad09-7e9c8c5afb9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4383b2fc-a623-4f23-bdb4-a71408ae1619"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c48c4c4-e094-4efd-a70d-17ed9bba982e"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb3af7b0-f4a9-4df3-9d1a-41f253af8bac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0046649-ab7b-49b2-bf4c-4d859811752e"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dad6a546-0fe2-47ff-9def-2da058fc19a7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/14865ab6-5a0b-4b97-96f1-d160034df644"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc46c8ad-62ba-430e-b284-84a2c5278efc"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f4c11c0-d96e-4987-9a20-7fa0e0e97121"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80c2291f-a614-41c1-8ebb-076ddc7f68a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3f8d9cf-b76e-4190-a53c-047e53a9b07a"], "isController": false}, {"data": [0.35833333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4383b2fc-a623-4f23-bdb4-a71408ae1619"], "isController": false}, {"data": [0.8362068965517241, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/63c7c5c6-8711-4733-8c6b-1b4943590fc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9157303370786517, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9899ab41-95bd-4b4e-85bc-10fc364eb9cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f72ccc5-bcaf-4536-906f-0abf8c712e79"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91d94118-8707-4269-b224-1a06bd318e53"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb3af7b0-f4a9-4df3-9d1a-41f253af8bac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0046649-ab7b-49b2-bf4c-4d859811752e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14865ab6-5a0b-4b97-96f1-d160034df644"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc46c8ad-62ba-430e-b284-84a2c5278efc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1349, 25, 1.8532246108228316, 326.6389918458119, 77, 4174, 103.0, 875.0, 1089.5, 1946.5, 5.294909586180639, 754.7315250978322, 3.877689802539908], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1369.1896551724142, 1052, 1916, 1331.5, 1667.6000000000001, 1753.1999999999998, 1916.0, 0.2686516005613892, 323.27824322986385, 1.3209578211197213], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/80c2291f-a614-41c1-8ebb-076ddc7f68a9", 3, 0, 0.0, 555.0, 230, 1024, 411.0, 1024.0, 1024.0, 1024.0, 0.028086205928061863, 0.028168489734491736, 0.018011010962982382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3f8d9cf-b76e-4190-a53c-047e53a9b07a", 3, 0, 0.0, 339.0, 191, 631, 195.0, 631.0, 631.0, 631.0, 0.04210585411725077, 0.02707000712290699, 0.027001475459304695], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 592.4, 86, 1547, 472.0, 1463.6000000000001, 1547.0, 1547.0, 0.08600522911793038, 0.016848290001032065, 0.057907947886564844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 592.4, 86, 1547, 472.0, 1463.6000000000001, 1547.0, 1547.0, 0.08649421642006205, 0.016944081849477, 0.058237186602622504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 108.69565217391303, 78, 244, 81.0, 241.6, 243.6, 244.0, 0.10764716068912904, 0.028804025418770855, 0.0613925213305189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 97.73913043478261, 78, 245, 84.0, 185.2000000000002, 244.0, 245.0, 0.10763456660707767, 0.07999014178514269, 0.054027507066443284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 108.21739130434784, 78, 243, 81.0, 237.6, 242.0, 243.0, 0.10764716068912904, 0.02901427377949181, 0.06338988075736798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 119.8695652173913, 78, 340, 82.0, 242.2, 320.59999999999974, 340.0, 0.10764716068912904, 0.02901427377949181, 0.06328475657700751], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 191.0, 83, 255, 199.0, 251.4, 255.0, 255.0, 0.0858138297568036, 0.17141535967436514, 0.055466126420934], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 82.6, 79, 89, 82.0, 87.2, 89.0, 89.0, 0.14875049583498612, 0.11054602278361761, 0.07466577622967076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 110.93333333333334, 78, 496, 81.0, 266.20000000000016, 496.0, 496.0, 0.14875492130864665, 0.0546984241895336, 0.08400391845255213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 615.0000000000001, 461, 714, 618.0, 714.0, 714.0, 714.0, 0.06468783499057407, 19.020371325499944, 0.03689228089306177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91d94118-8707-4269-b224-1a06bd318e53", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 831.7142857142858, 649, 925, 874.0, 925.0, 925.0, 925.0, 0.06444248048313449, 57.985457216522136, 0.036689420040690826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63c7c5c6-8711-4733-8c6b-1b4943590fc8", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 128.7142857142857, 78, 240, 83.0, 240.0, 240.0, 240.0, 0.06482081674229095, 0.11470246087600704, 0.03589199520788962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f4c11c0-d96e-4987-9a20-7fa0e0e97121", 3, 0, 0.0, 869.6666666666666, 171, 2167, 271.0, 2167.0, 2167.0, 2167.0, 0.09082927124648037, 0.042694488177056525, 0.058246635532410905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 108.33333333333333, 80, 247, 84.0, 220.3000000000001, 247.0, 247.0, 0.06206104738360968, 0.04612154009660836, 0.03115173667497595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 151.58333333333331, 79, 259, 102.0, 253.9, 259.0, 259.0, 0.06206072642080276, 0.039909168308690054, 0.034090975206739794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 306.83333333333337, 79, 920, 96.0, 909.5, 920.0, 920.0, 0.06205944260277302, 13.97284410506405, 0.03515085616172691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 249.33333333333337, 78, 651, 90.5, 650.7, 651.0, 651.0, 0.06200781298443604, 4.570623750155019, 0.03518216732808334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f72ccc5-bcaf-4536-906f-0abf8c712e79", 3, 0, 0.0, 1282.6666666666667, 176, 3204, 468.0, 3204.0, 3204.0, 3204.0, 0.020597322348094745, 0.02434533771026433, 0.013208569344318572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 102.85714285714286, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.06491699897987574, 0.0482439806871928, 0.036452416419363816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 575.9411764705883, 79, 1103, 779.0, 1026.1999999999998, 1103.0, 1103.0, 0.08391249407676513, 44.42378917664567, 0.04508946861179118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 151.20000000000002, 78, 815, 81.0, 471.2000000000002, 815.0, 815.0, 0.14875639652505057, 8.960839336273752, 0.08660024073743504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 402.6470588235295, 80, 650, 615.0, 643.6, 650.0, 650.0, 0.08398421096833794, 14.535289424411738, 0.045210020736689734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 169.93333333333334, 79, 783, 82.0, 457.20000000000016, 783.0, 783.0, 0.14875049583498612, 2.9532590303946846, 0.0867420697391908], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 488.2307692307692, 86, 839, 483.0, 798.5999999999999, 839.0, 839.0, 0.09650288395157039, 0.018282772936137358, 0.06600501490227227], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9899ab41-95bd-4b4e-85bc-10fc364eb9cf", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.2622119920174166, 1.000657656023222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 457.74999999999994, 163, 1133, 322.0, 1093.4, 1133.0, 1133.0, 0.06198123001750969, 18.609818916348583, 0.13543261930095501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e0d8243-4fb8-47b7-ad09-7e9c8c5afb9d", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4383b2fc-a623-4f23-bdb4-a71408ae1619", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c48c4c4-e094-4efd-a70d-17ed9bba982e", 2, 0, 0.0, 196.0, 187, 205, 196.0, 205.0, 205.0, 205.0, 0.031628054083972484, 0.03658538092037637, 0.019659430102000476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 744.6363636363636, 155, 1644, 608.0, 1419.4999999999998, 1628.5499999999997, 1644.0, 0.09700860730915761, 0.05958829491939467, 0.0438622902188867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 102.0, 79, 242, 83.0, 238.0, 242.0, 242.0, 0.08398130674913303, 0.062411889097744366, 0.04215467936431091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 138.1764705882353, 79, 253, 83.0, 245.79999999999998, 253.0, 253.0, 0.08391249407676513, 0.09658999059686463, 0.04371085111949139], "isController": false}, {"data": ["login", 22, 0, 0.0, 3445.636363636364, 2173, 6122, 3014.0, 5104.3, 5980.999999999998, 6122.0, 0.0929674360426298, 35.514084665602475, 0.18931880752360106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb3af7b0-f4a9-4df3-9d1a-41f253af8bac", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 97.0, 81, 240, 86.0, 152.40000000000003, 240.0, 240.0, 0.1461589429785244, 0.11832594114179366, 0.05195493676189734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0046649-ab7b-49b2-bf4c-4d859811752e", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 689.1764705882352, 162, 1185, 864.0, 1108.1999999999998, 1185.0, 1185.0, 0.08387647462243251, 59.080246080316655, 0.1760162852959606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dad6a546-0fe2-47ff-9def-2da058fc19a7", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14865ab6-5a0b-4b97-96f1-d160034df644", 3, 0, 0.0, 1318.0, 249, 3239, 466.0, 3239.0, 3239.0, 3239.0, 0.020031516252236852, 0.02367657405985417, 0.01284573145081595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 247.43478260869566, 162, 490, 171.0, 457.6000000000001, 488.4, 490.0, 0.10759327869465964, 0.16674856766447738, 0.2419798055017589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 680.4, 83, 1111, 870.0, 1100.5, 1111.0, 1111.0, 0.0919920886803735, 77.04554830159607, 0.16333087541971392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc46c8ad-62ba-430e-b284-84a2c5278efc", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1254.3478260869567, 267, 3078, 1189.0, 2649.400000000001, 3059.3999999999996, 3078.0, 0.10074816463126171, 0.031586466017206036, 0.04545473833949503], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 294.2, 164, 895, 175.0, 704.8000000000001, 895.0, 895.0, 0.14862963476744417, 12.069171457908087, 0.33173631306850837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 100.55555555555554, 83, 247, 89.5, 142.60000000000016, 247.0, 247.0, 0.1114240614070383, 0.08650598517440962, 0.03960777182828314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 247.66666666666666, 165, 491, 173.0, 489.2, 491.0, 491.0, 0.08522485156671684, 0.13208187444958952, 0.1916726886310048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 82.25, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.03985870090529075, 0.029621554090748296, 0.02000719947785102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 140.125, 79, 250, 85.5, 250.0, 250.0, 250.0, 0.03982596055238607, 0.01065655585093143, 0.022713243127532683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 119.625, 79, 285, 82.5, 285.0, 285.0, 285.0, 0.03984024063505343, 0.010738189858666747, 0.02342170396709196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 142.625, 78, 258, 86.0, 258.0, 258.0, 258.0, 0.03983032282476649, 0.010735516698862845, 0.023454770179037302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 931.0344827586209, 620, 1534, 911.5, 1276.8, 1373.75, 1534.0, 0.27932019244198086, 334.1640575712628, 0.5515482706227396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f4c11c0-d96e-4987-9a20-7fa0e0e97121", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1254.3478260869567, 267, 3078, 1189.0, 2649.400000000001, 3059.3999999999996, 3078.0, 0.09906448667367297, 0.03105860095101907, 0.044695110198473546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 81.42857142857143, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.036402591864540756, 0.009811636088489499, 0.021436291888982495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 81.85714285714285, 79, 88, 81.0, 88.0, 88.0, 88.0, 0.03640278117248157, 0.009811687112895425, 0.021400853775228428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 150.61111111111111, 77, 718, 81.5, 285.1000000000007, 718.0, 718.0, 0.10868843253165551, 5.460892024457917, 0.06337799874404479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 154.61111111111111, 78, 637, 81.0, 278.8000000000006, 637.0, 637.0, 0.10874161783362532, 1.8039946497613726, 0.06351520494774361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 104.28571428571428, 80, 237, 81.0, 237.0, 237.0, 237.0, 0.036402591864540756, 0.009740537276254069, 0.020760853172745897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 92.0, 79, 249, 82.0, 108.60000000000022, 249.0, 249.0, 0.10899644550480493, 0.08100224123941069, 0.054711106435029036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 83.57142857142858, 81, 89, 82.0, 89.0, 89.0, 89.0, 0.03640221325456588, 0.027052816686254526, 0.018272204700045765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 125.83333333333333, 78, 253, 81.5, 244.9, 253.0, 253.0, 0.10899446550325166, 0.03825923349642135, 0.06165235988155935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 141.57142857142858, 83, 264, 109.0, 264.0, 264.0, 264.0, 0.03553173237499175, 0.02796735966234702, 0.012630420492672849], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 679.0769230769231, 91, 2167, 474.0, 1752.9999999999995, 2167.0, 2167.0, 0.09482683161672453, 0.017765784108481893, 0.06453809303241619], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1866.8636363636363, 1161, 4174, 1474.5, 3731.4999999999995, 4131.249999999999, 4174.0, 0.09429110234870564, 0.048803011957826166, 0.0433702238342191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 189.7142857142857, 165, 318, 169.0, 318.0, 318.0, 318.0, 0.036386507882877034, 0.056391980478638526, 0.08183410903736894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80c2291f-a614-41c1-8ebb-076ddc7f68a9", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3f8d9cf-b76e-4190-a53c-047e53a9b07a", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 905.9166666666665, 426, 1985, 696.5, 1476.5, 1775.9499999999991, 1985.0, 0.2723496970109621, 82.49984307976442, 0.9903306992011075], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 139.3275862068965, 79, 349, 84.0, 339.0, 341.1, 349.0, 0.2805781845623948, 0.20851562348826408, 0.13563105601404826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4383b2fc-a623-4f23-bdb4-a71408ae1619", 3, 0, 0.0, 334.6666666666667, 198, 474, 332.0, 474.0, 474.0, 474.0, 0.06997900629811057, 0.03166367797993935, 0.04487586015861909], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 512.3793103448273, 384, 790, 474.0, 660.5000000000001, 720.3, 790.0, 0.2804533673745696, 82.4626019363371, 0.141048324412015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63c7c5c6-8711-4733-8c6b-1b4943590fc8", 3, 0, 0.0, 576.3333333333334, 190, 1028, 511.0, 1028.0, 1028.0, 1028.0, 0.02583801288455576, 0.025913710187928478, 0.01656929862714025], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 129.9655172413793, 78, 329, 87.5, 244.3, 317.1, 329.0, 0.2807696962362338, 0.49683075154302314, 0.13654619992738715], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 788.8965517241379, 539, 1191, 779.0, 1029.3, 1090.7999999999997, 1191.0, 0.2798403944784595, 251.80087885866132, 0.1404667605096955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 105.5, 83, 248, 87.0, 237.20000000000002, 248.0, 248.0, 0.08172085970344407, 0.06105122819642063, 0.029049211847708638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 155.747191011236, 80, 1196, 90.0, 279.69999999999993, 413.9499999999997, 1112.260000000001, 0.747067340985877, 1.6055480177008794, 0.3581760657776006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 118.375, 83, 238, 103.5, 238.0, 238.0, 238.0, 0.03839471688695635, 0.029733408682965225, 0.013648122018410267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9899ab41-95bd-4b4e-85bc-10fc364eb9cf", 3, 0, 0.0, 318.6666666666667, 181, 520, 255.0, 520.0, 520.0, 520.0, 0.02505972567953623, 0.025133142844612995, 0.01607020168902551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 96.65217391304347, 82, 241, 87.0, 113.60000000000002, 216.79999999999967, 241.0, 0.10458348490360131, 0.0848719491746999, 0.03717616064932703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f72ccc5-bcaf-4536-906f-0abf8c712e79", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91d94118-8707-4269-b224-1a06bd318e53", 3, 0, 0.0, 398.3333333333333, 199, 593, 403.0, 593.0, 593.0, 593.0, 0.025138471078189027, 0.0297128217724298, 0.01612069922657304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb3af7b0-f4a9-4df3-9d1a-41f253af8bac", 3, 0, 0.0, 378.3333333333333, 210, 511, 414.0, 511.0, 511.0, 511.0, 0.019270174266609284, 0.02656549089163096, 0.012357501075918062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0046649-ab7b-49b2-bf4c-4d859811752e", 3, 0, 0.0, 389.3333333333333, 224, 623, 321.0, 623.0, 623.0, 623.0, 0.023399110833788313, 0.023467662916309178, 0.015005289174011387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 232.25, 164, 365, 170.0, 365.0, 365.0, 365.0, 0.03980911529217403, 0.06169635348503923, 0.08953163331823905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 279.5, 158, 800, 244.0, 523.7000000000004, 800.0, 800.0, 0.10852460795485376, 7.371801303124303, 0.24253177359355124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 89.83333333333333, 81, 107, 88.5, 104.30000000000001, 107.0, 107.0, 0.06213109661385524, 0.05151298928238584, 0.022085663249456353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14865ab6-5a0b-4b97-96f1-d160034df644", 1, 0, 0.0, 839.0, 839, 839, 839.0, 839.0, 839.0, 839.0, 1.1918951132300357, 0.21533261323003577, 0.8217558104886771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 97.29411764705883, 82, 242, 87.0, 128.3999999999999, 242.0, 242.0, 0.08421720111563022, 0.06538347156926369, 0.029936583209071676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc46c8ad-62ba-430e-b284-84a2c5278efc", 3, 0, 0.0, 558.3333333333333, 201, 1132, 342.0, 1132.0, 1132.0, 1132.0, 0.0435369410945187, 0.027990058158097148, 0.027919197251367787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 100.94444444444443, 79, 247, 83.0, 245.2, 247.0, 247.0, 0.08525835650308114, 0.06336094658090308, 0.04279569847908565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 126.16666666666669, 80, 244, 82.0, 237.70000000000002, 244.0, 244.0, 0.08526239502067613, 0.022814351792641855, 0.048626209660229354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 118.11111111111113, 79, 241, 82.0, 238.3, 241.0, 241.0, 0.08526279889347835, 0.022980988764257835, 0.05012520013073629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 125.38888888888889, 78, 243, 84.0, 238.5, 243.0, 243.0, 0.08526279889347835, 0.022980988764257835, 0.05020846458278071], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5189028910303929], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.14825796886582654], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07412898443291327], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.111934766493699], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1349, 25, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
