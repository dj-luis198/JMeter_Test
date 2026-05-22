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

    var data = {"OkPercent": 97.54035357417371, "KoPercent": 2.4596464258262873};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7864617396991498, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.42105263157894735, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d37665e7-742f-455e-85f4-68f12a95e645"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d6410711-bfa4-48f1-b25b-069c1bf86e68"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7318df58-0e78-4d10-a0ff-16788152f1b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66c8dbd6-b6df-4dd4-a211-6af011ee0225"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f1ddca5-4b41-4013-9d79-97c1baa07eff"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/df5473e5-3c82-4536-8a75-4e50cfb4f6b3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b79f84b-38bf-4e5d-b2db-4e79cef544e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ca0c663-c8a3-48cd-96ad-8fd4c284ab12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=baf40676-70d2-4bac-876d-661db82a7583"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/467c7e73-6464-4d6c-90db-c70cab44d627"], "isController": false}, {"data": [0.72, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ca0c663-c8a3-48cd-96ad-8fd4c284ab12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=581ce5f8-2dbe-42f2-8e66-2e458c02fff6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=948d6607-c43c-4a4b-9343-d4e7b1a252d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66c8dbd6-b6df-4dd4-a211-6af011ee0225"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83e22ef4-4bc0-4b5c-a2aa-b2cfa2ff1924"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6246a7b7-5e15-484e-b096-378dec294dae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2605bedc-9a98-448b-b399-12aefca65fbe"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/333af8cb-e123-4d03-8389-df35b8e0eb34"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7318df58-0e78-4d10-a0ff-16788152f1b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6246a7b7-5e15-484e-b096-378dec294dae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/baf40676-70d2-4bac-876d-661db82a7583"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/948d6607-c43c-4a4b-9343-d4e7b1a252d4"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df5473e5-3c82-4536-8a75-4e50cfb4f6b3"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d37665e7-742f-455e-85f4-68f12a95e645"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b79f84b-38bf-4e5d-b2db-4e79cef544e0"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08096af1-99df-4095-9694-d404dbbcef40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83e22ef4-4bc0-4b5c-a2aa-b2cfa2ff1924"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/581ce5f8-2dbe-42f2-8e66-2e458c02fff6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=467c7e73-6464-4d6c-90db-c70cab44d627"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2605bedc-9a98-448b-b399-12aefca65fbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 32, 2.4596464258262873, 335.92159877017707, 77, 4627, 104.0, 886.7999999999995, 1112.6999999999982, 2002.2800000000007, 5.193426184288788, 767.4625945949048, 3.786782298739766], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1340.1228070175432, 961, 1956, 1346.0, 1584.6, 1674.4999999999989, 1956.0, 0.24185643910945914, 291.0348473824875, 1.18920622159778], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d37665e7-742f-455e-85f4-68f12a95e645", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6410711-bfa4-48f1-b25b-069c1bf86e68", 1, 0, 0.0, 1028.0, 1028, 1028, 1028.0, 1028.0, 1028.0, 1028.0, 0.9727626459143969, 0.31063807149805445, 0.5804277115758755], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 560.4117647058824, 82, 1184, 421.0, 1152.0, 1184.0, 1184.0, 0.09888665262863991, 0.020523752064985985, 0.06609863798178159], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 560.4117647058824, 82, 1184, 421.0, 1152.0, 1184.0, 1184.0, 0.09520556000470427, 0.019759747719266803, 0.06363809146454152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7318df58-0e78-4d10-a0ff-16788152f1b8", 3, 0, 0.0, 555.0, 186, 981, 498.0, 981.0, 981.0, 981.0, 0.041863775275254325, 0.026914373752808363, 0.02684623609773796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 107.94117647058825, 78, 245, 80.0, 239.4, 245.0, 245.0, 0.085342222311469, 0.04545571491681643, 0.04740689853813793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 89.5294117647059, 78, 235, 81.0, 113.39999999999989, 235.0, 235.0, 0.085342222311469, 0.06342327263576944, 0.042837795183686585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66c8dbd6-b6df-4dd4-a211-6af011ee0225", 3, 0, 0.0, 264.0, 185, 418, 189.0, 418.0, 418.0, 418.0, 0.08499065102838688, 0.0394520404838801, 0.054502468270156944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 175.58823529411765, 77, 633, 80.0, 496.9999999999999, 633.0, 633.0, 0.08534265074273206, 4.447220825991355, 0.048961227766984444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 243.94117647058823, 78, 1094, 80.0, 965.1999999999999, 1094.0, 1094.0, 0.08534265074273206, 13.570378624866338, 0.048877885334618495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f1ddca5-4b41-4013-9d79-97c1baa07eff", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df5473e5-3c82-4536-8a75-4e50cfb4f6b3", 3, 0, 0.0, 842.3333333333334, 182, 1967, 378.0, 1967.0, 1967.0, 1967.0, 0.07541478129713425, 0.03412322461035696, 0.04836169243338361], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 192.00000000000003, 79, 482, 182.5, 425.30000000000007, 482.0, 482.0, 0.09635819553219166, 0.1504969473188332, 0.06226792898133328], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 82.25, 79, 100, 81.0, 85.7, 99.29999999999998, 100.0, 0.10691756655618517, 0.0794572931145087, 0.05366760665027264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 96.95, 78, 240, 80.5, 223.20000000000033, 239.9, 240.0, 0.10691470879106194, 0.02860803731323337, 0.06097479485740251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 596.375, 465, 707, 626.5, 707.0, 707.0, 707.0, 0.05618253706291742, 16.519531332298637, 0.03204160316869509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b79f84b-38bf-4e5d-b2db-4e79cef544e0", 1, 0, 0.0, 1334.0, 1334, 1334, 1334.0, 1334.0, 1334.0, 1334.0, 0.7496251874062968, 0.13543033170914542, 0.516831428035982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 771.375, 539, 1010, 737.0, 1010.0, 1010.0, 1010.0, 0.056156113996911415, 50.52937008634002, 0.03197169380878843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 210.375, 83, 323, 236.5, 323.0, 323.0, 323.0, 0.05633644122700769, 0.09968909326497846, 0.03119410368722008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ca0c663-c8a3-48cd-96ad-8fd4c284ab12", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 87.22222222222223, 80, 138, 81.0, 138.0, 138.0, 138.0, 0.06551028875479499, 0.04868489232656151, 0.0328830941601217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 99.22222222222223, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.06553795740032768, 0.028473739304569454, 0.03676554250864737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 157.33333333333334, 78, 735, 80.0, 735.0, 735.0, 735.0, 0.0655384346508986, 6.56810177254158, 0.03790363028312604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 179.77777777777777, 79, 777, 81.0, 777.0, 777.0, 777.0, 0.06553795740032768, 2.156850195703623, 0.037967356180593485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=baf40676-70d2-4bac-876d-661db82a7583", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 130.87499999999997, 79, 329, 81.0, 329.0, 329.0, 329.0, 0.05640078397089719, 0.04191503574399684, 0.03167036209303309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 456.9999999999999, 78, 1017, 84.5, 973.5, 1012.05, 1017.0, 0.09754540295119182, 39.91048858330821, 0.053535660604072076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 88.75, 78, 240, 80.0, 88.9, 232.4499999999999, 240.0, 0.10691528033186504, 0.028817009151947997, 0.06285449097635035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 347.54545454545456, 78, 708, 236.0, 706.5, 708.0, 708.0, 0.09747841074743788, 13.042462509581684, 0.05359408715899172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 120.5, 77, 249, 81.5, 239.8, 248.54999999999998, 249.0, 0.1069158518787788, 0.028817163201702103, 0.06295923699502307], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 479.5882352941176, 82, 1334, 392.0, 1323.6, 1334.0, 1334.0, 0.0955759575867633, 0.01983662309058914, 0.06429196135920257], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 268.1111111111111, 161, 859, 163.0, 859.0, 859.0, 859.0, 0.06547168713263109, 8.793182896976663, 0.14538607608173776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/467c7e73-6464-4d6c-90db-c70cab44d627", 3, 0, 0.0, 724.0, 409, 1281, 482.0, 1281.0, 1281.0, 1281.0, 0.02673296441842436, 0.022286172485541923, 0.017143209604263018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 694.6800000000001, 147, 1875, 455.0, 1492.8, 1764.2999999999997, 1875.0, 0.11220926579233206, 0.06892541814782897, 0.05073524420102515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 95.86363636363636, 77, 237, 81.0, 192.6999999999999, 236.7, 237.0, 0.0975445379492591, 0.07249159509705681, 0.048962785650311695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 116.54545454545453, 78, 243, 81.0, 241.5, 243.0, 243.0, 0.09754626796846595, 0.09269666657798825, 0.051908054883077495], "isController": false}, {"data": ["login", 25, 0, 0.0, 3158.88, 1687, 7473, 2597.0, 5594.000000000002, 7093.799999999999, 7473.0, 0.11300660862647247, 43.414905388042094, 0.23046726678826177], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 84.3, 81, 103, 83.0, 87.80000000000001, 102.24999999999999, 103.0, 0.11057298923019085, 0.08951660944514474, 0.0393052422654194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ca0c663-c8a3-48cd-96ad-8fd4c284ab12", 3, 0, 0.0, 292.3333333333333, 171, 520, 186.0, 520.0, 520.0, 520.0, 0.021186590300778962, 0.025041832481161593, 0.013586452764496925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=581ce5f8-2dbe-42f2-8e66-2e458c02fff6", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=948d6607-c43c-4a4b-9343-d4e7b1a252d4", 1, 0, 0.0, 1321.0, 1321, 1321, 1321.0, 1321.0, 1321.0, 1321.0, 0.757002271006813, 0.13676310560181681, 0.5219175813777441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66c8dbd6-b6df-4dd4-a211-6af011ee0225", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.5735367063492064, 2.1887400793650795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83e22ef4-4bc0-4b5c-a2aa-b2cfa2ff1924", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 575.6363636363637, 160, 1100, 472.0, 1055.7, 1094.75, 1100.0, 0.09744257531868152, 53.07109861520813, 0.2078180918750609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6246a7b7-5e15-484e-b096-378dec294dae", 3, 0, 0.0, 675.6666666666667, 241, 1367, 419.0, 1367.0, 1367.0, 1367.0, 0.03592943459046433, 0.02995289127154269, 0.023040685593494377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2605bedc-9a98-448b-b399-12aefca65fbe", 3, 0, 0.0, 350.6666666666667, 189, 464, 399.0, 464.0, 464.0, 464.0, 0.021503680713348766, 0.025416622613987427, 0.013789795249120142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 353.11764705882354, 158, 1175, 162.0, 1045.3999999999999, 1175.0, 1175.0, 0.08530710558008832, 18.118929317417702, 0.18800592288488557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 507.74999999999994, 79, 1340, 397.5, 1218.2, 1340.0, 1340.0, 0.10745394591036997, 64.29051433502796, 0.1565178478485705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/333af8cb-e123-4d03-8389-df35b8e0eb34", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 1070.9615384615383, 232, 2512, 922.0, 1981.3000000000004, 2493.1, 2512.0, 0.11228142908348125, 0.03518916181913189, 0.050658222887273764], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7318df58-0e78-4d10-a0ff-16788152f1b8", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.2211310434516524, 0.8438838739290087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6246a7b7-5e15-484e-b096-378dec294dae", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 212.15, 162, 329, 165.5, 320.0, 328.55, 329.0, 0.10686672116869447, 0.16562254540499816, 0.24034576059717125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 84.875, 80, 91, 83.0, 90.3, 91.0, 91.0, 0.10085983005118636, 0.07830426258856754, 0.035852517713507656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 293.0, 162, 474, 317.0, 429.90000000000015, 474.0, 474.0, 0.11408687715695502, 0.17681237700008556, 0.2565840606371752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 101.50000000000001, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.042418040392578966, 0.03152356322143808, 0.02129186793143124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 81.125, 78, 93, 80.0, 93.0, 93.0, 93.0, 0.042418940056735334, 0.011350380444868633, 0.02419205175110687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/baf40676-70d2-4bac-876d-661db82a7583", 3, 0, 0.0, 1257.0, 173, 3096, 502.0, 3096.0, 3096.0, 3096.0, 0.05367206369084891, 0.024914180606494318, 0.03441860855174881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 99.25, 78, 237, 79.5, 237.0, 237.0, 237.0, 0.04241871513711849, 0.01143316931430147, 0.024937564953657555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 99.875, 79, 238, 80.0, 238.0, 238.0, 238.0, 0.04241849021988685, 0.011433108692078876, 0.024978857033781023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 86.25, 82, 93, 85.0, 93.0, 93.0, 93.0, 0.03430767119527926, 0.010118082715795252, 0.02120776940098806], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 928.1228070175441, 630, 1628, 878.0, 1250.4, 1339.199999999999, 1628.0, 0.2422058579823827, 289.7624105272439, 0.4782619578519315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 1070.9615384615383, 232, 2512, 922.0, 1981.3000000000004, 2493.1, 2512.0, 0.11257116879180828, 0.0352799666616154, 0.05078894529474163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 110.4, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.04181511030826099, 0.011270478950273471, 0.02462354640222791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 145.4, 80, 238, 92.0, 238.0, 238.0, 238.0, 0.04181511030826099, 0.011270478950273471, 0.024582711333567497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/948d6607-c43c-4a4b-9343-d4e7b1a252d4", 3, 0, 0.0, 331.0, 260, 437, 296.0, 437.0, 437.0, 437.0, 0.029384684702333144, 0.02966207918682783, 0.018843694291535252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 157.87499999999997, 78, 701, 81.5, 376.20000000000033, 701.0, 701.0, 0.09719235582121466, 5.490424891949435, 0.05661644555405717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 145.25, 79, 635, 81.5, 356.4000000000003, 635.0, 635.0, 0.09719176542767413, 1.81065933602838, 0.056711015471714164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 91.5625, 79, 237, 81.0, 136.2000000000001, 237.0, 237.0, 0.09728277061330706, 0.0722970590202409, 0.04883139071800765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 113.0, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.04187008549871459, 0.01120351897133574, 0.023879033135985665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 109.87499999999999, 78, 242, 80.5, 239.2, 242.0, 242.0, 0.0972839536198751, 0.03516330403667605, 0.05497160904619163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 81.8, 81, 84, 81.0, 84.0, 84.0, 84.0, 0.04186938426883494, 0.03111582170760097, 0.02101646827556754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df5473e5-3c82-4536-8a75-4e50cfb4f6b3", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 902.7499999999999, 80, 3096, 523.5, 2460.4000000000005, 3096.0, 3096.0, 0.10602556541446057, 0.020882842992704116, 0.07214837822301153], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 121.4, 85, 239, 91.0, 239.0, 239.0, 239.0, 0.041417814630428845, 0.0326003501876227, 0.014722738794410252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1892.52, 720, 4627, 1526.0, 3493.4000000000015, 4391.499999999999, 4627.0, 0.11283676131414207, 0.05840183935204618, 0.051900502518516516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 228.0, 164, 321, 173.0, 321.0, 321.0, 321.0, 0.041786803727382894, 0.06476138429234048, 0.09397950096109649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d37665e7-742f-455e-85f4-68f12a95e645", 3, 0, 0.0, 367.0, 243, 565, 293.0, 565.0, 565.0, 565.0, 0.025130047998391677, 0.025203671185886962, 0.016115297707301954], "isController": false}, {"data": ["addBook", 52, 8, 15.384615384615385, 965.7307692307694, 410, 2356, 836.5, 1656.0, 1904.099999999999, 2356.0, 0.2478905467893407, 86.57862256876578, 0.8982354557968251], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 143.40350877192984, 79, 332, 82.0, 322.0, 326.0, 332.0, 0.24310768390883034, 0.18066889399865224, 0.11751787454577249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b79f84b-38bf-4e5d-b2db-4e79cef544e0", 3, 0, 0.0, 519.6666666666666, 183, 923, 453.0, 923.0, 923.0, 923.0, 0.05167602576911152, 0.03322270536913908, 0.0331385972542805], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 512.9473684210526, 388, 726, 472.0, 643.0000000000001, 714.9, 726.0, 0.24283839743698984, 71.4025518401399, 0.1221306393359861], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 127.91228070175437, 77, 258, 85.0, 240.4, 245.1, 258.0, 0.24341290515437503, 0.4307267423239527, 0.11837854176453005], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 782.1754385964913, 546, 1309, 778.0, 961.4000000000002, 1161.3, 1309.0, 0.24258932181388718, 218.28229819467794, 0.12176846817611134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 147.41666666666669, 81, 592, 87.0, 491.80000000000035, 592.0, 592.0, 0.11013316935728118, 0.08227722124835947, 0.03914890004497104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 8, 4.968944099378882, 162.06832298136644, 80, 1150, 86.0, 367.8000000000004, 492.8, 1000.5799999999989, 0.6656991288024444, 1.5838579008873233, 0.3146024372961038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 158.62499999999997, 81, 336, 105.0, 336.0, 336.0, 336.0, 0.04056280897452149, 0.031412409684370646, 0.014418811002661935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 120.11764705882354, 81, 320, 83.0, 293.59999999999997, 320.0, 320.0, 0.08228739599115169, 0.06677815045766314, 0.029250597793729703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08096af1-99df-4095-9694-d404dbbcef40", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 202.375, 160, 476, 163.0, 476.0, 476.0, 476.0, 0.04239983040067839, 0.06571145590417637, 0.09535821231715073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83e22ef4-4bc0-4b5c-a2aa-b2cfa2ff1924", 3, 0, 0.0, 310.3333333333333, 181, 527, 223.0, 527.0, 527.0, 527.0, 0.021897490547583248, 0.030187458486007502, 0.014042336060787433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/581ce5f8-2dbe-42f2-8e66-2e458c02fff6", 3, 0, 0.0, 927.6666666666666, 182, 2188, 413.0, 2188.0, 2188.0, 2188.0, 0.02696168744214471, 0.02704067676082287, 0.017289884199552435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=467c7e73-6464-4d6c-90db-c70cab44d627", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 270.6875, 160, 783, 168.0, 566.0000000000002, 783.0, 783.0, 0.09714337755380832, 7.40472193656841, 0.21692429267478217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 120.44444444444444, 82, 247, 86.0, 247.0, 247.0, 247.0, 0.06910266352377516, 0.05729312630047373, 0.024563837424466946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 84.77272727272728, 80, 101, 83.0, 91.7, 99.64999999999998, 101.0, 0.09728271684096486, 0.07552710926617878, 0.03458096575206173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2605bedc-9a98-448b-b399-12aefca65fbe", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 94.0, 79, 234, 80.0, 189.60000000000016, 234.0, 234.0, 0.11417588795539528, 0.08485141673247638, 0.057310943758860526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 158.66666666666669, 78, 240, 159.0, 239.7, 240.0, 240.0, 0.1141791470817713, 0.030551842090239586, 0.0651177948200727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 144.91666666666669, 78, 238, 81.0, 237.7, 238.0, 238.0, 0.11418131993605847, 0.030775433889015755, 0.06712612754053436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 131.58333333333334, 79, 239, 80.0, 237.8, 239.0, 239.0, 0.11418349287304698, 0.030776019563438447, 0.06723891230707747], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.0, 0.6149116064565718], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 15.625, 0.3843197540353574], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.23059185242121444], "isController": false}, {"data": ["401/Unauthorized", 16, 50.0, 1.2298232129131437], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 32, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
