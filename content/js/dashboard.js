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

    var data = {"OkPercent": 97.91200596569725, "KoPercent": 2.087994034302759};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8137065637065637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36666666666666664, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=638f0d92-900b-47f2-aaf9-4b543ac98c14"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9c487e8-504a-4026-994e-de72b040550f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c664db44-6715-46d7-b06b-d194434a430f"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4aac8d5d-e751-467d-81d2-b0fd7239930c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56ac3921-f109-4aaf-960c-85c4d1b3b4fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e72771e-7360-4073-b6dd-ed884301292b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f1aaa76-2de2-4ea8-a054-800957be9028"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4aac8d5d-e751-467d-81d2-b0fd7239930c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6e3be0e-8510-4548-9e4a-cdce213b2140"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/139a93dd-c8ca-473c-8d93-fffbb0bf3b31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=377dadc6-4d4b-4bbc-b23b-62d719eb3ae9"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ebab8ae-bb55-404e-aa57-4c88dbc118c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d57e94a6-c441-41ac-a3fd-3691f6034907"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23dfd8a0-d099-4dae-b085-9c2fcc4dc613"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f1aaa76-2de2-4ea8-a054-800957be9028"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6ec0ee2-b3e7-46e8-a6b4-5c4c7f37de34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c664db44-6715-46d7-b06b-d194434a430f"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e964a66-2aee-4f63-b1ec-e137dd566cce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/638f0d92-900b-47f2-aaf9-4b543ac98c14"], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e72771e-7360-4073-b6dd-ed884301292b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9c487e8-504a-4026-994e-de72b040550f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56ac3921-f109-4aaf-960c-85c4d1b3b4fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9147727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4df793c2-fe07-4d4c-b0e4-395ab93d894f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=139a93dd-c8ca-473c-8d93-fffbb0bf3b31"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d57e94a6-c441-41ac-a3fd-3691f6034907"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/377dadc6-4d4b-4bbc-b23b-62d719eb3ae9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ebab8ae-bb55-404e-aa57-4c88dbc118c8"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 28, 2.087994034302759, 299.92915734526457, 77, 3670, 91.0, 846.0, 1049.7999999999997, 1427.3799999999992, 5.29966210208074, 769.3862447388701, 3.87707681867133], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1335.6333333333332, 959, 1855, 1322.0, 1649.4, 1769.4499999999998, 1855.0, 0.26304483160746694, 316.53178283703716, 1.2933893819761682], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=638f0d92-900b-47f2-aaf9-4b543ac98c14", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 513.9999999999999, 81, 1064, 436.0, 1026.0, 1064.0, 1064.0, 0.07375509903040411, 0.014621372171066443, 0.0495874501443898], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 513.9999999999999, 81, 1064, 436.0, 1026.0, 1064.0, 1064.0, 0.07439624585097859, 0.014748474519285796, 0.050018509642898015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9c487e8-504a-4026-994e-de72b040550f", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 107.58823529411765, 77, 236, 81.0, 235.2, 236.0, 236.0, 0.10444313378551066, 0.046401838045561784, 0.05853327281775288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 91.88235294117646, 80, 237, 83.0, 119.39999999999989, 237.0, 237.0, 0.10444249212073552, 0.07761790674207004, 0.05242523530279107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 182.4705882352941, 79, 632, 85.0, 497.5999999999999, 632.0, 632.0, 0.10444120881483802, 3.6376834632704846, 0.060446069554773274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c664db44-6715-46d7-b06b-d194434a430f", 3, 0, 0.0, 398.66666666666663, 181, 808, 207.0, 808.0, 808.0, 808.0, 0.04619720044965275, 0.029700348596375062, 0.029625157840434874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 235.29411764705884, 78, 1079, 83.0, 956.5999999999999, 1079.0, 1079.0, 0.10444377545817027, 11.08115578941063, 0.060345559142823794], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 173.14285714285714, 79, 254, 185.5, 240.5, 254.0, 254.0, 0.07648350687805251, 0.11413840305169193, 0.04942938694371907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4aac8d5d-e751-467d-81d2-b0fd7239930c", 3, 0, 0.0, 261.3333333333333, 170, 424, 190.0, 424.0, 424.0, 424.0, 0.07751937984496124, 0.03598393087855297, 0.04971132105943152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56ac3921-f109-4aaf-960c-85c4d1b3b4fe", 3, 0, 0.0, 290.6666666666667, 206, 446, 220.0, 446.0, 446.0, 446.0, 0.016974662487127548, 0.023400942588862356, 0.010885444368372809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 81.77777777777777, 79, 86, 81.5, 84.2, 86.0, 86.0, 0.09545577480922103, 0.07093930139630586, 0.047914324464784774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 592.6, 463, 639, 618.0, 639.0, 639.0, 639.0, 0.025693862763940204, 7.554848769135504, 0.01465353110755965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 99.5, 78, 245, 81.5, 233.3, 245.0, 245.0, 0.0954567872427307, 0.03350723814347155, 0.05399481682903159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e72771e-7360-4073-b6dd-ed884301292b", 3, 0, 0.0, 417.0, 254, 617, 380.0, 617.0, 617.0, 617.0, 0.029907883718148103, 0.024932972071021253, 0.019179209285400962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 777.6, 704, 846, 794.0, 846.0, 846.0, 846.0, 0.025643392723430882, 23.073969848819377, 0.014599705036875198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 175.8, 81, 249, 230.0, 249.0, 249.0, 249.0, 0.025744399305930993, 0.045555519084323204, 0.0142549554750614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f1aaa76-2de2-4ea8-a054-800957be9028", 3, 0, 0.0, 930.3333333333334, 191, 2125, 475.0, 2125.0, 2125.0, 2125.0, 0.02320024128250934, 0.02326821073939169, 0.014877758895359179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 81.86666666666669, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.09792401096748922, 0.07277360580689385, 0.04915326331766549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 101.6, 79, 239, 81.0, 236.6, 239.0, 239.0, 0.09792337169753429, 0.03600723980128084, 0.05529865404325601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 158.06666666666663, 78, 929, 81.0, 513.2000000000003, 929.0, 929.0, 0.09792528953243938, 5.8988575076871355, 0.05700832936191882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 139.46666666666667, 78, 627, 82.0, 397.8000000000001, 627.0, 627.0, 0.09792401096748922, 1.9441613828502415, 0.05710321394764329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.2, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.025744399305930993, 0.019132312374817856, 0.014456083594638985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 648.9285714285714, 80, 1125, 867.0, 1101.0, 1125.0, 1125.0, 0.10886385020334212, 62.98211893035435, 0.05798579521154579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 145.61111111111111, 78, 1047, 82.0, 322.50000000000114, 1047.0, 1047.0, 0.09545628102329133, 4.796061840092168, 0.0556621152581562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 428.2857142857143, 78, 728, 511.5, 707.0, 728.0, 728.0, 0.10873110796999022, 20.562966839924506, 0.05802127343543702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 113.99999999999999, 77, 486, 82.0, 268.20000000000033, 486.0, 486.0, 0.09545881217418051, 1.5836364205862232, 0.05575681270981052], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 357.00000000000006, 84, 784, 398.0, 663.9999999999999, 784.0, 784.0, 0.07453914738682951, 0.01477680363234999, 0.05057373641810728], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 263.26666666666665, 161, 1013, 166.0, 602.6000000000003, 1013.0, 1013.0, 0.09787225712999394, 7.947520385975558, 0.21844756453044153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 518.6666666666667, 172, 1534, 419.0, 1316.8000000000004, 1523.8, 1534.0, 0.10228086325048584, 0.06282681932085507, 0.04624613250485834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 92.57142857142857, 79, 242, 80.0, 165.0, 242.0, 242.0, 0.10885961774722798, 0.08090055576722704, 0.05464242531452654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4aac8d5d-e751-467d-81d2-b0fd7239930c", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 148.57142857142858, 79, 248, 81.5, 244.5, 248.0, 248.0, 0.10872941907424666, 0.13407635814694005, 0.05613945033395465], "isController": false}, {"data": ["login", 21, 0, 0.0, 2613.714285714286, 1390, 5403, 2240.0, 4152.200000000001, 5288.5999999999985, 5403.0, 0.10222659254427385, 29.259276873119763, 0.1945984731119722], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 87.05555555555556, 81, 103, 85.5, 98.5, 103.0, 103.0, 0.0949632544962463, 0.07687943161854316, 0.033756469371712554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6e3be0e-8510-4548-9e4a-cdce213b2140", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.8403577302631579, 1.5702097039473684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/139a93dd-c8ca-473c-8d93-fffbb0bf3b31", 3, 0, 0.0, 558.0, 184, 1056, 434.0, 1056.0, 1056.0, 1056.0, 0.02761998582174061, 0.027700903748952743, 0.017712035178655276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=377dadc6-4d4b-4bbc-b23b-62d719eb3ae9", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 754.0714285714286, 162, 1214, 948.5, 1185.5, 1214.0, 1214.0, 0.10865684615742825, 83.62601811222312, 0.22649980402961675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ebab8ae-bb55-404e-aa57-4c88dbc118c8", 3, 0, 0.0, 278.3333333333333, 176, 384, 275.0, 384.0, 384.0, 384.0, 0.04475407635045425, 0.0287725588516104, 0.028699716930467082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d57e94a6-c441-41ac-a3fd-3691f6034907", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 514.0, 79, 932, 786.0, 932.0, 932.0, 932.0, 0.039663652229097256, 26.366671046194934, 0.061216991027200456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 356.76470588235287, 161, 1163, 319.0, 1038.1999999999998, 1163.0, 1163.0, 0.10438926141527276, 14.835202409626532, 0.23163166364244836], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1063.5909090909095, 125, 3550, 1014.5, 1556.1, 3259.599999999996, 3550.0, 0.08717117645427278, 0.02742672668270088, 0.0393291831268301], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 94.42105263157896, 82, 237, 85.0, 104.0, 237.0, 237.0, 0.0891503967192654, 0.0692134427654453, 0.031690180083801374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 246.1111111111111, 160, 1131, 166.5, 407.4000000000011, 1131.0, 1131.0, 0.09541428351824267, 6.481250223627226, 0.21323270218551715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23dfd8a0-d099-4dae-b085-9c2fcc4dc613", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 291.4375, 162, 783, 173.0, 778.1, 783.0, 783.0, 0.08524831234981645, 12.863930789692413, 0.18899900499235428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 96.08333333333333, 79, 246, 82.5, 198.30000000000018, 246.0, 246.0, 0.052514342979926396, 0.03902677246848046, 0.026359738566095865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 95.08333333333333, 79, 247, 82.0, 198.1000000000002, 247.0, 247.0, 0.05251664121068363, 0.014052304386452457, 0.02995089694046801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 122.0, 78, 246, 82.5, 245.4, 246.0, 246.0, 0.05251595172033505, 0.014154690112121556, 0.030873635679337597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 127.91666666666667, 78, 329, 82.0, 303.80000000000007, 329.0, 329.0, 0.05251664121068363, 0.014154875951317075, 0.030925326806681867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 89.5, 84, 95, 89.5, 95.0, 95.0, 95.0, 0.020770588846193788, 0.006125701007373558, 0.01283963158168034], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 942.1999999999999, 623, 1481, 863.0, 1312.2, 1369.8, 1481.0, 0.262794822941988, 314.3939705012811, 0.5189171210827147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1063.5909090909095, 125, 3550, 1014.5, 1556.1, 3259.599999999996, 3550.0, 0.08917135491820555, 0.028056044196566092, 0.040231607394737266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 81.42857142857143, 79, 85, 82.0, 85.0, 85.0, 85.0, 0.03744997753001349, 0.010093939256136447, 0.022053062940037237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 81.57142857142857, 78, 91, 80.0, 91.0, 91.0, 91.0, 0.03745017788834497, 0.01009399325896798, 0.022016608485140306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f1aaa76-2de2-4ea8-a054-800957be9028", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 152.31578947368422, 78, 855, 82.0, 330.0, 855.0, 855.0, 0.0910022702671635, 4.332921365956051, 0.05308777588056671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 126.63157894736842, 79, 471, 82.0, 242.0, 471.0, 471.0, 0.0910022702671635, 1.4315364326391615, 0.05317664528512448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 99.73684210526316, 78, 238, 84.0, 237.0, 238.0, 238.0, 0.09099834766158194, 0.0676267017289686, 0.045676904978567495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 80.85714285714285, 78, 87, 80.0, 87.0, 87.0, 87.0, 0.037449576819781935, 0.010020687547480714, 0.021357961780031885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 123.10526315789473, 79, 247, 81.0, 246.0, 247.0, 247.0, 0.0910018344053988, 0.03154381019891085, 0.05149723462188738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 81.85714285714286, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.03744897577051268, 0.027830732970078268, 0.01879763041605812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 109.14285714285714, 83, 251, 87.0, 251.0, 251.0, 251.0, 0.03905988438274223, 0.030744401184072498, 0.013884568276677903], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 499.49999999999994, 79, 938, 429.0, 906.5000000000001, 938.0, 938.0, 0.07561007882350718, 0.014207655599241378, 0.051458910253986856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a6ec0ee2-b3e7-46e8-a6b4-5c4c7f37de34", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c664db44-6715-46d7-b06b-d194434a430f", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1533.4761904761906, 896, 3670, 1252.0, 2603.4, 3569.6999999999985, 3670.0, 0.1013176114131877, 0.05243977934471628, 0.04660214353087051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 166.42857142857142, 160, 174, 166.0, 174.0, 174.0, 174.0, 0.037432554557948264, 0.05801314851900772, 0.08418669252632312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e964a66-2aee-4f63-b1ec-e137dd566cce", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/638f0d92-900b-47f2-aaf9-4b543ac98c14", 3, 0, 0.0, 301.3333333333333, 187, 405, 312.0, 405.0, 405.0, 405.0, 0.0452106817770812, 0.029066112145096152, 0.028992527051057933], "isController": false}, {"data": ["addBook", 58, 14, 24.137931034482758, 861.2413793103451, 415, 2032, 705.0, 1492.1000000000001, 1616.2499999999998, 2032.0, 0.2769011892428662, 92.49121200515847, 1.0039952619461379], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e72771e-7360-4073-b6dd-ed884301292b", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.23043885522959182, 0.8794044961734694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9c487e8-504a-4026-994e-de72b040550f", 3, 0, 0.0, 280.0, 225, 388, 227.0, 388.0, 388.0, 388.0, 0.08368434265948842, 0.03786498577366175, 0.05366476401015371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56ac3921-f109-4aaf-960c-85c4d1b3b4fe", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 154.35000000000002, 78, 345, 84.0, 325.6, 335.95, 345.0, 0.2637107620361987, 0.1959803612397922, 0.12747737032023276], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 532.6833333333333, 385, 739, 485.5, 702.2, 735.7499999999999, 739.0, 0.26342247257113505, 77.4549533851983, 0.13248298181067827], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 122.01666666666665, 78, 333, 84.0, 241.6, 248.0, 333.0, 0.2638766112965577, 0.4669379098333619, 0.12833061760320874], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 786.0500000000001, 539, 1133, 773.0, 990.1999999999999, 1049.9, 1133.0, 0.26322601023949177, 236.85122671546583, 0.1321271184209949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 93.87499999999999, 80, 236, 85.0, 133.8000000000001, 236.0, 236.0, 0.0896087458135914, 0.0669440337376928, 0.03185310886342507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, 7.954545454545454, 133.51136363636357, 79, 1016, 87.0, 241.50000000000006, 279.90000000000003, 754.1999999999965, 0.7137324557668366, 1.6216558681683435, 0.33904113364842997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 89.16666666666667, 82, 103, 87.5, 100.30000000000001, 103.0, 103.0, 0.05370064575026515, 0.04158653523433619, 0.019088901419039562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4df793c2-fe07-4d4c-b0e4-395ab93d894f", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.697240038209607, 1.302794077510917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 96.88235294117648, 80, 278, 85.0, 130.79999999999987, 278.0, 278.0, 0.10704750390408543, 0.08687155834403809, 0.03805204240340537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 240.08333333333334, 161, 489, 168.0, 465.0000000000001, 489.0, 489.0, 0.05249550507237818, 0.08135777983385173, 0.11806362127117866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=139a93dd-c8ca-473c-8d93-fffbb0bf3b31", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 279.4210526315789, 162, 1092, 171.0, 568.0, 1092.0, 1092.0, 0.09096262393657512, 5.861076808959339, 0.20335214474307844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d57e94a6-c441-41ac-a3fd-3691f6034907", 3, 0, 0.0, 592.3333333333334, 203, 938, 636.0, 938.0, 938.0, 938.0, 0.05952971524952873, 0.027594503422958626, 0.03817498015676158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 97.39999999999999, 83, 236, 86.0, 159.80000000000004, 236.0, 236.0, 0.10316439590368572, 0.08553376183811442, 0.036671718856388286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 88.28571428571429, 81, 106, 85.0, 101.5, 106.0, 106.0, 0.10657653336987387, 0.08274252346586887, 0.03788462709632235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 81.9375, 79, 87, 81.5, 85.6, 87.0, 87.0, 0.08528557341222248, 0.06338117320966925, 0.04280936009168199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/377dadc6-4d4b-4bbc-b23b-62d719eb3ae9", 3, 0, 0.0, 400.33333333333337, 182, 833, 186.0, 833.0, 833.0, 833.0, 0.023237800154918668, 0.02330587964756003, 0.014901844500387297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 130.9375, 78, 246, 82.0, 245.3, 246.0, 246.0, 0.08528966502484062, 0.03883428351350775, 0.04774638718309559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 188.625, 78, 702, 82.5, 698.5, 702.0, 702.0, 0.08528830111034706, 9.612934787099078, 0.04922400972286633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 163.00000000000003, 77, 630, 81.0, 460.60000000000014, 630.0, 630.0, 0.08528921038182913, 3.154847059121414, 0.049307824751994966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ebab8ae-bb55-404e-aa57-4c88dbc118c8", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 21.428571428571427, 0.44742729306487694], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.22371364653243847], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.5714285714285716, 0.07457121551081283], "isController": false}, {"data": ["401/Unauthorized", 18, 64.28571428571429, 1.342281879194631], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 28, "401/Unauthorized", 18, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
