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

    var data = {"OkPercent": 98.4102952308857, "KoPercent": 1.5897047691143074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7386511024643321, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99da4fa6-48fa-4de3-8713-ab6f97bfbe3b"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b6d6fa7-5c78-47e9-8859-722293174786"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c146b0bb-8a3e-45d7-850e-783313475751"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/79ac7ca3-1e13-433d-94b8-598a31e66c5c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7acf044-879f-4812-ab71-d67fee403b36"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d5b6140-721e-4de0-b2d3-f0b0d68f958b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b96715b-881f-43b0-a9fe-e4af466f4352"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ad93f91-d8d6-48bf-a7c2-3fa56f967f8b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f236ea2-901b-421b-8bcb-d2da1d13a2f0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bb72016-6f12-45d6-9abc-976ca8bc8fb1"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98be02a5-ccaa-44a4-8dd8-6b83f8e8838a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b6d6fa7-5c78-47e9-8859-722293174786"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/99da4fa6-48fa-4de3-8713-ab6f97bfbe3b"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c146b0bb-8a3e-45d7-850e-783313475751"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ad93f91-d8d6-48bf-a7c2-3fa56f967f8b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/254c30ca-c1ff-4543-9dc3-c13aa4e56440"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ddba14b-e745-4b5f-b399-51634e0115ee"], "isController": false}, {"data": [0.3225806451612903, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79ac7ca3-1e13-433d-94b8-598a31e66c5c"], "isController": false}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b96715b-881f-43b0-a9fe-e4af466f4352"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9629629629629629, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9466292134831461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7acf044-879f-4812-ab71-d67fee403b36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d5b6140-721e-4de0-b2d3-f0b0d68f958b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cea267d7-2f9a-4798-8c55-88ef8c765b75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cea267d7-2f9a-4798-8c55-88ef8c765b75"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ddba14b-e745-4b5f-b399-51634e0115ee"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=254c30ca-c1ff-4543-9dc3-c13aa4e56440"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f236ea2-901b-421b-8bcb-d2da1d13a2f0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86c69281-b3d0-4736-9c96-74d6fe833de8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98be02a5-ccaa-44a4-8dd8-6b83f8e8838a"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 21, 1.5897047691143074, 471.9788039364116, 125, 4465, 177.0, 1283.6, 1574.0, 2431.719999999994, 5.119916903089779, 698.789619947425, 3.747278318208068], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2512.555555555556, 1591, 5413, 2248.0, 3611.5, 5072.25, 5413.0, 0.23205944159622519, 279.2450208611769, 1.1410344613642516], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99da4fa6-48fa-4de3-8713-ab6f97bfbe3b", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 582.7333333333335, 134, 1401, 512.0, 1095.6000000000001, 1401.0, 1401.0, 0.09566326530612244, 0.018740284199617346, 0.0644107740752551], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 582.7333333333335, 134, 1401, 512.0, 1095.6000000000001, 1401.0, 1401.0, 0.09650894959659259, 0.018905952430738747, 0.06498017947447661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b6d6fa7-5c78-47e9-8859-722293174786", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 240.11764705882354, 127, 1297, 135.0, 579.3999999999994, 1297.0, 1297.0, 0.14086491055078182, 0.03769236864347091, 0.08033701929849274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 157.82352941176467, 128, 399, 134.0, 294.9999999999999, 399.0, 399.0, 0.14086491055078182, 0.10468573918861811, 0.07070758205381039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 195.47058823529412, 127, 401, 134.0, 396.2, 401.0, 401.0, 0.14055975856794412, 0.03788524742651619, 0.08277102970358428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 181.9411764705882, 128, 403, 135.0, 400.6, 403.0, 403.0, 0.14055394791236048, 0.03788368127325341, 0.08263034828441504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c146b0bb-8a3e-45d7-850e-783313475751", 3, 0, 0.0, 439.66666666666663, 220, 875, 224.0, 875.0, 875.0, 875.0, 0.019618229258627114, 0.023188082824894225, 0.012580700403481582], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 336.0666666666666, 128, 1336, 234.0, 791.2000000000003, 1336.0, 1336.0, 0.09531798078389508, 0.222135575529968, 0.06160917403792385], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 206.86666666666665, 128, 898, 134.0, 613.6000000000001, 898.0, 898.0, 0.09638120694972756, 0.07162704930541276, 0.04837884801968747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79ac7ca3-1e13-433d-94b8-598a31e66c5c", 3, 0, 0.0, 734.6666666666666, 247, 1336, 621.0, 1336.0, 1336.0, 1336.0, 0.08527814889564797, 0.038586141590153215, 0.05468683376446175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 215.53333333333333, 126, 778, 133.0, 637.0000000000001, 778.0, 778.0, 0.09638430349489484, 0.02579033120859491, 0.054969173086932215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1005.7142857142858, 900, 1052, 1035.0, 1052.0, 1052.0, 1052.0, 0.07894529091339703, 23.21253675890108, 0.045023486224046734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1256.1428571428573, 1037, 1512, 1245.0, 1512.0, 1512.0, 1512.0, 0.07858810849649721, 70.71371816830766, 0.04474303442720496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 242.85714285714283, 132, 398, 135.0, 398.0, 398.0, 398.0, 0.07966404534022238, 0.14096801773094036, 0.044110853230377035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 169.85714285714286, 126, 405, 134.0, 391.0, 405.0, 405.0, 0.0784313725490196, 0.05828737745098039, 0.03936887254901961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 207.92857142857142, 125, 397, 135.0, 395.5, 397.0, 397.0, 0.07843093316003831, 0.029400658119562356, 0.04425964350339774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 245.71428571428572, 126, 1195, 134.0, 798.0, 1195.0, 1195.0, 0.07843225134175173, 5.060592634441282, 0.045628137290053675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 198.85714285714286, 126, 1070, 132.5, 606.0, 1070.0, 1070.0, 0.0784304937759801, 1.6668558860685034, 0.04570370710132099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 131.57142857142858, 127, 134, 133.0, 134.0, 134.0, 134.0, 0.07966585862724344, 0.05920480313997291, 0.044734246787758766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1123.3571428571431, 127, 1608, 1505.5, 1598.5, 1608.0, 1608.0, 0.0652048363358608, 41.91318303521527, 0.03433078297035975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 266.40000000000003, 127, 1026, 137.0, 671.4000000000002, 1026.0, 1026.0, 0.0962179914815005, 0.02593375551649818, 0.056565655148304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 810.4285714285714, 130, 1574, 1030.0, 1387.5, 1574.0, 1574.0, 0.06520331791740602, 13.699264395961121, 0.034393658628029046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 193.73333333333332, 129, 524, 134.0, 448.40000000000003, 524.0, 524.0, 0.0962186086789185, 0.025933921870489752, 0.05665998147791783], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 480.06666666666666, 131, 915, 501.0, 753.0000000000001, 915.0, 915.0, 0.0964549587494293, 0.018895375708140153, 0.06558434825384372], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7acf044-879f-4812-ab71-d67fee403b36", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d5b6140-721e-4de0-b2d3-f0b0d68f958b", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b96715b-881f-43b0-a9fe-e4af466f4352", 3, 0, 0.0, 599.6666666666667, 222, 1321, 256.0, 1321.0, 1321.0, 1321.0, 0.03366021138612751, 0.02806113325516684, 0.02158548711935911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 454.6428571428572, 253, 1600, 273.5, 1189.0, 1600.0, 1600.0, 0.07836858986918042, 6.809643351194841, 0.17482055692078616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 618.8181818181819, 178, 2069, 509.0, 1160.1999999999998, 1937.449999999998, 2069.0, 0.09263430922174548, 0.05690134814499796, 0.041884458173504065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 136.78571428571428, 131, 163, 134.0, 156.0, 163.0, 163.0, 0.06520210323355859, 0.04845585992259579, 0.03272839947465734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 288.07142857142856, 131, 452, 390.0, 427.0, 452.0, 452.0, 0.06520301424220125, 0.08739823672420056, 0.03327464091768585], "isController": false}, {"data": ["login", 22, 0, 0.0, 2787.0454545454545, 1524, 5076, 2608.0, 4650.799999999999, 5055.15, 5076.0, 0.09042111579656893, 34.54137597690768, 0.184133483144682], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5ad93f91-d8d6-48bf-a7c2-3fa56f967f8b", 3, 0, 0.0, 301.6666666666667, 222, 460, 223.0, 460.0, 460.0, 460.0, 0.018767712028226642, 0.025872806132662702, 0.012035284080601068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f236ea2-901b-421b-8bcb-d2da1d13a2f0", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 182.6, 133, 521, 138.0, 433.40000000000003, 521.0, 521.0, 0.09973934783765094, 0.08074601499747328, 0.035454221301664986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1263.857142857143, 267, 1758, 1643.5, 1750.5, 1758.0, 1758.0, 0.0651608308936808, 55.711001388158415, 0.13463965769619227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 471.70588235294116, 267, 1433, 289.0, 926.5999999999996, 1433.0, 1433.0, 0.14039840110997326, 0.21759010015774172, 0.31575929468385583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 931.909090909091, 128, 1644, 1256.0, 1632.0, 1644.0, 1644.0, 0.12331009124946751, 93.88946826726901, 0.2066516861253727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bb72016-6f12-45d6-9abc-976ca8bc8fb1", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.0609167358803988, 1.9823245431893688], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1021.1304347826086, 234, 1961, 1021.0, 1683.4, 1912.1999999999994, 1961.0, 0.09563250507268072, 0.029836432034394438, 0.043146696624588365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98be02a5-ccaa-44a4-8dd8-6b83f8e8838a", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b6d6fa7-5c78-47e9-8859-722293174786", 3, 0, 0.0, 366.6666666666667, 298, 417, 385.0, 417.0, 417.0, 417.0, 0.03777338487301847, 0.030924499660039535, 0.024223166731720827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 502.13333333333327, 266, 1442, 274.0, 1279.4, 1442.0, 1442.0, 0.09613474245502496, 0.14899007448840293, 0.21620928893937744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 174.73333333333332, 129, 418, 136.0, 406.6, 418.0, 418.0, 0.13721813108905456, 0.1065316545076156, 0.04877675753556237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 632.25, 268, 3203, 405.5, 1581.6000000000004, 3122.799999999999, 3203.0, 0.12168188704270426, 14.727108880192015, 0.27055207072151277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 166.45454545454547, 128, 405, 136.0, 363.0000000000001, 405.0, 405.0, 0.049554906836775145, 0.036827425881626845, 0.02487424034580315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 179.8181818181818, 126, 396, 134.0, 393.8, 396.0, 396.0, 0.04956674161758808, 0.013262975784393685, 0.028268532328780703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 191.45454545454547, 128, 399, 133.0, 398.8, 399.0, 399.0, 0.049566294919454766, 0.013359665427509293, 0.02913956009913259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 156.27272727272728, 128, 357, 133.0, 320.20000000000016, 357.0, 357.0, 0.04956004199087194, 0.013357980067852203, 0.02918428253954666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 133.5, 131, 136, 133.5, 136.0, 136.0, 136.0, 0.05162089613875697, 0.015224131478422465, 0.03191018286702457], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1626.2407407407406, 1050, 4465, 1376.5, 2500.0, 2745.0, 4465.0, 0.2381655956565652, 284.92885216311697, 0.47028401798591296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1021.1304347826086, 234, 1961, 1021.0, 1683.4, 1912.1999999999994, 1961.0, 0.09354917432685268, 0.02918645265598308, 0.04220675638574799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 161.6, 131, 391, 134.5, 366.30000000000007, 391.0, 391.0, 0.04524600251567774, 0.012195211615553765, 0.026643886247025073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 132.1, 127, 144, 131.0, 142.9, 144.0, 144.0, 0.045298882023591655, 0.012209464295421189, 0.026630788064650565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99da4fa6-48fa-4de3-8713-ab6f97bfbe3b", 3, 0, 0.0, 686.3333333333334, 428, 1049, 582.0, 1049.0, 1049.0, 1049.0, 0.02736676944408969, 0.027446945526445422, 0.01754965358231012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 270.1333333333333, 128, 1696, 132.0, 912.4000000000004, 1696.0, 1696.0, 0.12937056905800978, 7.793069146952029, 0.07531455914822417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 262.53333333333336, 127, 781, 133.0, 551.2000000000002, 781.0, 781.0, 0.12907111818612055, 2.562549073914727, 0.0752662764057996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 159.4, 132, 393, 132.5, 367.80000000000007, 393.0, 393.0, 0.04524538836379102, 0.01210667618328002, 0.025804010551224568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 167.9333333333333, 128, 395, 133.0, 384.8, 395.0, 395.0, 0.12934491114004604, 0.09612448962653813, 0.06492508234959343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 133.4, 129, 136, 133.5, 136.0, 136.0, 136.0, 0.04529785605247304, 0.03366373872649608, 0.022737400401339005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 183.06666666666663, 126, 396, 133.0, 390.6, 396.0, 396.0, 0.1290955565309442, 0.04746951193273261, 0.07290200894201888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 195.79999999999998, 133, 407, 144.0, 405.9, 407.0, 407.0, 0.045963275343000945, 0.036178124928182384, 0.016338508032082366], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 531.6666666666666, 132, 1321, 460.0, 1053.4, 1321.0, 1321.0, 0.09761049508043104, 0.018765871873210476, 0.0664272464242022], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c146b0bb-8a3e-45d7-850e-783313475751", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1484.9090909090908, 873, 3481, 1377.0, 2441.3999999999996, 3355.749999999998, 3481.0, 0.0929957306505474, 0.04813255590311536, 0.04277440345352327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 296.3999999999999, 263, 527, 270.0, 502.5000000000001, 527.0, 527.0, 0.04521735984879315, 0.07007807625003391, 0.10169490208180725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ad93f91-d8d6-48bf-a7c2-3fa56f967f8b", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/254c30ca-c1ff-4543-9dc3-c13aa4e56440", 3, 0, 0.0, 350.0, 233, 577, 240.0, 577.0, 577.0, 577.0, 0.017839833970611847, 0.02459365132341835, 0.011440258112664498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ddba14b-e745-4b5f-b399-51634e0115ee", 3, 0, 0.0, 339.0, 226, 426, 365.0, 426.0, 426.0, 426.0, 0.03622838373104048, 0.03020211286952951, 0.0232323945150227], "isController": false}, {"data": ["addBook", 62, 5, 8.064516129032258, 1401.8225806451615, 661, 3939, 1064.0, 2606.0000000000005, 3000.8999999999987, 3939.0, 0.28238166158835126, 77.32201273222475, 1.0303630383469742], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79ac7ca3-1e13-433d-94b8-598a31e66c5c", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.6022135416666667, 2.2981770833333335], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 268.5925925925925, 132, 1044, 136.0, 540.5, 736.5, 1044.0, 0.23928639479596403, 0.1778290492575475, 0.11567066935937716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b96715b-881f-43b0-a9fe-e4af466f4352", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 877.148148148148, 627, 1905, 789.5, 1066.0, 1337.5, 1905.0, 0.23909568697946876, 70.30207069594556, 0.12024831913518204], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 298.46296296296293, 127, 2664, 140.5, 423.5, 725.75, 2664.0, 0.23979218011057082, 0.4243197562112836, 0.11661768134283622], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1318.3703703703704, 915, 4069, 1193.5, 1665.5, 1819.25, 4069.0, 0.23881969997169544, 214.89038583478543, 0.11987629471235495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 419.6, 134, 3587, 139.5, 2044.6000000000045, 3520.2999999999993, 3587.0, 0.11716461628588166, 0.08753020650263621, 0.041648359695372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, 2.808988764044944, 219.89325842696624, 130, 1562, 142.0, 336.0999999999999, 499.7999999999994, 1345.5400000000022, 0.7359081851181174, 1.4710815602287104, 0.3579372594345083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 144.1818181818182, 132, 173, 138.0, 171.0, 173.0, 173.0, 0.04916574667125547, 0.0380746456155328, 0.017476886512047842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7acf044-879f-4812-ab71-d67fee403b36", 3, 0, 0.0, 354.0, 294, 469, 299.0, 469.0, 469.0, 469.0, 0.02696726174424249, 0.027046267393883827, 0.017293458865936754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d5b6140-721e-4de0-b2d3-f0b0d68f958b", 3, 0, 0.0, 406.3333333333333, 240, 529, 450.0, 529.0, 529.0, 529.0, 0.026330802650634134, 0.026253661627243602, 0.01688531289770483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cea267d7-2f9a-4798-8c55-88ef8c765b75", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 155.7058823529412, 133, 397, 137.0, 209.79999999999984, 397.0, 397.0, 0.1351501756952284, 0.1096775351589207, 0.048041664016663224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cea267d7-2f9a-4798-8c55-88ef8c765b75", 3, 0, 0.0, 307.6666666666667, 234, 424, 265.0, 424.0, 424.0, 424.0, 0.0185821796896776, 0.02561703482610177, 0.01191630663693518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ddba14b-e745-4b5f-b399-51634e0115ee", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 377.8181818181818, 260, 805, 294.0, 754.8000000000002, 805.0, 805.0, 0.049516092730137296, 0.07674027261985145, 0.11136285308350213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=254c30ca-c1ff-4543-9dc3-c13aa4e56440", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 528.1333333333333, 262, 2091, 510.0, 1302.0000000000005, 2091.0, 2091.0, 0.12890252391141818, 10.467270977811578, 0.2877060694827571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f236ea2-901b-421b-8bcb-d2da1d13a2f0", 3, 0, 0.0, 477.3333333333333, 389, 635, 408.0, 635.0, 635.0, 635.0, 0.028883090875831595, 0.028967709306131878, 0.0185220341879519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 406.00000000000006, 129, 3895, 136.5, 2021.5, 3895.0, 3895.0, 0.08117165485812354, 0.06729954587358095, 0.028853986687848606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 193.5, 132, 808, 144.5, 490.5, 808.0, 808.0, 0.061957868649318466, 0.0481020562267658, 0.02202408612143742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86c69281-b3d0-4736-9c96-74d6fe833de8", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98be02a5-ccaa-44a4-8dd8-6b83f8e8838a", 3, 0, 0.0, 397.0, 353, 444, 394.0, 444.0, 444.0, 444.0, 0.016890370236915593, 0.02328473891710206, 0.01083138976781371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 205.85000000000002, 126, 1577, 133.0, 142.4, 1505.299999999999, 1577.0, 0.12178191295028863, 0.09050394116715785, 0.061128811773875344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 284.8, 130, 1625, 133.5, 400.8, 1563.799999999999, 1625.0, 0.12178932881900888, 0.05088034655153516, 0.06843513652583762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 335.09999999999997, 125, 1466, 135.5, 1204.0000000000018, 1457.35, 1466.0, 0.12179303709206946, 10.98850321305256, 0.07055432578419492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 263.95000000000005, 130, 1045, 134.0, 973.4000000000013, 1044.6, 1045.0, 0.12178858719149428, 3.610532086725653, 0.07067068213787686], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 38.095238095238095, 0.6056018168054504], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.1514004542013626], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.1514004542013626], "isController": false}, {"data": ["401/Unauthorized", 9, 42.857142857142854, 0.6813020439061317], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 21, "401/Unauthorized", 9, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
