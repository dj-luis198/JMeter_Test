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

    var data = {"OkPercent": 97.75112443778112, "KoPercent": 2.2488755622188905};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7591639871382637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18efd73f-10ee-4c6c-b8e5-b46144233bd7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8ba9e7c-085e-4da7-92ff-d4fbc86c9db0"], "isController": false}, {"data": [0.02727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27699c0e-1772-4f52-be66-36b4233826fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f39428a2-d1aa-4bf4-923b-cce06d4528a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1cc4229d-c683-4772-9f47-7e918865e35a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f3505942-5aae-4275-b36e-5077a90c62ad"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/808843ab-c432-4bf7-b0da-4654212ccb46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9abb5d9f-5ee1-4e26-bfc0-5e4e92d159da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/11802132-c027-4ef8-873e-6d34692f8a71"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3e6b261-d94d-41fc-bdab-434e4e0b986c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19c6706e-7d15-4a85-a432-df025f96e35c"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3505942-5aae-4275-b36e-5077a90c62ad"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed77cae1-a767-4d63-83f5-56c0a90b5bd6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1df2f61a-600c-488c-8900-8bbba573faa5"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0dcdae3d-8498-43d2-8ea8-43ad144b35e6"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27699c0e-1772-4f52-be66-36b4233826fb"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=808843ab-c432-4bf7-b0da-4654212ccb46"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8ba9e7c-085e-4da7-92ff-d4fbc86c9db0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3e6b261-d94d-41fc-bdab-434e4e0b986c"], "isController": false}, {"data": [0.25806451612903225, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18efd73f-10ee-4c6c-b8e5-b46144233bd7"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44545454545454544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9abb5d9f-5ee1-4e26-bfc0-5e4e92d159da"], "isController": false}, {"data": [0.8994413407821229, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e87e8c4-3906-4bd3-8199-f9faf6f8ff59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e87e8c4-3906-4bd3-8199-f9faf6f8ff59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83f82d06-32b2-4317-a5d8-bfae8cb9b617"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed77cae1-a767-4d63-83f5-56c0a90b5bd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1df2f61a-600c-488c-8900-8bbba573faa5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19c6706e-7d15-4a85-a432-df025f96e35c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dcdae3d-8498-43d2-8ea8-43ad144b35e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 30, 2.2488755622188905, 422.10419790104964, 115, 3701, 133.0, 1203.5, 1439.5, 1969.6000000000004, 5.213544272136068, 723.4038924980068, 3.80994559169233], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18efd73f-10ee-4c6c-b8e5-b46144233bd7", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8ba9e7c-085e-4da7-92ff-d4fbc86c9db0", 3, 0, 0.0, 429.33333333333337, 235, 811, 242.0, 811.0, 811.0, 811.0, 0.028367453075504704, 0.028450560848186847, 0.018191368020424568], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2006.072727272727, 1445, 2706, 1984.0, 2495.6, 2545.8, 2706.0, 0.25277013084301136, 304.16609428354604, 1.2428687585884397], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27699c0e-1772-4f52-be66-36b4233826fb", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f39428a2-d1aa-4bf4-923b-cce06d4528a5", 2, 0, 0.0, 221.5, 218, 225, 221.5, 225.0, 225.0, 225.0, 0.02296659508744531, 0.03227434602620489, 0.014275622825350527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cc4229d-c683-4772-9f47-7e918865e35a", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3505942-5aae-4275-b36e-5077a90c62ad", 3, 0, 0.0, 1274.6666666666667, 225, 3099, 500.0, 3099.0, 3099.0, 3099.0, 0.02368901066795114, 0.023758412066392398, 0.015191194992143144], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 625.8571428571429, 124, 1487, 523.0, 1218.5, 1487.0, 1487.0, 0.08397766194192345, 0.01654247470172934, 0.05650450105271997], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 625.8571428571429, 124, 1487, 523.0, 1218.5, 1487.0, 1487.0, 0.08393084098702669, 0.01653325160068104, 0.05647299750005995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 169.0, 115, 361, 121.0, 359.8, 361.0, 361.0, 0.0879863445193306, 0.023543221092086508, 0.05017971210868073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 121.33333333333333, 119, 129, 121.0, 126.6, 129.0, 129.0, 0.08798479622721193, 0.06538713860244949, 0.04416424341873724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/808843ab-c432-4bf7-b0da-4654212ccb46", 3, 0, 0.0, 321.0, 230, 466, 267.0, 466.0, 466.0, 466.0, 0.03473227206946455, 0.028615683791606367, 0.022272973950795947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 122.33333333333333, 118, 141, 121.0, 130.8, 141.0, 141.0, 0.08798479622721193, 0.023714652108115717, 0.0518113594970789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 153.26666666666665, 117, 355, 121.0, 352.6, 355.0, 355.0, 0.08798479622721193, 0.023714652108115717, 0.051725436844513265], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 261.3333333333333, 120, 507, 235.0, 435.00000000000006, 507.0, 507.0, 0.07408687921369125, 0.13707037327439311, 0.0478863630750994], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 139.78571428571428, 117, 386, 121.0, 255.0, 386.0, 386.0, 0.08574123295892995, 0.06371980300951727, 0.04303807982508788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 829.5714285714286, 695, 1050, 731.0, 1050.0, 1050.0, 1050.0, 0.03291546368483914, 9.678239219597867, 0.01877210038275982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 189.42857142857144, 117, 370, 122.0, 369.0, 370.0, 370.0, 0.08574018274907523, 0.041339016682589845, 0.04787000716542956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1225.5714285714284, 1058, 1331, 1288.0, 1331.0, 1331.0, 1331.0, 0.03286384976525821, 29.57094978726526, 0.01871057071596244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 256.00000000000006, 119, 370, 350.0, 370.0, 370.0, 370.0, 0.03304521056880248, 0.058474532764326285, 0.018297494523936534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 141.46153846153848, 117, 362, 124.0, 268.79999999999995, 362.0, 362.0, 0.06170114811597917, 0.0458540758947853, 0.030971084112903606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 138.3076923076923, 116, 358, 120.0, 264.3999999999999, 358.0, 358.0, 0.06170319812422277, 0.023639296156365397, 0.034791481754838954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 264.76923076923083, 119, 1505, 123.0, 1049.3999999999996, 1505.0, 1505.0, 0.06170319812422277, 4.286170570481665, 0.035866837972148125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 221.76923076923077, 120, 711, 122.0, 573.3999999999999, 711.0, 711.0, 0.06170290525756216, 1.4109440930147563, 0.03592692447801715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 189.42857142857142, 119, 359, 121.0, 359.0, 359.0, 359.0, 0.0330445865886185, 0.02455754921283074, 0.018555309852007457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 879.3571428571429, 119, 1521, 1129.5, 1482.0, 1521.0, 1521.0, 0.16677189178886678, 96.48425168930991, 0.08883022919222842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 288.7142857142857, 117, 1305, 121.5, 1178.5, 1305.0, 1305.0, 0.08574123295892995, 11.041253111947428, 0.04935384028858049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 681.5000000000001, 119, 1069, 942.0, 1022.5, 1069.0, 1069.0, 0.1667798387000703, 31.541003828490762, 0.0889973330116865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 274.8571428571429, 118, 948, 123.0, 836.0, 948.0, 948.0, 0.08574228319451249, 3.621391359933856, 0.049438177517148456], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 617.5, 121, 1699, 477.5, 1610.5, 1699.0, 1699.0, 0.08417204766542813, 0.01658076608587954, 0.05717546039103929], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 425.53846153846155, 242, 1868, 250.0, 1315.9999999999995, 1868.0, 1868.0, 0.06166573377479674, 5.763114937812479, 0.1374740070038043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9abb5d9f-5ee1-4e26-bfc0-5e4e92d159da", 3, 0, 0.0, 404.3333333333333, 243, 507, 463.0, 507.0, 507.0, 507.0, 0.024026525283913438, 0.024096915494706158, 0.015407635029072097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11802132-c027-4ef8-873e-6d34692f8a71", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.4794833896396396, 0.8959154466966966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 664.5652173913044, 162, 2936, 529.0, 1236.4000000000005, 2629.1999999999957, 2936.0, 0.09935891897496155, 0.061031992221924625, 0.044924979966217964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 140.14285714285714, 118, 359, 122.5, 248.5, 359.0, 359.0, 0.16725005077233682, 0.12429422718530111, 0.08395168564158315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3e6b261-d94d-41fc-bdab-434e4e0b986c", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 206.85714285714283, 118, 364, 122.0, 363.0, 364.0, 364.0, 0.16725604511134473, 0.20624667727946097, 0.08635806681879003], "isController": false}, {"data": ["login", 23, 0, 0.0, 3175.6086956521735, 1539, 6157, 2738.0, 5778.6, 6088.199999999999, 6157.0, 0.0953324408006267, 34.840173900101966, 0.19194801610082027], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 124.5, 121, 136, 124.0, 131.5, 136.0, 136.0, 0.08185267687486479, 0.06626549719654583, 0.029096068732862097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19c6706e-7d15-4a85-a432-df025f96e35c", 3, 0, 0.0, 364.6666666666667, 213, 597, 284.0, 597.0, 597.0, 597.0, 0.031303476772820235, 0.031395186177428105, 0.0200741696752786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1021.5000000000001, 244, 1644, 1250.0, 1606.0, 1644.0, 1644.0, 0.16652789342214822, 128.16555167940408, 0.3471344564053765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3505942-5aae-4275-b36e-5077a90c62ad", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 944.4545454545454, 119, 1646, 1201.0, 1623.6000000000001, 1646.0, 1646.0, 0.051613629751973054, 39.29910523667195, 0.08649773515873536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 323.79999999999995, 242, 486, 246.0, 483.0, 486.0, 486.0, 0.08792239383370945, 0.136262538099704, 0.19773952441311804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed77cae1-a767-4d63-83f5-56c0a90b5bd6", 3, 0, 0.0, 383.0, 302, 464, 383.0, 464.0, 464.0, 464.0, 0.03124837248059997, 0.02605048239675017, 0.020038832612884746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1df2f61a-600c-488c-8900-8bbba573faa5", 3, 0, 0.0, 937.3333333333334, 387, 1232, 1193.0, 1232.0, 1232.0, 1232.0, 0.06034031940142403, 0.02730242316665996, 0.03869480117864757], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1216.8333333333335, 243, 2460, 1262.0, 2012.0, 2389.5, 2460.0, 0.10338989622239167, 0.0323093425694974, 0.046646613334711866], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 137.6818181818182, 121, 359, 125.5, 139.2, 326.2999999999995, 359.0, 0.11024253357386249, 0.08558868573361395, 0.039187775606333936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 498.07142857142856, 239, 1691, 361.0, 1431.0, 1691.0, 1691.0, 0.08567669287965483, 14.756543366176066, 0.1895572924635109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dcdae3d-8498-43d2-8ea8-43ad144b35e6", 3, 0, 0.0, 463.33333333333337, 265, 825, 300.0, 825.0, 825.0, 825.0, 0.07110184153769582, 0.03217173168535065, 0.04559590749650416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 425.3, 241, 1455, 246.0, 1350.700000000002, 1454.55, 1455.0, 0.10341047754958532, 12.51572768337263, 0.22992673367665611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 120.69999999999999, 118, 126, 120.5, 125.7, 126.0, 126.0, 0.04389372451420621, 0.03262023862823332, 0.02203259218779491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 165.4, 115, 360, 118.0, 359.3, 360.0, 360.0, 0.043894495191358046, 0.011745206721125105, 0.02503357928882139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 166.89999999999998, 116, 357, 121.0, 356.5, 357.0, 357.0, 0.04384907149591107, 0.01181869505163228, 0.025778458047400844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 143.59999999999997, 118, 352, 120.5, 329.1000000000001, 352.0, 352.0, 0.04389410984939931, 0.011830834295345908, 0.02584780101483182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 123.0, 121, 125, 123.0, 125.0, 125.0, 125.0, 0.017232911414218878, 0.005082362545990332, 0.01065276652851616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27699c0e-1772-4f52-be66-36b4233826fb", 3, 0, 0.0, 338.0, 262, 487, 265.0, 487.0, 487.0, 487.0, 0.08617965585590762, 0.03899405001292695, 0.055264948579472006], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1411.2181818181823, 934, 2203, 1411.0, 1968.6, 2044.3999999999999, 2203.0, 0.24044872103139386, 287.6602638542181, 0.47479229875534995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1216.8333333333335, 243, 2460, 1262.0, 2012.0, 2389.5, 2460.0, 0.1000045835434124, 0.031251432357316374, 0.045119255465875516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 148.55555555555554, 118, 364, 121.0, 364.0, 364.0, 364.0, 0.04732781876600601, 0.012756326151775056, 0.027869799527247677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 174.33333333333334, 118, 363, 123.0, 363.0, 363.0, 363.0, 0.04732781876600601, 0.012756326151775056, 0.027823580954233998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 207.18181818181813, 116, 1326, 120.0, 362.6, 1181.849999999998, 1326.0, 0.11375858360221726, 4.682002947704662, 0.0664332353458261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=808843ab-c432-4bf7-b0da-4654212ccb46", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 203.09090909090904, 118, 965, 122.0, 367.7, 875.8999999999987, 965.0, 0.1136187574239529, 1.5477630500180757, 0.06646253486030057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 143.13636363636363, 119, 361, 121.0, 290.6999999999998, 360.85, 361.0, 0.11375858360221726, 0.08454129113406966, 0.05710147653470671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 147.77777777777777, 117, 367, 120.0, 367.0, 367.0, 367.0, 0.04732781876600601, 0.0126638890057477, 0.0269916466399878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 184.54545454545453, 116, 366, 120.0, 363.2, 365.85, 366.0, 0.11362110460372057, 0.03815950272690651, 0.06436579088035697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 149.0, 121, 351, 122.0, 351.0, 351.0, 351.0, 0.047326574397374956, 0.035171409293361655, 0.02375572191430735], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 541.5714285714287, 119, 1232, 491.0, 1028.5, 1232.0, 1232.0, 0.08514364950008514, 0.01643956625392269, 0.05794234406548763], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 151.33333333333334, 119, 365, 126.0, 365.0, 365.0, 365.0, 0.048314624836938144, 0.03802889415876186, 0.017174339297505354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1700.0434782608693, 1065, 3701, 1412.0, 3314.000000000001, 3665.9999999999995, 3701.0, 0.09855256279512208, 0.05100865066544405, 0.04533032917627197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8ba9e7c-085e-4da7-92ff-d4fbc86c9db0", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 326.1111111111111, 239, 718, 248.0, 718.0, 718.0, 718.0, 0.047297226280441015, 0.07330146299517568, 0.1063725704334528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3e6b261-d94d-41fc-bdab-434e4e0b986c", 3, 0, 0.0, 328.0, 221, 492, 271.0, 492.0, 492.0, 492.0, 0.02153517052265859, 0.025832390421873994, 0.013809988909387182], "isController": false}, {"data": ["addBook", 62, 14, 22.580645161290324, 1175.9354838709678, 609, 2366, 1001.5, 2070.7, 2278.9499999999994, 2366.0, 0.28428891089835295, 83.40536381816057, 1.0337489554102015], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/18efd73f-10ee-4c6c-b8e5-b46144233bd7", 3, 0, 0.0, 421.3333333333333, 282, 516, 466.0, 516.0, 516.0, 516.0, 0.03057823441274501, 0.02549181586296874, 0.01960908912536057], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 228.10909090909095, 118, 656, 125.0, 492.4, 499.79999999999995, 656.0, 0.24157666105915993, 0.17953109283791086, 0.11677778049246501], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 768.4000000000001, 584, 1206, 713.0, 962.4, 1077.7999999999995, 1206.0, 0.24151089214123558, 71.01222120586388, 0.1214629975124378], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 185.0545454545454, 117, 476, 123.0, 362.0, 365.59999999999997, 476.0, 0.2420092931568572, 0.42824300703147, 0.1176959257735497], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1179.5090909090904, 808, 1675, 1163.0, 1531.6, 1618.9999999999998, 1675.0, 0.24100503481427274, 216.8567539675454, 0.120973230365758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 151.3, 121, 373, 126.0, 343.1000000000005, 372.6, 373.0, 0.10844987175802664, 0.08101967958485388, 0.038550540351486036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9abb5d9f-5ee1-4e26-bfc0-5e4e92d159da", 1, 0, 0.0, 1522.0, 1522, 1522, 1522.0, 1522.0, 1522.0, 1522.0, 0.657030223390276, 0.11870174934296977, 0.45299154073587383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 14, 7.82122905027933, 190.11173184357537, 118, 1130, 129.0, 361.0, 490.0, 879.5999999999965, 0.7345006011415535, 1.553059878468874, 0.35449543732535094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 150.79999999999998, 121, 372, 124.0, 348.5000000000001, 372.0, 372.0, 0.04576742823667253, 0.03544294003093878, 0.016268890506004687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e87e8c4-3906-4bd3-8199-f9faf6f8ff59", 3, 0, 0.0, 375.3333333333333, 294, 490, 342.0, 490.0, 490.0, 490.0, 0.02158583968916391, 0.025513731741977266, 0.013842481831918262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 140.53333333333333, 120, 359, 124.0, 224.60000000000008, 359.0, 359.0, 0.08530918893710439, 0.06923040625657592, 0.030324750754986324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e87e8c4-3906-4bd3-8199-f9faf6f8ff59", 1, 0, 0.0, 1102.0, 1102, 1102, 1102.0, 1102.0, 1102.0, 1102.0, 0.9074410163339383, 0.16394198049001812, 0.6256380444646098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 313.29999999999995, 238, 483, 245.5, 483.0, 483.0, 483.0, 0.043825050398807956, 0.06792026853799632, 0.09856356549653782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 406.95454545454544, 239, 1446, 246.0, 724.6, 1338.1499999999985, 1446.0, 0.11354780104360752, 6.3426436750649025, 0.2540511081233129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83f82d06-32b2-4317-a5d8-bfae8cb9b617", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed77cae1-a767-4d63-83f5-56c0a90b5bd6", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 143.69230769230768, 118, 361, 127.0, 269.79999999999995, 361.0, 361.0, 0.06264969663089208, 0.051942961366823616, 0.02227000934926242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1df2f61a-600c-488c-8900-8bbba573faa5", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 0.6498707284172661, 2.4800472122302155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19c6706e-7d15-4a85-a432-df025f96e35c", 1, 0, 0.0, 1699.0, 1699, 1699, 1699.0, 1699.0, 1699.0, 1699.0, 0.5885815185403178, 0.10633552825191289, 0.40579936727486754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 125.78571428571429, 121, 137, 125.0, 135.0, 137.0, 137.0, 0.16372354110630336, 0.12710958513624138, 0.058198602502631265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dcdae3d-8498-43d2-8ea8-43ad144b35e6", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 121.9, 118, 133, 121.5, 126.7, 132.7, 133.0, 0.1034757504578802, 0.07689945908051447, 0.05193997630405314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 167.95000000000002, 118, 359, 121.5, 352.8, 358.7, 359.0, 0.1034757504578802, 0.0432294199666808, 0.05814447931002369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 264.4, 117, 1328, 121.0, 1227.900000000002, 1327.85, 1328.0, 0.1034757504578802, 9.33586716882586, 0.05994317887852981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 240.34999999999997, 117, 951, 123.5, 679.3000000000008, 939.1499999999999, 951.0, 0.1034762858221967, 3.0676474601745642, 0.06004454007377859], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.5997001499250375], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.666666666666667, 0.14992503748125938], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.14992503748125938], "isController": false}, {"data": ["401/Unauthorized", 18, 60.0, 1.3493253373313343], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 30, "401/Unauthorized", 18, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
