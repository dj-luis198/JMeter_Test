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

    var data = {"OkPercent": 97.37051792828686, "KoPercent": 2.6294820717131473};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7778532608695652, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.30392156862745096, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f248eb8b-89ee-4998-9972-9239e96f2a04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8111a6a8-0e77-4fee-bb89-bf5cb89129e0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b2b59f2-41a7-47eb-bcb0-7cc28be58ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea7bb8c6-b9eb-4f33-82f3-eba8af39e8bf"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/25f2f12b-3c48-437a-b2e4-4af3ee808685"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5454d8f3-9949-44ce-8394-826c34ed0625"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=add4bb56-61d9-4005-8e17-0052ed887996"], "isController": false}, {"data": [0.6304347826086957, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78fa86ab-3e47-430c-b224-0aaa90cc24b0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b174245-05e9-480c-bbeb-3cf766ad53d2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05a33a56-1b4e-4fa2-b9e5-72f92234bdba"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea7bb8c6-b9eb-4f33-82f3-eba8af39e8bf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c3fd2a89-9eef-4ae4-9950-ef81ff18446e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b2b59f2-41a7-47eb-bcb0-7cc28be58ca6"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5454d8f3-9949-44ce-8394-826c34ed0625"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25f2f12b-3c48-437a-b2e4-4af3ee808685"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fce73639-9406-4536-a54c-70edd323a1d5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8111a6a8-0e77-4fee-bb89-bf5cb89129e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78fa86ab-3e47-430c-b224-0aaa90cc24b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=169ae6b9-a579-4817-82a0-863c406658bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/807f992a-5633-4852-a04f-8889f2a4feb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4c15173-9aa7-423b-bf39-9aabe3877b08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7156862745098039, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9151515151515152, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/169ae6b9-a579-4817-82a0-863c406658bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/add4bb56-61d9-4005-8e17-0052ed887996"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b174245-05e9-480c-bbeb-3cf766ad53d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05a33a56-1b4e-4fa2-b9e5-72f92234bdba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f248eb8b-89ee-4998-9972-9239e96f2a04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3fd2a89-9eef-4ae4-9950-ef81ff18446e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1255, 33, 2.6294820717131473, 344.3394422310754, 81, 3216, 107.0, 941.8000000000002, 1174.8000000000002, 1951.5200000000004, 4.929784935677109, 679.8919461357165, 3.6001830563193558], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 0, 0.0, 1441.450980392157, 1041, 1886, 1395.0, 1749.4, 1782.3999999999999, 1886.0, 0.23815638936234795, 286.5818365257769, 1.1710131058978728], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f248eb8b-89ee-4998-9972-9239e96f2a04", 3, 0, 0.0, 279.0, 177, 479, 181.0, 479.0, 479.0, 479.0, 0.07487084778756645, 0.03475450160972322, 0.048012880905438114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8111a6a8-0e77-4fee-bb89-bf5cb89129e0", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b2b59f2-41a7-47eb-bcb0-7cc28be58ca6", 3, 0, 0.0, 449.3333333333333, 221, 699, 428.0, 699.0, 699.0, 699.0, 0.025032751182797495, 0.030027893264521082, 0.016052903590530944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea7bb8c6-b9eb-4f33-82f3-eba8af39e8bf", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 561.2666666666667, 88, 1028, 547.0, 1025.6, 1028.0, 1028.0, 0.09974929676745779, 0.02030054047493965, 0.06684371820491165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 561.2666666666667, 88, 1028, 547.0, 1025.6, 1028.0, 1028.0, 0.10147339367617811, 0.020651421134878434, 0.06799906517636076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 148.0, 84, 257, 89.0, 254.9, 257.0, 257.0, 0.09352623118515271, 0.04258457547859126, 0.05235733596375859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 121.12499999999999, 84, 263, 88.5, 261.6, 263.0, 263.0, 0.09351475195212045, 0.06949680296441764, 0.04694002197596671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 179.12500000000003, 83, 646, 87.0, 548.7, 646.0, 646.0, 0.09352623118515271, 3.4595343781966976, 0.054069852403916416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 227.56249999999997, 84, 981, 88.0, 959.3000000000001, 981.0, 981.0, 0.09352568449110338, 10.541378996031003, 0.05397820267015829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25f2f12b-3c48-437a-b2e4-4af3ee808685", 3, 0, 0.0, 832.3333333333333, 188, 1809, 500.0, 1809.0, 1809.0, 1809.0, 0.02673558506371981, 0.026987971771678106, 0.017144890161304698], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 194.875, 85, 428, 187.5, 374.1000000000001, 428.0, 428.0, 0.09063820626989791, 0.1647243182307422, 0.05857405566318842], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 125.375, 85, 350, 88.5, 285.6000000000001, 350.0, 350.0, 0.1057711377007999, 0.07860530838897335, 0.05309215310372182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5454d8f3-9949-44ce-8394-826c34ed0625", 3, 0, 0.0, 307.3333333333333, 190, 396, 336.0, 396.0, 396.0, 396.0, 0.028771734647881922, 0.028856026839233134, 0.0184506241068774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 603.25, 482, 678, 666.0, 678.0, 678.0, 678.0, 0.035419074056856466, 10.414383796659097, 0.020199940673050955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 108.25, 83, 261, 87.0, 252.60000000000002, 261.0, 261.0, 0.10576973927759269, 0.03823049292003808, 0.05976661659130573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 875.375, 749, 998, 885.0, 998.0, 998.0, 998.0, 0.03539556759004854, 31.84899393629683, 0.0201519686572249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 168.99999999999997, 83, 255, 168.0, 255.0, 255.0, 255.0, 0.035485058572524805, 0.06279192005216304, 0.019648465049435123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 120.4, 85, 259, 86.0, 258.3, 259.0, 259.0, 0.05247635940009026, 0.038998544436981135, 0.026340672589498428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 120.39999999999999, 83, 254, 86.5, 253.9, 254.0, 254.0, 0.05247718554358492, 0.021923574194868782, 0.02948766851736208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 205.5, 83, 945, 86.5, 876.3000000000003, 945.0, 945.0, 0.05247718554358492, 4.734636196991483, 0.030399869594193926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 143.2, 84, 505, 85.0, 479.5000000000001, 505.0, 505.0, 0.05247718554358492, 1.555733312910962, 0.030451116845701332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 199.125, 85, 270, 251.0, 270.0, 270.0, 270.0, 0.03551152126918177, 0.02639088641196028, 0.01994055149392531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 538.0588235294117, 82, 1089, 705.0, 1037.0, 1089.0, 1089.0, 0.08490787495567309, 40.457963461207086, 0.04605354752593436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 181.31249999999997, 85, 906, 89.0, 455.90000000000043, 906.0, 906.0, 0.10577323540494622, 5.97516131451341, 0.061614975506885175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 390.29411764705895, 82, 772, 494.0, 713.5999999999999, 772.0, 772.0, 0.08497323343146909, 13.23810538742796, 0.04617197926403183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 146.125, 84, 703, 86.5, 393.6000000000003, 703.0, 703.0, 0.10577393465815187, 1.9705430954411436, 0.06171867769359936], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 484.80000000000007, 89, 1347, 444.0, 1183.2, 1347.0, 1347.0, 0.10149536504499629, 0.02065589265173557, 0.06852919471885784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 328.09999999999997, 170, 1030, 176.0, 978.7000000000002, 1030.0, 1030.0, 0.052452962805604075, 6.3483605744517355, 0.11662588448808532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=add4bb56-61d9-4005-8e17-0052ed887996", 1, 0, 0.0, 1347.0, 1347, 1347, 1347.0, 1347.0, 1347.0, 1347.0, 0.7423904974016332, 0.13412328322197475, 0.5118434484038604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 872.5652173913041, 110, 2420, 834.0, 1398.4, 2219.9999999999973, 2420.0, 0.0997835131605777, 0.06129280251758142, 0.045116959563815895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 97.6470588235294, 84, 247, 88.0, 127.7999999999999, 247.0, 247.0, 0.08497663142635775, 0.0631515786283772, 0.04265428569643348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 168.29411764705884, 82, 270, 92.0, 265.2, 270.0, 270.0, 0.08490745087854239, 0.0902336765425686, 0.04464859865246881], "isController": false}, {"data": ["login", 23, 0, 0.0, 3402.130434782609, 1524, 5461, 3336.0, 4783.200000000001, 5366.399999999999, 5461.0, 0.09869253841499782, 41.20028799179994, 0.205828753159234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 96.5, 87, 118, 94.0, 106.80000000000001, 118.0, 118.0, 0.10914275189806066, 0.08835873176122294, 0.038796837588763754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78fa86ab-3e47-430c-b224-0aaa90cc24b0", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 651.8235294117648, 170, 1178, 855.0, 1125.2, 1178.0, 1178.0, 0.08487014867253102, 53.81529931080446, 0.17937887064042016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b174245-05e9-480c-bbeb-3cf766ad53d2", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05a33a56-1b4e-4fa2-b9e5-72f92234bdba", 3, 0, 0.0, 485.66666666666663, 253, 941, 263.0, 941.0, 941.0, 941.0, 0.022503938189183108, 0.02659889308754032, 0.014431236403870677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 625.3333333333333, 85, 1188, 959.0, 1182.6, 1188.0, 1188.0, 0.06634115274387008, 42.33739472488324, 0.1002200591320808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 391.25, 171, 1067, 337.0, 1046.0, 1067.0, 1067.0, 0.09346777114416235, 14.104243309021978, 0.2072218822656588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea7bb8c6-b9eb-4f33-82f3-eba8af39e8bf", 3, 0, 0.0, 387.0, 179, 524, 458.0, 524.0, 524.0, 524.0, 0.06401365624666597, 0.028964512429318252, 0.04105042409047263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3fd2a89-9eef-4ae4-9950-ef81ff18446e", 3, 0, 0.0, 1238.3333333333335, 229, 3215, 271.0, 3215.0, 3215.0, 3215.0, 0.01942288144920593, 0.02295718832749568, 0.012455428533507708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b2b59f2-41a7-47eb-bcb0-7cc28be58ca6", 1, 0, 0.0, 1074.0, 1074, 1074, 1074.0, 1074.0, 1074.0, 1074.0, 0.931098696461825, 0.16821607309124767, 0.6419489059590316], "isController": false}, {"data": ["register", 25, 8, 32.0, 1317.12, 343, 2136, 1277.0, 1800.4, 2042.6999999999998, 2136.0, 0.10329724816130897, 0.03232881063548467, 0.046604813135278075], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 318.6875, 172, 1159, 182.5, 767.7000000000004, 1159.0, 1159.0, 0.1057075468581735, 8.057522919130424, 0.236048358725167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 114.93750000000001, 84, 268, 93.0, 261.7, 268.0, 268.0, 0.11134772502679303, 0.08644672011357468, 0.039580636630617845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5454d8f3-9949-44ce-8394-826c34ed0625", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25f2f12b-3c48-437a-b2e4-4af3ee808685", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 244.73333333333332, 173, 354, 187.0, 349.8, 354.0, 354.0, 0.08409863087428937, 0.1303364523413059, 0.18913979189793792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fce73639-9406-4536-a54c-70edd323a1d5", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8111a6a8-0e77-4fee-bb89-bf5cb89129e0", 3, 0, 0.0, 1324.3333333333333, 351, 3216, 406.0, 3216.0, 3216.0, 3216.0, 0.02726677815749291, 0.02734666129662619, 0.01748553156584018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 88.8, 85, 94, 88.0, 93.9, 94.0, 94.0, 0.07923176877000601, 0.058882203158178305, 0.03977063393338193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 86.7, 83, 93, 85.5, 92.9, 93.0, 93.0, 0.0792342799188641, 0.02120136005641481, 0.04518830026622718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 121.20000000000002, 83, 255, 87.5, 254.7, 255.0, 255.0, 0.07912894853453188, 0.021327724409698042, 0.04651916700955878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 92.33333333333333, 89, 95, 93.0, 95.0, 95.0, 95.0, 0.022605681561299072, 0.00666690999171125, 0.013974019949513977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 105.1, 84, 261, 87.0, 244.20000000000005, 261.0, 261.0, 0.079233652116727, 0.02135594529708658, 0.04665809787733046], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 987.8039215686274, 675, 1498, 931.0, 1365.0, 1387.2, 1498.0, 0.24399462254988732, 291.90239482516114, 0.48179406913659395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1317.12, 343, 2136, 1277.0, 1800.4, 2042.6999999999998, 2136.0, 0.09979004175215347, 0.03123116462961928, 0.045022460243647366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 108.875, 82, 253, 87.5, 253.0, 253.0, 253.0, 0.03586125281286702, 0.009665728297218063, 0.021117515084139466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 89.25, 83, 106, 87.5, 106.0, 106.0, 106.0, 0.03588731383455949, 0.009672752556971111, 0.021097815359770324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 116.75000000000003, 84, 258, 85.5, 250.3, 258.0, 258.0, 0.11368238562486234, 0.030640955500451178, 0.06683280873649133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 126.99999999999997, 81, 254, 87.0, 251.9, 254.0, 254.0, 0.11367996248561238, 0.03064030238870021, 0.06694239978400807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 88.375, 82, 103, 86.5, 103.0, 103.0, 103.0, 0.03588715284786988, 0.009602617070621431, 0.020466891858550787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 108.68749999999997, 84, 257, 88.0, 254.2, 257.0, 257.0, 0.1135420140934025, 0.08438034445808526, 0.056992768792977426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 89.125, 85, 95, 89.0, 95.0, 95.0, 95.0, 0.03588731383455949, 0.02667016194150368, 0.018013749327112867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 106.8125, 82, 255, 86.0, 252.2, 255.0, 255.0, 0.11368157790030126, 0.03041870346160405, 0.06483402489626557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 90.875, 86, 97, 90.0, 97.0, 97.0, 97.0, 0.03742479954341745, 0.02945741057811959, 0.01330334671269917], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 719.8, 85, 3215, 458.0, 2371.4000000000005, 3215.0, 3215.0, 0.1019749141711139, 0.020195813079982323, 0.06939074237737516], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1813.6521739130437, 985, 3111, 1716.0, 2635.2000000000007, 3053.599999999999, 3111.0, 0.10157709480676062, 0.0525740822730304, 0.04672149575584399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 200.37499999999997, 169, 345, 179.5, 345.0, 345.0, 345.0, 0.03584663019272045, 0.055555275503757176, 0.08061991145882343], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 882.6315789473687, 439, 2474, 749.0, 1581.0, 1754.5999999999995, 2474.0, 0.25256777235224787, 69.9283951672043, 0.9192752066513945], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78fa86ab-3e47-430c-b224-0aaa90cc24b0", 3, 0, 0.0, 272.3333333333333, 174, 438, 205.0, 438.0, 438.0, 438.0, 0.026369685409653062, 0.031168075430485116, 0.01691024747949757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=169ae6b9-a579-4817-82a0-863c406658bc", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/807f992a-5633-4852-a04f-8889f2a4feb4", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4c15173-9aa7-423b-bf39-9aabe3877b08", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 161.92156862745105, 83, 361, 91.0, 350.0, 354.8, 361.0, 0.24488032074520444, 0.18198625399130916, 0.11837476442273066], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 553.5098039215684, 404, 842, 506.0, 727.8000000000001, 769.8, 842.0, 0.2448379988574227, 71.99050105076309, 0.12313629825348894], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 129.76470588235293, 82, 358, 89.0, 258.0, 263.8, 358.0, 0.24522413967197668, 0.4339317784039274, 0.11925939605141052], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 824.0196078431375, 581, 1296, 764.0, 1021.8000000000001, 1095.0, 1296.0, 0.24444018404907975, 219.947707287373, 0.12269751425901075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 102.8, 85, 275, 89.0, 176.60000000000005, 275.0, 275.0, 0.08598649438794813, 0.06423795723318391, 0.030565511676965938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 12, 7.2727272727272725, 153.17575757575756, 84, 1118, 96.0, 262.80000000000007, 370.1999999999998, 772.1600000000018, 0.683399602385686, 1.4623521889496356, 0.32954939633035124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 112.0, 90, 258, 94.5, 243.00000000000006, 258.0, 258.0, 0.07403568520026653, 0.05733427574590953, 0.026317372473532243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/169ae6b9-a579-4817-82a0-863c406658bc", 3, 0, 0.0, 371.3333333333333, 194, 578, 342.0, 578.0, 578.0, 578.0, 0.03148085963734049, 0.026244297373446943, 0.020187921056497648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 91.375, 85, 111, 90.5, 102.60000000000001, 111.0, 111.0, 0.10173392762902723, 0.08255946665988441, 0.03616323208688078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 212.2, 171, 349, 180.0, 348.1, 349.0, 349.0, 0.07907326137666548, 0.12254811113746886, 0.1778376181156842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 248.37500000000006, 171, 516, 180.0, 504.8, 516.0, 516.0, 0.11347195824231937, 0.17585937278375083, 0.2552010935859976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/add4bb56-61d9-4005-8e17-0052ed887996", 3, 0, 0.0, 417.6666666666667, 187, 569, 497.0, 569.0, 569.0, 569.0, 0.018499448099798355, 0.021865721370562443, 0.011863252850456628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 107.8, 87, 247, 91.5, 232.70000000000005, 247.0, 247.0, 0.05405288534301961, 0.04481533169553091, 0.0192141115867765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 104.05882352941177, 89, 269, 93.0, 135.39999999999986, 269.0, 269.0, 0.0828965012800195, 0.0643581235523589, 0.029467115689381936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b174245-05e9-480c-bbeb-3cf766ad53d2", 3, 0, 0.0, 322.0, 220, 452, 294.0, 452.0, 452.0, 452.0, 0.0447267197423741, 0.028754971188538033, 0.028682173793124013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05a33a56-1b4e-4fa2-b9e5-72f92234bdba", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f248eb8b-89ee-4998-9972-9239e96f2a04", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3fd2a89-9eef-4ae4-9950-ef81ff18446e", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 86.8, 85, 89, 87.0, 88.4, 89.0, 89.0, 0.0841472239830808, 0.06253519282336376, 0.04223796203838236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 145.06666666666663, 83, 267, 97.0, 264.0, 267.0, 267.0, 0.08414344774972372, 0.022514945979906546, 0.047988060044764316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 120.86666666666665, 82, 251, 87.0, 251.0, 251.0, 251.0, 0.08414391976035811, 0.022679415872909024, 0.04946742157786679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 132.3333333333333, 84, 252, 88.0, 251.4, 252.0, 252.0, 0.08414061579712014, 0.02267852535156754, 0.04954764777896821], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.6374501992031872], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.3187250996015936], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.23904382470119523], "isController": false}, {"data": ["401/Unauthorized", 18, 54.54545454545455, 1.4342629482071714], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1255, 33, "401/Unauthorized", 18, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
