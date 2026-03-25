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

    var data = {"OkPercent": 98.61431870669746, "KoPercent": 1.3856812933025404};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.761604774535809, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8f637b7-7244-4bc3-b54f-e4833cfcd4b0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=930e2590-fc04-43c7-af34-a48ac0ff5004"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d841b01a-11f4-451e-bc9d-3a497b952584"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c588e719-f012-469d-af58-b4b881e36316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c588e719-f012-469d-af58-b4b881e36316"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d425b1fe-86b5-446a-94b8-9103b58b97f5"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=909c90c5-4e4d-4e1d-9572-a8df1d18348a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a78b896-68be-4618-bf33-50c0a54fee8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfb6b18e-1ceb-4240-8776-26164001a8f7"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fd4101a-fde5-47af-b77d-75ce2a79dbb6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a82b837-11d9-4d72-815c-f676ba66fec6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd444a1e-3717-4a38-ad7e-1f7c9f4ed6d3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d3b5f1c-4cc8-4318-bf24-126ac2eef3cb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1c66e2d-8cd3-45c1-8f92-6e06221855d6"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/930e2590-fc04-43c7-af34-a48ac0ff5004"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55604e41-5a78-4ed3-8abb-05ea6ee2bd7a"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d841b01a-11f4-451e-bc9d-3a497b952584"], "isController": false}, {"data": [0.32786885245901637, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96045197740113, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fd4101a-fde5-47af-b77d-75ce2a79dbb6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a78b896-68be-4618-bf33-50c0a54fee8d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6e781df-8c41-46ea-8be7-72feb8bc2844"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f6048b2-c30c-46f1-96b6-602305b57596"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55604e41-5a78-4ed3-8abb-05ea6ee2bd7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7227fac9-4f9b-4ce3-ac7e-fd3c5896dc39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a82b837-11d9-4d72-815c-f676ba66fec6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/909c90c5-4e4d-4e1d-9572-a8df1d18348a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1c66e2d-8cd3-45c1-8f92-6e06221855d6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d3b5f1c-4cc8-4318-bf24-126ac2eef3cb"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfb6b18e-1ceb-4240-8776-26164001a8f7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 18, 1.3856812933025404, 419.0492686682066, 2, 2857, 152.0, 1087.0, 1282.0, 1775.0, 5.02847144532747, 697.9241277293199, 3.6667714365692583], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2001.8545454545451, 1563, 2518, 1991.0, 2380.4, 2432.0, 2518.0, 0.24864038914481268, 299.1978583798027, 1.2225628509220037], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e8f637b7-7244-4bc3-b54f-e4833cfcd4b0", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 718.0769230769231, 146, 1872, 712.0, 1528.7999999999997, 1872.0, 1872.0, 0.062380038387715935, 0.012366355266314778, 0.04193970429462572], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 718.0769230769231, 146, 1872, 712.0, 1528.7999999999997, 1872.0, 1872.0, 0.06335992825706585, 0.012560610777523797, 0.042598509457687755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 211.1764705882353, 129, 410, 139.0, 398.8, 410.0, 410.0, 0.08579012707031762, 0.030535134841893845, 0.04850335653872163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 190.23529411764704, 131, 501, 139.0, 439.3999999999999, 501.0, 501.0, 0.0857883953532968, 0.06375485240611217, 0.04306175313632281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 243.88235294117646, 126, 1019, 139.0, 622.1999999999996, 1019.0, 1019.0, 0.08578666370618572, 1.5055342648335235, 0.05008328718094931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 261.35294117647055, 132, 892, 140.0, 510.39999999999964, 892.0, 892.0, 0.08567425639785109, 4.556430396281233, 0.04993399617489644], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 275.92307692307696, 141, 504, 235.0, 501.2, 504.0, 504.0, 0.0623175414291809, 0.14100092757263588, 0.040277954210988016], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 136.44444444444446, 127, 143, 137.0, 143.0, 143.0, 143.0, 0.08776634648203227, 0.06522479460236968, 0.04405459188648886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 180.16666666666669, 131, 410, 137.5, 396.5, 410.0, 410.0, 0.08776720237166485, 0.023484583447105634, 0.05005473260259011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 1, 25.0, 628.25, 2, 946, 782.5, 946.0, 946.0, 946.0, 0.02425271327229734, 5.359737132798763, 0.010373719153580306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1169.5, 941, 1265, 1236.0, 1265.0, 1265.0, 1265.0, 0.024252272134745623, 21.822237097791227, 0.013807690092340527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 204.25, 138, 398, 140.5, 398.0, 398.0, 398.0, 0.024332380315104325, 0.04305690735446195, 0.013473105115882962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=930e2590-fc04-43c7-af34-a48ac0ff5004", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 140.33333333333331, 135, 158, 139.5, 145.40000000000003, 158.0, 158.0, 0.08398499468095033, 0.06241462983613594, 0.042156530533211396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d841b01a-11f4-451e-bc9d-3a497b952584", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 184.44444444444446, 130, 419, 139.0, 414.5, 419.0, 419.0, 0.08387776214130607, 0.029442769154418957, 0.0474451794751116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 226.9444444444444, 127, 1223, 136.0, 494.9000000000011, 1223.0, 1223.0, 0.08398617027729434, 4.219762828012654, 0.048973706496330274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 265.55555555555554, 135, 967, 140.0, 925.6, 967.0, 967.0, 0.08382034506042049, 2.7585224626883047, 0.04855868297282824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c588e719-f012-469d-af58-b4b881e36316", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 139.25, 137, 141, 139.5, 141.0, 141.0, 141.0, 0.02437062851850949, 0.01811137529549387, 0.013684679099748982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 197.55555555555557, 127, 417, 139.0, 417.0, 417.0, 417.0, 0.08776420683098077, 0.023655196372412785, 0.051595754406494554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 771.6470588235295, 131, 1391, 951.0, 1351.0, 1391.0, 1391.0, 0.088258503966441, 46.72459347549009, 0.04742474989097479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 167.05555555555557, 126, 419, 136.5, 417.2, 419.0, 419.0, 0.08776763032274108, 0.023656119110426307, 0.05168347762169226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 566.5882352941177, 128, 1139, 704.0, 1091.0, 1139.0, 1139.0, 0.08825712935899366, 15.274810636541567, 0.04751019986346103], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 555.25, 152, 1193, 501.0, 1076.3000000000004, 1193.0, 1193.0, 0.0643390237625461, 0.012236352419683452, 0.043976518602020245], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c588e719-f012-469d-af58-b4b881e36316", 3, 0, 0.0, 1403.0, 373, 2857, 979.0, 2857.0, 2857.0, 2857.0, 0.07888509071785434, 0.03569344925059164, 0.05058711872206153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 469.05555555555554, 275, 1364, 285.5, 1108.4000000000003, 1364.0, 1364.0, 0.0837665148010778, 7.057133453146596, 0.1868022365659452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d425b1fe-86b5-446a-94b8-9103b58b97f5", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.5980073735955056, 1.1173776919475655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 659.2857142857142, 170, 1963, 522.0, 1416.6000000000001, 1912.8999999999992, 1963.0, 0.08971138565643103, 0.0551059195096632, 0.0405628628505152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 142.29411764705884, 131, 171, 141.0, 161.39999999999998, 171.0, 171.0, 0.088251631357362, 0.06558544088178954, 0.04429818214617585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 274.6470588235294, 130, 534, 153.0, 445.19999999999993, 534.0, 534.0, 0.08825529661566894, 0.10158890358368419, 0.04597306007070807], "isController": false}, {"data": ["login", 21, 1, 4.761904761904762, 2576.666666666667, 1700, 4071, 2395.0, 3801.2, 4044.3999999999996, 4071.0, 0.08790951180917775, 18.931675569685034, 0.1580155487332658], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 142.38888888888889, 132, 149, 143.0, 149.0, 149.0, 149.0, 0.08786574114752659, 0.0711334955188472, 0.031233525173534837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=909c90c5-4e4d-4e1d-9572-a8df1d18348a", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a78b896-68be-4618-bf33-50c0a54fee8d", 3, 0, 0.0, 343.6666666666667, 243, 448, 340.0, 448.0, 448.0, 448.0, 0.02082827090637692, 0.02461831108758288, 0.013356671121602388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfb6b18e-1ceb-4240-8776-26164001a8f7", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 937.6470588235296, 275, 1535, 1275.0, 1491.0, 1535.0, 1535.0, 0.08818159183334717, 62.112650403106585, 0.18505065092279444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fd4101a-fde5-47af-b77d-75ce2a79dbb6", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a82b837-11d9-4d72-815c-f676ba66fec6", 3, 0, 0.0, 391.3333333333333, 274, 595, 305.0, 595.0, 595.0, 595.0, 0.021662213878258358, 0.02986311060365369, 0.013891458769586251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd444a1e-3717-4a38-ad7e-1f7c9f4ed6d3", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 516.235294117647, 272, 1151, 533.0, 957.3999999999999, 1151.0, 1151.0, 0.08561600717159966, 6.1499717026505705, 0.1912638386314533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 808.7142857142857, 141, 1406, 1079.0, 1406.0, 1406.0, 1406.0, 0.039079946404644926, 25.08956002784446, 0.058172855487941044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d3b5f1c-4cc8-4318-bf24-126ac2eef3cb", 3, 0, 0.0, 465.3333333333333, 351, 548, 497.0, 548.0, 548.0, 548.0, 0.051602249858093814, 0.033511226714484754, 0.03309128653009271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1c66e2d-8cd3-45c1-8f92-6e06221855d6", 3, 0, 0.0, 676.6666666666666, 235, 941, 854.0, 941.0, 941.0, 941.0, 0.018571941510765536, 0.02560292066995184, 0.011909741138088577], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1051.2272727272725, 213, 1637, 1127.5, 1478.3, 1614.9499999999996, 1637.0, 0.08711801719392867, 0.027549216729827228, 0.03930519916366704], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/930e2590-fc04-43c7-af34-a48ac0ff5004", 3, 0, 0.0, 884.3333333333334, 223, 2174, 256.0, 2174.0, 2174.0, 2174.0, 0.01874519654338576, 0.022156187711273985, 0.012020845439606102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 382.5, 267, 563, 283.0, 558.5, 563.0, 563.0, 0.08770433892854533, 0.13592459558554826, 0.19724911382074206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 162.99999999999997, 133, 412, 143.0, 289.0, 412.0, 412.0, 0.07820573694941764, 0.060716368041784215, 0.027799695556238305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 455.4347826086956, 261, 1401, 285.0, 960.6000000000004, 1331.399999999999, 1401.0, 0.1232761439222181, 6.594970115584784, 0.27587957361193743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 138.33333333333331, 134, 145, 138.0, 145.0, 145.0, 145.0, 0.03541055588670983, 0.026315852568150565, 0.017774439185321143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 183.83333333333334, 132, 418, 138.0, 418.0, 418.0, 418.0, 0.035409928944075915, 0.018338931298836195, 0.01969907830905786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 386.5, 132, 1375, 140.0, 1375.0, 1375.0, 1375.0, 0.03541055588670983, 5.318366948155996, 0.020310351390749583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 317.0, 135, 923, 142.0, 923.0, 923.0, 923.0, 0.035410137922487206, 1.7432461616885913, 0.020344691872783177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.9402754934210527, 4.0668688322368425], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1290.1090909090908, 1013, 1942, 1113.0, 1769.0, 1831.3999999999999, 1942.0, 0.2394969692747161, 286.52163787078484, 0.47291296081394135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1051.2272727272725, 213, 1637, 1127.5, 1478.3, 1614.9499999999996, 1637.0, 0.08664316798928776, 0.02739905578638521, 0.039090960557666934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 311.3333333333333, 138, 404, 392.0, 404.0, 404.0, 404.0, 0.023038820412394884, 0.006209682064278309, 0.013566805379564567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 221.33333333333334, 129, 400, 135.0, 400.0, 400.0, 400.0, 0.023039351211869872, 0.0062098251313243025, 0.01354461858354069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55604e41-5a78-4ed3-8abb-05ea6ee2bd7a", 3, 0, 0.0, 554.0, 222, 1144, 296.0, 1144.0, 1144.0, 1144.0, 0.01886199308393587, 0.026002780179188934, 0.012095744262810437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 368.2857142857143, 129, 1244, 137.5, 1223.5, 1244.0, 1244.0, 0.08009244957036123, 10.313835917029943, 0.046102322394993074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 290.0714285714286, 134, 965, 140.5, 823.0, 965.0, 965.0, 0.07997714938588975, 3.377896493858897, 0.046114056698086256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 137.71428571428572, 129, 146, 137.5, 144.5, 146.0, 146.0, 0.08008649341288591, 0.05951740379609979, 0.04019966563889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 222.0, 131, 398, 137.0, 398.0, 398.0, 398.0, 0.023040058982550998, 0.0061650157824404035, 0.013140033638486115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 194.57142857142856, 127, 419, 136.0, 418.0, 419.0, 419.0, 0.08009336598091489, 0.03861644431222683, 0.044717306174054325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 224.33333333333334, 131, 409, 133.0, 409.0, 409.0, 409.0, 0.022990972211578253, 0.017086064309581105, 0.011540390348389867], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 888.5, 142, 2857, 511.0, 2652.100000000001, 2857.0, 2857.0, 0.06330416066595977, 0.01189528865378427, 0.04308371546626152], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 228.33333333333331, 136, 411, 138.0, 411.0, 411.0, 411.0, 0.024212488801723928, 0.01905787692791942, 0.008606783128737803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1353.1904761904761, 866, 2715, 1149.0, 2197.4, 2668.5999999999995, 2715.0, 0.09023564393874288, 0.04670399539798216, 0.04150487138198038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 539.0, 271, 809, 537.0, 809.0, 809.0, 809.0, 0.022966682998530132, 0.03559387296744856, 0.05165260834532705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d841b01a-11f4-451e-bc9d-3a497b952584", 3, 0, 0.0, 318.3333333333333, 228, 474, 253.0, 474.0, 474.0, 474.0, 0.03224870198974491, 0.026884415949133048, 0.020680319960871576], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 1316.2131147540981, 711, 3185, 1109.0, 2076.4, 2590.7999999999997, 3185.0, 0.27873609175443803, 89.84436134164591, 1.0137517064017911], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 243.25454545454545, 127, 564, 142.0, 549.4, 557.6, 564.0, 0.24050760222666312, 0.178736606732901, 0.11626099912324048], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 757.290909090909, 626, 1186, 691.0, 981.2, 1097.7999999999997, 1186.0, 0.24040562986275024, 70.6872373978276, 0.12090712830011364], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 195.30909090909088, 127, 538, 140.0, 413.0, 424.79999999999995, 538.0, 0.2409839154190272, 0.42642856908132554, 0.1171972557408941], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1042.9090909090908, 873, 1390, 961.0, 1257.6, 1290.9999999999998, 1390.0, 0.24011700246665646, 216.05770090016588, 0.12052747975377093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 156.7826086956522, 136, 385, 145.0, 166.0, 341.9999999999994, 385.0, 0.12633267237543874, 0.09437938903047913, 0.044907317133456734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, 2.824858757062147, 213.8474576271187, 128, 1659, 145.0, 344.60000000000065, 429.0, 1211.2799999999993, 0.7369841111222145, 1.5175859645643883, 0.35701734046584055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 145.0, 141, 151, 144.0, 151.0, 151.0, 151.0, 0.03530844872330534, 0.027343359216387825, 0.012551050132112445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 141.8235294117647, 130, 155, 141.0, 155.0, 155.0, 155.0, 0.08272868398129359, 0.06713626600435055, 0.02940746188397545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fd4101a-fde5-47af-b77d-75ce2a79dbb6", 3, 0, 0.0, 372.0, 251, 450, 415.0, 450.0, 450.0, 450.0, 0.04173158246160694, 0.026829386510961492, 0.026761464013465387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a78b896-68be-4618-bf33-50c0a54fee8d", 1, 0, 0.0, 1193.0, 1193, 1193, 1193.0, 1193.0, 1193.0, 1193.0, 0.8382229673093042, 0.1514367665549036, 0.5779154442581727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 578.3333333333334, 274, 1516, 422.0, 1516.0, 1516.0, 1516.0, 0.03538111356158083, 7.100380227190976, 0.07806418871106603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6e781df-8c41-46ea-8be7-72feb8bc2844", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 567.0000000000001, 270, 1383, 541.5, 1362.0, 1383.0, 1383.0, 0.07991186862488797, 13.763637638204722, 0.17680277964873026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f6048b2-c30c-46f1-96b6-602305b57596", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55604e41-5a78-4ed3-8abb-05ea6ee2bd7a", 1, 0, 0.0, 804.0, 804, 804, 804.0, 804.0, 804.0, 804.0, 1.243781094527363, 0.22470654539800994, 0.8575287624378108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7227fac9-4f9b-4ce3-ac7e-fd3c5896dc39", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a82b837-11d9-4d72-815c-f676ba66fec6", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 161.22222222222223, 134, 465, 143.5, 184.20000000000044, 465.0, 465.0, 0.0834422718549217, 0.06918211797346537, 0.0296611200734292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 160.05882352941177, 129, 407, 144.0, 218.19999999999982, 407.0, 407.0, 0.08569196259797868, 0.0665284279935479, 0.030460814829750233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/909c90c5-4e4d-4e1d-9572-a8df1d18348a", 3, 0, 0.0, 460.3333333333333, 422, 504, 455.0, 504.0, 504.0, 504.0, 0.015472132111378722, 0.021329583167867476, 0.009921907636528672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1c66e2d-8cd3-45c1-8f92-6e06221855d6", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d3b5f1c-4cc8-4318-bf24-126ac2eef3cb", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 171.69565217391303, 127, 649, 139.0, 311.40000000000043, 603.7999999999994, 649.0, 0.12411500604386116, 0.09223781210876791, 0.06229991514310999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 171.0434782608696, 128, 403, 138.0, 395.0, 402.2, 403.0, 0.12411567580985478, 0.041315680126921765, 0.07033151364462983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 267.9130434782609, 130, 1260, 139.0, 426.6, 1093.3999999999976, 1260.0, 0.12336937864744249, 4.858240244767529, 0.07206674216336252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 241.04347826086956, 125, 982, 139.0, 414.2, 868.5999999999983, 982.0, 0.12355361689783727, 1.6113695683412659, 0.07229502354233591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfb6b18e-1ceb-4240-8776-26164001a8f7", 3, 0, 0.0, 314.0, 224, 467, 251.0, 467.0, 467.0, 467.0, 0.027986379961751948, 0.028068371309296146, 0.01794699496245161], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.3849114703618168], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15396458814472672], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 5.555555555555555, 0.07698229407236336], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07698229407236336], "isController": false}, {"data": ["401/Unauthorized", 8, 44.44444444444444, 0.6158583525789069], "isController": false}, {"data": ["Assertion failed", 1, 5.555555555555555, 0.07698229407236336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 18, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Test failed: code expected to contain /204/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "Assertion failed", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
