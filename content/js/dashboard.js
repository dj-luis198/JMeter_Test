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

    var data = {"OkPercent": 99.60567823343848, "KoPercent": 0.3943217665615142};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8361658735554045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49107142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85bc2c1c-668c-4c3b-97de-c0e8b7b1c9cd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eedaca1d-a54b-421e-981e-c0b82294c630"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b89bfb1c-a8a7-4005-9bb8-d8f2483cf33b"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc2e1e5d-63cb-407a-bf8c-cc82d3f8063e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e25cbb77-8f40-4ca4-97ee-5769f1b5c135"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26de725b-5989-4148-837d-4dd1d4cadd94"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ac7cda7-dd53-4f5d-92ab-626fcfe4399f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/980d4e64-3604-4ce3-9eb4-34c6c60bb418"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a2d08db-eba0-4e9f-9999-81e71669170d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc2e1e5d-63cb-407a-bf8c-cc82d3f8063e"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7a53fe34-245b-4434-ad96-8d10e0b7f94a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6183d2dd-7570-4899-93a7-ca2d47d12a2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db78c4e3-00ca-4624-8d93-a62cf6d98d66"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1469cb9-1a17-4c8c-b0b5-2138518ba6b5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/94babc11-552c-4084-9f8d-51436673ed35"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b89bfb1c-a8a7-4005-9bb8-d8f2483cf33b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5efc7067-2b67-4359-823a-1aaf21064d53"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c44785f-6c72-4142-9203-d717b557b638"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23fc02c0-b6f7-49c3-92f3-85b00a4b92dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eedaca1d-a54b-421e-981e-c0b82294c630"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e25cbb77-8f40-4ca4-97ee-5769f1b5c135"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1ac7cda7-dd53-4f5d-92ab-626fcfe4399f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4943a70a-7b06-40b4-8ea6-4e1f535b3f4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8392857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9647058823529412, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26de725b-5989-4148-837d-4dd1d4cadd94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23fc02c0-b6f7-49c3-92f3-85b00a4b92dc"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c44785f-6c72-4142-9203-d717b557b638"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a2d08db-eba0-4e9f-9999-81e71669170d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6183d2dd-7570-4899-93a7-ca2d47d12a2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85bc2c1c-668c-4c3b-97de-c0e8b7b1c9cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1469cb9-1a17-4c8c-b0b5-2138518ba6b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/713dc5d5-ac4e-4a92-92ff-8a2de26e75e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 5, 0.3943217665615142, 287.15694006309127, 80, 2856, 100.0, 727.0, 904.3999999999996, 1448.5399999999981, 5.1298233690155435, 719.667442979768, 3.7398864690288938], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1207.9642857142853, 991, 1566, 1171.0, 1419.0, 1428.45, 1566.0, 0.2540408370645581, 305.6977402769839, 1.2491168111523927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85bc2c1c-668c-4c3b-97de-c0e8b7b1c9cd", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 586.3333333333334, 391, 1144, 436.0, 1125.7, 1144.0, 1144.0, 0.08607765639234195, 0.015551139094319592, 0.05850590707916993], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 586.3333333333334, 391, 1144, 436.0, 1125.7, 1144.0, 1144.0, 0.08415324305560426, 0.015203466762975378, 0.05719790738935601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eedaca1d-a54b-421e-981e-c0b82294c630", 3, 0, 0.0, 568.3333333333333, 202, 1204, 299.0, 1204.0, 1204.0, 1204.0, 0.02585515939705768, 0.025930906934353747, 0.01658029427480587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 125.14999999999999, 82, 247, 84.0, 246.9, 247.0, 247.0, 0.1032689795475786, 0.035387778245356764, 0.05846194086301886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 84.65, 83, 90, 84.0, 87.9, 89.9, 90.0, 0.1032657803020524, 0.07674341680650575, 0.051834581128178646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 145.65, 82, 654, 84.0, 252.3, 633.9499999999997, 654.0, 0.10326844632622502, 1.5446599725047763, 0.06036766794031084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 124.10000000000002, 81, 567, 84.0, 245.70000000000002, 550.9499999999998, 567.0, 0.10326951277443873, 4.672547098965755, 0.0602674422207076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b89bfb1c-a8a7-4005-9bb8-d8f2483cf33b", 3, 0, 0.0, 938.0, 406, 1438, 970.0, 1438.0, 1438.0, 1438.0, 0.022214488289262254, 0.022279569797922207, 0.014245619117788622], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 335.75, 165, 1438, 192.5, 1218.7000000000007, 1438.0, 1438.0, 0.08634770782813928, 0.2092990297575788, 0.055822443927957224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc2e1e5d-63cb-407a-bf8c-cc82d3f8063e", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 83.86666666666667, 82, 87, 84.0, 85.8, 87.0, 87.0, 0.10022115468133014, 0.07448076046141819, 0.05030632178340204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 105.0, 81, 247, 83.0, 246.4, 247.0, 247.0, 0.10022182430446053, 0.026817167831466978, 0.05715775917363765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 491.0, 407, 575, 491.0, 575.0, 575.0, 575.0, 0.271665308340125, 79.87862078918772, 0.1549341211627275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 648.0, 567, 729, 648.0, 729.0, 729.0, 729.0, 0.2719608376393799, 244.71083976407397, 0.15483707846070166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 166.0, 84, 248, 166.0, 248.0, 248.0, 248.0, 0.2842524161455372, 0.5029935332575327, 0.15739367183058556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 85.13333333333333, 83, 90, 85.0, 88.2, 90.0, 90.0, 0.07359795888327364, 0.0546953581154016, 0.03694272545508071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 95.26666666666667, 82, 243, 84.0, 155.40000000000003, 243.0, 243.0, 0.07359940335417015, 0.027063113941689646, 0.04156257973268696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 138.0, 80, 726, 84.0, 436.8000000000002, 726.0, 726.0, 0.07359904223113042, 4.433484597253774, 0.042846525757211484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 126.86666666666666, 81, 567, 84.0, 372.0000000000001, 567.0, 567.0, 0.07359976448075366, 1.4612332407202964, 0.042918820993106156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 164.5, 83, 246, 164.5, 246.0, 246.0, 246.0, 0.29107844564110025, 0.21631904016882547, 0.1634473693785475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 450.7647058823529, 81, 823, 565.0, 754.1999999999999, 823.0, 823.0, 0.0840277983728264, 44.48483197838509, 0.0451514261247368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 94.73333333333335, 82, 249, 83.0, 155.40000000000006, 249.0, 249.0, 0.10022048506714773, 0.02701255261575466, 0.05891868360392865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 350.35294117647055, 82, 727, 404.0, 611.8, 727.0, 727.0, 0.0840277983728264, 14.542833170220549, 0.04523348452158526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 83.2, 82, 85, 83.0, 84.4, 85.0, 85.0, 0.10022048506714773, 0.02701255261575466, 0.059016555171377036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e25cbb77-8f40-4ca4-97ee-5769f1b5c135", 3, 0, 0.0, 440.3333333333333, 174, 764, 383.0, 764.0, 764.0, 764.0, 0.04514400938995395, 0.029317154535468147, 0.028949771646552505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26de725b-5989-4148-837d-4dd1d4cadd94", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 615.0833333333334, 341, 1420, 434.5, 1399.0, 1420.0, 1420.0, 0.08415560371126213, 0.015203893248616693, 0.05802134396499127], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 246.06666666666672, 169, 811, 173.0, 522.4000000000002, 811.0, 811.0, 0.07356727727506805, 5.9738832334044485, 0.1641996723190858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ac7cda7-dd53-4f5d-92ab-626fcfe4399f", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 453.0952380952381, 128, 1183, 386.0, 782.6, 1143.2999999999995, 1183.0, 0.0952432785457712, 0.058503927934853595, 0.04306409957684772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 94.29411764705883, 82, 258, 84.0, 122.79999999999988, 258.0, 258.0, 0.08402738304129699, 0.06244613134221388, 0.042177807503151026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/980d4e64-3604-4ce3-9eb4-34c6c60bb418", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 152.8235294117647, 81, 256, 86.0, 252.0, 256.0, 256.0, 0.08402862904820277, 0.09672367123551741, 0.04377134697892364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a2d08db-eba0-4e9f-9999-81e71669170d", 1, 0, 0.0, 1350.0, 1350, 1350, 1350.0, 1350.0, 1350.0, 1350.0, 0.7407407407407407, 0.13382523148148148, 0.5107060185185185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc2e1e5d-63cb-407a-bf8c-cc82d3f8063e", 3, 0, 0.0, 323.3333333333333, 215, 504, 251.0, 504.0, 504.0, 504.0, 0.019425019425019424, 0.02295971534252784, 0.012456799566174567], "isController": false}, {"data": ["login", 21, 0, 0.0, 2439.523809523809, 1374, 4510, 2183.0, 4315.0, 4502.8, 4510.0, 0.09179565413146012, 10.58942098798351, 0.15299702565688533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a53fe34-245b-4434-ad96-8d10e0b7f94a", 1, 0, 0.0, 979.0, 979, 979, 979.0, 979.0, 979.0, 979.0, 1.021450459652707, 0.32618584014300306, 0.6094787410623085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 98.13333333333334, 83, 249, 87.0, 156.00000000000006, 249.0, 249.0, 0.0999480270259465, 0.08091495547315396, 0.03552840023187942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6183d2dd-7570-4899-93a7-ca2d47d12a2e", 3, 0, 0.0, 670.3333333333334, 227, 1424, 360.0, 1424.0, 1424.0, 1424.0, 0.026414961434156305, 0.026492349016482935, 0.01693928190927341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db78c4e3-00ca-4624-8d93-a62cf6d98d66", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 556.4705882352943, 166, 908, 660.0, 840.8, 908.0, 908.0, 0.08399250984441622, 59.1619780498545, 0.17625978728896882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 264.1499999999999, 166, 738, 181.5, 337.9, 717.9999999999998, 738.0, 0.10322047894302229, 6.326351906030657, 0.23082478001135426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 817.0, 813, 821, 817.0, 821.0, 821.0, 821.0, 0.2686005909213, 321.3396874160623, 0.605662855895783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1469cb9-1a17-4c8c-b0b5-2138518ba6b5", 3, 0, 0.0, 301.3333333333333, 170, 476, 258.0, 476.0, 476.0, 476.0, 0.02399500903812007, 0.02406530691616144, 0.01538742441572153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94babc11-552c-4084-9f8d-51436673ed35", 1, 0, 0.0, 2608.0, 2608, 2608, 2608.0, 2608.0, 2608.0, 2608.0, 0.3834355828220859, 0.1224447613113497, 0.22878822373466257], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1015.6190476190476, 428, 2216, 911.0, 1747.0000000000002, 2175.0999999999995, 2216.0, 0.09385810442384533, 0.03011630024760662, 0.04234613695685209], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 105.12500000000001, 85, 340, 88.0, 171.30000000000018, 340.0, 340.0, 0.08993007936329504, 0.06981876278693316, 0.031967332898671284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 201.86666666666667, 167, 335, 169.0, 333.8, 335.0, 335.0, 0.10016426940181898, 0.1552350542389519, 0.22527178948475501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 260.8666666666666, 168, 373, 329.0, 358.0, 373.0, 373.0, 0.08426634907615993, 0.13059638279674393, 0.18951699406484016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 118.00000000000001, 83, 251, 85.5, 250.6, 251.0, 251.0, 0.058609432602082984, 0.04355642403338393, 0.02941918784909243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 100.4, 82, 247, 84.0, 231.30000000000007, 247.0, 247.0, 0.05861183724665033, 0.015683245513263857, 0.033427063429730265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 116.3, 83, 247, 84.0, 246.7, 247.0, 247.0, 0.05861218078341041, 0.015797814351778586, 0.03445755159337213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 100.60000000000001, 82, 244, 84.0, 229.10000000000005, 244.0, 244.0, 0.05861252432419759, 0.015797906946756382, 0.034514992351065574], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 791.1785714285713, 645, 1157, 668.5, 1067.0, 1073.15, 1157.0, 0.2594322140686383, 310.3711212567638, 0.5122772820769402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1015.6190476190476, 428, 2216, 911.0, 1747.0000000000002, 2175.0999999999995, 2216.0, 0.0918619096778709, 0.029475780170075763, 0.04144551003044566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 148.0, 83, 246, 84.0, 246.0, 246.0, 246.0, 0.027573884222774927, 0.007432023481919805, 0.016237355650716094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 115.6, 83, 244, 83.0, 244.0, 244.0, 244.0, 0.027573884222774927, 0.007432023481919805, 0.01621042802940479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b89bfb1c-a8a7-4005-9bb8-d8f2483cf33b", 1, 0, 0.0, 1420.0, 1420, 1420, 1420.0, 1420.0, 1420.0, 1420.0, 0.7042253521126761, 0.12722821302816903, 0.4855303697183099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5efc7067-2b67-4359-823a-1aaf21064d53", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.45167742220650636, 0.8439599540311175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 246.125, 81, 739, 85.0, 730.6, 739.0, 739.0, 0.08558163418130468, 19.268926411829522, 0.04847397248550461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 205.1875, 81, 576, 84.0, 572.5, 576.0, 576.0, 0.08557751450806302, 6.307957037413419, 0.04855521086834434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 148.4, 81, 247, 86.0, 247.0, 247.0, 247.0, 0.027549423666056904, 0.007371623129394133, 0.01571178068454808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 94.375, 82, 247, 83.5, 135.7000000000001, 247.0, 247.0, 0.08580146613255253, 0.0637645661395239, 0.04306831405481641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 149.8, 83, 250, 84.0, 250.0, 250.0, 250.0, 0.027573732159795295, 0.02049180681016037, 0.013840721025522248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 134.75000000000003, 81, 252, 84.0, 250.6, 252.0, 252.0, 0.08572607304933, 0.055127557717757625, 0.047090738369382934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 120.4, 84, 247, 90.0, 247.0, 247.0, 247.0, 0.027246174637080952, 0.02144571948973364, 0.009685163640524871], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 617.75, 360, 1204, 490.0, 1175.8000000000002, 1204.0, 1204.0, 0.08780659134812387, 0.01586349550722941, 0.05976679118129135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c44785f-6c72-4142-9203-d717b557b638", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1293.8095238095236, 723, 2856, 1187.0, 2009.6000000000004, 2780.099999999999, 2856.0, 0.09405568096313018, 0.04868116299849511, 0.04326193919300226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 331.4, 168, 498, 329.0, 498.0, 498.0, 498.0, 0.027536527203335222, 0.0426762389372002, 0.06193029506765725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23fc02c0-b6f7-49c3-92f3-85b00a4b92dc", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eedaca1d-a54b-421e-981e-c0b82294c630", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["addBook", 57, 3, 5.2631578947368425, 908.0350877192984, 428, 2467, 749.0, 1317.0000000000002, 1975.2999999999997, 2467.0, 0.27874905249773824, 94.66135485946401, 1.0128675009780668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e25cbb77-8f40-4ca4-97ee-5769f1b5c135", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ac7cda7-dd53-4f5d-92ab-626fcfe4399f", 3, 0, 0.0, 1006.0, 193, 2024, 801.0, 2024.0, 2024.0, 2024.0, 0.023353936695262263, 0.023422356431674167, 0.0149763200812717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4943a70a-7b06-40b4-8ea6-4e1f535b3f4c", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.5946665502793296, 1.1111353584729982], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 156.42857142857142, 82, 425, 85.5, 336.3, 347.45, 425.0, 0.26012030564135913, 0.19331206307917412, 0.12574174930905543], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 471.3035714285715, 401, 687, 412.5, 608.1000000000004, 665.0, 687.0, 0.26008164705991627, 76.47263975905292, 0.130802781480329], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 137.67857142857147, 82, 338, 86.0, 250.60000000000002, 253.15, 338.0, 0.2604711737482267, 0.46091188167166675, 0.1266744575455243], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 627.4107142857142, 559, 821, 575.0, 738.3, 757.3, 821.0, 0.2598933509070742, 233.85249398996623, 0.13045427965452747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 91.39999999999999, 84, 110, 90.0, 104.0, 110.0, 110.0, 0.08358408559010364, 0.062443188941825475, 0.029711530424607155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, 1.7647058823529411, 165.08235294117645, 83, 1472, 93.0, 281.9, 424.74999999999983, 1095.6999999999957, 0.7418106288372337, 1.602490786002906, 0.35639978029314606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 119.1, 85, 248, 88.0, 247.7, 248.0, 248.0, 0.05628950819856687, 0.043591386720179225, 0.020009161117459318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26de725b-5989-4148-837d-4dd1d4cadd94", 3, 0, 0.0, 547.6666666666666, 173, 763, 707.0, 763.0, 763.0, 763.0, 0.02308473637231063, 0.02728537687755856, 0.014803688363753887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 114.0, 84, 259, 90.5, 246.9, 258.4, 259.0, 0.1021706147095034, 0.08291384846054427, 0.03631846069751878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 236.0, 168, 498, 170.0, 497.4, 498.0, 498.0, 0.05858059224978764, 0.09078847646524706, 0.13174912495240326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23fc02c0-b6f7-49c3-92f3-85b00a4b92dc", 3, 0, 0.0, 315.3333333333333, 179, 396, 371.0, 396.0, 396.0, 396.0, 0.047505938242280284, 0.03054174089469517, 0.030464420031670627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 362.8125, 165, 822, 251.5, 818.5, 822.0, 822.0, 0.08553725414722031, 25.682497908346832, 0.18690391226016156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c44785f-6c72-4142-9203-d717b557b638", 3, 0, 0.0, 324.6666666666667, 165, 432, 377.0, 432.0, 432.0, 432.0, 0.022691001505169766, 0.02681999559416387, 0.014551195626687642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a2d08db-eba0-4e9f-9999-81e71669170d", 3, 0, 0.0, 372.3333333333333, 167, 578, 372.0, 578.0, 578.0, 578.0, 0.07199942400460797, 0.03342160762713898, 0.046171505627954974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6183d2dd-7570-4899-93a7-ca2d47d12a2e", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 112.93333333333334, 83, 247, 89.0, 245.8, 247.0, 247.0, 0.07143503459836842, 0.05922689880274882, 0.025392922454888778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85bc2c1c-668c-4c3b-97de-c0e8b7b1c9cd", 3, 0, 0.0, 494.0, 180, 1110, 192.0, 1110.0, 1110.0, 1110.0, 0.020232812226014002, 0.02789256503163063, 0.012974817736083197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 90.88235294117646, 85, 122, 88.0, 104.39999999999998, 122.0, 122.0, 0.08067654400668192, 0.06263462156768762, 0.028677990252375215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1469cb9-1a17-4c8c-b0b5-2138518ba6b5", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 85.86666666666666, 83, 100, 84.0, 97.0, 100.0, 100.0, 0.0843094494030891, 0.06265575292553789, 0.04231939159490996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 137.46666666666664, 80, 248, 84.0, 248.0, 248.0, 248.0, 0.08431229273228037, 0.022560125203754708, 0.048084354448878645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/713dc5d5-ac4e-4a92-92ff-8a2de26e75e2", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 129.06666666666666, 82, 271, 85.0, 256.6, 271.0, 271.0, 0.08430755395683454, 0.02272352040242806, 0.04956362058790468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 162.0, 82, 286, 90.0, 263.2, 286.0, 286.0, 0.08430755395683454, 0.02272352040242806, 0.04964595218356565], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 40.0, 0.15772870662460567], "isController": false}, {"data": ["401/Unauthorized", 3, 60.0, 0.23659305993690852], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 5, "401/Unauthorized", 3, "406/Not Acceptable", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
