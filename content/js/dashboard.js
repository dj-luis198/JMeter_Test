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

    var data = {"OkPercent": 98.12734082397004, "KoPercent": 1.8726591760299625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7768143866409762, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a810a21-fd18-4015-a69b-5808e27795e5"], "isController": false}, {"data": [0.1724137931034483, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c6c4b67-14b9-4268-b271-b11ad9f8c4ec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72fa99ca-d7d8-4574-95a8-85df40f0730f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/68b81bf3-dde4-470a-90c4-65979ca43f28"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0a37c2d-ebb1-4cc3-bdde-c6f6b9b38654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0af1daef-e27c-4c10-932c-3411b54305d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c8d0010-bbb2-4a9c-bcbf-3116721ba790"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93b48805-bc60-4206-ad33-f4e10b96f4d4"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9faca88-6c18-4f86-bc2f-2206b34e28c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10566b17-8b26-4620-93f6-5d97e308e9e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/01a66d15-39e9-4f33-94b0-1f59f190adf6"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.96, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0a37c2d-ebb1-4cc3-bdde-c6f6b9b38654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93b48805-bc60-4206-ad33-f4e10b96f4d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8167418d-922d-459e-954b-bb728be05a3b"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0af1daef-e27c-4c10-932c-3411b54305d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/903a0a4f-d76e-4502-84e4-da99fecb1371"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4827586206896552, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a810a21-fd18-4015-a69b-5808e27795e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ebb0e141-8bb5-4be7-8f03-0914d5e8e890"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b1d92d01-6c93-473a-b7f8-9e1e5ef24729"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68b81bf3-dde4-470a-90c4-65979ca43f28"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c515f4d2-4c1f-4a23-85bc-1acfeb09407a"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9005681818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c515f4d2-4c1f-4a23-85bc-1acfeb09407a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1d92d01-6c93-473a-b7f8-9e1e5ef24729"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01a66d15-39e9-4f33-94b0-1f59f190adf6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=903a0a4f-d76e-4502-84e4-da99fecb1371"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8c8d0010-bbb2-4a9c-bcbf-3116721ba790"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10566b17-8b26-4620-93f6-5d97e308e9e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72fa99ca-d7d8-4574-95a8-85df40f0730f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8167418d-922d-459e-954b-bb728be05a3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9faca88-6c18-4f86-bc2f-2206b34e28c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 25, 1.8726591760299625, 370.21498127340857, 112, 3700, 138.0, 911.0, 1104.0, 1518.3200000000038, 5.2071144395038615, 740.6638789041169, 3.8036419938177706], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a810a21-fd18-4015-a69b-5808e27795e5", 1, 0, 0.0, 794.0, 794, 794, 794.0, 794.0, 794.0, 794.0, 1.2594458438287153, 0.22753660264483627, 0.8683288727959697], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1675.2931034482756, 1371, 2082, 1724.5, 1966.5, 1986.1499999999999, 2082.0, 0.25579959424891946, 307.8147353177097, 1.257764606487607], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5c6c4b67-14b9-4268-b271-b11ad9f8c4ec", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72fa99ca-d7d8-4574-95a8-85df40f0730f", 1, 0, 0.0, 1240.0, 1240, 1240, 1240.0, 1240.0, 1240.0, 1240.0, 0.8064516129032258, 0.1456968245967742, 0.5560105846774194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68b81bf3-dde4-470a-90c4-65979ca43f28", 3, 0, 0.0, 706.0, 192, 1249, 677.0, 1249.0, 1249.0, 1249.0, 0.029068640750358515, 0.024233329740126354, 0.018641022877020273], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 677.0666666666667, 116, 1466, 499.0, 1248.8000000000002, 1466.0, 1466.0, 0.09082817126559975, 0.0171012416211012, 0.06144502132948222], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 677.0666666666667, 116, 1466, 499.0, 1248.8000000000002, 1466.0, 1466.0, 0.08999658012995505, 0.0169446686025931, 0.06088245209182051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0a37c2d-ebb1-4cc3-bdde-c6f6b9b38654", 3, 0, 0.0, 383.0, 251, 579, 319.0, 579.0, 579.0, 579.0, 0.07087172218284904, 0.03206760866997402, 0.04544833746751713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 160.00000000000003, 114, 346, 116.0, 342.5, 346.0, 346.0, 0.08673826187365488, 0.02320926147791156, 0.0494679149748188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0af1daef-e27c-4c10-932c-3411b54305d5", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c8d0010-bbb2-4a9c-bcbf-3116721ba790", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 0.22359413675742573, 0.8532835705445544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 145.93750000000003, 114, 360, 117.0, 347.40000000000003, 360.0, 360.0, 0.08673638103292187, 0.06445936129497416, 0.04353759751066586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 161.25, 114, 345, 116.0, 343.6, 345.0, 345.0, 0.0866321221079761, 0.023350064161915436, 0.051014814092880466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 175.9375, 113, 345, 116.0, 344.3, 345.0, 345.0, 0.0866321221079761, 0.023350064161915436, 0.05093021241113439], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 360.0, 114, 2072, 225.0, 1097.6000000000006, 2072.0, 2072.0, 0.09181556090126154, 0.16410238238426647, 0.059351347928946994], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 25, 0, 0.0, 126.15999999999998, 114, 342, 116.0, 129.40000000000006, 282.89999999999986, 342.0, 0.1187676666904202, 0.0882638616712986, 0.05961580144421483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 25, 0, 0.0, 178.64, 113, 346, 115.0, 344.8, 346.0, 346.0, 0.11876935940558311, 0.03891552291773559, 0.06733665946924348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 704.2, 570, 795, 791.0, 795.0, 795.0, 795.0, 0.04359920126263287, 12.819612800943487, 0.02486516947009531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 835.4, 785, 1017, 791.0, 1017.0, 1017.0, 1017.0, 0.04360262313380773, 39.23371694103617, 0.02482454031934561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 206.8, 114, 344, 117.0, 344.0, 344.0, 344.0, 0.043859649122807015, 0.0776110197368421, 0.024285567434210526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 131.26666666666665, 114, 341, 116.0, 207.20000000000007, 341.0, 341.0, 0.07300939874326488, 0.05425796137072712, 0.03664729585355288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 130.13333333333333, 112, 344, 115.0, 208.4000000000001, 344.0, 344.0, 0.07292917604616904, 0.019514252184228822, 0.04159242071383078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 160.46666666666667, 113, 343, 115.0, 342.4, 343.0, 343.0, 0.0730101094664908, 0.019678506067140097, 0.042921958885573694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 160.26666666666665, 113, 342, 116.0, 340.8, 342.0, 342.0, 0.07301046483329277, 0.019678601849598444, 0.042993467084448775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 115.4, 114, 116, 116.0, 116.0, 116.0, 116.0, 0.04385887966877774, 0.03259434319134752, 0.024627788876510938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 25, 0, 0.0, 196.84, 113, 1020, 116.0, 343.0, 816.8999999999995, 1020.0, 0.11876879516183436, 4.305466252143777, 0.06941479348481898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 624.8333333333334, 114, 1132, 792.5, 1041.1000000000001, 1132.0, 1132.0, 0.08555499047012467, 42.77832144970555, 0.04621232015628045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 25, 0, 0.0, 160.96, 113, 805, 115.0, 340.4, 665.7999999999997, 805.0, 0.11876935940558311, 1.4276169789113127, 0.06953110896138572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 513.1111111111111, 113, 912, 570.0, 820.2000000000002, 912.0, 912.0, 0.08564902931100114, 14.001181391558813, 0.046346756637799774], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 853.4666666666668, 116, 3700, 516.0, 2339.2000000000007, 3700.0, 3700.0, 0.08959824148518045, 0.016869668904631634, 0.06134796261065383], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/93b48805-bc60-4206-ad33-f4e10b96f4d4", 3, 0, 0.0, 507.0, 224, 824, 473.0, 824.0, 824.0, 824.0, 0.04745483881173084, 0.030817839658008793, 0.030431651191116453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 308.26666666666665, 231, 684, 233.0, 550.8000000000001, 684.0, 684.0, 0.07288735987405064, 0.1129611719923031, 0.16392538065423695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 516.7619047619047, 122, 1094, 482.0, 968.8000000000002, 1086.1999999999998, 1094.0, 0.09509017718469683, 0.05840988422770928, 0.04299487503565882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 161.11111111111114, 114, 344, 116.5, 344.0, 344.0, 344.0, 0.08564739917397841, 0.06365006911269294, 0.042990979663500885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 216.88888888888886, 113, 348, 116.5, 348.0, 348.0, 348.0, 0.08555458382448002, 0.09428085431004982, 0.04480104400357428], "isController": false}, {"data": ["login", 21, 0, 0.0, 2338.238095238095, 1377, 3338, 2245.0, 3184.6000000000004, 3328.3999999999996, 3338.0, 0.09488266177493833, 27.157298333397343, 0.18061857141727589], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9faca88-6c18-4f86-bc2f-2206b34e28c4", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 25, 0, 0.0, 130.92, 115, 348, 120.0, 133.8, 284.9999999999999, 348.0, 0.11679623262072059, 0.09455476254157946, 0.04151741081439677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10566b17-8b26-4620-93f6-5d97e308e9e5", 3, 0, 0.0, 331.6666666666667, 233, 424, 338.0, 424.0, 424.0, 424.0, 0.027415036233539556, 0.027495353722505004, 0.017580605917992487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01a66d15-39e9-4f33-94b0-1f59f190adf6", 3, 0, 0.0, 1240.6666666666667, 207, 2072, 1443.0, 2072.0, 2072.0, 2072.0, 0.03796218965909953, 0.03127679102447296, 0.024344242717586617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 800.4444444444446, 232, 1263, 912.5, 1251.3, 1263.0, 1263.0, 0.08550703295346043, 56.89008545952905, 0.1801530011780969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 351.625, 230, 701, 240.5, 692.6, 701.0, 701.0, 0.08657633868663694, 0.13417641552313753, 0.19471221483918447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 715.0000000000001, 114, 1133, 908.0, 1133.0, 1133.0, 1133.0, 0.060638611202550284, 51.82239329770093, 0.10914611631351895], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 976.5416666666667, 213, 1875, 951.0, 1465.5, 1779.25, 1875.0, 0.09658375219828644, 0.030323902667723723, 0.043575872573836265], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 25, 0, 0.0, 361.15999999999997, 231, 1135, 234.0, 570.0000000000005, 1000.5999999999997, 1135.0, 0.1187022520191253, 5.8569731341193005, 0.2657493035145363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 126.19999999999999, 116, 166, 121.0, 152.8, 166.0, 166.0, 0.08537522410996329, 0.06628252262443439, 0.030348224195338513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0a37c2d-ebb1-4cc3-bdde-c6f6b9b38654", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93b48805-bc60-4206-ad33-f4e10b96f4d4", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8167418d-922d-459e-954b-bb728be05a3b", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 460.25000000000006, 232, 914, 460.5, 811.7000000000004, 914.0, 914.0, 0.10772959870724481, 10.89321759415118, 0.23998942342221025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0af1daef-e27c-4c10-932c-3411b54305d5", 3, 0, 0.0, 453.33333333333337, 271, 713, 376.0, 713.0, 713.0, 713.0, 0.07884362680683311, 0.03567468791064389, 0.050560528909329834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 179.36363636363637, 115, 345, 117.0, 344.4, 345.0, 345.0, 0.06490824334690505, 0.04823747381542456, 0.03258089558623945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 137.36363636363637, 114, 342, 115.0, 301.0000000000001, 342.0, 342.0, 0.06499491857909291, 0.017391218447921346, 0.03706741450213892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 177.63636363636365, 113, 346, 116.0, 345.2, 346.0, 346.0, 0.06499491857909291, 0.017518161648271136, 0.03820990330528704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/903a0a4f-d76e-4502-84e4-da99fecb1371", 3, 0, 0.0, 481.33333333333337, 194, 802, 448.0, 802.0, 802.0, 802.0, 0.022679165406713032, 0.022745608274115512, 0.014543605420320531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 178.9090909090909, 112, 342, 116.0, 342.0, 342.0, 342.0, 0.06499491857909291, 0.017518161648271136, 0.038273374905461933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 2.5424299568965516, 5.329000538793103], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1056.189655172414, 902, 1604, 913.5, 1486.6, 1498.0499999999997, 1604.0, 0.2703824046319303, 323.471356072649, 0.533899631021253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 976.5416666666667, 213, 1875, 951.0, 1465.5, 1779.25, 1875.0, 0.09362090554820891, 0.02939367298217692, 0.042239119495383316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 160.4, 114, 342, 116.0, 342.0, 342.0, 342.0, 0.0318420633657061, 0.008582431141537972, 0.018750746298360134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a810a21-fd18-4015-a69b-5808e27795e5", 3, 0, 0.0, 724.0, 328, 1009, 835.0, 1009.0, 1009.0, 1009.0, 0.04480487477037502, 0.028805217340980033, 0.028732292740116794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 160.8, 114, 344, 115.0, 344.0, 344.0, 344.0, 0.03184246893767155, 0.008582540455856786, 0.018719888965310814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 401.2, 113, 1024, 338.0, 1021.0, 1024.0, 1024.0, 0.08806434568191158, 21.14819394704397, 0.049754061967944574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 297.3333333333333, 113, 802, 117.0, 799.0, 802.0, 802.0, 0.08818290309874721, 6.93175029100358, 0.04990715993733135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 176.8, 114, 346, 117.0, 344.8, 346.0, 346.0, 0.08817927434335833, 0.0655316677493122, 0.04426186231688104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 115.2, 114, 116, 115.0, 116.0, 116.0, 116.0, 0.0318420633657061, 0.008520239611526826, 0.018159926763254258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 191.46666666666667, 114, 347, 116.0, 344.6, 347.0, 347.0, 0.08806537973791742, 0.05883638846813207, 0.04825248931473392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 118.2, 115, 127, 116.0, 127.0, 127.0, 127.0, 0.03184165780407191, 0.023663575770408913, 0.015983019639934534], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 924.3333333333331, 117, 3232, 713.0, 2440.0000000000005, 3232.0, 3232.0, 0.0924618902908851, 0.017240289960487952, 0.06292946621750735], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 118.2, 117, 120, 118.0, 120.0, 120.0, 120.0, 0.03222916223515686, 0.02536787574368792, 0.011456460013278415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1256.4285714285716, 833, 1835, 1159.0, 1766.8000000000002, 1829.8999999999999, 1835.0, 0.09615120463723524, 0.04976576021263152, 0.04422579822669707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 280.4, 231, 460, 234.0, 460.0, 460.0, 460.0, 0.031818152892588276, 0.049311922500525, 0.07155977159338946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebb0e141-8bb5-4be7-8f03-0914d5e8e890", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.5449418728668942, 1.0182247226962458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1d92d01-6c93-473a-b7f8-9e1e5ef24729", 3, 0, 0.0, 897.6666666666667, 203, 1912, 578.0, 1912.0, 1912.0, 1912.0, 0.02890312635483405, 0.024095347198805336, 0.01853488246061949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68b81bf3-dde4-470a-90c4-65979ca43f28", 1, 0, 0.0, 827.0, 827, 827, 827.0, 827.0, 827.0, 827.0, 1.2091898428053203, 0.2184571493349456, 0.833679715840387], "isController": false}, {"data": ["addBook", 59, 14, 23.728813559322035, 1125.8983050847453, 588, 2851, 938.0, 1850.0, 2093.0, 2851.0, 0.2637119014522033, 86.60518225313884, 0.9566103829856656], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c515f4d2-4c1f-4a23-85bc-1acfeb09407a", 3, 0, 0.0, 326.0, 233, 464, 281.0, 464.0, 464.0, 464.0, 0.028551578426427342, 0.028635225628848515, 0.01830944319663472], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 196.99999999999994, 115, 554, 117.0, 465.1, 473.15, 554.0, 0.2715215976705319, 0.20178509358132307, 0.1312531160614388], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 643.5517241379309, 563, 931, 571.0, 800.1, 911.3, 931.0, 0.271447893704749, 79.81469366754185, 0.1365192043534626], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 153.50000000000006, 113, 472, 118.0, 345.3, 355.9, 472.0, 0.27201951036488137, 0.48134702420035647, 0.1322907384391708], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 853.5517241379309, 786, 1140, 794.5, 1027.0, 1038.1499999999996, 1140.0, 0.27102550443453804, 243.8692253022168, 0.1360420989056177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 119.66666666666669, 117, 132, 118.0, 129.0, 132.0, 132.0, 0.10567473317129875, 0.07894645593363626, 0.0375640653069851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, 7.954545454545454, 193.6761363636362, 114, 1563, 122.0, 351.6, 445.75, 1320.4499999999969, 0.7413585395236771, 1.647196955217311, 0.35403177547998754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 119.81818181818181, 116, 129, 119.0, 128.4, 129.0, 129.0, 0.0649078603418874, 0.05026555981554366, 0.023072715980905288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 138.31250000000003, 115, 352, 119.0, 212.70000000000016, 352.0, 352.0, 0.08832410530441455, 0.07167708155075048, 0.031396459307428605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c515f4d2-4c1f-4a23-85bc-1acfeb09407a", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1d92d01-6c93-473a-b7f8-9e1e5ef24729", 1, 0, 0.0, 1432.0, 1432, 1432, 1432.0, 1432.0, 1432.0, 1432.0, 0.6983240223463687, 0.12616205481843576, 0.48146167946927376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 380.8181818181818, 232, 687, 234.0, 686.6, 687.0, 687.0, 0.06486384489285672, 0.10052629086422228, 0.14588030741039942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01a66d15-39e9-4f33-94b0-1f59f190adf6", 1, 0, 0.0, 1180.0, 1180, 1180, 1180.0, 1180.0, 1180.0, 1180.0, 0.847457627118644, 0.1531051377118644, 0.584282309322034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 580.1333333333334, 231, 1370, 457.0, 1366.4, 1370.0, 1370.0, 0.08800183043807311, 28.17489176691542, 0.1919138876421963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=903a0a4f-d76e-4502-84e4-da99fecb1371", 1, 0, 0.0, 3700.0, 3700, 3700, 3700.0, 3700.0, 3700.0, 3700.0, 0.2702702702702703, 0.048828125, 0.18633868243243243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c8d0010-bbb2-4a9c-bcbf-3116721ba790", 3, 0, 0.0, 1241.6666666666665, 202, 3232, 291.0, 3232.0, 3232.0, 3232.0, 0.02423929027358079, 0.024310303819304168, 0.015544076119451222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 119.8, 117, 128, 118.0, 126.8, 128.0, 128.0, 0.07241514152332493, 0.06003950698564731, 0.025741319838369404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10566b17-8b26-4620-93f6-5d97e308e9e5", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72fa99ca-d7d8-4574-95a8-85df40f0730f", 3, 0, 0.0, 530.6666666666666, 193, 937, 462.0, 937.0, 937.0, 937.0, 0.04894363324904152, 0.03178468370177013, 0.0313863793947304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 123.61111111111111, 117, 148, 119.5, 133.60000000000002, 148.0, 148.0, 0.08819724824585473, 0.06847344956587355, 0.031351365587393674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8167418d-922d-459e-954b-bb728be05a3b", 3, 0, 0.0, 308.0, 190, 523, 211.0, 523.0, 523.0, 523.0, 0.06375924509053812, 0.028849398006460938, 0.04088727631131514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9faca88-6c18-4f86-bc2f-2206b34e28c4", 3, 0, 0.0, 269.0, 199, 383, 225.0, 383.0, 383.0, 383.0, 0.015721375305911764, 0.021673185032726663, 0.010081741325731175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 116.08333333333333, 114, 118, 116.0, 118.0, 118.0, 118.0, 0.10784190376907454, 0.0801442273127595, 0.054131580602836245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 230.83333333333334, 114, 343, 238.0, 342.7, 343.0, 343.0, 0.10784578053383662, 0.042355447335310506, 0.06075101667116024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 258.9166666666667, 114, 788, 131.0, 688.7000000000004, 788.0, 788.0, 0.10784578053383662, 8.113297398782242, 0.06262919025793116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 257.0, 113, 797, 116.5, 695.0000000000003, 797.0, 797.0, 0.10784384211661514, 2.6691175396775466, 0.06273338081458048], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5243445692883895], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.0749063670411985], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.0749063670411985], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.198501872659176], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 25, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
