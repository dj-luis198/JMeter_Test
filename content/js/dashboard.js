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

    var data = {"OkPercent": 99.3076923076923, "KoPercent": 0.6923076923076923};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7808127914723517, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cacc7fa-75fa-4446-b055-7e9cdec9ffdb"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c2aa39e-14bd-445d-8319-18da525a1481"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/076cd530-f7fe-4f68-b050-e0ab78e49be9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2ef0bcd-ea21-4b08-b53b-db8dafd8869c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50b12e7f-bafc-4550-8159-2b61de20f359"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8236b050-2f67-4204-8f5e-6ebaff03241b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9d0d601-d5b9-49c6-aae6-a1af588b4a93"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a8c6d44-e448-417e-b9b1-28b7a04217c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b426c4b7-6d79-42e1-9628-c3de3b04646d"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c17294c-aa2b-417b-b3cd-49a724551dbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97470533-88a3-4ae3-89a3-56f1b5368906"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcee052f-7f44-4539-b5d3-b9ba558a61f1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a73f221-1aec-4573-9f83-cd38472f50a3"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.275, 500, 1500, "register"], "isController": true}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9453493-07af-4f30-901c-c58acb77a6c7"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2cacc7fa-75fa-4446-b055-7e9cdec9ffdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=076cd530-f7fe-4f68-b050-e0ab78e49be9"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50b12e7f-bafc-4550-8159-2b61de20f359"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9691011235955056, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9d0d601-d5b9-49c6-aae6-a1af588b4a93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1242f3b2-d734-4955-8414-e75e7eb087a9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/97470533-88a3-4ae3-89a3-56f1b5368906"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8236b050-2f67-4204-8f5e-6ebaff03241b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c17294c-aa2b-417b-b3cd-49a724551dbc"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2ef0bcd-ea21-4b08-b53b-db8dafd8869c"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcee052f-7f44-4539-b5d3-b9ba558a61f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a73f221-1aec-4573-9f83-cd38472f50a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0106ea86-4ee8-4a8b-96aa-dfd8b8bf5b30"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b426c4b7-6d79-42e1-9628-c3de3b04646d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 9, 0.6923076923076923, 398.45461538461535, 125, 2895, 146.0, 1031.0, 1229.7500000000002, 1705.94, 5.167013784002925, 707.0947353346238, 3.786029208284313], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cacc7fa-75fa-4446-b055-7e9cdec9ffdb", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1923.142857142857, 1559, 2439, 1860.5, 2250.6, 2330.95, 2439.0, 0.24459916312143473, 294.3365926763298, 1.2026921741371328], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9c2aa39e-14bd-445d-8319-18da525a1481", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 574.0909090909091, 464, 1153, 505.0, 1044.0000000000005, 1153.0, 1153.0, 0.07166217149409113, 0.012946779029694199, 0.04870788218739007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 574.0909090909091, 464, 1153, 505.0, 1044.0000000000005, 1153.0, 1153.0, 0.06974473427256242, 0.01260036703166411, 0.04740462407588227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 187.0526315789474, 127, 402, 134.0, 401.0, 402.0, 402.0, 0.11025166392971747, 0.02950093351244393, 0.06287790208491699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 192.78947368421052, 126, 408, 134.0, 405.0, 408.0, 408.0, 0.11024270802508893, 0.08192841875692643, 0.05533667180165596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 200.26315789473685, 125, 405, 134.0, 403.0, 405.0, 405.0, 0.11025038442568254, 0.029715923927234746, 0.06492283379754547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 199.94736842105266, 125, 409, 131.0, 404.0, 409.0, 409.0, 0.11024654609175993, 0.02971488937629467, 0.06481291088597606], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 303.72727272727275, 202, 542, 255.0, 527.6, 542.0, 542.0, 0.07142161477778139, 0.19845114518066423, 0.04617295799110477], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/076cd530-f7fe-4f68-b050-e0ab78e49be9", 3, 0, 0.0, 477.6666666666667, 326, 585, 522.0, 585.0, 585.0, 585.0, 0.02880377905581212, 0.02373123853849625, 0.018471173417952434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2ef0bcd-ea21-4b08-b53b-db8dafd8869c", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50b12e7f-bafc-4550-8159-2b61de20f359", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 154.6086956521739, 127, 391, 133.0, 286.80000000000035, 389.59999999999997, 391.0, 0.11687229415232017, 0.08685528891593325, 0.058664413275676335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 178.1304347826087, 127, 401, 133.0, 395.0, 400.6, 401.0, 0.11672401368208439, 0.03885514042406342, 0.06614294695147327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 755.0, 640, 1071, 654.5, 1071.0, 1071.0, 1071.0, 0.05247622171203673, 15.429751557887833, 0.029927845195145953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1176.25, 1125, 1214, 1183.0, 1214.0, 1214.0, 1214.0, 0.05238207485398497, 47.13348303148163, 0.02982299769518871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 325.5, 132, 396, 387.0, 396.0, 396.0, 396.0, 0.053130728156629385, 0.09401648380841059, 0.029419065297664904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 135.71428571428572, 128, 146, 136.5, 142.5, 146.0, 146.0, 0.08372704981759464, 0.062222934483583514, 0.04202705430297231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 152.0, 128, 404, 132.5, 270.0, 404.0, 404.0, 0.08372955354205915, 0.031386901557967764, 0.04724972713136569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 223.42857142857144, 127, 1158, 131.0, 777.5, 1158.0, 1158.0, 0.08322039137361201, 5.3695322066629805, 0.048413648441400954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 204.85714285714283, 128, 899, 132.0, 645.0, 899.0, 899.0, 0.08334871315540367, 1.7713810844560605, 0.048569695152081635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 198.25, 132, 395, 133.0, 395.0, 395.0, 395.0, 0.053130022447434484, 0.0394843233227516, 0.02983375283913557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 233.43478260869566, 127, 1168, 133.0, 402.40000000000003, 1015.9999999999978, 1168.0, 0.11672223660104847, 4.596478263338053, 0.06818378613948814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 625.6190476190476, 129, 1336, 140.0, 1287.8000000000002, 1333.3999999999999, 1336.0, 0.09580860178751477, 41.06531145494486, 0.052404239872802676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 220.2173913043478, 125, 641, 135.0, 398.6, 593.3999999999993, 641.0, 0.11687823320764688, 1.524310116700375, 0.06838905111390038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 457.47619047619054, 128, 948, 392.0, 937.6, 947.1, 948.0, 0.0956968324348464, 13.412580373946765, 0.05243655955077172], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 513.4545454545455, 250, 922, 457.0, 900.2, 922.0, 922.0, 0.06980271215265219, 0.012610841551016265, 0.04812569802712153], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8236b050-2f67-4204-8f5e-6ebaff03241b", 3, 0, 0.0, 700.6666666666666, 273, 1029, 800.0, 1029.0, 1029.0, 1029.0, 0.01707086685861908, 0.023533568081462175, 0.010947137926913928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9d0d601-d5b9-49c6-aae6-a1af588b4a93", 3, 0, 0.0, 297.0, 210, 448, 233.0, 448.0, 448.0, 448.0, 0.019585825085524772, 0.02700064102773353, 0.012559920383621028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 400.14285714285717, 266, 1295, 274.0, 919.0, 1295.0, 1295.0, 0.08315119262567709, 7.2252157012466744, 0.1854893373443885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a8c6d44-e448-417e-b9b1-28b7a04217c1", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b426c4b7-6d79-42e1-9628-c3de3b04646d", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 590.65, 141, 1682, 533.5, 1203.0000000000007, 1659.7499999999995, 1682.0, 0.08499390168755391, 0.05220816812643693, 0.03842985984505612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 134.04761904761907, 126, 143, 134.0, 142.0, 143.0, 143.0, 0.09581209878683633, 0.0712041085710766, 0.048093182398861206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 226.28571428571433, 128, 527, 134.0, 403.8, 514.6999999999998, 527.0, 0.09569377990430622, 0.09404726304397358, 0.05074831966279335], "isController": false}, {"data": ["login", 20, 0, 0.0, 2699.3, 1366, 4511, 2558.5, 4273.100000000001, 4502.2, 4511.0, 0.08419918158395501, 20.26310862852163, 0.15496267345031406], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3c17294c-aa2b-417b-b3cd-49a724551dbc", 3, 0, 0.0, 382.3333333333333, 232, 470, 445.0, 470.0, 470.0, 470.0, 0.016706204684419794, 0.02303085183545502, 0.010713288811297848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 152.7826086956522, 132, 400, 138.0, 178.20000000000002, 356.5999999999994, 400.0, 0.11916419271440487, 0.09647179273461098, 0.04235914662894861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97470533-88a3-4ae3-89a3-56f1b5368906", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 774.5714285714287, 263, 1468, 536.0, 1422.4, 1465.6, 1468.0, 0.09563799652059861, 54.56158820128838, 0.20343977282560183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcee052f-7f44-4539-b5d3-b9ba558a61f1", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a73f221-1aec-4573-9f83-cd38472f50a3", 3, 0, 0.0, 659.6666666666667, 244, 1404, 331.0, 1404.0, 1404.0, 1404.0, 0.025493945188017845, 0.02556863448056087, 0.01634865625663905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 451.89473684210526, 262, 817, 276.0, 810.0, 817.0, 817.0, 0.11015642211940956, 0.17072093935888963, 0.24774437513769554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1375.25, 1258, 1610, 1316.5, 1610.0, 1610.0, 1610.0, 0.052290999411726255, 62.55821458918883, 0.11791007582194914], "isController": false}, {"data": ["register", 20, 4, 20.0, 1226.45, 261, 2207, 1167.0, 1882.6000000000001, 2190.8999999999996, 2207.0, 0.08216960628433148, 0.026063171993311395, 0.03707261533531362], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 435.52173913043475, 261, 1296, 277.0, 786.6, 1194.1999999999985, 1296.0, 0.11664232392080494, 6.2400770821922675, 0.2610337536894474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 160.33333333333334, 132, 393, 139.5, 319.2000000000003, 393.0, 393.0, 0.08009878850582385, 0.06218607115442379, 0.028472616226679574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 590.9230769230769, 272, 1293, 534.0, 1088.9999999999998, 1293.0, 1293.0, 0.09523181621724575, 8.900111439538787, 0.21230428259308912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 197.125, 127, 408, 133.0, 408.0, 408.0, 408.0, 0.04009542711653736, 0.029797480503598563, 0.020126024939355665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 164.0, 125, 399, 131.5, 399.0, 399.0, 399.0, 0.04004124247975415, 0.010714160585402964, 0.022836021101734785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 228.625, 125, 405, 137.0, 405.0, 405.0, 405.0, 0.0400456520433294, 0.010793554652303626, 0.023542463408285447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 195.75, 126, 396, 134.5, 396.0, 396.0, 396.0, 0.04009422142033779, 0.010806645617200421, 0.023610171402796573], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1212.5535714285713, 1002, 1887, 1061.5, 1701.8, 1770.85, 1887.0, 0.24630975210682804, 294.67209464452225, 0.4863655456640687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9453493-07af-4f30-901c-c58acb77a6c7", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, 20.0, 1226.45, 261, 2207, 1167.0, 1882.6000000000001, 2190.8999999999996, 2207.0, 0.08479067302596714, 0.026894541600423955, 0.03825516693163752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cacc7fa-75fa-4446-b055-7e9cdec9ffdb", 3, 0, 0.0, 549.3333333333334, 499, 607, 542.0, 607.0, 607.0, 607.0, 0.01684834801947669, 0.02322680789794394, 0.010804441926552435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 169.71428571428572, 128, 404, 131.0, 404.0, 404.0, 404.0, 0.04506331395610833, 0.012145971339732324, 0.026536306948763015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 132.42857142857142, 129, 137, 131.0, 137.0, 137.0, 137.0, 0.04506360405829943, 0.012146049531338517, 0.026492470354586184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 239.33333333333334, 127, 912, 133.5, 755.4000000000005, 912.0, 912.0, 0.08288494878400873, 6.235480294535119, 0.04813370723654674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 256.9166666666667, 127, 949, 135.5, 822.1000000000005, 949.0, 949.0, 0.08288323134091255, 2.0513464855783177, 0.04821365052285505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 168.0, 128, 395, 131.0, 395.0, 395.0, 395.0, 0.045064474387284094, 0.012058267560660002, 0.025700833048997958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 177.41666666666666, 130, 394, 135.0, 393.7, 394.0, 394.0, 0.08273465616855807, 0.0614854231877663, 0.04152891920960825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 172.85714285714286, 132, 408, 134.0, 408.0, 408.0, 408.0, 0.045062153584694314, 0.03348857312300037, 0.022619088811067264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 198.25, 126, 403, 135.5, 401.8, 403.0, 403.0, 0.08288265887569674, 0.03255140883252868, 0.046688945698044666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 172.28571428571428, 134, 385, 137.0, 385.0, 385.0, 385.0, 0.045783053729683776, 0.03603627080676281, 0.016274444880473526], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 585.9090909090909, 420, 1404, 464.0, 1283.2000000000005, 1404.0, 1404.0, 0.07066956197720586, 0.012767450161897542, 0.04810223115050047], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=076cd530-f7fe-4f68-b050-e0ab78e49be9", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 0.19594800704989154, 0.7477799620390455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1404.1999999999998, 734, 2895, 1260.5, 2546.800000000001, 2880.35, 2895.0, 0.08481188723411473, 0.04389677757234454, 0.039010155163347694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 345.00000000000006, 265, 812, 267.0, 812.0, 812.0, 812.0, 0.04502389482418169, 0.06977824324802377, 0.10125979470711956], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 1191.3442622950818, 659, 2144, 1057.0, 1901.6000000000001, 2005.0, 2144.0, 0.27658629038839966, 76.94384936985935, 1.0091122217700617], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 230.9464285714286, 127, 555, 136.0, 544.3, 549.15, 555.0, 0.24728538057661653, 0.18377360802617693, 0.11953736658732927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50b12e7f-bafc-4550-8159-2b61de20f359", 3, 0, 0.0, 335.6666666666667, 237, 420, 350.0, 420.0, 420.0, 420.0, 0.02782853909445934, 0.02319950801461926, 0.01784577539586097], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 736.8214285714284, 627, 1061, 670.0, 921.5000000000001, 1042.35, 1061.0, 0.2469702048088627, 72.61744039638718, 0.12420864792633232], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 187.12499999999997, 126, 548, 135.0, 402.20000000000005, 455.9499999999999, 548.0, 0.24749193441463738, 0.4379447120696513, 0.12036228841649356], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 976.6428571428571, 866, 1296, 910.0, 1191.0, 1232.05, 1296.0, 0.24695169007562895, 222.20756482481866, 0.12395817255749345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 137.53846153846155, 130, 144, 138.0, 143.6, 144.0, 144.0, 0.09297003504255166, 0.06945515313237502, 0.03304794214403203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, 2.808988764044944, 195.33146067415723, 128, 1333, 139.0, 309.9, 381.4499999999998, 659.1300000000068, 0.7419325258217528, 1.501347716004485, 0.35923517124886417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 141.125, 134, 150, 142.0, 150.0, 150.0, 150.0, 0.039214532905894925, 0.03036828573669402, 0.013939540993892337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9d0d601-d5b9-49c6-aae6-a1af588b4a93", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 164.68421052631578, 128, 394, 139.0, 391.0, 394.0, 394.0, 0.10492020542271799, 0.08514520576785024, 0.03729585427135678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1242f3b2-d734-4955-8414-e75e7eb087a9", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97470533-88a3-4ae3-89a3-56f1b5368906", 3, 0, 0.0, 1092.0, 255, 2557, 464.0, 2557.0, 2557.0, 2557.0, 0.023922300368403423, 0.03297882228521761, 0.015340798087810789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8236b050-2f67-4204-8f5e-6ebaff03241b", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c17294c-aa2b-417b-b3cd-49a724551dbc", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 432.0, 260, 805, 270.5, 805.0, 805.0, 805.0, 0.04001540593128354, 0.06201606368451854, 0.0899955858005332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2ef0bcd-ea21-4b08-b53b-db8dafd8869c", 3, 0, 0.0, 305.0, 237, 428, 250.0, 428.0, 428.0, 428.0, 0.08534365043240782, 0.03861577932976786, 0.054728838330678195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 480.75, 263, 1342, 276.0, 1177.6000000000006, 1342.0, 1342.0, 0.08265715191006902, 8.357984734687763, 0.1841354879871606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcee052f-7f44-4539-b5d3-b9ba558a61f1", 3, 0, 0.0, 314.6666666666667, 235, 460, 249.0, 460.0, 460.0, 460.0, 0.019252242886296254, 0.022755499322962794, 0.012346002111329303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 143.85714285714286, 134, 183, 140.0, 177.0, 183.0, 183.0, 0.08978733229009005, 0.07444281749442036, 0.031916590774992946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a73f221-1aec-4573-9f83-cd38472f50a3", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 152.33333333333331, 130, 418, 139.0, 148.6, 391.0999999999996, 418.0, 0.09702144173862425, 0.07532426384981081, 0.03448809061802658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0106ea86-4ee8-4a8b-96aa-dfd8b8bf5b30", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b426c4b7-6d79-42e1-9628-c3de3b04646d", 3, 0, 0.0, 602.0, 202, 1112, 492.0, 1112.0, 1112.0, 1112.0, 0.034999708335763866, 0.029177816747360436, 0.022444474421046492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 153.9230769230769, 128, 391, 135.0, 289.7999999999999, 391.0, 391.0, 0.09550677363425314, 0.07097720189029945, 0.04793992348438096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 294.2307692307692, 130, 404, 384.0, 403.6, 404.0, 404.0, 0.09533168091753076, 0.0365228044380564, 0.05375297453177478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 290.8461538461538, 127, 1156, 135.0, 857.1999999999998, 1156.0, 1156.0, 0.09532538955087075, 6.621713164527956, 0.05541074702108158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 313.38461538461536, 131, 670, 384.0, 571.1999999999999, 670.0, 670.0, 0.09550817696930515, 2.183960342984557, 0.055610267404528554], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3076923076923077], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.38461538461538464], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
