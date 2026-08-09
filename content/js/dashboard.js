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

    var data = {"OkPercent": 99.33719966859984, "KoPercent": 0.6628003314001657};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6990049751243781, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/636da745-7ab9-431d-9c30-b29d893e4320"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9469a276-107c-4797-a082-f625d43e9ca6"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.2692307692307692, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e3fb793-bcd6-4877-9633-46adbc690341"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce363a5a-8896-41c4-b8cb-51c50485d0ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a201e6de-9640-497a-9288-ef1c994fb555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/825ff5b9-43da-4e1a-a303-b8600d001124"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5177522f-84dc-4ef1-a55a-f7843fb7c026"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/eec93e33-d5ea-4a6c-b846-2653a16ef441"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86c75b25-c260-4f87-9030-af0b13907731"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd8d180e-d434-4612-b709-68644b30cb8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/30c2228a-c18b-4ea8-8edb-b14781cff004"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c757d2d-861d-4911-9c6d-ef5bd0a58bc9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce363a5a-8896-41c4-b8cb-51c50485d0ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5269a635-2be9-4693-b1e0-dd7bdaa90614"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc6be5c7-126e-4a32-8ba2-3f42c62f85f9"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5177522f-84dc-4ef1-a55a-f7843fb7c026"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e3fb793-bcd6-4877-9633-46adbc690341"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/9469a276-107c-4797-a082-f625d43e9ca6"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30c2228a-c18b-4ea8-8edb-b14781cff004"], "isController": false}, {"data": [0.2549019607843137, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=825ff5b9-43da-4e1a-a303-b8600d001124"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/384bafcd-bb3e-44f1-ba16-8650f03eded7"], "isController": false}, {"data": [0.32407407407407407, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9326923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=636da745-7ab9-431d-9c30-b29d893e4320"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc6be5c7-126e-4a32-8ba2-3f42c62f85f9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd8d180e-d434-4612-b709-68644b30cb8b"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5269a635-2be9-4693-b1e0-dd7bdaa90614"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/86c75b25-c260-4f87-9030-af0b13907731"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c757d2d-861d-4911-9c6d-ef5bd0a58bc9"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/a201e6de-9640-497a-9288-ef1c994fb555"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bdab2965-d1ad-4a7e-b330-92797678e47f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1207, 8, 0.6628003314001657, 643.2742336371166, 137, 12880, 174.0, 1532.8000000000004, 1954.6, 5721.680000000011, 4.695164408553213, 682.4939932249304, 3.426381137361761], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/636da745-7ab9-431d-9c30-b29d893e4320", 3, 0, 0.0, 1859.6666666666667, 348, 4261, 970.0, 4261.0, 4261.0, 4261.0, 0.017800351260264868, 0.024539221219798738, 0.011414938796458917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9469a276-107c-4797-a082-f625d43e9ca6", 1, 0, 0.0, 2913.0, 2913, 2913, 2913.0, 2913.0, 2913.0, 2913.0, 0.34328870580157916, 0.06201993220048061, 0.23668147099210438], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2394.611111111111, 1704, 4138, 2258.0, 3032.0, 3405.75, 4138.0, 0.24085100689101493, 289.82556508691823, 1.184262519234629], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 2597.230769230769, 477, 6543, 2141.0, 6467.0, 6543.0, 6543.0, 0.08507519338245881, 0.015370030054448123, 0.057824545502139967], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 2597.230769230769, 477, 6543, 2141.0, 6467.0, 6543.0, 6543.0, 0.0847137327477225, 0.015304727107742836, 0.05757886522696764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e3fb793-bcd6-4877-9633-46adbc690341", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 169.14285714285717, 138, 417, 140.0, 371.60000000000014, 416.7, 417.0, 0.11080390873979021, 0.029648702143264177, 0.0631928542031616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce363a5a-8896-41c4-b8cb-51c50485d0ce", 3, 0, 0.0, 1712.6666666666665, 405, 3616, 1117.0, 3616.0, 3616.0, 3616.0, 0.036070264875978406, 0.023612403211455916, 0.02313099668153563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 154.19047619047618, 138, 416, 141.0, 150.20000000000002, 389.5999999999996, 416.0, 0.11080332409972299, 0.0823450484764543, 0.05561807479224377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a201e6de-9640-497a-9288-ef1c994fb555", 1, 0, 0.0, 4927.0, 4927, 4927, 4927.0, 4927.0, 4927.0, 4927.0, 0.20296326364927947, 0.036668167749137406, 0.13993365638319466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 192.9047619047619, 138, 420, 141.0, 416.8, 419.7, 420.0, 0.11080449338602702, 0.029865273607952596, 0.06524913038259209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 181.85714285714283, 137, 417, 140.0, 414.6, 416.8, 417.0, 0.11080566269700982, 0.029865588773803433, 0.0651416102964843], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 1092.1538461538462, 231, 5474, 751.0, 3900.3999999999987, 5474.0, 5474.0, 0.08883543577197994, 0.20115433747557027, 0.05743072117290109], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 156.8421052631579, 139, 418, 141.0, 152.0, 418.0, 418.0, 0.10786690359537421, 0.08016280628523416, 0.05414412934377182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 198.68421052631575, 138, 425, 140.0, 419.0, 425.0, 425.0, 0.10786629121627758, 0.04591635607798165, 0.06056390651966573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1067.75, 824, 1247, 1100.0, 1247.0, 1247.0, 1247.0, 0.1061317625832471, 31.20626210565417, 0.06052827084825811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1457.25, 1241, 1644, 1472.0, 1644.0, 1644.0, 1644.0, 0.10525207872855488, 94.70600545337334, 0.05992379091674561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 280.0, 139, 418, 281.5, 418.0, 418.0, 418.0, 0.10891466535969067, 0.19272790393726516, 0.060307241463813104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 142.16666666666669, 139, 150, 141.0, 150.0, 150.0, 150.0, 0.03358597449705004, 0.024959889250249098, 0.016858584854964567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 230.5, 138, 413, 140.5, 413.0, 413.0, 413.0, 0.033534915436121575, 0.01736785496707989, 0.01865597997406633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 414.16666666666663, 139, 1513, 140.5, 1513.0, 1513.0, 1513.0, 0.03353510286892805, 5.036689716810029, 0.019234652101253653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 279.8333333333333, 138, 983, 139.5, 983.0, 983.0, 983.0, 0.033586726525677055, 1.6534793574579327, 0.019297061301373698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 211.5, 141, 415, 145.0, 415.0, 415.0, 415.0, 0.10891169983935524, 0.08093926130639585, 0.06115647207776296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/825ff5b9-43da-4e1a-a303-b8600d001124", 3, 0, 0.0, 628.3333333333334, 231, 1185, 469.0, 1185.0, 1185.0, 1185.0, 0.03266550522648084, 0.027231887657883275, 0.02094760589067944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1288.0769230769233, 137, 1821, 1650.0, 1810.2, 1821.0, 1821.0, 0.061001074557390275, 42.22600509534937, 0.03182943688969598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 316.57894736842104, 137, 1672, 141.0, 1401.0, 1672.0, 1672.0, 0.10786751598142408, 10.242790174262812, 0.062438526160711244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 843.1538461538462, 138, 1381, 1095.0, 1279.3999999999999, 1381.0, 1381.0, 0.06100050208105559, 13.800850370460742, 0.031888708983027786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 265.05263157894734, 138, 839, 141.0, 689.0, 839.0, 839.0, 0.10786629121627758, 3.364567839381415, 0.06254315538706967], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 2608.0, 255, 7520, 2447.0, 6841.999999999999, 7520.0, 7520.0, 0.08260419248047682, 0.014923608993054893, 0.05695171864376624], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5177522f-84dc-4ef1-a55a-f7843fb7c026", 1, 0, 0.0, 2447.0, 2447, 2447, 2447.0, 2447.0, 2447.0, 2447.0, 0.4086636697997548, 0.07383083878218226, 0.2817544442174091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 602.6666666666667, 281, 1664, 417.5, 1664.0, 1664.0, 1664.0, 0.03350832123310622, 6.724543056447559, 0.07393209678320116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eec93e33-d5ea-4a6c-b846-2653a16ef441", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.3497655394304491, 0.6535374452354874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1177.95, 376, 3145, 1151.0, 2684.0000000000023, 3127.0, 3145.0, 0.08797821659357144, 0.054041306872418385, 0.03977921316681989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 142.15384615384613, 140, 145, 142.0, 144.6, 145.0, 145.0, 0.06099878471651988, 0.04533210465749182, 0.030618530609659394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86c75b25-c260-4f87-9030-af0b13907731", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 226.92307692307693, 139, 427, 144.0, 423.0, 427.0, 427.0, 0.061000215846917616, 0.08679883477856921, 0.030848366367296376], "isController": false}, {"data": ["login", 20, 0, 0.0, 6463.95, 1921, 15959, 3368.0, 14952.7, 15910.0, 15959.0, 0.08698412974552792, 20.93332544133573, 0.16008817472502143], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd8d180e-d434-4612-b709-68644b30cb8b", 3, 0, 0.0, 2161.6666666666665, 1463, 2659, 2363.0, 2659.0, 2659.0, 2659.0, 0.017447946958241246, 0.020622882618936838, 0.011188950360590904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 176.26315789473685, 140, 418, 146.0, 417.0, 418.0, 418.0, 0.11064910257754172, 0.08957822855154501, 0.039332298181860535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30c2228a-c18b-4ea8-8edb-b14781cff004", 3, 0, 0.0, 1934.0, 340, 4711, 751.0, 4711.0, 4711.0, 4711.0, 0.018066956139452812, 0.02135453051508892, 0.01158590611807358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c757d2d-861d-4911-9c6d-ef5bd0a58bc9", 3, 0, 0.0, 491.33333333333337, 248, 852, 374.0, 852.0, 852.0, 852.0, 0.01896225878426638, 0.022412747931533604, 0.012160042254233325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce363a5a-8896-41c4-b8cb-51c50485d0ce", 1, 0, 0.0, 7520.0, 7520, 7520, 7520.0, 7520.0, 7520.0, 7520.0, 0.13297872340425532, 0.024024476396276598, 0.09168259640957448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5269a635-2be9-4693-b1e0-dd7bdaa90614", 3, 0, 0.0, 334.6666666666667, 233, 487, 284.0, 487.0, 487.0, 487.0, 0.04140501000621075, 0.03411330739769512, 0.026552040921951556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1431.6153846153845, 282, 1965, 1793.0, 1953.4, 1965.0, 1965.0, 0.06095874031107714, 56.12014487811769, 0.12510004706718122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc6be5c7-126e-4a32-8ba2-3f42c62f85f9", 3, 0, 0.0, 310.0, 234, 437, 259.0, 437.0, 437.0, 437.0, 0.06159026052680203, 0.027867988975343365, 0.03949635847584635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 377.80952380952385, 279, 831, 285.0, 561.6, 804.0999999999997, 831.0, 0.11072036780251704, 0.171594945022065, 0.2490127021964812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1669.5, 1383, 1833, 1731.0, 1833.0, 1833.0, 1833.0, 0.10486302267662866, 125.45263140647528, 0.23645382750032767], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1852.3478260869567, 455, 5106, 1658.0, 3450.200000000001, 4839.7999999999965, 5106.0, 0.09602698775864661, 0.030253067644750248, 0.04332467611767064], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5177522f-84dc-4ef1-a55a-f7843fb7c026", 3, 0, 0.0, 1789.0, 270, 3967, 1130.0, 3967.0, 3967.0, 3967.0, 0.0358778717246493, 0.0293726716756162, 0.023007619563007523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 147.8571428571429, 142, 193, 143.5, 172.5, 193.0, 193.0, 0.07601094557616297, 0.05901240403618121, 0.02701951581027668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 548.5789473684212, 280, 1814, 294.0, 1541.0, 1814.0, 1814.0, 0.10778062671598103, 13.722413787907582, 0.23949834677282114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e3fb793-bcd6-4877-9633-46adbc690341", 3, 0, 0.0, 320.3333333333333, 236, 483, 242.0, 483.0, 483.0, 483.0, 0.034755610134735916, 0.028974322120787332, 0.022287940092913332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 591.076923076923, 279, 1544, 554.0, 1476.3999999999999, 1544.0, 1544.0, 0.06720082708710262, 12.456671822499354, 0.1484910102739726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 167.9, 139, 411, 141.5, 384.2000000000001, 411.0, 411.0, 0.056296479781119284, 0.04183752061858572, 0.02825819395263214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 167.3, 138, 415, 140.0, 387.60000000000014, 415.0, 415.0, 0.05629806447254344, 0.015064130532692286, 0.032107489894497424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 141.4, 137, 158, 139.5, 156.6, 158.0, 158.0, 0.05629869837409359, 0.015174258546142414, 0.03309747697383236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 168.9, 137, 415, 139.5, 389.4000000000001, 415.0, 415.0, 0.05629806447254344, 0.015174087689865222, 0.03315208288764032], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1606.9074074074074, 1105, 2645, 1509.5, 2087.5, 2254.5, 2645.0, 0.2412502122108348, 288.61912594824736, 0.4763749307522539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9469a276-107c-4797-a082-f625d43e9ca6", 3, 0, 0.0, 3769.0, 253, 5580, 5474.0, 5580.0, 5580.0, 5580.0, 0.020574015019030965, 0.02063429045365703, 0.013193622912594726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1852.3478260869567, 455, 5106, 1658.0, 3450.200000000001, 4839.7999999999965, 5106.0, 0.09569258548884349, 0.030147715027480412, 0.04317380321859931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 204.0, 139, 415, 145.0, 415.0, 415.0, 415.0, 0.04656167870372287, 0.012549827463112803, 0.02741864478353993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 142.44444444444446, 138, 148, 142.0, 148.0, 148.0, 148.0, 0.04662801722128103, 0.012567707766673403, 0.027412174186729667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 180.14285714285714, 138, 423, 140.0, 419.0, 423.0, 423.0, 0.07383615756636025, 0.019901151844058034, 0.043407584819286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 180.57142857142856, 138, 420, 141.0, 418.0, 420.0, 420.0, 0.07383421055407301, 0.019900627063402492, 0.04347854391025979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 172.44444444444446, 138, 412, 142.0, 412.0, 412.0, 412.0, 0.04662801722128103, 0.012476637420538087, 0.026592541071511835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 161.9285714285714, 139, 415, 142.0, 281.5, 415.0, 415.0, 0.073832263644466, 0.05486948499359241, 0.0370603354621636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 141.55555555555554, 140, 144, 142.0, 144.0, 144.0, 144.0, 0.046626567818342894, 0.03465118956031146, 0.02340435142444165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 160.35714285714283, 138, 416, 140.0, 281.0, 416.0, 416.0, 0.07383537874912321, 0.019756732204355233, 0.04210923944285933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 209.77777777777777, 142, 424, 147.0, 424.0, 424.0, 424.0, 0.045545175753772656, 0.03584903482181715, 0.016189886693723874], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 2499.6923076923076, 437, 5580, 2659.0, 5232.4, 5580.0, 5580.0, 0.07896111468798211, 0.014265435759059268, 0.053745993103050324], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 4399.95, 1005, 12880, 1627.0, 11867.600000000002, 12836.099999999999, 12880.0, 0.08840912205321345, 0.04575862762519837, 0.040664742663147985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 347.77777777777777, 281, 557, 291.0, 557.0, 557.0, 557.0, 0.04652653563415668, 0.07210704301895181, 0.1046392691068973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30c2228a-c18b-4ea8-8edb-b14781cff004", 1, 0, 0.0, 4447.0, 4447, 4447, 4447.0, 4447.0, 4447.0, 4447.0, 0.22487069934787499, 0.04062605408140319, 0.15503780638632786], "isController": false}, {"data": ["addBook", 51, 2, 3.9215686274509802, 1808.0784313725494, 706, 7737, 1151.0, 3152.600000000002, 3992.5999999999995, 7737.0, 0.22769483534538182, 80.99110176396528, 0.8264750495571112], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=825ff5b9-43da-4e1a-a303-b8600d001124", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 256.3148148148148, 138, 576, 142.0, 564.5, 571.5, 576.0, 0.2422991497094654, 0.18006802043838196, 0.11712703037713414], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 909.0185185185188, 683, 1263, 826.5, 1182.5, 1253.0, 1263.0, 0.24220894558372358, 71.21747209551106, 0.12181406931212659], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 228.31481481481472, 138, 583, 143.5, 420.0, 429.0, 583.0, 0.24251351788312644, 0.4291352484416261, 0.11794114443925485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/384bafcd-bb3e-44f1-ba16-8650f03eded7", 1, 0, 0.0, 1392.0, 1392, 1392, 1392.0, 1392.0, 1392.0, 1392.0, 0.7183908045977011, 0.22940800107758622, 0.4286492007902299], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1349.0, 964, 2066, 1325.5, 1652.5, 1783.5, 2066.0, 0.2419105558119011, 217.67154335294748, 0.12142775946027067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 169.23076923076923, 140, 423, 143.0, 325.79999999999995, 423.0, 423.0, 0.07129733731867167, 0.05326412407107796, 0.02534397537499657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 2, 1.2820512820512822, 328.06410256410254, 140, 7126, 149.0, 450.6, 819.8500000000004, 4557.010000000031, 0.6592347805508837, 1.481928786004361, 0.31428625289471684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 516.2, 143, 2037, 171.5, 1932.8000000000004, 2037.0, 2037.0, 0.05398139801024567, 0.04180395373254377, 0.019188700073954516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=636da745-7ab9-431d-9c30-b29d893e4320", 1, 0, 0.0, 5825.0, 5825, 5825, 5825.0, 5825.0, 5825.0, 5825.0, 0.17167381974248927, 0.031015289699570816, 0.11836105150214592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 244.8095238095238, 142, 2202, 147.0, 154.4, 1997.299999999997, 2202.0, 0.11050828549026212, 0.08968006371328888, 0.03928224210786661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc6be5c7-126e-4a32-8ba2-3f42c62f85f9", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd8d180e-d434-4612-b709-68644b30cb8b", 1, 0, 0.0, 3104.0, 3104, 3104, 3104.0, 3104.0, 3104.0, 3104.0, 0.32216494845360827, 0.05820362838273196, 0.2221176304768041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 338.69999999999993, 278, 826, 283.5, 773.7000000000002, 826.0, 826.0, 0.056252461045170725, 0.08718032781121673, 0.1265131033076447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5269a635-2be9-4693-b1e0-dd7bdaa90614", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86c75b25-c260-4f87-9030-af0b13907731", 3, 0, 0.0, 835.0, 505, 1435, 565.0, 1435.0, 1435.0, 1435.0, 0.07643117372805788, 0.03458311571679703, 0.04901348054826629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 383.4285714285714, 282, 838, 287.0, 697.5, 838.0, 838.0, 0.07377623667416724, 0.11433875742373381, 0.1659244854107492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c757d2d-861d-4911-9c6d-ef5bd0a58bc9", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a201e6de-9640-497a-9288-ef1c994fb555", 3, 0, 0.0, 2132.333333333333, 388, 4469, 1540.0, 4469.0, 4469.0, 4469.0, 0.019000690358416356, 0.022458172751109954, 0.012184687501979237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdab2965-d1ad-4a7e-b330-92797678e47f", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.5340065844481605, 0.9977921195652174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 275.5, 141, 864, 158.0, 864.0, 864.0, 864.0, 0.032988421064206463, 0.02735075144874149, 0.011726352800167142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 150.3076923076923, 141, 185, 145.0, 177.4, 185.0, 185.0, 0.06082838907709297, 0.047225165347938386, 0.02162259142974789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 162.76923076923077, 139, 415, 141.0, 308.19999999999993, 415.0, 415.0, 0.06724949562878278, 0.049977408372562204, 0.03375609448554136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 268.1538461538462, 139, 423, 143.0, 421.4, 423.0, 423.0, 0.0672526267324018, 0.033535376821640865, 0.037486064479749205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 405.6923076923077, 138, 1404, 143.0, 1336.0, 1404.0, 1404.0, 0.06725297465080186, 9.325237244568028, 0.03864823137609932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 330.0, 137, 1101, 141.0, 1100.2, 1101.0, 1101.0, 0.06725332257280173, 3.0576011774504783, 0.03871410838907599], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 75.0, 0.4971002485501243], "isController": false}, {"data": ["401/Unauthorized", 2, 25.0, 0.16570008285004142], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1207, 8, "406/Not Acceptable", 6, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
