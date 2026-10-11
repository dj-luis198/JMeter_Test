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

    var data = {"OkPercent": 99.22958397534669, "KoPercent": 0.7704160246533128};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7323665128543178, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3232cde2-bd65-4133-b0e1-276f097bd54e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6a6344e-bc7b-4784-ab18-5d243191622c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02ec9fe7-7474-48bb-86fc-d5f4abdd9aab"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f76743a-845f-4995-bd7c-2a9bccd3bb92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f56aaf6c-3f4b-47eb-af7b-4e691972b08c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be8f08ef-529f-4b83-9e4d-3227757b1389"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77c23b99-210d-4b37-bed5-140b2a7cfde4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b7dbe53-b38b-4ece-b562-2b87ff46f529"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dadc04f3-5bca-4777-b5f9-1321f89bd28a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=103b0290-1043-486d-bdd6-2b88bf9ae893"], "isController": false}, {"data": [0.5652173913043478, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fc96d41-5676-4d8e-a565-4e649d06a0d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0b60fe7-3fdf-4e80-807a-0bbcb8aef860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80dcec6a-b841-4d9b-b36f-8f11d8b2633b"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fad0e7ba-2e98-4376-b7b6-074824f3e849"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c00635ff-1aed-4689-9f28-198eff677fe9"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8019730f-0d56-44f4-95b4-89583ab8122a"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9aec151-0dc3-4cea-aec6-7c0508b6a949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be8f08ef-529f-4b83-9e4d-3227757b1389"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8019730f-0d56-44f4-95b4-89583ab8122a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5b7dbe53-b38b-4ece-b562-2b87ff46f529"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f56aaf6c-3f4b-47eb-af7b-4e691972b08c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2980769230769231, 500, 1500, "addBook"], "isController": true}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/77c23b99-210d-4b37-bed5-140b2a7cfde4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3232cde2-bd65-4133-b0e1-276f097bd54e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4067796610169492, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6a6344e-bc7b-4784-ab18-5d243191622c"], "isController": false}, {"data": [0.9478527607361963, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80dcec6a-b841-4d9b-b36f-8f11d8b2633b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fad0e7ba-2e98-4376-b7b6-074824f3e849"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/933db169-29ee-4c4a-bd97-101cf79a44f2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/103b0290-1043-486d-bdd6-2b88bf9ae893"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9f76743a-845f-4995-bd7c-2a9bccd3bb92"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0b60fe7-3fdf-4e80-807a-0bbcb8aef860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02ec9fe7-7474-48bb-86fc-d5f4abdd9aab"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a9aec151-0dc3-4cea-aec6-7c0508b6a949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c00635ff-1aed-4689-9f28-198eff677fe9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 10, 0.7704160246533128, 474.0084745762718, 124, 4526, 157.5, 1308.2000000000003, 1544.6999999999994, 2162.02, 5.057569794852813, 749.123553753726, 3.6880497623175983], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2107.033898305085, 1534, 2851, 2058.0, 2611.0, 2694.0, 2851.0, 0.2594524234615351, 312.2074718587568, 1.2757255391883098], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3232cde2-bd65-4133-b0e1-276f097bd54e", 3, 0, 0.0, 986.6666666666666, 293, 2169, 498.0, 2169.0, 2169.0, 2169.0, 0.07335860129600195, 0.034482363369605085, 0.04704311346130333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6a6344e-bc7b-4784-ab18-5d243191622c", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02ec9fe7-7474-48bb-86fc-d5f4abdd9aab", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 732.2, 470, 1609, 596.0, 1296.4, 1609.0, 1609.0, 0.08430708010858752, 0.015231259589930364, 0.05730246851130558], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 732.2, 470, 1609, 596.0, 1296.4, 1609.0, 1609.0, 0.08397527767825153, 0.015171314814918489, 0.05707694654693658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f76743a-845f-4995-bd7c-2a9bccd3bb92", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 160.6875, 127, 387, 129.0, 382.8, 387.0, 387.0, 0.07763824459928961, 0.028062358674132877, 0.043870536407484326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 131.56250000000003, 126, 155, 130.0, 141.70000000000002, 155.0, 155.0, 0.07763786787005361, 0.057697673290147265, 0.03897057039571051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 230.6875, 127, 750, 131.0, 493.8000000000003, 750.0, 750.0, 0.07763824459928961, 1.4463819213281963, 0.04530161244929252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 233.25000000000003, 125, 1296, 128.5, 663.2000000000006, 1296.0, 1296.0, 0.07764012830031201, 4.385913783367058, 0.045226891143687616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f56aaf6c-3f4b-47eb-af7b-4e691972b08c", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be8f08ef-529f-4b83-9e4d-3227757b1389", 3, 0, 0.0, 647.6666666666666, 227, 957, 759.0, 957.0, 957.0, 957.0, 0.08134710811030668, 0.03770777407196508, 0.05216595149000787], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 313.8666666666667, 227, 508, 255.0, 502.6, 508.0, 508.0, 0.08425688238300931, 0.16949566463233107, 0.05447075794682829], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77c23b99-210d-4b37-bed5-140b2a7cfde4", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 170.78947368421052, 126, 392, 130.0, 382.0, 392.0, 392.0, 0.12130885873902633, 0.09015238427773344, 0.06089136073423783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 155.52631578947367, 127, 379, 129.0, 378.0, 379.0, 379.0, 0.1213212522907368, 0.06123430805381555, 0.06758222308424164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 844.4, 687, 1017, 761.0, 1017.0, 1017.0, 1017.0, 0.06441970727685013, 18.941532874987118, 0.03673936430632859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1330.0, 1148, 1401, 1378.0, 1401.0, 1401.0, 1401.0, 0.0638936809149575, 57.491646400389754, 0.036376968724043196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b7dbe53-b38b-4ece-b562-2b87ff46f529", 1, 0, 0.0, 1308.0, 1308, 1308, 1308.0, 1308.0, 1308.0, 1308.0, 0.764525993883792, 0.13812237194189603, 0.5271048356269112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 231.2, 127, 389, 131.0, 389.0, 389.0, 389.0, 0.06488787375415282, 0.11482112035402825, 0.03592912540879361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 162.24999999999997, 127, 391, 129.5, 391.0, 391.0, 391.0, 0.04389044943820224, 0.032617804709445225, 0.022030948253160113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 191.125, 127, 378, 129.5, 378.0, 378.0, 378.0, 0.04383081306158229, 0.028186123438527284, 0.024076984714003942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 497.0, 127, 1510, 130.5, 1510.0, 1510.0, 1510.0, 0.043560647311219045, 9.807792472311764, 0.024673022891120163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 417.99999999999994, 125, 1022, 265.0, 1022.0, 1022.0, 1022.0, 0.043676705029372584, 3.2194295481098907, 0.024781411740298312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dadc04f3-5bca-4777-b5f9-1321f89bd28a", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 181.6, 129, 377, 131.0, 377.0, 377.0, 377.0, 0.06488534759080705, 0.04822045851230875, 0.03643464342257231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 897.2941176470588, 128, 1704, 1131.0, 1552.8, 1704.0, 1704.0, 0.08527757851807634, 45.14647325481944, 0.045822981931186016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 355.8947368421052, 126, 1395, 131.0, 1394.0, 1395.0, 1395.0, 0.12132047761956453, 17.264017453786476, 0.06967696427431198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 646.4705882352943, 127, 1155, 787.0, 1080.6, 1155.0, 1155.0, 0.08538508674120282, 14.777741363549607, 0.04596413418266381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 312.47368421052636, 126, 1022, 130.0, 1017.0, 1022.0, 1022.0, 0.12132047761956453, 5.659996867217929, 0.06979544130323734], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 523.4, 221, 1308, 511.0, 920.4000000000002, 1308.0, 1308.0, 0.08403879230652869, 0.015182789625691218, 0.05794080797696216], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 696.0, 258, 1640, 405.0, 1640.0, 1640.0, 1640.0, 0.04352983426015606, 13.069800854409028, 0.09511523843466715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=103b0290-1043-486d-bdd6-2b88bf9ae893", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 826.3478260869565, 144, 1708, 820.0, 1387.0, 1648.999999999999, 1708.0, 0.1017249004865104, 0.06248531484962406, 0.04599475480981866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 131.70588235294116, 128, 138, 131.0, 136.4, 138.0, 138.0, 0.08538422903063787, 0.06345449051983929, 0.0428588805876444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 223.1176470588235, 128, 414, 132.0, 402.8, 414.0, 414.0, 0.08527800630053975, 0.09816180435720448, 0.04442215999157252], "isController": false}, {"data": ["login", 23, 0, 0.0, 3339.7826086956525, 2012, 4663, 3351.0, 4592.2, 4653.0, 4663.0, 0.09973418671107005, 26.07623401407336, 0.18642992399604533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8fc96d41-5676-4d8e-a565-4e649d06a0d2", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.697240038209607, 1.302794077510917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0b60fe7-3fdf-4e80-807a-0bbcb8aef860", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 133.15789473684208, 127, 144, 133.0, 137.0, 144.0, 144.0, 0.12228558188628728, 0.09899877674192593, 0.04346870293614118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80dcec6a-b841-4d9b-b36f-8f11d8b2633b", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1035.3529411764707, 262, 1841, 1289.0, 1685.8, 1841.0, 1841.0, 0.08522157609785441, 60.027697991339984, 0.17883900485011028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fad0e7ba-2e98-4376-b7b6-074824f3e849", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c00635ff-1aed-4689-9f28-198eff677fe9", 3, 0, 0.0, 370.0, 227, 656, 227.0, 656.0, 656.0, 656.0, 0.09273856997125104, 0.04196178784506477, 0.05947102306099107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 414.9375, 256, 1423, 268.0, 792.3000000000006, 1423.0, 1423.0, 0.07758741919997672, 5.914075456492855, 0.1732552074493621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1512.4, 1278, 1775, 1509.0, 1775.0, 1775.0, 1775.0, 0.06378690072206772, 76.31130917829715, 0.14383198610083434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8019730f-0d56-44f4-95b4-89583ab8122a", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["register", 25, 5, 20.0, 1713.4000000000003, 703, 4526, 1483.0, 3079.800000000003, 4344.5, 4526.0, 0.10039193009509123, 0.03184306532703675, 0.04529401533587124], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9aec151-0dc3-4cea-aec6-7c0508b6a949", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 157.76470588235293, 131, 389, 137.0, 266.5999999999999, 389.0, 389.0, 0.09473866061825335, 0.07355198749171037, 0.033676633266644745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 567.7894736842105, 257, 1776, 271.0, 1522.0, 1776.0, 1776.0, 0.12120902815877106, 23.054211335914875, 0.2677052399779272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be8f08ef-529f-4b83-9e4d-3227757b1389", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 346.72222222222223, 259, 522, 266.0, 516.6, 522.0, 522.0, 0.08991323372945108, 0.13934795110218637, 0.202216969998951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8019730f-0d56-44f4-95b4-89583ab8122a", 3, 0, 0.0, 405.6666666666667, 304, 547, 366.0, 547.0, 547.0, 547.0, 0.020565129765968825, 0.024307287168044533, 0.013187925012681831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b7dbe53-b38b-4ece-b562-2b87ff46f529", 3, 0, 0.0, 961.0, 249, 2122, 512.0, 2122.0, 2122.0, 2122.0, 0.02136873895948487, 0.02525712602926093, 0.013703260335346744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 131.875, 127, 140, 132.0, 140.0, 140.0, 140.0, 0.05327295731504295, 0.039590547379636416, 0.02674052740227742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 163.37500000000003, 127, 394, 130.5, 394.0, 394.0, 394.0, 0.05327189308331058, 0.014254393266432713, 0.030381626524075566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 168.75, 125, 445, 127.5, 445.0, 445.0, 445.0, 0.05327366682648767, 0.014358918011826753, 0.0313190892866656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 195.875, 128, 394, 132.5, 394.0, 394.0, 394.0, 0.05327331206840293, 0.014358822393436726, 0.03137090544653024], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1438.28813559322, 1004, 2320, 1301.0, 2075.0, 2164.0, 2320.0, 0.2629585060391318, 314.5897923909168, 0.5192403312608638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 5, 20.0, 1713.4000000000003, 703, 4526, 1483.0, 3079.800000000003, 4344.5, 4526.0, 0.09878377417238954, 0.031332978370304805, 0.04456846061293356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 191.5, 126, 380, 130.0, 380.0, 380.0, 380.0, 0.05618174795463324, 0.015142736753397239, 0.03308358790687875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 128.375, 127, 130, 128.5, 130.0, 130.0, 130.0, 0.05628055858454395, 0.01516936930599036, 0.03308681276161666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 159.99999999999997, 126, 390, 128.0, 388.4, 390.0, 390.0, 0.09464424897004788, 0.025509582730208216, 0.05564046667965705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 263.4117647058824, 125, 393, 377.0, 393.0, 393.0, 393.0, 0.0946431951542684, 0.025509298693923904, 0.05573227214650766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f56aaf6c-3f4b-47eb-af7b-4e691972b08c", 3, 0, 0.0, 337.0, 229, 517, 265.0, 517.0, 517.0, 517.0, 0.036519897257355716, 0.030445135701851558, 0.023419335155270428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 130.29411764705884, 127, 136, 129.0, 135.2, 136.0, 136.0, 0.09464372205922471, 0.07033581297565429, 0.04750671204925927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 191.87500000000003, 128, 386, 129.0, 386.0, 386.0, 386.0, 0.05618135340880361, 0.015032901205090031, 0.032040928115958316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 176.05882352941177, 126, 399, 130.0, 395.8, 399.0, 399.0, 0.0946458297377197, 0.025325153660288282, 0.05397769977229327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 129.625, 128, 132, 129.0, 132.0, 132.0, 132.0, 0.05627857896588111, 0.041824217376011254, 0.028249208582483292], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 729.6666666666666, 479, 2169, 572.0, 1441.8000000000004, 2169.0, 2169.0, 0.08568197137079729, 0.015479653030856935, 0.058320638716255584], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 177.875, 129, 387, 133.0, 387.0, 387.0, 387.0, 0.05556134319547175, 0.043732854116748265, 0.01975032121401535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1715.4347826086955, 1069, 3003, 1655.0, 2436.4000000000005, 2907.5999999999985, 3003.0, 0.10211420808211759, 0.052852080355002266, 0.04696854688152088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 354.5, 258, 517, 262.5, 517.0, 517.0, 517.0, 0.056129321957790745, 0.08698948627638078, 0.1262361606140548], "isController": false}, {"data": ["addBook", 52, 5, 9.615384615384615, 1375.0961538461534, 658, 2569, 1126.0, 2259.5, 2336.2, 2569.0, 0.2544230468138406, 94.66207757211916, 0.9216767289146901], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 209.77966101694915, 127, 683, 133.0, 518.0, 534.0, 683.0, 0.2641546603150156, 0.19631025048801454, 0.1276919500546218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77c23b99-210d-4b37-bed5-140b2a7cfde4", 3, 0, 0.0, 391.0, 255, 526, 392.0, 526.0, 526.0, 526.0, 0.07566585956416465, 0.03423683098769168, 0.04852270291061339], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 810.0169491525426, 624, 1159, 765.0, 1039.0, 1147.0, 1159.0, 0.2640648077697713, 77.64382126113324, 0.13280603125139864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3232cde2-bd65-4133-b0e1-276f097bd54e", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 197.3559322033898, 126, 401, 133.0, 388.0, 394.0, 401.0, 0.2646641904864438, 0.468331555821715, 0.12871363951391504], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1223.6271186440674, 876, 1803, 1168.0, 1641.0, 1649.0, 1803.0, 0.2636199940126984, 237.2057340071468, 0.13232487980715527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 163.9444444444444, 131, 392, 135.0, 388.4, 392.0, 392.0, 0.0903002483256829, 0.06746063473549552, 0.03209891639702009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6a6344e-bc7b-4784-ab18-5d243191622c", 3, 0, 0.0, 440.66666666666663, 257, 737, 328.0, 737.0, 737.0, 737.0, 0.08027185401225484, 0.037261609316886525, 0.05147641679822332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 5, 3.067484662576687, 209.09202453987717, 127, 783, 138.0, 406.2, 492.59999999999997, 748.4399999999991, 0.6858739422603544, 1.613179522770594, 0.3238826342924348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 166.125, 132, 388, 134.5, 388.0, 388.0, 388.0, 0.0540891389009087, 0.04188738979337949, 0.01922699859368239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 151.24999999999997, 128, 389, 136.0, 219.60000000000016, 389.0, 389.0, 0.08040847505327062, 0.06525336207936316, 0.028582700116592287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80dcec6a-b841-4d9b-b36f-8f11d8b2633b", 3, 0, 0.0, 370.6666666666667, 244, 503, 365.0, 503.0, 503.0, 503.0, 0.039490311710193765, 0.025388465373578348, 0.02532419077769587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fad0e7ba-2e98-4376-b7b6-074824f3e849", 3, 0, 0.0, 467.0, 264, 660, 477.0, 660.0, 660.0, 660.0, 0.022351863027783365, 0.02681204923742894, 0.014333714246332431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 368.0, 258, 579, 267.5, 579.0, 579.0, 579.0, 0.05322617130843235, 0.08249016979148648, 0.11970690676105442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/933db169-29ee-4c4a-bd97-101cf79a44f2", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.6249235567514677, 1.167670621330724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 412.1764705882353, 259, 528, 513.0, 528.0, 528.0, 528.0, 0.09457474742979216, 0.14657238688582044, 0.21270082356524544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/103b0290-1043-486d-bdd6-2b88bf9ae893", 3, 0, 0.0, 538.6666666666666, 269, 853, 494.0, 853.0, 853.0, 853.0, 0.017730601244688206, 0.024443065192465675, 0.011370209782563727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f76743a-845f-4995-bd7c-2a9bccd3bb92", 3, 0, 0.0, 1164.3333333333333, 479, 2506, 508.0, 2506.0, 2506.0, 2506.0, 0.0728898391564216, 0.03298075404538607, 0.04674250753195004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0b60fe7-3fdf-4e80-807a-0bbcb8aef860", 3, 0, 0.0, 422.33333333333337, 231, 748, 288.0, 748.0, 748.0, 748.0, 0.025148797049207815, 0.025222475165562912, 0.016127321024394334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 135.49999999999997, 131, 146, 133.5, 146.0, 146.0, 146.0, 0.04465357200667571, 0.03702234632194109, 0.015872949424248006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 166.8235294117647, 130, 398, 138.0, 392.4, 398.0, 398.0, 0.08571399760000807, 0.06654553524610002, 0.030468647584377867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02ec9fe7-7474-48bb-86fc-d5f4abdd9aab", 3, 0, 0.0, 475.6666666666667, 356, 572, 499.0, 572.0, 572.0, 572.0, 0.01658292290599141, 0.02286089795145626, 0.01063423116041767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9aec151-0dc3-4cea-aec6-7c0508b6a949", 3, 0, 0.0, 429.6666666666667, 234, 546, 509.0, 546.0, 546.0, 546.0, 0.02526762627496231, 0.025341652523814737, 0.01620352335992049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 129.44444444444443, 126, 133, 129.0, 133.0, 133.0, 133.0, 0.08997255836969724, 0.06686437199154258, 0.04516200683791444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 172.38888888888889, 124, 396, 130.0, 385.20000000000005, 396.0, 396.0, 0.08997345782994016, 0.02407492914590196, 0.051312987668637754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 200.11111111111111, 126, 390, 129.0, 386.4, 390.0, 390.0, 0.08997525680437879, 0.024251143435555223, 0.05289560995726175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 171.77777777777774, 125, 388, 129.0, 384.4, 388.0, 388.0, 0.089975706559229, 0.024251264658542195, 0.05298374126485849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c00635ff-1aed-4689-9f28-198eff677fe9", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 50.0, 0.3852080123266564], "isController": false}, {"data": ["401/Unauthorized", 5, 50.0, 0.3852080123266564], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 10, "406/Not Acceptable", 5, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
