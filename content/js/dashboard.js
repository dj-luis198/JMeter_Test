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

    var data = {"OkPercent": 97.06349206349206, "KoPercent": 2.9365079365079363};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6944444444444444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=130c5580-7d0e-44ed-a616-295bac2fc031"], "isController": false}, {"data": [0.34375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.34375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d83e1f5e-bbee-4864-84de-bf357c0d0d7c"], "isController": false}, {"data": [0.5625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d86f0919-d159-4cfc-8832-a0e2db048a5d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/48eecb74-af47-4aee-b14f-1d27847cdea8"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fea2a4c2-cdbf-4a01-9bf5-292f95fa567f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.3, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f9f3659e-dd3d-4dbc-b192-af7ca50be634"], "isController": false}, {"data": [0.5652173913043478, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d314e7d9-960b-4e4a-a70e-bebf853c012f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0424d5e-5223-47f1-9a7b-622198926673"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc32a18c-e679-41e1-983b-0991a515e4a7"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2987b85-d796-4bca-8671-2c5d480d5463"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/752b0d7e-aeae-46e7-92fa-3fcdec03511e"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d83e1f5e-bbee-4864-84de-bf357c0d0d7c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93640754-0a0a-48fd-ac11-d1c5c8d42635"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.14, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d86f0919-d159-4cfc-8832-a0e2db048a5d"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6e82d12e-1078-41d4-bd16-177c3ab824f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/130c5580-7d0e-44ed-a616-295bac2fc031"], "isController": false}, {"data": [0.20192307692307693, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fea2a4c2-cdbf-4a01-9bf5-292f95fa567f"], "isController": false}, {"data": [0.8425925925925926, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9629629629629629, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8765822784810127, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc32a18c-e679-41e1-983b-0991a515e4a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b2987b85-d796-4bca-8671-2c5d480d5463"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9f3659e-dd3d-4dbc-b192-af7ca50be634"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48eecb74-af47-4aee-b14f-1d27847cdea8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e82d12e-1078-41d4-bd16-177c3ab824f4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=752b0d7e-aeae-46e7-92fa-3fcdec03511e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b0424d5e-5223-47f1-9a7b-622198926673"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93640754-0a0a-48fd-ac11-d1c5c8d42635"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 37, 2.9365079365079363, 503.4920634920636, 125, 5088, 253.5, 1193.4000000000005, 1545.8500000000001, 3034.9900000000043, 4.992095848240286, 733.1516494283356, 3.6550588676064484], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2192.9259259259265, 1546, 5122, 1988.0, 3049.5, 3717.5, 5122.0, 0.23335004234871137, 280.7986649960352, 1.147380335181408], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=130c5580-7d0e-44ed-a616-295bac2fc031", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 801.9375000000001, 128, 1874, 801.5, 1477.1000000000004, 1874.0, 1874.0, 0.09803801424002156, 0.020512348194262325, 0.06546239476231909], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 801.9375000000001, 128, 1874, 801.5, 1477.1000000000004, 1874.0, 1874.0, 0.09651112290691502, 0.020192878987115765, 0.06444285184336244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 212.2941176470588, 127, 405, 133.0, 397.0, 405.0, 405.0, 0.07995146475786463, 0.028456989639230774, 0.04520233893307122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 155.94117647058823, 126, 387, 132.0, 218.19999999999985, 387.0, 387.0, 0.07995184077355758, 0.05941733479363019, 0.04013207632578965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 289.7647058823529, 125, 1172, 133.0, 614.3999999999995, 1172.0, 1172.0, 0.07995259281555407, 1.403147795307253, 0.04667728635021117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 269.4117647058824, 126, 1386, 132.0, 663.5999999999993, 1386.0, 1386.0, 0.07995184077355758, 4.252094069513423, 0.046598769329533274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d83e1f5e-bbee-4864-84de-bf357c0d0d7c", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 390.5, 127, 910, 303.0, 774.2000000000002, 910.0, 910.0, 0.09792101446170982, 0.155224889379854, 0.06328049933597313], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 311.0, 126, 2579, 131.0, 1266.2000000000007, 2579.0, 2579.0, 0.08601854559843101, 0.0639258917972715, 0.043177277771087444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 171.00000000000003, 126, 394, 132.0, 385.6, 394.0, 394.0, 0.08602249201424533, 0.03163118716773813, 0.04857806612835703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 786.8, 629, 1000, 787.5, 994.6, 1000.0, 1000.0, 0.100852201099289, 29.653895731430588, 0.05751727093943825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1017.9, 869, 1200, 1012.0, 1197.3, 1200.0, 1200.0, 0.10039757439460262, 90.33791392037469, 0.057159947140677084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 299.7, 127, 493, 386.0, 484.3, 493.0, 493.0, 0.10116337885685381, 0.1790117602427921, 0.05601526934749621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 159.16666666666666, 126, 391, 130.5, 335.5000000000002, 391.0, 391.0, 0.059047272262051795, 0.04388181073380998, 0.029638962834662715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d86f0919-d159-4cfc-8832-a0e2db048a5d", 3, 0, 0.0, 1089.6666666666665, 282, 2271, 716.0, 2271.0, 2271.0, 2271.0, 0.022728822419710436, 0.026864698634755397, 0.014575449273056495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48eecb74-af47-4aee-b14f-1d27847cdea8", 3, 0, 0.0, 802.6666666666666, 272, 1518, 618.0, 1518.0, 1518.0, 1518.0, 0.04194982800570518, 0.02696969736694913, 0.026901419652096095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 213.91666666666669, 125, 507, 148.0, 468.60000000000014, 507.0, 507.0, 0.059049306170652495, 0.015800302627694125, 0.033676557425450254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 182.33333333333331, 127, 392, 131.5, 391.4, 392.0, 392.0, 0.05897327527742011, 0.01589514060211714, 0.03466983566113956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 220.83333333333331, 125, 399, 128.5, 397.8, 399.0, 399.0, 0.05897153640509514, 0.0158946719216858, 0.03472640278542224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fea2a4c2-cdbf-4a01-9bf5-292f95fa567f", 3, 0, 0.0, 646.3333333333333, 265, 1180, 494.0, 1180.0, 1180.0, 1180.0, 0.015561538102426043, 0.021452836544197364, 0.009979241556568786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 174.4, 127, 378, 135.0, 367.70000000000005, 378.0, 378.0, 0.10139519792342634, 0.07535326720676509, 0.05693578008395523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 704.6875000000001, 126, 1182, 915.5, 1172.9, 1182.0, 1182.0, 0.08997053464990216, 50.60637196982051, 0.04806043208349265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 223.0, 126, 904, 130.0, 625.0000000000002, 904.0, 904.0, 0.08602199869246561, 5.181822951314416, 0.05007869220755388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 574.5625, 128, 914, 712.0, 912.6, 914.0, 914.0, 0.08996547574868144, 16.54211631833159, 0.048145586631130305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 291.46666666666664, 125, 914, 163.0, 623.6000000000001, 914.0, 914.0, 0.0860229853416833, 1.7078810854093547, 0.050163273418324036], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 960.6, 131, 2199, 814.0, 2070.0, 2199.0, 2199.0, 0.10150291990066247, 0.020657430182908262, 0.06853429572199027], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 436.33333333333337, 257, 783, 418.5, 739.2000000000002, 783.0, 783.0, 0.05893243886987227, 0.09133377000633525, 0.13254043624737874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9f3659e-dd3d-4dbc-b192-af7ca50be634", 3, 0, 0.0, 1140.3333333333335, 265, 2889, 267.0, 2889.0, 2889.0, 2889.0, 0.0571374154842396, 0.026522771640796115, 0.03664085563279688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 873.6086956521739, 144, 1979, 831.0, 1740.8000000000002, 1942.7999999999995, 1979.0, 0.09696990138582637, 0.05956451950359842, 0.04384478939613048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 133.9375, 125, 157, 131.5, 148.60000000000002, 157.0, 157.0, 0.08996901691979825, 0.0668617401132485, 0.0451602291960706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 268.6875, 130, 514, 259.0, 432.80000000000007, 514.0, 514.0, 0.08996952282414332, 0.10853012994972953, 0.046588222145998046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d314e7d9-960b-4e4a-a70e-bebf853c012f", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0424d5e-5223-47f1-9a7b-622198926673", 1, 0, 0.0, 2199.0, 2199, 2199, 2199.0, 2199.0, 2199.0, 2199.0, 0.4547521600727603, 0.08215737266939518, 0.3135302978626649], "isController": false}, {"data": ["login", 23, 0, 0.0, 4305.304347826087, 2558, 7444, 4223.0, 6732.0, 7314.799999999998, 7444.0, 0.09638675394557082, 50.26217262553327, 0.21491806994954363], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc32a18c-e679-41e1-983b-0991a515e4a7", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 218.60000000000002, 127, 1360, 133.0, 647.8000000000004, 1360.0, 1360.0, 0.08400443543419092, 0.06800749704584401, 0.029860951658247554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2987b85-d796-4bca-8671-2c5d480d5463", 1, 0, 0.0, 1843.0, 1843, 1843, 1843.0, 1843.0, 1843.0, 1843.0, 0.5425935973955507, 0.09802716359196961, 0.3740928513293543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/752b0d7e-aeae-46e7-92fa-3fcdec03511e", 3, 0, 0.0, 778.6666666666666, 696, 910, 730.0, 910.0, 910.0, 910.0, 0.020839556256382112, 0.024631649989232896, 0.01336390814618254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 844.75, 260, 1313, 1060.0, 1304.6, 1313.0, 1313.0, 0.08989723622184391, 67.26996359513095, 0.18780533455818318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d83e1f5e-bbee-4864-84de-bf357c0d0d7c", 3, 0, 0.0, 713.6666666666666, 576, 914, 651.0, 914.0, 914.0, 914.0, 0.03075156832998483, 0.025636317217803108, 0.0197202440136947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93640754-0a0a-48fd-ac11-d1c5c8d42635", 1, 0, 0.0, 1045.0, 1045, 1045, 1045.0, 1045.0, 1045.0, 1045.0, 0.9569377990430622, 0.17288427033492823, 0.6597637559808613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 508.29411764705884, 259, 1563, 518.0, 935.7999999999995, 1563.0, 1563.0, 0.07990261281543906, 5.73956698071527, 0.17850027055259707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, 41.1764705882353, 763.0588235294117, 127, 1495, 1021.0, 1430.2, 1495.0, 1495.0, 0.17040385714142517, 119.93774855783205, 0.27234467563124604], "isController": false}, {"data": ["register", 25, 11, 44.0, 1331.5199999999998, 143, 2665, 1261.0, 2558.8, 2645.2, 2665.0, 0.10057771841457332, 0.03105337056049951, 0.04537783780032507], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 181.42105263157896, 128, 431, 135.0, 393.0, 431.0, 431.0, 0.09090430647190818, 0.0705751207472334, 0.03231364019118611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 619.9333333333334, 257, 3019, 512.0, 1834.0000000000007, 3019.0, 3019.0, 0.08595545215433015, 6.979840133603425, 0.19184965925826178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d86f0919-d159-4cfc-8832-a0e2db048a5d", 1, 0, 0.0, 1984.0, 1984, 1984, 1984.0, 1984.0, 1984.0, 1984.0, 0.5040322580645161, 0.09106051537298387, 0.3475066154233871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 502.8125, 258, 1448, 521.0, 986.0000000000005, 1448.0, 1448.0, 0.07941195447709709, 6.053150056643059, 0.17732945352167204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 130.16666666666669, 128, 134, 129.5, 134.0, 134.0, 134.0, 0.043948638690916544, 0.03266104887088622, 0.02206015653040147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 129.33333333333334, 126, 134, 129.0, 134.0, 134.0, 134.0, 0.0439505702586491, 0.011760211182490094, 0.02506555960063582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 129.33333333333334, 127, 131, 130.0, 131.0, 131.0, 131.0, 0.043948960607081644, 0.011845618288627475, 0.025837181919397607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 177.5, 131, 403, 132.5, 403.0, 403.0, 403.0, 0.04386189351794317, 0.011822150987258119, 0.025828829874335674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 136.33333333333334, 131, 140, 138.0, 140.0, 140.0, 140.0, 0.13223431921364656, 0.038998793361837175, 0.08174250396702958], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1435.203703703704, 1005, 4506, 1282.5, 2006.5, 2586.0, 4506.0, 0.23403572945469675, 279.9880964118855, 0.4621291454662078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, 44.0, 1331.5199999999998, 143, 2665, 1261.0, 2558.8, 2645.2, 2665.0, 0.09983666721244044, 0.030824571001840988, 0.04504349633998778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 140.0, 127, 169, 131.0, 169.0, 169.0, 169.0, 0.03466108392141639, 0.009342245275694262, 0.020410775004505943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 141.8, 129, 168, 133.0, 168.0, 168.0, 168.0, 0.03466156448437457, 0.009342374802429082, 0.020377208808196764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 152.52631578947367, 126, 302, 133.0, 202.0, 302.0, 302.0, 0.0890284188084249, 0.023995941006958274, 0.05233897277604667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 180.42105263157896, 126, 394, 141.0, 394.0, 394.0, 394.0, 0.08902967030907352, 0.023996278325492473, 0.052426651558956386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 143.15789473684214, 128, 258, 132.0, 174.0, 258.0, 258.0, 0.08897380423889935, 0.06612213381426016, 0.04466067908085378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 192.6, 129, 396, 146.0, 396.0, 396.0, 396.0, 0.03459752696877227, 0.009257541395941017, 0.019731402099377935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e82d12e-1078-41d4-bd16-177c3ab824f4", 3, 0, 0.0, 508.3333333333333, 377, 612, 536.0, 612.0, 612.0, 612.0, 0.06270640859495841, 0.02906703315078801, 0.04021211749090757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 152.10526315789474, 125, 306, 134.0, 202.0, 306.0, 306.0, 0.08902967030907352, 0.023822392250670066, 0.050774733848143495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 143.0, 128, 196, 130.0, 196.0, 196.0, 196.0, 0.0346606033717835, 0.02575851481047582, 0.017397998176852263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 139.4, 136, 142, 140.0, 142.0, 142.0, 142.0, 0.03423789861473462, 0.026948970979957132, 0.012170503023206446], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 1023.8, 128, 2889, 752.0, 2661.0, 2889.0, 2889.0, 0.09896482790016428, 0.019599674900540348, 0.06734247273518992], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 2546.9999999999995, 1095, 5088, 2354.0, 4614.8, 5025.199999999999, 5088.0, 0.09758995247793618, 0.050510424622369314, 0.044887566032331974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 339.6, 262, 527, 298.0, 527.0, 527.0, 527.0, 0.03456547738380815, 0.05356973887510111, 0.07773856876456071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/130c5580-7d0e-44ed-a616-295bac2fc031", 3, 0, 0.0, 1050.3333333333335, 314, 2509, 328.0, 2509.0, 2509.0, 2509.0, 0.06032454605779092, 0.027295286139430133, 0.03868468611127868], "isController": false}, {"data": ["addBook", 52, 12, 23.076923076923077, 1475.75, 650, 3827, 1233.5, 2434.8, 3143.9999999999973, 3827.0, 0.23847194515145262, 72.30995781597532, 0.866046195340625], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fea2a4c2-cdbf-4a01-9bf5-292f95fa567f", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 334.4074074074075, 128, 1709, 142.0, 656.0, 1019.5, 1709.0, 0.2349521828798176, 0.1746080187222082, 0.11357551809131808], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 843.0000000000001, 626, 3316, 792.0, 1039.0, 1128.5, 3316.0, 0.2348632791263086, 69.05760225794947, 0.11811971557621966], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 237.03703703703704, 127, 548, 136.5, 491.0, 519.5, 548.0, 0.23513428780436826, 0.4160774702163235, 0.11435241731110879], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1091.4444444444443, 876, 4106, 946.0, 1305.5, 1447.75, 4106.0, 0.23460410557184752, 211.0971865835777, 0.11776026392961876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 261.87499999999994, 132, 1871, 148.0, 748.2000000000012, 1871.0, 1871.0, 0.08210812613860878, 0.061340543453159875, 0.02918687296333359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 12, 7.594936708860759, 258.66455696202536, 127, 2925, 137.5, 463.4999999999999, 737.849999999999, 2035.2799999999947, 0.6629713705464478, 1.530318483264169, 0.3146360371096127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 135.0, 132, 140, 134.5, 140.0, 140.0, 140.0, 0.04342445230909525, 0.03362850652452396, 0.015436035781748703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 159.64705882352945, 130, 394, 136.0, 285.9999999999999, 394.0, 394.0, 0.08369024762467385, 0.06791659743760153, 0.029749267710333285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc32a18c-e679-41e1-983b-0991a515e4a7", 3, 0, 0.0, 538.3333333333334, 270, 752, 593.0, 752.0, 752.0, 752.0, 0.06681812107443538, 0.030233459730945697, 0.042848860194218005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2987b85-d796-4bca-8671-2c5d480d5463", 3, 0, 0.0, 1103.3333333333333, 292, 2291, 727.0, 2291.0, 2291.0, 2291.0, 0.01909939964220458, 0.02633006428539596, 0.012247987400762703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 308.6666666666667, 262, 532, 264.5, 532.0, 532.0, 532.0, 0.043819289251128345, 0.06791133988431708, 0.09855060854037949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 326.2631578947368, 259, 543, 279.0, 539.0, 543.0, 543.0, 0.08892008892008893, 0.13780877062127062, 0.19998336404586403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9f3659e-dd3d-4dbc-b192-af7ca50be634", 1, 0, 0.0, 858.0, 858, 858, 858.0, 858.0, 858.0, 858.0, 1.1655011655011656, 0.2105641754079254, 0.8035584207459208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48eecb74-af47-4aee-b14f-1d27847cdea8", 1, 0, 0.0, 1114.0, 1114, 1114, 1114.0, 1114.0, 1114.0, 1114.0, 0.8976660682226212, 0.16217599865350088, 0.6188986759425493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e82d12e-1078-41d4-bd16-177c3ab824f4", 1, 0, 0.0, 1940.0, 1940, 1940, 1940.0, 1940.0, 1940.0, 1940.0, 0.5154639175257733, 0.09312580541237114, 0.3553882087628866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=752b0d7e-aeae-46e7-92fa-3fcdec03511e", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 349.83333333333337, 129, 2092, 143.5, 1585.3000000000018, 2092.0, 2092.0, 0.06214396685655102, 0.05152366002071466, 0.02209023821853962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 185.37499999999997, 130, 466, 137.0, 407.90000000000003, 466.0, 466.0, 0.08968760685437535, 0.06963051508713712, 0.03188114149901624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0424d5e-5223-47f1-9a7b-622198926673", 3, 0, 0.0, 656.3333333333334, 533, 783, 653.0, 783.0, 783.0, 783.0, 0.02800571316548576, 0.02334721074765919, 0.017959392882814763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93640754-0a0a-48fd-ac11-d1c5c8d42635", 3, 0, 0.0, 528.3333333333334, 271, 986, 328.0, 986.0, 986.0, 986.0, 0.039755635361312464, 0.033142637421979565, 0.02549433647844582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 166.37499999999997, 126, 409, 131.0, 397.8, 409.0, 409.0, 0.07956675899725991, 0.05913115585636211, 0.03993878332479649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 231.5, 126, 395, 153.5, 392.9, 395.0, 395.0, 0.07947783065261234, 0.02872727741240053, 0.04491001929821076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 281.125, 127, 879, 163.5, 546.5000000000003, 879.0, 879.0, 0.07958179765333175, 4.49559925870799, 0.04635795146505116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 234.93750000000003, 126, 1039, 132.0, 670.8000000000004, 1039.0, 1039.0, 0.07958298515777328, 1.4826119726383749, 0.04643636096852493], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 29.72972972972973, 0.873015873015873], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.31746031746031744], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.23809523809523808], "isController": false}, {"data": ["401/Unauthorized", 19, 51.351351351351354, 1.507936507936508], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 37, "401/Unauthorized", 19, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
