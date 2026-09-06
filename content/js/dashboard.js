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

    var data = {"OkPercent": 98.85757806549886, "KoPercent": 1.1424219345011424};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7815979043876883, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07017543859649122, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cb5f5c9-eb06-477b-b80c-db28f84e9bc4"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cd20bac-5e64-442f-9350-6dd43bc10ea6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22f8cc3e-aed0-415d-910b-f556718ab915"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a853bbbe-824a-4907-9923-f4da6c99699a"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a7eeffb-b6d0-42f9-b3fa-779fb67d6935"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75683b15-95af-4c0b-92e0-270dd258d6a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08137ddd-a21e-4fe9-8f45-4de45c6f8b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eb8aa9c8-153c-4858-b6d0-48a36bca87cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/79cdc604-319a-4101-b8a8-e239b5a5291e"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7bf61b1c-5e62-4df9-9efd-40344fa971e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb25076c-f3ba-4cb9-995a-825ff262116f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a7eeffb-b6d0-42f9-b3fa-779fb67d6935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13d5bed5-43f2-47a8-b44e-fad72a8b4135"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a853bbbe-824a-4907-9923-f4da6c99699a"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cd20bac-5e64-442f-9350-6dd43bc10ea6"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08137ddd-a21e-4fe9-8f45-4de45c6f8b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4062c774-bd5a-45f7-aa0b-ecb95c5b36d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/130cea9b-f621-449c-b794-5565d7e238b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22f8cc3e-aed0-415d-910b-f556718ab915"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13d5bed5-43f2-47a8-b44e-fad72a8b4135"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4cb5f5c9-eb06-477b-b80c-db28f84e9bc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb8aa9c8-153c-4858-b6d0-48a36bca87cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c88e6e89-f775-4bb8-9b5d-7cf81f4be44c"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bf61b1c-5e62-4df9-9efd-40344fa971e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9265536723163842, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d1db063-b805-4713-96c7-6b555f309a31"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ecf125c8-36a6-4a27-bed4-21650b9bc736"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75683b15-95af-4c0b-92e0-270dd258d6a4"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4062c774-bd5a-45f7-aa0b-ecb95c5b36d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb25076c-f3ba-4cb9-995a-825ff262116f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=130cea9b-f621-449c-b794-5565d7e238b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 15, 1.1424219345011424, 386.01523229245987, 101, 3497, 128.0, 1057.6000000000001, 1307.6, 1807.7199999999998, 5.0538876058506546, 694.0248771591127, 3.691631784064665], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1778.701754385965, 1292, 2596, 1717.0, 2195.8, 2453.7, 2596.0, 0.25799209729470396, 310.4524573535103, 1.268545126834799], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cb5f5c9-eb06-477b-b80c-db28f84e9bc4", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 608.2142857142857, 493, 1176, 560.0, 941.5, 1176.0, 1176.0, 0.0754338795105419, 0.013628191122510009, 0.05127146497982144], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 608.2142857142857, 493, 1176, 560.0, 941.5, 1176.0, 1176.0, 0.07396176176916534, 0.013362232350874597, 0.05027088495247957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cd20bac-5e64-442f-9350-6dd43bc10ea6", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 132.19047619047618, 104, 340, 111.0, 281.8000000000002, 338.29999999999995, 340.0, 0.09978475003920115, 0.040973741761818554, 0.05611036074562967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 112.76190476190476, 106, 127, 112.0, 122.60000000000001, 126.69999999999999, 127.0, 0.09989107116525313, 0.07423545425464612, 0.0501406353309962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 239.90476190476195, 109, 918, 113.0, 782.0000000000005, 915.4, 918.0, 0.09989439735137141, 2.82171942042222, 0.058006944741749195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22f8cc3e-aed0-415d-910b-f556718ab915", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 231.2857142857143, 101, 1222, 110.0, 970.8000000000005, 1212.9999999999998, 1222.0, 0.09989629812860934, 8.585014648483956, 0.05791049351149759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a853bbbe-824a-4907-9923-f4da6c99699a", 3, 0, 0.0, 309.6666666666667, 209, 462, 258.0, 462.0, 462.0, 462.0, 0.11179846463441902, 0.050585893828724755, 0.07169367686517106], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 290.57142857142856, 204, 710, 240.0, 590.0, 710.0, 710.0, 0.07507386732302676, 0.1656118201793193, 0.04853408219515988], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a7eeffb-b6d0-42f9-b3fa-779fb67d6935", 3, 0, 0.0, 402.3333333333333, 241, 499, 467.0, 499.0, 499.0, 499.0, 0.021248415222364665, 0.02511490744544469, 0.013626099605487756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75683b15-95af-4c0b-92e0-270dd258d6a4", 3, 0, 0.0, 533.6666666666666, 219, 905, 477.0, 905.0, 905.0, 905.0, 0.02489440622692081, 0.024967339057663743, 0.015964186284841798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 112.14285714285717, 106, 118, 112.0, 117.8, 118.0, 118.0, 0.12098795305667422, 0.0899138987071573, 0.06073028112415092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 110.14285714285714, 103, 115, 109.0, 114.8, 115.0, 115.0, 0.12098795305667422, 0.041026978873198866, 0.06851708018620623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 688.3333333333334, 560, 875, 630.0, 875.0, 875.0, 875.0, 0.03708006822732554, 10.902771232974068, 0.021147226410896596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 959.0, 772, 1223, 882.0, 1223.0, 1223.0, 1223.0, 0.037076860331467135, 33.36182410042268, 0.021109189036372402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08137ddd-a21e-4fe9-8f45-4de45c6f8b4a", 3, 0, 0.0, 310.6666666666667, 223, 468, 241.0, 468.0, 468.0, 468.0, 0.022741917143615207, 0.022808543853996895, 0.014583846605768867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 258.6666666666667, 115, 347, 314.0, 347.0, 347.0, 347.0, 0.03733897566743419, 0.06607248428651441, 0.020674999222104674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 150.16666666666663, 108, 338, 114.0, 337.4, 338.0, 338.0, 0.05943094866651809, 0.044166945249238546, 0.029831550404873338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 184.08333333333331, 108, 344, 113.0, 340.7, 344.0, 344.0, 0.05937125837382123, 0.023317520582036236, 0.03344464928902918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 238.08333333333331, 108, 1162, 113.0, 915.1000000000009, 1162.0, 1162.0, 0.059123202900978486, 4.4478710797005405, 0.03433456835134949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 235.75000000000003, 105, 633, 120.5, 570.0000000000002, 633.0, 633.0, 0.059277994032681934, 1.46712070419787, 0.03448234874231856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb8aa9c8-153c-4858-b6d0-48a36bca87cb", 3, 0, 0.0, 721.3333333333334, 215, 1515, 434.0, 1515.0, 1515.0, 1515.0, 0.05485162635072129, 0.03526431056076646, 0.03517503382516959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 114.66666666666667, 106, 125, 113.0, 125.0, 125.0, 125.0, 0.03743542389378322, 0.027820661702313506, 0.02102086790910679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 834.0625, 109, 1405, 1178.5, 1381.9, 1405.0, 1405.0, 0.08368857389439548, 47.07291244409865, 0.04470473625022883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 170.57142857142856, 104, 1163, 110.0, 292.60000000000014, 1080.3999999999987, 1163.0, 0.12098655896942496, 5.215052933419944, 0.0706317550828758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 522.3125, 106, 1011, 645.0, 917.2, 1011.0, 1011.0, 0.08369382705716812, 15.388936820314584, 0.04478927463606262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 207.8571428571429, 110, 650, 116.0, 435.0000000000001, 630.7999999999997, 650.0, 0.12098725600903372, 1.7250698737411563, 0.07075031363065472], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 535.7692307692308, 203, 919, 511.0, 832.5999999999999, 919.0, 919.0, 0.08148324579107696, 0.01472109421030199, 0.056178878445801106], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 453.08333333333337, 222, 1271, 343.0, 1092.2000000000007, 1271.0, 1271.0, 0.0590905957316893, 5.975021951233024, 0.13163622782871606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79cdc604-319a-4101-b8a8-e239b5a5291e", 2, 0, 0.0, 595.0, 470, 720, 595.0, 720.0, 720.0, 720.0, 0.054055515013919295, 0.031805124800670284, 0.033599936822616826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 688.0500000000002, 181, 2268, 550.5, 1364.8000000000002, 2223.249999999999, 2268.0, 0.08354567859977442, 0.051318585780525505, 0.0377750480387652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 113.12500000000001, 107, 118, 114.0, 117.3, 118.0, 118.0, 0.0836876984313787, 0.06219368994753827, 0.04200730175168813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bf61b1c-5e62-4df9-9efd-40344fa971e5", 3, 0, 0.0, 376.0, 240, 536, 352.0, 536.0, 536.0, 536.0, 0.03543125745532709, 0.029537581491892145, 0.02272121653222473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 194.1875, 105, 337, 116.0, 336.3, 337.0, 337.0, 0.08369163815920243, 0.1009571250353074, 0.0433373936854659], "isController": false}, {"data": ["login", 20, 0, 0.0, 2929.7499999999995, 1490, 5971, 2659.0, 5423.100000000002, 5948.7, 5971.0, 0.0834320612725058, 15.08914047638664, 0.14663347721887565], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb25076c-f3ba-4cb9-995a-825ff262116f", 3, 0, 0.0, 373.3333333333333, 250, 496, 374.0, 496.0, 496.0, 496.0, 0.04202328089761728, 0.027016920498956425, 0.02694852323187046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a7eeffb-b6d0-42f9-b3fa-779fb67d6935", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 118.76190476190476, 112, 139, 117.0, 130.0, 138.29999999999998, 139.0, 0.11483818752529175, 0.09296958736178403, 0.04082138697188105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13d5bed5-43f2-47a8-b44e-fad72a8b4135", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a853bbbe-824a-4907-9923-f4da6c99699a", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 949.0000000000001, 221, 1518, 1295.0, 1492.1000000000001, 1518.0, 1518.0, 0.08363607851336871, 62.58474891207757, 0.17472507906223048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 401.5238095238095, 220, 1336, 229.0, 1091.8000000000006, 1327.1999999999998, 1336.0, 0.09972977978714814, 11.502840406529451, 0.22186444081275022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1074.0, 885, 1330, 1007.0, 1330.0, 1330.0, 1330.0, 0.03702789434707479, 44.29823461799556, 0.08349356254628487], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1266.608695652174, 316, 2598, 1226.0, 2270.600000000001, 2568.9999999999995, 2598.0, 0.09526886530639296, 0.030159844587485815, 0.04298263258940776], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9cd20bac-5e64-442f-9350-6dd43bc10ea6", 3, 0, 0.0, 324.6666666666667, 222, 454, 298.0, 454.0, 454.0, 454.0, 0.024973985431841834, 0.02504715140478668, 0.01601521852237253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 355.9047619047619, 218, 1269, 234.0, 546.8000000000001, 1198.999999999999, 1269.0, 0.12091062977165164, 7.0666145599428845, 0.2704576917153188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 131.92857142857147, 112, 307, 117.5, 219.5, 307.0, 307.0, 0.09346792714842707, 0.07256543172167922, 0.033224927228542436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 346.64705882352933, 222, 657, 258.0, 504.9999999999999, 657.0, 657.0, 0.08610167087889546, 0.13344077312969443, 0.19364467581454714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 112.66666666666667, 108, 126, 109.5, 126.0, 126.0, 126.0, 0.03299495177237883, 0.024520662401152624, 0.01656191915136984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 147.66666666666669, 106, 334, 108.0, 334.0, 334.0, 334.0, 0.032995133217850366, 0.008828775880557619, 0.01881753691330529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 223.83333333333334, 109, 355, 218.5, 355.0, 355.0, 355.0, 0.03299458888742247, 0.008893072786063085, 0.019397209482644846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 181.83333333333334, 105, 334, 110.5, 334.0, 334.0, 334.0, 0.032995133217850366, 0.008893219500123731, 0.01942975129918337], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1206.4561403508774, 845, 2105, 1135.0, 1696.0, 1916.3999999999996, 2105.0, 0.25460863971984116, 304.60044938983265, 0.5027526069467958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1266.608695652174, 316, 2598, 1226.0, 2270.600000000001, 2568.9999999999995, 2598.0, 0.08981392896889705, 0.02843294218716442, 0.0405215187340141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 111.60000000000001, 107, 115, 112.0, 115.0, 115.0, 115.0, 0.05532350419075544, 0.014911413238914553, 0.032578196315454624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08137ddd-a21e-4fe9-8f45-4de45c6f8b4a", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 155.6, 106, 340, 111.5, 339.6, 340.0, 340.0, 0.05532105574702788, 0.014910753306816106, 0.03252273003878006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 249.0, 106, 1256, 114.5, 854.5, 1256.0, 1256.0, 0.09202171712524156, 5.937409878284846, 0.053533839343227856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 180.28571428571428, 107, 620, 112.0, 482.5, 620.0, 620.0, 0.0924080210162242, 1.9639153897308286, 0.05384881470211614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4062c774-bd5a-45f7-aa0b-ecb95c5b36d3", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/130cea9b-f621-449c-b794-5565d7e238b3", 3, 0, 0.0, 526.0, 240, 1068, 270.0, 1068.0, 1068.0, 1068.0, 0.03078407026977107, 0.031074675099791692, 0.019741086728987306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 129.9, 105, 320, 108.5, 299.4000000000001, 320.0, 320.0, 0.05532350419075544, 0.014803359519791984, 0.03155168598379021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 128.35714285714286, 106, 330, 112.0, 225.5, 330.0, 330.0, 0.09258524455731026, 0.06880602647276672, 0.046473452834431134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 137.5, 109, 337, 115.5, 315.70000000000005, 337.0, 337.0, 0.05531830150687053, 0.041110573678445776, 0.027767194311065873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 174.57142857142858, 108, 342, 114.5, 338.0, 342.0, 342.0, 0.09258646914886581, 0.03470700929171351, 0.052247805204682224], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 599.5384615384615, 434, 1335, 477.0, 1228.1999999999998, 1335.0, 1335.0, 0.0788093722530387, 0.014238021354308749, 0.0536427074808281], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 169.89999999999998, 109, 371, 132.5, 366.20000000000005, 371.0, 371.0, 0.05874819349305009, 0.046241253862693725, 0.02088314690573265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1536.3500000000004, 1039, 2822, 1464.0, 2181.7000000000007, 2791.5999999999995, 2822.0, 0.08543722499893203, 0.04422043872015037, 0.03929778610790721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22f8cc3e-aed0-415d-910b-f556718ab915", 3, 0, 0.0, 420.6666666666667, 341, 566, 355.0, 566.0, 566.0, 566.0, 0.01704787611876687, 0.023501873490552636, 0.010932394516266515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 295.79999999999995, 218, 678, 230.0, 655.5000000000001, 678.0, 678.0, 0.055282826942638544, 0.08567758433395249, 0.12433237348525054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13d5bed5-43f2-47a8-b44e-fad72a8b4135", 3, 0, 0.0, 345.3333333333333, 235, 562, 239.0, 562.0, 562.0, 562.0, 0.01830239212265043, 0.025231325077937686, 0.011736885573444449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cb5f5c9-eb06-477b-b80c-db28f84e9bc4", 3, 0, 0.0, 339.3333333333333, 204, 469, 345.0, 469.0, 469.0, 469.0, 0.021976894957767733, 0.025975945830616742, 0.014093256206641418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb8aa9c8-153c-4858-b6d0-48a36bca87cb", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c88e6e89-f775-4bb8-9b5d-7cf81f4be44c", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.5702427455357142, 1.0654994419642856], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 1193.2166666666665, 577, 4217, 943.0, 2086.0, 2177.45, 4217.0, 0.2660340967033942, 80.5665383144523, 0.9679068658966458], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 187.5964912280702, 103, 457, 116.0, 444.40000000000003, 454.2, 457.0, 0.25545073610146324, 0.18984180680977883, 0.12348448668967217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bf61b1c-5e62-4df9-9efd-40344fa971e5", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 706.1052631578947, 520, 992, 666.0, 908.2, 970.5999999999999, 992.0, 0.25521169138190414, 75.04071109197024, 0.1283535361930475], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 163.17543859649126, 106, 460, 114.0, 342.2, 353.69999999999993, 460.0, 0.2558612424083276, 0.452754464105361, 0.12443251828061246], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1017.5614035087722, 729, 1668, 1003.0, 1268.8000000000004, 1480.5, 1668.0, 0.2551454328967511, 229.58030901832797, 0.12807104737200206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 120.23529411764704, 112, 137, 117.0, 132.2, 137.0, 137.0, 0.08402613707134314, 0.06277343248005615, 0.029868665912079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, 5.649717514124294, 199.18079096045187, 107, 2676, 122.0, 359.0000000000001, 416.99999999999994, 1335.179999999998, 0.7285329733200523, 1.5369019829885493, 0.35037496810095736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 125.0, 111, 145, 124.0, 145.0, 145.0, 145.0, 0.03340255084146593, 0.02586740509500242, 0.01187356299442734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 130.1904761904762, 110, 347, 118.0, 142.4, 326.89999999999975, 347.0, 0.10249101983445259, 0.08317386472893566, 0.036432354706778074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d1db063-b805-4713-96c7-6b555f309a31", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecf125c8-36a6-4a27-bed4-21650b9bc736", 1, 0, 0.0, 3497.0, 3497, 3497, 3497.0, 3497.0, 3497.0, 3497.0, 0.28595939376608526, 0.09131711109522449, 0.1706261617100372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 373.6666666666667, 218, 464, 441.5, 464.0, 464.0, 464.0, 0.03297500494625074, 0.05110481723603509, 0.07416155897579635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75683b15-95af-4c0b-92e0-270dd258d6a4", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 426.8571428571429, 221, 1366, 331.5, 1021.0, 1366.0, 1366.0, 0.0918219441329057, 7.978639049167372, 0.2048315969147827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4062c774-bd5a-45f7-aa0b-ecb95c5b36d3", 3, 0, 0.0, 764.6666666666667, 249, 1335, 710.0, 1335.0, 1335.0, 1335.0, 0.07466215375426197, 0.034657627361190615, 0.04787905042184117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb25076c-f3ba-4cb9-995a-825ff262116f", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=130cea9b-f621-449c-b794-5565d7e238b3", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 919.0, 1.088139281828074, 0.19658766322089227, 0.7502210282916213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 119.5, 109, 135, 119.0, 132.60000000000002, 135.0, 135.0, 0.05890351114012654, 0.04883699312301507, 0.020938357475591855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 147.37499999999997, 107, 347, 122.5, 328.1, 347.0, 347.0, 0.08538798164158395, 0.06629242715337816, 0.030352759099156794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 125.88235294117646, 108, 311, 114.0, 170.19999999999987, 311.0, 311.0, 0.08625282224308076, 0.06409999778025825, 0.04329487366498389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 162.58823529411768, 106, 340, 114.0, 336.0, 340.0, 340.0, 0.08616757058137767, 0.023056556971970198, 0.04914244259719195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 165.05882352941174, 107, 351, 112.0, 346.2, 351.0, 351.0, 0.08615228683643734, 0.023220733561383506, 0.05064812175345243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 188.94117647058823, 104, 342, 114.0, 338.0, 342.0, 342.0, 0.0862576363378052, 0.023249128544174057, 0.05079429171064115], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.38080731150038083], "isController": false}, {"data": ["401/Unauthorized", 10, 66.66666666666667, 0.7616146230007617], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 15, "401/Unauthorized", 10, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
