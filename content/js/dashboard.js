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

    var data = {"OkPercent": 98.00637958532695, "KoPercent": 1.9936204146730463};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7638036809815951, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14150943396226415, 500, 1500, "see books"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4fbdcca-3ec4-4069-9f97-dda061f874a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0adcb3a-a711-4744-b4d7-0240d78a50d8"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c90165f-f05b-4ff5-89f6-70ce9465bb93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12f021b5-0e5e-41e0-9aac-76601b830f57"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=751924ff-0406-4db0-bfb1-1c1a65c0596b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/23b6d8f3-6284-41da-9e4e-ed5df054b1dc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/82412ebd-c2e6-4bb6-8ac5-3dc32dd4d511"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/666295a9-2d02-425e-a458-90e161042b85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/762edd77-43fc-4a2e-a793-86ec408d3810"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5912fc5f-0ce7-4e24-8afb-60935d8c31c2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=184354f6-2db4-4810-b7e1-ab7c6886304f"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a04db5a0-87db-453f-a2f1-36a572f45897"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6474371-1c41-48db-9bea-9cb69577f80e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b91305bb-c044-40ae-9021-e1ae7ef65f2d"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/12f021b5-0e5e-41e0-9aac-76601b830f57"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4056603773584906, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0adcb3a-a711-4744-b4d7-0240d78a50d8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4fbdcca-3ec4-4069-9f97-dda061f874a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c90165f-f05b-4ff5-89f6-70ce9465bb93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5943396226415094, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9121212121212121, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/751924ff-0406-4db0-bfb1-1c1a65c0596b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23b6d8f3-6284-41da-9e4e-ed5df054b1dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d6474371-1c41-48db-9bea-9cb69577f80e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=666295a9-2d02-425e-a458-90e161042b85"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a04db5a0-87db-453f-a2f1-36a572f45897"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82412ebd-c2e6-4bb6-8ac5-3dc32dd4d511"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9dc17552-0d4c-4712-a32e-a6247f67c0bb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=762edd77-43fc-4a2e-a793-86ec408d3810"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b91305bb-c044-40ae-9021-e1ae7ef65f2d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/184354f6-2db4-4810-b7e1-ab7c6886304f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1254, 25, 1.9936204146730463, 388.57894736842053, 93, 4401, 125.0, 1067.0, 1293.25, 2070.550000000003, 4.867143289629957, 690.3751219575503, 3.553586637527848], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1711.0377358490566, 1184, 2324, 1743.0, 2106.2000000000003, 2169.7, 2324.0, 0.22200161684196415, 267.1434481903727, 1.0915802156243062], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 537.8, 103, 900, 565.0, 873.0, 900.0, 900.0, 0.07376190640105824, 0.014449842210988557, 0.049664429427066684], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 537.8, 103, 900, 565.0, 873.0, 900.0, 900.0, 0.0738130855838123, 0.014459868132922604, 0.049698888743996535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4fbdcca-3ec4-4069-9f97-dda061f874a6", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 130.07142857142858, 98, 304, 101.5, 303.5, 304.0, 304.0, 0.08213648737444851, 0.03078972399206796, 0.04635073820168028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 115.78571428571429, 96, 296, 102.0, 203.0, 296.0, 296.0, 0.08213504174220157, 0.0610398112947416, 0.04122794087450352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 195.0, 96, 607, 104.5, 456.5, 607.0, 607.0, 0.08204022314940695, 1.7435722034538934, 0.04780720034808495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 239.07142857142856, 99, 1125, 102.5, 764.5, 1125.0, 1125.0, 0.08203830016642055, 5.293261515027659, 0.04772596424302089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0adcb3a-a711-4744-b4d7-0240d78a50d8", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 285.18749999999994, 102, 761, 244.5, 536.3000000000002, 761.0, 761.0, 0.07352501918543469, 0.1343186858666532, 0.04752380085289022], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 112.84210526315789, 98, 304, 101.0, 112.0, 304.0, 304.0, 0.12684932970143672, 0.09426986318632165, 0.0636724174477915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 120.84210526315789, 96, 295, 102.0, 291.0, 295.0, 295.0, 0.12685102348746846, 0.043970153289447325, 0.07178401359976498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 744.8333333333334, 607, 807, 786.0, 807.0, 807.0, 807.0, 0.07938818174601074, 23.342761369049192, 0.04527607240202175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1178.3333333333335, 1043, 1261, 1181.5, 1261.0, 1261.0, 1261.0, 0.07913166189678594, 71.20280847335242, 0.04505249891193965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c90165f-f05b-4ff5-89f6-70ce9465bb93", 3, 0, 0.0, 483.0, 220, 762, 467.0, 762.0, 762.0, 762.0, 0.0339735459322341, 0.021841716541719514, 0.021786421056803767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 134.0, 95, 305, 101.5, 305.0, 305.0, 305.0, 0.08013355592654425, 0.14179883138564273, 0.044370826377295496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 116.93750000000003, 96, 294, 103.0, 186.2000000000001, 294.0, 294.0, 0.07765746263948009, 0.057712235418598, 0.03898040605145778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 114.25, 95, 304, 102.0, 165.40000000000015, 304.0, 304.0, 0.07766047809731828, 0.020780245115883993, 0.044290741414876836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 113.25, 98, 291, 102.5, 160.10000000000014, 291.0, 291.0, 0.07765746263948009, 0.02093111297704737, 0.0456540942470381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 138.5625, 98, 301, 103.0, 295.4, 301.0, 301.0, 0.07765821648198572, 0.020931316161160212, 0.04573037552601308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12f021b5-0e5e-41e0-9aac-76601b830f57", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=751924ff-0406-4db0-bfb1-1c1a65c0596b", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 134.83333333333334, 95, 300, 101.0, 300.0, 300.0, 300.0, 0.08011108737449263, 0.0595356811445204, 0.04498425316438795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23b6d8f3-6284-41da-9e4e-ed5df054b1dc", 3, 0, 0.0, 465.0, 326, 554, 515.0, 554.0, 554.0, 554.0, 0.04547521600727603, 0.02923618216613612, 0.029162166515082615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 766.7333333333331, 99, 1433, 948.0, 1297.4, 1433.0, 1433.0, 0.13583511428260947, 81.49532033881806, 0.07207397014344188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 188.578947368421, 94, 1562, 102.0, 292.0, 1562.0, 1562.0, 0.12685102348746846, 6.039799978051434, 0.07400077696251886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 580.1999999999999, 98, 1016, 769.0, 952.4000000000001, 1016.0, 1016.0, 0.13583634437230024, 26.639134337616703, 0.07220727550780152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 162.3684210526316, 96, 580, 102.0, 386.0, 580.0, 580.0, 0.12685017658879846, 1.9954518578543627, 0.07412416003485042], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 520.8666666666667, 107, 719, 524.0, 716.0, 719.0, 719.0, 0.07379710715339959, 0.014456737983371052, 0.05017818926498081], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 257.1875, 199, 588, 208.0, 461.3000000000001, 588.0, 588.0, 0.07761865952574999, 0.12029376237047386, 0.17456618446074437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82412ebd-c2e6-4bb6-8ac5-3dc32dd4d511", 3, 0, 0.0, 1270.6666666666667, 257, 2983, 572.0, 2983.0, 2983.0, 2983.0, 0.07926652046397337, 0.035866036277644196, 0.05083172047982667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 696.3809523809525, 132, 2799, 636.0, 1067.4, 2626.4999999999973, 2799.0, 0.09510912640002898, 0.0584215239312678, 0.0430034428937631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 121.2, 99, 305, 103.0, 217.40000000000003, 305.0, 305.0, 0.13582527436705424, 0.10094046268879713, 0.06817792092252525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 193.33333333333331, 93, 308, 104.0, 306.2, 308.0, 308.0, 0.13583511428260947, 0.17235848810989968, 0.06986311216358171], "isController": false}, {"data": ["login", 21, 0, 0.0, 3460.6190476190473, 1479, 6692, 2999.0, 5474.2, 6574.199999999998, 6692.0, 0.09579243148560376, 32.873428690517464, 0.18991437553598148], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/666295a9-2d02-425e-a458-90e161042b85", 3, 0, 0.0, 491.0, 198, 1061, 214.0, 1061.0, 1061.0, 1061.0, 0.03214228317351476, 0.026795698960732847, 0.02061207612364065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 132.99999999999997, 100, 421, 107.0, 307.0, 421.0, 421.0, 0.13179343113793224, 0.10669604923178304, 0.04684844622481185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/762edd77-43fc-4a2e-a793-86ec408d3810", 2, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 0.01283449913367131, 0.025368189693897192, 0.007977694041583777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5912fc5f-0ce7-4e24-8afb-60935d8c31c2", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=184354f6-2db4-4810-b7e1-ab7c6886304f", 1, 0, 0.0, 714.0, 714, 714, 714.0, 714.0, 714.0, 714.0, 1.4005602240896358, 0.253030899859944, 0.9656206232492998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 907.5333333333333, 197, 1534, 1131.0, 1403.8000000000002, 1534.0, 1534.0, 0.1357048509960736, 108.30355895866882, 0.28205581823239906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a04db5a0-87db-453f-a2f1-36a572f45897", 1, 0, 0.0, 714.0, 714, 714, 714.0, 714.0, 714.0, 714.0, 1.4005602240896358, 0.253030899859944, 0.9656206232492998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6474371-1c41-48db-9bea-9cb69577f80e", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b91305bb-c044-40ae-9021-e1ae7ef65f2d", 3, 0, 0.0, 411.6666666666667, 223, 538, 474.0, 538.0, 538.0, 538.0, 0.024883256056999245, 0.025118156586183157, 0.015957035948010585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 399.42857142857144, 198, 1230, 401.5, 915.0, 1230.0, 1230.0, 0.08198881438318058, 7.124213740080818, 0.18289636467453368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 829.3999999999999, 100, 1562, 1197.5, 1541.0, 1562.0, 1562.0, 0.10785857583536466, 77.43335688245573, 0.17451180512112519], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1123.2173913043478, 154, 2375, 1161.0, 1880.4000000000005, 2308.7999999999993, 2375.0, 0.09158019637979502, 0.02871213357967079, 0.041318408913540335], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 125.26666666666668, 102, 297, 110.0, 202.20000000000005, 297.0, 297.0, 0.07309122271870111, 0.056745627013054085, 0.025981645575788286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12f021b5-0e5e-41e0-9aac-76601b830f57", 3, 0, 0.0, 607.3333333333334, 339, 877, 606.0, 877.0, 877.0, 877.0, 0.022946832189816198, 0.02712237880248132, 0.01471525371547458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 349.2105263157895, 199, 1867, 210.0, 490.0, 1867.0, 1867.0, 0.1267655437908235, 8.167998643108291, 0.2833916183790023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 469.2941176470587, 198, 1366, 218.0, 1338.8, 1366.0, 1366.0, 0.09699099695334162, 20.600546768916097, 0.2137557213990666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 102.11111111111111, 96, 105, 103.0, 105.0, 105.0, 105.0, 0.07898408909405251, 0.058698136523997996, 0.03964631034603807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 100.0, 93, 103, 101.0, 103.0, 103.0, 103.0, 0.07898478226528356, 0.021134599942077826, 0.04504600863566953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 123.55555555555556, 96, 305, 102.0, 305.0, 305.0, 305.0, 0.07884500823492309, 0.021251193625819113, 0.04635224116935908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 102.44444444444444, 100, 109, 102.0, 109.0, 109.0, 109.0, 0.07898478226528356, 0.02128886709493971, 0.04651154658785741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 205.5, 107, 304, 205.5, 304.0, 304.0, 304.0, 0.47961630695443647, 0.14144934052757793, 0.2964815647482014], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1171.6981132075475, 769, 1739, 1164.0, 1564.2, 1707.2, 1739.0, 0.23342876018498127, 279.26195014864567, 0.46093061825589077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1123.2173913043478, 154, 2375, 1161.0, 1880.4000000000005, 2308.7999999999993, 2375.0, 0.0898384860262094, 0.028166074253461713, 0.0405325981876062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 174.5, 100, 395, 101.5, 395.0, 395.0, 395.0, 0.05930934270420948, 0.015985721275743964, 0.03492532583070148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 203.25, 103, 306, 202.0, 306.0, 306.0, 306.0, 0.05912961210974456, 0.01593727826395459, 0.0347617446192053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 140.4, 96, 303, 103.0, 302.4, 303.0, 303.0, 0.07313541265437666, 0.01971227919199996, 0.04299562345501441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 154.79999999999998, 97, 304, 101.0, 303.4, 304.0, 304.0, 0.07313505607020966, 0.019712183081423695, 0.04306683477571916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0adcb3a-a711-4744-b4d7-0240d78a50d8", 3, 0, 0.0, 511.0, 381, 712, 440.0, 712.0, 712.0, 712.0, 0.03955278979010653, 0.02460461630497838, 0.025364256473473262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4fbdcca-3ec4-4069-9f97-dda061f874a6", 3, 0, 0.0, 405.6666666666667, 259, 603, 355.0, 603.0, 603.0, 603.0, 0.049955040463582776, 0.03211627764178906, 0.032034970609784524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.13333333333333, 99, 294, 103.0, 181.80000000000007, 294.0, 294.0, 0.07320608488977604, 0.05440413144640582, 0.03674602307943836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 148.75, 98, 294, 101.5, 294.0, 294.0, 294.0, 0.05930846331771544, 0.015869647411185576, 0.03382435798588458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 152.4, 97, 303, 101.0, 302.4, 303.0, 303.0, 0.07320679944753268, 0.01958853813342183, 0.041750752809920987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 151.0, 100, 300, 102.0, 300.0, 300.0, 300.0, 0.05913485704148311, 0.04394690059430532, 0.0296829262884007], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 590.0714285714286, 100, 1061, 583.0, 990.5, 1061.0, 1061.0, 0.07007918948411705, 0.013530914933875279, 0.04769060913832631], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 108.5, 105, 114, 107.5, 114.0, 114.0, 114.0, 0.06263407606908539, 0.049299868468440255, 0.022264456727682697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1868.0000000000002, 1005, 4401, 1543.0, 3389.8, 4311.5999999999985, 4401.0, 0.09572213232445245, 0.04954368176949199, 0.0440284417234542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 428.5, 205, 601, 454.0, 601.0, 601.0, 601.0, 0.05886768017189362, 0.09123340667265155, 0.1323947924178428], "isController": false}, {"data": ["addBook", 56, 10, 17.857142857142858, 1231.2857142857142, 522, 4669, 887.0, 2170.7000000000007, 3432.099999999999, 4669.0, 0.26702397016960794, 86.63158816827517, 0.9693867895851115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c90165f-f05b-4ff5-89f6-70ce9465bb93", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 188.9245283018868, 96, 447, 104.0, 411.6, 415.3, 447.0, 0.23412582717096486, 0.17399390085654715, 0.11317605903283946], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 633.7735849056605, 462, 957, 596.0, 819.2, 888.0999999999999, 957.0, 0.2340823970037453, 68.82799698618913, 0.11772698677434457], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 158.22641509433964, 97, 317, 105.0, 304.0, 309.9, 317.0, 0.23428210217351905, 0.41456950111173485, 0.11393797547110594], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 981.2264150943394, 667, 1324, 970.0, 1210.4, 1268.6999999999998, 1324.0, 0.2338933534569879, 210.4576505812581, 0.11740349968446463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 110.35294117647061, 101, 130, 108.0, 126.0, 130.0, 130.0, 0.10226732679223491, 0.07640088378521455, 0.036352838820677254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 10, 6.0606060606060606, 226.20606060606056, 98, 3552, 111.0, 323.4000000000001, 384.79999999999995, 3230.5800000000017, 0.7000572774136066, 1.5353528925093871, 0.3359993185048474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 227.88888888888889, 104, 751, 122.0, 751.0, 751.0, 751.0, 0.07520241984675419, 0.05823781146335553, 0.0267321101799009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/751924ff-0406-4db0-bfb1-1c1a65c0596b", 3, 0, 0.0, 511.33333333333337, 232, 920, 382.0, 920.0, 920.0, 920.0, 0.029085550298611648, 0.024247426534747537, 0.01865186656519041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23b6d8f3-6284-41da-9e4e-ed5df054b1dc", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 106.42857142857142, 100, 127, 104.5, 119.0, 127.0, 127.0, 0.07975708271379171, 0.06472474192886808, 0.02835115049591815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6474371-1c41-48db-9bea-9cb69577f80e", 3, 0, 0.0, 443.3333333333333, 351, 572, 407.0, 572.0, 572.0, 572.0, 0.023948271733056598, 0.02401843268539954, 0.015357452901732259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=666295a9-2d02-425e-a458-90e161042b85", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a04db5a0-87db-453f-a2f1-36a572f45897", 3, 0, 0.0, 1259.0, 306, 2974, 497.0, 2974.0, 2974.0, 2974.0, 0.030408076385087877, 0.025349962116604837, 0.019499970858926796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 228.11111111111111, 199, 409, 206.0, 409.0, 409.0, 409.0, 0.07877254864204879, 0.12208206513176897, 0.17716130812757652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82412ebd-c2e6-4bb6-8ac5-3dc32dd4d511", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 311.40000000000003, 199, 597, 208.0, 485.4000000000001, 597.0, 597.0, 0.07309799029258689, 0.11328760800228066, 0.1643990934021754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dc17552-0d4c-4712-a32e-a6247f67c0bb", 2, 0, 0.0, 223.0, 221, 225, 223.0, 225.0, 225.0, 225.0, 0.024170060546001668, 0.027498164586027288, 0.0150236753296192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=762edd77-43fc-4a2e-a793-86ec408d3810", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 119.75000000000001, 100, 305, 104.0, 179.0000000000001, 305.0, 305.0, 0.08068908478405583, 0.06689944627115567, 0.028682448106832348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 111.26666666666667, 103, 135, 108.0, 129.6, 135.0, 135.0, 0.13544262650341315, 0.10515321100606782, 0.048145621139885145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b91305bb-c044-40ae-9021-e1ae7ef65f2d", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/184354f6-2db4-4810-b7e1-ab7c6886304f", 3, 0, 0.0, 545.0, 280, 761, 594.0, 761.0, 761.0, 761.0, 0.023717477409102766, 0.023786962206199747, 0.01520945003122801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 130.41176470588235, 98, 367, 103.0, 315.79999999999995, 367.0, 367.0, 0.09715951305938161, 0.07220545843573184, 0.04876952120363491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 183.52941176470588, 97, 318, 104.0, 309.2, 318.0, 318.0, 0.0971628449280995, 0.05175171749617064, 0.053973156620790566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 306.52941176470586, 95, 1228, 102.0, 1044.7999999999997, 1228.0, 1228.0, 0.09727348153234343, 15.467506142176639, 0.05571097259176609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 261.1764705882353, 97, 905, 103.0, 815.3999999999999, 905.0, 905.0, 0.09715951305938161, 5.062999639223867, 0.05574058231411099], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5582137161084529], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1594896331738437], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.1594896331738437], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.1164274322169059], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1254, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
