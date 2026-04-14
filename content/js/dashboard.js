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

    var data = {"OkPercent": 98.544061302682, "KoPercent": 1.4559386973180077};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7490170380078637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b27b4e0f-e854-43b6-b607-39d916c00e89"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18073083-f9ea-4cb5-9586-1fe4acb3c47d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e76594e-f33f-4c7c-8772-f1b9028b6d20"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ffa9630-5ff6-4d1a-97c5-44cb8a4adaa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/673a9399-1b9e-4361-b280-40a9c62f6ff5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9f4fc03-b4e8-4982-8531-033ea5c5dc48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df4a6004-b3d7-43fe-98f5-fd54edf5e114"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9f4fc03-b4e8-4982-8531-033ea5c5dc48"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66327d1c-5dd5-4ad4-869f-912477c1d684"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6013c10e-5925-4678-892c-c16bea1f7cbf"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4a8e14de-6834-441f-bd41-93821f47faa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f23f6b2-ad61-4c33-952b-387d51dd8b65"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd404977-c278-4fc3-b768-fddfb3d252a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bc5711a-fbd5-46a8-ab18-a06ec870643d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6566c42e-34c0-4875-a47e-ac58e3e82ada"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b0bb92e-fa3a-4b84-a37c-7243bb84cc0f"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=673a9399-1b9e-4361-b280-40a9c62f6ff5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ffa9630-5ff6-4d1a-97c5-44cb8a4adaa6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5c5aab8-9b05-4171-b3b4-4b1a56de1b3d"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18073083-f9ea-4cb5-9586-1fe4acb3c47d"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b27b4e0f-e854-43b6-b607-39d916c00e89"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e76594e-f33f-4c7c-8772-f1b9028b6d20"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df4a6004-b3d7-43fe-98f5-fd54edf5e114"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe1ae0dc-f4a2-4a97-b50e-f345a302a15e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a8e14de-6834-441f-bd41-93821f47faa6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8bc5711a-fbd5-46a8-ab18-a06ec870643d"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66327d1c-5dd5-4ad4-869f-912477c1d684"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f23f6b2-ad61-4c33-952b-387d51dd8b65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5c5aab8-9b05-4171-b3b4-4b1a56de1b3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6013c10e-5925-4678-892c-c16bea1f7cbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd404977-c278-4fc3-b768-fddfb3d252a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b0bb92e-fa3a-4b84-a37c-7243bb84cc0f"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 19, 1.4559386973180077, 442.80076628352475, 116, 3367, 149.0, 1217.4, 1500.7, 1977.840000000002, 5.046520800946658, 734.2195167666304, 3.681344628307308], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2080.0000000000005, 1545, 2692, 2024.0, 2535.6, 2624.2999999999997, 2692.0, 0.24890326996670917, 299.51335990385, 1.2238554338695125], "isController": true}, {"data": ["deleteBook", 15, 0, 0.0, 668.8000000000001, 439, 1695, 508.0, 1299.0000000000002, 1695.0, 1695.0, 0.08532811504505325, 0.01541572390950669, 0.057996453194684626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 668.8000000000001, 439, 1695, 508.0, 1299.0000000000002, 1695.0, 1695.0, 0.08451989880150784, 0.015269708279569286, 0.05744711871664985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 189.2941176470588, 122, 405, 131.0, 400.2, 405.0, 405.0, 0.0974765052952678, 0.026082580518460328, 0.05559206942620742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 131.41176470588235, 118, 153, 129.0, 146.6, 153.0, 153.0, 0.09747426965970013, 0.07243937422952323, 0.048927514262779165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 140.41176470588235, 118, 364, 127.0, 179.99999999999983, 364.0, 364.0, 0.09748433082741259, 0.02627507354332605, 0.057405323719658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 176.4705882352941, 119, 491, 128.0, 390.9999999999999, 491.0, 491.0, 0.09748209483287555, 0.026274470872923488, 0.057308809657608484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b27b4e0f-e854-43b6-b607-39d916c00e89", 3, 0, 0.0, 380.6666666666667, 248, 594, 300.0, 594.0, 594.0, 594.0, 0.017910875483593637, 0.02469158778418589, 0.011485815332903472], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 281.2, 201, 691, 232.0, 502.60000000000014, 691.0, 691.0, 0.08522339893641198, 0.15512212157970093, 0.055095595796781964], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/18073083-f9ea-4cb5-9586-1fe4acb3c47d", 3, 0, 0.0, 642.6666666666666, 452, 785, 691.0, 785.0, 785.0, 785.0, 0.024788471708090957, 0.024861094183798255, 0.015896253015930725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 166.57142857142856, 120, 401, 128.0, 395.0, 401.0, 401.0, 0.07782793355718129, 0.05783892327833493, 0.03906597446131952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 208.78571428571425, 118, 505, 134.0, 447.0, 505.0, 505.0, 0.07766817934692156, 0.04577958394820642, 0.042897366355254256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 777.1428571428571, 592, 1018, 784.0, 1018.0, 1018.0, 1018.0, 0.05858917272088118, 17.227162123564565, 0.03341413756737755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1350.4285714285713, 1132, 1588, 1343.0, 1588.0, 1588.0, 1588.0, 0.05811202337763683, 52.289300785238716, 0.03308526330972879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 298.42857142857144, 123, 372, 363.0, 372.0, 372.0, 372.0, 0.058709071390230815, 0.10388753648349436, 0.03250785495923913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e76594e-f33f-4c7c-8772-f1b9028b6d20", 3, 0, 0.0, 712.3333333333334, 215, 1492, 430.0, 1492.0, 1492.0, 1492.0, 0.05413989749512741, 0.024496893723381218, 0.03471861916191439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ffa9630-5ff6-4d1a-97c5-44cb8a4adaa6", 3, 0, 0.0, 579.6666666666666, 224, 1098, 417.0, 1098.0, 1098.0, 1098.0, 0.03984381225595665, 0.032827047141870534, 0.025550882208409703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 127.99999999999999, 123, 137, 128.0, 137.0, 137.0, 137.0, 0.04507956543298923, 0.033501512982914844, 0.02262782874273092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 124.625, 116, 133, 124.0, 133.0, 133.0, 133.0, 0.0450833760686169, 0.01206332523711038, 0.025711612914133073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 188.625, 122, 400, 126.5, 400.0, 400.0, 400.0, 0.045011337230564955, 0.012131961987925708, 0.026461743176562597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 159.37499999999997, 121, 398, 125.0, 398.0, 398.0, 398.0, 0.0450818517370601, 0.012150967851004479, 0.026547223239694568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/673a9399-1b9e-4361-b280-40a9c62f6ff5", 3, 0, 0.0, 464.33333333333337, 241, 775, 377.0, 775.0, 775.0, 775.0, 0.029156502385973778, 0.029241921826557687, 0.018697366438921986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9f4fc03-b4e8-4982-8531-033ea5c5dc48", 3, 0, 0.0, 328.0, 227, 417, 340.0, 417.0, 417.0, 417.0, 0.03293084522502744, 0.027131500411635565, 0.02111776207464325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 129.0, 120, 134, 130.0, 134.0, 134.0, 134.0, 0.05882451805912704, 0.043716267815425466, 0.033031345589841846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df4a6004-b3d7-43fe-98f5-fd54edf5e114", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 851.9999999999999, 119, 1702, 1210.0, 1662.0, 1702.0, 1702.0, 0.08878670629357559, 42.05893268741004, 0.04818102616404045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 394.9285714285715, 124, 1406, 135.0, 1366.0, 1406.0, 1406.0, 0.07783052958116056, 15.023349810357576, 0.04432257557900355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 610.3684210526314, 121, 1133, 608.0, 1106.0, 1133.0, 1133.0, 0.08879251525829275, 13.752361471992971, 0.048270889899617725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 310.92857142857144, 121, 968, 130.5, 960.0, 968.0, 968.0, 0.07783139496097312, 4.920414358363539, 0.0443990756132002], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 505.1333333333334, 218, 1073, 462.0, 975.8000000000001, 1073.0, 1073.0, 0.08473906018732981, 0.015309302865875014, 0.05842360985571762], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 325.87500000000006, 256, 524, 260.0, 524.0, 524.0, 524.0, 0.0449781855799937, 0.06970740284711914, 0.10115699354563036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9f4fc03-b4e8-4982-8531-033ea5c5dc48", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66327d1c-5dd5-4ad4-869f-912477c1d684", 3, 0, 0.0, 403.0, 239, 578, 392.0, 578.0, 578.0, 578.0, 0.07208765859284891, 0.032617788230488276, 0.04622808835544021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 685.1666666666665, 174, 1750, 601.5, 1391.0, 1688.75, 1750.0, 0.10191948360794972, 0.06260483905214881, 0.046082735264141333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 143.68421052631575, 121, 400, 130.0, 139.0, 400.0, 400.0, 0.08878629139660836, 0.06598278100861227, 0.04456655642368818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 154.10526315789474, 120, 370, 130.0, 360.0, 370.0, 370.0, 0.0887941751021133, 0.09395132034601687, 0.04671552098813896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6013c10e-5925-4678-892c-c16bea1f7cbf", 3, 0, 0.0, 303.0, 238, 411, 260.0, 411.0, 411.0, 411.0, 0.07944915254237288, 0.03594867253707627, 0.05094883805614407], "isController": false}, {"data": ["login", 24, 0, 0.0, 2842.083333333333, 1749, 4236, 2844.0, 4017.5, 4226.0, 4236.0, 0.10333113754666047, 36.19614991276053, 0.20588022790974025], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a8e14de-6834-441f-bd41-93821f47faa6", 3, 0, 0.0, 487.3333333333333, 232, 727, 503.0, 727.0, 727.0, 727.0, 0.024979599993338774, 0.025052782415194257, 0.01601881900614498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 134.78571428571428, 121, 149, 135.5, 145.0, 149.0, 149.0, 0.07570554867596403, 0.06128896469958416, 0.02691095675590909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f23f6b2-ad61-4c33-952b-387d51dd8b65", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd404977-c278-4fc3-b768-fddfb3d252a4", 3, 0, 0.0, 425.3333333333333, 294, 592, 390.0, 592.0, 592.0, 592.0, 0.05550827073233912, 0.03568646962772453, 0.03559612413499612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bc5711a-fbd5-46a8-ab18-a06ec870643d", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6566c42e-34c0-4875-a47e-ac58e3e82ada", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 998.8421052631579, 257, 1842, 1333.0, 1803.0, 1842.0, 1842.0, 0.0887282440680499, 55.933466914580386, 0.1876035041235284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b0bb92e-fa3a-4b84-a37c-7243bb84cc0f", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 372.29411764705884, 243, 621, 271.0, 565.0, 621.0, 621.0, 0.09739999312470636, 0.1509509659071377, 0.21905486734980348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 0, 0.0, 1480.0, 1253, 1712, 1476.0, 1712.0, 1712.0, 1712.0, 0.05804937513994046, 69.44723389544478, 0.13089453827941652], "isController": false}, {"data": ["register", 25, 7, 28.0, 1125.4400000000003, 175, 3367, 1076.0, 1850.4000000000005, 2958.999999999999, 3367.0, 0.1052941919723708, 0.03310186160131407, 0.04750577801878448], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 152.6153846153846, 126, 396, 133.0, 293.19999999999993, 396.0, 396.0, 0.05740299996909069, 0.04456580564006553, 0.020404972645262708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 609.1428571428572, 250, 1795, 272.5, 1761.5, 1795.0, 1795.0, 0.0776100538281159, 19.99063590525198, 0.17029170293088824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 554.75, 251, 1767, 389.5, 1608.1000000000001, 1767.0, 1767.0, 0.10925827289985113, 16.487022699259775, 0.24223007231531937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=673a9399-1b9e-4361-b280-40a9c62f6ff5", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 149.2857142857143, 123, 368, 133.5, 257.5, 368.0, 368.0, 0.08063076293979762, 0.05992188534881444, 0.0404728634287656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 145.7857142857143, 120, 374, 129.0, 254.0, 374.0, 374.0, 0.08063540700721687, 0.02157627101560295, 0.045987380558803366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 145.7857142857143, 119, 400, 126.5, 268.0, 400.0, 400.0, 0.08063540700721687, 0.02173376204491392, 0.0474047998226021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 183.28571428571428, 122, 406, 127.5, 401.5, 406.0, 406.0, 0.08050557501106952, 0.02169876826470233, 0.04740709153483878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ffa9630-5ff6-4d1a-97c5-44cb8a4adaa6", 1, 0, 0.0, 1073.0, 1073, 1073, 1073.0, 1073.0, 1073.0, 1073.0, 0.9319664492078285, 0.16837284482758622, 0.6425471808014912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5c5aab8-9b05-4171-b3b4-4b1a56de1b3d", 3, 0, 0.0, 395.66666666666663, 201, 775, 211.0, 775.0, 775.0, 775.0, 0.07734151434685091, 0.03499502114001392, 0.04959726017685426], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1441.2321428571424, 976, 2141, 1328.0, 2002.6000000000001, 2087.15, 2141.0, 0.25413075935178503, 304.0287383315408, 0.5018089798919037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1125.4400000000003, 175, 3367, 1076.0, 1850.4000000000005, 2958.999999999999, 3367.0, 0.09909270717312288, 0.03115226981755051, 0.0447078424941238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 154.36363636363635, 125, 398, 132.0, 345.4000000000002, 398.0, 398.0, 0.05710192173922072, 0.015390752343774333, 0.03362544805542001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 180.54545454545453, 121, 453, 127.0, 442.20000000000005, 453.0, 453.0, 0.05701579337476481, 0.015367538058042078, 0.03351905040196134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18073083-f9ea-4cb5-9586-1fe4acb3c47d", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 277.7692307692308, 123, 1227, 134.0, 931.7999999999997, 1227.0, 1227.0, 0.059411189412012025, 4.126957748647253, 0.03453453903772154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 203.46153846153848, 116, 852, 132.0, 670.3999999999999, 852.0, 852.0, 0.059412003966893806, 1.358558656214724, 0.03459303205734629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 129.92307692307693, 120, 141, 129.0, 139.0, 141.0, 141.0, 0.05940928887081222, 0.04415084846746885, 0.029820678202731914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 154.18181818181816, 122, 406, 130.0, 351.6000000000002, 406.0, 406.0, 0.057101328903654484, 0.015279066523048173, 0.03256560164036545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 205.53846153846152, 121, 386, 132.0, 382.8, 386.0, 386.0, 0.059408745881374445, 0.022760261718375124, 0.03349774989374974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 152.54545454545453, 122, 381, 132.0, 331.8000000000002, 381.0, 381.0, 0.05710429320458911, 0.04243785852411359, 0.028663678424959767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 136.63636363636363, 124, 147, 137.0, 146.4, 147.0, 147.0, 0.05815890069103348, 0.04577741597360643, 0.02067367173001581], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 605.2666666666667, 390, 1503, 549.0, 1066.2000000000003, 1503.0, 1503.0, 0.08430992327796982, 0.015231773248461344, 0.05738673488744626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b27b4e0f-e854-43b6-b607-39d916c00e89", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1398.6666666666665, 722, 2318, 1275.5, 2234.0, 2300.5, 2318.0, 0.10170612016578098, 0.05264086297642961, 0.046780842380940275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 363.1818181818182, 256, 780, 266.0, 741.6000000000001, 780.0, 780.0, 0.05697887637655785, 0.08830612969687238, 0.1281468284132937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e76594e-f33f-4c7c-8772-f1b9028b6d20", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["addBook", 56, 12, 21.428571428571427, 1299.8928571428569, 636, 2466, 1086.0, 2266.1000000000004, 2451.55, 2466.0, 0.24565389997499593, 84.959335334846, 0.8901483944214632], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 237.1607142857143, 125, 540, 136.0, 514.1, 524.1, 540.0, 0.2553754246756504, 0.1897858380646191, 0.12344808126410835], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 812.4285714285713, 595, 1318, 758.0, 1059.6, 1166.8999999999999, 1318.0, 0.2552892746593484, 75.0635231515461, 0.12839255512652775], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 193.03571428571433, 119, 407, 134.0, 379.3, 392.6, 407.0, 0.2558444465764815, 0.4527247433560395, 0.12442434999520291], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1202.6964285714284, 849, 1621, 1189.0, 1548.8000000000002, 1585.95, 1621.0, 0.25475504847169717, 229.22904042644177, 0.1278750926898949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 167.12500000000003, 122, 373, 136.5, 363.90000000000003, 373.0, 373.0, 0.10963184256867407, 0.08190269488773014, 0.038970694038083356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, 7.142857142857143, 191.15476190476187, 118, 663, 136.5, 379.2, 457.04999999999984, 603.6600000000002, 0.6966993866557186, 1.5772162518091375, 0.33211394741371086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 176.21428571428572, 130, 403, 141.5, 387.0, 403.0, 403.0, 0.08653673793585155, 0.06701526678040066, 0.03076110606313473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df4a6004-b3d7-43fe-98f5-fd54edf5e114", 3, 0, 0.0, 329.3333333333333, 218, 549, 221.0, 549.0, 549.0, 549.0, 0.061548561815272254, 0.02724806122030282, 0.03946961809117394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe1ae0dc-f4a2-4a97-b50e-f345a302a15e", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.41176470588235, 120, 406, 136.0, 205.19999999999982, 406.0, 406.0, 0.09504534221914102, 0.0771315228360412, 0.033785648991960286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a8e14de-6834-441f-bd41-93821f47faa6", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bc5711a-fbd5-46a8-ab18-a06ec870643d", 3, 0, 0.0, 721.0, 282, 1503, 378.0, 1503.0, 1503.0, 1503.0, 0.027087302375556416, 0.02258156946087239, 0.017370438046824917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 339.6428571428571, 251, 766, 269.0, 653.5, 766.0, 766.0, 0.08044220227766351, 0.12466970216274606, 0.18091639828658107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66327d1c-5dd5-4ad4-869f-912477c1d684", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 0.19831400933040613, 0.7568091383095499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 431.9230769230769, 253, 1354, 264.0, 1061.5999999999997, 1354.0, 1354.0, 0.05937320167706459, 5.548861005051289, 0.1323631690332216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f23f6b2-ad61-4c33-952b-387d51dd8b65", 3, 0, 0.0, 372.0, 224, 454, 438.0, 454.0, 454.0, 454.0, 0.027073368829528023, 0.027152685339770777, 0.017361502797581446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5c5aab8-9b05-4171-b3b4-4b1a56de1b3d", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.5681259827044025, 2.168091588050314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6013c10e-5925-4678-892c-c16bea1f7cbf", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 137.625, 129, 162, 134.5, 162.0, 162.0, 162.0, 0.044873484818739165, 0.03720467637803667, 0.015951121556661188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 136.57894736842107, 125, 159, 135.0, 159.0, 159.0, 159.0, 0.0890321734159302, 0.069121658071938, 0.03164815539394394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd404977-c278-4fc3-b768-fddfb3d252a4", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 159.56250000000003, 118, 363, 132.5, 359.5, 363.0, 363.0, 0.10935759249260128, 0.08127063270202106, 0.05489238529413775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 207.99999999999997, 118, 400, 134.0, 397.9, 400.0, 400.0, 0.10936132983377078, 0.04979464847167542, 0.061222053053915135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 354.75000000000006, 119, 1637, 127.5, 1317.8000000000004, 1637.0, 1637.0, 0.10935908739841566, 12.32597861431784, 0.06311642641842154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 269.49999999999994, 116, 1059, 131.5, 823.8000000000002, 1059.0, 1059.0, 0.10935086592216953, 4.0448874625815, 0.06321846936125425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b0bb92e-fa3a-4b84-a37c-7243bb84cc0f", 3, 0, 0.0, 355.33333333333337, 212, 623, 231.0, 623.0, 623.0, 623.0, 0.037233778483840546, 0.03104026910713399, 0.023877130082410762], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5363984674329502], "isController": false}, {"data": ["401/Unauthorized", 12, 63.1578947368421, 0.9195402298850575], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 19, "401/Unauthorized", 12, "406/Not Acceptable", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
