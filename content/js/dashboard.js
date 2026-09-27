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

    var data = {"OkPercent": 98.45916795069337, "KoPercent": 1.5408320493066257};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7389146260754468, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f097e486-5542-45fe-9c25-a3b2df3ec5f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=323b02b7-1fa8-44c8-8efc-8e0851184812"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/314472c5-7209-44ac-9cbd-21faa908f601"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/142062c8-1575-41d6-aa0b-df091c74aaaa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7d7afe5-b3a7-4c0a-9daa-701a2a9002b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2a90d92-2d03-4686-8d78-efbfd2046668"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64abb3b1-2ed5-4690-9147-28a65361d9e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/772dadd7-0733-4835-b063-4e99032ec383"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e369293-7d10-4a7b-81fc-a4d5e1b9cb11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c990c498-4038-4d12-831a-2fef6c9f8d7d"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=314472c5-7209-44ac-9cbd-21faa908f601"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/323b02b7-1fa8-44c8-8efc-8e0851184812"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=462d6e26-1f28-4a72-b05b-dd4a6f8ef3da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7d7afe5-b3a7-4c0a-9daa-701a2a9002b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f097e486-5542-45fe-9c25-a3b2df3ec5f6"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e369293-7d10-4a7b-81fc-a4d5e1b9cb11"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f381cc43-31d6-462a-8817-1e956f2287d9"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d2a90d92-2d03-4686-8d78-efbfd2046668"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64abb3b1-2ed5-4690-9147-28a65361d9e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9235294117647059, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab7351a0-c972-444c-9cda-8db2d1835140"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ab7351a0-c972-444c-9cda-8db2d1835140"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=772dadd7-0733-4835-b063-4e99032ec383"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=142062c8-1575-41d6-aa0b-df091c74aaaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f381cc43-31d6-462a-8817-1e956f2287d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c990c498-4038-4d12-831a-2fef6c9f8d7d"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cfed336f-bbe6-45ab-84e3-5d4fd8b92fdf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/462d6e26-1f28-4a72-b05b-dd4a6f8ef3da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 20, 1.5408320493066257, 452.49922958397553, 125, 2926, 147.0, 1218.4000000000005, 1489.5999999999995, 2009.7399999999993, 5.038917680855607, 718.4748663721151, 3.6920541450726914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2096.5178571428573, 1545, 2988, 2078.5, 2518.3, 2695.7, 2988.0, 0.24670038238559266, 296.86417588305517, 1.2130238528432218], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f097e486-5542-45fe-9c25-a3b2df3ec5f6", 3, 0, 0.0, 356.6666666666667, 229, 560, 281.0, 560.0, 560.0, 560.0, 0.020180277142472756, 0.023852404395937037, 0.012941128245661241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=323b02b7-1fa8-44c8-8efc-8e0851184812", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/314472c5-7209-44ac-9cbd-21faa908f601", 3, 0, 0.0, 1277.0, 551, 1991, 1289.0, 1991.0, 1991.0, 1991.0, 0.01890418727748196, 0.022344109376476892, 0.012122802388228993], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 966.7142857142858, 149, 2685, 611.0, 2510.0, 2685.0, 2685.0, 0.09493198801144609, 0.017925564421525153, 0.06419961103313127], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 966.7142857142858, 149, 2685, 611.0, 2510.0, 2685.0, 2685.0, 0.09373263435568857, 0.017699096065907433, 0.06338852469854915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 178.37499999999997, 125, 395, 130.0, 393.6, 395.0, 395.0, 0.1116118141105236, 0.029864879947542444, 0.06365361273490798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 165.6875, 128, 396, 132.5, 396.0, 396.0, 396.0, 0.11160169355569971, 0.08293836796473388, 0.056018818835575836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 225.375, 125, 395, 132.0, 392.9, 395.0, 395.0, 0.11160947843495608, 0.03008224223442176, 0.0657231596643345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 211.3125, 127, 419, 130.5, 396.6, 419.0, 419.0, 0.11160869989815705, 0.030082032394425143, 0.06561370833856499], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 394.9285714285714, 138, 2009, 250.0, 1280.0, 2009.0, 2009.0, 0.09542440001908489, 0.21324051890425524, 0.06168372732818496], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/142062c8-1575-41d6-aa0b-df091c74aaaa", 3, 0, 0.0, 418.3333333333333, 229, 643, 383.0, 643.0, 643.0, 643.0, 0.04016978428825837, 0.026296040430887884, 0.025759920262978186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7d7afe5-b3a7-4c0a-9daa-701a2a9002b5", 3, 0, 0.0, 527.6666666666666, 259, 998, 326.0, 998.0, 998.0, 998.0, 0.02163191139569092, 0.025568186939372965, 0.013872026513512735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2a90d92-2d03-4686-8d78-efbfd2046668", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 132.0, 128, 141, 131.0, 136.0, 141.0, 141.0, 0.08522204828950379, 0.0633339636213988, 0.04277747345781733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 156.26315789473685, 125, 385, 130.0, 381.0, 385.0, 385.0, 0.08522357732694007, 0.02954090283166549, 0.04822736360863539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 983.4285714285714, 760, 1105, 1023.0, 1105.0, 1105.0, 1105.0, 0.09492040246250644, 27.909749977964907, 0.05413429202939821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64abb3b1-2ed5-4690-9147-28a65361d9e3", 3, 0, 0.0, 342.3333333333333, 230, 543, 254.0, 543.0, 543.0, 543.0, 0.0392875851231011, 0.03275244319669984, 0.025194187074384495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1222.142857142857, 1131, 1394, 1143.0, 1394.0, 1394.0, 1394.0, 0.09462144662674542, 85.14054400150718, 0.05387139002284432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 316.2857142857143, 131, 405, 384.0, 405.0, 405.0, 405.0, 0.09557488292076843, 0.169122742043391, 0.05292085802351142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 132.39999999999998, 128, 142, 132.0, 140.2, 142.0, 142.0, 0.06868477807948202, 0.05104405870945881, 0.0344765389969275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 162.86666666666665, 127, 381, 129.0, 381.0, 381.0, 381.0, 0.06860655512765393, 0.02522720204173108, 0.03874305072768686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 218.33333333333334, 127, 1434, 132.0, 658.2000000000005, 1434.0, 1434.0, 0.0686844635743395, 4.137438505941207, 0.03998544747928019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/772dadd7-0733-4835-b063-4e99032ec383", 3, 0, 0.0, 605.0, 238, 1074, 503.0, 1074.0, 1074.0, 1074.0, 0.028844212408780177, 0.02404623306604363, 0.0184971023584951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 240.06666666666663, 127, 1005, 132.0, 638.4000000000002, 1005.0, 1005.0, 0.06860686891971624, 1.3621054104520278, 0.04000727375741526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e369293-7d10-4a7b-81fc-a4d5e1b9cb11", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 275.1428571428571, 128, 391, 381.0, 391.0, 391.0, 391.0, 0.09593903759439716, 0.07129844493099242, 0.05387201818044763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 216.15789473684208, 127, 1131, 130.0, 511.0, 1131.0, 1131.0, 0.0851296434860141, 4.053306033507476, 0.04966187569727899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 962.1333333333334, 127, 1789, 1142.0, 1728.4, 1789.0, 1789.0, 0.08579714123925392, 51.47465400515355, 0.045523873769526005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 210.1578947368421, 127, 652, 129.0, 395.0, 652.0, 652.0, 0.08512811781731505, 1.3391314495750315, 0.04974411859914961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 755.8, 128, 1138, 1016.0, 1088.2, 1138.0, 1138.0, 0.08579959502591147, 16.82632839222999, 0.04560896441318797], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 489.00000000000006, 133, 709, 500.0, 686.0, 709.0, 709.0, 0.09372447681658119, 0.017697555715854164, 0.0641413812812136], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 402.9333333333333, 259, 1562, 266.0, 940.4000000000003, 1562.0, 1562.0, 0.06856515975682224, 5.567696310623028, 0.1530351153608813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c990c498-4038-4d12-831a-2fef6c9f8d7d", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 739.3809523809524, 191, 1703, 712.0, 1263.2, 1659.9999999999993, 1703.0, 0.09033423667570009, 0.05548851061427281, 0.04084448396567299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 131.8, 128, 139, 131.0, 139.0, 139.0, 139.0, 0.0859264011731818, 0.06385741337186654, 0.043131025588882266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 229.8666666666667, 125, 384, 131.0, 383.4, 384.0, 384.0, 0.08592738563064972, 0.1090315589805575, 0.04419442359909719], "isController": false}, {"data": ["login", 21, 0, 0.0, 3172.238095238095, 1535, 4895, 2916.0, 4567.0, 4867.599999999999, 4895.0, 0.08995155466270309, 35.99207077714931, 0.1854372381767248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 161.9473684210526, 130, 396, 134.0, 391.0, 396.0, 396.0, 0.08653789221022332, 0.0700585084397218, 0.03076151637160282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1094.7999999999997, 257, 1929, 1272.0, 1862.4, 1929.0, 1929.0, 0.0857319219953819, 68.42107854151425, 0.17818955792334423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=314472c5-7209-44ac-9cbd-21faa908f601", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 460.1875, 261, 783, 517.5, 780.2, 783.0, 783.0, 0.11150136589173217, 0.17280533952165913, 0.25076918520376873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1195.1111111111113, 134, 1779, 1436.0, 1779.0, 1779.0, 1779.0, 0.12144601724533445, 113.0118443601819, 0.23087393903409933], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1167.8260869565217, 269, 2083, 1150.0, 1744.8000000000002, 2028.7999999999993, 2083.0, 0.09610924696315672, 0.02983826485201265, 0.043361789157205476], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 390.31578947368416, 259, 1264, 269.0, 640.0, 1264.0, 1264.0, 0.08507703949813503, 5.481845637227026, 0.19019458434269032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 161.6153846153846, 129, 397, 135.0, 310.19999999999993, 397.0, 397.0, 0.06242886710815081, 0.048467723975566306, 0.022191511354850483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 538.7058823529412, 258, 1467, 527.0, 1338.1999999999998, 1467.0, 1467.0, 0.08968704497013949, 12.745807831327685, 0.19900858720482412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/323b02b7-1fa8-44c8-8efc-8e0851184812", 3, 0, 0.0, 436.0, 263, 781, 264.0, 781.0, 781.0, 781.0, 0.025348114100310938, 0.02527385204728268, 0.016255138273962418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 131.41666666666666, 127, 142, 131.5, 139.3, 142.0, 142.0, 0.0595332592474996, 0.044242978796237495, 0.02988290552071757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 193.66666666666666, 126, 389, 132.0, 388.1, 389.0, 389.0, 0.05953266855186783, 0.015929639827355263, 0.033952225033487125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=462d6e26-1f28-4a72-b05b-dd4a6f8ef3da", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7d7afe5-b3a7-4c0a-9daa-701a2a9002b5", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 151.00000000000003, 126, 381, 130.5, 306.60000000000025, 381.0, 381.0, 0.0595332592474996, 0.016046073781552626, 0.03499904498729957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 173.16666666666666, 126, 395, 130.5, 391.1, 395.0, 395.0, 0.05953296389821848, 0.016045994175691698, 0.03505700901428295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 2.217457706766917, 4.647850093984962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f097e486-5542-45fe-9c25-a3b2df3ec5f6", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1436.589285714285, 1011, 2442, 1395.0, 1965.1000000000001, 2137.2999999999997, 2442.0, 0.2360170438022346, 282.35843718785696, 0.46604146735167806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1167.8260869565217, 269, 2083, 1150.0, 1744.8000000000002, 2028.7999999999993, 2083.0, 0.09623632293562627, 0.02987771710705245, 0.043419122261972004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 216.83333333333334, 128, 393, 130.0, 393.0, 393.0, 393.0, 0.04968121222157821, 0.013390639231597251, 0.029255635712511385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 256.1666666666667, 128, 385, 256.0, 385.0, 385.0, 385.0, 0.04968244636365895, 0.013390971871454951, 0.029207844444260438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 151.3846153846154, 126, 393, 132.0, 289.3999999999999, 393.0, 393.0, 0.06323049460838437, 0.017042594249916096, 0.037172614994382215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 151.23076923076923, 126, 385, 131.0, 287.79999999999995, 385.0, 385.0, 0.06323110970597533, 0.017042760037938667, 0.037234725735061654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 131.23076923076923, 127, 135, 131.0, 134.6, 135.0, 135.0, 0.06322987952276032, 0.04699017413752013, 0.031738435619823056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 173.66666666666666, 127, 393, 130.5, 393.0, 393.0, 393.0, 0.04968326915911067, 0.01329415600546516, 0.028334989442305305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 168.61538461538458, 126, 385, 129.0, 383.8, 385.0, 385.0, 0.06323233993705951, 0.016919590959721, 0.036062193870354246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 217.33333333333334, 129, 393, 135.0, 393.0, 393.0, 393.0, 0.049678744121348616, 0.03691945730111943, 0.024936400857786315], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 698.2857142857142, 134, 1289, 631.0, 1231.5, 1289.0, 1289.0, 0.09227585206862687, 0.017243792389219546, 0.06280241968705304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 184.33333333333334, 134, 417, 137.0, 417.0, 417.0, 417.0, 0.05139538469445444, 0.0404537891247366, 0.01826945315310685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1590.4285714285718, 932, 2926, 1411.0, 2665.8, 2908.1, 2926.0, 0.09029228903851612, 0.04673331366251322, 0.04153092591517684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 479.99999999999994, 261, 787, 398.0, 787.0, 787.0, 787.0, 0.04962450789029675, 0.07690829494326265, 0.11160668131968107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e369293-7d10-4a7b-81fc-a4d5e1b9cb11", 3, 0, 0.0, 323.3333333333333, 246, 457, 267.0, 457.0, 457.0, 457.0, 0.09983361064891846, 0.04517210898502496, 0.06402090266222961], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1333.3684210526314, 665, 3390, 1091.0, 2306.2000000000003, 2541.1999999999985, 3390.0, 0.2611887294772101, 77.74878494974408, 0.950760447262788], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f381cc43-31d6-462a-8817-1e956f2287d9", 3, 0, 0.0, 418.3333333333333, 242, 619, 394.0, 619.0, 619.0, 619.0, 0.06698970591519103, 0.041672307292945986, 0.042958893441707786], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 225.3392857142857, 127, 542, 133.0, 522.5, 533.75, 542.0, 0.23741589753808193, 0.17643896291648473, 0.1147664739075689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a90d92-2d03-4686-8d78-efbfd2046668", 3, 0, 0.0, 1014.6666666666666, 309, 2009, 726.0, 2009.0, 2009.0, 2009.0, 0.0176571337763312, 0.024341784356368048, 0.011323096855264475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64abb3b1-2ed5-4690-9147-28a65361d9e3", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 841.7678571428575, 627, 1171, 774.0, 1073.4000000000003, 1147.55, 1171.0, 0.2369337389413293, 69.66638618930159, 0.11916101128396932], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 190.1428571428571, 126, 525, 134.0, 390.0, 397.15, 525.0, 0.23785556220984808, 0.4208928503166452, 0.11567584959033626], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1207.5, 879, 1912, 1163.5, 1559.4, 1614.3999999999996, 1912.0, 0.2365833977600622, 212.87815717375784, 0.11875377582878122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 138.35294117647058, 129, 161, 136.0, 149.79999999999998, 161.0, 161.0, 0.08840583478509581, 0.0660453746197249, 0.03142551158376453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, 4.117647058823529, 226.67058823529413, 127, 2605, 138.0, 394.5000000000001, 552.1499999999999, 2159.829999999995, 0.6849094307999741, 1.4798379471552086, 0.3284952791610262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 134.75, 130, 145, 134.0, 142.9, 145.0, 145.0, 0.06373960247734588, 0.04936084449661649, 0.022657436818119044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab7351a0-c972-444c-9cda-8db2d1835140", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab7351a0-c972-444c-9cda-8db2d1835140", 3, 0, 0.0, 598.6666666666666, 242, 1045, 509.0, 1045.0, 1045.0, 1045.0, 0.02182087967239586, 0.025791541045074664, 0.013993207341998647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=772dadd7-0733-4835-b063-4e99032ec383", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=142062c8-1575-41d6-aa0b-df091c74aaaa", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f381cc43-31d6-462a-8817-1e956f2287d9", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 135.5, 129, 148, 134.0, 145.9, 148.0, 148.0, 0.11150369704445513, 0.09048786351947483, 0.03963607980877116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 349.41666666666663, 258, 528, 267.0, 524.7, 528.0, 528.0, 0.05949400350023054, 0.0922040855027987, 0.13380340826272552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c990c498-4038-4d12-831a-2fef6c9f8d7d", 3, 0, 0.0, 562.6666666666667, 241, 1174, 273.0, 1174.0, 1174.0, 1174.0, 0.027545427000027545, 0.02762612649319169, 0.01766422239259579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 324.3076923076923, 258, 526, 269.0, 521.6, 526.0, 526.0, 0.06318900316917155, 0.09793061331003441, 0.14211354911972857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfed336f-bbe6-45ab-84e3-5d4fd8b92fdf", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/462d6e26-1f28-4a72-b05b-dd4a6f8ef3da", 3, 0, 0.0, 451.0, 244, 840, 269.0, 840.0, 840.0, 840.0, 0.02658584569575158, 0.026663733915563353, 0.01704886589213236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 150.86666666666665, 129, 387, 134.0, 237.00000000000009, 387.0, 387.0, 0.06942965849865307, 0.05756423834507466, 0.02468007391944308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 136.53333333333333, 127, 148, 136.0, 146.8, 148.0, 148.0, 0.08473523064929783, 0.06578565270135915, 0.030120726519867587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 180.94117647058823, 128, 429, 133.0, 391.4, 429.0, 429.0, 0.08975238899741302, 0.06670075002639776, 0.04505149213346708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 238.47058823529414, 128, 397, 133.0, 396.2, 397.0, 397.0, 0.08975286285234599, 0.03987526661879848, 0.050300375114170924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 324.3529411764706, 128, 1170, 138.0, 1102.0, 1170.0, 1170.0, 0.0897500197977985, 9.522194569463876, 0.051855796135469735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 303.0, 128, 1149, 134.0, 1032.1999999999998, 1149.0, 1149.0, 0.08975191514748351, 3.126055904884088, 0.051944539585874104], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 45.0, 0.6933744221879815], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07704160246533127], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07704160246533127], "isController": false}, {"data": ["401/Unauthorized", 9, 45.0, 0.6933744221879815], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 20, "406/Not Acceptable", 9, "401/Unauthorized", 9, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
