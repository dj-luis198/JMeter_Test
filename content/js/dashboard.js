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

    var data = {"OkPercent": 99.76993865030674, "KoPercent": 0.23006134969325154};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8087359364659166, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6d0cf15-dd85-40e9-9940-d8f5c15625f1"], "isController": false}, {"data": [0.14912280701754385, 500, 1500, "see books"], "isController": true}, {"data": [0.875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ade45953-fc78-4863-a651-02d23d249b46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70542c85-bbb7-46f8-818e-8422d664cc38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=653c5096-0b89-42a8-af76-7d2e0a72ef8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=412ff8d4-4785-4650-af13-b4675b9595b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6388885-7b7b-44a6-87c2-e69a13626ebc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47e04829-5083-4e5a-b213-19d57ff2568e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/653c5096-0b89-42a8-af76-7d2e0a72ef8d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c4b29d94-0dac-4dec-85ef-99c989cff020"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6d0cf15-dd85-40e9-9940-d8f5c15625f1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f60dbff7-40b8-4499-a38c-d467a5332975"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f4bc877-53f7-4f9b-8758-2e465c159b30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/486a9d85-c764-4ddf-b0af-6750782a5ab5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f36716e-ecdc-42e4-a7a4-2425c3854abb"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f60dbff7-40b8-4499-a38c-d467a5332975"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccd03fd0-1451-4a91-9968-d916b6cd5575"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9486189-ae58-4528-91ce-254ef16ad5aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ebe1cc5-33b3-449f-914f-c16f38908ed9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6388885-7b7b-44a6-87c2-e69a13626ebc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c12cf8b5-4e17-4530-acdf-8ecc7b01c187"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/412ff8d4-4785-4650-af13-b4675b9595b4"], "isController": false}, {"data": [0.375, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a5a5501-8858-4f69-979a-b89402dc33c1"], "isController": false}, {"data": [0.5087719298245614, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9858757062146892, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47e04829-5083-4e5a-b213-19d57ff2568e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ebe1cc5-33b3-449f-914f-c16f38908ed9"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=486a9d85-c764-4ddf-b0af-6750782a5ab5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ade45953-fc78-4863-a651-02d23d249b46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72c2a2d6-9a81-4972-af88-ef1c29ae24a4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5f4bc877-53f7-4f9b-8758-2e465c159b30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4b29d94-0dac-4dec-85ef-99c989cff020"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f36716e-ecdc-42e4-a7a4-2425c3854abb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5e3d8ad-b540-471b-a301-f192c220e320"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 3, 0.23006134969325154, 354.279141104294, 100, 2460, 122.0, 1003.0, 1193.75, 1666.4000000000015, 5.192219634075932, 698.8550718957176, 3.7935863121901687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/c6d0cf15-dd85-40e9-9940-d8f5c15625f1", 3, 0, 0.0, 419.66666666666663, 212, 728, 319.0, 728.0, 728.0, 728.0, 0.020138418060133317, 0.023802928377716172, 0.012914285019030806], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1689.0000000000002, 1332, 2542, 1644.0, 2074.6000000000004, 2169.7999999999993, 2542.0, 0.25424295813911996, 305.938956600281, 1.2501106388969425], "isController": true}, {"data": ["deleteBook", 12, 0, 0.0, 563.0, 382, 1484, 472.5, 1238.000000000001, 1484.0, 1484.0, 0.08198065256599443, 0.014810957738973602, 0.055721224790949334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 563.0, 382, 1484, 472.5, 1238.000000000001, 1484.0, 1484.0, 0.08235140717967018, 0.01487793977367088, 0.05597322206743207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 155.2173913043478, 101, 305, 103.0, 303.6, 304.8, 305.0, 0.10614878367339405, 0.02840309250635739, 0.06053797818873254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 103.52173913043477, 102, 106, 104.0, 105.0, 105.8, 106.0, 0.10624538063562454, 0.07895774869502957, 0.05333020082686622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ade45953-fc78-4863-a651-02d23d249b46", 3, 0, 0.0, 646.0, 201, 1217, 520.0, 1217.0, 1217.0, 1217.0, 0.018349858400259343, 0.02529676117353461, 0.011767324560062145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70542c85-bbb7-46f8-818e-8422d664cc38", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.8230307667525772, 1.5378342461340206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 155.69565217391303, 101, 307, 104.0, 304.0, 306.4, 307.0, 0.10614976347063575, 0.02861067843544479, 0.06250811266874351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 138.1304347826087, 100, 306, 103.0, 304.6, 305.8, 306.0, 0.10624832543400131, 0.028637243964633168, 0.06246239444459843], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 258.83333333333337, 195, 393, 249.5, 372.9000000000001, 393.0, 393.0, 0.08237910865804432, 0.22627438764862562, 0.05325680657385287], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=653c5096-0b89-42a8-af76-7d2e0a72ef8d", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 104.64285714285715, 101, 115, 104.0, 110.0, 115.0, 115.0, 0.1025400638678112, 0.07620409043301203, 0.05147030549614742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 103.0, 101, 104, 103.0, 104.0, 104.0, 104.0, 0.10254982822903771, 0.027440090756597982, 0.05848544891187307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=412ff8d4-4785-4650-af13-b4675b9595b4", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 806.5, 804, 809, 806.5, 809.0, 809.0, 809.0, 0.10641127959563713, 31.288449388135138, 0.0606876828943868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 952.0, 896, 1008, 952.0, 1008.0, 1008.0, 1008.0, 0.10529640939243973, 94.74589426266189, 0.05994902995682847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 306.5, 306, 307, 306.5, 307.0, 307.0, 307.0, 0.10933741526350317, 0.19347597310299583, 0.060541322709381146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 129.77777777777777, 102, 304, 104.0, 304.0, 304.0, 304.0, 0.047540819075489536, 0.0353306282387183, 0.023863262700001584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 148.66666666666663, 101, 307, 103.0, 307.0, 307.0, 307.0, 0.04754559093886694, 0.012722160075439004, 0.027115844832322548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 169.55555555555554, 100, 308, 103.0, 308.0, 308.0, 308.0, 0.047546093296000846, 0.012815157958687729, 0.02795190250409425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6388885-7b7b-44a6-87c2-e69a13626ebc", 3, 0, 0.0, 415.0, 203, 649, 393.0, 649.0, 649.0, 649.0, 0.019908157035542697, 0.023530767641945158, 0.012766624140631221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 171.33333333333334, 101, 304, 108.0, 304.0, 304.0, 304.0, 0.04754584211610695, 0.01281509025785695, 0.027998186324230945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 102.5, 101, 104, 102.5, 104.0, 104.0, 104.0, 0.1105766572676508, 0.08217659783269751, 0.06209138469619063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 796.8125, 100, 1405, 1108.0, 1345.5, 1405.0, 1405.0, 0.08168516495297998, 45.946040646665715, 0.043634555887968794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 133.07142857142858, 101, 308, 103.0, 307.0, 308.0, 308.0, 0.10255057941077367, 0.02764058585681009, 0.060288524223911864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 529.5, 101, 912, 602.0, 903.6, 912.0, 912.0, 0.081685999019768, 15.019753812438735, 0.04371477291292272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 126.00000000000001, 101, 411, 103.5, 262.5, 411.0, 411.0, 0.10254982822903771, 0.02764038338985782, 0.06038822892784154], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 460.33333333333337, 335, 765, 428.5, 711.0000000000002, 765.0, 765.0, 0.08239551219110265, 0.014885907964212882, 0.05680784336613132], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 346.66666666666663, 205, 608, 408.0, 608.0, 608.0, 608.0, 0.047514967214672625, 0.07363891891570845, 0.10686227489784282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 528.8571428571428, 139, 1104, 529.0, 873.2, 1080.9999999999995, 1104.0, 0.09146819520183981, 0.05618505349800512, 0.04135720154145687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 116.56249999999999, 102, 303, 104.0, 166.50000000000014, 303.0, 303.0, 0.0816847479259732, 0.06070516911295469, 0.04100191448627952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 180.43750000000003, 102, 313, 104.0, 310.9, 313.0, 313.0, 0.08168516495297998, 0.09853671875797707, 0.04229839718390394], "isController": false}, {"data": ["login", 21, 0, 0.0, 2409.999999999999, 1595, 4110, 2399.0, 3545.6000000000004, 4069.0999999999995, 4110.0, 0.08943743851176102, 10.317380462604504, 0.14906655662667537], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 106.92857142857143, 104, 114, 106.0, 112.5, 114.0, 114.0, 0.10372368011617052, 0.08397161212529822, 0.03687052691629499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47e04829-5083-4e5a-b213-19d57ff2568e", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/653c5096-0b89-42a8-af76-7d2e0a72ef8d", 3, 0, 0.0, 277.3333333333333, 195, 415, 222.0, 415.0, 415.0, 415.0, 0.041406724452051014, 0.03451908246149175, 0.026553140354993652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4b29d94-0dac-4dec-85ef-99c989cff020", 3, 0, 0.0, 665.3333333333334, 326, 1050, 620.0, 1050.0, 1050.0, 1050.0, 0.016125564394753815, 0.022230392321543755, 0.010340938104708665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 928.1875000000001, 205, 1508, 1213.0, 1448.5, 1508.0, 1508.0, 0.08164140035411958, 61.09213431349787, 0.1705579743237796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6d0cf15-dd85-40e9-9940-d8f5c15625f1", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f60dbff7-40b8-4499-a38c-d467a5332975", 3, 0, 0.0, 417.66666666666663, 273, 691, 289.0, 691.0, 691.0, 691.0, 0.09690548485044254, 0.043847208314490606, 0.062143165740680927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f4bc877-53f7-4f9b-8758-2e465c159b30", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 304.304347826087, 205, 412, 220.0, 409.6, 411.6, 412.0, 0.10609688029042869, 0.16442944240323273, 0.23861437041880593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1055.5, 998, 1113, 1055.5, 1113.0, 1113.0, 1113.0, 0.10473397570171764, 125.29824636049435, 0.23616284169459573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/486a9d85-c764-4ddf-b0af-6750782a5ab5", 3, 0, 0.0, 319.3333333333333, 193, 491, 274.0, 491.0, 491.0, 491.0, 0.030550520377197094, 0.030640023854864664, 0.01959131677834579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f36716e-ecdc-42e4-a7a4-2425c3854abb", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1126.0, 147, 2188, 1033.0, 1881.6000000000001, 2159.5999999999995, 2188.0, 0.08930963650977941, 0.02865683091134105, 0.04029399615968563], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 261.1428571428571, 205, 528, 209.5, 470.5, 528.0, 528.0, 0.10246201586697504, 0.1587961124813373, 0.23043947513832372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 108.875, 103, 145, 104.5, 126.10000000000002, 145.0, 145.0, 0.16235578240266263, 0.12604770215831718, 0.05771240702594648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 421.15789473684214, 205, 1456, 407.0, 1001.0, 1456.0, 1456.0, 0.09569040628131972, 12.18311110757868, 0.21263277830799218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f60dbff7-40b8-4499-a38c-d467a5332975", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.5392957089552238, 2.058069029850746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 117.33333333333334, 101, 305, 103.0, 191.00000000000006, 305.0, 305.0, 0.0848915651740843, 0.06308836044675602, 0.04261158642527278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 143.53333333333333, 101, 305, 103.0, 304.4, 305.0, 305.0, 0.08484162895927601, 0.022701763998868776, 0.0483862415158371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 145.93333333333334, 101, 309, 103.0, 306.6, 309.0, 309.0, 0.08479558610709118, 0.02285506031792692, 0.04985053011373915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 157.2, 100, 311, 103.0, 307.4, 311.0, 311.0, 0.08479558610709118, 0.02285506031792692, 0.049933338303296854], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1154.263157894737, 809, 2122, 1107.0, 1643.8000000000002, 1742.5999999999995, 2122.0, 0.251885829433522, 301.34302168538136, 0.4973761202290835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1126.0, 147, 2188, 1033.0, 1881.6000000000001, 2159.5999999999995, 2188.0, 0.09000514315103719, 0.02887999849991428, 0.04060778919509686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 145.4, 101, 307, 106.0, 307.0, 307.0, 307.0, 0.028112630442605254, 0.007577232423983448, 0.016554605621963838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 145.2, 103, 306, 106.0, 306.0, 306.0, 306.0, 0.02811278850749206, 0.007577275027409969, 0.016527244806162324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 252.375, 102, 1194, 103.0, 1060.3000000000002, 1194.0, 1194.0, 0.14864638882179154, 16.75409198540478, 0.08579103104851446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 239.9375, 101, 801, 103.0, 663.8000000000002, 801.0, 801.0, 0.14864638882179154, 5.498428470893178, 0.08593619353759824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 103.2, 101, 107, 102.0, 107.0, 107.0, 107.0, 0.028112630442605254, 0.007522324942650234, 0.01603298454929831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 129.125, 102, 306, 103.5, 304.6, 306.0, 306.0, 0.1489217137166206, 0.11067326576010574, 0.07475171958041307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 143.6, 102, 305, 104.0, 305.0, 305.0, 305.0, 0.02811278850749206, 0.02089241411543111, 0.014111302043799725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 152.68750000000003, 101, 305, 103.0, 304.3, 305.0, 305.0, 0.14892448597782887, 0.06780863436246358, 0.0833700796746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 147.8, 106, 309, 108.0, 309.0, 309.0, 309.0, 0.02888653945034693, 0.02273686601267541, 0.010268262070240508], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 592.6666666666667, 389, 1217, 548.5, 1070.3000000000006, 1217.0, 1217.0, 0.08515530198198966, 0.01538450279948055, 0.057962153790475375], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ccd03fd0-1451-4a91-9968-d916b6cd5575", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.8272951748704663, 1.545802299222798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1354.6666666666665, 888, 2460, 1177.0, 2147.4, 2433.7, 2460.0, 0.09109087833295018, 0.04714664601217148, 0.041898245795722204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 290.4, 207, 613, 211.0, 613.0, 613.0, 613.0, 0.028095885638507095, 0.043543135262022234, 0.06318830529832212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9486189-ae58-4528-91ce-254ef16ad5aa", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ebe1cc5-33b3-449f-914f-c16f38908ed9", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6388885-7b7b-44a6-87c2-e69a13626ebc", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c12cf8b5-4e17-4530-acdf-8ecc7b01c187", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/412ff8d4-4785-4650-af13-b4675b9595b4", 3, 0, 0.0, 405.3333333333333, 312, 581, 323.0, 581.0, 581.0, 581.0, 0.01677158223106768, 0.02312098006138399, 0.010755213865626084], "isController": false}, {"data": ["addBook", 60, 1, 1.6666666666666667, 1057.233333333333, 565, 1948, 889.0, 1883.5, 1929.9499999999998, 1948.0, 0.2868288205598899, 81.087604655172, 1.0470419059894638], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 181.75438596491225, 102, 698, 105.0, 412.6, 428.2, 698.0, 0.25301509656742854, 0.18803172703888, 0.12230710234460657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a5a5501-8858-4f69-979a-b89402dc33c1", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 638.842105263158, 499, 911, 605.0, 809.4, 840.4999999999995, 911.0, 0.25286020379645197, 74.34929566511106, 0.1271709032765359], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 169.19298245614038, 101, 418, 107.0, 308.0, 323.09999999999945, 418.0, 0.2531960448112579, 0.4480383136699212, 0.12313635773047503], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 970.9298245614033, 704, 1431, 999.0, 1222.6, 1313.9999999999993, 1431.0, 0.2524089556468755, 227.11802197867587, 0.1266974640649355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 108.10526315789471, 104, 132, 106.0, 114.0, 132.0, 132.0, 0.09459371997271718, 0.07066815994055531, 0.03362511139655181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 1, 0.5649717514124294, 173.48022598870062, 102, 1230, 110.0, 306.20000000000005, 366.4999999999999, 674.6399999999992, 0.7368092413362473, 1.497969026433552, 0.35631878317202625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 136.73333333333332, 104, 319, 108.0, 313.6, 319.0, 319.0, 0.08782304242438436, 0.06801139906497734, 0.031218347111792877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 116.0, 104, 307, 106.0, 120.40000000000002, 270.7999999999995, 307.0, 0.10816098116117868, 0.08777517123529247, 0.038447848772137735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47e04829-5083-4e5a-b213-19d57ff2568e", 3, 0, 0.0, 617.0, 265, 1168, 418.0, 1168.0, 1168.0, 1168.0, 0.02506307540643954, 0.029566596768534147, 0.01607234978863473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ebe1cc5-33b3-449f-914f-c16f38908ed9", 3, 0, 0.0, 304.6666666666667, 234, 389, 291.0, 389.0, 389.0, 389.0, 0.034858995363753614, 0.029060510132347984, 0.022354238563344602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 291.6666666666667, 207, 610, 209.0, 496.00000000000006, 610.0, 610.0, 0.08474528392494958, 0.13133863827040526, 0.19059412976480358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 444.5, 206, 1297, 404.5, 1162.6000000000001, 1297.0, 1297.0, 0.14850428342042493, 22.409227481877835, 0.32924008733908167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 129.55555555555554, 104, 308, 107.0, 308.0, 308.0, 308.0, 0.04807255751347367, 0.03985703254779213, 0.01708829192861759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=486a9d85-c764-4ddf-b0af-6750782a5ab5", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ade45953-fc78-4863-a651-02d23d249b46", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 107.74999999999999, 105, 121, 106.0, 113.30000000000001, 121.0, 121.0, 0.0841710988010879, 0.06534767924498525, 0.029920195276949217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72c2a2d6-9a81-4972-af88-ef1c29ae24a4", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f4bc877-53f7-4f9b-8758-2e465c159b30", 3, 0, 0.0, 855.0, 197, 1971, 397.0, 1971.0, 1971.0, 1971.0, 0.024621445278837868, 0.024693578419303214, 0.015789142968525585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4b29d94-0dac-4dec-85ef-99c989cff020", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 134.78947368421055, 101, 303, 104.0, 303.0, 303.0, 303.0, 0.09574103561566524, 0.07115129697609497, 0.04805751201801947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f36716e-ecdc-42e4-a7a4-2425c3854abb", 3, 0, 0.0, 322.3333333333333, 208, 516, 243.0, 516.0, 516.0, 516.0, 0.02126649039109076, 0.02513627168295916, 0.013637690778140883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 155.42105263157893, 100, 309, 102.0, 306.0, 309.0, 309.0, 0.09574103561566524, 0.04075489602019632, 0.0537559145284502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5e3d8ad-b540-471b-a301-f192c220e320", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.8064038825757576, 1.5067668876262625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 263.84210526315786, 100, 1152, 105.0, 900.0, 1152.0, 1152.0, 0.09574200050390526, 9.091385975686572, 0.0554197373393802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 240.68421052631578, 101, 810, 104.0, 601.0, 810.0, 810.0, 0.09574103561566524, 2.9863565874871507, 0.055512675924152946], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 66.66666666666667, 0.15337423312883436], "isController": false}, {"data": ["401/Unauthorized", 1, 33.333333333333336, 0.07668711656441718], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 3, "406/Not Acceptable", 2, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
