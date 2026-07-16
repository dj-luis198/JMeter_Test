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

    var data = {"OkPercent": 96.54088050314465, "KoPercent": 3.459119496855346};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7017484868863484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ff658962-197e-4b3d-8014-dcffdc4f22f3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d0a5624-1dd3-4316-9dae-56859f1422a0"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3172da6a-f504-4504-aaaf-e4a20a47e7d3"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4db50c5a-7be9-404d-b2c4-908c965b8a99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe14a875-bb2d-42af-8044-8f39d7badd91"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba072309-12a1-43e9-b876-0eddefb2c244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0aa19cd-a070-40c6-9f66-bb4dbe6fd245"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9d801b8-cfc8-4598-8a93-c8bf304fd5d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fe427ef-07ef-416e-bd5b-5dae6349a000"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3172da6a-f504-4504-aaaf-e4a20a47e7d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=825eae11-74d8-4c3e-9159-e54cc5873b12"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6f424f4-fdd9-4fe3-93dd-a85b90b70060"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52cc4380-9d08-4e42-b219-b0ec6a23cac0"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d0a5624-1dd3-4316-9dae-56859f1422a0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ba072309-12a1-43e9-b876-0eddefb2c244"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5fe427ef-07ef-416e-bd5b-5dae6349a000"], "isController": false}, {"data": [0.24528301886792453, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4db50c5a-7be9-404d-b2c4-908c965b8a99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d689b61-d324-43e0-b4b8-c6f9171356e6"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff658962-197e-4b3d-8014-dcffdc4f22f3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fe14a875-bb2d-42af-8044-8f39d7badd91"], "isController": false}, {"data": [0.20535714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32075471698113206, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8545454545454545, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e9d801b8-cfc8-4598-8a93-c8bf304fd5d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52cc4380-9d08-4e42-b219-b0ec6a23cac0"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/825eae11-74d8-4c3e-9159-e54cc5873b12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7a592dbf-e52d-40ef-a8d4-d514c0f6ef44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6f424f4-fdd9-4fe3-93dd-a85b90b70060"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 44, 3.459119496855346, 494.32625786163567, 136, 3763, 162.0, 1359.0, 1670.0, 2276.3699999999994, 5.045156530740948, 705.5425986584426, 3.6927195505765043], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/ff658962-197e-4b3d-8014-dcffdc4f22f3", 3, 0, 0.0, 874.0, 247, 1883, 492.0, 1883.0, 1883.0, 1883.0, 0.020427896335235396, 0.02816150422516989, 0.013099920501436761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d0a5624-1dd3-4316-9dae-56859f1422a0", 3, 0, 0.0, 396.0, 241, 527, 420.0, 527.0, 527.0, 527.0, 0.020604961674771285, 0.02435436713577296, 0.0132134682614907], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2386.2264150943392, 1747, 3355, 2318.0, 2944.0, 3038.7, 3355.0, 0.2509053897318153, 301.9238884565768, 1.2336998411129783], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3172da6a-f504-4504-aaaf-e4a20a47e7d3", 3, 0, 0.0, 377.66666666666663, 237, 658, 238.0, 658.0, 658.0, 658.0, 0.060379181258302134, 0.038267664684216884, 0.03871972235639818], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 537.1333333333333, 148, 1289, 508.0, 1077.2, 1289.0, 1289.0, 0.08060572515597207, 0.017018513455782387, 0.05375814117824075], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 537.1333333333333, 148, 1289, 508.0, 1077.2, 1289.0, 1289.0, 0.08086166186887472, 0.017072550093799526, 0.053928832303694836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 250.75000000000003, 139, 440, 150.0, 439.3, 440.0, 440.0, 0.08766787027346895, 0.03168756883297627, 0.04953791155955662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 182.18749999999997, 139, 427, 146.0, 426.3, 427.0, 427.0, 0.0876726740713546, 0.0651551806331063, 0.04400757272722291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 244.12500000000006, 136, 844, 143.5, 571.7000000000003, 844.0, 844.0, 0.08767123287671233, 1.6332940924657535, 0.05115582191780822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 311.18750000000006, 136, 1654, 147.0, 814.7000000000008, 1654.0, 1654.0, 0.0876731544800982, 4.952682396121011, 0.051071324850955634], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 299.66666666666663, 145, 588, 267.0, 548.4, 588.0, 588.0, 0.08060485886089214, 0.12793922259300458, 0.05208879095398537], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4db50c5a-7be9-404d-b2c4-908c965b8a99", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 160.50000000000003, 140, 425, 146.5, 154.9, 411.49999999999983, 425.0, 0.1862943264062893, 0.13844724843279899, 0.09351101930940693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 1090.6666666666667, 852, 1293, 1132.0, 1293.0, 1293.0, 1293.0, 0.05716064045322037, 16.807126205136836, 0.03259942775847724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 186.79999999999998, 139, 433, 145.0, 423.0, 432.55, 433.0, 0.18630820967125916, 0.06384331130238753, 0.10547155190080951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1512.222222222222, 1350, 1763, 1521.0, 1763.0, 1763.0, 1763.0, 0.057006042640519894, 51.294137373874136, 0.03245558872990537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 270.6666666666667, 140, 444, 147.0, 444.0, 444.0, 444.0, 0.05750982459503498, 0.101765431802933, 0.03184381889197738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 174.63636363636363, 141, 465, 145.0, 404.0000000000002, 465.0, 465.0, 0.05530528517416137, 0.04110090040775079, 0.02776066072218647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 174.0, 139, 454, 143.0, 394.2000000000002, 454.0, 454.0, 0.055305841302402285, 0.014798633317244361, 0.0315416126177763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 260.3636363636364, 140, 572, 152.0, 543.4000000000001, 572.0, 572.0, 0.055186530472998735, 0.01487449454155044, 0.03244364389135277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 234.63636363636365, 138, 581, 143.0, 553.6000000000001, 581.0, 581.0, 0.0551840387692956, 0.014873822949536705, 0.03249606970496606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe14a875-bb2d-42af-8044-8f39d7badd91", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba072309-12a1-43e9-b876-0eddefb2c244", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 179.66666666666666, 143, 441, 145.0, 441.0, 441.0, 441.0, 0.057509457110724874, 0.04273896177857581, 0.03229290804557305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1109.2142857142853, 139, 2183, 1326.0, 1968.5, 2183.0, 2183.0, 0.06853875376963145, 39.65242762582981, 0.036506830621156935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 257.7, 139, 1838, 145.5, 435.3, 1767.949999999999, 1838.0, 0.185821796896776, 8.407719516514913, 0.10844443928272787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 829.1428571428571, 141, 1359, 1119.0, 1318.5, 1359.0, 1359.0, 0.06853976040458042, 12.962075405363725, 0.0365743001600893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 223.50000000000003, 137, 851, 146.0, 442.40000000000003, 830.5999999999997, 851.0, 0.1857820961793912, 2.7788756177254696, 0.10860269802049176], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 566.4, 148, 2709, 509.0, 1609.8000000000006, 2709.0, 2709.0, 0.08101320515243984, 0.017104545853474117, 0.054314712673165726], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 467.45454545454544, 284, 910, 311.0, 873.4000000000001, 910.0, 910.0, 0.05514392564593589, 0.0854623144532229, 0.12401998121346715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 736.6086956521739, 276, 1349, 632.0, 1273.2, 1333.9999999999998, 1349.0, 0.09966978965340914, 0.06122294696483823, 0.04506553965774261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 165.4285714285714, 140, 415, 146.0, 284.5, 415.0, 415.0, 0.06854177376318817, 0.05093778304080684, 0.034404757533475314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0aa19cd-a070-40c6-9f66-bb4dbe6fd245", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 277.1428571428571, 138, 549, 159.5, 502.5, 549.0, 549.0, 0.06854244490900992, 0.08452101988710081, 0.03539000957146284], "isController": false}, {"data": ["login", 23, 0, 0.0, 3540.4347826086955, 1920, 5369, 3461.0, 5217.2, 5340.799999999999, 5369.0, 0.10182442812302162, 47.802725512055126, 0.2197015949357842], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 151.3, 142, 162, 150.0, 161.0, 161.95, 162.0, 0.1740083698025875, 0.14087201031869634, 0.061854537703263525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9d801b8-cfc8-4598-8a93-c8bf304fd5d4", 1, 0, 0.0, 2709.0, 2709, 2709, 2709.0, 2709.0, 2709.0, 2709.0, 0.36913990402362495, 0.06669031469176818, 0.2545046603912883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fe427ef-07ef-416e-bd5b-5dae6349a000", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1277.5714285714287, 292, 2328, 1475.0, 2116.0, 2328.0, 2328.0, 0.06848946485267428, 52.71183023265627, 0.14276919417252495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3172da6a-f504-4504-aaaf-e4a20a47e7d3", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 0.20600235176738882, 0.7861495153933865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=825eae11-74d8-4c3e-9159-e54cc5873b12", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6f424f4-fdd9-4fe3-93dd-a85b90b70060", 3, 0, 0.0, 432.3333333333333, 303, 516, 478.0, 516.0, 516.0, 516.0, 0.023529780859307597, 0.02359871576416885, 0.015089084730740873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 571.5625000000001, 289, 1797, 567.0, 1155.8000000000006, 1797.0, 1797.0, 0.08759923350670683, 6.677222702231043, 0.19561191144264986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 1017.125, 145, 1963, 1518.5, 1928.7, 1963.0, 1963.0, 0.08062078000604656, 54.26283358422352, 0.12554186769374182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52cc4380-9d08-4e42-b219-b0ec6a23cac0", 3, 0, 0.0, 435.6666666666667, 255, 530, 522.0, 530.0, 530.0, 530.0, 0.019221281803212517, 0.026498088683790694, 0.012326147510523652], "isController": false}, {"data": ["register", 24, 9, 37.5, 1161.5833333333333, 245, 2016, 1215.5, 1896.5, 1997.25, 2016.0, 0.09833929515310198, 0.030586978033459944, 0.04436792418040344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d0a5624-1dd3-4316-9dae-56859f1422a0", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba072309-12a1-43e9-b876-0eddefb2c244", 3, 0, 0.0, 695.6666666666667, 286, 1250, 551.0, 1250.0, 1250.0, 1250.0, 0.047666714333381, 0.030645104429826653, 0.030567521886966334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 450.95, 286, 1988, 299.0, 823.4000000000005, 1931.0999999999992, 1988.0, 0.18552703592731049, 11.370895866573594, 0.41488121051752763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 167.0625, 143, 429, 148.0, 240.7000000000002, 429.0, 429.0, 0.08911365332561015, 0.06918491640025398, 0.03167711895558799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 417.6875, 285, 884, 305.5, 883.3, 884.0, 884.0, 0.0847112141764217, 0.1312858368144348, 0.19051750610185464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 170.72727272727272, 141, 423, 145.0, 369.0000000000002, 423.0, 423.0, 0.06019217720576969, 0.04473266294295971, 0.030213651448989867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 222.0, 139, 437, 147.0, 435.2, 437.0, 437.0, 0.06019184783500867, 0.024324688507187456, 0.033868601880174445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 303.27272727272725, 140, 1610, 142.0, 1376.2000000000007, 1610.0, 1610.0, 0.05971218725741924, 4.899097641979296, 0.034637733623932646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 347.54545454545456, 141, 1205, 152.0, 1054.6000000000006, 1205.0, 1205.0, 0.05984375340021326, 1.6143043741703478, 0.034772493430787976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 152.0, 148, 160, 150.0, 160.0, 160.0, 160.0, 0.023875750593909298, 0.007041481132188093, 0.014759130982367759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fe427ef-07ef-416e-bd5b-5dae6349a000", 3, 0, 0.0, 679.0, 473, 1063, 501.0, 1063.0, 1063.0, 1063.0, 0.024212684218172426, 0.02861857304563284, 0.015527014293554584], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1611.1320754716976, 1094, 2745, 1510.0, 2341.0, 2440.8, 2745.0, 0.2378398754257558, 284.53917752839493, 0.4696408477645296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1161.5833333333333, 245, 2016, 1215.5, 1896.5, 1997.25, 2016.0, 0.09723054983875934, 0.030242119261371922, 0.043867689478033996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 318.2, 142, 443, 414.0, 443.0, 443.0, 443.0, 0.03189507795157051, 0.00859672022913424, 0.018781964848434588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 205.8, 146, 437, 149.0, 437.0, 437.0, 437.0, 0.03194908593665135, 0.00861127706886306, 0.018782568099476673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 178.875, 137, 424, 143.5, 424.0, 424.0, 424.0, 0.08483203257550051, 0.02286488378011537, 0.049871956650831356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4db50c5a-7be9-404d-b2c4-908c965b8a99", 3, 0, 0.0, 415.6666666666667, 267, 635, 345.0, 635.0, 635.0, 635.0, 0.054831575676713026, 0.035893977436806605, 0.03516217580830881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 232.9375, 139, 435, 150.5, 428.7, 435.0, 435.0, 0.08483293214425841, 0.022865126242007146, 0.04995533015916779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 164.3125, 138, 416, 148.5, 234.00000000000017, 416.0, 416.0, 0.08483293214425841, 0.0630447864861139, 0.042582155392723454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 145.8, 140, 154, 146.0, 154.0, 154.0, 154.0, 0.031949698394847154, 0.00854904039080871, 0.018221312365811267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 199.00000000000003, 136, 459, 145.0, 442.20000000000005, 459.0, 459.0, 0.08483203257550051, 0.022699196216491347, 0.04838076857821513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 203.2, 144, 425, 149.0, 425.0, 425.0, 425.0, 0.03194908593665135, 0.02374341249784344, 0.0160369435267957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 150.0, 146, 153, 151.0, 153.0, 153.0, 153.0, 0.03273300993119522, 0.025764458988811856, 0.011635562123979547], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 550.7857142857142, 148, 1250, 528.5, 1133.0, 1250.0, 1250.0, 0.08082487558742364, 0.016107468579329615, 0.05499767448070018], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d689b61-d324-43e0-b4b8-c6f9171356e6", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1729.347826086956, 1063, 3763, 1455.0, 2607.4, 3546.5999999999967, 3763.0, 0.10059746144492945, 0.05206704547442638, 0.046270902676329856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff658962-197e-4b3d-8014-dcffdc4f22f3", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 523.4, 290, 869, 566.0, 869.0, 869.0, 869.0, 0.031864588245790686, 0.04938388822858381, 0.07166420579107027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe14a875-bb2d-42af-8044-8f39d7badd91", 3, 0, 0.0, 871.6666666666666, 283, 1786, 546.0, 1786.0, 1786.0, 1786.0, 0.07187350263536177, 0.0325208882367034, 0.046090755270723524], "isController": false}, {"data": ["addBook", 56, 20, 35.714285714285715, 1340.875, 723, 3021, 1088.5, 2499.6, 2903.4, 3021.0, 0.2579575291353816, 67.20041047203925, 0.938150471866507], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 253.54716981132074, 142, 611, 153.0, 577.2, 602.4, 611.0, 0.23917507163970306, 0.17774631788849027, 0.11561685591958303], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 932.6415094339624, 686, 1415, 859.0, 1247.0, 1322.2999999999997, 1415.0, 0.23862802393484103, 70.16456223295047, 0.12001311750629212], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 217.52830188679243, 139, 455, 148.0, 430.6, 438.29999999999995, 455.0, 0.23938572719060522, 0.42360052506775064, 0.11642001185636856], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1356.0754716981135, 949, 2135, 1346.0, 1802.2, 1878.0, 2135.0, 0.23850989816077367, 214.61162562074452, 0.1197207887252321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 191.24999999999997, 145, 467, 153.5, 441.1, 467.0, 467.0, 0.08010734384074661, 0.05984581839665151, 0.028475657380890394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 20, 12.121212121212121, 207.99393939393943, 140, 1291, 154.0, 349.4, 497.8999999999997, 982.7800000000016, 0.6740912024969972, 1.4973274773362366, 0.3218889222813697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 154.72727272727275, 149, 162, 154.0, 162.0, 162.0, 162.0, 0.05986166513384524, 0.0463577152843157, 0.02127895127804655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 171.5, 143, 425, 155.5, 247.2000000000002, 425.0, 425.0, 0.08245595048520173, 0.0669149363800807, 0.029310513649036554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9d801b8-cfc8-4598-8a93-c8bf304fd5d4", 3, 0, 0.0, 833.0, 281, 1202, 1016.0, 1202.0, 1202.0, 1202.0, 0.06894174422612892, 0.03119434390440078, 0.044210688842927726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52cc4380-9d08-4e42-b219-b0ec6a23cac0", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 559.1818181818181, 285, 1764, 303.0, 1583.0000000000007, 1764.0, 1764.0, 0.0596661947613081, 6.573292885755509, 0.1328028381445983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 420.06250000000006, 283, 851, 304.5, 677.4000000000002, 851.0, 851.0, 0.08476776281979963, 0.13137347616701367, 0.19064468532617046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 186.36363636363635, 141, 455, 160.0, 401.0000000000002, 455.0, 455.0, 0.053196634103878516, 0.04410541245526647, 0.018909741029113067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/825eae11-74d8-4c3e-9159-e54cc5873b12", 3, 0, 0.0, 487.0, 284, 589, 588.0, 589.0, 589.0, 589.0, 0.0839442610106889, 0.03798259205887291, 0.05383144342156808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 177.2142857142857, 145, 444, 153.0, 315.5, 444.0, 444.0, 0.06819388495691607, 0.05294349466869949, 0.02424079504327876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a592dbf-e52d-40ef-a8d4-d514c0f6ef44", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.6152908236994219, 1.1496718448940269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 182.75000000000003, 141, 434, 148.5, 430.5, 434.0, 434.0, 0.08477584736108683, 0.06300236312674519, 0.04255350150742054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 220.125, 140, 454, 146.0, 451.2, 454.0, 454.0, 0.0847767457386439, 0.022684402668348074, 0.04834923780407035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 166.0625, 138, 450, 145.5, 260.3000000000002, 450.0, 450.0, 0.0847767457386439, 0.022849982249868863, 0.04983945403775744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 191.5625, 140, 568, 145.0, 465.8000000000001, 568.0, 568.0, 0.08477809334068077, 0.022850345470730362, 0.04992303738713916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6f424f4-fdd9-4fe3-93dd-a85b90b70060", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.454545454545453, 0.7075471698113207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.090909090909092, 0.31446540880503143], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.818181818181818, 0.2358490566037736], "isController": false}, {"data": ["401/Unauthorized", 28, 63.63636363636363, 2.20125786163522], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 44, "401/Unauthorized", 28, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
