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

    var data = {"OkPercent": 98.52071005917159, "KoPercent": 1.4792899408284024};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7857142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65f1dda9-8c5a-4304-9550-a9fa7f582064"], "isController": false}, {"data": [0.14035087719298245, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6403131f-9c33-4ec0-9a96-1d3b738a9ea5"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1a249a1-59a6-41d3-bd39-2b0bc7ac1576"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9744e923-0bae-4cee-b906-c2c3def17222"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1a249a1-59a6-41d3-bd39-2b0bc7ac1576"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1cb50545-e6f7-42be-93b4-62c9319f4f23"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0aea05e9-c6bd-4c4e-9ad8-fc956880f1b3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af607d54-be91-4647-8395-5564ae3336cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/961afd37-5753-405d-ab0f-365c1a854602"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02a94770-8bae-451e-a2b9-95a9fe180fbf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bafc9c7-892a-46b4-807b-5987f2267daa"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6403131f-9c33-4ec0-9a96-1d3b738a9ea5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42e17e56-ef78-4080-b75b-8207a57bf05c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=093f3a90-712a-4589-bfb8-e5d4aea2b7e0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07e48a23-fe18-4d6b-a164-fd22d82852dc"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1eece14-900c-4d36-94bc-e3acc3752c26"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f27c3b1-850b-4623-bf6d-fa48e6bf9c9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9744e923-0bae-4cee-b906-c2c3def17222"], "isController": false}, {"data": [0.4649122807017544, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae9f06d4-acb7-4eb0-945e-0f1d5446b396"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "addBook"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5087719298245614, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9153005464480874, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07e48a23-fe18-4d6b-a164-fd22d82852dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af607d54-be91-4647-8395-5564ae3336cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae9f06d4-acb7-4eb0-945e-0f1d5446b396"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=961afd37-5753-405d-ab0f-365c1a854602"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0aea05e9-c6bd-4c4e-9ad8-fc956880f1b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02a94770-8bae-451e-a2b9-95a9fe180fbf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2bafc9c7-892a-46b4-807b-5987f2267daa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42e17e56-ef78-4080-b75b-8207a57bf05c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65f1dda9-8c5a-4304-9550-a9fa7f582064"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/093f3a90-712a-4589-bfb8-e5d4aea2b7e0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 20, 1.4792899408284024, 356.19600591716, 99, 4028, 122.0, 897.7, 1083.0499999999997, 1707.7600000000002, 5.450535982809848, 765.590378249358, 3.987615444680285], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/65f1dda9-8c5a-4304-9550-a9fa7f582064", 3, 0, 0.0, 340.0, 248, 507, 265.0, 507.0, 507.0, 507.0, 0.0976085895558809, 0.0441653448836831, 0.06259404994306166], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1651.9473684210525, 1282, 2860, 1588.0, 1928.0000000000002, 2441.8999999999983, 2860.0, 0.24963649422770354, 300.3964664460632, 1.227460691832507], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6403131f-9c33-4ec0-9a96-1d3b738a9ea5", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 911.5384615384615, 449, 2049, 713.0, 2032.2, 2049.0, 2049.0, 0.06403373099922174, 0.011568593979351584, 0.04352292653853353], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 911.5384615384615, 449, 2049, 713.0, 2032.2, 2049.0, 2049.0, 0.06406718183251853, 0.011574637342788992, 0.04354566265178994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 149.85714285714286, 102, 337, 110.0, 328.4, 336.2, 337.0, 0.13193938327762558, 0.04474060560176925, 0.07471902016159433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 138.61904761904768, 105, 416, 113.0, 288.8000000000001, 406.59999999999985, 416.0, 0.13193275199155632, 0.09804767994684994, 0.06622405715201166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 194.47619047619048, 99, 790, 112.0, 339.6, 745.0999999999993, 790.0, 0.13194601523034005, 1.8813229041003794, 0.07715872123891025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 205.0952380952381, 104, 764, 114.0, 338.4, 721.4999999999993, 764.0, 0.13193440975058116, 5.6869534636709185, 0.0770230924483257], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 287.6428571428571, 110, 1235, 217.0, 760.5, 1235.0, 1235.0, 0.06676235938178056, 0.1312893719092604, 0.04315616520584266], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 125.9375, 104, 353, 112.0, 186.40000000000018, 353.0, 353.0, 0.09778277556408438, 0.07266864473073069, 0.0490823697655658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 123.62499999999999, 106, 321, 111.0, 178.90000000000015, 321.0, 321.0, 0.09777978769563597, 0.0353425233602024, 0.05525178677283921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 724.0, 630, 880, 708.0, 880.0, 880.0, 880.0, 0.061264499264826, 18.013796956685997, 0.03493990973697108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 911.6666666666666, 746, 1036, 965.5, 1036.0, 1036.0, 1036.0, 0.06128577557148986, 55.145048588128944, 0.03489219449040878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 282.3333333333333, 105, 464, 334.5, 464.0, 464.0, 464.0, 0.06153972389177213, 0.1088964645428624, 0.0340752182096043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 126.84615384615383, 105, 334, 109.0, 246.39999999999992, 334.0, 334.0, 0.10527423939362039, 0.07823603142436046, 0.05284273344562586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 127.07692307692308, 102, 335, 110.0, 247.39999999999992, 335.0, 335.0, 0.10527594444669393, 0.028169539822650524, 0.060040187067255134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1a249a1-59a6-41d3-bd39-2b0bc7ac1576", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 160.15384615384616, 105, 343, 109.0, 337.4, 343.0, 343.0, 0.10527594444669393, 0.028375156901647974, 0.06189074077823217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 193.76923076923077, 107, 339, 111.0, 335.0, 339.0, 339.0, 0.10527423939362039, 0.028374697336561745, 0.061992545267922944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 109.66666666666666, 105, 115, 108.5, 115.0, 115.0, 115.0, 0.061683338302268916, 0.045840840281276024, 0.034636640159965454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9744e923-0bae-4cee-b906-c2c3def17222", 3, 0, 0.0, 622.3333333333334, 286, 1001, 580.0, 1001.0, 1001.0, 1001.0, 0.05684402000909504, 0.036027118150295585, 0.03645270814385326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 652.375, 111, 1129, 853.5, 1126.9, 1129.0, 1129.0, 0.07726221346583803, 43.4582313985185, 0.041271905044739654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 183.25, 105, 871, 109.5, 491.60000000000036, 871.0, 871.0, 0.09778098282110359, 5.5236766050595545, 0.05695933227811356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 534.0000000000001, 108, 909, 635.0, 903.4, 909.0, 909.0, 0.07717649782699923, 14.190583593000092, 0.04130148516523006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 190.18749999999997, 104, 711, 110.0, 480.7000000000002, 711.0, 711.0, 0.09778277556408438, 1.8216697134659106, 0.057055867577676195], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 553.6923076923077, 234, 797, 493.0, 779.8, 797.0, 797.0, 0.0642489300082041, 0.011607472706560311, 0.04429662557206259], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 323.84615384615387, 214, 659, 222.0, 576.5999999999999, 659.0, 659.0, 0.10518054645339288, 0.1630093039272798, 0.2365535141427381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1a249a1-59a6-41d3-bd39-2b0bc7ac1576", 3, 0, 0.0, 593.3333333333334, 219, 1102, 459.0, 1102.0, 1102.0, 1102.0, 0.03813737080965638, 0.03179355685010742, 0.024456582192390323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 413.40909090909093, 129, 1371, 373.5, 792.3, 1287.7499999999989, 1371.0, 0.10303098422689295, 0.06328758699093327, 0.046585298532276796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 129.25, 103, 336, 112.5, 219.80000000000013, 336.0, 336.0, 0.07726594455202655, 0.05742127324618379, 0.03878388232396645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 192.06250000000003, 104, 340, 113.5, 333.0, 340.0, 340.0, 0.077182082179622, 0.09310465528552547, 0.0399666006599068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cb50545-e6f7-42be-93b4-62c9319f4f23", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["login", 22, 0, 0.0, 2402.9090909090914, 1272, 4026, 2332.0, 3719.7, 3988.1999999999994, 4026.0, 0.10500892575868949, 34.40519938868099, 0.20592526288029936], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0aea05e9-c6bd-4c4e-9ad8-fc956880f1b3", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af607d54-be91-4647-8395-5564ae3336cc", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 114.5, 109, 126, 114.0, 122.5, 126.0, 126.0, 0.0952681500711534, 0.07712626602440055, 0.03386485022060531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/961afd37-5753-405d-ab0f-365c1a854602", 3, 0, 0.0, 806.0, 229, 1695, 494.0, 1695.0, 1695.0, 1695.0, 0.021545687630620734, 0.02546627336809371, 0.013816733278750925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02a94770-8bae-451e-a2b9-95a9fe180fbf", 3, 0, 0.0, 319.0, 201, 513, 243.0, 513.0, 513.0, 513.0, 0.025240839678599976, 0.02531478745109587, 0.01618634575743553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bafc9c7-892a-46b4-807b-5987f2267daa", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 810.4375, 224, 1243, 1022.0, 1234.6, 1243.0, 1243.0, 0.07713742997367685, 57.721820205306095, 0.16114867878045724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6403131f-9c33-4ec0-9a96-1d3b738a9ea5", 3, 0, 0.0, 748.3333333333333, 224, 1712, 309.0, 1712.0, 1712.0, 1712.0, 0.04882574093061862, 0.031390246854808526, 0.03131077787542926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42e17e56-ef78-4080-b75b-8207a57bf05c", 3, 0, 0.0, 731.0, 476, 1235, 482.0, 1235.0, 1235.0, 1235.0, 0.027342325920524973, 0.02742243039099526, 0.017533978536274152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=093f3a90-712a-4589-bfb8-e5d4aea2b7e0", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 388.6190476190477, 216, 902, 432.0, 729.2, 887.0999999999998, 902.0, 0.13183832854111474, 7.705283264065894, 0.29490120169066963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, 14.285714285714286, 896.4285714285714, 110, 1142, 1067.0, 1142.0, 1142.0, 1142.0, 0.05831438115945651, 59.80017757249727, 0.11808499477253226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07e48a23-fe18-4d6b-a164-fd22d82852dc", 3, 0, 0.0, 358.66666666666663, 209, 641, 226.0, 641.0, 641.0, 641.0, 0.02699128181597344, 0.027070357836918673, 0.017308862362456927], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1037.590909090909, 214, 4028, 810.0, 1666.8, 3679.399999999995, 4028.0, 0.10577279043044717, 0.03327936517094325, 0.04772170818248691], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 126.74999999999996, 110, 320, 114.0, 179.30000000000013, 320.0, 320.0, 0.08364657232030363, 0.06494045409632948, 0.02973374250448293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 342.6875, 216, 987, 227.5, 774.2000000000003, 987.0, 987.0, 0.09771708461078063, 7.448452567898106, 0.21820539902160768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1eece14-900c-4d36-94bc-e3acc3752c26", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 345.85, 218, 899, 236.5, 453.0, 876.6999999999997, 899.0, 0.0917595349626768, 5.623914119096994, 0.20519546788186876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f27c3b1-850b-4623-bf6d-fa48e6bf9c9b", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.6794381648936171, 1.26953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 112.0, 107, 116, 113.0, 116.0, 116.0, 116.0, 0.04601156423981227, 0.03419414100243861, 0.02309564845631202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 109.8888888888889, 106, 114, 110.0, 114.0, 114.0, 114.0, 0.04601085856262078, 0.012311499263826263, 0.026240567773994663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 132.88888888888889, 110, 297, 112.0, 297.0, 297.0, 297.0, 0.045967148810983086, 0.012389583077960285, 0.027023655843956853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 134.11111111111111, 105, 316, 112.0, 316.0, 316.0, 316.0, 0.04596245378219926, 0.01238831762098339, 0.02706578088932241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9744e923-0bae-4cee-b906-c2c3def17222", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1088.8421052631577, 829, 2410, 925.0, 1441.6, 1869.8999999999994, 2410.0, 0.25034477306465924, 299.4993825103432, 0.4943331358757236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1037.590909090909, 214, 4028, 810.0, 1666.8, 3679.399999999995, 4028.0, 0.10427380405056333, 0.03280773806420422, 0.04704540768687524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 195.44444444444446, 102, 462, 111.0, 462.0, 462.0, 462.0, 0.04218202951804688, 0.011369375143536073, 0.024839613085334247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 110.22222222222223, 107, 113, 109.0, 113.0, 113.0, 113.0, 0.04218064564508267, 0.01136900214652619, 0.024797606131191183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 280.0, 105, 1094, 111.5, 1017.7, 1094.0, 1094.0, 0.07979413114165453, 13.479768096747891, 0.04562447635101439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 241.125, 106, 786, 113.5, 705.5000000000001, 786.0, 786.0, 0.07979413114165453, 4.416622691580722, 0.04570240030720741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 161.66666666666666, 104, 342, 111.0, 342.0, 342.0, 342.0, 0.04218104102809257, 0.011286723868845083, 0.024056374961334046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 124.25, 104, 323, 110.5, 184.40000000000015, 323.0, 323.0, 0.07979492703751359, 0.059300722144089685, 0.040053312985626935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 160.66666666666666, 104, 343, 112.0, 343.0, 343.0, 343.0, 0.04217965721998566, 0.031346405414462, 0.021172210753000614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 136.18750000000003, 103, 330, 108.5, 320.90000000000003, 330.0, 330.0, 0.07979811077972729, 0.04382467045873939, 0.04425327359281019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 139.22222222222223, 109, 326, 116.0, 326.0, 326.0, 326.0, 0.044580276694917355, 0.03508955372666346, 0.015846895231396402], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 736.25, 443, 1712, 525.0, 1706.9, 1712.0, 1712.0, 0.08173440405402645, 0.014766469482416885, 0.055633671509430105], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1358.0909090909086, 849, 2936, 1078.5, 2784.7999999999997, 2934.65, 2936.0, 0.1024108443774119, 0.05300561281252764, 0.04710498799000098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 362.1111111111111, 213, 686, 224.0, 686.0, 686.0, 686.0, 0.042158121059386745, 0.06533685363403004, 0.09481460234352311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae9f06d4-acb7-4eb0-945e-0f1d5446b396", 3, 0, 0.0, 325.3333333333333, 209, 537, 230.0, 537.0, 537.0, 537.0, 0.03402981011365957, 0.028369252506862678, 0.021822501928355907], "isController": false}, {"data": ["addBook", 63, 13, 20.634920634920636, 1055.5238095238094, 557, 2758, 900.0, 1700.2, 1943.9999999999993, 2758.0, 0.3002115776833197, 92.40675887798305, 1.090765940103025], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 224.96491228070175, 106, 1537, 115.0, 442.4, 487.19999999999845, 1537.0, 0.2514824227022448, 0.1868926989027425, 0.12156621019297967], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 645.2105263157897, 487, 1035, 583.0, 817.6, 848.4, 1035.0, 0.25247939192331714, 74.2373243302652, 0.1269793816801839], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 193.5964912280702, 99, 592, 114.0, 344.4, 443.99999999999994, 592.0, 0.2528445006321112, 0.4474162452591656, 0.12296539190897599], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 852.0526315789471, 708, 1744, 778.0, 1031.4, 1115.2999999999993, 1744.0, 0.2520785423668848, 226.82071552853571, 0.12653161208650274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 114.44999999999999, 106, 120, 115.5, 118.9, 119.95, 120.0, 0.09612473145153151, 0.07181193316447422, 0.03416933813316159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 13, 7.103825136612022, 184.03825136612025, 105, 1804, 116.0, 333.5999999999999, 431.19999999999993, 1354.599999999998, 0.7728921794292424, 1.6585431708324008, 0.37238165616434304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 116.22222222222223, 109, 125, 116.0, 125.0, 125.0, 125.0, 0.04926027487233379, 0.03814784958375068, 0.0175104883335249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 128.47619047619048, 107, 372, 116.0, 130.4, 347.89999999999964, 372.0, 0.13015023055183697, 0.10561996248884427, 0.046264339766473296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07e48a23-fe18-4d6b-a164-fd22d82852dc", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af607d54-be91-4647-8395-5564ae3336cc", 2, 0, 0.0, 207.0, 206, 208, 207.0, 208.0, 208.0, 208.0, 0.02697017099088408, 0.03105256992016829, 0.016764173667673552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae9f06d4-acb7-4eb0-945e-0f1d5446b396", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 248.77777777777777, 220, 431, 227.0, 431.0, 431.0, 431.0, 0.04593688272313841, 0.07119319617345767, 0.10331312589002711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=961afd37-5753-405d-ab0f-365c1a854602", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 434.25, 215, 1198, 229.5, 1125.2, 1198.0, 1198.0, 0.07974958629902108, 17.989465227622766, 0.17553281134736928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0aea05e9-c6bd-4c4e-9ad8-fc956880f1b3", 3, 0, 0.0, 387.6666666666667, 210, 510, 443.0, 510.0, 510.0, 510.0, 0.027689581333530236, 0.027770703153843314, 0.017756665112973493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02a94770-8bae-451e-a2b9-95a9fe180fbf", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bafc9c7-892a-46b4-807b-5987f2267daa", 3, 0, 0.0, 437.6666666666667, 226, 644, 443.0, 644.0, 644.0, 644.0, 0.030785333866945784, 0.030875525274759105, 0.01974189704358177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 133.9230769230769, 110, 341, 115.0, 257.3999999999999, 341.0, 341.0, 0.1079232250780368, 0.0894793145422395, 0.03836333391445839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42e17e56-ef78-4080-b75b-8207a57bf05c", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 115.31250000000003, 106, 134, 114.5, 127.0, 134.0, 134.0, 0.07644456335820966, 0.0593490506540788, 0.027173653381238595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65f1dda9-8c5a-4304-9550-a9fa7f582064", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 112.89999999999998, 106, 132, 111.0, 121.7, 131.5, 132.0, 0.09180671015244504, 0.06822744768165105, 0.04608266505698902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 174.54999999999995, 104, 343, 112.0, 337.40000000000003, 342.8, 343.0, 0.09180502448899028, 0.03145935848944013, 0.05197204364869889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 165.40000000000003, 104, 782, 111.0, 332.5, 759.5499999999997, 782.0, 0.09180671015244504, 4.153899497186124, 0.05357782225302848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/093f3a90-712a-4589-bfb8-e5d4aea2b7e0", 3, 0, 0.0, 645.3333333333334, 215, 898, 823.0, 898.0, 898.0, 898.0, 0.03095591877166914, 0.025806675772866102, 0.01985128905605085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 194.65, 99, 729, 113.5, 339.90000000000003, 709.5999999999997, 729.0, 0.0918088173188153, 1.3732501095967757, 0.05366870903031527], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.4437869822485207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07396449704142012], "isController": false}, {"data": ["401/Unauthorized", 13, 65.0, 0.9615384615384616], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 20, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
