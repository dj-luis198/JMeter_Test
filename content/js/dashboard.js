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

    var data = {"OkPercent": 97.46932515337423, "KoPercent": 2.5306748466257667};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7560497056899934, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10714285714285714, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26d25248-7e71-43c9-bac5-fb80f8db1cbe"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d77cb94c-41cf-48fb-aa2e-7fd7b8460f3c"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/103b5e32-3241-49e1-a5d3-6291b9056ca2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3c29401-5acb-45bb-b699-208313ad7c94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73ad55e0-6a28-4a2e-ad2b-e3f6bcf48a0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/f7033106-83e8-423a-ab28-6030d2cca5c9"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7033106-83e8-423a-ab28-6030d2cca5c9"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06b09ea4-934c-4c60-8db3-a484e91eb057"], "isController": false}, {"data": [0.057692307692307696, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=717f7347-56e5-4fe2-b53f-e45e34f48197"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/61b17380-6ecd-492c-b794-1691b4db2b34"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d77cb94c-41cf-48fb-aa2e-7fd7b8460f3c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49448227-f7c8-4938-b67a-2b0f8eece8d5"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1dd1bd14-e640-48a9-a1be-3765c28fc789"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51f5c661-8c24-4d69-87b2-bc8b92ac79b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7627ffe6-938f-4219-a36d-405b83e29fb1"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ede576b-9b2f-4493-bd9e-8022e57b39f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=103b5e32-3241-49e1-a5d3-6291b9056ca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3c29401-5acb-45bb-b699-208313ad7c94"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.45535714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49448227-f7c8-4938-b67a-2b0f8eece8d5"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24528301886792453, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97485d07-40a0-4f8a-a3ba-062086a25d7d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73ad55e0-6a28-4a2e-ad2b-e3f6bcf48a0b"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9135802469135802, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1dd1bd14-e640-48a9-a1be-3765c28fc789"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61b17380-6ecd-492c-b794-1691b4db2b34"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97485d07-40a0-4f8a-a3ba-062086a25d7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7627ffe6-938f-4219-a36d-405b83e29fb1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/717f7347-56e5-4fe2-b53f-e45e34f48197"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51f5c661-8c24-4d69-87b2-bc8b92ac79b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d6da841-cae2-40f4-93e6-894dc7a5c2b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06b09ea4-934c-4c60-8db3-a484e91eb057"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 33, 2.5306748466257667, 392.51073619631853, 113, 2749, 143.5, 968.5, 1147.0, 1567.0, 5.071916982364976, 766.3875028806661, 3.7009759562838878], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1757.3214285714284, 1416, 2420, 1715.0, 2020.0000000000002, 2087.2, 2420.0, 0.2511176979681888, 302.17988764444874, 1.234743759052569], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/26d25248-7e71-43c9-bac5-fb80f8db1cbe", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.670873818277311, 1.2535287552521008], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 588.625, 125, 1087, 583.0, 968.7000000000002, 1087.0, 1087.0, 0.10748570775979632, 0.02172150747025669, 0.07209231216872569], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 588.625, 125, 1087, 583.0, 968.7000000000002, 1087.0, 1087.0, 0.1099648799664607, 0.022222516941464317, 0.07375513097848124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 188.47826086956522, 115, 434, 122.0, 391.6, 427.19999999999993, 434.0, 0.10855764647022453, 0.03613671655598506, 0.06151538509645111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 134.2608695652174, 116, 379, 122.0, 139.00000000000003, 332.59999999999934, 379.0, 0.10855662171793214, 0.08067538000717417, 0.0544903355107589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d77cb94c-41cf-48fb-aa2e-7fd7b8460f3c", 1, 0, 0.0, 1286.0, 1286, 1286, 1286.0, 1286.0, 1286.0, 1286.0, 0.7776049766718507, 0.14048527410575426, 0.5361221811819595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 203.0869565217391, 115, 837, 122.0, 360.6, 741.7999999999986, 837.0, 0.10856123325560978, 1.4158409277029387, 0.06352251849081006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 227.7391304347826, 114, 841, 122.0, 394.40000000000003, 752.3999999999987, 841.0, 0.10855969603285111, 4.275040451761735, 0.06341560368630968], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 318.5625, 120, 1702, 230.0, 747.900000000001, 1702.0, 1702.0, 0.10746044112511083, 0.16325014523950246, 0.06945181952354727], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/103b5e32-3241-49e1-a5d3-6291b9056ca2", 3, 0, 0.0, 433.66666666666663, 222, 765, 314.0, 765.0, 765.0, 765.0, 0.028297348538441947, 0.028380250926738165, 0.018146411660394088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3c29401-5acb-45bb-b699-208313ad7c94", 3, 0, 0.0, 430.0, 311, 660, 319.0, 660.0, 660.0, 660.0, 0.04942990838990312, 0.03177866831707639, 0.03169821599222303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 121.83333333333333, 117, 127, 121.5, 126.4, 127.0, 127.0, 0.13935825523464448, 0.10356604710309028, 0.0699513117095774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 141.66666666666669, 118, 349, 122.5, 282.7000000000003, 349.0, 349.0, 0.13935825523464448, 0.07217414846299458, 0.07752710227734616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 694.3000000000001, 581, 876, 607.0, 872.4, 876.0, 876.0, 0.09249923688129573, 27.19784690682552, 0.05275347103386397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 981.5, 783, 1182, 1043.5, 1173.1000000000001, 1182.0, 1182.0, 0.09254289363119807, 83.27025836240722, 0.052687995104480925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 278.4, 120, 471, 363.0, 461.30000000000007, 471.0, 471.0, 0.0929022668153103, 0.16439346432552954, 0.0514410012541806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73ad55e0-6a28-4a2e-ad2b-e3f6bcf48a0b", 3, 0, 0.0, 398.66666666666663, 215, 735, 246.0, 735.0, 735.0, 735.0, 0.02017593414575095, 0.023847271120840393, 0.012938343185914507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 142.18181818181816, 114, 361, 120.0, 314.00000000000017, 361.0, 361.0, 0.05687429230284009, 0.04226693011959113, 0.028548228753574035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 162.0, 113, 364, 121.0, 359.8, 364.0, 364.0, 0.056875468576303614, 0.02298447558232724, 0.03200254970140379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 220.72727272727272, 113, 1026, 120.0, 890.0000000000005, 1026.0, 1026.0, 0.05680908532208169, 4.660912097301052, 0.03295370769659817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 240.0, 118, 703, 123.0, 635.4000000000003, 703.0, 703.0, 0.05680351148980119, 1.532292876968758, 0.03300594661760909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 123.10000000000001, 113, 142, 122.0, 140.10000000000002, 142.0, 142.0, 0.0931133375544713, 0.06919848620991471, 0.05228532138068457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 736.1333333333332, 115, 1093, 1010.0, 1092.4, 1093.0, 1093.0, 0.07788161993769471, 46.72567619093977, 0.04132390641225338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 260.0, 114, 841, 122.5, 835.9, 841.0, 841.0, 0.13935825523464448, 20.930435008245365, 0.07993139509226678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 602.4666666666667, 118, 973, 598.0, 956.8, 973.0, 973.0, 0.07778388525321248, 15.254351684280394, 0.04134800931591665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 238.41666666666666, 113, 802, 121.5, 743.5000000000002, 802.0, 802.0, 0.1393647291098078, 6.8609455751698505, 0.08007120666627954], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 554.7499999999999, 123, 1286, 494.5, 1239.8, 1286.0, 1286.0, 0.11040878853956776, 0.022312225271881644, 0.0746458832185542], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f7033106-83e8-423a-ab28-6030d2cca5c9", 3, 0, 0.0, 1205.0, 240, 1702, 1673.0, 1702.0, 1702.0, 1702.0, 0.03337115397450444, 0.027494267809072506, 0.02140012152661906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 413.45454545454544, 239, 1147, 248.0, 1063.0000000000002, 1147.0, 1147.0, 0.05676686879112373, 6.253880547671268, 0.12634962424203328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7033106-83e8-423a-ab28-6030d2cca5c9", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 26, 0, 0.0, 616.5384615384614, 141, 2148, 429.5, 1337.9000000000005, 2073.45, 2148.0, 0.11074715997427259, 0.06802730822638423, 0.050074155339929885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 138.73333333333332, 114, 365, 123.0, 223.4000000000001, 365.0, 365.0, 0.07788485503032316, 0.05788122527155853, 0.03909454637264268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 259.1333333333334, 119, 507, 345.0, 420.6, 507.0, 507.0, 0.0777846919726198, 0.09869945615536195, 0.04000644964737606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06b09ea4-934c-4c60-8db3-a484e91eb057", 1, 0, 0.0, 908.0, 908, 908, 908.0, 908.0, 908.0, 908.0, 1.1013215859030838, 0.19896923182819382, 0.759309609030837], "isController": false}, {"data": ["login", 26, 0, 0.0, 2572.384615384615, 1306, 4695, 2549.5, 3602.2000000000007, 4489.9, 4695.0, 0.11127945695625005, 51.35124792153515, 0.23886797494928227], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 128.33333333333331, 117, 153, 124.5, 150.3, 153.0, 153.0, 0.1263024944742659, 0.10225074992106094, 0.04489658983264919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=717f7347-56e5-4fe2-b53f-e45e34f48197", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61b17380-6ecd-492c-b794-1691b4db2b34", 3, 0, 0.0, 369.33333333333337, 225, 650, 233.0, 650.0, 650.0, 650.0, 0.05822755327821125, 0.03811706043049571, 0.03733993488218625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d77cb94c-41cf-48fb-aa2e-7fd7b8460f3c", 3, 0, 0.0, 859.6666666666666, 247, 1346, 986.0, 1346.0, 1346.0, 1346.0, 0.033454513013805566, 0.02788965098579298, 0.021453577681379215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49448227-f7c8-4938-b67a-2b0f8eece8d5", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 911.1333333333333, 240, 1215, 1132.0, 1213.8, 1215.0, 1215.0, 0.07773712414100477, 62.040576632933075, 0.16157276615895688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1dd1bd14-e640-48a9-a1be-3765c28fc789", 3, 0, 0.0, 344.3333333333333, 221, 552, 260.0, 552.0, 552.0, 552.0, 0.08876002248587236, 0.04016159871593834, 0.056919675877984556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 419.0869565217391, 243, 963, 468.0, 691.8000000000003, 926.1999999999995, 963.0, 0.10849363661235695, 5.8041423784399555, 0.2427978135584026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, 37.5, 739.375, 119, 1306, 955.0, 1243.0, 1306.0, 1306.0, 0.14783331793402937, 110.5523610020327, 0.24507450856971263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51f5c661-8c24-4d69-87b2-bc8b92ac79b9", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7627ffe6-938f-4219-a36d-405b83e29fb1", 3, 0, 0.0, 390.33333333333337, 232, 687, 252.0, 687.0, 687.0, 687.0, 0.033737053405755536, 0.028125193285201803, 0.02163476406553985], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 828.4230769230768, 210, 1836, 821.0, 1355.3, 1687.5999999999995, 1836.0, 0.11555196060567005, 0.035901660837218394, 0.05213379472638629], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 143.30769230769232, 122, 356, 125.0, 267.9999999999999, 356.0, 356.0, 0.058162165064224454, 0.04515519650982269, 0.020674832112673534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 404.5833333333333, 239, 963, 248.5, 957.3000000000001, 963.0, 963.0, 0.13915947676036738, 27.92691065236803, 0.30703871532609706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 467.92307692307696, 244, 1203, 471.0, 1036.1999999999998, 1203.0, 1203.0, 0.09479778902387445, 8.85954841614771, 0.21133668756471774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 124.64285714285714, 117, 140, 124.0, 135.5, 140.0, 140.0, 0.06886002233032153, 0.05117429393884246, 0.03456450339627467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 139.14285714285714, 116, 364, 122.0, 248.5, 364.0, 364.0, 0.06886307070269845, 0.018426251340370483, 0.03927347001013271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ede576b-9b2f-4493-bd9e-8022e57b39f0", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 139.2857142857143, 115, 356, 121.0, 249.5, 356.0, 356.0, 0.06886340942740075, 0.01856084082222911, 0.04048415280790552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=103b5e32-3241-49e1-a5d3-6291b9056ca2", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 0.20437111142533937, 0.7799243495475113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 148.9285714285714, 116, 483, 122.5, 312.0, 483.0, 483.0, 0.06886442562150144, 0.01856111471829531, 0.04055200063453649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3c29401-5acb-45bb-b699-208313ad7c94", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 134.33333333333334, 123, 154, 126.0, 154.0, 154.0, 154.0, 0.1287608910253659, 0.03797440340787158, 0.07959535548735998], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1138.6428571428578, 907, 1765, 978.0, 1498.0000000000002, 1588.2999999999997, 1765.0, 0.2413865935610126, 288.7822854568888, 0.47664423064489014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 828.4230769230768, 210, 1836, 821.0, 1355.3, 1687.5999999999995, 1836.0, 0.11154585392641406, 0.03465697504805052, 0.05032635206445634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 240.25000000000003, 116, 365, 239.0, 365.0, 365.0, 365.0, 0.04751581385679922, 0.012806996703590413, 0.02798050366762688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 181.0, 120, 363, 122.5, 363.0, 363.0, 363.0, 0.04751581385679922, 0.012806996703590413, 0.02793410150565735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 194.23076923076923, 114, 1083, 120.0, 702.1999999999997, 1083.0, 1083.0, 0.058565945254356405, 4.0682434397694305, 0.03404321547312274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 176.38461538461542, 117, 841, 122.0, 554.5999999999997, 841.0, 841.0, 0.05856541757142728, 1.339199987949039, 0.03410010153216143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 139.15384615384613, 119, 348, 121.0, 259.5999999999999, 348.0, 348.0, 0.05856515373352855, 0.04352351756954612, 0.029396961932650074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 240.625, 116, 366, 240.5, 366.0, 366.0, 366.0, 0.04751609607754627, 0.012714267895749684, 0.027099023544225605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 139.6153846153846, 116, 367, 121.0, 270.19999999999993, 367.0, 367.0, 0.05856515373352855, 0.02243707061606037, 0.03302208863610767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 179.12499999999997, 121, 349, 124.0, 349.0, 349.0, 349.0, 0.047514685007335085, 0.03531120633845898, 0.02385014462282249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 153.875, 122, 357, 125.0, 357.0, 357.0, 357.0, 0.046092507662879395, 0.036279844898711715, 0.01638444608328916], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 600.8125, 119, 1673, 601.0, 1192.1000000000004, 1673.0, 1673.0, 0.11435269229119913, 0.02252295764304807, 0.07781482948941522], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/49448227-f7c8-4938-b67a-2b0f8eece8d5", 3, 0, 0.0, 759.3333333333334, 339, 1462, 477.0, 1462.0, 1462.0, 1462.0, 0.02667828654258299, 0.026756445585188218, 0.017108145992476724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 26, 0, 0.0, 1234.4615384615388, 807, 2749, 1004.5, 2237.6000000000004, 2643.9999999999995, 2749.0, 0.1122693081619787, 0.05810813801352413, 0.051639496234660125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 452.25, 246, 713, 485.5, 713.0, 713.0, 713.0, 0.0474802808458612, 0.07358516181873215, 0.10678426444142416], "isController": false}, {"data": ["addBook", 53, 11, 20.754716981132077, 1201.547169811321, 609, 2746, 1011.0, 1857.2000000000003, 2122.2999999999993, 2746.0, 0.25192868041658545, 92.06368581760363, 0.9111340147687247], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97485d07-40a0-4f8a-a3ba-062086a25d7d", 3, 0, 0.0, 400.3333333333333, 264, 656, 281.0, 656.0, 656.0, 656.0, 0.034912544077086896, 0.029105151491347507, 0.022388578070267312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73ad55e0-6a28-4a2e-ad2b-e3f6bcf48a0b", 1, 0, 0.0, 1220.0, 1220, 1220, 1220.0, 1220.0, 1220.0, 1220.0, 0.819672131147541, 0.14808529713114754, 0.565125512295082], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 222.55357142857142, 116, 570, 124.0, 491.0, 492.15, 570.0, 0.24226063783765076, 0.18003939979926975, 0.11710841379847375], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 699.8392857142857, 560, 976, 610.0, 882.4000000000003, 969.75, 976.0, 0.2421422672299357, 71.19786644556771, 0.12178053478849304], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 186.46428571428575, 113, 494, 123.5, 364.3, 385.74999999999983, 494.0, 0.24267742536585787, 0.42942528785442824, 0.11802085725800511], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 903.9642857142859, 783, 1212, 845.5, 1085.6, 1195.8, 1212.0, 0.24192886427358698, 217.6880173389553, 0.12143694944982783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 126.15384615384616, 121, 142, 125.0, 138.4, 142.0, 142.0, 0.09331572298150913, 0.06971340632895945, 0.03317082340358332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 11, 6.790123456790123, 199.04938271604945, 116, 1290, 126.0, 364.70000000000005, 430.9499999999998, 1167.150000000001, 0.6641086186540732, 1.58997262601666, 0.31425939462604946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 142.78571428571425, 123, 372, 125.5, 249.5, 372.0, 372.0, 0.06922810661128419, 0.0536112192800277, 0.024608428521979926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1dd1bd14-e640-48a9-a1be-3765c28fc789", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 0.5753632563694268, 2.1957105891719744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 135.8695652173913, 117, 370, 125.0, 132.4, 322.79999999999933, 370.0, 0.10481129410049124, 0.08505682167725412, 0.037257139699783996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61b17380-6ecd-492c-b794-1691b4db2b34", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97485d07-40a0-4f8a-a3ba-062086a25d7d", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7627ffe6-938f-4219-a36d-405b83e29fb1", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 310.2857142857143, 240, 608, 247.5, 549.0, 608.0, 608.0, 0.06881838827334663, 0.10665506073222765, 0.15477416815773173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 355.7692307692308, 241, 1432, 247.0, 1053.9999999999995, 1432.0, 1432.0, 0.058532456246988954, 5.4702871804915825, 0.13048885997910842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/717f7347-56e5-4fe2-b53f-e45e34f48197", 3, 0, 0.0, 306.3333333333333, 222, 472, 225.0, 472.0, 472.0, 472.0, 0.08456182879048398, 0.03826202539673592, 0.05422747484285594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 127.36363636363636, 118, 149, 125.0, 145.20000000000002, 149.0, 149.0, 0.056880468281382504, 0.04715968512782592, 0.02021922895939769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51f5c661-8c24-4d69-87b2-bc8b92ac79b9", 3, 0, 0.0, 692.3333333333334, 228, 1380, 469.0, 1380.0, 1380.0, 1380.0, 0.0815594160345812, 0.036903511812522084, 0.05230209947530109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 126.93333333333335, 118, 179, 124.0, 147.8, 179.0, 179.0, 0.08079632861482773, 0.06272761840701958, 0.02872056993730205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d6da841-cae2-40f4-93e6-894dc7a5c2b1", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06b09ea4-934c-4c60-8db3-a484e91eb057", 3, 0, 0.0, 314.0, 219, 469, 254.0, 469.0, 469.0, 469.0, 0.02979767379493241, 0.02484109459271546, 0.019108534302088816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 143.53846153846155, 113, 421, 121.0, 303.7999999999999, 421.0, 421.0, 0.09504660939499177, 0.07063522436483276, 0.04770894260647048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 212.07692307692307, 114, 366, 123.0, 365.6, 366.0, 366.0, 0.09508971348737867, 0.03643010357464177, 0.053616540672796295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 231.76923076923077, 113, 1089, 121.0, 795.7999999999997, 1089.0, 1089.0, 0.09525484334241918, 6.616812720276825, 0.0553697399176412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 258.1538461538462, 114, 957, 123.0, 720.9999999999998, 957.0, 957.0, 0.09525414538713484, 2.1781514696615547, 0.05546235583651458], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 30.303030303030305, 0.7668711656441718], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.23006134969325154], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.23006134969325154], "isController": false}, {"data": ["401/Unauthorized", 17, 51.515151515151516, 1.303680981595092], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 33, "401/Unauthorized", 17, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
