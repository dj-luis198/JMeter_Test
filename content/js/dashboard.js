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

    var data = {"OkPercent": 99.09365558912387, "KoPercent": 0.9063444108761329};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8047834518422754, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/893dd222-9616-4945-b8a6-6c7f916e98b6"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1349c943-44d1-4c09-a41f-60c8b4d96bcb"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7ab0e60e-dcf5-4484-b82d-ffbd56ee0a68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9fc2f3a8-5f1e-4784-94c0-b940ffbcd988"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d847ba8-e9a0-4495-8e8a-6968fd9b6322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26d36625-bc1e-4683-8110-887b6b0592b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae623be6-ae8f-42ec-ad85-e9e775120de7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6294a14b-b6f8-4827-917e-7b4dd0887b85"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6458333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a27be59d-220d-4cc5-8389-67e9f2d0878e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/931735f6-5d4d-41c0-ac3a-9fa4633b2d44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fc2f3a8-5f1e-4784-94c0-b940ffbcd988"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae7f7f82-81ea-4515-badd-75be1a46a2e5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d976f82-a47e-47e9-945d-172a888e70ac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b4e0722-bcc2-4061-ab95-eccf857d243a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=893dd222-9616-4945-b8a6-6c7f916e98b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1349c943-44d1-4c09-a41f-60c8b4d96bcb"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b41744b-02e3-4e1a-8d9e-b29c761ce137"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26d36625-bc1e-4683-8110-887b6b0592b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2db175a8-be5d-4e55-a634-30bd6192416a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43f3b73b-0adb-423e-a005-b3233f26d4e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ab0e60e-dcf5-4484-b82d-ffbd56ee0a68"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8feafff8-095d-4470-904b-05f06be57a3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae623be6-ae8f-42ec-ad85-e9e775120de7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9339080459770115, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8feafff8-095d-4470-904b-05f06be57a3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6294a14b-b6f8-4827-917e-7b4dd0887b85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a27be59d-220d-4cc5-8389-67e9f2d0878e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43f3b73b-0adb-423e-a005-b3233f26d4e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=931735f6-5d4d-41c0-ac3a-9fa4633b2d44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ae7f7f82-81ea-4515-badd-75be1a46a2e5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d976f82-a47e-47e9-945d-172a888e70ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b41744b-02e3-4e1a-8d9e-b29c761ce137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b2f23c8-d9cc-415e-ab98-6a3c3438d419"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b4e0722-bcc2-4061-ab95-eccf857d243a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 12, 0.9063444108761329, 334.6918429003022, 77, 3480, 121.0, 865.5, 1087.75, 1882.25, 5.1487859131706255, 738.4047007644916, 3.7535837824910163], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/893dd222-9616-4945-b8a6-6c7f916e98b6", 3, 0, 0.0, 311.3333333333333, 196, 448, 290.0, 448.0, 448.0, 448.0, 0.03824433027803628, 0.03131005554988973, 0.024525172736891757], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1327.1785714285718, 974, 1761, 1329.5, 1607.2, 1682.35, 1761.0, 0.24199472797199775, 291.20040424733156, 1.1898861868545008], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1349c943-44d1-4c09-a41f-60c8b4d96bcb", 3, 0, 0.0, 830.3333333333334, 196, 1650, 645.0, 1650.0, 1650.0, 1650.0, 0.0333000333000333, 0.027760867604617604, 0.02135451354201354], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 846.5333333333334, 452, 2367, 626.0, 2038.2000000000003, 2367.0, 2367.0, 0.0800837141758852, 0.014468249143104258, 0.05443189947892196], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 846.5333333333334, 452, 2367, 626.0, 2038.2000000000003, 2367.0, 2367.0, 0.08090702165071899, 0.01461699121619435, 0.054991491278223066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ab0e60e-dcf5-4484-b82d-ffbd56ee0a68", 3, 0, 0.0, 724.6666666666666, 378, 1178, 618.0, 1178.0, 1178.0, 1178.0, 0.02467389337588209, 0.024746180172881747, 0.015822776676591054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 147.33333333333331, 80, 248, 88.0, 246.8, 248.0, 248.0, 0.11976526009022316, 0.04403868417900914, 0.0676330641941794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 106.00000000000001, 80, 248, 85.0, 247.4, 248.0, 248.0, 0.11976143522103969, 0.08900239472969844, 0.06011462666368594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 163.20000000000002, 81, 653, 84.0, 409.40000000000015, 653.0, 653.0, 0.11962104054355802, 2.374929348822929, 0.06975557683259434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 145.66666666666666, 79, 771, 84.0, 507.00000000000017, 771.0, 771.0, 0.11976526009022316, 7.214461218511717, 0.06972271847179527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fc2f3a8-5f1e-4784-94c0-b940ffbcd988", 3, 0, 0.0, 576.6666666666666, 228, 958, 544.0, 958.0, 958.0, 958.0, 0.08218502588828315, 0.03718658397939895, 0.052703288085910745], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 339.93333333333334, 196, 800, 228.0, 745.4000000000001, 800.0, 800.0, 0.08023621541819116, 0.17007883709641183, 0.05187145957699467], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8d847ba8-e9a0-4495-8e8a-6968fd9b6322", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.7496148767605634, 1.40065654342723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 83.85714285714286, 80, 90, 84.0, 86.8, 89.69999999999999, 90.0, 0.10555575102916857, 0.07844524075507547, 0.05298403909081313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 82.7142857142857, 79, 87, 83.0, 85.0, 86.8, 87.0, 0.10555787336071135, 0.03579464344058348, 0.059778821697672194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 579.6666666666666, 488, 728, 562.0, 728.0, 728.0, 728.0, 0.09827526902854897, 28.89619214043536, 0.056047614367844334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 805.5, 688, 895, 813.0, 895.0, 895.0, 895.0, 0.09763876910058421, 87.85553606735448, 0.05558926014222714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 136.5, 81, 242, 88.5, 242.0, 242.0, 242.0, 0.09867609571581284, 0.17461043499712195, 0.05463803346764246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 84.4, 80, 92, 83.5, 91.5, 92.0, 92.0, 0.0907605736068252, 0.06744999659647849, 0.04555755354873842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 115.4, 79, 247, 84.5, 246.1, 247.0, 247.0, 0.0907605736068252, 0.037917356825195134, 0.05099964263024142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 221.8, 80, 974, 86.5, 901.7000000000003, 974.0, 974.0, 0.0907605736068252, 8.188668896918678, 0.05257731666364131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 169.9, 79, 467, 84.0, 445.5000000000001, 467.0, 467.0, 0.0907605736068252, 2.6906787472771825, 0.05266595003630423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26d36625-bc1e-4683-8110-887b6b0592b6", 3, 0, 0.0, 792.3333333333334, 199, 1915, 263.0, 1915.0, 1915.0, 1915.0, 0.027409525723839895, 0.02285019380818814, 0.017577072160144723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 111.5, 84, 248, 84.0, 248.0, 248.0, 248.0, 0.0989331706432305, 0.07352357701122891, 0.055553294062360876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 155.71428571428572, 79, 988, 84.0, 248.4, 914.099999999999, 988.0, 0.10555840395693218, 4.55003158112666, 0.0616248234410029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 597.7647058823529, 80, 1171, 791.0, 1053.3999999999999, 1171.0, 1171.0, 0.08001167229101658, 42.35867019129849, 0.04299340433192607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 113.33333333333334, 79, 408, 83.0, 245.20000000000002, 391.9999999999998, 408.0, 0.10555840395693218, 1.5050810192166562, 0.061727907819867096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 397.99999999999994, 81, 745, 496.0, 719.4, 745.0, 745.0, 0.0800109191371999, 13.847625087659022, 0.043071135296111], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 603.6666666666666, 189, 1760, 483.0, 1317.2000000000003, 1760.0, 1760.0, 0.08092317154093903, 0.014619908920970431, 0.05579273350381148], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae623be6-ae8f-42ec-ad85-e9e775120de7", 3, 0, 0.0, 271.6666666666667, 179, 413, 223.0, 413.0, 413.0, 413.0, 0.044147511551932195, 0.036142900896194485, 0.028310741457456517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6294a14b-b6f8-4827-917e-7b4dd0887b85", 1, 0, 0.0, 890.0, 890, 890, 890.0, 890.0, 890.0, 890.0, 1.1235955056179776, 0.2029933286516854, 0.7746664325842697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 323.8, 163, 1066, 249.0, 992.9000000000002, 1066.0, 1066.0, 0.09068978651624254, 10.976147665078084, 0.201643072207208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 661.8333333333334, 160, 1490, 563.0, 1312.0, 1449.25, 1490.0, 0.10062639933586576, 0.06181055193580036, 0.045498069230962744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 97.94117647058825, 81, 242, 86.0, 145.99999999999991, 242.0, 242.0, 0.08000865976082117, 0.05945956062303214, 0.04016059679400594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 138.94117647058823, 79, 248, 84.0, 247.2, 248.0, 248.0, 0.08001129571233587, 0.0920993993269638, 0.041678678166329364], "isController": false}, {"data": ["login", 24, 0, 0.0, 2984.0, 1521, 4430, 2902.0, 4139.0, 4388.0, 4430.0, 0.10195888507959165, 30.634388382103666, 0.196101586097906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 90.0, 82, 115, 87.0, 104.6, 113.99999999999999, 115.0, 0.1066000670057564, 0.08630024955837115, 0.03789299256845247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a27be59d-220d-4cc5-8389-67e9f2d0878e", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/931735f6-5d4d-41c0-ac3a-9fa4633b2d44", 3, 0, 0.0, 380.3333333333333, 222, 481, 438.0, 481.0, 481.0, 481.0, 0.019624389190886434, 0.02705380476022267, 0.012584650620457771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fc2f3a8-5f1e-4784-94c0-b940ffbcd988", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 696.9411764705883, 164, 1254, 882.0, 1135.6, 1254.0, 1254.0, 0.07997666563167453, 56.333329547673145, 0.1678324662333813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae7f7f82-81ea-4515-badd-75be1a46a2e5", 1, 0, 0.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 0.17677501223091976, 0.674611668297456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d976f82-a47e-47e9-945d-172a888e70ac", 1, 0, 0.0, 1760.0, 1760, 1760, 1760.0, 1760.0, 1760.0, 1760.0, 0.5681818181818181, 0.10265003551136363, 0.39173473011363635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b4e0722-bcc2-4061-ab95-eccf857d243a", 3, 0, 0.0, 571.6666666666666, 419, 800, 496.0, 800.0, 800.0, 800.0, 0.06821282401091405, 0.030198385629831744, 0.04374324977262392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=893dd222-9616-4945-b8a6-6c7f916e98b6", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1349c943-44d1-4c09-a41f-60c8b4d96bcb", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 317.53333333333336, 165, 851, 323.0, 687.8000000000001, 851.0, 851.0, 0.11953810476319501, 9.706852098491428, 0.2668050029685296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b41744b-02e3-4e1a-8d9e-b29c761ce137", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 917.1666666666667, 772, 1143, 898.0, 1143.0, 1143.0, 1143.0, 0.09750548468351346, 116.6504580726416, 0.21986344153733647], "isController": false}, {"data": ["register", 24, 6, 25.0, 1327.4166666666665, 230, 3480, 1238.5, 2364.5, 3243.0, 3480.0, 0.10418656340620604, 0.03286353513691851, 0.04700604716178437], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 249.57142857142856, 165, 1073, 170.0, 334.4, 999.1999999999989, 1073.0, 0.10551226203216617, 6.166657873978164, 0.2360140120912028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 90.53846153846153, 85, 107, 89.0, 104.6, 107.0, 107.0, 0.07871250560069751, 0.06110980659429153, 0.027979835975247946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 425.0, 162, 986, 331.0, 984.0, 986.0, 986.0, 0.0947640375465092, 23.983469637165957, 0.20802206412283417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 100.22222222222223, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.04690480409426823, 0.034857964761463016, 0.023544012992630734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 105.33333333333333, 79, 234, 81.0, 234.0, 234.0, 234.0, 0.04690480409426823, 0.012550699533036619, 0.026750396085012354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 118.22222222222223, 80, 249, 82.0, 249.0, 249.0, 249.0, 0.0469045596443592, 0.012642244591643693, 0.027574750884672112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 125.66666666666667, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.04690431519699812, 0.0126421787054409, 0.027620412171669793], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 897.6071428571428, 630, 1369, 841.5, 1237.7000000000003, 1331.8999999999999, 1369.0, 0.24796315975912148, 296.6501450141693, 0.48963037991498404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1327.4166666666665, 230, 3480, 1238.5, 2364.5, 3243.0, 3480.0, 0.10274544388172288, 0.03240896325566063, 0.04635585456382419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 110.0, 77, 240, 82.0, 239.8, 240.0, 240.0, 0.056541897546081646, 0.01523980832296732, 0.03329566818387425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 96.45454545454547, 79, 240, 82.0, 210.2000000000001, 240.0, 240.0, 0.05654218818268267, 0.015239886658613689, 0.03324062234958493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 106.92307692307693, 80, 238, 83.0, 237.6, 238.0, 238.0, 0.07466072443875237, 0.02012339838388247, 0.0438923399532509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 113.30769230769232, 79, 334, 82.0, 296.4, 334.0, 334.0, 0.07472896379669122, 0.020141791023326933, 0.04400543473574689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 109.72727272727273, 78, 242, 81.0, 241.2, 242.0, 242.0, 0.05658785521740025, 0.015141672196843425, 0.03227276117867358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 99.15384615384615, 81, 255, 84.0, 196.19999999999993, 255.0, 255.0, 0.07472724555372888, 0.055534603385144224, 0.03750957442833657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 99.27272727272727, 79, 253, 82.0, 222.80000000000013, 253.0, 253.0, 0.05658727300787078, 0.04205362769432584, 0.02840415852152889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 107.0, 79, 245, 82.0, 242.2, 245.0, 245.0, 0.07466072443875237, 0.019977576656463034, 0.04257994440647595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 106.63636363636363, 83, 243, 89.0, 219.4000000000001, 243.0, 243.0, 0.055042658059996495, 0.04332459218394256, 0.01956594485726438], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 669.2666666666665, 397, 1915, 464.0, 1472.8000000000002, 1915.0, 1915.0, 0.08101539292465569, 0.014636570010802052, 0.055144266473129894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1783.6666666666665, 1060, 3362, 1619.5, 2861.5, 3260.25, 3362.0, 0.10079163429435356, 0.05216754509375721, 0.04636021460218802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 225.9090909090909, 162, 496, 166.0, 462.20000000000016, 496.0, 496.0, 0.05651749473359708, 0.08759107826388532, 0.12710917028464266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26d36625-bc1e-4683-8110-887b6b0592b6", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2db175a8-be5d-4e55-a634-30bd6192416a", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.8458724710982661, 3.449015534682081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43f3b73b-0adb-423e-a005-b3233f26d4e6", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ab0e60e-dcf5-4484-b82d-ffbd56ee0a68", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 999.6779661016944, 446, 3099, 802.0, 1672.0, 1977.0, 3099.0, 0.2794433866643933, 97.42990992243078, 1.0137963331344075], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 155.32142857142858, 79, 434, 85.0, 325.3, 331.75, 434.0, 0.248696563546413, 0.1848223484949417, 0.1202195302299555], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 525.0, 390, 749, 483.5, 660.1, 712.15, 749.0, 0.24855858215083065, 73.08447607401719, 0.12500749004656034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8feafff8-095d-4470-904b-05f06be57a3d", 3, 0, 0.0, 338.0, 200, 471, 343.0, 471.0, 471.0, 471.0, 0.03667930064800098, 0.030578023749847166, 0.023521556730651667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae623be6-ae8f-42ec-ad85-e9e775120de7", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 127.5714285714286, 77, 344, 86.0, 250.0, 270.2, 344.0, 0.24899955535793686, 0.4406124944419742, 0.12109548688305913], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 737.6785714285717, 544, 1027, 716.0, 936.9000000000001, 971.5, 1027.0, 0.24835685331866847, 223.4719331809191, 0.12466349863847224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 105.1578947368421, 83, 266, 87.0, 238.0, 266.0, 266.0, 0.09572752922208787, 0.07151519517079807, 0.03402814515316405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, 3.4482758620689653, 177.89080459770108, 80, 2034, 90.5, 338.0, 522.5, 1302.0, 0.7405862548893589, 1.6242429540559866, 0.35604884597295583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 90.33333333333333, 83, 104, 87.0, 104.0, 104.0, 104.0, 0.04787870727490358, 0.037077944208006385, 0.017019384226625883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8feafff8-095d-4470-904b-05f06be57a3d", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6294a14b-b6f8-4827-917e-7b4dd0887b85", 3, 0, 0.0, 302.3333333333333, 210, 464, 233.0, 464.0, 464.0, 464.0, 0.047298469106216594, 0.03040835823072193, 0.0303313750453277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a27be59d-220d-4cc5-8389-67e9f2d0878e", 3, 0, 0.0, 352.6666666666667, 296, 414, 348.0, 414.0, 414.0, 414.0, 0.03190403266972946, 0.026597079318742556, 0.02045929178364812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 87.2, 84, 93, 86.0, 92.4, 93.0, 93.0, 0.11990215983757255, 0.09730341291506131, 0.04262147087976211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43f3b73b-0adb-423e-a005-b3233f26d4e6", 3, 0, 0.0, 320.0, 243, 451, 266.0, 451.0, 451.0, 451.0, 0.030368060898084786, 0.030654738556302387, 0.019474309885816093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=931735f6-5d4d-41c0-ac3a-9fa4633b2d44", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 245.55555555555554, 162, 478, 168.0, 478.0, 478.0, 478.0, 0.04688452341881945, 0.0726618541656899, 0.10544439202494256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 238.84615384615384, 164, 493, 170.0, 462.59999999999997, 493.0, 493.0, 0.0746251521205024, 0.11565441056175518, 0.16783371614601272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 108.7, 84, 213, 98.0, 203.70000000000005, 213.0, 213.0, 0.09557488292076843, 0.07924128476536367, 0.0339738841632419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae7f7f82-81ea-4515-badd-75be1a46a2e5", 3, 0, 0.0, 673.3333333333334, 312, 999, 709.0, 999.0, 999.0, 999.0, 0.02235652698805416, 0.02642465803828928, 0.014336705132313379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d976f82-a47e-47e9-945d-172a888e70ac", 3, 0, 0.0, 517.3333333333334, 206, 843, 503.0, 843.0, 843.0, 843.0, 0.02316745436011491, 0.027383146738794675, 0.014856733427547649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 98.41176470588235, 84, 237, 87.0, 133.7999999999999, 237.0, 237.0, 0.07980733570251582, 0.061959796761230534, 0.028369013863003667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b41744b-02e3-4e1a-8d9e-b29c761ce137", 3, 0, 0.0, 274.0, 200, 397, 225.0, 397.0, 397.0, 397.0, 0.03320273590543861, 0.02767975477012639, 0.02129211905394338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b2f23c8-d9cc-415e-ab98-6a3c3438d419", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b4e0722-bcc2-4061-ab95-eccf857d243a", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 116.63157894736841, 79, 245, 83.0, 245.0, 245.0, 245.0, 0.09487666034155598, 0.07050892433586338, 0.04762363614800759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 157.78947368421052, 77, 249, 86.0, 247.0, 249.0, 249.0, 0.09480754069239444, 0.05534663071464926, 0.05239364090895482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 279.89473684210526, 78, 901, 83.0, 890.0, 901.0, 901.0, 0.0948070676173986, 17.979661389073236, 0.054020926788984416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 209.05263157894737, 78, 657, 83.0, 643.0, 657.0, 657.0, 0.09488045063220343, 5.893453155274354, 0.054155397012264544], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 50.0, 0.45317220543806647], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.45317220543806647], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 12, "406/Not Acceptable", 6, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
