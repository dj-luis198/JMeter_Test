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

    var data = {"OkPercent": 98.59265050820954, "KoPercent": 1.4073494917904612};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7229684351914036, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d959bd1-114c-4623-812f-c8360820d684"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3f32f21-fb9c-4be8-b24a-54ffc1f9c90d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2800147e-ee6d-4c28-85f1-b7b0ecbd67fb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3940868-664e-4fb1-a074-c388ec4eec07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2516885e-0163-41de-88e6-0ce33c4a48d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c2271b2-1f84-47a7-8542-27ba5375d745"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad1eca9c-6fa2-4bce-ba57-376db28b96c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=223734c5-7d33-44d8-a1af-91a9b58dc9ef"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/995290df-6a1d-45aa-aab2-b7a0f82d4008"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/74c4d55e-fc0b-4eb3-869d-cb822b4f98d6"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2a1d4ad-af93-4e2e-a705-5a3473275676"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d959bd1-114c-4623-812f-c8360820d684"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84bfb165-ee40-4ce0-a09c-2e32d2bcf815"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2516885e-0163-41de-88e6-0ce33c4a48d0"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2a1d4ad-af93-4e2e-a705-5a3473275676"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.23214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3940868-664e-4fb1-a074-c388ec4eec07"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2800147e-ee6d-4c28-85f1-b7b0ecbd67fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f3f32f21-fb9c-4be8-b24a-54ffc1f9c90d"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b5366ca-ba28-4ca6-a302-d101dc2c4cb9"], "isController": false}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/223734c5-7d33-44d8-a1af-91a9b58dc9ef"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efed2315-6900-4826-8bf5-bed48cd04a2c"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad1eca9c-6fa2-4bce-ba57-376db28b96c8"], "isController": false}, {"data": [0.9367469879518072, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c32d06a6-ab63-4649-afe1-73e7abc000d3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6c2271b2-1f84-47a7-8542-27ba5375d745"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b5366ca-ba28-4ca6-a302-d101dc2c4cb9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c32d06a6-ab63-4649-afe1-73e7abc000d3"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6abf3733-20d2-4a0e-b41d-315cbfbf309c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84bfb165-ee40-4ce0-a09c-2e32d2bcf815"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74c4d55e-fc0b-4eb3-869d-cb822b4f98d6"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1279, 18, 1.4073494917904612, 499.3776387802968, 136, 3140, 164.0, 1401.0, 1688.0, 2238.6000000000004, 5.037674240902449, 719.5178043652294, 3.6838639089437426], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2349.8750000000005, 1661, 3041, 2345.5, 2816.3, 2935.2, 3041.0, 0.24695931345310862, 297.17420302563744, 1.2142970148792986], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 593.0, 152, 987, 563.5, 974.5, 987.0, 987.0, 0.07849513610495922, 0.01482187035687253, 0.05308386889910572], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 593.0, 152, 987, 563.5, 974.5, 987.0, 987.0, 0.0778642936596218, 0.014702751320912123, 0.05265724937430478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 281.71428571428567, 140, 429, 283.5, 428.5, 429.0, 429.0, 0.09294976065436632, 0.054786933421414295, 0.05133762589713117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 205.92857142857144, 141, 438, 148.0, 432.5, 438.0, 438.0, 0.0929466751646484, 0.06907462871122796, 0.04665487405725515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 405.50000000000006, 140, 1085, 277.5, 1082.5, 1085.0, 1085.0, 0.09277114022357845, 5.8648884634117255, 0.052921483311134526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 426.6428571428571, 137, 1579, 144.0, 1443.0, 1579.0, 1579.0, 0.09294790933595358, 17.941403760323855, 0.052931552163694544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d959bd1-114c-4623-812f-c8360820d684", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 386.0714285714286, 147, 1587, 293.0, 1051.5, 1587.0, 1587.0, 0.0784111657500028, 0.15695906972152834, 0.05068612395405106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3f32f21-fb9c-4be8-b24a-54ffc1f9c90d", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2800147e-ee6d-4c28-85f1-b7b0ecbd67fb", 3, 0, 0.0, 400.33333333333337, 226, 657, 318.0, 657.0, 657.0, 657.0, 0.042642710939276775, 0.027026483788662722, 0.027345748877075277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3940868-664e-4fb1-a074-c388ec4eec07", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 159.5263157894737, 139, 438, 145.0, 150.0, 438.0, 438.0, 0.08738163238087354, 0.06493888890805152, 0.04386148344118066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 202.10526315789474, 138, 434, 144.0, 426.0, 434.0, 434.0, 0.08738404367362519, 0.02338205856110674, 0.049836212407614364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1079.6666666666665, 819, 1172, 1121.5, 1172.0, 1172.0, 1172.0, 0.05300774796582767, 15.586037924835013, 0.030230981261761092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1392.5, 1218, 1521, 1412.5, 1521.0, 1521.0, 1521.0, 0.05268102517274986, 47.40247905380489, 0.029993200855188643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 340.0, 148, 465, 423.5, 465.0, 465.0, 465.0, 0.053189603205560085, 0.09412066504733875, 0.02945166505620368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2516885e-0163-41de-88e6-0ce33c4a48d0", 3, 0, 0.0, 721.0, 489, 1158, 516.0, 1158.0, 1158.0, 1158.0, 0.01831557739857749, 0.02524950204523948, 0.011745340974999238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 179.55555555555554, 142, 440, 146.0, 440.0, 440.0, 440.0, 0.04750518598280313, 0.035304147004798024, 0.023845376557774224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 201.44444444444446, 138, 420, 142.0, 420.0, 420.0, 420.0, 0.047506439761834385, 0.01271168407689709, 0.02709351642667117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 232.33333333333334, 139, 416, 146.0, 416.0, 416.0, 416.0, 0.04750518598280313, 0.012804132159427405, 0.027927853478171366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 142.0, 138, 149, 140.0, 149.0, 149.0, 149.0, 0.04750694129197766, 0.012804605270103355, 0.0279752789053345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 192.0, 137, 445, 142.5, 445.0, 445.0, 445.0, 0.053183474121807885, 0.03952404668622637, 0.029863767207069857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 172.578947368421, 139, 434, 143.0, 434.0, 434.0, 434.0, 0.08738364178225835, 0.023552622199124327, 0.05137202378214799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1082.6, 138, 1872, 1401.0, 1780.8, 1872.0, 1872.0, 0.07468408631488803, 44.807291329551, 0.03962729840275634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c2271b2-1f84-47a7-8542-27ba5375d745", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 215.8947368421053, 137, 433, 143.0, 432.0, 433.0, 433.0, 0.08738524936990637, 0.023553055494232575, 0.05145830602544291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 795.1333333333332, 137, 1312, 1090.0, 1295.2, 1312.0, 1312.0, 0.07468445816425602, 14.646516903582365, 0.039700429746819685], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 616.7692307692307, 259, 1189, 504.0, 1099.3999999999999, 1189.0, 1189.0, 0.09016632218507678, 0.01628981406663985, 0.06216545260025801], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad1eca9c-6fa2-4bce-ba57-376db28b96c8", 3, 0, 0.0, 662.3333333333333, 339, 1306, 342.0, 1306.0, 1306.0, 1306.0, 0.034071550255536626, 0.02769422558205565, 0.021849268881317434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=223734c5-7d33-44d8-a1af-91a9b58dc9ef", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.2086190098152425, 0.7961352482678984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 414.1111111111111, 284, 849, 292.0, 849.0, 849.0, 849.0, 0.04746860479221937, 0.07356706621606654, 0.10675800472312619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 795.1818181818181, 243, 1793, 728.0, 1633.9999999999998, 1777.2499999999998, 1793.0, 0.10132552205672386, 0.0622399935289837, 0.04581417647681948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 141.26666666666668, 137, 149, 140.0, 147.2, 149.0, 149.0, 0.07468259895444362, 0.05550142363704257, 0.03748716392830471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 279.93333333333334, 138, 560, 144.0, 486.80000000000007, 560.0, 560.0, 0.07468222712358913, 0.0947627999113771, 0.0384107808773668], "isController": false}, {"data": ["login", 22, 0, 0.0, 3665.4090909090914, 2264, 6283, 3481.5, 5980.7, 6262.0, 6283.0, 0.10185609585584583, 33.37220394889139, 0.199742480589469], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 152.5263157894737, 141, 189, 148.0, 177.0, 189.0, 189.0, 0.08689726456558228, 0.07034944562975362, 0.030889262013546828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/995290df-6a1d-45aa-aab2-b7a0f82d4008", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.5068824404761905, 0.9471106150793651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74c4d55e-fc0b-4eb3-869d-cb822b4f98d6", 3, 0, 0.0, 1156.0, 239, 2750, 479.0, 2750.0, 2750.0, 2750.0, 0.06522306287503261, 0.029511737433689886, 0.04182598758587703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1246.3999999999999, 280, 2015, 1545.0, 1925.0, 2015.0, 2015.0, 0.07462872210751512, 59.55981783595363, 0.15511210633349087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2a1d4ad-af93-4e2e-a705-5a3473275676", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.2660737297496318, 1.0153948821796759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d959bd1-114c-4623-812f-c8360820d684", 3, 0, 0.0, 379.6666666666667, 254, 480, 405.0, 480.0, 480.0, 480.0, 0.08060399258443268, 0.03741578562024772, 0.051689409307074344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 732.642857142857, 285, 1722, 569.5, 1589.5, 1722.0, 1722.0, 0.09268208720060375, 23.87285884724999, 0.20336270472811047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, 14.285714285714286, 1379.857142857143, 147, 1895, 1516.0, 1895.0, 1895.0, 1895.0, 0.05278119179931083, 54.126007673065764, 0.1068804407041011], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1468.130434782609, 156, 2984, 1492.0, 2623.4000000000005, 2954.9999999999995, 2984.0, 0.10050866122463248, 0.03151137714345645, 0.04534668113845723], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84bfb165-ee40-4ce0-a09c-2e32d2bcf815", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 423.8947368421053, 283, 873, 294.0, 581.0, 873.0, 873.0, 0.08732380125102836, 0.13533483650916212, 0.1963932756651546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 175.58823529411765, 142, 566, 150.0, 263.59999999999974, 566.0, 566.0, 0.10282403179077125, 0.07982920436881166, 0.036550730050625715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2516885e-0163-41de-88e6-0ce33c4a48d0", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 417.40000000000003, 283, 722, 294.5, 688.2000000000003, 720.85, 722.0, 0.09667954115889765, 0.14983440607340878, 0.21743455399310674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a1d4ad-af93-4e2e-a705-5a3473275676", 3, 0, 0.0, 382.0, 243, 564, 339.0, 564.0, 564.0, 564.0, 0.03835189138744359, 0.024656570797591502, 0.02459414909936975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 143.8, 138, 150, 144.0, 150.0, 150.0, 150.0, 0.04498142267243629, 0.033428576810277354, 0.022578565677375245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 169.60000000000002, 136, 416, 144.0, 388.9000000000001, 416.0, 416.0, 0.04498263670223294, 0.012036369586339673, 0.025654159994242223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 140.1, 136, 144, 139.5, 143.9, 144.0, 144.0, 0.044983850797563674, 0.012124553535280835, 0.02644558416028646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 224.69999999999996, 139, 430, 143.0, 428.4, 430.0, 430.0, 0.04498283904690361, 0.012124280836860738, 0.02648891791531531], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1611.4285714285716, 1091, 2445, 1535.0, 2200.5, 2253.4, 2445.0, 0.24802905483213744, 296.7289784303304, 0.4897604969439277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3940868-664e-4fb1-a074-c388ec4eec07", 3, 0, 0.0, 432.0, 249, 774, 273.0, 774.0, 774.0, 774.0, 0.023618327822390175, 0.023687522142182334, 0.015145867776728075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1468.130434782609, 156, 2984, 1492.0, 2623.4000000000005, 2954.9999999999995, 2984.0, 0.09802166705022972, 0.030731657162826775, 0.04422461931367786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 144.42857142857142, 140, 148, 145.0, 148.0, 148.0, 148.0, 0.04166369068876032, 0.011229666630954932, 0.02453438035676023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 141.42857142857142, 136, 147, 141.0, 147.0, 147.0, 147.0, 0.041664434643382195, 0.011229867149974109, 0.024494130522769615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 243.5294117647059, 136, 1296, 143.0, 605.5999999999995, 1296.0, 1296.0, 0.10159564931572343, 5.403180886944958, 0.05921354882567381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 282.88235294117646, 138, 1158, 144.0, 572.3999999999994, 1158.0, 1158.0, 0.10158957810445798, 1.7828714182203895, 0.05930921888072188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 143.57142857142858, 137, 150, 144.0, 150.0, 150.0, 150.0, 0.04166145898429363, 0.011147695079781694, 0.02376005082697996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 161.70588235294122, 138, 426, 145.0, 206.7999999999998, 426.0, 426.0, 0.1015913993916468, 0.07549907708695627, 0.05099412039776021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 142.42857142857142, 138, 147, 140.0, 147.0, 147.0, 147.0, 0.04166393867068228, 0.03096314192225509, 0.020913344215557315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 176.23529411764707, 137, 422, 144.0, 419.6, 422.0, 422.0, 0.10158897102323997, 0.03615839065142434, 0.05743558437561625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2800147e-ee6d-4c28-85f1-b7b0ecbd67fb", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 186.71428571428572, 142, 420, 149.0, 420.0, 420.0, 420.0, 0.03926980600715833, 0.030909632462665634, 0.013959188854107062], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 695.9230769230768, 479, 1306, 574.0, 1304.4, 1306.0, 1306.0, 0.09200348197793332, 0.016621722818278967, 0.06262346380724562], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1821.2272727272727, 1144, 3140, 1722.5, 2748.9999999999995, 3103.8499999999995, 3140.0, 0.10076720485514715, 0.05215490095041796, 0.046348978014428034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 290.0, 283, 296, 291.0, 296.0, 296.0, 296.0, 0.04162652680153661, 0.06451298636136582, 0.09361903439837775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3f32f21-fb9c-4be8-b24a-54ffc1f9c90d", 3, 0, 0.0, 1151.3333333333333, 247, 2633, 574.0, 2633.0, 2633.0, 2633.0, 0.041742615035689934, 0.026836479393062378, 0.026768538938902724], "isController": false}, {"data": ["addBook", 55, 9, 16.363636363636363, 1381.2, 728, 2653, 1192.0, 2285.2, 2523.7999999999993, 2653.0, 0.26669899381743245, 82.27016153473149, 0.9694167474845437], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6b5366ca-ba28-4ca6-a302-d101dc2c4cb9", 3, 0, 0.0, 405.3333333333333, 231, 620, 365.0, 620.0, 620.0, 620.0, 0.023789321766436437, 0.028118172960263903, 0.015255522096315035], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 258.9285714285714, 140, 597, 147.0, 572.6, 581.2, 597.0, 0.24944654048829162, 0.1853797044058495, 0.12058206791182063], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 894.4642857142858, 681, 1308, 830.0, 1140.9, 1247.2, 1308.0, 0.24920565696841315, 73.2747375552925, 0.12533292318235625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/223734c5-7d33-44d8-a1af-91a9b58dc9ef", 3, 0, 0.0, 639.6666666666667, 294, 1302, 323.0, 1302.0, 1302.0, 1302.0, 0.018665654573396463, 0.025732111692166024, 0.011969837079944997], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 213.92857142857144, 138, 588, 145.0, 426.20000000000005, 464.04999999999984, 588.0, 0.24997098551061037, 0.44233147045432225, 0.1215679206877773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efed2315-6900-4826-8bf5-bed48cd04a2c", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1349.464285714286, 944, 2042, 1362.0, 1690.5000000000002, 1809.6499999999999, 2042.0, 0.2487042950343523, 223.7845618474288, 0.12483789809341511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 164.70000000000002, 142, 410, 150.5, 165.70000000000002, 397.79999999999984, 410.0, 0.10264832683227262, 0.07668551760418806, 0.036488272428659416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad1eca9c-6fa2-4bce-ba57-376db28b96c8", 1, 0, 0.0, 1189.0, 1189, 1189, 1189.0, 1189.0, 1189.0, 1189.0, 0.8410428931875525, 0.15194622582001682, 0.5798596509671993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 9, 5.421686746987952, 219.23493975903614, 138, 1436, 153.0, 379.60000000000036, 443.65, 869.1800000000105, 0.67960648328209, 1.518391786484838, 0.3241428348085434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 151.89999999999998, 143, 162, 154.0, 161.6, 162.0, 162.0, 0.04541016733646664, 0.03516627216583793, 0.016141895420384623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c32d06a6-ab63-4649-afe1-73e7abc000d3", 3, 0, 0.0, 1128.3333333333333, 371, 2241, 773.0, 2241.0, 2241.0, 2241.0, 0.042637256434672616, 0.027411647610181774, 0.027342251033953466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c2271b2-1f84-47a7-8542-27ba5375d745", 3, 0, 0.0, 1116.6666666666667, 543, 1587, 1220.0, 1587.0, 1587.0, 1587.0, 0.025613660618996798, 0.025688700640341514, 0.01642542689434365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 154.5, 141, 164, 155.5, 163.5, 164.0, 164.0, 0.08583690987124463, 0.06965866416309013, 0.030512339055793994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b5366ca-ba28-4ca6-a302-d101dc2c4cb9", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c32d06a6-ab63-4649-afe1-73e7abc000d3", 1, 0, 0.0, 965.0, 965, 965, 965.0, 965.0, 965.0, 965.0, 1.0362694300518134, 0.1872166450777202, 0.7144591968911918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 371.0, 280, 572, 295.0, 570.8, 572.0, 572.0, 0.04495190146543199, 0.06966666760316462, 0.10109787995594713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 473.2352941176471, 281, 1444, 295.0, 971.1999999999996, 1444.0, 1444.0, 0.10150223304912707, 7.291111576329679, 0.22675323650318835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6abf3733-20d2-4a0e-b41d-315cbfbf309c", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 149.88888888888889, 144, 164, 150.0, 164.0, 164.0, 164.0, 0.04845456845822947, 0.04017375841898126, 0.017224084881636254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 169.60000000000002, 140, 452, 148.0, 279.2000000000001, 452.0, 452.0, 0.0721611792098832, 0.05602357174986049, 0.025651044172263167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84bfb165-ee40-4ce0-a09c-2e32d2bcf815", 3, 0, 0.0, 348.0, 245, 486, 313.0, 486.0, 486.0, 486.0, 0.02250376938137138, 0.026598693562421703, 0.01443112815146537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 144.04999999999998, 138, 159, 142.0, 152.0, 158.65, 159.0, 0.0968776338606706, 0.07199597594528351, 0.048628031058969415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 183.60000000000002, 136, 430, 142.0, 419.6, 429.5, 430.0, 0.09674969402909264, 0.025888101722628305, 0.0551775598759669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74c4d55e-fc0b-4eb3-869d-cb822b4f98d6", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.6273057725694445, 2.393934461805556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 226.45, 138, 583, 143.0, 545.4000000000003, 581.75, 583.0, 0.0968795109522287, 0.026112055686342894, 0.05695455624340008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 261.5, 137, 564, 145.5, 444.50000000000006, 558.0999999999999, 564.0, 0.0967464179638749, 0.026076182966825654, 0.05697079104708648], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.547302580140735], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07818608287724785], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7818608287724785], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1279, 18, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
