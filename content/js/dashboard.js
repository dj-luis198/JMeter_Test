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

    var data = {"OkPercent": 98.65824782951854, "KoPercent": 1.3417521704814523};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7261016949152542, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/235511ea-54d6-46d5-8116-ae5586859e16"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1394270a-fccc-42c9-b81e-b96b932b4283"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7073f3a6-27da-416d-a042-a15ae9e972f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3b761ec-030d-453e-8bbd-9d66bea56f1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1504396-f39e-4596-97a1-e5e8435141c0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ece0dfdb-eb6c-49b0-8f7e-dd918fd1c7b2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7ba41d2-b1d4-4bda-918f-ba68e470c15a"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/480a9332-7068-4784-8989-0da695b188f3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/534cae69-e2ec-44ee-82f3-86b049e72c81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b165e61-df0a-41b7-bbdf-2f2fb999f1f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bcef6e59-0698-4446-a7ed-33667406e210"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1becbef-d498-461d-8438-2f838e15c1c8"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3af6e7f-7dcd-4cf7-8bd6-ac24dcc3f293"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dfe676c-2fe8-4afe-96af-0e7e3d0df544"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.18269230769230768, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7073f3a6-27da-416d-a042-a15ae9e972f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1394270a-fccc-42c9-b81e-b96b932b4283"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1498dcf6-7698-4d0a-ba53-281a71e2c1ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3b761ec-030d-453e-8bbd-9d66bea56f1e"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2980769230769231, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ece0dfdb-eb6c-49b0-8f7e-dd918fd1c7b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9396551724137931, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=480a9332-7068-4784-8989-0da695b188f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=534cae69-e2ec-44ee-82f3-86b049e72c81"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7ba41d2-b1d4-4bda-918f-ba68e470c15a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b165e61-df0a-41b7-bbdf-2f2fb999f1f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcef6e59-0698-4446-a7ed-33667406e210"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3dfe676c-2fe8-4afe-96af-0e7e3d0df544"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1becbef-d498-461d-8438-2f838e15c1c8"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3af6e7f-7dcd-4cf7-8bd6-ac24dcc3f293"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1267, 17, 1.3417521704814523, 516.2004735595904, 145, 5276, 169.0, 1459.0, 1758.1999999999998, 2319.5999999999995, 5.042284349815938, 688.8547625858123, 3.685135496468013], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2490.307692307693, 1908, 3177, 2510.5, 2979.9, 3163.95, 3177.0, 0.24110574805376658, 290.13272824339396, 1.1855150795417135], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 706.0769230769231, 160, 1108, 672.0, 1074.0, 1108.0, 1108.0, 0.06667966065181934, 0.012632670084426709, 0.04507589139165581], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 706.0769230769231, 160, 1108, 672.0, 1074.0, 1108.0, 1108.0, 0.0668906646359347, 0.012672645448604814, 0.045218531479775864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 184.83333333333334, 146, 453, 150.5, 444.0, 453.0, 453.0, 0.09838216003498032, 0.026324913915609968, 0.05610857564494971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/235511ea-54d6-46d5-8116-ae5586859e16", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1394270a-fccc-42c9-b81e-b96b932b4283", 1, 0, 0.0, 1528.0, 1528, 1528, 1528.0, 1528.0, 1528.0, 1528.0, 0.6544502617801048, 0.11823564299738219, 0.45121277814136124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 152.3888888888889, 147, 160, 151.5, 159.1, 160.0, 160.0, 0.09837893379097756, 0.0731116881005214, 0.04938161325054928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 209.16666666666669, 147, 588, 149.0, 475.50000000000017, 588.0, 588.0, 0.09838269776288677, 0.026517211506403075, 0.05793434253029367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 252.00000000000006, 145, 468, 154.5, 464.4, 468.0, 468.0, 0.09838431098187542, 0.02651764631933361, 0.05783921407332911], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 299.00000000000006, 154, 464, 262.0, 461.0, 464.0, 464.0, 0.06784490654364123, 0.13527808688267193, 0.04385120703357838], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 190.8125, 148, 470, 152.5, 449.70000000000005, 470.0, 470.0, 0.12982797792924375, 0.09648348750405712, 0.06516755923401493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7073f3a6-27da-416d-a042-a15ae9e972f2", 3, 0, 0.0, 719.0, 260, 1553, 344.0, 1553.0, 1553.0, 1553.0, 0.020423168041826645, 0.02413949321610435, 0.01309688836015576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 187.81249999999997, 147, 460, 149.0, 444.6, 460.0, 460.0, 0.12982903139428267, 0.059114048718344026, 0.0726801682097388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1072.4, 875, 1223, 1174.0, 1223.0, 1223.0, 1223.0, 0.15408320493066258, 45.3055782935285, 0.08787557781201848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1605.8, 1314, 1860, 1721.0, 1860.0, 1860.0, 1860.0, 0.1499970000599988, 134.96756432058856, 0.08539868265134697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 267.4, 148, 444, 155.0, 444.0, 444.0, 444.0, 0.1576093809103518, 0.27889472481402094, 0.08727003806266549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 184.6842105263158, 147, 468, 152.0, 443.0, 468.0, 468.0, 0.10874168698419238, 0.08081291386227579, 0.0545832295994872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 182.89473684210526, 146, 461, 149.0, 457.0, 461.0, 461.0, 0.10873795297941992, 0.029095897574571344, 0.06201461380857542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3b761ec-030d-453e-8bbd-9d66bea56f1e", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 200.0, 147, 469, 153.0, 461.0, 469.0, 469.0, 0.10874230934325368, 0.029309450565173846, 0.06392858420374875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 165.99999999999994, 146, 441, 150.0, 156.0, 441.0, 441.0, 0.1087441764631815, 0.02930995381234189, 0.06403587735087739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 271.8, 146, 457, 166.0, 457.0, 457.0, 457.0, 0.15609390609390608, 0.11600338138424077, 0.08765038672265235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1059.6470588235293, 147, 1878, 1410.0, 1838.8, 1878.0, 1878.0, 0.09341942574529469, 49.45681712803957, 0.05019791523560929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 372.43749999999994, 147, 1614, 149.5, 1609.1, 1614.0, 1614.0, 0.1294906969027444, 14.595033652406503, 0.07473535338820501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 724.7058823529412, 147, 1387, 880.0, 1331.8, 1387.0, 1387.0, 0.09342301943198804, 16.168879967906445, 0.05029107968159237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 370.75, 147, 1175, 299.0, 967.1000000000003, 1175.0, 1175.0, 0.12952109574847004, 4.790984066881456, 0.07487938347958424], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 827.3076923076923, 161, 2537, 512.0, 2133.3999999999996, 2537.0, 2537.0, 0.06698579385894853, 0.012690667977183608, 0.04581622994934843], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b1504396-f39e-4596-97a1-e5e8435141c0", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ece0dfdb-eb6c-49b0-8f7e-dd918fd1c7b2", 1, 0, 0.0, 636.0, 636, 636, 636.0, 636.0, 636.0, 636.0, 1.5723270440251573, 0.28406299135220126, 1.084045794025157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 388.1578947368421, 299, 926, 312.0, 904.0, 926.0, 926.0, 0.10864406488909728, 0.16837708103417712, 0.2443430482808506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7ba41d2-b1d4-4bda-918f-ba68e470c15a", 1, 0, 0.0, 1277.0, 1277, 1277, 1277.0, 1277.0, 1277.0, 1277.0, 0.7830853563038371, 0.1414753817541112, 0.539900646045419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 727.65, 178, 2143, 601.5, 1616.5, 2116.7999999999997, 2143.0, 0.09568462348100659, 0.058775027509329246, 0.043263652999712944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 153.0, 149, 160, 153.0, 160.0, 160.0, 160.0, 0.09342045248470927, 0.06942672298912475, 0.04689268806361383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 280.7647058823529, 148, 592, 156.0, 478.3999999999999, 592.0, 592.0, 0.09342455966806804, 0.1075391387079933, 0.0486657805072404], "isController": false}, {"data": ["login", 20, 0, 0.0, 3680.8999999999996, 1873, 7174, 3234.0, 7066.0, 7169.3, 7174.0, 0.09538617091294103, 28.659562173004282, 0.18346002305960682], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 160.0, 149, 181, 158.5, 174.0, 181.0, 181.0, 0.12815378454144974, 0.10374949939927915, 0.045554665598718465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/480a9332-7068-4784-8989-0da695b188f3", 3, 0, 0.0, 1014.3333333333333, 261, 1940, 842.0, 1940.0, 1940.0, 1940.0, 0.02408825938237703, 0.024158830454786336, 0.015447223627370686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/534cae69-e2ec-44ee-82f3-86b049e72c81", 3, 0, 0.0, 373.3333333333333, 270, 517, 333.0, 517.0, 517.0, 517.0, 0.030650088374421482, 0.02555171755432728, 0.019655167349482524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b165e61-df0a-41b7-bbdf-2f2fb999f1f0", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcef6e59-0698-4446-a7ed-33667406e210", 3, 0, 0.0, 1164.6666666666667, 457, 2412, 625.0, 2412.0, 2412.0, 2412.0, 0.024897092019652102, 0.02497003271892843, 0.01596590861937326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1216.4117647058824, 299, 2032, 1571.0, 1996.0, 2032.0, 2032.0, 0.09333940954587631, 65.74567314357523, 0.1958744238350418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1becbef-d498-461d-8438-2f838e15c1c8", 1, 0, 0.0, 1101.0, 1101, 1101, 1101.0, 1101.0, 1101.0, 1101.0, 0.9082652134423251, 0.16409088328792007, 0.6262062897366031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 449.8888888888889, 296, 737, 322.0, 632.6000000000001, 737.0, 737.0, 0.09829942003342179, 0.15234490194632852, 0.22107769954782266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 1232.125, 154, 2318, 1502.0, 2318.0, 2318.0, 2318.0, 0.13487086115044844, 100.85880733065277, 0.22329754513959132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3af6e7f-7dcd-4cf7-8bd6-ac24dcc3f293", 3, 0, 0.0, 686.6666666666666, 269, 1329, 462.0, 1329.0, 1329.0, 1329.0, 0.07568113017154389, 0.03424374053985873, 0.048532495585267406], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1273.7272727272727, 154, 2692, 1197.5, 2186.3999999999996, 2625.699999999999, 2692.0, 0.0863974991851145, 0.02732136826148596, 0.038980121702659076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 158.70588235294116, 149, 174, 159.0, 170.8, 174.0, 174.0, 0.09180554505492132, 0.0712748128111938, 0.03263400234374156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 658.3750000000001, 299, 2049, 589.5, 1853.0000000000002, 2049.0, 2049.0, 0.12933368900097808, 19.516393676593026, 0.28673809321725635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dfe676c-2fe8-4afe-96af-0e7e3d0df544", 1, 0, 0.0, 2537.0, 2537, 2537, 2537.0, 2537.0, 2537.0, 2537.0, 0.39416633819471814, 0.0712116919590067, 0.2717592136381553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 599.4666666666668, 297, 2308, 592.0, 1304.8000000000006, 2308.0, 2308.0, 0.09607193866767436, 7.80132913525648, 0.2144293146708255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 190.99999999999997, 148, 442, 155.5, 442.0, 442.0, 442.0, 0.04232714651541766, 0.03145601415843051, 0.02124624346574676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 201.0, 147, 462, 156.5, 462.0, 462.0, 462.0, 0.042326250740709385, 0.019272084382671632, 0.02369484691124185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 414.125, 148, 1408, 193.0, 1408.0, 1408.0, 1408.0, 0.0423275944169903, 4.77078801580142, 0.024429304980899673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 318.74999999999994, 147, 1164, 152.5, 1164.0, 1164.0, 1164.0, 0.04232714651541766, 1.5656807362542593, 0.024470381579225837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.8318128881987576, 3.8395283385093166], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1740.3653846153852, 1174, 2555, 1616.5, 2319.7, 2518.4999999999995, 2555.0, 0.2420327023416664, 289.5552561823065, 0.4779200431004389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1273.7272727272727, 154, 2692, 1197.5, 2186.3999999999996, 2625.699999999999, 2692.0, 0.08820675663755843, 0.027893507381301773, 0.03979640777983594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 246.33333333333331, 147, 439, 153.0, 439.0, 439.0, 439.0, 0.017350367538619026, 0.0046764662506434095, 0.010217062134557883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7073f3a6-27da-416d-a042-a15ae9e972f2", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 248.0, 145, 441, 158.0, 441.0, 441.0, 441.0, 0.01735026719411479, 0.004676439204663752, 0.01020005942466514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 271.4117647058824, 147, 1319, 150.0, 639.7999999999994, 1319.0, 1319.0, 0.09300289950216095, 4.94619102692981, 0.054205389381257185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1394270a-fccc-42c9-b81e-b96b932b4283", 3, 0, 0.0, 417.3333333333333, 252, 564, 436.0, 564.0, 564.0, 564.0, 0.02755023325864159, 0.027630946832641518, 0.01766730453109503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 264.94117647058823, 147, 1168, 155.0, 604.7999999999995, 1168.0, 1168.0, 0.09300340830137481, 1.6321863083938313, 0.05429650956840948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 151.33333333333334, 149, 156, 149.0, 156.0, 156.0, 156.0, 0.017379315139121415, 0.004650324558710223, 0.009911640665280183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 150.64705882352942, 148, 159, 149.0, 158.2, 159.0, 159.0, 0.09300188192043415, 0.06911565638813515, 0.04668258526084292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 248.33333333333331, 150, 445, 150.0, 445.0, 445.0, 445.0, 0.017379113781057925, 0.012915532800180742, 0.00872350047213259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 218.11764705882354, 146, 453, 149.0, 443.4, 453.0, 453.0, 0.09300340830137481, 0.033102545831532534, 0.05258154552516837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 157.0, 150, 161, 160.0, 161.0, 161.0, 161.0, 0.01786735277301315, 0.014063560874070898, 0.006351285556032018], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 799.5384615384614, 157, 1940, 625.0, 1785.1999999999998, 1940.0, 1940.0, 0.06660757379350628, 0.012478912938777393, 0.045332378197804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1977.3999999999999, 1035, 5276, 1472.5, 4089.8000000000006, 5217.9, 5276.0, 0.09675156616597731, 0.05007649420699997, 0.044501941078296206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 499.33333333333337, 300, 886, 312.0, 886.0, 886.0, 886.0, 0.01733482798072367, 0.026865597661531702, 0.038986434413678335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1498dcf6-7698-4d0a-ba53-281a71e2c1ba", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3b761ec-030d-453e-8bbd-9d66bea56f1e", 3, 0, 0.0, 385.3333333333333, 235, 543, 378.0, 543.0, 543.0, 543.0, 0.01896777375239468, 0.02614860737024462, 0.012163578871164557], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1478.8852459016389, 779, 3067, 1217.0, 2597.2000000000003, 2645.3, 3067.0, 0.29725936610658454, 88.58267720282592, 1.0821908441678687], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 276.44230769230774, 148, 633, 159.0, 596.0, 608.9499999999999, 633.0, 0.2435186572755882, 0.1809743146354713, 0.11771653842911733], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 984.25, 729, 1376, 919.0, 1287.2000000000003, 1346.3999999999996, 1376.0, 0.24341720304271505, 71.572739906378, 0.12242173785839672], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 262.5576923076923, 147, 611, 159.0, 463.0, 503.14999999999975, 611.0, 0.24375038085997008, 0.431323916131119, 0.11854266569166515], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1457.634615384616, 1025, 1946, 1456.0, 1804.3000000000002, 1904.0, 1946.0, 0.24276377217553688, 218.43926893674137, 0.1218560340802988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ece0dfdb-eb6c-49b0-8f7e-dd918fd1c7b2", 3, 0, 0.0, 431.3333333333333, 273, 563, 458.0, 563.0, 563.0, 563.0, 0.019780828421094278, 0.02338026953027126, 0.012684971350766835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 199.26666666666668, 150, 470, 158.0, 456.8, 470.0, 470.0, 0.0979854197695383, 0.07320199816767264, 0.034830754683703065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, 4.022988505747127, 227.01149425287366, 148, 1150, 160.0, 397.5, 477.25, 978.25, 0.7632348877299027, 1.557277433688486, 0.3711269050715642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 166.25, 149, 201, 162.5, 201.0, 201.0, 201.0, 0.043835856634830875, 0.03394710381974696, 0.015582277163162538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 174.5, 150, 453, 157.5, 208.2000000000004, 453.0, 453.0, 0.09475728973094194, 0.07689776149063746, 0.033683255334045765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=480a9332-7068-4784-8989-0da695b188f3", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=534cae69-e2ec-44ee-82f3-86b049e72c81", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 607.375, 307, 1567, 346.5, 1567.0, 1567.0, 1567.0, 0.04229291012227938, 6.381980519158688, 0.09376511641123511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 480.2352941176471, 298, 1469, 315.0, 789.7999999999994, 1469.0, 1469.0, 0.0929256267013589, 6.675036521137847, 0.2075933304681265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7ba41d2-b1d4-4bda-918f-ba68e470c15a", 3, 0, 0.0, 490.33333333333337, 256, 949, 266.0, 949.0, 949.0, 949.0, 0.023887061971001104, 0.023957043597869276, 0.015318200547809956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b165e61-df0a-41b7-bbdf-2f2fb999f1f0", 3, 0, 0.0, 488.3333333333333, 263, 721, 481.0, 721.0, 721.0, 721.0, 0.0792895654931811, 0.03582484274236177, 0.0508464987049371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 174.57894736842107, 151, 447, 161.0, 167.0, 447.0, 447.0, 0.1075366190486971, 0.08915877887924203, 0.03822590755246655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 176.7058823529412, 150, 471, 158.0, 232.5999999999998, 471.0, 471.0, 0.09360099547411657, 0.07266874160344011, 0.03327222885993987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcef6e59-0698-4446-a7ed-33667406e210", 1, 0, 0.0, 1043.0, 1043, 1043, 1043.0, 1043.0, 1043.0, 1043.0, 0.9587727708533077, 0.17321578379674019, 0.661028883029722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dfe676c-2fe8-4afe-96af-0e7e3d0df544", 3, 0, 0.0, 1010.6666666666666, 464, 1757, 811.0, 1757.0, 1757.0, 1757.0, 0.07333708167306328, 0.03318311963722591, 0.04702931344268708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 154.20000000000002, 148, 167, 152.0, 165.2, 167.0, 167.0, 0.09616925789389325, 0.0714695363840359, 0.048272459528770635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 192.26666666666665, 148, 462, 152.0, 450.6, 462.0, 462.0, 0.09616679168349586, 0.03536133069195212, 0.05430668952230749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1becbef-d498-461d-8438-2f838e15c1c8", 3, 0, 0.0, 621.0, 431, 989, 443.0, 989.0, 989.0, 989.0, 0.02582422312128777, 0.030523357471808555, 0.01656045558233623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 404.06666666666666, 147, 2150, 158.0, 1142.6000000000006, 2150.0, 2150.0, 0.09616555862573006, 5.792854227838647, 0.05598388185099468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3af6e7f-7dcd-4cf7-8bd6-ac24dcc3f293", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 318.6, 145, 1205, 157.0, 752.6000000000003, 1205.0, 1205.0, 0.09616555862573006, 1.9092494638770108, 0.056077793529340114], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.39463299131807417], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.15785319652722968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07892659826361484], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.7103393843725335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1267, 17, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
