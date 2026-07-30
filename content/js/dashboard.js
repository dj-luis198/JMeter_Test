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

    var data = {"OkPercent": 98.28869047619048, "KoPercent": 1.7113095238095237};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7703656189865298, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2d6fea8-fba5-41fd-a10d-a9c9d9447c15"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5af8dab-25ee-4ead-8042-af20d29985c0"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a275812-89a5-4df6-8901-eda331527a36"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d47b2f3-240e-49bf-94a5-93b933c1d5a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79152bf8-19ae-4295-9d1a-a69c70e91a56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a834a16-2592-4441-b543-08c7e60f7f70"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/776b9b67-9855-4fef-8eca-03c0defb84b8"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcf383e1-b78a-44ee-92a0-22855e84b905"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a275812-89a5-4df6-8901-eda331527a36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aed3424c-53b7-4271-8f6e-ac90bd560b7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7405c56d-3fc4-443a-8224-09a801af253e"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=007748d7-11f6-4230-b8ca-8764ed9e309f"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/007748d7-11f6-4230-b8ca-8764ed9e309f"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79152bf8-19ae-4295-9d1a-a69c70e91a56"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c2d6fea8-fba5-41fd-a10d-a9c9d9447c15"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d47b2f3-240e-49bf-94a5-93b933c1d5a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcf383e1-b78a-44ee-92a0-22855e84b905"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a834a16-2592-4441-b543-08c7e60f7f70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7a0b927-7c5f-489a-81f5-07ac266359c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d6734c7-9d9f-4285-8d58-b804008c7367"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "addBook"], "isController": true}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01e957fc-a41e-4a81-ad71-fbd7074650e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9478021978021978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7405c56d-3fc4-443a-8224-09a801af253e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7a0b927-7c5f-489a-81f5-07ac266359c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5af8dab-25ee-4ead-8042-af20d29985c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7df442b-7b2f-4e41-91ef-f16b37a743e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=776b9b67-9855-4fef-8eca-03c0defb84b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 23, 1.7113095238095237, 392.8080357142853, 104, 2485, 126.0, 1133.0, 1342.0, 1767.2499999999993, 5.268625414061428, 735.0455069434917, 3.8588641609008407], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1914.0000000000002, 1379, 2730, 1903.5, 2320.6, 2447.1499999999996, 2730.0, 0.2542842352855703, 305.99012580400364, 1.250313598303561], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2d6fea8-fba5-41fd-a10d-a9c9d9447c15", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 667.5384615384615, 118, 1339, 623.0, 1203.0, 1339.0, 1339.0, 0.07984522310597918, 0.015828691689954856, 0.05368199720541719], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 667.5384615384615, 118, 1339, 623.0, 1203.0, 1339.0, 1339.0, 0.07996506141931833, 0.01585244869933752, 0.0537625675858548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 26, 0, 0.0, 144.65384615384616, 105, 495, 113.0, 330.7, 442.14999999999975, 495.0, 0.11847909299697423, 0.03854664601636834, 0.0671874003180708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 26, 0, 0.0, 131.8846153846154, 109, 333, 116.0, 187.30000000000013, 331.25, 333.0, 0.11847693345241785, 0.08804779917704099, 0.059469866986858175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5af8dab-25ee-4ead-8042-af20d29985c0", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 26, 0, 0.0, 180.8461538461539, 108, 1023, 115.0, 331.3, 783.599999999999, 1023.0, 0.11847801321485532, 1.3705695346320348, 0.06937621041239463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 26, 0, 0.0, 197.23076923076928, 104, 964, 116.0, 343.9, 747.6999999999991, 964.0, 0.11847801321485532, 4.130963951070859, 0.0692605092276145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a275812-89a5-4df6-8901-eda331527a36", 3, 0, 0.0, 325.3333333333333, 247, 463, 266.0, 463.0, 463.0, 463.0, 0.029906392989941483, 0.0299940093756542, 0.019178253317117422], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 260.7692307692308, 110, 426, 247.0, 398.79999999999995, 426.0, 426.0, 0.08000049231072191, 0.1695443125803851, 0.05170704896645518], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 145.10526315789477, 110, 464, 115.0, 349.0, 464.0, 464.0, 0.09398077845762703, 0.06984313711548258, 0.04717394543673857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d47b2f3-240e-49bf-94a5-93b933c1d5a8", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 125.15789473684211, 109, 345, 112.0, 129.0, 345.0, 345.0, 0.09398449750446426, 0.025148195621311726, 0.05360053373301477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 845.8571428571428, 564, 911, 898.0, 911.0, 911.0, 911.0, 0.054405272648137784, 15.996956583620905, 0.031028007057141083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1128.142857142857, 871, 1298, 1232.0, 1298.0, 1298.0, 1298.0, 0.05423581733376722, 48.8014837733214, 0.03087839990779911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 145.57142857142858, 108, 340, 114.0, 340.0, 340.0, 340.0, 0.05459324135672004, 0.0966044466195085, 0.030228874852793224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 133.41666666666669, 107, 342, 115.5, 275.4000000000002, 342.0, 342.0, 0.05171031879411536, 0.03842925058820487, 0.02595615611345244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 114.25, 108, 122, 114.5, 120.2, 122.0, 122.0, 0.0517076449753096, 0.013835834690659013, 0.029489516274981253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 133.25000000000003, 109, 343, 115.0, 275.5000000000002, 343.0, 343.0, 0.05170853621752058, 0.013937066402378594, 0.030398963674753306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79152bf8-19ae-4295-9d1a-a69c70e91a56", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 132.49999999999997, 106, 343, 114.0, 275.2000000000003, 343.0, 343.0, 0.05170965031348975, 0.013937366686057785, 0.030450116346713206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 147.0, 110, 339, 117.0, 339.0, 339.0, 339.0, 0.05459324135672004, 0.040571735031703075, 0.0306553845508926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 908.0000000000001, 113, 1448, 1237.0, 1440.2, 1448.0, 1448.0, 0.091089060811057, 54.64958180632644, 0.0483317607819085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 173.26315789473688, 110, 345, 114.0, 342.0, 345.0, 345.0, 0.0938776921898701, 0.02530297172305093, 0.055189815135060355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 607.3333333333331, 112, 976, 822.0, 961.6, 976.0, 976.0, 0.09109072028468887, 17.863981438747565, 0.048421597078416964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 135.94736842105263, 104, 342, 114.0, 323.0, 342.0, 342.0, 0.09398170819174247, 0.025331007286055588, 0.0553427441793171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a834a16-2592-4441-b543-08c7e60f7f70", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 522.7692307692306, 115, 1065, 473.0, 1001.4, 1065.0, 1065.0, 0.08001969715622308, 0.01586327980733719, 0.0542922103902499], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 269.41666666666663, 223, 686, 232.0, 552.2000000000005, 686.0, 686.0, 0.05168292525356935, 0.0800984398216939, 0.1162361102138381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/776b9b67-9855-4fef-8eca-03c0defb84b8", 3, 0, 0.0, 327.6666666666667, 220, 405, 358.0, 405.0, 405.0, 405.0, 0.02452503188254145, 0.028987757410647134, 0.01572731536738498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 648.0, 121, 1463, 640.0, 1084.2, 1406.8999999999992, 1463.0, 0.10101056478679885, 0.06204652856532858, 0.04567176903934361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 116.13333333333333, 109, 129, 115.0, 123.60000000000001, 129.0, 129.0, 0.0910851889410436, 0.06769123904700602, 0.04572049523017227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 158.46666666666667, 109, 340, 116.0, 334.6, 340.0, 340.0, 0.09108740139788798, 0.11557900086229407, 0.04684833795854916], "isController": false}, {"data": ["login", 22, 0, 0.0, 2940.3181818181815, 1676, 5043, 2980.0, 3950.5999999999995, 4904.249999999998, 5043.0, 0.09767792922790036, 37.31351961744661, 0.1989112518314612], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 119.73684210526316, 113, 142, 117.0, 137.0, 142.0, 142.0, 0.09338077732124953, 0.0755983050774569, 0.033193948188412925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcf383e1-b78a-44ee-92a0-22855e84b905", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a275812-89a5-4df6-8901-eda331527a36", 1, 0, 0.0, 906.0, 906, 906, 906.0, 906.0, 906.0, 906.0, 1.1037527593818985, 0.19940845750551875, 0.7609857891832229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aed3424c-53b7-4271-8f6e-ac90bd560b7e", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7405c56d-3fc4-443a-8224-09a801af253e", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1025.9333333333334, 231, 1566, 1358.0, 1557.6, 1566.0, 1566.0, 0.09102052209371472, 72.64181352891116, 0.1891816515522033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=007748d7-11f6-4230-b8ca-8764ed9e309f", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 26, 0, 0.0, 374.3076923076923, 227, 1133, 242.0, 670.1, 972.6999999999994, 1133.0, 0.11841649815088084, 5.625206196997231, 0.2651561731431382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 853.0000000000001, 110, 1637, 1080.0, 1586.0000000000002, 1637.0, 1637.0, 0.08514854550802718, 64.83290686490795, 0.1426978953795303], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1032.5909090909095, 140, 1875, 1134.0, 1641.3, 1848.8999999999996, 1875.0, 0.09717829566938177, 0.030419981403607965, 0.04384411386645935], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/007748d7-11f6-4230-b8ca-8764ed9e309f", 3, 0, 0.0, 591.3333333333334, 356, 914, 504.0, 914.0, 914.0, 914.0, 0.021870671429612888, 0.02585039321644675, 0.014025137602974412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 331.5263157894737, 226, 807, 233.0, 694.0, 807.0, 807.0, 0.09382299058313458, 0.14540731060101034, 0.21101010479781146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.78571428571429, 117, 130, 119.5, 128.5, 130.0, 130.0, 0.1232264197443932, 0.09566894892264902, 0.04380314139351477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79152bf8-19ae-4295-9d1a-a69c70e91a56", 3, 0, 0.0, 329.3333333333333, 220, 458, 310.0, 458.0, 458.0, 458.0, 0.025904051393637967, 0.025979942169205263, 0.016611647540842055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2d6fea8-fba5-41fd-a10d-a9c9d9447c15", 3, 0, 0.0, 574.0, 295, 850, 577.0, 850.0, 850.0, 850.0, 0.01985282439515062, 0.023465366334242153, 0.012731140644025625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 445.36842105263156, 229, 1580, 452.0, 687.0, 1580.0, 1580.0, 0.12620056590990608, 8.131594913619034, 0.2821285780351236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d47b2f3-240e-49bf-94a5-93b933c1d5a8", 3, 0, 0.0, 440.3333333333333, 223, 608, 490.0, 608.0, 608.0, 608.0, 0.024840606110789105, 0.024913381324004308, 0.01592968555932765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 114.28571428571428, 109, 118, 114.0, 118.0, 118.0, 118.0, 0.0431074298734489, 0.03203589270868615, 0.02163790913569603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 113.0, 108, 115, 113.0, 115.0, 115.0, 115.0, 0.04310822628123807, 0.011534818360409404, 0.024585160301018583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 142.2857142857143, 105, 325, 113.0, 325.0, 325.0, 325.0, 0.04305201913969765, 0.011603864533746634, 0.025309878439548815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 114.14285714285714, 112, 116, 114.0, 116.0, 116.0, 116.0, 0.04310769533944231, 0.011618871009459061, 0.02538470731414425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 119.5, 115, 124, 119.5, 124.0, 124.0, 124.0, 0.024861706756168812, 0.007332261172229474, 0.01536861364907701], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1315.9464285714284, 867, 2232, 1249.5, 1782.1000000000004, 1958.7499999999998, 2232.0, 0.24229522808201692, 289.86932823648016, 0.4784384288885139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1032.5909090909095, 140, 1875, 1134.0, 1641.3, 1848.8999999999996, 1875.0, 0.09851466749060751, 0.030838309443526467, 0.04444704724673894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 163.57142857142858, 107, 455, 114.0, 455.0, 455.0, 455.0, 0.035613079157699803, 0.009598837741723775, 0.020971373761809554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 182.14285714285714, 113, 341, 121.0, 341.0, 341.0, 341.0, 0.035572178491028186, 0.009587813733909942, 0.02091255024570212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 350.2857142857143, 108, 1237, 114.0, 1234.5, 1237.0, 1237.0, 0.1237295625276182, 23.88307659909412, 0.07046094785682722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 279.00000000000006, 109, 906, 115.0, 904.0, 906.0, 906.0, 0.12373393668357698, 7.822322071703816, 0.07058427275378715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcf383e1-b78a-44ee-92a0-22855e84b905", 3, 0, 0.0, 658.6666666666666, 329, 1158, 489.0, 1158.0, 1158.0, 1158.0, 0.023298618391929357, 0.02336687606299946, 0.014940845778678657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 178.57142857142858, 112, 340, 116.0, 340.0, 340.0, 340.0, 0.035572178491028186, 0.009518336822794652, 0.020287258045664516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 147.71428571428572, 111, 342, 116.5, 338.5, 342.0, 342.0, 0.12372846903695062, 0.09195055169640569, 0.06210589168456311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 164.14285714285714, 106, 462, 116.0, 462.0, 462.0, 462.0, 0.03561271679241347, 0.026466091288111965, 0.01787591448369192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 128.57142857142858, 108, 325, 114.0, 224.5, 325.0, 325.0, 0.12373393668357698, 0.07293190324889966, 0.06834021419228253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 213.2857142857143, 116, 351, 117.0, 351.0, 351.0, 351.0, 0.0355931600115932, 0.028015709931000117, 0.012652256097871021], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 506.23076923076917, 112, 914, 490.0, 888.4, 914.0, 914.0, 0.07836093044563258, 0.015204798928866359, 0.05332569628207524], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1558.9090909090908, 1051, 2485, 1388.5, 2246.3, 2450.4999999999995, 2485.0, 0.1003434482569887, 0.051935573804886725, 0.04615406653226726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 396.14285714285717, 228, 918, 246.0, 918.0, 918.0, 918.0, 0.03555104113763332, 0.05509717020060945, 0.07995512474606399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a834a16-2592-4441-b543-08c7e60f7f70", 3, 0, 0.0, 484.6666666666667, 232, 698, 524.0, 698.0, 698.0, 698.0, 0.021691032926987982, 0.02563806658785591, 0.013909939735080184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7a0b927-7c5f-489a-81f5-07ac266359c7", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d6734c7-9d9f-4285-8d58-b804008c7367", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["addBook", 63, 8, 12.698412698412698, 1127.1587301587304, 570, 2140, 927.0, 2039.8, 2083.0, 2140.0, 0.2858984016917924, 82.57888069499406, 1.0407203491023698], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 220.94642857142853, 109, 781, 118.0, 465.90000000000003, 502.39999999999975, 781.0, 0.2433650432190242, 0.1808601541891381, 0.11764228163419627], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 714.9642857142858, 537, 1128, 674.5, 977.9, 1023.6999999999998, 1128.0, 0.24352802529212492, 71.6053253273495, 0.12247747365766047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01e957fc-a41e-4a81-ad71-fbd7074650e0", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 173.5535714285715, 105, 361, 117.5, 343.3, 348.15, 361.0, 0.24411933948281575, 0.4319767999442013, 0.11872210064691625], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1093.1071428571424, 749, 1582, 1122.0, 1311.7000000000003, 1425.3, 1582.0, 0.24315370353484697, 218.7901298592748, 0.12205176134463999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 129.94736842105257, 117, 170, 121.0, 152.0, 170.0, 170.0, 0.11811953697141507, 0.08824359939759036, 0.0419878041578077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 8, 4.395604395604396, 184.13186813186817, 106, 1140, 121.0, 346.70000000000005, 400.09999999999997, 717.5299999999936, 0.7322588172813081, 1.5609377891818819, 0.35409064116903916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 118.85714285714286, 118, 121, 118.0, 121.0, 121.0, 121.0, 0.04114524860546996, 0.031863459125134455, 0.014625850090225653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 26, 0, 0.0, 162.88461538461536, 110, 481, 120.5, 358.0, 447.7499999999999, 481.0, 0.11172800247520498, 0.09066989263368685, 0.03971581337985802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7405c56d-3fc4-443a-8224-09a801af253e", 3, 0, 0.0, 443.0, 228, 594, 507.0, 594.0, 594.0, 594.0, 0.037673770265348926, 0.030622201937687585, 0.024159286270422322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7a0b927-7c5f-489a-81f5-07ac266359c7", 3, 0, 0.0, 358.3333333333333, 252, 500, 323.0, 500.0, 500.0, 500.0, 0.03339753080922217, 0.027842147266412105, 0.021417036358778542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 260.0, 225, 439, 231.0, 439.0, 439.0, 439.0, 0.04302132628603036, 0.06667465314055682, 0.0967559711296171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 500.3571428571429, 224, 1574, 233.0, 1548.0, 1574.0, 1574.0, 0.12360393766830001, 31.83764464143822, 0.2712113185891493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5af8dab-25ee-4ead-8042-af20d29985c0", 3, 0, 0.0, 711.3333333333334, 426, 1215, 493.0, 1215.0, 1215.0, 1215.0, 0.10084711577248891, 0.045630693660077985, 0.06467083921608176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7df442b-7b2f-4e41-91ef-f16b37a743e5", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 121.91666666666666, 116, 142, 119.0, 139.60000000000002, 142.0, 142.0, 0.0527347354913559, 0.04372245159390738, 0.018745550506692917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 121.26666666666667, 115, 136, 119.0, 134.2, 136.0, 136.0, 0.09087109027134108, 0.07054933277901969, 0.03230183286989077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=776b9b67-9855-4fef-8eca-03c0defb84b8", 1, 0, 0.0, 1065.0, 1065, 1065, 1065.0, 1065.0, 1065.0, 1065.0, 0.9389671361502347, 0.16963761737089203, 0.6473738262910799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 151.26315789473682, 107, 342, 117.0, 340.0, 342.0, 342.0, 0.1262961978197288, 0.0938587954500133, 0.06339477117123106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 195.8421052631579, 108, 344, 116.0, 344.0, 344.0, 344.0, 0.12630039551965966, 0.04377929005882939, 0.07147241748928108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 268.00000000000006, 107, 1240, 117.0, 344.0, 1240.0, 1240.0, 0.12630459349863724, 6.013782625224357, 0.07368200741208535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 214.2105263157895, 109, 670, 116.0, 344.0, 670.0, 670.0, 0.12630375388051665, 1.9868562040071527, 0.07380486111572747], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.5208333333333334], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1488095238095238], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.1488095238095238], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.8928571428571429], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 23, "401/Unauthorized", 12, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
