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

    var data = {"OkPercent": 99.3076923076923, "KoPercent": 0.6923076923076923};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7397350993377484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c9552e2-3fad-47eb-bc0e-0baae0fc5fcf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c29c80f2-1cab-4465-880b-ad8192529e8b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/88933f48-9c24-41cb-a652-cbab0c6f1009"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/241b3a9e-9579-4ff8-a24b-b382c14c095c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53ea3db1-9e00-4b83-b757-d8a8e61b1dbe"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b2edd71-4170-48bf-93ae-92b2fd94e654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b2edd71-4170-48bf-93ae-92b2fd94e654"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5ee5bd6b-6def-4377-869e-1b6322c58a78"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee8f8a56-d1f4-48ed-8dad-15805de542df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a983cba-22e4-4524-86ec-8454850b6d52"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3da992b7-06c8-4c11-bec1-cf9e034eadb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d22e1be5-d646-48c5-855e-d5ead7b37874"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4734d0b-fe2f-4212-899c-f0022afd8c33"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dce2aff6-2be5-4bc3-a50e-379266c6a6c4"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fa54d68-734b-4961-82df-7bd4a0e45167"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee89dd77-469e-478e-a0b9-4d94a0b8d1a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=241b3a9e-9579-4ff8-a24b-b382c14c095c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1a7725ed-f351-408a-b8e3-5ea56ceb17b9"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53ea3db1-9e00-4b83-b757-d8a8e61b1dbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ee5bd6b-6def-4377-869e-1b6322c58a78"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9619883040935673, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5315148-5fb0-4f3c-9883-c5147bc67c4c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3da992b7-06c8-4c11-bec1-cf9e034eadb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee8f8a56-d1f4-48ed-8dad-15805de542df"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a983cba-22e4-4524-86ec-8454850b6d52"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4734d0b-fe2f-4212-899c-f0022afd8c33"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dce2aff6-2be5-4bc3-a50e-379266c6a6c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a7725ed-f351-408a-b8e3-5ea56ceb17b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c29c80f2-1cab-4465-880b-ad8192529e8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fa54d68-734b-4961-82df-7bd4a0e45167"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee89dd77-469e-478e-a0b9-4d94a0b8d1a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 9, 0.6923076923076923, 490.3815384615382, 136, 2936, 159.5, 1350.7000000000003, 1713.95, 2149.99, 5.159774398787056, 744.1008762872149, 3.7699997072820293], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2365.280701754386, 1814, 3235, 2333.0, 2796.2, 3041.999999999999, 3235.0, 0.26345467655160937, 317.0246607443288, 1.2954045863646029], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3c9552e2-3fad-47eb-bc0e-0baae0fc5fcf", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c29c80f2-1cab-4465-880b-ad8192529e8b", 3, 0, 0.0, 435.0, 238, 593, 474.0, 593.0, 593.0, 593.0, 0.09382329945269742, 0.04349100860046912, 0.06016663408913213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88933f48-9c24-41cb-a652-cbab0c6f1009", 1, 0, 0.0, 909.0, 909, 909, 909.0, 909.0, 909.0, 909.0, 1.1001100110011, 0.3513046617161716, 0.656413297579758], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 646.2307692307692, 435, 1314, 581.0, 1134.7999999999997, 1314.0, 1314.0, 0.06885666161717816, 0.012439924217947224, 0.046801012192925776], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 646.2307692307692, 435, 1314, 581.0, 1134.7999999999997, 1314.0, 1314.0, 0.06904133451588748, 0.0124732879740617, 0.04692653205376727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/241b3a9e-9579-4ff8-a24b-b382c14c095c", 3, 0, 0.0, 438.66666666666663, 249, 817, 250.0, 817.0, 817.0, 817.0, 0.031730250563211944, 0.026142338598792135, 0.020347849482268077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 217.31578947368422, 138, 445, 146.0, 433.0, 445.0, 445.0, 0.09250783882213176, 0.03206583393382281, 0.0523494708795061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 174.78947368421052, 137, 444, 146.0, 412.0, 444.0, 444.0, 0.09250333498865616, 0.06874515422496812, 0.04643233807047781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 240.89473684210526, 136, 1145, 145.0, 439.0, 1145.0, 1145.0, 0.09250513646941974, 1.4551776859353243, 0.054054836375454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 278.10526315789474, 137, 1586, 145.0, 431.0, 1586.0, 1586.0, 0.09237650719564372, 4.398353365968981, 0.05388946117755737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53ea3db1-9e00-4b83-b757-d8a8e61b1dbe", 1, 0, 0.0, 949.0, 949, 949, 949.0, 949.0, 949.0, 949.0, 1.053740779768177, 0.1903730900948367, 0.7265048735511065], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 291.7857142857143, 235, 469, 264.0, 421.5, 469.0, 469.0, 0.07116750288482557, 0.1573518651604573, 0.04600867862280715], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b2edd71-4170-48bf-93ae-92b2fd94e654", 3, 0, 0.0, 501.66666666666663, 237, 902, 366.0, 902.0, 902.0, 902.0, 0.03284971256501505, 0.027385453736654804, 0.02106573364358062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 182.5333333333333, 139, 432, 146.0, 420.0, 432.0, 432.0, 0.09390200386876256, 0.0697845946720003, 0.04713440428568745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 219.0, 137, 449, 145.0, 443.0, 449.0, 449.0, 0.09372891099502612, 0.04384999703191782, 0.052405201017271114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1042.6, 857, 1184, 1149.0, 1184.0, 1184.0, 1184.0, 0.11701106924715077, 34.405139491820925, 0.06673287543001567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1531.4, 993, 1727, 1650.0, 1727.0, 1727.0, 1727.0, 0.11472363077346673, 103.22852463259757, 0.06531628587981553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 197.8, 143, 410, 144.0, 410.0, 410.0, 410.0, 0.11826202133446864, 0.20926834243950895, 0.06548297470375364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 145.21428571428572, 138, 155, 145.0, 153.0, 155.0, 155.0, 0.06605082138914313, 0.0490865967550175, 0.03315441620509724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 224.85714285714283, 137, 433, 148.0, 430.0, 433.0, 433.0, 0.06596741209842338, 0.017651436440398443, 0.03762203971238209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 206.14285714285717, 142, 433, 145.5, 432.5, 433.0, 433.0, 0.0660505097683986, 0.017802676461013685, 0.03883047546931246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 242.85714285714286, 137, 431, 146.5, 431.0, 431.0, 431.0, 0.06604988653573063, 0.017802508480333646, 0.03889461091898981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 144.6, 139, 152, 144.0, 152.0, 152.0, 152.0, 0.11900794973104203, 0.08844243139191697, 0.06682575302280191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1176.7499999999998, 138, 2003, 1605.5, 2003.0, 2003.0, 2003.0, 0.08400405319556668, 47.25036234951461, 0.04487325888474118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 390.7333333333333, 139, 1573, 146.0, 1567.6, 1573.0, 1573.0, 0.0937541017419512, 11.26991444547574, 0.05404289172026276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 787.0, 144, 1296, 1147.0, 1292.5, 1296.0, 1296.0, 0.08399832003359933, 15.444924499947502, 0.044952225955480894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 296.46666666666664, 137, 1143, 145.0, 976.2, 1143.0, 1143.0, 0.09390847054404307, 3.7035642177424406, 0.05422358237338008], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 622.2307692307692, 300, 1433, 482.0, 1239.3999999999999, 1433.0, 1433.0, 0.0693647786996772, 0.012531722714297148, 0.047823763439425876], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 470.5714285714286, 284, 588, 555.5, 586.5, 588.0, 588.0, 0.06592330294582988, 0.10216824392092971, 0.1482630534025842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 629.4545454545455, 211, 1196, 566.0, 1057.2, 1176.7999999999997, 1196.0, 0.09612485745120572, 0.05904544466485195, 0.0434627041014729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 144.25, 138, 153, 145.0, 151.6, 153.0, 153.0, 0.08400008400008399, 0.062425843675843674, 0.04216410466410466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 143.75, 137, 155, 144.5, 148.70000000000002, 155.0, 155.0, 0.08400405319556668, 0.10133399092756225, 0.04349916914741136], "isController": false}, {"data": ["login", 22, 0, 0.0, 2900.6818181818185, 1797, 4502, 2922.0, 4196.9, 4470.049999999999, 4502.0, 0.09502172542176689, 25.967137093944093, 0.17917804047925504], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 187.79999999999998, 146, 437, 152.0, 422.0, 437.0, 437.0, 0.09218062486172907, 0.07462669727575527, 0.032767331493817754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b2edd71-4170-48bf-93ae-92b2fd94e654", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ee5bd6b-6def-4377-869e-1b6322c58a78", 3, 0, 0.0, 725.3333333333334, 374, 1062, 740.0, 1062.0, 1062.0, 1062.0, 0.030084537550516953, 0.02508024110249802, 0.01929249315576771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee8f8a56-d1f4-48ed-8dad-15805de542df", 3, 0, 0.0, 421.66666666666663, 248, 686, 331.0, 686.0, 686.0, 686.0, 0.05262050094716902, 0.03382991190451133, 0.03374426655791763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a983cba-22e4-4524-86ec-8454850b6d52", 3, 0, 0.0, 896.0, 312, 1873, 503.0, 1873.0, 1873.0, 1873.0, 0.058542296809444824, 0.02648886476729437, 0.03754177236803591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3da992b7-06c8-4c11-bec1-cf9e034eadb0", 3, 0, 0.0, 658.6666666666667, 273, 1408, 295.0, 1408.0, 1408.0, 1408.0, 0.021856649521339373, 0.021920682674233923, 0.014016145689140159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d22e1be5-d646-48c5-855e-d5ead7b37874", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.8043726385390427, 1.5029715050377832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1323.1249999999998, 285, 2150, 1752.5, 2147.2, 2150.0, 2150.0, 0.08393354561525912, 62.8073430868922, 0.17534652095453424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4734d0b-fe2f-4212-899c-f0022afd8c33", 3, 0, 0.0, 555.0, 235, 1155, 275.0, 1155.0, 1155.0, 1155.0, 0.0691834052072043, 0.031303689205082676, 0.04436566024029703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dce2aff6-2be5-4bc3-a50e-379266c6a6c4", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.23709194553805774, 0.9047941272965879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 515.4736842105262, 284, 1738, 302.0, 883.0, 1738.0, 1738.0, 0.09230963566844322, 5.947870031069479, 0.20636346645759343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1676.6, 1137, 1872, 1795.0, 1872.0, 1872.0, 1872.0, 0.11434321258690085, 136.7942343864343, 0.25783054478823636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa54d68-734b-4961-82df-7bd4a0e45167", 3, 0, 0.0, 331.3333333333333, 244, 460, 290.0, 460.0, 460.0, 460.0, 0.02218984149056562, 0.026227641423256433, 0.014229813716280687], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1280.0454545454545, 302, 2361, 1181.0, 2345.0, 2359.5, 2361.0, 0.09561226618454906, 0.030235341987692094, 0.04313756540748209], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee89dd77-469e-478e-a0b9-4d94a0b8d1a8", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=241b3a9e-9579-4ff8-a24b-b382c14c095c", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 175.0, 140, 451, 149.5, 365.2000000000003, 451.0, 451.0, 0.06144487626538042, 0.0477037857724389, 0.021841733359959446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 632.2, 284, 1719, 554.0, 1714.8, 1719.0, 1719.0, 0.09363880392034458, 15.062380756835633, 0.20740141589674763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 644.4444444444445, 284, 1867, 570.0, 1740.1000000000001, 1867.0, 1867.0, 0.1362717561644043, 18.30199477246402, 0.3026043283316552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 184.125, 138, 431, 150.0, 431.0, 431.0, 431.0, 0.03781039975045136, 0.02809933028329442, 0.018979048312238282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 182.125, 143, 433, 145.0, 433.0, 433.0, 433.0, 0.03775953782325704, 0.010103626331613701, 0.021534736414826283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 214.75, 143, 430, 147.5, 430.0, 430.0, 430.0, 0.037763815655933876, 0.010178528438513428, 0.022200993188351753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 177.0, 139, 416, 143.5, 416.0, 416.0, 416.0, 0.03781111457712995, 0.010191276975867056, 0.022265724697274763], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1607.1228070175441, 1097, 2632, 1440.0, 2176.6, 2445.4999999999995, 2632.0, 0.2516956337431115, 301.11548151692983, 0.4970005580357143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1280.0454545454545, 302, 2361, 1181.0, 2345.0, 2359.5, 2361.0, 0.09495077665419359, 0.03002616001795433, 0.04283911993577875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 193.08333333333334, 139, 435, 145.0, 434.4, 435.0, 435.0, 0.06064158800105112, 0.01634480301590831, 0.03570984137171272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 215.91666666666666, 141, 435, 144.0, 434.7, 435.0, 435.0, 0.06064097510687972, 0.016344637821776174, 0.03565026075619296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a7725ed-f351-408a-b8e3-5ea56ceb17b9", 3, 0, 0.0, 475.6666666666667, 236, 672, 519.0, 672.0, 672.0, 672.0, 0.017539449144367204, 0.02417954659062341, 0.011247628520313606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 263.58333333333337, 138, 1572, 145.5, 1145.4000000000015, 1572.0, 1572.0, 0.06039528715442572, 4.543570677899351, 0.03507330477978368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 227.33333333333331, 139, 859, 145.0, 730.3000000000004, 859.0, 859.0, 0.06061279536110073, 1.5001568198234148, 0.03525881032235905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 146.91666666666666, 141, 154, 146.0, 153.4, 154.0, 154.0, 0.060833109433694445, 0.04520898074125144, 0.030535369383709907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53ea3db1-9e00-4b83-b757-d8a8e61b1dbe", 3, 0, 0.0, 420.3333333333333, 328, 469, 464.0, 469.0, 469.0, 469.0, 0.01843216043352441, 0.02541022117056507, 0.011820102882175488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 167.16666666666669, 136, 432, 144.0, 347.4000000000003, 432.0, 432.0, 0.06073028163668109, 0.016250094891065058, 0.034635238745919686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 237.33333333333331, 136, 434, 145.5, 433.4, 434.0, 434.0, 0.060743192965938254, 0.02385633538847803, 0.03421747898032427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 169.58333333333331, 137, 433, 146.0, 348.7000000000003, 433.0, 433.0, 0.060729052272531746, 0.04513164919862955, 0.03048313756648566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 218.66666666666669, 146, 452, 150.5, 440.6, 452.0, 452.0, 0.06425393153743594, 0.050574871893724, 0.022840264726197938], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 747.0, 460, 1408, 684.5, 1332.1000000000004, 1408.0, 1408.0, 0.07565965764004917, 0.013668981116610449, 0.05149880993663504], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1492.1363636363635, 1020, 2936, 1425.5, 2018.3999999999999, 2802.949999999998, 2936.0, 0.09410315416663102, 0.048705734090150825, 0.043283775012190634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ee5bd6b-6def-4377-869e-1b6322c58a78", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 388.00000000000006, 282, 868, 291.0, 783.4000000000003, 868.0, 868.0, 0.0605956552915156, 0.09391143061292506, 0.13628104896128948], "isController": false}, {"data": ["addBook", 57, 4, 7.017543859649122, 1480.8070175438597, 745, 3151, 1136.0, 2589.8, 2718.3999999999974, 3151.0, 0.2694500382902686, 91.52528756848521, 0.9786675784241428], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 238.0350877192982, 138, 604, 147.0, 583.0, 585.5999999999999, 604.0, 0.25308474786987, 0.18808348938376085, 0.12234077167537663], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 904.8070175438594, 679, 1348, 859.0, 1193.8000000000002, 1289.6999999999998, 1348.0, 0.25296007668684434, 74.37866161097847, 0.12722113231809065], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 207.64912280701753, 136, 464, 147.0, 434.4, 448.29999999999995, 464.0, 0.25360722914080536, 0.4487659171905658, 0.12333632823449325], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1365.7719298245618, 949, 2012, 1288.0, 1778.4, 1859.9999999999995, 2012.0, 0.2523866031419918, 227.09790915549007, 0.12668624415525762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 149.38888888888889, 139, 163, 148.5, 156.70000000000002, 163.0, 163.0, 0.13051233341550778, 0.09750188970982758, 0.046393056018793774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, 2.3391812865497075, 210.55555555555563, 138, 872, 152.0, 323.0000000000001, 436.6, 850.4000000000001, 0.7350855020505017, 1.617936187001883, 0.35218229180100247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 150.375, 145, 159, 148.0, 159.0, 159.0, 159.0, 0.03813591640607124, 0.029532989951186025, 0.013556126534970635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 164.21052631578948, 138, 414, 148.0, 182.0, 414.0, 414.0, 0.09497673070097826, 0.07707584298096966, 0.03376125974136337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5315148-5fb0-4f3c-9883-c5147bc67c4c", 2, 0, 0.0, 289.0, 261, 317, 289.0, 317.0, 317.0, 317.0, 0.026794207092426615, 0.030483643811208015, 0.016654797670243693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3da992b7-06c8-4c11-bec1-cf9e034eadb0", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee8f8a56-d1f4-48ed-8dad-15805de542df", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 403.5, 284, 862, 305.0, 862.0, 862.0, 862.0, 0.037733179256184704, 0.05847905808551282, 0.08486280451854822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a983cba-22e4-4524-86ec-8454850b6d52", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 481.8333333333333, 288, 1717, 295.0, 1377.7000000000012, 1717.0, 1717.0, 0.06035215482339451, 6.1025861291259496, 0.13444660531702485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4734d0b-fe2f-4212-899c-f0022afd8c33", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.6022135416666667, 2.2981770833333335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dce2aff6-2be5-4bc3-a50e-379266c6a6c4", 3, 0, 0.0, 529.6666666666666, 373, 683, 533.0, 683.0, 683.0, 683.0, 0.01804435301972248, 0.024875597343269756, 0.011571411278923594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 150.78571428571428, 138, 194, 147.5, 174.0, 194.0, 194.0, 0.06549064185506921, 0.05429839349116578, 0.023279876596919134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a7725ed-f351-408a-b8e3-5ea56ceb17b9", 1, 0, 0.0, 1433.0, 1433, 1433, 1433.0, 1433.0, 1433.0, 1433.0, 0.6978367062107467, 0.12607401430565246, 0.48112569783670617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 165.6875, 139, 411, 148.5, 235.30000000000018, 411.0, 411.0, 0.08495003875845518, 0.06595242266891785, 0.030197084089919616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c29c80f2-1cab-4465-880b-ad8192529e8b", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fa54d68-734b-4961-82df-7bd4a0e45167", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee89dd77-469e-478e-a0b9-4d94a0b8d1a8", 2, 0, 0.0, 260.0, 253, 267, 260.0, 267.0, 267.0, 267.0, 0.019200860198536895, 0.027338724774869913, 0.01193490968395384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 176.94444444444443, 138, 438, 145.5, 433.5, 438.0, 438.0, 0.13642254609945204, 0.1013843335758623, 0.0684777233350765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 190.94444444444443, 136, 445, 145.5, 413.50000000000006, 445.0, 445.0, 0.13642254609945204, 0.05927038569685394, 0.0765304430701136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 425.88888888888886, 137, 1721, 283.0, 1594.1000000000001, 1721.0, 1721.0, 0.13643288638930368, 13.672970489756166, 0.07890487027506386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 355.8333333333333, 137, 1147, 286.0, 886.9000000000004, 1147.0, 1147.0, 0.13643185228978127, 4.489963968726788, 0.07903750644261524], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 55.55555555555556, 0.38461538461538464], "isController": false}, {"data": ["401/Unauthorized", 4, 44.44444444444444, 0.3076923076923077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 9, "406/Not Acceptable", 5, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
