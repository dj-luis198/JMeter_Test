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

    var data = {"OkPercent": 96.78864824495892, "KoPercent": 3.2113517550410755};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.754983922829582, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.044642857142857144, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c666dc9-a0c3-4ed7-bc16-eeb04bbe306f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1ccaa0f7-1cc2-4bdb-83ad-8a147ebab7d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e13746bf-f1c5-4119-abbf-49cd043c0fd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8272d59-c878-40e7-83d6-314cd4773cc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f02e4d70-3ed4-43bf-9b3a-e7de8a15e4a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d863dbd6-1ae4-40e5-bcae-b4cfbc18140e"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d863dbd6-1ae4-40e5-bcae-b4cfbc18140e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eb50de67-2c45-4aaf-882f-3c7ae32bc1df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ccaa0f7-1cc2-4bdb-83ad-8a147ebab7d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4c666dc9-a0c3-4ed7-bc16-eeb04bbe306f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00aa1415-9ca8-479f-a1d4-f47fd8e0288e"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.18032786885245902, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e13746bf-f1c5-4119-abbf-49cd043c0fd6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7bde5bdb-f5d0-4b76-9596-d1d0485a2db6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb50de67-2c45-4aaf-882f-3c7ae32bc1df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00aa1415-9ca8-479f-a1d4-f47fd8e0288e"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8398876404494382, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a53398bb-8451-4d98-9e42-b4596d7c9813"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ee8c696-9875-4488-a6c2-1e2c2b716533"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bde5bdb-f5d0-4b76-9596-d1d0485a2db6"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8272d59-c878-40e7-83d6-314cd4773cc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ee8c696-9875-4488-a6c2-1e2c2b716533"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6314f4f4-6af1-401d-8572-1ebb2df5f93b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0262bc07-6362-4dfb-aaeb-a408900b8cc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6314f4f4-6af1-401d-8572-1ebb2df5f93b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0262bc07-6362-4dfb-aaeb-a408900b8cc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1339, 43, 3.2113517550410755, 389.26587005227714, 103, 3724, 121.0, 1131.0, 1385.0, 1818.9999999999982, 5.3001994996675, 732.7094567147076, 3.890992660520045], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1862.4821428571424, 1352, 2702, 1835.0, 2217.2, 2331.0, 2702.0, 0.2543777964523382, 306.10201514910625, 1.2507736378296122], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 132.125, 113, 335, 116.5, 193.60000000000014, 335.0, 335.0, 0.07774991739071277, 0.06036248469298501, 0.02763766594747993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 373.7272727272727, 215, 1412, 231.0, 991.6999999999996, 1370.5999999999995, 1412.0, 0.11671706721842008, 12.858461489999469, 0.25978458737864074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 282.12500000000006, 216, 459, 230.0, 451.3, 459.0, 459.0, 0.0871868086358534, 0.13512252471201106, 0.1960851760628617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 132.5, 105, 379, 115.0, 248.0, 379.0, 379.0, 0.07632672198536708, 0.05672327678795346, 0.03831243662156121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 160.5, 105, 355, 114.0, 348.0, 355.0, 355.0, 0.07632838652694937, 0.020423806551156373, 0.043531032941150814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 128.99999999999997, 104, 340, 114.0, 234.0, 340.0, 340.0, 0.07632880267368891, 0.020572997595642715, 0.044872987509336645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 174.92857142857144, 108, 336, 113.0, 332.0, 336.0, 336.0, 0.07632505751638263, 0.020571988158712508, 0.044945321955447974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c666dc9-a0c3-4ed7-bc16-eeb04bbe306f", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 116.0, 115, 117, 116.0, 117.0, 117.0, 117.0, 0.047166474070230884, 0.013910424969931372, 0.02915661922505483], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1299.0892857142858, 844, 2163, 1244.0, 1709.6000000000001, 1804.9499999999998, 2163.0, 0.27037727285894997, 323.46521668807156, 0.5338894977742157], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 597.0000000000001, 111, 1372, 482.0, 1283.5, 1372.0, 1372.0, 0.07622241701284348, 0.015014795315588029, 0.05128637238461831], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 597.0000000000001, 111, 1372, 482.0, 1283.5, 1372.0, 1372.0, 0.07692983998593284, 0.015154148166871812, 0.05176236303740988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1062.5652173913045, 308, 2119, 1043.0, 1771.4, 2056.599999999999, 2119.0, 0.09601576328357213, 0.029809241725945963, 0.04331961195020539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ccaa0f7-1cc2-4bdb-83ad-8a147ebab7d4", 3, 0, 0.0, 481.3333333333333, 232, 628, 584.0, 628.0, 628.0, 628.0, 0.03295870274545994, 0.027476314365599906, 0.02113562643507685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 110.99999999999999, 107, 117, 110.0, 117.0, 117.0, 117.0, 0.03306237926327573, 0.008911344410804786, 0.0194693502888235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 111.35714285714285, 107, 115, 111.5, 115.0, 115.0, 115.0, 0.09078764769204829, 0.024292788542598864, 0.0517773303243713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 144.85714285714286, 111, 334, 115.0, 334.0, 334.0, 334.0, 0.03306269158648964, 0.008911428591671036, 0.019437246420963637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 115.07142857142857, 110, 124, 114.0, 124.0, 124.0, 124.0, 0.09077940604331475, 0.06746399218648684, 0.04556700654908572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 142.57142857142858, 106, 334, 112.0, 332.0, 334.0, 334.0, 0.09078647022203776, 0.02446979080203362, 0.05346117338270388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e13746bf-f1c5-4119-abbf-49cd043c0fd6", 3, 0, 0.0, 325.0, 210, 423, 342.0, 423.0, 423.0, 423.0, 0.0646900269541779, 0.0292705525606469, 0.04148416442048518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 144.14285714285717, 109, 342, 114.0, 331.0, 342.0, 342.0, 0.09078411537364149, 0.02446915609680181, 0.053371130327082204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 125.75, 109, 341, 110.5, 183.50000000000017, 341.0, 341.0, 0.07766311681503558, 0.02093263695405256, 0.04565741828383928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8272d59-c878-40e7-83d6-314cd4773cc2", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 166.31250000000003, 107, 343, 112.5, 340.9, 343.0, 343.0, 0.07766537871580297, 0.020933246606993767, 0.045734593130497256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f02e4d70-3ed4-43bf-9b3a-e7de8a15e4a3", 2, 0, 0.0, 351.0, 235, 467, 351.0, 467.0, 467.0, 467.0, 0.01802597543059549, 0.03080611035502159, 0.011204622423412138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 167.625, 110, 343, 115.0, 337.4, 343.0, 343.0, 0.07766273984438328, 0.057716157247632495, 0.038983054960950204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 110.57142857142857, 105, 114, 111.0, 114.0, 114.0, 114.0, 0.03306237926327573, 0.0088467694513062, 0.018855888173586938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 179.3125, 108, 343, 114.5, 340.9, 343.0, 343.0, 0.07766424774895032, 0.020781253792199597, 0.04429289129432323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 115.85714285714286, 107, 131, 116.0, 131.0, 131.0, 131.0, 0.03305956861985747, 0.02456868332003079, 0.016594353779889392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 124.57142857142858, 112, 150, 121.0, 150.0, 150.0, 150.0, 0.033703104537400816, 0.026528029547993222, 0.011980400441029196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d863dbd6-1ae4-40e5-bcae-b4cfbc18140e", 3, 0, 0.0, 317.3333333333333, 210, 512, 230.0, 512.0, 512.0, 512.0, 0.04697849950672575, 0.03020264860865344, 0.030126186207112545], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 621.6153846153846, 116, 1717, 512.0, 1546.9999999999998, 1717.0, 1717.0, 0.08811707369976479, 0.017097836641112713, 0.059964886617049976], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1661.681818181818, 902, 3724, 1513.0, 2483.0, 3549.9999999999973, 3724.0, 0.09489302967563837, 0.049114556375086264, 0.043647086891821944], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 315.2142857142858, 105, 927, 236.5, 777.5, 927.0, 927.0, 0.07629510948348212, 0.12897151808194096, 0.04931295232100623], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 262.42857142857144, 221, 452, 231.0, 452.0, 452.0, 452.0, 0.033041778969379716, 0.05120830393008359, 0.07431173531882956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d863dbd6-1ae4-40e5-bcae-b4cfbc18140e", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb50de67-2c45-4aaf-882f-3c7ae32bc1df", 3, 0, 0.0, 767.0, 233, 1717, 351.0, 1717.0, 1717.0, 1717.0, 0.050590219224283306, 0.03252463638279933, 0.032442295531197304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ccaa0f7-1cc2-4bdb-83ad-8a147ebab7d4", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c666dc9-a0c3-4ed7-bc16-eeb04bbe306f", 3, 0, 0.0, 875.3333333333334, 679, 1020, 927.0, 1020.0, 1020.0, 1020.0, 0.02207148217359956, 0.0260877447175586, 0.014153912722002325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 122.72727272727272, 105, 328, 114.0, 118.4, 296.6499999999995, 328.0, 0.11693046889118026, 0.08689852229119939, 0.05869361426764322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 149.4090909090909, 104, 326, 110.5, 324.4, 325.85, 326.0, 0.11680134215360438, 0.04720167875383586, 0.06572149383607462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 886.1111111111111, 752, 985, 903.0, 985.0, 985.0, 985.0, 0.07776587287871979, 22.865748696341548, 0.044350849376144884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00aa1415-9ca8-479f-a1d4-f47fd8e0288e", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1279.5555555555557, 1085, 1924, 1227.0, 1924.0, 1924.0, 1924.0, 0.07698624512420447, 69.2723586901432, 0.04383103604239376], "isController": false}, {"data": ["addBook", 61, 26, 42.622950819672134, 1037.0491803278687, 567, 3149, 812.0, 1944.0, 2136.9, 3149.0, 0.28730624490737905, 68.77774080149022, 1.0459375014718557], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 208.66666666666666, 109, 340, 114.0, 340.0, 340.0, 340.0, 0.07804370447450572, 0.13810077393340273, 0.04321365277055151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e13746bf-f1c5-4119-abbf-49cd043c0fd6", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bde5bdb-f5d0-4b76-9596-d1d0485a2db6", 3, 0, 0.0, 635.0, 238, 1292, 375.0, 1292.0, 1292.0, 1292.0, 0.03602997694081476, 0.030036709292131054, 0.023105160993946966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 113.08333333333334, 108, 116, 114.0, 116.0, 116.0, 116.0, 0.0671745811384972, 0.049921734615621445, 0.03371849092303472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 132.0, 107, 340, 115.0, 272.80000000000024, 340.0, 340.0, 0.0671745811384972, 0.017974448468699444, 0.03831050330554918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 110.91666666666666, 106, 115, 111.0, 115.0, 115.0, 115.0, 0.06717608531362836, 0.01810605424468889, 0.039492190780082294], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 201.75, 110, 462, 116.0, 446.90000000000003, 452.34999999999997, 462.0, 0.2718591769463418, 0.20203597036734972, 0.13141630135589763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 129.25, 108, 324, 111.5, 261.60000000000025, 324.0, 324.0, 0.06717420510523958, 0.01810554746977161, 0.03955668523287058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb50de67-2c45-4aaf-882f-3c7ae32bc1df", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 740.1785714285713, 522, 1030, 681.0, 918.6000000000001, 1016.15, 1030.0, 0.2714296100622834, 79.80931766958292, 0.13651000896687104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 111.88888888888887, 109, 115, 113.0, 115.0, 115.0, 115.0, 0.07819695205657984, 0.058113164565485605, 0.043909421320833406], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 171.05357142857144, 104, 441, 114.0, 335.6, 357.39999999999986, 441.0, 0.27235764449545746, 0.4819453631111025, 0.1324551825768924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 217.45454545454544, 103, 1297, 113.0, 816.5999999999995, 1255.4499999999994, 1297.0, 0.11693233338471269, 9.593735300409795, 0.06782988870167904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 872.5624999999997, 103, 1520, 1204.0, 1438.8000000000002, 1520.0, 1520.0, 0.07929153017786081, 44.5996757255175, 0.04235592481180651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00aa1415-9ca8-479f-a1d4-f47fd8e0288e", 3, 0, 0.0, 329.3333333333333, 225, 437, 326.0, 437.0, 437.0, 437.0, 0.021220309250640144, 0.025081687138370563, 0.013608075919193063], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1092.125, 733, 1710, 1039.5, 1370.4, 1457.6999999999998, 1710.0, 0.2710171369943231, 243.8616962648031, 0.1360378988428536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 117.43750000000001, 113, 125, 117.0, 125.0, 125.0, 125.0, 0.08745463290917836, 0.06533475993703267, 0.031087389041934498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 210.54545454545456, 108, 894, 114.0, 674.0999999999997, 882.2999999999998, 894.0, 0.11679018113095364, 3.150452462414796, 0.06786148220011466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 577.5624999999999, 109, 1112, 650.0, 1011.2, 1112.0, 1112.0, 0.07920635234945841, 14.563816650907903, 0.04238777449951486], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 389.3076923076923, 115, 692, 448.0, 628.4, 692.0, 692.0, 0.08998906286774376, 0.017839628673976548, 0.06105628123658818], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 26, 14.606741573033707, 170.73033707865176, 107, 1682, 118.5, 306.4, 343.15, 1543.7500000000014, 0.7591848572476563, 1.632981337327584, 0.3633359630238589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 168.7142857142857, 112, 346, 120.5, 341.5, 346.0, 346.0, 0.07837166080745202, 0.060692116230770955, 0.027858676302648964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 246.66666666666666, 220, 455, 230.0, 388.10000000000025, 455.0, 455.0, 0.06713098934295543, 0.1040399219602249, 0.15097916841486952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 159.07142857142858, 112, 447, 120.5, 392.5, 447.0, 447.0, 0.08813290441986515, 0.07152191755166791, 0.03132849336799894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a53398bb-8451-4d98-9e42-b4596d7c9813", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ee8c696-9875-4488-a6c2-1e2c2b716533", 3, 0, 0.0, 307.3333333333333, 219, 469, 234.0, 469.0, 469.0, 469.0, 0.0282424710279318, 0.028325212642271447, 0.01811122002767762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 734.0, 117, 1827, 678.0, 1239.0, 1743.2999999999988, 1827.0, 0.09492496612904618, 0.058308402046064495, 0.042920175114988655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 140.125, 106, 327, 112.0, 320.7, 327.0, 327.0, 0.07929074429230533, 0.05892603164691832, 0.03980023688109858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 205.18750000000003, 107, 341, 114.5, 332.6, 341.0, 341.0, 0.0792059602485087, 0.09554605702829139, 0.041014609786886466], "isController": false}, {"data": ["login", 22, 0, 0.0, 3177.272727272728, 1565, 6162, 3421.0, 4104.5, 5856.299999999996, 6162.0, 0.09431495192080973, 46.28369364815593, 0.20628046480123124], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 342.5, 218, 720, 236.0, 595.0, 720.0, 720.0, 0.07627972866210805, 0.11821868104176315, 0.1715548975672215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 131.27272727272725, 112, 324, 117.5, 167.49999999999997, 302.5499999999997, 324.0, 0.11404754745933168, 0.09232950863650974, 0.040540339135934314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bde5bdb-f5d0-4b76-9596-d1d0485a2db6", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 351.4999999999999, 222, 677, 230.0, 671.4, 677.0, 677.0, 0.07761978916524769, 0.12029551309106257, 0.17456872504645057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 120.83333333333334, 113, 153, 117.0, 144.90000000000003, 153.0, 153.0, 0.06989626229737365, 0.057951100283662335, 0.02484593698851954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1028.9375, 221, 1632, 1318.0, 1550.1000000000001, 1632.0, 1632.0, 0.07916206949440176, 59.236854844594966, 0.1653783761385732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8272d59-c878-40e7-83d6-314cd4773cc2", 3, 0, 0.0, 404.3333333333333, 272, 544, 397.0, 544.0, 544.0, 544.0, 0.06638196180824464, 0.03003610902130861, 0.04256916170645897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 132.625, 111, 339, 119.5, 194.10000000000014, 339.0, 339.0, 0.07564582624153712, 0.05872893736525587, 0.0268897272967964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ee8c696-9875-4488-a6c2-1e2c2b716533", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6314f4f4-6af1-401d-8572-1ebb2df5f93b", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0262bc07-6362-4dfb-aaeb-a408900b8cc7", 3, 0, 0.0, 427.0, 270, 679, 332.0, 679.0, 679.0, 679.0, 0.044104026697637494, 0.028354639559841813, 0.02828285566222196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 292.21428571428567, 225, 456, 232.5, 451.0, 456.0, 456.0, 0.09071058786940267, 0.1405836942858809, 0.20401023814768982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 1004.0, 105, 2033, 1289.0, 1778.1999999999998, 2033.0, 2033.0, 0.11109401972346135, 92.0217335687672, 0.1960752699371037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6314f4f4-6af1-401d-8572-1ebb2df5f93b", 3, 0, 0.0, 345.6666666666667, 296, 443, 298.0, 443.0, 443.0, 443.0, 0.054975261132490384, 0.03534379581271761, 0.03525431784863478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0262bc07-6362-4dfb-aaeb-a408900b8cc7", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 112.3125, 105, 118, 112.0, 116.6, 118.0, 118.0, 0.08724147896117208, 0.06483473192329293, 0.04379113299418208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 126.37500000000001, 109, 337, 111.5, 184.40000000000015, 337.0, 337.0, 0.08723957623375844, 0.023343402234423646, 0.049753820820815364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 137.1875, 104, 328, 111.0, 322.4, 328.0, 328.0, 0.08723719794120213, 0.023513151007589637, 0.051285930820902034], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1062.5652173913045, 308, 2119, 1043.0, 1771.4, 2056.599999999999, 2119.0, 0.09998913161612867, 0.031042821432452992, 0.045112283990870555], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 152.87499999999997, 105, 343, 112.5, 331.8, 343.0, 343.0, 0.08724052758709058, 0.023514048451208008, 0.05137308411622619], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.930232558139537, 0.6721433905899925], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 4.651162790697675, 0.14936519790888722], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 4.651162790697675, 0.14936519790888722], "isController": false}, {"data": ["401/Unauthorized", 30, 69.76744186046511, 2.2404779686333085], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1339, 43, "401/Unauthorized", 30, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 26, "401/Unauthorized", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
