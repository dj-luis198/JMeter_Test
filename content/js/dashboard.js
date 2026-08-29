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

    var data = {"OkPercent": 96.5701219512195, "KoPercent": 3.4298780487804876};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7202614379084967, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c50c17f-d82d-4cdf-8eb9-3e3f3a8ed7f7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e41a081-288b-490c-8191-082f22571c14"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec88f947-7bbd-4a38-af4f-01263ccefc43"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3209b2d2-a15c-42d2-88a9-3d4f718d4729"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/417e94a0-9393-4d18-83ae-1228259f44fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a5420c9-c77f-4186-bb81-8dc282141474"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c50c17f-d82d-4cdf-8eb9-3e3f3a8ed7f7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=417e94a0-9393-4d18-83ae-1228259f44fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3209b2d2-a15c-42d2-88a9-3d4f718d4729"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.21929824561403508, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=944693ff-b92d-4ea9-8ac4-25dd8af8b4ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a29ef95d-4b6f-4c11-9409-36141898bd46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e41a081-288b-490c-8191-082f22571c14"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/944693ff-b92d-4ea9-8ac4-25dd8af8b4ca"], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8668639053254438, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69e9be29-0245-4096-8d66-bae9e4986f00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec88f947-7bbd-4a38-af4f-01263ccefc43"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/50241f74-8ab2-46ad-901e-f31b7ea27f9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69e9be29-0245-4096-8d66-bae9e4986f00"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50241f74-8ab2-46ad-901e-f31b7ea27f9f"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a29ef95d-4b6f-4c11-9409-36141898bd46"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4a5420c9-c77f-4186-bb81-8dc282141474"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44eb73c1-cb13-4ec6-972d-8b47d2373474"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=307cfcda-d079-4868-8857-74cb0431bc10"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/307cfcda-d079-4868-8857-74cb0431bc10"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 45, 3.4298780487804876, 444.4138719512197, 124, 2780, 140.0, 1263.7, 1510.0, 2030.4799999999996, 5.088032265570464, 727.0239225621461, 3.7354140509869693], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8c50c17f-d82d-4cdf-8eb9-3e3f3a8ed7f7", 3, 0, 0.0, 362.0, 272, 503, 311.0, 503.0, 503.0, 503.0, 0.027262565770939922, 0.027342436569096972, 0.01748283026326551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e41a081-288b-490c-8191-082f22571c14", 3, 0, 0.0, 395.6666666666667, 333, 507, 347.0, 507.0, 507.0, 507.0, 0.016964008029630467, 0.023386254559077158, 0.010878611920042976], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2130.3454545454547, 1527, 3103, 2085.0, 2565.4, 2898.9999999999995, 3103.0, 0.2540169313830991, 305.6666468697032, 1.248999267103422], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 155.58333333333331, 128, 382, 131.0, 316.0000000000002, 382.0, 382.0, 0.06064526562626344, 0.04708299430945257, 0.021557496765585833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 413.25, 257, 1368, 270.0, 775.1000000000006, 1368.0, 1368.0, 0.1197085097786889, 9.124741703171528, 0.2673129601295845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec88f947-7bbd-4a38-af4f-01263ccefc43", 3, 0, 0.0, 313.3333333333333, 230, 469, 241.0, 469.0, 469.0, 469.0, 0.023303323830755725, 0.027543739853344417, 0.014943863263863537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 398.0952380952381, 255, 770, 265.0, 732.8000000000001, 768.6999999999999, 770.0, 0.10899239129306497, 0.16891691892782626, 0.24512644252727403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3209b2d2-a15c-42d2-88a9-3d4f718d4729", 3, 0, 0.0, 1195.0, 221, 2780, 584.0, 2780.0, 2780.0, 2780.0, 0.03178875313913937, 0.026500975517361955, 0.02038536578258612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 129.55555555555554, 126, 137, 129.0, 137.0, 137.0, 137.0, 0.05209659867095789, 0.03871631991074116, 0.026150050504758156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/417e94a0-9393-4d18-83ae-1228259f44fd", 3, 0, 0.0, 650.6666666666667, 239, 1466, 247.0, 1466.0, 1466.0, 1466.0, 0.03386654324193129, 0.028233143633654312, 0.0217178027951187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 127.33333333333333, 126, 129, 127.0, 129.0, 129.0, 129.0, 0.05209750337186619, 0.013940152269425134, 0.02971185739176744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 128.0, 125, 130, 128.0, 130.0, 130.0, 130.0, 0.052096900234436055, 0.014041742641312843, 0.03062727923938526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 128.0, 127, 129, 128.0, 129.0, 129.0, 129.0, 0.052097201801405466, 0.014041823923035069, 0.030678332701413572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 131.0, 129, 133, 131.0, 133.0, 133.0, 133.0, 0.12538136832866636, 0.0369777082375559, 0.07750625600785724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a5420c9-c77f-4186-bb81-8dc282141474", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1475.763636363636, 1001, 2546, 1393.0, 2033.8, 2343.3999999999996, 2546.0, 0.24671310854031067, 295.15464916835253, 0.48716201705909], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 501.2666666666667, 131, 1211, 509.0, 949.4000000000001, 1211.0, 1211.0, 0.08450418577400201, 0.017841606410487532, 0.05635813014771332], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 501.2666666666667, 131, 1211, 509.0, 949.4000000000001, 1211.0, 1211.0, 0.08459234946791412, 0.017860220659143587, 0.05641692890295002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 1179.9583333333335, 183, 2176, 1170.5, 2011.0, 2135.5, 2176.0, 0.09813903848277047, 0.030237174454408284, 0.04427757400296871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c50c17f-d82d-4cdf-8eb9-3e3f3a8ed7f7", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=417e94a0-9393-4d18-83ae-1228259f44fd", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 191.375, 127, 381, 129.0, 381.0, 381.0, 381.0, 0.03820329885485612, 0.010296982894472938, 0.02249666914988109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 161.79999999999998, 126, 382, 128.0, 381.4, 382.0, 382.0, 0.08910114762278137, 0.023841518016252047, 0.0508154982536175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 191.75, 128, 382, 129.0, 382.0, 382.0, 382.0, 0.03815683412747244, 0.010284459198420307, 0.022432045063221103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 146.60000000000002, 127, 390, 129.0, 235.2000000000001, 390.0, 390.0, 0.0891006183582914, 0.06621637751040993, 0.044724333824376745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 145.13333333333333, 127, 380, 128.0, 231.80000000000007, 380.0, 380.0, 0.08910114762278137, 0.02401554369520279, 0.05246874220364958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3209b2d2-a15c-42d2-88a9-3d4f718d4729", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 194.46666666666667, 124, 383, 127.0, 382.4, 383.0, 383.0, 0.08910326474362021, 0.024016114325428883, 0.05238297399966735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 284.8333333333333, 127, 1255, 128.5, 992.800000000001, 1255.0, 1255.0, 0.060035420898330014, 4.516497741479973, 0.034864319948769776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 201.24999999999997, 126, 756, 128.0, 642.9000000000003, 756.0, 756.0, 0.060035420898330014, 1.4858668958435477, 0.0349229482894908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 190.625, 127, 381, 128.0, 381.0, 381.0, 381.0, 0.038157926116715556, 0.01021022632419928, 0.02176194223843934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 150.66666666666666, 128, 384, 129.5, 309.0000000000002, 384.0, 384.0, 0.06003482019571351, 0.0446157208681035, 0.030134665606051513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 225.375, 128, 387, 134.5, 387.0, 387.0, 387.0, 0.038200927327510875, 0.028389556343980247, 0.01917507484994198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 191.66666666666666, 126, 383, 129.0, 382.4, 383.0, 383.0, 0.06003482019571351, 0.02357812843949491, 0.033818442821836665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 135.5, 131, 147, 133.5, 147.0, 147.0, 147.0, 0.03963378383734295, 0.03119612282509611, 0.0140885715984305], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 554.9285714285714, 126, 1466, 505.0, 1122.0, 1466.0, 1466.0, 0.09638487858947614, 0.019208398307068452, 0.06558555319756834], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1633.0869565217395, 895, 2732, 1438.0, 2459.8, 2696.9999999999995, 2732.0, 0.1009515783559816, 0.05225032864127954, 0.046433782622722006], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 219.9375, 126, 398, 227.0, 362.3, 398.0, 398.0, 0.08988410568123725, 0.1360605288696512, 0.058081239431595384], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 450.125, 257, 769, 266.0, 769.0, 769.0, 769.0, 0.038131372109761155, 0.059096179236514605, 0.08575834957888666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 134.0625, 127, 182, 130.5, 150.50000000000003, 182.0, 182.0, 0.11982415804806446, 0.08904900808064166, 0.06014611058271986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 176.0, 126, 382, 129.0, 381.3, 382.0, 382.0, 0.11982774761280658, 0.043311762778505895, 0.0677102836547463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 914.6363636363636, 752, 1014, 1003.0, 1013.0, 1014.0, 1014.0, 0.08200326522092426, 24.11168273961727, 0.04676748719630836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 1319.2727272727273, 1019, 1518, 1379.0, 1516.4, 1518.0, 1518.0, 0.08177283506419168, 73.5793407320713, 0.046556213713304435], "isController": false}, {"data": ["addBook", 57, 19, 33.333333333333336, 1214.6315789473688, 645, 3401, 1003.0, 2159.8, 2222.199999999998, 3401.0, 0.2701805943973076, 69.14211088217519, 0.9834271830710528], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 243.72727272727275, 126, 386, 130.0, 385.6, 386.0, 386.0, 0.08254478054344482, 0.14606556869601758, 0.04570594782044259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=944693ff-b92d-4ea9-8ac4-25dd8af8b4ca", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a29ef95d-4b6f-4c11-9409-36141898bd46", 3, 0, 0.0, 339.6666666666667, 214, 497, 308.0, 497.0, 497.0, 497.0, 0.10812369350537016, 0.04892315558999496, 0.06933713418150364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 192.33333333333334, 127, 382, 129.0, 382.0, 382.0, 382.0, 0.0715388605051836, 0.05316511019965303, 0.035909154589515976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 210.5, 126, 379, 127.0, 379.0, 379.0, 379.0, 0.0715397134834475, 0.0191424623969381, 0.04079999284602865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 243.58333333333334, 127, 511, 129.0, 472.0000000000001, 511.0, 511.0, 0.07143197295109291, 0.01925314895947426, 0.041994187223201106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e41a081-288b-490c-8191-082f22571c14", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 233.10909090909095, 128, 522, 130.0, 514.8, 517.2, 522.0, 0.24768861488023128, 0.18407327726939066, 0.11973228941964306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 211.83333333333331, 126, 383, 128.0, 382.1, 383.0, 383.0, 0.07143197295109291, 0.01925314895947426, 0.04206394500928616], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 811.9818181818183, 627, 1147, 759.0, 1018.6, 1136.2, 1147.0, 0.2474545920823529, 72.75986633796448, 0.12445226066641771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 151.0, 126, 382, 128.0, 332.00000000000017, 382.0, 382.0, 0.08254354171825638, 0.06134339379647764, 0.04635013328905998], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 202.49090909090904, 127, 540, 132.0, 385.0, 386.2, 540.0, 0.2481535122745751, 0.4391153947671192, 0.12068403233665859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 810.1052631578946, 127, 1756, 1134.0, 1512.0, 1756.0, 1756.0, 0.09186243841590477, 43.515930200864474, 0.049850104070472995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 245.81249999999997, 127, 1240, 129.0, 642.2000000000006, 1240.0, 1240.0, 0.11982505541908813, 6.768952778162633, 0.0698004351147325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/944693ff-b92d-4ea9-8ac4-25dd8af8b4ca", 3, 0, 0.0, 502.66666666666663, 248, 778, 482.0, 778.0, 778.0, 778.0, 0.03663048388869217, 0.023979135123749985, 0.02349025171247512], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1241.1454545454544, 870, 2031, 1252.0, 1567.8, 1798.9999999999995, 2031.0, 0.24732439967622988, 222.54292957859295, 0.12414525530623258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 553.2105263157894, 127, 1146, 747.0, 1135.0, 1146.0, 1146.0, 0.09186377086274586, 14.228043652213433, 0.04994053785029106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 144.57142857142856, 129, 387, 131.0, 140.8, 362.39999999999964, 387.0, 0.10325905237692505, 0.07714177252768326, 0.036705366274610074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 199.5, 126, 1008, 129.0, 571.2000000000005, 1008.0, 1008.0, 0.11982505541908813, 2.23231211337697, 0.0699174517704152], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 433.35714285714283, 129, 1052, 466.5, 839.0, 1052.0, 1052.0, 0.09417589366196236, 0.019319984881405645, 0.06349121179149457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 19, 11.242603550295858, 196.04733727810648, 127, 1473, 134.0, 382.0, 474.0, 920.000000000009, 0.6980961389913544, 1.5357622918103824, 0.33323505599226727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 133.66666666666666, 130, 142, 132.0, 142.0, 142.0, 142.0, 0.052932769501314494, 0.04099188106888906, 0.01881594540867039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69e9be29-0245-4096-8d66-bae9e4986f00", 3, 0, 0.0, 492.6666666666667, 398, 554, 526.0, 554.0, 554.0, 554.0, 0.025832673165019113, 0.025908354824682258, 0.01656587439293218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec88f947-7bbd-4a38-af4f-01263ccefc43", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 478.83333333333326, 255, 894, 507.5, 854.4000000000001, 894.0, 894.0, 0.0713767383209812, 0.11062000362831752, 0.16052795737619108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50241f74-8ab2-46ad-901e-f31b7ea27f9f", 3, 0, 0.0, 488.3333333333333, 246, 650, 569.0, 650.0, 650.0, 650.0, 0.03821412648875868, 0.031857544901598624, 0.024505803770460483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 148.93333333333334, 127, 385, 131.0, 238.00000000000009, 385.0, 385.0, 0.08861163293517173, 0.07191041696203879, 0.031498666394924324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69e9be29-0245-4096-8d66-bae9e4986f00", 1, 0, 0.0, 1052.0, 1052, 1052, 1052.0, 1052.0, 1052.0, 1052.0, 0.9505703422053232, 0.17173389971482889, 0.6553736929657794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 635.9565217391305, 173, 1314, 568.0, 1170.2000000000003, 1295.7999999999997, 1314.0, 0.10101010101010101, 0.06204624368686869, 0.045671559343434344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 129.8947368421053, 126, 140, 129.0, 138.0, 140.0, 140.0, 0.09186599169338033, 0.06827150359244377, 0.046112421611716296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 236.42105263157896, 125, 407, 129.0, 387.0, 407.0, 407.0, 0.09186821263139572, 0.09720389726716243, 0.04833280347938767], "isController": false}, {"data": ["login", 23, 0, 0.0, 3316.0434782608695, 1967, 4888, 3504.0, 4405.400000000001, 4806.199999999999, 4888.0, 0.10056227428141697, 57.66891609854447, 0.23147854006532176], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 258.77777777777777, 256, 267, 258.0, 267.0, 267.0, 267.0, 0.05205772623420193, 0.08067930813835787, 0.11707904640367875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 147.56249999999997, 128, 379, 131.0, 210.30000000000018, 379.0, 379.0, 0.11860110002520273, 0.09601592961024713, 0.04215898477458378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50241f74-8ab2-46ad-901e-f31b7ea27f9f", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 458.0833333333333, 257, 1385, 264.0, 1199.0000000000007, 1385.0, 1385.0, 0.05999550033747469, 6.0665225498712605, 0.13365208546858987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a29ef95d-4b6f-4c11-9409-36141898bd46", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a5420c9-c77f-4186-bb81-8dc282141474", 3, 0, 0.0, 796.3333333333334, 232, 1535, 622.0, 1535.0, 1535.0, 1535.0, 0.04575332855465235, 0.038142667457182505, 0.02934051342860193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 132.66666666666666, 129, 159, 130.0, 151.50000000000003, 159.0, 159.0, 0.07464264832116244, 0.06188633635221378, 0.026533128895413212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 941.9473684210525, 254, 1883, 1275.0, 1644.0, 1883.0, 1883.0, 0.09180384899716373, 57.872299902337616, 0.19410644203311703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44eb73c1-cb13-4ec6-972d-8b47d2373474", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 159.6315789473684, 128, 390, 132.0, 387.0, 390.0, 390.0, 0.0911131145339804, 0.07073723247511172, 0.03238786493200084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=307cfcda-d079-4868-8857-74cb0431bc10", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 376.8, 255, 773, 259.0, 618.2, 773.0, 773.0, 0.08903239592112917, 0.13798282453792185, 0.2002359451233989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 8, 42.10526315789474, 918.7894736842105, 126, 1767, 1264.0, 1646.0, 1767.0, 1767.0, 0.13247341816280286, 91.76897224158968, 0.20965879379466618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 153.61904761904762, 127, 388, 129.0, 330.8000000000002, 387.2, 388.0, 0.10920777559362227, 0.08115929416674467, 0.054817184233517426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 189.0, 127, 385, 129.0, 381.6, 384.7, 385.0, 0.10906767909172592, 0.029184125069465723, 0.06220266073199994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 212.95238095238093, 125, 385, 130.0, 381.0, 384.6, 385.0, 0.10921175118442744, 0.029435979811427707, 0.06420456466115754], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 1179.9583333333335, 183, 2176, 1170.5, 2011.0, 2135.5, 2176.0, 0.09983651770226254, 0.030760177085023273, 0.045043428885200486], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 182.1904761904762, 126, 508, 128.0, 381.6, 495.3999999999998, 508.0, 0.10906767909172592, 0.02939714788019175, 0.0642263774338972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/307cfcda-d079-4868-8857-74cb0431bc10", 3, 0, 0.0, 346.3333333333333, 224, 502, 313.0, 502.0, 502.0, 502.0, 0.07809652730775239, 0.035336644843025976, 0.05008143189982819], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 24.444444444444443, 0.8384146341463414], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.11111111111111, 0.38109756097560976], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.666666666666667, 0.22865853658536586], "isController": false}, {"data": ["401/Unauthorized", 26, 57.77777777777778, 1.9817073170731707], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 45, "401/Unauthorized", 26, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
