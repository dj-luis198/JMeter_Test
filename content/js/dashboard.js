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

    var data = {"OkPercent": 96.7448902346707, "KoPercent": 3.255109765329296};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7355584082156611, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.009259259259259259, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab8ca4a2-b0ef-45d2-b85c-a6016465f5af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e508eacc-f16b-4d1d-9bd5-b04d893193b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c4d4788-6694-40d4-9c62-db25812b05d4"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2bf558d3-c11e-461c-8ca1-90a05efbc3ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d47811c8-1e34-40f4-a6f9-faa5fe7dac67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e32de96c-ed1c-4984-9f3c-92c655727433"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fde82017-d20b-4e66-934e-6d9f8d49c9ed"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e32de96c-ed1c-4984-9f3c-92c655727433"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/18aec35b-dedf-42e3-b14b-219f0a946857"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6d03060-b190-4fef-aa17-c806023f9aec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5d913cf-d589-4a04-bfd3-a0efde0eea7b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b4aa7d37-b9bd-4032-b9ba-2517782c883c"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cea90f2-de7c-413c-bbee-19a81eaf875b"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fde82017-d20b-4e66-934e-6d9f8d49c9ed"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c4d4788-6694-40d4-9c62-db25812b05d4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d47811c8-1e34-40f4-a6f9-faa5fe7dac67"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4aa7d37-b9bd-4032-b9ba-2517782c883c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bf558d3-c11e-461c-8ca1-90a05efbc3ad"], "isController": false}, {"data": [0.9629629629629629, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46296296296296297, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1625e81c-f79a-4008-ac6b-8326fa4594a6"], "isController": false}, {"data": [0.9029411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1625e81c-f79a-4008-ac6b-8326fa4594a6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e508eacc-f16b-4d1d-9bd5-b04d893193b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18aec35b-dedf-42e3-b14b-219f0a946857"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b1d6667-a1ae-4da7-acc0-8e5df3252479"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5d913cf-d589-4a04-bfd3-a0efde0eea7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6d03060-b190-4fef-aa17-c806023f9aec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab8ca4a2-b0ef-45d2-b85c-a6016465f5af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4366cc90-c43d-4a76-abb6-cd860701ff9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cea90f2-de7c-413c-bbee-19a81eaf875b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 43, 3.255109765329296, 441.4322482967453, 119, 4974, 139.0, 1201.0, 1442.8999999999999, 2169.839999999998, 5.127309424002484, 727.6540030420355, 3.7392822227720854], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2058.0, 1490, 2735, 2094.0, 2453.0, 2528.25, 2735.0, 0.24146596671346932, 290.5646797962855, 1.1872862718772639], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ab8ca4a2-b0ef-45d2-b85c-a6016465f5af", 3, 0, 0.0, 358.6666666666667, 280, 448, 348.0, 448.0, 448.0, 448.0, 0.030952724871546194, 0.025804013149749283, 0.019849240884422525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e508eacc-f16b-4d1d-9bd5-b04d893193b9", 3, 0, 0.0, 1096.3333333333333, 207, 2548, 534.0, 2548.0, 2548.0, 2548.0, 0.02284774264302687, 0.027005258312770366, 0.014651709963138975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c4d4788-6694-40d4-9c62-db25812b05d4", 3, 0, 0.0, 543.3333333333334, 320, 893, 417.0, 893.0, 893.0, 893.0, 0.018451546239574877, 0.021809102993455853, 0.011832534535144046], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 698.7777777777777, 123, 3631, 509.5, 1417.0000000000034, 3631.0, 3631.0, 0.09362906246098789, 0.01988703230982897, 0.06239397646529483], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 698.7777777777777, 123, 3631, 509.5, 1417.0000000000034, 3631.0, 3631.0, 0.09592786224758981, 0.02037530277231522, 0.06392588606701094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 208.7857142857143, 122, 366, 125.0, 365.5, 366.0, 366.0, 0.14102241249055653, 0.06799294887937547, 0.07873489045580458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 160.5, 122, 373, 124.0, 372.0, 373.0, 373.0, 0.14135988206546982, 0.10505358423029544, 0.07095603455239403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 337.07142857142856, 119, 953, 363.0, 832.0, 953.0, 953.0, 0.1405283867341203, 5.935324633120533, 0.08102731896932466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 346.57142857142856, 120, 1307, 128.0, 1206.5, 1307.0, 1307.0, 0.13969267611255237, 17.988803538465376, 0.08040903761724207], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 234.68421052631578, 123, 408, 234.0, 356.0, 408.0, 408.0, 0.09369575508915891, 0.14545090928031798, 0.06054876278453922], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 169.9545454545455, 120, 373, 125.5, 369.2, 372.7, 373.0, 0.10405285885229697, 0.0773283452994121, 0.05222965766609437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 177.5909090909091, 119, 372, 124.0, 365.7, 371.09999999999997, 372.0, 0.10405630392008476, 0.04205116259270471, 0.058550146861283486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 854.1111111111111, 707, 974, 946.0, 974.0, 974.0, 974.0, 0.06280048286593493, 18.465427134867525, 0.03581590038447851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1301.111111111111, 1067, 1564, 1301.0, 1564.0, 1564.0, 1564.0, 0.06275581711560319, 56.467794553579516, 0.035729141971090485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 230.66666666666666, 119, 370, 124.0, 370.0, 370.0, 370.0, 0.06306318931569432, 0.11159228421878722, 0.03491877767773309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 145.0, 121, 368, 124.0, 296.90000000000026, 368.0, 368.0, 0.058776277894241884, 0.04368041745851375, 0.029502936364883135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bf558d3-c11e-461c-8ca1-90a05efbc3ad", 3, 0, 0.0, 440.6666666666667, 342, 572, 408.0, 572.0, 572.0, 572.0, 0.022092449537163182, 0.030456225192020205, 0.014167358589912587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 201.58333333333334, 119, 366, 123.5, 364.2, 366.0, 366.0, 0.05870812765103889, 0.01570901071912564, 0.033481979050983116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 143.5, 120, 366, 122.5, 296.10000000000025, 366.0, 366.0, 0.05877829317632998, 0.01584258683268269, 0.03455520751186587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 183.74999999999997, 121, 366, 123.5, 364.8, 366.0, 366.0, 0.05871099999510742, 0.015824449217431296, 0.03457298144243142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d47811c8-1e34-40f4-a6f9-faa5fe7dac67", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 148.33333333333334, 120, 359, 122.0, 359.0, 359.0, 359.0, 0.0631703071480712, 0.04694590208953338, 0.03547160801771576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e32de96c-ed1c-4984-9f3c-92c655727433", 3, 0, 0.0, 545.6666666666666, 258, 951, 428.0, 951.0, 951.0, 951.0, 0.025170952720560476, 0.025244695746108988, 0.016141528925619833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 246.3181818181818, 120, 1380, 123.0, 1048.1999999999994, 1373.25, 1380.0, 0.10405728826706777, 8.537399800517449, 0.060361356670545166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 882.3333333333333, 121, 2062, 1130.5, 1514.8000000000009, 2062.0, 2062.0, 0.08998470260055791, 44.99322029317516, 0.048605018396872535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 252.2727272727273, 119, 967, 124.0, 773.0999999999996, 964.15, 967.0, 0.1040592570169049, 2.8070317156060507, 0.060464119067439856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 618.7222222222221, 119, 1102, 829.5, 1079.5, 1102.0, 1102.0, 0.09009189373160624, 14.727463418937317, 0.04875089779074657], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 371.72222222222223, 125, 606, 445.0, 594.3000000000001, 606.0, 606.0, 0.09775277237723881, 0.020762917960985783, 0.06546020342080396], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fde82017-d20b-4e66-934e-6d9f8d49c9ed", 3, 0, 0.0, 326.3333333333333, 213, 466, 300.0, 466.0, 466.0, 466.0, 0.06778282383244086, 0.031464292573261936, 0.04346750096025667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 351.24999999999994, 245, 734, 254.5, 662.6000000000003, 734.0, 734.0, 0.05867109959419156, 0.09092874517185742, 0.13195267809123357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e32de96c-ed1c-4984-9f3c-92c655727433", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 668.7500000000001, 174, 1732, 515.0, 1274.0, 1629.5, 1732.0, 0.09704380314664532, 0.05960991423753897, 0.043878203961813265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 152.16666666666666, 121, 368, 124.0, 361.7, 368.0, 368.0, 0.09009099190182084, 0.06695238753641178, 0.04522145491946866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 240.27777777777777, 122, 481, 125.0, 425.2000000000001, 481.0, 481.0, 0.08998695189197566, 0.09916530853026312, 0.04712207354933535], "isController": false}, {"data": ["login", 24, 0, 0.0, 3366.1666666666665, 1786, 7105, 3073.0, 5293.5, 6793.75, 7105.0, 0.10061332204228275, 45.2721506844326, 0.21436827672436562], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 140.0, 124, 389, 126.0, 139.8, 351.7999999999995, 389.0, 0.10345930287240646, 0.08375758015744625, 0.03677654906792573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18aec35b-dedf-42e3-b14b-219f0a946857", 3, 0, 0.0, 1261.6666666666667, 356, 2875, 554.0, 2875.0, 2875.0, 2875.0, 0.07061648188687239, 0.03195211908292729, 0.045284657980839395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1042.7222222222222, 246, 2187, 1254.0, 1650.6000000000008, 2187.0, 2187.0, 0.08992850683706453, 59.8318087120739, 0.18946851315704016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6d03060-b190-4fef-aa17-c806023f9aec", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5d913cf-d589-4a04-bfd3-a0efde0eea7b", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4aa7d37-b9bd-4032-b9ba-2517782c883c", 3, 0, 0.0, 439.66666666666663, 218, 702, 399.0, 702.0, 702.0, 702.0, 0.030283453121214568, 0.03037217417528063, 0.019420052945570542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 604.4285714285714, 248, 1430, 492.0, 1332.0, 1430.0, 1430.0, 0.13951866062085802, 24.03002609746375, 0.3086811438038766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, 52.63157894736842, 752.0526315789474, 122, 1689, 127.0, 1656.0, 1689.0, 1689.0, 0.1323682065501362, 75.03051217787501, 0.18754430416123843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cea90f2-de7c-413c-bbee-19a81eaf875b", 3, 0, 0.0, 375.0, 240, 638, 247.0, 638.0, 638.0, 638.0, 0.023628931263438954, 0.028343949122972837, 0.015152667509431882], "isController": false}, {"data": ["register", 28, 9, 32.142857142857146, 1100.071428571429, 136, 3390, 851.0, 2425.0, 3012.4499999999975, 3390.0, 0.10913328682176586, 0.034149827335549776, 0.04923786964028889], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fde82017-d20b-4e66-934e-6d9f8d49c9ed", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 484.3636363636364, 245, 1754, 258.5, 1248.9999999999995, 1710.6499999999994, 1754.0, 0.10399088661684558, 11.45644628279849, 0.23145911917355608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 128.3846153846154, 122, 138, 126.0, 138.0, 138.0, 138.0, 0.07842285603976643, 0.06088493217931085, 0.02787687460788572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c4d4788-6694-40d4-9c62-db25812b05d4", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d47811c8-1e34-40f4-a6f9-faa5fe7dac67", 3, 0, 0.0, 632.3333333333334, 253, 911, 733.0, 911.0, 911.0, 911.0, 0.08621928437993966, 0.03901198088805863, 0.055290361402500356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 396.1111111111112, 243, 1431, 253.0, 588.6000000000013, 1431.0, 1431.0, 0.09485966040241575, 6.44357608238825, 0.21199322543925295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 129.14285714285714, 119, 155, 124.0, 155.0, 155.0, 155.0, 0.05411046264445561, 0.040212951242608125, 0.027160915819580255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 121.71428571428571, 120, 124, 121.0, 124.0, 124.0, 124.0, 0.05411380907102051, 0.01447967156783166, 0.030861781735816385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 121.85714285714286, 120, 125, 122.0, 125.0, 125.0, 125.0, 0.05411297242557534, 0.014585137099080851, 0.031812509179879246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4aa7d37-b9bd-4032-b9ba-2517782c883c", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 122.28571428571429, 119, 125, 123.0, 125.0, 125.0, 125.0, 0.05411380907102051, 0.014585362601173497, 0.03186584655256384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 127.4, 125, 131, 127.0, 131.0, 131.0, 131.0, 0.10588285121341748, 0.031227169010207105, 0.0654529734551692], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1395.611111111111, 967, 2209, 1276.5, 1946.5, 1994.75, 2209.0, 0.24609551240275807, 294.41578947668245, 0.4859425059359149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 9, 32.142857142857146, 1100.071428571429, 136, 3390, 851.0, 2425.0, 3012.4499999999975, 3390.0, 0.10867877658748643, 0.034007602662630025, 0.04903280740568235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 121.87500000000001, 119, 127, 122.0, 127.0, 127.0, 127.0, 0.04518752824220515, 0.012179450971531858, 0.026609452666064168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 213.0, 119, 367, 125.5, 367.0, 367.0, 367.0, 0.045187273004558264, 0.012179382177009845, 0.026565174168695388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 159.61538461538464, 119, 367, 123.0, 365.0, 367.0, 367.0, 0.08224360555966774, 0.02216722181100419, 0.04835024467472654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 197.92307692307693, 119, 374, 124.0, 371.6, 374.0, 374.0, 0.08224360555966774, 0.02216722181100419, 0.0484305606957809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 213.5, 120, 370, 124.5, 370.0, 370.0, 370.0, 0.045124062970629875, 0.012074212162063074, 0.02573481716293735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 141.84615384615387, 121, 364, 124.0, 269.19999999999993, 364.0, 364.0, 0.08211840210223109, 0.0610274453123026, 0.04121958855522147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 153.5, 119, 367, 122.5, 367.0, 367.0, 367.0, 0.04518548642176133, 0.03358022965523474, 0.02268099611404817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 178.07692307692307, 121, 374, 122.0, 370.4, 374.0, 374.0, 0.08224412587147141, 0.02200672899295231, 0.046904853036073536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 126.125, 124, 129, 126.0, 129.0, 129.0, 129.0, 0.047037518300534466, 0.03702367163108474, 0.01672036783339311], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 446.7222222222222, 122, 893, 457.0, 749.0000000000002, 893.0, 893.0, 0.09610610113565375, 0.019683188573518497, 0.0653898987815882], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1584.0416666666665, 837, 4974, 1371.0, 2368.0, 4334.25, 4974.0, 0.09793080372626708, 0.050686841772384326, 0.0450443442920623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 399.75, 245, 730, 371.5, 730.0, 730.0, 730.0, 0.045090999272907634, 0.06988224203721134, 0.10141071418506473], "isController": false}, {"data": ["addBook", 58, 14, 24.137931034482758, 1257.1724137931033, 625, 4634, 1025.0, 2073.2, 2394.849999999999, 4634.0, 0.2682316596602707, 84.06988197084368, 0.9737443333171469], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bf558d3-c11e-461c-8ca1-90a05efbc3ad", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 213.70370370370372, 119, 580, 126.0, 495.5, 507.5, 580.0, 0.24719954954748752, 0.18370982148988083, 0.11949587600195928], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 779.4999999999999, 590, 1119, 725.0, 1070.5, 1104.75, 1119.0, 0.246685731514559, 72.53379580245955, 0.12406557786132608], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 165.33333333333326, 119, 377, 125.0, 366.5, 369.0, 377.0, 0.24764735017335313, 0.4382197251114413, 0.12043787147102526], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1177.7407407407404, 841, 1700, 1099.0, 1460.0, 1562.25, 1700.0, 0.24683457512456003, 222.1021845859807, 0.12389938634182017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 127.99999999999997, 122, 151, 126.0, 136.60000000000002, 151.0, 151.0, 0.0985280996666466, 0.07360741820799283, 0.03502366042837828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1625e81c-f79a-4008-ac6b-8326fa4594a6", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 14, 8.235294117647058, 201.08235294117645, 122, 2777, 129.0, 355.9, 447.8999999999995, 1341.379999999984, 0.7142076915967164, 1.5627847312373437, 0.3427236874858209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 198.85714285714286, 126, 372, 132.0, 372.0, 372.0, 372.0, 0.05579289676720015, 0.04320680384413059, 0.01983263127271568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1625e81c-f79a-4008-ac6b-8326fa4594a6", 3, 0, 0.0, 1215.0, 285, 2939, 421.0, 2939.0, 2939.0, 2939.0, 0.054249547920433995, 0.024546507685352624, 0.034788935352622063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e508eacc-f16b-4d1d-9bd5-b04d893193b9", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 144.92857142857144, 122, 369, 126.0, 254.0, 369.0, 369.0, 0.14784151389710232, 0.11997685356298049, 0.05255303814311059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 253.2857142857143, 240, 279, 250.0, 279.0, 279.0, 279.0, 0.054059063388113185, 0.08378098984075745, 0.12158010056916471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 378.15384615384613, 242, 739, 251.0, 640.5999999999999, 739.0, 739.0, 0.08205413047869117, 0.12716787604461222, 0.18454166259025956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18aec35b-dedf-42e3-b14b-219f0a946857", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b1d6667-a1ae-4da7-acc0-8e5df3252479", 2, 0, 0.0, 358.0, 234, 482, 358.0, 482.0, 482.0, 482.0, 0.02108770375993758, 0.030025265705067375, 0.013107737737500263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 129.25, 124, 139, 127.5, 138.4, 139.0, 139.0, 0.058027079303675046, 0.04811034211798839, 0.020626813346228238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5d913cf-d589-4a04-bfd3-a0efde0eea7b", 3, 0, 0.0, 375.3333333333333, 248, 591, 287.0, 591.0, 591.0, 591.0, 0.10641316685584562, 0.049326936719636776, 0.06824021442253121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6d03060-b190-4fef-aa17-c806023f9aec", 3, 0, 0.0, 301.6666666666667, 211, 443, 251.0, 443.0, 443.0, 443.0, 0.04065701740120345, 0.02613854471594297, 0.026072371185016534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 130.44444444444443, 121, 162, 126.5, 150.3, 162.0, 162.0, 0.0885404113193997, 0.06873987011613551, 0.03147334933619286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab8ca4a2-b0ef-45d2-b85c-a6016465f5af", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4366cc90-c43d-4a76-abb6-cd860701ff9e", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.663900077962578, 1.2404983108108107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cea90f2-de7c-413c-bbee-19a81eaf875b", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 123.61111111111111, 120, 130, 123.5, 127.30000000000001, 130.0, 130.0, 0.09551757258008882, 0.07098522727875742, 0.0479453440489899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 164.11111111111111, 120, 367, 122.5, 367.0, 367.0, 367.0, 0.09551655885677292, 0.03352821917335724, 0.05402862644535126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 229.22222222222223, 119, 1307, 123.5, 461.00000000000136, 1307.0, 1307.0, 0.09492118904609478, 4.76917692287917, 0.05535009439384911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 224.50000000000003, 120, 980, 124.0, 429.20000000000084, 980.0, 980.0, 0.09508515403794954, 1.5774375310347377, 0.05553856165215738], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.930232558139537, 0.6813020439061317], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.627906976744185, 0.3785011355034065], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.627906976744185, 0.3785011355034065], "isController": false}, {"data": ["401/Unauthorized", 24, 55.81395348837209, 1.8168054504163513], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 43, "401/Unauthorized", 24, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
