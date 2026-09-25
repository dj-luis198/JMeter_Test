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

    var data = {"OkPercent": 96.61683713611329, "KoPercent": 3.3831628638867035};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7279411764705882, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45044b73-11ec-4737-b869-1bd860d935f7"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad64898b-877a-42a8-91bc-a4dd5c451a58"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5afece6-43cb-44e8-adb2-f5bcb6b39ab2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ca3850b-2dd7-4d5d-9501-ad6d2874e0bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff29a524-7ef7-436a-ba2b-5de3006d5e7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f41c8926-f792-4f3e-be00-353a49eed292"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6eea64a8-3ab4-4f7a-9146-f8ea4c6f7ff1"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09d00ec2-3895-4a6a-b5c9-3a29f782b88b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcfbff4c-4b45-4770-87e3-013c88a19535"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c500ccd-13d1-40c5-ac69-bf5a7b51e0d5"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6041666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a826b98-b600-4eec-aa27-7845a7ef4f81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69431140-efed-4ba5-adbf-428279ca13c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad64898b-877a-42a8-91bc-a4dd5c451a58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/950384b3-077f-4c4e-bd8f-d0327b10d3d1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f41c8926-f792-4f3e-be00-353a49eed292"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.20588235294117646, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8eb92960-a1d2-425e-bc03-d471d9ee0ee5"], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6eea64a8-3ab4-4f7a-9146-f8ea4c6f7ff1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45044b73-11ec-4737-b869-1bd860d935f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=950384b3-077f-4c4e-bd8f-d0327b10d3d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff29a524-7ef7-436a-ba2b-5de3006d5e7d"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ca3850b-2dd7-4d5d-9501-ad6d2874e0bd"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c500ccd-13d1-40c5-ac69-bf5a7b51e0d5"], "isController": false}, {"data": [0.20588235294117646, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dcfbff4c-4b45-4770-87e3-013c88a19535"], "isController": false}, {"data": [0.9727272727272728, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09d00ec2-3895-4a6a-b5c9-3a29f782b88b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44545454545454544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8726114649681529, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8eb92960-a1d2-425e-bc03-d471d9ee0ee5"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69431140-efed-4ba5-adbf-428279ca13c4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5afece6-43cb-44e8-adb2-f5bcb6b39ab2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1283478d-b135-4f4c-989d-fc1b633b6f68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 43, 3.3831628638867035, 444.6907946498817, 110, 3403, 139.0, 1292.8, 1493.9999999999966, 2041.1999999999996, 4.972029886945977, 723.9485077309001, 3.6300481897664594], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2061.7636363636366, 1485, 3116, 1975.0, 2546.2, 2800.0, 3116.0, 0.24010023093276758, 288.9227157941752, 1.180570959713364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45044b73-11ec-4737-b869-1bd860d935f7", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 483.41176470588243, 119, 1088, 498.0, 936.7999999999998, 1088.0, 1088.0, 0.09936987806731433, 0.020624044660914904, 0.06642163954453524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 483.41176470588243, 119, 1088, 498.0, 936.7999999999998, 1088.0, 1088.0, 0.09830794675178978, 0.02040364267085343, 0.06571181459121243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad64898b-877a-42a8-91bc-a4dd5c451a58", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5afece6-43cb-44e8-adb2-f5bcb6b39ab2", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 153.63636363636363, 110, 370, 120.5, 364.1, 369.25, 370.0, 0.11310646917591655, 0.03798666307639314, 0.06407425246906281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 133.5, 110, 365, 123.0, 127.7, 329.4499999999995, 365.0, 0.11310123588805035, 0.08405277393633429, 0.05677151879536902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 191.81818181818184, 116, 970, 121.0, 368.3, 880.1499999999987, 970.0, 0.11310530618120498, 1.5407685987537854, 0.06616218593998222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ca3850b-2dd7-4d5d-9501-ad6d2874e0bd", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff29a524-7ef7-436a-ba2b-5de3006d5e7d", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f41c8926-f792-4f3e-be00-353a49eed292", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 188.00000000000003, 120, 1325, 122.0, 294.39999999999986, 1181.299999999998, 1325.0, 0.11310298026352995, 4.6550200452540444, 0.06605037323983487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6eea64a8-3ab4-4f7a-9146-f8ea4c6f7ff1", 3, 0, 0.0, 818.3333333333334, 238, 1774, 443.0, 1774.0, 1774.0, 1774.0, 0.0615447738229562, 0.02784740742640271, 0.03946718894245564], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 326.235294117647, 120, 1671, 232.0, 757.3999999999992, 1671.0, 1671.0, 0.09974828227590375, 0.1445742710307518, 0.06446278582283531], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09d00ec2-3895-4a6a-b5c9-3a29f782b88b", 3, 0, 0.0, 441.6666666666667, 338, 529, 458.0, 529.0, 529.0, 529.0, 0.041265474552957364, 0.026529724037138925, 0.026462560178817054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 137.81250000000003, 117, 366, 123.0, 198.70000000000016, 366.0, 366.0, 0.09527609225107632, 0.07080576777643466, 0.04782413224321605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 195.5625, 114, 381, 122.0, 374.0, 381.0, 381.0, 0.09528119863747886, 0.04338365123508254, 0.05333979210833472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 772.8888888888889, 592, 952, 720.0, 952.0, 952.0, 952.0, 0.08359184886593725, 24.57877907719243, 0.04767347630635484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1195.0, 910, 1531, 1243.0, 1531.0, 1531.0, 1531.0, 0.08330787814834356, 74.96057519750909, 0.04743016890672295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 231.22222222222226, 121, 378, 125.0, 378.0, 378.0, 378.0, 0.08405087879863278, 0.14873065662414314, 0.046539890897289826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 142.81818181818178, 116, 359, 122.0, 312.20000000000016, 359.0, 359.0, 0.050085144746068316, 0.03722147964038866, 0.025140394921366323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 196.0909090909091, 115, 486, 122.0, 460.80000000000007, 486.0, 486.0, 0.05008446061312486, 0.0134015060624963, 0.028563793943422774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 142.54545454545456, 118, 360, 120.0, 313.20000000000016, 360.0, 360.0, 0.050085144746068316, 0.013499511669838725, 0.029444587047981568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 164.00000000000003, 116, 368, 121.0, 366.0, 368.0, 368.0, 0.05008423257296362, 0.013499265810681602, 0.029492961173336975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 176.33333333333334, 120, 367, 125.0, 367.0, 367.0, 367.0, 0.08405009385593815, 0.062463009203485284, 0.047196097624184016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1025.3846153846152, 117, 1547, 1264.0, 1508.2, 1547.0, 1547.0, 0.058976976295792224, 40.8248890637405, 0.030773293070205283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 307.25, 116, 1418, 121.0, 1349.4, 1418.0, 1418.0, 0.09527779431906151, 10.738861151223723, 0.05498943011969273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcfbff4c-4b45-4770-87e3-013c88a19535", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 753.6153846153846, 118, 1100, 918.0, 1100.0, 1100.0, 1100.0, 0.058976976295792224, 13.343044686401269, 0.030830887773619142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 237.3125, 116, 951, 121.0, 924.4, 951.0, 951.0, 0.09527722695630944, 3.5243036946722164, 0.05508214683411639], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 418.8823529411765, 117, 915, 450.0, 734.9999999999999, 915.0, 915.0, 0.09845654880838618, 0.020434484768192745, 0.06622967523817798], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c500ccd-13d1-40c5-ac69-bf5a7b51e0d5", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.26183197463768115, 0.9992074275362319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 343.3636363636364, 241, 846, 246.0, 775.0000000000002, 846.0, 846.0, 0.05005688282138794, 0.07757839163822526, 0.11257910267349261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 830.9583333333333, 159, 2216, 588.5, 1745.5, 2175.0, 2216.0, 0.11002159173737847, 0.06758162226837017, 0.04974609079531858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 121.76923076923077, 116, 130, 121.0, 128.4, 130.0, 130.0, 0.058976976295792224, 0.043829569297947145, 0.029603677554723828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 232.69230769230774, 114, 380, 124.0, 378.4, 380.0, 380.0, 0.0589767087367189, 0.08391953251884987, 0.029825060337709708], "isController": false}, {"data": ["login", 24, 0, 0.0, 3441.8333333333335, 2014, 5878, 3425.5, 4653.5, 5643.75, 5878.0, 0.10818656773606083, 48.67982188800211, 0.23050394937319407], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a826b98-b600-4eec-aa27-7845a7ef4f81", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69431140-efed-4ba5-adbf-428279ca13c4", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 140.5625, 114, 376, 124.5, 207.30000000000018, 376.0, 376.0, 0.09196776529826296, 0.0744543724924414, 0.03269166657086691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad64898b-877a-42a8-91bc-a4dd5c451a58", 3, 0, 0.0, 484.0, 228, 878, 346.0, 878.0, 878.0, 878.0, 0.041249587504124954, 0.03438808385353647, 0.02645237219502805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/950384b3-077f-4c4e-bd8f-d0327b10d3d1", 3, 0, 0.0, 338.3333333333333, 239, 471, 305.0, 471.0, 471.0, 471.0, 0.06520605112154408, 0.042685341408016, 0.0418150783559381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f41c8926-f792-4f3e-be00-353a49eed292", 3, 0, 0.0, 1342.0, 569, 1786, 1671.0, 1786.0, 1786.0, 1786.0, 0.01699928602998674, 0.02343488813053185, 0.010901234856469362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1162.7692307692307, 244, 1667, 1384.0, 1629.8, 1667.0, 1667.0, 0.05894381747366798, 54.26515638956649, 0.12096500522559613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 356.90909090909093, 237, 1436, 248.0, 660.1999999999998, 1330.2499999999986, 1436.0, 0.11303150496311062, 6.313803996627037, 0.2528959506463347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 783.705882352941, 117, 1656, 1031.0, 1620.0, 1656.0, 1656.0, 0.14360776495632632, 90.9735722114751, 0.21621185154758485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8eb92960-a1d2-425e-bc03-d471d9ee0ee5", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.5425347222222222, 2.070429804804805], "isController": false}, {"data": ["register", 27, 11, 40.74074074074074, 1095.8888888888885, 353, 1975, 1105.0, 1796.0, 1925.7999999999997, 1975.0, 0.10969545292033672, 0.033994163795625185, 0.049491503173042545], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 170.14285714285714, 123, 448, 130.0, 408.5, 448.0, 448.0, 0.06858005006343655, 0.053243300586359434, 0.02437806467098721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 522.8125000000001, 239, 1687, 470.0, 1584.1000000000001, 1687.0, 1687.0, 0.0952069263038886, 14.366681015887655, 0.21107766058730773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6eea64a8-3ab4-4f7a-9146-f8ea4c6f7ff1", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.3093562714041096, 1.180570419520548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 360.6666666666667, 238, 743, 250.0, 729.8, 743.0, 743.0, 0.0737300007373, 0.114267100752046, 0.16582049970508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 162.83333333333334, 119, 368, 123.0, 368.0, 368.0, 368.0, 0.03405936547402122, 0.025311696411845847, 0.017096204935202055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 160.16666666666669, 121, 350, 122.0, 350.0, 350.0, 350.0, 0.034059752158536793, 0.009113644620545978, 0.019424702402915515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 160.0, 117, 356, 122.0, 356.0, 356.0, 356.0, 0.0340605255539093, 0.009180376028202115, 0.020023863655716206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 122.66666666666667, 120, 128, 122.0, 128.0, 128.0, 128.0, 0.034059752158536793, 0.00918016757398062, 0.020056670460544615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 184.75, 117, 368, 127.0, 368.0, 368.0, 368.0, 0.13473911139556036, 0.039737511368612526, 0.08329087647791962], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1459.9818181818177, 942, 2625, 1390.0, 2042.1999999999998, 2262.9999999999995, 2625.0, 0.23390121713687897, 279.82717291572754, 0.4618635361823919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 11, 40.74074074074074, 1095.8888888888885, 353, 1975, 1105.0, 1796.0, 1925.7999999999997, 1975.0, 0.1098892153910021, 0.03405420997794076, 0.04957892335023728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 125.0, 119, 134, 122.0, 134.0, 134.0, 134.0, 0.048191738865031, 0.012989179615965388, 0.028378533726185252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45044b73-11ec-4737-b869-1bd860d935f7", 3, 0, 0.0, 382.3333333333333, 278, 548, 321.0, 548.0, 548.0, 548.0, 0.021362804508975937, 0.025625629757674587, 0.013699454714414907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 173.99999999999997, 116, 366, 125.0, 366.0, 366.0, 366.0, 0.04819251302536533, 0.012989388276367997, 0.028331926602802662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=950384b3-077f-4c4e-bd8f-d0327b10d3d1", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 191.07142857142856, 117, 373, 122.0, 372.5, 373.0, 373.0, 0.06974716652136007, 0.018799040976460332, 0.04100370531822145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 162.92857142857142, 116, 481, 120.5, 420.0, 481.0, 481.0, 0.0698351889540684, 0.018822765772776247, 0.041123651307913324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 139.35714285714286, 118, 360, 122.5, 244.5, 360.0, 360.0, 0.06983135727218767, 0.0518961551602879, 0.035052068005766074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 148.77777777777777, 117, 362, 122.0, 362.0, 362.0, 362.0, 0.048192771084337345, 0.012895331325301206, 0.027484939759036143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 154.78571428571428, 113, 371, 121.0, 366.5, 371.0, 371.0, 0.06974751399932246, 0.018662909019349954, 0.03977787907773859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 151.44444444444446, 119, 371, 124.0, 371.0, 371.0, 371.0, 0.0481919969157122, 0.03581456020786815, 0.0241901234518321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 179.11111111111111, 122, 359, 130.0, 359.0, 359.0, 359.0, 0.04555923966691134, 0.03586010465969779, 0.01619488597534739], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 456.05882352941177, 117, 878, 471.0, 826.8, 878.0, 878.0, 0.10108397700042217, 0.020329446431438306, 0.06878100342198994], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ff29a524-7ef7-436a-ba2b-5de3006d5e7d", 3, 0, 0.0, 409.66666666666663, 258, 682, 289.0, 682.0, 682.0, 682.0, 0.03391746749576032, 0.028275597088750704, 0.021750459299039005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1599.7499999999998, 924, 2526, 1576.5, 2219.0, 2494.75, 2526.0, 0.1120401103595087, 0.05798951024466759, 0.05153407419856308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ca3850b-2dd7-4d5d-9501-ad6d2874e0bd", 3, 0, 0.0, 1022.3333333333333, 221, 2398, 448.0, 2398.0, 2398.0, 2398.0, 0.08489685032685287, 0.03841361391742366, 0.05444231612757166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 331.4444444444444, 242, 734, 257.0, 734.0, 734.0, 734.0, 0.048160535117056855, 0.07463942307692308, 0.10831417224080267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c500ccd-13d1-40c5-ac69-bf5a7b51e0d5", 3, 0, 0.0, 328.0, 247, 482, 255.0, 482.0, 482.0, 482.0, 0.027687025859682152, 0.023081534253465492, 0.01775502634881961], "isController": false}, {"data": ["addBook", 51, 16, 31.372549019607842, 1261.1568627450984, 617, 4269, 1006.0, 2268.4, 2444.4, 4269.0, 0.24905748832848243, 77.03042801109282, 0.9028477022615397], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dcfbff4c-4b45-4770-87e3-013c88a19535", 3, 0, 0.0, 1067.3333333333333, 213, 2175, 814.0, 2175.0, 2175.0, 2175.0, 0.02126422931344892, 0.025133599165733406, 0.013636240803220822], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 236.9636363636364, 117, 790, 125.0, 490.6, 510.3999999999998, 790.0, 0.2352065755205549, 0.17479707419056864, 0.113698491096362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09d00ec2-3895-4a6a-b5c9-3a29f782b88b", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 767.7999999999998, 572, 1259, 716.0, 1007.0, 1090.0, 1259.0, 0.2350417305908949, 69.11007291368414, 0.11820946411553797], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 209.16363636363636, 113, 495, 125.0, 368.0, 395.7999999999996, 495.0, 0.23591886106952742, 0.4174657971269372, 0.11473397735607876], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1216.3818181818176, 814, 1809, 1210.0, 1542.0, 1769.1999999999998, 1809.0, 0.23472675671638607, 211.20754829903123, 0.11782182905490472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 159.66666666666666, 124, 366, 127.0, 363.6, 366.0, 366.0, 0.0731097474789322, 0.05461812189588197, 0.025988230549151684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 157, 16, 10.19108280254777, 198.38853503184703, 115, 3403, 128.0, 338.0, 499.69999999999993, 1828.879999999966, 0.649662341101695, 1.563710681462692, 0.3060405537233514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 124.16666666666667, 121, 126, 124.5, 126.0, 126.0, 126.0, 0.03349503994283513, 0.025939029955730723, 0.011906439979679675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 128.6818181818182, 123, 144, 126.5, 141.8, 143.85, 144.0, 0.11864123430025938, 0.09628014228858942, 0.04217325125517033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8eb92960-a1d2-425e-bc03-d471d9ee0ee5", 3, 0, 0.0, 303.6666666666667, 209, 471, 231.0, 471.0, 471.0, 471.0, 0.0809301572742723, 0.03756718889098708, 0.05189857090830613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 326.0, 244, 725, 247.0, 725.0, 725.0, 725.0, 0.03403579431034971, 0.052748833564965826, 0.07654729911790567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 358.21428571428567, 242, 733, 249.0, 669.5, 733.0, 733.0, 0.06970167682319672, 0.10802398546720038, 0.15676070480841997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69431140-efed-4ba5-adbf-428279ca13c4", 3, 0, 0.0, 464.6666666666667, 232, 668, 494.0, 668.0, 668.0, 668.0, 0.07183908045977011, 0.032505313098659006, 0.046068681154214565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5afece6-43cb-44e8-adb2-f5bcb6b39ab2", 3, 0, 0.0, 451.6666666666667, 359, 512, 484.0, 512.0, 512.0, 512.0, 0.04938759383642829, 0.03175146413637561, 0.031671080682865796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1283478d-b135-4f4c-989d-fc1b633b6f68", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.6942085597826086, 1.2971297554347825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 150.63636363636363, 123, 362, 129.0, 318.8000000000002, 362.0, 362.0, 0.0521294896522963, 0.04322064132304645, 0.0185304045248397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 148.07692307692307, 122, 357, 127.0, 274.99999999999994, 357.0, 357.0, 0.05996144018154479, 0.04655209467219542, 0.021314418189533498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 155.86666666666665, 116, 384, 124.0, 365.40000000000003, 384.0, 384.0, 0.07386833707599574, 0.05489629347151637, 0.03707844263384943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 168.13333333333335, 114, 359, 121.0, 359.0, 359.0, 359.0, 0.07386979217965134, 0.019765940485570767, 0.042128865852457405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 185.66666666666666, 115, 380, 122.0, 371.0, 380.0, 380.0, 0.07377569238487303, 0.01988485458811031, 0.04337203790595075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 153.86666666666665, 117, 367, 123.0, 358.0, 367.0, 367.0, 0.07378585377611405, 0.019887593400593238, 0.04345006819042653], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 25.58139534883721, 0.8654602675059009], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.30232558139535, 0.3147128245476003], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.30232558139535, 0.3147128245476003], "isController": false}, {"data": ["401/Unauthorized", 24, 55.81395348837209, 1.8882769472856018], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 43, "401/Unauthorized", 24, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 157, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
