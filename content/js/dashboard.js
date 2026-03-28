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

    var data = {"OkPercent": 98.51190476190476, "KoPercent": 1.4880952380952381};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.790187217559716, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.034482758620689655, 500, 1500, "see books"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0a80d74-eff4-48b6-a219-9343023a4d4f"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42261a4e-38d7-473a-ab1c-407beddbe4f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c606948b-44dc-4bee-9f53-8f9669f6b6a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60e9d85e-4812-4038-8bd6-9c6036f5b319"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02469eff-7f22-49a7-90c1-6bb8b7e9f232"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0124ea89-a734-4f2f-ba57-7fd5a301a316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c09abed-4cd4-4f2c-be39-49dd8ec539b1"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f3724de-f845-4a0f-8ead-1e100752ebcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fd5a289-72f4-4086-9a70-b00c093bc953"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/555d79c5-599c-4925-9472-95865df563e4"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6011c1ce-479e-41b0-9ac3-7195ccaf3e0b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60e9d85e-4812-4038-8bd6-9c6036f5b319"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd9c8bce-7936-424d-ba11-5bf92d623b41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74291e8d-2a20-4260-9c09-fad6abc079a6"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6336c02c-5203-47c7-99e4-7c0e4b178bff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0a80d74-eff4-48b6-a219-9343023a4d4f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c606948b-44dc-4bee-9f53-8f9669f6b6a0"], "isController": false}, {"data": [0.29365079365079366, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0124ea89-a734-4f2f-ba57-7fd5a301a316"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9402173913043478, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42261a4e-38d7-473a-ab1c-407beddbe4f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02469eff-7f22-49a7-90c1-6bb8b7e9f232"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6336c02c-5203-47c7-99e4-7c0e4b178bff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=555d79c5-599c-4925-9472-95865df563e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f3724de-f845-4a0f-8ead-1e100752ebcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd9c8bce-7936-424d-ba11-5bf92d623b41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2098d0fd-a8b2-4ce0-90ab-8ad7b33d93ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 20, 1.4880952380952381, 369.44791666666674, 107, 1974, 125.0, 1028.0, 1255.75, 1640.55, 5.195467882035047, 724.845101929407, 3.8101592730790492], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1839.7586206896544, 1376, 2406, 1832.5, 2185.6, 2247.75, 2406.0, 0.2570716875426606, 309.3435308796284, 1.2640194792747033], "isController": true}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 441.9090909090909, 118, 576, 456.0, 570.2, 576.0, 576.0, 0.07066229845185328, 0.013500112417292993, 0.047720889943470166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 441.9090909090909, 118, 576, 456.0, 570.2, 576.0, 576.0, 0.07226477814713109, 0.013806267984075471, 0.048803104347054885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 135.35, 107, 342, 114.0, 313.1000000000005, 341.65, 342.0, 0.1307343347583376, 0.0349816481677583, 0.0745594252918644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 168.7, 108, 342, 115.0, 338.20000000000005, 341.85, 342.0, 0.13073860776456592, 0.09716023487190885, 0.06562465272557312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 189.65000000000003, 109, 343, 115.0, 342.20000000000005, 343.0, 343.0, 0.1307368985285562, 0.035237679681524914, 0.07698666973898377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 206.69999999999996, 108, 442, 115.0, 345.8, 437.19999999999993, 442.0, 0.13074031704526884, 0.035238601078607615, 0.07686100670044126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0a80d74-eff4-48b6-a219-9343023a4d4f", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 0.2474850171232877, 0.9444563356164384], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 248.9090909090909, 108, 470, 201.0, 453.6, 470.0, 470.0, 0.07083612384730308, 0.16389028973584566, 0.04578815853446499], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42261a4e-38d7-473a-ab1c-407beddbe4f7", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 171.42857142857144, 110, 457, 115.0, 402.5, 457.0, 457.0, 0.1069600427840171, 0.07948885992054398, 0.053688927725571094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 194.21428571428572, 108, 361, 118.0, 352.5, 361.0, 361.0, 0.10677975150826399, 0.040027510086872956, 0.060257267696837036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 713.6, 674, 865, 677.0, 865.0, 865.0, 865.0, 0.0779848709350386, 22.930141396319115, 0.04447574670513921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1246.2, 1013, 1409, 1288.0, 1409.0, 1409.0, 1409.0, 0.07710456921677178, 69.37882691662683, 0.04389840220056441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 294.6, 115, 344, 342.0, 344.0, 344.0, 344.0, 0.07841046309219502, 0.13874976476861073, 0.04341673102858845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 132.71428571428572, 110, 365, 115.5, 243.0, 365.0, 365.0, 0.07128345867341483, 0.05297530473678583, 0.03578095484192893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 114.78571428571429, 109, 121, 115.0, 119.5, 121.0, 121.0, 0.07128236983330108, 0.019073602865551268, 0.040653226545554526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c606948b-44dc-4bee-9f53-8f9669f6b6a0", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 160.14285714285717, 108, 345, 114.5, 338.5, 345.0, 345.0, 0.07119971520113919, 0.01919054823780705, 0.041857645069419726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 146.57142857142853, 109, 344, 115.0, 343.5, 344.0, 344.0, 0.07120007730294108, 0.019190645835558337, 0.041927389271165495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 251.6, 114, 349, 339.0, 349.0, 349.0, 349.0, 0.07839693938348646, 0.05826178795979805, 0.044021718892094455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 786.3529411764706, 108, 1473, 1174.0, 1383.3999999999999, 1473.0, 1473.0, 0.08447372867038351, 44.72091021374337, 0.04539104193375272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 242.0, 110, 1255, 115.0, 797.0, 1255.0, 1255.0, 0.10678300929774917, 6.889835508878244, 0.062121254013897044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60e9d85e-4812-4038-8bd6-9c6036f5b319", 3, 0, 0.0, 402.3333333333333, 205, 614, 388.0, 614.0, 614.0, 614.0, 0.02220330829293565, 0.022268357047700107, 0.014238449653998444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 522.0, 110, 1079, 673.0, 1031.0, 1079.0, 1079.0, 0.08447540771807077, 14.620301676588387, 0.0454744396671669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 199.0, 108, 652, 114.0, 498.5, 652.0, 652.0, 0.10696658058403753, 2.2733233704787517, 0.06233250657080423], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 497.4545454545455, 111, 730, 497.0, 726.6, 730.0, 730.0, 0.07248621114574341, 0.013848573010088764, 0.049506074426864714], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 296.92857142857144, 222, 708, 232.5, 585.0, 708.0, 708.0, 0.0711584597243118, 0.11028171443601838, 0.16003704369637703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02469eff-7f22-49a7-90c1-6bb8b7e9f232", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 495.40000000000003, 120, 1305, 357.0, 1058.0, 1292.85, 1305.0, 0.09386190098508065, 0.057655405976187235, 0.04243951187118392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 115.88235294117646, 110, 125, 116.0, 120.19999999999999, 125.0, 125.0, 0.08447079049753296, 0.062775655828733, 0.04240037726145698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 190.64705882352942, 108, 343, 115.0, 342.2, 343.0, 343.0, 0.08447498794989143, 0.09723746602366294, 0.04400385976158177], "isController": false}, {"data": ["login", 20, 0, 0.0, 2334.9999999999995, 1377, 4179, 2060.0, 3608.1, 4150.7, 4179.0, 0.09445144959362263, 28.37871743933856, 0.18166223630335918], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0124ea89-a734-4f2f-ba57-7fd5a301a316", 3, 0, 0.0, 302.3333333333333, 207, 420, 280.0, 420.0, 420.0, 420.0, 0.026041666666666668, 0.026117960611979164, 0.016699896918402776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 116.85714285714285, 110, 126, 117.0, 125.0, 126.0, 126.0, 0.1035189032911617, 0.08380583088708304, 0.036797735154280135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c09abed-4cd4-4f2c-be39-49dd8ec539b1", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 904.1176470588235, 221, 1591, 1290.0, 1503.0, 1591.0, 1591.0, 0.08442296900683825, 59.46518146127469, 0.1771631135563424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f3724de-f845-4a0f-8ead-1e100752ebcb", 3, 0, 0.0, 537.3333333333334, 268, 935, 409.0, 935.0, 935.0, 935.0, 0.02959776635523239, 0.029684478561351237, 0.018980338450458274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fd5a289-72f4-4086-9a70-b00c093bc953", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 412.25, 224, 774, 452.5, 678.9, 769.3, 774.0, 0.13063954589693846, 0.20246578060394663, 0.29381140058657157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1101.4285714285713, 108, 1749, 1467.0, 1749.0, 1749.0, 1749.0, 0.07521463032009199, 64.27921215360978, 0.13538213733117002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/555d79c5-599c-4925-9472-95865df563e4", 3, 0, 0.0, 944.0, 195, 1868, 769.0, 1868.0, 1868.0, 1868.0, 0.02365669405586134, 0.023726000776728123, 0.015170471123062123], "isController": false}, {"data": ["register", 20, 5, 25.0, 1022.45, 193, 1974, 980.5, 1757.8000000000004, 1964.35, 1974.0, 0.09608870909623765, 0.03030923148250465, 0.0433525230492791], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6011c1ce-479e-41b0-9ac3-7195ccaf3e0b", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.5612230887521968, 1.0486461994727594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60e9d85e-4812-4038-8bd6-9c6036f5b319", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 131.83333333333331, 110, 346, 119.0, 153.40000000000032, 346.0, 346.0, 0.08823269903826358, 0.06850097239787065, 0.031363967236257756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 479.64285714285717, 222, 1373, 445.5, 1086.5, 1373.0, 1373.0, 0.10668048432939885, 9.269734877565094, 0.2379772522917254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd9c8bce-7936-424d-ba11-5bf92d623b41", 3, 0, 0.0, 375.0, 312, 439, 374.0, 439.0, 439.0, 439.0, 0.01830920586871079, 0.02524071837694993, 0.011741255065546958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74291e8d-2a20-4260-9c09-fad6abc079a6", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 332.00000000000006, 220, 684, 236.5, 468.3, 673.2499999999999, 684.0, 0.14346070252706028, 0.2223360692484811, 0.322646482343574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6336c02c-5203-47c7-99e4-7c0e4b178bff", 3, 0, 0.0, 364.3333333333333, 222, 470, 401.0, 470.0, 470.0, 470.0, 0.02392630697451848, 0.02399640357698289, 0.015343367428320771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 178.85714285714286, 113, 341, 116.0, 341.0, 341.0, 341.0, 0.037988353856089264, 0.028231579379378837, 0.019068372931669807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 144.2857142857143, 107, 341, 113.0, 341.0, 341.0, 341.0, 0.03798959085210653, 0.01831640987512279, 0.02121014824081059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 338.57142857142856, 110, 1015, 325.0, 1015.0, 1015.0, 1015.0, 0.03798959085210653, 4.892076702679894, 0.021867334243274486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 287.0, 112, 858, 117.0, 858.0, 858.0, 858.0, 0.037988560016497884, 1.604476086879837, 0.02190383908317324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1240.8448275862063, 870, 1926, 1210.5, 1703.8, 1772.35, 1926.0, 0.2578820767510415, 308.51661810999116, 0.5092163663970761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, 25.0, 1022.45, 193, 1974, 980.5, 1757.8000000000004, 1964.35, 1974.0, 0.09513028091971955, 0.030006914782294353, 0.0429201072118266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 171.27272727272728, 107, 337, 115.0, 335.4, 337.0, 337.0, 0.06538822774125283, 0.017624170758384555, 0.038504981765601035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 193.72727272727275, 108, 343, 115.0, 342.4, 343.0, 343.0, 0.06538667300719254, 0.017623751708969865, 0.03844021206086905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0a80d74-eff4-48b6-a219-9343023a4d4f", 3, 0, 0.0, 271.0, 199, 401, 213.0, 401.0, 401.0, 401.0, 0.025817111581556255, 0.025892747650642846, 0.016555895122287053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 296.99999999999994, 109, 1229, 115.0, 1029.2000000000003, 1229.0, 1229.0, 0.08923702344950671, 13.402648565700758, 0.051183475038421494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 255.27777777777783, 109, 904, 115.0, 874.3000000000001, 904.0, 904.0, 0.08923613865312922, 4.393107887111327, 0.05127011221444436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 126.61111111111109, 108, 339, 115.0, 140.1000000000003, 339.0, 339.0, 0.08923348436926799, 0.06631511875489546, 0.04479102633379272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 112.81818181818183, 108, 115, 114.0, 115.0, 115.0, 115.0, 0.06538628433522953, 0.01749593936313759, 0.037290615284935595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 149.66666666666666, 107, 345, 114.0, 341.4, 345.0, 345.0, 0.08923746585427521, 0.04621640891085673, 0.04964415011229048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 155.0909090909091, 108, 347, 116.0, 346.2, 347.0, 347.0, 0.06538745036498085, 0.04859360324975628, 0.032821435046484534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 156.54545454545453, 115, 340, 118.0, 337.40000000000003, 340.0, 340.0, 0.0676656578332226, 0.0532602736460717, 0.02405302680790335], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 454.0, 109, 769, 420.0, 738.0000000000001, 769.0, 769.0, 0.07024041377989208, 0.013244907570000958, 0.047803889562913066], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1150.65, 845, 1641, 1092.0, 1419.6000000000001, 1630.0499999999997, 1641.0, 0.0934474638358315, 0.048366363118154974, 0.0429821830729264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 352.54545454545456, 225, 685, 232.0, 684.2, 685.0, 685.0, 0.06534317045063028, 0.10126915186049826, 0.14695832182402488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c606948b-44dc-4bee-9f53-8f9669f6b6a0", 3, 0, 0.0, 294.6666666666667, 195, 413, 276.0, 413.0, 413.0, 413.0, 0.01782340569636046, 0.024571003621121922, 0.011429723053981154], "isController": false}, {"data": ["addBook", 63, 11, 17.46031746031746, 1066.3650793650793, 567, 2297, 917.0, 1886.0, 2024.1999999999998, 2297.0, 0.2862101236609455, 82.6281288970575, 1.0418461986866137], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0124ea89-a734-4f2f-ba57-7fd5a301a316", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 198.77586206896564, 109, 675, 116.0, 451.5, 458.15, 675.0, 0.2587529890431493, 0.19229592252132482, 0.125080790601913], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 704.5689655172415, 534, 1028, 673.0, 921.0, 1023.25, 1028.0, 0.2585246266993537, 76.01482407510586, 0.1300197097169601], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 181.2758620689655, 109, 467, 116.5, 346.0, 364.8499999999998, 467.0, 0.259186600946478, 0.4586387899560724, 0.12604973366342387], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1039.4999999999995, 756, 1481, 1034.0, 1291.9, 1354.55, 1481.0, 0.2584485954655639, 232.55250050408617, 0.12972908014580065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 118.8, 112, 132, 117.5, 128.8, 131.85, 132.0, 0.1338723928351495, 0.10001209035047794, 0.04758745214061957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 11, 5.978260869565218, 163.00000000000006, 109, 469, 119.0, 270.5, 335.5, 452.85000000000014, 0.7691375209527272, 1.6234812211834684, 0.3706977023061585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 117.14285714285714, 113, 122, 117.0, 122.0, 122.0, 122.0, 0.039742694441132556, 0.030777301456853624, 0.014127285914621337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42261a4e-38d7-473a-ab1c-407beddbe4f7", 3, 0, 0.0, 333.0, 201, 597, 201.0, 597.0, 597.0, 597.0, 0.04301013605539705, 0.035855780741494744, 0.0275813698011498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 127.95000000000002, 113, 335, 117.0, 121.0, 324.29999999999984, 335.0, 0.12840596830940704, 0.10420445279796604, 0.045644309047484524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 519.4285714285714, 229, 1357, 452.0, 1357.0, 1357.0, 1357.0, 0.03796445442367246, 6.538815858159374, 0.08399529613630323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 439.6666666666667, 224, 1348, 233.0, 1340.8, 1348.0, 1348.0, 0.0891835248301797, 17.897597688474516, 0.19677276409471292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02469eff-7f22-49a7-90c1-6bb8b7e9f232", 3, 0, 0.0, 299.6666666666667, 195, 422, 282.0, 422.0, 422.0, 422.0, 0.06237914041544508, 0.02822493658120724, 0.0400022482481858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 134.07142857142858, 111, 346, 117.5, 237.0, 346.0, 346.0, 0.07599155408156065, 0.0630047162258252, 0.027012622739929763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6336c02c-5203-47c7-99e4-7c0e4b178bff", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 118.11764705882354, 110, 125, 118.0, 124.2, 125.0, 125.0, 0.08178935872331623, 0.0634985743994496, 0.029073561108678814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=555d79c5-599c-4925-9472-95865df563e4", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f3724de-f845-4a0f-8ead-1e100752ebcb", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd9c8bce-7936-424d-ba11-5bf92d623b41", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 126.0, 109, 342, 115.5, 122.7, 331.04999999999984, 342.0, 0.14358120234898847, 0.10670438963630881, 0.07207103321033209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2098d0fd-a8b2-4ce0-90ab-8ad7b33d93ca", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 180.0, 107, 348, 115.0, 342.40000000000003, 347.8, 348.0, 0.14358017157830502, 0.03841891309810116, 0.0818855666032521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 147.79999999999998, 107, 342, 115.0, 336.6, 341.8, 342.0, 0.14358223313447194, 0.03869989877452564, 0.08441064877632042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 180.09999999999997, 108, 346, 115.5, 341.8, 345.8, 346.0, 0.14358635642441253, 0.03870101013001745, 0.08455329387101639], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.37202380952380953], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.0744047619047619], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.0744047619047619], "isController": false}, {"data": ["401/Unauthorized", 13, 65.0, 0.9672619047619048], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 20, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
