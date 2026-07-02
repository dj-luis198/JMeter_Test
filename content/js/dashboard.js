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

    var data = {"OkPercent": 98.0465815176559, "KoPercent": 1.953418482344102};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7649710238248552, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017857142857142856, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/06ede95f-961b-4220-861e-49b78abb5f5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05ba0755-7b95-4dc7-a7f8-a6882564b7f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3763bce-8197-4ff0-9bdb-e8dd6b065b9e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bb63f1d-d5f2-4fa9-8164-d5e85b92660a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c18ea0f-02a6-4c8f-967d-8d1058a9349d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e998e711-ab99-44a9-9273-e6930652378a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0ed9212-bebc-4042-a10f-04759c43a757"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e20f540a-41af-42aa-9665-973e74818369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcdcc483-ac3a-4b0f-ab3d-a45c062ddaf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c18ea0f-02a6-4c8f-967d-8d1058a9349d"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1456b4f8-d8a5-4d60-8f9d-ddff4ce96717"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9a89550-3ce3-42d9-98b6-5b06c61a2eca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bb63f1d-d5f2-4fa9-8164-d5e85b92660a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26cad5c3-75a4-4d57-acaa-e04cc9227c54"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=133419fd-7bba-474c-9e46-26c55902a4c8"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b86a25a1-e1bf-4ef5-a36d-01feeec65a22"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26cad5c3-75a4-4d57-acaa-e04cc9227c54"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96dc9c12-a2c2-4f41-9bf5-3812c81e016b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1456b4f8-d8a5-4d60-8f9d-ddff4ce96717"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06ede95f-961b-4220-861e-49b78abb5f5e"], "isController": false}, {"data": [0.2786885245901639, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e20f540a-41af-42aa-9665-973e74818369"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05ba0755-7b95-4dc7-a7f8-a6882564b7f5"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9269662921348315, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e9a89550-3ce3-42d9-98b6-5b06c61a2eca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96dc9c12-a2c2-4f41-9bf5-3812c81e016b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dcdcc483-ac3a-4b0f-ab3d-a45c062ddaf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc66573a-dd08-4b4c-a586-8c1075601b94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f629980f-3ac3-4355-8fe5-e4a9d755f68c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ecf0554-080a-480b-a961-3b24415fb243"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b86a25a1-e1bf-4ef5-a36d-01feeec65a22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/133419fd-7bba-474c-9e46-26c55902a4c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 26, 1.953418482344102, 416.98121712997727, 114, 2296, 137.0, 1192.0, 1390.5999999999995, 1823.3600000000001, 5.146686361474481, 715.7429957479902, 3.752473682925839], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2038.625, 1468, 3002, 2032.0, 2372.9, 2519.5499999999997, 3002.0, 0.23265572353852737, 279.96254690765227, 1.1439663750160989], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/06ede95f-961b-4220-861e-49b78abb5f5e", 3, 0, 0.0, 322.0, 214, 503, 249.0, 503.0, 503.0, 503.0, 0.04608648897764805, 0.029629171787387665, 0.029554161225900606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05ba0755-7b95-4dc7-a7f8-a6882564b7f5", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3763bce-8197-4ff0-9bdb-e8dd6b065b9e", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 1.0936162243150687, 2.043423587328767], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 560.5999999999998, 125, 1257, 491.0, 1199.4, 1257.0, 1257.0, 0.0768430813051029, 0.015053439560355117, 0.051739006956860296], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 560.5999999999998, 125, 1257, 491.0, 1199.4, 1257.0, 1257.0, 0.07575107187766707, 0.01483951661978517, 0.05100374904679901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bb63f1d-d5f2-4fa9-8164-d5e85b92660a", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 167.9375, 116, 367, 122.0, 364.9, 367.0, 367.0, 0.11747947780372117, 0.042462980197365524, 0.06638336215251774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 138.875, 116, 364, 123.5, 203.70000000000016, 364.0, 364.0, 0.11747861522082309, 0.08730588494438123, 0.05896875803076471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 223.8125, 119, 732, 127.5, 489.10000000000025, 732.0, 732.0, 0.11747947780372117, 2.1886145636004524, 0.06854881639426114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 265.75, 117, 1451, 122.5, 690.8000000000008, 1451.0, 1451.0, 0.11747947780372117, 6.636450405763103, 0.06843409034171843], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 270.1333333333333, 120, 399, 277.0, 385.2, 399.0, 399.0, 0.07692662738280229, 0.1396999573057218, 0.04972184613648835], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 138.83333333333334, 118, 377, 123.5, 160.10000000000034, 377.0, 377.0, 0.08976078750130902, 0.06670699149267204, 0.045055707788743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 163.11111111111111, 118, 368, 122.5, 365.3, 368.0, 368.0, 0.08976436853260193, 0.03150908552549557, 0.05077491896272285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 989.0, 929, 1133, 963.0, 1133.0, 1133.0, 1133.0, 0.06467301324503312, 19.016013240182637, 0.03688382786630795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1225.8, 884, 1457, 1322.0, 1457.0, 1457.0, 1457.0, 0.06426487410511163, 57.82564668537846, 0.036588302346953205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 125.2, 122, 129, 124.0, 129.0, 129.0, 129.0, 0.06538169835499648, 0.11569495841723984, 0.0362025614914873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c18ea0f-02a6-4c8f-967d-8d1058a9349d", 3, 0, 0.0, 357.6666666666667, 226, 571, 276.0, 571.0, 571.0, 571.0, 0.08912920764134406, 0.040328645384592535, 0.05715642547312755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 147.16666666666669, 123, 379, 124.5, 306.10000000000025, 379.0, 379.0, 0.11520516119122136, 0.0856163356118354, 0.05782759067606229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 186.58333333333337, 116, 414, 123.5, 399.6, 414.0, 414.0, 0.1149436297282541, 0.07391638689067903, 0.06314042160365521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 454.0833333333333, 121, 1366, 128.0, 1355.5, 1366.0, 1366.0, 0.11492711705326872, 25.87613782335223, 0.06509543739345298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 363.75, 121, 1092, 125.5, 1052.1000000000001, 1092.0, 1092.0, 0.11520847934407973, 8.492068766261196, 0.0653673110340921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e998e711-ab99-44a9-9273-e6930652378a", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 126.0, 122, 135, 123.0, 135.0, 135.0, 135.0, 0.06538597340098602, 0.04859250562319371, 0.03671575654840524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 851.2352941176471, 115, 1522, 1084.0, 1498.8, 1522.0, 1522.0, 0.0796230550897867, 42.15293386075801, 0.04278458509362734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 214.05555555555554, 116, 845, 122.5, 412.1000000000007, 845.0, 845.0, 0.0897648161816042, 4.510102476823223, 0.05234332922742415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 631.4117647058822, 117, 1086, 758.0, 1026.0, 1086.0, 1086.0, 0.0796230550897867, 13.780496801026668, 0.042862341983363465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 199.49999999999997, 118, 763, 123.5, 419.20000000000056, 763.0, 763.0, 0.0897648161816042, 1.4891745345943628, 0.05243099018072649], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 415.92857142857144, 124, 786, 452.5, 691.5, 786.0, 786.0, 0.07655711707770547, 0.015080726745775687, 0.052002874309618856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d0ed9212-bebc-4042-a10f-04759c43a757", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.9229362355491331, 1.7245077673410405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 621.0833333333333, 246, 1745, 372.5, 1657.7000000000003, 1745.0, 1745.0, 0.11478640163761933, 34.464533019623694, 0.2508150133439192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e20f540a-41af-42aa-9665-973e74818369", 3, 0, 0.0, 611.3333333333334, 375, 979, 480.0, 979.0, 979.0, 979.0, 0.07588212975844189, 0.03433468761856583, 0.04866139180472999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcdcc483-ac3a-4b0f-ab3d-a45c062ddaf5", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c18ea0f-02a6-4c8f-967d-8d1058a9349d", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 604.9130434782609, 139, 1366, 610.0, 1216.4000000000003, 1357.1999999999998, 1366.0, 0.10009879315672425, 0.061486465718339406, 0.04525951292144856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 152.3529411764706, 117, 370, 124.0, 366.0, 370.0, 370.0, 0.07962268216030388, 0.059172715941397704, 0.03996685413124628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 237.99999999999997, 120, 384, 125.0, 372.8, 384.0, 384.0, 0.07962380095923262, 0.09165336188080786, 0.04147682830298262], "isController": false}, {"data": ["login", 23, 0, 0.0, 2666.695652173913, 1563, 3870, 2739.0, 3676.0000000000005, 3851.9999999999995, 3870.0, 0.09877476347738702, 25.825385778527654, 0.18463650484425795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1456b4f8-d8a5-4d60-8f9d-ddff4ce96717", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 131.61111111111114, 122, 174, 127.0, 150.60000000000002, 174.0, 174.0, 0.09187564121541264, 0.0743797915698995, 0.032658919338291216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9a89550-3ce3-42d9-98b6-5b06c61a2eca", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bb63f1d-d5f2-4fa9-8164-d5e85b92660a", 3, 0, 0.0, 368.6666666666667, 278, 475, 353.0, 475.0, 475.0, 475.0, 0.02714637324453453, 0.02722590363489938, 0.01740831877986101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1032.5882352941176, 244, 1652, 1206.0, 1624.8, 1652.0, 1652.0, 0.07957646596233692, 56.05144007804345, 0.1669926400545801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26cad5c3-75a4-4d57-acaa-e04cc9227c54", 3, 0, 0.0, 340.6666666666667, 235, 484, 303.0, 484.0, 484.0, 484.0, 0.03411261711998544, 0.03421255642795415, 0.021875604077594833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 454.3125, 245, 1577, 369.0, 984.1000000000006, 1577.0, 1577.0, 0.11737261403483032, 8.94668881998342, 0.26209682965565806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=133419fd-7bba-474c-9e46-26c55902a4c8", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 833.0, 120, 1585, 1246.0, 1585.0, 1585.0, 1585.0, 0.07559531309058838, 50.25247653395489, 0.11696110778631724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b86a25a1-e1bf-4ef5-a36d-01feeec65a22", 3, 0, 0.0, 474.66666666666663, 244, 804, 376.0, 804.0, 804.0, 804.0, 0.030011404333646786, 0.025019272948720514, 0.019245594575938857], "isController": false}, {"data": ["register", 24, 6, 25.0, 1090.8750000000002, 184, 1794, 1053.5, 1691.5, 1786.25, 1794.0, 0.0959919366773191, 0.030278706588646554, 0.04330886205558733], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 144.5625, 118, 348, 131.0, 210.80000000000013, 348.0, 348.0, 0.08165181624258754, 0.06339179093052451, 0.02902466905498229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 383.5555555555555, 243, 970, 257.0, 778.3000000000003, 970.0, 970.0, 0.08970576509050315, 6.093485048727673, 0.20047525366796906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26cad5c3-75a4-4d57-acaa-e04cc9227c54", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 373.5, 239, 728, 258.5, 727.1, 728.0, 728.0, 0.09657325886462038, 0.1496696892755396, 0.2171955226222859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 122.625, 116, 129, 122.5, 129.0, 129.0, 129.0, 0.039953853299439145, 0.029692267930540226, 0.020054961519445042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 153.0, 121, 365, 122.5, 365.0, 365.0, 365.0, 0.039955449673613926, 0.010691204307197473, 0.022787092391982938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 119.75, 115, 123, 120.0, 123.0, 123.0, 123.0, 0.03995584878709027, 0.010769349868395423, 0.023489668915847986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 123.0, 116, 128, 122.0, 128.0, 128.0, 128.0, 0.03995525011986575, 0.010769188508870067, 0.023528335763944384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 125.0, 124, 126, 125.0, 126.0, 126.0, 126.0, 0.03704458315582804, 0.010925257922910223, 0.022899630017225732], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1423.821428571429, 935, 2296, 1380.5, 1844.6, 2009.7499999999998, 2296.0, 0.24405125076266015, 291.9701418547895, 0.4819058877364246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1090.8750000000002, 184, 1794, 1053.5, 1691.5, 1786.25, 1794.0, 0.09603111408096224, 0.030291064304834765, 0.04332653779824663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 163.33333333333334, 117, 367, 123.0, 366.4, 367.0, 367.0, 0.06720580658168866, 0.01811406505522077, 0.039575294305427985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 202.08333333333334, 117, 365, 124.5, 365.0, 365.0, 365.0, 0.06720618296883314, 0.018114166503318305, 0.039509884909411666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 228.31250000000003, 117, 1074, 123.0, 588.2000000000005, 1074.0, 1074.0, 0.0817653131100459, 4.6189466918904145, 0.04762989186537341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 205.62500000000003, 119, 965, 123.5, 543.6000000000004, 965.0, 965.0, 0.08176614881439084, 1.5232837892221995, 0.04771022843417825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 125.37500000000001, 118, 133, 124.5, 132.3, 133.0, 133.0, 0.08186236889229981, 0.060837170631875166, 0.04109107188539268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 162.75, 116, 365, 122.0, 364.4, 365.0, 365.0, 0.06729512839349705, 0.018006704277166205, 0.03837925291191629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 124.4375, 119, 131, 123.0, 128.9, 131.0, 131.0, 0.08186655751125665, 0.02959068320200573, 0.04625980160151453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 185.08333333333337, 116, 382, 123.5, 378.40000000000003, 382.0, 382.0, 0.0672992798977051, 0.05001440625210311, 0.033781083854902756], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 494.49999999999994, 121, 955, 484.5, 879.5, 955.0, 955.0, 0.07752324312950258, 0.014968215470316903, 0.05275647042211406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 169.16666666666669, 123, 386, 128.5, 380.90000000000003, 386.0, 386.0, 0.06670780314527291, 0.0525063372412988, 0.023712539399296233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1398.9565217391305, 813, 2168, 1322.0, 2033.4, 2149.7999999999997, 2168.0, 0.10078878177037687, 0.05216606868974584, 0.04635890255258546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 390.5, 239, 747, 252.5, 743.4, 747.0, 747.0, 0.06716179836908767, 0.10408766993334191, 0.15104845863672742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96dc9c12-a2c2-4f41-9bf5-3812c81e016b", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1456b4f8-d8a5-4d60-8f9d-ddff4ce96717", 3, 0, 0.0, 496.33333333333337, 214, 955, 320.0, 955.0, 955.0, 955.0, 0.02589086138895841, 0.030602121648212237, 0.016603189106851584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06ede95f-961b-4220-861e-49b78abb5f5e", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 1193.0819672131147, 628, 2998, 1016.0, 2088.4, 2309.1, 2998.0, 0.27932577169468314, 88.75100150166222, 1.0144519605463795], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 225.49999999999991, 117, 564, 128.5, 489.90000000000003, 497.0, 564.0, 0.24496187780776618, 0.1820468642692481, 0.11841418897934008], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 826.9464285714288, 572, 2167, 733.5, 1066.7, 1146.1499999999999, 2167.0, 0.24475952376789803, 71.96742676882464, 0.12309683080123779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e20f540a-41af-42aa-9665-973e74818369", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 202.375, 117, 774, 127.0, 380.0, 495.15, 774.0, 0.24539984837795084, 0.43424270045004576, 0.11934484813693311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05ba0755-7b95-4dc7-a7f8-a6882564b7f5", 3, 0, 0.0, 596.3333333333334, 399, 905, 485.0, 905.0, 905.0, 905.0, 0.04926108374384237, 0.03199084051724138, 0.031589952791461415], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1165.6607142857142, 803, 1616, 1201.5, 1486.9, 1557.6499999999999, 1616.0, 0.24462160096101343, 220.11094654362782, 0.12278857704488369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 127.16666666666667, 119, 134, 128.0, 131.3, 134.0, 134.0, 0.09666194097177472, 0.07221326644864029, 0.034360299329810544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 182.94943820224717, 118, 1122, 131.0, 303.1, 381.54999999999984, 926.8700000000019, 0.7374845148967728, 1.585341660158435, 0.3549896796189111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 132.125, 125, 139, 133.5, 139.0, 139.0, 139.0, 0.0418047093005027, 0.03237415476103383, 0.01486026775916307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 142.56249999999997, 120, 352, 127.0, 203.60000000000014, 352.0, 352.0, 0.11287876115559631, 0.09160376027373099, 0.04012487212952838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9a89550-3ce3-42d9-98b6-5b06c61a2eca", 3, 0, 0.0, 614.6666666666666, 220, 1146, 478.0, 1146.0, 1146.0, 1146.0, 0.022989915090580265, 0.027173301332648746, 0.01474288174754008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 277.75, 241, 488, 248.0, 488.0, 488.0, 488.0, 0.03992952438945262, 0.061882964068419234, 0.0898024362001068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 357.1875, 246, 1192, 255.5, 709.0000000000005, 1192.0, 1192.0, 0.08170977708551438, 6.2283008276306715, 0.18246056545719175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96dc9c12-a2c2-4f41-9bf5-3812c81e016b", 3, 0, 0.0, 696.6666666666666, 373, 1262, 455.0, 1262.0, 1262.0, 1262.0, 0.02085085384246485, 0.02464500335351233, 0.013371153017466065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcdcc483-ac3a-4b0f-ab3d-a45c062ddaf5", 3, 0, 0.0, 336.6666666666667, 235, 504, 271.0, 504.0, 504.0, 504.0, 0.028172188415596124, 0.023485994313913305, 0.018066149472241003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 128.0, 123, 135, 128.0, 134.4, 135.0, 135.0, 0.12408359097912294, 0.10287789916140173, 0.044107838980860105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc66573a-dd08-4b4c-a586-8c1075601b94", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 131.8235294117647, 123, 165, 129.0, 149.0, 165.0, 165.0, 0.07622839821715229, 0.05918122713148053, 0.02709681342875335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f629980f-3ac3-4355-8fe5-e4a9d755f68c", 2, 0, 0.0, 248.0, 219, 277, 248.0, 277.0, 277.0, 277.0, 0.08776934216878045, 0.053955860249264936, 0.05455584598674683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ecf0554-080a-480b-a961-3b24415fb243", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b86a25a1-e1bf-4ef5-a36d-01feeec65a22", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/133419fd-7bba-474c-9e46-26c55902a4c8", 3, 0, 0.0, 340.6666666666667, 251, 486, 285.0, 486.0, 486.0, 486.0, 0.026315327801266646, 0.031103826577603903, 0.016875389247557063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 152.9444444444444, 116, 363, 124.0, 362.1, 363.0, 363.0, 0.09663651249563793, 0.07181678321209031, 0.048506999436287015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 191.05555555555557, 114, 386, 123.5, 380.6, 386.0, 386.0, 0.09663806895663098, 0.025858233295036025, 0.055113898701828604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 149.38888888888889, 117, 364, 122.5, 348.70000000000005, 364.0, 364.0, 0.09663806895663098, 0.026046979523466945, 0.05681261475770689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 202.99999999999997, 117, 365, 127.5, 364.1, 365.0, 365.0, 0.09663806895663098, 0.026046979523466945, 0.056906987871922346], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 23.076923076923077, 0.4507888805409467], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.15026296018031554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.15026296018031554], "isController": false}, {"data": ["401/Unauthorized", 16, 61.53846153846154, 1.2021036814425243], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 26, "401/Unauthorized", 16, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
