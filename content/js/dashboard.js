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

    var data = {"OkPercent": 97.91987673343606, "KoPercent": 2.0801232665639446};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7948717948717948, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3090909090909091, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e712f6a-bf61-4afc-aedd-5913669f466b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85b40303-ed97-4792-b0dd-9593aa2acd1d"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1810d914-61ac-44a4-a86c-2f95c09c7ea0"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe196563-1ce8-4966-ae75-66d47d8cf529"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6c1db4f-92dc-4715-a04c-9d9fb0c00838"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf0514ea-bc71-441a-8c57-13332b7b10d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a2c7f04d-5599-4088-9ce8-4da863d7c879"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=120a839d-563a-428e-a45e-dcabb7e2f7c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=501f1305-be77-43e1-9d06-21a8526a9415"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b608805-27db-4349-b184-65839138cae6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4814d549-ffaa-4cc6-9315-8a4e9ea6530c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8721da9b-b691-4cc1-820f-9a51bc4ba536"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24e0173a-d701-49fa-96ee-63bd16fa444a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe4f3427-3a2d-4a13-8af8-c529fd691069"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe196563-1ce8-4966-ae75-66d47d8cf529"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a1316fc-5677-447e-9e9a-42758c2de7e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf0514ea-bc71-441a-8c57-13332b7b10d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2c7f04d-5599-4088-9ce8-4da863d7c879"], "isController": false}, {"data": [0.7818181818181819, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1098958-e6b7-458f-8670-e650adf6cd41"], "isController": false}, {"data": [0.9385964912280702, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6c1db4f-92dc-4715-a04c-9d9fb0c00838"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/501f1305-be77-43e1-9d06-21a8526a9415"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f82de34-108b-4ca4-a87c-a0016646a01d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/120a839d-563a-428e-a45e-dcabb7e2f7c0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b608805-27db-4349-b184-65839138cae6"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4814d549-ffaa-4cc6-9315-8a4e9ea6530c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8721da9b-b691-4cc1-820f-9a51bc4ba536"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/24e0173a-d701-49fa-96ee-63bd16fa444a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe4f3427-3a2d-4a13-8af8-c529fd691069"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85b40303-ed97-4792-b0dd-9593aa2acd1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 27, 2.0801232665639446, 325.7719568567022, 80, 2818, 96.5, 906.2000000000003, 1131.1, 1737.5199999999995, 5.196094522483717, 731.320831596548, 3.7859364429170186], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1426.709090909091, 995, 2175, 1409.0, 1666.8, 1804.3999999999996, 2175.0, 0.24323798404358826, 292.698380960989, 1.195999267245573], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4e712f6a-bf61-4afc-aedd-5913669f466b", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85b40303-ed97-4792-b0dd-9593aa2acd1d", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 551.5333333333333, 86, 2072, 468.0, 1381.4000000000005, 2072.0, 2072.0, 0.09845814544237244, 0.02003777100604533, 0.06597849551030857], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 551.5333333333333, 86, 2072, 468.0, 1381.4000000000005, 2072.0, 2072.0, 0.09862711062016727, 0.02007215805980748, 0.06609172198003788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 84.9375, 82, 93, 83.0, 93.0, 93.0, 93.0, 0.07863257944347792, 0.028421761197770765, 0.044432398711408604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 96.0, 81, 260, 85.0, 141.0000000000001, 260.0, 260.0, 0.07863335233639347, 0.05843748157030804, 0.03947025693447876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 187.625, 82, 647, 94.5, 426.5000000000002, 647.0, 647.0, 0.0786302608558904, 1.4648629468410292, 0.04588045005995557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 197.93750000000003, 82, 903, 88.5, 450.80000000000047, 903.0, 903.0, 0.07863103370322683, 4.441890322301235, 0.045804112894506636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1810d914-61ac-44a4-a86c-2f95c09c7ea0", 2, 0, 0.0, 1508.0, 198, 2818, 1508.0, 2818.0, 2818.0, 2818.0, 0.02523722996163941, 0.029192870009337773, 0.015687008662679185], "isController": false}, {"data": ["goToProfile", 18, 3, 16.666666666666668, 404.33333333333326, 86, 2818, 220.5, 713.8000000000034, 2818.0, 2818.0, 0.09885981677980624, 0.1757883298045871, 0.06389523639853688], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fe196563-1ce8-4966-ae75-66d47d8cf529", 3, 0, 0.0, 519.3333333333333, 201, 1033, 324.0, 1033.0, 1033.0, 1033.0, 0.019010804473875986, 0.02247012729317829, 0.01219117344190615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6c1db4f-92dc-4715-a04c-9d9fb0c00838", 3, 0, 0.0, 370.6666666666667, 187, 476, 449.0, 476.0, 476.0, 476.0, 0.03485616024538737, 0.029058146610819353, 0.02235242046986104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf0514ea-bc71-441a-8c57-13332b7b10d1", 3, 0, 0.0, 308.6666666666667, 224, 429, 273.0, 429.0, 429.0, 429.0, 0.025175599808665444, 0.02524935644872989, 0.016144508991885066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 105.52941176470588, 82, 264, 85.0, 254.39999999999998, 264.0, 264.0, 0.09155289872633762, 0.06803882415111613, 0.04595526361849368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 115.11764705882354, 82, 261, 85.0, 257.0, 261.0, 261.0, 0.09146866391184573, 0.03255628685649105, 0.05171384364777032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 682.4, 625, 786, 659.0, 786.0, 786.0, 786.0, 0.04574230614410656, 13.44975679387602, 0.026087408972810772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2c7f04d-5599-4088-9ce8-4da863d7c879", 3, 0, 0.0, 558.3333333333334, 263, 854, 558.0, 854.0, 854.0, 854.0, 0.024155950818484134, 0.028551516087863247, 0.015490632523572183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 903.0, 759, 1066, 940.0, 1066.0, 1066.0, 1066.0, 0.045558501671997015, 40.993619887766634, 0.025938092260521736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 120.6, 84, 261, 86.0, 261.0, 261.0, 261.0, 0.045968557506665446, 0.08134279902546658, 0.025453293072538383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 85.25, 83, 88, 85.5, 88.0, 88.0, 88.0, 0.08161599673536013, 0.060654075698836976, 0.04096740461130382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 108.0, 81, 264, 86.5, 257.7, 264.0, 264.0, 0.08154278957883149, 0.02947365721959473, 0.04607685216801891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 146.25, 82, 906, 84.0, 447.50000000000045, 906.0, 906.0, 0.08161849475091056, 4.610652879411225, 0.047544367303631006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 132.1875, 81, 659, 86.5, 378.3000000000003, 659.0, 659.0, 0.08154528311502982, 1.5191691140869477, 0.047581354161357725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 121.2, 85, 263, 86.0, 263.0, 263.0, 263.0, 0.04596940276551927, 0.03416280810992203, 0.025812897060716388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 672.625, 83, 1197, 940.5, 1103.9, 1197.0, 1197.0, 0.08701279631935872, 48.94271167562173, 0.04648046834637619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 137.52941176470588, 82, 983, 84.0, 266.9999999999994, 983.0, 983.0, 0.09155388484675496, 4.869127802827938, 0.05336085223202986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 453.56250000000006, 82, 742, 651.5, 702.8000000000001, 742.0, 742.0, 0.08709141877364396, 16.013658213809432, 0.0466075170780829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 132.35294117647058, 82, 407, 85.0, 281.39999999999986, 407.0, 407.0, 0.09147358565694176, 1.6053383076579533, 0.05340338068884991], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 493.66666666666674, 84, 1854, 408.0, 1365.0000000000002, 1854.0, 1854.0, 0.09881813510415433, 0.020111034527056405, 0.06672154161231669], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 246.87500000000003, 172, 989, 175.5, 540.3000000000004, 989.0, 989.0, 0.08150623522699486, 6.2127859165503505, 0.18200604992766323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=120a839d-563a-428e-a45e-dcabb7e2f7c0", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=501f1305-be77-43e1-9d06-21a8526a9415", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 634.1363636363635, 117, 1851, 435.5, 1592.3999999999996, 1833.8999999999996, 1851.0, 0.09767402625655415, 0.05999703370641851, 0.04416315835623493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 97.75000000000001, 83, 260, 84.5, 148.7000000000001, 260.0, 260.0, 0.08709236689836865, 0.06472391719693217, 0.043716285728282706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b608805-27db-4349-b184-65839138cae6", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 106.68750000000001, 82, 251, 87.0, 248.9, 251.0, 251.0, 0.08708904855214457, 0.10505541721097322, 0.04509664843239713], "isController": false}, {"data": ["login", 22, 0, 0.0, 2548.863636363636, 1248, 3644, 2640.0, 3594.7999999999997, 3643.55, 3644.0, 0.09627798078816656, 26.310441271799306, 0.18154690269359533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4814d549-ffaa-4cc6-9315-8a4e9ea6530c", 3, 0, 0.0, 287.6666666666667, 183, 418, 262.0, 418.0, 418.0, 418.0, 0.050504200265988786, 0.032469334480900995, 0.0323871336341139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8721da9b-b691-4cc1-820f-9a51bc4ba536", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 91.29411764705883, 86, 112, 90.0, 99.19999999999999, 112.0, 112.0, 0.09088187494654008, 0.07357526790105637, 0.03230566648490291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 771.6874999999999, 167, 1287, 1025.5, 1190.4, 1287.0, 1287.0, 0.08697211999978256, 65.08110362524256, 0.18169444112259261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 332.375, 169, 987, 333.0, 711.2000000000003, 987.0, 987.0, 0.07859742888160771, 5.991063111586244, 0.17551059161758423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 514.8181818181818, 82, 1330, 87.0, 1278.6000000000001, 1330.0, 1330.0, 0.100150225338007, 54.47574771247781, 0.138844630582237], "isController": false}, {"data": ["register", 25, 8, 32.0, 1050.12, 111, 2344, 1000.0, 1932.200000000001, 2309.2, 2344.0, 0.10312297621159185, 0.03227426896122164, 0.04652618653296429], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 284.8823529411765, 168, 1068, 176.0, 629.5999999999996, 1068.0, 1068.0, 0.09142685045256291, 6.567376378797576, 0.20424510496609138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 107.52941176470588, 83, 255, 89.0, 248.6, 255.0, 255.0, 0.09836482936595188, 0.07636722592376148, 0.034965622938678206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24e0173a-d701-49fa-96ee-63bd16fa444a", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe4f3427-3a2d-4a13-8af8-c529fd691069", 3, 0, 0.0, 291.0, 201, 422, 250.0, 422.0, 422.0, 422.0, 0.07586677793794097, 0.033586854816275956, 0.04865154705004678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 373.66666666666663, 169, 1142, 332.0, 1136.6, 1142.0, 1142.0, 0.09976256509507372, 16.047425616615786, 0.22096498874345724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 85.57142857142857, 82, 90, 86.0, 90.0, 90.0, 90.0, 0.032367846705878, 0.024054620452317536, 0.016247141803536418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 131.85714285714286, 83, 246, 89.0, 246.0, 246.0, 246.0, 0.03234481420214585, 0.008654764737683557, 0.018446651849661305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 85.14285714285715, 82, 89, 85.0, 89.0, 89.0, 89.0, 0.032368595064251666, 0.00872434788841158, 0.019029193582694826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 108.14285714285715, 83, 251, 85.0, 251.0, 251.0, 251.0, 0.03236874474007898, 0.008724388230724411, 0.019060891677995725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 89.0, 84, 95, 88.0, 95.0, 95.0, 95.0, 0.14256522358979234, 0.04204560305089579, 0.08812869778548686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe196563-1ce8-4966-ae75-66d47d8cf529", 1, 0, 0.0, 1854.0, 1854, 1854, 1854.0, 1854.0, 1854.0, 1854.0, 0.5393743257820928, 0.09744555690399137, 0.3718733144552319], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 990.4181818181821, 656, 1789, 903.0, 1310.0, 1436.9999999999995, 1789.0, 0.23964515088930138, 286.69891459809327, 0.47320556161930405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1050.12, 111, 2344, 1000.0, 1932.200000000001, 2309.2, 2344.0, 0.10565508264340565, 0.03306673914605336, 0.04766860173950528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 104.33333333333333, 82, 261, 84.0, 261.0, 261.0, 261.0, 0.04562460078474313, 0.012297255680262797, 0.02686683034492198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a1316fc-5677-447e-9e9a-42758c2de7e4", 2, 0, 0.0, 345.0, 210, 480, 345.0, 480.0, 480.0, 480.0, 0.013969992456204073, 0.027612563214215867, 0.008683496287474505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf0514ea-bc71-441a-8c57-13332b7b10d1", 1, 0, 0.0, 1039.0, 1039, 1039, 1039.0, 1039.0, 1039.0, 1039.0, 0.9624639076034649, 0.17388263955726663, 0.6635737487969202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 133.66666666666663, 82, 357, 84.0, 357.0, 357.0, 357.0, 0.04562529466336137, 0.01229744270223412, 0.026822682995452683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 175.41176470588235, 82, 973, 85.0, 399.3999999999995, 973.0, 973.0, 0.10374646804303647, 5.51756829149401, 0.06046712228657216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 137.52941176470586, 82, 489, 86.0, 296.1999999999998, 489.0, 489.0, 0.1037445686666992, 1.8206909578980128, 0.06056732831799541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 83.8888888888889, 80, 88, 84.0, 88.0, 88.0, 88.0, 0.04562436949656043, 0.012208083244196833, 0.02602014822850712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 95.6470588235294, 83, 244, 84.0, 125.5999999999999, 244.0, 244.0, 0.10374710118393751, 0.07710111718845356, 0.05207618164896863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 87.22222222222221, 83, 95, 86.0, 95.0, 95.0, 95.0, 0.04562529466336137, 0.03390707933478321, 0.022901759235320063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 103.6470588235294, 81, 248, 84.0, 247.2, 248.0, 248.0, 0.10374646804303647, 0.03692630491697232, 0.05865537330420296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 95.22222222222223, 84, 115, 88.0, 115.0, 115.0, 115.0, 0.04542907763829369, 0.03575765290670382, 0.01614861744173721], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 531.9333333333333, 82, 1033, 476.0, 983.8000000000001, 1033.0, 1033.0, 0.09848012342842137, 0.019503680694613137, 0.0670126464891836], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1358.7272727272725, 820, 2545, 1367.5, 1789.8, 2439.9999999999986, 2545.0, 0.09633616065368464, 0.04986148940083287, 0.0443108707694194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 223.44444444444446, 168, 444, 176.0, 444.0, 444.0, 444.0, 0.0456049496572028, 0.07067876475193441, 0.10256660064505667], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1016.3103448275862, 433, 3027, 842.0, 1609.3000000000002, 1863.4999999999977, 3027.0, 0.26791942092450677, 89.46948742799665, 0.972804807421368], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 160.85454545454547, 83, 372, 89.0, 337.0, 342.7999999999999, 372.0, 0.24049918886182664, 0.17873035422250985, 0.11625693211582441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2c7f04d-5599-4088-9ce8-4da863d7c879", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 541.1454545454545, 406, 827, 491.0, 744.8, 779.2, 827.0, 0.24040773151264544, 70.68785535267814, 0.12090818528223868], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 136.60000000000002, 82, 351, 87.0, 261.4, 335.59999999999997, 351.0, 0.2407908446942832, 0.42608692440043083, 0.11710336001733694], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 826.6181818181818, 567, 1452, 808.0, 984.8, 1142.6, 1452.0, 0.24003421578639572, 215.98320929974383, 0.12048592472090568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 103.93333333333334, 85, 253, 89.0, 171.40000000000003, 253.0, 253.0, 0.10587911428591595, 0.07909914299680246, 0.03763671640632169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1098958-e6b7-458f-8670-e650adf6cd41", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, 4.093567251461988, 184.42690058479528, 84, 2675, 92.0, 340.80000000000007, 430.20000000000005, 2353.8800000000006, 0.7244565516715459, 1.5762300205156776, 0.3483021476323828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 94.28571428571429, 86, 125, 90.0, 125.0, 125.0, 125.0, 0.03288592811136115, 0.02546732518780214, 0.011689919758335408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 90.43750000000003, 85, 103, 89.0, 101.6, 103.0, 103.0, 0.07925500297206262, 0.06431729245096098, 0.028172676837725383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6c1db4f-92dc-4715-a04c-9d9fb0c00838", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 219.42857142857144, 167, 335, 176.0, 335.0, 335.0, 335.0, 0.032331070158422244, 0.05010684408341416, 0.07271333454574846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/501f1305-be77-43e1-9d06-21a8526a9415", 3, 0, 0.0, 683.6666666666666, 480, 976, 595.0, 976.0, 976.0, 976.0, 0.030007802028527417, 0.02501626985516234, 0.01924328450397103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f82de34-108b-4ca4-a87c-a0016646a01d", 2, 0, 0.0, 237.0, 217, 257, 237.0, 257.0, 257.0, 257.0, 0.016273657830070464, 0.027525366564142624, 0.010115413289882667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/120a839d-563a-428e-a45e-dcabb7e2f7c0", 3, 0, 0.0, 376.6666666666667, 285, 443, 402.0, 443.0, 443.0, 443.0, 0.044539461963299484, 0.028634582479660314, 0.028562089865787756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b608805-27db-4349-b184-65839138cae6", 3, 0, 0.0, 374.3333333333333, 218, 620, 285.0, 620.0, 620.0, 620.0, 0.03969881829850865, 0.033095271374505415, 0.025457901057311858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 282.70588235294116, 168, 1058, 176.0, 603.5999999999996, 1058.0, 1058.0, 0.10369078188949002, 7.448319485022781, 0.2316423952723103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4814d549-ffaa-4cc6-9315-8a4e9ea6530c", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8721da9b-b691-4cc1-820f-9a51bc4ba536", 3, 0, 0.0, 443.66666666666663, 182, 951, 198.0, 951.0, 951.0, 951.0, 0.0744601638123604, 0.03369128505832713, 0.04774951911144205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24e0173a-d701-49fa-96ee-63bd16fa444a", 3, 0, 0.0, 1001.0, 451, 1909, 643.0, 1909.0, 1909.0, 1909.0, 0.026879311889615627, 0.026958059873667235, 0.017237058731296478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 104.06250000000001, 85, 270, 91.5, 160.80000000000013, 270.0, 270.0, 0.07870762086539028, 0.0652566114401527, 0.027978099604494207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe4f3427-3a2d-4a13-8af8-c529fd691069", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 88.8125, 85, 103, 87.5, 96.7, 103.0, 103.0, 0.08525603452869399, 0.06618998774444504, 0.030305856023871692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85b40303-ed97-4792-b0dd-9593aa2acd1d", 3, 0, 0.0, 434.66666666666663, 182, 840, 282.0, 840.0, 840.0, 840.0, 0.07363228039172373, 0.03331668936995312, 0.047218617308494706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 85.39999999999999, 83, 92, 85.0, 90.2, 92.0, 92.0, 0.09982098769539959, 0.07418337073847567, 0.05010545671429237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 123.26666666666668, 82, 345, 84.0, 286.8, 345.0, 345.0, 0.0998256378858261, 0.04670228084944963, 0.055813969932517866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 235.93333333333337, 81, 1057, 85.0, 1051.6, 1057.0, 1057.0, 0.09982364489402056, 11.999516999134864, 0.05754157238877983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 218.46666666666667, 82, 676, 87.0, 664.6, 676.0, 676.0, 0.09982231627702688, 3.936794588964976, 0.0576382892617807], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6163328197226502], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.23112480739599384], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.23112480739599384], "isController": false}, {"data": ["401/Unauthorized", 13, 48.148148148148145, 1.0015408320493067], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 27, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
