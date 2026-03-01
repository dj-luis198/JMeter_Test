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

    var data = {"OkPercent": 97.4471188913202, "KoPercent": 2.5528811086797956};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7930927193528313, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81903c95-e6b8-41a5-a0da-8c37da5a962d"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6448b399-f00b-46e6-b482-54ec6473793e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1474dd03-404d-4823-bd9d-b889f585ebb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7eeb15fc-67df-4938-9855-056a424c2173"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6716d79-54e9-4876-aad2-78f7dca17f48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98b86ebc-22ed-42ab-b0af-25df9fe3b47d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15b1ec48-86da-47ef-91b2-0a8f8ef068cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6641389a-eb1e-46d1-8e9c-29af59e544e6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49c24ca5-1ce0-4a06-90e7-607807d419ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36988644-f59e-429f-bc4b-b7bbb4af68bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e791d33b-141f-46cc-a17a-8c0c79b9f179"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a48106eb-ea38-470e-a17f-72e3ae3f913c"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1474dd03-404d-4823-bd9d-b889f585ebb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eecc0734-81fd-4b8d-a18d-e5f0fc77f004"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81903c95-e6b8-41a5-a0da-8c37da5a962d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eeb15fc-67df-4938-9855-056a424c2173"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=249bce40-e00d-48be-bb32-83c78e8acaaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6448b399-f00b-46e6-b482-54ec6473793e"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98b86ebc-22ed-42ab-b0af-25df9fe3b47d"], "isController": false}, {"data": [0.3492063492063492, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6716d79-54e9-4876-aad2-78f7dca17f48"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9175824175824175, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e791d33b-141f-46cc-a17a-8c0c79b9f179"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6641389a-eb1e-46d1-8e9c-29af59e544e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/249bce40-e00d-48be-bb32-83c78e8acaaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eca36e80-9bd3-4d52-93c1-0569f698bd8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/49c24ca5-1ce0-4a06-90e7-607807d419ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a48106eb-ea38-470e-a17f-72e3ae3f913c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15b1ec48-86da-47ef-91b2-0a8f8ef068cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36988644-f59e-429f-bc4b-b7bbb4af68bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eecc0734-81fd-4b8d-a18d-e5f0fc77f004"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1371, 35, 2.5528811086797956, 327.0072939460251, 96, 2798, 120.0, 799.0, 989.0, 1674.5999999999988, 5.514705882352941, 763.9035791914379, 4.030461138871235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/81903c95-e6b8-41a5-a0da-8c37da5a962d", 3, 0, 0.0, 377.6666666666667, 299, 441, 393.0, 441.0, 441.0, 441.0, 0.019801980198019802, 0.027298628300330034, 0.012698535478547854], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1482.1428571428573, 1191, 2302, 1452.0, 1729.0, 1750.7499999999998, 2302.0, 0.25029722795820036, 301.19172802580295, 1.2307095144233777], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6448b399-f00b-46e6-b482-54ec6473793e", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1474dd03-404d-4823-bd9d-b889f585ebb5", 3, 0, 0.0, 615.6666666666667, 214, 1331, 302.0, 1331.0, 1331.0, 1331.0, 0.039572093759480814, 0.025441043351228713, 0.025376635646542058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eeb15fc-67df-4938-9855-056a424c2173", 3, 0, 0.0, 309.3333333333333, 211, 435, 282.0, 435.0, 435.0, 435.0, 0.09096697898662785, 0.041160189059704665, 0.05833494420691956], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 509.70588235294116, 103, 2065, 409.0, 984.9999999999991, 2065.0, 2065.0, 0.1010923925001338, 0.020302102721764, 0.06785757159720034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 509.70588235294116, 103, 2065, 409.0, 984.9999999999991, 2065.0, 2065.0, 0.10175131977447119, 0.020434433245148854, 0.06829987198786167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 157.22222222222223, 99, 299, 105.5, 298.1, 299.0, 299.0, 0.11386495616199187, 0.03996887295833808, 0.06440733685682115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 102.0, 100, 110, 101.0, 108.2, 110.0, 110.0, 0.11386351559930163, 0.08461927282330912, 0.057154147478555704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 157.77777777777777, 97, 697, 102.5, 345.10000000000053, 697.0, 697.0, 0.1138620750730615, 1.8889416796870055, 0.06650602757359918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 167.05555555555554, 98, 881, 102.0, 357.20000000000084, 881.0, 881.0, 0.11386351559930163, 5.720906537426305, 0.06639567413526985], "isController": false}, {"data": ["goToProfile", 18, 4, 22.22222222222222, 221.83333333333331, 99, 332, 221.0, 315.8, 332.0, 332.0, 0.1077121930202499, 0.19142990554239073, 0.06961087474268754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6716d79-54e9-4876-aad2-78f7dca17f48", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 123.15000000000002, 98, 299, 102.0, 281.4000000000003, 298.95, 299.0, 0.10349502706394957, 0.07691378476139221, 0.05194965225670906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 672.5, 546, 798, 685.0, 798.0, 798.0, 798.0, 0.03942440370589395, 11.592083702937119, 0.022484230238517644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 130.85, 96, 301, 101.0, 298.5, 300.9, 301.0, 0.10349663377198656, 0.03546578983456063, 0.058590818942988884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 781.375, 686, 998, 701.0, 998.0, 998.0, 998.0, 0.03942420942140045, 35.47397293774425, 0.022445619231129355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98b86ebc-22ed-42ab-b0af-25df9fe3b47d", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 229.125, 100, 306, 298.0, 306.0, 306.0, 306.0, 0.03949934579208532, 0.06989532673365098, 0.021871219789172242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 119.75, 100, 301, 102.0, 245.2000000000002, 301.0, 301.0, 0.061311765216813724, 0.045564700517573484, 0.030775632149845952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 152.16666666666669, 98, 301, 103.5, 299.8, 301.0, 301.0, 0.061251990689697416, 0.024056161057005185, 0.034504091760586386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 217.83333333333331, 99, 888, 107.0, 711.3000000000006, 888.0, 888.0, 0.061252303341823584, 4.608044477147787, 0.03557099907611109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 168.25, 99, 490, 104.0, 432.7000000000002, 490.0, 490.0, 0.0613127050143574, 1.5174794698239304, 0.035665951777557506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 103.375, 100, 109, 102.5, 109.0, 109.0, 109.0, 0.03953760767820341, 0.02938292914366484, 0.022201293373991172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 150.00000000000003, 98, 883, 101.0, 273.60000000000036, 853.4499999999996, 883.0, 0.103498240529911, 4.682896147601428, 0.06040092630925274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 434.05, 97, 896, 300.0, 887.3000000000001, 895.6, 896.0, 0.10101418239120771, 40.916707059186734, 0.05547888298517112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 150.0, 99, 488, 101.0, 303.3, 478.79999999999984, 488.0, 0.10349609819709797, 1.54806512427294, 0.06050074646560825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 356.70000000000005, 99, 701, 299.0, 696.9, 700.8, 701.0, 0.1011173466808231, 13.394325657894738, 0.055634290156226306], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 415.0588235294118, 112, 856, 425.0, 701.5999999999999, 856.0, 856.0, 0.10249299128809573, 0.020583381062912607, 0.06937470797033732], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 371.8333333333333, 202, 988, 311.5, 872.5000000000005, 988.0, 988.0, 0.06121886765501127, 6.19022491716322, 0.1363773830719628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 503.4782608695652, 150, 1230, 442.0, 1079.6000000000004, 1216.7999999999997, 1230.0, 0.11310826427991835, 0.06947763499225454, 0.051141724962502154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 113.09999999999998, 99, 300, 101.0, 126.40000000000003, 291.39999999999986, 300.0, 0.1011173466808231, 0.07514677814854138, 0.050756168158147534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 186.85, 97, 399, 107.0, 311.40000000000003, 394.6499999999999, 399.0, 0.1011173466808231, 0.0953998717073664, 0.05384696205571566], "isController": false}, {"data": ["login", 23, 0, 0.0, 2592.0, 1740, 3518, 2664.0, 3294.6, 3474.9999999999995, 3518.0, 0.1085924995632693, 45.33313589466056, 0.2264756702635965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 108.0, 100, 137, 106.5, 116.30000000000001, 136.0, 137.0, 0.10662174337212588, 0.08631779810106675, 0.03790069783931037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15b1ec48-86da-47ef-91b2-0a8f8ef068cf", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6641389a-eb1e-46d1-8e9c-29af59e544e6", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 560.25, 200, 999, 507.5, 988.4, 998.5, 999.0, 0.10096267914565381, 54.439968892452036, 0.21544292011832827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49c24ca5-1ce0-4a06-90e7-607807d419ae", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36988644-f59e-429f-bc4b-b7bbb4af68bb", 3, 0, 0.0, 335.0, 180, 419, 406.0, 419.0, 419.0, 419.0, 0.04072379762987498, 0.03394975446943679, 0.026115195745720608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e791d33b-141f-46cc-a17a-8c0c79b9f179", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a48106eb-ea38-470e-a17f-72e3ae3f913c", 1, 0, 0.0, 856.0, 856, 856, 856.0, 856.0, 856.0, 856.0, 1.1682242990654206, 0.21105614778037385, 0.8054358936915889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 520.2, 99, 1103, 786.0, 1039.4, 1103.0, 1103.0, 0.06671529470369514, 42.57616350084061, 0.10078526681670194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 315.6666666666667, 203, 981, 218.0, 464.40000000000083, 981.0, 981.0, 0.11378937586527338, 7.729423631129612, 0.25429752444891174], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 1081.0, 186, 2317, 981.0, 1978.9000000000003, 2302.2999999999997, 2317.0, 0.1050611172845742, 0.03278424588342257, 0.04740062127487625], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 304.75, 200, 1182, 205.5, 584.1000000000004, 1153.0999999999995, 1182.0, 0.10343989366378932, 6.339799767842089, 0.23131544189522574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.35714285714286, 102, 308, 104.5, 214.0, 308.0, 308.0, 0.07153404765189489, 0.05553668738599261, 0.02542811850125951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 370.05555555555554, 202, 987, 301.5, 816.9000000000003, 987.0, 987.0, 0.10370216737529814, 13.927732192033368, 0.23028047475428345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1474dd03-404d-4823-bd9d-b889f585ebb5", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 103.63636363636364, 100, 111, 103.0, 109.80000000000001, 111.0, 111.0, 0.05407026184753169, 0.04018307545505041, 0.027140736903936806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 118.18181818181819, 98, 299, 100.0, 259.40000000000015, 299.0, 299.0, 0.05407212237995988, 0.021851589228833224, 0.03042516971272956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 190.54545454545453, 98, 892, 100.0, 774.2000000000005, 892.0, 892.0, 0.05407185658177385, 4.436335650128052, 0.03136590118122429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 153.8181818181818, 98, 690, 100.0, 573.0000000000005, 690.0, 690.0, 0.05407238818075907, 1.4586199528341304, 0.03141901461674966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 116.33333333333333, 112, 124, 113.0, 124.0, 124.0, 124.0, 0.022455257898636966, 0.006622546763074574, 0.01388103344710664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eecc0734-81fd-4b8d-a18d-e5f0fc77f004", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 956.8392857142854, 775, 1840, 805.5, 1294.5, 1325.2499999999998, 1840.0, 0.25394291725995594, 303.804013885236, 0.5014380651363582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 1081.0, 186, 2317, 981.0, 1978.9000000000003, 2302.2999999999997, 2317.0, 0.10488142348295072, 0.03272817256221284, 0.04731954848547191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 157.83333333333331, 100, 409, 105.5, 409.0, 409.0, 409.0, 0.029859659599880562, 0.008048111376530307, 0.017583373768289043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 174.16666666666666, 100, 305, 119.5, 305.0, 305.0, 305.0, 0.029859808200498657, 0.008048151429040654, 0.01755430130537128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81903c95-e6b8-41a5-a0da-8c37da5a962d", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eeb15fc-67df-4938-9855-056a424c2173", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 117.92857142857144, 99, 296, 101.5, 207.5, 296.0, 296.0, 0.06968675802268802, 0.018782758998302628, 0.04096819172818182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=249bce40-e00d-48be-bb32-83c78e8acaaf", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 131.64285714285714, 99, 313, 101.5, 304.0, 313.0, 313.0, 0.06968675802268802, 0.018782758998302628, 0.041036245202813355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 101.35714285714286, 100, 105, 101.0, 104.0, 105.0, 105.0, 0.06968537055195792, 0.05178766307621091, 0.03497878951533825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 195.5, 101, 425, 120.5, 425.0, 425.0, 425.0, 0.029829672569627427, 0.007981767855544839, 0.017012235137365644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 145.14285714285714, 98, 299, 102.5, 298.0, 299.0, 299.0, 0.06968710489900348, 0.018646744865553663, 0.03974342701271292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 135.0, 101, 302, 102.0, 302.0, 302.0, 302.0, 0.029859362403081485, 0.0221904050671338, 0.014988000268734262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 106.66666666666667, 101, 118, 104.0, 118.0, 118.0, 118.0, 0.02962085308056872, 0.02331485115521327, 0.010529287618483412], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 576.5000000000001, 99, 1394, 450.5, 1349.9, 1394.0, 1394.0, 0.10717467462438626, 0.021109172058892487, 0.07293032515791519], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6448b399-f00b-46e6-b482-54ec6473793e", 3, 0, 0.0, 377.3333333333333, 271, 495, 366.0, 495.0, 495.0, 495.0, 0.03733944040625311, 0.03056923587946829, 0.02394488854177039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1520.0434782608695, 972, 2798, 1467.0, 2256.2000000000007, 2720.199999999999, 2798.0, 0.1099389599774386, 0.05690200076957272, 0.05056762709899765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 415.16666666666663, 215, 712, 402.5, 712.0, 712.0, 712.0, 0.029814257177782418, 0.046206275528457706, 0.06705296316448525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98b86ebc-22ed-42ab-b0af-25df9fe3b47d", 3, 0, 0.0, 434.0, 212, 656, 434.0, 656.0, 656.0, 656.0, 0.036237573532076295, 0.02329726813992535, 0.023238287714254652], "isController": false}, {"data": ["addBook", 63, 13, 20.634920634920636, 959.7460317460318, 511, 2940, 828.0, 1498.8000000000002, 1742.1999999999996, 2940.0, 0.3068067263722296, 88.6397742429057, 1.1157222163377016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d6716d79-54e9-4876-aad2-78f7dca17f48", 3, 0, 0.0, 311.6666666666667, 203, 439, 293.0, 439.0, 439.0, 439.0, 0.023071776296057032, 0.02313936939067439, 0.014795377377354283], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 186.33928571428572, 100, 587, 103.0, 403.3, 428.34999999999985, 587.0, 0.2547341894221628, 0.18930929506861904, 0.12313810914450253], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 555.8035714285713, 480, 806, 500.5, 702.9, 790.1, 806.0, 0.2548883952954885, 74.94565130812366, 0.12819094099333647], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 159.375, 99, 402, 105.0, 304.3, 307.6, 402.0, 0.25533583501657403, 0.45182473930667205, 0.1241769978889198], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 766.8928571428571, 674, 1217, 694.0, 894.1, 906.3, 1217.0, 0.2546623677233639, 229.1456461261761, 0.12782857129864164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 148.27777777777777, 102, 389, 112.5, 318.8000000000001, 389.0, 389.0, 0.1007765392216692, 0.07528716064900091, 0.03582291042645272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, 7.142857142857143, 174.39010989010993, 100, 1731, 112.0, 308.70000000000005, 431.49999999999983, 803.0599999999861, 0.7620483188879119, 1.643485625235523, 0.36754291101411046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 126.81818181818181, 103, 310, 108.0, 272.20000000000016, 310.0, 310.0, 0.05563788839039589, 0.04308676317732807, 0.01977753063877354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 141.33333333333331, 101, 313, 109.0, 312.1, 313.0, 313.0, 0.11551716392527323, 0.09374488595888873, 0.04106274186406197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e791d33b-141f-46cc-a17a-8c0c79b9f179", 3, 0, 0.0, 859.6666666666666, 228, 1372, 979.0, 1372.0, 1372.0, 1372.0, 0.02647860969646687, 0.03129682024995807, 0.016980098014986893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 296.0, 201, 996, 207.0, 877.8000000000004, 996.0, 996.0, 0.0540434312665815, 5.953845451139825, 0.12028789642085094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6641389a-eb1e-46d1-8e9c-29af59e544e6", 3, 0, 0.0, 419.33333333333337, 181, 766, 311.0, 766.0, 766.0, 766.0, 0.07410884118475333, 0.0335323207183617, 0.04752422432746226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 262.92857142857144, 201, 414, 206.5, 407.5, 414.0, 414.0, 0.06965035521681161, 0.10794444700105471, 0.1566452813128097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/249bce40-e00d-48be-bb32-83c78e8acaaf", 3, 0, 0.0, 391.6666666666667, 314, 452, 409.0, 452.0, 452.0, 452.0, 0.028322995439997736, 0.03397468691288791, 0.018162858403904796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eca36e80-9bd3-4d52-93c1-0569f698bd8e", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 108.24999999999999, 99, 135, 105.5, 129.60000000000002, 135.0, 135.0, 0.06328112640405, 0.05246648077835785, 0.022494462901439645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 110.85000000000001, 102, 140, 106.0, 128.4, 139.45, 140.0, 0.09742363205042648, 0.07563651121102447, 0.03463105670542504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49c24ca5-1ce0-4a06-90e7-607807d419ae", 3, 0, 0.0, 737.6666666666667, 313, 1394, 506.0, 1394.0, 1394.0, 1394.0, 0.01798863118509102, 0.024798780295853022, 0.01153567820137673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a48106eb-ea38-470e-a17f-72e3ae3f913c", 2, 0, 0.0, 282.0, 232, 332, 282.0, 332.0, 332.0, 332.0, 0.017877574370709384, 0.025454593195795194, 0.011112378991168478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15b1ec48-86da-47ef-91b2-0a8f8ef068cf", 3, 0, 0.0, 373.33333333333337, 231, 652, 237.0, 652.0, 652.0, 652.0, 0.027394508314233273, 0.027314250965656418, 0.017567441855156105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36988644-f59e-429f-bc4b-b7bbb4af68bb", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eecc0734-81fd-4b8d-a18d-e5f0fc77f004", 3, 0, 0.0, 337.6666666666667, 253, 449, 311.0, 449.0, 449.0, 449.0, 0.05496015388843089, 0.03565611546212329, 0.035244629934963814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 112.61111111111111, 98, 301, 101.0, 134.50000000000026, 301.0, 301.0, 0.10376553600664098, 0.07711481728618536, 0.05208543506583347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 167.05555555555554, 98, 305, 102.5, 304.1, 305.0, 305.0, 0.10376553600664098, 0.04508216212788526, 0.058210484066225476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 199.49999999999997, 98, 887, 101.0, 713.3000000000003, 887.0, 887.0, 0.10376673238559718, 10.39924835774734, 0.06001266098255566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 189.16666666666666, 96, 497, 102.5, 494.3, 497.0, 497.0, 0.10376254517994155, 3.41481905685611, 0.0601115699561315], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.714285714285715, 0.6564551422319475], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.29175784099197666], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.2188183807439825], "isController": false}, {"data": ["401/Unauthorized", 19, 54.285714285714285, 1.3858497447118892], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1371, 35, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
