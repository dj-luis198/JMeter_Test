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

    var data = {"OkPercent": 97.48427672955975, "KoPercent": 2.5157232704402515};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7215870880968392, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87ade363-c8d1-4b27-80c0-972862bdbcee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe0896f4-003a-4038-a3df-f5540a0d531c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5305668e-206d-4cbe-a285-fc0ea4a5ee65"], "isController": false}, {"data": [0.4, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce513917-0ff9-4371-babf-3a9c6bb58c04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7614cf3d-e8f5-4dc1-bb5b-a3bfe7d8349f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0e67f20-afeb-48dd-9cfb-1971f6711964"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30aa68a4-350b-48f3-a9d6-e0f7aeca5769"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/367faab7-2c7b-4884-911f-c48fe51f1d53"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c016c5a5-a807-42ad-a6e2-ba88cb140750"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdb3b0d1-be23-46cd-bbcd-b293d698725b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a52da7d-f194-436d-9176-93b81b9226bb"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b4f72ab-a90e-486e-a128-e0bb51b714ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0e67f20-afeb-48dd-9cfb-1971f6711964"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cdebc298-e2ba-421e-8602-293b21689422"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce513917-0ff9-4371-babf-3a9c6bb58c04"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/14c06102-c3df-465f-9bd4-6ee16a97f366"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe0896f4-003a-4038-a3df-f5540a0d531c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7614cf3d-e8f5-4dc1-bb5b-a3bfe7d8349f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5305668e-206d-4cbe-a285-fc0ea4a5ee65"], "isController": false}, {"data": [0.24561403508771928, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30aa68a4-350b-48f3-a9d6-e0f7aeca5769"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=367faab7-2c7b-4884-911f-c48fe51f1d53"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8988095238095238, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c016c5a5-a807-42ad-a6e2-ba88cb140750"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a52da7d-f194-436d-9176-93b81b9226bb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b4f72ab-a90e-486e-a128-e0bb51b714ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87ade363-c8d1-4b27-80c0-972862bdbcee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdb3b0d1-be23-46cd-bbcd-b293d698725b"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 32, 2.5157232704402515, 481.0102201257863, 139, 2649, 158.0, 1324.7, 1633.1499999999992, 2115.97, 5.060148940232958, 707.6431244306337, 3.6992681344380527], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2436.4444444444434, 1715, 3315, 2336.0, 3035.5, 3149.5, 3315.0, 0.24510582671018052, 294.9443394880239, 1.2051834350446864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87ade363-c8d1-4b27-80c0-972862bdbcee", 3, 0, 0.0, 394.3333333333333, 240, 547, 396.0, 547.0, 547.0, 547.0, 0.024490195758298094, 0.024561944378683732, 0.015704975795523192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe0896f4-003a-4038-a3df-f5540a0d531c", 3, 0, 0.0, 592.6666666666666, 272, 1027, 479.0, 1027.0, 1027.0, 1027.0, 0.032037932912568484, 0.02670870644176038, 0.020545158801354137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5305668e-206d-4cbe-a285-fc0ea4a5ee65", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 579.3333333333334, 145, 1298, 546.0, 1165.4, 1298.0, 1298.0, 0.08779322938614974, 0.01786729394929063, 0.058831751957789016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 579.3333333333334, 145, 1298, 546.0, 1165.4, 1298.0, 1298.0, 0.08577212062991045, 0.017455966737571618, 0.05747737224242632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 221.10526315789474, 139, 448, 147.0, 446.0, 448.0, 448.0, 0.08773063923314187, 0.04428016433333949, 0.04887051130801766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 146.94736842105263, 142, 152, 147.0, 151.0, 152.0, 152.0, 0.0877298290653541, 0.06519765617063913, 0.04403626185507032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 348.3157894736842, 140, 1159, 149.0, 1129.0, 1159.0, 1159.0, 0.08773144941589324, 4.092958901856213, 0.05047173690954426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 415.3157894736842, 142, 1904, 148.0, 1403.0, 1904.0, 1904.0, 0.087732664718078, 12.484440258384241, 0.05038675964020372], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 272.0666666666667, 140, 396, 270.0, 370.20000000000005, 396.0, 396.0, 0.08843505329685879, 0.15405317194427412, 0.0571546076873644], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ce513917-0ff9-4371-babf-3a9c6bb58c04", 3, 0, 0.0, 531.3333333333334, 334, 875, 385.0, 875.0, 875.0, 875.0, 0.020732836666712738, 0.024505511047146468, 0.013295471430151072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 147.21428571428572, 141, 154, 147.5, 152.5, 154.0, 154.0, 0.0876413216311302, 0.06513188062625985, 0.043991835271875904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 166.14285714285714, 141, 420, 148.5, 285.0, 420.0, 420.0, 0.08764022435897435, 0.023450606908553686, 0.04998231545472757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 926.5, 724, 1125, 871.5, 1125.0, 1125.0, 1125.0, 0.0644786897930234, 18.958875693145917, 0.03677300277258366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1631.1666666666667, 1324, 1903, 1615.5, 1903.0, 1903.0, 1903.0, 0.06396452101234515, 57.55538844454276, 0.03641730053730197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 366.0, 143, 606, 426.0, 606.0, 606.0, 606.0, 0.0647836227001814, 0.11463664485618036, 0.035871400459963725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 175.75, 143, 438, 149.5, 362.7000000000003, 438.0, 438.0, 0.06982305673705219, 0.0518899865008757, 0.03504790152621565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 245.83333333333331, 143, 450, 149.5, 447.6, 450.0, 450.0, 0.06970503154152677, 0.027376015805615904, 0.03926580634199612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 368.75, 142, 1814, 149.0, 1441.1000000000013, 1814.0, 1814.0, 0.06965283864339489, 5.240021369273231, 0.04044943494134651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 307.5, 143, 1173, 150.5, 955.2000000000007, 1173.0, 1173.0, 0.06982386928971669, 1.7281294003584293, 0.04061694479841267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7614cf3d-e8f5-4dc1-bb5b-a3bfe7d8349f", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0e67f20-afeb-48dd-9cfb-1971f6711964", 3, 0, 0.0, 404.6666666666667, 267, 567, 380.0, 567.0, 567.0, 567.0, 0.030313440979730412, 0.030402249888850718, 0.01943928344077764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 245.50000000000003, 143, 444, 148.5, 444.0, 444.0, 444.0, 0.06498218405120597, 0.04829242388961693, 0.036489019364690845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1102.533333333333, 139, 1962, 1439.0, 1881.6000000000001, 1962.0, 1962.0, 0.0813232926174715, 48.7905341551052, 0.04315005435106723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 186.92857142857144, 140, 448, 145.5, 435.0, 448.0, 448.0, 0.08763693270735523, 0.023620892018779344, 0.05152093114241001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30aa68a4-350b-48f3-a9d6-e0f7aeca5769", 3, 0, 0.0, 356.3333333333333, 266, 473, 330.0, 473.0, 473.0, 473.0, 0.05634966847611713, 0.03622740730479536, 0.036135692349593344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 835.1333333333332, 140, 1504, 1125.0, 1403.8, 1504.0, 1504.0, 0.08131844302287759, 15.94752080396834, 0.04322689370324189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 199.64285714285714, 143, 595, 146.0, 521.0, 595.0, 595.0, 0.08763967573319979, 0.023621631349964003, 0.05160812936242136], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 481.46666666666664, 146, 985, 490.0, 834.4000000000001, 985.0, 985.0, 0.08583887470957847, 0.017469552235816557, 0.05795800583418218], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 598.0, 291, 1962, 464.0, 1640.1000000000013, 1962.0, 1962.0, 0.06959184383590243, 7.036869224239419, 0.15502987737337184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/367faab7-2c7b-4884-911f-c48fe51f1d53", 3, 0, 0.0, 730.0, 353, 1121, 716.0, 1121.0, 1121.0, 1121.0, 0.020009871536624733, 0.02365099073876446, 0.012831851213265211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 592.5999999999999, 185, 1179, 596.0, 983.7000000000002, 1169.4999999999998, 1179.0, 0.09657217079754127, 0.059320210382474085, 0.04366495613209142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 165.40000000000003, 142, 426, 148.0, 261.6000000000001, 426.0, 426.0, 0.08131844302287759, 0.060432944473056485, 0.04081804659546785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 281.46666666666664, 140, 447, 151.0, 447.0, 447.0, 447.0, 0.08131800217932246, 0.10318280354654913, 0.04182371205837548], "isController": false}, {"data": ["login", 20, 0, 0.0, 2748.6, 1476, 4385, 2490.0, 4121.2, 4372.4, 4385.0, 0.09734207465163705, 35.06842349338804, 0.19529253726984683], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 175.07142857142858, 145, 451, 153.0, 315.5, 451.0, 451.0, 0.08379069085424609, 0.0678344557794629, 0.02978497213959529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c016c5a5-a807-42ad-a6e2-ba88cb140750", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdb3b0d1-be23-46cd-bbcd-b293d698725b", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1291.6000000000001, 290, 2107, 1588.0, 2030.2, 2107.0, 2107.0, 0.08125192973333116, 64.84567867536333, 0.16887811567295558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 626.7894736842105, 291, 2047, 568.0, 1547.0, 2047.0, 2047.0, 0.08766870457953628, 16.67477145576191, 0.19362725660399124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 1010.0833333333335, 140, 2062, 930.5, 2058.1, 2062.0, 2062.0, 0.10175010175010174, 60.877860926689046, 0.1484269672746235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a52da7d-f194-436d-9176-93b81b9226bb", 3, 0, 0.0, 340.6666666666667, 233, 519, 270.0, 519.0, 519.0, 519.0, 0.06940909721900884, 0.03221919682106335, 0.04451039112026283], "isController": false}, {"data": ["register", 24, 6, 25.0, 1139.9583333333335, 265, 2316, 1080.5, 1820.5, 2198.5, 2316.0, 0.09377234419138934, 0.029578581224432385, 0.0423074443519745], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b4f72ab-a90e-486e-a128-e0bb51b714ab", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0e67f20-afeb-48dd-9cfb-1971f6711964", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 211.47619047619045, 149, 515, 152.0, 447.2, 508.2999999999999, 515.0, 0.12105002248071846, 0.09397926550016716, 0.04302950017869289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 390.92857142857144, 288, 747, 299.5, 672.5, 747.0, 747.0, 0.08755910239411603, 0.13569950732369349, 0.1969224734508293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 441.0, 286, 869, 303.0, 770.5999999999999, 869.0, 869.0, 0.09075911995686273, 0.14065890954252064, 0.20411938794985826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdebc298-e2ba-421e-8602-293b21689422", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.5515301165803109, 1.030534866148532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 175.63636363636363, 143, 457, 149.0, 395.8000000000002, 457.0, 457.0, 0.05498652830056636, 0.040864011754620115, 0.027600659713370224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 253.9090909090909, 142, 444, 149.0, 443.8, 444.0, 444.0, 0.05498570371703357, 0.014712971502409375, 0.03135903415112071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 225.54545454545453, 141, 443, 149.0, 441.6, 443.0, 443.0, 0.05498652830056636, 0.014820587706012026, 0.03232606448920015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 198.0, 143, 443, 148.0, 438.40000000000003, 443.0, 443.0, 0.05498652830056636, 0.014820587706012026, 0.03237976227074367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 148.0, 146, 152, 146.0, 152.0, 152.0, 152.0, 0.253399780386857, 0.0747331383562801, 0.15664263768054734], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1689.296296296296, 1129, 2649, 1569.0, 2433.5, 2535.75, 2649.0, 0.23969744855382538, 286.76148078647395, 0.47330882907796384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce513917-0ff9-4371-babf-3a9c6bb58c04", 1, 0, 0.0, 985.0, 985, 985, 985.0, 985.0, 985.0, 985.0, 1.0152284263959392, 0.1834152918781726, 0.6999524111675127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1139.9583333333335, 265, 2316, 1080.5, 1820.5, 2198.5, 2316.0, 0.09570713616334017, 0.030188872051522344, 0.0431803680736945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 144.5, 144, 145, 144.5, 145.0, 145.0, 145.0, 0.024218645935505746, 0.006527681912304283, 0.014261565917099574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 0.024216886434911062, 0.006527207671909623, 0.014236880501773887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 160.66666666666669, 143, 433, 147.0, 159.8, 405.89999999999964, 433.0, 0.11434234096886077, 0.030818834089263256, 0.06722079029614667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 189.6190476190476, 141, 446, 148.0, 442.8, 445.7, 446.0, 0.11415835394525836, 0.030769243836807913, 0.06722410881737381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14c06102-c3df-465f-9bd4-6ee16a97f366", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.4966344284603421, 0.9279621889580093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 148.47619047619048, 142, 158, 149.0, 156.2, 157.9, 158.0, 0.11434296355181914, 0.08497558131145935, 0.057394807876596725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 148.5, 147, 150, 148.5, 150.0, 150.0, 150.0, 0.024217472906702186, 0.006480065992613671, 0.013811527517103591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 159.85714285714286, 140, 443, 147.0, 151.6, 413.8999999999996, 443.0, 0.11434483134137377, 0.030596175573766028, 0.06521228662437722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 150.5, 149, 152, 150.5, 152.0, 152.0, 152.0, 0.024216006780481896, 0.017996465976510473, 0.012155300278484077], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 502.20000000000005, 141, 875, 537.0, 779.6, 875.0, 875.0, 0.08552271483305966, 0.016937506414203614, 0.05819553485905857], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 159.5, 153, 166, 159.5, 166.0, 166.0, 166.0, 0.02658160552897395, 0.02092263091440723, 0.00944893009037746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1263.9500000000005, 968, 1754, 1206.0, 1684.9, 1750.8, 1754.0, 0.09612380746401365, 0.04975158003508519, 0.044213196597217216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 301.0, 299, 303, 301.0, 303.0, 303.0, 303.0, 0.024172105390379502, 0.037462042240754174, 0.05436363155668359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe0896f4-003a-4038-a3df-f5540a0d531c", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7614cf3d-e8f5-4dc1-bb5b-a3bfe7d8349f", 3, 0, 0.0, 447.33333333333337, 255, 708, 379.0, 708.0, 708.0, 708.0, 0.042509777248767214, 0.02732969077679533, 0.027260501686221163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5305668e-206d-4cbe-a285-fc0ea4a5ee65", 3, 0, 0.0, 381.3333333333333, 252, 588, 304.0, 588.0, 588.0, 588.0, 0.016415778846627378, 0.022630476372222312, 0.010527045679640603], "isController": false}, {"data": ["addBook", 57, 14, 24.56140350877193, 1414.3157894736842, 751, 3605, 1157.0, 2666.0, 2854.7999999999993, 3605.0, 0.2721296291875737, 81.04878967960316, 0.9889176178273552], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30aa68a4-350b-48f3-a9d6-e0f7aeca5769", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 0.24884857093663912, 0.9496599517906337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=367faab7-2c7b-4884-911f-c48fe51f1d53", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 267.3148148148148, 142, 601, 150.0, 581.5, 598.5, 601.0, 0.24089828293057222, 0.17902694659195845, 0.11644985356507154], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 934.1851851851853, 697, 1333, 881.0, 1179.0, 1184.0, 1333.0, 0.2403567963109683, 70.6728787121772, 0.12088256845717643], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 199.40740740740742, 141, 599, 150.0, 431.0, 445.25, 599.0, 0.24140227901633043, 0.4271688765406159, 0.11740071772473881], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1414.2407407407404, 973, 2051, 1371.5, 1879.5, 1932.0, 2051.0, 0.24051737960768943, 216.4179609554553, 0.120728450310891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 150.94117647058826, 143, 156, 152.0, 155.2, 156.0, 156.0, 0.08869318418965733, 0.06626004482918736, 0.031527655317417254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 14, 8.333333333333334, 223.77380952380946, 142, 1330, 154.0, 392.2, 461.8999999999997, 1220.2900000000004, 0.7269297171464547, 1.5882319057241387, 0.3483627449601703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 161.0909090909091, 145, 204, 153.0, 199.20000000000002, 204.0, 204.0, 0.05788133274399612, 0.04482411803319231, 0.02057500499884237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 152.47368421052633, 143, 174, 151.0, 159.0, 174.0, 174.0, 0.0855097053515574, 0.069393130026508, 0.03039602807418642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 457.6363636363636, 294, 902, 301.0, 840.2000000000003, 902.0, 902.0, 0.054945054945054944, 0.08515410370879122, 0.12357271634615385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 368.28571428571433, 291, 598, 300.0, 592.6, 597.5, 598.0, 0.114067821467564, 0.17678284440334383, 0.2565412039451171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c016c5a5-a807-42ad-a6e2-ba88cb140750", 3, 0, 0.0, 418.0, 347, 537, 370.0, 537.0, 537.0, 537.0, 0.03273715339538843, 0.02729161778827792, 0.020993552144829168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 153.66666666666666, 145, 175, 151.0, 172.0, 175.0, 175.0, 0.07198862579712406, 0.059685882130623355, 0.02558970682632144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 151.9333333333333, 143, 169, 151.0, 161.8, 169.0, 169.0, 0.08447848614552826, 0.0655863246930615, 0.030029461872043254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a52da7d-f194-436d-9176-93b81b9226bb", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.5524894877675841, 2.108419342507645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b4f72ab-a90e-486e-a128-e0bb51b714ab", 3, 0, 0.0, 372.6666666666667, 261, 591, 266.0, 591.0, 591.0, 591.0, 0.0374995312558593, 0.023766792758840513, 0.024047550968112896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 163.8235294117647, 141, 424, 148.0, 215.19999999999982, 424.0, 424.0, 0.0909742810356084, 0.06760881627743945, 0.04566482466045187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 214.17647058823528, 140, 448, 146.0, 444.0, 448.0, 448.0, 0.09098547978784327, 0.0243457240838565, 0.05189015644150437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87ade363-c8d1-4b27-80c0-972862bdbcee", 1, 0, 0.0, 734.0, 734, 734, 734.0, 734.0, 734.0, 734.0, 1.3623978201634876, 0.24613632493188012, 0.9393094346049047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdb3b0d1-be23-46cd-bbcd-b293d698725b", 3, 0, 0.0, 401.3333333333333, 323, 501, 380.0, 501.0, 501.0, 501.0, 0.0423968343697004, 0.027257079388072356, 0.027188074123798756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 221.11764705882354, 140, 595, 148.0, 462.9999999999999, 595.0, 595.0, 0.09084593598033452, 0.02448581868219954, 0.053407474082188856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 231.9411764705882, 141, 444, 149.0, 442.4, 444.0, 444.0, 0.09083913991364938, 0.02448398692985081, 0.0534921888358697], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 18.75, 0.4716981132075472], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.2358490566037736], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.2358490566037736], "isController": false}, {"data": ["401/Unauthorized", 20, 62.5, 1.5723270440251573], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 32, "401/Unauthorized", 20, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
