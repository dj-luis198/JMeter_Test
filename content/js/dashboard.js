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

    var data = {"OkPercent": 99.4810971089696, "KoPercent": 0.5189028910303929};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8220012828736369, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3898305084745763, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d51b77d-dd1e-42e6-8336-93b8afe477a0"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=451f737d-708a-4507-9d50-d0288ba894f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f35ab7d6-49db-41a7-a993-1df47de76d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5eb48261-5bf1-41ad-8dfa-d70cdc173981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f505bd31-a365-42d5-b155-eeacec1fcd5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53724aba-5f22-4787-bb83-dd352683c51e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f22523c-2b1c-464f-bd9d-f1852ead18df"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f505bd31-a365-42d5-b155-eeacec1fcd5c"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ed8c2e1-05d9-425a-b319-863ea361403a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/048cb1ca-3d1c-4b30-ab45-d5f4f12106b8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/451f737d-708a-4507-9d50-d0288ba894f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66c2bc51-0434-4a6c-9757-3052c797e489"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a983bdb-f202-4fa1-b31e-ab0c466a529b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77c0d7b5-09f2-485e-aea8-c781e4fe45de"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f35ab7d6-49db-41a7-a993-1df47de76d63"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c7ab024-fa7d-42f6-8312-337c094cc9e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53724aba-5f22-4787-bb83-dd352683c51e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f22523c-2b1c-464f-bd9d-f1852ead18df"], "isController": false}, {"data": [0.43548387096774194, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7542372881355932, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d51b77d-dd1e-42e6-8336-93b8afe477a0"], "isController": false}, {"data": [0.9726775956284153, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4e510a0-f36f-499c-924f-de9260ed9141"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fcf85d7-b7fd-4b5f-84d3-22d82f5f4830"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4e510a0-f36f-499c-924f-de9260ed9141"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5eb48261-5bf1-41ad-8dfa-d70cdc173981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66c2bc51-0434-4a6c-9757-3052c797e489"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=048cb1ca-3d1c-4b30-ab45-d5f4f12106b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7646dc50-de29-4be8-a090-295f79fc20a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5ed8c2e1-05d9-425a-b319-863ea361403a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8c7ab024-fa7d-42f6-8312-337c094cc9e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1349, 7, 0.5189028910303929, 311.4106745737579, 76, 3421, 95.0, 804.0, 1015.5, 1975.0, 5.246067393882829, 729.1905466759999, 3.844654918674289], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1313.9661016949156, 991, 1813, 1289.0, 1593.0, 1666.0, 1813.0, 0.2553836164917217, 307.3119369521697, 1.2557192471052916], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d51b77d-dd1e-42e6-8336-93b8afe477a0", 3, 0, 0.0, 349.0, 232, 524, 291.0, 524.0, 524.0, 524.0, 0.0250027086267679, 0.025075958749697886, 0.016033638019118737], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 642.75, 419, 1035, 555.0, 1000.5000000000001, 1035.0, 1035.0, 0.06592392379194409, 0.011910083888193026, 0.044807666952337004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 642.75, 419, 1035, 555.0, 1000.5000000000001, 1035.0, 1035.0, 0.06560280780017386, 0.011852069768586096, 0.04458940842668066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 97.22222222222223, 78, 238, 80.0, 232.60000000000002, 238.0, 238.0, 0.13426323052250774, 0.035925903479655394, 0.07657199865736769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 100.16666666666667, 78, 239, 82.0, 232.70000000000002, 239.0, 239.0, 0.13426823810234223, 0.09978332929285394, 0.06739636170371475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=451f737d-708a-4507-9d50-d0288ba894f6", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 110.16666666666667, 78, 311, 79.5, 243.5000000000001, 311.0, 311.0, 0.1342652335096186, 0.03618867621938939, 0.07906439043583988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 124.11111111111111, 78, 247, 80.0, 239.8, 247.0, 247.0, 0.13426723655649295, 0.03618921610311723, 0.07893444961621948], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 277.6666666666667, 176, 536, 209.5, 524.6, 536.0, 536.0, 0.06590039155815984, 0.18447604726705585, 0.042603573448732245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f35ab7d6-49db-41a7-a993-1df47de76d63", 1, 0, 0.0, 2283.0, 2283, 2283, 2283.0, 2283.0, 2283.0, 2283.0, 0.43802014892685065, 0.07913449956197985, 0.3019943604905826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5eb48261-5bf1-41ad-8dfa-d70cdc173981", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 91.00000000000001, 79, 245, 81.0, 120.19999999999989, 245.0, 245.0, 0.08830113804584387, 0.06562223247352264, 0.04432303218316773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 98.41176470588235, 78, 235, 79.0, 234.2, 235.0, 235.0, 0.08830251402451693, 0.0314293644816123, 0.0499237903854145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 589.75, 460, 644, 627.5, 644.0, 644.0, 644.0, 0.10210332856851133, 30.02176874872371, 0.05823080457422912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 769.25, 690, 896, 745.5, 896.0, 896.0, 896.0, 0.10147648282510528, 91.3087176226597, 0.05777420848343397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 159.5, 80, 238, 160.0, 238.0, 238.0, 238.0, 0.10309012654313034, 0.1824212004845236, 0.057082130615190324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f505bd31-a365-42d5-b155-eeacec1fcd5c", 3, 0, 0.0, 298.0, 207, 438, 249.0, 438.0, 438.0, 438.0, 0.019537355423569866, 0.023092492689772846, 0.012528837950661665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53724aba-5f22-4787-bb83-dd352683c51e", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 104.07142857142858, 79, 242, 81.0, 240.0, 242.0, 242.0, 0.1126388877714396, 0.08370917343170463, 0.0565394417133984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 101.64285714285717, 78, 243, 79.0, 238.0, 243.0, 243.0, 0.11264160659114315, 0.04222488796183059, 0.06356519233554325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 181.5, 78, 882, 80.5, 563.0, 882.0, 882.0, 0.11249949777009924, 7.258673824279803, 0.06544683394270562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 151.64285714285717, 78, 459, 80.0, 349.5, 459.0, 459.0, 0.11249678580611983, 2.3908548901951017, 0.06555511639399589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 81.0, 80, 83, 80.5, 83.0, 83.0, 83.0, 0.10310341272296113, 0.07662275105680998, 0.05789498273017837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 506.58823529411757, 78, 930, 694.0, 922.8, 930.0, 930.0, 0.09482955781535012, 50.20334969724269, 0.05095563440974178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 168.5294117647059, 78, 943, 82.0, 386.1999999999995, 943.0, 943.0, 0.08830067939581558, 4.696111953899254, 0.05146476867819077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 400.3529411764706, 77, 713, 616.0, 646.5999999999999, 713.0, 713.0, 0.0948327317962993, 16.412861270870174, 0.05104995000362596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 112.5294117647059, 77, 481, 80.0, 281.79999999999984, 481.0, 481.0, 0.08830343136745655, 1.5497029011572945, 0.0515526064445922], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 664.5, 189, 2283, 520.0, 1877.7000000000014, 2283.0, 2283.0, 0.065695828314902, 0.011868875232672726, 0.04529419413117267], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f22523c-2b1c-464f-bd9d-f1852ead18df", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 310.35714285714283, 160, 963, 237.0, 722.5, 963.0, 963.0, 0.11242180661843235, 9.76861277262288, 0.25078469417253535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f505bd31-a365-42d5-b155-eeacec1fcd5c", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 832.1500000000001, 104, 2545, 724.5, 1353.3, 2485.5499999999993, 2545.0, 0.08323379958133399, 0.05112701165689363, 0.03763403242788831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 82.29411764705881, 78, 101, 81.0, 92.19999999999999, 101.0, 101.0, 0.09482003714714396, 0.07046684401267242, 0.047595213958624996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 161.88235294117646, 80, 315, 94.0, 278.2, 315.0, 315.0, 0.09483008679742062, 0.10915701282437468, 0.049397933540843875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ed8c2e1-05d9-425a-b319-863ea361403a", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/048cb1ca-3d1c-4b30-ab45-d5f4f12106b8", 3, 0, 0.0, 366.0, 212, 491, 395.0, 491.0, 491.0, 491.0, 0.017725991621514628, 0.02443671045478986, 0.011367253741661398], "isController": false}, {"data": ["login", 20, 0, 0.0, 3234.2000000000003, 1756, 6322, 3090.0, 4435.2, 6228.149999999999, 6322.0, 0.08267366637041935, 19.895982964057623, 0.15215506996259018], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 93.17647058823529, 81, 236, 83.0, 120.7999999999999, 236.0, 236.0, 0.0888716954105611, 0.07194788622593276, 0.03159111047797289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 590.1176470588235, 161, 1015, 775.0, 1004.6, 1015.0, 1015.0, 0.0947756326273478, 66.75730856890188, 0.19888836371264026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/451f737d-708a-4507-9d50-d0288ba894f6", 3, 0, 0.0, 980.0, 429, 1972, 539.0, 1972.0, 1972.0, 1972.0, 0.017663163472577938, 0.024350096779416526, 0.011326963555006035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66c2bc51-0434-4a6c-9757-3052c797e489", 3, 0, 0.0, 282.6666666666667, 180, 473, 195.0, 473.0, 473.0, 473.0, 0.02333195934017219, 0.02798771815381983, 0.014962226529993234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 247.33333333333334, 158, 544, 170.0, 484.6000000000001, 544.0, 544.0, 0.13418416030534353, 0.2079592406294728, 0.3017833214679747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 850.5, 770, 976, 828.0, 976.0, 976.0, 976.0, 0.10127095042786977, 121.15526419059194, 0.22835412552534307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a983bdb-f202-4fa1-b31e-ab0c466a529b", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77c0d7b5-09f2-485e-aea8-c781e4fe45de", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1394.5238095238094, 146, 3183, 1262.0, 2296.4, 3097.799999999999, 3183.0, 0.0873889432179938, 0.027601641663719024, 0.0394274333659308], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 88.88235294117646, 82, 120, 85.0, 103.99999999999999, 120.0, 120.0, 0.07776369899044422, 0.06037318427480776, 0.02764256487550947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 270.05882352941177, 160, 1190, 167.0, 502.7999999999994, 1190.0, 1190.0, 0.08826262804570965, 6.340083855986543, 0.1971763179038145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f35ab7d6-49db-41a7-a993-1df47de76d63", 3, 0, 0.0, 542.3333333333334, 207, 781, 639.0, 781.0, 781.0, 781.0, 0.02022626447863432, 0.027883538433273552, 0.012970618822561723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 258.94444444444446, 159, 797, 170.5, 368.6000000000007, 797.0, 797.0, 0.08589302500918579, 5.834495287514972, 0.19195450771367084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 82.41666666666667, 79, 88, 81.0, 87.7, 88.0, 88.0, 0.058338235365610586, 0.043354879993388336, 0.029283059548753747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 95.08333333333333, 78, 236, 81.5, 192.80000000000015, 236.0, 236.0, 0.05833936983757347, 0.0302141723344985, 0.032455072608207375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 221.91666666666666, 77, 852, 81.5, 850.5, 852.0, 852.0, 0.05812207573306468, 8.729445748491248, 0.033336945781790354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 188.33333333333334, 78, 626, 89.5, 581.0000000000001, 626.0, 626.0, 0.0581843571355841, 2.8644242354817906, 0.03342948904437042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c7ab024-fa7d-42f6-8312-337c094cc9e6", 1, 0, 0.0, 895.0, 895, 895, 895.0, 895.0, 895.0, 895.0, 1.1173184357541899, 0.2018592877094972, 0.770338687150838], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 905.6949152542371, 625, 1483, 821.0, 1260.0, 1324.0, 1483.0, 0.2591788861457903, 310.06805299000183, 0.5117770583855352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1394.5238095238094, 146, 3183, 1262.0, 2296.4, 3097.799999999999, 3183.0, 0.08376244969267159, 0.026456220159627297, 0.03779126148243581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 119.625, 77, 234, 81.0, 234.0, 234.0, 234.0, 0.04746647680075946, 0.0127936988252047, 0.027951450694197223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 81.0, 78, 87, 80.5, 87.0, 87.0, 87.0, 0.047467603360706316, 0.012794002468315375, 0.027905759006977737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 79.6470588235294, 78, 84, 79.0, 81.6, 84.0, 84.0, 0.07465931199248138, 0.020123017685473494, 0.043891509589329865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 116.58823529411764, 77, 241, 80.0, 235.4, 241.0, 241.0, 0.07460885212086635, 0.020109417173202256, 0.043934704911017974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 81.47058823529412, 79, 85, 81.0, 84.2, 85.0, 85.0, 0.07465832835611144, 0.05548338660058672, 0.03747498122562625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 99.75000000000001, 79, 233, 81.0, 233.0, 233.0, 233.0, 0.04746872997412954, 0.012701593762608881, 0.027072010063370754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 116.94117647058823, 78, 243, 81.0, 235.79999999999998, 243.0, 243.0, 0.07460950700671046, 0.01996387199202995, 0.04255073446476456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 101.25, 80, 242, 81.0, 242.0, 242.0, 242.0, 0.04746957496929312, 0.03527768217932819, 0.02382750149825846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 85.875, 81, 93, 85.0, 93.0, 93.0, 93.0, 0.04631693520839726, 0.03645649392379706, 0.01646422306235996], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 602.0, 405, 1454, 507.5, 1252.1000000000008, 1454.0, 1454.0, 0.06513879992617602, 0.011768240221037661, 0.04433764018412567], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1756.8500000000001, 1129, 3283, 1528.0, 2726.9, 3255.6499999999996, 3283.0, 0.08366765533946059, 0.04330454817374425, 0.038483853188365176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 221.875, 161, 475, 163.5, 475.0, 475.0, 475.0, 0.04744367546153801, 0.07352843062252032, 0.10670193807414259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53724aba-5f22-4787-bb83-dd352683c51e", 3, 0, 0.0, 288.0, 176, 469, 219.0, 469.0, 469.0, 469.0, 0.0899496282082034, 0.040699864325977456, 0.057682541526745026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f22523c-2b1c-464f-bd9d-f1852ead18df", 3, 0, 0.0, 399.33333333333337, 201, 664, 333.0, 664.0, 664.0, 664.0, 0.019867286526006278, 0.023482460083310154, 0.012740414862054806], "isController": false}, {"data": ["addBook", 62, 2, 3.225806451612903, 892.6935483870968, 409, 2070, 751.0, 1500.1000000000001, 1610.0499999999997, 2070.0, 0.29815289472798356, 87.38621462139392, 1.0871863909433654], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 142.10169491525417, 78, 367, 82.0, 324.0, 328.0, 367.0, 0.25989586545323196, 0.19314526719717726, 0.12563325527280256], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 529.5593220338983, 387, 779, 484.0, 648.0, 711.0, 779.0, 0.25957912983796105, 76.32488301065594, 0.13055005065092767], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 117.49152542372879, 78, 323, 83.0, 242.0, 243.0, 323.0, 0.2601996039673824, 0.4604313304579072, 0.12654238552319966], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 761.0508474576272, 544, 1238, 720.0, 964.0, 1016.0, 1238.0, 0.2596648123371593, 233.64685458302893, 0.13033956400517568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 93.66666666666666, 80, 234, 83.0, 117.90000000000018, 234.0, 234.0, 0.08706714327865839, 0.06504527793766961, 0.0309496485873356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d51b77d-dd1e-42e6-8336-93b8afe477a0", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 2, 1.092896174863388, 165.4754098360656, 80, 1724, 90.0, 311.6, 440.5999999999999, 852.9199999999964, 0.7652773189366409, 1.5850206962037228, 0.3695581477466138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 104.58333333333333, 80, 239, 88.0, 206.0000000000001, 239.0, 239.0, 0.059476016296428465, 0.04605906340143337, 0.021141865167871057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4e510a0-f36f-499c-924f-de9260ed9141", 3, 0, 0.0, 421.0, 220, 545, 498.0, 545.0, 545.0, 545.0, 0.01991978964702133, 0.027461038136437278, 0.012774083855674483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fcf85d7-b7fd-4b5f-84d3-22d82f5f4830", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 118.22222222222223, 81, 339, 84.5, 250.80000000000013, 339.0, 339.0, 0.1278890491449196, 0.10378496078069159, 0.045460560438233134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4e510a0-f36f-499c-924f-de9260ed9141", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 321.5, 159, 935, 174.0, 932.6, 935.0, 935.0, 0.058098719407393064, 11.659412522089617, 0.1281878646299838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 209.23529411764707, 160, 326, 165.0, 323.6, 326.0, 326.0, 0.07458168449315165, 0.11558704422913249, 0.16773595643332836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5eb48261-5bf1-41ad-8dfa-d70cdc173981", 3, 0, 0.0, 372.0, 259, 452, 405.0, 452.0, 452.0, 452.0, 0.08525633738774582, 0.03852076702284869, 0.05467284656701148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66c2bc51-0434-4a6c-9757-3052c797e489", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=048cb1ca-3d1c-4b30-ab45-d5f4f12106b8", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 0.1938455606223176, 0.7397565718884119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7646dc50-de29-4be8-a090-295f79fc20a6", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 106.78571428571429, 84, 321, 87.5, 217.5, 321.0, 321.0, 0.12021707769457993, 0.09967216695576012, 0.042733414336745205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ed8c2e1-05d9-425a-b319-863ea361403a", 3, 0, 0.0, 749.6666666666667, 259, 1454, 536.0, 1454.0, 1454.0, 1454.0, 0.018913841148952806, 0.02607425692246586, 0.012128993184712573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 90.35294117647061, 81, 152, 86.0, 112.79999999999997, 152.0, 152.0, 0.088685318406377, 0.06885237122370089, 0.03152485927726682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c7ab024-fa7d-42f6-8312-337c094cc9e6", 3, 0, 0.0, 1352.3333333333333, 195, 3421, 441.0, 3421.0, 3421.0, 3421.0, 0.028565443430900193, 0.023813834839366988, 0.01831833449182076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 82.11111111111111, 80, 90, 81.0, 84.60000000000001, 90.0, 90.0, 0.08598904117441922, 0.06390396516966115, 0.043162467933253394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 131.88888888888889, 76, 240, 81.0, 238.2, 240.0, 240.0, 0.08593115959325918, 0.030163552656705016, 0.04860667697044923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 140.55555555555557, 78, 713, 80.0, 281.90000000000066, 713.0, 713.0, 0.08593033913840513, 4.317444761412026, 0.05010738308699969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 161.77777777777777, 77, 629, 80.0, 275.3000000000006, 629.0, 629.0, 0.08599356003783716, 1.426610393635521, 0.050228226311162916], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 71.42857142857143, 0.37064492216456635], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.14825796886582654], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1349, 7, "406/Not Acceptable", 5, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
