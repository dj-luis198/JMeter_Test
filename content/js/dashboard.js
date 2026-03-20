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

    var data = {"OkPercent": 98.83540372670808, "KoPercent": 1.1645962732919255};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7484909456740443, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0847457627118644, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fe7bb57-c1ec-48c9-932d-8773158133ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7342cf8-9145-4ad6-bd7b-db359b2a5823"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d382e2d7-1632-4229-bfcb-9a520f2ff644"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95379bd6-1cee-4977-93ad-32a1f05d98bf"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f8bd2e55-0bcc-4e3f-8ace-3ceb1e8e7e9a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be5a1700-2a2a-44f8-9460-57197d9e8f75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4afdb7e-dda4-41a4-aef4-496f37347d3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/36b03c04-5017-449e-8862-a3a4f35035c1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd7954c6-5719-4f89-a1a6-c296238001c7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f7342cf8-9145-4ad6-bd7b-db359b2a5823"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d17710b-347d-4891-82b9-b5bb283c30d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ca692267-f664-4ecf-931c-23e00600928c"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fe7bb57-c1ec-48c9-932d-8773158133ce"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77933ce2-5501-43a5-b3ef-4be339bf2498"], "isController": false}, {"data": [0.4745762711864407, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5bc63fe9-75b6-4dac-8c45-7bed028f237e"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be28b083-0755-42ad-9b7a-a414e3c07e31"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d382e2d7-1632-4229-bfcb-9a520f2ff644"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8bd2e55-0bcc-4e3f-8ace-3ceb1e8e7e9a"], "isController": false}, {"data": [0.9745762711864406, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/300f3324-6c5d-46fd-b0f7-24dd42dc8747"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56cbb520-7263-4ce0-b157-d8af552824c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4afdb7e-dda4-41a4-aef4-496f37347d3b"], "isController": false}, {"data": [0.8622754491017964, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be5a1700-2a2a-44f8-9460-57197d9e8f75"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=300f3324-6c5d-46fd-b0f7-24dd42dc8747"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd7954c6-5719-4f89-a1a6-c296238001c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be28b083-0755-42ad-9b7a-a414e3c07e31"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36b03c04-5017-449e-8862-a3a4f35035c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca692267-f664-4ecf-931c-23e00600928c"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22992637-ea87-42ed-9694-4ee4e8a533ef"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 15, 1.1645962732919255, 587.003881987578, 2, 21450, 225.0, 1077.3000000000004, 1377.8999999999992, 7946.199999999828, 4.997264695954466, 736.6637332268634, 3.6512512500436487], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2909.6101694915255, 1328, 14092, 1813.0, 8398.0, 9219.0, 14092.0, 0.2514425986379482, 302.5702314603701, 1.2363412931074897], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fe7bb57-c1ec-48c9-932d-8773158133ce", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7342cf8-9145-4ad6-bd7b-db359b2a5823", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d382e2d7-1632-4229-bfcb-9a520f2ff644", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 573.0833333333333, 344, 899, 490.5, 863.3000000000002, 899.0, 899.0, 0.06743694645506451, 0.012825532541136539, 0.04556713593883469], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 573.0833333333333, 344, 899, 490.5, 863.3000000000002, 899.0, 899.0, 0.0668222139313179, 0.012708619299925939, 0.045151761252582405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 303.8, 107, 1126, 227.0, 936.9000000000012, 1119.35, 1126.0, 0.0876485643165165, 0.03661724200645093, 0.04925096084738632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 300.34999999999997, 106, 2785, 115.5, 998.9000000000019, 2700.1499999999987, 2785.0, 0.08764933255033264, 0.06513783405351868, 0.043995856377803684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 296.05000000000007, 105, 1128, 120.5, 798.3000000000001, 1111.5499999999997, 1128.0, 0.0876489484317412, 2.598431823361074, 0.0508603565997467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 319.8, 108, 1129, 123.0, 1017.5, 1123.55, 1129.0, 0.08765048492630785, 7.908068131269749, 0.05077565201004475], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 642.25, 115, 3371, 259.0, 2738.0000000000023, 3371.0, 3371.0, 0.06694710063265011, 0.12878381874630396, 0.0432748063415641], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/95379bd6-1cee-4977-93ad-32a1f05d98bf", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.0609167358803988, 1.9823245431893688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 401.6875, 111, 2503, 117.5, 2057.1000000000004, 2503.0, 2503.0, 0.08754076116691835, 0.06505714770314928, 0.043941358632613316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 270.99999999999994, 111, 1836, 117.0, 785.3000000000011, 1836.0, 1836.0, 0.08743933895859748, 0.03160496614458094, 0.04940877686027193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 665.0, 549, 789, 661.0, 789.0, 789.0, 789.0, 0.09126169290440338, 26.83396788729181, 0.052047684234542556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8bd2e55-0bcc-4e3f-8ace-3ceb1e8e7e9a", 3, 0, 0.0, 912.3333333333334, 371, 1678, 688.0, 1678.0, 1678.0, 1678.0, 0.05429569435143793, 0.03490689985159177, 0.03481852795323331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 862.25, 751, 967, 865.5, 967.0, 967.0, 967.0, 0.09084302325581395, 81.74071201058322, 0.05172019781068314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 236.0, 112, 384, 224.0, 384.0, 384.0, 384.0, 0.09160654986831558, 0.16210065269666782, 0.05072354860872552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 112.27272727272727, 109, 118, 112.0, 117.4, 118.0, 118.0, 0.06202984199307521, 0.046098349371806874, 0.031136073031680332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 132.9090909090909, 107, 345, 112.0, 299.8000000000002, 345.0, 345.0, 0.061948098756532705, 0.01657595611258785, 0.03532977507208506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 173.8181818181818, 109, 344, 114.0, 342.4, 344.0, 344.0, 0.06194844762821921, 0.016697042524793457, 0.03641891159393355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 174.8181818181818, 110, 342, 114.0, 341.0, 342.0, 342.0, 0.062029142418911, 0.016718792292597102, 0.03652692663926106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 170.75, 111, 343, 114.5, 343.0, 343.0, 343.0, 0.09169264624977076, 0.06814267948835503, 0.05148756991564276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 585.05, 111, 1133, 564.0, 1076.9, 1130.45, 1133.0, 0.10356791466003833, 46.609253226787835, 0.05643642224638806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 318.62500000000006, 110, 1847, 115.5, 1264.6000000000006, 1847.0, 1847.0, 0.08744220616686159, 4.939636057681797, 0.05093679294778607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 436.9, 107, 889, 433.0, 793.7, 884.2499999999999, 889.0, 0.10356845097846294, 15.240239158972393, 0.056537855563438266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 305.125, 109, 1858, 115.0, 1176.9000000000008, 1858.0, 1858.0, 0.08754555104452785, 1.630952670002517, 0.051082487059673234], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 832.0833333333334, 125, 3397, 466.5, 3026.800000000001, 3397.0, 3397.0, 0.06692843119757273, 0.012728820288796181, 0.04574641061429145], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/be5a1700-2a2a-44f8-9460-57197d9e8f75", 3, 0, 0.0, 6570.333333333333, 213, 19006, 492.0, 19006.0, 19006.0, 19006.0, 0.02840720785553988, 0.02368192035092371, 0.018216861808402852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4afdb7e-dda4-41a4-aef4-496f37347d3b", 3, 0, 0.0, 351.3333333333333, 210, 473, 371.0, 473.0, 473.0, 473.0, 0.01608277267000831, 0.022171400474441796, 0.010313496796847777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 310.09090909090907, 225, 460, 229.0, 459.2, 460.0, 460.0, 0.06190939840949128, 0.09594747585533461, 0.1392356880244711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 538.9523809523808, 168, 1201, 533.0, 985.2, 1179.5999999999997, 1201.0, 0.08889566189169969, 0.05460485481433506, 0.040194034624860306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 113.39999999999999, 107, 119, 114.0, 117.9, 118.95, 119.0, 0.1035673783471682, 0.07696755363495607, 0.05198596920941842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 180.64999999999998, 107, 344, 115.0, 342.8, 343.95, 344.0, 0.10356791466003833, 0.10548958495158199, 0.054717033038164775], "isController": false}, {"data": ["login", 21, 0, 0.0, 2982.4761904761904, 1736, 12596, 2450.0, 5076.4000000000015, 11889.29999999999, 12596.0, 0.08919659353961815, 20.449754244802175, 0.1627514295346911], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 319.9375, 113, 3135, 117.5, 1182.0000000000018, 3135.0, 3135.0, 0.0873043155614486, 0.07067898203168055, 0.03103395592223368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36b03c04-5017-449e-8862-a3a4f35035c1", 3, 0, 0.0, 7527.333333333333, 236, 21450, 896.0, 21450.0, 21450.0, 21450.0, 0.023482814493593105, 0.023551611801679802, 0.015058966325644017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd7954c6-5719-4f89-a1a6-c296238001c7", 3, 0, 0.0, 627.0, 206, 1261, 414.0, 1261.0, 1261.0, 1261.0, 0.03228653221119697, 0.02691595344820164, 0.02070457957553972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 705.2499999999999, 225, 1245, 685.0, 1185.9, 1242.25, 1245.0, 0.10350520372411723, 61.994310367469346, 0.21954424071170178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7342cf8-9145-4ad6-bd7b-db359b2a5823", 3, 0, 0.0, 691.6666666666666, 282, 1021, 772.0, 1021.0, 1021.0, 1021.0, 0.018695782231528568, 0.018750555031035, 0.01198915722529664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d17710b-347d-4891-82b9-b5bb283c30d8", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca692267-f664-4ecf-931c-23e00600928c", 3, 0, 0.0, 1523.3333333333333, 241, 3371, 958.0, 3371.0, 3371.0, 3371.0, 0.04619933472957989, 0.029701720732721447, 0.029626526503018353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 717.9500000000002, 225, 3218, 456.0, 2109.4000000000024, 3167.999999999999, 3218.0, 0.0876047972386968, 10.602772678144355, 0.1947837913604149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 727.3333333333334, 114, 1311, 884.5, 1311.0, 1311.0, 1311.0, 0.08220078912757563, 65.56781265412647, 0.1417241144577488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fe7bb57-c1ec-48c9-932d-8773158133ce", 3, 0, 0.0, 493.6666666666667, 293, 768, 420.0, 768.0, 768.0, 768.0, 0.06718624025799516, 0.030400024075069424, 0.04308492620711278], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 2152.0476190476184, 160, 19018, 1147.0, 5473.400000000003, 17754.199999999983, 19018.0, 0.08929444631065113, 0.028352979883236883, 0.040287142769063304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 120.68749999999999, 112, 151, 117.5, 147.5, 151.0, 151.0, 0.08157105858841283, 0.06332909333768379, 0.028995962232599874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 758.625, 228, 4362, 239.5, 2920.7000000000016, 4362.0, 4362.0, 0.08738251148260814, 6.6607031373735, 0.19512796417863168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 477.50000000000006, 220, 1813, 436.5, 1167.700000000001, 1813.0, 1813.0, 0.08074862951631571, 5.485049552461937, 0.18045776622374549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 113.0, 110, 115, 113.5, 115.0, 115.0, 115.0, 0.03896850370687892, 0.028959991524350442, 0.019560362212241954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 111.25, 108, 113, 112.0, 113.0, 113.0, 113.0, 0.038969262993813626, 0.010427322324516538, 0.022224657801159335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 228.75, 112, 345, 229.0, 345.0, 345.0, 345.0, 0.03896964264837691, 0.01050353649507034, 0.02290988757258096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 285.5, 115, 344, 341.5, 344.0, 344.0, 344.0, 0.03888327241620655, 0.010480257018430672, 0.02289708326852788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 2.359375, 4.9453125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77933ce2-5501-43a5-b3ef-4be339bf2498", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1080.9830508474581, 848, 2891, 916.0, 1466.0, 1541.0, 2891.0, 0.2555882862588806, 305.7724472307659, 0.5046870261869694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 2152.0476190476184, 160, 19018, 1147.0, 5473.400000000003, 17754.199999999983, 19018.0, 0.08938224102559737, 0.028380856664935773, 0.040326753275220686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 287.125, 108, 1294, 114.0, 1294.0, 1294.0, 1294.0, 0.0374847718114516, 0.010103317402305315, 0.022073552150688784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bc63fe9-75b6-4dac-8c45-7bed028f237e", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.5806107954545454, 1.084872159090909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 260.75, 111, 1282, 115.5, 1282.0, 1282.0, 1282.0, 0.037521868213818366, 0.010113316042005731, 0.02205875455538931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be28b083-0755-42ad-9b7a-a414e3c07e31", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 271.5625, 110, 1126, 114.5, 1032.2, 1126.0, 1126.0, 0.08497395017339997, 9.57750395991885, 0.049042582570780646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 240.6875, 106, 771, 114.5, 757.7, 771.0, 771.0, 0.08486938071873758, 3.1393175639835564, 0.04906511072802015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 261.25, 111, 1287, 115.5, 1287.0, 1287.0, 1287.0, 0.0375216922283195, 0.010039984053280803, 0.02139909009896346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 133.12500000000003, 112, 403, 114.5, 207.0000000000002, 403.0, 403.0, 0.08497304761146074, 0.06314891526593909, 0.04265248678934651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 221.125, 111, 951, 115.5, 951.0, 951.0, 951.0, 0.03752151624447144, 0.027884642443401136, 0.018834042333650703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 125.6875, 109, 327, 112.5, 179.30000000000015, 327.0, 327.0, 0.0849744014615597, 0.03869073699360567, 0.04756989808382725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 143.125, 112, 334, 117.0, 334.0, 334.0, 334.0, 0.037506739492252514, 0.029521906280034694, 0.013332473803886637], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 3844.5833333333326, 114, 21450, 652.0, 20716.800000000003, 21450.0, 21450.0, 0.06645364581314342, 0.012487098647668308, 0.045227200515569534], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d382e2d7-1632-4229-bfcb-9a520f2ff644", 3, 0, 0.0, 355.33333333333337, 221, 623, 222.0, 623.0, 623.0, 623.0, 0.033673812998091815, 0.02774362652935234, 0.021594209507239868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1871.4285714285716, 788, 10298, 1322.0, 4396.800000000002, 9769.299999999992, 10298.0, 0.0886042302191056, 0.04585961134387302, 0.040754484798045644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 512.0, 224, 2246, 236.0, 2246.0, 2246.0, 2246.0, 0.037463707033811, 0.058061428772127006, 0.08425675517467454], "isController": false}, {"data": ["addBook", 54, 7, 12.962962962962964, 3141.5925925925926, 573, 24875, 1211.5, 14294.5, 17241.5, 24875.0, 0.245398773006135, 87.97363170302204, 0.8878930214723926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8bd2e55-0bcc-4e3f-8ace-3ceb1e8e7e9a", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 216.20338983050837, 112, 1983, 117.0, 459.0, 466.0, 1983.0, 0.25642808713339477, 0.19056813897315764, 0.12395693665139688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/300f3324-6c5d-46fd-b0f7-24dd42dc8747", 3, 0, 0.0, 438.6666666666667, 189, 681, 446.0, 681.0, 681.0, 681.0, 0.05199486983950917, 0.033427691384450064, 0.03334306431765399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56cbb520-7263-4ce0-b157-d8af552824c7", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 635.7118644067797, 536, 922, 568.0, 795.0, 804.0, 922.0, 0.2563278215610799, 75.36889042365775, 0.12891487119526965], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 175.27118644067795, 110, 462, 116.0, 345.0, 359.0, 462.0, 0.25658979120549363, 0.4540436539690962, 0.12478683205110921], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 860.0508474576268, 725, 1219, 784.0, 1027.0, 1105.0, 1219.0, 0.25611751887238837, 230.4549936879512, 0.12855898896524182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 650.6111111111111, 114, 9477, 118.0, 1251.000000000013, 9477.0, 9477.0, 0.08211791219770344, 0.06134785432738587, 0.029190351601527394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4afdb7e-dda4-41a4-aef4-496f37347d3b", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 6, 3.592814371257485, 920.5748502994012, 109, 21400, 124.0, 982.0000000000018, 7281.799999999998, 18708.559999999972, 0.6911450659691758, 1.6090236075703148, 0.3274581045036172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be5a1700-2a2a-44f8-9460-57197d9e8f75", 1, 0, 0.0, 2163.0, 2163, 2163, 2163.0, 2163.0, 2163.0, 2163.0, 0.4623208506703652, 0.08352476306056404, 0.3187485552473417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 990.0000000000001, 118, 3598, 122.0, 3598.0, 3598.0, 3598.0, 0.04293918737587891, 0.0332527105362031, 0.015263539262519457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 1, 5.0, 952.2999999999997, 2, 10365, 120.5, 3481.3000000000047, 10031.949999999995, 10365.0, 0.092776427365335, 0.08088944760915147, 0.03133016463177036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=300f3324-6c5d-46fd-b0f7-24dd42dc8747", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 399.0, 230, 458, 454.0, 458.0, 458.0, 458.0, 0.03883985357375203, 0.06019418713041452, 0.08735174099643644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 439.0625, 227, 1241, 236.0, 1148.6000000000001, 1241.0, 1241.0, 0.08481719244490858, 12.798874996024194, 0.1880431944805212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd7954c6-5719-4f89-a1a6-c296238001c7", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be28b083-0755-42ad-9b7a-a414e3c07e31", 3, 0, 0.0, 377.0, 213, 536, 382.0, 536.0, 536.0, 536.0, 0.020809633472989093, 0.024596282272273246, 0.013344719382092618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36b03c04-5017-449e-8862-a3a4f35035c1", 1, 0, 0.0, 3397.0, 3397, 3397, 3397.0, 3397.0, 3397.0, 3397.0, 0.2943773918163085, 0.053183415513688555, 0.20295941271710333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca692267-f664-4ecf-931c-23e00600928c", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 741.8181818181819, 111, 4708, 117.0, 4201.600000000002, 4708.0, 4708.0, 0.06461845738119015, 0.05357526398108442, 0.02296984227221994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 370.09999999999997, 110, 5111, 119.0, 132.8, 4862.099999999997, 5111.0, 0.10245849150362958, 0.07954541088416556, 0.036420791901680835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22992637-ea87-42ed-9694-4ee4e8a533ef", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 194.88888888888889, 107, 1365, 113.5, 443.40000000000146, 1365.0, 1365.0, 0.08087343307723413, 0.060102229073999196, 0.040594672462596036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 189.22222222222223, 108, 343, 115.0, 339.4, 343.0, 343.0, 0.08079647368279304, 0.0283611753867009, 0.04570225882252606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 266.16666666666663, 105, 985, 218.0, 493.60000000000076, 985.0, 985.0, 0.08079212187042739, 4.0592825168653555, 0.04711120474519062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 216.83333333333334, 108, 538, 115.0, 455.20000000000016, 538.0, 538.0, 0.08087634007602375, 1.3417170692885578, 0.04723929455612368], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 26.666666666666668, 0.3105590062111801], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, 6.666666666666667, 0.07763975155279502], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07763975155279502], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07763975155279502], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6211180124223602], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 15, "401/Unauthorized", 8, "406/Not Acceptable", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
