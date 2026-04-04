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

    var data = {"OkPercent": 98.92058596761758, "KoPercent": 1.079414032382421};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7372262773722628, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/740af4cb-9189-4150-b7dd-1d277539f7dc"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=082350fe-ff70-4122-b092-739f82edc2b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24fd7e27-33db-446b-80cb-cf631cc78d7b"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1e9a2ce2-87ac-4c55-9f1c-40d49b8eb708"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4451daa5-8ac7-42cc-abfb-a6bc88adc94d"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba6b3998-3dcb-4a70-bfd1-9929e9fd4d7b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef79d20c-5002-44c4-bafa-0243dc251a2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.92, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12c2c04c-1fbd-4cd5-b5db-bf722dfde89d"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd3cfb36-7606-4025-94f9-87fb40cf4966"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb18f5c3-0c22-4874-b0e4-763ae69daed3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/67065e62-8794-427a-9713-2140cec3bc5f"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f07e80da-9baa-4618-b975-ee387fcbb43d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7afb0408-8f36-4397-807f-451341cdcd82"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05d054d8-e46f-47c2-873c-74600cc38377"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fadf5304-d123-4ee7-9f50-361f32418dd7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78f4f3bb-5908-4fce-89ba-8c31b718b1d4"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7afb0408-8f36-4397-807f-451341cdcd82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.76, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/082350fe-ff70-4122-b092-739f82edc2b3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24fd7e27-33db-446b-80cb-cf631cc78d7b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd3cfb36-7606-4025-94f9-87fb40cf4966"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef79d20c-5002-44c4-bafa-0243dc251a2d"], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3620689655172414, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9226190476190477, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e9a2ce2-87ac-4c55-9f1c-40d49b8eb708"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12c2c04c-1fbd-4cd5-b5db-bf722dfde89d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eb18f5c3-0c22-4874-b0e4-763ae69daed3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba6b3998-3dcb-4a70-bfd1-9929e9fd4d7b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fadf5304-d123-4ee7-9f50-361f32418dd7"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b707c08a-48c8-40dd-a576-9894a63c67eb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78f4f3bb-5908-4fce-89ba-8c31b718b1d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f07e80da-9baa-4618-b975-ee387fcbb43d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/05d054d8-e46f-47c2-873c-74600cc38377"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 14, 1.079414032382421, 479.26137239784066, 126, 3954, 163.0, 1319.2, 1662.5999999999995, 2238.0, 5.155807140216488, 754.7631883395081, 3.76582990805411], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2272.741379310345, 1560, 3537, 2277.5, 2816.4, 2958.6999999999994, 3537.0, 0.25812308911032095, 310.6104279016039, 1.2691892125688142], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/740af4cb-9189-4150-b7dd-1d277539f7dc", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.605950545540797, 1.1322195208728651], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 664.6153846153846, 442, 1450, 536.0, 1297.6, 1450.0, 1450.0, 0.08188821628567648, 0.014794257825048977, 0.055658397006670746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 664.6153846153846, 442, 1450, 536.0, 1297.6, 1450.0, 1450.0, 0.0801845478208307, 0.014486466159036798, 0.054500434846970876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=082350fe-ff70-4122-b092-739f82edc2b3", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 227.66666666666666, 133, 425, 141.0, 413.6, 424.2, 425.0, 0.09923963536522548, 0.0336521308167422, 0.05620071984178367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 176.52380952380952, 127, 407, 142.0, 398.8, 406.2, 407.0, 0.09923260121725325, 0.07374610305305637, 0.04981011428287907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24fd7e27-33db-446b-80cb-cf631cc78d7b", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 253.1904761904762, 127, 1123, 134.0, 511.20000000000005, 1063.8999999999992, 1123.0, 0.09924057332696934, 1.4149996367086155, 0.05803339888330726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 259.1904761904762, 126, 1390, 138.0, 425.40000000000003, 1294.1999999999987, 1390.0, 0.09923963536522548, 4.277664857413909, 0.057935936680386935], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 565.2307692307693, 218, 2409, 304.0, 1884.9999999999995, 2409.0, 2409.0, 0.08102869038937402, 0.16640950770395854, 0.052383782263442966], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1e9a2ce2-87ac-4c55-9f1c-40d49b8eb708", 3, 0, 0.0, 1306.0, 496, 2409, 1013.0, 2409.0, 2409.0, 2409.0, 0.10148849797023003, 0.045920902401894455, 0.06508214225304466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 25, 0, 0.0, 159.44000000000003, 129, 422, 137.0, 248.40000000000055, 416.0, 422.0, 0.14442018185389296, 0.1073278890535279, 0.07249216159462989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 25, 0, 0.0, 193.16, 128, 432, 141.0, 425.0, 430.8, 432.0, 0.14442852521144336, 0.05599990395503073, 0.0813990141308869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1005.6, 750, 1274, 1051.0, 1274.0, 1274.0, 1274.0, 0.06476180607724788, 19.042121281053284, 0.03693446752843043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4451daa5-8ac7-42cc-abfb-a6bc88adc94d", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.5235015368852459, 0.9781634221311476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1358.2, 1175, 1567, 1256.0, 1567.0, 1567.0, 1567.0, 0.06459030370360802, 58.11846881014972, 0.03677358111250339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 310.4, 142, 445, 384.0, 445.0, 445.0, 445.0, 0.06528864108222451, 0.1155302906650301, 0.03615103466173955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba6b3998-3dcb-4a70-bfd1-9929e9fd4d7b", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef79d20c-5002-44c4-bafa-0243dc251a2d", 1, 0, 0.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 0.17660221163245357, 0.6739522238514175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 162.8, 127, 396, 138.0, 370.9000000000001, 396.0, 396.0, 0.05201316973457679, 0.03865431852345014, 0.026108173089426246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 164.99999999999997, 133, 417, 135.0, 389.9000000000001, 417.0, 417.0, 0.05201019399802361, 0.013916790190877411, 0.02966206376449784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 133.5, 126, 141, 134.0, 141.0, 141.0, 141.0, 0.05201344027296653, 0.01401924757357301, 0.030578213910474467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 160.00000000000003, 126, 377, 136.0, 353.70000000000005, 377.0, 377.0, 0.05201100552876989, 0.014018591333926259, 0.030627574544773675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 196.4, 133, 423, 142.0, 423.0, 423.0, 423.0, 0.06553337614847242, 0.04870205004783937, 0.036798526645870744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 947.6666666666664, 129, 1823, 1408.5, 1691.6000000000001, 1823.0, 1823.0, 0.08329746914522913, 41.649538986107835, 0.04499292549966913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 25, 0, 0.0, 281.44000000000005, 133, 1610, 137.0, 847.0000000000024, 1583.6, 1610.0, 0.1444276908323079, 10.432316760977947, 0.08391474505624014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 620.8333333333334, 128, 1258, 804.0, 1153.6000000000001, 1258.0, 1258.0, 0.08330402265869416, 13.617839469677337, 0.045077816948666215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 25, 0, 0.0, 231.23999999999998, 127, 1141, 140.0, 529.6000000000006, 1007.7999999999997, 1141.0, 0.14442018185389296, 3.4329579852806953, 0.08405141755629499], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 631.3076923076922, 217, 1292, 491.0, 1248.0, 1292.0, 1292.0, 0.08014994204542653, 0.014480214139066316, 0.05525962801178821], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/12c2c04c-1fbd-4cd5-b5db-bf722dfde89d", 3, 0, 0.0, 413.6666666666667, 240, 524, 477.0, 524.0, 524.0, 524.0, 0.04727610823077044, 0.02996308031422853, 0.03031703555163339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 330.40000000000003, 262, 814, 278.5, 761.6000000000001, 814.0, 814.0, 0.05197370130713859, 0.08054908591252825, 0.11689007237337908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 585.5909090909091, 171, 1427, 412.5, 1329.0, 1413.1999999999998, 1427.0, 0.09683183830843582, 0.05947971317969348, 0.04378236439141189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 168.5, 133, 424, 140.5, 384.4000000000001, 424.0, 424.0, 0.08329978203223701, 0.06190540442044177, 0.041812585902900226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 260.27777777777777, 129, 435, 147.5, 432.3, 435.0, 435.0, 0.08330170953619459, 0.09179819466683944, 0.0436213162132894], "isController": false}, {"data": ["login", 22, 0, 0.0, 3059.681818181818, 1540, 4666, 3480.0, 4433.0, 4639.15, 4666.0, 0.09609126923463304, 26.25941752448143, 0.18119482941615817], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 25, 0, 0.0, 144.72, 136, 178, 144.0, 152.4, 171.39999999999998, 178.0, 0.14928135953519756, 0.12085375688933475, 0.053064858272277256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd3cfb36-7606-4025-94f9-87fb40cf4966", 3, 0, 0.0, 370.0, 324, 455, 331.0, 455.0, 455.0, 455.0, 0.03614762690829347, 0.023239441127564976, 0.023180607099393926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb18f5c3-0c22-4874-b0e4-763ae69daed3", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67065e62-8794-427a-9713-2140cec3bc5f", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.6176710589941973, 1.1541193181818181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1120.111111111111, 276, 1964, 1546.5, 1834.4, 1964.0, 1964.0, 0.08324353822034564, 55.38412268247677, 0.1753840908880698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f07e80da-9baa-4618-b975-ee387fcbb43d", 3, 0, 0.0, 534.6666666666666, 362, 844, 398.0, 844.0, 844.0, 844.0, 0.024069126531398175, 0.02413964155053313, 0.015434954188429167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7afb0408-8f36-4397-807f-451341cdcd82", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 500.61904761904754, 261, 1539, 295.0, 830.2, 1468.299999999999, 1539.0, 0.09916933872940466, 5.795946099103226, 0.22182590970159474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1575.0, 1396, 1711, 1680.0, 1711.0, 1711.0, 1711.0, 0.06447120715888285, 77.1299775801377, 0.14537501692369187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05d054d8-e46f-47c2-873c-74600cc38377", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.21662357613908872, 0.8266824040767387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fadf5304-d123-4ee7-9f50-361f32418dd7", 1, 0, 0.0, 1182.0, 1182, 1182, 1182.0, 1182.0, 1182.0, 1182.0, 0.8460236886632826, 0.15284607656514382, 0.5832936759729273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78f4f3bb-5908-4fce-89ba-8c31b718b1d4", 1, 0, 0.0, 1292.0, 1292, 1292, 1292.0, 1292.0, 1292.0, 1292.0, 0.7739938080495357, 0.1398328657120743, 0.5336324496904025], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1027.5217391304348, 150, 2357, 1039.0, 1894.2000000000005, 2290.199999999999, 2357.0, 0.0993400366262396, 0.03129683558792025, 0.04481943058722919], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7afb0408-8f36-4397-807f-451341cdcd82", 3, 0, 0.0, 884.3333333333334, 304, 1575, 774.0, 1575.0, 1575.0, 1575.0, 0.01761183515322297, 0.024279336547493247, 0.011294047933544675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 144.08333333333337, 135, 157, 144.0, 154.60000000000002, 157.0, 157.0, 0.06365912659678309, 0.04942285707465094, 0.02262883015745024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 25, 0, 0.0, 501.03999999999996, 268, 1753, 283.0, 1157.400000000002, 1723.8999999999999, 1753.0, 0.14430097720621765, 14.016478134433676, 0.321582619163747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/082350fe-ff70-4122-b092-739f82edc2b3", 3, 0, 0.0, 359.0, 225, 564, 288.0, 564.0, 564.0, 564.0, 0.05708957354088565, 0.03737211340843784, 0.036610175740737216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 526.0714285714286, 268, 2126, 413.0, 1345.5, 2126.0, 2126.0, 0.06074437897550266, 5.278231458591859, 0.1355053878094709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 138.66666666666666, 134, 152, 136.0, 152.0, 152.0, 152.0, 0.046571557197634166, 0.03461030764394492, 0.02337673867146871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 136.99999999999997, 127, 147, 140.0, 147.0, 147.0, 147.0, 0.046570352278842576, 0.012461207543362173, 0.026559654034027404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 183.55555555555554, 131, 563, 136.0, 563.0, 563.0, 563.0, 0.046571316208887874, 0.01255242507192681, 0.027378840193115723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 134.77777777777777, 129, 141, 134.0, 141.0, 141.0, 141.0, 0.046571316208887874, 0.01255242507192681, 0.027424319994100964], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1570.9999999999998, 1012, 2549, 1499.5, 2240.1, 2393.4, 2549.0, 0.2540450097675926, 303.92615201746776, 0.501639657959055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1027.5217391304348, 150, 2357, 1039.0, 1894.2000000000005, 2290.199999999999, 2357.0, 0.09571448784426005, 0.030154615310988855, 0.04318368494535951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 205.0, 133, 401, 143.0, 401.0, 401.0, 401.0, 0.14539638689978554, 0.039188869906582824, 0.08561916142633856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 278.5, 145, 397, 286.0, 397.0, 397.0, 397.0, 0.1454386794167909, 0.03920026906155692, 0.08550203614151183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 392.1666666666667, 126, 1567, 133.5, 1554.4, 1567.0, 1567.0, 0.06199403823998925, 9.310981872555756, 0.03555777844363967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 276.33333333333337, 132, 857, 140.5, 843.8000000000001, 857.0, 857.0, 0.06199179641894056, 3.0518650167377848, 0.035617031471168646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 140.25000000000003, 129, 153, 139.0, 151.8, 153.0, 153.0, 0.06199339770314462, 0.046071265285247125, 0.031117779706461263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 277.25, 140, 421, 274.0, 421.0, 421.0, 421.0, 0.14678899082568805, 0.03927752293577982, 0.08371559633027523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 228.91666666666666, 133, 425, 144.0, 419.6, 425.0, 425.0, 0.06199179641894056, 0.03210577737712709, 0.03448697268228171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 206.75, 141, 401, 142.5, 401.0, 401.0, 401.0, 0.14678899082568805, 0.10908830275229357, 0.07368119266055045], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 573.7692307692308, 435, 854, 496.0, 850.0, 854.0, 854.0, 0.07701649930388933, 0.01391411364376907, 0.05242236329571374], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 144.25, 136, 157, 142.0, 157.0, 157.0, 157.0, 0.13033136750187352, 0.10258504121729498, 0.0463287282916816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1600.0909090909092, 867, 3954, 1399.5, 2542.6, 3748.4999999999973, 3954.0, 0.09663490892159834, 0.05001611496918664, 0.04444828330280549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24fd7e27-33db-446b-80cb-cf631cc78d7b", 3, 0, 0.0, 352.6666666666667, 226, 442, 390.0, 442.0, 442.0, 442.0, 0.03928707062505729, 0.03275201428085017, 0.025193857139115514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd3cfb36-7606-4025-94f9-87fb40cf4966", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 557.5, 320, 802, 554.0, 802.0, 802.0, 802.0, 0.14465499783017505, 0.22418699370750758, 0.32533248047157526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef79d20c-5002-44c4-bafa-0243dc251a2d", 3, 0, 0.0, 1080.3333333333333, 273, 2526, 442.0, 2526.0, 2526.0, 2526.0, 0.01735117033643919, 0.020508495928258694, 0.01112688983163581], "isController": false}, {"data": ["addBook", 55, 8, 14.545454545454545, 1486.8363636363636, 693, 3439, 1108.0, 2507.2, 2899.999999999999, 3439.0, 0.25133435694962347, 88.47095656571022, 0.9111539831354647], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 250.81034482758628, 129, 608, 143.5, 555.9, 579.05, 608.0, 0.2553671122382487, 0.1897796605598704, 0.12344406304485656], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 861.1896551724141, 633, 1345, 833.5, 1111.0, 1149.9999999999998, 1345.0, 0.25515141916979006, 75.0229890603829, 0.12832322350824402], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 211.08620689655174, 129, 577, 141.5, 419.3, 423.4, 577.0, 0.2559406923637006, 0.4528950532842045, 0.1244711570284403], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1315.2586206896551, 883, 1980, 1306.5, 1730.7, 1839.35, 1980.0, 0.2547669980101819, 229.23979264217536, 0.12788109079807958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 144.14285714285714, 135, 176, 142.0, 165.0, 176.0, 176.0, 0.06313729204154434, 0.04716799649588029, 0.022443334280392715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, 4.761904761904762, 228.39285714285717, 130, 2238, 146.0, 334.69999999999993, 576.799999999999, 1724.6400000000017, 0.6798866855524079, 1.5565797627478755, 0.3230837085188183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 246.33333333333334, 142, 527, 146.0, 527.0, 527.0, 527.0, 0.045657467532467536, 0.03535778491528003, 0.016229802911931816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e9a2ce2-87ac-4c55-9f1c-40d49b8eb708", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12c2c04c-1fbd-4cd5-b5db-bf722dfde89d", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 159.4761904761905, 137, 438, 145.0, 162.8, 410.6999999999996, 438.0, 0.09807309714840795, 0.07958861692414747, 0.034861921251973134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb18f5c3-0c22-4874-b0e4-763ae69daed3", 3, 0, 0.0, 691.0, 218, 1001, 854.0, 1001.0, 1001.0, 1001.0, 0.02273467872109854, 0.02280128422516426, 0.014579204778829468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba6b3998-3dcb-4a70-bfd1-9929e9fd4d7b", 3, 0, 0.0, 335.6666666666667, 234, 435, 338.0, 435.0, 435.0, 435.0, 0.05868659402570473, 0.02655415549991197, 0.03763430671570258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fadf5304-d123-4ee7-9f50-361f32418dd7", 3, 0, 0.0, 620.3333333333334, 284, 1099, 478.0, 1099.0, 1099.0, 1099.0, 0.029509260989740615, 0.024312480327159342, 0.018923582080009445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 327.3333333333333, 275, 700, 277.0, 700.0, 700.0, 700.0, 0.046537602382725245, 0.07212419431775875, 0.10466415848380492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 582.0, 268, 1712, 297.0, 1697.0, 1712.0, 1712.0, 0.06194827319188478, 12.431951677120438, 0.13668144391100098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b707c08a-48c8-40dd-a576-9894a63c67eb", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78f4f3bb-5908-4fce-89ba-8c31b718b1d4", 3, 0, 0.0, 408.6666666666667, 232, 608, 386.0, 608.0, 608.0, 608.0, 0.025069358558679013, 0.02514280394508139, 0.01607637902363205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 146.20000000000002, 137, 154, 146.0, 154.0, 154.0, 154.0, 0.052255067435164525, 0.04332475805903777, 0.01857504350234364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 172.61111111111111, 134, 410, 145.0, 406.4, 410.0, 410.0, 0.08334915423760991, 0.06470954845595692, 0.0296280196704004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f07e80da-9baa-4618-b975-ee387fcbb43d", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05d054d8-e46f-47c2-873c-74600cc38377", 3, 0, 0.0, 736.0, 590, 1012, 606.0, 1012.0, 1012.0, 1012.0, 0.02400019200153601, 0.024070505064040515, 0.015390748125985008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 158.85714285714283, 132, 431, 136.5, 289.5, 431.0, 431.0, 0.06078209185910711, 0.04517106631326222, 0.030509760952715875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 248.3571428571428, 132, 402, 141.5, 401.5, 402.0, 402.0, 0.060780772436788, 0.0227843102033551, 0.034299417481418445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 307.1428571428571, 129, 1694, 138.0, 1063.0, 1694.0, 1694.0, 0.06078367524150657, 3.9218741520134595, 0.03536103874959297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 236.92857142857144, 132, 998, 137.5, 708.0, 998.0, 998.0, 0.06078341133871122, 1.2918086076908382, 0.035420244023688166], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 42.857142857142854, 0.4626060138781804], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6168080185042406], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 14, "401/Unauthorized", 8, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
