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

    var data = {"OkPercent": 98.2919254658385, "KoPercent": 1.7080745341614907};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.762982689747004, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13636363636363635, 500, 1500, "see books"], "isController": true}, {"data": [0.32142857142857145, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24bef6d6-590f-45e2-b44c-6ff9333fd6f4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fab3f4f2-258a-4efe-8209-facc1ec0e646"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/83f872be-f945-4ba2-a483-7b3a4ea19360"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be4029e8-394b-4534-8fe9-212335fe7b76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e98737a-9938-4872-9d98-9e55043cb4b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b8efc22-6f2d-4148-a99e-d0f9af269851"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e436df45-9cfd-4bc6-82f3-38b9143073c2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b8efc22-6f2d-4148-a99e-d0f9af269851"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72503238-7733-4ea9-9888-09ec2d1302aa"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72bdf9fd-5fdc-4cec-8261-4dd00af8cbe7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9efd31bc-ad7d-48f3-8e7b-5eff286222ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/672452b4-aec0-41df-af78-4a0259a2af8c"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/79bf301c-7f31-4565-8b47-231616e814e2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38c4f43e-95a7-4d16-b263-03883305c218"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24bef6d6-590f-45e2-b44c-6ff9333fd6f4"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5982f71b-9ade-4862-950e-7e618c2a48a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3b655a6-f34d-4a70-abe9-5f5d9d830dc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83f872be-f945-4ba2-a483-7b3a4ea19360"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38255f52-5406-481d-9b9a-370ffe7c4fd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7504d977-24a1-482f-932d-890cc71c5ac7"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be4029e8-394b-4534-8fe9-212335fe7b76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72503238-7733-4ea9-9888-09ec2d1302aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72bdf9fd-5fdc-4cec-8261-4dd00af8cbe7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38255f52-5406-481d-9b9a-370ffe7c4fd9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3b655a6-f34d-4a70-abe9-5f5d9d830dc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9efd31bc-ad7d-48f3-8e7b-5eff286222ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38c4f43e-95a7-4d16-b263-03883305c218"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5982f71b-9ade-4862-950e-7e618c2a48a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79bf301c-7f31-4565-8b47-231616e814e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 22, 1.7080745341614907, 380.695652173913, 101, 5152, 124.0, 896.1000000000001, 1117.55, 1968.2199999999998, 5.078844326323635, 720.3325987784452, 3.707788329403275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1632.6, 1306, 2478, 1584.0, 1930.2, 2046.3999999999999, 2478.0, 0.23978828873997796, 288.54644852426657, 1.1790371423884658], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 1018.7857142857142, 115, 4831, 600.5, 3364.5, 4831.0, 4831.0, 0.07830809761663711, 0.015425646461313003, 0.05268972583775681], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 1018.7857142857142, 115, 4831, 600.5, 3364.5, 4831.0, 4831.0, 0.07805400221896377, 0.015375593071034718, 0.05251875735240825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 213.6923076923077, 101, 343, 114.0, 341.8, 343.0, 343.0, 0.11859907127804184, 0.07284149690273964, 0.06533996309744282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24bef6d6-590f-45e2-b44c-6ff9333fd6f4", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fab3f4f2-258a-4efe-8209-facc1ec0e646", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.46686540570175433, 0.8723387244152047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 111.38461538461537, 101, 115, 112.0, 115.0, 115.0, 115.0, 0.11859041606991362, 0.08813213538008229, 0.05952682994134336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 302.5384615384615, 109, 850, 114.0, 818.4, 850.0, 850.0, 0.11780057269201494, 8.017642193220125, 0.0670327026849469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 369.23076923076917, 103, 1093, 333.0, 1047.8, 1093.0, 1093.0, 0.1175417499254062, 24.43151010350455, 0.06677063648857584], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 286.42857142857144, 112, 822, 240.5, 612.5, 822.0, 822.0, 0.07995157219055886, 0.1659653206486357, 0.05167628821970692], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/83f872be-f945-4ba2-a483-7b3a4ea19360", 3, 0, 0.0, 1226.6666666666665, 228, 3209, 243.0, 3209.0, 3209.0, 3209.0, 0.033570189671571646, 0.03366853983662508, 0.02152775835058468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 24, 0, 0.0, 122.41666666666666, 103, 342, 114.0, 120.0, 287.5, 342.0, 0.11675309638941049, 0.08676670542220838, 0.05860458158609081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 24, 0, 0.0, 140.5416666666667, 104, 344, 112.0, 342.5, 344.0, 344.0, 0.11675480032496753, 0.03854770710598904, 0.06617815627143546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 698.3333333333334, 550, 783, 759.5, 783.0, 783.0, 783.0, 0.0363308285245445, 10.682469883256937, 0.020719925642904286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be4029e8-394b-4534-8fe9-212335fe7b76", 1, 0, 0.0, 1029.0, 1029, 1029, 1029.0, 1029.0, 1029.0, 1029.0, 0.9718172983479105, 0.1755724611273081, 0.6700224732750244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 843.5, 746, 1006, 779.0, 1006.0, 1006.0, 1006.0, 0.036280082234853066, 32.64488176850284, 0.020655554631757167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e98737a-9938-4872-9d98-9e55043cb4b5", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.8125596374045801, 1.5182689249363868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b8efc22-6f2d-4148-a99e-d0f9af269851", 3, 0, 0.0, 371.3333333333333, 210, 501, 403.0, 501.0, 501.0, 501.0, 0.02697405096297362, 0.027053076502904207, 0.01729781262925066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 188.33333333333331, 109, 346, 115.0, 346.0, 346.0, 346.0, 0.03642788190080688, 0.06446027539478717, 0.020170516638435058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 130.84615384615387, 108, 330, 114.0, 246.79999999999993, 330.0, 330.0, 0.07661028935116977, 0.05693401386351583, 0.038454774146973895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 161.23076923076923, 108, 331, 114.0, 328.6, 331.0, 331.0, 0.07661570739871994, 0.03820425673923549, 0.0427049691179764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 281.46153846153845, 108, 983, 113.0, 898.5999999999999, 983.0, 983.0, 0.07622353430938547, 10.569087014294846, 0.04380333815105159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 252.23076923076923, 104, 766, 111.0, 756.0, 766.0, 766.0, 0.0763322920825798, 3.4703669234563264, 0.04394038117704394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 148.16666666666666, 110, 332, 111.5, 332.0, 332.0, 332.0, 0.03642721841760163, 0.027071399624799652, 0.02045473690441498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 558.0625000000001, 109, 1020, 755.5, 996.2, 1020.0, 1020.0, 0.09023540160393427, 45.68225035283452, 0.04868658143181024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 24, 0, 0.0, 182.16666666666666, 104, 739, 113.0, 335.0, 639.25, 739.0, 0.11675934439628122, 4.407670001909502, 0.06822364036175937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 460.0625, 106, 879, 547.0, 813.9000000000001, 879.0, 879.0, 0.09023438381195155, 14.934836940123846, 0.04877415179679217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 24, 0, 0.0, 195.875, 103, 551, 112.5, 363.5, 505.5, 551.0, 0.11675593630963675, 1.4605798969385622, 0.06833566845205953], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 699.9285714285713, 113, 2258, 627.5, 1684.0, 2258.0, 2258.0, 0.07805704855148421, 0.015376193157742144, 0.053021731221704324], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 457.4615384615384, 227, 1093, 440.0, 1010.1999999999999, 1093.0, 1093.0, 0.076169048414219, 14.119064902254603, 0.16830773430771123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e436df45-9cfd-4bc6-82f3-38b9143073c2", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b8efc22-6f2d-4148-a99e-d0f9af269851", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 736.1739130434783, 205, 3292, 564.0, 1782.200000000002, 3100.9999999999973, 3292.0, 0.09868491622508742, 0.060617980767167956, 0.044620230675991676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 111.6875, 102, 116, 113.0, 115.3, 116.0, 116.0, 0.09023387492457012, 0.0670585730640604, 0.04529317549924711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 179.8125, 102, 343, 112.5, 338.8, 343.0, 343.0, 0.09023387492457012, 0.10037857692719818, 0.04719874927389928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72503238-7733-4ea9-9888-09ec2d1302aa", 3, 0, 0.0, 368.3333333333333, 244, 500, 361.0, 500.0, 500.0, 500.0, 0.02954878997705044, 0.024018010603090802, 0.01894893107252258], "isController": false}, {"data": ["login", 23, 0, 0.0, 3135.1739130434785, 1854, 5734, 2835.0, 5170.400000000001, 5656.399999999999, 5734.0, 0.09725405295694606, 30.485115372905867, 0.18880549691535514], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 24, 0, 0.0, 139.58333333333334, 110, 685, 115.5, 125.5, 545.25, 685.0, 0.11521843494959194, 0.09327742438790206, 0.040956553048487755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72bdf9fd-5fdc-4cec-8261-4dd00af8cbe7", 3, 0, 0.0, 532.3333333333333, 219, 1075, 303.0, 1075.0, 1075.0, 1075.0, 0.03567478862687739, 0.022935451672553005, 0.02287738723793895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9efd31bc-ad7d-48f3-8e7b-5eff286222ff", 3, 0, 0.0, 423.6666666666667, 247, 626, 398.0, 626.0, 626.0, 626.0, 0.059069071434197054, 0.037975721381034895, 0.037879580314247464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/672452b4-aec0-41df-af78-4a0259a2af8c", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 679.3125, 223, 1134, 890.5, 1111.6, 1134.0, 1134.0, 0.09017539113575905, 60.74427126483668, 0.18982844484084044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79bf301c-7f31-4565-8b47-231616e814e2", 3, 0, 0.0, 552.0, 330, 822, 504.0, 822.0, 822.0, 822.0, 0.023335770624931935, 0.02771882389660698, 0.01496467061559763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38c4f43e-95a7-4d16-b263-03883305c218", 3, 0, 0.0, 457.0, 229, 742, 400.0, 742.0, 742.0, 742.0, 0.019535828709853872, 0.02309068816584616, 0.012527858905733115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 643.6999999999999, 112, 1322, 882.0, 1301.5, 1322.0, 1322.0, 0.060425881613612745, 43.3806845648128, 0.097767188142025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 536.6153846153846, 227, 1202, 451.0, 1154.0, 1202.0, 1202.0, 0.11741859729937226, 32.55693461251863, 0.2571442583434945], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 996.8695652173914, 249, 1970, 880.0, 1863.2000000000003, 1969.6, 1970.0, 0.09835953403239878, 0.030987930643699, 0.044377055393523664], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 131.23529411764707, 111, 370, 116.0, 173.99999999999983, 370.0, 370.0, 0.0805920194937873, 0.06256899950933682, 0.028647944429432207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 24, 0, 0.0, 356.375, 216, 849, 233.5, 576.5, 804.25, 849.0, 0.11669008571859213, 5.990057829965528, 0.2611947271883038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24bef6d6-590f-45e2-b44c-6ff9333fd6f4", 3, 0, 0.0, 358.6666666666667, 252, 561, 263.0, 561.0, 561.0, 561.0, 0.038254083623426804, 0.0245936898295143, 0.024531427323616795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 327.0588235294117, 223, 692, 229.0, 602.3999999999999, 692.0, 692.0, 0.10913736542399866, 0.16914160051551355, 0.24545249274557512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 113.28571428571428, 110, 116, 113.0, 116.0, 116.0, 116.0, 0.038747460657489054, 0.028795720273778483, 0.019449408962841183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 109.28571428571428, 104, 114, 109.0, 114.0, 114.0, 114.0, 0.0387478896238687, 0.010368087653261741, 0.02209840580111262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 111.28571428571429, 110, 113, 111.0, 113.0, 113.0, 113.0, 0.0387481041106203, 0.010443824936065629, 0.02277964714315764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 109.57142857142857, 106, 113, 109.0, 113.0, 113.0, 113.0, 0.03874853309124726, 0.010443940559750238, 0.022817739701193458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 117.5, 113, 122, 117.5, 122.0, 122.0, 122.0, 0.03997361741250774, 0.011789094197829432, 0.024710253732536526], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1064.9636363636366, 848, 1792, 898.0, 1465.0, 1576.6, 1792.0, 0.25908444268581066, 309.95506577800705, 0.5115905694440519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 996.8695652173914, 249, 1970, 880.0, 1863.2000000000003, 1969.6, 1970.0, 0.09876797684535082, 0.03111660955301049, 0.04456133330327351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5982f71b-9ade-4862-950e-7e618c2a48a3", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 111.2, 108, 114, 112.0, 114.0, 114.0, 114.0, 0.04097520999795124, 0.011044099569760294, 0.024128956668715427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 152.0, 109, 311, 113.0, 311.0, 311.0, 311.0, 0.04090782648536318, 0.011025937607383044, 0.024049327679871713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 165.11764705882354, 107, 339, 113.0, 339.0, 339.0, 339.0, 0.07836846084342904, 0.021122749211705483, 0.04607208342553152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 189.7058823529412, 104, 337, 116.0, 334.6, 337.0, 337.0, 0.0782890616365177, 0.02110134864421766, 0.04610185953791032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 113.82352941176471, 108, 117, 115.0, 116.2, 117.0, 117.0, 0.07836846084342904, 0.0582406237322749, 0.03933729382179934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 109.4, 105, 111, 110.0, 111.0, 111.0, 111.0, 0.04097520999795124, 0.010964069862733046, 0.023368674451956565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3b655a6-f34d-4a70-abe9-5f5d9d830dc9", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 113.0, 107, 121, 113.0, 118.6, 121.0, 121.0, 0.07836918339310904, 0.020969879150109255, 0.0446949249038825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 112.2, 108, 116, 112.0, 116.0, 116.0, 116.0, 0.04097621740341906, 0.030452052191408105, 0.02056814037632558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83f872be-f945-4ba2-a483-7b3a4ea19360", 1, 0, 0.0, 1110.0, 1110, 1110, 1110.0, 1110.0, 1110.0, 1110.0, 0.9009009009009009, 0.16276041666666666, 0.6211289414414414], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 771.0714285714286, 112, 3209, 548.5, 2204.5, 3209.0, 3209.0, 0.07745547693209921, 0.014955131148720048, 0.0527103538608789], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 156.8, 107, 335, 114.0, 335.0, 335.0, 335.0, 0.03911812107840836, 0.030790239833200332, 0.013905269602090473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1848.478260869565, 924, 5152, 1530.0, 3135.4, 4763.799999999995, 5152.0, 0.09610964857298065, 0.04974425170281225, 0.04420668406042372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 265.4, 222, 423, 228.0, 423.0, 423.0, 423.0, 0.040871711870779995, 0.06334317064348423, 0.09192143792813118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38255f52-5406-481d-9b9a-370ffe7c4fd9", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7504d977-24a1-482f-932d-890cc71c5ac7", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1154.3859649122812, 574, 2833, 956.0, 1680.8000000000004, 1978.9999999999968, 2833.0, 0.2680889490913196, 85.4433855371891, 0.9742659595232719], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 195.3636363636364, 108, 462, 115.0, 448.0, 456.4, 462.0, 0.2603131330342099, 0.19345536546780637, 0.1258349617694667], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 635.3272727272725, 514, 902, 564.0, 787.4, 859.3999999999999, 902.0, 0.260000567273965, 76.44879960988096, 0.1307620040489179], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 186.72727272727278, 106, 447, 116.0, 339.8, 355.9999999999998, 447.0, 0.2607660833408403, 0.46143373341172117, 0.12681788037474456], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 866.0909090909091, 734, 1675, 779.0, 1012.4, 1108.6, 1675.0, 0.25966668240404134, 233.64853727249658, 0.13034050269109107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 137.47058823529412, 113, 327, 117.0, 264.59999999999997, 327.0, 327.0, 0.11233727615145708, 0.08392384399986783, 0.03993239113196326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 8, 4.733727810650888, 207.50887573964516, 103, 1688, 118.0, 343.0, 563.0, 1390.5000000000048, 0.7320010048771192, 1.5902165182632086, 0.3513186914182628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 180.14285714285714, 112, 342, 118.0, 342.0, 342.0, 342.0, 0.039288320143683, 0.030425427611270137, 0.013965770051074817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be4029e8-394b-4534-8fe9-212335fe7b76", 3, 0, 0.0, 386.6666666666667, 228, 600, 332.0, 600.0, 600.0, 600.0, 0.019840351306487133, 0.02735152597101986, 0.012723141951100149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 115.23076923076923, 111, 119, 116.0, 119.0, 119.0, 119.0, 0.11843375908751344, 0.09611177129074576, 0.04209950030063954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72503238-7733-4ea9-9888-09ec2d1302aa", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 226.2857142857143, 223, 231, 226.0, 231.0, 231.0, 231.0, 0.0387232394755767, 0.06001345805443381, 0.0870894731564972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72bdf9fd-5fdc-4cec-8261-4dd00af8cbe7", 1, 0, 0.0, 2258.0, 2258, 2258, 2258.0, 2258.0, 2258.0, 2258.0, 0.4428697962798937, 0.08001065655447298, 0.3053379650132861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38255f52-5406-481d-9b9a-370ffe7c4fd9", 3, 0, 0.0, 722.6666666666666, 228, 1404, 536.0, 1404.0, 1404.0, 1404.0, 0.01852492219532678, 0.02189583088907277, 0.011879588777602135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3b655a6-f34d-4a70-abe9-5f5d9d830dc9", 3, 0, 0.0, 616.3333333333333, 316, 1200, 333.0, 1200.0, 1200.0, 1200.0, 0.017197003135586905, 0.023707457122138845, 0.011028026099318425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 331.8235294117647, 221, 456, 234.0, 454.4, 456.0, 456.0, 0.07824834182557984, 0.12126964695038595, 0.1759823547112406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9efd31bc-ad7d-48f3-8e7b-5eff286222ff", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38c4f43e-95a7-4d16-b263-03883305c218", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 0.21872162530266345, 0.8346890133171914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 133.3846153846154, 113, 326, 116.0, 245.19999999999993, 326.0, 326.0, 0.0764525993883792, 0.06338696961009174, 0.027176509938837922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 143.68749999999997, 108, 342, 116.0, 335.0, 342.0, 342.0, 0.08562147814779338, 0.06647370617919506, 0.030435759810348427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5982f71b-9ade-4862-950e-7e618c2a48a3", 3, 0, 0.0, 390.3333333333333, 238, 516, 417.0, 516.0, 516.0, 516.0, 0.08648274669203493, 0.03913119072328404, 0.055459313471129174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79bf301c-7f31-4565-8b47-231616e814e2", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 127.23529411764706, 106, 353, 113.0, 166.59999999999985, 353.0, 353.0, 0.10921449083561935, 0.08116428469326789, 0.054820554970222986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 170.52941176470588, 103, 459, 112.0, 362.9999999999999, 459.0, 459.0, 0.10921519247571568, 0.02922359642416611, 0.0622867894588066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 138.47058823529412, 107, 334, 112.0, 327.6, 334.0, 334.0, 0.10921729745009733, 0.02943747470334655, 0.06420782525874863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 183.05882352941177, 105, 459, 113.0, 365.3999999999999, 459.0, 459.0, 0.10921659578295449, 0.029437285582124457, 0.06431406958703278], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4658385093167702], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15527950310559005], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15527950310559005], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9316770186335404], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
