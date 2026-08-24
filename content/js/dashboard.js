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

    var data = {"OkPercent": 98.60788863109049, "KoPercent": 1.3921113689095128};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.742686170212766, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b8bd5f9-d551-48b0-ae2a-a4d5de11f6ec"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0c5662f-d374-4f69-baba-8b4b8caca968"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fc92966-16d5-4caa-804b-3e13d3845c5a"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03545d1a-457a-4519-adff-8997281972e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51f36d86-3c01-4fb8-9f1d-455a08329a66"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a31dd080-fd7e-4dc0-bafb-699eedd15ed2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be1826a9-23f6-4a84-8fb3-4c1f36dc106a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03545d1a-457a-4519-adff-8997281972e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fc92966-16d5-4caa-804b-3e13d3845c5a"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36ee5123-6f04-4b1a-9a79-f21ef72f9fd2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b7eb90f-9195-45ec-8920-c5e455e52829"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b2371b8-7f99-4c4c-a9af-0fd2c7cab48d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f6d2bd0-a629-4553-a130-e5622a60102f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b755332-2315-45cf-8b02-166528d1a8a2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f6d2bd0-a629-4553-a130-e5622a60102f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36ee5123-6f04-4b1a-9a79-f21ef72f9fd2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b8bd5f9-d551-48b0-ae2a-a4d5de11f6ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63909b50-8293-445d-b34b-9e4eef66e39b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51f36d86-3c01-4fb8-9f1d-455a08329a66"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9418604651162791, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d9071fee-32f5-4b59-badb-7e7929c61b37"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be1826a9-23f6-4a84-8fb3-4c1f36dc106a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0c5662f-d374-4f69-baba-8b4b8caca968"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b2371b8-7f99-4c4c-a9af-0fd2c7cab48d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a31dd080-fd7e-4dc0-bafb-699eedd15ed2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a42a1dcb-e160-45cf-8978-8cac08ea7f6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b7eb90f-9195-45ec-8920-c5e455e52829"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b755332-2315-45cf-8b02-166528d1a8a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 18, 1.3921113689095128, 446.3472544470227, 125, 2581, 143.0, 1275.4000000000005, 1537.8999999999999, 2011.7199999999993, 5.079851493900643, 717.7245431927338, 3.7163471808886794], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2103.9107142857138, 1591, 2766, 2090.5, 2554.2000000000003, 2688.6, 2766.0, 0.23689064112759947, 285.05990576987347, 1.1647894317162728], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 671.0, 135, 1576, 501.0, 1537.5, 1576.0, 1576.0, 0.08273987175319879, 0.01629864661209775, 0.05567165199018941], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 671.0, 135, 1576, 501.0, 1537.5, 1576.0, 1576.0, 0.08384287844579259, 0.01651592415812767, 0.05641381176674911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 177.70588235294116, 126, 400, 132.0, 394.4, 400.0, 400.0, 0.10177751435362298, 0.045217560662392006, 0.05703937442750148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 147.9411764705882, 127, 396, 133.0, 193.59999999999982, 396.0, 396.0, 0.10177020288189269, 0.07563195741515658, 0.05108387136845004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b8bd5f9-d551-48b0-ae2a-a4d5de11f6ec", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 268.6470588235294, 127, 1042, 132.0, 835.5999999999998, 1042.0, 1042.0, 0.10177995174432876, 3.5449919773449805, 0.058905848680153514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 327.8235294117647, 126, 1437, 132.0, 1215.3999999999999, 1437.0, 1437.0, 0.101615689462453, 10.781104768017359, 0.05871154668045452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0c5662f-d374-4f69-baba-8b4b8caca968", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fc92966-16d5-4caa-804b-3e13d3845c5a", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 265.4000000000001, 127, 494, 253.0, 394.4000000000001, 494.0, 494.0, 0.08690916254330973, 0.1735863409938932, 0.056174099331378846], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/03545d1a-457a-4519-adff-8997281972e3", 3, 0, 0.0, 402.0, 253, 690, 263.0, 690.0, 690.0, 690.0, 0.04250797024442083, 0.027328529047112998, 0.02725934289762664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 131.00000000000003, 126, 138, 130.5, 137.1, 138.0, 138.0, 0.09965673790277932, 0.0740613061953272, 0.05002301101760602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 174.11111111111111, 125, 395, 131.5, 394.1, 395.0, 395.0, 0.09966225568905376, 0.04329944355240573, 0.055908622169315095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 894.2, 653, 1045, 998.0, 1045.0, 1045.0, 1045.0, 0.052260256075254766, 15.366250489939901, 0.029804677292918736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1375.2, 1124, 1515, 1414.0, 1515.0, 1515.0, 1515.0, 0.05219697048783289, 46.96692579743922, 0.02971761112735017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 232.8, 128, 392, 132.0, 392.0, 392.0, 392.0, 0.052598912254494576, 0.09307541895033611, 0.029124593015916432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 130.73333333333335, 127, 137, 131.0, 135.2, 137.0, 137.0, 0.07042782556436164, 0.05233942895945235, 0.035351467128986215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 164.06666666666666, 126, 394, 129.0, 391.6, 394.0, 394.0, 0.07043014034379298, 0.018845564896678983, 0.04016718941481944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 146.0, 125, 382, 129.0, 232.00000000000009, 382.0, 382.0, 0.0704298096517011, 0.018983034632685067, 0.0414050248147696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 190.53333333333333, 127, 511, 130.0, 443.20000000000005, 511.0, 511.0, 0.0704304710389903, 0.018983212897227857, 0.041474193395030425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 185.2, 129, 404, 132.0, 404.0, 404.0, 404.0, 0.05274484155449597, 0.03919807072555804, 0.02961746474007342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 965.8823529411765, 125, 1817, 1381.0, 1676.9999999999998, 1817.0, 1817.0, 0.0788054941336263, 41.72011207474006, 0.04234527758076404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 284.0, 126, 1641, 131.0, 1189.2000000000007, 1641.0, 1641.0, 0.09966335931963147, 9.988018335981794, 0.05763950793984762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 629.2352941176472, 126, 1060, 780.0, 1044.0, 1060.0, 1060.0, 0.07880622476462434, 13.639126595246594, 0.04242262938127842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 287.05555555555554, 126, 1031, 133.0, 1014.8000000000001, 1031.0, 1031.0, 0.0996600485012236, 3.279806140443155, 0.05773491742057648], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 557.076923076923, 237, 1290, 519.0, 1051.6, 1290.0, 1290.0, 0.0800024616142035, 0.0151567163605034, 0.05471923174559217], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 340.8666666666667, 256, 644, 267.0, 573.8000000000001, 644.0, 644.0, 0.0703851947089103, 0.10908330469046938, 0.15829795255334025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51f36d86-3c01-4fb8-9f1d-455a08329a66", 3, 0, 0.0, 348.3333333333333, 240, 452, 353.0, 452.0, 452.0, 452.0, 0.023560826199638736, 0.02362985205764549, 0.015108993363700621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 640.0, 145, 1701, 608.5, 1007.2, 1666.5499999999995, 1701.0, 0.08459020276271602, 0.0519601929079574, 0.038247328006970234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 147.0, 127, 396, 131.0, 190.3999999999998, 396.0, 396.0, 0.07889949133033825, 0.0586352665062377, 0.03960384623417369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a31dd080-fd7e-4dc0-bafb-699eedd15ed2", 3, 0, 0.0, 889.0, 250, 1451, 966.0, 1451.0, 1451.0, 1451.0, 0.023883829055474173, 0.023953801210910133, 0.0153161273565378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 256.23529411764713, 125, 430, 133.0, 412.4, 430.0, 430.0, 0.07890388578430463, 0.09082468194771921, 0.04110181734214582], "isController": false}, {"data": ["login", 20, 0, 0.0, 2939.4, 1559, 4321, 2899.0, 3967.8, 4303.65, 4321.0, 0.0846740050804403, 25.441003552339122, 0.16285688770110077], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/be1826a9-23f6-4a84-8fb3-4c1f36dc106a", 3, 0, 0.0, 363.0, 297, 480, 312.0, 480.0, 480.0, 480.0, 0.06405055723984798, 0.02898120916776976, 0.041074087813313974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 149.83333333333331, 131, 402, 134.5, 170.70000000000036, 402.0, 402.0, 0.09755251577099004, 0.0789756206778816, 0.03467687084046912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03545d1a-457a-4519-adff-8997281972e3", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fc92966-16d5-4caa-804b-3e13d3845c5a", 3, 0, 0.0, 326.0, 242, 490, 246.0, 490.0, 490.0, 490.0, 0.05737893045673629, 0.025962471788692525, 0.03679573339836279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1130.4117647058824, 263, 1955, 1518.0, 1806.9999999999998, 1955.0, 1955.0, 0.0787551132915468, 55.4729021968623, 0.1652690167539922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36ee5123-6f04-4b1a-9a79-f21ef72f9fd2", 1, 0, 0.0, 1290.0, 1290, 1290, 1290.0, 1290.0, 1290.0, 1290.0, 0.7751937984496124, 0.14004966085271317, 0.5344597868217054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b7eb90f-9195-45ec-8920-c5e455e52829", 3, 0, 0.0, 513.6666666666666, 235, 811, 495.0, 811.0, 811.0, 811.0, 0.02515174888493913, 0.025225435649250477, 0.016129213965927765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b2371b8-7f99-4c4c-a9af-0fd2c7cab48d", 3, 0, 0.0, 421.3333333333333, 253, 516, 495.0, 516.0, 516.0, 516.0, 0.016772051054123407, 0.02312162637181401, 0.010755514510619504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f6d2bd0-a629-4553-a130-e5622a60102f", 3, 0, 0.0, 422.6666666666667, 253, 560, 455.0, 560.0, 560.0, 560.0, 0.020509454858689855, 0.02424148131246838, 0.013152222028521815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b755332-2315-45cf-8b02-166528d1a8a2", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 494.00000000000006, 257, 1572, 268.0, 1347.9999999999998, 1572.0, 1572.0, 0.1015276931713668, 14.428532762464016, 0.22528206595418113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 1024.75, 126, 1833, 1390.5, 1833.0, 1833.0, 1833.0, 0.0834019662013532, 62.36946044792068, 0.13808360200060465], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1315.590909090909, 447, 2261, 1273.5, 2043.1999999999998, 2233.5499999999997, 2261.0, 0.0906069429629294, 0.02850772424188759, 0.040879304344602914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f6d2bd0-a629-4553-a130-e5622a60102f", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 166.70588235294116, 130, 393, 134.0, 393.0, 393.0, 393.0, 0.09264002266955848, 0.07192267384990136, 0.03293063305831962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 503.5555555555557, 261, 1769, 391.0, 1319.9000000000008, 1769.0, 1769.0, 0.0995834094039933, 13.374561902153769, 0.22113438297013052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36ee5123-6f04-4b1a-9a79-f21ef72f9fd2", 3, 0, 0.0, 469.0, 221, 867, 319.0, 867.0, 867.0, 867.0, 0.027140479119924732, 0.027219992242346384, 0.017404539018962148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 375.8571428571428, 256, 663, 267.5, 657.5, 663.0, 663.0, 0.07913941538583291, 0.12265063693097347, 0.17798640003278635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 159.89999999999998, 128, 384, 133.5, 360.4000000000001, 384.0, 384.0, 0.06134329548452001, 0.045588132679413806, 0.030791458866253212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 157.29999999999998, 125, 397, 132.0, 370.80000000000007, 397.0, 397.0, 0.06134404809373371, 0.01641432536883109, 0.03498527742845751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 168.20000000000002, 126, 516, 129.0, 477.8000000000001, 516.0, 516.0, 0.061343671786818474, 0.016534036536290916, 0.03606336954654758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 208.50000000000003, 127, 526, 131.5, 525.1, 526.0, 526.0, 0.06134404809373371, 0.016534137962764164, 0.03612349707082171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.7680257161458334, 1.60980224609375], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1448.2142857142858, 1005, 2227, 1391.5, 2015.5, 2138.65, 2227.0, 0.24244943197561653, 290.05380970317265, 0.47874292134247715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1315.590909090909, 447, 2261, 1273.5, 2043.1999999999998, 2233.5499999999997, 2261.0, 0.08844469995135541, 0.027827416248899468, 0.03990376111086543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 173.0, 128, 392, 129.5, 392.0, 392.0, 392.0, 0.028578505153657098, 0.007702800217196639, 0.01682894395278831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 218.16666666666669, 130, 393, 133.0, 393.0, 393.0, 393.0, 0.02854383619643868, 0.007693455849821363, 0.016780653701421958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 280.52941176470586, 127, 1392, 136.0, 591.9999999999993, 1392.0, 1392.0, 0.0914170175466899, 4.8618487629798715, 0.053281081113781915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 228.05882352941177, 128, 754, 132.0, 463.59999999999974, 754.0, 754.0, 0.09154008109374244, 1.6065052857665942, 0.05344220152548852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 217.16666666666666, 128, 392, 132.0, 392.0, 392.0, 392.0, 0.028543157253767697, 0.007637524499543309, 0.01627851937128939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 147.0588235294118, 129, 381, 132.0, 188.99999999999983, 381.0, 381.0, 0.09153515219065157, 0.0680256355635604, 0.04594635568944815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b8bd5f9-d551-48b0-ae2a-a4d5de11f6ec", 3, 0, 0.0, 621.3333333333333, 230, 1356, 278.0, 1356.0, 1356.0, 1356.0, 0.05453553899291038, 0.035061096846028, 0.03497233457553172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 132.0, 128, 139, 131.0, 139.0, 139.0, 139.0, 0.028578777399902833, 0.021238720313794975, 0.014345206624560602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 160.94117647058823, 126, 383, 131.0, 377.4, 383.0, 383.0, 0.0914155427932288, 0.032537379546578905, 0.05168381044180594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 224.16666666666666, 137, 385, 150.5, 385.0, 385.0, 385.0, 0.030200987572293614, 0.023771480452410794, 0.010735507301088744], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 629.6923076923077, 126, 1356, 496.0, 1199.9999999999998, 1356.0, 1356.0, 0.08052726777174855, 0.0150867642595208, 0.054805967999702665], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1571.9, 776, 2581, 1459.5, 2486.9000000000005, 2577.0499999999997, 2581.0, 0.08425771063374438, 0.04360994788660597, 0.03875525557470078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 352.16666666666663, 264, 532, 266.0, 532.0, 532.0, 532.0, 0.02852538045726185, 0.044208768345385306, 0.06415424921198637], "isController": false}, {"data": ["addBook", 58, 6, 10.344827586206897, 1350.2241379310342, 656, 4540, 1060.5, 2208.6, 2823.2999999999965, 4540.0, 0.2770810939925953, 86.80014070524305, 1.0077079974322227], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 218.94642857142858, 128, 636, 133.0, 533.0, 535.5, 636.0, 0.2436795613767895, 0.181093892780993, 0.1177943192202254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63909b50-8293-445d-b34b-9e4eef66e39b", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.6823417467948718, 1.274956597222222], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 855.6785714285713, 634, 1324, 785.0, 1051.9, 1089.9499999999998, 1324.0, 0.24359264350216622, 71.62432522662816, 0.12250997207384337], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 217.98214285714283, 125, 532, 134.0, 398.3, 473.94999999999993, 532.0, 0.24414807580797754, 0.43202764976958524, 0.11873607593005157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51f36d86-3c01-4fb8-9f1d-455a08329a66", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1224.5535714285716, 870, 1693, 1176.0, 1522.1000000000001, 1554.35, 1693.0, 0.24305239081088356, 218.69896849216374, 0.12200090710624428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 153.42857142857144, 129, 387, 135.5, 266.0, 387.0, 387.0, 0.08084401147984963, 0.06039616092000485, 0.0287375197057278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, 3.488372093023256, 213.75000000000006, 127, 2313, 136.5, 323.2000000000003, 403.7499999999998, 2045.8200000000038, 0.7062871878682857, 1.5284536275751766, 0.33933689205919676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 135.4, 130, 145, 135.5, 144.4, 145.0, 145.0, 0.059631714531056194, 0.046179638303835514, 0.021197211024711383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 136.17647058823528, 129, 142, 136.0, 142.0, 142.0, 142.0, 0.11005729453274204, 0.08931407398116079, 0.03912192891593565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9071fee-32f5-4b59-badb-7e7929c61b37", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.6082589285714285, 1.1365327380952381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 370.09999999999997, 260, 911, 267.0, 885.1000000000001, 911.0, 911.0, 0.06129328838492186, 0.09499262565124118, 0.13785004213913576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 460.23529411764713, 259, 1525, 279.0, 916.1999999999995, 1525.0, 1525.0, 0.09134677384688131, 6.5616243135558605, 0.20406621600019342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be1826a9-23f6-4a84-8fb3-4c1f36dc106a", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0c5662f-d374-4f69-baba-8b4b8caca968", 3, 0, 0.0, 366.0, 274, 496, 328.0, 496.0, 496.0, 496.0, 0.0428400068544011, 0.02715152778174444, 0.0274722700205632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b2371b8-7f99-4c4c-a9af-0fd2c7cab48d", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a31dd080-fd7e-4dc0-bafb-699eedd15ed2", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 154.5333333333333, 131, 387, 135.0, 250.80000000000007, 387.0, 387.0, 0.06967670011148272, 0.05776906093227425, 0.024767889492753624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 150.82352941176467, 127, 410, 135.0, 194.7999999999998, 410.0, 410.0, 0.08123632123708582, 0.06306921424168284, 0.028876973564745348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a42a1dcb-e160-45cf-8978-8cac08ea7f6a", 2, 0, 0.0, 401.5, 309, 494, 401.5, 494.0, 494.0, 494.0, 0.015473887814313348, 0.02644463249516441, 0.009618290618955513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 131.42857142857144, 127, 135, 131.5, 134.5, 135.0, 135.0, 0.0791989590993947, 0.0588578201900775, 0.03975416501668835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b7eb90f-9195-45ec-8920-c5e455e52829", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 196.42857142857144, 127, 531, 131.5, 463.5, 531.0, 531.0, 0.07919985517740767, 0.021192148748642288, 0.045168667405865316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 213.57142857142856, 127, 518, 132.5, 455.5, 518.0, 518.0, 0.07920030322401805, 0.021346956728348618, 0.04656111576255749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b755332-2315-45cf-8b02-166528d1a8a2", 3, 0, 0.0, 432.0, 321, 502, 473.0, 502.0, 502.0, 502.0, 0.016548345992818018, 0.02281323088528135, 0.010612057814404783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 166.50000000000003, 126, 383, 132.0, 380.0, 383.0, 383.0, 0.07920075127569783, 0.02134707749227793, 0.04663872365160721], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.46403712296983757], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15467904098994587], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07733952049497293], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.6960556844547564], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 18, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
