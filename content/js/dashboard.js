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

    var data = {"OkPercent": 99.08883826879271, "KoPercent": 0.9111617312072893};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8077930582842174, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f628b1b-bb4c-46cf-9ad5-cf139a0e791d"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02e81356-b3aa-4ec3-b6d2-d7fef675dff6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9506dfb-49c0-47e8-9d2c-e487e901165e"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47666a78-9f84-4bb1-aa1d-a4b3313884f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/25a6c43d-36e9-4dba-a40c-f6fa2757c2d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7988e356-c5bb-402b-96e7-a0d8495614f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39a8b6b5-494c-4ac6-87e0-da9af30ca57f"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/868e2b7e-1fda-4c63-9ece-537305e2fe54"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b0fc240-0256-4f12-a7ef-70f020fdf888"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=baf8e670-5f9f-4c94-9efb-187eed2a06ab"], "isController": false}, {"data": [0.10526315789473684, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55ff9055-991d-4d6c-a257-05360761d255"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b68633fd-e63b-4b14-b889-9b9e37f12b65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9506dfb-49c0-47e8-9d2c-e487e901165e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=462bd76e-935b-4b3a-9abc-ff4850325d3f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f628b1b-bb4c-46cf-9ad5-cf139a0e791d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60d28a97-979b-4cb0-b4e8-7d5ca3cb0466"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39a8b6b5-494c-4ac6-87e0-da9af30ca57f"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b68633fd-e63b-4b14-b889-9b9e37f12b65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2d11b1a-bbbe-433d-b06e-ac13aca5aa0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83e83578-2952-44b0-b8a7-5b80d64ab582"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47666a78-9f84-4bb1-aa1d-a4b3313884f3"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9532967032967034, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/462bd76e-935b-4b3a-9abc-ff4850325d3f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55ff9055-991d-4d6c-a257-05360761d255"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83e83578-2952-44b0-b8a7-5b80d64ab582"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2d11b1a-bbbe-433d-b06e-ac13aca5aa0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/baf8e670-5f9f-4c94-9efb-187eed2a06ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60d28a97-979b-4cb0-b4e8-7d5ca3cb0466"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02e81356-b3aa-4ec3-b6d2-d7fef675dff6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 12, 0.9111617312072893, 353.3166287015948, 0, 4373, 128.0, 901.4000000000001, 1043.8999999999983, 1644.599999999998, 5.179452087118619, 699.7231002837982, 3.7850178965407397], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/6f628b1b-bb4c-46cf-9ad5-cf139a0e791d", 3, 0, 0.0, 314.3333333333333, 235, 380, 328.0, 380.0, 380.0, 380.0, 0.022293064627594353, 0.026349647676691117, 0.01429600824100289], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1714.339285714286, 1334, 4846, 1618.0, 1982.9000000000003, 2100.75, 4846.0, 0.2601263470828688, 313.01977185235506, 1.2790392163693793], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02e81356-b3aa-4ec3-b6d2-d7fef675dff6", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9506dfb-49c0-47e8-9d2c-e487e901165e", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 933.5384615384615, 117, 3311, 483.0, 2980.9999999999995, 3311.0, 3311.0, 0.06389242481581779, 0.01210461954518423, 0.04319170154128187], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 933.5384615384615, 117, 3311, 483.0, 2980.9999999999995, 3311.0, 3311.0, 0.06532433532488807, 0.012375899465847934, 0.04415968251116795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47666a78-9f84-4bb1-aa1d-a4b3313884f3", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 138.7222222222222, 108, 339, 115.0, 334.5, 339.0, 339.0, 0.1070001902225604, 0.028630910274396047, 0.06102354598630398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 125.94444444444444, 109, 329, 113.0, 145.4000000000003, 329.0, 329.0, 0.10699828208313766, 0.07951727799342555, 0.05370812206126246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 181.49999999999997, 109, 464, 113.5, 356.00000000000017, 464.0, 464.0, 0.10699701002799755, 0.028839037859108713, 0.06300702836609622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 182.0, 109, 461, 114.5, 355.70000000000016, 461.0, 461.0, 0.10699637401176959, 0.028838866432859777, 0.06290216519051299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25a6c43d-36e9-4dba-a40c-f6fa2757c2d6", 1, 0, 0.0, 935.0, 935, 935, 935.0, 935.0, 935.0, 935.0, 1.0695187165775402, 0.3415357620320855, 0.6381600935828876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7988e356-c5bb-402b-96e7-a0d8495614f6", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39a8b6b5-494c-4ac6-87e0-da9af30ca57f", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 296.92307692307696, 108, 1039, 216.0, 759.3999999999997, 1039.0, 1039.0, 0.06384096723976213, 0.15562194913839247, 0.041267392059656925], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 127.68750000000003, 108, 325, 114.5, 185.00000000000014, 325.0, 325.0, 0.09404462417417064, 0.06989058495756235, 0.0472059929936755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 142.8125, 108, 351, 115.5, 334.20000000000005, 351.0, 351.0, 0.09404241312832087, 0.0428196046104293, 0.05264630207598627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 697.6666666666666, 562, 968, 563.0, 968.0, 968.0, 968.0, 0.13905627143784186, 40.88716090548809, 0.07930552980439418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1007.3333333333334, 977, 1031, 1014.0, 1031.0, 1031.0, 1031.0, 0.1362088535754824, 122.5609658768445, 0.07754859534619751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 350.0, 325, 383, 342.0, 383.0, 383.0, 383.0, 0.140607424071991, 0.24880923087739035, 0.07785586860236221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 113.6875, 110, 118, 114.5, 116.6, 118.0, 118.0, 0.10612824271529109, 0.07887069600228176, 0.05327140308169885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 194.50000000000003, 107, 340, 115.5, 336.5, 340.0, 340.0, 0.10597570506961279, 0.04825309813350289, 0.059326731378081574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 254.74999999999997, 108, 1022, 116.5, 849.8000000000002, 1022.0, 1022.0, 0.10613457864572277, 11.962540816208076, 0.061255406230099764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 198.1875, 109, 569, 113.5, 563.4, 569.0, 569.0, 0.10597500314613291, 3.9200143314633156, 0.06126679869385808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 191.66666666666669, 114, 346, 115.0, 346.0, 346.0, 346.0, 0.14201183431952663, 0.10553809171597633, 0.07974297337278106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 238.1875, 108, 783, 117.0, 776.0, 783.0, 783.0, 0.09404351863824985, 10.599744631437574, 0.054277069839068035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 501.1500000000001, 110, 1022, 436.0, 1014.5, 1021.65, 1022.0, 0.09169348701161756, 41.26533752659111, 0.04996578686765879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 197.75, 112, 757, 116.0, 626.1000000000001, 757.0, 757.0, 0.09404296588003644, 3.4786483895142095, 0.054368589649396074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 440.24999999999994, 110, 922, 437.0, 896.3000000000002, 921.25, 922.0, 0.09169180550334217, 13.492574539707135, 0.05005441335582839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/868e2b7e-1fda-4c63-9ece-537305e2fe54", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 392.1538461538462, 0, 624, 425.0, 584.8, 624.0, 624.0, 0.0664295642220587, 0.021392994427581555, 0.04227698828795683], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 411.4375, 225, 1138, 343.0, 967.2000000000002, 1138.0, 1138.0, 0.10589294223540001, 15.97919586306057, 0.23476899620109068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b0fc240-0256-4f12-a7ef-70f020fdf888", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 460.52631578947364, 137, 1305, 307.0, 1133.0, 1305.0, 1305.0, 0.08451957295373666, 0.05191680799599644, 0.03821539284919929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 114.99999999999999, 109, 120, 116.0, 118.0, 119.9, 120.0, 0.09168928335656129, 0.06814018030697573, 0.04602372230983643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 204.54999999999995, 110, 349, 116.0, 344.8, 348.8, 349.0, 0.09169390739832292, 0.09339525919575274, 0.04844375381102803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=baf8e670-5f9f-4c94-9efb-187eed2a06ab", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["login", 19, 0, 0.0, 2187.5789473684213, 1261, 3342, 2262.0, 3093.0, 3342.0, 3342.0, 0.08803143185440528, 16.75218330258025, 0.15586938712748805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 150.0, 111, 346, 119.0, 343.9, 346.0, 346.0, 0.09269505066363863, 0.07504316113296525, 0.03295019379059029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55ff9055-991d-4d6c-a257-05360761d255", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 644.8499999999999, 225, 1141, 672.5, 1126.8, 1140.3, 1141.0, 0.09164138891689041, 54.8884935501645, 0.19437997727293554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b68633fd-e63b-4b14-b889-9b9e37f12b65", 3, 0, 0.0, 317.3333333333333, 208, 431, 313.0, 431.0, 431.0, 431.0, 0.01858666964053381, 0.025623224585827043, 0.011919185934847526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9506dfb-49c0-47e8-9d2c-e487e901165e", 3, 0, 0.0, 313.3333333333333, 218, 382, 340.0, 382.0, 382.0, 382.0, 0.02260261587607739, 0.027112838379995178, 0.014494516040323065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=462bd76e-935b-4b3a-9abc-ff4850325d3f", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f628b1b-bb4c-46cf-9ad5-cf139a0e791d", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.2895257411858974, 1.104892828525641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 355.5555555555555, 224, 672, 232.5, 597.3000000000001, 672.0, 672.0, 0.10692518801012225, 0.16571315758990626, 0.2404772538938589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 926.5, 108, 1361, 1118.5, 1361.0, 1361.0, 1361.0, 0.07478033277248083, 67.10245927977192, 0.13853348756776968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60d28a97-979b-4cb0-b4e8-7d5ca3cb0466", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1005.4285714285713, 1, 1957, 1026.0, 1726.8000000000002, 1937.6999999999998, 1957.0, 0.08227937373642391, 0.0329018012815992, 0.03535441840236964], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 368.9375, 226, 898, 233.0, 890.3, 898.0, 898.0, 0.09397999400877538, 14.181537501688704, 0.2083575013656468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 162.72727272727272, 112, 362, 118.0, 360.4, 362.0, 362.0, 0.12384040349455101, 0.09614562575992976, 0.04402139342970368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 378.0588235294117, 226, 1088, 288.0, 592.7999999999995, 1088.0, 1088.0, 0.0819000819000819, 5.883049242424242, 0.18296256232837116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 115.55555555555556, 109, 118, 117.0, 118.0, 118.0, 118.0, 0.05126773721297188, 0.038100339862374606, 0.025734000905730022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 164.11111111111111, 109, 341, 116.0, 341.0, 341.0, 341.0, 0.051202403099452135, 0.013700643016845591, 0.029201370517656297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 113.88888888888889, 108, 121, 114.0, 121.0, 121.0, 121.0, 0.0512683213042661, 0.013818414726540471, 0.03014016545426581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 137.88888888888889, 109, 330, 114.0, 330.0, 330.0, 330.0, 0.05120531624972264, 0.013801432895433055, 0.030153130565022217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1127.642857142857, 867, 4373, 921.5, 1462.0000000000002, 1549.4499999999998, 4373.0, 0.2520195315136923, 301.5029758556288, 0.4976401296100447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39a8b6b5-494c-4ac6-87e0-da9af30ca57f", 3, 0, 0.0, 312.0, 203, 445, 288.0, 445.0, 445.0, 445.0, 0.0896030584510618, 0.04054305053612496, 0.057460294644723874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1005.4285714285713, 1, 1957, 1026.0, 1726.8000000000002, 1937.6999999999998, 1957.0, 0.08307553544160581, 0.033220169701561025, 0.035696519135065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 174.16666666666669, 109, 350, 116.0, 348.2, 350.0, 350.0, 0.062200336918491646, 0.0167649345600622, 0.036627737462744586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 208.00000000000003, 110, 345, 124.0, 344.7, 345.0, 345.0, 0.062201304154010435, 0.016765195260260622, 0.036567563574916286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b68633fd-e63b-4b14-b889-9b9e37f12b65", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 132.8181818181818, 109, 343, 111.0, 297.60000000000014, 343.0, 343.0, 0.13002364066193853, 0.03504543439716312, 0.07643967937352246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 133.63636363636363, 109, 335, 115.0, 291.40000000000015, 335.0, 335.0, 0.1300328628507932, 0.035047920065252855, 0.07657208622951983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 132.91666666666666, 109, 329, 114.5, 268.4000000000002, 329.0, 329.0, 0.06220259384816347, 0.016644053432028114, 0.035474916804030726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 115.0909090909091, 111, 117, 116.0, 117.0, 117.0, 117.0, 0.13002671457954088, 0.09663118144045958, 0.06526731571668361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2d11b1a-bbbe-433d-b06e-ac13aca5aa0a", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 154.58333333333334, 113, 351, 116.0, 348.90000000000003, 351.0, 351.0, 0.06220098173882845, 0.04622553428051606, 0.03122197716187287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 173.81818181818184, 109, 343, 114.0, 343.0, 343.0, 343.0, 0.1300328628507932, 0.0347939496299974, 0.074159367094593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 125.08333333333336, 115, 183, 117.5, 171.60000000000005, 183.0, 183.0, 0.06238076177306918, 0.04910048241122438, 0.022174411411520687], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 508.0, 380, 1290, 419.0, 1120.8000000000006, 1290.0, 1290.0, 0.06286441716827232, 0.011357340992314825, 0.04278954957645099], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1148.5263157894735, 696, 2421, 1061.0, 1895.0, 2421.0, 2421.0, 0.0853445449114438, 0.04417246953424337, 0.039255156887978544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83e83578-2952-44b0-b8a7-5b80d64ab582", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 386.5, 230, 702, 347.5, 697.8000000000001, 702.0, 702.0, 0.06216328222130128, 0.09634094617695815, 0.13980667866763366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47666a78-9f84-4bb1-aa1d-a4b3313884f3", 3, 0, 0.0, 296.6666666666667, 216, 409, 265.0, 409.0, 409.0, 409.0, 0.02998380874327863, 0.024996267640474145, 0.01922789818498011], "isController": false}, {"data": ["addBook", 63, 5, 7.936507936507937, 1098.1904761904766, 579, 3191, 941.0, 1618.8, 2117.7999999999984, 3191.0, 0.2734280059720149, 78.89928884305233, 0.9966822101988647], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 197.30357142857133, 111, 466, 118.0, 457.3, 464.15, 466.0, 0.2531290822714719, 0.1881164371177638, 0.12236220285583847], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 701.2321428571428, 538, 3987, 568.0, 806.4000000000001, 919.0, 3987.0, 0.25302843407027864, 74.39876095138692, 0.1272555112755796], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 179.26785714285714, 110, 348, 116.5, 343.0, 344.45, 348.0, 0.2532950978352315, 0.44821359109124953, 0.1231845300018997], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 926.9285714285712, 751, 4252, 797.5, 1033.3, 1108.75, 4252.0, 0.2525571410531633, 227.25135946773582, 0.1267718461927011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 121.11764705882354, 110, 165, 119.0, 132.19999999999996, 165.0, 165.0, 0.07936063339121992, 0.0592879731877766, 0.028210225150785206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 5, 2.7472527472527473, 201.59340659340668, 110, 2730, 120.5, 304.2000000000001, 420.4499999999998, 2241.129999999993, 0.7585419323647337, 1.542306458494836, 0.3681025302791601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 119.77777777777777, 116, 131, 117.0, 131.0, 131.0, 131.0, 0.0496653109876223, 0.03846151524725047, 0.017654466015131366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 148.33333333333334, 111, 426, 118.0, 350.4000000000001, 426.0, 426.0, 0.11269863133773275, 0.09145758070474211, 0.040060841608334695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/462bd76e-935b-4b3a-9abc-ff4850325d3f", 3, 0, 0.0, 260.6666666666667, 187, 389, 206.0, 389.0, 389.0, 389.0, 0.020099963820065125, 0.027709422779289, 0.012889625236174576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55ff9055-991d-4d6c-a257-05360761d255", 3, 0, 0.0, 612.6666666666666, 381, 1039, 418.0, 1039.0, 1039.0, 1039.0, 0.041168075529695904, 0.026949544235097156, 0.026400100518717752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 282.55555555555554, 225, 458, 234.0, 458.0, 458.0, 458.0, 0.05116863476397046, 0.07930139001017687, 0.11507945884904684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 291.09090909090907, 227, 461, 232.0, 460.8, 461.0, 461.0, 0.12984866728049674, 0.2012400732169417, 0.2920326960419765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83e83578-2952-44b0-b8a7-5b80d64ab582", 3, 0, 0.0, 370.0, 189, 497, 424.0, 497.0, 497.0, 497.0, 0.05876821814762576, 0.026591088289453065, 0.03768665030951261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2d11b1a-bbbe-433d-b06e-ac13aca5aa0a", 3, 0, 0.0, 401.0, 223, 726, 254.0, 726.0, 726.0, 726.0, 0.016532751380484743, 0.022791732453239868, 0.010602057363136373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 148.62499999999997, 115, 355, 122.0, 342.40000000000003, 355.0, 355.0, 0.10752977230570715, 0.08915310223393103, 0.038223473749294336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/baf8e670-5f9f-4c94-9efb-187eed2a06ab", 3, 0, 0.0, 674.6666666666667, 195, 1290, 539.0, 1290.0, 1290.0, 1290.0, 0.020914813962729803, 0.02472060205034893, 0.013412169110214098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 144.10000000000002, 112, 359, 120.5, 313.9000000000004, 357.65, 359.0, 0.09181303194175382, 0.07128062538446707, 0.0326366636980453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60d28a97-979b-4cb0-b4e8-7d5ca3cb0466", 3, 0, 0.0, 935.6666666666667, 199, 2226, 382.0, 2226.0, 2226.0, 2226.0, 0.016073638696749375, 0.022158808554926305, 0.010307639398631599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02e81356-b3aa-4ec3-b6d2-d7fef675dff6", 3, 0, 0.0, 398.3333333333333, 290, 485, 420.0, 485.0, 485.0, 485.0, 0.022180326050792946, 0.02224530747476988, 0.01422371169272855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 117.17647058823529, 109, 171, 115.0, 129.39999999999998, 171.0, 171.0, 0.08194508715101033, 0.060898643869061395, 0.041132592573846986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 204.29411764705878, 109, 345, 116.0, 343.4, 345.0, 345.0, 0.08194666718084183, 0.029167138663401655, 0.04633037100148468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 216.70588235294122, 108, 974, 116.0, 467.59999999999957, 974.0, 974.0, 0.08194864230381736, 4.358290347956346, 0.047762576103775906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 186.58823529411768, 108, 674, 114.0, 421.9999999999998, 674.0, 674.0, 0.0819470621978202, 1.4381502288492223, 0.047841681589869414], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 25.0, 0.22779043280182232], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07593014426727411], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 2, 16.666666666666668, 0.15186028853454822], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.45558086560364464], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 12, "401/Unauthorized", 6, "406/Not Acceptable", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 2, "Test failed: code expected to contain /200/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
