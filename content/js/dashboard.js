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

    var data = {"OkPercent": 97.03588143525741, "KoPercent": 2.9641185647425896};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7312583668005355, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/017aedf9-a48d-4e2f-98a4-9f42ca947384"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d6a7103-c12e-4650-80e7-995aa4eb56f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=391b8293-e686-46a7-b2cd-d6f06ab003bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7182e1fd-ce86-4d4e-b522-d722751669d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f04ce799-1112-4116-8ead-061218351f3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3aecc875-fce3-4b6f-adbe-200ec1a2c336"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b02167f-9c38-4e2c-9ff8-0d2a25e63ae4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7bb7b6b-afc5-4a3b-9652-925a95e8e34a"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35b1bf08-d384-4d0e-836b-b60a62c50f60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/391b8293-e686-46a7-b2cd-d6f06ab003bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d763b1fe-6d9c-41b4-89d6-9dcea8a7be6b"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f66958ef-c85f-45d5-9fb0-add20d8ede84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3296db9-b3d4-47f8-be46-5b38005e2b57"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d6a7103-c12e-4650-80e7-995aa4eb56f0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25925925925925924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f04ce799-1112-4116-8ead-061218351f3c"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7bb7b6b-afc5-4a3b-9652-925a95e8e34a"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8941176470588236, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3aecc875-fce3-4b6f-adbe-200ec1a2c336"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35b1bf08-d384-4d0e-836b-b60a62c50f60"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b02167f-9c38-4e2c-9ff8-0d2a25e63ae4"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e606460a-2d1c-4afc-af97-67ffc291e2c1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7182e1fd-ce86-4d4e-b522-d722751669d8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d763b1fe-6d9c-41b4-89d6-9dcea8a7be6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3296db9-b3d4-47f8-be46-5b38005e2b57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9461031-756e-47dc-a344-f542f0baef61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f66958ef-c85f-45d5-9fb0-add20d8ede84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 38, 2.9641185647425896, 445.6981279251164, 125, 2789, 146.5, 1269.6000000000008, 1561.6999999999998, 2001.6800000000003, 5.075780371537621, 704.3008365869435, 3.7162167805120916], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2235.7222222222226, 1620, 2902, 2184.0, 2673.5, 2722.5, 2902.0, 0.24675223790571324, 296.92506799966185, 1.2132788260305334], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/017aedf9-a48d-4e2f-98a4-9f42ca947384", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 403.0, 132, 543, 456.0, 540.0, 543.0, 543.0, 0.07404390803746622, 0.015189950721134776, 0.04956747945281552], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 403.0, 132, 543, 456.0, 540.0, 543.0, 543.0, 0.0744467014793623, 0.01527258294160188, 0.04983712291416295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d6a7103-c12e-4650-80e7-995aa4eb56f0", 3, 0, 0.0, 396.0, 226, 516, 446.0, 516.0, 516.0, 516.0, 0.032960513305060536, 0.03305707730888396, 0.02113678750357072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 173.99999999999997, 132, 401, 135.0, 392.2, 401.0, 401.0, 0.10567043828846405, 0.028275097745155416, 0.060265171836389644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 134.30769230769232, 127, 138, 135.0, 137.2, 138.0, 138.0, 0.105671297237102, 0.07853111054436976, 0.05304203787096722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=391b8293-e686-46a7-b2cd-d6f06ab003bd", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 154.46153846153845, 127, 401, 135.0, 295.3999999999999, 401.0, 401.0, 0.105671297237102, 0.02848171683343765, 0.06222635960348878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 194.76923076923077, 128, 399, 136.0, 399.0, 399.0, 399.0, 0.105671297237102, 0.02848171683343765, 0.062123164977280675], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 231.1428571428571, 132, 362, 239.5, 333.0, 362.0, 362.0, 0.07423432595232037, 0.13365906957877322, 0.047975797289916855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7182e1fd-ce86-4d4e-b522-d722751669d8", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 165.27777777777777, 131, 402, 135.0, 400.2, 402.0, 402.0, 0.10382898212987852, 0.07716196816488043, 0.052117282045661684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 149.1111111111111, 129, 407, 134.5, 168.50000000000037, 407.0, 407.0, 0.10382658652792358, 0.03644520479794192, 0.05872916618598802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 987.7142857142857, 788, 1080, 1059.0, 1080.0, 1080.0, 1080.0, 0.07652196727046143, 22.499999145960185, 0.04364143445893503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1412.7142857142858, 1215, 1609, 1451.0, 1609.0, 1609.0, 1609.0, 0.07631507222676479, 68.66843613723086, 0.04344891319160534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f04ce799-1112-4116-8ead-061218351f3c", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 284.14285714285717, 128, 406, 382.0, 406.0, 406.0, 406.0, 0.0770645029890018, 0.13636804630475707, 0.042671458198011734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 155.91666666666666, 128, 381, 135.5, 309.90000000000026, 381.0, 381.0, 0.13836361959228854, 0.10282686963840974, 0.06945205124066046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 201.75000000000003, 127, 405, 136.0, 404.7, 405.0, 405.0, 0.1383652149849528, 0.03702350479089557, 0.07891141167110588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 154.75000000000003, 128, 396, 133.5, 318.0000000000003, 396.0, 396.0, 0.13836361959228854, 0.03729331934323402, 0.08134267479937275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 211.91666666666666, 130, 538, 135.0, 496.3000000000002, 538.0, 538.0, 0.13836202423641458, 0.03729288934497112, 0.08147685606890429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 173.2857142857143, 132, 399, 136.0, 399.0, 399.0, 399.0, 0.07728999205017224, 0.05743914448259871, 0.0434001420203604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 912.6470588235293, 126, 1869, 1198.0, 1742.6, 1869.0, 1869.0, 0.0792795817768886, 41.971096981663095, 0.04260002343411167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 221.77777777777783, 127, 1448, 134.5, 509.3000000000015, 1448.0, 1448.0, 0.10383077890389307, 5.2168262914674175, 0.06054542163948799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3aecc875-fce3-4b6f-adbe-200ec1a2c336", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 704.4117647058823, 127, 1213, 879.0, 1100.1999999999998, 1213.0, 1213.0, 0.0791835708064148, 13.704434512858015, 0.04262576068628866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 251.94444444444443, 132, 1049, 135.0, 598.1000000000007, 1049.0, 1049.0, 0.10383077890389307, 1.7225251320958241, 0.06064681888451133], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 465.14285714285717, 132, 1594, 453.5, 1093.5, 1594.0, 1594.0, 0.07460618591861531, 0.015305300836122184, 0.05029776694359773], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 392.58333333333337, 266, 780, 275.0, 748.5000000000001, 780.0, 780.0, 0.13814380770381968, 0.21409592072847836, 0.3106886612713835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b02167f-9c38-4e2c-9ff8-0d2a25e63ae4", 3, 0, 0.0, 349.6666666666667, 243, 520, 286.0, 520.0, 520.0, 520.0, 0.02271195936073405, 0.026844767069930123, 0.014564635397345729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7bb7b6b-afc5-4a3b-9652-925a95e8e34a", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 555.8095238095239, 143, 1615, 508.0, 1119.2, 1567.9999999999993, 1615.0, 0.09255667994781566, 0.056853663757007865, 0.04184935821859243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 151.58823529411765, 129, 402, 136.0, 194.7999999999998, 402.0, 402.0, 0.07927810292163127, 0.05891663703453261, 0.03979389150558444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 256.17647058823536, 127, 420, 135.0, 405.59999999999997, 420.0, 420.0, 0.07918283316177054, 0.09114577268471724, 0.04124712380003074], "isController": false}, {"data": ["login", 21, 0, 0.0, 2973.904761904762, 1584, 4300, 3181.0, 3928.0, 4268.0, 4300.0, 0.09399758291929636, 37.61099705278412, 0.19377822025647912], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35b1bf08-d384-4d0e-836b-b60a62c50f60", 3, 0, 0.0, 406.6666666666667, 259, 533, 428.0, 533.0, 533.0, 533.0, 0.04947637503092273, 0.03180854188999753, 0.031728013935845636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 154.83333333333334, 135, 415, 139.5, 173.80000000000038, 415.0, 415.0, 0.09948983821846863, 0.08054401941710009, 0.03536552842922127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1096.2941176470586, 257, 2005, 1336.0, 1881.0, 2005.0, 2005.0, 0.07913160050644225, 55.7380892758644, 0.16605908192215313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/391b8293-e686-46a7-b2cd-d6f06ab003bd", 3, 0, 0.0, 1218.0, 362, 2789, 503.0, 2789.0, 2789.0, 2789.0, 0.05254860746190226, 0.02377687642319145, 0.03369816298826414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d763b1fe-6d9c-41b4-89d6-9dcea8a7be6b", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 371.15384615384613, 268, 537, 274.0, 536.2, 537.0, 537.0, 0.1055537512179279, 0.1635876984207535, 0.23739286040516402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 916.0000000000001, 128, 1851, 1351.0, 1809.8, 1851.0, 1851.0, 0.11404209030379059, 73.47853870413095, 0.17334192121446054], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1044.304347826087, 153, 1965, 1014.0, 1821.4000000000003, 1952.1999999999998, 1965.0, 0.09251921785057743, 0.028723697389751283, 0.041742068991178494], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f66958ef-c85f-45d5-9fb0-add20d8ede84", 3, 0, 0.0, 360.3333333333333, 238, 516, 327.0, 516.0, 516.0, 516.0, 0.02670916391413894, 0.022005499305561737, 0.017127946911085195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3296db9-b3d4-47f8-be46-5b38005e2b57", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 456.7777777777777, 268, 1851, 276.0, 912.3000000000015, 1851.0, 1851.0, 0.10374340797095184, 7.047026517607562, 0.23184670470591626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 177.53846153846152, 131, 402, 137.0, 402.0, 402.0, 402.0, 0.08665857853267028, 0.0672788768881571, 0.030804416587785138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d6a7103-c12e-4650-80e7-995aa4eb56f0", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 473.421052631579, 265, 847, 517.0, 809.0, 847.0, 847.0, 0.10961053645704132, 0.16987492320051228, 0.24651666548883414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 196.46153846153845, 127, 409, 136.0, 405.8, 409.0, 409.0, 0.06503219093451258, 0.04832958720816804, 0.03264311146517526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 156.15384615384616, 129, 396, 136.0, 296.7999999999999, 396.0, 396.0, 0.06503381758514427, 0.017401626971024934, 0.0370895990915276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 213.69230769230768, 133, 403, 136.0, 399.4, 403.0, 403.0, 0.06495388274325228, 0.01750710120814222, 0.03818577872210731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 195.6153846153846, 125, 402, 137.0, 401.6, 402.0, 402.0, 0.06494836604899104, 0.01750561428664212, 0.03824596164798985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 136.66666666666666, 132, 141, 137.0, 141.0, 141.0, 141.0, 0.09499683343888536, 0.028016644236858772, 0.05872362848321723], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1539.9444444444446, 1051, 2337, 1471.0, 2117.5, 2159.0, 2337.0, 0.2483101117395503, 297.0652202027866, 0.49031547454821356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1044.304347826087, 153, 1965, 1014.0, 1821.4000000000003, 1952.1999999999998, 1965.0, 0.0914662032379036, 0.02839677641285458, 0.04126697841397604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 209.14285714285714, 134, 396, 135.0, 396.0, 396.0, 396.0, 0.04564245008672065, 0.012302066624936426, 0.02687734121317632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 238.0, 127, 379, 138.0, 379.0, 379.0, 379.0, 0.04564483104891822, 0.012302708368653738, 0.026834168253367936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 366.15384615384613, 128, 1474, 134.0, 1412.3999999999999, 1474.0, 1474.0, 0.08575084761414757, 11.890135746065354, 0.049278394249416234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 307.92307692307696, 127, 1007, 135.0, 907.8, 1007.0, 1007.0, 0.08575141324925298, 3.898597304767119, 0.049362460917144343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 133.57142857142856, 128, 137, 134.0, 137.0, 137.0, 137.0, 0.04564215248391114, 0.012212841582609036, 0.026030290088480575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 133.76923076923077, 128, 138, 134.0, 137.6, 138.0, 138.0, 0.08574858514834506, 0.06372526689247128, 0.04304177027954039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 173.0, 128, 403, 136.0, 403.0, 403.0, 403.0, 0.04556253457870928, 0.03386043829531032, 0.022870256614703682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 154.07692307692304, 127, 402, 135.0, 295.9999999999999, 402.0, 402.0, 0.08575197889182057, 0.04276003875329815, 0.047797452176781004], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 506.5, 128, 1084, 518.0, 996.0, 1084.0, 1084.0, 0.07683104852429508, 0.015311544756829732, 0.05228005568879035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 136.85714285714286, 130, 141, 137.0, 141.0, 141.0, 141.0, 0.045211752472114036, 0.03558659423098039, 0.016071365136571786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1468.142857142857, 1076, 2319, 1345.0, 2042.0, 2294.7999999999997, 2319.0, 0.09267717890667408, 0.047967680488805925, 0.04262788209476904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 418.0, 264, 800, 276.0, 800.0, 800.0, 800.0, 0.04552223761307399, 0.07055057723823088, 0.10238057931924746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f04ce799-1112-4116-8ead-061218351f3c", 3, 0, 0.0, 318.3333333333333, 236, 473, 246.0, 473.0, 473.0, 473.0, 0.022283625991621356, 0.02234891005214369, 0.014289955469887395], "isController": false}, {"data": ["addBook", 58, 17, 29.310344827586206, 1223.8103448275863, 677, 2687, 1030.0, 2173.1, 2499.0, 2687.0, 0.2742589098681193, 74.61727324285152, 0.9980351550863206], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7bb7b6b-afc5-4a3b-9652-925a95e8e34a", 3, 0, 0.0, 838.3333333333334, 304, 1127, 1084.0, 1127.0, 1127.0, 1127.0, 0.04768338234125407, 0.03065582035285703, 0.030578210681077644], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 244.42592592592595, 128, 669, 137.0, 543.0, 572.5, 669.0, 0.24952636199805928, 0.1854390248833233, 0.12062065350492121], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 855.0925925925927, 633, 1219, 797.0, 1186.0, 1209.25, 1219.0, 0.24913839637918864, 73.25496070879873, 0.12529909583523646], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 220.29629629629628, 130, 554, 139.0, 404.0, 450.5, 554.0, 0.2500370425248185, 0.44244836040524527, 0.12160004607164025], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1293.2037037037035, 916, 1758, 1236.5, 1598.5, 1731.25, 1758.0, 0.24897298643097227, 224.02633083841653, 0.12497276857960912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 139.26315789473685, 131, 164, 138.0, 144.0, 164.0, 164.0, 0.10641038565363979, 0.0794960400635102, 0.037825566775317274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 17, 10.0, 182.47647058823534, 128, 573, 140.0, 296.00000000000006, 383.4999999999999, 524.7199999999995, 0.7235489651121714, 1.5454221163381612, 0.34719793027754486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 142.3076923076923, 135, 176, 139.0, 164.0, 176.0, 176.0, 0.0669744054733545, 0.051865921426142686, 0.023807308195606478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3aecc875-fce3-4b6f-adbe-200ec1a2c336", 3, 0, 0.0, 368.0, 235, 530, 339.0, 530.0, 530.0, 530.0, 0.03432533553015481, 0.028615619886955226, 0.022012015297657866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 139.9230769230769, 135, 160, 137.0, 156.8, 160.0, 160.0, 0.10045436281024944, 0.08152106981964578, 0.03570838678020585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35b1bf08-d384-4d0e-836b-b60a62c50f60", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 416.07692307692304, 266, 812, 276.0, 808.8, 812.0, 812.0, 0.0649032940918032, 0.10058742941766767, 0.1459690295834207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b02167f-9c38-4e2c-9ff8-0d2a25e63ae4", 1, 0, 0.0, 1594.0, 1594, 1594, 1594.0, 1594.0, 1594.0, 1594.0, 0.6273525721455457, 0.11334006430363863, 0.4325301913425345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 522.4615384615383, 257, 1609, 271.0, 1548.6, 1609.0, 1609.0, 0.08567286147357321, 15.88073786781666, 0.18930793421312772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e606460a-2d1c-4afc-af97-67ffc291e2c1", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.5068824404761905, 0.9471106150793651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7182e1fd-ce86-4d4e-b522-d722751669d8", 3, 0, 0.0, 370.0, 220, 630, 260.0, 630.0, 630.0, 630.0, 0.017295153321534196, 0.023842765077049907, 0.011090967462051552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d763b1fe-6d9c-41b4-89d6-9dcea8a7be6b", 3, 0, 0.0, 584.6666666666666, 259, 944, 551.0, 944.0, 944.0, 944.0, 0.026237996116776574, 0.026314865246024947, 0.016825798291031854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 145.75000000000003, 136, 206, 139.5, 188.90000000000006, 206.0, 206.0, 0.15197568389057753, 0.1260032769756839, 0.054022606382978726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 170.47058823529412, 128, 412, 139.0, 392.0, 412.0, 412.0, 0.0806333034515797, 0.06260105101953697, 0.028662619586303725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3296db9-b3d4-47f8-be46-5b38005e2b57", 3, 0, 0.0, 546.3333333333334, 241, 908, 490.0, 908.0, 908.0, 908.0, 0.027972810428263727, 0.02805476202131528, 0.017938293145729017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 179.6315789473684, 126, 451, 135.0, 408.0, 451.0, 451.0, 0.1098526240322851, 0.08163852235211813, 0.05514086792245561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9461031-756e-47dc-a344-f542f0baef61", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 215.57894736842104, 127, 404, 136.0, 403.0, 404.0, 404.0, 0.10985325917274714, 0.029394329114582732, 0.06265068687195735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 209.78947368421052, 128, 533, 135.0, 400.0, 533.0, 533.0, 0.10984881334374007, 0.029607687971554938, 0.06457908753215968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f66958ef-c85f-45d5-9fb0-add20d8ede84", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 241.36842105263162, 127, 402, 136.0, 401.0, 402.0, 402.0, 0.10969596896181426, 0.029566491634239002, 0.06459635672263087], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.7020280811232449], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.894736842105263, 0.23400936037441497], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.23400936037441497], "isController": false}, {"data": ["401/Unauthorized", 23, 60.526315789473685, 1.7940717628705147], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 38, "401/Unauthorized", 23, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
