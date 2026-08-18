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

    var data = {"OkPercent": 98.29457364341086, "KoPercent": 1.7054263565891472};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7221480987324883, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d12f5011-8a28-4b5d-980d-3b54edce876c"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48375210-7c45-4d2a-9f0b-5d1709632613"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f9a2d51-1bde-4dca-b0d4-47900deb45b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c4aca33-1377-408d-b45f-10d9c83b8361"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4001e7b-1ba5-477e-a1ee-457747192185"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f565ef2a-2e10-4714-badc-f579fb82ddad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f28d4bce-99ee-4f7c-93ee-48f5a8f28c4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbd1a6ee-c9fe-4e44-b80e-4080fd8034cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c300a7f7-846a-46ee-976d-7e772816662f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ffd1d09a-3016-4d36-84a2-a669eaf3e1b2"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57258b62-96ef-4e3d-963f-d76060604dc4"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4445a69-7a45-4b7b-bb46-eb2d6502c0fd"], "isController": false}, {"data": [0.05, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c4aca33-1377-408d-b45f-10d9c83b8361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbd1a6ee-c9fe-4e44-b80e-4080fd8034cf"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4001e7b-1ba5-477e-a1ee-457747192185"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f9a2d51-1bde-4dca-b0d4-47900deb45b7"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7210abb3-f137-4217-8f53-7f33d4cd1278"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98fbecc0-69e2-405b-b3ff-df04c6f71a02"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48375210-7c45-4d2a-9f0b-5d1709632613"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f28d4bce-99ee-4f7c-93ee-48f5a8f28c4f"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d12f5011-8a28-4b5d-980d-3b54edce876c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9264705882352942, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fc789498-9b56-4d98-b6d7-a80b89b6ccc3"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57258b62-96ef-4e3d-963f-d76060604dc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffd1d09a-3016-4d36-84a2-a669eaf3e1b2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/c300a7f7-846a-46ee-976d-7e772816662f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e4445a69-7a45-4b7b-bb46-eb2d6502c0fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 22, 1.7054263565891472, 494.01937984496107, 138, 2712, 164.0, 1410.8000000000002, 1669.4000000000005, 2135.899999999999, 5.19949536680626, 745.9661557944144, 3.8037290634660885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/d12f5011-8a28-4b5d-980d-3b54edce876c", 3, 0, 0.0, 393.0, 354, 468, 357.0, 468.0, 468.0, 468.0, 0.01827674649543386, 0.02519597051046953, 0.011720439647136947], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2390.0357142857147, 1746, 2877, 2431.0, 2742.0, 2846.0, 2877.0, 0.24226168588176766, 291.52163101463304, 1.1911988168112306], "isController": true}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 622.6153846153846, 148, 1206, 570.0, 1176.4, 1206.0, 1206.0, 0.07418609296088109, 0.01470681335064342, 0.04987721844951065], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 622.6153846153846, 148, 1206, 570.0, 1176.4, 1206.0, 1206.0, 0.0759190586036733, 0.015050360250532892, 0.05104233582503576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48375210-7c45-4d2a-9f0b-5d1709632613", 3, 0, 0.0, 327.6666666666667, 230, 490, 263.0, 490.0, 490.0, 490.0, 0.06833246019634194, 0.03091865874769378, 0.04381996959205521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f9a2d51-1bde-4dca-b0d4-47900deb45b7", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 164.2, 142, 432, 145.0, 262.80000000000007, 432.0, 432.0, 0.09972608568465281, 0.026684519021088742, 0.05687503324202856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 183.20000000000002, 141, 437, 145.0, 431.6, 437.0, 437.0, 0.09972277069746105, 0.07411037939528112, 0.050056156385249004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 238.93333333333334, 142, 436, 147.0, 433.6, 436.0, 436.0, 0.09972741174124061, 0.02687965394588126, 0.058726200468718834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 202.0, 139, 434, 145.0, 433.4, 434.0, 434.0, 0.09972542266958309, 0.026879117828911062, 0.058627641061610364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c4aca33-1377-408d-b45f-10d9c83b8361", 3, 0, 0.0, 568.6666666666667, 231, 1227, 248.0, 1227.0, 1227.0, 1227.0, 0.01839486415392822, 0.025358805238244148, 0.011796185671627149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4001e7b-1ba5-477e-a1ee-457747192185", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.23554636571056062, 0.8988958604954368], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 273.15384615384613, 146, 553, 260.0, 474.5999999999999, 553.0, 553.0, 0.07424201755538169, 0.14280657313124276, 0.04798515016875782], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f565ef2a-2e10-4714-badc-f579fb82ddad", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 162.76470588235293, 141, 427, 145.0, 208.5999999999998, 427.0, 427.0, 0.07653658448738497, 0.056879239057519494, 0.0384177777602694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 209.41176470588238, 142, 428, 144.0, 425.6, 428.0, 428.0, 0.0765414089022161, 0.04076814931878146, 0.04251811949014417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1158.1666666666667, 1117, 1299, 1128.0, 1299.0, 1299.0, 1299.0, 0.0715009235535959, 21.023645578859558, 0.04077787046416016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1571.1666666666665, 1291, 1856, 1569.0, 1856.0, 1856.0, 1856.0, 0.07109341674960899, 63.969981360194794, 0.04047603707521683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 190.5, 139, 432, 143.0, 432.0, 432.0, 432.0, 0.07234145165179648, 0.128010459368218, 0.040056253014227154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 169.0, 140, 418, 145.0, 363.8000000000002, 418.0, 418.0, 0.06258783633849778, 0.046513030716403135, 0.03141616003709752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 169.0, 139, 425, 142.0, 371.0000000000002, 425.0, 425.0, 0.06258356328051659, 0.016745992518419482, 0.035692188433419626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 195.8181818181818, 138, 436, 143.0, 433.8, 436.0, 436.0, 0.06258320721868847, 0.01686813007066213, 0.03679208080629929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 247.18181818181824, 140, 430, 148.0, 429.6, 430.0, 430.0, 0.0625839193463963, 0.016868322011333377, 0.036853616568239225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 143.66666666666666, 139, 156, 142.0, 156.0, 156.0, 156.0, 0.07234145165179648, 0.05376156709669641, 0.040621420605256815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 397.94117647058823, 141, 1707, 144.0, 1600.6, 1707.0, 1707.0, 0.07654071966286065, 12.170779053675304, 0.04383679773889709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 971.5, 142, 1721, 1541.0, 1717.4, 1721.0, 1721.0, 0.08666846423481377, 43.33506908499769, 0.046813760303917415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 335.3529411764706, 139, 1147, 145.0, 1115.8, 1147.0, 1147.0, 0.07654037504783774, 3.9885326619166612, 0.043911346829202405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 655.8333333333333, 140, 1269, 844.5, 1170.9, 1269.0, 1269.0, 0.0866697161566796, 14.168034673905193, 0.04689907492115463], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 509.2307692307692, 146, 909, 575.0, 852.1999999999999, 909.0, 909.0, 0.07618288580771439, 0.015102661932584006, 0.05168898922891199], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 443.4545454545455, 285, 854, 301.0, 797.8000000000002, 854.0, 854.0, 0.06253233205805274, 0.09691290134387667, 0.14063668040009325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 739.7142857142858, 179, 1593, 649.0, 1535.8000000000002, 1589.0, 1593.0, 0.10121213581704701, 0.062170345145432196, 0.04576290906571559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.50000000000003, 140, 428, 144.5, 178.7000000000004, 428.0, 428.0, 0.08666846423481377, 0.06440888797138015, 0.0435035064616155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 295.0, 141, 571, 285.5, 445.9000000000002, 571.0, 571.0, 0.08666721234911479, 0.09550696708090384, 0.04538367695278081], "isController": false}, {"data": ["login", 21, 0, 0.0, 3302.714285714286, 2006, 4528, 3380.0, 4308.0, 4509.7, 4528.0, 0.09828699803426004, 33.72949794650379, 0.19486000684498736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 147.82352941176467, 144, 159, 147.0, 151.79999999999998, 159.0, 159.0, 0.0771888720889579, 0.062489819298580176, 0.027438231875371755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f28d4bce-99ee-4f7c-93ee-48f5a8f28c4f", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbd1a6ee-c9fe-4e44-b80e-4080fd8034cf", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c300a7f7-846a-46ee-976d-7e772816662f", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffd1d09a-3016-4d36-84a2-a669eaf3e1b2", 3, 0, 0.0, 383.6666666666667, 299, 513, 339.0, 513.0, 513.0, 513.0, 0.02902392538916247, 0.024196052383348005, 0.018612347987190775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1173.3888888888891, 286, 1870, 1686.0, 1859.2, 1870.0, 1870.0, 0.08660591422165341, 57.62120016551353, 0.18246821141947095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57258b62-96ef-4e3d-963f-d76060604dc4", 3, 0, 0.0, 457.3333333333333, 247, 696, 429.0, 696.0, 696.0, 696.0, 0.01727374275942283, 0.02381324888872255, 0.011077237381530913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 443.6666666666666, 287, 871, 294.0, 867.4, 871.0, 871.0, 0.09962673184468857, 0.15440197601320385, 0.22406285492023217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4445a69-7a45-4b7b-bb46-eb2d6502c0fd", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 1089.0, 144, 1996, 1497.0, 1985.5, 1996.0, 1996.0, 0.11250365636883199, 80.76813277681525, 0.18202740026550865], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1247.304347826087, 181, 2388, 1261.0, 2173.8000000000006, 2375.7999999999997, 2388.0, 0.09299429500216314, 0.02915548039639829, 0.04195641044042907], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 628.9411764705882, 286, 1854, 302.0, 1748.3999999999999, 1854.0, 1854.0, 0.07648665307903771, 16.24549621559788, 0.1685667765037501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 149.8235294117647, 140, 169, 148.0, 165.0, 169.0, 169.0, 0.08210339231898617, 0.06374237977890039, 0.029185190238389613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 534.1764705882352, 287, 1716, 297.0, 1148.7999999999995, 1716.0, 1716.0, 0.10612662779518808, 7.623291244241069, 0.23708400898018553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 147.63636363636365, 141, 160, 146.0, 159.8, 160.0, 160.0, 0.05655672382323453, 0.042030924638165504, 0.028388824262834518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 144.27272727272722, 140, 149, 144.0, 148.2, 149.0, 149.0, 0.056561376806750344, 0.015134587153368743, 0.032257660210099806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 168.72727272727275, 138, 418, 144.0, 364.4000000000002, 418.0, 418.0, 0.056561958483522475, 0.015245215372511917, 0.033252245124102076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 170.1818181818182, 141, 432, 143.0, 375.2000000000002, 432.0, 432.0, 0.05647803004631199, 0.015222594035920028, 0.033258058708912235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 155.0, 146, 164, 155.0, 164.0, 164.0, 164.0, 0.03639208835999054, 0.010732822934294084, 0.022496281183470714], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1628.4107142857147, 1124, 2272, 1539.0, 2141.0, 2237.5, 2272.0, 0.24836015770870015, 297.12509258068377, 0.49041429578807777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c4aca33-1377-408d-b45f-10d9c83b8361", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbd1a6ee-c9fe-4e44-b80e-4080fd8034cf", 3, 0, 0.0, 348.3333333333333, 266, 484, 295.0, 484.0, 484.0, 484.0, 0.06722990386123748, 0.030419780718463574, 0.043112926629764924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1247.304347826087, 181, 2388, 1261.0, 2173.8000000000006, 2375.7999999999997, 2388.0, 0.0930865056944658, 0.029184390202442914, 0.04199801331137031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 230.0, 141, 429, 145.0, 429.0, 429.0, 429.0, 0.05205428518311954, 0.014030256553262689, 0.030653060513106525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 266.0, 140, 432, 144.0, 432.0, 432.0, 432.0, 0.05205273685854297, 0.014029839231404159, 0.03060131600472936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4001e7b-1ba5-477e-a1ee-457747192185", 3, 0, 0.0, 498.33333333333337, 260, 956, 279.0, 956.0, 956.0, 956.0, 0.040535062829347386, 0.033396563808944735, 0.025994164639913525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 264.2941176470589, 140, 1319, 145.0, 610.9999999999993, 1319.0, 1319.0, 0.08220900430388316, 4.372137230100585, 0.04791432431452198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 283.9411764705882, 140, 1128, 146.0, 570.3999999999995, 1128.0, 1128.0, 0.08221854656955206, 1.442914710953445, 0.048000177434878076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 162.7058823529412, 142, 434, 144.0, 209.9999999999998, 434.0, 434.0, 0.08221457035632762, 0.061098914102700505, 0.041267860510891013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 183.57142857142858, 139, 433, 143.0, 433.0, 433.0, 433.0, 0.052165618386144814, 0.013958378357230156, 0.029750704235848215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 210.17647058823533, 140, 427, 145.0, 427.0, 427.0, 427.0, 0.08221814893092225, 0.02926376670358423, 0.046483859247365394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 224.28571428571428, 142, 426, 145.0, 426.0, 426.0, 426.0, 0.05216289727635158, 0.03876559065166363, 0.026183329296918665], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 554.2307692307692, 144, 1227, 511.0, 1118.6, 1227.0, 1227.0, 0.07545855583933132, 0.014641635346528906, 0.05135059024553053], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 151.71428571428572, 145, 167, 149.0, 167.0, 167.0, 167.0, 0.05146718231881713, 0.04051030170797521, 0.01829497496489203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f9a2d51-1bde-4dca-b0d4-47900deb45b7", 3, 0, 0.0, 327.3333333333333, 229, 490, 263.0, 490.0, 490.0, 490.0, 0.02913866117564785, 0.02922402834706088, 0.01868592529818563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1650.0, 1152, 2712, 1517.0, 2313.8, 2676.3999999999996, 2712.0, 0.0994073428890614, 0.051451066143752486, 0.04572349462963664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7210abb3-f137-4217-8f53-7f33d4cd1278", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 492.7142857142857, 288, 860, 292.0, 860.0, 860.0, 860.0, 0.05199628597957289, 0.08058408774373259, 0.11694086583101207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98fbecc0-69e2-405b-b3ff-df04c6f71a02", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1494.4561403508771, 737, 3460, 1167.0, 2451.0000000000005, 2854.399999999998, 3460.0, 0.272621615546128, 86.90927499390189, 0.9906587862479136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48375210-7c45-4d2a-9f0b-5d1709632613", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f28d4bce-99ee-4f7c-93ee-48f5a8f28c4f", 3, 0, 0.0, 812.6666666666666, 285, 1600, 553.0, 1600.0, 1600.0, 1600.0, 0.026554782516331192, 0.026632579730734504, 0.017028945819392072], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 268.6785714285714, 142, 588, 147.0, 577.2, 583.3, 588.0, 0.25011500824039623, 0.18587648561615386, 0.12090520417870718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d12f5011-8a28-4b5d-980d-3b54edce876c", 1, 0, 0.0, 909.0, 909, 909, 909.0, 909.0, 909.0, 909.0, 1.1001100110011, 0.19875034378437842, 0.7584742849284928], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 912.1607142857144, 693, 1413, 858.0, 1261.5, 1291.1, 1413.0, 0.24957661110615922, 73.38381038862644, 0.1255194870309297], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 208.1785714285714, 139, 455, 148.0, 432.3, 446.2, 455.0, 0.2506501237584986, 0.4435332268070307, 0.12189820471848857], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1358.1964285714284, 979, 1703, 1345.5, 1682.9, 1698.6, 1703.0, 0.24904717220277778, 224.09308332629183, 0.12501000635959744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 169.94117647058823, 145, 442, 149.0, 233.99999999999983, 442.0, 442.0, 0.11073115127829343, 0.08272395578895946, 0.03936146393095587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, 4.117647058823529, 248.18823529411767, 140, 2606, 152.5, 420.8, 512.45, 2395.8399999999974, 0.699283440145451, 1.5476346030640955, 0.3349635164290474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 149.90909090909093, 145, 161, 148.0, 160.2, 161.0, 161.0, 0.05767859390075087, 0.04466711422196821, 0.020502937675657536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 170.73333333333335, 143, 438, 149.0, 277.2000000000001, 438.0, 438.0, 0.10084236993014985, 0.08183594669136184, 0.035846311186107954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc789498-9b56-4d98-b6d7-a80b89b6ccc3", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 0.395217744430693, 0.7384649597772277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 344.7272727272727, 287, 578, 294.0, 575.0, 578.0, 578.0, 0.0564313820045453, 0.08745762035274744, 0.12691550073873809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 494.41176470588243, 284, 1463, 314.0, 987.7999999999996, 1463.0, 1463.0, 0.08214941528945588, 5.900959366241422, 0.18351956635981445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 151.63636363636363, 143, 169, 150.0, 166.8, 169.0, 169.0, 0.06584815415651508, 0.05459480749890752, 0.02340696104782372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 148.94444444444446, 143, 180, 147.0, 156.60000000000002, 180.0, 180.0, 0.08547698532170214, 0.06636152669018867, 0.030384397126073805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57258b62-96ef-4e3d-963f-d76060604dc4", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffd1d09a-3016-4d36-84a2-a669eaf3e1b2", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c300a7f7-846a-46ee-976d-7e772816662f", 3, 0, 0.0, 964.3333333333334, 527, 1813, 553.0, 1813.0, 1813.0, 1813.0, 0.06882786151834262, 0.031142814944822995, 0.04413765859086424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4445a69-7a45-4b7b-bb46-eb2d6502c0fd", 3, 0, 0.0, 687.3333333333334, 244, 1307, 511.0, 1307.0, 1307.0, 1307.0, 0.0330461985856227, 0.027549256047454344, 0.021191735421118726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 178.05882352941177, 141, 426, 145.0, 423.6, 426.0, 426.0, 0.10717640605988009, 0.07964965333161012, 0.05379753194802575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 211.5294117647059, 141, 434, 145.0, 432.4, 434.0, 434.0, 0.10697879302749985, 0.0380767808822604, 0.06048284012963313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 327.35294117647055, 140, 1568, 149.0, 659.1999999999991, 1568.0, 1568.0, 0.10622078928294719, 5.649160592165279, 0.06190924448901552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 276.8235294117647, 141, 847, 145.0, 635.7999999999998, 847.0, 847.0, 0.10670148063995782, 1.8725840156474582, 0.06229360913050846], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5426356589147286], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15503875968992248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15503875968992248], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8527131782945736], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 22, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
