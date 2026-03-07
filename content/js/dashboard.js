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

    var data = {"OkPercent": 99.5279307631786, "KoPercent": 0.47206923682140045};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.84185733512786, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6456b2f2-3d85-4276-adc2-862360e4f6cb"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/88156497-2b6d-40af-b49b-e9737475a1c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=394bcd0f-91a7-4f11-a6e1-e31cafad7556"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a96bc7d5-6193-47c7-8fac-ceec517753c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79b6fb1e-b6ab-4fc7-98f6-b7551302dc90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79b6fb1e-b6ab-4fc7-98f6-b7551302dc90"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f94e9f6-4330-4822-8266-49053ec77301"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30ba6c31-0394-49e6-b351-d60ebb7a2672"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41e185a2-28ef-453a-8b11-c84c0df84862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b323e578-3127-4618-842f-d7f2a691f015"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/127d9db8-bb3b-4c4c-a0af-1ada22fb7aee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9164c53c-fdf2-475d-ab66-90a790694525"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed025d43-1ff9-4217-bc17-880918d43f5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06402c19-fdf5-4ecb-9f9f-ba5d764cd242"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6456b2f2-3d85-4276-adc2-862360e4f6cb"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/23290d87-f12e-4a61-bee8-5a9aaccc2e77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ab09286-e019-433c-91f0-75431dd27271"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17cb4778-d475-46c6-85d8-37c7a16810b2"], "isController": false}, {"data": [0.4661016949152542, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41e185a2-28ef-453a-8b11-c84c0df84862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f94e9f6-4330-4822-8266-49053ec77301"], "isController": false}, {"data": [0.7830188679245284, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a96bc7d5-6193-47c7-8fac-ceec517753c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9883040935672515, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30ba6c31-0394-49e6-b351-d60ebb7a2672"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17cb4778-d475-46c6-85d8-37c7a16810b2"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=127d9db8-bb3b-4c4c-a0af-1ada22fb7aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ab09286-e019-433c-91f0-75431dd27271"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04be451e-3c10-454c-a9ee-3f5b280f1b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1387a804-e369-42fe-bd0b-387b8b7fa3ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/394bcd0f-91a7-4f11-a6e1-e31cafad7556"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88156497-2b6d-40af-b49b-e9737475a1c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9164c53c-fdf2-475d-ab66-90a790694525"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06402c19-fdf5-4ecb-9f9f-ba5d764cd242"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed025d43-1ff9-4217-bc17-880918d43f5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 6, 0.47206923682140045, 276.18410700236024, 81, 1696, 103.0, 731.8, 829.0, 1155.079999999999, 5.023119788167411, 712.4504713806169, 3.6553263508773663], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/6456b2f2-3d85-4276-adc2-862360e4f6cb", 3, 0, 0.0, 249.33333333333331, 171, 400, 177.0, 400.0, 400.0, 400.0, 0.07554391619661564, 0.03344392123287671, 0.04844450355056406], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1222.0754716981132, 994, 1559, 1193.0, 1429.6, 1458.5, 1559.0, 0.24269288360357721, 292.0413861126438, 1.193319012640636], "isController": true}, {"data": ["deleteBook", 15, 0, 0.0, 519.8, 364, 992, 478.0, 852.2, 992.0, 992.0, 0.08311907083961345, 0.01501662900910985, 0.05649499346129976], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 519.8, 364, 992, 478.0, 852.2, 992.0, 992.0, 0.08250235131701254, 0.014905209954733711, 0.056075816910781964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88156497-2b6d-40af-b49b-e9737475a1c7", 3, 0, 0.0, 444.66666666666663, 176, 836, 322.0, 836.0, 836.0, 836.0, 0.018072289156626505, 0.02491410956325301, 0.011589326054216868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 121.23076923076924, 81, 256, 83.0, 252.8, 256.0, 256.0, 0.08069772494490828, 0.021592945932524286, 0.046022921257643006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 85.07692307692307, 83, 98, 84.0, 93.6, 98.0, 98.0, 0.08068971082049023, 0.059965693295305725, 0.040502452501691384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 146.2307692307692, 81, 255, 85.0, 251.8, 255.0, 255.0, 0.08069772494490828, 0.02175055867655731, 0.04752024232595673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 132.84615384615384, 81, 248, 83.0, 248.0, 248.0, 248.0, 0.08069722401549387, 0.02175042366042608, 0.047441141462233695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=394bcd0f-91a7-4f11-a6e1-e31cafad7556", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 201.66666666666669, 160, 302, 171.0, 289.40000000000003, 302.0, 302.0, 0.0824307169823763, 0.19282669869100022, 0.053290170549153436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a96bc7d5-6193-47c7-8fac-ceec517753c7", 3, 0, 0.0, 587.6666666666666, 170, 828, 765.0, 828.0, 828.0, 828.0, 0.020440840799918234, 0.024160381817872112, 0.013108221476510069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 84.72222222222224, 82, 90, 84.0, 88.2, 90.0, 90.0, 0.09563937579367399, 0.07107574704979093, 0.04800648355268401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 93.1111111111111, 81, 245, 83.0, 108.20000000000022, 245.0, 245.0, 0.09564293304994687, 0.04155320138150904, 0.05365385892667376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 561.25, 405, 695, 572.5, 695.0, 695.0, 695.0, 0.1290364205296945, 37.94099204813059, 0.0735910835833414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 717.0, 563, 845, 730.0, 845.0, 845.0, 845.0, 0.1290489095367144, 116.11843564492193, 0.073472181894438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 123.5, 82, 243, 84.5, 243.0, 243.0, 243.0, 0.1303908465625713, 0.23073067770642502, 0.07219883789158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 84.875, 82, 97, 83.0, 92.10000000000001, 97.0, 97.0, 0.08059519551890713, 0.05989545291981282, 0.04045501025070143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 123.8125, 81, 248, 83.5, 246.6, 248.0, 248.0, 0.08053029197263983, 0.02910768976208332, 0.04550472675065305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 166.3125, 82, 736, 86.5, 398.60000000000036, 736.0, 736.0, 0.08059519551890713, 4.5528464035023655, 0.04694827551467588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 161.1875, 81, 515, 84.5, 438.70000000000005, 515.0, 515.0, 0.0805960074752797, 1.501484336040016, 0.047027455533671506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 82.5, 81, 83, 83.0, 83.0, 83.0, 83.0, 0.13107448307500735, 0.09740984533210997, 0.07360139430481372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 413.0, 81, 808, 246.0, 752.6, 802.6999999999999, 808.0, 0.10024153436375266, 42.965347083329355, 0.05482891216454887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 173.61111111111111, 81, 735, 84.0, 723.3000000000001, 735.0, 735.0, 0.09555915377060495, 9.576704884798131, 0.05526587343720967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 314.71428571428567, 83, 653, 246.0, 593.2, 647.3, 653.0, 0.10016407829969091, 14.038696126035028, 0.054884362658354634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 153.61111111111111, 81, 408, 85.5, 407.1, 408.0, 408.0, 0.09555864646486097, 3.144829248643598, 0.055358899031672376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79b6fb1e-b6ab-4fc7-98f6-b7551302dc90", 1, 0, 0.0, 757.0, 757, 757, 757.0, 757.0, 757.0, 757.0, 1.321003963011889, 0.2386579425363276, 0.9107703104359313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79b6fb1e-b6ab-4fc7-98f6-b7551302dc90", 3, 0, 0.0, 258.0, 170, 349, 255.0, 349.0, 349.0, 349.0, 0.02380007933359778, 0.03281033072193574, 0.015262420666402222], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 471.71428571428567, 173, 810, 424.0, 799.0, 810.0, 810.0, 0.0779979051991175, 0.014091418419762441, 0.05377589948298532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9f94e9f6-4330-4822-8266-49053ec77301", 3, 0, 0.0, 430.66666666666663, 259, 731, 302.0, 731.0, 731.0, 731.0, 0.024479604409592744, 0.029364369221793377, 0.015698183817349512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30ba6c31-0394-49e6-b351-d60ebb7a2672", 3, 0, 0.0, 346.0, 168, 697, 173.0, 697.0, 697.0, 697.0, 0.029278004411219333, 0.029363779814767826, 0.018775282776725938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 309.1875, 168, 818, 328.0, 668.2000000000002, 818.0, 818.0, 0.08049625943944416, 6.135800845022061, 0.1797507414460147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41e185a2-28ef-453a-8b11-c84c0df84862", 3, 0, 0.0, 363.6666666666667, 281, 411, 399.0, 411.0, 411.0, 411.0, 0.09726049602852975, 0.0440078416274923, 0.06237082590371211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b323e578-3127-4618-842f-d7f2a691f015", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 371.6363636363636, 95, 847, 320.5, 773.4999999999999, 842.4999999999999, 847.0, 0.09322626438121066, 0.05726496122634913, 0.042152109773926305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 99.95238095238095, 82, 252, 84.0, 215.2000000000001, 251.5, 252.0, 0.10024057738572574, 0.07449519471732156, 0.05031607107056937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 122.14285714285714, 81, 256, 83.0, 245.0, 254.89999999999998, 256.0, 0.10016312279998855, 0.09843970597353786, 0.05311850132119929], "isController": false}, {"data": ["login", 22, 0, 0.0, 1877.363636363636, 1111, 2742, 1889.0, 2439.7, 2703.4499999999994, 2742.0, 0.092185981026449, 20.180512983557374, 0.1668824874920385], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 107.5, 84, 250, 89.0, 249.1, 250.0, 250.0, 0.09518219458413313, 0.07705667901391247, 0.03383429573107857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/127d9db8-bb3b-4c4c-a0af-1ada22fb7aee", 3, 0, 0.0, 539.0, 170, 1108, 339.0, 1108.0, 1108.0, 1108.0, 0.018104681267086295, 0.024958764702509913, 0.01161009833859375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9164c53c-fdf2-475d-ab66-90a790694525", 3, 0, 0.0, 449.3333333333333, 163, 815, 370.0, 815.0, 815.0, 815.0, 0.021158796769757026, 0.025008981468420496, 0.01356862943893924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed025d43-1ff9-4217-bc17-880918d43f5f", 3, 0, 0.0, 287.6666666666667, 194, 414, 255.0, 414.0, 414.0, 414.0, 0.01689617301681169, 0.02329273851764242, 0.010835110951536144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06402c19-fdf5-4ecb-9f9f-ba5d764cd242", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 522.1428571428572, 166, 893, 508.0, 839.4, 887.9, 893.0, 0.10012348563227981, 57.12056495421734, 0.21298124085181247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 270.61538461538464, 167, 343, 328.0, 341.8, 343.0, 343.0, 0.08064766276869631, 0.12498812579484476, 0.18137848374639412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 800.75, 649, 928, 813.0, 928.0, 928.0, 928.0, 0.12868770710677863, 153.9552367853811, 0.29017569893510925], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 872.9565217391304, 89, 1696, 889.0, 1418.8000000000002, 1645.9999999999993, 1696.0, 0.09513016287938324, 0.0301159347158917, 0.04292005395534673], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 293.1111111111111, 166, 819, 176.0, 807.3000000000001, 819.0, 819.0, 0.09551402464261835, 12.82802268723402, 0.212097929070224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 98.33333333333333, 83, 249, 87.0, 161.40000000000003, 249.0, 249.0, 0.1040387856592938, 0.08077229941322125, 0.036982537089827086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 321.0625, 166, 979, 251.5, 856.5000000000001, 979.0, 979.0, 0.09545514204918326, 14.40413665671348, 0.21162796507534992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 84.6, 81, 88, 84.0, 88.0, 88.0, 88.0, 0.05640285172818338, 0.04191657242690191, 0.028311587683873297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 113.4, 81, 257, 83.0, 252.70000000000002, 257.0, 257.0, 0.056362160699792586, 0.04047727829944089, 0.030723982522093966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 281.4, 82, 840, 86.5, 837.8, 840.0, 840.0, 0.05617062388711952, 15.173325650245186, 0.03157403428654882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 271.7, 82, 737, 87.5, 728.3000000000001, 737.0, 737.0, 0.0562236802896644, 4.970096469293437, 0.03165876372560595], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 797.3207547169812, 642, 1209, 680.0, 1074.6, 1090.8, 1209.0, 0.23849057962210493, 285.31764596860927, 0.47092573437099233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6456b2f2-3d85-4276-adc2-862360e4f6cb", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 872.9565217391304, 89, 1696, 889.0, 1418.8000000000002, 1645.9999999999993, 1696.0, 0.09651578033008397, 0.03055458806645321, 0.043545205578612106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 137.0, 83, 245, 83.0, 245.0, 245.0, 245.0, 0.05072880381480605, 0.013672997903209442, 0.02987252802766411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23290d87-f12e-4a61-bee8-5a9aaccc2e77", 2, 0, 0.0, 467.5, 164, 771, 467.5, 771.0, 771.0, 771.0, 0.09020792927698344, 0.052988349082134324, 0.056071627914843714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 138.0, 84, 245, 85.0, 245.0, 245.0, 245.0, 0.050727088265133585, 0.013672535508961785, 0.029821979624619546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 95.33333333333333, 81, 251, 83.0, 157.40000000000006, 251.0, 251.0, 0.10976466455918511, 0.02958500724446786, 0.06452961725061468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 116.86666666666667, 81, 248, 84.0, 247.4, 248.0, 248.0, 0.10976305814515067, 0.029584574265685143, 0.06463586334133385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 94.73333333333333, 82, 247, 84.0, 151.60000000000005, 247.0, 247.0, 0.10976627102024089, 0.08157434789687824, 0.05509752275820686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 83.66666666666667, 81, 87, 83.0, 87.0, 87.0, 87.0, 0.05072880381480605, 0.013573918208258649, 0.028931270925631573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 105.13333333333333, 81, 247, 83.0, 244.6, 247.0, 247.0, 0.10976627102024089, 0.029371052987837896, 0.06260107644123114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 139.0, 85, 246, 86.0, 246.0, 246.0, 246.0, 0.050727946025465424, 0.037699186450565615, 0.0254630510323137], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 490.7857142857143, 339, 836, 399.5, 800.5, 836.0, 836.0, 0.07795664496873381, 0.014083964178921637, 0.05306228666328855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 88.0, 87, 90, 87.0, 90.0, 90.0, 90.0, 0.049431537320810674, 0.03890802644587247, 0.017571366782006922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1037.409090909091, 684, 1596, 955.0, 1475.6, 1581.8999999999999, 1596.0, 0.09294858253411635, 0.04810815306941569, 0.04275271716168828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 278.6666666666667, 172, 492, 172.0, 492.0, 492.0, 492.0, 0.05065428450823132, 0.07850424757281553, 0.1139226730688054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ab09286-e019-433c-91f0-75431dd27271", 1, 0, 0.0, 810.0, 810, 810, 810.0, 810.0, 810.0, 810.0, 1.2345679012345678, 0.22304205246913578, 0.8511766975308641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17cb4778-d475-46c6-85d8-37c7a16810b2", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["addBook", 59, 1, 1.694915254237288, 875.1016949152541, 513, 2378, 733.0, 1262.0, 1520.0, 2378.0, 0.2855911979824676, 105.31313456306967, 1.0362135084636646], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41e185a2-28ef-453a-8b11-c84c0df84862", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 154.75471698113216, 83, 352, 87.0, 334.2, 342.0, 352.0, 0.23936626651853055, 0.1778884070513689, 0.11570927922526623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f94e9f6-4330-4822-8266-49053ec77301", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 495.94339622641513, 401, 812, 423.0, 601.6, 685.4, 812.0, 0.2388883129527046, 70.24109584661117, 0.12014402458070594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a96bc7d5-6193-47c7-8fac-ceec517753c7", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 0.23992571381142097, 0.9156083997343958], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 119.0, 82, 261, 85.0, 246.6, 253.3, 261.0, 0.23967368202085615, 0.42411007013846813, 0.11656005238904918], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 632.8113207547169, 558, 838, 575.0, 739.0, 776.3999999999999, 838.0, 0.23915672436510657, 215.19364097640246, 0.12004546515982889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 87.0625, 83, 103, 85.5, 93.9, 103.0, 103.0, 0.10089162977816453, 0.07537314138700768, 0.03586382152270692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 1, 0.5847953216374269, 148.02339181286553, 83, 1378, 91.0, 250.40000000000003, 275.0, 975.5200000000007, 0.728922005345428, 1.5288113349503183, 0.3534587362474584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 89.5, 83, 102, 87.5, 101.4, 102.0, 102.0, 0.056149177133809104, 0.04348271237022521, 0.019959277809283704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30ba6c31-0394-49e6-b351-d60ebb7a2672", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 90.46153846153845, 84, 104, 88.0, 102.4, 104.0, 104.0, 0.07658997849589066, 0.06215456262703626, 0.02722534391846113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17cb4778-d475-46c6-85d8-37c7a16810b2", 3, 0, 0.0, 340.0, 164, 439, 417.0, 439.0, 439.0, 439.0, 0.07911809694604145, 0.03579887850097579, 0.050736540033757056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 384.9, 168, 923, 176.5, 921.4, 923.0, 923.0, 0.05614350279313926, 20.21105241873228, 0.1219586011846279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=127d9db8-bb3b-4c4c-a0af-1ada22fb7aee", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 234.53333333333333, 167, 494, 170.0, 400.40000000000003, 494.0, 494.0, 0.10969643340329528, 0.17000804669045858, 0.24670984973416896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ab09286-e019-433c-91f0-75431dd27271", 3, 0, 0.0, 256.3333333333333, 160, 373, 236.0, 373.0, 373.0, 373.0, 0.02998171115619472, 0.024994518968429257, 0.01922655305263789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04be451e-3c10-454c-a9ee-3f5b280f1b61", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.9353693181818181, 3.6162405303030303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1387a804-e369-42fe-bd0b-387b8b7fa3ff", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.7513786764705882, 1.403952205882353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 98.75000000000001, 83, 247, 88.0, 145.5000000000001, 247.0, 247.0, 0.0833441854408126, 0.06910079437426749, 0.029626253418413857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/394bcd0f-91a7-4f11-a6e1-e31cafad7556", 3, 0, 0.0, 279.0, 171, 390, 276.0, 390.0, 390.0, 390.0, 0.030360377683098377, 0.02531019767135903, 0.019469382824122333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88156497-2b6d-40af-b49b-e9737475a1c7", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 98.42857142857142, 84, 253, 88.0, 108.60000000000001, 238.6999999999998, 253.0, 0.09615428642072536, 0.074651032914528, 0.03417984400111722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9164c53c-fdf2-475d-ab66-90a790694525", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 94.625, 82, 246, 84.0, 136.1000000000001, 246.0, 246.0, 0.09550300237563719, 0.07097439922642568, 0.04793803048933351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06402c19-fdf5-4ecb-9f9f-ba5d764cd242", 3, 0, 0.0, 265.3333333333333, 177, 369, 250.0, 369.0, 369.0, 369.0, 0.04443325384717923, 0.02882665199135033, 0.028493981145489285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed025d43-1ff9-4217-bc17-880918d43f5f", 1, 0, 0.0, 788.0, 788, 788, 788.0, 788.0, 788.0, 788.0, 1.2690355329949237, 0.22926911484771573, 0.8749405139593909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 144.8125, 81, 250, 85.0, 248.6, 250.0, 250.0, 0.09550585271803688, 0.04348594124002412, 0.05346555670958461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 215.0, 82, 732, 86.5, 723.6, 732.0, 732.0, 0.0955052826359458, 10.764501600459619, 0.055120724646332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 143.75, 81, 405, 84.0, 405.0, 405.0, 405.0, 0.09550642280693376, 3.5327816469485698, 0.05521465068525858], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 83.33333333333333, 0.3933910306845004], "isController": false}, {"data": ["401/Unauthorized", 1, 16.666666666666668, 0.07867820613690008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 6, "406/Not Acceptable", 5, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
