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

    var data = {"OkPercent": 96.88922610015175, "KoPercent": 3.110773899848255};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7834951456310679, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea67b778-0959-4049-994c-58d278a1e897"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4d2466e-ec2b-4791-8d6e-eeead9cd9fa1"], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1104d930-976e-46d5-991d-dbc3416db07d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59b34b85-a626-44a5-b4ea-1ac928d8c17d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c4fb5e0-2fd4-4885-9021-8bc75ce88330"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5eaff3cf-bda8-450d-a9af-99319169514f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c12a813f-17b8-49f3-ba3a-4c1086435667"], "isController": false}, {"data": [0.625, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=433f792b-6ffe-4f07-922e-422f19198a8f"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bec8a895-bc2a-4bc7-b099-a8bdf7164a63"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fec74e23-619e-45c1-bfb3-83abdde51fd9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a96141c-b7b9-4733-ac86-1c2a63b9b6ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfae444e-7665-4f77-af97-9607dc40ea6b"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4d2466e-ec2b-4791-8d6e-eeead9cd9fa1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3c3bee70-8653-40e4-895d-fb5d043435ab"], "isController": false}, {"data": [0.20588235294117646, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e66e922-6949-4d44-afcc-335eecd647d1"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/433f792b-6ffe-4f07-922e-422f19198a8f"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5eaff3cf-bda8-450d-a9af-99319169514f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59b34b85-a626-44a5-b4ea-1ac928d8c17d"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ea67b778-0959-4049-994c-58d278a1e897"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdab6788-2d14-415b-8b7e-ee28f6e16cd2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfa32726-629e-4fc9-84de-2f26cdbfef56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c4fb5e0-2fd4-4885-9021-8bc75ce88330"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9058823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bec8a895-bc2a-4bc7-b099-a8bdf7164a63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fec74e23-619e-45c1-bfb3-83abdde51fd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a96141c-b7b9-4733-ac86-1c2a63b9b6ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c3bee70-8653-40e4-895d-fb5d043435ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/84d7814d-534f-4a68-8433-f6104e6cdfda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfae444e-7665-4f77-af97-9607dc40ea6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 41, 3.110773899848255, 311.92943854324767, 76, 3171, 92.0, 856.2000000000003, 1048.6499999999994, 1712.2499999999986, 5.199621271895219, 758.5196101516885, 3.78643732370404], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea67b778-0959-4049-994c-58d278a1e897", 1, 0, 0.0, 2763.0, 2763, 2763, 2763.0, 2763.0, 2763.0, 2763.0, 0.3619254433586681, 0.06538692091929063, 0.24953062794064423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4d2466e-ec2b-4791-8d6e-eeead9cd9fa1", 3, 0, 0.0, 482.3333333333333, 171, 859, 417.0, 859.0, 859.0, 859.0, 0.04378219815822886, 0.02814773481852279, 0.02807647473037463], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1351.142857142857, 941, 1820, 1339.0, 1668.4000000000005, 1777.85, 1820.0, 0.2424106002692489, 291.7019153481081, 1.1919310276910824], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1104d930-976e-46d5-991d-dbc3416db07d", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.9834530279503104, 3.7060850155279503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59b34b85-a626-44a5-b4ea-1ac928d8c17d", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c4fb5e0-2fd4-4885-9021-8bc75ce88330", 3, 0, 0.0, 357.6666666666667, 276, 414, 383.0, 414.0, 414.0, 414.0, 0.02039969808446835, 0.024111752521062686, 0.013081837638802945], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 458.5625, 79, 1343, 453.0, 1196.0000000000002, 1343.0, 1343.0, 0.08844127775536037, 0.019136006447921905, 0.05878991430869322], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 458.5625, 79, 1343, 453.0, 1196.0000000000002, 1343.0, 1343.0, 0.0887350814144372, 0.019199576636607655, 0.05898521555692355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 103.53846153846155, 78, 238, 80.0, 234.8, 238.0, 238.0, 0.11851797826562614, 0.031712818403106996, 0.0675922844796149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 99.76923076923077, 80, 243, 81.0, 192.99999999999994, 243.0, 243.0, 0.11851581730330933, 0.08807669625763516, 0.05948938485732519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5eaff3cf-bda8-450d-a9af-99319169514f", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 115.6923076923077, 77, 237, 80.0, 237.0, 237.0, 237.0, 0.11851797826562614, 0.031944298829407046, 0.06979134852946539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 116.23076923076923, 76, 245, 80.0, 242.2, 245.0, 245.0, 0.11851581730330933, 0.03194371638253259, 0.06967433790682834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c12a813f-17b8-49f3-ba3a-4c1086435667", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 251.00000000000003, 77, 536, 198.5, 514.3000000000001, 536.0, 536.0, 0.08887062103900865, 0.12190419538761477, 0.057426346737059604], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 94.86363636363636, 78, 243, 80.5, 190.4999999999999, 241.64999999999998, 243.0, 0.10891412616216323, 0.08094106446231077, 0.05466978598374209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 613.2857142857142, 459, 706, 625.0, 706.0, 706.0, 706.0, 0.038708464435215854, 11.381573785936663, 0.022075921123209042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 93.31818181818183, 78, 234, 80.0, 187.3999999999999, 233.85, 234.0, 0.10883061504138038, 0.04398055394783056, 0.06123654457850398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 863.0, 774, 1014, 850.0, 1014.0, 1014.0, 1014.0, 0.03867937560436525, 34.80377015989778, 0.022021558571625917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 215.57142857142858, 78, 246, 237.0, 246.0, 246.0, 246.0, 0.03879255404634047, 0.06864463665231342, 0.021479861469018605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 92.60000000000001, 79, 243, 81.0, 153.60000000000005, 243.0, 243.0, 0.06996105501270959, 0.05199254186003125, 0.03511717019192649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 110.93333333333332, 78, 240, 80.0, 237.6, 240.0, 240.0, 0.06991507648709368, 0.02570835624994174, 0.03948199045892256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 167.46666666666667, 78, 932, 80.0, 513.8000000000002, 932.0, 932.0, 0.0699154023631406, 4.211588223041787, 0.04070205259968771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 125.8, 77, 466, 80.0, 328.0000000000001, 466.0, 466.0, 0.06996594990437988, 1.3890882999440273, 0.040799805552964225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 124.28571428571426, 79, 235, 83.0, 235.0, 235.0, 235.0, 0.0388271967873268, 0.028854977299956733, 0.021802381008508703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=433f792b-6ffe-4f07-922e-422f19198a8f", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 660.0, 77, 944, 850.5, 941.0, 944.0, 944.0, 0.06022614919020924, 40.64775438803959, 0.031524624966750146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 171.8181818181818, 77, 848, 80.0, 563.9999999999997, 826.0999999999997, 848.0, 0.10891466535969067, 8.935924218289744, 0.06317901486685182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bec8a895-bc2a-4bc7-b099-a8bdf7164a63", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 498.33333333333326, 79, 716, 622.0, 698.6, 716.0, 716.0, 0.060226451457480124, 13.285490553857505, 0.0315835980787762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 167.77272727272722, 78, 618, 80.0, 524.0999999999998, 617.1, 618.0, 0.10883169178864885, 2.9357696688548436, 0.06323716466234967], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 482.12500000000006, 80, 2763, 415.0, 1279.7000000000016, 2763.0, 2763.0, 0.08912606324608263, 0.019284173230429868, 0.05946270735735652], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 282.33333333333337, 159, 1012, 165.0, 693.4000000000002, 1012.0, 1012.0, 0.06988413210896333, 5.6748008156642955, 0.1559790169981504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 568.6666666666666, 87, 1761, 463.5, 1107.0, 1612.25, 1761.0, 0.10815146612831271, 0.0664328830026452, 0.048900516423250766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 83.33333333333333, 79, 90, 82.0, 89.4, 90.0, 90.0, 0.06022342892129802, 0.044755888094831824, 0.030229338345260915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 108.83333333333333, 79, 255, 81.0, 249.60000000000002, 255.0, 255.0, 0.060225846925972396, 0.08395741844416563, 0.030554030740276034], "isController": false}, {"data": ["login", 24, 0, 0.0, 2631.583333333334, 1610, 4085, 2605.5, 3715.0, 4064.25, 4085.0, 0.11120635729675879, 38.95478241636355, 0.22157106491671108], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 94.13636363636363, 81, 282, 84.5, 95.7, 254.0999999999996, 282.0, 0.1105610975701686, 0.08950698231022439, 0.039301015151895866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fec74e23-619e-45c1-bfb3-83abdde51fd9", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a96141c-b7b9-4733-ac86-1c2a63b9b6ef", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfae444e-7665-4f77-af97-9607dc40ea6b", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 744.9166666666667, 161, 1034, 932.0, 1028.9, 1034.0, 1034.0, 0.060198957554718345, 54.03748549111062, 0.12383701571192793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4d2466e-ec2b-4791-8d6e-eeead9cd9fa1", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c3bee70-8653-40e4-895d-fb5d043435ab", 3, 0, 0.0, 609.3333333333334, 399, 893, 536.0, 893.0, 893.0, 893.0, 0.032984794009961405, 0.02749806557926796, 0.021152358137898432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, 58.8235294117647, 453.47058823529403, 77, 1245, 81.0, 1181.8, 1245.0, 1245.0, 0.08097590252406651, 39.90258777549669, 0.1067460369440647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 253.23076923076925, 159, 480, 194.0, 427.59999999999997, 480.0, 480.0, 0.11842836450428619, 0.18354083444170136, 0.2663481674349327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e66e922-6949-4d44-afcc-335eecd647d1", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.7426417151162791, 1.3876271802325582], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 1111.8076923076922, 93, 3171, 927.5, 2304.6, 2902.549999999999, 3171.0, 0.10684770503458167, 0.033486224865104774, 0.04820667941989915], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/433f792b-6ffe-4f07-922e-422f19198a8f", 3, 0, 0.0, 379.6666666666667, 168, 504, 467.0, 504.0, 504.0, 504.0, 0.027349803993071384, 0.027429930371957335, 0.01753877404503601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 292.95454545454544, 158, 928, 167.0, 694.5999999999998, 906.3999999999996, 928.0, 0.10878810055976422, 11.98494474677097, 0.24213658284213857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 95.70588235294117, 78, 244, 84.0, 145.5999999999999, 244.0, 244.0, 0.11133013313774158, 0.08643306234814896, 0.03957438326380657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 304.36842105263156, 158, 1007, 162.0, 940.0, 1007.0, 1007.0, 0.09615676589370122, 18.289218517515714, 0.212374197533832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 104.14285714285714, 79, 237, 81.0, 237.0, 237.0, 237.0, 0.03839845528499882, 0.02853635202332432, 0.019274224625477922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 125.14285714285714, 78, 236, 83.0, 236.0, 236.0, 236.0, 0.038398034020658146, 0.010274473946933918, 0.021898878777406598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 102.28571428571429, 77, 240, 80.0, 240.0, 240.0, 240.0, 0.0383992978414109, 0.010349810746317783, 0.022574587207548208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5eaff3cf-bda8-450d-a9af-99319169514f", 3, 0, 0.0, 400.6666666666667, 167, 530, 505.0, 530.0, 530.0, 530.0, 0.021675204288800425, 0.02561935767338357, 0.01389978920863829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 101.99999999999999, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.03839866592063544, 0.010349640423921272, 0.02261171440443669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 89.2, 80, 105, 89.0, 105.0, 105.0, 105.0, 0.028103465719392515, 0.008288326803961465, 0.017372552539429164], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 935.9464285714286, 617, 1483, 864.5, 1331.8000000000004, 1422.8999999999999, 1483.0, 0.24559464603671638, 293.81657917357404, 0.4849534905139068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59b34b85-a626-44a5-b4ea-1ac928d8c17d", 3, 0, 0.0, 306.3333333333333, 161, 444, 314.0, 444.0, 444.0, 444.0, 0.06448146157979581, 0.042211008866200966, 0.0413504164427727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 1111.8076923076922, 93, 3171, 927.5, 2304.6, 2902.549999999999, 3171.0, 0.10654558716863298, 0.03339154069016953, 0.048070372335848086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea67b778-0959-4049-994c-58d278a1e897", 3, 0, 0.0, 810.0, 205, 1604, 621.0, 1604.0, 1604.0, 1604.0, 0.0674384624030572, 0.030514148027424973, 0.04324667022591885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 118.87500000000001, 79, 234, 81.0, 234.0, 234.0, 234.0, 0.03637140661868672, 0.009803230690192904, 0.021417927920964933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 119.62500000000001, 78, 237, 81.5, 237.0, 237.0, 237.0, 0.03637091054574551, 0.00980309698303297, 0.02138211733255742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 198.52941176470588, 78, 918, 81.0, 812.3999999999999, 918.0, 918.0, 0.10555596950053399, 11.19915607614311, 0.06098816298462609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdab6788-2d14-415b-8b7e-ee28f6e16cd2", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.9419939159292035, 1.7601170722713864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 171.35294117647058, 77, 632, 80.0, 623.2, 632.0, 632.0, 0.10566422395843045, 3.6802810357580165, 0.0611538979998384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 79.75, 78, 81, 80.5, 81.0, 81.0, 81.0, 0.03637157197934095, 0.00973223703353459, 0.020743162144467885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 98.52941176470588, 78, 238, 80.0, 233.2, 238.0, 238.0, 0.1060207301710052, 0.07879079654310055, 0.05321743682411784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 100.75, 80, 237, 81.0, 237.0, 237.0, 237.0, 0.036371075901889025, 0.027029676524743695, 0.018256575208565388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 107.29411764705881, 77, 239, 80.0, 239.0, 239.0, 239.0, 0.10602271380727565, 0.04710361147664694, 0.059418519985281554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 83.25, 79, 90, 83.0, 90.0, 90.0, 90.0, 0.03773638306202446, 0.02970266088671066, 0.013414104916579007], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 355.74999999999994, 78, 735, 404.5, 655.2, 735.0, 735.0, 0.08823399655887414, 0.018337204485044337, 0.06003078366954162], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1448.7083333333333, 953, 3075, 1282.5, 2513.0, 3011.75, 3075.0, 0.10938126663506764, 0.056613350895103366, 0.05031110994640318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 221.875, 161, 473, 165.0, 473.0, 473.0, 473.0, 0.03635686076685708, 0.056346033239259956, 0.08176743197858581], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 899.7894736842105, 400, 2518, 713.0, 1516.2000000000003, 1926.2999999999972, 2518.0, 0.2514502503473984, 90.78082522966892, 0.909624554723515], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dfa32726-629e-4fc9-84de-2f26cdbfef56", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 147.00000000000003, 78, 338, 83.0, 319.3, 325.15, 338.0, 0.24670690338781445, 0.18334370456848317, 0.11925773161813295], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 502.8035714285717, 380, 771, 468.0, 635.6, 695.8, 771.0, 0.2466992955854042, 72.53778408965756, 0.12407239963523746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c4fb5e0-2fd4-4885-9021-8bc75ce88330", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 110.08928571428572, 78, 243, 82.0, 236.9, 240.3, 243.0, 0.24702576566959425, 0.43711981190752414, 0.12013557744478312], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 786.0178571428571, 536, 1162, 772.0, 1038.7000000000003, 1103.4499999999998, 1162.0, 0.24599813744267365, 221.3495564895187, 0.12347953383352954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 86.42105263157895, 79, 113, 83.0, 105.0, 113.0, 113.0, 0.09690960374173081, 0.072398287951586, 0.034448335705068375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, 7.647058823529412, 154.91176470588232, 79, 2041, 86.0, 269.70000000000005, 362.599999999999, 1475.1299999999937, 0.7066109690961615, 1.6385150713365337, 0.3367361717272482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 83.14285714285715, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.03719842703794239, 0.02880698500106281, 0.013222878361143586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bec8a895-bc2a-4bc7-b099-a8bdf7164a63", 3, 0, 0.0, 319.3333333333333, 202, 390, 366.0, 390.0, 390.0, 390.0, 0.07042253521126761, 0.032643779342723, 0.04516028462441314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 96.07692307692308, 80, 236, 82.0, 182.39999999999995, 236.0, 236.0, 0.11806053781115763, 0.09580889347760936, 0.04196683180005994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fec74e23-619e-45c1-bfb3-83abdde51fd9", 3, 0, 0.0, 343.3333333333333, 178, 442, 410.0, 442.0, 442.0, 442.0, 0.07134194192765927, 0.03228037085919479, 0.04574987812418254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 231.42857142857144, 161, 478, 163.0, 478.0, 478.0, 478.0, 0.038380770137567646, 0.05948269746906235, 0.08631925158868974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 317.2352941176471, 159, 1150, 163.0, 921.9999999999998, 1150.0, 1150.0, 0.10550356229675048, 14.993560452377553, 0.23410421075577786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a96141c-b7b9-4733-ac86-1c2a63b9b6ef", 3, 0, 0.0, 449.0, 170, 735, 442.0, 735.0, 735.0, 735.0, 0.029766038933978924, 0.024814721910781257, 0.019088247623677893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c3bee70-8653-40e4-895d-fb5d043435ab", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.66666666666666, 80, 249, 84.0, 241.20000000000002, 249.0, 249.0, 0.07345199911857601, 0.06089916723795999, 0.026109890311681316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84d7814d-534f-4a68-8433-f6104e6cdfda", 1, 0, 0.0, 839.0, 839, 839, 839.0, 839.0, 839.0, 839.0, 1.1918951132300357, 0.38061494338498214, 0.7111796036948749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 107.08333333333334, 80, 339, 85.0, 266.10000000000025, 339.0, 339.0, 0.05853658536585366, 0.045445884146341466, 0.020807926829268294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfae444e-7665-4f77-af97-9607dc40ea6b", 3, 0, 0.0, 344.6666666666667, 195, 462, 377.0, 462.0, 462.0, 462.0, 0.022704911829259062, 0.022771430125633846, 0.014560115984257929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 80.21052631578948, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.09660902328277461, 0.07179635421698387, 0.04849320113998647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 96.10526315789474, 77, 233, 80.0, 233.0, 233.0, 233.0, 0.09653441451877595, 0.048723681670146984, 0.05377467025876304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 222.63157894736838, 77, 925, 81.0, 858.0, 925.0, 925.0, 0.09619668678358782, 13.688878515925614, 0.05524782987869092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 178.00000000000003, 77, 699, 80.0, 628.0, 699.0, 699.0, 0.09641586700699777, 4.498115371099598, 0.05546786592358789], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 19.51219512195122, 0.6069802731411229], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 12.195121951219512, 0.37936267071320184], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 12.195121951219512, 0.37936267071320184], "isController": false}, {"data": ["401/Unauthorized", 23, 56.09756097560975, 1.7450682852807284], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 41, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
