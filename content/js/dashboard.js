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

    var data = {"OkPercent": 96.20535714285714, "KoPercent": 3.794642857142857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7013888888888888, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017857142857142856, 500, 1500, "see books"], "isController": true}, {"data": [0.2894736842105263, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3aa218e-ffd1-42f5-b27d-38688e9778e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48636614-9d89-48e5-88ec-99ce89aecf2f"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79fa1c20-7fec-49bd-843b-4046ebfd41bd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47fa8624-d1b9-40d5-b651-c5ad37d50377"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85b9a3bc-31af-4d43-8418-94eda1b09275"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/30e930e7-850d-4124-b006-3fe92d123811"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33224518-3f49-4e56-ab33-b5e55963ca2d"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6346153846153846, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.019230769230769232, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0d934098-79a6-417a-a138-10f7ede4ab62"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f94f67ba-cb78-46d3-b81e-ddb55822a9cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfdac51f-1eeb-4895-8d1f-5d407457bd78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85b9a3bc-31af-4d43-8418-94eda1b09275"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c8f4fa2e-8cf9-44c9-bc41-6d2734ad1912"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c94273c1-f934-494e-98d1-c6d8b713631a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a50b9088-b167-44da-b829-c8c53b8ac1f7"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.14, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acd5b75b-0640-4908-80f1-a2eb225f8fa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d83f1678-692a-40b3-88e8-e71b7eb38554"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c3aa218e-ffd1-42f5-b27d-38688e9778e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48636614-9d89-48e5-88ec-99ce89aecf2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33224518-3f49-4e56-ab33-b5e55963ca2d"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acd5b75b-0640-4908-80f1-a2eb225f8fa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/79fa1c20-7fec-49bd-843b-4046ebfd41bd"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f94f67ba-cb78-46d3-b81e-ddb55822a9cb"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47fa8624-d1b9-40d5-b651-c5ad37d50377"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dfdac51f-1eeb-4895-8d1f-5d407457bd78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c94273c1-f934-494e-98d1-c6d8b713631a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a50b9088-b167-44da-b829-c8c53b8ac1f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d934098-79a6-417a-a138-10f7ede4ab62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 51, 3.794642857142857, 454.9784226190472, 116, 3633, 145.5, 1222.5, 1485.0, 2102.249999999999, 5.219883717768965, 756.0604245112186, 3.8139480662350427], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2071.428571428571, 1476, 2757, 2047.0, 2484.2000000000003, 2657.5499999999997, 2757.0, 0.24810927441328803, 298.55868518145206, 1.219951363936431], "isController": true}, {"data": ["deleteBook", 19, 7, 36.8421052631579, 559.2105263157894, 125, 1555, 577.0, 1156.0, 1555.0, 1555.0, 0.09119314227570087, 0.020314097379877036, 0.060375147288923875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 7, 36.8421052631579, 559.2105263157894, 125, 1555, 577.0, 1156.0, 1555.0, 1555.0, 0.09126936471718507, 0.020331076618229853, 0.06042561096433289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3aa218e-ffd1-42f5-b27d-38688e9778e4", 1, 0, 0.0, 1853.0, 1853, 1853, 1853.0, 1853.0, 1853.0, 1853.0, 0.5396654074473827, 0.0974981449001619, 0.37207400161899623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 11, 0, 0.0, 127.2727272727273, 119, 132, 129.0, 131.8, 132.0, 132.0, 0.09557654377840144, 0.03862432770590229, 0.05377877614235692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 11, 0, 0.0, 137.45454545454544, 121, 216, 131.0, 199.60000000000005, 216.0, 216.0, 0.0955690703735882, 0.07102349858818419, 0.047971193527367506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 11, 0, 0.0, 323.9090909090909, 119, 1158, 131.0, 1032.0000000000005, 1158.0, 1158.0, 0.09557571334236958, 2.5781854136256213, 0.05553471624874014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 11, 0, 0.0, 255.9090909090909, 122, 1296, 129.0, 1112.2000000000007, 1296.0, 1296.0, 0.09557156137866321, 7.841186740857712, 0.055438972127857374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48636614-9d89-48e5-88ec-99ce89aecf2f", 3, 0, 0.0, 434.6666666666667, 257, 584, 463.0, 584.0, 584.0, 584.0, 0.028844212408780177, 0.02911650477852452, 0.0184971023584951], "isController": false}, {"data": ["goToProfile", 19, 7, 36.8421052631579, 305.9473684210527, 122, 882, 236.0, 621.0, 882.0, 882.0, 0.09064323300558648, 0.13475819874005907, 0.058566821654668366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79fa1c20-7fec-49bd-843b-4046ebfd41bd", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47fa8624-d1b9-40d5-b651-c5ad37d50377", 3, 0, 0.0, 405.0, 252, 662, 301.0, 662.0, 662.0, 662.0, 0.06396042981408835, 0.028940428854681902, 0.04101629125447723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 141.41176470588235, 119, 380, 128.0, 182.3999999999998, 380.0, 380.0, 0.11846524787110982, 0.08803911487296344, 0.059464001372803166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 857.4545454545455, 733, 1033, 780.0, 1022.4000000000001, 1033.0, 1033.0, 0.05692609440416492, 16.73816187905275, 0.032465663214875304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 164.7058823529412, 118, 515, 128.0, 399.7999999999999, 515.0, 515.0, 0.11845699314343051, 0.052627894357266294, 0.06638708783934444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85b9a3bc-31af-4d43-8418-94eda1b09275", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 1270.6363636363635, 919, 1567, 1343.0, 1541.4, 1567.0, 1567.0, 0.05685254001643555, 51.15601544289421, 0.0323681941695136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 244.9090909090909, 123, 393, 150.0, 392.8, 393.0, 393.0, 0.05707555246540443, 0.10099697369854768, 0.031603357663949526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30e930e7-850d-4124-b006-3fe92d123811", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.5880956491712707, 1.0988576197053406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 184.3888888888889, 120, 407, 130.5, 385.40000000000003, 407.0, 407.0, 0.08718733652374401, 0.06479449520954023, 0.04376395602851995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 170.38888888888889, 119, 391, 129.5, 388.3, 391.0, 391.0, 0.08707851579507522, 0.02330030598422911, 0.049661966039378835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 206.94444444444443, 117, 384, 130.5, 369.6, 384.0, 384.0, 0.08718860348076281, 0.02350005328192435, 0.051257362593182816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 239.8888888888889, 121, 393, 130.5, 392.1, 393.0, 393.0, 0.08707851579507522, 0.02347038121039137, 0.051277680687920275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 128.0909090909091, 121, 132, 130.0, 132.0, 132.0, 132.0, 0.05715384255675117, 0.04247468182196058, 0.032093222138800705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 816.1176470588239, 118, 1602, 1161.0, 1501.1999999999998, 1602.0, 1602.0, 0.09608373980523262, 45.78317896055763, 0.052115272934340894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 341.7647058823528, 119, 1452, 132.0, 1433.6, 1452.0, 1452.0, 0.11845039018952062, 12.567213519892697, 0.06843830563684504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 537.235294117647, 121, 1047, 726.0, 1039.8, 1047.0, 1047.0, 0.09607722348127341, 14.968012377713475, 0.05220556393091482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 247.64705882352942, 118, 1021, 131.0, 812.9999999999998, 1021.0, 1021.0, 0.11846029489645177, 4.125967716085514, 0.06855971226342782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33224518-3f49-4e56-ab33-b5e55963ca2d", 3, 0, 0.0, 315.6666666666667, 217, 491, 239.0, 491.0, 491.0, 491.0, 0.036984072192908925, 0.030470926666748853, 0.02371699942058287], "isController": false}, {"data": ["deleteBooks", 19, 7, 36.8421052631579, 507.8947368421053, 124, 1853, 562.0, 1139.0, 1853.0, 1853.0, 0.09160555611804581, 0.020405966293976695, 0.060751772748311325], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 455.1111111111111, 244, 773, 517.5, 758.6, 773.0, 773.0, 0.08702168290265658, 0.13486661207667577, 0.19571380441876768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 26, 0, 0.0, 713.1923076923077, 172, 1510, 586.0, 1275.3000000000002, 1484.4499999999998, 1510.0, 0.11404909374835506, 0.070055546843472, 0.05156711953660976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 131.1764705882353, 123, 158, 131.0, 140.39999999999998, 158.0, 158.0, 0.09607668049417324, 0.07140073618756429, 0.0482259900136768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 221.82352941176472, 121, 434, 132.0, 400.4, 434.0, 434.0, 0.09608048153276627, 0.10210758894509282, 0.05052393887585836], "isController": false}, {"data": ["login", 26, 0, 0.0, 3361.3076923076924, 1451, 6403, 3339.0, 5049.000000000001, 6174.099999999999, 6403.0, 0.11095937179924889, 56.30779272869367, 0.24525755377261865], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0d934098-79a6-417a-a138-10f7ede4ab62", 3, 0, 0.0, 935.0, 256, 2154, 395.0, 2154.0, 2154.0, 2154.0, 0.05506102597045058, 0.02491368037074424, 0.035309316784436086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f94f67ba-cb78-46d3-b81e-ddb55822a9cb", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 0.2358538674934726, 0.9000693537859008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 147.4705882352941, 123, 393, 133.0, 198.59999999999982, 393.0, 393.0, 0.11170541311290133, 0.09043338620175312, 0.03970778356747664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfdac51f-1eeb-4895-8d1f-5d407457bd78", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.2584607474964235, 0.9863420958512161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85b9a3bc-31af-4d43-8418-94eda1b09275", 3, 0, 0.0, 362.6666666666667, 227, 481, 380.0, 481.0, 481.0, 481.0, 0.02793322097971117, 0.03301612154210002, 0.017912905380869468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8f4fa2e-8cf9-44c9-bc41-6d2734ad1912", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.6129288627639156, 1.145258517274472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c94273c1-f934-494e-98d1-c6d8b713631a", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a50b9088-b167-44da-b829-c8c53b8ac1f7", 3, 0, 0.0, 373.6666666666667, 236, 555, 330.0, 555.0, 555.0, 555.0, 0.039755635361312464, 0.033142637421979565, 0.02549433647844582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 949.705882352941, 248, 1726, 1293.0, 1630.8, 1726.0, 1726.0, 0.09600560220925833, 60.876177303993266, 0.2029144141822864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 25, 14, 56.0, 692.4400000000003, 122, 1692, 142.0, 1562.2, 1653.6, 1692.0, 0.12780075351324272, 67.29256819448207, 0.1742183865666072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 11, 0, 0.0, 477.0, 253, 1427, 348.0, 1273.0000000000005, 1427.0, 1427.0, 0.09546042297645599, 10.51666394568302, 0.21247232461316834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acd5b75b-0640-4908-80f1-a2eb225f8fa5", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d83f1678-692a-40b3-88e8-e71b7eb38554", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.8125596374045801, 1.5182689249363868], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 1230.4615384615386, 228, 3566, 970.0, 2315.7000000000003, 3253.0999999999985, 3566.0, 0.11790367269940459, 0.03647290596275151, 0.05319482108117668], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c3aa218e-ffd1-42f5-b27d-38688e9778e4", 3, 0, 0.0, 542.0, 450, 621, 555.0, 621.0, 621.0, 621.0, 0.020365630961189898, 0.028075666380416413, 0.01305999120883597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48636614-9d89-48e5-88ec-99ce89aecf2f", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 133.33333333333331, 128, 139, 133.5, 139.0, 139.0, 139.0, 0.06237751914210119, 0.04842785909958051, 0.02217325875754378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 512.0, 246, 1581, 264.0, 1563.4, 1581.0, 1581.0, 0.11834566680821737, 16.818606603775226, 0.26259984327901037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33224518-3f49-4e56-ab33-b5e55963ca2d", 1, 0, 0.0, 1139.0, 1139, 1139, 1139.0, 1139.0, 1139.0, 1139.0, 0.8779631255487269, 0.15861638498683056, 0.6053144205443372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 481.1904761904762, 248, 1466, 264.0, 1292.8000000000006, 1461.8999999999999, 1466.0, 0.09960631788644879, 11.48860030148698, 0.22158978056965326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 155.60000000000002, 122, 392, 130.5, 366.4000000000001, 392.0, 392.0, 0.04943227037474604, 0.03673628687029467, 0.024812682590448696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 201.20000000000002, 120, 386, 129.5, 385.1, 386.0, 386.0, 0.04943300345042364, 0.013227190376382888, 0.02819225978031973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 151.19999999999996, 118, 365, 130.0, 342.20000000000005, 365.0, 365.0, 0.04943544719305531, 0.01332439787625319, 0.029062635947479782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acd5b75b-0640-4908-80f1-a2eb225f8fa5", 3, 0, 0.0, 347.6666666666667, 236, 511, 296.0, 511.0, 511.0, 511.0, 0.01703848425644055, 0.02348892605013858, 0.010926371739970011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 254.70000000000002, 121, 391, 243.5, 390.9, 391.0, 391.0, 0.04937735159636977, 0.013308739297459042, 0.029076702160752907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79fa1c20-7fec-49bd-843b-4046ebfd41bd", 3, 0, 0.0, 470.0, 322, 600, 488.0, 600.0, 600.0, 600.0, 0.029645147583426387, 0.029731998601737204, 0.01901072289692382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 7, 7, 100.0, 129.85714285714286, 124, 138, 129.0, 138.0, 138.0, 138.0, 0.05986590038314176, 0.01765576358955939, 0.03700694818606322], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1391.8392857142853, 961, 2191, 1285.5, 1936.2, 2096.25, 2191.0, 0.239265114291818, 286.24425870540483, 0.47245513779107023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 1230.4615384615386, 228, 3566, 970.0, 2315.7000000000003, 3253.0999999999985, 3566.0, 0.11155255412444116, 0.03450821949252169, 0.0503293750053631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 217.83333333333331, 121, 390, 143.0, 390.0, 390.0, 390.0, 0.036021108369504534, 0.009708814365218019, 0.021211648776182843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 174.5, 123, 388, 132.0, 388.0, 388.0, 388.0, 0.03602305475504323, 0.009709338976945245, 0.021177616174351585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 184.75000000000003, 119, 384, 126.0, 378.6, 384.0, 384.0, 0.06027000964320155, 0.016244651036644166, 0.03543217363789778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 217.66666666666666, 121, 412, 130.5, 406.90000000000003, 412.0, 412.0, 0.06025699608831667, 0.016241143476929103, 0.03548336781372554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 127.74999999999997, 120, 134, 130.0, 133.1, 134.0, 134.0, 0.06033880237533752, 0.044841629499640476, 0.03028725041105809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 169.16666666666666, 120, 367, 131.5, 367.0, 367.0, 367.0, 0.03602478505211586, 0.009639444437773188, 0.020545385225034823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 123.99999999999999, 119, 131, 123.0, 130.7, 131.0, 131.0, 0.06034031940142403, 0.016145749527334163, 0.03441283840862464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 174.83333333333331, 121, 368, 134.0, 368.0, 368.0, 368.0, 0.03602781347200038, 0.026774576222844033, 0.01808427355918769], "isController": false}, {"data": ["deleteAccount", 19, 7, 36.8421052631579, 506.1052631578946, 122, 2154, 511.0, 847.0, 2154.0, 2154.0, 0.09212389208898199, 0.01959337301933632, 0.06267227773898877], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 131.33333333333334, 126, 134, 132.0, 134.0, 134.0, 134.0, 0.03757444436790391, 0.029575197422393118, 0.013356540771403344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 26, 0, 0.0, 1846.423076923077, 940, 3633, 1686.0, 3094.0, 3478.649999999999, 3633.0, 0.11150566963443295, 0.05771289541625924, 0.051288252341619066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 397.16666666666663, 254, 759, 277.0, 759.0, 759.0, 759.0, 0.0359945288316176, 0.05578448950759484, 0.08095253896407746], "isController": false}, {"data": ["addBook", 56, 12, 21.428571428571427, 1312.6250000000002, 634, 2552, 1095.0, 2237.7000000000003, 2390.75, 2552.0, 0.2630194634402946, 79.76302819650842, 0.9552343661935447], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f94f67ba-cb78-46d3-b81e-ddb55822a9cb", 3, 0, 0.0, 696.6666666666666, 361, 882, 847.0, 882.0, 882.0, 882.0, 0.021187039181897793, 0.025042363043447556, 0.01358674062120399], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 218.33928571428578, 119, 543, 132.0, 513.2, 528.6, 543.0, 0.2401228056634679, 0.1784506397557608, 0.11607498906583653], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 806.0892857142857, 579, 1190, 769.5, 1069.7, 1160.7, 1190.0, 0.24005692778573204, 70.58470740918561, 0.12073175567348829], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 181.08928571428575, 121, 485, 131.0, 387.5, 392.6, 485.0, 0.24056222829355464, 0.4256823805350791, 0.11699217743182638], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1168.339285714286, 818, 1680, 1154.0, 1555.1000000000001, 1567.25, 1680.0, 0.23982766669093494, 215.7973560605736, 0.1203822467569732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 147.90476190476193, 121, 398, 133.0, 184.80000000000004, 377.7999999999997, 398.0, 0.10255909357296347, 0.07661885408527057, 0.03645655279351436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, 7.142857142857143, 213.625, 117, 1100, 133.0, 406.2, 569.4999999999995, 1034.4500000000003, 0.7013500989404604, 1.6063881957142498, 0.33411485077524233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 157.89999999999998, 125, 376, 134.0, 353.0000000000001, 376.0, 376.0, 0.05231384119610367, 0.0405125742856545, 0.018595935737677476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47fa8624-d1b9-40d5-b651-c5ad37d50377", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.5360951409495549, 2.0458549703264093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfdac51f-1eeb-4895-8d1f-5d407457bd78", 3, 0, 0.0, 401.6666666666667, 321, 519, 365.0, 519.0, 519.0, 519.0, 0.04925137903861308, 0.03166389114624376, 0.03158372939650644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 11, 0, 0.0, 154.1818181818182, 122, 401, 130.0, 348.8000000000002, 401.0, 401.0, 0.09849658395938359, 0.07993228639672632, 0.03501245757931214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 436.5, 245, 781, 493.0, 754.9000000000001, 781.0, 781.0, 0.0493454328334641, 0.07647578311201907, 0.11097903497604279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 368.33333333333337, 244, 533, 265.5, 530.3, 533.0, 533.0, 0.060219197880284236, 0.09332799515235457, 0.13543438742020958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c94273c1-f934-494e-98d1-c6d8b713631a", 3, 0, 0.0, 550.3333333333334, 391, 764, 496.0, 764.0, 764.0, 764.0, 0.08987956138774042, 0.04066816091437474, 0.05763760935346635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 132.88888888888889, 125, 148, 133.0, 142.60000000000002, 148.0, 148.0, 0.08766760341124387, 0.07268534696889262, 0.03116309340009059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 143.88235294117646, 124, 357, 129.0, 191.39999999999986, 357.0, 357.0, 0.09541556283956716, 0.07407751216548426, 0.033917250853127384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a50b9088-b167-44da-b829-c8c53b8ac1f7", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d934098-79a6-417a-a138-10f7ede4ab62", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 151.42857142857142, 118, 379, 129.0, 329.00000000000017, 378.6, 379.0, 0.09978854332485923, 0.07415925924825964, 0.05008917116111098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 175.14285714285714, 118, 390, 131.0, 385.0, 389.9, 390.0, 0.09979281111596876, 0.04097705181147712, 0.0561148936018552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 299.19047619047615, 116, 1333, 131.0, 1118.6000000000008, 1329.8999999999999, 1333.0, 0.09967865500268183, 8.56631055774954, 0.05778432446351524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 259.95238095238096, 119, 965, 131.0, 757.6000000000004, 953.3999999999999, 965.0, 0.09967013930088517, 2.8153847979306583, 0.057876721979638814], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 21.568627450980394, 0.8184523809523809], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 7, 13.72549019607843, 0.5208333333333334], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 7, 13.72549019607843, 0.5208333333333334], "isController": false}, {"data": ["401/Unauthorized", 26, 50.98039215686274, 1.9345238095238095], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 51, "401/Unauthorized", 26, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 7, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 25, 14, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 7, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
