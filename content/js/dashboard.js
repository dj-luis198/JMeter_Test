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

    var data = {"OkPercent": 99.60598896769109, "KoPercent": 0.39401103230890466};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.808641975308642, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f32c14c9-b614-4358-bd60-c18d6330fe37"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e30c038e-0a9f-4d76-84f5-5acb3296db47"], "isController": false}, {"data": [0.16071428571428573, 500, 1500, "see books"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58483945-16c9-4d9f-8d79-dadad845e98c"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30e42fba-f16b-4163-b286-acb4d0dca5a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7778da1-b32e-4d6f-9545-a42d74a9dc25"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bd1d311-a5f8-4938-afb4-a00cfae20ac0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ceac95c1-5693-42a9-9a20-f2d276794754"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ec6d2e8-78d4-4822-8820-2ffc40e69ce7"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bd1d311-a5f8-4938-afb4-a00cfae20ac0"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58483945-16c9-4d9f-8d79-dadad845e98c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e30c038e-0a9f-4d76-84f5-5acb3296db47"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e716a21-bbc3-4406-8f85-1c5b1d22ada6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6e90901-5bd4-488a-ab44-ebed4cb99fe4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "login"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a55147af-aa5d-4c61-9cb1-3ea9f9cb3cc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd9a2be3-1969-4528-962e-1723e736e5e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3740e89-db0e-4c78-99e4-23ad54329755"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd9a2be3-1969-4528-962e-1723e736e5e9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3740e89-db0e-4c78-99e4-23ad54329755"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2fe0ea4-5d6c-4d3f-8354-166ce98a674f"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a55147af-aa5d-4c61-9cb1-3ea9f9cb3cc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ec6d2e8-78d4-4822-8820-2ffc40e69ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a256cba-ade6-4b00-8ff9-04262c1b6da1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9c8a94a-01b3-4d37-aed0-22adbe006d71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2fe0ea4-5d6c-4d3f-8354-166ce98a674f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30e42fba-f16b-4163-b286-acb4d0dca5a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "register"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1269, 5, 0.39401103230890466, 349.37667454688705, 98, 2572, 112.0, 996.0, 1206.5, 1614.7999999999997, 4.906926925843148, 687.8531143422243, 3.5917164734411133], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f32c14c9-b614-4358-bd60-c18d6330fe37", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e30c038e-0a9f-4d76-84f5-5acb3296db47", 3, 0, 0.0, 528.3333333333334, 197, 914, 474.0, 914.0, 914.0, 914.0, 0.03704206744125745, 0.03088044749904308, 0.02375419038387929], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1674.5535714285716, 1228, 2252, 1640.0, 2057.2000000000003, 2143.5, 2252.0, 0.24510447578280242, 294.94202824364044, 1.2051767925453225], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 315.1666666666667, 204, 618, 213.0, 520.8000000000002, 618.0, 618.0, 0.08418846992133056, 0.13047568531753084, 0.1893418420203362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 129.78947368421052, 102, 316, 106.0, 303.0, 316.0, 316.0, 0.10867202782003912, 0.08436939659856553, 0.038629509889154534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58483945-16c9-4d9f-8d79-dadad845e98c", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 606.9333333333333, 207, 1580, 413.0, 1415.0, 1580.0, 1580.0, 0.0925320469322542, 29.625297500169644, 0.2017933578183411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30e42fba-f16b-4163-b286-acb4d0dca5a0", 3, 0, 0.0, 533.6666666666666, 226, 893, 482.0, 893.0, 893.0, 893.0, 0.024691561247417674, 0.02476389980575972, 0.01583410665931407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 144.6, 100, 331, 103.0, 314.2, 331.0, 331.0, 0.06795294032372781, 0.05050018318980162, 0.03410919074843368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 129.46666666666667, 99, 307, 103.0, 302.2, 307.0, 307.0, 0.06795601886459084, 0.018183544110251845, 0.03875616700871196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 155.60000000000002, 98, 309, 104.0, 307.8, 309.0, 309.0, 0.06795447955929255, 0.01831585581871557, 0.039949801459662225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 150.13333333333335, 100, 407, 104.0, 344.6, 407.0, 407.0, 0.06795447955929255, 0.01831585581871557, 0.040016163256106844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7778da1-b32e-4d6f-9545-a42d74a9dc25", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1161.9821428571431, 805, 1779, 1091.0, 1634.0000000000002, 1721.6, 1779.0, 0.2408239619842174, 288.1091824886576, 0.47553325305867933], "isController": false}, {"data": ["deleteBook", 9, 0, 0.0, 548.7777777777778, 385, 1339, 453.0, 1339.0, 1339.0, 1339.0, 0.06704459955750565, 0.01211254972474467, 0.045569376261742116], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 9, 0, 0.0, 548.7777777777778, 385, 1339, 453.0, 1339.0, 1339.0, 1339.0, 0.06982915134304735, 0.012615618162562264, 0.0474620013034775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 3, 15.789473684210526, 1001.7368421052631, 114, 1771, 956.0, 1577.0, 1771.0, 1771.0, 0.07809160556341038, 0.024885277266300593, 0.03523273610380429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 132.16666666666666, 98, 293, 100.5, 293.0, 293.0, 293.0, 0.03262217002675018, 0.00879269426502251, 0.01921012551379918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 115.73333333333332, 100, 300, 103.0, 187.20000000000007, 300.0, 300.0, 0.08098871017380177, 0.0216708072144743, 0.04618887377099632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 101.83333333333333, 101, 104, 101.0, 104.0, 104.0, 104.0, 0.03262199266005165, 0.008792646459154545, 0.019178163653663177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 103.60000000000002, 101, 110, 103.0, 107.6, 110.0, 110.0, 0.08098696109926301, 0.06018659902005777, 0.040651658208028504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 142.73333333333332, 101, 304, 103.0, 303.4, 304.0, 304.0, 0.0809878356270888, 0.021828752571363783, 0.04769107898743609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 130.4, 100, 304, 102.0, 304.0, 304.0, 304.0, 0.08098608659032377, 0.021828281151298205, 0.04761096106188956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 187.26315789473685, 100, 1106, 103.0, 311.0, 1106.0, 1106.0, 0.10954354932630717, 5.215733453518943, 0.06390415732183319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 138.78947368421055, 100, 795, 102.0, 105.0, 795.0, 795.0, 0.10954418089780105, 1.7232150964853614, 0.06401150249933697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bd1d311-a5f8-4938-afb4-a00cfae20ac0", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 135.5, 101, 302, 102.5, 302.0, 302.0, 302.0, 0.03262199266005165, 0.008728931629740382, 0.018604730188935707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 102.89473684210527, 100, 105, 103.0, 104.0, 105.0, 105.0, 0.10954228620516694, 0.08140789043176956, 0.05498509288032793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ceac95c1-5693-42a9-9a20-f2d276794754", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.7943680037313432, 1.48427782960199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 102.16666666666667, 100, 104, 102.0, 104.0, 104.0, 104.0, 0.0326218152952818, 0.02424336078096626, 0.016374622130639498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 133.10526315789474, 99, 305, 102.0, 304.0, 305.0, 305.0, 0.10954291776209585, 0.03797067420783174, 0.06198949036598865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 106.16666666666667, 104, 110, 105.5, 110.0, 110.0, 110.0, 0.03246015515954167, 0.025549692440029862, 0.011538570779368325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ec6d2e8-78d4-4822-8820-2ffc40e69ce7", 3, 0, 0.0, 366.6666666666667, 332, 411, 357.0, 411.0, 411.0, 411.0, 0.03484563384207959, 0.029049371181499292, 0.022345670139614842], "isController": false}, {"data": ["deleteAccount", 9, 0, 0.0, 452.6666666666667, 357, 647, 428.0, 647.0, 647.0, 647.0, 0.06756350969911717, 0.01220629813900066, 0.04598805298855924], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2bd1d311-a5f8-4938-afb4-a00cfae20ac0", 3, 0, 0.0, 285.3333333333333, 186, 406, 264.0, 406.0, 406.0, 406.0, 0.03518277451359814, 0.02933043148741043, 0.022561870374931098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1310.8333333333337, 766, 2572, 1123.0, 2373.1000000000004, 2572.0, 2572.0, 0.08733327834571364, 0.04520179445627757, 0.040169896582842896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58483945-16c9-4d9f-8d79-dadad845e98c", 3, 0, 0.0, 493.6666666666667, 185, 870, 426.0, 870.0, 870.0, 870.0, 0.02026260333927703, 0.0239497111734749, 0.012993922063273355], "isController": false}, {"data": ["goToProfile", 9, 0, 0.0, 283.4444444444444, 185, 835, 197.0, 835.0, 835.0, 835.0, 0.067884054035707, 0.17158843736564613, 0.04388598024574027], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 238.66666666666666, 203, 405, 206.0, 405.0, 405.0, 405.0, 0.032603734214358686, 0.05052942011541722, 0.07332656239811333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 115.0, 100, 304, 104.0, 131.20000000000027, 304.0, 304.0, 0.08423062344699789, 0.0625971723077787, 0.042279824659918856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 158.94444444444443, 99, 313, 103.0, 305.8, 313.0, 313.0, 0.08423022929340197, 0.022538166822648573, 0.04803755264389331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 714.0, 620, 808, 714.0, 808.0, 808.0, 808.0, 0.1529285823520416, 44.96608091833614, 0.08721708212264873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1159.5, 1107, 1212, 1159.5, 1212.0, 1212.0, 1212.0, 0.14951035359198625, 134.52967897323765, 0.08512161732824998], "isController": false}, {"data": ["addBook", 60, 2, 3.3333333333333335, 1120.1833333333332, 604, 3066, 827.5, 1857.8999999999999, 2234.3499999999995, 3066.0, 0.2938123126946507, 94.82936333473303, 1.069096162933618], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 111.0, 104, 118, 111.0, 118.0, 118.0, 118.0, 0.16162922256343945, 0.2860079602392112, 0.08949586835299822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 125.0, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.05962594656190167, 0.04431186067735075, 0.02992943020782955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 167.88888888888889, 100, 302, 104.0, 302.0, 302.0, 302.0, 0.05970545309804962, 0.025939738954491174, 0.03349361897970014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e30c038e-0a9f-4d76-84f5-5acb3296db47", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 237.33333333333334, 102, 1125, 102.0, 1125.0, 1125.0, 1125.0, 0.05970584918302496, 5.98357430931942, 0.03453040105745693], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 189.10714285714286, 101, 535, 104.5, 412.0, 417.9, 535.0, 0.24183587980756774, 0.17972373489605376, 0.11690308643041604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 167.22222222222223, 100, 492, 102.0, 492.0, 492.0, 492.0, 0.059706641368741584, 1.9649419394375636, 0.03458916647870131], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 671.4642857142857, 489, 929, 605.5, 843.3000000000003, 910.45, 929.0, 0.24178471661535939, 71.09273469308452, 0.12160071196963876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 105.5, 105, 106, 105.5, 106.0, 106.0, 106.0, 0.16162922256343945, 0.12011702965896233, 0.09075859665427509], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 152.49999999999997, 99, 382, 105.0, 304.6, 311.05, 382.0, 0.24220824719081685, 0.42859506241187517, 0.11779268271584648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 138.33333333333331, 100, 314, 104.5, 307.7, 314.0, 314.0, 0.08423141176525642, 0.022702997702354268, 0.04951885730730895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 642.8947368421052, 101, 1326, 900.0, 1234.0, 1326.0, 1326.0, 0.11443232532507815, 54.207455924733644, 0.06209788706734041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e716a21-bbc3-4406-8f85-1c5b1d22ada6", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 971.0892857142858, 691, 1406, 970.5, 1273.8000000000002, 1307.8, 1406.0, 0.24130234321811148, 217.12427259193188, 0.1211224652481536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 119.44444444444444, 98, 406, 102.5, 138.70000000000041, 406.0, 406.0, 0.08423062344699789, 0.022702785225948645, 0.04960065033060519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 445.4736842105264, 99, 916, 585.0, 814.0, 916.0, 916.0, 0.11443025776921224, 17.723186054565165, 0.06220851338532884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 121.46666666666668, 102, 306, 107.0, 202.80000000000007, 306.0, 306.0, 0.09139653911771875, 0.06827964104009261, 0.03248861351450159], "isController": false}, {"data": ["deleteBooks", 9, 0, 0.0, 393.66666666666674, 363, 447, 386.0, 447.0, 447.0, 447.0, 0.06983998882560179, 0.01261757610618782, 0.04815139854577623], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 2, 1.1363636363636365, 187.52272727272722, 100, 2443, 109.0, 282.50000000000006, 315.90000000000003, 2275.9099999999976, 0.7288720291217505, 1.5265449446926935, 0.35229515745292356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 122.73333333333333, 101, 343, 105.0, 209.80000000000007, 343.0, 343.0, 0.06781837335370898, 0.05251950202098753, 0.02410731240307624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 407.22222222222223, 206, 1226, 208.0, 1226.0, 1226.0, 1226.0, 0.0595848919196266, 8.002556150484956, 0.1323138903141448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 106.33333333333334, 103, 118, 106.0, 112.0, 118.0, 118.0, 0.07846542551800259, 0.06367653184126967, 0.02789200672710248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6e90901-5bd4-488a-ab44-ebed4cb99fe4", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 597.2777777777779, 109, 1564, 580.5, 1331.8000000000004, 1564.0, 1564.0, 0.08795461541844408, 0.05402680966621223, 0.0397685419323629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 103.89473684210527, 100, 115, 103.0, 110.0, 115.0, 115.0, 0.11443508218245771, 0.08504404056723663, 0.05744104711111647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 189.5263157894737, 101, 322, 104.0, 314.0, 322.0, 322.0, 0.11443783917267465, 0.12108436252100536, 0.06020691415355149], "isController": false}, {"data": ["login", 18, 0, 0.0, 2475.944444444445, 1387, 3998, 2352.0, 3674.9000000000005, 3998.0, 3998.0, 0.08656426434802682, 11.629320924386116, 0.14655623010224203], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 323.46666666666664, 204, 640, 212.0, 623.8, 640.0, 640.0, 0.06792094002580996, 0.10526419123140664, 0.15275578601507844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a55147af-aa5d-4c61-9cb1-3ea9f9cb3cc6", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 127.27777777777777, 103, 309, 105.0, 299.1, 309.0, 309.0, 0.08340399505136296, 0.06752139833748036, 0.029647513865914178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd9a2be3-1969-4528-962e-1723e736e5e9", 3, 0, 0.0, 404.0, 186, 535, 491.0, 535.0, 535.0, 535.0, 0.0232189156766379, 0.023286939843659298, 0.014889734336906464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3740e89-db0e-4c78-99e4-23ad54329755", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 312.4210526315789, 203, 1209, 208.0, 414.0, 1209.0, 1209.0, 0.10947727482253157, 7.054048012267217, 0.2447427049961971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd9a2be3-1969-4528-962e-1723e736e5e9", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3740e89-db0e-4c78-99e4-23ad54329755", 3, 0, 0.0, 639.3333333333334, 195, 1076, 647.0, 1076.0, 1076.0, 1076.0, 0.02679480538039692, 0.02233772675104053, 0.01718286673156964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 106.11111111111111, 102, 112, 105.0, 112.0, 112.0, 112.0, 0.05895260865293289, 0.048877699947597684, 0.02095581010709724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2fe0ea4-5d6c-4d3f-8354-166ce98a674f", 3, 0, 0.0, 264.6666666666667, 209, 363, 222.0, 363.0, 363.0, 363.0, 0.022549270155289305, 0.026652473936801913, 0.014460306707656228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 748.9473684210527, 203, 1427, 1020.0, 1335.0, 1427.0, 1427.0, 0.11435725205542113, 72.08975722971063, 0.24179246904830692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a55147af-aa5d-4c61-9cb1-3ea9f9cb3cc6", 3, 0, 0.0, 720.0, 428, 897, 835.0, 897.0, 897.0, 897.0, 0.01788535487524965, 0.024656405565326257, 0.011469449578203714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ec6d2e8-78d4-4822-8820-2ffc40e69ce7", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 120.15789473684211, 101, 307, 107.0, 128.0, 307.0, 307.0, 0.11095992010885752, 0.0861456411001384, 0.03944278410119545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a256cba-ade6-4b00-8ff9-04262c1b6da1", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9c8a94a-01b3-4d37-aed0-22adbe006d71", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 275.26666666666665, 204, 408, 211.0, 407.4, 408.0, 408.0, 0.08094020137922103, 0.12544150350471073, 0.18203640993783793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1265.5, 1214, 1317, 1265.5, 1317.0, 1317.0, 1317.0, 0.1483459427384661, 177.47332090936064, 0.3345027165850764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2fe0ea4-5d6c-4d3f-8354-166ce98a674f", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30e42fba-f16b-4163-b286-acb4d0dca5a0", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 143.2, 99, 306, 103.0, 305.4, 306.0, 306.0, 0.09270647276592851, 0.06889611892077305, 0.04653430371258522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 169.06666666666666, 98, 310, 104.0, 308.8, 310.0, 310.0, 0.09271048370149695, 0.061939777587549594, 0.05079761919477854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 455.8666666666667, 102, 1274, 305.0, 1232.6, 1274.0, 1274.0, 0.09259202103690718, 22.235491601903693, 0.052312080635304715], "isController": false}, {"data": ["register", 19, 3, 15.789473684210526, 1001.7368421052631, 114, 1771, 956.0, 1577.0, 1771.0, 1771.0, 0.08038619219069297, 0.025616488054188754, 0.0362679890547853], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 343.7333333333334, 101, 912, 104.0, 849.0, 912.0, 912.0, 0.09270819169581825, 7.287467436247667, 0.052468249375764844], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.2364066193853428], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.15760441292356187], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1269, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
