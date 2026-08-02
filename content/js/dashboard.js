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

    var data = {"OkPercent": 96.46153846153847, "KoPercent": 3.5384615384615383};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.775691699604743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/027bc0eb-fb39-4781-8d51-4617b7c6b3fb"], "isController": false}, {"data": [0.3125, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03ac1f7e-7946-43a8-8955-5212610574cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=338e42bb-e6ff-454e-8779-536ec7b241fc"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=027bc0eb-fb39-4781-8d51-4617b7c6b3fb"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.65625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/314a4b41-76da-42a2-bda6-2322f4b9e952"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34c4029a-7c25-4a08-8baa-9175cd9ec0dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=314a4b41-76da-42a2-bda6-2322f4b9e952"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03ac1f7e-7946-43a8-8955-5212610574cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/634e70cf-0d9f-41f2-90f5-a37a4d90949c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ebf1130b-6d62-4856-844e-a216f4399c3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d687920-c4b5-4109-b25b-1519ff96ea4b"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/061bd882-acdc-461a-a7d9-3c993eaa6fb1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/338e42bb-e6ff-454e-8779-536ec7b241fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebf1130b-6d62-4856-844e-a216f4399c3d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d687920-c4b5-4109-b25b-1519ff96ea4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36bbddc6-2160-4104-adad-7f65d829828d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cfd3ce5-1092-4e74-aca9-9a0846b7f82a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/839cc82f-0b8e-4782-a0d4-2c53875abbc7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3cfd3ce5-1092-4e74-aca9-9a0846b7f82a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/adcb9cb7-8c03-454d-b9d2-bd436688f011"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6154c116-31af-4690-b71e-93c95fe429b5"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adcb9cb7-8c03-454d-b9d2-bd436688f011"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=634e70cf-0d9f-41f2-90f5-a37a4d90949c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6154c116-31af-4690-b71e-93c95fe429b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 46, 3.5384615384615383, 332.3092307692307, 81, 5026, 100.0, 928.7000000000003, 1130.3500000000006, 1799.91, 5.072418529154701, 740.8504536095622, 3.7143119995864025], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/027bc0eb-fb39-4781-8d51-4617b7c6b3fb", 3, 0, 0.0, 444.3333333333333, 332, 502, 499.0, 502.0, 502.0, 502.0, 0.09216873022212664, 0.042784052505453314, 0.059105598482288246], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1458.6607142857138, 994, 1952, 1441.5, 1829.2, 1903.4, 1952.0, 0.24636176465412568, 296.45547097028043, 1.2113588721030497], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 233.26666666666668, 168, 368, 177.0, 361.4, 368.0, 368.0, 0.07906513385727162, 0.1225355150698145, 0.17781933913407863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 94.64285714285714, 85, 138, 90.0, 120.0, 138.0, 138.0, 0.0715596424062441, 0.05555655831344146, 0.02543721663659458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 354.5, 169, 1365, 338.5, 768.6000000000006, 1365.0, 1365.0, 0.09502824120543324, 7.243496365540977, 0.21220112504528688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03ac1f7e-7946-43a8-8955-5212610574cc", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 86.77777777777777, 82, 97, 86.0, 97.0, 97.0, 97.0, 0.0574433863514514, 0.04268986036470168, 0.028833887289693383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 85.0, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.05744558626412204, 0.024957913129507885, 0.0322258768430459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 178.33333333333334, 82, 926, 84.0, 926.0, 926.0, 926.0, 0.057444119636953166, 5.756909300921021, 0.03322234783690976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 148.22222222222226, 83, 648, 87.0, 648.0, 648.0, 648.0, 0.057443752991862135, 1.8904704204563585, 0.033278233205680546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 95.8, 84, 113, 89.0, 113.0, 113.0, 113.0, 0.03361819147577137, 0.009914740064143508, 0.0207815578165657], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1019.0892857142858, 656, 1603, 974.0, 1462.5, 1532.35, 1603.0, 0.23803653860867643, 284.7744550663527, 0.47002918072924194], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 398.3333333333333, 86, 1360, 435.0, 860.2000000000003, 1360.0, 1360.0, 0.08350405273002584, 0.01826651153469315, 0.05542472770720139], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 398.3333333333333, 86, 1360, 435.0, 860.2000000000003, 1360.0, 1360.0, 0.08400584680693778, 0.018376278989017635, 0.055757786991974645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1165.6249999999998, 111, 3011, 1118.5, 2515.5, 2922.75, 3011.0, 0.11354872896391516, 0.03515131550933702, 0.05122999295051641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 108.28571428571428, 81, 254, 83.0, 254.0, 254.0, 254.0, 0.032267729965196945, 0.00869716159218199, 0.019001407391615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 135.0, 83, 271, 88.0, 267.4, 270.7, 271.0, 0.1413123204155928, 0.0479189657956893, 0.08002703859845095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 85.14285714285714, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.03229318521525714, 0.008704022577549778, 0.018984860839438282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 98.0952380952381, 84, 249, 88.0, 140.00000000000006, 239.29999999999987, 249.0, 0.14130851686618084, 0.10501541146012072, 0.07093025163009468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 149.04761904761907, 82, 673, 87.0, 316.40000000000003, 638.7999999999995, 673.0, 0.14131327133493937, 2.014883841332113, 0.08263645773050887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 143.04761904761907, 82, 803, 87.0, 254.6, 748.2999999999993, 803.0, 0.14130756601082012, 6.090977732703281, 0.08249512573008909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=338e42bb-e6ff-454e-8779-536ec7b241fc", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 0.5923411885245902, 2.260502049180328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 168.64285714285717, 82, 768, 87.0, 512.5, 768.0, 768.0, 0.07179671273622401, 4.6324555196928126, 0.041767897894817815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 150.21428571428572, 83, 655, 85.5, 457.0, 655.0, 655.0, 0.07179781734635267, 1.5258939309048578, 0.041838655560228116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 131.28571428571428, 82, 252, 83.0, 252.0, 252.0, 252.0, 0.03226802745548164, 0.0086342182839863, 0.018402859408204377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 114.0, 84, 264, 88.5, 256.5, 264.0, 264.0, 0.07178714087200866, 0.05334962324570175, 0.03603377969551997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 110.85714285714286, 83, 249, 84.0, 249.0, 249.0, 249.0, 0.03228961012602174, 0.02399647783779545, 0.016207870707788254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 139.78571428571428, 83, 350, 87.0, 303.0, 350.0, 350.0, 0.07179818555728212, 0.02691430309604033, 0.04051669371919729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 95.0, 85, 110, 92.0, 110.0, 110.0, 110.0, 0.033123864324651725, 0.02607210414616142, 0.011774498646653543], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 1133.7142857142856, 83, 4082, 477.0, 4022.5, 4082.0, 4082.0, 0.11335940599671258, 0.023294978380741856, 0.07712804450976105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=027bc0eb-fb39-4781-8d51-4617b7c6b3fb", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.5236639492753623, 1.9984148550724639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1551.3333333333335, 872, 5026, 1327.5, 2169.0, 4335.25, 5026.0, 0.1135583997728832, 0.058775343632449316, 0.05223242802053515], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 193.4375, 81, 502, 188.0, 428.50000000000006, 502.0, 502.0, 0.08768324428003836, 0.13168541923551172, 0.05665908857377723], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 246.0, 167, 504, 175.0, 504.0, 504.0, 504.0, 0.03225167363149238, 0.04998379497380703, 0.07253476989582709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/314a4b41-76da-42a2-bda6-2322f4b9e952", 3, 0, 0.0, 1391.6666666666665, 205, 2907, 1063.0, 2907.0, 2907.0, 2907.0, 0.020990029735875458, 0.024809504547839773, 0.013460403183487842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 88.8, 83, 101, 88.0, 99.8, 101.0, 101.0, 0.07917238467222633, 0.058838071030824446, 0.039740825899926106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 623.5, 405, 787, 665.5, 781.1, 787.0, 787.0, 0.05139538469445444, 15.111949587552038, 0.029311430333556047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 107.93333333333332, 82, 266, 85.0, 255.20000000000002, 266.0, 266.0, 0.07917530997133854, 0.02118558098842457, 0.045154668968029006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 768.0, 562, 929, 760.0, 925.3, 929.0, 929.0, 0.051381124630055904, 46.232826260507444, 0.029253120761057218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 171.5, 85, 273, 168.0, 271.4, 273.0, 273.0, 0.05150709767806004, 0.09114341893812967, 0.028520043343222695], "isController": false}, {"data": ["addBook", 54, 17, 31.48148148148148, 969.7222222222224, 438, 3146, 724.5, 1793.0, 2399.75, 3146.0, 0.25351517570010096, 74.1136367470834, 0.919987390260792], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 90.83333333333334, 83, 101, 88.0, 101.0, 101.0, 101.0, 0.047629253887737845, 0.03539634981305518, 0.02390765283036841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 85.33333333333333, 81, 93, 84.0, 93.0, 93.0, 93.0, 0.04763530411172067, 0.012746165358019007, 0.027167009376215693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34c4029a-7c25-4a08-8baa-9175cd9ec0dc", 2, 0, 0.0, 216.5, 194, 239, 216.5, 239.0, 239.0, 239.0, 0.040417104518632285, 0.03406246210896451, 0.025122545923935008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 113.66666666666667, 84, 245, 88.5, 245.0, 245.0, 245.0, 0.04763492592769018, 0.012839101128947745, 0.028004126375458488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=314a4b41-76da-42a2-bda6-2322f4b9e952", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 161.46428571428572, 83, 463, 89.0, 346.0, 361.8999999999999, 463.0, 0.23906797641765176, 0.1776667285681963, 0.11556508625657971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 140.33333333333334, 83, 251, 88.5, 251.0, 251.0, 251.0, 0.047635682301756174, 0.012839304995395217, 0.02805109026167868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 108.6, 81, 311, 87.0, 288.9000000000001, 311.0, 311.0, 0.051507628279748224, 0.03827861828211759, 0.02892274048911644], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 534.9642857142859, 406, 751, 498.5, 682.3, 698.55, 751.0, 0.23880597014925373, 70.2168843283582, 0.1201026119402985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 474.72727272727275, 82, 1191, 89.5, 1104.5, 1179.1499999999999, 1191.0, 0.12425657853862968, 45.75872606825357, 0.06868088227818789], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 127.62499999999996, 82, 287, 88.5, 257.3, 261.6, 287.0, 0.23937966469748395, 0.42358979729671964, 0.11641706349545607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 107.86666666666667, 82, 257, 86.0, 252.8, 257.0, 257.0, 0.07910432806146935, 0.021321088422817908, 0.04650469286426225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 302.1818181818182, 81, 741, 88.0, 676.7, 731.3999999999999, 741.0, 0.12436896881165452, 14.979692437660054, 0.06886445831660948], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 855.9285714285716, 567, 1192, 851.0, 1124.3000000000002, 1146.95, 1192.0, 0.2384307848204744, 214.5404392980768, 0.11968107753683968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 97.4, 82, 262, 86.0, 160.00000000000006, 262.0, 262.0, 0.07917656373713382, 0.02134055819477435, 0.046624480403800475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 103.62500000000001, 84, 251, 93.5, 146.7000000000001, 251.0, 251.0, 0.09430236875762524, 0.07045050009724932, 0.0335215451443121], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 289.3333333333333, 84, 475, 345.0, 460.0, 475.0, 475.0, 0.08416752704583202, 0.018411646541275754, 0.056029489846590654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 17, 10.365853658536585, 171.81097560975607, 84, 1864, 93.5, 342.0, 401.75, 1816.5499999999995, 0.6844912643889246, 1.6211343460186816, 0.32374509717480404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03ac1f7e-7946-43a8-8955-5212610574cc", 3, 0, 0.0, 274.0, 176, 461, 185.0, 461.0, 461.0, 461.0, 0.0937031484257871, 0.04239823447651175, 0.06008958411419291], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 134.44444444444446, 89, 253, 95.0, 253.0, 253.0, 253.0, 0.05385190725504862, 0.04170367427075542, 0.019142670157068064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 233.5, 174, 334, 194.0, 334.0, 334.0, 334.0, 0.047596760247185836, 0.07376568214090228, 0.10704622934498925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 99.71428571428572, 84, 247, 91.0, 112.60000000000001, 233.8999999999998, 247.0, 0.13488255583174366, 0.10946035536736227, 0.047946533518315126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/634e70cf-0d9f-41f2-90f5-a37a4d90949c", 3, 0, 0.0, 696.6666666666667, 177, 1678, 235.0, 1678.0, 1678.0, 1678.0, 0.01770015930143371, 0.024401098516136643, 0.011350688093692843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 447.74999999999994, 98, 1086, 382.0, 876.0, 1053.0, 1086.0, 0.11649863356811045, 0.07156019581478659, 0.05267467513870619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 90.45454545454545, 83, 130, 87.0, 100.8, 125.79999999999994, 130.0, 0.12437107807111765, 0.09242811563683646, 0.062428451297416476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 128.0454545454545, 82, 338, 86.5, 259.7, 326.29999999999984, 338.0, 0.1242488591695658, 0.10958917044119641, 0.06659182908439887], "isController": false}, {"data": ["login", 24, 0, 0.0, 2614.3333333333335, 1570, 6254, 2619.5, 3342.0, 5532.0, 6254.0, 0.11333103523178557, 56.64243268903853, 0.2492950750582002], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 267.8888888888889, 171, 1008, 175.0, 1008.0, 1008.0, 1008.0, 0.057411140312826923, 7.710610176762522, 0.1274868691950958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 93.33333333333333, 86, 125, 90.0, 110.60000000000001, 125.0, 125.0, 0.07681435506667486, 0.062186621435813924, 0.027305102777607077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebf1130b-6d62-4856-844e-a216f4399c3d", 3, 0, 0.0, 1491.3333333333333, 190, 4082, 202.0, 4082.0, 4082.0, 4082.0, 0.022014147758959757, 0.022078642332472333, 0.014117145535530833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d687920-c4b5-4109-b25b-1519ff96ea4b", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 316.57142857142856, 169, 1018, 190.0, 768.5, 1018.0, 1018.0, 0.0717547627223757, 6.234951320479834, 0.16006677677605852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/061bd882-acdc-461a-a7d9-3c993eaa6fb1", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/338e42bb-e6ff-454e-8779-536ec7b241fc", 3, 0, 0.0, 489.6666666666667, 171, 805, 493.0, 805.0, 805.0, 805.0, 0.06475146230385702, 0.029298350456497806, 0.04152356143834581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebf1130b-6d62-4856-844e-a216f4399c3d", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d687920-c4b5-4109-b25b-1519ff96ea4b", 3, 0, 0.0, 708.6666666666666, 397, 1306, 423.0, 1306.0, 1306.0, 1306.0, 0.031609558730560115, 0.026351588512032707, 0.020270452701563618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 116.0, 86, 247, 90.0, 247.0, 247.0, 247.0, 0.04808000512853388, 0.03986320737707545, 0.017090939323033526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 568.181818181818, 170, 1278, 205.0, 1194.5, 1266.6, 1278.0, 0.12418924182467866, 60.89380333610407, 0.2663056593601996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36bbddc6-2160-4104-adad-7f65d829828d", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cfd3ce5-1092-4e74-aca9-9a0846b7f82a", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 93.31818181818181, 84, 120, 91.5, 102.8, 117.59999999999997, 120.0, 0.11756218772543886, 0.091271425040746, 0.04178968391802709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/839cc82f-0b8e-4782-a0d4-2c53875abbc7", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cfd3ce5-1092-4e74-aca9-9a0846b7f82a", 3, 0, 0.0, 1510.3333333333333, 218, 3963, 350.0, 3963.0, 3963.0, 3963.0, 0.024066230265691182, 0.0241367367996727, 0.015433096882620971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adcb9cb7-8c03-454d-b9d2-bd436688f011", 3, 0, 0.0, 337.0, 192, 620, 199.0, 620.0, 620.0, 620.0, 0.029943406960844007, 0.030031131785924606, 0.01920198948986416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6154c116-31af-4690-b71e-93c95fe429b5", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 9, 47.36842105263158, 502.0, 81, 1052, 650.0, 1011.0, 1052.0, 1052.0, 0.08545547769612032, 53.818442037011216, 0.12816125532972322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 288.8571428571428, 172, 890, 180.0, 497.80000000000007, 852.7999999999995, 890.0, 0.14122489055070983, 8.25388032199275, 0.3158974358435497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adcb9cb7-8c03-454d-b9d2-bd436688f011", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=634e70cf-0d9f-41f2-90f5-a37a4d90949c", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6154c116-31af-4690-b71e-93c95fe429b5", 3, 0, 0.0, 272.3333333333333, 186, 404, 227.0, 404.0, 404.0, 404.0, 0.028185422499483265, 0.028267996979462223, 0.018074636173171236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 107.93749999999999, 84, 259, 88.0, 252.0, 259.0, 259.0, 0.09517577776455892, 0.07073121765510677, 0.04777377907322586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 136.3125, 82, 260, 86.0, 251.60000000000002, 260.0, 260.0, 0.09507849918589036, 0.03436614210075944, 0.05372538729632403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 223.0625, 83, 1115, 167.0, 520.0000000000006, 1115.0, 1115.0, 0.09517804242561241, 5.37663573318323, 0.05544306865906036], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1165.6249999999998, 111, 3011, 1118.5, 2515.5, 2922.75, 3011.0, 0.11372090047999697, 0.03520461469937406, 0.05130767189624863], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 161.81249999999994, 83, 484, 86.5, 326.50000000000017, 484.0, 484.0, 0.09517634391971876, 1.7731125155405123, 0.055535024894562454], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 21.73913043478261, 0.7692307692307693], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.869565217391305, 0.38461538461538464], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 8.695652173913043, 0.3076923076923077], "isController": false}, {"data": ["401/Unauthorized", 27, 58.69565217391305, 2.076923076923077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 46, "401/Unauthorized", 27, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
