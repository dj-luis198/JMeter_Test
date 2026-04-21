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

    var data = {"OkPercent": 99.23896499238965, "KoPercent": 0.76103500761035};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8065359477124183, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3103448275862069, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=339e327e-27a7-49c1-b7f4-f9ce54cc8e42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5822ea9-0c81-4639-9b3b-8e8977f6cdce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0eab027e-ff03-4407-a698-26a48a3167f8"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7eb4c19d-8e28-4cac-b856-2128872cbc6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebe6377c-7771-4dd8-8f64-11ef858db925"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0efe1555-8f7d-4b84-aab8-f9c1ac09b0b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11c1820b-7e59-4215-a92e-9322e5b7e051"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c49e848-780e-49a4-86f2-8327c0e9a47b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8b8a03e2-b2af-4ffb-90ff-9d89020732d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9ba8100-91ac-4513-ac73-3de07841a7eb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e097f219-c1db-4dfb-8dbc-a49ded70ad7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc47f727-7e0d-47af-9bd5-08f33f3f3c71"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad580428-5195-4144-be31-3e1bc37ed5f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9d4e3b7-508b-4b12-9aef-d6c40dbe3181"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5822ea9-0c81-4639-9b3b-8e8977f6cdce"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44ae3c16-145a-487a-9cce-660aad3287a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b485ac3-e740-433f-86e7-b74268aeb935"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0efe1555-8f7d-4b84-aab8-f9c1ac09b0b6"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/339e327e-27a7-49c1-b7f4-f9ce54cc8e42"], "isController": false}, {"data": [0.4827586206896552, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0eab027e-ff03-4407-a698-26a48a3167f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e097f219-c1db-4dfb-8dbc-a49ded70ad7d"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b92a187-a40f-4b4e-bb9b-9707b5fe0228"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/11c1820b-7e59-4215-a92e-9322e5b7e051"], "isController": false}, {"data": [0.6982758620689655, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eb4c19d-8e28-4cac-b856-2128872cbc6c"], "isController": false}, {"data": [0.9597701149425287, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31833b3c-5d38-4f6e-b07d-0e320726dec7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b92a187-a40f-4b4e-bb9b-9707b5fe0228"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc47f727-7e0d-47af-9bd5-08f33f3f3c71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/ad580428-5195-4144-be31-3e1bc37ed5f6"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9ba8100-91ac-4513-ac73-3de07841a7eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b8a03e2-b2af-4ffb-90ff-9d89020732d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44ae3c16-145a-487a-9cce-660aad3287a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b485ac3-e740-433f-86e7-b74268aeb935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 10, 0.76103500761035, 327.5015220700153, 81, 2668, 104.0, 916.5, 1106.0, 1655.249999999996, 5.112024929875001, 729.381272254475, 3.7288137215949986], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1422.6034482758623, 1004, 1898, 1427.0, 1699.5, 1778.1499999999996, 1898.0, 0.25286213781858446, 304.2781743053921, 1.2433211561685282], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=339e327e-27a7-49c1-b7f4-f9ce54cc8e42", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5822ea9-0c81-4639-9b3b-8e8977f6cdce", 3, 0, 0.0, 269.3333333333333, 171, 419, 218.0, 419.0, 419.0, 419.0, 0.09218572350428664, 0.04171163921580678, 0.05911649586700673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0eab027e-ff03-4407-a698-26a48a3167f8", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 692.7333333333332, 88, 1354, 549.0, 1224.4, 1354.0, 1354.0, 0.09203131518884826, 0.017327771062900336, 0.06225894506037254], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 692.7333333333332, 88, 1354, 549.0, 1224.4, 1354.0, 1354.0, 0.09216419973825367, 0.017352790731968076, 0.0623488411119918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 133.71428571428572, 84, 266, 86.0, 261.0, 266.0, 266.0, 0.08911861687906604, 0.0334070484868932, 0.05029084895031001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 111.0, 84, 260, 86.5, 258.0, 260.0, 260.0, 0.0891197514832073, 0.06623059656125073, 0.04473393775621928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 157.64285714285717, 84, 751, 86.0, 503.5, 751.0, 751.0, 0.0891197514832073, 1.8940309460379903, 0.05193264536068036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 198.07142857142858, 82, 746, 87.5, 539.0, 746.0, 746.0, 0.0891197514832073, 5.750169735330251, 0.051845614353372545], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 400.2, 89, 2137, 220.0, 1133.2000000000007, 2137.0, 2137.0, 0.09209912321634699, 0.19067396603384337, 0.05953464807390034], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7eb4c19d-8e28-4cac-b856-2128872cbc6c", 3, 0, 0.0, 311.0, 220, 452, 261.0, 452.0, 452.0, 452.0, 0.019693697360388097, 0.02327728356626601, 0.012629096289050961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebe6377c-7771-4dd8-8f64-11ef858db925", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.7531507959905661, 1.4072634139150944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0efe1555-8f7d-4b84-aab8-f9c1ac09b0b6", 3, 0, 0.0, 641.6666666666666, 217, 1121, 587.0, 1121.0, 1121.0, 1121.0, 0.029682692022281805, 0.024300771626314697, 0.019034799246059622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 87.5, 84, 101, 86.0, 97.5, 101.0, 101.0, 0.07950254124194327, 0.059083431528436356, 0.039906549021834804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 109.35714285714286, 82, 257, 85.0, 255.5, 257.0, 257.0, 0.07950344420277922, 0.02980270013572374, 0.044864876088203394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 621.6666666666666, 523, 673, 669.0, 673.0, 673.0, 673.0, 0.0245935909102088, 7.231332311674578, 0.014026032315978456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 742.3333333333334, 574, 917, 736.0, 917.0, 917.0, 917.0, 0.02458009012699713, 22.117208303461698, 0.013994328656288406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 199.33333333333334, 85, 258, 255.0, 258.0, 258.0, 258.0, 0.024677343730720825, 0.04366733089850208, 0.013664115132147176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 95.74999999999999, 83, 245, 86.0, 135.1000000000001, 245.0, 245.0, 0.07321682705727844, 0.054412114639246965, 0.036751415143985465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11c1820b-7e59-4215-a92e-9322e5b7e051", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 97.8125, 82, 251, 86.0, 148.8000000000001, 251.0, 251.0, 0.07321816725775082, 0.0333378618007093, 0.040988588262212564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 177.8125, 83, 896, 87.0, 776.3000000000002, 896.0, 896.0, 0.07321816725775082, 8.252497211417458, 0.04225775082942455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 157.9375, 84, 658, 87.0, 653.1, 658.0, 658.0, 0.07321749715138175, 2.7083145046149903, 0.04232886554064258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 84.66666666666667, 84, 85, 85.0, 85.0, 85.0, 85.0, 0.024711696869851727, 0.018364845037067545, 0.013876196972817133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 551.1, 83, 1066, 572.5, 1010.0, 1063.25, 1066.0, 0.10534965550662649, 47.41110011706981, 0.057407331809274986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 146.21428571428572, 82, 581, 87.5, 420.5, 581.0, 581.0, 0.07950299271979738, 5.129678830979477, 0.04625104347677945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 380.04999999999995, 82, 753, 369.5, 738.1, 752.3, 753.0, 0.10544852530237364, 15.51689466614997, 0.05756418519924499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 132.71428571428572, 84, 740, 86.0, 415.5, 740.0, 740.0, 0.07950254124194327, 1.6896397363638944, 0.04632842002896164], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 736.9999999999999, 172, 2668, 555.0, 1919.0, 2668.0, 2668.0, 0.08870415895785286, 0.01602565371797146, 0.061157359593988395], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5c49e848-780e-49a4-86f2-8327c0e9a47b", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 275.125, 170, 980, 174.5, 973.7, 980.0, 980.0, 0.0731876898305705, 11.043988446065246, 0.16226011019321548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b8a03e2-b2af-4ffb-90ff-9d89020732d3", 3, 0, 0.0, 772.3333333333334, 194, 1711, 412.0, 1711.0, 1711.0, 1711.0, 0.03873366730362031, 0.024902015925992872, 0.02483897284769922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9ba8100-91ac-4513-ac73-3de07841a7eb", 3, 0, 0.0, 413.66666666666663, 196, 843, 202.0, 843.0, 843.0, 843.0, 0.020429704790765776, 0.024147219432054206, 0.013101080220640812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 478.8571428571428, 134, 966, 397.0, 949.8000000000001, 965.5, 966.0, 0.0960680710903726, 0.059010563199066765, 0.0434370282371509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 95.85, 82, 252, 87.0, 104.70000000000003, 244.6999999999999, 252.0, 0.10544796933573052, 0.07836514127391692, 0.05292993773297411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 119.6, 81, 255, 86.5, 254.9, 255.0, 255.0, 0.10535354014233263, 0.10730834215669233, 0.05566041525097847], "isController": false}, {"data": ["login", 21, 0, 0.0, 2485.0, 1391, 3456, 2476.0, 3392.2000000000003, 3454.2, 3456.0, 0.09281726931593673, 15.993562770164552, 0.1620288073312383], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e097f219-c1db-4dfb-8dbc-a49ded70ad7d", 1, 0, 0.0, 863.0, 863, 863, 863.0, 863.0, 863.0, 863.0, 1.1587485515643106, 0.20934422074159909, 0.7989028099652375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 104.21428571428574, 87, 263, 90.0, 189.0, 263.0, 263.0, 0.08001874724935557, 0.0647808022165193, 0.02844416406129436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc47f727-7e0d-47af-9bd5-08f33f3f3c71", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad580428-5195-4144-be31-3e1bc37ed5f6", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9d4e3b7-508b-4b12-9aef-d6c40dbe3181", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 657.2500000000001, 169, 1153, 742.5, 1096.5, 1150.2, 1153.0, 0.10530195335123467, 63.070471275601534, 0.22335531511609538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5822ea9-0c81-4639-9b3b-8e8977f6cdce", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 335.1428571428571, 171, 838, 335.5, 679.0, 838.0, 838.0, 0.08907042289364354, 7.739552466853079, 0.1986936470520871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 667.75, 89, 1003, 789.5, 1003.0, 1003.0, 1003.0, 0.029582735515553123, 26.545406147847117, 0.054803173118168236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44ae3c16-145a-487a-9cce-660aad3287a3", 3, 0, 0.0, 634.6666666666667, 168, 1344, 392.0, 1344.0, 1344.0, 1344.0, 0.03047448777465132, 0.025107724139857582, 0.019542558891947625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b485ac3-e740-433f-86e7-b74268aeb935", 1, 0, 0.0, 1170.0, 1170, 1170, 1170.0, 1170.0, 1170.0, 1170.0, 0.8547008547008547, 0.15441372863247865, 0.5892761752136753], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1142.3181818181822, 416, 1929, 1123.5, 1641.8999999999999, 1888.9499999999994, 1929.0, 0.09423173296440182, 0.030099944531775367, 0.04251470764604848], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 258.2857142857143, 170, 826, 176.0, 587.5, 826.0, 826.0, 0.0794641843569077, 6.904842304390396, 0.17726455187876036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 93.82352941176471, 87, 108, 91.0, 104.0, 108.0, 108.0, 0.12234000446181194, 0.09498076518275438, 0.04348804846103471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 339.59999999999997, 172, 1106, 336.0, 747.8000000000002, 1106.0, 1106.0, 0.07733353955610549, 6.279715009795582, 0.17260584222669037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 110.99999999999999, 83, 259, 86.5, 256.5, 259.0, 259.0, 0.06357019284472072, 0.04724308276839108, 0.0319092569552602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 120.78571428571428, 81, 253, 85.0, 253.0, 253.0, 253.0, 0.06357105882139258, 0.02383027832771789, 0.03587401408098953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0efe1555-8f7d-4b84-aab8-f9c1ac09b0b6", 1, 0, 0.0, 2668.0, 2668, 2668, 2668.0, 2668.0, 2668.0, 2668.0, 0.3748125937031484, 0.06771516585457271, 0.258415714017991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 179.28571428571428, 83, 727, 87.0, 491.5, 727.0, 727.0, 0.06357134748552618, 4.101739875411511, 0.03698277330003406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 126.71428571428571, 81, 670, 85.0, 380.0, 670.0, 670.0, 0.06357192482165805, 1.3510719106314961, 0.03704519112445112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/339e327e-27a7-49c1-b7f4-f9ce54cc8e42", 3, 0, 0.0, 440.0, 172, 939, 209.0, 939.0, 939.0, 939.0, 0.029923097639067597, 0.03001076296418205, 0.019188965608386444], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 983.6724137931034, 657, 1520, 921.0, 1343.0, 1411.2999999999997, 1520.0, 0.25015526878752326, 299.2726695125423, 0.49395893895348836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1142.3181818181822, 416, 1929, 1123.5, 1641.8999999999999, 1888.9499999999994, 1929.0, 0.08979371933748562, 0.028682333289796986, 0.04051240071671714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 111.5, 83, 245, 85.5, 245.0, 245.0, 245.0, 0.03975642563229282, 0.010715599096203923, 0.02341125454714118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0eab027e-ff03-4407-a698-26a48a3167f8", 3, 0, 0.0, 498.66666666666663, 166, 926, 404.0, 926.0, 926.0, 926.0, 0.02053177291859152, 0.024267860503712827, 0.013166534065633234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 86.16666666666666, 84, 91, 85.5, 91.0, 91.0, 91.0, 0.03975642563229282, 0.010715599096203923, 0.023372429912734645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 181.88235294117644, 82, 900, 87.0, 383.99999999999955, 900.0, 900.0, 0.12303060567243464, 6.5431602785738585, 0.07170660185848586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 130.52941176470588, 83, 669, 86.0, 341.7999999999997, 669.0, 669.0, 0.12317055499203014, 2.161612107846689, 0.07190845303216925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 141.0, 83, 254, 86.0, 254.0, 254.0, 254.0, 0.03971169310803566, 0.010625980382423605, 0.02264807497567659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 115.3529411764706, 84, 255, 86.0, 251.0, 255.0, 255.0, 0.12302882492998211, 0.09143060133956679, 0.061754703138682435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 115.83333333333334, 85, 259, 87.5, 259.0, 259.0, 259.0, 0.039755371944634015, 0.029544763720572742, 0.019955333183146372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 114.82352941176471, 82, 260, 86.0, 250.39999999999998, 260.0, 260.0, 0.12303060567243464, 0.04379007541052418, 0.06955808944325033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 95.0, 88, 114, 90.5, 114.0, 114.0, 114.0, 0.03847386983007374, 0.0302831436357807, 0.013676258416159026], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 792.7692307692308, 367, 1517, 758.0, 1447.8, 1517.0, 1517.0, 0.08151083467094704, 0.01472607852941914, 0.055481495864892656], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e097f219-c1db-4dfb-8dbc-a49ded70ad7d", 3, 0, 0.0, 401.3333333333333, 314, 499, 391.0, 499.0, 499.0, 499.0, 0.020842162304865255, 0.02873260330765116, 0.013365579342638201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1477.7619047619048, 745, 2348, 1378.0, 2222.0, 2338.2, 2348.0, 0.09453157354556421, 0.04892747458901273, 0.04348083119136792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 259.6666666666667, 173, 512, 178.0, 512.0, 512.0, 512.0, 0.03968831443728585, 0.061509135753879535, 0.0892599493643255], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 970.3275862068965, 449, 1882, 775.5, 1659.4, 1759.55, 1882.0, 0.2805768272565875, 99.43303185937779, 1.0183665198072727], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 152.27586206896552, 84, 357, 88.0, 342.0, 351.15, 357.0, 0.251150746740453, 0.1866462092475437, 0.1214058785512932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b92a187-a40f-4b4e-bb9b-9707b5fe0228", 3, 0, 0.0, 492.33333333333337, 255, 758, 464.0, 758.0, 758.0, 758.0, 0.0217411785168168, 0.025697336977396422, 0.01394209690043265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11c1820b-7e59-4215-a92e-9322e5b7e051", 3, 0, 0.0, 1047.6666666666667, 194, 2240, 709.0, 2240.0, 2240.0, 2240.0, 0.0256342336645846, 0.021370205864258186, 0.01643861989558322], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 553.4827586206897, 413, 816, 503.5, 745.8, 773.1499999999999, 816.0, 0.25102900250596194, 73.81086168410164, 0.12624993778376015], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 140.12068965517233, 83, 349, 90.0, 261.0, 276.29999999999995, 349.0, 0.25149378636903674, 0.4450261141608346, 0.1223085015740042], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 825.5517241379309, 570, 1178, 817.5, 1075.0, 1150.15, 1178.0, 0.25058758468132175, 225.479149182242, 0.12578322121699156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 93.4, 87, 117, 90.0, 106.80000000000001, 117.0, 117.0, 0.07805304484927957, 0.058311112607127805, 0.027745418286267347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eb4c19d-8e28-4cac-b856-2128872cbc6c", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, 2.8735632183908044, 159.97126436781613, 84, 1354, 93.0, 283.0, 403.25, 1145.5, 0.6991433484948327, 1.5149636201863579, 0.3351082090076986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 105.28571428571429, 87, 259, 92.5, 183.0, 259.0, 259.0, 0.061175175113938766, 0.04737491588413422, 0.02174586302878292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31833b3c-5d38-4f6e-b07d-0e320726dec7", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b92a187-a40f-4b4e-bb9b-9707b5fe0228", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.1905739055907173, 0.7272712289029536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc47f727-7e0d-47af-9bd5-08f33f3f3c71", 3, 0, 0.0, 276.0, 187, 367, 274.0, 367.0, 367.0, 367.0, 0.09349872218413016, 0.04230573692576202, 0.05995849046313034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 92.64285714285714, 87, 110, 90.5, 103.5, 110.0, 110.0, 0.0887457687285267, 0.07201927130215399, 0.03154634747771848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 292.6428571428571, 167, 811, 181.5, 662.0, 811.0, 811.0, 0.06354566663943281, 5.521642370378188, 0.14175435401290884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad580428-5195-4144-be31-3e1bc37ed5f6", 3, 0, 0.0, 1335.6666666666667, 353, 2137, 1517.0, 2137.0, 2137.0, 2137.0, 0.04152823920265781, 0.02696902252906977, 0.02663106485326689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 309.11764705882354, 170, 1155, 177.0, 631.7999999999995, 1155.0, 1155.0, 0.12280752448926517, 8.821513936848037, 0.2743486799094114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9ba8100-91ac-4513-ac73-3de07841a7eb", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b8a03e2-b2af-4ffb-90ff-9d89020732d3", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 142.25, 87, 271, 90.5, 261.2, 271.0, 271.0, 0.07421356809558709, 0.0615305852667514, 0.026380604283978218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44ae3c16-145a-487a-9cce-660aad3287a3", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 98.55, 84, 257, 90.0, 105.00000000000003, 249.4499999999999, 257.0, 0.09878396933745592, 0.07669263244460689, 0.03511461410042378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b485ac3-e740-433f-86e7-b74268aeb935", 2, 0, 0.0, 454.0, 435, 473, 454.0, 473.0, 473.0, 473.0, 0.02294314688202634, 0.025900661909787546, 0.014261047842197037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 99.73333333333333, 84, 257, 87.0, 165.80000000000007, 257.0, 257.0, 0.07736943907156672, 0.05749818665377176, 0.03883583172147002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 140.73333333333335, 82, 257, 87.0, 255.8, 257.0, 257.0, 0.07737183355771166, 0.028450267964450222, 0.043692922153619196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 204.40000000000003, 84, 1020, 87.0, 564.0000000000002, 1020.0, 1020.0, 0.07737223265314544, 4.6607753487553385, 0.0450431317958611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 180.33333333333334, 85, 500, 90.0, 354.2000000000001, 500.0, 500.0, 0.0773706362961129, 1.5360992852242716, 0.045117759720330934], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 30.0, 0.228310502283105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 10.0, 0.076103500761035], "isController": false}, {"data": ["401/Unauthorized", 6, 60.0, 0.45662100456621], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 10, "401/Unauthorized", 6, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
