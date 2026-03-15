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

    var data = {"OkPercent": 98.20761762509335, "KoPercent": 1.7923823749066468};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8276854219948849, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c89151f-06ec-4497-ab30-606d2c8bc180"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a51c53e-9b81-4356-9dcd-8bd4d4a3dd9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ae03939-49f2-4af6-aba7-ab531c432022"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d829645-e9c1-4ecc-88ef-76f8b745860f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb1af55d-14ec-455b-8d5c-a597d6114ec4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a85c844f-62b3-4c8c-892d-9ce307ecc1e1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3011516e-bfc7-4aba-94b1-a1803a87dcb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48d887ad-5b33-4f9b-a3d2-dd1893bcadff"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb0e8e05-b3d4-431f-864d-bc38ff1d13bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30d69251-6cfc-46c2-83ba-105583db9298"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3bae9d8-3355-4888-ae94-dc5a26d1efc0"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=475d5f54-81ea-4b04-9aa4-bf7362490de8"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c706e9df-a544-4b8c-b2ea-41c941076243"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89c166e9-2f25-4090-8bce-d3f9c79065b0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9678974-bbf2-4ced-9244-0cd644b735db"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b5e3874-bb0f-47eb-b3a4-465633119c5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3011516e-bfc7-4aba-94b1-a1803a87dcb3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ae03939-49f2-4af6-aba7-ab531c432022"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6a51c53e-9b81-4356-9dcd-8bd4d4a3dd9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a85c844f-62b3-4c8c-892d-9ce307ecc1e1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3bae9d8-3355-4888-ae94-dc5a26d1efc0"], "isController": false}, {"data": [0.4112903225806452, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d829645-e9c1-4ecc-88ef-76f8b745860f"], "isController": false}, {"data": [0.8482142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9472222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb1af55d-14ec-455b-8d5c-a597d6114ec4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb0e8e05-b3d4-431f-864d-bc38ff1d13bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38992769-1aff-4e8d-82a1-011b97044421"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30d69251-6cfc-46c2-83ba-105583db9298"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/475d5f54-81ea-4b04-9aa4-bf7362490de8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c706e9df-a544-4b8c-b2ea-41c941076243"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b5e3874-bb0f-47eb-b3a4-465633119c5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89c166e9-2f25-4090-8bce-d3f9c79065b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1339, 24, 1.7923823749066468, 270.79536967886486, 80, 2195, 97.0, 666.0, 837.0, 1252.3999999999965, 5.345202690565059, 738.9351205876629, 3.9001646361849067], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1c89151f-06ec-4497-ab30-606d2c8bc180", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.730745852402746, 1.365399742562929], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1218.9821428571427, 993, 1603, 1177.0, 1431.1000000000001, 1466.35, 1603.0, 0.24931771535930689, 300.013744995559, 1.2258932586270608], "isController": true}, {"data": ["deleteBook", 16, 3, 18.75, 492.75, 86, 1496, 405.5, 1256.6000000000004, 1496.0, 1496.0, 0.10258185711629578, 0.020730501032229936, 0.06880322435613856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 492.75, 86, 1496, 405.5, 1256.6000000000004, 1496.0, 1496.0, 0.10015335983224312, 0.020239732324496888, 0.0671743939939282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 126.87500000000001, 81, 286, 84.0, 261.5, 286.0, 286.0, 0.11152545917122643, 0.05078002474471125, 0.06243356393545464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 84.37499999999999, 81, 89, 84.0, 87.6, 89.0, 89.0, 0.11152701393390631, 0.08288286875361592, 0.05598133316604281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 124.0625, 81, 407, 84.0, 405.6, 407.0, 407.0, 0.11152779133150242, 4.125411912213687, 0.06447700436352484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 207.8125, 81, 772, 84.5, 746.8000000000001, 772.0, 772.0, 0.11152701393390631, 12.570327911203586, 0.06436764183099475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a51c53e-9b81-4356-9dcd-8bd4d4a3dd9e", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ae03939-49f2-4af6-aba7-ab531c432022", 3, 0, 0.0, 236.33333333333331, 161, 385, 163.0, 385.0, 385.0, 385.0, 0.027481587336484557, 0.027562099799384412, 0.01762328354585761], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 174.1875, 83, 256, 174.5, 253.9, 256.0, 256.0, 0.1015041648427637, 0.19184435843023812, 0.06560227060058746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d829645-e9c1-4ecc-88ef-76f8b745860f", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 92.94999999999996, 82, 248, 84.0, 90.80000000000001, 240.1499999999999, 248.0, 0.09508414947228297, 0.07066312280117905, 0.047727785965579535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 92.04999999999998, 81, 251, 83.0, 88.7, 242.8999999999999, 251.0, 0.09508460152420617, 0.025442559392219226, 0.054227936806773826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 507.4, 408, 587, 565.0, 587.0, 587.0, 587.0, 0.0894518391298125, 26.301810784760985, 0.051015502003721194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 645.2, 579, 754, 586.0, 754.0, 754.0, 754.0, 0.08942944017170452, 80.46876746668754, 0.05091539416025756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 214.0, 84, 249, 245.0, 249.0, 249.0, 249.0, 0.08996203602079922, 0.15919063405242986, 0.04981296330448551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 104.27777777777777, 82, 250, 86.5, 248.2, 250.0, 250.0, 0.0784741144414169, 0.0583191416893733, 0.03939032697547684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 138.5, 82, 249, 86.0, 248.1, 249.0, 249.0, 0.07842112142203633, 0.02752737931860759, 0.044358648651592385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 169.99999999999997, 83, 747, 84.5, 302.4000000000007, 747.0, 747.0, 0.07847650936486344, 3.9429379384329986, 0.045760933303686656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 142.44444444444446, 80, 404, 85.5, 266.30000000000024, 404.0, 404.0, 0.07841941316139152, 1.3009573022632714, 0.045804221033829265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 122.6, 86, 253, 90.0, 253.0, 253.0, 253.0, 0.08995394358088658, 0.06685053814946747, 0.050511247616220493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 100.50000000000001, 82, 247, 84.5, 229.30000000000032, 246.9, 247.0, 0.0950850535804277, 0.02562839334784965, 0.05589961157755612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 449.75, 82, 746, 564.5, 745.3, 746.0, 746.0, 0.08547145520494452, 48.07574248318616, 0.045657115231547515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 109.10000000000001, 82, 253, 84.5, 249.70000000000002, 252.85, 253.0, 0.09508460152420617, 0.02562827150457119, 0.0559922018741175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 396.81250000000006, 81, 667, 495.0, 663.5, 667.0, 667.0, 0.08547282498370674, 15.716044417823221, 0.04574131649518681], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 456.40000000000003, 85, 1158, 417.0, 1042.8000000000002, 1158.0, 1158.0, 0.09538586762985196, 0.018685942428269826, 0.06485742197436029], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb1af55d-14ec-455b-8d5c-a597d6114ec4", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a85c844f-62b3-4c8c-892d-9ce307ecc1e1", 1, 0, 0.0, 966.0, 966, 966, 966.0, 966.0, 966.0, 966.0, 1.0351966873706004, 0.18702283902691513, 0.7137195910973085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3011516e-bfc7-4aba-94b1-a1803a87dcb3", 3, 0, 0.0, 415.6666666666667, 256, 635, 356.0, 635.0, 635.0, 635.0, 0.048259442764300886, 0.031026171699054115, 0.030947624428929926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48d887ad-5b33-4f9b-a3d2-dd1893bcadff", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 299.5555555555556, 168, 836, 257.5, 533.6000000000005, 836.0, 836.0, 0.07838867719107241, 5.324743977953185, 0.17518372346216657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb0e8e05-b3d4-431f-864d-bc38ff1d13bf", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30d69251-6cfc-46c2-83ba-105583db9298", 3, 0, 0.0, 230.33333333333334, 168, 346, 177.0, 346.0, 346.0, 346.0, 0.02818833566670112, 0.028270918681349656, 0.01807650431751341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3bae9d8-3355-4888-ae94-dc5a26d1efc0", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 456.1363636363636, 134, 1644, 373.5, 904.0999999999999, 1538.5499999999984, 1644.0, 0.09571751151873235, 0.05879522924344009, 0.043278523274583085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 95.1875, 82, 248, 84.0, 140.2000000000001, 248.0, 248.0, 0.08547145520494452, 0.06351931387789334, 0.04290266403841942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 155.9375, 82, 252, 85.5, 252.0, 252.0, 252.0, 0.08547191179298703, 0.10310466703348362, 0.0442592590119447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=475d5f54-81ea-4b04-9aa4-bf7362490de8", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["login", 22, 0, 0.0, 2079.0, 1285, 3589, 1977.5, 2973.1, 3498.549999999999, 3589.0, 0.09693936002397047, 26.49118020503776, 0.1827940347042909], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c706e9df-a544-4b8c-b2ea-41c941076243", 3, 0, 0.0, 327.0, 197, 583, 201.0, 583.0, 583.0, 583.0, 0.040058217943411085, 0.02575357436140524, 0.025688375438971303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 89.55000000000001, 83, 104, 88.0, 102.20000000000002, 103.95, 104.0, 0.09127002236115547, 0.07388950052480263, 0.03244364076119199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 563.3749999999999, 168, 830, 660.5, 829.3, 830.0, 830.0, 0.08543266304289789, 63.92913035222285, 0.178478344154804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89c166e9-2f25-4090-8bce-d3f9c79065b0", 3, 0, 0.0, 344.0, 193, 594, 245.0, 594.0, 594.0, 594.0, 0.01967819590299961, 0.02712798165664172, 0.012619155575816809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 314.5, 166, 861, 250.0, 830.9, 861.0, 861.0, 0.11146097472622397, 16.819409383098336, 0.24711355260958007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 464.3333333333333, 83, 980, 665.0, 980.0, 980.0, 980.0, 0.1004576403616475, 66.77987045150128, 0.15504660118316776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9678974-bbf2-4ced-9244-0cd644b735db", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 850.9166666666666, 319, 1615, 883.5, 1391.5, 1576.75, 1615.0, 0.10103518971461768, 0.03172149755200155, 0.045584235984524775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b5e3874-bb0f-47eb-b3a4-465633119c5e", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 220.25000000000003, 168, 499, 171.0, 337.7, 490.9499999999999, 499.0, 0.09504528908024674, 0.14730163454135897, 0.21375908276543773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 87.00000000000001, 83, 91, 87.0, 91.0, 91.0, 91.0, 0.10435811065438333, 0.08102021286155738, 0.037096047146675325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3011516e-bfc7-4aba-94b1-a1803a87dcb3", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 272.05882352941177, 169, 659, 184.0, 472.59999999999985, 659.0, 659.0, 0.11102475852115021, 7.975133923614966, 0.2480263002142125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 104.44444444444444, 83, 256, 85.0, 256.0, 256.0, 256.0, 0.04548762736535662, 0.0338047699463246, 0.022832656704876275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 120.44444444444444, 82, 253, 85.0, 253.0, 253.0, 253.0, 0.04545087265675501, 0.012161659285108274, 0.02592120081205559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 102.0, 80, 251, 83.0, 251.0, 251.0, 251.0, 0.04548877690787512, 0.012260646900950715, 0.02674242548685627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 137.66666666666666, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.04545064312660024, 0.012250368655216472, 0.026764392388027292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 85, 87, 86.0, 87.0, 87.0, 87.0, 0.061703637429426465, 0.018197752445006633, 0.038142971184401325], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 798.7678571428572, 647, 1229, 675.5, 1073.5, 1102.8, 1229.0, 0.2549452550590699, 305.0031583619767, 0.5034172907514056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 850.9166666666666, 319, 1615, 883.5, 1391.5, 1576.75, 1615.0, 0.10040370657016755, 0.0315232340452235, 0.04529932855021231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 82.5, 80, 84, 83.0, 84.0, 84.0, 84.0, 0.02179076507376174, 0.005873292148787344, 0.012831866542459306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 83.5, 83, 84, 83.5, 84.0, 84.0, 84.0, 0.02179076507376174, 0.005873292148787344, 0.01281058649844196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 147.33333333333337, 82, 579, 84.0, 570.9, 579.0, 579.0, 0.10405466338316395, 10.428104098742095, 0.06017918357554947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 158.7222222222222, 81, 582, 84.0, 575.7, 582.0, 582.0, 0.10405646797662198, 3.424492038234971, 0.06028184489227265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 83.25, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.02179088378376906, 0.005830763824953831, 0.012427613407930792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 84.55555555555556, 82, 90, 84.5, 86.4, 90.0, 90.0, 0.1040552649073619, 0.07733013339306875, 0.052230865392953144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 83.75, 82, 86, 83.5, 86.0, 86.0, 86.0, 0.02179052765762723, 0.01619393705806086, 0.010937823453144918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 110.16666666666667, 82, 247, 83.0, 246.1, 247.0, 247.0, 0.10405586643851454, 0.04520829961152476, 0.05837335389400176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ae03939-49f2-4af6-aba7-ab531c432022", 1, 0, 0.0, 1158.0, 1158, 1158, 1158.0, 1158.0, 1158.0, 1158.0, 0.8635578583765112, 0.15601387089810018, 0.5953826640759932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a51c53e-9b81-4356-9dcd-8bd4d4a3dd9e", 3, 0, 0.0, 906.3333333333333, 165, 2195, 359.0, 2195.0, 2195.0, 2195.0, 0.021409455842997322, 0.025305252007136486, 0.013729371097234612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 126.75, 84, 251, 86.0, 251.0, 251.0, 251.0, 0.020814686843036445, 0.01638343515184314, 0.007398970713735612], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 464.2142857142858, 87, 990, 401.0, 792.0, 990.0, 990.0, 0.10582330531535344, 0.01977543491488783, 0.07202273925515511], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1164.727272727273, 755, 1957, 1087.0, 1675.6999999999998, 1924.2999999999995, 1957.0, 0.09745984211505578, 0.0504430823447066, 0.044827720347843034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 168.75, 166, 172, 168.5, 172.0, 172.0, 172.0, 0.021780679448295388, 0.03375579910590311, 0.0489852585638909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a85c844f-62b3-4c8c-892d-9ce307ecc1e1", 3, 0, 0.0, 319.3333333333333, 171, 549, 238.0, 549.0, 549.0, 549.0, 0.023666958559155564, 0.02797354379176232, 0.015177053503104316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3bae9d8-3355-4888-ae94-dc5a26d1efc0", 3, 0, 0.0, 310.0, 170, 587, 173.0, 587.0, 587.0, 587.0, 0.04444905397596788, 0.0370553474063977, 0.028504113389536696], "isController": false}, {"data": ["addBook", 62, 8, 12.903225806451612, 819.0967741935484, 453, 1877, 706.5, 1283.6000000000004, 1590.8499999999992, 1877.0, 0.29084768025519536, 90.93434634036215, 1.0573876263662805], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 151.28571428571428, 83, 346, 86.0, 336.90000000000003, 342.3, 346.0, 0.25560972047251285, 0.18995995828084206, 0.12356133948622446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d829645-e9c1-4ecc-88ef-76f8b745860f", 3, 0, 0.0, 254.66666666666669, 185, 387, 192.0, 387.0, 387.0, 387.0, 0.1173112266843937, 0.05308027509482657, 0.07522887909122902], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 463.7321428571428, 399, 663, 414.5, 577.0, 591.4499999999999, 663.0, 0.25557472365983, 75.14745463548655, 0.12853611590313718], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 136.80357142857144, 82, 351, 87.0, 252.0, 326.74999999999994, 351.0, 0.2559508574353724, 0.4529130406961863, 0.12447610058868697], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 644.3571428571429, 560, 852, 585.5, 814.6, 820.0, 852.0, 0.25538357701182973, 229.79459151168837, 0.1281905845547661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 101.29411764705883, 84, 267, 88.0, 144.59999999999988, 267.0, 267.0, 0.11031224855296286, 0.08241100599903964, 0.03921255710281101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, 4.444444444444445, 147.8111111111112, 83, 1268, 90.5, 261.9, 331.9, 943.9999999999991, 0.7437063847193128, 1.5825912086158385, 0.3592119591601902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 88.22222222222223, 84, 97, 88.0, 97.0, 97.0, 97.0, 0.04771346473974956, 0.03694997806505996, 0.01696064566920785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb1af55d-14ec-455b-8d5c-a597d6114ec4", 3, 0, 0.0, 290.0, 178, 510, 182.0, 510.0, 510.0, 510.0, 0.031517239930241844, 0.025618016961527955, 0.020211250866724095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 109.25, 85, 264, 87.5, 259.1, 264.0, 264.0, 0.10707354614200629, 0.0868926922304758, 0.0380612996051663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 263.0, 169, 510, 178.0, 510.0, 510.0, 510.0, 0.04543091220223823, 0.07040904068842975, 0.10217518632983852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb0e8e05-b3d4-431f-864d-bc38ff1d13bf", 3, 0, 0.0, 294.6666666666667, 253, 351, 280.0, 351.0, 351.0, 351.0, 0.03708098487095818, 0.030912891358894495, 0.02377914719914961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38992769-1aff-4e8d-82a1-011b97044421", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 261.72222222222223, 167, 666, 170.5, 666.0, 666.0, 666.0, 0.10400416016640665, 13.968291370543712, 0.23095107832091064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30d69251-6cfc-46c2-83ba-105583db9298", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/475d5f54-81ea-4b04-9aa4-bf7362490de8", 3, 0, 0.0, 470.0, 192, 990, 228.0, 990.0, 990.0, 990.0, 0.027073613154166176, 0.027152930380203773, 0.017361659477118284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 98.94444444444446, 85, 247, 88.5, 112.9000000000002, 247.0, 247.0, 0.08052142093467475, 0.06676043591165905, 0.028622848847872667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c706e9df-a544-4b8c-b2ea-41c941076243", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 98.74999999999999, 85, 253, 87.0, 142.40000000000012, 253.0, 253.0, 0.08232866632706091, 0.06391727512696624, 0.02926526810844744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b5e3874-bb0f-47eb-b3a4-465633119c5e", 3, 0, 0.0, 348.6666666666667, 176, 455, 415.0, 455.0, 455.0, 455.0, 0.031265958666402645, 0.03156111257308418, 0.020050110212504302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89c166e9-2f25-4090-8bce-d3f9c79065b0", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 85.29411764705883, 82, 99, 84.0, 89.39999999999999, 99.0, 99.0, 0.11108642523883581, 0.08255543906909577, 0.05576017829371251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 141.35294117647058, 83, 250, 85.0, 247.6, 250.0, 250.0, 0.11108715113733639, 0.03953906183633596, 0.06280559176778865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 150.82352941176467, 83, 568, 84.0, 314.39999999999975, 568.0, 568.0, 0.11108787704532386, 5.908007853341131, 0.06474595591118197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 156.2941176470588, 82, 576, 84.0, 387.99999999999983, 576.0, 576.0, 0.11108860296279839, 1.9495769035358848, 0.06485486396547105], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5227781926811053], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.22404779686333084], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07468259895444361], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 0.970873786407767], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1339, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
