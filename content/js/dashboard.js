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

    var data = {"OkPercent": 97.86223277909738, "KoPercent": 2.137767220902613};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7603812117086454, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33cfc82b-f835-484a-8277-027500822f01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fac55554-7adc-41c4-9587-bce59b623c95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef94ead2-6aad-4cdb-8682-8d17100da166"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ee29fac-3f38-4988-9581-59ac381697aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d5524a5-0038-489e-b3a1-035ba9fc9f6d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b83d7f9-cee3-4e47-96c2-219e47d1a1cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b83d7f9-cee3-4e47-96c2-219e47d1a1cd"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/943477bc-95dc-4763-8d7e-3873d221517f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b1a1a38-8229-4571-9b8a-48bcf21e9ed5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1f6f4d2-da3e-4429-a672-fbdd07004860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af3baa11-c0ac-47f5-bf32-a5f1351e29ef"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a98225f8-d285-4f55-9509-77427a2f3e55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/603a03e3-2c5b-47ad-8054-dd1c06dc375c"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ee29fac-3f38-4988-9581-59ac381697aa"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef94ead2-6aad-4cdb-8682-8d17100da166"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a98225f8-d285-4f55-9509-77427a2f3e55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fac55554-7adc-41c4-9587-bce59b623c95"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33cfc82b-f835-484a-8277-027500822f01"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d5524a5-0038-489e-b3a1-035ba9fc9f6d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0b6039e-f693-4987-8882-545698106230"], "isController": false}, {"data": [0.9255952380952381, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=943477bc-95dc-4763-8d7e-3873d221517f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1f6f4d2-da3e-4429-a672-fbdd07004860"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b1a1a38-8229-4571-9b8a-48bcf21e9ed5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af3baa11-c0ac-47f5-bf32-a5f1351e29ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ba0d161-36ae-4232-9ffd-5682470e4066"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1263, 27, 2.137767220902613, 426.5391923990502, 136, 2049, 158.0, 1130.000000000002, 1325.9999999999993, 1759.7999999999995, 5.090278897307754, 707.2459741002338, 3.7282434217817992], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2114.370370370371, 1678, 2654, 2086.5, 2466.0, 2524.0, 2654.0, 0.23115646724427247, 278.15891766335056, 1.1365945435301874], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/33cfc82b-f835-484a-8277-027500822f01", 3, 0, 0.0, 417.3333333333333, 332, 468, 452.0, 468.0, 468.0, 468.0, 0.019841138616808092, 0.027352611341856205, 0.012723646834346335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fac55554-7adc-41c4-9587-bce59b623c95", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef94ead2-6aad-4cdb-8682-8d17100da166", 3, 0, 0.0, 315.0, 226, 488, 231.0, 488.0, 488.0, 488.0, 0.06657494119213529, 0.030123427167014338, 0.04269291476188363], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 501.0000000000001, 146, 1065, 468.5, 921.5, 1065.0, 1065.0, 0.07927654490166877, 0.016263415077832577, 0.053070382353607365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 501.0000000000001, 146, 1065, 468.5, 921.5, 1065.0, 1065.0, 0.078616793670225, 0.01612806851172794, 0.05262872271576098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ee29fac-3f38-4988-9581-59ac381697aa", 3, 0, 0.0, 340.6666666666667, 281, 427, 314.0, 427.0, 427.0, 427.0, 0.0415472184137272, 0.02671085819241902, 0.02664323576661543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 180.0, 136, 440, 147.0, 429.59999999999997, 440.0, 440.0, 0.09393770272585111, 0.041734500969768634, 0.05264569323261738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 181.8235294117647, 138, 448, 149.0, 442.4, 448.0, 448.0, 0.09393406933439423, 0.06980842457370509, 0.047150499646365855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 298.2352941176471, 139, 995, 149.0, 988.6, 995.0, 995.0, 0.09393406933439423, 3.2717201814585195, 0.05436499015073655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 335.94117647058823, 139, 1329, 146.0, 1309.0, 1329.0, 1329.0, 0.09393718365271976, 9.96643947337157, 0.054275057053024774], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 256.92857142857144, 143, 487, 238.0, 477.5, 487.0, 487.0, 0.07912912743180765, 0.1359866289437392, 0.051139185662367324], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 183.35294117647058, 140, 447, 151.0, 431.8, 447.0, 447.0, 0.08721482036312146, 0.06481492021126507, 0.043777751627582455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 181.11764705882356, 143, 443, 150.0, 419.79999999999995, 443.0, 443.0, 0.08721571524582006, 0.03874806650454804, 0.048878476444061375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 951.8333333333333, 740, 1197, 1000.5, 1197.0, 1197.0, 1197.0, 0.03567606136282554, 10.489946597395647, 0.02034650374598644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1295.0, 1268, 1373, 1275.5, 1373.0, 1373.0, 1373.0, 0.03554376029288058, 31.982337990800087, 0.02023634008862244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 257.83333333333337, 141, 535, 149.5, 535.0, 535.0, 535.0, 0.03572108973137741, 0.06320958456372643, 0.019779158083682608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d5524a5-0038-489e-b3a1-035ba9fc9f6d", 3, 0, 0.0, 441.33333333333337, 233, 847, 244.0, 847.0, 847.0, 847.0, 0.025685811157916367, 0.020878082832460013, 0.016471695306346106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b83d7f9-cee3-4e47-96c2-219e47d1a1cd", 3, 0, 0.0, 870.0, 255, 1911, 444.0, 1911.0, 1911.0, 1911.0, 0.02134092121643251, 0.025224246398719546, 0.013685421483194026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 193.16666666666666, 141, 439, 144.0, 435.40000000000003, 439.0, 439.0, 0.07225303011145029, 0.05369585538556023, 0.03626763425516158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 229.08333333333334, 143, 560, 149.0, 522.5000000000001, 560.0, 560.0, 0.07225216003853448, 0.019333097510310985, 0.041206310021976694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 169.66666666666669, 138, 451, 145.0, 361.00000000000034, 451.0, 451.0, 0.07225433526011561, 0.019474801300578035, 0.0424776463150289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 215.25, 142, 441, 146.5, 436.20000000000005, 441.0, 441.0, 0.07225433526011561, 0.019474801300578035, 0.04254820718930635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 245.0, 143, 439, 156.0, 439.0, 439.0, 439.0, 0.03580272697437121, 0.026607300026852045, 0.0201040703225229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 311.47058823529414, 137, 1298, 149.0, 1033.9999999999998, 1298.0, 1298.0, 0.08722063742894083, 9.253835062567981, 0.050394368753463176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 812.6875, 144, 1333, 1142.0, 1331.6, 1333.0, 1333.0, 0.0784821551199796, 39.732093997402735, 0.04234510810916868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 280.1176470588236, 139, 995, 147.0, 745.3999999999997, 995.0, 995.0, 0.08721705760430133, 3.037766909848345, 0.05047747330901517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 668.8125, 141, 1194, 993.5, 1189.8, 1194.0, 1194.0, 0.07858198802606957, 13.006230308458859, 0.04247571325432569], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 475.23076923076917, 149, 927, 447.0, 862.1999999999999, 927.0, 927.0, 0.07474915907196043, 0.014818436808210909, 0.050716226317453934], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 449.5833333333333, 291, 879, 297.5, 875.4, 879.0, 879.0, 0.07218913553510196, 0.11187906063887386, 0.16235505775130843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b83d7f9-cee3-4e47-96c2-219e47d1a1cd", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 454.90000000000003, 242, 814, 408.0, 726.8000000000002, 810.0, 814.0, 0.08809175637343858, 0.05411104956923131, 0.03983055000088092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 167.00000000000003, 143, 432, 150.0, 238.1000000000002, 432.0, 432.0, 0.07858160208241245, 0.05839902264132409, 0.03944428073277344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 201.5625, 141, 443, 148.5, 443.0, 443.0, 443.0, 0.07847946045370939, 0.08730265174739424, 0.04105035254445126], "isController": false}, {"data": ["login", 20, 0, 0.0, 2425.0000000000005, 1302, 4118, 2100.0, 3461.7000000000007, 4086.4999999999995, 4118.0, 0.0873392956959195, 31.46482566803644, 0.17522446198993852], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/943477bc-95dc-4763-8d7e-3873d221517f", 3, 0, 0.0, 404.6666666666667, 230, 571, 413.0, 571.0, 571.0, 571.0, 0.031861339450710506, 0.026561487738694534, 0.02043191364514964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 170.1764705882353, 141, 432, 151.0, 239.99999999999983, 432.0, 432.0, 0.08416924950736233, 0.0681409256265658, 0.029919537910820207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b1a1a38-8229-4571-9b8a-48bcf21e9ed5", 3, 0, 0.0, 470.6666666666667, 224, 770, 418.0, 770.0, 770.0, 770.0, 0.06859024189491975, 0.031035298253235172, 0.043985278819333305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1f6f4d2-da3e-4429-a672-fbdd07004860", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af3baa11-c0ac-47f5-bf32-a5f1351e29ef", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1000.6249999999999, 295, 1487, 1293.5, 1482.8, 1487.0, 1487.0, 0.07842099329990639, 52.826231523585115, 0.16508423211143625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a98225f8-d285-4f55-9509-77427a2f3e55", 1, 0, 0.0, 927.0, 927, 927, 927.0, 927.0, 927.0, 927.0, 1.0787486515641855, 0.19489111380798274, 0.7437466289104638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/603a03e3-2c5b-47ad-8054-dd1c06dc375c", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 982.3999999999999, 143, 1717, 1416.0, 1715.4, 1717.0, 1717.0, 0.05516297902151908, 39.602364561095754, 0.08906343087527098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 554.8823529411765, 286, 1771, 297.0, 1518.1999999999998, 1771.0, 1771.0, 0.09385576025926273, 13.338241710673056, 0.20825864266627653], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 939.8636363636365, 211, 1823, 877.5, 1689.6, 1813.2499999999998, 1823.0, 0.0871953612067838, 0.027294996769808212, 0.03934009460696691], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ee29fac-3f38-4988-9581-59ac381697aa", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 551.9999999999999, 284, 1727, 305.0, 1261.3999999999996, 1727.0, 1727.0, 0.08714775645790508, 12.384938729039684, 0.19337410321113851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 172.25, 146, 419, 154.0, 251.70000000000016, 419.0, 419.0, 0.08940245633248772, 0.06940913357844507, 0.031779779399439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 376.93750000000006, 289, 599, 301.5, 598.3, 599.0, 599.0, 0.14904379092882225, 0.23098876582425873, 0.3352029790127712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef94ead2-6aad-4cdb-8682-8d17100da166", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 191.3076923076923, 139, 442, 149.0, 438.8, 442.0, 442.0, 0.06909674607477331, 0.051350218518459466, 0.03468332761956395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 261.53846153846155, 138, 453, 163.0, 449.8, 453.0, 453.0, 0.06908903450731546, 0.01848671431152777, 0.03940233999245335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 213.3846153846154, 137, 445, 148.0, 445.0, 445.0, 445.0, 0.06909711333521135, 0.01862383132863119, 0.04062154514433324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 213.69230769230768, 138, 443, 150.0, 437.8, 443.0, 443.0, 0.06908976886815016, 0.018621851765243596, 0.04068469787841263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 0.05694274407083678, 0.016793660849016314, 0.03519995800472625], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1359.462962962963, 1104, 2049, 1183.5, 1868.5, 1916.5, 2049.0, 0.24152644714596247, 288.9495989654617, 0.4769203868448595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 939.8636363636365, 211, 1823, 877.5, 1689.6, 1813.2499999999998, 1823.0, 0.09028937745474244, 0.02826352493833646, 0.04073602771883888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 220.0, 143, 447, 145.0, 447.0, 447.0, 447.0, 0.02090880103707653, 0.005635575279524534, 0.012312506860700342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 217.25, 145, 429, 147.5, 429.0, 429.0, 429.0, 0.02087758947351939, 0.005627162787784522, 0.012273739124080734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a98225f8-d285-4f55-9509-77427a2f3e55", 3, 0, 0.0, 321.3333333333333, 243, 453, 268.0, 453.0, 453.0, 453.0, 0.019610278400585695, 0.023178685179858938, 0.012575601708708925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 217.56250000000003, 138, 451, 145.0, 443.3, 451.0, 451.0, 0.08955959071267044, 0.024139108434274456, 0.052651243758816024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 220.31249999999997, 138, 449, 149.5, 441.3, 449.0, 449.0, 0.08955457791807994, 0.024137757329482486, 0.052735752426369346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 290.5, 141, 443, 289.0, 443.0, 443.0, 443.0, 0.02087606402688837, 0.00558597806969474, 0.011905880265334774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 169.5625, 138, 455, 150.5, 261.1000000000002, 455.0, 455.0, 0.08970118293434995, 0.06666269552054717, 0.045025789090093624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 148.75, 146, 152, 148.5, 152.0, 152.0, 152.0, 0.020907926717716855, 0.015538019757990748, 0.010494799153228969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 182.93750000000003, 138, 436, 149.0, 434.6, 436.0, 436.0, 0.089698165672512, 0.024001266986590122, 0.051155985110104496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 153.25, 147, 161, 152.5, 161.0, 161.0, 161.0, 0.020443313247778067, 0.016091123513387814, 0.00726695900604611], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 555.4166666666667, 145, 1192, 452.5, 1088.5000000000005, 1192.0, 1192.0, 0.07615421227986673, 0.014309902030778995, 0.051829238061240686], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1183.8999999999999, 705, 1659, 1144.5, 1570.2000000000003, 1655.3999999999999, 1659.0, 0.08450763737772801, 0.04373930450214438, 0.03887021211416982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 446.25, 297, 593, 447.5, 593.0, 593.0, 593.0, 0.020859625152536008, 0.032328344840893204, 0.046913785865518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fac55554-7adc-41c4-9587-bce59b623c95", 3, 0, 0.0, 315.0, 245, 436, 264.0, 436.0, 436.0, 436.0, 0.04469673266884191, 0.028735692389636316, 0.028662943801308124], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1290.8771929824563, 737, 2642, 1158.0, 2044.8000000000002, 2318.0999999999995, 2642.0, 0.27582869586256953, 76.32528013851923, 1.0046094317082022], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 246.42592592592592, 144, 601, 151.0, 587.0, 600.0, 601.0, 0.24261048886013506, 0.18029939650640894, 0.11727753123610044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33cfc82b-f835-484a-8277-027500822f01", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d5524a5-0038-489e-b3a1-035ba9fc9f6d", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 845.2037037037035, 677, 1246, 744.5, 1052.5, 1190.25, 1246.0, 0.24246669450543532, 71.29325883656398, 0.12194369889677653], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 218.38888888888889, 139, 587, 150.0, 449.5, 526.25, 587.0, 0.24311183144246354, 0.43019398298217176, 0.11823212115072933], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1102.1851851851854, 953, 1469, 1028.0, 1347.0, 1370.25, 1469.0, 0.242180702682824, 217.91462198227148, 0.1215633605263394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 194.49999999999997, 147, 521, 153.0, 472.70000000000005, 521.0, 521.0, 0.15047352136253772, 0.1124143006272865, 0.05348863454683959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0b6039e-f693-4987-8882-545698106230", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, 6.5476190476190474, 199.6666666666667, 140, 857, 154.0, 297.9, 397.1999999999996, 667.9400000000006, 0.7352812450762417, 1.5671698770482834, 0.3532796607202255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 198.9230769230769, 148, 452, 154.0, 442.8, 452.0, 452.0, 0.06977056218972226, 0.054031304508251714, 0.024801254528377836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 152.41176470588235, 147, 164, 152.0, 159.2, 164.0, 164.0, 0.09373156382843817, 0.0760653608803048, 0.033318641829640123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=943477bc-95dc-4763-8d7e-3873d221517f", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1f6f4d2-da3e-4429-a672-fbdd07004860", 3, 0, 0.0, 628.6666666666667, 271, 1192, 423.0, 1192.0, 1192.0, 1192.0, 0.030407151762094443, 0.02505224645503289, 0.019499377920353535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 500.7692307692308, 291, 888, 571.0, 885.2, 888.0, 888.0, 0.06903290214320609, 0.10698751533326961, 0.1552566148787145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 447.125, 287, 892, 319.5, 689.0000000000002, 892.0, 892.0, 0.08948145496845779, 0.13867877835443604, 0.2012458894456624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 176.91666666666669, 142, 453, 153.0, 365.4000000000003, 453.0, 453.0, 0.07448882046952787, 0.06175879744006753, 0.026478447901277482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 151.5625, 143, 170, 151.0, 163.0, 170.0, 170.0, 0.07848292505861693, 0.060931567794531696, 0.027898227266930236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b1a1a38-8229-4571-9b8a-48bcf21e9ed5", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af3baa11-c0ac-47f5-bf32-a5f1351e29ef", 3, 0, 0.0, 548.0, 365, 792, 487.0, 792.0, 792.0, 792.0, 0.01967961585389853, 0.02326063970231301, 0.012620066156308628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ba0d161-36ae-4232-9ffd-5682470e4066", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.8251574612403101, 1.5418079780361758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 148.75, 139, 154, 149.0, 153.3, 154.0, 154.0, 0.14924259383628088, 0.11091173233340795, 0.07491278635922692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 164.31250000000003, 137, 429, 144.5, 257.50000000000017, 429.0, 429.0, 0.14925233906400126, 0.03993666103860972, 0.08512047462243823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 203.37500000000003, 139, 447, 145.0, 433.0, 447.0, 447.0, 0.14924955458336056, 0.040227419008796395, 0.08774241392498344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 203.06249999999997, 138, 451, 148.5, 450.3, 451.0, 451.0, 0.1492551236485415, 0.04022892004589595, 0.08789144488288138], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5542359461599367], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.2375296912114014], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.7037037037037037, 0.0791765637371338], "isController": false}, {"data": ["401/Unauthorized", 16, 59.25925925925926, 1.2668250197941409], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1263, 27, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
