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

    var data = {"OkPercent": 67.92763157894737, "KoPercent": 32.07236842105263};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5284848484848484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/989cf3c9-8e54-4ed5-8ee0-a3ce507b9c94"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a66f082-9e5d-48d8-8e24-93b52fd38f27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07079398-51c5-48a6-a7c1-6bc6f845a832"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/adc714db-8101-4e68-9cb3-425ce15b48f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af5ea44f-affb-4839-8516-ab4eb72d92ae"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fc651b5-f56f-41f8-889e-b42051d4fb90"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72207508-b187-47e2-9907-90d7951cc510"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/894e4e16-9b58-4486-9e98-04d82794749b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fc651b5-f56f-41f8-889e-b42051d4fb90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=894e4e16-9b58-4486-9e98-04d82794749b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc62dfdc-063b-485b-8d52-c3bf5de281d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b9e32b8-278b-4988-9858-8e820b808a26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adc714db-8101-4e68-9cb3-425ce15b48f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc62dfdc-063b-485b-8d52-c3bf5de281d5"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72207508-b187-47e2-9907-90d7951cc510"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07079398-51c5-48a6-a7c1-6bc6f845a832"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad6f443e-5726-41d2-b7f4-1652bc8fd6e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f37fa0ab-a771-4e7e-aeb5-d3f719c97dbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f37fa0ab-a771-4e7e-aeb5-d3f719c97dbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad6f443e-5726-41d2-b7f4-1652bc8fd6e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/046bf7d8-2371-4ef3-b3c0-09286ad49859"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c10d897-842a-46bb-bee0-df6dabdb324f"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fc00ba9-061d-4aab-b93c-3c4e3a0234e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fc00ba9-061d-4aab-b93c-3c4e3a0234e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af5ea44f-affb-4839-8516-ab4eb72d92ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b9e32b8-278b-4988-9858-8e820b808a26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c10d897-842a-46bb-bee0-df6dabdb324f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/530200e3-6a04-41f7-86d1-06c780040ee1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fb65984-da3c-4e71-8ad4-06098e534b8b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/494da990-8782-47d3-8926-54133c090e05"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=494da990-8782-47d3-8926-54133c090e05"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 608, 195, 32.07236842105263, 244.09046052631592, 84, 2034, 92.0, 580.7000000000004, 1029.2999999999997, 1368.0199999999993, 2.3805701622154967, 2.5031064813274027, 1.1412927305981573], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/989cf3c9-8e54-4ed5-8ee0-a3ce507b9c94", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["see books", 56, 56, 100.0, 498.9464285714284, 345, 979, 522.5, 622.4000000000001, 678.3999999999999, 979.0, 0.25771891150576876, 1.6587464002765877, 0.4326355555453286], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 89.74999999999999, 86, 102, 87.5, 97.80000000000001, 102.0, 102.0, 0.07323794091529116, 0.056859534206695775, 0.026033799309732406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 108.84210526315789, 84, 338, 87.0, 252.0, 338.0, 338.0, 0.09873002016170938, 0.04907576197491219, 0.04955784215148303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a66f082-9e5d-48d8-8e24-93b52fd38f27", 2, 0, 0.0, 280.5, 166, 395, 280.5, 395.0, 395.0, 395.0, 0.03204460609167962, 0.027006342829218273, 0.019918351345072343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07079398-51c5-48a6-a7c1-6bc6f845a832", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adc714db-8101-4e68-9cb3-425ce15b48f2", 3, 0, 0.0, 560.6666666666666, 194, 823, 665.0, 823.0, 823.0, 823.0, 0.017127980268566732, 0.023612303527793005, 0.010983763388371244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af5ea44f-affb-4839-8516-ab4eb72d92ae", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 87.70588235294117, 85, 94, 87.0, 93.2, 94.0, 94.0, 0.08888238246612012, 0.04418079362817885, 0.044614789636314205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fc651b5-f56f-41f8-889e-b42051d4fb90", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 165.28571428571428, 85, 693, 88.0, 346.3, 385.2, 693.0, 0.24246307850175136, 0.12052119820057758, 0.11720627329918645], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 579.0, 88, 1511, 478.0, 1349.6000000000001, 1511.0, 1511.0, 0.0750198802682711, 0.014124836831760416, 0.05075075363721386], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 579.0, 88, 1511, 478.0, 1349.6000000000001, 1511.0, 1511.0, 0.07668633245058844, 0.014438598531712355, 0.05187810419883232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 900.7826086956521, 115, 1843, 981.0, 1300.6000000000001, 1737.3999999999985, 1843.0, 0.11908830138660205, 0.0377005084552694, 0.05372929222715835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72207508-b187-47e2-9907-90d7951cc510", 3, 0, 0.0, 269.3333333333333, 162, 476, 170.0, 476.0, 476.0, 476.0, 0.04003736821032964, 0.026209357900707324, 0.025675005004671025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/894e4e16-9b58-4486-9e98-04d82794749b", 3, 0, 0.0, 329.0, 258, 421, 308.0, 421.0, 421.0, 421.0, 0.05711783409173124, 0.025844332482912246, 0.036628298554918795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fc651b5-f56f-41f8-889e-b42051d4fb90", 3, 0, 0.0, 324.3333333333333, 165, 500, 308.0, 500.0, 500.0, 500.0, 0.026324102348109932, 0.02640122374170791, 0.016881016154224143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=894e4e16-9b58-4486-9e98-04d82794749b", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc62dfdc-063b-485b-8d52-c3bf5de281d5", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.22498637920298878, 0.8585966687422166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b9e32b8-278b-4988-9858-8e820b808a26", 3, 0, 0.0, 301.0, 180, 500, 223.0, 500.0, 500.0, 500.0, 0.09626183218353922, 0.04462137012674475, 0.06173040670624098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 123.4, 89, 254, 89.0, 254.0, 254.0, 254.0, 0.04416961130742049, 0.034766315150176676, 0.01570091651943463], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 491.0769230769231, 346, 1075, 427.0, 910.9999999999999, 1075.0, 1075.0, 0.09799709024024364, 0.017704552435981513, 0.06670309755610333], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adc714db-8101-4e68-9cb3-425ce15b48f2", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc62dfdc-063b-485b-8d52-c3bf5de281d5", 3, 0, 0.0, 234.0, 172, 346, 184.0, 346.0, 346.0, 346.0, 0.07438815740534108, 0.033658704034317734, 0.04770334312777406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1106.086956521739, 676, 2034, 1086.0, 1462.6000000000004, 1934.9999999999986, 2034.0, 0.11394035470127811, 0.05897303514812246, 0.05240811236748241], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 191.46666666666664, 86, 365, 179.0, 330.8, 365.0, 365.0, 0.07467776544211725, 0.11792377609365587, 0.047855028987419286], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 89.0, 87, 96, 87.0, 96.0, 96.0, 96.0, 0.044542636211381534, 0.022140822101165237, 0.022358315442041123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72207508-b187-47e2-9907-90d7951cc510", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07079398-51c5-48a6-a7c1-6bc6f845a832", 3, 0, 0.0, 249.66666666666669, 159, 427, 163.0, 427.0, 427.0, 427.0, 0.021376199739210365, 0.029468817023292935, 0.013708044754636856], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 603.8305084745759, 344, 2239, 564.0, 753.0, 801.0, 2239.0, 0.2914976556671591, 1.018316682867843, 0.5681975208494934], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad6f443e-5726-41d2-b7f4-1652bc8fd6e3", 3, 0, 0.0, 250.33333333333334, 165, 378, 208.0, 378.0, 378.0, 378.0, 0.04873452678774489, 0.031331604949803436, 0.031252284430943175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f37fa0ab-a771-4e7e-aeb5-d3f719c97dbb", 3, 0, 0.0, 263.3333333333333, 185, 391, 214.0, 391.0, 391.0, 391.0, 0.05843738434267682, 0.026441394608177335, 0.037474494516625434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 89.35294117647058, 86, 100, 88.0, 95.19999999999999, 100.0, 100.0, 0.08817747532327418, 0.06587477404521948, 0.03134433693132012], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 451.84615384615387, 181, 1021, 363.0, 1011.0, 1021.0, 1021.0, 0.09573888324274962, 0.01729657558584832, 0.06600747223572385], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 170.896551724138, 86, 1799, 93.0, 297.5, 399.0, 1477.25, 0.7048757960235282, 1.5825089843813296, 0.33760661119820784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f37fa0ab-a771-4e7e-aeb5-d3f719c97dbb", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 137.28571428571428, 86, 259, 91.0, 259.0, 259.0, 259.0, 0.08936436404488644, 0.06920502020272944, 0.031766238781580726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, 100.0, 135.74999999999997, 86, 340, 88.5, 284.00000000000006, 340.0, 340.0, 0.09834171286678386, 0.04888274594647752, 0.04936293009133486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 120.29411764705881, 86, 269, 88.0, 265.0, 269.0, 269.0, 0.10733610723508502, 0.08710576671128481, 0.038154631868721624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad6f443e-5726-41d2-b7f4-1652bc8fd6e3", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/046bf7d8-2371-4ef3-b3c0-09286ad49859", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c10d897-842a-46bb-bee0-df6dabdb324f", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 423.6521739130435, 101, 1033, 379.0, 848.8000000000003, 1014.3999999999997, 1033.0, 0.11350513734121617, 0.06972141737072753, 0.05132117049705381], "isController": false}, {"data": ["login", 23, 5, 21.73913043478261, 1752.4782608695652, 1016, 2294, 1713.0, 2182.6000000000004, 2283.7999999999997, 2294.0, 0.11903960913603122, 0.17734637420877478, 0.17869588064726494], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 86.57142857142857, 84, 92, 86.0, 92.0, 92.0, 92.0, 0.08510948727613166, 0.04230539943706153, 0.04272097310540202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 118.10526315789475, 86, 266, 89.0, 261.0, 266.0, 266.0, 0.09852778742889146, 0.07976517165874122, 0.03502354943761376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 108.5625, 84, 263, 88.0, 254.60000000000002, 263.0, 263.0, 0.07619954756518633, 0.037876532920585786, 0.03824860102393142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fc00ba9-061d-4aab-b93c-3c4e3a0234e3", 3, 0, 0.0, 253.0, 160, 388, 211.0, 388.0, 388.0, 388.0, 0.08139566432428032, 0.036829418427978405, 0.0521970894267032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fc00ba9-061d-4aab-b93c-3c4e3a0234e3", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 124.0625, 87, 263, 92.0, 257.4, 263.0, 263.0, 0.09611861036519065, 0.07969209003910825, 0.03416716227825136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 87.22222222222221, 85, 91, 87.0, 90.1, 91.0, 91.0, 0.09439156768662, 0.046919246047353105, 0.04738014237394793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af5ea44f-affb-4839-8516-ab4eb72d92ae", 3, 0, 0.0, 269.0, 179, 438, 190.0, 438.0, 438.0, 438.0, 0.10930156301235107, 0.05073698855976974, 0.07009247367654024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b9e32b8-278b-4988-9858-8e820b808a26", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c10d897-842a-46bb-bee0-df6dabdb324f", 3, 0, 0.0, 311.0, 189, 379, 365.0, 379.0, 379.0, 379.0, 0.025743559819451832, 0.025818980404860383, 0.01650872813942712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 112.05555555555556, 87, 462, 90.0, 147.9000000000005, 462.0, 462.0, 0.08996761165980247, 0.06984790163041305, 0.03198067445719541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/530200e3-6a04-41f7-86d1-06c780040ee1", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fb65984-da3c-4e71-8ad4-06098e534b8b", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/494da990-8782-47d3-8926-54133c090e05", 3, 0, 0.0, 477.3333333333333, 176, 1075, 181.0, 1075.0, 1075.0, 1075.0, 0.05432519059087699, 0.03492586309146551, 0.034837443184904844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 97.76470588235294, 85, 254, 87.0, 125.99999999999989, 254.0, 254.0, 0.1090974432693295, 0.05422910021883663, 0.05476180257855016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, 100.0, 114.66666666666667, 84, 259, 86.5, 259.0, 259.0, 259.0, 0.060644039701631326, 0.030144351765752288, 0.0340530496371465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=494da990-8782-47d3-8926-54133c090e05", 1, 0, 0.0, 996.0, 996, 996, 996.0, 996.0, 996.0, 996.0, 1.004016064257028, 0.18138962098393574, 0.6922220130522089], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 900.7826086956521, 115, 1843, 981.0, 1300.6000000000001, 1737.3999999999985, 1843.0, 0.11211308798440166, 0.03549232269071411, 0.050582272117962464], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5641025641025643, 0.8223684210526315], "isController": false}, {"data": ["401/Unauthorized", 13, 6.666666666666667, 2.138157894736842], "isController": false}, {"data": ["404/Not Found", 177, 90.76923076923077, 29.111842105263158], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 608, 195, "404/Not Found", 177, "401/Unauthorized", 13, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
