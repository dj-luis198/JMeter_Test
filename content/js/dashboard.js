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

    var data = {"OkPercent": 98.11463046757164, "KoPercent": 1.885369532428356};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7653721682847896, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a61aec3-2a7e-4d64-bd41-aeedff977d42"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3b1a1589-c107-4048-86b3-6b6c7c4be26f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cddeec46-c2a4-45aa-9157-9bd7b34ebe80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b06d89e-7c54-422d-8240-b083fde16f20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b6e0dcb-ba66-4e4d-b83d-16bab14912e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a9d1935-d142-4182-b91e-eb87813f7cac"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0a3e683-3127-484b-847f-5c534f88266e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7982eec6-44e6-417f-83ae-a82ba292ccbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7982eec6-44e6-417f-83ae-a82ba292ccbb"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e6ff564-d07e-4fcd-ac25-060915dcd01b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4946bdf7-1e86-4b7d-96a8-b438e38332b7"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b1a1589-c107-4048-86b3-6b6c7c4be26f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a61aec3-2a7e-4d64-bd41-aeedff977d42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd42a0bd-e8af-45cc-98b0-4b99a693a1e9"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a9d1935-d142-4182-b91e-eb87813f7cac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/643ad974-1017-40c7-b411-f46084dad118"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3be86b2c-2953-4f81-8408-0077de462869"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b6e0dcb-ba66-4e4d-b83d-16bab14912e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0a3e683-3127-484b-847f-5c534f88266e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e6ff564-d07e-4fcd-ac25-060915dcd01b"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cddeec46-c2a4-45aa-9157-9bd7b34ebe80"], "isController": false}, {"data": [0.9329608938547486, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e6c876c-74a2-4385-bd70-2bbe2a089930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/697cce91-bf4d-469a-a37c-8314ff167ba5"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4946bdf7-1e86-4b7d-96a8-b438e38332b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4aeab3b-b44b-43af-8591-fad662cb125e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd42a0bd-e8af-45cc-98b0-4b99a693a1e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=643ad974-1017-40c7-b411-f46084dad118"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3be86b2c-2953-4f81-8408-0077de462869"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 25, 1.885369532428356, 413.68250377073923, 125, 4364, 150.0, 1098.6, 1260.8999999999992, 1724.0300000000002, 5.275491245310342, 726.8807605885296, 3.855236613838815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a61aec3-2a7e-4d64-bd41-aeedff977d42", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1973.6181818181817, 1553, 2626, 1962.0, 2333.6, 2386.7999999999997, 2626.0, 0.24927596662421425, 299.9631937307661, 1.225687980422772], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3b1a1589-c107-4048-86b3-6b6c7c4be26f", 3, 0, 0.0, 559.6666666666666, 213, 923, 543.0, 923.0, 923.0, 923.0, 0.09512937595129375, 0.043043565290461695, 0.061004189656265854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cddeec46-c2a4-45aa-9157-9bd7b34ebe80", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b06d89e-7c54-422d-8240-b083fde16f20", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b6e0dcb-ba66-4e4d-b83d-16bab14912e4", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a9d1935-d142-4182-b91e-eb87813f7cac", 3, 0, 0.0, 365.0, 267, 498, 330.0, 498.0, 498.0, 498.0, 0.025067892208063505, 0.025141333298516817, 0.01607543868811364], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 490.2142857142857, 136, 1139, 448.0, 956.0, 1139.0, 1139.0, 0.07356727727506805, 0.014491768347153473, 0.049499857463400285], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 490.2142857142857, 136, 1139, 448.0, 956.0, 1139.0, 1139.0, 0.07289009215390223, 0.014358371947727391, 0.049044212396522104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 169.87499999999997, 128, 418, 137.0, 403.3, 418.0, 418.0, 0.08189044082647927, 0.021912090611772773, 0.04670314203385146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 136.9375, 127, 143, 137.5, 143.0, 143.0, 143.0, 0.08189547066862533, 0.06086177068244519, 0.04110768742546232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 236.375, 126, 420, 141.0, 418.6, 420.0, 420.0, 0.08189211737187722, 0.022072484760388783, 0.04822358083519723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 217.6875, 126, 421, 133.5, 415.4, 421.0, 421.0, 0.08189588985002814, 0.0220735015611404, 0.048145825868864206], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 267.7857142857143, 128, 488, 224.5, 465.0, 488.0, 488.0, 0.07325394001548798, 0.15252721187655663, 0.04734730804851504], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0a3e683-3127-484b-847f-5c534f88266e", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 138.0, 128, 150, 139.0, 145.8, 150.0, 150.0, 0.10081216802868107, 0.07491998034162722, 0.050602982780021545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 154.56250000000003, 129, 411, 139.0, 222.7000000000002, 411.0, 411.0, 0.1008140736446808, 0.04590289241878166, 0.056437175504700454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 792.8333333333334, 663, 980, 783.5, 980.0, 980.0, 980.0, 0.06042539477924589, 17.76707237703432, 0.03446135796003867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1098.3333333333335, 876, 1257, 1165.5, 1257.0, 1257.0, 1257.0, 0.06014133213050669, 54.115276368215305, 0.0342406217110209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 272.0, 127, 430, 260.0, 430.0, 430.0, 430.0, 0.0605766900896535, 0.10719234613520717, 0.033541975860189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 157.0, 132, 402, 139.0, 273.5, 402.0, 402.0, 0.0898040347669906, 0.06673913130632797, 0.045077415888899575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 196.00000000000003, 127, 420, 137.0, 418.5, 420.0, 420.0, 0.08981037181493932, 0.033666360081855744, 0.05068121567960792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 283.8571428571429, 131, 1125, 139.5, 773.0, 1125.0, 1125.0, 0.08964475065952923, 5.784043644587378, 0.052151033796071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 254.0714285714286, 128, 697, 141.0, 558.5, 697.0, 697.0, 0.08964589870013447, 1.9052129690401487, 0.052239246494205034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7982eec6-44e6-417f-83ae-a82ba292ccbb", 3, 0, 0.0, 389.6666666666667, 281, 493, 395.0, 493.0, 493.0, 493.0, 0.030667634400907758, 0.025107129074961924, 0.019666419195894628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 229.0, 126, 422, 137.0, 422.0, 422.0, 422.0, 0.0607502657824128, 0.045147414316812635, 0.03411269807117906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 610.4999999999999, 126, 1256, 271.5, 1240.6, 1254.05, 1256.0, 0.108535851365085, 44.40720654927527, 0.059567527799978294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 270.62500000000006, 126, 1252, 134.5, 1216.3, 1252.0, 1252.0, 0.10082360280541675, 11.363935101894853, 0.058190184822266885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 515.2272727272727, 130, 1123, 281.5, 1034.3999999999999, 1113.3999999999999, 1123.0, 0.10854067068267148, 14.52257599697073, 0.05967616952572661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 234.125, 127, 665, 138.5, 658.7, 665.0, 665.0, 0.10081724983144616, 3.729229086721738, 0.05828497255880481], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 407.35714285714283, 130, 713, 446.0, 630.5, 713.0, 713.0, 0.07301249556709848, 0.014382483780795628, 0.049595122895675574], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7982eec6-44e6-417f-83ae-a82ba292ccbb", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 502.1428571428571, 272, 1266, 529.5, 1044.5, 1266.0, 1266.0, 0.08956216893983981, 7.782281514288364, 0.19979060844699198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 628.8181818181818, 193, 1997, 488.5, 1527.6999999999998, 1946.4499999999994, 1997.0, 0.09437968949082157, 0.0579734616110613, 0.04267362913501015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 148.95454545454547, 127, 397, 138.5, 143.0, 358.89999999999947, 397.0, 0.10853317415134457, 0.08065795461833322, 0.054478565931436636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 196.54545454545456, 127, 420, 140.0, 398.1, 416.84999999999997, 420.0, 0.10854013518180473, 0.10314396368839114, 0.05775830702057329], "isController": false}, {"data": ["login", 22, 0, 0.0, 2625.954545454546, 1529, 4200, 2282.0, 3827.7, 4145.999999999999, 4200.0, 0.09425716782917173, 30.882485746281127, 0.18484078304142174], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 145.1875, 139, 161, 144.0, 158.9, 161.0, 161.0, 0.10530541862194698, 0.08525214066171292, 0.037432785525770215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e6ff564-d07e-4fcd-ac25-060915dcd01b", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4946bdf7-1e86-4b7d-96a8-b438e38332b7", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5827872983870968, 2.2240423387096775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 777.6818181818181, 269, 1397, 687.5, 1380.6, 1394.8999999999999, 1397.0, 0.10845880044566708, 59.07097257348083, 0.23131265652576882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b1a1589-c107-4048-86b3-6b6c7c4be26f", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a61aec3-2a7e-4d64-bd41-aeedff977d42", 3, 0, 0.0, 386.6666666666667, 289, 548, 323.0, 548.0, 548.0, 548.0, 0.02126649039109076, 0.021328794562158405, 0.013637690778140883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd42a0bd-e8af-45cc-98b0-4b99a693a1e9", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 426.56250000000006, 263, 562, 511.0, 562.0, 562.0, 562.0, 0.08183599044564811, 0.12682980159887067, 0.18405106054328868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 851.5, 128, 1679, 1009.5, 1677.9, 1679.0, 1679.0, 0.09606147934678194, 68.96403698366956, 0.1554244716618636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a9d1935-d142-4182-b91e-eb87813f7cac", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/643ad974-1017-40c7-b411-f46084dad118", 3, 0, 0.0, 745.3333333333334, 427, 1321, 488.0, 1321.0, 1321.0, 1321.0, 0.019435086810054417, 0.02679283614602228, 0.01246325553899974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3be86b2c-2953-4f81-8408-0077de462869", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1176.5000000000002, 213, 4364, 1081.0, 1916.5, 3814.25, 4364.0, 0.093348528399345, 0.029171415124795316, 0.042116230586423234], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 463.49999999999994, 267, 1384, 283.5, 1351.1000000000001, 1384.0, 1384.0, 0.10072205120457278, 15.198910805115421, 0.22330491869841929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 142.81249999999997, 128, 160, 142.5, 155.8, 160.0, 160.0, 0.10554577058307442, 0.08194227306010173, 0.03751822313695224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 459.3846153846154, 261, 1323, 286.0, 1016.1999999999997, 1323.0, 1323.0, 0.07365814687434487, 6.883893867109371, 0.16420919657376296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b6e0dcb-ba66-4e4d-b83d-16bab14912e4", 3, 0, 0.0, 324.0, 228, 491, 253.0, 491.0, 491.0, 491.0, 0.025245725057223646, 0.02983959234465464, 0.016189478633701362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 173.77777777777777, 131, 466, 139.0, 466.0, 466.0, 466.0, 0.051678102839424644, 0.03840530884843961, 0.025939985214320577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 167.55555555555554, 126, 413, 139.0, 413.0, 413.0, 413.0, 0.051676915921657796, 0.022451646196866085, 0.02898976294650291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 306.0, 127, 1180, 141.0, 1180.0, 1180.0, 1180.0, 0.051369863013698634, 5.148162145048516, 0.029709350028538816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 286.0, 133, 918, 139.0, 918.0, 918.0, 918.0, 0.05144650421003893, 1.6931013274627156, 0.029803915579144732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 137.0, 130, 144, 137.0, 144.0, 144.0, 144.0, 0.14914243102162564, 0.043985365398956006, 0.09219449105145414], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1310.1272727272733, 1016, 2027, 1121.0, 1770.8, 1818.8, 2027.0, 0.24586279961734808, 294.1373840812778, 0.48548298908816195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1176.5000000000002, 213, 4364, 1081.0, 1916.5, 3814.25, 4364.0, 0.09548400444000621, 0.02983875138750194, 0.04307969731570593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 165.0, 133, 424, 141.0, 367.8000000000002, 424.0, 424.0, 0.06482103501514455, 0.017471294593925678, 0.03817098058020719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 189.0, 128, 424, 141.0, 422.8, 424.0, 424.0, 0.06482256296628049, 0.01747170642450529, 0.038108577056348486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 238.25000000000003, 128, 422, 140.5, 420.6, 422.0, 422.0, 0.09873008429080947, 0.02661084303150724, 0.05804249096002666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 196.625, 126, 565, 139.5, 457.9000000000001, 565.0, 565.0, 0.09872825664410315, 0.026610350423605926, 0.058137830816791206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 160.63636363636365, 126, 399, 140.0, 347.6000000000002, 399.0, 399.0, 0.06482561908466225, 0.01734591760663814, 0.03697086088422144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 153.0, 126, 412, 135.0, 223.0000000000002, 412.0, 412.0, 0.09873130275953991, 0.07337355605469714, 0.04955848595547218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 184.36363636363637, 133, 411, 140.0, 404.20000000000005, 411.0, 411.0, 0.06482294496531972, 0.04817408312364092, 0.03253807979704525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 169.31250000000003, 125, 416, 135.5, 403.40000000000003, 416.0, 416.0, 0.09873617693522907, 0.02641964109399684, 0.05631047590837283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 147.8181818181818, 142, 162, 144.0, 161.4, 162.0, 162.0, 0.06885414188960803, 0.05419574058889069, 0.024475495749821604], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 430.2857142857142, 128, 614, 455.5, 581.0, 614.0, 614.0, 0.07397739462184341, 0.014283581774083605, 0.050343433449407386], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e0a3e683-3127-484b-847f-5c534f88266e", 3, 0, 0.0, 302.0, 223, 448, 235.0, 448.0, 448.0, 448.0, 0.03446493193175944, 0.028731995663162733, 0.022101535125509792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e6ff564-d07e-4fcd-ac25-060915dcd01b", 3, 0, 0.0, 292.3333333333333, 221, 426, 230.0, 426.0, 426.0, 426.0, 0.020037135491110192, 0.024035431082272476, 0.012849334934077824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1315.409090909091, 905, 3568, 1178.5, 1617.6, 3278.949999999996, 3568.0, 0.09260389525657592, 0.04792975047459496, 0.04259417447836647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 377.5454545454545, 275, 830, 281.0, 824.6, 830.0, 830.0, 0.06476912750097154, 0.10037949740629085, 0.1456672857761108], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 1332.7096774193544, 652, 5214, 1097.5, 1981.9, 2189.8999999999996, 5214.0, 0.28866612968558675, 84.6683838712456, 1.0507250699549773], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 267.6727272727272, 133, 590, 143.0, 557.0, 564.6, 590.0, 0.24691468873036468, 0.18349812316778077, 0.11935817472805714], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 759.6, 627, 1134, 696.0, 980.0, 1078.5999999999997, 1134.0, 0.24683047234376754, 72.5763544120947, 0.1241383723213284], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 212.27272727272722, 126, 547, 141.0, 421.2, 427.2, 547.0, 0.24746238571737098, 0.4378924247264416, 0.1203479180539558], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1040.181818181818, 874, 1405, 972.0, 1249.8, 1295.3999999999994, 1405.0, 0.2465483234714004, 221.84461484529092, 0.12375570142998027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 140.84615384615384, 130, 149, 143.0, 147.8, 149.0, 149.0, 0.077570260755415, 0.05795043894325437, 0.027573803627901426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cddeec46-c2a4-45aa-9157-9bd7b34ebe80", 3, 0, 0.0, 670.6666666666666, 212, 1337, 463.0, 1337.0, 1337.0, 1337.0, 0.02526698783815652, 0.02534101221658862, 0.01620311394569282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, 5.027932960893855, 233.57541899441338, 128, 3790, 144.0, 355.0, 424.0, 3361.999999999994, 0.7441094797053492, 1.5544676642341075, 0.36007890314521357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 176.11111111111111, 130, 452, 142.0, 452.0, 452.0, 452.0, 0.051138106980919806, 0.03960206917565372, 0.018177998965873837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 161.93749999999994, 129, 426, 142.0, 245.40000000000018, 426.0, 426.0, 0.08247465193119552, 0.06693011304181981, 0.02931716142866716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 517.7777777777778, 268, 1319, 285.0, 1319.0, 1319.0, 1319.0, 0.05133031054837882, 6.89392359625859, 0.11398381134685032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e6c876c-74a2-4385-bd70-2bbe2a089930", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/697cce91-bf4d-469a-a37c-8314ff167ba5", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 421.43750000000006, 264, 809, 282.5, 728.5000000000001, 809.0, 809.0, 0.09864547433059798, 0.15288121851822167, 0.22185598377281948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4946bdf7-1e86-4b7d-96a8-b438e38332b7", 3, 0, 0.0, 458.0, 318, 614, 442.0, 614.0, 614.0, 614.0, 0.0822819528250137, 0.03723044089413055, 0.0527654450082282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4aeab3b-b44b-43af-8591-fad662cb125e", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.9706259498480243, 1.8136160714285714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd42a0bd-e8af-45cc-98b0-4b99a693a1e9", 3, 0, 0.0, 287.0, 220, 415, 226.0, 415.0, 415.0, 415.0, 0.019373712455359737, 0.02670822664337516, 0.01242389763576129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 142.28571428571428, 128, 156, 143.0, 155.0, 156.0, 156.0, 0.09166923122254016, 0.07600310283978182, 0.032585547036137315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=643ad974-1017-40c7-b411-f46084dad118", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 144.04545454545453, 129, 167, 144.0, 159.29999999999998, 166.25, 167.0, 0.1127863877083344, 0.08756365061340415, 0.040092036255696996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3be86b2c-2953-4f81-8408-0077de462869", 3, 0, 0.0, 298.0, 213, 384, 297.0, 384.0, 384.0, 384.0, 0.04429548038448477, 0.03692731942209163, 0.02840563032468587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 137.92307692307693, 127, 144, 141.0, 143.6, 144.0, 144.0, 0.07371745799522537, 0.0547841655609048, 0.03700270840775961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 220.46153846153845, 128, 420, 139.0, 417.6, 420.0, 420.0, 0.07371453196942548, 0.02824099406881535, 0.0415640983295153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 255.7692307692308, 126, 1195, 140.0, 870.9999999999998, 1195.0, 1195.0, 0.07371369600471768, 5.120471613493575, 0.04284830075754998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 255.61538461538467, 128, 630, 143.0, 545.5999999999999, 630.0, 630.0, 0.07371913011426465, 1.6857159438884006, 0.042923450835010916], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 32.0, 0.6033182503770739], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15082956259426847], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15082956259426847], "isController": false}, {"data": ["401/Unauthorized", 13, 52.0, 0.9803921568627451], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 25, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
