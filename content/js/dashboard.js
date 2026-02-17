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

    var data = {"OkPercent": 66.56, "KoPercent": 33.44};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4882903981264637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed44a055-a6ef-43b4-9996-ef400b80d224"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73cadeec-3daf-4374-95d5-338beb0e87fd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/130e3304-ff89-491b-865f-d10657911aba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed44a055-a6ef-43b4-9996-ef400b80d224"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75eeeeb1-bfe7-49f4-9bdd-7ac6b5d8e2f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54c3edbb-f03b-48c3-831b-57eee2fbf11d"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3853434-ae5f-4f24-9aee-32684e7318ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86c24dcb-9022-408b-a2d4-f5d8134fa817"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75eeeeb1-bfe7-49f4-9bdd-7ac6b5d8e2f7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a245e560-dce5-4c84-b8c9-08dad73ee077"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=878ebfe0-58de-4863-9b86-5e1bcc388247"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82c3af80-f474-4071-baa7-17d61ee7d82e"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82c3af80-f474-4071-baa7-17d61ee7d82e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a245e560-dce5-4c84-b8c9-08dad73ee077"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73cadeec-3daf-4374-95d5-338beb0e87fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf600781-6297-44ef-a737-11ad53749eb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70309fa6-19b0-4475-88df-1e25f9cd56ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cda012bf-fe23-4de3-bfcc-7a9eba315d95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf600781-6297-44ef-a737-11ad53749eb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=130e3304-ff89-491b-865f-d10657911aba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70309fa6-19b0-4475-88df-1e25f9cd56ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af6351ac-c20e-46b6-9d69-1a51fce9d504"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33704691-ff1e-4e06-9ce6-1eb1db328610"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=266eda09-b25c-415c-b59a-1bd99e5cc4f6"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33704691-ff1e-4e06-9ce6-1eb1db328610"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/878ebfe0-58de-4863-9b86-5e1bcc388247"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/266eda09-b25c-415c-b59a-1bd99e5cc4f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fa824d6-4934-4c91-b6ad-2d9a52252729"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82ff24e9-73dd-45b0-9fea-3819476a88b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3853434-ae5f-4f24-9aee-32684e7318ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82ff24e9-73dd-45b0-9fea-3819476a88b4"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 625, 209, 33.44, 283.8672000000002, 103, 2493, 115.0, 717.7999999999992, 1061.3999999999978, 1683.1800000000005, 2.4562492876877067, 2.553639571944524, 1.1793949607098364], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 58, 100.0, 604.1896551724141, 420, 830, 643.0, 785.1, 793.35, 830.0, 0.26216822159542924, 1.6852448024020033, 0.4401046610571708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 160.27777777777777, 107, 341, 112.5, 329.3, 341.0, 341.0, 0.09412749045651832, 0.07307749503216023, 0.033459381373215503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 135.26315789473685, 103, 404, 109.0, 325.0, 404.0, 404.0, 0.10446907715316266, 0.051928476827109174, 0.0524385797428961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed44a055-a6ef-43b4-9996-ef400b80d224", 3, 0, 0.0, 356.3333333333333, 192, 610, 267.0, 610.0, 610.0, 610.0, 0.025400480915772006, 0.02547489638720493, 0.01628871985809598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, 100.0, 148.28571428571428, 103, 503, 109.0, 323.6, 485.2999999999997, 503.0, 0.1346153846153846, 0.06691331129807693, 0.06757061298076923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73cadeec-3daf-4374-95d5-338beb0e87fd", 3, 0, 0.0, 335.66666666666663, 195, 617, 195.0, 617.0, 617.0, 617.0, 0.06436663233779609, 0.04138154259998284, 0.04127677920099554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/130e3304-ff89-491b-865f-d10657911aba", 3, 0, 0.0, 386.3333333333333, 240, 636, 283.0, 636.0, 636.0, 636.0, 0.062497395941835766, 0.028278444127328026, 0.04007808268405483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed44a055-a6ef-43b4-9996-ef400b80d224", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 120.0, 113, 132, 115.0, 132.0, 132.0, 132.0, 0.032803376560894, 0.00967443332166991, 0.020277868518599515], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 197.55172413793105, 103, 446, 110.5, 436.1, 444.05, 446.0, 0.2627228047924263, 0.13059170667904788, 0.1269997933322764], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 540.0625, 120, 1470, 471.0, 1156.4000000000003, 1470.0, 1470.0, 0.07666800835681291, 0.015493638651697237, 0.05142240868121442], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 540.0625, 120, 1470, 471.0, 1156.4000000000003, 1470.0, 1470.0, 0.07772876547288238, 0.015708004301801366, 0.05213387474252346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75eeeeb1-bfe7-49f4-9bdd-7ac6b5d8e2f7", 3, 0, 0.0, 273.6666666666667, 185, 402, 234.0, 402.0, 402.0, 402.0, 0.04082965866405357, 0.026249536413250587, 0.026183081890685394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54c3edbb-f03b-48c3-831b-57eee2fbf11d", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, 24.0, 966.76, 131, 1958, 878.0, 1679.0000000000002, 1891.3999999999999, 1958.0, 0.10276224926011181, 0.03245039152416968, 0.046363436677902006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3853434-ae5f-4f24-9aee-32684e7318ea", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86c24dcb-9022-408b-a2d4-f5d8134fa817", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 156.6, 106, 333, 116.0, 331.3, 333.0, 333.0, 0.04745026026467755, 0.03734854470051768, 0.016867084703459597], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 471.3333333333333, 118, 860, 441.0, 725.6000000000001, 860.0, 860.0, 0.08015646542050081, 0.017862993563435826, 0.05365160292891725], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1298.2083333333333, 781, 2493, 1266.0, 1815.5, 2344.5, 2493.0, 0.10247126534934162, 0.05303688538588971, 0.04713277927689444], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 240.94117647058826, 109, 835, 200.0, 498.9999999999997, 835.0, 835.0, 0.07780783296031343, 0.12797529143610376, 0.049134967126190573], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, 100.0, 132.2, 106, 310, 110.5, 292.20000000000005, 310.0, 310.0, 0.04749962000303998, 0.023610650958542333, 0.023842582696838425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75eeeeb1-bfe7-49f4-9bdd-7ac6b5d8e2f7", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a245e560-dce5-4c84-b8c9-08dad73ee077", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.2599482913669065, 0.9920188848920864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=878ebfe0-58de-4863-9b86-5e1bcc388247", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82c3af80-f474-4071-baa7-17d61ee7d82e", 3, 0, 0.0, 348.0, 206, 432, 406.0, 432.0, 432.0, 432.0, 0.017905316685367774, 0.02468392453207439, 0.011482250608780767], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 664.9482758620688, 426, 1579, 591.5, 885.0000000000002, 1286.0499999999995, 1579.0, 0.27611027273030214, 0.9301660068384897, 0.5385665875031538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82c3af80-f474-4071-baa7-17d61ee7d82e", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a245e560-dce5-4c84-b8c9-08dad73ee077", 3, 0, 0.0, 297.6666666666667, 189, 470, 234.0, 470.0, 470.0, 470.0, 0.018318261474864293, 0.025253202261084077, 0.011747062208815969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73cadeec-3daf-4374-95d5-338beb0e87fd", 1, 0, 0.0, 1073.0, 1073, 1073, 1073.0, 1073.0, 1073.0, 1073.0, 0.9319664492078285, 0.16837284482758622, 0.6425471808014912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf600781-6297-44ef-a737-11ad53749eb4", 1, 0, 0.0, 1003.0, 1003, 1003, 1003.0, 1003.0, 1003.0, 1003.0, 0.9970089730807576, 0.18012369142572285, 0.6873909521435694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70309fa6-19b0-4475-88df-1e25f9cd56ba", 1, 0, 0.0, 889.0, 889, 889, 889.0, 889.0, 889.0, 889.0, 1.124859392575928, 0.2032216676040495, 0.7755378233970753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cda012bf-fe23-4de3-bfcc-7a9eba315d95", 2, 0, 0.0, 191.5, 178, 205, 191.5, 205.0, 205.0, 205.0, 0.036751869751373595, 0.030973499604917402, 0.022844301852294236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf600781-6297-44ef-a737-11ad53749eb4", 3, 0, 0.0, 295.0, 200, 360, 325.0, 360.0, 360.0, 360.0, 0.04307003187182359, 0.02768988051655325, 0.027619779553220203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=130e3304-ff89-491b-865f-d10657911aba", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70309fa6-19b0-4475-88df-1e25f9cd56ba", 3, 0, 0.0, 349.33333333333337, 210, 608, 230.0, 608.0, 608.0, 608.0, 0.018825183074905404, 0.025939778631534693, 0.012072138885925666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 121.0, 104, 321, 110.0, 124.0, 301.39999999999975, 321.0, 0.12766888770001458, 0.0953776358305773, 0.04538229992461456], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 572.25, 113, 1599, 458.0, 1230.8000000000004, 1599.0, 1599.0, 0.0779423226812159, 0.01575116152328527, 0.05269574635863211], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 177.61494252873567, 105, 1243, 114.0, 317.5, 408.0, 978.25, 0.7147962830593281, 1.6043962346359881, 0.3409620313257417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 129.27272727272728, 105, 308, 113.0, 269.60000000000014, 308.0, 308.0, 0.05068003390954996, 0.03924733094753234, 0.01801516830378534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af6351ac-c20e-46b6-9d69-1a51fce9d504", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33704691-ff1e-4e06-9ce6-1eb1db328610", 3, 0, 0.0, 352.0, 248, 415, 393.0, 415.0, 415.0, 415.0, 0.049152125829442124, 0.032176082370770874, 0.03152008069140657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, 100.0, 138.19999999999996, 104, 408, 107.5, 378.8000000000001, 408.0, 408.0, 0.059122270768175667, 0.029387925606446694, 0.029676608569181927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 109.92857142857143, 105, 114, 110.5, 113.5, 114.0, 114.0, 0.09034589571502323, 0.07331781185467216, 0.03211514261744966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=266eda09-b25c-415c-b59a-1bd99e5cc4f6", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 573.2083333333331, 142, 1423, 548.0, 1033.0, 1335.0, 1423.0, 0.10015147911215715, 0.061518828478073086, 0.04528333479387574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33704691-ff1e-4e06-9ce6-1eb1db328610", 1, 0, 0.0, 1599.0, 1599, 1599, 1599.0, 1599.0, 1599.0, 1599.0, 0.6253908692933083, 0.11298565509693559, 0.43117768918073796], "isController": false}, {"data": ["login", 24, 6, 25.0, 2111.4583333333335, 1339, 3244, 2110.5, 2938.5, 3178.0, 3244.0, 0.10006379066654993, 0.14965595254474728, 0.1500956859998249], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, 100.0, 125.36363636363636, 104, 306, 108.0, 267.0000000000001, 306.0, 306.0, 0.051236189518007194, 0.02546798873502506, 0.025718165441655953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/878ebfe0-58de-4863-9b86-5e1bcc388247", 3, 0, 0.0, 377.0, 196, 514, 421.0, 514.0, 514.0, 514.0, 0.09373242517028058, 0.042411481440979816, 0.06010835858901456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 147.31578947368425, 108, 324, 115.0, 321.0, 324.0, 324.0, 0.10051793187000387, 0.08137633351585274, 0.035730983594415434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, 100.0, 108.5, 104, 115, 108.0, 112.30000000000001, 115.0, 115.0, 0.09052914283989921, 0.04499934932178584, 0.04544138615205879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/266eda09-b25c-415c-b59a-1bd99e5cc4f6", 3, 0, 0.0, 363.6666666666667, 182, 606, 303.0, 606.0, 606.0, 606.0, 0.058973854924316886, 0.03668588436209947, 0.037818520247690196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fa824d6-4934-4c91-b6ad-2d9a52252729", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 197.8, 105, 334, 121.5, 333.9, 334.0, 334.0, 0.05969187056414787, 0.04949062315328276, 0.021218594614599438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 13, 100.0, 109.38461538461539, 103, 126, 108.0, 120.8, 126.0, 126.0, 0.08499342935411532, 0.04224771048949677, 0.04266271746876491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82ff24e9-73dd-45b0-9fea-3819476a88b4", 3, 0, 0.0, 508.66666666666663, 195, 860, 471.0, 860.0, 860.0, 860.0, 0.03409517098728251, 0.028423741177874506, 0.021864416290672695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3853434-ae5f-4f24-9aee-32684e7318ea", 3, 0, 0.0, 523.3333333333334, 294, 835, 441.0, 835.0, 835.0, 835.0, 0.09721952167995333, 0.0439893018018018, 0.06234455003564716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 111.92307692307693, 104, 122, 111.0, 121.2, 122.0, 122.0, 0.07999064724739877, 0.062102113829767595, 0.028434175388723778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 137.14285714285714, 103, 314, 109.0, 310.5, 314.0, 314.0, 0.09043343453265293, 0.04495177556359408, 0.04539334506814805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, 100.0, 111.63636363636364, 103, 122, 109.0, 121.2, 122.0, 122.0, 0.08212264643961, 0.04082072952906395, 0.04662414097845401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82ff24e9-73dd-45b0-9fea-3819476a88b4", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["register", 25, 6, 24.0, 966.76, 131, 1958, 878.0, 1679.0000000000002, 1891.3999999999999, 1958.0, 0.1039630723167131, 0.03282958893001206, 0.04690521426789204], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 2.8708133971291865, 0.96], "isController": false}, {"data": ["401/Unauthorized", 18, 8.61244019138756, 2.88], "isController": false}, {"data": ["404/Not Found", 185, 88.51674641148325, 29.6], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 625, 209, "404/Not Found", 185, "401/Unauthorized", 18, "406/Not Acceptable", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
