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

    var data = {"OkPercent": 99.27360774818402, "KoPercent": 0.7263922518159807};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7436250861474845, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d09f260c-b71b-4fbd-80e9-7dc3f86d515e"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d2dd28b-e0cd-4a2b-8af1-e9e639757d77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=069773a4-2788-4a5a-8efd-c4ea5dc9dcb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bfa01fe-e963-4622-b2d1-fa82b29acf6d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe1f9841-449c-4cdc-8cd6-e0b7c5aadada"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d84c060-dc1b-48a7-a02e-83de6bb1547c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98146d9f-0e31-4c11-bb1a-5c4974f733dd"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56071219-d6ee-4590-ab0a-9af60a5adda3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a302471-e5f6-44e2-9344-b5731b28abc0"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9b6d9936-6328-437a-bd6f-12793e7028d3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c01dba9-1c39-41ef-be99-bb32c4d076ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74a3e590-3efe-43e2-acb8-fbfdb6edd3b2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e01e58be-e933-4dd4-9978-d7466ade3650"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=367dad12-6058-4899-addf-db6a86441417"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d84c060-dc1b-48a7-a02e-83de6bb1547c"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbfe0fc6-1571-4915-91ae-e1a8031d37bd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c01dba9-1c39-41ef-be99-bb32c4d076ad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe1f9841-449c-4cdc-8cd6-e0b7c5aadada"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56071219-d6ee-4590-ab0a-9af60a5adda3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98146d9f-0e31-4c11-bb1a-5c4974f733dd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/069773a4-2788-4a5a-8efd-c4ea5dc9dcb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b93a9202-c29f-44ae-bbcc-829ee95844fb"], "isController": false}, {"data": [0.2358490566037736, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d2dd28b-e0cd-4a2b-8af1-e9e639757d77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/325e7ce2-3217-451f-a643-42f44b16a99e"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a302471-e5f6-44e2-9344-b5731b28abc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b6d9936-6328-437a-bd6f-12793e7028d3"], "isController": false}, {"data": [0.8867924528301887, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9716981132075472, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3584905660377358, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d09f260c-b71b-4fbd-80e9-7dc3f86d515e"], "isController": false}, {"data": [0.9696969696969697, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/367dad12-6058-4899-addf-db6a86441417"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e01e58be-e933-4dd4-9978-d7466ade3650"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/74a3e590-3efe-43e2-acb8-fbfdb6edd3b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbfe0fc6-1571-4915-91ae-e1a8031d37bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bfa01fe-e963-4622-b2d1-fa82b29acf6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1239, 9, 0.7263922518159807, 471.6763518966904, 129, 2522, 220.0, 1309.0, 1570.0, 2114.399999999999, 4.836462005082383, 684.9387834958662, 3.519774777840885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/d09f260c-b71b-4fbd-80e9-7dc3f86d515e", 3, 0, 0.0, 489.3333333333333, 375, 591, 502.0, 591.0, 591.0, 591.0, 0.026097168457222392, 0.021501280392327432, 0.016735488886955766], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2299.735849056603, 1583, 2952, 2239.0, 2735.4, 2873.8999999999996, 2952.0, 0.22763389597560452, 273.91983371048616, 1.119274088122235], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6d2dd28b-e0cd-4a2b-8af1-e9e639757d77", 3, 0, 0.0, 397.0, 264, 471, 456.0, 471.0, 471.0, 471.0, 0.027064820244485543, 0.02714411171004556, 0.017356020794803556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=069773a4-2788-4a5a-8efd-c4ea5dc9dcb9", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bfa01fe-e963-4622-b2d1-fa82b29acf6d", 3, 0, 0.0, 351.6666666666667, 259, 452, 344.0, 452.0, 452.0, 452.0, 0.075340917652377, 0.03408980323463673, 0.048314325447650616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe1f9841-449c-4cdc-8cd6-e0b7c5aadada", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 583.0666666666666, 457, 1152, 508.0, 888.6000000000001, 1152.0, 1152.0, 0.08463769424350828, 0.015290989682665072, 0.05752718280613454], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 583.0666666666666, 457, 1152, 508.0, 888.6000000000001, 1152.0, 1152.0, 0.08451656524678837, 0.015269106026031104, 0.057444852941176475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 202.00000000000003, 130, 444, 137.5, 441.3, 444.0, 444.0, 0.08675325927175458, 0.030452126057305344, 0.04907169494180302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d84c060-dc1b-48a7-a02e-83de6bb1547c", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 159.83333333333334, 131, 433, 139.0, 235.90000000000032, 433.0, 433.0, 0.08688390861743567, 0.06456899849401225, 0.04361164944273627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 249.50000000000003, 130, 818, 143.0, 451.70000000000056, 818.0, 818.0, 0.08688516677125066, 1.4414019132837768, 0.050749007457643484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98146d9f-0e31-4c11-bb1a-5c4974f733dd", 3, 0, 0.0, 666.3333333333333, 253, 1357, 389.0, 1357.0, 1357.0, 1357.0, 0.027937383012208637, 0.027855535210415058, 0.01791557439259473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 286.8333333333333, 131, 1426, 145.0, 544.9000000000015, 1426.0, 1426.0, 0.0867762618714747, 4.359946917333558, 0.05060065443764161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56071219-d6ee-4590-ab0a-9af60a5adda3", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a302471-e5f6-44e2-9344-b5731b28abc0", 1, 0, 0.0, 1174.0, 1174, 1174, 1174.0, 1174.0, 1174.0, 1174.0, 0.8517887563884157, 0.153887617120954, 0.587268419931857], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 280.5333333333333, 210, 375, 263.0, 359.40000000000003, 375.0, 375.0, 0.08447753460763001, 0.18447011642412225, 0.05461340616235456], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 154.35294117647058, 132, 394, 142.0, 196.3999999999998, 394.0, 394.0, 0.11381743683132256, 0.0845850287389028, 0.05713101809697246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 219.17647058823528, 129, 445, 144.0, 416.2, 445.0, 445.0, 0.11359080582654016, 0.04043018341574235, 0.0642210886342376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 967.3333333333334, 772, 1092, 1038.0, 1092.0, 1092.0, 1092.0, 0.033811960417465, 9.941839025482947, 0.019283383675585512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b6d9936-6328-437a-bd6f-12793e7028d3", 3, 0, 0.0, 784.3333333333334, 236, 1576, 541.0, 1576.0, 1576.0, 1576.0, 0.03563918885206172, 0.029710925341839216, 0.022854557955260937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1402.3333333333333, 1228, 1701, 1278.0, 1701.0, 1701.0, 1701.0, 0.03376021246427044, 30.377498519474017, 0.019220902213544597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 329.3333333333333, 143, 428, 417.0, 428.0, 428.0, 428.0, 0.03407116330308571, 0.060289988188663386, 0.018865575774267184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c01dba9-1c39-41ef-be99-bb32c4d076ad", 3, 0, 0.0, 349.6666666666667, 252, 544, 253.0, 544.0, 544.0, 544.0, 0.05405989836739107, 0.0336290578711212, 0.03466731763794284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 138.9, 130, 150, 137.5, 149.4, 150.0, 150.0, 0.06060128595928805, 0.04503669786622872, 0.03041900486628326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 218.0, 131, 429, 140.0, 425.3, 429.0, 429.0, 0.060508879678092764, 0.025279002662390707, 0.0340007903972408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 323.79999999999995, 132, 1422, 141.0, 1322.4000000000003, 1422.0, 1422.0, 0.06013409904086112, 5.425464019137677, 0.03483549565531135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 257.2, 130, 810, 135.0, 770.5000000000001, 810.0, 810.0, 0.06035622242475088, 1.7893144400753247, 0.03502311266092478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 235.66666666666666, 138, 426, 143.0, 426.0, 426.0, 426.0, 0.03417751802864076, 0.025399503144331658, 0.019191477408660583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1171.3846153846152, 132, 1931, 1411.0, 1784.9999999999998, 1931.0, 1931.0, 0.0683976534343514, 47.34604567845211, 0.03568885973219688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 254.11764705882354, 131, 1466, 143.0, 711.5999999999993, 1466.0, 1466.0, 0.11363332531215743, 6.04338291631574, 0.06622953346835646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 877.2307692307693, 141, 1183, 1043.0, 1181.0, 1183.0, 1183.0, 0.06829524560021014, 15.451224717625427, 0.035702119451011295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 209.7058823529412, 131, 1043, 141.0, 550.1999999999996, 1043.0, 1043.0, 0.11382200915932404, 1.9975474913963953, 0.06645065941441924], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 679.7333333333333, 242, 2522, 532.0, 1713.2000000000005, 2522.0, 2522.0, 0.08359014082152391, 0.015101734425763595, 0.05763148380858972], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 493.4, 271, 1559, 290.5, 1460.5000000000005, 1559.0, 1559.0, 0.060083516087361434, 7.271883308423709, 0.1335919428004927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 549.8000000000001, 142, 1724, 495.0, 856.3000000000002, 1680.9499999999994, 1724.0, 0.0849285750683675, 0.05216804074023746, 0.038400322516263824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 178.30769230769226, 131, 414, 138.0, 407.6, 414.0, 414.0, 0.0683983731710012, 0.05083121287415226, 0.03433277715810021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 355.4615384615385, 132, 447, 414.0, 441.0, 447.0, 447.0, 0.06829955132448592, 0.09718525399552376, 0.03453970699492482], "isController": false}, {"data": ["login", 20, 0, 0.0, 2630.65, 1641, 4005, 2660.0, 3858.800000000001, 4000.15, 4005.0, 0.08202873466575342, 14.835341253634898, 0.14416710329878557], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 150.11764705882354, 132, 200, 147.0, 171.2, 200.0, 200.0, 0.11265514933434059, 0.09120226445133629, 0.040045385114941386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74a3e590-3efe-43e2-acb8-fbfdb6edd3b2", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e01e58be-e933-4dd4-9978-d7466ade3650", 1, 0, 0.0, 2522.0, 2522, 2522, 2522.0, 2522.0, 2522.0, 2522.0, 0.3965107057890563, 0.07163523493259319, 0.27337554520222046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=367dad12-6058-4899-addf-db6a86441417", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d84c060-dc1b-48a7-a02e-83de6bb1547c", 3, 0, 0.0, 530.6666666666666, 288, 955, 349.0, 955.0, 955.0, 955.0, 0.017934110079567668, 0.024723618550445664, 0.011500715122639423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1395.1538461538462, 293, 2071, 1554.0, 1923.8, 2071.0, 2071.0, 0.06824505223371305, 62.828106339243526, 0.1400530785736784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbfe0fc6-1571-4915-91ae-e1a8031d37bd", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 525.6111111111111, 274, 1859, 546.0, 752.0000000000017, 1859.0, 1859.0, 0.08669768517180591, 5.889153811025538, 0.19375276950938744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1639.0, 1367, 2128, 1422.0, 2128.0, 2128.0, 2128.0, 0.03370559288137878, 40.323607046154194, 0.07600216207334337], "isController": false}, {"data": ["register", 24, 6, 25.0, 1097.5416666666667, 263, 2235, 1090.5, 1865.0, 2166.75, 2235.0, 0.09742118017641352, 0.03072953241892731, 0.043953696524905314], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 480.00000000000006, 276, 1611, 293.0, 978.9999999999994, 1611.0, 1611.0, 0.11347858592331518, 8.151397330249386, 0.253508084097645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 168.61538461538464, 135, 401, 151.0, 307.3999999999999, 401.0, 401.0, 0.07335556571248004, 0.056950854239669564, 0.02607561124935814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c01dba9-1c39-41ef-be99-bb32c4d076ad", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe1f9841-449c-4cdc-8cd6-e0b7c5aadada", 3, 0, 0.0, 447.66666666666663, 263, 724, 356.0, 724.0, 724.0, 724.0, 0.020990029735875458, 0.02105152396361728, 0.013460403183487842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 565.7894736842106, 271, 1825, 552.0, 1326.0, 1825.0, 1825.0, 0.09434243324031501, 12.011489876498306, 0.2096374597182637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 166.83333333333331, 133, 428, 140.5, 353.3000000000003, 428.0, 428.0, 0.056577353028538564, 0.0420462555221854, 0.028399179156903147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 204.91666666666666, 132, 411, 143.0, 410.1, 411.0, 411.0, 0.05657628604970227, 0.01513857654064299, 0.03226616313772082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56071219-d6ee-4590-ab0a-9af60a5adda3", 3, 0, 0.0, 313.6666666666667, 246, 445, 250.0, 445.0, 445.0, 445.0, 0.02869495351417531, 0.028779020760798867, 0.018401386205379348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 182.41666666666666, 133, 411, 140.0, 405.3, 411.0, 411.0, 0.05657548584198467, 0.01524886141834743, 0.03326019773132302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 186.91666666666666, 132, 428, 142.5, 423.20000000000005, 428.0, 428.0, 0.056577086280056574, 0.0152492927864215, 0.03331638967468176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98146d9f-0e31-4c11-bb1a-5c4974f733dd", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/069773a4-2788-4a5a-8efd-c4ea5dc9dcb9", 3, 0, 0.0, 976.3333333333333, 275, 2199, 455.0, 2199.0, 2199.0, 2199.0, 0.019912914188615124, 0.023536390435827316, 0.012769674788923109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b93a9202-c29f-44ae-bbcc-829ee95844fb", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1579.735849056604, 1046, 2320, 1519.0, 2174.0, 2297.1, 2320.0, 0.22887643263691562, 273.815783756035, 0.45194154960140953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d2dd28b-e0cd-4a2b-8af1-e9e639757d77", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/325e7ce2-3217-451f-a643-42f44b16a99e", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.6094197280534351, 1.13870169370229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1097.5416666666667, 263, 2235, 1090.5, 1865.0, 2166.75, 2235.0, 0.0936885169107773, 0.02955213961150495, 0.0422696238406046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 175.99999999999997, 130, 428, 132.0, 428.0, 428.0, 428.0, 0.05929590350015247, 0.01598209899027547, 0.03491741192440619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 176.7142857142857, 130, 444, 131.0, 444.0, 444.0, 444.0, 0.059297912713472484, 0.015982640536053132, 0.034860686966318784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 378.0, 131, 1687, 143.0, 1580.6, 1687.0, 1687.0, 0.07479259438250083, 10.370674165343413, 0.042981020660015884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 268.0, 132, 1176, 138.0, 1017.1999999999998, 1176.0, 1176.0, 0.07489816729946017, 3.4051659570545434, 0.04311483293387645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 139.85714285714286, 132, 149, 138.0, 149.0, 149.0, 149.0, 0.059298415038078055, 0.01586695871136073, 0.033818627326403894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 141.46153846153845, 132, 153, 144.0, 151.8, 153.0, 153.0, 0.0753435375529578, 0.055992609450977435, 0.03781892412326203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a302471-e5f6-44e2-9344-b5731b28abc0", 3, 0, 0.0, 486.0, 227, 911, 320.0, 911.0, 911.0, 911.0, 0.022486564277843988, 0.022552442884126733, 0.014420094930778858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 137.57142857142856, 132, 152, 133.0, 152.0, 152.0, 152.0, 0.059298415038078055, 0.04406845101950918, 0.029765024735910275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 200.92307692307693, 130, 431, 138.0, 428.6, 431.0, 431.0, 0.0753461576357535, 0.03757119849655436, 0.04199733245622678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 151.14285714285714, 137, 181, 148.0, 181.0, 181.0, 181.0, 0.057174127890356356, 0.045002292069948456, 0.020323615773525112], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 655.4285714285714, 443, 1357, 542.5, 1156.0, 1357.0, 1357.0, 0.08445793090134711, 0.015258512906981655, 0.057487478357655206], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1374.2500000000002, 820, 2204, 1338.5, 1780.1000000000001, 2182.9999999999995, 2204.0, 0.0831804891844569, 0.04305240162867398, 0.038259775786991405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 322.7142857142857, 266, 589, 280.0, 589.0, 589.0, 589.0, 0.05922917459914541, 0.09179365243051149, 0.1332078018572577], "isController": false}, {"data": ["addBook", 56, 3, 5.357142857142857, 1433.732142857143, 733, 2832, 1178.0, 2356.4, 2550.0499999999997, 2832.0, 0.26632045008156063, 97.72454848875034, 0.9660618279569892], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b6d9936-6328-437a-bd6f-12793e7028d3", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 257.9811320754718, 130, 585, 150.0, 558.8, 576.6, 585.0, 0.23043979216939497, 0.17125457211026326, 0.11139423547251028], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 897.7924528301887, 644, 1457, 845.0, 1241.0, 1318.4999999999998, 1457.0, 0.2303726821465518, 67.73721764404813, 0.11586126104050212], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 215.622641509434, 131, 704, 143.0, 439.6, 546.7999999999997, 704.0, 0.23090764130022784, 0.4085982871445438, 0.11229688024171237], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1320.3396226415093, 901, 1748, 1357.0, 1664.2, 1703.8999999999999, 1748.0, 0.22947994648354456, 206.48645922861184, 0.11518817626224795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 153.00000000000003, 134, 200, 150.0, 175.0, 200.0, 200.0, 0.09649862362489461, 0.0720912569072699, 0.03430224511666176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d09f260c-b71b-4fbd-80e9-7dc3f86d515e", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 3, 1.8181818181818181, 215.43636363636367, 132, 1054, 148.0, 392.8, 433.4, 1040.8000000000002, 0.6926719505642128, 1.481172540122498, 0.33392232313776193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 170.91666666666666, 133, 392, 147.0, 328.10000000000025, 392.0, 392.0, 0.0579488987294704, 0.04487644208249025, 0.020599022595241427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 160.83333333333337, 134, 450, 143.0, 184.50000000000043, 450.0, 450.0, 0.09214089366428976, 0.0747744947607664, 0.032753208294728005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/367dad12-6058-4899-addf-db6a86441417", 3, 0, 0.0, 308.0, 220, 443, 261.0, 443.0, 443.0, 443.0, 0.06759040216289287, 0.030582896811986032, 0.04334410555367805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 399.25, 270, 837, 290.5, 757.8000000000003, 837.0, 837.0, 0.05653923351645763, 0.08762476913146315, 0.12715806131679874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e01e58be-e933-4dd4-9978-d7466ade3650", 2, 0, 0.0, 271.5, 234, 309, 271.5, 309.0, 309.0, 309.0, 0.016424136911605294, 0.027779887823144892, 0.01020894838304372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 564.0, 270, 1819, 299.0, 1717.8, 1819.0, 1819.0, 0.07472767510706177, 13.851884942732733, 0.16512278870749864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74a3e590-3efe-43e2-acb8-fbfdb6edd3b2", 3, 0, 0.0, 593.3333333333334, 210, 866, 704.0, 866.0, 866.0, 866.0, 0.040365984930032295, 0.025951438879171153, 0.02588573903390743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 159.6, 140, 267, 147.5, 255.70000000000005, 267.0, 267.0, 0.06210678640855086, 0.05149283365318328, 0.022077021731164565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbfe0fc6-1571-4915-91ae-e1a8031d37bd", 3, 0, 0.0, 405.0, 218, 672, 325.0, 672.0, 672.0, 672.0, 0.03693034936110495, 0.03078731273235345, 0.0236825482556565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bfa01fe-e963-4622-b2d1-fa82b29acf6d", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 140.53846153846155, 132, 150, 141.0, 149.2, 150.0, 150.0, 0.06619447938041967, 0.05139122178460317, 0.023530068842258556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 152.31578947368422, 130, 392, 139.0, 153.0, 392.0, 392.0, 0.09455229488372556, 0.07026786758448746, 0.04746081989280756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 238.73684210526315, 131, 446, 137.0, 429.0, 446.0, 446.0, 0.09441462929835023, 0.040190273429735635, 0.053011174468296555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 361.578947368421, 136, 1432, 148.0, 1132.0, 1432.0, 1432.0, 0.0944324609099313, 8.967035848922974, 0.05466171745310683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 299.00000000000006, 131, 1192, 138.0, 1074.0, 1192.0, 1192.0, 0.09456076524543496, 2.9495415669216487, 0.054828330218634445], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 66.66666666666667, 0.48426150121065376], "isController": false}, {"data": ["401/Unauthorized", 3, 33.333333333333336, 0.24213075060532688], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1239, 9, "406/Not Acceptable", 6, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
