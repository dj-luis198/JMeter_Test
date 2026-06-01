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

    var data = {"OkPercent": 99.52830188679245, "KoPercent": 0.4716981132075472};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8108108108108109, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e63030c-c450-4a42-9dc6-fd4d6cb251e5"], "isController": false}, {"data": [0.14150943396226415, 500, 1500, "see books"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ee8222a-ef00-4ed3-884d-5e3ede4f7037"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab86ab5c-e0e0-4106-b7cb-a00df960074d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25c9b6f5-9aed-46e7-904c-aa702fb09953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e54378f7-d1f5-4eb5-9a63-e4c75b78791a"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42331faf-b9b7-45cc-abf6-6b934403dcae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db62ed83-94f9-45ad-8855-a74c73a7bb02"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40704274-cf08-438d-bc23-41fa100e9262"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9af12135-b022-4466-8839-c3bc9b18073c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ec8da82-81bf-424d-b538-b79cf660e8ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/989af541-4582-472e-b3b9-fb953988409c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31aea1b7-8cce-4e00-966c-d713c58d922b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aeca377-6876-4183-a72f-8ef218cb1107"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68b0a19b-576d-43ee-96c6-d168b7f24cbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c4f45a3-29fe-4378-9a7a-3c33799b8268"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9102ac4d-43b1-48b0-a95b-7ad04a1be2e9"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab86ab5c-e0e0-4106-b7cb-a00df960074d"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4528301886792453, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42331faf-b9b7-45cc-abf6-6b934403dcae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3dd9df49-7bb9-4c00-ab0f-fb000c544f92"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ee8222a-ef00-4ed3-884d-5e3ede4f7037"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e63030c-c450-4a42-9dc6-fd4d6cb251e5"], "isController": false}, {"data": [0.5943396226415094, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9af12135-b022-4466-8839-c3bc9b18073c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db62ed83-94f9-45ad-8855-a74c73a7bb02"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e54378f7-d1f5-4eb5-9a63-e4c75b78791a"], "isController": false}, {"data": [0.9742857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4762ee90-b9cc-459e-b8bd-46e8d52dbf18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4762ee90-b9cc-459e-b8bd-46e8d52dbf18"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40704274-cf08-438d-bc23-41fa100e9262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31aea1b7-8cce-4e00-966c-d713c58d922b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c4f45a3-29fe-4378-9a7a-3c33799b8268"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9102ac4d-43b1-48b0-a95b-7ad04a1be2e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ec8da82-81bf-424d-b538-b79cf660e8ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 6, 0.4716981132075472, 353.2334905660377, 98, 2790, 119.5, 994.4000000000001, 1187.35, 1466.5299999999993, 4.986846799518566, 697.38545989401, 3.6317323779457484], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e63030c-c450-4a42-9dc6-fd4d6cb251e5", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1675.0188679245284, 1254, 2226, 1674.0, 2022.6, 2138.1, 2226.0, 0.22969675694182606, 276.4021888299659, 1.129417159377045], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 481.07692307692304, 396, 664, 471.0, 628.0, 664.0, 664.0, 0.07308092306827445, 0.013203096452764428, 0.04967218989796779], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 481.07692307692304, 396, 664, 471.0, 628.0, 664.0, 664.0, 0.07272686586368748, 0.01313913103982635, 0.04943154164172508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 143.60000000000002, 101, 311, 102.0, 308.0, 311.0, 311.0, 0.08277232093587904, 0.05530010139609315, 0.04535233417945039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 131.33333333333334, 101, 308, 104.0, 305.0, 308.0, 308.0, 0.08277140744501219, 0.061512735415678005, 0.04154736662767213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 302.26666666666665, 100, 814, 108.0, 809.8, 814.0, 814.0, 0.08267924861098862, 6.49912721718185, 0.04679236381349766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ee8222a-ef00-4ed3-884d-5e3ede4f7037", 3, 0, 0.0, 356.3333333333333, 196, 453, 420.0, 453.0, 453.0, 453.0, 0.025478356136462075, 0.025552999757955618, 0.016338659371364025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 404.8, 100, 1215, 105.0, 1174.8, 1215.0, 1215.0, 0.08256002113536541, 19.826359075547924, 0.046644261940931055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab86ab5c-e0e0-4106-b7cb-a00df960074d", 3, 0, 0.0, 420.66666666666663, 227, 761, 274.0, 761.0, 761.0, 761.0, 0.022173932325158543, 0.026208837328336804, 0.014219611549662215], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 278.92857142857144, 185, 561, 226.5, 532.5, 561.0, 561.0, 0.07490436317915518, 0.1537065119980739, 0.04842450041464915], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/25c9b6f5-9aed-46e7-904c-aa702fb09953", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.8230307667525772, 1.5378342461340206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 115.5, 101, 300, 103.5, 164.90000000000015, 300.0, 300.0, 0.1023515263171362, 0.0760639761009186, 0.05137566848340625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 127.75, 100, 304, 103.0, 301.9, 304.0, 304.0, 0.1023521810610083, 0.03699521583516181, 0.057835479264087816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 756.0, 596, 887, 785.0, 887.0, 887.0, 887.0, 0.07521624670928921, 22.11607394697255, 0.042896765701391504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1015.3333333333334, 901, 1150, 995.0, 1150.0, 1150.0, 1150.0, 0.07472352296502939, 67.23635731387616, 0.042542787000597784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 105.66666666666667, 101, 113, 103.0, 113.0, 113.0, 113.0, 0.07672634271099743, 0.13576966112531969, 0.04248421515345269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 128.4375, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.07326913125706933, 0.054450985240849376, 0.03677766940052113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 115.1875, 99, 304, 102.5, 166.10000000000014, 304.0, 304.0, 0.07326980230891465, 0.01960539632094005, 0.04178668412930288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 140.18749999999997, 98, 314, 102.0, 306.3, 314.0, 314.0, 0.07326946678145549, 0.019748410968439177, 0.04307443261956661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 152.18750000000003, 99, 309, 102.5, 304.8, 309.0, 309.0, 0.07326913125706933, 0.019748320534131968, 0.04314578725391876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 101.66666666666667, 100, 103, 102.0, 103.0, 103.0, 103.0, 0.07672830507174097, 0.05702171890585438, 0.04308474161743268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 796.5333333333333, 102, 1218, 1088.0, 1210.8, 1218.0, 1218.0, 0.0910923798187869, 54.651573070511574, 0.048333521843952676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 176.75, 100, 1085, 103.0, 536.2000000000005, 1085.0, 1085.0, 0.10235283581325726, 5.781941931158122, 0.05962252594004683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 587.2666666666665, 101, 905, 804.0, 899.6, 905.0, 905.0, 0.0910923798187869, 17.864306893264022, 0.04842247924611946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 216.5625, 101, 793, 104.5, 527.0000000000002, 793.0, 793.0, 0.10235349057388324, 1.906821040519188, 0.05972286193153831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e54378f7-d1f5-4eb5-9a63-e4c75b78791a", 3, 0, 0.0, 650.0, 197, 1129, 624.0, 1129.0, 1129.0, 1129.0, 0.041421017024038, 0.02662972285887859, 0.026562305838982697], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 446.30769230769226, 184, 641, 430.0, 630.6, 641.0, 641.0, 0.07273459705033233, 0.013140527787413557, 0.05014709523196741], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42331faf-b9b7-45cc-abf6-6b934403dcae", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db62ed83-94f9-45ad-8855-a74c73a7bb02", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 283.25, 202, 620, 209.5, 613.0, 620.0, 620.0, 0.07323525911550116, 0.11350034786748081, 0.16470781420214764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 475.4285714285715, 153, 1038, 396.0, 1003.6000000000001, 1037.6, 1038.0, 0.09115532868007084, 0.055992872792738825, 0.041215739432492966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 102.93333333333334, 101, 106, 103.0, 106.0, 106.0, 106.0, 0.09120204292576153, 0.06777808072900833, 0.045779150452970145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 155.53333333333336, 100, 301, 104.0, 300.4, 301.0, 301.0, 0.09120426106307687, 0.1157272817786047, 0.04690844156238979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40704274-cf08-438d-bc23-41fa100e9262", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["login", 21, 0, 0.0, 2283.714285714285, 1295, 4469, 2242.0, 3769.4000000000005, 4410.099999999999, 4469.0, 0.09085756562295841, 15.655881600964388, 0.15860780114956452], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9af12135-b022-4466-8839-c3bc9b18073c", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ec8da82-81bf-424d-b538-b79cf660e8ff", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 108.0, 103, 128, 106.0, 120.30000000000001, 128.0, 128.0, 0.09806024576349094, 0.07938666380657616, 0.03485735298624092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/989af541-4582-472e-b3b9-fb953988409c", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31aea1b7-8cce-4e00-966c-d713c58d922b", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aeca377-6876-4183-a72f-8ef218cb1107", 2, 0, 0.0, 245.0, 216, 274, 245.0, 274.0, 274.0, 274.0, 0.014644826348971567, 0.02477035081681519, 0.009102960909297268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 901.2666666666668, 207, 1322, 1192.0, 1315.4, 1322.0, 1322.0, 0.09103212220152083, 72.6510713627357, 0.18920576180231466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68b0a19b-576d-43ee-96c6-d168b7f24cbc", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c4f45a3-29fe-4378-9a7a-3c33799b8268", 3, 0, 0.0, 294.3333333333333, 210, 436, 237.0, 436.0, 436.0, 436.0, 0.024810612325912206, 0.0250448270907076, 0.01591045126368719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 564.8666666666667, 204, 1456, 403.0, 1374.4, 1456.0, 1456.0, 0.08251233559417133, 26.417361016565728, 0.17994242873684616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1117.3333333333333, 1002, 1252, 1098.0, 1252.0, 1252.0, 1252.0, 0.07453601331710105, 89.17098483813263, 0.16806997534100226], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1103.5238095238099, 414, 1854, 1107.0, 1495.4, 1820.3999999999996, 1854.0, 0.0914646097292212, 0.029195176766246944, 0.04126625946767597], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9102ac4d-43b1-48b0-a95b-7ad04a1be2e9", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 376.8125, 207, 1188, 307.0, 856.2000000000003, 1188.0, 1188.0, 0.10228347866110926, 7.796524449347304, 0.22840230409517479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 137.15, 103, 338, 106.5, 302.40000000000003, 336.25, 338.0, 0.11444004486049758, 0.08884749576571833, 0.040679859696505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab86ab5c-e0e0-4106-b7cb-a00df960074d", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 435.27777777777777, 202, 1276, 398.5, 1182.4, 1276.0, 1276.0, 0.08588646763273038, 11.534992473005406, 0.19071902778904373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 121.39999999999999, 100, 297, 103.0, 277.70000000000005, 297.0, 297.0, 0.06534282111095864, 0.048560436392030795, 0.032799033252961664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 141.20000000000002, 98, 303, 102.0, 302.4, 303.0, 303.0, 0.0653411132818881, 0.017483852577380214, 0.037264853668576806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 162.79999999999998, 101, 303, 103.5, 303.0, 303.0, 303.0, 0.06525583550308986, 0.01758848691294219, 0.03836329391880869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 102.3, 99, 110, 101.5, 109.4, 110.0, 110.0, 0.06534239414532148, 0.01761181717198118, 0.038477991864871934], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1143.1886792452829, 790, 1794, 1033.0, 1559.8000000000002, 1719.1999999999998, 1794.0, 0.23297829785176424, 278.72304059207255, 0.46004113110963607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1103.5238095238099, 414, 1854, 1107.0, 1495.4, 1820.3999999999996, 1854.0, 0.09146700001306672, 0.029195939736313705, 0.04126733789652033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 100.5, 100, 102, 100.0, 102.0, 102.0, 102.0, 0.03294024639304302, 0.008878425785624876, 0.019397430249028264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 151.0, 99, 303, 101.0, 303.0, 303.0, 303.0, 0.032885271509022894, 0.008863608336416327, 0.019332942820734163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 186.44999999999996, 99, 1008, 102.5, 301.7, 972.6999999999995, 1008.0, 0.11349642769993815, 5.135275549819257, 0.06623580585301077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 177.25, 98, 814, 102.0, 305.9, 788.5999999999997, 814.0, 0.11362474292401914, 1.6995665038518788, 0.06642165147882603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 132.6, 100, 305, 104.0, 296.9, 304.6, 305.0, 0.11362280636969452, 0.08444038637435307, 0.057033322728538074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 101.25, 99, 103, 101.5, 103.0, 103.0, 103.0, 0.03294024639304302, 0.008814089366888465, 0.018786234271032348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 160.65, 98, 305, 102.0, 304.8, 305.0, 305.0, 0.11349320743153522, 0.03889137352316964, 0.06425001205865329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 101.5, 100, 104, 101.0, 104.0, 104.0, 104.0, 0.03293997513031877, 0.024479805736496666, 0.01653432345408579], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 470.5, 395, 761, 423.0, 719.9000000000001, 761.0, 761.0, 0.07587541257255585, 0.013707960279221519, 0.05164566656549945], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 105.25, 102, 107, 106.0, 107.0, 107.0, 107.0, 0.03452502200970153, 0.027174968495917416, 0.01227256641751109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1251.5238095238096, 807, 2579, 1149.0, 2353.2000000000007, 2575.1, 2579.0, 0.09004566601633686, 0.04660566698111185, 0.04141748895868619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42331faf-b9b7-45cc-abf6-6b934403dcae", 3, 0, 0.0, 272.6666666666667, 202, 401, 215.0, 401.0, 401.0, 401.0, 0.0283171139197493, 0.023606812743645168, 0.0181590867258809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 254.25, 202, 404, 205.5, 404.0, 404.0, 404.0, 0.032857987776828544, 0.05092346347834659, 0.07389838461917592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dd9df49-7bb9-4c00-ab0f-fb000c544f92", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["addBook", 61, 3, 4.918032786885246, 1089.4590163934427, 528, 2613, 886.0, 1822.6000000000001, 1889.8999999999999, 2613.0, 0.269974817103126, 96.33532525050123, 0.9798559299857931], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ee8222a-ef00-4ed3-884d-5e3ede4f7037", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 181.86792452830187, 99, 493, 104.0, 405.2, 421.19999999999993, 493.0, 0.23401004918626317, 0.17390785881908816, 0.11312009213593777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e63030c-c450-4a42-9dc6-fd4d6cb251e5", 3, 0, 0.0, 323.3333333333333, 276, 397, 297.0, 397.0, 397.0, 397.0, 0.01725099624503315, 0.023781890982329232, 0.011062650586821389], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 633.6981132075474, 488, 923, 602.0, 808.6, 902.3, 923.0, 0.233968727651572, 68.79457442247248, 0.11766981908257772], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 170.7735849056604, 100, 418, 105.0, 310.6, 407.6, 418.0, 0.23438363736871198, 0.41474917081260365, 0.11398735489220564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9af12135-b022-4466-8839-c3bc9b18073c", 3, 0, 0.0, 1134.0, 194, 2790, 418.0, 2790.0, 2790.0, 2790.0, 0.04317230065190174, 0.02775562948812042, 0.027685362071694797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db62ed83-94f9-45ad-8855-a74c73a7bb02", 3, 0, 0.0, 293.6666666666667, 202, 412, 267.0, 412.0, 412.0, 412.0, 0.0241196333815726, 0.024190296369995177, 0.015467343021386075], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 957.2264150943397, 687, 1329, 913.0, 1218.0, 1299.3, 1329.0, 0.23345549369229684, 210.0636635953137, 0.11718371460726619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 105.16666666666667, 101, 112, 106.0, 110.2, 112.0, 112.0, 0.0851059805863802, 0.06358015151228599, 0.030252516536564838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e54378f7-d1f5-4eb5-9a63-e4c75b78791a", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, 1.7142857142857142, 169.87428571428572, 99, 1133, 108.0, 306.0, 349.2, 712.720000000005, 0.6998320403103255, 1.4559435422998481, 0.34005901083739903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 125.7, 103, 299, 106.0, 280.4000000000001, 299.0, 299.0, 0.06257234927885368, 0.04845690720520602, 0.022242514782717517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4762ee90-b9cc-459e-b8bd-46e8d52dbf18", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 122.00000000000001, 102, 306, 107.0, 196.20000000000005, 306.0, 306.0, 0.08662458636760009, 0.07029788210105047, 0.030792333435357845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4762ee90-b9cc-459e-b8bd-46e8d52dbf18", 3, 0, 0.0, 452.3333333333333, 345, 508, 504.0, 508.0, 508.0, 508.0, 0.04490614615453702, 0.0374364063482322, 0.028797235652486305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 285.2, 202, 600, 207.5, 580.8000000000001, 600.0, 600.0, 0.06521328003234578, 0.10106784708137966, 0.14666619522899643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 361.2499999999999, 201, 1313, 211.0, 602.8, 1277.4999999999995, 1313.0, 0.11342691053452432, 6.951901008436127, 0.25364871331348365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40704274-cf08-438d-bc23-41fa100e9262", 3, 0, 0.0, 393.0, 246, 505, 428.0, 505.0, 505.0, 505.0, 0.0887154009936125, 0.04112328483558079, 0.05689106118405488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31aea1b7-8cce-4e00-966c-d713c58d922b", 3, 0, 0.0, 267.0, 185, 413, 203.0, 413.0, 413.0, 413.0, 0.06189778612251635, 0.028007136298925043, 0.03969356727257722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c4f45a3-29fe-4378-9a7a-3c33799b8268", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 121.25, 101, 297, 105.5, 211.60000000000008, 297.0, 297.0, 0.07397851848769413, 0.06133570526958235, 0.026297051493672525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 108.13333333333334, 102, 133, 105.0, 122.80000000000001, 133.0, 133.0, 0.09303710319675486, 0.07223095414201183, 0.03307178277697145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9102ac4d-43b1-48b0-a95b-7ad04a1be2e9", 3, 0, 0.0, 388.6666666666667, 210, 561, 395.0, 561.0, 561.0, 561.0, 0.041314347095601396, 0.026561144372985925, 0.02649390096951001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ec8da82-81bf-424d-b538-b79cf660e8ff", 2, 0, 0.0, 299.5, 191, 408, 299.5, 408.0, 408.0, 408.0, 0.04893804443574435, 0.04210392299598708, 0.03041900906577273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 124.66666666666664, 99, 306, 103.0, 299.7, 306.0, 306.0, 0.08592910848549945, 0.063859425349087, 0.04313238453276047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 124.22222222222221, 99, 305, 102.0, 305.0, 305.0, 305.0, 0.08593074936387375, 0.037333628521370496, 0.048205509354516854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 269.5555555555556, 100, 1173, 103.5, 1082.1000000000001, 1173.0, 1173.0, 0.08593033913840513, 8.611728611103155, 0.049697125391460435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 261.44444444444446, 98, 805, 200.0, 791.5, 805.0, 805.0, 0.08592951869921804, 2.8279352389795394, 0.0497805664426134], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 50.0, 0.2358490566037736], "isController": false}, {"data": ["401/Unauthorized", 3, 50.0, 0.2358490566037736], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 6, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
