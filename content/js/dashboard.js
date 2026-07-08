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

    var data = {"OkPercent": 97.94117647058823, "KoPercent": 2.0588235294117645};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8061868686868687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffe29d04-8c93-4250-974f-42e77654e8c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8cadaae0-adc3-4556-9edb-21bd8f5d155e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=160bb444-f7d9-4f2e-9200-7322e97d8204"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3c56ba4-cf06-4670-959e-89763b15d863"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0cead23d-0412-497d-a6fa-e5b114fe4eb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8033cba8-7615-473b-aa87-68ddd9c2cf97"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee92387f-a8e7-4ccf-8580-884b07cecdde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b21d2eb4-083d-492f-9dde-39ea9d9abba8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ebdd17e-bb23-4601-949f-8c038e050bb5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c48a8355-8d71-487e-85e1-404d84ef60a5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e4c4cfd-12af-4dba-97f3-3a06101161ad"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f10b9d53-ea7d-497e-a890-1b0efe92e020"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/160bb444-f7d9-4f2e-9200-7322e97d8204"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e4c4cfd-12af-4dba-97f3-3a06101161ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e46f35e-fc75-411a-a412-6222d88b0209"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3c56ba4-cf06-4670-959e-89763b15d863"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c3e5499-92f4-48f9-902f-33dc4a7f6bb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b340fe93-e603-4788-94cb-cc0c824c87e4"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b21d2eb4-083d-492f-9dde-39ea9d9abba8"], "isController": false}, {"data": [0.36507936507936506, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5245b4ad-f04f-4ff2-a1ae-db4d5449f394"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289617486338798, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8033cba8-7615-473b-aa87-68ddd9c2cf97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee92387f-a8e7-4ccf-8580-884b07cecdde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f10b9d53-ea7d-497e-a890-1b0efe92e020"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c48a8355-8d71-487e-85e1-404d84ef60a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c3e5499-92f4-48f9-902f-33dc4a7f6bb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cadaae0-adc3-4556-9edb-21bd8f5d155e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0ebdd17e-bb23-4601-949f-8c038e050bb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e46f35e-fc75-411a-a412-6222d88b0209"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1360, 28, 2.0588235294117645, 307.75147058823524, 77, 2397, 93.0, 852.6000000000004, 1111.8500000000001, 1642.1700000000003, 5.319627469617496, 724.0793679984315, 3.892888286356329], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1386.3508771929824, 981, 2010, 1316.0, 1808.6, 1859.1999999999998, 2010.0, 0.24361368852494047, 293.1510888022647, 1.1978466032451907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ffe29d04-8c93-4250-974f-42e77654e8c7", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cadaae0-adc3-4556-9edb-21bd8f5d155e", 3, 0, 0.0, 399.0, 381, 423, 393.0, 423.0, 423.0, 423.0, 0.033754894459696656, 0.02743683966987713, 0.021646205105990367], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 445.2666666666667, 80, 976, 469.0, 823.0000000000001, 976.0, 976.0, 0.08285507542573699, 0.016862302459691007, 0.05552261011439524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 445.2666666666667, 80, 976, 469.0, 823.0000000000001, 976.0, 976.0, 0.08529366609235597, 0.017358593763327136, 0.057156751633373706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=160bb444-f7d9-4f2e-9200-7322e97d8204", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 125.3888888888889, 78, 244, 82.0, 242.2, 244.0, 244.0, 0.14972176704956622, 0.07754144901557938, 0.08329248043219684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 100.55555555555557, 80, 241, 83.0, 237.4, 241.0, 241.0, 0.14971803104153844, 0.11126506017833081, 0.07515143355014722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 234.22222222222223, 78, 645, 235.0, 623.4000000000001, 645.0, 645.0, 0.14971803104153844, 7.370640112163758, 0.08601963697536306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 198.72222222222226, 79, 833, 83.0, 788.9000000000001, 833.0, 833.0, 0.149716785746962, 22.486198958532608, 0.08587271369991765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3c56ba4-cf06-4670-959e-89763b15d863", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 248.26666666666668, 78, 1002, 195.0, 636.6000000000003, 1002.0, 1002.0, 0.08269976127335578, 0.16234673839033187, 0.05344795118233092], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0cead23d-0412-497d-a6fa-e5b114fe4eb8", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 83.1875, 78, 97, 81.5, 91.4, 97.0, 97.0, 0.08078400880545697, 0.06003577216889917, 0.04054978566992664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 80.875, 78, 84, 81.0, 82.6, 84.0, 84.0, 0.08079135128584485, 0.029202049701829418, 0.045652241833761695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 542.0, 461, 622, 541.5, 622.0, 622.0, 622.0, 0.09258401999814833, 27.222775958244608, 0.052801823905193966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 834.3333333333334, 693, 923, 867.5, 923.0, 923.0, 923.0, 0.09202736280253995, 82.80638281657414, 0.05239448487683672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 187.83333333333334, 80, 245, 238.5, 245.0, 245.0, 245.0, 0.0928965132842014, 0.1643832832724345, 0.05143781546107636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 83.09523809523807, 80, 91, 82.0, 89.2, 90.9, 91.0, 0.11336950360353065, 0.08425214086160822, 0.05690617661349097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 88.52380952380953, 78, 240, 81.0, 84.6, 224.49999999999977, 240.0, 0.11327899537713815, 0.03031098118489829, 0.0646044270510241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 96.95238095238096, 79, 243, 82.0, 206.8000000000001, 242.29999999999998, 243.0, 0.11327716224526123, 0.03053173513641807, 0.06659458171059303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 95.80952380952381, 78, 239, 81.0, 206.8000000000001, 238.7, 239.0, 0.113376848447547, 0.0305586036831279, 0.06676390587292075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 107.0, 80, 233, 82.0, 233.0, 233.0, 233.0, 0.0931301027535467, 0.0692109455033682, 0.05229473543289976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8033cba8-7615-473b-aa87-68ddd9c2cf97", 1, 0, 0.0, 1257.0, 1257, 1257, 1257.0, 1257.0, 1257.0, 1257.0, 0.7955449482895784, 0.14372638225934767, 0.5484909506762132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 131.06249999999997, 78, 878, 81.0, 322.90000000000055, 878.0, 878.0, 0.08079175924055747, 4.563950346205313, 0.04706277772167239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 661.6666666666666, 81, 1106, 896.0, 1093.4, 1106.0, 1106.0, 0.12895682525490465, 77.36863799562407, 0.0684243571502261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 135.375, 79, 635, 82.5, 353.60000000000025, 635.0, 635.0, 0.08079135128584485, 1.505123544493312, 0.04714143788407451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 450.4666666666667, 78, 735, 486.0, 733.2, 735.0, 735.0, 0.12895682525490465, 25.289978227789337, 0.06855029154988909], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 447.53333333333336, 83, 1257, 421.0, 940.2000000000002, 1257.0, 1257.0, 0.08545985950399097, 0.017392416719366914, 0.05770209654400329], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee92387f-a8e7-4ccf-8580-884b07cecdde", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 188.7619047619048, 161, 325, 167.0, 319.6, 324.5, 325.0, 0.11322097499433896, 0.1754703977695468, 0.25463662637886975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 705.090909090909, 143, 2011, 549.0, 1560.6999999999998, 1962.3999999999992, 2011.0, 0.09378863452274375, 0.057610401479302555, 0.042406384554717146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b21d2eb4-083d-492f-9dde-39ea9d9abba8", 3, 0, 0.0, 314.6666666666667, 208, 421, 315.0, 421.0, 421.0, 421.0, 0.026190351474516788, 0.026267081019852284, 0.016795244923436873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 84.73333333333333, 81, 97, 84.0, 94.6, 97.0, 97.0, 0.12895349936812786, 0.09583360646400908, 0.0647286119875173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 136.59999999999997, 79, 252, 84.0, 249.0, 252.0, 252.0, 0.12895682525490465, 0.16363076329544868, 0.06632545048917622], "isController": false}, {"data": ["login", 22, 0, 0.0, 2799.1818181818176, 1789, 4366, 2647.5, 4275.9, 4355.05, 4366.0, 0.09048396582996418, 29.64623115003064, 0.17744143476723], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 130.18749999999997, 81, 771, 84.5, 304.1000000000005, 771.0, 771.0, 0.08477000837103832, 0.06862728216756911, 0.03013308891314253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ebdd17e-bb23-4601-949f-8c038e050bb5", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.2491918103448276, 0.950969827586207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c48a8355-8d71-487e-85e1-404d84ef60a5", 3, 0, 0.0, 1036.6666666666667, 198, 2397, 515.0, 2397.0, 2397.0, 2397.0, 0.021274332517817254, 0.02932838483494664, 0.0136427197461263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 750.0, 164, 1187, 980.0, 1176.2, 1187.0, 1187.0, 0.1288626581789129, 102.84293004422136, 0.26783465900792935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e4c4cfd-12af-4dba-97f3-3a06101161ad", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f10b9d53-ea7d-497e-a890-1b0efe92e020", 3, 0, 0.0, 962.0, 195, 2379, 312.0, 2379.0, 2379.0, 2379.0, 0.023736242869237038, 0.028055435500716045, 0.015221483871222971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 370.8888888888889, 163, 916, 323.0, 870.1, 916.0, 916.0, 0.1496134984623057, 30.024852789148866, 0.3301042619067409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 550.3636363636364, 78, 1087, 776.0, 1071.2, 1087.0, 1087.0, 0.139073266325305, 90.76962928282445, 0.212721351697326], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1182.391304347826, 243, 2039, 1212.0, 1656.6000000000001, 1964.199999999999, 2039.0, 0.09021270587127823, 0.02828339929320306, 0.040701435656768106], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 235.4375, 161, 961, 167.0, 515.1000000000005, 961.0, 961.0, 0.0807505766095861, 6.155186087495774, 0.1803186398827098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 99.5, 81, 252, 86.5, 178.5, 252.0, 252.0, 0.0864282892137495, 0.06710008781731529, 0.030722555931450016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/160bb444-f7d9-4f2e-9200-7322e97d8204", 3, 0, 0.0, 273.3333333333333, 188, 391, 241.0, 391.0, 391.0, 391.0, 0.07729369025841858, 0.049692395267049695, 0.04956659173472805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e4c4cfd-12af-4dba-97f3-3a06101161ad", 3, 0, 0.0, 282.0, 189, 446, 211.0, 446.0, 446.0, 446.0, 0.01811900562897108, 0.024978511991761893, 0.011619284208682627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 212.21428571428572, 163, 349, 167.0, 337.0, 349.0, 349.0, 0.0808472794890452, 0.12529749272374485, 0.18182742642897567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 82.5, 79, 85, 83.0, 84.9, 85.0, 85.0, 0.06569784248285286, 0.04882427551704202, 0.03297723734002576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 82.0, 77, 89, 82.0, 88.5, 89.0, 89.0, 0.06569784248285286, 0.017579305508107115, 0.037468300791002024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 97.7, 79, 235, 82.0, 220.50000000000006, 235.0, 235.0, 0.06569827410633922, 0.017707737942724244, 0.03862339942579708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 98.60000000000001, 80, 236, 83.0, 221.40000000000006, 236.0, 236.0, 0.06569741086503782, 0.017707505272217223, 0.038687049562126756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e46f35e-fc75-411a-a412-6222d88b0209", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 84.0, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.281135788585887, 0.08291309389935339, 0.17378804118639304], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 967.1228070175441, 640, 1519, 864.0, 1401.6000000000001, 1493.4999999999998, 1519.0, 0.24274428805655515, 290.40656008453465, 0.47932514692417433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1182.391304347826, 243, 2039, 1212.0, 1656.6000000000001, 1964.199999999999, 2039.0, 0.09070008636225614, 0.02843620234794919, 0.040921328026721035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 127.83333333333333, 79, 324, 81.5, 300.6000000000001, 324.0, 324.0, 0.05288696732907593, 0.014254690412914998, 0.03114339970647733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 127.66666666666666, 79, 323, 82.0, 298.4000000000001, 323.0, 323.0, 0.05288720041604598, 0.014254753237137392, 0.03109188930708953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3c56ba4-cf06-4670-959e-89763b15d863", 3, 0, 0.0, 450.0, 215, 866, 269.0, 866.0, 866.0, 866.0, 0.05255505141635864, 0.03378783416253526, 0.03370229534187061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 114.57142857142857, 79, 246, 82.0, 240.5, 246.0, 246.0, 0.08603524987094711, 0.023189188441778717, 0.050579316818662276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c3e5499-92f4-48f9-902f-33dc4a7f6bb0", 3, 0, 0.0, 305.6666666666667, 193, 393, 331.0, 393.0, 393.0, 393.0, 0.06539794650447976, 0.02959086772175354, 0.0419381362675212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 115.00000000000001, 77, 244, 81.0, 241.5, 244.0, 244.0, 0.08603524987094711, 0.023189188441778717, 0.05066333561736437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 108.0, 79, 243, 82.0, 240.9, 243.0, 243.0, 0.05288720041604598, 0.014151457923824802, 0.03016223148727622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 82.28571428571429, 80, 86, 82.0, 85.0, 86.0, 86.0, 0.08603419244619791, 0.06393751997222324, 0.04318513175522043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 128.16666666666663, 80, 293, 85.0, 278.6, 293.0, 293.0, 0.052883704327209104, 0.039301268547857544, 0.026545140648618633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 138.64285714285714, 79, 249, 82.0, 246.5, 249.0, 249.0, 0.08595021027105013, 0.022998396107683335, 0.04901847929520828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 101.41666666666666, 82, 254, 87.5, 206.00000000000017, 254.0, 254.0, 0.05409304002884962, 0.04257713892895781, 0.01922838532275514], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 576.2142857142856, 79, 2379, 434.5, 1622.5, 2379.0, 2379.0, 0.08304613212639621, 0.016034576850297484, 0.05651493199114966], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b340fe93-e603-4788-94cb-cc0c824c87e4", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1488.227272727273, 1043, 2367, 1436.0, 2152.3999999999996, 2355.6, 2367.0, 0.09230820871725157, 0.04777670958998372, 0.04245817022053271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 283.8333333333333, 161, 570, 176.0, 561.0, 570.0, 570.0, 0.05286460054186216, 0.08192980572259301, 0.11889372563272319], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b21d2eb4-083d-492f-9dde-39ea9d9abba8", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["addBook", 63, 10, 15.873015873015873, 887.2539682539682, 410, 2122, 756.0, 1531.8, 1634.5999999999997, 2122.0, 0.30918424436352215, 83.37539054448327, 1.1271575416417192], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 166.07017543859646, 80, 645, 84.0, 345.0, 396.49999999999955, 645.0, 0.24375328746210062, 0.18114868335806503, 0.11782995829466779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5245b4ad-f04f-4ff2-a1ae-db4d5449f394", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 511.26315789473665, 386, 744, 475.0, 645.6, 658.0999999999996, 744.0, 0.243655343105195, 71.64276099174137, 0.12254150556560099], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 131.17543859649126, 79, 331, 83.0, 247.0, 270.49999999999966, 331.0, 0.24390661372038888, 0.4316003750599069, 0.118618646125736], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 797.7894736842105, 549, 1193, 728.0, 1040.4, 1125.2, 1193.0, 0.24315227731303937, 218.7888465423853, 0.12205104544814671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 102.92857142857143, 82, 237, 88.5, 190.0, 237.0, 237.0, 0.07946238023884121, 0.05936398523702493, 0.028246392975525586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, 5.46448087431694, 161.82513661202185, 80, 1576, 90.0, 345.79999999999995, 446.7999999999999, 1095.5199999999982, 0.7569928768211263, 1.5687993868047454, 0.36579990594466916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 89.2, 83, 103, 87.0, 102.5, 103.0, 103.0, 0.06389776357827476, 0.049483326677316294, 0.022713658146964855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8033cba8-7615-473b-aa87-68ddd9c2cf97", 3, 0, 0.0, 257.3333333333333, 168, 386, 218.0, 386.0, 386.0, 386.0, 0.01999986666755555, 0.02757143077379484, 0.01282543533043113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee92387f-a8e7-4ccf-8580-884b07cecdde", 3, 0, 0.0, 331.6666666666667, 228, 468, 299.0, 468.0, 468.0, 468.0, 0.01795385858344056, 0.0247508434573147, 0.011513379365031868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 97.27777777777779, 81, 249, 87.0, 123.9000000000002, 249.0, 249.0, 0.14117314886708549, 0.11456531905131644, 0.05018264276134679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f10b9d53-ea7d-497e-a890-1b0efe92e020", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c48a8355-8d71-487e-85e1-404d84ef60a5", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 182.3, 162, 316, 167.5, 301.70000000000005, 316.0, 316.0, 0.06566160634553764, 0.10176266530309398, 0.14767449161501287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 256.35714285714283, 162, 335, 318.5, 331.5, 335.0, 335.0, 0.08590643561926269, 0.13313819660915027, 0.1932055871398066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c3e5499-92f4-48f9-902f-33dc4a7f6bb0", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 118.0, 80, 267, 87.0, 247.4, 265.09999999999997, 267.0, 0.10867371493332091, 0.09010154685389594, 0.03863010960520392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 98.53333333333333, 81, 253, 84.0, 176.20000000000005, 253.0, 253.0, 0.11894283607298332, 0.0923433151152556, 0.04228046126031829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cadaae0-adc3-4556-9edb-21bd8f5d155e", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ebdd17e-bb23-4601-949f-8c038e050bb5", 3, 0, 0.0, 969.6666666666666, 723, 1184, 1002.0, 1184.0, 1184.0, 1184.0, 0.036973588533257745, 0.02377045486757293, 0.023710276500819583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e46f35e-fc75-411a-a412-6222d88b0209", 3, 0, 0.0, 345.6666666666667, 183, 495, 359.0, 495.0, 495.0, 495.0, 0.0502209722780233, 0.03287577319371903, 0.03220550631110219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 83.28571428571426, 78, 99, 83.0, 91.5, 99.0, 99.0, 0.08088604888983898, 0.06011160469254635, 0.040601005009157455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 104.71428571428572, 78, 249, 82.0, 245.0, 249.0, 249.0, 0.08088604888983898, 0.021643337300601445, 0.046130324757486296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 104.28571428571428, 80, 243, 81.5, 241.5, 243.0, 243.0, 0.08088698355105413, 0.02180156978524506, 0.04755269931419394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 126.28571428571428, 79, 249, 81.5, 244.0, 249.0, 249.0, 0.08088745088976196, 0.02180169574763115, 0.04763196570949849], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5147058823529411], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.22058823529411764], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.14705882352941177], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1360, 28, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
