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

    var data = {"OkPercent": 98.9795918367347, "KoPercent": 1.0204081632653061};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7744436952124073, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=826e9943-0f3e-45d5-bacb-be7a70ddcef8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07887442-2051-4926-9a82-504d2e3fde9b"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/15f7575b-367d-4dfe-b41d-2888e907bfbc"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f72339a7-ce81-4074-8037-7b33bbc680e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcf7f08d-23d8-48a7-a026-2ef1503c9975"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1bc326a-f87a-4eb7-a90c-52b857805c76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee5d44dd-329b-4e29-b872-3fcb69fa6b1c"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba95e2a1-3509-4427-9479-27a4b08b0348"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c045089-0c85-4944-95a1-05fdbe63a3b9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/942eb065-65d9-4452-85e6-ac3b98c8e844"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e75e2e02-c4fa-43eb-a4c1-18a4660ae9bf"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77b8cc9e-f0bf-4caa-ae56-9c3070a155e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3490566037735849, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed18eb26-5166-4c83-b304-c7db66ffeeaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/07887442-2051-4926-9a82-504d2e3fde9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2f8ced4-df71-4ee3-85a5-b9a4514f3c6f"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcf7f08d-23d8-48a7-a026-2ef1503c9975"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1bc326a-f87a-4eb7-a90c-52b857805c76"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f72339a7-ce81-4074-8037-7b33bbc680e0"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9682080924855492, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2f8ced4-df71-4ee3-85a5-b9a4514f3c6f"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed18eb26-5166-4c83-b304-c7db66ffeeaf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/77b8cc9e-f0bf-4caa-ae56-9c3070a155e7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee5d44dd-329b-4e29-b872-3fcb69fa6b1c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/826e9943-0f3e-45d5-bacb-be7a70ddcef8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e3cbb47-59b6-4f09-b424-16cef9d372be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba95e2a1-3509-4427-9479-27a4b08b0348"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9801572-340d-4307-9bf5-7c24d6df14d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c045089-0c85-4944-95a1-05fdbe63a3b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=942eb065-65d9-4452-85e6-ac3b98c8e844"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 13, 1.0204081632653061, 409.62323390894846, 127, 2045, 157.5, 1072.5, 1228.25, 1663.5, 4.912545886417621, 676.7119547011406, 3.589914784777277], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2023.7547169811323, 1609, 2604, 2019.0, 2394.2000000000003, 2524.9, 2604.0, 0.23511771412347673, 282.9267169900829, 1.1560719634879935], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=826e9943-0f3e-45d5-bacb-be7a70ddcef8", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07887442-2051-4926-9a82-504d2e3fde9b", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 529.1428571428571, 144, 857, 539.5, 830.5, 857.0, 857.0, 0.0754611213522633, 0.014248971505341568, 0.05103205716449446], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 529.1428571428571, 144, 857, 539.5, 830.5, 857.0, 857.0, 0.07587664625223564, 0.014327433133705492, 0.051313063993821476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 175.86666666666665, 131, 421, 142.0, 415.6, 421.0, 421.0, 0.11627636566591475, 0.05439856534344163, 0.06501181174081223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 140.6, 131, 150, 140.0, 148.8, 150.0, 150.0, 0.1165301968583459, 0.08660105450117306, 0.0584926964699119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 302.33333333333326, 129, 980, 140.0, 968.0, 980.0, 980.0, 0.11579256148585014, 4.566629452223989, 0.06685965024856803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 352.9333333333334, 133, 1209, 150.0, 1185.6, 1209.0, 1209.0, 0.11560515444848633, 13.89656746620476, 0.06663854410721992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15f7575b-367d-4dfe-b41d-2888e907bfbc", 1, 0, 0.0, 1668.0, 1668, 1668, 1668.0, 1668.0, 1668.0, 1668.0, 0.5995203836930455, 0.19144840377697842, 0.3577216351918465], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 245.21428571428572, 146, 315, 235.0, 314.0, 315.0, 315.0, 0.07592355582550599, 0.18236799978036403, 0.04907809652866657], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 140.64705882352945, 132, 152, 141.0, 148.0, 152.0, 152.0, 0.11295155707043526, 0.08394153801816527, 0.056696387045120825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 186.41176470588232, 130, 421, 140.0, 417.0, 421.0, 421.0, 0.11275153541061456, 0.04013146331595633, 0.06374658843699842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 886.8, 691, 1139, 897.0, 1139.0, 1139.0, 1139.0, 0.05913730499473678, 17.388331211782514, 0.033726744254810814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f72339a7-ce81-4074-8037-7b33bbc680e0", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1197.2, 964, 1352, 1222.0, 1352.0, 1352.0, 1352.0, 0.05876821814762576, 52.87974599274212, 0.033458858574283025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 304.6, 130, 427, 405.0, 427.0, 427.0, 427.0, 0.05933802499317613, 0.1050004895387062, 0.03285611344836998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcf7f08d-23d8-48a7-a026-2ef1503c9975", 3, 0, 0.0, 317.6666666666667, 241, 422, 290.0, 422.0, 422.0, 422.0, 0.020380988613821028, 0.028096838144378924, 0.013069839703524553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 140.8235294117647, 131, 158, 139.0, 154.0, 158.0, 158.0, 0.08985200845665961, 0.06677478362843552, 0.045101496432346726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 184.23529411764704, 127, 418, 137.0, 414.0, 418.0, 418.0, 0.08985390811645066, 0.02404294025772215, 0.05124480697266327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1bc326a-f87a-4eb7-a90c-52b857805c76", 3, 0, 0.0, 382.6666666666667, 220, 501, 427.0, 501.0, 501.0, 501.0, 0.021752844184377108, 0.02609349961569975, 0.01394957781354912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 169.52941176470586, 130, 421, 138.0, 403.4, 421.0, 421.0, 0.08985390811645066, 0.024218436172012095, 0.052824270201272755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 169.1764705882353, 130, 415, 139.0, 395.0, 415.0, 415.0, 0.08985580785656899, 0.02421894821134086, 0.05291313685303818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 248.6, 139, 435, 141.0, 435.0, 435.0, 435.0, 0.059350703305834175, 0.044107309780995904, 0.03332681093833462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 794.5625, 136, 1372, 953.0, 1310.4, 1372.0, 1372.0, 0.0717730178311091, 40.37068415666704, 0.038339688235953795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 215.35294117647055, 131, 906, 137.0, 513.1999999999996, 906.0, 906.0, 0.11296056347386957, 6.007603294544669, 0.06583742400079737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 587.8125, 131, 1076, 687.0, 1015.1, 1076.0, 1076.0, 0.0717739837252492, 13.197213459192005, 0.038410295977965386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 221.00000000000003, 132, 1000, 140.0, 535.1999999999996, 1000.0, 1000.0, 0.11276050994282379, 1.978918448448548, 0.06583094339090752], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 457.3076923076923, 146, 836, 423.0, 790.4, 836.0, 836.0, 0.07317883217842125, 0.013863958440052464, 0.05005207834919813], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 347.5882352941177, 273, 562, 287.0, 556.4, 562.0, 562.0, 0.08978746778214391, 0.13915303844752186, 0.2019341194358178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 563.9047619047618, 158, 997, 494.0, 849.2, 982.6999999999998, 997.0, 0.09154155986818015, 0.05623011831746613, 0.041390373260710364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 141.625, 131, 154, 141.5, 151.9, 154.0, 154.0, 0.07185714798979628, 0.053401650019760716, 0.03606891998706572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 277.62499999999994, 136, 428, 270.0, 425.2, 428.0, 428.0, 0.07185811614966249, 0.086682361302608, 0.03720973250816263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee5d44dd-329b-4e29-b872-3fcb69fa6b1c", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["login", 21, 0, 0.0, 2511.190476190476, 1426, 3735, 2453.0, 3519.2, 3713.7, 3735.0, 0.09223471539002108, 26.39940359687939, 0.1755779424521258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 162.76470588235296, 139, 413, 146.0, 214.59999999999982, 413.0, 413.0, 0.11414681966816848, 0.0924098764696403, 0.04057562730391926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 942.5625000000001, 281, 1517, 1121.0, 1452.6000000000001, 1517.0, 1517.0, 0.07172604238112529, 53.67248719297892, 0.1498436876599827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba95e2a1-3509-4427-9479-27a4b08b0348", 3, 0, 0.0, 361.3333333333333, 280, 405, 399.0, 405.0, 405.0, 405.0, 0.01827240501394794, 0.025189985427757, 0.011717655559074686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c045089-0c85-4944-95a1-05fdbe63a3b9", 3, 0, 0.0, 328.6666666666667, 230, 484, 272.0, 484.0, 484.0, 484.0, 0.02602494925134896, 0.02610119421985877, 0.01668917644048094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/942eb065-65d9-4452-85e6-ac3b98c8e844", 3, 0, 0.0, 668.3333333333334, 313, 977, 715.0, 977.0, 977.0, 977.0, 0.039869758787959335, 0.025632413283274636, 0.025567521097747358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 531.3333333333334, 279, 1343, 546.0, 1328.6, 1343.0, 1343.0, 0.11547966403116412, 18.575618189105647, 0.2557769303388173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1074.4285714285716, 143, 1665, 1364.0, 1665.0, 1665.0, 1665.0, 0.08190199840876117, 69.99430707984274, 0.14741902671175175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e75e2e02-c4fa-43eb-a4c1-18a4660ae9bf", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 960.7619047619049, 219, 1663, 969.0, 1607.4, 1660.8, 1663.0, 0.0977166867528745, 0.03086364101681192, 0.044087020781082044], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 413.0, 278, 1133, 286.0, 676.1999999999996, 1133.0, 1133.0, 0.11264022050979638, 8.091175839666585, 0.25163519849525917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 146.73333333333335, 137, 162, 147.0, 156.6, 162.0, 162.0, 0.08113678038437197, 0.06299193398982005, 0.028841589902257228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 493.7857142857143, 272, 1309, 539.0, 951.5, 1309.0, 1309.0, 0.09116067068207716, 7.92117934030604, 0.20335646264040372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77b8cc9e-f0bf-4caa-ae56-9c3070a155e7", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 142.25000000000003, 133, 165, 140.5, 165.0, 165.0, 165.0, 0.04103763664250576, 0.03049769676264344, 0.020598969955320273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 174.875, 132, 425, 139.0, 425.0, 425.0, 425.0, 0.041039952393655224, 0.01868640410502124, 0.022974758505530136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 306.75, 132, 1210, 139.0, 1210.0, 1210.0, 1210.0, 0.041039320799240775, 4.6255853313283914, 0.023685779875343062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 267.87499999999994, 131, 916, 139.5, 916.0, 916.0, 916.0, 0.0410391102720893, 1.518036288192022, 0.023725735626051625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 2.0200128424657535, 4.234000428082192], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1315.3396226415093, 1036, 2045, 1111.0, 1798.4, 1947.1, 2045.0, 0.23809523809523808, 284.8446800595238, 0.4701450892857143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 960.7619047619049, 219, 1663, 969.0, 1607.4, 1660.8, 1663.0, 0.09297712762660386, 0.029366659730277783, 0.041948665003409165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed18eb26-5166-4c83-b304-c7db66ffeeaf", 3, 0, 0.0, 305.6666666666667, 229, 434, 254.0, 434.0, 434.0, 434.0, 0.06639665360865812, 0.030042756678396742, 0.04257858320607308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 214.63636363636365, 133, 426, 138.0, 424.0, 426.0, 426.0, 0.05606438229792613, 0.015111103041237901, 0.03301447512270454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 214.18181818181816, 130, 433, 144.0, 428.20000000000005, 433.0, 433.0, 0.056062667869465725, 0.015110640949191933, 0.03295871685294762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07887442-2051-4926-9a82-504d2e3fde9b", 3, 0, 0.0, 510.6666666666667, 227, 718, 587.0, 718.0, 718.0, 718.0, 0.0384970742223591, 0.031516973199620164, 0.024687251373062314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 172.20000000000002, 131, 408, 137.0, 395.40000000000003, 408.0, 408.0, 0.08530142680853242, 0.02299140019448725, 0.050147909119859876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 184.06666666666666, 132, 545, 140.0, 459.80000000000007, 545.0, 545.0, 0.08529948649709129, 0.022990877219919135, 0.05023006870873637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 235.81818181818184, 130, 413, 143.0, 411.4, 413.0, 413.0, 0.056064096552567735, 0.015001525835355039, 0.031974055065136286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 139.4, 132, 152, 138.0, 148.4, 152.0, 152.0, 0.08530239699735562, 0.06339367589354261, 0.04281780474281327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 269.18181818181813, 133, 433, 183.0, 432.0, 433.0, 433.0, 0.05606552530848781, 0.04166588355445237, 0.028142265633362043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 155.4, 130, 406, 138.0, 249.4000000000001, 406.0, 406.0, 0.0853009417223966, 0.022824666046813154, 0.048648193326054315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 173.27272727272728, 140, 416, 148.0, 365.6000000000002, 416.0, 416.0, 0.055521905915606705, 0.043701812664041995, 0.01973630249343832], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 542.5384615384615, 143, 1073, 488.0, 939.7999999999998, 1073.0, 1073.0, 0.0734342960757842, 0.01375789771732315, 0.04997856989532788], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2f8ced4-df71-4ee3-85a5-b9a4514f3c6f", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1192.8571428571427, 712, 1823, 1151.0, 1625.8, 1804.5999999999997, 1823.0, 0.09140847400081832, 0.0473110265824548, 0.04204432739686077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 539.4545454545455, 277, 861, 328.0, 860.8, 861.0, 861.0, 0.05602412093061158, 0.0868264452313287, 0.12599956103827975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcf7f08d-23d8-48a7-a026-2ef1503c9975", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1bc326a-f87a-4eb7-a90c-52b857805c76", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f72339a7-ce81-4074-8037-7b33bbc680e0", 3, 0, 0.0, 451.33333333333337, 300, 740, 314.0, 740.0, 740.0, 740.0, 0.056063239333968715, 0.025367155818429854, 0.035952012203098425], "isController": false}, {"data": ["addBook", 60, 4, 6.666666666666667, 1234.9, 713, 2637, 1090.0, 1948.4, 2061.9, 2637.0, 0.2663754295303801, 80.68971327459755, 0.9698554233482504], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 267.07547169811323, 136, 828, 145.0, 550.0, 616.5999999999999, 828.0, 0.23911788060347938, 0.1777038155656717, 0.1155892098620335], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 804.0566037735848, 647, 1122, 710.0, 1051.8, 1106.6, 1122.0, 0.23900789177001128, 70.27625598928974, 0.12020416431792559], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 209.33962264150938, 130, 596, 141.0, 413.8, 421.9, 596.0, 0.23959350475570504, 0.42396819396224367, 0.11652105993002061], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1036.4528301886796, 891, 1386, 959.0, 1277.4, 1309.6, 1386.0, 0.2387172326817404, 214.79818558716556, 0.11982486093595171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 144.57142857142858, 133, 158, 143.5, 157.0, 158.0, 158.0, 0.09106342567598331, 0.06803078187707738, 0.03237020209575969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 4, 2.3121387283236996, 204.77456647398841, 131, 1150, 148.0, 332.79999999999995, 403.99999999999983, 1037.5199999999986, 0.7432229239163123, 1.5429872097456716, 0.3605817639193195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 144.75, 139, 157, 144.0, 157.0, 157.0, 157.0, 0.04107240037375884, 0.031807044430069105, 0.01459995482035959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 177.73333333333332, 133, 418, 143.0, 415.0, 418.0, 418.0, 0.11031520731904629, 0.08952337625207761, 0.03921360885169224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 488.25, 272, 1349, 301.5, 1349.0, 1349.0, 1349.0, 0.04100902711209305, 6.188243168472773, 0.09091869511838793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2f8ced4-df71-4ee3-85a5-b9a4514f3c6f", 3, 0, 0.0, 536.6666666666666, 240, 882, 488.0, 882.0, 882.0, 882.0, 0.02265262204100125, 0.026774632366821458, 0.014526583795824366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 360.5333333333333, 274, 683, 285.0, 609.8000000000001, 683.0, 683.0, 0.08523453703440634, 0.13209688503281528, 0.1916944714748416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed18eb26-5166-4c83-b304-c7db66ffeeaf", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77b8cc9e-f0bf-4caa-ae56-9c3070a155e7", 3, 0, 0.0, 569.6666666666666, 315, 1073, 321.0, 1073.0, 1073.0, 1073.0, 0.017900722592501982, 0.024677591204181608, 0.011479304527092744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee5d44dd-329b-4e29-b872-3fcb69fa6b1c", 3, 0, 0.0, 325.3333333333333, 219, 520, 237.0, 520.0, 520.0, 520.0, 0.038994969648915294, 0.03250850171577866, 0.0250065397813682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/826e9943-0f3e-45d5-bacb-be7a70ddcef8", 3, 0, 0.0, 559.6666666666666, 224, 965, 490.0, 965.0, 965.0, 965.0, 0.018629259114365023, 0.0256819376137161, 0.011946497544042672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 178.11764705882356, 136, 430, 147.0, 412.4, 430.0, 430.0, 0.09223640733767749, 0.07647334944305487, 0.032787160420815045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3cbb47-59b6-4f09-b424-16cef9d372be", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.8895151462395543, 1.6620604108635098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 145.12499999999997, 137, 155, 144.5, 154.3, 155.0, 155.0, 0.07160534712929688, 0.05559204196073342, 0.02545346323736725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba95e2a1-3509-4427-9479-27a4b08b0348", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9801572-340d-4307-9bf5-7c24d6df14d5", 2, 0, 0.0, 252.0, 224, 280, 252.0, 280.0, 280.0, 280.0, 0.014034989228145767, 0.023738868499168425, 0.008723897113002716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 139.07142857142853, 131, 145, 140.5, 143.5, 145.0, 145.0, 0.09124444386511465, 0.0678095915833518, 0.04580043373698137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c045089-0c85-4944-95a1-05fdbe63a3b9", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 234.85714285714286, 131, 429, 139.0, 425.5, 429.0, 429.0, 0.09125098583654341, 0.03420638936143864, 0.051494173787502526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 295.0, 136, 1172, 141.0, 812.5, 1172.0, 1172.0, 0.09124682265528254, 5.8874122665873685, 0.05308304275565404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=942eb065-65d9-4452-85e6-ac3b98c8e844", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 255.21428571428572, 132, 675, 144.5, 546.0, 675.0, 675.0, 0.09124503855102878, 1.9391989296631105, 0.05317111133198204], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3924646781789639], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07849293563579278], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07849293563579278], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.47095761381475665], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 13, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
