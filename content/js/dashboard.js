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

    var data = {"OkPercent": 98.27302631578948, "KoPercent": 1.7269736842105263};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7214835549335199, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afa281d7-f53d-4ac3-b8b5-32ae4c1ef702"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d87f992c-2acb-4a2b-ad2c-97992beb68ef"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef2281f1-8e1c-4b79-9d93-be9b1c69e42c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=baa21d7b-9896-4543-b092-c37fde321551"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a39b062-7567-4a76-9780-14784d66de47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8125e1bb-433d-4224-a166-00264f83d041"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9a5cf72-16ab-4081-89e4-a292275c31a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.525, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45c63f5b-dd72-481c-9092-9ae4c8ceabdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3ceb28d-09a5-44c2-a760-8d16f9f1959c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3e880177-94d1-49b0-8a35-f357e3a641f5"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64beb961-67f9-4bbe-bff0-3a9f27e4831c"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef2281f1-8e1c-4b79-9d93-be9b1c69e42c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.18269230769230768, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69bd3bce-119b-4a21-b558-df0705ad28a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bf1ff02-a1e1-4650-9024-b71c430afee7"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/baa21d7b-9896-4543-b092-c37fde321551"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d87f992c-2acb-4a2b-ad2c-97992beb68ef"], "isController": false}, {"data": [0.2830188679245283, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3897f4bd-73c8-4b6b-9961-cfc7987745d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8125e1bb-433d-4224-a166-00264f83d041"], "isController": false}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2998b0b9-45ac-41fc-a638-84e1a072614a"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7d8b86c-5cc2-4b9a-b242-75546a2ed2e0"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9683544303797469, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a39b062-7567-4a76-9780-14784d66de47"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9a5cf72-16ab-4081-89e4-a292275c31a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3897f4bd-73c8-4b6b-9961-cfc7987745d9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45c63f5b-dd72-481c-9092-9ae4c8ceabdb"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3ceb28d-09a5-44c2-a760-8d16f9f1959c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69bd3bce-119b-4a21-b558-df0705ad28a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e23a0909-5328-47ca-a2da-f66041f859ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e880177-94d1-49b0-8a35-f357e3a641f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/84363275-902c-41be-bfae-36d66317a6cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64beb961-67f9-4bbe-bff0-3a9f27e4831c"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1216, 21, 1.7269736842105263, 499.8437499999995, 136, 2740, 163.5, 1431.8999999999999, 1711.6499999999985, 2122.9799999999996, 4.805184541215522, 693.3300850712282, 3.4895650673259304], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/afa281d7-f53d-4ac3-b8b5-32ae4c1ef702", 2, 0, 0.0, 360.5, 267, 454, 360.5, 454.0, 454.0, 454.0, 0.01757469244288225, 0.02485171353251318, 0.010924113027240773], "isController": false}, {"data": ["see books", 52, 0, 0.0, 2445.6538461538453, 1817, 3252, 2348.5, 3071.9, 3148.3499999999995, 3252.0, 0.24308948030273989, 292.5183213721817, 1.1952690755120072], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d87f992c-2acb-4a2b-ad2c-97992beb68ef", 3, 0, 0.0, 568.0, 238, 1021, 445.0, 1021.0, 1021.0, 1021.0, 0.06230788402425854, 0.02819269491983052, 0.039956553231702246], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 539.9375000000001, 150, 992, 522.0, 914.3000000000001, 992.0, 992.0, 0.0851562084198201, 0.01720899695300442, 0.05711557460482197], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 539.9375000000001, 150, 992, 522.0, 914.3000000000001, 992.0, 992.0, 0.08563339274149954, 0.01730542989301178, 0.057435629445577306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef2281f1-8e1c-4b79-9d93-be9b1c69e42c", 3, 0, 0.0, 372.0, 231, 544, 341.0, 544.0, 544.0, 544.0, 0.016067096193704913, 0.02214978918630869, 0.010303443848176651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 231.1764705882353, 142, 441, 147.0, 439.4, 441.0, 441.0, 0.11671655727350123, 0.031230797551698573, 0.06656491157004367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 147.4705882352941, 140, 155, 148.0, 154.2, 155.0, 155.0, 0.11671335200746966, 0.08673716882586367, 0.058584631769374416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 195.52941176470588, 137, 440, 146.0, 429.59999999999997, 440.0, 440.0, 0.11649101648690505, 0.03139796928748612, 0.0685977372476599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 264.70588235294116, 139, 441, 151.0, 439.4, 441.0, 441.0, 0.11648622721666438, 0.03139667842949157, 0.06848116092229684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=baa21d7b-9896-4543-b092-c37fde321551", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 282.3124999999999, 147, 460, 248.0, 455.8, 460.0, 460.0, 0.08527057419072895, 0.15219527594357218, 0.05511048035312677], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a39b062-7567-4a76-9780-14784d66de47", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8125e1bb-433d-4224-a166-00264f83d041", 3, 0, 0.0, 476.6666666666667, 460, 499, 471.0, 499.0, 499.0, 499.0, 0.019560284797746654, 0.023119594433794955, 0.01254354200897165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 187.6428571428571, 142, 443, 147.0, 438.0, 443.0, 443.0, 0.08264170100232578, 0.061416342248798744, 0.04148226007343305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 204.92857142857144, 142, 436, 143.0, 435.5, 436.0, 436.0, 0.08264267667823663, 0.03984557625557838, 0.04614062389317844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 896.0, 726, 1122, 868.0, 1122.0, 1122.0, 1122.0, 0.03144258583825934, 9.245164228556156, 0.01793209973588228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1584.5, 1550, 1598, 1595.0, 1598.0, 1598.0, 1598.0, 0.03132562200938203, 28.186849748611884, 0.017834802374482147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 219.5, 147, 432, 149.5, 432.0, 432.0, 432.0, 0.03168542707995026, 0.05606835338756822, 0.017544567533527143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 150.9, 145, 171, 148.5, 169.10000000000002, 171.0, 171.0, 0.04659072378689403, 0.034624551564283554, 0.02338635940084329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 174.20000000000002, 141, 434, 146.5, 405.4000000000001, 434.0, 434.0, 0.04659094085745968, 0.026462198440135302, 0.02578881374805483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 459.2, 144, 1608, 148.0, 1600.6, 1608.0, 1608.0, 0.0462917957050472, 8.340669497988621, 0.026418872470732015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 348.3, 141, 1164, 146.5, 1163.6, 1164.0, 1164.0, 0.04637122016591623, 2.736934473988064, 0.026509484653444684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9a5cf72-16ab-4081-89e4-a292275c31a0", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 150.0, 148, 153, 149.5, 153.0, 153.0, 153.0, 0.03168341927460812, 0.023545978582008572, 0.017790982502831707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 936.1999999999999, 137, 2118, 876.0, 1879.8000000000002, 2106.5499999999997, 2118.0, 0.11210448137664304, 50.45101253117906, 0.0610881841876629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 371.7857142857142, 140, 1606, 145.5, 1373.5, 1606.0, 1606.0, 0.08264365237718563, 10.642364851802222, 0.04757083003742577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 636.0000000000001, 142, 1265, 515.5, 1170.3, 1260.3, 1265.0, 0.11210699491594778, 16.496697573163825, 0.06119903335743633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 349.35714285714283, 140, 1128, 151.0, 1125.0, 1128.0, 1128.0, 0.08264267667823663, 3.490477091745177, 0.04765097415055135], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 417.4000000000001, 148, 1133, 480.0, 816.2000000000002, 1133.0, 1133.0, 0.08648673581761677, 0.017601402094132163, 0.05839543861748069], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 612.6, 294, 1758, 301.0, 1750.4, 1758.0, 1758.0, 0.04626010204978512, 11.125988231430037, 0.10167283757152967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 623.090909090909, 263, 1142, 529.5, 1103.2, 1138.7, 1142.0, 0.09666123313371323, 0.05937491761826722, 0.043705225528231674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 161.39999999999995, 140, 428, 147.5, 156.3, 414.4499999999998, 428.0, 0.11210259629613022, 0.08331062088022959, 0.05627024853145599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 205.2, 140, 448, 148.0, 444.5, 447.85, 448.0, 0.11210825172786842, 0.11418838530485036, 0.05922906658669611], "isController": false}, {"data": ["login", 22, 0, 0.0, 2847.590909090909, 1882, 4286, 2712.0, 3966.7999999999997, 4254.049999999999, 4286.0, 0.0994516597125847, 21.771049000284794, 0.18003540422579142], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 150.07142857142858, 147, 154, 150.0, 154.0, 154.0, 154.0, 0.08261731658955716, 0.06688452680931924, 0.029367874256444153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45c63f5b-dd72-481c-9092-9ae4c8ceabdb", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3ceb28d-09a5-44c2-a760-8d16f9f1959c", 3, 0, 0.0, 360.0, 256, 499, 325.0, 499.0, 499.0, 499.0, 0.039072166291139736, 0.0255775151079043, 0.02505604413852385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1100.35, 288, 2268, 1168.5, 2029.9, 2256.5499999999997, 2268.0, 0.11200905033126676, 67.08767849692255, 0.23758169660108538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e880177-94d1-49b0-8a35-f357e3a641f5", 3, 0, 0.0, 892.6666666666666, 388, 1781, 509.0, 1781.0, 1781.0, 1781.0, 0.0684134911404529, 0.030955323139723153, 0.04387193279514721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 449.82352941176464, 291, 592, 577.0, 591.2, 592.0, 592.0, 0.11636662331439523, 0.1803455382811965, 0.2617112631768088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 782.0000000000002, 146, 1752, 147.5, 1751.4, 1752.0, 1752.0, 0.07015131638945205, 33.581407752772726, 0.09116245773383187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64beb961-67f9-4bbe-bff0-3a9f27e4831c", 3, 0, 0.0, 377.0, 240, 482, 409.0, 482.0, 482.0, 482.0, 0.0704043556828049, 0.031168594963741757, 0.04514862652836123], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1188.833333333333, 296, 2050, 1206.5, 1852.0, 2013.75, 2050.0, 0.09690118098314322, 0.03070745432522459, 0.043719087513879075], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef2281f1-8e1c-4b79-9d93-be9b1c69e42c", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 150.64285714285714, 147, 165, 149.0, 161.0, 165.0, 165.0, 0.076029521176937, 0.059026825523110255, 0.02702611885586432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 644.9285714285714, 289, 2049, 584.0, 1666.0, 2049.0, 2049.0, 0.082571999834856, 14.221805901243888, 0.1826882457283735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 569.2307692307693, 290, 1695, 572.0, 1312.9999999999995, 1695.0, 1695.0, 0.08870208381664597, 8.28986007246278, 0.19774727624899358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 173.7, 139, 426, 147.5, 398.30000000000007, 426.0, 426.0, 0.051584681413007594, 0.038335881401658965, 0.025893092037388578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 173.1, 139, 423, 147.0, 395.60000000000014, 423.0, 423.0, 0.051582552717368876, 0.013802362738827218, 0.029418174596624436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 145.0, 139, 149, 146.5, 148.9, 149.0, 149.0, 0.05158414922262687, 0.013903540220161149, 0.030325837726583375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 203.10000000000002, 141, 438, 145.5, 437.8, 438.0, 438.0, 0.051582552717368876, 0.01390310991210333, 0.030375272742747494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 156.0, 148, 171, 149.0, 171.0, 171.0, 171.0, 0.02663163127618777, 0.00785425063028194, 0.016462717380690294], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1710.653846153846, 1141, 2640, 1654.0, 2387.000000000001, 2545.7999999999993, 2640.0, 0.24384868251370478, 291.72779980492106, 0.48150589457295995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1188.833333333333, 296, 2050, 1206.5, 1852.0, 2013.75, 2050.0, 0.0949239421913192, 0.030080878165120197, 0.042827012980849094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 186.57142857142858, 137, 439, 145.0, 439.0, 439.0, 439.0, 0.03945707070707071, 0.010634913589015152, 0.023234974254261364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 145.7142857142857, 138, 150, 148.0, 150.0, 150.0, 150.0, 0.03945551390806865, 0.01063449398303413, 0.023195526731110673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69bd3bce-119b-4a21-b558-df0705ad28a8", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bf1ff02-a1e1-4650-9024-b71c430afee7", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 420.0714285714285, 142, 1737, 146.0, 1643.0, 1737.0, 1737.0, 0.07419105255906137, 9.553888621344766, 0.04270539660416954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 372.99999999999994, 139, 1167, 291.5, 1020.5, 1167.0, 1167.0, 0.07419262525304986, 3.1335826625083465, 0.04277875560419294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 185.99999999999997, 142, 436, 144.0, 436.0, 436.0, 436.0, 0.03945729311695705, 0.010557908509810773, 0.02250298748076457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 208.92857142857142, 141, 442, 148.0, 439.0, 442.0, 442.0, 0.07430445720594012, 0.055220402279023854, 0.03729735449595041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 186.57142857142858, 141, 430, 146.0, 430.0, 430.0, 430.0, 0.03945640349245537, 0.029322581111092323, 0.01980526503429889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 189.0, 138, 447, 147.0, 444.0, 447.0, 447.0, 0.07430761228410986, 0.03582688449412439, 0.04148703464857807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 155.0, 149, 170, 154.0, 170.0, 170.0, 170.0, 0.03985787819432424, 0.03137250959436068, 0.014168230139388694], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 429.6666666666667, 146, 591, 480.0, 563.4, 591.0, 591.0, 0.08631354834997268, 0.017094128520873494, 0.058733672353770465], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/baa21d7b-9896-4543-b092-c37fde321551", 3, 0, 0.0, 366.0, 252, 591, 255.0, 591.0, 591.0, 591.0, 0.022325581395348838, 0.022390988372093024, 0.01431686046511628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1479.0, 993, 2740, 1383.5, 1988.8, 2627.499999999998, 2740.0, 0.09633447329126728, 0.0498606160589567, 0.044310094648620006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 376.85714285714283, 289, 870, 295.0, 870.0, 870.0, 870.0, 0.03942329353457986, 0.06109840511658031, 0.08866391114271233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d87f992c-2acb-4a2b-ad2c-97992beb68ef", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["addBook", 53, 4, 7.547169811320755, 1532.1886792452833, 733, 2806, 1179.0, 2564.4, 2674.8999999999996, 2806.0, 0.2465815882645774, 95.60581814055384, 0.8924725081883698], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3897f4bd-73c8-4b6b-9961-cfc7987745d9", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8125e1bb-433d-4224-a166-00264f83d041", 1, 0, 0.0, 1133.0, 1133, 1133, 1133.0, 1133.0, 1133.0, 1133.0, 0.88261253309797, 0.15945636584289496, 0.6085199691085613], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 264.67307692307685, 136, 596, 149.0, 589.5, 592.35, 596.0, 0.24568399368781124, 0.18258351484025817, 0.11876325866744782], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 953.9807692307692, 699, 1444, 869.0, 1173.0, 1275.4999999999998, 1444.0, 0.2453443549566637, 72.13938655654479, 0.12339095976824395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2998b0b9-45ac-41fc-a638-84e1a072614a", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 212.84615384615384, 136, 582, 149.0, 441.7, 447.09999999999997, 582.0, 0.2461818147387159, 0.43562641436186833, 0.11972514037097706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7d8b86c-5cc2-4b9a-b242-75546a2ed2e0", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1443.2307692307697, 991, 2048, 1448.5, 1862.6000000000001, 1956.8999999999992, 2048.0, 0.24457007402948008, 220.06458252005945, 0.12276271294057887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 150.84615384615387, 144, 168, 150.0, 163.6, 168.0, 168.0, 0.0900869685735075, 0.06730129976438792, 0.03202310211011399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 4, 2.5316455696202533, 207.10126582278482, 141, 1056, 154.0, 334.39999999999986, 387.64999999999975, 884.899999999999, 0.6621933688458975, 1.4909255540630593, 0.31730371781761185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 181.3, 149, 424, 151.0, 398.30000000000007, 424.0, 424.0, 0.05072382904040661, 0.039281246512736755, 0.018030736104207034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a39b062-7567-4a76-9780-14784d66de47", 3, 0, 0.0, 430.3333333333333, 270, 523, 498.0, 523.0, 523.0, 523.0, 0.018685418522232534, 0.025759357891163667, 0.011982511226822295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9a5cf72-16ab-4081-89e4-a292275c31a0", 3, 0, 0.0, 392.0, 234, 502, 440.0, 502.0, 502.0, 502.0, 0.08397010664203544, 0.0379942865339939, 0.053848017605732365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 185.2941176470588, 148, 438, 150.0, 429.2, 438.0, 438.0, 0.1218026796589525, 0.09884572929354446, 0.04329704628501827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3897f4bd-73c8-4b6b-9961-cfc7987745d9", 3, 0, 0.0, 595.3333333333334, 227, 1079, 480.0, 1079.0, 1079.0, 1079.0, 0.01893700290367378, 0.02238289633568994, 0.012143846263098095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45c63f5b-dd72-481c-9092-9ae4c8ceabdb", 3, 0, 0.0, 419.3333333333333, 244, 545, 469.0, 545.0, 545.0, 545.0, 0.038494604339625066, 0.032091367745371024, 0.024685667496439245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 379.6, 286, 865, 296.0, 837.0000000000001, 865.0, 865.0, 0.05154532896228944, 0.07988519244448568, 0.1159266529298365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 694.4285714285713, 290, 1991, 576.5, 1940.0, 1991.0, 1991.0, 0.0741321246266918, 12.768162205060047, 0.16401525731789973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3ceb28d-09a5-44c2-a760-8d16f9f1959c", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69bd3bce-119b-4a21-b558-df0705ad28a8", 3, 0, 0.0, 352.6666666666667, 233, 476, 349.0, 476.0, 476.0, 476.0, 0.023751652719168376, 0.023821237639244063, 0.015231365838789616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e23a0909-5328-47ca-a2da-f66041f859ea", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.9046343838526912, 1.6903107294617565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e880177-94d1-49b0-8a35-f357e3a641f5", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 176.79999999999998, 146, 409, 151.5, 383.7000000000001, 409.0, 409.0, 0.0452177687744176, 0.03749012274363334, 0.016073503744031256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 217.59999999999997, 142, 609, 152.0, 447.0, 600.8999999999999, 609.0, 0.11004792587171713, 0.08543759869923351, 0.03911859864971195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84363275-902c-41be-bfae-36d66317a6cb", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.49356404559505407, 0.9222251738794436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 147.69230769230768, 143, 157, 148.0, 153.8, 157.0, 157.0, 0.08896005693443644, 0.06611191731162708, 0.04465377857841829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 210.46153846153842, 141, 435, 146.0, 433.8, 435.0, 435.0, 0.08896066569950456, 0.03408198580735226, 0.05016066381764432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 353.84615384615387, 142, 1547, 148.0, 1164.5999999999997, 1547.0, 1547.0, 0.08879296213321676, 6.167942549672833, 0.05161357729768865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64beb961-67f9-4bbe-bff0-3a9f27e4831c", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 287.3076923076923, 141, 871, 147.0, 699.3999999999999, 871.0, 871.0, 0.08896492728828058, 2.034337574850299, 0.051800417023096665], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.41118421052631576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 14.285714285714286, 0.24671052631578946], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 14.285714285714286, 0.24671052631578946], "isController": false}, {"data": ["401/Unauthorized", 10, 47.61904761904762, 0.8223684210526315], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1216, 21, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
