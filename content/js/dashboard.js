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

    var data = {"OkPercent": 96.94940476190476, "KoPercent": 3.050595238095238};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7171845275840203, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3f6077e-e1bb-46b5-918f-e31bd83586c4"], "isController": false}, {"data": [0.07272727272727272, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bb3b3220-2d18-4d33-97a8-7e211f6f416c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/522eb3f1-6874-45c0-8753-0c768d3c6e91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75974fa9-f82c-4ce1-a22c-c87f1a893bdf"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3077822-c980-4113-afd6-07242748fa57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a70358d8-c720-415b-9a94-c542afd771c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=222591cd-fc92-45ac-9311-08e3e01f2386"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/00f48d6c-b95c-42d9-a1ec-8f84c0755008"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.66, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00f48d6c-b95c-42d9-a1ec-8f84c0755008"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e52a0605-8aa7-4ae9-9aeb-e73c6f94b632"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a4d1c17-7aec-4995-82db-550a78ab0f88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c30cf4d5-2758-4c3c-8039-7b991ea05a86"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a70358d8-c720-415b-9a94-c542afd771c3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d2de626-a2c7-41fd-a83f-fd7e154bd4f5"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a782fb9c-cec0-4429-88dc-70a6f953784b"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.28125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b2ce43f-c0cc-4ffc-bbe5-21a11cf84921"], "isController": false}, {"data": [0.09615384615384616, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a782fb9c-cec0-4429-88dc-70a6f953784b"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75974fa9-f82c-4ce1-a22c-c87f1a893bdf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9aeb8d1-07a1-463d-87a7-50e1093222eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/222591cd-fc92-45ac-9311-08e3e01f2386"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d2de626-a2c7-41fd-a83f-fd7e154bd4f5"], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.09615384615384616, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.12, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3077822-c980-4113-afd6-07242748fa57"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb3b3220-2d18-4d33-97a8-7e211f6f416c"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3f6077e-e1bb-46b5-918f-e31bd83586c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8228571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e5d354d-7fd6-449e-8ac3-7a9f07c1d52b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e52a0605-8aa7-4ae9-9aeb-e73c6f94b632"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c30cf4d5-2758-4c3c-8039-7b991ea05a86"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a4d1c17-7aec-4995-82db-550a78ab0f88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2b2ce43f-c0cc-4ffc-bbe5-21a11cf84921"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 41, 3.050595238095238, 464.4925595238099, 98, 6751, 139.0, 1177.0, 1489.0, 3232.9999999999964, 5.240910296205019, 749.7425234346972, 3.8238276436570944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/e3f6077e-e1bb-46b5-918f-e31bd83586c4", 3, 0, 0.0, 316.3333333333333, 204, 444, 301.0, 444.0, 444.0, 444.0, 0.035356928190078844, 0.035460512940635715, 0.022673550955226343], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1912.0727272727277, 1317, 4630, 1794.0, 2397.6, 2995.2, 4630.0, 0.24861116761364918, 299.1630614515954, 1.222419168881566], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb3b3220-2d18-4d33-97a8-7e211f6f416c", 3, 0, 0.0, 793.0, 455, 1239, 685.0, 1239.0, 1239.0, 1239.0, 0.04802843283223668, 0.030877654571506333, 0.030799483294110114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/522eb3f1-6874-45c0-8753-0c768d3c6e91", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.6882240032327586, 1.2859476023706895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75974fa9-f82c-4ce1-a22c-c87f1a893bdf", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 915.5294117647059, 110, 2234, 889.0, 2055.6, 2234.0, 2234.0, 0.08404067568703252, 0.01744249547663422, 0.05617516672186986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 915.5294117647059, 110, 2234, 889.0, 2055.6, 2234.0, 2234.0, 0.08367747746860864, 0.017367114320661937, 0.05593239475096106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3077822-c980-4113-afd6-07242748fa57", 3, 0, 0.0, 569.3333333333334, 216, 953, 539.0, 953.0, 953.0, 953.0, 0.07810669374365384, 0.03534124489052045, 0.05008795139160093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 150.13333333333333, 103, 326, 108.0, 321.8, 326.0, 326.0, 0.09227191919440463, 0.03392915362044254, 0.05210720228465272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a70358d8-c720-415b-9a94-c542afd771c3", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 136.93333333333334, 103, 319, 110.0, 316.0, 319.0, 319.0, 0.09239411634267129, 0.06866398685231724, 0.046377515429817426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 182.0, 103, 626, 106.0, 444.8000000000001, 626.0, 626.0, 0.09228497600590624, 1.8322052456318445, 0.05381487826073582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 204.9333333333333, 102, 1157, 108.0, 653.6000000000004, 1157.0, 1157.0, 0.09239753113796799, 5.565874482958815, 0.05379028147367902], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 303.47058823529414, 103, 685, 236.0, 616.9999999999999, 685.0, 685.0, 0.0842835894893406, 0.1211770265245414, 0.05446865704015866], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=222591cd-fc92-45ac-9311-08e3e01f2386", 1, 0, 0.0, 1257.0, 1257, 1257, 1257.0, 1257.0, 1257.0, 1257.0, 0.7955449482895784, 0.14372638225934767, 0.5484909506762132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00f48d6c-b95c-42d9-a1ec-8f84c0755008", 3, 0, 0.0, 893.0, 216, 1737, 726.0, 1737.0, 1737.0, 1737.0, 0.1285677552069941, 0.05817356111253964, 0.08244742114511014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 121.89473684210526, 102, 308, 110.0, 130.0, 308.0, 308.0, 0.10367896626613846, 0.0770504817661439, 0.05204198111405777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 116.84210526315789, 101, 309, 106.0, 110.0, 309.0, 309.0, 0.10369198024394902, 0.052336309929871476, 0.05776180519551395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 792.6666666666666, 548, 871, 839.0, 871.0, 871.0, 871.0, 0.0647323676223082, 19.033465397852325, 0.03691767840959766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1000.3333333333334, 814, 1251, 963.0, 1251.0, 1251.0, 1251.0, 0.06451844152120147, 58.05380709210007, 0.03673266738951217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 178.88888888888889, 103, 342, 108.0, 342.0, 342.0, 342.0, 0.06500353908157222, 0.11502579376543834, 0.03599317056567524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 129.92307692307693, 104, 319, 110.0, 256.19999999999993, 319.0, 319.0, 0.0628769594637079, 0.04672789663269699, 0.031561286293306505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 184.6923076923077, 102, 328, 106.0, 325.6, 328.0, 328.0, 0.06281315984016467, 0.024064536897899624, 0.03541733606973227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 186.38461538461542, 104, 1144, 106.0, 730.3999999999996, 1144.0, 1144.0, 0.06256647688168679, 4.346137640533933, 0.0363686446897906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 222.23076923076923, 100, 645, 109.0, 559.8, 645.0, 645.0, 0.06271830795654104, 1.4341630392568363, 0.03651814941189525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 133.44444444444446, 104, 328, 110.0, 328.0, 328.0, 328.0, 0.06500494759878947, 0.048309340940116, 0.03650180163017963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 275.3684210526316, 102, 1271, 108.0, 1118.0, 1271.0, 1271.0, 0.10369141435089174, 14.755385259651488, 0.05955221340238818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 704.2631578947369, 101, 1496, 978.0, 1288.0, 1496.0, 1496.0, 0.09192332626975142, 43.54477323664451, 0.04988314549527321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 257.3157894736842, 102, 865, 109.0, 863.0, 865.0, 865.0, 0.1036908484640111, 4.83751703736145, 0.05965314899556313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 509.26315789473693, 98, 978, 736.0, 975.0, 978.0, 978.0, 0.09192332626975142, 14.237267712173551, 0.04997291436858351], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 620.6470588235295, 105, 1315, 535.0, 1268.6, 1315.0, 1315.0, 0.08421594951006134, 0.01747887325251905, 0.056650319896761156], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 393.7692307692308, 213, 1259, 224.0, 1008.9999999999998, 1259.0, 1259.0, 0.06252976176160768, 5.843864688000538, 0.1394002208382836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 851.3999999999999, 111, 3269, 677.0, 1659.600000000001, 2871.499999999999, 3269.0, 0.10761621475030886, 0.06610410066205495, 0.048658503349016606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 140.21052631578948, 102, 308, 109.0, 306.0, 308.0, 308.0, 0.09192243681541976, 0.0683134515786469, 0.04614075441711499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 206.31578947368422, 101, 331, 114.0, 324.0, 331.0, 331.0, 0.09192332626975142, 0.09726221189294319, 0.04836179932654069], "isController": false}, {"data": ["login", 25, 0, 0.0, 4025.919999999999, 2007, 9710, 3687.0, 5779.200000000002, 8678.899999999998, 9710.0, 0.10617199013025179, 45.86856833308914, 0.22357083874810482], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 309.00000000000006, 108, 3314, 121.0, 319.0, 3314.0, 3314.0, 0.09926543577526305, 0.08036234986102839, 0.03528576037323804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00f48d6c-b95c-42d9-a1ec-8f84c0755008", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e52a0605-8aa7-4ae9-9aeb-e73c6f94b632", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a4d1c17-7aec-4995-82db-550a78ab0f88", 3, 0, 0.0, 407.33333333333337, 226, 704, 292.0, 704.0, 704.0, 704.0, 0.0233172703248873, 0.023385582640292245, 0.014952806816415358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c30cf4d5-2758-4c3c-8039-7b991ea05a86", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a70358d8-c720-415b-9a94-c542afd771c3", 3, 0, 0.0, 734.3333333333334, 541, 1085, 577.0, 1085.0, 1085.0, 1085.0, 0.06381077976772877, 0.02887271610584081, 0.040920324265112516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d2de626-a2c7-41fd-a83f-fd7e154bd4f5", 3, 0, 0.0, 671.3333333333333, 220, 1435, 359.0, 1435.0, 1435.0, 1435.0, 0.023758236188545365, 0.028081430859572983, 0.015235587659972122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 869.6315789473682, 213, 1617, 1087.0, 1401.0, 1617.0, 1617.0, 0.09187443182917157, 57.91679466880476, 0.1942556795927545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a782fb9c-cec0-4429-88dc-70a6f953784b", 1, 0, 0.0, 1166.0, 1166, 1166, 1166.0, 1166.0, 1166.0, 1166.0, 0.8576329331046312, 0.1549434498284734, 0.591297705831904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 372.80000000000007, 208, 1267, 224.0, 893.2000000000003, 1267.0, 1267.0, 0.09220839096357768, 7.487597491163362, 0.20580600699246962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 700.8750000000001, 103, 1477, 952.0, 1392.3000000000002, 1477.0, 1477.0, 0.11461318051575932, 77.14184780175502, 0.1784744918517192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b2ce43f-c0cc-4ffc-bbe5-21a11cf84921", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1754.7307692307693, 124, 3801, 1462.0, 2943.1, 3544.099999999999, 3801.0, 0.1057856619741232, 0.03286730002441208, 0.04772751546098136], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a782fb9c-cec0-4429-88dc-70a6f953784b", 3, 0, 0.0, 1642.0, 263, 4200, 463.0, 4200.0, 4200.0, 4200.0, 0.015925003848542597, 0.021953903417505825, 0.010212323431519829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 428.42105263157896, 208, 1426, 234.0, 1384.0, 1426.0, 1426.0, 0.10361677064700493, 19.70812706551852, 0.22885054746466124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 112.46153846153845, 106, 122, 112.0, 120.0, 122.0, 122.0, 0.07730226971356537, 0.06001494572488717, 0.027478541187243938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75974fa9-f82c-4ce1-a22c-c87f1a893bdf", 3, 0, 0.0, 429.0, 241, 649, 397.0, 649.0, 649.0, 649.0, 0.0714830346930995, 0.03234421166126572, 0.04584035753431185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 275.66666666666663, 211, 448, 222.0, 438.4, 448.0, 448.0, 0.17242172053887536, 0.26721999071796404, 0.38778049062600584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 144.41666666666666, 104, 327, 109.0, 324.3, 327.0, 327.0, 0.060705703806753504, 0.04511429745794865, 0.030471417731124318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9aeb8d1-07a1-463d-87a7-50e1093222eb", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 143.25000000000003, 104, 325, 108.0, 324.7, 325.0, 325.0, 0.06070816069450136, 0.016244175810833372, 0.034622622896082804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/222591cd-fc92-45ac-9311-08e3e01f2386", 3, 0, 0.0, 1456.0, 222, 2111, 2035.0, 2111.0, 2111.0, 2111.0, 0.020840714419690307, 0.024755132460107396, 0.01336465084856442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 125.91666666666667, 100, 322, 108.0, 263.8000000000002, 322.0, 322.0, 0.06070693222576908, 0.016362415326476823, 0.035689036328040026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 125.58333333333334, 102, 330, 107.5, 264.30000000000024, 330.0, 330.0, 0.060707239338291086, 0.016362498102898772, 0.035748501290028836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 120.75, 105, 129, 124.5, 129.0, 129.0, 129.0, 0.08849165966107694, 0.026098126189106678, 0.0547023638334587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d2de626-a2c7-41fd-a83f-fd7e154bd4f5", 1, 0, 0.0, 910.0, 910, 910, 910.0, 910.0, 910.0, 910.0, 1.098901098901099, 0.19853193681318682, 0.7576407967032966], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1230.963636363636, 809, 2491, 1132.0, 1698.0, 1790.0, 2491.0, 0.24304236007388488, 290.76315784386077, 0.4799137227240188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1754.7307692307693, 124, 3801, 1462.0, 2943.1, 3544.099999999999, 3801.0, 0.10156884805300331, 0.03155714810300644, 0.0458250076176636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 130.44444444444446, 102, 320, 108.0, 320.0, 320.0, 320.0, 0.0490174720055771, 0.013211740501503201, 0.02886478087828417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 154.33333333333334, 104, 323, 106.0, 323.0, 323.0, 323.0, 0.0490174720055771, 0.013211740501503201, 0.028816912253278724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 188.76923076923077, 102, 1170, 107.0, 748.7999999999996, 1170.0, 1170.0, 0.07618556459363791, 5.292178278982747, 0.044285148649757376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 265.84615384615387, 106, 596, 305.0, 528.0, 596.0, 596.0, 0.07618511811623505, 1.7421050424292504, 0.04435928865076156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 128.88888888888889, 100, 319, 105.0, 319.0, 319.0, 319.0, 0.04901880688224049, 0.013116360435287005, 0.027956038300027776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 158.46153846153848, 103, 332, 109.0, 327.6, 332.0, 332.0, 0.07618377871542428, 0.05661704648675575, 0.038240685800515706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 134.55555555555554, 105, 323, 109.0, 323.0, 323.0, 323.0, 0.0490174720055771, 0.0364280236291447, 0.024604473252799443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 187.7692307692308, 103, 325, 109.0, 325.0, 325.0, 325.0, 0.07618601107627393, 0.029187849796348933, 0.042957647170861785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 262.6666666666667, 107, 1413, 121.0, 1413.0, 1413.0, 1413.0, 0.04878339630005041, 0.038397868572109986, 0.017340972903533543], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 1087.5625000000002, 104, 4200, 889.5, 2737.7000000000016, 4200.0, 4200.0, 0.08902093661152932, 0.017533603664880684, 0.06057705214123171], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 2303.24, 1306, 5126, 1966.0, 3950.400000000001, 4875.199999999999, 5126.0, 0.10508263698572558, 0.0543884742211275, 0.04833390822292651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 290.8888888888889, 214, 645, 219.0, 645.0, 645.0, 645.0, 0.04898892306017473, 0.07592326259423564, 0.11017723614021718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3077822-c980-4113-afd6-07242748fa57", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb3b3220-2d18-4d33-97a8-7e211f6f416c", 1, 0, 0.0, 1315.0, 1315, 1315, 1315.0, 1315.0, 1315.0, 1315.0, 0.7604562737642585, 0.13738711977186313, 0.5242989543726236], "isController": false}, {"data": ["addBook", 60, 16, 26.666666666666668, 1641.7500000000007, 548, 7452, 1149.5, 3115.3999999999996, 5758.449999999997, 7452.0, 0.26822115728488666, 86.63061420409842, 0.9730831337507153], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 213.60000000000002, 104, 820, 112.0, 439.8, 448.59999999999997, 820.0, 0.2442913551951888, 0.181548555960487, 0.11809005939611178], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 672.6545454545455, 511, 958, 629.0, 867.2, 873.2, 958.0, 0.2445194304031014, 71.89683134772442, 0.12297608072030977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3f6077e-e1bb-46b5-918f-e31bd83586c4", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 155.94545454545454, 101, 419, 111.0, 321.8, 334.99999999999983, 419.0, 0.24509257815111074, 0.43369897618145764, 0.11919541398364564], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1015.1999999999994, 702, 1638, 984.0, 1251.2, 1374.1999999999998, 1638.0, 0.2439619419370578, 219.5173841943157, 0.12245745913637474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 335.5333333333334, 107, 3189, 115.0, 1470.600000000001, 3189.0, 3189.0, 0.16281341582546402, 0.12163306943992186, 0.05787508140670791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, 9.142857142857142, 346.49142857142857, 104, 6751, 118.0, 628.8000000000002, 937.7999999999975, 5373.120000000016, 0.7071135624381275, 1.5257198352930479, 0.339749915398913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 159.25, 110, 612, 116.5, 472.2000000000005, 612.0, 612.0, 0.06083773561948024, 0.047113597994382646, 0.021625913833487116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 190.59999999999997, 109, 1137, 120.0, 546.0000000000003, 1137.0, 1137.0, 0.09048572738460053, 0.07343128853183892, 0.03216484840624472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e5d354d-7fd6-449e-8ac3-7a9f07c1d52b", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e52a0605-8aa7-4ae9-9aeb-e73c6f94b632", 3, 0, 0.0, 1444.6666666666667, 236, 3272, 826.0, 3272.0, 3272.0, 3272.0, 0.05214489327678509, 0.03352414199923521, 0.033439270753667524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 290.33333333333326, 211, 652, 219.5, 650.8, 652.0, 652.0, 0.06067194175493592, 0.09402965973152666, 0.13645261900548575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 472.0, 216, 1503, 426.0, 1199.3999999999996, 1503.0, 1503.0, 0.0761351457402386, 7.1153875718159405, 0.1697312740484571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c30cf4d5-2758-4c3c-8039-7b991ea05a86", 3, 0, 0.0, 622.6666666666666, 297, 971, 600.0, 971.0, 971.0, 971.0, 0.06632472585779979, 0.030010211244251857, 0.04253245766271666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a4d1c17-7aec-4995-82db-550a78ab0f88", 1, 0, 0.0, 923.0, 923, 923, 923.0, 923.0, 923.0, 923.0, 1.0834236186348862, 0.19573571235102924, 0.7469697995666306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 125.53846153846155, 107, 200, 115.0, 179.59999999999997, 200.0, 200.0, 0.06287756770221184, 0.05213188962810337, 0.022351010394145613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 129.00000000000003, 104, 322, 113.0, 162.0, 322.0, 322.0, 0.09538104728389918, 0.07405071542060532, 0.033904981651698536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b2ce43f-c0cc-4ffc-bbe5-21a11cf84921", 3, 0, 0.0, 621.3333333333334, 350, 797, 717.0, 797.0, 797.0, 797.0, 0.04790036723614881, 0.03135665316142423, 0.0307173578955772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 109.53333333333332, 103, 122, 109.0, 118.4, 122.0, 122.0, 0.1726360371973115, 0.12829689873745512, 0.08665519835880674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 120.53333333333335, 102, 321, 106.0, 196.20000000000007, 321.0, 321.0, 0.17265590828518151, 0.04619894420912084, 0.09846782269389258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 136.73333333333335, 103, 338, 108.0, 331.4, 338.0, 338.0, 0.17265590828518151, 0.04653616277999033, 0.10150278983171804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 162.06666666666666, 101, 334, 107.0, 325.6, 334.0, 334.0, 0.17265392097054524, 0.04653562713659227, 0.10167022885277224], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 24.390243902439025, 0.7440476190476191], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.75609756097561, 0.2976190476190476], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.317073170731708, 0.22321428571428573], "isController": false}, {"data": ["401/Unauthorized", 24, 58.53658536585366, 1.7857142857142858], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 41, "401/Unauthorized", 24, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
