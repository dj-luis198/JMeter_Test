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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8022292993630573, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49107142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abaf18c6-74a4-4c25-96d5-6eef51ebed99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3daa5c8b-1331-45eb-9fcb-b1b9fbfb2875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3daa5c8b-1331-45eb-9fcb-b1b9fbfb2875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbef4231-57af-408a-bba8-627eb4f1ae3b"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8660714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5471f327-e961-4e79-ad69-1f78f9d8b15f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8575581395348837, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5471f327-e961-4e79-ad69-1f78f9d8b15f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45c5880c-ecaa-40dd-bc7f-66bef30791ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45c5880c-ecaa-40dd-bc7f-66bef30791ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abaf18c6-74a4-4c25-96d5-6eef51ebed99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ca46293-7d28-4285-9cd9-31dd14ef025f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8eb6e8c0-0159-4961-afdd-13ccffe981bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06dfc918-153f-4243-88b0-4210c8dce352"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54873325-e935-4505-b612-4eb116b39866"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbef4231-57af-408a-bba8-627eb4f1ae3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab032652-bcf9-4943-bf0d-d3e56336ff20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54873325-e935-4505-b612-4eb116b39866"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8eb6e8c0-0159-4961-afdd-13ccffe981bd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/44d93583-da1c-474c-a03e-3d33a6404e76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab032652-bcf9-4943-bf0d-d3e56336ff20"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/06dfc918-153f-4243-88b0-4210c8dce352"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ceb87b4a-c1b4-4e64-9ff2-75ced3c8e947"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ceb87b4a-c1b4-4e64-9ff2-75ced3c8e947"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ca46293-7d28-4285-9cd9-31dd14ef025f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44d93583-da1c-474c-a03e-3d33a6404e76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 51, 3.794642857142857, 263.80059523809473, 77, 3379, 90.0, 657.5, 801.75, 1134.9499999999996, 5.330266315017153, 762.5773945485237, 3.913833372166809], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1187.2857142857138, 968, 1807, 1160.5, 1412.1000000000001, 1464.45, 1807.0, 0.2357319054715059, 283.66457891993747, 1.159091937547883], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 227.06249999999997, 164, 792, 168.5, 467.20000000000033, 792.0, 792.0, 0.07920086328940985, 6.03705970043511, 0.17685808009682305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 86.62500000000001, 80, 95, 86.0, 91.5, 95.0, 95.0, 0.07476076555023924, 0.058041805285586126, 0.026575115879186605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abaf18c6-74a4-4c25-96d5-6eef51ebed99", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 216.88235294117646, 164, 347, 168.0, 335.0, 347.0, 347.0, 0.09845141712128055, 0.15258046774557837, 0.22141954456084875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 102.00000000000001, 81, 247, 83.0, 239.79999999999998, 247.0, 247.0, 0.08445400485858923, 0.0627631813451039, 0.04239195165753404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 109.70588235294115, 79, 249, 82.0, 237.79999999999998, 249.0, 249.0, 0.08445484398209557, 0.022598268799896667, 0.04816565320853888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 138.76470588235293, 80, 248, 83.0, 247.2, 248.0, 248.0, 0.08445610269862087, 0.02276355893048766, 0.049650951000556415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 101.70588235294117, 80, 245, 84.0, 241.8, 245.0, 245.0, 0.08445442441825805, 0.022763106581483616, 0.04973243937911094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 87.0, 83, 92, 86.5, 92.0, 92.0, 92.0, 0.12916141948400015, 0.03809252801188285, 0.07984294778649617], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 772.2321428571428, 629, 1445, 657.0, 1064.2, 1087.1499999999999, 1445.0, 0.2365704050423292, 283.0204496105037, 0.46713413964413053], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 394.4375, 85, 809, 406.5, 742.5000000000001, 809.0, 809.0, 0.09721656813362417, 0.020340478244754864, 0.06491389498180228], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 394.4375, 85, 809, 406.5, 742.5000000000001, 809.0, 809.0, 0.09614575696756283, 0.020116434013965172, 0.06419888801422957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 12, 50.0, 624.0000000000001, 128, 1168, 707.0, 1080.5, 1148.5, 1168.0, 0.10745851653517922, 0.032951146671920194, 0.04848226038989532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 122.06249999999997, 79, 250, 81.0, 249.3, 250.0, 250.0, 0.09595259941588856, 0.034682085799614994, 0.05421930941115089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 80.66666666666667, 80, 82, 80.0, 82.0, 82.0, 82.0, 0.023833167825223434, 0.006423783515392254, 0.014034570506454817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 99.81250000000001, 80, 286, 84.0, 186.6000000000001, 286.0, 286.0, 0.095952023988006, 0.07130809595202399, 0.048163418290854576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 133.0, 79, 237, 83.0, 237.0, 237.0, 237.0, 0.0238333571666905, 0.006423834548834549, 0.014011407240573908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 142.75000000000003, 80, 583, 82.0, 345.7000000000003, 583.0, 583.0, 0.09595317485067288, 1.7875846899213186, 0.05598830270827836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 140.25, 79, 707, 82.0, 380.10000000000036, 707.0, 707.0, 0.095952023988006, 5.4203581802848575, 0.05589392803598201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 111.50000000000001, 80, 240, 82.5, 237.2, 240.0, 240.0, 0.07490496432651074, 0.020189228666129846, 0.0440359262935151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 102.125, 78, 249, 82.0, 242.0, 249.0, 249.0, 0.07490356166435713, 0.02018885060484626, 0.04410824969102281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 83.50000000000001, 80, 99, 82.5, 91.30000000000001, 99.0, 99.0, 0.07490321100702686, 0.055665374586276795, 0.03759790083751153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 138.33333333333334, 84, 247, 84.0, 247.0, 247.0, 247.0, 0.02383241048943827, 0.0063770317129942244, 0.013591921607257763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3daa5c8b-1331-45eb-9fcb-b1b9fbfb2875", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 102.43750000000001, 77, 247, 82.0, 247.0, 247.0, 247.0, 0.07490531500025749, 0.020043023740303274, 0.04271943746108434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 135.66666666666666, 81, 242, 84.0, 242.0, 242.0, 242.0, 0.023802534176471987, 0.017689187996382014, 0.011947756412799415], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 381.625, 83, 650, 400.0, 648.6, 650.0, 650.0, 0.09818480835552719, 0.01987187649578419, 0.06680689963057966], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 88.0, 86, 90, 88.0, 90.0, 90.0, 90.0, 0.026628321883154924, 0.020959401794748894, 0.009465536294402726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1054.875, 658, 1682, 1004.5, 1525.0, 1667.75, 1682.0, 0.10723285614712348, 0.05550138062302289, 0.04932292504423355], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 174.87500000000006, 81, 263, 174.0, 262.3, 263.0, 263.0, 0.09752054026379306, 0.14821526935477972, 0.06302169679645024], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 274.6666666666667, 166, 490, 168.0, 490.0, 490.0, 490.0, 0.023786492443824234, 0.036864417488622125, 0.053496379002077356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 83.875, 81, 88, 84.0, 87.3, 88.0, 88.0, 0.0792338090663286, 0.0588837194330821, 0.039771658066496976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3daa5c8b-1331-45eb-9fcb-b1b9fbfb2875", 3, 0, 0.0, 314.6666666666667, 172, 403, 369.0, 403.0, 403.0, 403.0, 0.019667359394769792, 0.027113042655224632, 0.012612206382713702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 82.00000000000001, 79, 87, 81.5, 85.6, 87.0, 87.0, 0.07923773300845863, 0.0286404940720271, 0.04477434888869079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 12, 0, 0.0, 459.5833333333333, 394, 574, 412.5, 573.4, 574.0, 574.0, 0.09993254553176606, 29.38348645914008, 0.05699277987358533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbef4231-57af-408a-bba8-627eb4f1ae3b", 3, 0, 0.0, 299.3333333333333, 239, 397, 262.0, 397.0, 397.0, 397.0, 0.07742734733908016, 0.03594121006039333, 0.04965230281835544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 12, 0, 0.0, 896.9166666666666, 552, 3295, 710.5, 2531.2000000000025, 3295.0, 3295.0, 0.09965287581590791, 89.66783283022471, 0.05673596347722101], "isController": false}, {"data": ["addBook", 58, 23, 39.6551724137931, 747.6896551724138, 420, 2309, 625.5, 1243.3, 1308.9999999999989, 2309.0, 0.26469393622701615, 66.6235377300099, 0.9627243623386165], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 12, 0, 0.0, 412.24999999999994, 79, 2832, 243.0, 2082.300000000003, 2832.0, 2832.0, 0.10007839474254833, 0.17709184694677496, 0.055414501776391505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 85.0, 78, 101, 84.0, 95.0, 101.0, 101.0, 0.07023003036098237, 0.05219243467256599, 0.03525218320853997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 105.30769230769232, 78, 246, 81.0, 241.2, 246.0, 246.0, 0.0702319274342116, 0.0187925274579824, 0.0400541461148238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 81.84615384615385, 80, 85, 82.0, 84.6, 85.0, 85.0, 0.07023078917797562, 0.01892939239562624, 0.04128802254408332], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 152.80357142857147, 78, 552, 85.0, 336.0, 337.15, 552.0, 0.23712335495672499, 0.17622155578326926, 0.11462505928083874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 106.92307692307692, 80, 246, 83.0, 243.2, 246.0, 246.0, 0.0702311685926214, 0.018929494659729987, 0.0413568307239753], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 448.3035714285714, 388, 629, 410.0, 573.3, 577.45, 629.0, 0.23732333185006252, 69.78093944017121, 0.11935694912381073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5471f327-e961-4e79-ad69-1f78f9d8b15f", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 12, 0, 0.0, 95.75000000000001, 80, 238, 83.5, 192.10000000000016, 238.0, 238.0, 0.10007839474254833, 0.07437466640535086, 0.05619636423531766], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 123.1428571428571, 79, 334, 85.0, 247.20000000000002, 326.05, 334.0, 0.2376335097196349, 0.4204999214960727, 0.11556785921911931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 140.81250000000003, 79, 707, 83.0, 384.3000000000003, 707.0, 707.0, 0.07923577098881289, 4.476052110209529, 0.04615638417463564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 474.99999999999994, 79, 802, 633.5, 759.3000000000001, 802.0, 802.0, 0.10304166103157582, 57.95858218296979, 0.05504276228932811], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 617.8928571428571, 544, 852, 570.5, 735.3, 750.8499999999999, 852.0, 0.2371645286566747, 213.40105977604892, 0.11904547629836992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 121.87500000000003, 80, 554, 83.5, 330.7000000000002, 554.0, 554.0, 0.0792361633849689, 1.4761507659908482, 0.04623399181886613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 379.93749999999994, 79, 648, 479.0, 599.7, 648.0, 648.0, 0.10303436195971356, 18.9451162919865, 0.05513948276750296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 88.4705882352941, 83, 107, 87.0, 100.6, 107.0, 107.0, 0.09955084998858094, 0.07437148461060979, 0.03538721620687838], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 332.93749999999994, 83, 746, 363.5, 676.7, 746.0, 746.0, 0.09632519385445262, 0.020153977327457495, 0.06469497272792948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 23, 13.372093023255815, 135.94767441860458, 80, 1478, 87.0, 258.70000000000005, 304.04999999999995, 804.2100000000095, 0.7207086409613919, 1.6169828038184988, 0.3431108031920689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5471f327-e961-4e79-ad69-1f78f9d8b15f", 3, 0, 0.0, 345.6666666666667, 222, 458, 357.0, 458.0, 458.0, 458.0, 0.05852516582130316, 0.026481113441279753, 0.03753078667577058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 106.82352941176472, 83, 248, 88.0, 244.8, 248.0, 248.0, 0.08908125782736052, 0.06898577876669619, 0.03166560336831956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45c5880c-ecaa-40dd-bc7f-66bef30791ca", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45c5880c-ecaa-40dd-bc7f-66bef30791ca", 3, 0, 0.0, 316.3333333333333, 189, 494, 266.0, 494.0, 494.0, 494.0, 0.05653763521917757, 0.03634825180920433, 0.03625623091854811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 205.9230769230769, 161, 333, 169.0, 332.6, 333.0, 333.0, 0.07019779578921222, 0.10879287296628885, 0.15787648799077708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abaf18c6-74a4-4c25-96d5-6eef51ebed99", 3, 0, 0.0, 283.6666666666667, 176, 438, 237.0, 438.0, 438.0, 438.0, 0.04249953958832113, 0.027323108947569737, 0.027253936519854367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ca46293-7d28-4285-9cd9-31dd14ef025f", 3, 0, 0.0, 296.0, 241, 396, 251.0, 396.0, 396.0, 396.0, 0.020022157854692527, 0.023665512750777527, 0.012839730134682382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 88.625, 82, 121, 85.5, 110.50000000000001, 121.0, 121.0, 0.09679312284862161, 0.0785498877804732, 0.034406930387595965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 414.08333333333337, 103, 1062, 316.5, 894.0, 1023.75, 1062.0, 0.10367170626349892, 0.0636811555075594, 0.046875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 94.0, 80, 254, 83.0, 138.5000000000001, 254.0, 254.0, 0.10303834314344225, 0.07657439368374956, 0.05172041833567316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 148.3125, 79, 326, 84.5, 271.40000000000003, 326.0, 326.0, 0.10303834314344225, 0.12429503258587601, 0.053355548292783446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8eb6e8c0-0159-4961-afdd-13ccffe981bd", 3, 0, 0.0, 380.66666666666663, 223, 650, 269.0, 650.0, 650.0, 650.0, 0.03260408855270451, 0.02718068710399617, 0.020908220849227825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06dfc918-153f-4243-88b0-4210c8dce352", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["login", 24, 0, 0.0, 2150.4999999999995, 1231, 4572, 2050.0, 3154.0, 4261.25, 4572.0, 0.10689042395414401, 64.07710348663201, 0.24989812006466872], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 242.76470588235293, 163, 496, 170.0, 486.4, 496.0, 496.0, 0.0844179383153159, 0.13083131651016244, 0.18985792181657474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 87.625, 83, 96, 86.0, 95.3, 96.0, 96.0, 0.07971422450514903, 0.06453426964332866, 0.028335915742064698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54873325-e935-4505-b612-4eb116b39866", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbef4231-57af-408a-bba8-627eb4f1ae3b", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 218.1875, 163, 339, 169.0, 334.8, 339.0, 339.0, 0.07487341712916601, 0.11603917283592427, 0.16839206996920833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab032652-bcf9-4943-bf0d-d3e56336ff20", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54873325-e935-4505-b612-4eb116b39866", 3, 0, 0.0, 235.0, 159, 385, 161.0, 385.0, 385.0, 385.0, 0.03634997758418049, 0.030303480661811922, 0.023310369739855324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8eb6e8c0-0159-4961-afdd-13ccffe981bd", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44d93583-da1c-474c-a03e-3d33a6404e76", 3, 0, 0.0, 595.3333333333334, 263, 875, 648.0, 875.0, 875.0, 875.0, 0.017746648841143832, 0.024465188099688843, 0.011380500721697053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 112.46153846153845, 84, 249, 86.0, 246.6, 249.0, 249.0, 0.0689900388997681, 0.057199749048733504, 0.02452380289015194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab032652-bcf9-4943-bf0d-d3e56336ff20", 3, 0, 0.0, 244.0, 170, 376, 186.0, 376.0, 376.0, 376.0, 0.04160310636527527, 0.03468279798224934, 0.026679075370961033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 581.5, 166, 888, 717.0, 848.1, 888.0, 888.0, 0.10297865767319724, 77.05877114682825, 0.21513388030018277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06dfc918-153f-4243-88b0-4210c8dce352", 3, 0, 0.0, 564.3333333333334, 226, 995, 472.0, 995.0, 995.0, 995.0, 0.047486387235659115, 0.030529171481258704, 0.030451882439534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ceb87b4a-c1b4-4e64-9ff2-75ced3c8e947", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 87.5, 82, 102, 86.5, 96.4, 102.0, 102.0, 0.10062196954927646, 0.07811959549968242, 0.035767965738219366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ceb87b4a-c1b4-4e64-9ff2-75ced3c8e947", 3, 0, 0.0, 298.0, 163, 497, 234.0, 497.0, 497.0, 497.0, 0.07037792948131466, 0.032623102728317734, 0.04513168003847327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ca46293-7d28-4285-9cd9-31dd14ef025f", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 301.9375, 163, 791, 320.5, 608.3000000000002, 791.0, 791.0, 0.0959048623765225, 7.310316525381822, 0.21415864837081616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 8, 40.0, 637.1000000000001, 81, 3379, 657.5, 942.0000000000002, 3257.749999999998, 3379.0, 0.1606386994690891, 115.32503232853827, 0.2599083957816278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44d93583-da1c-474c-a03e-3d33a6404e76", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.24217702747989275, 0.924199899463807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 85.8235294117647, 81, 99, 84.0, 97.4, 99.0, 99.0, 0.0984981922684713, 0.07320031671514322, 0.04944147541601001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 119.82352941176471, 79, 248, 82.0, 248.0, 248.0, 248.0, 0.09850047511993881, 0.026356572444202378, 0.056176052216840106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 81.94117647058823, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.09849990439715162, 0.026548802357044772, 0.05790717035848171], "isController": false}, {"data": ["register", 24, 12, 50.0, 624.0000000000001, 128, 1168, 707.0, 1080.5, 1148.5, 1168.0, 0.10466820180029308, 0.03209552281766799, 0.0472233488591166], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 128.1764705882353, 80, 246, 82.0, 244.4, 246.0, 246.0, 0.09849990439715162, 0.026548802357044772, 0.058003361671369554], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 12, 23.529411764705884, 0.8928571428571429], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 7.8431372549019605, 0.2976190476190476], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 7.8431372549019605, 0.2976190476190476], "isController": false}, {"data": ["401/Unauthorized", 31, 60.78431372549019, 2.306547619047619], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 51, "401/Unauthorized", 31, "406/Not Acceptable", 12, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 12, "406/Not Acceptable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 23, "401/Unauthorized", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
