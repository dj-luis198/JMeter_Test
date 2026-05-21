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

    var data = {"OkPercent": 97.16475095785441, "KoPercent": 2.835249042145594};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7244094488188977, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.36666666666666664, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=416c493b-5f50-43c8-944d-e6c808cac079"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fffcf6a-9014-4766-9bfb-16a8668f2563"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c8fbacc-abc3-4b5a-a15d-cae0cf043b29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6b6f81f-a0b6-4654-984a-64f18903b487"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d278c9b7-59f0-4090-8339-9467d7e85eff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c345ba8-fb6f-4a28-9ca5-cfeb49e7b290"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1915d977-dea4-4568-995a-c8fe908121f0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/745c107e-1992-4aff-958e-6eabf9cac585"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ee5d994-00dd-4385-a8a3-a608b54800b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d87a3019-7e79-43ef-8d68-916758944251"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b2d1437-e809-47ed-bb1f-7438eaf17612"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50f352fe-eac6-45fb-9f4c-40d19c09a5ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1839fa08-e81b-4420-8e9e-a2ecead45dd9"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/971e4694-6ed8-41c7-82c6-c6c618272172"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9fffcf6a-9014-4766-9bfb-16a8668f2563"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.19642857142857142, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=745c107e-1992-4aff-958e-6eabf9cac585"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c345ba8-fb6f-4a28-9ca5-cfeb49e7b290"], "isController": false}, {"data": [0.8720238095238095, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1915d977-dea4-4568-995a-c8fe908121f0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d278c9b7-59f0-4090-8339-9467d7e85eff"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ee5d994-00dd-4385-a8a3-a608b54800b4"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/416c493b-5f50-43c8-944d-e6c808cac079"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b2d1437-e809-47ed-bb1f-7438eaf17612"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d87a3019-7e79-43ef-8d68-916758944251"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1839fa08-e81b-4420-8e9e-a2ecead45dd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=971e4694-6ed8-41c7-82c6-c6c618272172"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50f352fe-eac6-45fb-9f4c-40d19c09a5ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81e08aa4-0cd6-4b45-bbad-14288f6c7fbc"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 37, 2.835249042145594, 456.5034482758624, 125, 4472, 147.0, 1275.800000000001, 1560.4, 1981.4000000000005, 5.057727859360285, 726.59337275963, 3.698766282589401], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2177.3214285714284, 1609, 2943, 2117.5, 2592.4, 2682.3, 2943.0, 0.2515598959620145, 302.7106991357682, 1.236918043133538], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 781.3333333333334, 136, 2462, 638.0, 1973.0000000000002, 2462.0, 2462.0, 0.08878734247645655, 0.018069611496185103, 0.05949792422592235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 781.3333333333334, 136, 2462, 638.0, 1973.0000000000002, 2462.0, 2462.0, 0.09136647703046767, 0.018594505676903773, 0.061226246619440344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 187.33333333333334, 127, 407, 134.0, 401.0, 407.0, 407.0, 0.09433190996962512, 0.025241155597341098, 0.053798667404551824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=416c493b-5f50-43c8-944d-e6c808cac079", 1, 0, 0.0, 1459.0, 1459, 1459, 1459.0, 1459.0, 1459.0, 1459.0, 0.6854009595613434, 0.12382732179575051, 0.4725518334475668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 151.79999999999998, 127, 397, 133.0, 245.8000000000001, 397.0, 397.0, 0.09433131673940659, 0.07010364456903165, 0.04734989922270995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 203.33333333333337, 129, 422, 133.0, 404.6, 422.0, 422.0, 0.0943325032073051, 0.025425557505093954, 0.05554931585352049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 167.86666666666667, 126, 397, 133.0, 397.0, 397.0, 397.0, 0.09433428296511519, 0.025426037205441204, 0.055458240571288425], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 239.19999999999993, 130, 481, 241.0, 366.4000000000001, 481.0, 481.0, 0.08834390515398342, 0.1281849358181529, 0.057095699639556866], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 150.0625, 126, 389, 133.0, 217.50000000000017, 389.0, 389.0, 0.09398937920015038, 0.06984952887823676, 0.04717826260632549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 199.625, 129, 403, 134.0, 400.9, 403.0, 403.0, 0.093841642228739, 0.042728189149560114, 0.05253390762463343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 872.375, 632, 1068, 884.5, 1068.0, 1068.0, 1068.0, 0.06600714527347586, 19.40829235389731, 0.0376447000387792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1348.625, 920, 1685, 1377.5, 1685.0, 1685.0, 1685.0, 0.06587398307038635, 59.2735257608445, 0.03750442590823754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 203.75, 131, 415, 140.5, 415.0, 415.0, 415.0, 0.06637186496644072, 0.11744708917889707, 0.0367508275741913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 135.07692307692307, 130, 139, 135.0, 139.0, 139.0, 139.0, 0.07113620942500055, 0.0528658743871342, 0.03570704262153348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 213.2307692307692, 128, 402, 136.0, 400.0, 402.0, 402.0, 0.07103242903587137, 0.019006724175614022, 0.0405106821845204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 172.6153846153846, 128, 397, 133.0, 395.4, 397.0, 397.0, 0.07113698795048866, 0.019173641283530145, 0.04182076830683024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 163.46153846153848, 127, 536, 132.0, 377.1999999999998, 536.0, 536.0, 0.07113776649301755, 0.019173851125071136, 0.04189069647977499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fffcf6a-9014-4766-9bfb-16a8668f2563", 1, 0, 0.0, 831.0, 831, 831, 831.0, 831.0, 831.0, 831.0, 1.203369434416366, 0.21740561070998798, 0.829666817087846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 134.875, 131, 146, 133.5, 146.0, 146.0, 146.0, 0.06651423820411556, 0.04943099147786323, 0.0373493036790688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 812.35, 131, 1657, 669.5, 1635.8, 1655.95, 1657.0, 0.08733967710521374, 39.305967879196125, 0.04759330061006764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 315.375, 131, 1440, 136.5, 1430.9, 1440.0, 1440.0, 0.09398993132860642, 10.59370474898814, 0.0542461420070375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 584.2000000000002, 131, 1233, 541.5, 1178.0, 1230.3, 1233.0, 0.08733815148802375, 12.851928399091683, 0.047677760431450465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 294.43749999999994, 128, 1049, 133.0, 1021.0, 1049.0, 1049.0, 0.09384329343038295, 3.4712625075514523, 0.054253154014440134], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 462.4000000000001, 137, 1459, 361.0, 1096.0000000000002, 1459.0, 1459.0, 0.09173189823874756, 0.018668874602495108, 0.06193694769752935], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0c8fbacc-abc3-4b5a-a15d-cae0cf043b29", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6b6f81f-a0b6-4654-984a-64f18903b487", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.8251574612403101, 1.5418079780361758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 381.6153846153846, 263, 673, 273.0, 617.4, 673.0, 673.0, 0.0709796834306119, 0.1100046460980284, 0.15963497162177656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d278c9b7-59f0-4090-8339-9467d7e85eff", 1, 0, 0.0, 854.0, 854, 854, 854.0, 854.0, 854.0, 854.0, 1.17096018735363, 0.21155042447306793, 0.8073221604215457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c345ba8-fb6f-4a28-9ca5-cfeb49e7b290", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 530.3478260869566, 143, 1187, 430.0, 1003.2, 1151.5999999999995, 1187.0, 0.09759699231529768, 0.05994971500617407, 0.044128327580061355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 135.54999999999998, 131, 142, 135.0, 141.0, 141.95, 142.0, 0.0873358631621696, 0.06490487486954205, 0.04383850943882341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 213.75, 127, 421, 135.5, 413.1, 420.7, 421.0, 0.08734043993379595, 0.08896101450288005, 0.046143728519710554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1915d977-dea4-4568-995a-c8fe908121f0", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.5425347222222222, 2.070429804804805], "isController": false}, {"data": ["login", 23, 0, 0.0, 2924.826086956522, 1796, 5906, 2609.0, 4581.800000000001, 5708.599999999997, 5906.0, 0.09205191728134668, 38.42808750385217, 0.1919793701147447], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/745c107e-1992-4aff-958e-6eabf9cac585", 3, 0, 0.0, 377.0, 228, 638, 265.0, 638.0, 638.0, 638.0, 0.035654437194708885, 0.029723637257698384, 0.02286433635207568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ee5d994-00dd-4385-a8a3-a608b54800b4", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d87a3019-7e79-43ef-8d68-916758944251", 3, 0, 0.0, 412.3333333333333, 234, 508, 495.0, 508.0, 508.0, 508.0, 0.028635517586980384, 0.02344346573283062, 0.018363271369255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 162.875, 133, 489, 137.5, 260.80000000000024, 489.0, 489.0, 0.08793044701641002, 0.07118587946933976, 0.0312565260878645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b2d1437-e809-47ed-bb1f-7438eaf17612", 3, 0, 0.0, 607.3333333333334, 257, 1080, 485.0, 1080.0, 1080.0, 1080.0, 0.07303179317396173, 0.033044984541603775, 0.046833539242416865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 962.6999999999999, 268, 1799, 926.0, 1772.0, 1797.65, 1799.0, 0.08728364566331206, 52.27842876072498, 0.18513679529366583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50f352fe-eac6-45fb-9f4c-40d19c09a5ec", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1839fa08-e81b-4420-8e9e-a2ecead45dd9", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 413.0, 259, 795, 286.0, 658.8000000000001, 795.0, 795.0, 0.09425189132128585, 0.14607202297546937, 0.21197471261027473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 915.3571428571428, 130, 1832, 1203.5, 1807.5, 1832.0, 1832.0, 0.10426286156870923, 71.2888879527987, 0.16395073160877593], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 974.4166666666666, 139, 1791, 1144.5, 1578.0, 1763.25, 1791.0, 0.09799398153630065, 0.03062311923009395, 0.04421212838844814], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/971e4694-6ed8-41c7-82c6-c6c618272172", 3, 0, 0.0, 359.3333333333333, 290, 456, 332.0, 456.0, 456.0, 456.0, 0.09056056992785341, 0.04097629954417846, 0.0580743238144112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 141.58823529411765, 132, 158, 138.0, 155.6, 158.0, 158.0, 0.10659443326247939, 0.08275642035514758, 0.03789098994877197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 533.1250000000001, 263, 1830, 277.5, 1641.7000000000003, 1830.0, 1830.0, 0.09376849730122544, 14.149622746625798, 0.2078886044903389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 558.3333333333334, 265, 2100, 275.0, 1860.0000000000002, 2100.0, 2100.0, 0.09318564444085507, 14.989487251815568, 0.20639770895327672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 140.22222222222223, 132, 185, 134.0, 185.0, 185.0, 185.0, 0.05103053326907266, 0.037924058415785444, 0.02561493564482749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 131.99999999999997, 130, 134, 132.0, 134.0, 134.0, 134.0, 0.05103053326907266, 0.013654654409888582, 0.029103351005018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 163.22222222222223, 129, 391, 135.0, 391.0, 391.0, 391.0, 0.05102966524539599, 0.013754089460673139, 0.029999861794656628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 191.55555555555554, 131, 413, 132.0, 413.0, 413.0, 413.0, 0.05103082261686059, 0.013754401408450703, 0.03005037699020208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 138.0, 137, 139, 138.0, 139.0, 139.0, 139.0, 0.031209687486995968, 0.009204419551828888, 0.01929270720631684], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1504.3571428571424, 1046, 2378, 1414.0, 2000.4, 2100.2, 2378.0, 0.24352484823183565, 291.34038142079356, 0.48086644836403486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 974.4166666666666, 139, 1791, 1144.5, 1578.0, 1763.25, 1791.0, 0.09301568476984431, 0.029067401490576347, 0.0419660609020196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 172.85714285714286, 130, 396, 137.0, 396.0, 396.0, 396.0, 0.05301022340022719, 0.014287911775842483, 0.03121598116243847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 195.0, 128, 553, 138.0, 553.0, 553.0, 553.0, 0.053008216273522396, 0.014287370792472833, 0.03116303339517625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 208.6470588235294, 126, 401, 135.0, 401.0, 401.0, 401.0, 0.09905894006934125, 0.026699479940564635, 0.05823582218920257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 209.9411764705882, 127, 401, 135.0, 397.0, 401.0, 401.0, 0.09906067174789641, 0.026699946682050207, 0.058333579164044476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 134.14285714285714, 129, 142, 132.0, 142.0, 142.0, 142.0, 0.053010624843807974, 0.014184483600784557, 0.030232621981234237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 165.64705882352942, 125, 410, 135.0, 400.4, 410.0, 410.0, 0.09905489972148093, 0.07361404168754589, 0.049720916461758975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 134.57142857142856, 132, 140, 134.0, 140.0, 140.0, 140.0, 0.05301022340022719, 0.0393952929761454, 0.02660864729269216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 194.88235294117646, 125, 417, 133.0, 405.8, 417.0, 417.0, 0.09906067174789641, 0.026506468807542597, 0.056495539356222174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 179.71428571428572, 137, 396, 141.0, 396.0, 396.0, 396.0, 0.056507208705339124, 0.04447735372705404, 0.020086546844476017], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 589.6666666666666, 130, 1366, 511.0, 1298.2, 1366.0, 1366.0, 0.09285740816402333, 0.018390119507484304, 0.06318656446161275], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1597.2608695652173, 899, 4472, 1322.0, 2697.2000000000016, 4212.399999999996, 4472.0, 0.09402415194302953, 0.04866484426738834, 0.043247437075358316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fffcf6a-9014-4766-9bfb-16a8668f2563", 3, 0, 0.0, 522.0, 241, 972, 353.0, 972.0, 972.0, 972.0, 0.0378826144054955, 0.031581176918123045, 0.024293213013940804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 333.1428571428571, 268, 688, 275.0, 688.0, 688.0, 688.0, 0.052954481840395196, 0.0820691041803781, 0.11909587077971692], "isController": false}, {"data": ["addBook", 56, 17, 30.357142857142858, 1419.6785714285718, 677, 4564, 1083.0, 2324.0, 3144.8499999999976, 4564.0, 0.2632494382445023, 79.83356432541156, 0.9552432618720795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=745c107e-1992-4aff-958e-6eabf9cac585", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 236.19642857142858, 128, 706, 140.0, 538.2, 565.9, 706.0, 0.2453149230324429, 0.1823092347926651, 0.11858485048931566], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 849.9107142857143, 625, 1253, 788.0, 1106.0, 1191.2, 1253.0, 0.24521609668520383, 72.10167436616018, 0.12332645487585935], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 221.08928571428572, 126, 532, 140.0, 420.0, 438.29999999999984, 532.0, 0.24577249366916387, 0.43490210793801265, 0.11952607602269884], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1264.3392857142858, 903, 1835, 1257.5, 1553.1000000000001, 1700.0499999999997, 1835.0, 0.24412572474824534, 219.6647562557217, 0.1225396704302716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 140.4666666666667, 131, 173, 137.0, 157.4, 173.0, 173.0, 0.09778293492219738, 0.07305072774949316, 0.03475877764812485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c345ba8-fb6f-4a28-9ca5-cfeb49e7b290", 3, 0, 0.0, 408.6666666666667, 234, 511, 481.0, 511.0, 511.0, 511.0, 0.06924088905301545, 0.03132969914833707, 0.04440252325339857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 17, 10.119047619047619, 232.85119047619045, 128, 2647, 140.5, 397.5, 492.09999999999997, 2497.9600000000005, 0.6872177498527391, 1.574358692639816, 0.32666332005939525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 201.33333333333337, 134, 422, 145.0, 422.0, 422.0, 422.0, 0.05216121292207115, 0.040394376803908616, 0.018541681155892477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 141.8, 134, 163, 140.0, 155.20000000000002, 163.0, 163.0, 0.0986212745813527, 0.08003347575889071, 0.03505678119884021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 335.33333333333337, 265, 557, 270.0, 557.0, 557.0, 557.0, 0.05099121251437669, 0.07902642017608966, 0.11468043205137647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1915d977-dea4-4568-995a-c8fe908121f0", 3, 0, 0.0, 406.0, 251, 696, 271.0, 696.0, 696.0, 696.0, 0.07159904534606204, 0.033189140811455846, 0.045914752386634845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d278c9b7-59f0-4090-8339-9467d7e85eff", 3, 0, 0.0, 392.3333333333333, 254, 544, 379.0, 544.0, 544.0, 544.0, 0.03421025623481919, 0.02851968301346744, 0.02193821770266726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ee5d994-00dd-4385-a8a3-a608b54800b4", 3, 0, 0.0, 583.3333333333334, 209, 955, 586.0, 955.0, 955.0, 955.0, 0.059135439869113564, 0.026757246555360627, 0.037922140801482325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 440.70588235294116, 264, 814, 513.0, 798.0, 814.0, 814.0, 0.09897704314816863, 0.1533950854259215, 0.22260168981468004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/416c493b-5f50-43c8-944d-e6c808cac079", 3, 0, 0.0, 618.0, 229, 1366, 259.0, 1366.0, 1366.0, 1366.0, 0.030981173773403693, 0.02582772982867411, 0.01986748448359547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b2d1437-e809-47ed-bb1f-7438eaf17612", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 0.6229795258620691, 2.3774245689655173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 177.23076923076923, 132, 399, 137.0, 396.6, 399.0, 399.0, 0.07180574887872561, 0.059534258591834026, 0.025524699796734492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d87a3019-7e79-43ef-8d68-916758944251", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1839fa08-e81b-4420-8e9e-a2ecead45dd9", 3, 0, 0.0, 670.3333333333333, 252, 1253, 506.0, 1253.0, 1253.0, 1253.0, 0.018881699856499082, 0.022317530006168023, 0.0121083817439138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=971e4694-6ed8-41c7-82c6-c6c618272172", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.6103515625, 2.3292335304054057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 164.54999999999998, 130, 396, 138.5, 368.3000000000005, 395.8, 396.0, 0.08773045694408499, 0.06811104811576911, 0.031185435866842713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50f352fe-eac6-45fb-9f4c-40d19c09a5ec", 3, 0, 0.0, 303.6666666666667, 225, 449, 237.0, 449.0, 449.0, 449.0, 0.017818324364776737, 0.024563998595322094, 0.011426464517776748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 152.2, 132, 389, 134.0, 240.2000000000001, 389.0, 389.0, 0.09326386211870626, 0.06931035065657759, 0.04681408704005372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 184.86666666666667, 128, 399, 134.0, 387.6, 399.0, 399.0, 0.09326386211870626, 0.043632429243816606, 0.05214518540855789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81e08aa4-0cd6-4b45-bbad-14288f6c7fbc", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 370.6666666666667, 130, 1710, 139.0, 1623.6000000000001, 1710.0, 1710.0, 0.09326618168252192, 11.211262960113162, 0.05376163884225579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 286.3333333333333, 130, 1038, 134.0, 1030.8, 1038.0, 1038.0, 0.0932650218861918, 3.6781878761689217, 0.0538520494211351], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.62162162162162, 0.6130268199233716], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.22988505747126436], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.22988505747126436], "isController": false}, {"data": ["401/Unauthorized", 23, 62.16216216216216, 1.7624521072796935], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 37, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
