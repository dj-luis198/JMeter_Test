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

    var data = {"OkPercent": 98.18043972706596, "KoPercent": 1.819560272934041};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8298633702016917, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48214285714285715, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=319bc27a-de74-46d4-b0c5-e28693bbf2a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb078718-6aba-4d24-8bba-24ea0a0006b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37cc38b4-9597-444a-acc0-8f0ecd1c4aa4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48dfc17e-0afc-49d0-a409-e89428d4a268"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d00f11b-aa97-4671-a375-52825e67ad49"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/960ac6ec-b28f-4c46-af47-2d452c4e128f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/4ea604cb-dc76-454e-bc9c-f227cf97f25f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aff13d6d-bc11-436b-ae39-079e449a8b95"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65309927-02ff-41a3-aa0b-5c2b1a148ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36b3022e-61ee-4db5-b3e1-2beb8ee6f8d6"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91810675-4f6f-43d1-b64f-4122097422fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1705dab6-97ae-4862-867d-b4621f795adf"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=601c2a6d-110f-432b-a5b6-8882caa6be95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cdb27533-4f42-414b-9ba0-0229c615a368"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb078718-6aba-4d24-8bba-24ea0a0006b2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d00f11b-aa97-4671-a375-52825e67ad49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aa879b6-2de5-4d94-a64e-f00ae9533ced"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/672d5870-d314-4af7-b078-f970855d71df"], "isController": false}, {"data": [0.3770491803278688, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/319bc27a-de74-46d4-b0c5-e28693bbf2a7"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8392857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c97dd19f-a4bd-4dc1-bbcb-ccf9c772191f"], "isController": false}, {"data": [0.9213483146067416, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aff13d6d-bc11-436b-ae39-079e449a8b95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36b3022e-61ee-4db5-b3e1-2beb8ee6f8d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65309927-02ff-41a3-aa0b-5c2b1a148ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdb27533-4f42-414b-9ba0-0229c615a368"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/601c2a6d-110f-432b-a5b6-8882caa6be95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1705dab6-97ae-4862-867d-b4621f795adf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48dfc17e-0afc-49d0-a409-e89428d4a268"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aa879b6-2de5-4d94-a64e-f00ae9533ced"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37cc38b4-9597-444a-acc0-8f0ecd1c4aa4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1319, 24, 1.819560272934041, 269.88400303260073, 81, 4081, 95.0, 666.0, 823.0, 1192.9999999999989, 5.236267204452614, 715.8054603543313, 3.8228205625712097], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1231.696428571429, 994, 1831, 1202.5, 1415.6, 1485.0, 1831.0, 0.25874655774668714, 311.3600288332032, 1.272254802982978], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 515.3333333333334, 86, 1532, 388.0, 1283.6000000000001, 1532.0, 1532.0, 0.07580275113451451, 0.014849640505452745, 0.051038545067262304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 515.3333333333334, 86, 1532, 388.0, 1283.6000000000001, 1532.0, 1532.0, 0.07684229399861683, 0.015053285328244665, 0.05173847685766245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 118.73684210526315, 82, 254, 84.0, 251.0, 254.0, 254.0, 0.10667325420797916, 0.036975967638703304, 0.06036556994396847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 95.63157894736841, 82, 248, 86.0, 107.0, 248.0, 248.0, 0.10667385311571867, 0.07927617404400578, 0.053545273927225974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=319bc27a-de74-46d4-b0c5-e28693bbf2a7", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 127.57894736842107, 81, 423, 84.0, 252.0, 423.0, 423.0, 0.10667445203018325, 1.6780720312219277, 0.06233459319136274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 187.94736842105266, 81, 735, 85.0, 256.0, 735.0, 735.0, 0.1066726553069646, 5.079040621578755, 0.062229370771692445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb078718-6aba-4d24-8bba-24ea0a0006b2", 3, 0, 0.0, 242.33333333333331, 165, 381, 181.0, 381.0, 381.0, 381.0, 0.05909117768717131, 0.03798993357166775, 0.03789375652465087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37cc38b4-9597-444a-acc0-8f0ecd1c4aa4", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48dfc17e-0afc-49d0-a409-e89428d4a268", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.0753813244047619, 4.103887648809524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d00f11b-aa97-4671-a375-52825e67ad49", 3, 0, 0.0, 567.6666666666666, 392, 833, 478.0, 833.0, 833.0, 833.0, 0.06919138336639144, 0.03211813563817519, 0.04437077644264035], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 202.53333333333336, 83, 392, 189.0, 367.40000000000003, 392.0, 392.0, 0.07604100130790523, 0.15217111316421814, 0.04914941803286999], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/960ac6ec-b28f-4c46-af47-2d452c4e128f", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.8607437668463612, 1.6083010444743935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 112.3157894736842, 83, 253, 86.0, 251.0, 253.0, 253.0, 0.10303240640319292, 0.07656998171174786, 0.0517174383703527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 109.94736842105263, 81, 262, 84.0, 248.0, 262.0, 262.0, 0.10303520007808983, 0.035714915158647095, 0.05830682323497991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 495.5, 409, 584, 494.5, 584.0, 584.0, 584.0, 0.04358295470641432, 12.814835773978798, 0.024855903856001917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 649.75, 568, 732, 649.5, 732.0, 732.0, 732.0, 0.04343435440261475, 39.082308440923846, 0.02472873888351992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 206.5, 85, 251, 245.0, 251.0, 251.0, 251.0, 0.04366240230537484, 0.07726198532943283, 0.024176349714011267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 106.25, 83, 256, 84.5, 250.4, 256.0, 256.0, 0.09923403727478525, 0.07374717027940583, 0.049810835116444935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 146.375, 82, 256, 85.5, 254.6, 256.0, 256.0, 0.09912829059458388, 0.035829939996406594, 0.05601377650907333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ea604cb-dc76-454e-bc9c-f227cf97f25f", 2, 0, 0.0, 497.5, 229, 766, 497.5, 766.0, 766.0, 766.0, 0.022376871265859608, 0.025458061547584416, 0.013909061094452774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 155.0, 82, 565, 85.0, 344.5000000000002, 565.0, 565.0, 0.09913197563831698, 5.599994588400939, 0.05774631198071883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 135.875, 82, 589, 84.0, 354.5000000000002, 589.0, 589.0, 0.09923342181646778, 1.8486949060693643, 0.057902313999354985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aff13d6d-bc11-436b-ae39-079e449a8b95", 3, 0, 0.0, 589.0, 199, 1105, 463.0, 1105.0, 1105.0, 1105.0, 0.016334175450823243, 0.022517979503332175, 0.01047471537699277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65309927-02ff-41a3-aa0b-5c2b1a148ede", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.18799590270551508, 0.7174330124869928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 84.25, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.043742140084203615, 0.032507586527420855, 0.02456223686368856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 475.9375, 83, 805, 572.0, 765.8000000000001, 805.0, 805.0, 0.07694638279863612, 43.280583857730946, 0.04110319471763082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 169.57894736842104, 83, 731, 84.0, 252.0, 731.0, 731.0, 0.10294420424130121, 4.901516640727436, 0.06005431322670481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 390.87500000000006, 83, 590, 537.0, 589.3, 590.0, 590.0, 0.07700823025460846, 14.159643927179092, 0.04121143572219281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 128.26315789473682, 82, 589, 84.0, 255.0, 589.0, 589.0, 0.1029386269070735, 1.6193045987831571, 0.060151585593468275], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 371.5, 91, 961, 391.0, 801.0, 961.0, 961.0, 0.07382603422364015, 0.01454274000052733, 0.05014773446357476], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36b3022e-61ee-4db5-b3e1-2beb8ee6f8d6", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 285.5, 168, 678, 173.5, 561.1000000000001, 678.0, 678.0, 0.09907672873410903, 7.552090993073917, 0.22124152816565626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91810675-4f6f-43d1-b64f-4122097422fa", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.8677606997282609, 1.6214121942934783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1705dab6-97ae-4862-867d-b4621f795adf", 3, 0, 0.0, 285.6666666666667, 181, 449, 227.0, 449.0, 449.0, 449.0, 0.020780948026848982, 0.02456237704605751, 0.013326324092738444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 370.7619047619047, 139, 779, 344.0, 626.0, 764.4999999999998, 779.0, 0.0953899404494229, 0.058594016154967773, 0.04313041252742461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 96.0, 84, 251, 86.0, 139.0000000000001, 251.0, 251.0, 0.07700785961467192, 0.057229473795669276, 0.03865433578314587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 163.31250000000006, 82, 333, 91.0, 278.40000000000003, 333.0, 333.0, 0.07694490264065289, 0.09281854588561178, 0.03984378381367792], "isController": false}, {"data": ["login", 21, 0, 0.0, 1934.4285714285716, 1233, 2898, 1941.0, 2735.6000000000004, 2889.7999999999997, 2898.0, 0.0989068438826117, 22.67598537415046, 0.18046911427743842], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=601c2a6d-110f-432b-a5b6-8882caa6be95", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 107.42105263157895, 83, 256, 88.0, 251.0, 256.0, 256.0, 0.10508093997666096, 0.08507040941469916, 0.037352990382328706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb27533-4f42-414b-9ba0-0229c615a368", 3, 0, 0.0, 462.0, 178, 1024, 184.0, 1024.0, 1024.0, 1024.0, 0.03224523576641551, 0.02688152630136397, 0.020678097154895363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 586.3124999999999, 169, 892, 672.0, 853.5, 892.0, 892.0, 0.07691309301196479, 57.553949201906484, 0.16068001389242745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 302.89473684210526, 170, 842, 333.0, 499.0, 842.0, 842.0, 0.10662237161824702, 6.870095458588431, 0.23836040571215325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 460.14285714285717, 83, 819, 656.0, 819.0, 819.0, 819.0, 0.05231728189298874, 35.771518168110376, 0.08213988426669855], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 997.0000000000001, 261, 4081, 812.0, 1598.6000000000004, 3606.999999999993, 4081.0, 0.09978827531151296, 0.031743111355038, 0.04502166327531151], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 92.35714285714285, 85, 120, 89.0, 110.5, 120.0, 120.0, 0.08518198522700998, 0.0661324982963603, 0.030279533811163706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 293.52631578947364, 169, 816, 174.0, 516.0, 816.0, 816.0, 0.10288957241259802, 6.629576639870251, 0.2300155197412598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb078718-6aba-4d24-8bba-24ea0a0006b2", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 295.93750000000006, 169, 830, 176.5, 601.1000000000003, 830.0, 830.0, 0.08099994431253828, 6.1741940584642405, 0.18087548599966588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 86.54545454545455, 83, 93, 86.0, 91.80000000000001, 93.0, 93.0, 0.05115517690390267, 0.03801668908581048, 0.02567750090684177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 100.36363636363636, 81, 248, 86.0, 216.40000000000012, 248.0, 248.0, 0.05115517690390267, 0.02067279521187544, 0.02878386995888984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 145.0909090909091, 84, 568, 86.0, 506.2000000000002, 568.0, 568.0, 0.051113579019269814, 4.193623210734317, 0.029649869079537376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 129.36363636363637, 83, 409, 86.0, 375.8000000000001, 409.0, 409.0, 0.051117379444307616, 1.3789076477408442, 0.029701992938831086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 97.0, 91, 103, 97.0, 103.0, 103.0, 103.0, 0.06774149844194555, 0.019978449735808156, 0.04187535987671047], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 776.4821428571429, 653, 1477, 674.5, 1068.6, 1110.4499999999998, 1477.0, 0.25609599941463773, 306.37984867470317, 0.5056895613441381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 997.0000000000001, 261, 4081, 812.0, 1598.6000000000004, 3606.999999999993, 4081.0, 0.09713124965687331, 0.030897899219993835, 0.04382288802878463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d00f11b-aa97-4671-a375-52825e67ad49", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 113.0, 83, 252, 86.0, 252.0, 252.0, 252.0, 0.0800854244527496, 0.021585524559530164, 0.04715967865723438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 142.33333333333334, 83, 263, 85.5, 263.0, 263.0, 263.0, 0.07989773090444231, 0.021534935282837966, 0.046971126957494405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aa879b6-2de5-4d94-a64e-f00ae9533ced", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 121.85714285714285, 82, 254, 85.5, 252.5, 254.0, 254.0, 0.08277166844034528, 0.022309551259311815, 0.048660687891687364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 109.7857142857143, 82, 254, 85.0, 252.0, 254.0, 254.0, 0.08277313656976297, 0.022309946966068927, 0.04874238413238972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 97.92857142857143, 82, 253, 87.0, 171.5, 253.0, 253.0, 0.08277068971633302, 0.06151220202551702, 0.04154700636151872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 110.83333333333334, 84, 243, 84.0, 243.0, 243.0, 243.0, 0.08008863141877011, 0.021429965828850595, 0.045675547606017323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 133.71428571428567, 83, 254, 85.5, 253.0, 254.0, 254.0, 0.08277362595780911, 0.02214841163324189, 0.047206833554063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.83333333333333, 86, 249, 87.0, 249.0, 249.0, 249.0, 0.07999040115186178, 0.059445991481022274, 0.040151431828180616], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 448.6153846153846, 93, 1024, 432.0, 813.1999999999998, 1024.0, 1024.0, 0.08128200478938583, 0.015228164058347973, 0.05531963366825687], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 88.83333333333334, 86, 92, 88.5, 92.0, 92.0, 92.0, 0.09333437038189314, 0.07346435793731042, 0.033177451971688574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1129.5238095238094, 772, 1762, 1107.0, 1578.6000000000001, 1745.9999999999998, 1762.0, 0.09760223834466604, 0.05051678351823535, 0.04489321705111104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 283.16666666666663, 170, 503, 251.5, 503.0, 503.0, 503.0, 0.07970985612370969, 0.12353470866047588, 0.17926933462197603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/672d5870-d314-4af7-b078-f970855d71df", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 811.3770491803282, 428, 2344, 691.0, 1310.6000000000001, 1389.8, 2344.0, 0.2836641973930795, 84.53198531805266, 1.0317158951930543], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/319bc27a-de74-46d4-b0c5-e28693bbf2a7", 3, 0, 0.0, 315.6666666666667, 189, 484, 274.0, 484.0, 484.0, 484.0, 0.023654269201353023, 0.027958545400427356, 0.015168916121961412], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 146.46428571428572, 83, 525, 87.0, 334.6, 344.6, 525.0, 0.2567794356354833, 0.19082924855332298, 0.12412677796832441], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 474.9464285714285, 404, 690, 418.5, 611.4000000000002, 667.35, 690.0, 0.2569514545287694, 75.55225922272184, 0.12922851472882446], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 117.71428571428571, 81, 360, 87.5, 249.0, 254.15, 360.0, 0.25734229742336023, 0.4553752372374304, 0.12515279698909512], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 625.607142857143, 566, 916, 582.0, 754.3, 837.9, 916.0, 0.25675471213670353, 231.02834130724827, 0.12887883011549378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 100.49999999999999, 84, 284, 88.0, 150.30000000000013, 284.0, 284.0, 0.08070455072785417, 0.06029197393243012, 0.028687945766541913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c97dd19f-a4bd-4dc1-bbcb-ccf9c772191f", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.7208486173814899, 1.346906743792325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 142.10112359550558, 82, 1162, 89.0, 273.4, 309.14999999999964, 1034.8100000000013, 0.7448197368861513, 1.563805984396445, 0.35880654536496165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 103.63636363636365, 85, 249, 89.0, 218.2000000000001, 249.0, 249.0, 0.05177810727482407, 0.04009769440325731, 0.01840549907034762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aff13d6d-bc11-436b-ae39-079e449a8b95", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36b3022e-61ee-4db5-b3e1-2beb8ee6f8d6", 3, 0, 0.0, 344.3333333333333, 337, 351, 345.0, 351.0, 351.0, 351.0, 0.022415326105635958, 0.02649415660467584, 0.014374411597689728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 89.42105263157895, 85, 98, 88.0, 97.0, 98.0, 98.0, 0.10748855812585213, 0.08722948418221008, 0.038208823396298996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65309927-02ff-41a3-aa0b-5c2b1a148ede", 3, 0, 0.0, 277.3333333333333, 167, 497, 168.0, 497.0, 497.0, 497.0, 0.020238544983539317, 0.02392127501146851, 0.012978494016136866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdb27533-4f42-414b-9ba0-0229c615a368", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 233.54545454545453, 171, 654, 174.0, 592.6000000000003, 654.0, 654.0, 0.05109339873288371, 5.6288468829543135, 0.1137218217002954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/601c2a6d-110f-432b-a5b6-8882caa6be95", 3, 0, 0.0, 266.3333333333333, 180, 423, 196.0, 423.0, 423.0, 423.0, 0.016479260850219998, 0.022717991439023987, 0.010567755167621548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1705dab6-97ae-4862-867d-b4621f795adf", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48dfc17e-0afc-49d0-a409-e89428d4a268", 3, 0, 0.0, 259.6666666666667, 185, 367, 227.0, 367.0, 367.0, 367.0, 0.07590708972218005, 0.03518609888163555, 0.048677398031476145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 269.2857142857143, 169, 504, 266.0, 423.5, 504.0, 504.0, 0.0827271599175092, 0.12821094022371787, 0.18605532157228877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aa879b6-2de5-4d94-a64e-f00ae9533ced", 3, 0, 0.0, 241.66666666666669, 164, 396, 165.0, 396.0, 396.0, 396.0, 0.04078192545064028, 0.033998213241891194, 0.026152471724531688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 109.0, 84, 250, 89.0, 247.2, 250.0, 250.0, 0.09974191778772426, 0.08269617988454873, 0.035455134838605115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37cc38b4-9597-444a-acc0-8f0ecd1c4aa4", 3, 0, 0.0, 272.6666666666667, 182, 432, 204.0, 432.0, 432.0, 432.0, 0.0903152000481681, 0.040865276063461485, 0.05791697398922239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 98.75, 83, 250, 88.5, 143.6000000000001, 250.0, 250.0, 0.07556794030132716, 0.058668469276909274, 0.026862041278987392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 106.06250000000001, 82, 248, 86.0, 247.3, 248.0, 248.0, 0.08110505639335952, 0.060274363198580656, 0.04071093650994804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 146.43750000000006, 83, 254, 86.0, 251.2, 254.0, 254.0, 0.08103932939954922, 0.02929168143946109, 0.04579236520880289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 177.75000000000003, 81, 744, 85.0, 402.4000000000003, 744.0, 744.0, 0.08103604584614293, 4.57775016871958, 0.04720507944064869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 124.68749999999999, 82, 569, 84.5, 345.0000000000002, 569.0, 569.0, 0.08110752322970158, 1.5110137521607552, 0.04732592297826825], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 16.666666666666668, 0.3032600454890068], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1516300227445034], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.0758150113722517], "isController": false}, {"data": ["401/Unauthorized", 17, 70.83333333333333, 1.288855193328279], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1319, 24, "401/Unauthorized", 17, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
