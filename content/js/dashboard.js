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

    var data = {"OkPercent": 97.29729729729729, "KoPercent": 2.7027027027027026};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7413572343149808, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c58b2a04-091f-463b-8985-bc077688b98c"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d200773-88c2-4212-a1c7-7a6cfb9ce772"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/31486f34-df8d-4b01-a17d-8d301ca96b1f"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7ce00f4-b294-4040-94eb-c50f49e2e73d"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30d973b8-4a2d-4888-b90f-9839f162742c"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4971245c-8fdb-4f96-8e87-550deb8a2a87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ceb12fe9-e8ab-44c5-b77c-5c4f7708cac5"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7ce00f4-b294-4040-94eb-c50f49e2e73d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74029c00-c43e-404f-b410-45d42a7b7734"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/242041c3-b945-4ccd-bd85-6904ae3a0a67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c5b397a-64a5-4b7a-ac9e-f1f1f729343e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31486f34-df8d-4b01-a17d-8d301ca96b1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f565578-ddfd-41f8-aaf2-a6dc48a9e58b"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08823529411764706, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be1a98c4-5cf6-4ccd-8cb4-15a803fc62e3"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e2bd8d7-572d-4a97-a5c7-3e87526b383f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d200773-88c2-4212-a1c7-7a6cfb9ce772"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c58b2a04-091f-463b-8985-bc077688b98c"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bf04c6f-afc6-40d8-8880-f398f45ca654"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9364161849710982, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2bf04c6f-afc6-40d8-8880-f398f45ca654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=242041c3-b945-4ccd-bd85-6904ae3a0a67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb01a273-1678-4104-899e-2e59bcad5385"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74029c00-c43e-404f-b410-45d42a7b7734"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4971245c-8fdb-4f96-8e87-550deb8a2a87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e2bd8d7-572d-4a97-a5c7-3e87526b383f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f565578-ddfd-41f8-aaf2-a6dc48a9e58b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30d973b8-4a2d-4888-b90f-9839f162742c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be1a98c4-5cf6-4ccd-8cb4-15a803fc62e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 36, 2.7027027027027026, 413.98123123123116, 124, 2245, 134.0, 1128.7, 1489.35, 1809.0300000000007, 5.30675176592922, 756.4963441069458, 3.8768637562698953], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c58b2a04-091f-463b-8985-bc077688b98c", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2079.9454545454546, 1515, 3260, 2029.0, 2527.2, 2672.6, 3260.0, 0.25479241367169764, 306.6004427162956, 1.2528123074580055], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4d200773-88c2-4212-a1c7-7a6cfb9ce772", 3, 0, 0.0, 347.3333333333333, 242, 523, 277.0, 523.0, 523.0, 523.0, 0.06918819188191881, 0.03252205373616236, 0.044368729820110704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31486f34-df8d-4b01-a17d-8d301ca96b1f", 3, 0, 0.0, 575.0, 325, 842, 558.0, 842.0, 842.0, 842.0, 0.019980552262464535, 0.023616336349286695, 0.012813049465187219], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 595.6470588235295, 128, 1866, 499.0, 1202.7999999999995, 1866.0, 1866.0, 0.1065810674407378, 0.022120714422299268, 0.0712418026620189], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 595.6470588235295, 128, 1866, 499.0, 1202.7999999999995, 1866.0, 1866.0, 0.10572928327984675, 0.021943928107197055, 0.07067244601587183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 160.0666666666667, 124, 380, 127.0, 378.2, 380.0, 380.0, 0.08818756908026244, 0.0324273040472215, 0.04980071446628883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 143.73333333333332, 126, 376, 127.0, 227.80000000000007, 376.0, 376.0, 0.08818653215280962, 0.06553706149246888, 0.04426550539701577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 251.6, 125, 1006, 128.0, 628.6000000000003, 1006.0, 1006.0, 0.08805762490974094, 1.7482763637190846, 0.05134974910915036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 285.73333333333335, 124, 1503, 127.0, 834.6000000000004, 1503.0, 1503.0, 0.08805762490974094, 5.304445708438269, 0.05126375533482445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7ce00f4-b294-4040-94eb-c50f49e2e73d", 3, 0, 0.0, 608.0, 243, 1152, 429.0, 1152.0, 1152.0, 1152.0, 0.03543753543753544, 0.029542815187346434, 0.02272524245180495], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 269.94117647058823, 125, 997, 228.0, 473.7999999999995, 997.0, 997.0, 0.1076767164935394, 0.19024659749493286, 0.06958657287180137], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 129.0769230769231, 126, 141, 128.0, 138.2, 141.0, 141.0, 0.0767972022188484, 0.05707292078959339, 0.03854859564500789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 940.8888888888888, 748, 1135, 996.0, 1135.0, 1135.0, 1135.0, 0.04399708641516628, 12.936604246818767, 0.02509208834614952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 126.61538461538463, 125, 129, 126.0, 128.6, 129.0, 129.0, 0.07679810958499482, 0.020549494166297443, 0.04379892187269236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1329.111111111111, 1010, 1511, 1375.0, 1511.0, 1511.0, 1511.0, 0.043923650933865625, 39.52257831983494, 0.025007312982855134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 266.55555555555554, 127, 379, 375.0, 379.0, 379.0, 379.0, 0.0442149633261443, 0.07823975932321629, 0.024482308794847484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 144.75000000000003, 126, 379, 128.0, 208.90000000000018, 379.0, 379.0, 0.10988105375930554, 0.08165965030354641, 0.05515513831277642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 150.3125, 125, 503, 127.0, 241.90000000000026, 503.0, 503.0, 0.1098818083798614, 0.03971680110019161, 0.06209019665409894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 236.25, 125, 1377, 127.0, 677.7000000000007, 1377.0, 1377.0, 0.10988331765206821, 6.207341074813369, 0.06400917869087762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 259.99999999999994, 126, 1003, 127.5, 566.9000000000004, 1003.0, 1003.0, 0.10987954454928785, 2.047029625413765, 0.06411428502753856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 184.33333333333334, 125, 393, 128.0, 393.0, 393.0, 393.0, 0.0442149633261443, 0.032858971768745915, 0.024827738195832987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 872.5625000000001, 126, 1614, 1249.5, 1562.9, 1614.0, 1614.0, 0.08830850576488965, 44.70674698543738, 0.04764692327646634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 126.92307692307692, 125, 130, 127.0, 129.2, 130.0, 130.0, 0.07679765589924147, 0.02069936819159243, 0.045148621925140006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 603.5624999999999, 125, 1008, 872.0, 1006.6, 1008.0, 1008.0, 0.08830850576488965, 14.616081789544273, 0.047733162051627365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 126.6923076923077, 126, 128, 127.0, 127.6, 128.0, 128.0, 0.0767972022188484, 0.020699245910548985, 0.04522335247848202], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 434.75, 128, 1295, 443.5, 851.2000000000005, 1295.0, 1295.0, 0.1069354310500391, 0.022373941506319217, 0.07182113545377382], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 452.6249999999999, 254, 1504, 259.5, 1069.3000000000004, 1504.0, 1504.0, 0.10978228800010978, 8.36811871968122, 0.2451473870100108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30d973b8-4a2d-4888-b90f-9839f162742c", 3, 0, 0.0, 441.33333333333337, 218, 861, 245.0, 861.0, 861.0, 861.0, 0.03861550541260667, 0.0321921579953404, 0.024763198457954154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 399.125, 180, 1003, 339.0, 790.5, 971.25, 1003.0, 0.10044446676543706, 0.06169879843306632, 0.04541580870351305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 127.375, 126, 129, 127.0, 128.3, 129.0, 129.0, 0.08830753097662611, 0.06562698346993405, 0.044326241134751775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 173.87500000000003, 124, 383, 127.0, 381.6, 383.0, 383.0, 0.0883099679876366, 0.09823837137101225, 0.04619240879236119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4971245c-8fdb-4f96-8e87-550deb8a2a87", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ceb12fe9-e8ab-44c5-b77c-5c4f7708cac5", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.769484186746988, 1.4377823795180724], "isController": false}, {"data": ["login", 24, 0, 0.0, 2228.875, 1264, 3627, 1953.0, 3026.5, 3477.5, 3627.0, 0.10115570391725463, 45.516201804839035, 0.21552388381002957], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7ce00f4-b294-4040-94eb-c50f49e2e73d", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 131.30769230769232, 128, 158, 129.0, 146.79999999999998, 158.0, 158.0, 0.0776587673761492, 0.06287023257307392, 0.027605264965740537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74029c00-c43e-404f-b410-45d42a7b7734", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/242041c3-b945-4ccd-bd85-6904ae3a0a67", 3, 0, 0.0, 846.3333333333334, 225, 1523, 791.0, 1523.0, 1523.0, 1523.0, 0.03327491736728854, 0.02773992948490428, 0.021338407296080216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c5b397a-64a5-4b7a-ac9e-f1f1f729343e", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1000.8749999999999, 254, 1744, 1377.5, 1692.2, 1744.0, 1744.0, 0.08824518925835434, 59.4440417348039, 0.1857651719678126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31486f34-df8d-4b01-a17d-8d301ca96b1f", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f565578-ddfd-41f8-aaf2-a6dc48a9e58b", 3, 0, 0.0, 337.6666666666667, 218, 452, 343.0, 452.0, 452.0, 452.0, 0.019481404998928524, 0.02685668950861403, 0.012492958283818096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 514.2, 254, 1631, 504.0, 1103.6000000000004, 1631.0, 1631.0, 0.08799202205666685, 7.145215708775738, 0.1963952143339004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 861.1176470588235, 125, 1883, 1139.0, 1687.7999999999997, 1883.0, 1883.0, 0.08291509981514811, 52.525591654107465, 0.12483466515712412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be1a98c4-5cf6-4ccd-8cb4-15a803fc62e3", 1, 0, 0.0, 1295.0, 1295, 1295, 1295.0, 1295.0, 1295.0, 1295.0, 0.7722007722007722, 0.13950892857142858, 0.5323962355212356], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 689.3076923076924, 172, 1311, 610.5, 1156.0, 1281.2499999999998, 1311.0, 0.10400582432616226, 0.032314309601337673, 0.04692450277215524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e2bd8d7-572d-4a97-a5c7-3e87526b383f", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 144.58823529411765, 127, 381, 129.0, 188.99999999999983, 381.0, 381.0, 0.09028769909765412, 0.07009640701429201, 0.03209445553861923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 257.38461538461536, 254, 269, 256.0, 265.8, 269.0, 269.0, 0.07673917534901567, 0.11893073367078894, 0.17258820393435848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 604.8947368421053, 254, 1761, 504.0, 1742.0, 1761.0, 1761.0, 0.09217215818682811, 17.5313377757888, 0.20357369497564715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 127.66666666666666, 127, 128, 128.0, 128.0, 128.0, 128.0, 0.028043411200538434, 0.020840855394150145, 0.014076477887770267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 168.5, 125, 380, 126.0, 380.0, 380.0, 380.0, 0.02804367334729285, 0.014523920669122047, 0.015601119059415197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 294.8333333333333, 126, 1125, 127.0, 1125.0, 1125.0, 1125.0, 0.02804249372549203, 4.211746131596412, 0.016084268862082342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 285.83333333333337, 125, 1082, 127.0, 1082.0, 1082.0, 1082.0, 0.02804406657661405, 1.3806134142949955, 0.016112557782462174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 129.0, 128, 130, 129.0, 130.0, 130.0, 130.0, 0.026548966249626653, 0.007829870905651612, 0.016411616832044604], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1443.490909090909, 998, 2245, 1373.0, 2014.0, 2156.0, 2245.0, 0.2504850301037464, 299.6671786903276, 0.4946100887400147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 689.3076923076924, 172, 1311, 610.5, 1156.0, 1281.2499999999998, 1311.0, 0.10592400360141611, 0.0329102823689496, 0.04778993131235766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 147.5, 125, 377, 126.0, 303.2000000000003, 377.0, 377.0, 0.05999250093738283, 0.016169853768278966, 0.035327615298087735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 189.66666666666669, 125, 378, 127.5, 377.7, 378.0, 378.0, 0.059992800863896335, 0.016169934607847058, 0.03526920519537655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 156.64705882352945, 126, 378, 127.0, 374.8, 378.0, 378.0, 0.0874895141244101, 0.023581158103844906, 0.05143426513954578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 157.11764705882354, 126, 378, 127.0, 375.6, 378.0, 378.0, 0.08748681264956384, 0.023580429971952758, 0.05151811330828809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 148.25, 125, 377, 127.0, 304.40000000000026, 377.0, 377.0, 0.059989801733705266, 0.016051958667026606, 0.034212933801253786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 143.0, 125, 381, 128.0, 184.99999999999983, 381.0, 381.0, 0.0874904146531005, 0.0650197319834077, 0.04391608704266959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 149.0, 127, 375, 127.5, 303.3000000000003, 375.0, 375.0, 0.05999130126131711, 0.0445833791600218, 0.030112821140934564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 141.47058823529412, 125, 376, 126.0, 182.39999999999984, 376.0, 376.0, 0.08749176548089592, 0.023410882560317852, 0.04989764750082345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 159.33333333333334, 128, 447, 129.0, 362.1000000000003, 447.0, 447.0, 0.05782324398035937, 0.045513217429853176, 0.02055435625864337], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 486.87499999999994, 126, 1050, 480.0, 917.7000000000002, 1050.0, 1050.0, 0.1061986844637962, 0.021493825542111097, 0.07225970058608398], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d200773-88c2-4212-a1c7-7a6cfb9ce772", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.5474668560606061, 2.089251893939394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 947.7083333333333, 736, 1371, 855.5, 1290.0, 1367.75, 1371.0, 0.10266018196517253, 0.053134664493692814, 0.04721967354062135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c58b2a04-091f-463b-8985-bc077688b98c", 3, 0, 0.0, 493.0, 338, 705, 436.0, 705.0, 705.0, 705.0, 0.04225292601512655, 0.02716456018225095, 0.027095789143814875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 340.66666666666663, 254, 753, 257.5, 679.2000000000003, 753.0, 753.0, 0.059950540803836834, 0.09291162915594635, 0.13483017135862913], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1219.1016949152545, 638, 3048, 986.0, 2266.0, 2462.0, 3048.0, 0.27209378473231044, 83.86828387365856, 0.9886053161476133], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 227.21818181818182, 127, 527, 128.0, 510.4, 518.2, 527.0, 0.2514895037426211, 0.18689796127747524, 0.12156963315683343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bf04c6f-afc6-40d8-8880-f398f45ca654", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 837.0363636363635, 625, 1259, 754.0, 1123.4, 1146.4, 1259.0, 0.25138834929268455, 73.91652157083438, 0.1264306639509107], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 187.72727272727275, 125, 383, 129.0, 378.4, 382.0, 383.0, 0.2519514787261333, 0.44583601508960313, 0.12253109023985781], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1214.8545454545454, 870, 2108, 1129.0, 1616.8, 1625.2, 2108.0, 0.2511002757537574, 225.94046951043435, 0.12604056810296024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 142.94736842105263, 126, 380, 129.0, 139.0, 380.0, 380.0, 0.08838483688345762, 0.06602968771078621, 0.031418047485916575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, 5.780346820809249, 185.514450867052, 126, 1415, 130.0, 276.79999999999995, 376.0, 1161.1799999999969, 0.7222055238286077, 1.5925929839611928, 0.34700533878953344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 180.5, 129, 415, 130.5, 415.0, 415.0, 415.0, 0.02720274203639727, 0.02106618597154593, 0.009669724708250591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bf04c6f-afc6-40d8-8880-f398f45ca654", 3, 0, 0.0, 726.3333333333334, 228, 1050, 901.0, 1050.0, 1050.0, 1050.0, 0.018933178502006917, 0.02237837602239164, 0.012141393765935425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 133.79999999999998, 127, 182, 129.0, 157.4, 182.0, 182.0, 0.08318268025686812, 0.067504694622517, 0.02956884337255859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=242041c3-b945-4ccd-bd85-6904ae3a0a67", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb01a273-1678-4104-899e-2e59bcad5385", 2, 0, 0.0, 231.0, 226, 236, 231.0, 236.0, 236.0, 236.0, 0.042000042000041996, 0.03539651977151977, 0.02610647141897142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74029c00-c43e-404f-b410-45d42a7b7734", 3, 0, 0.0, 326.6666666666667, 216, 442, 322.0, 442.0, 442.0, 442.0, 0.06740815638692282, 0.03129037467700258, 0.0432272357038535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 423.83333333333337, 255, 1253, 257.5, 1253.0, 1253.0, 1253.0, 0.028025334902752087, 5.624202117255665, 0.06183454426134559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 315.5882352941176, 252, 757, 256.0, 556.9999999999998, 757.0, 757.0, 0.08742922090278385, 0.13549821637960738, 0.1966303669327258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4971245c-8fdb-4f96-8e87-550deb8a2a87", 3, 0, 0.0, 321.6666666666667, 222, 508, 235.0, 508.0, 508.0, 508.0, 0.04661063033109085, 0.02899508937588366, 0.02989028051831021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e2bd8d7-572d-4a97-a5c7-3e87526b383f", 3, 0, 0.0, 323.6666666666667, 250, 440, 281.0, 440.0, 440.0, 440.0, 0.017781571179629432, 0.024513331362542527, 0.011402895580686842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 161.93750000000003, 127, 381, 129.0, 378.9, 381.0, 381.0, 0.10409889394925179, 0.08630855562784646, 0.0370039037085231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 159.99999999999997, 127, 379, 128.0, 379.0, 379.0, 379.0, 0.08705351070486139, 0.06758548926793438, 0.0309448026333687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f565578-ddfd-41f8-aaf2-a6dc48a9e58b", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30d973b8-4a2d-4888-b90f-9839f162742c", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be1a98c4-5cf6-4ccd-8cb4-15a803fc62e3", 3, 0, 0.0, 590.0, 248, 997, 525.0, 997.0, 997.0, 997.0, 0.01834884830395479, 0.02529536867423455, 0.011766676809502257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 154.31578947368422, 125, 379, 127.0, 377.0, 379.0, 379.0, 0.09223345744396817, 0.06854459093248026, 0.04629687219355434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 167.52631578947367, 125, 379, 127.0, 378.0, 379.0, 379.0, 0.09223077109778889, 0.046551509672095336, 0.05137731790490522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 422.1578947368421, 125, 1614, 128.0, 1489.0, 1614.0, 1614.0, 0.09223480067574129, 13.125098416656147, 0.052972433323948034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 344.3157894736842, 125, 1009, 129.0, 998.0, 1009.0, 1009.0, 0.09223524842835991, 4.303075848321561, 0.053062763962717543], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.77777777777778, 0.7507507507507507], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.3003003003003003], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.11111111111111, 0.3003003003003003], "isController": false}, {"data": ["401/Unauthorized", 18, 50.0, 1.3513513513513513], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 36, "401/Unauthorized", 18, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
