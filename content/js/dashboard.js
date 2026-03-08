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

    var data = {"OkPercent": 98.91050583657588, "KoPercent": 1.0894941634241244};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7765176784523016, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14769dbd-fbc5-4c70-8eac-85c5ee785706"], "isController": false}, {"data": [0.037037037037037035, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72524a0f-e877-49c8-b1cb-277b93d274ee"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bf717c8-19c4-43ad-8976-1d984f09012a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87d3252a-1385-45ca-a662-b53526c6bb68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e19ec5cf-597e-4efc-8076-dd8850174d61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54b24ad8-18fa-4267-afa1-1ffded8c35ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7a33387-8671-45f5-977d-172a56817663"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/637c6b9a-dd38-4b76-a106-1e897e6fe4a4"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=160059a5-3c74-420e-a843-354e7ef2c32b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/796a6641-7b0b-4af4-ad8e-aa6d9037388c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e19ec5cf-597e-4efc-8076-dd8850174d61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf9d4ac4-6e54-4f1e-bd97-692336e39c52"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4f7c34a-aded-4a58-a6e6-47279269c2ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2da0f08-ea8e-4651-b73d-9e739367cde6"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35ca6c34-d779-4842-8e17-1fd3c7623045"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54b24ad8-18fa-4267-afa1-1ffded8c35ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bf717c8-19c4-43ad-8976-1d984f09012a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/72524a0f-e877-49c8-b1cb-277b93d274ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14769dbd-fbc5-4c70-8eac-85c5ee785706"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/160059a5-3c74-420e-a843-354e7ef2c32b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4f7c34a-aded-4a58-a6e6-47279269c2ab"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/763ce4ac-48cc-4dfe-a540-48b9c6200571"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [0.9259259259259259, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9651162790697675, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a85aced9-5c07-4e5e-b44e-b104304ffcd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2252a757-fab0-4c04-84ec-0f4c8d549ce4"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=796a6641-7b0b-4af4-ad8e-aa6d9037388c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87d3252a-1385-45ca-a662-b53526c6bb68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7a33387-8671-45f5-977d-172a56817663"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf9d4ac4-6e54-4f1e-bd97-692336e39c52"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2da0f08-ea8e-4651-b73d-9e739367cde6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35ca6c34-d779-4842-8e17-1fd3c7623045"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 14, 1.0894941634241244, 388.91517509727674, 115, 2383, 142.0, 995.4000000000001, 1197.8000000000002, 1756.2200000000023, 5.139013309444587, 711.4158105081324, 3.751260226786457], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14769dbd-fbc5-4c70-8eac-85c5ee785706", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1801.8333333333333, 1453, 2300, 1769.5, 2162.0, 2201.0, 2300.0, 0.2525689536629514, 303.92560466732226, 1.2418795719657816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72524a0f-e877-49c8-b1cb-277b93d274ee", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 646.5714285714286, 128, 1990, 491.5, 1570.5, 1990.0, 1990.0, 0.0852904444241372, 0.01610499672545615, 0.057679328870815436], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 646.5714285714286, 128, 1990, 491.5, 1570.5, 1990.0, 1990.0, 0.08414321174639236, 0.0158883701309629, 0.05690349036560225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 228.71428571428572, 117, 386, 130.0, 381.5, 386.0, 386.0, 0.0912676423612243, 0.044004041852733135, 0.05095606929821702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 127.5, 123, 131, 127.5, 130.5, 131.0, 131.0, 0.09126645240780458, 0.06782594754134696, 0.04581148099376129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 214.2142857142857, 117, 882, 126.0, 753.0, 882.0, 882.0, 0.09097407238936904, 3.8423600055234264, 0.05245477695106895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 322.6428571428571, 121, 1131, 126.5, 1124.0, 1131.0, 1131.0, 0.09067533695602893, 11.676638086394167, 0.05219397883378563], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 340.71428571428567, 125, 1024, 242.5, 793.5, 1024.0, 1024.0, 0.08566411102068788, 0.19203914620416204, 0.05537453381896726], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5bf717c8-19c4-43ad-8976-1d984f09012a", 3, 0, 0.0, 624.3333333333333, 201, 1432, 240.0, 1432.0, 1432.0, 1432.0, 0.020094713080988393, 0.023751270571962517, 0.012886258063003623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87d3252a-1385-45ca-a662-b53526c6bb68", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e19ec5cf-597e-4efc-8076-dd8850174d61", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 124.6875, 119, 133, 125.0, 130.2, 133.0, 133.0, 0.09774812751243234, 0.07264289554390724, 0.04906497806776389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 155.125, 117, 378, 124.5, 373.1, 378.0, 378.0, 0.0977511134462766, 0.03533215904717102, 0.05523558400180839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 734.8, 599, 888, 713.0, 888.0, 888.0, 888.0, 0.08991188635137565, 26.437079942905953, 0.051277872684768924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1111.2, 1063, 1252, 1072.0, 1252.0, 1252.0, 1252.0, 0.08933836010506192, 80.38681346262084, 0.05086353900512802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 273.4, 124, 375, 369.0, 375.0, 375.0, 375.0, 0.09046171660153422, 0.16007483445505863, 0.050089641907294834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 144.8571428571429, 121, 378, 128.0, 254.5, 378.0, 378.0, 0.07464238301139363, 0.05547153659342827, 0.03746697741001594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 212.49999999999997, 121, 394, 128.0, 385.5, 394.0, 394.0, 0.07464437288063298, 0.01997320133720062, 0.042570618908486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 177.0, 117, 376, 127.0, 375.0, 376.0, 376.0, 0.07464357692020603, 0.02011877659177428, 0.043882259087855494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 144.14285714285714, 120, 389, 126.5, 259.0, 389.0, 389.0, 0.07464198505027671, 0.020118347533082392, 0.04395421580597349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54b24ad8-18fa-4267-afa1-1ffded8c35ff", 3, 0, 0.0, 370.6666666666667, 325, 403, 384.0, 403.0, 403.0, 403.0, 0.01975633849193283, 0.023351323263088575, 0.012669266545933488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 124.2, 122, 128, 124.0, 128.0, 128.0, 128.0, 0.09087604507451835, 0.06753581084151217, 0.05102902921664849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 712.625, 121, 1124, 955.0, 1114.9, 1124.0, 1124.0, 0.08111081257825926, 45.62298054671223, 0.0433277485159256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 169.5, 117, 855, 125.0, 347.5000000000005, 855.0, 855.0, 0.09774573889669498, 5.5216856653583, 0.05693880200378765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 582.5625, 124, 967, 744.0, 905.4000000000001, 967.0, 967.0, 0.08110957904128478, 14.913766418353068, 0.043406298158812556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 203.25, 123, 865, 127.0, 522.7000000000004, 865.0, 865.0, 0.09774573889669498, 1.8209797292137577, 0.057034256826928954], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 545.8571428571429, 127, 1788, 480.0, 1289.5, 1788.0, 1788.0, 0.08425411039695722, 0.015909310605787055, 0.05766023138285068], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 361.99999999999994, 249, 753, 259.5, 639.0, 753.0, 753.0, 0.07459068362361541, 0.11560099112370864, 0.1677561956886585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7a33387-8671-45f5-977d-172a56817663", 3, 0, 0.0, 467.33333333333337, 212, 970, 220.0, 970.0, 970.0, 970.0, 0.07138438109741588, 0.03229957347832294, 0.045777093346975675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 480.81818181818187, 146, 893, 457.0, 796.4, 880.3999999999999, 893.0, 0.09315126495183655, 0.05721889224092304, 0.04211819889912141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 128.1875, 120, 145, 127.0, 140.8, 145.0, 145.0, 0.08110587865546728, 0.060274974274229114, 0.04071134924698261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 187.62500000000003, 120, 387, 126.5, 382.1, 387.0, 387.0, 0.08111040139509891, 0.09784338215165617, 0.042000771816163275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/637c6b9a-dd38-4b76-a106-1e897e6fe4a4", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["login", 22, 0, 0.0, 2524.409090909091, 1420, 3519, 2307.5, 3431.7999999999997, 3511.95, 3519.0, 0.09226098115359775, 25.212692522719266, 0.17397223363835373], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 146.93749999999997, 123, 384, 129.5, 216.00000000000017, 384.0, 384.0, 0.09738461444822485, 0.07883969275154142, 0.03461718716714243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=160059a5-3c74-420e-a843-354e7ef2c32b", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/796a6641-7b0b-4af4-ad8e-aa6d9037388c", 3, 0, 0.0, 352.6666666666667, 233, 414, 411.0, 414.0, 414.0, 414.0, 0.03385660598810505, 0.027519513395930437, 0.02171143027231997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e19ec5cf-597e-4efc-8076-dd8850174d61", 3, 0, 0.0, 374.3333333333333, 209, 491, 423.0, 491.0, 491.0, 491.0, 0.06282327811865224, 0.02842589732582246, 0.040287063116453414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf9d4ac4-6e54-4f1e-bd97-692336e39c52", 3, 0, 0.0, 351.3333333333333, 198, 464, 392.0, 464.0, 464.0, 464.0, 0.026861502095197165, 0.026940197902116686, 0.01722563773682891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4f7c34a-aded-4a58-a6e6-47279269c2ab", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2da0f08-ea8e-4651-b73d-9e739367cde6", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 850.8749999999999, 250, 1251, 1136.5, 1239.8, 1251.0, 1251.0, 0.0810545192960415, 60.652972120411555, 0.1693319144570867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 523.0714285714287, 250, 1259, 506.0, 1252.0, 1259.0, 1259.0, 0.09059788130383295, 15.60414529796996, 0.20044528454206006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 919.0, 125, 1381, 1193.0, 1381.0, 1381.0, 1381.0, 0.12479942948832233, 106.65490172044927, 0.2246320088251025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35ca6c34-d779-4842-8e17-1fd3c7623045", 3, 0, 0.0, 285.3333333333333, 205, 429, 222.0, 429.0, 429.0, 429.0, 0.10742292405199269, 0.04979500125326745, 0.06888774752032084], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1144.2608695652175, 287, 2062, 1174.0, 2002.2, 2050.6, 2062.0, 0.09206481362879468, 0.02900479437524017, 0.04153705458642885], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54b24ad8-18fa-4267-afa1-1ffded8c35ff", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 146.05555555555557, 121, 382, 132.0, 168.70000000000033, 382.0, 382.0, 0.08904851660012764, 0.06913434638388816, 0.03165396488520162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 344.49999999999994, 248, 991, 253.5, 650.8000000000004, 991.0, 991.0, 0.09767294215320002, 7.445087823617928, 0.21810682749127047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 539.2666666666667, 259, 1261, 500.0, 956.2000000000002, 1261.0, 1261.0, 0.10668866824091723, 8.663439371497056, 0.2381254956577712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 127.6, 118, 141, 127.5, 140.8, 141.0, 141.0, 0.05371088504796382, 0.0399159995327153, 0.026960346596341216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 148.7, 119, 358, 127.5, 335.1000000000001, 358.0, 358.0, 0.05364519070865297, 0.014354279545088782, 0.030594522826028647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 173.9, 115, 376, 125.0, 375.1, 376.0, 376.0, 0.053713770062093116, 0.014477539587048536, 0.031577821852910214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bf717c8-19c4-43ad-8976-1d984f09012a", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 148.70000000000002, 116, 360, 126.0, 338.1000000000001, 360.0, 360.0, 0.05364461515353089, 0.014458900178100122, 0.03158955364997961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 2.3222194881889764, 4.867433562992126], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1173.0000000000002, 917, 1778, 1008.0, 1638.5, 1672.0, 1778.0, 0.2487401770661557, 297.57972784830537, 0.491164685573991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72524a0f-e877-49c8-b1cb-277b93d274ee", 3, 0, 0.0, 829.3333333333334, 212, 1776, 500.0, 1776.0, 1776.0, 1776.0, 0.015823786315589592, 0.021814366877123025, 0.010147415052640463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14769dbd-fbc5-4c70-8eac-85c5ee785706", 3, 0, 0.0, 566.0, 334, 914, 450.0, 914.0, 914.0, 914.0, 0.017320916160992142, 0.02387828123105525, 0.011107488553761237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1144.2608695652175, 287, 2062, 1174.0, 2002.2, 2050.6, 2062.0, 0.0931000704322272, 0.029330949499283537, 0.042004133339540006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 152.00000000000003, 121, 382, 127.5, 356.80000000000007, 382.0, 382.0, 0.05879655217018074, 0.015847508202119026, 0.034623360311151354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 150.9, 115, 379, 127.5, 354.4000000000001, 379.0, 379.0, 0.05888553241354132, 0.01587149115833731, 0.03461825245405457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 222.44444444444443, 117, 1143, 127.0, 452.70000000000107, 1143.0, 1143.0, 0.08999775005624859, 4.521805900164996, 0.052479156771080726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 221.2777777777778, 116, 879, 127.0, 426.3000000000007, 879.0, 879.0, 0.09011624996245156, 1.4950047279740866, 0.05263626015059427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 182.7222222222222, 122, 381, 128.0, 378.3, 381.0, 381.0, 0.09045635229734007, 0.06722391025222246, 0.04540484871175078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 150.9, 120, 381, 126.5, 355.80000000000007, 381.0, 381.0, 0.05888622592289438, 0.015756665920774474, 0.0335835507216507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 193.0, 120, 383, 126.5, 375.8, 383.0, 383.0, 0.09045680687471733, 0.03175214520830192, 0.051166594426855616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/160059a5-3c74-420e-a843-354e7ef2c32b", 3, 0, 0.0, 579.6666666666666, 273, 1053, 413.0, 1053.0, 1053.0, 1053.0, 0.05003836274477099, 0.03216984584014411, 0.032088403192447545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 151.7, 123, 373, 127.5, 348.80000000000007, 373.0, 373.0, 0.05888449218013944, 0.043760838426841905, 0.029557254863859052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 131.6, 126, 144, 131.0, 143.0, 144.0, 144.0, 0.058590202546330204, 0.04611689770736538, 0.020826986061390815], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 533.7857142857143, 127, 1432, 426.0, 1201.0, 1432.0, 1432.0, 0.08288437629506838, 0.015488786557930258, 0.05641063473151382], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1415.909090909091, 750, 2383, 1452.0, 1978.9999999999998, 2333.649999999999, 2383.0, 0.09365408438233003, 0.048473305393198156, 0.04307722045320063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4f7c34a-aded-4a58-a6e6-47279269c2ab", 3, 0, 0.0, 570.6666666666666, 307, 1024, 381.0, 1024.0, 1024.0, 1024.0, 0.04143818114010249, 0.034545306608008614, 0.026573312775391243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 331.59999999999997, 252, 754, 257.5, 729.6000000000001, 754.0, 754.0, 0.05875199022366883, 0.09105410984859612, 0.13213460301280205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/763ce4ac-48cc-4dfe-a540-48b9c6200571", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1170.2881355932209, 641, 2359, 993.0, 1805.0, 1951.0, 2359.0, 0.2765940490087151, 85.17074078859777, 1.0069156936064583], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 236.70370370370375, 116, 523, 129.0, 511.0, 513.25, 523.0, 0.24975024975024976, 0.18560541021478522, 0.12072888049450549], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 711.8148148148149, 579, 990, 629.5, 877.5, 931.25, 990.0, 0.2496428720025519, 73.40329329223472, 0.12555281160284593], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 190.79629629629636, 116, 508, 130.0, 379.0, 413.0, 508.0, 0.25024445175611365, 0.4428153775215604, 0.1217009150142037], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 932.5185185185186, 794, 1258, 874.5, 1131.0, 1169.25, 1258.0, 0.24936964894294977, 224.38324846395224, 0.12517187456706658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 138.33333333333334, 123, 163, 137.0, 155.20000000000002, 163.0, 163.0, 0.11094592495617636, 0.08288440682761222, 0.039437809261765815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 4, 2.3255813953488373, 187.82558139534893, 121, 835, 132.0, 338.1, 390.94999999999993, 714.5500000000017, 0.7074317348940703, 1.4760761085496414, 0.3422123899265011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 151.8, 123, 364, 129.5, 341.0000000000001, 364.0, 364.0, 0.05471567002073724, 0.042372584303168585, 0.01944971082768394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 130.92857142857142, 124, 146, 130.5, 140.0, 146.0, 146.0, 0.09191176470588235, 0.07458855124080882, 0.03267176011029412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a85aced9-5c07-4e5e-b44e-b104304ffcd1", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2252a757-fab0-4c04-84ec-0f4c8d549ce4", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 328.9, 239, 505, 264.5, 503.3, 505.0, 505.0, 0.05360694317127954, 0.08308029180939515, 0.12056327160493827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 475.83333333333337, 249, 1521, 376.5, 839.7000000000011, 1521.0, 1521.0, 0.08993974037394946, 6.109378396162072, 0.20099814374369174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=796a6641-7b0b-4af4-ad8e-aa6d9037388c", 1, 0, 0.0, 1788.0, 1788, 1788, 1788.0, 1788.0, 1788.0, 1788.0, 0.5592841163310962, 0.10104254054809843, 0.3856001817673378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87d3252a-1385-45ca-a662-b53526c6bb68", 3, 0, 0.0, 387.33333333333337, 212, 701, 249.0, 701.0, 701.0, 701.0, 0.0189490838117977, 0.026122841778308353, 0.012151593460039542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 133.07142857142858, 124, 142, 131.5, 141.5, 142.0, 142.0, 0.07618757380671212, 0.0631672364862291, 0.027082301626604702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 146.06249999999997, 123, 366, 129.5, 210.60000000000016, 366.0, 366.0, 0.08299228690433583, 0.06443248836811229, 0.02950116448552563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7a33387-8671-45f5-977d-172a56817663", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf9d4ac4-6e54-4f1e-bd97-692336e39c52", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2da0f08-ea8e-4651-b73d-9e739367cde6", 3, 0, 0.0, 436.6666666666667, 290, 563, 457.0, 563.0, 563.0, 563.0, 0.017471114424152067, 0.024085341662201828, 0.011203807101425644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 182.33333333333334, 122, 381, 130.0, 379.2, 381.0, 381.0, 0.10696331158412666, 0.07949128917531285, 0.05369056851000106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35ca6c34-d779-4842-8e17-1fd3c7623045", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 221.46666666666667, 124, 382, 128.0, 378.4, 382.0, 382.0, 0.10699001426533525, 0.03934111982881598, 0.060418709878744654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 304.73333333333335, 120, 1134, 358.0, 679.8000000000003, 1134.0, 1134.0, 0.1069793315931362, 6.444258029244583, 0.06227924369178541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 258.6666666666667, 123, 887, 129.0, 584.0000000000002, 887.0, 887.0, 0.10715433796478195, 2.1274182278458404, 0.06248576856448904], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 42.857142857142854, 0.4669260700389105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07782101167315175], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07782101167315175], "isController": false}, {"data": ["401/Unauthorized", 6, 42.857142857142854, 0.4669260700389105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 14, "406/Not Acceptable", 6, "401/Unauthorized", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
